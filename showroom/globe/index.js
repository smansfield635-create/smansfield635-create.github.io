const GLOBE_SELECTOR_STATE = Object.freeze({
  contract: "SHOWROOM_GLOBE_THREE_BODY_GATEWAY_SELECTOR_TNT_v1",
  route: "/showroom/globe/",
  role: "globe-system-gateway-selector",
  gatewayAuthority: true,
  visualScaleAuthority: true,
  diamondInstrument: false,
  childRoutes: Object.freeze({
    earth: "/showroom/globe/earth/",
    "h-earth": "/showroom/globe/h-earth/",
    audralia: "/showroom/globe/audralia/"
  }),
  publicReceiptsVisible: false,
  generatedImage: false,
  graphicBox: false,
  heavyRuntimeLoaded: false
});

const BODY_CONFIG = Object.freeze({
  earth: Object.freeze({
    key: "earth",
    title: "Earth",
    subtitle: "Reference Body · public selector runtime",
    openText: "Open Earth",
    href: "/showroom/globe/earth/",
    water: [26, 90, 132],
    deep: [7, 28, 58],
    land: [162, 151, 103],
    land2: [112, 138, 96],
    glow: [139, 200, 255],
    label: "Reference Body"
  }),
  "h-earth": Object.freeze({
    key: "h-earth",
    title: "H-Earth",
    subtitle: "Hybrid Earth · private inspection gateway",
    openText: "Open H-Earth",
    href: "/showroom/globe/h-earth/",
    water: [38, 104, 118],
    deep: [8, 34, 56],
    land: [191, 168, 94],
    land2: [84, 130, 113],
    glow: [167, 243, 198],
    label: "Hybrid Earth"
  }),
  audralia: Object.freeze({
    key: "audralia",
    title: "Audralia",
    subtitle: "Constructed World · public selector runtime",
    openText: "Open Audralia",
    href: "/showroom/globe/audralia/",
    water: [56, 62, 96],
    deep: [12, 16, 42],
    land: [154, 119, 102],
    land2: [88, 72, 105],
    glow: [200, 167, 255],
    label: "Constructed World"
  })
});

const state = {
  body: "earth",
  mode: "auto",
  yaw: 0.24,
  pitch: -0.10,
  velocityYaw: 0,
  velocityPitch: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,
  lastTime: 0,
  phase: 0,
  raf: 0,
  dpr: 1
};

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rgb(values, alpha = 1) {
  return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
}

function mixColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];
}

function seededUnit(index, salt) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1 + 1) % 1;
}

