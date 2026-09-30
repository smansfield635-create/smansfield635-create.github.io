/**
 * Restores the accepted H-Earth public interaction model without adding a
 * controller surface. Navigation state changes immediately during gestures;
 * the expensive Run 8E successor raster is committed once the gesture settles.
 */
const root = document.getElementById('h-earth-functional-landscape-route');
const mount = document.getElementById('h-earth-functional-landscape-mount');
const canvas = document.getElementById('h-earth-functional-landscape-canvas');

if (!root || !mount || !canvas) {
  throw new Error('H-Earth direct-manipulation host is incomplete.');
}

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

const pointers = new Map();
let singleLast = null;
let multiLast = null;
let pendingLookX = 0;
let pendingLookY = 0;
let pendingMoveY = 0;
let pendingPinch = 0;
let flushRequested = false;
let settleTimer = null;
let navigationChain = Promise.resolve();
let commitPromise = null;
let commitPending = false;
let previewX = 0;
let previewY = 0;
let previewScale = 1;

const diagnostics = {
  interactionModel: 'DIRECT_MANIPULATION_PRESERVED',
  oneFingerLook: true,
  twoFingerTravel: true,
  pinchZoom: true,
  visibleControllerPresent: false,
  pointerMoveCount: 0,
  navigationIntentCount: 0,
  previewFrameCount: 0,
  committedRenderCount: 0,
  coalescedCommitCount: 0,
  maximumNavigationLatencyMilliseconds: 0,
  lastNavigationLatencyMilliseconds: 0,
  lastIntent: null,
  lastError: null
};

const landscapeApi = () => window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F;
const successorApi = () => window.H_EARTH_RUN8E_PUBLIC_ROUTE;

const markUsed = () => {
  root.dataset.gestureUsed = 'true';
  root.dataset.directInspectionActive = 'true';
};

const distance = (left, right) =>
  Math.hypot(right.x - left.x, right.y - left.y);

const centroid = (left, right) => ({
  x: (left.x + right.x) / 2,
  y: (left.y + right.y) / 2
});

