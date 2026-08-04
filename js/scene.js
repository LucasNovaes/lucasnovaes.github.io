import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const NODE_COUNT = 520;
const LINK_DISTANCE = 0.42;
const DUST_COUNT = 900;
const SPHERE_RADIUS = 2.6;

function fibonacciSphere(count, radius) {
    const points = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const ring = Math.sqrt(1 - y * y);
        const theta = golden * i;
        points.push(new THREE.Vector3(Math.cos(theta) * ring, y, Math.sin(theta) * ring).multiplyScalar(radius));
    }
    return points;
}

function buildNetwork(nodes) {
    const positions = [];
    const colors = [];
    const near = new THREE.Color("#7dd3fc");
    const far = new THREE.Color("#a78bfa");
    const threshold = LINK_DISTANCE * SPHERE_RADIUS;

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const d = nodes[i].distanceTo(nodes[j]);
            if (d > threshold) continue;
            const tint = near.clone().lerp(far, d / threshold);
            positions.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
            colors.push(tint.r, tint.g, tint.b, tint.r, tint.g, tint.b);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geometry;
}

function buildDust() {
    const positions = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 4;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
}

export function initScene(canvas) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const world = new THREE.Group();
    scene.add(world);

    const nodes = fibonacciSphere(NODE_COUNT, SPHERE_RADIUS);

    const nodeGeometry = new THREE.BufferGeometry().setFromPoints(nodes);
    const nodeCloud = new THREE.Points(nodeGeometry, new THREE.PointsMaterial({
        color: "#cfe8ff",
        size: 0.035,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
    }));
    world.add(nodeCloud);

    const links = new THREE.LineSegments(buildNetwork(nodes), new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    }));
    world.add(links);

    const dust = new THREE.Points(buildDust(), new THREE.PointsMaterial({
        color: "#8fa2d8",
        size: 0.022,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
    }));
    scene.add(dust);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    let lastW = 0;
    let lastH = 0;

    function resize() {
        const { clientWidth: w, clientHeight: h } = canvas;
        if (w === lastW && h === lastH) return;
        lastW = w;
        lastH = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // Pull the camera back on narrow screens so the sphere stays fully framed.
        camera.position.z = w < 700 ? 9.4 : 7.2;
        camera.updateProjectionMatrix();
    }

    function onPointerMove(event) {
        target.x = (event.clientX / window.innerWidth) * 2 - 1;
        target.y = (event.clientY / window.innerHeight) * 2 - 1;
    }

    window.addEventListener("resize", resize);
    if (!reducedMotion) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const clock = new THREE.Clock();
    let scrollProgress = 0;

    function frame() {
        const t = clock.getElapsedTime();

        pointer.x += (target.x - pointer.x) * 0.04;
        pointer.y += (target.y - pointer.y) * 0.04;

        scrollProgress = window.scrollY / Math.max(window.innerHeight, 1);

        if (!reducedMotion) {
            world.rotation.y = t * 0.075 + pointer.x * 0.45;
            world.rotation.x = Math.sin(t * 0.22) * 0.12 + pointer.y * 0.3;
            dust.rotation.y = -t * 0.015;
        }

        world.position.y = scrollProgress * 1.4;
        world.scale.setScalar(1 - Math.min(scrollProgress, 1) * 0.18);
        const fade = Math.max(0, 1 - scrollProgress * 0.75);
        links.material.opacity = 0.32 * fade;
        nodeCloud.material.opacity = 0.9 * fade;
        dust.material.opacity = 0.55 * fade;

        resize();
        renderer.render(scene, camera);
    }

    resize();
    renderer.setAnimationLoop(frame);
}
