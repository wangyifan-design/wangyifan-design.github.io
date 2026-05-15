// Home page Featured Work list.
//
// Only the home-tile-specific overrides live here:
//   - which projects to show
//   - which cover image / video to use on the tile (often different from
//     the full-bleed `hero` on the project page — e.g. an animated video
//     vs. a static portrait crop)
//   - optional alt text
//
// `title` and `year` are NOT duplicated here — they come from the MDX
// frontmatter via the content collection (see src/pages/index.astro).
// That way editing src/content/projects/<slug>.mdx automatically
// updates the home page; nothing to keep in sync.
//
// Sort order on the home page is "newest first" (descending `year`).
// Ties are broken by the optional `order` field in the MDX frontmatter
// (lower number = listed earlier within the same year). The order of
// entries in THIS file is therefore irrelevant for rendering.

export interface FeaturedOverride {
  /** matches the filename in src/content/projects/<slug>.mdx */
  slug: string;
  /** path under /public (image or video) */
  cover: string;
  /** alt text for image covers */
  alt?: string;
  /** true if `cover` is a video file (autoplay, muted, loop) */
  video?: boolean;
}

export const featuredOverrides: FeaturedOverride[] = [
  { slug: 'rockhood',    cover: '/img/project-1.png',         alt: 'Rockhood.ai project cover' },
  { slug: 'book-design', cover: '/img/book-design/cover.jpg', alt: 'The Central Asian Cookbook project cover' },
  { slug: 'heidegger',   cover: '/videos/cover1.mp4',         video: true },
  { slug: 'livingjiagu', cover: '/videos/cover5.mp4',         video: true },
  { slug: 'virtualzoo',  cover: '/img/project-2.jpg',         alt: 'Virtual Zoo project cover' },
  { slug: 'redpacket',   cover: '/img/project-9.jpg',         alt: 'Bone Script Red Packet project cover' },
  { slug: 'patapata',    cover: '/videos/cover4.mp4',         video: true },
  { slug: 'poster',      cover: '/img/project-3.jpg',         alt: 'Popular Phrase project cover' },
  { slug: 'ram',         cover: '/img/project-8.jpg',         alt: 'The mascot of RAM project cover' },
  { slug: 'bird',        cover: '/img/project-6.jpg',         alt: 'Online Museum of Bird and Insect Pattern project cover' },
];
