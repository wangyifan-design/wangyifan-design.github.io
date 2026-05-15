# Book design assets

Drop your book images here using these filenames:

- `cover.jpg`  — square-ish thumbnail used on the home Featured Work tile
- `hero.jpg`   — wide/landscape full-bleed image at the top of the project page
                 (if you want hero == cover, just delete this file and remove
                 the `hero:` line from book-design.mdx's frontmatter)
- `p01.jpg` ... `p10.jpg` — individual interior pages in reading order
                 (every two consecutive files form one spread)

Want more pages? Add `p11.jpg`, `p12.jpg`, ... and update the `pages` array
in `src/content/projects/book-design.mdx` to match.

All files start as placeholder copies of existing portfolio images so the
page works out of the box; replace them with the real book photos.
