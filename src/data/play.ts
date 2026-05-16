// Play page tiles. Each item is just an image with one or two labels.
// Add new entries here — the page renders them automatically.
export interface PlayItem {
  image: string;        // path under /public, e.g. "/img/play/foo.jpg"
  alt: string;
  labels: string[];     // 1 or 2 short tags
}

export const playItems: PlayItem[] = [
  { image: "/img/play/redbang city map (xi'an).jpg", alt: 'map', labels: ["redbang city map (xi'an)"] },
  { image: '/img/play/Chinese Stamp Designer - Chen Nana.jpg', alt: 'stamp', labels: ['chinese stamp designer - chen nan', 'typography'] },
  { image: '/img/play/zoobook.jpg', alt: 'zoobook', labels: ['chinese animal art', 'book'] },
  { image: '/img/play/designthinking.jpg', alt: 'designthinking', labels: ['design thinking & methodology', 'book'] },
  { image: '/img/play/dtm.jpg', alt: 'dtm', labels: ['design thinking & methodology', 'logo'] },
  { image: '/img/play/artcriticism.jpg', alt: 'artcriticism', labels: ['artcriticism', 'event visual'] },
  { image: '/img/play/exhibition.jpg', alt: 'exhibition', labels: ['digital oracle bone script exhibition', 'typography'] },
  { image: '/img/play/zhenzhen.png', alt: 'memories', labels: ['Beijing memories', 'illustration'] },
  { image: '/img/play/rockhood xframe.png', alt: 'xframe', labels: ['rockhood', 'poster'] },
  { image: '/img/play/lightup.jpg', alt: 'lightup', labels: ['light up tsinghua campus', 'ux design'] },
  { image: '/img/rockhood/california.png', alt: 'California', labels: ['hello California', 'illustration'] },
  { image: '/img/play/benben.png', alt: 'benben', labels: ['benben costaco mascot', '3D'] },
  { image: '/img/play/zhenzhen-2025.jpg', alt: 'zhenzhen', labels: ['zhenzhen', 'acrylic'] },
  { image: '/img/play/craftopia.jpg', alt: 'craftopia', labels: ['craftopia', 'storyboard'] },
  { image: '/img/play/plants.jpg', alt: 'plants', labels: ['plant atlas', 'logo'] },
  { image: '/img/play/above the body-1.jpg', alt: 'body1', labels: ['above the body-1', 'poster'] },
  { image: '/img/play/philosophy.gif', alt: 'philosophy', labels: ['drama festival', 'logo'] },
  { image: '/img/play/above the body-2.jpg', alt: 'body2', labels: ['above the body-2', 'poster'] },
  { image: '/img/play/new year red bag.jpg', alt: 'newyear', labels: ['new year red bag', 'print'] },
  { image: '/img/play/fan.mp4', alt: 'fan', labels: ['fan', '3D'] },
  { image: '/img/play/stickers.jpg', alt: 'stickers', labels: ['d&r', 'stickers'] },
  { image: '/img/play/lightbox.jpg', alt: 'forum', labels: ['the second pioneer forum', 'event visual'] },
  { image: '/img/play/poster.jpg', alt: 'forum poster', labels: ['the second pioneer forum', 'event visual'] },
  { image: '/img/play/history.jpg', alt: 'history', labels: ['history', 'acrylic'] },
  { image: '/img/play/buddha.jpg', alt: 'buddha', labels: ['buddha bless', 'interactive game'] },
  { image: '/img/play/apple.mp4', alt: 'apple', labels: ['apple', 'crayon'] },
];
