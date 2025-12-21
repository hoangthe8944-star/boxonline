import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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
import { LoginSuccess } from './components/LoginSuccess'; // ✅ Đảm bảo bạn đã tạo file này
import { recordPlayback } from '../api/apiclient';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { logout, getCurrentUser } from '../api/authapi';
import type { Song } from '../api/apiclient';
import './index.css';

export default function App() {
  // --- STATE QUẢN LÝ GIAO DIỆN ---
  const [currentPage, setCurrentPage] = useState<'home' | 'library' | 'playlists' | 'search' | 'nowplaying' | 'profile' | 'create-playlist' | 'liked-songs' | 'recently-played'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- STATE QUẢN LÝ XÁC THỰC ---
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("accessToken"));
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // --- STATE PHÁT NHẠC ---
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playQueue, setPlayQueue] = useState<Song[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);

  // ✅ THEO DÕI THAY ĐỔI URL (Để xử lý trang LoginSuccess và Verify)
  const [currentHash, setCurrentHash] = useState(window.location.hash);
useEffect(() => {
    const savedToken = sessionStorage.getItem("accessToken");
    if (savedToken) setToken(savedToken);
  }, []);

  // ✅ 2. TÁCH BIỆT HOÀN TOÀN TRANG ĐẶC BIỆT
  // Nếu là trang Google trả về hoặc trang Verify, KHÔNG hiện Sidebar/Player
  const isSpecialPage = window.location.hash.includes('/login-success') || window.location.hash.includes('/verify');

  if (isSpecialPage) {
    return (
      <main className="h-screen bg-slate-950">
        {window.location.hash.includes('/login-success') && <LoginSuccess />}
        {window.location.hash.includes('/verify') && <VerifyPage />}
      </main>
    );
  }

  // ✅ HÀM PHÁT NHẠC (Chặn nếu chưa login)
  const handlePlaySong = (song: Song, contextPlaylist: Song[] = []) => {
    if (!sessionStorage.getItem("accessToken")) {
      setAuthView('login');
      setShowAuthModal(true);
      return;
    }

    setCurrentSong(song);
    setIsPlaying(true);
    const newQueue = contextPlaylist.length > 0 ? contextPlaylist : [song];
    setPlayQueue(newQueue);
    const songIndex = newQueue.findIndex(s => s.id === song.id);
    setCurrentQueueIndex(songIndex !== -1 ? songIndex : 0);

    recordPlayback(song.id).catch(err => console.error("API Playback Error:", err));
  };

  const handleNextSong = () => {
    if (!token || playQueue.length === 0) return;
    const nextIndex = (currentQueueIndex + 1) % playQueue.length;
    setCurrentQueueIndex(nextIndex);
    setCurrentSong(playQueue[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevSong = () => {
    if (!token || playQueue.length === 0) return;
    const prevIndex = (currentQueueIndex - 1 + playQueue.length) % playQueue.length;
    setCurrentQueueIndex(prevIndex);
    setCurrentSong(playQueue[prevIndex]);
    setIsPlaying(true);
  };

  // ✅ XỬ LÝ AUTH THÀNH CÔNG (Dùng cho cả Login và Register mới)
  const handleAuthSuccess = (newToken: string) => {
    setToken(newToken);
    // sessionStorage đã được set bên trong LoginForm/RegisterForm gọi setUserSession
    setShowAuthModal(false);
    window.location.reload(); // Làm mới để cập nhật toàn bộ trạng thái User
  };

  const handleLogout = () => {
    logout();
    setToken(null);
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentPage('home');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-700 via-cyan-600 to-cyan-400 text-white overflow-hidden relative">
      
      {/* ✅ MODAL ĐĂNG NHẬP / ĐĂNG KÝ */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-cyan-400 flex items-center gap-2 font-bold"
            >
              <X className="w-6 h-6" /> Đóng
            </button>
            {authView === 'login' ? (
              <LoginForm onLoginSuccess={handleAuthSuccess} onSwitchToRegister={() => setAuthView('register')} />
            ) : (
              <RegisterForm onRegisterSuccess={handleAuthSuccess} onSwitchToLogin={() => setAuthView('login')} />
            )}
          </div>
        </div>
      )}

      {/* Sidebar - Menu bên trái */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          // Nếu vào các trang cá nhân mà chưa login thì hiện modal
          if (!token && ['library', 'playlists', 'profile', 'liked-songs', 'recently-played'].includes(page)) {
            setShowAuthModal(true);
          } else {
            setCurrentPage(page);
          }
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onProfileClick={() => {
          if (!token) setShowAuthModal(true);
          else setCurrentPage('profile');
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
          {/* ✅ XỬ LÝ CÁC TRANG ĐẶC BIỆT (URL HASH) */}
          {currentHash.includes('/verify') && <VerifyPage />}
          {currentHash.includes('/login-success') && <LoginSuccess />}

          {/* ✅ GIAO DIỆN CHÍNH */}
          {!isSpecialPage && (
            <>
              {currentPage === 'home' && <HomePage onPlaySong={handlePlaySong} />}
              {currentPage === 'search' && <SearchPage searchQuery={searchQuery} onPlaySong={handlePlaySong} />}
              
              {/* Chỉ render các trang này nếu đã đăng nhập */}
              {token && (
                <>
                  {currentPage === 'library' && <LibraryPage onPlaySong={handlePlaySong} />}
                  {currentPage === 'playlists' && <PlaylistsPage onPlaySong={handlePlaySong} onCreateClick={() => setCurrentPage('create-playlist')} />}
                  {currentPage === 'nowplaying' && <NowPlayingPage currentSong={currentSong} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(!isPlaying)} onPlaySong={handlePlaySong} />}
                  {currentPage === 'profile' && <ProfilePage onLogout={handleLogout} />}
                  {currentPage === 'liked-songs' && <LikedSongsPage onPlaySong={handlePlaySong} />}
                  {currentPage === 'recently-played' && <RecentlyPlayedPage onPlaySong={handlePlaySong} />}
                  {currentPage === 'create-playlist' && <CreatePlaylistPage onBack={() => setCurrentPage('playlists')} onSubmit={() => setCurrentPage('playlists')} />}
                </>
              )}

              {/* Nếu khách cố tình vào trang cá nhân bằng state thì nhắc login */}
              {!token && ['library', 'profile', 'recently-played'].includes(currentPage) && (
                 <div className="flex flex-col items-center justify-center h-full text-center p-10">
                    <h2 className="text-2xl font-bold mb-4">Giai điệu dành riêng cho bạn</h2>
                    <p className="text-blue-100 mb-8">Hãy đăng nhập để lưu lại lịch sử và bài hát yêu thích</p>
                    <button onClick={() => setShowAuthModal(true)} className="px-8 py-3 bg-cyan-500 rounded-full font-bold hover:scale-105 transition-all">Đăng nhập ngay</button>
                 </div>
              )}
            </>
          )}
        </main>

        <MusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onTogglePlay={() => {
            if (!token) setShowAuthModal(true);
            else setIsPlaying(!isPlaying);
          }}
          onClickPlayer={() => currentSong && setCurrentPage('nowplaying')}
          onNextSong={handleNextSong}
          onPrevSong={handlePrevSong}
        />
      </div>
    </div>
  );
}