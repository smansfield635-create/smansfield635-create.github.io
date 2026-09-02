/* /products/archcoin/index.planet.source.js
   ARCHCOIN accepted production center world.
   Performance round 3: direct same-origin execution, cached sizing,
   bounded frame cadence, environmental suspension, and non-deprecated disposal.
*/
(() => {
  "use strict";

  function installAboutShotVisibilityScheduler() {
    const root = document.documentElement;
    if (root?.dataset.aboutGeneration !== "documentary-estate-v2-reconstructed") return;
    if (document.querySelector("style[data-about-shot-visibility-scheduler]")) return;

    const style = document.createElement("style");
    style.dataset.aboutShotVisibilityScheduler = "v1";
    style.textContent = `
      @keyframes dgbAboutShotVisibility {
        0% { opacity: 0; filter: blur(7px); transform: scale(1.025); }
        12% { opacity: 1; filter: blur(0); transform: scale(1); }
        82% { opacity: 1; filter: blur(0); transform: scale(1); }
        100% { opacity: 0; filter: blur(7px); transform: scale(1.012); }
      }
      html[data-film-state="playing"] .shot.s1 { animation: dgbAboutShotVisibility 4s ease both; }
      html[data-film-state="playing"] .shot.s2 { animation: dgbAboutShotVisibility 5s ease 4s both; }
      html[data-film-state="playing"] .shot.s3 { animation: dgbAboutShotVisibility 5s ease 9s both; }
      html[data-film-state="playing"] .shot.s4 { animation: dgbAboutShotVisibility 5s ease 14s both; }
      html[data-film-state="playing"] .shot.s5 { animation: dgbAboutShotVisibility 5s ease 19s both; }
      html[data-film-state="playing"] .shot.s6 { animation: dgbAboutShotVisibility 4s ease 24s both; }
    `;
    document.head.append(style);
  }

  installAboutShotVisibilityScheduler();

  const BUILD = "ARCHCOIN_PRODUCTION_CENTER_WORLD_v2";
  const GEOMETRY_URL = `/assets/audralia/audralia.planet.js?build=${encodeURIComponent(BUILD)}`;
  const PARTICIPANT_URL = `/laws/index.planet.js?build=${encodeURIComponent(BUILD)}`;

  function loadScript(url, marker) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-${marker}]`);
      if (existing) {
        if (existing.dataset.ready === "true") resolve(existing);
        else {
          existing.addEventListener("load", () => resolve(existing), { once: true });
          existing.addEventListener("error", () => reject(
            new Error(`ARCHCOIN_CENTER_WORLD_SCRIPT_LOAD_FAILED:${url}`)
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
        new Error(`ARCHCOIN_CENTER_WORLD_SCRIPT_LOAD_FAILED:${url}`)
      ), { once: true });
      document.head.append(script);
    });
  }

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
    const z = normalize3([eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]]);
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

  function publish(detail = {}) {
    const receipt = Object.freeze({
      build: BUILD,
      sourceGeometry: "/assets/audralia/audralia.planet.js",
      sourceParticipant: "/laws/index.planet.js",
      visualIdentity: "mini-audralia",
      clickAuthorityPreserved: true,
      loadingMode: "same-origin-script-no-blob",
      deprecatedMutationEventUsed: false,
      boundedFrameRate: 30,
      environmentalSuspension: true,
      ...detail
    });
    globalThis.DGB_ARCHCOIN_CENTER_WORLD_RECEIPT = receipt;
    globalThis.dispatchEvent(new CustomEvent("DGB_ARCHCOIN_CENTER_WORLD_READY", {
      detail: receipt
    }));
    return receipt;
  }

  async function mount(target) {
    const mountNode = typeof target === "string" ? document.querySelector(target) : target;
    if (!mountNode || mountNode.dataset.archcoinCenterWorldMounted === "true") return false;

    mountNode.dataset.archcoinCenterWorldMounted = "true";
    mountNode.dataset.globeMode = "accepted-audralia-world-pass";

    await loadScript(GEOMETRY_URL, "archcoinCenterWorldAudraliaGeometry");
    await loadScript(PARTICIPANT_URL, "archcoinCenterWorldPlanetParticipant");

    const participant = globalThis.DGB_LAWS_PLANET_WORLD_PARTICIPANT;
    if (!participant || typeof participant.draw !== "function") {
      throw new Error("ARCHCOIN_CENTER_WORLD_PARTICIPANT_UNAVAILABLE");
    }

    const canvas = document.createElement("canvas");
    canvas.className = "archcoin-round4-laws-globe-canvas";
    canvas.setAttribute("aria-hidden", "true");
    mountNode.replaceChildren(canvas);

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    });
    if (!gl) throw new Error("ARCHCOIN_CENTER_WORLD_WEBGL_UNAVAILABLE");

    const renderer = Object.freeze({
      id: "ARCHCOIN_ACCEPTED_CENTER_WORLD_HOST",
      gl
    });

    let running = true;
    let previous = performance.now();
    let lastRendered = 0;
    let raf = 0;
    let frameTimer = 0;
    let documentVisible = !document.hidden;
    let mountVisible = true;
    let staticFrameRendered = false;
    let resizeDirty = true;
    let dimensions = { aspect: 1 };
    let removalObserver = null;
    const targetFrameInterval = 1000 / 30;
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;

    function resize() {
      if (!resizeDirty) return dimensions;
      resizeDirty = false;
      const rect = mountNode.getBoundingClientRect();
      const hardwareConcurrency = Number(navigator.hardwareConcurrency || 0);
      const deviceMemory = Number(navigator.deviceMemory || 0);
      const lowPower =
        rect.width <= 420 ||
        (hardwareConcurrency > 0 && hardwareConcurrency <= 4) ||
        (deviceMemory > 0 && deviceMemory <= 4);
      const ratioCap = lowPower ? 1 : 1.5;
      const ratio = Math.min(ratioCap, Math.max(1, globalThis.devicePixelRatio || 1));
      const width = Math.max(2, Math.round(rect.width * ratio));
      const height = Math.max(2, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      dimensions = { aspect: width / Math.max(1, height) };
      return dimensions;
    }

    function requestFrame() {
      frameTimer = 0;
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function scheduleFrame() {
      if (
        !running ||
        !mountNode.isConnected ||
        raf ||
        frameTimer ||
        !documentVisible ||
        !mountVisible ||
        (reducedMotion && staticFrameRendered)
      ) return;

      const elapsed = performance.now() - lastRendered;
      const wait = Math.max(0, targetFrameInterval - elapsed);
      if (wait > 4) frameTimer = setTimeout(requestFrame, wait);
      else requestFrame();
    }

    function frame(now) {
      raf = 0;
      if (!running || !mountNode.isConnected || !documentVisible || !mountVisible) return;

      const currentDimensions = resize();
      const deltaSeconds = Math.min(0.05, Math.max(0, (now - previous) / 1000));
      previous = now;
      lastRendered = now;

      participant.update({
        time: now / 1000,
        deltaSeconds,
        reducedMotion
      });
      const node = participant.getNode({ time: now / 1000, deltaSeconds });

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      if (node) {
        const viewMatrix = lookAt([0, 0.20, 1.88], [0, 0.01, 0.02]);
        const projectionMatrix = perspective(
          Math.PI / 4.45,
          currentDimensions.aspect,
          0.1,
          60
        );
        participant.draw({ renderer, node, viewMatrix, projectionMatrix, haloPass: true });
        participant.draw({ renderer, node, viewMatrix, projectionMatrix, haloPass: false });
      }

      staticFrameRendered = reducedMotion;
      scheduleFrame();
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeDirty = true;
      staticFrameRendered = false;
      scheduleFrame();
    });
    resizeObserver.observe(mountNode);

    const intersectionObserver = typeof IntersectionObserver === "function"
      ? new IntersectionObserver(entries => {
          mountVisible = entries.some(entry => entry.isIntersecting);
          if (mountVisible) {
            previous = performance.now();
            staticFrameRendered = false;
            scheduleFrame();
          }
        }, { rootMargin: "120px 0px", threshold: 0 })
      : null;
    intersectionObserver?.observe(mountNode);

    const onVisibilityChange = () => {
      documentVisible = !document.hidden;
      if (documentVisible) {
        previous = performance.now();
        staticFrameRendered = false;
        scheduleFrame();
      }
    };

    const onMotionChange = event => {
      reducedMotion = event.matches;
      previous = performance.now();
      staticFrameRendered = false;
      scheduleFrame();
    };

    const stop = () => {
      if (!running) return;
      running = false;
      if (raf) cancelAnimationFrame(raf);
      if (frameTimer) clearTimeout(frameTimer);
      raf = 0;
      frameTimer = 0;
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      removalObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (typeof motionQuery.removeEventListener === "function") {
        motionQuery.removeEventListener("change", onMotionChange);
      } else if (typeof motionQuery.removeListener === "function") {
        motionQuery.removeListener(onMotionChange);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", onMotionChange);
    } else if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(onMotionChange);
    }

    if (typeof MutationObserver === "function") {
      removalObserver = new MutationObserver(() => {
        if (!mountNode.isConnected) stop();
      });
      removalObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }

    globalThis.addEventListener("pagehide", stop, { once: true });
    scheduleFrame();

    publish({
      mounted: true,
      canvasCreated: true,
      independentNavigationAuthority: false
    });
    return true;
  }

  globalThis.DGB_ARCHCOIN_CENTER_WORLD = Object.freeze({
    build: BUILD,
    mount
  });
})();
