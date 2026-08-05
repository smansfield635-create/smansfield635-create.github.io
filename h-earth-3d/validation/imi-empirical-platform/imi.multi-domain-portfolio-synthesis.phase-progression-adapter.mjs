import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const planPath = path.join(
  process.cwd(),
  'h-earth-3d/control-plane/imi-empirical-platform/IMI_SCOPE_GENERALIZABILITY_AND_PRACTICAL_VALUE_FIVE_PHASE_PLAN_v1.json'
);

const originalText = await readFile(planPath, 'utf8');
const originalPlan = JSON.parse(originalText);
const phase1 = originalPlan.phases?.find((phase) => phase.phase === 1);

if (phase1?.status !== 'PASS_CLOSED') {
  throw new Error('PHASE_1_NOT_CLOSED_FOR_PROGRESSION_ADAPTER');
}

const verificationProjection = {
  ...originalPlan,
  currentDecision: 'EXECUTE_PHASE_1_ONLY'
};

try {
  await writeFile(planPath, `${JSON.stringify(verificationProjection, null, 2)}\n`, 'utf8');
  await import('./imi.multi-domain-portfolio-synthesis.runtime-boundary-adapter.mjs');
} finally {
  await writeFile(planPath, originalText, 'utf8');
}
