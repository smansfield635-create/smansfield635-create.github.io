import fs from 'node:fs';

const file = 'scripts/laws_cp6_contextual_browser_verify.mjs';
let source = fs.readFileSync(file, 'utf8');

const canonicalFunction = `function canonicalContentIds(html) {
  return new Set([...html.matchAll(/data-content-id="(CP6-CONTENT-\\d+)"/g)].map(match => match[1]));
}
`;

const cssGraphFunction = `function readCSSGraph(entry, visited = new Set()) {
  const absolute = path.resolve(root, entry);
  if (visited.has(absolute)) return '';
  visited.add(absolute);
  const css = fs.readFileSync(absolute, 'utf8');
  const directory = path.dirname(absolute);
  const imported = [...css.matchAll(/@import\\s+url\\(["']?(\\.\\/[^"')]+)["']?\\)\\s*;/g)]
    .map(match => readCSSGraph(path.resolve(directory, match[1]), visited));
  return [css, ...imported].join('\\n');
}
`;

if (!source.includes('function readCSSGraph(')) {
  if (!source.includes(canonicalFunction)) throw new Error('canonical content identity function not found');
  source = source.replace(canonicalFunction, `${canonicalFunction}\n${cssGraphFunction}`);
}

source = source.replace(
  "  const sharedCSS = fs.readFileSync('assets/laws-destination/renewal.css', 'utf8');",
  "  const sharedCSS = readCSSGraph('assets/laws-destination/renewal.css');"
);

const legacyPageFactsAssertion = `    assert((html.match(/<details class="lr-page-facts">/g) || []).length === 1, \`${'${page.name}'}: native Page facts disclosure missing\`);`;
const staticPageFactsAssertions = `    assert((html.match(/<details class="lr-page-facts" open>/g) || []).length === 1, \`${'${page.name}'}: static Page facts fallback missing\`);
    assert((html.match(/<details class="lr-audit" open>/g) || []).length === 1, \`${'${page.name}'}: static audit fallback missing\`);
    assert(html.includes("document.documentElement.classList.add('lr-js')"), \`${'${page.name}'}: enhanced-entry bootstrap missing\`);`;

if (source.includes(legacyPageFactsAssertion)) {
  source = source.replace(legacyPageFactsAssertion, staticPageFactsAssertions);
}

const requiredFragments = [
  "function readCSSGraph(",
  "const sharedCSS = readCSSGraph('assets/laws-destination/renewal.css');",
  "a reading control is preselected in source",
  "zero-open source contract is incomplete",
  "static Page facts fallback missing",
  "static audit fallback missing",
  "enhanced-entry bootstrap missing",
  "document.querySelectorAll('.lr-tab').length",
  "zero-open entry state invalid",
  "exclusive panel visibility failed",
  "keyboard focus movement opened a panel",
  "static Page facts content unavailable",
  "static audit content unavailable"
];

for (const fragment of requiredFragments) {
  if (!source.includes(fragment)) throw new Error(`integrated verifier requirement missing: ${fragment}`);
}

if (source.includes("active entry lens is not singular") || source.includes("selectedTabs === 1")) {
  throw new Error('obsolete one-open entry assumption remains');
}

fs.writeFileSync(file, source);
console.log(`reconciled ${file}`);
