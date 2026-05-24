// /showroom/globe/audralia/planet/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_VISUAL_FIRST_PARENT_ROUTE_RENDERER_TNT_v1
//
// Purpose:
// - Support the visual-first parent route rewrite.
// - Keep the planet/product object visible and interactive.
// - Bind mode buttons to the visible planet.
// - Render a dry spherical Audralia object on a single canonical canvas when possible.
// - Preserve 16 × 16 coordinate/version/handoff logic as route-level visualization.
// - Fail open: fallback planet remains visible if canvas fails.
// - No active water. No hydration. No terrain child activation. No surface child activation.
// - No datum child activation. No final visual pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_VISUAL_FIRST_PARENT_ROUTE_RENDERER_TNT_v1";
  const HTML_CONTRACT = "AUDRALIA_G2_VISUAL_FIRST_PARENT_ROUTE_REWRITE_HTML_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/planet/";
  const FILE = "/showroom/globe/audralia/planet/index.js";

  const COORDINATE_COUNT = 16;
  const VERSION_COUNT = 16;
  const SEAT_COUNT = 256;
  const TAU = Math.PI * 2;

  const HELD = Object.freeze({
    datum: "/assets/audralia/clean/runtime/audralia.true-globe.datum.js",
    terrain: "/assets/audralia/clean/terrain/audralia.g2.physical-terrain.child.js",
    surface: "/assets/audralia/clean/surface/audralia.g2.surface-material.child.js",
    hydration: "future-hydration-file-held",
    gauges: "/gauges/"
  });

  const MODE_COPY = Object.freeze({
    body: {
      title: "Body",
      status: "DRY SPHERE · PRODUCT VIEW",
      platform: "Audralia reads first as a complete dry world object. The proof system exists underneath, but the planet carries the page.",
      engineering: "Body mode restrains coordinate color into lighting and material so the route opens with form clarity, not a debug lattice.",
      chamber: "#body-glass"
    },
    surface: {
      title: "Surface",
      status: "DRY MATERIAL · SURFACE HELD",
      platform: "Surface mode shows dry mineral variation without claiming final surface authority.",
      engineering: "The renderer previews route-level material expression. The surface child remains held and is not loaded.",
      chamber: "#surface-console"
    },
    terrain: {
      title: "Terrain",
      status: "RELIEF PRESSURE · TERRAIN HELD",
      platform: "Terrain mode emphasizes ridges, basins, and mass pressure so the planet feels carved instead of flat.",
      engineering: "The renderer applies local relief shading only. The physical terrain child remains the future authority.",
      chamber: "#terrain-deck"
    },
    lattice: {
      title: "Lattice",
      status: "16 × 16 · 256 SEATS",
      platform: "Lattice mode reveals the coordinate system behind the product object.",
      engineering: "Sixteen coordinate identities and sixteen version identities produce 256 addressable expression states.",
      chamber: "#lattice-scope"
    },
    receipt: {
      title: "Receipt",
      status: "HANDOFF STATES · FINAL PASS FALSE",
      platform: "Receipt mode shows what is defined, what is held, and where the planet hands authority next.",
      engineering: "Every coordinate/version seat carries coordinate identity, version identity, expressive duty, and handoff.",
      chamber: "#receipt-dock"
    }
  });

  const COORDINATES = Object.freeze([
    { key: "N", name: "North", role: "origin-axis-definition", color: [244, 207, 131], handoff: "route-shell" },
    { key: "NNE", name: "North-Northeast", role: "origin-transition", color: [238, 225, 154], handoff: "planet-renderer" },
    { key: "NE", name: "Northeast", role: "lift-formation", color: [157, 218, 244], handoff: "datum-file" },
    { key: "ENE", name: "East-Northeast", role: "formation-approach", color: [93, 196, 245], handoff: "surface-child-held" },
    { key: "E", name: "East", role: "expression-gate", color: [76, 217, 239], handoff: "surface-child-held" },
    { key: "ESE", name: "East-Southeast", role: "expression-descent", color: [95, 232, 174], handoff: "surface-child-held" },
    { key: "SE", name: "Southeast", role: "hydration-memory-pressure", color: [120, 211, 126], handoff: "water-held-layer" },
    { key: "SSE", name: "South-Southeast", role: "settling-approach", color: [91, 139, 88], handoff: "terrain-child-held" },
    { key: "S", name: "South", role: "grounding-stability", color: [203, 139, 74], handoff: "route-shell" },
    { key: "SSW", name: "South-Southwest", role: "retention-pressure", color: [208, 100, 76], handoff: "terrain-child-held" },
    { key: "SW", name: "Southwest", role: "terrain-pressure-test", color: [186, 74, 70], handoff: "terrain-child-held" },
    { key: "WSW", name: "West-Southwest", role: "fracture-approach", color: [172, 94, 184], handoff: "terrain-child-held" },
    { key: "W", name: "West", role: "audit-correction", color: [156, 128, 244], handoff: "receipt-layer" },
    { key: "WNW", name: "West-Northwest", role: "recovery-memory", color: [98, 105, 216], handoff: "receipt-layer" },
    { key: "NW", name: "Northwest", role: "compression-return", color: [132, 172, 245], handoff: "contract-seal" },
    { key: "NNW", name: "North-Northwest", role: "return-seal", color: [232, 225, 195], handoff: "contract-seal" }
  ].map((item, index) => Object.freeze({
    ...item,
    index,
    angle: index * TAU / COORDINATE_COUNT - Math.PI / 2
  })));

  const VERSIONS = Object.freeze([
    { key: "V01", name: "Origin", role: "origin-proof", color: [255, 246, 218], handoff: "route-shell" },
    { key: "V02", name: "Body", role: "body-formation", color: [255, 214, 132], handoff: "planet-renderer" },
    { key: "V03", name: "Stability", role: "body-stability", color: [236, 159, 82], handoff: "planet-renderer" },
    { key: "V04", name: "Copper", role: "surface-mineral", color: [182, 103, 64], handoff: "surface-child-held" },
    { key: "V05", name: "Dry Memory", role: "surface-dry-memory", color: [126, 91, 58], handoff: "surface-child-held" },
    { key: "V06", name: "Settling", role: "surface-settling", color: [101, 115, 70], handoff: "surface-child-held" },
    { key: "V07", name: "Ridge", role: "terrain-ridge", color: [86, 135, 78], handoff: "terrain-child-held" },
    { key: "V08", name: "Basin", role: "terrain-basin", color: [132, 202, 144], handoff: "terrain-child-held" },
    { key: "V09", name: "Lattice", role: "lattice-transition", color: [110, 218, 240], handoff: "datum-file" },
    { key: "V10", name: "Address", role: "lattice-address", color: [90, 150, 244], handoff: "datum-file" },
    { key: "V11", name: "Chronology", role: "lattice-chronology", color: [72, 94, 204], handoff: "datum-file" },
    { key: "V12", name: "Pressure", role: "terrain-pressure", color: [86, 76, 180], handoff: "terrain-child-held" },
    { key: "V13", name: "Water Held", role: "water-held", color: [135, 94, 198], handoff: "water-held-layer" },
    { key: "V14", name: "Receipt", role: "receipt-pressure", color: [189, 94, 183], handoff: "receipt-layer" },
    { key: "V15", name: "Audit", role: "audit-return", color: [190, 202, 214], handoff: "receipt-layer" },
    { key: "V16", name: "Seal", role: "contract-seal", color: [255, 224, 138], handoff: "contract-seal" }
  ].map((item, index) => Object.freeze({
    ...item,
    index,
    t: index / Math.max(1, VERSION_COUNT - 1)
  })));

  const state = {
    mode: "body",
    stage: null,
    canvas: null,
    ctx: null,
    fallback: null,
    statusNode: null,
    titleNode: null,
    statusModeNode: null,
    platformNode: null,
    engineeringNode: null,

    width: 0,
    height: 0,
    dpr: 1,

    seats: [],
    patches: [],

    yaw: -0.55,
    pitch: -0.08,
    velocityYaw: 0.0012,
    velocityPitch: 0,
    dragging: false,
    pointerX: 0,
    pointerY: 0,
    lastTap: 0,

    time: 0,
    lastFrame: 0,
    raf: 0,
    renderCount: 0,

    initialized: false,
    canvasReady: false,
    rendererReady: false,
    touchReady: false,
    canonicalCanvasBound: false,
    duplicateCanvasCount: 0,

    activeWater: false,
    hydrationLoaded: false,
    terrainChildLoaded: false,
    surfaceChildLoaded: false,
    datumChildLoaded: false,
    finalVisualPass: false,

    errors: []
  };

  function clamp(value, min, max) {
    const n = Number(value);
    const v = Number.isFinite(n) ? n : min;
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function mixRgb(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t))
    ];
  }

  function rgba(color, alpha = 1) {
    return `rgba(${Math.round(color[0])},${Math.round(color[1])},${Math.round(color[2])},${clamp(alpha, 0, 1)})`;
  }

  function noise(a, b, c = 0) {
    const x = Math.sin((a + 1) * 12.9898 + (b + 1) * 78.233 + (c + 1) * 37.719) * 43758.5453;
    return x - Math.floor(x);
  }

  function normalize(v) {
    const l = Math.hypot(v.x, v.y, v.z) || 1;
    return { x: v.x / l, y: v.y / l, z: v.z / l };
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
    y = y1;
    z = z2;

    return { x, y, z };
  }

  function spherePoint(coordinateIndex, versionIndex, elevation = 0) {
    const lon = COORDINATES[coordinateIndex].angle;
    const lat = lerp(1.24, -1.24, versionIndex / Math.max(1, VERSION_COUNT - 1));
    const r = 1 + elevation;
    const cosLat = Math.cos(lat);

    return {
      x: Math.cos(lon) * cosLat * r,
      y: Math.sin(lat) * r,
      z: Math.sin(lon) * cosLat * r,
      lon,
      lat
    };
  }

  function project(point, radius) {
    const p = rotate(point);
    const camera = 3.2;
    const perspective = camera / (camera - p.z * 0.46);
    return {
      x: state.width / 2 + p.x * radius * perspective,
      y: state.height / 2 + p.y * radius * perspective,
      z: p.z,
      perspective,
      visible: p.z > -0.72
    };
  }

  function deriveHandoff(coordinate, version) {
    if (coordinate.key === "N" && version.key === "V01") {
      return {
        duty: "origin-axis-body-proof",
        handoff: "route-shell",
        target: ROUTE,
        state: "defined"
      };
    }

    if (coordinate.key === "E" && version.key === "V08") {
      return {
        duty: "surface-formation-material-expression",
        handoff: "surface-child-held",
        target: HELD.surface,
        state: "held"
      };
    }

    if (coordinate.key === "SW" && version.key === "V12") {
      return {
        duty: "terrain-pressure-basin-relief-test",
        handoff: "terrain-child-held",
        target: HELD.terrain,
        state: "held"
      };
    }

    if (coordinate.key === "W" && version.key === "V16") {
      return {
        duty: "receipt-correction-audit-closure",
        handoff: "receipt-layer",
        target: "renderer-receipt",
        state: "receipt-confirmed"
      };
    }

    if (coordinate.key === "NNW" && version.key === "V16") {
      return {
        duty: "return-path-contract-seal",
        handoff: "contract-seal",
        target: "contract-seal",
        state: "receipt-confirmed"
      };
    }

    if (version.index <= 2) {
      return {
        duty: version.index === 0 ? "body-origin" : "body-stabilization",
        handoff: version.index === 0 ? "route-shell" : "planet-renderer",
        target: version.index === 0 ? ROUTE : FILE,
        state: "defined"
      };
    }

    if (version.index <= 5) {
      return {
        duty: version.index === 4 ? "surface-dry-memory" : "surface-material",
        handoff: "surface-child-held",
        target: HELD.surface,
        state: "held"
      };
    }

    if (version.index <= 8) {
      return {
        duty: version.index === 7 ? "terrain-basin" : "terrain-ridge",
        handoff: "terrain-child-held",
        target: HELD.terrain,
        state: "held"
      };
    }

    if (version.index <= 10) {
      return {
        duty: version.index === 9 ? "lattice-address" : "lattice-chronology",
        handoff: "datum-file",
        target: HELD.datum,
        state: "pending"
      };
    }

    if (version.index === 12) {
      return {
        duty: "water-held",
        handoff: "water-held-layer",
        target: "water-held-memory-only",
        state: "blocked"
      };
    }

    if (version.index === 13) {
      return {
        duty: "future-hydration-held",
        handoff: "future-hydration-held",
        target: HELD.hydration,
        state: "blocked"
      };
    }

    if (version.index === 14) {
      return {
        duty: "receipt-proof",
        handoff: "receipt-layer",
        target: "renderer-receipt",
        state: "receipt-confirmed"
      };
    }

    return {
      duty: "contract-seal",
      handoff: "contract-seal",
      target: "contract-seal",
      state: "receipt-confirmed"
    };
  }

  function handoffColor(handoffState) {
    if (handoffState === "defined") return [154, 242, 184];
    if (handoffState === "held") return [244, 207, 131];
    if (handoffState === "pending") return [141, 216, 255];
    if (handoffState === "blocked") return [255, 107, 107];
    if (handoffState === "receipt-confirmed") return [255, 232, 163];
    return [210, 220, 230];
  }

  function dutyColor(duty) {
    if (duty.includes("body")) return [154, 132, 86];
    if (duty.includes("surface")) return [132, 105, 69];
    if (duty.includes("terrain") || duty.includes("ridge") || duty.includes("basin")) return [91, 82, 57];
    if (duty.includes("lattice")) return [102, 179, 224];
    if (duty.includes("water")) return [84, 116, 155];
    if (duty.includes("receipt") || duty.includes("audit")) return [220, 172, 96];
    if (duty.includes("contract") || duty.includes("return")) return [244, 207, 131];
    return [150, 150, 130];
  }

  function seatColor(seat, mode) {
    const dryLow = [75, 66, 47];
    const dryHigh = [176, 148, 91];
    const dry = mixRgb(dryLow, dryHigh, clamp((seat.elevation + 0.07) / 0.15, 0, 1));
    const coordinateVersion = mixRgb(seat.coordinateColor, seat.versionColor, 0.42);

    if (mode === "body") return mixRgb(dry, coordinateVersion, 0.08);
    if (mode === "surface") return mixRgb(dry, seat.versionColor, 0.22);
    if (mode === "terrain") return mixRgb(dry, dutyColor(seat.expressiveDuty), 0.35);
    if (mode === "lattice") return mixRgb(seat.coordinateColor, seat.versionColor, 0.45);
    if (mode === "receipt") return mixRgb(coordinateVersion, handoffColor(seat.handoffState), 0.58);
    return dry;
  }

  function buildSeats() {
    const seats = [];
    const patches = [];

    for (let c = 0; c < COORDINATE_COUNT; c += 1) {
      const coordinate = COORDINATES[c];

      for (let v = 0; v < VERSION_COUNT; v += 1) {
        const version = VERSIONS[v];
        const handoff = deriveHandoff(coordinate, version);
        const baseNoise = noise(c, v);
        const ridge = Math.sin(c * 0.9 + v * 0.55) * 0.022;
        const basin = Math.cos(c * 0.72 - v * 0.48) * 0.015;
        let elevation = (baseNoise - 0.5) * 0.045 + ridge + basin;

        if (handoff.duty.includes("ridge")) elevation += 0.035;
        if (handoff.duty.includes("basin")) elevation -= 0.030;
        if (handoff.duty.includes("terrain")) elevation += 0.015;
        if (handoff.duty.includes("water")) elevation -= 0.020;
        if (handoff.duty.includes("body")) elevation *= 0.35;

        elevation = clamp(elevation, -0.065, 0.075);

        const p = spherePoint(c, v, elevation);
        const seatIndex = c * VERSION_COUNT + v;

        const seat = Object.freeze({
          seatIndex,
          seatAddress: `AU-G2-${coordinate.key}-${version.key}`,
          coordinateIndex: c,
          coordinateKey: coordinate.key,
          coordinateName: coordinate.name,
          coordinateRole: coordinate.role,
          coordinateColor: coordinate.color,
          versionIndex: v,
          versionKey: version.key,
          versionName: version.name,
          versionRole: version.role,
          versionColor: version.color,
          chronologyIndex: seatIndex,
          expressiveDuty: handoff.duty,
          handoff: handoff.handoff,
          handoffTarget: handoff.target,
          handoffState: handoff.state,
          elevation,
          point: p,
          activeWater: false,
          finalVisualPass: false
        });

        seats.push(seat);
      }
    }

    for (let v = 0; v < VERSION_COUNT - 1; v += 1) {
      for (let c = 0; c < COORDINATE_COUNT; c += 1) {
        const a = seats[c * VERSION_COUNT + v];
        const b = seats[((c + 1) % COORDINATE_COUNT) * VERSION_COUNT + v];
        const d = seats[c * VERSION_COUNT + v + 1];
        const e = seats[((c + 1) % COORDINATE_COUNT) * VERSION_COUNT + v + 1];

        patches.push(Object.freeze({
          a,
          b,
          c: e,
          d,
          center: normalize({
            x: (a.point.x + b.point.x + d.point.x + e.point.x) / 4,
            y: (a.point.y + b.point.y + d.point.y + e.point.y) / 4,
            z: (a.point.z + b.point.z + d.point.z + e.point.z) / 4
          }),
          seed: a.seatIndex
        }));
      }
    }

    state.seats = Object.freeze(seats);
    state.patches = Object.freeze(patches);
  }

  function resizeCanvas() {
    if (!state.canvas) return;

    const rect = state.canvas.getBoundingClientRect();
    const width = Math.max(320, rect.width || 640);
    const height = Math.max(420, rect.height || 640);
    const dpr = Math.min(1.8, window.devicePixelRatio || 1);

    const nextWidth = Math.floor(width * dpr);
    const nextHeight = Math.floor(height * dpr);

    if (state.canvas.width !== nextWidth) state.canvas.width = nextWidth;
    if (state.canvas.height !== nextHeight) state.canvas.height = nextHeight;

    state.width = nextWidth;
    state.height = nextHeight;
    state.dpr = dpr;

    if (state.ctx) {
      state.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  function getRadius() {
    return Math.min(state.width, state.height) * 0.36;
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.45);
    glow.addColorStop(0, "rgba(141,216,255,0.06)");
    glow.addColorStop(0.46, "rgba(141,216,255,0.11)");
    glow.addColorStop(0.72, "rgba(244,207,131,0.04)");
    glow.addColorStop(1, "rgba(141,216,255,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.45, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = "rgba(141,216,255,.22)";
    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.01, 0, TAU);
    ctx.stroke();
  }

  function drawBaseSphere(ctx, cx, cy, radius) {
    const base = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.38, radius * 0.08, cx, cy, radius * 1.08);
    base.addColorStop(0, "rgba(255,244,216,.58)");
    base.addColorStop(0.16, "rgba(171,150,92,.88)");
    base.addColorStop(0.40, "rgba(91,92,61,.94)");
    base.addColorStop(0.68, "rgba(56,73,67,.98)");
    base.addColorStop(1, "rgba(6,12,24,1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.clip();
    ctx.fillStyle = base;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function patchDepth(patch) {
    const center = rotate(patch.center);
    return center.z;
  }

  function drawPatch(ctx, patch, radius) {
    const points = [patch.a, patch.b, patch.c, patch.d].map((seat) => project(seat.point, radius));
    const center = rotate(patch.center);

    if (center.z < -0.55) return;

    const colorA = seatColor(patch.a, state.mode);
    const colorC = seatColor(patch.c, state.mode);
    const base = mixRgb(colorA, colorC, 0.5);

    const light = clamp(0.42 + center.z * 0.22 + (0.8 - Math.abs(center.x)) * 0.16 + (-center.y + 1) * 0.06, 0.26, 1.16);
    const alpha =
      state.mode === "body" ? 0.72 :
      state.mode === "surface" ? 0.80 :
      state.mode === "terrain" ? 0.86 :
      state.mode === "lattice" ? 0.18 :
      0.16;

    ctx.fillStyle = rgba([base[0] * light, base[1] * light, base[2] * light], alpha);

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawTerrainLines(ctx, radius) {
    if (!["terrain", "surface"].includes(state.mode)) return;

    ctx.save();
    ctx.lineWidth = Math.max(0.7, radius * 0.0025);
    ctx.strokeStyle = state.mode === "terrain" ? "rgba(255,232,163,.18)" : "rgba(255,244,216,.09)";

    for (const patch of state.patches) {
      if (patch.seed % (state.mode === "terrain" ? 3 : 5) !== 0) continue;

      const a = project(patch.a.point, radius);
      const c = project(patch.c.point, radius);

      if (!a.visible || !c.visible) continue;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(c.x, c.y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawLattice(ctx, radius) {
    if (!["lattice", "receipt"].includes(state.mode)) return;

    ctx.save();

    const points = state.seats.map((seat) => ({
      seat,
      screen: project(seat.point, radius)
    }));

    ctx.lineWidth = Math.max(0.6, radius * 0.0022);

    for (const item of points) {
      const seat = item.seat;
      if (seat.versionIndex < VERSION_COUNT - 1) {
        const next = points[seat.coordinateIndex * VERSION_COUNT + seat.versionIndex + 1];
        if (next && item.screen.visible && next.screen.visible) {
          ctx.strokeStyle = state.mode === "receipt"
            ? rgba(handoffColor(seat.handoffState), 0.16)
            : rgba(seat.coordinateColor, seat.coordinateIndex % 4 === 0 ? 0.34 : 0.18);

          ctx.beginPath();
          ctx.moveTo(item.screen.x, item.screen.y);
          ctx.lineTo(next.screen.x, next.screen.y);
          ctx.stroke();
        }
      }

      if (seat.coordinateIndex < COORDINATE_COUNT) {
        const nextCoordinate = (seat.coordinateIndex + 1) % COORDINATE_COUNT;
        const next = points[nextCoordinate * VERSION_COUNT + seat.versionIndex];
        if (next && item.screen.visible && next.screen.visible) {
          ctx.strokeStyle = state.mode === "receipt"
            ? rgba(handoffColor(seat.handoffState), 0.10)
            : rgba(seat.versionColor, seat.versionIndex % 4 === 0 ? 0.24 : 0.12);

          ctx.beginPath();
          ctx.moveTo(item.screen.x, item.screen.y);
          ctx.lineTo(next.screen.x, next.screen.y);
          ctx.stroke();
        }
      }
    }

    for (const item of points) {
      if (!item.screen.visible) continue;

      const seat = item.seat;
      const major = seat.coordinateIndex % 4 === 0 || seat.versionIndex % 4 === 0;
      const r = (state.mode === "receipt" ? 3.2 : 2.7) * state.dpr * item.screen.perspective * (major ? 1.35 : 1);
      const color = state.mode === "receipt" ? handoffColor(seat.handoffState) : seatColor(seat, "lattice");

      ctx.fillStyle = rgba(color, major ? 0.84 : 0.56);
      ctx.beginPath();
      ctx.arc(item.screen.x, item.screen.y, Math.max(1.4, r), 0, TAU);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawSphereShade(ctx, cx, cy, radius) {
    const shadow = ctx.createRadialGradient(cx + radius * 0.58, cy + radius * 0.50, radius * 0.05, cx, cy, radius * 1.12);
    shadow.addColorStop(0, "rgba(0,0,0,.42)");
    shadow.addColorStop(0.42, "rgba(0,0,0,.18)");
    shadow.addColorStop(0.72, "rgba(0,0,0,.06)");
    shadow.addColorStop(1, "rgba(0,0,0,.58)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.clip();
    ctx.fillStyle = shadow;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const highlight = ctx.createRadialGradient(cx - radius * 0.42, cy - radius * 0.48, 0, cx - radius * 0.32, cy - radius * 0.36, radius * 0.60);
    highlight.addColorStop(0, "rgba(255,255,255,.22)");
    highlight.addColorStop(0.42, "rgba(255,244,216,.07)");
    highlight.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = highlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();
  }

  function drawReceiptHalo(ctx, cx, cy, radius) {
    if (state.mode !== "receipt") return;

    ctx.save();
    ctx.strokeStyle = "rgba(244,207,131,.34)";
    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.setLineDash([radius * 0.04, radius * 0.025]);
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.08, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  function drawModeBadge(ctx, cx, cy, radius) {
    ctx.save();
    ctx.font = `${Math.max(10, radius * 0.044)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,244,216,.72)";
    ctx.fillText(MODE_COPY[state.mode].status, cx, cy + radius * 1.22);
    ctx.restore();
  }

  function render() {
    if (!state.ctx || !state.canvasReady) return;

    resizeCanvas();

    const ctx = state.ctx;
    const cx = state.width / 2;
    const cy = state.height / 2;
    const radius = getRadius();

    ctx.clearRect(0, 0, state.width, state.height);

    drawAtmosphere(ctx, cx, cy, radius);
    drawBaseSphere(ctx, cx, cy, radius);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.clip();

    const sorted = state.patches.slice().sort((a, b) => patchDepth(a) - patchDepth(b));
    for (const patch of sorted) drawPatch(ctx, patch, radius);

    drawTerrainLines(ctx, radius);
    drawLattice(ctx, radius);

    ctx.restore();

    drawSphereShade(ctx, cx, cy, radius);
    drawReceiptHalo(ctx, cx, cy, radius);
    drawModeBadge(ctx, cx, cy, radius);

    state.renderCount += 1;
    publishReceipt("render");
  }

  function step(timestamp) {
    const dt = state.lastFrame ? clamp((timestamp - state.lastFrame) / 1000, 0, 0.05) : 0;
    state.lastFrame = timestamp;
    state.time += dt;

    if (!state.dragging) {
      state.yaw += state.velocityYaw * (dt * 60);
      state.pitch += state.velocityPitch * (dt * 60);

      const damping = Math.pow(0.94, dt * 60);
      state.velocityYaw *= damping;
      state.velocityPitch *= damping;

      if (Math.abs(state.velocityYaw) < 0.00003) state.velocityYaw = 0.00042;
      if (Math.abs(state.velocityPitch) < 0.00003) state.velocityPitch = 0;
    }

    state.pitch = clamp(state.pitch, -0.85, 0.85);

    render();

    state.raf = window.requestAnimationFrame(step);
  }

  function resetPlanet() {
    state.yaw = -0.55;
    state.pitch = -0.08;
    state.velocityYaw = 0.0012;
    state.velocityPitch = 0;
    render();
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

      state.yaw += dx * 0.008;
      state.pitch = clamp(state.pitch + dy * 0.0048, -0.85, 0.85);
      state.velocityYaw = clamp(dx * 0.0018, -0.045, 0.045);
      state.velocityPitch = clamp(dy * 0.0011, -0.025, 0.025);

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

  function neutralizeDuplicateCanvases(stage, canonicalCanvas) {
    const canvases = Array.from(stage.querySelectorAll("canvas"));
    let duplicates = 0;

    for (const canvas of canvases) {
      if (canvas === canonicalCanvas) continue;

      duplicates += 1;
      canvas.setAttribute("data-audralia-duplicate-neutralized", "true");
      canvas.style.display = "none";
      canvas.style.visibility = "hidden";
      canvas.style.pointerEvents = "none";

      try {
        canvas.remove();
      } catch (_error) {}
    }

    state.duplicateCanvasCount += duplicates;
  }

  function bindCanvas() {
    if (!state.stage || !state.canvas) return false;

    neutralizeDuplicateCanvases(state.stage, state.canvas);

    Object.assign(state.canvas.style, {
      position: "absolute",
      inset: "0",
      zIndex: "4",
      width: "100%",
      height: "100%",
      display: "block",
      background: "transparent",
      pointerEvents: "none"
    });

    state.canvas.setAttribute("data-audralia-planet-canonical-canvas", "true");
    state.canvas.setAttribute("data-contract", CONTRACT);
    state.canvas.setAttribute("data-html-contract", HTML_CONTRACT);
    state.canvas.setAttribute("data-coordinate-count", String(COORDINATE_COUNT));
    state.canvas.setAttribute("data-version-count", String(VERSION_COUNT));
    state.canvas.setAttribute("data-seat-count", String(SEAT_COUNT));
    state.canvas.setAttribute("data-active-water", "false");
    state.canvas.setAttribute("data-final-visual-pass", "false");

    state.ctx = state.canvas.getContext("2d", { alpha: true });
    state.canonicalCanvasBound = true;
    state.canvasReady = Boolean(state.ctx);

    if (typeof MutationObserver === "function") {
      const observer = new MutationObserver(() => {
        neutralizeDuplicateCanvases(state.stage, state.canvas);
      });

      observer.observe(state.stage, { childList: true, subtree: false });
    }

    return state.canvasReady;
  }

  function setRendererStatus(status, detail) {
    if (state.stage) {
      state.stage.setAttribute("data-renderer-state", status);
      if (detail) state.stage.setAttribute("data-renderer-detail", detail);
    }

    if (state.statusNode) {
      state.statusNode.textContent = detail || status;
    }

    document.documentElement.dataset.audraliaPlanetRendererState = status;
    document.documentElement.dataset.audraliaPlanetRendererDetail = detail || status;
  }

  function setMode(nextMode) {
    const mode = MODE_COPY[nextMode] ? nextMode : "body";
    state.mode = mode;

    document.documentElement.dataset.audraliaPlanetMode = mode;
    if (document.body) document.body.dataset.audraliaPlanetMode = mode;

    document.querySelectorAll("[data-audralia-mode]").forEach((button) => {
      const active = button.dataset.audraliaMode === mode;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.toggleAttribute("data-active", active);
    });

    const copy = MODE_COPY[mode];

    if (state.titleNode) state.titleNode.textContent = copy.title;
    if (state.statusModeNode) state.statusModeNode.textContent = copy.status;
    if (state.platformNode) state.platformNode.textContent = copy.platform;
    if (state.engineeringNode) state.engineeringNode.textContent = copy.engineering;

    render();
    publishReceipt(`mode:${mode}`);
  }

  function bindModeControls() {
    document.querySelectorAll("[data-audralia-mode]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        setMode(button.dataset.audraliaMode);
      });
    });

    const inspectButton = document.querySelector("[data-audralia-inspect-planet]");
    if (inspectButton) {
      inspectButton.addEventListener("click", () => {
        const target = document.querySelector("[data-audralia-planet-stage]");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }

    document.querySelectorAll(".planet-menu-panel a").forEach((link) => {
      link.addEventListener("click", () => {
        const menu = document.querySelector(".planet-menu");
        if (menu) menu.open = false;
      });
    });
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || scope);

    state.errors.push({
      scope,
      message,
      time: new Date().toISOString()
    });

    document.documentElement.dataset.audraliaPlanetRendererError = message;
    setRendererStatus("fallback", `${scope}: ${message}`);
    publishReceipt(`error:${scope}`);
  }

  function allSeatsHave(field) {
    return state.seats.length === SEAT_COUNT && state.seats.every((seat) => {
      const value = seat[field];
      return value !== undefined && value !== null && value !== "";
    });
  }

  function publishReceipt(scope = "publish") {
    const unique = new Set(state.seats.map((seat) => seat.seatAddress));

    const receipt = Object.freeze({
      scope,
      contract: CONTRACT,
      htmlContract: HTML_CONTRACT,
      route: ROUTE,
      file: FILE,
      renderer: "native-canvas-route-sphere",
      visualFirstParentRoute: true,
      singleCanonicalCanvas: state.canonicalCanvasBound,
      duplicateCanvasCount: state.duplicateCanvasCount,
      canvasReady: state.canvasReady,
      rendererReady: state.rendererReady,
      touchReady: state.touchReady,
      initialized: state.initialized,
      activeMode: state.mode,
      renderCount: state.renderCount,
      coordinateCount: COORDINATE_COUNT,
      versionCount: VERSION_COUNT,
      seatCount: state.seats.length,
      expectedSeatCount: SEAT_COUNT,
      uniqueSeatAddresses: unique.size === SEAT_COUNT,
      coordinateIdentityPresent: allSeatsHave("coordinateKey"),
      versionIdentityPresent: allSeatsHave("versionKey"),
      expressiveDutyPresent: allSeatsHave("expressiveDuty"),
      handoffPresent: allSeatsHave("handoff"),
      handoffTargetPresent: allSeatsHave("handoffTarget"),
      handoffStatePresent: allSeatsHave("handoffState"),
      activeWater: false,
      hydrationLoaded: false,
      terrainChildLoaded: false,
      surfaceChildLoaded: false,
      datumChildLoaded: false,
      finalVisualPass: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      heldFiles: HELD,
      errors: state.errors.slice()
    });

    window.AUDRALIA_G2_VISUAL_FIRST_PARENT_ROUTE_RECEIPT = receipt;
    window.AUDRALIA_G2_PLANET_RENDERER_RECEIPT = receipt;
    window.AUDRALIA_G2_PLANET_COORDINATE_HANDOFF_RECEIPT = receipt;
    window.AUDRALIA_G2_PLANET_RENDERER_STATUS = () => receipt;

    document.documentElement.dataset.audraliaVisualFirstRendererReceipt = CONTRACT;
    document.documentElement.dataset.audraliaPlanetSeatCount = String(receipt.seatCount);
    document.documentElement.dataset.audraliaPlanetCoordinateCount = String(COORDINATE_COUNT);
    document.documentElement.dataset.audraliaPlanetVersionCount = String(VERSION_COUNT);
    document.documentElement.dataset.audraliaPlanetUniqueSeatAddresses = receipt.uniqueSeatAddresses ? "true" : "false";
    document.documentElement.dataset.audraliaPlanetHandoffPresent = receipt.handoffPresent ? "true" : "false";
    document.documentElement.dataset.audraliaPlanetActiveWater = "false";
    document.documentElement.dataset.audraliaPlanetFinalVisualPass = "false";

    return receipt;
  }

  function init() {
    try {
      document.documentElement.dataset.audraliaVisualFirstRendererContract = CONTRACT;
      document.documentElement.dataset.audraliaVisualFirstHtmlContract = HTML_CONTRACT;
      document.documentElement.dataset.audraliaPlanetActiveWater = "false";
      document.documentElement.dataset.audraliaPlanetHydrationLoaded = "false";
      document.documentElement.dataset.audraliaPlanetFinalVisualPass = "false";

      state.stage = document.querySelector("[data-audralia-planet-stage]");
      state.canvas = document.querySelector("[data-audralia-planet-canvas]");
      state.fallback = document.querySelector("[data-audralia-planet-fallback]");
      state.statusNode = document.querySelector("[data-audralia-renderer-status]");
      state.titleNode = document.querySelector("[data-audralia-mode-title]");
      state.statusModeNode = document.querySelector("[data-audralia-mode-status]");
      state.platformNode = document.querySelector("[data-audralia-mode-platform]");
      state.engineeringNode = document.querySelector("[data-audralia-mode-engineering]");

      bindModeControls();
      buildSeats();

      if (!state.stage || !state.canvas) {
        setRendererStatus("fallback", "Fallback dry planet active · renderer socket missing");
        publishReceipt("socket-missing");
        return;
      }

      if (!bindCanvas()) {
        setRendererStatus("fallback", "Fallback dry planet active · canvas unavailable");
        publishReceipt("canvas-unavailable");
        return;
      }

      bindPointer();
      resizeCanvas();
      setMode("body");

      state.rendererReady = true;
      state.initialized = true;

      setRendererStatus("active", "Visual sphere active · water held · final pass false");

      window.addEventListener("resize", () => {
        resizeCanvas();
        render();
      }, { passive: true });

      if (!state.raf) {
        state.raf = window.requestAnimationFrame(step);
      }

      publishReceipt("init-complete");
    } catch (error) {
      recordError("init", error);
    }
  }

  window.AUDRALIA_G2_VISUAL_FIRST_PARENT_ROUTE_API = {
    contract: CONTRACT,
    route: ROUTE,
    setMode,
    resetPlanet,
    render,
    status: () => publishReceipt("status"),
    getSeats: () => state.seats.slice(),
    getSeatByAddress: (address) => state.seats.find((seat) => seat.seatAddress === address) || null
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
