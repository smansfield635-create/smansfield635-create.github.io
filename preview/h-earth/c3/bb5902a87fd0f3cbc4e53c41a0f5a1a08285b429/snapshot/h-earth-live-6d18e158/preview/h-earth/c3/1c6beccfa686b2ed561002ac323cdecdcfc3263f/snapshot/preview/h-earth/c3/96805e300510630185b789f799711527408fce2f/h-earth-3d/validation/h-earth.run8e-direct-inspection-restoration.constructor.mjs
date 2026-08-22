import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlPath = path.join(root, 'showroom/globe/h-earth/index.html');
const integrationPath = path.join(
  root,
  'showroom/globe/h-earth/functional-landscape/environment-integration.js'
);
const controllerPath = path.join(
  root,
  'showroom/globe/h-earth/functional-landscape/mobile-navigation-controls.js'
);
const directPath = path.join(
  root,
  'showroom/globe/h-earth/functional-landscape/direct-manipulation.js'
);

function replaceOnce(source, from, to, label) {
  const index = source.indexOf(from);
  if (index < 0) throw new Error(`MISSING_REPLACEMENT_SOURCE:${label}`);
  if (source.indexOf(from, index + from.length) >= 0) {
    throw new Error(`NON_UNIQUE_REPLACEMENT_SOURCE:${label}`);
  }
  return source.slice(0, index) + to + source.slice(index + from.length);
}

function replaceCount(source, from, to, expectedCount, label) {
  const count = source.split(from).length - 1;
  if (count !== expectedCount) {
    throw new Error(`INVALID_REPLACEMENT_COUNT:${label}:${count}`);
  }
  return source.split(from).join(to);
}

