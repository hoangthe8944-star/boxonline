import { Heart, MoreHorizontal, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { getTrendingSongs } from "../../api/apiclient"; 
import type { Song } from "../../api/apiclient"; 


// --- Helper Function ---
// Chuyển đổi thời lượng từ giây (number) sang định dạng "MM:SS" (string)
const formatDuration = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};


interface NowPlayingProps {
  currentSong: Song;
  onBack: () => void;
  onPlaySong: (song: Song) => void;
}

export function NowPlaying({ currentSong, onBack, onPlaySong }: NowPlayingProps) {
  // State để lưu danh sách bài hát "Tiếp theo" lấy từ API
  const [upNextPlaylist, setUpNextPlaylist] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sử dụng useEffect để gọi API mỗi khi currentSong thay đổi
  useEffect(() => {
    // Nếu không có bài hát hiện tại, không làm gì cả
    if (!currentSong) return;

    const fetchUpNextSongs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Gọi API để lấy 15 bài hát trending
        const response = await getTrendingSongs(15);
        
        // Lọc bài hát hiện tại ra khỏi danh sách "Tiếp theo"
        const filteredSongs = response.data.filter(song => song.id !== currentSong.id);
        
        setUpNextPlaylist(filteredSongs);
      } catch (err) {
        console.error("Lỗi khi tải danh sách bài hát tiếp theo:", err);
        setError("Không thể tải được danh sách phát.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpNextSongs();
  }, [currentSong]); // Dependency array: Effect này sẽ chạy lại mỗi khi `currentSong` thay đổi

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-800 to-black">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white hover:bg-white/10"
          onClick={onBack}
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
        <span className="text-white/70">Đang phát từ Trending</span>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white hover:bg-white/10"
        >
          <MoreHorizontal className="w-6 h-6" />
        </Button>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl">
          <ImageWithFallback
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Song Info */}
      <div className="px-8 pb-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-3xl font-bold truncate mb-2">{currentSong.title}</h1>
            <p className="text-white/70 text-lg">{currentSong.artistName}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white hover:bg-white/10 flex-shrink-0"
          >
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Queue Section */}
      <div className="border-t border-white/10 bg-black/20 flex-1 overflow-hidden">
        <div className="p-6 h-full flex flex-col">
          <h3 className="text-white mb-4">Tiếp theo từ Trending</h3>
          <div className="flex-1 overflow-y-auto space-y-2">
            {isLoading && <p className="text-white/60">Đang tải...</p>}
            {error && <p className="text-red-400">{error}</p>}
            {!isLoading && !error && upNextPlaylist.map((song) => (
              <button
                key={song.id}
                onClick={() => onPlaySong(song)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-white truncate">{song.title}</div>
                  <div className="text-white/60 text-sm truncate">{song.artistName}</div>
                </div>
                <div className="text-white/60 text-sm">{formatDuration(song.duration)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}