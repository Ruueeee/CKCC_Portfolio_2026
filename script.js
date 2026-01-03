// ==========================================
// DIMENSIONAL PORTFOLIO SYSTEM v3.1
// With Original Mobius Strip & Mouse Reactive Objects
// ==========================================

const THEMES = {
    ai: {
        name: 'AI Solutions Specialist',
        heroTitle: 'AI Solutions Specialist',
        primary: '#6366f1',
        secondary: '#818cf8',
        accent: '#4f46e5',
        color: '#6366f1',
        bgType: 'mobius',
        horrorColor: '#ff00ff',
        description: 'Building intelligent systems that learn and adapt'
    },
    multimedia: {
        name: 'Multimedia Designer',
        heroTitle: 'Multimedia Designer',
        primary: '#ec4899',
        secondary: '#f472b6',
        accent: '#db2777',
        color: '#ec4899',
        bgType: 'shapes',
        horrorColor: '#ff1493',
        description: 'Creating stunning visual experiences that captivate'
    },
    automation: {
        name: 'Automation Expert',
        heroTitle: 'Automation Expert',
        primary: '#10b981',
        secondary: '#34d399',
        accent: '#059669',
        color: '#10b981',
        bgType: 'circuit',
        horrorColor: '#00ff00',
        description: 'Streamlining workflows with smart automation'
    },
    webdev: {
        name: 'Web Developer',
        heroTitle: 'Web Developer',
        primary: '#f59e0b',
        secondary: '#fbbf24',
        accent: '#d97706',
        color: '#f59e0b',
        bgType: 'matrix',
        horrorColor: '#ff6600',
        description: 'Crafting responsive and dynamic web solutions'
    }
};

const THEME_ORDER = ['ai', 'multimedia', 'automation', 'webdev'];
let currentThemeIndex = 0;
let scene, camera, renderer, backgroundObjects = [];
let horrorMode = false;
let tapCount = 0;
let tapTimer = null;
let dataPackets = [];
let matrixChars = [];
let circuitNodes = [];
let circuitConnections = [];
let mobiusStrip, particleSystem;
let mouseX = 0, mouseY = 0;
let mouse3D = new THREE.Vector3();
let raycaster = new THREE.Raycaster();
let time = 0;

// ==========================================
// THREE.JS BACKGROUND SYSTEM
// ==========================================

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 70;

    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('threejs-canvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Lighting for Mobius strip
    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.3);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0x6366f1, 0.8);
    directionalLight1.position.set(50, 50, 50);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0x06b6d4, 0.6);
    directionalLight2.position.set(-50, -30, 30);
    scene.add(directionalLight2);

    // Mouse tracking
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    createBackground(THEMES[THEME_ORDER[currentThemeIndex]].bgType);
    animate();
}

function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.0003;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.0003;
    
    // Update 3D mouse position for raycasting
    mouse3D.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse3D.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function clearBackground() {
    // Clear all background objects
    backgroundObjects.forEach(obj => {
        scene.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
            else obj.material.dispose();
        }
    });
    
    // Clear matrix chars separately (they may not all be in backgroundObjects)
    matrixChars.forEach(obj => {
        scene.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
            if (obj.material.map) obj.material.map.dispose();
            obj.material.dispose();
        }
    });
    
    // Clear mobius and particle system
    if (mobiusStrip) {
        scene.remove(mobiusStrip);
        if (mobiusStrip.geometry) mobiusStrip.geometry.dispose();
        if (mobiusStrip.material) mobiusStrip.material.dispose();
    }
    if (particleSystem) {
        scene.remove(particleSystem);
        if (particleSystem.geometry) particleSystem.geometry.dispose();
        if (particleSystem.material) particleSystem.material.dispose();
    }
    
    backgroundObjects = [];
    dataPackets = [];
    matrixChars = [];
    circuitNodes = [];
    circuitConnections = [];
    mobiusStrip = null;
    particleSystem = null;
}

function createBackground(type) {
    clearBackground();
    switch(type) {
        case 'mobius': createMobiusStrip(); break;
        case 'shapes': createFloatingShapes(); break;
        case 'circuit': createCircuitBoard(); break;
        case 'matrix': createCodeMatrix(); break;
    }
}

// ==========================================
// MOBIUS STRIP - AI THEME (Original)
// ==========================================

