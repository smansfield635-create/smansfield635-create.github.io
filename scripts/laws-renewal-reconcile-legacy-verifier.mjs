import fs from 'node:fs';

const file = 'scripts/laws_cp6_contextual_browser_verify.mjs';
let source = fs.readFileSync(file, 'utf8');

function replaceOnce(before, after, label) {
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`);
  source = source.replace(before, after);
}

replaceOnce(
`function canonicalContentIds(html) {
  return new Set([...html.matchAll(/data-content-id="(CP6-CONTENT-\\d+)"/g)].map(match => match[1]));
}
`,
`function canonicalContentIds(html) {
  return new Set([...html.matchAll(/data-content-id="(CP6-CONTENT-\\d+)"/g)].map(match => match[1]));
}

function readCSSGraph(entry, visited = new Set()) {
  const absolute = path.resolve(root, entry);
  if (visited.has(absolute)) return '';
  visited.add(absolute);
  const css = fs.readFileSync(absolute, 'utf8');
  const directory = path.dirname(absolute);
  const imported = [...css.matchAll(/@import\\s+url\\(["']?(\\.\\/[^"')]+)["']?\\)\\s*;/g)]
    .map(match => readCSSGraph(path.resolve(directory, match[1]), visited));
  return [css, ...imported].join('\\n');
}
`,
'add recursive CSS reader'
);

replaceOnce(
`  const sharedCSS = fs.readFileSync('assets/laws-destination/renewal.css', 'utf8');`,
`  const sharedCSS = readCSSGraph('assets/laws-destination/renewal.css');`,
'combine imported CSS'
);

replaceOnce(
`    assert((html.match(/aria-selected="true"/g) || []).length === 1, \`${'${page.name}'}: active entry lens is not singular\`);
    assert(!html.includes('role="tabpanel" hidden'), \`${'${page.name}'}: static panel hidden in source\`);`,
`    assert((html.match(/aria-selected="true"/g) || []).length === 0, \`${'${page.name}'}: a reading control is preselected in source\`);
    assert((html.match(/aria-expanded="false" type="button"/g) || []).length === page.tabs, \`${'${page.name}'}: zero-open source contract is incomplete\`);
    assert((html.match(/<details class="lr-page-facts">/g) || []).length === 1, \`${'${page.name}'}: native Page facts disclosure missing\`);
    assert(!html.includes('role="tabpanel" hidden'), \`${'${page.name}'}: static panel hidden in source\`);`,
'update source entry-state assertions'
);

replaceOnce(
`    auditOpen: Boolean(document.querySelector('.lr-audit')?.open),
    tabs: document.querySelectorAll('[role="tab"]').length,
    panels: document.querySelectorAll('[role="tabpanel"]').length,
    selectedTabs: document.querySelectorAll('[role="tab"][aria-selected="true"]').length,
    visiblePanels: [...document.querySelectorAll('[role="tabpanel"]')].filter(panel => !panel.hidden).length,`,
`    auditOpen: Boolean(document.querySelector('.lr-audit')?.open),
    pageFactsOpen: Boolean(document.querySelector('.lr-page-facts')?.open),
    tabs: document.querySelectorAll('.lr-tab').length,
    panels: document.querySelectorAll('.lr-panel').length,
    expandedControls: document.querySelectorAll('.lr-tab[aria-expanded="true"]').length,
    visiblePanels: [...document.querySelectorAll('.lr-panel')].filter(panel => !panel.hidden && getComputedStyle(panel).display !== 'none').length,`,
'update runtime snapshot selectors'
);

replaceOnce(
`  assert(snapshot.tabs === cohort.tabs && snapshot.panels === cohort.tabs, \`${'${profileName}/${cohort.name}'}: tab/panel count mismatch\`);
  assert(snapshot.selectedTabs === 1 && snapshot.visiblePanels === 1, \`${'${profileName}/${cohort.name}'}: progressive panel state invalid\`);
  assert(snapshot.auditOpen === false, \`${'${profileName}/${cohort.name}'}: audit is not collapsed on entry\`);`,
`  assert(snapshot.tabs === cohort.tabs && snapshot.panels === cohort.tabs, \`${'${profileName}/${cohort.name}'}: control/panel count mismatch\`);
  assert(snapshot.expandedControls === 0 && snapshot.visiblePanels === 0, \`${'${profileName}/${cohort.name}'}: zero-open entry state invalid\`);
  assert(snapshot.pageFactsOpen === false, \`${'${profileName}/${cohort.name}'}: Page facts is not collapsed on entry\`);
  assert(snapshot.auditOpen === false, \`${'${profileName}/${cohort.name}'}: audit is not collapsed on entry\`);`,
'update runtime entry assertions'
);

replaceOnce(
`  const tabs = page.locator('[role="tab"]');
  const selectedIndex = await tabs.evaluateAll(elements => elements.findIndex(element => element.getAttribute('aria-selected') === 'true'));
  const nextIndex = (selectedIndex + 1) % cohort.tabs;
  await tabs.nth(nextIndex).click();
  assert(await tabs.nth(nextIndex).getAttribute('aria-selected') === 'true', \`${'${profileName}/${cohort.name}'}: pointer/touch tab activation failed\`);
  const controlledPanel = await tabs.nth(nextIndex).getAttribute('aria-controls');
  assert(controlledPanel && await page.locator(\`#${'${controlledPanel}'}\`).isVisible(), \`${'${profileName}/${cohort.name}'}: selected panel not visible\`);

  await tabs.nth(nextIndex).focus();
  await page.keyboard.press('End');
  assert(await tabs.nth(cohort.tabs - 1).getAttribute('aria-selected') === 'true', \`${'${profileName}/${cohort.name}'}: End-key tab operation failed\`);
  await page.keyboard.press('Home');
  assert(await tabs.nth(0).getAttribute('aria-selected') === 'true', \`${'${profileName}/${cohort.name}'}: Home-key tab operation failed\`);
  await page.keyboard.press('ArrowRight');
  assert(await tabs.nth(1).getAttribute('aria-selected') === 'true', \`${'${profileName}/${cohort.name}'}: Arrow-key tab operation failed\`);
`,
`  const tabs = page.locator('.lr-tab');
  const panels = page.locator('.lr-panel');
  await tabs.nth(0).click();
  assert(await tabs.nth(0).getAttribute('aria-expanded') === 'true', \`${'${profileName}/${cohort.name}'}: pointer/touch disclosure activation failed\`);
  const controlledPanel = await tabs.nth(0).getAttribute('aria-controls');
  assert(controlledPanel && await page.locator(\`#${'${controlledPanel}'}\`).isVisible(), \`${'${profileName}/${cohort.name}'}: selected panel not visible\`);

  if (cohort.tabs > 1) {
    await tabs.nth(1).click();
    assert(await tabs.nth(0).getAttribute('aria-expanded') === 'false', \`${'${profileName}/${cohort.name}'}: opening a second panel did not close the first\`);
    assert(await tabs.nth(1).getAttribute('aria-expanded') === 'true', \`${'${profileName}/${cohort.name}'}: second panel did not open\`);
    assert(!(await panels.nth(0).isVisible()) && await panels.nth(1).isVisible(), \`${'${profileName}/${cohort.name}'}: exclusive panel visibility failed\`);
    await tabs.nth(1).click();
    assert(await tabs.nth(1).getAttribute('aria-expanded') === 'false', \`${'${profileName}/${cohort.name}'}: active panel did not toggle closed\`);
  } else {
    await tabs.nth(0).click();
  }
  assert((await tabs.evaluateAll(elements => elements.filter(element => element.getAttribute('aria-expanded') === 'true').length)) === 0, \`${'${profileName}/${cohort.name}'}: a panel remained expanded after toggle-close\`);

  await tabs.nth(0).focus();
  await page.keyboard.press('End');
  assert(await tabs.nth(cohort.tabs - 1).evaluate(element => document.activeElement === element), \`${'${profileName}/${cohort.name}'}: End-key focus operation failed\`);
  await page.keyboard.press('Home');
  assert(await tabs.nth(0).evaluate(element => document.activeElement === element), \`${'${profileName}/${cohort.name}'}: Home-key focus operation failed\`);
  if (cohort.tabs > 1) {
    await page.keyboard.press('ArrowRight');
    assert(await tabs.nth(1).evaluate(element => document.activeElement === element), \`${'${profileName}/${cohort.name}'}: Arrow-key focus operation failed\`);
  }
  assert((await tabs.evaluateAll(elements => elements.filter(element => element.getAttribute('aria-expanded') === 'true').length)) === 0, \`${'${profileName}/${cohort.name}'}: keyboard focus movement opened a panel\`);

  const pageFacts = page.locator('.lr-page-facts');
  await pageFacts.locator('summary').click();
  assert(await pageFacts.evaluate(element => element.open), \`${'${profileName}/${cohort.name}'}: Page facts disclosure failed\`);
  await pageFacts.locator('summary').click();
  assert(!(await pageFacts.evaluate(element => element.open)), \`${'${profileName}/${cohort.name}'}: Page facts did not close\`);
`,
'update disclosure interaction matrix'
);

replaceOnce(
`    tabs: cohort.tabs,
    keyboard: true,
    pointerOrTouch: true,
    auditDisclosure: true,`,
`    controls: cohort.tabs,
    initialOpenPanels: 0,
    keyboardFocusWithoutOpen: true,
    pointerOrTouch: true,
    exclusiveOrZeroOpen: true,
    pageFactsDisclosure: true,
    auditDisclosure: true,`,
'update result vocabulary'
);

replaceOnce(
`    const audit = page.locator('.lr-audit');
    assert(!(await audit.evaluate(element => element.open)), \`${'${cohort.name}'}: static audit unexpectedly open\`);
    const summary = audit.locator('summary');
    await summary.focus();
    await summary.press('Enter');
    assert(await audit.evaluate(element => element.open), \`${'${cohort.name}'}: native static audit disclosure failed\`);`,
`    const pageFacts = page.locator('.lr-page-facts');
    assert(await pageFacts.locator('.lr-page-facts__body').isVisible(), \`${'${cohort.name}'}: static Page facts content unavailable\`);
    const audit = page.locator('.lr-audit');
    assert(await audit.locator('.lr-audit__body').isVisible(), \`${'${cohort.name}'}: static audit content unavailable\`);`,
'update static equivalence assertions'
);

fs.writeFileSync(file, source);
console.log(`reconciled ${file}`);
