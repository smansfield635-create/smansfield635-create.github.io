// /showroom/globe/h-earth/index.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_WESTERN_GOLDEN_SHELF_MANOR_GROUND_PLACEMENT_TNT_v1
// Owns: H-Earth Western Golden Shelf route presentation, authorization proof, and controlled Manor ground placement render.
// Does not own: final architecture, final Estate buildout, Diamond Gate Bridge final object, roads, or city.

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

import {
  H_EARTH_MANOR_SPEC_VERSION,
  getRichManorPlacementSpec
} from "/assets/h-earth/h-earth.manor.spec.js?v=h-earth-manor-spec-placement-adapter-v1";

import {
  H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_VERSION,
  H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_CONTRACT,
  createWesternGoldenShelfGroundRenderer
} from "/assets/h-earth/h-earth.western-golden-shelf.ground.render.js?v=h-earth-ground-render-v1";

const CONTRACT = "H_EARTH_WESTERN_GOLDEN_SHELF_MANOR_GROUND_PLACEMENT_TNT_v1";

const state = {
  scout: null,
  authorization: null,
  manorSpec: null,
  selectedRegionId: "HE-R01",
  canvas: null,
  ctx: null,
  groundCanvas: null,
  groundRenderer: null,
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
    selectedRegion: "western-golden-shelf",
    westernGoldenShelfSelected: "true",
    estateAuthorizationAnalysis: "true",
    manorGroundPlacementAuthorized: "true",
    controlledManorPlacement: "true",
    waterBehindManor: "true",
    cameraFacing: "west-southwest",
    groundRenderActive: "true",

    groundLevelScouting: "true",
    buildCandidateAnalysis: "true",
    terrainStabilityProof: "true",
    elevationLogicProof: "true",
    waterRelationshipProof: "true",
    arrivalDirectionProof: "true",
    boundaryLogicProof: "true",
    orientationLogicProof: "true",

    finalManorArchitectureAuthorized: "false",
    estateFinalizationAuthorized: "false",
    bridgeFinalizationAuthorized: "false",
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
      <strong>Placement status updated</strong>
      <span>Controlled Manor ground placement: AUTHORIZED</span>
      <span>Final Manor architecture: HOLD</span>
      <span>Final Estate / Diamond Gate Bridge: HOLD</span>
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
      <div><strong>AUTHORIZED</strong><span>Manor ground placement</span></div>
      <div><strong>WATER BEHIND</strong><span>View contract</span></div>
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
      <span class="gate-label">CONTROLLED MANOR GROUND PLACEMENT AUTHORIZED</span>
      <p>
        Western Golden Shelf has moved beyond candidate analysis into controlled Manor ground placement.
        The view is landward/eastern shelf looking west-southwest, with the water behind the Manor.
        Final Manor architecture, full Estate finalization, roads, city, and Diamond Gate Bridge final object remain held.
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
    const manor = state.manorSpec?.placement?.viewRule;

    orientationMount.innerHTML = `
      <div class="orientation-grid">
        <div><span>Facing</span><strong>${o.likelyFacingDirection}</strong></div>
        <div><span>View axis</span><strong>${o.viewAxis}</strong></div>
        <div><span>Water axis</span><strong>Behind the Manor</strong></div>
        <div><span>Camera</span><strong>${manor?.cameraSide || "landward / eastern highland side"}</strong></div>
        <div><span>Arrival</span><strong>${o.arrivalAxis}</strong></div>
        <div><span>Placement</span><strong>Controlled Manor ground placement authorized</strong></div>
      </div>
    `;
  }
}

