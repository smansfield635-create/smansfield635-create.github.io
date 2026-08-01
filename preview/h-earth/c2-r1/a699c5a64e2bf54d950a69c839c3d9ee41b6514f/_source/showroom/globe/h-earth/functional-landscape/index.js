import {
  constructHEarthFunctionalLandscapeFrame
} from '../render/functional-landscape-frame.js';

import {
  applyHEarthFunctionalLandscapeCameraRevision,
  constructHEarthFunctionalLandscapeRendererHandoff
} from '../render/functional-landscape-compositor.js';

import {
  rasterizeHEarthFunctionalLandscapePlan
} from '../render/renderer.functional-landscape.js';

import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS,
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  createHEarthFunctionalLandscapeCamera,
  evaluateHEarthFunctionalLandscapeNavigationState
} from './navigation.js';

const root = document.getElementById('h-earth-functional-landscape-route');
const mount = document.getElementById('h-earth-functional-landscape-mount');
const canvas = document.getElementById('h-earth-functional-landscape-canvas');
const statusNode = document.getElementById('route-status');
const context = canvas.getContext('2d', { alpha: false });

const hud = {
  waypoint: document.getElementById('hud-waypoint'),
  address: document.getElementById('hud-address'),
  position: document.getElementById('hud-position'),
  terrain: document.getElementById('hud-terrain'),
  clearance: document.getElementById('hud-clearance'),
  chunk: document.getElementById('hud-chunk'),
  formation: document.getElementById('hud-formation'),
  frame: document.getElementById('hud-frame')
};

const clonePlain = (value) => JSON.parse(JSON.stringify(value));
const round = (value, precision = 2) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

const initialNavigation =
  createHEarthFunctionalLandscapeNavigationState();

if (!initialNavigation.ok) {
  throw new Error(
    `Initial navigation failed: ${initialNavigation.issues.join(', ')}`
  );
}

const baseFrame = constructHEarthFunctionalLandscapeFrame({
  frameOccurrenceId:
    'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_BROWSER_BASE_FRAME',
  transferOccurrenceId:
    'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_BROWSER_TRANSFER',
  revision: 1
});

if (!baseFrame.ok) {
  throw new Error(
    `Functional landscape frame failed: ${baseFrame.issues.join(', ')}`
  );
}

let navigationState = initialNavigation.state;
let renderSequence = 0;
let lastWaypointId = 'COAST';
let rendering = false;
let rerenderPending = false;
let lastBrowserReceipt = null;
let lastHandoff = null;
const visitedWaypoints = new Set(['COAST']);

const internalExtent = () => {
  const cssWidth = Math.max(240, mount.clientWidth || 640);
  const cssHeight = Math.max(180, mount.clientHeight || 360);
  const scale = Math.min(
    1,
    480 / cssWidth,
    320 / cssHeight
  );
  return {
    width: Math.max(200, Math.floor(cssWidth * scale)),
    height: Math.max(150, Math.floor(cssHeight * scale))
  };
};

const alphaClosed = (rgba) => {
  for (let index = 3; index < rgba.length; index += 4) {
    if (rgba[index] !== 255) {
      return false;
    }
  }
  return true;
};

function updateWaypointButtons() {
  document.querySelectorAll('[data-waypoint]').forEach((button) => {
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.waypoint === lastWaypointId)
    );
  });
}

function updateHud(frame, raster, handoff) {
  const state = navigationState;
  const waypoint = H_EARTH_FUNCTIONAL_LANDSCAPE_WAYPOINTS[
    lastWaypointId
  ];
  hud.waypoint.textContent = waypoint?.label ?? state.physicalRole;
  hud.address.textContent = state.selectedSemanticAddressId;
  hud.position.textContent =
    `${round(state.position.x)}, ${round(state.position.y)}, ${round(state.position.z)}`;
  hud.terrain.textContent = `${round(state.terrainElevation)} elevation`;
  hud.clearance.textContent =
    `${round(state.clearance)}${state.recovered ? ' · recovered' : ''}`;
  hud.chunk.textContent = state.chunkId;
  hud.formation.textContent = state.formationIds.length > 0
    ? state.formationIds.join(' · ')
    : 'Coastal terrain';
  hud.frame.textContent =
    `${frame.cameraRevision} · ${handoff.renderPlan.triangles.length} triangles`;

  lastBrowserReceipt = {
    receiptType: 'H_EARTH_FUNCTIONAL_LANDSCAPE_RUN_6F_BROWSER_RECEIPT',
    eligible: true,
    status: 'RUN_6F_BROWSER_FRAME_COMPLETE',
    renderSequence,
    frameId: frame.frameId,
    cameraRevision: frame.cameraRevision,
    position: clonePlain(state.position),
    terrainElevation: state.terrainElevation,
    clearance: state.clearance,
    recovered: state.recovered,
    chunkId: state.chunkId,
    physicalRole: state.physicalRole,
    selectedSemanticAddressId: state.selectedSemanticAddressId,
    formationIds: [...state.formationIds],
    visitedWaypoints: [...visitedWaypoints],
    viewport: {
      cssWidth: mount.clientWidth,
      cssHeight: mount.clientHeight,
      internalWidth: raster.width,
      internalHeight: raster.height,
      orientation: window.innerWidth >= window.innerHeight
        ? 'LANDSCAPE'
        : 'PORTRAIT'
    },
    admittedPrimitiveCount: baseFrame.primitiveCount,
    semanticAddressCount: baseFrame.semanticAddressCount,
    terrainAddressCount: baseFrame.terrainAddressCount,
    shorelineWaterAddressCount: baseFrame.shorelineWaterAddressCount,
    proxyAddressCount: baseFrame.proxySummarizedAddressCount,
    acceptedTriangleCount: handoff.renderPlan.triangles.length,
    rejectedFragmentCount: handoff.renderPlan.rejected.length,
    writtenPixelCount: raster.writtenPixelCount,
    skyAlphaClosed: alphaClosed(raster.rgba),
    semanticSelectionPresent:
      typeof state.selectedSemanticAddressId === 'string',
    cameraTerrainClearancePass:
      state.clearance >= 1.6,
    packet001Altered: false,
    existingPublicRouteReplaced: false,
    productionAuthority: false,
    issues: []
  };

  updateWaypointButtons();
}

