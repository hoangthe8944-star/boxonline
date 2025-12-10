import { Search, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onOpenProfile: () => void;
}

export function Header({ searchQuery, onSearchChange, onSearch, onOpenProfile }: HeaderProps) {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-blue-900/60 to-cyan-800/60 backdrop-blur-xl border-b border-blue-700/30">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full bg-blue-900/40 hover:bg-blue-800/60 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-blue-900/40 hover:bg-blue-800/60 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
            <input
              type="text"
              placeholder="Tìm kiếm bài hát, nghệ sĩ, album..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-blue-950/60 border border-blue-700/40 rounded-full text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Premium Button */}
          <button className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 transition-all">
            Nâng cấp Premium
          </button>

          {/* User Avatar */}
          <button
            onClick={onOpenProfile} // CHUYỂN SANG TRANG PROFILE
            className="relative p-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 hover:scale-110 transition-all shadow-lg ring-4 ring-white/20 group"
          >
            <User className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          </button>        </div>
      </div>
    </header>
  );
}
