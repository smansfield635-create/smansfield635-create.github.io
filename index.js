DESTINATION: /index.js
(() => {
  "use strict";

  const canvas = document.getElementById("scene");
  if (!canvas) {
    throw new Error("Compass page requires #scene canvas");
  }

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) {
    throw new Error("2D canvas context unavailable");
  }

  const DPR_CAP = 2;
  const STAR_LAYER_COUNTS = [220, 120, 48];
  const SYSTEM_KEYS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "C"];
  const PLANET_SLOT_COUNT = 9;
  const TWO_PI = Math.PI * 2;

  const state = {
    dpr: 1,
    width: 1,
    height: 1,
    cx: 0,
    cy: 0,
    universeRadius: 1,
    timeStart: performance.now(),
    starsNear: [],
    starsMid: [],
    starsFar: [],
    dust: [],
    systems: [],
    rafId: 0
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
    state.cy = state.height * 0.5;
    state.universeRadius = Math.min(state.width, state.height) * 0.34;

    canvas.width = Math.max(1, Math.floor(state.width * state.dpr));
    canvas.height = Math.max(1, Math.floor(state.height * state.dpr));
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    buildScene();
  }

  function diamondAnchors() {
    const r = state.universeRadius;
    return [
      { key: "N",  x: state.cx,         y: state.cy - r },
      { key: "NE", x: state.cx + r * 0.72, y: state.cy - r * 0.72 },
      { key: "E",  x: state.cx + r,     y: state.cy },
      { key: "SE", x: state.cx + r * 0.72, y: state.cy + r * 0.72 },
      { key: "S",  x: state.cx,         y: state.cy + r },
      { key: "SW", x: state.cx - r * 0.72, y: state.cy + r * 0.72 },
      { key: "W",  x: state.cx - r,     y: state.cy },
      { key: "NW", x: state.cx - r * 0.72, y: state.cy - r * 0.72 },
      { key: "C",  x: state.cx,         y: state.cy }
    ];
  }

  function buildStarLayer(rand, count, minR, maxR, minA, maxA, tintMode) {
    const stars = [];
    for (let i = 0; i < count; i += 1) {
      const x = rand() * state.width;
      const y = rand() * state.height;
      const radius = lerp(minR, maxR, Math.pow(rand(), 1.6));
      const alpha = lerp(minA, maxA, rand());
      const twinkle = rand() * TWO_PI;
      let color;
      if (tintMode === 0) {
        color = `rgba(255,255,255,${alpha.toFixed(3)})`;
      } else if (tintMode === 1) {
        color = rand() < 0.32
          ? `rgba(180,205,255,${alpha.toFixed(3)})`
          : `rgba(255,255,255,${alpha.toFixed(3)})`;
      } else {
        color = rand() < 0.22
          ? `rgba(255,226,192,${alpha.toFixed(3)})`
          : `rgba(168,202,255,${alpha.toFixed(3)})`;
      }
      stars.push({ x, y, radius, alpha, twinkle, color });
    }
    return stars;
  }

  function buildDust(rand, count) {
    const dust = [];
    for (let i = 0; i < count; i += 1) {
      const angle = rand() * TWO_PI;
      const distance = Math.pow(rand(), 0.62) * state.universeRadius * 1.22;
      const spreadX = lerp(80, 180, rand());
      const spreadY = lerp(18, 52, rand());
      const rotation = angle + lerp(-0.8, 0.8, rand());
      const alpha = lerp(0.020, 0.085, rand());
      const hue = rand() < 0.5 ? "125,165,255" : "182,102,255";
      dust.push({
        x: state.cx + Math.cos(angle) * distance * 0.72,
        y: state.cy + Math.sin(angle) * distance * 0.36,
        spreadX,
        spreadY,
        rotation,
        alpha,
        hue
      });
    }
    return dust;
  }

  function buildSystems(rand) {
    const anchors = diamondAnchors();
    const baseOrbit = clamp(Math.min(state.width, state.height) * 0.018, 12, 22);
    const systems = [];

    for (let i = 0; i < anchors.length; i += 1) {
      const anchor = anchors[i];
      const ageBias = i / (anchors.length - 1);
      const coreRadius = lerp(8, 15, 1 - ageBias) * (state.width < 560 ? 0.82 : 1);
      const orbitGap = baseOrbit + i * 0.32;
      const orbitTilt = lerp(-0.42, 0.42, rand());
      const glow = lerp(30, 72, 1 - ageBias);

      const planets = [];
      for (let slot = 0; slot < PLANET_SLOT_COUNT; slot += 1) {
        const slotBias = slot / (PLANET_SLOT_COUNT - 1);
        const radius = orbitGap + slot * (baseOrbit * 0.48 + 5.6);
        const planetRadius = clamp(lerp(1.8, 5.4, 1 - slotBias) * lerp(0.75, 1.1, rand()), 1.2, 5.8);
        const speed = lerp(0.42, 0.06, slotBias);
        const phase = rand() * TWO_PI;
        const alpha = lerp(0.72, 0.94, rand());
        const colorPick = rand();
        let fill;
        if (colorPick < 0.24) {
          fill = `rgba(198,220,255,${alpha.toFixed(3)})`;
        } else if (colorPick < 0.50) {
          fill = `rgba(255,207,149,${alpha.toFixed(3)})`;
        } else if (colorPick < 0.78) {
          fill = `rgba(155,181,255,${alpha.toFixed(3)})`;
        } else {
          fill = `rgba(204,170,255,${alpha.toFixed(3)})`;
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
        coreFillA: i < 3 ? "255,237,187" : i < 6 ? "210,225,255" : "255,199,147",
        coreFillB: i < 3 ? "255,164,82" : i < 6 ? "125,175,255" : "255,105,92",
        planets
      });
    }

    return systems;
  }

  function buildScene() {
    const seedBase = hashString(`diamondgatebridge:/index:${state.width}x${state.height}`);
    const starRandA = createRng(seedBase ^ 0xA53C19E5);
    const starRandB = createRng(seedBase ^ 0x17F2D043);
    const starRandC = createRng(seedBase ^ 0xC014A55E);
    const dustRand = createRng(seedBase ^ 0x90AB12F4);
    const systemRand = createRng(seedBase ^ 0x51EE7712);

    state.starsNear = buildStarLayer(starRandA, STAR_LAYER_COUNTS[0], 0.45, 1.35, 0.30, 0.95, 0);
    state.starsMid = buildStarLayer(starRandB, STAR_LAYER_COUNTS[1], 0.8, 1.8, 0.25, 0.72, 1);
    state.starsFar = buildStarLayer(starRandC, STAR_LAYER_COUNTS[2], 1.1, 2.6, 0.15, 0.55, 2);
    state.dust = buildDust(dustRand, 22);
    state.systems = buildSystems(systemRand);
  }

  function drawBackground() {
    const bg = ctx.createLinearGradient(0, 0, 0, state.height);
    bg.addColorStop(0, "#081325");
    bg.addColorStop(0.28, "#09162a");
    bg.addColorStop(0.62, "#050c19");
    bg.addColorStop(1, "#020611");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, state.width, state.height);

    const galaxyGlow = ctx.createRadialGradient(
      state.cx,
      state.cy,
      0,
      state.cx,
      state.cy,
      state.universeRadius * 1.28
    );
    galaxyGlow.addColorStop(0, "rgba(132,165,255,0.18)");
    galaxyGlow.addColorStop(0.20, "rgba(118,145,255,0.10)");
    galaxyGlow.addColorStop(0.36, "rgba(185,102,255,0.07)");
    galaxyGlow.addColorStop(0.56, "rgba(55,170,255,0.04)");
    galaxyGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = galaxyGlow;
    ctx.fillRect(0, 0, state.width, state.height);
  }

  function drawDust(timeSeconds) {
    for (let i = 0; i < state.dust.length; i += 1) {
      const d = state.dust[i];
      const drift = Math.sin(timeSeconds * 0.08 + i * 0.91) * 8;
      const x = d.x + Math.cos(d.rotation) * drift;
      const y = d.y + Math.sin(d.rotation) * drift * 0.5;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(d.rotation);

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, d.spreadX);
      g.addColorStop(0, `rgba(${d.hue},${d.alpha.toFixed(3)})`);
      g.addColorStop(0.35, `rgba(${d.hue},${(d.alpha * 0.44).toFixed(3)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, d.spreadX, d.spreadY, 0, 0, TWO_PI);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawStars(stars, timeSeconds, pulseScale) {
    for (let i = 0; i < stars.length; i += 1) {
      const s = stars[i];
      const twinkle = 0.78 + Math.sin(timeSeconds * pulseScale + s.twinkle) * 0.22;
      ctx.globalAlpha = clamp(s.alpha * twinkle, 0, 1);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, TWO_PI);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawGalaxySpine(timeSeconds) {
    ctx.save();
    ctx.translate(state.cx, state.cy);
    ctx.rotate(-0.46 + Math.sin(timeSeconds * 0.03) * 0.015);

    const spineLength = state.universeRadius * 2.1;
    const spineGlow = ctx.createLinearGradient(-spineLength * 0.5, 0, spineLength * 0.5, 0);
    spineGlow.addColorStop(0, "rgba(0,0,0,0)");
    spineGlow.addColorStop(0.16, "rgba(124,168,255,0.03)");
    spineGlow.addColorStop(0.50, "rgba(230,238,255,0.12)");
    spineGlow.addColorStop(0.84, "rgba(132,98,255,0.04)");
    spineGlow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = spineGlow;
    ctx.beginPath();
    ctx.ellipse(0, 0, spineLength * 0.5, state.universeRadius * 0.16, 0, 0, TWO_PI);
    ctx.fill();

    const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, state.universeRadius * 0.24);
    coreGlow.addColorStop(0, "rgba(255,255,255,0.22)");
    coreGlow.addColorStop(0.18, "rgba(185,210,255,0.16)");
    coreGlow.addColorStop(0.55, "rgba(132,165,255,0.06)");
    coreGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(0, 0, state.universeRadius * 0.24, 0, TWO_PI);
    ctx.fill();

    ctx.restore();
  }

  function drawAnchorLines() {
    const anchors = state.systems;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(180, 205, 255, 0.08)";

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
    glow.addColorStop(0.24, `rgba(${system.coreFillB},0.16)`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, system.glow, 0, TWO_PI);
    ctx.fill();

    ctx.strokeStyle = "rgba(200,220,255,0.12)";
    ctx.lineWidth = 1;

    for (let i = 0; i < system.planets.length; i += 1) {
      const p = system.planets[i];
      ctx.save();
      ctx.rotate(system.orbitTilt);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.radius, p.radius * 0.44, 0, 0, TWO_PI);
      ctx.stroke();
      ctx.restore();
    }

    const starGradient = ctx.createRadialGradient(
      -system.coreRadius * 0.22,
      -system.coreRadius * 0.22,
      0,
      0,
      0,
      system.coreRadius * 1.8
    );
    starGradient.addColorStop(0, `rgba(255,255,255,${(0.95 * pulse).toFixed(3)})`);
    starGradient.addColorStop(0.25, `rgba(${system.coreFillA},${(0.90 * pulse).toFixed(3)})`);
    starGradient.addColorStop(0.70, `rgba(${system.coreFillB},${(0.72 * pulse).toFixed(3)})`);
    starGradient.addColorStop(1, `rgba(${system.coreFillB},0)`);
    ctx.fillStyle = starGradient;
    ctx.beginPath();
    ctx.arc(0, 0, system.coreRadius * pulse, 0, TWO_PI);
    ctx.fill();

    for (let i = 0; i < system.planets.length; i += 1) {
      const p = system.planets[i];
      const angle = p.phase + timeSeconds * p.speed;
      const px = Math.cos(angle) * p.radius;
      const py = Math.sin(angle) * p.radius * 0.44;

      ctx.fillStyle = p.fill;
      ctx.beginPath();
      ctx.arc(px, py, p.planetRadius, 0, TWO_PI);
      ctx.fill();
    }

    const isSmall = state.width < 640;
    ctx.fillStyle = "rgba(238,243,255,0.76)";
    ctx.font = `700 ${isSmall ? 10 : 11}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(system.key, 0, -(system.glow + 8));

    ctx.restore();
  }

  function drawFrame(now) {
    const timeSeconds = (now - state.timeStart) * 0.001;

    ctx.clearRect(0, 0, state.width, state.height);

    drawBackground();
    drawDust(timeSeconds);
    drawStars(state.starsNear, timeSeconds, 1.2);
    drawGalaxySpine(timeSeconds);
    drawStars(state.starsMid, timeSeconds, 0.65);
    drawAnchorLines();

    for (let i = 0; i < state.systems.length; i += 1) {
      drawSystem(state.systems[i], timeSeconds, i);
    }

    drawStars(state.starsFar, timeSeconds, 0.32);

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

  start();
})();
