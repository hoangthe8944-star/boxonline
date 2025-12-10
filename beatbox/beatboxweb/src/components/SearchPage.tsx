import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Import API
import { searchPublicSongs } from '../../api/apiclient';

// Định nghĩa Type Song cho Giao diện (Khớp với App.tsx)
export interface Song {
  id: string;
  title: string;
  artist: string; // UI dùng 'artist', API trả về 'artistName'
  album: string;  // UI dùng 'album', API trả về 'albumName'
  cover: string;  // UI dùng 'cover', API trả về 'coverUrl'
  duration: string; // UI dùng chuỗi '03:20', API trả về số giây
  streamUrl?: string; // Để phát nhạc
}

interface SearchPageProps {
  searchQuery: string;
  onPlaySong: (song: Song) => void;
}

export function SearchPage({ searchQuery, onPlaySong }: SearchPageProps) {
  // State lưu kết quả tìm kiếm từ API
  const [results, setResults] = useState<Song[]>([]);

  // Dữ liệu giả cho Categories (Giữ nguyên như yêu cầu)
  const categories = [
    { name: 'Pop', color: 'from-pink-500 to-rose-500', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300' },
    { name: 'Rock', color: 'from-red-500 to-orange-600', cover: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?auto=format&fit=crop&q=80&w=300' },
    { name: 'Jazz', color: 'from-amber-500 to-yellow-500', cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80&w=300' },
    { name: 'Electronic', color: 'from-cyan-500 to-blue-500', cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?auto=format&fit=crop&q=80&w=300' },
    { name: 'Hip Hop', color: 'from-purple-500 to-pink-500', cover: 'https://images.unsplash.com/photo-1701506516420-3ef4b27413c9?auto=format&fit=crop&q=80&w=300' },
    { name: 'Classical', color: 'from-indigo-500 to-purple-500', cover: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?auto=format&fit=crop&q=80&w=300' },
    { name: 'Country', color: 'from-orange-500 to-red-500', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300' },
    { name: 'R&B', color: 'from-emerald-500 to-teal-500', cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80&w=300' },
  ];

  // --- LOGIC CALL API ---
  useEffect(() => {
    // Hàm format thời gian (Giây -> mm:ss)
    const formatDuration = (seconds: number) => {
        if (!seconds) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const fetchSongs = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        const response = await searchPublicSongs(searchQuery);
        // Map dữ liệu từ Backend (DTO) sang cấu trúc của Frontend (UI)
        const mappedSongs: Song[] = response.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            artist: item.artistName || "Unknown Artist", // Map artistName -> artist
            album: item.albumName || "Single",           // Map albumName -> album
            cover: item.coverUrl,                        // Map coverUrl -> cover
            duration: formatDuration(item.duration),     // Convert int -> string
            streamUrl: item.streamUrl
        }));
        setResults(mappedSongs);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      }
    };

    // Debounce: Đợi user ngừng gõ 500ms mới gọi API (tránh spam server)
    const timeoutId = setTimeout(() => {
        fetchSongs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="px-8 py-6 space-y-8">
      {searchQuery ? (
        /* Search Results (Hiển thị dữ liệu thật từ State 'results') */
        <div>
          <h2 className="mb-4">Kết quả tìm kiếm cho "{searchQuery}"</h2>
          
          {results.length > 0 ? (
            <>
              {/* Top Result (Lấy phần tử đầu tiên của kết quả thật) */}
              <div className="mb-8">
                <h3 className="mb-4 text-blue-300">Kết quả hàng đầu</h3>
                <button
                  onClick={() => onPlaySong(results[0])}
                  className="bg-gradient-to-br from-blue-900/60 to-cyan-800/40 backdrop-blur rounded-lg p-6 hover:from-blue-800/70 hover:to-cyan-700/50 transition-all group max-w-md w-full text-left"
                >
                  <ImageWithFallback
                    src={results[0].cover}
                    alt={results[0].title}
                    className="w-32 h-32 rounded-lg shadow-2xl mb-4 object-cover"
                  />
                  <h3 className="mb-2 group-hover:text-cyan-300 transition-colors font-bold text-xl">
                    {results[0].title}
                  </h3>
                  <div className="flex items-center gap-2 text-blue-300">
                    <span>Bài hát</span>
                    <span>•</span>
                    <span>{results[0].artist}</span>
                  </div>
                </button>
              </div>

              {/* Songs Results (Map dữ liệu thật) */}
              <div>
                <h3 className="mb-4 text-blue-300">Bài hát</h3>
                <div className="space-y-2">
                  {results.map((song, index) => (
                    <button
                      key={song.id}
                      onClick={() => onPlaySong(song)}
                      className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-blue-800/30 transition-all group"
                    >
                      <span className="text-blue-300 w-6 text-center">{index + 1}</span>
                      <ImageWithFallback
                        src={song.cover}
                        alt={song.title}
                        className="w-12 h-12 rounded shadow-lg object-cover"
                      />
                      <div className="flex-1 text-left min-w-0">
                        <p className="truncate group-hover:text-cyan-300 transition-colors font-medium">
                          {song.title}
                        </p>
                        <p className="text-sm text-blue-300 truncate">{song.artist}</p>
                      </div>
                      <p className="text-sm text-blue-300 hidden md:block truncate max-w-[200px]">
                        {song.album}
                      </p>
                      <p className="text-sm text-blue-300 w-16 text-right">{song.duration}</p>
                      <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white" fill="white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-400">Không tìm thấy bài hát nào khớp với từ khóa.</div>
          )}
        </div>
      ) : (
        /* Browse Categories (Giữ nguyên tĩnh như cũ) */
        <div>
          <h2 className="mb-4">Duyệt tất cả</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                className="relative overflow-hidden rounded-lg aspect-square hover:scale-105 transition-transform group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <ImageWithFallback
                  src={category.cover}
                  alt={category.name}
                  className="w-full h-full object-cover mix-blend-overlay"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white drop-shadow-lg font-bold text-xl">{category.name}</h3>
                </div>
              </button>
            ))}
          </div>

          {/* Trending Searches */}
          <div className="mt-12">
            <h3 className="mb-4">Tìm kiếm thịnh hành</h3>
            <div className="flex flex-wrap gap-3">
              {['Son Tung MTP', 'Mono', 'HIEUTHUHAI', 'Jazz', 'Rock', 'Chill', 'Workout'].map(
                (tag) => (
                  <button
                    key={tag}
                    className="px-4 py-2 bg-blue-900/40 hover:bg-blue-800/60 rounded-full transition-colors border border-blue-700/30 text-sm"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}