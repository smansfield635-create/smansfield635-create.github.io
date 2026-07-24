import fs from 'node:fs';

const targetPath = 'tools/h-earth-repository-registry-target-4f-audit.mjs';
let source = fs.readFileSync(targetPath, 'utf8');

const removals = [
  "const target2 = execJson('tools/h-earth-repository-registry-audit.mjs');\n",
  "  target2Pass: target2.result === 'PASS' && target2.passedChecks === auditContract.requiredRegressions.target2InstallationAudit,\n",
  "    target2: { result: target2.result, passedChecks: target2.passedChecks, failedChecks: target2.failedChecks.length },\n"
];

for (const removal of removals) {
  if (!source.includes(removal)) {
    throw new Error(`Expected Target 2 dependency fragment not found: ${removal.trim()}`);
  }
  source = source.replace(removal, '');
}

if (source.includes('target2')) {
  throw new Error('Residual Target 2 dependency remains in Target 4F audit.');
}

fs.writeFileSync(targetPath, source, 'utf8');
console.log(JSON.stringify({
  result: 'PASS',
  targetPath,
  removedDependency: 'TARGET_2_PRE_ACCEPTANCE_AUDIT',
  retainedTargets: ['3', '4A', '4B', '4C', '4E']
}));
