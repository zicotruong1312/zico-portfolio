/* ══════════════════════════════════════════════════
   three-scene.js — Three.js 3D Hero Object
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-3d');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  /* ── Scene ── */
  const scene = new THREE.Scene();

  /* ── Camera ── */
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5.5);

  /* ── Lights ── */
  const ambientLight = new THREE.AmbientLight(0x0a0a1a, 1.5);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x62A8FF, 8, 20);
  pointLight1.position.set(3, 4, 3);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x52E0E0, 6, 20);
  pointLight2.position.set(-3, -2, 2);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0x9B82FF, 4, 15);
  pointLight3.position.set(0, -4, -2);
  scene.add(pointLight3);

  const rimLight = new THREE.DirectionalLight(0x62A8FF, 2);
  rimLight.position.set(-5, 2, -3);
  scene.add(rimLight);

  /* ── Materials ── */
  const matMetal = new THREE.MeshStandardMaterial({
    color: 0x1a2240,
    metalness: 0.95,
    roughness: 0.08,
    envMapIntensity: 1.5,
  });

  const matCyan = new THREE.MeshStandardMaterial({
    color: 0x0a1a2e,
    metalness: 0.9,
    roughness: 0.1,
    emissive: new THREE.Color(0x52E0E0),
    emissiveIntensity: 0.4,
  });

  const matBlue = new THREE.MeshStandardMaterial({
    color: 0x0d1a3a,
    metalness: 0.9,
    roughness: 0.1,
    emissive: new THREE.Color(0x62A8FF),
    emissiveIntensity: 0.35,
  });

  const matPurple = new THREE.MeshStandardMaterial({
    color: 0x150d2a,
    metalness: 0.88,
    roughness: 0.12,
    emissive: new THREE.Color(0x9B82FF),
    emissiveIntensity: 0.3,
  });

  const matWire = new THREE.MeshStandardMaterial({
    color: 0x62A8FF,
    metalness: 0.6,
    roughness: 0.4,
    emissive: new THREE.Color(0x62A8FF),
    emissiveIntensity: 0.15,
    wireframe: false,
    transparent: true,
    opacity: 0.6,
  });

  /* ── Geometry group ── */
  const group = new THREE.Group();
  scene.add(group);

  /* Core — Icosahedron */
  const icosaGeo  = new THREE.IcosahedronGeometry(1.1, 0);
  const icosaMesh = new THREE.Mesh(icosaGeo, matMetal);
  group.add(icosaMesh);

  /* Inner wire frame icosahedron */
  const icoWireGeo  = new THREE.IcosahedronGeometry(1.3, 1);
  const icoWireMesh = new THREE.Mesh(icoWireGeo, new THREE.MeshStandardMaterial({
    color: 0x62A8FF,
    metalness: 0.5,
    roughness: 0.5,
    emissive: 0x62A8FF,
    emissiveIntensity: 0.08,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  }));
  group.add(icoWireMesh);

  /* Orbiting Octahedron */
  const octaGeo   = new THREE.OctahedronGeometry(0.5, 0);
  const octaMesh  = new THREE.Mesh(octaGeo, matCyan);
  octaMesh.position.set(1.9, 0.6, 0);
  group.add(octaMesh);

  /* Orbiting Torus */
  const torusGeo  = new THREE.TorusGeometry(0.42, 0.08, 16, 48);
  const torusMesh = new THREE.Mesh(torusGeo, matBlue);
  torusMesh.rotation.x = Math.PI / 3;
  group.add(torusMesh);

  /* Outer ring torus */
  const outerTorusGeo  = new THREE.TorusGeometry(1.75, 0.025, 8, 100);
  const outerTorusMesh = new THREE.Mesh(outerTorusGeo, new THREE.MeshStandardMaterial({
    color: 0x62A8FF,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x62A8FF,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.6,
  }));
  outerTorusMesh.rotation.x = 1.1;
  outerTorusMesh.rotation.y = 0.5;
  group.add(outerTorusMesh);

  /* Second ring */
  const outerTorusGeo2  = new THREE.TorusGeometry(2.1, 0.015, 8, 120);
  const outerTorusMesh2 = new THREE.Mesh(outerTorusGeo2, new THREE.MeshStandardMaterial({
    color: 0x52E0E0,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x52E0E0,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.4,
  }));
  outerTorusMesh2.rotation.x = 0.4;
  outerTorusMesh2.rotation.z = 0.7;
  group.add(outerTorusMesh2);

  /* Small floating boxes */
  const boxMat = new THREE.MeshStandardMaterial({
    color: 0x1a1030,
    metalness: 0.95,
    roughness: 0.05,
    emissive: 0x9B82FF,
    emissiveIntensity: 0.4,
  });
  const boxPositions = [
    [-1.8, 1.0,  0.3],
    [ 1.6, -1.2, 0.0],
    [-1.0, -1.6, 0.6],
    [ 0.3,  1.8, -0.5],
  ];
  const boxes = [];
  boxPositions.forEach(pos => {
    const geo  = new THREE.BoxGeometry(0.22, 0.22, 0.22);
    const mesh = new THREE.Mesh(geo, boxMat);
    mesh.position.set(...pos);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    group.add(mesh);
    boxes.push(mesh);
  });

  /* Purple octahedron orbiter */
  const oct2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), matPurple);
  oct2.position.set(-1.7, -0.8, 0.3);
  group.add(oct2);

  /* ── Mouse parallax ── */
  let targetRotX = 0, targetRotY = 0;
  let currentRotX = 0, currentRotY = 0;
  const MAX_ROT = 0.18; // ~10 degrees in radians

  function onMouseMove(e) {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotY =  nx * MAX_ROT;
    targetRotX = -ny * MAX_ROT;
  }
  window.addEventListener('mousemove', onMouseMove);

  /* ── Clock ── */
  const clock = new THREE.Clock();

  /* ── Resize ── */
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  /* ── Animation Loop ── */
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    /* Floating */
    group.position.y = Math.sin(t * 0.7) * 0.12;

    /* Base rotation */
    group.rotation.y += 0.003;
    group.rotation.x += 0.0008;

    /* Mouse parallax with lerp */
    currentRotX += (targetRotX - currentRotX) * 0.06;
    currentRotY += (targetRotY - currentRotY) * 0.06;
    group.rotation.x = currentRotX + t * 0.001;
    group.rotation.y += 0.003;
    group.rotation.y += currentRotY * 0.01;

    /* Orbiting octahedra */
    octaMesh.position.x = Math.cos(t * 0.6) * 1.9;
    octaMesh.position.z = Math.sin(t * 0.6) * 1.0;
    octaMesh.rotation.y += 0.02;
    octaMesh.rotation.x += 0.01;

    oct2.position.x = Math.cos(t * 0.5 + Math.PI) * 1.7;
    oct2.position.z = Math.sin(t * 0.5 + Math.PI) * 0.9;
    oct2.rotation.y -= 0.015;

    /* Box spins */
    boxes.forEach((box, i) => {
      box.rotation.x += 0.012 * (i % 2 === 0 ? 1 : -1);
      box.rotation.y += 0.009;
      box.position.y = boxPositions[i][1] + Math.sin(t * 0.9 + i * 1.4) * 0.1;
    });

    /* Torus rotation */
    torusMesh.rotation.z += 0.012;
    torusMesh.rotation.x += 0.004;

    /* Outer rings */
    outerTorusMesh.rotation.y  += 0.004;
    outerTorusMesh.rotation.z  += 0.002;
    outerTorusMesh2.rotation.x += 0.003;
    outerTorusMesh2.rotation.z -= 0.005;

    /* Icosa wire */
    icoWireMesh.rotation.y -= 0.004;
    icoWireMesh.rotation.x += 0.002;

    /* Pulsing emissive */
    matCyan.emissiveIntensity   = 0.35 + Math.sin(t * 1.5) * 0.15;
    matBlue.emissiveIntensity   = 0.3  + Math.sin(t * 1.2 + 1) * 0.1;
    matPurple.emissiveIntensity = 0.25 + Math.sin(t * 0.9 + 2) * 0.12;
    boxMat.emissiveIntensity    = 0.3  + Math.sin(t * 2.0) * 0.15;

    /* Light orbits */
    pointLight1.position.x = Math.cos(t * 0.4) * 4;
    pointLight1.position.z = Math.sin(t * 0.4) * 3;
    pointLight2.position.x = Math.cos(t * 0.3 + Math.PI) * 3;
    pointLight2.position.z = Math.sin(t * 0.3 + Math.PI) * 3;

    renderer.render(scene, camera);
  }

  animate();

})();