function createMobiusStrip() {
    // Create Mobius strip geometry manually - LARGER SCALE
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    const uSegments = 120;
    const vSegments = 30;

    for (let i = 0; i <= uSegments; i++) {
        for (let j = 0; j <= vSegments; j++) {
            const u = (i / uSegments) * Math.PI * 2;
            const v = (j / vSegments - 0.5) * 1.2;
            
            const radius = 35;
            const x = (radius + v * Math.cos(u / 2)) * Math.cos(u);
            const y = (radius + v * Math.cos(u / 2)) * Math.sin(u);
            const z = v * Math.sin(u / 2);
            
            vertices.push(x, y, z);
        }
    }

    for (let i = 0; i < uSegments; i++) {
        for (let j = 0; j < vSegments; j++) {
            const a = i * (vSegments + 1) + j;
            const b = a + 1;
            const c = (i + 1) * (vSegments + 1) + j;
            const d = c + 1;
            
            indices.push(a, b, c);
            indices.push(b, d, c);
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    geometry.computeVertexNormals();
    
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x6366f1,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
        transmission: 0.3,
        thickness: 0.5,
        side: THREE.DoubleSide,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    mobiusStrip = new THREE.Mesh(geometry, material);
    scene.add(mobiusStrip);
    backgroundObjects.push(mobiusStrip);

    // Wireframe overlay
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const wireframeMesh = new THREE.Mesh(geometry.clone(), wireframeMaterial);
    mobiusStrip.add(wireframeMesh);

    // Glow effect
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    const glowMesh = new THREE.Mesh(geometry.clone(), glowMaterial);
    glowMesh.scale.multiplyScalar(1.02);
    mobiusStrip.add(glowMesh);

    // Create particle system
    createParticleSystem();
}

function createParticleSystem() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x6366f1);
    const color2 = new THREE.Color(0x06b6d4);
    const color3 = new THREE.Color(0xf59e0b);

    // Original spherical distribution around Mobius strip
    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 150 + 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        const colorChoice = Math.random();
        let color = colorChoice < 0.4 ? color1 : colorChoice < 0.8 ? color2 : color3;
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

// ==========================================
// FLOATING SHAPES - MULTIMEDIA THEME (Mouse Reactive + Spreading)
// ==========================================

function createFloatingShapes() {
    // Pink/purple floating geometric shapes for Multimedia Designer
    const colors = [0xec4899, 0xf472b6, 0xdb2777, 0xfce7f3, 0xa855f7];
    
    for (let i = 0; i < 60; i++) {
        // Create random geometry
        let geometry;
        const type = Math.floor(Math.random() * 5);
        if (type === 0) geometry = new THREE.IcosahedronGeometry(3, 0);
        else if (type === 1) geometry = new THREE.OctahedronGeometry(3, 0);
        else if (type === 2) geometry = new THREE.TetrahedronGeometry(3, 0);
        else if (type === 3) geometry = new THREE.BoxGeometry(3, 3, 3);
        else geometry = new THREE.SphereGeometry(2, 8, 8);
        
        const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            wireframe: Math.random() > 0.5,
            transparent: true,
            opacity: 0.7
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        // Start from random positions
        const x = (Math.random() - 0.5) * 120;
        const y = (Math.random() - 0.5) * 90;
        const z = (Math.random() - 0.5) * 50;
        mesh.position.set(x, y, z);
        mesh.scale.setScalar(1 + Math.random() * 2);
        
        // Calculate direction from center for spreading effect
        const dirX = x !== 0 ? x / Math.abs(x) : (Math.random() - 0.5) * 2;
        const dirY = y !== 0 ? y / Math.abs(y) : (Math.random() - 0.5) * 2;
        
        // Movement with spreading velocity
        mesh.userData = {
            rotX: (Math.random() - 0.5) * 0.003,
            rotY: (Math.random() - 0.5) * 0.003,
            floatSpeed: Math.random() * 0.1 + 0.05,
            floatOffset: Math.random() * Math.PI * 2,
            origY: y,
            origX: x,
            floatAmount: 1 + Math.random() * 2,
            // Spreading movement
            velocity: new THREE.Vector3(
                dirX * (Math.random() * 0.03 + 0.01),
                dirY * (Math.random() * 0.02 + 0.01),
                (Math.random() - 0.5) * 0.01
            ),
            maxDist: 70 + Math.random() * 30,
            isMultimediaShape: true
        };
        
        scene.add(mesh);
        backgroundObjects.push(mesh);
    }
}

// ==========================================
// CIRCUIT BOARD - AUTOMATION THEME (Mouse Reactive)
// ==========================================

function createCircuitBoard() {
    // Create grid of nodes (dots) - like a web/network
    const gridSize = 12;
    const spacing = 15;
    const offsetX = (gridSize * spacing) / 2;
    const offsetY = (gridSize * spacing) / 2;
    
    // Create nodes in a grid pattern with some randomness
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // Skip some nodes randomly for organic look
            if (Math.random() < 0.3) continue;
            
            const x = i * spacing - offsetX + (Math.random() - 0.5) * 8;
            const y = j * spacing - offsetY + (Math.random() - 0.5) * 8;
            const z = (Math.random() - 0.5) * 30;
            
            // Create glowing node (dot)
            const nodeSize = 0.8 + Math.random() * 0.8;
            const nodeGeo = new THREE.SphereGeometry(nodeSize, 16, 16);
            const nodeMat = new THREE.MeshBasicMaterial({ 
                color: 0x10b981, 
                transparent: true, 
                opacity: 0.9 
            });
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.set(x, y, z);
            node.userData = { 
                originalPos: node.position.clone(),
                pulse: Math.random() * Math.PI * 2,
                baseScale: 1,
                floatSpeed: Math.random() * 0.3 + 0.1,
                floatOffset: Math.random() * Math.PI * 2,
                floatAmount: 1 + Math.random() * 2,
                isCircuitNode: true,
                connections: [], // Track which connections belong to this node
                nodeIndex: circuitNodes.length
            };
            scene.add(node);
            circuitNodes.push(node);
            backgroundObjects.push(node);
            
            // Add outer glow ring
            const ringGeo = new THREE.RingGeometry(nodeSize * 1.5, nodeSize * 2, 16);
            const ringMat = new THREE.MeshBasicMaterial({ 
                color: 0x34d399, 
                transparent: true, 
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.copy(node.position);
            ring.userData = { 
                parentNode: node,
                pulse: Math.random() * Math.PI * 2 
            };
            scene.add(ring);
            backgroundObjects.push(ring);
        }
    }
    
    // Connect nearby nodes with lines (web effect)
    const maxConnectionDist = spacing * 2;
    for (let i = 0; i < circuitNodes.length; i++) {
        for (let j = i + 1; j < circuitNodes.length; j++) {
            const dist = circuitNodes[i].position.distanceTo(circuitNodes[j].position);
            if (dist < maxConnectionDist && Math.random() < 0.6) {
                const points = [circuitNodes[i].position.clone(), circuitNodes[j].position.clone()];
                const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
                const lineMat = new THREE.LineBasicMaterial({ 
                    color: 0x10b981, 
                    transparent: true, 
                    opacity: 0.4 + Math.random() * 0.3
                });
                const line = new THREE.Line(lineGeo, lineMat);
                line.userData = { 
                    startNode: circuitNodes[i], 
                    endNode: circuitNodes[j],
                    startNodeIndex: i,
                    endNodeIndex: j,
                    points: points,
                    baseOpacity: lineMat.opacity,
                    isCircuitLine: true,
                    originalColor: 0x10b981
                };
                scene.add(line);
                circuitConnections.push(line);
                backgroundObjects.push(line);
                
                // Add connection reference to both nodes
                circuitNodes[i].userData.connections.push(line);
                circuitNodes[j].userData.connections.push(line);
            }
        }
    }

    // Data packets running along connections
    for (let i = 0; i < 80; i++) {
        if (circuitConnections.length === 0) break;
        const connection = circuitConnections[Math.floor(Math.random() * circuitConnections.length)];
        
        const packetGeo = new THREE.SphereGeometry(0.4, 8, 8);
        const packetMat = new THREE.MeshBasicMaterial({ 
            color: 0x00ff88, 
            transparent: true, 
            opacity: 1 
        });
        const packet = new THREE.Mesh(packetGeo, packetMat);
        
        packet.userData = {
            pathPoints: connection.userData.points,
            currentSegment: 0,
            segmentProgress: Math.random(),
            speed: 0.02 + Math.random() * 0.04,
            reverse: Math.random() > 0.5
        };
        
        scene.add(packet);
        dataPackets.push(packet);
        backgroundObjects.push(packet);
    }

    // Add some larger hub nodes
    for (let i = 0; i < 8; i++) {
        const hubGeo = new THREE.IcosahedronGeometry(2.5, 1);
        const hubMat = new THREE.MeshBasicMaterial({ 
            color: 0x059669, 
            wireframe: true,
            transparent: true, 
            opacity: 0.7 
        });
        const hub = new THREE.Mesh(hubGeo, hubMat);
        hub.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 25
        );
        hub.userData = { 
            originalPos: hub.position.clone(),
            rotSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            baseScale: 1,
            floatSpeed: Math.random() * 0.2 + 0.1,
            floatOffset: Math.random() * Math.PI * 2,
            floatAmount: 2 + Math.random() * 3,
            isHubNode: true
        };
        scene.add(hub);
        backgroundObjects.push(hub);
    }

    // Rotating gears scattered around
    for (let i = 0; i < 8; i++) {
        const gear = createGear();
        gear.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 25
        );
        const scale = 1 + Math.random() * 2;
        gear.scale.set(scale, scale, scale);
        gear.userData = { 
            originalPos: gear.position.clone(),
            rotSpeed: (Math.random() - 0.5) * 0.02,
            baseScale: scale,
            floatSpeed: Math.random() * 0.15 + 0.08,
            floatOffset: Math.random() * Math.PI * 2,
            floatAmount: 1.5 + Math.random() * 2,
            isGear: true
        };
        scene.add(gear);
        backgroundObjects.push(gear);
    }
}

