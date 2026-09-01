#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const controlPath = 'control-plane/whole-estate/characters-reconstruction-v1';
const contractPath = `${controlPath}/task19-cardinal-scene-construction-contract.v1.json`;
const verifierPath = `${controlPath}/verify-task19-cardinal-scenes.v1.mjs`;
const contract = JSON.parse(fs.readFileSync(path.join(root, contractPath), 'utf8'));

const argument = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
};
const requestedBase = argument('--base', contract.admission.governingBase);
const requestedCandidate = argument('--candidate', 'HEAD');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const show = (ref, file) => git('show', `${ref}:${file}`);
const existsAt = (ref, file) => {
  try { git('cat-file', '-e', `${ref}:${file}`); return true; } catch { return false; }
};
const blobAt = (ref, file) => {
  try { return git('rev-parse', `${ref}:${file}`); } catch { return null; }
};
const readAt = (ref, file) => existsAt(ref, file) ? show(ref, file) : '';
const jsonAt = (ref, file) => {
  try { return JSON.parse(readAt(ref, file)); } catch { return null; }
};

const checks = [];
const failures = [];
const pending = [];
const record = (id, ok, detail = '', phase = 'BINDING') => {
  const row = { id, ok, detail, phase };
  checks.push(row);
  if (!ok) failures.push(row);
};
const hold = (id, detail = '') => pending.push({ id, detail, phase: 'PRODUCT' });

let base = null;
let candidate = null;
try { base = git('rev-parse', `${requestedBase}^{commit}`); } catch {}
try { candidate = git('rev-parse', `${requestedCandidate}^{commit}`); } catch {}

record('EXACT_GOVERNING_BASE_RESOLVES', base === contract.admission.governingBase, `resolved=${base ?? 'UNRESOLVED'}`);
record('REQUESTED_BASE_MATCHES_CONTRACT', requestedBase === contract.admission.governingBase, `requested=${requestedBase}`);
record('CANDIDATE_RESOLVES', Boolean(candidate), `resolved=${candidate ?? 'UNRESOLVED'}`);
record('CANONICAL_ADMISSION_BOUND', contract.admission.canonicalResult === 'ADMITTED_AND_LOCKED' && contract.admission.lockGeneration === 1906);
record('ROUTER_PASS_BOUND', contract.admission.routerResult === 'PASS' && /^[a-f0-9]{64}$/.test(contract.admission.routerReceiptSha256));
record('EXACT_ALLOWED_PATH_COUNT', Array.isArray(contract.allowedPaths) && contract.allowedPaths.length === 16, `count=${contract.allowedPaths?.length ?? 0}`);

const uniqueAllowed = new Set(contract.allowedPaths);
record('EXACT_ALLOWED_PATHS_UNIQUE', uniqueAllowed.size === contract.allowedPaths.length, `unique=${uniqueAllowed.size}`);
record('SCAFFOLD_PATHS_ALLOWED', uniqueAllowed.has(contractPath) && uniqueAllowed.has(verifierPath));
record('FOUR_CARDINAL_SITES_BOUND', contract.cardinalSites.length === 4, `count=${contract.cardinalSites.length}`);
record('TWENTY_THREE_DISCOVERIES_BOUND', contract.discoveries.length === 23 && contract.knowledgeCardContract.count === 23, `count=${contract.discoveries.length}`);
record('DISCOVERY_IDS_UNIQUE', new Set(contract.discoveries.map(({ id }) => id)).size === 23);
record('DISCOVERY_COUNTS_MATCH_SITES', contract.cardinalSites.every(site => contract.discoveries.filter(item => item.siteId === site.siteId && item.characterId === site.characterId).length === site.discoveryCount));
record('FOUR_DEEP_LINEAGE_DISCOVERIES_BOUND', contract.discoveries.filter(item => item.deepLineage).length === 4 && contract.knowledgeCardContract.deepLineageDiscoveryCount === 4);
record('PRESENCE_STATES_EXACT', JSON.stringify(contract.presenceContract.states) === JSON.stringify(['SITE_ONLY', 'CHARACTER_TRACE', 'CHARACTER_PRESENT']));
record('FIVE_OWNER_DIFFERENTIALS_BOUND', contract.ownerDifferentials.length === 5, `count=${contract.ownerDifferentials.length}`);
record('FIVE_EXECUTION_PROFILES_BOUND', contract.equivalenceContract.profiles.length === 5, `count=${contract.equivalenceContract.profiles.length}`);
record('MAP_INSIDE_SCOPE', contract.geographyAndMapContract.mapRequired === true && uniqueAllowed.has('characters/coast-map.mjs'));
record('PRODUCT_MUTATION_FALSE_AT_SCAFFOLD', contract.productMutationPerformedAtThisLayer === false);

