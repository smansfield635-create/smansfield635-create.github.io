import fs from 'node:fs';

const pages = [
  'laws/categories/flow/signals/index.html',
  'laws/categories/reality/measure.html',
  'laws/test/reverse-audit/index.html',
  'laws/research/findings-and-boundaries/index.html',
  'laws/industrial-posture/index.html'
];

for (const file of pages) {
  let html = fs.readFileSync(file, 'utf8');

  if (!html.includes("document.documentElement.classList.add('lr-js')")) {
    html = html.replace(
      '  <link rel="stylesheet" href="/assets/laws-destination/renewal.css?v=LAWS_COMPLETE_RENEWAL_V3">',
      '  <script>document.documentElement.classList.add(\'lr-js\')</script>\n  <link rel="stylesheet" href="/assets/laws-destination/renewal.css?v=LAWS_COMPLETE_RENEWAL_V3">'
    );
  }

  html = html.replace('<details class="lr-page-facts">', '<details class="lr-page-facts" open>');
  html = html.replace('<details class="lr-audit">', '<details class="lr-audit" open>');

  if ((html.match(/<details class="lr-page-facts" open>/g) || []).length !== 1) {
    throw new Error(`${file}: static Page facts fallback not established`);
  }
  if ((html.match(/<details class="lr-audit" open>/g) || []).length !== 1) {
    throw new Error(`${file}: static audit fallback not established`);
  }
  if (!html.includes("document.documentElement.classList.add('lr-js')")) {
    throw new Error(`${file}: enhanced-entry bootstrap missing`);
  }

  fs.writeFileSync(file, html);
}

const engineFile = 'assets/laws-destination/renewal.js';
let engine = fs.readFileSync(engineFile, 'utf8');
if (!engine.includes("root.classList.add('lr-runtime-ready')")) {
  engine = engine.replace(
    "  root.dataset.lrEntryDisclosureState = 'collapsed';",
    "  root.dataset.lrEntryDisclosureState = 'collapsed';\n  root.classList.add('lr-runtime-ready');"
  );
}
if (!engine.includes("root.classList.add('lr-runtime-ready')")) {
  throw new Error('Shared runtime readiness marker missing');
}
fs.writeFileSync(engineFile, engine);

const verifierFile = 'scripts/verify-laws-renewal-collapsed-entry.mjs';
let verifier = fs.readFileSync(verifierFile, 'utf8');
verifier = verifier.replace(
  "    assert.ok(!/<details class=\"(?:lr-page-facts|lr-audit)\"[^>]*\\sopen(?:\\s|>)/.test(html), `${page.name}: source disclosure must not be open`);",
  "    assert.ok(html.includes('<details class=\"lr-page-facts\" open>'), `${page.name}: static Page facts fallback must be open in source`);\n    assert.ok(html.includes('<details class=\"lr-audit\" open>'), `${page.name}: static audit fallback must be open in source`);\n    assert.ok(html.includes(\"document.documentElement.classList.add('lr-js')\"), `${page.name}: pre-paint enhanced-entry bootstrap missing`);"
);
if (verifier.includes('source disclosure must not be open')) {
  throw new Error('Permanent verifier retained obsolete closed-source assertion');
}
fs.writeFileSync(verifierFile, verifier);

console.log('applied static/no-JavaScript equivalence to five Laws pages and shared runtime');
