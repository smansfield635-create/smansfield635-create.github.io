DESTINATION: /index.js
(() => {
  "use strict";

  const JS_STAMP = "J7-MACRO-UNIVERSE-CALIBRATION";
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

  const STAR_COUNTS = {
    deep: 820,
    band: 920,
    bright: 160,
    hero: 22
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
    dustLanes: [],
    nebulaClouds: [],
    primarySystems: [],
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
    state.cy = state.height * 0.53;
    state.universeRadius = Math.min(state.width, state.height) * (state.width < 700 ? 0.37 : 0.32);

    canvas.width = Math.max(1, Math.floor(state.width * state.dpr));
    canvas.height = Math.max(1, Math.floor(state.height * state.dpr));
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    buildScene();
  }

  function diamondAnchors() {
    const r = state.universeRadius;
    const d = r * 0.72;
    return [
      { key: "N",  x: state.cx,      y: state.cy - r },
      { key: "NE", x: state.cx + d,  y: state.cy - d },
      { key: "E",  x: state.cx + r,  y: state.cy },
      { key: "SE", x: state.cx + d,  y: state.cy + d },
      { key: "S",  x: state.cx,      y: state.cy + r },
      { key: "SW", x: state.cx - d,  y: state.cy + d },
      { key: "W",  x: state.cx - r,  y: state.cy },
      { key: "NW", x: state.cx - d,  y: state.cy - d },
      { key: "C",  x: state.cx,      y: state.cy }
    ];
  }

  function galaxyBandPoint(rand, spreadX, spreadY, rotation) {
    const t = lerp(-1, 1, rand());
    const curve = Math.sin(t * Math.PI * 1.16) * spreadY;
    const x0 = t * spreadX;
    const y0 = curve + lerp(-1, 1, rand()) * spreadY * 0.30;
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);

    return {
      x: state.cx + x0 * cosR - y0 * sinR,
      y: state.cy + x0 * sinR + y0 * cosR
    };
  }

  function pointDistanceSquared(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
  }

  function isInsidePrimaryQuietZone(x, y) {
    for (let i = 0; i < state.primarySystems.length; i += 1) {
      const system = state.primarySystems[i];
      if (pointDistanceSquared(x, y, system.x, system.y) <= system.quietRadius * system.quietRadius) {
        return true;
      }
    }
    return false;
  }

  function pushIfNotInQuietZone(target, star) {
    if (!isInsidePrimaryQuietZone(star.x, star.y)) {
      target.push(star);
    }
  }

  function buildDeepStars(rand, count) {
    const stars = [];
    let attempts = 0;
    while (stars.length < count && attempts < count * 3) {
      attempts += 1;
      const star = {
        x: rand() * state.width,
        y: rand() * state.height,
        radius: lerp(0.28, 0.95, Math.pow(rand(), 1.8)),
        alpha: lerp(0.10, 0.42, rand()),
        twinkle: rand() * TWO_PI,
        driftX: lerp(-2.4, 2.4, rand()),
        driftY: lerp(-2.4, 2.4, rand()),
        rgb: rand() < 0.22 ? [184, 208, 255] : [255, 255, 255]
      };
      pushIfNotInQuietZone(stars, star);
    }
    return stars;
  }

  function buildBandStars(rand, count, rotation, minRadius, maxRadius, minAlpha, maxAlpha) {
    const stars = [];
    const spreadX = state.universeRadius * 2.02;
    const spreadY = state.universeRadius * 0.15;
    let attempts = 0;

    while (stars.length < count && attempts < count * 4) {
      attempts += 1;
      const p = galaxyBandPoint(rand, spreadX, spreadY, rotation);
      const star = {
        x: p.x,
        y: p.y,
        radius: lerp(minRadius, maxRadius, Math.pow(rand(), 1.5)),
        alpha: lerp(minAlpha, maxAlpha, rand()),
        twinkle: rand() * TWO_PI,
        driftX: lerp(-4.5, 4.5, rand()),
        driftY: lerp(-2.0, 2.0, rand()),
        rgb: (() => {
          const pick = rand();
          if (pick < 0.18) return [255, 228, 194];
          if (pick < 0.46) return [198, 220, 255];
          if (pick < 0.76) return [255, 255, 255];
          return [214, 184, 255];
        })()
      };
      pushIfNotInQuietZone(stars, star);
    }

    return stars;
  }

  function buildHeroStars(rand, count, rotation) {
    const stars = [];
    const spreadX = state.universeRadius * 1.75;
    const spreadY = state.universeRadius * 0.11;
    let attempts = 0;

    while (stars.length < count && attempts < count * 5) {
      attempts += 1;
      const p = galaxyBandPoint(rand, spreadX, spreadY, rotation);
      const star = {
        x: p.x,
        y: p.y,
        radius: lerp(1.8, 3.9, rand()),
        alpha: lerp(0.54, 0.94, rand()),
        twinkle: rand() * TWO_PI,
        glow: lerp(12, 28, rand()),
        rgb: rand() < 0.38 ? [255, 220, 174] : [214, 232, 255]
      };
      pushIfNotInQuietZone(stars, star);
    }

    return stars;
  }

  function buildNebula(rand, count) {
    const clouds = [];
    for (let i = 0; i < count; i += 1) {
      const angle = rand() * TWO_PI;
      const distance = Math.pow(rand(), 0.72) * state.universeRadius * 1.16;
      clouds.push({
        x: state.cx + Math.cos(angle) * distance * 0.82,
        y: state.cy + Math.sin(angle) * distance * 0.48,
        spreadX: lerp(170, 430, rand()) * (state.width < 700 ? 0.95 : 1),
        spreadY: lerp(46, 145, rand()),
        rotation: lerp(-1.08, 1.08, rand()),
        alpha: lerp(0.022, 0.12, rand()),
        hue: rand() < 0.34 ? "82,138,255" : rand() < 0.67 ? "176,96,255" : "42,184,255",
        phase: rand() * TWO_PI
      });
    }
    return clouds;
  }

  function buildDustLanes(rand, count, rotation) {
    const lanes = [];
    const spreadX = state.universeRadius * 1.92;
    const spreadY = state.universeRadius * 0.10;
    for (let i = 0; i < count; i += 1) {
      const p = galaxyBandPoint(rand, spreadX, spreadY, rotation);
      lanes.push({
        x: p.x,
        y: p.y,
        rx: lerp(120, 300, rand()),
        ry: lerp(12, 34, rand()),
        rotation: rotation + lerp(-0.22, 0.22, rand()),
        alpha: lerp(0.034, 0.095, rand())
      });
    }
    return lanes;
  }

  function buildPrimarySystems(rand) {
    const anchors = diamondAnchors();
    const systems = [];
    const smallScreenScale = state.width < 640 ? 0.86 : 1;

    for (let i = 0; i < anchors.length; i += 1) {
      const ageBias = i / (anchors.length - 1);
      const anchor = anchors[i];
      const dominantRadius = lerp(4.9, 8.8, 1 - ageBias) * smallScreenScale;
      const haloRadius = lerp(38, 82, 1 - ageBias) * smallScreenScale;
      const coronaRadius = haloRadius * lerp(1.45, 1.72, rand());
      const quietRadius = haloRadius * 0.82;
      const pulseOffset = rand() * TWO_PI;

      systems.push({
        key: anchor.key,
        x: anchor.x,
        y: anchor.y,
        radius: dominantRadius,
        haloRadius,
        coronaRadius,
        quietRadius,
        pulseOffset,
        coreA: i < 3 ? "255,242,204" : i < 6 ? "220,232,255" : "255,212,168",
        coreB: i < 3 ? "255,174,88" : i < 6 ? "114,170,255" : "255,108,86",
        coronaA: i < 3 ? "255,214,148" : i < 6 ? "160,196,255" : "255,152,114"
      });
    }

    return systems;
  }

  function buildScene() {
    const seedBase = hashString(`diamondgatebridge:/index:${state.width}x${state.height}:${JS_STAMP}`);
    const primaryRand = createRng(seedBase ^ 0x51EE7712);
    const deepRand = createRng(seedBase ^ 0xA53C19E5);
    const bandRand = createRng(seedBase ^ 0x17F2D043);
    const brightRand = createRng(seedBase ^ 0xC014A55E);
    const heroRand = createRng(seedBase ^ 0x9B1DC0DE);
    const nebulaRand = createRng(seedBase ^ 0x6B2E91D0);
    const dustRand = createRng(seedBase ^ 0x90AB12F4);

    const rotation = -0.52;

    state.primarySystems = buildPrimarySystems(primaryRand);
    state.deepStars = buildDeepStars(deepRand, STAR_COUNTS.deep);
    state.bandStars = buildBandStars(bandRand, STAR_COUNTS.band, rotation, 0.42, 1.30, 0.16, 0.86);
    state.brightStars = buildBandStars(brightRand, STAR_COUNTS.bright, rotation, 1.10, 2.15, 0.30, 0.95);
    state.heroStars = buildHeroStars(heroRand, STAR_COUNTS.hero, rotation);
    state.nebulaClouds = buildNebula(nebulaRand, 22);
    state.dustLanes = buildDustLanes(dustRand, 34, rotation);
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
      state.universeRadius * 1.86
    );
    coreGlow.addColorStop(0, "rgba(126,162,255,0.16)");
    coreGlow.addColorStop(0.22, "rgba(90,126,255,0.09)");
    coreGlow.addColorStop(0.42, "rgba(176,98,255,0.06)");
    coreGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = coreGlow;
    ctx.fillRect(0, 0, state.width, state.height);

    const vignette = ctx.createRadialGradient(
      state.cx,
      state.cy,
      state.universeRadius * 0.2,
      state.cx,
      state.cy,
      Math.max(state.width, state.height) * 0.76
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(0.64, "rgba(0,0,0,0.10)");
    vignette.addColorStop(1, "rgba(0,0,0,0.50)");
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

  function drawGalaxySpine(timeSeconds) {
    ctx.save();
    ctx.translate(state.cx, state.cy);
    ctx.rotate(-0.52 + Math.sin(timeSeconds * 0.024) * 0.014);

    const spineLength = state.universeRadius * 3.05;
    const spineHeight = state.universeRadius * 0.17;

    const spineGlow = ctx.createLinearGradient(-spineLength * 0.5, 0, spineLength * 0.5, 0);
    spineGlow.addColorStop(0, "rgba(0,0,0,0)");
    spineGlow.addColorStop(0.10, "rgba(86,136,255,0.05)");
    spineGlow.addColorStop(0.26, "rgba(156,104,255,0.09)");
    spineGlow.addColorStop(0.50, "rgba(244,246,255,0.34)");
    spineGlow.addColorStop(0.74, "rgba(118,174,255,0.11)");
    spineGlow.addColorStop(0.90, "rgba(74,122,255,0.04)");
    spineGlow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = spineGlow;
    ctx.beginPath();
    ctx.ellipse(0, 0, spineLength * 0.5, spineHeight, 0, 0, TWO_PI);
    ctx.fill();

    const narrowCore = ctx.createLinearGradient(-spineLength * 0.5, 0, spineLength * 0.5, 0);
    narrowCore.addColorStop(0, "rgba(0,0,0,0)");
    narrowCore.addColorStop(0.18, "rgba(176,202,255,0.03)");
    narrowCore.addColorStop(0.50, "rgba(255,255,255,0.16)");
    narrowCore.addColorStop(0.82, "rgba(176,202,255,0.03)");
    narrowCore.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = narrowCore;
    ctx.beginPath();
    ctx.ellipse(0, 0, spineLength * 0.47, spineHeight * 0.44, 0, 0, TWO_PI);
    ctx.fill();

    const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, state.universeRadius * 0.40);
    coreGlow.addColorStop(0, "rgba(255,255,255,0.32)");
    coreGlow.addColorStop(0.18, "rgba(214,228,255,0.24)");
    coreGlow.addColorStop(0.40, "rgba(144,176,255,0.11)");
    coreGlow.addColorStop(0.68, "rgba(180,104,255,0.05)");
    coreGlow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(0, 0, state.universeRadius * 0.40, 0, TWO_PI);
    ctx.fill();

    ctx.restore();
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

  function drawPrimarySystems(timeSeconds) {
    for (let i = 0; i < state.primarySystems.length; i += 1) {
      const s = state.primarySystems[i];
      const pulse = 0.88 + Math.sin(timeSeconds * 0.72 + s.pulseOffset) * 0.12;
      const haloPulse = 0.94 + Math.sin(timeSeconds * 0.44 + s.pulseOffset) * 0.06;

      const corona = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.coronaRadius * haloPulse);
      corona.addColorStop(0, `rgba(${s.coronaA},0.14)`);
      corona.addColorStop(0.24, `rgba(${s.coronaA},0.08)`);
      corona.addColorStop(0.56, `rgba(${s.coronaA},0.03)`);
      corona.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.coronaRadius * haloPulse, 0, TWO_PI);
      ctx.fill();

      const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.haloRadius * haloPulse);
      halo.addColorStop(0, `rgba(${s.coreA},0.34)`);
      halo.addColorStop(0.22, `rgba(${s.coreB},0.20)`);
      halo.addColorStop(0.52, `rgba(${s.coreB},0.08)`);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.haloRadius * haloPulse, 0, TWO_PI);
      ctx.fill();

      const core = ctx.createRadialGradient(
        s.x - s.radius * 0.24,
        s.y - s.radius * 0.24,
        0,
        s.x,
        s.y,
        s.radius * 2.6
      );
      core.addColorStop(0, "rgba(255,255,255,0.98)");
      core.addColorStop(0.18, `rgba(${s.coreA},0.96)`);
      core.addColorStop(0.66, `rgba(${s.coreB},0.84)`);
      core.addColorStop(1, `rgba(${s.coreB},0)`);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * pulse, 0, TWO_PI);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s.x - s.radius * 3.8, s.y);
      ctx.lineTo(s.x + s.radius * 3.8, s.y);
      ctx.moveTo(s.x, s.y - s.radius * 3.8);
      ctx.lineTo(s.x, s.y + s.radius * 3.8);
      ctx.stroke();
    }
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
    drawStarField(state.deepStars, timeSeconds, 0.24, 1.75);
    drawGalaxySpine(timeSeconds);
    drawDustLanes(timeSeconds);
    drawStarField(state.bandStars, timeSeconds, 0.52, 1.55);
    drawStarField(state.brightStars, timeSeconds, 0.82, 1.45);
    drawHeroStars(timeSeconds);
    drawPrimarySystems(timeSeconds);
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
