DESTINATION: /index.js
(() => {
  "use strict";

  const canvas = document.getElementById("scene");
  if (!canvas) {
    throw new Error("Compass baseline requires #scene canvas");
  }

  const existingFrame = window.__COMPASS_BASELINE_RAF__;
  if (typeof existingFrame === "number") {
    cancelAnimationFrame(existingFrame);
  }

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!ctx) {
    throw new Error("2D canvas context unavailable");
  }

  const DPR_CAP = 2;
  const STARFIELD_COUNT = 700;
  const DUST_COUNT = 140;
  const COMET_COUNT = 4;

  const SCALE = {
    universeKm: 256000000000,
    systemKm: 256000000,
    localSystemViewKm: 256000,
    planetZoomViewKm: 26500
  };

  const REFERENCE_SOLAR_LAYOUT = [
    { name: "Mercury", orbitKm: 57910000, diameterKm: 4879, color: "#c7d0df" },
    { name: "Venus", orbitKm: 108200000, diameterKm: 12104, color: "#ecd39e" },
    { name: "Earth", orbitKm: 149600000, diameterKm: 12742, color: "#8db6ff" },
    { name: "Mars", orbitKm: 227900000, diameterKm: 6779, color: "#d88b6f" },
    { name: "Jupiter", orbitKm: 778500000, diameterKm: 139820, color: "#e0d0ab" },
    { name: "Saturn", orbitKm: 1433000000, diameterKm: 116460, color: "#ead9a6" },
    { name: "Uranus", orbitKm: 2872000000, diameterKm: 50724, color: "#a6e3ea" },
    { name: "Neptune", orbitKm: 4495000000, diameterKm: 49244, color: "#7795ec" },
    { name: "Pluto", orbitKm: 5906000000, diameterKm: 2377, color: "#d8d1c7" }
  ];

  const CHRONO_SYSTEMS = [
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

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    startedAt: performance.now(),
    stars: [],
    dust: [],
    comets: [],
    systems: [],
    degradeLevel: 0,
    raf: null,
    hudMask: null,
    layout: null
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function mapRange(value, inMin, inMax, outMin, outMax) {
    const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
    return lerp(outMin, outMax, t);
  }

  function updateDegradeLevel() {
    const shortSide = Math.min(state.width, state.height);
    if (shortSide < 520) {
      state.degradeLevel = 2;
    } else if (shortSide < 760) {
      state.degradeLevel = 1;
    } else {
      state.degradeLevel = 0;
    }
  }

  function getDiamondAnchors(cx, cy, spacing) {
    return {
      N: { x: cx, y: cy - spacing * 1.38 },
      NE: { x: cx + spacing, y: cy - spacing * 0.69 },
      E: { x: cx + spacing * 1.38, y: cy },
      SE: { x: cx + spacing, y: cy + spacing * 0.69 },
      S: { x: cx, y: cy + spacing * 1.38 },
      SW: { x: cx - spacing, y: cy + spacing * 0.69 },
      W: { x: cx - spacing * 1.38, y: cy },
      NW: { x: cx - spacing, y: cy - spacing * 0.69 },
      C: { x: cx, y: cy }
    };
  }

  function readHudMask() {
    const panels = Array.from(document.querySelectorAll(".title-block,.legend,.scale-panel,.status"));
    if (!panels.length) {
      state.hudMask = {
        topLimit: state.height * 0.20,
        bottomLimit: state.height * 0.80,
        topRects: [],
        bottomRects: []
      };
      return;
    }

    const topRects = [];
    const bottomRects = [];

    for (const el of panels) {
      const rect = el.getBoundingClientRect();
      const box = {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      };
      if (box.top < state.height * 0.45) {
        topRects.push(box);
      } else {
        bottomRects.push(box);
      }
    }

    const topLimit = topRects.length
      ? Math.max(...topRects.map((r) => r.bottom)) + 22
      : state.height * 0.20;

    const bottomLimit = bottomRects.length
      ? Math.min(...bottomRects.map((r) => r.top)) - 24
      : state.height * 0.82;

    state.hudMask = {
      topLimit,
      bottomLimit,
      topRects,
      bottomRects
    };
  }

  function computeLayout() {
    readHudMask();

    const mobile = state.width < 760;
    const hudTop = state.hudMask ? state.hudMask.topLimit : state.height * 0.20;
    const hudBottom = state.hudMask ? state.hudMask.bottomLimit : state.height * 0.82;
    const usableTop = clamp(hudTop + 24, state.height * 0.18, state.height * 0.52);
    const usableBottom = clamp(hudBottom - 24, state.height * 0.48, state.height * 0.86);

    let centerY = (usableTop + usableBottom) * 0.5;
    if (usableBottom <= usableTop + 40) {
      centerY = state.height * (mobile ? 0.52 : 0.50);
    }

    const verticalBand = Math.max(usableBottom - usableTop, state.height * (mobile ? 0.22 : 0.30));
    const horizontalBand = state.width * (mobile ? 0.74 : 0.64);

    let spacingFromVertical = verticalBand / 2.76;
    let spacingFromHorizontal = horizontalBand / 2.76;
    let spacing = Math.min(spacingFromVertical, spacingFromHorizontal);
    spacing = clamp(
      spacing,
      Math.min(state.width, state.height) * (mobile ? 0.12 : 0.13),
      Math.min(state.width, state.height) * (mobile ? 0.19 : 0.21)
    );

    const maxNorth = centerY - spacing * 1.38;
    const maxSouth = centerY + spacing * 1.38;

    if (maxNorth < usableTop) {
      centerY += usableTop - maxNorth;
    }
    if (maxSouth > usableBottom) {
      centerY -= maxSouth - usableBottom;
    }

    centerY = clamp(centerY, state.height * 0.24, state.height * 0.72);

    const centerX = state.width * 0.5;

    state.layout = {
      mobile,
      centerX,
      centerY,
      spacing,
      usableTop,
      usableBottom,
      verticalBand
    };
  }

  function buildStars() {
    state.stars = [];
    for (let i = 0; i < STARFIELD_COUNT; i += 1) {
      const depth = i % 3;
      state.stars.push({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        radius: depth === 0 ? Math.random() * 0.7 + 0.25 : depth === 1 ? Math.random() * 0.9 + 0.45 : Math.random() * 1.2 + 0.7,
        alpha: depth === 0 ? Math.random() * 0.18 + 0.05 : depth === 1 ? Math.random() * 0.22 + 0.08 : Math.random() * 0.26 + 0.12,
        speed: Math.random() * 0.9 + 0.2,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function buildDust() {
    state.dust = [];
    for (let i = 0; i < DUST_COUNT; i += 1) {
      state.dust.push({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        radius: Math.random() * 60 + 30,
        alpha: Math.random() * 0.02 + 0.005
      });
    }
  }

  function buildComets() {
    state.comets = [];
    for (let i = 0; i < COMET_COUNT; i += 1) {
      const leftToRight = i % 2 === 0;
      state.comets.push({
        startX: leftToRight ? -Math.random() * state.width * 0.25 : state.width + Math.random() * state.width * 0.25,
        startY: Math.random() * state.height * 0.82,
        direction: leftToRight ? 1 : -1,
        speed: Math.random() * 22 + 14,
        trail: Math.random() * 90 + 70,
        phase: Math.random() * 1000
      });
    }
  }

  function buildSystems() {
    state.systems = [];

    computeLayout();
    const { centerX, centerY, spacing, mobile } = state.layout;
    const anchors = getDiamondAnchors(centerX, centerY, spacing);

    for (const systemMeta of CHRONO_SYSTEMS) {
      const anchor = anchors[systemMeta.anchor];
      const strength = systemMeta.starStrength;

      const systemRadius = lerp(mobile ? 46 : 52, mobile ? 72 : 84, 1 - systemMeta.ageBias);
      const glowRadius = lerp(mobile ? 34 : 38, mobile ? 64 : 72, strength);
      const starRadius = lerp(mobile ? 5.2 : 5.8, mobile ? 10.8 : 12.0, strength);

      const planets = REFERENCE_SOLAR_LAYOUT.map((planet, index) => {
        const renderOrbit = mapRange(
          planet.orbitKm,
          REFERENCE_SOLAR_LAYOUT[0].orbitKm,
          REFERENCE_SOLAR_LAYOUT[REFERENCE_SOLAR_LAYOUT.length - 1].orbitKm,
          systemRadius * 0.24,
          systemRadius
        );

        const renderSize = mapRange(
          planet.diameterKm,
          2377,
          139820,
          mobile ? 1.8 : 2.0,
          mobile ? 5.4 : 5.8
        );

        return {
          name: planet.name,
          orbitKm: planet.orbitKm,
          diameterKm: planet.diameterKm,
          renderOrbit,
          renderSize,
          color: planet.color,
          angle: systemMeta.rank * 0.16 + index * 0.46,
          speed: 0.030 / (1 + index * 0.22)
        };
      });

      state.systems.push({
        anchor: systemMeta.anchor,
        rank: systemMeta.rank,
        starStrength: strength,
        ageBias: systemMeta.ageBias,
        x: anchor.x,
        y: anchor.y,
        systemRadius,
        glowRadius,
        starRadius,
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

  function rebuildScene() {
    updateDegradeLevel();
    buildStars();
    buildDust();
    buildComets();
    buildSystems();
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    state.dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    state.width = Math.max(1, Math.floor(rect.width));
    state.height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    rebuildScene();
  }

  function drawBackground() {
    const w = state.width;
    const h = state.height;

    const radial = ctx.createRadialGradient(w * 0.5, h * 0.46, 0, w * 0.5, h * 0.46, Math.max(w, h) * 0.74);
    radial.addColorStop(0, "#163468");
    radial.addColorStop(0.32, "#0b1937");
    radial.addColorStop(1, "#030712");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, w, h);

    drawNebula(w * 0.22, h * 0.28, Math.min(w, h) * 0.22, "rgba(122,88,220,0.11)");
    drawNebula(w * 0.76, h * 0.70, Math.min(w, h) * 0.20, "rgba(58,132,210,0.09)");
    drawNebula(w * 0.54, h * 0.44, Math.min(w, h) * 0.16, "rgba(255,255,255,0.025)");
  }

  function drawNebula(x, y, radius, color) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.42, color.replace(/0\.\d+\)/, "0.040)"));
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawStars(elapsed) {
    for (const star of state.stars) {
      const flicker = 0.82 + 0.18 * Math.sin(elapsed * 0.0012 * star.speed + star.phase);
      ctx.globalAlpha = star.alpha * flicker;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawDust() {
    if (state.degradeLevel >= 2) return;

    for (const cloud of state.dust) {
      const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
      gradient.addColorStop(0, `rgba(255,255,255,${cloud.alpha})`);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawComets(elapsed) {
    if (state.degradeLevel >= 1) return;

    const travelSpan = state.width * 1.6;
    for (const comet of state.comets) {
      const travel = ((elapsed * 0.001 * comet.speed) + comet.phase) % travelSpan;
      const x = comet.startX + travel * comet.direction;
      const y = comet.startY + Math.sin(elapsed * 0.0004 + comet.phase) * 18;
      const tailX = x - comet.direction * comet.trail;
      const tailY = y + comet.trail * 0.05;

      const gradient = ctx.createLinearGradient(x, y, tailX, tailY);
      gradient.addColorStop(0, "rgba(255,255,255,0.92)");
      gradient.addColorStop(0.20, "rgba(196,223,255,0.42)");
      gradient.addColorStop(1, "rgba(196,223,255,0)");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawDiamondGuides() {
    const center = state.systems.find((system) => system.anchor === "C");
    if (!center) return;

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1.2;

    const ringOrder = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    ctx.beginPath();
    for (let i = 0; i < ringOrder.length; i += 1) {
      const system = state.systems.find((item) => item.anchor === ringOrder[i]);
      if (!system) continue;
      if (i === 0) ctx.moveTo(system.x, system.y);
      else ctx.lineTo(system.x, system.y);
    }
    ctx.stroke();

    for (const system of state.systems) {
      if (system.anchor === "C") continue;
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(system.x, system.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawScaleFrame() {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const system of state.systems) {
      minX = Math.min(minX, system.x - system.systemRadius - 28);
      minY = Math.min(minY, system.y - system.systemRadius - 28);
      maxX = Math.max(maxX, system.x + system.systemRadius + 28);
      maxY = Math.max(maxY, system.y + system.systemRadius + 28);
    }

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    ctx.restore();
  }

  function drawStarCross(x, y, radius, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(255,245,220,${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x, y + radius);
    ctx.stroke();
    ctx.restore();
  }

  function drawSystem(system, elapsed) {
    const pulse = 0.94 + 0.06 * Math.sin(elapsed * 0.0011 + system.starStrength * 9);
    const glowRadius = system.glowRadius * pulse;

    const glow = ctx.createRadialGradient(system.x, system.y, 0, system.x, system.y, glowRadius);
    glow.addColorStop(0, `rgba(255,244,214,${0.72 * system.starStrength + 0.26})`);
    glow.addColorStop(0.32, `rgba(255,215,150,${0.24 * system.starStrength + 0.12})`);
    glow.addColorStop(1, "rgba(255,215,150,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(system.x, system.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < system.planets.length; i += 1) {
      const planet = system.planets[i];
      const orbitYScale = 0.62;
      const theta = planet.angle + elapsed * 0.001 * planet.speed;
      const px = system.x + Math.cos(theta) * planet.renderOrbit;
      const py = system.y + Math.sin(theta) * planet.renderOrbit * orbitYScale;

      ctx.strokeStyle = "rgba(255,255,255,0.080)";
      ctx.beginPath();
      ctx.ellipse(system.x, system.y, planet.renderOrbit, planet.renderOrbit * orbitYScale, 0, 0, Math.PI * 2);
      ctx.stroke();

      if (!(state.degradeLevel >= 2 && i > 5)) {
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(px, py, planet.renderSize, 0, Math.PI * 2);
        ctx.fill();
      }

      if (planet.name === "Saturn" && state.degradeLevel === 0) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(0.34);
        ctx.strokeStyle = "rgba(234,223,189,0.72)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, planet.renderSize * 2.0, planet.renderSize * 0.82, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.fillStyle = "#fff4dd";
    ctx.beginPath();
    ctx.arc(system.x, system.y, system.starRadius * pulse, 0, Math.PI * 2);
    ctx.fill();

    drawStarCross(system.x, system.y, system.starRadius * 4.0, 0.18 + system.starStrength * 0.16);

    ctx.fillStyle = "rgba(233,239,255,0.96)";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${system.anchor} · ${system.rank}`, system.x, system.y - system.systemRadius - 14);

    if (state.degradeLevel <= 1) {
      ctx.fillStyle = "rgba(157,176,212,0.92)";
      ctx.font = state.degradeLevel === 0 ? "11px Arial" : "10px Arial";
      ctx.fillText("9 planets", system.x, system.y + system.systemRadius + 16);
    }
  }

  function render(now) {
    const elapsed = now - state.startedAt;

    drawBackground();
    drawDust();
    drawStars(elapsed);
    drawDiamondGuides();

    for (const system of state.systems) {
      drawSystem(system, elapsed);
    }

    drawComets(elapsed);
    drawScaleFrame();

    state.raf = requestAnimationFrame(render);
    window.__COMPASS_BASELINE_RAF__ = state.raf;
  }

  function start() {
    resize();
    if (state.raf) {
      cancelAnimationFrame(state.raf);
    }
    state.raf = requestAnimationFrame(render);
    window.__COMPASS_BASELINE_RAF__ = state.raf;
  }

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) {
      clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(() => {
      resize();
    }, 40);
  }, { passive: true });

  window.addEventListener("load", () => {
    resize();
  }, { passive: true });

  start();
})();
