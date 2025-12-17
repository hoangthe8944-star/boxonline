import { Play, Clock, History } from 'lucide-react';
import type { SongApp } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RecentlyPlayedPageProps {
  onPlaySong: (song: SongApp) => void;
}

export function RecentlyPlayedPage({ onPlaySong }: RecentlyPlayedPageProps) {
  // Mock data for recently played
  const recentSongs: SongApp[] = [
    {
      id: 'r1',
      title: 'Midnight City',
      artist: 'M83',
      album: 'Hurry Up, We\'re Dreaming',
      duration: '4:03',
      coverUrl: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'r2',
      title: 'Save Your Tears',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:35',
      coverUrl: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzY0NDEwNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'r3',
      title: 'Dreams',
      artist: 'Fleetwood Mac',
      album: 'Rumours',
      duration: '4:17',
      coverUrl: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZHxlbnwxfHx8fDE3NjQ0MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'r4',
      title: 'Get Lucky',
      artist: 'Daft Punk',
      album: 'Random Access Memories',
      duration: '6:09',
      coverUrl: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'r5',
      title: 'Take On Me',
      artist: 'a-ha',
      album: 'Hunting High and Low',
      duration: '3:45',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpY3xlbnwxfHx8fDE3NjQ0MTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'r6',
      title: 'Africa',
      artist: 'Toto',
      album: 'Toto IV',
      duration: '4:55',
      coverUrl: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZHxlbnwxfHx8fDE3NjQ0MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'r7',
      title: 'Billie Jean',
      artist: 'Michael Jackson',
      album: 'Thriller',
      duration: '4:54',
      coverUrl: 'https://images.unsplash.com/photo-1701506516420-3ef4b27413c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbmlnaHR8ZW58MXx8fHwxNzY0NDgzMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'r8',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: 'Divide',
      duration: '3:53',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpY3xlbnwxfHx8fDE3NjQ0MTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="p-4 sm:p-8 bg-gradient-to-b from-orange-800/40 to-blue-900/20 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-2xl flex items-center justify-center flex-shrink-0 animate-in zoom-in duration-500">
          <History className="w-16 h-16 text-white" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-200 mb-2">Thư viện</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-white tracking-tight">
            Đã phát gần đây
          </h1>
          <p className="text-blue-200 max-w-lg">
            Những giai điệu bạn đã thưởng thức trong thời gian qua.
          </p>
        </div>
      </div>

      {/* Song List */}
      <div className="flex-1 px-4 sm:px-8 py-8">
        <div className="space-y-1">
          {recentSongs.map((song, index) => (
            <div 
              key={song.id}
              onClick={() => onPlaySong(song)}
              className="group flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="w-8 text-center text-blue-300 group-hover:text-white">
                {index + 1}
              </div>
              
              <ImageWithFallback 
                src={song.coverUrl} 
                alt={song.title}
                className="w-12 h-12 rounded object-cover shadow-sm flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col justify-center">
                  <span className="font-medium text-white truncate group-hover:text-cyan-300 transition-colors">
                    {song.title}
                  </span>
                  <span className="text-sm text-blue-300 truncate group-hover:text-white/70">
                    {song.artist}
                  </span>
                </div>
                <div className="hidden sm:flex items-center text-sm text-blue-300 truncate">
                  {song.album}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-blue-300 w-12 text-right">
                  {song.duration}
                </span>
                <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all">
                  <Play className="w-3 h-3 ml-0.5" fill="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