function createGear() {
    const shape = new THREE.Shape();
    const teeth = 12;
    const innerRadius = 1.5;
    const outerRadius = 2;
    
    for (let i = 0; i < teeth; i++) {
        const angle1 = (i / teeth) * Math.PI * 2;
        const angle2 = ((i + 0.3) / teeth) * Math.PI * 2;
        const angle3 = ((i + 0.5) / teeth) * Math.PI * 2;
        const angle4 = ((i + 0.8) / teeth) * Math.PI * 2;
        
        if (i === 0) shape.moveTo(Math.cos(angle1) * innerRadius, Math.sin(angle1) * innerRadius);
        shape.lineTo(Math.cos(angle2) * innerRadius, Math.sin(angle2) * innerRadius);
        shape.lineTo(Math.cos(angle2) * outerRadius, Math.sin(angle2) * outerRadius);
        shape.lineTo(Math.cos(angle3) * outerRadius, Math.sin(angle3) * outerRadius);
        shape.lineTo(Math.cos(angle4) * innerRadius, Math.sin(angle4) * innerRadius);
    }
    
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({ color: 0x059669, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    return new THREE.Mesh(geometry, material);
}

// ==========================================
// CODE MATRIX - WEBDEV THEME (Mouse Reactive)
// ==========================================

function createCodeMatrix() {
    // Reduced columns and rows for better performance
    const columns = 25;
    // Extended Japanese (Katakana + Hiragana) and English characters
    const japaneseChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
    const englishChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>{}[]()=+-*/&|!?@#$%';
    const chars = japaneseChars + englishChars;
    
    for (let col = 0; col < columns; col++) {
        const x = (col / columns) * 120 - 60;
        const columnLength = Math.floor(Math.random() * 12) + 6; // Reduced length
        const columnSpeed = 0.1 + Math.random() * 0.15;
        const z = (Math.random() - 0.5) * 30;
        
        for (let row = 0; row < columnLength; row++) {
            const canvas = document.createElement('canvas');
            canvas.width = 32; // Smaller canvas
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            
            const brightness = row === 0 ? 1 : 0.4 + (row / columnLength) * 0.3;
            ctx.fillStyle = row === 0 ? '#ffffff' : `rgba(245, 158, 11, ${brightness})`;
            ctx.font = 'bold 24px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(chars[Math.floor(Math.random() * chars.length)], 16, 16);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: brightness });
            const sprite = new THREE.Sprite(material);
            
            const startY = 55 - row * 4;
            sprite.position.set(x + (Math.random() - 0.5) * 2, startY, z);
            sprite.scale.set(3, 3, 1);
            
            sprite.userData = {
                fallSpeed: columnSpeed,
                resetY: 60,
                startY: -60,
                charChangeTimer: Math.random() * 15,
                charChangeInterval: 8 + Math.random() * 20, // More frequent changes for matrix effect
                isHead: row === 0,
                chars: chars,
                ctx: ctx,
                canvas: canvas,
                texture: texture
            };
            
            scene.add(sprite);
            matrixChars.push(sprite);
        }
    }
    
    // Floating code symbols - reduced count
    const symbols = ['{', '}', '[', ']', '<', '>', '(', ')', ';', '='];
    for (let i = 0; i < 20; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 64; // Smaller canvas
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbols[Math.floor(Math.random() * symbols.length)], 32, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.5 });
        const sprite = new THREE.Sprite(material);
        
        sprite.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 40
        );
        sprite.scale.set(5, 5, 1);
        sprite.userData = {
            originalPos: sprite.position.clone(),
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03, 0),
            floatSpeed: Math.random() * 1.5 + 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            isWebDevSymbol: true
        };
        
        scene.add(sprite);
        backgroundObjects.push(sprite);
    }
}

