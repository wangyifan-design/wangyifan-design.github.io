// Home page Featured Work list.
//
// Only the home-tile-specific overrides live here:
//   - which projects to show
//   - which static cover image to use on the tile (often different from
//     the full-bleed `hero` on the project page)
//   - an optional video enhancement that plays above the static cover
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
  /** static thumbnail under /public; also used as the video poster/fallback */
  cover: string;
  /** alt text for the static thumbnail */
  alt?: string;
  /** optional video under /public; enhances the cover after playback starts */
  video?: string;
}

export const featuredOverrides: FeaturedOverride[] = [
  { slug: 'rockhood',    cover: '/img/project-1.png',         alt: 'Rockhood.ai project cover' },
  { slug: 'book-design', cover: '/img/book-design/cover.jpg', alt: 'The Central Asian Cookbook project cover' },
  {
    slug: 'heidegger',
    cover: '/img/heidegger/1-3.webp',
    video: '/videos/cover1.mp4',
    alt: "Heidegger's Heaps of Brocade and Ash project cover",
  },
  {
    slug: 'livingjiagu',
    cover: '/img/livingjiagu/0.webp',
    video: '/videos/cover5.mp4',
    alt: 'Living Jiagu project cover',
  },
  { slug: 'virtualzoo',  cover: '/img/project-2.jpg',         alt: 'Virtual Zoo project cover' },
  { slug: 'redpacket',   cover: '/img/project-9.jpg',         alt: 'Bone Script Red Packet project cover' },
  {
    slug: 'patapata',
    cover: '/img/patapata/cover.webp',
    video: '/videos/cover4.mp4',
    alt: 'Philosophy Drama Festival project cover',
  },
  { slug: 'poster',      cover: '/img/project-3.jpg',         alt: 'Popular Phrase project cover' },
  { slug: 'ram',         cover: '/img/project-8.jpg',         alt: 'The mascot of RAM project cover' },
  { slug: 'bird',        cover: '/img/project-6.jpg',         alt: 'Online Museum of Bird and Insect Pattern project cover' },
];
