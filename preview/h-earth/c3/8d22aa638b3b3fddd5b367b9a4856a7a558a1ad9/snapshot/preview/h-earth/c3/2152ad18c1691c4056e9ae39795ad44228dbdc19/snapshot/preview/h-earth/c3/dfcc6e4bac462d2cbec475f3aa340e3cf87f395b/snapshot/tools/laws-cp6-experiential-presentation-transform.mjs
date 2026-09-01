import { readFile, writeFile } from 'node:fs/promises';

const target = 'laws/index.html';
let html = await readFile(target, 'utf8');

const marker = 'data-cp6-experiential-presentation="candidate"';
if (html.includes(marker)) {
  console.log('Laws experiential presentation already installed.');
  process.exit(0);
}

function replaceOnce(pattern, replacement, label) {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const scanner = new RegExp(pattern.source, flags);
  const matches = Array.from(html.matchAll(scanner));
  if (matches.length !== 1) {
    throw new Error(`${label}: expected exactly one match; found ${matches.length}.`);
  }
  html = html.replace(pattern, replacement);
}

replaceOnce(
  /<html\s/,
  '<html data-cp6-experiential-presentation="candidate" ',
  'root presentation marker'
);

const cssLink = `<link data-laws-experience-css="true" href="/laws/index.experience.css?v=LAWS_CP6_EXPERIENTIAL_PRESENTATION_20260801A" rel="stylesheet"/>
<style data-laws-experience-critical="true">
html[data-cp6-experiential-presentation="candidate"] .laws-topbar{height:4rem!important;min-height:0!important;padding:0!important;align-items:center!important;flex-wrap:nowrap!important}
html[data-cp6-experiential-presentation="candidate"] .laws-minimal-nav:not([open])>.laws-nav{display:none!important}
@media(max-width:780px){html[data-cp6-experiential-presentation="candidate"] .laws-topbar{height:3.5rem!important}html[data-cp6-experiential-presentation="candidate"] .laws-chamber-identity,html[data-cp6-experiential-presentation="candidate"] .laws-minimal-nav{align-self:center!important;margin:0!important}}
</style>`;
replaceOnce(
  /(<link data-laws-page-css="true"[^>]+rel="stylesheet"\/>)/,
  `$1\n${cssLink}`,
  'experience stylesheet link'
);

const header = `<header aria-label="Laws header" class="laws-topbar">
<a aria-label="Return to the Main Compass" class="laws-chamber-identity" href="/">
<span>Diamond Gate Bridge</span>
<strong>Laws Chamber</strong>
</a>
<details class="laws-minimal-nav">
<summary aria-label="Open Laws navigation"><span>Explore</span></summary>
<nav aria-label="Laws direct routes" class="laws-nav">
<a href="/">Compass</a>
<a href="/home/">Home</a>
<a href="/laws/categories/">Categories</a>
<a href="/laws/test/">Test</a>
<a href="/laws/research/">Research</a>
<a href="/laws/scientific-law/">Scientific Law</a>
<a href="/frontier/">Frontier</a>
<a href="/gauges/">Gauges</a>
</nav>
</details>
</header>`;

replaceOnce(
  /<header aria-label="Laws header" class="laws-topbar">[\s\S]*?<\/header>/,
  header,
  'minimal chamber header'
);

const heroFirst = `<section aria-labelledby="research-comes-first-title" class="laws-first laws-first--experience" data-visible-first-declaration="true" id="research-comes-first">
<div class="laws-first__prelude"><span>Research method</span></div>
<details class="laws-first__disclosure" data-laws-first-disclosure="">
<summary>
<div class="laws-first__summary-copy">
<h1 id="research-comes-first-title">Research comes <span>F.I.R.S.T.</span></h1>
<p>Before a conclusion is accepted, we ask what changed, what remained intact, what the evidence shows, what shaped the result, and what was actually tested.</p>
</div>
<span class="laws-first__expand-label" aria-hidden="true">Explore the five questions</span>
</summary>
<div class="laws-first__disclosure-body">
<div class="laws-first__question-grid" aria-label="F.I.R.S.T. research questions">
<article data-first-entry="flow" data-laws-experience-question="flow">
<a href="/laws/categories/flow/">Flow</a>
<p>What changed?</p>
</article>
<article data-first-entry="integrity" data-laws-experience-question="integrity">
<a href="/laws/categories/integrity/">Integrity</a>
<p>What remained intact?</p>
</article>
<article data-first-entry="reality" data-laws-experience-question="reality">
<a href="/laws/categories/reality/">Reality</a>
<p>What does the evidence show?</p>
</article>
<article data-first-entry="structure" data-laws-experience-question="structure">
<a href="/laws/categories/structure/">Structure</a>
<p>What conditions shaped the result?</p>
</article>
<article data-first-entry="test" data-laws-experience-question="test">
<a href="/laws/test/">Test</a>
<p>What was actually tested?</p>
</article>
</div>
<article class="laws-first__research-record" data-first-entry="research" data-laws-experience-question="research">
<a href="/laws/research/">Research</a>
<p>Research preserves the answers, sources, methods, results, limitations, and unresolved questions.</p>
</article>
</div>
</details>
</section>`;

