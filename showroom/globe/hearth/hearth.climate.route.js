// /showroom/globe/hearth/hearth.climate.route.js
// HEARTH_SOURCE_ALIGNED_NATURAL_MATERIAL_ROUTE_TNT_v18
// Full-file replacement.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_SOURCE_ALIGNED_NATURAL_MATERIAL_ROUTE_TNT_v18";
  const RECEIPT = "HEARTH_SOURCE_ALIGNED_NATURAL_MATERIAL_ROUTE_RECEIPT_v18";
  const PREVIOUS_CONTRACT = "HEARTH_SOURCE_ALIGNED_VISIBLE_GLOBE_ROUTE_TNT_v17";
  const VERSION = "2026-05-10.hearth-source-aligned-natural-material-route-v18";
  const KEY = "hearth-natural-organic-material-route-v18";

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
    usingMaterials: false,
    usingCanvasConsumer: false,
    usingFallback: false,
    frames: 0,
    error: ""
  };

  function status(value) {
    const node =
      document.getElementById("hearth-route-status") ||
      document.querySelector("[data-hearth-route-status]");

    document.documentElement.dataset.hearthRouteControllerContract = CONTRACT;
    document.documentElement.dataset.hearthRouteControllerReceipt = RECEIPT;
    document.documentElement.dataset.hearthRoutePreviousContract = PREVIOUS_CONTRACT;
    document.documentElement.dataset.hearthRouteVersion = VERSION;
    document.documentElement.dataset.hearthActiveRouteFile = "/showroom/globe/hearth/hearth.climate.route.js";
    document.documentElement.dataset.hearthVisibleGlobeMounted = String(state.mounted);
    document.documentElement.dataset.hearthCanvasFound = String(state.canvasFound);
    document.documentElement.dataset.hearthControlsBound = String(state.controlsBound);
    document.documentElement.dataset.hearthUsingMaterials = String(state.usingMaterials);
    document.documentElement.dataset.hearthUsingCanvasConsumer = String(state.usingCanvasConsumer);
    document.documentElement.dataset.hearthUsingFallback = String(state.usingFallback);
    document.documentElement.dataset.hearthFrames = String(state.frames);
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    if (node) {
      node.textContent = [
        "Hearth natural-material route.",
        `Status ${value}`,
        `Route ${CONTRACT}`,
        `Receipt ${RECEIPT}`,
        `Previous ${PREVIOUS_CONTRACT}`,
        `Version ${VERSION}`,
        "Active route /showroom/globe/hearth/hearth.climate.route.js",
        `Loaded ${state.loaded.join(",") || "none"}`,
        `Failed ${state.failed.join(",") || "none"}`,
        `Mounted ${state.mounted}`,
        `Canvas found ${state.canvasFound}`,
        `Controls bound ${state.controlsBound}`,
        `Using materials ${state.usingMaterials}`,
        `Using canvas consumer ${state.usingCanvasConsumer}`,
        `Using fallback ${state.usingFallback}`,
        `Frames ${state.frames}`,
        "Hard child failure blanks globe false",
        "Generated image false",
        "GraphicBox false",
        "Visual pass claimed false",
        state.error ? `Error ${state.error}` : ""
      ].filter(Boolean).join("\n");
    }
  }

  function loadScript(role, src, validate) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.dataset.hearthFile = "true";
      script.dataset.hearthFileRole = role;
      script.dataset.hearthRouteContract = CONTRACT;

      script.onload = () => {
        let ok = false;

        try {
          ok = validate();
        } catch (_) {
          ok = false;
        }

        if (ok) {
          state.loaded.push(role);
        } else {
          state.failed.push(`${role}:invalid`);
        }

        status(`checked-${role}`);
        resolve(ok);
      };

      script.onerror = () => {
        state.failed.push(`${role}:load-error`);
        status(`failed-${role}`);
        resolve(false);
      };

      document.head.appendChild(script);
    });
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
    node.dataset.hearthRouteControllerContract = CONTRACT;
    node.style.touchAction = "none";
    node.style.userSelect = "none";
    node.querySelectorAll("canvas").forEach((canvas) => canvas.remove());

    return node;
  }

  function bootNaturalCanvas(mount) {
    if (!window.HEARTH_MATERIALS || !window.HEARTH_CANVAS) return false;
    if (typeof window.HEARTH_CANVAS.mount !== "function") return false;

    const api = window.HEARTH_CANVAS.mount(mount, {
      materials: window.HEARTH_MATERIALS,
      routeContract: CONTRACT,
      routeReceipt: RECEIPT,
      onStatus: (value, info) => {
        state.frames = info.frames || state.frames;
        state.mounted = Boolean(info.mounted);
        state.canvasFound = Boolean(info.canvasFound);
        state.controlsBound = Boolean(info.controlsBound);
        state.usingMaterials = true;
        state.usingCanvasConsumer = true;
        state.usingFallback = false;
        status(`canvas-${value}`);
      }
    });

    state.mounted = Boolean(api && api.canvas);
    state.canvasFound = Boolean(api && api.canvas);
    state.controlsBound = true;
    state.usingMaterials = true;
    state.usingCanvasConsumer = true;
    state.usingFallback = false;

    status("natural-canvas-mounted");

    return true;
  }

  function bootFallback(mount) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: true });

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";

    canvas.dataset.hearthFallbackCanvas = "true";
    canvas.dataset.hearthRouteControllerContract = CONTRACT;
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.visualPassClaimed = "false";

    mount.appendChild(canvas);

    mount.querySelectorAll("[data-hearth-mount-fallback]").forEach((fallback) => {
      fallback.hidden = true;
      fallback.style.display = "none";
    });

    const body = [
      { lat: 78 * DEG, lon: -20 * DEG, rx: 42 * DEG, ry: 13 * DEG, angle: -10 * DEG },
      { lat: 1 * DEG, lon: -8 * DEG, rx: 64 * DEG, ry: 28 * DEG, angle: -8 * DEG },
      { lat: 44 * DEG, lon: -104 * DEG, rx: 32 * DEG, ry: 17 * DEG, angle: 28 * DEG },
      { lat: 34 * DEG, lon: 104 * DEG, rx: 34 * DEG, ry: 16 * DEG, angle: -24 * DEG },
      { lat: -24 * DEG, lon: 142 * DEG, rx: 38 * DEG, ry: 20 * DEG, angle: 18 * DEG },
      { lat: -38 * DEG, lon: -122 * DEG, rx: 36 * DEG, ry: 18 * DEG, angle: -30 * DEG },
      { lat: -59 * DEG, lon: 36 * DEG, rx: 40 * DEG, ry: 14 * DEG, angle: 9 * DEG }
    ];

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function smoothstep(edge0, edge1, x) {
      const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
      return t * t * (3 - 2 * t);
    }

    function mix(a, b, t) {
      const k = clamp(t, 0, 1);
      return [
        Math.round(a[0] + (b[0] - a[0]) * k),
        Math.round(a[1] + (b[1] - a[1]) * k),
        Math.round(a[2] + (b[2] - a[2]) * k)
      ];
    }

    function wrapPi(value) {
      return Math.atan2(Math.sin(value), Math.cos(value));
    }

    function field(u, v) {
      const lon = (u - 0.5) * TAU;
      const lat = (0.5 - v) * Math.PI;
      let best = -20;

      for (const mass of body) {
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
        const chip = Math.sin(theta * 9) * 0.07 + Math.sin(theta * 17) * 0.035;
        best = Math.max(best, 1 - dist + chip);
      }

      return best;
    }

    function colorAt(u, v) {
      const f = field(u, v);

      if (f <= 0) {
        const shelf = smoothstep(-0.25, 0.02, f);
        return mix([3, 18, 43], [19, 96, 124], shelf * 0.7);
      }

      const latCold = Math.abs(v - 0.5) * 2;
      const coast = 1 - smoothstep(0.02, 0.15, Math.abs(f));
      let c = latCold > 0.68 ? [164, 184, 178] : [121, 148, 83];

      if (v > 0.38 && v < 0.62) c = [170, 149, 83];
      if (f > 0.34 && ((u * 11 + v * 7) % 1) > 0.58) c = [48, 108, 65];

      c = mix(c, [207, 181, 116], coast * 0.2);
      return c;
    }

    let yaw = -0.28;
    let tilt = -0.18;
    let yawVelocity = 0.0022;
    let tiltVelocity = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    function resize() {
      const box = mount.getBoundingClientRect();
      const cssSize = Math.max(280, Math.floor(Math.min(box.width || 420, box.height || box.width || 420)));
      const dpr = Math.min(1.7, window.devicePixelRatio || 1);
      const size = Math.min(560, Math.max(340, Math.floor(cssSize * dpr)));

      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
      }
    }

    function render() {
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
          let c = colorAt(u, v);

          const light = clamp(0.42 + z * 0.58 - sx * 0.08 - sy * 0.07, 0.18, 1.08);
          c = [Math.round(c[0] * light), Math.round(c[1] * light), Math.round(c[2] * light)];
          c = mix(c, [5, 16, 31], smoothstep(0.74, 1, rr) * 0.46);

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
        if (Math.abs(yawVelocity) < 0.00125) yawVelocity = 0.00125;
        tilt = clamp(tilt, -1.3, 1.3);
      }

      state.frames += 1;
      if (state.frames < 4 || state.frames % 90 === 0) status("fallback-rendering");
      requestAnimationFrame(render);
    }

    function down(event) {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      yawVelocity = 0;
      tiltVelocity = 0;
      canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    }

    function move(event) {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      yaw += dx * 0.009;
      tilt += dy * 0.0075;
      tilt = clamp(tilt, -1.36, 1.36);
      yawVelocity = dx * 0.00085;
      tiltVelocity = dy * 0.00055;
      event.preventDefault();
    }

    function up(event) {
      dragging = false;
      canvas.releasePointerCapture?.(event.pointerId);
      event.preventDefault();
    }

    canvas.addEventListener("pointerdown", down, { passive: false });
    canvas.addEventListener("pointermove", move, { passive: false });
    canvas.addEventListener("pointerup", up, { passive: false });
    canvas.addEventListener("pointercancel", up, { passive: false });

    window.__HEARTH_VISIBLE_RECOVERY_DISPOSE__ = () => {
      canvas.remove();
    };

    state.mounted = true;
    state.canvasFound = true;
    state.controlsBound = true;
    state.usingMaterials = false;
    state.usingCanvasConsumer = false;
    state.usingFallback = true;

    status("fallback-mounted");
    requestAnimationFrame(render);
  }

  async function boot() {
    const mount = mountNode();

    status("booting");

    const materialsLoaded = await loadScript(
      "materials",
      `/assets/hearth/hearth.materials.js?v=${KEY}-${Date.now()}`,
      () => Boolean(window.HEARTH_MATERIALS && typeof window.HEARTH_MATERIALS.createTextureCanvas === "function")
    );

    const canvasLoaded = await loadScript(
      "canvas",
      `/assets/hearth/hearth.canvas.js?v=${KEY}-${Date.now()}`,
      () => Boolean(window.HEARTH_CANVAS && typeof window.HEARTH_CANVAS.mount === "function")
    );

    if (materialsLoaded && canvasLoaded) {
      try {
        if (bootNaturalCanvas(mount)) return;
      } catch (error) {
        state.failed.push("natural-canvas:mount-error");
        state.error = error?.message || String(error);
        status("natural-canvas-failed");
      }
    }

    bootFallback(mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
