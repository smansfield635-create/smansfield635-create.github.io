import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const BASE = '6a9b35100bd0207187ce07d3155db9eebd757922';
const HTML_PATH = 'laws/index.html';
const CSS_PATH = 'laws/index.css';
const HTML_SENTINEL = 'data-cp6-direct-language-hierarchy="true"';
const CSS_SENTINEL = 'LAWS_CP6_DIRECT_LANGUAGE_AND_HIERARCHY_CORRECTION_v1';

function fail(message) {
  throw new Error(`[laws-cp6-direct-language-hierarchy-transform] ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function run(...args) {
  return execFileSync(args[0], args.slice(1), { encoding: 'utf8' }).trim();
}

function count(source, needle) {
  return source.split(needle).length - 1;
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
      if (depth === 0) return source.slice(start, token.lastIndex);
    } else {
      depth += 1;
    }
  }
  fail(`unbalanced ${tagName} block at marker: ${marker}`);
}

const mergeBase = run('git', 'merge-base', 'HEAD', BASE);
assert(mergeBase === BASE, `branch is not descended from merged Lane 1 baseline ${BASE}`);

let html = fs.readFileSync(HTML_PATH, 'utf8');
let css = fs.readFileSync(CSS_PATH, 'utf8');

if (html.includes(HTML_SENTINEL) && css.includes(CSS_SENTINEL)) {
  console.log('Direct language and hierarchy correction already applied.');
  process.exit(0);
}

assert(count(html, '<main class="laws-estate" id="main">') === 1, 'unexpected main count');
assert(count(html, '<div class="laws-compass-primary"') === 1, 'unexpected Compass-primary count');
assert(count(html, '<section aria-labelledby="laws-practical-opening-title"') === 1, 'unexpected practical-opening count');
assert(count(html, '<section aria-labelledby="research-comes-first-title"') === 1, 'unexpected F.I.R.S.T. count');
assert(count(html, 'data-laws-progressive-disclosure=""') === 1, 'unexpected supporting-disclosure count');

const compass = extractBalanced(html, '<div class="laws-compass-primary"', 'div');
const practical = extractBalanced(html, '<section aria-labelledby="laws-practical-opening-title"', 'section');
const formerFirst = extractBalanced(html, '<section aria-labelledby="research-comes-first-title"', 'section');
const discovery = extractBalanced(html, '<section aria-label="Laws supporting orientation"', 'section');

const compassAt = html.indexOf(compass);
const practicalAt = html.indexOf(practical);
const firstAt = html.indexOf(formerFirst);
const discoveryAt = html.indexOf(discovery);
assert(compassAt < practicalAt && practicalAt < firstAt && firstAt < discoveryAt, 'merged Lane 1 source order is not the expected Compass → practical → F.I.R.S.T. → support sequence');

const directFirst = `
<section aria-labelledby="research-comes-first-title" class="laws-first laws-first--direct" data-visible-first-declaration="true" id="research-comes-first">
  <details class="laws-first__disclosure" data-laws-first-disclosure="">
    <summary>
      <div class="laws-first__summary-copy">
        <p class="kicker">Research orientation</p>
        <h1 id="research-comes-first-title">Research comes F.I.R.S.T.</h1>
        <p>Research begins with five questions: What changed? What remained intact? What does the evidence show? What structures or limits shaped the result? What was actually tested?</p>
      </div>
      <span class="laws-first__expand-label" aria-hidden="true">Expand the five questions</span>
    </summary>
    <div class="laws-first__disclosure-body">
      <div class="laws-first__question-grid" aria-label="F.I.R.S.T. research questions">
        <article data-first-entry="flow">
          <a href="/laws/categories/flow/">FLOW</a>
          <p>What changed, moved, or developed?</p>
        </article>
        <article data-first-entry="integrity">
          <a href="/laws/categories/integrity/">INTEGRITY</a>
          <p>What remained consistent, complete, and traceable?</p>
        </article>
        <article data-first-entry="reality">
          <a href="/laws/categories/reality/">REALITY</a>
          <p>What does the available evidence actually establish?</p>
        </article>
        <article data-first-entry="structure">
          <a href="/laws/categories/structure/">STRUCTURE</a>
          <p>What conditions, boundaries, and limitations shaped the result?</p>
        </article>
        <article data-first-entry="test">
          <a href="/laws/test/">TEST</a>
          <p>What was tested, how was it tested, and what happened?</p>
        </article>
      </div>
      <article class="laws-first__research-record" data-first-entry="research">
        <a href="/laws/research/">RESEARCH</a>
        <p>Research brings those records together, preserves uncertainty, and distinguishes findings from conclusions that have not yet been established.</p>
      </article>
    </div>
  </details>
</section>`.trim();

const practicalAdjusted = practical
  .replace('<h1 id="laws-practical-opening-title">', '<h2 id="laws-practical-opening-title">')
  .replace('</h1>', '</h2>');
assert(practicalAdjusted.includes('<h2 id="laws-practical-opening-title">'), 'failed to demote practical opening beneath the public F.I.R.S.T. headline');

html = html.replace(compass, '').replace(practical, '').replace(formerFirst, '');
const mainOpen = '<main class="laws-estate" id="main">';
assert(count(html, mainOpen) === 1, 'main opening marker changed unexpectedly');
html = html.replace(mainOpen, `${mainOpen}\n${directFirst}\n${compass}\n${practicalAdjusted}`);

while (html.includes('<details class="laws-raw-receipt-disclosure"')) {
  const rawReceipt = extractBalanced(html, '<details class="laws-raw-receipt-disclosure"', 'details');
  html = html.replace(rawReceipt, '');
}

html = html.replace(
  'data-cp6-lane1-progressive-disclosure="true"',
  'data-cp6-lane1-progressive-disclosure="true" data-cp6-direct-language-hierarchy="true"'
);
html = html.replace(
  'data-laws-css-visual-baseline="compass-first-progressive-disclosure"',
  'data-laws-css-visual-baseline="direct-first-before-preserved-compass"'
);
html = html.replace(
  'data-laws-html-visual-baseline="compass-first-bounded-correction"',
  'data-laws-html-visual-baseline="cp6-direct-language-and-hierarchy-correction"'
);

const receiptInsert = `

CP6 DIRECT LANGUAGE AND HIERARCHY CORRECTION:
- Research comes F.I.R.S.T. is the first public content block after the compact header.
- The F.I.R.S.T. disclosure is collapsed by default and uses direct research questions.
- The existing Laws Compass follows immediately and remains the sole navigational authority.
- The practical explanation follows the Compass.
- Abstract geometric narrative, prototype controls, and raw JSON receipt disclosures are not part of the public landing hierarchy.
- Eight canonical destinations, 48 migrated records, and nine compatibility bindings remain under prior accepted custody.
- Compass runtime, route, destination-page, and canonical-record mutation authority remain false.
`;
assert(count(html, '</template>') === 1, 'unexpected receipt-template count');
html = html.replace('</template>', `${receiptInsert}</template>`);

if (!css.includes(CSS_SENTINEL)) {
  css += `

/* ${CSS_SENTINEL} */
.laws-first.laws-first--direct {
  width: min(76rem, calc(100% - 2rem));
  margin: clamp(0.55rem, 1.4vw, 0.9rem) auto 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  overflow: visible;
}

.laws-first__disclosure {
  border: 1px solid rgba(216, 184, 106, 0.34);
  border-radius: clamp(0.9rem, 2vw, 1.3rem);
  background: linear-gradient(145deg, rgba(12, 19, 34, 0.96), rgba(5, 9, 18, 0.96));
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.055);
  overflow: clip;
}

.laws-first__disclosure > summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1.4rem);
  min-height: clamp(7.2rem, 13vw, 9.2rem);
  padding: clamp(1rem, 2.6vw, 1.55rem) clamp(1rem, 3vw, 1.8rem);
}

