/* /prototypes/universal-compass/archcoin.globe.laws.round4.js
   ARCHCOIN calibration lab · Round 4.
   Standalone host for the exact Laws Audralia world-pass participant.
*/
(() => {
  "use strict";

  const BUILD = "ARCHCOIN_CALIBRATION_ROUND4_LAWS_GLOBE_v1";
  const GEOMETRY_URL = `/assets/audralia/audralia.planet.js?build=${encodeURIComponent(BUILD)}`;
  const PARTICIPANT_URL = `/laws/index.planet.js?build=${encodeURIComponent(BUILD)}`;

  function loadScript(url, marker) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-${marker}]`);
      if (existing) {
        if (existing.dataset.ready === "true") resolve(existing);
        else existing.addEventListener("load", () => resolve(existing), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = url;
      script.async = false;
      script.dataset[marker] = "true";
      script.addEventListener("load", () => {
        script.dataset.ready = "true";
        resolve(script);
      }, { once: true });
      script.addEventListener("error", () => reject(new Error(`ROUND4_SCRIPT_LOAD_FAILED:${url}`)), { once: true });
      document.head.append(script);
    });
  }

  function normalize3(v) {
    const length = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / length, v[1] / length, v[2] / length];
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

  function perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
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
      ...detail
    });
    globalThis.DGB_ARCHCOIN_ROUND4_LAWS_GLOBE_RECEIPT = receipt;
    globalThis.dispatchEvent(new CustomEvent("DGB_ARCHCOIN_ROUND4_LAWS_GLOBE_READY", { detail: receipt }));
    return receipt;
  }

  async function mount(target) {
    const mount = typeof target === "string" ? document.querySelector(target) : target;
    if (!mount || mount.dataset.lawsGlobeMounted === "true") return false;
    mount.dataset.lawsGlobeMounted = "true";
    mount.dataset.globeMode = "laws-audralia-world-pass";

    await loadScript(GEOMETRY_URL, "archcoinRound4AudraliaGeometry");
    await loadScript(PARTICIPANT_URL, "archcoinRound4LawsPlanetParticipant");

    const participant = globalThis.DGB_LAWS_PLANET_WORLD_PARTICIPANT;
    if (!participant || typeof participant.draw !== "function") {
      throw new Error("ROUND4_LAWS_PLANET_PARTICIPANT_UNAVAILABLE");
    }

    const canvas = document.createElement("canvas");
    canvas.className = "archcoin-round4-laws-globe-canvas";
    canvas.setAttribute("aria-hidden", "true");
    mount.replaceChildren(canvas);

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    });
    if (!gl) throw new Error("ROUND4_LAWS_GLOBE_WEBGL_UNAVAILABLE");

    const renderer = Object.freeze({
      id: "ARCHCOIN_ROUND4_LAWS_PLANET_HOST",
      gl
    });

    let running = true;
    let previous = performance.now();
    let raf = 0;

    function resize() {
      const rect = mount.getBoundingClientRect();
      const ratio = Math.min(2, Math.max(1, globalThis.devicePixelRatio || 1));
      const width = Math.max(2, Math.round(rect.width * ratio));
      const height = Math.max(2, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      return { aspect: width / Math.max(1, height) };
    }

    function frame(now) {
      if (!running || !mount.isConnected) return;
      const dimensions = resize();
      const deltaSeconds = Math.min(0.05, Math.max(0, (now - previous) / 1000));
      previous = now;

      participant.update({
        time: now / 1000,
        deltaSeconds,
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches
      });
      const node = participant.getNode({ time: now / 1000, deltaSeconds });

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      if (node) {
        const viewMatrix = lookAt([0, 0.20, 1.88], [0, 0.01, 0.02]);
        const projectionMatrix = perspective(Math.PI / 4.45, dimensions.aspect, 0.1, 60);
        participant.draw({ renderer, node, viewMatrix, projectionMatrix, haloPass: true });
        participant.draw({ renderer, node, viewMatrix, projectionMatrix, haloPass: false });
      }

      raf = requestAnimationFrame(frame);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    raf = requestAnimationFrame(frame);

    mount.addEventListener("DOMNodeRemoved", () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
    }, { once: true });

    publish({ mounted: true, canvasCreated: true, independentNavigationAuthority: false });
    return true;
  }

  globalThis.DGB_ARCHCOIN_ROUND4_LAWS_GLOBE = Object.freeze({
    build: BUILD,
    mount
  });
})();