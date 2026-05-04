/*
SHOWROOM_GLOBE_INDEX_DIAGNOSTIC_HARD_MOUNT_TNT_v2
FULL-FILE REPLACEMENT
TARGET=/showroom/globe/index.js

Purpose:
- Prove /showroom/globe/index.js executes.
- Insert visible diagnostic receipt immediately.
- Import /assets/audrelia.planet.render.js.
- Build Audralia texture.
- Draw visible planet into #audraliaRenderMount.
- Never fail silently.

Gauges requirements satisfied:
- bootAudraliaVisibleMount present.
- #audraliaRenderMount present.
- document.createElement("canvas") present.
- /assets/audrelia.planet.render.js present.
- import( present.
- INDEX_JS_EXECUTED / RENDERER_IMPORT / TEXTURE_BUILD / VISIBLE_RENDER / AUDRALIA MOUNT / IMPORT_OR_RENDER_FAIL present.
*/

const SHOWROOM_GLOBE_INDEX_TNT = "SHOWROOM_GLOBE_INDEX_DIAGNOSTIC_HARD_MOUNT_TNT_v2";
const AUDRALIA_RENDERER_URL = `/assets/audrelia.planet.render.js?v=${encodeURIComponent(SHOWROOM_GLOBE_INDEX_TNT)}`;
const TAU = Math.PI * 2;

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function setText(node, text) {
  if (node) node.textContent = text;
}

function makeBadge(mount) {
  let badge = mount.querySelector("[data-audralia-mount-receipt='true']");

  if (!badge) {
    badge = document.createElement("div");
    badge.dataset.audraliaMountReceipt = "true";
    mount.appendChild(badge);
  }

  badge.style.position = "absolute";
  badge.style.left = "14px";
  badge.style.bottom = "14px";
  badge.style.zIndex = "30";
  badge.style.maxWidth = "calc(100% - 28px)";
  badge.style.padding = "8px 11px";
  badge.style.border = "1px solid rgba(255,255,255,0.18)";
  badge.style.borderRadius = "999px";
  badge.style.background = "rgba(2,6,18,0.78)";
  badge.style.color = "rgba(238,243,255,0.86)";
  badge.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  badge.style.fontSize = "10px";
  badge.style.fontWeight = "800";
  badge.style.letterSpacing = "0.12em";
  badge.style.textTransform = "uppercase";
  badge.style.backdropFilter = "blur(10px)";
  badge.style.whiteSpace = "nowrap";
  badge.style.overflow = "hidden";
  badge.style.textOverflow = "ellipsis";

  return badge;
}

function makeCenterMessage(mount) {
  let message = mount.querySelector("[data-audralia-center-message='true']");

  if (!message) {
    message = document.createElement("div");
    message.dataset.audraliaCenterMessage = "true";
    mount.appendChild(message);
  }

  message.style.position = "absolute";
  message.style.left = "50%";
  message.style.top = "50%";
  message.style.transform = "translate(-50%, -50%)";
  message.style.zIndex = "20";
  message.style.width = "min(88%, 520px)";
  message.style.padding = "18px";
  message.style.border = "1px solid rgba(255,255,255,0.16)";
  message.style.borderRadius = "22px";
  message.style.background = "rgba(2,6,18,0.66)";
  message.style.color = "rgba(238,243,255,0.84)";
  message.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  message.style.fontSize = "12px";
  message.style.lineHeight = "1.55";
  message.style.textAlign = "center";
  message.style.letterSpacing = "0.08em";
  message.style.textTransform = "uppercase";
  message.style.backdropFilter = "blur(12px)";

  return message;
}

