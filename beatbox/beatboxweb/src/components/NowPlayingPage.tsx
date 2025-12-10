import { Play, Heart, MoreHorizontal, Shuffle, Repeat, Pause } from 'lucide-react'; // Thêm icon Pause
import type { Song } from '../App'; // Giả sử Song ở App có streamUrl, nếu dùng DTO API thì import từ API
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useRef, useEffect } from 'react';
import { incrementViewCount } from '../../api/apiclient'; // Import API bạn đã cung cấp (điều chỉnh đường dẫn nếu cần)

// Định nghĩa lại Song interface nới lỏng để tương thích với cả Mock Data và API Data
// (Trong dự án thực tế bạn nên thống nhất 1 kiểu)
interface ExtendedSong extends Song {
  streamUrl?: string; // Dữ liệu Mock của bạn đang thiếu field này, cần có để phát nhạc
}

interface NowPlayingPageProps {
  currentSong: ExtendedSong | null;
  onPlaySong: (song: Song) => void;
}

export function NowPlayingPage({ currentSong, onPlaySong }: NowPlayingPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  
  // 1. State quản lý trạng thái phát
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 2. Ref tham chiếu tới thẻ Audio ẩn
  const audioRef = useRef<HTMLAudioElement>(null);

  // 3. Xử lý khi đổi bài hát (currentSong thay đổi)
  useEffect(() => {
    if (audioRef.current) {
      // Tạm dừng bài cũ
      audioRef.current.pause();
      setIsPlaying(false);

      if (currentSong?.streamUrl) {
        // Load bài mới
        audioRef.current.src = currentSong.streamUrl;
        audioRef.current.load();
        
        // Tự động phát
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              // Gọi API tăng view khi phát thành công
              if(currentSong.id) incrementViewCount(currentSong.id); 
            })
            .catch((error) => {
              console.error("Lỗi phát nhạc (có thể do trình duyệt chặn auto-play):", error);
              setIsPlaying(false);
            });
        }
      }
    }
  }, [currentSong]); // Chạy lại khi currentSong thay đổi

  // 4. Hàm xử lý nút Play/Pause
  const handlePlayPause = () => {
    if (!audioRef.current || !currentSong?.streamUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      // Gọi API tăng view nếu resume (tuỳ logic, thường gọi 1 lần đầu bài là đủ)
    }
  };

  // 5. Xử lý khi bài hát kết thúc (Tự động next bài hoặc dừng)
  const handleAudioEnded = () => {
    setIsPlaying(false);
    // Ở đây bạn có thể gọi logic next bài: onPlaySong(nextSong)
  };

  const queueSongs: Song[] = [
    {
      id: 'q1',
      title: 'Save Your Tears',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:35',
      cover: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXJ8ZW58MXx8fHwxNzY0NDEwNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    // ... (Giữ nguyên danh sách queue của bạn)
    // Lưu ý: Mock data này cần thêm field streamUrl để test phát nhạc thực tế
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

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* --- THÊM THẺ AUDIO ẨN --- */}
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        className="hidden" 
      />

      {/* Left Side - Album Art & Info & Lyrics */}
      <div className="flex-1 flex flex-col px-8 py-12 bg-gradient-to-b from-blue-600/40 to-transparent overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Album Cover */}
          <div className="relative mb-8 group">
            <ImageWithFallback
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-full aspect-square object-cover rounded-2xl shadow-2xl shadow-black/40"
            />
            {/* Nếu đang play thì hiển thị hiệu ứng visualizer giả hoặc icon pause mờ (optional) */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity rounded-2xl ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
          </div>

          {/* Song Info */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="mb-2 truncate">{currentSong.title}</h2>
                <p className="text-cyan-300 truncate">{currentSong.artist}</p>
              </div>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-full transition-all ${
                  isLiked
                    ? 'bg-cyan-400/20 text-cyan-400'
                    : 'bg-blue-600/40 text-cyan-200 hover:bg-cyan-500/60'
                }`}
              >
                <Heart className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* --- CẬP NHẬT NÚT PHÁT --- */}
              <button 
                onClick={handlePlayPause}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full hover:scale-105 transition-transform shadow-lg shadow-cyan-400/20 flex items-center justify-center gap-2"
              >
                {/* Đổi Text và Icon dựa trên trạng thái */}
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" fill="currentColor" />
                    <span className="font-semibold">Tạm dừng</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" fill="currentColor" />
                    <span className="font-semibold">Phát</span>
                  </>
                )}
              </button>
              
              <button className="p-3 bg-blue-600/40 hover:bg-cyan-500/60 rounded-full transition-colors">
                <Shuffle className="w-5 h-5" />
              </button>
              <button className="p-3 bg-blue-600/40 hover:bg-cyan-500/60 rounded-full transition-colors">
                <Repeat className="w-5 h-5" />
              </button>
              <button className="p-3 bg-blue-600/40 hover:bg-cyan-500/60 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lyrics Section */}
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-6 backdrop-blur-lg border border-cyan-400/20">
            <h3 className="mb-4 text-cyan-200">Lời bài hát</h3>
            <div className="space-y-4 text-sm leading-relaxed text-cyan-50">
               {/* (Giữ nguyên phần lời bài hát của bạn) */}
              <p className="hover:text-cyan-200 transition-colors cursor-pointer">
                There's a light in the darkness<br />
                Just barely out of view
              </p>
              {/* ... */}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Queue (Giữ nguyên) */}
      <div className="lg:w-96 bg-gradient-to-b from-blue-700/60 to-cyan-600/40 backdrop-blur-lg border-l border-cyan-500/30 flex flex-col">
        {/* ... Nội dung queue giữ nguyên ... */}
        <div className="p-6 border-b border-cyan-500/30">
          <h3>Tiếp theo trong hàng đợi</h3>
          <p className="text-sm text-cyan-200 mt-1">{queueSongs.length} bài hát</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {/* Current Song */}
            <div className="mb-4">
              <p className="text-xs text-cyan-300 uppercase tracking-wider mb-2 px-2">
                Đang phát
              </p>
              <div className="bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg p-3 border border-cyan-400/30">
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={currentSong.cover}
                    alt={currentSong.title}
                    className="w-12 h-12 rounded shadow-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate text-cyan-100">{currentSong.title}</p>
                    <p className="text-xs text-cyan-200 truncate">{currentSong.artist}</p>
                  </div>
                  {/* Hiển thị trạng thái animation nếu đang play (optional) */}
                  {isPlaying ? (
                    <div className="flex gap-1 h-3 items-end">
                      <div className="w-1 bg-cyan-400 animate-pulse h-full"></div>
                      <div className="w-1 bg-cyan-400 animate-pulse h-2/3 delay-75"></div>
                      <div className="w-1 bg-cyan-400 animate-pulse h-1/2 delay-150"></div>
                    </div>
                  ) : (
                    <p className="text-xs text-cyan-200">{currentSong.duration}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Queue List */}
            <div>
              <p className="text-xs text-cyan-300 uppercase tracking-wider mb-2 px-2">
                Tiếp theo
              </p>
              {queueSongs.map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => onPlaySong(song)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-cyan-500/30 transition-all group"
                >
                  <span className="text-cyan-300 text-xs w-4">{index + 1}</span>
                  <ImageWithFallback
                    src={song.cover}
                    alt={song.title}
                    className="w-10 h-10 rounded shadow-lg"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm truncate group-hover:text-cyan-100 transition-colors">
                      {song.title}
                    </p>
                    <p className="text-xs text-cyan-200 truncate">{song.artist}</p>
                  </div>
                  <p className="text-xs text-cyan-200">{song.duration}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}