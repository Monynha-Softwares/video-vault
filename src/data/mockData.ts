export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  count: number;
}

export interface Video {
  id: string;
  youtube_id: string;
  title: string;
  description: string;
  channel_name: string;
  duration_seconds: number;
  thumbnail_url: string;
  language: string;
  category_id: string;
  submitted_by: string;
  created_at: string;
  view_count: number;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Tutoriais Antigos",
    slug: "tutoriais",
    icon: "📚",
    color: "tutorials",
    count: 234,
  },
  {
    id: "2",
    name: "Receitas Tradicionais",
    slug: "receitas",
    icon: "🍳",
    color: "recipes",
    count: 189,
  },
  {
    id: "3",
    name: "Educação",
    slug: "educacao",
    icon: "🎓",
    color: "education",
    count: 456,
  },
  {
    id: "4",
    name: "Memes Icônicos",
    slug: "memes",
    icon: "😂",
    color: "memes",
    count: 892,
  },
  {
    id: "5",
    name: "Música",
    slug: "musica",
    icon: "🎵",
    color: "music",
    count: 567,
  },
  {
    id: "6",
    name: "Cultura",
    slug: "cultura",
    icon: "🎭",
    color: "culture",
    count: 321,
  },
];

export const videos: Video[] = [
  {
    id: "1",
    youtube_id: "dQw4w9WgXcQ",
    title: "Never Gonna Give You Up - Rick Astley",
    description: "O clássico dos clássicos da internet. O meme que definiu uma era.",
    channel_name: "Rick Astley",
    duration_seconds: 213,
    thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    language: "EN",
    category_id: "4",
    submitted_by: "user1",
    created_at: "2024-01-15",
    view_count: 1500000000,
  },
  {
    id: "2",
    youtube_id: "kJQP7kiw5Fk",
    title: "Luis Fonsi - Despacito ft. Daddy Yankee",
    description: "Um dos vídeos mais vistos da história do YouTube.",
    channel_name: "Luis Fonsi",
    duration_seconds: 282,
    thumbnail_url: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    language: "ES",
    category_id: "5",
    submitted_by: "user2",
    created_at: "2024-01-14",
    view_count: 8200000000,
  },
  {
    id: "3",
    youtube_id: "9bZkp7q19f0",
    title: "PSY - GANGNAM STYLE",
    description: "O fenômeno coreano que quebrou a internet em 2012.",
    channel_name: "officialpsy",
    duration_seconds: 253,
    thumbnail_url: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    language: "KO",
    category_id: "4",
    submitted_by: "user3",
    created_at: "2024-01-13",
    view_count: 4900000000,
  },
  {
    id: "4",
    youtube_id: "hTWKbfoikeg",
    title: "Nirvana - Smells Like Teen Spirit",
    description: "O hino de uma geração que mudou o rock para sempre.",
    channel_name: "Nirvana",
    duration_seconds: 301,
    thumbnail_url: "https://img.youtube.com/vi/hTWKbfoikeg/maxresdefault.jpg",
    language: "EN",
    category_id: "5",
    submitted_by: "user4",
    created_at: "2024-01-12",
    view_count: 1800000000,
  },
  {
    id: "5",
    youtube_id: "JGwWNGJdvx8",
    title: "Ed Sheeran - Shape of You",
    description: "Um dos maiores hits da década de 2010.",
    channel_name: "Ed Sheeran",
    duration_seconds: 263,
    thumbnail_url: "https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg",
    language: "EN",
    category_id: "5",
    submitted_by: "user5",
    created_at: "2024-01-11",
    view_count: 6100000000,
  },
  {
    id: "6",
    youtube_id: "OPf0YbXqDm0",
    title: "Mark Ronson - Uptown Funk ft. Bruno Mars",
    description: "A música que dominou as paradas em 2015.",
    channel_name: "Mark Ronson",
    duration_seconds: 271,
    thumbnail_url: "https://img.youtube.com/vi/OPf0YbXqDm0/maxresdefault.jpg",
    language: "EN",
    category_id: "5",
    submitted_by: "user6",
    created_at: "2024-01-10",
    view_count: 4800000000,
  },
  {
    id: "7",
    youtube_id: "fJ9rUzIMcZQ",
    title: "Queen - Bohemian Rhapsody",
    description: "A obra-prima de Freddie Mercury que transcende gerações.",
    channel_name: "Queen Official",
    duration_seconds: 367,
    thumbnail_url: "https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg",
    language: "EN",
    category_id: "5",
    submitted_by: "user7",
    created_at: "2024-01-09",
    view_count: 1600000000,
  },
  {
    id: "8",
    youtube_id: "RgKAFK5djSk",
    title: "Wiz Khalifa - See You Again ft. Charlie Puth",
    description: "A emocionante homenagem a Paul Walker.",
    channel_name: "Wiz Khalifa",
    duration_seconds: 237,
    thumbnail_url: "https://img.youtube.com/vi/RgKAFK5djSk/maxresdefault.jpg",
    language: "EN",
    category_id: "5",
    submitted_by: "user8",
    created_at: "2024-01-08",
    view_count: 5700000000,
  },
];

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const formatViewCount = (count: number): string => {
  if (count >= 1000000000) {
    return `${(count / 1000000000).toFixed(1)}B`;
  }
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};
