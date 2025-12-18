import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
// Sử dụng 'Song' type được định nghĩa trong file API của bạn
import type { Song } from '../../api/apiclient';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Định nghĩa các props mà component này cần từ cha
interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextSong: () => void;
  onPrevSong: () => void;
  onClickPlayer: () => void;
}

// Hàm tiện ích để định dạng thời gian từ giây sang "phút:giây"
const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  // padStart(2, '0') để đảm bảo luôn có 2 chữ số (vd: 0:05 thay vì 0:5)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function MusicPlayer({
  currentSong,
  isPlaying,
  onTogglePlay,
  onNextSong,
  onPrevSong,
  onClickPlayer,
}: MusicPlayerProps) {

  // ✅ PHẦN 1: REFS VÀ STATE NỘI BỘ
  // -------------------------------------------------------------------
  // Ref để giữ đối tượng Audio, giúp nó không bị tạo lại sau mỗi lần render
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State chỉ dành cho giao diện của trình phát nhạc (UI-only state)
  const [progress, setProgress] = useState(0); // Tiến trình bài hát (tính bằng %)
  const [volume, setVolume] = useState(80);    // Âm lượng (tính bằng %)
  const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại (giây)
  const [duration, setDuration] = useState(0);     // Tổng thời lượng (giây)
  const [isLiked, setIsLiked] = useState(false);   // Trạng thái yêu thích

  // ✅ PHẦN 2: QUẢN LÝ LOGIC PHÁT NHẠC VỚI useEffect
  // -------------------------------------------------------------------

  // Hook này chạy mỗi khi `currentSong` thay đổi.
  // Nhiệm vụ: Tải và chuẩn bị bài hát mới.
  useEffect(() => {
    // Nếu không có bài hát nào được chọn, dọn dẹp và thoát
    if (!currentSong || !currentSong.streamUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    // Tạo một đối tượng Audio mới cho bài hát hiện tại
    const audio = new Audio(currentSong.streamUrl);
    audioRef.current = audio;
    audio.volume = volume / 100;

    // --- Lắng nghe các sự kiện quan trọng từ đối tượng Audio ---

    // 1. Khi metadata (thời lượng) đã được tải
    const handleLoadedMetadata = () => setDuration(audio.duration);

    // 2. Khi thời gian phát thay đổi -> Cập nhật UI
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    // 3. Khi bài hát kết thúc -> Gọi callback để tự động chuyển bài
    const handleSongEnd = () => {
      onNextSong();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleSongEnd);
    const playPromise = audio.play();

    // Nếu trạng thái chung là 'playing', bắt đầu phát nhạc ngay
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Lỗi này thường xảy ra nếu người dùng chưa tương tác với trang.
        // Trình duyệt chặn autoplay. `App.tsx` sẽ cần xử lý `isPlaying=false`.
        console.error("Lỗi tự động phát nhạc:", error);
        // Có thể báo lại cho cha để cập nhật UI nếu cần
        onTogglePlay(); // Báo cho cha biết không thể play, hãy set isPlaying=false
      });
    }

    // Hàm dọn dẹp: Chạy khi component unmount hoặc khi `currentSong` thay đổi
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleSongEnd);
      audio.pause(); // Dừng bài hát cũ
    };
  }, [currentSong]); // Chỉ chạy lại hook này khi bài hát thay đổi

  // Hook này chạy mỗi khi trạng thái `isPlaying` từ cha thay đổi.
  // Nhiệm vụ: Đồng bộ hóa hành động play/pause.
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Lỗi khi phát nhạc:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]); // Chỉ chạy lại khi trạng thái isPlaying thay đổi


  // ✅ PHẦN 3: CÁC HÀM XỬ LÝ TƯƠNG TÁC NGƯỜI DÙNG
  // -------------------------------------------------------------------

  // Xử lý khi người dùng kéo thanh trượt thời lượng (tua nhạc)
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && duration > 0) {
      const newProgress = Number(e.target.value);
      setProgress(newProgress);
      audioRef.current.currentTime = (newProgress / 100) * duration;
    }
  };

  // Xử lý khi người dùng kéo thanh trượt âm lượng
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  // Nếu không có bài hát nào, không hiển thị trình phát nhạc
  if (!currentSong) {
    return null;
  }

  // ✅ PHẦN 4: KẾT NỐI LOGIC VÀO GIAO DIỆN (JSX)
  // -------------------------------------------------------------------
  return (
    <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-gradient-to-r from-blue-950/95 to-cyan-900/95 backdrop-blur-xl border-t border-blue-700/30 shadow-2xl">
      <div className="px-3 sm:px-6 py-3">
        {/* Main Player Controls */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2">
          {/* Thông tin bài hát */}
          <button
            onClick={onClickPlayer}
            className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 hover:opacity-80 transition-opacity text-left"
          >
            <ImageWithFallback
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg shadow-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white truncate text-sm sm:text-base">{currentSong.title}</p>
              <p className="text-xs sm:text-sm text-blue-300 truncate">{currentSong.artistName}</p>
            </div>
          </button>

          {/* Các nút điều khiển chính */}
          <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
            <button className="hidden sm:block text-blue-300 hover:text-white transition-colors">
              <Shuffle className="w-4 h-4" />
            </button>
            <button onClick={onPrevSong} className="hidden sm:block text-blue-200 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={onTogglePlay} // Luôn gọi hàm từ cha để thay đổi trạng thái
              className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              {isPlaying ? ( // Hiển thị icon dựa trên prop từ cha
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="white" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="white" />
              )}
            </button>
            <button onClick={onNextSong} className="hidden sm:block text-blue-200 hover:text-white transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
            <button className="hidden sm:block text-blue-300 hover:text-white transition-colors">
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Các nút điều khiển phụ (âm lượng, yêu thích) */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`transition-colors ${isLiked ? 'text-cyan-400' : 'text-blue-300 hover:text-white'}`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-blue-300" />
              <input
                type="range" min="0" max="100" value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-blue-800/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-cyan-300"
              />
            </div>
          </div>
        </div>

        {/* Thanh tiến trình */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs text-blue-300 w-8 sm:w-10 text-right">{formatTime(currentTime)}</span>
          <div className="flex-1 relative group">
            <input
              type="range" min="0" max="100" value={progress}
              onChange={handleProgressChange}
              className="w-full h-1 bg-blue-800/50 rounded-full appearance-none cursor-pointer group-hover:[&::-webkit-slider-thumb]:bg-cyan-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
          <span className="text-xs text-blue-300 w-8 sm:w-10">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}