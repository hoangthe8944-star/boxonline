import { useState } from 'react';
import { Camera, Music, Lock, Globe, ChevronLeft, Plus, RefreshCw, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Song } from '../App';
import { toast } from "sonner@2.0.3";

interface CreatePlaylistPageProps {
  onBack: () => void;
  onSubmit: (playlist: any) => void;
}

export function CreatePlaylistPage({ onBack, onSubmit }: CreatePlaylistPageProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const songPool: Song[] = [
    { id: 's1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', cover: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzY0NDEwNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 's2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpY3xlbnwxfHx8fDE3NjQ0MTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 's3', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: '5:55', cover: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZHxlbnwxfHx8fDE3NjQ0MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 's4', title: 'Take Five', artist: 'Dave Brubeck', album: 'Time Out', duration: '5:24', cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWN8ZW58MXx8fHwxNzY0Mzc2NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 's5', title: 'Strobe', artist: 'Deadmau5', album: 'For Lack of a Better Name', duration: '10:37', cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 's6', title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpY3xlbnwxfHx8fDE3NjQ0MTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 's7', title: 'Circles', artist: 'Post Malone', album: 'Hollywood\'s Bleeding', duration: '3:35', cover: 'https://images.unsplash.com/photo-1701506516420-3ef4b27413c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbmlnaHR8ZW58MXx8fHwxNzY0NDgzMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 's8', title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', duration: '6:30', cover: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZHxlbnwxfHx8fDE3NjQ0MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 's9', title: 'Starboy', artist: 'The Weeknd ft. Daft Punk', album: 'Starboy', duration: '3:50', cover: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzY0NDEwNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 's10', title: 'Titanium', artist: 'David Guetta ft. Sia', album: 'Nothing but the Beat', duration: '4:05', cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  ];

  const [suggestedSongs, setSuggestedSongs] = useState<Song[]>(songPool.slice(0, 5));
  const [addedSongs, setAddedSongs] = useState<Set<string>>(new Set());

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefreshSuggestions = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const shuffled = [...songPool].sort(() => 0.5 - Math.random());
      setSuggestedSongs(shuffled.slice(0, 5));
      setIsRefreshing(false);
      toast.success("Đã làm mới danh sách gợi ý");
    }, 500);
  };

  const handleAddSong = (song: Song) => {
    setAddedSongs(prev => {
      const newSet = new Set(prev);
      newSet.add(song.id);
      return newSet;
    });
    toast.success(`Đã thêm "${song.title}" vào playlist mới`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      isPublic,
      coverImage,
      songs: Array.from(addedSongs)
    });
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 text-white/70 hover:text-white hover:bg-white/10 -ml-2"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Quay lại
      </Button>

      <h1 className="text-3xl font-bold mb-8">Tạo Playlist Mới</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cover Image Section */}
        <div className="lg:col-span-4 flex flex-col items-center space-y-4">
          <div className="relative group w-full aspect-square max-w-[300px] bg-white/5 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-white/40 hover:bg-white/10">
            {coverImage ? (
              <img 
                src={coverImage} 
                alt="Playlist cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-white/50 group-hover:text-white/80">
                <Music className="w-16 h-16 mb-4" />
                <span className="text-sm font-medium">Tải ảnh bìa</span>
              </div>
            )}
            
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-xs text-white/40 text-center">
            Tối thiểu 300x300px. JPG hoặc PNG.
          </p>
        </div>

        {/* Form Fields Section */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-medium">Tên Playlist</Label>
              <Input
                id="name"
                placeholder="Playlist tuyệt vời của tôi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-0 text-lg h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white font-medium">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Thêm mô tả cho playlist..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-0 min-h-[120px] resize-none"
              />
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base text-white font-medium flex items-center gap-2">
                    {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {isPublic ? 'Công khai' : 'Riêng tư'}
                  </Label>
                  <p className="text-sm text-white/50">
                    {isPublic 
                      ? 'Mọi người có thể nhìn thấy và phát playlist này' 
                      : 'Chỉ bạn mới có thể nhìn thấy và phát playlist này'}
                  </p>
                </div>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
            </div>

            {/* Suggested Songs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-white font-medium">Thêm bài hát</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshSuggestions}
                  className={`text-blue-300 hover:text-white hover:bg-white/10 h-8 px-2 ${isRefreshing ? 'animate-spin' : ''}`}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                {suggestedSongs.map((song) => (
                  <div 
                    key={song.id}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0"
                  >
                    <ImageWithFallback
                      src={song.cover}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover shadow-sm"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white truncate">{song.title}</p>
                      <p className="text-xs text-blue-300 truncate">{song.artist}</p>
                    </div>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleAddSong(song)}
                      disabled={addedSongs.has(song.id)}
                      className={`h-8 w-8 rounded-full ${addedSongs.has(song.id) ? 'text-green-500 bg-green-500/10' : 'text-blue-300 hover:text-cyan-400 hover:bg-cyan-400/10'}`}
                    >
                      {addedSongs.has(song.id) ? (
                         <div className="w-2 h-2 rounded-full bg-current" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 flex items-center justify-end gap-4 mt-6 border-t border-white/10">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="bg-transparent border-white/20 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/40 h-12 px-6 rounded-full transition-colors"
              >
                Hủy
              </Button>
              <Button 
                type="submit"
                disabled={!name.trim()}
                className="h-12 px-8 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-bold text-base border-0 min-w-[160px] shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] rounded-full transition-all transform hover:-translate-y-0.5"
              >
                Tạo Playlist
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
