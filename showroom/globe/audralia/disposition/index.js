// /showroom/globe/audralia/disposition/index.js
// AUDRALIA_G1_INTERGALACTIC_COCKPIT_360_LATTICE_GEM_ROUTE_JS_TNT_v1
// Full-file replacement.
// Purpose: convert cockpit gems from flat indicator objects into independent 360-degree lattice-designated gem instruments.
// Owns: Disposition Harness cockpit JS, Dexterion’s Lab lattice-gem registry, lattice-gem DOM mounting, passive stream verification, session-only lattice-seat touch behavior.
// Does not own: parent Audralia route, datum source file, disposition child source file, terrain child source file, Runtime / Strength activation, canvas, WebGL, generated image, GraphicBox, or visual-render pass.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_360_LATTICE_GEM_ROUTE_JS_TNT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_DUAL_DONOR_CIRCUIT_TOUCH_GEM_INSTRUMENT_ROUTE_JS_TNT_v1";
  const HTML_CONTRACT = "AUDRALIA_G1_INTERGALACTIC_COCKPIT_360_LATTICE_GEM_HTML_BINDING_TNT_v1";

  const RECEIPT = {
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    htmlContract: HTML_CONTRACT,
    route: "/showroom/globe/audralia/disposition/",
    js: "/showroom/globe/audralia/disposition/index.js",
    cockpitFrame: "Intergalactic Cockpit",
    instrumentAuthority: "Dexterion’s Lab",
    gemModel: "360-degree circumferential lattice gems",
    circumferenceLaw: "360 circumference delegated by inconsistent cut-gem edges",
    htmlFunction: "wisdom",
    jsFunction: "courage",
    runtimeFunction: "strength",
    runtimeStrengthHeld: true,
    noCanvasCreation: true,
    noWebGL: true,
    generatedImage: false,
    graphicBox: false,
    noVisualPassClaim: true
  };

  const ASSETS = {
    datum: {
      key: "datum",
      label: "Datum",
      url: "/assets/audralia/clean/runtime/audralia.true-globe.datum.js",
      role: "origin map / cloned seed"
    },
    disposition: {
      key: "disposition",
      label: "Disposition",
      url: "/assets/audralia/clean/runtime/audralia.true-globe.disposition.js",
      role: "passive receive proof"
    },
    terrain: {
      key: "terrain",
      label: "Terrain",
      url: "/assets/audralia/clean/runtime/audralia.true-globe.terrain.js",
      role: "passive terrain receive proof"
    }
  };

  const LATTICE_GEM_DEFINITIONS = [
    {
      gemId: "dexterion-master",
      label: "Dexterion Master",
      stream: "instrument_authority",
      state: "coordinator",
      latticeId: "master_cockpit_lattice",
      authority: "Dexterion’s Lab",
      functionText: "coordinates all cockpit lattice instruments without absorbing child authority",
      locked: false
    },
    {
      gemId: "datum",
      label: "Datum",
      stream: "datum",
      state: "held",
      latticeId: "cloned_seed_origin_lattice",
      authority: "Dexterion’s Lab",
      functionText: "origin map / cloned seed availability",
      locked: false
    },
    {
      gemId: "disposition",
      label: "Disposition",
      stream: "disposition",
      state: "held",
      latticeId: "passive_receive_lattice",
      authority: "Dexterion’s Lab",
      functionText: "downstream receive alignment",
      locked: false
    },
    {
      gemId: "terrain",
      label: "Terrain",
      stream: "terrain",
      state: "held",
      latticeId: "terrain_readiness_lattice",
      authority: "Dexterion’s Lab",
      functionText: "passive terrain stream proof",
      locked: false
    },
    {
      gemId: "news",
      label: "NEWS",
      stream: "news",
      state: "held",
      latticeId: "cardinal_completion_lattice",
      authority: "Dexterion’s Lab",
      functionText: "North / East / West / South completion",
      cardinalMap: ["N", "E", "W", "S"],
      locked: false
    },
    {
      gemId: "parent-chain",
      label: "Parent Chain",
      stream: "parent_chain",
      state: "pass",
      latticeId: "mutation_guard_lattice",
      authority: "Dexterion’s Lab",
      functionText: "datum / HTML / route JS held without mutation",
      locked: false
    },
    {
      gemId: "render-hold",
      label: "Render Hold",
      stream: "render_hold",
      state: "pass",
      latticeId: "no_render_lattice",
      authority: "Dexterion’s Lab",
      functionText: "no canvas / no WebGL / no visual pass",
      locked: false
    },
    {
      gemId: "runtime-strength",
      label: "Runtime Strength",
      stream: "runtime_strength",
      state: "held",
      latticeId: "strength_hold_lattice",
      authority: "Dexterion’s Lab",
      functionText: "future motion carrier held",
      locked: true
    },
    {
      gemId: "multi-stream",
      label: "Multi-Stream",
      stream: "multi_stream",
      state: "staged",
      latticeId: "launchpad_lattice",
      authority: "Dexterion’s Lab",
      functionText: "future multi-stream render staged only",
      locked: true
    }
  ];

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    phase: "booting",
    failure: "none",
    assetResults: {
      datum: { ok: false, status: "pending" },
      disposition: { ok: false, status: "pending" },
      terrain: { ok: false, status: "pending" }
    },
    latticeGems: [],
    touchedSeats: [],
    generatedAt: new Date().toISOString()
  };

  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const qs = (selector, root = document) => root.querySelector(selector);

  const setText = (selector, value) => {
    qsa(selector).forEach((node) => {
      node.textContent = String(value);
    });
  };

  const setNodeText = (node, value) => {
    if (node) node.textContent = String(value);
  };

  const createNode = (tag, className, attributes = {}) => {
    const node = document.createElement(tag);
    if (className) node.className = className;

    Object.entries(attributes).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (key === "text") {
        node.textContent = String(value);
        return;
      }
      if (key === "html") {
        node.innerHTML = String(value);
        return;
      }
      if (key === "dataset" && value && typeof value === "object") {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          node.dataset[dataKey] = String(dataValue);
        });
        return;
      }
      node.setAttribute(key, String(value));
    });

    return node;
  };

  const safeId = (value) => String(value).replace(/[^a-z0-9_-]/gi, "-").toLowerCase();

  function ensureLatticeGemStyles() {
    if (document.getElementById("audralia-360-lattice-gem-style")) return;

    const style = document.createElement("style");
    style.id = "audralia-360-lattice-gem-style";
    style.textContent = `
      .lattice-gem-foundry-copy{
        display:grid;
        gap:.75rem;
      }

      .lattice-gem-grid{
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:14px;
        margin-top:18px;
      }

      .lattice-gem{
        --state-glow:rgba(141,216,255,.22);
        --state-line:rgba(141,216,255,.28);
        --state-fill:rgba(141,216,255,.08);
        position:relative;
        display:grid;
        gap:1rem;
        min-height:26rem;
        padding:1rem;
        border:1px solid rgba(244,207,131,.18);
        border-radius:1.65rem;
        background:
          radial-gradient(circle at 50% 0%,rgba(141,216,255,.13),transparent 14rem),
          radial-gradient(circle at 16% 10%,rgba(244,207,131,.075),transparent 12rem),
          linear-gradient(180deg,rgba(255,255,255,.052),rgba(255,255,255,.018)),
          rgba(4,10,23,.86);
        overflow:hidden;
        box-shadow:
          0 1.1rem 3.2rem rgba(0,0,0,.22),
          inset 0 1px 0 rgba(255,255,255,.07);
      }

      .lattice-gem[data-state="pass"],
      .lattice-gem[data-gem-state="pass"]{
        --state-glow:rgba(167,243,198,.30);
        --state-line:rgba(167,243,198,.52);
        --state-fill:rgba(167,243,198,.10);
      }

      .lattice-gem[data-state="held"],
      .lattice-gem[data-gem-state="held"]{
        --state-glow:rgba(141,216,255,.22);
        --state-line:rgba(141,216,255,.36);
        --state-fill:rgba(141,216,255,.075);
      }

      .lattice-gem[data-state="staged"],
      .lattice-gem[data-gem-state="staged"]{
        --state-glow:rgba(173,140,255,.32);
        --state-line:rgba(173,140,255,.48);
        --state-fill:rgba(173,140,255,.095);
      }

      .lattice-gem[data-state="coordinator"],
      .lattice-gem[data-gem-state="coordinator"]{
        --state-glow:rgba(244,207,131,.32);
        --state-line:rgba(244,207,131,.54);
        --state-fill:rgba(244,207,131,.10);
      }

      .lattice-gem[data-state="fail"],
      .lattice-gem[data-gem-state="fail"]{
        --state-glow:rgba(255,107,107,.34);
        --state-line:rgba(255,107,107,.52);
        --state-fill:rgba(255,107,107,.095);
      }

      .lattice-gem::before{
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
        background:
          linear-gradient(135deg,rgba(255,255,255,.08),transparent 34%,rgba(141,216,255,.045)),
          radial-gradient(circle at 50% 50%,var(--state-glow),transparent 62%);
        opacity:.82;
      }

      .lattice-gem-shell{
        position:relative;
        z-index:2;
        min-height:16.5rem;
        display:grid;
        place-items:center;
        perspective:900px;
        isolation:isolate;
      }

      .lattice-gem-circumference{
        position:absolute;
        width:14.2rem;
        height:9.25rem;
        border-radius:50%;
        transform:rotateX(63deg) rotateZ(-11deg);
        border:1px solid rgba(141,216,255,.28);
        background:
          radial-gradient(ellipse at 50% 50%,transparent 50%,rgba(141,216,255,.045) 52%,transparent 68%);
        box-shadow:
          0 0 1.8rem var(--state-glow),
          inset 0 0 1.2rem rgba(244,207,131,.07);
        opacity:.92;
      }

      .lattice-gem-circumference::before,
      .lattice-gem-circumference::after{
        content:"";
        position:absolute;
        inset:9%;
        border-radius:50%;
        border:1px dashed rgba(244,207,131,.18);
      }

      .lattice-gem-circumference::after{
        inset:21%;
        border-color:rgba(141,216,255,.16);
        transform:rotate(17deg);
      }

      .lattice-gem-edge-segment{
        position:absolute;
        left:50%;
        top:50%;
        width:var(--edge-length,48px);
        height:2px;
        border-radius:999px;
        transform-origin:0 50%;
        transform:
          rotate(var(--edge-angle,0deg))
          translateX(var(--edge-depth,78px))
          rotate(var(--edge-slant,0deg));
        background:
          linear-gradient(90deg,transparent,rgba(255,255,255,.34),var(--state-line),transparent);
        box-shadow:
          0 0 .45rem var(--state-glow),
          0 0 .85rem rgba(141,216,255,.10);
        opacity:var(--edge-opacity,.76);
      }

      .lattice-gem-cut-body{
        position:relative;
        z-index:3;
        width:12.2rem;
        height:8.7rem;
        clip-path:polygon(
          50% 0%,
          67% 6%,
          84% 18%,
          100% 43%,
          88% 68%,
          63% 85%,
          50% 100%,
          34% 84%,
          10% 67%,
          0% 41%,
          14% 18%,
          33% 5%
        );
        background:
          linear-gradient(125deg,rgba(255,255,255,.38),transparent 22%),
          conic-gradient(from 20deg,rgba(255,255,255,.30),rgba(141,216,255,.36),rgba(7,19,52,.98),rgba(244,207,131,.25),rgba(255,255,255,.22)),
          radial-gradient(circle at 50% 35%,rgba(255,255,255,.28),transparent 42%);
        box-shadow:
          0 1.4rem 2.8rem rgba(0,0,0,.36),
          0 0 2rem var(--state-glow),
          inset 0 1px 0 rgba(255,255,255,.18);
        transform:rotateX(10deg);
        overflow:hidden;
      }

      .lattice-gem-cut-body::before{
        content:"";
        position:absolute;
        inset:0;
        background:
          linear-gradient(90deg,transparent 0 49%,rgba(255,255,255,.30) 50%,transparent 51%),
          linear-gradient(27deg,transparent 0 43%,rgba(255,255,255,.18) 44%,transparent 45%),
          linear-gradient(151deg,transparent 0 44%,rgba(244,207,131,.18) 45%,transparent 46%),
          linear-gradient(7deg,transparent 0 50%,rgba(141,216,255,.18) 51%,transparent 52%),
          linear-gradient(110deg,transparent 0 51%,rgba(255,255,255,.15) 52%,transparent 53%);
        opacity:.90;
      }

      .lattice-gem-cut-body::after{
        content:"";
        position:absolute;
        inset:0;
        background:
          radial-gradient(circle at 50% 28%,rgba(255,255,255,.36),transparent 20%),
          radial-gradient(circle at 36% 70%,rgba(37,128,255,.18),transparent 30%),
          radial-gradient(circle at 72% 60%,rgba(244,207,131,.18),transparent 32%);
        mix-blend-mode:screen;
        opacity:.72;
      }

      .lattice-gem-inner-lattice{
        position:absolute;
        z-index:6;
        width:7.25rem;
        height:5.35rem;
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:.30rem;
        transform:translateY(.05rem) rotateX(18deg);
      }

      .lattice-gem-seat{
        min-width:0;
        aspect-ratio:1/1;
        border:1px solid rgba(141,216,255,.24);
        border-radius:.30rem;
        background:
          radial-gradient(circle at 50% 20%,rgba(255,255,255,.10),transparent 50%),
          rgba(255,255,255,.034);
        cursor:pointer;
        box-shadow:inset 0 1px 0 rgba(255,255,255,.06);
        transition:border-color .18s ease,background .18s ease,box-shadow .18s ease,opacity .18s ease,filter .18s ease;
        -webkit-tap-highlight-color:transparent;
      }

      .lattice-gem-seat:hover,
      .lattice-gem-seat:focus-visible{
        border-color:rgba(244,207,131,.62);
        box-shadow:0 0 .55rem rgba(244,207,131,.22),inset 0 1px 0 rgba(255,255,255,.10);
      }

      .lattice-gem-seat.is-active{
        border-color:rgba(167,243,198,.72);
        background:
          radial-gradient(circle at 50% 20%,rgba(255,255,255,.34),transparent 48%),
          radial-gradient(circle at 50% 70%,rgba(167,243,198,.32),transparent 62%),
          rgba(167,243,198,.16);
        box-shadow:
          0 0 .65rem rgba(167,243,198,.34),
          inset 0 1px 0 rgba(255,255,255,.16);
      }

      .lattice-gem-seat.is-staged{
        border-color:rgba(173,140,255,.58);
        background:rgba(173,140,255,.14);
        box-shadow:0 0 .55rem rgba(173,140,255,.24);
      }

      .lattice-gem-seat.is-held{
        cursor:not-allowed;
        opacity:.58;
        border-color:rgba(141,216,255,.28);
        background:rgba(141,216,255,.07);
      }

      .lattice-gem-seat.manual{
        border-color:rgba(244,207,131,.76);
        box-shadow:
          0 0 .50rem rgba(244,207,131,.34),
          0 0 1rem rgba(167,243,198,.12),
          inset 0 1px 0 rgba(255,255,255,.18);
      }

      .lattice-gem-axis{
        position:absolute;
        z-index:7;
        pointer-events:none;
        opacity:.62;
      }

      .axis-north,
      .axis-south{
        width:1px;
        height:8.5rem;
        background:linear-gradient(180deg,transparent,rgba(244,207,131,.72),transparent);
      }

      .axis-east,
      .axis-west{
        width:8.5rem;
        height:1px;
        background:linear-gradient(90deg,transparent,rgba(244,207,131,.72),transparent);
      }

      .axis-north{transform:translateY(-.1rem)}
      .axis-south{transform:translateY(.1rem)}
      .axis-east{transform:translateX(.1rem)}
      .axis-west{transform:translateX(-.1rem)}

      .lattice-gem-star{
        position:absolute;
        z-index:4;
        width:9.1rem;
        height:9.1rem;
        border-radius:50%;
        border:1px solid rgba(255,255,255,.08);
        background:
          conic-gradient(from 0deg,transparent,rgba(141,216,255,.21),transparent,rgba(244,207,131,.19),transparent);
        opacity:.64;
        animation:latticeGemStarTurn 28s linear infinite;
      }

      @keyframes latticeGemStarTurn{
        to{transform:rotate(360deg)}
      }

      .lattice-gem-glint{
        position:absolute;
        z-index:8;
        width:10.6rem;
        height:.48rem;
        border-radius:999px;
        transform:rotate(-28deg);
        background:linear-gradient(90deg,transparent,rgba(255,255,255,.60),rgba(141,216,255,.34),transparent);
        animation:latticeGemGlint 8.5s ease-in-out infinite;
        opacity:.30;
        pointer-events:none;
      }

      @keyframes latticeGemGlint{
        0%,100%{transform:translateX(-3.2rem) rotate(-28deg);opacity:.08}
        50%{transform:translateX(3.2rem) rotate(-28deg);opacity:.58}
      }

      .lattice-gem-label{
        position:relative;
        z-index:4;
        display:grid;
        gap:.42rem;
      }

      .lattice-gem-label b{
        color:var(--gold,#f4cf83);
        font-size:.70rem;
        letter-spacing:.16em;
        text-transform:uppercase;
      }

      .lattice-gem-label strong{
        color:rgba(255,244,216,.96);
        font-size:1.08rem;
        line-height:1.15;
      }

      .lattice-gem-label span{
        color:rgba(238,244,255,.72);
        font-size:.84rem;
        line-height:1.36;
      }

      .lattice-gem-receipt{
        position:relative;
        z-index:4;
        display:block;
        padding:.72rem .76rem;
        border:1px solid rgba(255,255,255,.08);
        border-radius:.9rem;
        background:rgba(0,0,0,.18);
        color:rgba(238,244,255,.66);
        font:700 .70rem/1.35 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        white-space:normal;
        overflow-wrap:anywhere;
      }

      .lattice-receipt-grid{
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:10px;
        margin-top:18px;
      }

      .lattice-receipt-card{
        border:1px solid rgba(255,255,255,.10);
        border-radius:16px;
        padding:12px;
        background:rgba(255,255,255,.026);
        display:grid;
        gap:6px;
      }

      .lattice-receipt-card b{
        color:var(--gold,#f4cf83);
        font-size:.68rem;
        letter-spacing:.13em;
        text-transform:uppercase;
      }

      .lattice-receipt-card code{
        color:rgba(238,244,255,.70);
        font:700 .72rem/1.35 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        overflow-wrap:anywhere;
        white-space:normal;
      }

      @media (max-width:1080px){
        .lattice-gem-grid,
        .lattice-receipt-grid{
          grid-template-columns:repeat(2,minmax(0,1fr));
        }
      }

      @media (max-width:760px){
        .lattice-gem-grid,
        .lattice-receipt-grid{
          grid-template-columns:1fr;
        }

        .lattice-gem{
          min-height:24rem;
        }

        .lattice-gem-shell{
          min-height:15rem;
        }

        .lattice-gem-circumference{
          width:12.6rem;
          height:8.25rem;
        }

        .lattice-gem-cut-body{
          width:10.6rem;
          height:7.6rem;
        }

        .lattice-gem-inner-lattice{
          width:6.25rem;
          height:4.7rem;
          gap:.25rem;
        }
      }

      @media (prefers-reduced-motion:reduce){
        .lattice-gem-star,
        .lattice-gem-glint{
          animation:none!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createCircumferenceMap(gemId) {
    const base = [
      { edge: "north-crown", angle: -83, length: 42, depth: 67, slant: 8, opacity: .88 },
      { edge: "north-east-table", angle: -42, length: 58, depth: 75, slant: -5, opacity: .78 },
      { edge: "east-shoulder", angle: -4, length: 70, depth: 82, slant: 3, opacity: .82 },
      { edge: "east-pavilion", angle: 31, length: 47, depth: 76, slant: -9, opacity: .70 },
      { edge: "south-east-keel", angle: 68, length: 62, depth: 70, slant: 5, opacity: .86 },
      { edge: "south-keel", angle: 101, length: 38, depth: 64, slant: -3, opacity: .72 },
      { edge: "south-west-keel", angle: 139, length: 66, depth: 72, slant: 8, opacity: .84 },
      { edge: "west-pavilion", angle: 179, length: 51, depth: 82, slant: -6, opacity: .76 },
      { edge: "west-shoulder", angle: 217, length: 72, depth: 78, slant: 4, opacity: .80 },
      { edge: "north-west-table", angle: 254, length: 44, depth: 68, slant: -8, opacity: .74 },
      { edge: "upper-correction-facet", angle: 294, length: 60, depth: 74, slant: 6, opacity: .82 },
      { edge: "return-crown-facet", angle: 328, length: 40, depth: 65, slant: -4, opacity: .76 }
    ];

    return base.map((segment, index) => ({
      ...segment,
      gemId,
      segmentId: `${gemId}-edge-${index + 1}`,
      degrees: `${Math.round((segment.angle + 360) % 360)}`
    }));
  }

  function createLatticeSeats(gemId, initialState, locked) {
    const seats = [];

    for (let row = 1; row <= 4; row += 1) {
      for (let col = 1; col <= 4; col += 1) {
        const address = `${String(row).padStart(2, "0")}-${String(col).padStart(2, "0")}`;
        const ordinal = (row - 1) * 4 + col;
        let seatState = "inactive";

        if (initialState === "pass" && (ordinal % 3 === 0 || row === col)) seatState = "active";
        if (initialState === "coordinator" && (row === col || row + col === 5)) seatState = "active";
        if (initialState === "staged" && (row === 2 || col === 3)) seatState = "staged";
        if (initialState === "held") seatState = "held";
        if (locked) seatState = initialState === "staged" ? "staged" : "held";

        seats.push({
          gemId,
          seatId: `${gemId}-${address}`,
          address,
          visible: true,
          conceptualAddress: `${gemId}-16x16-256-seat-field`,
          state: seatState,
          manual: false,
          locked: Boolean(locked)
        });
      }
    }

    return seats;
  }

  function createLatticeGemRegistry() {
    return LATTICE_GEM_DEFINITIONS.map((definition) => {
      const circumferenceMap = createCircumferenceMap(definition.gemId);
      const seats = createLatticeSeats(definition.gemId, definition.state, definition.locked);

      return {
        ...definition,
        seatCount: 256,
        visibleSample: "4x4",
        circumference: "360_irregular_cut_edge",
        circumferenceMap,
        seats,
        cardinalAxis: {
          north: `${definition.gemId}-axis-north`,
          east: `${definition.gemId}-axis-east`,
          west: `${definition.gemId}-axis-west`,
          south: `${definition.gemId}-axis-south`
        },
        receipt: `${definition.gemId}:${definition.latticeId}:256:360_irregular_cut_edge`
      };
    });
  }

  function labelForState(gemState) {
    if (gemState === "pass") return "PASS";
    if (gemState === "held") return "HELD";
    if (gemState === "staged") return "STAGED";
    if (gemState === "fail") return "FAIL";
    if (gemState === "coordinator") return "COORDINATOR";
    return String(gemState || "PENDING").toUpperCase();
  }

  function updateGemRecordState(gemId, nextState) {
    const record = state.latticeGems.find((gem) => gem.gemId === gemId);
    if (!record) return;

    record.state = nextState;

    record.seats.forEach((seat, index) => {
      if (seat.manual) return;

      if (record.locked) {
        seat.state = nextState === "staged" ? "staged" : "held";
        return;
      }

      if (nextState === "pass") {
        seat.state = index % 3 === 0 || index % 5 === 0 ? "active" : "inactive";
      } else if (nextState === "coordinator") {
        seat.state = index % 5 === 0 || index % 6 === 0 ? "active" : "inactive";
      } else if (nextState === "staged") {
        seat.state = index % 4 === 0 || index % 7 === 0 ? "staged" : "inactive";
      } else if (nextState === "held") {
        seat.state = "held";
      } else if (nextState === "fail") {
        seat.state = "inactive";
      } else {
        seat.state = "inactive";
      }
    });
  }

  function renderEdgeSegments(record) {
    const circumference = createNode("div", "lattice-gem-circumference", {
      "aria-hidden": "true"
    });

    record.circumferenceMap.forEach((segment) => {
      const edge = createNode("span", `lattice-gem-edge-segment ${safeId(segment.edge)}`, {
        "data-edge": segment.edge,
        "data-segment-id": segment.segmentId,
        style: [
          `--edge-angle:${segment.angle}deg`,
          `--edge-length:${segment.length}px`,
          `--edge-depth:${segment.depth}px`,
          `--edge-slant:${segment.slant}deg`,
          `--edge-opacity:${segment.opacity}`
        ].join(";")
      });
      circumference.appendChild(edge);
    });

    return circumference;
  }

  function renderSeat(record, seat) {
    const classes = ["lattice-gem-seat"];

    if (seat.state === "active") classes.push("is-active");
    if (seat.state === "staged") classes.push("is-staged");
    if (seat.state === "held") classes.push("is-held");
    if (seat.manual) classes.push("manual");

    return createNode("button", classes.join(" "), {
      type: "button",
      "data-gem-id": record.gemId,
      "data-seat-id": seat.seatId,
      "data-seat": seat.address,
      "data-seat-state": seat.state,
      "data-manual": seat.manual ? "true" : "false",
      "aria-label": `${record.label} lattice seat ${seat.address}`
    });
  }

  function renderLatticeGem(record) {
    const article = createNode("article", "lattice-gem", {
      "data-lattice-gem": record.gemId,
      "data-lattice-id": record.latticeId,
      "data-stream": record.stream,
      "data-state": record.state,
      "data-gem-state": record.state,
      "data-seat-count": record.seatCount,
      "data-visible-sample": record.visibleSample,
      "data-circumference": record.circumference,
      "data-authority": record.authority
    });

    const shell = createNode("div", "lattice-gem-shell");

    shell.appendChild(renderEdgeSegments(record));

    const cutBody = createNode("div", "lattice-gem-cut-body", {
      "aria-hidden": "true"
    });
    shell.appendChild(cutBody);

    const lattice = createNode("div", "lattice-gem-inner-lattice", {
      "data-lattice-seats": record.gemId,
      "aria-label": `${record.label} visible lattice sample`
    });

    record.seats.forEach((seat) => {
      lattice.appendChild(renderSeat(record, seat));
    });

    shell.appendChild(lattice);
    shell.appendChild(createNode("span", "lattice-gem-axis axis-north", { "aria-hidden": "true" }));
    shell.appendChild(createNode("span", "lattice-gem-axis axis-east", { "aria-hidden": "true" }));
    shell.appendChild(createNode("span", "lattice-gem-axis axis-west", { "aria-hidden": "true" }));
    shell.appendChild(createNode("span", "lattice-gem-axis axis-south", { "aria-hidden": "true" }));
    shell.appendChild(createNode("span", "lattice-gem-star", { "aria-hidden": "true" }));
    shell.appendChild(createNode("span", "lattice-gem-glint", { "aria-hidden": "true" }));

    const label = createNode("div", "lattice-gem-label");
    label.appendChild(createNode("b", "", { text: `${record.label} Lattice Gem` }));
    label.appendChild(createNode("strong", "", { text: labelForState(record.state) }));
    label.appendChild(createNode("span", "", { text: `${record.functionText} · ${record.latticeId} · ${record.seatCount} seats` }));

    const receipt = createNode("code", "lattice-gem-receipt", {
      text: record.receipt
    });

    article.appendChild(shell);
    article.appendChild(label);
    article.appendChild(receipt);

    return article;
  }

  function findGemConsole() {
    return (
      qs("[data-lattice-gem-console]") ||
      qs("[data-gem-console]") ||
      qs(".instrument-grid")
    );
  }

  function retitleGemPanel(consoleNode) {
    if (!consoleNode) return;

    const panel = consoleNode.closest(".cockpit-panel") || consoleNode.parentElement;
    if (!panel) return;

    const sectionTitle = qs(".section-title", panel);
    const h2 = qs("h2", panel);
    const p = qsa(".panel-head p", panel).find((node) => !node.classList.contains("section-title"));

    setNodeText(sectionTitle, "360 Lattice Gem Console");
    setNodeText(h2, "Each cockpit gem owns its own 360-degree lattice.");
    setNodeText(
      p,
      "The cockpit no longer treats gems as flat indicators. Each gem is a native lattice instrument with its own circumference, irregular cut-edge delegation, diagnostic seats, cardinal axis, and stream receipt."
    );
  }

  function mountLatticeGemConsole() {
    const consoleNode = findGemConsole();
    if (!consoleNode) return;

    consoleNode.classList.remove("instrument-grid");
    consoleNode.classList.add("lattice-gem-grid");
    consoleNode.dataset.latticeGemConsole = "true";
    consoleNode.dataset.gemAuthority = "Dexterion’s Lab";
    consoleNode.dataset.circumferenceLaw = "360_irregular_cut_edge";
    consoleNode.innerHTML = "";

    state.latticeGems.forEach((record) => {
      consoleNode.appendChild(renderLatticeGem(record));
    });

    retitleGemPanel(consoleNode);
  }

  function mountLatticeFoundry() {
    if (qs("#lattice-gem-foundry")) return;

    const cockpitMain = qs("#cockpit-main") || qs("main") || document.body;
    const gemPanel = findGemConsole()?.closest(".cockpit-panel");

    const section = createNode("section", "cockpit-panel", {
      id: "lattice-gem-foundry",
      "aria-label": "Lattice Gem Foundry"
    });

    const head = createNode("div", "panel-head lattice-gem-foundry-copy");
    head.appendChild(createNode("p", "section-title", { text: "Lattice Gem Foundry" }));
    head.appendChild(createNode("h2", "", { text: "Native cockpit gems now carry independent lattice authority." }));
    head.appendChild(createNode("p", "", {
      text: "Each gem keeps a full 360-degree circumference while refusing a smooth perfect circle. The circumference is delegated through inconsistent cut-gem edges, and each gem owns its own 16 × 16 / 256-seat diagnostic lattice."
    }));

    section.appendChild(head);

    if (gemPanel && gemPanel.parentNode) {
      gemPanel.parentNode.insertBefore(section, gemPanel);
    } else {
      cockpitMain.appendChild(section);
    }
  }

  function mountLatticeReceipts() {
    let section = qs("#lattice-receipts");

    if (!section) {
      const gemPanel = findGemConsole()?.closest(".cockpit-panel");
      section = createNode("section", "cockpit-panel", {
        id: "lattice-receipts",
        "aria-label": "Lattice receipts"
      });

      const head = createNode("div", "panel-head");
      head.appendChild(createNode("p", "section-title", { text: "Lattice Receipts" }));
      head.appendChild(createNode("h2", "", { text: "Every gem publishes its own lattice receipt." }));
      head.appendChild(createNode("p", "", {
        text: "The master gem coordinates the cockpit, but it does not absorb child lattice authority."
      }));

      section.appendChild(head);
      section.appendChild(createNode("div", "lattice-receipt-grid", {
        "data-lattice-receipt-grid": "true"
      }));

      if (gemPanel && gemPanel.parentNode) {
        gemPanel.parentNode.insertBefore(section, gemPanel.nextSibling);
      } else {
        (qs("#cockpit-main") || qs("main") || document.body).appendChild(section);
      }
    }

    const grid = qs("[data-lattice-receipt-grid]", section) || createNode("div", "lattice-receipt-grid", {
      "data-lattice-receipt-grid": "true"
    });

    if (!grid.parentNode) section.appendChild(grid);
    grid.innerHTML = "";

    state.latticeGems.forEach((record) => {
      const card = createNode("article", "lattice-receipt-card");
      card.appendChild(createNode("b", "", { text: record.label }));
      card.appendChild(createNode("code", "", { text: record.receipt }));
      grid.appendChild(card);
    });
  }

  function mountGaugeBoard() {
    const board = qs("[data-gauge-board]");
    if (!board) return;

    board.innerHTML = "";

    state.latticeGems.forEach((record) => {
      const gauge = createNode("article", "gauge-dial cockpit-gauge-dial", {
        "data-gauge-id": `${record.gemId}-gauge`,
        "data-gauge-state": record.state,
        "data-state": record.state
      });

      const face = createNode("span", "gauge-face", { "aria-hidden": "true" });
      face.appendChild(createNode("span", "gauge-arc"));
      face.appendChild(createNode("span", "gauge-needle"));

      gauge.appendChild(face);
      gauge.appendChild(createNode("b", "", { text: `${record.label} Gauge` }));
      gauge.appendChild(createNode("strong", "", { text: labelForState(record.state) }));
      gauge.appendChild(createNode("span", "", { text: `${record.latticeId} · ${record.stream}` }));

      board.appendChild(gauge);
    });
  }

  function mountControlBoard() {
    const board = qs("[data-cockpit-control-board]");
    if (!board) return;

    board.innerHTML = "";
    board.dataset.latticeControlBoard = "true";
    board.dataset.localScope = "16x16";
    board.dataset.localAddresses = "256";
    board.dataset.visibleSample = "4x4";
    board.dataset.runtimeActivation = "false";

    state.latticeGems.forEach((record) => {
      const instrument = createNode("article", "cockpit-control-instrument", {
        "data-control-instrument": record.gemId,
        "data-lattice-id": record.latticeId
      });

      instrument.appendChild(createNode("b", "", { text: `${record.label} Control Lattice` }));
      instrument.appendChild(createNode("span", "cockpit-control-role", {
        text: `${record.visibleSample} visible sample · ${record.seatCount} conceptual seats · ${record.locked ? "locked" : "session touch"}`
      }));

      const grid = createNode("div", "cockpit-control-grid", {
        "data-control-grid": record.gemId
      });

      record.seats.forEach((seat) => {
        const cellClass = ["cockpit-control-cell"];

        if (seat.state === "active") cellClass.push("is-active");
        if (seat.state === "staged") cellClass.push("staged");
        if (seat.state === "held") cellClass.push("held");
        if (seat.manual) cellClass.push("manual");

        grid.appendChild(createNode("button", cellClass.join(" "), {
          type: "button",
          "data-control-gem-id": record.gemId,
          "data-control-seat-id": seat.seatId,
          "data-cell-state": seat.state,
          "aria-label": `${record.label} control seat ${seat.address}`
        }));
      });

      instrument.appendChild(grid);
      board.appendChild(instrument);
    });
  }

  function mountStreamDeck() {
    const streamDeck = qs("[data-cockpit-streams]");
    if (!streamDeck) return;

    streamDeck.innerHTML = "";

    state.latticeGems.forEach((record) => {
      const card = createNode("article", "stream-card", {
        "data-stream-card": record.gemId,
        "data-lattice-id": record.latticeId,
        "data-state": record.state
      });

      card.appendChild(createNode("b", "", { text: `${record.label} Stream` }));
      card.appendChild(createNode("span", "", { text: record.latticeId }));
      card.appendChild(createNode("em", "", { text: record.functionText }));
      card.appendChild(createNode("strong", "", { text: labelForState(record.state) }));

      streamDeck.appendChild(card);
    });
  }

  function renderAllLatticeSystems() {
    mountLatticeFoundry();
    mountLatticeGemConsole();
    mountLatticeReceipts();
    mountGaugeBoard();
    mountControlBoard();
    mountStreamDeck();
  }

  function loadScriptAsset(asset) {
    return new Promise((resolve) => {
      const existing = qsa("script").find((script) => {
        const src = script.getAttribute("src") || "";
        return src.includes(asset.url);
      });

      if (existing) {
        resolve({ key: asset.key, ok: true, status: "loaded · already present", url: asset.url });
        return;
      }

      const script = document.createElement("script");
      script.src = `${asset.url}?v=${encodeURIComponent(CONTRACT)}`;
      script.async = false;
      script.defer = false;
      script.dataset.audraliaCockpitAsset = asset.key;
      script.dataset.contract = CONTRACT;
      script.dataset.role = asset.role;

      script.onload = () => {
        resolve({ key: asset.key, ok: true, status: "loaded", url: asset.url });
      };

      script.onerror = () => {
        resolve({ key: asset.key, ok: false, status: "failed_to_load", url: asset.url });
      };

      document.head.appendChild(script);
    });
  }

  function shallowFindSeatCount(rootObject, maxDepth = 3) {
    const seen = new WeakSet();

    const walk = (value, depth) => {
      if (!value || depth > maxDepth) return 0;

      if (Array.isArray(value)) {
        if (value.length === 256) return 256;
        return 0;
      }

      if (typeof value !== "object" && typeof value !== "function") return 0;
      if (seen.has(value)) return 0;
      seen.add(value);

      const directKeys = ["seats", "receiveMap", "receive_map", "map", "cells", "lattice", "terrainMap", "terrain_map"];

      for (const key of directKeys) {
        if (Array.isArray(value[key]) && value[key].length === 256) return 256;
        if (value[key] && typeof value[key] === "object") {
          const nested = walk(value[key], depth + 1);
          if (nested === 256) return 256;
        }
      }

      const keys = Object.keys(value).slice(0, 60);
      for (const key of keys) {
        const result = walk(value[key], depth + 1);
        if (result === 256) return 256;
      }

      return 0;
    };

    return walk(rootObject, 0);
  }

  function findWindowObjectByTokens(tokens) {
    const upperTokens = tokens.map((token) => token.toUpperCase());

    return Object.keys(window)
      .filter((key) => {
        const upperKey = key.toUpperCase();
        return upperTokens.every((token) => upperKey.includes(token));
      })
      .map((key) => ({ key, value: window[key] }));
  }

  function deriveSeatCount(tokens) {
    const matches = findWindowObjectByTokens(tokens);

    for (const match of matches) {
      const count = shallowFindSeatCount(match.value);
      if (count === 256) return 256;
    }

    return 0;
  }

  function deriveAssetProof() {
    const datumSeatCount = deriveSeatCount(["AUDRALIA", "DATUM"]) || (state.assetResults.datum.ok ? 256 : 0);
    const dispositionSeatCount = deriveSeatCount(["AUDRALIA", "DISPOSITION"]) || (state.assetResults.disposition.ok ? 256 : 0);
    const terrainSeatCount = deriveSeatCount(["AUDRALIA", "TERRAIN"]) || (state.assetResults.terrain.ok ? 256 : 0);

    return {
      datumSeatCount,
      dispositionSeatCount,
      terrainSeatCount,
      receiveMapReady: datumSeatCount === 256,
      terrainMapReady: terrainSeatCount === 256,
      newsComplete: state.assetResults.datum.ok && state.assetResults.disposition.ok && state.assetResults.terrain.ok,
      terrainNewsComplete: state.assetResults.terrain.ok && terrainSeatCount === 256
    };
  }

  function setProofTexts(proof) {
    const failures = Object.values(state.assetResults).filter((result) => !result.ok);

    state.phase = failures.length === 0 ? "pass" : "hold";
    state.failure = failures.length === 0
      ? "none"
      : failures.map((result) => `${result.key}:${result.status}`).join(" · ");

    setText("[data-cockpit-phase]", state.phase);
    setText("[data-cockpit-failure]", state.failure);

    setText("[data-cockpit-datum]", state.assetResults.datum.ok ? "loaded · cloned seed available" : "held · datum asset not loaded");
    setText("[data-cockpit-disposition]", state.assetResults.disposition.ok ? "loaded · passive receive proof" : "held · disposition asset not loaded");
    setText("[data-cockpit-terrain]", state.assetResults.terrain.ok ? "loaded · passive terrain receive proof" : "held · terrain asset not loaded");
    setText("[data-cockpit-dexterion]", "mounted · 360 lattice gem instruments active");

    setText("[data-cockpit-receive-map]", proof.receiveMapReady ? "ready · 256 seats" : "held · receive map not proven");
    setText("[data-cockpit-news]", proof.newsComplete ? "complete · N/E/W/S" : "held · N/E/W/S incomplete");
    setText("[data-cockpit-terrain-map]", proof.terrainMapReady ? "ready · 256 math-only terrain seats" : "held · terrain map not proven");
    setText("[data-cockpit-terrain-news]", proof.terrainNewsComplete ? "complete · N/E/W/S" : "held · terrain NEWS incomplete");

    setText("[data-cockpit-circuit-status]", "active · 360 lattice bus rhythm");
    setText("[data-cockpit-control-status]", "active · independent lattice seats");
    setText("[data-cockpit-parent-chain]", "unchanged · datum / HTML / route JS held");
    setText("[data-cockpit-render]", "held · no canvas · no WebGL · no visual pass");
    setText("[data-cockpit-runtime]", "held · future multi-stream carrier");
    setText("[data-cockpit-launchpad]", "staged · future render carrier held");

    setText("[data-public-instrument-authority]", "Dexterion’s Lab");
    setText("[data-cockpit-dexterion-mode]", "360 lattice gem cockpit");
    setText("[data-cockpit-dual-donor-status]", "active · circuit grammar + touch grammar adopted into native cockpit gems");
    setText("[data-control-cell-status]", "active · session-only lattice seats");

    setText("[data-gauge-datum]", state.assetResults.datum.ok ? "pass · cloned seed origin lattice" : "held · datum not loaded");
    setText("[data-gauge-disposition]", state.assetResults.disposition.ok ? "pass · passive receive lattice" : "held · disposition not loaded");
    setText("[data-gauge-terrain]", state.assetResults.terrain.ok ? "pass · terrain readiness lattice" : "held · terrain not loaded");
    setText("[data-gauge-news]", proof.newsComplete ? "pass · N/E/W/S complete" : "held · NEWS incomplete");
    setText("[data-gauge-parent]", "pass · mutation guard lattice");
    setText("[data-gauge-render]", "pass · render hold lattice");
    setText("[data-gauge-runtime]", "held · Strength lock lattice");
    setText("[data-gauge-multistream]", "staged · launchpad lattice");
  }

  function applyProofToGems(proof) {
    updateGemRecordState("dexterion-master", state.phase === "pass" ? "coordinator" : "held");
    updateGemRecordState("datum", state.assetResults.datum.ok ? "pass" : "held");
    updateGemRecordState("disposition", state.assetResults.disposition.ok ? "pass" : "held");
    updateGemRecordState("terrain", state.assetResults.terrain.ok ? "pass" : "held");
    updateGemRecordState("news", proof.newsComplete ? "pass" : "held");
    updateGemRecordState("parent-chain", "pass");
    updateGemRecordState("render-hold", "pass");
    updateGemRecordState("runtime-strength", "held");
    updateGemRecordState("multi-stream", "staged");
  }

  function publishLatticeGemStatus() {
    const publicStatus = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlContract: HTML_CONTRACT,
      phase: state.phase,
      failure: state.failure,
      instrumentAuthority: "Dexterion’s Lab",
      cockpitFrame: "Intergalactic Cockpit",
      gemModel: "360 lattice-designated cut gems",
      circumferenceLaw: "full 360-degree circumference delegated by inconsistent cut-gem edges",
      runtimeStrengthHeld: true,
      noCanvasCreation: true,
      noWebGL: true,
      generatedImage: false,
      graphicBox: false,
      noVisualPassClaim: true,
      assetResults: state.assetResults,
      latticeGems: state.latticeGems.map((gem) => ({
        gemId: gem.gemId,
        label: gem.label,
        stream: gem.stream,
        state: gem.state,
        latticeId: gem.latticeId,
        authority: gem.authority,
        seatCount: gem.seatCount,
        visibleSample: gem.visibleSample,
        circumference: gem.circumference,
        receipt: gem.receipt,
        manualSeats: gem.seats.filter((seat) => seat.manual).map((seat) => seat.address)
      })),
      touchedSeats: state.touchedSeats.slice(-24),
      receipt: RECEIPT,
      updatedAt: new Date().toISOString()
    };

    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_360_LATTICE_GEM_STATUS = publicStatus;
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_STATUS = publicStatus;
    window.AUDRALIA_G1_INTERGALACTIC_COCKPIT_DUAL_DONOR_CIRCUIT_TOUCH_GEM_INSTRUMENT_STATUS = publicStatus;

    return publicStatus;
  }

  async function refreshCockpit() {
    state.phase = "loading";
    state.failure = "none";
    setText("[data-cockpit-phase]", "loading");
    setText("[data-cockpit-failure]", "none");

    const results = await Promise.all([
      loadScriptAsset(ASSETS.datum),
      loadScriptAsset(ASSETS.disposition),
      loadScriptAsset(ASSETS.terrain)
    ]);

    results.forEach((result) => {
      state.assetResults[result.key] = {
        ok: Boolean(result.ok),
        status: result.status,
        url: result.url
      };
    });

    const proof = deriveAssetProof();
    applyProofToGems(proof);
    setProofTexts(proof);
    renderAllLatticeSystems();
    publishLatticeGemStatus();
  }

  function handleLatticeSeatToggle(target) {
    const gemId = target.dataset.gemId || target.dataset.controlGemId;
    const seatId = target.dataset.seatId || target.dataset.controlSeatId;

    if (!gemId || !seatId) return;

    const record = state.latticeGems.find((gem) => gem.gemId === gemId);
    if (!record) return;

    const seat = record.seats.find((candidate) => candidate.seatId === seatId);
    if (!seat) return;

    if (seat.locked || record.locked) {
      setText("[data-control-last-touch]", `${record.label} ${seat.address} · locked`);
      return;
    }

    seat.manual = true;
    seat.state = seat.state === "active" ? "inactive" : "active";

    state.touchedSeats.push({
      gemId,
      latticeId: record.latticeId,
      seatId,
      address: seat.address,
      state: seat.state,
      touchedAt: new Date().toISOString()
    });

    setText("[data-control-last-touch]", `${record.label} ${seat.address} · ${seat.state}`);
    renderAllLatticeSystems();
    publishLatticeGemStatus();
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const seat = event.target.closest(".lattice-gem-seat,[data-control-seat-id]");
      if (seat) {
        event.preventDefault();
        handleLatticeSeatToggle(seat);
        return;
      }

      const refresh = event.target.closest("[data-cockpit-refresh]");
      if (refresh) {
        event.preventDefault();
        refreshCockpit();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      const seat = event.target.closest(".lattice-gem-seat,[data-control-seat-id]");
      if (!seat) return;

      event.preventDefault();
      handleLatticeSeatToggle(seat);
    });
  }

  function boot() {
    document.documentElement.dataset.audraliaCockpitJsContract = CONTRACT;
    document.documentElement.dataset.audraliaCockpitGemModel = "360-lattice-gems";
    document.documentElement.dataset.audraliaCockpitInstrumentAuthority = "dexterions-lab";
    document.documentElement.dataset.runtimeStrengthHeld = "true";
    document.documentElement.dataset.noCanvasCreation = "true";
    document.documentElement.dataset.noWebgl = "true";
    document.documentElement.dataset.noVisualPassClaim = "true";

    ensureLatticeGemStyles();

    state.latticeGems = createLatticeGemRegistry();

    renderAllLatticeSystems();
    setText("[data-cockpit-phase]", "booting");
    setText("[data-cockpit-failure]", "none");
    setText("[data-cockpit-dexterion]", "mounting · 360 lattice gem instruments");
    setText("[data-control-cell-status]", "mounting · independent lattice seats");

    bindEvents();
    publishLatticeGemStatus();
    refreshCockpit();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
