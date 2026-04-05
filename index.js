DESTINATION: /index.js
(() => {
  "use strict";

  const JS_STAMP = "J5-GALAXY-UPGRADE";
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
    near: 420,
    mid: 180,
    far: 90
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
    starsNear: [],
    starsMid: [],
    starsFar: [],
    nebulaClouds: [],
    galaxyDust: [],
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
    state.universeRadius = Math.min(state.width, state.height) * (state.width < 700 ? 0.34 : 0.29);

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
      { key: "N",  x: state.cx,        y: state.cy - r },
      { key: "NE", x: state.cx + diag, y: state.cy - diag },
      { key: "E",  x: state.cx + r,    y: state.cy },
      { key: "SE", x: state.cx + diag, y: state.cy + diag },
      { key: "S",  x: state.cx,        y: state.cy + r },
      { key: "SW", x: state.cx - diag, y: state.cy + diag },
      { key: "W",  x: state.cx - r,    y: state.cy },
      { key: "NW", x: state.cx - diag, y: state.cy - diag },
      { key: "C",  x: state.cx,        y: state.cy }
    ];
  }

  function buildStarLayer(rand, count, minR, maxR, minA, maxA, tintMode, driftScale) {
    const stars = [];
    for (let i = 0; i < count; i += 1) {
      const x = rand() * state.width;
      const y = rand() * state.height;
      const radius = lerp(minR, maxR, Math.pow(rand(), 1.7));
      const alpha = lerp(minA, maxA, rand());
      const twinkle = rand() * TWO_PI;
      const driftX = lerp(-driftScale, driftScale, rand());
      const driftY = lerp(-driftScale, driftScale, rand());

      let base;
      if (tintMode === 0) {
        base = rand() < 0.16 ? [190, 214, 255] : [255, 255, 255];
      } else if (tintMode === 1) {
        base = rand() < 0.24 ? [255, 224, 190] : [182, 205, 255];
      } else {
        base = rand() < 0.35 ? [204, 176, 255] : [160, 198, 255];
      }

      stars.push({
        x,
        y,
        radius,
        alpha,
        twinkle,
        driftX,
        driftY,
        rgb: base
      });
    }
    return stars;
  }

  function buildNebula(rand, count) {
    const clouds = [];
    for (let i = 0; i < count; i += 1) {
      const angle = rand() * TWO_PI;
      const distance = Math.pow(rand(), 0.72) * state.universeRadius * 1.1;
      const x = state.cx + Math.cos(angle) * distance * 0.82;
      const y = state.cy + Math.sin(angle) * distance * 0.48;
      const spreadX = lerp(120, 320, rand()) * (state.width < 700 ? 0.92 : 1);
      const spreadY = lerp(38, 120, rand());
      const rotation = lerp(-0.9, 0.9, rand());
      const alpha = lerp(0.025, 0.105, rand());
      const hue = rand() < 0.34 ? "88,146,255" : rand() < 0.67 ? "176,98,255" : "58,188,255";

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

  function buildDust(rand, count) {
    const dust = [];
    for (let i = 0; i < count; i += 1) {
      const angle = rand() * TWO_PI;
      const distance = Math.pow(rand(), 0.56) * state.universeRadius * 1.32;
      dust.push({
        x: state.cx + Math.cos(angle) * distance * 0.9,
        y: state.cy + Math.sin(angle) * distance * 0.42,
        rx: lerp(80, 220, rand()),
        ry: lerp(10, 34, rand()),
        rotation: angle + lerp(-0.7, 0.7, rand()),
        alpha: lerp(0.015, 0.075, rand()),
        hue: rand() < 0.55 ? "120,165,255" : "188,104,255"
      });
    }
    return dust;
  }

  function buildSystems(rand) {
    const anchors = diamondAnchors();
    const systems = [];
    const baseOrbit = clamp(Math.min(state.width, state.height) * 0.022, 16, 28);

    for (let i = 0; i < anchors.length; i += 1) {
      const anchor = anchors[i];
      const ageBias = i / (anchors.length - 1);
      const coreRadius = lerp(10, 17, 1 - ageBias) * (state.width < 640 ? 0.82 : 1);
      const glow = lerp(44, 94, 1 - ageBias);
      const orbitTilt = lerp(-0.55, 0.55, rand());
      const orbitScaleY = lerp(0.34, 0.56, rand());

      const planets = [];
      for (let slot = 0; slot < PLANET_SLOT_COUNT; slot += 1) {
        const slotBias = slot / (PLANET_SLOT_COUNT - 1);
        const radius = baseOrbit + slot * (baseOrbit * 0.42 + 5.4 + i * 0.12);
        const planetRadius = clamp(lerp(2.1, 6.0, 1 - slotBias) * lerp(0.72, 1.14, rand()), 1.3, 6.2);
        const speed = lerp(0.34, 0.05, slotBias);
        const phase = rand() * TWO_PI;
        const alpha = lerp(0.72, 0.97, rand());
        const huePick = rand();

        let fill;
        if (huePick < 0.2) {
          fill = `rgba(255,212,156,${alpha.toFixed(3)})`;
        } else if (huePick < 0.45) {
          fill = `rgba(194,221,255,${alpha.toFixed(3)})`;
        } else if (huePick < 0.7) {
          fill = `rgba(162,184,255,${alpha.toFixed(3)})`;
        } else {
          fill = `rgba(214,182,255,${alpha.toFixed(3)})`;
        }

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
    const starRandA = createRng(seedBase ^ 0xA53C19E5);
    const starRandB = createRng(seedBase ^ 0x17F2D043);
    const starRandC = createRng(seedBase ^ 0xC014A55E);
    const nebulaRand = createRng(seedBase ^ 0x6B2E91D0);
    const dustRand = createRng(seedBase ^ 0x90AB12F4);
    const systemRand = createRng(seedBase ^ 0x51EE7712);

    state.starsNear = buildStarLayer(starRandA, STAR_COUNTS.near, 0.45, 1.45, 0.35, 1.0, 0, 5);
    state.starsMid = buildStarLayer(starRandB, STAR_COUNTS.mid, 0.9, 2.0, 0.20, 0.76, 1, 9);
    state.starsFar = buildStarLayer(starRandC, STAR_COUNTS.far, 1.2, 3.1, 0.12, 0.56, 2, 14);
    state.nebulaClouds = buildNebula(nebulaRand, 18);
    state.galaxyDust = buildDust(dustRand, 28);
    state.systems = buildSystems(systemRand);
  }

  function drawBackground() {
    const bg = ctx.createLinearGradient(0, 0, 0, state.height);
    bg.addColorStop(0, "#06101f");
    bg.addColorStop(0.24, "#07152b");
    bg.addColorStop(0.60, "#030c19");
    bg.addColorStop(1, "#01040d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, state.width, state.height);

    const vignette = ctx.createRadialGradient(
      state.cx,
      state.cy,
      state.universeRadius * 0.2,
      state.cx,
      state.cy,
      Math.max(state.width, state.height) * 0.7
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(0.65, "rgba(0,0,0,0.08)");
    vignette.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, state.width, state.height);
  }

  function drawNebula(timeSeconds) {
    for (let i = 0; i < state.nebulaClouds.length; i += 1) {
      const n = state.nebulaClouds[i];
      const drift = Math.sin(timeSeconds * 0.07 + n.phase) * 10;
      const x = n.x + drift;
      const y = n.y + drift * 0.36;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(n.rotation);

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, n.spreadX);
      g.addColorStop(0, `rgba(${n.hue},${n.alpha.toFixed(3)})`);
      g.addColorStop(0.38, `rgba(${n.hue},${(n.alpha * 0.42).toFixed(3)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, n.spreadX, n.spreadY, 0, 0, TWO_PI);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawGalaxyDust(timeSeconds) {
    for (let i = 0; i < state.galaxyDust.length; i += 1) {
      const d = state.galaxyDust[i];
      const sway = Math.sin(timeSeconds * 0.05 + i * 0.81) * 6;

      ctx.save();
      ctx.translate(d.x + sway, d.y + sway * 0.28);
      ctx.rotate(d.rotation);

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, d.rx);
      g.addColorStop(0, `rgba(${d.hue},${d.alpha.toFixed(3)})`);
      g.addColorStop(0.34, `rgba(${d.hue},${(d.alpha * 0.38).toFixed(3)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, d.rx, d.ry, 0, 0, TWO_PI);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawStarField(stars, timeSeconds, pulseScale) {
    for (let i = 0; i < stars.length; i += 1) {
      const s = stars[i];
      const twinkle = 0.72 + Math.sin(timeSeconds * pulseScale + s.twinkle) * 0.28;
      const alpha = clamp(s.alpha * twinkle, 0, 1);
      const x = s.x + Math.sin(timeSeconds * 0.02 + s.twinkle) * s.driftX;
      const y = s.y + Math.cos(timeSeconds * 0.02 + s.twinkle) * s.driftY;

      ctx.fillStyle = `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, s.radius, 0, TWO_PI);
      ctx.fill();

      if (s.radius > 1.7) {
        ctx.strokeStyle = `rgba(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]},${(alpha * 0.32).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - s.radius * 2.2, y);
        ctx.lineTo(x + s.radius * 2.2, y);
        ctx.moveTo(x, y - s.radius * 2.2);
        ctx.lineTo(x, y + s.radius * 2.2);
        ctx.stroke();
      }
    }
  }

  function drawGalaxySpine(timeSeconds) {
    ctx.save();
    ctx.translate(state.cx, state.cy);
    ctx.rotate(-0.48 + Math.sin(timeSeconds * 0.03) * 0.016);

    const spineLength = state.universeRadius * 2.6;
    const spineHeight = state.universeRadius * 0.23;

    const spineGlow = ctx.createLinearGradient(-spineLength * 0.5, 0, spineLength * 0.5, 0);
    spineGlow.addColorStop(0, "rgba(0,0,0,0)");
    spineGlow.addColorStop(0.14, "rgba(92,145,255,0.05)");
    spineGlow.addColorStop(0.32, "rgba(178,112,255,0.06)");
    spineGlow.addColorStop(0.5, "rgba(242,245,255,0.22)");
    spineGlow.addColorStop(0.68, "rgba(126,176,255,0.08)");
    spineGlow.addColorStop(0.86, "rgba(82,128,255,0.04)");
    spineGlow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = spineGlow;
    ctx.beginPath();
    ctx.ellipse(0, 0, spineLength * 0.5, spineHeight, 0, 0, TWO_PI);
    ctx.fill();

    const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, state.universeRadius * 0.34);
    coreGlow.addColorStop(0, "rgba(255,255,255,0.26)");
    coreGlow.addColorStop(0.18, "rgba(214,228,255,0.20)");
    coreGlow.addColorStop(0.42, "rgba(144,176,255,0.10)");
    coreGlow.addColorStop(0.68, "rgba(180,104,255,0.05)");
    coreGlow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(0, 0, state.universeRadius * 0.34, 0, TWO_PI);
    ctx.fill();

    ctx.restore();
  }

  function drawAnchorLines() {
    const anchors = state.systems;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(180,205,255,0.08)";

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
    const pulse = 0.92 + Math.sin(timeSeconds * 0.9 + index * 0.7) * 0.08;

    ctx.save();
    ctx.translate(system.x, system.y);

    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, system.glow);
    glow.addColorStop(0, `rgba(${system.coreFillA},0.34)`);
    glow.addColorStop(0.28, `rgba(${system.coreFillB},0.15)`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, system.glow, 0, TWO_PI);
    ctx.fill();

    ctx.strokeStyle = "rgba(205,220,255,0.13)";
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
      -system.coreRadius * 0.22,
      -system.coreRadius * 0.22,
      0,
      0,
      0,
      system.coreRadius * 1.9
    );
    starGradient.addColorStop(0, `rgba(255,255,255,${(0.98 * pulse).toFixed(3)})`);
    starGradient.addColorStop(0.22, `rgba(${system.coreFillA},${(0.92 * pulse).toFixed(3)})`);
    starGradient.addColorStop(0.7, `rgba(${system.coreFillB},${(0.72 * pulse).toFixed(3)})`);
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

    ctx.fillStyle = "rgba(238,243,255,0.82)";
    ctx.font = `700 ${state.width < 640 ? 10 : 11}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(system.key, 0, -(system.glow + 10));

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
    drawGalaxyDust(timeSeconds);
    drawStarField(state.starsNear, timeSeconds, 1.15);
    drawGalaxySpine(timeSeconds);
    drawStarField(state.starsMid, timeSeconds, 0.55);
    drawAnchorLines();

    for (let i = 0; i < state.systems.length; i += 1) {
      drawSystem(state.systems[i], timeSeconds, i);
    }

    drawStarField(state.starsFar, timeSeconds, 0.22);
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
