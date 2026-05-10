// /assets/hearth/hearth.canvas.js
// HEARTH_4K_NATURAL_ORGANIC_CANVAS_CONSUMER_TNT_v3
// Full-file replacement.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_4K_NATURAL_ORGANIC_CANVAS_CONSUMER_TNT_v3";
  const RECEIPT = "HEARTH_4K_NATURAL_ORGANIC_CANVAS_CONSUMER_RECEIPT_v3";
  const VERSION = "2026-05-10.hearth-4k-natural-organic-canvas-consumer-v3";

  const TAU = Math.PI * 2;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function mix(a, b, t) {
    const k = clamp(t, 0, 1);
    return [
      Math.round(a[0] + (b[0] - a[0]) * k),
      Math.round(a[1] + (b[1] - a[1]) * k),
      Math.round(a[2] + (b[2] - a[2]) * k)
    ];
  }

  function mount(mountNode, options = {}) {
    const mount =
      mountNode ||
      document.getElementById("hearthCanvasMount") ||
      document.querySelector("[data-hearth-canvas-mount]");

    if (!mount) {
      throw new Error("Hearth canvas mount not found.");
    }

    mount.querySelectorAll("canvas").forEach((node) => node.remove());

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: true });

    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthMaterialsConsumer = "true";
    canvas.dataset.hearthNaturalOrganicMaterialLayer = String(Boolean(options.materials));
    canvas.dataset.hearthBodyMassCount = "7";
    canvas.dataset.hearthPoleSwivel = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.visualPassClaimed = "false";

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";

    mount.appendChild(canvas);

    mount.querySelectorAll("[data-hearth-mount-fallback]").forEach((fallback) => {
      fallback.hidden = true;
      fallback.style.display = "none";
    });

    const materials = options.materials || window.HEARTH_MATERIALS || null;
    const textureCanvas =
      materials && typeof materials.createTextureCanvas === "function"
        ? materials.createTextureCanvas({ width: 1536, height: 768 })
        : null;

    if (!textureCanvas) {
      throw new Error("Hearth materials texture unavailable.");
    }

    const textureCtx = textureCanvas.getContext("2d", { willReadFrequently: true });
    const texture = textureCtx.getImageData(0, 0, textureCanvas.width, textureCanvas.height);

    let disposed = false;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let yaw = Number.isFinite(options.yaw) ? options.yaw : -0.28;
    let tilt = Number.isFinite(options.tilt) ? options.tilt : -0.18;
    let yawVelocity = Number.isFinite(options.yawVelocity) ? options.yawVelocity : 0.0022;
    let tiltVelocity = 0;
    let frames = 0;

    function status(value) {
      document.documentElement.dataset.hearthCanvasAuthorityLoaded = "true";
      document.documentElement.dataset.hearthCanvasContract = CONTRACT;
      document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
      document.documentElement.dataset.hearthCanvasFrames = String(frames);
      document.documentElement.dataset.hearthNaturalOrganicMaterialLayer = "true";
      document.documentElement.dataset.hearthVisibleGlobeMounted = "true";
      document.documentElement.dataset.generatedImage = "false";
      document.documentElement.dataset.graphicBox = "false";
      document.documentElement.dataset.visualPassClaimed = "false";

      if (typeof options.onStatus === "function") {
        options.onStatus(value, {
          contract: CONTRACT,
          receipt: RECEIPT,
          frames,
          mounted: true,
          canvasFound: true,
          controlsBound: true,
          materialsLoaded: true
        });
      }
    }

    function resize() {
      const box = mount.getBoundingClientRect();
      const cssSize = Math.max(280, Math.floor(Math.min(box.width || 420, box.height || box.width || 420)));
      const dpr = Math.min(2.25, window.devicePixelRatio || 1);
      const size = Math.min(920, Math.max(420, Math.floor(cssSize * dpr)));

      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
      }
    }

    function sampleTexture(u, v) {
      const tx = Math.floor((((u % 1) + 1) % 1) * texture.width) % texture.width;
      const ty = clamp(Math.floor(clamp(v, 0, 0.999999) * texture.height), 0, texture.height - 1);
      const index = (ty * texture.width + tx) * 4;

      return [
        texture.data[index],
        texture.data[index + 1],
        texture.data[index + 2]
      ];
    }

    function render() {
      if (disposed) return;

      resize();

      const width = canvas.width;
      const height = canvas.height;
      const image = ctx.createImageData(width, height);
      const data = image.data;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.445;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      for (let y = 0; y < height; y += 1) {
        const sy = (y - cy) / radius;

        for (let x = 0; x < width; x += 1) {
          const sx = (x - cx) / radius;
          const rr = sx * sx + sy * sy;
          const index = (y * width + x) * 4;

          if (rr > 1) {
            data[index] = 0;
            data[index + 1] = 0;
            data[index + 2] = 0;
            data[index + 3] = 0;
            continue;
          }

          const z = Math.sqrt(1 - rr);
          const yy = sy * cosT + z * sinT;
          const zz = z * cosT - sy * sinT;
          const lon = Math.atan2(sx, zz) + yaw;
          const lat = Math.asin(clamp(yy, -1, 1));
          const u = lon / TAU + 0.5;
          const v = 0.5 - lat / Math.PI;

          let c = sampleTexture(u, v);

          const lightVector = clamp(0.46 + z * 0.62 - sx * 0.085 - sy * 0.07, 0.15, 1.14);
          const atmosphere = smoothstep(0.68, 1.0, rr);
          const limb = clamp(0.32 + z * 0.82, 0.16, 1.04);
          const glow = smoothstep(0.82, 1.0, rr);

          c = [
            Math.round(c[0] * lightVector * limb),
            Math.round(c[1] * lightVector * limb),
            Math.round(c[2] * lightVector * limb)
          ];

          c = mix(c, [5, 16, 31], atmosphere * 0.42);
          c = mix(c, [22, 78, 104], glow * 0.1);

          data[index] = c[0];
          data[index + 1] = c[1];
          data[index + 2] = c[2];
          data[index + 3] = 255;
        }
      }

      ctx.putImageData(image, 0, 0);

      if (!dragging) {
        yaw += yawVelocity;
        tilt += tiltVelocity;
        yawVelocity *= 0.992;
        tiltVelocity *= 0.93;

        if (Math.abs(yawVelocity) < 0.00125) yawVelocity = 0.00125;

        if (tilt > 1.3) {
          tilt = 1.3;
          tiltVelocity *= -0.18;
        }

        if (tilt < -1.3) {
          tilt = -1.3;
          tiltVelocity *= -0.18;
        }
      }

      frames += 1;

      if (frames < 4 || frames % 90 === 0) {
        status("rendering");
      }

      requestAnimationFrame(render);
    }

    function pointerDown(event) {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      yawVelocity = 0;
      tiltVelocity = 0;
      canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    }

    function pointerMove(event) {
      if (!dragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      yaw += dx * 0.009;
      tilt += dy * 0.0075;
      tilt = clamp(tilt, -1.36, 1.36);

      yawVelocity = dx * 0.00085;
      tiltVelocity = dy * 0.00055;

      event.preventDefault();
    }

    function pointerUp(event) {
      dragging = false;
      canvas.releasePointerCapture?.(event.pointerId);
      event.preventDefault();
    }

    canvas.addEventListener("pointerdown", pointerDown, { passive: false });
    canvas.addEventListener("pointermove", pointerMove, { passive: false });
    canvas.addEventListener("pointerup", pointerUp, { passive: false });
    canvas.addEventListener("pointercancel", pointerUp, { passive: false });

    const api = {
      canvas,
      contract: CONTRACT,
      receipt: RECEIPT,
      dispose() {
        disposed = true;
        canvas.removeEventListener("pointerdown", pointerDown);
        canvas.removeEventListener("pointermove", pointerMove);
        canvas.removeEventListener("pointerup", pointerUp);
        canvas.removeEventListener("pointercancel", pointerUp);
        canvas.remove();
      },
      getStatus() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          version: VERSION,
          frames,
          mounted: true,
          canvasFound: true,
          controlsBound: true,
          naturalOrganicMaterialLayer: true,
          generatedImage: false,
          graphicBox: false,
          visualPassClaimed: false
        };
      }
    };

    window.__HEARTH_CANVAS_DISPOSE__ = api.dispose;

    status("mounted");
    requestAnimationFrame(render);

    return api;
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      authority: "hearth-natural-organic-canvas-consumer",
      consumesMaterials: true,
      visibleGlobeFirst: true,
      dragEnabled: true,
      poleSwivel: true,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_CANVAS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    mount,
    getStatus
  });

  window.HEARTH_CANVAS_RECEIPT = getStatus();

  document.documentElement.dataset.hearthCanvasAuthorityLoaded = "true";
  document.documentElement.dataset.hearthCanvasContract = CONTRACT;
  document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
  document.documentElement.dataset.hearthCanvasConsumesMaterials = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
