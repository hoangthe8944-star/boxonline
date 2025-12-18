import { Heart, MoreHorizontal, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Song {
  id: number;
  title: string;
  artistName: string;
  coverUrl: string;
  duration: string;
}

interface NowPlayingProps {
  currentSong: Song;
  playlist: Song[];
  onBack: () => void;
  onPlaySong: (song: Song) => void;
}

export function NowPlaying({ currentSong, playlist, onBack, onPlaySong }: NowPlayingProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white hover:bg-white/10"
          onClick={onBack}
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
        <span className="text-white/70">Đang phát từ playlist</span>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white hover:bg-white/10"
        >
          <MoreHorizontal className="w-6 h-6" />
        </Button>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl">
          <ImageWithFallback
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Song Info */}
      <div className="px-8 pb-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-3xl truncate mb-2">{currentSong.title}</h1>
            <p className="text-white/70 text-lg">{currentSong.artistName}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white hover:bg-white/10 flex-shrink-0"
          >
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Queue Section */}
      <div className="border-t border-white/10 bg-black/20 flex-1 overflow-hidden">
        <div className="p-6">
          <h3 className="text-white mb-4">Tiếp theo</h3>
          <div className="space-y-2 overflow-y-auto max-h-64">
            {playlist.map((song) => (
              <button
                key={song.id}
                onClick={() => onPlaySong(song)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors ${
                  song.id === currentSong.id ? "bg-white/10" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-white truncate">{song.title}</div>
                  <div className="text-white/60 text-sm truncate">{song.artistName}</div>
                </div>
                <div className="text-white/60 text-sm">{song.duration}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