function resizeCanvas(canvas) {
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.floor(box.width * dpr));
  const height = Math.max(520, Math.floor(box.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  state.dpr = dpr;
}

function drawBackground(ctx, width, height, config) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "rgba(3, 10, 22, 0.97)");
  bg.addColorStop(0.50, "rgba(7, 18, 36, 0.98)");
  bg.addColorStop(1, "rgba(2, 7, 16, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(
    width * 0.5,
    height * 0.43,
    width * 0.04,
    width * 0.5,
    height * 0.45,
    width * 0.58
  );
  halo.addColorStop(0, rgb(config.glow, 0.14));
  halo.addColorStop(0.42, rgb(config.glow, 0.075));
  halo.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();

  for (let i = 0; i < 58; i += 1) {
    const x = seededUnit(i, 1) * width;
    const y = seededUnit(i, 2) * height;
    const alpha = 0.08 + seededUnit(i, 3) * 0.22;
    const size = i % 13 === 0 ? 7 : i % 5 === 0 ? 3.5 : 1.3;

    ctx.strokeStyle = `rgba(235,244,255,${alpha})`;
    ctx.lineWidth = Math.max(1, width * 0.001);
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function globePoint(lat, lon, radius) {
  const cosLat = Math.cos(lat);
  return {
    x: Math.cos(lon) * cosLat * radius,
    y: Math.sin(lat) * radius,
    z: Math.sin(lon) * cosLat * radius
  };
}

function rotatePoint(point) {
  const cy = Math.cos(state.yaw);
  const sy = Math.sin(state.yaw);
  const cp = Math.cos(state.pitch);
  const sp = Math.sin(state.pitch);

  const x1 = point.x * cy + point.z * sy;
  const z1 = -point.x * sy + point.z * cy;

  const y2 = point.y * cp - z1 * sp;
  const z2 = point.y * sp + z1 * cp;

  return { x: x1, y: y2, z: z2 };
}

function projectPoint(point, cx, cy, scale) {
  const rotated = rotatePoint(point);
  const camera = 3.5;
  const perspective = camera / (camera - rotated.z * 0.0028);

  return {
    x: cx + rotated.x * perspective,
    y: cy + rotated.y * perspective,
    z: rotated.z,
    p: perspective
  };
}

function landNoise(lat, lon, config, variant) {
  const a = Math.sin(lon * 2.2 + variant * 1.7 + Math.sin(lat * 2.8));
  const b = Math.cos(lon * 3.6 - lat * 2.1 + variant * 0.9);
  const c = Math.sin(lon * 5.1 + lat * 4.0 + variant);
  const d = Math.cos(lon * 1.3 - lat * 6.2);
  return a * 0.42 + b * 0.30 + c * 0.18 + d * 0.10;
}

function isLand(lat, lon, config) {
  if (config.key === "earth") {
    return landNoise(lat, lon, config, 0.4) > 0.23 || landNoise(lat + 0.8, lon - 1.2, config, 1.4) > 0.32;
  }

  if (config.key === "h-earth") {
    return landNoise(lat, lon, config, 1.2) > 0.10 || landNoise(lat - 0.35, lon + 0.7, config, 2.2) > 0.34;
  }

  return landNoise(lat, lon, config, 2.6) > 0.34 || landNoise(lat + 0.6, lon - 1.5, config, 3.2) > 0.46;
}

function drawGlobeSurface(ctx, width, height, config) {
  const radius = Math.min(width * 0.385, height * 0.315);
  const cx = width * 0.5;
  const cy = height * 0.43;

  ctx.save();

  const aura = ctx.createRadialGradient(cx, cy, radius * 0.20, cx, cy, radius * 1.55);
  aura.addColorStop(0, rgb(config.glow, 0.12));
  aura.addColorStop(0.50, rgb(config.glow, 0.055));
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();

  const ocean = ctx.createRadialGradient(
    cx - radius * 0.34,
    cy - radius * 0.38,
    radius * 0.08,
    cx,
    cy,
    radius * 1.14
  );
  ocean.addColorStop(0, rgb(mixColor(config.water, [255, 255, 255], 0.22), 1));
  ocean.addColorStop(0.52, rgb(config.water, 1));
  ocean.addColorStop(1, rgb(config.deep, 1));

  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const latSteps = 42;
  const lonSteps = 72;

  for (let la = 0; la < latSteps; la += 1) {
    const lat1 = -Math.PI / 2 + (la / latSteps) * Math.PI;
    const lat2 = -Math.PI / 2 + ((la + 1) / latSteps) * Math.PI;

    for (let lo = 0; lo < lonSteps; lo += 1) {
      const lon1 = -Math.PI + (lo / lonSteps) * TAU;
      const lon2 = -Math.PI + ((lo + 1) / lonSteps) * TAU;
      const latMid = (lat1 + lat2) * 0.5;
      const lonMid = (lon1 + lon2) * 0.5;

      const center = rotatePoint(globePoint(latMid, lonMid, radius));
      if (center.z < -radius * 0.08) continue;

      const land = isLand(latMid, lonMid, config);
      if (!land) continue;

      const points = [
        projectPoint(globePoint(lat1, lon1, radius), cx, cy, radius),
        projectPoint(globePoint(lat1, lon2, radius), cx, cy, radius),
        projectPoint(globePoint(lat2, lon2, radius), cx, cy, radius),
        projectPoint(globePoint(lat2, lon1, radius), cx, cy, radius)
      ];

      const light = clamp(0.50 + center.z / radius * 0.35 + Math.sin(latMid * 3 + lonMid * 2) * 0.08, 0.22, 0.92);
      const landColor = mixColor(config.land2, config.land, light);

      ctx.fillStyle = rgb(landColor, 0.74);
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.fill();
    }
  }

  drawGlobeGrid(ctx, cx, cy, radius);

  const shade = ctx.createRadialGradient(
    cx - radius * 0.36,
    cy - radius * 0.42,
    radius * 0.10,
    cx + radius * 0.15,
    cy + radius * 0.08,
    radius * 1.22
  );
  shade.addColorStop(0, "rgba(255,255,255,0.18)");
  shade.addColorStop(0.42, "rgba(255,255,255,0.035)");
  shade.addColorStop(0.76, "rgba(0,0,0,0.14)");
  shade.addColorStop(1, "rgba(0,0,0,0.50)");

  ctx.fillStyle = shade;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.save();
  ctx.strokeStyle = rgb(config.glow, 0.28);
  ctx.lineWidth = Math.max(1.2, width * 0.0015);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.stroke();

  const rim = ctx.createRadialGradient(cx, cy, radius * 0.92, cx, cy, radius * 1.10);
  rim.addColorStop(0, "rgba(255,255,255,0)");
  rim.addColorStop(0.66, rgb(config.glow, 0.16));
  rim.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.12, 0, TAU);
  ctx.fill();
  ctx.restore();

  const shadow = ctx.createRadialGradient(cx, cy + radius * 1.08, radius * 0.04, cx, cy + radius * 1.08, radius * 0.48);
  shadow.addColorStop(0, rgb(config.glow, 0.13));
  shadow.addColorStop(0.48, "rgba(82,109,146,0.12)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(cx, cy + radius * 1.08, radius * 0.48, radius * 0.10, 0, 0, TAU);
  ctx.fill();
}

function drawGlobeGrid(ctx, cx, cy, radius) {
  ctx.save();
  ctx.strokeStyle = "rgba(235,244,255,0.055)";
  ctx.lineWidth = Math.max(0.6, radius * 0.003);

  for (let lat = -60; lat <= 60; lat += 30) {
    const r = Math.cos((lat * Math.PI) / 180) * radius;
    const y = Math.sin((lat * Math.PI) / 180) * radius;

    ctx.beginPath();
    ctx.ellipse(cx, cy + y, r, r * 0.14, 0, 0, TAU);
    ctx.stroke();
  }

  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 0.18, radius, (i / 6) * Math.PI, 0, TAU);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGlints(ctx, width, height, config) {
  const radius = Math.min(width * 0.385, height * 0.315);
  const cx = width * 0.5;
  const cy = height * 0.43;

  const points = [
    [cx - radius * 0.58, cy - radius * 0.24, 9],
    [cx + radius * 0.48, cy - radius * 0.16, 7],
    [cx - radius * 0.04, cy - radius * 0.82, 6],
    [cx + radius * 0.12, cy + radius * 0.44, 5]
  ];

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  points.forEach(([x, y, size], index) => {
    const pulse = 0.60 + 0.40 * Math.sin(state.phase * 1.8 + index * PHI);
    ctx.strokeStyle = `rgba(255,255,255,${0.28 * pulse})`;
    ctx.lineWidth = Math.max(1, width * 0.001);
    ctx.beginPath();
    ctx.moveTo(x - size * state.dpr, y);
    ctx.lineTo(x + size * state.dpr, y);
    ctx.moveTo(x, y - size * state.dpr);
    ctx.lineTo(x, y + size * state.dpr);
    ctx.stroke();
  });

  ctx.restore();
}

function render(canvas, ctx) {
  const config = BODY_CONFIG[state.body] || BODY_CONFIG.earth;
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, width, height, config);
  drawStars(ctx, width, height);
  drawGlobeSurface(ctx, width, height, config);
  drawGlints(ctx, width, height, config);
}

