import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart } from 'lucide-react';
import { useState } from 'react';
import type { Song } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClickPlayer: () => void;
}

export function MusicPlayer({ currentSong, isPlaying, onTogglePlay, onClickPlayer }: MusicPlayerProps) {
  const [progress, setProgress] = useState(45);
  const [volume, setVolume] = useState(70);
  const [isLiked, setIsLiked] = useState(false);

  if (!currentSong) {
    return null;
  }

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
            <button className="hidden sm:block text-blue-200 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={onTogglePlay}
              className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="white" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="white" />
              )}
            </button>
            <button className="hidden sm:block text-blue-200 hover:text-white transition-colors">
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
              className={`transition-colors ${
                isLiked ? 'text-cyan-400' : 'text-blue-300 hover:text-white'
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
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-1 bg-blue-800/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-cyan-300"
              />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs text-blue-300 w-8 sm:w-10 text-right">2:15</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-1 bg-blue-800/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-cyan-300"
            />
            <div 
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full pointer-events-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-blue-300 w-8 sm:w-10">{currentSong.duration}</span>
        </div>
      </div>
    </div>
  );
}