// ==========================================
// ANIMATION LOOP - FIXED
// ==========================================

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    // Mobius strip animation (AI theme only)
    if (mobiusStrip) {
        mobiusStrip.rotation.x = time * 0.2 + mouseY * 3;
        mobiusStrip.rotation.y = time * 0.3 + mouseX * 3;
        mobiusStrip.rotation.z = time * 0.1;
    }
    
    // Particle system animation (AI theme only) - original simple rotation
    if (particleSystem) {
        particleSystem.rotation.x = time * 0.05;
        particleSystem.rotation.y = time * 0.08;
    }
    
    // Animate all background objects based on their userData
    for (let i = 0; i < backgroundObjects.length; i++) {
        const obj = backgroundObjects[i];
        if (!obj || obj === mobiusStrip || obj === particleSystem) continue;
        
        const ud = obj.userData;
        if (!ud) continue;
        
        // Multimedia shapes - spreading movement with rotation and floating
        if (ud.isMultimediaShape && ud.velocity) {
            // Apply spreading velocity
            ud.origX += ud.velocity.x;
            ud.origY += ud.velocity.y;
            obj.position.z += ud.velocity.z;
            
            // Bounce back when too far from center
            const distFromCenter = Math.sqrt(ud.origX * ud.origX + ud.origY * ud.origY);
            if (distFromCenter > ud.maxDist) {
                ud.velocity.x *= -0.8;
                ud.velocity.y *= -0.8;
            }
            // Also bounce from edges
            if (Math.abs(ud.origX) > 65) ud.velocity.x *= -1;
            if (Math.abs(ud.origY) > 50) ud.velocity.y *= -1;
            if (Math.abs(obj.position.z) > 30) ud.velocity.z *= -1;
            
            // Apply position with floating
            obj.position.x = ud.origX + Math.sin(time * ud.floatSpeed * 0.5 + ud.floatOffset) * ud.floatAmount;
            obj.position.y = ud.origY + Math.sin(time * ud.floatSpeed + ud.floatOffset) * ud.floatAmount;
            
            // Rotation
            obj.rotation.x += ud.rotX;
            obj.rotation.y += ud.rotY;
        }
        // Legacy multimedia shapes (without isMultimediaShape flag)
        else if (ud.rotX !== undefined && ud.origY !== undefined && !ud.isMultimediaShape) {
            obj.rotation.x += ud.rotX;
            obj.rotation.y += ud.rotY;
            obj.position.y = ud.origY + Math.sin(time * ud.floatSpeed + ud.floatOffset) * 1.5;
        }
        
        // Circuit nodes - pulse effect and floating movement
        if (ud.isCircuitNode && ud.originalPos) {
            // Floating movement
            const floatY = Math.sin(time * ud.floatSpeed + ud.floatOffset) * ud.floatAmount;
            const floatX = Math.cos(time * ud.floatSpeed * 0.7 + ud.floatOffset) * (ud.floatAmount * 0.5);
            obj.position.x = ud.originalPos.x + floatX;
            obj.position.y = ud.originalPos.y + floatY;
            
            // Pulse effect
            const pulseScale = 1 + Math.sin(time * 2 + ud.pulse) * 0.2;
            obj.scale.setScalar(ud.baseScale * pulseScale);
        }
        
        // Circuit connection lines - update to follow moving nodes
        if (ud.isCircuitLine && ud.startNode && ud.endNode) {
            // Update line geometry to follow node positions
            const positions = obj.geometry.attributes.position.array;
            positions[0] = ud.startNode.position.x;
            positions[1] = ud.startNode.position.y;
            positions[2] = ud.startNode.position.z;
            positions[3] = ud.endNode.position.x;
            positions[4] = ud.endNode.position.y;
            positions[5] = ud.endNode.position.z;
            obj.geometry.attributes.position.needsUpdate = true;
            
            // Update path points for data packets
            ud.points[0].copy(ud.startNode.position);
            ud.points[1].copy(ud.endNode.position);
        }
        
        // Circuit rings - follow parent node and rotate
        if (ud.parentNode) {
            obj.position.copy(ud.parentNode.position);
            obj.rotation.z = time * 2;
        }
        
        // Hub nodes - rotate and float
        if (ud.isHubNode && ud.originalPos) {
            // Floating movement
            const floatY = Math.sin(time * ud.floatSpeed + ud.floatOffset) * ud.floatAmount;
            const floatX = Math.cos(time * ud.floatSpeed * 0.6 + ud.floatOffset) * (ud.floatAmount * 0.4);
            obj.position.x = ud.originalPos.x + floatX;
            obj.position.y = ud.originalPos.y + floatY;
            
            // Rotation
            if (ud.rotSpeed) {
                obj.rotation.x += ud.rotSpeed.x;
                obj.rotation.y += ud.rotSpeed.y;
                obj.rotation.z += ud.rotSpeed.z;
            }
        }
        
        // Gears - rotate and float
        if (ud.isGear && ud.originalPos) {
            // Floating movement
            const floatY = Math.sin(time * ud.floatSpeed + ud.floatOffset) * ud.floatAmount;
            obj.position.y = ud.originalPos.y + floatY;
            
            // Rotation
            if (ud.rotSpeed) {
                obj.rotation.z += ud.rotSpeed;
            }
        }
        
        // Generic rotation for other objects with rotSpeed (backward compatibility)
        if (ud.rotSpeed && !ud.isHubNode && !ud.isGear) {
            if (typeof ud.rotSpeed === 'object') {
                obj.rotation.x += ud.rotSpeed.x;
                obj.rotation.y += ud.rotSpeed.y;
                obj.rotation.z += ud.rotSpeed.z;
            } else {
                obj.rotation.z += ud.rotSpeed;
            }
        }
        
        // WebDev floating symbols - move with velocity and float
        if (ud.velocity && ud.originalPos) {
            ud.originalPos.add(ud.velocity);;
            // Bounce off boundaries
            if (Math.abs(ud.originalPos.x) > 70) ud.velocity.x *= -1;
            if (Math.abs(ud.originalPos.y) > 55) ud.velocity.y *= -1;
            // Apply position with floating
            obj.position.x = ud.originalPos.x;
            obj.position.y = ud.originalPos.y + Math.sin(time * ud.floatSpeed + ud.floatOffset) * 3;
            obj.position.z = ud.originalPos.z;
            // Rotate
            obj.material.rotation += 0.01;
        }
    }
    
    // Data packets animation (circuit theme)
    for (let i = 0; i < dataPackets.length; i++) {
        const packet = dataPackets[i];
        const ud = packet.userData;
        if (!ud || !ud.pathPoints || ud.pathPoints.length < 2) continue;
        
        // Move along path
        if (ud.reverse) {
            ud.segmentProgress -= ud.speed;
            if (ud.segmentProgress <= 0) {
                ud.segmentProgress = 0;
                ud.reverse = false;
            }
        } else {
            ud.segmentProgress += ud.speed;
            if (ud.segmentProgress >= 1) {
                ud.segmentProgress = 1;
                ud.reverse = true;
            }
        }
        
        // Interpolate position
        packet.position.lerpVectors(ud.pathPoints[0], ud.pathPoints[1], ud.segmentProgress);
        
        // Pulse effect
        const scale = 0.8 + Math.sin(time * 5) * 0.3;
        packet.scale.setScalar(scale);
        packet.material.opacity = 0.7 + Math.sin(time * 8) * 0.3;
    }
    
    // Matrix characters falling (webdev theme)
    for (let i = 0; i < matrixChars.length; i++) {
        const char = matrixChars[i];
        const ud = char.userData;
        if (!ud || !ud.fallSpeed) continue;
        
        // Fall down
        char.position.y -= ud.fallSpeed;
        
        // Reset at bottom
        if (char.position.y < ud.startY) {
            char.position.y = ud.resetY;
        }
        
        // Random character change while falling - more frequent for matrix effect
        ud.charChangeTimer++;
        if (ud.charChangeTimer >= ud.charChangeInterval) {
            ud.charChangeTimer = 0;
            // Randomize next interval for organic feel
            ud.charChangeInterval = 8 + Math.random() * 20;
            
            const ctx = ud.ctx;
            const chars = ud.chars;
            ctx.clearRect(0, 0, 32, 32);
            ctx.fillStyle = ud.isHead ? '#ffffff' : '#f59e0b';
            ctx.font = 'bold 24px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(chars[Math.floor(Math.random() * chars.length)], 16, 16);
            ud.texture.needsUpdate = true;
        }
    }
    
    // Mouse hover interaction with 3D objects (smoother animation)
    raycaster.setFromCamera(mouse3D, camera);
    const intersects = raycaster.intersectObjects(backgroundObjects, false);
    
    // Track currently hovered object
    let hoveredObj = null;
    if (intersects.length > 0) {
        hoveredObj = intersects[0].object;
    }
    
    // Smoothly animate all objects - scale back non-hovered, scale up hovered
    for (let i = 0; i < backgroundObjects.length; i++) {
        const obj = backgroundObjects[i];
        if (!obj || !obj.userData || obj === mobiusStrip || obj === particleSystem) continue;
        
        // Store original scale if not stored
        if (!obj.userData.originalScale) {
            obj.userData.originalScale = obj.scale.clone();
        }
        
        if (obj === hoveredObj) {
            // Scale up smoothly on hover
            const targetScale = obj.userData.originalScale.clone().multiplyScalar(1.3);
            obj.scale.lerp(targetScale, 0.08);
            
            // Push multimedia shapes away from mouse
            if (obj.userData.isMultimediaShape && obj.userData.velocity) {
                const pushStrength = 0.015;
                obj.userData.velocity.x += (obj.position.x > 0 ? 1 : -1) * pushStrength;
                obj.userData.velocity.y += (obj.position.y > 0 ? 1 : -1) * pushStrength;
            }
            
            // Circuit node hover - rewire connections (only once per hover)
            if (obj.userData.isCircuitNode && obj.userData.connections && circuitNodes.length > 2 && !obj.userData.isCurrentlyHovered) {
                obj.userData.isCurrentlyHovered = true;
                const nodeConnections = obj.userData.connections;
                const currentNodeIndex = obj.userData.nodeIndex;
                
                // Rewire each connection to a random different node
                for (let j = 0; j < nodeConnections.length; j++) {
                    const conn = nodeConnections[j];
                    
                    let newNodeIndex;
                    let attempts = 0;
                    do {
                        newNodeIndex = Math.floor(Math.random() * circuitNodes.length);
                        attempts++;
                    } while ((newNodeIndex === currentNodeIndex || 
                              newNodeIndex === conn.userData.startNodeIndex || 
                              newNodeIndex === conn.userData.endNodeIndex) && 
                              attempts < 10);
                    
                    if (attempts < 10) {
                        const newNode = circuitNodes[newNodeIndex];
                        
                        if (conn.userData.startNodeIndex === currentNodeIndex) {
                            conn.userData.endNode = newNode;
                            conn.userData.endNodeIndex = newNodeIndex;
                        } else {
                            conn.userData.startNode = newNode;
                            conn.userData.startNodeIndex = newNodeIndex;
                        }
                        
                        conn.material.color.setHex(0x00ffff);
                        conn.material.opacity = 0.9;
                    }
                }
                obj.material.color.setHex(0x00ffff);
            }
        } else {
            // Smoothly scale back to original
            obj.scale.lerp(obj.userData.originalScale, 0.05);
            
            // Reset circuit node hover state
            if (obj.userData.isCircuitNode && obj.userData.isCurrentlyHovered) {
                obj.userData.isCurrentlyHovered = false;
                obj.material.color.setHex(0x10b981);
            }
        }
    }
    
    // Smooth mouse decay
    mouseX *= 0.95;
    mouseY *= 0.95;
    
    renderer.render(scene, camera);
}

