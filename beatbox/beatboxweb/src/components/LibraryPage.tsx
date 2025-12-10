import { Music, Heart, Clock, ListMusic } from 'lucide-react';
import type { Song } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LibraryPageProps {
  onPlaySong: (song: Song) => void;
}

export function LibraryPage({ onPlaySong }: LibraryPageProps) {
  const likedSongs: Song[] = [
    {
      id: 'l1',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      duration: '3:54',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpY3xlbnwxfHx8fDE3NjQ0MTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'l2',
      title: 'Someone Like You',
      artist: 'Adele',
      album: '21',
      duration: '4:45',
      cover: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzY0NDEwNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'l3',
      title: 'Wonderwall',
      artist: 'Oasis',
      album: "(What's the Story) Morning Glory?",
      duration: '4:18',
      cover: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZHxlbnwxfHx8fDE3NjQ0MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'l4',
      title: 'Summertime',
      artist: 'Ella Fitzgerald',
      album: 'Ella and Louis',
      duration: '4:11',
      cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWN8ZW58MXx8fHwxNzY0Mzc2NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'l5',
      title: 'One More Time',
      artist: 'Daft Punk',
      album: 'Discovery',
      duration: '5:20',
      cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'l6',
      title: 'Rolling in the Deep',
      artist: 'Adele',
      album: '21',
      duration: '3:48',
      cover: 'https://images.unsplash.com/photo-1701506516420-3ef4b27413c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbmlnaHR8ZW58MXx8fHwxNzY0NDgzMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'l7',
      title: 'Thinking Out Loud',
      artist: 'Ed Sheeran',
      album: 'x',
      duration: '4:41',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpY3xlbnwxfHx8fDE3NjQ0MTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'l8',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      album: 'Led Zeppelin IV',
      duration: '8:02',
      cover: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZHxlbnwxfHx8fDE3NjQ0MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const categories = [
    {
      name: 'Bài hát yêu thích',
      icon: Heart,
      count: likedSongs.length,
      color: 'from-pink-500 to-rose-600',
    },
    {
      name: 'Playlists',
      icon: ListMusic,
      count: 12,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Albums',
      icon: Music,
      count: 8,
      color: 'from-purple-500 to-blue-600',
    },
    {
      name: 'Đã phát gần đây',
      icon: Clock,
      count: 24,
      color: 'from-green-500 to-teal-600',
    },
  ];

  return (
    <div className="px-8 py-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="mb-2">Thư viện của bạn</h2>
        <p className="text-blue-300">Tất cả âm nhạc bạn yêu thích ở một nơi</p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.name}
              className="bg-gradient-to-br from-blue-900/40 to-cyan-800/20 backdrop-blur rounded-lg p-6 hover:from-blue-800/60 hover:to-cyan-700/40 transition-all group text-left"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <p className="mb-1">{category.name}</p>
              <p className="text-sm text-blue-300">{category.count} mục</p>
            </button>
          );
        })}
      </div>

      {/* Liked Songs List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h3>Bài hát yêu thích</h3>
              <p className="text-sm text-blue-300">{likedSongs.length} bài hát</p>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[50px_1fr_1fr_100px] gap-4 px-4 py-2 text-sm text-blue-300 border-b border-blue-700/30">
          <span>#</span>
          <span>Tên bài hát</span>
          <span>Album</span>
          <span className="text-right">Thời lượng</span>
        </div>

        {/* Songs List */}
        <div className="space-y-1">
          {likedSongs.map((song, index) => (
            <button
              key={song.id}
              onClick={() => onPlaySong(song)}
              className="w-full grid grid-cols-[50px_1fr_1fr_100px] gap-4 px-4 py-3 rounded-lg hover:bg-blue-800/30 transition-all group items-center"
            >
              <span className="text-blue-300 group-hover:text-white">{index + 1}</span>
              <div className="flex items-center gap-3 min-w-0">
                <ImageWithFallback
                  src={song.cover}
                  alt={song.title}
                  className="w-10 h-10 rounded shadow-lg"
                />
                <div className="text-left min-w-0">
                  <p className="truncate group-hover:text-cyan-300 transition-colors">{song.title}</p>
                  <p className="text-sm text-blue-300 truncate">{song.artist}</p>
                </div>
              </div>
              <p className="text-blue-300 text-left truncate">{song.album}</p>
              <p className="text-blue-300 text-right">{song.duration}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