function step(time, canvas, ctx) {
  const dt = state.lastTime ? clamp((time - state.lastTime) / 1000, 0, 0.05) : 0;
  state.lastTime = time;

  resizeCanvas(canvas);
  state.phase += dt;

  if (!state.dragging) {
    state.yaw += state.velocityYaw;
    state.pitch = clamp(state.pitch + state.velocityPitch, -0.60, 0.60);

    const damping = state.mode === "soft" ? 0.955 : 0.936;
    const applied = Math.pow(damping, dt * 60);

    state.velocityYaw *= applied;
    state.velocityPitch *= applied;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;

    if (state.mode === "auto" && state.velocityYaw === 0 && state.velocityPitch === 0) {
      state.yaw += dt * 0.050;
    }
  }

  render(canvas, ctx);
  state.raf = requestAnimationFrame((next) => step(next, canvas, ctx));
}

function bindPointer(stage) {
  stage.addEventListener("pointerdown", (event) => {
    const now = performance.now();

    if (now - state.lastTap < 320) resetView();

    state.lastTap = now;
    state.dragging = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    state.velocityYaw = 0;
    state.velocityPitch = 0;

    stage.setPointerCapture?.(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.pointerX;
    const dy = event.clientY - state.pointerY;

    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    state.yaw += dx * 0.0062;
    state.pitch = clamp(state.pitch - dy * 0.0042, -0.60, 0.60);

    state.velocityYaw = dx * 0.0018;
    state.velocityPitch = -dy * 0.0012;
  }, { passive: true });

  const release = (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    stage.releasePointerCapture?.(event.pointerId);
  };

  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("pointerleave", release);
}

function resetView() {
  state.yaw = 0.24;
  state.pitch = -0.10;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
}

function setBody(bodyKey) {
  if (!BODY_CONFIG[bodyKey]) return;

  state.body = bodyKey;
  resetView();

  const config = BODY_CONFIG[bodyKey];

  document.querySelectorAll("[data-body]").forEach((button) => {
    button.setAttribute("aria-selected", button.dataset.body === bodyKey ? "true" : "false");
  });

  const stage = document.querySelector("[data-globe-selector-stage]");
  if (stage) stage.dataset.selectedBody = bodyKey;

  const title = document.querySelector("[data-body-title]");
  if (title) title.textContent = config.title;

  const subtitle = document.querySelector("[data-body-subtitle]");
  if (subtitle) subtitle.textContent = config.subtitle;

  const open = document.querySelector("[data-open-body]");
  if (open) {
    open.href = config.href;
    open.textContent = config.openText;
  }
}

function setMode(mode) {
  state.mode = mode;

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.setAttribute("aria-selected", button.dataset.mode === mode ? "true" : "false");
  });
}

