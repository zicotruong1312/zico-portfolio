/* ══════════════════════════════════════════════════════════════
   cosmic-space.js — Full-Site 3D Cosmic Space Engine
   Features:
   - Deep Space Cosmos with 260 Multi-layered Twinkling Stars
   - Multi-colored Cosmic Nebulae (Deep Violet, Lagoon Cyan, Amber Forge)
   - Streaking Meteors / Shooting Stars (Sao Băng) with Plasma Tails & Sparks
   - 3D Tumbling Rocky Asteroids / Meteorites (Thiên Thạch) with Faceted Lighting
   - 5 Photorealistic Animated Celestial Planets distributed throughout the entire site:
       * Sao Thổ (Saturn) — 3D Rings, Cassini Division, Spherical Bands & Shadows
       * Sao Kim (Venus) — Golden Luminous Corona & Swirling Sulfuric Atmosphere
       * Sao Hỏa (Mars) — Crimson Iron-Oxide Terrain & White Polar Ice Cap
       * Sao Hải Vương (Neptune) — Azure-Cyan Methane Bands & Delicate Ice Ring
       * Sao Mộc (Jupiter) — Dramatic Multi-striped Belts & The Great Red Spot
   - Seamless Full-Site Scroll Parallax & Interactive Mouse Tilting
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('cosmic-stream-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let scrollY = window.scrollY || 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / width - 0.5) * 2;
    targetMouseY = (e.clientY / height - 0.5) * 2;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY || 0;
  }, { passive: true });

  /* ══════════════════════════════════════════════════
     1. STARFIELD (260 Multi-layered Twinkling Stars)
     ══════════════════════════════════════════════════ */
  const STAR_COUNT = window.innerWidth > 1024 ? 260 : 130;
  const stars = [];
  const starColors = [
    '255, 255, 255', // Pure white
    '82, 224, 224',  // Cyan
    '98, 168, 255',  // Ice Blue
    '255, 215, 120', // Warm Gold
    '195, 160, 255', // Soft Purple
  ];

  for (let i = 0; i < STAR_COUNT; i++) {
    const depth = Math.random() * 0.9 + 0.1;
    stars.push({
      x: Math.random() * 2000,
      y: Math.random() * 3000,
      size: (Math.random() * 1.6 + 0.5) * depth,
      baseAlpha: Math.random() * 0.45 + 0.25,
      pulseSpeed: Math.random() * 0.03 + 0.008,
      pulsePhase: Math.random() * Math.PI * 2,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      depth: depth,
      parallax: depth * 0.25,
    });
  }

  /* ══════════════════════════════════════════════════
     2. NEBULA CLOUDS (Ethereal Cosmic Dust)
     ══════════════════════════════════════════════════ */
  const nebulae = [
    {
      baseX: 0.8,
      baseY: 0.28,
      r: 450,
      color: '138, 43, 226', // Violet
      maxAlpha: 0.055,
      phase: 0,
    },
    {
      baseX: 0.18,
      baseY: 0.65,
      r: 400,
      color: '0, 206, 209',  // Cyan Lagoon
      maxAlpha: 0.045,
      phase: 1.8,
    },
    {
      baseX: 0.72,
      baseY: 1.25,
      r: 520,
      color: '255, 140, 40', // Amber Starforge
      maxAlpha: 0.038,
      phase: 3.5,
    },
  ];

  /* ══════════════════════════════════════════════════
     3. SHOOTING STARS / COMETS (Sao Băng)
     ══════════════════════════════════════════════════ */
  const shootingStars = [];
  const MAX_SHOOTING_STARS = 3;
  let nextShootingStarTime = performance.now() + 1000;

  function spawnShootingStar() {
    const startX = Math.random() * (width + 300);
    const startY = Math.random() * (height * 0.6) - 100;
    const length = Math.random() * 160 + 100;
    const speed = Math.random() * 14 + 16;
    const angle = (Math.random() * 15 + 25) * (Math.PI / 180); // ~30 deg downward
    const sparks = [];

    shootingStars.push({
      x: startX,
      y: startY,
      vx: -Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: length,
      width: Math.random() * 1.8 + 1.2,
      alpha: 1.0,
      decay: Math.random() * 0.012 + 0.016,
      color: Math.random() > 0.4 ? '82, 224, 224' : '255, 230, 160',
      sparks: sparks,
    });
  }

  /* ══════════════════════════════════════════════════
     4. 3D FACETED ASTEROIDS (Thiên Thạch Đá 3D)
     ══════════════════════════════════════════════════ */
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawIcosaVerts = [
    [-1,  phi,  0], [ 1,  phi,  0], [-1, -phi,  0], [ 1, -phi,  0],
    [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
    [ phi,  0, -1], [ phi,  0,  1], [-phi,  0, -1], [-phi,  0,  1]
  ];
  const icosaVerts = rawIcosaVerts.map(v => {
    const len = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / len, v[1] / len, v[2] / len];
  });

  const icosaFaces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
  ];

  function pseudoRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function createAsteroidMesh(seed) {
    const s = seed * 19.31;
    const deformedVerts = icosaVerts.map((v, i) => {
      const rJitter = 0.65 + pseudoRandom(s + i * 3.7) * 0.65;
      return [v[0] * rJitter, v[1] * rJitter, v[2] * rJitter];
    });
    return {
      verts: deformedVerts,
      faces: icosaFaces,
    };
  }

  const ASTEROID_COUNT = window.innerWidth > 1024 ? 18 : 10;
  const asteroids = [];
  const asteroidPalettes = [
    { r: 70,  g: 78,  b: 92  }, // Slate Gray Rock
    { r: 92,  g: 84,  b: 74  }, // Basalt / Silicate Ochre
    { r: 52,  g: 62,  b: 80  }, // Deep Cosmic Iron
    { r: 85,  g: 95,  b: 110 }, // Blue Mineral Specular
  ];

  for (let i = 0; i < ASTEROID_COUNT; i++) {
    const depth = Math.random() * 0.8 + 0.2;
    const isHero = i < 3;
    const size = isHero
      ? Math.random() * 12 + 28
      : (Math.random() * 14 + 10) * depth;

    asteroids.push({
      mesh: createAsteroidMesh(i * 17.5 + 4.2),
      x: Math.random() * (width + 600) - 300,
      y: Math.random() * height,
      z: depth,
      size: size,
      vx: (Math.random() * 0.6 + 0.35) * (depth + 0.4),
      vy: (Math.random() - 0.5) * 0.12,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      dRotX: (Math.random() - 0.5) * 0.018,
      dRotY: (Math.random() - 0.5) * 0.024,
      dRotZ: (Math.random() - 0.5) * 0.015,
      palette: asteroidPalettes[i % asteroidPalettes.length],
      alpha: Math.min(1, depth * 0.9 + 0.1),
      dustParticles: [],
    });
  }

  const lightVec = [-0.55, -0.65, 0.52];
  const lLen = Math.hypot(lightVec[0], lightVec[1], lightVec[2]);
  const lightDir = [lightVec[0] / lLen, lightVec[1] / lLen, lightVec[2] / lLen];

  function rotate3D(v, rx, ry, rz) {
    let [x, y, z] = v;
    const y1 = y * Math.cos(rx) - z * Math.sin(rx);
    const z1 = y * Math.sin(rx) + z * Math.cos(rx);
    const x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
    const z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
    const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
    const y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
    return [x3, y3, z2];
  }

  /* ══════════════════════════════════════════════════
     5. PLANET ENGINES (Saturn, Venus, Mars, Neptune, Jupiter)
     ══════════════════════════════════════════════════ */

  /**
   * SAO THỔ (Saturn) — 3D Rings, Cassini Division & Shadows
   */
  function drawSaturn(cx, cy, R, time) {
    const ringTilt = -0.42;
    const rOuter = R * 2.32;
    const rCassiniOuter = R * 2.02;
    const rCassiniInner = R * 1.88;
    const rInnerB = R * 1.42;
    const rCrepe = R * 1.20;
    const ringAspect = 0.30;

    ctx.save();
    ctx.translate(cx, cy);

    const hoverY = Math.sin(time * 0.001) * 7;
    ctx.translate(0, hoverY);
    ctx.rotate(ringTilt);

    /* Back Half of Rings */
    ctx.beginPath();
    ctx.ellipse(0, 0, rOuter, rOuter * ringAspect, 0, Math.PI, 2 * Math.PI);
    ctx.ellipse(0, 0, rCassiniOuter, rCassiniOuter * ringAspect, 0, 2 * Math.PI, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(215, 195, 155, 0.42)';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 0, rCassiniInner, rCassiniInner * ringAspect, 0, Math.PI, 2 * Math.PI);
    ctx.ellipse(0, 0, rInnerB, rInnerB * ringAspect, 0, 2 * Math.PI, Math.PI, true);
    ctx.closePath();
    const gradB = ctx.createLinearGradient(-rCassiniInner, 0, rCassiniInner, 0);
    gradB.addColorStop(0, 'rgba(235, 210, 150, 0.6)');
    gradB.addColorStop(0.5, 'rgba(250, 225, 170, 0.72)');
    gradB.addColorStop(1, 'rgba(235, 210, 150, 0.6)');
    ctx.fillStyle = gradB;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 0, rInnerB, rInnerB * ringAspect, 0, Math.PI, 2 * Math.PI);
    ctx.ellipse(0, 0, rCrepe, rCrepe * ringAspect, 0, 2 * Math.PI, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(160, 140, 110, 0.22)';
    ctx.fill();

    // Planet Shadow on Back Rings
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 0, rOuter, rOuter * ringAspect, 0, Math.PI * 1.15, Math.PI * 1.85);
    ctx.lineTo(0, 0);
    ctx.closePath();
    const shadowGrad = ctx.createRadialGradient(0, 0, R * 0.9, 0, 0, rOuter);
    shadowGrad.addColorStop(0, 'rgba(6, 8, 14, 0.95)');
    shadowGrad.addColorStop(0.7, 'rgba(6, 8, 14, 0.85)');
    shadowGrad.addColorStop(1, 'rgba(6, 8, 14, 0.0)');
    ctx.fillStyle = shadowGrad;
    ctx.fill();
    ctx.restore();

    /* Planet Sphere */
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.clip();

    const bandGrad = ctx.createLinearGradient(0, -R, 0, R);
    bandGrad.addColorStop(0.0, '#5a5448');
    bandGrad.addColorStop(0.18, '#8b7d60');
    bandGrad.addColorStop(0.32, '#d4af37');
    bandGrad.addColorStop(0.46, '#f3e5ab');
    bandGrad.addColorStop(0.54, '#c89d42');
    bandGrad.addColorStop(0.68, '#e2cb92');
    bandGrad.addColorStop(0.85, '#99845d');
    bandGrad.addColorStop(1.0, '#4e483e');
    ctx.fillStyle = bandGrad;
    ctx.fillRect(-R, -R, R * 2, R * 2);

    ctx.fillStyle = 'rgba(255, 240, 200, 0.12)';
    ctx.fillRect(-R, -R * 0.1, R * 2, R * 0.25);
    ctx.fillStyle = 'rgba(160, 110, 50, 0.15)';
    ctx.fillRect(-R, R * 0.15, R * 2, R * 0.18);

    const sphereGrad = ctx.createRadialGradient(-R * 0.35, -R * 0.4, 0, 0, 0, R * 1.05);
    sphereGrad.addColorStop(0.0, 'rgba(255, 255, 240, 0.45)');
    sphereGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.0)');
    sphereGrad.addColorStop(0.75, 'rgba(10, 12, 18, 0.65)');
    sphereGrad.addColorStop(1.0, 'rgba(4, 5, 8, 0.95)');
    ctx.fillStyle = sphereGrad;
    ctx.fillRect(-R, -R, R * 2, R * 2);

    // Front Ring Shadow on Planet
    ctx.beginPath();
    ctx.ellipse(0, R * 0.12, R * 0.95, R * 0.18, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(5, 6, 10, 0.75)';
    ctx.fill();

    // Limb Glow
    const rimGrad = ctx.createRadialGradient(0, 0, R * 0.88, 0, 0, R);
    rimGrad.addColorStop(0, 'rgba(98, 168, 255, 0)');
    rimGrad.addColorStop(1, 'rgba(98, 168, 255, 0.35)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(-R, -R, R * 2, R * 2);

    ctx.restore(); // Exit sphere clip

    /* Front Half of Rings */
    ctx.beginPath();
    ctx.ellipse(0, 0, rInnerB, rInnerB * ringAspect, 0, 0, Math.PI);
    ctx.ellipse(0, 0, rCrepe, rCrepe * ringAspect, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(160, 140, 110, 0.28)';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 0, rCassiniInner, rCassiniInner * ringAspect, 0, 0, Math.PI);
    ctx.ellipse(0, 0, rInnerB, rInnerB * ringAspect, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fillStyle = gradB;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 0, rOuter, rOuter * ringAspect, 0, 0, Math.PI);
    ctx.ellipse(0, 0, rCassiniOuter, rCassiniOuter * ringAspect, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(215, 195, 155, 0.48)';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 0, rOuter, rOuter * ringAspect, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 235, 185, 0.3)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, rCassiniInner, rCassiniInner * ringAspect, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 245, 210, 0.4)';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    ctx.restore();
  }

  /**
   * SAO KIM (Venus) — Golden Luminous Corona & Swirling Clouds
   */
  function drawVenus(cx, cy, R, time) {
    ctx.save();
    ctx.translate(cx, cy);

    const wobbleY = Math.sin(time * 0.0012 + 1.5) * 6;
    ctx.translate(0, wobbleY);

    // Radiant Corona
    const coronaGrad = ctx.createRadialGradient(0, 0, R * 0.7, 0, 0, R * 1.85);
    coronaGrad.addColorStop(0.0, 'rgba(255, 215, 120, 0.35)');
    coronaGrad.addColorStop(0.4, 'rgba(255, 180, 70, 0.15)');
    coronaGrad.addColorStop(0.8, 'rgba(255, 150, 40, 0.04)');
    coronaGrad.addColorStop(1.0, 'rgba(255, 150, 40, 0.0)');
    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.85, 0, Math.PI * 2);
    ctx.fill();

    // Planet Body
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.clip();

    const baseGrad = ctx.createRadialGradient(-R * 0.35, -R * 0.35, 0, 0, 0, R * 1.05);
    baseGrad.addColorStop(0.0, '#fffbf0');
    baseGrad.addColorStop(0.25, '#ffe599');
    baseGrad.addColorStop(0.55, '#f4b400');
    baseGrad.addColorStop(0.82, '#c47800');
    baseGrad.addColorStop(1.0, '#381c00');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(-R, -R, R * 2, R * 2);

    ctx.save();
    ctx.rotate(0.25);
    ctx.fillStyle = 'rgba(255, 250, 220, 0.22)';
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.ellipse(0, i * (R * 0.28), R * 1.2, R * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    const shadowGrad = ctx.createRadialGradient(-R * 0.35, -R * 0.35, R * 0.4, R * 0.2, R * 0.2, R * 0.95);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shadowGrad.addColorStop(0.7, 'rgba(15, 8, 3, 0.65)');
    shadowGrad.addColorStop(1, 'rgba(5, 3, 2, 0.96)');
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(-R, -R, R * 2, R * 2);

    const limbGrad = ctx.createRadialGradient(0, 0, R * 0.85, 0, 0, R);
    limbGrad.addColorStop(0, 'rgba(255, 240, 180, 0)');
    limbGrad.addColorStop(1, 'rgba(255, 245, 200, 0.45)');
    ctx.fillStyle = limbGrad;
    ctx.fillRect(-R, -R, R * 2, R * 2);

    ctx.restore();
    ctx.restore();
  }

  /**
   * SAO HẢI VƯƠNG (Neptune) — Azure-Cyan Methane Giant with Ring
   */
  function drawNeptune(cx, cy, R, time) {
    ctx.save();
    ctx.translate(cx, cy);

    const hoverY = Math.sin(time * 0.0009 + 2.8) * 5;
    ctx.translate(0, hoverY);

    const glowGrad = ctx.createRadialGradient(0, 0, R * 0.8, 0, 0, R * 1.5);
    glowGrad.addColorStop(0, 'rgba(82, 224, 224, 0.25)');
    glowGrad.addColorStop(1, 'rgba(82, 224, 224, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Back Half of Ring
    ctx.save();
    ctx.rotate(0.55);
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.75, R * 0.22, 0, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(82, 224, 224, 0.22)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.clip();

    const nepGrad = ctx.createRadialGradient(-R * 0.35, -R * 0.35, 0, 0, 0, R * 1.05);
    nepGrad.addColorStop(0.0, '#b8f2f2');
    nepGrad.addColorStop(0.3, '#00b4d8');
    nepGrad.addColorStop(0.65, '#0077b6');
    nepGrad.addColorStop(0.88, '#023e8a');
    nepGrad.addColorStop(1.0, '#011627');
    ctx.fillStyle = nepGrad;
    ctx.fillRect(-R, -R, R * 2, R * 2);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.ellipse(R * 0.1, -R * 0.25, R * 0.6, R * 0.04, 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-R * 0.15, R * 0.32, R * 0.5, R * 0.035, -0.05, 0, Math.PI * 2);
    ctx.fill();

    const rimGrad = ctx.createRadialGradient(0, 0, R * 0.85, 0, 0, R);
    rimGrad.addColorStop(0, 'rgba(82, 224, 224, 0)');
    rimGrad.addColorStop(1, 'rgba(82, 224, 224, 0.45)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(-R, -R, R * 2, R * 2);

    ctx.restore();

    // Front Half of Ring
    ctx.save();
    ctx.rotate(0.55);
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.75, R * 0.22, 0, 0, Math.PI);
    ctx.strokeStyle = 'rgba(82, 224, 224, 0.35)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /**
   * SAO HỎA (Mars) — Crimson Red Planet with Polar Ice Cap
   */
  function drawMars(cx, cy, R, time) {
    ctx.save();
    ctx.translate(cx, cy);

    const hoverY = Math.sin(time * 0.0015 + 4.1) * 4;
    ctx.translate(0, hoverY);

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.clip();

    const marsGrad = ctx.createRadialGradient(-R * 0.35, -R * 0.35, 0, 0, 0, R * 1.05);
    marsGrad.addColorStop(0.0, '#ff9070');
    marsGrad.addColorStop(0.35, '#c85028');
    marsGrad.addColorStop(0.75, '#8c2810');
    marsGrad.addColorStop(1.0, '#220804');
    ctx.fillStyle = marsGrad;
    ctx.fillRect(-R, -R, R * 2, R * 2);

    ctx.fillStyle = 'rgba(50, 20, 15, 0.35)';
    ctx.beginPath();
    ctx.ellipse(-R * 0.1, R * 0.1, R * 0.45, R * 0.25, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Polar ice cap
    ctx.beginPath();
    ctx.ellipse(0, -R * 0.82, R * 0.38, R * 0.14, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  /**
   * SAO MỘC (Jupiter) — Majestic Gas Giant with Great Red Spot & Stripes
   */
  function drawJupiter(cx, cy, R, time) {
    ctx.save();
    ctx.translate(cx, cy);

    const hoverY = Math.sin(time * 0.0008 + 5.2) * 6;
    ctx.translate(0, hoverY);

    // Warm Jovian Corona
    const jupGlow = ctx.createRadialGradient(0, 0, R * 0.75, 0, 0, R * 1.4);
    jupGlow.addColorStop(0, 'rgba(255, 180, 110, 0.2)');
    jupGlow.addColorStop(1, 'rgba(255, 180, 110, 0)');
    ctx.fillStyle = jupGlow;
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.clip();

    // Jovian atmospheric stripes
    const jupBands = ctx.createLinearGradient(0, -R, 0, R);
    jupBands.addColorStop(0.0,  '#4a5460'); // North Polar Region
    jupBands.addColorStop(0.12, '#82654f'); // North Temperate Zone
    jupBands.addColorStop(0.24, '#ba6e38'); // North Temperate Belt
    jupBands.addColorStop(0.38, '#f5e4cb'); // North Tropical Zone
    jupBands.addColorStop(0.48, '#8c351a'); // North Equatorial Belt
    jupBands.addColorStop(0.56, '#fbf0de'); // Equatorial Zone
    jupBands.addColorStop(0.66, '#752512'); // South Equatorial Belt
    jupBands.addColorStop(0.78, '#b87c48'); // South Temperate Belt
    jupBands.addColorStop(0.90, '#695a48'); // South Polar Belt
    jupBands.addColorStop(1.0,  '#3a424e'); // South Polar Region
    ctx.fillStyle = jupBands;
    ctx.fillRect(-R, -R, R * 2, R * 2);

    // Turbulent cloud swirls
    ctx.fillStyle = 'rgba(255, 255, 240, 0.18)';
    ctx.beginPath();
    ctx.ellipse(R * 0.1, -R * 0.15, R * 0.7, R * 0.06, 0.03, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(80, 30, 10, 0.22)';
    ctx.beginPath();
    ctx.ellipse(-R * 0.2, R * 0.2, R * 0.65, R * 0.08, -0.04, 0, Math.PI * 2);
    ctx.fill();

    // THE GREAT RED SPOT (Vết Đỏ Lớn)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(R * 0.28, R * 0.32, R * 0.28, R * 0.16, 0.08, 0, Math.PI * 2);
    const grsGrad = ctx.createRadialGradient(R * 0.28, R * 0.32, 0, R * 0.28, R * 0.32, R * 0.28);
    grsGrad.addColorStop(0, '#e64a19'); // Fiery orange-red center
    grsGrad.addColorStop(0.7, '#b71c1c'); // Deep crimson vortex rim
    grsGrad.addColorStop(1, '#6b1408');
    ctx.fillStyle = grsGrad;
    ctx.fill();

    // GRS Inner White Eyelet
    ctx.beginPath();
    ctx.ellipse(R * 0.30, R * 0.31, R * 0.09, R * 0.05, 0.05, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 235, 215, 0.65)';
    ctx.fill();
    ctx.restore();

    // Spherical Light & Nightside Terminator
    const jupSphere = ctx.createRadialGradient(-R * 0.35, -R * 0.35, 0, 0, 0, R * 1.05);
    jupSphere.addColorStop(0.0, 'rgba(255, 255, 240, 0.4)');
    jupSphere.addColorStop(0.5, 'rgba(0, 0, 0, 0.0)');
    jupSphere.addColorStop(0.8, 'rgba(8, 10, 15, 0.65)');
    jupSphere.addColorStop(1.0, 'rgba(3, 4, 6, 0.95)');
    ctx.fillStyle = jupSphere;
    ctx.fillRect(-R, -R, R * 2, R * 2);

    // Warm Limb Rim
    const jupRim = ctx.createRadialGradient(0, 0, R * 0.88, 0, 0, R);
    jupRim.addColorStop(0, 'rgba(255, 220, 160, 0)');
    jupRim.addColorStop(1, 'rgba(255, 225, 175, 0.35)');
    ctx.fillStyle = jupRim;
    ctx.fillRect(-R, -R, R * 2, R * 2);

    ctx.restore();
    ctx.restore();
  }

  /* ══════════════════════════════════════════════════
     6. CELESTIAL JOURNEY REGISTRY (Across Entire Page Scroll)
     ══════════════════════════════════════════════════ */
  // Anchor points spread throughout the full page lifecycle
  const celestialBodies = [
    {
      name: 'Saturn',
      draw: drawSaturn,
      anchorY: 220,       // Top Header & About Section
      baseXRatio: 0.82,
      radiusDesktop: 64,
      radiusMobile: 42,
      depth: 0.8,
      parallax: 0.22,
    },
    {
      name: 'Venus',
      draw: drawVenus,
      anchorY: 1550,      // Expertise & Technical Skills
      baseXRatio: 0.12,
      radiusDesktop: 48,
      radiusMobile: 34,
      depth: 0.9,
      parallax: 0.26,
    },
    {
      name: 'Mars',
      draw: drawMars,
      anchorY: 2900,      // Gaming Experience & Setup
      baseXRatio: 0.86,
      radiusDesktop: 26,
      radiusMobile: 18,
      depth: 0.5,
      parallax: 0.16,
    },
    {
      name: 'Saturn-Transit',
      draw: drawSaturn,
      anchorY: 4250,      // Featured Projects Showcase
      baseXRatio: 0.14,
      radiusDesktop: 52,
      radiusMobile: 36,
      depth: 0.7,
      parallax: 0.24,
    },
    {
      name: 'Neptune',
      draw: drawNeptune,
      anchorY: 5700,      // Experience & Mindset Architecture
      baseXRatio: 0.85,
      radiusDesktop: 42,
      radiusMobile: 28,
      depth: 0.75,
      parallax: 0.22,
    },
    {
      name: 'Venus-Evening',
      draw: drawVenus,
      anchorY: 7100,      // Education & Philosophy
      baseXRatio: 0.13,
      radiusDesktop: 45,
      radiusMobile: 32,
      depth: 0.85,
      parallax: 0.25,
    },
    {
      name: 'Jupiter',
      draw: drawJupiter,
      anchorY: 8400,      // Contact Section & Footer
      baseXRatio: 0.84,
      radiusDesktop: 65,
      radiusMobile: 44,
      depth: 0.9,
      parallax: 0.28,
    },
  ];

  /* ══════════════════════════════════════════════════
     7. MAIN RENDER LOOP (60 FPS Hardware Accelerated)
     ══════════════════════════════════════════════════ */
  let lastTime = performance.now();

  function renderCosmic(now) {
    requestAnimationFrame(renderCosmic);

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // Smooth lerp mouse parallax
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    ctx.clearRect(0, 0, width, height);

    /* ── 1. DRAW NEBULA CLOUDS ── */
    nebulae.forEach(neb => {
      neb.phase += dt * 0.25;
      const pulse = Math.sin(neb.phase) * 0.15;
      const nx = neb.baseX * width + mouseX * 25;
      const ny = ((neb.baseY * height - scrollY * 0.08) % (height * 1.5) + height * 1.5) % (height * 1.5) - height * 0.25;

      const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, neb.r);
      grad.addColorStop(0, `rgba(${neb.color}, ${neb.maxAlpha * (1 + pulse)})`);
      grad.addColorStop(0.5, `rgba(${neb.color}, ${neb.maxAlpha * 0.45})`);
      grad.addColorStop(1, `rgba(${neb.color}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(nx, ny, neb.r, 0, Math.PI * 2);
      ctx.fill();
    });

    /* ── 2. DRAW TWINKLING STARFIELD ── */
    stars.forEach(star => {
      star.pulsePhase += star.pulseSpeed;
      const alpha = star.baseAlpha + Math.sin(star.pulsePhase) * 0.25;

      const sx = (star.x + mouseX * (30 * star.depth)) % width;
      const totalY = star.y - scrollY * star.parallax;
      const sy = ((totalY % height) + height) % height;

      ctx.beginPath();
      ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color}, ${Math.max(0.1, alpha)})`;
      ctx.fill();

      if (star.size > 1.3 && alpha > 0.5) {
        ctx.beginPath();
        ctx.arc(sx, sy, star.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${alpha * 0.18})`;
        ctx.fill();
      }
    });

    /* ── 3. DRAW CELESTIAL PLANETS ALONG FULL-SITE SCROLL JOURNEY ── */
    const isMobile = width < 768;

    celestialBodies.forEach(body => {
      const R = isMobile ? body.radiusMobile : body.radiusDesktop;
      const screenX = width * body.baseXRatio + mouseX * (32 * body.depth);
      // Screen Y calculated relative to current scroll position
      const screenY = body.anchorY - scrollY * body.parallax;

      // Draw only when in or near viewport (-250px margin for smooth entrance/exit)
      if (screenY > -250 && screenY < height + 250) {
        body.draw(screenX, screenY, R, now);
      }
    });

    /* ── 4. SPAWN & DRAW SHOOTING STARS (Sao Băng) ── */
    if (now > nextShootingStarTime && shootingStars.length < MAX_SHOOTING_STARS) {
      spawnShootingStar();
      nextShootingStarTime = now + Math.random() * 3000 + 1500;
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.alpha -= ss.decay;

      const tailX = ss.x - (ss.vx / Math.hypot(ss.vx, ss.vy)) * ss.length;
      const tailY = ss.y - (ss.vy / Math.hypot(ss.vx, ss.vy)) * ss.length;

      const tailGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      tailGrad.addColorStop(0, `rgba(${ss.color}, 0)`);
      tailGrad.addColorStop(0.7, `rgba(${ss.color}, ${ss.alpha * 0.35})`);
      tailGrad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha * 0.95})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = tailGrad;
      ctx.lineWidth = ss.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ss.x, ss.y, ss.width * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${ss.alpha})`;
      ctx.fill();

      if (Math.random() > 0.4) {
        ss.sparks.push({
          x: ss.x,
          y: ss.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          alpha: ss.alpha * 0.8,
          size: Math.random() * 1.5 + 0.5,
        });
      }

      for (let s = ss.sparks.length - 1; s >= 0; s--) {
        const sp = ss.sparks[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= 0.03;
        if (sp.alpha <= 0) {
          ss.sparks.splice(s, 1);
        } else {
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ss.color}, ${sp.alpha})`;
          ctx.fill();
        }
      }

      if (ss.alpha <= 0 || ss.x < -200 || ss.y > height + 200) {
        shootingStars.splice(i, 1);
      }
    }

    /* ── 5. DRAW 3D FACETED TUMBLING ASTEROIDS (Thiên Thạch) ── */
    asteroids.forEach(ast => {
      ast.x += ast.vx;
      ast.y += ast.vy;

      const pX = ast.x + mouseX * (25 * ast.z);
      // Continuous vertical wrap across the viewport
      const pY = ((ast.y - scrollY * (ast.z * 0.18)) % (height + 200) + (height + 200)) % (height + 200) - 100;

      if (ast.x - ast.size * 2 > width) {
        ast.x = -ast.size * 2 - Math.random() * 150;
        ast.y = Math.random() * height;
        ast.vx = (Math.random() * 0.6 + 0.35) * (ast.z + 0.4);
      }

      ast.rotX += ast.dRotX;
      ast.rotY += ast.dRotY;
      ast.rotZ += ast.dRotZ;

      const rotVerts = ast.mesh.verts.map(v => rotate3D(v, ast.rotX, ast.rotY, ast.rotZ));
      const projVerts = rotVerts.map(v => [pX + v[0] * ast.size, pY + v[1] * ast.size]);

      ast.mesh.faces.forEach(face => {
        const p0 = rotVerts[face[0]];
        const p1 = rotVerts[face[1]];
        const p2 = rotVerts[face[2]];

        const u = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
        const w = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];
        const nx = u[1] * w[2] - u[2] * w[1];
        const ny = u[2] * w[0] - u[0] * w[2];
        const nz = u[0] * w[1] - u[1] * w[0];

        if (nz <= 0.001) return;

        const nLen = Math.hypot(nx, ny, nz);
        if (nLen === 0) return;
        const norm = [nx / nLen, ny / nLen, nz / nLen];

        const dot = norm[0] * lightDir[0] + norm[1] * lightDir[1] + norm[2] * lightDir[2];
        const diffuse = Math.max(0, dot);
        const brightness = 0.22 + diffuse * 0.78;

        const r = Math.floor(ast.palette.r * brightness);
        const g = Math.floor(ast.palette.g * brightness);
        const b = Math.floor(ast.palette.b * brightness);

        const s0 = projVerts[face[0]];
        const s1 = projVerts[face[1]];
        const s2 = projVerts[face[2]];

        ctx.beginPath();
        ctx.moveTo(s0[0], s0[1]);
        ctx.lineTo(s1[0], s1[1]);
        ctx.lineTo(s2[0], s2[1]);
        ctx.closePath();

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${ast.alpha})`;
        ctx.fill();

        ctx.strokeStyle = `rgba(${Math.min(255, r + 45)}, ${Math.min(255, g + 45)}, ${Math.min(255, b + 55)}, ${ast.alpha * 0.35})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      if (ast.size > 20 && Math.random() > 0.65) {
        ast.dustParticles.push({
          x: pX - ast.vx * 3,
          y: pY + (Math.random() - 0.5) * (ast.size * 0.5),
          alpha: 0.5,
          size: Math.random() * 1.5 + 0.6,
        });
      }

      for (let d = ast.dustParticles.length - 1; d >= 0; d--) {
        const dust = ast.dustParticles[d];
        dust.x -= ast.vx * 0.5;
        dust.alpha -= 0.02;
        if (dust.alpha <= 0) {
          ast.dustParticles.splice(d, 1);
        } else {
          ctx.beginPath();
          ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(160, 180, 210, ${dust.alpha * ast.alpha})`;
          ctx.fill();
        }
      }
    });
  }

  requestAnimationFrame(renderCosmic);

})();
