import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const compositor = await import('../../showroom/globe/h-earth/compositor.js');

const {
  H_EARTH_3D_COMPOSITOR_INTENT_TYPES,
  H_EARTH_3D_COMPOSITOR_CAMERA_CONSTRAINTS,
  applyHEarth3DCompositorIntent,
  getHEarth3DCompositorState,
  resolveHEarth3DCompositorCameraPose
} = compositor;

function nearlyEqual(left, right, epsilon = 1e-9) {
  return Math.abs(left - right) <= epsilon;
}

function assertSamePosition(left, right, label) {
  assert.ok(nearlyEqual(left.x, right.x), `${label}:x`);
  assert.ok(nearlyEqual(left.y, right.y), `${label}:y`);
  assert.ok(nearlyEqual(left.z, right.z), `${label}:z`);
}

function currentPose() {
  const state = getHEarth3DCompositorState();
  const pose = resolveHEarth3DCompositorCameraPose();
  assert.equal(pose.eligible, true);
  return { state, pose };
}

applyHEarth3DCompositorIntent({
  type: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.resetView
});

const initial = currentPose();
assert.equal(initial.pose.up.y > 0, true);
assert.equal(initial.pose.position.y, initial.state.camera.target.y);

for (let index = 0; index < 40; index += 1) {
  const receipt = applyHEarth3DCompositorIntent({
    type: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.orbit,
    yawDeltaDegrees: 0,
    pitchDeltaDegrees: 8
  });
  assert.equal(receipt.accepted, true);
}

const maximumPitch = currentPose();
assert.ok(maximumPitch.state.camera.pitchDegrees <= 85);
assert.ok(maximumPitch.state.camera.pitchDegrees >= -85);
assertSamePosition(
  maximumPitch.pose.position,
  initial.pose.position,
  'POSITION_CHANGED_WHILE_LOOKING_DOWN'
);
assert.ok(maximumPitch.pose.up.y > 0);
assert.ok(maximumPitch.pose.forward.y < 0);

for (let index = 0; index < 80; index += 1) {
  const receipt = applyHEarth3DCompositorIntent({
    type: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.orbit,
    yawDeltaDegrees: 0,
    pitchDeltaDegrees: -8
  });
  assert.equal(receipt.accepted, true);
}

const minimumPitch = currentPose();
assert.ok(minimumPitch.state.camera.pitchDegrees <= 85);
assert.ok(minimumPitch.state.camera.pitchDegrees >= -85);
assertSamePosition(
  minimumPitch.pose.position,
  initial.pose.position,
  'POSITION_CHANGED_WHILE_LOOKING_UP'
);
assert.ok(minimumPitch.pose.up.y > 0);
assert.ok(minimumPitch.pose.forward.y > 0);

applyHEarth3DCompositorIntent({
  type: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.resetView
});
const beforeZoom = currentPose();
const zoomReceipt = applyHEarth3DCompositorIntent({
  type: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.zoom,
  zoomScaleDelta: 0.14
});
assert.equal(zoomReceipt.accepted, true);
const afterZoom = currentPose();
assertSamePosition(
  afterZoom.pose.position,
  beforeZoom.pose.position,
  'PINCH_ZOOM_MOVED_OBSERVER'
);
assert.ok(
  afterZoom.pose.verticalFovDegrees >
    beforeZoom.pose.verticalFovDegrees
);

const verticalPanReceipt = applyHEarth3DCompositorIntent({
  type: H_EARTH_3D_COMPOSITOR_INTENT_TYPES.pan,
  horizontalDelta: 0,
  verticalDelta: 25,
  depthDelta: 0
});
assert.equal(verticalPanReceipt.accepted, true);
const afterVerticalPan = currentPose();
assert.equal(
  afterVerticalPan.pose.position.y,
  initial.pose.position.y
);

