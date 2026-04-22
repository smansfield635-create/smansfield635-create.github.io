const PRODUCTS_BOOT_META = Object.freeze({
  name: "PRODUCTS_BOOTSTRAP",
  version: "V1",
  role: "boot_discover_target_and_hand_off_only",
  contract: "PRODUCTS_SINGLE_STAGE_OWNERSHIP",
  status: "ACTIVE",
  deterministic: true,
});

const STAGE_ID = "products-stage";
const RUNTIME_MODULE_PATH = "./products_runtime.js";
const HANDOFF_EVENT = "products:stage-handoff";
const READY_EVENT = "products:stage-ready";
const ERROR_EVENT = "products:stage-error";

function getStageTarget() {
  const stage = document.getElementById(STAGE_ID);
  if (!stage) {
    throw new Error(`Missing required stage target: #${STAGE_ID}`);
  }
  return stage;
}

function stampStage(target) {
  target.setAttribute("data-products-stage-owner", "products_runtime");
  target.setAttribute("data-products-stage-boundary", "single");
  return target;
}

function publishStage(target) {
  window.__PRODUCTS_BOOT_META__ = PRODUCTS_BOOT_META;
  window.__PRODUCTS_STAGE_TARGET__ = target;
  window.__PRODUCTS_STAGE_TARGET_ID__ = target.id;
  window.__PRODUCTS_STAGE_READY__ = true;

  document.dispatchEvent(
    new CustomEvent(READY_EVENT, {
      detail: {
        meta: PRODUCTS_BOOT_META,
        target,
        targetId: target.id,
      },
    }),
  );

  window.dispatchEvent(
    new CustomEvent(HANDOFF_EVENT, {
      detail: {
        meta: PRODUCTS_BOOT_META,
        target,
        targetId: target.id,
      },
    }),
  );
}

async function importRuntime() {
  return import(RUNTIME_MODULE_PATH);
}

async function invokeRuntime(moduleNamespace, target) {
  const runtime =
    moduleNamespace?.default ??
    moduleNamespace?.bootProductsRuntime ??
    moduleNamespace?.mountProductsRuntime ??
    moduleNamespace?.initProductsRuntime ??
    moduleNamespace?.startProductsRuntime ??
    null;

  if (typeof runtime === "function") {
    await runtime({
      target,
      targetId: target.id,
      meta: PRODUCTS_BOOT_META,
    });
  }
}

async function handoff() {
  const target = stampStage(getStageTarget());
  publishStage(target);
  const moduleNamespace = await importRuntime();
  await invokeRuntime(moduleNamespace, target);
}

function emitBootError(error) {
  window.__PRODUCTS_STAGE_ERROR__ = error;

  const detail = {
    meta: PRODUCTS_BOOT_META,
    message: error instanceof Error ? error.message : String(error),
  };

  document.dispatchEvent(new CustomEvent(ERROR_EVENT, { detail }));
  window.dispatchEvent(new CustomEvent(ERROR_EVENT, { detail }));

  throw error;
}

async function bootProductsPage() {
  try {
    await handoff();
  } catch (error) {
    emitBootError(error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootProductsPage, { once: true });
} else {
  void bootProductsPage();
}
