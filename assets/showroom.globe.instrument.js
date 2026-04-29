/*
  /assets/showroom.globe.instrument.js
  SHOWROOM_GENERATION_4_SPHERICAL_MOTION_CONTROL_CLOSEOUT_TNT_v1

  Purpose:
  - Preserve the Generation 4 realm-separated globe system.
  - Stop disk-like whole-plane rotation.
  - Make the globe read as a sphere by moving the surface/cloud layers inside a stable clipped globe.
  - Preserve zoom, drag, pause, resume, reset, telemetry, parent realm, and demo realm behavior.

  Owns:
  - shared globe render object
  - spherical surface/cloud motion model
  - globe control panel
  - realm-separated receipts

  Does not own:
  - route HTML
  - route rail
  - Gauges logic
  - runtime authority
  - global Manor CSS
*/

(function () {
  "use strict";

  const VERSION = "showroom-generation-4-spherical-motion-control-instrument-v1";

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

  const GENERATIONS = Object.freeze({
    generation1: "ring-scaffold-removed",
    generation2: "receipt-only",
    generation3: "realm-separated-control-authorized-globe",
    generation4: "spherical-motion-control-closeout"
  });

  const MOTION = Object.freeze({
    axisTiltDegrees: 23.5,
    rotationDirection: "east-west",
    surfaceStep: 0.115,
    cloudStep: 0.052
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
      node.dataset[entry[0]] = String(entry[1]);
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

  function ensureSphericalStyles() {
    if (document.getElementById("showroom-generation-4-spherical-motion-style")) return;

    const style = create("style", {
      id: "showroom-generation-4-spherical-motion-style",
      text:
        ".showroom-generation-3-shell{position:relative;display:grid;justify-items:center;gap:.75rem;width:min(760px,100%);margin:0 auto;isolation:isolate}" +

        ".showroom-generation-3-active-globe{position:relative;width:min(330px,72vw);aspect-ratio:1/1;border-radius:50%;overflow:hidden;isolation:isolate;cursor:grab;touch-action:none;transform:scale(var(--showroom-control-scale,1))!important;animation:none!important;background:#07111f;box-shadow:inset -34px 0 54px rgba(0,0,0,.48),inset 24px 0 38px rgba(116,184,255,.16),0 24px 70px rgba(0,0,0,.48),0 0 52px rgba(116,184,255,.18);border:1px solid rgba(245,199,107,.18)}" +
        ".showroom-generation-3-active-globe[data-control-dragging='true']{cursor:grabbing}" +

        ".showroom-generation-4-surface-track,.showroom-generation-4-cloud-track{position:absolute;inset:-1px;border-radius:50%;background-repeat:repeat-x;background-position:0 center;background-size:auto 100%;transform:none!important;animation:none!important;will-change:background-position;pointer-events:none}" +
        ".showroom-generation-4-surface-track{z-index:2;opacity:1;filter:saturate(1.06) contrast(1.03)}" +
        ".showroom-generation-4-cloud-track{z-index:4;opacity:.46;mix-blend-mode:screen;filter:brightness(1.12) contrast(1.05)}" +

        ".showroom-generation-3-ocean-land-color{position:absolute;inset:0;border-radius:50%;z-index:3;background:radial-gradient(circle at 38% 32%,rgba(116,184,255,.16),transparent 28%),radial-gradient(circle at 62% 58%,rgba(245,199,107,.10),transparent 34%);mix-blend-mode:overlay;pointer-events:none}" +
        ".showroom-generation-3-cloud-depth{position:absolute;inset:0;border-radius:50%;z-index:5;background:radial-gradient(circle at 42% 24%,rgba(255,255,255,.12),transparent 26%),radial-gradient(circle at 68% 62%,rgba(255,255,255,.05),transparent 38%);pointer-events:none}" +
        ".showroom-generation-3-light{position:absolute;inset:0;border-radius:50%;z-index:8;background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.28),transparent 28%),linear-gradient(90deg,rgba(255,255,255,.08),transparent 45%);mix-blend-mode:screen;pointer-events:none}" +
        ".showroom-generation-3-terminator{position:absolute;inset:-1px;border-radius:50%;z-index:9;background:linear-gradient(90deg,transparent 0%,transparent 45%,rgba(0,0,0,.18) 58%,rgba(0,0,0,.54) 100%);pointer-events:none}" +
        ".showroom-generation-3-night-depth{position:absolute;inset:0;border-radius:50%;z-index:10;background:radial-gradient(circle at 76% 50%,rgba(0,0,0,.44),transparent 48%);pointer-events:none}" +
        ".showroom-generation-3-moon-reflection{position:absolute;inset:0;border-radius:50%;z-index:11;background:radial-gradient(circle at 72% 24%,rgba(245,199,107,.12),transparent 15%);mix-blend-mode:screen;pointer-events:none}" +
        ".showroom-generation-3-atmosphere{position:absolute;inset:-2px;border-radius:50%;z-index:12;box-shadow:inset 0 0 28px rgba(116,184,255,.28),0 0 34px rgba(116,184,255,.22);pointer-events:none}" +
        ".showroom-generation-3-rim{position:absolute;inset:0;border-radius:50%;z-index:13;background:radial-gradient(circle at 50% 50%,transparent 55%,rgba(116,184,255,.18) 72%,rgba(245,199,107,.20) 100%);pointer-events:none}" +

        ".showroom-generation-3-axis-line{position:absolute;left:50%;top:50%;z-index:18;width:1px;height:calc(min(330px,72vw) * 1.22);background:linear-gradient(180deg,transparent,rgba(245,199,107,.72),transparent);transform:translate(-50%,-50%) rotate(var(--showroom-axis-tilt,23.5deg));pointer-events:none}" +
        ".showroom-generation-3-axis-node{position:absolute;left:50%;z-index:19;width:.42rem;height:.42rem;border-radius:50%;background:#f5c76b;box-shadow:0 0 20px rgba(245,199,107,.6);pointer-events:none}" +
        ".showroom-generation-3-axis-node-north{top:calc(50% - min(330px,72vw) * .61);transform:translateX(-50%)}" +
        ".showroom-generation-3-axis-node-south{top:calc(50% + min(330px,72vw) * .61);transform:translateX(-50%)}" +

        ".showroom-generation-3-caption{margin:.4rem 0 0;color:#f5c76b;font-weight:900;letter-spacing:.08em;text-align:center;text-transform:uppercase}" +
        ".showroom-generation-3-telemetry{display:flex;flex-wrap:wrap;justify-content:center;gap:.35rem;margin:.2rem auto 0;max-width:760px}" +
        ".showroom-generation-3-telemetry span{border:1px solid rgba(116,184,255,.22);border-radius:999px;padding:.28rem .48rem;color:rgba(226,238,255,.78);background:rgba(4,12,24,.48);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.68rem;font-weight:800}" +
        ".showroom-generation-3-link{border:1px solid rgba(245,199,107,.36);border-radius:999px;padding:.48rem .72rem;color:#f6efe0;background:rgba(4,12,24,.58);text-decoration:none;font-weight:900}" +

        ".showroom-generation-3-control-panel{display:flex;flex-wrap:wrap;justify-content:center;gap:.45rem;width:min(760px,100%);margin:.35rem auto 0;position:relative;z-index:80}" +
        ".showroom-generation-3-control-panel button{border:1px solid rgba(245,199,107,.36);border-radius:999px;padding:.42rem .68rem;color:#f6efe0;background:rgba(4,12,24,.68);font:inherit;font-size:.72rem;font-weight:900;letter-spacing:.04em;cursor:pointer}" +
        ".showroom-generation-3-control-panel button:hover,.showroom-generation-3-control-panel button:focus-visible{color:#07111f;background:#f5c76b;outline:none}" +
        ".showroom-generation-3-control-readout{display:flex;flex-wrap:wrap;justify-content:center;gap:.35rem;width:min(760px,100%);margin:.15rem auto 0;position:relative;z-index:80}" +
        ".showroom-generation-3-control-readout span{border:1px solid rgba(116,184,255,.22);border-radius:999px;padding:.28rem .48rem;color:rgba(226,238,255,.78);background:rgba(4,12,24,.48);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.68rem;font-weight:800}" +

        ".showroom-generation-3-earth-surface,.showroom-generation-3-earth-clouds{animation:none!important;transform:none!important}"
    });

    document.head.appendChild(style);
  }

  function getContextReceipts(context) {
    const normalized = normalizeContext(context);
    const realm = realmForContext(normalized);

    const base = {
      showroomGlobeInstrument: VERSION,
      worldKernelCompatible: "true",
      worldPlanetEngineCompatible: "true",
      assetInstrument: "showroom-globe",
      sharedInstrumentRole: "rendering-and-control-service-only",
      sharedActiveRealmIdentity: "false",
      crossRealmLinkType: "navigation-only",

      generation1NoGraphicBaseline: "preserved",
      generation1RingScaffold: "removed",
      generation2ReceiptOnly: "true",
      generation2VisualClassEmission: "removed",

      generation3: GENERATIONS.generation3,
      generation3RealmSeparation: "active",
      generation3ControlPanel: "active",

      generation4: GENERATIONS.generation4,
      generation4Closure: "spherical-motion-control-active",
      generation4MotionModel: "surface-and-cloud-translate-inside-stable-sphere",
      generation4DiskRotation: "removed",
      generation4SphericalRead: "active",
      generation4ZoomControl: "active",
      generation4DragControl: "surface-phase-control",

      generation3AxisTiltDegrees: String(MOTION.axisTiltDegrees),
      generation3RotationDirection: MOTION.rotationDirection,
      generation3Shadows: "active",
      generation3Depth: "active",
      generation3Terminator: "active",
      generation3Atmosphere: "active",
      generation3Telemetry: "active",

      ringScaffoldStatus: "removed",
      contextIsolationStatus: "active",
      realmSeparationStatus: "active",
      controlPanelActive: "true",
      controlPanelAuthority: "globe-interaction-layer",
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
        contextCaption: "GENERATION 4 · DEMO REALM · SPHERICAL CONTROL ACTIVE"
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
      contextCaption: "GENERATION 4 · SHOWROOM PROOF REALM · SPHERICAL CONTROL ACTIVE"
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
      sharedInstrumentRole: "rendering-and-control-service-only",
      sharedActiveRealmIdentity: "false",
      crossRealmLinkType: "navigation-only",
      generation1RingScaffold: "removed",
      generation2VisualClassEmission: "removed",
      generation3RealmSeparation: "active",
      generation4Closure: "spherical-motion-control-active",
      generation4DiskRotation: "removed",
      generation4SphericalRead: "active",
      ringScaffoldStatus: "removed",
      controlPanelActive: "true"
    });
  }

  function installRealmGuard(mount, context) {
    const normalized = normalizeContext(context);

    enforceRealmSeparation(mount, normalized);

    if (!mount || mount.dataset.realmGuardInstalled === VERSION + ":" + normalized) return;

    mount.dataset.realmGuardInstalled = VERSION + ":" + normalized;

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
        "data-ring-scaffold"
      ]
    });

    window.setTimeout(guard, 100);
    window.setTimeout(guard, 400);
    window.setTimeout(guard, 1100);
    window.setTimeout(guard, 2200);
  }

  function createTelemetryNode(context) {
    const normalized = normalizeContext(context);

    return create(
      "div",
      {
        className: "showroom-generation-3-telemetry",
        "data-generation-3-telemetry": "active",
        "data-generation-4-spherical-motion": "active",
        "aria-label": "Generation 4 spherical motion telemetry receipt"
      },
      [
        create("span", { text: "GEN 4" }),
        create("span", { text: "sphere=active" }),
        create("span", { text: "disk=removed" }),
        create("span", { text: "surface=translate" }),
        create("span", { text: "clouds=independent" }),
        create("span", { text: "zoom=active" }),
        create("span", { text: "drag=surface-phase" }),
        create("span", { text: "realm=separated" }),
        create("span", { text: "context=" + normalized })
      ]
    );
  }

  function captionForContext(context, override) {
    if (override) return override;

    return normalizeContext(context) === CONTEXTS.standalone
      ? "GENERATION 4 · DEMO REALM · SPHERICAL CONTROL ACTIVE"
      : "GENERATION 4 · SHOWROOM PROOF REALM · SPHERICAL CONTROL ACTIVE";
  }

  function linkForContext(context) {
    return normalizeContext(context) === CONTEXTS.standalone
      ? { href: ASSETS.parentRoute, text: "Return to Showroom" }
      : { href: ASSETS.globeRoute, text: "Open Demo Universe Earth" };
  }

  function createGlobeNode(options) {
    const config = options || {};
    const context = normalizeContext(config.context);
    const realm = realmForContext(context);
    const caption = captionForContext(context, config.caption);
    const link = linkForContext(context);

    const shell = create(
      "section",
      {
        className: "showroom-generation-3-shell showroom-generation-4-spherical-shell",
        "data-active-realm": realm,
        "data-generation-4-spherical-motion": "active",
        "data-generation-4-disk-rotation": "removed",
        "data-generation-4-closure": "spherical-motion-control-active",
        "data-shared-instrument-role": "rendering-and-control-service-only",
        "data-shared-active-realm-identity": "false",
        "data-cross-realm-link-type": "navigation-only",
        "data-render-context": context
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
            "data-generation-3-active-globe": "true",
            "data-generation-4-spherical-motion": "active",
            "data-generation-4-disk-rotation": "removed",
            "aria-label":
              context === CONTEXTS.standalone
                ? "Demo Universe Earth spherical Generation 4 globe"
                : "Showroom spherical Generation 4 globe"
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
            create("span", { className: "showroom-generation-3-light", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-3-terminator", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-3-night-depth", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-3-moon-reflection", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-3-atmosphere", "aria-hidden": "true" }),
            create("span", { className: "showroom-generation-3-rim", "aria-hidden": "true" })
          ]
        ),

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
      zoom: 1,
      minZoom: 0.72,
      maxZoom: 1.58,
      surfacePhase: 0,
      cloudPhase: 36,
      paused: false,
      dragging: false,
      lastX: 0,
      frameId: 0,
      lastTime: 0
    };
  }

  function createReadoutSpan(label, value) {
    return create("span", { text: label + "=" + value });
  }

  function applyMotionState(mount, shell, globe, surface, clouds, readout, state) {
    const scale = state.zoom.toFixed(2);
    const surfacePosition = state.surfacePhase.toFixed(2) + "% center";
    const cloudPosition = state.cloudPhase.toFixed(2) + "% center";

    if (globe) {
      globe.style.setProperty("--showroom-control-scale", scale);
      globe.dataset.controlDragging = state.dragging ? "true" : "false";
    }

    if (surface) {
      surface.style.backgroundImage = "url('" + ASSETS.earthSurface + "')";
      surface.style.backgroundPosition = surfacePosition;
    }

    if (clouds) {
      clouds.style.backgroundImage = "url('" + ASSETS.earthClouds + "')";
      clouds.style.backgroundPosition = cloudPosition;
    }

    setDataset(mount, {
      controlPanelActive: "true",
      controlPanelAuthority: "globe-interaction-layer",
      controlZoomLevel: scale,
      controlSurfacePhase: state.surfacePhase.toFixed(2),
      controlCloudPhase: state.cloudPhase.toFixed(2),
      controlAutoRotationPaused: state.paused ? "true" : "false",
      controlContext: state.context,
      controlRealm: state.realm,
      interactionAuthority: "globe-control-panel",
      generation4MotionModel: "surface-and-cloud-translate-inside-stable-sphere",
      generation4DiskRotation: "removed",
      generation4SphericalRead: "active"
    });

    setDataset(shell, {
      controlPanelActive: "true",
      controlZoomLevel: scale,
      controlSurfacePhase: state.surfacePhase.toFixed(2),
      controlCloudPhase: state.cloudPhase.toFixed(2),
      controlAutoRotationPaused: state.paused ? "true" : "false",
      generation4DiskRotation: "removed",
      generation4SphericalRead: "active"
    });

    if (readout) {
      readout.replaceChildren(
        createReadoutSpan("zoom", scale),
        createReadoutSpan("surface", Math.round(state.surfacePhase) + "%"),
        createReadoutSpan("clouds", Math.round(state.cloudPhase) + "%"),
        createReadoutSpan("pause", state.paused ? "true" : "false"),
        createReadoutSpan("realm", state.context)
      );
    }
  }

  function startSphericalLoop(mount, shell, globe, surface, clouds, readout, state) {
    if (activeLoops.has(mount)) {
      const previous = activeLoops.get(mount);
      if (previous && previous.frameId) window.cancelAnimationFrame(previous.frameId);
    }

    function loop(time) {
      if (!state.lastTime) state.lastTime = time;

      const delta = Math.min(48, time - state.lastTime);
      state.lastTime = time;

      if (!state.paused && !state.dragging) {
        state.surfacePhase = (state.surfacePhase - MOTION.surfaceStep * delta) % 200;
        state.cloudPhase = (state.cloudPhase - MOTION.cloudStep * delta) % 200;
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
      button("Pause", function () {
        state.paused = true;
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      }),
      button("Resume", function () {
        state.paused = false;
        state.lastTime = 0;
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      }),
      button("Reset", function () {
        state.zoom = 1;
        state.surfacePhase = 0;
        state.cloudPhase = 36;
        state.paused = false;
        state.dragging = false;
        state.lastTime = 0;
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      })
    );

    if (globe) {
      globe.addEventListener("pointerdown", function (event) {
        state.dragging = true;
        state.lastX = event.clientX;
        globe.setPointerCapture(event.pointerId);
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      });

      globe.addEventListener("pointermove", function (event) {
        if (!state.dragging) return;

        const delta = event.clientX - state.lastX;
        state.lastX = event.clientX;
        state.surfacePhase = (state.surfacePhase + delta * 0.34) % 200;
        state.cloudPhase = (state.cloudPhase + delta * 0.16) % 200;

        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      });

      globe.addEventListener("pointerup", function (event) {
        state.dragging = false;
        try {
          globe.releasePointerCapture(event.pointerId);
        } catch (error) {
          /* no-op */
        }
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      });

      globe.addEventListener("pointercancel", function () {
        state.dragging = false;
        applyMotionState(mount, shell, globe, surface, clouds, readout, state);
      });
    }

    shell.appendChild(controls);
    shell.appendChild(readout);

    applyMotionState(mount, shell, globe, surface, clouds, readout, state);
    startSphericalLoop(mount, shell, globe, surface, clouds, readout, state);
  }

  function notifyRuntime(status) {
    const runtime = window.DGBShowroomRuntime;

    if (runtime && typeof runtime.setGeneration3MotionStatus === "function") {
      runtime.setGeneration3MotionStatus(status || "generation-4-spherical-motion-control-active");
    }

    if (runtime && typeof runtime.setActiveGlobeStatus === "function") {
      runtime.setActiveGlobeStatus(status || "generation-4-spherical-motion-control-active");
    }
  }

  function renderGlobe(mount, options) {
    if (!mount) {
      throw new Error("Showroom globe instrument requires a mount node.");
    }

    ensureSphericalStyles();

    const config = options || {};
    const context = normalizeContext(config.context);
    const shell = createGlobeNode(config);

    mount.replaceChildren(shell);

    setDataset(mount, getContextReceipts(context));
    mount.dataset.renderStatus = "generation-4-spherical-motion-control-mounted";
    mount.dataset.showroomGlobePlacement = "generation-4-spherical-motion-control";
    mount.dataset.generation4Closure = "spherical-motion-control-active";

    enforceRealmSeparation(mount, context);
    installRealmGuard(mount, context);
    ensureControlPanel(mount, shell, context);
    notifyRuntime("generation-4-spherical-motion-control-mounted");

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
      generation1RingScaffold: "removed",
      generation2ReceiptOnly: "true",
      generation2VisualClassEmission: "removed",
      generation3RealmSeparation: "active",
      generation4: GENERATIONS.generation4,
      generation4MotionModel: "surface-and-cloud-translate-inside-stable-sphere",
      generation4DiskRotation: "removed",
      generation4SphericalRead: "active",
      generation4ZoomControl: "active",
      generation4DragControl: "surface-phase-control"
    };
  }

  window.DGBShowroomGlobeInstrument = Object.freeze({
    version: VERSION,
    assets: ASSETS,
    generations: GENERATIONS,
    contexts: CONTEXTS,
    realms: REALMS,
    motion: MOTION,
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
