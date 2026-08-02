import fs from 'node:fs';

const file = 'scripts/verify-laws-renewal-collapsed-entry.mjs';
let source = fs.readFileSync(file, 'utf8');

source = source.replace(
  'const pageFactsCount = (html.match(/<details class="lr-page-facts">/g) || []).length;',
  'const pageFactsCount = (html.match(/<details class="lr-page-facts"(?: open)?>/g) || []).length;'
);
source = source.replace(
  "assert.ok(html.indexOf('<details class=\"lr-page-facts\">') < html.indexOf('class=\"lr-status-grid\"'), `${page.name}: fact grid must be owned by Page facts disclosure`);",
  "assert.ok(html.indexOf('<details class=\"lr-page-facts\" open>') < html.indexOf('class=\"lr-status-grid\"'), `${page.name}: fact grid must be owned by Page facts disclosure`);"
);

if (!source.includes('html.match(/<details class="lr-page-facts"(?: open)?>/g)')) {
  throw new Error('Page facts source count was not corrected');
}
if (source.includes("html.indexOf('<details class=\"lr-page-facts\">')")) {
  throw new Error('Closed-form Page facts ownership assertion remains');
}

fs.writeFileSync(file, source);
console.log(`corrected ${file}`);