if (base && candidate) {
  const diffNames = git('diff', '--name-only', base, candidate).split(/\r?\n/).filter(Boolean);
  const unrelated = diffNames.filter(file => !uniqueAllowed.has(file));
  record('NO_UNRELATED_DIFF', unrelated.length === 0, unrelated.join(','));

  for (const dependency of contract.frozenSources.dependencies) {
    const actual = blobAt(candidate, dependency.path);
    record(`DEPENDENCY_${dependency.contractId}`, actual === dependency.blobSha, `expected=${dependency.blobSha};actual=${actual ?? 'MISSING'}`);
  }
  const manifest = jsonAt(candidate, contract.frozenSources.legacyDossierManifest);
  record('LEGACY_MANIFEST_PRESENT', manifest?.schema === 'CHARACTERS_DOSSIER_PRESERVATION_MANIFEST_v1');
  record('LEGACY_256_STATE_AUTHORITY_BOUND', manifest?.dossierModel?.legacyStateCount === 256 && manifest?.source?.blobSha === contract.frozenSources.legacySourceBlob);
  record('LEGACY_CARRIER_UNCHANGED', blobAt(base, 'characters/legacy-dossiers.html') === blobAt(candidate, 'characters/legacy-dossiers.html'));

  const scaffold = new Set([contractPath, verifierPath]);
  const productDiff = diffNames.filter(file => !scaffold.has(file));
  const productConstructionStarted = productDiff.length > 0;
  record('SCAFFOLD_LANDED_BEFORE_PRODUCT_CONSTRUCTION', productConstructionStarted || diffNames.every(file => scaffold.has(file)), productDiff.join(','), 'SEQUENCE');

  if (!productConstructionStarted) {
    for (const step of contract.constructionOrder.slice(1)) hold(step, 'PRODUCT_CONSTRUCTION_NOT_STARTED');
  } else {
    const requiredProductFiles = contract.allowedPaths.filter(file => file.startsWith('characters/') || file === '.github/ai-router/publication-surfaces/characters.json');
    for (const file of requiredProductFiles) record(`PRODUCT_FILE_${file.replaceAll(/[^A-Za-z0-9]+/g, '_').toUpperCase()}`, existsAt(candidate, file), file, 'PRODUCT');

    const index = readAt(candidate, 'characters/index.html');
    const app = readAt(candidate, 'characters/app.mjs');
    const adapter = readAt(candidate, 'characters/gratitude-geography.adapter.mjs');
    const data = readAt(candidate, 'characters/cardinal-scenes.data.mjs');
    const state = readAt(candidate, 'characters/cardinal-scene-state.mjs');
    const geometry = readAt(candidate, 'characters/cardinal-scene-geometry.mjs');
    const map = readAt(candidate, 'characters/coast-map.mjs');
    const cards = readAt(candidate, 'characters/knowledge-card.mjs');
    const intro = readAt(candidate, 'characters/cinematic-intro.mjs');
    const css = readAt(candidate, 'characters/cardinal-scenes.css');

    for (const dependency of contract.frozenSources.dependencies) {
      record(`ADAPTER_BINDS_${dependency.contractId}`, adapter.includes(dependency.path) || adapter.includes(dependency.contractId) || adapter.includes(dependency.blobSha), dependency.path, 'PRODUCT');
    }
    record('ONE_GEOGRAPHY_ADAPTER_CONSUMED_BY_MAP', /gratitude-geography\.adapter\.mjs/.test(map), '', 'PRODUCT');
    record('ONE_GEOGRAPHY_ADAPTER_CONSUMED_BY_SCENE', /gratitude-geography\.adapter\.mjs/.test(app + geometry), '', 'PRODUCT');
    record('MAP_WORLD_COORDINATE_INTERFACE', /worldToMap|mapToWorld|projectWorld|resolveMap/i.test(adapter) && /siteAnchor|landmark/i.test(adapter + map), '', 'PRODUCT');
    record('NO_INDEPENDENT_CSS_COASTLINE', !/clip-path\s*:|polygon\s*\(|coastline\s*:\s*url/i.test(css), '', 'PRODUCT');

    for (const site of contract.cardinalSites) {
      record(`SITE_${site.siteId}`, data.includes(site.siteId) && geometry.includes(site.siteId), site.characterId, 'PRODUCT');
      record(`LANDMARK_${site.landmarkId}`, data.includes(site.landmarkId) && geometry.includes(site.landmarkId), site.siteId, 'PRODUCT');
    }
    for (const discovery of contract.discoveries) record(`DISCOVERY_${discovery.id}`, data.includes(discovery.id), discovery.siteId, 'PRODUCT');
    record('DATA_HAS_EXACT_DISCOVERY_COUNT', [...data.matchAll(/\bid\s*:\s*['\"](?:ALARIC|TARIAN|ELARA|SOREN)_[A-Z0-9_]+['\"]/g)].length === 23, '', 'PRODUCT');
    record('AUDIENCE_CHARACTER_KNOWLEDGE_SEPARATED', /audienceKnowledge/.test(data) && /characterKnowledge/.test(data) && /provenance/.test(data) && /chronologyState/.test(data) && /availabilityPredicate/.test(data), '', 'PRODUCT');
    record('TWO_SIDED_CARD_FIELDS', /faceA/.test(data) && /faceB/.test(data) && /RECORD/.test(cards) && /SIGNIFICANCE/.test(cards), '', 'PRODUCT');
    record('CARD_INPUT_EQUIVALENCE', /pointer|touch|swipe/i.test(cards) && /click/i.test(cards) && /key/i.test(cards), '', 'PRODUCT');
    record('CARD_REDUCED_MOTION_EQUIVALENCE', /prefers-reduced-motion|reducedMotion/i.test(cards + css), '', 'PRODUCT');

    for (const presence of contract.presenceContract.states) record(`PRESENCE_${presence}`, state.includes(presence), '', 'PRODUCT');
    record('PRESENCE_RESOLVES_BEFORE_INSPECTION', /resolvePresence/.test(state) && /inspect|discovery/i.test(state), '', 'PRODUCT');
    record('STRUCTURAL_3D_GEOMETRY', /vertex|vertices|mesh|buffer|triangle/i.test(geometry) && /occlusion|normal|depth|light/i.test(geometry), '', 'PRODUCT');
    record('NO_MAJOR_BILLBOARD_GEOMETRY', !/major.*billboard|billboard.*major/i.test(geometry), '', 'PRODUCT');

    record('WORLD_MAP_RETURN_PATHS', /return.*map|map.*return/i.test(app + map + index), '', 'PRODUCT');
    record('NO_VISIBLE_CAROUSEL_ARROWS', !/data-carousel-(?:prev|next)|aria-label=['\"][^'\"]*(?:previous|next)[^'\"]*(?:character|card|carousel)/i.test(index), '', 'PRODUCT');
    record('PUBLIC_PROCESS_LANGUAGE_EXCLUDED', !/>[^<]*(?:dossier|qualification|task\s*19|verifier)[^<]*</i.test(index), '', 'PRODUCT');
    record('INTRO_SKIP_STATE_EQUIVALENCE', /skip/i.test(intro + index) && /same|equivalent|canonical.*state/i.test(intro), '', 'PRODUCT');
    record('NO_AUTOPLAY_AUDIO', !/<audio[^>]*autoplay|\.play\(\).*intro/i.test(index + intro), '', 'PRODUCT');
    record('STANDARD_SURVEY_NO_SNAP_CONTRACT', /survey|cinematic/i.test(app + state) && /interpolat|duration|progress/i.test(app + state), '', 'PRODUCT');
    record('STATIC_FALLBACK_COMPLETE', /SITE_ONLY|CHARACTER_TRACE|CHARACTER_PRESENT/.test(index) && contract.discoveries.every(item => index.includes(item.id)), '', 'PRODUCT');
    record('TOUCH_KEYBOARD_REDUCED_SUPPORT', /pointer|touch/i.test(app + cards) && /keydown|keyup/i.test(app + cards) && /prefers-reduced-motion/i.test(app + css + cards), '', 'PRODUCT');
    record('PHONE_NO_HORIZONTAL_ESCAPE', /overflow-x\s*:\s*(?:clip|hidden)/i.test(css) || /max-inline-size|max-width/i.test(css), '', 'PRODUCT');
  }
}

let result;
let exitCode;
if (failures.length) {
  result = contract.verification.candidateFailResult;
  exitCode = 1;
} else if (pending.length) {
  result = contract.verification.scaffoldPassResult;
  exitCode = 0;
} else {
  result = contract.verification.candidatePassResult;
  exitCode = 0;
}

console.log(JSON.stringify({
  schema: 'TASK19_CARDINAL_SCENE_VERIFICATION_RECEIPT_v1',
  result,
  operationId: contract.operationId,
  base,
  candidate,
  checks,
  failures,
  pending,
  authority: {
    merge: false,
    deployment: false,
    publication: false,
    ownerIntegratedAcceptanceRequired: true
  }
}, null, 2));
process.exit(exitCode);
