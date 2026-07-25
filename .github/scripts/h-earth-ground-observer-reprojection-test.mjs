import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true
});
const page = await context.newPage();

function samePosition(left, right, epsilon = 1e-9) {
  return (
    Math.abs(left.x - right.x) <= epsilon &&
    Math.abs(left.y - right.y) <= epsilon &&
    Math.abs(left.z - right.z) <= epsilon
  );
}

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

  await page.evaluate(({ x, y }) => {
    const mount = document.getElementById('h-earth-3d-renderer-mount');
    const emit = (type, clientX, clientY, buttons) => mount.dispatchEvent(
      new PointerEvent(type, {
        pointerId: 701,
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
    emit('pointermove', x + 45, y - 25, 1);
    emit('pointerup', x + 45, y - 25, 0);
  }, {
    x: box.x + box.width * 0.45,
    y: box.y + box.height * 0.55
  });

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
    emit('pointerdown', 801, leftX, 1, true);
    emit('pointerdown', 802, rightX, 1, false);
    emit('pointermove', 801, leftX + 45, 1, true);
    emit('pointermove', 802, rightX - 45, 1, false);
    emit('pointerup', 801, leftX + 45, 0, true);
    emit('pointerup', 802, rightX - 45, 0, false);
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

  const afterPinch = await page.evaluate(async () => {
    const module = await import('./compositor.js');
    return {
      pose: module.resolveHEarth3DCompositorCameraPose(),
      receipt: globalThis.H_EARTH_3D_TOUCH_CAMERA_LAST_RECEIPT,
      routeStatus: globalThis.H_EARTH_3D_PUBLIC_STAGE_RECEIPT?.status ?? null
    };
  });

  assert.equal(afterPinch.receipt?.accepted, true);
  assert.equal(afterPinch.receipt?.applied, true);
  assert.equal(afterPinch.receipt?.status, 'TOUCH_CAMERA_GESTURE_APPLIED');
  assert.equal(samePosition(afterPinch.pose.position, initial.position), true);
  assert.ok(afterPinch.pose.verticalFovDegrees > afterLook.pose.verticalFovDegrees);
  assert.ok(afterPinch.pose.up.y > 0);

  fs.mkdirSync('artifacts/h-earth-ground-observer-camera', { recursive: true });
  fs.writeFileSync(
    'artifacts/h-earth-ground-observer-camera/reprojection-verification.json',
    JSON.stringify({
      result: 'PASS',
      initial,
      afterLook,
      afterPinch
    }, null, 2) + '\n'
  );
} finally {
  await browser.close();
}
