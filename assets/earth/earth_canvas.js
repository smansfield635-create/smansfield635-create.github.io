/* /assets/earth/earth_canvas.js
   EARTH_G6_256_LATTICE_PHYSICS_SYNTHETIC_SATELLITE_VIEW_TNT_v1
   Full-file replacement.

   Scope:
   - Earth canvas/source authority only.
   - Generates satellite-view Earth from 256-state lattice and physics telemetry.
   - No NASA dependency.
   - No JPG dependency.
   - No static surface PNG dependency.
   - No cartoon fallback.
   - No GraphicBox.
   - No image generation.
   - No visual-pass claim.
*/

(function () {
  "use strict";

  const VERSION = "EARTH_G6_256_LATTICE_PHYSICS_SYNTHETIC_SATELLITE_VIEW_TNT_v1";
  const PREVIOUS_VERSION = "EARTH_G5_NON_NASA_SATELLITE_DERIVED_NATURAL_GLOBE_TNT_v1";

  const DEPENDENCIES = [
    {
      key: "lattice",
      global: "DGBEarthLattice256",
      path: "/assets/earth/earth_lattice_256.js"
    },
    {
      key: "sensor",
      global: "DGBEarthPhysicsSensor",
      path: "/assets/earth/earth_physics_sensor.js"
    },
    {
      key: "atmosphere",
      global: "DGBEarthAtmosphereModel",
      path: "/assets/earth/earth_atmosphere_model.js"
    }
  ];

  const DEFAULTS = Object.freeze({
    maxInternalPixels: 620,
    axialTiltDegrees: 23.44,
    surfaceAutoStep: 0.00042,
    cloudAutoStep: 0.00018,
    dragLongitudeFactor: 0.00145,
    releaseFriction: 0.945,
    minVelocity: 0.000012,
    minZoom: 0.9,
    maxZoom: 1.18,
    initialZoom: 1,
    initialPhase: 0.18,
    initialCloudPhase: 0.08
  });

  const instanceStore = new WeakMap();
  let dependencyPromise = null;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function number(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function depsAvailable() {
    return DEPENDENCIES.every((dep) => Boolean(window[dep.global]));
  }

  function readDeps() {
    return {
      lattice: window.DGBEarthLattice256 || null,
      sensorFactory: window.DGBEarthPhysicsSensor || null,
      atmosphere: window.DGBEarthAtmosphereModel || null
    };
  }

  function loadScript(path) {
    return new Promise((resolve) => {
      const existing = document.querySelector('script[src^="' + path + '"],script[src*="' + path + '?"]');

      if (existing) {
        if (existing.dataset.loaded === "true") {
          resolve(true);
          return;
        }

        existing.addEventListener("load", () => resolve(true), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = path + "?v=" + encodeURIComponent(VERSION);
      script.defer = true;
      script.dataset.earthG6Dependency = "true";

      script.addEventListener("load", () => {
        script.dataset.loaded = "true";
        resolve(true);
      }, { once: true });

      script.addEventListener("error", () => resolve(false), { once: true });

      document.head.appendChild(script);
    });
  }

  function ensureDependencies() {
    if (depsAvailable()) return Promise.resolve(true);
    if (dependencyPromise) return dependencyPromise;

    dependencyPromise = Promise
      .all(DEPENDENCIES.map((dep) => window[dep.global] ? Promise.resolve(true) : loadScript(dep.path)))
      .then(() => depsAvailable())
      .catch(() => false);

    return dependencyPromise;
  }

  function safeDispatch(name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    } catch (error) {}
  }

  function exposeReceipt(extra) {
    window.DGB_EARTH_G6_SYNTHETIC_RECEIPT = Object.assign(
      {
        contract: VERSION,
        previousContract: PREVIOUS_VERSION,
        route: "/showroom/globe/earth/",
        authority: "/assets/earth/earth_canvas.js",
        body: "earth",
        label: "Earth",
        generation: "G6_256_LATTICE_PHYSICS_SYNTHETIC_SATELLITE_VIEW",
        sourceStandard: "PHYSICS_SYNTHETIC_SATELLITE_VIEW",
        baseSurface: "generated_from_256_lattice",
        staticSurfaceDependency: false,
        nasaReference: "forbidden",
        jpgSurface: "forbidden",
        pngSurfaceRequired: false,
        proceduralCartoonFallback: "forbidden",
        axialTiltDegrees: DEFAULTS.axialTiltDegrees,
        owns: [
          "canvas_drawing",
          "sphere_projection",
          "lattice_state_sampling_into_pixels",
          "rotation_touch_inertia",
          "physics_synthetic_satellite_view"
        ],
        doesNotOwn: [
          "runtime_lifecycle",
          "material_css",
          "route_shell",
          "Audralia",
          "Gauges",
          "Products",
          "Sun",
          "Moon",
          "global_files",
          "GraphicBox",
          "image_generation",
          "visual_pass_claim"
        ],
        generatedImage: false,
        graphicBox: false,
        visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION",
        visualPassClaimed: false,
        timestamp: new Date().toISOString()
      },
      extra || {}
    );

    document.documentElement.dataset.earthG6SyntheticReceipt = VERSION;
    document.documentElement.dataset.earthSourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
    document.documentElement.dataset.earthBaseSurface = "generated-from-256-lattice";
    document.documentElement.dataset.earthStaticSurfaceDependency = "false";
    document.documentElement.dataset.earthGeneratedImage = "false";
    document.documentElement.dataset.earthGraphicBox = "false";
    document.documentElement.dataset.earthVisualPassClaimed = "false";
  }

  function createProfile(overrides) {
    return Object.assign(
      {
        id: "earth",
        label: "Earth",
        route: "/showroom/globe/earth/",
        authority: "/assets/earth/earth_canvas.js",
        version: VERSION,
        previousVersion: PREVIOUS_VERSION,
        generation: "G6_256_LATTICE_PHYSICS_SYNTHETIC_SATELLITE_VIEW",
        sourceStandard: "PHYSICS_SYNTHETIC_SATELLITE_VIEW",
        baseSurface: "generated_from_256_lattice",
        staticSurfaceDependency: false,
        axialTiltDegrees: DEFAULTS.axialTiltDegrees,
        canvasBoundary: "fixed",
        sphereMask: "fixed",
        projectionSampling: "locked",
        touchModel: "horizontal-drag-only",
        materialAuthority: "/assets/earth/earth_material.css",
        latticeAuthority: "/assets/earth/earth_lattice_256.js",
        physicsAuthority: "/assets/earth/earth_physics_sensor.js",
        atmosphereAuthority: "/assets/earth/earth_atmosphere_model.js",
        nasaReference: "forbidden",
        jpgSurface: "forbidden",
        proceduralCartoonFallback: "forbidden",
        generatedImage: false,
        graphicBox: false,
        visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION",
        visualPassClaimed: false
      },
      overrides || {}
    );
  }

  function createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.className = "earth-g6-canvas earth-g5-canvas earth-g4-canvas earth-material-canvas earth-reference-canvas";
    canvas.dataset.body = "earth";
    canvas.dataset.authority = "/assets/earth/earth_canvas.js";
    canvas.dataset.version = VERSION;
    canvas.dataset.previousVersion = PREVIOUS_VERSION;
    canvas.dataset.sourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
    canvas.dataset.baseSurface = "generated-from-256-lattice";
    canvas.dataset.staticSurfaceDependency = "false";
    canvas.dataset.touchModel = "horizontal-drag-only";
    canvas.dataset.projectionSampling = "locked";
    canvas.dataset.materialAuthority = "/assets/earth/earth_material.css";
    canvas.dataset.latticeAuthority = "/assets/earth/earth_lattice_256.js";
    canvas.dataset.physicsAuthority = "/assets/earth/earth_physics_sensor.js";
    canvas.dataset.atmosphereAuthority = "/assets/earth/earth_atmosphere_model.js";
    canvas.dataset.nasaReference = "forbidden";
    canvas.dataset.jpgAllowed = "false";
    canvas.dataset.proceduralFallback = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.visualPassClaimed = "false";
    canvas.dataset.publicReceipts = "hidden";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Physics synthetic satellite-view Earth generated from 256-state lattice");
    canvas.style.transform = "none";
    canvas.style.touchAction = "none";
    return canvas;
  }

  function createFrame(canvas) {
    const frame = document.createElement("div");
    frame.className = "earth-material-frame earth-satellite-frame earth-g6-frame";
    frame.dataset.earthMaterialFrame = "true";
    frame.dataset.contract = VERSION;
    frame.dataset.previousContract = PREVIOUS_VERSION;
    frame.appendChild(canvas);
    return frame;
  }

  function createLabel() {
    const label = document.createElement("div");
    label.className = "earth-reference-label earth-satellite-label";
    label.textContent = "256 LATTICE SYNTHETIC SATELLITE VIEW";
    label.setAttribute("aria-hidden", "true");
    label.dataset.sourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
    return label;
  }

  function resize(canvas, mount, state) {
    const rect = mount && mount.getBoundingClientRect ? mount.getBoundingClientRect() : null;
    const available = rect && rect.width ? rect.width : window.innerWidth - 32;
    const cssSize = Math.max(280, Math.min(660, Math.floor(available * 0.92)));
    const dpr = Math.max(1, Math.min(1.5, window.devicePixelRatio || 1));
    const px = Math.max(320, Math.min(state.options.maxInternalPixels, Math.floor(cssSize * dpr)));

    if (canvas.width !== px || canvas.height !== px) {
      canvas.width = px;
      canvas.height = px;
    }

    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    state.size = px;
    state.cssSize = cssSize;
  }

  function drawHold(ctx, state, message) {
    const size = state.size || 512;
    const center = size / 2;
    const radius = size * 0.405;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.clip();

    const hold = ctx.createRadialGradient(center - radius * 0.2, center - radius * 0.2, radius * 0.08, center, center, radius);
    hold.addColorStop(0, "rgba(28,64,105,0.32)");
    hold.addColorStop(0.70, "rgba(7,18,34,0.34)");
    hold.addColorStop(1, "rgba(0,0,0,0.54)");
    ctx.fillStyle = hold;
    ctx.fillRect(center - radius, center - radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(188,223,255,0.30)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(247,241,222,0.72)";
    ctx.font = "700 " + Math.max(10, Math.floor(size * 0.024)) + "px ui-monospace, Menlo, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.fillText(message || "EARTH G6 HOLD", center, center);
    ctx.restore();
  }

  function drawFrame(state) {
    const canvas = state.canvas;
    const ctx = state.ctx;

    resize(canvas, state.mount, state);

    const deps = readDeps();

    if (!deps.lattice || !deps.sensorFactory || !deps.atmosphere || !state.sensor) {
      canvas.dataset.renderHold = "waiting-for-g6-physics-dependencies";
      drawHold(ctx, state, "WAITING FOR G6 PHYSICS");
      return;
    }

    const size = canvas.width;
    const image = ctx.createImageData(size, size);
    const data = image.data;
    const center = size / 2;
    const radius = size * 0.405 * clamp(state.zoom, state.options.minZoom, state.options.maxZoom);
    const radiusSq = radius * radius;

    const telemetry = state.sensor.getTelemetry({
      surfacePhase: state.surfacePhase,
      cloudPhase: state.cloudPhase,
      userPhase: state.userPhase
    });

    const timeSeconds = telemetry.seconds;

    for (let py = 0; py < size; py += 1) {
      const dy = (py + 0.5 - center) / radius;

      for (let px = 0; px < size; px += 1) {
        const dx = (px + 0.5 - center) / radius;
        const rr = dx * dx + dy * dy;
        const idx = (py * size + px) * 4;

        if (rr > 1) {
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
          data[idx + 3] = 0;
          continue;
        }

        const z = Math.sqrt(Math.max(0, 1 - rr));
        const normal = { x: dx, y: -dy, z };
        const coords = state.sensor.surfaceCoordinates(normal, telemetry, "surface");
        const cloudCoords = state.sensor.surfaceCoordinates(normal, telemetry, "cloud");

        const sample = deps.lattice.sample(coords.lat, coords.lon, {
          timeSeconds,
          cloudPhase: telemetry.cloudPhase
        });

        const cloudSample = deps.lattice.sample(cloudCoords.lat, cloudCoords.lon, {
          timeSeconds,
          cloudPhase: telemetry.cloudPhase
        });

        sample.cloudAlpha = Math.max(sample.cloudAlpha, cloudSample.cloudAlpha * 0.78);

        const shaded = deps.atmosphere.shade(sample, normal, telemetry);

        data[idx] = shaded[0];
        data[idx + 1] = shaded[1];
        data[idx + 2] = shaded[2];
        data[idx + 3] = shaded[3];
      }
    }

    ctx.putImageData(image, 0, 0);

    canvas.dataset.renderHold = "false";
    canvas.dataset.surfacePhase = state.surfacePhase.toFixed(5);
    canvas.dataset.cloudPhase = state.cloudPhase.toFixed(5);
    canvas.dataset.userPhase = state.userPhase.toFixed(5);
    canvas.dataset.zoom = state.zoom.toFixed(3);
    canvas.dataset.generatedFromLattice = "true";
  }

  function setDatasets(mount, state) {
    if (!mount) return;

    mount.classList.add("earth-material-stage", "earth-satellite-stage", "earth-g6-stage");
    mount.dataset.body = "earth";
    mount.dataset.version = VERSION;
    mount.dataset.previousVersion = PREVIOUS_VERSION;
    mount.dataset.sourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
    mount.dataset.baseSurface = "generated-from-256-lattice";
    mount.dataset.staticSurfaceDependency = "false";
    mount.dataset.materialAuthority = "/assets/earth/earth_material.css";
    mount.dataset.canvasAuthority = "/assets/earth/earth_canvas.js";
    mount.dataset.latticeAuthority = "/assets/earth/earth_lattice_256.js";
    mount.dataset.physicsAuthority = "/assets/earth/earth_physics_sensor.js";
    mount.dataset.atmosphereAuthority = "/assets/earth/earth_atmosphere_model.js";
    mount.dataset.axialTiltDegrees = String(DEFAULTS.axialTiltDegrees);
    mount.dataset.touchModel = "horizontal-drag-only";
    mount.dataset.nasaReference = "forbidden";
    mount.dataset.jpgAllowed = "false";
    mount.dataset.proceduralFallback = "false";
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.visualPassClaimed = "false";
    mount.dataset.publicReceipts = "hidden";

    if (state) {
      mount.dataset.surfacePhase = state.surfacePhase.toFixed(5);
      mount.dataset.cloudPhase = state.cloudPhase.toFixed(5);
      mount.dataset.userPhase = state.userPhase.toFixed(5);
    }
  }

  function attachControls(state) {
    const canvas = state.canvas;

    function down(event) {
      state.dragging = true;
      state.lastX = event.clientX;
      state.velocityX = 0;
      canvas.dataset.dragging = "true";

      if (canvas.setPointerCapture && event.pointerId !== undefined) {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch (error) {}
      }

      if (event.cancelable) event.preventDefault();
    }

    function move(event) {
      if (!state.dragging) return;

      const dx = event.clientX - state.lastX;
      state.lastX = event.clientX;

      const delta = -dx * state.options.dragLongitudeFactor;

      state.userPhase = wrap01(state.userPhase + delta);
      state.velocityX = delta * 0.58;

      drawFrame(state);
      setDatasets(state.mount, state);

      if (event.cancelable) event.preventDefault();
    }

    function up() {
      state.dragging = false;
      canvas.dataset.dragging = "false";
    }

    canvas.addEventListener("pointerdown", down, { passive: false });
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    state.cleanup.push(function () {
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    });
  }

  function attachResize(state) {
    function onResize() {
      drawFrame(state);
      setDatasets(state.mount, state);
    }

    window.addEventListener("resize", onResize, { passive: true });

    state.cleanup.push(function () {
      window.removeEventListener("resize", onResize);
    });
  }

  function tick(state) {
    if (!state.running) return;

    state.surfacePhase = wrap01(state.surfacePhase + state.options.surfaceAutoStep + state.velocityX);
    state.cloudPhase = wrap01(state.cloudPhase + state.options.cloudAutoStep + state.velocityX * 0.42);
    state.velocityX *= state.options.releaseFriction;

    if (Math.abs(state.velocityX) < state.options.minVelocity) {
      state.velocityX = 0;
    }

    drawFrame(state);
    setDatasets(state.mount, state);

    state.raf = window.requestAnimationFrame(function () {
      tick(state);
    });
  }

  function hiddenReceipt() {
    const node = document.createElement("div");
    node.hidden = true;
    node.setAttribute("aria-hidden", "true");
    node.className = "earth-g6-hidden-receipt earth-g5-hidden-receipt earth-g4-hidden-receipt";
    node.dataset.contract = VERSION;
    node.dataset.previousContract = PREVIOUS_VERSION;
    node.dataset.canvas = "/assets/earth/earth_canvas.js";
    node.dataset.lattice = "/assets/earth/earth_lattice_256.js";
    node.dataset.physics = "/assets/earth/earth_physics_sensor.js";
    node.dataset.atmosphere = "/assets/earth/earth_atmosphere_model.js";
    node.dataset.sourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
    node.dataset.baseSurface = "generated-from-256-lattice";
    node.dataset.staticSurfaceDependency = "false";
    node.dataset.nasaReference = "forbidden";
    node.dataset.jpgAllowed = "false";
    node.dataset.proceduralFallback = "false";
    node.dataset.generatedImage = "false";
    node.dataset.graphicBox = "false";
    node.dataset.visualPassClaimed = "false";
    node.textContent = "EARTH_G6_256_LATTICE_PHYSICS_SYNTHETIC_SATELLITE_VIEW_TNT_v1 visual_pass=held";
    return node;
  }

  function normalizeOptions(options) {
    const input = options || {};

    return {
      maxInternalPixels: number(input.maxInternalPixels, DEFAULTS.maxInternalPixels),
      axialTiltDegrees: number(input.axialTiltDegrees, DEFAULTS.axialTiltDegrees),
      surfaceAutoStep: number(input.surfaceAutoStep, DEFAULTS.surfaceAutoStep),
      cloudAutoStep: number(input.cloudAutoStep, DEFAULTS.cloudAutoStep),
      dragLongitudeFactor: number(input.dragLongitudeFactor, DEFAULTS.dragLongitudeFactor),
      releaseFriction: number(input.releaseFriction, DEFAULTS.releaseFriction),
      minVelocity: number(input.minVelocity, DEFAULTS.minVelocity),
      minZoom: number(input.minZoom, DEFAULTS.minZoom),
      maxZoom: number(input.maxZoom, DEFAULTS.maxZoom),
      initialZoom: number(input.initialZoom, DEFAULTS.initialZoom),
      initialPhase: number(input.initialPhase, DEFAULTS.initialPhase),
      initialCloudPhase: number(input.initialCloudPhase, DEFAULTS.initialCloudPhase)
    };
  }

  function createInstance(mountTarget, options) {
    const target =
      typeof mountTarget === "string"
        ? document.querySelector(mountTarget)
        : mountTarget && mountTarget.nodeType === 1
          ? mountTarget
          : document.getElementById("earthRenderMount");

    if (!target) return null;

    const existing = instanceStore.get(target);
    if (existing && typeof existing.destroy === "function") existing.destroy();

    const normalized = normalizeOptions(options);
    const canvas = createCanvas();
    const frame = createFrame(canvas);
    const label = createLabel();
    const ctx = canvas.getContext("2d", { alpha: true });

    const state = {
      mount: target,
      canvas,
      frame,
      ctx,
      options: normalized,
      size: 0,
      cssSize: 0,
      running: false,
      dragging: false,
      raf: 0,
      surfacePhase: wrap01(normalized.initialPhase),
      cloudPhase: wrap01(normalized.initialCloudPhase),
      userPhase: 0,
      velocityX: 0,
      zoom: clamp(normalized.initialZoom, normalized.minZoom, normalized.maxZoom),
      sensor: null,
      cleanup: []
    };

    target.replaceChildren();
    target.appendChild(frame);
    target.appendChild(label);
    target.appendChild(hiddenReceipt());

    setDatasets(target, state);
    attachControls(state);
    attachResize(state);
    drawFrame(state);

    ensureDependencies().then(function (ready) {
      if (ready) {
        const deps = readDeps();

        state.sensor = deps.sensorFactory.create({
          axialTiltDegrees: normalized.axialTiltDegrees
        });

        canvas.dataset.physicsDependenciesReady = "true";
        drawFrame(state);
        setDatasets(target, state);

        exposeReceipt({
          mounted: true,
          dependenciesReady: true,
          lattice: deps.lattice && deps.lattice.version,
          physics: deps.sensorFactory && deps.sensorFactory.version,
          atmosphere: deps.atmosphere && deps.atmosphere.version
        });
      } else {
        canvas.dataset.physicsDependenciesReady = "false";
        exposeReceipt({
          mounted: true,
          dependenciesReady: false
        });
      }
    });

    function start() {
      if (state.running) return api;

      state.running = true;
      state.raf = window.requestAnimationFrame(function () {
        tick(state);
      });

      return api;
    }

    function stop() {
      state.running = false;

      if (state.raf) {
        window.cancelAnimationFrame(state.raf);
        state.raf = 0;
      }

      return api;
    }

    function reset() {
      state.surfacePhase = normalized.initialPhase;
      state.cloudPhase = normalized.initialCloudPhase;
      state.userPhase = 0;
      state.velocityX = 0;
      state.zoom = normalized.initialZoom;
      drawFrame(state);
      setDatasets(target, state);
      return api;
    }

    function destroy() {
      stop();
      state.cleanup.forEach(function (fn) { fn(); });
      state.cleanup = [];
      instanceStore.delete(target);
      return true;
    }

    function status() {
      return getStatus({
        running: state.running,
        dragging: state.dragging,
        surfacePhase: state.surfacePhase,
        cloudPhase: state.cloudPhase,
        userPhase: state.userPhase,
        dependenciesReady: Boolean(state.sensor && depsAvailable())
      });
    }

    const api = Object.freeze({
      mount: target,
      canvas,
      start,
      stop,
      reset,
      destroy,
      getStatus: status
    });

    instanceStore.set(target, api);
    start();

    exposeReceipt({
      booted: true,
      mounted: true,
      dependenciesReady: depsAvailable()
    });

    return api;
  }

  function renderEarth(mountTarget, options) {
    return createInstance(mountTarget, options);
  }

  function verifyAssets() {
    return ensureDependencies().then(function (ready) {
      const deps = readDeps();

      return {
        version: VERSION,
        previousVersion: PREVIOUS_VERSION,
        sourceStandard: "PHYSICS_SYNTHETIC_SATELLITE_VIEW",
        baseSurface: "generated_from_256_lattice",
        staticSurfaceDependency: false,
        pngSurfaceRequired: false,
        nasaReference: "forbidden",
        jpgAllowed: false,
        proceduralFallback: false,
        dependenciesReady: ready,
        lattice: deps.lattice ? deps.lattice.getStatus() : null,
        physics: deps.sensorFactory ? deps.sensorFactory.getStatus() : null,
        atmosphere: deps.atmosphere ? deps.atmosphere.getStatus() : null,
        surface: {
          path: "generated_from_256_lattice",
          ok: ready,
          mode: "physics_synthetic_satellite_view"
        },
        cloudsPrimary: {
          path: "generated_from_256_lattice_cloud_state",
          ok: ready,
          mode: "physics_synthetic_cloud_field"
        },
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      };
    });
  }

  function getStatus(extra) {
    return Object.assign(
      {
        version: VERSION,
        previousVersion: PREVIOUS_VERSION,
        body: "earth",
        label: "Earth",
        route: "/showroom/globe/earth/",
        authority: "/assets/earth/earth_canvas.js",
        generation: "G6_256_LATTICE_PHYSICS_SYNTHETIC_SATELLITE_VIEW",
        sourceStandard: "PHYSICS_SYNTHETIC_SATELLITE_VIEW",
        baseSurface: "generated_from_256_lattice",
        staticSurfaceDependency: false,
        axialTiltDegrees: DEFAULTS.axialTiltDegrees,
        touchModel: "horizontal-drag-only",
        canvasBoundary: "fixed",
        sphereMask: "fixed",
        projectionSampling: "locked",
        nasaReference: "forbidden",
        jpgSurface: "forbidden",
        jpgCloudFallback: "forbidden",
        proceduralCartoonFallback: "forbidden",
        generatedImage: false,
        graphicBox: false,
        visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION",
        visualPassClaimed: false
      },
      extra || {}
    );
  }

  function registerExtension(target) {
    if (!target || typeof target !== "object") return window.DGBEarthCanvas;

    if (typeof target.registerRenderer === "function") target.registerRenderer("earth", window.DGBEarthCanvas);
    if (typeof target.registerPlanet === "function") target.registerPlanet(createProfile(), window.DGBEarthCanvas);
    if (typeof target.registerExtension === "function") target.registerExtension("earth", window.DGBEarthCanvas);
    if (target.extensions && typeof target.extensions === "object") target.extensions.earth = window.DGBEarthCanvas;
    if (target.planets && typeof target.planets === "object") target.planets.earth = createProfile();

    return window.DGBEarthCanvas;
  }

  function autoRegister() {
    [
      window.DGBPlanetRegistry,
      window.DGBShowroomPlanetRegistry,
      window.DGBShowroomGlobeInstrument,
      window.DGBEarthRegistry
    ].forEach(function (registry) {
      if (registry) registerExtension(registry);
    });

    exposeReceipt({ autoRegistered: true });

    safeDispatch("dgb:earth-canvas-ready", {
      body: "earth",
      label: "Earth",
      version: VERSION,
      previousVersion: PREVIOUS_VERSION,
      api: window.DGBEarthCanvas,
      sourceStandard: "PHYSICS_SYNTHETIC_SATELLITE_VIEW",
      baseSurface: "generated_from_256_lattice",
      staticSurfaceDependency: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function runtimeScriptPresent() {
    return Boolean(
      document.querySelector('script[src*="/assets/earth/earth_assets_runtime.js"]') ||
      document.querySelector('script[src*="/runtime/earth_asset_runtime.js"]')
    );
  }

  function autoMount() {
    if (runtimeScriptPresent()) return;

    const target =
      document.getElementById("earthRenderMount") ||
      document.querySelector("[data-earth-render-mount]") ||
      document.querySelector("[data-body='earth'][data-render-mount]") ||
      document.querySelector("[data-dgb-earth-mount]");

    if (!target) return;
    renderEarth(target);
  }

  const api = Object.freeze({
    version: VERSION,
    previousVersion: PREVIOUS_VERSION,
    createProfile,
    renderEarth,
    renderSurface: renderEarth,
    render: renderEarth,
    mount: renderEarth,
    verifyAssets,
    getStatus,
    registerExtension
  });

  window.DGBEarthCanvas = api;
  window.DGBEarthCanvasAuthority = api;
  window.EarthCanvas = api;
  window.earthCanvas = api;

  exposeReceipt({
    booted: true,
    mounted: false,
    sourceStandard: "PHYSICS_SYNTHETIC_SATELLITE_VIEW",
    baseSurface: "generated_from_256_lattice",
    staticSurfaceDependency: false
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      autoRegister();
      autoMount();
    }, { once: true });
  } else {
    autoRegister();
    autoMount();
  }
})();
