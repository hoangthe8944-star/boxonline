import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, Music, AlertCircle } from "lucide-react";
import { loginUser, type JwtResponse, type LoginRequest, setUserSession } from "./../../api/authapi";

// IMPORT FILE CSS MỚI TẠO
import "../login.css";

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
  onSwitchToRegister?: () => void; // Dấu ? nghĩa là optional (để tránh lỗi nếu chưa truyền)

}

export function LoginForm({ onLoginSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const requestData: LoginRequest = { email, password };
      const response = await loginUser(requestData);
      const data: JwtResponse = response.data;

      if (!data.token) throw new Error("Token missing");

      let userRoles = data.roles || (data as any).role || [];
      if (!Array.isArray(userRoles)) userRoles = [userRoles];

      setUserSession({ ...data, roles: userRoles });
      onLoginSuccess(data.token);

      if (userRoles.includes("ROLE_ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          setErrorMessage("Email hoặc mật khẩu không đúng.");
        } else {
          setErrorMessage(error.response.data.message || "Đăng nhập thất bại.");
        }
      } else if (error.request) {
        setErrorMessage("Không thể kết nối đến máy chủ.");
      } else {
        setErrorMessage("Lỗi hệ thống.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lp-wrapper">
      {/* Container nền */}
      <div className="lp-container">
        <div className="lp-bg-image"></div>
        <div className="lp-bg-overlay"></div>

        {/* Card Form */}
        <div className="lp-card">

          {/* Header */}
          <div className="lp-header">
            <div className="lp-logo-circle">
              <Music color="white" size={40} />
            </div>
            <h1 className="lp-title">
              Stream<span>Music</span>
            </h1>
            <p className="lp-subtitle">Admin Portal Access</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="lp-error-box">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Email Input */}
            <div className="lp-input-group">
              <label className="lp-label">Email</label>
              <div className="lp-input-wrapper">
                <Mail className="lp-icon-left" />
                <input
                  type="text"
                  className="lp-input-field"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="lp-input-group">
              <label className="lp-label">Mật khẩu</label>
              <div className="lp-input-wrapper">
                <Lock className="lp-icon-left" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="lp-input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="lp-icon-btn-right"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="lp-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="lp-spin" size={20} />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                "Đăng nhập ngay"
              )}
            </button>
          </form>
          {/* Footer */}
          <div className="rp-footer">
            Đã có tài khoản? 
            <button onClick={onSwitchToRegister} className="lp-link bg-transparent border-none cursor-pointer">
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}