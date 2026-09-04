// ════════════════════════════
// LOADER
// ════════════════════════════
let progress = 0;
const loaderNum = document.getElementById('loaderNum');
const loaderFill = document.getElementById('loaderFill');
const loader = document.getElementById('loader');

const loadInterval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress >= 100) { progress = 100; clearInterval(loadInterval); setTimeout(hideLoader, 400); }
    loaderNum.textContent = Math.floor(progress);
    loaderFill.style.width = progress + '%';
}, 80);

function hideLoader() {
    loader.classList.add('gone');
    initAll();
}

// ════════════════════════════
// WEBGL BACKGROUND — Plasma shader
// ════════════════════════════
function initWebGL() {
    const canvas = document.getElementById('glcanvas');
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const particles = new THREE.BufferGeometry();
    const particleCount = 6000;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 200;
        posArray[i + 1] = (Math.random() - 0.5) * 200;
        posArray[i + 2] = (Math.random() - 0.5) * 200;

        const rLine = Math.random();
        colorArray[i] = rLine > 0.5 ? 0.0 : 0.4;
        colorArray[i + 1] = rLine > 0.5 ? 0.8 : 0.2;
        colorArray[i + 2] = 1.0;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particleMesh = new THREE.Points(particles, material);
    scene.add(particleMesh);

    let mouseX = 0;
    let mouseY = 0;
    let scrollY = window.scrollY;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });
    window.addEventListener('scroll', () => { scrollY = window.scrollY; });
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        particleMesh.rotation.y = elapsedTime * 0.05 + mouseX * 0.5;
        particleMesh.rotation.x = elapsedTime * 0.02 + mouseY * 0.5;
        particleMesh.position.y = scrollY * 0.02;

        renderer.render(scene, camera);
    }
    animate();
}

// ════════════════════════════
// CURSOR
// ════════════════════════════
function initCursor() {
    const cur = document.getElementById('cur');
    const cur2 = document.getElementById('cur2');
    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; cur.style.left = tx + 'px'; cur.style.top = ty + 'px'; });

    const hoverEls = document.querySelectorAll('a, .project, button');
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    (function animRing() {
        cx += (tx - cx) * .1; cy += (ty - cy) * .1;
        cur2.style.left = cx + 'px'; cur2.style.top = cy + 'px';
        requestAnimationFrame(animRing);
    })();
}

// ════════════════════════════
// MARQUEE
// ════════════════════════════
function initMarquee() {
    const items = ['3D DEVELOPMENT', 'WEB DESIGN', 'CREATIVE CODE', 'MOTION DESIGN', 'UI / UX', 'WEBGL', 'GSAP', 'THREE.JS', 'NEXTJS', 'OPEN TO WORK'];
    const track = document.getElementById('marqueeTrack');
    const doubled = [...items, ...items, ...items, ...items];
    doubled.forEach((item, i) => {
        const el = document.createElement('span');
        el.className = 'marquee-item';
        el.innerHTML = i % 3 === 1 ? `<span>✦</span> ${item}` : item;
        track.appendChild(el);
    });
}

// ════════════════════════════
// PROJECT HOVER PREVIEWS
// ════════════════════════════
function initPreviews() {
    const preview = document.getElementById('preview');
    const canvas = document.getElementById('previewCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(300, 200);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 300 / 200, 0.1, 100);
    camera.position.z = 5;

    const geometries = [
        new THREE.IcosahedronGeometry(1.5, 0),
        new THREE.TorusGeometry(1, 0.4, 16, 100),
        new THREE.OctahedronGeometry(1.5, 0),
        new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
    ];
    const colors = [0xff2d2d, 0x2d8cff, 0xff2daa, 0x2dffa0];

    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        emissive: 0x2d8cff,
        emissiveIntensity: 0.5
    });

    const mesh = new THREE.Mesh(geometries[0], material);
    scene.add(mesh);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    let currentProj = -1;
    let animFrame;

    function animate() {
        animFrame = requestAnimationFrame(animate);
        mesh.rotation.x += 0.02;
        mesh.rotation.y += 0.03;
        renderer.render(scene, camera);
    }

    document.querySelectorAll('.project').forEach(proj => {
        const idx = parseInt(proj.dataset.proj);
        proj.addEventListener('mouseenter', e => {
            currentProj = idx;
            mesh.geometry = geometries[idx % geometries.length];
            material.emissive.setHex(colors[idx % colors.length]);
            preview.classList.add('show');
            if (!animFrame) animate();
        });
        proj.addEventListener('mouseleave', () => {
            preview.classList.remove('show');
            currentProj = -1;
            cancelAnimationFrame(animFrame);
            animFrame = null;
        });
        proj.addEventListener('mousemove', e => {
            preview.style.left = (e.clientX + 20) + 'px';
            preview.style.top = (e.clientY - 100) + 'px';
        });
    });
}

