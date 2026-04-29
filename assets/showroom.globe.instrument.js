/*
  /assets/showroom.globe.instrument.js
  SHOWROOM_GLOBE_INSTRUMENT_CONTROL_PANEL_TAKEOVER_TNT_v1

  Renewal duties:
  1. Emit Generation 3 visual classes only.
  2. Split parent-context receipts from standalone-context receipts.
  3. Keep the orbital/ring scaffold removed.
  4. Add the control panel as the final accountable interaction layer.

  Control panel owns:
  - zoom in / zoom out
  - reset view
  - pause / resume
  - manual drag rotation
  - orientation receipts
  - interaction state receipts

  Control panel does not own:
  - page layout
  - route rail
  - Gauges logic
  - raw Earth assets
  - global Manor skin
*/

(function () {
  "use strict";

  const VERSION = "showroom-generation-3-control-panel-takeover-instrument-v1";

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

  const GENERATIONS = Object.freeze({
    generation1: "no-graphic-baseline-preserved-ring-scaffold-removed",
    generation2: "baseline-graphics-preserved-as-receipt-only",
    generation3: "context-isolated-control-panel-authorized-globe"
  });

  const MOTION = Object.freeze({
    axisTiltDegrees: 23.5,
    rotationDirection: "east-west",
    surfaceRotationPeriodSeconds: 18,
    cloudRotationPeriodSeconds: 31,
    reducedMotionMode: "static-axis-shadow-preserved"
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

  function normalizeContext(context) {
    return context === CONTEXTS.standalone ? CONTEXTS.standalone : CONTEXTS.parent;
  }

  function create(tag, attrs, children) {
    const node = document.createElement(tag);

    Object.entries(attrs || {}).forEach(function (entry) {
      const key = entry[0];
      const value = entry[1];

      if (value === null || value === undefined || value === false) return;

      if (key === "className") {
        node.className = value;
      } else if (key === "text") {
        node.textContent = value;
      } else {
        node.setAttribute(key, String(value));
      }
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

  function ensureControlStyles() {
    if (document.getElementById("showroom-globe-control-panel-style")) return;

    const style = create("style", {
      id: "showroom-globe-control-panel-style",
      text:
        ".showroom-generation-3-control-panel{display:flex;flex-wrap:wrap;justify-content:center;gap:.45rem;width:min(760px,100%);margin:.35rem auto 0;position:relative;z-index:80}" +
        ".showroom-generation-3-control-panel button{border:1px solid rgba(245,199,107,.36);border-radius:999px;padding:.42rem .68rem;color:#f6efe0;background:rgba(4,12,24,.68);font:inherit;font-size:.72rem;font-weight:900;letter-spacing:.04em;cursor:pointer}" +
        ".showroom-generation-3-control-panel button:hover,.showroom-generation-3-control-panel button:focus-visible{color:#07111f;background:#f5c76b;outline:none}" +
        ".showroom-generation-3-control-readout{display:flex;flex-wrap:wrap;justify-content:center;gap:.35rem;width:min(760px,100%);margin:.15rem auto 0;position:relative;z-index:80}" +
        ".showroom-generation-3-control-readout span{border:1px solid rgba(116,184,255,.22);border-radius:999px;padding:.28rem .48rem;color:rgba(226,238,255,.78);background:rgba(4,12,24,.48);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.68rem;font-weight:800}" +
        ".showroom-generation-3-active-globe[data-control-dragging='true']{cursor:grabbing}" +
        ".showroom-generation-3-active-globe{cursor:grab;touch-action:none}"
    });

    document.head.appendChild(style);
  }

  function getContextReceipts(context) {
    const normalized = normalizeContext(context);

    const base = {
      showroomGlobeInstrument: VERSION,
      worldKernelCompatible: "true",
      worldPlanetEngineCompatible: "true",
      assetInstrument: "showroom-globe",

      generation1NoGraphicBaseline: "preserved",
      generation1RingScaffold: "removed",
      generation2BaselineGraphics: "preserved",
      generation2ActiveGlobe: "preserved",
      generation2ReceiptOnly: "true",
      generation2VisualClassEmission: "removed",

      generation3: GENERATIONS.generation3,
      generation3FullExpression: "axis-rotation-depth-refinement-active",
      generation3ObjectPurification: "active",
      generation3ContextIsolation: "active",
      generation3ControlPanel: "active",
      generation3VisualTruth: "pending-user-visual-confirmation",
      generation3Axis: "active",
      generation3AxisTiltDegrees: String(MOTION.axisTiltDegrees),
      generation3Rotation: "active",
      generation3RuntimeMotion: "active",
      generation3RotationDirection: MOTION.rotationDirection,
      generation3SurfaceRotationPeriodSeconds: String(MOTION.surfaceRotationPeriodSeconds),
      generation3CloudRotationPeriodSeconds: String(MOTION.cloudRotationPeriodSeconds),
      generation3Shadows: "active",
      generation3Depth: "active",
      generation3ColorDiscrimination: "active",
      generation3MoonReflection: "prepared",
      generation3Terminator: "active",
      generation3Atmosphere: "active",
      generation3Telemetry: "active",
      generation3Detail: "active",
      generation3RingScaffold: "removed",

      legacyScaffoldStatus: "removed",
      ringScaffoldStatus: "removed",
      contextIsolationStatus: "active",
      controlPanelActive: "true",
      controlPanelAuthority: "globe-interaction-layer",
      earthSurface: ASSETS.earthSurface,
      earthClouds: ASSETS.earthClouds,
      renderContext: normalized
    };

    if (normalized === CONTEXTS.standalone) {
      return Object.assign(base, {
        activeRouteRole: "demo-universe-earth",
        standaloneRole: "demo-universe-earth",
        showroomGlobeRoute: ASSETS.globeRoute,
        parentRouteAvailable: ASSETS.parentRoute,
        contextReceiptMode: "standalone-isolated",
        contextCaption: "GENERATION 3 · DEMO UNIVERSE EARTH · AXIS ROTATION ACTIVE"
      });
    }

    return Object.assign(base, {
      activeRouteRole: "showroom-proof-surface",
      parentRole: "showroom-proof-surface",
      showroomParentRoute: ASSETS.parentRoute,
      globeRouteAvailable: ASSETS.globeRoute,
      contextReceiptMode: "parent-isolated",
      contextCaption: "GENERATION 3 · AXIS ROTATION · SHADOW DEPTH ACTIVE"
    });
  }

  function enforceContextIsolation(node, context) {
    const normalized = normalizeContext(context);

    if (!node) return;

    purifyVisualObject(node);

    if (normalized === CONTEXTS.parent) {
      removeDatasetKeys(node, [
        "showroomGlobeRoute",
        "standaloneRole",
        "demoUniverseEarthBoot",
        "generation2StandaloneGlobe"
      ]);

      setDataset(node, {
        renderContext: "parent",
        parentRole: "showroom-proof-surface",
        showroomParentRoute: ASSETS.parentRoute,
        globeRouteAvailable: ASSETS.globeRoute,
        contextReceiptMode: "parent-isolated"
      });
    } else {
      removeDatasetKeys(node, [
        "showroomParentRoute",
        "parentRole",
        "showroomParentBoot",
        "showroomParentRenderBridge"
      ]);

      setDataset(node, {
        renderContext: "standalone",
        standaloneRole: "demo-universe-earth",
        showroomGlobeRoute: ASSETS.globeRoute,
        parentRouteAvailable: ASSETS.parentRoute,
        contextReceiptMode: "standalone-isolated"
      });
    }

    setDataset(node, {
      generation1RingScaffold: "removed",
      generation2VisualClassEmission: "removed",
      generation3RingScaffold: "removed",
      ringScaffoldStatus: "removed",
      controlPanelActive: "true"
    });
  }

  function installContextGuard(mount, context) {
    const normalized = normalizeContext(context);

    enforceContextIsolation(mount, normalized);

    if (!mount || mount.dataset.contextGuardInstalled === VERSION + ":" + normalized) return;

    mount.dataset.contextGuardInstalled = VERSION + ":" + normalized;

    let locked = false;

    const guard = function () {
      if (locked) return;
      locked = true;

      window.requestAnimationFrame(function () {
        enforceContextIsolation(mount, normalized);
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
        "data-showroom-globe-route",
        "data-showroom-parent-route",
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
        "data-generation-3-object-purification": "active",
        "data-generation-3-context-isolation": "active",
        "data-generation-3-control-panel": "active",
        "aria-label": "Generation 3 telemetry receipt"
      },
      [
        create("span", { text: "GEN 3" }),
        create("span", { text: "axis=23.5°" }),
        create("span", { text: "rotation=active" }),
        create("span", { text: "shadow=active" }),
        create("span", { text: "depth=active" }),
        create("span", { text: "terminator=active" }),
        create("span", { text: "atmosphere=active" }),
        create("span", { text: "ring=removed" }),
        create("span", { text: "control=active" }),
        create("span", { text: "context=" + normalized })
      ]
    );
  }

  function captionForContext(context, override) {
    if (override) return override;

    return normalizeContext(context) === CONTEXTS.standalone
      ? "GENERATION 3 · DEMO UNIVERSE EARTH · AXIS ROTATION ACTIVE"
      : "GENERATION 3 · AXIS ROTATION · SHADOW DEPTH ACTIVE";
  }

  function linkForContext(context) {
    return normalizeContext(context) === CONTEXTS.standalone
      ? { href: ASSETS.parentRoute, text: "Return to Showroom" }
      : { href: ASSETS.globeRoute, text: "Open Demo Universe Earth" };
  }

  function createControlState(context) {
    return {
      context: normalizeContext(context),
      zoom: 1,
      minZoom: 0.72,
      maxZoom: 1.42,
      manualRotation: 0,
      paused: false,
      dragging: false,
      lastX: 0
    };
  }

  function createReadoutSpan(label, value) {
    return create("span", {
      text: label + "=" + value
    });
  }

  function applyControlState(mount, shell, globe, readout, state) {
    const rotation = state.manualRotation;
    const scale = state.zoom.toFixed(2);
    const paused = state.paused ? "true" : "false";

    if (globe) {
      globe.style.setProperty("--showroom-control-scale", scale);
      globe.style.setProperty("--showroom-control-rotation", rotation + "deg");
      globe.style.transform =
        "rotate(calc(-1 * var(--showroom-axis-tilt))) rotate(" +
        rotation +
        "deg) scale(" +
        scale +
        ")";
      globe.dataset.controlDragging = state.dragging ? "true" : "false";
    }

    setDataset(mount, {
      controlPanelActive: "true",
      controlPanelAuthority: "globe-interaction-layer",
      controlZoomLevel: scale,
      controlManualRotationDegrees: String(Math.round(rotation)),
      controlAutoRotationPaused: paused,
      controlContext: state.context,
      interactionAuthority: "globe-control-panel"
    });

    setDataset(shell, {
      controlPanelActive: "true",
      controlZoomLevel: scale,
      controlManualRotationDegrees: String(Math.round(rotation)),
      controlAutoRotationPaused: paused
    });

    if (readout) {
      readout.replaceChildren(
        createReadoutSpan("zoom", scale),
        createReadoutSpan("manual", Math.round(rotation) + "°"),
        createReadoutSpan("pause", paused),
        createReadoutSpan("context", state.context)
      );
    }

    const runtime = window.DGBShowroomRuntime;
    if (runtime && typeof runtime.setRotationPhase === "function") {
      runtime.setRotationPhase(rotation);
    }
  }

  function installControlPanel(mount, shell, context) {
    ensureControlStyles();

    const state = createControlState(context);
    const globe = shell.querySelector(".showroom-generation-3-active-globe");

    const controls = create(
      "div",
      {
        className: "showroom-generation-3-control-panel",
        "data-generation-3-control-panel": "active",
        role: "group",
        "aria-label": "Globe control panel"
      },
      []
    );

    const readout = create("div", {
      className: "showroom-generation-3-control-readout",
      "data-generation-3-control-readout": "active",
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
        applyControlState(mount, shell, globe, readout, state);
      }),
      button("Zoom −", function () {
        state.zoom = Math.max(state.minZoom, Number((state.zoom - 0.08).toFixed(2)));
        applyControlState(mount, shell, globe, readout, state);
      }),
      button("Pause", function () {
        state.paused = true;
        shell.dataset.controlAutoRotationPaused = "true";
        if (globe) globe.style.animationPlayState = "paused";
        Array.from(shell.querySelectorAll(".showroom-generation-3-earth-surface,.showroom-generation-3-earth-clouds,.showroom-generation-3-atmosphere")).forEach(function (node) {
          node.style.animationPlayState = "paused";
        });
        applyControlState(mount, shell, globe, readout, state);
      }),
      button("Resume", function () {
        state.paused = false;
        shell.dataset.controlAutoRotationPaused = "false";
        if (globe) globe.style.animationPlayState = "running";
        Array.from(shell.querySelectorAll(".showroom-generation-3-earth-surface,.showroom-generation-3-earth-clouds,.showroom-generation-3-atmosphere")).forEach(function (node) {
          node.style.animationPlayState = "running";
        });
        applyControlState(mount, shell, globe, readout, state);
      }),
      button("Reset", function () {
        state.zoom = 1;
        state.manualRotation = 0;
        state.paused = false;
        state.dragging = false;
        if (globe) globe.style.animationPlayState = "running";
        Array.from(shell.querySelectorAll(".showroom-generation-3-earth-surface,.showroom-generation-3-earth-clouds,.showroom-generation-3-atmosphere")).forEach(function (node) {
          node.style.animationPlayState = "running";
        });
        applyControlState(mount, shell, globe, readout, state);
      })
    );

    if (globe) {
      globe.addEventListener("pointerdown", function (event) {
        state.dragging = true;
        state.lastX = event.clientX;
        globe.setPointerCapture(event.pointerId);
        applyControlState(mount, shell, globe, readout, state);
      });

      globe.addEventListener("pointermove", function (event) {
        if (!state.dragging) return;
        const delta = event.clientX - state.lastX;
        state.lastX = event.clientX;
        state.manualRotation = (state.manualRotation + delta * 0.45) % 360;
        applyControlState(mount, shell, globe, readout, state);
      });

      globe.addEventListener("pointerup", function (event) {
        state.dragging = false;
        try {
          globe.releasePointerCapture(event.pointerId);
        } catch (error) {
          /* no-op */
        }
        applyControlState(mount, shell, globe, readout, state);
      });

      globe.addEventListener("pointercancel", function () {
        state.dragging = false;
        applyControlState(mount, shell, globe, readout, state);
      });
    }

    shell.appendChild(controls);
    shell.appendChild(readout);
    applyControlState(mount, shell, globe, readout, state);
  }

  function createGlobeNode(options) {
    const config = options || {};
    const context = normalizeContext(config.context);
    const caption = captionForContext(context, config.caption);
    const link = linkForContext(context);

    const shell = create(
      "section",
      {
        className: "showroom-generation-3-shell",
        "data-showroom-generation-3-shell": "true",
        "data-generation-1-no-graphic-baseline": "preserved",
        "data-generation-1-ring-scaffold": "removed",
        "data-generation-2-baseline-graphics": "preserved",
        "data-generation-2-active-globe": "preserved",
        "data-generation-2-receipt-only": "true",
        "data-generation-2-visual-class-emission": "removed",
        "data-generation-3-full-expression": "axis-rotation-depth-refinement-active",
        "data-generation-3-object-purification": "active",
        "data-generation-3-context-isolation": "active",
        "data-generation-3-control-panel": "active",
        "data-generation-3-ring-scaffold": "removed",
        "data-generation-3-axis": "active",
        "data-generation-3-rotation": "active",
        "data-generation-3-runtime-motion": "active",
        "data-axis-tilt-degrees": String(MOTION.axisTiltDegrees),
        "data-render-context": context,
        "data-context-receipt-mode": context + "-isolated"
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
            className: "showroom-generation-3-active-globe",
            role: "img",
            "data-generation-3-active-globe": "true",
            "data-generation-3-object-purification": "active",
            "data-generation-3-context-isolation": "active",
            "aria-label":
              context === CONTEXTS.standalone
                ? "Demo Universe Earth Generation 3 axis rotation globe"
                : "Showroom Generation 3 axis rotation Earth globe"
          },
          [
            create("img", {
              className: "showroom-generation-3-earth-surface",
              src: ASSETS.earthSurface,
              alt: "",
              decoding: "async",
              loading: "eager",
              "data-generation-3-earth-surface": "active",
              "aria-hidden": "true"
            }),

            create("img", {
              className: "showroom-generation-3-earth-clouds",
              src: ASSETS.earthClouds,
              alt: "",
              decoding: "async",
              loading: "eager",
              "data-generation-3-earth-clouds": "active",
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
          "data-generation-3-caption": "active",
          "data-generation-3-context-isolation": "active",
          text: caption
        }),

        createTelemetryNode(context),

        create("a", {
          className: "showroom-generation-3-link",
          href: link.href,
          text: link.text
        })
      ]
    );

    setDataset(shell, getContextReceipts(context));
    purifyVisualObject(shell);

    return shell;
  }

  function notifyRuntime(status) {
    const runtime = window.DGBShowroomRuntime;

    if (runtime && typeof runtime.setGeneration3MotionStatus === "function") {
      runtime.setGeneration3MotionStatus(status || "generation-3-control-panel-active");
    }

    if (runtime && typeof runtime.setActiveGlobeStatus === "function") {
      runtime.setActiveGlobeStatus(status || "generation-3-control-panel-active");
    }
  }

  function monitorAssetLoad(mount, context) {
    if (!mount) return;

    const normalized = normalizeContext(context);
    const surface = mount.querySelector(".showroom-generation-3-earth-surface");
    const clouds = mount.querySelector(".showroom-generation-3-earth-clouds");

    function update() {
      const surfaceLoaded = Boolean(surface && surface.complete && surface.naturalWidth > 0);
      const cloudsLoaded = Boolean(clouds && clouds.complete && clouds.naturalWidth > 0);

      mount.dataset.surfaceImg = surface ? "true" : "false";
      mount.dataset.surfaceImgLoaded = surfaceLoaded ? "true" : "false";
      mount.dataset.cloudImg = clouds ? "true" : "false";
      mount.dataset.cloudImgLoaded = cloudsLoaded ? "true" : "false";

      if (surfaceLoaded) {
        setDataset(mount, getContextReceipts(normalized));
        mount.dataset.renderStatus = "generation-3-control-panel-active";
        mount.dataset.showroomGlobePlacement = "generation-3-control-panel-takeover";
        notifyRuntime("generation-3-control-panel-active");
      }

      enforceContextIsolation(mount, normalized);
    }

    if (surface) {
      surface.addEventListener("load", update, { once: true });
      surface.addEventListener("error", update, { once: true });
    }

    if (clouds) {
      clouds.addEventListener("load", update, { once: true });
      clouds.addEventListener("error", update, { once: true });
    }

    update();
    window.setTimeout(update, 300);
    window.setTimeout(update, 1200);
  }

  function renderGlobe(mount, options) {
    if (!mount) {
      throw new Error("Showroom globe instrument requires a mount node.");
    }

    const config = options || {};
    const context = normalizeContext(config.context);
    const shell = createGlobeNode(config);

    mount.replaceChildren(shell);

    setDataset(mount, getContextReceipts(context));
    mount.dataset.renderStatus = "generation-3-control-panel-mounted";
    mount.dataset.showroomGlobePlacement = "generation-3-control-panel-takeover";

    installControlPanel(mount, shell, context);
    enforceContextIsolation(mount, context);
    installContextGuard(mount, context);
    monitorAssetLoad(mount, context);
    notifyRuntime("generation-3-control-panel-mounted");

    return mount;
  }

  function writeReceipts(node, context, extra) {
    const normalized = normalizeContext(context);

    setDataset(node, Object.assign({}, getContextReceipts(normalized), extra || {}));
    enforceContextIsolation(node, normalized);
  }

  async function verifyAssets() {
    const surface = await fetch(ASSETS.earthSurface, { cache: "no-store" });
    const clouds = await fetch(ASSETS.earthClouds, { cache: "no-store" });

    return {
      surfaceOk: surface.ok,
      surfaceStatus: surface.status,
      cloudsOk: clouds.ok,
      cloudsStatus: clouds.status,
      generation1NoGraphicBaseline: "preserved",
      generation1RingScaffold: "removed",
      generation2BaselineGraphics: "preserved",
      generation2ActiveGlobe: "preserved",
      generation2ReceiptOnly: "true",
      generation2VisualClassEmission: "removed",
      generation3: GENERATIONS.generation3,
      generation3RuntimeMotion: "active",
      generation3Axis: "active",
      generation3Rotation: "active",
      generation3ObjectPurification: "active",
      generation3ContextIsolation: "active",
      generation3RingScaffold: "removed",
      generation3ControlPanel: "active",
      generation3VisualTruth: "pending-user-visual-confirmation"
    };
  }

  window.DGBShowroomGlobeInstrument = Object.freeze({
    version: VERSION,
    assets: ASSETS,
    generations: GENERATIONS,
    contexts: CONTEXTS,
    motion: MOTION,
    create: create,
    setDataset: setDataset,
    purifyVisualObject: purifyVisualObject,
    stripForbiddenVisualClasses: stripForbiddenVisualClasses,
    removeForbiddenScaffoldNodes: removeForbiddenScaffoldNodes,
    getContextReceipts: getContextReceipts,
    enforceContextIsolation: enforceContextIsolation,
    createGlobeNode: createGlobeNode,
    renderGlobe: renderGlobe,
    writeReceipts: writeReceipts,
    verifyAssets: verifyAssets
  });
})();
