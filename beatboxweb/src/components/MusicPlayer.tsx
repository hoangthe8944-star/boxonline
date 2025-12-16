import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react'; // ✅ Thêm useRef
import type { Song } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  // ✅ Thêm 2 props mới để xử lý next/prev từ player
  onNextSong: () => void;
  onPrevSong: () => void;
  onClickPlayer: () => void;
}

export function MusicPlayer({
  currentSong,
  onTogglePlay,
  onNextSong,
  onPrevSong,
  onClickPlayer
}: MusicPlayerProps) {

  // ✅ BƯỚC 1: STATE VÀ REF
  // -------------------------------------------------------------------

  // Ref để giữ đối tượng Audio, giúp nó tồn tại qua các lần re-render mà không bị tạo lại
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State cho thanh trượt và thời gian (giờ sẽ được cập nhật real-time)
  const [progress, setProgress] = useState(0); // % progress
  const [volume, setVolume] = useState(70); // % volume
  const [currentTime, setCurrentTime] = useState(0); // giây hiện tại
  const [duration, setDuration] = useState(0); // tổng số giầy
  const [isPlaying, setIsPlaying] = useState(false);

  const [isLiked, setIsLiked] = useState(false); // Giữ nguyên state này

  // ✅ BƯỚC 2: QUẢN LÝ VIỆC PHÁT NHẠC BẰNG useEffect
  // -------------------------------------------------------------------

  // useEffect này sẽ chạy mỗi khi bài hát thay đổi (currentSong)
  useEffect(() => {
    // Nếu có bài hát mới và có link stream
    if (currentSong && currentSong.streamUrl) {
      // Dừng bài hát cũ (nếu có)
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Tạo một đối tượng Audio mới
      const newAudio = new Audio(currentSong.streamUrl);
      audioRef.current = newAudio;
      audioRef.current.volume = volume / 100; // Set volume ban đầu

      // Lắng nghe các sự kiện từ thẻ Audio
      const audio = audioRef.current;

      // Sự kiện: Khi thời gian phát thay đổi -> CẬP NHẬT THANH PROGRESS
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      };

      // Sự kiện: Khi metadata (như thời lượng) đã được tải
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      // Sự kiện: Khi bài hát kết thúc -> TỰ ĐỘNG CHUYỂN BÀI MỚI
      const handleSongEnd = () => {
        onNextSong();
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleSongEnd);

      // Nếu đang ở trạng thái isPlaying, phát nhạc ngay
      if (isPlaying) {
        audio.play().catch(e => console.error("Lỗi phát nhạc:", e));
      }

      // Cleanup: Gỡ bỏ các event listener khi component unmount hoặc bài hát thay đổi
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleSongEnd);
        audio.pause();
      };
    }
  }, [currentSong]); // Chỉ chạy lại khi `currentSong` thay đổi

  // useEffect này quản lý việc Play/Pause khi prop `isPlaying` thay đổi
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Lỗi phát nhạc:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);


  // ✅ BƯỚC 3: CÁC HÀM XỬ LÝ TƯƠNG TÁC CỦA NGƯỜI DÙNG
  // -------------------------------------------------------------------

  // Xử lý khi người dùng kéo thanh trượt thời lượng (seeking)
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newProgress = Number(e.target.value);
      setProgress(newProgress);
      // Tính toán thời gian mới và tua đến đó
      audioRef.current.currentTime = (newProgress / 100) * duration;
    }
  };

  // Xử lý khi người dùng kéo thanh trượt volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  // Hàm helper để format giây thành dạng mm:ss
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true));
    }
  };

  // -------------------------------------------------------------------

  if (!currentSong) {
    return null;
  }

  // ✅ BƯỚC 4: KẾT NỐI LOGIC VÀO GIAO DIỆN (KHÔNG SỬA JSX)
  // -------------------------------------------------------------------
  return (
    <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-gradient-to-r from-blue-950/95 to-cyan-900/95 backdrop-blur-xl border-t border-blue-700/30 shadow-2xl">
      <div className="px-3 sm:px-6 py-3">
        {/* Main Player Controls */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2">
          {/* Song Info - Clickable */}
          <button
            onClick={onClickPlayer}
            className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 hover:opacity-80 transition-opacity text-left"
          >
            <ImageWithFallback
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg shadow-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white truncate text-sm sm:text-base">{currentSong.title}</p>
              <p className="text-xs sm:text-sm text-blue-300 truncate">{currentSong.artist}</p>
            </div>
          </button>

          {/* Playback Controls */}
          <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
            <button className="hidden sm:block text-blue-300 hover:text-white transition-colors">
              <Shuffle className="w-4 h-4" />
            </button>
            <button onClick={onPrevSong} className="hidden sm:block text-blue-200 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              {isPlaying ? (
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

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`transition-colors ${isLiked ? 'text-cyan-400' : 'text-blue-300 hover:text-white'
                }`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-blue-300" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange} // <--- KẾT NỐI HÀM
                className="w-24 h-1 bg-blue-800/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-cyan-300"
              />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs text-blue-300 w-8 sm:w-10 text-right">{formatTime(currentTime)}</span> {/* <--- HIỂN THỊ THỜI GIAN THẬT */}
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange} // <--- KẾT NỐI HÀM
              className="w-full h-1 bg-blue-800/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-cyan-300"
            />
            <div
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full pointer-events-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-blue-300 w-8 sm:w-10">{formatTime(duration)}</span> {/* <--- HIỂN THỊ THỜI GIAN THẬT */}
        </div>
      </div>
    </div>
  );
}