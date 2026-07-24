import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  H_EARTH_3D_CAMERA_CAPACITY,
  H_EARTH_3D_CAMERA_COMPOSITION_INTENT,
  H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID,
  H_EARTH_3D_CAPACITY_CONTRACT,
  H_EARTH_3D_CAPACITY_PREFLIGHT,
  H_EARTH_3D_CAPACITY_RECEIPT,
  H_EARTH_3D_LIVING_PRESENTATION_CAPACITY,
  H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID,
  evaluateHEarth3DCameraCapacity,
  getHEarth3DCapacityContract,
  getHEarth3DCapacityReceipt
} from '../showroom/globe/h-earth/capacity.js';

import {
  H_EARTH_3D_SHARED_SHORELINE_BOUNDARY as shorelineBoundary
} from '../showroom/globe/h-earth/environment.js';

import {
  H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_OBJECT_IDS,
  previewHEarthMinimumShorelineGeometry
} from '../showroom/globe/h-earth/render/shoreline-preview.js';

import {
  H_EARTH_3D_COMPOSITOR_CONTRACT_ID
} from '../showroom/globe/h-earth/compositor.js';

import {
  H_EARTH_3D_RENDERER_CONTRACT_ID
} from '../showroom/globe/h-earth/renderer.js';

const root =
  path.resolve(
    path.dirname(
      fileURLToPath(import.meta.url)
    ),
    '..'
  );

const checks = [];

function pass(
  id,
  condition,
  details = null
) {
  assert.equal(
    Boolean(condition),
    true,
    id
  );

  checks.push({
    id,
    passed: true,
    details
  });
}

function git(...args) {
  return execFileSync(
    'git',
    args,
    {
      cwd: root,
      encoding: 'utf8'
    }
  ).trim();
}

const mergeBase =
  git(
    'merge-base',
    'HEAD',
    'origin/main'
  );

const canonicalCapacityBlob =
  git(
    'rev-parse',
    'HEAD:showroom/globe/h-earth/capacity.js'
  );

const preservedBaseBlob =
  git(
    'rev-parse',
    'HEAD:showroom/globe/h-earth/capacity.base.js'
  );

pass(
  'CANONICAL_CAPACITY_WRAPPER_BLOB_EXACT',
  canonicalCapacityBlob ===
    '1828db052b743f758ec58c992e612c49d95b3c80',
  canonicalCapacityBlob
);

pass(
  'PRESERVED_BASE_IMPLEMENTATION_BLOB_EXACT',
  preservedBaseBlob ===
    '887e0c469ec90e4571f5b41bc91ba8dab409aa2d',
  preservedBaseBlob
);

const geometryPaths = [
  'showroom/globe/h-earth/environment.js',
  'showroom/globe/h-earth/render/geometry-preview.js',
  'showroom/globe/h-earth/render/geometry-ground.js',
  'showroom/globe/h-earth/render/geometry-foam.js',
  'showroom/globe/h-earth/render/geometry-water.js',
  'showroom/globe/h-earth/render/shoreline-preview.js',
  'showroom/globe/h-earth/render/geometry-kernel.js',
  'showroom/globe/h-earth/render/geometry-kernel.north.js',
  'showroom/globe/h-earth/render/geometry-kernel.east.js',
  'showroom/globe/h-earth/render/geometry-kernel.south.js',
  'showroom/globe/h-earth/render/geometry-kernel.west.js',
  'showroom/globe/h-earth/admitted-geometry-frame.js'
];

execFileSync(
  'git',
  [
    'diff',
    '--exit-code',
    mergeBase,
    '--',
    ...geometryPaths
  ],
  {
    cwd: root,
    stdio: 'pipe'
  }
);

pass(
  'GEOMETRY_SOURCE_CUSTODY_UNCHANGED_FROM_MERGE_BASE',
  true,
  {
    mergeBase,
    geometryPaths
  }
);

