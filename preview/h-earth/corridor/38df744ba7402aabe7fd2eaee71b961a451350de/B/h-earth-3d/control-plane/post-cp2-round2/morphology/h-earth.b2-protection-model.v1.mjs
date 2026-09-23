import b0 from './h-earth.b0-morphology-baseline-freeze.v1.mjs';
import b1 from './h-earth.b1-morphology-descriptor-baseline.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_B2_PROTECTION_MODEL_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_B2_PROTECTION_MODEL_v1',
  checkpoint: 'B2',
  status: 'P0_P1_P2_PROTECTION_MODEL_ONLY',
  controllingB1Merge: '88845ce8b221490d5800f44f8c3b86269b46442f',
  b0AuthorityId: b0.schemaVersion,
  b1AuthorityId: b1.schemaVersion,
  b1BaselineDigest: 'fnv1a32:513f79fa',
  grid: {
    width: 129,
    height: 97,
    xMinimum: -256,
    xMaximum: 256,
    zMinimum: -320,
    zMaximum: 64,
    cellWorldUnits: 4
  },
  p0: {
    heightDelta: 'EXACTLY_ZERO',
    worldBoundaryLines: true,
    shorelineRule: 'HEIGHT_SIGN_CHANGE_OR_ABSOLUTE_ELEVATION_WITHIN_0_40',
    navigationChunkBoundaryX: [-256, -128, 0, 128, 256],
    navigationChunkBoundaryZ: [-320, -256, -210, -125, -80, 20, 64],
    acceptedWaypointAnchors: [
      { id: 'COAST', x: 0, z: -96 },
      { id: 'BERM', x: 0, z: -132 },
      { id: 'LOWLAND', x: -42, z: -158 },
      { id: 'HILL', x: 72, z: -172 },
      { id: 'RIDGE', x: 145, z: -225 }
    ],
    manorAnchors: [
      { id: 'MANOR_CENTER', x: 80, z: -172 },
      { id: 'MANOR_NW', x: 64, z: -188 },
      { id: 'MANOR_NE', x: 96, z: -188 },
      { id: 'MANOR_SW', x: 64, z: -156 },
      { id: 'MANOR_SE', x: 96, z: -156 }
    ],
    cavernAnchors: [
      { id: 'CAVERN_FACE', x: 40, z: -284 },
      { id: 'CAVERN_APRON', x: 48, z: -284 },
      { id: 'CAVERN_PRECINCT_CENTER', x: 56, z: -284 }
    ],
    exactContractAnchors: [
      { id: 'LOWER_CORRIDOR_ORIGIN', x: 112.41666666666667, z: -194.83333333333334 }
    ]
  },
  p1: {
    bufferWidthCells: 2,
    bufferWidthWorldUnits: 8,
    distanceLaw: 'EUCLIDEAN_GRID_DISTANCE_FROM_P0_LESS_THAN_OR_EQUAL_TO_2',
    minimumHeightFidelityWeight: 0.90,
    maximumEditableWeight: 0.10
  },
  p2: {
    relationallyProtectedButEditable: true,
    manorEnvelope: { xMinimum: 64, xMaximum: 96, zMinimum: -188, zMaximum: -156 },
    cavernRelation: {
      face: { x: 40, z: -284 },
      apron: { x: 48, z: -284 },
      precinctCenter: { x: 56, z: -284 },
      localCorrectionRadiusWorldUnits: 16
    },
    ravineRelation: { xMinimum: 22, xMaximum: 58, zMinimum: -292, zMaximum: -210 },
    lowerCorridor: {
      origin: { x: 112.41666666666667, z: -194.83333333333334 },
      noBuildHalfWidthWorldUnits: 6
    },
    traversalCorridorHalfWidthWorldUnits: 8,
    approachViewshedHalfWidthWorldUnits: 12,
    maximumHardness: 0.72,
    minimumEditableWeight: 0.28
  },
  hardnessLaw: {
    p0: 1,
    p1: 0.92,
    p2Minimum: 0.58,
    p2Maximum: 0.72,
    freeBase: 0.82,
    hotspotReduction: 0.72,
    freeMinimum: 0.10,
    editableWeight: 'ONE_MINUS_HARDNESS',
    protectedAuthorityDominatesHotspot: true
  },
  permanentSceneApproaches: [
    { id: 'SCENE_01', camera: { x: 32, z: -172 }, target: { x: 80, z: -172 } },
    { id: 'SCENE_02', camera: { x: 56, z: -184 }, target: { x: 80, z: -172 } },
    { id: 'SCENE_03', camera: { x: 80, z: -172 }, target: { x: 56, z: -184 } },
    { id: 'SCENE_04', camera: { x: 68, z: -156 }, target: { x: 92, z: -156 } },
    { id: 'SCENE_05', camera: { x: 40, z: -248 }, target: { x: 40, z: -284 } },
    { id: 'SCENE_06', camera: { x: 0, z: -96 }, target: { x: 0, z: -172 } },
    { id: 'SCENE_07', camera: { x: 48, z: -172 }, target: { x: 80, z: -172 } },
    { id: 'SCENE_08', camera: { x: 40, z: -248 }, target: { x: 40, z: -284 } }
  ],
  exactPathScope: [
    '.github/workflows/h-earth-b2-protection-model.yml',
    'h-earth-3d/analysis/morphology/h-earth.b2-protection-model.v1.mjs',
    'h-earth-3d/control-plane/post-cp2-round2/morphology/h-earth.b2-protection-model.v1.mjs',
    'h-earth-3d/validation/morphology/h-earth.b2-protection-model.mjs'
  ],
  gates: {
    independentBuilds: 2,
    exactDigestIdentity: true,
    allP0AnchorsResolved: true,
    p0P1Disjoint: true,
    p0P2OverlapAllowed: true,
    minimumEditableCellFraction: 0.20,
    minimumHotspotEditableCellFraction: 0.20,
    maximumP0CellFraction: 0.35,
    allWeightsFiniteAndBounded: true
  },
  boundaries: {
    productMutationPerformed: false,
    heightfieldMutationPerformed: false,
    probeGenerationStarted: false,
    liveRouteChanged: false,
    stop: 'STOP_BEFORE_B3_TWO_FIXED_CAUSAL_PROBES'
  },
  result: 'B2_PROTECTION_MODEL_PASS_CLOSED'
});

export default H_EARTH_B2_PROTECTION_MODEL_v1;
