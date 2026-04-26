/*
  Diamond Gate Bridge — Gauges Runtime
  File: /gauges/gauges_runtime.js
  Scope: Runtime-specific four-gauge system.
  Rule: Axis/spin/globe behavior first. Control panel intentionally excluded.
*/

(function () {
  "use strict";

  const RUNTIME_NAME = "DGBGaugesRuntime";
  const VERSION = "1.0.0";

  const DEFAULTS = Object.freeze({
    mountSelectors: [
      "#gauges-runtime",
      "[data-gauges-runtime]",
      "#gauges-root",
      ".gauges-runtime"
    ],
    autoMount: true,
    axis: {
      x: -18,
      y: 34,
      z: 0
    },
    spin: {
      velocity: 0.08,
      drag: 0.992,
      minVelocity: 0.018,
      maxVelocity: 0.22,
      pulse: 0.0009
    },
    frame: {
      targetFps: 60,
      maxDeltaMs: 48
    }
  });

  const GAUGE_DEFINITIONS = Object.freeze([
    {
      id: "alignment",
      label: "Alignment",
      shortLabel: "A",
      description: "Measures whether the visible surface is holding its intended axis.",
      min: 0,
      max: 100,
      value: 76
    },
    {
      id: "coherence",
      label: "Coherence",
      shortLabel: "C",
      description: "Measures whether the four-gauge system is moving as one structure.",
      min: 0,
      max: 100,
      value: 82
    },
    {
      id: "pressure",
      label: "Pressure",
      shortLabel: "P",
      description: "Measures runtime load, tension, and edge force.",
      min: 0,
      max: 100,
      value: 41
    },
    {
      id: "drift",
      label: "Drift",
      shortLabel: "D",
      description: "Measures deviation from the active axis and expected trace.",
      min: 0,
      max: 100,
      value: 18,
      inverted: true
    }
  ]);

  const runtimeState = {
    version: VERSION,
    mounted: false,
    mount: null,
    root: null,
    stage: null,
    diamond: null,
    ring: null,
    core: null,
    readout: null,
    gaugeNodes: new Map(),
    animationFrame: null,
    lastTime: 0,
    rotation: 0,
    velocity: DEFAULTS.spin.velocity,
    axis: {
      x: DEFAULTS.axis.x,
      y: DEFAULTS.axis.y,
      z: DEFAULTS.axis.z
    },
    gauges: createInitialGauges(),
    config: clone(DEFAULTS),
    destroyed: false
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function round(value, places) {
    const factor = Math.pow(10, places || 0);
    return Math.round(value * factor) / factor;
  }

  function createInitialGauges() {
    const output = {};
    for (const gauge of GAUGE_DEFINITIONS) {
      output[gauge.id] = {
        id: gauge.id,
        label: gauge.label,
        shortLabel: gauge.shortLabel,
        description: gauge.description,
        min: gauge.min,
        max: gauge.max,
        value: gauge.value,
        target: gauge.value,
        inverted: Boolean(gauge.inverted)
      };
    }
    return output;
  }

  function findMount(config) {
    for (const selector of config.mountSelectors) {
      const found = document.querySelector(selector);
      if (found) return found;
    }

    const fallback = document.createElement("section");
    fallback.id = "gauges-runtime";
    fallback.setAttribute("data-gauges-runtime", "auto-created");
    document.body.appendChild(fallback);
    return fallback;
  }

  function injectStyle() {
    if (document.getElementById("dgb-gauges-runtime-style")) return;

    const style = document.createElement("style");
    style.id = "dgb-gauges-runtime-style";
    style.textContent = `
      .dgb-gauges-shell {
        box-sizing: border-box;
        width: min(100%, 1120px);
        margin: 0 auto;
        padding: 28px 18px;
        color: #f4f4f0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .dgb-gauges-shell *,
      .dgb-gauges-shell *::before,
      .dgb-gauges-shell *::after {
        box-sizing: border-box;
      }

      .dgb-gauges-panel {
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 28px;
        background:
          radial-gradient(circle at 50% 35%, rgba(255,255,255,0.11), transparent 27%),
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 22%),
          linear-gradient(180deg, rgba(16,18,24,0.96), rgba(5,7,11,0.98));
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
        min-height: 540px;
      }

      .dgb-gauges-panel::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image:
          radial-gradient(circle, rgba(255,255,255,0.45) 0 1px, transparent 1.5px),
          radial-gradient(circle, rgba(255,255,255,0.28) 0 1px, transparent 1.5px);
        background-size: 89px 89px, 137px 137px;
        background-position: 12px 18px, 44px 51px;
        opacity: 0.18;
        pointer-events: none;
      }

      .dgb-gauges-header {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 24px 24px 0;
      }

      .dgb-gauges-title {
        margin: 0;
        font-size: clamp(1.5rem, 3vw, 2.35rem);
        line-height: 1.05;
        letter-spacing: -0.04em;
      }

      .dgb-gauges-subtitle {
        margin: 10px 0 0;
        max-width: 720px;
        color: rgba(244, 244, 240, 0.72);
        font-size: 0.96rem;
        line-height: 1.55;
      }

      .dgb-gauges-badge {
        flex: 0 0 auto;
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 999px;
        padding: 8px 12px;
        color: rgba(244, 244, 240, 0.78);
        background: rgba(255, 255, 255, 0.06);
        font-size: 0.72rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .dgb-gauges-body {
        position: relative;
        z-index: 2;
        display: grid;
        grid-template-columns: minmax(260px, 1fr) minmax(280px, 0.78fr);
        gap: 28px;
        align-items: center;
        padding: 28px 24px 24px;
      }

      .dgb-gauges-stage {
        position: relative;
        min-height: 390px;
        display: grid;
        place-items: center;
        perspective: 1100px;
      }

      .dgb-gauge-orbit {
        position: absolute;
        width: min(72vw, 420px);
        aspect-ratio: 1;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 999px;
        transform: rotateX(64deg) rotateZ(-16deg);
        opacity: 0.72;
      }

      .dgb-gauge-orbit::before,
      .dgb-gauge-orbit::after {
        content: "";
        position: absolute;
        inset: 10%;
        border: 1px solid rgba(255, 255, 255, 0.09);
        border-radius: 999px;
      }

      .dgb-gauge-orbit::after {
        inset: 24%;
      }

      .dgb-gauge-diamond {
        position: relative;
        width: min(58vw, 310px);
        aspect-ratio: 1;
        transform-style: preserve-3d;
        will-change: transform;
      }

      .dgb-gauge-diamond-core {
        position: absolute;
        inset: 11%;
        transform: rotate(45deg);
        border: 1px solid rgba(255, 255, 255, 0.24);
        border-radius: 18px;
        background:
          linear-gradient(135deg, rgba(255,255,255,0.19), rgba(255,255,255,0.03) 46%, rgba(255,255,255,0.13)),
          radial-gradient(circle at 30% 30%, rgba(255,255,255,0.20), transparent 38%);
        box-shadow:
          inset 0 0 38px rgba(255,255,255,0.07),
          0 0 48px rgba(255,255,255,0.08);
      }

      .dgb-gauge-axis-line {
        position: absolute;
        left: 50%;
        top: 4%;
        width: 1px;
        height: 92%;
        transform: translateX(-50%);
        background: linear-gradient(180deg, transparent, rgba(255,255,255,0.42), transparent);
      }

      .dgb-gauge-axis-line.horizontal {
        top: 50%;
        left: 4%;
        width: 92%;
        height: 1px;
        transform: translateY(-50%);
      }

      .dgb-gauge-node {
        position: absolute;
        width: 74px;
        min-height: 74px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 22px;
        background: rgba(4, 6, 10, 0.72);
        box-shadow: 0 18px 34px rgba(0, 0, 0, 0.32);
        backdrop-filter: blur(10px);
        transform: translate(-50%, -50%);
      }

      .dgb-gauge-node[data-gauge="alignment"] {
        left: 50%;
        top: 7%;
      }

      .dgb-gauge-node[data-gauge="coherence"] {
        left: 93%;
        top: 50%;
      }

      .dgb-gauge-node[data-gauge="pressure"] {
        left: 50%;
        top: 93%;
      }

      .dgb-gauge-node[data-gauge="drift"] {
        left: 7%;
        top: 50%;
      }

      .dgb-gauge-node-label {
        display: block;
        font-size: 0.72rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(244, 244, 240, 0.62);
      }

      .dgb-gauge-node-value {
        display: block;
        margin-top: 4px;
        font-size: 1.15rem;
        font-weight: 750;
        color: rgba(244, 244, 240, 0.96);
      }

      .dgb-gauges-readout {
        display: grid;
        gap: 12px;
      }

      .dgb-gauge-card {
        border: 1px solid rgba(255, 255, 255, 0.13);
        border-radius: 18px;
        padding: 14px;
        background: rgba(255, 255, 255, 0.055);
      }

      .dgb-gauge-card-top {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: baseline;
      }

      .dgb-gauge-card-title {
        font-size: 0.94rem;
        font-weight: 720;
      }

      .dgb-gauge-card-score {
        color: rgba(244, 244, 240, 0.72);
        font-size: 0.88rem;
      }

      .dgb-gauge-card-bar {
        position: relative;
        overflow: hidden;
        height: 8px;
        margin-top: 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.10);
      }

      .dgb-gauge-card-fill {
        position: absolute;
        inset: 0 auto 0 0;
        width: 0%;
        border-radius: inherit;
        background: rgba(255, 255, 255, 0.78);
        transition: width 180ms linear;
      }

      .dgb-gauge-card-description {
        margin: 9px 0 0;
        color: rgba(244, 244, 240, 0.62);
        font-size: 0.78rem;
        line-height: 1.42;
      }

      .dgb-gauges-footer {
        position: relative;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 0 24px 24px;
        color: rgba(244, 244, 240, 0.56);
        font-size: 0.76rem;
      }

      .dgb-gauges-footer span {
        border: 1px solid rgba(255, 255, 255, 0.11);
        border-radius: 999px;
        padding: 6px 9px;
        background: rgba(255,255,255,0.04);
      }

      @media (max-width: 840px) {
        .dgb-gauges-header {
          display: block;
        }

        .dgb-gauges-badge {
          display: inline-flex;
          margin-top: 14px;
        }

        .dgb-gauges-body {
          grid-template-columns: 1fr;
        }

        .dgb-gauges-stage {
          min-height: 330px;
        }

        .dgb-gauge-node {
          width: 66px;
          min-height: 66px;
          border-radius: 18px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .dgb-gauge-diamond {
          transition: transform 240ms ease;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function createGaugeNode(gauge) {
    const node = createElement("div", "dgb-gauge-node");
    node.setAttribute("data-gauge", gauge.id);
    node.setAttribute("aria-label", `${gauge.label} gauge`);

    const label = createElement("span", "dgb-gauge-node-label", gauge.shortLabel);
    const value = createElement("span", "dgb-gauge-node-value", String(Math.round(gauge.value)));

    node.appendChild(label);
    node.appendChild(value);

    return {
      root: node,
      value
    };
  }

  function createGaugeCard(gauge) {
    const card = createElement("article", "dgb-gauge-card");
    card.setAttribute("data-gauge-card", gauge.id);

    const top = createElement("div", "dgb-gauge-card-top");
    const title = createElement("div", "dgb-gauge-card-title", gauge.label);
    const score = createElement("div", "dgb-gauge-card-score", `${Math.round(gauge.value)} / 100`);

    const bar = createElement("div", "dgb-gauge-card-bar");
    const fill = createElement("div", "dgb-gauge-card-fill");

    const description = createElement("p", "dgb-gauge-card-description", gauge.description);

    bar.appendChild(fill);
    top.appendChild(title);
    top.appendChild(score);
    card.appendChild(top);
    card.appendChild(bar);
    card.appendChild(description);

    return {
      root: card,
      score,
      fill
    };
  }

  function buildDom(mount) {
    injectStyle();

    mount.innerHTML = "";

    const shell = createElement("div", "dgb-gauges-shell");
    const panel = createElement("div", "dgb-gauges-panel");

    const header = createElement("header", "dgb-gauges-header");
    const headerText = createElement("div");
    const title = createElement("h2", "dgb-gauges-title", "Four Gauges Runtime");
    const subtitle = createElement(
      "p",
      "dgb-gauges-subtitle",
      "Runtime-specific gauge surface. Axis, spin, and globe behavior are established before any control-panel layer is introduced."
    );
    const badge = createElement("div", "dgb-gauges-badge", "Runtime Owner");

    headerText.appendChild(title);
    headerText.appendChild(subtitle);
    header.appendChild(headerText);
    header.appendChild(badge);

    const body = createElement("div", "dgb-gauges-body");
    const stage = createElement("div", "dgb-gauges-stage");
    const orbit = createElement("div", "dgb-gauge-orbit");
    const diamond = createElement("div", "dgb-gauge-diamond");
    const core = createElement("div", "dgb-gauge-diamond-core");
    const axisVertical = createElement("div", "dgb-gauge-axis-line");
    const axisHorizontal = createElement("div", "dgb-gauge-axis-line horizontal");

    diamond.appendChild(core);
    diamond.appendChild(axisVertical);
    diamond.appendChild(axisHorizontal);

    runtimeState.gaugeNodes.clear();

    for (const gauge of Object.values(runtimeState.gauges)) {
      const gaugeNode = createGaugeNode(gauge);
      runtimeState.gaugeNodes.set(gauge.id, gaugeNode);
      diamond.appendChild(gaugeNode.root);
    }

    stage.appendChild(orbit);
    stage.appendChild(diamond);

    const readout = createElement("div", "dgb-gauges-readout");
    for (const gauge of Object.values(runtimeState.gauges)) {
      const card = createGaugeCard(gauge);
      runtimeState.gaugeNodes.get(gauge.id).card = card;
      readout.appendChild(card.root);
    }

    body.appendChild(stage);
    body.appendChild(readout);

    const footer = createElement("footer", "dgb-gauges-footer");
    footer.appendChild(createElement("span", "", "Trace: GS → BS → CP → MP → MPK → OG"));
    footer.appendChild(createElement("span", "", "Axis: active"));
    footer.appendChild(createElement("span", "", "Spin: natural"));
    footer.appendChild(createElement("span", "", `v${VERSION}`));

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);
    shell.appendChild(panel);
    mount.appendChild(shell);

    runtimeState.root = shell;
    runtimeState.stage = stage;
    runtimeState.ring = orbit;
    runtimeState.diamond = diamond;
    runtimeState.core = core;
    runtimeState.readout = readout;
  }

  function computeRuntimeSignals(deltaMs) {
    const seconds = deltaMs / 1000;
    const spin = runtimeState.config.spin;

    const axisMagnitude =
      Math.abs(runtimeState.axis.x) +
      Math.abs(runtimeState.axis.y) +
      Math.abs(runtimeState.axis.z);

    const alignmentTarget = clamp(100 - axisMagnitude * 0.72 + Math.sin(runtimeState.rotation / 70) * 4, 0, 100);
    const coherenceTarget = clamp(72 + Math.cos(runtimeState.rotation / 90) * 9 - Math.abs(runtimeState.velocity - spin.velocity) * 80, 0, 100);
    const pressureTarget = clamp(28 + Math.abs(runtimeState.velocity) * 210 + Math.sin(runtimeState.rotation / 45) * 5, 0, 100);
    const driftTarget = clamp(100 - alignmentTarget + Math.abs(runtimeState.velocity - spin.velocity) * 180, 0, 100);

    setGaugeTarget("alignment", alignmentTarget);
    setGaugeTarget("coherence", coherenceTarget);
    setGaugeTarget("pressure", pressureTarget);
    setGaugeTarget("drift", driftTarget);

    runtimeState.velocity += Math.sin(runtimeState.rotation / 160) * spin.pulse;
    runtimeState.velocity *= spin.drag;

    if (Math.abs(runtimeState.velocity) < spin.minVelocity) {
      runtimeState.velocity = spin.minVelocity;
    }

    runtimeState.velocity = clamp(runtimeState.velocity, -spin.maxVelocity, spin.maxVelocity);
    runtimeState.rotation += runtimeState.velocity * deltaMs * seconds * 60;
  }

  function setGaugeTarget(id, target) {
    const gauge = runtimeState.gauges[id];
    if (!gauge) return;
    gauge.target = clamp(target, gauge.min, gauge.max);
  }

  function easeGaugeValues() {
    for (const gauge of Object.values(runtimeState.gauges)) {
      const diff = gauge.target - gauge.value;
      gauge.value += diff * 0.08;
      gauge.value = clamp(gauge.value, gauge.min, gauge.max);
    }
  }

  function render() {
    if (!runtimeState.diamond) return;

    const rotation = runtimeState.rotation;
    const axis = runtimeState.axis;

    runtimeState.diamond.style.transform =
      `rotateX(${axis.x}deg) rotateY(${axis.y + rotation}deg) rotateZ(${axis.z}deg)`;

    if (runtimeState.ring) {
      runtimeState.ring.style.transform =
        `rotateX(${64 + axis.x * 0.08}deg) rotateZ(${-16 + rotation * 0.08}deg)`;
    }

    for (const gauge of Object.values(runtimeState.gauges)) {
      const nodes = runtimeState.gaugeNodes.get(gauge.id);
      if (!nodes) continue;

      const displayValue = Math.round(gauge.value);
      const normalized = clamp((gauge.value - gauge.min) / (gauge.max - gauge.min), 0, 1);
      const fillValue = gauge.inverted ? 1 - normalized : normalized;

      if (nodes.value) {
        nodes.value.textContent = String(displayValue);
      }

      if (nodes.card) {
        nodes.card.score.textContent = `${displayValue} / 100`;
        nodes.card.fill.style.width = `${round(fillValue * 100, 1)}%`;
      }
    }
  }

  function tick(timestamp) {
    if (runtimeState.destroyed) return;

    if (!runtimeState.lastTime) runtimeState.lastTime = timestamp;

    const rawDelta = timestamp - runtimeState.lastTime;
    const deltaMs = clamp(rawDelta, 0, runtimeState.config.frame.maxDeltaMs);

    runtimeState.lastTime = timestamp;

    computeRuntimeSignals(deltaMs);
    easeGaugeValues();
    render();

    runtimeState.animationFrame = window.requestAnimationFrame(tick);
  }

  function start() {
    stop();
    runtimeState.destroyed = false;
    runtimeState.lastTime = 0;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render();
      return;
    }

    runtimeState.animationFrame = window.requestAnimationFrame(tick);
  }

  function stop() {
    if (runtimeState.animationFrame) {
      window.cancelAnimationFrame(runtimeState.animationFrame);
      runtimeState.animationFrame = null;
    }
  }

  function mount(options) {
    if (typeof document === "undefined") return api;

    const config = Object.assign({}, clone(DEFAULTS), options || {});
    config.axis = Object.assign({}, clone(DEFAULTS.axis), (options && options.axis) || {});
    config.spin = Object.assign({}, clone(DEFAULTS.spin), (options && options.spin) || {});
    config.frame = Object.assign({}, clone(DEFAULTS.frame), (options && options.frame) || {});
    config.mountSelectors =
      options && Array.isArray(options.mountSelectors)
        ? options.mountSelectors.slice()
        : DEFAULTS.mountSelectors.slice();

    runtimeState.config = config;
    runtimeState.mount = options && options.mount ? options.mount : findMount(config);

    buildDom(runtimeState.mount);

    runtimeState.mounted = true;
    runtimeState.destroyed = false;

    start();

    return api;
  }

  function destroy() {
    stop();

    if (runtimeState.mount && runtimeState.root && runtimeState.mount.contains(runtimeState.root)) {
      runtimeState.mount.removeChild(runtimeState.root);
    }

    runtimeState.mounted = false;
    runtimeState.destroyed = true;
    runtimeState.mount = null;
    runtimeState.root = null;
    runtimeState.stage = null;
    runtimeState.diamond = null;
    runtimeState.ring = null;
    runtimeState.core = null;
    runtimeState.readout = null;
    runtimeState.gaugeNodes.clear();

    return api;
  }

  function updateGauge(id, value) {
    const gauge = runtimeState.gauges[id];
    if (!gauge) {
      return {
        ok: false,
        reason: "UNKNOWN_GAUGE",
        id
      };
    }

    gauge.target = clamp(Number(value), gauge.min, gauge.max);

    return {
      ok: true,
      id,
      target: gauge.target
    };
  }

  function updateGauges(values) {
    if (!values || typeof values !== "object") {
      return {
        ok: false,
        reason: "VALUES_OBJECT_REQUIRED"
      };
    }

    const results = {};
    for (const key of Object.keys(values)) {
      results[key] = updateGauge(key, values[key]);
    }

    return {
      ok: true,
      results
    };
  }

  function setAxis(axis) {
    if (!axis || typeof axis !== "object") {
      return {
        ok: false,
        reason: "AXIS_OBJECT_REQUIRED"
      };
    }

    runtimeState.axis.x = clamp(Number(axis.x ?? runtimeState.axis.x), -70, 70);
    runtimeState.axis.y = clamp(Number(axis.y ?? runtimeState.axis.y), -180, 180);
    runtimeState.axis.z = clamp(Number(axis.z ?? runtimeState.axis.z), -70, 70);

    render();

    return {
      ok: true,
      axis: Object.assign({}, runtimeState.axis)
    };
  }

  function setSpin(value) {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
      return {
        ok: false,
        reason: "FINITE_NUMBER_REQUIRED"
      };
    }

    runtimeState.velocity = clamp(
      numeric,
      -runtimeState.config.spin.maxVelocity,
      runtimeState.config.spin.maxVelocity
    );

    return {
      ok: true,
      velocity: runtimeState.velocity
    };
  }

  function getState() {
    return {
      name: RUNTIME_NAME,
      version: VERSION,
      mounted: runtimeState.mounted,
      axis: Object.assign({}, runtimeState.axis),
      rotation: runtimeState.rotation,
      velocity: runtimeState.velocity,
      gauges: clone(runtimeState.gauges),
      trace: "GS → BS → CP → MP → MPK → OG"
    };
  }

  function validate() {
    const state = getState();
    const requiredGaugeIds = GAUGE_DEFINITIONS.map((gauge) => gauge.id);
    const presentGaugeIds = Object.keys(state.gauges);

    const missing = requiredGaugeIds.filter((id) => !presentGaugeIds.includes(id));
    const extra = presentGaugeIds.filter((id) => !requiredGaugeIds.includes(id));

    const valuesValid = presentGaugeIds.every((id) => {
      const gauge = state.gauges[id];
      return (
        Number.isFinite(gauge.value) &&
        gauge.value >= gauge.min &&
        gauge.value <= gauge.max
      );
    });

    const ok =
      state.mounted &&
      missing.length === 0 &&
      extra.length === 0 &&
      valuesValid &&
      state.trace === "GS → BS → CP → MP → MPK → OG";

    return {
      ok,
      runtime: RUNTIME_NAME,
      version: VERSION,
      mounted: state.mounted,
      requiredGaugeIds,
      missing,
      extra,
      valuesValid,
      trace: state.trace
    };
  }

  const api = Object.freeze({
    name: RUNTIME_NAME,
    version: VERSION,
    mount,
    destroy,
    start,
    stop,
    updateGauge,
    updateGauges,
    setAxis,
    setSpin,
    getState,
    validate
  });

  window[RUNTIME_NAME] = api;

  function autoMount() {
    if (!DEFAULTS.autoMount) return;
    if (runtimeState.mounted) return;
    mount();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  } else {
    autoMount();
  }
})();
