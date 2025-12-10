import { Play } from 'lucide-react';
import type { Song, Playlist } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onPlaySong: (song: Song) => void;
}

export function HomePage({ onPlaySong }: HomePageProps) {
  const featuredPlaylists: Playlist[] = [
    {
      id: '1',
      name: 'Top Hits 2024',
      cover: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzY0NDEwNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 50,
      description: 'Những bài hát được nghe nhiều nhất năm 2024',
    },
    {
      id: '2',
      name: 'Chill Vibes',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpY3xlbnwxfHx8fDE3NjQ0MTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 35,
      description: 'Thư giãn với những giai điệu êm dịu',
    },
    {
      id: '3',
      name: 'Rock Classics',
      cover: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZHxlbnwxfHx8fDE3NjQ0MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 42,
      description: 'Những bản rock kinh điển của mọi thời đại',
    },
    {
      id: '4',
      name: 'Jazz Evening',
      cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWN8ZW58MXx8fHwxNzY0Mzc2NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 28,
      description: 'Tận hưởng buổi tối với nhạc jazz',
    },
    {
      id: '5',
      name: 'Electronic Beats',
      cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 38,
      description: 'Năng lượng với nhạc điện tử',
    },
    {
      id: '6',
      name: 'Night Concerts',
      cover: 'https://images.unsplash.com/photo-1701506516420-3ef4b27413c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbmlnaHR8ZW58MXx8fHwxNzY0NDgzMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 45,
      description: 'Live performances và concert recordings',
    },
  ];

  const recentlyPlayed: Song[] = [
    {
      id: 's1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:22',
      cover: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzY0NDEwNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 's2',
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      duration: '3:23',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpY3xlbnwxfHx8fDE3NjQ0MTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 's3',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      duration: '5:55',
      cover: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZHxlbnwxfHx8fDE3NjQ0MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 's4',
      title: 'Take Five',
      artist: 'Dave Brubeck',
      album: 'Time Out',
      duration: '5:24',
      cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWN8ZW58MXx8fHwxNzY0Mzc2NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 's5',
      title: 'Strobe',
      artist: 'Deadmau5',
      album: 'For Lack of a Better Name',
      duration: '10:37',
      cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="px-8 py-6 space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="mb-2">Chào buổi tối</h2>
        <p className="text-blue-300">Khám phá âm nhạc yêu thích của bạn</p>
      </div>

      {/* Quick Access */}
      <div>
        <h3 className="mb-4">Phát gần đây</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {recentlyPlayed.slice(0, 6).map((song) => (
            <button
              key={song.id}
              onClick={() => onPlaySong(song)}
              className="flex items-center gap-4 bg-gradient-to-r from-blue-900/40 to-cyan-800/20 backdrop-blur rounded-lg p-2 hover:bg-blue-800/50 transition-all group"
            >
              <ImageWithFallback
                src={song.cover}
                alt={song.title}
                className="w-16 h-16 rounded shadow-lg"
              />
              <div className="flex-1 text-left min-w-0">
                <p className="truncate">{song.title}</p>
                <p className="text-sm text-blue-300 truncate">{song.artist}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-cyan-500/30">
                <Play className="w-5 h-5 text-white" fill="white" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Playlists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3>Playlist nổi bật</h3>
          <button className="text-sm text-blue-300 hover:text-white transition-colors">
            Xem tất cả
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {featuredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gradient-to-b from-blue-900/30 to-transparent backdrop-blur rounded-lg p-4 hover:bg-blue-800/40 transition-all cursor-pointer group"
            >
              <div className="relative mb-4">
                <ImageWithFallback
                  src={playlist.cover}
                  alt={playlist.name}
                  className="w-full aspect-square object-cover rounded-lg shadow-xl"
                />
                <div className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg shadow-cyan-500/30">
                  <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                </div>
              </div>
              <p className="mb-2 truncate">{playlist.name}</p>
              <p className="text-sm text-blue-300 line-clamp-2">
                {playlist.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Songs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3>Đề xuất cho bạn</h3>
          <button className="text-sm text-blue-300 hover:text-white transition-colors">
            Xem thêm
          </button>
        </div>
        <div className="space-y-2">
          {recentlyPlayed.map((song, index) => (
            <button
              key={song.id}
              onClick={() => onPlaySong(song)}
              className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-blue-800/30 transition-all group"
            >
              <span className="text-blue-300 w-6 text-center">{index + 1}</span>
              <ImageWithFallback
                src={song.cover}
                alt={song.title}
                className="w-12 h-12 rounded shadow-lg"
              />
              <div className="flex-1 text-left min-w-0">
                <p className="truncate">{song.title}</p>
                <p className="text-sm text-blue-300 truncate">{song.artist}</p>
              </div>
              <p className="text-sm text-blue-300">{song.album}</p>
              <p className="text-sm text-blue-300 w-16 text-right">{song.duration}</p>
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-4 h-4 text-white" fill="white" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
