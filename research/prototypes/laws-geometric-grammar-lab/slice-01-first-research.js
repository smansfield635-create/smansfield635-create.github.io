import { FIRST_RESEARCH_CONTENT } from "../laws-graphic-engineering-integration/shared/first-research-content.js";
import { createExperienceController, bindExperienceLifecycle } from "../laws-graphic-engineering-integration/shared/experience-runtime.js";
import { mountFirstResearchMechanic } from "../laws-graphic-engineering-integration/shared/first-research-webgl2.js";

const root = document.querySelector("[data-slice-root]");
const sceneRoot = root.querySelector("[data-first-research-root]");
const receipt = root.querySelector("[data-receipt]");
const activeTitle = root.querySelector("[data-active-title]");
const activeBody = root.querySelector("[data-active-body]");
const activeKicker = root.querySelector("[data-active-kicker]");
let mechanic;

function recordFor(id) {
  return id === "research" ? FIRST_RESEARCH_CONTENT.research : FIRST_RESEARCH_CONTENT.first.find((item) => item.id === id);
}

function renderNarrative(state) {
  const record = recordFor(state.activeId) || FIRST_RESEARCH_CONTENT.research;
  activeKicker.textContent = `${record.label} · ${FIRST_RESEARCH_CONTENT.lenses[state.lens].label} lens`;
  activeTitle.textContent = record.question;
  activeBody.textContent = record[state.lens];
  root.querySelector("[data-first-research-status]").textContent = FIRST_RESEARCH_CONTENT.evidenceBoundary;
}

const controller = createExperienceController({
  root,
  onChange(state) {
    renderNarrative(state);
    mechanic?.setLens(state.lens);
    mechanic?.setMotionMode(state.motion);
    mechanic?.setSelected(state.activeId);
    receipt.textContent = JSON.stringify(controller.captureReceipt({ mechanic: mechanic?.captureReceipt() }), null, 2);
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

controller.setActiveId("research");
mechanic.setLens(controller.state.lens);
mechanic.setMotionMode(controller.state.motion);
mechanic.setSelected(controller.state.activeId);
mechanic.start();
renderNarrative(controller.state);
receipt.textContent = JSON.stringify(controller.captureReceipt({ mechanic: mechanic.captureReceipt() }), null, 2);
document.documentElement.dataset.programReady = "true";

addEventListener("pagehide", () => {
  releaseLifecycle();
  mechanic.dispose();
}, { once: true });
