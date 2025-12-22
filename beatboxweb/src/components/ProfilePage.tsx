// src/components/ProfilePage.tsx

import { User, Mail, Calendar, Shield, LogOut, Settings, Camera, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getCurrentUser } from '../../api/authapi'; // Import hàm lấy user chuẩn
import '../ProfilePage.css';

interface ProfilePageProps {
  onLogout: () => void;
}

export function ProfilePage({ onLogout }: ProfilePageProps) {
  // ✅ 1. SỬA: Lấy thông tin user từ sessionStorage thông qua hàm getCurrentUser
  const user = getCurrentUser();

  // Mapping dữ liệu từ JwtResponse của Backend
  const name = user?.username || 'Người dùng';
  const email = user?.email || 'Chưa cập nhật email';
  
  // Roles trong Spring Security thường là ["ROLE_USER", "ROLE_ADMIN"]
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isVerified = user?.isVerified;

  // Giả sử lấy ngày tạo từ ID (nếu Backend trả về createdAt thì dùng, không thì để mặc định)
  const joinDate = "Thành viên chính thức"; 

  return (
    <div className="min-h-screen pb-20 lg:pb-10">
      {/* Hero Section - Banner & Avatar */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 overflow-hidden">
        {/* Lớp phủ mờ nhẹ */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Các vòng tròn trang trí nền */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />

        <div className="relative h-full flex items-end pb-8 px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left w-full">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1.5 shadow-2xl transition-transform hover:scale-105 duration-300">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-4 border-slate-900">
                  {/* Nếu có ảnh từ Google/Avatar thì hiện, không thì hiện Icon */}
                  <User className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-cyan-300" />
                </div>
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 mb-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight">{name}</h1>
                {isAdmin && (
                  <div className="px-3 py-1 bg-purple-600 rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                    <Shield className="w-3 h-3" />
                    ADMIN
                  </div>
                )}
                {isVerified && (
                  <div className="flex items-center gap-1 text-cyan-400 text-sm font-bold bg-cyan-400/10 px-3 py-1 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã xác minh
                  </div>
                )}
              </div>
              <p className="text-lg sm:text-xl text-cyan-200/80 flex items-center justify-center sm:justify-start gap-2 font-medium">
                <Mail className="w-5 h-5 opacity-70" />
                {email}
              </p>
              <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-400 uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                {joinDate}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Options Section */}
      <div className="max-w-4xl mx-auto px-6 py-10 lg:py-16">
        <div className="grid gap-4">
          {/* Option: Thông tin tài khoản */}
          <button className="w-full p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-3xl flex items-center justify-between transition-all group active:scale-[0.98]">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-white">Chỉnh sửa hồ sơ</p>
                <p className="text-sm text-gray-400">Thay đổi tên hiển thị và thông tin cá nhân</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-all group-hover:translate-x-1" />
          </button>

          {/* Option: Cài đặt hệ thống */}
          <button className="w-full p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-3xl flex items-center justify-between transition-all group active:scale-[0.98]">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Settings className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-white">Cài đặt ứng dụng</p>
                <p className="text-sm text-gray-400">Giao diện, thông báo, bảo mật và ngôn ngữ</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
          </button>

          {/* Nút Đăng xuất */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <button
              onClick={onLogout}
              className="w-full p-5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-3xl flex items-center justify-center gap-3 font-black text-lg transition-all active:scale-[0.98] shadow-lg shadow-red-500/5"
            >
              <LogOut className="w-6 h-6" />
              ĐĂNG XUẤT TÀI KHOẢN
            </button>
            <p className="text-center text-[10px] text-gray-600 mt-6 uppercase tracking-[0.2em]">
              Phiên đăng nhập sẽ tự động kết thúc khi bạn đóng trình duyệt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}