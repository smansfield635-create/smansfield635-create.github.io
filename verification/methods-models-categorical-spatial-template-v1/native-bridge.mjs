const NATIVE_EVENT = "METHODS_MODELS_EUCLIDEAN_STATE_CHANGED";
const INSPECTION_EVENT = "METHODS_MODELS_NATIVE_INSPECTION_CHANGED";

function waitFor(predicate, timeout = 12000) {
  const started = performance.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      try {
        const value = predicate();
        if (value) return resolve(value);
      } catch (error) {
        return reject(error);
      }
      if (performance.now() - started > timeout) return reject(new Error("METHODS_NATIVE_BRIDGE_TIMEOUT"));
      setTimeout(tick, 50);
    };
    tick();
  });
}

export class MethodsNativeBridge extends EventTarget {
  constructor(iframe) {
    super();
    if (!(iframe instanceof HTMLIFrameElement)) throw new TypeError("METHODS_NATIVE_IFRAME_REQUIRED");
    this.iframe = iframe;
    this.window = null;
    this.document = null;
    this.api = null;
    this.state = null;
    this.dialogObserver = null;
    this.boundStateListener = event => this.acceptState(event.detail, "native-event");
  }

  async start() {
    if (!this.iframe.src) this.iframe.src = "/laws/research/methods-and-models/";
    if (!this.iframe.contentDocument?.readyState || this.iframe.contentDocument.readyState === "loading") {
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("METHODS_NATIVE_IFRAME_LOAD_TIMEOUT")), 15000);
        this.iframe.addEventListener("load", () => {
          clearTimeout(timer);
          resolve();
        }, { once: true });
      });
    }

    this.window = this.iframe.contentWindow;
    this.document = this.iframe.contentDocument;
    this.api = await waitFor(() => this.window.METHODS_MODELS_EUCLIDEAN_SHOWROOM_V3);
    this.window.addEventListener(NATIVE_EVENT, this.boundStateListener);
    this.observeInspection();
    this.acceptState(this.readDeclaredState(), "bridge-initialization");
    return this;
  }

  readDeclaredState() {
    const root = this.document.querySelector("[data-mm-showroom]");
    const apiState = this.api.getState();
    const selectedLens = this.document.querySelector("[data-mm-lens-tab][aria-selected='true']");
    return Object.freeze({
      contract: "METHODS_MODELS_EUCLIDEAN_SHOWROOM_v3",
      source: "declared-native-state",
      x: Object.freeze({ index: apiState.x, count: root?.querySelectorAll(".mm-model-card").length || 0, modelId: root?.dataset.mmModel || "" }),
      y: Object.freeze({ index: apiState.y, count: root?.querySelectorAll("[data-mm-lens-tab]").length || 0, lens: selectedLens?.dataset.mmLensTab || "practical" }),
      z: Object.freeze({ index: apiState.z, count: root?.querySelectorAll(".mm-family-tab").length || 0, familyId: root?.dataset.mmFamily || this.document.body.dataset.mmFamily || "" }),
      display: apiState.display || this.document.body.dataset.mmDisplay || "expanded",
      productAcceptanceGranted: false,
      sourceCompletenessClaimed: false
    });
  }

  acceptState(detail, source) {
    if (!detail) return;
    this.state = detail;
    this.dispatchEvent(new CustomEvent("statechange", { detail: Object.freeze({ detail, source }) }));
  }

  observeInspection() {
    const dialog = this.document.querySelector("[data-mm-dialog]");
    if (!dialog) throw new Error("METHODS_NATIVE_DIALOG_MISSING");
    const publish = () => {
      const detail = Object.freeze({
        open: Boolean(dialog.open),
        modelId: this.state?.x?.modelId || this.document.querySelector("[data-mm-showroom]")?.dataset.mmModel || ""
      });
      this.dispatchEvent(new CustomEvent("inspectionchange", { detail }));
      globalThis.dispatchEvent(new CustomEvent(INSPECTION_EVENT, { detail }));
    };
    dialog.addEventListener("close", publish);
    this.dialogObserver = new MutationObserver(publish);
    this.dialogObserver.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    publish();
  }

  moveModel(delta) {
    this.api.moveModel(delta, "spatial-renderer-control");
  }

  moveFamily(delta) {
    this.api.moveFamily(delta, "spatial-renderer-control");
  }

  moveLens(delta) {
    this.api.moveLens(delta, "spatial-renderer-control");
  }

  openInspection() {
    const modelId = this.state?.x?.modelId;
    const trigger = this.document.querySelector(`[data-mm-inspect="${CSS.escape(modelId || "")}"]`);
    if (!trigger) throw new Error(`METHODS_NATIVE_INSPECT_TRIGGER_MISSING:${modelId}`);
    trigger.click();
  }

  closeInspection() {
    const dialog = this.document.querySelector("[data-mm-dialog]");
    if (dialog?.open) dialog.close();
  }
}
