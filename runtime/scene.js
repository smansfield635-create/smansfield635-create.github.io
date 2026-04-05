Destination: /runtime/scene.js

Confidence is not 100%. This is a best-effort full TNT to replace the wrong file and restore a lawful host scene authority that actually paints the canvas from the /world/* stack.

import runtime from "../world/runtime.js";
import renderModule from "../world/render.js";

const DEFAULT_CANVAS_ID = "scene";

function assert(condition, message) {
  if (!condition) {
    throw new Error(`[scene] ${message}`);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createScene(options = {}) {
  const canvasId = typeof options.canvasId === "string" && options.canvasId.length > 0
    ? options.canvasId
    : DEFAULT_CANVAS_ID;

  const runtimeHandle =
    options.runtimeHandle && typeof options.runtimeHandle.getCurrentState === "function"
      ? options.runtimeHandle
      : runtime;

  const renderer =
    options.renderer && typeof options.renderer.render === "function"
      ? options.renderer
      : renderModule;

  let canvas = null;
  let ctx = null;
  let raf = null;
  let running = false;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let lastTs = 0;

  function getCanvas() {
    if (!canvas) {
      canvas = document.getElementById(canvasId);
      assert(canvas, `canvas #${canvasId} not found`);
    }
    return canvas;
  }

  function getContext() {
    if (!ctx) {
      ctx = getCanvas().getContext("2d", { alpha: false, desynchronized: true });
      assert(ctx, "2d context unavailable");
    }
    return ctx;
  }

  function resize() {
    const el = getCanvas();
    const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = el.getBoundingClientRect();

    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    dpr = nextDpr;

    el.width = Math.floor(width * dpr);
    el.height = Math.floor(height * dpr);

    getContext().setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function clearFrame() {
    const g = getContext();

    const gradient = g.createRadialGradient(
      width * 0.5,
      height * 0.45,
      0,
      width * 0.5,
      height * 0.45,
      Math.max(width, height) * 0.75
    );
    gradient.addColorStop(0, "#17335f");
    gradient.addColorStop(0.35, "#0a1834");
    gradient.addColorStop(1, "#030712");

    g.fillStyle = gradient;
    g.fillRect(0, 0, width, height);
  }

  function drawStars() {
    const g = getContext();
    const starCount = 96;

    for (let i = 0; i < starCount; i += 1) {
      const x = ((i * 97) % width) + (((i * 17) % 13) * 0.35);
      const y = ((i * 53) % height) * 0.78;
      const radius = 0.5 + ((i * 19) % 7) * 0.18;
      const alpha = 0.22 + (((i * 29) % 11) * 0.04);

      g.fillStyle = `rgba(255,255,255,${alpha})`;
      g.beginPath();
      g.arc(x, y, radius, 0, Math.PI * 2);
      g.fill();
    }
  }

  function colorFromHSV(h, s, v, a = 1) {
    const hh = ((h % 1) + 1) % 1;
    const i = Math.floor(hh * 6);
    const f = hh * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r = 0, g = 0, b = 0;
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }

    return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`;
  }

  function projectPacket(packet) {
    const proj = packet.projection;
    const sourceDense = packet.sourceDense;
    const runtimePacket = packet.runtime;

    if (proj.projectionState === "flat") {
      const fx = proj.selectedProjection.x;
      const fy = proj.selectedProjection.y;
      const fieldW = Math.max(1, proj.selectedProjection.width || 1);
      const fieldH = Math.max(1, proj.selectedProjection.height || 1);

      const px = fieldW <= 1 ? width * 0.5 : (fx / (fieldW - 1)) * width;
      const py = fieldH <= 1 ? height * 0.5 : (fy / (fieldH - 1)) * height;

      return {
        x: px,
        y: py,
        z: 0
      };
    }

    if (proj.projectionState === "tree") {
      const root = Number(proj.selectedProjection.root || 0);
      const leaf = Number(proj.selectedProjection.leaf || 0);

      return {
        x: ((root + 0.5) / 9) * width,
        y: ((leaf + 0.5) / 16) * height,
        z: 0
      };
    }

    const gx = Number(proj.coordinates.x || 0);
    const gy = Number(proj.coordinates.y || 0);
    const gz = Number(proj.coordinates.z || 0);

    const radius = Math.min(width, height) * 0.26;
    return {
      x: width * 0.5 + gx * radius,
      y: height * 0.52 - gy * radius,
      z: gz
    };
  }

  function drawPacket(packet) {
    const g = getContext();
    const point = projectPacket(packet);
    const color = packet.visible.colorOutput;
    const boundary = packet.runtime.boundary.classification;
    const motion = packet.visible.motionOutput;
    const transition = packet.visible.transitionVisibility;
    const depth = clamp(Number(packet.visible.depthOutput || 0), 0, 1);
    const luminance = clamp(Number(packet.visible.luminanceOutput || 0), 0, 1);

    const baseRadius = 8 + depth * 20 + luminance * 10;
    const glowRadius = baseRadius * 3.2;

    const glow = g.createRadialGradient(point.x, point.y, 0, point.x, point.y, glowRadius);
    glow.addColorStop(0, colorFromHSV(color.hue, color.saturation, Math.min(1, color.value + 0.12), 0.50));
    glow.addColorStop(0.35, colorFromHSV(color.hue, color.saturation, color.value, 0.20));
    glow.addColorStop(1, colorFromHSV(color.hue, color.saturation, color.value, 0));

    g.fillStyle = glow;
    g.beginPath();
    g.arc(point.x, point.y, glowRadius, 0, Math.PI * 2);
    g.fill();

    g.fillStyle = colorFromHSV(color.hue, color.saturation, color.value, 0.98);
    g.beginPath();
    g.arc(point.x, point.y, baseRadius, 0, Math.PI * 2);
    g.fill();

    if (boundary === "GATE" || boundary === "BRIDGE") {
      g.strokeStyle = "rgba(255,255,255,0.75)";
      g.lineWidth = 1.5;
      g.beginPath();
      g.arc(point.x, point.y, baseRadius + 4, 0, Math.PI * 2);
      g.stroke();
    }

    if (boundary === "BLOCK") {
      g.strokeStyle = "rgba(255,240,240,0.82)";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(point.x - baseRadius - 5, point.y - baseRadius - 5);
      g.lineTo(point.x + baseRadius + 5, point.y + baseRadius + 5);
      g.moveTo(point.x + baseRadius + 5, point.y - baseRadius - 5);
      g.lineTo(point.x - baseRadius - 5, point.y + baseRadius + 5);
      g.stroke();
    }

    g.fillStyle = "rgba(233,239,255,0.92)";
    g.font = "bold 12px Arial";
    g.textAlign = "center";
    g.fillText(
      `${packet.runtime.region.label}`,
      point.x,
      point.y - baseRadius - 10
    );

    g.font = "10px Arial";
    g.fillStyle = "rgba(157,176,212,0.90)";
    g.fillText(
      `${packet.runtime.terrainClass} · ${packet.runtime.biomeType}`,
      point.x,
      point.y + baseRadius + 14
    );

    if (transition.visible && motion.visible) {
      const vector = motion.vector;
      const dx = Number(vector.x || 0) * 34;
      const dy = Number(vector.y || 0) * 34;

      g.strokeStyle = "rgba(255,255,255,0.60)";
      g.lineWidth = 1.2;
      g.beginPath();
      g.moveTo(point.x, point.y);
      g.lineTo(point.x + dx, point.y - dy);
      g.stroke();
    }
  }

  function frame(ts) {
    if (!running) return;

    const dtMs = lastTs > 0 ? ts - lastTs : 16.6667;
    lastTs = ts;

    if (typeof runtimeHandle.refreshFrameState === "function") {
      runtimeHandle.refreshFrameState({
        elapsedSeconds: ts / 1000
      });
    }

    clearFrame();
    drawStars();

    const packet = renderer.render(runtimeHandle);
    drawPacket(packet);

    raf = requestAnimationFrame(frame);
    window.__COMPASS_BASELINE_RAF__ = raf;
  }

  function start() {
    resize();
    running = true;
    lastTs = 0;

    if (raf) {
      cancelAnimationFrame(raf);
    }

    raf = requestAnimationFrame(frame);
    window.__COMPASS_BASELINE_RAF__ = raf;
  }

  function stop() {
    running = false;
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
      window.__COMPASS_BASELINE_RAF__ = null;
    }
  }

  function destroy() {
    stop();
    canvas = null;
    ctx = null;
  }

  window.addEventListener("resize", resize, { passive: true });

  return Object.freeze({
    resize,
    start,
    stop,
    destroy,
    getRuntimeHandle() {
      return runtimeHandle;
    }
  });
}

const defaultScene = createScene();

export { createScene };
export default defaultScene;
