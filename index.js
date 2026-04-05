DESTINATION: /index.js
(() => {
  "use strict";

  const JS_STAMP = "J10-ALIGNED-DIRECT";
  const HTML_STAMP = "H10";
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
    deep: 320,
    band: 520,
    bright: 140,
    hero: 18
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
      { key: "N", x: state.cx, y: state.cy - r },
      { key: "NE", x: state.cx + d, y: state.cy - d },
      { key: "E", x: state.cx + r, y: state.cy },
      { key: "SE", x: state.cx + d, y: state.cy + d },
      { key: "S", x: state.cx, y: state.cy + r },
      { key: "SW", x: state.cx - d, y: state.cy + d },
      { key: "W", x: state.cx - r, y: state.cy },
      { key: "NW", x: state.cx - d, y: state.cy - d },
      { key: "C", x: state.cx, y: state.cy }
    ];
  }

  function galaxyBandPoint(rand, spreadX, spreadY, rotation) {
    const t = lerp(-1, 1, rand());
    const curve = Math.sin(t * Math.PI * 1.12) * spreadY;
    const x0 = t * spreadX;
    const y0 = curve + lerp(-1, 1, rand()) * spreadY * 0.24;
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
    while (stars.length < count && attempts < count * 5) {
      attempts += 1;
      const star = {
        x: rand() * state.width,
        y: rand() * state.height,
        radius: lerp(0.45, 1.20, Math.pow(rand(), 1.7)),
        alpha: lerp(0.18, 0.52, rand()),
        twinkle: rand() * TWO_PI,
        driftX: lerp(-1.8, 1.8, rand()),
        driftY: lerp(-1.8, 1.8, rand()),
        rgb: rand() < 0.24 ? [184, 208, 255] : [255, 255, 255]
      };
      pushIfNotInQuietZone(stars, star);
    }
    return stars;
  }

  function buildBandStars(rand, count, rotation, minRadius, maxRadius, minAlpha, maxAlpha) {
    const stars = [];
    const spreadX = state.universeRadius * 1.92;
    const spreadY = state.universeRadius * 0.11;
    let attempts = 0;

    while (stars.length < count && attempts < count * 6) {
      attempts += 1;
      const p = galaxyBandPoint(rand, spreadX, spreadY, rotation);
      const star = {
        x: p.x,
        y: p.y,
        radius: lerp(minRadius, maxRadius, Math.pow(rand(), 1.45)),
        alpha: lerp(minAlpha, maxAlpha, rand()),
        twinkle: rand() * TWO_PI,
        driftX: lerp(-3.0, 3.0, rand()),
        driftY: lerp(-1.4, 1.4, rand()),
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
    const spreadX = state.universeRadius * 1.55;
    const spreadY = state.universeRadius * 0.09;
    let attempts = 0;

    while (stars.length < count && attempts < count * 6) {
      attempts += 1;
      const p = galaxyBandPoint(rand, spreadX, spreadY, rotation);
      const star = {
        x: p.x,
        y: p.y,
        radius: lerp(2.8, 5.6, rand()),
        alpha: lerp(0.70, 1.0, rand()),
        twinkle: rand() * TWO_PI,
        glow: lerp(18, 36, rand()),
        rgb: rand() < 0.40 ? [255, 220, 174] : [214, 232, 255]
      };
      pushIfNotInQuietZone(stars, star);
    }

    return stars;
  }

  function buildNebula(rand, count) {
    const clouds = [];
    for (let i = 0; i < count; i += 1) {
      const angle = rand() * TWO_PI;
      const distance = Math.pow(rand(), 0.72) * state.universeRadius * 1.08;
      clouds.push({
        x: state.cx + Math.cos(angle) * distance * 0.78,
        y: state.cy + Math.sin(angle) * distance * 0.42,
        spreadX: lerp(130, 320, rand()) * (state.width < 700 ? 0.94 : 1),
        spreadY: lerp(30, 92, rand()),
        rotation: lerp(-1.0, 1.0, rand()),
        alpha: lerp(0.014, 0.07, rand()),
        hue: rand() < 0.34 ? "82,138,255" : rand() < 0.67 ? "176,96,255" : "42,184,255",
        phase: rand() * TWO_PI
      });
    }
    return clouds;
  }

  function buildDustLanes(rand, count, rotation) {
    const lanes = [];
    const spreadX = state.universeRadius * 1.82;
    const spreadY = state.universeRadius * 0.08;
    for (let i = 0; i < count; i += 1) {
      const p = galaxyBandPoint(rand, spreadX, spreadY, rotation);
      lanes.push({
        x: p.x,
        y: p.y,
        rx: lerp(90, 220, rand()),
        ry: lerp(8, 24, rand()),
        rotation: rotation + lerp(-0.18, 0.18, rand()),
        alpha: lerp(0.026, 0.080, rand())
      });
    }
    return lanes;
  }

  function buildPrimarySystems(rand) {
    const anchors = diamondAnchors();
    const systems = [];
    const smallScreenScale = state.width < 640 ? 0.92 : 1;

    for (let i = 0; i < anchors.length; i += 1) {
      const ageBias = i / (anchors.length - 1);
      const anchor = anchors[i];
      const dominantRadius = lerp(11, 20, 1 - ageBias) * smallScreenScale;
      const haloRadius = lerp(88, 160, 1 - ageBias) * smallScreenScale;
      const coronaRadius = haloRadius * lerp(1.55, 1.92, rand());
      const quietRadius = haloRadius * 1.28;
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
    const seedBase = hashString(`diamondgatebridge:/index:${state.width}x${state.height}:${JS_STAMP}:${HTML_STAMP}`);
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
    state.bandStars = buildBandStars(bandRand, STAR_COUNTS.band, rotation, 0.62, 1.75, 0.22, 0.92);
    state.brightStars = buildBandStars(brightRand, STAR_COUNTS.bright, rotation, 1.45, 2.90, 0.42, 1.0);
    state.heroStars = buildHeroStars(heroRand, STAR_COUNTS.hero, rotation);
    state.nebulaClouds = buildNebula(nebulaRand, 12);
    state.dustLanes = buildDustLanes(dustRand, 22, rotation);
  }

  function drawBackground() {
    const bg = ctx.createLinearGradient(0, 0, 0, state.height);
    bg.addColorStop(0, "#071224");
    bg.addColorStop(0.20, "#08142a");
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
      state.universeRadius * 1.64
    );
    coreGlow.addColorStop(0, "rgba(126,162,255,0.14)");
    coreGlow.addColorStop(0.22, "rgba(90,126,255,0.08)");
    coreGlow.addColorStop(0.42, "rgba(176,98,255,0.04)");
    coreGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = coreGlow;
    ctx.fillRect(0, 0, state.width, state.height);

    const vignette = ctx.createRadialGradient(
      state.cx,
      state.cy,
      state.universeRadius * 0.18,
      state.cx,
      state.cy,
      Math.max(state.width, state.height) * 0.76
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(0.60, "rgba(0,0,0,0.10)");
    vignette.addColorStop(1, "rgba(0,0,0,0.52)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, state.width, state.height);
  }

  function drawNebula(timeSeconds) {
    for (let i = 0; i < state.nebulaClouds.length; i += 1) {
      const n = state.nebulaClouds[i];
      const drift = Math.sin(timeSeconds * 0.05 + n.phase) * 8;
      const x = n.x + drift;
      const y = n.y + drift * 0.28;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(n.rotation);

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, n.spreadX);
      g.addColorStop(0, `rgba(${n.hue},${n.alpha.toFixed(3)})`);
      g.addColorStop(0.34, `rgba(${n.hue},${(n.alpha * 0.40).toFixed(3)})`);
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
    ctx.rotate(-0.52 + Math.sin(timeSeconds * 0.024) * 0.012);

    const spineLength = state.universeRadius * 3.0;
    const spineHeight = state.universeRadius * 0.13;

    const spineGlow = ctx.createLinearGradient(-spineLength * 0.5, 0, spineLength * 0.5, 0);
    spineGlow.addColorStop(0, "rgba(0,0,0,0)");
    spineGlow.addColorStop(0.12, "rgba(86,136,255,0.04)");
    spineGlow.addColorStop(0.26, "rgba(156,104,255,0.07)");
    spineGlow.addColorStop(0.50, "rgba(244,246,255,0.32)");
    spineGlow.addColorStop(0.74, "rgba(118,174,255,0.10)");
    spineGlow.addColorStop(0.88, "rgba(74,122,255,0.04)");
    spineGlow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = spineGlow;
    ctx.beginPath();
    ctx.ellipse(0, 0, spineLength * 0.5, spineHeight, 0, 0, TWO_PI);
    ctx.fill();

    const narrowCore = ctx.createLinearGradient(-spineLength * 0.5, 0, spineLength * 0.5, 0);
    narrowCore.addColorStop(0, "rgba(0,0,0,0)");
    narrowCore.addColorStop(0.22, "rgba(176,202,255,0.04)");
    narrowCore.addColorStop(0.50, "rgba(255,255,255,0.18)");
    narrowCore.addColorStop(0.78, "rgba(176,202,255,0.04)");
    narrowCore.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = narrowCore;
    ctx.beginPath();
    ctx.ellipse(0, 0, spineLength * 0.46, spineHeight * 0.38, 0, 0, TWO_PI);
    ctx.fill();

    ctx.restore();
  }

  function drawDustLanes(timeSeconds) {
    for (let i = 0; i < state.dustLanes.length; i += 1) {
      const d = state.dustLanes[i];
      const sway = Math.sin(timeSeconds * 0.035 + i * 0.63) * 4;

      ctx.save();
      ctx.translate(d.x + sway, d.y + sway * 0.18);
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
      const twinkle = 0.74 + Math.sin(timeSeconds * pulseScale + s.twinkle) * 0.26;
      const alpha = clamp(s.alpha * twinkle, 0, 1);
      const x = s.x + Math.sin(timeSeconds * 0.016 + s.twinkle) * s.driftX;
      const y = s.y + Math.cos(timeSeconds * 0.016 + s.twinkle) * s.driftY;

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
      const pulse = 0.82 + Math.sin(timeSeconds * 0.8 + s.twinkle) * 0.18;
      const alpha = clamp(s.alpha * pulse, 0, 1);

      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.glow);
      glow.addColorStop(0, `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${(alpha * 0.34).toFixed(3)})`);
      glow.addColorStop(0.45, `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${(alpha * 0.14).toFixed(3)})`);
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
      ctx.moveTo(s.x - s.radius * 4.0, s.y);
      ctx.lineTo(s.x + s.radius * 4.0, s.y);
      ctx.moveTo(s.x, s.y - s.radius * 4.0);
      ctx.lineTo(s.x, s.y + s.radius * 4.0);
      ctx.stroke();
    }
  }

  function drawPrimarySystems(timeSeconds) {
    for (let i = 0; i < state.primarySystems.length; i += 1) {
      const s = state.primarySystems[i];
      const pulse = 0.90 + Math.sin(timeSeconds * 0.66 + s.pulseOffset) * 0.10;
      const haloPulse = 0.95 + Math.sin(timeSeconds * 0.40 + s.pulseOffset) * 0.05;

      const corona = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.coronaRadius * haloPulse);
      corona.addColorStop(0, `rgba(${s.coronaA},0.18)`);
      corona.addColorStop(0.24, `rgba(${s.coronaA},0.10)`);
      corona.addColorStop(0.56, `rgba(${s.coronaA},0.04)`);
      corona.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.coronaRadius * haloPulse, 0, TWO_PI);
      ctx.fill();

      const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.haloRadius * haloPulse);
      halo.addColorStop(0, `rgba(${s.coreA},0.42)`);
      halo.addColorStop(0.22, `rgba(${s.coreB},0.24)`);
      halo.addColorStop(0.52, `rgba(${s.coreB},0.10)`);
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
        s.radius * 2.8
      );
      core.addColorStop(0, "rgba(255,255,255,1)");
      core.addColorStop(0.18, `rgba(${s.coreA},0.98)`);
      core.addColorStop(0.66, `rgba(${s.coreB},0.88)`);
      core.addColorStop(1, `rgba(${s.coreB},0)`);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * pulse, 0, TWO_PI);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(s.x - s.radius * 4.6, s.y);
      ctx.lineTo(s.x + s.radius * 4.6, s.y);
      ctx.moveTo(s.x, s.y - s.radius * 4.6);
      ctx.lineTo(s.x, s.y + s.radius * 4.6);
      ctx.stroke();

      ctx.fillStyle = "rgba(238,243,255,0.90)";
      ctx.font = `700 ${state.width < 640 ? 11 : 12}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(s.key, s.x, s.y - s.haloRadius - 10);
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
    drawStarField(state.deepStars, timeSeconds, 0.22, 2.0);
    drawGalaxySpine(timeSeconds);
    drawDustLanes(timeSeconds);
    drawStarField(state.bandStars, timeSeconds, 0.46, 1.85);
    drawStarField(state.brightStars, timeSeconds, 0.76, 1.65);
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
    window.__COMPASS_HTML_STAMP__ = HTML_STAMP;
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
