// TARGET FILE: /showroom/globe/hearth/index.js
// TNT FULL-FILE REPLACEMENT
// HEARTH_SHOWROOM_FACILITY_UNKNOWN_LOCATION_CONTROLLER_TNT_v1
/*
  Owns:
  - Hearth page interaction controller
  - lens/category switching
  - one canvas mount enforcement
  - pointer drag/inertial globe carrier shell
  - local 16x16 diagnostic spectrum
  - local 4x4 chamber matrix
  - visible diagnostic slot writing
  - status publication

  Does not own:
  - production canvas truth
  - diagnostic mutation
  - F13 release
  - F21 latch
  - controls repair
  - runtime restart
  - WebGL
  - GraphicBox
  - generated image
*/

(() => {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  const CONTRACT = "HEARTH_SHOWROOM_FACILITY_UNKNOWN_LOCATION_CONTROLLER_TNT_v1";
  const CSS_CONTRACT = "HEARTH_SHOWROOM_FACILITY_UNKNOWN_LOCATION_STYLE_TNT_v1";
  const HTML_CONTRACT = "HEARTH_SHOWROOM_FACILITY_UNKNOWN_LOCATION_SHELL_TNT_v1";
  const ROUTE = "/showroom/globe/hearth/";
  const TARGET_FILE = "/showroom/globe/hearth/index.js";

  const STATUS_GLOBAL = "HEARTH_SHOWROOM_FACILITY_STATUS";
  const CONTROLLER_GLOBAL = "HEARTH_SHOWROOM_FACILITY_CONTROLLER";

  const RADIAL_NODES = 16;
  const FIBONACCI_BANDS = 16;
  const LATTICE_STATES = 256;
  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  const LENS_COPY = Object.freeze({
    facility: {
      title: "Facility Lens",
      label: "<strong>Facility Lens</strong> → Hearth alias active · location unknown",
      copy: "Hearth is treated as a facility alias inside Mirrorland. The planet carrier is not claimed as visually complete."
    },
    orbit: {
      title: "Orbit Lens",
      label: "<strong>Orbit Lens</strong> → return-to-orbit shell · carrier inspection",
      copy: "Orbit Lens keeps the visitor above the unknown location and preserves a safe return path."
    },
    diagnostic: {
      title: "Diagnostic Lens",
      label: "<strong>Diagnostic Lens</strong> → local chamber spectrum · no mutation authorized",
      copy: "Diagnostic Lens exposes readable chamber state without authorizing canvas repair, runtime restart, or visual pass."
    }
  });

  const state = {
    stage: null,
    mount: null,
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    dpr: 1,
    rect: null,

    activeLens: "facility",
    activeCategory: "chamber",
    activeMatrixCell: "",
    activeSpectrumCell: "",

    seats: [],
    ringLinks: [],
    spineLinks: [],
    fibonacciLinks: [],
    geometryBuilt: false,

    yaw: -0.48,
    pitch: -0.14,
    roll: 0,
    velocityYaw: 0,
    velocityPitch: 0,
    pointerActive: false,
    pointerId: null,
    pointerX: 0,
    pointerY: 0,
    lastTap: 0,

    raf: 0,
    lastFrameTime: 0,
    settleFrames: 0,
    renderCount: 0,
    stopped: false,

    oneCanvas: false,
    onePointerPath: false,
    duplicateCanvasRemoved: 0,
    diagnosticSlotsWritten: false,

    status: "BOOT_PENDING",
    failureCode: "BOOT_PENDING",
    failureReason: "boot pending",
    errors: []
  };

  const abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
  const signal = abortController ? abortController.signal : undefined;
  let resizeObserver = null;

  function finite(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function now() {
    return typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  }

  function one(selector, root = document) {
    try { return root.querySelector(selector); } catch (_error) { return null; }
  }

  function all(selector, root = document) {
    try { return Array.from(root.querySelectorAll(selector)); } catch (_error) { return []; }
  }

  function setText(selector, value) {
    const node = one(selector);
    if (!node) return false;
    const text = String(value == null ? "" : value);
    if (node.textContent !== text) node.textContent = text;
    return true;
  }

  function setHtml(selector, value) {
    const node = one(selector);
    if (!node) return false;
    const html = String(value == null ? "" : value);
    if (node.innerHTML !== html) node.innerHTML = html;
    return true;
  }

  function setBool(node, name, value) {
    if (node) node.setAttribute(name, value ? "true" : "false");
  }

  function setDataset(key, value) {
    try {
      document.documentElement.dataset[key] = String(value);
      if (document.body) document.body.dataset[key] = String(value);
    } catch (_error) {}
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || "unknown");
    state.errors.push({ scope, message, at: new Date().toISOString() });
    state.status = "ERROR";
    state.failureCode = "ERROR";
    state.failureReason = `${scope}: ${message}`;
    publishStatus();
  }

  function makeSeat(band, radial) {
    const v = (band + 0.5) / FIBONACCI_BANDS;
    const lat = Math.asin(1 - 2 * v);
    const lon = (radial / RADIAL_NODES) * TAU - Math.PI;
    const clat = Math.cos(lat);

    return {
      index: band * RADIAL_NODES + radial,
      band,
      radial,
      latitude: lat,
      longitude: lon,
      x: clat * Math.cos(lon),
      y: Math.sin(lat),
      z: clat * Math.sin(lon),
      major: radial % 4 === 0 || band % 4 === 0,
      secondary: radial % 2 === 0 || band % 2 === 0
    };
  }

  function buildGeometry() {
    const rings = [];

    for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
      const ring = [];
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        ring.push(makeSeat(band, radial));
      }
      rings.push(ring);
    }

    const seat = (band, radial) => rings[band][((radial % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
    const link = (a, b, family, major) => ({ a, b, family, major: Boolean(major) });

    for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        state.ringLinks.push(link(seat(band, radial), seat(band, radial + 1), "ring", band % 4 === 0 || radial % 4 === 0));
      }
    }

    for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
      for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
        state.spineLinks.push(link(seat(band, radial), seat(band + 1, radial), "spine", radial % 4 === 0));
      }
    }

    const offsets = [1, 2, 3, 5, 8, 13];
    for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      const offset = offsets[band % offsets.length];
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        state.fibonacciLinks.push(link(seat(band, radial), seat(band + 1, radial + offset), "fibonacci", radial % 4 === 0 || band % 4 === 0));
      }
    }

    state.seats = rings.flat();
    state.geometryBuilt = state.seats.length === LATTICE_STATES;
  }

  function rotatePoint(point) {
    let { x, y, z } = point;

    const cy = Math.cos(state.yaw);
    const sy = Math.sin(state.yaw);
    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    x = x1; z = z1;

    const cp = Math.cos(state.pitch);
    const sp = Math.sin(state.pitch);
    const y1 = y * cp - z * sp;
    const z2 = y * sp + z * cp;
    y = y1; z = z2;

    const cr = Math.cos(state.roll);
    const sr = Math.sin(state.roll);

    return {
      x: x * cr - y * sr,
      y: x * sr + y * cr,
      z
    };
  }

  function metrics() {
    const width = state.width || 640;
    const height = state.height || 720;
    const minSide = Math.min(width, height);

    return {
      centerX: width / 2,
      centerY: height * 0.46,
      radius: minSide * 0.34,
      cameraDistance: 3.9
    };
  }

  function projectPoint(point) {
    const m = metrics();
    const rotated = rotatePoint(point);
    const perspective = m.cameraDistance / Math.max(0.72, m.cameraDistance - rotated.z);

    return {
      x: m.centerX + rotated.x * m.radius * perspective,
      y: m.centerY - rotated.y * m.radius * perspective,
      z: rotated.z,
      perspective,
      frontFacing: rotated.z >= -0.05
    };
  }

  function clipSphere() {
    const ctx = state.ctx;
    const m = metrics();
    ctx.beginPath();
    ctx.arc(m.centerX, m.centerY, m.radius * 1.003, 0, TAU);
    ctx.clip();
  }

  function drawCarrier() {
    const ctx = state.ctx;
    const m = metrics();
    const cx = m.centerX;
    const cy = m.centerY;
    const r = m.radius;

    ctx.save();

    const core = ctx.createRadialGradient(cx - r * .30, cy - r * .36, 0, cx, cy, r * 1.18);
    core.addColorStop(0.00, "rgba(255,226,165,0.96)");
    core.addColorStop(0.17, "rgba(255,143,78,0.72)");
    core.addColorStop(0.40, "rgba(69,75,135,0.82)");
    core.addColorStop(0.72, "rgba(12,26,74,0.97)");
    core.addColorStop(1.00, "rgba(1,4,16,1)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = core;
    ctx.fill();

    const shade = ctx.createRadialGradient(cx + r * .34, cy + r * .32, r * .10, cx, cy, r * 1.08);
    shade.addColorStop(0.00, "rgba(0,0,0,0)");
    shade.addColorStop(0.52, "rgba(0,0,0,0.10)");
    shade.addColorStop(0.82, "rgba(0,0,0,0.38)");
    shade.addColorStop(1.00, "rgba(0,0,0,0.70)");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = shade;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.003, 0, TAU);
    ctx.strokeStyle = "rgba(255,214,142,0.24)";
    ctx.lineWidth = Math.max(.8, state.dpr * .8);
    ctx.stroke();

    ctx.restore();
  }

  function drawReferenceLines() {
    const ctx = state.ctx;
    const equator = [];
    const meridian = [];

    for (let i = 0; i <= 96; i += 1) {
      const lon = -Math.PI + (i / 96) * TAU;
      equator.push({ x: Math.cos(lon), y: 0, z: Math.sin(lon) });
    }

    for (let i = 0; i <= 96; i += 1) {
      const lat = -HALF_PI + (i / 96) * Math.PI;
      meridian.push({ x: Math.cos(lat), y: Math.sin(lat), z: 0 });
    }

    function stroke(points, color, width) {
      ctx.beginPath();
      points.forEach((point, index) => {
        const p = projectPoint(point);
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    ctx.save();
    clipSphere();
    stroke(equator, "rgba(242,183,93,0.42)", Math.max(.8, state.dpr * .72));
    stroke(meridian, "rgba(141,216,255,0.22)", Math.max(.65, state.dpr * .55));
    ctx.restore();
  }

  function drawLinks(links, reduced) {
    const ctx = state.ctx;

    links.forEach((link) => {
      if (reduced && !link.major && link.family === "fibonacci") return;

      const a = projectPoint(link.a);
      const b = projectPoint(link.b);
      const front = a.frontFacing || b.frontFacing;
      const z = (a.z + b.z) / 2;

      const color = link.family === "fibonacci"
        ? front ? `rgba(242,183,93,${clamp(.40 + z * .14, .20, .70).toFixed(3)})` : "rgba(242,183,93,0.08)"
        : front ? `rgba(141,216,255,${clamp(.22 + z * .10, .10, .40).toFixed(3)})` : "rgba(141,216,255,0.055)";

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = link.major ? Math.max(.75, state.dpr * .76) : Math.max(.42, state.dpr * .46);
      ctx.stroke();
    });
  }

  function drawSeats(reduced) {
    const ctx = state.ctx;

    state.seats.forEach((seat) => {
      if (reduced && !seat.major) return;

      const p = projectPoint(seat);
      const alpha = p.frontFacing ? (seat.major ? .84 : .56) : (seat.major ? .16 : .07);
      const radius = seat.major ? 2.35 : seat.secondary ? 1.55 : 1.15;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, radius * state.dpr * p.perspective), 0, TAU);
      ctx.fillStyle = seat.major
        ? `rgba(242,183,93,${alpha.toFixed(3)})`
        : `rgba(141,216,255,${alpha.toFixed(3)})`;
      ctx.fill();
    });
  }

  function drawLattice(reduced) {
    const ctx = state.ctx;
    ctx.save();
    clipSphere();
    drawLinks(state.ringLinks, reduced);
    drawLinks(state.spineLinks, reduced);
    drawLinks(state.fibonacciLinks, reduced);
    drawSeats(reduced);
    ctx.restore();
  }

  function renderFrame(timestamp) {
    if (state.stopped || !state.ctx || !state.geometryBuilt) return;

    state.raf = 0;

    const dt = state.lastFrameTime ? clamp((timestamp - state.lastFrameTime) / 1000, 0, .05) : 0;
    state.lastFrameTime = timestamp;

    if (!state.pointerActive) {
      state.yaw += state.velocityYaw;
      state.pitch += state.velocityPitch;

      const damping = Math.pow(.938, dt * 60);
      state.velocityYaw *= damping;
      state.velocityPitch *= damping;

      if (Math.abs(state.velocityYaw) < .00008) state.velocityYaw = 0;
      if (Math.abs(state.velocityPitch) < .00008) state.velocityPitch = 0;
    }

    state.pitch = clamp(state.pitch, -1.16, 1.16);
    state.roll = Math.sin(timestamp * .00018) * .010;

    state.ctx.clearRect(0, 0, state.width, state.height);
    drawCarrier();
    drawReferenceLines();

    if (state.activeLens === "diagnostic" || state.activeLens === "orbit") {
      drawLattice(state.pointerActive);
    } else {
      state.ctx.save();
      state.ctx.globalAlpha = .20;
      drawLattice(true);
      state.ctx.restore();
    }

    state.renderCount += 1;
    if (state.settleFrames > 0) state.settleFrames -= 1;

    writeDiagnosticSlots();
    publishStatus();

    if (
      state.pointerActive ||
      state.settleFrames > 0 ||
      Math.abs(state.velocityYaw) > 0 ||
      Math.abs(state.velocityPitch) > 0
    ) {
      state.raf = window.requestAnimationFrame(renderFrame);
    }
  }

  function requestRender(settleFrames = 0) {
    state.settleFrames = Math.max(state.settleFrames, settleFrames);
    if (!state.raf && !state.stopped) state.raf = window.requestAnimationFrame(renderFrame);
  }

  function enforceOneCanvas() {
    if (!state.mount) return;

    let canvases = all("canvas", state.mount);
    let selected = state.canvas && state.mount.contains(state.canvas) ? state.canvas : canvases[0];

    if (!selected) {
      selected = document.createElement("canvas");
      state.mount.appendChild(selected);
    }

    canvases = all("canvas", state.mount);
    canvases.forEach((canvas) => {
      if (canvas === selected) return;
      try {
        canvas.remove();
        state.duplicateCanvasRemoved += 1;
      } catch (_error) {}
    });

    state.canvas = selected;
    state.canvas.setAttribute("data-hearth-facility-canvas", CONTRACT);
    state.canvas.setAttribute("data-css-contract", CSS_CONTRACT);
    state.canvas.setAttribute("data-html-contract", HTML_CONTRACT);
    state.canvas.setAttribute("data-location", "unknown");
    state.canvas.setAttribute("data-canvas-release-authorized", "false");

    state.canvas.style.position = "absolute";
    state.canvas.style.inset = "0";
    state.canvas.style.width = "100%";
    state.canvas.style.height = "100%";
    state.canvas.style.display = "block";
    state.canvas.style.background = "transparent";
    state.canvas.style.pointerEvents = "none";

    state.ctx = state.canvas.getContext("2d", { alpha: true });
    state.oneCanvas = Boolean(state.ctx);
  }

  function updateDimensions(rect) {
    if (!rect || !state.canvas || !state.ctx) return false;

    const dpr = Math.max(1, Math.min(1.85, window.devicePixelRatio || 1));
    const width = Math.max(320, Math.floor(rect.width * dpr));
    const height = Math.max(460, Math.floor(rect.height * dpr));

    state.rect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };

    if (state.width === width && state.height === height && state.dpr === dpr) return false;

    state.width = width;
    state.height = height;
    state.dpr = dpr;
    state.canvas.width = width;
    state.canvas.height = height;
    requestRender(8);
    return true;
  }

  function measureStage() {
    if (!state.stage) return false;
    return updateDimensions(state.stage.getBoundingClientRect());
  }

  function setupResize() {
    measureStage();

    if (typeof ResizeObserver !== "undefined" && state.stage) {
      resizeObserver = new ResizeObserver(() => measureStage());
      try { resizeObserver.observe(state.stage); } catch (_error) {}
    }

    window.addEventListener("resize", () => {
      measureStage();
      requestRender(8);
    }, signal ? { signal, passive: true } : { passive: true });
  }

  function pointerPoint(event) {
    const rect = state.rect || state.stage.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function resetCarrier() {
    state.yaw = -0.48;
    state.pitch = -0.14;
    state.roll = 0;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    requestRender(12);
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.addEventListener("pointerdown", (event) => {
      const t = now();
      if (t - state.lastTap < 320) resetCarrier();
      state.lastTap = t;

      state.pointerActive = true;
      state.pointerId = event.pointerId;

      const p = pointerPoint(event);
      state.pointerX = p.x;
      state.pointerY = p.y;
      state.velocityYaw = 0;
      state.velocityPitch = 0;

      try { state.stage.setPointerCapture(event.pointerId); } catch (_error) {}

      requestRender(4);
      event.preventDefault();
    }, signal ? { signal, passive: false } : { passive: false });

    state.stage.addEventListener("pointermove", (event) => {
      if (!state.pointerActive) return;

      const p = pointerPoint(event);
      const dx = p.x - state.pointerX;
      const dy = p.y - state.pointerY;

      state.pointerX = p.x;
      state.pointerY = p.y;

      state.yaw += dx * .0082;
      state.pitch = clamp(state.pitch + dy * .0054, -1.16, 1.16);
      state.velocityYaw = clamp(dx * .0022, -.048, .048);
      state.velocityPitch = clamp(dy * .0014, -.038, .038);

      requestRender(2);
      event.preventDefault();
    }, signal ? { signal, passive: false } : { passive: false });

    const release = (event) => {
      if (!state.pointerActive) return;
      state.pointerActive = false;

      try {
        if (state.pointerId !== null) state.stage.releasePointerCapture(state.pointerId);
      } catch (_error) {}

      state.pointerId = null;
      requestRender(18);

      try { event.preventDefault(); } catch (_error2) {}
    };

    state.stage.addEventListener("pointerup", release, signal ? { signal, passive: false } : { passive: false });
    state.stage.addEventListener("pointercancel", release, signal ? { signal, passive: false } : { passive: false });
    state.stage.addEventListener("lostpointercapture", release, signal ? { signal, passive: false } : { passive: false });

    state.onePointerPath = true;
  }

  function setLens(lens) {
    const clean = Object.prototype.hasOwnProperty.call(LENS_COPY, lens) ? lens : "facility";
    state.activeLens = clean;

    all("[data-hearth-lens-button]").forEach((button) => {
      const active = button.getAttribute("data-hearth-lens-button") === clean;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      setBool(button, "data-active", active);
      setBool(button, "data-muted", !active);
    });

    setText("[data-hearth-lens-title]", LENS_COPY[clean].title);
    setText("[data-hearth-lens-copy]", LENS_COPY[clean].copy);
    setHtml("[data-hearth-stage-label]", LENS_COPY[clean].label);

    writeDiagnosticSlots();
    requestRender(clean === "facility" ? 8 : 14);
    publishStatus();
  }

  function setCategory(category) {
    const clean = String(category || "chamber").trim();

    state.activeCategory = clean;

    all("[data-hearth-category-button]").forEach((button) => {
      const active = button.getAttribute("data-hearth-category-button") === clean;
      setBool(button, "data-active", active);
      setBool(button, "data-muted", !active);
    });

    all("[data-hearth-category-panel]").forEach((panel) => {
      const active = panel.getAttribute("data-hearth-category-panel") === clean;
      setBool(panel, "data-active", active);
      panel.hidden = !active;
    });

    publishStatus();
  }

  function buildSpectrum() {
    const spectrum = one("[data-hearth-spectrum]");
    if (!spectrum) return;

    spectrum.innerHTML = "";

    for (let index = 1; index <= LATTICE_STATES; index += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.setAttribute("aria-label", `Hearth diagnostic state ${index}`);
      cell.setAttribute("data-hearth-spectrum-cell", String(index));
      spectrum.appendChild(cell);
    }
  }

  function activateMatrixCell(cell) {
    all("[data-hearth-matrix-cell]").forEach((node) => {
      const active = node === cell;
      setBool(node, "data-active", active);
      setBool(node, "data-muted", !active);
    });

    state.activeMatrixCell = cell.getAttribute("data-hearth-matrix-cell") || cell.textContent.trim();
    setText("[data-hearth-matrix-readout]", `Selected chamber: ${state.activeMatrixCell}`);
    publishStatus();
  }

  function activateSpectrumCell(cell) {
    all("[data-hearth-spectrum-cell]").forEach((node) => {
      const active = node === cell;
      setBool(node, "data-active", active);
      setBool(node, "data-muted", false);
    });

    state.activeSpectrumCell = cell.getAttribute("data-hearth-spectrum-cell") || "";
    setText("[data-hearth-spectrum-readout]", `Selected diagnostic state: ${state.activeSpectrumCell} of 256.`);
    publishStatus();
  }

  function returnToOrbit() {
    state.activeLens = "facility";
    state.activeCategory = "chamber";
    state.activeMatrixCell = "";
    state.activeSpectrumCell = "";

    all("[data-hearth-spectrum-cell], [data-hearth-matrix-cell]").forEach((node) => {
      setBool(node, "data-active", false);
      setBool(node, "data-muted", false);
    });

    setLens("facility");
    setCategory("chamber");
    resetCarrier();

    const stage = one("#hearthGlobeStage");
    if (stage) {
      window.setTimeout(() => {
        stage.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
      }, 30);
    }

    publishStatus();
  }

  function prefersReducedMotion() {
    return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function writeDiagnosticSlots() {
    let written = true;

    written = setText("[data-hearth-diagnostic-route]", "Hearth facility route · Mirrorland alias active") && written;
    written = setText("[data-hearth-diagnostic-location]", "unknown") && written;
    written = setText("[data-hearth-diagnostic-carrier]", state.oneCanvas ? "one canvas carrier mounted" : "canvas carrier pending") && written;
    written = setText("[data-hearth-diagnostic-lens]", state.activeLens) && written;
    written = setText("[data-hearth-diagnostic-category]", state.activeCategory) && written;
    written = setText("[data-hearth-diagnostic-loop]", state.renderCount > 0 ? "RAF carrier loop active" : "loop pending") && written;
    written = setText("[data-hearth-diagnostic-spectrum]", "16 × 16 / 256 local chamber spectrum") && written;
    written = setText("[data-hearth-diagnostic-authority]", "mutation held · no F13/F21 claim") && written;

    state.diagnosticSlotsWritten = written;

    setDataset("hearthShowroomContract", CONTRACT);
    setDataset("hearthShowroomCssContract", CSS_CONTRACT);
    setDataset("hearthShowroomHtmlContract", HTML_CONTRACT);
    setDataset("hearthFacilityAlias", "true");
    setDataset("hearthFacilityLocation", "unknown");
    setDataset("hearthActiveLens", state.activeLens);
    setDataset("hearthActiveCategory", state.activeCategory);
    setDataset("hearthOneCanvas", state.oneCanvas);
    setDataset("hearthLatticeStates", LATTICE_STATES);
    setDataset("hearthCanvasReleaseAuthorized", "false");
    setDataset("hearthVisualPassClaimed", "false");
  }

  function publishStatus() {
    const payload = {
      contract: CONTRACT,
      cssContract: CSS_CONTRACT,
      htmlContract: HTML_CONTRACT,
      route: ROUTE,
      targetFile: TARGET_FILE,

      hearthAliasForFacility: true,
      locationKnown: false,
      location: "unknown",
      mirrorlandCollaborativeTheme: true,
      eerieMysticalFacilityTheme: true,

      activeLens: state.activeLens,
      activeCategory: state.activeCategory,
      activeMatrixCell: state.activeMatrixCell,
      activeSpectrumCell: state.activeSpectrumCell,

      oneCanvas: state.oneCanvas,
      onePointerPath: state.onePointerPath,
      geometryBuilt: state.geometryBuilt,
      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeStates: LATTICE_STATES,

      diagnosticSlotsWritten: state.diagnosticSlotsWritten,
      renderCount: state.renderCount,
      duplicateCanvasRemoved: state.duplicateCanvasRemoved,

      productionMutationAuthorized: false,
      canvasRepairAuthorized: false,
      canvasBuildAuthorized: false,
      canvasReleaseAuthorized: false,
      controlsRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      routeRepairAuthorized: false,
      targetRouteRendererMutationAuthorized: false,
      readyTextClaimed: false,
      f13Claimed: false,
      f21Claimed: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      status: state.status,
      failureCode: state.failureCode,
      failureReason: state.failureReason,
      errors: state.errors.slice(),
      updatedAt: new Date().toISOString()
    };

    window[STATUS_GLOBAL] = payload;
    window.HEARTH = window.HEARTH || {};
    window.HEARTH.showroomFacilityStatus = payload;

    return payload;
  }

  function stop() {
    state.stopped = true;

    if (state.raf) {
      try { window.cancelAnimationFrame(state.raf); } catch (_error) {}
    }

    state.raf = 0;

    if (resizeObserver) {
      try { resizeObserver.disconnect(); } catch (_error2) {}
    }

    if (abortController) {
      try { abortController.abort(); } catch (_error3) {}
    }
  }

  function exposeApi() {
    const api = {
      contract: CONTRACT,
      cssContract: CSS_CONTRACT,
      htmlContract: HTML_CONTRACT,
      route: ROUTE,
      targetFile: TARGET_FILE,
      state,
      setLens,
      setCategory,
      resetCarrier,
      returnToOrbit,
      writeDiagnosticSlots,
      publishStatus,
      stop
    };

    window[CONTROLLER_GLOBAL] = api;
    window.HEARTH = window.HEARTH || {};
    window.HEARTH.showroomFacilityController = api;
  }

  function attachEvents() {
    all("[data-hearth-lens-button]").forEach((button) => {
      button.addEventListener("click", () => {
        setLens(button.getAttribute("data-hearth-lens-button") || "facility");
      }, signal ? { signal } : false);
    });

    all("[data-hearth-category-button]").forEach((button) => {
      button.addEventListener("click", () => {
        setCategory(button.getAttribute("data-hearth-category-button") || "chamber");
      }, signal ? { signal } : false);
    });

    all("[data-hearth-matrix-cell]").forEach((cell) => {
      cell.addEventListener("click", () => activateMatrixCell(cell), signal ? { signal } : false);
    });

    document.addEventListener("click", (event) => {
      const returnTrigger = event.target.closest("[data-hearth-return-to-orbit]");
      if (returnTrigger) {
        event.preventDefault();
        returnToOrbit();
        return;
      }

      const spectrumCell = event.target.closest("[data-hearth-spectrum-cell]");
      if (spectrumCell) activateSpectrumCell(spectrumCell);
    }, signal ? { signal } : false);
  }

  function init() {
    const prior = window[CONTROLLER_GLOBAL];
    if (prior && prior.contract !== CONTRACT && typeof prior.stop === "function") {
      try { prior.stop(); } catch (_error) {}
    }

    state.stage = one("#hearthGlobeStage");
    state.mount = one("#hearthGlobeMount");

    if (!state.stage || !state.mount) {
      recordError("init", "Missing #hearthGlobeStage or #hearthGlobeMount");
      writeDiagnosticSlots();
      exposeApi();
      return;
    }

    buildSpectrum();
    exposeApi();
    enforceOneCanvas();
    buildGeometry();
    setupResize();
    bindPointer();
    attachEvents();

    setLens("facility");
    setCategory("chamber");

    state.status = "ACTIVE";
    state.failureCode = "NONE";
    state.failureReason = "";

    writeDiagnosticSlots();
    publishStatus();
    requestRender(12);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, signal ? { signal, once: true } : { once: true });
  } else {
    init();
  }
})();
