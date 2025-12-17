import { Play, Heart, Shuffle, Repeat, ChevronDown, Equal, Pause } from 'lucide-react';
// import type { SongApp } from '../App'; 
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useRef, useEffect } from 'react';
import type { Song } from '../../api/apiclient'; 


import { getTrendingSongs, getAllPublicSongs } from '../../api/apiclient';
// Giả định file api/apiclient có cả 2 hàm này

// LƯU Ý: Đảm bảo file `api/apiclient.ts` của bạn có export hàm `toggleLikeStatus` như sau:
/*
export const toggleLikeStatus = async (songId: string, isLiked: boolean): Promise<void> => {
  console.log(`API: ${isLiked ? 'Thích' : 'Bỏ thích'} bài hát ${songId}`);
  // Logic gọi API thật ở đây
  return new Promise(resolve => setTimeout(resolve, 500));
};
*/

// Định nghĩa lại Song interface để bao gồm streamUrl
// interface ExtendedSong extends Song {
//   streamUrl?: string;
// }

const formatDuration = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};


// Định nghĩa props, sử dụng Song type từ API
interface NowPlayingPageProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onPlaybackStatusChange: (isPlaying: boolean) => void;
  onTogglePlay: () => void;
}

  export function NowPlayingPage({ currentSong, onPlaySong, onPlaybackStatusChange, isPlaying, onTogglePlay }: NowPlayingPageProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isQueueOpen, setIsQueueOpen] = useState(false);

    // ✅ BƯỚC 2: THÊM STATE ĐỂ QUẢN LÝ DỮ LIỆU TỪ API
    const [upNextSongs, setUpNextSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ BƯỚC 3: SỬ DỤNG useEffect ĐỂ GỌI API KHI BÀI HÁT THAY ĐỔI
    useEffect(() => {
      if (!currentSong) return;

      const fetchUpNextSongs = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Gọi API lấy 15 bài hát thịnh hành
          const response = await getTrendingSongs(15);
          // Lọc bài hát hiện tại ra khỏi danh sách gợi ý
          const filteredSongs = response.data.filter(song => song.id !== currentSong.id);
          setUpNextSongs(filteredSongs);
        } catch (err) {
          console.error("Lỗi khi tải danh sách phát tiếp theo:", err);
          setError("Không thể tải danh sách phát.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchUpNextSongs();
    }, [currentSong]); // Effect này sẽ chạy lại mỗi khi `currentSong` thay đổi


    const handleToggleLike = async () => {
      if (!currentSong) return;
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
    };


    if (!currentSong) {
      return (
        <div className="flex items-center justify-center h-full">
          {/* ... Giao diện khi chưa có bài hát nào ... */}
        </div>
      );
    }
    return (
      <div className="h-full flex flex-col lg:flex-row relative">
        {/* Thẻ audio ẩn, dùng để điều khiển việc phát nhạc */}
        {/* <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        crossOrigin="anonymous"
        className="hidden"
      /> */}

        {/* Left Side - Album Art & Info & Lyrics */}
        <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-gradient-to-b from-blue-600/40 to-transparent overflow-y-auto pb-24 lg:pb-12">
          <div className="w-full max-w-md mx-auto">
            {/* Album Cover */}
            <div className="relative mb-6 sm:mb-8 group">
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
                  className={`p-2 sm:p-3 rounded-full transition-all ${isLiked
                    ? 'bg-cyan-400/20 text-cyan-400'
                    : 'bg-blue-600/40 text-cyan-200 hover:bg-cyan-500/60'
                    }`}
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
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" /> Tạm dừng
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" /> Phát
                    </>
                  )}
                </button>
                <button className="p-2.5 sm:p-3 bg-blue-600/40 hover:bg-cyan-500/60 rounded-full transition-colors">
                  <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button className="p-2.5 sm:p-3 bg-blue-600/40 hover:bg-cyan-500/60 rounded-full transition-colors">
                  <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setIsQueueOpen(!isQueueOpen)}
                  className="lg:hidden p-2.5 sm:p-3 bg-blue-600/40 hover:bg-cyan-500/60 rounded-full transition-colors"
                >
                  <Equal className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Lyrics Section */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-4 sm:p-6 backdrop-blur-lg border border-cyan-400/20">
              <h3 className="mb-4 text-cyan-200">Lời bài hát</h3>
              <div className="space-y-4 text-sm leading-relaxed text-cyan-50">
                <p>There's a light in the darkness...</p>
                {/* Giữ nguyên phần lời bài hát của bạn */}
              </div>
            </div>
          </div>
        </div>

        {/* Queue Panel */}
        <div className={`
        fixed lg:static bottom-0 left-0 right-0 lg:w-96 
        bg-gradient-to-b from-blue-700/60 to-cyan-600/40 backdrop-blur-lg 
        border-t lg:border-t-0 lg:border-l border-cyan-500/30 
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${isQueueOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
        max-h-[70vh] lg:max-h-none
        z-30 lg:z-auto
        rounded-t-3xl lg:rounded-none
      `}>
          <div className="lg:hidden w-full py-3 flex justify-center border-b border-cyan-500/20">
            <div className="w-12 h-1 bg-cyan-400/40 rounded-full" />
          </div>

          <div className="p-4 sm:p-6 border-b border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl">Tiếp theo trong hàng đợi</h3>
                <p className="text-sm text-cyan-200 mt-1">{upNextSongs.length} bài hát</p>
              </div>
              <button
                onClick={() => setIsQueueOpen(false)}
                className="lg:hidden p-2 hover:bg-cyan-500/20 rounded-full transition-colors"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 space-y-2">
              <div className="mb-4">
                <p className="text-xs text-cyan-300 uppercase tracking-wider mb-2 px-2">
                  Đang phát
                </p>
                <div className="bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg p-3 border border-cyan-400/30">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={currentSong.coverUrl}
                      alt={currentSong.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded shadow-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate text-cyan-100">{currentSong.title}</p>
                      <p className="text-xs text-cyan-200 truncate">{currentSong.artistName}</p>
                    </div>
                    <p className="text-xs text-cyan-200 flex-shrink-0">{formatDuration(currentSong.duration)}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-cyan-300 uppercase tracking-wider mb-2 px-2">
                  Tiếp theo
                </p>
                {upNextSongs.map((song, index) => (
                  <button
                    key={song.id}
                    onClick={() => {
                      onPlaySong(song);
                      setIsQueueOpen(false); // Đóng danh sách chờ trên mobile khi chọn bài
                    }}
                    className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-cyan-500/30 transition-all group"
                  >
                    <span className="text-cyan-300 text-xs w-4 flex-shrink-0">{index + 1}</span>
                    <ImageWithFallback
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded shadow-lg flex-shrink-0"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-xs sm:text-sm truncate group-hover:text-cyan-100 transition-colors">
                        {song.title}
                      </p>
                      <p className="text-xs text-cyan-200 truncate">{song.artistName}</p>
                    </div>
                    <p className="text-xs text-cyan-200 flex-shrink-0">{song.duration}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile queue */}
        {isQueueOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setIsQueueOpen(false)}
          />
        )}
      </div>
    );
  }