async function renderCurrentState() {
  if (rendering) {
    rerenderPending = true;
    return lastBrowserReceipt;
  }

  rendering = true;
  statusNode.textContent = 'Projecting governed landscape…';

  try {
    const evaluation =
      evaluateHEarthFunctionalLandscapeNavigationState(
        navigationState
      );
    if (!evaluation.eligible) {
      throw new Error(
        `Navigation state failed: ${evaluation.issues.join(', ')}`
      );
    }

    renderSequence += 1;
    const camera = createHEarthFunctionalLandscapeCamera(
      navigationState
    );
    const frame = applyHEarthFunctionalLandscapeCameraRevision({
      baseFrame,
      camera,
      cameraRevision: renderSequence
    });
    if (!frame.ok) {
      throw new Error(
        `Camera frame failed: ${frame.issues.join(', ')}`
      );
    }

    const extent = internalExtent();
    const handoff =
      constructHEarthFunctionalLandscapeRendererHandoff({
        frame,
        materializationExtent: extent
      });
    if (!handoff.ok) {
      throw new Error(
        `Compositor handoff failed: ${handoff.issues.join(', ')}`
      );
    }

    const raster = rasterizeHEarthFunctionalLandscapePlan(
      handoff.renderPlan
    );
    if (!raster.ok) {
      throw new Error(`Raster failed: ${raster.status}`);
    }

    canvas.width = raster.width;
    canvas.height = raster.height;
    context.putImageData(
      new ImageData(raster.rgba, raster.width, raster.height),
      0,
      0
    );

    lastHandoff = handoff;
    updateHud(frame, raster, handoff);
    statusNode.textContent = navigationState.recovered
      ? 'Terrain clearance recovered. Landscape stable.'
      : 'Functional landscape ready.';
    root.dataset.run6fReady = 'true';
    root.dataset.run6fError = 'false';
  } catch (error) {
    root.dataset.run6fReady = 'false';
    root.dataset.run6fError = 'true';
    statusNode.textContent = error instanceof Error
      ? error.message
      : String(error);
    throw error;
  } finally {
    rendering = false;
    if (rerenderPending) {
      rerenderPending = false;
      queueMicrotask(() => renderCurrentState());
    }
  }

  return lastBrowserReceipt;
}

async function applyIntent(intent, { render = true } = {}) {
  const proposal = proposeHEarthFunctionalLandscapeNavigation(
    navigationState,
    intent
  );
  navigationState = proposal.state ?? navigationState;

  if (intent.action === 'GOTO_WAYPOINT' && proposal.ok) {
    lastWaypointId = intent.waypointId;
    visitedWaypoints.add(intent.waypointId);
  } else if (intent.action === 'RESET' && proposal.ok) {
    lastWaypointId = 'COAST';
    visitedWaypoints.add('COAST');
  } else if ([
    'MOVE_FORWARD',
    'MOVE_BACKWARD',
    'STRAFE_LEFT',
    'STRAFE_RIGHT'
  ].includes(intent.action) && proposal.ok) {
    lastWaypointId = null;
  }

  if (!proposal.ok) {
    statusNode.textContent =
      `Boundary held: ${proposal.issues.join(', ')}`;
    updateWaypointButtons();
    return {
      ...clonePlain(proposal),
      browserReceipt: lastBrowserReceipt
    };
  }

  if (render) {
    await renderCurrentState();
  }

  return {
    ...clonePlain(proposal),
    browserReceipt: lastBrowserReceipt
  };
}

async function runGeographicPath() {
  const receipts = [];
  for (const waypointId of ['COAST', 'BERM', 'LOWLAND', 'HILL', 'RIDGE']) {
    receipts.push(await applyIntent({
      action: 'GOTO_WAYPOINT',
      waypointId
    }));
  }
  return receipts;
}

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => {
    applyIntent({ action: button.dataset.action });
  });
});

