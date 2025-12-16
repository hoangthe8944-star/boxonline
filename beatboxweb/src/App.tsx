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
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { logout } from '../api/authapi';
import './index.css';

export interface Song {
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
  // State quản lý trang nội dung
  const [currentPage, setCurrentPage] = useState<'home' | 'library' | 'playlists' | 'search' | 'nowplaying' | 'profile'>('home');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  
  // ========================================================================
  // === "NGUỒN CHÂN LÝ DUY NHẤT" VỀ TRẠNG THÁI PHÁT NHẠC ===
  // State này sẽ được cập nhật bởi NowPlayingPage thông qua callback.
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);
  // ========================================================================

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State quản lý xác thực
  const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [isPlaying, setIsPlaying] = useState(false);

  // Hàm được gọi khi người dùng chọn một bài hát để phát
  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setCurrentPage('nowplaying');
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
    setIsActuallyPlaying(false); // Reset trạng thái nhạc khi logout
  };
  const handleTogglePlay = () => {
    if (currentSong) {
      setIsPlaying(prev => !prev);
    }
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
      {/* ... (Sidebar và Header giữ nguyên) ... */}
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
          {/* Truyền hàm handlePlaySong xuống các trang có danh sách bài hát */}
          {currentPage === 'home' && <HomePage onPlaySong={handlePlaySong} />}
          {currentPage === 'library' && <LibraryPage onPlaySong={handlePlaySong} />}
          {currentPage === 'playlists' && <PlaylistsPage onPlaySong={handlePlaySong} />}
          {currentPage === 'search' && <SearchPage searchQuery={searchQuery} onPlaySong={handlePlaySong} />}
          
          {currentPage === 'nowplaying' && 
            <NowPlayingPage 
              currentSong={currentSong}
              isPlaying={isPlaying} // <--- Truyền state isPlaying xuống
              onTogglePlay={handleTogglePlay} // <--- Truyền hàm toggle xuống
              onPlaySong={handlePlaySong} // Để phát bài khác từ danh sách chờ
            />
          }

          {currentPage === 'profile' && <ProfilePage onLogout={handleLogout} />}
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