(function () {
  "use strict";

  const TAU = Math.PI * 2;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function fract(v) {
    return v - Math.floor(v);
  }

  function hash(n) {
    return fract(Math.sin(n * 127.1) * 43758.5453123);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function roundedRectPath(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  function createState() {
    return {
      mode: "idle",
      t: 0,
      fragments: [],
      nodes: [],
    };
  }

  function buildNodes(width, height) {
    const cx = width * 0.5;
    const cy = height * 0.23;
    const rx = Math.min(width, height) * 0.22;
    const ry = rx * 0.48;
    const labels = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW"];

    const nodes = [];
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI / 2 + (i / 12) * TAU;
      nodes.push({
        label: labels[i],
        targetX: cx + Math.cos(a) * rx,
        targetY: cy + Math.sin(a) * ry,
        x: cx,
        y: cy,
      });
    }
    return nodes;
  }

  function refreshTargets(state, width, height) {
    if (!state.nodes.length) return;
    const rebuilt = buildNodes(width, height);
    for (let i = 0; i < state.nodes.length && i < rebuilt.length; i++) {
      state.nodes[i].targetX = rebuilt[i].targetX;
      state.nodes[i].targetY = rebuilt[i].targetY;
    }
  }

  function start(state, geo, dispatch, spawnFirework) {
    if (state.mode === "show" || state.mode === "swirl" || state.mode === "shatter") {
      return state;
    }

    const center = { x: geo.centerX, y: geo.centerY };
    const fragments = [];
    const points = geo.pts;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const a = Math.atan2(p.y - center.y, p.x - center.x) + (i % 2 === 0 ? 0.22 : -0.22);
      const speed = 18 + hash(i * 4.7) * 26;
      fragments.push({
        x: p.x,
        y: p.y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        r: 8 + hash(i * 7.1) * 14,
        rot: hash(i * 8.3) * TAU,
        rotVel: (hash(i * 9.1) - 0.5) * 0.22,
      });
    }

    state.fragments = fragments;
    state.nodes = buildNodes(window.innerWidth, window.innerHeight);
    state.mode = "shatter";
    state.t = 0;

    if (typeof dispatch === "function") {
      dispatch("compass:morph", { face: "M", mode: "start" });
    }
    if (typeof spawnFirework === "function") {
      spawnFirework(center.x, center.y, 28, 2.8);
    }

    return state;
  }

  function close(state, dispatch) {
    state.mode = "return";
    state.t = 0;
    if (typeof dispatch === "function") {
      dispatch("compass:morph", { face: "M", mode: "return" });
    }
    return state;
  }

  function update(state, onReturnComplete) {
    const mode = state.mode;
    if (mode === "idle") return state;

    if (mode === "shatter") {
      state.t += 0.075;
      if (state.t >= 1) {
        state.mode = "swirl";
        state.t = 0;
      }
      return state;
    }

    if (mode === "swirl") {
      state.t += 0.055;
      if (state.t >= 1) {
        state.mode = "show";
        state.t = 1;
      }
      return state;
    }

    if (mode === "show") return state;

    if (mode === "return") {
      state.t += 0.065;
      if (state.t >= 1) {
        state.mode = "idle";
        state.t = 0;
        state.fragments = [];
        if (typeof onReturnComplete === "function") {
          onReturnComplete();
        }
      }
    }

    return state;
  }

  function drawFragments(ctx, state, tick) {
    const mode = state.mode;
    if (mode !== "shatter" && mode !== "swirl" && mode !== "return") return;

    const t = clamp(state.t, 0, 1);

    for (let i = 0; i < state.fragments.length; i++) {
      const frag = state.fragments[i];
      let x = frag.x;
      let y = frag.y;
      let alpha = 1;

      if (mode === "shatter") {
        const e = easeOutCubic(t);
        x = frag.x + frag.vx * e;
        y = frag.y + frag.vy * e;
        alpha = 1 - t * 0.15;
      } else if (mode === "swirl") {
        const node = state.nodes[i % state.nodes.length];
        const cx = window.innerWidth * 0.5;
        const cy = window.innerHeight * 0.24;
        const swirlA = (i / state.fragments.length) * TAU + t * 6.2;
        const swirlR = lerp(160, 22, t);
        x = lerp(cx + Math.cos(swirlA) * swirlR, node.targetX, t);
        y = lerp(cy + Math.sin(swirlA) * swirlR * 0.56, node.targetY, t);
        alpha = 0.84;
      } else if (mode === "return") {
        const e = easeInOutCubic(t);
        const node = state.nodes[i % state.nodes.length];
        x = lerp(node.targetX, frag.x, e);
        y = lerp(node.targetY, frag.y, e);
        alpha = 1 - e * 0.15;
      }

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(frag.rot + tick * 0.02 + frag.rotVel * t * 10);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = i % 2 === 0 ? "rgba(255,220,160,0.86)" : "rgba(92,146,255,0.66)";
      ctx.shadowBlur = 14;
      ctx.shadowColor = ctx.fillStyle;
      ctx.beginPath();
      ctx.moveTo(-frag.r * 0.9, 0);
      ctx.lineTo(0, -frag.r * 0.58);
      ctx.lineTo(frag.r, 0);
      ctx.lineTo(0, frag.r * 0.58);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  function drawCompass(ctx, state) {
    if (state.mode !== "show" && state.mode !== "swirl") return;

    const alpha = state.mode === "show" ? 1 : clamp(state.t, 0, 1);

    ctx.save();
    ctx.globalAlpha = 0.9 * alpha;

    for (let i = 0; i < state.nodes.length; i++) {
      const node = state.nodes[i];
      if (state.mode === "swirl") {
        const cx = window.innerWidth * 0.5;
        const cy = window.innerHeight * 0.24;
        const swirlA = (i / state.nodes.length) * TAU + state.t * 6.2;
        const swirlR = lerp(160, 22, state.t);
        node.x = lerp(cx + Math.cos(swirlA) * swirlR, node.targetX, state.t);
        node.y = lerp(cy + Math.sin(swirlA) * swirlR * 0.56, node.targetY, state.t);
      } else {
        node.x = node.targetX;
        node.y = node.targetY;
      }

      ctx.save();
      roundedRectPath(ctx, node.x - 20, node.y - 12, 40, 24, 12);
      ctx.fillStyle = "rgba(18,18,28,0.82)";
      ctx.fill();
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = i % 3 === 0 ? "rgba(255,216,150,0.82)" : "rgba(120,168,255,0.78)";
      ctx.stroke();
      ctx.fillStyle = "rgba(255,246,230,0.96)";
      ctx.font = 'italic 700 10px "Georgia","Times New Roman",serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y + 0.5);
      ctx.restore();
    }

    ctx.globalAlpha = 0.82 * alpha;
    ctx.fillStyle = "rgba(255,245,235,0.94)";
    ctx.font = "700 14px system-ui,Segoe UI,Roboto,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("12-FACE SHOWROOM", window.innerWidth * 0.5, window.innerHeight * 0.11);
    ctx.restore();
  }

  window.OPENWORLD_SHOWROOM_RENDERER = Object.freeze({
    version: "OPENWORLD_SHOWROOM_RENDERER_v1",
    createState,
    buildNodes,
    refreshTargets,
    start,
    close,
    update,
    drawFragments,
    drawCompass,
  });
})();