// ════════════════════════════
// ABOUT CANVAS — fluid art
// ════════════════════════════
function initAbout() {
    const canvas = document.getElementById('aboutCanvas');
    if (!canvas) return;
    const par = canvas.parentElement;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, par.offsetWidth / par.offsetHeight, 0.1, 100);
    camera.position.z = 8;

    function resize() {
        renderer.setSize(par.offsetWidth, par.offsetHeight);
        camera.aspect = par.offsetWidth / par.offsetHeight;
        camera.updateProjectionMatrix();
    }
    resize();
    new ResizeObserver(resize).observe(par);

    // Complex cool 3d object
    const geometry = new THREE.TorusKnotGeometry(2, 0.6, 128, 64);
    const material = new THREE.MeshStandardMaterial({
        color: 0x03050f,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: true,
        emissive: 0x2d8cff,
        emissiveIntensity: 0.5
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00c8ff, 2, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        torus.rotation.x += 0.005;
        torus.rotation.y += 0.01;
        torus.position.x += (mouseX - torus.position.x) * 0.05;
        torus.position.y += (mouseY - torus.position.y) * 0.05;
        renderer.render(scene, camera);
    }
    animate();
}

// ════════════════════════════
// SKILL BARS — segmented
// ════════════════════════════
function initSkillBars() {
    // Build segments
    document.querySelectorAll('.skill-track[data-segments]').forEach(track => {
        const total = parseInt(track.dataset.segments);
        const filled = parseInt(track.dataset.filled);
        for (let i = 0; i < total; i++) {
            const seg = document.createElement('div');
            seg.className = 'skill-segment';
            seg.dataset.idx = i;
            seg.dataset.filled = i < filled ? '1' : '0';
            seg.style.setProperty('--sd', (i * 0.12) + 's');
            track.appendChild(seg);
        }
    });

    // Animate on scroll
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const bars = entry.target.querySelectorAll('.skill-bar');
            bars.forEach((bar, bi) => {
                const track = bar.querySelector('.skill-track');
                const glowLine = bar.querySelector('.skill-glow-line');
                const dot = bar.querySelector('.skill-dot');
                const pct = parseInt(bar.dataset.pct) / 100;
                const segs = track.querySelectorAll('.skill-segment');
                const filledCount = parseInt(track.dataset.filled);

                segs.forEach((seg, si) => {
                    if (seg.dataset.filled === '1') {
                        setTimeout(() => {
                            seg.classList.add('lit');
                        }, bi * 120 + si * 55);
                    }
                });

                // Glow line
                setTimeout(() => {
                    if (glowLine) glowLine.style.width = (pct * 100) + '%';
                    if (dot) {
                        dot.style.left = (pct * 100) + '%';
                        dot.style.opacity = '1';
                    }
                }, bi * 120 + 200);
            });
            obs.disconnect();
        });
    }, { threshold: 0.25 });

    const skillSection = document.getElementById('skills');
    if (skillSection) obs.observe(skillSection);
}

// ════════════════════════════
// SCROLL REVEALS
// ════════════════════════════
function initReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
            }
        });
    }, { threshold: .1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ════════════════════════════
// MAGNETIC BUTTONS
// ════════════════════════════
function initMagnetic() {
    document.querySelectorAll('.contact-big').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) * .15;
            const y = (e.clientY - r.top - r.height / 2) * .15;
            el.style.transform = `translate(${x}px,${y}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
}

// ════════════════════════════
// TERMINAL TYPEWRITER
// ════════════════════════════
function initTerminalTyping() {
    const words = document.querySelectorAll('.hero-title .word');
    if (!words.length) return;

    const texts = Array.from(words).map(w => {
        const text = w.textContent;
        w.textContent = '';
        return text;
    });

    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    let wordIdx = 0;
    let charIdx = 0;

    function typeChar() {
        if (wordIdx >= words.length) {
            words[words.length - 1].appendChild(cursor);
            return;
        }
        
        const currentWord = words[wordIdx];
        const fullText = texts[wordIdx];

        if (charIdx === 0 && !currentWord.contains(cursor)) {
            currentWord.appendChild(cursor);
        }

        if (charIdx < fullText.length) {
            if (currentWord.contains(cursor)) currentWord.removeChild(cursor);
            currentWord.textContent = fullText.substring(0, charIdx + 1);
            currentWord.appendChild(cursor);
            charIdx++;
            // Random delay for a more authentic typing speed
            setTimeout(typeChar, Math.random() * 80 + 60);
        } else {
            if (currentWord.contains(cursor) && wordIdx < words.length - 1) {
                currentWord.removeChild(cursor);
            }
            wordIdx++;
            charIdx = 0;
            if (wordIdx < words.length) {
                setTimeout(typeChar, 200);
            } else {
                words[words.length - 1].appendChild(cursor);
            }
        }
    }

    setTimeout(typeChar, 300);
}

// ════════════════════════════
// INIT ALL
// ════════════════════════════
function initAll() {
    initWebGL();
    initCursor();
    initMarquee();
    initPreviews();
    initAbout();
    initSkillBars();
    initReveal();
    initMagnetic();
    initTerminalTyping();
}