// ==========================================
// DIMENSIONAL SLASH SYSTEM
// ==========================================

class DimensionalSlashSystem {
    constructor() {
        this.container = document.querySelector('.dimensional-slashes');
        this.slashInterval = null;
        this.currentTheme = 'ai';
        this.slashQueue = [];
        this.isTransitioning = false;
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
    }
    
    startSlashing() {
        this.stopSlashing();
        this.slashInterval = setInterval(() => {
            if (Math.random() < 0.25) this.createSlash();
        }, 3000);
    }
    
    stopSlashing() {
        if (this.slashInterval) {
            clearInterval(this.slashInterval);
            this.slashInterval = null;
        }
    }
    
    // Create multiple slashes for dimension break (rapid clicks)
    createDimensionBreak(count = 8) {
        // Create slashes in rapid succession
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createFullScreenSlash();
            }, i * 50);
        }
    }
    
    createSlash() {
        this.createFullScreenSlash();
    }
    
    createFullScreenSlash() {
        const slash = document.createElement('div');
        slash.className = 'dimensional-slash';
        
        const themeColor = THEMES[this.currentTheme].color;
        
        // Calculate diagonal length to span entire screen
        const screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
        
        // Random angle but ensure it spans across
        const angleVariation = (Math.random() - 0.5) * 60; // -30 to +30 degrees variation
        const baseAngles = [45, -45, 135, -135, 30, -30, 60, -60];
        const angle = baseAngles[Math.floor(Math.random() * baseAngles.length)] + angleVariation;
        const rad = angle * Math.PI / 180;
        
        // Start from outside the screen to ensure full coverage
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate start point (outside screen)
        const startX = centerX - Math.cos(rad) * (screenDiagonal / 2 + 100);
        const startY = centerY - Math.sin(rad) * (screenDiagonal / 2 + 100);
        
        const length = screenDiagonal + 200; // Extra to ensure full screen coverage
        
        slash.style.cssText = `
            position: fixed;
            left: ${startX}px;
            top: ${startY}px;
            width: 0;
            height: 5px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                ${themeColor} 10%, 
                white 50%, 
                ${themeColor} 90%, 
                transparent 100%
            );
            transform: rotate(${angle}deg);
            transform-origin: left center;
            pointer-events: none;
            z-index: 999;
            box-shadow: 
                0 0 20px ${themeColor}, 
                0 0 40px ${themeColor}, 
                0 0 80px ${themeColor},
                0 0 120px ${themeColor};
            filter: brightness(1.8);
            border-radius: 3px;
        `;
        
        this.container.appendChild(slash);
        
        // Animate the slash extending across entire screen
        requestAnimationFrame(() => {
            slash.style.transition = 'width 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            slash.style.width = `${length}px`;
        });
        
        // Create sparks along the full length
        const sparkCount = 25;
        for (let i = 0; i < sparkCount; i++) {
            setTimeout(() => this.createSpark(startX, startY, angle, length, i / sparkCount), i * 8);
        }
        
        // Create the dimensional rift effect at center
        setTimeout(() => this.createRift(centerX, centerY, angle, length), 100);
        
        // Create edge impact effects
        setTimeout(() => this.createEdgeImpact(angle), 150);
        
        // Fade out
        setTimeout(() => {
            slash.style.transition = 'opacity 0.4s ease-out';
            slash.style.opacity = '0';
        }, 250);
        
        setTimeout(() => slash.remove(), 700);
    }
    
    createEdgeImpact(angle) {
        const themeColor = THEMES[this.currentTheme].color;
        
        // Create impact bursts at screen edges
        const impacts = [
            { x: 0, y: window.innerHeight / 2 },
            { x: window.innerWidth, y: window.innerHeight / 2 },
            { x: window.innerWidth / 2, y: 0 },
            { x: window.innerWidth / 2, y: window.innerHeight }
        ];
        
        impacts.forEach((impact, index) => {
            setTimeout(() => {
                for (let i = 0; i < 8; i++) {
                    const particle = document.createElement('div');
                    const particleAngle = (i / 8) * Math.PI * 2;
                    const speed = 50 + Math.random() * 100;
                    
                    particle.style.cssText = `
                        position: fixed;
                        left: ${impact.x}px;
                        top: ${impact.y}px;
                        width: ${6 + Math.random() * 8}px;
                        height: ${6 + Math.random() * 8}px;
                        background: ${Math.random() > 0.3 ? themeColor : '#ffffff'};
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 1001;
                        box-shadow: 0 0 15px ${themeColor};
                        animation: edgeParticle 0.5s ease-out forwards;
                        --px: ${Math.cos(particleAngle) * speed}px;
                        --py: ${Math.sin(particleAngle) * speed}px;
                    `;
                    
                    this.container.appendChild(particle);
                    setTimeout(() => particle.remove(), 500);
                }
            }, index * 30);
        });
    }
    
    createSpark(x, y, angle, maxDist, progress) {
        const spark = document.createElement('div');
        const rad = angle * Math.PI / 180;
        const dist = maxDist * progress;
        const themeColor = THEMES[this.currentTheme].color;
        
        const sparkX = x + Math.cos(rad) * dist;
        const sparkY = y + Math.sin(rad) * dist;
        
        // Random offset perpendicular to slash
        const perpOffset = (Math.random() - 0.5) * 60;
        const perpRad = rad + Math.PI / 2;
        
        spark.style.cssText = `
            position: fixed;
            left: ${sparkX + Math.cos(perpRad) * perpOffset}px;
            top: ${sparkY + Math.sin(perpRad) * perpOffset}px;
            width: ${5 + Math.random() * 8}px;
            height: ${5 + Math.random() * 8}px;
            background: ${Math.random() > 0.4 ? themeColor : '#ffffff'};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 15px ${themeColor}, 0 0 30px ${themeColor};
            animation: sparkFly 0.5s ease-out forwards;
            --spark-x: ${(Math.random() - 0.5) * 150}px;
            --spark-y: ${(Math.random() - 0.5) * 150}px;
        `;
        
        this.container.appendChild(spark);
        setTimeout(() => spark.remove(), 500);
    }
    
    createRift(x, y, angle, length) {
        const rift = document.createElement('div');
        const themeColor = THEMES[this.currentTheme].color;
        
        rift.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${length}px;
            height: 3px;
            background: transparent;
            transform: translate(-50%, -50%) rotate(${angle}deg);
            pointer-events: none;
            z-index: 998;
            box-shadow: 
                0 0 40px 15px ${themeColor}60,
                0 0 80px 30px ${themeColor}40,
                0 0 120px 50px ${themeColor}20;
            animation: riftPulse 0.6s ease-out forwards;
        `;
        
        this.container.appendChild(rift);
        setTimeout(() => rift.remove(), 600);
    }
    
    createSlashParticle(x, y, angle) {
        const particle = document.createElement('div');
        const rad = angle * Math.PI / 180;
        const dist = Math.random() * 200;
        const themeColor = THEMES[this.currentTheme].color;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x + Math.cos(rad) * dist}px;
            top: ${y + Math.sin(rad) * dist}px;
            width: 4px;
            height: 4px;
            background: ${themeColor};
            border-radius: 50%;
            pointer-events: none;
            z-index: 998;
            animation: particleFade 0.5s ease-out forwards;
        `;
        
        this.container.appendChild(particle);
        setTimeout(() => particle.remove(), 500);
    }
}