.laws-first__disclosure > summary::after {
  right: clamp(0.75rem, 2vw, 1.2rem);
}

.laws-first__summary-copy {
  min-width: 0;
  padding-right: clamp(1.7rem, 4vw, 2.7rem);
}

.laws-first__summary-copy .kicker {
  margin: 0;
}

.laws-first__summary-copy h1 {
  max-width: 18ch;
  margin: 0.2rem 0 0.45rem;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.75rem, 4.8vw, 3.65rem);
  line-height: 0.98;
}

.laws-first__summary-copy p:last-child {
  max-width: 76ch;
  margin: 0;
  color: var(--laws-ink-soft);
  font-size: clamp(0.92rem, 1.6vw, 1.04rem);
  line-height: 1.48;
}

.laws-first__expand-label {
  margin-right: 2.35rem;
  color: var(--laws-gold-hot);
  font-size: 0.75rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.laws-first__disclosure[open] {
  border-color: rgba(243, 217, 139, 0.56);
}

.laws-first__disclosure-body {
  display: grid;
  gap: 0.75rem;
  padding: 0 clamp(1rem, 3vw, 1.8rem) clamp(1rem, 3vw, 1.65rem);
  border-top: 1px solid rgba(216, 184, 106, 0.16);
}

.laws-first__question-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.55rem;
  padding-top: clamp(0.9rem, 2vw, 1.25rem);
}

