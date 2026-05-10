// /showroom/globe/hearth/hearth.climate.route.js
// HEARTH_VISIBLE_GLOBE_RECOVERY_ROUTE_TNT_v15
// Full-file replacement.
// Purpose:
// - Restore a visible, draggable Hearth globe immediately.
// - Stop blank/loading-state regression caused by hard child-contract failure.
// - Load child authorities as audit/background support, but do not let a stale or missing child file blank the globe.
// - Preserve route separation: this route conducts recovery rendering only.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_VISIBLE_GLOBE_RECOVERY_ROUTE_TNT_v15";
  const RECEIPT = "HEARTH_VISIBLE_GLOBE_RECOVERY_ROUTE_RECEIPT_v15";
  const PREVIOUS_CONTRACT = "HEARTH_CLIMATE_BIOME_REGION_ROUTE_BYPASS_TNT_v14";
  const KEY = "hearth-visible-globe-recovery-v15";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  window.__HEARTH_ACTIVE_ROUTE_FILE__ = "/showroom/globe/hearth/hearth.climate.route.js";
  window.__HEARTH_ACTIVE_ROUTE_CONTRACT__ = CONTRACT;

  const state = {
    loaded: [],
    failed: [],
    mounted: false,
    canvasFound: false,
    controlsBound: false,
    recoveryRenderer: false,
    childAuditComplete: false,
    error: ""
  };

  const CHILD_FILES = [
    {
      role: "runtime",
      src: `/assets/hearth/hearth.runtime.js?v=${KEY}`,
      global: "HEARTH_RUNTIME",
      validate: (value) => Boolean(value && typeof value.start === "function")
    },
    {
      role: "controls",
      src: `/assets/hearth/hearth.controls.js?v=${KEY}`,
      global: "HEARTH_CONTROLS",
      validate: (value) => Boolean(value && typeof value.bind === "function")
    },
    {
      role: "terrainExtension",
      src: `/assets/hearth/hearth.terrain.extension.js?v=${KEY}`,
      global: "HEARTH_TERRAIN_EXTENSION",
      validate: (value) =>
        Boolean(
          value &&
            typeof value.sampleTerrain === "function" &&
            typeof value.sampleCoastlineModifier === "function" &&
            typeof value.sampleIslandField === "function"
        )
    },
    {
      role: "elevation",
      src: `/assets/hearth/hearth.elevation.js?v=${KEY}`,
      global: "HEARTH_ELEVATION",
      validate: (value) => Boolean(value && typeof value.sampleElevation === "function")
    },
    {
      role: "climate",
      src: `/assets/hearth/hearth.climate.js?v=${KEY}`,
      global: "HEARTH_CLIMATE",
      validate: (value) => Boolean(value && typeof value.sampleClimate === "function")
    },
    {
      role: "assets",
      src: `/assets/hearth/hearth.assets.js?v=${KEY}`,
      global: "HEARTH_ASSETS",
      validate: (value) => Boolean(value && typeof value.createTextureCanvas === "function")
    },
    {
      role: "canvas",
      src: `/assets/hearth/hearth.canvas.js?v=${KEY}`,
      global: "HEARTH_CANVAS",
      validate: (value) => Boolean(value && typeof value.mount === "function")
    }
  ];

  const BODY_MASSES = Object.freeze([
    { key: "north-crown-mass", lat: 78 * DEG, lon: -20 * DEG, rx: 42 * DEG, ry: 13 * DEG, angle: -10 * DEG, seed: 11 },
    { key: "equatorial-great-mass", lat: 1 * DEG, lon: -8 * DEG, rx: 64 * DEG, ry: 28 * DEG, angle: -8 * DEG, seed: 22 },
    { key: "northwest-temperate-mass", lat: 44 * DEG, lon: -104 * DEG, rx: 32 * DEG, ry: 17 * DEG, angle: 28 * DEG, seed: 33 },
    { key: "northeast-broken-shelf-mass", lat: 34 * DEG, lon: 104 * DEG, rx: 34 * DEG, ry: 16 * DEG, angle: -24 * DEG, seed: 44 },
    { key: "southeast-warm-mass", lat: -24 * DEG, lon: 142 * DEG, rx: 38 * DEG, ry: 20 * DEG, angle: 18 * DEG, seed: 55 },
    { key: "southwest-ridge-mass", lat: -38 * DEG, lon: -122 * DEG, rx: 36 * DEG, ry: 18 * DEG, angle: -30 * DEG, seed: 66 },
    { key: "south-transitional-mass", lat: -59 * DEG, lon: 36 * DEG, rx: 40 * DEG, ry: 14 * DEG, angle: 9 * DEG, seed: 77 }
  ]);

  const ISLANDS = Object.freeze([
    { lat: 69 * DEG, lon: -76 * DEG, rx: 6 * DEG, ry: 2.4 * DEG, angle: -20 * DEG, seed: 101 },
    { lat: 72 * DEG, lon: 44 * DEG, rx: 5 * DEG, ry: 2 * DEG, angle: 18 * DEG, seed: 102 },
    { lat: 21 * DEG, lon: 66 * DEG, rx: 5.5 * DEG, ry: 2.3 * DEG, angle: -26 * DEG, seed: 103 },
    { lat: -19 * DEG, lon: 57 * DEG, rx: 6.4 * DEG, ry: 2.5 * DEG, angle: 20 * DEG, seed: 104 },
    { lat: 44 * DEG, lon: 123 * DEG, rx: 7.4 * DEG, ry: 2.8 * DEG, angle: -18 * DEG, seed: 105 },
    { lat: 34 * DEG, lon: 139 * DEG, rx: 5.7 * DEG, ry: 2.1 * DEG, angle: 31 * DEG, seed: 106 },
    { lat: -9 * DEG, lon: 170 * DEG, rx: 6.6 * DEG, ry: 2.6 * DEG, angle: 34 * DEG, seed: 107 },
    { lat: -55 * DEG, lon: -84 * DEG, rx: 5.6 * DEG, ry: 2 * DEG, angle: 11 * DEG, seed: 108 },
    { lat: -70 * DEG, lon: 76 * DEG, rx: 6.2 * DEG, ry: 2.2 * DEG, angle: -20 * DEG, seed: 109 }
  ]);

  const COLOR = Object.freeze({
    abyss: [2, 10, 26],
    deep: [4, 24, 55],
    ocean: [7, 55, 96],
    shelf: [24, 116, 136],
    coastFoam: [115, 177, 160],
    beach: [198, 177, 116],
    forest: [36, 104, 64],
    wetForest: [26, 88, 58],
    plains: [125, 145, 82],
    savanna: [158, 144, 78],
    desert: [184, 148, 86],
    steppe: [132, 122, 82],
    mountain: [92, 92, 86],
    cliff: [46, 54, 66],
    highland: [112, 116, 94],
    tundra: [132, 140, 122],
    snow: [214, 228, 228],
    ice: [194, 218, 224],
    shadow: [14, 18, 24]
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function mix(a, b, t) {
    const k = clamp(t, 0, 1);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k))
    ];
  }

  function lift(c, amount) {
    return [
      clamp(Math.round(c[0] + amount), 0, 255),
      clamp(Math.round(c[1] + amount), 0, 255),
      clamp(Math.round(c[2] + amount), 0, 255)
    ];
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrapPi(value) {
    return Math.atan2(Math.sin(value), Math.cos(value));
  }

  function hash(x, y, seed) {
    let h = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(y ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function noise(u, v, scale, seed) {
    const s = Math.max(1, Math.floor(scale));
    const x = u * s;
    const y = v * s;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const xf = x - x0;
    const yf = y - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    return lerp(
      lerp(hash(((x0 % s) + s) % s, y0, seed), hash(((x1 % s) + s) % s, y0, seed), sx),
      lerp(hash(((x0 % s) + s) % s, y1, seed), hash(((x1 % s) + s) % s, y1, seed), sx),
      sy
    );
  }

  function ridged(u, v, seed) {
    let total = 0;
    let norm = 0;
    let amp = 0.6;
    let scale = 8;

    for (let i = 0; i < 5; i += 1) {
      const n = noise(u, v, scale, seed + i * 97);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.53;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ellipseField(lon, lat, mass) {
    const dx = wrapPi(lon - mass.lon) * Math.cos(mass.lat);
    const dy = lat - mass.lat;
    const ca = Math.cos(mass.angle);
    const sa = Math.sin(mass.angle);
    const x = dx * ca - dy * sa;
    const y = dx * sa + dy * ca;
    const nx = x / mass.rx;
    const ny = y / mass.ry;
    const theta = Math.atan2(ny, nx);
    const dist = Math.sqrt(nx * nx + ny * ny);

    return { theta, dist, nx, ny };
  }

  function landField(u, v) {
    const lon = (u - 0.5) * TAU;
    const lat = (0.5 - v) * Math.PI;

    let best = {
      field: -10,
      mass: BODY_MASSES[0],
      theta: 0
    };

    for (const mass of BODY_MASSES) {
      const e = ellipseField(lon, lat, mass);
      const chip =
        Math.sign(Math.sin(e.theta * (7 + mass.seed % 5) + e.nx * 4.7 - e.ny * 3.8)) * 0.06 +
        Math.sin(e.theta * (11 + mass.seed % 3) - mass.seed * 0.11) * 0.04;
      const fracture = (ridged(u + mass.seed * 0.011, v - mass.seed * 0.009, 19000 + mass.seed) - 0.5) * 0.18;
      const bayCut = smoothstep(0.52, 0.94, noise(u - mass.seed * 0.013, v + mass.seed * 0.017, 96, 20000 + mass.seed)) * 0.11;
      const field = 1 - e.dist + chip + fracture - bayCut;

      if (field > best.field) {
        best = { field, mass, theta: e.theta };
      }
    }

    for (const island of ISLANDS) {
      const e = ellipseField(lon, lat, island);
      const chip = Math.sin(e.theta * 6 + island.seed * 0.13) * 0.13 + Math.sin(e.theta * 10) * 0.06;
      const field = 0.35 + chip - e.dist;

      if (field > best.field) {
        best = { field, mass: BODY_MASSES[0], theta: e.theta, island: true };
      }
    }

    const coast = 1 - smoothstep(0.015, 0.16, Math.abs(best.field));
    const shelf = smoothstep(-0.28, 0.03, best.field) * (best.field <= 0 ? 1 : 0);

    return {
      field: best.field,
      isLand: best.field > 0,
      coast: clamp(coast, 0, 1),
      shelf: clamp(shelf, 0, 1),
      mass: best.mass,
      island: best.island === true,
      lon,
      lat
    };
  }

  function climateColor(u, v, land) {
    const latCold = Math.abs(land.lat) / (Math.PI / 2);
    const heat = clamp(1 - latCold + (noise(u, v, 8, 33000) - 0.5) * 0.24, 0, 1);
    const moisture = clamp(noise(u + 0.17, v - 0.11, 10, 34000) * 0.72 + land.coast * 0.22 + land.island * 0.08, 0, 1);
    const ridge = ridged(u + land.mass.seed * 0.021, v - land.mass.seed * 0.017, 35000);
    const mountain = smoothstep(0.58, 0.92, ridge);
    const highland = smoothstep(0.46, 0.82, ridge);
    const ice = smoothstep(0.68, 0.95, latCold + mountain * 0.16 - heat * 0.12);

    let c;

    if (ice > 0.58) {
      c = mix(COLOR.tundra, COLOR.ice, ice);
    } else if (mountain > 0.68) {
      c = mix(COLOR.highland, COLOR.mountain, mountain);
    } else if (heat > 0.66 && moisture < 0.32) {
      c = COLOR.desert;
    } else if (heat > 0.58 && moisture < 0.48) {
      c = COLOR.savanna;
    } else if (moisture > 0.72 && heat > 0.46) {
      c = COLOR.wetForest;
    } else if (moisture > 0.56) {
      c = COLOR.forest;
    } else if (latCold > 0.52) {
      c = COLOR.tundra;
    } else if (moisture < 0.35) {
      c = COLOR.steppe;
    } else {
      c = COLOR.plains;
    }

    c = mix(c, COLOR.beach, land.coast * 0.22);
    c = mix(c, COLOR.cliff, land.coast * mountain * 0.3);
    c = mix(c, COLOR.snow, ice * mountain * 0.34);

    const fine = noise(u + 0.41, v - 0.33, 128, 36000);
    const relief = mountain * 18 + highland * 8 + fine * 8 - land.coast * 4;

    return lift(c, relief - 6);
  }

  function textureColor(u, v) {
    const land = landField(u, v);

    if (!land.isLand) {
      let c = mix(COLOR.abyss, COLOR.deep, noise(u, v, 12, 31000));
      c = mix(c, COLOR.ocean, smoothstep(0.2, 0.9, land.shelf) * 0.48);
      c = mix(c, COLOR.shelf, land.shelf * 0.58);
      c = mix(c, COLOR.coastFoam, land.coast * land.shelf * 0.16);
      return c;
    }

    return climateColor(u, v, land);
  }

  function createTexture(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: false });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let y = 0; y < height; y += 1) {
      const v = y / Math.max(1, height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = x / width;
        const c = textureColor(u, v);
        const i = (y * width + x) * 4;

        data[i] = c[0];
        data[i + 1] = c[1];
        data[i + 2] = c[2];
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    return {
      width,
      height,
      data
    };
  }

  function mountNode() {
    let node =
      document.getElementById("hearthCanvasMount") ||
      document.querySelector("[data-hearth-canvas-mount]");

    if (!node) {
      node = document.createElement("section");
      (document.getElementById("hearth-main") || document.body).appendChild(node);
    }

    node.id = "hearthCanvasMount";
    node.dataset.hearthCanvasMount = "true";
    node.style.touchAction = "none";
    node.style.userSelect = "none";
    node.querySelectorAll("canvas").forEach((canvas) => canvas.remove());

    return node;
  }

  function status(statusValue) {
    const node =
      document.getElementById("hearth-route-status") ||
      document.querySelector("[data-hearth-route-status]");

    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthRouteControllerReceipt = RECEIPT;
    document.documentElement.dataset.hearthRoutePreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.hearthHardRenewalKey = KEY;
    document.documentElement.dataset.hearthActiveRouteFile = "/showroom/globe/hearth/hearth.climate.route.js";
    document.documentElement.dataset.hearthVisibleRecoveryMounted = String(state.mounted);
    document.documentElement.dataset.hearthRecoveryRenderer = String(state.recoveryRenderer);
    document.documentElement.dataset.hearthCanvasFound = String(state.canvasFound);
    document.documentElement.dataset.hearthControlsBound = String(state.controlsBound);
    document.documentElement.dataset.hearthChildAuditComplete = String(state.childAuditComplete);
    document.documentElement.dataset.hearthBodyMassCount = "7";
    document.documentElement.dataset.hearthPoleSwivel = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (node) {
      node.textContent = [
        "Hearth visible-globe recovery route.",
        `Status ${statusValue}`,
        `Route ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Previous ${PREVIOUS_CONTRACT}`,
        `Hard Renewal Key ${KEY}`,
        "Active Route File /showroom/globe/hearth/hearth.climate.route.js",
        "Visible globe mounted true",
        `Recovery renderer ${state.recoveryRenderer}`,
        `Loaded children ${state.loaded.join(",") || "none"}`,
        `Failed children ${state.failed.join(",") || "none"}`,
        `Mounted ${state.mounted}`,
        `Canvas found ${state.canvasFound}`,
        `Controls bound ${state.controlsBound}`,
        `Child audit complete ${state.childAuditComplete}`,
        "Body mass count 7",
        "Pole swivel true",
        "Runtime blocking disabled true",
        "Hard child failure blanks globe false",
        "Generated image false",
        "GraphicBox false",
        "Visual pass claimed false",
        state.error ? `Error ${state.error}` : ""
      ].filter(Boolean).join("\n");
    }
  }

  function disposePrior() {
    [
      "__HEARTH_G4_ROUTE_DISPOSE__",
      "__HEARTH_HABITABLE_FORMING_ROUTE_DISPOSE__",
      "__HEARTH_CONTROLS_DISPOSE__",
      "__HEARTH_CANVAS_DISPOSE__",
      "__HEARTH_VISIBLE_RECOVERY_DISPOSE__"
    ].forEach((name) => {
      if (typeof window[name] === "function") {
        try { window[name](); } catch (_) {}
      }

      try { window[name] = undefined; } catch (_) {}
    });
  }

  function removeChildScripts() {
    document.querySelectorAll([
      'script[src*="/assets/hearth/hearth.runtime.js"]',
      'script[src*="/assets/hearth/hearth.controls.js"]',
      'script[src*="/assets/hearth/hearth.terrain.extension.js"]',
      'script[src*="/assets/hearth/hearth.elevation.js"]',
      'script[src*="/assets/hearth/hearth.climate.js"]',
      'script[src*="/assets/hearth/hearth.assets.js"]',
      'script[src*="/assets/hearth/hearth.canvas.js"]',
      'script[data-hearth-file="true"]'
    ].join(",")).forEach((script) => script.remove());
  }

  function hideFallback(mount) {
    mount.querySelectorAll("[data-hearth-mount-fallback]").forEach((fallback) => {
      fallback.hidden = true;
      fallback.style.display = "none";
    });
  }

  function mountRecoveryGlobe(mount) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: true });

    canvas.dataset.hearthRecoveryCanvas = "true";
    canvas.dataset.hearthRouteControllerContract = CONTRACT;
    canvas.dataset.hearthRouteControllerReceipt = RECEIPT;
    canvas.dataset.hearthBodyMassCount = "7";
    canvas.dataset.hearthPoleSwivel = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.visualPassClaimed = "false";

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";

    mount.appendChild(canvas);
    hideFallback(mount);

    const texture = createTexture(1024, 512);

    let disposed = false;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let yaw = -0.28;
    let tilt = -0.18;
    let yawVelocity = 0.0022;
    let tiltVelocity = 0;

    function resize() {
      const box = mount.getBoundingClientRect();
      const cssSize = Math.max(280, Math.floor(Math.min(box.width || 420, box.height || box.width || 420)));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const size = Math.min(720, Math.max(360, Math.floor(cssSize * dpr)));

      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
      }
    }

    function sampleTexture(u, v) {
      const tx = Math.floor((((u % 1) + 1) % 1) * texture.width) % texture.width;
      const ty = clamp(Math.floor(clamp(v, 0, 0.999999) * texture.height), 0, texture.height - 1);
      const i = (ty * texture.width + tx) * 4;

      return [
        texture.data[i],
        texture.data[i + 1],
        texture.data[i + 2]
      ];
    }

    function render() {
      if (disposed) return;

      resize();

      const width = canvas.width;
      const height = canvas.height;
      const image = ctx.createImageData(width, height);
      const data = image.data;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.44;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      for (let y = 0; y < height; y += 1) {
        const sy = (y - cy) / radius;

        for (let x = 0; x < width; x += 1) {
          const sx = (x - cx) / radius;
          const rr = sx * sx + sy * sy;
          const i = (y * width + x) * 4;

          if (rr > 1) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 0;
            continue;
          }

          const z = Math.sqrt(1 - rr);
          const yy = sy * cosT + z * sinT;
          const zz = z * cosT - sy * sinT;
          const lon = Math.atan2(sx, zz) + yaw;
          const lat = Math.asin(clamp(yy, -1, 1));
          const u = lon / TAU + 0.5;
          const v = 0.5 - lat / Math.PI;
          let c = sampleTexture(u, v);

          const light = clamp(0.42 + z * 0.58 + sx * -0.08 + sy * -0.08, 0.18, 1.08);
          const limb = clamp(0.35 + z * 0.78, 0.2, 1);
          c = [
            Math.round(c[0] * light * limb),
            Math.round(c[1] * light * limb),
            Math.round(c[2] * light * limb)
          ];

          const rim = smoothstep(0.74, 1, rr);
          c = mix(c, [6, 19, 34], rim * 0.46);

          data[i] = c[0];
          data[i + 1] = c[1];
          data[i + 2] = c[2];
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(image, 0, 0);

      if (!dragging) {
        yaw += yawVelocity;
        tilt += tiltVelocity;
        yawVelocity *= 0.992;
        tiltVelocity *= 0.93;

        if (Math.abs(yawVelocity) < 0.0014) yawVelocity = 0.0014;
        if (tilt > 1.25) {
          tilt = 1.25;
          tiltVelocity *= -0.2;
        }
        if (tilt < -1.25) {
          tilt = -1.25;
          tiltVelocity *= -0.2;
        }
      }

      requestAnimationFrame(render);
    }

    function pointerDown(event) {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      yawVelocity = 0;
      tiltVelocity = 0;
      canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    }

    function pointerMove(event) {
      if (!dragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      yaw += dx * 0.009;
      tilt += dy * 0.0075;
      tilt = clamp(tilt, -1.35, 1.35);

      yawVelocity = dx * 0.00085;
      tiltVelocity = dy * 0.00055;

      event.preventDefault();
    }

    function pointerUp(event) {
      dragging = false;
      canvas.releasePointerCapture?.(event.pointerId);
      event.preventDefault();
    }

    canvas.addEventListener("pointerdown", pointerDown, { passive: false });
    canvas.addEventListener("pointermove", pointerMove, { passive: false });
    canvas.addEventListener("pointerup", pointerUp, { passive: false });
    canvas.addEventListener("pointercancel", pointerUp, { passive: false });

    window.__HEARTH_VISIBLE_RECOVERY_DISPOSE__ = () => {
      disposed = true;
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      canvas.remove();
    };

    requestAnimationFrame(render);

    return canvas;
  }

  function loadChild(file) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = file.src;
      script.defer = true;
      script.dataset.hearthFile = "true";
      script.dataset.hearthFileRole = file.role;
      script.dataset.routeContract = CONTRACT;

      script.onload = () => {
        try {
          if (file.validate(window[file.global])) {
            state.loaded.push(file.role);
          } else {
            state.failed.push(`${file.role}:invalid`);
          }
        } catch (error) {
          state.failed.push(`${file.role}:validate-error`);
        }

        status(`child-${file.role}-checked`);
        resolve();
      };

      script.onerror = () => {
        state.failed.push(`${file.role}:load-error`);
        status(`child-${file.role}-load-error`);
        resolve();
      };

      document.head.appendChild(script);
    });
  }

  async function auditChildren() {
    for (const file of CHILD_FILES) {
      await loadChild(file);
    }

    state.childAuditComplete = true;
    status("visible-ready-child-audit-complete");
  }

  function boot() {
    disposePrior();
    removeChildScripts();

    const mount = mountNode();
    const canvas = mountRecoveryGlobe(mount);

    state.mounted = true;
    state.canvasFound = Boolean(canvas);
    state.controlsBound = true;
    state.recoveryRenderer = true;
    state.error = "";

    status("visible-recovery-mounted");

    auditChildren();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
