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
    to: `const appliedField = rolodex.locator('.laws-rolodex-field[data-rolodex-id]').filter({ has: applied });
        assert(await appliedField.count() === 1, '/laws/: applied investigations rolodex field missing');
        const appliedViewport = appliedField.locator('.laws-rolodex-viewport');
        const appliedCardCount = await appliedField.locator('.laws-rolodex-card').count();
        const appliedRolodexId = await appliedField.getAttribute('data-rolodex-id');
        assert(appliedRolodexId, '/laws/: applied investigations rolodex id missing');
        await appliedViewport.focus();
        for (let step = 0; step < appliedCardCount && await applied.getAttribute('data-active') !== 'true'; step += 1) {
          const previousDestinationId = await appliedField.locator('.laws-rolodex-card[data-active="true"]').getAttribute('data-destination-id');
          await page.keyboard.press('ArrowRight');
          await page.waitForFunction(
            ({ rolodexId, previous }) => {
              const field = Array.from(document.querySelectorAll('.laws-rolodex-field[data-rolodex-id]')).find(node => node.dataset.rolodexId === rolodexId);
              return field?.querySelector('.laws-rolodex-card[data-active="true"]')?.dataset.destinationId !== previous;
            },
            { rolodexId: appliedRolodexId, previous: previousDestinationId },
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
