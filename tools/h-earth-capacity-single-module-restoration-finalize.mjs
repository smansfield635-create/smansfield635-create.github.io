import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = path.join(
  root,
  'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.camera-and-living-presentation-scope-reconciliation.js'
);
const receiptPath = path.join(
  root,
  'artifacts/h-earth-capacity-single-module-restoration/receipt.json'
);

function replaceExact(source, expected, replacement, identity) {
  const first = source.indexOf(expected);
  const last = source.lastIndexOf(expected);
  if (first < 0 || first !== last) {
    throw new Error(`${identity}: expected exactly one source occurrence`);
  }
  return source.slice(0, first) + replacement + source.slice(first + expected.length);
}

const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
if (receipt.result !== 'PASS' || receipt.failedChecks.length !== 0) {
  throw new Error('single-module build receipt must pass before registry reconciliation');
}

let source = fs.readFileSync(registryPath, 'utf8');

source = replaceExact(
  source,
`const BRANCH =
  'agent/h-earth-camera-envelope-animation-standard-001';`,
`const BRANCH =
  'agent/h-earth-capacity-single-module-restoration-001';`,
  'branch-identity-renewal'
);

source = replaceExact(
  source,
`  Object.freeze([
    '/showroom/globe/h-earth/capacity.js',
    '/showroom/globe/h-earth/capacity.base.js',
    '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.camera-and-living-presentation-scope-reconciliation.js'
  ]);`,
`  Object.freeze([
    '/showroom/globe/h-earth/capacity.js',
    '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.camera-and-living-presentation-scope-reconciliation.js'
  ]);`,
  'single-capacity-path-set-renewal'
);

source = replaceExact(
  source,
`    sourceOccurrenceOrRevision:
      'CAMERA_AUDIT_RUN=30128052946;AUDIT_ARTIFACT=8610004588;CHECKS=39_OF_39',
    assertionScope: Object.freeze([
      'EXACT_CAMERA_CAPACITY_PATH_RESOLUTION',
      'PRESERVED_BASE_IMPLEMENTATION_PATH_RESOLUTION',
      'READ_ONLY_PREFLIGHT_SCOPE'
    ]),`,
`    sourceOccurrenceOrRevision:
      'SINGLE_MODULE_BUILD_RUN=30130634686;AUDIT_ARTIFACT=8610935978;CHECKS=18_OF_18;SHA256=${receipt.generatedSha256}',
    assertionScope: Object.freeze([
      'EXACT_CANONICAL_CAPACITY_PATH_RESOLUTION',
      'AUXILIARY_CAPACITY_PATH_ABSENCE',
      'NINETEEN_MODULE_BROWSER_GRAPH_PRESERVATION',
      'WATERWARD_CAMERA_CORRESPONDENCE',
      'READ_ONLY_PREFLIGHT_SCOPE'
    ]),`,
  'execution-evidence-renewal'
);

source = replaceExact(
  source,
`    description:
      'Bounded camera-envelope correction, exact prior capacity implementation preservation, and nonexecuting living-presentation capacity standard.',`,
`    description:
      'Single canonical capacity-module restoration, bounded waterward camera correspondence, and nonexecuting living-presentation capacity standard within the governed nineteen-module browser graph.',`,
  'node-description-renewal'
);

source = replaceExact(
  source,
`    authoritySource: Object.freeze([
      'EXPLICIT_USER_INSTRUCTION',
      'EXECUTED_39_CHECK_CAMERA_AND_GEOMETRY_PRESERVATION_AUDIT'
    ]),
    authorityScope: Object.freeze([
      'EXACT_PATH_RESOLUTION',
      'CAMERA_CAPACITY_CORRESPONDENCE',
      'PRESERVED_BASE_IMPLEMENTATION_CORRESPONDENCE',
      'READ_ONLY_PREFLIGHT_SCOPE'
    ]),`,
`    authoritySource: Object.freeze([
      'EXPLICIT_USER_INSTRUCTION',
      'EXECUTED_18_CHECK_SINGLE_MODULE_BUILD_AND_IMPORT_AUDIT'
    ]),
    authorityScope: Object.freeze([
      'EXACT_PATH_RESOLUTION',
      'SINGLE_CANONICAL_CAPACITY_MODULE',
      'NINETEEN_MODULE_BROWSER_GRAPH_PRESERVATION',
      'CAMERA_CAPACITY_CORRESPONDENCE',
      'READ_ONLY_PREFLIGHT_SCOPE'
    ]),`,
  'authority-scope-renewal'
);

source = replaceExact(
  source,
`    requiredValidations: Object.freeze([
      'EXACT_PATH_RESOLUTION',
      'CAMERA_ENVELOPE_EXECUTION_AUDIT',
      'GEOMETRY_SOURCE_CUSTODY',
      'MINIMUM_SHORELINE_EXECUTION_AUDIT',
      'AUTOMATIC_REPOSITORY_PREFLIGHT'
    ]),`,
`    requiredValidations: Object.freeze([
      'EXACT_PATH_RESOLUTION',
      'AUXILIARY_CAPACITY_PATH_ABSENCE',
      'NINETEEN_MODULE_BROWSER_GRAPH_EXECUTION',
      'CAMERA_ENVELOPE_EXECUTION_AUDIT',
      'GEOMETRY_SOURCE_CUSTODY',
      'MINIMUM_SHORELINE_EXECUTION_AUDIT',
      'AUTOMATIC_REPOSITORY_PREFLIGHT'
    ]),`,
  'required-validation-renewal'
);

source = replaceExact(
  source,
`    currentIdentityReferences: Object.freeze([
      'H_EARTH_LANDWARD_GROUND_INSPECTION_CAMERA_ENVELOPE_v1',
      'H_EARTH_MINIMUM_SHORELINE_LIVING_PRESENTATION_CAPACITY_v1',
      '1828db052b743f758ec58c992e612c49d95b3c80',
      '887e0c469ec90e4571f5b41bc91ba8dab409aa2d'
    ]),`,
`    currentIdentityReferences: Object.freeze([
      'H_EARTH_LANDWARD_GROUND_INSPECTION_CAMERA_ENVELOPE_v2_SINGLE_MODULE',
      'H_EARTH_MINIMUM_SHORELINE_LIVING_PRESENTATION_CAPACITY_v2_SINGLE_MODULE',
      '${receipt.generatedSha256}',
      'GOVERNED_BROWSER_MODULE_COUNT_19'
    ]),`,
  'identity-reference-renewal'
);

if (source.includes('capacity.base.js')) {
  throw new Error('registry overlay still references retired capacity.base.js');
}

fs.writeFileSync(registryPath, source, 'utf8');

receipt.registryReconciliation = {
  result: 'PASS',
  path: '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.camera-and-living-presentation-scope-reconciliation.js',
  auxiliaryCapacityReferenceAbsent: true,
  registeredRuntimeCapacityPaths: [
    '/showroom/globe/h-earth/capacity.js'
  ]
};
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