document.querySelectorAll('[data-waypoint]').forEach((button) => {
  button.addEventListener('click', () => {
    applyIntent({
      action: 'GOTO_WAYPOINT',
      waypointId: button.dataset.waypoint
    });
  });
});

const keyActions = new Map([
  ['w', 'MOVE_FORWARD'],
  ['arrowup', 'MOVE_FORWARD'],
  ['s', 'MOVE_BACKWARD'],
  ['arrowdown', 'MOVE_BACKWARD'],
  ['a', 'STRAFE_LEFT'],
  ['d', 'STRAFE_RIGHT'],
  ['q', 'TURN_LEFT'],
  ['e', 'TURN_RIGHT'],
  ['pageup', 'PITCH_UP'],
  ['pagedown', 'PITCH_DOWN'],
  ['r', 'RESET']
]);

window.addEventListener('keydown', (event) => {
  const action = keyActions.get(event.key.toLowerCase());
  if (!action) {
    return;
  }
  event.preventDefault();
  applyIntent({ action });
});

let pointerStart = null;
mount.addEventListener('pointerdown', (event) => {
  pointerStart = {
    x: event.clientX,
    y: event.clientY,
    pointerId: event.pointerId
  };
  mount.setPointerCapture(event.pointerId);
});

mount.addEventListener('pointerup', async (event) => {
  if (!pointerStart || pointerStart.pointerId !== event.pointerId) {
    return;
  }
  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  pointerStart = null;

  if (Math.abs(deltaX) > 4) {
    await applyIntent({
      action: deltaX > 0 ? 'TURN_RIGHT' : 'TURN_LEFT',
      degrees: Math.min(8, Math.abs(deltaX) / 10)
    }, { render: false });
  }
  if (Math.abs(deltaY) > 4) {
    await applyIntent({
      action: deltaY < 0 ? 'PITCH_UP' : 'PITCH_DOWN',
      degrees: Math.min(8, Math.abs(deltaY) / 10)
    }, { render: false });
  }
  await renderCurrentState();
});

mount.addEventListener('pointercancel', () => {
  pointerStart = null;
});

let resizeTimer = null;
const resizeObserver = new ResizeObserver(() => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    renderCurrentState();
  }, 120);
});
resizeObserver.observe(mount);

window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F = {
  ready: false,
  getSnapshot() {
    return {
      ready: root.dataset.run6fReady === 'true',
      state: clonePlain(navigationState),
      receipt: clonePlain(lastBrowserReceipt),
      handoff: lastHandoff
        ? {
            status: lastHandoff.status,
            frameOccurrenceId: lastHandoff.frameOccurrenceId,
            frameRevision: lastHandoff.frameRevision,
            cameraRevision: lastHandoff.cameraRevision,
            visiblePrimitiveCount: lastHandoff.visiblePrimitiveCount,
            plannedPrimitiveCount: lastHandoff.plannedPrimitiveCount
          }
        : null
    };
  },
  async dispatch(intent) {
    return applyIntent(intent);
  },
  async dispatchNavigationOnly(intent) {
    return applyIntent(intent, { render: false });
  },
  async gotoWaypointNavigationOnly(waypointId) {
    return applyIntent({
      action: 'GOTO_WAYPOINT',
      waypointId
    }, { render: false });
  },
  async resetNavigationOnly() {
    return applyIntent({ action: 'RESET' }, { render: false });
  },
  async forceBelowTerrainRecoveryNavigationOnly() {
    return applyIntent({
      action: 'SET_CAMERA_POSITION',
      position: {
        x: navigationState.position.x,
        y: -999,
        z: navigationState.position.z
      }
    }, { render: false });
  },
  async gotoWaypoint(waypointId) {
    return applyIntent({
      action: 'GOTO_WAYPOINT',
      waypointId
    });
  },
  async runGeographicPath() {
    return runGeographicPath();
  },
  async forceBelowTerrainRecovery() {
    return applyIntent({
      action: 'SET_CAMERA_POSITION',
      position: {
        x: navigationState.position.x,
        y: -999,
        z: navigationState.position.z
      }
    });
  },
  getBrowserReceipt() {
    return clonePlain(lastBrowserReceipt);
  },
  getBaseFrameSummary() {
    return {
      primitiveCount: baseFrame.primitiveCount,
      semanticAddressCount: baseFrame.semanticAddressCount,
      terrainAddressCount: baseFrame.terrainAddressCount,
      shorelineWaterAddressCount: baseFrame.shorelineWaterAddressCount,
      proxyAddressCount: baseFrame.proxySummarizedAddressCount,
      packet001Altered: baseFrame.packet001Altered,
      existingPacket002Altered: baseFrame.existingPacket002Altered
    };
  }
};

renderCurrentState()
  .then(() => {
    window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.ready = true;
  })
  .catch((error) => {
    console.error(error);
  });