for (
  const sourcePath
  of [
    'showroom/globe/h-earth/capacity.base.js',
    'showroom/globe/h-earth/capacity.js',
    'showroom/globe/h-earth/compositor.js',
    'showroom/globe/h-earth/renderer.js'
  ]
) {
  execFileSync(
    process.execPath,
    [
      '--experimental-default-type=module',
      '--check',
      sourcePath
    ],
    {
      cwd: root,
      stdio: 'pipe'
    }
  );

  pass(
    `SOURCE_SYNTAX_${sourcePath.replaceAll('/', '_').replaceAll('.', '_')}`,
    true
  );
}

const camera =
  H_EARTH_3D_CAMERA_CAPACITY
    .initialProjectionCandidate;

const shorelineZ =
  shorelineBoundary.samples.reduce(
    (
      sum,
      sample
    ) =>
      sum + sample.z,
    0
  ) /
  shorelineBoundary.samples.length;

pass(
  'CAMERA_ENVELOPE_IDENTITY_EXACT',
  H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID ===
    'H_EARTH_LANDWARD_GROUND_INSPECTION_CAMERA_ENVELOPE_v1'
);

pass(
  'CAMERA_POSITION_EXACT',
  camera.position.x === 0 &&
    camera.position.y === 14 &&
    camera.position.z === -240,
  camera.position
);

pass(
  'CAMERA_TARGET_EXACT',
  camera.target.x === 0 &&
    camera.target.y === 0.6 &&
    camera.target.z === -48,
  camera.target
);

pass(
  'CAMERA_LENS_EXACT',
  camera.verticalFovDegrees === 60 &&
    camera.nearPlane === 0.25 &&
    camera.farPlane === 512,
  {
    verticalFovDegrees:
      camera.verticalFovDegrees,
    nearPlane:
      camera.nearPlane,
    farPlane:
      camera.farPlane
  }
);

pass(
  'CAMERA_IS_LANDWARD_AND_TARGET_IS_WATERWARD',
  camera.position.z < shorelineZ &&
    camera.target.z > shorelineZ,
  { shorelineZ }
);

pass(
  'CAMERA_COMPOSITION_INTENT_EXACT',
  H_EARTH_3D_CAMERA_COMPOSITION_INTENT
    .compositionRole ===
      'LANDWARD_GROUND_INSPECTION_LOOKING_WATERWARD' &&
    H_EARTH_3D_CAMERA_COMPOSITION_INTENT
      .admittedGeometryMutationPermitted === false &&
    H_EARTH_3D_CAMERA_COMPOSITION_INTENT
      .futureContextDepthReserved === true
);

const cameraEvaluation =
  evaluateHEarth3DCameraCapacity({
    yawDegrees: 0,
    pitchDegrees: 0,
    zoomScale: 1,
    target: camera.target,
    verticalFovDegrees:
      camera.verticalFovDegrees,
    nearPlane:
      camera.nearPlane,
    farPlane:
      camera.farPlane
  });

pass(
  'CAMERA_CAPACITY_EVALUATION_PASS',
  cameraEvaluation.eligible === true &&
    cameraEvaluation.adjustmentRequired === false,
  cameraEvaluation
);

const subtract = (
  left,
  right
) => ({
  x: left.x - right.x,
  y: left.y - right.y,
  z: left.z - right.z
});

const dot = (
  left,
  right
) =>
  left.x * right.x +
  left.y * right.y +
  left.z * right.z;

const cross = (
  left,
  right
) => ({
  x:
    left.y * right.z -
    left.z * right.y,
  y:
    left.z * right.x -
    left.x * right.z,
  z:
    left.x * right.y -
    left.y * right.x
});

const normalize = (vector) => {
  const length =
    Math.hypot(
      vector.x,
      vector.y,
      vector.z
    );

  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
};

const forward =
  normalize(
    subtract(
      camera.target,
      camera.position
    )
  );

const right =
  normalize(
    cross(
      forward,
      camera.up
    )
  );

const resolvedUp =
  normalize(
    cross(
      right,
      forward
    )
  );

pass(
  'CAMERA_FORWARD_VECTOR_WATERWARD',
  forward.z > 0.99,
  forward
);

