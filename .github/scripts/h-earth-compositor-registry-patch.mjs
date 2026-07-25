import fs from 'node:fs';

const priorOverlayPath =
  'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.public-route-interaction-scope-reconciliation.js';
const newOverlayPath =
  'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.compositor-camera-authority-scope-reconciliation.js';
const loaderPath =
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js';
const auditPath =
  'tools/h-earth-post-merge-scope-disposition-audit.mjs';

let overlay = fs.readFileSync(priorOverlayPath, 'utf8');

const replacements = [
  [
    'H_EARTH_REPOSITORY_REGISTRY_PUBLIC_ROUTE_INTERACTION_SCOPE_RECONCILIATION_v1',
    'H_EARTH_REPOSITORY_REGISTRY_COMPOSITOR_CAMERA_AUTHORITY_SCOPE_RECONCILIATION_v1'
  ],
  [
    "import baseFacade from './h-earth.repository-registry.renderer-presentation-scope-reconciliation.js';",
    "import baseFacade from './h-earth.repository-registry.public-route-interaction-scope-reconciliation.js';"
  ],
  [
    'agent/h-earth-public-route-registry-scope-reconciliation-001',
    'agent/h-earth-compositor-registry-scope-reconciliation-001'
  ],
  [
    'PUBLIC_ROUTE_INTERACTION',
    'COMPOSITOR_CAMERA_AUTHORITY'
  ],
  [
    'public-route-interaction',
    'compositor-camera-authority'
  ],
  [
    'Public Route Interaction',
    'Compositor Camera Authority'
  ],
  [
    'public route interaction',
    'compositor camera authority'
  ],
  [
    'public route orchestration file',
    'compositor camera-authority file'
  ],
  [
    'public route orchestration',
    'compositor camera authority'
  ],
  [
    'public route',
    'compositor camera boundary'
  ],
  [
    '/showroom/globe/h-earth/index.js',
    '/showroom/globe/h-earth/compositor.js'
  ],
  [
    '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.public-route-interaction-scope-reconciliation.js',
    '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.compositor-camera-authority-scope-reconciliation.js'
  ],
  [
    'a74364ad75dca8b8fab069026d181b5e64bdd007',
    '480cd4519a4d3cc364be4b16acc7791aadb5071c'
  ],
  [
    'CURRENT_MAIN=691346d3f0dbe8e16f46c705a78d26f63c733d1b',
    'CURRENT_MAIN=27256abbbd508ff33b05966104eb26c3e73dfe97'
  ],
  [
    'INDEX_GIT_BLOB=480cd4519a4d3cc364be4b16acc7791aadb5071c',
    'COMPOSITOR_GIT_BLOB=480cd4519a4d3cc364be4b16acc7791aadb5071c'
  ],
  [
    'H_EARTH_3D_INDEX_BOOTSTRAP_FILE_RENEWAL_STEP_034Q_BRANCH_SPECIFIC_DEPLOYED_MODULE_RESPONSE_DIAGNOSTICS_v1',
    'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1'
  ],
  [
    'LANDWARD_ENTRY_LIVE_PROBE_ARTIFACT_8624145551',
    'TOUCH_CAMERA_LIVE_PROBE_ARTIFACT_8624691350'
  ],
  [
    'EXECUTED_LANDWARD_ENTRY_DEPLOYMENT_PROBE',
    'EXECUTED_TOUCH_CAMERA_DEPLOYMENT_PROBE'
  ],
  [
    'CURRENT_MAIN_PUBLIC_ROUTE_SOURCE_CUSTODY',
    'CURRENT_MAIN_COMPOSITOR_SOURCE_CUSTODY'
  ],
  [
    'PUBLIC_STAGE_RENDERER_MOUNTED_EVIDENCE',
    'PUBLIC_STAGE_RENDERER_MOUNTED_AND_TOUCH_CAMERA_EVIDENCE'
  ],
  [
    'NO_CAMERA_STATE_OWNERSHIP_CREATED',
    'NO_COMPOSITOR_CAMERA_MUTATION_AUTHORITY_CREATED'
  ],
  [
    'NO_ROUTE_SOURCE_MUTATION_AUTHORITY_CREATED',
    'NO_COMPOSITOR_SOURCE_MUTATION_AUTHORITY_CREATED'
  ],
  [
    'PATH_REGISTRATION_DOES_NOT_AUTHORIZE_ROUTE_MUTATION',
    'PATH_REGISTRATION_DOES_NOT_AUTHORIZE_COMPOSITOR_MUTATION'
  ],
  [
    'PUBLIC_ROUTE_SOURCE_MUTATION_WITHOUT_SEPARATE_AUTHORIZATION',
    'COMPOSITOR_SOURCE_MUTATION_WITHOUT_SEPARATE_AUTHORIZATION'
  ],
  [
    'STOP_IF_PUBLIC_ROUTE_PATH_REMAINS_UNRESOLVED',
    'STOP_IF_COMPOSITOR_PATH_REMAINS_UNRESOLVED'
  ],
  [
    'STOP_BEFORE_ROUTE_MUTATION_WITHOUT_SEPARATE_AUTHORIZATION',
    'STOP_BEFORE_COMPOSITOR_MUTATION_WITHOUT_SEPARATE_AUTHORIZATION'
  ]
];

