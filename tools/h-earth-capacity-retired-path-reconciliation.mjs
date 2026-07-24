import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targetPath = path.join(
  root,
  'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.camera-and-living-presentation-scope-reconciliation.js'
);

function replaceExact(source, expected, replacement, identity) {
  const first = source.indexOf(expected);
  const last = source.lastIndexOf(expected);
  if (first < 0 || first !== last) {
    throw new Error(`${identity}: expected exactly one source occurrence`);
  }
  return source.slice(0, first) + replacement + source.slice(first + expected.length);
}

let source = fs.readFileSync(targetPath, 'utf8');

source = replaceExact(
  source,
`export const H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_PATHS =
  Object.freeze([
    '/showroom/globe/h-earth/capacity.js',
    '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.camera-and-living-presentation-scope-reconciliation.js'
  ]);

const OCCURRENCES =
  Object.freeze(
    H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_PATHS.map(
      (repositoryPath) =>
        deepFreeze({
          repository:
            REPOSITORY,
          refType:
            'BRANCH',
          refName:
            BRANCH,
          commitSha:
            null,
          path:
            repositoryPath,
          gitBlobSha:
            null,
          contentSha256:
            null,
          byteCount:
            null,
          existenceStatus:
            'PRESENT',
          fetchbackStatus:
            'NOT_PERFORMED',
          occurrenceClass:
            'CANDIDATE'
        })
    )
  );`,
`export const H_EARTH_CAMERA_AND_LIVING_PRESENTATION_ACTIVE_SCOPE_PATHS =
  Object.freeze([
    '/showroom/globe/h-earth/capacity.js',
    '/h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.camera-and-living-presentation-scope-reconciliation.js'
  ]);

export const H_EARTH_CAMERA_AND_LIVING_PRESENTATION_RETIRED_SCOPE_PATHS =
  Object.freeze([
    '/showroom/globe/h-earth/capacity.base.js'
  ]);

export const H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_PATHS =
  Object.freeze([
    ...H_EARTH_CAMERA_AND_LIVING_PRESENTATION_ACTIVE_SCOPE_PATHS,
    ...H_EARTH_CAMERA_AND_LIVING_PRESENTATION_RETIRED_SCOPE_PATHS
  ]);

const ACTIVE_OCCURRENCES =
  H_EARTH_CAMERA_AND_LIVING_PRESENTATION_ACTIVE_SCOPE_PATHS.map(
    (repositoryPath) =>
      deepFreeze({
        repository:
          REPOSITORY,
        refType:
          'BRANCH',
        refName:
          BRANCH,
        commitSha:
          null,
        path:
          repositoryPath,
        gitBlobSha:
          null,
        contentSha256:
          null,
        byteCount:
          null,
        existenceStatus:
          'PRESENT',
        fetchbackStatus:
          'NOT_PERFORMED',
        occurrenceClass:
          'CANDIDATE'
      })
  );

const RETIRED_OCCURRENCES =
  H_EARTH_CAMERA_AND_LIVING_PRESENTATION_RETIRED_SCOPE_PATHS.map(
    (repositoryPath) =>
      deepFreeze({
        repository:
          REPOSITORY,
        refType:
          'BRANCH',
        refName:
          BRANCH,
        commitSha:
          null,
        path:
          repositoryPath,
        gitBlobSha:
          null,
        contentSha256:
          null,
        byteCount:
          null,
        existenceStatus:
          'ABSENT',
        fetchbackStatus:
          'NOT_PERFORMED',
        occurrenceClass:
          'RETIRED'
      })
  );

const OCCURRENCES =
  Object.freeze([
    ...ACTIVE_OCCURRENCES,
    ...RETIRED_OCCURRENCES
  ]);`,
  'active-and-retired-occurrence-separation'
);

source = replaceExact(
  source,
`      'EXACT_CANONICAL_CAPACITY_PATH_RESOLUTION',
      'AUXILIARY_CAPACITY_PATH_ABSENCE',
      'NINETEEN_MODULE_BROWSER_GRAPH_PRESERVATION',`,
`      'EXACT_CANONICAL_CAPACITY_PATH_RESOLUTION',
      'AUXILIARY_CAPACITY_PATH_ABSENCE',
      'RETIRED_AUXILIARY_PATH_RESOLUTION_WITH_ABSENT_OCCURRENCE',
      'NINETEEN_MODULE_BROWSER_GRAPH_PRESERVATION',`,
  'evidence-retirement-assertion'
);

