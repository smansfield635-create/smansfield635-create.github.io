import { SCENE_SPEC } from "./scene-spec.js";
import { LawsWebGL2Adapter } from "./renderer-webgl2.js";

const root = document.documentElement;
const canvas = document.querySelector("#geometry-canvas");
const sceneHost = document.querySelector("#scene-host");
const stageButtons = [...document.querySelectorAll("[data-stage]")];
const motionButtons = [...document.querySelectorAll("[data-motion]")];
const lensTabs = [...document.querySelectorAll('[role="tab"]')];
const lensPanels = [...document.querySelectorAll('[role="tabpanel"]')];
const previousButton = document.querySelector("#previous-stage");
const nextButton = document.querySelector("#next-stage");
const capacityInput = document.querySelector("#capacity");
const pressureInput = document.querySelector("#pressure");
const receiptOutput = document.querySelector("#render-receipt");
const codexGrid = document.querySelector("#primitive-codex-grid");

const stageOrder = SCENE_SPEC.primitives.map((primitive) => primitive.id);
let stageIndex = 0;
let motionMode = matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";
let renderer = null;
let visible = true;
let frameToken = 0;
let animationDeadline = 0;

function currentPrimitive() {
  return SCENE_SPEC.primitives[stageIndex];
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function renderCodex() {
  codexGrid.innerHTML = "";
  for (const primitive of SCENE_SPEC.primitives) {
    const card = document.createElement("article");
    card.className = "codex-card";
    card.style.setProperty("--card-color", primitive.color);
    card.innerHTML = `
      <span aria-hidden="true">${primitive.index}</span>
      <h3>${primitive.label}</h3>
      <p>${primitive.practical}</p>
      <p><strong>Declared meaning:</strong> ${primitive.semanticMeaning.replaceAll("_", " ").toLowerCase()}</p>
    `;
    codexGrid.append(card);
  }
}

function updateStage(index, { focus = false } = {}) {
  stageIndex = (index + stageOrder.length) % stageOrder.length;
  const primitive = currentPrimitive();

  stageButtons.forEach((button, buttonIndex) => {
    const active = buttonIndex === stageIndex;
    button.toggleAttribute("aria-current", active);
    if (active && focus) button.focus({ preventScroll: true });
  });

  setText("#stage-eyebrow", `Stage ${primitive.index} of ${stageOrder.length} · ${primitive.label}`);
  setText("#scene-title", primitive.storyTitle);
  setText("#primitive-name", primitive.label.toUpperCase());
  setText("#primitive-meaning", primitive.semanticMeaning.replaceAll("_", " · ").toLowerCase());
  setText("#progress-label", `${primitive.index} / ${stageOrder.length}`);
  setText("#meaning-title", primitive.storyTitle);
  setText("#practical-copy", primitive.practical);
  setText("#trajectory-copy", primitive.trajectory);
  setText("#engineering-title", primitive.engineeringTitle);
  setText("#engineering-copy", primitive.engineering);
  setText("#engineering-primitive", primitive.label.toUpperCase());
  setText("#engineering-relation", primitive.relation);
  setText("#engineering-motion", primitive.motionPurpose);
  setText("#engineering-static", primitive.staticEquivalent);
  setText("#empirical-title", "The visual relationship does not upgrade evidence status.");
  setText("#empirical-copy", primitive.empirical);

  renderer?.setState({ activePrimitive: primitive.id });
  scheduleFrames(900);
  updateReceipt();
}

function setMotionMode(mode) {
  motionMode = mode;
  root.dataset.motionMode = mode;
  motionButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.motion === mode));
  });
  renderer?.setMotionMode(mode);
  if (mode !== "static") scheduleFrames(900);
  updateReceipt();
}

function setLens(tab) {
  const targetId = tab.getAttribute("aria-controls");
  lensTabs.forEach((candidate) => {
    const selected = candidate === tab;
    candidate.setAttribute("aria-selected", String(selected));
    candidate.tabIndex = selected ? 0 : -1;
  });
  lensPanels.forEach((panel) => {
    panel.hidden = panel.id !== targetId;
  });
}

function updateParameters() {
  const capacity = Number(capacityInput.value);
  const pressure = Number(pressureInput.value);
  const available = Math.max(0, capacity - pressure);
  setText("#capacity-output", String(capacity));
  setText("#pressure-output", String(pressure));
  setText("#available-output", String(available));
  renderer?.setParameters({ capacity, pressure, available });
  scheduleFrames(600);
  updateReceipt();
}