function replaceSection(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`MISSING_SECTION_START:${label}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (end < 0) throw new Error(`MISSING_SECTION_END:${label}`);
  return source.slice(0, start) + replacement + source.slice(end);
}

let html = fs.readFileSync(htmlPath, 'utf8');
html = replaceCount(
  html,
  'data-h-earth-stage-contains-controls="true"',
  'data-h-earth-stage-contains-controls="false"',
  2,
  'CONTROLLER_STAGE_DECLARATIONS'
);
html = replaceOnce(
  html,
  'aria-label="Navigable H-Earth landscape. Drag to look. Use the on-screen arrows to move. Pinch to zoom. Use Coast to reset the view."',
  'aria-label="Navigable H-Earth landscape. Drag one finger to look. Slide two fingers to move forward or backward. Pinch to zoom."',
  'DIRECT_MANIPULATION_ARIA_LABEL'
);
html = replaceOnce(
  html,
  'Drag to look · Use arrows to move · Pinch to zoom',
  'Drag to look · Two-finger slide to move · Pinch to zoom',
  'DIRECT_MANIPULATION_HINT'
);
html = replaceOnce(
  html,
  './functional-landscape/index.js?v=gesture-shell-001',
  './functional-landscape/index.js?v=run8e-direct-inspection-restoration-001',
  'NAVIGATION_CACHE_KEY'
);
html = replaceOnce(
  html,
  './functional-landscape/environment-integration.js?v=run8e-mobile-navigation-001',
  './functional-landscape/environment-integration.js?v=run8e-direct-inspection-restoration-001',
  'SUCCESSOR_CACHE_KEY'
);

const inlineStart = '\n  <script>\n    (() => {';
const inlineEnd = '\n  </script>\n</body>';
const inlineIndex = html.lastIndexOf(inlineStart);
if (inlineIndex < 0) throw new Error('MISSING_LEGACY_INLINE_GESTURE_SCRIPT');
const inlineEndIndex = html.indexOf(inlineEnd, inlineIndex);
if (inlineEndIndex < 0) throw new Error('MISSING_LEGACY_INLINE_GESTURE_END');
html = html.slice(0, inlineIndex) +
  '\n  <script type="module" src="./functional-landscape/direct-manipulation.js?v=run8e-direct-inspection-restoration-001"></script>\n</body>' +
  html.slice(inlineEndIndex + inlineEnd.length);

if (html.includes('Use arrows to move') ||
    html.includes('h-earth-run8e-mobile-navigation-controls') ||
    html.includes('data-h-earth-stage-contains-controls="true"')) {
  throw new Error('CONTROLLER_PRESENT_AFTER_RESTORATION');
}
if (!html.includes('Two-finger slide to move')) {
  throw new Error('DIRECT_MANIPULATION_GUIDANCE_NOT_RESTORED');
}
fs.writeFileSync(htmlPath, html);

let integration = fs.readFileSync(integrationPath, 'utf8');
integration = replaceOnce(
  integration,
  "import {\n  installHEarthRun8EMobileNavigationControls\n} from './mobile-navigation-controls.js';\n",
  '',
  'REMOVE_CONTROLLER_IMPORT'
);
integration = replaceOnce(
  integration,
  `let renderSequence = 0;\nlet rendering = false;\nlet rerenderPending = false;\nlet lastReceipt = null;\nlet lastFrame = null;\nlet lastRaster = null;\nlet originalApi = null;`,
  `let renderSequence = 0;\nlet rendering = false;\nlet lastReceipt = null;\nlet lastFrame = null;\nlet lastRaster = null;\nlet originalApi = null;\nlet renderRequestCount = 0;\nlet coalescedRenderRequestCount = 0;\nlet completedRenderCount = 0;\nlet lastRenderDurationMilliseconds = 0;\nlet scheduledRenderTimer = null;\nlet renderLoopPromise = null;\nlet renderNeeded = false;\nlet requestedRenderReason = 'INITIAL';\nconst scheduledRenderWaiters = [];`,
  'RENDER_SCHEDULING_STATE'
);

const renderReplacement = `const yieldToBrowser = () => new Promise((resolve) => {\n  requestAnimationFrame(() => resolve());\n});\n\nasync function performRun8ERender(reason = 'DIRECT_REQUEST') {\n  rendering = true;\n  root.dataset.run8eLoading = 'true';\n  statusNode.textContent = 'Projecting Run 8E successor environment…';\n  const startedAt = performance.now();\n\n  try {\n    await yieldToBrowser();\n    const sourceSnapshot = originalApi.getSnapshot();\n    const state = reconcileNavigationState(sourceSnapshot.state);\n    const camera = createHEarthFunctionalLandscapeCamera(state);\n    const viewport = internalExtent();\n\n    await yieldToBrowser();\n    renderSequence += 1;\n    const frame = constructHEarthRun8ESuccessorEnvironmentFrame({\n      camera,\n      viewport,\n      timeOfDayHours: 15.25,\n      frameOccurrenceId: \`H_EARTH_RUN_8E_PUBLIC_ROUTE_FRAME_\${String(renderSequence).padStart(4, '0')}\`,\n      transferOccurrenceId: 'H_EARTH_RUN_8E_PUBLIC_ROUTE_PACKET_002_TRANSFER'\n    });\n    const frameEvaluation = evaluateHEarthRun8EFrame(frame);\n    if (frameEvaluation.eligible !== true) {\n      throw new Error(\`Run 8E public frame rejected: \${frameEvaluation.issues.join(', ')}\`);\n    }\n\n    await yieldToBrowser();\n    const plan = prepareHEarthRun8ERenderPlan(frame, viewport);\n    if (plan.eligible !== true) {\n      throw new Error(\`Run 8E public render plan rejected: \${plan.issues.join(', ')}\`);\n    }\n\n    await yieldToBrowser();\n    const raster = rasterizeHEarthRun8ERenderPlan(plan, frame);\n    if (raster.ok !== true || raster.alphaClosed !== true) {\n      throw new Error(\`Run 8E public raster rejected: \${raster.status}\`);\n    }\n\n    await yieldToBrowser();\n    canvas.width = raster.width;\n    canvas.height = raster.height;\n    context.putImageData(\n      new ImageData(raster.rgba, raster.width, raster.height),\n      0,\n      0\n    );\n    updateHud(state, frame, plan, raster);\n    lastFrame = frame;\n    lastRaster = raster;\n    completedRenderCount += 1;\n    lastRenderDurationMilliseconds = performance.now() - startedAt;\n    lastReceipt.renderScheduling = {\n      reason,\n      renderRequestCount,\n      coalescedRenderRequestCount,\n      completedRenderCount,\n      lastRenderDurationMilliseconds,\n      directManipulationPreserved: true,\n      visibleControllerPresent: false,\n      fullRenderDuringActiveGesture: false\n    };\n    root.dataset.run7hReady = 'true';\n    root.dataset.run7hError = 'false';\n    root.dataset.run8eReady = 'true';\n    root.dataset.run8eError = 'false';\n    root.dataset.run8ePublicRoute = 'true';\n    root.dataset.publicRoute = 'true';\n    statusNode.textContent =\n      \`Run 8E successor environment active · \${plan.triangles.length} triangles · \${frame.transfer.primitiveCount} admitted primitives\`;\n    return clonePlain(lastReceipt);\n  } catch (error) {\n    root.dataset.run8eReady = 'false';\n    root.dataset.run8eError = 'true';\n    root.dataset.run7hError = 'true';\n    statusNode.textContent = \`Run 8E integration failed: \${error.message}\`;\n    throw error;\n  } finally {\n    rendering = false;\n    root.dataset.run8eLoading = 'false';\n  }\n}\n\nasync function executeRenderLoop() {\n  if (renderLoopPromise) {\n    renderNeeded = true;\n    coalescedRenderRequestCount += 1;\n    return renderLoopPromise;\n  }\n\n  renderLoopPromise = (async () => {\n    let finalReceipt = lastReceipt;\n    do {\n      renderNeeded = false;\n      const waiters = scheduledRenderWaiters.splice(0);\n      try {\n        finalReceipt = await performRun8ERender(requestedRenderReason);\n        waiters.forEach(({ resolve }) => resolve(finalReceipt));\n      } catch (error) {\n        waiters.forEach(({ reject }) => reject(error));\n        throw error;\n      }\n    } while (renderNeeded || scheduledRenderWaiters.length > 0);\n    return finalReceipt;\n  })().finally(() => {\n    renderLoopPromise = null;\n  });\n\n  return renderLoopPromise;\n}\n\nfunction requestRun8ERender({ delay = 0, reason = 'COALESCED_REQUEST' } = {}) {\n  renderRequestCount += 1;\n  requestedRenderReason = reason;\n  return new Promise((resolve, reject) => {\n    scheduledRenderWaiters.push({ resolve, reject });\n    if (scheduledRenderTimer !== null) {\n      clearTimeout(scheduledRenderTimer);\n      coalescedRenderRequestCount += 1;\n    }\n    scheduledRenderTimer = setTimeout(() => {\n      scheduledRenderTimer = null;\n      executeRenderLoop().catch((error) => console.error(error));\n    }, Math.max(0, delay));\n  });\n}\n\n`;
integration = replaceSection(
  integration,
  'async function renderRun8E() {',
  'async function waitForNavigation() {',
  renderReplacement,
  'RUN8_RENDER_SCHEDULER'
);

const bridgeReplacement = `function installNavigationBridge(api) {\n  const original = {\n    dispatchNavigationOnly: typeof api.dispatchNavigationOnly === 'function'\n      ? api.dispatchNavigationOnly.bind(api)\n      : api.dispatch.bind(api),\n    gotoWaypointNavigationOnly: typeof api.gotoWaypointNavigationOnly === 'function'\n      ? api.gotoWaypointNavigationOnly.bind(api)\n      : api.gotoWaypoint.bind(api),\n    resetNavigationOnly: typeof api.resetNavigationOnly === 'function'\n      ? api.resetNavigationOnly.bind(api)\n      : () => api.dispatch({ action: 'RESET' }),\n    forceBelowTerrainRecoveryNavigationOnly:\n      typeof api.forceBelowTerrainRecoveryNavigationOnly === 'function'\n        ? api.forceBelowTerrainRecoveryNavigationOnly.bind(api)\n        : api.forceBelowTerrainRecovery.bind(api)\n  };\n\n  const navigateThenRender = async (operation, reason) => {\n    const result = await operation();\n    const run8ERenderReceipt = await requestRun8ERender({ delay: 0, reason });\n    return { ...result, run8ERenderReceipt };\n  };\n\n  api.dispatch = async (intent) => navigateThenRender(\n    () => original.dispatchNavigationOnly(intent),\n    'PROGRAMMATIC_DISPATCH'\n  );\n  api.gotoWaypoint = async (waypointId) => navigateThenRender(\n    () => original.gotoWaypointNavigationOnly(waypointId),\n    'PROGRAMMATIC_WAYPOINT'\n  );\n  api.reset = async () => navigateThenRender(\n    () => original.resetNavigationOnly(),\n    'PROGRAMMATIC_RESET'\n  );\n  api.commitSuccessorRender = async () => requestRun8ERender({\n    delay: 0,\n    reason: 'DIRECT_MANIPULATION_SETTLED'\n  });\n  api.runGeographicPath = async () => {\n    const results = [];\n    for (const waypointId of ['COAST', 'BERM', 'LOWLAND', 'HILL', 'RIDGE']) {\n      results.push(await api.gotoWaypoint(waypointId));\n    }\n    return results;\n  };\n  api.forceBelowTerrainRecovery = async () => navigateThenRender(\n    () => original.forceBelowTerrainRecoveryNavigationOnly(),\n    'PROGRAMMATIC_RECOVERY'\n  );\n}\n\n`;
integration = replaceSection(
  integration,
  'function installNavigationBridge(api) {',
  'function installPublicApi() {',
  bridgeReplacement,
  'NAVIGATION_BRIDGE_RESTORATION'
);
integration = replaceOnce(
  integration,
  `    async refresh() {\n      return renderRun8E();\n    },`,
  `    async refresh() {\n      return requestRun8ERender({\n        delay: 0,\n        reason: 'PUBLIC_REFRESH'\n      });\n    },`,
  'PUBLIC_REFRESH_SCHEDULER'
);
integration = replaceOnce(
  integration,
  `    getBrowserReceipt() {\n      return clonePlain(lastReceipt);\n    },`,
  `    getBrowserReceipt() {\n      return clonePlain(lastReceipt);\n    },\n    getSchedulingReceipt() {\n      return clonePlain({\n        renderRequestCount,\n        coalescedRenderRequestCount,\n        completedRenderCount,\n        lastRenderDurationMilliseconds,\n        rendering,\n        pendingWaiterCount: scheduledRenderWaiters.length,\n        directManipulationPreserved: true,\n        visibleControllerPresent: false\n      });\n    },`,
  'PUBLIC_SCHEDULING_RECEIPT'
);

const initializationReplacement = `originalApi = await waitForNavigation();\ninstallNavigationBridge(originalApi);\ninstallPublicApi();\nroot.dataset.run8eReady = 'false';\nroot.dataset.run8eError = 'false';\nroot.dataset.run8eLoading = 'true';\nstatusNode.textContent =\n  'Run 8 successor environment preparing · direct inspection available.';\n\nconst beginInitialRender = () => {\n  requestRun8ERender({\n    delay: 0,\n    reason: 'DEFERRED_INITIAL_SUCCESSOR_RENDER'\n  }).catch((error) => console.error(error));\n};\n\nif (typeof requestIdleCallback === 'function') {\n  requestIdleCallback(beginInitialRender, { timeout: 1200 });\n} else {\n  setTimeout(beginInitialRender, 120);\n}\n\nlet resizeTimer = null;\nconst resizeObserver = new ResizeObserver(() => {\n  clearTimeout(resizeTimer);\n  resizeTimer = setTimeout(() => {\n    requestRun8ERender({\n      delay: 0,\n      reason: 'VIEWPORT_RESIZE_SETTLED'\n    }).catch((error) => console.error(error));\n  }, 180);\n});\nresizeObserver.observe(mount);\n`;
const initializationStart = integration.indexOf('originalApi = await waitForNavigation();');
if (initializationStart < 0) throw new Error('MISSING_INITIALIZATION_BLOCK');
integration = integration.slice(0, initializationStart) + initializationReplacement;

if (integration.includes('installHEarthRun8EMobileNavigationControls') ||
    integration.includes("from './mobile-navigation-controls.js'")) {
  throw new Error('CONTROLLER_INTEGRATION_NOT_REMOVED');
}
if (!integration.includes('requestIdleCallback') ||
    !integration.includes('DIRECT_MANIPULATION_SETTLED') ||
    !integration.includes('coalescedRenderRequestCount')) {
  throw new Error('RENDER_SCHEDULING_RESTORATION_INCOMPLETE');
}
fs.writeFileSync(integrationPath, integration);

if (!fs.existsSync(directPath)) {
  throw new Error('DIRECT_MANIPULATION_MODULE_MISSING');
}
if (fs.existsSync(controllerPath)) fs.unlinkSync(controllerPath);

console.log(JSON.stringify({
  status: 'RUN_8E_DIRECT_INSPECTION_RESTORATION_CONSTRUCTED',
  htmlPath: path.relative(root, htmlPath),
  integrationPath: path.relative(root, integrationPath),
  directPath: path.relative(root, directPath),
  removedControllerPath: path.relative(root, controllerPath)
}, null, 2));
