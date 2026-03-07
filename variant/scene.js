(function () {
  "use strict";

  const canvas = document.getElementById("scene");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const CAMERA = window.OPENWORLD_CAMERA;
  const BG = window.OPENWORLD_BACKGROUND_RENDERER;
  const COMPASS = window.OPENWORLD_COMPASS_RENDERER;
  const DRAGONS = window.OPENWORLD_DRAGON_RENDERER;
  const SHOWROOM = window.OPENWORLD_SHOWROOM_RENDERER;
  const FX = window.OPENWORLD_SCENE_FX;
  const INPUT = window.OPENWORLD_SCENE_INPUT;

  const KERNEL = window.WORLD_KERNEL || null;
  const REGIONS = window.ISLAND_REGIONS || null;
  const ROUTER = window.REGION_ROUTER || null;
  const ENV = window.ENVIRONMENT_RUNTIME || null;
  const HARBOR = window.HARBOR_RENDERER || null;

  if (!CAMERA || !BG || !COMPASS || !DRAGONS || !SHOWROOM || !FX || !INPUT) {
    console.error("OPENWORLD_SCENE_v1: missing required scene modules.");
    return;
  }

  const LOCAL_FACE_FALLBACK = Object.freeze({
    N: { label: "NORTH", short: "N", route: null, type: "locked" },
    E: { label: "EAST", short: "E", route: "/products/", type: "route" },
    S: { label: "SOUTH", short: "S", route: "/laws/", type: "route" },
    W: { label: "WEST", short: "W", route: "/gauges/", type: "route" },
    C: { label: "CORE", short: "CORE", route: null, type: "locked" },
    M: { label: "MORPH", short: "MORPH", route: null, type: "morph" },
  });

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function dispatch(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function getSceneLanguage() {
    try {
      const qs = new URLSearchParams(window.location.search || "");
      const q = qs.get("lang");
      const ls = window.localStorage.getItem("gd_lang");
      const lang = (q || ls || document.documentElement.lang || "en").toLowerCase();
      if (lang.startsWith("zh")) return "zh";
      if (lang.startsWith("es")) return "es";
      return "en";
    } catch (_e) {
      return "en";
    }
  }

  function normalizeCurrentPath() {
    try {
      const p = String(window.location.pathname || "/");
      return p.endsWith("/") ? p : p + "/";
    } catch (_e) {
      return "/";
    }
  }

  function currentRegionContext(regionIdHint) {
    if (!ROUTER || typeof ROUTER.getRegionContext !== "function") return null;
    return ROUTER.getRegionContext(regionIdHint || normalizeCurrentPath());
  }

  function currentCompassMap(regionId) {
    if (!ROUTER || typeof ROUTER.compassTargetMap !== "function") return null;
    return ROUTER.compassTargetMap(regionId);
  }

  function resolveFaceMeta(face) {
    const fallback = LOCAL_FACE_FALLBACK[face] || null;
    const map = currentCompassMap(state.regionId);
    if (!map || !REGIONS || typeof REGIONS.byId !== "function") {
      return fallback;
    }

    if (face === "M") {
      return fallback;
    }

    const targetId = map[face] || null;
    if (!targetId) {
      return fallback;
    }

    const region = REGIONS.byId(targetId);
    if (!region) {
      return fallback;
    }

    const sameRegion = region.id === state.regionId;
    const sameRoute = region.route === normalizeCurrentPath();
    const route = sameRegion || sameRoute ? null : region.route;

    if (face === "N") return { label: "NORTH", short: "N", route, type: route ? "route" : "locked" };
    if (face === "E") return { label: "EAST", short: "E", route, type: route ? "route" : "locked" };
    if (face === "S") return { label: "SOUTH", short: "S", route, type: route ? "route" : "locked" };
    if (face === "W") return { label: "WEST", short: "W", route, type: route ? "route" : "locked" };
    if (face === "C") return { label: "CORE", short: "CORE", route, type: route ? "route" : "locked" };

    return fallback;
  }

  const state = {
    tick: 0,
    rotX: -0.3,
    rotY: 0.24,
    rotVelX: 0,
    rotVelY: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    hoverFace: null,
    faceZones: {},
    cube: null,
    dragonLoop: true,
    dragonStart: 0,
    morphPulse: 0,
    navObjectState: "expanded_compass",
    navigateTo: null,
    navigateDelay: 0,
    regionId:
      (document.body && document.body.dataset && document.body.dataset.regionId) || "harbor_core",
    regionContext: null,
    camera: CAMERA.createState("fixed_harbor"),
    background: BG.createState(),
    showroom: SHOWROOM.createState(),
    fx: FX.createState(),
    motion: {
      dragons: {
        orbitCenter: { x: 0, y: 340, z: 420 },
        orbitRadius: (KERNEL && KERNEL.dragons && KERNEL.dragons.orbitRadius) || 420,
        orbitSpeed: (KERNEL && KERNEL.dragons && KERNEL.dragons.orbitSpeed) || 0.0019,
      },
    },
  };

  function resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const preset = CAMERA.getPreset(state.camera.mode);
    BG.initLanterns(state.background, w, h);
    BG.initClouds(state.background, w, h);
    BG.initMountains(state.background, w, h, preset);
    SHOWROOM.refreshTargets(state.showroom, w, h);
  }

  function getFaceAt(x, y) {
    if (state.showroom.mode === "show") return "M";
    for (const key of ["C", "W", "E", "N", "S", "M"]) {
      const poly = state.faceZones[key];
      if (poly && INPUT.pointInPoly(x, y, poly)) return key;
    }
    return null;
  }

  function getLockedLabel(face) {
    const meta = resolveFaceMeta(face);
    return meta ? meta.label + " LOCKED" : "LOCKED";
  }

  function queueNavigation(route, face) {
    if (!route) return;
    state.navigateTo = route;
    state.navigateDelay = 12;
    state.navObjectState = "compressed_navigation_stick";
    CAMERA.blendTo(state.camera, "travel_projection");
    FX.triggerOverlay(state.fx, 1);
    dispatch("compass:route", { face, route });
  }

  function engageDrag(x, y) {
    state.dragging = true;
    state.lastX = x;
    state.lastY = y;
    getFaceAt(x, y);
  }

  function moveDrag(x, y) {
    state.hoverFace = getFaceAt(x, y);
    if (!state.dragging) return;
    if (
      state.showroom.mode === "show" ||
      state.showroom.mode === "swirl" ||
      state.showroom.mode === "shatter"
    ) {
      return;
    }

    const dx = x - state.lastX;
    const dy = y - state.lastY;

    state.lastX = x;
    state.lastY = y;

    if (state.navObjectState === "compressed_navigation_stick") {
      state.rotVelY += dx * 0.0004;
      state.rotVelX += dy * 0.0004;
      return;
    }

    state.rotVelY += dx * 0.001;
    state.rotVelX += dy * 0.001;
  }

  function handleFaceAction(face) {
    const meta = resolveFaceMeta(face);
    if (!meta) return;

    if (face === "M" || meta.type === "morph") {
      if (state.showroom.mode === "show") {
        SHOWROOM.close(state.showroom, dispatch);
      } else if (state.cube) {
        SHOWROOM.start(state.showroom, state.cube, dispatch, function (x, y, count, sizeBase) {
          FX.spawnFirework(state.fx, x, y, count, sizeBase);
        });
      }
      state.morphPulse = 1;
      return;
    }

    if (!meta.route) {
      FX.triggerLocked(state.fx, face);
      dispatch("compass:locked", { face });
      if (state.cube && state.cube.faceCenters[face]) {
        FX.spawnFirework(
          state.fx,
          state.cube.faceCenters[face].x,
          state.cube.faceCenters[face].y,
          14,
          1.5
        );
      }
      return;
    }

    if (state.cube && state.cube.faceCenters[face]) {
      FX.spawnFirework(
        state.fx,
        state.cube.faceCenters[face].x,
        state.cube.faceCenters[face].y,
        16,
        1.7
      );
    }

    queueNavigation(meta.route, face);
  }

  function releaseDrag(x, y) {
    const hit = getFaceAt(x, y);
    state.dragging = false;
    if (hit) handleFaceAction(hit);
  }

  function syncRegionContext() {
    const ctxValue = currentRegionContext();
    if (ctxValue && ctxValue.regionId) {
      state.regionContext = ctxValue;
      state.regionId = ctxValue.regionId;
    }
  }

  function updateCamera() {
    CAMERA.update(state.camera, 0.06);
  }

  function updateShowroom() {
    SHOWROOM.update(state.showroom, function () {
      state.navObjectState = "expanded_compass";
      CAMERA.blendTo(state.camera, "fixed_harbor");
    });
  }

  function animateState() {
    state.tick++;
    syncRegionContext();
    BG.syncCelestials(state.background, ENV, state.tick);
    updateCamera();

    state.rotY += state.rotVelY;
    state.rotX += state.rotVelX;
    state.rotVelY *= state.dragging ? 0.91 : 0.972;
    state.rotVelX *= state.dragging ? 0.91 : 0.972;
    state.rotVelY = clamp(state.rotVelY, -0.14, 0.14);
    state.rotVelX = clamp(state.rotVelX, -0.14, 0.14);

    if (
      !state.dragging &&
      state.showroom.mode === "idle" &&
      state.navObjectState === "expanded_compass"
    ) {
      state.rotY += 0.0008;
    }

    state.morphPulse *= 0.94;
    FX.decay(state.fx);
    updateShowroom();

    if (state.navigateTo) {
      state.navigateDelay--;
      FX.triggerOverlay(state.fx, 0.35);
      if (state.navigateDelay <= 0) {
        window.location.href = state.navigateTo;
      }
    }
  }

  function drawSceneFrame() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const preset = CAMERA.getBlendedPreset(state.camera);

    ctx.clearRect(0, 0, w, h);

    BG.drawSky(ctx, w, h, state.tick, preset, state.background);
    BG.drawSun(ctx, w, h, state.background);
    BG.drawMoon(ctx, w, h, state.background);

    const envSnapshot = ENV && typeof ENV.getSnapshot === "function" ? ENV.getSnapshot() : null;

    BG.drawClouds(ctx, state.background, state.tick, envSnapshot);
    BG.drawLanterns(
      ctx,
      state.background,
      state.tick,
      state.hoverFace === "N" || state.camera.requested === "travel_projection" ? 1.18 : 1
    );
    BG.drawMountains(ctx, w, h, state.background, preset);
    BG.drawWater(ctx, w, h, state.tick, preset, state.background, envSnapshot);

    try {
      if (HARBOR && typeof HARBOR.draw === "function") {
        HARBOR.draw(ctx, w, h, state.tick);
      }
    } catch (err) {
      console.warn("Harbor renderer failed", err);
    }

    const geo = COMPASS.getCubeGeometry({
      width: w,
      height: h,
      preset: preset,
      rotX: state.rotX,
      rotY: state.rotY,
      morphPulse: state.morphPulse,
      cameraRequested: state.camera.requested,
    });

    state.cube = geo;
    state.faceZones = geo.faces;

    const dragonBundles = DRAGONS.getDragonBundles(geo, state);

    DRAGONS.drawDragonReflections(ctx, geo, preset, dragonBundles, state.tick);
    DRAGONS.drawBack(ctx, geo, dragonBundles, state.tick);

    if (
      state.showroom.mode === "idle" ||
      state.showroom.mode === "return" ||
      state.showroom.mode === "shatter"
    ) {
      if (
        state.navObjectState === "compressed_navigation_stick" &&
        state.camera.requested !== "fixed_harbor"
      ) {
        COMPASS.drawNavigationStick(ctx, geo);
      } else {
        COMPASS.drawCube(
          ctx,
          geo,
          state.tick,
          function (face) {
            return resolveFaceMeta(face);
          },
          state.hoverFace
        );
      }
    }

    DRAGONS.drawFront(ctx, geo, dragonBundles, state.tick, getSceneLanguage(), state);
    SHOWROOM.drawFragments(ctx, state.showroom, state.tick);
    SHOWROOM.drawCompass(ctx, state.showroom);
    FX.drawFireworks(ctx, state.fx);
    FX.drawLockedOverlay(ctx, state.fx, getLockedLabel);
    FX.drawNavigationOverlay(ctx, state.fx);
  }

  function frame() {
    animateState();
    drawSceneFrame();
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("orientationchange", resize, { passive: true });

  INPUT.bind(canvas, {
    onPointerMove: function (p) {
      moveDrag(p.x, p.y);
    },
    onPointerDown: function (p, e) {
      engageDrag(p.x, p.y);
      dispatch("environment:tap", { x: e.clientX, y: e.clientY });
    },
    onPointerUp: function (p) {
      releaseDrag(p.x, p.y);
    },
    onTouchStart: function (p, touch) {
      engageDrag(p.x, p.y);
      dispatch("environment:tap", { x: touch.clientX, y: touch.clientY });
    },
    onTouchMove: function (p) {
      moveDrag(p.x, p.y);
    },
    onTouchEnd: function (p) {
      releaseDrag(p.x, p.y);
    },
    onPointerLeave: function () {
      state.dragging = false;
      state.hoverFace = null;
    },
    onMorphEvent: function (e) {
      if (e && e.detail && e.detail.mode === "return") {
        SHOWROOM.close(state.showroom, dispatch);
      }
    },
    onSceneCamera: function (e) {
      const mode = e && e.detail && e.detail.mode;
      if (mode) CAMERA.blendTo(state.camera, mode);
    },
    onSceneCameraCycle: function () {
      CAMERA.cycle(state.camera);
    },
  });

  resize();
  frame();
})();
