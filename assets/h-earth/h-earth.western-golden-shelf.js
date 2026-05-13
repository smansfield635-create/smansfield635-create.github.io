// /assets/h-earth/h-earth.western-golden-shelf.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_WESTERN_GOLDEN_SHELF_ESTATE_AUTHORIZATION_TNT_v1
// Owns: Western Golden Shelf estate-authorization analysis.
// Does not own: Manor placement, Estate placement, Diamond Gate Bridge placement, roads, cities, or final architecture.

export const H_EARTH_WESTERN_GOLDEN_SHELF_VERSION = "h-earth-western-golden-shelf-estate-authorization-v1";
export const H_EARTH_WESTERN_GOLDEN_SHELF_CONTRACT = "H_EARTH_WESTERN_GOLDEN_SHELF_ESTATE_AUTHORIZATION_TNT_v1";

export const AUTHORIZATION_GATE_OUTCOMES = Object.freeze({
  AUTHORIZED_FOR_NEXT_PLANNING: "AUTHORIZED_FOR_NEXT_PLANNING",
  REVIEW_REQUIRED: "REVIEW_REQUIRED",
  HELD: "HELD"
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function roundScore(value) {
  return Math.round(clamp(value, 0, 1) * 100) / 100;
}

function proofStatus(score) {
  if (score >= 0.74) return "PASS";
  if (score >= 0.56) return "REVIEW";
  return "FAIL";
}

function createProofArea({
  key,
  title,
  score,
  summary,
  findings,
  requiredBeforePlacement = []
}) {
  const normalizedScore = roundScore(score);
  const status = proofStatus(normalizedScore);

  return Object.freeze({
    key,
    title,
    score: normalizedScore,
    status,
    summary,
    findings: Object.freeze(findings),
    requiredBeforePlacement: Object.freeze(requiredBeforePlacement)
  });
}

const WESTERN_GOLDEN_SHELF_SITE = Object.freeze({
  id: "HE-R01",
  key: "western-golden-shelf",
  name: "Western Golden Shelf",
  target: "H-Earth",
  regionClass: "Primary build candidate",
  transitionPath: "H-Earth orbital baseline → Western Golden Shelf regional candidate → terrain/elevation proof → water relationship proof → arrival/bridge direction proof → estate boundary logic → Manor placement authorization",

  metrics: Object.freeze({
    terrainStability: 0.84,
    elevationLogic: 0.81,
    waterRelationship: 0.78,
    arrivalDirection: 0.83,
    estateBoundaryLogic: 0.76,
    orientationLogic: 0.79,
    foundationDryness: 0.82,
    slopeControl: 0.77,
    fractureSafety: 0.86,
    cavernSafety: 0.88,
    waterAccess: 0.74,
    scenicValue: 0.86,
    expansionRoom: 0.82,
    bridgeApproachPotential: 0.79,
    protectedZoneClarity: 0.72
  }),

  zones: Object.freeze({
    coreBuildZone: Object.freeze({
      label: "Core build zone",
      role: "Future Manor/Estate planning center after authorization",
      placementAuthorized: false,
      description: "Dry elevated terrace with the strongest foundation read."
    }),
    expansionRing: Object.freeze({
      label: "Expansion ring",
      role: "Future Estate growth and support fields",
      placementAuthorized: false,
      description: "Outer shelf area with room for later structured development."
    }),
    scenicSupportZone: Object.freeze({
      label: "Scenic support zone",
      role: "View, vegetation, slope, and terrain drama",
      placementAuthorized: false,
      description: "High-view and shoreline-adjacent terrain that supports desirability without becoming the foundation core."
    }),
    protectedWaterZone: Object.freeze({
      label: "Protected water / ecological zone",
      role: "No-build water edge and habitat protection",
      placementAuthorized: false,
      description: "Coastal and wet-edge terrain remains protected from foundation placement."
    }),
    noBuildRiskZone: Object.freeze({
      label: "No-build fracture / wet-edge zone",
      role: "Foundation exclusion",
      placementAuthorized: false,
      description: "Any wet, fractured, unstable, or collapse-risk terrain remains excluded."
    })
  }),

  orientation: Object.freeze({
    likelyFacingDirection: "West-southwest",
    viewAxis: "Toward the waterline and western horizon",
    waterAxis: "Lower coastal transition below the shelf",
    sunLightAxis: "Warm western light across the shelf face",
    arrivalAxis: "Clean western approach from water and shelf edge",
    bridgeDirection: "Future bridge approach may enter from the west / southwest after separate authorization",
    manorPlacementAuthorized: false
  })
});

export function getWesternGoldenShelfProofAreas() {
  const m = WESTERN_GOLDEN_SHELF_SITE.metrics;

  return Object.freeze([
    createProofArea({
      key: "terrain-stability",
      title: "Terrain stability",
      score: (m.terrainStability + m.foundationDryness + m.slopeControl + m.fractureSafety + m.cavernSafety) / 5,
      summary: "The shelf reads as dry, elevated, and structurally continuous enough for the next planning stage.",
      findings: [
        "Dry elevated shelf is present.",
        "Slope remains low-to-moderate.",
        "Fracture and cavern risk are both low under current scouting evidence.",
        "No cliff-edge foundation problem is currently controlling the candidate."
      ],
      requiredBeforePlacement: [
        "Confirm subsurface stability in a later placement packet.",
        "Keep cliff and fracture edges outside the future foundation zone."
      ]
    }),

    createProofArea({
      key: "elevation-logic",
      title: "Elevation logic",
      score: (m.elevationLogic + m.foundationDryness + m.slopeControl + m.protectedZoneClarity) / 4,
      summary: "The site can separate upper shelf, buildable terrace, coastal transition, wet edge, and scenic high-view terrain.",
      findings: [
        "Upper shelf can act as the future planning anchor.",
        "Buildable terrace is distinct from the lower coastal transition.",
        "Wet edge remains separable as a no-build/protected zone.",
        "Scenic high-view terrain is present without needing to become the foundation core."
      ],
      requiredBeforePlacement: [
        "Define exact terrace boundary in the future Estate boundary sketch.",
        "Keep the lower coastal transition outside the first foundation core."
      ]
    }),

    createProofArea({
      key: "water-relationship",
      title: "Water relationship",
      score: (m.waterRelationship + m.waterAccess + m.foundationDryness + m.protectedZoneClarity) / 4,
      summary: "Water is close enough to support beauty, access, life, and arrival logic without swallowing the build zone.",
      findings: [
        "Water direction is visible from the shelf.",
        "Beach/coastal access supports desirability.",
        "Hydration supports life without becoming the foundation layer.",
        "No deep wetland foundation risk controls the core shelf."
      ],
      requiredBeforePlacement: [
        "Confirm safe distance from wet edge.",
        "Preserve ecological and shoreline zones as protected no-build terrain."
      ]
    }),

    createProofArea({
      key: "arrival-direction",
      title: "Arrival and bridge-direction proof",
      score: (m.arrivalDirection + m.bridgeApproachPotential + m.scenicValue + m.slopeControl) / 4,
      summary: "The western approach has strong ceremonial and practical value for future arrival planning.",
      findings: [
        "Western approach reads cleanly.",
        "First horizon line is coherent.",
        "Bridge approach possibility exists but remains unplaced.",
        "Ceremonial entry potential is strong."
      ],
      requiredBeforePlacement: [
        "Future packet must authorize bridge approach planning separately.",
        "No bridge object may be placed in this pass."
      ]
    }),

    createProofArea({
      key: "estate-boundary-logic",
      title: "Estate boundary logic",
      score: (m.estateBoundaryLogic + m.expansionRoom + m.protectedZoneClarity + m.scenicValue) / 4,
      summary: "The shelf can support a future boundary model with core, expansion, scenic, protected, and no-build zones.",
      findings: [
        "Core build zone can be separated from expansion ring.",
        "Scenic support zone has value without becoming the foundation.",
        "Protected water/ecological zone can be preserved.",
        "No-build fracture and wet-edge zones remain excluded."
      ],
      requiredBeforePlacement: [
        "Create a future Estate boundary sketch before any architecture appears.",
        "Confirm no-build boundaries visually and structurally."
      ]
    }),

    createProofArea({
      key: "manor-orientation",
      title: "Manor orientation logic only",
      score: (m.orientationLogic + m.scenicValue + m.waterAccess + m.arrivalDirection) / 4,
      summary: "The site supports a likely future facing direction and view axis, but this is not Manor placement.",
      findings: [
        "Likely facing direction is west-southwest.",
        "Primary view axis points toward the waterline and western horizon.",
        "Arrival axis can align with the western approach.",
        "Sun/light axis supports a warm shelf-facing read."
      ],
      requiredBeforePlacement: [
        "Future packet must authorize Manor placement planning.",
        "This pass may define orientation only, not place the Manor."
      ]
    })
  ]);
}

export function evaluateWesternGoldenShelfAuthorization() {
  const proofAreas = getWesternGoldenShelfProofAreas();
  const passCount = proofAreas.filter((area) => area.status === "PASS").length;
  const reviewCount = proofAreas.filter((area) => area.status === "REVIEW").length;
  const failCount = proofAreas.filter((area) => area.status === "FAIL").length;
  const averageScore = roundScore(proofAreas.reduce((sum, area) => sum + area.score, 0) / proofAreas.length);

  let authorizationGate = AUTHORIZATION_GATE_OUTCOMES.HELD;

  if (failCount > 0) {
    authorizationGate = AUTHORIZATION_GATE_OUTCOMES.HELD;
  } else if (passCount >= 5 && averageScore >= 0.74) {
    authorizationGate = AUTHORIZATION_GATE_OUTCOMES.AUTHORIZED_FOR_NEXT_PLANNING;
  } else {
    authorizationGate = AUTHORIZATION_GATE_OUTCOMES.REVIEW_REQUIRED;
  }

  return Object.freeze({
    contract: H_EARTH_WESTERN_GOLDEN_SHELF_CONTRACT,
    version: H_EARTH_WESTERN_GOLDEN_SHELF_VERSION,
    target: "H-Earth",
    selectedRegion: WESTERN_GOLDEN_SHELF_SITE.name,
    selectedRegionKey: WESTERN_GOLDEN_SHELF_SITE.key,
    westernGoldenShelfSelected: true,
    estateAuthorizationAnalysis: true,

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

    authorizationGate,
    authorizedForNextPlanning: authorizationGate === AUTHORIZATION_GATE_OUTCOMES.AUTHORIZED_FOR_NEXT_PLANNING,

    proofAreas,
    proofSummary: Object.freeze({
      passCount,
      reviewCount,
      failCount,
      averageScore,
      totalProofAreas: proofAreas.length
    }),

    site: WESTERN_GOLDEN_SHELF_SITE,
    nextEligiblePlanning: Object.freeze({
      manorPlacementPlanning: authorizationGate === AUTHORIZATION_GATE_OUTCOMES.AUTHORIZED_FOR_NEXT_PLANNING,
      estateBoundarySketch: authorizationGate === AUTHORIZATION_GATE_OUTCOMES.AUTHORIZED_FOR_NEXT_PLANNING,
      bridgeApproachPlanning: authorizationGate === AUTHORIZATION_GATE_OUTCOMES.AUTHORIZED_FOR_NEXT_PLANNING,
      actualPlacementStillRequiresFuturePacket: true
    })
  });
}

export function createWesternGoldenShelfAuthorization() {
  return evaluateWesternGoldenShelfAuthorization();
}

export default createWesternGoldenShelfAuthorization;
