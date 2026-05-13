// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_RUNTIME_SKIN_GUARD_RECOVERY_TNT_v2
// Owns: H-Earth Western Golden Shelf estate-authorization route presentation and runtime skin guard.
// Does not own: Manor placement, Estate placement, bridge placement, road placement, city placement, or Globe selector mutation.

import {
  H_EARTH_GROUND_SCOUT_VERSION,
  createHEarthGroundScout,
  gradeBuildCandidateRegion
} from "/assets/h-earth/h-earth.ground.scout.js?v=h-earth-ground-scout-v1";

import {
  H_EARTH_TERRAIN_CLASSIFIER_VERSION,
  TERRAIN_CLASSES,
  BUILD_CANDIDATE_GRADES
} from "/assets/h-earth/h-earth.terrain.classifier.js?v=h-earth-terrain-classifier-v1";

import {
  H_EARTH_WESTERN_GOLDEN_SHELF_VERSION,
  H_EARTH_WESTERN_GOLDEN_SHELF_CONTRACT,
  createWesternGoldenShelfAuthorization
} from "/assets/h-earth/h-earth.western-golden-shelf.js?v=western-golden-shelf-v1";

const CONTRACT = "H_EARTH_RUNTIME_SKIN_GUARD_RECOVERY_TNT_v2";
const PRIOR_CONTRACT = "H_EARTH_WESTERN_GOLDEN_SHELF_ESTATE_AUTHORIZATION_TNT_v1";
const STYLE_GUARD_ID = "dgb-h-earth-runtime-skin-guard";

const state = {
  scout: null,
  authorization: null,
  selectedRegionId: "HE-R01",
  canvas: null,
  ctx: null,
  raf: 0,
  skinRaf: 0,
  skinChecks: 0,
  time: 0,
  dpr: 1,
  width: 0,
  height: 0
};

