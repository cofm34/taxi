document.addEventListener('DOMContentLoaded', function() {
    const shareButton = document.getElementById('shareButton');
    
    shareButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const url = window.location.href;
        
        try {
            await navigator.clipboard.writeText(url);
            showNotification('Đã sao chép liên kết! Hãy gửi cho bạn bè 😊');
        } catch (err) {
            // Fallback cho trường hợp không hỗ trợ Clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Đã sao chép liên kết! Hãy gửi cho bạn bè 😊');
        }
    });

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .copy-notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px 25px;
                border-radius: 50px;
                font-family: 'Chakra Petch', sans-serif;
                z-index: 1000;
                animation: slideUp 0.3s ease-out, fadeOut 0.5s ease-out 2s forwards;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .notification-content i {
                color: #4CAF50;
            }

            @keyframes slideUp {
                from {
                    transform: translate(-50%, 100%);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }

            @keyframes fadeOut {
                to {
                    opacity: 0;
                    visibility: hidden;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(notification);

        // Xóa notification sau 2.5 giây
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 2500);
    }
}); 