function markRoute() {
  document.documentElement.dataset.globeGatewayStatus = "three-body-selector-active";
  document.documentElement.dataset.globeGatewayAuthority = "true";
  document.documentElement.dataset.visualScaleAuthority = "true";
  document.documentElement.dataset.diamondInstrument = "false";
  document.documentElement.dataset.earthRecord = "false";

  document.body.dataset.globeGatewayStatus = "three-body-selector-active";
  document.body.dataset.globeGatewayAuthority = "true";
  document.body.dataset.visualScaleAuthority = "true";
  document.body.dataset.diamondInstrument = "false";
  document.body.dataset.earthRecord = "false";
}

function protectGatewayIdentity() {
  const title = document.querySelector("title");
  if (title && !/Globe Showcase/i.test(title.textContent || "")) {
    title.textContent = "Globe Showcase · Diamond Gate Bridge";
  }

  const h1 = document.querySelector("h1");
  if (h1 && /Earth is the real-world reference body/i.test(h1.textContent || "")) {
    h1.textContent = "Choose the world body you meant to open.";
  }
}

function bindControls() {
  document.querySelectorAll("[data-body]").forEach((button) => {
    button.addEventListener("click", () => setBody(button.dataset.body));
  });

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  const reset = document.querySelector("[data-reset-view]");
  if (reset) reset.addEventListener("click", resetView);
}

function initGlobeSelector() {
  markRoute();
  protectGatewayIdentity();

  const stage = document.querySelector("[data-globe-selector-stage]");
  const canvas = document.querySelector("[data-globe-selector-canvas]");

  if (!stage || !canvas) return null;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return null;

  bindControls();
  bindPointer(stage);
  setBody("earth");
  setMode("auto");
  resizeCanvas(canvas);
  render(canvas, ctx);

  if (!state.raf) {
    state.raf = requestAnimationFrame((time) => step(time, canvas, ctx));
  }

  window.DGBGlobeSelector = Object.freeze({
    ...GLOBE_SELECTOR_STATE,
    status() {
      return Object.freeze({
        ...GLOBE_SELECTOR_STATE,
        ready: true,
        selectedBody: state.body,
        mode: state.mode,
        gatewayAuthority: true,
        earthStandingInGateway: false,
        diamondMountedHere: false
      });
    }
  });

  return window.DGBGlobeSelector;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGlobeSelector, { once: true });
} else {
  initGlobeSelector();
}

export { GLOBE_SELECTOR_STATE, initGlobeSelector };
export default GLOBE_SELECTOR_STATE;
