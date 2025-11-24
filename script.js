// --- 1. NOISE GENERATOR ---
const canvas = document.getElementById('noise-canvas');
const ctx = canvas.getContext('2d');

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const noise = () => {
    const w = canvas.width;
    const h = canvas.height;
    const iData = ctx.createImageData(w, h);
    const buffer32 = new Uint32Array(iData.data.buffer);
    const len = buffer32.length;

    for (let i = 0; i < len; i++) {
        if (Math.random() < 0.1) { // Adjust density of noise
            // 0xffffffff is white
            buffer32[i] = 0xffffffff; 
        }
    }
    ctx.putImageData(iData, 0, 0);
    requestAnimationFrame(noise);
};

// Start the noise loop
noise();


// --- 2. INTERACTIVE GLITCH PHYSICS (UPDATED) ---

// We select ALL elements that have these classes, not just the first one
const redLayers = document.querySelectorAll('.glitch-red, .icon-glitch-red');
const cyanLayers = document.querySelectorAll('.glitch-cyan, .icon-glitch-cyan');
const container = document.querySelector('.content-wrapper');

const updateGlitch = (x, y) => {
    // Text needs big separation, icons need small separation
    // We can achieve this by checking class name inside the loop or just using a safe average
    
    redLayers.forEach(layer => {
        // If it's an icon, use less separation so it remains readable
        const isIcon = layer.classList.contains('icon-glitch-red');
        const factor = isIcon ? 5 : 15; 
        layer.style.transform = `translate(${x * factor * -1}px, ${y * factor * -1}px)`;
    });

    cyanLayers.forEach(layer => {
        const isIcon = layer.classList.contains('icon-glitch-cyan');
        const factor = isIcon ? 5 : 15; 
        layer.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });

    // 3D Tilt
    container.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
};

// Mouse Movement
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
    const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    updateGlitch(x, y);
});

// Mobile Tilt
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
        if(e.beta === null) return;
        const y = e.beta / 45;
        const x = e.gamma / 45;
        updateGlitch(x, y);
    });
}


// --- 3. MOBILE GYROSCOPE SUPPORT ---
// (For mobile users to get the same effect by tilting phone)
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
        const y = e.beta / 45; // Tilt front-back
        const x = e.gamma / 45; // Tilt left-right
        
        const separation = 20;
        redLayer.style.transform = `translate(${x * separation * -1}px, ${y * separation * -1}px)`;
        cyanLayer.style.transform = `translate(${x * separation}px, ${y * separation}px)`;
    });
}

// --- 4. RANDOM TEXT SCRAMBLE EFFECT ---
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@&%';
const originalText = title.getAttribute('data-text');

let interval = null;

title.onmouseover = event => {  
    let iteration = 0;
    
    clearInterval(interval);
    
    interval = setInterval(() => {
        event.target.innerText = event.target.innerText
        .split("")
        .map((letter, index) => {
            if(index < iteration) {
                return originalText[index];
            }
            return chars[Math.floor(Math.random() * 26)]
        })
        .join("");
        
        if(iteration >= originalText.length){ 
            clearInterval(interval);
        }
        
        iteration += 1 / 3;
    }, 30);
}