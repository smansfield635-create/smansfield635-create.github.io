(() => {
  "use strict";

  const SELECTORS = {
    frame: "#home-compass-frame",
    stage: "#home-hero-stage",
    grid: "#home-orbit-grid",
    tokens: ".compass-token"
  };

  const CONFIG = {
    REDUCE_MOTION_QUERY: "(prefers-reduced-motion: reduce)",
    MOBILE_BREAKPOINT: 760,
    DPR_CAP: 2,

    STAR_COUNT: 120,
    DUST_COUNT: 16,

    DESKTOP_ORBIT_WIDTH: 420,
    DESKTOP_ORBIT_HEIGHT: 258,
    MOBILE_ORBIT_WIDTH: 300,
    MOBILE_ORBIT_HEIGHT: 226,

    ORBIT_SPEED_RAD_MS: 0.00018,
    WOBBLE_PX_X: 8,
    WOBBLE_PX_Y: 6,
    POINTER_PX_X: 12,
    POINTER_PX_Y: 10,

    TOKEN_SCALE_MIN: 0.78,
    TOKEN_SCALE_MAX: 1.04,
    TOKEN_OPACITY_MIN: 0.56,
    TOKEN_OPACITY_MAX: 1.0,

    CENTER_X_RATIO: 0.5,
    CENTER_Y_RATIO: 0.46
  };

  const state = {
    mounted: false,
    reducedMotion: false,
    rafId: 0,
    startTs: 0,
    width: 0,
    height: 0,
    dpr: 1,
    pointerX: 0,
    pointerY: 0,
    pointerActive: false,
    stars: [],
    dust: [],
    tokens: [],
    canvas: null,
    ctx: null
  };

  const frame = document.querySelector(SELECTORS.frame);
  const stage = document.querySelector(SELECTORS.stage);
  const grid = document.querySelector(SELECTORS.grid);
  const tokenElements = Array.from(document.querySelectorAll(SELECTORS.tokens));

  if (!frame || !stage || !grid || tokenElements.length === 0) return;

  const reducedMotionMedia = window.matchMedia(CONFIG.REDUCE_MOTION_QUERY);
  state.reducedMotion = reducedMotionMedia.matches;

  buildStage();
  bindTokens();
  resize();
  seedStars();
  seedDust();
  bindEvents();

  if (state.reducedMotion) {
    applyReducedMotionState();
  } else {
    start();
  }

  function buildStage() {
    stage.innerHTML = `
      <canvas class="home-manor-canvas"></canvas>
      <div class="home-manor-glow glow-a"></div>
      <div class="home-manor-glow glow-b"></div>
      <div class="home-manor-atmosphere"></div>
    `;

    injectRuntimeStyles();

    state.canvas = stage.querySelector(".home-manor-canvas");
    if (!state.canvas) return;

    state.ctx = state.canvas.getContext("2d", { alpha: true });
  }

  function bindTokens() {
    const baseConfig = {
      explore: { baseAngle: -Math.PI / 2, lane: 1.00 },
      products: { baseAngle: -0.22, lane: 1.08 },
      gauges: { baseAngle: 0.82, lane: 0.98 },
      laws: { baseAngle: Math.PI + 0.35, lane: 0.94 },
      vault: { baseAngle: Math.PI / 2, lane: 0.58, lockBelow: true }
    };

    state.tokens = tokenElements.map((el, index) => {
      const key = String(el.dataset.anchor || "").trim().toLowerCase();
      const fallbackAngle = -Math.PI / 2 + index * ((Math.PI * 2) / Math.max(1, tokenElements.length));
      const entry = baseConfig[key] || { baseAngle: fallbackAngle, lane: 1.0, lockBelow: false };
      const diamond = el.querySelector(".token-diamond");
      const labelWrap = el.querySelector(".token-label-wrap");

      el.addEventListener("mouseenter", () => el.classList.add("is-active"));
      el.addEventListener("mouseleave", () => el.classList.remove("is-active"));
      el.addEventListener("focusin", () => el.classList.add("is-active"));
      el.addEventListener("focusout", () => el.classList.remove("is-active"));

      return {
        key,
        el,
        diamond,
        labelWrap,
        baseAngle: entry.baseAngle,
        lane: entry.lane,
        lockBelow: entry.lockBelow === true
      };
    });
  }

  function bindEvents() {
    window.addEventListener("resize", onResize, { passive: true });
    frame.addEventListener("pointermove", onPointerMove, { passive: true });
    frame.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionMedia.addEventListener("change", onReducedMotionChange);
    window.addEventListener("beforeunload", stop, { once: true });
  }

  function onResize() {
    resize();
    seedStars();
    seedDust();
    if (state.reducedMotion) {
      applyReducedMotionState();
    }
  }

  function onPointerMove(event) {
    const rect = frame.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    state.pointerActive = true;
    state.pointerX = clamp((localX / Math.max(1, rect.width)) * 2 - 1, -1, 1);
    state.pointerY = clamp((localY / Math.max(1, rect.height)) * 2 - 1, -1, 1);
  }

  function onPointerLeave() {
    state.pointerActive = false;
    state.pointerX = 0;
    state.pointerY = 0;
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stop();
    } else if (!state.reducedMotion) {
      start();
    }
  }

  function onReducedMotionChange(event) {
    state.reducedMotion = event.matches;
    if (state.reducedMotion) {
      stop();
      applyReducedMotionState();
    } else {
      start();
    }
  }

  function start() {
    if (state.mounted) return;
    state.mounted = true;
    state.startTs = performance.now();
    state.rafId = requestAnimationFrame(tick);
  }

  function stop() {
    state.mounted = false;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
    }
    state.rafId = 0;
  }

  function tick(ts) {
    if (!state.mounted || state.reducedMotion) return;

    const elapsed = ts - state.startTs;
    drawField(elapsed);
    moveShell(elapsed);
    positionTokens(elapsed);

    state.rafId = requestAnimationFrame(tick);
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    state.width = Math.max(320, Math.floor(rect.width));
    state.height = Math.max(360, Math.floor(rect.height));
    state.dpr = Math.min(window.devicePixelRatio || 1, CONFIG.DPR_CAP);

    if (!state.canvas || !state.ctx) return;

    state.canvas.width = Math.floor(state.width * state.dpr);
    state.canvas.height = Math.floor(state.height * state.dpr);
    state.canvas.style.width = `${state.width}px`;
    state.canvas.style.height = `${state.height}px`;
    state.ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function seedStars() {
    state.stars = Array.from({ length: CONFIG.STAR_COUNT }, () => ({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      r: Math.random() * 1.3 + 0.25,
      a: Math.random() * 0.58 + 0.12,
      tw: Math.random() * Math.PI * 2,
      speed: 0.35 + Math.random()
    }));
  }

  function seedDust() {
    const orbitWidth = getOrbitWidth();
    const orbitHeight = getOrbitHeight();

    state.dust = Array.from({ length: CONFIG.DUST_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      rx: 84 + Math.random() * orbitWidth * 0.42,
      ry: 62 + Math.random() * orbitHeight * 0.42,
      size: 1.3 + Math.random() * 2.4,
      speed: 0.14 + Math.random() * 0.36,
      alpha: 0.06 + Math.random() * 0.12
    }));
  }

  function getOrbitWidth() {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT
      ? CONFIG.MOBILE_ORBIT_WIDTH
      : CONFIG.DESKTOP_ORBIT_WIDTH;
  }

  function getOrbitHeight() {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT
      ? CONFIG.MOBILE_ORBIT_HEIGHT
      : CONFIG.DESKTOP_ORBIT_HEIGHT;
  }

  function drawField(elapsed) {
    if (!state.ctx) return;

    const ctx = state.ctx;
    const cx = state.width * CONFIG.CENTER_X_RATIO;
    const cy = state.height * CONFIG.CENTER_Y_RATIO;
    const orbitWidth = getOrbitWidth();
    const orbitHeight = getOrbitHeight();

    ctx.clearRect(0, 0, state.width, state.height);

    const halo = ctx.createRadialGradient(cx, cy, 20, cx, cy, orbitWidth * 0.9);
    halo.addColorStop(0, "rgba(245,225,172,0.18)");
    halo.addColorStop(0.22, "rgba(167,212,255,0.10)");
    halo.addColorStop(0.5, "rgba(114,153,255,0.05)");
    halo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, state.width, state.height);

    state.stars.forEach((star) => {
      const twinkle = 0.58 + Math.sin(elapsed * 0.001 * star.speed + star.tw) * 0.42;
      ctx.beginPath();
      ctx.fillStyle = `rgba(232,242,255,${star.a * twinkle})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(elapsed * 0.00008);

    ctx.strokeStyle = "rgba(180,214,255,0.08)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.ellipse(0, 0, orbitWidth * 0.46, orbitHeight * 0.46, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, orbitWidth * 0.72, orbitHeight * 0.72, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    state.dust.forEach((particle) => {
      const angle = particle.angle + elapsed * 0.00012 * particle.speed;
      const x = cx + Math.cos(angle) * particle.rx;
      const y = cy + Math.sin(angle) * particle.ry;

      ctx.beginPath();
      ctx.fillStyle = `rgba(240,216,154,${particle.alpha})`;
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    drawVaultGlow(ctx, cx, cy, elapsed);
  }

  function drawVaultGlow(ctx, cx, cy, elapsed) {
    const pulse = 0.78 + Math.sin(elapsed * 0.0012) * 0.08;
    const vaultY = cy + 176;
    const glow = ctx.createRadialGradient(cx, vaultY, 0, cx, vaultY, 110);
    glow.addColorStop(0, `rgba(240,216,154,${0.16 * pulse})`);
    glow.addColorStop(0.45, `rgba(240,216,154,${0.08 * pulse})`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, state.width, state.height);
  }

  function moveShell(elapsed) {
    const pointerX = state.pointerActive ? state.pointerX : 0;
    const pointerY = state.pointerActive ? state.pointerY : 0;

    const rotateY = pointerX * 2.8;
    const rotateX = pointerY * -2.2;
    const driftX = pointerX * 4;
    const driftY = pointerY * 3;

    grid.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function positionTokens(elapsed) {
    const cx = state.width * CONFIG.CENTER_X_RATIO;
    const cy = state.height * CONFIG.CENTER_Y_RATIO;
    const orbitWidth = getOrbitWidth();
    const orbitHeight = getOrbitHeight();

    const pointerX = state.pointerActive ? state.pointerX : 0;
    const pointerY = state.pointerActive ? state.pointerY : 0;

    state.tokens.forEach((token) => {
      let angle = token.baseAngle;

      if (!token.lockBelow) {
        angle += elapsed * CONFIG.ORBIT_SPEED_RAD_MS;
        angle += Math.sin(elapsed * 0.00055 + token.baseAngle * 2) * 0.05;
      }

      const wobbleX = !token.lockBelow
        ? Math.sin(elapsed * 0.0011 + token.baseAngle) * CONFIG.WOBBLE_PX_X
        : 0;

      const wobbleY = !token.lockBelow
        ? Math.cos(elapsed * 0.0010 + token.baseAngle) * CONFIG.WOBBLE_PX_Y
        : 0;

      const px = !token.lockBelow
        ? cx + Math.cos(angle) * (orbitWidth * 0.5 * token.lane) + wobbleX + pointerX * CONFIG.POINTER_PX_X
        : cx + pointerX * (CONFIG.POINTER_PX_X * 0.2);

      const py = !token.lockBelow
        ? cy + Math.sin(angle) * (orbitHeight * 0.5 * token.lane) + wobbleY + pointerY * CONFIG.POINTER_PX_Y
        : cy + orbitHeight * 0.68 + 76 + pointerY * (CONFIG.POINTER_PX_Y * 0.15);

      const depthRaw = !token.lockBelow
        ? (Math.sin(angle) + 1) / 2
        : 0.18;

      const scale = lerp(CONFIG.TOKEN_SCALE_MIN, CONFIG.TOKEN_SCALE_MAX, depthRaw);
      const opacity = lerp(CONFIG.TOKEN_OPACITY_MIN, CONFIG.TOKEN_OPACITY_MAX, depthRaw);

      token.el.style.transform = `translate3d(${(px - 48).toFixed(2)}px, ${(py - 48).toFixed(2)}px, 0)`;
      token.el.style.opacity = opacity.toFixed(3);
      token.el.style.zIndex = String(token.lockBelow ? 4 : Math.floor(10 + depthRaw * 12));

      if (token.diamond) {
        const tilt = !token.lockBelow ? Math.cos(angle) * 8 : 0;
        const spin = !token.lockBelow ? elapsed * 0.012 : 0;
        token.diamond.style.transform = `translateZ(0) rotateX(${tilt * 0.35}deg) rotateY(${tilt * 0.45}deg) rotateZ(${spin}deg) scale(${scale.toFixed(3)})`;
      }

      if (token.labelWrap) {
        token.labelWrap.style.transform = `translateZ(12px) rotateZ(${token.lockBelow ? 0 : spinCompensation(elapsed).toFixed(2)}deg)`;
      }
    });
  }

  function applyReducedMotionState() {
    drawField(0);
    grid.style.transform = "translate3d(0,0,0)";
    positionTokens(0);
  }

  function injectRuntimeStyles() {
    if (document.getElementById("richies-manor-runtime-style")) return;

    const style = document.createElement("style");
    style.id = "richies-manor-runtime-style";
    style.textContent = `
      .home-manor-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
      }

      .home-manor-glow,
      .home-manor-atmosphere {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .home-manor-glow.glow-a {
        background:
          radial-gradient(circle at 50% 36%, rgba(240,216,154,0.10), transparent 28%),
          radial-gradient(circle at 50% 66%, rgba(143,200,255,0.06), transparent 34%);
        filter: blur(28px);
        opacity: 0.9;
      }

      .home-manor-glow.glow-b {
        background:
          radial-gradient(circle at 26% 26%, rgba(143,200,255,0.06), transparent 18%),
          radial-gradient(circle at 76% 22%, rgba(143,200,255,0.05), transparent 18%);
        filter: blur(34px);
        opacity: 0.82;
      }

      .home-manor-atmosphere {
        background:
          linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)),
          linear-gradient(180deg, rgba(7,15,28,0), rgba(7,15,28,0.10));
      }
    `;
    document.head.appendChild(style);
  }

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function spinCompensation(elapsed) {
    return Math.sin(elapsed * 0.0005) * -1.5;
  }
})();
