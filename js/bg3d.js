import * as THREE from 'three';

class Layered3DArtworkScene {
  constructor() {
    this.canvas = document.getElementById('webgl-bg');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 75);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.mouseVelX = 0;
    this.mouseVelY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.initLighting();
    this.initArtworkPlane();
    this.initFloating3DCubes();
    this.initParticleGalaxy();
    this.initLightningSparks();

    this.addEventListeners();
    this.animate();
  }

  initLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambient);

    // Cyan & Violet Ambient Glow Lights
    this.cyanLight = new THREE.PointLight(0x00f2fe, 4.0, 120);
    this.cyanLight.position.set(30, 20, 30);
    this.scene.add(this.cyanLight);

    this.violetLight = new THREE.PointLight(0x7928ca, 4.0, 120);
    this.violetLight.position.set(-30, -20, 30);
    this.scene.add(this.violetLight);
  }

  initArtworkPlane() {
    // Load the user's AI Developer Artwork onto a 3D Mesh Plane
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('./ai_dev_artwork.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      
      const aspect = texture.image.width / texture.image.height;
      const planeHeight = 42;
      const planeWidth = planeHeight * aspect;

      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);
      
      // Cyberpunk glowing material with slight translucency
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 0.85
      });

      this.artworkMesh = new THREE.Mesh(geometry, material);
      this.artworkMesh.position.set(0, 0, -10);
      this.scene.add(this.artworkMesh);

      // Glowing 3D Neon Edge Border around the Artwork Plane
      const edgeGeo = new THREE.BoxGeometry(planeWidth + 0.6, planeHeight + 0.6, 0.4);
      const edgeMat = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      this.artworkBorder = new THREE.Mesh(edgeGeo, edgeMat);
      this.artworkBorder.position.set(0, 0, -10.2);
      this.scene.add(this.artworkBorder);
    });
  }

  initFloating3DCubes() {
    // 3D Floating Code Cubes in FRONT of the artwork for depth!
    this.floatingCubes = [];
    const cubeCount = 45;
    const colors = [0x00f2fe, 0x7928ca, 0x4facfe, 0xff0080];

    for (let i = 0; i < cubeCount; i++) {
      const size = 1.2 + Math.random() * 3.2;
      const geo = Math.random() > 0.4 
        ? new THREE.BoxGeometry(size, size, size * 0.3) 
        : new THREE.OctahedronGeometry(size * 0.7);

      const color = colors[Math.floor(Math.random() * colors.length)];
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: Math.random() > 0.2,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.4,
        blending: THREE.AdditiveBlending
      });

      const mesh = new THREE.Mesh(geo, mat);

      // Positioned in FRONT of and around artwork plane
      const x = (Math.random() - 0.5) * 140;
      const y = (Math.random() - 0.5) * 240;
      const z = -5 + (Math.random() - 0.5) * 60;

      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      this.scene.add(mesh);

      this.floatingCubes.push({
        mesh: mesh,
        rotX: (Math.random() - 0.5) * 0.02,
        rotY: (Math.random() - 0.5) * 0.02,
        speedY: 0.01 + Math.random() * 0.02,
        baseY: y,
        parallaxFactor: 0.5 + Math.random() * 1.2
      });
    }
  }

  initLightningSparks() {
    // Glowing electric lightning lines behind/around artwork
    const lineCount = 10;
    this.lightningLines = [];

    for (let l = 0; l < lineCount; l++) {
      const points = [];
      let currentPoint = new THREE.Vector3(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 220,
        -20
      );

      points.push(currentPoint.clone());

      for (let p = 0; p < 5; p++) {
        currentPoint.x += (Math.random() - 0.5) * 12;
        currentPoint.y += (Math.random() - 0.5) * 16;
        currentPoint.z += (Math.random() - 0.5) * 8;
        points.push(currentPoint.clone());
      }

      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });

      const line = new THREE.Line(geo, mat);
      this.scene.add(line);
      this.lightningLines.push(line);
    }
  }

  initParticleGalaxy() {
    // Ambient 3D Glowing AI Data Particles
    const particleCount = 240;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cCyan = new THREE.Color(0x00f2fe);
    const cPurple = new THREE.Color(0x7928ca);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 180;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 320;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const mix = cCyan.clone().lerp(cPurple, Math.random());
      colors[i * 3] = mix.r;
      colors[i * 3 + 1] = mix.g;
      colors[i * 3 + 2] = mix.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, particleMat);
    this.scene.add(this.particles);
  }

  addEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(e) {
    const normX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const normY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    this.targetX = normX * 22;
    this.targetY = -normY * 22;

    this.mouseVelX = (e.clientX - this.lastMouseX) * 0.08;
    this.mouseVelY = (e.clientY - this.lastMouseY) * 0.08;

    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  }

  onScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = window.scrollY / Math.max(docHeight, 1);

    // Pan camera down vertically through 3D scene on scroll
    this.targetCamY = -scrollFraction * 200;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Fast Responsive Mouse Interpolation (0.15 lerp)
    this.mouseX += (this.targetX - this.mouseX) * 0.15;
    this.mouseY += (this.targetY - this.mouseY) * 0.15;

    const currentCamY = this.camera.position.y;
    const targetYPos = this.targetCamY !== undefined ? this.targetCamY : 0;
    
    this.camera.position.y += (targetYPos - currentCamY) * 0.1;
    this.camera.position.x = this.mouseX;
    this.camera.position.z = 75 + Math.abs(this.mouseX) * 0.35;

    this.camera.lookAt(0, this.camera.position.y, 0);

    // Tilt the 3D Developer Artwork Plane in 3D Perspective matching mouse position!
    if (this.artworkMesh) {
      this.artworkMesh.rotation.y = this.mouseX * 0.012;
      this.artworkMesh.rotation.x = -this.mouseY * 0.012;
      this.artworkMesh.position.y = this.camera.position.y;

      if (this.artworkBorder) {
        this.artworkBorder.rotation.y = this.artworkMesh.rotation.y;
        this.artworkBorder.rotation.x = this.artworkMesh.rotation.x;
        this.artworkBorder.position.y = this.camera.position.y;
      }
    }

    // Animate Floating 3D Cubes with multi-layered Parallax depth
    for (let c of this.floatingCubes) {
      c.mesh.rotation.x += c.rotX + Math.abs(this.mouseVelY) * 0.01;
      c.mesh.rotation.y += c.rotY + Math.abs(this.mouseVelX) * 0.01;
      c.mesh.position.x += this.mouseX * 0.005 * c.parallaxFactor;
      c.mesh.position.y += Math.sin(Date.now() * 0.002 + c.baseY) * 0.06;
    }

    // Flicker Lightning Lines
    for (let line of this.lightningLines) {
      line.material.opacity = 0.25 + Math.random() * 0.35;
    }

    // Rotate Particles
    if (this.particles) {
      this.particles.rotation.y += 0.002;
    }

    // Decay mouse speed
    this.mouseVelX *= 0.9;
    this.mouseVelY *= 0.9;

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Layered3DArtworkScene();
});