const sourceAssertions = {
  pitchBounds: H_EARTH_3D_COMPOSITOR_CAMERA_CONSTRAINTS.pitchDegrees,
  initialPosition: initial.pose.position,
  maximumPitch: maximumPitch.state.camera.pitchDegrees,
  minimumPitch: minimumPitch.state.camera.pitchDegrees,
  beforeZoomFov: beforeZoom.pose.verticalFovDegrees,
  afterZoomFov: afterZoom.pose.verticalFovDegrees,
  verticalPanObserverHeight: afterVerticalPan.pose.position.y
};

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

  const mountBox = await page.locator('#h-earth-3d-renderer-mount').boundingBox();
  assert.ok(mountBox);

  async function dragVertical(fromY, toY, pointerId) {
    await page.evaluate(({ x, fromY, toY, pointerId }) => {
      const mount = document.getElementById('h-earth-3d-renderer-mount');
      const emit = (type, y, buttons) => mount.dispatchEvent(
        new PointerEvent(type, {
          pointerId,
          pointerType: 'touch',
          isPrimary: true,
          clientX: x,
          clientY: y,
          buttons,
          bubbles: true,
          cancelable: true
        })
      );
      emit('pointerdown', fromY, 1);
      emit('pointermove', toY, 1);
      emit('pointerup', toY, 0);
    }, {
      x: mountBox.x + mountBox.width * 0.5,
      fromY,
      toY,
      pointerId
    });
    await page.waitForTimeout(50);
  }

  for (let index = 0; index < 24; index += 1) {
    await dragVertical(
      mountBox.y + mountBox.height * 0.55,
      mountBox.y + mountBox.height * 0.1,
      100 + index
    );
  }

  const afterExtremeLook = await page.evaluate(async () => {
    const module = await import('./compositor.js');
    const state = module.getHEarth3DCompositorState();
    const pose = module.resolveHEarth3DCompositorCameraPose();
    return {
      routeStatus:
        document.documentElement.dataset.hEarthRouteStatus ??
        document.body.dataset.hEarthRouteStatus ??
        globalThis.H_EARTH_3D_PUBLIC_STAGE_RECEIPT?.status ??
        null,
      pitchDegrees: state.camera.pitchDegrees,
      position: pose.position,
      up: pose.up,
      forward: pose.forward,
      verticalFovDegrees: pose.verticalFovDegrees,
      lastReceipt: globalThis.H_EARTH_3D_TOUCH_CAMERA_LAST_RECEIPT
    };
  });

  assert.ok(afterExtremeLook.pitchDegrees <= 85);
  assert.ok(afterExtremeLook.pitchDegrees >= -85);
  assert.ok(afterExtremeLook.up.y > 0);
  assert.equal(afterExtremeLook.lastReceipt?.applied, true);

  const beforePinch = await page.evaluate(async () => {
    const module = await import('./compositor.js');
    return module.resolveHEarth3DCompositorCameraPose();
  });

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
    emit('pointerdown', 501, leftX, 1, true);
    emit('pointerdown', 502, rightX, 1, false);
    emit('pointermove', 501, leftX + 55, 1, true);
    emit('pointermove', 502, rightX - 55, 1, false);
    emit('pointerup', 501, leftX + 55, 0, true);
    emit('pointerup', 502, rightX - 55, 0, false);
  }, {
    leftX: mountBox.x + mountBox.width * 0.2,
    rightX: mountBox.x + mountBox.width * 0.8,
    y: mountBox.y + mountBox.height * 0.5
  });
  await page.waitForTimeout(150);

  const afterPinch = await page.evaluate(async () => {
    const module = await import('./compositor.js');
    return module.resolveHEarth3DCompositorCameraPose();
  });

  assertSamePosition(afterPinch.position, beforePinch.position, 'LIVE_PINCH_MOVED_OBSERVER');
  assert.ok(afterPinch.verticalFovDegrees >= beforePinch.verticalFovDegrees);
  assert.ok(afterPinch.up.y > 0);

  fs.mkdirSync('artifacts/h-earth-ground-observer-camera', { recursive: true });
  await page.screenshot({
    path: 'artifacts/h-earth-ground-observer-camera/mobile-ground-observer.png',
    fullPage: true
  });

  fs.writeFileSync(
    'artifacts/h-earth-ground-observer-camera/verification.json',
    JSON.stringify({
      result: 'PASS',
      sourceAssertions,
      browserAssertions: {
        afterExtremeLook,
        beforePinch,
        afterPinch,
        routeMounted: true
      }
    }, null, 2) + '\n'
  );
} finally {
  await browser.close();
}
