document.addEventListener('DOMContentLoaded', function() {
    const shareButton = document.getElementById('shareButton');
    
    shareButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const shareData = {
            title: 'Còm Anh Taxi',
            text: 'Dịch vụ taxi uy tín tại Đài Loan 🚕',
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                showFallbackShare();
            }
        } else {
            showFallbackShare();
        }
    });

    function showFallbackShare() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Còm Anh - Dịch vụ taxi uy tín tại Đài Loan 🚕');
        
        const shareOptions = [
            {
                name: 'Facebook',
                url: `https://www.facebook.com/sharer/sharer.php?u=${url}`
            },
            {
                name: 'Instagram',
                // Instagram không có URL chia sẻ trực tiếp, sẽ mở story
                url: `instagram://story-camera`
            },
            {
                name: 'Line',
                url: `https://social-plugins.line.me/lineit/share?url=${url}`
            },
            {
                name: 'Zalo',
                url: `https://zalo.me/share?u=${url}&t=${text}`
            }
        ];

        // Cập nhật giao diện menu chia sẻ
        const shareMenu = document.createElement('div');
        shareMenu.className = 'share-menu';
        shareMenu.innerHTML = `
            <div class="share-menu-content">
                <h3>Chia sẻ qua</h3>
                <div class="share-options">
                    ${shareOptions.map(option => `
                        <a href="${option.url}" target="_blank" rel="noopener noreferrer" 
                           class="share-option ${option.name.toLowerCase()}">
                            <i class="fab fa-${option.name.toLowerCase()}"></i>
                            ${option.name}
                        </a>
                    `).join('')}
                </div>
                <button class="close-share">Đóng</button>
            </div>
        `;

        // Cập nhật style cho menu chia sẻ
        const style = document.createElement('style');
        style.textContent = `
            .share-menu {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                font-family: 'Chakra Petch', sans-serif;
            }
            .share-menu-content {
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                min-width: 300px;
            }
            .share-options {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin: 15px 0;
            }
            .share-option {
                padding: 15px;
                border-radius: 8px;
                text-decoration: none;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: transform 0.3s;
            }
            .share-option:hover {
                transform: scale(1.05);
            }
            .share-option i {
                font-size: 1.2em;
            }
            .facebook {
                background: #1877f2;
            }
            .instagram {
                background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D);
            }
            .line {
                background: #00B900;
            }
            .zalo {
                background: #0068ff;
            }
            .close-share {
                padding: 10px 25px;
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-family: inherit;
                transition: background 0.3s;
            }
            .close-share:hover {
                background: #ff2020;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(shareMenu);

        // Xử lý đóng menu
        const closeButton = shareMenu.querySelector('.close-share');
        closeButton.addEventListener('click', () => {
            shareMenu.remove();
            style.remove();
        });

        shareMenu.addEventListener('click', (e) => {
            if (e.target === shareMenu) {
                shareMenu.remove();
                style.remove();
            }
        });
    }
}); 