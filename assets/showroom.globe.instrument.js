/*
  /assets/showroom.globe.instrument.js
  SHOWROOM_GENERATION_4_HOME_ANCHOR_FIXED_POSITION_CONTROL_TNT_v1

  Purpose:
  - Preserve the current Generation 4 speed-authority contract.
  - Preserve route and Gauges compatibility by keeping the public VERSION stable.
  - Add a canonical HOME_STATE.
  - Stop idle auto-drift from pulling the globe away from the correct starting point.
  - Keep the globe fixed in outer space.
  - Allow only internal motion: longitude, latitude, release spin, zoom, light anchor, pause/resume/reset.
*/

(function () {
  "use strict";

  const VERSION = "showroom-generation-4-speed-authority-calibration-v1";
  const REFINEMENT_VERSION = "showroom-generation-4-home-anchor-fixed-position-control-v1";

  const ASSETS = Object.freeze({
    earthSurface: "/assets/earth/earth_surface_2048.jpg",
    earthClouds: "/assets/earth/earth_clouds_2048.jpg",
    parentRoute: "/showroom/",
    globeRoute: "/showroom/globe/"
  });

  const CONTEXTS = Object.freeze({
    parent: "parent",
    standalone: "standalone"
  });

  const REALMS = Object.freeze({
    parent: "showroom-parent-proof-realm",
    standalone: "demo-universe-earth-demo-realm"
  });

  const HOME_STATE = Object.freeze({
    longitude: 50,
    cloudLongitude: 88,
    latitude: 50,
    zoom: 1,
    lightAnchor: "sun",
    paused: false,
    autoDriftEnabled: false
  });

  const MOTION = Object.freeze({
    axisTiltDegrees: 23.5,

    longitudeAutoStep: 0.009,
    cloudAutoStep: 0.004,

    dragLongitudeFactor: 0.038,
    dragCloudFactor: 0.018,
    dragLatitudeFactor: 0.62,

    latitudeMin: 14,
    latitudeMax: 86,
    latitudeReturnFriction: 0.006,

    wheelZoomStep: 0.045,
    dragDeadZonePx: 1.75,

    releaseSpinEnabled: true,
    releaseVelocityDamping: 0.936,
    releaseVelocityMin: 0.0025,
    releaseVelocityMax: 0.18,
    releaseVelocitySampleMs: 64
  });

  const SPEED_AUTHORITY = Object.freeze({
    file: "/assets/showroom.globe.instrument.js",
    instrumentSpeedAuthority: true,
    runtimeSpeedAuthority: false,
    cssAnimationAuthority: false,
    renderBridgeSpeedAuthority: false
  });

  const PLACEMENT = Object.freeze({
    placementAuthority: "layout-only",
    motionAuthority: "/assets/showroom.globe.instrument.js",
    placementFixed: true,
    motionOnlyControl: true,
    centerLocked: true,
    dragTranslatesContainer: false,
    wheelZoomScalesFromCenter: true,
    releaseSpinInternal: true
  });

  const FORBIDDEN_VISUAL_CLASSES = Object.freeze([
    "showroom-generation-2-shell",
    "showroom-generation-2-orbit",
    "showroom-generation-2-active-globe",
    "showroom-generation-2-earth-surface",
    "showroom-generation-2-earth-clouds",
    "showroom-generation-2-light",
    "showroom-generation-2-rim",
    "showroom-generation-2-caption",
    "showroom-generation-2-link",
    "showroom-generation-3-orbit"
  ]);

  const FORBIDDEN_NODE_SELECTORS = Object.freeze([
    ".showroom-generation-2-orbit",
    ".showroom-generation-3-orbit",
    "[data-generation-3-orbit]",
    "[data-generation-1-orbital-scaffold]",
    "[data-orbital-scaffold]",
    "[data-ring-scaffold]"
  ]);

  const activeLoops = new WeakMap();

  function normalizeContext(context) {
    return context === CONTEXTS.standalone ? CONTEXTS.standalone : CONTEXTS.parent;
  }

  function realmForContext(context) {
    return normalizeContext(context) === CONTEXTS.standalone ? REALMS.standalone : REALMS.parent;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function mod(value, range) {
    return ((value % range) + range) % range;
  }

  function preventDefault(event) {
    if (event && typeof event.preventDefault === "function" && event.cancelable) {
      event.preventDefault();
    }
  }

  function create(tag, attrs, children) {
    const node = document.createElement(tag);

    Object.entries(attrs || {}).forEach(function (entry) {
      const key = entry[0];
      const value = entry[1];

      if (value === null || value === undefined || value === false) return;

      if (key === "className") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, String(value));
    });

    (children || []).forEach(function (child) {
      if (typeof child === "string") node.appendChild(document.createTextNode(child));
      else if (child) node.appendChild(child);
    });

    return node;
  }

  function setDataset(node, values) {
    if (!node) return;

    Object.entries(values || {}).forEach(function (entry) {
      const key = entry[0];
      const value = entry[1];

      if (value === null || value === undefined) return;

      node.dataset[key] = String(value);
    });
  }

  function removeDatasetKeys(node, keys) {
    if (!node) return;

    keys.forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(node.dataset, key)) {
        delete node.dataset[key];
      }
    });
  }

  function stripForbiddenVisualClasses(root) {
    if (!root) return;

    [root].concat(Array.from(root.querySelectorAll("*"))).forEach(function (node) {
      if (!node.classList) return;

      FORBIDDEN_VISUAL_CLASSES.forEach(function (className) {
        node.classList.remove(className);
      });
    });
  }

  function removeForbiddenScaffoldNodes(root) {
    if (!root) return;

    FORBIDDEN_NODE_SELECTORS.forEach(function (selector) {
      Array.from(root.querySelectorAll(selector)).forEach(function (node) {
        node.remove();
      });
    });
  }

  function purifyVisualObject(root) {
    stripForbiddenVisualClasses(root);
    removeForbiddenScaffoldNodes(root);
  }

  function ensureStyles() {
    if (document.getElementById("showroom-generation-4-home-anchor-style")) return;

    const style = create("style", {
      id: "showroom-generation-4-home-anchor-style",
      text:
        ".showroom-generation-3-shell{position:relative;display:grid;justify-items:center;gap:.75rem;width:min(760px,100%);margin:0 auto;isolation:isolate;contain:layout paint style;touch-action:none;user-select:none;-webkit-user-select:none;transform:none!important;translate:none!important;left:auto!important;top:auto!important}" +

        ".showroom-generation-4-axis-frame{position:relative;display:grid;place-items:center;width:min(390px,78vw);aspect-ratio:1/1;transform:rotate(var(--showroom-axis-tilt,23.5deg));transform-origin:50% 50%;isolation:isolate;contain:layout paint style;touch-action:none;user-select:none;-webkit-user-select:none;left:auto!important;top:auto!important;translate:none!important}" +

        ".showroom-generation-3-active-globe{position:relative;width:min(340px,72vw);aspect-ratio:1/1;border-radius:50%;overflow:hidden;isolation:isolate;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;transform:scale(var(--showroom-control-scale,1))!important;transform-origin:50% 50%!important;animation:none!important;background:#07111f;border:1px solid rgba(245,199,107,.18);box-shadow:inset -38px 0 60px rgba(0,0,0,.54),inset 24px 0 40px rgba(116,184,255,.17),0 24px 70px rgba(0,0,0,.48),0 0 52px rgba(116,184,255,.18);left:auto!important;top:auto!important;translate:none!important;margin:0!important}" +
        ".showroom-generation-3-active-globe[data-control-dragging='true']{cursor:grabbing}" +

        ".showroom-generation-4-surface-track,.showroom-generation-4-cloud-track{position:absolute;inset:-18%;border-radius:50%;background-repeat:repeat-x;background-position:50% 50%;background-size:auto 132%;animation:none!important;will-change:background-position,transform;pointer-events:none;left:-18%!important;top:-18%!important;translate:none!important}" +
        ".showroom-generation-4-surface-track{z-index:2;opacity:1;filter:saturate(1.08) contrast(1.05);transform:translateY(var(--showroom-latitude-offset,0%)) rotate(calc(-1 * var(--showroom-axis-tilt,23.5deg))) scale(1.16)!important;transform-origin:50% 50%}" +
        ".showroom-generation-4-cloud-track{z-index:4;opacity:.46;mix-blend-mode:screen;filter:brightness(1.14) contrast(1.04);transform:translateY(calc(var(--showroom-latitude-offset,0%) * .68)) rotate(calc(-1 * var(--showroom-axis-tilt,23.5deg))) scale(1.18)!important;transform-origin:50% 50%}" +

        ".showroom-generation-4-latitude-shade{position:absolute;inset:0;border-radius:50%;z-index:6;background:linear-gradient(180deg,rgba(255,255,255,.15),transparent var(--showroom-latitude-light-stop,36%),rgba(0,0,0,.27));opacity:.82;pointer-events:none}" +
        ".showroom-generation-4-center-origin{position:absolute;left:50%;top:50%;z-index:21;width:.45rem;height:.45rem;border:1px solid rgba(245,199,107,.60);border-radius:50%;transform:translate(-50%,-50%) rotate(calc(-1 * var(--showroom-axis-tilt,23.5deg)));background:rgba(245,199,107,.20);box-shadow:0 0 18px rgba(245,199,107,.36);pointer-events:none}" +

        ".showroom-generation-3-ocean-land-color{position:absolute;inset:0;border-radius:50%;z-index:3;background:radial-gradient(circle at 38% var(--showroom-light-y,32%),rgba(116,184,255,.16),transparent 28%),radial-gradient(circle at 62% 58%,rgba(245,199,107,.10),transparent 34%);mix-blend-mode:overlay;pointer-events:none}" +
        ".showroom-generation-3-cloud-depth{position:absolute;inset:0;border-radius:50%;z-index:5;background:radial-gradient(circle at 42% var(--showroom-light-y,28%),rgba(255,255,255,.12),transparent 26%),radial-gradient(circle at 68% 62%,rgba(255,255,255,.05),transparent 38%);pointer-events:none}" +
        ".showroom-generation-3-light{position:absolute;inset:0;border-radius:50%;z-index:8;background:radial-gradient(circle at var(--showroom-light-x,34%) var(--showroom-light-y,30%),rgba(255,255,255,var(--showroom-light-strength,.30)),transparent 30%),linear-gradient(90deg,rgba(255,255,255,.08),transparent 45%);mix-blend-mode:screen;pointer-events:none}" +
        ".showroom-generation-3-terminator{position:absolute;inset:-1px;border-radius:50%;z-index:9;background:linear-gradient(90deg,transparent 0%,transparent var(--showroom-terminator-start,45%),rgba(0,0,0,.20) 58%,rgba(0,0,0,var(--showroom-night-opacity,.56)) 100%);pointer-events:none}" +
        ".showroom-generation-3-night-depth{position:absolute;inset:0;border-radius:50%;z-index:10;background:radial-gradient(circle at var(--showroom-night-x,76%) var(--showroom-light-y,50%),rgba(0,0,0,.48),transparent 48%);pointer-events:none}" +
        ".showroom-generation-3-moon-reflection{position:absolute;inset:0;border-radius:50%;z-index:11;background:radial-gradient(circle at var(--showroom-moon-x,72%) var(--showroom-moon-y,24%),rgba(245,199,107,var(--showroom-moon-opacity,.12)),transparent 15%);mix-blend-mode:screen;pointer-events:none}" +
        ".showroom-generation-3-atmosphere{position:absolute;inset:-2px;border-radius:50%;z-index:12;box-shadow:inset 0 0 28px rgba(116,184,255,.31),0 0 34px rgba(116,184,255,.22);pointer-events:none}" +
        ".showroom-generation-3-rim{position:absolute;inset:0;border-radius:50%;z-index:13;background:radial-gradient(circle at 50% 50%,transparent 55%,rgba(116,184,255,.20) 72%,rgba(245,199,107,.22) 100%);pointer-events:none}" +

        ".showroom-generation-3-axis-line{position:absolute;left:50%;top:50%;z-index:30;width:1px;height:calc(min(340px,72vw) * 1.34);background:linear-gradient(180deg,transparent,rgba(245,199,107,.86),transparent);transform:translate(-50%,-50%);pointer-events:none}" +
        ".showroom-generation-3-axis-node{position:absolute;left:50%;z-index:31;width:.46rem;height:.46rem;border-radius:50%;background:#f5c76b;box-shadow:0 0 22px rgba(245,199,107,.68);pointer-events:none}" +
        ".showroom-generation-3-axis-node-north{top:calc(50% - min(340px,72vw) * .67);transform:translateX(-50%)}" +
        ".showroom-generation-3-axis-node-south{top:calc(50% + min(340px,72vw) * .67);transform:translateX(-50%)}" +

        ".showroom-generation-3-caption{margin:.4rem 0 0;color:#f5c76b;font-weight:900;letter-spacing:.08em;text-align:center;text-transform:uppercase}" +
        ".showroom-generation-3-telemetry{display:flex;flex-wrap:wrap;justify-content:center;gap:.35rem;margin:.2rem auto 0;max-width:760px}" +
        ".showroom-generation-3-telemetry span{border:1px solid rgba(116,184,255,.22);border-radius:999px;padding:.28rem .48rem;color:rgba(226,238,255,.78);background:rgba(4,12,24,.48);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.68rem;font-weight:800}" +
        ".showroom-generation-3-link{border:1px solid rgba(245,199,107,.36);border-radius:999px;padding:.48rem .72rem;color:#f6efe0;background:rgba(4,12,24,.58);text-decoration:none;font-weight:900}" +

        ".showroom-generation-3-control-panel{display:flex;flex-wrap:wrap;justify-content:center;gap:.45rem;width:min(760px,100%);margin:.35rem auto 0;position:relative;z-index:80;transform:none!important;translate:none!important}" +
        ".showroom-generation-3-control-panel button{border:1px solid rgba(245,199,107,.36);border-radius:999px;padding:.42rem .68rem;color:#f6efe0;background:rgba(4,12,24,.68);font:inherit;font-size:.72rem;font-weight:900;letter-spacing:.04em;cursor:pointer}" +
        ".showroom-generation-3-control-panel button:hover,.showroom-generation-3-control-panel button:focus-visible{color:#07111f;background:#f5c76b;outline:none}" +
        ".showroom-generation-3-control-readout{display:flex;flex-wrap:wrap;justify-content:center;gap:.35rem;width:min(760px,100%);margin:.15rem auto 0;position:relative;z-index:80;transform:none!important;translate:none!important}" +
        ".showroom-generation-3-control-readout span{border:1px solid rgba(116,184,255,.22);border-radius:999px;padding:.28rem .48rem;color:rgba(226,238,255,.78);background:rgba(4,12,24,.48);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.68rem;font-weight:800}" +

        ".showroom-generation-3-earth-surface,.showroom-generation-3-earth-clouds{animation:none!important}"
    });

    document.head.appendChild(style);
  }

  function getContextReceipts(context) {
    const normalized = normalizeContext(context);
    const realm = realmForContext(normalized);

    const base = {
      showroomGlobeInstrument: VERSION,
      showroomGlobeRefinement: REFINEMENT_VERSION,

      speedAuthority: SPEED_AUTHORITY.file,
      instrumentSpeedAuthority: String(SPEED_AUTHORITY.instrumentSpeedAuthority),
      runtimeSpeedAuthority: String(SPEED_AUTHORITY.runtimeSpeedAuthority),
      cssAnimationAuthority: String(SPEED_AUTHORITY.cssAnimationAuthority),
      renderBridgeSpeedAuthority: String(SPEED_AUTHORITY.renderBridgeSpeedAuthority),

      homeStateLongitude: String(HOME_STATE.longitude),
      homeStateCloudLongitude: String(HOME_STATE.cloudLongitude),
      homeStateLatitude: String(HOME_STATE.latitude),
      homeStateZoom: String(HOME_STATE.zoom),
      homeStateLightAnchor: HOME_STATE.lightAnchor,
      homeAnchor: "active",
      idleAutoDrift: "locked",

      longitudeAutoStep: String(MOTION.longitudeAutoStep),
      cloudAutoStep: String(MOTION.cloudAutoStep),
      dragLongitudeFactor: String(MOTION.dragLongitudeFactor),
      dragCloudFactor: String(MOTION.dragCloudFactor),
      dragLatitudeFactor: String(MOTION.dragLatitudeFactor),
      latitudeReturnFriction: String(MOTION.latitudeReturnFriction),
      releaseSpinEnabled: String(MOTION.releaseSpinEnabled),
      releaseVelocityDamping: String(MOTION.releaseVelocityDamping),

      placementAuthority: PLACEMENT.placementAuthority,
      motionAuthority: PLACEMENT.motionAuthority,
      placementFixed: String(PLACEMENT.placementFixed),
      motionOnlyControl: String(PLACEMENT.motionOnlyControl),
      centerLocked: String(PLACEMENT.centerLocked),
      dragTranslatesContainer: String(PLACEMENT.dragTranslatesContainer),
      wheelZoomScalesFromCenter: String(PLACEMENT.wheelZoomScalesFromCenter),
      releaseSpinInternal: String(PLACEMENT.releaseSpinInternal),

      sharedInstrumentRole: "rendering-and-control-service-only",
      sharedActiveRealmIdentity: "false",
      crossRealmLinkType: "navigation-only",

      generation1RingScaffold: "removed",
      generation2ReceiptOnly: "true",
      generation2VisualClassEmission: "removed",
      generation3RealmSeparation: "active",

      generation4: "speed-authority-calibrated-two-axis-globe",
      generation4Closure: "home-anchor-fixed-position-control-active",
      generation4MotionModel: "home-anchored-fixed-placement-internal-motion",
      generation4InertialReleaseSpin: "active",
      generation4DiskRotation: "removed",
      generation4SphericalRead: "active",
      generation4HorizontalFriction: "calibrated",
      generation4VerticalControl: "visible-latitude-disposition",
      generation4AxisDisposition: "23.5-degree-axis-frame",
      generation4CenterOrigin: "locked",
      generation4ZoomControl: "center-scale-only",
      generation4DragControl: "motion-only-two-axis",

      earthSurface: ASSETS.earthSurface,
      earthClouds: ASSETS.earthClouds,
      renderContext: normalized,
      activeRealm: realm
    };

    if (normalized === CONTEXTS.standalone) {
      return Object.assign(base, {
        activeRouteRole: "demo-universe-earth",
        standaloneRole: "demo-universe-earth",
        demoRealm: REALMS.standalone,
        showroomGlobeRoute: ASSETS.globeRoute,
        parentRouteAvailable: ASSETS.parentRoute,
        parentRoleAvailable: "navigation-only",
        contextReceiptMode: "demo-realm-isolated",
        contextCaption: "GENERATION 4 · DEMO REALM · HOME ANCHORED"
      });
    }

    return Object.assign(base, {
      activeRouteRole: "showroom-proof-surface",
      parentRole: "showroom-proof-surface",
      parentRealm: REALMS.parent,
      showroomParentRoute: ASSETS.parentRoute,
      demoRouteAvailable: ASSETS.globeRoute,
      demoRoleAvailable: "navigation-only",
      contextReceiptMode: "parent-realm-isolated",
      contextCaption: "GENERATION 4 · SHOWROOM PROOF REALM · HOME ANCHORED"
    });
  }

  function enforceRealmSeparation(node, context) {
    const normalized = normalizeContext(context);

    if (!node) return;

    purifyVisualObject(node);

    if (normalized === CONTEXTS.parent) {
      removeDatasetKeys(node, [
        "standaloneRole",
        "demoUniverseEarthBoot",
        "generation2StandaloneGlobe",
        "showroomGlobeRoute",
        "demoRealm"
      ]);

      setDataset(node, {
        renderContext: "parent",
        activeRealm: REALMS.parent,
        parentRealm: REALMS.parent,
        parentRole: "showroom-proof-surface",
        activeRouteRole: "showroom-proof-surface",
        showroomParentRoute: ASSETS.parentRoute,
        demoRouteAvailable: ASSETS.globeRoute,
        demoRoleAvailable: "navigation-only",
        contextReceiptMode: "parent-realm-isolated"
      });
    } else {
      removeDatasetKeys(node, [
        "parentRole",
        "showroomParentBoot",
        "showroomParentRenderBridge",
        "showroomParentRoute",
        "parentRealm"
      ]);

      setDataset(node, {
        renderContext: "standalone",
        activeRealm: REALMS.standalone,
        demoRealm: REALMS.standalone,
        standaloneRole: "demo-universe-earth",
        activeRouteRole: "demo-universe-earth",
        showroomGlobeRoute: ASSETS.globeRoute,
        parentRouteAvailable: ASSETS.parentRoute,
        parentRoleAvailable: "navigation-only",
        contextReceiptMode: "demo-realm-isolated"
      });
    }

    setDataset(node, {
      speedAuthority: SPEED_AUTHORITY.file,
      instrumentSpeedAuthority: "true",
      runtimeSpeedAuthority: "false",
      cssAnimationAuthority: "false",
      placementFixed: "true",
      motionOnlyControl: "true",
      centerLocked: "true",
      dragTranslatesContainer: "false",
      homeAnchor: "active",
      idleAutoDrift: "locked",
      generation1RingScaffold: "removed",
      generation2VisualClassEmission: "removed",
      generation3RealmSeparation: "active",
      generation4Closure: "home-anchor-fixed-position-control-active",
      generation4InertialReleaseSpin: "active",
      generation4DiskRotation: "removed",
      generation4SphericalRead: "active",
      generation4HorizontalFriction: "calibrated",
      generation4VerticalControl: "visible-latitude-disposition",
      generation4AxisDisposition: "23.5-degree-axis-frame",
      generation4CenterOrigin: "locked"
    });
  }

  function installRealmGuard(mount, context) {
    const normalized = normalizeContext(context);

    enforceRealmSeparation(mount, normalized);

    if (!mount || mount.dataset.realmGuardInstalled === VERSION + ":" + REFINEMENT_VERSION + ":" + normalized) return;

    mount.dataset.realmGuardInstalled = VERSION + ":" + REFINEMENT_VERSION + ":" + normalized;

    let locked = false;

    const guard = function () {
      if (locked) return;
      locked = true;

      window.requestAnimationFrame(function () {
        enforceRealmSeparation(mount, normalized);
        locked = false;
      });
    };

    const observer = new MutationObserver(guard);

    observer.observe(mount, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: [
        "class",
        "data-active-realm",
        "data-active-route-role",
        "data-generation-3-orbit",
        "data-orbital-scaffold",
        "data-ring-scaffold",
        "style"
      ]
    });

    window.setTimeout(guard, 100);
    window.setTimeout(guard, 400);
    window.setTimeout(guard, 1100);
    window.setTimeout(guard, 2200);
  }

  function captionForContext(context, override) {
    if (override) return override;

    return normalizeContext(context) === CONTEXTS.standalone
      ? "GENERATION 4 · DEMO REALM · HOME ANCHORED"
      : "GENERATION 4 · SHOWROOM PROOF REALM · HOME ANCHORED";
  }

  function linkForContext(context) {
    return normalizeContext(context) === CONTEXTS.standalone
      ? { href: ASSETS.parentRoute, text: "Return to Showroom" }
      : { href: ASSETS.globeRoute, text: "Open Demo Universe Earth" };
  }

  function createTelemetryNode(context) {
    const normalized = normalizeContext(context);

    return create(
      "div",
      {
        className: "showroom-generation-3-telemetry",
        "data-generation-4-home-anchor": "active",
        "aria-label": "Generation 4 home anchor fixed-position telemetry receipt"
      },
      [
        create("span", { text: "GEN 4" }),
        create("span", { text: "home=anchored" }),
        create("span", { text: "idle=locked" }),
        create("span", { text: "placement=fixed" }),
        create("span", { text: "motion=internal" }),
        create("span", { text: "center=locked" }),
        create("span", { text: "drag=motion-only" }),
        create("span", { text: "spin=release" }),
        create("span", { text: "axis=23.5°" }),
        create("span", { text: "context=" + normalized })
      ]
    );
  }

  function createGlobeNode(options) {
    const config = options || {};
    const context = normalizeContext(config.context);
    const realm = realmForContext(context);
    const caption = captionForContext(context, config.caption);
    const link = linkForContext(context);

    const axisFrame = create(
      "div",
      {
        className: "showroom-generation-4-axis-frame",
        "data-generation-4-axis-frame": "23.5",
        "data-placement-fixed": "true",
        "data-axis-frame-fixed": "true"
      },
      [
        create("span", {
          className: "showroom-generation-3-axis-line",
          "data-generation-3-axis-line": "active",
          "aria-hidden": "true"
        }),

        create("span", {
          className: "showroom-generation-3-axis-node showroom-generation-3-axis-node-north",
          "aria-hidden": "true"
        }),

        create("span", {
          className: "showroom-generation-3-axis-node showroom-generation-3-axis-node-south",
          "aria-hidden": "true"
        }),

        create(
          "div",
          {
            className: "showroom-generation-3-active-globe showroom-generation-4-spherical-globe",
            role: "img",
            "data-generation-4-home-anchor": "active",
            "data-generation-4-speed-authority": "active",
            "data-generation-4-inertial-release-spin": "active",
            "data-generation-4-disk-rotation": "removed",
            "data-placement-fixed": "true",
            "data-motion-only-control": "true",
            "data-center-locked": "true",
            "aria-label":
              context === CONTEXTS.standalone
                ? "Demo Universe Earth Generation 4 home-anchored fixed-position globe"
                : "Showroom Generation 4 home-anchored fixed-position globe"
          },
          [
            create("div", {
              className: "showroom-generation-3-earth-surface showroom-generation-4-surface-track",
              "data-generation-4-surface-track": "active",
              "aria-hidden": "true"
            }),

            create("div", {
              className: "showroom-generation-3-earth-clouds showroom-generation-4-cloud-track",
              "data-generation-4-cloud-track": "active",
              "aria-hidden": "true"
            }),

            create("span", { className: "showroom-generation-3-ocean-land-color", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-3-cloud-depth", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-4-latitude-shade", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-3-light", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-3-terminator", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-3-night-depth", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-3-moon-reflection", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-3-atmosphere", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-3-rim", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-4-center-origin", "aria-hidden": "true" })
          ]
        )
      ]
    );

    const shell = create(
      "section",
      {
        className: "showroom-generation-3-shell showroom-generation-4-home-anchor-shell",
        "data-active-realm": realm,
        "data-generation-4-home-anchor": "active",
        "data-generation-4-speed-authority": "active",
        "data-generation-4-inertial-release-spin": "active",
        "data-generation-4-disk-rotation": "removed",
        "data-generation-4-center-origin": "locked",
        "data-placement-fixed": "true",
        "data-motion-only-control": "true",
        "data-drag-translates-container": "false",
        "data-shared-instrument-role": "rendering-and-control-service-only",
        "data-shared-active-realm-identity": "false",
        "data-cross-realm-link-type": "navigation-only",
        "data-render-context": context
      },
      [
        axisFrame,

        create("p", {
          className: "showroom-generation-3-caption",
          "data-generation-4-caption": "active",
          text: caption
        }),

        createTelemetryNode(context),

        create("a", {
          className: "showroom-generation-3-link",
          href: link.href,
          "data-cross-realm-link-type": "navigation-only",
          text: link.text
        })
      ]
    );

    setDataset(shell, getContextReceipts(context));
    purifyVisualObject(shell);

    return shell;
  }

  function createControlState(context) {
    return {
      context: normalizeContext(context),
      realm: realmForContext(context),
      zoom: HOME_STATE.zoom,
      minZoom: 0.72,
      maxZoom: 1.62,
      longitude: HOME_STATE.longitude,
      cloudLongitude: HOME_STATE.cloudLongitude,
      latitude: HOME_STATE.latitude,
      observerTilt: 0,
      lightAnchor: HOME_STATE.lightAnchor,
      paused: HOME_STATE.paused,
      autoDriftEnabled: HOME_STATE.autoDriftEnabled,
      dragging: false,
      lastX: 0,
      lastY: 0,
      lastMoveTime: 0,
      velocityLongitude: 0,
      velocityCloud: 0,
      velocityLatitude: 0,
      inertialSpinActive: false,
      frameId: 0,
      lastTime: 0
    };
  }

  function createReadoutSpan(label, value) {
    return create("span", { text: label + "=" + value });
  }

  function resetToHome(state) {
    state.zoom = HOME_STATE.zoom;
    state.longitude = HOME_STATE.longitude;
    state.cloudLongitude = HOME_STATE.cloudLongitude;
    state.latitude = HOME_STATE.latitude;
    state.observerTilt = 0;
    state.lightAnchor = HOME_STATE.lightAnchor;
    state.paused = HOME_STATE.paused;
    state.autoDriftEnabled = HOME_STATE.autoDriftEnabled;
    state.dragging = false;
    state.velocityLongitude = 0;
    state.velocityCloud = 0;
    state.velocityLatitude = 0;
    state.inertialSpinActive = false;
    state.lastMoveTime = 0;
    state.lastTime = 0;
  }

  function setLightAnchor(globe, state) {
    if (!globe) return;

    if (state.lightAnchor === "moon") {
      globe.style.setProperty("--showroom-light-x", "70%");
      globe.style.setProperty("--showroom-night-x", "28%");
      globe.style.setProperty("--showroom-moon-x", "72%");
      globe.style.setProperty("--showroom-light-strength", ".18");
      globe.style.setProperty("--showroom-night-opacity", ".38");
      globe.style.setProperty("--showroom-moon-opacity", ".24");
    } else {
      globe.style.setProperty("--showroom-light-x", "34%");
      globe.style.setProperty("--showroom-night-x", "76%");
      globe.style.setProperty("--showroom-moon-x", "72%");
      globe.style.setProperty("--showroom-light-strength", ".30");
      globe.style.setProperty("--showroom-night-opacity", ".56");
      globe.style.setProperty("--showroom-moon-opacity", ".12");
    }

    const lightY = clamp(30 + (state.latitude - 50) * 0.42, 16, 70);
    const latitudeStop = clamp(36 + state.observerTilt * 0.62, 18, 68);
    const latOffset = clamp((state.latitude - 50) * -0.95, -30, 30);

    globe.style.setProperty("--showroom-light-y", lightY.toFixed(1) + "%");
    globe.style.setProperty("--showroom-moon-y", clamp(lightY - 4, 14, 64).toFixed(1) + "%");
    globe.style.setProperty("--showroom-latitude-light-stop", latitudeStop.toFixed(1) + "%");
    globe.style.setProperty("--showroom-latitude-offset", latOffset.toFixed(2) + "%");
    globe.style.setProperty("--showroom-axis-tilt", MOTION.axisTiltDegrees + "deg");
  }

  function applyMotionState(mount, shell, globe, surface, clouds, readout, state) {
    const scale = state.zoom.toFixed(2);
    const longitude = mod(state.longitude, 200);
    const cloudLongitude = mod(state.cloudLongitude, 200);
    const latitude = clamp(state.latitude, MOTION.latitudeMin, MOTION.latitudeMax);
    const observerTilt = clamp((latitude - 50) * 1.22, -38, 38);

    state.longitude = longitude;
    state.cloudLongitude = cloudLongitude;
    state.latitude = latitude;
    state.observerTilt = observerTilt;

    if (globe) {
      globe.style.setProperty("--showroom-control-scale", scale);
      globe.style.setProperty("--showroom-observer-tilt", observerTilt.toFixed(2) + "deg");
      globe.dataset.controlDragging = state.dragging ? "true" : "false";
      setLightAnchor(globe, state);
    }

    if (surface) {
      surface.style.backgroundImage = "url('" + ASSETS.earthSurface + "')";
      surface.style.backgroundPosition =
        longitude.toFixed(2) + "% " + latitude.toFixed(2) + "%";
    }

    if (clouds) {
      clouds.style.backgroundImage = "url('" + ASSETS.earthClouds + "')";
      clouds.style.backgroundPosition =
        cloudLongitude.toFixed(2) + "% " + clamp(latitude - 4, 10, 90).toFixed(2) + "%";
    }

    const receipt = {
      placementFixed: "true",
      motionOnlyControl: "true",
      centerLocked: "true",
      homeAnchor: "active",
      idleAutoDrift: state.autoDriftEnabled ? "enabled" : "locked",
      controlZoomLevel: scale,
      controlLongitude: longitude.toFixed(2),
      controlLatitude: latitude.toFixed(2),
      controlObserverTilt: observerTilt.toFixed(2),
      controlLightAnchor: state.lightAnchor,
      releaseSpinActive: state.inertialSpinActive ? "true" : "false",
      releaseVelocityLongitude: state.velocityLongitude.toFixed(4),
      releaseVelocityLatitude: state.velocityLatitude.toFixed(4),
      speedAuthority: SPEED_AUTHORITY.file,
      generation4Closure: "home-anchor-fixed-position-control-active",
      generation4MotionModel: "home-anchored-fixed-placement-internal-motion"
    };

    setDataset(mount, receipt);
    setDataset(shell, receipt);

    if (readout) {
      readout.replaceChildren(
        createReadoutSpan("home", "anchored"),
        createReadoutSpan("idle", state.autoDriftEnabled ? "auto" : "locked"),
        createReadoutSpan("placement", "fixed"),
        createReadoutSpan("motion", "internal"),
        createReadoutSpan("spin", state.inertialSpinActive ? "release" : "ready"),
        createReadoutSpan("lon", Math.round(longitude) + "%"),
        createReadoutSpan("lat", Math.round(latitude) + "%"),
        createReadoutSpan("zoom", scale)
      );
    }
  }

  function dampVelocity(value, delta) {
    const damping = Math.pow(MOTION.releaseVelocityDamping, delta / 16.67);
    const next = value * damping;

    return Math.abs(next) < MOTION.releaseVelocityMin ? 0 : next;
  }

  function capVelocity(value) {
    return clamp(value, -MOTION.releaseVelocityMax, MOTION.releaseVelocityMax);
  }

  function updateInertialActivity(state) {
    state.inertialSpinActive =
      Math.abs(state.velocityLongitude) >= MOTION.releaseVelocityMin ||
      Math.abs(state.velocityCloud) >= MOTION.releaseVelocityMin ||
      Math.abs(state.velocityLatitude) >= MOTION.releaseVelocityMin;
  }

  function startSphericalLoop(mount, shell, globe, surface, clouds, readout, state) {
    if (activeLoops.has(mount)) {
      const previous = activeLoops.get(mount);
      if (previous && previous.frameId) window.cancelAnimationFrame(previous.frameId);
    }

    function loop(time) {
      if (!state.lastTime) state.lastTime = time;

      const delta = Math.min(34, time - state.lastTime);
      state.lastTime = time;

      if (!state.paused && !state.dragging) {
        if (MOTION.releaseSpinEnabled && state.inertialSpinActive) {
          state.longitude = mod(state.longitude + state.velocityLongitude * delta, 200);
          state.cloudLongitude = mod(state.cloudLongitude + state.velocityCloud * delta, 200);
          state.latitude = clamp(
            state.latitude + state.velocityLatitude * delta,
            MOTION.latitudeMin,
            MOTION.latitudeMax
          );

          state.velocityLongitude = dampVelocity(state.velocityLongitude, delta);
          state.velocityCloud = dampVelocity(state.velocityCloud, delta);
          state.velocityLatitude = dampVelocity(state.velocityLatitude, delta);

          updateInertialActivity(state);
        } else if (state.autoDriftEnabled) {
          state.longitude = mod(state.longitude - MOTION.longitudeAutoStep * delta, 200);
          state.cloudLongitude = mod(state.cloudLongitude - MOTION.cloudAutoStep * delta, 200);
        }
      }

      applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      state.frameId = window.requestAnimationFrame(loop);
    }

    state.frameId = window.requestAnimationFrame(loop);
    activeLoops.set(mount, state);
  }

  function ensureControlPanel(mount, shell, context) {
    const state = createControlState(context);
    const globe = shell.querySelector(".showroom-generation-3-active-globe");
    const surface = shell.querySelector(".showroom-generation-4-surface-track");
    const clouds = shell.querySelector(".showroom-generation-4-cloud-track");

    const controls = create(
      "div",
      {
        className: "showroom-generation-3-control-panel",
        "data-generation-4-control-panel": "active",
        role: "group",
        "aria-label": "Globe control panel"
      },
      []
    );

    const readout = create("div", {
      className: "showroom-generation-3-control-readout",
      "data-generation-4-control-readout": "active",
      "aria-label": "Globe control readout"
    });

    function button(label, action) {
      const btn = create("button", { type: "button", text: label });
      btn.addEventListener("click", action);
      return btn;
    }

    controls.append(
      button("Zoom +", function () {
        state.zoom = Math.min(state.maxZoom, Number((state.zoom + 0.08).toFixed(2)));
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      }),
      button("Zoom −", function () {
        state.zoom = Math.max(state.minZoom, Number((state.zoom - 0.08).toFixed(2)));
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      }),
      button("Sun", function () {
        state.lightAnchor = "sun";
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      }),
      button("Moon", function () {
        state.lightAnchor = "moon";
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      }),
      button("Pause", function () {
        state.paused = true;
        state.velocityLongitude = 0;
        state.velocityCloud = 0;
        state.velocityLatitude = 0;
        updateInertialActivity(state);
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      }),
      button("Resume", function () {
        state.paused = false;
        state.autoDriftEnabled = false;
        state.lastTime = 0;
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      }),
      button("Home", function () {
        resetToHome(state);
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      }),
      button("Reset", function () {
        resetToHome(state);
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      })
    );

    if (globe) {
      globe.addEventListener("pointerdown", function (event) {
        preventDefault(event);

        state.dragging = true;
        state.lastX = event.clientX;
        state.lastY = event.clientY;
        state.lastMoveTime = performance.now();
        state.velocityLongitude = 0;
        state.velocityCloud = 0;
        state.velocityLatitude = 0;
        updateInertialActivity(state);

        try {
          globe.setPointerCapture(event.pointerId);
        } catch (error) {
          /* no-op */
        }

        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      });

      globe.addEventListener("pointermove", function (event) {
        preventDefault(event);

        if (!state.dragging) return;

        const now = performance.now();
        const elapsed = Math.max(8, Math.min(MOTION.releaseVelocitySampleMs, now - state.lastMoveTime));
        const deltaX = event.clientX - state.lastX;
        const deltaY = event.clientY - state.lastY;

        if (Math.abs(deltaX) < MOTION.dragDeadZonePx && Math.abs(deltaY) < MOTION.dragDeadZonePx) {
          return;
        }

        const moveLongitude = deltaX * MOTION.dragLongitudeFactor;
        const moveCloud = deltaX * MOTION.dragCloudFactor;
        const moveLatitude = deltaY * MOTION.dragLatitudeFactor;

        state.lastX = event.clientX;
        state.lastY = event.clientY;
        state.lastMoveTime = now;

        state.longitude = mod(state.longitude + moveLongitude, 200);
        state.cloudLongitude = mod(state.cloudLongitude + moveCloud, 200);
        state.latitude = clamp(
          state.latitude + moveLatitude,
          MOTION.latitudeMin,
          MOTION.latitudeMax
        );

        state.velocityLongitude = capVelocity(moveLongitude / elapsed);
        state.velocityCloud = capVelocity(moveCloud / elapsed);
        state.velocityLatitude = capVelocity(moveLatitude / elapsed);

        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      });

      globe.addEventListener("pointerup", function (event) {
        preventDefault(event);

        state.dragging = false;
        updateInertialActivity(state);

        try {
          globe.releasePointerCapture(event.pointerId);
        } catch (error) {
          /* no-op */
        }

        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      });

      globe.addEventListener("pointercancel", function (event) {
        preventDefault(event);

        state.dragging = false;
        updateInertialActivity(state);
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      });

      globe.addEventListener("wheel", function (event) {
        preventDefault(event);

        const direction = event.deltaY < 0 ? 1 : -1;
        state.zoom = clamp(
          Number((state.zoom + direction * MOTION.wheelZoomStep).toFixed(2)),
          state.minZoom,
          state.maxZoom
        );

        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      }, { passive: false });
    }

    shell.appendChild(controls);
    shell.appendChild(readout);

    applyMotionState(mount, shell, globe, surface, clouds, readout, state);
    startSphericalLoop(mount, shell, globe, surface, clouds, readout, state);
  }

  function notifyRuntime(status) {
    const runtime = window.DGBShowroomRuntime;

    if (runtime && typeof runtime.setGeneration3MotionStatus === "function") {
      runtime.setGeneration3MotionStatus(status || "generation-4-home-anchor-fixed-position-control-active");
    }

    if (runtime && typeof runtime.setActiveGlobeStatus === "function") {
      runtime.setActiveGlobeStatus(status || "generation-4-home-anchor-fixed-position-control-active");
    }
  }

  function renderGlobe(mount, options) {
    if (!mount) {
      throw new Error("Showroom globe instrument requires a mount node.");
    }

    ensureStyles();

    const config = options || {};
    const context = normalizeContext(config.context);
    const shell = createGlobeNode(config);

    mount.replaceChildren(shell);

    setDataset(mount, getContextReceipts(context));
    mount.dataset.renderStatus = "generation-4-home-anchor-fixed-position-control-mounted";
    mount.dataset.showroomGlobePlacement = "home-anchor-fixed-position-control";
    mount.dataset.generation4Closure = "home-anchor-fixed-position-control-active";
    mount.dataset.homeAnchor = "active";
    mount.dataset.idleAutoDrift = "locked";
    mount.dataset.placementFixed = "true";
    mount.dataset.motionOnlyControl = "true";
    mount.dataset.centerLocked = "true";

    enforceRealmSeparation(mount, context);
    installRealmGuard(mount, context);
    ensureControlPanel(mount, shell, context);
    notifyRuntime("generation-4-home-anchor-fixed-position-control-mounted");

    return mount;
  }

  function writeReceipts(node, context, extra) {
    const normalized = normalizeContext(context);

    setDataset(node, Object.assign({}, getContextReceipts(normalized), extra || {}));
    enforceRealmSeparation(node, normalized);
  }

  async function verifyAssets() {
    const surface = await fetch(ASSETS.earthSurface, { cache: "no-store" });
    const clouds = await fetch(ASSETS.earthClouds, { cache: "no-store" });

    return {
      surfaceOk: surface.ok,
      surfaceStatus: surface.status,
      cloudsOk: clouds.ok,
      cloudsStatus: clouds.status,
      version: VERSION,
      refinementVersion: REFINEMENT_VERSION,
      speedAuthority: SPEED_AUTHORITY.file,
      instrumentSpeedAuthority: true,
      runtimeSpeedAuthority: false,
      cssAnimationAuthority: false,
      homeState: HOME_STATE,
      homeAnchor: "active",
      idleAutoDrift: "locked",
      longitudeAutoStep: MOTION.longitudeAutoStep,
      cloudAutoStep: MOTION.cloudAutoStep,
      dragLongitudeFactor: MOTION.dragLongitudeFactor,
      dragCloudFactor: MOTION.dragCloudFactor,
      dragLatitudeFactor: MOTION.dragLatitudeFactor,
      latitudeReturnFriction: MOTION.latitudeReturnFriction,
      releaseSpinEnabled: MOTION.releaseSpinEnabled,
      releaseVelocityDamping: MOTION.releaseVelocityDamping,
      placementAuthority: PLACEMENT.placementAuthority,
      motionAuthority: PLACEMENT.motionAuthority,
      placementFixed: true,
      motionOnlyControl: true,
      centerLocked: true,
      dragTranslatesContainer: false,
      wheelZoomScalesFromCenter: true,
      releaseSpinInternal: true,
      generation1RingScaffold: "removed",
      generation2ReceiptOnly: "true",
      generation2VisualClassEmission: "removed",
      generation3RealmSeparation: "active",
      generation4Refinement: REFINEMENT_VERSION,
      generation4MotionModel: "home-anchored-fixed-placement-internal-motion",
      generation4InertialReleaseSpin: "active",
      generation4DiskRotation: "removed",
      generation4SphericalRead: "active",
      generation4HorizontalFriction: "calibrated",
      generation4VerticalControl: "visible-latitude-disposition",
      generation4AxisDisposition: "23.5-degree-axis-frame",
      generation4CenterOrigin: "locked",
      generation4ZoomControl: "center-scale-only",
      generation4DragControl: "motion-only-two-axis"
    };
  }

  window.DGBShowroomGlobeInstrument = Object.freeze({
    version: VERSION,
    refinementVersion: REFINEMENT_VERSION,
    assets: ASSETS,
    contexts: CONTEXTS,
    realms: REALMS,
    homeState: HOME_STATE,
    motion: MOTION,
    placement: PLACEMENT,
    speedAuthority: SPEED_AUTHORITY,
    create: create,
    setDataset: setDataset,
    purifyVisualObject: purifyVisualObject,
    stripForbiddenVisualClasses: stripForbiddenVisualClasses,
    removeForbiddenScaffoldNodes: removeForbiddenScaffoldNodes,
    getContextReceipts: getContextReceipts,
    enforceRealmSeparation: enforceRealmSeparation,
    createGlobeNode: createGlobeNode,
    renderGlobe: renderGlobe,
    writeReceipts: writeReceipts,
    verifyAssets: verifyAssets
  });
})();
