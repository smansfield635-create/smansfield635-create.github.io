export const LENS_IDS = Object.freeze(["practical", "engineering", "empirical"]);
export const MOTION_MODES = Object.freeze(["full", "reduced", "static"]);

function assertAllowed(value, allowed, label) {
  if (!allowed.includes(value)) throw new Error(`${label} must be one of: ${allowed.join(", ")}`);
}

export function createExperienceController({ root, initialLens = "practical", initialMotion = "full", onChange = () => {} }) {
  if (!root) throw new Error("Experience root is required.");
  const prefersReduced = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  const state = {
    lens: initialLens,
    motion: prefersReduced && initialMotion === "full" ? "reduced" : initialMotion,
    activeId: "research",
    visible: true,
    documentVisible: !document.hidden
  };

  const apply = (reason) => {
    root.dataset.lens = state.lens;
    root.dataset.motion = state.motion;
    root.dataset.activeId = state.activeId;
    root.querySelectorAll("[data-lens-control]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lensControl === state.lens));
    });
    root.querySelectorAll("[data-motion-control]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.motionControl === state.motion));
    });
    onChange({ ...state }, reason);
    root.dispatchEvent(new CustomEvent("dgb:experience-state", { detail: { ...state, reason } }));
  };

  const api = {
    state,
    setLens(next) {
      assertAllowed(next, LENS_IDS, "Lens");
      if (state.lens === next) return;
      state.lens = next;
      apply("lens");
    },
    setMotion(next) {
      assertAllowed(next, MOTION_MODES, "Motion mode");
      if (state.motion === next) return;
      state.motion = next;
      apply("motion");
    },
    setActiveId(next) {
      if (!next || state.activeId === next) return;
      state.activeId = next;
      apply("active");
    },
    setVisible(next) {
      const value = Boolean(next);
      if (state.visible === value) return;
      state.visible = value;
      apply("visibility");
    },
    setDocumentVisible(next) {
      const value = Boolean(next);
      if (state.documentVisible === value) return;
      state.documentVisible = value;
      apply("document-visibility");
    },
    bindControls() {
      root.querySelectorAll("[data-lens-control]").forEach((button) => {
        button.addEventListener("click", () => api.setLens(button.dataset.lensControl));
      });
      root.querySelectorAll("[data-motion-control]").forEach((button) => {
        button.addEventListener("click", () => api.setMotion(button.dataset.motionControl));
      });
    },
    captureReceipt(extra = {}) {
      return {
        contract: "DGB_LAWS_SHARED_EXPERIENCE_RUNTIME_v1",
        lens: state.lens,
        motion: state.motion,
        activeId: state.activeId,
        visible: state.visible,
        documentVisible: state.documentVisible,
        semanticDomAuthority: true,
        evidenceStatusMutationAuthority: false,
        ...extra
      };
    }
  };

  api.bindControls();
  queueMicrotask(() => apply("initialize"));
  return api;
}

export function bindExperienceLifecycle({ root, resizeTarget, controller, onResize, onActive, onInactive }) {
  if (!root || !controller) throw new Error("Lifecycle root and controller are required.");

  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;
    onResize?.({ width, height, deviceClass: width < 520 ? "phone" : width < 980 ? "tablet" : "desktop" });
  });
  resizeObserver.observe(resizeTarget || root);

  const intersectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0.05);
    controller.setVisible(visible);
    if (visible && !document.hidden) onActive?.();
    else onInactive?.();
  }, { threshold: [0, 0.05, 0.25] });
  intersectionObserver.observe(root);

  const handleVisibility = () => {
    controller.setDocumentVisible(!document.hidden);
    if (!document.hidden && controller.state.visible) onActive?.();
    else onInactive?.();
  };
  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}