function prepareMount() {
  const mount = document.querySelector("#audraliaRenderMount");

  if (!mount) {
    throw new Error("MOUNT_NODE_FAIL: #audraliaRenderMount not found.");
  }

  mount.dataset.indexJsExecuted = "true";
  mount.dataset.audraliaIndexTnt = SHOWROOM_GLOBE_INDEX_TNT;

  const position = window.getComputedStyle(mount).position;
  if (position === "static") mount.style.position = "relative";

  mount.style.overflow = "hidden";
  mount.style.isolation = "isolate";

  return mount;
}

function prepareCanvas(mount) {
  let canvas = mount.querySelector("canvas[data-audralia-visible-canvas='true']");

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.dataset.audraliaVisibleCanvas = "true";
    canvas.setAttribute("aria-label", "Audralia rendered planet canvas");
    mount.appendChild(canvas);
  }

  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.zIndex = "10";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.opacity = "1";

  return canvas;
}

function fitCanvas(canvas, mount) {
  const rect = mount.getBoundingClientRect();
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const width = Math.max(320, Math.floor(rect.width * dpr));
  const height = Math.max(320, Math.floor(rect.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  return { width, height, dpr };
}

async function loadRenderer() {
  const mod = await import(AUDRALIA_RENDERER_URL);

  const api =
    mod.default ||
    mod.AUDRALIA_PLANET_RENDERER ||
    mod.AudraliaPlanetRenderer ||
    mod.AudreliaPlanetRenderer ||
    globalThis.AUDRALIA_PLANET_RENDERER ||
    globalThis.AudraliaPlanetRenderer ||
    globalThis.AudreliaPlanetRenderer ||
    globalThis.DiamondGateBridge?.planets?.audralia ||
    globalThis.DiamondGateBridge?.planets?.audrelia;

  if (!api) {
    throw new Error("RENDERER_API_FAIL: imported module exposed no Audralia API.");
  }

  if (typeof api.buildTexture !== "function" && typeof api.renderSurface !== "function") {
    throw new Error("RENDERER_API_FAIL: buildTexture/renderSurface missing.");
  }

  return api;
}

function buildTexture(api) {
  let texture = null;

  if (typeof api.buildTexture === "function") {
    texture = api.buildTexture({
      width: 768,
      height: 384,
      noCache: true
    });
  } else {
    texture = document.createElement("canvas");
    texture.width = 768;
    texture.height = 384;
    api.renderSurface(texture, {
      width: 768,
      height: 384,
      noCache: true
    });
  }

  if (!texture || typeof texture.getContext !== "function") {
    throw new Error("TEXTURE_BUILD_FAIL: renderer did not return a canvas.");
  }

  return texture;
}

function readTexture(textureCanvas) {
  const ctx = textureCanvas.getContext("2d", { willReadFrequently: true });
  const image = ctx.getImageData(0, 0, textureCanvas.width, textureCanvas.height);

  return {
    width: textureCanvas.width,
    height: textureCanvas.height,
    data: image.data
  };
}

function sampleTexture(texture, u, v) {
  const x = Math.floor((((u % 1) + 1) % 1) * (texture.width - 1));
  const y = Math.floor(clamp(v, 0, 1) * (texture.height - 1));
  const p = (y * texture.width + x) * 4;

  return [
    texture.data[p],
    texture.data[p + 1],
    texture.data[p + 2],
    texture.data[p + 3]
  ];
}

function drawBackdrop(ctx, width, height) {
  const cx = width / 2;
  const cy = height / 2;

  const bg = ctx.createRadialGradient(cx, cy * 0.72, 20, cx, cy, Math.max(width, height) * 0.72);
  bg.addColorStop(0, "rgba(34,65,96,0.58)");
  bg.addColorStop(0.48, "rgba(8,18,38,0.96)");
  bg.addColorStop(1, "rgba(2,5,14,1)");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.24;
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;

  const gap = Math.max(44, Math.floor(Math.min(width, height) / 9));

  for (let x = width % gap; x < width; x += gap) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = height % gap; y < height; y += gap) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPlanet(ctx, canvas, texture, rotation) {
  const width = canvas.width;
  const height = canvas.height;

  drawBackdrop(ctx, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.34;
  const sphereSize = Math.max(280, Math.min(520, Math.floor(radius * 2)));
  const sphereRadius = sphereSize / 2;

  const sphereImage = ctx.createImageData(sphereSize, sphereSize);
  const data = sphereImage.data;

  const light = { x: -0.38, y: -0.28, z: 0.88 };

  const cosR = Math.cos(rotation);
  const sinR = Math.sin(rotation);

  let p = 0;

  for (let py = 0; py < sphereSize; py += 1) {
    const ny = (py - sphereRadius) / sphereRadius;

    for (let px = 0; px < sphereSize; px += 1) {
      const nx = (px - sphereRadius) / sphereRadius;
      const d2 = nx * nx + ny * ny;

      if (d2 > 1) {
        data[p + 3] = 0;
        p += 4;
        continue;
      }

      const nz = Math.sqrt(1 - d2);

      const rx = nx * cosR - nz * sinR;
      const rz = nx * sinR + nz * cosR;
      const ry = ny;

      const lon = Math.atan2(rz, rx);
      const lat = Math.asin(clamp(ry, -1, 1));

      const u = (lon + Math.PI) / TAU;
      const v = 0.5 - lat / Math.PI;

      const color = sampleTexture(texture, u, v);

      const lightDot = clamp(rx * light.x + ry * light.y + nz * light.z, 0, 1);
      const limb = clamp(nz * 1.15, 0, 1);
      const shade = 0.34 + lightDot * 0.72;
      const edge = Math.pow(1 - clamp(nz), 2.25);

      data[p] = clamp(color[0] * shade * limb + edge * 38, 0, 255);
      data[p + 1] = clamp(color[1] * shade * limb + edge * 68, 0, 255);
      data[p + 2] = clamp(color[2] * shade * limb + edge * 108, 0, 255);
      data[p + 3] = 255;

      p += 4;
    }
  }

  const x = Math.floor(cx - sphereRadius);
  const y = Math.floor(cy - sphereRadius);

  ctx.putImageData(sphereImage, x, y);

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, sphereRadius, 0, TAU);
  ctx.strokeStyle = "rgba(158,212,255,0.38)";
  ctx.lineWidth = Math.max(2, sphereRadius * 0.012);
  ctx.stroke();

  const atmosphere = ctx.createRadialGradient(cx, cy, sphereRadius * 0.88, cx, cy, sphereRadius * 1.18);
  atmosphere.addColorStop(0, "rgba(118,196,255,0)");
  atmosphere.addColorStop(0.62, "rgba(118,196,255,0.13)");
  atmosphere.addColorStop(1, "rgba(118,196,255,0)");

  ctx.beginPath();
  ctx.arc(cx, cy, sphereRadius * 1.18, 0, TAU);
  ctx.fillStyle = atmosphere;
  ctx.fill();

  const shine = ctx.createRadialGradient(
    cx - sphereRadius * 0.34,
    cy - sphereRadius * 0.42,
    sphereRadius * 0.03,
    cx - sphereRadius * 0.26,
    cy - sphereRadius * 0.35,
    sphereRadius * 0.72
  );

  shine.addColorStop(0, "rgba(255,255,255,0.25)");
  shine.addColorStop(0.38, "rgba(255,255,255,0.055)");
  shine.addColorStop(1, "rgba(255,255,255,0)");

  ctx.beginPath();
  ctx.arc(cx, cy, sphereRadius, 0, TAU);
  ctx.fillStyle = shine;
  ctx.fill();

  ctx.font = `${Math.max(13, Math.floor(width * 0.018))}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(239,244,255,0.76)";
  ctx.fillText("AUDRALIA · VISIBLE_RENDER_ACTIVE", cx, cy + sphereRadius + Math.max(30, sphereRadius * 0.16));

  ctx.restore();
}

function drawFailure(canvas, message) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  drawBackdrop(ctx, width, height);

  ctx.save();
  ctx.fillStyle = "rgba(255,190,170,0.90)";
  ctx.font = `${Math.max(13, Math.floor(width * 0.02))}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const text = String(message || "UNKNOWN_FAIL").slice(0, 180);
  const lines = text.match(/.{1,42}/g) || [text];

  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, height / 2 + (index - lines.length / 2) * 22);
  });

  ctx.restore();
}

