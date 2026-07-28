/* /products/index.planet.js
   PRODUCTS_ARENA_CLUSTER_CENTER_WORLD_ARCHCOIN_DONOR_v1
   Products-adapted standalone center-world host modeled on the accepted
   ARCHCOIN center-world implementation. It consumes the canonical Audralia
   geometry authority through the separately governed Laws planet participant.

   Visual only:
   - no navigation authority;
   - no product registry authority;
   - no label authority;
   - no settlement authority;
   - no product gesture authority;
   - no simulated Earth-like fallback.
*/
(() => {
  "use strict";

  const BUILD = "PRODUCTS_ARENA_CLUSTER_CENTER_WORLD_ARCHCOIN_DONOR_v1";
  const MODULE = "DGB_PRODUCTS_CENTER_PLANET";
  const RECEIPT_KEY = "DGB_PRODUCTS_CENTER_PLANET_RECEIPT";
  const READY_EVENT = "PRODUCTS_CENTER_PLANET_READY";
  const FAILURE_EVENT = "PRODUCTS_CENTER_PLANET_FAILURE";

  const ROOT_SELECTOR = '[data-page-id="products"]';
  const MOUNT_SELECTOR = "[data-products-planet-mount]";
  const OUTPUT_SELECTOR = "[data-products-planet-receipt]";
  const CANVAS_ATTRIBUTE = "data-products-planet-canvas";

  const GEOMETRY_GLOBAL = "DGBAudraliaPlanetGeometry";
  const GEOMETRY_CONTRACT =
    "AUDRALIA_G1_DETERMINISTIC_PLANET_GEOMETRY_AUTHORITY_TNT_v1";
  const PARTICIPANT_GLOBAL = "DGB_LAWS_PLANET_WORLD_PARTICIPANT";

  const GEOMETRY_URL =
    `/assets/audralia/audralia.planet.js?build=${encodeURIComponent(BUILD)}`;
  const PARTICIPANT_URL =
    `/laws/index.planet.js?build=${encodeURIComponent(BUILD)}`;

  if (globalThis[MODULE]?.initialized) return;

  const state = {
    initialized: false,
    mounted: false,
    ready: false,
    failed: false,
    disposed: false,
    reducedMotion: false,
    root: null,
    mount: null,
    output: null,
    canvas: null,
    gl: null,
    renderer: null,
    participant: null,
    resizeObserver: null,
    intersectionObserver: null,
    removalObserver: null,
    motionQuery: null,
    motionListener: null,
    raf: 0,
    frameTimer: 0,
    running: false,
    documentVisible: !document.hidden,
    mountVisible: true,
    staticFrameRendered: false,
    previous: performance.now(),
    lastRendered: 0,
    width: 0,
    height: 0,
    dpr: 1,
    renderFrames: 0,
    nodeWaitFrames: 0,
    lastError: ""
  };

  function normalize3(vector) {
    const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
    return [vector[0] / length, vector[1] / length, vector[2] / length];
  }

  function cross3(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function dot3(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function lookAt(eye, target, up = [0, 1, 0]) {
    const z = normalize3([
      eye[0] - target[0],
      eye[1] - target[1],
      eye[2] - target[2]
    ]);
    const x = normalize3(cross3(up, z));
    const y = cross3(z, x);
    return [
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot3(x, eye), -dot3(y, eye), -dot3(z, eye), 1
    ];
  }

  function perspective(fieldOfView, aspect, near, far) {
    const f = 1 / Math.tan(fieldOfView / 2);
    const nf = 1 / (near - far);
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0
    ];
  }

  function geometryReceipt() {
    const authority = globalThis[GEOMETRY_GLOBAL];
    try {
      return authority?.getReceiptLight?.() ||
        globalThis.AUDRALIA_PLANET_GEOMETRY_RECEIPT ||
        null;
    } catch {
      return globalThis.AUDRALIA_PLANET_GEOMETRY_RECEIPT || null;
    }
  }

  function buildReceipt(extra = {}) {
    const geometry = geometryReceipt();
    return {
      contract: BUILD,
      module: MODULE,
      donor: "/products/archcoin/index.planet.source.js",
      sourceParticipant: "/laws/index.planet.js",
      sourceGeometry: "/assets/audralia/audralia.planet.js",
      sourceGeometryContract: GEOMETRY_CONTRACT,
      sourceGeometryReady: Boolean(
        globalThis[GEOMETRY_GLOBAL] &&
        globalThis[GEOMETRY_GLOBAL].contract === GEOMETRY_CONTRACT
      ),
      sourceGeometryHash: geometry?.geometryHash || "",
      initialized: state.initialized,
      mounted: state.mounted,
      ready: state.ready,
      failed: state.failed,
      disposed: state.disposed,
      fallback: false,
      reducedMotion: state.reducedMotion,
      worldPosition: Object.freeze([0, 0, 0]),
      orbit: "NONE",
      internalRotation: true,
      route: "/",
      role: "MAIN_COMPASS_RETURN",
      productMember: false,
      registryMember: false,
      labelResolverMember: false,
      settlementMember: false,
      ownsNavigation: false,
      ownsControllerState: false,
      ownsProductGeometry: false,
      independentNavigationAuthority: false,
      visualIdentity: "mini-audralia",
      rendererMode: state.gl ? "webgl-3d" : "unavailable",
      boundedFrameRate: 30,
      environmentalSuspension: true,
      width: state.width,
      height: state.height,
      devicePixelRatio: state.dpr,
      renderFrames: state.renderFrames,
      lastError: state.lastError,
      visualPassClaimed: false,
      ...extra
    };
  }

  function publish(extra = {}) {
    const receipt = Object.freeze(buildReceipt(extra));
    globalThis[RECEIPT_KEY] = receipt;

    if (state.root) {
      state.root.dataset.productsPlanetStatus =
        state.failed ? "held" : state.ready ? "available" : "pending";
      state.root.dataset.productsCenterPlanetCount = state.ready ? "1" : "0";
      state.root.dataset.productsPlanetReceipt = JSON.stringify(receipt);
    }

    if (state.output) {
      const serialized = JSON.stringify(receipt);
      state.output.value = serialized;
      state.output.textContent = serialized;
    }

    return receipt;
  }

  function dispatch(name, detail) {
    globalThis.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function loadScript(url, marker, readyCheck) {
    if (readyCheck()) return Promise.resolve(null);

    return new Promise((resolve, reject) => {
      const selector = `script[data-${marker}]`;
      const existing = document.querySelector(selector);
      if (existing) {
        if (existing.dataset.ready === "true" || readyCheck()) {
          resolve(existing);
        } else {
          existing.addEventListener("load", () => resolve(existing), { once: true });
          existing.addEventListener("error", () => reject(
            new Error(`PRODUCTS_CENTER_WORLD_SCRIPT_LOAD_FAILED:${url}`)
          ), { once: true });
        }
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = false;
      script.fetchPriority = "low";
      script.dataset[marker] = "true";
      script.addEventListener("load", () => {
        script.dataset.ready = "true";
        resolve(script);
      }, { once: true });
      script.addEventListener("error", () => reject(
        new Error(`PRODUCTS_CENTER_WORLD_SCRIPT_LOAD_FAILED:${url}`)
      ), { once: true });
      document.head.append(script);
    });
  }

  function resize() {
    if (!state.canvas || !state.gl || !state.mount) {
      return { aspect: 1 };
    }

    const rect = state.mount.getBoundingClientRect();
    const hardwareConcurrency = Number(navigator.hardwareConcurrency || 0);
    const deviceMemory = Number(navigator.deviceMemory || 0);
    const lowPower =
      rect.width <= 420 ||
      (hardwareConcurrency > 0 && hardwareConcurrency <= 4) ||
      (deviceMemory > 0 && deviceMemory <= 4);
    const ratioCap = lowPower ? 1 : 1.5;
    const ratio = Math.min(
      ratioCap,
      Math.max(1, globalThis.devicePixelRatio || 1)
    );
    const width = Math.max(2, Math.round(rect.width * ratio));
    const height = Math.max(2, Math.round(rect.height * ratio));

    state.width = Math.max(1, Math.round(rect.width));
    state.height = Math.max(1, Math.round(rect.height));
    state.dpr = ratio;

    if (state.canvas.width !== width || state.canvas.height !== height) {
      state.canvas.width = width;
      state.canvas.height = height;
    }

    state.gl.viewport(0, 0, width, height);
    return { aspect: width / Math.max(1, height) };
  }

  function requestFrame() {
    state.frameTimer = 0;
    if (!state.raf) state.raf = requestAnimationFrame(frame);
  }

  function scheduleFrame() {
    if (
      !state.running ||
      !state.mount?.isConnected ||
      state.raf ||
      state.frameTimer ||
      !state.documentVisible ||
      !state.mountVisible ||
      (state.reducedMotion && state.staticFrameRendered)
    ) return;

    const targetFrameInterval = 1000 / 30;
    const elapsed = performance.now() - state.lastRendered;
    const wait = Math.max(0, targetFrameInterval - elapsed);
    if (wait > 4) state.frameTimer = setTimeout(requestFrame, wait);
    else requestFrame();
  }

  function markReady() {
    if (state.ready) return;
    state.ready = true;
    state.failed = false;
    state.lastError = "";
    const receipt = publish({ lastAction: "planet-ready-first-frame" });
    dispatch(READY_EVENT, receipt);
  }

  function frame(now) {
    state.raf = 0;
    if (
      !state.running ||
      !state.mount?.isConnected ||
      !state.documentVisible ||
      !state.mountVisible
    ) return;

    try {
      const dimensions = resize();
      const deltaSeconds = Math.min(
        0.05,
        Math.max(0, (now - state.previous) / 1000)
      );
      state.previous = now;
      state.lastRendered = now;

      state.participant.update({
        time: now / 1000,
        deltaSeconds,
        reducedMotion: state.reducedMotion
      });

      const node = state.participant.getNode({
        time: now / 1000,
        deltaSeconds
      });

      const gl = state.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      if (node) {
        const viewMatrix = lookAt([0, 0.20, 1.88], [0, 0.01, 0.02]);
        const projectionMatrix = perspective(
          Math.PI / 4.45,
          dimensions.aspect,
          0.1,
          60
        );
        state.participant.draw({
          renderer: state.renderer,
          node,
          viewMatrix,
          projectionMatrix,
          haloPass: true
        });
        state.participant.draw({
          renderer: state.renderer,
          node,
          viewMatrix,
          projectionMatrix,
          haloPass: false
        });
        state.renderFrames += 1;
        state.nodeWaitFrames = 0;
        state.staticFrameRendered = state.reducedMotion;
        markReady();
      } else {
        state.nodeWaitFrames += 1;
        state.staticFrameRendered = false;
        if (state.nodeWaitFrames > 240) {
          throw new Error("PRODUCTS_CENTER_WORLD_PARTICIPANT_NODE_UNAVAILABLE");
        }
      }

      if (state.renderFrames > 0 && state.renderFrames % 120 === 0) {
        publish({ lastAction: "planet-rendering" });
      }

      scheduleFrame();
    } catch (error) {
      fail(error);
    }
  }

  function stop() {
    if (!state.running) return true;
    state.running = false;
    if (state.raf) cancelAnimationFrame(state.raf);
    if (state.frameTimer) clearTimeout(state.frameTimer);
    state.raf = 0;
    state.frameTimer = 0;
    state.resizeObserver?.disconnect();
    state.intersectionObserver?.disconnect();
    state.removalObserver?.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (state.motionQuery && state.motionListener) {
      if (typeof state.motionQuery.removeEventListener === "function") {
        state.motionQuery.removeEventListener("change", state.motionListener);
      } else if (typeof state.motionQuery.removeListener === "function") {
        state.motionQuery.removeListener(state.motionListener);
      }
    }
    return true;
  }

  function dispose(reason = "api") {
    stop();
    state.disposed = true;
    state.ready = false;
    state.mounted = false;
    state.canvas?.remove();
    state.canvas = null;
    state.gl = null;
    state.renderer = null;
    state.participant = null;
    publish({ lastAction: "planet-disposed", reason });
    return true;
  }

  function fail(error) {
    const message = error instanceof Error ? error.message : String(error);
    state.lastError = message;
    state.failed = true;
    state.ready = false;
    stop();
    if (state.mount) state.mount.replaceChildren();
    const receipt = publish({
      lastAction: "planet-failure-no-simulated-fallback",
      lastFailure: message,
      fallbackReason: null
    });
    dispatch(FAILURE_EVENT, Object.freeze({ message, receipt }));
  }

  function onVisibilityChange() {
    state.documentVisible = !document.hidden;
    if (state.documentVisible) {
      state.previous = performance.now();
      state.staticFrameRendered = false;
      scheduleFrame();
    }
  }

  async function initialize() {
    try {
      state.root = document.querySelector(ROOT_SELECTOR);
      state.mount = document.querySelector(MOUNT_SELECTOR);
      state.output = document.querySelector(OUTPUT_SELECTOR);
      if (!state.root || !state.mount) {
        throw new Error("PRODUCTS_PLANET_MOUNT_NOT_FOUND");
      }

      state.initialized = true;
      publish({ lastAction: "planet-initializing" });

      await loadScript(
        GEOMETRY_URL,
        "productsCenterWorldAudraliaGeometry",
        () => Boolean(
          globalThis[GEOMETRY_GLOBAL] &&
          globalThis[GEOMETRY_GLOBAL].contract === GEOMETRY_CONTRACT
        )
      );

      await loadScript(
        PARTICIPANT_URL,
        "productsCenterWorldPlanetParticipant",
        () => Boolean(
          globalThis[PARTICIPANT_GLOBAL] &&
          typeof globalThis[PARTICIPANT_GLOBAL].draw === "function"
        )
      );

      state.participant = globalThis[PARTICIPANT_GLOBAL];
      if (
        !state.participant ||
        typeof state.participant.update !== "function" ||
        typeof state.participant.getNode !== "function" ||
        typeof state.participant.draw !== "function"
      ) {
        throw new Error("PRODUCTS_CENTER_WORLD_PARTICIPANT_UNAVAILABLE");
      }

      state.canvas = document.createElement("canvas");
      state.canvas.setAttribute(CANVAS_ATTRIBUTE, "true");
      state.canvas.setAttribute("aria-hidden", "true");
      state.canvas.style.pointerEvents = "none";
      state.mount.replaceChildren(state.canvas);

      state.gl = state.canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      });
      if (!state.gl) {
        throw new Error("PRODUCTS_CENTER_WORLD_WEBGL_UNAVAILABLE");
      }

      state.renderer = Object.freeze({
        id: "PRODUCTS_ACCEPTED_CENTER_WORLD_HOST",
        gl: state.gl
      });

      state.motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
      state.reducedMotion = state.motionQuery.matches;
      state.motionListener = event => {
        state.reducedMotion = event.matches;
        state.previous = performance.now();
        state.staticFrameRendered = false;
        publish({ lastAction: "reduced-motion-changed" });
        scheduleFrame();
      };
      if (typeof state.motionQuery.addEventListener === "function") {
        state.motionQuery.addEventListener("change", state.motionListener);
      } else if (typeof state.motionQuery.addListener === "function") {
        state.motionQuery.addListener(state.motionListener);
      }

      state.resizeObserver = new ResizeObserver(() => {
        state.staticFrameRendered = false;
        scheduleFrame();
      });
      state.resizeObserver.observe(state.mount);

      state.intersectionObserver = typeof IntersectionObserver === "function"
        ? new IntersectionObserver(entries => {
            state.mountVisible = entries.some(entry => entry.isIntersecting);
            if (state.mountVisible) {
              state.previous = performance.now();
              state.staticFrameRendered = false;
              scheduleFrame();
            }
          }, { rootMargin: "120px 0px", threshold: 0 })
        : null;
      state.intersectionObserver?.observe(state.mount);

      state.removalObserver = typeof MutationObserver === "function"
        ? new MutationObserver(() => {
            if (!state.mount?.isConnected) stop();
          })
        : null;
      state.removalObserver?.observe(document.documentElement, {
        childList: true,
        subtree: true
      });

      document.addEventListener("visibilitychange", onVisibilityChange);
      globalThis.addEventListener("pagehide", () => stop(), { once: true });

      state.mounted = true;
      state.running = true;
      state.previous = performance.now();
      publish({
        lastAction: "planet-mounted-awaiting-first-frame",
        canvasCreated: true,
        independentNavigationAuthority: false
      });
      scheduleFrame();
    } catch (error) {
      fail(error);
    }
  }

  globalThis[MODULE] = Object.freeze({
    initialized: true,
    contract: BUILD,
    receipt: () => Object.freeze(buildReceipt()),
    resize,
    dispose
  });

  globalThis[RECEIPT_KEY] = Object.freeze(buildReceipt());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
