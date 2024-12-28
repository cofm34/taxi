document.addEventListener('DOMContentLoaded', function() {
    const addToHomeButton = document.getElementById('addToHomeScreen');
    let deferredPrompt;

    // Hiển thị nút ngay khi trang web load
    addToHomeButton.style.display = 'flex';

    // Kiểm tra thiết bị iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        addToHomeButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Tự động mở share sheet trên iOS
            const shareData = {
                title: 'Còm Anh Taxi',
                text: 'Dịch vụ taxi uy tín tại Đài Loan',
                url: window.location.href
            };

            if (navigator.share) {
                navigator.share(shareData)
                    .then(() => {
                        alert('Vui lòng chọn "Thêm vào màn hình chính" trong menu chia sẻ');
                    })
                    .catch((error) => {
                        alert('Để lưu Card Visit:\n\n1. Nhấn vào biểu tượng Chia sẻ (Share)\n2. Chọn "Thêm vào màn hình chính"');
                    });
            } else {
                alert('Để lưu Card Visit:\n\n1. Nhấn vào biểu tượng Chia sẻ (Share)\n2. Chọn "Thêm vào màn hình chính"');
            }
        });
    } else {
        // Xử lý cho Android
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
        });

        addToHomeButton.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (deferredPrompt) {
                // Tự động hiện prompt cài đặt
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                
                if (outcome === 'accepted') {
                    addToHomeButton.style.display = 'none';
                }
            } else {
                // Nếu không thể tự động, hướng dẫn thủ công
                try {
                    // Thử mở menu cài đặt của trình duyệt
                    window.location.href = 'chrome://apps';
                } catch (err) {
                    alert(
                        'Để lưu Card Visit:\n\n' +
                        '1. Nhấn vào 3 chấm ở góc phải\n' +
                        '2. Chọn "Cài đặt vào màn hình chính"\n' +
                        '3. Nhấn "Thêm"'
                    );
                }
            }
        });
    }

    // Ẩn nút khi đã cài đặt
    window.addEventListener('appinstalled', () => {
        addToHomeButton.style.display = 'none';
    });
}); 