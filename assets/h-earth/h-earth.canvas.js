import {
  createHEarthHydrationAtlas,
  FIBONACCI_RUNTIME_SEQUENCE,
  H_EARTH_HYDRATION_CONTRACT
} from "./h-earth.hydration.js";

const CANVAS_CONTRACT = "H_EARTH_SPHERE_PROJECTION_AND_HYDRATION_CLIP_RENEWAL_TNT_v1";
const TAU = Math.PI * 2;
const POINTER_RAD_PER_PIXEL = FIBONACCI_RUNTIME_SEQUENCE[4] / (FIBONACCI_RUNTIME_SEQUENCE[14] * 1.2);
const MAX_DEVICE_PIXEL_RATIO = 2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, value) {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function wrap01(value) {
  return ((value % 1) + 1) % 1;
}

function normalize3(x, y, z) {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

function rotateCameraToWorld(vector, rx, ry) {
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);

  const y1 = vector[1] * cosX - vector[2] * sinX;
  const z1 = vector[1] * sinX + vector[2] * cosX;
  const x1 = vector[0];

  return [
    x1 * cosY + z1 * sinY,
    y1,
    -x1 * sinY + z1 * cosY
  ];
}

function vectorToUv(vector) {
  return [
    wrap01(Math.atan2(vector[2], vector[0]) / TAU + 0.5),
    clamp(0.5 - Math.asin(clamp(vector[1], -1, 1)) / Math.PI, 0, 1)
  ];
}

function sampleAtlas(atlas, u, v) {
  const x = wrap01(u) * atlas.width;
  const y = clamp(v, 0, 0.999999) * (atlas.height - 1);
  const x0 = Math.floor(x) % atlas.width;
  const x1 = (x0 + 1) % atlas.width;
  const y0 = clamp(Math.floor(y), 0, atlas.height - 1);
  const y1 = clamp(y0 + 1, 0, atlas.height - 1);
  const tx = x - Math.floor(x);
  const ty = y - y0;

  const i00 = (y0 * atlas.width + x0) * 4;
  const i10 = (y0 * atlas.width + x1) * 4;
  const i01 = (y1 * atlas.width + x0) * 4;
  const i11 = (y1 * atlas.width + x1) * 4;

  const r0 = mix(atlas.data[i00], atlas.data[i10], tx);
  const g0 = mix(atlas.data[i00 + 1], atlas.data[i10 + 1], tx);
  const b0 = mix(atlas.data[i00 + 2], atlas.data[i10 + 2], tx);
  const r1 = mix(atlas.data[i01], atlas.data[i11], tx);
  const g1 = mix(atlas.data[i01 + 1], atlas.data[i11 + 1], tx);
  const b1 = mix(atlas.data[i01 + 2], atlas.data[i11 + 2], tx);

  return [mix(r0, r1, ty), mix(g0, g1, ty), mix(b0, b1, ty)];
}

function inferWorld() {
  const path = typeof location === "undefined" ? "" : location.pathname.toLowerCase();
  if (path.includes("/earth/") && !path.includes("/h-earth/")) return "earth";
  return "h-earth";
}

function titleForWorld(world) {
  return world === "earth" ? "Earth" : "H-Earth";
}

function injectStyles() {
  if (document.getElementById("h-earth-sphere-projection-renewal-style")) return;

  const style = document.createElement("style");
  style.id = "h-earth-sphere-projection-renewal-style";
  style.textContent = `
    .hearth-sphere-renewal {
      --hearth-gold: #f4cf83;
      --hearth-mint: #a7f3c6;
      --hearth-panel: rgba(4, 10, 21, 0.78);
      width: min(100%, 680px);
      margin: 0 auto;
      border: 1px solid rgba(244, 207, 131, 0.18);
      border-radius: 28px;
      padding: clamp(18px, 4vw, 28px);
      background:
        radial-gradient(circle at 50% 38%, rgba(77, 126, 167, 0.18), transparent 42%),
        linear-gradient(180deg, rgba(7, 15, 31, 0.92), rgba(3, 9, 18, 0.96));
      box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42), inset 0 0 0 1px rgba(255, 255, 255, 0.035);
      color: rgba(239, 244, 255, 0.92);
      box-sizing: border-box;
      overflow: hidden;
    }

    .hearth-sphere-renewal *,
    .hearth-sphere-renewal *::before,
    .hearth-sphere-renewal *::after {
      box-sizing: border-box;
    }

    .hearth-sphere-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 16px;
    }

    .hearth-sphere-button,
    .hearth-sphere-tab,
    .hearth-sphere-open {
      appearance: none;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.035);
      color: rgba(239, 244, 255, 0.84);
      min-height: 42px;
      padding: 0 18px;
      font: 800 0.78rem/1.1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      touch-action: manipulation;
    }

    .hearth-sphere-button.is-active,
    .hearth-sphere-tab.is-active,
    .hearth-sphere-open {
      border-color: rgba(167, 243, 198, 0.4);
      background: linear-gradient(135deg, rgba(167, 243, 198, 0.96), rgba(101, 211, 166, 0.9));
      color: #06101c;
    }

    .hearth-sphere-label {
      text-align: center;
      margin: 0 0 10px;
      color: var(--hearth-gold);
      font: 900 clamp(1.14rem, 4vw, 1.55rem)/1.05 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: -0.03em;
    }

    .hearth-sphere-subtitle {
      text-align: center;
      margin: 0 0 14px;
      color: rgba(239, 244, 255, 0.58);
      font: 750 clamp(0.74rem, 2.8vw, 0.92rem)/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0.02em;
    }

    .hearth-sphere-frame {
      position: relative;
      width: min(100%, 560px);
      aspect-ratio: 1 / 1;
      margin: 0 auto;
      border-radius: 999px;
      overflow: visible;
      contain: layout size paint;
      isolation: isolate;
    }

    .hearth-sphere-frame::before {
      content: "";
      position: absolute;
      inset: 7%;
      border-radius: 999px;
      background: radial-gradient(circle at 42% 35%, rgba(145, 201, 235, 0.22), rgba(33, 69, 107, 0.15) 42%, transparent 69%);
      filter: blur(16px);
      z-index: 0;
      pointer-events: none;
    }

    .hearth-sphere-canvas {
      position: relative;
      z-index: 1;
      display: block;
      width: 100% !important;
      height: 100% !important;
      max-width: 100%;
      aspect-ratio: 1 / 1 !important;
      border-radius: 999px;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      background: transparent;
    }

    .hearth-sphere-tabs {
      width: min(100%, 560px);
      margin: 18px auto 0;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .hearth-sphere-tab {
      border-radius: 0;
      min-height: 48px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: clamp(0.82rem, 3vw, 1rem);
      letter-spacing: 0.02em;
      text-transform: none;
    }

    .hearth-sphere-status {
      width: min(100%, 560px);
      margin: 12px auto 0;
      border: 1px solid rgba(167, 243, 198, 0.18);
      background: rgba(8, 42, 37, 0.48);
      color: rgba(167, 243, 198, 0.98);
      padding: 12px 16px;
      font: 850 clamp(0.84rem, 3.4vw, 1rem)/1.3 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0.03em;
    }

    @media (max-width: 520px) {
      .hearth-sphere-renewal {
        border-radius: 22px;
        padding: 14px;
      }

      .hearth-sphere-toolbar {
        gap: 8px;
      }

      .hearth-sphere-button {
        min-height: 40px;
        padding: 0 14px;
      }

      .hearth-sphere-tabs {
        gap: 6px;
      }
    }
  `;
  document.head.appendChild(style);
}

class HEarthSphereRenderer {
  constructor(mount, options = {}) {
    this.mount = mount;
    this.world = options.world || mount?.dataset?.world || inferWorld();
    this.state = {
      auto: true,
      detailStable: true,
      glideSoft: true,
      rotationX: -0.12,
      rotationY: 0.38,
      velocityX: 0,
      velocityY: 0,
      pointerActive: false,
      lastPointerX: 0,
      lastPointerY: 0,
      lastTime: 0,
      destroyed: false
    };

    this.atlas = createHEarthHydrationAtlas({
      world: this.world,
      width: FIBONACCI_RUNTIME_SEQUENCE[13],
      height: FIBONACCI_RUNTIME_SEQUENCE[12]
    });

    this.raf = 0;
    this.canvas = null;
    this.context = null;
    this.frame = null;
    this.statusNode = null;
    this.bufferCanvas = document.createElement("canvas");
    this.bufferContext = this.bufferCanvas.getContext("2d", { alpha: true, willReadFrequently: false });
    this.bufferSize = 0;
    this.bufferImage = null;
  }

  boot() {
    injectStyles();
    this.mount.dataset.hEarthCanvasContract = CANVAS_CONTRACT;
    this.mount.dataset.hEarthHydrationContract = H_EARTH_HYDRATION_CONTRACT;
    this.mount.dataset.publicMapConstruction = "false";
    this.mount.dataset.shapeAuthority = "canvas-sphere-projection";
    this.mount.dataset.materialAuthority = "hydration-child-asset";

    this.mount.innerHTML = this.template();
    this.frame = this.mount.querySelector("[data-hearth-sphere-frame]");
    this.canvas = this.mount.querySelector("[data-hearth-sphere-canvas]");
    this.context = this.canvas.getContext("2d", { alpha: true, desynchronized: true });
    this.statusNode = this.mount.querySelector("[data-hearth-sphere-status]");

    this.bindControls();
    this.bindPointer();
    this.resize();
    this.updateStatus();
    this.raf = requestAnimationFrame((time) => this.loop(time));
    return this;
  }

  template() {
    const title = titleForWorld(this.world);
    const path = typeof location === "undefined" ? "" : location.pathname.toLowerCase();
    const earthActive = path.includes("/earth/") && !path.includes("/h-earth/");
    const hEarthActive = !earthActive && (path.includes("/h-earth/") || this.world === "h-earth");
    const audraliaActive = path.includes("/audralia/");

    return `
      <section class="hearth-sphere-renewal" aria-label="${title} hydrated spherical render">
        <div class="hearth-sphere-toolbar" aria-label="Render controls">
          <button class="hearth-sphere-button is-active" type="button" data-hearth-control="auto">Auto</button>
          <button class="hearth-sphere-button is-active" type="button" data-hearth-control="detail">Detail: stable</button>
          <button class="hearth-sphere-button is-active" type="button" data-hearth-control="glide">Glide: soft</button>
          <button class="hearth-sphere-button" type="button" data-hearth-control="reset">Reset</button>
        </div>

        <h2 class="hearth-sphere-label">${title}</h2>
        <p class="hearth-sphere-subtitle">Hydrated object · circular projection · Fibonacci runtime</p>

        <div class="hearth-sphere-frame" data-hearth-sphere-frame>
          <canvas class="hearth-sphere-canvas" data-hearth-sphere-canvas aria-label="${title} interactive hydrated globe"></canvas>
        </div>

        <nav class="hearth-sphere-tabs" aria-label="Planet inspection routes">
          <a class="hearth-sphere-tab ${earthActive ? "is-active" : ""}" href="/showroom/globe/earth/">Earth</a>
          <a class="hearth-sphere-tab ${hEarthActive ? "is-active" : ""}" href="/showroom/globe/h-earth/">H-Earth</a>
          <a class="hearth-sphere-tab ${audraliaActive ? "is-active" : ""}" href="/showroom/globe/audralia/">Audralia</a>
        </nav>

        <div class="hearth-sphere-status" data-hearth-sphere-status>Drag to inspect · settling · water clipped inside sphere</div>
      </section>
    `;
  }

  bindControls() {
    this.mount.querySelectorAll("[data-hearth-control]").forEach((button) => {
      button.addEventListener("click", () => {
        const control = button.getAttribute("data-hearth-control");
        if (control === "auto") this.state.auto = !this.state.auto;
        if (control === "detail") this.state.detailStable = !this.state.detailStable;
        if (control === "glide") this.state.glideSoft = !this.state.glideSoft;
        if (control === "reset") this.reset();
        this.syncButtons();
        this.updateStatus();
      });
    });
  }

  syncButtons() {
    const auto = this.mount.querySelector('[data-hearth-control="auto"]');
    const detail = this.mount.querySelector('[data-hearth-control="detail"]');
    const glide = this.mount.querySelector('[data-hearth-control="glide"]');

    if (auto) {
      auto.classList.toggle("is-active", this.state.auto);
      auto.textContent = this.state.auto ? "Auto" : "Manual";
    }

    if (detail) {
      detail.classList.toggle("is-active", this.state.detailStable);
      detail.textContent = this.state.detailStable ? "Detail: stable" : "Detail: fast";
    }

    if (glide) {
      glide.classList.toggle("is-active", this.state.glideSoft);
      glide.textContent = this.state.glideSoft ? "Glide: soft" : "Glide: tight";
    }
  }

  bindPointer() {
    this.canvas.addEventListener("pointerdown", (event) => {
      this.state.pointerActive = true;
      this.state.lastPointerX = event.clientX;
      this.state.lastPointerY = event.clientY;
      this.canvas.setPointerCapture?.(event.pointerId);
    });

    this.canvas.addEventListener("pointermove", (event) => {
      if (!this.state.pointerActive) return;
      const dx = event.clientX - this.state.lastPointerX;
      const dy = event.clientY - this.state.lastPointerY;
      this.state.lastPointerX = event.clientX;
      this.state.lastPointerY = event.clientY;
      this.state.rotationY += dx * POINTER_RAD_PER_PIXEL;
      this.state.rotationX = clamp(this.state.rotationX + dy * POINTER_RAD_PER_PIXEL, -1.24, 1.24);
      this.state.velocityY = dx * POINTER_RAD_PER_PIXEL * 0.62;
      this.state.velocityX = dy * POINTER_RAD_PER_PIXEL * 0.42;
      this.updateStatus("dragging · sphere locked · water active");
    }, { passive: true });

    const release = (event) => {
      if (!this.state.pointerActive) return;
      this.state.pointerActive = false;
      this.canvas.releasePointerCapture?.(event.pointerId);
      this.updateStatus();
    };

    this.canvas.addEventListener("pointerup", release);
    this.canvas.addEventListener("pointercancel", release);
    this.canvas.addEventListener("pointerleave", release);
  }

  reset() {
    this.state.rotationX = -0.12;
    this.state.rotationY = 0.38;
    this.state.velocityX = 0;
    this.state.velocityY = 0;
    this.state.auto = true;
  }

  resize() {
    const box = this.frame.getBoundingClientRect();
    const cssSize = Math.max(240, Math.min(560, Math.floor(box.width || this.frame.clientWidth || 360)));
    const dpr = Math.min(MAX_DEVICE_PIXEL_RATIO, window.devicePixelRatio || 1);
    const pixelSize = Math.max(240, Math.floor(cssSize * dpr));

    this.canvas.style.width = `${cssSize}px`;
    this.canvas.style.height = `${cssSize}px`;

    if (this.canvas.width !== pixelSize || this.canvas.height !== pixelSize) {
      this.canvas.width = pixelSize;
      this.canvas.height = pixelSize;
    }
  }

  loop(time) {
    if (this.state.destroyed) return;
    const dt = this.state.lastTime ? clamp((time - this.state.lastTime) / 1000, 0, 0.05) : 0;
    this.state.lastTime = time;
    this.step(dt);
    this.draw();
    this.raf = requestAnimationFrame((next) => this.loop(next));
  }

  step(dt) {
    if (this.state.auto && !this.state.pointerActive) {
      const autoSpeed = TAU / (FIBONACCI_RUNTIME_SEQUENCE[11] * 1.18);
      this.state.rotationY += autoSpeed * dt;
    }

    if (!this.state.pointerActive) {
      this.state.rotationY += this.state.velocityY;
      this.state.rotationX = clamp(this.state.rotationX + this.state.velocityX, -1.24, 1.24);
      const frameDamping = this.state.glideSoft
        ? 1 - 1 / FIBONACCI_RUNTIME_SEQUENCE[9]
        : 1 - 1 / FIBONACCI_RUNTIME_SEQUENCE[7];
      const damping = Math.pow(frameDamping, dt * 60);
      this.state.velocityY *= damping;
      this.state.velocityX *= damping;
    }
  }

  draw() {
    this.resize();
    const ctx = this.context;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const size = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const radius = size * 0.415;

    ctx.clearRect(0, 0, width, height);
    this.drawSpace(ctx, width, height, cx, cy, radius);
    this.drawSphere(ctx, cx, cy, radius);
    this.drawAtmosphere(ctx, cx, cy, radius);
  }

  drawSpace(ctx, width, height, cx, cy, radius) {
    const bg = ctx.createRadialGradient(cx * 0.96, cy * 0.78, radius * 0.2, cx, cy, radius * 1.72);
    bg.addColorStop(0, "rgba(29, 67, 103, 0.24)");
    bg.addColorStop(0.52, "rgba(6, 15, 31, 0.36)");
    bg.addColorStop(1, "rgba(1, 5, 13, 0)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.24;
    ctx.strokeStyle = "rgba(154, 202, 232, 0.16)";
    ctx.lineWidth = Math.max(1, width * 0.0012);
    ctx.beginPath();
    ctx.ellipse(cx, cy + radius * 0.04, radius * 1.33, radius * 0.22, -0.13, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  drawSphere(ctx, cx, cy, radius) {
    const moving = Math.abs(this.state.velocityX) + Math.abs(this.state.velocityY) > 0.006 || this.state.pointerActive;
    const renderSize = this.state.detailStable && !moving
      ? FIBONACCI_RUNTIME_SEQUENCE[13]
      : FIBONACCI_RUNTIME_SEQUENCE[12];

    this.renderSphereBuffer(renderSize);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.clip();
    ctx.drawImage(this.bufferCanvas, cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();
  }

  renderSphereBuffer(size) {
    if (this.bufferSize !== size) {
      this.bufferSize = size;
      this.bufferCanvas.width = size;
      this.bufferCanvas.height = size;
      this.bufferImage = this.bufferContext.createImageData(size, size);
    }

    const data = this.bufferImage.data;
    const center = (size - 1) / 2;
    const radius = size * 0.485;
    const radiusInv = 1 / radius;
    const light = normalize3(-0.42, -0.28, 0.86);
    const fill = [7, 17, 31];

    for (let y = 0; y < size; y += 1) {
      const ny = (y - center) * radiusInv;
      for (let x = 0; x < size; x += 1) {
        const nx = (x - center) * radiusInv;
        const r2 = nx * nx + ny * ny;
        const index = (y * size + x) * 4;

        if (r2 > 1) {
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
          data[index + 3] = 0;
          continue;
        }

        const nz = Math.sqrt(Math.max(0, 1 - r2));
        const normal = normalize3(nx, ny, nz);
        const world = rotateCameraToWorld(normal, this.state.rotationX, this.state.rotationY);
        const uv = vectorToUv(world);
        const base = sampleAtlas(this.atlas, uv[0], uv[1]);

        const ndotl = clamp(normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2], 0, 1);
        const limb = Math.pow(clamp(1 - nz, 0, 1), 1.65);
        const shade = clamp(0.34 + ndotl * 0.82 - limb * 0.18, 0.12, 1.08);
        const edgeFade = smoothstep(0.0, 0.035, 1 - r2);
        const rim = smoothstep(0.42, 1.0, limb);

        let red = base[0] * shade;
        let green = base[1] * shade;
        let blue = base[2] * shade;

        red = mix(red, 114, rim * 0.2);
        green = mix(green, 170, rim * 0.22);
        blue = mix(blue, 202, rim * 0.26);

        const night = smoothstep(0.0, 0.24, ndotl);
        red = mix(fill[0], red, night);
        green = mix(fill[1], green, night);
        blue = mix(fill[2], blue, night);

        data[index] = clamp(Math.round(red), 0, 255);
        data[index + 1] = clamp(Math.round(green), 0, 255);
        data[index + 2] = clamp(Math.round(blue), 0, 255);
        data[index + 3] = clamp(Math.round(255 * edgeFade), 0, 255);
      }
    }

    this.bufferContext.putImageData(this.bufferImage, 0, 0);
  }

  drawAtmosphere(ctx, cx, cy, radius) {
    ctx.save();
    const halo = ctx.createRadialGradient(cx - radius * 0.18, cy - radius * 0.22, radius * 0.35, cx, cy, radius * 1.08);
    halo.addColorStop(0, "rgba(210, 233, 241, 0.10)");
    halo.addColorStop(0.58, "rgba(106, 169, 204, 0.10)");
    halo.addColorStop(0.86, "rgba(77, 133, 177, 0.18)");
    halo.addColorStop(1, "rgba(77, 133, 177, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.05, 0, TAU);
    ctx.fill();

    ctx.lineWidth = Math.max(1, radius * 0.018);
    ctx.strokeStyle = "rgba(164, 209, 232, 0.28)";
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.002, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  updateStatus(message) {
    if (!this.statusNode) return;
    this.statusNode.textContent = message || "Drag to inspect · settling · water clipped inside sphere";
  }

  status() {
    return Object.freeze({
      contract: CANVAS_CONTRACT,
      hydrationContract: H_EARTH_HYDRATION_CONTRACT,
      world: this.world,
      circularProjection: true,
      publicMapConstruction: false,
      atlas: this.atlas.stats,
      auto: this.state.auto,
      detailStable: this.state.detailStable,
      glideSoft: this.state.glideSoft
    });
  }

  destroy() {
    this.state.destroyed = true;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
}

function findMount() {
  const selectors = [
    "[data-h-earth-canvas-mount]",
    "[data-hearth-canvas-mount]",
    "[data-planet-canvas-mount='h-earth']",
    "#h-earth-canvas-mount",
    "#hearth-canvas-mount",
    "#h-earth-render",
    "#h-earth-stage"
  ];

  for (const selector of selectors) {
    const match = document.querySelector(selector);
    if (match) return match;
  }

  const path = typeof location === "undefined" ? "" : location.pathname.toLowerCase();
  const bodyRoute = document.body?.dataset?.route?.toLowerCase?.() || "";
  const routeAllowsFallback = path.includes("/showroom/globe/") || bodyRoute.includes("/showroom/globe/");
  if (!routeAllowsFallback) return null;

  const main = document.querySelector("#h-earth-main") || document.querySelector("main[data-route='/showroom/globe/h-earth/']") || document.querySelector("main");
  if (!main) return null;

  let generated = main.querySelector("[data-generated-h-earth-canvas-mount]");
  if (!generated) {
    generated = document.createElement("section");
    generated.setAttribute("data-generated-h-earth-canvas-mount", "true");
    generated.setAttribute("aria-label", "H-Earth spherical canvas mount");
    main.appendChild(generated);
  }
  return generated;
}

export function initHEarthCanvas(target, options = {}) {
  const mount = typeof target === "string" ? document.querySelector(target) : target || findMount();
  if (!mount) return null;

  if (mount.__hEarthSphereRenderer) {
    return mount.__hEarthSphereRenderer;
  }

  const renderer = new HEarthSphereRenderer(mount, options).boot();
  mount.__hEarthSphereRenderer = renderer;
  return renderer;
}

export function renderHEarthCanvas(target, options = {}) {
  return initHEarthCanvas(target, options);
}

export function getHEarthCanvasStatus(target) {
  const mount = typeof target === "string" ? document.querySelector(target) : target || findMount();
  return mount?.__hEarthSphereRenderer?.status?.() || Object.freeze({
    contract: CANVAS_CONTRACT,
    hydrationContract: H_EARTH_HYDRATION_CONTRACT,
    active: false
  });
}

const api = Object.freeze({
  contract: CANVAS_CONTRACT,
  init: initHEarthCanvas,
  render: renderHEarthCanvas,
  status: getHEarthCanvasStatus
});

if (typeof window !== "undefined") {
  window.DGBHEarthCanvas = api;
  window.HEarthCanvas = api;
  window.H_EARTH_SPHERE_PROJECTION_AND_HYDRATION_CLIP_RENEWAL_TNT_v1 = api;

  const boot = () => {
    const mount = findMount();
    if (mount && !mount.__hEarthSphereRenderer) initHEarthCanvas(mount);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
}

export default api;
