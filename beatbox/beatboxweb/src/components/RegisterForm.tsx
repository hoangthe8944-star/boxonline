import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Loader2, Music, AlertCircle } from "lucide-react";
import { registerUser, setUserSession, type JwtResponse, type RegisterRequest } from "../../api/authapi";

// Import CSS riêng
import "../register.css";

interface RegisterFormProps {
    onRegisterSuccess: (token: string) => void;
    onSwitchToLogin: () => void;
}

export function RegisterForm({ onRegisterSuccess, onSwitchToLogin }: RegisterFormProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");

        if (password !== confirmPassword) {
            setErrorMessage("Mật khẩu xác nhận không khớp!");
            return;
        }
        if (password.length < 6) {
            setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        setIsLoading(true);

        try {
            const requestData: RegisterRequest = {
                username,
                email,
                password,
                role: ["USER"]
            };

            const response = await registerUser(requestData);
            const data: JwtResponse = response.data;

            if (!data.token) throw new Error("Đăng ký thành công nhưng không nhận được token.");

            let userRoles = data.roles || (data as any).role || [];
            if (!Array.isArray(userRoles)) userRoles = [userRoles];

            setUserSession({ ...data, roles: userRoles });
            onRegisterSuccess(data.token);

        } catch (error: any) {
            console.error("Register error:", error);
            if (error.response) {
                setErrorMessage(error.response.data.message || error.response.data || "Đăng ký thất bại.");
            } else if (error.request) {
                setErrorMessage("Không kết nối được đến máy chủ.");
            } else {
                setErrorMessage("Đã xảy ra lỗi không xác định.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // ĐÃ ĐỔI TẤT CẢ CLASS TỪ "lp-" SANG "rp-" ĐỂ ĂN CSS MỚI
        <div className="rp-wrapper">
            <div className="rp-container">
                <div className="rp-bg-image"></div>
                <div className="rp-bg-overlay"></div>

                <div className="rp-card">
                    {/* Header: Class "rp-header" trong CSS có display:flex nên nó sẽ nằm ngang */}
                    <div className="rp-header">
                        <div className="rp-logo-circle">
                            <Music color="white" size={24} />
                        </div>
                        <div className="rp-header-text">
                            <h1 className="rp-title">
                                Đăng <span>Ký</span>
                            </h1>
                            <p className="rp-subtitle">Tạo tài khoản mới</p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="rp-error-box">
                            <AlertCircle size={16} />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Username */}
                        <div className="rp-input-group">
                            <label className="rp-label">Tên hiển thị</label>
                            <div className="rp-input-wrapper">
                                <User className="rp-icon-left" />
                                <input
                                    type="text"
                                    className="rp-input-field"
                                    placeholder="Họ Tên"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="rp-input-group">
                            <label className="rp-label">Email</label>
                            <div className="rp-input-wrapper">
                                <Mail className="rp-icon-left" />
                                <input
                                    type="email"
                                    className="rp-input-field"
                                    placeholder="email@vidu.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="rp-input-group">
                            <label className="rp-label">Mật khẩu</label>
                            <div className="rp-input-wrapper">
                                <Lock className="rp-icon-left" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="rp-input-field"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="rp-icon-btn-right"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="rp-input-group">
                            <label className="rp-label">Nhập lại Mật khẩu</label>
                            <div className="rp-input-wrapper">
                                <Lock className="rp-icon-left" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="rp-input-field"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="rp-submit-btn" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="rp-spin" size={16} />
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                "Đăng Ký Ngay"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="rp-footer">
                        Đã có tài khoản?
                        <button onClick={onSwitchToLogin} className="rp-link">
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}