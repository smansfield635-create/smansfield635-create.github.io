(function attachShowroomRuntime(global) {
  "use strict";

  const VERSION = "SHOWROOM_RUNTIME_TRUE_GEN4_PHASE_ROTATION_CLOSEOUT_TNT_v1";
  const GENERATION = "GENERATION_4";
  const GEN4_TYPE = "narrative-code";
  const AUTHORITY = "/showroom/runtime.js";

  const PHASE_SEQUENCE = Object.freeze([
    "HOME",
    "BOUNDARY",
    "MOTION",
    "REALM",
    "RECEIPT",
    "NEXT"
  ]);

  const store = {
    createdAt: new Date().toISOString(),
    receipts: [],
    routeSessions: {},
    status: {
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      runtimeAuthority: AUTHORITY,
      receiptLedger: true,
      ownsMotion: false,
      ownsSpeed: false,
      ownsPlacement: false,
      phaseSequence: PHASE_SEQUENCE.join(" → "),
      activeRealm: null,
      activeRoute: null,
      activeRouteRole: null,
      lastReceiptType: null,
      lastReceiptAt: null,
      phaseRotationClosed: false
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function now() {
    return new Date().toISOString();
  }

  function normalizePhase(phase) {
    const candidate = String(phase || "").toUpperCase();
    return PHASE_SEQUENCE.includes(candidate) ? candidate : "UNSPECIFIED";
  }

  function publish(type, receipt) {
    global.dispatchEvent(
      new CustomEvent("showroom:runtime-receipt", {
        detail: clone(receipt)
      })
    );

    global.dispatchEvent(
      new CustomEvent("showroom:true-gen4-ledger", {
        detail: {
          type,
          generation: GENERATION,
          gen4Type: GEN4_TYPE,
          receipt: clone(receipt),
          status: clone(store.status)
        }
      })
    );
  }

  function pushReceipt(type, payload, session) {
    const receipt = {
      type,
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      runtimeAuthority: AUTHORITY,
      ownsMotion: false,
      ownsSpeed: false,
      ownsPlacement: false,
      sessionId: session ? session.sessionId : null,
      route: session ? session.route : null,
      realm: session ? session.realm : null,
      routeRole: session ? session.routeRole : null,
      payload: payload || {},
      timestamp: now()
    };

    store.receipts.push(receipt);

    if (store.receipts.length > 144) {
      store.receipts.splice(0, store.receipts.length - 144);
    }

    store.status.lastReceiptType = type;
    store.status.lastReceiptAt = receipt.timestamp;

    publish(type, receipt);

    return clone(receipt);
  }

  function createSession(config) {
    const cfg = Object.assign(
      {
        realm: "showroom-parent-proof-realm",
        route: "/showroom/",
        routeRole: "showroom-proof-surface",
        mode: "parent"
      },
      config || {}
    );

    const sessionId = [
      "showroom",
      cfg.mode || "route",
      Date.now(),
      Math.random().toString(16).slice(2)
    ].join("-");

    const session = {
      sessionId,
      mode: cfg.mode,
      realm: cfg.realm,
      route: cfg.route,
      routeRole: cfg.routeRole,
      createdAt: now(),
      phaseReceipts: [],
      phaseIndex: -1,
      phaseRotationClosed: false
    };

    store.routeSessions[sessionId] = session;

    store.status.activeRealm = cfg.realm;
    store.status.activeRoute = cfg.route;
    store.status.activeRouteRole = cfg.routeRole;
    store.status.activeMode = cfg.mode;
    store.status.activeSessionId = sessionId;
    store.status.updatedAt = now();

    pushReceipt(
      "runtime_session_created",
      {
        mode: cfg.mode,
        realm: cfg.realm,
        route: cfg.route,
        routeRole: cfg.routeRole,
        phaseSequence: PHASE_SEQUENCE,
        runtimeRole: "receipt-ledger-only",
        motionAuthority: "instrument-proof-cycle",
        speedAuthority: "retired",
        placementAuthority: "route-consumer"
      },
      session
    );

    return session;
  }

  function closePhaseRotation(session) {
    const phasesSeen = session.phaseReceipts.map(function phaseKey(item) {
      return item.phase;
    });

    const closed = PHASE_SEQUENCE.every(function required(phase) {
      return phasesSeen.includes(phase);
    });

    session.phaseRotationClosed = closed;
    store.status.phaseRotationClosed = closed;
    store.status.phaseRotationSessionId = session.sessionId;

    if (closed) {
      pushReceipt(
        "phase_rotation_closed",
        {
          phaseSequence: PHASE_SEQUENCE,
          phasesSeen,
          meaning:
            "The route has recorded the full True Gen 4 phase rotation from HOME through NEXT.",
          closeout: true
        },
        session
      );
    }

    return closed;
  }

  function createRuntime(config) {
    const session = createSession(config);

    function writeReceipt(type, payload) {
      return pushReceipt(type, payload || {}, session);
    }

    function writePhaseReceipt(phase, payload) {
      const normalized = normalizePhase(phase);
      const index = PHASE_SEQUENCE.indexOf(normalized);

      const phaseReceipt = {
        phase: normalized,
        phaseIndex: index,
        payload: payload || {},
        timestamp: now()
      };

      session.phaseIndex = index;
      session.phaseReceipts.push(phaseReceipt);

      const receipt = pushReceipt(
        "phase_receipt_written",
        {
          phase: normalized,
          phaseIndex: index,
          phaseSequence: PHASE_SEQUENCE,
          consequence:
            normalized === "UNSPECIFIED"
              ? "Unspecified phase recorded without closing the rotation."
              : "Phase recorded into the True Gen 4 narrative-code ledger.",
          details: payload || {}
        },
        session
      );

      closePhaseRotation(session);

      return receipt;
    }

    function closeoutRoute(payload) {
      PHASE_SEQUENCE.forEach(function recordPhase(phase, index) {
        const alreadySeen = session.phaseReceipts.some(function seen(item) {
          return item.phase === phase;
        });

        if (!alreadySeen) {
          writePhaseReceipt(phase, {
            closeoutGenerated: true,
            phaseIndex: index,
            route: session.route,
            realm: session.realm
          });
        }
      });

      const closed = closePhaseRotation(session);

      return pushReceipt(
        "route_phase_closeout_complete",
        {
          route: session.route,
          realm: session.realm,
          routeRole: session.routeRole,
          mode: session.mode,
          closed,
          closeoutPayload: payload || {},
          phaseSequence: PHASE_SEQUENCE,
          runtimeRole: "receipt-ledger-only"
        },
        session
      );
    }

    function getReceipts() {
      return clone(
        store.receipts.filter(function bySession(receipt) {
          return receipt.sessionId === session.sessionId;
        })
      );
    }

    function getStatus() {
      return clone({
        session,
        global: store.status
      });
    }

    return Object.freeze({
      version: VERSION,
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      authority: AUTHORITY,
      phaseSequence: PHASE_SEQUENCE.slice(),
      config: clone(config || {}),
      writeReceipt,
      writePhaseReceipt,
      closeoutRoute,
      getReceipts,
      getStatus
    });
  }

  global.ShowroomRuntime = Object.freeze({
    VERSION,
    GENERATION,
    GEN4_TYPE,
    AUTHORITY,
    PHASE_SEQUENCE,
    createRuntime,
    getGlobalStatus: function getGlobalStatus() {
      return clone(store.status);
    },
    getGlobalReceipts: function getGlobalReceipts() {
      return clone(store.receipts);
    }
  });
})(window);
