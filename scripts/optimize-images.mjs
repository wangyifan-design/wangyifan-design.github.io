#!/usr/bin/env node
/**
 * One-shot image optimizer for the portfolio.
 *
 * Walks `public/img/`, processes JPG / JPEG / PNG with sharp:
 *   - downscales anything wider than MAX_WIDTH (keeps aspect ratio)
 *   - re-encodes JPG with mozjpeg quality 82
 *   - re-encodes PNG with palette quantization (transparent files only)
 *     or converts to JPG if fully opaque (PNG → JPG saves a lot)
 *   - generates a .webp sibling at quality 80
 *
 * GIFs are skipped (use ffmpeg to convert them to MP4/WebM separately).
 *
 * Reads from:   public/img/
 * Writes into:  public/img-optimized/  (mirrors original tree)
 *
 * Run:  node scripts/optimize-images.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve('public/img');
const OUT = path.resolve('public/img-optimized');
const MAX_WIDTH = 2400;
const JPG_QUALITY = 82;
const PNG_QUALITY = [70, 90]; // pngquant min, max
const WEBP_QUALITY = 80;

let totalIn = 0;
let totalOut = 0;
let touched = 0;
let skipped = 0;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full);
    } else if (e.isFile()) {
      await process(full);
    }
  }
}

function relOutPath(srcAbs, newExt) {
  const rel = path.relative(SRC, srcAbs);
  const out = path.join(OUT, rel);
  if (!newExt) return out;
  const parsed = path.parse(out);
  return path.join(parsed.dir, parsed.name + newExt);
}

async function process(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    skipped++;
    return;
  }

  const inStat = await fs.stat(file);
  const inSize = inStat.size;

  let img = sharp(file);
  const meta = await img.metadata();
  const needsResize = meta.width && meta.width > MAX_WIDTH;
  if (needsResize) {
    img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  // Decide target format. PNG → JPG if fully opaque (smaller).
  let targetExt = ext === '.png' ? '.png' : '.jpg';
  if (ext === '.png' && meta.hasAlpha !== true) {
    targetExt = '.jpg';
  }

  const outMain = relOutPath(file, targetExt);
  const outWebp = relOutPath(file, '.webp');
  await fs.mkdir(path.dirname(outMain), { recursive: true });

  // Main encode
  let pipeline = img.clone();
  if (targetExt === '.jpg') {
    pipeline = pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true });
  } else {
    pipeline = pipeline.png({
      quality: PNG_QUALITY[1],
      compressionLevel: 9,
      palette: true,
    });
  }
  await pipeline.toFile(outMain);

  // WebP sibling
  await img.clone().webp({ quality: WEBP_QUALITY }).toFile(outWebp);

  const outMainSize = (await fs.stat(outMain)).size;
  const outWebpSize = (await fs.stat(outWebp)).size;
  const outSize = outMainSize + outWebpSize;

  totalIn += inSize;
  totalOut += outSize;
  touched++;

  const rel = path.relative(SRC, file);
  console.log(
    `${(inSize / 1024).toFixed(0).padStart(7)} KB → ${(outMainSize / 1024)
      .toFixed(0)
      .padStart(6)} KB (+${(outWebpSize / 1024).toFixed(0)} KB webp)  ${rel}${needsResize ? '  [resized]' : ''}${
      ext === '.png' && targetExt === '.jpg' ? '  [PNG→JPG]' : ''
    }`
  );
}

console.log(`Scanning ${SRC} ...`);
await walk(SRC);

const savedMB = (totalIn - totalOut) / 1024 / 1024;
const inMB = totalIn / 1024 / 1024;
const outMB = totalOut / 1024 / 1024;
const pct = totalIn > 0 ? ((1 - totalOut / totalIn) * 100).toFixed(1) : '0';

console.log('');
console.log(`Processed: ${touched} files  (skipped ${skipped} non-image / GIF)`);
console.log(`Original total:  ${inMB.toFixed(1)} MB`);
console.log(`Optimized total: ${outMB.toFixed(1)} MB  (main + .webp combined)`);
console.log(`Saved:           ${savedMB.toFixed(1)} MB  (${pct}% reduction)`);
console.log(`Output written to: ${OUT}`);
