const CONTRACT_ID = 'H_EARTH_CURRENT_AUTHORITY_GAUGE_v3';
const RECEIPT_ID = 'H_EARTH_CURRENT_AUTHORITY_GAUGE_RECEIPT_v3';
const VERSION = '2026-07-30.h-earth-current-authority-gauge-v3';
const EXACT_BASE = '6037cdad3bde1dfcac1aec253d5ad079fc1df1f5';
const ACCEPTED_CP2_RENDERER_PATH =
  '/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js';
const ACCEPTED_CP2_RENDERER_BLOB = 'de55609b0b0bd66601445a369c727ff7a6d7065d';
const EXPECTED_TOOL_REGISTRY_DIGEST = 'fnv1a32:3651f363';
const EXPECTED_SCENE_REGISTRY_DIGEST = 'fnv1a32:b996656d';
const STATUS_VALUES = Object.freeze([
  'PASS',
  'FAIL',
  'HELD_BY_CURRENT_AUTHORITY',
  'SUPERSEDED',
  'NOT_APPLICABLE',
  'UNRESOLVED'
]);
const REQUIRED_DENOMINATOR_STATUSES = new Set(['PASS', 'FAIL', 'UNRESOLVED']);
const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));
const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((member) => freeze(member, seen));
  return Object.freeze(value);
};
function normalizeCanonical(value) {
  if (value === undefined) return null;
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new Error('NON_FINITE_CANONICAL_NUMBER');
    }
    return value;
  }
  if (Array.isArray(value)) return value.map(normalizeCanonical);
  if (ArrayBuffer.isView(value)) return Array.from(value, normalizeCanonical);
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .filter((key) => value[key] !== undefined)
      .map((key) => [key, normalizeCanonical(value[key])])
  );
}
export function stableStringify(value, indentation = 0) {
  return JSON.stringify(normalizeCanonical(value), null, indentation);
}
export function fnv1a32(text) {
  let hash = 0x811c9dc5;
  const bytes = new TextEncoder().encode(String(text));
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32:${hash.toString(16).padStart(8, '0')}`;
}
export function canonicalDigest(value) {
  return fnv1a32(stableStringify(value));
}

export const H_EARTH_LEGACY_GAUGE_DISPOSITIONS = freeze([
  { row: 1, legacyName: 'H-Earth private room reachable', status: 'SUPERSEDED', disposition: 'SUPERSEDED_CONTRACT', successorCheck: 'H_EARTH_PUBLIC_GROUND_VIEW_ROUTE_REACHABLE' },
  { row: 2, legacyName: 'Globe Showcase reachable', status: 'PASS', disposition: 'CURRENT_AND_REQUIRED', successorCheck: 'MIRRORLAND_GLOBE_NARRATIVE_ROUTE_REACHABLE' },
  { row: 3, legacyName: 'Display case touch inspection route active', status: 'SUPERSEDED', disposition: 'STALE_MARKER_EXPECTATION', successorCheck: 'MIRRORLAND_GLOBE_NARRATIVE_ROUTE_REACHABLE' },
  { row: 4, legacyName: 'Private page remains clean', status: 'SUPERSEDED', disposition: 'SUPERSEDED_CONTRACT', successorCheck: 'H_EARTH_RUN_8E_PUBLIC_HOST_PRESENT' },
  { row: 5, legacyName: 'Diagnostics route points here', status: 'SUPERSEDED', disposition: 'STALE_MARKER_EXPECTATION', successorCheck: 'FD_05_DIAGNOSTIC_AUTHORITY_REACHABLE' },
  { row: 6, legacyName: 'Elevation sea-level child bound to detail', status: 'SUPERSEDED', disposition: 'SUPERSEDED_PATH', successorCheck: 'RUN_8B_SUCCESSOR_TERRAIN_AUTHORITY_PRESENT' },
  { row: 7, legacyName: 'Terrain detail child exists', status: 'SUPERSEDED', disposition: 'SUPERSEDED_PATH', successorCheck: 'RUN_8B_SUCCESSOR_TERRAIN_AUTHORITY_PRESENT' },
  { row: 8, legacyName: 'Parent mutation forbidden', status: 'SUPERSEDED', disposition: 'STALE_MARKER_EXPECTATION', successorCheck: 'LIVE_PRODUCT_AND_TOOLING_PATHS_REMAIN_SEPARATE' },
  { row: 9, legacyName: 'Visual pass remains false', status: 'SUPERSEDED', disposition: 'STALE_MARKER_EXPECTATION', successorCheck: 'NO_REJECTED_VISUAL_CONTENT_BOUND_TO_LIVE' },
  { row: 10, legacyName: 'Ground level remains held', status: 'SUPERSEDED', disposition: 'INVALID_HARDCODED_HOLD', successorCheck: 'GROUND_VIEW_STATUS' },
  { row: 11, legacyName: 'Estate placement remains held', status: 'SUPERSEDED', disposition: 'INVALID_HARDCODED_HOLD', successorCheck: 'ESTATE_OR_MANOR_STATUS' }
]);

export const H_EARTH_CURRENT_AUTHORITY_CHECKS = freeze([
  { ordinal: 1, checkId: 'MIRRORLAND_GLOBE_NARRATIVE_ROUTE_REACHABLE', label: 'Mirrorland Globe narrative route reachable', required: true },
  { ordinal: 2, checkId: 'H_EARTH_PUBLIC_GROUND_VIEW_ROUTE_REACHABLE', label: 'H-Earth public ground-view route reachable', required: true },
  { ordinal: 3, checkId: 'H_EARTH_RUN_8E_PUBLIC_HOST_PRESENT', label: 'H-Earth Run 8E public host present', required: true },
  { ordinal: 4, checkId: 'RUN_8B_SUCCESSOR_TERRAIN_AUTHORITY_PRESENT', label: 'Run 8B successor terrain authority present', required: true },
  { ordinal: 5, checkId: 'ACCEPTED_CP2_WEBGL_RENDERER_PRESENT', label: 'Accepted CP2 WebGL renderer present', required: true },
  { ordinal: 6, checkId: 'CURRENT_LIVE_GPU_BINDING_PRESENT', label: 'Current live GPU binding present', required: true },
  { ordinal: 7, checkId: 'FD_05_DIAGNOSTIC_AUTHORITY_REACHABLE', label: 'FD_05 diagnostic authority reachable', required: true },
  { ordinal: 8, checkId: 'UNIFIED_INSTRUMENT_PLATFORM_REACHABLE', label: 'Unified instrument platform reachable', required: true },
  { ordinal: 9, checkId: 'TOOL_REGISTRY_AND_SCENE_REGISTRY_DIGESTS_MATCH', label: 'Tool and scene registry digests match', required: true },
  { ordinal: 10, checkId: 'NO_REJECTED_VISUAL_CONTENT_BOUND_TO_LIVE', label: 'No rejected visual content bound to live', required: true },
  { ordinal: 11, checkId: 'LIVE_PRODUCT_AND_TOOLING_PATHS_REMAIN_SEPARATE', label: 'Live product and tooling paths remain separate', required: true }
]);

function normalizeResult(result) {
  if (!result || typeof result !== 'object') throw new TypeError('GAUGE_RESULT_OBJECT_REQUIRED');
  if (!STATUS_VALUES.includes(result.status)) throw new Error(`GAUGE_RESULT_STATUS_INVALID:${result.status}`);
  return freeze({
    ordinal: Number(result.ordinal),
    checkId: String(result.checkId),
    label: String(result.label),
    required: result.required === true,
    status: result.status,
    detail: String(result.detail ?? ''),
    authority: clone(result.authority ?? null),
    predicates: clone(result.predicates ?? {})
  });
}

export function computeGaugeReadiness(results) {
  const normalized = results.map(normalizeResult);
  const counts = Object.fromEntries(STATUS_VALUES.map((status) => [status, 0]));
  for (const result of normalized) counts[result.status] += 1;
  const requiredApplicable = normalized.filter(
    (result) => result.required && REQUIRED_DENOMINATOR_STATUSES.has(result.status)
  );
  const requiredApplicablePasses = requiredApplicable.filter((result) => result.status === 'PASS').length;
  const requiredApplicableFailures = requiredApplicable.filter((result) => result.status === 'FAIL').length;
  const requiredApplicableUnresolved = requiredApplicable.filter((result) => result.status === 'UNRESOLVED').length;
  const readinessPercent = requiredApplicable.length
    ? Math.round((requiredApplicablePasses / requiredApplicable.length) * 100)
    : 0;
  return freeze({
    totalResults: normalized.length,
    counts,
    requiredApplicableChecks: requiredApplicable.length,
    requiredApplicablePasses,
    requiredApplicableFailures,
    requiredApplicableUnresolved,
    readinessPercent,
    mergeEligible:
      requiredApplicable.length === H_EARTH_CURRENT_AUTHORITY_CHECKS.length &&
      requiredApplicableFailures === 0 &&
      requiredApplicableUnresolved === 0
  });
}

function resultFor(check, status, detail, authority, predicates = {}) {
  return normalizeResult({ ...check, status, detail, authority, predicates });
}
function allTrue(predicates) {
  return Object.values(predicates).every(Boolean);
}
function failureDetail(predicates) {
  return Object.entries(predicates)
    .filter(([, value]) => !value)
    .map(([key]) => key)
    .join(', ');
}
function cacheBust(url, token) {
  const joiner = url.includes('?') ? '&' : '?';
  return `${url}${joiner}gauge=${encodeURIComponent(token)}`;
}
async function fetchText(url, token) {
  try {
    const response = await fetch(cacheBust(url, token), { cache: 'no-store' });
    const text = await response.text().catch(() => '');
    return { ok: response.ok, status: response.status, text };
  } catch (error) {
    return { ok: false, status: 0, text: '', error: String(error?.message ?? error) };
  }
}
async function fetchJson(url, token) {
  const source = await fetchText(url, token);
  if (!source.ok) return { ...source, value: null };
  try {
    return { ...source, value: JSON.parse(source.text) };
  } catch (error) {
    return { ...source, value: null, error: `JSON_INVALID:${error.message}` };
  }
}
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
async function waitUntil(predicate, { timeout = 45000, interval = 100, label = 'CONDITION' } = {}) {
  const started = performance.now();
  while (performance.now() - started < timeout) {
    try {
      const value = predicate();
      if (value) return value;
    } catch {}
    await sleep(interval);
  }
  throw new Error(`GAUGE_WAIT_TIMEOUT:${label}`);
}
function createExecutionFrame(url) {
  const iframe = document.createElement('iframe');
  iframe.title = 'H-Earth current-authority gauge execution frame';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;
  Object.assign(iframe.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    width: '640px',
    height: '360px',
    border: '0',
    opacity: '0',
    pointerEvents: 'none'
  });
  document.body.appendChild(iframe);
  iframe.src = url;
  return iframe;
}
async function loadFrame(url, label) {
  const iframe = createExecutionFrame(url);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`GAUGE_FRAME_LOAD_TIMEOUT:${label}`)), 45000);
    iframe.addEventListener('load', () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
  });
  return iframe;
}
function removeFrame(frame) {
  try { frame?.remove(); } catch {}
}
async function importFresh(path, token) {
  return import(cacheBust(path, token));
}

async function prepareSharedEvidence(sourceHead, token) {
  const [mirrorland, hEarth, platformIndex, acceptedRenderer, placement] = await Promise.all([
    fetchText('/showroom/globe/', token),
    fetchText('/showroom/globe/h-earth/', token),
    fetchText('/h-earth-3d/tools/instrument-platform/', token),
    fetchText(ACCEPTED_CP2_RENDERER_PATH, token),
    fetchJson('/h-earth-3d/validation/h-earth.gratitude-region.final-spatial-placement-disposition.receipt.v1.json', token)
  ]);

  let hEarthFrame = null;
  let fd05Frame = null;
  let publicApi = null;
  let publicReceipt = null;
  let fd05Api = null;
  let hEarthFrameError = null;
  let fd05FrameError = null;

  try {
    const query = new URLSearchParams({ gauge: CONTRACT_ID, head: sourceHead });
    hEarthFrame = await loadFrame(`/showroom/globe/h-earth/?${query.toString()}`, 'H_EARTH');
    publicApi = await waitUntil(
      () => hEarthFrame.contentWindow?.H_EARTH_RUN8E_PUBLIC_ROUTE,
      { label: 'H_EARTH_RUN8E_PUBLIC_ROUTE' }
    );
    await waitUntil(
      () => hEarthFrame.contentDocument?.getElementById('h-earth-functional-landscape-route')?.dataset.run8eReady === 'true',
      { label: 'H_EARTH_RUN8E_READY' }
    );
    await waitUntil(
      () => publicApi.getReceipt?.()?.liveGpu?.counters?.gpuFramebufferPresentationCount > 0,
      { label: 'H_EARTH_FIRST_GPU_FRAME' }
    );
    publicReceipt = clone(publicApi.getReceipt());
  } catch (error) {
    hEarthFrameError = String(error?.message ?? error);
  }

  try {
    fd05Frame = await loadFrame('/showroom/globe/h-earth/diagnostic/?gauge=current-authority', 'FD05');
    fd05Api = await waitUntil(
      () => fd05Frame.contentWindow?.H_EARTH_FD05_DIAGNOSTIC_RUNTIME_API,
      { label: 'FD05_RUNTIME_API' }
    );
  } catch (error) {
    fd05FrameError = String(error?.message ?? error);
  }

  let terrainModule = null;
  let projectContextModule = null;
  let toolRegistryModule = null;
  let sceneRegistryModule = null;
  const importErrors = {};
  for (const [key, path] of [
    ['terrain', '/h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js'],
    ['projectContext', '/h-earth-3d/tools/instrument-platform/project-context.mjs'],
    ['toolRegistry', '/h-earth-3d/tools/instrument-platform/tool-registry.mjs'],
    ['sceneRegistry', '/h-earth-3d/tools/instrument-platform/permanent-scene-registry.mjs']
  ]) {
    try {
      const module = await importFresh(path, token);
      if (key === 'terrain') terrainModule = module;
      if (key === 'projectContext') projectContextModule = module;
      if (key === 'toolRegistry') toolRegistryModule = module;
      if (key === 'sceneRegistry') sceneRegistryModule = module;
    } catch (error) {
      importErrors[key] = String(error?.message ?? error);
    }
  }

  return {
    sourceHead,
    token,
    sources: { mirrorland, hEarth, platformIndex, acceptedRenderer, placement },
    frames: { hEarthFrame, fd05Frame },
    frameErrors: { hEarthFrameError, fd05FrameError },
    publicApi,
    publicReceipt,
    fd05Api,
    modules: { terrainModule, projectContextModule, toolRegistryModule, sceneRegistryModule },
    importErrors
  };
}

function checkMirrorland(check, evidence) {
  const source = evidence.sources.mirrorland;
  const text = source.text || '';
  const predicates = {
    http200: source.ok && source.status === 200,
    currentSeason: text.includes('data-season="Shadows Never Shatter in Mirrorland"'),
    hEarthAsSurvival: text.includes('H-Earth as survival'),
    floatingMapPortalActive: text.includes('data-floating-map-portal-active="true"'),
    mapPortalOwnsNavigation: text.includes('data-map-blip-owns-navigation="true"')
  };
  return resultFor(
    check,
    allTrue(predicates) ? 'PASS' : 'FAIL',
    allTrue(predicates) ? 'Current Mirrorland narrative route and Map Portal authority observed.' : `Missing: ${failureDetail(predicates)}`,
    { route: '/showroom/globe/', sourceBlob: 'b6d11141e8992cee7c7061521b134e4cb2b96844' },
    predicates
  );
}
function checkGroundRoute(check, evidence) {
  const source = evidence.sources.hEarth;
  const text = source.text || '';
  const predicates = {
    http200: source.ok && source.status === 200,
    publicEnvironmentHost: text.includes('data-h-earth-route="public-environment-host"'),
    functionalLandscapeRoute: text.includes('data-h-earth-public-route="functional-landscape"'),
    navigableGroundView: text.includes('H-Earth · Navigable Ground View'),
    activeCanvas: text.includes('id="h-earth-functional-landscape-canvas"')
  };
  return resultFor(
    check,
    allTrue(predicates) ? 'PASS' : 'FAIL',
    allTrue(predicates) ? 'Current public navigable ground-view route observed.' : `Missing: ${failureDetail(predicates)}`,
    { route: '/showroom/globe/h-earth/', sourceBlob: 'd6f3441040062e91bf1070c76932d2f6b6349f4a' },
    predicates
  );
}
function checkRun8EHost(check, evidence) {
  const documentObject = evidence.frames.hEarthFrame?.contentDocument;
  const root = documentObject?.getElementById('h-earth-functional-landscape-route');
  const moduleNode = documentObject?.getElementById('h-earth-current-run8e-module');
  const predicates = {
    frameLoaded: Boolean(documentObject),
    currentModulePresent: moduleNode?.getAttribute('src')?.includes('public-live-gpu-integration.run8e-r3e.receipt.js') === true,
    run8EReady: root?.dataset.run8eReady === 'true',
    run8EPublicRoute: root?.dataset.run8ePublicRoute === 'true',
    runtimeApiPresent: Boolean(evidence.publicApi)
  };
  const unresolved = !documentObject && Boolean(evidence.frameErrors.hEarthFrameError);
  const status = unresolved ? 'UNRESOLVED' : allTrue(predicates) ? 'PASS' : 'FAIL';
  return resultFor(
    check,
    status,
    status === 'PASS' ? 'Run 8E public host and runtime API reached ready state.' : evidence.frameErrors.hEarthFrameError || `Missing: ${failureDetail(predicates)}`,
    { hostBlob: 'd6f3441040062e91bf1070c76932d2f6b6349f4a', integrationBlob: '98c768be0cfb2ec4bc82e2b634913d91cc73a32f' },
    predicates
  );
}
function checkTerrain(check, evidence) {
  const module = evidence.modules.terrainModule;
  let sample = null;
  try { sample = module?.sampleHEarthRun8BSuccessorTerrainField?.(0, -96); } catch {}
  const predicates = {
    moduleImported: Boolean(module),
    contractMatches: module?.H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID === 'H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_8_SUCCESSOR_v1',
    sourcePathMatches: module?.H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_SOURCE_FILE === '/h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js',
    deterministic: module?.H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD?.sampling?.deterministic === true,
    inDomainSampleValid: sample?.valid === true && sample?.status === 'RUN_8B_SUCCESSOR_TERRAIN_SAMPLE_COMPLETE'
  };
  const unresolved = !module && Boolean(evidence.importErrors.terrain);
  const status = unresolved ? 'UNRESOLVED' : allTrue(predicates) ? 'PASS' : 'FAIL';
  return resultFor(
    check,
    status,
    status === 'PASS' ? 'Run 8B successor terrain contract and deterministic fixture observed.' : evidence.importErrors.terrain || `Missing: ${failureDetail(predicates)}`,
    { path: '/h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js', sourceBlob: '0bd36eec01a75311bf6441d575bae5a057195bbc' },
    predicates
  );
}
function checkAcceptedRenderer(check, evidence) {
  const module = evidence.modules.projectContextModule;
  const context = module?.createProjectContext?.({ sourceHead: evidence.sourceHead });
  const liveDifferential = evidence.publicReceipt?.liveGpu?.liveDifferential;
  const rendererSource = evidence.sources.acceptedRenderer.text || '';
  const predicates = {
    projectContextImported: Boolean(context),
    acceptedPathMatches: `/${context?.acceptedRenderer?.path ?? ''}` === ACCEPTED_CP2_RENDERER_PATH,
    acceptedBlobMatches: context?.acceptedRenderer?.blob === ACCEPTED_CP2_RENDERER_BLOB,
    liveQueryRequested: liveDifferential?.requested === true,
    liveQueryValueMatches: liveDifferential?.queryValue === 'round1-1f520809',
    liveRendererPathMatches: liveDifferential?.rendererPath?.endsWith('persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js') === true,
    rendererSourceReachable: evidence.sources.acceptedRenderer.ok === true,
    rendererIdMatches: rendererSource.includes("H_EARTH_RUN_8E_R3C_PERSISTENT_WEBGL2_LIVE_RENDERER_v1")
  };
  const unresolved = !context && Boolean(evidence.importErrors.projectContext);
  const status = unresolved ? 'UNRESOLVED' : allTrue(predicates) ? 'PASS' : 'FAIL';
  return resultFor(
    check,
    status,
    status === 'PASS' ? 'Accepted CP2 renderer identity is selected by the current live route.' : evidence.importErrors.projectContext || `Missing: ${failureDetail(predicates)}`,
    { path: ACCEPTED_CP2_RENDERER_PATH, sourceBlob: ACCEPTED_CP2_RENDERER_BLOB },
    predicates
  );
}
function checkLiveBinding(check, evidence) {
  const receipt = evidence.publicReceipt;
  const liveGpu = receipt?.liveGpu;
  const predicates = {
    publicReceiptPresent: Boolean(receipt),
    integrationIdMatches: receipt?.integrationId === 'H_EARTH_RUN_8E_R3E2_PUBLIC_LIVE_GPU_COMPOSITION_v1',
    bindingIdMatches: liveGpu?.bindingId === 'H_EARTH_RUN_8E_R3D3_LIVE_GPU_CAMERA_RESPONSE_BINDING_v1',
    webGL2ContextCreated: Number(liveGpu?.resources?.counters?.contextCreationCount ?? 0) > 0,
    onePersistentRenderer: Number(liveGpu?.counters?.rendererInitializationCount ?? 0) === 1,
    visibleFramePresented: Number(liveGpu?.counters?.gpuFramebufferPresentationCount ?? 0) > 0,
    packageUploadedOnce: liveGpu?.correspondence?.packageUploadedOnce === true,
    resourceIdentityStable: liveGpu?.correspondence?.resourceIdentityStable === true
  };
  const unresolved = !receipt && Boolean(evidence.frameErrors.hEarthFrameError);
  const status = unresolved ? 'UNRESOLVED' : allTrue(predicates) ? 'PASS' : 'FAIL';
  return resultFor(
    check,
    status,
    status === 'PASS' ? 'Current WebGL2 binding presented a visible frame with stable resources.' : evidence.frameErrors.hEarthFrameError || `Missing: ${failureDetail(predicates)}`,
    { bindingBlob: '5eb1b6f2e72ac0525f608850234182b2c646f66f', integrationBlob: '98c768be0cfb2ec4bc82e2b634913d91cc73a32f' },
    predicates
  );
}
function checkFd05(check, evidence) {
  const documentObject = evidence.frames.fd05Frame?.contentDocument;
  const text = documentObject?.documentElement?.outerHTML || '';
  const predicates = {
    frameLoaded: Boolean(documentObject),
    authorityIdentity: text.includes('H-Earth FD_05 Diagnostic Authority') || text.includes('FD_05'),
    runtimeApiPresent: Boolean(evidence.fd05Api),
    sourceCorrectionWithheld: text.includes('SOURCE CORRECTION · WITHHELD'),
    returnToHEarthPresent: text.includes('/showroom/globe/h-earth/')
  };
  const unresolved = !documentObject && Boolean(evidence.frameErrors.fd05FrameError);
  const status = unresolved ? 'UNRESOLVED' : allTrue(predicates) ? 'PASS' : 'FAIL';
  return resultFor(
    check,
    status,
    status === 'PASS' ? 'FD_05 route and read-only runtime authority observed.' : evidence.frameErrors.fd05FrameError || `Missing: ${failureDetail(predicates)}`,
    { route: '/showroom/globe/h-earth/diagnostic/', sourceBlob: '98bc55a36090f3a866a81f628cb6812b483e00c7' },
    predicates
  );
}
function checkPlatform(check, evidence) {
  const source = evidence.sources.platformIndex;
  const text = source.text || '';
  const registry = evidence.modules.toolRegistryModule?.H_EARTH_TOOL_REGISTRY;
  const predicates = {
    routeReachable: source.ok && source.status === 200,
    platformIdentity: text.includes('data-platform="H_EARTH_INSTRUMENT_PLATFORM_v1"'),
    authorityPartitionVisible: text.includes('SOURCE ≠ RUNTIME ≠ LIVE ≠ ACCEPTED ≠ DEFAULT'),
    instrumentFramePresent: text.includes('id="instrument-frame"'),
    fourApplicationsRegistered: registry?.tools?.length === 4
  };
  return resultFor(
    check,
    allTrue(predicates) ? 'PASS' : 'FAIL',
    allTrue(predicates) ? 'Unified instrument route, host, and four-application registry observed.' : `Missing: ${failureDetail(predicates)}`,
    { route: '/h-earth-3d/tools/instrument-platform/', indexBlob: '792e023dd5fc3886ceba22a58205fb4f7f9ce6d3' },
    predicates
  );
}
function checkRegistryDigests(check, evidence) {
  const tools = evidence.modules.toolRegistryModule?.H_EARTH_TOOL_REGISTRY;
  const scenes = evidence.modules.sceneRegistryModule?.H_EARTH_PERMANENT_SCENE_REGISTRY;
  const predicates = {
    toolRegistryImported: Boolean(tools),
    sceneRegistryImported: Boolean(scenes),
    toolDigestMatches: tools?.registryDigest === EXPECTED_TOOL_REGISTRY_DIGEST,
    sceneDigestMatches: scenes?.registryDigest === EXPECTED_SCENE_REGISTRY_DIGEST,
    toolCountFour: tools?.tools?.length === 4,
    sceneCountEight: scenes?.scenes?.length === 8
  };
  const unresolved = (!tools && evidence.importErrors.toolRegistry) || (!scenes && evidence.importErrors.sceneRegistry);
  const status = unresolved ? 'UNRESOLVED' : allTrue(predicates) ? 'PASS' : 'FAIL';
  return resultFor(
    check,
    status,
    status === 'PASS' ? 'Deployed tool and scene registry digests match the frozen successor identities.' : evidence.importErrors.toolRegistry || evidence.importErrors.sceneRegistry || `Missing: ${failureDetail(predicates)}`,
    { expectedToolRegistryDigest: EXPECTED_TOOL_REGISTRY_DIGEST, expectedSceneRegistryDigest: EXPECTED_SCENE_REGISTRY_DIGEST },
    predicates
  );
}
function checkRejectedVisualContent(check, evidence) {
  const receipt = evidence.publicReceipt;
  const exclusivity = receipt?.runtimeExclusivity;
  const liveGpu = receipt?.liveGpu;
  const rendererPath = liveGpu?.liveDifferential?.rendererPath || '';
  const predicates = {
    acceptedCp2RendererSelected: rendererPath.endsWith('persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js'),
    legacyModuleCountZero: Number(exclusivity?.legacyModuleScriptCount ?? -1) === 0,
    noCpuWorldRebuild: exclusivity?.cpuWorldRebuildPerCameraChange === false,
    noCssBitmapPreview: exclusivity?.cssBitmapPreview === false,
    noDeferredPublicRefresh: exclusivity?.deferredPublicRefresh === false,
    noControlFieldCandidate: !rendererPath.includes('control-field-candidate'),
    noBakedMaterialCandidate: !rendererPath.includes('baked-material-candidate')
  };
  const unresolved = !receipt && Boolean(evidence.frameErrors.hEarthFrameError);
  const status = unresolved ? 'UNRESOLVED' : allTrue(predicates) ? 'PASS' : 'FAIL';
  return resultFor(
    check,
    status,
    status === 'PASS' ? 'Accepted CP2 visual path is exclusive; rejected and legacy paths are not active.' : evidence.frameErrors.hEarthFrameError || `Missing: ${failureDetail(predicates)}`,
    { liveRendererPath: rendererPath || null },
    predicates
  );
}
function checkProductToolingSeparation(check, evidence) {
  const hEarthText = evidence.sources.hEarth.text || '';
  const moduleSources = evidence.publicReceipt?.moduleSources || [];
  const tools = evidence.modules.toolRegistryModule?.H_EARTH_TOOL_REGISTRY?.tools || [];
  const gauges = tools.find((tool) => tool.toolId === 'H_EARTH_GAUGES');
  const predicates = {
    noGaugeExecutionImportInHost: !hEarthText.includes('/gauges/h-earth/index') && !hEarthText.includes('h-earth.current-authority-gauge'),
    noPlatformExecutionImportInHost: !hEarthText.includes('/h-earth-3d/tools/instrument-platform/platform.mjs'),
    liveModuleGraphToolFree: moduleSources.every((path) => !path.startsWith('/gauges/') && !path.startsWith('/h-earth-3d/tools/instrument-platform/')),
    toolsRemainSeparateRoutes: tools.length === 4 && tools.every((tool) => typeof tool.route === 'string' && tool.route.startsWith('/')),
    gaugeRepositoryWriteProhibited: gauges?.prohibitedMutations?.includes('REPOSITORY_WRITE') === true,
    gaugeLiveBindingChangeProhibited: gauges?.prohibitedMutations?.includes('LIVE_BINDING_CHANGE') === true,
    gaugeProductAcceptanceProhibited: gauges?.prohibitedMutations?.includes('PRODUCT_ACCEPTANCE') === true
  };
  return resultFor(
    check,
    allTrue(predicates) ? 'PASS' : 'FAIL',
    allTrue(predicates) ? 'Live H-Earth execution and backstage tooling remain separately routed and separately authorized.' : `Missing: ${failureDetail(predicates)}`,
    { productRoute: '/showroom/globe/h-earth/', gaugeRoute: '/gauges/h-earth/', platformRoute: '/h-earth-3d/tools/instrument-platform/' },
    predicates
  );
}

function deriveAuthorityRecords(evidence) {
  const groundRoot = evidence.frames.hEarthFrame?.contentDocument?.getElementById('h-earth-functional-landscape-route');
  const groundViewActive = evidence.sources.hEarth.ok && groundRoot?.dataset.run8eReady === 'true';
  const placement = evidence.sources.placement.value;
  const manor = placement?.areaDispositions?.find(
    (area) => area.areaId === 'GRATITUDE_REGION_MIRROR_MANOR_PRECINCT'
  );
  const deferred = Array.isArray(manor?.deferred) ? manor.deferred : [];
  return freeze([
    {
      recordId: 'GROUND_VIEW_STATUS',
      status: groundViewActive ? 'PASS' : evidence.frameErrors.hEarthFrameError ? 'UNRESOLVED' : 'FAIL',
      value: groundViewActive ? 'ACTIVE_PUBLIC_NAVIGABLE_GROUND_VIEW' : 'CURRENT_GROUND_VIEW_NOT_ESTABLISHED',
      hardcoded: false,
      sources: ['/showroom/globe/h-earth/', 'H_EARTH_RUN8E_PUBLIC_ROUTE']
    },
    {
      recordId: 'ESTATE_OR_MANOR_STATUS',
      status: manor?.lifecycleDisposition === 'ACCEPTED' && deferred.length > 0 ? 'HELD_BY_CURRENT_AUTHORITY' : manor ? 'PASS' : 'UNRESOLVED',
      value: manor?.lifecycleDisposition === 'ACCEPTED'
        ? 'SITE_ENVELOPE_ACCEPTED_DETAILED_ARCHITECTURE_DEFERRED'
        : 'CURRENT_MANOR_STATUS_NOT_ESTABLISHED',
      acceptedSiteEnvelope: manor?.lifecycleDisposition === 'ACCEPTED',
      deferredSubscope: deferred,
      hardcoded: false,
      source: '/h-earth-3d/validation/h-earth.gratitude-region.final-spatial-placement-disposition.receipt.v1.json'
    }
  ]);
}

export function buildDeterministicGaugeReceipt({ sourceHead, results, derivedAuthorityRecords }) {
  const readiness = computeGaugeReadiness(results);
  const body = {
    receiptType: RECEIPT_ID,
    contractId: CONTRACT_ID,
    version: VERSION,
    exactReconciliationBase: EXACT_BASE,
    executedSourceHead: sourceHead,
    resultDomain: STATUS_VALUES,
    readinessLaw: 'REQUIRED_APPLICABLE_PASSES_DIVIDED_BY_REQUIRED_APPLICABLE_CHECKS',
    legacyDispositionCount: H_EARTH_LEGACY_GAUGE_DISPOSITIONS.length,
    legacyDispositions: H_EARTH_LEGACY_GAUGE_DISPOSITIONS,
    currentAuthorityCheckCount: H_EARTH_CURRENT_AUTHORITY_CHECKS.length,
    results: results.map((result) => normalizeResult(result)),
    derivedAuthorityRecords: clone(derivedAuthorityRecords),
    readiness,
    boundaries: {
      readOnly: true,
      repositoryMutationPerformed: false,
      liveHEarthMutationPerformed: false,
      narrativePresentationMutationPerformed: false,
      productAcceptanceClaimed: false,
      defaultPromotionPerformed: false
    }
  };
  return freeze({ ...body, receiptDigest: canonicalDigest(body) });
}

async function executeCurrentAuthorityGauge({ sourceHead = EXACT_BASE } = {}) {
  const token = `${CONTRACT_ID}-${sourceHead}`;
  const evidence = await prepareSharedEvidence(sourceHead, token);
  const checkById = Object.fromEntries(H_EARTH_CURRENT_AUTHORITY_CHECKS.map((check) => [check.checkId, check]));
  const results = [
    checkMirrorland(checkById.MIRRORLAND_GLOBE_NARRATIVE_ROUTE_REACHABLE, evidence),
    checkGroundRoute(checkById.H_EARTH_PUBLIC_GROUND_VIEW_ROUTE_REACHABLE, evidence),
    checkRun8EHost(checkById.H_EARTH_RUN_8E_PUBLIC_HOST_PRESENT, evidence),
    checkTerrain(checkById.RUN_8B_SUCCESSOR_TERRAIN_AUTHORITY_PRESENT, evidence),
    checkAcceptedRenderer(checkById.ACCEPTED_CP2_WEBGL_RENDERER_PRESENT, evidence),
    checkLiveBinding(checkById.CURRENT_LIVE_GPU_BINDING_PRESENT, evidence),
    checkFd05(checkById.FD_05_DIAGNOSTIC_AUTHORITY_REACHABLE, evidence),
    checkPlatform(checkById.UNIFIED_INSTRUMENT_PLATFORM_REACHABLE, evidence),
    checkRegistryDigests(checkById.TOOL_REGISTRY_AND_SCENE_REGISTRY_DIGESTS_MATCH, evidence),
    checkRejectedVisualContent(checkById.NO_REJECTED_VISUAL_CONTENT_BOUND_TO_LIVE, evidence),
    checkProductToolingSeparation(checkById.LIVE_PRODUCT_AND_TOOLING_PATHS_REMAIN_SEPARATE, evidence)
  ];
  const derivedAuthorityRecords = deriveAuthorityRecords(evidence);
  const receipt = buildDeterministicGaugeReceipt({ sourceHead, results, derivedAuthorityRecords });
  removeFrame(evidence.frames.hEarthFrame);
  removeFrame(evidence.frames.fd05Frame);
  return receipt;
}

let latestReceipt = null;
export const H_EARTH_CURRENT_AUTHORITY_GAUGE = freeze({
  contractId: CONTRACT_ID,
  receiptId: RECEIPT_ID,
  version: VERSION,
  exactBase: EXACT_BASE,
  resultDomain: STATUS_VALUES,
  expectedRegistryDigests: {
    toolRegistry: EXPECTED_TOOL_REGISTRY_DIGEST,
    sceneRegistry: EXPECTED_SCENE_REGISTRY_DIGEST
  },
  legacyDispositions: H_EARTH_LEGACY_GAUGE_DISPOSITIONS,
  checks: H_EARTH_CURRENT_AUTHORITY_CHECKS,
  computeReadiness: computeGaugeReadiness,
  buildReceipt: buildDeterministicGaugeReceipt,
  run: async (options = {}) => {
    latestReceipt = await executeCurrentAuthorityGauge(options);
    return latestReceipt;
  },
  getReceipt: () => latestReceipt
});

function byId(id) { return document.getElementById(id); }
function setText(id, value) { const node = byId(id); if (node) node.textContent = String(value); }
function renderStatusCounts(readiness) {
  setText('requiredCount', readiness.requiredApplicableChecks);
  setText('passCount', readiness.requiredApplicablePasses);
  setText('heldCount', readiness.counts.HELD_BY_CURRENT_AUTHORITY);
  setText('supersededCount', readiness.counts.SUPERSEDED + H_EARTH_LEGACY_GAUGE_DISPOSITIONS.filter((row) => row.status === 'SUPERSEDED').length);
  setText('failCount', readiness.requiredApplicableFailures);
  setText('unresolvedCount', readiness.requiredApplicableUnresolved);
  setText('readiness', `${readiness.readinessPercent}%`);
}
function renderResults(receipt) {
  const checksNode = byId('checks');
  if (checksNode) {
    checksNode.replaceChildren(...receipt.results.map((item) => {
      const article = document.createElement('article');
      article.className = 'check';
      article.dataset.status = item.status;
      const body = document.createElement('div');
      const title = document.createElement('h2');
      title.textContent = `${item.ordinal}. ${item.label}`;
      const detail = document.createElement('p');
      detail.textContent = item.detail;
      const badge = document.createElement('span');
      badge.className = 'status';
      badge.textContent = item.status.replaceAll('_', ' ');
      body.append(title, detail);
      article.append(body, badge);
      return article;
    }));
  }
  const derivedNode = byId('derived-authorities');
  if (derivedNode) {
    derivedNode.replaceChildren(...receipt.derivedAuthorityRecords.map((item) => {
      const article = document.createElement('article');
      article.className = 'check';
      article.dataset.status = item.status;
      const body = document.createElement('div');
      const title = document.createElement('h2');
      title.textContent = item.recordId.replaceAll('_', ' ');
      const detail = document.createElement('p');
      detail.textContent = item.value;
      const badge = document.createElement('span');
      badge.className = 'status';
      badge.textContent = item.status.replaceAll('_', ' ');
      body.append(title, detail);
      article.append(body, badge);
      return article;
    }));
  }
  renderStatusCounts(receipt.readiness);
  setText('receipt', stableStringify(receipt, 2));
  document.documentElement.dataset.gaugesContract = CONTRACT_ID;
  document.documentElement.dataset.gaugesReceipt = RECEIPT_ID;
  document.documentElement.dataset.currentAuthorityGaugeReceipt = RECEIPT_ID;
  document.documentElement.dataset.gaugesReadiness = String(receipt.readiness.readinessPercent);
  document.documentElement.dataset.gaugesRequired = String(receipt.readiness.requiredApplicableChecks);
  document.documentElement.dataset.gaugesPass = String(receipt.readiness.requiredApplicablePasses);
  document.documentElement.dataset.gaugesHeld = String(receipt.readiness.counts.HELD_BY_CURRENT_AUTHORITY);
  document.documentElement.dataset.gaugesSuperseded = String(H_EARTH_LEGACY_GAUGE_DISPOSITIONS.filter((row) => row.status === 'SUPERSEDED').length);
  document.documentElement.dataset.gaugesFail = String(receipt.readiness.requiredApplicableFailures);
  document.documentElement.dataset.gaugesUnresolved = String(receipt.readiness.requiredApplicableUnresolved);
  document.documentElement.dataset.gaugesMergeEligible = String(receipt.readiness.mergeEligible);
  document.documentElement.dataset.gaugesReceiptDigest = receipt.receiptDigest;
}
function renderLegacyDispositions() {
  const node = byId('legacy-dispositions');
  if (!node) return;
  node.replaceChildren(...H_EARTH_LEGACY_GAUGE_DISPOSITIONS.map((item) => {
    const row = document.createElement('div');
    row.className = 'legacy-row';
    const name = document.createElement('strong');
    name.textContent = `${item.row}. ${item.legacyName}`;
    const disposition = document.createElement('span');
    disposition.textContent = `${item.disposition} → ${item.successorCheck}`;
    row.append(name, disposition);
    return row;
  }));
}

async function runAndRender() {
  const button = byId('runAudit');
  if (button) button.disabled = true;
  setText('receipt', `${CONTRACT_ID} · executing current-authority checks`);
  try {
    const sourceHead = new URLSearchParams(location.search).get('head') || EXACT_BASE;
    const receipt = await H_EARTH_CURRENT_AUTHORITY_GAUGE.run({ sourceHead });
    renderResults(receipt);
  } catch (error) {
    setText('receipt', stableStringify({
      contractId: CONTRACT_ID,
      status: 'UNRESOLVED',
      error: String(error?.stack ?? error),
      boundaries: { repositoryMutationPerformed: false, liveHEarthMutationPerformed: false }
    }, 2));
    document.documentElement.dataset.currentAuthorityGaugeReceipt = 'UNRESOLVED';
  } finally {
    if (button) button.disabled = false;
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.H_EARTH_CURRENT_AUTHORITY_GAUGE = H_EARTH_CURRENT_AUTHORITY_GAUGE;
  renderLegacyDispositions();
  byId('runAudit')?.addEventListener('click', runAndRender);
  runAndRender();
}

export default H_EARTH_CURRENT_AUTHORITY_GAUGE;
