/*
 * Laws CP6 visitor-path placement and tab presentation correction.
 * Presentation only. Existing destinations, records, routes, and panel bodies
 * remain canonical and unchanged.
 */

(() => {
  "use strict";

  const CONTRACT = "LAWS_CP6_MOBILE_BACKGROUND_TABS_CORRECTION_v1";

  function directPanels(paths) {
    return Array.from(paths.children).filter(node =>
      node.matches?.("details.laws-orientation-panel[data-laws-supporting-panel]")
    );
  }

  function shortLabel(panel, index) {
    const key = panel.dataset.lawsSupportingPanel || "";
    if (key.includes("foundation") || index === 0) return "Understand";
    if (key.includes("evidence") || index === 1) return "Evidence";
    if (key.includes("system") || key.includes("architecture") || index === 2) return "Inspect";
    return panel.querySelector("summary span")?.textContent?.trim() || `Path ${index + 1}`;
  }

  function mountTabs() {
    const paths = document.querySelector(".laws-visitor-paths[data-laws-progressive-disclosure]");
    const compassPrimary = document.querySelector("[data-laws-compass-primary]");
    const controllerPanel = compassPrimary?.querySelector("[data-laws-panel]");
    if (!paths || !compassPrimary || !controllerPanel) return false;

    if (paths.parentElement !== compassPrimary || controllerPanel.nextElementSibling !== paths) {
      controllerPanel.after(paths);
    }

    paths.dataset.lawsTabsMounted = "true";
    paths.dataset.lawsTabsContract = CONTRACT;

    const panels = directPanels(paths);
    if (panels.length !== 3) {
      paths.dataset.lawsTabsStatus = "held-panel-count";
      return false;
    }

    let tablist = paths.querySelector(":scope > .laws-visitor-paths__tablist");
    if (!tablist) {
      tablist = document.createElement("div");
      tablist.className = "laws-visitor-paths__tablist";
      tablist.setAttribute("role", "tablist");
      tablist.setAttribute("aria-label", "Three ways into the Laws Chamber");
      const header = paths.querySelector(":scope > .laws-visitor-paths__header");
      if (header) header.after(tablist);
      else paths.prepend(tablist);
    }

    tablist.replaceChildren();

    const activate = (targetIndex, focus = false) => {
      const normalized = ((targetIndex % panels.length) + panels.length) % panels.length;
      panels.forEach((panel, index) => {
        const active = index === normalized;
        panel.open = active;
        panel.dataset.lawsTabActive = String(active);
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-hidden", String(!active));
      });

      Array.from(tablist.children).forEach((button, index) => {
        const active = index === normalized;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
        if (active && focus) button.focus({ preventScroll: true });
      });

      paths.dataset.lawsActiveVisitorPath = panels[normalized].dataset.lawsSupportingPanel || String(normalized);
      globalThis.dispatchEvent(new CustomEvent("LAWS_VISITOR_PATH_CHANGED", {
        detail: Object.freeze({
          contract: CONTRACT,
          index: normalized,
          panel: paths.dataset.lawsActiveVisitorPath,
          navigationAuthority: false,
          contentAuthority: false
        })
      }));
    };

    panels.forEach((panel, index) => {
      panel.id ||= `laws-visitor-path-panel-${index + 1}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "laws-visitor-paths__tab";
      button.id = `laws-visitor-path-tab-${index + 1}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", panel.id);
      button.textContent = shortLabel(panel, index);
      panel.setAttribute("aria-labelledby", button.id);
      button.addEventListener("click", () => activate(index));
      button.addEventListener("keydown", event => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          activate(index + 1, true);
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          activate(index - 1, true);
        } else if (event.key === "Home") {
          event.preventDefault();
          activate(0, true);
        } else if (event.key === "End") {
          event.preventDefault();
          activate(panels.length - 1, true);
        }
      });
      tablist.append(button);
    });

    activate(0);
    paths.dataset.lawsTabsStatus = "available";

    globalThis.DGB_LAWS_VISITOR_PATH_TABS = Object.freeze({
      contract: CONTRACT,
      activate,
      panelCount: panels.length,
      navigationAuthority: false,
      controllerAuthority: false,
      recordAuthority: false,
      evidenceAuthority: false,
      claimAuthority: false
    });

    globalThis.dispatchEvent(new CustomEvent("LAWS_VISITOR_PATH_TABS_READY", {
      detail: Object.freeze({
        contract: CONTRACT,
        panelCount: panels.length,
        mountedAfterCompassResponse: true,
        navigationAuthority: false
      })
    }));

    return true;
  }

  function initialize() {
    if (mountTabs()) return;
    let attempts = 0;
    const timer = globalThis.setInterval(() => {
      attempts += 1;
      if (mountTabs() || attempts >= 40) globalThis.clearInterval(timer);
    }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