function installRuntimeSkinGuard() {
  document.documentElement.classList.add("dgb-h-earth-skin-locked");
  document.body?.classList.add("dgb-h-earth-skin-locked");
  document.documentElement.dataset.runtimeSkinGuard = "true";
  if (document.body) document.body.dataset.runtimeSkinGuard = "true";

  let style = document.getElementById(STYLE_GUARD_ID);

  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_GUARD_ID;
    style.setAttribute("data-contract", CONTRACT);
    document.head.appendChild(style);
  }

  style.textContent = `
    html.dgb-h-earth-skin-locked,
    body.dgb-h-earth-skin-locked {
      min-height: 100% !important;
      color-scheme: dark !important;
      background:
        radial-gradient(circle at 50% -8%, rgba(78,119,171,0.26), transparent 38%),
        radial-gradient(circle at 12% 18%, rgba(244,207,131,0.12), transparent 30%),
        radial-gradient(circle at 84% 30%, rgba(167,243,198,0.09), transparent 34%),
        linear-gradient(180deg, #061020 0%, #030812 54%, #02050b 100%) !important;
      color: rgba(238,244,255,0.94) !important;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    }

    body.dgb-h-earth-skin-locked {
      margin: 0 !important;
      background:
        linear-gradient(90deg, rgba(244,207,131,0.08) 1px, transparent 1px),
        linear-gradient(180deg, rgba(244,207,131,0.035) 1px, transparent 1px),
        linear-gradient(180deg, #061020 0%, #030812 54%, #02050b 100%) !important;
      background-size: 58px 58px, 58px 58px, auto !important;
      letter-spacing: -0.015em !important;
    }

    .page {
      width: min(1180px, calc(100% - 28px)) !important;
      margin: 0 auto !important;
      padding: 22px 0 58px !important;
    }

    .hero,
    .panel {
      border: 1px solid rgba(244,207,131,0.20) !important;
      border-radius: 34px !important;
      background:
        radial-gradient(circle at 76% 28%, rgba(139,200,255,0.12), transparent 32%),
        radial-gradient(circle at 18% 20%, rgba(244,207,131,0.10), transparent 30%),
        linear-gradient(180deg, rgba(8,17,34,0.95), rgba(4,9,20,0.96)) !important;
      box-shadow: 0 30px 90px rgba(0,0,0,0.34) !important;
      overflow: hidden !important;
    }

    .hero { padding: clamp(24px, 5vw, 46px) !important; }
    .panel { padding: clamp(18px, 3vw, 28px) !important; }

    h1, h2, .selected-heading h2, .terrain-readout h3, .proof-head h3, .zone-card h3, .standard-card h2 {
      color: #f4cf83 !important;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    }

    h1 {
      max-width: 980px !important;
      margin: 0 !important;
      font-size: clamp(2.1rem, 7vw, 5rem) !important;
      line-height: 0.94 !important;
      letter-spacing: -0.07em !important;
    }

    p, li, small, span {
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
    }

    .lede, .selected-summary, .terrain-readout p, .proof-card p, .zone-card p, .standard-card p {
      color: rgba(238,244,255,0.66) !important;
      line-height: 1.55 !important;
    }

    .topbar {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 16px !important;
      padding: 12px 0 22px !important;
    }

    .nav {
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: flex-end !important;
      gap: 8px !important;
    }

    .nav a, .button {
      min-height: 38px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      border: 1px solid rgba(255,255,255,0.11) !important;
      border-radius: 999px !important;
      padding: 0 13px !important;
      color: rgba(238,244,255,0.84) !important;
      text-decoration: none !important;
      background: rgba(255,255,255,0.04) !important;
      font-size: 0.82rem !important;
      font-weight: 850 !important;
      letter-spacing: 0.02em !important;
    }

    .nav a[aria-current="page"], .button.primary {
      color: #06101c !important;
      background: linear-gradient(135deg, #a7f3c6, #78d8ac) !important;
      border-color: rgba(167,243,198,0.64) !important;
    }

    .button.gold {
      color: #150d03 !important;
      background: linear-gradient(135deg, #fff0b8, #f4cf83 48%, #c48a38) !important;
      border-color: rgba(244,207,131,0.74) !important;
    }

    .summary, .metric-grid, .proof-grid, .zone-grid, .orientation-grid, .standard-grid {
      display: grid !important;
      gap: 14px !important;
    }

    .summary { grid-template-columns: repeat(4, minmax(0,1fr)) !important; margin: 16px 0 !important; }
    .metric-grid { grid-template-columns: repeat(3, minmax(0,1fr)) !important; margin: 14px 0 !important; }
    .proof-grid, .zone-grid, .orientation-grid, .standard-grid { grid-template-columns: repeat(3, minmax(0,1fr)) !important; margin-top: 16px !important; }

    .summary div, .metric, .terrain-readout, .hold-box, .proof-card, .zone-card, .standard-card, .orientation-grid div {
      border: 1px solid rgba(255,255,255,0.11) !important;
      border-radius: 18px !important;
      padding: 14px !important;
      background: rgba(255,255,255,0.045) !important;
      color: rgba(238,244,255,0.94) !important;
    }

    .proof-card, .zone-card, .standard-card, .orientation-grid div {
      border-radius: 24px !important;
      padding: 18px !important;
      background: rgba(11,23,44,0.80) !important;
    }

    .grid {
      display: grid !important;
      grid-template-columns: minmax(280px,0.85fr) minmax(0,1.35fr) !important;
      gap: 16px !important;
      margin-top: 16px !important;
    }

    .region-list {
      display: grid !important;
      gap: 10px !important;
      max-height: 720px !important;
      overflow: auto !important;
      padding-right: 3px !important;
      margin-top: 18px !important;
    }

    .region-card {
      width: 100% !important;
      border: 1px solid rgba(255,255,255,0.11) !important;
      border-radius: 20px !important;
      padding: 14px !important;
      color: rgba(238,244,255,0.94) !important;
      background: rgba(255,255,255,0.04) !important;
      text-align: left !important;
      cursor: pointer !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      font-family: Inter, ui-sans-serif, system-ui !important;
    }

    .region-card.is-selected, .region-card.is-primary {
      border-color: rgba(167,243,198,0.64) !important;
      background: rgba(167,243,198,0.10) !important;
    }

    .viewport {
      width: 100% !important;
      min-height: 330px !important;
      border: 1px solid rgba(244,207,131,0.20) !important;
      border-radius: 26px !important;
      overflow: hidden !important;
      background: #06101d !important;
      margin-bottom: 16px !important;
    }

    .viewport canvas {
      display: block !important;
      width: 100% !important;
      height: 360px !important;
    }

    .grade-pill, .gate-label {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 999px !important;
      color: #06101c !important;
      font-weight: 950 !important;
      background: #f4cf83 !important;
    }

    .grade-a { background: #a7f3c6 !important; }
    .grade-b { background: #f4cf83 !important; }
    .grade-c { background: #9db7ff !important; }
    .grade-d { background: #ff9f9f !important; }

    @media (max-width: 900px) {
      .topbar { align-items: flex-start !important; flex-direction: column !important; }
      .nav { justify-content: flex-start !important; }
      .grid { grid-template-columns: 1fr !important; }
      .summary { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
      .proof-grid, .zone-grid, .orientation-grid, .standard-grid { grid-template-columns: 1fr !important; }
    }

    @media (max-width: 560px) {
      .page { width: min(100% - 18px, 1180px) !important; }
      .hero, .panel { border-radius: 24px !important; }
      .metric-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
      .viewport canvas { height: 310px !important; }
      .selected-heading { flex-direction: column !important; }
    }
  `;
}