replaceOnce(
  /<section aria-labelledby="research-comes-first-title" class="laws-first laws-first--direct"[\s\S]*?<\/section>/,
  heroFirst,
  'modern FIRST opening'
);

replaceOnce(
  /(<section aria-labelledby="research-comes-first-title" class="laws-first laws-first--experience")/,
  `<section class="laws-experience-hero" data-laws-experience-stage="hero" aria-label="Research comes FIRST and the Laws Compass">
<div class="laws-experience-atmosphere" aria-hidden="true"><span></span><span></span><span></span></div>
$1`,
  'hero stage opening'
);

const asideOpen = /(<aside aria-atomic="true" aria-labelledby="laws-controller-panel-title" aria-live="polite" class="laws-controller-panel laws-atlas-key" data-laws-panel="" id="laws-entry-panel">)/;
const speaker = `$1
<div class="laws-compass-speaker" data-laws-experience-speaker="" aria-live="polite">
<p class="laws-compass-speaker__eyebrow" data-laws-experience-speaker-eyebrow="">The question behind the direction</p>
<h2 data-laws-experience-speaker-title="">Choose a direction</h2>
<p class="laws-compass-speaker__body" data-laws-experience-speaker-body="">The Compass turns each authority into one clear question. Select an object to hear what it asks before entering its record.</p>
<div class="laws-compass-speaker__state"><span data-laws-experience-speaker-state="">Compass ready</span></div>
</div>`;
replaceOnce(asideOpen, speaker, 'Compass speaker insertion');

const practical = `<section aria-labelledby="laws-practical-opening-title" class="laws-use-stage" data-laws-experience-stage="use" data-laws-official-gate="" data-laws-practical-opening="" data-laws-threshold-introduction="">
<p class="laws-stage-number">01 / LISTEN</p>
<div>
<h2 id="laws-practical-opening-title">Let the Compass ask the question.</h2>
<p>Select Flow, Integrity, Reality, Structure, Test, or Research. The surrounding light and explanation respond to the Compass state; the existing authorized action remains the only route into a record.</p>
</div>
<div class="laws-stage-signal" aria-hidden="true"></div>
</section>`;

replaceOnce(
  /<section aria-labelledby="laws-practical-opening-title" class="laws-practical-opening"[\s\S]*?<\/section>/,
  `</section>\n${practical}`,
  'hero stage close and direct use stage'
);

replaceOnce(
  /<section aria-label="Laws supporting orientation" class="laws-discovery laws-discovery--collapsed" data-laws-progressive-disclosure="">/,
  `<section aria-label="Laws supporting orientation" class="laws-discovery laws-visitor-paths" data-laws-progressive-disclosure="" data-laws-experience-stage="paths">
<header class="laws-visitor-paths__header">
<p class="laws-stage-number">02 / GO DEEPER</p>
<div>
<h2>Three ways into the chamber.</h2>
<p>Start with the governing ideas, examine the evidence, or inspect the system. The complete records remain available only when you choose to open them.</p>
</div>
</header>`,
  'visitor path stage'
);

html = html
  .replace('<span>Foundations and methods</span>\n    <small>Domain separation, formula custody, and scientific-law orientation.</small>', '<span>Understand the laws</span>\n    <small>The foundations, formulas, and governing ideas.</small>')
  .replace('<span>Evidence and applied work</span>\n    <small>Evidence boundaries, research standing, applied investigations, and auxiliary branches.</small>', '<span>Examine the evidence</span>\n    <small>Research, sources, investigations, findings, and limits.</small>')
  .replace('<span>Routes, runtime, and claim boundaries</span>\n    <small>Route maturity, runtime custody, claim language, and migrated-record custody.</small>', '<span>Inspect the system</span>\n    <small>Routes, implementation boundaries, and technical records.</small>');

for (const expected of ['Understand the laws', 'Examine the evidence', 'Inspect the system']) {
  if (!html.includes(expected)) {
    throw new Error(`visitor path label missing: ${expected}`);
  }
}

const experienceScript = '<script data-laws-child="experience" data-laws-presentation-only="true" defer="" src="/laws/index.experience.js?v=LAWS_CP6_EXPERIENTIAL_PRESENTATION_20260801A"></script>';
replaceOnce(
  /(<script data-laws-child="controller"[^>]+><\/script>)/,
  `$1\n${experienceScript}`,
  'experience script link'
);

await writeFile(target, html, 'utf8');
console.log('Installed Laws CP6 experiential presentation HTML.');
