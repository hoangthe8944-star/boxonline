import { Play, Heart, Shuffle, Repeat, ChevronDown, Equal, Pause, Music2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// ✅ BƯỚC 1: IMPORT CÁC THÀNH PHẦN CẦN THIẾT
import type { Song } from '../../api/apiclient';
import { getTrendingSongs } from '../../api/apiclient';
import { getLyricsBySpotifyId } from '../../api/apiclient';


// ========================================================================
// ✅ BƯỚC 2: TẠO MỘT COMPONENT IMAGEWITHFALLBACK ĐÁNG TIN CẬY
// Bạn có thể đặt component này ở đầu file, hoặc tách ra một file riêng.
// ========================================================================
interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

const ImageWithFallback = ({ src, fallback, ...props }: ImageWithFallbackProps) => {
  const [imgError, setImgError] = useState(false);

  // Reset trạng thái lỗi mỗi khi `src` thay đổi
  useEffect(() => {
    setImgError(false);
  }, [src]);

  // Nếu src không tồn tại hoặc đã bị lỗi, hiển thị fallback
  if (imgError || !src) {
    return (
      <div {...props} className={`${props.className} flex items-center justify-center bg-white/5`}>
        {fallback || <Music2 className="w-1/2 h-1/2 text-white/20" />}
      </div>
    );
  }

  return (
    <img
      {...props}
      src={src}
      onError={() => setImgError(true)} // Khi ảnh lỗi, cập nhật state
    />
  );
};
// ========================================================================

// Hàm tiện ích để định dạng thời lượng
const formatDuration = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Cập nhật props interface để khớp với App.tsx
interface NowPlayingPageProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song, contextPlaylist: Song[]) => void;
  onTogglePlay: () => void;
}