function applyPreview() {
  const x = clamp(previewX, -26, 26);
  const y = clamp(previewY, -20, 20);
  const scale = clamp(previewScale, 1, 1.075);
  canvas.style.willChange = 'transform';
  canvas.style.transformOrigin = '50% 50%';
  canvas.style.transform =
    `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  diagnostics.previewFrameCount += 1;
}

function resetPreview() {
  previewX = 0;
  previewY = 0;
  previewScale = 1;
  canvas.style.transform = '';
  canvas.style.transformOrigin = '';
  canvas.style.willChange = '';
  root.dataset.directInspectionActive = 'false';
}

function queueNavigation(intent) {
  const enqueuedAt = performance.now();
  diagnostics.navigationIntentCount += 1;
  diagnostics.lastIntent = intent.action;

  navigationChain = navigationChain
    .then(async () => {
      const api = landscapeApi();
      if (!api?.ready) return null;
      const dispatch = typeof api.dispatchNavigationOnly === 'function'
        ? api.dispatchNavigationOnly.bind(api)
        : api.dispatch.bind(api);
      const result = await dispatch(intent);
      const latency = performance.now() - enqueuedAt;
      diagnostics.lastNavigationLatencyMilliseconds = latency;
      diagnostics.maximumNavigationLatencyMilliseconds = Math.max(
        diagnostics.maximumNavigationLatencyMilliseconds,
        latency
      );
      return result;
    })
    .catch((error) => {
      diagnostics.lastError = error instanceof Error ? error.message : String(error);
      console.error(error);
      return null;
    });

  return navigationChain;
}

async function commitSuccessorRender() {
  window.clearTimeout(settleTimer);
  settleTimer = null;
  await navigationChain;

  const api = successorApi();
  if (!api || typeof api.refresh !== 'function') {
    resetPreview();
    return null;
  }

  if (commitPromise) {
    commitPending = true;
    diagnostics.coalescedCommitCount += 1;
    return commitPromise;
  }

  commitPromise = api.refresh()
    .then((receipt) => {
      diagnostics.committedRenderCount += 1;
      return receipt;
    })
    .catch((error) => {
      diagnostics.lastError = error instanceof Error ? error.message : String(error);
      console.error(error);
      return null;
    })
    .finally(() => {
      commitPromise = null;
      resetPreview();
      if (commitPending) {
        commitPending = false;
        queueMicrotask(() => commitSuccessorRender());
      }
    });

  return commitPromise;
}

function scheduleCommit(delay = 48) {
  window.clearTimeout(settleTimer);
  settleTimer = window.setTimeout(() => {
    commitSuccessorRender();
  }, delay);
}

function nextGestureIntent() {
  if (Math.abs(pendingPinch) >= 5) {
    const delta = pendingPinch;
    pendingPinch = 0;
    return {
      action: delta > 0 ? 'ZOOM_IN' : 'ZOOM_OUT',
      degrees: Math.min(6, Math.max(1, Math.abs(delta) / 12))
    };
  }

  if (Math.abs(pendingMoveY) >= 8) {
    const delta = pendingMoveY;
    pendingMoveY = 0;
    return {
      action: delta < 0 ? 'MOVE_FORWARD' : 'MOVE_BACKWARD',
      magnitude: Math.min(10, Math.max(1, Math.abs(delta) / 10))
    };
  }

  if (Math.max(Math.abs(pendingLookX), Math.abs(pendingLookY)) >= 3) {
    const horizontal = Math.abs(pendingLookX) >= Math.abs(pendingLookY);
    const delta = horizontal ? pendingLookX : pendingLookY;
    if (horizontal) pendingLookX = 0;
    else pendingLookY = 0;
    return {
      action: horizontal
        ? (delta > 0 ? 'TURN_RIGHT' : 'TURN_LEFT')
        : (delta < 0 ? 'PITCH_UP' : 'PITCH_DOWN'),
      degrees: Math.min(8, Math.max(0.5, Math.abs(delta) / 9))
    };
  }

  return null;
}

function pendingIntentPresent() {
  return Math.abs(pendingPinch) >= 5 ||
    Math.abs(pendingMoveY) >= 8 ||
    Math.max(Math.abs(pendingLookX), Math.abs(pendingLookY)) >= 3;
}

function queueFlush() {
  if (flushRequested) return;
  flushRequested = true;
  requestAnimationFrame(() => {
    flushRequested = false;
    const intent = nextGestureIntent();
    if (!intent) return;
    markUsed();
    queueNavigation(intent).finally(() => {
      if (pendingIntentPresent()) queueFlush();
    });
  });
}

function resetPointerBaselines() {
  const active = [...pointers.values()];
  if (active.length === 1) {
    singleLast = { ...active[0] };
    multiLast = null;
  } else if (active.length >= 2) {
    const center = centroid(active[0], active[1]);
    multiLast = {
      center,
      distance: distance(active[0], active[1])
    };
    singleLast = null;
  } else {
    singleLast = null;
    multiLast = null;
  }
}

mount.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  pointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY,
    pointerType: event.pointerType
  });
  try {
    mount.setPointerCapture(event.pointerId);
  } catch {
    // Synthetic browser tests may not expose pointer capture.
  }
  markUsed();
  resetPointerBaselines();
}, true);

mount.addEventListener('pointermove', (event) => {
  if (!pointers.has(event.pointerId)) return;
  event.preventDefault();
  diagnostics.pointerMoveCount += 1;
  pointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY,
    pointerType: event.pointerType
  });

  const active = [...pointers.values()];
  if (active.length === 1 && singleLast) {
    const deltaX = active[0].x - singleLast.x;
    const deltaY = active[0].y - singleLast.y;
    pendingLookX += deltaX;
    pendingLookY += deltaY;
    previewX -= deltaX * 0.22;
    previewY -= deltaY * 0.18;
    singleLast = { ...active[0] };
    applyPreview();
    queueFlush();
    return;
  }

  if (active.length >= 2) {
    const center = centroid(active[0], active[1]);
    const currentDistance = distance(active[0], active[1]);
    if (multiLast) {
      const centerDeltaY = center.y - multiLast.center.y;
      const distanceDelta = currentDistance - multiLast.distance;
      const pinchDominant = Math.abs(distanceDelta) >
        Math.max(3, Math.abs(centerDeltaY) * 0.65);

      if (pinchDominant) {
        pendingPinch += distanceDelta;
        previewScale += distanceDelta * 0.0014;
      } else {
        pendingMoveY += centerDeltaY;
        previewScale += -centerDeltaY * 0.0009;
      }
      applyPreview();
    }
    multiLast = { center, distance: currentDistance };
    queueFlush();
  }
}, { capture: true, passive: false });

function releasePointer(event) {
  if (!pointers.has(event.pointerId)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  pointers.delete(event.pointerId);
  resetPointerBaselines();
  queueFlush();
  if (pointers.size === 0) scheduleCommit(40);
}

mount.addEventListener('pointerup', releasePointer, true);
mount.addEventListener('pointercancel', releasePointer, true);

mount.addEventListener('wheel', (event) => {
  event.preventDefault();
  const api = landscapeApi();
  if (!api?.ready) return;
  markUsed();
  const intent = event.ctrlKey
    ? {
        action: event.deltaY < 0 ? 'ZOOM_IN' : 'ZOOM_OUT',
        degrees: Math.min(6, Math.max(1, Math.abs(event.deltaY) / 80))
      }
    : {
        action: event.deltaY < 0 ? 'MOVE_FORWARD' : 'MOVE_BACKWARD',
        magnitude: Math.min(10, Math.max(1, Math.abs(event.deltaY) / 70))
      };
  previewScale += event.deltaY < 0 ? 0.012 : -0.009;
  applyPreview();
  queueNavigation(intent);
  scheduleCommit(120);
}, { passive: false });

window.H_EARTH_RUN8E_DIRECT_INSPECTION = {
  ready: true,
  async commit() {
    return commitSuccessorRender();
  },
  getReceipt() {
    return JSON.parse(JSON.stringify({
      ...diagnostics,
      activePointerCount: pointers.size,
      pendingIntentPresent: pendingIntentPresent(),
      previewActive: canvas.style.transform !== '',
      controllerElementPresent:
        document.getElementById('h-earth-run8e-mobile-navigation-controls') !== null
    }));
  }
};
