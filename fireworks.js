window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Khởi tạo canvas
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    container = document.querySelector('.container'),
    cw = container.offsetWidth,
    ch = container.offsetHeight,
    fireworks = [],
    particles = [],
    hue = 120,
    limiterTotal = 5,
    limiterTick = 0,
    timerTotal = 120,
    timerTick = 0,
    mousedown = false,
    mx,
    my;

// Thêm biến để lưu vị trí của text
var titleElement = document.querySelector('h1');
var titlePosition = {x: 0, y: 0};

// Hàm random
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Hàm tính khoảng cách
function calculateDistance(p1x, p1y, p2x, p2y) {
    var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// Constructor cho Firework
function Firework(sx, sy, tx, ty) {
    // Vị trí bắt đầu và kết thúc
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    
    // Tính toán khoảng cách
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    
    // Theo dõi tọa độ quá khứ để vẽ đuôi
    this.coordinates = [];
    this.coordinateCount = 3;
    while(this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    this.targetRadius = 1;
}

// Cập nhật Firework
Firework.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    
    // Tăng tốc độ
    this.speed *= this.acceleration;
    
    // Tính toán chuyển động
    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;
    
    // Theo dõi khoảng cách đã đi
    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);
    
    // Nếu đã đến đích thì tạo particles và xóa firework
    if(this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
    } else {
        this.x += vx;
        this.y += vy;
    }
}

// Vẽ Firework
Firework.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], 
               this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();
}

// Constructor cho Particle
function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while(this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = random(hue - 20, hue + 20);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
}

// Cập nhật Particle
Particle.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
    
    if(this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
}

// Vẽ Particle
Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], 
               this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
}

// Tạo particles
function createParticles(x, y) {
    var particleCount = 30;
    while(particleCount--) {
        particles.push(new Particle(x, y));
    }
}

// Hàm cập nhật vị trí của text
function updateTitlePosition() {
    var rect = titleElement.getBoundingClientRect();
    var containerRect = container.getBoundingClientRect();
    titlePosition.x = rect.left + rect.width/2 - containerRect.left;
    titlePosition.y = rect.top + rect.height/2 - containerRect.top;
}

// Cập nhật hàm updateCanvasSize để bao gồm cả việc cập nhật vị trí text
function updateCanvasSize() {
    cw = container.offsetWidth;
    ch = container.offsetHeight;
    canvas.width = cw;
    canvas.height = ch;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    updateTitlePosition();
}

// Thêm MutationObserver để theo dõi thay đổi kích thước container
const observer = new MutationObserver(updateCanvasSize);
observer.observe(container, { 
    attributes: true, 
    attributeFilter: ['style'], 
    subtree: false 
});

// Đảm bảo canvas được cập nhật khi DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCanvasSize();
    // Thêm timeout để đảm bảo kích thước được cập nhật sau khi trang đã load hoàn toàn
    setTimeout(updateCanvasSize, 100);
});

// Main loop
function loop() {
    requestAnimFrame(loop);
    hue = random(0, 360);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, cw, ch);
    ctx.globalCompositeOperation = 'lighter';
    
    var i = fireworks.length;
    while(i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }
    
    var i = particles.length;
    while(i--) {
        particles[i].draw();
        particles[i].update(i);
    }
    
    if(timerTick >= timerTotal) {
        if(!mousedown) {
            // Điều chỉnh vị trí đích của pháo hoa
            var targetX = titlePosition.x + random(-50, 50); // Thêm độ ngẫu nhiên nhỏ
            var targetY = titlePosition.y + random(-20, 20); // Thêm độ ngẫu nhiên nhỏ
            
            fireworks.push(new Firework(
                random(cw * 0.2, cw * 0.8), // Điểm bắt đầu ngẫu nhiên theo chiều ngang
                ch,                          // Luôn bắt đầu từ dưới cùng
                targetX,                     // Điểm đích là vị trí của text
                targetY
            ));
            timerTick = 0;
        }
    } else {
        timerTick++;
    }
}

// Thêm event listener để cập nhật vị trí khi scroll
window.addEventListener('scroll', updateTitlePosition);
window.addEventListener('resize', updateCanvasSize);
window.addEventListener('load', function() {
    updateCanvasSize();
    loop();
}); 