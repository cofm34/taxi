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

