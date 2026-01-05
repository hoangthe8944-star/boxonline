import { Play, Heart, Shuffle, Repeat, ChevronDown, Equal, Pause, Music2 } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';

// ✅ IMPORT API
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

interface LyricLine {
  time: number;
  text: string;
}

interface NowPlayingPageProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number; // 👈 Thời gian hiện tại từ thẻ <audio>
  onPlaySong: (song: Song, contextPlaylist: Song[]) => void;
  onTogglePlay: () => void;
}

export function NowPlayingPage({ currentSong, isPlaying, currentTime, onPlaySong, onTogglePlay }: NowPlayingPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [upNextSongs, setUpNextSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [rawLyrics, setRawLyrics] = useState<string>("");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLParagraphElement>(null);

  // 1. Logic Parse lời bài hát Karaoke (Dòng có thời gian [mm:ss.xx])
  const parsedLyrics = useMemo(() => {
    if (!rawLyrics) return [];
    
    // Kiểm tra nếu có định dạng thời gian [00:00.00]
    const hasSync = rawLyrics.includes('[');
    if (!hasSync) {
        return rawLyrics.split('\n').map(line => ({ time: -1, text: line }));
    }

    const lines = rawLyrics.split('\n');
    const result: LyricLine[] = [];
    const syncRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

    lines.forEach(line => {
      const match = line.match(syncRegex);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = parseInt(match[3]);
        const time = minutes * 60 + seconds + (milliseconds > 100 ? milliseconds / 1000 : milliseconds / 100);
        const text = match[4].trim();
        if (text) result.push({ time, text });
      }
    });
    return result;
  }, [rawLyrics]);

  // 2. Tìm dòng hiện tại để highlight
  const activeIndex = useMemo(() => {
    let index = -1;
    for (let i = 0; i < parsedLyrics.length; i++) {
      if (parsedLyrics[i].time !== -1 && currentTime >= parsedLyrics[i].time) {
        index = i;
      } else if (parsedLyrics[i].time !== -1 && currentTime < parsedLyrics[i].time) {
        break;
      }
    }
    return index;
  }, [currentTime, parsedLyrics]);

  // 3. Tự động cuộn khi đổi dòng
  useEffect(() => {
    if (activeLineRef.current && scrollRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex]);

  // Gọi API lấy lời bài hát
  useEffect(() => {
    if (!currentSong) return;
    const fetchLyrics = async () => {
      setLyricsLoading(true);
      setRawLyrics("");
      try {
        const durationSeconds = Math.floor(currentSong.duration / 1000);
        const res = await getLyrics(currentSong.title, currentSong.artistName, currentSong.albumName, durationSeconds);
        // Ưu tiên syncedLyrics (Karaoke), nếu không có dùng plainLyrics (Văn bản thường)
        setRawLyrics(res.data.syncedLyrics || res.data.plainLyrics || "Không tìm thấy lời bài hát");
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
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchAndRefreshQueue();
  }, [currentSong?.id]);

  if (!currentSong) return null;

  return (
    <div className="h-full flex flex-col lg:flex-row relative overflow-hidden bg-zinc-950">
      
      {/* ✅ BACKGROUND ẢNH BÌA PHỦ MỜ TOÀN MÀN HÌNH */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-[80px] opacity-40" 
          style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Phần bên trái - Thông tin & Lời bài hát */}
      <div className="flex-1 flex flex-col px-4 sm:px-8 py-6 z-10 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-xl mx-auto">
          
          {/* Album Cover - Cân đối hơn */}
          <div className="relative mb-8 flex justify-center">
            <ImageWithFallback
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-64 h-64 sm:w-80 sm:h-80 object-cover rounded-2xl shadow-2xl shadow-black/60"
            />
          </div>

          {/* Song Info & Nút Like */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 truncate">{currentSong.title}</h2>
                <p className="text-cyan-400 text-lg font-medium">{currentSong.artistName}</p>
              </div>
              <button onClick={() => setIsLiked(!isLiked)} className={`p-3 rounded-full transition-all ${isLiked ? 'bg-cyan-400/20 text-cyan-400' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
                <Heart fill={isLiked ? "currentColor" : "none"} className="w-6 h-6" />
              </button>
            </div>

            {/* ✅ NÚT PLAY GRADIENT NHƯ CŨ */}
            <div className="flex items-center gap-3">
              <button
                onClick={onTogglePlay}
                className="flex items-center justify-center gap-2 flex-1 py-3.5 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white font-bold rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-cyan-500/25"
              >
                {isPlaying ? <><Pause className="w-5 h-5 fill-current" /> Tạm dừng</> : <><Play className="w-5 h-5 fill-current" /> Phát ngay</>}
              </button>
              <button className="p-3.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><Shuffle className="w-5 h-5" /></button>
              <button className="p-3.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><Repeat className="w-5 h-5" /></button>
              <button onClick={() => setIsQueueOpen(!isQueueOpen)} className="lg:hidden p-3.5 bg-white/10 hover:bg-white/20 rounded-full text-white"><Equal className="w-5 h-5" /></button>
            </div>
          </div>

          {/* ✅ KHUNG LỜI BÀI HÁT KARAOKE (NHỎ GỌN & HIỆU ỨNG) */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8">
            <h3 className="text-white/30 text-xs font-bold uppercase tracking-widest mb-6">Lyrics</h3>
            <div 
              ref={scrollRef}
              className="h-[300px] overflow-y-auto custom-scrollbar space-y-5 scroll-smooth pr-2"
            >
              {lyricsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-6 bg-white/5 rounded animate-pulse w-3/4" />)}
                </div>
              ) : parsedLyrics.length > 0 ? (
                parsedLyrics.map((line, idx) => (
                  <p
                    key={idx}
                    ref={idx === activeIndex ? activeLineRef : null}
                    className={`text-xl sm:text-2xl font-bold transition-all duration-300 transform origin-left leading-snug ${
                      idx === activeIndex 
                        ? 'text-white scale-105 opacity-100 translate-x-2' 
                        : 'text-white/20 scale-100 opacity-40'
                    }`}
                  >
                    {line.text}
                  </p>
                ))
              ) : (
                <p className="text-white/20 text-center italic">Không tìm thấy lời bài hát</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Queue Panel (Danh sách tiếp theo) */}
      <div className={`fixed lg:static bottom-0 left-0 right-0 lg:w-80 bg-zinc-900/95 backdrop-blur-2xl border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col transition-transform duration-500 z-30 ${isQueueOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'} rounded-t-[40px] lg:rounded-none max-h-[65vh] lg:max-h-none shadow-2xl`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white text-lg">Tiếp theo</h3>
            <button onClick={() => setIsQueueOpen(false)} className="lg:hidden p-2 text-white/60"><ChevronDown /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {upNextSongs.map((song, index) => (
              <button key={song.id} onClick={() => onPlaySong(song, upNextSongs)} className="w-full flex items-center gap-4 p-2 rounded-2xl hover:bg-white/5 transition-all group">
                <span className="text-white/20 text-xs font-bold w-4">{index + 1}</span>
                <ImageWithFallback src={song.coverUrl} className="w-12 h-12 rounded-xl shadow-lg" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">{song.title}</p>
                  <p className="text-xs text-white/40 truncate">{song.artistName}</p>
                </div>
                <span className="text-[10px] text-white/20 font-medium">{formatDuration(song.duration / 1000)}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}