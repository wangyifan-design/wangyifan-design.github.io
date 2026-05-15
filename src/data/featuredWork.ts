// Featured work shown on the home page.
// `href` matches an MDX project slug under src/content/projects/.
export interface FeaturedItem {
  href: string;
  title: string;
  year: string | number;
  cover: string;      // path under /public
  alt?: string;
  video?: boolean;    // true if cover is a video
}

// TODO: Once it feels right, derive this list automatically from the
// content collection (sorted by frontmatter `order`) instead of hardcoding.
export const featuredWork: FeaturedItem[] = [
  { href: '/projects/rockhood/',   title: 'Rockhood.ai',                              year: 2025, cover: '/img/project-1.png', alt: 'Rockhood.ai project cover' },
  { href: '/projects/book-design/',title: 'Book Design',                              year: 2024, cover: '/img/book-design/cover.jpg', alt: 'Book design project cover' },
  { href: '/projects/heidegger/',  title: 'Heidegger’s Heaps of Brocade and Ash',     year: 2023, cover: '/videos/cover1.mp4', video: true },
  { href: '/projects/livingjiagu/',title: 'Living Jiagu',                              year: 2019, cover: '/videos/cover5.mp4', video: true },
  { href: '/projects/virtualzoo/', title: 'Shengqinyuan - Virtual Zoo',                year: 2019, cover: '/img/project-2.jpg', alt: 'Virtual Zoo project cover' },
  { href: '/projects/redpacket/',  title: 'Bone Script Red Packet',                    year: 2018, cover: '/img/project-9.jpg', alt: 'Bone Script Red Packet project cover' },
  { href: '/projects/patapata/',   title: 'Philosophy Drama Festival',                 year: 2024, cover: '/videos/cover4.mp4', video: true },
  { href: '/projects/poster/',     title: 'Popular Phrase',                            year: 2023, cover: '/img/project-3.jpg', alt: 'Popular Phrase project cover' },
  { href: '/projects/ram/',        title: 'The mascot of RAM',                         year: 2022, cover: '/img/project-8.jpg', alt: 'The mascot of RAM project cover' },
  { href: '/projects/bird/',       title: 'Online Museum of Bird and Insect Pattern',  year: 2020, cover: '/img/project-6.jpg', alt: 'Online Museum of Bird and Insect Pattern project cover' },
];
