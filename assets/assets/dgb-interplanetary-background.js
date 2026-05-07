// /assets/dgb-interplanetary-background.js
// DGB_INTERPLANETARY_AXIS_FLOATING_FIGURES_BACKGROUND_JS_TNT_v1
// Full-file replacement. Code-only shared background injector.
// No canvas. No GraphicBox. No image generation. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "DGB_INTERPLANETARY_AXIS_FLOATING_FIGURES_BACKGROUND_JS_TNT_v1";
  const CSS_CONTRACT = "DGB_INTERPLANETARY_AXIS_FLOATING_FIGURES_BACKGROUND_TNT_v1";
  const CSS_PATH = "/assets/dgb-interplanetary-background.css?v=DGB_INTERPLANETARY_AXIS_FLOATING_FIGURES_BACKGROUND_TNT_v1";

  const DEFAULT_FIGURES = [
    { className: "audralia", mark: "AUD", tone: "violet" },
    { className: "book", mark: "BOOK", tone: "violet" },
    { className: "showroom", mark: "SHOW", tone: "gold" },
    { className: "frontier", mark: "EDGE", tone: "violet" },
    { className: "lattice", mark: "256", tone: "gold" }
  ];

  const DEFAULT_MOTES = [
    { text: "1", left: "8%", top: "68%", tone: "gold", speed: "19s" },
    { text: "4", left: "24%", top: "36%", tone: "violet", speed: "23s" },
    { text: "16", left: "34%", top: "76%", tone: "gold", speed: "21s" },
    { text: "256", left: "72%", top: "72%", tone: "violet", speed: "25s" },
    { text: "φ", left: "12%", top: "82%", tone: "violet", speed: "27s" },
    { text: "90°", left: "31%", top: "50%", tone: "gold", speed: "29s" },
    { text: "360°", left: "30%", top: "34%", tone: "violet", speed: "31s" },
    { text: "∞", left: "80%", top: "28%", tone: "gold", speed: "22s" }
  ];

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
      return;
    }

    fn();
  }

  function injectCss() {
    if (document.querySelector("link[data-dgb-interplanetary-css='true']")) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CSS_PATH;
    link.dataset.dgbInterplanetaryCss = "true";
    link.dataset.contract = CSS_CONTRACT;
    document.head.appendChild(link);
  }

  function createNode(tag, className, attrs = {}) {
    const node = document.createElement(tag);
    node.className = className;

    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "text") {
        node.textContent = value;
        return;
      }

      if (key === "style" && value && typeof value === "object") {
        Object.entries(value).forEach(([styleKey, styleValue]) => {
          node.style[styleKey] = styleValue;
        });
        return;
      }

      node.setAttribute(key, value);
    });

    return node;
  }

  function buildBackground() {
    if (document.querySelector("[data-dgb-interplanetary-background-field='true']")) return;

    document.documentElement.dataset.dgbInterplanetaryBackground = "true";
    document.body.dataset.dgbInterplanetaryBackground = "true";

    document.documentElement.dataset.dgbInterplanetaryBackgroundContract = CONTRACT;
    document.documentElement.dataset.dgbInterplanetaryBackgroundCssContract = CSS_CONTRACT;
    document.documentElement.dataset.generatedImage = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    const field = createNode("div", "dgb-interplanetary-bg", {
      "data-dgb-interplanetary-background-field": "true",
      "data-contract": CONTRACT,
      "aria-hidden": "true"
    });

    const axisWrap = createNode("div", "dgb-interplanetary-axis-wrap");
    const axis = createNode("div", "dgb-interplanetary-axis");

    axis.appendChild(createNode("span", "dgb-axis-node n", { text: "N" }));
    axis.appendChild(createNode("span", "dgb-axis-node e", { text: "E" }));
    axis.appendChild(createNode("span", "dgb-axis-node s", { text: "S" }));
    axis.appendChild(createNode("span", "dgb-axis-node w", { text: "W" }));

    axisWrap.appendChild(axis);
    axisWrap.appendChild(createNode("div", "dgb-interplanetary-core"));

    field.appendChild(axisWrap);

    field.appendChild(createNode("div", "dgb-interplanetary-orbit one"));
    field.appendChild(createNode("div", "dgb-interplanetary-orbit two gold"));
    field.appendChild(createNode("div", "dgb-interplanetary-orbit three"));
    field.appendChild(createNode("div", "dgb-interplanetary-orbit four gold"));

    DEFAULT_FIGURES.forEach((figure) => {
      const node = createNode(
        "div",
        `dgb-floating-figure ${figure.className} ${figure.tone === "gold" ? "gold" : ""}`,
        {
          "data-mark": figure.mark
        }
      );

      field.appendChild(node);
    });

    DEFAULT_MOTES.forEach((mote) => {
      const node = createNode(
        "span",
        `dgb-lattice-mote ${mote.tone === "gold" ? "gold" : ""}`,
        {
          text: mote.text,
          style: {
            left: mote.left,
            top: mote.top
          }
        }
      );

      node.style.setProperty("--mote-speed", mote.speed);
      field.appendChild(node);
    });

    document.body.prepend(field);
  }

  function exportReceipt() {
    window.DGB_INTERPLANETARY_BACKGROUND_RECEIPT = {
      contract: CONTRACT,
      cssContract: CSS_CONTRACT,
      cssPath: CSS_PATH,
      owns: [
        "interplanetary_axis",
        "rotating_axis_cross",
        "central_planetary_core",
        "orbit_rings",
        "floating_figures",
        "lattice_motes",
        "violet_primary_background",
        "gold_glow_support"
      ],
      doesNotOwn: [
        "page_content",
        "route_contract",
        "planet_canvas",
        "Audralia_rendering",
        "Earth_rendering",
        "Gauges_logic",
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
    buildBackground();
    exportReceipt();
  });
})();