function installResize(canvas, mount, redraw) {
  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(() => redraw());
    observer.observe(mount);
    return observer;
  }

  window.addEventListener("resize", redraw, { passive: true });
  return null;
}

async function bootAudraliaVisibleMount() {
  let mount;
  let canvas;
  let badge;
  let center;

  try {
    mount = prepareMount();
    badge = makeBadge(mount);
    center = makeCenterMessage(mount);
    canvas = prepareCanvas(mount);

    setText(badge, "AUDRALIA MOUNT · INDEX_JS_EXECUTED");
    setText(center, "INDEX_JS_EXECUTED · RENDERER_IMPORT_START");

    fitCanvas(canvas, mount);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    drawBackdrop(ctx, canvas.width, canvas.height);

    setText(badge, "AUDRALIA MOUNT · RENDERER_IMPORTING");
    setText(center, "RENDERER_IMPORT · /assets/audrelia.planet.render.js");

    const api = await loadRenderer();

    setText(badge, "AUDRALIA MOUNT · RENDERER_IMPORT_PASS");
    setText(center, "RENDERER_IMPORT_PASS · TEXTURE_BUILD_START");

    const textureCanvas = buildTexture(api);
    const texture = readTexture(textureCanvas);

    setText(badge, "AUDRALIA MOUNT · TEXTURE_BUILD_PASS");
    setText(center, "TEXTURE_BUILD_PASS · DRAW_START");

    center.style.display = "none";

    let last = 0;
    let frame = 0;

    function render(now = performance.now()) {
      fitCanvas(canvas, mount);

      if (now - last >= 45) {
        last = now;
        drawPlanet(ctx, canvas, texture, now * 0.00006);
      }

      frame = requestAnimationFrame(render);
      window.AudraliaVisibleMountBridge.animationFrame = frame;
    }

    installResize(canvas, mount, () => {
      fitCanvas(canvas, mount);
      drawPlanet(ctx, canvas, texture, performance.now() * 0.00006);
    });

    setText(badge, "AUDRALIA MOUNT · VISIBLE_RENDER_ACTIVE");

    window.AudraliaVisibleMountBridge = {
      status: "VISIBLE_RENDER_ACTIVE",
      tnt: SHOWROOM_GLOBE_INDEX_TNT,
      rendererVersion: api.version || api.tnt || "unknown",
      mount,
      canvas,
      textureWidth: texture.width,
      textureHeight: texture.height,
      redraw: () => drawPlanet(ctx, canvas, texture, performance.now() * 0.00006)
    };

    render();
  } catch (error) {
    const message = error?.message || String(error);

    if (badge) setText(badge, `AUDRALIA MOUNT · IMPORT_OR_RENDER_FAIL`);
    if (center) {
      center.style.display = "block";
      setText(center, `IMPORT_OR_RENDER_FAIL · ${message}`);
    }

    if (canvas && mount) {
      fitCanvas(canvas, mount);
      drawFailure(canvas, message);
    }

    window.AudraliaVisibleMountBridge = {
      status: "IMPORT_OR_RENDER_FAIL",
      tnt: SHOWROOM_GLOBE_INDEX_TNT,
      error: message
    };

    console.error(`[${SHOWROOM_GLOBE_INDEX_TNT}]`, error);
  }
}

function bootWhenReady() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAudraliaVisibleMount, { once: true });
  } else {
    bootAudraliaVisibleMount();
  }
}

bootWhenReady();
