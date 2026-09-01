// /assets/hearth/hearth.hex.surface.js
// HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE_TNT_v5
// Full-file replacement.
// Bridge between Chapel 1 Canvas Gate and Chapel 2 Finger Surface.
//
// Owns:
// - Canvas/Control packet intake
// - 3D authority tuple binding
// - Hex Surface gate validation
// - Chapel 1 -> Chapel 2 transmission packet
//
// Does not own:
// - Canvas drawing
// - 3D authority truth
// - Finger Surface truth
// - controls
// - route orchestration
// - final visual pass
// - generated image / GraphicBox / WebGL

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE_TNT_v5";
  const RECEIPT = "HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE_RECEIPT_v5";
  const FILE = "/assets/hearth/hearth.hex.surface.js";
  const ROUTE = "/showroom/globe/hearth/";
  const VERSION = "2026-06-09.hearth-hex-surface-clean-3d-chapel-bridge-v5";

  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const FINGER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";

  const AUTHORITY_ALIAS = "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY";
  const FINGER_ALIAS = "HEARTH_CANVAS_FINGER_SURFACE_3D_CHAPEL_2";

  const PACKET = "HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE_TRANSMISSION_PACKET_v5";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    bridgeLoaded: true,
    clean3dBridge: true,
    chapelBridge: true,
    legacyAliases: false,
    twoDCompatibilityLayer: false,

    authorityObserved: false,
    authorityContract: "UNKNOWN",
    authorityRecognized: false,

    fingerSurfaceObserved: false,
    fingerSurfaceContract: "UNKNOWN",
    fingerSurfaceReceiver: "NONE",

    receivedPacketCount: 0,
    acceptedPacketCount: 0,
    rejectedPacketCount: 0,
    tupleBoundCount: 0,
    transmissionCount: 0,
    deliveryCount: 0,

    lastValidationStatus: "WAITING_PACKET",
    lastRejectionReason: "",
    lastCanonicalTuple: null,
    lastTransmissionPacket: null,
    lastDeliveryResult: null,

    firstFailedCoordinate: "WAITING_CHAPEL_1_PACKET",
    recommendedNextFile: CANVAS_FILE,
    recommendedNextAction: "SEND_CANVAS_OR_CONTROL_PACKET_TO_HEX_SURFACE_BRIDGE",
    postgameStatus: "HEX_SURFACE_BRIDGE_LOADED_WAITING_CHAPEL_1",

    updatedAt: nowIso(),

    ownsBridgeGate: true,
    ownsTupleBinding: true,
    ownsTransmissionPacket: true,

    ownsCanvasDrawing: false,
    owns3dAuthorityTruth: false,
    ownsFingerSurfaceTruth: false,
    ownsControls: false,
    ownsRouteOrchestration: false,
    ownsFinalVisualPass: false,

    ...NO_CLAIMS
  };

  function nowIso() {
    try { return new Date().toISOString(); }
    catch (_error) { return String(Date.now()); }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clone(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_error) { return Array.isArray(value) ? value.slice() : { ...value }; }
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function readPath(path) {
    const parts = String(path || "").split(".");
    let cursor = root;
    for (const part of parts) {
      if (!part) continue;
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }
    return cursor || null;
  }

  function setPath(path, value) {
    const parts = String(path || "").split(".").filter(Boolean);
    let cursor = root;
    for (let i = 0; i < parts.length - 1; i += 1) {
      if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") cursor[parts[i]] = {};
      cursor = cursor[parts[i]];
    }
    cursor[parts[parts.length - 1]] = value;
  }

  function getContract(authority) {
    if (!authority) return "UNKNOWN";
    return safeString(authority.contract || authority.CONTRACT || "UNKNOWN", "UNKNOWN");
  }

  function readAuthority() {
    const authority =
      readPath(AUTHORITY_ALIAS) ||
      readPath("HEARTH.hexFourPair3dAuthority") ||
      readPath("DEXTER_LAB.hearthHexFourPair3dAuthority");

    state.authorityObserved = Boolean(authority);
    state.authorityContract = getContract(authority);
    state.authorityRecognized = state.authorityContract === "HEARTH_HEX_FOUR_PAIR_3D_AUTHORITY_TNT_v2";

    return authority;
  }

  function readFingerSurface() {
    const finger =
      readPath(FINGER_ALIAS) ||
      readPath("HEARTH.canvasFingerSurface3dChapel2") ||
      readPath("DEXTER_LAB.hearthCanvasFingerSurface3dChapel2");

    state.fingerSurfaceObserved = Boolean(finger);
    state.fingerSurfaceContract = getContract(finger);
    state.fingerSurfaceReceiver = resolveFingerReceiver(finger);

    return finger;
  }

  function resolveFingerReceiver(finger) {
    if (!finger) return "NONE";
    const methods = [
      "receiveHexSurface3dTransmissionPacket",
      "receiveChapelBridgePacket",
      "receiveFingerSurfacePacket",
      "receive"
    ];
    for (const method of methods) {
      if (isFunction(finger[method])) return method;
    }
    return "NONE";
  }

  function hasForbiddenClaim(packet) {
    if (!isObject(packet)) return false;
    return Boolean(
      packet.generatedImage === true ||
      packet.graphicBox === true ||
      packet.webGL === true ||
      packet.webgl === true ||
      packet.visualPassClaimed === true ||
      packet.finalVisualPassClaimed === true ||
      packet.f13Claimed === true ||
      packet.f21Claimed === true
    );
  }

  function validatePacket(packet, options = {}) {
    if (!isObject(packet)) return { accepted: false, reason: "PACKET_NOT_OBJECT" };
    if (hasForbiddenClaim(packet)) return { accepted: false, reason: "FORBIDDEN_FINAL_OR_RENDER_CLAIM" };

    if (options.allowDirect === true) return { accepted: true, reason: "DIRECT_PACKET_ACCEPTED" };

    const sourceFile = safeString(packet.sourceFile || packet.fromFile || "");
    const packetType = safeString(packet.packetType || packet.type || "");
    const targetFile = safeString(packet.destinationFile || packet.targetFile || packet.hexSurfaceFile || "");
    const handoffTo = safeString(packet.handoffTo || packet.target || "");

    const fromCanvasOrControls =
      sourceFile === CANVAS_FILE ||
      sourceFile.endsWith("/assets/hearth/hearth.canvas.js") ||
      sourceFile.endsWith("/assets/hearth/hearth.controls.js") ||
      /CANVAS|CONTROL|VIEW/i.test(packetType) ||
      /CANVAS|CONTROL/i.test(safeString(packet.sourceAuthority || packet.sourceRole || ""));

    const targetsBridge =
      targetFile === FILE ||
      targetFile.endsWith("/assets/hearth/hearth.hex.surface.js") ||
      /HEX|SURFACE|BRIDGE|CHAPEL/i.test(packetType) ||
      /HEX|SURFACE|BRIDGE|CHAPEL/i.test(handoffTo) ||
      packet.hexSurfaceGateAuthorized === true ||
      packet.chapelBridgeAuthorized === true;

    if (!fromCanvasOrControls) return { accepted: false, reason: "PACKET_SOURCE_NOT_CHAPEL_1_OR_CONTROLS" };
    if (!targetsBridge) return { accepted: false, reason: "PACKET_DOES_NOT_TARGET_HEX_SURFACE_BRIDGE" };

    return { accepted: true, reason: "PACKET_ACCEPTED_BY_3D_CHAPEL_BRIDGE" };
  }

  function extractCoordinate(packet = {}) {
    const candidates = [
      packet.canonicalMapTuple,
      packet.mapTuple,
      packet.coord,
      packet.coordinate,
      packet.surfaceCoordinate,
      packet.surfacePoint,
      packet.viewCenter,
      packet
    ];

    for (const c of candidates) {
      if (!isObject(c)) continue;

      if (Number.isFinite(Number(c.x)) && Number.isFinite(Number(c.y)) && Number.isFinite(Number(c.z))) {
        return { x: c.x, y: c.y, z: c.z };
      }

      if (Number.isFinite(Number(c.lon)) && Number.isFinite(Number(c.lat))) {
        return { lon: c.lon, lat: c.lat };
      }

      if (Number.isFinite(Number(c.u)) && Number.isFinite(Number(c.v))) {
        return { u: c.u, v: c.v };
      }
    }

    const view = isObject(packet.viewState) ? packet.viewState : packet;
    return {
      lon: safeNumber(view.yaw, 0) * 180 / Math.PI,
      lat: safeNumber(view.pitch, 0) * 180 / Math.PI
    };
  }

  function bindTuple(packet = {}) {
    const authority = readAuthority();
    const coord = extractCoordinate(packet);

    if (!authority || !isFunction(authority.sample)) {
      return {
        ok: false,
        reason: "3D_AUTHORITY_SAMPLE_UNAVAILABLE",
        tuple: fallbackTuple(coord)
      };
    }

    try {
      const tuple = authority.sample(coord);
      state.tupleBoundCount += 1;
      state.lastCanonicalTuple = clone(tuple);
      return { ok: true, reason: "3D_AUTHORITY_TUPLE_BOUND", tuple };
    } catch (error) {
      return {
        ok: false,
        reason: "3D_AUTHORITY_SAMPLE_THROWN",
        error: error && error.message ? String(error.message) : String(error),
        tuple: fallbackTuple(coord)
      };
    }
  }

  function fallbackTuple(coord = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      authority: "HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE_FALLBACK_TUPLE",
      fallbackTuple: true,
      fallbackReason: "AUTHORITY_UNAVAILABLE_OR_THROWN",
      coord: clone(coord),
      cellId: "UNKNOWN",
      stateId: "UNKNOWN",
      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,
      ...NO_CLAIMS
    };
  }

  function composeTransmissionPacket(packet = {}, tupleResult = {}) {
    const tuple = tupleResult.tuple || fallbackTuple();

    return {
      packetType: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE",
      sourceRole: "bridge-between-chapel-1-and-chapel-2",
      destinationFile: FINGER_SURFACE_FILE,
      handoffTo: "HEARTH_CANVAS_FINGER_SURFACE_3D_CHAPEL_2",

      route: ROUTE,
      canvasFile: CANVAS_FILE,
      authorityFile: AUTHORITY_FILE,
      fingerSurfaceFile: FINGER_SURFACE_FILE,

      chapel1Accepted: true,
      chapel2TransmissionAuthorized: true,
      clean3dBridge: true,
      legacyAliases: false,
      twoDCompatibilityLayer: false,

      authorityObserved: state.authorityObserved,
      authorityContract: state.authorityContract,
      authorityRecognized: state.authorityRecognized,

      tupleBound: tupleResult.ok === true,
      tupleBindingReason: tupleResult.reason,
      canonicalMapTuple: clone(tuple),
      mapTuple: clone(tuple),
      coord: {
        x: tuple.x,
        y: tuple.y,
        z: tuple.z,
        u: tuple.u,
        v: tuple.v,
        lon: tuple.lon,
        lat: tuple.lat
      },

      cellId: tuple.cellId,
      hexId: tuple.hexId,
      band: tuple.band,
      sector: tuple.sector,
      stateId: tuple.stateId,
      stateClass: tuple.stateClass,

      fourPair: clone(tuple.fourPair),
      fourPairSet: clone(tuple.fourPairSet),
      north: clone(tuple.north),
      south: clone(tuple.south),
      east: clone(tuple.east),
      west: clone(tuple.west),
      northSouthPair: clone(tuple.northSouthPair),
      eastWestPair: clone(tuple.eastWestPair),

      bodyBound: true,
      surfaceBound: true,
      floatsAboveBody: false,
      allowedToFloat: false,

      originalPacket: clone(packet),
      composedAt: nowIso(),

      ownsCanvasDrawing: false,
      owns3dAuthorityTruth: false,
      ownsFingerSurfaceTruth: false,

      ...NO_CLAIMS
    };
  }

  function deliverToFingerSurface(transmission) {
    const finger = readFingerSurface();
    const method = state.fingerSurfaceReceiver;

    if (!finger || method === "NONE" || !isFunction(finger[method])) {
      const result = {
        delivered: false,
        method: "NONE",
        status: "FINGER_SURFACE_NOT_READY",
        recommendedNextFile: FINGER_SURFACE_FILE
      };
      state.lastDeliveryResult = result;
      return result;
    }

    try {
      const response = finger[method](clone(transmission));
      state.deliveryCount += 1;

      const result = {
        delivered: true,
        method,
        status: "DELIVERED_TO_CHAPEL_2_FINGER_SURFACE",
        responseObserved: isObject(response)
      };

      state.lastDeliveryResult = result;
      return result;
    } catch (error) {
      const result = {
        delivered: false,
        method,
        status: "FINGER_SURFACE_RECEIVER_THROWN",
        error: error && error.message ? String(error.message) : String(error)
      };

      state.lastDeliveryResult = result;
      return result;
    }
  }

  function acceptPacket(packet = {}, options = {}) {
    state.receivedPacketCount += 1;
    state.updatedAt = nowIso();

    const validation = validatePacket(packet, options);

    if (!validation.accepted) {
      state.rejectedPacketCount += 1;
      state.lastValidationStatus = "REJECTED";
      state.lastRejectionReason = validation.reason;
      state.firstFailedCoordinate = validation.reason;
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "SEND_LAWFUL_CHAPEL_1_PACKET_TO_HEX_SURFACE_BRIDGE";
      state.postgameStatus = "HEX_SURFACE_BRIDGE_REJECTED_PACKET";
      publishGlobals();
      return getReceiptLight();
    }

    state.acceptedPacketCount += 1;
    state.lastValidationStatus = "ACCEPTED";
    state.lastRejectionReason = "";

    const tupleResult = bindTuple(packet);
    const transmission = composeTransmissionPacket(packet, tupleResult);
    const delivery = deliverToFingerSurface(transmission);

    state.transmissionCount += 1;
    state.lastTransmissionPacket = clone(transmission);

    state.firstFailedCoordinate = delivery.delivered ? "NONE" : "CHAPEL_2_FINGER_SURFACE_WAITING";
    state.recommendedNextFile = delivery.delivered ? FINGER_SURFACE_FILE : FINGER_SURFACE_FILE;
    state.recommendedNextAction = delivery.delivered
      ? "AUDIT_CHAPEL_2_FINGER_SURFACE_CONSUMPTION"
      : "PUBLISH_CHAPEL_2_FINGER_SURFACE_RECEIVER";
    state.postgameStatus = delivery.delivered
      ? "HEX_SURFACE_BRIDGE_DELIVERED_3D_TUPLE_TO_CHAPEL_2"
      : "HEX_SURFACE_BRIDGE_PUBLISHED_TRANSMISSION_WAITING_CHAPEL_2";

    publishTransmissionGlobals(transmission);
    publishGlobals();

    return {
      ...getReceiptLight(),
      accepted: true,
      validationReason: validation.reason,
      canonicalMapTuple: clone(tupleResult.tuple),
      transmissionPacket: clone(transmission),
      delivery: clone(delivery),
      ...NO_CLAIMS
    };
  }

  function receiveCanvasHexGatePacket(packet, options = {}) {
    return acceptPacket(packet, { ...options, receiver: "receiveCanvasHexGatePacket" });
  }

  function consumeCanvasHexGatePacket(packet, options = {}) {
    return acceptPacket(packet, { ...options, receiver: "consumeCanvasHexGatePacket" });
  }

  function acceptCanvasHexGatePacket(packet, options = {}) {
    return acceptPacket(packet, { ...options, receiver: "acceptCanvasHexGatePacket" });
  }

  function receiveCanvasViewPacket(packet, options = {}) {
    return acceptPacket(packet, { ...options, receiver: "receiveCanvasViewPacket" });
  }

  function receiveChapel1Packet(packet, options = {}) {
    return acceptPacket(packet, { ...options, receiver: "receiveChapel1Packet" });
  }

  function receive(packet, options = {}) {
    return acceptPacket(packet, { ...options, allowDirect: options.allowDirect === true });
  }

  function publishTransmissionGlobals(packet) {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE_LAST_PACKET = clone(packet);
    root.HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE_TRANSMISSION_PACKET = clone(packet);

    root.HEARTH.hexSurface3dChapelBridgeLastPacket = clone(packet);
    root.HEARTH.hexSurface3dChapelBridgeTransmissionPacket = clone(packet);

    root.DEXTER_LAB.hearthHexSurface3dChapelBridgeLastPacket = clone(packet);
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;

    const data = doc.documentElement.dataset;

    data.hearthHexSurface3dChapelBridgeLoaded = "true";
    data.hearthHexSurface3dChapelBridgeContract = CONTRACT;
    data.hearthHexSurface3dChapelBridgeReceipt = RECEIPT;
    data.hearthHexSurface3dChapelBridgeVersion = VERSION;
    data.hearthHexSurface3dChapelBridgeFile = FILE;

    data.hearthHexSurface3dCleanBridge = "true";
    data.hearthHexSurface3dLegacyAliases = "false";
    data.hearthHexSurface3dTwoDCompatibilityLayer = "false";

    data.hearthHexSurface3dAuthorityObserved = String(state.authorityObserved);
    data.hearthHexSurface3dAuthorityContract = state.authorityContract;
    data.hearthHexSurface3dAuthorityRecognized = String(state.authorityRecognized);

    data.hearthHexSurface3dFingerSurfaceObserved = String(state.fingerSurfaceObserved);
    data.hearthHexSurface3dFingerSurfaceContract = state.fingerSurfaceContract;
    data.hearthHexSurface3dFingerSurfaceReceiver = state.fingerSurfaceReceiver;

    data.hearthHexSurface3dReceivedPacketCount = String(state.receivedPacketCount);
    data.hearthHexSurface3dAcceptedPacketCount = String(state.acceptedPacketCount);
    data.hearthHexSurface3dRejectedPacketCount = String(state.rejectedPacketCount);
    data.hearthHexSurface3dTupleBoundCount = String(state.tupleBoundCount);
    data.hearthHexSurface3dTransmissionCount = String(state.transmissionCount);
    data.hearthHexSurface3dDeliveryCount = String(state.deliveryCount);

    data.hearthHexSurface3dFirstFailedCoordinate = state.firstFailedCoordinate;
    data.hearthHexSurface3dRecommendedNextFile = state.recommendedNextFile;
    data.hearthHexSurface3dRecommendedNextAction = state.recommendedNextAction;
    data.hearthHexSurface3dPostgameStatus = state.postgameStatus;

    data.generatedImage = "false";
    data.graphicBox = "false";
    data.webgl = "false";
    data.visualPassClaimed = "false";

    return true;
  }

  function getReceiptLight() {
    readAuthority();
    readFingerSurface();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,

      bridgeLoaded: true,
      clean3dBridge: true,
      chapelBridge: true,
      legacyAliases: false,
      twoDCompatibilityLayer: false,

      canvasFile: CANVAS_FILE,
      authorityFile: AUTHORITY_FILE,
      fingerSurfaceFile: FINGER_SURFACE_FILE,

      authorityObserved: state.authorityObserved,
      authorityContract: state.authorityContract,
      authorityRecognized: state.authorityRecognized,

      fingerSurfaceObserved: state.fingerSurfaceObserved,
      fingerSurfaceContract: state.fingerSurfaceContract,
      fingerSurfaceReceiver: state.fingerSurfaceReceiver,

      receivedPacketCount: state.receivedPacketCount,
      acceptedPacketCount: state.acceptedPacketCount,
      rejectedPacketCount: state.rejectedPacketCount,
      tupleBoundCount: state.tupleBoundCount,
      transmissionCount: state.transmissionCount,
      deliveryCount: state.deliveryCount,

      lastValidationStatus: state.lastValidationStatus,
      lastRejectionReason: state.lastRejectionReason,
      lastCanonicalTuple: clone(state.lastCanonicalTuple),
      lastDeliveryResult: clone(state.lastDeliveryResult),

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      ownsBridgeGate: true,
      ownsTupleBinding: true,
      ownsTransmissionPacket: true,

      ownsCanvasDrawing: false,
      owns3dAuthorityTruth: false,
      ownsFingerSurfaceTruth: false,
      ownsControls: false,
      ownsRouteOrchestration: false,
      ownsFinalVisualPass: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      lastTransmissionPacket: clone(state.lastTransmissionPacket),
      purpose: [
        "Receive lawful Chapel 1 canvas/control packets.",
        "Bind packet coordinate to clean 3D Hex Four-Pair Authority.",
        "Compose Chapel Bridge transmission packet.",
        "Deliver canonical 3D tuple to Chapel 2 Finger Surface."
      ],
      exposedMethods: [
        "receiveCanvasHexGatePacket",
        "consumeCanvasHexGatePacket",
        "acceptCanvasHexGatePacket",
        "receiveCanvasViewPacket",
        "receiveChapel1Packet",
        "receive",
        "getReceipt",
        "getReceiptLight",
        "getReceiptText"
      ]
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      "",
      `clean3dBridge=${r.clean3dBridge}`,
      `chapelBridge=${r.chapelBridge}`,
      `legacyAliases=${r.legacyAliases}`,
      `twoDCompatibilityLayer=${r.twoDCompatibilityLayer}`,
      "",
      `authorityObserved=${r.authorityObserved}`,
      `authorityContract=${r.authorityContract}`,
      `authorityRecognized=${r.authorityRecognized}`,
      "",
      `fingerSurfaceObserved=${r.fingerSurfaceObserved}`,
      `fingerSurfaceContract=${r.fingerSurfaceContract}`,
      `fingerSurfaceReceiver=${r.fingerSurfaceReceiver}`,
      "",
      `receivedPacketCount=${r.receivedPacketCount}`,
      `acceptedPacketCount=${r.acceptedPacketCount}`,
      `rejectedPacketCount=${r.rejectedPacketCount}`,
      `tupleBoundCount=${r.tupleBoundCount}`,
      `transmissionCount=${r.transmissionCount}`,
      `deliveryCount=${r.deliveryCount}`,
      "",
      `lastValidationStatus=${r.lastValidationStatus}`,
      `lastRejectionReason=${r.lastRejectionReason}`,
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextAction=${r.recommendedNextAction}`,
      `postgameStatus=${r.postgameStatus}`,
      "",
      `ownsCanvasDrawing=${r.ownsCanvasDrawing}`,
      `owns3dAuthorityTruth=${r.owns3dAuthorityTruth}`,
      `ownsFingerSurfaceTruth=${r.ownsFingerSurfaceTruth}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE = api;
    root.HEARTH_HEX_SURFACE_3D_CHAPEL_BRIDGE_RECEIPT = getReceiptLight();

    setPath("HEARTH.hexSurface3dChapelBridge", api);
    setPath("DEXTER_LAB.hearthHexSurface3dChapelBridge", api);

    updateDataset();
    return api;
  }

  function boot() {
    readAuthority();
    readFingerSurface();
    state.updatedAt = nowIso();
    publishGlobals();
    return getReceipt();
  }

  const api = {
    CONTRACT,
    RECEIPT,
    FILE,
    ROUTE,
    VERSION,

    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "Hex Surface 3D Chapel Bridge",

    boot,
    init: boot,
    start: boot,
    run: boot,

    receiveCanvasHexGatePacket,
    consumeCanvasHexGatePacket,
    acceptCanvasHexGatePacket,
    receiveCanvasViewPacket,
    receiveChapel1Packet,
    receive,

    validatePacket,
    bindTuple,
    composeTransmissionPacket,
    deliverToFingerSurface,

    getReceipt,
    getReceiptLight,
    getReceiptText,
    publishGlobals,
    updateDataset,

    clean3dBridge: true,
    chapelBridge: true,
    legacyAliases: false,
    twoDCompatibilityLayer: false,

    ownsBridgeGate: true,
    ownsTupleBinding: true,
    ownsTransmissionPacket: true,

    ownsCanvasDrawing: false,
    owns3dAuthorityTruth: false,
    ownsFingerSurfaceTruth: false,
    ownsControls: false,
    ownsRouteOrchestration: false,
    ownsFinalVisualPass: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  };

  try {
    boot();
  } catch (error) {
    state.lastRejectionReason = error && error.message ? String(error.message) : String(error);
    state.firstFailedCoordinate = "HEX_SURFACE_BRIDGE_BOOT_ERROR";
    state.postgameStatus = "HEX_SURFACE_BRIDGE_BOOT_ERROR";
    updateDataset();
    publishGlobals();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
