#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const controlPath = 'control-plane/whole-estate/characters-reconstruction-v1';
const contractPath = `${controlPath}/task20-cinematic-primer-construction-contract.v1.json`;
const verifierPath = `${controlPath}/verify-task20-cinematic-primer.v1.mjs`;
const bindingPath = 'characters/task20-source-to-shot-binding.v1.json';
const contract = JSON.parse(fs.readFileSync(path.join(root, contractPath), 'utf8'));
const argument = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
};
const requestedBase = argument('--base', contract.admission.governingBase);
const requestedCandidate = argument('--candidate', 'HEAD');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const show = (ref, file) => git('show', `${ref}:${file}`);
const existsAt = (ref, file) => { try { git('cat-file', '-e', `${ref}:${file}`); return true; } catch { return false; } };
const blobAt = (ref, file) => { try { return git('rev-parse', `${ref}:${file}`); } catch { return null; } };
const checks = [];
const failures = [];
const record = (id, ok, detail = '', phase = 'CONTRACT') => {
  const row = { id, ok, detail, phase };
  checks.push(row);
  if (!ok) failures.push(row);
};

let base = null;
let candidate = null;
try { base = git('rev-parse', `${requestedBase}^{commit}`); } catch {}
try { candidate = git('rev-parse', `${requestedCandidate}^{commit}`); } catch {}
record('EXACT_GOVERNING_BASE', base === contract.admission.governingBase, `resolved=${base ?? 'UNRESOLVED'}`);
record('REQUESTED_BASE_MATCHES_CONTRACT', requestedBase === contract.admission.governingBase, requestedBase);
record('CANDIDATE_RESOLVES', Boolean(candidate), candidate ?? 'UNRESOLVED');
record('SUCCESSOR_GENERATION_1920_BOUND', contract.admission.lockGeneration === 1920 && contract.admission.predecessorDisposition === 'SUPERSEDED');
record('SUCCESSOR_OPERATION_BOUND', contract.operationId === 'CHARACTERS_TASK20_CINEMATIC_PRIMER_CONSTRUCTION_20260902_002');
record('EXACT_ALLOWED_PATH_COUNT', contract.allowedPaths.length === 17, `count=${contract.allowedPaths.length}`);
record('EXACT_ALLOWED_PATHS_UNIQUE', new Set(contract.allowedPaths).size === 17);
record('CONTRACT_AND_VERIFIER_ALLOWED', contract.allowedPaths.includes(contractPath) && contract.allowedPaths.includes(verifierPath));
record('SOURCE_TO_SHOT_BINDING_ALLOWED', contract.allowedPaths.includes(bindingPath));
record('NO_RELEASE_AUTHORITY', contract.authorityBoundary.includes('NO_MERGE_AUTHORITY') && contract.authorityBoundary.includes('NO_DEPLOYMENT_AUTHORITY') && contract.authorityBoundary.includes('NO_PUBLICATION_AUTHORITY'));

