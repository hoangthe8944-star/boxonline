// src/components/ProfilePage.tsx

import { useState } from 'react';
import { User, Mail, Calendar, Shield, LogOut, Settings, Camera, ChevronRight, Lock, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { getCurrentUser, setAccountPassword } from '../../api/authapi'; 

export function ProfilePage({ onLogout }: { onLogout: () => void }) {
  const user = getCurrentUser();
  
  // State cho form mật khẩu
  const [showPassForm, setShowPassForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Kiểm tra xem đây có phải tài khoản Google chưa có mật khẩu không
  // Lưu ý: Backend cần trả về field 'hasPassword: boolean' hoặc bạn check password null
  const needsPassword = user && !user.roles.includes('ROLE_ADMIN') && (user as any).password === null;

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert("Mật khẩu không khớp!");
    if (newPassword.length < 6) return alert("Mật khẩu phải từ 6 ký tự!");

    setIsSubmitting(true);
    try {
      await setAccountPassword(newPassword);
      setMessage("✅ Đã thiết lập mật khẩu thành công!");
      // Cập nhật lại session giả để ẩn form (hoặc reload)
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      alert("Lỗi khi thiết lập mật khẩu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-950">
      {/* Hero Section (Giữ nguyên như cũ) */}
      <div className="relative h-80 bg-gradient-to-br from-blue-900 to-slate-950 flex items-end p-10">
          <div className="flex items-center gap-6 z-10">
              <div className="w-32 h-32 rounded-full bg-cyan-500 flex items-center justify-center border-4 border-slate-950 shadow-2xl">
                  <User size={64} className="text-white" />
              </div>
              <div>
                  <h1 className="text-4xl font-bold text-white">{user?.username}</h1>
                  <p className="text-cyan-400">{user?.email}</p>
              </div>
          </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        
        {/* ✅ PHẦN THÔNG BÁO THÊM MẬT KHẨU (Chỉ hiện cho User Google chưa có Pass) */}
        {needsPassword && !message && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldAlert className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-amber-500">Tài khoản chưa có mật khẩu</h3>
                <p className="text-sm text-gray-400">Thiết lập mật khẩu để có thể đăng nhập trực tiếp mà không cần Google.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPassForm(!showPassForm)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-2xl transition-all"
            >
              {showPassForm ? "Hủy bỏ" : "Thiết lập ngay"}
            </button>
          </div>
        )}

        {/* ✅ FORM NHẬP MẬT KHẨU */}
        {showPassForm && (
          <form onSubmit={handleSetPassword} className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-4 animate-in zoom-in-95 duration-300">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <Lock size={20} className="text-cyan-400" /> Tạo mật khẩu mới
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="password" 
                placeholder="Mật khẩu mới"
                className="bg-black/40 border border-white/10 p-3 rounded-xl focus:border-cyan-500 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input 
                type="password" 
                placeholder="Xác nhận mật khẩu"
                className="bg-black/40 border border-white/10 p-3 rounded-xl focus:border-cyan-500 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button 
              disabled={isSubmitting}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Xác nhận lưu mật khẩu"}
            </button>
          </form>
        )}

        {message && (
          <div className="bg-green-500/20 border border-green-500/40 p-4 rounded-2xl text-green-400 text-center font-bold">
            {message}
          </div>
        )}

        {/* Các Menu cũ (Profile, Settings, Logout) */}
        <div className="grid gap-4 pt-4">
            <button className="w-full p-5 bg-white/5 hover:bg-white/10 rounded-3xl flex items-center justify-between transition-all group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500/20">
                        <Settings className="text-cyan-400" />
                    </div>
                    <span className="text-lg font-medium">Cài đặt ứng dụng</span>
                </div>
                <ChevronRight className="text-gray-600" />
            </button>

            <button
                onClick={onLogout}
                className="w-full p-5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-3xl flex items-center justify-center gap-3 font-bold transition-all"
            >
                <LogOut /> Đăng xuất tài khoản
            </button>
        </div>
      </div>
    </div>
  );
}