function deviceClass(width) {
  if (width < 620) return "phone";
  if (width < 1020) return "tablet";
  return "desktop";
}

function resizeScene() {
  const bounds = sceneHost.getBoundingClientRect();
  renderer?.resize({ width: bounds.width, height: bounds.height }, deviceClass(bounds.width));
  scheduleFrames(120);
}

function scheduleFrames(duration = 750) {
  animationDeadline = Math.max(animationDeadline, performance.now() + duration);
  if (!frameToken) frameToken = requestAnimationFrame(frame);
}

function frame(now) {
  frameToken = 0;
  if (visible && !document.hidden && motionMode !== "static") {
    renderer?.render({ now });
  }
  if (now < animationDeadline && visible && !document.hidden && motionMode !== "static") {
    frameToken = requestAnimationFrame(frame);
  }
  updateReceipt();
}

function updateReceipt() {
  if (!receiptOutput) return;
  const fallbackReceipt = {
    rendererId: "STATIC_SVG_EQUIVALENT",
    sceneSpecId: SCENE_SPEC.sceneId,
    canonicalStateId: currentPrimitive().id,
    parameterState: {
      capacity: Number(capacityInput.value),
      pressure: Number(pressureInput.value),
      available: Math.max(0, Number(capacityInput.value) - Number(pressureInput.value))
    },
    motionMode,
    frameStatus: visible ? "READY" : "SUSPENDED",
    contextStatus: renderer ? "WEBGL2_READY" : "STATIC_EQUIVALENT_ACTIVE",
    evidenceStatus: SCENE_SPEC.evidenceStatus,
    errors: []
  };
  receiptOutput.textContent = JSON.stringify(renderer?.captureReceipt() || fallbackReceipt, null, 2);
}

function initializeRenderer() {
  try {
    renderer = new LawsWebGL2Adapter().initialize(SCENE_SPEC, canvas);
    renderer.setMotionMode(motionMode);
    renderer.setState({ activePrimitive: currentPrimitive().id });
    updateParameters();
    resizeScene();
  } catch (error) {
    console.warn("WebGL2 prototype unavailable; using static equivalent.", error);
    renderer = null;
    setMotionMode("static");
    setText("#scene-status", "Static equivalent active");
  }
}

stageButtons.forEach((button, index) => {
  button.addEventListener("click", () => updateStage(index));
});

previousButton.addEventListener("click", () => updateStage(stageIndex - 1));
nextButton.addEventListener("click", () => updateStage(stageIndex + 1));

motionButtons.forEach((button) => {
  button.addEventListener("click", () => setMotionMode(button.dataset.motion));
});

lensTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => setLens(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + lensTabs.length) % lensTabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % lensTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lensTabs.length - 1;
    setLens(lensTabs[nextIndex]);
    lensTabs[nextIndex].focus();
  });
});

capacityInput.addEventListener("input", updateParameters);
pressureInput.addEventListener("input", updateParameters);

sceneHost.addEventListener("pointermove", (event) => {
  if (!renderer || motionMode !== "full") return;
  const bounds = sceneHost.getBoundingClientRect();
  renderer.setPointer({
    x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
    y: ((event.clientY - bounds.top) / bounds.height) * 2 - 1
  });
  scheduleFrames(120);
});

sceneHost.addEventListener("pointerleave", () => {
  renderer?.setPointer({ x: 0, y: 0 });
  scheduleFrames(240);
});

document.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement) return;
  if (event.key === "ArrowLeft") updateStage(stageIndex - 1);
  if (event.key === "ArrowRight") updateStage(stageIndex + 1);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) renderer?.suspend();
  else {
    renderer?.resume();
    scheduleFrames(220);
  }
  updateReceipt();
});

const observer = new IntersectionObserver((entries) => {
  visible = entries[0]?.isIntersecting ?? true;
  if (visible) {
    renderer?.resume();
    scheduleFrames(220);
  } else {
    renderer?.suspend();
  }
  updateReceipt();
}, { threshold: .02 });
observer.observe(sceneHost);

const resizeObserver = new ResizeObserver(resizeScene);
resizeObserver.observe(sceneHost);

matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (event) => {
  if (event.matches && motionMode === "full") setMotionMode("reduced");
});

window.addEventListener("pagehide", () => renderer?.dispose(), { once: true });

renderCodex();
setText("#long-description", SCENE_SPEC.longDescription);
setMotionMode(motionMode);
setLens(lensTabs[0]);
initializeRenderer();
updateStage(0);
updateReceipt();
