import { Home, Library, ListMusic, Search, Heart, Clock } from 'lucide-react';

interface SidebarProps {
  currentPage: 'home' | 'library' | 'playlists' | 'search' | 'nowplaying' | 'profile';
  onNavigate: (page: 'home' | 'library' | 'playlists' | 'search' | 'nowplaying') => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'home' as const, label: 'Trang chủ', icon: Home },
    { id: 'search' as const, label: 'Tìm kiếm', icon: Search },
    { id: 'library' as const, label: 'Thư viện', icon: Library },
  ];

  const libraryItems = [
    { id: 'playlists' as const, label: 'Playlists', icon: ListMusic },
    { label: 'Bài hát yêu thích', icon: Heart },
    { label: 'Đã phát gần đây', icon: Clock },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-950/80 to-blue-900/60 backdrop-blur-lg border-r border-blue-700/30 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          MusicStream
        </h1>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg shadow-cyan-500/10'
                    : 'text-blue-200 hover:text-white hover:bg-blue-800/30'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Library Section */}
        <div className="mt-8">
          <h2 className="px-4 mb-3 text-sm text-blue-300 uppercase tracking-wider">
            Thư viện của bạn
          </h2>
          <div className="space-y-1">
            {libraryItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = 'id' in item && currentPage === item.id;
              return (
                <button
                  key={index}
                  onClick={() => 'id' in item && onNavigate(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300'
                      : 'text-blue-200 hover:text-white hover:bg-blue-800/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-blue-700/30">
        <div className="bg-gradient-to-br from-blue-800/40 to-cyan-700/40 backdrop-blur rounded-lg p-4 border border-blue-600/20">
          <p className="text-sm text-blue-200 mb-2">
            Tạo playlist đầu tiên của bạn
          </p>
          <button className="text-xs px-4 py-2 bg-white text-blue-900 rounded-full hover:scale-105 transition-transform">
            Tạo playlist
          </button>
        </div>
      </div>
    </aside>
  );
}
