# wangyifan-design (Astro skeleton)

An Astro rewrite of the legacy multi-page HTML portfolio at
[`wangyifan-design.github.io`](https://github.com/wangyifan-design/wangyifan-design.github.io).

This is a **migration skeleton**, not a finished product. The home / about /
chat / play pages are fully migrated and rendered through a shared
`BaseLayout`. Two project pages (Rockhood, Heidegger) live as MDX in the new
content collection as a working pattern. The remaining nine project pages stay
as plain HTML in `public/` so existing links keep working — migrate them into
MDX one at a time.

## Quick start

The new project lives next to the original repo:

```
~/Documents/
├── wangyifan-design.github.io/      ← your existing repo
└── wangyifan-design-astro/          ← this project
```

```bash
cd ~/Documents/wangyifan-design-astro
npm install          # install dependencies (~1 min)
npm run setup        # copy images / videos / legacy HTML from the old repo
npm run dev          # http://localhost:4321
```

If your legacy repo lives somewhere else, edit `LEGACY=...` near the top of
`scripts/setup-assets.sh`.

## What got migrated

| Page             | Status          | Where                                              |
| ---------------- | --------------- | -------------------------------------------------- |
| `/`              | ✅ Astro         | `src/pages/index.astro`                            |
| `/about/`        | ✅ Astro         | `src/pages/about.astro`                            |
| `/chat/`         | ✅ Astro         | `src/pages/chat.astro`                             |
| `/play/`         | ✅ Astro         | `src/pages/play.astro`                             |
| `/projects/rockhood/`  | ✅ MDX     | `src/content/projects/rockhood.mdx`                |
| `/projects/heidegger/` | ✅ MDX     | `src/content/projects/heidegger.mdx`               |
| `/livingjiagu.html` and 8 others | ⏳ Legacy HTML | `public/*.html` (copied by `npm run setup`) |

## Project layout

```
wangyifan-design-astro/
├── astro.config.mjs        # MDX + sitemap, directory-format URLs
├── package.json
├── scripts/setup-assets.sh # copies images/videos/legacy HTML from old repo
├── public/                 # static files served from /
│   └── js/                 # script.js + dog.js, copied as-is from legacy
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro       # head/meta/nav/footer/scripts wrapped in one place
│   ├── components/
│   │   ├── Nav.astro              # top nav
│   │   ├── SiteFooter.astro       # email + LinkedIn footer
│   │   ├── DogHero.astro          # the cursor-tracking dog face on the home page
│   │   ├── ChatBox.astro          # AI chat widget (used on home + /chat/)
│   │   └── ProjectCard.astro      # tile in the home-page featured grid
│   ├── pages/
│   │   ├── index.astro            # home
│   │   ├── about.astro
│   │   ├── chat.astro
│   │   ├── play.astro
│   │   └── projects/
│   │       └── [slug].astro       # template for every MDX project
│   ├── content/
│   │   └── projects/*.mdx         # one .mdx file per case study
│   ├── content.config.ts          # collection schema (frontmatter validation)
│   ├── data/
│   │   ├── featuredWork.ts        # home-page Featured Work list
│   │   └── play.ts                # /play/ items
│   └── styles/                    # CSS, imported by Astro (auto-bundled + hashed)
└── tsconfig.json
```

## How the migration is structured

**One layout, no more duplication.** The shared head / GA tag / nav / footer
live in `BaseLayout.astro`. Each page passes in its title, description, OG
image, and a `pageType` that gets set as `<body data-page="...">` so existing
CSS selectors like `body[data-page="home"]` keep working.

**Project pages are content, not code.** Each case study is an `.mdx` file
under `src/content/projects/`. Its frontmatter drives the meta table
(role / company / year / location / awards), and the MDX body becomes the
long-form `project-content` section. Adding a new project means: write an MDX
file, link it from `src/data/featuredWork.ts`.

**Legacy CSS preserved.** Existing `base.css`, `layout.css`, `components.css`,
`index.css`, `detail.css`, `play.css`, `dog.css`, and an extracted `about.css`
all live in `src/styles/` and get imported by the layouts/pages that need
them. Visually the new site should look identical to the legacy one.

**Legacy JS preserved.** `script.js` and `dog.js` are copied verbatim into
`public/js/` and loaded globally via `BaseLayout`. The chat / cursor / mobile
nav / page-transition behaviors all work the same way they did before.

## Adding a new project

1. Create `src/content/projects/my-project.mdx`. Use `rockhood.mdx` as a
   template — copy its frontmatter shape.
2. Add an entry to `src/data/featuredWork.ts` pointing to
   `/projects/my-project/`.
3. (Once you're happy) delete the legacy `public/my-project.html` so the new
   URL takes precedence.

## Known caveats / what's *not* done yet

- **No image optimization yet.** Images are loaded straight from `public/img/`
  at original resolution. Switching `<img>` to Astro's `<Image>` component
  (auto-AVIF/WebP, responsive `srcset`) is the highest-leverage next step.
- **Google Fonts via CDN.** Self-hosting Poppins + EB Garamond is a free
  performance win for a follow-up.
- **Chat backend (`api/assistant.js`)** is unchanged — see "Deployment" below.
- **9 project pages still legacy HTML.** Migrate them into MDX when you can.
- **No View Transitions yet.** Easy add later via `import { ClientRouter }
  from 'astro:transitions'` in `BaseLayout`.

## Deployment

GitHub Pages does **not** support the `api/` serverless function. Two options:

1. **Vercel (recommended).** Connect this repo to Vercel; static pages and the
   `api/assistant.js` function both deploy from one place. Free tier is
   plenty.
2. **GitHub Pages.** Add a workflow to build (`npm run build`) and publish the
   `dist/` folder. The chat will need a separate host for the API (Vercel /
   Cloudflare Workers / etc.).

For now the dev server (`npm run dev`) renders everything locally.

## Useful commands

```bash
npm run dev      # http://localhost:4321 with HMR
npm run build    # produce a static site in dist/
npm run preview  # serve dist/ for a final look before deploy
npm run setup    # re-run if you change source images in the legacy repo
```