.laws-first__question-grid article,
.laws-first__research-record {
  min-width: 0;
  padding: 0.8rem 0.85rem;
  border: 1px solid rgba(174, 205, 255, 0.18);
  border-radius: 0.8rem;
  background: rgba(5, 10, 21, 0.72);
}

.laws-first__question-grid a,
.laws-first__research-record a {
  color: var(--laws-gold-hot);
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-decoration: none;
}

.laws-first__question-grid a:hover,
.laws-first__question-grid a:focus-visible,
.laws-first__research-record a:hover,
.laws-first__research-record a:focus-visible {
  color: #fff4c3;
  text-decoration: underline;
  text-underline-offset: 0.22rem;
}

.laws-first__question-grid p,
.laws-first__research-record p {
  margin: 0.4rem 0 0;
  color: var(--laws-ink-soft);
  font-size: 0.88rem;
  line-height: 1.45;
}

.laws-first__research-record {
  display: grid;
  grid-template-columns: minmax(7rem, 0.28fr) minmax(0, 1fr);
  align-items: start;
  gap: 0.75rem;
}

.laws-first__research-record p {
  margin-top: 0;
}

.laws-first--direct + .laws-compass-primary {
  margin-top: clamp(0.6rem, 1.6vw, 1rem);
}

.laws-practical-opening h2 {
  max-width: 24ch;
  margin-block: 0.25rem 0.55rem;
  font-size: clamp(1.55rem, 4vw, 2.55rem);
}

.skip:not(:focus):not(:focus-visible) {
  position: fixed;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

@media (max-width: 860px) {
  .laws-first__question-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .laws-first__research-record {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .laws-first.laws-first--direct {
    width: calc(100% - 0.5rem);
    margin-top: 0.35rem;
  }

  .laws-first__disclosure > summary {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 0.9rem 0.9rem 1rem;
  }

  .laws-first__summary-copy {
    padding-right: 2rem;
  }

  .laws-first__summary-copy h1 {
    font-size: clamp(1.65rem, 9.5vw, 2.65rem);
  }

  .laws-first__expand-label {
    margin: -0.15rem 2.25rem 0 0;
    font-size: 0.69rem;
  }

  .laws-first__question-grid {
    grid-template-columns: 1fr;
  }
}
`;
}

assert(html.includes(HTML_SENTINEL), 'HTML sentinel was not installed');
assert(css.includes(CSS_SENTINEL), 'CSS sentinel was not installed');

fs.writeFileSync(HTML_PATH, html, 'utf8');
fs.writeFileSync(CSS_PATH, css, 'utf8');
console.log('Applied direct CP6 language and hierarchy correction.');
