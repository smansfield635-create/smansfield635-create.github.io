import { FIRST_RESEARCH_CONTENT } from "../laws-graphic-engineering-integration/shared/first-research-content.js";
import { createExperienceController, bindExperienceLifecycle } from "../laws-graphic-engineering-integration/shared/experience-runtime.js";
import { mountFirstResearchMechanic } from "../laws-graphic-engineering-integration/shared/first-research-webgl2.js";

const root = document.querySelector("[data-compass-prototype-root]");
const sceneRoot = root.querySelector("[data-first-research-root]");
const frame = document.querySelector("[data-compass-frame]");
const frameShell = document.querySelector("[data-compass-frame-shell]");
const frameFallback = document.querySelector("[data-compass-frame-fallback]");
const receiptHost = root.querySelector("[data-integration-receipt]");
let mechanic;
let frameReady = false;
let frameResizeObserver;

root.querySelector("[data-story-thesis]").textContent = FIRST_RESEARCH_CONTENT.thesis;
root.querySelector("[data-story-relationship]").textContent = FIRST_RESEARCH_CONTENT.relationship;
root.querySelector("[data-evidence-boundary]").textContent = FIRST_RESEARCH_CONTENT.evidenceBoundary;

function recordFor(id) {
  return id === "research" ? FIRST_RESEARCH_CONTENT.research : FIRST_RESEARCH_CONTENT.first.find((item) => item.id === id);
}

function renderContent(state) {
  const record = recordFor(state.activeId) || FIRST_RESEARCH_CONTENT.research;
  const lens = FIRST_RESEARCH_CONTENT.lenses[state.lens];
  root.querySelector("[data-active-kicker]").textContent = `${record.label} · ${record.question}`;
  root.querySelector("[data-active-title]").textContent = record.question;
  root.querySelector("[data-active-body]").textContent = record[state.lens];
  const route = root.querySelector("[data-active-route]");
  route.href = record.route;
  route.textContent = `Continue into ${record.label}`;
  root.querySelector("[data-lens-kicker]").textContent = `${lens.label} lens`;
  root.querySelector("[data-lens-title]").textContent = lens.title;
  root.querySelector("[data-lens-body]").textContent = lens.body;
  root.querySelector("[data-first-research-status]").textContent = FIRST_RESEARCH_CONTENT.evidenceBoundary;
}

function updateReceipt(controller) {
  const receipt = controller.captureReceipt({
    program: "LAWS_CHAMBER_GRAPHIC_ENGINEERING_INTEGRATION",
    slice: "SLICE_01_RESEARCH_COMES_FIRST_RELATIONSHIP",
    acceptedCompassFrameReady: frameReady,
    mechanic: mechanic?.captureReceipt(),
    protectedCompassRuntimeMutation: false,
    routeMutation: false,
    recordLoss: false,
    claimUpgrade: false
  });
  receiptHost.textContent = JSON.stringify(receipt, null, 2);
  globalThis.__DGB_LAWS_COMPASS_SLICE_RECEIPT__ = receipt;
}

const controller = createExperienceController({
  root,
  onChange(state) {
    renderContent(state);
    mechanic?.setLens(state.lens);
    mechanic?.setMotionMode(state.motion);
    mechanic?.setSelected(state.activeId);
    updateReceipt(controller);
  }
});

mechanic = mountFirstResearchMechanic({
  root: sceneRoot,
  canvas: root.querySelector("[data-first-research-canvas]"),
  labelHost: root.querySelector("[data-first-research-labels]"),
  staticHost: root.querySelector("[data-first-research-static]"),
  statusHost: root.querySelector("[data-first-research-status]"),
  content: FIRST_RESEARCH_CONTENT,
  onSelect(id, meta = {}) {
    if (!meta.fromMechanic) controller.setActiveId(id);
  }
});

const releaseLifecycle = bindExperienceLifecycle({
  root: sceneRoot,
  resizeTarget: sceneRoot,
  controller,
  onResize: (dimensions) => mechanic.resize(dimensions),
  onActive: () => mechanic.start(),
  onInactive: () => mechanic.stop()
});

function prepareAcceptedCompass() {
  try {
    const doc = frame.contentDocument;
    if (!doc) throw new Error("Compass frame document unavailable.");
    const compass = doc.querySelector(".laws-compass-primary");
    if (!compass) throw new Error("Accepted Compass surface not found.");
    const style = doc.createElement("style");
    style.dataset.prototypeCompassCrop = "true";
    style.textContent = `
      html,body{margin:0!important;min-height:0!important;overflow:hidden!important;background:#030713!important}
      body>.skip,.laws-topbar,.laws-practical-opening,.laws-first,.laws-discovery,footer{display:none!important}
      .shell,.laws-shell{width:100%!important;max-width:none!important;min-height:0!important;margin:0!important;padding:0!important}
      .laws-estate{margin:0!important;padding:0!important}
      .laws-compass-primary{margin:0!important;padding:0!important}
    `;
    doc.head.append(style);
    const resize = () => {
      const height = Math.ceil(compass.getBoundingClientRect().height + 8);
      frame.style.height = `${Math.max(430, Math.min(760, height))}px`;
      frameShell.style.minHeight = frame.style.height;
    };
    resize();
    frameResizeObserver = new ResizeObserver(resize);
    frameResizeObserver.observe(compass);
    frameReady = true;
    frame.dataset.acceptedCompassReady = "true";
    updateReceipt(controller);
    document.documentElement.dataset.programReady = "true";
  } catch (error) {
    frame.hidden = true;
    frameFallback.hidden = false;
    frameFallback.dataset.error = error.message;
    document.documentElement.dataset.programReady = "true";
  }
}

frame.addEventListener("load", prepareAcceptedCompass, { once: true });
setTimeout(() => {
  if (document.documentElement.dataset.programReady !== "true") prepareAcceptedCompass();
}, 5000);

controller.setActiveId("research");
mechanic.setLens(controller.state.lens);
mechanic.setMotionMode(controller.state.motion);
mechanic.setSelected(controller.state.activeId);
mechanic.start();
renderContent(controller.state);
updateReceipt(controller);

addEventListener("pagehide", () => {
  releaseLifecycle();
  frameResizeObserver?.disconnect();
  mechanic.dispose();
}, { once: true });
