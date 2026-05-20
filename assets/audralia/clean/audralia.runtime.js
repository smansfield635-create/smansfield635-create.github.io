// /assets/audralia/clean/audralia.runtime.js
// AUDRALIA_CLEAN_CANVAS_RUNTIME_TNT_v1
// Full-file replacement.
// File 13 of 16.
// Planet Audralia runtime / motion-only authority.
// Purpose:
// - Establishes Audralia-specific runtime motion authority.
// - Owns spin, glide, frame pacing, resize state, reduced-motion handling, timing state, and motion snapshots.
// - Provides motion state to controls, canvas, and engine without owning their responsibilities.
// - Does not create land/ocean footprint.
// - Does not create water behavior.
// - Does not create elevation.
// - Does not create climate fields.
// - Does not create biome categories.
// - Does not synthesize surface material.
// - Does not create atmosphere/weather.
// - Does not attach pointer/touch listeners.
// - Does not render canvas.
// - Does not own controls, canvas composition, route bridge, or HTML shell.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_CLEAN_CANVAS_RUNTIME_TNT_v1";
  const RECEIPT = "AUDRALIA_CLEAN_CANVAS_RUNTIME_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_ATMOSPHERE_TNT_v1";
  const VERSION = "2026-05-20.audralia-clean-canvas-runtime-v1";

  const FILE_NUMBER = 13;
  const PRIMARY_NODE = 13;
  const SUBNODE_RANGE = Object.freeze([193, 208]);

  const UNIVERSAL_ANCHOR = "/showroom/globe/";
  const AUDRALIA_ROUTE = "/showroom/globe/audralia/";
  const H_EARTH_ROUTE = "/showroom/globe/h-earth/";

  const PHI = 1.618033988749895;
  const TAU = Math.PI * 2;
  const DEFAULT_DPR_CAP = 1.65;

  const RUNTIME_TARGETS = Object.freeze({
    spin: true,
    glide: true,
    framePacing: true,
    resizeState: true,
    reducedMotionHandling: true,
    timingState: true,
    motionSnapshots: true,
    ownsMotionOnly: true,
    ownsControls: false,
    ownsCanvas: false,
    ownsRoute: false,
    ownsHtml: false
  });

  const DEFAULTS = Object.freeze({
    rotation: -0.88,
    tilt: -0.11,
    targetRotation: -0.88,
    targetTilt: -0.11,
    minTilt: -0.58,
    maxTilt: 0.48,
    autoSpinRadiansPerMs: 0.000035,
    glideStrength: 0.155,
    tiltGlideStrength: 0.135,
    frameBudgetMs: 42,
    maxDeltaMs: 64,
    idleSettleEpsilon: 0.00005,
    reducedMotionAutoSpin: false,
    width: 1,
    height: 1,
    dpr: 1,
    radius: 180,
    cx: 0,
    cy: 0,
    sphereSize: 420,
    paused: false,
    visible: true,
    autoSpin: true
  });

  function M() {
    return window.DGB_PLANET_FAMILY_MATH || window.AUDRALIA_CLEAN_CANVAS_MATH || null;
  }

  function finite(value, fallback = 0) {
    const helper = M();
    if (helper?.finite) return helper.finite(value, fallback);
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    const helper = M();
    if (helper?.clamp) return helper.clamp(value, min, max);
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function clamp01(value) {
    const helper = M();
    if (helper?.clamp01) return helper.clamp01(value);
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    const helper = M();
    if (helper?.lerp) return helper.lerp(a, b, t);
    return finite(a, 0) + (finite(b, 0) - finite(a, 0)) * clamp01(t);
  }

  function wrapRadians(value) {
    const helper = M();
    if (helper?.wrapRadians) return helper.wrapRadians(value);

    let out = finite(value, 0);
    while (out < -Math.PI) out += TAU;
    while (out > Math.PI) out -= TAU;
    return out;
  }

  function nowMs() {
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      return performance.now();
    }

    return Date.now();
  }

  function readReducedMotion() {
    try {
      return Boolean(
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch {
      return false;
    }
  }

  function readDevicePixelRatio(maxDpr = DEFAULT_DPR_CAP) {
    const native = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    return clamp(native, 1, finite(maxDpr, DEFAULT_DPR_CAP));
  }

  function cloneState(state) {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "audralia-motion-only-runtime",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,

      rotation: state.rotation,
      targetRotation: state.targetRotation,
      tilt: state.tilt,
      targetTilt: state.targetTilt,
      minTilt: state.minTilt,
      maxTilt: state.maxTilt,

      width: state.width,
      height: state.height,
      dpr: state.dpr,
      radius: state.radius,
      cx: state.cx,
      cy: state.cy,
      sphereSize: state.sphereSize,

      frameBudgetMs: state.frameBudgetMs,
      lastTime: state.lastTime,
      lastRenderTime: state.lastRenderTime,
      deltaMs: state.deltaMs,
      elapsedMs: state.elapsedMs,
      frame: state.frame,

      paused: state.paused,
      visible: state.visible,
      autoSpin: state.autoSpin,
      reducedMotion: state.reducedMotion,
      interacting: state.interacting,
      dirty: state.dirty,
      settled: state.settled,

      ownsRuntime: true,
      ownsMotionOnly: true,
      ownsControls: false,
      ownsCanvas: false,
      ownsRoute: false,
      ownsHtml: false,
      ownsFootprint: false,
      ownsHydrology: false,
      ownsElevation: false,
      ownsClimate: false,
      ownsBiome: false,
      ownsSurface: false,
      ownsAtmosphere: false,

      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function computeFramePacing(deltaMs, options = {}) {
    const dt = clamp(deltaMs, 0, finite(options.maxDeltaMs, DEFAULTS.maxDeltaMs));
    const frameBudgetMs = Math.max(8, finite(options.frameBudgetMs, DEFAULTS.frameBudgetMs));
    const pressure = clamp01(dt / frameBudgetMs);
    const fibonacciEase = clamp01(1 - Math.pow(1 - pressure, PHI));

    return Object.freeze({
      deltaMs: dt,
      frameBudgetMs,
      pressure,
      fibonacciEase,
      shouldRender: dt >= frameBudgetMs,
      shouldThrottle: pressure > 1,
      fpsApprox: dt > 0 ? Math.round(1000 / dt) : 0
    });
  }

  function computeResizeState(widthInput, heightInput, options = {}) {
    const width = Math.max(1, Math.floor(finite(widthInput, DEFAULTS.width)));
    const height = Math.max(1, Math.floor(finite(heightInput, DEFAULTS.height)));
    const dpr = readDevicePixelRatio(options.dprCap ?? DEFAULT_DPR_CAP);
    const pixelWidth = Math.max(1, Math.floor(width * dpr));
    const pixelHeight = Math.max(1, Math.floor(height * dpr));
    const radiusScale = finite(options.radiusScale, 0.365);
    const radius = Math.min(pixelWidth, pixelHeight) * radiusScale;
    const cx = pixelWidth * finite(options.cxRatio, 0.50);
    const cy = pixelHeight * finite(options.cyRatio, 0.51);
    const sphereSize = clamp(Math.floor(radius * 2), 340, 620);

    return Object.freeze({
      width,
      height,
      dpr,
      pixelWidth,
      pixelHeight,
      radius,
      cx,
      cy,
      sphereSize
    });
  }

  function normalizeOptions(options = {}) {
    return Object.freeze({
      rotation: finite(options.rotation, DEFAULTS.rotation),
      tilt: finite(options.tilt, DEFAULTS.tilt),
      targetRotation: finite(options.targetRotation, options.rotation ?? DEFAULTS.targetRotation),
      targetTilt: finite(options.targetTilt, options.tilt ?? DEFAULTS.targetTilt),
      minTilt: finite(options.minTilt, DEFAULTS.minTilt),
      maxTilt: finite(options.maxTilt, DEFAULTS.maxTilt),
      autoSpinRadiansPerMs: finite(options.autoSpinRadiansPerMs, DEFAULTS.autoSpinRadiansPerMs),
      glideStrength: clamp01(options.glideStrength ?? DEFAULTS.glideStrength),
      tiltGlideStrength: clamp01(options.tiltGlideStrength ?? DEFAULTS.tiltGlideStrength),
      frameBudgetMs: Math.max(8, finite(options.frameBudgetMs, DEFAULTS.frameBudgetMs)),
      maxDeltaMs: Math.max(16, finite(options.maxDeltaMs, DEFAULTS.maxDeltaMs)),
      idleSettleEpsilon: Math.max(0.000001, finite(options.idleSettleEpsilon, DEFAULTS.idleSettleEpsilon)),
      reducedMotionAutoSpin: Boolean(options.reducedMotionAutoSpin ?? DEFAULTS.reducedMotionAutoSpin),
      autoSpin: Boolean(options.autoSpin ?? DEFAULTS.autoSpin),
      paused: Boolean(options.paused ?? DEFAULTS.paused),
      visible: Boolean(options.visible ?? DEFAULTS.visible),
      dprCap: finite(options.dprCap, DEFAULT_DPR_CAP),
      radiusScale: finite(options.radiusScale, 0.365),
      cxRatio: finite(options.cxRatio, 0.50),
      cyRatio: finite(options.cyRatio, 0.51)
    });
  }

  function createRuntime(options = {}) {
    const opts = normalizeOptions(options);
    const start = nowMs();
    const resize = computeResizeState(options.width ?? DEFAULTS.width, options.height ?? DEFAULTS.height, opts);

    const state = {
      rotation: wrapRadians(opts.rotation),
      targetRotation: wrapRadians(opts.targetRotation),
      tilt: clamp(opts.tilt, opts.minTilt, opts.maxTilt),
      targetTilt: clamp(opts.targetTilt, opts.minTilt, opts.maxTilt),
      minTilt: Math.min(opts.minTilt, opts.maxTilt),
      maxTilt: Math.max(opts.minTilt, opts.maxTilt),

      autoSpinRadiansPerMs: opts.autoSpinRadiansPerMs,
      glideStrength: opts.glideStrength,
      tiltGlideStrength: opts.tiltGlideStrength,
      frameBudgetMs: opts.frameBudgetMs,
      maxDeltaMs: opts.maxDeltaMs,
      idleSettleEpsilon: opts.idleSettleEpsilon,
      reducedMotionAutoSpin: opts.reducedMotionAutoSpin,

      width: resize.width,
      height: resize.height,
      dpr: resize.dpr,
      pixelWidth: resize.pixelWidth,
      pixelHeight: resize.pixelHeight,
      radius: resize.radius,
      cx: resize.cx,
      cy: resize.cy,
      sphereSize: resize.sphereSize,

      lastTime: start,
      lastRenderTime: 0,
      deltaMs: 0,
      elapsedMs: 0,
      frame: 0,

      paused: opts.paused,
      visible: opts.visible,
      autoSpin: opts.autoSpin,
      reducedMotion: readReducedMotion(),
      interacting: false,
      dirty: true,
      settled: false,
      destroyed: false
    };

    function setVisible(value) {
      state.visible = Boolean(value);
      state.dirty = true;
      return cloneState(state);
    }

    function setPaused(value) {
      state.paused = Boolean(value);
      state.dirty = true;
      return cloneState(state);
    }

    function setAutoSpin(value) {
      state.autoSpin = Boolean(value);
      state.dirty = true;
      return cloneState(state);
    }

    function setInteracting(value) {
      state.interacting = Boolean(value);
      state.dirty = true;
      return cloneState(state);
    }

    function setReducedMotion(value) {
      state.reducedMotion = Boolean(value);
      state.dirty = true;
      return cloneState(state);
    }

    function refreshReducedMotion() {
      state.reducedMotion = readReducedMotion();
      state.dirty = true;
      return cloneState(state);
    }

    function setTarget(rotation, tilt) {
      state.targetRotation = wrapRadians(rotation);
      state.targetTilt = clamp(tilt, state.minTilt, state.maxTilt);
      state.dirty = true;
      state.settled = false;
      return cloneState(state);
    }

    function nudgeTarget(deltaRotation = 0, deltaTilt = 0) {
      state.targetRotation = wrapRadians(state.targetRotation + finite(deltaRotation, 0));
      state.targetTilt = clamp(state.targetTilt + finite(deltaTilt, 0), state.minTilt, state.maxTilt);
      state.dirty = true;
      state.settled = false;
      return cloneState(state);
    }

    function setRotation(rotation, tilt = state.tilt) {
      state.rotation = wrapRadians(rotation);
      state.targetRotation = state.rotation;
      state.tilt = clamp(tilt, state.minTilt, state.maxTilt);
      state.targetTilt = state.tilt;
      state.dirty = true;
      state.settled = true;
      return cloneState(state);
    }

    function resize(width, height, resizeOptions = {}) {
      const next = computeResizeState(width, height, {
        dprCap: resizeOptions.dprCap ?? opts.dprCap,
        radiusScale: resizeOptions.radiusScale ?? opts.radiusScale,
        cxRatio: resizeOptions.cxRatio ?? opts.cxRatio,
        cyRatio: resizeOptions.cyRatio ?? opts.cyRatio
      });

      state.width = next.width;
      state.height = next.height;
      state.dpr = next.dpr;
      state.pixelWidth = next.pixelWidth;
      state.pixelHeight = next.pixelHeight;
      state.radius = next.radius;
      state.cx = next.cx;
      state.cy = next.cy;
      state.sphereSize = next.sphereSize;
      state.dirty = true;

      return cloneState(state);
    }

    function update(timeInput) {
      if (state.destroyed) {
        return Object.freeze({
          state: cloneState(state),
          render: false,
          destroyed: true,
          reason: "runtime_destroyed"
        });
      }

      const current = finite(timeInput, nowMs());
      const rawDelta = current - state.lastTime;
      const dt = clamp(rawDelta, 0, state.maxDeltaMs);

      state.lastTime = current;
      state.deltaMs = dt;
      state.elapsedMs += dt;
      state.frame += 1;

      const pacing = computeFramePacing(current - state.lastRenderTime, {
        frameBudgetMs: state.frameBudgetMs,
        maxDeltaMs: state.maxDeltaMs
      });

      const canAutoSpin = Boolean(
        state.autoSpin &&
        state.visible &&
        !state.paused &&
        !state.interacting &&
        (!state.reducedMotion || state.reducedMotionAutoSpin)
      );

      if (canAutoSpin) {
        state.targetRotation = wrapRadians(state.targetRotation + dt * state.autoSpinRadiansPerMs);
      }

      if (!state.paused) {
        const rotationBefore = state.rotation;
        const tiltBefore = state.tilt;

        const rotationDelta = wrapRadians(state.targetRotation - state.rotation);
        state.rotation = wrapRadians(state.rotation + rotationDelta * state.glideStrength);
        state.tilt = lerp(state.tilt, state.targetTilt, state.tiltGlideStrength);

        const rotationMoved = Math.abs(wrapRadians(state.rotation - rotationBefore));
        const tiltMoved = Math.abs(state.tilt - tiltBefore);

        state.dirty = state.dirty || rotationMoved > state.idleSettleEpsilon || tiltMoved > state.idleSettleEpsilon || canAutoSpin;
        state.settled =
          Math.abs(wrapRadians(state.targetRotation - state.rotation)) <= state.idleSettleEpsilon &&
          Math.abs(state.targetTilt - state.tilt) <= state.idleSettleEpsilon &&
          !canAutoSpin;
      }

      const shouldRender = Boolean(
        state.visible &&
        (state.dirty || !state.settled) &&
        (current - state.lastRenderTime >= state.frameBudgetMs)
      );

      if (shouldRender) {
        state.lastRenderTime = current;
        state.dirty = false;
      }

      return Object.freeze({
        state: cloneState(state),
        pacing,
        render: shouldRender,
        reason: shouldRender ? "runtime_frame_ready" : "runtime_frame_held",
        ownsMotionOnly: true
      });
    }

    function forceRender(timeInput) {
      const current = finite(timeInput, nowMs());
      state.lastRenderTime = current;
      state.dirty = false;

      return Object.freeze({
        state: cloneState(state),
        render: true,
        reason: "runtime_force_render"
      });
    }

    function markDirty() {
      state.dirty = true;
      return cloneState(state);
    }

    function getState() {
      return cloneState(state);
    }

    function getMotionSnapshot() {
      return Object.freeze({
        rotation: state.rotation,
        targetRotation: state.targetRotation,
        tilt: state.tilt,
        targetTilt: state.targetTilt,
        radius: state.radius,
        cx: state.cx,
        cy: state.cy,
        width: state.width,
        height: state.height,
        pixelWidth: state.pixelWidth,
        pixelHeight: state.pixelHeight,
        dpr: state.dpr,
        sphereSize: state.sphereSize,
        visible: state.visible,
        paused: state.paused,
        autoSpin: state.autoSpin,
        reducedMotion: state.reducedMotion,
        interacting: state.interacting,
        frame: state.frame,
        elapsedMs: state.elapsedMs,
        ownsMotionOnly: true
      });
    }

    function destroy() {
      state.destroyed = true;
      state.paused = true;
      state.visible = false;
      state.dirty = false;
      return cloneState(state);
    }

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "audralia-motion-only-runtime-instance",

      setVisible,
      setPaused,
      setAutoSpin,
      setInteracting,
      setReducedMotion,
      refreshReducedMotion,
      setTarget,
      nudgeTarget,
      setRotation,
      resize,
      update,
      forceRender,
      markDirty,
      getState,
      getMotionSnapshot,
      destroy
    });
  }

  function validateManifestRegistration() {
    try {
      const manifest = window.DGB_PLANET_FAMILY_MANIFEST || window.AUDRALIA_CLEAN_CANVAS_MANIFEST;
      if (!manifest || typeof manifest.validatePrimaryFile !== "function") {
        return Object.freeze({
          manifestAvailable: false,
          valid: true,
          reason: "manifest_not_loaded_yet_runtime_can_still_register"
        });
      }

      return manifest.validatePrimaryFile({
        path: "/assets/audralia/clean/audralia.runtime.js",
        contract: CONTRACT
      });
    } catch (error) {
      return Object.freeze({
        manifestAvailable: true,
        valid: false,
        reason: error instanceof Error ? error.message : String(error)
      });
    }
  }

  function validatePriorAuthorities() {
    const math = M();
    const atmosphere = window.AUDRALIA_ATMOSPHERE || window.AUDRALIA_CLEAN_CANVAS_ATMOSPHERE || window.AUDRALIA_WEATHER || null;

    return Object.freeze({
      math: Object.freeze({
        available: Boolean(math),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1",
        actualContract: math?.contract || null,
        valid: !math || math.contract === "AUDRALIA_CLEAN_CANVAS_PLANET_FAMILY_MATH_TNT_v1"
      }),
      atmosphere: Object.freeze({
        available: Boolean(atmosphere),
        expectedContract: "AUDRALIA_CLEAN_CANVAS_ATMOSPHERE_TNT_v1",
        actualContract: atmosphere?.contract || null,
        valid: !atmosphere || atmosphere.contract === "AUDRALIA_CLEAN_CANVAS_ATMOSPHERE_TNT_v1"
      })
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "audralia-motion-only-runtime",
      fileNumber: FILE_NUMBER,
      primaryNode: PRIMARY_NODE,
      subnodes: SUBNODE_RANGE,
      parentAnchor: "/showroom/globe/audralia/index.js",
      universalParent: UNIVERSAL_ANCHOR,
      downstreamGroundView: H_EARTH_ROUTE,
      targets: RUNTIME_TARGETS,
      defaults: DEFAULTS,
      owns: Object.freeze([
        "spin",
        "glide",
        "motion timing",
        "frame pacing",
        "resize state",
        "reduced-motion handling",
        "motion snapshots",
        "runtime dirty/settled state"
      ]),
      doesNotOwn: Object.freeze([
        "universal manifest law",
        "math primitives",
        "lattice authority",
        "palette constants",
        "Audralia identity",
        "land/ocean footprint",
        "continent creation",
        "water behavior",
        "hydrology authority",
        "elevation depth",
        "climate fields",
        "biome categories",
        "surface material synthesis",
        "atmosphere behavior",
        "weather behavior",
        "pointer listeners",
        "touch listeners",
        "controls",
        "canvas rendering",
        "canvas composition",
        "route bridge",
        "HTML expression"
      ]),
      manifestRegistration: validateManifestRegistration(),
      priorAuthorities: validatePriorAuthorities(),
      ownsMotionOnly: true,
      controlsForbidden: true,
      canvasRenderingForbidden: true,
      routeBridgeForbidden: true,
      htmlExpressionForbidden: true,
      fibonacciChronology: true,
      primaryStructure16: true,
      nodalConstruct256: true,
      oneFileOneJob: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const API = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,

    FILE_NUMBER,
    PRIMARY_NODE,
    SUBNODE_RANGE,
    UNIVERSAL_ANCHOR,
    AUDRALIA_ROUTE,
    H_EARTH_ROUTE,
    PHI,
    TAU,
    DEFAULTS,
    RUNTIME_TARGETS,

    createRuntime,
    computeFramePacing,
    computeResizeState,
    readReducedMotion,
    readDevicePixelRatio,
    validateManifestRegistration,
    validatePriorAuthorities,
    getStatus
  });

  window.AUDRALIA_RUNTIME = API;
  window.AUDRALIA_RUNTIME_RECEIPT = getStatus();

  window.AUDRALIA_CLEAN_CANVAS_RUNTIME = API;
  window.AUDRALIA_CLEAN_CANVAS_RUNTIME_RECEIPT = getStatus();

  if (typeof document !== "undefined" && document.documentElement?.dataset) {
    document.documentElement.dataset.audraliaRuntimeLoaded = "true";
    document.documentElement.dataset.audraliaRuntimeContract = CONTRACT;
    document.documentElement.dataset.audraliaRuntimeReceipt = RECEIPT;
    document.documentElement.dataset.audraliaRuntimeVersion = VERSION;
    document.documentElement.dataset.audraliaCleanCanvasRuntimeLoaded = "true";
    document.documentElement.dataset.audraliaCleanCanvasRuntimeContract = CONTRACT;
    document.documentElement.dataset.audraliaCleanCanvasRuntimeReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCleanCanvasRuntimeNode = String(PRIMARY_NODE);
    document.documentElement.dataset.audraliaCleanCanvasRuntimeSubnodes = "193-208";
    document.documentElement.dataset.audraliaRuntimeOwnsMotionOnly = "true";
    document.documentElement.dataset.audraliaRuntimeOwnsControls = "false";
    document.documentElement.dataset.audraliaRuntimeOwnsCanvas = "false";
    document.documentElement.dataset.audraliaRuntimeOwnsRoute = "false";
    document.documentElement.dataset.audraliaRuntimeOwnsHtml = "false";
    document.documentElement.dataset.audraliaRuntimeSpin = "true";
    document.documentElement.dataset.audraliaRuntimeGlide = "true";
    document.documentElement.dataset.audraliaRuntimeFramePacing = "true";
    document.documentElement.dataset.audraliaRuntimeResizeState = "true";
    document.documentElement.dataset.audraliaRuntimeReducedMotion = "true";
    document.documentElement.dataset.hEarthMayReceiveAudraliaRuntimeMotionState = "true";
    document.documentElement.dataset.audraliaCleanCanvasFibonacciChronology = "true";
    document.documentElement.dataset.audraliaCleanCanvasPrimaryStructure16 = "true";
    document.documentElement.dataset.audraliaCleanCanvasNodalConstruct256 = "true";
    document.documentElement.dataset.audraliaCleanCanvasOneFileOneJob = "true";
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
})();