export function NowPlayingPage({ currentSong, isPlaying, onPlaySong, onTogglePlay }: NowPlayingPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const [upNextSongs, setUpNextSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [lyricsError, setLyricsError] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string>("");

  const shuffleArray = (array: Song[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };
  useEffect(() => {
    if (!currentSong?.id) return;

    const fetchLyrics = async () => {
      try {
        const res = await getLyricsBySpotifyId(currentSong.id);
        setLyrics(res.data.lyrics || "Chưa có lời bài hát");
      } catch (err) {
        console.error("Failed to load lyrics", err);
        setLyrics("Không thể tải lyrics");
      }
    };

    fetchLyrics();
  }, [currentSong?.id]);
  // Logic gọi API đã đúng, không cần thay đổi
  useEffect(() => {
    setLyricsError(null);
    setLyricsLoading(false);
    if (!currentSong) return;

    const fetchAndRefreshQueue = async () => {
      setIsLoading(true);
      try {
        // Lấy 20 bài từ trending
        const response = await getTrendingSongs(20);
        // Trộn ngẫu nhiên để danh sách "luôn đổi mới"
        const shuffled = shuffleArray(response.data);
        // Loại bỏ bài đang phát ra khỏi danh sách "Tiếp theo"
        const filtered = shuffled.filter(s => s.id !== currentSong.id);
        setUpNextSongs(filtered);
      } catch (err) {
        console.error("Lỗi tải danh sách:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndRefreshQueue();
  }, [currentSong?.id]); // Chỉ chạy lại khi đổi sang bài hát KHÁC hoàn toàn

  const handleToggleLike = async () => {
    if (!currentSong) return;
    setIsLiked(prev => !prev);
  };

  const handleLoadLyrics = async () => {
    if (!currentSong?.id) {
      setLyricsError("Bài hát này không có lyrics");
      return;
    }

    try {
      setLyricsLoading(true);
      setLyricsError(null);

      const res = await getLyricsBySpotifyId(currentSong.id);
      setLyrics(res.data.lyrics || "Không tìm thấy lời bài hát");
    } catch (err) {
      console.error(err);
      setLyricsError("Không thể tải lời bài hát");
    } finally {
      setLyricsLoading(false);
    }
  };

  if (!currentSong) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
            <Music2 className="w-12 h-12 text-blue-300" />
          </div>
          <h3 className="mb-2 text-white">Chưa có bài hát nào đang phát</h3>
          <p className="text-blue-300">Chọn một bài hát để bắt đầu nghe nhạc</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:flex-row relative">
      {/* Phần bên trái - Album Art & Info & Lyrics */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-gradient-to-b from-blue-600/40 to-transparent overflow-y-auto pb-24 lg:pb-12">
        <div className="w-full max-w-md mx-auto">
          {/* Album Cover */}
          <div className="relative mb-6 sm:mb-8 group">
            {/* ✅ BƯỚC 3: SỬ DỤNG COMPONENT MỚI, ẢNH SẼ HIỂN THỊ LẠI */}
            <ImageWithFallback
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-full aspect-square object-cover rounded-2xl shadow-2xl shadow-black/40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          </div>

          {/* Song Info */}
          <div className="space-y-4 mb-6 sm:mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="mb-2 truncate text-xl sm:text-2xl">{currentSong.title}</h2>
                <p className="text-cyan-300 truncate">{currentSong.artistName}</p>
              </div>
              <button
                onClick={handleToggleLike}
                className={`p-2 sm:p-3 rounded-full transition-all ${isLiked ? 'bg-cyan-400/20 text-cyan-400' : 'bg-blue-600/40 text-cyan-200 hover:bg-cyan-500/60'}`}
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill={isLiked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onTogglePlay}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full hover:scale-105 transition-transform shadow-lg shadow-cyan-400/20"
              >
                {isPlaying ? <><Pause className="w-5 h-5" /> Tạm dừng</> : <><Play className="w-5 h-5" /> Phát</>}
              </button>
              <button className="p-2.5 sm:p-3 bg-blue-600/40 hover:bg-cyan-500/60 rounded-full transition-colors"><Shuffle className="w-4 h-4 sm:w-5 sm:h-5" /></button>
              <button className="p-2.5 sm:p-3 bg-blue-600/40 hover:bg-cyan-500/60 rounded-full transition-colors"><Repeat className="w-4 h-4 sm:w-5 sm:h-5" /></button>
              <button onClick={() => setIsQueueOpen(!isQueueOpen)} className="lg:hidden p-2.5 sm:p-3 bg-blue-600/40 hover:bg-cyan-500/60 rounded-full transition-colors"><Equal className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            </div>
          </div>

          {/* Lyrics Section */}
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-4 sm:p-6 backdrop-blur-lg border border-cyan-400/20">
            <h3 className="mb-4 text-cyan-200">Lời bài hát</h3>
            <div className="space-y-4 text-sm leading-relaxed text-cyan-50">
              {lyrics.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Queue Panel */}
      <div className={`fixed lg:static bottom-0 left-0 right-0 lg:w-96 bg-gradient-to-b from-blue-700/60 to-cyan-600/40 backdrop-blur-lg border-t lg:border-t-0 lg:border-l border-cyan-500/30 flex flex-col transition-transform duration-300 ease-in-out ${isQueueOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'} max-h-[70vh] lg:max-h-none z-30 lg:z-auto rounded-t-3xl lg:rounded-none`}>
        {/* ... */}
        <div className="p-4 sm:p-6 border-b border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl">Tiếp theo</h3>
              <p className="text-sm text-cyan-200 mt-1">{upNextSongs.length} bài hát</p>
            </div>
            <button onClick={() => setIsQueueOpen(false)} className="lg:hidden p-2 hover:bg-cyan-500/20 rounded-full transition-colors"><ChevronDown className="w-6 h-6" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 space-y-2">
            <div className="mb-4">
              <p className="text-xs text-cyan-300 uppercase tracking-wider mb-2 px-2">Đang phát</p>
              <div className="bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg p-3 border border-cyan-400/30">
                <div className="flex items-center gap-3">
                  <ImageWithFallback src={currentSong.coverUrl} alt={currentSong.title} className="w-10 h-10 sm:w-12 sm:h-12 rounded shadow-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-sm truncate text-cyan-100">{currentSong.title}</p><p className="text-xs text-cyan-200 truncate">{currentSong.artistName}</p></div>
                  <p className="text-xs text-cyan-200 flex-shrink-0">{formatDuration(currentSong.duration)}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-cyan-300 uppercase tracking-wider mb-2 px-2">Tiếp theo</p>
              {isLoading && <p className="text-cyan-200 p-4 text-center">Đang tải...</p>}
              {error && <p className="text-red-400 p-4 text-center">{error}</p>}
              {!isLoading && !error && upNextSongs.map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => {
                    // ✅ BƯỚC 4: CẬP NHẬT onPlaySong VỚI CONTEXT LÀ DANH SÁCH 'upNextSongs'
                    onPlaySong(song, upNextSongs);
                    // setIsQueueOpen(false);
                  }}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-cyan-500/30 transition-all group"
                >
                  <span className="text-cyan-300 text-xs w-4 flex-shrink-0">{index + 1}</span>
                  <ImageWithFallback src={song.coverUrl} alt={song.title} className="w-8 h-8 sm:w-10 sm:h-10 rounded shadow-lg flex-shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs sm:text-sm truncate group-hover:text-cyan-100 transition-colors">{song.title}</p>
                    <p className="text-xs text-cyan-200 truncate">{song.artistName}</p>
                  </div>
                  <p className="text-xs text-cyan-200 flex-shrink-0">{formatDuration(song.duration)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isQueueOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setIsQueueOpen(false)} />}
    </div>
  );
}