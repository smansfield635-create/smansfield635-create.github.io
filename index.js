DESTINATION: /index.js
(() => {
  "use strict";

  const JS_STAMP = "J6-CINEMATIC-GALAXY";
  const canvas = document.getElementById("scene");
  if (!canvas) {
    throw new Error("Compass page requires #scene canvas");
  }

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) {
    throw new Error("2D canvas context unavailable");
  }

  const DPR_CAP = 2;
  const TWO_PI = Math.PI * 2;
  const PLANET_SLOT_COUNT = 9;

  const STAR_COUNTS = {
    deep: 900,
    band: 780,
    bright: 180,
    hero: 26
  };

  const state = {
    dpr: 1,
    width: 1,
    height: 1,
    cx: 0,
    cy: 0,
    universeRadius: 1,
    timeStart: performance.now(),
    rafId: 0,
    deepStars: [],
    bandStars: [],
    brightStars: [],
    heroStars: [],
    nebulaClouds: [],
    dustLanes: [],
    systems: [],
    buildStampVisible: true
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hashString(input) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < input.length; i += 1) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function createRng(seedValue) {
    let seed = seedValue >>> 0;
    return function rand() {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }

  function getRectSize() {
    const rect = canvas.getBoundingClientRect();
    return {
      width: Math.max(1, Math.floor(rect.width)),
      height: Math.max(1, Math.floor(rect.height))
    };
  }

  function resize() {
    const size = getRectSize();
    state.dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    state.width = size.width;
    state.height = size.height;
    state.cx = state.width * 0.5;
    state.cy = state.height * 0.54;
    state.universeRadius = Math.min(state.width, state.height) * (state.width < 700 ? 0.36 : 0.31);

    canvas.width = Math.max(1, Math.floor(state.width * state.dpr));
    canvas.height = Math.max(1, Math.floor(state.height * state.dpr));
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    buildScene();
  }

  function diamondAnchors() {
    const r = state.universeRadius;
    const diag = r * 0.72;
    return [
      { key: "N", x: state.cx, y: state.cy - r },
      { key: "NE", x: state.cx + diag, y: state.cy - diag },
      { key: "E", x: state.cx + r, y: state.cy },
      { key: "SE", x: state.cx + diag, y: state.cy + diag },
      { key: "S", x: state.cx, y: state.cy + r },
      { key: "SW", x: state.cx - diag, y: state.cy + diag },
      { key: "W", x: state.cx - r, y: state.cy },
      { key: "NW", x: state.cx - diag, y: state.cy - diag },
      { key: "C", x: state.cx, y: state.cy }
    ];
  }

  function galaxyBandPoint(rand, spreadX, spreadY, rotation) {
    const t = lerp(-1, 1, rand());
    const curve = Math.sin(t * Math.PI * 1.12) * spreadY;
    const x0 = t * spreadX;
    const y0 = curve + lerp(-1, 1, rand()) * spreadY * 0.33;

    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);

    return {
      x: state.cx + x0 * cosR - y0 * sinR,
      y: state.cy + x0 * sinR + y0 * cosR
    };
  }

  function buildDeepStars(rand, count) {
    const stars = [];
    for (let i = 0; i < count; i += 1) {
      const x = rand() * state.width;
      const y = rand() * state.height;
      const radius = lerp(0.35, 1.1, Math.pow(rand(), 1.9));
      const alpha = lerp(0.14, 0.55, rand());
      const twinkle = rand() * TWO_PI;
      const driftX = lerp(-3, 3, rand());
      const driftY = lerp(-3, 3, rand());
      const cool = rand() < 0.24;
      stars.push({
        x,
        y,
        radius,
        alpha,
        twinkle,
        driftX,
        driftY,
        rgb: cool ? [184, 208, 255] : [255, 255, 255]
      });
    }
    return stars;
  }

  function buildBandStars(rand, count, rotation) {
    const stars = [];
    const spreadX = state.universeRadius * 1.95;
    const spreadY = state.universeRadius * 0.18;

    for (let i = 0; i < count; i += 1) {
      const p = galaxyBandPoint(rand, spreadX, spreadY, rotation);
      const radius = lerp(0.45, 1.45, Math.pow(rand(), 1.55));
      const alpha = lerp(0.22, 0.92, rand());
      const twinkle = rand() * TWO_PI;
      const driftX = lerp(-6, 6, rand());
      const driftY = lerp(-3, 3, rand());

      let rgb;
      const pick = rand();
      if (pick < 0.18) rgb = [255, 228, 194];
      else if (pick < 0.48) rgb = [198, 220, 255];
      else if (pick < 0.76) rgb = [255, 255, 255];
      else rgb = [214, 184, 255];

      stars.push({
        x: p.x,
        y: p.y,
        radius,
        alpha,
        twinkle,
        driftX,
        driftY,
        rgb
      });
    }

    return stars;
  }

  function buildHeroStars(rand, count, rotation) {
    const stars = [];
    const spreadX = state.universeRadius * 1.7;
    const spreadY = state.universeRadius * 0.14;

    for (let i = 0; i < count; i += 1) {
      const p = galaxyBandPoint(rand, spreadX, spreadY, rotation);
      const radius = lerp(1.9, 3.8, rand());
      const alpha = lerp(0.55, 0.95, rand());
      const twinkle = rand() * TWO_PI;
      const glow = lerp(10, 26, rand());
      const warm = rand() < 0.35;

      stars.push({
        x: p.x,
        y: p.y,
        radius,
        alpha,
        twinkle,
        glow,
        rgb: warm ? [255, 220, 174] : [214, 232, 255]
      });
    }

    return stars;
  }

  function buildNebula(rand, count) {
    const clouds = [];
    for (let i = 0; i < count; i += 1) {
      const angle = rand() * TWO_PI;
      const distance = Math.pow(rand(), 0.72) * state.universeRadius * 1.12;
      const x = state.cx + Math.cos(angle) * distance * 0.82;
      const y = state.cy + Math.sin(angle) * distance * 0.46;
      const spreadX = lerp(160, 400, rand()) * (state.width < 700 ? 0.94 : 1);
      const spreadY = lerp(44, 138, rand());
      const rotation = lerp(-1.05, 1.05, rand());
      const alpha = lerp(0.026, 0.14, rand());
      const hue = rand() < 0.34 ? "82,138,255" : rand() < 0.67 ? "176,96,255" : "42,184,255";

      clouds.push({
        x,
        y,
        spreadX,
        spreadY,
        rotation,
        alpha,
        hue,
        phase: rand() * TWO_PI
      });
    }
    return clouds;
  }

  function buildDustLanes(rand, count, rotation) {
    const lanes = [];
    const spreadX = state.universeRadius * 1.84;
    const spreadY = state.universeRadius * 0.12;

    for (let i = 0; i < count; i += 1) {
      const p = galaxyBandPoint(rand, spreadX, spreadY, rotation);
      lanes.push({
        x: p.x,
        y: p.y,
        rx: lerp(110, 280, rand()),
        ry: lerp(12, 34, rand()),
        rotation: rotation + lerp(-0.26, 0.26, rand()),
        alpha: lerp(0.03, 0.09, rand())
      });
    }

    return lanes;
  }

  function buildSystems(rand) {
    const anchors = diamondAnchors();
    const systems = [];
    const baseOrbit = clamp(Math.min(state.width, state.height) * 0.0205, 15, 26);

    for (let i = 0; i < anchors.length; i += 1) {
      const anchor = anchors[i];
      const ageBias = i / (anchors.length - 1);
      const coreRadius = lerp(9.5, 16, 1 - ageBias) * (state.width < 640 ? 0.82 : 1);
      const glow = lerp(40, 84, 1 - ageBias);
      const orbitTilt = lerp(-0.58, 0.58, rand());
      const orbitScaleY = lerp(0.34, 0.56, rand());

      const planets = [];
      for (let slot = 0; slot < PLANET_SLOT_COUNT; slot += 1) {
        const slotBias = slot / (PLANET_SLOT_COUNT - 1);
        const radius = baseOrbit + slot * (baseOrbit * 0.40 + 5.0 + i * 0.10);
        const planetRadius = clamp(lerp(1.8, 5.6, 1 - slotBias) * lerp(0.72, 1.12, rand()), 1.2, 6.0);
        const speed = lerp(0.28, 0.045, slotBias);
        const phase = rand() * TWO_PI;

        let fill;
        const pick = rand();
        if (pick < 0.20) fill = "rgba(255,212,156,0.92)";
        else if (pick < 0.46) fill = "rgba(194,221,255,0.90)";
        else if (pick < 0.74) fill = "rgba(162,184,255,0.90)";
        else fill = "rgba(214,182,255,0.90)";

        planets.push({
          radius,
          planetRadius,
          speed,
          phase,
          fill
        });
      }

      systems.push({
        key: anchor.key,
        x: anchor.x,
        y: anchor.y,
        coreRadius,
        glow,
        orbitTilt,
        orbitScaleY,
        coreFillA: i < 3 ? "255,240,194" : i < 6 ? "216,227,255" : "255,205,154",
        coreFillB: i < 3 ? "255,168,84" : i < 6 ? "112,165,255" : "255,108,86",
        planets
      });
    }

    return systems;
  }

  function buildScene() {
    const seedBase = hashString(`diamondgatebridge:/index:${state.width}x${state.height}:${JS_STAMP}`);
    const deepRand = createRng(seedBase ^ 0xA53C19E5);
    const bandRand = createRng(seedBase ^ 0x17F2D043);
    const brightRand = createRng(seedBase ^ 0xC014A55E);
    const heroRand = createRng(seedBase ^ 0x9B1DC0DE);
    const nebulaRand = createRng(seedBase ^ 0x6B2E91D0);
    const dustRand = createRng(seedBase ^ 0x90AB12F4);
    const systemRand = createRng(seedBase ^ 0x51EE7712);

    const rotation = -0.52;

    state.deepStars = buildDeepStars(deepRand, STAR_COUNTS.deep);
    state.bandStars = buildBandStars(bandRand, STAR_COUNTS.band, rotation);
    state.brightStars = buildBandStars(brightRand, STAR_COUNTS.bright, rotation);
    state.heroStars = buildHeroStars(heroRand, STAR_COUNTS.hero, rotation);
    state.nebulaClouds = buildNebula(nebulaRand, 22);
    state.dustLanes = buildDustLanes(dustRand, 34, rotation);
    state.systems = buildSystems(systemRand);
  }

  function drawBackground() {
    const bg = ctx.createLinearGradient(0, 0, 0, state.height);
    bg.addColorStop(0, "#071224");
    bg.addColorStop(0.22, "#08142a");
    bg.addColorStop(0.60, "#030a17");
    bg.addColorStop(1, "#01040c");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, state.width, state.height);

    const coreGlow = ctx.createRadialGradient(
      state.cx,
      state.cy,
      0,
      state.cx,
      state.cy,
      state.universeRadius * 1.7
    );
    coreGlow.addColorStop(0, "rgba(126,162,255,0.15)");
    coreGlow.addColorStop(0.24, "rgba(90,126,255,0.08)");
    coreGlow.addColorStop(0.42, "rgba(176,98,255,0.05)");
    coreGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = coreGlow;
    ctx.fillRect(0, 0, state.width, state.height);

    const vignette = ctx.createRadialGradient(
      state.cx,
      state.cy,
      state.universeRadius * 0.2,
      state.cx,
      state.cy,
      Math.max(state.width, state.height) * 0.74
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(0.64, "rgba(0,0,0,0.10)");
    vignette.addColorStop(1, "rgba(0,0,0,0.48)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, state.width, state.height);
  }

  function drawNebula(timeSeconds) {
    for (let i = 0; i < state.nebulaClouds.length; i += 1) {
      const n = state.nebulaClouds[i];
      const drift = Math.sin(timeSeconds * 0.06 + n.phase) * 10;
      const x = n.x + drift;
      const y = n.y + drift * 0.34;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(n.rotation);

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, n.spreadX);
      g.addColorStop(0, `rgba(${n.hue},${n.alpha.toFixed(3)})`);
      g.addColorStop(0.36, `rgba(${n.hue},${(n.alpha * 0.44).toFixed(3)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, n.spreadX, n.spreadY, 0, 0, TWO_PI);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawDustLanes(timeSeconds) {
    for (let i = 0; i < state.dustLanes.length; i += 1) {
      const d = state.dustLanes[i];
      const sway = Math.sin(timeSeconds * 0.04 + i * 0.73) * 5;

      ctx.save();
      ctx.translate(d.x + sway, d.y + sway * 0.20);
      ctx.rotate(d.rotation);

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, d.rx);
      g.addColorStop(0, `rgba(0,0,0,${d.alpha.toFixed(3)})`);
      g.addColorStop(0.42, `rgba(3,7,18,${(d.alpha * 0.82).toFixed(3)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, d.rx, d.ry, 0, 0, TWO_PI);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawStarField(stars, timeSeconds, pulseScale, crossThreshold) {
    for (let i = 0; i < stars.length; i += 1) {
      const s = stars[i];
      const twinkle = 0.72 + Math.sin(timeSeconds * pulseScale + s.twinkle) * 0.28;
      const alpha = clamp(s.alpha * twinkle, 0, 1);
      const x = s.x + Math.sin(timeSeconds * 0.018 + s.twinkle) * s.driftX;
      const y = s.y + Math.cos(timeSeconds * 0.018 + s.twinkle) * s.driftY;

      ctx.fillStyle = `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, s.radius, 0, TWO_PI);
      ctx.fill();

      if (s.radius > crossThreshold) {
        ctx.strokeStyle = `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${(alpha * 0.34).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - s.radius * 2.6, y);
        ctx.lineTo(x + s.radius * 2.6, y);
        ctx.moveTo(x, y - s.radius * 2.6);
        ctx.lineTo(x, y + s.radius * 2.6);
        ctx.stroke();
      }
    }
  }

  function drawHeroStars(timeSeconds) {
    for (let i = 0; i < state.heroStars.length; i += 1) {
      const s = state.heroStars[i];
      const pulse = 0.80 + Math.sin(timeSeconds * 0.9 + s.twinkle) * 0.20;
      const alpha = clamp(s.alpha * pulse, 0, 1);

      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.glow);
      glow.addColorStop(0, `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${(alpha * 0.30).toFixed(3)})`);
      glow.addColorStop(0.45, `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${(alpha * 0.12).toFixed(3)})`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.glow, 0, TWO_PI);
      ctx.fill();

      ctx.fillStyle = `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, TWO_PI);
      ctx.fill();

      ctx.strokeStyle = `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${(alpha * 0.44).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s.x - s.radius * 4.2, s.y);
      ctx.lineTo(s.x + s.radius * 4.2, s.y);
      ctx.moveTo(s.x, s.y - s.radius * 4.2);
      ctx.lineTo(s.x, s.y + s.radius * 4.2);
      ctx.stroke();
    }
  }

  function drawGalaxySpine(timeSeconds) {
    ctx.save();
    ctx.translate(state.cx, state.cy);
    ctx.rotate(-0.52 + Math.sin(timeSeconds * 0.024) * 0.014);

    const spineLength = state.universeRadius * 2.9;
    const spineHeight = state.universeRadius * 0.19;

    const spineGlow = ctx.createLinearGradient(-spineLength * 0.5, 0, spineLength * 0.5, 0);
    spineGlow.addColorStop(0, "rgba(0,0,0,0)");
    spineGlow.addColorStop(0.12, "rgba(86,136,255,0.05)");
    spineGlow.addColorStop(0.28, "rgba(156,104,255,0.08)");
    spineGlow.addColorStop(0.50, "rgba(244,246,255,0.28)");
    spineGlow.addColorStop(0.72, "rgba(118,174,255,0.10)");
    spineGlow.addColorStop(0.88, "rgba(74,122,255,0.04)");
    spineGlow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = spineGlow;
    ctx.beginPath();
    ctx.ellipse(0, 0, spineLength * 0.5, spineHeight, 0, 0, TWO_PI);
    ctx.fill();

    const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, state.universeRadius * 0.38);
    coreGlow.addColorStop(0, "rgba(255,255,255,0.30)");
    coreGlow.addColorStop(0.18, "rgba(214,228,255,0.22)");
    coreGlow.addColorStop(0.40, "rgba(144,176,255,0.11)");
    coreGlow.addColorStop(0.68, "rgba(180,104,255,0.05)");
    coreGlow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(0, 0, state.universeRadius * 0.38, 0, TWO_PI);
    ctx.fill();

    ctx.restore();
  }

  function drawAnchorLines() {
    const anchors = state.systems;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(180,205,255,0.055)";

    ctx.beginPath();
    ctx.moveTo(anchors[0].x, anchors[0].y);
    for (let i = 1; i < 8; i += 1) {
      ctx.lineTo(anchors[i].x, anchors[i].y);
    }
    ctx.closePath();
    ctx.stroke();

    for (let i = 0; i < 8; i += 1) {
      ctx.beginPath();
      ctx.moveTo(state.cx, state.cy);
      ctx.lineTo(anchors[i].x, anchors[i].y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSystem(system, timeSeconds, index) {
    const pulse = 0.92 + Math.sin(timeSeconds * 0.7 + index * 0.7) * 0.08;

    ctx.save();
    ctx.translate(system.x, system.y);

    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, system.glow);
    glow.addColorStop(0, `rgba(${system.coreFillA},0.24)`);
    glow.addColorStop(0.28, `rgba(${system.coreFillB},0.10)`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, system.glow, 0, TWO_PI);
    ctx.fill();

    ctx.strokeStyle = "rgba(205,220,255,0.10)";
    ctx.lineWidth = 1;

    for (let i = 0; i < system.planets.length; i += 1) {
      const p = system.planets[i];
      ctx.save();
      ctx.rotate(system.orbitTilt);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.radius, p.radius * system.orbitScaleY, 0, 0, TWO_PI);
      ctx.stroke();
      ctx.restore();
    }

    const starGradient = ctx.createRadialGradient(
      -system.coreRadius * 0.20,
      -system.coreRadius * 0.20,
      0,
      0,
      0,
      system.coreRadius * 1.8
    );
    starGradient.addColorStop(0, `rgba(255,255,255,${(0.96 * pulse).toFixed(3)})`);
    starGradient.addColorStop(0.22, `rgba(${system.coreFillA},${(0.86 * pulse).toFixed(3)})`);
    starGradient.addColorStop(0.70, `rgba(${system.coreFillB},${(0.62 * pulse).toFixed(3)})`);
    starGradient.addColorStop(1, `rgba(${system.coreFillB},0)`);

    ctx.fillStyle = starGradient;
    ctx.beginPath();
    ctx.arc(0, 0, system.coreRadius * pulse, 0, TWO_PI);
    ctx.fill();

    for (let i = 0; i < system.planets.length; i += 1) {
      const p = system.planets[i];
      const angle = p.phase + timeSeconds * p.speed;
      const px = Math.cos(angle) * p.radius;
      const py = Math.sin(angle) * p.radius * system.orbitScaleY;

      ctx.fillStyle = p.fill;
      ctx.beginPath();
      ctx.arc(px, py, p.planetRadius, 0, TWO_PI);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(238,243,255,0.56)";
    ctx.font = `700 ${state.width < 640 ? 10 : 11}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(system.key, 0, -(system.glow + 8));

    ctx.restore();
  }

  function drawBuildStamp() {
    if (!state.buildStampVisible) return;

    const label = `JS ${JS_STAMP}`;
    const padX = 10;
    const padY = 7;
    const fontSize = 11;
    const x = 12;
    const y = state.height - 14;

    ctx.save();
    ctx.font = `700 ${fontSize}px Arial`;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";

    const width = ctx.measureText(label).width + padX * 2;
    const height = fontSize + padY * 2;

    ctx.fillStyle = "rgba(5,11,24,0.58)";
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 1;

    const rx = x - 4;
    const ry = y - height + 4;
    const rr = 10;

    ctx.beginPath();
    ctx.moveTo(rx + rr, ry);
    ctx.lineTo(rx + width - rr, ry);
    ctx.quadraticCurveTo(rx + width, ry, rx + width, ry + rr);
    ctx.lineTo(rx + width, ry + height - rr);
    ctx.quadraticCurveTo(rx + width, ry + height, rx + width - rr, ry + height);
    ctx.lineTo(rx + rr, ry + height);
    ctx.quadraticCurveTo(rx, ry + height, rx, ry + height - rr);
    ctx.lineTo(rx, ry + rr);
    ctx.quadraticCurveTo(rx, ry, rx + rr, ry);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(235,242,255,0.88)";
    ctx.fillText(label, x + padX - 4, y - padY + 2);
    ctx.restore();
  }

  function drawFrame(now) {
    const timeSeconds = (now - state.timeStart) * 0.001;

    ctx.clearRect(0, 0, state.width, state.height);

    drawBackground();
    drawNebula(timeSeconds);
    drawStarField(state.deepStars, timeSeconds, 0.26, 1.75);
    drawGalaxySpine(timeSeconds);
    drawDustLanes(timeSeconds);
    drawStarField(state.bandStars, timeSeconds, 0.54, 1.6);
    drawStarField(state.brightStars, timeSeconds, 0.82, 1.45);
    drawHeroStars(timeSeconds);
    drawAnchorLines();

    for (let i = 0; i < state.systems.length; i += 1) {
      drawSystem(state.systems[i], timeSeconds, i);
    }

    drawBuildStamp();

    state.rafId = window.requestAnimationFrame(drawFrame);
  }

  function start() {
    resize();
    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
    }
    state.timeStart = performance.now();
    state.rafId = window.requestAnimationFrame(drawFrame);
    window.__ROOT_INDEX_JS_PROOF__ = true;
    window.__COMPASS_GALAXY_ACTIVE__ = true;
    window.__COMPASS_JS_STAMP__ = JS_STAMP;
  }

  let resizeTimer = 0;
  function onResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resize();
    }, 60);
  }

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onResize, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
      return;
    }

    if (!state.rafId) {
      state.timeStart = performance.now();
      state.rafId = window.requestAnimationFrame(drawFrame);
    }
  });

  canvas.addEventListener("click", () => {
    state.buildStampVisible = !state.buildStampVisible;
  });

  start();
})();