// ==========================================
// THEME MANAGER
// ==========================================

class ThemeManager {
    constructor() {
        this.currentTheme = 'ai';
        this.themeOrder = ['ai', 'multimedia', 'automation', 'webdev'];
        this.currentIndex = 0;
        this.autoChangeInterval = null;
        this.autoChangeEnabled = true;
        this.slashSystem = new DimensionalSlashSystem();
        this.horrorColors = {
            ai: '#8b0000',
            multimedia: '#4a0040',
            automation: '#002800',
            webdev: '#4a2800'
        };
        
        // Rapid click handling
        this.clickCount = 0;
        this.clickTimer = null;
        this.isTransitioning = false;
        this.pendingTheme = null;
    }
    
    init() {
        this.applyTheme(this.currentTheme, false);
        this.setupLogoClick();
        this.createAutoChangeToggle();
        this.startAutoChange();
        this.slashSystem.startSlashing();
        this.animateHeroTitle();
    }
    
    setupLogoClick() {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.style.cursor = 'pointer';
            logo.title = '🔄 Click to change theme!';
            
            // Add hint tooltip
            const hint = document.createElement('span');
            hint.className = 'theme-hint';
            hint.textContent = '← Click to change theme!';
            hint.style.cssText = `
                position: absolute;
                left: 100%;
                top: 50%;
                transform: translateY(-50%);
                margin-left: 10px;
                font-size: 0.7rem;
                color: var(--primary-color);
                white-space: nowrap;
                opacity: 0.8;
                animation: hintPulse 2s ease-in-out infinite;
                pointer-events: none;
            `;
            logo.style.position = 'relative';
            logo.appendChild(hint);
            
            // Hide hint after 10 seconds
            setTimeout(() => {
                hint.style.transition = 'opacity 1s ease-out';
                hint.style.opacity = '0';
                setTimeout(() => hint.remove(), 1000);
            }, 10000);
            
            logo.addEventListener('click', () => {
                this.handleClick();
            });
        }
    }
    
    handleClick() {
        this.clickCount++;
        
        // Calculate next theme
        const nextIndex = (this.currentIndex + this.clickCount) % this.themeOrder.length;
        this.pendingTheme = this.themeOrder[nextIndex];
        
        // Create a slash for each click
        this.slashSystem.createFullScreenSlash();
        
        // Clear existing timer
        if (this.clickTimer) {
            clearTimeout(this.clickTimer);
        }
        
        // Wait for clicks to stop, then transition
        this.clickTimer = setTimeout(() => {
            const clicks = this.clickCount;
            const nextIndex = (this.currentIndex + clicks) % this.themeOrder.length;
            
            // Create dimension break effect if multiple clicks (async, non-blocking)
            if (clicks > 1) {
                requestAnimationFrame(() => {
                    this.slashSystem.createDimensionBreak(Math.min(clicks * 2, 12));
                });
            }
            
            // Use requestAnimationFrame for smooth transition
            const transitionDelay = clicks > 1 ? 400 : 200;
            setTimeout(() => {
                requestAnimationFrame(() => {
                    this.currentIndex = nextIndex;
                    this.applyTheme(this.themeOrder[this.currentIndex], true);
                    this.clickCount = 0;
                    this.pendingTheme = null;
                });
            }, transitionDelay);
            
        }, 300); // Wait 300ms for more clicks
    }
    
    createAutoChangeToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'auto-change-toggle';
        toggle.innerHTML = `
            <label class="toggle-switch">
                <input type="checkbox" id="auto-change-checkbox" checked>
                <span class="toggle-slider"></span>
            </label>
            <span class="toggle-label">Auto Theme</span>
        `;
        toggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 25px;
            border: 1px solid var(--primary-color);
            z-index: 1000;
            font-size: 0.85rem;
            color: white;
        `;
        
        document.body.appendChild(toggle);
        
        const checkbox = toggle.querySelector('#auto-change-checkbox');
        checkbox.addEventListener('change', (e) => {
            this.autoChangeEnabled = e.target.checked;
            if (this.autoChangeEnabled) {
                this.startAutoChange();
            } else {
                this.stopAutoChange();
            }
        });
        
        // Add toggle switch styles
        const style = document.createElement('style');
        style.textContent = `
            .toggle-switch {
                position: relative;
                width: 45px;
                height: 24px;
            }
            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #333;
                border-radius: 24px;
                transition: 0.3s;
            }
            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background: white;
                border-radius: 50%;
                transition: 0.3s;
            }
            .toggle-switch input:checked + .toggle-slider {
                background: var(--primary-color);
            }
            .toggle-switch input:checked + .toggle-slider:before {
                transform: translateX(21px);
            }
            .toggle-label {
                font-weight: 500;
            }
            @keyframes hintPulse {
                0%, 100% { opacity: 0.8; transform: translateY(-50%) translateX(0); }
                50% { opacity: 1; transform: translateY(-50%) translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    animateHeroTitle() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;
        
        // Add special animation class
        heroTitle.classList.add('animated-title');
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .animated-title {
                background: linear-gradient(
                    90deg, 
                    var(--primary-color) 0%, 
                    var(--secondary-color) 25%, 
                    var(--accent-color) 50%, 
                    var(--secondary-color) 75%, 
                    var(--primary-color) 100%
                );
                background-size: 200% auto;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: titleShine 3s linear infinite, titleFloat 4s ease-in-out infinite;
            }
            @keyframes titleShine {
                0% { background-position: 0% center; }
                100% { background-position: 200% center; }
            }
            @keyframes titleFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            .hero-title.theme-change {
                animation: titleGlitch 0.5s ease-out, titleShine 3s linear infinite, titleFloat 4s ease-in-out infinite;
            }
            @keyframes titleGlitch {
                0% { 
                    transform: translate(0) scale(1);
                    filter: blur(0);
                }
                20% { 
                    transform: translate(-5px, 3px) scale(1.02);
                    filter: blur(2px);
                }
                40% { 
                    transform: translate(5px, -3px) scale(0.98);
                    filter: blur(1px);
                }
                60% { 
                    transform: translate(-3px, -2px) scale(1.01);
                    filter: blur(3px);
                }
                80% { 
                    transform: translate(3px, 2px) scale(0.99);
                    filter: blur(1px);
                }
                100% { 
                    transform: translate(0) scale(1);
                    filter: blur(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    startAutoChange() {
        if (!this.autoChangeEnabled) return;
        this.stopAutoChange();
        const interval = 20000; // Fixed 20 second interval
        this.autoChangeInterval = setTimeout(() => {
            this.nextTheme();
            this.startAutoChange();
        }, interval);
    }
    
    stopAutoChange() {
        if (this.autoChangeInterval) {
            clearTimeout(this.autoChangeInterval);
            this.autoChangeInterval = null;
        }
    }
    
    nextTheme() {
        this.currentIndex = (this.currentIndex + 1) % this.themeOrder.length;
        const newTheme = this.themeOrder[this.currentIndex];
        this.transitionToTheme(newTheme);
    }
    
    transitionToTheme(newTheme) {
        // Removed random horror mode - always smooth transition
        this.applyTheme(newTheme, true);
    }
    
    applyTheme(theme, withTransition = true) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        this.slashSystem.setTheme(theme);
        
        // Batch DOM reads first
        const navbarTitle = document.querySelector('.navbar-title');
        const heroTitle = document.querySelector('.hero-title');
        
        // Update navbar title
        if (navbarTitle) {
            navbarTitle.textContent = THEMES[theme].name;
            if (withTransition) {
                navbarTitle.style.animation = 'none';
                requestAnimationFrame(() => {
                    navbarTitle.style.animation = 'glitchText 0.3s ease-out';
                });
            }
        }
        
        // Update hero title with glitch animation
        if (heroTitle) {
            if (withTransition) {
                heroTitle.classList.add('theme-change');
                heroTitle.classList.remove('animated-title');
            }
            heroTitle.textContent = THEMES[theme].heroTitle;
            if (withTransition) {
                setTimeout(() => {
                    heroTitle.classList.remove('theme-change');
                    heroTitle.classList.add('animated-title');
                }, 500);
            }
        }
        
        // Switch 3D background
        if (typeof switchBackground === 'function') {
            switchBackground(theme);
        }
        
        // Create multiple slashes on transition
        if (withTransition) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => this.slashSystem.createSlash(), i * 80);
            }
        }
    }
    
    triggerHorrorMode(nextTheme) {
        const body = document.body;
        const overlay = document.querySelector('.horror-overlay');
        const hero = document.querySelector('.hero');
        
        body.classList.add('horror-mode');
        overlay.classList.add('active');
        
        // Apply theme-specific horror color
        const horrorColor = this.horrorColors[this.currentTheme];
        body.style.setProperty('--horror-color', horrorColor);
        overlay.style.background = `radial-gradient(circle at center, transparent, ${horrorColor})`;
        
        // Create glass breaking effect
        this.createGlassBreak();
        
        // Shake hero
        if (hero) {
            hero.style.animation = 'horrorShake 0.5s ease-in-out';
            setTimeout(() => hero.style.animation = '', 500);
        }
        
        // End horror mode
        setTimeout(() => {
            body.classList.remove('horror-mode');
            overlay.classList.remove('active');
            body.style.removeProperty('--horror-color');
            this.applyTheme(nextTheme, true);
        }, 1500);
    }
    
    createGlassBreak() {
        const container = document.querySelector('.dimensional-slashes');
        
        // Create crack lines
        for (let i = 0; i < 8; i++) {
            const crack = document.createElement('div');
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const angle = (i / 8) * 360;
            const length = 100 + Math.random() * 200;
            
            crack.className = 'glass-crack';
            crack.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: ${length}px;
                height: 2px;
                background: linear-gradient(90deg, rgba(255,255,255,0.9), transparent);
                transform: rotate(${angle}deg);
                transform-origin: left center;
                pointer-events: none;
                z-index: 1001;
                animation: crackExpand 0.3s ease-out forwards;
            `;
            
            container.appendChild(crack);
            setTimeout(() => crack.remove(), 1500);
        }
        
        // Create glass shards
        for (let i = 0; i < 15; i++) {
            const shard = document.createElement('div');
            const size = 10 + Math.random() * 30;
            
            shard.className = 'glass-shard';
            shard.style.cssText = `
                position: fixed;
                left: ${window.innerWidth / 2 + (Math.random() - 0.5) * 100}px;
                top: ${window.innerHeight / 2 + (Math.random() - 0.5) * 100}px;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
                clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
                pointer-events: none;
                z-index: 1000;
                animation: shardFall 1s ease-in forwards;
                --fall-x: ${(Math.random() - 0.5) * 300}px;
                --fall-rot: ${Math.random() * 720}deg;
            `;
            
            container.appendChild(shard);
            setTimeout(() => shard.remove(), 1500);
        }
    }
}

// ==========================================
// CONTACT FORM WITH TELEGRAM
// ==========================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        // Obfuscated credentials for basic protection
        this._k = 'portfolio2025';
        this.init();
    }

    // Deobfuscation method
    _d(e) {
        const d = atob(e);
        let r = '';
        for (let i = 0; i < d.length; i++) {
            r += String.fromCharCode(d.charCodeAt(i) ^ this._k.charCodeAt(i % this._k.length));
        }
        return r;
    }

    // Get credentials
    _c() {
        // Encrypted with XOR + Base64
        const t = 'SFxFQ1JXVVhdAgpzdDhXJBYHI1xcHFhgCkc9BTAWDQwpIR11BURnIhsQAlc4XA==';
        const c = 'Rl5ERldbWlFeBA==';
        return { t: this._d(t), c: this._d(c) };
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            project: formData.get('project'),
            message: formData.get('message')
        };

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Get decrypted credentials
        const creds = this._c();

        // Format message for Telegram
        const telegramMessage = 
            `📬 New Contact Form Submission\n\n` +
            `👤 Name: ${data.name}\n` +
            `📧 Email: ${data.email}\n` +
            `💼 Project Type: ${data.project || 'Not specified'}\n\n` +
            `💬 Message:\n${data.message}`;

        try {
            const response = await fetch(`https://api.telegram.org/bot${creds.t}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: creds.c,
                    text: telegramMessage
                })
            });

            const result = await response.json();

            if (result.ok) {
                submitBtn.textContent = '✓ Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
                this.form.reset();
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error(result.description || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending to Telegram:', error);
            submitBtn.textContent = '✗ Failed to Send';
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #f59e0b)';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    }
}

// ==========================================
// SCROLL EFFECTS
// ==========================================

function initScrollEffects() {
    // Scroll progress bar
    const scrollProgress = document.querySelector('.scroll-progress');
    
    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }
        
        if (backToTop) {
            if (scrollTop > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Intersection observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.card, .timeline-item, .skill-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ==========================================
// SWITCH BACKGROUND FUNCTION
// ==========================================

function switchBackground(theme) {
    // Clear existing background objects
    for (let i = 0; i < backgroundObjects.length; i++) {
        const obj = backgroundObjects[i];
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
        scene.remove(obj);
    }
    
    // Clear matrix chars from scene (WebDev theme elements)
    for (let i = 0; i < matrixChars.length; i++) {
        const obj = matrixChars[i];
        scene.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
            if (obj.material.map) obj.material.map.dispose();
            obj.material.dispose();
        }
    }
    
    // Also remove mobius strip and particle system if they exist
    if (mobiusStrip) {
        scene.remove(mobiusStrip);
        if (mobiusStrip.geometry) mobiusStrip.geometry.dispose();
        if (mobiusStrip.material) mobiusStrip.material.dispose();
    }
    if (particleSystem) {
        scene.remove(particleSystem);
        if (particleSystem.geometry) particleSystem.geometry.dispose();
        if (particleSystem.material) particleSystem.material.dispose();
    }
    
    backgroundObjects = [];
    dataPackets = [];
    matrixChars = [];
    circuitNodes = [];
    circuitConnections = [];
    mobiusStrip = null;
    particleSystem = null;
    
    // Create new background based on theme
    const bgType = THEMES[theme].bgType;
    
    if (bgType === 'mobius') {
        createMobiusStrip(); // This already calls createParticleSystem()
    } else if (bgType === 'shapes') {
        createFloatingShapes();
    } else if (bgType === 'circuit') {
        createCircuitBoard();
    } else if (bgType === 'matrix') {
        createCodeMatrix();
    }
}

// ==========================================
// TILT EFFECT FOR CARDS
// ==========================================

function initTiltEffect() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ==========================================
// TYPING ANIMATION
// ==========================================

function initTypingAnimation() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle) return;
    
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    heroSubtitle.style.borderRight = '2px solid var(--primary-color)';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroSubtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            setTimeout(() => {
                heroSubtitle.style.borderRight = 'none';
            }, 1000);
        }
    };
    
    setTimeout(typeWriter, 500);
}

// ==========================================
// SMOOTH SCROLL
// ==========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js background
    initThreeJS();
    
    // Initialize theme manager
    const themeManager = new ThemeManager();
    themeManager.init();
    
    // Initialize contact form
    new ContactForm();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize tilt effect
    initTiltEffect();
    
    // Initialize typing animation
    initTypingAnimation();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Start animation loop
    animate();
    
    console.log('Dimensional Portfolio System v3.1 initialized');
    console.log('Features: Mobius Strip restored, Mouse-reactive backgrounds, Horror mode');
});
