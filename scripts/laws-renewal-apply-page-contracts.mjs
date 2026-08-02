import fs from 'node:fs';

const pages = [
  'laws/categories/flow/signals/index.html',
  'laws/categories/reality/measure.html',
  'laws/test/reverse-audit/index.html',
  'laws/research/findings-and-boundaries/index.html',
  'laws/industrial-posture/index.html'
];

const open = '      <dl class="lr-status-grid">';
const close = '      </dl>';

for (const path of pages) {
  const original = fs.readFileSync(path, 'utf8');
  let html = original.replaceAll('LAWS_COMPLETE_RENEWAL_V1', 'LAWS_COMPLETE_RENEWAL_V3');

  if (!html.includes('class="lr-page-facts"')) {
    const start = html.indexOf(open);
    const endStart = html.indexOf(close, start);
    if (start < 0 || endStart < 0) {
      throw new Error(`${path}: hero status grid not found`);
    }

    const end = endStart + close.length;
    const statusGrid = html.slice(start, end);
    const nestedGrid = statusGrid
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n');

    const disclosure = [
      '      <details class="lr-page-facts">',
      '        <summary>Page facts</summary>',
      '        <div class="lr-page-facts__body">',
      nestedGrid,
      '        </div>',
      '      </details>'
    ].join('\n');

    html = `${html.slice(0, start)}${disclosure}${html.slice(end)}`;
  }

  html = html.replaceAll('aria-selected="true"', 'aria-selected="false"');
  html = html.replaceAll(
    'aria-selected="false" type="button"',
    'aria-selected="false" aria-expanded="false" type="button"'
  );

  const tabCount = (html.match(/class="lr-tab"/g) || []).length;
  const collapsedButtonCount = (html.match(/aria-expanded="false" type="button"/g) || []).length;

  if (!html.includes('<details class="lr-page-facts">')) {
    throw new Error(`${path}: page facts disclosure missing after transform`);
  }
  if (html.includes('aria-selected="true"')) {
    throw new Error(`${path}: preselected reading control remains`);
  }
  if (tabCount === 0 || collapsedButtonCount !== tabCount) {
    throw new Error(`${path}: collapsed reading-control source contract mismatch (${collapsedButtonCount}/${tabCount})`);
  }
  if (!html.includes('LAWS_COMPLETE_RENEWAL_V3')) {
    throw new Error(`${path}: shared asset version was not advanced`);
  }

  if (html !== original) {
    fs.writeFileSync(path, html);
    console.log(`updated ${path}`);
  } else {
    console.log(`already compliant ${path}`);
  }
}
