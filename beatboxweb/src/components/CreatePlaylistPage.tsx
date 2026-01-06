import { useState, useEffect } from 'react';
import { Camera, Music, Lock, Globe, ChevronLeft, Plus, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from "sonner";
import axios from "axios";

// Type bài hát tối thiểu
interface Song {
  id: string;
  title: string;
  artistName: string;
  coverUrl: string;
}

interface CreatePlaylistPageProps {
  onBack: () => void;
  currentUserId: string;
  isAdmin?: boolean;
  onCreated?: (playlist: any) => void;
}

export function CreatePlaylistPage({ onBack, currentUserId, isAdmin = false, onCreated }: CreatePlaylistPageProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [addedSongs, setAddedSongs] = useState<Set<string>>(new Set());
  const [suggestedSongs, setSuggestedSongs] = useState<Song[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------------
  // Lấy tất cả bài hát từ API khi component mount
  // ---------------------
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get<Song[]>('https://backend-jfn4.onrender.com/api/public/songs/all', {
          headers: { "ngrok-skip-browser-warning": "true" }
        });
        // Chỉ hiển thị 5 bài gợi ý
        setSuggestedSongs(res.data.slice(0, 5));
      } catch (err) {
        console.error("Lỗi khi lấy bài hát:", err);
        toast.error("Không lấy được danh sách bài hát.");
      }
    };
    fetchSongs();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRefreshSuggestions = async () => {
    setIsRefreshing(true);
    try {
      const res = await axios.get<Song[]>('https://backend-jfn4.onrender.com/api/public/songs/all', {
        headers: { "ngrok-skip-browser-warning": "true" }
      });
      const shuffled = res.data.sort(() => 0.5 - Math.random());
      setSuggestedSongs(shuffled.slice(0, 5));
      toast.success("Đã làm mới danh sách gợi ý");
    } catch (err) {
      console.error(err);
      toast.error("Làm mới danh sách thất bại");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddSong = (song: Song) => {
    setAddedSongs(prev => new Set(prev).add(song.id));
    toast.success(`Đã thêm "${song.title}" vào playlist mới`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const payload = {
        name,
        description,
        type: "user",
        isPublic,
        tracks: Array.from(addedSongs),
        coverImage,
      };

      const res = await axios.post(
        "https://backend-jfn4.onrender.com/api/playlists",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            currentUserId,
            isAdmin,
          },
        }
      );

      toast.success(`Playlist "${res.data.name}" đã được tạo!`);
      if (onCreated) onCreated(res.data);

      setName('');
      setDescription('');
      setIsPublic(true);
      setCoverImage(null);
      setAddedSongs(new Set());
    } catch (err: any) {
      console.error(err);
      toast.error("Tạo playlist thất bại, thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------
  // UI giữ nguyên như cũ
  // ---------------------
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
              <img src={coverImage} alt="Playlist cover" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-white/50 group-hover:text-white/80">
                <Music className="w-16 h-16 mb-4" />
                <span className="text-sm font-medium">Tải ảnh bìa</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
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
                <Switch checked={isPublic} onCheckedChange={setIsPublic} className="data-[state=checked]:bg-cyan-500" />
              </div>
            </div>

            {/* Suggested Songs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-white font-medium">Thêm bài hát</Label>
                <Button type="button" variant="ghost" size="sm" onClick={handleRefreshSuggestions} className={`text-blue-300 hover:text-white hover:bg-white/10 h-8 px-2 ${isRefreshing ? 'animate-spin' : ''}`}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                {suggestedSongs.map(song => (
                  <div key={song.id} className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0">
                    <ImageWithFallback src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded object-cover shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white truncate">{song.title}</p>
                      <p className="text-xs text-blue-300 truncate">{song.artistName}</p>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleAddSong(song)}
                      disabled={addedSongs.has(song.id)}
                      className={`h-8 w-8 rounded-full ${addedSongs.has(song.id) ? 'text-green-500 bg-green-500/10' : 'text-blue-300 hover:text-cyan-400 hover:bg-cyan-400/10'}`}
                    >
                      {addedSongs.has(song.id) ? <div className="w-2 h-2 rounded-full bg-current" /> : <Plus className="w-5 h-5" />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 flex items-center justify-end gap-4 mt-6 border-t border-white/10">
              <Button type="button" variant="outline" onClick={onBack} className="bg-transparent border-white/20 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/40 h-12 px-6 rounded-full transition-colors">
                Hủy
              </Button>
              <Button type="submit" disabled={!name.trim() || loading} className="h-12 px-8 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-bold text-base border-0 min-w-[160px] shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] rounded-full transition-all transform hover:-translate-y-0.5">
                {loading ? "Đang tạo..." : "Tạo Playlist"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
