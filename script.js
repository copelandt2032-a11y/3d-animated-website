// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

camera.position.z = 5;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x667eea, 1);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x764ba2, 0.8);
pointLight.position.set(-10, -10, 10);
scene.add(pointLight);

// Background
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
const ctx = canvas.getContext('2d');

const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#0a0e27');
gradient.addColorStop(0.5, '#1a1a3e');
gradient.addColorStop(1, '#0a0e27');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Add stars
for (let i = 0; i < 100; i++) {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.random() + ')';
    ctx.beginPath();
    ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 1.5,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

const texture = new THREE.CanvasTexture(canvas);
scene.background = texture;

// Create 3D Objects
const geometries = [];
const materials = [];
const meshes = [];

// 1. Rotating Icosahedron
const icosaGeometry = new THREE.IcosahedronGeometry(1.5, 4);
const icosahedronMaterial = new THREE.MeshPhongMaterial({
    color: 0x667eea,
    emissive: 0x667eea,
    shininess: 100,
    wireframe: false
});
const icosahedron = new THREE.Mesh(icosaGeometry, icosahedronMaterial);
icosahedron.position.set(0, 0, 0);
icosahedron.castShadow = true;
icosahedron.receiveShadow = true;
scene.add(icosahedron);
meshes.push(icosahedron);

// 2. Rotating Torus
const torusGeometry = new THREE.TorusGeometry(2, 0.6, 16, 100);
const torusMaterial = new THREE.MeshPhongMaterial({
    color: 0x764ba2,
    emissive: 0x764ba2,
    shininess: 80,
    wireframe: false
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 0, 0);
torus.rotation.x = 0.5;
torus.castShadow = true;
torus.receiveShadow = true;
scene.add(torus);
meshes.push(torus);

// 3. Orbiting particles
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 1000;
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 20;
    particlePositions[i + 1] = (Math.random() - 0.5) * 20;
    particlePositions[i + 2] = (Math.random() - 0.5) * 20;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particlesMaterial = new THREE.PointsMaterial({
    color: 0x667eea,
    size: 0.05,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.6
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// 4. Box with gradient
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshPhongMaterial({
    color: 0x667eea,
    emissive: 0x764ba2,
    shininess: 100
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(-4, 2, -3);
box.castShadow = true;
box.receiveShadow = true;
scene.add(box);
meshes.push(box);

// 5. Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x764ba2,
    emissive: 0x667eea,
    shininess: 90
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(4, 2, -3);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);
meshes.push(sphere);

// Mouse tracking
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Scroll tracking
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate icosahedron
    icosahedron.rotation.x += 0.003;
    icosahedron.rotation.y += 0.002;
    icosahedron.rotation.z += 0.001;

    // Rotate torus
    torus.rotation.x += 0.001;
    torus.rotation.y += 0.003;
    torus.rotation.z += 0.002;

    // Orbit box
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    box.position.x = Math.cos(Date.now() * 0.0005) * 4;
    box.position.z = Math.sin(Date.now() * 0.0005) * 3 - 3;

    // Orbit sphere
    sphere.rotation.x += 0.01;
    sphere.rotation.z += 0.01;
    sphere.position.x = Math.sin(Date.now() * 0.0005) * 4;
    sphere.position.z = Math.cos(Date.now() * 0.0005) * 3 - 3;

    // Rotate particles
    particles.rotation.x += 0.0001;
    particles.rotation.y += 0.0002;

    // Camera follow mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Adjust scene based on scroll
    scene.rotation.x = scrollY * 0.0001;
    scene.rotation.y = scrollY * 0.0002;

    renderer.render(scene, camera);
}

animate();

// CTA Button interaction
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        // Scroll to projects section
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    });
}

// Smooth scroll navigation
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}