function enforceRuntimeSkin() {
  installRuntimeSkinGuard();

  const body = document.body;
  const html = document.documentElement;

  if (!body || !html) return;

  body.style.backgroundColor = "#030812";
  body.style.color = "rgba(238,244,255,0.94)";
  body.style.fontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  html.style.backgroundColor = "#030812";
  html.style.color = "rgba(238,244,255,0.94)";
}

function startSkinWatchdog() {
  const tick = () => {
    state.skinChecks += 1;

    const body = document.body;
    const html = document.documentElement;
    const computed = body ? window.getComputedStyle(body) : null;
    const bg = computed?.backgroundColor || "";
    const font = computed?.fontFamily || "";

    const whiteFallback =
      bg.includes("255, 255, 255") ||
      bg === "white" ||
      font.toLowerCase().includes("times") ||
      !document.getElementById(STYLE_GUARD_ID) ||
      !html.classList.contains("dgb-h-earth-skin-locked") ||
      !body?.classList.contains("dgb-h-earth-skin-locked");

    if (whiteFallback || state.skinChecks < 40) {
      enforceRuntimeSkin();
    }

    if (state.skinChecks < 240) {
      state.skinRaf = requestAnimationFrame(tick);
    }
  };

  if (!state.skinRaf) {
    state.skinRaf = requestAnimationFrame(tick);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function formatPercent(value) {
  return `${Math.round(clamp(value, 0, 1) * 100)}%`;
}

function setMarkers() {
  const markers = {
    contract: CONTRACT,
    priorContract: PRIOR_CONTRACT,
    route: "/showroom/globe/h-earth/",
    runtimeSkinGuard: "true",
    selectedRegion: "western-golden-shelf",
    westernGoldenShelfSelected: "true",
    estateAuthorizationAnalysis: "true",
    groundLevelScouting: "true",
    buildCandidateAnalysis: "true",

    terrainStabilityProof: "true",
    elevationLogicProof: "true",
    waterRelationshipProof: "true",
    arrivalDirectionProof: "true",
    boundaryLogicProof: "true",
    orientationLogicProof: "true",

    manorPlacementAuthorized: "false",
    estatePlacementAuthorized: "false",
    bridgePlacementAuthorized: "false",
    roadPlacementAuthorized: "false",
    cityPlacementAuthorized: "false",
    finalArchitectureAuthorized: "false",

    orbitalBaselinePreserved: "true",
    globeSelectorMutated: "false",
    mapFlattening: "false",
    target: "h-earth"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = value;
    document.body.dataset[key] = value;
  });
}

function gradeClass(gradeKey) {
  if (gradeKey === "A") return "grade-a";
  if (gradeKey === "B") return "grade-b";
  if (gradeKey === "C") return "grade-c";
  return "grade-d";
}

function proofClass(status) {
  if (status === "PASS") return "proof-pass";
  if (status === "REVIEW") return "proof-review";
  return "proof-fail";
}

function renderRegionCards() {
  const mount = qs("[data-region-list]");
  if (!mount || !state.scout) return;

  mount.innerHTML = state.scout.regions.map((region) => {
    const selected = region.id === state.selectedRegionId;
    const grade = region.buildability.grade.key;
    const lockedPrimary = region.id === "HE-R01";

    return `
      <button
        class="region-card ${selected ? "is-selected" : ""} ${lockedPrimary ? "is-primary" : ""}"
        type="button"
        data-region-card="${region.id}"
        aria-pressed="${selected ? "true" : "false"}"
      >
        <span class="region-topline">
          <span>${region.id}${lockedPrimary ? " · SELECTED" : ""}</span>
          <span class="grade-pill ${gradeClass(grade)}">${grade}</span>
        </span>
        <strong>${region.name}</strong>
        <span>${region.terrainClass.label}</span>
        <small>${region.summary}</small>
      </button>
    `;
  }).join("");

  qsa("[data-region-card]").forEach((button) => {
    button.addEventListener("click", () => selectRegion(button.dataset.regionCard));
  });
}

function renderSelectedRegion() {
  const region = state.scout?.regions.find((item) => item.id === state.selectedRegionId) || state.scout?.bestCandidate;
  const mount = qs("[data-selected-region]");
  if (!mount || !region) return;

  const grade = gradeBuildCandidateRegion(region);
  const buildability = region.buildability;

  mount.innerHTML = `
    <div class="selected-heading">
      <div>
        <p class="eyebrow compact">Selected scouting region</p>
        <h2>${region.name}</h2>
      </div>
      <span class="grade-pill ${gradeClass(grade.grade)}">${BUILD_CANDIDATE_GRADES[grade.grade]?.label || "D — No-build"}</span>
    </div>

    <p class="selected-summary">${region.summary}</p>

    <div class="metric-grid">
      <div class="metric"><span>Buildability</span><strong>${formatPercent(buildability.score)}</strong></div>
      <div class="metric"><span>Stability</span><strong>${formatPercent(buildability.stability)}</strong></div>
      <div class="metric"><span>Water access</span><strong>${formatPercent(buildability.waterAccess)}</strong></div>
      <div class="metric"><span>Expansion room</span><strong>${formatPercent(buildability.expansionRoom)}</strong></div>
      <div class="metric"><span>Bridge approach</span><strong>${formatPercent(buildability.bridgeApproach)}</strong></div>
      <div class="metric"><span>Wet risk</span><strong>${formatPercent(buildability.wetFoundationRisk)}</strong></div>
    </div>

    <div class="terrain-readout">
      <h3>${region.terrainClass.label}</h3>
      <p>${region.terrainClass.description}</p>
      <p><strong>Horizon:</strong> ${region.horizon}</p>
      <p><strong>Arrival read:</strong> ${region.arrivalRead}</p>
    </div>

    <div class="hold-box">
      <strong>Placement hold remains active</strong>
      <span>Manor placement: HOLD</span>
      <span>Estate placement: HOLD</span>
      <span>Diamond Gate Bridge placement: HOLD</span>
    </div>
  `;

  drawScoutViewport(region);
}

function renderSummary() {
  const scout = state.scout;
  const authorization = state.authorization;
  if (!scout || !authorization) return;

  const summaryMount = qs("[data-scout-summary]");
  if (summaryMount) {
    summaryMount.innerHTML = `
      <div><strong>${authorization.proofSummary.passCount}</strong><span>Proof passes</span></div>
      <div><strong>${formatPercent(authorization.proofSummary.averageScore)}</strong><span>Proof score</span></div>
      <div><strong>${scout.summary.primaryCandidates}</strong><span>A candidates</span></div>
      <div><strong>${authorization.authorizationGate}</strong><span>Authorization gate</span></div>
    `;
  }

  const bestMount = qs("[data-best-candidate]");
  if (bestMount) {
    bestMount.textContent = authorization.selectedRegion;
  }
}

function renderAuthorizationProof() {
  const authorization = state.authorization;
  const proofMount = qs("[data-western-proof-list]");
  const gateMount = qs("[data-authorization-gate]");
  const boundaryMount = qs("[data-boundary-logic]");
  const orientationMount = qs("[data-orientation-logic]");

  if (!authorization) return;

  if (proofMount) {
    proofMount.innerHTML = authorization.proofAreas.map((area) => `
      <article class="proof-card ${proofClass(area.status)}">
        <div class="proof-head">
          <h3>${area.title}</h3>
          <span>${area.status}</span>
        </div>
        <p>${area.summary}</p>
        <div class="proof-score">
          <strong>${formatPercent(area.score)}</strong>
          <span>proof score</span>
        </div>
        <ul>
          ${area.findings.map((finding) => `<li>${finding}</li>`).join("")}
        </ul>
      </article>
    `).join("");
  }

  if (gateMount) {
    gateMount.innerHTML = `
      <span class="gate-label">${authorization.authorizationGate}</span>
      <p>
        Western Golden Shelf is ${authorization.authorizedForNextPlanning ? "eligible for the next planning packet" : "not yet eligible for next planning"}.
        This still does not place the Manor, Estate, or Diamond Gate Bridge.
      </p>
    `;
  }

  if (boundaryMount) {
    const zones = authorization.site.zones;
    boundaryMount.innerHTML = Object.values(zones).map((zone) => `
      <article class="zone-card">
        <h3>${zone.label}</h3>
        <p>${zone.description}</p>
        <small>${zone.role}</small>
      </article>
    `).join("");
  }

  if (orientationMount) {
    const o = authorization.site.orientation;
    orientationMount.innerHTML = `
      <div class="orientation-grid">
        <div><span>Facing</span><strong>${o.likelyFacingDirection}</strong></div>
        <div><span>View axis</span><strong>${o.viewAxis}</strong></div>
        <div><span>Water axis</span><strong>${o.waterAxis}</strong></div>
        <div><span>Sun/light</span><strong>${o.sunLightAxis}</strong></div>
        <div><span>Arrival</span><strong>${o.arrivalAxis}</strong></div>
        <div><span>Bridge direction</span><strong>${o.bridgeDirection}</strong></div>
      </div>
    `;
  }
}

function selectRegion(regionId) {
  state.selectedRegionId = regionId;
  renderRegionCards();
  renderSelectedRegion();
  enforceRuntimeSkin();
}

function resizeCanvas() {
  const canvas = state.canvas;
  if (!canvas) return;

  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const width = Math.max(320, Math.floor(box.width * dpr));
  const height = Math.max(260, Math.floor(box.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    state.width = width;
    state.height = height;
    state.dpr = dpr;
  }
}

function drawScoutViewport(region) {
  const canvas = state.canvas;
  const ctx = state.ctx;
  if (!canvas || !ctx || !region) return;

  resizeCanvas();

  const width = state.width;
  const height = state.height;
  const sample = region.sample;
  const grade = region.buildability.grade.key;

  ctx.clearRect(0, 0, width, height);

  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.62);
  sky.addColorStop(0, "rgba(5,13,28,1)");
  sky.addColorStop(0.58, "rgba(19,40,58,1)");
  sky.addColorStop(1, "rgba(34,55,54,1)");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const horizonY = height * (0.42 + sample.elevation * 0.10 - sample.relief * 0.06);
  const ridgeAmp = height * (0.04 + sample.relief * 0.10);
  const slope = (sample.slope - 0.5) * height * 0.18;

  ctx.fillStyle = "rgba(8,14,18,0.88)";
  ctx.beginPath();
  ctx.moveTo(0, horizonY + slope * 0.3);

  for (let i = 0; i <= 24; i += 1) {
    const x = (i / 24) * width;
    const wave =
      Math.sin(i * 0.9 + region.id.length) * ridgeAmp * 0.55 +
      Math.sin(i * 1.7) * ridgeAmp * 0.22;
    ctx.lineTo(x, horizonY + wave + (i / 24 - 0.5) * slope);
  }

  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  const land = ctx.createLinearGradient(0, horizonY, 0, height);
  land.addColorStop(0, "rgba(148,124,70,0.92)");
  land.addColorStop(0.52, "rgba(64,84,60,0.94)");
  land.addColorStop(1, "rgba(18,26,24,1)");
  ctx.fillStyle = land;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.62);

  for (let i = 0; i <= 18; i += 1) {
    const x = (i / 18) * width;
    const y = height * (0.58 + i * 0.006) + Math.sin(i * 1.22) * height * 0.025 + slope * 0.16;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  if (sample.waterAccess > 0.38) {
    const waterY = height * (0.72 - sample.coast * 0.10);
    const water = ctx.createLinearGradient(0, waterY, width, height);
    water.addColorStop(0, "rgba(44,107,104,0.16)");
    water.addColorStop(0.5, "rgba(79,148,134,0.30)");
    water.addColorStop(1, "rgba(22,58,74,0.24)");

    ctx.fillStyle = water;
    ctx.beginPath();
    ctx.moveTo(0, waterY);

    for (let i = 0; i <= 16; i += 1) {
      const x = (i / 16) * width;
      const y = waterY + Math.sin(i * 1.8 + state.time) * height * 0.014;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
  }

  if (sample.vegetation > 0.34) {
    ctx.fillStyle = "rgba(89,147,86,0.20)";
    for (let i = 0; i < 28; i += 1) {
      const x = ((i * 73) % 100) / 100 * width;
      const y = height * (0.58 + ((i * 37) % 38) / 100);
      const r = height * (0.010 + ((i * 11) % 9) / 1000) * sample.vegetation;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 2.2, r, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const candidateColor =
    grade === "A" ? "rgba(167,243,198,0.92)" :
    grade === "B" ? "rgba(244,207,131,0.86)" :
    grade === "C" ? "rgba(160,190,255,0.72)" :
    "rgba(255,125,125,0.68)";

  ctx.strokeStyle = candidateColor;
  ctx.lineWidth = Math.max(1.5, state.dpr * 1.6);
  ctx.setLineDash([8 * state.dpr, 8 * state.dpr]);
  ctx.beginPath();
  ctx.ellipse(
    width * 0.50,
    height * 0.69,
    width * (0.18 + sample.expansionRoom * 0.08),
    height * (0.045 + (1 - sample.slope) * 0.025),
    -0.08 + sample.slope * 0.18,
    0,
    Math.PI * 2
  );
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(238,244,255,0.70)";
  ctx.font = `${Math.max(12, 12 * state.dpr)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.fillText(`${region.id} · ${region.terrainClass.label} · Grade ${grade}`, 18 * state.dpr, height - 22 * state.dpr);
}

function tick(time) {
  state.time = time / 1000;
  const region = state.scout?.regions.find((item) => item.id === state.selectedRegionId) || state.scout?.bestCandidate;

  if (region) drawScoutViewport(region);

  state.raf = requestAnimationFrame(tick);
}

function initHEarthGroundScout() {
  enforceRuntimeSkin();
  startSkinWatchdog();
  setMarkers();

  state.scout = createHEarthGroundScout();
  state.authorization = createWesternGoldenShelfAuthorization();
  state.selectedRegionId = "HE-R01";
  state.canvas = qs("[data-ground-scout-canvas]");
  state.ctx = state.canvas?.getContext("2d", { alpha: false }) || null;

  renderSummary();
  renderRegionCards();
  renderSelectedRegion();
  renderAuthorizationProof();

  enforceRuntimeSkin();

  if (!state.raf && state.canvas && state.ctx) {
    state.raf = requestAnimationFrame(tick);
  }

  window.DGBHEarthGroundScout = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        priorContract: PRIOR_CONTRACT,
        target: "H-Earth",
        route: "/showroom/globe/h-earth/",
        runtimeSkinGuard: true,
        skinGuardStyleMounted: Boolean(document.getElementById(STYLE_GUARD_ID)),
        selectedRegion: "Western Golden Shelf",
        selectedRegionKey: "western-golden-shelf",
        westernGoldenShelfSelected: true,
        estateAuthorizationAnalysis: true,

        groundLevelScouting: true,
        buildCandidateAnalysis: true,
        terrainStabilityProof: true,
        elevationLogicProof: true,
        waterRelationshipProof: true,
        arrivalDirectionProof: true,
        boundaryLogicProof: true,
        orientationLogicProof: true,

        manorPlacementAuthorized: false,
        estatePlacementAuthorized: false,
        bridgePlacementAuthorized: false,
        roadPlacementAuthorized: false,
        cityPlacementAuthorized: false,
        finalArchitectureAuthorized: false,

        authorizationGate: state.authorization?.authorizationGate || "HELD",
        authorizedForNextPlanning: state.authorization?.authorizedForNextPlanning === true,

        orbitalBaselinePreserved: true,
        globeSelectorMutated: false,
        mapFlattening: false,
        transitionPath: "H-Earth orbital baseline → Western Golden Shelf regional candidate → terrain/elevation proof → water relationship proof → arrival/bridge direction proof → estate boundary logic → Manor placement authorization",

        scoutVersion: H_EARTH_GROUND_SCOUT_VERSION,
        classifierVersion: H_EARTH_TERRAIN_CLASSIFIER_VERSION,
        westernGoldenShelfVersion: H_EARTH_WESTERN_GOLDEN_SHELF_VERSION,
        westernGoldenShelfContract: H_EARTH_WESTERN_GOLDEN_SHELF_CONTRACT,

        regionCount: state.scout?.summary.totalRegions || 0,
        primaryCandidates: state.scout?.summary.primaryCandidates || 0,
        supportCandidates: state.scout?.summary.supportCandidates || 0,
        noBuildRegions: state.scout?.summary.noBuildRegions || 0,
        selectedRegionId: state.selectedRegionId,
        bestCandidate: state.authorization?.selectedRegion || "Western Golden Shelf",
        proofSummary: state.authorization?.proofSummary || null,
        terrainClasses: Object.keys(TERRAIN_CLASSES),
        buildCandidateGrades: Object.keys(BUILD_CANDIDATE_GRADES)
      });
    }
  });

  return window.DGBHEarthGroundScout;
}

enforceRuntimeSkin();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHEarthGroundScout, { once: true });
} else {
  initHEarthGroundScout();
}

export { initHEarthGroundScout };
export default initHEarthGroundScout;
