(function () {
  const canvasContainer = document.getElementById('bg-canvas');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 60;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const point = new THREE.PointLight(0xffb3c6, 1.2);
  point.position.set(20, 20, 40);
  scene.add(point);

  function heartShape() {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 5, y + 5);
    shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    shape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    shape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    shape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    shape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    shape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
    return shape;
  }

  function makeHeartGeometry(size) {
    const geometry = new THREE.ExtrudeGeometry(heartShape(), {
      depth: 4,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.8,
      bevelThickness: 0.8,
      curveSegments: 12,
    });
    geometry.scale(size, -size, size);
    geometry.center();
    return geometry;
  }

  const heartColors = [0xff4d79, 0xff8fa3, 0xffc2d1, 0xff2e63, 0xffe0eb];
  const floatingHearts = [];
  const HEART_COUNT = 18;

  for (let i = 0; i < HEART_COUNT; i++) {
    const size = 0.5 + Math.random() * 0.9;
    const geometry = makeHeartGeometry(size);
    const material = new THREE.MeshStandardMaterial({
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 90,
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 60 - 20
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
      floatSpeed: 0.3 + Math.random() * 0.6,
      floatOffset: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.01,
      baseY: mesh.position.y,
    };
    scene.add(mesh);
    floatingHearts.push(mesh);
  }

  const PARTICLE_COUNT = 400;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 140;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 30;
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffe6ee,
    size: 0.6,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const burstHearts = [];

  function triggerHeartBurst() {
    const count = 45;
    for (let i = 0; i < count; i++) {
      const size = 0.3 + Math.random() * 0.5;
      const geometry = makeHeartGeometry(size);
      const material = new THREE.MeshStandardMaterial({
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        roughness: 0.4,
        transparent: true,
        opacity: 1,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, -5, 10);

      const angle = Math.random() * Math.PI * 2;
      const upward = 0.6 + Math.random() * 1.2;
      const speed = 0.4 + Math.random() * 0.6;

      mesh.userData = {
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          upward,
          Math.sin(angle) * speed
        ),
        rotSpeed: (Math.random() - 0.5) * 0.15,
        life: 0,
      };
      scene.add(mesh);
      burstHearts.push(mesh);
    }
  }
  window.triggerHeartBurst = triggerHeartBurst;

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    floatingHearts.forEach((mesh) => {
      const d = mesh.userData;
      mesh.position.y = d.baseY + Math.sin(t * d.floatSpeed + d.floatOffset) * 3;
      mesh.rotation.y += d.rotSpeed;
      mesh.rotation.x += d.rotSpeed * 0.5;
    });

    particles.rotation.y = t * 0.02;

    for (let i = burstHearts.length - 1; i >= 0; i--) {
      const mesh = burstHearts[i];
      const d = mesh.userData;
      d.velocity.y -= 0.025;
      mesh.position.add(d.velocity);
      mesh.rotation.x += d.rotSpeed;
      mesh.rotation.y += d.rotSpeed;
      d.life += 1;
      if (d.life > 90) {
        mesh.material.opacity = Math.max(0, mesh.material.opacity - 0.04);
      }
      if (d.life > 150) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
        burstHearts.splice(i, 1);
      }
    }

    camera.position.x = Math.sin(t * 0.05) * 4;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
