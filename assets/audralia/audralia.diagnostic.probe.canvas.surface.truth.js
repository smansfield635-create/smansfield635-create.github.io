// /assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js
// AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v5
// Full-file replacement.
// Diagnostic-only. Read-only. Synchronous station receipt only.
// No Promise return. No production mutation. No renderer authority.
// No runtime restart authority. No repair authority. No readiness authority.
// No visual pass authority. No F21 authority.
//
// Renewal purpose:
// - Preserve v4 target-frame, route, lifecycle, runtime-global, dataset,
//   canvas, primary-surface, fallback-surface, owner, and issue separation.
// - Add complete North-conductor v3_2_1 discovery aliases.
// - Publish under root globals and AUDRALIA namespace paths.
// - Preserve Station 4 / F8 / CANVAS_SURFACE_TRUTH identity.
// - Keep F8 as surface-truth observation only, not runtime interpretation.

(function registerAudraliaDiagnosticCanvasSurfaceTruth(global) {
"use strict";

var root =
global ||
(
typeof window !== "undefined"
? window
: typeof globalThis !== "undefined"
? globalThis
: this
);

var CONTRACT =
"AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v5";

var PREVIOUS_CONTRACT =
"AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_F8_3D_TNT_v4";

var VERSION =
"5.0.0";

var FILE =
"/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js";

var STATION_ID =
"CANVAS_SURFACE_TRUTH";

var CYCLE_POSITION =
4;

var FIBONACCI =
"F8";

var NEWS =
"SURFACE";

var RECEIPT_SCHEMA =
"AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1";

var API_SCHEMA =
"AUDRALIA_DIAGNOSTIC_STATION_API_v1";

var REGISTRATION_RECEIPT_SCHEMA =
"AUDRALIA_DIAGNOSTIC_STATION_REGISTRATION_RECEIPT_v1";

var TARGET_ROUTE =
"/showroom/globe/audralia/";

var TARGET_FRAME_ID =
"audraliaDiagnosticTargetFrame";

var RUNTIME_GLOBAL_NAMES =
Object.freeze([
"DGBAudraliaPlanetRuntime",
"DGBAudraliaPlanetRenderer",
"DGBAudraliaPlanetRoute"
]);

var NO_CLAIMS =
Object.freeze({
engineAuthority: false,
productionMutationAuthority: false,
contractRewriteAuthority: false,
routeMutationAuthority: false,
rendererAuthority: false,
runtimeAuthority: false,
canvasAuthority: false,
webGLAuthority: false,
webGPUAuthority: false,
repairAuthorizationAuthority: false,
fileAuthorizationAuthority: false,
finalProductionVerdictAuthority: false,
diagnosticPassProvesReady: false,
surfacePresenceProvesReadiness: false,
iframePresenceProvesPresentation: false,
runtimeGlobalPresenceProvesPresentation: false,
canvasPresenceProvesPresentation: false,
documentCompleteProvesRuntimeReady: false,
readyClaimed: false,
verifiedClaimed: false,
visualPassClaimed: false,
finalVisualPassClaimed: false,
generatedImage: false,
graphicBox: false,
f13Claimed: false,
f21Claimed: false,
webGL: false,
webGPU: false
});

function nowISO() {
try {
return new Date().toISOString();
} catch (_error) {
return null;
}
}

function isObject(value) {
return Boolean(
value &&
typeof value === "object" &&
!Array.isArray(value)
);
}

function clone(value) {
try {
return JSON.parse(JSON.stringify(value));
} catch (_error) {
return null;
}
}

function deepFreeze(value, seen) {
if (!value || typeof value !== "object") {
return value;
}

var memory = seen || [];

if (memory.indexOf(value) !== -1) {
  return value;
}

memory.push(value);

try {
  Object.keys(value).forEach(function freezeKey(key) {
    deepFreeze(value[key], memory);
  });

  Object.freeze(value);
} catch (_error) {}

return value;

}

function stableStringify(value) {
if (value === null) {
return "null";
}

if (typeof value === "string") {
  return JSON.stringify(value);
}

if (typeof value === "number") {
  return Number.isFinite(value) ? String(value) : "null";
}

if (typeof value === "boolean") {
  return value ? "true" : "false";
}

if (Array.isArray(value)) {
  return "[" + value.map(stableStringify).join(",") + "]";
}

if (isObject(value)) {
  return "{" + Object.keys(value).sort().map(function encode(key) {
    return JSON.stringify(key) + ":" + stableStringify(value[key]);
  }).join(",") + "}";
}

return "null";

}

function hash(value) {
var text =
stableStringify(value);

var h =
  0x811c9dc5;

for (var index = 0; index < text.length; index += 1) {
  h ^= text.charCodeAt(index);

  h +=
    (h << 1) +
    (h << 4) +
    (h << 7) +
    (h << 8) +
    (h << 24);

  h >>>= 0;
}

return "fnv1a32:" + ("00000000" + h.toString(16)).slice(-8);

}

function issue(code, path, detail) {
return {
code: String(code || "ISSUE"),
path: String(path || "$"),
detail: String(detail || code || "ISSUE")
};
}

function observation(id, kind, payload) {
return Object.assign(
{
id: String(id),
kind: String(kind)
},
payload || {}
);
}

function firstString() {
for (var index = 0; index < arguments.length; index += 1) {
if (
typeof arguments[index] === "string" &&
arguments[index].length
) {
return arguments[index];
}
}

return null;

}

function firstBoolean() {
for (var index = 0; index < arguments.length; index += 1) {
if (typeof arguments[index] === "boolean") {
return arguments[index];
}
}

return null;

}

function firstNumber() {
for (var index = 0; index < arguments.length; index += 1) {
if (
typeof arguments[index] === "number" &&
Number.isFinite(arguments[index])
) {
return arguments[index];
}
}

return null;

}

function firstObject() {
for (var index = 0; index < arguments.length; index += 1) {
if (isObject(arguments[index])) {
return arguments[index];
}
}

return null;

}

function normalizePathname(value) {
if (
typeof value !== "string" ||
!value.length
) {
return null;
}

try {
  var base =
    root &&
    root.location &&
    root.location.href
      ? root.location.href
      : "https://diagnostic.invalid/";

  var url =
    new URL(value, base);

  var pathname =
    url.pathname || "/";

  if (pathname.charAt(0) !== "/") {
    pathname = "/" + pathname;
  }

  pathname =
    pathname.replace(/\/{2,}/g, "/");

  if (
    pathname.length > 1 &&
    pathname.charAt(pathname.length - 1) !== "/"
  ) {
    pathname += "/";
  }

  return pathname;
} catch (_error) {
  var plain =
    String(value)
      .split("#")[0]
      .split("?")[0];

  if (plain.charAt(0) !== "/") {
    plain = "/" + plain;
  }

  plain =
    plain.replace(/\/{2,}/g, "/");

  if (
    plain.length > 1 &&
    plain.charAt(plain.length - 1) !== "/"
  ) {
    plain += "/";
  }

  return plain;
}

}

function routeMatches(observed, expected) {
var observedPath =
normalizePathname(observed);

var expectedPath =
  normalizePathname(expected);

return Boolean(
  observedPath &&
  expectedPath &&
  observedPath === expectedPath
);

}

function booleanFromDataset(element, key) {
if (
!element ||
!element.dataset ||
!Object.prototype.hasOwnProperty.call(element.dataset, key)
) {
return null;
}

var value =
  String(element.dataset[key]).toLowerCase();

if (value === "true") {
  return true;
}

if (value === "false") {
  return false;
}

return null;

}

function numberFromDataset(element, key) {
if (
!element ||
!element.dataset ||
!Object.prototype.hasOwnProperty.call(element.dataset, key)
) {
return null;
}

var value =
  Number(element.dataset[key]);

return Number.isFinite(value)
  ? value
  : null;

}

function stringFromDataset(element, key) {
if (
!element ||
!element.dataset ||
!Object.prototype.hasOwnProperty.call(element.dataset, key)
) {
return null;
}

var value =
  String(element.dataset[key]);

return value.length
  ? value
  : null;

}

function resolveTargetFrame() {
var doc =
root.document || null;

if (!doc) {
  return null;
}

return (
  doc.getElementById(TARGET_FRAME_ID) ||
  doc.querySelector('iframe[data-diagnostic-target="audralia"]') ||
  doc.querySelector("iframe[data-audralia-diagnostic-target]") ||
  doc.querySelector('iframe[src="' + TARGET_ROUTE + '"]') ||
  null
);

}

function observedFrameRoute(frame, frameWindow, frameDocument) {
var values = [];

try {
  if (
    frameWindow &&
    frameWindow.location &&
    typeof frameWindow.location.href === "string"
  ) {
    values.push(frameWindow.location.href);
  }
} catch (_error1) {}

try {
  if (
    frameDocument &&
    frameDocument.location &&
    typeof frameDocument.location.href === "string"
  ) {
    values.push(frameDocument.location.href);
  }
} catch (_error2) {}

try {
  if (
    frame &&
    typeof frame.src === "string"
  ) {
    values.push(frame.src);
  }
} catch (_error3) {}

try {
  if (
    frame &&
    typeof frame.getAttribute === "function"
  ) {
    values.push(frame.getAttribute("src"));
  }
} catch (_error4) {}

for (var index = 0; index < values.length; index += 1) {
  if (
    typeof values[index] === "string" &&
    values[index].length
  ) {
    return values[index];
  }
}

return null;

}

function readRuntimeGlobal(frameWindow) {
var result = {
runtime: null,
name: null
};

if (!frameWindow) {
  return result;
}

for (
  var index = 0;
  index < RUNTIME_GLOBAL_NAMES.length;
  index += 1
) {
  var name =
    RUNTIME_GLOBAL_NAMES[index];

  try {
    if (frameWindow[name]) {
      result.runtime =
        frameWindow[name];

      result.name =
        name;

      return result;
    }
  } catch (_error) {}
}

return result;

}

function readRuntimeMethod(runtime, method) {
if (
!runtime ||
typeof runtime[method] !== "function"
) {
return null;
}

try {
  return clone(runtime[method]());
} catch (_error) {
  return null;
}

}

function readTargetDatasets(frameDocument) {
var html =
frameDocument
? frameDocument.documentElement
: null;

var body =
  frameDocument
    ? frameDocument.body
    : null;

return {
  contract:
    firstString(
      stringFromDataset(body, "audraliaPlanetRuntimeContract"),
      stringFromDataset(html, "audraliaPlanetRuntimeContract")
    ),

  receipt:
    firstString(
      stringFromDataset(body, "audraliaPlanetRuntimeReceipt"),
      stringFromDataset(html, "audraliaPlanetRuntimeReceipt")
    ),

  mode:
    firstString(
      stringFromDataset(body, "audraliaPlanetRuntimeMode"),
      stringFromDataset(html, "audraliaPlanetRuntimeMode")
    ),

  mounted:
    firstBoolean(
      booleanFromDataset(body, "audraliaPlanetRuntimeMounted"),
      booleanFromDataset(html, "audraliaPlanetRuntimeMounted")
    ),

  running:
    firstBoolean(
      booleanFromDataset(body, "audraliaPlanetRuntimeRunning"),
      booleanFromDataset(html, "audraliaPlanetRuntimeRunning")
    ),

  stageRectNonzero:
    firstBoolean(
      booleanFromDataset(body, "audraliaPlanetRuntimeStageRectNonzero"),
      booleanFromDataset(html, "audraliaPlanetRuntimeStageRectNonzero")
    ),

  geometryReady:
    firstBoolean(
      booleanFromDataset(body, "audraliaPlanetRuntimeGeometryReady"),
      booleanFromDataset(html, "audraliaPlanetRuntimeGeometryReady")
    ),

  webGL:
    firstBoolean(
      booleanFromDataset(body, "audraliaPlanetRuntimeWebGL"),
      booleanFromDataset(html, "audraliaPlanetRuntimeWebGL")
    ),

  firstFrameDrawn:
    firstBoolean(
      booleanFromDataset(body, "audraliaPlanetRuntimeFirstFrame"),
      booleanFromDataset(html, "audraliaPlanetRuntimeFirstFrame")
    ),

  firstVisiblePixelObserved:
    firstBoolean(
      booleanFromDataset(body, "audraliaPlanetRuntimeVisiblePixel"),
      booleanFromDataset(html, "audraliaPlanetRuntimeVisiblePixel")
    ),

  contextLost:
    firstBoolean(
      booleanFromDataset(body, "audraliaPlanetRuntimeContextLost"),
      booleanFromDataset(html, "audraliaPlanetRuntimeContextLost")
    ),

  errorCount:
    firstNumber(
      numberFromDataset(body, "audraliaPlanetRuntimeErrorCount"),
      numberFromDataset(html, "audraliaPlanetRuntimeErrorCount")
    )
};

}

function readLiveTargetFrame() {
var frame =
resolveTargetFrame();

var result = {
  framePresent: Boolean(frame),
  frameId: frame && frame.id ? frame.id : null,
  expectedRoute: TARGET_ROUTE,
  expectedRouteNormalized: normalizePathname(TARGET_ROUTE),
  observedRoute: null,
  observedRouteNormalized: null,
  routeObserved: false,
  routeMatched: false,
  sameOriginAccessible: false,
  documentLoaded: false,
  documentReadyState: null,
  runtimeStatus: null,
  receiptLight: null,
  receipt: null,
  datasetStatus: null,
  canvasPresent: false,
  runtimeCanvasPresent: false,
  fallbackCanvasPresent: false,
  anyCanvasPresent: false,
  runtimeGlobalPresent: false,
  runtimeGlobalName: null,
  runtimeStatusMethodPresent: false,
  receiptLightMethodPresent: false,
  receiptMethodPresent: false,
  readError: null,
  capturedAt: nowISO()
};

if (!frame) {
  return result;
}

try {
  var frameWindow =
    frame.contentWindow || null;

  var frameDocument =
    frame.contentDocument ||
    (
      frameWindow
        ? frameWindow.document
        : null
    );

  result.sameOriginAccessible =
    Boolean(frameDocument);

  result.observedRoute =
    observedFrameRoute(
      frame,
      frameWindow,
      frameDocument
    );

  result.observedRouteNormalized =
    normalizePathname(result.observedRoute);

  result.routeObserved =
    Boolean(result.observedRouteNormalized);

  result.routeMatched =
    routeMatches(result.observedRoute, TARGET_ROUTE);

  result.documentReadyState =
    frameDocument && frameDocument.readyState
      ? frameDocument.readyState
      : null;

  result.documentLoaded =
    Boolean(
      frameDocument &&
      (
        frameDocument.readyState === "interactive" ||
        frameDocument.readyState === "complete"
      )
    );

  result.runtimeCanvasPresent =
    Boolean(
      frameDocument &&
      frameDocument.querySelector(
        "canvas[data-audralia-planet-runtime-canvas]"
      )
    );

  result.fallbackCanvasPresent =
    Boolean(
      frameDocument &&
      frameDocument.querySelector(
        "canvas[data-audralia-planet-fallback-canvas]"
      )
    );

  result.anyCanvasPresent =
    Boolean(
      frameDocument &&
      frameDocument.querySelector("canvas")
    );

  result.canvasPresent =
    Boolean(
      result.runtimeCanvasPresent ||
      result.fallbackCanvasPresent ||
      result.anyCanvasPresent
    );

  result.datasetStatus =
    readTargetDatasets(frameDocument);

  var runtimeResult =
    readRuntimeGlobal(frameWindow);

  var runtime =
    runtimeResult.runtime;

  result.runtimeGlobalPresent =
    Boolean(runtime);

  result.runtimeGlobalName =
    runtimeResult.name;

  result.runtimeStatusMethodPresent =
    Boolean(
      runtime &&
      typeof runtime.getStatus === "function"
    );

  result.receiptLightMethodPresent =
    Boolean(
      runtime &&
      typeof runtime.getReceiptLight === "function"
    );

  result.receiptMethodPresent =
    Boolean(
      runtime &&
      typeof runtime.getReceipt === "function"
    );

  result.runtimeStatus =
    readRuntimeMethod(runtime, "getStatus");

  result.receiptLight =
    readRuntimeMethod(runtime, "getReceiptLight");

  result.receipt =
    readRuntimeMethod(runtime, "getReceipt");
} catch (error) {
  result.readError =
    error && error.message
      ? error.message
      : "TARGET_FRAME_READ_FAILED";
}

return result;

}

function extractPacketTarget(packet) {
return firstObject(
packet && packet.target,
packet && packet.construct && packet.construct.target,
packet && packet.targetFrame,
{}
);
}

function extractRuntimeStatus(packet, liveFrame) {
var target =
extractPacketTarget(packet);

return firstObject(
  liveFrame && liveFrame.runtimeStatus,
  liveFrame && liveFrame.receiptLight,
  liveFrame && liveFrame.receipt,
  liveFrame && liveFrame.datasetStatus,
  target.targetRuntimeStatus,
  target.runtimeStatus,
  target.receiptLight,
  packet && packet.targetRuntimeStatus,
  packet && packet.runtimeStatus,
  packet && packet.engineRuntime && packet.engineRuntime.targetRuntimeStatus,
  {}
);

}

function statusValue(runtimeStatus, key) {
if (!isObject(runtimeStatus)) {
return null;
}

return firstBoolean(
  runtimeStatus[key],
  runtimeStatus.statusDetail && runtimeStatus.statusDetail[key]
);

}

function numericStatusValue(runtimeStatus, key) {
if (!isObject(runtimeStatus)) {
return null;
}

return firstNumber(
  runtimeStatus[key],
  runtimeStatus.statusDetail && runtimeStatus.statusDetail[key]
);

}

function stringStatusValue(runtimeStatus, key) {
if (!isObject(runtimeStatus)) {
return null;
}

return firstString(
  runtimeStatus[key],
  runtimeStatus.statusDetail && runtimeStatus.statusDetail[key]
);

}

function evaluateSurface(packet, liveFrame) {
var target =
extractPacketTarget(packet || {});

var runtimeStatus =
  extractRuntimeStatus(packet || {}, liveFrame || {});

var framePresent =
  firstBoolean(
    liveFrame && liveFrame.framePresent,
    target.framePresent
  );

var sameOriginAccessible =
  firstBoolean(
    liveFrame && liveFrame.sameOriginAccessible,
    target.sameOriginAccessible
  );

var documentLoaded =
  firstBoolean(
    liveFrame && liveFrame.documentLoaded,
    target.documentLoaded
  );

var routeObserved =
  firstBoolean(
    liveFrame && liveFrame.routeObserved
  );

var routeMatched =
  firstBoolean(
    liveFrame && liveFrame.routeMatched
  );

var runtimeGlobalPresent =
  firstBoolean(
    liveFrame && liveFrame.runtimeGlobalPresent
  );

var runtimeEvidenceAvailable =
  Boolean(
    isObject(runtimeStatus) &&
    Object.keys(runtimeStatus).length
  );

var mounted =
  statusValue(runtimeStatus, "mounted");

var running =
  statusValue(runtimeStatus, "running");

var stageRectNonzero =
  statusValue(runtimeStatus, "stageRectNonzero");

var geometryReady =
  statusValue(runtimeStatus, "geometryReady");

var firstFrameDrawn =
  firstBoolean(
    statusValue(runtimeStatus, "firstFrameDrawn"),
    statusValue(runtimeStatus, "firstFrameSubmitted"),
    statusValue(runtimeStatus, "firstFramePresented")
  );

var visiblePixelObserved =
  firstBoolean(
    statusValue(runtimeStatus, "firstVisiblePixelObserved"),
    statusValue(runtimeStatus, "visiblePixelObserved")
  );

var fallbackActive =
  statusValue(runtimeStatus, "fallbackActive");

var webGL =
  statusValue(runtimeStatus, "webGL");

var contextLost =
  statusValue(runtimeStatus, "contextLost");

var errorCount =
  numericStatusValue(runtimeStatus, "errorCount");

var width =
  numericStatusValue(runtimeStatus, "width");

var height =
  numericStatusValue(runtimeStatus, "height");

var pixelWidth =
  numericStatusValue(runtimeStatus, "pixelWidth");

var pixelHeight =
  numericStatusValue(runtimeStatus, "pixelHeight");

var mode =
  stringStatusValue(runtimeStatus, "mode");

var fallbackCanvasPresent =
  firstBoolean(
    liveFrame && liveFrame.fallbackCanvasPresent
  );

var runtimeCanvasPresent =
  firstBoolean(
    liveFrame && liveFrame.runtimeCanvasPresent
  );

var fallbackVisible =
  fallbackActive === true &&
  firstFrameDrawn === true &&
  visiblePixelObserved === true &&
  fallbackCanvasPresent === true;

var primaryVisible =
  mounted === true &&
  stageRectNonzero === true &&
  geometryReady === true &&
  firstFrameDrawn === true &&
  visiblePixelObserved === true &&
  (
    runtimeCanvasPresent === true ||
    webGL === true
  );

var runtimeLifecyclePending =
  runtimeGlobalPresent === true &&
  runtimeEvidenceAvailable === true &&
  (
    mounted !== true ||
    stageRectNonzero !== true ||
    geometryReady !== true ||
    firstFrameDrawn !== true ||
    visiblePixelObserved !== true
  );

var lifecycleClass =
  "UNKNOWN";

if (framePresent !== true) {
  lifecycleClass =
    "TARGET_UNBOUND";
} else if (sameOriginAccessible !== true) {
  lifecycleClass =
    "TARGET_INACCESSIBLE";
} else if (routeObserved !== true) {
  lifecycleClass =
    "TARGET_ROUTE_UNVERIFIED";
} else if (routeMatched !== true) {
  lifecycleClass =
    "TARGET_ROUTE_MISMATCH";
} else if (documentLoaded !== true) {
  lifecycleClass =
    "TARGET_LOADING";
} else if (runtimeGlobalPresent !== true) {
  lifecycleClass =
    "RUNTIME_GLOBAL_ABSENT_AFTER_CONFIRMED_LOAD";
} else if (runtimeEvidenceAvailable !== true) {
  lifecycleClass =
    "RUNTIME_EVIDENCE_UNAVAILABLE";
} else if (fallbackVisible) {
  lifecycleClass =
    "FALLBACK_VISIBLE";
} else if (primaryVisible) {
  lifecycleClass =
    "PRIMARY_VISIBLE";
} else if (runtimeLifecyclePending) {
  lifecycleClass =
    "RUNTIME_LIFECYCLE_PENDING";
} else {
  lifecycleClass =
    "RUNTIME_SURFACE_INCOMPLETE";
}

return {
  framePresent: framePresent,
  frameId: liveFrame ? liveFrame.frameId : null,
  expectedRoute: TARGET_ROUTE,
  expectedRouteNormalized: normalizePathname(TARGET_ROUTE),
  observedRoute: liveFrame ? liveFrame.observedRoute : null,
  observedRouteNormalized: liveFrame ? liveFrame.observedRouteNormalized : null,
  routeObserved: routeObserved,
  routeMatched: routeMatched,
  sameOriginAccessible: sameOriginAccessible,
  documentLoaded: documentLoaded,
  documentReadyState: liveFrame ? liveFrame.documentReadyState : null,
  canvasPresent: liveFrame ? liveFrame.canvasPresent : null,
  runtimeCanvasPresent: runtimeCanvasPresent,
  fallbackCanvasPresent: fallbackCanvasPresent,
  anyCanvasPresent: liveFrame ? liveFrame.anyCanvasPresent : null,
  runtimeGlobalPresent: runtimeGlobalPresent,
  runtimeGlobalName: liveFrame ? liveFrame.runtimeGlobalName : null,
  runtimeStatusMethodPresent: liveFrame ? liveFrame.runtimeStatusMethodPresent : null,
  receiptLightMethodPresent: liveFrame ? liveFrame.receiptLightMethodPresent : null,
  receiptMethodPresent: liveFrame ? liveFrame.receiptMethodPresent : null,
  runtimeEvidenceAvailable: runtimeEvidenceAvailable,
  mounted: mounted,
  running: running,
  stageRectNonzero: stageRectNonzero,
  geometryReady: geometryReady,
  webGL: webGL,
  fallbackActive: fallbackActive,
  contextLost: contextLost,
  firstFrameDrawn: firstFrameDrawn,
  visiblePixelObserved: visiblePixelObserved,
  width: width,
  height: height,
  pixelWidth: pixelWidth,
  pixelHeight: pixelHeight,
  errorCount: errorCount,
  mode: mode,
  primaryVisible: primaryVisible,
  fallbackVisible: fallbackVisible,
  runtimeLifecyclePending: runtimeLifecyclePending,
  surfaceTruthAdmitted: primaryVisible || fallbackVisible,
  lifecycleClass: lifecycleClass,
  runtimeStatus: clone(runtimeStatus),
  liveFrame: clone(liveFrame)
};

}

function ownerForSurface(surface) {
if (surface.framePresent !== true) {
return {
ownerType: "DIAGNOSTIC_OBSERVATORY_TARGET_FRAME",
subjectId: "AUDRALIA_DIAGNOSTIC_TARGET_FRAME",
contract: null,
file: "/showroom/globe/audralia/diagnostic/index.html",
component: "TARGET_FRAME_BINDING"
};
}

if (surface.sameOriginAccessible !== true) {
  return {
    ownerType: "DIAGNOSTIC_OBSERVATORY_TARGET_ACCESS",
    subjectId: "AUDRALIA_DIAGNOSTIC_TARGET_FRAME",
    contract: null,
    file: "/showroom/globe/audralia/diagnostic/index.html",
    component: "TARGET_FRAME_ACCESS"
  };
}

if (
  surface.routeObserved !== true ||
  surface.routeMatched !== true
) {
  return {
    ownerType: "DIAGNOSTIC_OBSERVATORY_TARGET_BINDING",
    subjectId: "AUDRALIA_DIAGNOSTIC_TARGET_FRAME",
    contract: null,
    file: "/showroom/globe/audralia/diagnostic/index.html",
    component: "TARGET_ROUTE_BINDING"
  };
}

if (surface.documentLoaded !== true) {
  return {
    ownerType: "DIAGNOSTIC_TARGET_LIFECYCLE",
    subjectId: "AUDRALIA_DIAGNOSTIC_TARGET_FRAME",
    contract: null,
    file: "/showroom/globe/audralia/diagnostic/index.html",
    component: "TARGET_DOCUMENT_LIFECYCLE"
  };
}

return {
  ownerType: "PUBLIC_AUDRALIA_RUNTIME",
  subjectId: "AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME",
  contract:
    firstString(
      surface.runtimeStatus && surface.runtimeStatus.contract,
      "AUDRALIA_G1_PUBLIC_3D_PLANET_RUNTIME_TNT_v1"
    ),
  file: "/showroom/globe/audralia/index.js",
  component: "CANVAS_SURFACE_TRUTH"
};

}

function buildIssues(surface) {
var issues = [];

if (surface.framePresent !== true) {
  issues.push(
    issue(
      "TARGET_FRAME_NOT_PRESENT",
      "$.target.framePresent",
      "The Audralia diagnostic target iframe was not present."
    )
  );

  return issues;
}

if (surface.sameOriginAccessible !== true) {
  issues.push(
    issue(
      "TARGET_FRAME_NOT_ACCESSIBLE",
      "$.target.sameOriginAccessible",
      "The Audralia target frame was not same-origin accessible."
    )
  );

  return issues;
}

if (surface.routeObserved !== true) {
  issues.push(
    issue(
      "TARGET_ROUTE_UNVERIFIED",
      "$.target.observedRoute",
      "The currently loaded route of the Audralia target frame could not be established."
    )
  );

  return issues;
}

if (surface.routeMatched !== true) {
  issues.push(
    issue(
      "TARGET_ROUTE_MISMATCH",
      "$.target.routeMatched",
      "The diagnostic target frame did not contain the expected Audralia public route."
    )
  );

  return issues;
}

if (surface.documentLoaded !== true) {
  issues.push(
    issue(
      "TARGET_DOCUMENT_LOADING",
      "$.target.documentLoaded",
      "The Audralia target document had not reached an interactive or complete state at the synchronous F8 read."
    )
  );

  return issues;
}

if (surface.runtimeGlobalPresent !== true) {
  issues.push(
    issue(
      "TARGET_RUNTIME_GLOBAL_ABSENT_AFTER_CONFIRMED_LOAD",
      "$.target.runtimeGlobalPresent",
      "The confirmed Audralia public route completed document loading without exposing a recognized Audralia runtime global at the synchronous F8 read."
    )
  );

  return issues;
}

if (surface.runtimeEvidenceAvailable !== true) {
  issues.push(
    issue(
      "TARGET_RUNTIME_EVIDENCE_UNAVAILABLE",
      "$.target.runtimeStatus",
      "The Audralia runtime global was present, but no usable status or receipt evidence was available."
    )
  );

  return issues;
}

if (surface.contextLost === true) {
  issues.push(
    issue(
      "PUBLIC_RUNTIME_CONTEXT_LOST",
      "$.target.runtimeStatus.contextLost",
      "The public Audralia runtime reported a lost rendering context."
    )
  );
}

if (
  surface.errorCount !== null &&
  surface.errorCount > 0 &&
  surface.firstFrameDrawn !== true
) {
  issues.push(
    issue(
      "PUBLIC_RUNTIME_ERRORS_BEFORE_FIRST_FRAME",
      "$.target.runtimeStatus.errorCount",
      "The public Audralia runtime reported one or more errors before producing a first frame."
    )
  );
}

if (surface.mounted !== true) {
  issues.push(
    issue(
      "PUBLIC_RUNTIME_MOUNT_PENDING",
      "$.target.runtimeStatus.mounted",
      "The public Audralia runtime has not yet reported mounted=true."
    )
  );
}

if (surface.stageRectNonzero !== true) {
  issues.push(
    issue(
      "SURFACE_RECT_PENDING",
      "$.target.runtimeStatus.stageRectNonzero",
      "The public Audralia surface has not yet reported a nonzero rendering rectangle."
    )
  );
}

if (surface.geometryReady !== true) {
  issues.push(
    issue(
      "GEOMETRY_PENDING",
      "$.target.runtimeStatus.geometryReady",
      "The public Audralia runtime has not yet reported geometryReady=true."
    )
  );
}

if (surface.firstFrameDrawn !== true) {
  issues.push(
    issue(
      "FIRST_FRAME_PENDING",
      "$.target.runtimeStatus.firstFrameDrawn",
      "The public Audralia runtime has not yet reported firstFrameDrawn=true."
    )
  );
}

if (surface.visiblePixelObserved !== true) {
  issues.push(
    issue(
      "VISIBLE_PIXEL_PENDING",
      "$.target.runtimeStatus.firstVisiblePixelObserved",
      "The public Audralia runtime has not yet reported visible-pixel evidence."
    )
  );
}

return issues;

}

function summaryForSurface(surface) {
switch (surface.lifecycleClass) {
case "TARGET_UNBOUND":
return "CANVAS_SURFACE_TRUTH_HELD_TARGET_FRAME_NOT_PRESENT";

  case "TARGET_INACCESSIBLE":
    return "CANVAS_SURFACE_TRUTH_HELD_TARGET_FRAME_NOT_ACCESSIBLE";

  case "TARGET_ROUTE_UNVERIFIED":
    return "CANVAS_SURFACE_TRUTH_HELD_TARGET_ROUTE_UNVERIFIED";

  case "TARGET_ROUTE_MISMATCH":
    return "CANVAS_SURFACE_TRUTH_HELD_TARGET_ROUTE_MISMATCH";

  case "TARGET_LOADING":
    return "CANVAS_SURFACE_TRUTH_HELD_TARGET_DOCUMENT_LOADING";

  case "RUNTIME_GLOBAL_ABSENT_AFTER_CONFIRMED_LOAD":
    return "CANVAS_SURFACE_TRUTH_HELD_RUNTIME_GLOBAL_ABSENT_AFTER_CONFIRMED_LOAD";

  case "RUNTIME_EVIDENCE_UNAVAILABLE":
    return "CANVAS_SURFACE_TRUTH_HELD_RUNTIME_EVIDENCE_UNAVAILABLE";

  case "RUNTIME_LIFECYCLE_PENDING":
    return "CANVAS_SURFACE_TRUTH_HELD_RUNTIME_LIFECYCLE_PENDING";

  case "FALLBACK_VISIBLE":
    return "CANVAS_SURFACE_TRUTH_ADMITTED_VISIBLE_FALLBACK_SURFACE";

  case "PRIMARY_VISIBLE":
    return "CANVAS_SURFACE_TRUTH_ADMITTED_VISIBLE_PRIMARY_3D_SURFACE";

  default:
    return "CANVAS_SURFACE_TRUTH_HELD_RUNTIME_SURFACE_EVIDENCE_INCOMPLETE";
}

}

function createReceipt(
status,
completed,
handoffEligible,
summary,
packet,
observations,
evidence,
issues,
owner
) {
var receipt = {
schema: RECEIPT_SCHEMA,
cycleId: packet && packet.cycleId ? packet.cycleId : null,
position: CYCLE_POSITION,
cyclePosition: CYCLE_POSITION,
stationId: STATION_ID,
role: STATION_ID,
news: NEWS,
fibonacci: FIBONACCI,
contract: CONTRACT,
previousContract: PREVIOUS_CONTRACT,
version: VERSION,
file: FILE,
status: status,
completed: completed === true,
handoffEligible: handoffEligible === true,
summary: summary,
observations: observations || [],
evidence: evidence || [],
issues: issues || [],
firstHeldCoordinate: status === "HOLD" ? "F8:CANVAS_SURFACE_TRUTH" : null,
firstFailedCoordinate: status === "FAIL" ? "F8:CANVAS_SURFACE_TRUTH" : null,
firstConflictCoordinate: status === "CONFLICT" ? "F8:CANVAS_SURFACE_TRUTH" : null,
recommendedOwner:
owner ||
{
ownerType: "F8_DIAGNOSTIC_PROBE",
subjectId: STATION_ID,
contract: CONTRACT,
file: FILE,
component: "executeCycleStation"
},
generatedAt: nowISO(),
noClaims: clone(NO_CLAIMS),
receiptHash: null
};

receipt.receiptHash =
  hash(receipt);

return deepFreeze(receipt);

}

function executeCycleStation(packet) {
packet =
packet || {};

try {
  var liveFrame =
    readLiveTargetFrame();

  var surface =
    evaluateSurface(packet, liveFrame);

  var observations = [
    observation(
      "CANVAS_SURFACE_TARGET_BINDING",
      "OBSERVED",
      {
        framePresent: surface.framePresent,
        frameId: surface.frameId,
        expectedRoute: surface.expectedRoute,
        expectedRouteNormalized: surface.expectedRouteNormalized,
        observedRoute: surface.observedRoute,
        observedRouteNormalized: surface.observedRouteNormalized,
        routeObserved: surface.routeObserved,
        routeMatched: surface.routeMatched,
        sameOriginAccessible: surface.sameOriginAccessible,
        documentLoaded: surface.documentLoaded,
        documentReadyState: surface.documentReadyState,
        readError: liveFrame.readError
      }
    ),

    observation(
      "CANVAS_SURFACE_TARGET_FRAME",
      "OBSERVED",
      {
        canvasPresent: surface.canvasPresent,
        runtimeCanvasPresent: surface.runtimeCanvasPresent,
        fallbackCanvasPresent: surface.fallbackCanvasPresent,
        anyCanvasPresent: surface.anyCanvasPresent,
        runtimeGlobalPresent: surface.runtimeGlobalPresent,
        runtimeGlobalName: surface.runtimeGlobalName,
        runtimeStatusMethodPresent: surface.runtimeStatusMethodPresent,
        receiptLightMethodPresent: surface.receiptLightMethodPresent,
        receiptMethodPresent: surface.receiptMethodPresent
      }
    ),

    observation(
      "CANVAS_SURFACE_RUNTIME_STATUS",
      "OBSERVED",
      {
        runtimeEvidenceAvailable: surface.runtimeEvidenceAvailable,
        mode: surface.mode,
        mounted: surface.mounted,
        running: surface.running,
        stageRectNonzero: surface.stageRectNonzero,
        width: surface.width,
        height: surface.height,
        pixelWidth: surface.pixelWidth,
        pixelHeight: surface.pixelHeight,
        geometryReady: surface.geometryReady,
        webGL: surface.webGL,
        fallbackActive: surface.fallbackActive,
        contextLost: surface.contextLost,
        firstFrameDrawn: surface.firstFrameDrawn,
        visiblePixelObserved: surface.visiblePixelObserved,
        errorCount: surface.errorCount
      }
    ),

    observation(
      "CANVAS_SURFACE_SYNC_READ_BOUNDARY",
      "DERIVED",
      {
        synchronousOnly: true,
        promiseReturned: false,
        boundedWaitAttempted: false,
        conductorAsyncCompatible: false,
        rerunPermitted: true,
        stationMeaningLimitedToF8: true,
        runtimeInterpretationDeferredToF13AndF21: true
      }
    ),

    observation(
      "CANVAS_SURFACE_TRUTH_CLASSIFICATION",
      "DERIVED",
      {
        lifecycleClass: surface.lifecycleClass,
        primaryVisible: surface.primaryVisible,
        fallbackVisible: surface.fallbackVisible,
        runtimeLifecyclePending: surface.runtimeLifecyclePending,
        surfaceTruthAdmitted: surface.surfaceTruthAdmitted,
        missingEvidenceDisposition: "HOLD",
        syntheticPositiveEvidenceAllowed: false
      }
    )
  ];

  var evidence = [
    {
      id: "CANVAS_SURFACE_REQUEST_HASH",
      kind: "DERIVED",
      hash: hash(packet)
    },
    {
      id: "CANVAS_SURFACE_LIVE_FRAME_HASH",
      kind: "DERIVED",
      hash: hash(liveFrame)
    },
    {
      id: "CANVAS_SURFACE_RUNTIME_STATUS_HASH",
      kind: "DERIVED",
      hash: hash(surface.runtimeStatus)
    },
    {
      id: "CANVAS_SURFACE_EVALUATION_HASH",
      kind: "DERIVED",
      hash: hash(surface)
    },
    {
      id: "CANVAS_SURFACE_ROUTE_VERIFICATION",
      kind: "DERIVED",
      expectedRoute: surface.expectedRouteNormalized,
      observedRoute: surface.observedRouteNormalized,
      routeObserved: surface.routeObserved,
      routeMatched: surface.routeMatched
    }
  ];

  var issues =
    buildIssues(surface);

  var owner =
    ownerForSurface(surface);

  var summary =
    summaryForSurface(surface);

  if (surface.surfaceTruthAdmitted) {
    return createReceipt(
      "PASS",
      true,
      true,
      summary,
      packet,
      observations,
      evidence.concat([
        {
          id: "CANVAS_SURFACE_VALIDATION",
          kind: "DERIVED",
          passed: true,
          issueCount: 0,
          lifecycleClass: surface.lifecycleClass
        }
      ]),
      [],
      owner
    );
  }

  return createReceipt(
    "HOLD",
    false,
    false,
    summary,
    packet,
    observations,
    evidence.concat([
      {
        id: "CANVAS_SURFACE_VALIDATION",
        kind: "DERIVED",
        passed: false,
        issueCount: issues.length,
        firstIssueCode:
          issues[0] && issues[0].code
            ? issues[0].code
            : null,
        lifecycleClass: surface.lifecycleClass
      }
    ]),
    issues,
    owner
  );
} catch (error) {
  return createReceipt(
    "ERROR",
    false,
    false,
    "CANVAS_SURFACE_TRUTH_ERROR_DURING_SYNCHRONOUS_READ",
    packet,
    [
      observation(
        "CANVAS_SURFACE_SYNCHRONOUS_ERROR",
        "ERROR",
        {
          message:
            error && error.message
              ? error.message
              : String(error || "UNKNOWN_F8_ERROR")
        }
      )
    ],
    [
      {
        id: "CANVAS_SURFACE_SYNC_ERROR_HASH",
        kind: "DERIVED",
        hash:
          hash({
            message:
              error && error.message
                ? error.message
                : String(error || "UNKNOWN_F8_ERROR")
          })
      }
    ],
    [
      issue(
        "CANVAS_SURFACE_SYNCHRONOUS_READ_THROW",
        "$.f8",
        error && error.message
          ? error.message
          : String(error || "UNKNOWN_F8_ERROR")
      )
    ],
    {
      ownerType: "F8_DIAGNOSTIC_PROBE",
      subjectId: STATION_ID,
      contract: CONTRACT,
      file: FILE,
      component: "executeCycleStation"
    }
  );
}

}

function getDefinitionReceipt() {
return deepFreeze({
schema: REGISTRATION_RECEIPT_SCHEMA,
stationId: STATION_ID,
cyclePosition: CYCLE_POSITION,
fibonacci: FIBONACCI,
news: NEWS,
contract: CONTRACT,
previousContract: PREVIOUS_CONTRACT,
version: VERSION,
file: FILE,
globalPath: "AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
status: "AVAILABLE",
synchronousStationReceipt: true,
promiseReturn: false,
targetRouteVerification: true,
routeMismatchClassification: true,
lifecycleClassification: true,
dependentIssueSuppression: true,
ownerDifferentiation: true,
conductorDiscoveryAliasesPublished: true,
noClaims: clone(NO_CLAIMS),
generatedAt: nowISO()
});
}

function ensureNamespace(name) {
if (!root || typeof root !== "object") {
return null;
}

if (!root[name] || typeof root[name] !== "object") {
  root[name] = {};
}

return root[name];

}

var API =
deepFreeze({
schema: API_SCHEMA,

  STATION_ID: STATION_ID,
  CYCLE_POSITION: CYCLE_POSITION,
  FIBONACCI: FIBONACCI,
  NEWS: NEWS,
  CONTRACT: CONTRACT,
  PREVIOUS_CONTRACT: PREVIOUS_CONTRACT,
  VERSION: VERSION,
  FILE: FILE,
  TARGET_ROUTE: TARGET_ROUTE,
  TARGET_FRAME_ID: TARGET_FRAME_ID,

  stationId: STATION_ID,
  cyclePosition: CYCLE_POSITION,
  fibonacci: FIBONACCI,
  news: NEWS,
  contract: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  version: VERSION,
  file: FILE,
  role: STATION_ID,

  executeCycleStation: executeCycleStation,
  execute: executeCycleStation,
  getDefinitionReceipt: getDefinitionReceipt,

  readLiveTargetFrame: readLiveTargetFrame,
  evaluateSurface: evaluateSurface,
  normalizePathname: normalizePathname,
  routeMatches: routeMatches,
  ownerForSurface: ownerForSurface,
  buildIssues: buildIssues,
  hash: hash,
  noClaims: NO_CLAIMS
});

if (root && typeof root === "object") {
root.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH =
API;

root.AUDRALIA_DIAGNOSTIC_CANVAS_SURFACE_TRUTH =
  API;

root.AUDRALIA_DIAGNOSTIC_SURFACE_TRUTH =
  API;

root.AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT =
  getDefinitionReceipt();

root.__AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LOADED__ =
  true;

root.__AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_VERSION__ =
  VERSION;

root.__AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT__ =
  CONTRACT;

var audralia =
  ensureNamespace("AUDRALIA");

if (audralia) {
  audralia.diagnosticCanvasSurfaceTruth =
    API;

  audralia.diagnosticSurfaceTruth =
    API;

  if (
    !audralia.diagnostics ||
    typeof audralia.diagnostics !== "object"
  ) {
    audralia.diagnostics = {};
  }

  audralia.diagnostics.canvasSurfaceTruth =
    API;

  audralia.diagnostics.surfaceTruth =
    API;
}

}

if (
typeof module !== "undefined" &&
module.exports
) {
module.exports = API;
}
})(
typeof window !== "undefined"
? window
: typeof globalThis !== "undefined"
? globalThis
: this
);
