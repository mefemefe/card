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
        if (Math.random() < 0.1) { 
            buffer32[i] = 0xffffffff; 
        }
    }
    ctx.putImageData(iData, 0, 0);
    requestAnimationFrame(noise);
};
noise();


// --- 2. INTERACTIVE GLITCH PHYSICS ---
const redLayers = document.querySelectorAll('.glitch-red, .icon-glitch-red');
const cyanLayers = document.querySelectorAll('.glitch-cyan, .icon-glitch-cyan');
const container = document.querySelector('.content-wrapper');

const updateGlitch = (x, y) => {
    redLayers.forEach(layer => {
        const isIcon = layer.classList.contains('icon-glitch-red');
        const factor = isIcon ? 5 : 15; 
        layer.style.transform = `translate(${x * factor * -1}px, ${y * factor * -1}px)`;
    });

    cyanLayers.forEach(layer => {
        const isIcon = layer.classList.contains('icon-glitch-cyan');
        const factor = isIcon ? 5 : 15; 
        layer.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });

    container.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
};

// Mouse Movement (Desktop)
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
    const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    updateGlitch(x, y);
});


// --- 3. PERMISSION HANDLER (The Fix) ---

// Create the overlay button dynamically
const createPermissionBtn = () => {
    // Only create if on a device that supports orientation
    if (!window.DeviceOrientationEvent) return;

    // Check if we are on iOS (requires permission) or Android (usually doesn't)
    // We'll just show the button for everyone on mobile to be safe and thematic
    if (!('ontouchstart' in window)) return; 

    const btn = document.createElement('button');
    btn.innerText = "INITIALIZE_SYSTEM // TOUCH TO START";
    Object.assign(btn.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '9999',
        background: 'rgba(0,0,0,0.9)',
        color: '#00f3ff',
        border: 'none',
        fontFamily: 'inherit',
        fontSize: '1.2rem',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '2px'
    });

    document.body.appendChild(btn);

    btn.addEventListener('click', async () => {
        // iOS 13+ Requirement
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const response = await DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                } else {
                    alert("PERMISSION_DENIED");
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            // Non-iOS devices (Android)
            window.addEventListener('deviceorientation', handleOrientation);
        }
        
        // Remove the button
        btn.remove();
    });
};

const handleOrientation = (e) => {
    if(e.beta === null) return;
    const y = e.beta / 45; 
    const x = e.gamma / 45; 
    updateGlitch(x, y);
};

createPermissionBtn();

// --- 4. TEXT SCRAMBLE ---
const title = document.getElementById('main-title');
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
            if(index < iteration) return originalText[index];
            return chars[Math.floor(Math.random() * 26)]
        })
        .join("");
        if(iteration >= originalText.length) clearInterval(interval);
        iteration += 1 / 3;
    }, 30);
}
