import * as THREE from 'three';

class Motion3DBackground {
  constructor() {
    this.canvas = document.getElementById('webgl-bg');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 75);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.initLighting();
    this.initParticleGalaxy();
    this.initFloatingCubes();

    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  initLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambient);

    this.cyanLight = new THREE.PointLight(0x00f2fe, 4.0, 120);
    this.cyanLight.position.set(30, 20, 30);
    this.scene.add(this.cyanLight);

    this.violetLight = new THREE.PointLight(0x7928ca, 4.0, 120);
    this.violetLight.position.set(-30, -20, 30);
    this.scene.add(this.violetLight);
  }

  initParticleGalaxy() {
    const count = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cyanColor = new THREE.Color(0x00f2fe);
    const violetColor = new THREE.Color(0x7928ca);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;

      const mixColor = Math.random() > 0.5 ? cyanColor : violetColor;
      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  initFloatingCubes() {
    this.cubes = [];
    const geometry = new THREE.BoxGeometry(2, 2, 2);

    for (let i = 0; i < 35; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x00f2fe : 0x7928ca,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60);

      this.scene.add(mesh);
      this.cubes.push(mesh);
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.particles) {
      this.particles.rotation.y += 0.0015;
    }

    if (this.cubes) {
      for (let c of this.cubes) {
        c.rotation.x += 0.01;
        c.rotation.y += 0.01;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Motion3DBackground();
});