source = replaceExact(
  source,
`    description:
      'Single canonical capacity-module restoration, bounded waterward camera correspondence, and nonexecuting living-presentation capacity standard within the governed nineteen-module browser graph.',`,
`    description:
      'Single canonical runtime capacity-module restoration, bounded waterward camera correspondence, and nonexecuting living-presentation capacity standard within the governed nineteen-module browser graph; the removed auxiliary path remains registered only as an absent retired repository-history occurrence.',`,
  'node-description-retirement-distinction'
);

source = replaceExact(
  source,
`      'SINGLE_CANONICAL_CAPACITY_MODULE',
      'NINETEEN_MODULE_BROWSER_GRAPH_PRESERVATION',`,
`      'SINGLE_CANONICAL_CAPACITY_MODULE',
      'RETIRED_PATH_HISTORY_RESOLUTION',
      'NINETEEN_MODULE_BROWSER_GRAPH_PRESERVATION',`,
  'authority-retirement-scope'
);

source = replaceExact(
  source,
`      'EXACT_PATH_RESOLUTION',
      'AUXILIARY_CAPACITY_PATH_ABSENCE',
      'NINETEEN_MODULE_BROWSER_GRAPH_EXECUTION',`,
`      'EXACT_PATH_RESOLUTION',
      'AUXILIARY_CAPACITY_PATH_ABSENCE',
      'RETIRED_AUXILIARY_PATH_RESOLVES_AS_ABSENT',
      'NINETEEN_MODULE_BROWSER_GRAPH_EXECUTION',`,
  'required-retirement-validation'
);

source = replaceExact(
  source,
`      '7b70fcb379fa37d97b07b2d337884c655cfa9657b12db8a7d9d6459291aafb96',
      'GOVERNED_BROWSER_MODULE_COUNT_19'`,
`      '7b70fcb379fa37d97b07b2d337884c655cfa9657b12db8a7d9d6459291aafb96',
      'GOVERNED_BROWSER_MODULE_COUNT_19',
      'CAPACITY_BASE_PATH_RETIRED_ABSENT'`,
  'identity-retirement-reference'
);

fs.writeFileSync(targetPath, source, 'utf8');

const module = await import(`${pathToFileURL(targetPath).href}?audit=${Date.now()}`);
const activePath = '/showroom/globe/h-earth/capacity.js';
const retiredPath = '/showroom/globe/h-earth/capacity.base.js';
const active = module.resolveHEarthRepositoryRegistryPath(activePath);
const retired = module.resolveHEarthRepositoryRegistryPath(retiredPath);

const checks = {
  activePathResolved: active.resolved === true,
  activeOccurrencePresentCandidate:
    active.occurrences.length === 1 &&
    active.occurrences[0].existenceStatus === 'PRESENT' &&
    active.occurrences[0].occurrenceClass === 'CANDIDATE',
  retiredPathResolved: retired.resolved === true,
  retiredOccurrenceAbsentRetired:
    retired.occurrences.length === 1 &&
    retired.occurrences[0].existenceStatus === 'ABSENT' &&
    retired.occurrences[0].occurrenceClass === 'RETIRED',
  activeGraphExcludesAuxiliary:
    module.H_EARTH_CAMERA_AND_LIVING_PRESENTATION_ACTIVE_SCOPE_PATHS.includes(retiredPath) === false,
  historicalRegistryIncludesAuxiliary:
    module.H_EARTH_CAMERA_AND_LIVING_PRESENTATION_SCOPE_PATHS.includes(retiredPath) === true
};

const failed = Object.entries(checks).filter(([, passed]) => passed !== true).map(([name]) => name);
if (failed.length > 0) {
  throw new Error(`retired-path reconciliation failed: ${failed.join(', ')}`);
}

process.stdout.write(`${JSON.stringify({ result: 'PASS', checks }, null, 2)}\n`);
