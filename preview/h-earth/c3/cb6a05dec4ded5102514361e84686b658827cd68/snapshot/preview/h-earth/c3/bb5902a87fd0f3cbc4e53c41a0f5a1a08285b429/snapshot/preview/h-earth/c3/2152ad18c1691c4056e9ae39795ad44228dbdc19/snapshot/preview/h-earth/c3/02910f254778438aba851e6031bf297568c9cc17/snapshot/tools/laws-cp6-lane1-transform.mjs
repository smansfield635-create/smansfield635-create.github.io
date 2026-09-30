import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const BASE = 'c009f2a03c19a6b54ebad62dfba658f808f0b4c1';
const HTML_PATH = 'laws/index.html';
const CSS_PATH = 'laws/index.css';
const SENTINEL = 'data-cp6-lane1-compass-first="true"';
const CSS_SENTINEL = 'LAWS_CP6_LANE1_COMPASS_FIRST_PROGRESSIVE_DISCLOSURE_v1';

function fail(message) {
  throw new Error(`[laws-cp6-lane1-transform] ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function run(...args) {
  return execFileSync(args[0], args.slice(1), { encoding: 'utf8' }).trim();
}

function extractBalanced(source, marker, tagName) {
  const start = source.indexOf(marker);
  assert(start >= 0, `missing marker: ${marker}`);
  const token = new RegExp(`<${tagName}\\b[^>]*>|<\\/${tagName}\\s*>`, 'gi');
  token.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = token.exec(source))) {
    if (match[0].toLowerCase().startsWith(`</${tagName}`)) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, token.lastIndex);
      }
    } else {
      depth += 1;
    }
  }
  fail(`unbalanced ${tagName} block at marker: ${marker}`);
}

function innerOfSection(block) {
  const openEnd = block.indexOf('>') + 1;
  const closeStart = block.toLowerCase().lastIndexOf('</section>');
  assert(openEnd > 0 && closeStart > openEnd, 'invalid section block');
  return block.slice(openEnd, closeStart).trim();
}

function count(source, needle) {
  return source.split(needle).length - 1;
}

const mergeBase = run('git', 'merge-base', 'HEAD', BASE);
assert(mergeBase === BASE, `branch is not descended from exact base ${BASE}`);

let html = fs.readFileSync(HTML_PATH, 'utf8');
let css = fs.readFileSync(CSS_PATH, 'utf8');

if (html.includes(SENTINEL)) {
  console.log('Lane 1 transform already applied; no source mutation required.');
  process.exit(0);
}

assert(count(html, '<main class="laws-estate" id="main">') === 1, 'unexpected main element count');
assert(count(html, 'class="laws-value-deck"') === 1, 'unexpected immediate capability deck count');
assert(count(html, 'id="laws-orbit"') === 1, 'unexpected Laws Compass count');
assert(count(html, 'id="research-comes-first"') === 1, 'unexpected F.I.R.S.T. section count');
assert(count(html, 'class="laws-discovery"') === 1, 'unexpected discovery section count');

const threshold = extractBalanced(html, '<section aria-label="Laws threshold"', 'section');
const first = extractBalanced(html, '<section aria-labelledby="research-comes-first-title"', 'section');
const valueDeck = extractBalanced(html, '<nav aria-label="Immediate Laws capabilities"', 'nav');
const orbitIntro = extractBalanced(html, '<section aria-labelledby="laws-orbit-title"', 'section');
let orbit = extractBalanced(html, '<section aria-describedby="laws-orbit-guidance"', 'section');
const controllerPanel = extractBalanced(html, '<aside aria-atomic="true"', 'aside');
const discovery = extractBalanced(
  html,
  '<section aria-label="Laws standards, branches, evidence boundaries, applied systems, route maturity, and runtime boundaries" class="laws-discovery">',
  'section'
);
const closing = extractBalanced(html, '<section aria-label="Laws closing invitation"', 'section');

const accessibilityStart = html.indexOf('<p class="laws-accessibility-note">');
assert(accessibilityStart >= 0, 'missing accessibility note');
const accessibilityEnd = html.indexOf('</p>', accessibilityStart);
assert(accessibilityEnd >= 0, 'unclosed accessibility note');
const accessibility = html.slice(accessibilityStart, accessibilityEnd + 4);

const discoveryInner = innerOfSection(discovery);
const evidenceMarker = '<section class="laws-consolidated-panel" id="evidence-boundary-summary">';
const routeMarker = '<section class="laws-consolidated-panel" id="route-maturity-summary">';
const evidenceAt = discoveryInner.indexOf(evidenceMarker);
const routeAt = discoveryInner.indexOf(routeMarker);
assert(evidenceAt > 0, 'missing evidence group marker');
assert(routeAt > evidenceAt, 'missing route/runtime group marker');

const foundationGroup = discoveryInner.slice(0, evidenceAt).trim();
const evidenceGroup = discoveryInner.slice(evidenceAt, routeAt).trim();
const routeGroup = discoveryInner.slice(routeAt).trim();

orbit = orbit.replace(
  /(<section[^>]*id="laws-orbit"[^>]*>)/,
  `$1\n<p class="sr-only" data-laws-guidance="" id="laws-orbit-guidance">Choose a law family, test the claim, or inspect the research through the Laws Compass.</p>`
);
assert(orbit.includes('id="laws-orbit-guidance"'), 'failed to preserve orbit guidance identity');

const practicalOpening = `
<section aria-labelledby="laws-practical-opening-title" class="laws-practical-opening" data-laws-official-gate="" data-laws-practical-opening="" data-laws-threshold-introduction="">
  <p class="kicker">Practical opening</p>
  <h1 id="laws-practical-opening-title">Use the compass to locate the governing constraint.</h1>
  <p>The Laws Chamber helps readers identify what must move, remain true, survive evidence, or hold together, then follow the relevant law, test method, and supporting record without treating presentation as proof.</p>
</section>`.trim();

const compactFirst = `
<section aria-labelledby="research-comes-first-title" class="laws-first laws-first--compact" data-visible-first-declaration="true" id="research-comes-first">
  <div class="laws-first__compact-heading">
    <div>
      <p class="kicker">Research orientation</p>
      <h2 id="research-comes-first-title">Research comes F.I.R.S.T.</h2>
    </div>
    <p>Flow · Integrity · Reality · Structure · Test</p>
  </div>
  <nav aria-label="Compact F.I.R.S.T. authority sequence" class="laws-first__compact-sequence">
    <a data-first-entry="flow" href="/laws/categories/flow/"><span>F</span><strong>Flow</strong></a>
    <a data-first-entry="integrity" href="/laws/categories/integrity/"><span>I</span><strong>Integrity</strong></a>
    <a data-first-entry="reality" href="/laws/categories/reality/"><span>R</span><strong>Reality</strong></a>
    <a data-first-entry="structure" href="/laws/categories/structure/"><span>S</span><strong>Structure</strong></a>
    <a data-first-entry="test" href="/laws/test/"><span>T</span><strong>Test</strong></a>
  </nav>
  <p class="laws-first__compact-research"><strong>Research is the examination and support layer.</strong> The Laws Chamber preserves not only law statements, but also their source history, methods, evidence boundaries, falsification conditions, unresolved tests, and research status.</p>
</section>`.trim();

function panel(title, description, content, key) {
  return `
<details class="laws-orientation-panel" data-laws-supporting-panel="${key}">
  <summary>
    <span>${title}</span>
    <small>${description}</small>
  </summary>
  <div class="laws-orientation-panel__body">
${content}
  </div>
</details>`.trim();
}

const progressiveDisclosure = `
<section aria-label="Laws supporting orientation" class="laws-discovery laws-discovery--collapsed" data-laws-progressive-disclosure="">
${panel('Foundations and methods', 'Domain separation, formula custody, and scientific-law orientation.', foundationGroup, 'foundation-methods')}
${panel('Evidence and applied work', 'Evidence boundaries, research standing, applied investigations, and auxiliary branches.', evidenceGroup, 'evidence-applied')}
${panel('Routes, runtime, and claim boundaries', 'Route maturity, runtime custody, claim language, and migrated-record custody.', routeGroup, 'routes-runtime-claims')}
</section>`.trim();

const compassPrimary = `
<div class="laws-compass-primary" data-laws-compass-primary="">
${orbit}
${controllerPanel}
</div>`.trim();

const mainOpen = '<main class="laws-estate" id="main">';
const mainStart = html.indexOf(mainOpen);
const mainEnd = html.indexOf('</main>', mainStart);
assert(mainStart >= 0 && mainEnd > mainStart, 'unable to locate main bounds');

const newMain = `${mainOpen}
${compassPrimary}
${practicalOpening}
${compactFirst}
${progressiveDisclosure}
${accessibility}
</main>`;

html = html.slice(0, mainStart) + newMain + html.slice(mainEnd + '</main>'.length);

html = html.replace(
  'data-cp6-5-page-consolidation="true"',
  'data-cp6-5-page-consolidation="true" data-cp6-lane1-compass-first="true" data-cp6-lane1-progressive-disclosure="true"'
);
html = html.replace(
  'data-laws-css-visual-baseline="compass-family-orbital-contrast-and-collapsed-disclosures"',
  'data-laws-css-visual-baseline="compass-first-progressive-disclosure"'
);
html = html.replace(
  'data-laws-html-visual-baseline="index-derived-rebuilt"',
  'data-laws-html-visual-baseline="compass-first-bounded-correction"'
);

const receiptInsert = `

CP6 LANE 1 HIERARCHY CORRECTION:
- Header and compact navigation remain first.
- Existing Laws Compass markup is repositioned before explanatory content.
- Practical opening follows the Compass.
- Research comes F.I.R.S.T. is compressed into one restrained orientation.
- Supporting orientation is grouped into three initially closed native details panels.
- Immediate Capability Route Deck is removed as redundant Compass navigation.
- Eight canonical destination routes and 48 migrated records remain under existing custody.
- Protected Compass and celestial runtime files remain unchanged.
- OSF main-page insertion is limited to the one authorized research-custody sentence.
`;
assert(count(html, '</template>') === 1, 'unexpected receipt template count');
html = html.replace('</template>', `${receiptInsert}</template>`);

const cssAppend = `

/* ${CSS_SENTINEL} */
.laws-topbar {
  gap: clamp(0.65rem, 1.8vw, 1.25rem);
  padding-block: clamp(0.55rem, 1.4vw, 0.85rem);
}

.laws-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.35rem 0.55rem;
  min-width: 0;
}

.laws-nav a {
  min-height: 2.25rem;
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.5rem;
  font-size: clamp(0.72rem, 1.2vw, 0.82rem);
  white-space: nowrap;
}

.laws-estate,
.laws-compass-primary,
.laws-practical-opening,
.laws-first--compact,
.laws-discovery--collapsed,
.laws-orientation-panel,
.laws-orientation-panel__body {
  min-width: 0;
  max-width: 100%;
}

.laws-compass-primary {
  display: grid;
  gap: clamp(0.8rem, 2vw, 1.35rem);
  margin-top: clamp(0.5rem, 1.5vw, 1rem);
}

.laws-compass-primary > .laws-orbit {
  margin-top: 0;
}

.laws-practical-opening {
  width: min(76rem, calc(100% - 2rem));
  margin: clamp(1rem, 2.5vw, 1.8rem) auto 0;
  padding: clamp(1rem, 2.5vw, 1.6rem);
  border: 1px solid rgba(213, 184, 105, 0.28);
  border-radius: 1rem;
  background: rgba(10, 15, 27, 0.72);
}

.laws-practical-opening h1 {
  max-width: 24ch;
  margin-block: 0.25rem 0.55rem;
  font-size: clamp(1.55rem, 4vw, 2.55rem);
}

.laws-practical-opening p:last-child {
  max-width: 76ch;
  margin-bottom: 0;
}

.laws-first--compact {
  width: min(76rem, calc(100% - 2rem));
  margin: clamp(0.85rem, 2vw, 1.35rem) auto 0;
  padding: clamp(0.9rem, 2.2vw, 1.35rem);
}

.laws-first__compact-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.laws-first__compact-heading h2,
.laws-first__compact-heading p {
  margin-bottom: 0;
}

.laws-first__compact-heading > p {
  color: rgba(240, 224, 177, 0.82);
  font-size: 0.84rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.laws-first__compact-sequence {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.45rem;
  margin-top: 0.85rem;
}

.laws-first__compact-sequence a {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.75rem;
  padding: 0.55rem 0.65rem;
  border: 1px solid rgba(213, 184, 105, 0.24);
  border-radius: 0.7rem;
  background: rgba(255, 255, 255, 0.025);
  text-decoration: none;
}

.laws-first__compact-sequence span {
  display: inline-grid;
  place-items: center;
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 50%;
  background: rgba(213, 184, 105, 0.14);
  color: #f1dfaa;
  font-weight: 800;
}

.laws-first__compact-research {
  margin: 0.8rem 0 0;
  max-width: 92ch;
  font-size: 0.94rem;
}

.laws-discovery--collapsed {
  width: min(76rem, calc(100% - 2rem));
  margin: clamp(0.9rem, 2.5vw, 1.6rem) auto 0;
  display: grid;
  gap: 0.65rem;
}

.laws-orientation-panel {
  border: 1px solid rgba(213, 184, 105, 0.24);
  border-radius: 0.85rem;
  background: rgba(8, 13, 24, 0.78);
  overflow: clip;
}

.laws-orientation-panel > summary {
  display: grid;
  grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr);
  align-items: center;
  gap: 0.75rem;
  min-height: 3.25rem;
  padding: 0.8rem 1rem;
  cursor: pointer;
  list-style: none;
  touch-action: manipulation;
}

.laws-orientation-panel > summary::-webkit-details-marker {
  display: none;
}

.laws-orientation-panel > summary span {
  font-weight: 750;
  color: #f3e4b9;
}

.laws-orientation-panel > summary small {
  color: rgba(226, 231, 241, 0.72);
  line-height: 1.35;
}

.laws-orientation-panel[open] > summary {
  border-bottom: 1px solid rgba(213, 184, 105, 0.18);
}

.laws-orientation-panel__body {
  padding: clamp(0.75rem, 2vw, 1.2rem);
}

.laws-orientation-panel__body > :first-child {
  margin-top: 0;
}

.laws-value-deck {
  display: none !important;
}

.laws-practical-opening,
.laws-first--compact,
.laws-orientation-panel,
.laws-orientation-panel__body,
.laws-orientation-panel__body * {
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .laws-topbar {
    align-items: flex-start;
  }

  .laws-nav {
    justify-content: flex-start;
  }

  .laws-first__compact-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.35rem;
  }

  .laws-first__compact-sequence {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .laws-first__compact-sequence a:last-child {
    grid-column: 1 / -1;
  }

  .laws-orientation-panel > summary {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}

@media (max-width: 430px) {
  .laws-practical-opening,
  .laws-first--compact,
  .laws-discovery--collapsed {
    width: min(100% - 1rem, 76rem);
  }

  .laws-first__compact-sequence {
    grid-template-columns: 1fr;
  }

  .laws-first__compact-sequence a:last-child {
    grid-column: auto;
  }
}
`;

assert(!css.includes(CSS_SENTINEL), 'CSS sentinel unexpectedly present before transform');
css += cssAppend;

assert(html.includes(SENTINEL), 'HTML sentinel missing after transform');
assert(!html.includes('class="laws-value-deck"'), 'redundant route deck survived transform');
assert(count(html, 'data-laws-supporting-panel=') === 3, 'supporting panel count must be three');
assert(count(html, 'data-laws-supporting-panel=') === count(html, '<details class="laws-orientation-panel"'), 'panel markup mismatch');
assert(!/<details class="laws-orientation-panel"[^>]*\sopen(?:\s|=|>)/i.test(html), 'supporting panel unexpectedly open');
assert(count(html, 'The Laws Chamber preserves not only law statements, but also their source history, methods, evidence boundaries, falsification conditions, unresolved tests, and research status.') === 1, 'authorized research statement count must be one');
assert(count(html, 'id="laws-orbit"') === 1, 'Laws Compass identity changed');
assert(count(html, 'data-laws-panel=""') === 1, 'controller panel identity changed');

fs.writeFileSync(HTML_PATH, html, 'utf8');
fs.writeFileSync(CSS_PATH, css, 'utf8');

console.log(JSON.stringify({
  base: BASE,
  html: HTML_PATH,
  css: CSS_PATH,
  removedBlocks: {
    threshold: Boolean(threshold),
    expandedFirst: Boolean(first),
    immediateCapabilityDeck: Boolean(valueDeck),
    orbitIntro: Boolean(orbitIntro),
    closingInvitation: Boolean(closing)
  },
  preservedBlocks: {
    compass: true,
    controllerPanel: true,
    discoveryContent: true,
    accessibilityNote: true
  },
  supportingPanels: 3,
  protectedRuntimeMutation: false
}, null, 2));
