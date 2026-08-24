/* /products/archcoin/index.crystals.js
   ARCHCOIN accepted centered crystal renderer.
   Performance round 2: viewport-gated source realization and environmental suspension.
*/
(() => {
  "use strict";

  const SOURCE_URL = "./index.crystals.source.js";
  const SCRIPT_ATTRIBUTE = "data-archcoin-accepted-crystals-source";
  const ACTIVATION_ROOT_MARGIN = "240px 0px";
  const runtime = globalThis.DGB_ARCHCOIN_RUNTIME ||
    (globalThis.DGB_ARCHCOIN_RUNTIME = {});

  function replaceRequired(source, before, after, identity) {
    if (!source.includes(before)) {
      throw new Error(`ARCHCOIN_REQUIRED_SOURCE_PATTERN_MISSING:${identity}`);
    }
    return source.replace(before, after);
  }

  function runIdle(task, timeout = 900) {
    return new Promise((resolve, reject) => {
      const run = () => Promise.resolve().then(task).then(resolve, reject);
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(run, { timeout });
      } else {
        setTimeout(run, 0);
      }
    });
  }

  function waitForActivation() {
    if (runtime.sceneActivationReady) return runtime.sceneActivationReady;

    runtime.sceneActivationReady = new Promise(resolve => {
      const root = document.querySelector("[data-archcoin-root]");
      const scene = document.querySelector("[data-archcoin-scene]");
      let settled = false;
      let observer = null;

      const activate = reason => {
        if (settled) return;
        settled = true;
        observer?.disconnect();
        scene?.removeEventListener("pointerdown", onPointerDown);
        scene?.removeEventListener("focusin", onFocusIn);
        if (root) {
          root.dataset.archcoinDeferredRuntime = "active";
          root.dataset.archcoinRuntimeActivationReason = reason;
        }
        runtime.sceneActivationReason = reason;
        resolve(reason);
      };

      const onPointerDown = () => activate("pointer");
      const onFocusIn = () => activate("focus");

      if (root) root.dataset.archcoinDeferredRuntime = "pending";

      if (!scene || typeof IntersectionObserver !== "function") {
        activate("immediate-fallback");
        return;
      }

      scene.addEventListener("pointerdown", onPointerDown, { once: true, passive: true });
      scene.addEventListener("focusin", onFocusIn, { once: true });

      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          activate("near-viewport");
        }
      }, {
        rootMargin: ACTIVATION_ROOT_MARGIN,
        threshold: 0
      });
      observer.observe(scene);

      const rect = scene.getBoundingClientRect();
      const viewportHeight = Math.max(
        document.documentElement.clientHeight || 0,
        globalThis.innerHeight || 0
      );
      if (rect.top <= viewportHeight + 240 && rect.bottom >= -240) {
        activate("initial-near-viewport");
      }
    });

    return runtime.sceneActivationReady;
  }

  async function fetchSource(url) {
    const response = await fetch(url, {
      credentials: "same-origin",
      cache: "force-cache",
      priority: "low"
    });
    if (!response.ok) {
      throw new Error(`ARCHCOIN_CRYSTAL_SOURCE_LOAD_FAILED:${response.status}`);
    }
    return response.text();
  }

  function executeSource(source) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[${SCRIPT_ATTRIBUTE}]`);
      if (existing) {
        if (existing.dataset.ready === "true") resolve(existing);
        else {
          existing.addEventListener("load", () => resolve(existing), { once: true });
          existing.addEventListener("error", reject, { once: true });
        }
        return;
      }

      const blob = new Blob([
        source,
        "\n//# sourceURL=/products/archcoin/index.crystals.accepted.js"
      ], { type: "text/javascript" });
      const blobUrl = URL.createObjectURL(blob);
      const script = document.createElement("script");
      script.src = blobUrl;
      script.async = false;
      script.setAttribute(SCRIPT_ATTRIBUTE, "true");
      script.addEventListener("load", () => {
        script.dataset.ready = "true";
        URL.revokeObjectURL(blobUrl);
        resolve(script);
      }, { once: true });
      script.addEventListener("error", event => {
        URL.revokeObjectURL(blobUrl);
        reject(event);
      }, { once: true });
      document.head.append(script);
    });
  }

  function installLifecycle(api) {
    if (!api || typeof api.start !== "function" || typeof api.stop !== "function") {
      throw new Error("ARCHCOIN_CRYSTAL_LIFECYCLE_API_UNAVAILABLE");
    }

    const root = document.querySelector("[data-archcoin-root]");
    const scene = document.querySelector("[data-archcoin-scene]") || root;
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    let sceneVisible = true;
    let disposed = false;
    let staticFrameHandle = 0;

    const apply = () => {
      if (disposed) return;
      const environmentVisible = !document.hidden && sceneVisible;
      const shouldAnimate = environmentVisible && !motionQuery.matches;

      if (root) {
        root.dataset.archcoinCrystalsDocumentVisible = document.hidden ? "false" : "true";
        root.dataset.archcoinCrystalsSceneVisible = sceneVisible ? "true" : "false";
        root.dataset.archcoinCrystalsReducedMotion = motionQuery.matches ? "true" : "false";
        root.dataset.archcoinCrystalsEnvironmentRunning = shouldAnimate ? "true" : "false";
        root.dataset.archcoinCrystalsPresentationMode = shouldAnimate
          ? "animated"
          : environmentVisible ? "static" : "suspended";
      }

      if (staticFrameHandle) {
        cancelAnimationFrame(staticFrameHandle);
        staticFrameHandle = 0;
      }

      if (shouldAnimate) {
        api.start();
      } else if (environmentVisible) {
        api.start();
        staticFrameHandle = requestAnimationFrame(() => {
          staticFrameHandle = 0;
          api.stop();
        });
      } else {
        api.stop();
      }
    };

    const onPageHide = () => {
      disposed = true;
      if (staticFrameHandle) cancelAnimationFrame(staticFrameHandle);
      staticFrameHandle = 0;
      api.stop();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", apply);
      if (typeof motionQuery.removeEventListener === "function") {
        motionQuery.removeEventListener("change", apply);
      } else {
        motionQuery.removeListener?.(apply);
      }
    };

    const observer = scene && typeof IntersectionObserver === "function"
      ? new IntersectionObserver(entries => {
          sceneVisible = entries.some(entry => entry.isIntersecting);
          apply();
        }, { rootMargin: "120px 0px", threshold: 0 })
      : null;

    observer?.observe(scene);
    document.addEventListener("visibilitychange", apply);
    globalThis.addEventListener("pagehide", onPageHide, { once: true });
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", apply);
    } else {
      motionQuery.addListener?.(apply);
    }
    apply();

    return Object.freeze({ apply, stop: onPageHide });
  }

  async function install() {
    await waitForActivation();
    let source = await runIdle(() => fetchSource(SOURCE_URL), 700);

    source = replaceRequired(
      source,
      `        horizontalRadius:\n          1.04,\n\n        verticalRadius:\n          0.90,\n\n        depthRadius:\n          0.84,\n\n        centerRadius:\n          0.26,`,
      `        horizontalRadius:\n          1.36,\n\n        verticalRadius:\n          1.18,\n\n        depthRadius:\n          1.04,\n\n        centerRadius:\n          0,`,
      "CENTERED_CLUSTER_RADII"
    );
    source = replaceRequired(
      source,
      `    roomScale:\n      0.68,\n\n    primaryRoomScale:\n      0.84,\n\n    selectedRoomScale:\n      0.91,`,
      `    roomScale:\n      0.88,\n\n    primaryRoomScale:\n      1.12,\n\n    selectedRoomScale:\n      1.18,`,
      "ROOM_SCALE_METRICS"
    );
    source = replaceRequired(
      source,
      `    maximumYaw:\n      0.20,\n\n    maximumPitch:\n      0.13,`,
      `    maximumYaw:\n      0.22,\n\n    maximumPitch:\n      0.14,`,
      "ROOM_FACET_MOTION_LIMITS"
    );
    source = replaceRequired(
      source,
      `    ROOM_IDLE:\n      Object.freeze({\n        specular:\n          1.02,\n\n        rim:\n          0.88,\n\n        emissive:\n          0.12,\n\n        alpha:\n          0.88,\n\n        sparkle:\n          0.14,\n\n        halo:\n          0.44,\n\n        contrast:\n          1.08\n      }),`,
      `    ROOM_IDLE:\n      Object.freeze({\n        specular:\n          1.04,\n\n        rim:\n          0.90,\n\n        emissive:\n          0.15,\n\n        alpha:\n          0.88,\n\n        sparkle:\n          0.22,\n\n        halo:\n          0.64,\n\n        contrast:\n          1.10\n      }),`,
      "ROOM_IDLE_MATERIAL"
    );
    source = replaceRequired(
      source,
      `    ROOM_PRIMARY:\n      Object.freeze({\n        specular:\n          1.18,\n\n        rim:\n          1.02,\n\n        emissive:\n          0.16,\n\n        alpha:\n          0.92,\n\n        sparkle:\n          0.18,\n\n        halo:\n          0.62,\n\n        contrast:\n          1.14\n      }),`,
      `    ROOM_PRIMARY:\n      Object.freeze({\n        specular:\n          1.24,\n\n        rim:\n          1.08,\n\n        emissive:\n          0.21,\n\n        alpha:\n          0.94,\n\n        sparkle:\n          0.30,\n\n        halo:\n          0.86,\n\n        contrast:\n          1.17\n      }),`,
      "ROOM_PRIMARY_MATERIAL"
    );
    source = replaceRequired(
      source,
      `    ROOM_SELECTED:\n      Object.freeze({\n        specular:\n          1.26,\n\n        rim:\n          1.08,\n\n        emissive:\n          0.18,\n\n        alpha:\n          0.94,\n\n        sparkle:\n          0.22,\n\n        halo:\n          0.72,\n\n        contrast:\n          1.18\n      })`,
      `    ROOM_SELECTED:\n      Object.freeze({\n        specular:\n          1.34,\n\n        rim:\n          1.14,\n\n        emissive:\n          0.24,\n\n        alpha:\n          0.95,\n\n        sparkle:\n          0.34,\n\n        halo:\n          0.96,\n\n        contrast:\n          1.20\n      })`,
      "ROOM_SELECTED_MATERIAL"
    );

    await runIdle(() => executeSource(source), 700);
    const api = globalThis.DGB_ARCHCOIN_CRYSTALS;
    const lifecycle = installLifecycle(api);

    globalThis.DGB_ARCHCOIN_ACCEPTED_CRYSTALS = Object.freeze({
      source: SOURCE_URL,
      loadingMode: "viewport-gated-idle-realization",
      executionMode: "blob-script-no-eval",
      activationReason: runtime.sceneActivationReason || "unknown",
      environmentalSuspension: true,
      clusterCenterRadius: 0,
      clusterHorizontalRadius: 1.36,
      clusterVerticalRadius: 1.18,
      clusterDepthRadius: 1.04,
      acceptedRoomMetrics: true,
      lifecycle
    });
    return api;
  }

  if (!runtime.crystalsReady) {
    runtime.crystalsReady = install().catch(error => {
      globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_CRYSTALS_WRAPPER_FAILURE", {
        detail: Object.freeze({
          message: error instanceof Error ? error.message : String(error)
        })
      }));
      throw error;
    });
  }
})();