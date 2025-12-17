import { Play, Plus, Search, Grid, List, Music, User, Globe, Lock } from 'lucide-react';
import type { SongApp, Playlist } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from './ui/button';

interface PlaylistsPageProps {
  onPlaySong: (song: SongApp) => void;
  onCreateClick?: () => void;
}

export function PlaylistsPage({ onPlaySong, onCreateClick }: PlaylistsPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const allPlaylists: (Playlist & { owner: string; isPublic: boolean; updatedAt: string })[] = [
    {
      id: 'p1',
      name: 'Workout Mix',
      cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 32,
      description: 'Năng lượng cho mọi buổi tập luyện',
      owner: 'Me',
      isPublic: true,
      updatedAt: '2023-11-20'
    },
    {
      id: 'p2',
      name: 'Road Trip',
      cover: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZHxlbnwxfHx8fDE3NjQ0MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 45,
      description: 'Những bài hát tuyệt vời cho chuyến đi',
      owner: 'Me',
      isPublic: false,
      updatedAt: '2023-12-01'
    },
    {
      id: 'p3',
      name: 'Study Focus',
      cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWN8ZW58MXx8fHwxNzY0Mzc2NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 28,
      description: 'Nhạc nền hoàn hảo cho học tập',
      owner: 'Me',
      isPublic: true,
      updatedAt: '2023-10-15'
    },
    {
      id: 'p4',
      name: 'Party Hits',
      cover: 'https://images.unsplash.com/photo-1701506516420-3ef4b27413c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbmlnaHR8ZW58MXx8fHwxNzY0NDgzMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 52,
      description: 'Bùng nổ với những bản hit sôi động',
      owner: 'Spotify',
      isPublic: true,
      updatedAt: '2023-12-10'
    },
    {
      id: 'p5',
      name: 'Acoustic Sessions',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpY3xlbnwxfHx8fDE3NjQ0MTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 24,
      description: 'Unplugged và nguyên bản',
      owner: 'Spotify',
      isPublic: true,
      updatedAt: '2023-09-05'
    },
    {
      id: 'p6',
      name: 'Rainy Day',
      cover: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzY0NDEwNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      songCount: 36,
      description: 'Thư giãn trong những ngày mưa',
      owner: 'Me',
      isPublic: true,
      updatedAt: '2023-11-30'
    },
  ];

  const filteredPlaylists = allPlaylists
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === 'count') return b.songCount - a.songCount;
      return 0;
    });

  const myPlaylists = filteredPlaylists.filter(p => p.owner === 'Me');
  const publicPlaylists = filteredPlaylists.filter(p => p.isPublic);

  const PlaylistGridItem = ({ playlist }: { playlist: typeof allPlaylists[0] }) => (
    <div className="bg-gradient-to-b from-blue-900/30 to-transparent backdrop-blur rounded-lg p-3 sm:p-4 hover:bg-blue-800/40 transition-all cursor-pointer group flex flex-col h-full">
      <div className="relative mb-3 sm:mb-4 aspect-square w-full">
        <ImageWithFallback
          src={playlist.cover}
          alt={playlist.name}
          className="w-full h-full object-cover rounded-lg shadow-xl"
        />
        <div className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg shadow-cyan-500/30">
          <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" fill="white" />
        </div>
        {playlist.owner === 'Me' && !playlist.isPublic && (
          <div className="absolute top-2 left-2 p-1.5 rounded-full bg-black/40 backdrop-blur">
            <Lock className="w-3 h-3 text-white/70" />
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0">
        <h3 className="font-semibold text-white truncate mb-1">{playlist.name}</h3>
        <p className="text-sm text-blue-200 line-clamp-2 mb-2 h-10">{playlist.description}</p>
      </div>
      <div className="flex items-center justify-between text-xs text-blue-300 mt-2 pt-3 border-t border-white/5">
        <span>{playlist.songCount} songs</span>
        <span className="flex items-center gap-1">
          {playlist.owner === 'Me' ? <User className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
          {playlist.owner}
        </span>
      </div>
    </div>
  );

  const PlaylistListItem = ({ playlist }: { playlist: typeof allPlaylists[0] }) => (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
        <ImageWithFallback
          src={playlist.cover}
          alt={playlist.name}
          className="w-full h-full object-cover rounded-md shadow-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity rounded-md">
           <Play className="w-6 h-6 text-white" fill="white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-white truncate text-base sm:text-lg">{playlist.name}</h3>
          <p className="text-sm text-blue-200 truncate">{playlist.description}</p>
        </div>
        <div className="hidden md:flex items-center text-sm text-blue-300 gap-6">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            {playlist.songCount} bài hát
          </div>
          <div className="flex items-center gap-2">
            {playlist.owner === 'Me' ? <User className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            {playlist.owner}
          </div>
          <div className="ml-auto">
             {new Date(playlist.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">Thư viện Playlist</h2>
            <p className="text-blue-300">Quản lý và khám phá các bộ sưu tập nhạc của bạn</p>
          </div>
          <Button 
            onClick={onCreateClick}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo Playlist Mới
          </Button>
        </div>

        {/* Toolbar */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
            <Input 
              placeholder="Tìm kiếm playlist..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-blue-300/50"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-black/20 border-white/10 text-blue-200">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent className="bg-blue-950 border-blue-800 text-blue-100">
                <SelectItem value="name">Tên (A-Z)</SelectItem>
                <SelectItem value="date">Mới nhất</SelectItem>
                <SelectItem value="count">Số lượng bài hát</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center bg-black/20 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-cyan-500 text-black shadow-sm' : 'text-blue-300 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-cyan-500 text-black shadow-sm' : 'text-blue-300 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-blue-300">Tất cả</TabsTrigger>
          <TabsTrigger value="mine" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-blue-300">Của tôi</TabsTrigger>
          <TabsTrigger value="public" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-blue-300">Công khai</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredPlaylists.map(playlist => (
                <PlaylistGridItem key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPlaylists.map(playlist => (
                <PlaylistListItem key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine" className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {myPlaylists.map(playlist => (
                <PlaylistGridItem key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {myPlaylists.map(playlist => (
                <PlaylistListItem key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="public" className="space-y-4">
           {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {publicPlaylists.map(playlist => (
                <PlaylistGridItem key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {publicPlaylists.map(playlist => (
                <PlaylistListItem key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
