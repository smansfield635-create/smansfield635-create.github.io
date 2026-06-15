// /assets/audralia/audralia.diagnostic.probe.east.js
// AUDRALIA_DIAGNOSTIC_PROBE_EAST_SOURCE_F3_3D_TNT_v2
// Full-file replacement.
// Diagnostic-only.
// Read-only.
// No production mutation.
// No renderer authority.
// No runtime restart authority.
// No repair authority.
// No readiness authority.
// No F21 authority.

(function registerAudraliaDiagnosticProbeEast(global) {
  'use strict';

  const CONTRACT =
    'AUDRALIA_DIAGNOSTIC_PROBE_EAST_SOURCE_F3_3D_TNT_v2';

  const PREVIOUS_CONTRACT =
    'AUDRALIA_DIAGNOSTIC_PROBE_EAST_SOURCE_F3_3D_TNT_v1';

  const VERSION = '2.0.0';

  const FILE =
    '/assets/audralia/audralia.diagnostic.probe.east.js';

  const STATION_ID = 'EAST_PROBE_SOURCE';

  const CYCLE_POSITION = 2;

  const FIBONACCI = 'F3';

  const RECEIPT_SCHEMA =
    'AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1';

  const API_SCHEMA =
    'AUDRALIA_DIAGNOSTIC_STATION_API_v1';

  const REGISTRATION_RECEIPT_SCHEMA =
    'AUDRALIA_DIAGNOSTIC_STATION_REGISTRATION_RECEIPT_v1';

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
    sourcePresenceProvesRuntime: false,
    declarationProvesObservation: false,
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

  const ADMITTED_PATH_CLASSES = Object.freeze([
    'AUDRALIA_ROUTE',
    'AUDRALIA_DIAGNOSTIC_ROUTE',
    'AUDRALIA_ASSET',
    'DGB_ENGINE_ASSET',
    'ENGINE_ASSET'
  ]);

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

    if (typeof value === 'number') {
      return Number.isFinite(value) ? String(value) : 'null';
    }

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
      h +=
        (h << 1) +
        (h << 4) +
        (h << 7) +
        (h << 8) +
        (h << 24);
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
    return Object.assign(
      {
        id,
        kind
      },
      payload || {}
    );
  }

  function normalizePathClass(file) {
    if (!file || typeof file !== 'string') return 'UNKNOWN';

    if (
      file === '/showroom/globe/audralia/diagnostic/' ||
      file.indexOf('/showroom/globe/audralia/diagnostic/') === 0
    ) {
      return 'AUDRALIA_DIAGNOSTIC_ROUTE';
    }

    if (
      file === '/showroom/globe/audralia/' ||
      file.indexOf('/showroom/globe/audralia/') === 0
    ) {
      return 'AUDRALIA_ROUTE';
    }

    if (file.indexOf('/assets/audralia/') === 0) {
      return 'AUDRALIA_ASSET';
    }

    if (file.indexOf('/assets/engine/') === 0) {
      return 'DGB_ENGINE_ASSET';
    }

    if (file.indexOf('/assets/') === 0) {
      return 'ENGINE_ASSET';
    }

    return 'UNKNOWN';
  }

  function pathClassAdmitted(pathClass) {
    return ADMITTED_PATH_CLASSES.indexOf(pathClass) !== -1;
  }

  function firstString() {
    for (let i = 0; i < arguments.length; i += 1) {
      if (typeof arguments[i] === 'string' && arguments[i].length) {
        return arguments[i];
      }
    }

    return null;
  }

  function extractSelectedEngine(packet) {
    return (
      packet.engine ||
      packet.selectedEngine ||
      packet.engineRegistry?.selectedEngine ||
      packet.construct?.engine ||
      packet.subject?.engine ||
      {}
    );
  }

  function extractEngineFile(packet) {
    const engine = extractSelectedEngine(packet);

    return firstString(
      engine.file,
      engine.governingContractFile,
      packet.engine?.file,
      packet.engine?.runtimeReceipt?.file,
      packet.engineRegistry?.selectedEngine?.file,
      packet.engineRegistry?.selectedEngine?.runtimeReceipt?.file,
      packet.engineRegistry?.selectedEngine?.inspection?.runtimeReceipt?.file,
      packet.engineRegistry?.selectedEngine?.inspection?.authority?.file,
      packet.engineRegistry?.authority?.file,
      packet.engineRegistry?.receipt?.file
    );
  }

  function extractEngineContract(packet) {
    const engine = extractSelectedEngine(packet);

    return firstString(
      engine.contract,
      engine.governingContract,
      packet.engine?.contract,
      packet.engine?.runtimeReceipt?.contract,
      packet.engineRegistry?.selectedEngine?.contract,
      packet.engineRegistry?.selectedEngine?.runtimeReceipt?.contract,
      packet.engineRegistry?.authority?.contract,
      packet.engineRegistry?.receipt?.contract
    );
  }

  function extractEngineVersion(packet) {
    const engine = extractSelectedEngine(packet);

    return firstString(
      engine.version,
      packet.engine?.version,
      packet.engine?.runtimeReceipt?.version,
      packet.engineRegistry?.selectedEngine?.version,
      packet.engineRegistry?.selectedEngine?.runtimeReceipt?.version
    );
  }

  function extractSubject(packet) {
    return packet.subject || packet.construct?.subject || {};
  }

  function extractConstruct(packet) {
    return packet.construct || {};
  }

  function extractTarget(packet) {
    return packet.target || packet.construct?.target || {};
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
      firstHeldCoordinate: status === 'HOLD' ? 'F3:EAST_PROBE_SOURCE' : null,
      firstFailedCoordinate: status === 'FAIL' ? 'F3:EAST_PROBE_SOURCE' : null,
      firstConflictCoordinate: status === 'CONFLICT' ? 'F3:EAST_PROBE_SOURCE' : null,
      recommendedOwner: owner || {
        ownerType: 'DECLARED_SOURCE',
        subjectId: 'AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D',
        contract: null,
        file: '/showroom/globe/audralia/diagnostic/index.html',
        component: 'EAST_SOURCE_DECLARATION'
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

    const subject = extractSubject(packet);
    const construct = extractConstruct(packet);
    const target = extractTarget(packet);

    const engineFile = extractEngineFile(packet);
    const engineContract = extractEngineContract(packet);
    const engineVersion = extractEngineVersion(packet);

    const subjectFile = firstString(
      subject.file,
      subject.rootFile,
      packet.subjectFile
    );

    const constructRoute = firstString(
      construct.route,
      target.targetRoute,
      packet.targetRoute,
      '/showroom/globe/audralia/diagnostic/'
    );

    const constructRootFile = firstString(
      construct.rootFile,
      construct.file,
      '/showroom/globe/audralia/diagnostic/index.html'
    );

    const subjectPathClass = normalizePathClass(subjectFile);
    const enginePathClass = normalizePathClass(engineFile);
    const constructRootPathClass = normalizePathClass(constructRootFile);
    const constructRoutePathClass = normalizePathClass(constructRoute);

    const files = [
      {
        id: 'SUBJECT_FILE',
        file: subjectFile,
        pathClass: subjectPathClass,
        admitted: subjectFile ? pathClassAdmitted(subjectPathClass) : null
      },
      {
        id: 'ENGINE_FILE',
        file: engineFile,
        pathClass: enginePathClass,
        admitted: engineFile ? pathClassAdmitted(enginePathClass) : null
      },
      {
        id: 'CONSTRUCT_ROOT_FILE',
        file: constructRootFile,
        pathClass: constructRootPathClass,
        admitted: pathClassAdmitted(constructRootPathClass)
      },
      {
        id: 'CONSTRUCT_ROUTE',
        file: constructRoute,
        pathClass: constructRoutePathClass,
        admitted: pathClassAdmitted(constructRoutePathClass)
      }
    ];

    const dependencies = Array.isArray(construct.dependencies)
      ? construct.dependencies.slice(0, 64)
      : [];

    const observations = [
      observation('EAST_SOURCE_SUBJECT_DECLARATION', 'DECLARED', {
        subjectId:
          firstString(
            subject.subjectId,
            subject.id,
            'AUDRALIA_DIAGNOSTIC_READER_ROUTE'
          ),
        subjectType:
          firstString(
            subject.subjectType,
            subject.type,
            'THREE_D_DIAGNOSTIC_ROUTE'
          ),
        contract: firstString(subject.contract, null),
        version: firstString(subject.version, null),
        file: subjectFile,
        filePathClass: subjectPathClass
      }),

      observation('EAST_SOURCE_ENGINE_DECLARATION', 'DECLARED', {
        contract: engineContract,
        version: engineVersion,
        file: engineFile,
        filePathClass: enginePathClass,
        source:
          engineFile
            ? 'ENGINE_REGISTRY_OR_DECLARED_ENGINE'
            : 'UNAVAILABLE',
        declaredContractFiles:
          engineContract
            ? [engineContract]
            : []
      }),

      observation('EAST_SOURCE_CONSTRUCT_DECLARATION', 'DECLARED', {
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
        version:
          firstString(
            construct.version,
            packet.version,
            null
          ),
        route: constructRoute,
        routePathClass: constructRoutePathClass,
        rootFile: constructRootFile,
        rootFilePathClass: constructRootPathClass
      }),

      observation('EAST_SOURCE_DECLARED_FILES', 'DERIVED', {
        fileCount: files.filter(function countFile(entry) {
          return Boolean(entry.file);
        }).length,
        files
      }),

      observation('EAST_SOURCE_DECLARED_DEPENDENCIES', 'DERIVED', {
        dependencyCount: dependencies.length,
        dependencies
      }),

      observation('EAST_SOURCE_PRIOR_NORTH_RECEIPT', 'EXPOSED_RECEIPT', {
        priorReceiptCount:
          Array.isArray(packet.priorStationReceipts)
            ? packet.priorStationReceipts.length
            : 0,
        northReceiptObserved:
          Array.isArray(packet.priorStationReceipts) &&
          packet.priorStationReceipts.some(function findNorth(receipt) {
            return receipt && receipt.stationId === 'NORTH_PROBE_INTAKE';
          })
      })
    ];

    const evidence = [
      {
        id: 'EAST_SOURCE_REQUEST_HASH',
        kind: 'DERIVED',
        hash: hash(packet)
      },
      {
        id: 'EAST_SOURCE_DECLARED_FILE_MANIFEST_HASH',
        kind: 'DERIVED',
        hash: hash(files)
      },
      {
        id: 'EAST_SOURCE_DECLARED_DEPENDENCY_HASH',
        kind: 'DERIVED',
        hash: hash(dependencies)
      },
      {
        id: 'EAST_SOURCE_VALIDATION',
        kind: 'DERIVED',
        passed: true,
        issueCount: 0
      }
    ];

    const issues = [];

    if (!engineFile) {
      issues.push(
        issue(
          'ENGINE_FILE_EVIDENCE_UNAVAILABLE',
          '$.engine.file',
          'Engine file was not declared and could not be derived from the registry packet.'
        )
      );
    } else if (!pathClassAdmitted(enginePathClass)) {
      issues.push(
        issue(
          'ENGINE_FILE_PATH_CLASS_NOT_ADMITTED',
          '$.engine.file',
          'Engine file path class is not admitted for East source declaration.'
        )
      );
    }

    if (!constructRootFile) {
      issues.push(
        issue(
          'CONSTRUCT_ROOT_FILE_REQUIRED',
          '$.construct.rootFile',
          'Construct root file is required for East source declaration.'
        )
      );
    } else if (!pathClassAdmitted(constructRootPathClass)) {
      issues.push(
        issue(
          'CONSTRUCT_ROOT_FILE_PATH_CLASS_NOT_ADMITTED',
          '$.construct.rootFile',
          'Construct root file must be an admitted Audralia route, diagnostic route, or asset path.'
        )
      );
    }

    if (!constructRoute) {
      issues.push(
        issue(
          'CONSTRUCT_ROUTE_REQUIRED',
          '$.construct.route',
          'Construct route is required for East source declaration.'
        )
      );
    } else if (!pathClassAdmitted(constructRoutePathClass)) {
      issues.push(
        issue(
          'CONSTRUCT_ROUTE_PATH_CLASS_NOT_ADMITTED',
          '$.construct.route',
          'Construct route must be an admitted Audralia route, diagnostic route, or asset path.'
        )
      );
    }

    const owner = {
      ownerType: 'DECLARED_SOURCE',
      subjectId:
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
      file: constructRootFile,
      component: 'EAST_SOURCE_DECLARATION'
    };

    if (issues.length) {
      return createReceipt(
        'HOLD',
        false,
        false,
        'EAST_SOURCE_HELD_DECLARATION_INCOMPLETE',
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
      'EAST_SOURCE_DECLARATION_ADMITTED',
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
      globalPath: 'AUDRALIA_DIAGNOSTIC_PROBE_EAST',
      status: 'AVAILABLE',
      admittedPathClasses: clone(ADMITTED_PATH_CLASSES),
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

    role: 'EAST_PROBE_SOURCE',

    executeCycleStation,
    execute: executeCycleStation,
    getDefinitionReceipt
  };

  global.AUDRALIA_DIAGNOSTIC_PROBE_EAST = API;

  global.AUDRALIA_DIAGNOSTIC_PROBE_EAST_RECEIPT =
    getDefinitionReceipt();

})(window);
