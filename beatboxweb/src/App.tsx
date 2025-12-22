import { useState, useEffect } from 'react';
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
import { VerifyPage } from './components/VerifyPage';
import { LoginSuccess } from './components/LoginSuccess';
import { recordPlayback } from '../api/apiclient';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { logout } from '../api/authapi';
import type { Song } from '../api/apiclient';
import './index.css';

export interface Playlist {
  id: string;
  name: string;
  cover: string;
  songCount: number;
  description?: string;
}


export default function App() {
  // --- STATE QUẢN LÝ ---
  const [currentPage, setCurrentPage] = useState<'home' | 'library' | 'playlists' | 'search' | 'nowplaying' | 'profile' | 'create-playlist' | 'liked-songs' | 'recently-played'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("accessToken"));
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // --- STATE NHẠC ---
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playQueue, setPlayQueue] = useState<Song[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);


  
  // ✅ 1. THEO DÕI URL HASH (Xử lý mượt mà cho GitHub Pages)
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ✅ 2. XỬ LÝ AUTH THÀNH CÔNG
  const handleAuthSuccess = (newToken: string) => {
    setToken(newToken);
    // Reload để xóa sạch state cũ và nạp dữ liệu user mới từ session
    window.location.href = "/boxonline/"; 
  };

  const handleLogout = () => {
    logout();
    setToken(null);
    setCurrentSong(null);
    setIsPlaying(false);
    window.location.reload();
  };

  // ✅ 3. HÀM PHÁT NHẠC
  const handlePlaySong = (song: Song, contextPlaylist: Song[] = []) => {
    setCurrentSong(song);
    setIsPlaying(true);
    const newQueue = contextPlaylist.length > 0 ? contextPlaylist : [song];
    setPlayQueue(newQueue);
    const songIndex = newQueue.findIndex(s => s.id === song.id);
    setCurrentQueueIndex(songIndex !== -1 ? songIndex : 0);
    recordPlayback(song.id).catch(err => console.error("Playback record error:", err));
  };

  // =========================================================
  // 🛡️ CHIẾN THUẬT RENDER TÁCH BIỆT (KHÔNG CHỒNG LẤP)
  // =========================================================

  // TRƯỜNG HỢP A: Đang ở trang xử lý của Google hoặc Verify (Render Full màn hình)
  if (currentHash.includes('/login-success')) return <LoginSuccess />;
  if (currentHash.includes('/verify')) return <VerifyPage />;

  // TRƯỜNG HỢP B: Chưa đăng nhập (Render Full trang Login/Register)
  if (!token) {
    const authBg = "flex items-center justify-center min-h-screen bg-slate-950 bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-blend-overlay";
    return (
      <div className={authBg}>
        <div className="w-full max-w-md p-4 animate-in fade-in duration-500">
          {authView === 'login' ? (
            <LoginForm onLoginSuccess={handleAuthSuccess} onSwitchToRegister={() => setAuthView('register')} />
          ) : (
            <RegisterForm onRegisterSuccess={handleAuthSuccess} onSwitchToLogin={() => setAuthView('login')} />
          )}
        </div>
      </div>
    );
  }

  // TRƯỜNG HỢP C: Đã đăng nhập (Render Giao diện App chính)
  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden relative">
      
      {/* Sidebar */}
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

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={() => setCurrentPage('search')}
        />

        <main className="flex-1 overflow-y-auto pb-32">
          {currentPage === 'home' && <HomePage onPlaySong={handlePlaySong} />}
          {currentPage === 'library' && <LibraryPage onPlaySong={handlePlaySong} />}
          {currentPage === 'search' && <SearchPage searchQuery={searchQuery} onPlaySong={handlePlaySong} />}
          {currentPage === 'playlists' && <PlaylistsPage onPlaySong={handlePlaySong} onCreateClick={() => setCurrentPage('create-playlist')} />}
          {currentPage === 'profile' && <ProfilePage onLogout={handleLogout} />}
          {currentPage === 'liked-songs' && <LikedSongsPage onPlaySong={handlePlaySong} />}
          {currentPage === 'recently-played' && <RecentlyPlayedPage onPlaySong={handlePlaySong} />}
          {currentPage === 'nowplaying' && <NowPlayingPage currentSong={currentSong} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(!isPlaying)} onPlaySong={handlePlaySong} />}
          {currentPage === 'create-playlist' && <CreatePlaylistPage onBack={() => setCurrentPage('playlists')} onSubmit={() => setCurrentPage('playlists')} />}
        </main>

        <MusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onClickPlayer={() => currentSong && setCurrentPage('nowplaying')}
          onNextSong={() => {
             const next = (currentQueueIndex + 1) % playQueue.length;
             handlePlaySong(playQueue[next], playQueue);
          }}
          onPrevSong={() => {
             const prev = (currentQueueIndex - 1 + playQueue.length) % playQueue.length;
             handlePlaySong(playQueue[prev], playQueue);
          }}
        />
      </div>
    </div>
  );
}