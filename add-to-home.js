document.addEventListener('DOMContentLoaded', function() {
    const addToHomeButton = document.getElementById('addToHomeScreen');
    let deferredPrompt;

    // Kiểm tra thiết bị iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Hiển thị hướng dẫn cho iOS
        addToHomeButton.style.display = 'flex';
        addToHomeButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Cập nhật thông báo cho phù hợp với iOS
            const message = 
                'Để lưu Card Visit:\n\n' +
                '1. Nhấn vào biểu tượng Chia sẻ (Share) ở dưới\n' +
                '2. Cuộn xuống và chọn "Thêm vào màn hình chính"\n' +
                '3. Nhấn "Thêm" ở góc phải';
            
            alert(message);
        });
    } else {
        // Xử lý cho Android và các thiết bị khác
        window.addEventListener('beforeinstallprompt', (e) => {
            // Ngăn Chrome hiện prompt tự động
            e.preventDefault();
            // Lưu event để sử dụng sau
            deferredPrompt = e;
            // Hiện nút thêm vào màn hình chính
            addToHomeButton.style.display = 'flex';
        });

        addToHomeButton.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!deferredPrompt) {
                // Nếu không có prompt, hiển thị hướng dẫn thủ công
                alert(
                    'Để lưu Card Visit:\n\n' +
                    '1. Mở menu trình duyệt (3 chấm)\n' +
                    '2. Chọn "Thêm vào màn hình chính"\n' +
                    '3. Nhấn "Thêm" để xác nhận'
                );
                return;
            }

            // Hiện prompt
            deferredPrompt.prompt();
            // Đợi user trả lời
            const { outcome } = await deferredPrompt.userChoice;
            // Xóa prompt
            deferredPrompt = null;
            
            if (outcome === 'accepted') {
                addToHomeButton.style.display = 'none';
            }
        });
    }

    // Nếu đã cài đặt, ẩn nút
    window.addEventListener('appinstalled', () => {
        addToHomeButton.style.display = 'none';
    });
}); 