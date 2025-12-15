// src/components/ProfilePage.tsx (đã fix hoàn toàn)

import { ArrowLeft, User, Mail, Calendar, Shield, LogOut, Settings, Camera, ChevronRight } from 'lucide-react';
import '../ProfilePage.css'
interface ProfilePageProps {
  onLogout: () => void;
}

export function ProfilePage({ onLogout }: ProfilePageProps) {
  // Lấy thông tin user từ localStorage
  let user = null;
  try {
    const rawUser = localStorage.getItem('user') || localStorage.getItem('authUser');
    if (rawUser) user = JSON.parse(rawUser);
  } catch (e) {
    console.error('Parse user error:', e);
  }

  const name = user?.name || user?.username || user?.email?.split('@')[0] || 'Người dùng';
  const email = user?.email || 'unknown@email.com';
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Không rõ';
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-cyan-700 via-blue-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative h-full flex items-end pb-10 px-10">
          <div className="flex items-end gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-2 shadow-2xl">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-24 h-24 text-cyan-300" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-4 right-4 p-3 bg-black/70 hover:bg-black/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6" />
              </button>
            </div>

            {/* Info */}
            <div className="mb-4">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-6xl font-black">{name}</h1>
                {isAdmin && (
                  <div className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center gap-2 text-sm font-bold">
                    <Shield className="w-5 h-5" />
                    ADMIN
                  </div>
                )}
              </div>
              <p className="text-2xl text-cyan-200 flex items-center gap-3">
                <Mail className="w-6 h-6" />
                {email}
              </p>
              <p className="mt-3 text-gray-300 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Tham gia từ {joinDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-4xl mx-auto px-10 py-12">
        <div className="space-y-4">
          <button className="w-full p-6 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between transition-all group">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-cyan-600/30 rounded-xl">
                <User className="w-7 h-7 text-cyan-300" />
              </div>
              <div className="text-left">
                <p className="text-xl font-semibold">Thông tin cá nhân</p>
                <p className="text-gray-400">Cập nhật hồ sơ, ảnh đại diện</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-white transition" />
          </button>

          <button className="w-full p-6 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between transition-all group">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-purple-600/30 rounded-xl">
                <Settings className="w-7 h-7 text-purple-300" />
              </div>
              <div className="text-left">
                <p className="text-xl font-semibold">Cài đặt</p>
                <p className="text-gray-400">Giao diện, thông báo, ngôn ngữ</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-white transition" />
          </button>

          {/* Nút đăng xuất – ĐÃ SỬA LỖI TẠI ĐÂY */}
          <button
            onClick={onLogout}
            className="w-full p-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-2xl flex items-center justify-center gap-4 font-bold text-lg shadow-2xl transition-all"
          >
            <LogOut className="w-7 h-7" />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}