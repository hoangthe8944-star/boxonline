import axios from 'axios';

// --- CẤU HÌNH URL ---
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
// 2. API CALLS (Đã sửa lỗi cú pháp)
// ====================================================

/**
 * Lấy danh sách nhạc Trending
 */
export const getTrendingSongs = (limit: number = 10) => {
    // SỬA: Đưa object chứa headers vào BÊN TRONG dấu ngoặc của axios.get
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
    // SỬA: Đưa object chứa headers vào BÊN TRONG dấu ngoặc
    return axios.get<Song[]>(`${PUBLIC_URL}/search?query=${encodeURIComponent(query)}`, {
         headers: {
            "ngrok-skip-browser-warning": "true"
        }
    });
};

/**
 * Tăng lượt nghe
 */
export const incrementViewCount = (songId: string) => {
    // SỬA: Hàm POST cần 3 tham số: url, body (để rỗng {}), và config (chứa headers)
    return axios.post(`${PUBLIC_URL}/songs/${songId}/view`, {}, {
         headers: {
            "ngrok-skip-browser-warning": "true"
        }
    });
};