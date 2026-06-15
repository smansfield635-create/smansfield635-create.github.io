// /assets/audralia/audralia.diagnostic.east.js
// AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION_INTERPRETATION_F5_3D_TNT_v2
// Full-file replacement.
// Diagnostic-only. Read-only.
// No production mutation. No renderer authority. No runtime restart authority.
// No repair authority. No readiness authority. No visual pass authority. No F21 authority.

(function registerAudraliaDiagnosticEast(global) {
  'use strict';

  const CONTRACT =
    'AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION_INTERPRETATION_F5_3D_TNT_v2';

  const PREVIOUS_CONTRACT =
    'AUDRALIA_DIAGNOSTIC_EAST_CONSTRUCTION_INTERPRETATION_F5_3D_TNT_v1';

  const VERSION = '2.0.0';
  const FILE = '/assets/audralia/audralia.diagnostic.east.js';

  const STATION_ID = 'EAST_CONSTRUCTION_INTERPRETATION';
  const CYCLE_POSITION = 3;
  const FIBONACCI = 'F5';

  const RECEIPT_SCHEMA = 'AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1';
  const API_SCHEMA = 'AUDRALIA_DIAGNOSTIC_STATION_API_v1';
  const REGISTRATION_RECEIPT_SCHEMA =
    'AUDRALIA_DIAGNOSTIC_STATION_REGISTRATION_RECEIPT_v1';

  const REQUIRED_PREDECESSOR = 'EAST_PROBE_SOURCE';

  const NO_CLAIMS = Object.freeze({
    engineAuthority: false,
    productionMutationAuthority: false,
    contractRewriteAuthority: false,
    routeMutationAuthority: false,
    rendererAuthority: false,
    canvasAuthority: false,
    webGLAuthority: false,
    webGPUAuthority: false,
    runtimeAuthority: false,
    repairAuthorizationAuthority: false,
    fileAuthorizationAuthority: false,
    finalProductionVerdictAuthority: false,
    constructionInterpretationProvesRuntime: false,
    sourceDeclarationProvesRuntime: false,
    diagnosticPassProvesReadiness: false,
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
    } catch (_) {
      return null;
    }
  }

  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_) {
      return null;
    }
  }

  function stableStringify(value) {
    if (value === null) return 'null';
    if (typeof value === 'string') return JSON.stringify(value);
    if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'null';
    if (typeof value === 'boolean') return value ? 'true' : 'false';

    if (Array.isArray(value)) {
      return '[' + value.map(stableStringify).join(',') + ']';
    }

    if (isObject(value)) {
      return '{' + Object.keys(value).sort().map(function encode(key) {
        return JSON.stringify(key) + ':' + stableStringify(value[key]);
      }).join(',') + '}';
    }

    return 'null';
  }

  function hash(value) {
    const text = stableStringify(value);
    let h = 0x811c9dc5;

    for (let i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
      h >>>= 0;
    }

    return 'fnv1a32:' + ('00000000' + h.toString(16)).slice(-8);
  }

  function issue(code, path, detail) {
    return {
      code: String(code || 'ISSUE'),
      path: String(path || '$'),
      detail: String(detail || code || 'ISSUE')
    };
  }

  function observation(id, kind, payload) {
    return Object.assign({ id, kind }, payload || {});
  }

  function firstString() {
    for (let i = 0; i < arguments.length; i += 1) {
      if (typeof arguments[i] === 'string' && arguments[i].length) {
        return arguments[i];
      }
    }
    return null;
  }

  function normalizeStatus(value) {
    return typeof value === 'string' && value.length
      ? value.toUpperCase()
      : 'UNKNOWN';
  }

  function collectPriorReceipts(packet) {
    const candidates = [
      packet.priorStationReceipts,
      packet.stationReceipts,
      packet.receipts,
      packet.conductorReceipt && packet.conductorReceipt.stationReceipts,
      packet.conductorReceipt && packet.conductorReceipt.receipts,
      packet.cycleReceipt && packet.cycleReceipt.stationReceipts,
      packet.cycleReceipt && packet.cycleReceipt.receipts,
      packet.ledger && packet.ledger.receipts
    ];

    for (let i = 0; i < candidates.length; i += 1) {
      if (Array.isArray(candidates[i])) {
        return candidates[i];
      }
    }

    return [];
  }

  function findReceipt(receipts, stationId) {
    return receipts.find(function match(receipt) {
      return receipt && receipt.stationId === stationId;
    }) || null;
  }

  function getPacketEngine(packet) {
    return (
      packet.engine ||
      packet.construct?.engine ||
      packet.engineRegistry?.selectedEngine ||
      {}
    );
  }

  function getPacketConstruct(packet) {
    return packet.construct || {};
  }

  function getPacketSubject(packet) {
    return packet.subject || packet.construct?.subject || {};
  }

  function getPacketTarget(packet) {
    return packet.target || packet.construct?.target || {};
  }

  function extractEastEvidence(eastReceipt) {
    const observations = Array.isArray(eastReceipt?.observations)
      ? eastReceipt.observations
      : [];

    const sourceDeclaration = observations.find(function find(entry) {
      return entry && entry.id === 'EAST_SOURCE_SUBJECT_DECLARATION';
    }) || null;

    const engineDeclaration = observations.find(function find(entry) {
      return entry && entry.id === 'EAST_SOURCE_ENGINE_DECLARATION';
    }) || null;

    const constructDeclaration = observations.find(function find(entry) {
      return entry && entry.id === 'EAST_SOURCE_CONSTRUCT_DECLARATION';
    }) || null;

    const fileManifest = observations.find(function find(entry) {
      return entry && entry.id === 'EAST_SOURCE_DECLARED_FILES';
    }) || null;

    return {
      sourceDeclaration,
      engineDeclaration,
      constructDeclaration,
      fileManifest
    };
  }

  function createReceipt(status, completed, handoffEligible, summary, packet, observations, evidence, issues, owner) {
    const receipt = {
      schema: RECEIPT_SCHEMA,
      cycleId: packet.cycleId || null,
      position: CYCLE_POSITION,
      stationId: STATION_ID,
      fibonacci: FIBONACCI,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      status,
      completed,
      handoffEligible,
      summary,
      observations: observations || [],
      evidence: evidence || [],
      issues: issues || [],
      firstHeldCoordinate: status === 'HOLD' ? 'F5:EAST_CONSTRUCTION_INTERPRETATION' : null,
      firstFailedCoordinate: status === 'FAIL' ? 'F5:EAST_CONSTRUCTION_INTERPRETATION' : null,
      firstConflictCoordinate: status === 'CONFLICT' ? 'F5:EAST_CONSTRUCTION_INTERPRETATION' : null,
      recommendedOwner: owner || {
        ownerType: 'DIAGNOSTIC_STATION',
        subjectId: STATION_ID,
        contract: CONTRACT,
        file: FILE,
        component: 'EAST_CONSTRUCTION_INTERPRETATION'
      },
      generatedAt: nowISO(),
      noClaims: clone(NO_CLAIMS),
      receiptHash: null
    };

    receipt.receiptHash = hash(receipt);
    return receipt;
  }

  function executeCycleStation(packet) {
    packet = packet || {};

    const priorReceipts = collectPriorReceipts(packet);
    const eastReceipt = findReceipt(priorReceipts, REQUIRED_PREDECESSOR);

    const subject = getPacketSubject(packet);
    const engine = getPacketEngine(packet);
    const construct = getPacketConstruct(packet);
    const target = getPacketTarget(packet);

    const eastEvidence = extractEastEvidence(eastReceipt);

    const predecessorStatus = normalizeStatus(eastReceipt && eastReceipt.status);
    const predecessorPassed = predecessorStatus === 'PASS';

    const observations = [
      observation('EAST_INTERPRETATION_PREDECESSOR_RECEIPT', 'OBSERVED', {
        requiredStationId: REQUIRED_PREDECESSOR,
        observed: Boolean(eastReceipt),
        status: predecessorStatus,
        completed: eastReceipt ? eastReceipt.completed === true : false,
        handoffEligible: eastReceipt ? eastReceipt.handoffEligible === true : false,
        receiptHash: eastReceipt ? eastReceipt.receiptHash || null : null
      }),

      observation('EAST_INTERPRETATION_SOURCE_EVIDENCE', 'DERIVED', {
        sourceDeclarationObserved: Boolean(eastEvidence.sourceDeclaration),
        engineDeclarationObserved: Boolean(eastEvidence.engineDeclaration),
        constructDeclarationObserved: Boolean(eastEvidence.constructDeclaration),
        fileManifestObserved: Boolean(eastEvidence.fileManifest),
        sourceFile:
          firstString(
            eastEvidence.sourceDeclaration && eastEvidence.sourceDeclaration.file,
            subject.file,
            null
          ),
        engineFile:
          firstString(
            eastEvidence.engineDeclaration && eastEvidence.engineDeclaration.file,
            engine.file,
            null
          ),
        constructRootFile:
          firstString(
            eastEvidence.constructDeclaration && eastEvidence.constructDeclaration.rootFile,
            construct.rootFile,
            construct.file,
            null
          ),
        constructRoute:
          firstString(
            eastEvidence.constructDeclaration && eastEvidence.constructDeclaration.route,
            construct.route,
            packet.diagnosticRoute,
            null
          )
      }),

      observation('EAST_INTERPRETATION_PACKET_CONSTRUCT', 'DECLARED', {
        constructId:
          firstString(
            construct.constructId,
            construct.id,
            'AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D'
          ),
        contract:
          firstString(
            construct.contract,
            packet.htmlContract,
            null
          ),
        controllerContract:
          firstString(
            construct.controllerContract,
            packet.contract,
            null
          ),
        rootFile:
          firstString(
            construct.rootFile,
            construct.file,
            null
          ),
        route:
          firstString(
            construct.route,
            packet.diagnosticRoute,
            null
          ),
        targetRoute:
          firstString(
            construct.targetRoute,
            packet.targetRoute,
            target.targetRoute,
            null
          )
      }),

      observation('EAST_INTERPRETATION_BOUNDARY', 'DECLARED', {
        diagnosticOnly: true,
        readOnly: true,
        productionMutationAuthorized: false,
        runtimeRestartAuthorized: false,
        rendererMutationAuthorized: false,
        repairAuthorized: false,
        readinessClaimed: false,
        visualPassClaimed: false,
        f21Claimed: false
      })
    ];

    const evidence = [
      {
        id: 'EAST_INTERPRETATION_REQUEST_HASH',
        kind: 'DERIVED',
        hash: hash(packet)
      },
      {
        id: 'EAST_INTERPRETATION_PREDECESSOR_HASH',
        kind: 'DERIVED',
        hash: hash(eastReceipt || null)
      },
      {
        id: 'EAST_INTERPRETATION_CONSTRUCTION_HASH',
        kind: 'DERIVED',
        hash: hash({
          subject,
          engine,
          construct,
          target,
          eastEvidence
        })
      }
    ];

    const issues = [];

    if (!eastReceipt) {
      issues.push(
        issue(
          'EAST_SOURCE_RECEIPT_REQUIRED',
          '$.priorStationReceipts.EAST_PROBE_SOURCE',
          'East Construction Interpretation requires a prior East Source receipt.'
        )
      );
    } else if (!predecessorPassed) {
      issues.push(
        issue(
          'EAST_SOURCE_RECEIPT_NOT_PASS',
          '$.priorStationReceipts.EAST_PROBE_SOURCE.status',
          'East Source must pass before East Construction Interpretation can hand off.'
        )
      );
    }

    if (!eastEvidence.sourceDeclaration) {
      issues.push(
        issue(
          'EAST_SOURCE_SUBJECT_DECLARATION_REQUIRED',
          '$.priorStationReceipts.EAST_PROBE_SOURCE.observations',
          'East Source subject declaration was not available to interpret.'
        )
      );
    }

    if (!eastEvidence.engineDeclaration) {
      issues.push(
        issue(
          'EAST_SOURCE_ENGINE_DECLARATION_REQUIRED',
          '$.priorStationReceipts.EAST_PROBE_SOURCE.observations',
          'East Source engine declaration was not available to interpret.'
        )
      );
    }

    if (!eastEvidence.constructDeclaration) {
      issues.push(
        issue(
          'EAST_SOURCE_CONSTRUCT_DECLARATION_REQUIRED',
          '$.priorStationReceipts.EAST_PROBE_SOURCE.observations',
          'East Source construct declaration was not available to interpret.'
        )
      );
    }

    evidence.push({
      id: 'EAST_INTERPRETATION_VALIDATION',
      kind: 'DERIVED',
      passed: issues.length === 0,
      issueCount: issues.length
    });

    const owner = {
      ownerType: 'DIAGNOSTIC_STATION',
      subjectId: STATION_ID,
      contract: CONTRACT,
      file: FILE,
      component: 'EAST_CONSTRUCTION_INTERPRETATION'
    };

    if (issues.length) {
      return createReceipt(
        'HOLD',
        false,
        false,
        'EAST_CONSTRUCTION_INTERPRETATION_HELD_PREDECESSOR_OR_SOURCE_EVIDENCE_INCOMPLETE',
        packet,
        observations,
        evidence,
        issues,
        owner
      );
    }

    return createReceipt(
      'PASS',
      true,
      true,
      'EAST_CONSTRUCTION_INTERPRETATION_ADMITTED',
      packet,
      observations,
      evidence,
      [],
      owner
    );
  }

  function getDefinitionReceipt() {
    return {
      schema: REGISTRATION_RECEIPT_SCHEMA,
      stationId: STATION_ID,
      cyclePosition: CYCLE_POSITION,
      fibonacci: FIBONACCI,
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      globalPath: 'AUDRALIA_DIAGNOSTIC_EAST',
      status: 'AVAILABLE',
      requiresPredecessor: REQUIRED_PREDECESSOR,
      noClaims: clone(NO_CLAIMS),
      generatedAt: nowISO()
    };
  }

  const API = {
    schema: API_SCHEMA,

    STATION_ID,
    CYCLE_POSITION,
    FIBONACCI,
    CONTRACT,
    PREVIOUS_CONTRACT,
    VERSION,
    FILE,

    stationId: STATION_ID,
    cyclePosition: CYCLE_POSITION,
    fibonacci: FIBONACCI,
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    file: FILE,

    role: 'EAST_CONSTRUCTION_INTERPRETATION',
    requiresPredecessor: REQUIRED_PREDECESSOR,

    executeCycleStation,
    execute: executeCycleStation,
    getDefinitionReceipt
  };

  global.AUDRALIA_DIAGNOSTIC_EAST = API;

  global.AUDRALIA_DIAGNOSTIC_EAST_RECEIPT =
    getDefinitionReceipt();

})(window);
