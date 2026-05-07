// /assets/dgb-global-background.js
// DGB_GLOBAL_BLACK_GOLD_PURPLE_ORBIT_BACKGROUND_JS_TNT_v1
// Code-only shared background injector.
// No GraphicBox. No image generation. No canvas. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "DGB_GLOBAL_BLACK_GOLD_PURPLE_ORBIT_BACKGROUND_JS_TNT_v1";
  const CSS_CONTRACT = "DGB_GLOBAL_BLACK_GOLD_PURPLE_ORBIT_BACKGROUND_TNT_v1";
  const CSS_PATH = "/assets/dgb-global-background.css?v=DGB_GLOBAL_BLACK_GOLD_PURPLE_ORBIT_BACKGROUND_TNT_v1";

  const MOTES = [
    { text: "1", left: "8%", top: "68%", type: "gold", speed: "19s" },
    { text: "4", left: "24%", top: "36%", type: "purple", speed: "23s" },
    { text: "16", left: "34%", top: "76%", type: "gold", speed: "21s" },
    { text: "256", left: "72%", top: "72%", type: "purple", speed: "25s" },
    { text: "N", left: "50%", top: "14%", type: "gold", speed: "20s" },
    { text: "E", left: "82%", top: "38%", type: "purple", speed: "22s" },
    { text: "S", left: "54%", top: "84%", type: "gold", speed: "24s" },
    { text: "W", left: "14%", top: "44%", type: "purple", speed: "26s" },
    { text: "φ", left: "12%", top: "82%", type: "purple", speed: "27s" },
    { text: "360°", left: "31%", top: "50%", type: "gold", speed: "29s" }
  ];

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
      return;
    }

    fn();
  }

  function injectCss() {
    const existing = document.querySelector("link[data-dgb-global-background-css='true']");
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CSS_PATH;
    link.dataset.dgbGlobalBackgroundCss = "true";
    link.dataset.contract = CSS_CONTRACT;
    document.head.appendChild(link);
  }

  function buildField() {
    if (document.querySelector("[data-dgb-global-background-field='true']")) return;

    document.documentElement.dataset.dgbGlobalBackground = "true";
    document.body.dataset.dgbGlobalBackground = "true";
    document.documentElement.dataset.dgbGlobalBackgroundContract = CONTRACT;
    document.documentElement.dataset.dgbGlobalBackgroundCssContract = CSS_CONTRACT;
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    const field = document.createElement("div");
    field.className = "dgb-global-bg-field";
    field.dataset.dgbGlobalBackgroundField = "true";
    field.dataset.contract = CONTRACT;
    field.setAttribute("aria-hidden", "true");

    field.innerHTML = `
      <div class="dgb-global-bg-core"></div>
      <div class="dgb-global-bg-orbit one gold"></div>
      <div class="dgb-global-bg-orbit two purple"></div>
      <div class="dgb-global-bg-orbit three gold"></div>
      <div class="dgb-global-bg-shape audralia" data-mark="AUD"></div>
      <div class="dgb-global-bg-shape book purple" data-mark="BOOK"></div>
      <div class="dgb-global-bg-shape showroom" data-mark="SHOW"></div>
      <div class="dgb-global-bg-shape frontier purple" data-mark="EDGE"></div>
      <div class="dgb-global-bg-shape lattice" data-mark="256"></div>
    `;

    MOTES.forEach((mote) => {
      const node = document.createElement("span");
      node.className = `dgb-global-bg-mote ${mote.type}`;
      node.textContent = mote.text;
      node.style.left = mote.left;
      node.style.top = mote.top;
      node.style.setProperty("--dgb-mote-speed", mote.speed);
      node.setAttribute("aria-hidden", "true");
      field.appendChild(node);
    });

    document.body.prepend(field);
  }

  function exportReceipt() {
    window.DGB_GLOBAL_BACKGROUND_RECEIPT = {
      contract: CONTRACT,
      cssContract: CSS_CONTRACT,
      cssPath: CSS_PATH,
      theme: "black_gold_purple_orbit_background",
      owns: [
        "shared_background_field",
        "gold_orbit_motion",
        "purple_contrast_motion",
        "symbolic_route_shapes",
        "lattice_motes"
      ],
      doesNotOwn: [
        "page_content",
        "route_contract",
        "canvas_rendering",
        "planet_surface",
        "gauges_logic",
        "runtime_truth"
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      timestamp: new Date().toISOString()
    };
  }

  ready(() => {
    injectCss();
    buildField();
    exportReceipt();
  });
})();
