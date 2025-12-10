// import { useState } from 'react';
// import { Outlet } from 'react-router-dom'; // Quan trọng: Outlet là nơi các trang con được render
// import { Sidebar } from './Sidebar';
// import { Header } from './Header';
// import { MusicPlayer } from './MusicPlayer';
// import { Song } from '../App'; // Import interface từ App.tsx

// interface MainLayoutProps {
//   onLogout: () => void;
// }

// export function MainLayout({ onLogout }: MainLayoutProps) {
//   // Các state liên quan đến UI được chuyển từ App.tsx vào đây
//   const [currentSong, setCurrentSong] = useState<Song | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const handlePlaySong = (song: Song) => {
//     setCurrentSong(song);
//     setIsPlaying(true);
//     // Lưu ý: Việc chuyển trang nowplaying giờ sẽ do react-router-dom xử lý
//     // bạn sẽ dùng navigate('/nowplaying') thay vì setCurrentPage
//   };

//   const handleTogglePlay = () => {
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-cyan-700 text-white overflow-hidden">
//       <Sidebar />

//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header
//           searchQuery={searchQuery}
//           onSearchChange={setSearchQuery}
//           onLogout={onLogout} // Truyền hàm logout xuống Header
//         />

//         <main className="flex-1 overflow-y-auto pb-32">
//           {/* Outlet sẽ render component trang tương ứng với URL hiện tại */}
//           {/* Ví dụ: URL là /library -> LibraryPage sẽ được render ở đây */}
//           <Outlet context={{ handlePlaySong }} /> 
//         </main>

//         <MusicPlayer
//           currentSong={currentSong}
//           isPlaying={isPlaying}
//           onTogglePlay={handleTogglePlay}
//         />
//       </div>
//     </div>
//   );
// }