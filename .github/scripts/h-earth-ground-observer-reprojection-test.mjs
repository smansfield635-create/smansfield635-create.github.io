import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const compositor = await import('../../showroom/globe/h-earth/compositor.js');
const {
  H_EARTH_3D_COMPOSITOR_INTENT_TYPES,
  applyHEarth3DCompositorIntent,
  getHEarth3DCompositorState,
  resolveHEarth3DCompositorCameraPose
} = compositor;

function samePosition(left, right, epsilon = 1e-9) {
  return (
    Math.abs(left.x - right.x) <= epsilon &&
    Math.abs(left.y - right.y) <= epsilon &&
    Math.abs(left.z - right.z) <= epsilon
  );
}

function sourcePose() {
  const state = getHEarth3DCompositorState();
  const pose = resolveHEarth3DCompositorCameraPose();
  assert.equal(pose.eligible, true);
  return { state, pose };
}

applyHEarth3DCompositorIntent({
  type: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.resetView
});
const sourceInitial = sourcePose();

for (let index = 0; index < 40; index += 1) {
  const receipt = applyHEarth3DCompositorIntent({
    type: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.orbit,
    yawDeltaDegrees: 0,
    pitchDeltaDegrees: 8
  });
  assert.equal(receipt.accepted, true);
}
const sourceMaximum = sourcePose();
assert.equal(samePosition(sourceMaximum.pose.position, sourceInitial.pose.position), true);
assert.ok(sourceMaximum.pose.up.y > 0);

for (let index = 0; index < 80; index += 1) {
  const receipt = applyHEarth3DCompositorIntent({
    type: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.orbit,
    yawDeltaDegrees: 0,
    pitchDeltaDegrees: -8
  });
  assert.equal(receipt.accepted, true);
}
const sourceMinimum = sourcePose();
assert.equal(samePosition(sourceMinimum.pose.position, sourceInitial.pose.position), true);
assert.ok(sourceMinimum.pose.up.y > 0);

applyHEarth3DCompositorIntent({
  type: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.resetView
});
const sourceBeforeZoom = sourcePose();
const sourceZoomReceipt = applyHEarth3DCompositorIntent({
  type: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.zoom,
  zoomScaleDelta: 0.14
});
assert.equal(sourceZoomReceipt.accepted, true);
const sourceAfterZoom = sourcePose();
assert.equal(samePosition(sourceAfterZoom.pose.position, sourceBeforeZoom.pose.position), true);
assert.ok(sourceAfterZoom.pose.verticalFovDegrees > sourceBeforeZoom.pose.verticalFovDegrees);

const sourceVerticalPanReceipt = applyHEarth3DCompositorIntent({
  type: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.pan,
  horizontalDelta: 0,
  verticalDelta: 25,
  depthDelta: 0
});
const sourceAfterVerticalPan = sourcePose();
assert.equal(samePosition(sourceAfterVerticalPan.pose.position, sourceAfterZoom.pose.position), true);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true
});
const page = await context.newPage();

