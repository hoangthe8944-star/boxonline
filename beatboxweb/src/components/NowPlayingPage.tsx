import { Play, Heart, Shuffle, Repeat, ChevronDown, Equal, Pause, Music2 } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';

// ✅ CẬP NHẬT IMPORT: Sử dụng getLyrics mới
import type { Song } from '../../api/apiclient';
import { getTrendingSongs, getLyrics } from '../../api/apiclient';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

const ImageWithFallback = ({ src, fallback, ...props }: ImageWithFallbackProps) => {
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [src]);
  if (imgError || !src) {
    return (
      <div {...props} className={`${props.className} flex items-center justify-center bg-white/5`}>
        {fallback || <Music2 className="w-1/2 h-1/2 text-white/20" />}
      </div>
    );
  }
  return <img {...props} src={src} onError={() => setImgError(true)} />;
};

const formatDuration = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Interface cho dòng lời nhạc đã parse
interface LyricLine {
  time: number;
  text: string;
}

interface NowPlayingPageProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number; // 👈 CẦN THIÊT: Thời gian bài hát hiện tại (giây)
  onPlaySong: (song: Song, contextPlaylist: Song[]) => void;
  onTogglePlay: () => void;
}

export function NowPlayingPage({ currentSong, isPlaying, currentTime, onPlaySong, onTogglePlay }: NowPlayingPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [upNextSongs, setUpNextSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [rawLyrics, setRawLyrics] = useState<string>("");
  const [isSynced, setIsSynced] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLParagraphElement>(null);

  // 1. Logic Parse lời bài hát từ định dạng [mm:ss.xx]
  const parsedLyrics = useMemo(() => {
    if (!rawLyrics || !rawLyrics.includes('[')) {
      setIsSynced(false);
      return rawLyrics.split('\n').map(line => ({ time: 0, text: line }));
    }

    setIsSynced(true);
    const lines = rawLyrics.split('\n');
    const result: LyricLine[] = [];
    const syncRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

    lines.forEach(line => {
      const match = line.match(syncRegex);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const time = minutes * 60 + seconds;
        const text = match[4].trim();
        if (text) result.push({ time, text });
      }
    });
    return result;
  }, [rawLyrics]);

  // 2. Tìm dòng hiện tại dựa trên currentTime
  const activeIndex = useMemo(() => {
    if (!isSynced) return -1;
    let index = -1;
    for (let i = 0; i < parsedLyrics.length; i++) {
      if (currentTime >= parsedLyrics[i].time) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [currentTime, parsedLyrics, isSynced]);

  // 3. Tự động cuộn tới dòng đang hát
  useEffect(() => {
    if (activeLineRef.current && scrollRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex]);

  // Logic gọi API
  useEffect(() => {
    if (!currentSong) return;
    const fetchLyrics = async () => {
      setLyricsLoading(true);
      setRawLyrics("");
      try {
        const durationSeconds = Math.floor(currentSong.duration / 1000);
        const res = await getLyrics(currentSong.title, currentSong.artistName, currentSong.albumName, durationSeconds);
        
        // Ưu tiên syncedLyrics để làm karaoke, nếu không có thì dùng plainLyrics
        if (res.data && (res.data.syncedLyrics || res.data.plainLyrics)) {
          setRawLyrics(res.data.syncedLyrics || res.data.plainLyrics);
        } else {
          setRawLyrics("Không tìm thấy lời bài hát");
        }
      } catch (err) {
        setRawLyrics("Chưa có lời bài hát cho ca khúc này");
      } finally {
        setLyricsLoading(false);
      }
    };
    fetchLyrics();
  }, [currentSong?.id]);

  useEffect(() => {
    if (!currentSong) return;
    const fetchAndRefreshQueue = async () => {
      setIsLoading(true);
      try {
        const response = await getTrendingSongs(20);
        const filtered = response.data.filter(s => s.id !== currentSong.id).sort(() => Math.random() - 0.5);
        setUpNextSongs(filtered);
      } catch (err) { setError("Không thể tải danh sách"); } finally { setIsLoading(false); }
    };
    fetchAndRefreshQueue();
  }, [currentSong?.id]);

  if (!currentSong) return null;

  return (
    <div className="h-full flex flex-col lg:flex-row relative overflow-hidden bg-black">
      {/* Background Blur */}
      <div className="absolute inset-0 opacity-30 blur-3xl" style={{backgroundImage: `url(${currentSong.coverUrl})`, backgroundSize: 'cover'}}></div>

      {/* Phần bên trái - Music Info */}
      <div className="flex-1 flex flex-col px-6 py-8 z-10 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
          {/* Album Art - Nhỏ gọn hơn */}
          <div className="w-64 h-64 sm:w-80 sm:h-80 relative mb-8">
            <ImageWithFallback
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </div>

          {/* Song Info */}
          <div className="w-full text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">{currentSong.title}</h2>
            <p className="text-cyan-400 text-lg">{currentSong.artistName}</p>
            
            <div className="flex items-center justify-center gap-6 mt-6">
              <button onClick={() => setIsLiked(!isLiked)} className={`p-3 rounded-full transition-all ${isLiked ? 'text-red-500' : 'text-white/60'}`}>
                <Heart fill={isLiked ? "currentColor" : "none"} className="w-7 h-7" />
              </button>
              <button onClick={onTogglePlay} className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform">
                {isPlaying ? <Pause fill="black" /> : <Play fill="black" />}
              </button>
              <button className="text-white/60"><Shuffle className="w-6 h-6" /></button>
            </div>
          </div>

          {/* Lyrics Box - Cải tiến: Hát tới đâu sáng tới đó */}
          <div className="w-full bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-md">
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4 font-bold">Lyrics</h3>
            <div 
              ref={scrollRef}
              className="h-64 sm:h-80 overflow-y-auto custom-scrollbar flex flex-col space-y-6 scroll-smooth"
            >
              {lyricsLoading ? (
                <p className="text-white/20 animate-pulse text-center">Đang tải lời bài hát...</p>
              ) : parsedLyrics.length > 0 ? (
                parsedLyrics.map((line, idx) => (
                  <p
                    key={idx}
                    ref={idx === activeIndex ? activeLineRef : null}
                    className={`text-xl sm:text-2xl font-bold transition-all duration-500 leading-tight ${
                      idx === activeIndex 
                        ? 'text-white scale-105 opacity-100' 
                        : 'text-white/20 scale-100 opacity-40 hover:opacity-60'
                    }`}
                  >
                    {line.text}
                  </p>
                ))
              ) : (
                <p className="text-white/20 text-center">Không có lời bài hát</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Queue Panel (Giữ nguyên giao diện của bạn) */}
      <div className={`fixed lg:static bottom-0 left-0 right-0 lg:w-96 bg-zinc-900/90 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col transition-transform duration-300 z-30 ${isQueueOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'} rounded-t-3xl lg:rounded-none max-h-[60vh] lg:max-h-none`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white">Up Next</h3>
            <button onClick={() => setIsQueueOpen(false)} className="lg:hidden text-white"><ChevronDown /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {upNextSongs.map((song) => (
              <button key={song.id} onClick={() => onPlaySong(song, upNextSongs)} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all">
                <ImageWithFallback src={song.coverUrl} className="w-12 h-12 rounded-lg" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white truncate">{song.title}</p>
                  <p className="text-xs text-white/40">{song.artistName}</p>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Mobile Toggle Queue */}
      {!isQueueOpen && (
        <button 
          onClick={() => setIsQueueOpen(true)}
          className="lg:hidden fixed bottom-24 right-6 p-4 bg-cyan-500 text-white rounded-full shadow-2xl z-40"
        >
          <Equal className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}