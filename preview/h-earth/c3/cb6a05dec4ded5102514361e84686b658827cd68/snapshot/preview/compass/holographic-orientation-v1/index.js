(() => {
  "use strict";

  const root = document.querySelector("[data-holo-root]");
  const canvas = document.querySelector("[data-holo-canvas]");
  const gate = document.querySelector("[data-entry-gate]");
  const card = document.querySelector("[data-entry-card]");
  const beginButton = document.querySelector("[data-begin-orientation]");
  const skipButton = document.querySelector("[data-skip-orientation]");
  const endpoint = document.querySelector("[data-endpoint]");
  const replayButton = document.querySelector("[data-replay]");
  const statusNode = document.querySelector("[data-status]");

  if (!root || !canvas || !gate || !card || !beginButton || !skipButton || !endpoint || !replayButton || !statusNode) {
    throw new Error("HOLOGRAPHIC_VERTICAL_SLICE_MOUNT_MISSING");
  }

  const descriptors = globalThis.DGB_HOLOGRAPHIC_DESCRIPTORS;
  if (!descriptors || descriptors.publicBaseHead !== "8ca9f9fcae3e975993f8c50a4c2524cee0de0f1c") {
    throw new Error("HOLOGRAPHIC_DESCRIPTOR_AUTHORITY_MISSING");
  }

  const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!context) throw new Error("HOLOGRAPHIC_2D_CONTEXT_UNAVAILABLE");

  const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const TAU = Math.PI * 2;
  const GOLDEN_ANGLE = descriptors.fibonacciCosmos.goldenAngle;
  const FIELD_SEED = descriptors.fibonacciCosmos.deterministicFieldSeed;
  const COLORS = descriptors.fibonacciCosmos.colors;

  const state = {
    mode: "IDLE",
    choice: null,
    startedAt: 0,
    width: 1,
    height: 1,
    dpr: 1,
    frameCount: 0,
    stateRevision: 0,
    reducedMotion: motionQuery.matches,
    cells: [],
    stars: [],
    compass: null,
    sourceGeometryReady: false,
    sourceMeshCount: 0,
    sourceSegmentCount: 0,
    endpointShown: false,
    lastTransition: "BOOT",
    severeRuntimeError: null
  };

  globalThis.__DGB_HOLOGRAPHIC_SLICE_RECEIPT__ = {
    schema: "COMPASS_HOLOGRAPHIC_VERTICAL_SLICE_RUNTIME_RECEIPT_v1",
    operationId: "COMPASS_MAIN_ORIENTATION_HOLOGRAPHIC_SUCCESSOR_VERTICAL_SLICE_20260904_001",
    publicBaseHead: descriptors.publicBaseHead,
    masterRafAuthorities: 1,
    destinationOwnedSchedulers: 0,
    destinationGpuContexts: 0,
    canvasContextClass: "2d",
    destinationRuntimeImports: false,
    navigationMutation: false,
    historyMutation: false,
    analyticsMutation: false,
    inspect: () => Object.freeze({
      mode: state.mode,
      choice: state.choice,
      frameCount: state.frameCount,
      stateRevision: state.stateRevision,
      reducedMotion: state.reducedMotion,
      sourceGeometryReady: state.sourceGeometryReady,
      sourceMeshCount: state.sourceMeshCount,
      sourceSegmentCount: state.sourceSegmentCount,
      destinationGpuContexts: 0,
      masterRafAuthorities: 1,
      lastTransition: state.lastTransition,
      severeRuntimeError: state.severeRuntimeError
    })
  };

  function clamp(value, minimum = 0, maximum = 1) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function mix(a, b, t) {
    return a + (b - a) * t;
  }

  function easeInOutCubic(t) {
    const x = clamp(t);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function easeOutCubic(t) {
    const x = 1 - clamp(t);
    return 1 - x * x * x;
  }

  function randomFactory(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function resizeCanvas() {
    const width = Math.max(320, Math.round(innerWidth || document.documentElement.clientWidth));
    const height = Math.max(480, Math.round(innerHeight || document.documentElement.clientHeight));
    const cap = width <= 820 ? descriptors.fibonacciCosmos.mobileDprCap : descriptors.fibonacciCosmos.desktopDprCap;
    const dpr = Math.min(devicePixelRatio || 1, cap);
    state.width = width;
    state.height = height;
    state.dpr = dpr;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStarfield();
    projectCompassSource();
  }

  function buildStarfield() {
    const random = randomFactory(FIELD_SEED ^ state.width ^ (state.height << 7));
    const target = Math.round((state.width * state.height) / descriptors.fibonacciCosmos.areaDivisor);
    const count = clamp(target, descriptors.fibonacciCosmos.minimumStars, descriptors.fibonacciCosmos.maximumStars);
    const stars = [];
    for (let index = 0; index < count; index += 1) {
      const radius = Math.sqrt((index + 0.5) / count);
      const angle = index * GOLDEN_ANGLE + mix(-0.08, 0.08, random());
      const x = clamp(0.5 + Math.cos(angle) * radius * 0.69 + mix(-0.018, 0.018, random()), 0.012, 0.988);
      const y = clamp(0.5 + Math.sin(angle) * radius * 0.63 + mix(-0.018, 0.018, random()), 0.012, 0.988);
      stars.push(Object.freeze({
        x: x * state.width,
        y: y * state.height,
        radius: mix(0.5, 1.75, random()),
        alpha: mix(0.34, 0.92, random()),
        color: COLORS[Math.floor(random() * COLORS.length)],
        rogue: random() < descriptors.fibonacciCosmos.rogueRatio
      }));
    }
    state.stars = stars;
  }

  function readCompassSchema() {
    try {
      const authority = globalThis.DGB_UPSTREAM_COMPASS_GEOMETRY;
      if (!authority || authority.moduleId !== "DGB_UPSTREAM_COMPASS_GEOMETRY") {
        throw new Error("SOURCE_GEOMETRY_GLOBAL_UNAVAILABLE");
      }
      const schema = authority.createFrontProjectionSchema({ includeIntercardinalTicks: true });
      if (!schema || !Array.isArray(schema.layers) || !schema.layers.length) {
        throw new Error("SOURCE_FRONT_PROJECTION_UNAVAILABLE");
      }
      state.sourceGeometryReady = true;
      state.sourceMeshCount = schema.layers.length;
      return schema;
    } catch (error) {
      state.sourceGeometryReady = false;
      state.severeRuntimeError = String(error?.message || error);
      statusNode.textContent = "Source Compass geometry could not be resolved; preview held.";
      return null;
    }
  }

  const compassSchema = readCompassSchema();

  function materialTone(materialKey = "") {
    if (/NORTH|JEWEL/i.test(materialKey)) return "gold";
    if (/DIAL|HUB_BASE/i.test(materialKey)) return "muted";
    return "cool";
  }

  function projectCompassSource() {
    if (!compassSchema) {
      state.compass = null;
      return;
    }
    const anchors = [];
    for (const layer of compassSchema.layers) {
      if (layer.type === "POLYGON" && Array.isArray(layer.vertices)) {
        for (const vertex of layer.vertices) anchors.push({ x: vertex[0], y: -vertex[1] });
      } else if (layer.type === "CIRCLE") {
        for (let index = 0; index < 12; index += 1) {
          const angle = index / 12 * TAU;
          anchors.push({ x: Math.cos(angle) * layer.radius, y: -Math.sin(angle) * layer.radius });
        }
      } else if (layer.type === "ANNULUS") {
        for (let index = 0; index < 20; index += 1) {
          const angle = index / 20 * TAU;
          anchors.push({ x: Math.cos(angle) * layer.outerRadius, y: -Math.sin(angle) * layer.outerRadius });
        }
      }
    }
    state.sourceSegmentCount = anchors.length;
    state.compass = Object.freeze({
      layers: compassSchema.layers,
      anchors: Object.freeze(anchors),
      sourceModule: compassSchema.sourceModule,
      sourceVersion: compassSchema.sourceVersion,
      intentionallyTwoDimensional: compassSchema.intentionallyTwoDimensional === true
    });
  }

  function drawAmbientInstrument(now, strength) {
    const alpha = 0.055 * strength;
    const cx = state.width * 0.5;
    const cy = state.height * 0.5;
    const radius = Math.min(state.width, state.height) * 0.39;
    context.save();
    context.strokeStyle = `rgba(102,196,215,${alpha})`;
    context.lineWidth = 1;
    for (let ring = 1; ring <= 4; ring += 1) {
      context.beginPath();
      context.arc(cx, cy, radius * (0.38 + ring * 0.15), 0, TAU);
      context.stroke();
    }
    const sweep = (now * 0.000045) % TAU;
    context.strokeStyle = `rgba(244,214,128,${alpha * 1.55})`;
    context.beginPath();
    context.arc(cx, cy, radius * 0.82, sweep, sweep + Math.PI * 0.30);
    context.stroke();
    context.restore();
  }

  function drawStars(alpha, now) {
    if (alpha <= 0) return;
    context.save();
    for (let index = 0; index < state.stars.length; index += 1) {
      const star = state.stars[index];
      const pulse = star.rogue ? 0.82 + 0.18 * Math.sin(now * 0.0014 + index * 1.73) : 1;
      const a = star.alpha * alpha * pulse;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, TAU);
      context.fillStyle = `rgba(${star.color},${a})`;
      context.fill();
    }
    context.restore();
  }

  function roundedRectPath(x, y, width, height, radius) {
    const r = Math.min(radius, width * 0.5, height * 0.5);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function drawIsoCell(cell, x, y, size, alpha, rotation = 0) {
    const half = size * 0.5;
    const rise = size * 0.28;
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.globalAlpha = alpha;
    context.beginPath();
    context.moveTo(0, -rise);
    context.lineTo(half, 0);
    context.lineTo(0, rise);
    context.lineTo(-half, 0);
    context.closePath();
    context.fillStyle = cell.tone === "gold" ? "rgba(255,234,165,.92)" : "rgba(215,239,239,.88)";
    context.fill();
    context.beginPath();
    context.moveTo(-half, 0);
    context.lineTo(0, rise);
    context.lineTo(0, rise + half * 0.72);
    context.lineTo(-half, half * 0.72);
    context.closePath();
    context.fillStyle = cell.tone === "gold" ? "rgba(117,88,29,.86)" : "rgba(19,75,84,.82)";
    context.fill();
    context.beginPath();
    context.moveTo(half, 0);
    context.lineTo(0, rise);
    context.lineTo(0, rise + half * 0.72);
    context.lineTo(half, half * 0.72);
    context.closePath();
    context.fillStyle = cell.tone === "gold" ? "rgba(55,44,22,.88)" : "rgba(3,22,29,.92)";
    context.fill();
    context.restore();
  }

  function compassScreenPoint(anchor) {
    const radius = Math.min(state.width, state.height) * (state.width < 560 ? 0.38 : 0.32);
    return {
      x: state.width * 0.5 + anchor.x * radius,
      y: state.height * 0.49 - anchor.y * radius
    };
  }

  function buildTessellation(button, choice) {
    const rect = button.getBoundingClientRect();
    const baseSize = clamp(rect.height * 0.34, 14, 22);
    const horizontalStep = baseSize * 0.90;
    const verticalStep = baseSize * 0.72;
    const columns = Math.ceil(rect.width / horizontalStep) + 2;
    const rows = Math.ceil(rect.height / verticalStep) + 2;
    const random = randomFactory((choice === "BEGIN" ? 0x0b17e17 : 0x5a1f) ^ Math.round(rect.width * 17) ^ Math.round(rect.height * 31));
    const cells = [];
    const anchors = state.compass?.anchors || [];
    for (let row = -1; row < rows; row += 1) {
      for (let column = -1; column < columns; column += 1) {
        const x = rect.left + column * horizontalStep + (row % 2 ? horizontalStep * 0.5 : 0);
        const y = rect.top + row * verticalStep;
        if (x < rect.left - baseSize || x > rect.right + baseSize || y < rect.top - baseSize || y > rect.bottom + baseSize) continue;
        const useCompass = choice === "SKIP" ? random() < 0.86 : random() < 0.62;
        let target;
        if (useCompass && anchors.length) {
          target = compassScreenPoint(anchors[Math.floor(random() * anchors.length)]);
        } else {
          const star = state.stars[Math.floor(random() * state.stars.length)];
          target = { x: star?.x ?? state.width * 0.5, y: star?.y ?? state.height * 0.5 };
        }
        cells.push({
          x,
          y,
          targetX: target.x,
          targetY: target.y,
          size: baseSize * mix(0.72, 1.08, random()),
          delay: random() * 0.32,
          rotation: mix(-0.24, 0.24, random()),
          spin: mix(-1.4, 1.4, random()),
          tone: random() < 0.33 ? "gold" : "cool"
        });
      }
    }
    state.cells = cells;
    return rect;
  }

  function drawTessellation(elapsed, choice, buttonRect) {
    const tessStart = choice === "BEGIN" ? 140 : 100;
    const tessEnd = choice === "BEGIN" ? 820 : 650;
    const moveEnd = choice === "BEGIN" ? 2300 : 1550;
    if (elapsed < tessStart || elapsed > moveEnd || !state.cells.length) return;

    const tileProgress = clamp((elapsed - tessStart) / Math.max(1, tessEnd - tessStart));
    const moveProgress = clamp((elapsed - tessEnd) / Math.max(1, moveEnd - tessEnd));
    const easedMove = easeInOutCubic(moveProgress);

    context.save();
    if (elapsed <= tessEnd && buttonRect) {
      roundedRectPath(buttonRect.left, buttonRect.top, buttonRect.width, buttonRect.height, buttonRect.height * 0.5);
      context.clip();
    }
    for (const cell of state.cells) {
      const local = clamp((moveProgress - cell.delay) / Math.max(0.001, 1 - cell.delay));
      const travel = easeOutCubic(local);
      const x = mix(cell.x, cell.targetX, travel);
      const y = mix(cell.y, cell.targetY, travel) - Math.sin(local * Math.PI) * (choice === "BEGIN" ? 18 : 8);
      const size = cell.size * mix(0.92 + tileProgress * 0.08, 0.10, travel);
      const alpha = clamp(tileProgress * 1.3) * (1 - Math.pow(local, 2.2));
      drawIsoCell(cell, x, y, size, alpha, cell.rotation + cell.spin * easedMove);
    }
    context.restore();
  }

  function drawCompass(alpha, formProgress, now) {
    if (!state.compass || alpha <= 0) return;
    const radius = Math.min(state.width, state.height) * (state.width < 560 ? 0.38 : 0.32);
    const cx = state.width * 0.5;
    const cy = state.height * 0.49;
    const reveal = easeOutCubic(formProgress);
    const visibleLayers = Math.max(1, Math.ceil(state.compass.layers.length * reveal));
    const scanY = cy - radius + (radius * 2) * ((now * 0.00008) % 1);
    const mapX = value => cx + value * radius;
    const mapY = value => cy - value * radius;

    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";
    for (let index = 0; index < visibleLayers; index += 1) {
      const layer = state.compass.layers[index];
      const tone = materialTone(layer.materialKey || "");
      const stroke = tone === "gold"
        ? `rgba(244,214,128,${alpha * 0.92})`
        : tone === "muted"
          ? `rgba(235,241,232,${alpha * 0.30})`
          : `rgba(102,196,215,${alpha * 0.62})`;
      const fill = tone === "gold"
        ? `rgba(244,214,128,${alpha * 0.105})`
        : tone === "muted"
          ? `rgba(235,241,232,${alpha * 0.035})`
          : `rgba(102,196,215,${alpha * 0.055})`;
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = tone === "gold" ? 1.35 : 0.85;

      if (layer.type === "ANNULUS") {
        context.beginPath();
        context.arc(cx, cy, layer.outerRadius * radius, 0, TAU);
        context.stroke();
        context.beginPath();
        context.arc(cx, cy, layer.innerRadius * radius, 0, TAU);
        context.stroke();
      } else if (layer.type === "POLYGON" && Array.isArray(layer.vertices) && layer.vertices.length) {
        context.beginPath();
        context.moveTo(mapX(layer.vertices[0][0]), mapY(layer.vertices[0][1]));
        for (let vertex = 1; vertex < layer.vertices.length; vertex += 1) {
          context.lineTo(mapX(layer.vertices[vertex][0]), mapY(layer.vertices[vertex][1]));
        }
        context.closePath();
        context.fill();
        context.stroke();
      } else if (layer.type === "CIRCLE") {
        context.beginPath();
        context.arc(cx, cy, layer.radius * radius, 0, TAU);
        context.fill();
        context.stroke();
      }
    }

    context.strokeStyle = `rgba(102,196,215,${alpha * 0.12})`;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(cx - radius * 1.05, scanY);
    context.lineTo(cx + radius * 1.05, scanY);
    context.stroke();
    context.restore();
  }

  function setMode(next, transition) {
    if (state.mode === next) return;
    state.mode = next;
    state.stateRevision += 1;
    state.lastTransition = transition || next;
    root.dataset.state = next;
  }

  function updateDomForIdle() {
    gate.hidden = false;
    gate.style.opacity = "1";
    gate.style.pointerEvents = "auto";
    card.style.opacity = "1";
    card.style.transform = "none";
    beginButton.style.visibility = "visible";
    skipButton.style.visibility = "visible";
    beginButton.removeAttribute("aria-pressed");
    skipButton.removeAttribute("aria-pressed");
    endpoint.hidden = true;
    state.endpointShown = false;
    statusNode.textContent = state.sourceGeometryReady ? "Orientation preview ready." : "Compass source geometry unavailable.";
  }

  function completeSlice(choice) {
    setMode("COMPLETE", `${choice}_COMPLETE`);
    gate.hidden = true;
    endpoint.hidden = false;
    state.endpointShown = true;
    statusNode.textContent = choice === "SKIP" ? "Skip transition resolved to the Compass endpoint." : "Orientation transition resolved to the Compass endpoint.";
  }

  function beginTransition(choice, button) {
    if (state.mode !== "IDLE") return;
    state.choice = choice;
    state.startedAt = performance.now();
    state.endpointShown = false;
    setMode("PLAYING", `${choice}_START`);
    button.setAttribute("aria-pressed", "true");
    const buttonRect = buildTessellation(button, choice);
    state.buttonRect = Object.freeze({ left: buttonRect.left, top: buttonRect.top, width: buttonRect.width, height: buttonRect.height });
    statusNode.textContent = choice === "SKIP" ? "Skip transition in progress." : "Orientation transition in progress.";
  }

  function renderReduced(elapsed) {
    const duration = state.choice === "SKIP" ? 300 : 450;
    const progress = clamp(elapsed / duration);
    gate.style.opacity = String(1 - progress);
    if (progress > 0.08) {
      beginButton.style.visibility = "hidden";
      skipButton.style.visibility = "hidden";
    }
    drawStars(mix(0.22, 0.82, progress), elapsed);
    drawCompass(progress, progress, elapsed);
    if (progress >= 1) completeSlice(state.choice);
  }

  function renderPlaying(now) {
    const elapsed = now - state.startedAt;
    if (state.reducedMotion) {
      renderReduced(elapsed);
      return;
    }

    const choice = state.choice;
    const isBegin = choice === "BEGIN";
    const tessStart = isBegin ? 140 : 100;
    const tessEnd = isBegin ? 820 : 650;
    const finish = isBegin ? 4350 : 2450;
    const compassStart = isBegin ? 1700 : 900;
    const compassEnd = isBegin ? 3550 : 2200;
    const starStart = isBegin ? 900 : 520;
    const starEnd = isBegin ? 2300 : 1450;

    const gateFade = clamp((elapsed - tessStart * 0.72) / Math.max(1, tessEnd + 420 - tessStart * 0.72));
    gate.style.opacity = String(1 - gateFade);
    card.style.transform = `scale(${mix(1, 0.988, gateFade)})`;
    if (elapsed >= tessStart) {
      beginButton.style.visibility = "hidden";
      skipButton.style.visibility = "hidden";
    }

    drawStars(mix(0.16, 0.84, easeOutCubic(clamp((elapsed - starStart) / Math.max(1, starEnd - starStart)))), now);
    drawTessellation(elapsed, choice, state.buttonRect);
    const compassProgress = clamp((elapsed - compassStart) / Math.max(1, compassEnd - compassStart));
    drawCompass(compassProgress, compassProgress, now);

    if (elapsed >= finish) completeSlice(choice);
  }

  function renderFrame(now) {
    state.frameCount += 1;
    context.clearRect(0, 0, state.width, state.height);
    const ambient = state.mode === "IDLE" ? 1 : state.mode === "PLAYING" ? 0.58 : 0.34;
    drawAmbientInstrument(now, ambient);

    if (state.mode === "IDLE") {
      drawStars(0.12, now);
    } else if (state.mode === "PLAYING") {
      renderPlaying(now);
    } else if (state.mode === "COMPLETE") {
      drawStars(0.82, now);
      drawCompass(1, 1, now);
    }
  }

  let rafHandle = 0;
  const scheduleMasterFrame = () => { rafHandle = requestAnimationFrame(masterFrame); };
  function masterFrame(now) {
    try {
      renderFrame(now);
    } catch (error) {
      state.severeRuntimeError = String(error?.message || error);
      setMode("HELD", "RUNTIME_ERROR");
      statusNode.textContent = "Preview held after a runtime error.";
    }
    scheduleMasterFrame();
  }

  function resetSlice() {
    state.choice = null;
    state.startedAt = 0;
    state.cells = [];
    state.buttonRect = null;
    setMode("IDLE", "REPLAY_RESET");
    updateDomForIdle();
    beginButton.focus({ preventScroll: true });
  }

  beginButton.addEventListener("click", () => beginTransition("BEGIN", beginButton));
  skipButton.addEventListener("click", () => beginTransition("SKIP", skipButton));
  replayButton.addEventListener("click", resetSlice);
  addEventListener("resize", resizeCanvas, { passive: true });
  motionQuery.addEventListener?.("change", event => { state.reducedMotion = Boolean(event.matches); });

  resizeCanvas();
  updateDomForIdle();
  scheduleMasterFrame();
})();
