(() => {
  "use strict";

  const STYLE_ID = "dgb-shared-earth-globe-source-v1";

  const CONFIGS = {
    hero: {
      className: "dgb-earth-globe dgb-earth-globe--hero",
      ariaLabel: "Planet Earth globe",
      size: "hero"
    },
    proof: {
      className: "dgb-earth-globe dgb-earth-globe--proof",
      ariaLabel: "Planet Earth proof globe",
      size: "proof"
    }
  };

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .dgb-earth-globe {
        position: relative;
        width: 100%;
        max-width: 100%;
        aspect-ratio: 1;
        border-radius: 50%;
        overflow: hidden;
        isolation: isolate;
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at 31% 23%, rgba(255,255,255,.78), transparent 9%),
          radial-gradient(circle at 40% 35%, rgba(195,226,255,.36), transparent 25%),
          radial-gradient(circle at 52% 50%, rgba(39,137,219,.52), transparent 52%),
          linear-gradient(135deg, #0e68b5 0%, #0a3f86 45%, #04162f 100%);
        border: 1px solid rgba(218,239,255,.72);
        box-shadow:
          inset -34px -30px 54px rgba(0,0,0,.64),
          inset 18px 14px 30px rgba(255,255,255,.26),
          0 0 42px rgba(142,197,255,.52),
          0 0 120px rgba(239,210,154,.20);
      }

      .dgb-earth-globe--hero {
        width: 210px;
      }

      .dgb-earth-globe--proof {
        width: min(78vw, 420px);
      }

      .dgb-earth-globe__svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
        z-index: 3;
      }

      .dgb-earth-globe__ocean {
        fill: #0b61ad;
      }

      .dgb-earth-globe__deep-ocean {
        fill: #052a61;
        opacity: .46;
      }

      .dgb-earth-globe__continent {
        fill: #4aa96c;
        stroke: rgba(255,255,255,.22);
        stroke-width: .9;
      }

      .dgb-earth-globe__continent-warm {
        fill: #b39b60;
        stroke: rgba(255,255,255,.20);
        stroke-width: .85;
      }

      .dgb-earth-globe__ice {
        fill: rgba(241,248,255,.86);
        stroke: rgba(255,255,255,.24);
        stroke-width: .6;
      }

      .dgb-earth-globe__cloud {
        fill: rgba(255,255,255,.66);
      }

      .dgb-earth-globe__grid {
        fill: none;
        stroke: rgba(255,255,255,.17);
        stroke-width: .65;
      }

      .dgb-earth-globe__rim {
        fill: none;
        stroke: rgba(184,228,255,.76);
        stroke-width: 2.2;
      }

      .dgb-earth-globe__shadow {
        position: absolute;
        inset: 0;
        z-index: 5;
        border-radius: 50%;
        pointer-events: none;
        background:
          radial-gradient(circle at 34% 26%, rgba(255,255,255,.30), transparent 15%),
          radial-gradient(circle at 76% 72%, rgba(0,0,0,.42), transparent 38%),
          linear-gradient(90deg, rgba(255,255,255,.10), transparent 40%, rgba(0,0,0,.30) 100%);
        mix-blend-mode: screen;
      }

      .dgb-earth-globe__terminator {
        position: absolute;
        inset: 0;
        z-index: 6;
        border-radius: 50%;
        pointer-events: none;
        background: linear-gradient(105deg, transparent 0 56%, rgba(0,0,0,.34) 78%, rgba(0,0,0,.52) 100%);
      }

      .dgb-earth-globe__atmosphere {
        position: absolute;
        inset: -1px;
        z-index: 7;
        border-radius: 50%;
        pointer-events: none;
        box-shadow:
          inset 0 0 18px rgba(255,255,255,.20),
          0 0 24px rgba(120,205,255,.44),
          0 0 60px rgba(120,205,255,.20);
      }

      .dgb-earth-globe__orbit {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 135%;
        height: 135%;
        border-radius: 50%;
        border: 1px solid rgba(239,210,154,.30);
        transform: translate(-50%,-50%) rotate(42deg) scaleX(.34);
        z-index: 1;
        pointer-events: none;
        filter: drop-shadow(0 0 12px rgba(239,210,154,.16));
      }

      .dgb-earth-globe__orbit--b {
        border-color: rgba(142,197,255,.30);
        transform: translate(-50%,-50%) rotate(-38deg) scaleX(.34);
      }

      .dgb-earth-globe__label {
        position: absolute;
        left: 50%;
        bottom: 9%;
        transform: translateX(-50%);
        z-index: 10;
        padding: 5px 8px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(4,10,22,.44);
        color: rgba(234,244,255,.82);
        font: 700 10px/1.1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        letter-spacing: .12em;
        text-transform: uppercase;
        white-space: nowrap;
        backdrop-filter: blur(5px);
      }

      .dgb-earth-globe--hero .dgb-earth-globe__label {
        display: none;
      }

      .dgb-earth-globe--proof .dgb-earth-globe__label {
        bottom: 7%;
      }

      @media (max-width: 520px) {
        .dgb-earth-globe--hero {
          width: 196px;
        }

        .dgb-earth-globe--proof {
          width: min(76vw, 390px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .dgb-earth-globe,
        .dgb-earth-globe * {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createSvg() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");

    svg.setAttribute("class", "dgb-earth-globe__svg");
    svg.setAttribute("viewBox", "0 0 240 240");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    svg.innerHTML = `
      <defs>
        <clipPath id="dgbEarthClipSharedV1">
          <circle cx="120" cy="120" r="108"></circle>
        </clipPath>
      </defs>

      <circle class="dgb-earth-globe__ocean" cx="120" cy="120" r="108"></circle>
      <circle class="dgb-earth-globe__deep-ocean" cx="151" cy="142" r="94"></circle>

      <g clip-path="url(#dgbEarthClipSharedV1)">
        <path class="dgb-earth-globe__grid" d="M12 120 H228"></path>
        <path class="dgb-earth-globe__grid" d="M120 12 V228"></path>
        <ellipse class="dgb-earth-globe__grid" cx="120" cy="120" rx="108" ry="38"></ellipse>
        <ellipse class="dgb-earth-globe__grid" cx="120" cy="120" rx="108" ry="70"></ellipse>
        <ellipse class="dgb-earth-globe__grid" cx="120" cy="120" rx="72" ry="108"></ellipse>
        <ellipse class="dgb-earth-globe__grid" cx="120" cy="120" rx="36" ry="108"></ellipse>

        <path class="dgb-earth-globe__continent" d="M33 52 C48 33 82 31 103 46 C118 57 116 76 96 82 C83 86 80 96 66 96 C47 96 29 82 28 66 C27 61 29 56 33 52 Z"></path>
        <path class="dgb-earth-globe__continent" d="M74 98 C93 96 109 112 106 136 C104 154 95 176 78 194 C67 184 56 163 58 140 C60 119 64 104 74 98 Z"></path>

        <path class="dgb-earth-globe__continent-warm" d="M118 42 C139 27 171 31 195 50 C213 64 214 88 195 99 C178 109 158 98 150 80 C143 65 127 63 118 52 C115 48 115 45 118 42 Z"></path>
        <path class="dgb-earth-globe__continent-warm" d="M131 94 C151 86 181 95 199 115 C218 137 213 169 189 183 C169 195 139 183 126 160 C116 142 116 105 131 94 Z"></path>
        <path class="dgb-earth-globe__continent" d="M141 80 C151 74 168 75 178 86 C174 96 160 100 149 94 C141 90 137 84 141 80 Z"></path>

        <path class="dgb-earth-globe__continent" d="M185 181 C205 176 225 188 232 207 C212 227 178 225 160 205 C163 193 172 185 185 181 Z"></path>
        <path class="dgb-earth-globe__ice" d="M27 211 C70 197 146 198 211 212 C169 236 74 237 27 211 Z"></path>
        <path class="dgb-earth-globe__ice" d="M35 27 C70 11 162 10 202 27 C158 38 81 38 35 27 Z"></path>

        <path class="dgb-earth-globe__cloud" d="M24 79 C55 66 83 70 107 84 C79 92 49 92 24 79 Z"></path>
        <path class="dgb-earth-globe__cloud" d="M87 38 C122 27 161 31 193 50 C156 55 119 53 87 38 Z"></path>
        <path class="dgb-earth-globe__cloud" d="M103 159 C136 146 177 153 209 173 C169 178 132 176 103 159 Z"></path>
        <path class="dgb-earth-globe__cloud" d="M39 125 C69 115 94 121 116 136 C84 141 59 139 39 125 Z"></path>
        <path class="dgb-earth-globe__cloud" d="M135 67 C160 60 185 65 207 79 C177 86 154 83 135 67 Z"></path>
      </g>

      <circle class="dgb-earth-globe__rim" cx="120" cy="120" r="108"></circle>
    `;

    return svg;
  }

  function createEarthGlobe(options = {}) {
    injectStyle();

    const mode = options.mode === "proof" ? "proof" : "hero";
    const config = CONFIGS[mode];
    const globe = document.createElement("div");

    globe.className = config.className;
    globe.setAttribute("role", "img");
    globe.setAttribute("aria-label", options.ariaLabel || config.ariaLabel);
    globe.setAttribute("data-dgb-shared-earth-globe", "true");
    globe.setAttribute("data-dgb-earth-mode", mode);
    globe.setAttribute("data-dgb-earth-standard", "seven-continent-read");
    globe.setAttribute("data-dgb-africa-visible", "true");

    const orbitA = document.createElement("span");
    orbitA.className = "dgb-earth-globe__orbit";
    orbitA.setAttribute("aria-hidden", "true");

    const orbitB = document.createElement("span");
    orbitB.className = "dgb-earth-globe__orbit dgb-earth-globe__orbit--b";
    orbitB.setAttribute("aria-hidden", "true");

    const shadow = document.createElement("span");
    shadow.className = "dgb-earth-globe__shadow";
    shadow.setAttribute("aria-hidden", "true");

    const terminator = document.createElement("span");
    terminator.className = "dgb-earth-globe__terminator";
    terminator.setAttribute("aria-hidden", "true");

    const atmosphere = document.createElement("span");
    atmosphere.className = "dgb-earth-globe__atmosphere";
    atmosphere.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.className = "dgb-earth-globe__label";
    label.textContent = "Africa · Seven Continents";

    globe.append(orbitA, orbitB, createSvg(), shadow, terminator, atmosphere, label);

    return globe;
  }

  function mountEarthGlobe(target, options = {}) {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return null;

    const globe = createEarthGlobe(options);
    element.replaceChildren(globe);
    element.setAttribute("data-dgb-shared-earth-mounted", "true");
    element.setAttribute("data-dgb-earth-source", "/shared/earth_globe.js");

    return globe;
  }

  window.DGBEarthGlobe = {
    version: "shared-earth-globe-v1",
    create: createEarthGlobe,
    mount: mountEarthGlobe
  };
})();
