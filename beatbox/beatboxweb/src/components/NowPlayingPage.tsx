import { Play, Heart, MoreHorizontal, Shuffle, Repeat, ChevronUp, ChevronDown, Equal } from 'lucide-react';
import type { Song } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useRef, useEffect } from 'react';
// Import thêm hàm API mới
import { incrementViewCount } from '../../api/apiclient';

interface ExtendedSong extends Song {
  streamUrl?: string;
}

interface NowPlayingPageProps {
  currentSong: ExtendedSong | null;
  onPlaySong: (song: Song) => void;
}

export function NowPlayingPage({ currentSong, onPlaySong }: NowPlayingPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false); // Thêm state này vì nó được sử dụng trong JSX
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);

      if (currentSong?.streamUrl) {
        audioRef.current.src = currentSong.streamUrl;
        audioRef.current.load();

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              if (currentSong.id) incrementViewCount(currentSong.id);
            })
            .catch((error) => {
              console.error("Lỗi phát nhạc (có thể do trình duyệt chặn auto-play):", error);
              setIsPlaying(false);
            });
        }
      }
    }
  }, [currentSong]);

  const handlePlayPause = () => {
    if (!audioRef.current || !currentSong?.streamUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    // Logic next bài hát có thể được thêm ở đây
  };

  // *** BẮT ĐẦU PHẦN THAY ĐỔI LOGIC ***

  // Tạo một hàm xử lý riêng cho việc gọi API để giữ cho JSX gọn gàng
  const handleToggleLike = async () => {
    if (!currentSong) return;

    const newLikedState = !isLiked;
    // Cập nhật giao diện ngay lập tức để người dùng cảm thấy phản hồi nhanh
    setIsLiked(newLikedState);

    try {
      // Gọi API ở background
      // await toggleLikeStatus(currentSong.id, newLikedState);
      // Bạn có thể thêm thông báo thành công ở đây nếu muốn
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thích:", error);
      // Nếu API lỗi, trả lại trạng thái cũ cho giao diện để đồng bộ
      setIsLiked(!newLikedState);
      // Và thông báo lỗi cho người dùng
    }
  };

  // *** KẾT THÚC PHẦN THAY ĐỔI LOGIC ***


  const queueSongs: Song[] = [
    {
      id: 'q1',
      title: 'Save Your Tears',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:35',
      cover: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzY0NDEwNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'q2',
      title: 'Starboy',
      artist: 'The Weeknd ft. Daft Punk',
      album: 'Starboy',
      duration: '3:50',
      cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'q3',
      title: 'Die For You',
      artist: 'The Weeknd',
      album: 'Starboy',
      duration: '4:20',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBtdXNpY3xlbnwxfHx8fDE3NjQ0MTc3Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'q4',
      title: 'I Feel It Coming',
      artist: 'The Weeknd ft. Daft Punk',
      album: 'Starboy',
      duration: '4:29',
      cover: 'https://images.unsplash.com/photo-1624703307604-744ec383cbf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWN8ZW58MXx8fHwxNzY0NDEwODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'q5',
      title: 'Earned It',
      artist: 'The Weeknd',
      album: 'Fifty Shades of Grey',
      duration: '4:37',
      cover: 'https://images.unsplash.com/photo-1701506516420-3ef4b27413c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbmlnaHR8ZW58MXx8fHwxNzY0NDgzMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'q6',
      title: 'The Hills',
      artist: 'The Weeknd',
      album: 'Beauty Behind the Madness',
      duration: '4:02',
      cover: 'https://images.unsplash.com/photo-1604514288114-3851479df2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZHxlbnwxfHx8fDE3NjQ0MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'q7',
      title: 'Often',
      artist: 'The Weeknd',
      album: 'Beauty Behind the Madness',
      duration: '4:09',
      cover: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWN8ZW58MXx8fHwxNzY0Mzc2NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  if (!currentSong) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
            <Play className="w-12 h-12 text-blue-300" />
          </div>
          <h3 className="mb-2">Chưa có bài hát nào đang phát</h3>
          <p className="text-blue-300">Chọn một bài hát để bắt đầu nghe nhạc</p>
        </div>
      </div>
    );
  }

  // Toàn bộ phần return (giao diện) dưới đây được giữ nguyên
  // Chỉ có một thay đổi nhỏ ở onClick của nút Heart
  return (
    <div className="h-full flex flex-col lg:flex-row relative">
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-gradient-to-b from-blue-600/40 to-transparent overflow-y-auto pb-24 lg:pb-12">
        <div className="w-full max-w-md mx-auto">
          <div className="relative mb-6 sm:mb-8 group">
            <ImageWithFallback
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-full aspect-square object-cover rounded-2xl shadow-2xl shadow-black/40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          </div>

          <div className="space-y-4 mb-6 sm:mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="mb-2 truncate text-xl sm:text-2xl">{currentSong.title}</h2>
                <p className="text-cyan-300 truncate">{currentSong.artist}</p>
              </div>
              <button
                // Thay đổi ở đây: gọi hàm handleToggleLike thay vì setIsLiked trực tiếp
                onClick={handleToggleLike}
                className={`p-2 sm:p-3 rounded-full transition-all ${isLiked
                    ? 'bg-cyan-400/20 text-cyan-400'
                    : 'bg-blue-600/40 text-cyan-200 hover:bg-cyan-500/60'
                  }`}
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill={isLiked ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full hover:scale-105 transition-transform shadow-lg shadow-cyan-400/20">
                Phát
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

          {/* Phần lời bài hát và các phần khác giữ nguyên */}
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-4 sm:p-6 backdrop-blur-lg border border-cyan-400/20">
            <h3 className="mb-4 text-cyan-200">Lời bài hát</h3>
            <div className="space-y-4 text-sm leading-relaxed text-cyan-50">
              <p className="hover:text-cyan-200 transition-colors cursor-pointer">
                There's a light in the darkness<br />
                Just barely out of view
              </p>
              <p className="hover:text-cyan-200 transition-colors cursor-pointer">
                In the corner of your eye<br />
                In the corridor that you<br />
                Walk through every night
              </p>
              <p className="text-cyan-100 hover:text-cyan-200 transition-colors cursor-pointer">
                There's a light in the darkness<br />
                Don't you let it go out
              </p>
              <p className="hover:text-cyan-200 transition-colors cursor-pointer">
                Keep on shining, keep on shining<br />
                Don't you let it go out
              </p>
              <p className="hover:text-cyan-200 transition-colors cursor-pointer">
                Cause I need your light in my darkness<br />
                Yeah I need your light in my darkness<br />
                Please keep shining
              </p>
              <p className="hover:text-cyan-200 transition-colors cursor-pointer">
                There's a hope that's growing<br />
                A flower in the snow<br />
                There's a sun that's rising<br />
                Everywhere you go
              </p>
              <p className="hover:text-cyan-200 transition-colors cursor-pointer">
                There's a light in the darkness<br />
                Don't you let it fade away<br />
                Keep believing, keep believing
              </p>
            </div>
          </div>
        </div>
      </div>

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
              <p className="text-sm text-cyan-200 mt-1">{queueSongs.length} bài hát</p>
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
                    src={currentSong.cover}
                    alt={currentSong.title}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded shadow-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate text-cyan-100">{currentSong.title}</p>
                    <p className="text-xs text-cyan-200 truncate">{currentSong.artist}</p>
                  </div>
                  <p className="text-xs text-cyan-200 flex-shrink-0">{currentSong.duration}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-cyan-300 uppercase tracking-wider mb-2 px-2">
                Tiếp theo
              </p>
              {queueSongs.map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => {
                    onPlaySong(song);
                    setIsQueueOpen(false);
                  }}
                  className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-cyan-500/30 transition-all group"
                >
                  <span className="text-cyan-300 text-xs w-4 flex-shrink-0">{index + 1}</span>
                  <ImageWithFallback
                    src={song.cover}
                    alt={song.title}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded shadow-lg flex-shrink-0"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs sm:text-sm truncate group-hover:text-cyan-100 transition-colors">
                      {song.title}
                    </p>
                    <p className="text-xs text-cyan-200 truncate">{song.artist}</p>
                  </div>
                  <p className="text-xs text-cyan-200 flex-shrink-0">{song.duration}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isQueueOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsQueueOpen(false)}
        />
      )}
    </div>
  );
}