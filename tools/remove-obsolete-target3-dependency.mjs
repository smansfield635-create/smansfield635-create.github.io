import fs from 'node:fs';

const path = 'tools/h-earth-repository-registry-target-4f-audit.mjs';
let text = fs.readFileSync(path, 'utf8');
const removals = [
  "const target3 = execJson('tools/h-earth-repository-registry-target-3-audit.mjs');\n",
  "  target3Pass: target3.result === 'PASS' && target3.passedChecks === auditContract.requiredRegressions.target3InstructionAudit,\n",
  "    target3: { result: target3.result, passedChecks: target3.passedChecks, failedChecks: target3.failedChecks.length },\n"
];
for (const line of removals) {
  if (!text.includes(line)) throw new Error(`Expected dependency line not found: ${line.trim()}`);
  text = text.replace(line, '');
}
if (/\btarget3\b/.test(text)) throw new Error('Residual target3 dependency remains');
fs.writeFileSync(path, text, 'utf8');
