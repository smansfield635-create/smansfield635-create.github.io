(() => {
  "use strict";

  const VERSION = "shared-earth-globe-axis-spin-v2";
  const STYLE_ID = "dgb-shared-earth-globe-axis-spin-v2";

  const EARTH_TEXTURE_URL =
    "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg";

  const DEFAULTS = {
    textureDuration: "44s",
    cloudDuration: "68s",
    tiltDegrees: -23.5,
    texturePositionX: "58%",
    texturePositionY: "46%",
    textureEndPositionX: "-187%",
    textureSize: "245% 124%"
  };

  const MODE_CONFIG = {
    hero: {
      className: "dgb-earth-globe dgb-earth-globe--hero",
      label: "",
      ariaLabel: "Planet Earth Demo Universe on a tilted axis with natural spin"
    },
    proof: {
      className: "dgb-earth-globe dgb-earth-globe--proof",
      label: "Axis · Natural Spin",
      ariaLabel: "Planet Earth proof globe on a tilted axis with natural spin"
    }
  };

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .dgb-earth-globe {
        --earth-texture-url: url("${EARTH_TEXTURE_URL}");
        --earth-texture-duration: ${DEFAULTS.textureDuration};
        --earth-cloud-duration: ${DEFAULTS.cloudDuration};
        --earth-texture-position-x: ${DEFAULTS.texturePositionX};
        --earth-texture-position-y: ${DEFAULTS.texturePositionY};
        --earth-texture-end-position-x: ${DEFAULTS.textureEndPositionX};
        --earth-texture-size: ${DEFAULTS.textureSize};

        position: relative;
        z-index: 3;
        aspect-ratio: 1;
        border-radius: 50%;
        overflow: visible;
        isolation: isolate;
        transform: rotate(${DEFAULTS.tiltDegrees}deg);
        transform-origin: 50% 50%;
        filter: drop-shadow(0 0 28px rgba(120,205,255,.24));
      }

      .dgb-earth-globe--hero {
        width: 190px;
        max-width: min(64vw, 190px);
      }

      .dgb-earth-globe--proof {
        width: min(78vw, 430px);
      }

      .dgb-earth-globe__axis {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 1;
        width: 2px;
        height: 124%;
        transform: translate(-50%,-50%);
        border-radius: 999px;
        background: linear-gradient(
          180deg,
          transparent,
          rgba(240,215,156,.22),
          rgba(184,228,255,.58),
          rgba(240,215,156,.22),
          transparent
        );
        box-shadow: 0 0 20px rgba(184,228,255,.24);
        pointer-events: none;
      }

      .dgb-earth-globe__atmosphere {
        position: absolute;
        inset: -4%;
        z-index: 1;
        border-radius: 50%;
        pointer-events: none;
        background: radial-gradient(circle at 50% 50%, rgba(120,205,255,.18), transparent 63%);
        filter: blur(10px);
      }

      .dgb-earth-globe__sphere {
        position: absolute;
        inset: 0;
        z-index: 3;
        border-radius: 50%;
        overflow: hidden;
        isolation: isolate;
        border: 1px solid rgba(218,239,255,.84);
        background:
          radial-gradient(circle at 50% 50%, #0b63b5 0%, #073f86 48%, #031b42 100%);
        box-shadow:
          inset -50px -40px 70px rgba(0,0,0,.66),
          inset 22px 17px 38px rgba(255,255,255,.24),
          0 0 60px rgba(142,197,255,.56),
          0 0 150px rgba(239,210,154,.20);
      }

      .dgb-earth-globe__texture {
        position: absolute;
        inset: -1.5%;
        z-index: 2;
        border-radius: 50%;
        background-image: var(--earth-texture-url);
        background-repeat: repeat-x;
        background-size: var(--earth-texture-size);
        background-position: var(--earth-texture-position-x) var(--earth-texture-position-y);
        filter: saturate(1.16) contrast(1.14) brightness(.96);
        transform: scale(1.08);
        animation: dgbEarthTextureSpin var(--earth-texture-duration) linear infinite;
      }

      .dgb-earth-globe__texture::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background:
          radial-gradient(circle at 31% 22%, rgba(255,255,255,.30), transparent 13%),
          radial-gradient(circle at 42% 36%, rgba(255,255,255,.13), transparent 24%),
          linear-gradient(90deg, rgba(255,255,255,.10), transparent 42%, rgba(0,0,0,.34) 100%);
        mix-blend-mode: screen;
      }

      .dgb-earth-globe__texture::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background:
          radial-gradient(circle at 78% 72%, rgba(0,0,0,.48), transparent 40%),
          radial-gradient(circle at 96% 50%, rgba(0,0,0,.48), transparent 28%),
          radial-gradient(circle at 3% 50%, rgba(255,255,255,.08), transparent 24%),
          linear-gradient(105deg, transparent 0 57%, rgba(0,0,0,.28) 76%, rgba(0,0,0,.54) 100%);
      }

      .dgb-earth-globe__projection-mask {
        position: absolute;
        inset: 0;
        z-index: 3;
        border-radius: 50%;
        pointer-events: none;
        background:
          radial-gradient(circle at 50% 50%, transparent 0 61%, rgba(0,0,0,.16) 72%, rgba(0,0,0,.54) 100%),
          linear-gradient(90deg, rgba(0,0,0,.10), transparent 20%, transparent 78%, rgba(0,0,0,.35));
        mix-blend-mode: multiply;
      }

      .dgb-earth-globe__cloud-layer {
        position: absolute;
        inset: -2%;
        z-index: 4;
        border-radius: 50%;
        pointer-events: none;
        filter: blur(1.8px);
        opacity: .62;
        background:
          radial-gradient(ellipse at 30% 30%, rgba(255,255,255,.34) 0 8%, transparent 18%),
          radial-gradient(ellipse at 58% 25%, rgba(255,255,255,.26) 0 6%, transparent 18%),
          radial-gradient(ellipse at 69% 63%, rgba(255,255,255,.24) 0 7%, transparent 21%),
          radial-gradient(ellipse at 36% 70%, rgba(255,255,255,.18) 0 8%, transparent 21%),
          repeating-linear-gradient(18deg, transparent 0 25px, rgba(255,255,255,.10) 26px 30px, transparent 31px 60px);
        mask-image: radial-gradient(circle at 50% 50%, black 0 66%, rgba(0,0,0,.55) 78%, transparent 100%);
        animation: dgbEarthCloudDrift var(--earth-cloud-duration) linear infinite;
      }

      .dgb-earth-globe__cloud-layer::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background:
          linear-gradient(15deg, transparent 0 24%, rgba(255,255,255,.16) 28%, transparent 36%),
          linear-gradient(-12deg, transparent 0 46%, rgba(255,255,255,.13) 50%, transparent 59%),
          linear-gradient(22deg, transparent 0 66%, rgba(255,255,255,.12) 70%, transparent 78%);
        opacity: .84;
      }

      .dgb-earth-globe__cloud-layer::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background:
          radial-gradient(ellipse at 43% 48%, rgba(255,255,255,.18) 0 7%, transparent 18%),
          radial-gradient(ellipse at 66% 42%, rgba(255,255,255,.14) 0 8%, transparent 20%),
          radial-gradient(ellipse at 25% 58%, rgba(255,255,255,.12) 0 9%, transparent 22%);
        opacity: .78;
      }

      .dgb-earth-globe__grid {
        position: absolute;
        inset: 0;
        z-index: 5;
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: none;
        opacity: .38;
      }

      .dgb-earth-globe__grid-line {
        fill: none;
        stroke: rgba(255,255,255,.14);
        stroke-width: .58;
      }

      .dgb-earth-globe__rim {
        position: absolute;
        inset: -1px;
        z-index: 8;
        border-radius: 50%;
        pointer-events: none;
        box-shadow:
          inset 0 0 18px rgba(255,255,255,.20),
          inset 0 0 48px rgba(100,180,255,.18),
          0 0 26px rgba(120,205,255,.48),
          0 0 66px rgba(120,205,255,.22);
      }

      .dgb-earth-globe__axis-cap {
        position: absolute;
        left: 50%;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        transform: translateX(-50%);
        z-index: 9;
        background: rgba(240,215,156,.78);
        box-shadow: 0 0 16px rgba(240,215,156,.40);
        pointer-events: none;
      }

      .dgb-earth-globe__axis-cap--north {
        top: -5px;
      }

      .dgb-earth-globe__axis-cap--south {
        bottom: -5px;
      }

      .dgb-earth-globe__label {
        position: absolute;
        left: 50%;
        bottom: 7%;
        transform: translateX(-50%) rotate(23.5deg);
        z-index: 10;
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(4,10,22,.58);
        color: rgba(234,244,255,.90);
        font: 800 10px/1.1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        letter-spacing: .13em;
        text-transform: uppercase;
        white-space: nowrap;
        backdrop-filter: blur(5px);
      }

      .dgb-earth-globe--hero .dgb-earth-globe__label {
        display: none;
      }

      .dgb-earth-globe--proof .dgb-earth-globe__label {
        display: inline-flex;
      }

      @keyframes dgbEarthTextureSpin {
        from { background-position: var(--earth-texture-position-x) var(--earth-texture-position-y); }
        to { background-position: var(--earth-texture-end-position-x) var(--earth-texture-position-y); }
      }

      @keyframes dgbEarthCloudDrift {
        from { transform: translateX(0) scale(1.02); }
        to { transform: translateX(-18%) scale(1.02); }
      }

      @media (max-width: 560px) {
        .dgb-earth-globe--hero {
          width: 184px;
          max-width: min(62vw, 184px);
        }

        .dgb-earth-globe--proof {
          width: min(78vw, 390px);
        }

        .dgb-earth-globe__label {
          font-size: 9px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .dgb-earth-globe__texture,
        .dgb-earth-globe__cloud-layer {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createSvgElement(className) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");

    svg.setAttribute("class", className);
    svg.setAttribute("viewBox", "0 0 240 240");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    return svg;
  }

  function createGridSvg() {
    const svg = createSvgElement("dgb-earth-globe__grid");

    svg.innerHTML = `
      <defs>
        <clipPath id="dgbSharedEarthGridClipV2">
          <circle cx="120" cy="120" r="108"></circle>
        </clipPath>
      </defs>

      <g clip-path="url(#dgbSharedEarthGridClipV2)">
        <path class="dgb-earth-globe__grid-line" d="M12 120 H228"></path>
        <path class="dgb-earth-globe__grid-line" d="M120 12 V228"></path>
        <ellipse class="dgb-earth-globe__grid-line" cx="120" cy="120" rx="108" ry="34"></ellipse>
        <ellipse class="dgb-earth-globe__grid-line" cx="120" cy="120" rx="108" ry="66"></ellipse>
        <ellipse class="dgb-earth-globe__grid-line" cx="120" cy="120" rx="82" ry="108"></ellipse>
        <ellipse class="dgb-earth-globe__grid-line" cx="120" cy="120" rx="45" ry="108"></ellipse>
        <ellipse class="dgb-earth-globe__grid-line" cx="120" cy="120" rx="18" ry="108"></ellipse>
      </g>
    `;

    return svg;
  }

  function normalizeMode(mode) {
    return mode === "proof" ? "proof" : "hero";
  }

  function createEarthGlobe(options = {}) {
    injectStyle();

    const mode = normalizeMode(options.mode);
    const config = MODE_CONFIG[mode];

    const globe = document.createElement("div");
    globe.className = config.className;
    globe.setAttribute("role", "img");
    globe.setAttribute("aria-label", options.ariaLabel || config.ariaLabel);
    globe.setAttribute("data-dgb-shared-earth-globe", "true");
    globe.setAttribute("data-dgb-earth-mode", mode);
    globe.setAttribute("data-dgb-earth-version", VERSION);
    globe.setAttribute("data-dgb-axis-spin-pass", "true");
    globe.setAttribute("data-dgb-axis-degrees", "23.5");
    globe.setAttribute("data-dgb-spin-system", "texture-drift-natural");
    globe.setAttribute("data-dgb-cloud-system", "soft-independent-drift");
    globe.setAttribute("data-dgb-earth-texture-source", "NASA Blue Marble");

    globe.style.setProperty(
      "--earth-texture-url",
      `url("${options.textureUrl || EARTH_TEXTURE_URL}")`
    );

    if (options.textureDuration) {
      globe.style.setProperty("--earth-texture-duration", options.textureDuration);
    }

    if (options.cloudDuration) {
      globe.style.setProperty("--earth-cloud-duration", options.cloudDuration);
    }

    if (options.texturePositionX) {
      globe.style.setProperty("--earth-texture-position-x", options.texturePositionX);
    }

    if (options.texturePositionY) {
      globe.style.setProperty("--earth-texture-position-y", options.texturePositionY);
    }

    if (options.textureEndPositionX) {
      globe.style.setProperty("--earth-texture-end-position-x", options.textureEndPositionX);
    }

    if (options.textureSize) {
      globe.style.setProperty("--earth-texture-size", options.textureSize);
    }

    const axis = document.createElement("span");
    axis.className = "dgb-earth-globe__axis";
    axis.setAttribute("aria-hidden", "true");

    const atmosphere = document.createElement("span");
    atmosphere.className = "dgb-earth-globe__atmosphere";
    atmosphere.setAttribute("aria-hidden", "true");

    const sphere = document.createElement("span");
    sphere.className = "dgb-earth-globe__sphere";
    sphere.setAttribute("aria-hidden", "true");

    const texture = document.createElement("span");
    texture.className = "dgb-earth-globe__texture";
    texture.setAttribute("aria-hidden", "true");

    const projectionMask = document.createElement("span");
    projectionMask.className = "dgb-earth-globe__projection-mask";
    projectionMask.setAttribute("aria-hidden", "true");

    const cloudLayer = document.createElement("span");
    cloudLayer.className = "dgb-earth-globe__cloud-layer";
    cloudLayer.setAttribute("aria-hidden", "true");

    const rim = document.createElement("span");
    rim.className = "dgb-earth-globe__rim";
    rim.setAttribute("aria-hidden", "true");

    const northCap = document.createElement("span");
    northCap.className = "dgb-earth-globe__axis-cap dgb-earth-globe__axis-cap--north";
    northCap.setAttribute("aria-hidden", "true");

    const southCap = document.createElement("span");
    southCap.className = "dgb-earth-globe__axis-cap dgb-earth-globe__axis-cap--south";
    southCap.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.className = "dgb-earth-globe__label";
    label.textContent = options.label || config.label || "Axis · Natural Spin";

    sphere.append(
      texture,
      projectionMask,
      createGridSvg(),
      cloudLayer,
      rim
    );

    globe.append(
      axis,
      atmosphere,
      sphere,
      northCap,
      southCap,
      label
    );

    return globe;
  }

  function mountEarthGlobe(target, options = {}) {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return null;

    const mode = normalizeMode(options.mode);
    const globe = createEarthGlobe({ ...options, mode });

    element.replaceChildren(globe);
    element.setAttribute("data-dgb-shared-earth-mounted", "true");
    element.setAttribute("data-dgb-earth-source", "/shared/earth_globe.js");
    element.setAttribute("data-dgb-earth-version", VERSION);
    element.setAttribute("data-dgb-earth-mode", mode);
    element.setAttribute("data-dgb-axis-spin-pass", "true");

    return globe;
  }

  window.DGBEarthGlobe = {
    version: VERSION,
    create: createEarthGlobe,
    mount: mountEarthGlobe
  };
})();
