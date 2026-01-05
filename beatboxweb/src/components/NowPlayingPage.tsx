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
  currentTime: number; // Thời gian hiện tại tính bằng giây
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
  const [isSynced, setIsSynced] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLParagraphElement>(null);

  // 1. Logic Parse lời bài hát Karaoke
  const parsedLyrics = useMemo(() => {
    if (!rawLyrics) return [];
    if (!rawLyrics.includes('[')) {
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
        const time = parseInt(match[1]) * 60 + parseInt(match[2]);
        const text = match[4].trim();
        if (text) result.push({ time, text });
      }
    });
    return result;
  }, [rawLyrics]);

  // 2. Tìm dòng hiện tại (Highlight cực mạnh)
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

  // 3. Cuộn mượt mà
  useEffect(() => {
    if (activeLineRef.current && scrollRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex]);

  // Logic gọi API lấy lời
  useEffect(() => {
    if (!currentSong) return;
    const fetchLyrics = async () => {
      setLyricsLoading(true);
      setRawLyrics("");
      try {
        const durationSeconds = Math.floor(currentSong.duration / 1000);
        const res = await getLyrics(currentSong.title, currentSong.artistName, currentSong.albumName, durationSeconds);
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
    <div className="h-full flex flex-col lg:flex-row relative overflow-hidden bg-black text-white">

      {/* ✅ BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
      />

      {/* ✅ BLUR LAYER */}
      <div className="absolute inset-0 z-0 backdrop-blur-3xl bg-black/40" />

      {/* ✅ DARK OVERLAY */}
      <div className="absolute inset-0 z-0 bg-black/30" />

      {/* Phần bên trái - Music Info & Karaoke */}
      <div className="flex-1 flex flex-col px-6 py-8 z-10 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-xl mx-auto flex flex-col items-center">

          {/* Album Art */}
          <div className="w-64 h-64 sm:w-72 sm:h-72 relative mb-10">
            <ImageWithFallback
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Info & Control Buttons (Giữ nguyên logic nút) */}
          <div className="w-full text-center mb-10">
            <h2 className="text-3xl font-black mb-2 truncate">{currentSong.title}</h2>
            <p className="text-cyan-400 text-xl font-medium mb-8">{currentSong.artistName}</p>

            <div className="flex items-center justify-center gap-6">
              <button onClick={() => setIsLiked(!isLiked)} className={`p-3 rounded-full transition-all ${isLiked ? 'text-red-500' : 'text-white/40 hover:text-white'}`}>
                <Heart fill={isLiked ? "currentColor" : "none"} className="w-8 h-8" />
              </button>
              <button onClick={onTogglePlay} className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl">
                {isPlaying ? <Pause fill="black" size={32} /> : <Play fill="black" size={32} />}
              </button>
              <button className="text-white/40 hover:text-white transition-colors"><Shuffle className="w-6 h-6" /></button>
            </div>
          </div>

          {/* ✅ KARAOKE BOX: NỔI BẬT DÒNG ĐANG HÁT */}
          <div className="w-full bg-white/5 backdrop-blur-md rounded-[40px] p-8 border border-white/10 shadow-2xl">
            <h3 className="text-white/20 text-xs uppercase tracking-[0.3em] mb-6 font-bold">Lyrics</h3>
            <div
              ref={scrollRef}
              className="h-[350px] overflow-y-auto custom-scrollbar flex flex-col space-y-8 scroll-smooth pr-4"
            >
              {lyricsLoading ? (
                <p className="text-white/20 animate-pulse text-center text-lg">Đang tìm lời...</p>
              ) : parsedLyrics.length > 0 ? (
                parsedLyrics.map((line, idx) => (
                  <p
                    key={idx}
                    ref={idx === activeIndex ? activeLineRef : null}
                    className={`text-2xl sm:text-3xl font-black transition-all duration-500 leading-tight tracking-tight ${idx === activeIndex
                        ? 'text-white opacity-100 scale-110 translate-x-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                        : 'text-white/10 opacity-30 blur-[0.5px]'
                      }`}
                  >
                    {line.text}
                  </p>
                ))
              ) : (
                <p className="text-white/20 text-center text-lg">Chưa có lời bài hát này</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ NEXT SONG PANEL: MỜ & ĂN NHẬP VỚI BACKGROUND */}
      <div className={`fixed lg:static bottom-0 left-0 right-0 lg:w-96 bg-black/30 backdrop-blur-2xl border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col transition-transform duration-500 z-30 ${isQueueOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'} rounded-t-[40px] lg:rounded-none max-h-[60vh] lg:max-h-none`}>
        <div className="p-8 border-b border-white/5">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-xl tracking-tight">Tiếp theo</h3>
            <button onClick={() => setIsQueueOpen(false)} className="lg:hidden text-white/50"><ChevronDown /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {upNextSongs.map((song, index) => (
            <button
              key={song.id}
              onClick={() => onPlaySong(song, upNextSongs)}
              className="w-full flex items-center gap-4 p-3 rounded-3xl hover:bg-white/10 transition-all group"
            >
              <span className="text-white/10 font-bold text-xs w-4">{index + 1}</span>
              <ImageWithFallback src={song.coverUrl} className="w-14 h-14 rounded-2xl shadow-lg group-hover:scale-105 transition-transform" />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">{song.title}</p>
                <p className="text-xs text-white/40 truncate mt-1">{song.artistName}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Nút Equal cho Mobile (Nổi bật hơn) */}
      {!isQueueOpen && (
        <button
          onClick={() => setIsQueueOpen(true)}
          className="lg:hidden fixed bottom-28 right-8 p-5 bg-white text-black rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.3)] z-40"
        >
          <Equal className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}