if (base && candidate) {
  const allowed = new Set(contract.allowedPaths);
  const diffNames = git('diff', '--name-only', base, candidate).split(/\r?\n/).filter(Boolean);
  const unrelated = diffNames.filter((file) => !allowed.has(file));
  record('NO_UNRELATED_DIFF', unrelated.length === 0, unrelated.join(','), 'MUTATION_BOUNDARY');
  record('PRODUCT_CONSTRUCTION_PRESENT', diffNames.some((file) => file.startsWith('characters/')), diffNames.join(','), 'MUTATION_BOUNDARY');
  for (const required of [contractPath, verifierPath, bindingPath, 'characters/encounter-card.mjs']) {
    record(`REQUIRED_${required.replaceAll(/[^A-Za-z0-9]+/g, '_').toUpperCase()}`, existsAt(candidate, required), required, 'MUTATION_BOUNDARY');
  }

  const sourceChecks = [
    ['DONOR_INDEX', contract.frozenSources.donorCommit, 'characters/index.html', contract.frozenSources.donorIndexBlob],
    ['DONOR_APP', contract.frozenSources.donorCommit, 'characters/app.mjs', contract.frozenSources.donorAppBlob],
    ['AUDRALIA_PLANET', base, contract.frozenSources.planetPath, contract.frozenSources.planetBlob],
    ['TASK19_DATA', base, 'characters/cardinal-scenes.data.mjs', contract.frozenSources.task19DataBlob],
    ['TASK19_GEOMETRY', base, 'characters/cardinal-scene-geometry.mjs', contract.frozenSources.task19GeometryBlob]
  ];
  for (const [id, ref, file, expected] of sourceChecks) record(`FROZEN_SOURCE_${id}`, blobAt(ref, file) === expected, `${file}:${blobAt(ref, file)}`, 'SOURCE');
  record('PLANET_AUTHORITY_UNMUTATED', blobAt(base, contract.frozenSources.planetPath) === blobAt(candidate, contract.frozenSources.planetPath), '', 'SOURCE');

  const index = show(candidate, 'characters/index.html');
  const app = show(candidate, 'characters/app.mjs');
  const css = show(candidate, 'characters/cardinal-scenes.css');
  const state = show(candidate, 'characters/cardinal-scene-state.mjs');
  const intro = show(candidate, 'characters/cinematic-intro.mjs');
  const encounter = show(candidate, 'characters/encounter-card.mjs');
  const workflow = show(candidate, '.github/workflows/characters-night-world-state-proof.yml');
  const binding = JSON.parse(show(candidate, bindingPath));

  record('SIX_SOURCE_BOUND_PASSAGES', binding.passages?.length === 6 && binding.passages.every((passage) => passage.source), `count=${binding.passages?.length}`, 'PRODUCT');
  record('EXACT_28_SECOND_RUNTIME', binding.targetRuntimeSeconds === 28 && contract.cinematic.runtimeSeconds === 28 && /CINEMATIC_RUNTIME_MS\s*=\s*28000/.test(intro), '', 'PRODUCT');
  record('AUTONOMOUS_AFTER_ONE_PLAY', contract.cinematic.autonomousAfterPlay && contract.cinematic.intermediateClicksRequired === 0 && /TICK_INTRO/.test(intro + app), '', 'PRODUCT');
  record('PLAY_SKIP_REPLAY_CONTROLS', /Play primer/.test(index) && /Skip to survey/.test(index) && /Replay primer/.test(index), '', 'PRODUCT');
  record('NO_AUTOPLAY_AUDIO', !/<audio[^>]*autoplay|\.play\(\).*audio/i.test(index + app + intro), '', 'PRODUCT');
  record('CANONICAL_PLANET_RUNTIME_CONSUMED', /assets\/audralia\/audralia\.planet\.js/.test(index) && /DGBAudraliaPlanetGeometry/.test(app) && /AUDRALIA_G1_WORLD_SEED/.test(app + intro), '', 'PRODUCT');
  record('SEQUENCE_EXACT', contract.cinematic.sequence.every((id) => intro.includes(id)) && binding.passages.map(({ id }) => id).join('>') === contract.cinematic.sequence.join('>'), '', 'PRODUCT');
  record('FILM_INTERFACE_PHYSICAL_CONTINUITY', binding.handoff.finalCameraEqualsHubCamera && /worldEntryFrame/.test(app) && /finalFrameIsInteractiveHubFrame/.test(intro), '', 'PRODUCT');

  for (const phase of contract.interaction.grammar) record(`PHASE_${phase}`, state.includes(phase) || binding.interaction.grammar.includes(phase), '', 'PRODUCT');
  record('ENCOUNTER_ACTIONS_EXACT', /ENTER_CHARACTER_SCENE/.test(encounter + state) && /CONTINUE_SURVEYING/.test(encounter + state), '', 'PRODUCT');
  record('SEPARATE_SCENE_ENTRY', /separateScene:\s*true/.test(intro) && /continuousPhysicalTravelRequired:\s*false/.test(intro), '', 'PRODUCT');
  record('EXACT_HUB_RETURN_PRESERVES_SELECTION', /RETURN_TO_HUB/.test(state + app) && /selectedSiteId/.test(state) && /worldEntryFrame/.test(app), '', 'PRODUCT');
  record('MAP_OPTIONAL_NOT_PRIMARY', contract.interaction.mapRole === 'OPTIONAL' && /Coast map/.test(index), '', 'PRODUCT');

  const discoveryIds = [...index.matchAll(/id="((?:ALARIC|TARIAN|ELARA|SOREN)_[A-Z0-9_]+)"/g)].map((match) => match[1]);
  record('STATIC_TWENTY_THREE_DISCOVERIES', discoveryIds.length === 23 && new Set(discoveryIds).size === 23, `count=${discoveryIds.length}`, 'EQUIVALENCE');
  record('STATIC_FOUR_SCENES', [...index.matchAll(/class="static-site"/g)].length === 4, '', 'EQUIVALENCE');
  record('STATIC_ENCOUNTER_CHOICES', [...index.matchAll(/>Enter the scene</g)].length >= 5 && [...index.matchAll(/>Continue surveying</g)].length >= 5, '', 'EQUIVALENCE');
  record('REDUCED_MOTION_SEMANTIC_PATH', /prefers-reduced-motion/.test(css) && /REDUCED_MOTION/.test(app) && binding.fallback.reducedMotion.includes('SEMANTIC'), '', 'EQUIVALENCE');
  record('PHONE_NO_HORIZONTAL_ESCAPE', /overflow-x:\s*hidden/.test(css), '', 'EQUIVALENCE');
  record('FOUR_SITES_AND_23_DISCOVERIES_PRESERVED', contract.preservation.cardinalSiteCount === 4 && contract.preservation.discoveryCount === 23, '', 'PRESERVATION');
  record('NO_NEW_CANON_BOUNDARY', /newCharacterCanonCreated:\s*false/.test(encounter) && binding.closure.newCharacterCanonCreated === false, '', 'PRESERVATION');
  record('WORKFLOW_ROUTED_TO_TASK20', /Task 20|task20/i.test(workflow) && /encounter-panel/.test(workflow) && /verify-task20-cinematic-primer/.test(workflow), '', 'CI');
}

