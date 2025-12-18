import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// ✅ BƯỚC 1: IMPORT CÁC HÀM API VÀ TYPE
import type { Song } from '../../api/apiclient';
import { getTrendingSongs, getRecentlyPlayedSongs } from '../../api/apiclient';
import type { Playlist } from '../App';

// ✅ Đổi tên Type "Song" của giao diện để tránh trùng lặp với DTO
// interface SongUI {
//   id: string;
//   title: string;
//   artistName: string;
//   album: string;  
//   coverUrl: string;  
//   duration: string; 
//   streamUrl?: string; 
// }

interface HomePageProps {
  onPlaySong: (song: Song, contextPlaylist: Song[]) => void;
}

export function HomePage({ onPlaySong }: HomePageProps) {

  // ✅ BƯỚC 2: TẠO STATE MỚI ĐỂ LƯU DỮ LIỆU TỪ API
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- DỮ LIỆU GIẢ CHO PLAYLIST ĐƯỢC GIỮ NGUYÊN ---
  const featuredPlaylists: Playlist[] = [
    { id: '1', name: 'Top Hits 2024', cover: '...', songCount: 50, description: '...' },
    { id: '2', name: 'Chill Vibes', cover: '...', songCount: 35, description: '...' },
    { id: '3', name: 'Rock Classics', cover: '...', songCount: 42, description: '...' },
    { id: '4', name: 'Jazz Evening', cover: '...', songCount: 28, description: '...' },
    { id: '5', name: 'Electronic Beats', cover: '...', songCount: 38, description: '...' },
    { id: '6', name: 'Night Concerts', cover: '...', songCount: 45, description: '...' },
  ];

  // ✅ BƯỚC 3: LOGIC GỌI API VÀ XỬ LÝ DỮ LIỆU
  useEffect(() => {
    const fetchHomePageData = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ BƯỚC 1: VẪN GỌI CẢ HAI API
        // Chúng ta dùng `Promise.allSettled` để một API lỗi không làm hỏng toàn bộ quá trình.
        const [recentResult, trendingResult] = await Promise.allSettled([
          getRecentlyPlayedSongs(),
          getTrendingSongs(18) // Lấy nhiều hơn một chút để dự phòng
        ]);

        let trendingSongs: Song[] = [];
        if (trendingResult.status === 'fulfilled') {
          trendingSongs = trendingResult.value.data;
        } else {
          // Nếu API trending cũng lỗi, ném ra lỗi để hiển thị thông báo
          console.error("Lỗi khi tải Trending Songs:", trendingResult.reason);
          throw new Error("Không thể tải danh sách bài hát đề xuất.");
        }

        // ✅ BƯỚC 2: XỬ LÝ LOGIC "FALLBACK" (DỰ PHÒNG)
        let recentSongs: Song[] = [];
        // Kiểm tra xem API "recent" có thành công và trả về dữ liệu không
        if (recentResult.status === 'fulfilled' && recentResult.value.data.length > 0) {
          // Kịch bản 1: Lấy thành công, dùng dữ liệu lịch sử
          recentSongs = recentResult.value.data.slice(0, 6);
        } else {
          // Kịch bản 2: Lỗi hoặc không có lịch sử -> Lấy ngẫu nhiên từ trending
          console.log("Không có lịch sử phát gần đây, lấy ngẫu nhiên từ trending.");
          recentSongs = trendingSongs.slice(0, 6); // Lấy 6 bài đầu của trending
        }

        // Cập nhật state
        setRecentlyPlayed(recentSongs);
        // Lấy 12 bài hát còn lại (hoặc toàn bộ nếu ít hơn) cho phần đề xuất
        setRecommendedSongs(trendingSongs.slice(6));

      } catch (err: any) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
        setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  // Hàm tiện ích để định dạng thời gian
  const formatDuration = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Render một section bài hát (để tránh lặp code)
  const renderSongSection = (title: string, songs: Song[], listContext: Song[]) => (
    <div>
      <h3 className="mb-4">{title}</h3>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-4 bg-white/5 rounded-lg p-2 animate-pulse">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded bg-white/10 flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {songs.map((song) => (
            <button
              key={song.id}
              // ✅ BƯỚC 3: CUNG CẤP CONTEXT CHO HÀNG ĐỢI PHÁT
              onClick={() => onPlaySong(song, listContext)}
              className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-blue-900/40 to-cyan-800/20 backdrop-blur rounded-lg p-2 hover:bg-blue-800/50 transition-all group"
            >
              <ImageWithFallback
                src={song.coverUrl}
                alt={song.title}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded shadow-lg flex-shrink-0"
              />
              <div className="flex-1 text-left min-w-0">
                <p className="truncate text-sm sm:text-base">{song.title}</p>
                <p className="text-xs sm:text-sm text-blue-300 truncate">{song.artistName}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-cyan-500/30 flex-shrink-0">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="white" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // ✅ BƯỚC 4: GIAO DIỆN JSX ĐƯỢC GIỮ NGUYÊN
  // Dữ liệu sẽ tự động được cập nhật khi API gọi xong
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="mb-2">Chào buổi tối</h2>
        <p className="text-blue-300">Khám phá âm nhạc yêu thích của bạn</p>
      </div>
      {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}

      {/* Quick Access */}
      <div>
        {renderSongSection("Phát gần đây", recentlyPlayed, recentlyPlayed)}
        {/* {loading ? (
          <p className="text-blue-300">Đang tải...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {recentlyPlayed.map((song) => (
              <button
                key={song.id}
                onClick={() => onPlaySong(song, recentlyPlayed)}
                className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-blue-900/40 to-cyan-800/20 backdrop-blur rounded-lg p-2 hover:bg-blue-800/50 transition-all group"
              >
                <ImageWithFallback
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded shadow-lg flex-shrink-0"
                />
                <div className="flex-1 text-left min-w-0">
                  <p className="truncate text-sm sm:text-base">{song.title}</p>
                  <p className="text-xs sm:text-sm text-blue-300 truncate">{song.artistName}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-cyan-500/30 flex-shrink-0">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="white" />
                </div>
              </button>
            ))}
          </div>
        )} */}
      </div>

      {/* Featured Playlists (GIỮ NGUYÊN) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3>Playlist nổi bật</h3>
          <button className="text-sm text-blue-300 hover:text-white transition-colors">
            Xem tất cả
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {featuredPlaylists.map((playlist) => (
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
              <p className="text-xs sm:text-sm text-blue-300 line-clamp-2">
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
        {loading ? (
          <p className="text-blue-300">Đang tải...</p>
        ) : (
          <div className="space-y-2">
            {recommendedSongs.map((song, index) => (
              <button
                key={song.id}
                onClick={() => onPlaySong(song, recommendedSongs)}
                className="w-full flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-blue-800/30 transition-all group"
              >
                <span className="text-blue-300 w-6 text-center text-sm sm:text-base">{index + 1}</span>
                <ImageWithFallback
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded shadow-lg flex-shrink-0"
                />
                <div className="flex-1 text-left min-w-0">
                  <p className="truncate text-sm sm:text-base">{song.title}</p>
                  <p className="text-xs sm:text-sm text-blue-300 truncate">{song.artistName}</p>
                </div>
                <p className="hidden md:block text-sm text-blue-300 truncate flex-shrink-0">{song.albumName}</p>
                <p className="text-xs sm:text-sm text-blue-300 w-12 sm:w-16 text-right flex-shrink-0">{song.duration}</p>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="white" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}