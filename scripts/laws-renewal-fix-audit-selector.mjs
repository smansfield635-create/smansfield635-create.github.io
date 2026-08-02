import fs from 'node:fs';

const file = 'scripts/laws_cp6_contextual_browser_verify.mjs';
let source = fs.readFileSync(file, 'utf8');
const before = "  await audit.locator('summary').click();";
const after = "  await audit.locator(':scope > summary').click();";

if (source.includes(before)) source = source.replace(before, after);
if (!source.includes(after)) throw new Error('direct canonical-audit summary selector missing');
fs.writeFileSync(file, source);
console.log(`corrected ${file}`);
