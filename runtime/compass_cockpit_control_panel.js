/* TNT NEW FILE — /runtime/compass_cockpit_control_panel.js
   COMPASS COCKPIT CONTROL PANEL · PAGE-LEVEL CONTROL DOM AUTHORITY B1

   CONTROL_PANEL_VERSION = "compass-cockpit-control-panel-b1"
   ROOT_BOOT_ID = "root-sun-asset-b1"
   COCKPIT_VERSION = "root-compass-cockpit-b1"

   PURPOSE:
     - Own Compass cockpit control-panel DOM
     - Render control buttons into the shell mount
     - Preserve /index.js as operator and binding authority
     - Preserve /runtime/compass_cockpit_render.js as visual authority
     - Do not bind controls directly
     - Do not expose or replace DGBIndexBoot
     - Do not expose or replace DGBCompassCockpit
     - Use data attributes already understood by /index.js:
       data-cockpit-view-button
       data-cockpit-toggle
*/

(function () {
  "use strict";

  var CONTROL_PANEL_VERSION = "compass-cockpit-control-panel-b1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var COCKPIT_VERSION = "root-compass-cockpit-b1";
  var MOUNT_ID = "cockpit-control-panel-mount";

  var CONTROL_META = Object.freeze({
    name: "COMPASS_COCKPIT_CONTROL_PANEL",
    version: CONTROL_PANEL_VERSION,
    role: "page_level_control_panel_dom_authority",
    contract: "COMPASS_COCKPIT_CONTROL_PANEL_CONTRACT_B1",
    status: "ACTIVE",
    deterministic: true
  });

  var VIEW_BUTTONS = Object.freeze([
    { key: "cinematic", label: "Cinematic" },
    { key: "wide", label: "Wide" },
    { key: "local", label: "Local" },
    { key: "axis", label: "Axis" },
    { key: "paths", label: "Paths" },
    { key: "galaxy", label: "Galaxy" },
    { key: "nebula", label: "Nebula" },
    { key: "control", label: "Control" }
  ]);

  var LAYER_BUTTONS = Object.freeze([
    { key: "planets", label: "Planets", defaultPressed: true },
    { key: "paths", label: "Paths", defaultPressed: false },
    { key: "axes", label: "Axes", defaultPressed: false },
    { key: "nebula", label: "Nebula", defaultPressed: true },
    { key: "milkyWay", label: "Milky Way", defaultPressed: true },
    { key: "solarWind", label: "Solar Wind", defaultPressed: true }
  ]);

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function rootNode() {
    return document.getElementById("door-root") || $("[data-root-door]");
  }

  function mountNode() {
    return document.getElementById(MOUNT_ID) || $("[data-cockpit-control-panel-mount]") || $("[data-cockpit-control-panel]");
  }

  function normalizeView(view) {
    var next = String(view || "").trim();
    var valid = VIEW_BUTTONS.some(function (item) {
      return item.key === next;
    });

    return valid ? next : "cinematic";
  }

  function getCurrentView() {
    var root = rootNode();
    var bodyView = document.body ? document.body.getAttribute("data-cockpit-view") : "";
    var rootView = root ? root.getAttribute("data-cockpit-view") : "";

    return normalizeView(rootView || bodyView || "cinematic");
  }

  function layerAttributeName(key) {
    if (key === "milkyWay") return "data-layer-milkyway";
    if (key === "solarWind") return "data-layer-solarwind";
    return "data-layer-" + key;
  }

  function getLayerState(key, fallback) {
    var root = rootNode();
    var body = document.body;
    var attr = layerAttributeName(key);
    var value = "";

    if (root && root.hasAttribute(attr)) value = root.getAttribute(attr);
    else if (body && body.hasAttribute(attr)) value = body.getAttribute(attr);

    if (value === "true") return true;
    if (value === "false") return false;

    return Boolean(fallback);
  }

  function createButton(label, attr, value, pressed) {
    var button = document.createElement("button");

    button.type = "button";
    button.textContent = label;
    button.setAttribute(attr, value);
    button.setAttribute("aria-pressed", pressed ? "true" : "false");

    return button;
  }

  function clear(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  }

  function renderControlPanel() {
    var mount = mountNode();
    var currentView = getCurrentView();
    var head;
    var title;
    var strong;
    var subtitle;
    var state;
    var stateValue;
    var grid;
    var viewGroup;
    var layerGroup;
    var status;

    if (!mount) return null;

    mount.id = MOUNT_ID;
    mount.className = "cockpit-control-panel";
    mount.setAttribute("data-cockpit-control-panel", "");
    mount.setAttribute("data-cockpit-control-panel-mount", "");
    mount.setAttribute("data-control-panel-runtime", CONTROL_PANEL_VERSION);
    mount.setAttribute("data-control-panel-authority", "page-level-control-panel-dom");
    mount.setAttribute("data-control-panel-contract", "COMPASS_COCKPIT_CONTROL_PANEL_CONTRACT_B1");
    mount.setAttribute("data-control-panel-status", "ACTIVE");
    mount.setAttribute("aria-label", "Compass cockpit control panel");

    clear(mount);

    head = document.createElement("div");
    head.className = "cockpit-control-head";

    title = document.createElement("span");
    title.className = "cockpit-control-title";

    strong = document.createElement("strong");
    strong.textContent = "Compass Cockpit";

    subtitle = document.createElement("span");
    subtitle.textContent = "Ship posture changes · galaxy remains fixed · sun spine protected";

    title.appendChild(strong);
    title.appendChild(subtitle);

    state = document.createElement("span");
    state.className = "cockpit-control-state";
    state.appendChild(document.createTextNode("View: "));

    stateValue = document.createElement("span");
    stateValue.setAttribute("data-cockpit-view-label", "");
    stateValue.textContent = currentView;

    state.appendChild(stateValue);

    head.appendChild(title);
    head.appendChild(state);

    grid = document.createElement("div");
    grid.className = "cockpit-control-grid";

    viewGroup = document.createElement("div");
    viewGroup.className = "cockpit-control-group";
    viewGroup.setAttribute("aria-label", "Cockpit view controls");

    VIEW_BUTTONS.forEach(function (item) {
      viewGroup.appendChild(
        createButton(item.label, "data-cockpit-view-button", item.key, item.key === currentView)
      );
    });

    layerGroup = document.createElement("div");
    layerGroup.className = "cockpit-control-group";
    layerGroup.setAttribute("aria-label", "Cockpit layer toggles");

    LAYER_BUTTONS.forEach(function (item) {
      layerGroup.appendChild(
        createButton(
          item.label,
          "data-cockpit-toggle",
          item.key,
          getLayerState(item.key, item.defaultPressed)
        )
      );
    });

    grid.appendChild(viewGroup);
    grid.appendChild(layerGroup);

    status = document.createElement("p");
    status.className = "cockpit-control-status";
    status.setAttribute("data-cockpit-status", "");
    status.textContent = "Compass Cockpit B1 · cinematic posture · fixed galaxy truth";

    mount.appendChild(head);
    mount.appendChild(grid);
    mount.appendChild(status);

    return mount;
  }

  function syncControlPanel() {
    var mount = mountNode();
    var currentView = getCurrentView();

    if (!mount) return;

    Array.prototype.slice.call(mount.querySelectorAll("[data-cockpit-view-button]")).forEach(function (button) {
      var key = button.getAttribute("data-cockpit-view-button");
      button.setAttribute("aria-pressed", key === currentView ? "true" : "false");
    });

    Array.prototype.slice.call(mount.querySelectorAll("[data-cockpit-toggle]")).forEach(function (button) {
      var key = button.getAttribute("data-cockpit-toggle");
      var fallback = LAYER_BUTTONS.some(function (item) {
        return item.key === key && item.defaultPressed;
      });

      button.setAttribute("aria-pressed", getLayerState(key, fallback) ? "true" : "false");
    });

    Array.prototype.slice.call(mount.querySelectorAll("[data-cockpit-view-label]")).forEach(function (node) {
      node.textContent = currentView;
    });
  }

  function markRoot() {
    var root = rootNode();

    if (!root) return null;

    root.setAttribute("data-compass-cockpit-control-panel", CONTROL_PANEL_VERSION);
    root.setAttribute("data-control-panel-authority", "page-level-control-panel-dom");
    root.setAttribute("data-control-panel-contract", "COMPASS_COCKPIT_CONTROL_PANEL_CONTRACT_B1");
    root.setAttribute("data-control-panel-status", "ACTIVE");
    root.setAttribute("data-root-boot-confirmed", ROOT_BOOT_ID);
    root.setAttribute("data-compass-cockpit", COCKPIT_VERSION);

    return root;
  }

  function dispatchReady() {
    try {
      window.dispatchEvent(new CustomEvent("dgb:cockpit:controlpanelready", {
        detail: getPublicState()
      }));
    } catch (error) {
      /* no-op */
    }
  }

  function getPublicState() {
    var mount = mountNode();
    var root = rootNode();

    return {
      meta: CONTROL_META,
      version: CONTROL_PANEL_VERSION,
      rootBootId: ROOT_BOOT_ID,
      cockpitVersion: COCKPIT_VERSION,
      rootPresent: Boolean(root),
      mountPresent: Boolean(mount),
      currentView: getCurrentView(),
      viewButtonCount: mount ? mount.querySelectorAll("[data-cockpit-view-button]").length : 0,
      layerToggleCount: mount ? mount.querySelectorAll("[data-cockpit-toggle]").length : 0,
      ownsControlBinding: false,
      ownsRenderCss: false,
      ownsVenueGeometry: false,
      ownsWorldLaw: false
    };
  }

  function expose() {
    window.DGBCompassCockpitControlPanel = {
      meta: CONTROL_META,
      version: CONTROL_PANEL_VERSION,
      renderControlPanel: renderControlPanel,
      syncControlPanel: syncControlPanel,
      markRoot: markRoot,
      getPublicState: getPublicState
    };
  }

  function boot() {
    markRoot();
    renderControlPanel();
    syncControlPanel();
    expose();
    dispatchReady();
  }

  expose();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener("dgb:cockpit:viewchange", function () {
    markRoot();
    syncControlPanel();
  });

  window.setTimeout(function () {
    markRoot();
    syncControlPanel();
  }, 250);

  window.setTimeout(function () {
    markRoot();
    syncControlPanel();
  }, 1000);
})();
