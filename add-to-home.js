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
            alert('Để thêm vào màn hình chính:\n1. Nhấn vào biểu tượng Chia sẻ (Share)\n2. Cuộn xuống và chọn "Thêm vào màn hình chính"');
        });
    } else {
        // Xử lý cho Android và các thiết bị khác
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            addToHomeButton.style.display = 'flex';
        });

        addToHomeButton.addEventListener('click', async (e) => {
            e.preventDefault();
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
                addToHomeButton.style.display = 'none';
            }
        });
    }

    // Ẩn nút nếu ứng dụng đã được cài đặt
    window.addEventListener('appinstalled', () => {
        addToHomeButton.style.display = 'none';
    });
}); 