function renderGroundPlacementInfo() {
  const mount = qs("[data-ground-placement-info]");
  if (!mount || !state.manorSpec) return;

  const spec = state.manorSpec;

  mount.innerHTML = `
    <article class="ground-placement-card">
      <h3>Placement authority</h3>
      <p>The existing Rich Manor definition is mounted onto Western Golden Shelf. This adapter does not redefine room count, acreage, vault, or internal structure.</p>

      <div class="placement-list">
        <div><span>Target</span><strong>${spec.placement.selectedRegion}, ${spec.placement.targetPlanet}</strong></div>
        <div><span>Camera</span><strong>${spec.placement.viewRule.cameraSide}</strong></div>
        <div><span>Facing</span><strong>${spec.placement.viewRule.cameraFacing}</strong></div>
        <div><span>Water relationship</span><strong>Water behind the Manor</strong></div>
        <div><span>Estate acres</span><strong>${spec.knownCanon.estateAcres}</strong></div>
        <div><span>Floors</span><strong>${spec.knownCanon.floors}</strong></div>
        <div><span>Vault</span><strong>Preserved below ground</strong></div>
        <div><span>Final architecture</span><strong>HOLD</strong></div>
      </div>
    </article>
  `;
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

function initGroundRenderer() {
  state.groundCanvas = qs("[data-manor-ground-canvas]");

  if (state.groundCanvas) {
    state.groundRenderer = createWesternGoldenShelfGroundRenderer(state.groundCanvas, {
      dpr: Math.min(window.devicePixelRatio || 1, 1.5)
    }).start();
  }
}

function initHEarthGroundScout() {
  setMarkers();

  state.scout = createHEarthGroundScout();
  state.authorization = createWesternGoldenShelfAuthorization();
  state.manorSpec = getRichManorPlacementSpec();
  state.selectedRegionId = "HE-R01";
  state.canvas = qs("[data-ground-scout-canvas]");
  state.ctx = state.canvas?.getContext("2d", { alpha: false }) || null;

  renderSummary();
  renderRegionCards();
  renderSelectedRegion();
  renderAuthorizationProof();
  renderGroundPlacementInfo();
  initGroundRenderer();

  if (!state.raf && state.canvas && state.ctx) {
    state.raf = requestAnimationFrame(tick);
  }

  window.DGBHEarthGroundScout = Object.freeze({
    status() {
      return Object.freeze({
        contract: CONTRACT,
        target: "H-Earth",
        route: "/showroom/globe/h-earth/",
        selectedRegion: "Western Golden Shelf",
        selectedRegionKey: "western-golden-shelf",
        westernGoldenShelfSelected: true,
        estateAuthorizationAnalysis: true,

        manorGroundPlacementAuthorized: true,
        controlledManorPlacement: true,
        waterBehindManor: true,
        cameraFacing: "west-southwest",
        groundRenderActive: Boolean(state.groundRenderer),

        groundLevelScouting: true,
        buildCandidateAnalysis: true,
        terrainStabilityProof: true,
        elevationLogicProof: true,
        waterRelationshipProof: true,
        arrivalDirectionProof: true,
        boundaryLogicProof: true,
        orientationLogicProof: true,

        finalManorArchitectureAuthorized: false,
        estateFinalizationAuthorized: false,
        bridgeFinalizationAuthorized: false,
        roadPlacementAuthorized: false,
        cityPlacementAuthorized: false,
        finalArchitectureAuthorized: false,

        authorizationGate: "CONTROLLED_MANOR_GROUND_PLACEMENT_AUTHORIZED",
        authorizedForNextPlanning: true,

        orbitalBaselinePreserved: true,
        globeSelectorMutated: false,
        mapFlattening: false,
        transitionPath: "H-Earth orbital baseline → Western Golden Shelf candidate → controlled Manor ground placement → ground development around and within → later Estate/Bridge finalization",

        scoutVersion: H_EARTH_GROUND_SCOUT_VERSION,
        classifierVersion: H_EARTH_TERRAIN_CLASSIFIER_VERSION,
        westernGoldenShelfVersion: H_EARTH_WESTERN_GOLDEN_SHELF_VERSION,
        westernGoldenShelfContract: H_EARTH_WESTERN_GOLDEN_SHELF_CONTRACT,
        manorSpecVersion: H_EARTH_MANOR_SPEC_VERSION,
        groundRenderVersion: H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_VERSION,
        groundRenderContract: H_EARTH_WESTERN_GOLDEN_SHELF_GROUND_RENDER_CONTRACT,

        regionCount: state.scout?.summary.totalRegions || 0,
        selectedRegionId: state.selectedRegionId,
        bestCandidate: state.authorization?.selectedRegion || "Western Golden Shelf",
        proofSummary: state.authorization?.proofSummary || null,
        terrainClasses: Object.keys(TERRAIN_CLASSES),
        buildCandidateGrades: Object.keys(BUILD_CANDIDATE_GRADES),
        groundRendererStatus: state.groundRenderer?.status?.() || null
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
