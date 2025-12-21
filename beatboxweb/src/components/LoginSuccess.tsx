import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Music2 } from 'lucide-react';
import { getMyProfile, setUserSession } from '../../api/authapi';

export function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Lấy token từ URL (Ví dụ: /login-success?token=...)
    const token = searchParams.get('token');

    if (token) {
      // 2. Lưu tạm token vào sessionStorage để các request API tiếp theo có thể sử dụng
      sessionStorage.setItem("accessToken", token);

      // 3. Gọi API để lấy thông tin Profile đầy đủ của User
      const syncUserData = async () => {
        try {
          const response = await getMyProfile();
          
          // 4. Lưu toàn bộ dữ liệu User (bao gồm cả token) vào session
          // Hàm này sử dụng sessionStorage như bạn yêu cầu (tắt tab là mất)
          setUserSession(response.data);

          // 5. Đưa người dùng về trang chủ
          // Dùng setTimeout một chút để người dùng kịp thấy thông báo thành công
          setTimeout(() => {
            navigate('/');
            // Reload để App.tsx cập nhật lại trạng thái token từ sessionStorage
            window.location.reload();
          }, 1500);
          
        } catch (error) {
          console.error("Lỗi khi đồng bộ dữ liệu người dùng:", error);
          // Nếu lỗi, xóa token lỗi và về trang chủ
          sessionStorage.removeItem("accessToken");
          navigate('/');
        }
      };

      syncUserData();
    } else {
      // Nếu không thấy token, quay về trang chủ
      navigate('/');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      {/* Hiệu ứng nền mờ chuyên nghiệp */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />

      <div className="relative z-10 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/20 animate-bounce">
            <Music2 className="text-white w-12 h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Xác thực thành công!
          </h2>
          <p className="text-slate-400">
            Đang đồng bộ thư viện nhạc của bạn...
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      </div>
    </div>
  );
}