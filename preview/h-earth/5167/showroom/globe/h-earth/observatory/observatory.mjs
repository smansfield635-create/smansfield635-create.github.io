export const H_EARTH_OBSERVATORY_ROUTE_ID = 'THE_H_EARTH_OBSERVATORY';
export const H_EARTH_OBSERVATORY_CANDIDATE_ID = 'H_EARTH_NARRATIVE_OBSERVATORY_INTEGRATION_001';

export const H_EARTH_OBSERVATORY_SECTION_IDS = Object.freeze([
  'H_EARTH_WITHIN_MIRRORLAND',
  'SHADOWS_NEVER_SHATTER_IN_MIRRORLAND',
  'THE_LIVE_ENVIRONMENT',
  'HOW_THE_WORLD_IS_PRESERVED',
  'ONE_REAL_ENGINEERING_SESSION',
  'OPTIONAL_TECHNICAL_EVIDENCE',
  'RETURN_TO_H_EARTH'
]);

export const H_EARTH_OBSERVATORY_REPLAY = Object.freeze([
  {
    id: 'PR_400_PLATFORM_PROOF',
    title: 'PR 400 · Unified platform proof',
    body: 'One real post-merge operation proved that the unified platform could preserve source, runtime, live, accepted, and default authority as separate states.',
    states: [['REPOSITORY_INTEGRATED', 'PASS'], ['PRODUCT_PROMOTION', 'FALSE']]
  },
  {
    id: 'ENGINEERING_PASS',
    title: 'Engineering pass',
    body: 'The instrument platform and bounded operation completed their engineering requirements without using that result as a substitute for public acceptance.',
    states: [['ENGINEERING_VERIFIED', 'PASS'], ['PRODUCT_ACCEPTANCE_GRANTED', 'FALSE']]
  },
  {
    id: 'REPOSITORY_INTEGRATION',
    title: 'Repository integration',
    body: 'The platform proof merged at 6037cdad3bde1dfcac1aec253d5ad079fc1df1f5. Repository integration established source custody, not automatic promotion.',
    states: [['MERGED', 'PASS'], ['DEFAULT_PROMOTION_COMPLETED', 'FALSE']]
  },
  {
    id: 'PUBLIC_OBSERVATION',
    title: 'Public observation',
    body: 'Public execution and observation remain distinct from engineering execution. Missing public evidence is held as an open evidence lane rather than rewritten as product failure.',
    states: [['PUBLIC_EVIDENCE_REQUIRED', 'OPEN'], ['PRODUCT_FAILURE_CONFIRMED', 'FALSE']]
  },
  {
    id: 'USER_DIFFERENTIAL_RECONCILE',
    title: 'User differential and reconcile',
    body: 'Only the user may compare the changed candidate with the accepted baseline and record ACCEPT, REJECT, or RECONCILE.',
    states: [['AUTOMATED_SUBSTITUTION', 'FALSE'], ['USER_DIFFERENTIAL_RECORDED', 'FALSE']]
  },
  {
    id: 'AUTOMATIC_PROMOTION_REFUSAL',
    title: 'Automatic promotion refusal',
    body: 'Engineering pass, browser pass, screenshots, and assistant judgment cannot authorize the accepted public default.',
    states: [['AUTOMATIC_PROMOTION', 'FALSE'], ['PUBLIC_DEFAULT_REVERIFIED', 'FALSE']]
  },
  {
    id: 'LEGACY_GAUGE_CONTRACT_DRIFT',
    title: 'Legacy gauge contract drift',
    body: 'The old gauge measured superseded markers, hard-coded holds, and an obsolete readiness denominator. Those rows were classified instead of being treated as seven established product failures.',
    states: [['LEGACY_ROWS_CLASSIFIED', 'PASS'], ['LEGACY_FAILURES_AS_PRODUCT_FAILURES', 'FALSE']]
  },
  {
    id: 'SPECIALIZED_GAUGE_RECONCILIATION',
    title: 'Specialized gauge reconciliation',
    body: 'The current-authority gauge source was implemented, engineering-verified, and merged. Its post-merge public receipt was not recorded, so Operation A is not represented as fully closed.',
    states: [
      ['SOURCE_IMPLEMENTED', 'PASS'],
      ['ENGINEERING_VERIFIED', 'PASS'],
      ['MERGED', 'PASS'],
      ['PUBLIC_POST_MERGE_RECEIPT', 'OPEN'],
      ['PROGRAM_CLOSURE', 'FALSE']
    ]
  }
]);

export const H_EARTH_OBSERVATORY_SPECIALIZED_DESTINATIONS = Object.freeze([
  { id: 'H_EARTH_GAUGES', label: 'H-Earth Gauges', route: '/gauges/h-earth/' },
  { id: 'FD_05', label: 'FD_05 Diagnostic Authority', route: '/showroom/globe/h-earth/diagnostic/' },
  { id: 'RUN_8E_R1_PROFILER', label: 'Run 8E-R1 Profiler', route: '/showroom/globe/h-earth/diagnostic/run8e-r1/' },
  { id: 'TERRAIN_WORKBENCH', label: 'Terrain Workbench', route: '/h-earth-3d/tools/terrain-workbench/' }
]);

export const H_EARTH_OBSERVATORY_FALSE_CLAIMS = Object.freeze({
  PRODUCT_FAILURE_CONFIRMED: false,
  PRODUCT_ACCEPTANCE_GRANTED: false,
  DEFAULT_PROMOTION_COMPLETED: false,
  PUBLIC_DEFAULT_REVERIFIED: false
});