try {
  await page.goto(
    'http://127.0.0.1:4173/showroom/globe/h-earth/',
    { waitUntil: 'networkidle', timeout: 120000 }
  );
  await page.waitForSelector(
    '#h-earth-3d-renderer-mount .h-earth-3d-render-stage',
    { state: 'attached', timeout: 120000 }
  );
  await page.waitForFunction(() =>
    globalThis.H_EARTH_3D_TOUCH_CAMERA_CONTROL_RECEIPT?.active === true,
    null,
    { timeout: 120000 }
  );

  const box = await page.locator('#h-earth-3d-renderer-mount').boundingBox();
  assert.ok(box);

  const initial = await page.evaluate(async () => {
    const module = await import('./compositor.js');
    return module.resolveHEarth3DCompositorCameraPose();
  });

  async function drag({ pointerId, deltaX, deltaY }) {
    await page.evaluate(({ x, y, pointerId, deltaX, deltaY }) => {
      const mount = document.getElementById('h-earth-3d-renderer-mount');
      const emit = (type, clientX, clientY, buttons) => mount.dispatchEvent(
        new PointerEvent(type, {
          pointerId,
          pointerType: 'touch',
          isPrimary: true,
          clientX,
          clientY,
          buttons,
          bubbles: true,
          cancelable: true
        })
      );
      emit('pointerdown', x, y, 1);
      emit('pointermove', x + deltaX, y + deltaY, 1);
      emit('pointerup', x + deltaX, y + deltaY, 0);
    }, {
      x: box.x + box.width * 0.45,
      y: box.y + box.height * 0.55,
      pointerId,
      deltaX,
      deltaY
    });
    await page.waitForTimeout(80);
  }

  await drag({ pointerId: 701, deltaX: 45, deltaY: -25 });

  await page.waitForFunction(() =>
    globalThis.H_EARTH_3D_TOUCH_CAMERA_LAST_RECEIPT?.gestureMode ===
      'ONE_POINTER_GROUND_OBSERVER_LOOK',
    null,
    { timeout: 30000 }
  );

  const afterLook = await page.evaluate(async () => {
    const module = await import('./compositor.js');
    return {
      pose: module.resolveHEarth3DCompositorCameraPose(),
      receipt: globalThis.H_EARTH_3D_TOUCH_CAMERA_LAST_RECEIPT
    };
  });

  assert.equal(afterLook.receipt?.accepted, true);
  assert.equal(afterLook.receipt?.applied, true);
  assert.equal(afterLook.receipt?.status, 'TOUCH_CAMERA_GESTURE_APPLIED');
  assert.equal(samePosition(afterLook.pose.position, initial.position), true);
  assert.ok(afterLook.pose.up.y > 0);

  for (let index = 0; index < 24; index += 1) {
    await drag({ pointerId: 800 + index, deltaX: 0, deltaY: -180 });
  }

  const afterClamp = await page.evaluate(async () => {
    const module = await import('./compositor.js');
    const state = module.getHEarth3DCompositorState();
    return {
      state,
      pose: module.resolveHEarth3DCompositorCameraPose(),
      receipt: globalThis.H_EARTH_3D_TOUCH_CAMERA_LAST_RECEIPT
    };
  });

  assert.equal(samePosition(afterClamp.pose.position, initial.position), true);
  assert.ok(afterClamp.pose.up.y > 0);
  assert.ok(afterClamp.state.camera.pitchDegrees <= 85);
  assert.ok(afterClamp.state.camera.pitchDegrees >= -85);

  await page.evaluate(({ leftX, rightX, y }) => {
    const mount = document.getElementById('h-earth-3d-renderer-mount');
    const emit = (type, pointerId, x, buttons, isPrimary) => mount.dispatchEvent(
      new PointerEvent(type, {
        pointerId,
        pointerType: 'touch',
        isPrimary,
        clientX: x,
        clientY: y,
        buttons,
        bubbles: true,
        cancelable: true
      })
    );
    emit('pointerdown', 901, leftX, 1, true);
    emit('pointerdown', 902, rightX, 1, false);
    emit('pointermove', 901, leftX + 45, 1, true);
    emit('pointermove', 902, rightX - 45, 1, false);
    emit('pointerup', 901, leftX + 45, 0, true);
    emit('pointerup', 902, rightX - 45, 0, false);
  }, {
    leftX: box.x + box.width * 0.2,
    rightX: box.x + box.width * 0.8,
    y: box.y + box.height * 0.5
  });

  await page.waitForFunction(() =>
    globalThis.H_EARTH_3D_TOUCH_CAMERA_LAST_RECEIPT?.gestureMode ===
      'TWO_POINTER_PINCH_FIELD_OF_VIEW',
    null,
    { timeout: 30000 }
  );
  await page.waitForTimeout(100);

  const afterPinch = await page.evaluate(async () => {
    const module = await import('./compositor.js');
    return {
      pose: module.resolveHEarth3DCompositorCameraPose(),
      receipt: globalThis.H_EARTH_3D_TOUCH_CAMERA_LAST_RECEIPT,
      routeStatus: globalThis.H_EARTH_3D_PUBLIC_STAGE_RECEIPT?.status ?? null,
      stagePresent: Boolean(
        document.querySelector('#h-earth-3d-renderer-mount .h-earth-3d-render-stage')
      )
    };
  });

  assert.equal(afterPinch.receipt?.accepted, true);
  assert.equal(afterPinch.receipt?.applied, true);
  assert.equal(afterPinch.receipt?.status, 'TOUCH_CAMERA_GESTURE_APPLIED');
  assert.equal(samePosition(afterPinch.pose.position, initial.position), true);
  assert.ok(afterPinch.pose.verticalFovDegrees > afterClamp.pose.verticalFovDegrees);
  assert.ok(afterPinch.pose.up.y > 0);
  assert.equal(afterPinch.stagePresent, true);

  fs.mkdirSync('artifacts/h-earth-ground-observer-camera', { recursive: true });
  await page.screenshot({
    path: 'artifacts/h-earth-ground-observer-camera/mobile-ground-observer.png',
    fullPage: true
  });
  fs.writeFileSync(
    'artifacts/h-earth-ground-observer-camera/final-verification.json',
    JSON.stringify({
      result: 'PASS',
      source: {
        initial: sourceInitial,
        maximum: sourceMaximum,
        minimum: sourceMinimum,
        beforeZoom: sourceBeforeZoom,
        afterZoom: sourceAfterZoom,
        verticalPanReceipt: sourceVerticalPanReceipt,
        afterVerticalPan: sourceAfterVerticalPan
      },
      browser: {
        initial,
        afterLook,
        afterClamp,
        afterPinch
      }
    }, null, 2) + '\n'
  );
} finally {
  await browser.close();
}
