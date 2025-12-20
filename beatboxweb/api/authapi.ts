import axios from "axios";

// Cấu hình URL cơ sở cho Auth
const BASE_URL = "https://backend-jfn4.onrender.com/api/auth";

// ====================================================
// 1. TYPE DEFINITIONS (INTERFACES)
// ====================================================

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Cập nhật để chứa trạng thái xác thực và email liên kết
export interface JwtResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
  isVerified: boolean;      // ✅ Trạng thái xác thực email
  linkedEmails?: string[];  // ✅ Danh sách email phụ đã liên kết
}

// ====================================================
// 2. API CALLS (AXIOS)
// ====================================================

// Cấu hình chung cho Headers (để tránh lỗi ngrok và CORS)
const config = {
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420"
  },
  withCredentials: true
};

/**
 * Đăng ký tài khoản mới
 */
export const registerUser = (data: RegisterRequest) =>
  axios.post(`${BASE_URL}/register`, data, config);

/**
 * Xác thực email chính (Dùng trong trang VerifyPage)
 */
export const verifyEmail = (token: string) =>
  axios.get(`${BASE_URL}/verify?token=${token}`, config);

/**
 * Đăng nhập
 */
export const loginUser = (data: LoginRequest) =>
  axios.post<JwtResponse>(`${BASE_URL}/login`, data, config);

/**
 * Yêu cầu liên kết thêm email phụ
 */
export const requestLinkEmail = (newEmail: string) => {
  const token = getAccessToken();
  return axios.post(`${BASE_URL}/link-request?newEmail=${newEmail}`, {}, {
    headers: {
      ...config.headers,
      "Authorization": `Bearer ${token}` // Gửi kèm Token để xác thực người dùng hiện tại
    }
  });
};

/**
 * Lấy lại thông tin Profile mới nhất (Để cập nhật isVerified sau khi user click link)
 */
export const getMyProfile = () => {
  const token = getAccessToken();
  // Giả sử bạn có endpoint lấy thông tin cá nhân
  return axios.get(`https://backend-jfn4.onrender.com/api/users/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420"
    }
  });
};

// ====================================================
// 3. SESSION MANAGEMENT (SESSION STORAGE)
// ✅ Dữ liệu sẽ tự xóa khi người dùng đóng Tab trình duyệt
// ====================================================

/**
 * Lưu phiên đăng nhập thành công
 */
export const setUserSession = (data: JwtResponse) => {
  sessionStorage.setItem("accessToken", data.token);
  sessionStorage.setItem("user", JSON.stringify(data));
};

/**
 * Lấy mã Token hiện tại
 */
export const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};

/**
 * Lấy thông tin người dùng đang đăng nhập
 */
export const getCurrentUser = (): JwtResponse | null => {
  const userStr = sessionStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * Kiểm tra xem người dùng đã thực hiện verify email chưa
 */
export const checkIsVerified = (): boolean => {
  const user = getCurrentUser();
  return user ? user.isVerified : false;
};

/**
 * Đăng xuất - Xóa toàn bộ dữ liệu phiên làm việc
 */
export const logout = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("user");
};