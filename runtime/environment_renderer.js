/* TNT RENEWAL — /runtime/environment_renderer.js
   ENVIRONMENT RENDERER · GENERATION 2 PASSIVE HELPER BASELINE B1

   VERSION = "G2_PASSIVE_ENVIRONMENT_RENDERER_B1"

   PURPOSE:
     - Keep this file as a pure environment render helper.
     - Do not mutate DOM.
     - Do not bind controls.
     - Do not own cockpit state.
     - Do not own canopy state.
     - Do not own root boot.
     - Do not start timers.
     - Do not create observers.
     - Do not compete with /runtime/compass_cockpit_render.js.
     - Draw only when a caller explicitly passes a canvas context.
     - Return a deterministic receipt packet for instrument/runtime use.
*/

const META = Object.freeze({
  name: "ENVIRONMENT_RENDERER",
  version: "G2_PASSIVE_ENVIRONMENT_RENDERER_B1",
  role: "pure_environment_canvas_helper",
  contract: "ENVIRONMENT_RENDERER_NON_OVERLAP_CONTRACT_G2",
  status: "ACTIVE_PASSIVE",
  deterministic: true
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
}

function toNumber(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function clamp(value, min, max) {
  const next = toNumber(value, min);
  if (next < min) return min;
  if (next > max) return max;
  return next;
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function hasCanvasContext(ctx) {
  return Boolean(
    ctx &&
    typeof ctx.save === "function" &&
    typeof ctx.restore === "function" &&
    typeof ctx.beginPath === "function" &&
    typeof ctx.arc === "function" &&
    typeof ctx.fill === "function" &&
    typeof ctx.fillRect === "function"
  );
}

function getProjectionPacket(snapshot = {}) {
  return snapshot.projection && typeof snapshot.projection === "object"
    ? snapshot.projection
    : {};
}

function getRenderPacket(snapshot = {}) {
  return snapshot.renderPacket && typeof snapshot.renderPacket === "object"
    ? snapshot.renderPacket
    : {};
}

function getVisiblePacket(snapshot = {}) {
  const renderPacket = getRenderPacket(snapshot);
  return renderPacket.visible && typeof renderPacket.visible === "object"
    ? renderPacket.visible
    : {};
}

function getProjectionDimensions(projection = {}) {
  return deepFreeze({
    width: Math.max(1, toNumber(projection.width, 1280)),
    height: Math.max(1, toNumber(projection.height, 720)),
    cx: toNumber(projection.cx, toNumber(projection.width, 1280) * 0.5),
    cy: toNumber(projection.cy, toNumber(projection.height, 720) * 0.5)
  });
}

function projectPoint(projection, point) {
  if (projection && typeof projection.project === "function") {
    const projected = projection.project(point);
    return {
      x: toNumber(projected && projected.x),
      y: toNumber(projected && projected.y)
    };
  }

  return {
    x: toNumber(point && point.x),
    y: toNumber(point && point.y)
  };
}

function buildEnvironmentReceipt(snapshot = {}, projection = {}) {
  const projectionPacket = getProjectionPacket(snapshot);
  const visible = getVisiblePacket(snapshot);
  const colorOutput = visible.colorOutput || {};
  const dimensions = getProjectionDimensions(projection);

  const stars = Array.isArray(projectionPacket.stars) ? projectionPacket.stars : [];
  const markers = Array.isArray(projectionPacket.markers) ? projectionPacket.markers : [];

  const depth = clamp01(visible.depthOutput ?? 0.5);
  const luminance = clamp01(visible.luminanceOutput ?? 0.5);
  const hue = clamp01(colorOutput.hue ?? 0.5);
  const saturation = clamp01(colorOutput.saturation ?? 0.5);
  const value = clamp01(colorOutput.value ?? 0.5);

  return deepFreeze({
    meta: META,
    status: "READY",
    ownership: {
      writesDom: false,
      bindsControls: false,
      ownsCockpitState: false,
      ownsCanopyTruth: false,
      ownsRootBoot: false,
      ownsRenderCss: false,
      ownsCanvasDrawWhenCalled: true
    },
    input: {
      starCount: stars.length,
      markerCount: markers.length,
      projectionWidth: dimensions.width,
      projectionHeight: dimensions.height
    },
    environment: {
      depth,
      luminance,
      colorOutput: {
        hue,
        saturation,
        value
      }
    }
  });
}

export function renderEnvironmentLayer(ctx, snapshot = {}, projection = {}) {
  const receipt = buildEnvironmentReceipt(snapshot, projection);

  if (!hasCanvasContext(ctx)) return receipt;

  const projectionPacket = getProjectionPacket(snapshot);
  const stars = Array.isArray(projectionPacket.stars) ? projectionPacket.stars : [];
  const markers = Array.isArray(projectionPacket.markers) ? projectionPacket.markers : [];
  const dimensions = getProjectionDimensions(projection);

  const depth = receipt.environment.depth;
  const luminance = receipt.environment.luminance;
  const hue = receipt.environment.colorOutput.hue;
  const saturation = receipt.environment.colorOutput.saturation;
  const value = receipt.environment.colorOutput.value;

  ctx.save();

  const glowRadius = Math.min(dimensions.width, dimensions.height) * (0.16 + depth * 0.06);
  const glowCenterY = dimensions.cy - glowRadius * 0.4;

  const glow = ctx.createRadialGradient(
    dimensions.cx,
    glowCenterY,
    0,
    dimensions.cx,
    glowCenterY,
    glowRadius
  );

  glow.addColorStop(0, "rgba(255,248,228,0.30)");
  glow.addColorStop(0.24, "rgba(111,231,255,0.08)");
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(dimensions.cx, glowCenterY, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  stars.forEach((star) => {
    const p = projectPoint(projection, star);
    const alpha = clamp(toNumber(star.alpha, 0.2) * (0.65 + luminance * 0.35), 0.08, 1);
    const size = Math.max(0.6, toNumber(star.size, 1));

    ctx.fillStyle = "rgba(255,255,255," + alpha.toFixed(3) + ")";
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();
  });

  markers.forEach((marker) => {
    const p = projectPoint(projection, marker);
    const size = Math.max(3, toNumber(marker.size, 4));
    const label = String(marker.label || "");

    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.fill();

    if (label) {
      ctx.fillStyle = "rgba(232,246,255,0.72)";
      ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      ctx.textAlign = "center";
      ctx.fillText(label, p.x, p.y - 10);
    }
  });

  const r = Math.round(120 + hue * 80);
  const g = Math.round(180 + saturation * 60);
  const b = Math.round(220 + value * 35);

  ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ",0.09)";
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);

  ctx.restore();

  return receipt;
}

export function getEnvironmentRendererReceipt(snapshot = {}, projection = {}) {
  return buildEnvironmentReceipt(snapshot, projection);
}

const ENVIRONMENT_RENDERER_API = Object.freeze({
  meta: META,
  renderEnvironmentLayer,
  getEnvironmentRendererReceipt
});

export default ENVIRONMENT_RENDERER_API;
