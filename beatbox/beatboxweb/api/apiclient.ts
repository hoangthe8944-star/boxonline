import axios, { AxiosResponse } from 'axios';

// --- CẤU HÌNH URL ---
// Lưu ý: Port là 8081 dựa theo log lỗi của bạn. Nếu bạn chạy port 8080 thì sửa lại nhé.
const PUBLIC_URL = 'http://localhost:8081/api/public';

// ====================================================
// 1. TYPE DEFINITIONS (DTO)
// ====================================================

export interface Song {
    id: string;
    title: string;
    artistName: string;
    albumName: string;
    coverUrl: string;
    duration: number;      // Giây
    streamUrl: string;     // Link phát nhạc
    status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
    viewCount: number;
    isExplicit: boolean;
    genre: string[];
}

/**
 * Lấy danh sách nhạc Trending (Cho Trang Chủ User)
 */
export const getTrendingSongs = (limit: number = 10) => {
    return axios.get<Song[]>(`${PUBLIC_URL}/songs/trending?limit=${limit}`);
};

/**
 * Tìm kiếm bài hát công khai (Cho User)
 */
export const searchPublicSongs = (query: string) => {
    return axios.get<Song[]>(`${PUBLIC_URL}/search?query=${encodeURIComponent(query)}`);
};

/**
 * Tăng lượt nghe (Gọi khi User bấm Play)
 */
export const incrementViewCount = (songId: string) => {
    return axios.post(`${PUBLIC_URL}/songs/${songId}/view`);
};