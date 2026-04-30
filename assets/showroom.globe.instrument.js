(function attachShowroomGlobeInstrument(global, document) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_INSTRUMENT_GEN_2_V1_AZ256_MOON_SCALE_4K_TNT_v2";
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
    B4: "EARTH_ROUND_AND_DEFINED",
    B5: "SUN_MASSIVE_OFF_FRAME_LIGHT_SOURCE",
    B6: "MOON_SCALED_AND_SATELLITE_BOUND",
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
    if (document.getElementById("showroom-gen2-v1-az256-moon-scale-4k-style-v2")) return;

    const style = el("style");
    style.id = "showroom-gen2-v1-az256-moon-scale-4k-style-v2";
    style.textContent = `
      .showroom-visual-dashboard-instrument {
        display: block;
        width: 100%;
      }

      .showroom-mini-gauge-row {
        display: none !important;
      }

      .dg-az256-stage {
        --earth-size: min(78vw, 540px);
        --moon-size: min(21vw, 146px);
        position: relative;
        min-height: 76vh;
        overflow: hidden;
        border: 1px solid rgba(168, 199, 255, 0.18);
        border-radius: 28px;
        background:
          radial-gradient(circle at 88% 7%, rgba(255, 218, 143, 0.34), transparent 18rem),
          radial-gradient(circle at 72% 34%, rgba(125, 181, 255, 0.10), transparent 30rem),
          radial-gradient(circle at 38% 58%, rgba(57, 123, 205, 0.13), transparent 31rem),
          linear-gradient(180deg, #02040a 0%, #041125 52%, #03050a 100%);
        box-shadow:
          inset 0 0 92px rgba(0, 0, 0, 0.64),
          0 24px 80px rgba(0, 0, 0, 0.48);
        isolation: isolate;
      }

      .dg-az256-stage::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        background-image:
          radial-gradient(circle, rgba(255,255,255,.68) 0 .8px, transparent 1.1px),
          radial-gradient(circle, rgba(180,210,255,.30) 0 .8px, transparent 1.1px),
          radial-gradient(circle, rgba(255,211,111,.18) 0 .7px, transparent .95px);
        background-size: 72px 72px, 126px 126px, 164px 164px;
        background-position: 0 0, 31px 47px, 57px 91px;
        opacity: .36;
        pointer-events: none;
      }

      .dg-az256-void {
        position: absolute;
        inset: 0;
        z-index: 2;
        background:
          radial-gradient(circle at 50% 50%, transparent 0 58%, rgba(0,0,0,.32) 100%),
          linear-gradient(90deg, rgba(0,0,0,.28), transparent 18%, transparent 82%, rgba(0,0,0,.20));
        pointer-events: none;
      }

      .dg-az256-sun {
        position: absolute;
        right: -36%;
        top: -32%;
        z-index: 3;
        width: clamp(560px, 90vw, 1180px);
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        background:
          radial-gradient(circle at 31% 30%, #fff9d7 0 8%, #ffe28e 16%, #ffb34d 34%, #e8752f 56%, rgba(228,111,46,.22) 77%, transparent 100%);
        opacity: .92;
        box-shadow:
          0 0 90px rgba(255, 211, 111, .38),
          0 0 220px rgba(255, 145, 61, .32),
          0 0 360px rgba(255, 211, 111, .17);
      }

      .dg-az256-sun-beam {
        position: absolute;
        right: -6%;
        top: 4%;
        z-index: 4;
        width: 92%;
        height: 80%;
        transform: rotate(-17deg);
        transform-origin: right center;
        background:
          linear-gradient(90deg, rgba(255,238,188,.48), rgba(255,211,111,.19), rgba(255,211,111,.055), transparent 84%);
        clip-path: polygon(0 39%, 100% 0, 100% 100%, 0 61%);
        mix-blend-mode: screen;
        opacity: .76;
        pointer-events: none;
      }

      .dg-az256-camera {
        position: absolute;
        left: 45%;
        top: 56%;
        z-index: 8;
        width: var(--earth-size);
        height: var(--earth-size);
        transform: translate(-50%, -50%);
      }

      .dg-earth {
        position: absolute;
        left: 50%;
        top: 50%;
        width: var(--earth-size);
        height: var(--earth-size);
        transform: translate(-50%, -50%);
        border-radius: 50%;
        overflow: hidden;
        background:
          radial-gradient(circle at 29% 23%, rgba(255,255,255,.74) 0 7%, transparent 15%),
          radial-gradient(circle at 49% 48%, #209feb 0 43%, #0b3f7d 70%, #030b1a 100%);
        box-shadow:
          0 0 0 1px rgba(185,226,255,.52),
          0 0 50px rgba(125,181,255,.30),
          0 0 96px rgba(44,143,218,.19),
          inset -84px -54px 96px rgba(0,0,0,.70),
          inset 44px 31px 66px rgba(255,255,255,.18);
        isolation: isolate;
      }

      .dg-earth-layer,
      .showroom-earth-detail-stack,
      .showroom-earth-ocean,
      .showroom-earth-terminator,
      .showroom-earth-glint,
      .showroom-earth-gridline,
      .showroom-earth-focus-ring {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
      }

      .showroom-earth-detail-stack {
        inset: 0;
        overflow: hidden;
        transform: translateZ(0);
      }

      .showroom-earth-ocean {
        inset: 0;
        background:
          radial-gradient(circle at 29% 23%, rgba(255,255,255,.60) 0 8%, transparent 16%),
          radial-gradient(circle at 49% 48%, #209feb 0 43%, #0b3f7d 70%, #030b1a 100%);
      }

      .dg-ocean-noise {
        inset: 0;
        background:
          repeating-radial-gradient(circle at 42% 54%, rgba(255,255,255,.055) 0 1px, transparent 1px 8px),
          linear-gradient(134deg, transparent 0 18%, rgba(255,255,255,.06) 19% 20%, transparent 21% 46%, rgba(255,255,255,.045) 47% 48%, transparent 49%);
        opacity: .62;
        mix-blend-mode: screen;
      }

      .showroom-earth-continent {
        position: absolute;
        display: block;
        background:
          linear-gradient(135deg, rgba(181, 255, 215, .98) 0%, rgba(62, 173, 112, .96) 48%, rgba(218, 184, 108, .92) 100%);
        opacity: .98;
        filter:
          drop-shadow(0 1px 2px rgba(0,0,0,.32))
          saturate(1.15)
          contrast(1.08);
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

      .showroom-earth-continent-e {
        width: 14%;
        height: 11%;
        left: 38%;
        top: 58%;
        border-radius: 58% 42% 49% 51%;
      }

      .dg-land-fragment {
        position: absolute;
        display: block;
        background:
          linear-gradient(140deg, rgba(139,240,188,.94), rgba(56,148,93,.86) 52%, rgba(209,174,99,.80));
        border-radius: 999px;
        filter: drop-shadow(0 1px 1px rgba(0,0,0,.22));
        opacity: .72;
      }

      .dg-frag-1 { width: 9%; height: 4%; left: 22%; top: 48%; transform: rotate(18deg); }
      .dg-frag-2 { width: 7%; height: 3%; left: 35%; top: 37%; transform: rotate(-20deg); }
      .dg-frag-3 { width: 8%; height: 4%; left: 59%; top: 55%; transform: rotate(32deg); }
      .dg-frag-4 { width: 6%; height: 3%; left: 70%; top: 43%; transform: rotate(-11deg); }
      .dg-frag-5 { width: 10%; height: 4%; left: 24%; top: 64%; transform: rotate(-8deg); }

      .showroom-earth-cloud-band {
        position: absolute;
        inset: 8%;
        border-radius: 50%;
        background:
          linear-gradient(18deg, transparent 0 20%, rgba(255,255,255,.42) 21% 26%, transparent 27% 55%, rgba(255,255,255,.25) 56% 60%, transparent 61%),
          linear-gradient(-25deg, transparent 0 34%, rgba(255,255,255,.31) 35% 40%, transparent 41% 78%, rgba(255,255,255,.21) 79% 82%, transparent 83%),
          radial-gradient(circle at 30% 72%, rgba(255,255,255,.18), transparent 22%);
        opacity: .84;
        mix-blend-mode: screen;
        animation: showroomEarthCloudSweep 24s linear infinite;
      }

      .dg-cloud-detail {
        inset: 5%;
        border-radius: 50%;
        background:
          radial-gradient(ellipse at 31% 31%, rgba(255,255,255,.24), transparent 16%),
          radial-gradient(ellipse at 55% 26%, rgba(255,255,255,.18), transparent 13%),
          radial-gradient(ellipse at 47% 72%, rgba(255,255,255,.16), transparent 16%),
          radial-gradient(ellipse at 73% 50%, rgba(255,255,255,.15), transparent 13%);
        opacity: .78;
        mix-blend-mode: screen;
      }

      .showroom-earth-terminator {
        inset: 0;
        background:
          linear-gradient(104deg, transparent 0 41%, rgba(0,0,0,.14) 52%, rgba(0,0,0,.80) 100%);
        mix-blend-mode: multiply;
      }

      .showroom-earth-glint {
        inset: 0;
        background:
          radial-gradient(circle at 28% 22%, rgba(255,255,255,.54), transparent 21%),
          linear-gradient(118deg, rgba(255,236,180,.15) 0 34%, transparent 50%);
        mix-blend-mode: screen;
      }

      .showroom-earth-gridline {
        inset: 8%;
        border: 1px solid rgba(238,245,255,.14);
        opacity: .34;
      }

      .showroom-earth-gridline::before,
      .showroom-earth-gridline::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 0;
        width: 1px;
        height: 100%;
        background: linear-gradient(180deg, transparent, rgba(238,245,255,.14), transparent);
        transform: translateX(-50%);
      }

      .showroom-earth-gridline::after {
        left: 0;
        top: 50%;
        width: 100%;
        height: 1px;
        transform: translateY(-50%);
      }

      .dg-atmosphere {
        inset: -1%;
        border-radius: 50%;
        box-shadow:
          inset 0 0 0 2px rgba(172, 224, 255, .16),
          0 0 26px rgba(125,181,255,.20),
          0 0 56px rgba(143,240,198,.10);
      }

      .showroom-earth-focus-ring {
        inset: -4%;
        border: 1px solid rgba(143,240,198,.36);
        box-shadow:
          0 0 34px rgba(143,240,198,.18),
          inset 0 0 22px rgba(143,240,198,.07);
      }

      .dg-moon-orbit,
      .showroom-earth-moon-orbit {
        position: absolute;
        left: 45%;
        top: 56%;
        z-index: 7;
        width: min(96vw, 680px);
        height: min(96vw, 680px);
        transform: translate(-50%, -50%);
        border: 1px solid rgba(220,231,244,.24);
        border-radius: 50%;
        opacity: .74;
        pointer-events: none;
      }

      .dg-moon,
      .showroom-moon-source,
      .showroom-earth-moon-dot {
        position: absolute;
        right: 7%;
        top: 48%;
        z-index: 12;
        width: var(--moon-size);
        height: var(--moon-size);
        transform: translateY(-50%);
        border-radius: 50%;
        background:
          radial-gradient(circle at 32% 28%, #ffffff 0 12%, #e8eef7 26%, #c5cfdd 54%, #778393 100%);
        box-shadow:
          0 0 18px rgba(220,231,244,.52),
          0 0 48px rgba(180,205,255,.20),
          inset -18px -13px 28px rgba(0,0,0,.30),
          inset 9px 7px 18px rgba(255,255,255,.30);
      }

      .dg-moon::before {
        content: "";
        position: absolute;
        inset: 17%;
        border-radius: 50%;
        background:
          radial-gradient(circle at 28% 38%, rgba(95,105,120,.30) 0 9%, transparent 13%),
          radial-gradient(circle at 62% 54%, rgba(95,105,120,.24) 0 7%, transparent 11%),
          radial-gradient(circle at 48% 28%, rgba(95,105,120,.19) 0 5%, transparent 9%);
        opacity: .74;
      }

      .dg-moon-light,
      .showroom-moon-light {
        position: absolute;
        right: 4%;
        top: 48%;
        z-index: 10;
        width: min(56vw, 360px);
        height: min(32vw, 190px);
        transform: translateY(-50%) rotate(166deg);
        transform-origin: right center;
        background: linear-gradient(90deg, rgba(210,226,255,.24), rgba(210,226,255,.08), transparent 76%);
        clip-path: polygon(0 44%, 100% 0, 100% 100%, 0 56%);
        mix-blend-mode: screen;
        opacity: .52;
        pointer-events: none;
      }

      .showroom-grid-contract-card,
      .showroom-solar-limb-label {
        position: absolute;
        z-index: 15;
        display: grid;
        gap: 4px;
        max-width: 170px;
        padding: 10px 12px;
        border-radius: 16px;
        background: rgba(3,6,12,.76);
        backdrop-filter: blur(8px);
      }

      .showroom-grid-contract-card {
        left: 16px;
        top: 16px;
        border: 1px solid rgba(143,240,198,.30);
      }

      .showroom-solar-limb-label {
        right: 16px;
        top: 16px;
        border: 1px solid rgba(255,211,111,.34);
      }

      .showroom-grid-contract-card span,
      .showroom-solar-limb-label span {
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

      .showroom-solar-limb-label strong {
        color: #ffd36f;
        font-size: .95rem;
        line-height: 1;
      }

      .showroom-earth-anchor-label {
        position: absolute;
        left: 50%;
        bottom: 8%;
        z-index: 14;
        transform: translateX(-50%);
        padding: 6px 12px;
        border: 1px solid rgba(143,240,198,.38);
        border-radius: 999px;
        background: rgba(3,6,12,.76);
        color: #8ff0c6;
        font-size: .72rem;
        font-weight: 900;
        white-space: nowrap;
      }

      .showroom-traversal-strip {
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

      .showroom-traversal-node {
        display: grid;
        place-items: center;
        height: 30px;
        border: 1px solid rgba(168,199,255,.16);
        border-radius: 999px;
        color: #aab8cf;
        font: 900 .62rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      }

      .showroom-traversal-node[data-active="true"] {
        border-color: rgba(255,211,111,.72);
        color: #ffd36f;
        background: rgba(255,211,111,.09);
      }

      @keyframes showroomEarthCloudSweep {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @media (max-width: 720px) {
        .dg-az256-stage {
          --earth-size: min(86vw, 390px);
          --moon-size: min(24vw, 106px);
          min-height: 64vh;
        }

        .dg-az256-sun {
          right: -58%;
          top: -25%;
          width: 620px;
        }

        .dg-az256-camera {
          left: 45%;
          top: 56%;
        }

        .dg-moon,
        .showroom-moon-source,
        .showroom-earth-moon-dot {
          right: 6%;
          top: 48%;
        }

        .showroom-grid-contract-card,
        .showroom-solar-limb-label {
          max-width: 126px;
          padding: 8px 10px;
        }

        .showroom-traversal-strip {
          gap: 4px;
          padding: 6px;
          bottom: 10px;
        }

        .showroom-traversal-node {
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
      "Moon scale 27 percent Earth diameter",
      "SUN MOON PLANETS",
      "VISUAL_EXPRESSION solar-system-field",
      "showroom-solar-system-field showroom-orbit ORBIT_FIELD",
      "Sun Mercury Venus Earth Moon Mars Jupiter Saturn Uranus Neptune",
      "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
      "B1 B2 B3 B4 B5 B6 B7 B8",
      "1 2 3 4 5 6 7 8 9 10 11 12 13"
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
      el("span", "dg-earth-layer dg-ocean-noise"),
      el("span", "showroom-earth-continent showroom-earth-continent-a"),
      el("span", "showroom-earth-continent showroom-earth-continent-b"),
      el("span", "showroom-earth-continent showroom-earth-continent-c"),
      el("span", "showroom-earth-continent showroom-earth-continent-d"),
      el("span", "showroom-earth-continent showroom-earth-continent-e"),
      el("span", "dg-land-fragment dg-frag-1"),
      el("span", "dg-land-fragment dg-frag-2"),
      el("span", "dg-land-fragment dg-frag-3"),
      el("span", "dg-land-fragment dg-frag-4"),
      el("span", "dg-land-fragment dg-frag-5"),
      el("span", "showroom-earth-cloud-band"),
      el("span", "dg-earth-layer dg-cloud-detail"),
      el("span", "showroom-earth-gridline"),
      el("span", "showroom-earth-terminator"),
      el("span", "showroom-earth-glint"),
      el("span", "dg-earth-layer dg-atmosphere"),
      el("span", "showroom-earth-focus-ring")
    );
    return stack;
  }

  function card(className, top, main, bottom) {
    const node = el("aside", className);
    node.append(el("span", "", top), el("strong", "", main));
    if (bottom) node.append(el("span", "", bottom));
    return node;
  }

  function buildStage() {
    const root = el("section", "showroom-globe-instrument showroom-visual-dashboard-instrument dg-az256-stage");

    setData(root, {
      generation: GENERATION,
      showroomCycle: CYCLE,
      authority: AUTHORITY,
      instrumentVersion: VERSION,
      instrumentType: "az-256-moon-scale-4k-earth-model",
      visibleGlobe: "true",
      visibleCodeGlobe: "true",
      phaseBind: "complete",
      demoUniverseScope: "our-universe",
      visualExpression: "solar-system-field",
      orbitField: "visible",
      sun: "included",
      moon: "included",
      moonScale: "0.27-earth-diameter",
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

    const camera = el("div", "dg-az256-camera");
    const earth = el("div", "dg-earth showroom-birds-eye-earth");
    earth.dataset.body = "EARTH";
    earth.dataset.earthZoom = "active";
    earth.append(earthDetailStack());
    camera.append(earth);

    root.append(
      el("div", "dg-az256-void"),
      el("div", "dg-az256-sun"),
      el("div", "dg-az256-sun-beam"),
      camera,
      el("div", "dg-moon-orbit showroom-earth-moon-orbit"),
      el("div", "dg-moon-light showroom-moon-light"),
      el("div", "dg-moon showroom-moon-source showroom-earth-moon-dot"),
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
      instrumentType: "az-256-moon-scale-4k-earth-model",
      visibleGlobe: "true",
      visibleCodeGlobe: "true",
      phaseBind: "complete",
      demoUniverseScope: "our-universe",
      visualExpression: "solar-system-field",
      orbitField: "visible",
      gen4Closeout: "complete",
      finalCloseout: "true",
      earthZoom: "active",
      moonScale: "0.27-earth-diameter",
      physicalHierarchy: "sun-dominant-earth-camera-focus",
      numericBaseline: NUMERIC_SPIRAL.baseline,
      voidState: NUMERIC_SPIRAL.void
    });

    mount.append(buildStage());

    if (opts.runtime && typeof opts.runtime.writeReceipt === "function") {
      opts.runtime.writeReceipt("gen_2_v1_az_256_moon_scale_4k_ready", {
        generation: GENERATION,
        cycle: CYCLE,
        authority: AUTHORITY,
        version: VERSION,
        scope: "our-universe",
        earthZoom: "active",
        moonScale: "0.27-earth-diameter",
        physicalHierarchy: "sun-dominant-earth-camera-focus",
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
          moonScale: "0.27-earth-diameter",
          physicalHierarchy: "sun-dominant-earth-camera-focus",
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
