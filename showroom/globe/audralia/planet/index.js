// TARGET FILE: /showroom/globe/audralia/planet/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_G2_PLANET_SITE_ALIGNMENT_TABBED_GEM_FIRST_CONTROLLER_TNT_v1
//
// Purpose:
// - Preserve protected Audralia globe.
// - Support gem-first navigation.
// - Support Platform / Engineering tabs.
// - Preserve Body / Surface / Terrain / Lattice / Receipt mode controls.
// - Compress engineering metadata into tabbed panes.
// - No generated image. No GraphicBox. No active water. No final visual pass claim.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_PLANET_SITE_ALIGNMENT_TABBED_GEM_FIRST_CONTROLLER_TNT_v1";
  const HTML_CONTRACT = "AUDRALIA_G2_PLANET_SITE_ALIGNMENT_TABBED_GEM_FIRST_HTML_TNT_v1";
  const TAU = Math.PI * 2;

  const MODES = Object.freeze({
    body: {
      title: "Body",
      status: "DRY PLANET · WORLD BODY",
      platform:
        "Audralia now reads as a world body first. The visitor sees a protected dry globe before the construction proof appears.",
      engineering:
        "Body mode preserves the renderer socket and expresses dry spherical mass. Child truth remains held."
    },
    surface: {
      title: "Surface",
      status: "DRY MATERIAL · SURFACE HELD",
      platform:
        "Surface mode makes the globe feel like a material world skin without turning it into a gemstone or proof plate.",
      engineering:
        "Surface expression remains route-level only. Canonical surface child activation is false."
    },
    terrain: {
      title: "Terrain",
      status: "RELIEF PRESSURE · TERRAIN HELD",
      platform:
        "Terrain mode suggests carved pressure, ridges, basins, and mass without claiming final physical terrain.",
      engineering:
        "Terrain child truth remains held. Renderer-level relief is a visible inspection layer only."
    },
    lattice: {
      title: "Lattice",
      status: "16 × 16 · 256 SEATS",
      platform:
        "Lattice mode shows that Audralia has a coordinate field underneath the globe, but the structure does not replace the planet.",
      engineering:
        "The lattice is a proof overlay: 16 coordinate identities × 16 version identities = 256 expression states."
    },
    receipt: {
      title: "Receipt",
      status: "HANDOFF · NO FALSE PASS",
      platform:
        "Receipt mode shows what is defined, what is held, and what hands off next without burying the visitor in scaffolding.",
      engineering:
        "Receipt state proves route alignment. It does not claim final visual pass, hydration, surface child, terrain child, or datum child activation."
    }
  });

  const RECEIPT = Object.freeze({
    contract: CONTRACT,
    htmlContract: HTML_CONTRACT,
    route: "/showroom/globe/audralia/planet/",
    protectedGlobe: true,
    gemFirstNavigation: true,
    platformEngineeringTabs: true,
    metadataCompressed: true,
    activeWater: false,
    hydrationActive: false,
    terrainChildActive: false,
    surfaceChildActive: false,
    datumChildActive: false,
    generatedImage: false,
    graphicBox: false,
    finalVisualPass: false
  });

  const state = {
    mode: "body",
    canvas: null,
    ctx: null,
    stage: null,
    dpr: 1,
    width: 1,
    height: 1,
    yaw: -0.42,
    pitch: -0.05,
    velocity: 0,
    dragging: false,
    pointerX: 0,
    pointerY: 0,
    lastFrame: 0,
    time: 0,
    raf: 0,
    terrain: [],
    nodes: [],
    initialized: false
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
  }

  function hash01(seed) {
    const x = Math.sin(seed * 127.1) * 43758.5453123;
    return x - Math.floor(x);
  }

  function makeTerrain() {
    const terrain = [];
    const nodes = [];

    for (let i = 0; i < 42; i += 1) {
      const lon = hash01(i + 1) * TAU - Math.PI;
      const lat = (hash01(i + 41) - 0.5) * Math.PI * 0.82;
      const size = 0.07 + hash01(i + 81) * 0.15;
      const tone = hash01(i + 121);
      terrain.push({ lon, lat, size, tone });
    }

    for (let y = 0; y < 16; y += 1) {
      for (let x = 0; x < 16; x += 1) {
        const lon = (x / 16) * TAU - Math.PI;
        const lat = ((y + 0.5) / 16 - 0.5) * Math.PI * 0.92;
        nodes.push({
          x,
          y,
          lon,
          lat,
          colorIndex: (x + y * 3) % 32
        });
      }
    }

    state.terrain = terrain;
    state.nodes = nodes;
  }

  function resizeCanvas() {
    if (!state.canvas || !state.ctx || !state.stage) return;

    const rect = state.stage.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(320, Math.floor((rect.width || 640) * dpr));
    const height = Math.max(420, Math.floor((rect.height || 640) * dpr));

    if (state.canvas.width !== width) state.canvas.width = width;
    if (state.canvas.height !== height) state.canvas.height = height;

    state.dpr = dpr;
    state.width = width;
    state.height = height;
  }

  function project(lon, lat, radius, cx, cy) {
    const rotatedLon = lon + state.yaw;
    const cosLat = Math.cos(lat);
    const x3 = Math.sin(rotatedLon) * cosLat;
    const y3 = Math.sin(lat);
    const z3 = Math.cos(rotatedLon) * cosLat;

    return {
      x: cx + x3 * radius,
      y: cy - (y3 + state.pitch) * radius * 0.96,
      z: z3,
      visible: z3 > -0.18,
      scale: clamp(0.62 + z3 * 0.42, 0.22, 1.05)
    };
  }

  function drawBackground(ctx, cx, cy, r) {
    ctx.save();
    ctx.lineWidth = Math.max(1, state.dpr);
    ctx.strokeStyle = "rgba(141,216,255,.12)";
    ctx.setLineDash([4 * state.dpr, 7 * state.dpr]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.18, r * 1.02, 0.22, 0, TAU);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(244,207,131,.10)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.92, r * 1.12, -0.16, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  function drawSphereBase(ctx, cx, cy, r) {
    const grd = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.38, r * 0.05, cx, cy, r * 1.08);
    grd.addColorStop(0, "rgba(222,214,153,.95)");
    grd.addColorStop(0.28, "rgba(129,125,83,.93)");
    grd.addColorStop(0.54, "rgba(66,82,63,.93)");
    grd.addColorStop(0.76, "rgba(117,88,58,.92)");
    grd.addColorStop(1, "rgba(10,15,18,.98)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.clip();

    ctx.fillStyle = grd;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.globalAlpha = 0.16;
    for (let i = 0; i < 22; i += 1) {
      const y = cy - r + (i / 21) * r * 2;
      ctx.strokeStyle = i % 2 ? "rgba(255,244,216,.16)" : "rgba(40,67,59,.22)";
      ctx.lineWidth = state.dpr;
      ctx.beginPath();
      ctx.moveTo(cx - r, y);
      ctx.bezierCurveTo(cx - r * 0.35, y - r * 0.06, cx + r * 0.35, y + r * 0.06, cx + r, y);
      ctx.stroke();
    }

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.strokeStyle = "rgba(190,232,255,.26)";
    ctx.lineWidth = Math.max(1, 1.2 * state.dpr);
    ctx.stroke();

    const shade = ctx.createRadialGradient(cx - r * 0.36, cy - r * 0.42, r * 0.1, cx + r * 0.36, cy + r * 0.28, r * 1.16);
    shade.addColorStop(0, "rgba(255,255,255,.18)");
    shade.addColorStop(0.44, "rgba(255,255,255,0)");
    shade.addColorStop(0.78, "rgba(0,0,0,.34)");
    shade.addColorStop(1, "rgba(0,0,0,.68)");
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawTerrain(ctx, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.clip();

    for (const patch of state.terrain) {
      const p = project(patch.lon, patch.lat, r, cx, cy);
      if (!p.visible) continue;

      const size = patch.size * r * p.scale;
      const color =
        patch.tone < 0.33 ? "rgba(77,101,70,.24)" :
        patch.tone < 0.66 ? "rgba(164,126,74,.22)" :
        "rgba(70,54,38,.22)";

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, size * 1.6, size, patch.lon + state.yaw, 0, TAU);
      ctx.fill();
    }

    if (state.mode === "surface" || state.mode === "terrain") {
      ctx.globalAlpha = state.mode === "terrain" ? 0.18 : 0.10;
      ctx.strokeStyle = "rgba(255,232,163,.52)";
      ctx.lineWidth = Math.max(1, state.dpr);
      for (let i = 0; i < 18; i += 1) {
        const y = cy - r * 0.78 + i * r * 0.09;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.78, y);
        ctx.quadraticCurveTo(cx, y + Math.sin(i + state.time) * r * 0.05, cx + r * 0.78, y - r * 0.04);
        ctx.stroke();
      }
    }

    if (state.mode === "terrain") {
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = "rgba(92,55,35,.85)";
      ctx.lineWidth = Math.max(1, 1.4 * state.dpr);
      for (let i = 0; i < 10; i += 1) {
        const p1 = project(-1.8 + i * 0.34, -0.6 + Math.sin(i) * 0.22, r, cx, cy);
        const p2 = project(-1.2 + i * 0.29, 0.25 + Math.cos(i) * 0.22, r, cx, cy);
        if (!p1.visible || !p2.visible) continue;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawLattice(ctx, cx, cy, r) {
    if (state.mode !== "lattice" && state.mode !== "receipt") return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.clip();

    const visibleNodes = state.nodes
      .map((node) => ({ node, p: project(node.lon, node.lat, r, cx, cy) }))
      .filter((item) => item.p.visible);

    ctx.lineWidth = Math.max(0.6, 0.75 * state.dpr);
    ctx.globalAlpha = state.mode === "receipt" ? 0.26 : 0.34;

    for (const item of visibleNodes) {
      const { node, p } = item;
      const right = visibleNodes.find((other) => other.node.y === node.y && other.node.x === node.x + 1);
      const down = visibleNodes.find((other) => other.node.x === node.x && other.node.y === node.y + 1);

      ctx.strokeStyle = "rgba(141,216,255,.36)";
      if (right) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(right.p.x, right.p.y);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(244,207,131,.24)";
      if (down) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(down.p.x, down.p.y);
        ctx.stroke();
      }
    }

    for (const { node, p } of visibleNodes) {
      const hue =
        node.colorIndex % 4 === 0 ? "rgba(244,207,131,.82)" :
        node.colorIndex % 4 === 1 ? "rgba(141,216,255,.72)" :
        node.colorIndex % 4 === 2 ? "rgba(167,243,198,.70)" :
        "rgba(173,140,255,.68)";
      ctx.fillStyle = hue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.2, 2.3 * state.dpr * p.scale), 0, TAU);
      ctx.fill();
    }

    if (state.mode === "receipt") {
      ctx.globalAlpha = 0.42;
      ctx.strokeStyle = "rgba(244,207,131,.64)";
      ctx.lineWidth = Math.max(1, 1.5 * state.dpr);
      for (let i = 0; i < 8; i += 1) {
        const a = visibleNodes[(i * 17) % visibleNodes.length];
        const b = visibleNodes[(i * 31 + 11) % visibleNodes.length];
        if (!a || !b) continue;
        ctx.beginPath();
        ctx.moveTo(a.p.x, a.p.y);
        ctx.lineTo(b.p.x, b.p.y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function render(timestamp = 0) {
    if (!state.ctx || !state.canvas || !state.stage) return;

    const dt = state.lastFrame ? clamp((timestamp - state.lastFrame) / 1000, 0, 0.04) : 0;
    state.lastFrame = timestamp;
    state.time += dt;

    if (!state.dragging) {
      state.yaw += state.velocity * dt * 60;
      state.velocity *= Math.pow(0.94, dt * 60);
      if (Math.abs(state.velocity) < 0.0002) {
        state.velocity = 0;
        state.yaw += Math.sin(state.time * 0.18) * dt * 0.025;
      }
    }

    resizeCanvas();

    const ctx = state.ctx;
    const w = state.width;
    const h = state.height;
    const cx = w / 2;
    const cy = h * 0.48;
    const r = Math.min(w * 0.34, h * 0.36);

    ctx.clearRect(0, 0, w, h);
    drawBackground(ctx, cx, cy, r);
    drawSphereBase(ctx, cx, cy, r);
    drawTerrain(ctx, cx, cy, r);
    drawLattice(ctx, cx, cy, r);

    state.raf = window.requestAnimationFrame(render);
  }

  function setMode(mode) {
    const next = MODES[mode] ? mode : "body";
    state.mode = next;

    $all("[data-audralia-mode]").forEach((button) => {
      const active = button.dataset.audraliaMode === next;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.toggleAttribute("data-active", active);
    });

    const copy = MODES[next];
    const title = $("[data-audralia-mode-title]");
    const status = $("[data-audralia-mode-status]");
    const platform = $("[data-audralia-mode-platform]");
    const engineering = $("[data-audralia-mode-engineering]");

    if (title) title.textContent = copy.title;
    if (status) status.textContent = copy.status;
    if (platform) platform.textContent = copy.platform;
    if (engineering) engineering.textContent = copy.engineering;

    document.documentElement.dataset.audraliaPlanetMode = next;
    document.body.dataset.audraliaPlanetMode = next;
  }

  function selectLens(chamber, lens) {
    if (!chamber) return;

    const next = lens === "engineering" ? "engineering" : "platform";

    $all("[data-lens-tab]", chamber).forEach((button) => {
      const active = button.dataset.lensTab === next;
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.toggleAttribute("data-active", active);
    });

    $all("[data-lens-pane]", chamber).forEach((pane) => {
      const active = pane.dataset.lensPane === next;
      pane.hidden = !active;
      pane.toggleAttribute("data-active", active);
    });
  }

  function openChamber(id) {
    const target = document.getElementById(id);
    if (!target || target.tagName.toLowerCase() !== "details") return;

    $all("details[data-audralia-chamber]").forEach((chamber) => {
      chamber.open = chamber === target;
    });

    target.open = true;
    selectLens(target, "platform");

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function bindTabs() {
    $all("[data-lens-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const chamber = button.closest("[data-audralia-chamber]");
        selectLens(chamber, button.dataset.lensTab);
      });
    });

    $all("[data-audralia-chamber]").forEach((chamber) => selectLens(chamber, "platform"));
  }

  function bindGemNavigation() {
    $all("[data-gem-anchor]").forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href") || "";
        if (!href.startsWith("#")) return;

        event.preventDefault();
        const id = href.slice(1);
        history.replaceState(null, "", href);
        openChamber(id);
      });
    });
  }

  function bindMenusAndReturn() {
    $all(".planet-menu-panel a").forEach((link) => {
      link.addEventListener("click", () => {
        const menu = $(".planet-menu");
        if (menu) menu.open = false;
      });
    });

    $all(".return-orbit").forEach((link) => {
      link.addEventListener("click", () => {
        document.documentElement.dataset.audraliaReturnToOrbit = "true";
      });
    });

    const inspect = $("[data-audralia-inspect-planet]");
    if (inspect) {
      inspect.addEventListener("click", () => {
        const status = $("[data-audralia-renderer-status]");
        if (status) status.textContent = "Protected globe inspected · tabs active · gems navigate";
        document.documentElement.dataset.audraliaPlanetInspection = "passed";
      });
    }
  }

  function bindModes() {
    $all("[data-audralia-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        setMode(button.dataset.audraliaMode);
      });
    });

    setMode("body");
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.style.touchAction = "none";

    state.stage.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
      state.velocity = 0;
      try {
        state.stage.setPointerCapture?.(event.pointerId);
        event.preventDefault();
      } catch (_error) {}
    }, { passive: false });

    state.stage.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;

      const dx = event.clientX - state.pointerX;
      const dy = event.clientY - state.pointerY;

      state.pointerX = event.clientX;
      state.pointerY = event.clientY;

      state.yaw += dx * 0.0065;
      state.pitch = clamp(state.pitch + dy * 0.0022, -0.28, 0.28);
      state.velocity = clamp(dx * 0.0018, -0.035, 0.035);

      try {
        event.preventDefault();
      } catch (_error) {}
    }, { passive: false });

    const release = (event) => {
      state.dragging = false;
      try {
        state.stage.releasePointerCapture?.(event.pointerId);
      } catch (_error) {}
    };

    state.stage.addEventListener("pointerup", release, { passive: true });
    state.stage.addEventListener("pointercancel", release, { passive: true });
    state.stage.addEventListener("pointerleave", release, { passive: true });
  }

  function publishReceipt(scope = "init") {
    const payload = Object.freeze({
      ...RECEIPT,
      scope,
      mode: state.mode,
      initialized: state.initialized,
      renderer: state.ctx ? "native-2d-canvas" : "fallback",
      time: new Date().toISOString()
    });

    window.AUDRALIA_G2_PLANET_SITE_ALIGNMENT_RECEIPT = payload;
    window.DGBAudraliaPlanetStatus = () => payload;

    document.documentElement.dataset.audraliaPlanetController = CONTRACT;
    document.documentElement.dataset.audraliaPlanetHtmlContract = HTML_CONTRACT;
    document.documentElement.dataset.audraliaPlanetProtectedGlobe = "true";
    document.documentElement.dataset.audraliaPlanetGemFirstNavigation = "true";
    document.documentElement.dataset.audraliaPlanetTabs = "platform-engineering";
    document.documentElement.dataset.audraliaPlanetFinalVisualPass = "false";

    return payload;
  }

  function initCanvas() {
    state.stage = $("[data-audralia-planet-stage]");
    state.canvas = $("[data-audralia-planet-canvas]");

    if (!state.stage || !state.canvas) return false;

    state.ctx = state.canvas.getContext("2d", { alpha: true });
    if (!state.ctx) return false;

    state.stage.dataset.rendererState = "active";
    const status = $("[data-audralia-renderer-status]");
    if (status) status.textContent = "Protected dry globe active · renderer preserved";

    bindPointer();
    return true;
  }

  function init() {
    makeTerrain();
    bindTabs();
    bindGemNavigation();
    bindMenusAndReturn();
    bindModes();

    const ready = initCanvas();
    state.initialized = true;

    publishReceipt(ready ? "init-complete" : "fallback-visible");

    if (ready) {
      window.addEventListener("resize", resizeCanvas, { passive: true });
      state.raf = window.requestAnimationFrame(render);
    }

    const hash = window.location.hash ? window.location.hash.slice(1) : "";
    if (hash && document.getElementById(hash)) openChamber(hash);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
