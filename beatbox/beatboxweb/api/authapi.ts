import axios from "axios";

const BASE_URL = "https://suzette-triform-angelina.ngrok-free.dev/api/auth";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string[]; // Optional
}


// --- INTERFACES ---
export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
}

// --- API CALLS ---

export const registerUser = (data: RegisterRequest) =>
  axios.post<JwtResponse>(`${BASE_URL}/register`, data, {
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "69420" },
    withCredentials: true
  });


// 1. Gửi login request
export const loginUser = (data: LoginRequest) =>
  axios.post<JwtResponse>(`${BASE_URL}/login`, data, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69420"
    },
    withCredentials: true // Quan trọng để tránh lỗi CORS 403
  });

// --- SESSION MANAGEMENT (LOCAL STORAGE) ---

// 2. Lưu session sau khi login thành công
export const setUserSession = (data: JwtResponse) => {
  localStorage.setItem("accessToken", data.token);
  localStorage.setItem("user", JSON.stringify(data));
};

// 3. Lấy token (để kẹp vào header các request khác)
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// 4. Lấy thông tin User hiện tại (để hiển thị tên, avatar...)
export const getCurrentUser = (): JwtResponse | null => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// 5. Đăng xuất (Logout)
export const logout = () => {
  // Xóa sạch dữ liệu trong LocalStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");

  // Lưu ý: Vì dùng JWT stateless, ta chỉ cần xóa ở Client là xong.
  // Nếu sau này bạn muốn làm chặt chẽ hơn (Blacklist token), 
  // bạn có thể gọi thêm axios.post(`${BASE_URL}/logout`) tại đây.
};