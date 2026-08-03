import assert from 'node:assert/strict';
import {
  overlap,
  detectPairwiseCollisions,
  detectTransitionContext,
  detectVerticalBudget,
  detectCameraRoleDifferentiation,
  detectMobileRouteContinuity,
  validateHumanFactorsReceipt
} from './detectors.mjs';

const box = (left, top, width, height) => ({ left, top, right: left + width, bottom: top + height, width, height });
assert.equal(overlap(box(0, 0, 10, 10), box(20, 20, 10, 10)), null);
assert.ok(overlap(box(0, 0, 20, 20), box(10, 10, 20, 20))?.area === 100);

const collisions = detectPairwiseCollisions({ surfaces: { coordinatePanel: box(0, 100, 200, 80), lensTabs: box(0, 120, 200, 44) } }, [['coordinatePanel', 'lensTabs']]);
assert.equal(collisions[0].code, 'PROHIBITED_REGION_COLLISION');

const context = detectTransitionContext(
  { scrollY: 100, visibility: { title: true, cameraControls: true }, instrumentIdentity: 'A' },
  { scrollY: 260, visibility: { title: false, cameraControls: false }, instrumentIdentity: 'A' }
);
assert.ok(context.some(item => item.code === 'STATE_TRANSITION_SCROLL_DISPLACEMENT'));
assert.equal(context.filter(item => item.code === 'STATE_TRANSITION_ORIENTATION_LOST').length, 2);

const vertical = detectVerticalBudget({
  viewport: { width: 1180, height: 820 },
  surfaces: { title: box(20, 20, 500, 60), cameraControls: box(900, 20, 200, 60), family: box(20, 100, 300, 120), card: box(20, 240, 800, 450), lensTabs: box(20, 760, 500, 80), lensPanel: box(20, 850, 500, 120), coordinatePanel: box(540, 850, 500, 120), stage: box(0, 0, 1180, 1100) },
  stageOverflowY: 'visible',
  continuation: { visible: false, semanticLabel: false }
});
assert.equal(vertical[0].code, 'VERTICAL_BUDGET_UNCOMMUNICATED');

const camera = detectCameraRoleDifferentiation(
  { cardAreaRatio: .35, contextVisibilityCount: 5, contextAreaRatio: .22 },
  { cardAreaRatio: .37, contextVisibilityCount: 5, contextAreaRatio: .21 }
);
assert.ok(camera.some(item => item.code === 'CAMERA_ROLE_DIFFERENTIATION_INSUFFICIENT'));

const route = detectMobileRouteContinuity({ viewport: { width: 390 }, routes: { currentMethodsPresent: true, currentMethodsVisible: false, staticCatalogVisible: true, singleActionNavigationVisible: false } });
assert.equal(route[0].code, 'MOBILE_ROUTE_CONTINUITY_MISSING');

assert.equal(validateHumanFactorsReceipt(null).status, 'UNEVALUABLE_PENDING_HUMAN_FACTORS');
assert.equal(validateHumanFactorsReceipt({ reviewer: { id: 'r1', type: 'HUMAN' }, candidateHead: 'abc', judgments: {
  visualWeightHierarchy: 'PASS', methodsIdentity: 'PASS', visualRhythm: 'PASS', perceptualEffort: 'PASS', cameraRoleClarity: 'PASS', mobileContextContinuity: 'PASS'
} }).status, 'PASS_HUMAN_FACTORS');

console.log(JSON.stringify({ contract: 'METHODS_NATIVE_VISUAL_CONFORMANCE_EXTENSION_v1', detectorTests: 12, result: 'PASS' }, null, 2));