function project(
  point,
  aspectRatio
) {
  const relative =
    subtract(
      point,
      camera.position
    );

  const depth =
    dot(
      relative,
      forward
    );

  const tanVertical =
    Math.tan(
      camera.verticalFovDegrees *
        Math.PI /
        360
    );

  return {
    depth,
    normalizedX:
      dot(relative, right) /
      (
        depth *
        tanVertical *
        aspectRatio
      ),
    normalizedY:
      dot(relative, resolvedUp) /
      (
        depth *
        tanVertical
      )
  };
}

const compositionAnchors = {
  foregroundWetSand: {
    x: 0,
    y: 0,
    z: -210
  },
  shorelineContact: {
    x: 0,
    y: 0.79,
    z: shorelineZ
  },
  waterSurface: {
    x: 0,
    y: 0.68,
    z: -48
  },
  futureContextDepth: {
    x: 0,
    y: 10,
    z: 192
  }
};

for (
  const [
    anchorName,
    anchor
  ]
  of Object.entries(
    compositionAnchors
  )
) {
  for (const aspectRatio of [0.5625, 1.6]) {
    const projected =
      project(
        anchor,
        aspectRatio
      );

    pass(
      `ANCHOR_${anchorName.toUpperCase()}_${String(aspectRatio).replace('.', '_')}_VISIBLE`,
      projected.depth >=
        camera.nearPlane &&
        projected.depth <=
          camera.farPlane &&
        Math.abs(
          projected.normalizedX
        ) <= 1 &&
        Math.abs(
          projected.normalizedY
        ) <= 1,
      projected
    );
  }
}

pass(
  'LIVING_PRESENTATION_CAPACITY_IDENTITY_EXACT',
  H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID ===
    'H_EARTH_MINIMUM_SHORELINE_LIVING_PRESENTATION_CAPACITY_v1'
);

pass(
  'LIVING_PRESENTATION_CAPACITY_FROZEN',
  Object.isFrozen(
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY
  ) &&
    Object.isFrozen(
      H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.scheduler
    ) &&
    Object.isFrozen(
      H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.geometryBoundary
    )
);

pass(
  'ANIMATION_SCHEDULER_BOUNDED',
  H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.scheduler
    .singleCoordinatorRequired === true &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.scheduler
      .maximumActiveFramesPerSecond === 30 &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.scheduler
      .maximumMainThreadWorkMillisecondsPerFrame === 8 &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.scheduler
      .duplicateAnimationLoopsPermitted === false
);

pass(
  'ANIMATION_SUSPENSION_REQUIRED',
  H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.suspension
    .suspendWhenDocumentHidden === true &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.suspension
      .suspendWhenStageOffscreen === true &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.suspension
      .backgroundAnimationWorkPermitted === false
);

pass(
  'REDUCED_MOTION_STATIC_EQUIVALENT_REQUIRED',
  H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.reducedMotion
    .staticEquivalentRequired === true &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.reducedMotion
      .animationLoopsMustStop === true &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.reducedMotion
      .timersMustStop === true
);

pass(
  'ADMITTED_GEOMETRY_MUTATION_PROHIBITED',
  H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.geometryBoundary
    .admittedGeometryMutationPermitted === false &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.geometryBoundary
      .admittedVertexMutationPermitted === false &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.geometryBoundary
      .admittedIndexMutationPermitted === false &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.geometryBoundary
      .sharedShorelineBoundaryMutationPermitted === false
);

pass(
  'ANIMATION_RUNTIME_AND_SIMULATION_WITHHELD',
  H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.claimCeilings
    .animationRuntimeCreated === false &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.claimCeilings
      .animationExecuted === false &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.claimCeilings
      .fluidSimulationCreated === false &&
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY.claimCeilings
      .physicalWaveSimulationCreated === false
);

pass(
  'CAPACITY_CONTRACT_USES_CORRECTED_CAMERA',
  H_EARTH_3D_CAPACITY_CONTRACT.cameraCapacity ===
    H_EARTH_3D_CAMERA_CAPACITY &&
    getHEarth3DCapacityContract() ===
      H_EARTH_3D_CAPACITY_CONTRACT
);

