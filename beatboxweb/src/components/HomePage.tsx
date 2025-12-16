import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// ✅ BƯỚC 1: IMPORT CÁC HÀM API VÀ TYPE
import type { Song as SongDto } from '../../api/apiclient'; // Import DTO từ API client
import { getTrendingSongs, getAllPublicSongs } from '../../api/apiclient'; // Import hàm mới
import type { Playlist } from '../App'; // Giữ lại type Playlist

// ✅ Đổi tên Type "Song" của giao diện để tránh trùng lặp với DTO
interface SongUI {
  id: string;
  title: string;
  artist: string; 
  album: string;  
  cover: string;  
  duration: string; 
  streamUrl?: string; 
}

interface HomePageProps {
  onPlaySong: (song: SongUI) => void;
}

export function HomePage({ onPlaySong }: HomePageProps) {
  
  // ✅ BƯỚC 2: TẠO STATE MỚI ĐỂ LƯU DỮ LIỆU TỪ API
  const [recentlyPlayed, setRecentlyPlayed] = useState<SongUI[]>([]);
  const [recommendedSongs, setRecommendedSongs] = useState<SongUI[]>([]);
  const [loading, setLoading] = useState(true);

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
    // Hàm format thời gian (Giây -> mm:ss)
    const formatDuration = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60); // Dùng Math.floor để làm tròn
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Hàm xáo trộn mảng để tạo danh sách ngẫu nhiên
    const shuffleArray = (array: any[]) => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Gọi API để lấy tất cả bài hát đã published
            const response = await getAllPublicSongs();

            const allSongsFromApi = Array.isArray(response.data) ? response.data : [];

            // Map DTO từ backend sang kiểu dữ liệu UI
            const mappedSongs: SongUI[] = allSongsFromApi.map((dto: SongDto) => ({
                id: dto.id,
                title: dto.title,
                artist: dto.artistName,
                album: dto.albumName,
                cover: dto.coverUrl,
                duration: formatDuration(dto.duration),
                streamUrl: dto.streamUrl,
            }));
            
            // Xáo trộn danh sách để tạo sự đa dạng
            const shuffledSongs = shuffleArray(mappedSongs);

            // Cập nhật state cho các danh sách
            // Ví dụ: 6 bài đầu cho "Phát gần đây", 12 bài tiếp theo cho "Đề xuất"
            setRecentlyPlayed(shuffledSongs.slice(0, 6));
            setRecommendedSongs(shuffledSongs.slice(6, 18));

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu trang chủ:", error);
            // Có thể hiển thị thông báo lỗi ở đây
        } finally {
            setLoading(false);
        }
    };

    fetchAllData();
  }, []); // Chỉ chạy 1 lần khi component được mount


  // ✅ BƯỚC 4: GIAO DIỆN JSX ĐƯỢC GIỮ NGUYÊN
  // Dữ liệu sẽ tự động được cập nhật khi API gọi xong
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="mb-2">Chào buổi tối</h2>
        <p className="text-blue-300">Khám phá âm nhạc yêu thích của bạn</p>
      </div>

      {/* Quick Access */}
      <div>
        <h3 className="mb-4">Phát gần đây</h3>
        {loading ? (
            <p className="text-blue-300">Đang tải...</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {recentlyPlayed.map((song) => (
                <button
                key={song.id}
                onClick={() => onPlaySong(song)}
                className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-blue-900/40 to-cyan-800/20 backdrop-blur rounded-lg p-2 hover:bg-blue-800/50 transition-all group"
                >
                <ImageWithFallback
                    src={song.cover}
                    alt={song.title}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded shadow-lg flex-shrink-0"
                />
                <div className="flex-1 text-left min-w-0">
                    <p className="truncate text-sm sm:text-base">{song.title}</p>
                    <p className="text-xs sm:text-sm text-blue-300 truncate">{song.artist}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-cyan-500/30 flex-shrink-0">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="white" />
                </div>
                </button>
            ))}
            </div>
        )}
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
                onClick={() => onPlaySong(song)}
                className="w-full flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-blue-800/30 transition-all group"
                >
                <span className="text-blue-300 w-6 text-center text-sm sm:text-base">{index + 1}</span>
                <ImageWithFallback
                    src={song.cover}
                    alt={song.title}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded shadow-lg flex-shrink-0"
                />
                <div className="flex-1 text-left min-w-0">
                    <p className="truncate text-sm sm:text-base">{song.title}</p>
                    <p className="text-xs sm:text-sm text-blue-300 truncate">{song.artist}</p>
                </div>
                <p className="hidden md:block text-sm text-blue-300 truncate flex-shrink-0">{song.album}</p>
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