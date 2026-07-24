/* /products/archcoin/index.planet.js
   ARCHCOIN accepted Audralia center-world host.
   Performance baseline: asynchronous source realization and bounded animation.
*/
(() => {
  "use strict";

  const SOURCE_URL = "./index.planet.source.js";
  const SCRIPT_ATTRIBUTE = "data-archcoin-accepted-planet-source";
  const runtime = globalThis.DGB_ARCHCOIN_RUNTIME ||
    (globalThis.DGB_ARCHCOIN_RUNTIME = {});

  function replaceRequired(source, before, after, identity) {
    if (!source.includes(before)) {
      throw new Error(`ARCHCOIN_REQUIRED_SOURCE_PATTERN_MISSING:${identity}`);
    }
    return source.replace(before, after);
  }

  function afterFirstPaint(task) {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const run = () => Promise.resolve()
            .then(task)
            .then(resolve, reject);

          if (typeof requestIdleCallback === "function") {
            requestIdleCallback(run, { timeout: 1800 });
          } else {
            setTimeout(run, 0);
          }
        });
      });
    });
  }

  async function fetchSource(url) {
    const response = await fetch(url, {
      credentials: "same-origin",
      cache: "force-cache"
    });

    if (!response.ok) {
      throw new Error(`ARCHCOIN_PLANET_SOURCE_LOAD_FAILED:${response.status}`);
    }

    return response.text();
  }

  function executeSource(source) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[${SCRIPT_ATTRIBUTE}]`);
      if (existing) {
        if (existing.dataset.ready === "true") {
          resolve(existing);
        } else {
          existing.addEventListener("load", () => resolve(existing), { once: true });
          existing.addEventListener("error", reject, { once: true });
        }
        return;
      }

      const blob = new Blob([
        source,
        "\n//# sourceURL=/products/archcoin/index.planet.accepted.js"
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

  async function install() {
    let source = await fetchSource(SOURCE_URL);

    source = source
      .replaceAll("/* /prototypes/universal-compass/archcoin.globe.laws.round4.js", "/* /products/archcoin/index.planet.source.js")
      .replaceAll("ARCHCOIN calibration lab · Round 4.", "ARCHCOIN accepted production center world.")
      .replaceAll("ARCHCOIN_CALIBRATION_ROUND4_LAWS_GLOBE_v1", "ARCHCOIN_PRODUCTION_CENTER_WORLD_v1")
      .replaceAll("DGB_ARCHCOIN_ROUND4_LAWS_GLOBE_RECEIPT", "DGB_ARCHCOIN_CENTER_WORLD_RECEIPT")
      .replaceAll("DGB_ARCHCOIN_ROUND4_LAWS_GLOBE_READY", "DGB_ARCHCOIN_CENTER_WORLD_READY")
      .replaceAll("DGB_ARCHCOIN_ROUND4_LAWS_GLOBE", "DGB_ARCHCOIN_CENTER_WORLD")
      .replaceAll("archcoinRound4", "archcoinCenterWorld")
      .replaceAll("ROUND4_", "ARCHCOIN_");

    source = replaceRequired(
      source,
      `    let running = true;\n    let previous = performance.now();\n    let raf = 0;\n\n    function resize() {\n      const rect = mount.getBoundingClientRect();\n      const ratio = Math.min(2, Math.max(1, globalThis.devicePixelRatio || 1));\n      const width = Math.max(2, Math.round(rect.width * ratio));\n      const height = Math.max(2, Math.round(rect.height * ratio));\n      if (canvas.width !== width || canvas.height !== height) {\n        canvas.width = width;\n        canvas.height = height;\n      }\n      gl.viewport(0, 0, width, height);\n      return { aspect: width / Math.max(1, height) };\n    }\n\n    function frame(now) {\n      if (!running || !mount.isConnected) return;\n      const dimensions = resize();\n      const deltaSeconds = Math.min(0.05, Math.max(0, (now - previous) / 1000));\n      previous = now;\n\n      participant.update({\n        time: now / 1000,\n        deltaSeconds,\n        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches\n      });\n      const node = participant.getNode({ time: now / 1000, deltaSeconds });\n\n      gl.clearColor(0, 0, 0, 0);\n      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);\n\n      if (node) {\n        const viewMatrix = lookAt([0, 0.20, 1.88], [0, 0.01, 0.02]);\n        const projectionMatrix = perspective(Math.PI / 4.45, dimensions.aspect, 0.1, 60);\n        participant.draw({ renderer, node, viewMatrix, projectionMatrix, haloPass: true });\n        participant.draw({ renderer, node, viewMatrix, projectionMatrix, haloPass: false });\n      }\n\n      raf = requestAnimationFrame(frame);\n    }\n\n    const observer = new ResizeObserver(resize);\n    observer.observe(mount);\n    raf = requestAnimationFrame(frame);\n\n    mount.addEventListener("DOMNodeRemoved", () => {\n      running = false;\n      cancelAnimationFrame(raf);\n      observer.disconnect();\n    }, { once: true });`,
      `    let running = true;\n    let previous = performance.now();\n    let raf = 0;\n    let documentVisible = !document.hidden;\n    let mountVisible = true;\n    let staticFrameRendered = false;\n    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");\n    let reducedMotion = motionQuery.matches;\n\n    function resize() {\n      const rect = mount.getBoundingClientRect();\n      const ratioCap = rect.width <= 420 ? 1.25 : 1.5;\n      const ratio = Math.min(ratioCap, Math.max(1, globalThis.devicePixelRatio || 1));\n      const width = Math.max(2, Math.round(rect.width * ratio));\n      const height = Math.max(2, Math.round(rect.height * ratio));\n      if (canvas.width !== width || canvas.height !== height) {\n        canvas.width = width;\n        canvas.height = height;\n      }\n      gl.viewport(0, 0, width, height);\n      return { aspect: width / Math.max(1, height) };\n    }\n\n    function scheduleFrame() {\n      if (\n        !running ||\n        !mount.isConnected ||\n        raf ||\n        !documentVisible ||\n        !mountVisible ||\n        (reducedMotion && staticFrameRendered)\n      ) {\n        return;\n      }\n\n      raf = requestAnimationFrame(frame);\n    }\n\n    function frame(now) {\n      raf = 0;\n      if (!running || !mount.isConnected || !documentVisible || !mountVisible) return;\n\n      const dimensions = resize();\n      const deltaSeconds = Math.min(0.05, Math.max(0, (now - previous) / 1000));\n      previous = now;\n\n      participant.update({\n        time: now / 1000,\n        deltaSeconds,\n        reducedMotion\n      });\n      const node = participant.getNode({ time: now / 1000, deltaSeconds });\n\n      gl.clearColor(0, 0, 0, 0);\n      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);\n\n      if (node) {\n        const viewMatrix = lookAt([0, 0.20, 1.88], [0, 0.01, 0.02]);\n        const projectionMatrix = perspective(Math.PI / 4.45, dimensions.aspect, 0.1, 60);\n        participant.draw({ renderer, node, viewMatrix, projectionMatrix, haloPass: true });\n        participant.draw({ renderer, node, viewMatrix, projectionMatrix, haloPass: false });\n      }\n\n      staticFrameRendered = reducedMotion;\n      scheduleFrame();\n    }\n\n    const resizeObserver = new ResizeObserver(() => {\n      staticFrameRendered = false;\n      resize();\n      scheduleFrame();\n    });\n    resizeObserver.observe(mount);\n\n    const intersectionObserver = typeof IntersectionObserver === "function"\n      ? new IntersectionObserver(entries => {\n          mountVisible = entries.some(entry => entry.isIntersecting);\n          if (mountVisible) {\n            previous = performance.now();\n            staticFrameRendered = false;\n            scheduleFrame();\n          }\n        }, { threshold: 0.01 })\n      : null;\n    intersectionObserver?.observe(mount);\n\n    const onVisibilityChange = () => {\n      documentVisible = !document.hidden;\n      if (documentVisible) {\n        previous = performance.now();\n        staticFrameRendered = false;\n        scheduleFrame();\n      }\n    };\n\n    const onMotionChange = event => {\n      reducedMotion = event.matches;\n      previous = performance.now();\n      staticFrameRendered = false;\n      scheduleFrame();\n    };\n\n    const stop = () => {\n      if (!running) return;\n      running = false;\n      if (raf) cancelAnimationFrame(raf);\n      raf = 0;\n      resizeObserver.disconnect();\n      intersectionObserver?.disconnect();\n      document.removeEventListener("visibilitychange", onVisibilityChange);\n      if (typeof motionQuery.removeEventListener === "function") {\n        motionQuery.removeEventListener("change", onMotionChange);\n      } else if (typeof motionQuery.removeListener === "function") {\n        motionQuery.removeListener(onMotionChange);\n      }\n    };\n\n    document.addEventListener("visibilitychange", onVisibilityChange);\n    if (typeof motionQuery.addEventListener === "function") {\n      motionQuery.addEventListener("change", onMotionChange);\n    } else if (typeof motionQuery.addListener === "function") {\n      motionQuery.addListener(onMotionChange);\n    }\n    globalThis.addEventListener("pagehide", stop, { once: true });\n    mount.addEventListener("DOMNodeRemoved", stop, { once: true });\n    scheduleFrame();`,
      "CENTER_WORLD_ENVIRONMENTAL_SUSPENSION"
    );

    await executeSource(source);

    const host = globalThis.DGB_ARCHCOIN_CENTER_WORLD;
    if (!host || typeof host.mount !== "function") {
      throw new Error("ARCHCOIN_CENTER_WORLD_HOST_UNAVAILABLE");
    }

    return host;
  }

  if (!runtime.planetReady) {
    runtime.planetReady = afterFirstPaint(install).catch(error => {
      globalThis.dispatchEvent(new CustomEvent("ARCHCOIN_PLANET_WRAPPER_FAILURE", {
        detail: Object.freeze({
          message: error instanceof Error ? error.message : String(error)
        })
      }));
      throw error;
    });
  }
})();
