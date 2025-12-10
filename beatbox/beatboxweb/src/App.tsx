import { useState } from 'react';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MusicPlayer } from './components/MusicPlayer';
import { HomePage } from './components/HomePage';
import { LibraryPage } from './components/LibraryPage';
import { PlaylistsPage } from './components/PlaylistsPage';
import { SearchPage } from './components/SearchPage';
import { NowPlayingPage } from './components/NowPlayingPage';
import { ProfilePage } from './components/ProfilePage';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { logout } from '../api/authapi'; // Import hàm logout nếu cần dùng sau này
import './index.css';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
}

export interface Playlist {
  id: string;
  name: string;
  cover: string;
  songCount: number;
  description?: string;
}

export default function App() {
  // State quản lý trang nội dung nhạc
  const [currentPage, setCurrentPage] = useState<'home' | 'library' | 'playlists' | 'search' | 'nowplaying' | 'profile'>('home');
  
  // State quản lý trình phát nhạc
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State quản lý xác thực
  const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));
  
  // State mới: Quản lý đang ở màn hình 'login' hay 'register'
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentPage('nowplaying');
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Hàm xử lý khi Đăng nhập/Đăng ký thành công
  const handleAuthSuccess = (newToken: string) => {
    setToken(newToken);
    // Khi có token, React sẽ tự render lại giao diện chính (phần return phía dưới)
  };

  // Hàm đăng xuất (có thể truyền xuống Sidebar hoặc Header)
  const handleLogout = () => {
    logout(); 
    setToken(null);
    setAuthView('login'); // Reset về trang login
    setCurrentSong(null); // Tắt nhạc đang phát
    setIsPlaying(false);
  };

  // --- LOGIC ĐIỀU HƯỚNG MÀN HÌNH AUTH ---
  // Nếu chưa có token -> Hiển thị Login hoặc Register
  if (!token) {
    // Style background chung cho màn hình auth
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
    
    // Mặc định là Login view
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
    <div className="flex h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-cyan-700 text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={() => setCurrentPage('search')}
          onOpenProfile={() => setCurrentPage('profile')}
          // Bạn có thể truyền thêm prop onLogout={handleLogout} vào Header nếu muốn nút đăng xuất ở đó
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-32">
          {currentPage === 'home' && <HomePage onPlaySong={handlePlaySong} />}
          {currentPage === 'library' && <LibraryPage onPlaySong={handlePlaySong} />}
          {currentPage === 'playlists' && <PlaylistsPage onPlaySong={handlePlaySong} />}
          {currentPage === 'search' && <SearchPage searchQuery={searchQuery} onPlaySong={handlePlaySong} />}
          {currentPage === 'nowplaying' && <NowPlayingPage currentSong={currentSong} onPlaySong={handlePlaySong} />}
          {currentPage === 'profile' && <ProfilePage onLogout={handleLogout} />}
        </main>

        {/* Music Player */}
        <MusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onClickPlayer={() => currentSong && setCurrentPage('nowplaying')}
        />
      </div>
    </div>
  );
}