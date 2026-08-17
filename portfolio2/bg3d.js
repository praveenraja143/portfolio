import * as THREE from 'three';

class ScrollDrivenWalk3DBackground {
  constructor() {
    this.canvas = document.getElementById('webgl-bg');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 75);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scrollY = 0;
    this.targetScrollY = 0;

    this.initLighting();
    this.initParticleGalaxy();
    this.init3DGridFloor();
    this.initFloatingCubes();

    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY;
    });

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
    const count = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cyanColor = new THREE.Color(0x00f2fe);
    const violetColor = new THREE.Color(0x7928ca);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 180;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 180;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 180;

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

  init3DGridFloor() {
    const helper = new THREE.GridHelper(300, 40, 0x00f2fe, 0x7928ca);
    helper.position.y = -35;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    this.gridFloor = helper;
    this.scene.add(this.gridFloor);
  }

  initFloatingCubes() {
    this.cubes = [];
    const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);

    for (let i = 0; i < 40; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x00f2fe : 0x7928ca,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );

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

    // Smooth lerp scroll for 3D camera travel
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;

    // Camera travels in 3D space as user scrolls!
    this.camera.position.z = 75 - this.scrollY * 0.02;
    this.camera.position.y = -this.scrollY * 0.01;

    if (this.gridFloor) {
      this.gridFloor.position.z = (this.scrollY * 0.05) % 15;
    }

    if (this.particles) {
      this.particles.rotation.y += 0.0015;
      this.particles.rotation.x = this.scrollY * 0.0003;
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
  new ScrollDrivenWalk3DBackground();
});