pass(
  'CAPACITY_RECEIPT_BINDS_CORRECTION',
  H_EARTH_3D_CAPACITY_RECEIPT
    .cameraEnvelopeCorrectionId ===
      H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID &&
    getHEarth3DCapacityReceipt() ===
      H_EARTH_3D_CAPACITY_RECEIPT
);

pass(
  'CAPACITY_PREFLIGHT_ELIGIBLE',
  H_EARTH_3D_CAPACITY_PREFLIGHT.eligible === true,
  H_EARTH_3D_CAPACITY_PREFLIGHT.status
);

pass(
  'COMPOSITOR_IMPORT_EXECUTED',
  H_EARTH_3D_COMPOSITOR_CONTRACT_ID ===
    'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1'
);

pass(
  'RENDERER_IMPORT_EXECUTED',
  H_EARTH_3D_RENDERER_CONTRACT_ID ===
    'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_9_ADMITTED_GEOMETRY_FRAME_MATERIALIZATION_v1'
);

const preview =
  previewHEarthMinimumShorelineGeometry({
    sourceObjectId:
      'OBJ_002_FOREGROUND_WET_SAND',
    requestedPurpose:
      'MINIMUM_NATIVE_SHORELINE_GEOMETRY_PREVIEW',
    requestId:
      'H_EARTH_CAMERA_ENVELOPE_EXECUTION_AUDIT_001',
    shorelineBoundary
  });

pass(
  'MINIMUM_SHORELINE_EXECUTION_PASS',
  preview.ok === true &&
    preview.primitives.length === 3,
  preview.issues
);

pass(
  'MINIMUM_SHORELINE_OBJECT_IDENTITIES_PRESERVED',
  JSON.stringify(
    preview.sourceObjectIds
  ) ===
    JSON.stringify(
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_OBJECT_IDS
    ),
  preview.sourceObjectIds
);

pass(
  'SHORELINE_BOUNDARY_OCCURRENCE_PRESERVED',
  preview.shorelineBoundary ===
    shorelineBoundary &&
    preview.shorelineBoundaryId ===
      shorelineBoundary.boundaryId
);

pass(
  'PREVIEW_AUTHORITY_BOUNDARIES_PRESERVED',
  preview.admitted === false &&
    preview.WestAdmissionPerformed === false &&
    preview.fluidSimulation === false
);

const receipt = {
  receiptType:
    'H_EARTH_CAMERA_ENVELOPE_AND_ANIMATION_STANDARD_EXECUTION_AUDIT',

  status:
    'PASS',

  headCommit:
    git(
      'rev-parse',
      'HEAD'
    ),

  mergeBase,

  canonicalCapacityBlob,
  preservedBaseBlob,

  checkCount:
    checks.length,

  checks,

  cameraEnvelopeId:
    H_EARTH_3D_CAMERA_ENVELOPE_CORRECTION_ID,

  camera,

  cameraCompositionIntent:
    H_EARTH_3D_CAMERA_COMPOSITION_INTENT,

  livingPresentationCapacityId:
    H_EARTH_3D_LIVING_PRESENTATION_CAPACITY_ID,

  shorelineBoundaryId:
    shorelineBoundary.boundaryId,

  sourceObjectIds:
    preview.sourceObjectIds,

  primitiveCount:
    preview.primitives.length,

  geometrySourceCustody:
    'PASS_UNCHANGED_FROM_MERGE_BASE',

  animationRuntimeCreated:
    false,

  physicalSimulationCreated:
    false,

  mainChanged:
    false,

  mergeAuthorized:
    false
};

const artifactDirectory =
  path.join(
    root,
    'artifacts'
  );

fs.mkdirSync(
  artifactDirectory,
  {
    recursive: true
  }
);

fs.writeFileSync(
  path.join(
    artifactDirectory,
    'h-earth-post-merge-scope-disposition-audit-receipt.json'
  ),
  JSON.stringify(
    receipt,
    null,
    2
  ) + '\n',
  'utf8'
);

console.log(
  `H_EARTH_CAMERA_ENVELOPE_AND_ANIMATION_STANDARD_AUDIT=PASS CHECKS=${checks.length}`
);
