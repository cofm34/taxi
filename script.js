document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật các liên kết từ config
    document.querySelector('.facebook').href = `https://www.facebook.com/${(CONFIG.FACEBOOK_ID)}`;
    document.querySelector('.line').href = `https://line.me/ti/p/~${CONFIG.LINE_ID}`;
    document.querySelector('.zalo').href = `zalo://chat?phone=${CONFIG.ZALO_PHONE}`;
    document.querySelector('.phone').href = `tel:${CONFIG.PHONE_NUMBER}`;

    function handleSocialClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        // Xử lý Facebook
        if (href.includes('facebook.com')) {
            e.preventDefault();
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                // Chỉ thử mở app với tên người dùng
                window.location.href = `fb://profile/${CONFIG.FACEBOOK_ID}`;
            } else {
                window.location.href = `https://www.facebook.com/${(CONFIG.FACEBOOK_ID)}`;
            }
        }
        
        if (href.includes('line.me')) {
            e.preventDefault();
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                // Mở trực tiếp app Line
                window.location.href = `line://ti/p/~${CONFIG.LINE_ID}`;
            } else {
                // Trên desktop mở web Line
                window.location.href = `https://line.me/ti/p/~${CONFIG.LINE_ID}`;
            }
        }
        

    }

    document.querySelectorAll('.social-btn').forEach(link => {
        link.addEventListener('click', handleSocialClick);
    });
});

function createRaindrops() {
    const container = document.querySelector('.container');
    const createDrop = () => {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        
        // Random vị trí và kích thước
        drop.style.left = Math.random() * 100 + '%';
        drop.style.opacity = Math.random() * 0.3 + 0.2;
        
        // Random kích thước giọt nước
        const scale = Math.random() * 0.5 + 0.5; // 0.5 đến 1
        drop.style.transform = `scale(${scale})`;
        
        // Random tốc độ rơi
        const duration = Math.random() * 0.5 + 1; // 1 đến 1.5 giây
        drop.style.animation = `raindrop ${duration}s linear infinite`;
        
        container.appendChild(drop);
        
        // Xóa giọt nước
        setTimeout(() => {
            drop.remove();
        }, duration * 1000);
    };

    // Tạo giọt mưa mới mỗi 50ms
    setInterval(createDrop, 50);
}

document.addEventListener('DOMContentLoaded', createRaindrops); 