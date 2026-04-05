DESTINATION: /index.js
(() => {
  "use strict";

  const canvas = document.getElementById("scene");
  const ctx = canvas.getContext("2d", { alpha: false });

  const DPR_CAP = 2;
  const STARFIELD_COUNT = 900;
  const MICRO_DUST_COUNT = 260;
  const COMET_COUNT = 6;

  const SYSTEM_NAMES = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "C"];
  const SYSTEM_STRENGTHS = [1.00, 0.93, 0.86, 0.79, 0.72, 0.65, 0.58, 0.51, 0.44];

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    timeStart: performance.now(),
    stars: [],
    dust: [],
    comets: [],
    systems: []
  };

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    state.dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    state.width = Math.max(1, Math.floor(rect.width));
    state.height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    rebuildStaticField();
  }

  function rebuildStaticField() {
    buildStarfield();
    buildDust();
    buildComets();
    buildSystems();
  }

  function buildStarfield() {
    state.stars = [];
    const w = state.width;
    const h = state.height;

    for (let i = 0; i < STARFIELD_COUNT; i += 1) {
      const layer = i % 3;
      state.stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: layer === 0 ? Math.random() * 0.8 + 0.25 : layer === 1 ? Math.random() * 1.1 + 0.45 : Math.random() * 1.5 + 0.7,
        a: layer === 0 ? Math.random() * 0.30 + 0.08 : layer === 1 ? Math.random() * 0.35 + 0.12 : Math.random() * 0.45 + 0.18,
        t: Math.random() * Math.PI * 2,
        s: Math.random() * 0.8 + 0.2
      });
    }
  }

  function buildDust() {
    state.dust = [];
    const w = state.width;
    const h = state.height;

    for (let i = 0; i < MICRO_DUST_COUNT; i += 1) {
      state.dust.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 70 + 30,
        a: Math.random() * 0.035 + 0.008
      });
    }
  }

  function buildComets() {
    state.comets = [];
    const w = state.width;
    const h = state.height;

    for (let i = 0; i < COMET_COUNT; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      state.comets.push({
        baseX: side < 0 ? -Math.random() * 0.25 * w : w + Math.random() * 0.25 * w,
        baseY: Math.random() * h * 0.85,
        dx: side < 0 ? 1 : -1,
        speed: Math.random() * 30 + 18,
        len: Math.random() * 110 + 70,
        phase: Math.random() * 1000
      });
    }
  }

  function diamondPoints(cx, cy, spacing) {
    return [
      { label: "N", x: cx, y: cy - spacing * 1.35 },
      { label: "NE", x: cx + spacing, y: cy - spacing * 0.68 },
      { label: "E", x: cx + spacing * 1.35, y: cy },
      { label: "SE", x: cx + spacing, y: cy + spacing * 0.68 },
      { label: "S", x: cx, y: cy + spacing * 1.35 },
      { label: "SW", x: cx - spacing, y: cy + spacing * 0.68 },
      { label: "W", x: cx - spacing * 1.35, y: cy },
      { label: "NW", x: cx - spacing, y: cy - spacing * 0.68 },
      { label: "C", x: cx, y: cy }
    ];
  }

  function buildSystems() {
    state.systems = [];

    const w = state.width;
    const h = state.height;
    const cx = w * 0.5;
    const cy = h * 0.54;
    const spacing = Math.min(w, h) * 0.17;
    const points = diamondPoints(cx, cy, spacing);

    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];
      const strength = SYSTEM_STRENGTHS[i];
      const baseOrbit = lerp(26, 48, 1 - strength);
      const orbitCount = 3 + (i % 3);

      const planets = [];
      for (let j = 0; j < orbitCount; j += 1) {
        planets.push({
          orbitR: baseOrbit + j * 10 + Math.random() * 4,
          theta: Math.random() * Math.PI * 2,
          speed: (0.08 + Math.random() * 0.06) * (1 / (j + 1)),
          size: clamp(1.4 + Math.random() * 2.1 - j * 0.12, 1.1, 3.2)
        });
      }

      state.systems.push({
        name: p.label,
        x: p.x,
        y: p.y,
        strength,
        starRadius: lerp(2.6, 5.8, strength),
        glowRadius: lerp(16, 34, strength),
        ringRadius: baseOrbit + orbitCount * 8,
        planets
      });
    }
  }

  function drawBackground() {
    const w = state.width;
    const h = state.height;

    const bg = ctx.createRadialGradient(w * 0.5, h * 0.52, 0, w * 0.5, h * 0.52, Math.max(w, h) * 0.65);
    bg.addColorStop(0, "#0d1a35");
    bg.addColorStop(0.4, "#071126");
    bg.addColorStop(1, "#040814");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    drawNebula(w * 0.24, h * 0.29, Math.min(w, h) * 0.28, "rgba(102,72,168,0.13)");
    drawNebula(w * 0.77, h * 0.68, Math.min(w, h) * 0.24, "rgba(48,122,182,0.11)");
    drawNebula(w * 0.56, h * 0.42, Math.min(w, h) * 0.20, "rgba(255,255,255,0.035)");
  }

  function drawNebula(x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(0.45, color.replace(/0\.\d+\)/, "0.045)"));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawDust() {
    for (const d of state.dust) {
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
      g.addColorStop(0, `rgba(255,255,255,${d.a})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStars(t) {
    for (const s of state.stars) {
      const flicker = 0.75 + 0.25 * Math.sin(t * 0.0012 * s.s + s.t);
      ctx.globalAlpha = s.a * flicker;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawDiamondGuides() {
    const c = state.systems.find((s) => s.name === "C");
    if (!c) return;

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;

    const order = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    ctx.beginPath();

    for (let i = 0; i < order.length; i += 1) {
      const sys = state.systems.find((s) => s.name === order[i]);
      if (!sys) continue;
      if (i === 0) ctx.moveTo(sys.x, sys.y);
      else ctx.lineTo(sys.x, sys.y);
    }

    ctx.stroke();

    for (const s of state.systems) {
      if (s.name === "C") continue;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawComets(t) {
    for (const c of state.comets) {
      const cycle = ((t * 0.001 * c.speed) + c.phase) % (state.width * 1.8);
      const x = c.baseX + cycle * c.dx;
      const y = c.baseY + Math.sin((t * 0.0003) + c.phase) * 28;

      const tx = x - c.dx * c.len;
      const ty = y + c.len * 0.06;

      const g = ctx.createLinearGradient(x, y, tx, ty);
      g.addColorStop(0, "rgba(255,255,255,0.9)");
      g.addColorStop(0.18, "rgba(190,220,255,0.45)");
      g.addColorStop(1, "rgba(190,220,255,0)");

      ctx.strokeStyle = g;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.arc(x, y, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawSystem(sys, elapsed) {
    const pulse = 0.92 + 0.08 * Math.sin(elapsed * 0.0011 + sys.strength * 10);

    const glow = ctx.createRadialGradient(sys.x, sys.y, 0, sys.x, sys.y, sys.glowRadius * pulse);
    glow.addColorStop(0, `rgba(255,245,220,${0.55 * sys.strength + 0.25})`);
    glow.addColorStop(0.35, `rgba(255,220,160,${0.18 * sys.strength + 0.08})`);
    glow.addColorStop(1, "rgba(255,220,160,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sys.x, sys.y, sys.glowRadius * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sys.x, sys.y, sys.ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    for (const p of sys.planets) {
      const theta = p.theta + elapsed * 0.001 * p.speed;
      const px = sys.x + Math.cos(theta) * p.orbitR;
      const py = sys.y + Math.sin(theta) * p.orbitR * 0.62;

      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      ctx.beginPath();
      ctx.ellipse(sys.x, sys.y, p.orbitR, p.orbitR * 0.62, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(170,200,255,0.92)";
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#fff4dd";
    ctx.beginPath();
    ctx.arc(sys.x, sys.y, sys.starRadius * pulse, 0, Math.PI * 2);
    ctx.fill();

    drawStarCross(sys.x, sys.y, sys.starRadius * 3.3, 0.14 + sys.strength * 0.12);

    ctx.fillStyle = "rgba(223,233,255,0.90)";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(sys.name, sys.x, sys.y - sys.ringRadius - 10);
  }

  function drawStarCross(x, y, r, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(255,245,220,${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.moveTo(x, y - r);
    ctx.lineTo(x, y + r);
    ctx.stroke();
    ctx.restore();
  }

  function drawScaleRead() {
    const systems = state.systems;
    if (!systems.length) return;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const s of systems) {
      minX = Math.min(minX, s.x - s.ringRadius);
      maxX = Math.max(maxX, s.x + s.ringRadius);
      minY = Math.min(minY, s.y - s.ringRadius);
      maxY = Math.max(maxY, s.y + s.ringRadius);
    }

    const pad = 28;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.strokeRect(minX - pad, minY - pad, (maxX - minX) + pad * 2, (maxY - minY) + pad * 2);
    ctx.restore();
  }

  function render(now) {
    const elapsed = now - state.timeStart;

    drawBackground();
    drawDust();
    drawStars(elapsed);
    drawDiamondGuides();
    drawComets(elapsed);

    for (const sys of state.systems) {
      drawSystem(sys, elapsed);
    }

    drawScaleRead();

    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize, { passive: true });

  resize();
  requestAnimationFrame(render);
})();
