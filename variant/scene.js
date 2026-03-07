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
  const AUTH = window.OPENWORLD_COMPASS_NAVIGATION_AUTHORITY;
  const NAV_MATH = window.OPENWORLD_NAVIGATION_MATH;
  const INSTRUMENTS_RUNTIME = window.OPENWORLD_INSTRUMENTS_RUNTIME;

  const KERNEL = window.WORLD_KERNEL || null;
  const ENV = window.ENVIRONMENT_RUNTIME || null;
  const REGIONS = window.ISLAND_REGIONS || null;
  const ROUTER = window.REGION_ROUTER || null;
  const HARBOR = window.HARBOR_RENDERER || null;

  if (!CAMERA || !BG || !COMPASS || !DRAGONS || !SHOWROOM || !FX || !INPUT || !AUTH) {
    console.error("OPENWORLD_SCENE_v1: missing required scene modules.");
    return;
  }

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
        orbitCenter:
          (KERNEL && KERNEL.dragons && KERNEL.dragons.orbitCenter) || { x: 0, y: 240, z: 420 },
        orbitRadius: (KERNEL && KERNEL.dragons && KERNEL.dragons.orbitRadius) || 420,
        orbitSpeed: (KERNEL && KERNEL.dragons && KERNEL.dragons.orbitSpeed) || 0.0019,
      },
    },
    interactionState: {
      helm_input: {
        commanded_heading_deg: 0,
        throttle_class: "cruise",
        steering_delta: 0,
        helm_mode: "manual",
      },
      course_selection: {
        selected_course_deg: 0,
        selection_source: "default",
        lock_state: "unlocked",
      },
      target_selection: {
        target_type: "route",
        target_id: "harbor_core",
        target_lock_state: "locked",
      },
      instrument_mode: "free_nav",
    },
    navigationRuntime: {
      mathOutput: null,
      instrumentState: null,
      instrumentSurfaces: null,
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

  function currentPathname() {
    try {
      return String(window.location.pathname || "/");
    } catch (_e) {
      return "/";
    }
  }

  function getFaceAt(x, y) {
    if (state.showroom.mode === "show") return "M";
    for (const key of ["C", "W", "E", "N", "S", "M"]) {
      const poly = state.faceZones[key];
      if (poly && INPUT.pointInPoly(x, y, poly)) return key;
    }
    return null;
  }

  function getFaceLabel(face) {
    const meta = AUTH.getFaceMeta(face, {
      regionId: state.regionId,
      currentPath: currentPathname(),
      router: ROUTER,
      regions: REGIONS,
    });
    return meta ? meta.label + " LOCKED" : "LOCKED";
  }

  function queueNavigation(route) {
    if (!route) return;
    state.navigateTo = route;
    state.navigateDelay = 12;
    state.navObjectState = "compressed_navigation_stick";
    CAMERA.blendTo(state.camera, "travel_projection");
    FX.triggerOverlay(state.fx, 1);
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
    const action = AUTH.activateFace(face, {
      regionId: state.regionId,
      currentPath: currentPathname(),
      router: ROUTER,
      regions: REGIONS,
    });

    if (!action || !action.ok) return;

    if (action.status === "morph") {
      if (state.showroom.mode === "show") {
        SHOWROOM.close(state.showroom, dispatch);
      } else {
        SHOWROOM.start(state.showroom, state.cube, dispatch, function (x, y, count, sizeBase) {
          FX.spawnFirework(state.fx, x, y, count, sizeBase);
        });
      }
      state.morphPulse = 1;
      return;
    }

    if (action.status === "locked") {
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

    if (action.status === "route") {
      dispatch("compass:route", { face, route: action.route });
      if (state.cube && state.cube.faceCenters[face]) {
        FX.spawnFirework(
          state.fx,
          state.cube.faceCenters[face].x,
          state.cube.faceCenters[face].y,
          16,
          1.7
        );
      }
      queueNavigation(action.route);
    }
  }

  function releaseDrag(x, y) {
    const hit = getFaceAt(x, y);
    state.dragging = false;
    if (hit) handleFaceAction(hit);
  }

  function syncRegionContext() {
    if (ROUTER && typeof ROUTER.getRegionContext === "function") {
      state.regionContext = ROUTER.getRegionContext(currentPathname());
      if (state.regionContext && state.regionContext.regionId) {
        state.regionId = state.regionContext.regionId;
      }
    }
  }

  function syncNavigationRuntime() {
    if (!NAV_MATH || !INSTRUMENTS_RUNTIME || !ROUTER || !REGIONS) return;

    const region = REGIONS.byId ? REGIONS.byId(state.regionId) : null;
    const envSnapshot = ENV && typeof ENV.getSnapshot === "function" ? ENV.getSnapshot() : null;
    const compassMap =
      ROUTER && typeof ROUTER.compassTargetMap === "function"
        ? ROUTER.compassTargetMap(state.regionId)
        : null;

    const northTargetId = compassMap && compassMap.N ? compassMap.N : state.regionId;
    const targetRegion = REGIONS.byId ? REGIONS.byId(northTargetId) : null;

    state.interactionState.target_selection.target_id = northTargetId || state.regionId;
    state.interactionState.instrument_mode =
      state.navObjectState === "compressed_navigation_stick" ? "route_nav" : "free_nav";

    const mathInput = {
      world_state: {
        origin_ref: (KERNEL && KERNEL.mapId) || "NINE_SUMMITS_ISLAND_MAP_v1",
        region_id: state.regionId,
        vessel_position: {
          x: 0,
          y: 0,
          z: 0,
        },
        vessel_track_ref: {
          heading_ref: state.rotY,
          track_ref: state.rotY,
          frame_id: "world_frame",
        },
        route_graph: {
          nodes:
            REGIONS && REGIONS.list
              ? REGIONS.list.map(function (r) {
                  return { id: r.id, route: r.route, anchor: r.anchor };
                })
              : [],
          edges: region ? [].concat(region.ingress || [], region.egress || []) : [],
          traversal_rules: (KERNEL && KERNEL.traversal) || {},
        },
        active_route: targetRegion
          ? {
              route_id: targetRegion.id,
              ordered_waypoints: [targetRegion.id],
              route_constraints: {},
            }
          : null,
        active_waypoint: targetRegion
          ? {
              waypoint_id: targetRegion.id,
              coordinate: targetRegion.anchor,
              waypoint_class: targetRegion.type,
            }
          : null,
        neighbor_waypoints:
          state.regionContext && state.regionContext.neighbors
            ? state.regionContext.neighbors.map(function (n) {
                return {
                  waypoint_id: n.id,
                  coordinate: n.anchor,
                  admissibility_state: "admissible",
                };
              })
            : [],
      },
      environment_state: {
        timestamp: Date.now(),
        time_of_day_class: "dusk",
        wind: {
          direction_deg: 0,
          speed: envSnapshot && envSnapshot.weather ? envSnapshot.weather.wind || 0 : 0,
          frame_id: "world_frame",
        },
        current: {
          direction_deg: 0,
          speed: 0,
          frame_id: "world_frame",
        },
        celestial_state: {
          sun: envSnapshot ? envSnapshot.sun : null,
          moon: envSnapshot ? envSnapshot.moon : null,
          stars: [],
          observer_frame: "world_frame",
        },
        visibility_class: "clear",
      },
      interaction_state: state.interactionState,
      derivation_request: "full",
    };

    const mathOutput = NAV_MATH.compute(mathInput);
    const instrumentState = INSTRUMENTS_RUNTIME.buildState(mathOutput, state.interactionState);
    const instrumentSurfaces = INSTRUMENTS_RUNTIME.buildSurfaces(instrumentState);

    state.navigationRuntime.mathOutput = mathOutput;
    state.navigationRuntime.instrumentState = instrumentState;
    state.navigationRuntime.instrumentSurfaces = instrumentSurfaces;
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
    syncNavigationRuntime();
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
            return AUTH.getFaceMeta(face, {
              regionId: state.regionId,
              currentPath: currentPathname(),
              router: ROUTER,
              regions: REGIONS,
            });
          },
          state.hoverFace
        );
      }
    }

    DRAGONS.drawFront(ctx, geo, dragonBundles, state.tick, getSceneLanguage(), state);
    SHOWROOM.drawFragments(ctx, state.showroom, state.tick);
    SHOWROOM.drawCompass(ctx, state.showroom);
    FX.drawFireworks(ctx, state.fx);
    FX.drawLockedOverlay(ctx, state.fx, getFaceLabel);
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
