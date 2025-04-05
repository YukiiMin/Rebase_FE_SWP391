import { jwtDecode } from 'jwt-decode';

// Quản lý token và phiên đăng nhập
// const TokenUtils = {
    export const TokenUtils = {
    // Lưu token vào localStorage
    setToken: (token) => {
        localStorage.setItem('token', token);
        
        // Thông báo cho các component khác biết token đã thay đổi
        try {
            const storageEvent = new StorageEvent('storage', {
                key: 'token',
                newValue: token,
                oldValue: localStorage.getItem('token'),
                storageArea: localStorage
            });
            window.dispatchEvent(storageEvent);
        } catch (e) {
            console.error("Could not dispatch storage event:", e);
            // Fallback nếu không thể tạo StorageEvent
            window.dispatchEvent(new Event('storage'));
        }
    },
    
    // Lấy token từ localStorage
    getToken: () => {
        return localStorage.getItem('token');
    },
    
    // Xóa token (đăng xuất)
    removeToken: () => {
        localStorage.removeItem('token');
        
        // Thông báo cho các component khác biết token đã bị xóa
        try {
            const storageEvent = new StorageEvent('storage', {
                key: 'token',
                newValue: null,
                oldValue: localStorage.getItem('token'),
                storageArea: localStorage
            });
            window.dispatchEvent(storageEvent);
        } catch (e) {
            console.error("Could not dispatch storage event:", e);
            // Fallback nếu không thể tạo StorageEvent
            window.dispatchEvent(new Event('storage'));
        }
    },
    
    // Giải mã thông tin từ token
    decodeToken: (token) => {
        if (!token) return null;
        
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    },
    
    // Kiểm tra token có hợp lệ không
    isValidToken: (token) => {
        if (!token) return false;
        
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            // Kiểm tra thời hạn
            if (decoded.exp < currentTime) {
                console.log("Token expired");
                return false;
            }
            
            return true;
        } catch (error) {
            console.error("Invalid token:", error);
            return false;
        }
    },
    
    // Lấy thông tin người dùng từ token
    getUserInfo: () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
            const decoded = jwtDecode(token);
            return {
                userId: decoded.sub,
                role: decoded.scope,
                exp: decoded.exp,
                username: decoded.username
            };
        } catch (error) {
            console.error("Error getting user info:", error);
            return null;
        }
    },
    
    // Kiểm tra người dùng đã đăng nhập chưa
    isLoggedIn: () => {
        const token = localStorage.getItem('token');
        return TokenUtils.isValidToken(token);
    },

     // Thêm phương thức refreshToken
     refreshToken: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return { success: false, message: 'No token found' };
            
            const response = await apiService.auth.refreshToken({
                refreshToken: localStorage.getItem('refreshToken')
            });
            
            if (response && response.code === 100 && response.result) {
                const { accessToken, refreshToken: newRefreshToken } = response.result;
                
                // Lưu token mới
                localStorage.setItem('token', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                
                // Thông báo cho các component biết token đã thay đổi
                try {
                    const storageEvent = new StorageEvent('storage', {
                        key: 'token',
                        newValue: accessToken,
                        oldValue: token,
                        storageArea: localStorage
                    });
                    window.dispatchEvent(storageEvent);
                } catch (e) {
                    console.error("Could not dispatch storage event:", e);
                    window.dispatchEvent(new Event('storage'));
                }
                
                return {
                    success: true,
                    accessToken,
                    refreshToken: newRefreshToken
                };
            }
            
            return { success: false, message: 'Failed to refresh token' };
        } catch (error) {
            console.error("Error refreshing token:", error);
            return { success: false, error };
        }
    },
    
    // Kiểm tra và refresh token nếu cần
    checkAndRefreshToken: async () => {
        const token = localStorage.getItem('token');
        if (!token) return { success: false, authenticated: false };
        
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            // Nếu token còn hạn
            if (decoded.exp > currentTime) {
                return { success: true, authenticated: true, needsRefresh: false };
            }
            
            // Token hết hạn, cần refresh
            console.log("Token expired, attempting refresh");
            const refreshResult = await TokenUtils.refreshToken();
            
            return {
                success: refreshResult.success,
                authenticated: refreshResult.success,
                needsRefresh: true,
                ...refreshResult
            };
        } catch (error) {
            console.error("Token validation error:", error);
            return { success: false, authenticated: false, error };
        }
    }
};

export default TokenUtils; 