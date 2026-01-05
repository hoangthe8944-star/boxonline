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

interface LyricLine {
  time: number;
  text: string;
}

interface NowPlayingPageProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  onPlaySong: (song: Song, contextPlaylist: Song[]) => void;
  onTogglePlay: () => void;
}

export function NowPlayingPage({ currentSong, isPlaying, currentTime, onPlaySong, onTogglePlay }: NowPlayingPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [upNextSongs, setUpNextSongs] = useState<Song[]>([]);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [rawLyrics, setRawLyrics] = useState<string>("");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLParagraphElement>(null);

  // Parse Lyrics
  const parsedLyrics = useMemo(() => {
    if (!rawLyrics) return [];
    const lines = rawLyrics.split('\n');
    const result: LyricLine[] = [];
    const syncRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

    lines.forEach(line => {
      const match = line.match(syncRegex);
      if (match) {
        const time = parseInt(match[1]) * 60 + parseInt(match[2]);
        const text = match[4].trim();
        if (text) result.push({ time, text });
      } else {
        const plainText = line.replace(/\[.*?\]/g, '').trim();
        if (plainText) result.push({ time: -1, text: plainText });
      }
    });
    return result;
  }, [rawLyrics]);

  const activeIndex = useMemo(() => {
    let index = -1;
    for (let i = 0; i < parsedLyrics.length; i++) {
      if (parsedLyrics[i].time !== -1 && currentTime >= parsedLyrics[i].time) {
        index = i;
      }
    }
    return index;
  }, [currentTime, parsedLyrics]);

  useEffect(() => {
    if (activeLineRef.current && scrollRef.current) {
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeIndex]);

  useEffect(() => {
    if (!currentSong) return;
    const fetchLyrics = async () => {
      setLyricsLoading(true);
      try {
        const res = await getLyrics(currentSong.title, currentSong.artistName, currentSong.albumName, Math.floor(currentSong.duration / 1000));
        setRawLyrics(res.data.syncedLyrics || res.data.plainLyrics || "Không có lời bài hát");
      } catch (err) { setRawLyrics("Lỗi tải lời bài hát"); } finally { setLyricsLoading(false); }
    };
    fetchLyrics();
  }, [currentSong?.id]);

  useEffect(() => {
    if (!currentSong) return;
    getTrendingSongs(20).then(res => {
      setUpNextSongs(res.data.filter(s => s.id !== currentSong.id).sort(() => Math.random() - 0.5));
    });
  }, [currentSong?.id]);

  if (!currentSong) return null;

  return (
    <div className="h-full w-full flex flex-col lg:flex-row relative overflow-hidden bg-black text-white">
      
      {/* 1. LỚP PHỦ MỜ BACKGROUND (FIXED) */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-[100px] opacity-50 transition-all duration-1000" 
          style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
      </div>

      {/* 2. NỘI DUNG CHÍNH (Z-INDEX CAO) */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row w-full h-full">
        
        {/* Phần bên trái: Info & Lyrics */}
        <div className="flex-1 flex flex-col px-6 py-8 overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center lg:items-start lg:flex-row lg:gap-12">
            
            {/* Album Cover */}
            <div className="flex-shrink-0 mb-8 lg:mb-0">
              <ImageWithFallback
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-64 h-64 sm:w-80 sm:h-80 object-cover rounded-2xl shadow-2xl"
              />
              <div className="mt-6 hidden lg:block">
                 <h2 className="text-3xl font-bold mb-2">{currentSong.title}</h2>
                 <p className="text-cyan-400 text-xl">{currentSong.artistName}</p>
              </div>
            </div>

            {/* Karaoke Lyrics Area */}
            <div className="w-full flex-1">
              <div className="lg:hidden text-center mb-6">
                 <h2 className="text-2xl font-bold">{currentSong.title}</h2>
                 <p className="text-cyan-400">{currentSong.artistName}</p>
              </div>

              <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-white/5 h-[400px] lg:h-[500px]">
                <div ref={scrollRef} className="h-full overflow-y-auto custom-scrollbar flex flex-col space-y-8 pr-4">
                  {lyricsLoading ? (
                    <p className="text-white/20 animate-pulse">Đang tải lời...</p>
                  ) : parsedLyrics.map((line, idx) => (
                    <p
                      key={idx}
                      ref={idx === activeIndex ? activeLineRef : null}
                      className={`text-2xl sm:text-3xl font-black transition-all duration-500 ${
                        idx === activeIndex ? 'text-white scale-105 opacity-100' : 'text-white/10 opacity-30'
                      }`}
                    >
                      {line.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. DANH SÁCH TIẾP THEO (GỌN GÀNG HƠN) */}
        <div className={`fixed lg:static inset-0 lg:inset-auto lg:w-96 bg-black/40 lg:bg-black/20 backdrop-blur-3xl z-40 transition-transform duration-500 border-l border-white/5 ${isQueueOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-bold">Tiếp theo</h3>
            <button onClick={() => setIsQueueOpen(false)} className="lg:hidden"><ChevronDown /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar max-h-[calc(100vh-200px)]">
            {upNextSongs.map((song, index) => (
              <button 
                key={song.id} 
                onClick={() => onPlaySong(song, upNextSongs)}
                className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <span className="text-white/20 text-xs w-4">{index + 1}</span>
                <ImageWithFallback src={song.coverUrl} className="w-12 h-12 rounded-lg shadow-lg" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-bold truncate group-hover:text-cyan-400">{song.title}</p>
                  <p className="text-xs text-white/40 truncate">{song.artistName}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Toggle Queue */}
      <button 
        onClick={() => setIsQueueOpen(true)}
        className="lg:hidden fixed bottom-24 right-6 p-4 bg-cyan-500 rounded-full z-50 shadow-xl"
      >
        <Equal />
      </button>
    </div>
  );
}