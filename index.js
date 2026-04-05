DESTINATION: /index.js
(() => {
  "use strict";

  const canvas = document.getElementById("scene");
  const ctx = canvas.getContext("2d", { alpha: false });

  const DPR_CAP = 2;
  const STARFIELD_COUNT = 920;
  const DUST_COUNT = 220;
  const COMET_COUNT = 5;

  const SCALE = {
    universeKm: 256000000000,
    systemKm: 256000000,
    localSystemViewKm: 256000,
    planetZoomViewKm: 26500
  };

  const ANCHOR_ORDER = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "C"];
  const CHRONO_ORDER = [
    { anchor: "N", rank: 1, starStrength: 1.00, ageBias: 0.10 },
    { anchor: "NE", rank: 2, starStrength: 0.93, ageBias: 0.18 },
    { anchor: "E", rank: 3, starStrength: 0.86, ageBias: 0.26 },
    { anchor: "SE", rank: 4, starStrength: 0.79, ageBias: 0.34 },
    { anchor: "S", rank: 5, starStrength: 0.72, ageBias: 0.42 },
    { anchor: "SW", rank: 6, starStrength: 0.65, ageBias: 0.50 },
    { anchor: "W", rank: 7, starStrength: 0.58, ageBias: 0.58 },
    { anchor: "NW", rank: 8, starStrength: 0.51, ageBias: 0.66 },
    { anchor: "C", rank: 9, starStrength: 0.44, ageBias: 0.74 }
  ];

  const REFERENCE_SOLAR_LAYOUT = [
    { name: "Mercury", orbitKm: 57910000, diameterKm: 4879, tint: "rgba(196,205,225,0.95)" },
    { name: "Venus", orbitKm: 108200000, diameterKm: 12104, tint: "rgba(234,205,145,0.95)" },
    { name: "Earth", orbitKm: 149600000, diameterKm: 12742, tint: "rgba(140,185,255,0.98)" },
    { name: "Mars", orbitKm: 227900000, diameterKm: 6779, tint: "rgba(222,140,110,0.96)" },
    { name: "Jupiter", orbitKm: 778500000, diameterKm: 139820, tint: "rgba(223,206,171,0.96)" },
    { name: "Saturn", orbitKm: 1433000000, diameterKm: 116460, tint: "rgba(228,214,173,0.96)" },
    { name: "Uranus", orbitKm: 2872000000, diameterKm: 50724, tint: "rgba(164,230,230,0.95)" },
    { name: "Neptune", orbitKm: 4495000000, diameterKm: 49244, tint: "rgba(111,147,235,0.96)" },
    { name: "Pluto", orbitKm: 5906000000, diameterKm: 2377, tint: "rgba(208,206,196,0.92)" }
  ];

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    startTime: performance.now(),
    stars: [],
    dust: [],
    comets: [],
    systems: [],
    degradeLevel: 0
  };

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function mapRange(value, inMin, inMax, outMin, outMax) {
    const t = (value - inMin) / (inMax - inMin);
    return lerp(outMin, outMax, clamp(t, 0, 1));
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    state.dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    state.width = Math.max(1, Math.floor(rect.width));
    state.height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    rebuildField();
  }

  function rebuildField() {
    buildStars();
    buildDust();
    buildComets();
    buildSystems();
  }

  function buildStars() {
    state.stars = [];
    const w = state.width;
    const h = state.height;

    for (let i = 0; i < STARFIELD_COUNT; i += 1) {
      const depth = i % 3;
      state.stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: depth === 0 ? Math.random() * 0.7 + 0.2 : depth === 1 ? Math.random() * 1.0 + 0.35 : Math.random() * 1.3 + 0.6,
        alpha: depth === 0 ? Math.random() * 0.24 + 0.05 : depth === 1 ? Math.random() * 0.28 + 0.08 : Math.random() * 0.34 + 0.12,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.8 + 0.2
      });
    }
  }

  function buildDust() {
    state.dust = [];
    const w = state.width;
    const h = state.height;

    for (let i = 0; i < DUST_COUNT; i += 1) {
      state.dust.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 90 + 40,
        alpha: Math.random() * 0.028 + 0.007
      });
    }
  }

  function buildComets() {
    state.comets = [];
    const w = state.width;
    const h = state.height;

    for (let i = 0; i < COMET_COUNT; i += 1) {
      const fromLeft = i % 2 === 0;
      state.comets.push({
        x0: fromLeft ? -Math.random() * w * 0.25 : w + Math.random() * w * 0.25,
        y0: Math.random() * h * 0.82,
        direction: fromLeft ? 1 : -1,
        speed: Math.random() * 28 + 18,
        trail: Math.random() * 100 + 80,
        phase: Math.random() * 1500
      });
    }
  }

  function getDiamondAnchors(cx, cy, spacing) {
    return {
      N:  { x: cx, y: cy - spacing * 1.38 },
      NE: { x: cx + spacing, y: cy - spacing * 0.69 },
      E:  { x: cx + spacing * 1.38, y: cy },
      SE: { x: cx + spacing, y: cy + spacing * 0.69 },
      S:  { x: cx, y: cy + spacing * 1.38 },
      SW: { x: cx - spacing, y: cy + spacing * 0.69 },
      W:  { x: cx - spacing * 1.38, y: cy },
      NW: { x: cx - spacing, y: cy - spacing * 0.69 },
      C:  { x: cx, y: cy }
    };
  }

  function buildSystems() {
    state.systems = [];

    const w = state.width;
    const h = state.height;
    const cx = w * 0.5;
    const cy = h * 0.54;
    const spacing = Math.min(w, h) * 0.17;
    const anchors = getDiamondAnchors(cx, cy, spacing);

    for (let i = 0; i < CHRONO_ORDER.length; i += 1) {
      const order = CHRONO_ORDER[i];
      const anchor = anchors[order.anchor];
      const starStrength = order.starStrength;

      const systemRadius = lerp(32, 56, 1 - order.ageBias);
      const glowRadius = lerp(18, 34, starStrength);
      const starRadius = lerp(2.6, 5.4, starStrength);

      const planets = REFERENCE_SOLAR_LAYOUT.map((planet, index) => {
        const macroOrbit = mapRange(
          planet.orbitKm,
          REFERENCE_SOLAR_LAYOUT[0].orbitKm,
          REFERENCE_SOLAR_LAYOUT[REFERENCE_SOLAR_LAYOUT.length - 1].orbitKm,
          systemRadius * 0.34,
          systemRadius
        );

        const sizePx = mapRange(
          planet.diameterKm,
          2377,
          139820,
          1.15,
          3.6
        );

        const angularOffset = order.rank * 0.18 + index * 0.43;

        return {
          name: planet.name,
          orbitKm: planet.orbitKm,
          diameterKm: planet.diameterKm,
          renderOrbit: macroOrbit,
          renderSize: sizePx,
          tint: planet.tint,
          angle: angularOffset,
          speed: 0.035 / (1 + index * 0.22)
        };
      });

      state.systems.push({
        anchor: order.anchor,
        chronoRank: order.rank,
        starStrength,
        ageBias: order.ageBias,
        x: anchor.x,
        y: anchor.y,
        starRadius,
        glowRadius,
        systemRadius,
        planets,
        scaleModel: {
          universeKm: SCALE.universeKm,
          systemKm: SCALE.systemKm,
          localSystemViewKm: SCALE.localSystemViewKm,
          planetZoomViewKm: SCALE.planetZoomViewKm
        }
      });
    }
  }

  function updateDegradeLevel() {
    const shortSide = Math.min(state.width, state.height);
    if (shortSide < 540) {
      state.degradeLevel = 2;
    } else if (shortSide < 760) {
      state.degradeLevel = 1;
    } else {
      state.degradeLevel = 0;
    }
  }

  function drawBackground() {
    const w = state.width;
    const h = state.height;

    const bg = ctx.createRadialGradient(w * 0.5, h * 0.52, 0, w * 0.5, h * 0.52, Math.max(w, h) * 0.66);
    bg.addColorStop(0, "#102041");
    bg.addColorStop(0.42, "#081229");
    bg.addColorStop(1, "#040814");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    drawNebula(w * 0.22, h * 0.28, Math.min(w, h) * 0.30, "rgba(103,79,182,0.14)");
    drawNebula(w * 0.74, h * 0.68, Math.min(w, h) * 0.25, "rgba(52,128,197,0.11)");
    drawNebula(w * 0.56, h * 0.42, Math.min(w, h) * 0.19, "rgba(255,255,255,0.035)");
  }

  function drawNebula(x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(0.42, color.replace(/0\.\d+\)/, "0.050)"));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawDust() {
    if (state.degradeLevel >= 2) return;

    for (const d of state.dust) {
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius);
      g.addColorStop(0, `rgba(255,255,255,${d.alpha})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStars(elapsed) {
    for (const s of state.stars) {
      const flicker = 0.78 + 0.22 * Math.sin(elapsed * 0.0012 * s.speed + s.phase);
      ctx.globalAlpha = s.alpha * flicker;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawDiamondGuides() {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;

    const c = state.systems.find((s) => s.anchor === "C");
    const order = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];

    ctx.beginPath();
    for (let i = 0; i < order.length; i += 1) {
      const sys = state.systems.find((s) => s.anchor === order[i]);
      if (!sys) continue;
      if (i === 0) ctx.moveTo(sys.x, sys.y);
      else ctx.lineTo(sys.x, sys.y);
    }
    ctx.stroke();

    if (c) {
      for (const sys of state.systems) {
        if (sys.anchor === "C") continue;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(sys.x, sys.y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawComets(elapsed) {
    if (state.degradeLevel >= 1) return;

    for (const comet of state.comets) {
      const span = state.width * 1.8;
      const travel = ((elapsed * 0.001 * comet.speed) + comet.phase) % span;
      const x = comet.x0 + travel * comet.direction;
      const y = comet.y0 + Math.sin(elapsed * 0.00035 + comet.phase) * 24;
      const tx = x - comet.direction * comet.trail;
      const ty = y + comet.trail * 0.06;

      const g = ctx.createLinearGradient(x, y, tx, ty);
      g.addColorStop(0, "rgba(255,255,255,0.92)");
      g.addColorStop(0.18, "rgba(200,224,255,0.46)");
      g.addColorStop(1, "rgba(200,224,255,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.35;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawScaleFrame() {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const sys of state.systems) {
      minX = Math.min(minX, sys.x - sys.systemRadius - 24);
      minY = Math.min(minY, sys.y - sys.systemRadius - 24);
      maxX = Math.max(maxX, sys.x + sys.systemRadius + 24);
      maxY = Math.max(maxY, sys.y + sys.systemRadius + 24);
    }

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    ctx.restore();
  }

  function drawSystem(sys, elapsed) {
    const pulse = 0.93 + 0.07 * Math.sin(elapsed * 0.0011 + sys.starStrength * 9.0);
    const glowRadius = sys.glowRadius * pulse;

    const glow = ctx.createRadialGradient(sys.x, sys.y, 0, sys.x, sys.y, glowRadius);
    glow.addColorStop(0, `rgba(255,244,215,${0.62 * sys.starStrength + 0.20})`);
    glow.addColorStop(0.34, `rgba(255,214,154,${0.18 * sys.starStrength + 0.08})`);
    glow.addColorStop(1, "rgba(255,214,154,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sys.x, sys.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < sys.planets.length; i += 1) {
      const planet = sys.planets[i];
      const orbitYScale = 0.62;
      const theta = planet.angle + elapsed * 0.001 * planet.speed;
      const px = sys.x + Math.cos(theta) * planet.renderOrbit;
      const py = sys.y + Math.sin(theta) * planet.renderOrbit * orbitYScale;

      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      ctx.beginPath();
      ctx.ellipse(sys.x, sys.y, planet.renderOrbit, planet.renderOrbit * orbitYScale, 0, 0, Math.PI * 2);
      ctx.stroke();

      if (!(state.degradeLevel >= 2 && i > 5)) {
        ctx.fillStyle = planet.tint;
        ctx.beginPath();
        ctx.arc(px, py, planet.renderSize, 0, Math.PI * 2);
        ctx.fill();
      }

      if (planet.name === "Saturn" && state.degradeLevel === 0) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(0.32);
        ctx.strokeStyle = "rgba(234,223,189,0.58)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, planet.renderSize * 2.15, planet.renderSize * 0.85, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.fillStyle = "#fff4dd";
    ctx.beginPath();
    ctx.arc(sys.x, sys.y, sys.starRadius * pulse, 0, Math.PI * 2);
    ctx.fill();

    drawStarCross(sys.x, sys.y, sys.starRadius * 3.4, 0.15 + sys.starStrength * 0.14);

    ctx.fillStyle = "rgba(231,238,255,0.92)";
    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${sys.anchor} · ${sys.chronoRank}`, sys.x, sys.y - sys.systemRadius - 11);

    if (state.degradeLevel === 0) {
      ctx.fillStyle = "rgba(154,174,210,0.82)";
      ctx.font = "10px Arial";
      ctx.fillText(`9 planets`, sys.x, sys.y + sys.systemRadius + 15);
    }
  }

  function drawStarCross(x, y, r, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(255,244,220,${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.moveTo(x, y - r);
    ctx.lineTo(x, y + r);
    ctx.stroke();
    ctx.restore();
  }

  function render(now) {
    updateDegradeLevel();

    const elapsed = now - state.startTime;

    drawBackground();
    drawDust();
    drawStars(elapsed);
    drawDiamondGuides();
    drawComets(elapsed);

    for (const sys of state.systems) {
      drawSystem(sys, elapsed);
    }

    drawScaleFrame();

    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize, { passive: true });

  resize();
  requestAnimationFrame(render);
})();