for (const [from, to] of replacements) {
  overlay = overlay.replaceAll(from, to);
}

if (!overlay.includes("import baseFacade from './h-earth.repository-registry.public-route-interaction-scope-reconciliation.js';")) {
  throw new Error('COMPOSITOR_OVERLAY_BASE_CHAIN_NOT_ESTABLISHED');
}
if (!overlay.includes('/showroom/globe/h-earth/compositor.js')) {
  throw new Error('COMPOSITOR_PATH_NOT_REGISTERED');
}
if (!overlay.includes('H_EARTH_COMPOSITOR_CAMERA_AUTHORITY_SCOPE_PACKAGE')) {
  throw new Error('COMPOSITOR_NODE_ID_NOT_ESTABLISHED');
}

fs.writeFileSync(newOverlayPath, overlay, 'utf8');

let loader = fs.readFileSync(loaderPath, 'utf8');
loader = loader.replace(
  '// audit-continuity, renderer-presentation, and public-route-interaction overlays.',
  '// audit-continuity, renderer-presentation, public-route-interaction, and compositor-camera-authority overlays.'
);
loader = loader.replace(
  "import registryFacade from './accepted-amendments/h-earth.repository-registry.public-route-interaction-scope-reconciliation.js';",
  "import registryFacade from './accepted-amendments/h-earth.repository-registry.compositor-camera-authority-scope-reconciliation.js';"
);
if (!loader.includes('compositor-camera-authority-scope-reconciliation.js')) {
  throw new Error('LOADER_NOT_ADVANCED');
}
fs.writeFileSync(loaderPath, loader, 'utf8');

let audit = fs.readFileSync(auditPath, 'utf8');
audit = audit.replace(
  "'./accepted-amendments/h-earth.repository-registry.public-route-interaction-scope-reconciliation.js'",
  "'./accepted-amendments/h-earth.repository-registry.compositor-camera-authority-scope-reconciliation.js'"
);
audit = audit.replace(
  "'./accepted-amendments/h-earth.repository-registry.renderer-presentation-scope-reconciliation.js'",
  "'./accepted-amendments/h-earth.repository-registry.public-route-interaction-scope-reconciliation.js'"
);
audit = audit.replace(
  'H_EARTH_PR79_POST_MERGE_SCOPE_DISPOSITION_RETAINED_STATE_AUDIT_RECEIPT_v5',
  'H_EARTH_PR79_POST_MERGE_SCOPE_DISPOSITION_RETAINED_STATE_AUDIT_RECEIPT_v6'
);
audit = audit.replace(
  'H_EARTH_RETAINED_STATE_LOADER_CONTINUITY_RENEWAL_v3',
  'H_EARTH_RETAINED_STATE_LOADER_CONTINUITY_RENEWAL_v4'
);
if (!audit.includes('compositor-camera-authority-scope-reconciliation.js')) {
  throw new Error('AUDIT_CONTINUITY_NOT_ADVANCED');
}
fs.writeFileSync(auditPath, audit, 'utf8');
