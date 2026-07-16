export type PlayCategory =
  | 'books'
  | 'identity'
  | 'posters'
  | 'illustration'
  | 'three-d'
  | 'digital';

export interface PlayMedia {
  src: string;
  alt: string;
}

export interface PlayProject {
  title: string;
  type: string;
  media: PlayMedia[];
}

export interface PlayFloor {
  id: PlayCategory;
  number: string;
  name: string;
  description: string;
  signStyle: 'book' | 'round' | 'vertical' | 'cloud' | 'cube' | 'screen';
  projects: PlayProject[];
}

export const playFloors: PlayFloor[] = [
  {
    id: 'books',
    number: '06',
    name: 'Books & Editorial',
    description: 'Books, print and information design',
    signStyle: 'book',
    projects: [
      { title: "Redbang City Map (Xi'an)", type: 'information design', media: [{ src: "/img/play/redbang city map (xi'an).jpg", alt: "Redbang city map of Xi'an" }] },
      { title: 'Chinese Stamp Designer — Chen Nan', type: 'editorial', media: [{ src: '/img/play/Chinese Stamp Designer - Chen Nana.jpg', alt: 'Chinese stamp designer editorial project' }] },
      { title: 'Chinese Animal Art', type: 'book', media: [{ src: '/img/play/zoobook.jpg', alt: 'Chinese Animal Art book' }] },
      {
        title: 'Design Thinking & Methodology', type: 'book & identity', media: [
          { src: '/img/play/designthinking.jpg', alt: 'Design Thinking and Methodology book' },
          { src: '/img/play/dtm.jpg', alt: 'Design Thinking and Methodology identity' },
        ]
      },
    ],
  },
  {
    id: 'identity',
    number: '05',
    name: 'Identity & Logos',
    description: 'Symbols, typography and visual systems',
    signStyle: 'round',
    projects: [
      { title: 'Digital Oracle Bone Script Exhibition', type: 'typography', media: [{ src: '/img/play/exhibition.jpg', alt: 'Digital oracle bone script exhibition' }] },
      { title: 'Plant Atlas', type: 'identity', media: [{ src: '/img/play/plants.jpg', alt: 'Plant Atlas identity' }] },
      { title: 'Drama Festival', type: 'identity', media: [{ src: '/img/play/philosophy.gif', alt: 'Drama Festival identity' }] },
      { title: 'New Year Red Bag', type: 'print', media: [{ src: '/img/play/new year red bag.jpg', alt: 'New Year red bag print design' }] },

    ],
  },
  {
    id: 'posters',
    number: '04',
    name: 'Posters & Events',
    description: 'Posters, exhibitions and event visuals',
    signStyle: 'vertical',
    projects: [
      { title: 'Art Criticism', type: 'event visual', media: [{ src: '/img/play/artcriticism.jpg', alt: 'Art Criticism event visual' }] },
      { title: 'Rockhood', type: 'poster', media: [{ src: '/img/play/rockhood xframe.png', alt: 'Rockhood poster' }] },
      {
        title: 'Above the Body', type: 'poster series', media: [
          { src: '/img/play/above the body-1.jpg', alt: 'Above the Body poster one' },
          { src: '/img/play/above the body-2.jpg', alt: 'Above the Body poster two' },
        ]
      },
      {
        title: 'The Second Pioneer Forum', type: 'event visual', media: [
          { src: '/img/play/lightbox.jpg', alt: 'The Second Pioneer Forum lightbox' },
          { src: '/img/play/poster.jpg', alt: 'The Second Pioneer Forum poster' },
        ]
      },
    ],
  },
  {
    id: 'illustration',
    number: '03',
    name: 'Illustration & Art',
    description: 'Drawing, painting and personal image-making',
    signStyle: 'cloud',
    projects: [
      { title: 'Eco-vase', type: ' illustration', media: [{ src: '/img/play/Eco-vase.png', alt: 'Eco-vase illustration cat' },{src: '/img/play/Eco-vase-2.png', alt: 'Eco-vase illustration dog'}] },
      { title: 'Beijing Memories', type: 'illustration', media: [{ src: '/img/play/zhenzhen.png', alt: 'Beijing Memories illustration' }] },
      { title: 'Hello California', type: 'illustration', media: [{ src: '/img/rockhood/california.png', alt: 'Hello California illustration' }] },
      { title: 'Zhenzhen', type: 'acrylic', media: [{ src: '/img/play/zhenzhen-2025.jpg', alt: 'Zhenzhen acrylic painting' }] },
      { title: 'History', type: 'acrylic', media: [{ src: '/img/play/history.jpg', alt: 'History acrylic painting' }] },
      { title: 'Apple', type: 'crayon', media: [{ src: '/img/play/apple.mp4', alt: 'Apple crayon animation' }] },
      { title: 'D&R', type: 'stickers', media: [{ src: '/img/play/stickers.jpg', alt: 'D&R sticker collection' }] },

    ],
  },
  {
    id: 'three-d',
    number: '02',
    name: 'Characters & 3D',
    description: 'Characters, motion and dimensional experiments',
    signStyle: 'cube',
    projects: [
      { title: 'Fan', type: '3D experiment', media: [{ src: '/img/play/fan.mp4', alt: 'Fan 3D experiment' }] },
      { title: 'Benben Costaco Mascot', type: 'character identity', media: [{ src: '/img/play/benben.png', alt: 'Benben Costaco mascot' }] },

    ],
  },
  {
    id: 'digital',
    number: '01',
    name: 'Digital & Interactive',
    description: 'UX, interactive play and digital experiences',
    signStyle: 'screen',
    projects: [
      { title: 'Light Up Tsinghua Campus', type: 'UX design', media: [{ src: '/img/play/lightup.jpg', alt: 'Light Up Tsinghua Campus UX design' }] },
      { title: 'Buddha Bless', type: 'interactive game', media: [{ src: '/img/play/buddha.jpg', alt: 'Buddha Bless interactive game' }] },
      { title: 'Craftopia', type: 'storyboard', media: [{ src: '/img/play/craftopia.jpg', alt: 'Craftopia storyboard' }] },

    ],
  },
];

// Kept for the legacy /play-city route while the main /play page uses floors.
export interface PlayItem {
  image: string;
  alt: string;
  labels: string[];
  district: 'library' | 'studio' | 'lab';
}

export const playItems: PlayItem[] = playFloors.flatMap((floor) =>
  floor.projects.flatMap((project) => project.media.map((media) => ({
    image: media.src,
    alt: media.alt,
    labels: [project.title, project.type],
    district: floor.id === 'books' ? 'library' : floor.id === 'digital' || floor.id === 'three-d' ? 'lab' : 'studio',
  }))),
);
