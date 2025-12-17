import { useState } from 'react';

import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MusicPlayer } from './components/MusicPlayer';
import { HomePage } from './components/HomePage';
import { LibraryPage } from './components/LibraryPage';
import { PlaylistsPage } from './components/PlaylistsPage';
import { SearchPage } from './components/SearchPage';
import { NowPlayingPage } from './components/NowPlayingPage';
import { ProfilePage } from './components/ProfilePage';
import { CreatePlaylistPage } from './components/CreatePlaylistPage';
import { LikedSongsPage } from './components/LikedSongsPage';
import { RecentlyPlayedPage } from './components/RecentlyPlayedPage';

import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { logout } from '../api/authapi';
import type { Song } from '../api/apiclient';
import './index.css';


export interface SongApp {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  streamUrl?: string; // Quan trọng: Bao gồm cả streamUrl
}

export interface Playlist {
  id: string;
  name: string;
  cover: string;
  songCount: number;
  description?: string;
}

export default function App() {
  // --- STATE QUẢN LÝ GIAO DIỆN ---
  const [currentPage, setCurrentPage] = useState<'home' | 'library' | 'playlists' | 'search' | 'nowplaying' | 'profile' | 'create-playlist' | 'liked-songs' | 'recently-played'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- STATE QUẢN LÝ XÁC THỰC ---
  const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // ✅ BƯỚC 2: "NGUỒN CHÂN LÝ DUY NHẤT" VỀ TRẠNG THÁI PHÁT NHẠC
  // -------------------------------------------------------------------
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // State để quản lý hàng đợi phát nhạc
  const [playQueue, setPlayQueue] = useState<Song[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  // -------------------------------------------------------------------


  // ✅ BƯỚC 3: CẬP NHẬT CÁC HÀM XỬ LÝ NHẠC
  // -------------------------------------------------------------------

  // Hàm được gọi khi người dùng chọn một bài hát để phát
  // Nó cũng nhận một danh sách phát (context) để tạo hàng đợi
  const handlePlaySong = (song: Song, contextPlaylist: Song[] = []) => {
    setCurrentSong(song);
    setIsPlaying(true); // Tự động phát nhạc khi chọn

    // Nếu có danh sách phát đi kèm, tạo hàng đợi mới
    const newQueue = contextPlaylist.length > 0 ? contextPlaylist : [song];
    setPlayQueue(newQueue);

    // Tìm vị trí của bài hát trong hàng đợi mới
    const songIndex = newQueue.findIndex(s => s.id === song.id);
    setCurrentQueueIndex(songIndex !== -1 ? songIndex : 0);
  };

  // Hàm bật/tắt phát nhạc
  const handleTogglePlay = () => {
    if (currentSong) {
      setIsPlaying(prev => !prev);
    }
  };

  // Hàm chuyển đến bài hát tiếp theo trong hàng đợi
  const handleNextSong = () => {
    if (playQueue.length === 0) return;
    // Sử dụng toán tử modulo để lặp lại danh sách phát
    const nextIndex = (currentQueueIndex + 1) % playQueue.length;
    setCurrentQueueIndex(nextIndex);
    setCurrentSong(playQueue[nextIndex]);
    setIsPlaying(true);
  };

  // Hàm quay lại bài hát trước đó trong hàng đợi
  const handlePrevSong = () => {
    if (playQueue.length === 0) return;
    // Phép toán modulo cho số âm trong JS
    const prevIndex = (currentQueueIndex - 1 + playQueue.length) % playQueue.length;
    setCurrentQueueIndex(prevIndex);
    setCurrentSong(playQueue[prevIndex]);
    setIsPlaying(true);
  };
  // Các hàm xử lý xác thực
  const handleAuthSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    logout();
    setToken(null);
    setAuthView('login');
    setCurrentSong(null);
    setIsPlaying(false);
    setPlayQueue([]);
  };
  // --- LOGIC ĐIỀU HƯỚNG MÀN HÌNH AUTH ---
  if (!token) {
    const authBackgroundClass = "flex items-center justify-center min-h-screen bg-gray-900 bg-[url('https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat bg-blend-overlay";
    if (authView === 'register') {
      return (
        <div className={authBackgroundClass}>
          <RegisterForm
            onRegisterSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setAuthView('login')}
          />
        </div>
      );
    }
    return (
      <div className={authBackgroundClass}>
        <LoginForm
          onLoginSuccess={handleAuthSuccess}
          onSwitchToRegister={() => setAuthView('register')}
        />
      </div>
    );
  }

  // --- GIAO DIỆN CHÍNH (KHI ĐÃ LOGIN) ---
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-700 via-cyan-600 to-cyan-400 text-white overflow-hidden">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-900/80 backdrop-blur-lg lg:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onProfileClick={() => {
          setCurrentPage('profile');
          setIsSidebarOpen(false);
        }}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={() => setCurrentPage('search')}
        />

        <main className="flex-1 overflow-y-auto pb-32 lg:pb-28">
          {currentPage === 'home' && <HomePage onPlaySong={handlePlaySong} />}
          {currentPage === 'library' && <LibraryPage onPlaySong={handlePlaySong} />}
          {currentPage === 'playlists' && <PlaylistsPage onPlaySong={handlePlaySong} />}
          {currentPage === 'search' && <SearchPage searchQuery={searchQuery} onPlaySong={handlePlaySong} />}

          {currentPage === 'nowplaying' &&
            <NowPlayingPage
              currentSong={currentSong}
              isPlaying={isPlaying} // <--- Truyền state isPlaying xuống
              onTogglePlay={handleTogglePlay} // <--- Truyền hàm toggle xuống
              onPlaySong={(song) => handlePlaySong(song, playQueue)}
            />
          }
          {currentPage === 'profile' && <ProfilePage onLogout={handleLogout} />}
          {currentPage === 'liked-songs' && <LikedSongsPage onPlaySong={handlePlaySong} />}
          {currentPage === 'recently-played' && <RecentlyPlayedPage onPlaySong={handlePlaySong} />}
          {currentPage === 'create-playlist' && (
            <CreatePlaylistPage
              onBack={() => setCurrentPage('playlists')}
              onSubmit={(playlist) => {
                // Here you would typically save the playlist
                console.log('Created playlist:', playlist);
                setCurrentPage('playlists');
              }}
            />
          )}

        </main>

        <MusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying} // <--- Truyền state isPlaying xuống
          onTogglePlay={handleTogglePlay} // <--- Truyền hàm toggle xuống
          onClickPlayer={() => currentSong && setCurrentPage('nowplaying')}
        // Thêm các hàm xử lý next/prev sau này
        />
      </div>
    </div>
  );
}