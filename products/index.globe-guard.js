/* /products/index.globe-guard.js
   Bounded interaction guard for the existing Products center control.
   This module owns no product state, rendering, canvas, gesture, or navigation.
*/
(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "PRODUCTS_GLOBE_DISCLOSURE_ISOLATION_GUARD_v1",
    createsSecondController: false,
    ownsProductRegistry: false,
    ownsGesture: false,
    ownsCanvas: false,
    ownsAnimationLoop: false,
    ownsNavigation: false
  });

  const rootSelector = '[data-page-id="products"]';
  const sceneSelector = "[data-products-scene]";
  const centerSelector = "[data-products-center-control]";
  const returnSelector = "[data-products-return-main-compass]";
  const stylesheetHref = "/products/index.globe-guard.css";
  const nonGlobeSelector = [
    "[data-products-primary-entry]",
    "[data-products-product]",
    "[data-products-return-to-orbit]",
    "[data-products-return-to-constellation]",
    "[data-products-enter]"
  ].join(",");

  function installStylesheet() {
    if (document.querySelector(`link[href="${stylesheetHref}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = stylesheetHref;
    link.dataset.productsGlobeGuardStyles = "true";
    document.head.append(link);
  }

  function closeDisclosure(root, reason) {
    const center = root.querySelector(centerSelector);
    const returnControl = root.querySelector(returnSelector);

    if (center) center.setAttribute("aria-expanded", "false");

    if (returnControl) {
      returnControl.hidden = true;
      returnControl.setAttribute("aria-hidden", "true");
      returnControl.tabIndex = -1;
    }

    root.dataset.productsCenterDisclosure = "closed";
    root.dataset.productsCenterDisclosureSource = String(reason || "non-globe-action");
  }

  function isolateCenterPointerFromCrystals(scene, event) {
    const center = event.target instanceof Element
      ? event.target.closest(centerSelector)
      : null;

    if (!center || !scene.contains(center)) return;
    event.stopImmediatePropagation();
  }

  function initialize() {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const scene = root.querySelector(sceneSelector);
    if (!scene) return;

    closeDisclosure(root, "guard-initialized");

    ["pointerdown", "pointermove", "pointerup", "pointercancel"].forEach(type => {
      scene.addEventListener(type, event => {
        isolateCenterPointerFromCrystals(scene, event);
      });
    });

    root.addEventListener(
      "click",
      event => {
        const target = event.target instanceof Element
          ? event.target.closest(nonGlobeSelector)
          : null;

        if (!target || !root.contains(target)) return;
        closeDisclosure(root, "non-globe-action");
      },
      true
    );

    const returnControl = root.querySelector(returnSelector);
    if (returnControl) {
      returnControl.addEventListener(
        "click",
        event => {
          if (root.dataset.productsCenterDisclosure !== "open") {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        },
        true
      );
    }

    globalThis.DGB_PRODUCTS_GLOBE_GUARD = Object.freeze({
      contract: CONTRACT,
      closeDisclosure: reason => closeDisclosure(root, reason)
    });

    globalThis.DGB_PRODUCTS_GLOBE_GUARD_RECEIPT = Object.freeze({
      contractId: CONTRACT.id,
      status: "available",
      disclosureIsolation: true,
      centerOnlyDisclosure: true,
      protectedTouchCorridor: true,
      crystalPointerIsolation: true,
      createsSecondController: false
    });
  }

  installStylesheet();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
