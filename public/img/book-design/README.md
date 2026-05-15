# Book design assets

Drop your book images here using these filenames:

Project-level (used by Astro routing / home page):
- `cover.jpg`  — used BOTH as the home Featured Work thumbnail AND
                 as the full-bleed hero at the top of the project page

Inside the BookViewer (the flip-through module):
- `book-front.jpg` — front cover of the actual book, shown as the
                     right page of the first spread
- `book-back.jpg`  — back cover, shown as the left page of the last spread
- `p01.jpg` ... `p10.jpg` — interior pages in reading order
                            (every two consecutive form one spread)

Want more interior pages? Add `p11.jpg`, `p12.jpg`, ... and update the
`pages` array in `src/content/projects/book-design.mdx` to match.

All files start as placeholder copies of existing portfolio images so
the page works out of the box; replace them with the real book photos.