const create = (tag, attributes = {}, text = null) => {
  const node = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') node.className = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else node.setAttribute(key, value);
  });
  if (text !== null) node.textContent = text;
  return node;
};

const presentSections = [...document.querySelectorAll('[data-observatory-section]')]
  .map((node) => node.dataset.observatorySection);

if (JSON.stringify(presentSections) !== JSON.stringify(H_EARTH_OBSERVATORY_SECTION_IDS)) {
  document.documentElement.dataset.observatoryContract = 'FAIL';
  throw new Error('H_EARTH_OBSERVATORY_SEVEN_SECTION_CONTRACT_MISMATCH');
}

const replayNode = document.getElementById('observatory-replay');
if (!(replayNode instanceof HTMLOListElement)) throw new Error('H_EARTH_OBSERVATORY_REPLAY_HOST_MISSING');
replayNode.replaceChildren(...H_EARTH_OBSERVATORY_REPLAY.map((chapter, index) => {
  const item = create('li', { className: 'replay-card', dataset: { replayChapter: chapter.id } });
  const title = create('h3', {}, `${index + 1}. ${chapter.title}`);
  const body = create('p', {}, chapter.body);
  const states = create('div', { className: 'status-row', 'aria-label': `${chapter.title} states` });
  states.append(...chapter.states.map(([label, state]) => create('span', {
    className: 'status-chip',
    dataset: { state }
  }, `${label} = ${state === 'PASS' ? 'TRUE' : state}`)));
  item.append(title, body, states);
  return item;
}));

const technicalHost = document.getElementById('technical-evidence-body');
if (!(technicalHost instanceof HTMLElement)) throw new Error('H_EARTH_OBSERVATORY_TECHNICAL_HOST_MISSING');

const ladder = create('div', { className: 'tool-ladder', dataset: { disclosureSequence: 'TECHNICAL_EVIDENCE' } });
const platformGroup = create('section', { className: 'tool-group' });
platformGroup.append(
  create('h3', {}, 'Unified Instrument Platform'),
  create('p', {}, 'Open the shared project context, evidence envelope, authority state machine, and bounded candidate controllers.'),
  (() => {
    const links = create('div', { className: 'tool-links' });
    links.append(create('a', { href: '/h-earth-3d/tools/instrument-platform/', dataset: { destination: 'UNIFIED_INSTRUMENT_PLATFORM' } }, 'Open Unified Instrument Platform'));
    return links;
  })()
);

const specializedDetails = create('details', { className: 'disclosure', dataset: { disclosureSequence: 'SPECIALIZED_DIAGNOSTICS' } });
specializedDetails.append(create('summary', {}, 'Specialized diagnostics'));
const specializedBody = create('div', { className: 'disclosure-body' });
specializedBody.append(create('p', {}, 'These instruments remain one level deeper than the Observatory narrative. They do not auto-launch.'));
const specializedLinks = create('div', { className: 'tool-links' });
specializedLinks.append(...H_EARTH_OBSERVATORY_SPECIALIZED_DESTINATIONS.map((tool) => create('a', {
  href: tool.route,
  dataset: { destination: tool.id }
}, tool.label)));
specializedBody.append(specializedLinks);
specializedDetails.append(specializedBody);
ladder.append(platformGroup, specializedDetails);
technicalHost.replaceChildren(ladder);

const candidateActive = new URLSearchParams(location.search).get('candidate') === H_EARTH_OBSERVATORY_CANDIDATE_ID;
if (candidateActive) {
  const candidateReturn = `/showroom/globe/h-earth/?candidate=${encodeURIComponent(H_EARTH_OBSERVATORY_CANDIDATE_ID)}`;
  document.querySelectorAll('a[href="/showroom/globe/h-earth/"]').forEach((anchor) => {
    anchor.href = candidateReturn;
  });
}

document.getElementById('session-replay-disclosure')?.addEventListener('toggle', (event) => {
  if (event.currentTarget.open) document.documentElement.dataset.replayInspected = 'true';
});
document.getElementById('technical-evidence-disclosure')?.addEventListener('toggle', (event) => {
  if (event.currentTarget.open) document.documentElement.dataset.technicalEvidenceInspected = 'true';
});

document.documentElement.dataset.observatoryContract = 'PASS';
document.documentElement.dataset.observatoryCandidate = candidateActive ? 'active' : 'inactive';
document.documentElement.dataset.replayChapterCount = String(H_EARTH_OBSERVATORY_REPLAY.length);
document.documentElement.dataset.specializedDestinationCount = String(H_EARTH_OBSERVATORY_SPECIALIZED_DESTINATIONS.length);
document.documentElement.dataset.repositoryControlsExposed = 'false';
document.documentElement.dataset.diagnosticAutoLaunch = 'false';
document.body.dataset.jsState = 'ready';

window.H_EARTH_OBSERVATORY = Object.freeze({
  routeId: H_EARTH_OBSERVATORY_ROUTE_ID,
  candidateId: H_EARTH_OBSERVATORY_CANDIDATE_ID,
  candidateActive,
  sections: H_EARTH_OBSERVATORY_SECTION_IDS,
  replay: H_EARTH_OBSERVATORY_REPLAY,
  specializedDestinations: H_EARTH_OBSERVATORY_SPECIALIZED_DESTINATIONS,
  falseClaims: H_EARTH_OBSERVATORY_FALSE_CLAIMS
});
