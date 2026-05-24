// /showroom/globe/audralia/planet/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_PLANET_NOT_GEM_VISUAL_FIRST_PARENT_ROUTE_RENDERER_TNT_v1
//
// Purpose:
// - Renew Audralia as a continuous dry planet/world object.
// - Keep gem language assigned to beneath-planet navigation anchors, not planet body.
// - Preserve Body / Surface / Terrain / Lattice / Receipt inspection modes.
// - Preserve 16 x 16 coordinate/version/handoff receipt logic.
// - Fail open: HTML fallback planet, dropdown, anchors, and chambers remain usable without this file.
// - No generated image. No GraphicBox. No active water. No hydration. No final visual pass.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_PLANET_NOT_GEM_VISUAL_FIRST_PARENT_ROUTE_RENDERER_TNT_v1";
  const HTML_CONTRACT = "AUDRALIA_G2_PLANET_NOT_GEM_VISUAL_FIRST_PARENT_ROUTE_HTML_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/planet/";
  const FILE = "/showroom/globe/audralia/planet/index.js";

  const TAU = Math.PI * 2;
  const COORDINATE_COUNT = 16;
  const VERSION_COUNT = 16;
  const SEAT_COUNT = 256;

  const COORDINATES = Object.freeze([
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ]);

  const VERSION_NAMES = Object.freeze([
    "Origin", "Body", "Stability", "Copper", "Dry Memory", "Settling", "Ridge", "Basin",
    "Lattice", "Address", "Chronology", "Pressure", "Water Held", "Receipt", "Audit", "Seal"
  ]);

  const MODE_COPY = Object.freeze({
    body: {
      title: "Body",
      status: "DRY PLANET · CONTINUOUS WORLD BODY",
      platform: "Audralia now reads as a dry planet first. The coordinate system still exists underneath, but the first object is a world body, not a gemstone.",
      engineering: "Body mode suppresses lattice and gem styling. The renderer prioritizes spherical mass, dry material, soft limb shading, and fail-open continuity."
    },
    surface: {
      title: "Surface",
      status: "DRY MATERIAL · SURFACE CHILD HELD",
      platform: "Surface mode gives the planet dry mineral skin and readable world-material variation without claiming final surface authority.",
      engineering: "Surface expression is route-level only. The future surface child remains held and is not activated by this parent route."
    },
    terrain: {
      title: "Terrain",
      status: "RELIEF INTENT · TERRAIN CHILD HELD",
      platform: "Terrain mode emphasizes ridges, basin memory, and pressure regions so the world feels carved rather than flat.",
      engineering: "Terrain mode uses renderer-level relief cues only. Canonical terrain truth remains downstream and held."
    },
    lattice: {
      title: "Lattice",
      status: "16 × 16 · 256 ADDRESSABLE STATES",
      platform: "Lattice mode reveals the coordinate structure behind the planet while preserving the globe silhouette.",
      engineering: "Sixteen coordinate identities and sixteen version identities produce 256 seats. Every seat carries identity, duty, and handoff."
    },
    receipt: {
      title: "Receipt",
      status: "HANDOFF PROOF · FINAL PASS FALSE",
      platform: "Receipt mode shows what is defined, held, blocked, pending, and confirmed without replacing the planet.",
      engineering: "Receipt mode publishes route-level proof. Active water, hydration, child truth, and final visual pass remain false."
    }
  });

  const state = {
    mode: "body",
    stage: null,
    canvas: null,
    ctx: null,
    fallback: null,
    statusNode: null,
    titleNode: null,
    modeStatusNode: null,
    platformNode: null,
    engineeringNode: null,
    width: 0,
    height: 0,
    dpr: 1,
    yaw: -0.55,
    pitch: -0.08,
    velocityYaw: 0.00072,
    velocityPitch: 0,
    dragging: false,
    pointerX: 0,
    pointerY: 0,
    lastTap: 0,
    frame: 0,
    renderCount: 0,
    lastFrameTime: 0,
    seats: [],
    initialized: false,
    canvasReady: false,
    rendererReady: false,
    touchReady: false,
    errors: [],
    activeWater: false,
    hydrationLoaded: false,
    terrainChildLoaded: false,
    surfaceChildLoaded: false,
    datumChildLoaded: false,
    finalVisualPass: false
  };

  function clamp(value, min, max) {
    const n = Number(value);
    const v = Number.isFinite(n) ? n : min;
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function mix(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t))
    ];
  }

  function rgba(color, alpha) {
    return `rgba(${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])},${clamp(alpha, 0, 1)})`;
  }

  function hashNoise(a, b, c = 0) {
    const x = Math.sin((a + 19.17) * 127.1 + (b + 31.91) * 311.7 + (c + 7.63) * 74.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function smoothNoise(lon, lat) {
    const a = Math.sin(lon * 2.1 + Math.sin(lat * 3.2) * 0.8);
    const b = Math.sin(lon * 4.7 - lat * 1.4);
    const c = Math.cos(lon * 7.3 + lat * 5.5);
    const d = Math.sin((lon + lat) * 9.1);
    return (a * 0.42 + b * 0.28 + c * 0.20 + d * 0.10);
  }

  function terrainValue(lon, lat) {
    const belt = Math.cos(lat * 2.2) * 0.20;
    const ridge = Math.sin(lon * 3.2 + lat * 2.1) * 0.24;
    const basin = Math.cos(lon * 1.7 - lat * 4.3) * 0.20;
    const cellular = smoothNoise(lon, lat) * 0.36;
    return clamp(0.5 + belt + ridge + basin + cellular, 0, 1);
  }

  function surfaceColor(lon, lat, mode) {
    const elevation = terrainValue(lon, lat);
    const dryLow = [54, 57, 47];
    const dryMid = [112, 100, 67];
    const dryHigh = [177, 144, 86];
    const dryPeak = [210, 182, 115];
    const slate = [48, 66, 69];
    const greenMemory = [70, 96, 67];

    let base;
    if (elevation < 0.34) base = mix(slate, dryLow, elevation / 0.34);
    else if (elevation < 0.58) base = mix(dryLow, dryMid, (elevation - 0.34) / 0.24);
    else if (elevation < 0.78) base = mix(dryMid, dryHigh, (elevation - 0.58) / 0.20);
    else base = mix(dryHigh, dryPeak, (elevation - 0.78) / 0.22);

    const memory = Math.max(0, Math.sin(lon * 2.6 - lat * 3.1) * 0.5 + 0.5);
    base = mix(base, greenMemory, mode === "body" ? memory * 0.08 : memory * 0.16);

    if (mode === "surface") {
      base = mix(base, [194, 150, 93], 0.16);
    }

    if (mode === "terrain") {
      base = elevation > 0.65 ? mix(base, [214, 182, 118], 0.26) : mix(base, [57, 55, 47], 0.18);
    }

    if (mode === "lattice") {
      base = mix(base, [95, 160, 185], 0.18);
    }

    if (mode === "receipt") {
      base = mix(base, [190, 150, 93], 0.14);
    }

    return base;
  }

  function spherePoint(lon, lat) {
    const clat = Math.cos(lat);
    return {
      x: clat * Math.sin(lon),
      y: Math.sin(lat),
      z: clat * Math.cos(lon)
    };
  }

  function rotate(point) {
    let { x, y, z } = point;

    const cy = Math.cos(state.yaw);
    const sy = Math.sin(state.yaw);
    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    x = x1;
    z = z1;

    const cp = Math.cos(state.pitch);
    const sp = Math.sin(state.pitch);
    const y1 = y * cp - z * sp;
    const z2 = y * sp + z * cp;

    return { x, y: y1, z: z2 };
  }

  function project(point, radius) {
    const r = rotate(point);
    const perspective = 1 + r.z * 0.055;
    return {
      x: state.width / 2 + r.x * radius * perspective,
      y: state.height / 2 - r.y * radius * perspective,
      z: r.z,
      visible: r.z > -0.08
    };
  }

  function resizeCanvas() {
    if (!state.canvas) return;

    const rect = state.canvas.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width || 640));
    const height = Math.max(430, Math.floor(rect.height || 640));
    const dpr = Math.min(1.75, window.devicePixelRatio || 1);

    state.width = Math.floor(width * dpr);
    state.height = Math.floor(height * dpr);
    state.dpr = dpr;

    if (state.canvas.width !== state.width) state.canvas.width = state.width;
    if (state.canvas.height !== state.height) state.canvas.height = state.height;
  }

  function radius() {
    return Math.min(state.width, state.height) * 0.365;
  }

  function drawAtmosphere(ctx, cx, cy, r) {
    const aura = ctx.createRadialGradient(cx, cy, r * 0.72, cx, cy, r * 1.52);
    aura.addColorStop(0, "rgba(141,216,255,0.06)");
    aura.addColorStop(0.45, "rgba(141,216,255,0.13)");
    aura.addColorStop(0.74, "rgba(244,207,131,0.045)");
    aura.addColorStop(1, "rgba(141,216,255,0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.52, 0, TAU);
    ctx.fill();
  }

  function drawBaseSphere(ctx, cx, cy, r) {
    const base = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.38, r * 0.06, cx, cy, r * 1.08);
    base.addColorStop(0, "rgba(255,244,216,.48)");
    base.addColorStop(0.18, "rgba(174,145,86,.96)");
    base.addColorStop(0.44, "rgba(90,96,64,.98)");
    base.addColorStop(0.70, "rgba(45,61,58,1)");
    base.addColorStop(1, "rgba(4,9,21,1)");

    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fill();
  }

  function drawSurface(ctx, r) {
    const lonSteps = state.mode === "body" ? 88 : 104;
    const latSteps = state.mode === "body" ? 44 : 52;
    const lonStart = -Math.PI;
    const latStart = -Math.PI / 2;
    const lonStep = TAU / lonSteps;
    const latStep = Math.PI / latSteps;

    for (let j = 0; j < latSteps; j += 1) {
      const latA = latStart + j * latStep;
      const latB = latA + latStep;

      for (let i = 0; i < lonSteps; i += 1) {
        const lonA = lonStart + i * lonStep;
        const lonB = lonA + lonStep;
        const midLon = (lonA + lonB) / 2;
        const midLat = (latA + latB) / 2;

        const pMid = rotate(spherePoint(midLon, midLat));
        if (pMid.z < -0.02) continue;

        const p1 = project(spherePoint(lonA, latA), r);
        const p2 = project(spherePoint(lonB, latA), r);
        const p3 = project(spherePoint(lonB, latB), r);
        const p4 = project(spherePoint(lonA, latB), r);

        const baseColor = surfaceColor(midLon, midLat, state.mode);
        const limb = clamp((pMid.z + 0.10) / 1.10, 0, 1);
        const light = clamp(0.46 + limb * 0.52 + (-pMid.y + 1) * 0.05, 0.22, 1.08);
        const alpha = state.mode === "body" ? 0.72 : state.mode === "surface" ? 0.82 : state.mode === "terrain" ? 0.88 : 0.36;
        const color = [baseColor[0] * light, baseColor[1] * light, baseColor[2] * light];

        ctx.fillStyle = rgba(color, alpha);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  function drawTerrainContours(ctx, r) {
    if (state.mode !== "terrain" && state.mode !== "surface") return;

    ctx.save();
    ctx.lineWidth = Math.max(0.75, r * 0.003);
    ctx.strokeStyle = state.mode === "terrain" ? "rgba(255,232,163,.18)" : "rgba(255,244,216,.075)";

    const bands = state.mode === "terrain" ? 18 : 12;
    for (let k = 0; k < bands; k += 1) {
      const lat = -1.08 + k * (2.16 / Math.max(1, bands - 1));
      ctx.beginPath();
      let drawing = false;

      for (let i = 0; i <= 160; i += 1) {
        const lon = -Math.PI + i * (TAU / 160);
        const offset = Math.sin(lon * 2.3 + k * 0.75) * 0.035;
        const p = project(spherePoint(lon, lat + offset), r);

        if (!p.visible) {
          drawing = false;
          continue;
        }

        if (!drawing) {
          ctx.moveTo(p.x, p.y);
          drawing = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawLattice(ctx, r) {
    if (state.mode !== "lattice" && state.mode !== "receipt") return;

    ctx.save();
    ctx.lineWidth = Math.max(0.65, r * 0.0024);

    for (let c = 0; c < COORDINATE_COUNT; c += 1) {
      const lon = -Math.PI + c * (TAU / COORDINATE_COUNT);
      ctx.strokeStyle = state.mode === "receipt" ? "rgba(244,207,131,.16)" : "rgba(141,216,255,.24)";
      ctx.beginPath();
      let drawing = false;

      for (let i = 0; i <= 90; i += 1) {
        const lat = -Math.PI / 2 + i * (Math.PI / 90);
        const p = project(spherePoint(lon, lat), r);

        if (!p.visible) {
          drawing = false;
          continue;
        }

        if (!drawing) {
          ctx.moveTo(p.x, p.y);
          drawing = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }

      ctx.stroke();
    }

    for (let v = 1; v < VERSION_COUNT - 1; v += 1) {
      const lat = -Math.PI / 2 + v * (Math.PI / VERSION_COUNT);
      ctx.strokeStyle = state.mode === "receipt" ? "rgba(255,232,163,.10)" : "rgba(255,232,163,.16)";
      ctx.beginPath();
      let drawing = false;

      for (let i = 0; i <= 160; i += 1) {
        const lon = -Math.PI + i * (TAU / 160);
        const p = project(spherePoint(lon, lat), r);

        if (!p.visible) {
          drawing = false;
          continue;
        }

        if (!drawing) {
          ctx.moveTo(p.x, p.y);
          drawing = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }

      ctx.stroke();
    }

    for (const seat of state.seats) {
      const p = project(spherePoint(seat.lon, seat.lat), r);
      if (!p.visible) continue;

      const major = seat.coordinateIndex % 4 === 0 || seat.versionIndex % 4 === 0;
      const dotRadius = Math.max(1.45, r * (major ? 0.009 : 0.006));

      ctx.fillStyle = state.mode === "receipt"
        ? rgba(seat.receiptColor, major ? 0.92 : 0.58)
        : rgba(seat.coordinateColor, major ? 0.82 : 0.52);

      ctx.beginPath();
      ctx.arc(p.x, p.y, dotRadius, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawReceiptBands(ctx, cx, cy, r) {
    if (state.mode !== "receipt") return;

    ctx.save();
    ctx.strokeStyle = "rgba(244,207,131,.34)";
    ctx.lineWidth = Math.max(1, r * 0.005);
    ctx.setLineDash([r * 0.042, r * 0.022]);
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.055, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  function drawShade(ctx, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.clip();

    const shade = ctx.createRadialGradient(cx + r * 0.58, cy + r * 0.48, r * 0.02, cx, cy, r * 1.08);
    shade.addColorStop(0, "rgba(0,0,0,.46)");
    shade.addColorStop(0.44, "rgba(0,0,0,.18)");
    shade.addColorStop(0.72, "rgba(0,0,0,.04)");
    shade.addColorStop(1, "rgba(0,0,0,.56)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const highlight = ctx.createRadialGradient(cx - r * 0.36, cy - r * 0.42, 0, cx - r * 0.28, cy - r * 0.30, r * 0.70);
    highlight.addColorStop(0, "rgba(255,255,255,.18)");
    highlight.addColorStop(0.42, "rgba(255,244,216,.06)");
    highlight.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = highlight;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    ctx.strokeStyle = "rgba(190,232,255,.24)";
    ctx.lineWidth = Math.max(1, r * 0.005);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.stroke();
  }

  function drawModeLabel(ctx, cx, cy, r) {
    const copy = MODE_COPY[state.mode];

    ctx.save();
    ctx.font = `${Math.max(10, r * 0.04)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,244,216,.72)";
    ctx.fillText(copy.status, cx, cy + r * 1.22);
    ctx.restore();
  }

  function render() {
    if (!state.ctx || !state.canvasReady) return;

    resizeCanvas();

    const ctx = state.ctx;
    const cx = state.width / 2;
    const cy = state.height / 2;
    const r = radius();

    ctx.clearRect(0, 0, state.width, state.height);

    drawAtmosphere(ctx, cx, cy, r);
    drawBaseSphere(ctx, cx, cy, r);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.clip();
    drawSurface(ctx, r);
    drawTerrainContours(ctx, r);
    drawLattice(ctx, r);
    ctx.restore();

    drawReceiptBands(ctx, cx, cy, r);
    drawShade(ctx, cx, cy, r);
    drawModeLabel(ctx, cx, cy, r);

    state.renderCount += 1;
    publishReceipt("render");
  }

  function setMode(mode) {
    const nextMode = MODE_COPY[mode] ? mode : "body";
    state.mode = nextMode;

    const copy = MODE_COPY[nextMode];

    document.documentElement.dataset.audraliaPlanetMode = nextMode;
    if (document.body) document.body.dataset.audraliaPlanetMode = nextMode;

    document.querySelectorAll("[data-audralia-mode]").forEach((button) => {
      const active = button.dataset.audraliaMode === nextMode;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.toggleAttribute("data-active", active);
    });

    if (state.titleNode) state.titleNode.textContent = copy.title;
    if (state.modeStatusNode) state.modeStatusNode.textContent = copy.status;
    if (state.platformNode) state.platformNode.textContent = copy.platform;
    if (state.engineeringNode) state.engineeringNode.textContent = copy.engineering;

    render();
    publishReceipt(`mode:${nextMode}`);
  }

  function resetPlanet() {
    state.yaw = -0.55;
    state.pitch = -0.08;
    state.velocityYaw = 0.00072;
    state.velocityPitch = 0;
    render();
  }

  function step(timestamp) {
    const dt = state.lastFrameTime ? clamp((timestamp - state.lastFrameTime) / 1000, 0, 0.05) : 0;
    state.lastFrameTime = timestamp;

    if (!state.dragging) {
      state.yaw += state.velocityYaw * dt * 60;
      state.pitch += state.velocityPitch * dt * 60;

      const damping = Math.pow(0.945, dt * 60);
      state.velocityYaw *= damping;
      state.velocityPitch *= damping;

      if (Math.abs(state.velocityYaw) < 0.00002) state.velocityYaw = 0.00042;
      if (Math.abs(state.velocityPitch) < 0.00002) state.velocityPitch = 0;
    }

    state.pitch = clamp(state.pitch, -0.82, 0.82);
    render();
    window.requestAnimationFrame(step);
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.style.touchAction = "none";

    state.stage.addEventListener("pointerdown", (event) => {
      const now = performance.now();

      if (now - state.lastTap < 320) resetPlanet();
      state.lastTap = now;

      state.dragging = true;
      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
      state.velocityYaw = 0;
      state.velocityPitch = 0;

      try {
        state.stage.setPointerCapture?.(event.pointerId);
        event.preventDefault();
      } catch (_error) {}
    }, { passive: false });

    state.stage.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;

      const dx = event.clientX - state.pointerX;
      const dy = event.clientY - state.pointerY;

      state.pointerX = event.clientX;
      state.pointerY = event.clientY;

      state.yaw += dx * 0.0082;
      state.pitch = clamp(state.pitch + dy * 0.0048, -0.82, 0.82);
      state.velocityYaw = clamp(dx * 0.00165, -0.045, 0.045);
      state.velocityPitch = clamp(dy * 0.00095, -0.024, 0.024);

      try {
        event.preventDefault();
      } catch (_error) {}
    }, { passive: false });

    const release = (event) => {
      if (!state.dragging) return;
      state.dragging = false;

      try {
        state.stage.releasePointerCapture?.(event.pointerId);
      } catch (_error) {}
    };

    state.stage.addEventListener("pointerup", release, { passive: true });
    state.stage.addEventListener("pointercancel", release, { passive: true });
    state.stage.addEventListener("pointerleave", release, { passive: true });

    state.touchReady = true;
  }

  function buildSeats() {
    const coordinateColors = [
      [244, 207, 131], [238, 225, 154], [157, 218, 244], [93, 196, 245],
      [76, 217, 239], [95, 232, 174], [120, 211, 126], [91, 139, 88],
      [203, 139, 74], [208, 100, 76], [186, 74, 70], [172, 94, 184],
      [156, 128, 244], [98, 105, 216], [132, 172, 245], [232, 225, 195]
    ];

    const receiptColors = [
      [167, 243, 198], [167, 243, 198], [167, 243, 198], [244, 207, 131],
      [244, 207, 131], [244, 207, 131], [244, 207, 131], [244, 207, 131],
      [141, 216, 255], [141, 216, 255], [141, 216, 255], [244, 207, 131],
      [255, 107, 107], [255, 107, 107], [255, 232, 163], [255, 232, 163]
    ];

    const seats = [];

    for (let c = 0; c < COORDINATE_COUNT; c += 1) {
      for (let v = 0; v < VERSION_COUNT; v += 1) {
        const lon = -Math.PI + (c / COORDINATE_COUNT) * TAU;
        const lat = -Math.PI / 2 + ((v + 0.5) / VERSION_COUNT) * Math.PI;
        const address = `AU-G2-${COORDINATES[c]}-V${String(v + 1).padStart(2, "0")}`;

        const duty =
          v <= 2 ? "body" :
          v <= 5 ? "surface" :
          v <= 7 ? "terrain" :
          v <= 10 ? "lattice" :
          v === 12 ? "water-hold" :
          v <= 14 ? "receipt" :
          "contract";

        const handoff =
          duty === "body" ? "route-renderer" :
          duty === "surface" ? "surface-child-held" :
          duty === "terrain" ? "terrain-child-held" :
          duty === "lattice" ? "datum-child-held" :
          duty === "water-hold" ? "hydration-held" :
          duty === "receipt" ? "receipt-dock" :
          "contract-seal";

        seats.push(Object.freeze({
          address,
          coordinateIndex: c,
          coordinateIdentity: COORDINATES[c],
          coordinateColor: coordinateColors[c],
          versionIndex: v,
          versionIdentity: `V${String(v + 1).padStart(2, "0")} · ${VERSION_NAMES[v]}`,
          expressiveDuty: duty,
          handoff,
          receiptColor: receiptColors[v],
          lon,
          lat
        }));
      }
    }

    state.seats = Object.freeze(seats);
  }

  function bindControls() {
    document.querySelectorAll("[data-audralia-mode]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        setMode(button.dataset.audraliaMode);
      });
    });

    document.querySelectorAll(".planet-menu-panel a").forEach((link) => {
      link.addEventListener("click", () => {
        const menu = document.querySelector(".planet-menu");
        if (menu) menu.open = false;
      });
    });

    const inspectButton = document.querySelector("[data-audralia-inspect-planet]");
    if (inspectButton) {
      inspectButton.addEventListener("click", () => {
        const target = document.querySelector("#planet-orbit");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    document.querySelectorAll("[data-gem-anchor]").forEach((gem) => {
      gem.addEventListener("click", () => {
        document.documentElement.dataset.lastAudraliaGemAnchor = gem.getAttribute("href") || "";
      });
    });
  }

  function setRendererStatus(status, detail) {
    if (state.stage) {
      state.stage.dataset.rendererState = status;
      state.stage.dataset.rendererDetail = detail || status;
    }

    if (state.statusNode) {
      state.statusNode.textContent = detail || status;
    }

    document.documentElement.dataset.audraliaPlanetRendererState = status;
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || scope);
    state.errors.push({ scope, message, time: new Date().toISOString() });
    document.documentElement.dataset.audraliaPlanetRendererError = message;
    setRendererStatus("fallback", `Fallback planet active · ${scope}`);
    publishReceipt(`error:${scope}`);
  }

  function publishReceipt(scope = "publish") {
    const unique = new Set(state.seats.map((seat) => seat.address));

    const receipt = Object.freeze({
      scope,
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      route: ROUTE,
      file: FILE,
      renderer: "native-2d-canvas-continuous-dry-planet",
      objectClass: "planet-not-gem",
      gemLanguageAssignment: "beneath-planet-navigation-only",
      activeMode: state.mode,
      renderCount: state.renderCount,
      coordinateCount: COORDINATE_COUNT,
      versionCount: VERSION_COUNT,
      seatCount: state.seats.length,
      expectedSeatCount: SEAT_COUNT,
      uniqueSeatAddresses: unique.size === SEAT_COUNT,
      coordinateIdentityPresent: state.seats.every((seat) => Boolean(seat.coordinateIdentity)),
      versionIdentityPresent: state.seats.every((seat) => Boolean(seat.versionIdentity)),
      expressiveDutyPresent: state.seats.every((seat) => Boolean(seat.expressiveDuty)),
      handoffPresent: state.seats.every((seat) => Boolean(seat.handoff)),
      canvasReady: state.canvasReady,
      rendererReady: state.rendererReady,
      touchReady: state.touchReady,
      initialized: state.initialized,
      activeWater: false,
      hydrationLoaded: false,
      terrainChildLoaded: false,
      surfaceChildLoaded: false,
      datumChildLoaded: false,
      finalVisualPass: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      showroomDiamondUpgrade: "deferred",
      errors: state.errors.slice()
    });

    window.AUDRALIA_G2_PLANET_NOT_GEM_RECEIPT = receipt;
    window.AUDRALIA_G2_PLANET_RENDERER_RECEIPT = receipt;
    window.AUDRALIA_G2_PLANET_RENDERER_STATUS = () => receipt;

    document.documentElement.dataset.audraliaPlanetRendererContract = CONTRACT;
    document.documentElement.dataset.audraliaPlanetObjectClass = "planet-not-gem";
    document.documentElement.dataset.audraliaPlanetGemAssignment = "navigation-beneath-planet";
    document.documentElement.dataset.audraliaPlanetSeatCount = String(receipt.seatCount);
    document.documentElement.dataset.audraliaPlanetFinalVisualPass = "false";
    document.documentElement.dataset.audraliaPlanetActiveWater = "false";

    return receipt;
  }

  function init() {
    try {
      document.documentElement.dataset.audraliaPlanetRendererContract = CONTRACT;
      document.documentElement.dataset.audraliaPlanetHtmlContract = HTML_CONTRACT;
      document.documentElement.dataset.audraliaPlanetObjectClass = "planet-not-gem";
      document.documentElement.dataset.audraliaPlanetActiveWater = "false";
      document.documentElement.dataset.audraliaPlanetHydrationLoaded = "false";
      document.documentElement.dataset.audraliaPlanetFinalVisualPass = "false";

      state.stage = document.querySelector("[data-audralia-planet-stage]");
      state.canvas = document.querySelector("[data-audralia-planet-canvas]");
      state.fallback = document.querySelector("[data-audralia-planet-fallback]");
      state.statusNode = document.querySelector("[data-audralia-renderer-status]");
      state.titleNode = document.querySelector("[data-audralia-mode-title]");
      state.modeStatusNode = document.querySelector("[data-audralia-mode-status]");
      state.platformNode = document.querySelector("[data-audralia-mode-platform]");
      state.engineeringNode = document.querySelector("[data-audralia-mode-engineering]");

      buildSeats();
      bindControls();

      if (!state.stage || !state.canvas) {
        setRendererStatus("fallback", "Fallback dry planet active · renderer socket missing");
        publishReceipt("socket-missing");
        return;
      }

      state.ctx = state.canvas.getContext("2d", { alpha: true });

      if (!state.ctx) {
        setRendererStatus("fallback", "Fallback dry planet active · canvas unavailable");
        publishReceipt("canvas-unavailable");
        return;
      }

      state.canvasReady = true;
      bindPointer();
      resizeCanvas();
      setMode("body");

      state.initialized = true;
      state.rendererReady = true;
      setRendererStatus("active", "Continuous dry planet active · gems are navigation · water held");

      window.addEventListener("resize", () => {
        resizeCanvas();
        render();
      }, { passive: true });

      window.requestAnimationFrame(step);
      publishReceipt("init-complete");
    } catch (error) {
      recordError("init", error);
    }
  }

  window.AUDRALIA_G2_PLANET_NOT_GEM_API = Object.freeze({
    contract: CONTRACT,
    route: ROUTE,
    setMode,
    resetPlanet,
    render,
    status: () => publishReceipt("status"),
    getSeats: () => state.seats.slice()
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
