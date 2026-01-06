import { Plus, RefreshCw, Music } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from "sonner";
import axios from "axios";
import type { Song } from '../../api/apiclient';
import { getRecentlyPlayedSongs } from '../../api/apiclient';

interface CreatePlaylistPageProps {
  onBack: () => void;
  currentUserId: string;
  isAdmin?: boolean;
  onCreated?: (playlist: any) => void;
}

export function CreatePlaylistPage({
  onBack,
  currentUserId,
  isAdmin = false,
  onCreated
}: CreatePlaylistPageProps) {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // ❌ KHÔNG upload ảnh
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [addedSongs, setAddedSongs] = useState<Set<string>>(new Set());
  const [addedSongObjects, setAddedSongObjects] = useState<Song[]>([]);
  const [suggestedSongs, setSuggestedSongs] = useState<Song[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH SONGS ================= */
  useEffect(() => {
    const fetchSuggestedSongs = async () => {
      console.log("==> Fetching all public songs...");
      try {
        const res = await axios.get<Song[]>(
          'https://backend-jfn4.onrender.com/api/songs/all'
        );
        console.log("==> All public songs:", res.data.length);
        setSuggestedSongs(res.data.slice(0, 5));
      } catch (err) {
        console.warn("❌ All songs failed → fallback recent");
        const recentRes = await getRecentlyPlayedSongs();
        console.log("==> Fallback recent songs:", recentRes.data.length);
        setSuggestedSongs(recentRes.data.slice(0, 5));
      }
    };
    fetchSuggestedSongs();
  }, []);

  /* ================= ADD SONG ================= */
  const handleAddSong = (song: Song) => {
    setAddedSongs(prev => new Set(prev).add(song.id));
    setAddedSongObjects(prev => [...prev, song]);

    // 👉 tự set cover từ bài đầu
    if (!coverImage && song.coverUrl) {
      console.log("==> Auto set cover from song:", song.title);
      setCoverImage(song.coverUrl);
    }

    toast.success(`Đã thêm "${song.title}"`);
  };

  /* ================= REFRESH ================= */
  const handleRefreshSuggestions = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSuggestedSongs([...suggestedSongs].sort(() => 0.5 - Math.random()));
      setIsRefreshing(false);
      toast.success("Đã làm mới gợi ý");
    }, 500);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    try {
      let finalCover = coverImage;

      // ❗ nếu chưa có cover → lấy recent
      if (!finalCover) {
        console.log("==> No cover yet → fallback recent");
        const recent = await getRecentlyPlayedSongs();
        finalCover = recent.data[0]?.coverUrl ?? undefined;
      }

      const payload: any = {
        name,
        description,
        type: "user",
        isPublic,
        tracks: Array.from(addedSongs),
      };

      // ⚠️ chỉ add coverImage khi có giá trị
      if (finalCover) {
        payload.coverImage = finalCover;
      }

      console.log("Sending playlist payload:", payload);

      const res = await axios.post(
        "https://backend-jfn4.onrender.com/api/playlists",
        payload
      );

      toast.success(`Playlist "${res.data.name}" đã tạo`);
      onCreated?.(res.data);

      // reset
      setName('');
      setDescription('');
      setIsPublic(true);
      setCoverImage(null);
      setAddedSongs(new Set());
      setAddedSongObjects([]);
    } catch (err) {
      console.error("❌ Create playlist error:", err);
      toast.error("Tạo playlist thất bại");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        Quay lại
      </Button>

      <h1 className="text-3xl font-bold mb-8">Tạo Playlist Mới</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* COVER – giữ UI */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-full aspect-square max-w-[300px] bg-white/5 rounded-xl flex items-center justify-center overflow-hidden">
            {coverImage ? (
              <img src={coverImage} className="w-full h-full object-cover" />
            ) : (
              <div className="text-white/40 flex flex-col items-center">
                <Music className="w-16 h-16 mb-2" />
                <span className="text-sm">Ảnh tự động</span>
              </div>
            )}
          </div>
        </div>

        {/* FORM */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              placeholder="Tên playlist"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <Textarea
              placeholder="Mô tả"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <Switch checked={isPublic} onCheckedChange={setIsPublic} />

            {/* SONGS */}
            <div>
              <div className="flex justify-between">
                <Label>Thêm bài hát</Label>
                <Button type="button" onClick={handleRefreshSuggestions}>
                  <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
                </Button>
              </div>

              {suggestedSongs.map(song => (
                <div key={song.id} className="flex items-center gap-3 p-2">
                  <ImageWithFallback
                    src={song.coverUrl}
                    className="w-10 h-10 rounded"
                  />
                  <div className="flex-1">
                    <p>{song.title}</p>
                    <p className="text-xs text-white/40">{song.artistName}</p>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    disabled={addedSongs.has(song.id)}
                    onClick={() => handleAddSong(song)}
                  >
                    <Plus />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit" disabled={loading || !name}>
              {loading ? "Đang tạo..." : "Tạo Playlist"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