const executableModules = [
  ['STATE', 'characters/cardinal-scene-state.mjs', 'evaluateCardinalSceneStateContract'],
  ['DATA', 'characters/cardinal-scenes.data.mjs', 'evaluateCardinalScenesData'],
  ['CINEMATIC', 'characters/cinematic-intro.mjs', 'evaluateCinematicIntroAndSurveyPaths'],
  ['ENCOUNTER', 'characters/encounter-card.mjs', 'evaluateEncounterCardContract'],
  ['MAP', 'characters/coast-map.mjs', 'evaluateGratitudeCoastMap'],
  ['CARD', 'characters/knowledge-card.mjs', 'evaluateKnowledgeCardContract'],
  ['WORLD', 'characters/narrative-world-state.mjs', 'evaluateNarrativeWorldCardinalComposition'],
  ['GEOGRAPHY', 'characters/gratitude-geography.adapter.mjs', 'evaluateGratitudeGeographyCorrespondence']
];
for (const [id, file, evaluator] of executableModules) {
  try {
    const module = await import(`${pathToFileURL(path.join(root, file)).href}?task20=${Date.now()}-${id}`);
    const receipt = module[evaluator]();
    record(`EXECUTABLE_${id}`, receipt.eligible === true, `${receipt.result}:${JSON.stringify(receipt.issues ?? [])}`, 'EXECUTABLE');
  } catch (error) {
    record(`EXECUTABLE_${id}`, false, String(error), 'EXECUTABLE');
  }
}

const result = failures.length ? contract.verification.candidateFailResult : contract.verification.candidatePassResult;
console.log(JSON.stringify({
  schema: 'TASK20_CINEMATIC_PRIMER_VERIFICATION_RECEIPT_v1',
  result,
  operationId: contract.operationId,
  base,
  candidate,
  checks,
  failures,
  authority: { merge: false, deployment: false, publication: false, ownerIntegratedAcceptanceRequired: true }
}, null, 2));
process.exit(failures.length ? 1 : 0);
