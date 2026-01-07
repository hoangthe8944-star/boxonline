import React from 'react';

interface TrackItem {
    coverUrl?: string;     // Khớp với field coverUrl trong SongDto của bạn
    thumbnailUrl?: string; // Dự phòng nếu bạn dùng tên khác
    [key: string]: any;
}

interface PlaylistCoverProps {
    coverImage?: string | null;
    tracks?: TrackItem[] | any[]; // Chấp nhận mảng object songDetails
    name?: string;
    className?: string;
}

const PlaylistCover: React.FC<PlaylistCoverProps> = ({
    coverImage,
    tracks = [],
    name = "Playlist",
    className = "w-full h-full"
}) => {
    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop";

    // 1. Hàm lấy URL ảnh - Đã sửa để tránh lấy nhầm ID làm URL
    const getTrackImageUrl = (track: any): string => {
        // 1. Ảnh mặc định nếu mọi thứ thất bại
        const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop";

        if (!track) return DEFAULT_IMAGE;

        // 2. Nếu là chuỗi (ID hoặc URL)
        if (typeof track === 'string') {
            // CHỈ TRẢ VỀ NẾU CÓ CHỮ HTTP (Link thật)
            if (track.startsWith('http')) return track;

            // NẾU KHÔNG CÓ HTTP (Nghĩa là nó là ID 694...), trả về DEFAULT_IMAGE ngay
            // Tuyệt đối không trả về chuỗi ID vì sẽ gây lỗi 404
            return DEFAULT_IMAGE;
        }

        // 3. Nếu là Object (songDetails)
        const url = track.coverUrl || track.thumbnailUrl;
        if (url && typeof url === 'string' && url.startsWith('http')) {
            return url;
        }

        return DEFAULT_IMAGE;
    };
    // 2. Logic hiển thị
    if (coverImage && coverImage.trim() !== "" && coverImage !== "null") {
        return (
            <div className={`${className} overflow-hidden rounded-md shadow-lg border border-white/10`}>
                <img
                    src={coverImage}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
                />
            </div>
        );
    }

    if (tracks && tracks.length >= 4) {
        const displayTracks = tracks.slice(0, 4);
        return (
            <div className={`${className} grid grid-cols-2 grid-rows-2 overflow-hidden rounded-md shadow-lg border border-white/10 bg-black/20`}>
                {displayTracks.map((track, index) => (
                    <img
                        key={index}
                        src={getTrackImageUrl(track)}
                        alt={`track-${index}`}
                        className="w-full h-full object-cover border-[0.5px] border-white/5"
                        onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
                    />
                ))}
            </div>
        );
    }

    if (tracks && tracks.length > 0) {
        return (
            <div className={`${className} overflow-hidden rounded-md shadow-lg border border-white/10`}>
                <img
                    src={getTrackImageUrl(tracks[0])}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
                />
            </div>
        );
    }

    return (
        <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-950 rounded-md shadow-lg border border-white/5`}>
            <span className="text-gray-500 text-xs text-center p-2 italic">
                Empty Playlist
            </span>
        </div>
    );
};

export default PlaylistCover;