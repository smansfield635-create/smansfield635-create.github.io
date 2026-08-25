import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sourcePath = path.resolve('scripts/laws_cp6_final_browser_verify.mjs');
const runtimeDir = path.resolve('artifacts/laws-cp6-final-synchronization/runtime');
const runtimePath = path.join(runtimeDir, 'laws_cp6_final_browser_verify.corrected.mjs');

const corrections = [
  {
    from: `buttons.locator('[aria-expanded="true"]')`,
    to: `group.locator('.lr-tab[aria-expanded="true"]')`,
    expected: 2,
    label: 'expanded-reading locators',
  },
  {
    from: `audit.locator('summary')`,
    to: `audit.locator(':scope > summary')`,
    expected: 2,
    label: 'direct audit-summary locators',
  },
  {
    from: `await applied.locator('button.laws-rolodex-enter').click();`,
    to: `const appliedField = rolodex.locator('.laws-rolodex-field[data-rolodex-id="research"]');
        assert(await appliedField.count() === 1, '/laws/: research rolodex field missing');
        assert(await appliedField.locator('.laws-rolodex-card[data-destination-id="applied-investigations"]').count() === 1, '/laws/: applied investigations not in research rolodex field');
        if (await appliedField.getAttribute('aria-hidden') === 'true') {
          const appliedFieldId = await appliedField.getAttribute('id');
          assert(appliedFieldId, '/laws/: research rolodex field id missing');
          const researchTab = rolodex.locator(\`.laws-destination-stage__tab[aria-controls="\${appliedFieldId}"]\`);
          assert(await researchTab.count() === 1, '/laws/: research destination-family tab missing');
          await researchTab.click();
          await page.waitForFunction(
            () => document.querySelector('.laws-rolodex-field[data-rolodex-id="research"]')?.getAttribute('aria-hidden') === 'false',
          );
        }
        const appliedViewport = appliedField.locator('.laws-rolodex-viewport');
        const appliedCardCount = await appliedField.locator('.laws-rolodex-card').count();
        await appliedViewport.focus();
        for (let step = 0; step < appliedCardCount && await applied.getAttribute('data-active') !== 'true'; step += 1) {
          const previousDestinationId = await appliedField.locator('.laws-rolodex-card[data-active="true"]').getAttribute('data-destination-id');
          await page.keyboard.press('ArrowRight');
          await page.waitForFunction(
            previous => document.querySelector('.laws-rolodex-field[data-rolodex-id="research"] .laws-rolodex-card[data-active="true"]')?.dataset.destinationId !== previous,
            previousDestinationId,
          );
        }
        assert(await applied.getAttribute('data-active') === 'true', '/laws/: applied investigations card did not become active');
        await applied.locator('button.laws-rolodex-enter').click();`,
    expected: 1,
    label: 'Applied Investigations inactive-card click',
  },
];

let corrected = fs.readFileSync(sourcePath, 'utf8');
for (const correction of corrections) {
  const count = corrected.split(correction.from).length - 1;
  if (count !== correction.expected) {
    throw new Error(`Expected exactly ${correction.expected} ${correction.label}; found ${count}`);
  }
  corrected = corrected.replaceAll(correction.from, correction.to);
}

fs.mkdirSync(runtimeDir, { recursive: true });
fs.writeFileSync(runtimePath, corrected, 'utf8');

await import(`${pathToFileURL(runtimePath).href}?execution=${Date.now()}`);
