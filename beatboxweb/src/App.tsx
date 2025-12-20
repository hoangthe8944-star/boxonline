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
import { recordPlayback } from '../api/apiclient';

import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { logout } from '../api/authapi';
import type { Song } from '../api/apiclient';
import './index.css';


// export interface SongApp {
//   id: string;
//   title: string;
//   artist: string;
//   album: string;
//   duration: string;
//   coverUrl: string;
//   streamUrl?: string; // Quan trọng: Bao gồm cả streamUrl
// }

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
  // ✅ CẬP NHẬT: Hàm phát nhạc thông minh hơn
  const handlePlaySong = (song: Song, contextPlaylist: Song[] = []) => {
    // 1. Cập nhật bài hát hiện tại
    setCurrentSong(song);
    setIsPlaying(true);

    // 2. CẬP NHẬT HÀNG ĐỢI (QUEUE): 
    // Nếu có danh sách đi kèm, dùng danh sách đó. Nếu không, chỉ có 1 bài.
    const newQueue = contextPlaylist.length > 0 ? contextPlaylist : [song];
    setPlayQueue(newQueue);

    // 3. Tìm vị trí của bài hát trong hàng đợi mới để đồng bộ Index
    const songIndex = newQueue.findIndex(s => s.id === song.id);
    setCurrentQueueIndex(songIndex !== -1 ? songIndex : 0);

    // 4. Ghi nhận lượt nghe vào Backend
    if (localStorage.getItem("accessToken")) {
      recordPlayback(song.id).catch(err => console.error("API Playback Error:", err));
    }
  };
  // ✅ CẬP NHẬT: Chuyển bài tiếp theo
  const handleNextSong = () => {
    if (playQueue.length === 0) return;

    let nextIndex = currentQueueIndex + 1;

    // Nếu đi đến cuối danh sách, quay lại bài đầu tiên (Loop)
    if (nextIndex >= playQueue.length) {
      nextIndex = 0;
    }

    const nextSong = playQueue[nextIndex];
    setCurrentQueueIndex(nextIndex);
    setCurrentSong(nextSong);
    setIsPlaying(true);

    // Ghi nhận lượt nghe cho bài tiếp theo
    if (token) recordPlayback(nextSong.id).catch(console.error);
  };

  // ✅ CẬP NHẬT: Quay lại bài trước
  const handlePrevSong = () => {
    if (playQueue.length === 0) return;

    let prevIndex = currentQueueIndex - 1;

    // Nếu đang ở bài đầu mà nhấn back, quay xuống bài cuối cùng
    if (prevIndex < 0) {
      prevIndex = playQueue.length - 1;
    }

    const prevSong = playQueue[prevIndex];
    setCurrentQueueIndex(prevIndex);
    setCurrentSong(prevSong);
    setIsPlaying(true);

    if (token) recordPlayback(prevSong.id).catch(console.error);
  };  // Các hàm xử lý xác thực
  const handleAuthSuccess = (newToken: string) => {
    setToken(newToken);
  };
  const handleTogglePlay = () => {
    if (currentSong) {
      setIsPlaying(prev => !prev);
    }
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
          {currentPage === 'playlists' && (
            <PlaylistsPage
              onPlaySong={handlePlaySong}
              onCreateClick={() => setCurrentPage('create-playlist')}
            />
          )}
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
          onNextSong={handleNextSong}
          onPrevSong={handlePrevSong}
        // Thêm các hàm xử lý next/prev sau này
        />
      </div>
    </div>
  );
}