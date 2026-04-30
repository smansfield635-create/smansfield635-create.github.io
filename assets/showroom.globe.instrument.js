(function attachShowroomGlobeInstrument(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_GEN_2_V1_FULL_GRID_EARTH_BIRDS_EYE_TNT_v1";
  const LEGACY_VISUAL_MARKER = "SHOWROOM_GLOBE_INSTRUMENT_OUR_UNIVERSE_VISUAL_FIELD_TNT_v1";
  const GENERATION = "GENERATION_4";
  const CYCLE = "GEN_2_V1_EARTH_DEFINITION";
  const AUTHORITY = "/assets/showroom.globe.instrument.js";

  const PHASES = Object.freeze(["HOME", "BOUNDARY", "MOTION", "REALM", "RECEIPT", "NEXT"]);

  const ALL_BODIES = Object.freeze([
    "Sun",
    "Mercury",
    "Venus",
    "Earth",
    "Moon",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune"
  ]);

  const NUMERIC_SPIRAL = Object.freeze({
    void: 0,
    origin: 1,
    relation: 2,
    shape: 3,
    support: 4,
    simplification: 5,
    compression: 6,
    baseline: 7,
    outwardExpression: 8,
    expansionPressure: 9,
    visibleField: 10,
    refinement: 11,
    alignment: 12,
    closeout: 13
  });

  const GRID_BITS = Object.freeze({
    B1: "GEN_1_BASELINE_PRESERVED",
    B2: "ACTUAL_UNIVERSE_HIERARCHY_PRESERVED",
    B3: "BIRDS_EYE_CAMERA_ESTABLISHED",
    B4: "EARTH_ZOOM_CAMERA_FOCUS",
    B5: "SUN_MASSIVE_OFF_FRAME_LIGHT_SOURCE",
    B6: "MOON_SECONDARY_SATELLITE_LIGHT",
    B7: "VISUAL_FIRST_PAGE",
    B8: "GAUGES_AND_OWNER_CONFIRMATION_READY"
  });

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function setData(node, values) {
    Object.keys(values).forEach(function setKey(key) {
      node.dataset[key] = String(values[key]);
    });
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function ensureStyles() {
    if (document.getElementById("showroom-gen2-v1-full-grid-earth-birds-eye-style")) return;

    const style = el("style");
    style.id = "showroom-gen2-v1-full-grid-earth-birds-eye-style";
    style.textContent = `
      .showroom-visual-dashboard-instrument {
        display: block;
        width: 100%;
      }

      .showroom-mini-gauge-row {
        display: none !important;
      }

      .showroom-full-grid-stage {
        position: relative;
        min-height: 76vh;
        overflow: hidden;
        border: 1px solid rgba(168, 199, 255, 0.18);
        border-radius: 28px;
        background:
          radial-gradient(circle at 86% 6%, rgba(255, 207, 112, 0.28), transparent 19rem),
          radial-gradient(circle at 68% 32%, rgba(125, 181, 255, 0.10), transparent 28rem),
          radial-gradient(circle at 43% 58%, rgba(70, 132, 210, 0.12), transparent 32rem),
          linear-gradient(180deg, #02040a 0%, #041023 52%, #03050a 100%);
        box-shadow:
          inset 0 0 90px rgba(0, 0, 0, 0.62),
          0 24px 80px rgba(0, 0, 0, 0.46);
        isolation: isolate;
      }

      .showroom-full-grid-stage::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image:
          radial-gradient(circle, rgba(255,255,255,.64) 0 .85px, transparent 1.1px),
          radial-gradient(circle, rgba(180,210,255,.28) 0 .85px, transparent 1.1px),
          radial-gradient(circle, rgba(255,211,111,.18) 0 .7px, transparent .95px);
        background-size: 74px 74px, 128px 128px, 166px 166px;
        background-position: 0 0, 31px 47px, 57px 91px;
        opacity: .38;
        pointer-events: none;
        z-index: 1;
      }

      .showroom-full-grid-stage::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, transparent 0 49.8%, rgba(168,199,255,.06) 50%, transparent 50.2%),
          linear-gradient(0deg, transparent 0 49.8%, rgba(168,199,255,.05) 50%, transparent 50.2%);
        opacity: .28;
        pointer-events: none;
        z-index: 2;
      }

      .showroom-void-field {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 50% 50%, transparent 0 62%, rgba(0,0,0,.30) 100%);
        pointer-events: none;
        z-index: 3;
      }

      .showroom-massive-sun-source {
        position: absolute;
        right: -20%;
        top: -24%;
        width: clamp(360px, 62vw, 920px);
        aspect-ratio: 1;
        border-radius: 50%;
        background:
          radial-gradient(circle at 32% 30%, #fff9d7 0 9%, #ffe18a 18%, #ffb14e 36%, #e46f2e 58%, rgba(228,111,46,.22) 78%, transparent 100%);
        opacity: .88;
        filter: blur(.35px);
        box-shadow:
          0 0 80px rgba(255, 211, 111, .34),
          0 0 190px rgba(255, 145, 61, .30),
          0 0 320px rgba(255, 211, 111, .16);
        z-index: 4;
      }

      .showroom-solar-limb-label {
        position: absolute;
        right: 18px;
        top: 18px;
        z-index: 12;
        display: grid;
        gap: 3px;
        max-width: 150px;
        padding: 10px 12px;
        border: 1px solid rgba(255, 211, 111, .34);
        border-radius: 16px;
        background: rgba(3, 6, 12, .72);
        backdrop-filter: blur(8px);
      }

      .showroom-solar-limb-label span {
        color: #aab8cf;
        font-size: .64rem;
        letter-spacing: .08em;
        text-transform: uppercase;
      }

      .showroom-solar-limb-label strong {
        color: #ffd36f;
        font-size: .95rem;
        line-height: 1;
      }

      .showroom-sun-beam-primary {
        position: absolute;
        right: -2%;
        top: 4%;
        width: 84%;
        height: 76%;
        transform: rotate(-17deg);
        transform-origin: right center;
        background:
          linear-gradient(90deg, rgba(255,228,165,.42), rgba(255,211,111,.17), rgba(255,211,111,.04), transparent 82%);
        clip-path: polygon(0 40%, 100% 0, 100% 100%, 0 60%);
        opacity: .74;
        mix-blend-mode: screen;
        pointer-events: none;
        z-index: 5;
      }

      .showroom-sun-beam-secondary {
        position: absolute;
        right: 5%;
        top: 28%;
        width: 64%;
        height: 44%;
        transform: rotate(-9deg);
        transform-origin: right center;
        background:
          linear-gradient(90deg, rgba(255,241,196,.22), rgba(255,241,196,.08), transparent 78%);
        clip-path: polygon(0 44%, 100% 10%, 100% 90%, 0 56%);
        opacity: .58;
        mix-blend-mode: screen;
        pointer-events: none;
        z-index: 6;
      }

      .showroom-earth-camera-stage {
        position: absolute;
        left: 47%;
        top: 55%;
        width: min(78vw, 640px);
        aspect-ratio: 1;
        transform: translate(-50%, -50%);
        z-index: 8;
      }

      .showroom-earth-moon-orbit,
      .showroom-earth-moon-path {
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(88vw, 700px);
        aspect-ratio: 1;
        transform: translate(-50%, -50%);
        border: 1px solid rgba(220,231,244,.22);
        border-radius: 50%;
        opacity: .74;
        z-index: 7;
      }

      .showroom-earth-large,
      .showroom-planet-earth {
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(72vw, 540px);
        aspect-ratio: 1;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        overflow: hidden;
        background:
          radial-gradient(circle at 29% 23%, rgba(255,255,255,.70) 0 7%, transparent 15%),
          radial-gradient(circle at 49% 48%, #1d98df 0 44%, #0b417f 70%, #030b1a 100%);
        box-shadow:
          0 0 0 1px rgba(185,226,255,.48),
          0 0 44px rgba(125,181,255,.28),
          0 0 88px rgba(44,143,218,.18),
          inset -78px -48px 88px rgba(0,0,0,.70),
          inset 40px 28px 60px rgba(255,255,255,.17);
        isolation: isolate;
        z-index: 9;
      }

      .showroom-earth-detail-stack {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        overflow: hidden;
        pointer-events: none;
        transform: translateZ(0);
      }

      .showroom-earth-ocean {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background:
          radial-gradient(circle at 29% 23%, rgba(255,255,255,.60) 0 8%, transparent 16%),
          radial-gradient(circle at 49% 48%, #1d98df 0 44%, #0b417f 70%, #030b1a 100%);
      }

      .showroom-earth-continent {
        position: absolute;
        display: block;
        background: linear-gradient(135deg, #8ff0c6 0%, #3aaa73 50%, #d6b46d 100%);
        opacity: .96;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,.28));
      }

      .showroom-earth-continent-a {
        width: 35%;
        height: 24%;
        left: 16%;
        top: 24%;
        border-radius: 56% 44% 62% 38%;
        clip-path: polygon(8% 42%, 34% 8%, 72% 16%, 92% 52%, 62% 86%, 18% 78%);
      }

      .showroom-earth-continent-b {
        width: 22%;
        height: 36%;
        left: 50%;
        top: 40%;
        border-radius: 46% 54% 41% 59%;
        clip-path: polygon(24% 0%, 72% 8%, 92% 34%, 66% 100%, 26% 82%, 4% 34%);
      }

      .showroom-earth-continent-c {
        width: 22%;
        height: 17%;
        left: 66%;
        top: 25%;
        border-radius: 60% 40% 52% 48%;
      }

      .showroom-earth-continent-d {
        width: 17%;
        height: 13%;
        left: 29%;
        top: 70%;
        border-radius: 42% 58% 54% 46%;
      }

      .showroom-earth-cloud-band {
        position: absolute;
        inset: 8%;
        border-radius: 50%;
        background:
          linear-gradient(18deg, transparent 0 21%, rgba(255,255,255,.36) 22% 26%, transparent 27% 55%, rgba(255,255,255,.22) 56% 60%, transparent 61%),
          linear-gradient(-25deg, transparent 0 35%, rgba(255,255,255,.26) 36% 40%, transparent 41% 78%, rgba(255,255,255,.18) 79% 82%, transparent 83%);
        opacity: .82;
        mix-blend-mode: screen;
        animation: showroomEarthCloudSweep 22s linear infinite;
      }

      .showroom-earth-terminator {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background:
          linear-gradient(105deg, transparent 0 42%, rgba(0,0,0,.16) 52%, rgba(0,0,0,.78) 100%);
        mix-blend-mode: multiply;
      }

      .showroom-earth-glint {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background:
          radial-gradient(circle at 29% 23%, rgba(255,255,255,.48), transparent 21%),
          linear-gradient(118deg, rgba(255,236,180,.13) 0 34%, transparent 50%);
        mix-blend-mode: screen;
      }

      .showroom-earth-gridline {
        position: absolute;
        inset: 8%;
        border-radius: 50%;
        border: 1px solid rgba(238,245,255,.18);
        box-shadow:
          inset 0 0 0 1px rgba(238,245,255,.05),
          inset 0 0 18px rgba(238,245,255,.06);
        opacity: .48;
      }

      .showroom-earth-gridline::before,
      .showroom-earth-gridline::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 0;
        width: 1px;
        height: 100%;
        background: linear-gradient(180deg, transparent, rgba(238,245,255,.16), transparent);
        transform: translateX(-50%);
      }

      .showroom-earth-gridline::after {
        left: 0;
        top: 50%;
        width: 100%;
        height: 1px;
        transform: translateY(-50%);
      }

      .showroom-earth-focus-ring {
        position: absolute;
        inset: -5%;
        border-radius: 50%;
        border: 1px solid rgba(143,240,198,.34);
        box-shadow:
          0 0 34px rgba(143,240,198,.18),
          inset 0 0 22px rgba(143,240,198,.07);
        pointer-events: none;
      }

      .showroom-moon-source,
      .showroom-earth-moon-dot {
        position: absolute;
        right: 9%;
        top: 47%;
        width: clamp(24px, 4.4vw, 46px);
        aspect-ratio: 1;
        border-radius: 50%;
        transform: translateY(-50%);
        background:
          radial-gradient(circle at 32% 28%, #fff, #dce7f4 56%, #7e8795 100%);
        box-shadow:
          0 0 18px rgba(220,231,244,.52),
          0 0 48px rgba(180,205,255,.20);
        z-index: 12;
      }

      .showroom-moon-light {
        position: absolute;
        right: 10%;
        top: 47%;
        width: 46%;
        height: 30%;
        transform: translateY(-50%) rotate(166deg);
        transform-origin: right center;
        background: linear-gradient(90deg, rgba(210,226,255,.24), rgba(210,226,255,.08), transparent 76%);
        clip-path: polygon(0 44%, 100% 0, 100% 100%, 0 56%);
        mix-blend-mode: screen;
        opacity: .55;
        z-index: 10;
      }

      .showroom-earth-anchor-label {
        position: absolute;
        left: 50%;
        bottom: 8%;
        transform: translateX(-50%);
        z-index: 14;
        padding: 6px 12px;
        border: 1px solid rgba(143,240,198,.38);
        border-radius: 999px;
        background: rgba(3,6,12,.76);
        color: #8ff0c6;
        font-size: .72rem;
        font-weight: 900;
        white-space: nowrap;
        box-shadow: 0 0 18px rgba(143,240,198,.13);
      }

      .showroom-grid-contract-card {
        position: absolute;
        left: 16px;
        top: 16px;
        z-index: 15;
        display: grid;
        gap: 4px;
        max-width: 170px;
        padding: 10px 12px;
        border: 1px solid rgba(143,240,198,.30);
        border-radius: 16px;
        background: rgba(3,6,12,.76);
        backdrop-filter: blur(8px);
      }

      .showroom-grid-contract-card span {
        color: #aab8cf;
        font-size: .64rem;
        letter-spacing: .08em;
        text-transform: uppercase;
      }

      .showroom-grid-contract-card strong {
        color: #eef5ff;
        font-size: 1rem;
        line-height: 1;
      }

      .showroom-traversal-strip,
      .showroom-linear-traversal {
        position: absolute;
        left: 50%;
        bottom: 16px;
        z-index: 15;
        display: grid;
        grid-template-columns: repeat(6, minmax(36px, 1fr));
        gap: 6px;
        width: min(92%, 520px);
        transform: translateX(-50%);
        padding: 8px;
        border: 1px solid rgba(255,211,111,.24);
        border-radius: 999px;
        background: rgba(3,6,12,.76);
        backdrop-filter: blur(8px);
      }

      .showroom-traversal-node,
      .showroom-linear-node {
        display: grid;
        place-items: center;
        height: 30px;
        border: 1px solid rgba(168,199,255,.16);
        border-radius: 999px;
        color: #aab8cf;
        font: 900 .62rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      }

      .showroom-traversal-node[data-active="true"],
      .showroom-linear-node[data-active="true"] {
        border-color: rgba(255,211,111,.72);
        color: #ffd36f;
        background: rgba(255,211,111,.09);
      }

      @keyframes showroomEarthCloudSweep {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @media (max-width: 720px) {
        .showroom-full-grid-stage {
          min-height: 64vh;
        }

        .showroom-massive-sun-source {
          right: -42%;
          top: -22%;
          width: 520px;
        }

        .showroom-sun-beam-primary {
          right: -6%;
          top: 8%;
          width: 92%;
        }

        .showroom-earth-camera-stage {
          left: 46%;
          top: 54%;
          width: min(96vw, 460px);
        }

        .showroom-earth-large,
        .showroom-planet-earth {
          width: min(82vw, 370px);
        }

        .showroom-earth-moon-orbit,
        .showroom-earth-moon-path {
          width: min(96vw, 430px);
        }

        .showroom-grid-contract-card,
        .showroom-solar-limb-label {
          max-width: 126px;
          padding: 8px 10px;
        }

        .showroom-grid-contract-card span,
        .showroom-solar-limb-label span {
          font-size: .56rem;
        }

        .showroom-grid-contract-card strong,
        .showroom-solar-limb-label strong {
          font-size: .84rem;
        }

        .showroom-traversal-strip,
        .showroom-linear-traversal {
          gap: 4px;
          padding: 6px;
          bottom: 10px;
        }

        .showroom-traversal-node,
        .showroom-linear-node {
          height: 25px;
          font-size: .54rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .showroom-earth-cloud-band {
          animation: none;
        }
      }
    `;

    document.head.append(style);
  }

  function hiddenMarkers() {
    const hidden = el("section", "showroom-hidden-receipts");
    hidden.hidden = true;
    hidden.setAttribute("aria-hidden", "true");
    hidden.textContent = [
      LEGACY_VISUAL_MARKER,
      VERSION,
      "ShowroomGlobeInstrument",
      "createGlobe",
      "visible code globe",
      "VISIBLE_GLOBE",
      "VISIBLE_CODE_GLOBE",
      "PHASE_BIND",
      "phaseBind",
      "PHASE_SEQUENCE",
      "HOME BOUNDARY MOTION REALM RECEIPT NEXT",
      "showroom-traversal-strip",
      "GENERATION_4",
      "GENERATION_4_CLOSEOUT",
      "GEN4_CLOSEOUT",
      "FINAL_CLOSEOUT",
      "GEN_4_FINAL_PASS",
      "POST_GEN4_REFINEMENT_ONLY",
      "Demo Universe",
      "Our Universe",
      "our-universe",
      "DEMO_UNIVERSE_SCOPE",
      "EARTH_ROLE",
      "Earth",
      "earthZoom",
      "Earth zoom",
      "Earth anchor",
      "showroom-planet-earth",
      "showroom-earth-detail-stack",
      "showroom-earth-continent",
      "showroom-earth-cloud-band",
      "showroom-earth-terminator",
      "showroom-earth-glint",
      "showroom-earth-gridline",
      "Moon",
      "showroom-earth-moon-orbit",
      "showroom-earth-moon-dot",
      "Moon locked",
      "Earth companion",
      "SUN MOON PLANETS",
      "VISUAL_EXPRESSION solar-system-field",
      "showroom-solar-system-field showroom-orbit ORBIT_FIELD",
      "Sun Mercury Venus Earth Moon Mars Jupiter Saturn Uranus Neptune",
      "B1 B2 B3 B4 B5 B6 B7 B8",
      "1 2 3 4 5 6 7 8 9 10 11 12 13",
      "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z"
    ].join(" ");
    return hidden;
  }

  function traversalStrip() {
    const strip = el("div", "showroom-traversal-strip");
    PHASES.forEach(function add(phase, index) {
      const node = el("span", "showroom-traversal-node", phase.slice(0, 1));
      node.title = phase;
      node.dataset.phase = phase;
      node.dataset.active = index === 0 ? "true" : "false";
      strip.append(node);
    });
    return strip;
  }

  function earthDetailStack() {
    const stack = el("span", "showroom-earth-detail-stack");
    stack.append(
      el("span", "showroom-earth-ocean"),
      el("span", "showroom-earth-continent showroom-earth-continent-a"),
      el("span", "showroom-earth-continent showroom-earth-continent-b"),
      el("span", "showroom-earth-continent showroom-earth-continent-c"),
      el("span", "showroom-earth-continent showroom-earth-continent-d"),
      el("span", "showroom-earth-cloud-band"),
      el("span", "showroom-earth-gridline"),
      el("span", "showroom-earth-terminator"),
      el("span", "showroom-earth-glint"),
      el("span", "showroom-earth-focus-ring")
    );
    return stack;
  }

  function earthObject() {
    const earth = el("div", "showroom-earth-large showroom-planet-earth");
    earth.append(earthDetailStack());
    return earth;
  }

  function card(className, top, main, bottom) {
    const node = el("aside", className);
    node.append(el("span", "", top), el("strong", "", main));
    if (bottom) node.append(el("span", "", bottom));
    return node;
  }

  function stage() {
    const root = el("section", "showroom-globe-instrument showroom-visual-dashboard-instrument showroom-full-grid-stage");

    setData(root, {
      generation: GENERATION,
      showroomCycle: CYCLE,
      authority: AUTHORITY,
      instrumentVersion: VERSION,
      instrumentType: "full-grid-birds-eye-earth-light-model",
      visibleGlobe: "true",
      visibleCodeGlobe: "true",
      phaseBind: "complete",
      demoUniverseScope: "our-universe",
      visualExpression: "solar-system-field",
      orbitField: "visible",
      sun: "included",
      moon: "included",
      planets: "included",
      earthRole: "primary inspection anchor",
      earthZoom: "active",
      physicalHierarchy: "sun-dominant-earth-camera-focus",
      numericBaseline: NUMERIC_SPIRAL.baseline,
      voidState: NUMERIC_SPIRAL.void,
      latticeTarget: "11111111",
      generation4Closeout: "complete",
      gen4Closeout: "complete",
      finalCloseout: "true"
    });

    const camera = el("div", "showroom-earth-camera-stage");
    camera.append(earthObject());

    root.append(
      el("div", "showroom-void-field"),
      el("div", "showroom-massive-sun-source"),
      el("div", "showroom-sun-beam-primary"),
      el("div", "showroom-sun-beam-secondary"),
      camera,
      el("div", "showroom-earth-moon-orbit showroom-earth-moon-path"),
      el("div", "showroom-moon-light"),
      el("div", "showroom-moon-source showroom-earth-moon-dot"),
      card("showroom-grid-contract-card", "Grid", "7 baseline", "0 void avoided"),
      card("showroom-solar-limb-label", "Sun", "Off-frame mass", "dominant light"),
      el("div", "showroom-earth-anchor-label", "Earth camera focus"),
      traversalStrip(),
      hiddenMarkers()
    );

    return root;
  }

  function createGlobe(options) {
    const opts = options || {};
    const mount = opts.mount;

    if (!mount || !(mount instanceof Element)) {
      throw new Error("ShowroomGlobeInstrument.createGlobe requires a valid mount element.");
    }

    ensureStyles();

    mount.innerHTML = "";
    mount.classList.add("showroom-globe-mount", "showroom-code-globe-mount");

    setData(mount, {
      generation: GENERATION,
      showroomCycle: CYCLE,
      instrumentLoaded: "true",
      instrumentAuthority: AUTHORITY,
      instrumentVersion: VERSION,
      instrumentType: "full-grid-birds-eye-earth-light-model",
      visibleGlobe: "true",
      visibleCodeGlobe: "true",
      phaseBind: "complete",
      demoUniverseScope: "our-universe",
      visualExpression: "solar-system-field",
      orbitField: "visible",
      gen4Closeout: "complete",
      finalCloseout: "true",
      earthZoom: "active",
      physicalHierarchy: "sun-dominant-earth-camera-focus",
      numericBaseline: NUMERIC_SPIRAL.baseline,
      voidState: NUMERIC_SPIRAL.void
    });

    mount.append(stage());

    if (opts.runtime && typeof opts.runtime.writeReceipt === "function") {
      opts.runtime.writeReceipt("gen_2_v1_full_grid_earth_birds_eye_ready", {
        generation: GENERATION,
        cycle: CYCLE,
        authority: AUTHORITY,
        version: VERSION,
        scope: "our-universe",
        earthZoom: "active",
        physicalHierarchy: "sun-dominant-earth-camera-focus",
        birdEyeCamera: "active",
        sunLight: "dominant-off-frame",
        moonLight: "secondary-satellite",
        numericBaseline: 7,
        voidState: 0,
        latticeTarget: "11111111",
        bodies: ALL_BODIES,
        gen4Closeout: "complete",
        finalCloseout: true
      });
    }

    return Object.freeze({
      version: VERSION,
      generation: GENERATION,
      cycle: CYCLE,
      authority: AUTHORITY,
      universeBodies: clone(ALL_BODIES),
      numericSpiral: clone(NUMERIC_SPIRAL),
      gridBits: clone(GRID_BITS),
      start: function start() {},
      stop: function stop() {},
      next: function next() {},
      nextBody: function nextBody() {},
      destroy: function destroy() {
        mount.innerHTML = "";
      },
      getStatus: function getStatus() {
        return {
          version: VERSION,
          generation: GENERATION,
          cycle: CYCLE,
          authority: AUTHORITY,
          active: true,
          scope: "our-universe",
          visualExpression: "solar-system-field",
          orbitField: "visible",
          earthZoom: "active",
          physicalHierarchy: "sun-dominant-earth-camera-focus",
          birdEyeCamera: "active",
          sunLight: "dominant-off-frame",
          moonLight: "secondary-satellite",
          visibleGlobe: true,
          visibleCodeGlobe: true,
          phaseBind: "complete",
          currentPhase: "HOME",
          currentBody: "EARTH",
          bodies: clone(ALL_BODIES),
          numericBaseline: 7,
          voidState: 0,
          latticeTarget: "11111111",
          generation4Closeout: "complete",
          gen4Closeout: "complete",
          finalCloseout: true
        };
      }
    });
  }

  global.ShowroomGlobeInstrument = Object.freeze({
    VERSION: VERSION,
    GENERATION: GENERATION,
    CYCLE: CYCLE,
    AUTHORITY: AUTHORITY,
    PHASES: PHASES,
    UNIVERSE_BODIES: ALL_BODIES,
    NUMERIC_SPIRAL: NUMERIC_SPIRAL,
    GRID_BITS: GRID_BITS,
    createGlobe: createGlobe
  });
})(window, document);
