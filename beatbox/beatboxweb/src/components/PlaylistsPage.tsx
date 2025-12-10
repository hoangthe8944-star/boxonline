import { Play, Plus } from 'lucide-react';
import type { Song, Playlist } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PlaylistsPageProps {
  onPlaySong: (song: Song) => void;
}

export function PlaylistsPage({ onPlaySong }: PlaylistsPageProps) {
  const myPlaylists: Playlist[] = [
    {
      id: 'p1',
      name: 'Workout Mix',
      cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 32,
      description: 'Năng lượng cho mọi buổi tập luyện',
    },
    {
      id: 'p2',
      name: 'Road Trip',
      cover: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZHxlbnwxfHx8fDE3NjQ0MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 45,
      description: 'Những bài hát tuyệt vời cho chuyến đi',
    },
    {
      id: 'p3',
      name: 'Study Focus',
      cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWN8ZW58MXx8fHwxNzY0Mzc2NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 28,
      description: 'Nhạc nền hoàn hảo cho học tập',
    },
    {
      id: 'p4',
      name: 'Party Hits',
      cover: 'https://images.unsplash.com/photo-1701506516420-3ef4b27413c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbmlnaHR8ZW58MXx8fHwxNzY0NDgzMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 52,
      description: 'Bùng nổ với những bản hit sôi động',
    },
    {
      id: 'p5',
      name: 'Acoustic Sessions',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpY3xlbnwxfHx8fDE3NjQ0MTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 24,
      description: 'Unplugged và nguyên bản',
    },
    {
      id: 'p6',
      name: 'Rainy Day',
      cover: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzY0NDEwNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 36,
      description: 'Thư giãn trong những ngày mưa',
    },
  ];

  const playlistSongs: Song[] = [
    {
      id: 'ps1',
      title: 'Stronger',
      artist: 'Kanye West',
      album: 'Graduation',
      duration: '5:12',
      cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ps2',
      title: 'Titanium',
      artist: 'David Guetta ft. Sia',
      album: 'Nothing but the Beat',
      duration: '4:05',
      cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ps3',
      title: "Can't Hold Us",
      artist: 'Macklemore & Ryan Lewis',
      album: 'The Heist',
      duration: '4:18',
      cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ps4',
      title: 'Eye of the Tiger',
      artist: 'Survivor',
      album: 'Eye of the Tiger',
      duration: '4:04',
      cover: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZHxlbnwxfHx8fDE3NjQ0MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ps5',
      title: 'Lose Yourself',
      artist: 'Eminem',
      album: '8 Mile Soundtrack',
      duration: '5:26',
      cover: 'https://images.unsplash.com/photo-1701506516420-3ef4b27413c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbmlnaHR8ZW58MXx8fHwxNzY0NDgzMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="mb-2">Playlists của bạn</h2>
        <p className="text-blue-300">Tạo và quản lý các playlist của bạn</p>
      </div>

      {/* Create New Playlist */}
      <button className="w-full max-w-xs bg-gradient-to-r from-blue-900/40 to-cyan-800/20 backdrop-blur rounded-lg p-4 sm:p-6 hover:from-blue-800/60 hover:to-cyan-700/40 transition-all border-2 border-dashed border-blue-600/30 hover:border-cyan-500/50 group">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <p className="mb-1 text-sm sm:text-base">Tạo Playlist Mới</p>
            <p className="text-xs sm:text-sm text-blue-300">Bắt đầu playlist của riêng bạn</p>
          </div>
        </div>
      </button>

      {/* My Playlists Grid */}
      <div>
        <h3 className="mb-4">Tất cả playlists</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {myPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gradient-to-b from-blue-900/30 to-transparent backdrop-blur rounded-lg p-3 sm:p-4 hover:bg-blue-800/40 transition-all cursor-pointer group"
            >
              <div className="relative mb-3 sm:mb-4">
                <ImageWithFallback
                  src={playlist.cover}
                  alt={playlist.name}
                  className="w-full aspect-square object-cover rounded-lg shadow-xl"
                />
                <div className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg shadow-cyan-500/30">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" fill="white" />
                </div>
              </div>
              <p className="mb-2 truncate text-sm sm:text-base">{playlist.name}</p>
              <p className="text-xs sm:text-sm text-blue-300">
                {playlist.songCount} bài hát
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Added to Playlists */}
      <div>
        <h3 className="mb-4">Đã thêm gần đây</h3>
        <div className="space-y-2">
          {playlistSongs.map((song, index) => (
            <button
              key={song.id}
              onClick={() => onPlaySong(song)}
              className="w-full flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-blue-800/30 transition-all group"
            >
              <span className="text-blue-300 w-5 sm:w-6 text-center text-sm sm:text-base">{index + 1}</span>
              <ImageWithFallback
                src={song.cover}
                alt={song.title}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded shadow-lg flex-shrink-0"
              />
              <div className="flex-1 text-left min-w-0">
                <p className="truncate group-hover:text-cyan-300 transition-colors text-sm sm:text-base">{song.title}</p>
                <p className="text-xs sm:text-sm text-blue-300 truncate">{song.artist}</p>
              </div>
              <p className="text-xs sm:text-sm text-blue-300 hidden md:block truncate max-w-[200px]">
                {song.album}
              </p>
              <p className="text-xs sm:text-sm text-blue-300 w-12 sm:w-16 text-right flex-shrink-0">{song.duration}</p>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="white" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}