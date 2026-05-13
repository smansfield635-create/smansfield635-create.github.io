// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_GROUND_LEVEL_SCOUTING_AND_BUILD_CANDIDATE_TNT_v1
// Owns: H-Earth ground-level scouting route presentation.
// Does not own: Manor placement, Estate placement, bridge placement, or Globe selector mutation.

import {
  H_EARTH_GROUND_SCOUT_VERSION,
  H_EARTH_GROUND_SCOUT_CONTRACT,
  createHEarthGroundScout,
  gradeBuildCandidateRegion
} from "/assets/h-earth/h-earth.ground.scout.js?v=h-earth-ground-scout-v1";

import {
  H_EARTH_TERRAIN_CLASSIFIER_VERSION,
  TERRAIN_CLASSES,
  BUILD_CANDIDATE_GRADES
} from "/assets/h-earth/h-earth.terrain.classifier.js?v=h-earth-terrain-classifier-v1";

const CONTRACT = "H_EARTH_GROUND_LEVEL_SCOUTING_AND_BUILD_CANDIDATE_TNT_v1";

const state = {
  scout: null,
  selectedRegionId: null,
  canvas: null,
  ctx: null,
  raf: 0,
  time: 0,
  dpr: 1,
  width: 0,
  height: 0
};

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
    route: "/showroom/globe/h-earth/",
    groundLevelScouting: "true",
    buildCandidateAnalysis: "true",
    manorPlacementAuthorized: "false",
    estatePlacementAuthorized: "false",
    bridgePlacementAuthorized: "false",
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

function renderRegionCards() {
  const mount = qs("[data-region-list]");
  if (!mount || !state.scout) return;

  mount.innerHTML = state.scout.regions.map((region) => {
    const selected = region.id === state.selectedRegionId;
    const grade = region.buildability.grade.key;

    return `
      <button
        class="region-card ${selected ? "is-selected" : ""}"
        type="button"
        data-region-card="${region.id}"
        aria-pressed="${selected ? "true" : "false"}"
      >
        <span class="region-topline">
          <span>${region.id}</span>
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
      <p class="eyebrow compact">Selected scouting region</p>
      <h2>${region.name}</h2>
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
      <strong>Authorization status</strong>
      <span>Manor placement: HOLD</span>
      <span>Estate placement: HOLD</span>
      <span>Diamond Gate Bridge placement: HOLD</span>
    </div>
  `;

  drawScoutViewport(region);
}

function renderSummary() {
  const scout = state.scout;
  if (!scout) return;

  const summaryMount = qs("[data-scout-summary]");
  if (summaryMount) {
    summaryMount.innerHTML = `
      <div><strong>${scout.summary.totalRegions}</strong><span>Regions</span></div>
      <div><strong>${scout.summary.primaryCandidates}</strong><span>A candidates</span></div>
      <div><strong>${scout.summary.supportCandidates}</strong><span>B candidates</span></div>
      <div><strong>${scout.summary.noBuildRegions}</strong><span>No-build</span></div>
    `;
  }

  const bestMount = qs("[data-best-candidate]");
  if (bestMount) {
    bestMount.textContent = scout.summary.bestCandidateName;
  }
}

function selectRegion(regionId) {
  state.selectedRegionId = regionId;
  renderRegionCards();
  renderSelectedRegion();
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
  land.addColorStop(0, "rgba(126,111,68,0.92)");
  land.addColorStop(0.52, "rgba(54,75,62,0.94)");
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
  setMarkers();

  state.scout = createHEarthGroundScout();
  state.selectedRegionId = state.scout.bestCandidate?.id || state.scout.regions[0]?.id || null;
  state.canvas = qs("[data-ground-scout-canvas]");
  state.ctx = state.canvas?.getContext("2d", { alpha: false }) || null;

  renderSummary();
  renderRegionCards();
  renderSelectedRegion();

  if (!state.raf && state.canvas && state.ctx) {
    state.raf = requestAnimationFrame(tick);
  }

  window.DGBHEarthGroundScout = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        target: "H-Earth",
        route: "/showroom/globe/h-earth/",
        groundLevelScouting: true,
        buildCandidateAnalysis: true,
        manorPlacementAuthorized: false,
        estatePlacementAuthorized: false,
        bridgePlacementAuthorized: false,
        orbitalBaselinePreserved: true,
        globeSelectorMutated: false,
        mapFlattening: false,
        transitionPath: "orbital → regional → terrain → build-candidate → estate authorization",
        scoutVersion: H_EARTH_GROUND_SCOUT_VERSION,
        classifierVersion: H_EARTH_TERRAIN_CLASSIFIER_VERSION,
        regionCount: state.scout?.summary.totalRegions || 0,
        primaryCandidates: state.scout?.summary.primaryCandidates || 0,
        supportCandidates: state.scout?.summary.supportCandidates || 0,
        noBuildRegions: state.scout?.summary.noBuildRegions || 0,
        selectedRegionId: state.selectedRegionId,
        bestCandidate: state.scout?.summary.bestCandidateName || "None proven",
        terrainClasses: Object.keys(TERRAIN_CLASSES),
        buildCandidateGrades: Object.keys(BUILD_CANDIDATE_GRADES)
      });
    }
  });

  return window.DGBHEarthGroundScout;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHEarthGroundScout, { once: true });
} else {
  initHEarthGroundScout();
}

export { initHEarthGroundScout };
export default initHEarthGroundScout;
