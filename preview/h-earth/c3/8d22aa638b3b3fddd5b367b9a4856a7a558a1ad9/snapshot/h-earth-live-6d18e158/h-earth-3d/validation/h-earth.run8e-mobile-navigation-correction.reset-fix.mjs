import fs from 'node:fs/promises';

const path = 'showroom/globe/h-earth/functional-landscape/mobile-navigation-controls.js';
let source = await fs.readFile(path, 'utf8');

if (!source.includes("reset.addEventListener('pointerdown', activateReset)")) {
  const before = `  const reset = controls.querySelector('[data-h-earth-mobile-reset]');\n  reset.addEventListener('click', async (event) => {\n    event.preventDefault();\n    event.stopPropagation();\n    stopHold();\n    const navigation = api();\n    if (!navigation?.ready) return;\n    receipt.resetCount += 1;\n    receipt.lastAction = 'RESET_TO_COAST';\n    try {\n      if (typeof navigation.reset === 'function') await navigation.reset();\n      else await navigation.gotoWaypoint('COAST');\n    } catch (error) {\n      receipt.lastError = error instanceof Error ? error.message : String(error);\n      console.error(error);\n    }\n  });`;
  const after = `  const reset = controls.querySelector('[data-h-earth-mobile-reset]');\n  const activateReset = async (event) => {\n    event.preventDefault();\n    event.stopPropagation();\n    stopHold();\n    const navigation = api();\n    if (!navigation?.ready) return;\n    receipt.resetCount += 1;\n    receipt.lastAction = 'RESET_TO_COAST';\n    try {\n      if (typeof navigation.reset === 'function') await navigation.reset();\n      else await navigation.gotoWaypoint('COAST');\n    } catch (error) {\n      receipt.lastError = error instanceof Error ? error.message : String(error);\n      console.error(error);\n    }\n  };\n  reset.addEventListener('pointerdown', activateReset);\n  reset.addEventListener('click', (event) => {\n    if (event.detail === 0) activateReset(event);\n  });`;
  const matches = source.split(before).length - 1;
  if (matches !== 1) throw new Error(`RESET_ACTIVATION_PATTERN_COUNT:${matches}`);
  source = source.replace(before, after);
  await fs.writeFile(path, source, 'utf8');
  console.log('Applied pointerdown Coast reset activation.');
} else {
  console.log('Pointerdown Coast reset activation already present.');
}
