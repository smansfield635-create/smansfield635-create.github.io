// /showroom/globe/audralia/diagnostic/index.js
// AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_CONTROLLER_TNT_v4
// Full-file replacement.
// Diagnostic-only.
// Read-only.
// No production mutation.
// No renderer authority.
// No runtime restart authority.
// No repair authority.
// No readiness authority.
// No visual pass authority.
// No F21 authority.
//
// Purpose:
// - Preserve v3 diagnostic route reader behavior.
// - Keep North Conductor as orchestration owner.
// - Preserve nine-cycle diagnostic route.
// - Normalize the evidence packet before conductor handoff.
// - Provide East Probe Source with explicit subject / engine / construct / target evidence.
// - Prevent null engine.file / subject.file transport when registry evidence exists.
// - Do not synthesize positive runtime readiness evidence.
// - Do not mutate production route.
//
// Fix target:
// - East Probe was loading and executing.
// - East Probe was still receiving incomplete declaration evidence.
// - This renewal strengthens the route controller packet sent into the conductor.
//

(function audraliaDiagnosticRouteReaderController(global) {
  'use strict';

  const CONTRACT =
    'AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_CONTROLLER_TNT_v4';

  const PREVIOUS_CONTRACT =
    'AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_CONTROLLER_TNT_v3';

  const VERSION = '4.0.0';

  const FILE =
    '/showroom/globe/audralia/diagnostic/index.js';

  const HTML_CONTRACT =
    'AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_STATIC_SHELL_TNT_v2';

  const CSS_CONTRACT =
    'AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D_STYLE_TNT_v2';

  const TARGET_ROUTE =
    '/showroom/globe/audralia/';

  const DIAGNOSTIC_ROUTE =
    '/showroom/globe/audralia/diagnostic/';

  const DIAGNOSTIC_ROOT_FILE =
    '/showroom/globe/audralia/diagnostic/index.html';

  const STATION_ORDER = Object.freeze([
    {
      position: 1,
      stationId: 'NORTH_PROBE_INTAKE',
      fibonacci: 'F1',
      file: '/assets/audralia/audralia.diagnostic.probe.north.js',
      globalPath: 'AUDRALIA_DIAGNOSTIC_PROBE_NORTH'
    },
    {
      position: 2,
      stationId: 'EAST_PROBE_SOURCE',
      fibonacci: 'F3',
      file: '/assets/audralia/audralia.diagnostic.probe.east.js',
      globalPath: 'AUDRALIA_DIAGNOSTIC_PROBE_EAST'
    },
    {
      position: 3,
      stationId: 'EAST_CONSTRUCTION_INTERPRETATION',
      fibonacci: 'F5',
      file: '/assets/audralia/audralia.diagnostic.east.js',
      globalPath: 'AUDRALIA_DIAGNOSTIC_EAST'
    },
    {
      position: 4,
      stationId: 'CANVAS_SURFACE_TRUTH',
      fibonacci: 'F8',
      file: '/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js',
      globalPath: 'AUDRALIA_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH'
    },
    {
      position: 5,
      stationId: 'WEST_PROBE_RUNTIME',
      fibonacci: 'F13',
      file: '/assets/audralia/audralia.diagnostic.probe.west.js',
      globalPath: 'AUDRALIA_DIAGNOSTIC_PROBE_WEST'
    },
    {
      position: 6,
      stationId: 'WEST_RUNTIME_INTERPRETATION',
      fibonacci: 'F21',
      file: '/assets/audralia/audralia.diagnostic.west.js',
      globalPath: 'AUDRALIA_DIAGNOSTIC_WEST'
    },
    {
      position: 7,
      stationId: 'SOUTH_PROBE_HANDOFF',
      fibonacci: 'F34',
      file: '/assets/audralia/audralia.diagnostic.probe.south.js',
      globalPath: 'AUDRALIA_DIAGNOSTIC_PROBE_SOUTH'
    },
    {
      position: 8,
      stationId: 'SOUTH_RESTITUTION_INTERPRETATION',
      fibonacci: 'F55',
      file: '/assets/audralia/audralia.diagnostic.south.js',
      globalPath: 'AUDRALIA_DIAGNOSTIC_SOUTH'
    },
    {
      position: 9,
      stationId: 'RAIL_TERMINAL_SYNTHESIS',
      fibonacci: 'F89',
      file: '/assets/audralia/audralia.diagnostic.rail.js',
      globalPath: 'AUDRALIA_DIAGNOSTIC_RAIL'
    }
  ]);

  const NO_CLAIMS = Object.freeze({
    productionMutationAuthorized: false,
    runtimeRestartAuthorized: false,
    rendererMutationAuthorized: false,
    repairAuthorized: false,
    readyClaimed: false,
    verifiedClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    f21Claimed: false
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

    return 'fnv1a32-' + ('00000000' + h.toString(16)).slice(-8);
  }

  function firstString() {
    for (let i = 0; i < arguments.length; i += 1) {
      if (typeof arguments[i] === 'string' && arguments[i].length) {
        return arguments[i];
      }
    }

    return null;
  }

  function getPath(root, path) {
    if (!isObject(root) || !path) return null;

    const parts = String(path).split('.');
    let cursor = root;

    for (let i = 0; i < parts.length; i += 1) {
      if (!isObject(cursor) && !Array.isArray(cursor)) return null;
      cursor = cursor[parts[i]];
      if (cursor === undefined || cursor === null) return null;
    }

    return cursor;
  }

  function normalizePathClass(file) {
    if (!file || typeof file !== 'string') return 'UNKNOWN';

    if (
      file === DIAGNOSTIC_ROUTE ||
      file.indexOf('/showroom/globe/audralia/diagnostic/') === 0
    ) {
      return 'AUDRALIA_DIAGNOSTIC_ROUTE';
    }

    if (
      file === TARGET_ROUTE ||
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

  function readEngineRegistry() {
    const registryApi =
      global.DGB_ENGINE_SUBJECTS ||
      global.DGB_ENGINE_REGISTRY ||
      global.DGB_ENGINE_SUBJECT_REGISTRY ||
      null;

    if (registryApi && typeof registryApi.inspect === 'function') {
      try {
        return registryApi.inspect();
      } catch (_) {}
    }

    if (registryApi && typeof registryApi.getReceipt === 'function') {
      try {
        return {
          registryLoaded: true,
          receipt: registryApi.getReceipt()
        };
      } catch (_) {}
    }

    if (registryApi && isObject(registryApi)) {
      return clone(registryApi);
    }

    const receipt =
      global.DGB_ENGINE_REGISTRY_RECEIPT ||
      global.DGB_ENGINE_SUBJECTS_RECEIPT ||
      null;

    return {
      registryLoaded: Boolean(receipt),
      receipt: receipt ? clone(receipt) : null
    };
  }

  function readEngineRuntime(engineRegistry) {
    const engine =
      global.DGB_ENGINE ||
      global.DGBEngine ||
      null;

    if (engine && typeof engine.inspect === 'function') {
      try {
        const inspection = engine.inspect();

        return {
          classification: 'REGISTERED_EXTERNAL_PROVIDER',
          source: 'DGB_ENGINE.inspect',
          engineId:
            firstString(
              inspection.engineId,
              inspection.runtimeReceipt?.engineId,
              engineRegistry?.selectedEngine?.engineId,
              'DGB_INTERACTIVE_RUNTIME_ENGINE_CORE'
            ),
          engineLoaded: true,
          contractMatched: true,
          backend:
            firstString(
              inspection.backend,
              inspection.runtimeReceipt?.backend,
              'NONE'
            ),
          state:
            firstString(
              inspection.state,
              inspection.runtimeReceipt?.state,
              'UNKNOWN'
            ),
          lifecycle: inspection.lifecycle || null,
          fileLoaded: null,
          modelValidated: null,
          instanceCreated: null,
          mountPresent: null,
          surfaceNonzero: null,
          backendInitialized: null,
          resourcesUploaded: null,
          firstFrameSubmitted: null,
          firstFramePresented: null,
          visiblePixelObserved: null,
          interactionObserved: null,
          fallbackAvailable: null,
          contextRecoveryAvailable: null,
          noBlockingError: null,
          primaryVisibility: null,
          fallbackVisibility: null,
          evidenceAvailable: true,
          evidenceUnavailableReason: null,
          rawInspection: clone(inspection)
        };
      } catch (error) {
        return {
          classification: 'REGISTERED_EXTERNAL_PROVIDER',
          source: 'DGB_ENGINE.inspect',
          engineId:
            firstString(
              engineRegistry?.selectedEngine?.engineId,
              'DGB_INTERACTIVE_RUNTIME_ENGINE_CORE'
            ),
          engineLoaded: true,
          contractMatched: true,
          backend: 'NONE',
          state: 'UNKNOWN',
          evidenceAvailable: false,
          evidenceUnavailableReason:
            error && error.message
              ? error.message
              : 'DGB_ENGINE_INSPECTION_FAILED'
        };
      }
    }

    return {
      classification: 'REGISTERED_EXTERNAL_PROVIDER',
      source: 'DGB_ENGINE.inspect',
      engineId:
        firstString(
          engineRegistry?.selectedEngine?.engineId,
          'DGB_INTERACTIVE_RUNTIME_ENGINE_CORE'
        ),
      engineLoaded: Boolean(global.DGB_ENGINE || global.DGBEngine),
      contractMatched: Boolean(engineRegistry?.selectedEngine?.contract),
      backend: 'NONE',
      state: 'UNKNOWN',
      lifecycle: null,
      fileLoaded: null,
      modelValidated: null,
      instanceCreated: null,
      mountPresent: null,
      surfaceNonzero: null,
      backendInitialized: null,
      resourcesUploaded: null,
      firstFrameSubmitted: null,
      firstFramePresented: null,
      visiblePixelObserved: null,
      interactionObserved: null,
      fallbackAvailable: null,
      contextRecoveryAvailable: null,
      noBlockingError: null,
      primaryVisibility: null,
      fallbackVisibility: null,
      evidenceAvailable: true,
      evidenceUnavailableReason: null
    };
  }

  function readTargetFrame() {
    const frame =
      document.getElementById('audraliaDiagnosticTargetFrame') ||
      document.querySelector('iframe[data-diagnostic-target="audralia"]') ||
      document.querySelector('iframe[src="/showroom/globe/audralia/"]') ||
      null;

    const target = {
      framePresent: Boolean(frame),
      frameId: frame && frame.id ? frame.id : null,
      targetRoute: TARGET_ROUTE,
      sameOriginAccessible: false,
      documentLoaded: false,
      targetRuntimeStatus: null,
      runtimeEvidenceAvailable: false,
      classification: 'UNKNOWN',
      noClaims: {
        iframePresenceProvesWebGL2: false,
        iframePresenceProvesSubmission: false,
        iframePresenceProvesPresentation: false,
        iframePresenceProvesVisibility: false
      }
    };

    if (!frame) {
      return target;
    }

    try {
      const doc =
        frame.contentDocument ||
        frame.contentWindow?.document ||
        null;

      target.sameOriginAccessible = Boolean(doc);
      target.documentLoaded =
        Boolean(doc && (doc.readyState === 'interactive' || doc.readyState === 'complete'));

      const runtimeStatus =
        frame.contentWindow?.AUDRALIA_RUNTIME_STATUS ||
        frame.contentWindow?.AUDRALIA_RUNTIME_RECEIPT ||
        frame.contentWindow?.AUDRALIA_CANVAS_AUTHORITY_RECEIPT ||
        null;

      target.targetRuntimeStatus = runtimeStatus ? clone(runtimeStatus) : null;
      target.runtimeEvidenceAvailable = Boolean(runtimeStatus);
    } catch (_) {
      target.sameOriginAccessible = false;
      target.documentLoaded = false;
    }

    return target;
  }

  function normalizeSelectedEngine(engineRegistry) {
    const selected =
      engineRegistry?.selectedEngine ||
      engineRegistry?.coreEngine ||
      engineRegistry?.receipt?.coreEngine ||
      {};

    const runtimeReceipt =
      selected.runtimeReceipt ||
      selected.inspection?.runtimeReceipt ||
      {};

    const inspection =
      selected.inspection ||
      {};

    const authority =
      engineRegistry?.authority ||
      selected.authority ||
      inspection.authority ||
      {};

    return {
      schema:
        firstString(
          selected.schema,
          'DGB_ENGINE_SUBJECT_RECORD_v2'
        ),
      slot:
        typeof selected.slot === 'number'
          ? selected.slot
          : 1,
      engineId:
        firstString(
          selected.engineId,
          engineRegistry?.receipt?.defaultEngineId,
          'DGB_INTERACTIVE_RUNTIME_ENGINE_CORE'
        ),
      engineName:
        firstString(
          selected.engineName,
          'DGB Interactive Runtime Engine Core'
        ),
      role:
        firstString(
          selected.role,
          'RUNTIME_ENGINE'
        ),
      reserved: selected.reserved === true,
      selectable: selected.selectable !== false,
      defaultEngine: selected.defaultEngine !== false,
      file:
        firstString(
          selected.file,
          runtimeReceipt.file,
          inspection.file,
          '/assets/engine/dgb.engine.js'
        ),
      contract:
        firstString(
          selected.contract,
          runtimeReceipt.contract,
          inspection.contract,
          'DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1'
        ),
      version:
        firstString(
          selected.version,
          runtimeReceipt.version,
          inspection.version,
          '1.0.0'
        ),
      globalNames:
        Array.isArray(selected.globalNames)
          ? selected.globalNames.slice()
          : [
              'DGB_ENGINE',
              'DGBEngine',
              'DGB_ENGINE_RECEIPT'
            ],
      governingAuthorityId:
        firstString(
          selected.governingAuthorityId,
          'DGB_INTERACTIVE_RUNTIME_ENGINE_GOVERNING_CONTRACT'
        ),
      governingContract:
        firstString(
          selected.governingContract,
          runtimeReceipt.governingContract,
          authority.contract,
          'DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1'
        ),
      governingContractFile:
        firstString(
          selected.governingContractFile,
          authority.file,
          '/assets/engine/dgb.engine.contract.js'
        ),
      modelSchema:
        firstString(
          selected.modelSchema,
          runtimeReceipt.modelSchema,
          authority.modelSchema,
          'DGB_MODEL_PACKAGE_v1'
        ),
      loaded: selected.loaded !== false,
      identityMatched: selected.identityMatched !== false,
      governingContractMatched: selected.governingContractMatched !== false,
      quietLoadExpected: selected.quietLoadExpected !== false,
      f13InheritedConditionally: selected.f13InheritedConditionally === true,
      f21Claimed: false,
      status:
        firstString(
          selected.status,
          'AVAILABLE'
        ),
      statusReason:
        firstString(
          selected.statusReason,
          'ENGINE_AND_AUTHORITY_AVAILABLE'
        ),
      runtimeStatus:
        selected.runtimeStatus ||
        {
          contract:
            firstString(
              runtimeReceipt.contract,
              selected.contract,
              'DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1'
            ),
          version:
            firstString(
              runtimeReceipt.version,
              selected.version,
              '1.0.0'
            ),
          file:
            firstString(
              runtimeReceipt.file,
              selected.file,
              '/assets/engine/dgb.engine.js'
            ),
          status:
            firstString(
              runtimeReceipt.status,
              'READY'
            ),
          authorityMatched: runtimeReceipt.authorityMatched !== false,
          modelSchema:
            firstString(
              runtimeReceipt.modelSchema,
              selected.modelSchema,
              'DGB_MODEL_PACKAGE_v1'
            ),
          liveInstanceCount: runtimeReceipt.liveInstanceCount || 0,
          tombstoneCount: runtimeReceipt.tombstoneCount || 0,
          adapterDescriptorCount: runtimeReceipt.adapterDescriptorCount || 0,
          activeSessionCount: runtimeReceipt.activeSessionCount || 0,
          activeSchedulerCount: runtimeReceipt.activeSchedulerCount || 0,
          f21Claimed: false
        },
      runtimeReceipt:
        isObject(runtimeReceipt)
          ? clone(runtimeReceipt)
          : null,
      inspection:
        isObject(inspection)
          ? clone(inspection)
          : null
    };
  }

  function normalizeEngineRegistry(rawRegistry) {
    const registry = isObject(rawRegistry) ? clone(rawRegistry) : {};

    const selectedEngine = normalizeSelectedEngine(registry);

    const authority =
      registry.authority ||
      registry.governingContract ||
      {};

    const receipt =
      registry.receipt ||
      global.DGB_ENGINE_REGISTRY_RECEIPT ||
      global.DGB_ENGINE_SUBJECTS_RECEIPT ||
      null;

    return {
      registryLoaded: registry.registryLoaded !== false,
      registryContract:
        firstString(
          registry.registryContract,
          receipt?.contract,
          'DGB_ENGINE_AND_AUTHORITY_REGISTRY_SIX_SLOT_RUNTIME_BINDING_TNT_v2'
        ),
      registryContractMatched: registry.registryContractMatched !== false,
      governingAuthorityCount:
        registry.governingAuthorityCount ||
        registry.authorityCount ||
        receipt?.authorityCount ||
        1,
      assignedEngineCount:
        registry.assignedEngineCount ||
        receipt?.assignedEngineCount ||
        1,
      selectableEngineCount:
        registry.selectableEngineCount ||
        receipt?.selectableEngineCount ||
        1,
      reservedEngineCount:
        registry.reservedEngineCount ||
        receipt?.reservedEngineCount ||
        5,
      authority:
        isObject(authority)
          ? clone(authority)
          : null,
      selectedEngine,
      receipt:
        receipt
          ? clone(receipt)
          : {
              schema: 'DGB_ENGINE_REGISTRY_RECEIPT_v2',
              contract: 'DGB_ENGINE_AND_AUTHORITY_REGISTRY_SIX_SLOT_RUNTIME_BINDING_TNT_v2',
              version: '2.0.0',
              file: '/assets/engine/dgb.engine.subjects.js',
              generatedAt: nowISO(),
              slotCount: 6,
              authorityCount: 1,
              assignedEngineCount: 1,
              selectableEngineCount: 1,
              reservedEngineCount: 5,
              defaultEngineId: selectedEngine.engineId,
              coreEngine: {
                engineId: selectedEngine.engineId,
                loaded: selectedEngine.loaded,
                identityMatched: selectedEngine.identityMatched,
                governingContractMatched: selectedEngine.governingContractMatched,
                selectable: selectedEngine.selectable,
                status: selectedEngine.status,
                f13InheritedConditionally: selectedEngine.f13InheritedConditionally,
                f21Claimed: false
              },
              boundaries: {
                metadataOnly: true,
                quietLoad: true,
                createsInstances: false,
                registersAdapters: false,
                attachesObserversAutomatically: false,
                startsSchedulers: false,
                mutatesRuntime: false,
                claimsReadiness: false,
                claimsF21: false
              }
            }
    };
  }

  function buildSubject(engineRegistry) {
    return {
      subjectId: 'AUDRALIA_DIAGNOSTIC_READER_ROUTE',
      subjectType: 'THREE_D_DIAGNOSTIC_ROUTE',
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      rootFile: DIAGNOSTIC_ROOT_FILE,
      route: DIAGNOSTIC_ROUTE,
      targetRoute: TARGET_ROUTE,
      filePathClass: normalizePathClass(FILE),
      rootFilePathClass: normalizePathClass(DIAGNOSTIC_ROOT_FILE),
      routePathClass: normalizePathClass(DIAGNOSTIC_ROUTE),
      targetRoutePathClass: normalizePathClass(TARGET_ROUTE),
      engineRegistryContract: engineRegistry.registryContract,
      selectedEngineId: engineRegistry.selectedEngine.engineId,
      selectedEngineFile: engineRegistry.selectedEngine.file
    };
  }

  function buildEngine(engineRegistry, engineRuntime) {
    const selected = engineRegistry.selectedEngine || {};

    return {
      engineId:
        firstString(
          selected.engineId,
          engineRuntime.engineId,
          'DGB_INTERACTIVE_RUNTIME_ENGINE_CORE'
        ),
      engineName:
        firstString(
          selected.engineName,
          'DGB Interactive Runtime Engine Core'
        ),
      role:
        firstString(
          selected.role,
          'RUNTIME_ENGINE'
        ),
      file:
        firstString(
          selected.file,
          engineRuntime.rawInspection?.file,
          '/assets/engine/dgb.engine.js'
        ),
      contract:
        firstString(
          selected.contract,
          engineRuntime.rawInspection?.contract,
          'DGB_INTERACTIVE_RUNTIME_ENGINE_CORE_NEWS_FIBONACCI_SPEC_OPS_TNT_v1'
        ),
      version:
        firstString(
          selected.version,
          engineRuntime.rawInspection?.version,
          '1.0.0'
        ),
      governingContract:
        firstString(
          selected.governingContract,
          'DGB_INTERACTIVE_RUNTIME_ENGINE_CONTRACT_NEWS_FIBONACCI_SPEC_OPS_TNT_v1'
        ),
      governingContractFile:
        firstString(
          selected.governingContractFile,
          '/assets/engine/dgb.engine.contract.js'
        ),
      modelSchema:
        firstString(
          selected.modelSchema,
          'DGB_MODEL_PACKAGE_v1'
        ),
      filePathClass:
        normalizePathClass(
          firstString(
            selected.file,
            '/assets/engine/dgb.engine.js'
          )
        ),
      loaded: selected.loaded !== false,
      identityMatched: selected.identityMatched !== false,
      governingContractMatched: selected.governingContractMatched !== false,
      status:
        firstString(
          selected.status,
          'AVAILABLE'
        ),
      runtimeReceipt: selected.runtimeReceipt || null,
      runtimeStatus: selected.runtimeStatus || null,
      inspection: selected.inspection || null
    };
  }

  function buildConstruct(engineRegistry, target) {
    return {
      constructId:
        'AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D',
      id:
        'AUDRALIA_DIAGNOSTIC_ROUTE_READER_FIRST_ENGINE_REGISTRY_NINE_CYCLE_READ_3D',
      constructType:
        'DIAGNOSTIC_ROUTE_READER',
      contract: HTML_CONTRACT,
      controllerContract: CONTRACT,
      previousControllerContract: PREVIOUS_CONTRACT,
      cssContract: CSS_CONTRACT,
      version: '2.0.0',
      controllerVersion: VERSION,
      route: DIAGNOSTIC_ROUTE,
      rootFile: DIAGNOSTIC_ROOT_FILE,
      file: DIAGNOSTIC_ROOT_FILE,
      controllerFile: FILE,
      routePathClass: normalizePathClass(DIAGNOSTIC_ROUTE),
      rootFilePathClass: normalizePathClass(DIAGNOSTIC_ROOT_FILE),
      controllerFilePathClass: normalizePathClass(FILE),
      targetRoute: TARGET_ROUTE,
      targetRoutePathClass: normalizePathClass(TARGET_ROUTE),
      target,
      engine: buildEngine(engineRegistry, {}),
      dependencies: [
        '/assets/audralia/audralia.diagnostic.north.conductor.js',
        '/assets/audralia/audralia.diagnostic.probe.north.js',
        '/assets/audralia/audralia.diagnostic.probe.east.js',
        '/assets/audralia/audralia.diagnostic.east.js',
        '/assets/audralia/audralia.diagnostic.probe.canvas.surface.truth.js',
        '/assets/audralia/audralia.diagnostic.probe.west.js',
        '/assets/audralia/audralia.diagnostic.west.js',
        '/assets/audralia/audralia.diagnostic.probe.south.js',
        '/assets/audralia/audralia.diagnostic.south.js',
        '/assets/audralia/audralia.diagnostic.rail.js'
      ]
    };
  }

  function buildStationRegistrations() {
    return STATION_ORDER.map(function buildRegistration(station) {
      const api = getPath(global, station.globalPath);

      return {
        position: station.position,
        stationId: station.stationId,
        file: station.file,
        status:
          api && typeof api.execute === 'function'
            ? 'REGISTERED'
            : 'REJECTED',
        reason:
          api && typeof api.execute === 'function'
            ? 'STATION_REGISTERED'
            : 'STATION_GLOBAL_NOT_FOUND',
        issues: [],
        globalPath: api ? station.globalPath : null,
        source: api ? 'DECLARED_GLOBAL' : 'NOT_FOUND',
        generatedAt: nowISO()
      };
    });
  }

  function createMissingReceipt(cycleId, station) {
    return {
      schema: 'AUDRALIA_DIAGNOSTIC_NINE_CYCLE_STATION_RECEIPT_v1',
      cycleId,
      position: station.position,
      stationId: station.stationId,
      fibonacci: station.fibonacci,
      contract: CONTRACT,
      version: VERSION,
      file: FILE,
      status: 'HOLD',
      completed: false,
      handoffEligible: false,
      summary: 'The North conductor did not return this station receipt.',
      observations: [],
      evidence: [],
      issues: [
        {
          code: 'STATION_RECEIPT_MISSING',
          path: station.stationId,
          detail: 'Expected station receipt was absent from the conductor result.'
        }
      ],
      firstHeldCoordinate: station.stationId,
      firstFailedCoordinate: null,
      firstConflictCoordinate: null,
      generatedAt: nowISO(),
      noClaims: clone(NO_CLAIMS)
    };
  }

  function normalizeReceipts(cycleId, conductorReceipts) {
    const receipts = Array.isArray(conductorReceipts)
      ? conductorReceipts.slice()
      : [];

    const byPosition = {};

    receipts.forEach(function indexReceipt(receipt) {
      if (receipt && typeof receipt.position === 'number') {
        byPosition[receipt.position] = receipt;
      }
    });

    return STATION_ORDER.map(function mapStation(station) {
      return byPosition[station.position] || createMissingReceipt(cycleId, station);
    });
  }

  function countReceipts(receipts, status) {
    return receipts.filter(function count(receipt) {
      return receipt && receipt.status === status;
    }).length;
  }

  function buildReaderReport(ledger) {
    return [
      'AUDRALIA DIAGNOSTIC READER REPORT',
      'SCHEMA=AUDRALIA_DIAGNOSTIC_READER_REPORT_v4',
      '',
      'Overall status: ' + (ledger.overallStatus === 'PASS' ? 'Passed' : 'Held for evidence'),
      'Passed stations: ' + ledger.passCount + ' of 9',
      'Held stations: ' + ledger.holdCount,
      'Attention items: ' + (ledger.failCount + ledger.conflictCount + ledger.errorCount),
      '',
      'Engine family:',
      'Governing contracts: ' + ledger.engineRegistry.governingAuthorityCount,
      'Assigned engines: ' + ledger.engineRegistry.assignedEngineCount,
      'Selectable engines: ' + ledger.engineRegistry.selectableEngineCount,
      'Reserved engine slots: ' + ledger.engineRegistry.reservedEngineCount,
      '',
      'North conductor:',
      'Invocation: createCycle',
      'Registered stations: ' + ledger.conductorState.registeredStationCount + ' of 9',
      '',
      'Plain-language reading:',
      'The diagnostic path is held because required runtime evidence is missing, unavailable, or not yet admitted. Missing proof was not replaced with synthetic positive evidence.',
      '',
      'Terminal summary:',
      ledger.terminalSummary,
      '',
      'Boundary:',
      'This diagnostic route does not authorize production mutation, runtime restart, renderer mutation, repair, readiness, visual pass, or F21.',
      '',
      'Ledger hash:',
      ledger.ledgerHash
    ].join('\n');
  }

  function publish(ledger) {
    global.AUDRALIA_DIAGNOSTIC_ROUTE_LEDGER = ledger;
    global.AUDRALIA_DIAGNOSTIC_ROUTE_READER_LEDGER = ledger;
    global.AUDRALIA_DIAGNOSTIC_READER_REPORT = buildReaderReport(ledger);

    try {
      const reportEl =
        document.getElementById('audraliaDiagnosticReaderReport') ||
        document.querySelector('[data-audralia-diagnostic-report]');

      if (reportEl) {
        reportEl.textContent = global.AUDRALIA_DIAGNOSTIC_READER_REPORT;
      }

      const ledgerEl =
        document.getElementById('audraliaDiagnosticLedger') ||
        document.querySelector('[data-audralia-diagnostic-ledger]');

      if (ledgerEl) {
        ledgerEl.textContent = JSON.stringify(ledger, null, 2);
      }
    } catch (_) {}
  }

  function runDiagnostic() {
    const cycleId =
      'AUDRALIA_DIAGNOSTIC_CYCLE_' + Date.now();

    const rawEngineRegistry =
      readEngineRegistry();

    const engineRegistry =
      normalizeEngineRegistry(rawEngineRegistry);

    const engineRuntime =
      readEngineRuntime(engineRegistry);

    const target =
      readTargetFrame();

    const subject =
      buildSubject(engineRegistry);

    const engine =
      buildEngine(engineRegistry, engineRuntime);

    const construct =
      buildConstruct(engineRegistry, target);

    construct.engine = engine;
    construct.subject = subject;

    const stationRegistrations =
      buildStationRegistrations();

    const packet = {
      schema: 'AUDRALIA_DIAGNOSTIC_ROUTE_CONTROLLER_PACKET_v4',
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      htmlContract: HTML_CONTRACT,
      cssContract: CSS_CONTRACT,
      cycleId,
      mode: 'AUDIT',
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      subject,
      engine,
      construct,
      target,
      engineRegistry,
      engineRuntime,
      stationRegistrations,
      priorLedgerHash:
        global.AUDRALIA_DIAGNOSTIC_ROUTE_LEDGER?.ledgerHash ||
        null,
      packetHash: null,
      noClaims: clone(NO_CLAIMS)
    };

    packet.packetHash = hash(packet);

    let conductorResult = null;
    let conductorReceipt = null;

    const conductor =
      global.AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR ||
      null;

    if (conductor && typeof conductor.createCycle === 'function') {
      try {
        conductorResult = conductor.createCycle(packet);
        conductorReceipt =
          conductorResult?.cycleReceipt ||
          conductorResult?.receipt ||
          conductorResult ||
          null;
      } catch (error) {
        conductorResult = {
          schema: 'AUDRALIA_DIAGNOSTIC_ROUTE_CONDUCTOR_RESULT_v1',
          error: error && error.message ? error.message : 'CONDUCTOR_CREATE_CYCLE_FAILED'
        };
      }
    } else {
      conductorResult = {
        schema: 'AUDRALIA_DIAGNOSTIC_ROUTE_CONDUCTOR_RESULT_v1',
        error: 'AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR_UNAVAILABLE'
      };
    }

    const rawStationReceipts =
      conductorReceipt?.stationReceipts ||
      conductorResult?.stationReceipts ||
      conductorReceipt?.receipts ||
      conductorResult?.receipts ||
      [];

    const receipts =
      normalizeReceipts(cycleId, rawStationReceipts);

    const passCount = countReceipts(receipts, 'PASS');
    const holdCount = countReceipts(receipts, 'HOLD');
    const failCount = countReceipts(receipts, 'FAIL');
    const conflictCount = countReceipts(receipts, 'CONFLICT');
    const errorCount = countReceipts(receipts, 'ERROR');

    const terminalReceipt =
      receipts.find(function findRail(receipt) {
        return receipt && receipt.stationId === 'RAIL_TERMINAL_SYNTHESIS';
      }) ||
      null;

    const overallStatus =
      failCount || conflictCount || errorCount
        ? 'HOLD'
        : holdCount
          ? 'HOLD'
          : 'PASS';

    const ledger = {
      schema: 'AUDRALIA_DIAGNOSTIC_ROUTE_LEDGER_v4',
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      htmlContract: HTML_CONTRACT,
      cssContract: CSS_CONTRACT,
      cycleId,
      generatedAt: nowISO(),
      targetRoute: TARGET_ROUTE,
      orchestrationOwner: 'AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR',
      orchestrationMethod: 'createCycle',
      receiptCount: 9,
      passCount,
      holdCount,
      failCount,
      conflictCount,
      errorCount,
      degradedCount: 0,
      overallStatus,
      terminalStatus:
        terminalReceipt?.status ||
        overallStatus,
      terminalSummary:
        terminalReceipt?.summary ||
        'RAIL_TERMINAL_SYNTHESIS_HELD_OR_INCOMPLETE',
      engineRegistry,
      engineRuntime,
      subject,
      engine,
      construct,
      target,
      conductorState:
        conductorResult?.state ||
        conductorReceipt?.state ||
        {
          cycleId,
          state: overallStatus === 'PASS' ? 'PASSED' : 'HELD',
          sealed: true,
          disposed: false,
          runOnce: true,
          registeredStationCount:
            stationRegistrations.filter(function registered(entry) {
              return entry.status === 'REGISTERED';
            }).length,
          startedAt: null,
          completedAt: nowISO()
        },
      conductorReceipt,
      stationRegistrations,
      conductorResult,
      receipts,
      noClaims: clone(NO_CLAIMS),
      ledgerHash: null
    };

    ledger.ledgerHash = hash(ledger);

    publish(ledger);

    return ledger;
  }

  const API = {
    schema: 'AUDRALIA_DIAGNOSTIC_ROUTE_READER_CONTROLLER_API_v4',
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    file: FILE,
    htmlContract: HTML_CONTRACT,
    cssContract: CSS_CONTRACT,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    runDiagnostic,
    readEngineRegistry,
    readTargetFrame,
    buildReaderReport,
    noClaims: clone(NO_CLAIMS)
  };

  global.AUDRALIA_DIAGNOSTIC_ROUTE_READER_CONTROLLER = API;

  global.AUDRALIA_DIAGNOSTIC_ROUTE_READER_CONTROLLER_RECEIPT = {
    schema: 'AUDRALIA_DIAGNOSTIC_ROUTE_READER_CONTROLLER_RECEIPT_v4',
    contract: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    file: FILE,
    status: 'AVAILABLE',
    orchestrationOwner: 'AUDRALIA_DIAGNOSTIC_NORTH_CONDUCTOR',
    orchestrationMethod: 'createCycle',
    packetNormalization: {
      subjectFileDeclared: FILE,
      engineFileDerivedFromRegistry: true,
      constructRootFileDeclared: DIAGNOSTIC_ROOT_FILE,
      targetRouteDeclared: TARGET_ROUTE
    },
    noClaims: clone(NO_CLAIMS),
    generatedAt: nowISO()
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      runDiagnostic();
    }, { once: true });
  } else {
    runDiagnostic();
  }

})(window);
