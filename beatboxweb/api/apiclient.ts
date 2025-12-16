import axios from 'axios';

// --- CẤU HÌNH URL ---
// Sử dụng process.env để linh hoạt hơn giữa môi trường dev và production
const PUBLIC_URL = 'https://suzette-triform-angelina.ngrok-free.dev/api/public';

// ====================================================
// 1. TYPE DEFINITIONS (DTO)
// ====================================================

export interface Song {
    id: string;
    title: string;
    artistName: string;
    albumName: string;
    coverUrl: string;
    duration: number;      
    streamUrl: string;     
    status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
    viewCount: number;
    isExplicit: boolean;
    genre: string[];
}

// ====================================================
// 2. API CALLS
// ====================================================

/**
 * Lấy danh sách nhạc Trending
 */
export const getTrendingSongs = (limit: number = 10) => {
    return axios.get<Song[]>(`${PUBLIC_URL}/songs/trending?limit=${limit}`, {
         headers: {
            "ngrok-skip-browser-warning": "true"
        }
    });
};

/**
 * Tìm kiếm bài hát công khai
 */
export const searchPublicSongs = (query: string) => {
    // ✅ SỬA LỖI: Đổi tên tham số từ "query" thành "q" để khớp với backend
    return axios.get<Song[]>(`${PUBLIC_URL}/search?q=${encodeURIComponent(query)}`, {
         headers: {
            "ngrok-skip-browser-warning": "true"
        }
    });
};


/**
 * Lấy thông tin chi tiết bài hát VÀ tăng lượt nghe
 * (Backend đã gộp 2 chức năng này vào một endpoint /info)
 */
export const getSongInfoAndIncrementView = (songId: string) => {
    // Backend của bạn xử lý việc tăng view trong endpoint GET /info
    // Vì vậy, không cần hàm incrementViewCount riêng nữa.
    return axios.get<Song>(`${PUBLIC_URL}/songs/${songId}/info`, {
        headers: {
            "ngrok-skip-browser-warning": "true"
        }
    });
};


/**
 * [ĐÃ XÓA] Hàm incrementViewCount không còn cần thiết.
 * Lý do: Trong PublicController, endpoint GET /songs/{songId}/info đã tự động gọi
 * songService.incrementViewCount(songId). Việc có một hàm riêng để tăng view
 * có thể dẫn đến việc view bị tăng gấp đôi mỗi lần phát nhạc.
 */
/*
export const incrementViewCount = (songId: string) => {
    return axios.post(`${PUBLIC_URL}/songs/${songId}/view`, {}, {
         headers: {
            "ngrok-skip-browser-warning": "true"
        }
    });
};
*/