/* TNT NEW FILE — /runtime/compass_cockpit_runtime_queue.js
   COMPASS COCKPIT RUNTIME QUEUE · PAGE-LEVEL SAFE QUEUE BROKER B1

   QUEUE_VERSION = "compass-cockpit-runtime-queue-b1"
   ROOT_BOOT_ID = "root-sun-asset-b1"
   COCKPIT_VERSION = "root-compass-cockpit-b1"

   PURPOSE:
     - Queue existing runtime files without overloading /index.html
     - Preserve /index.js as cockpit operator
     - Preserve /runtime/compass_cockpit_render.js as visual render authority
     - Preserve future control/instrument panels as independent authorities
     - Load passive/kernel files safely
     - Bridge ES modules safely
     - Do not load legacy site_runtime.js
     - Do not load scene.js until ground_renderer.js is repaired
     - Do not auto-load sun_asset_runtime.js unless explicitly enabled
*/

(function () {
  "use strict";

  var QUEUE_VERSION = "compass-cockpit-runtime-queue-b1";
  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var COCKPIT_VERSION = "root-compass-cockpit-b1";
  var READY_EVENT = "dgb:cockpit:runtimequeue";
  var ROOT_SELECTOR = "#door-root,[data-root-door]";

  var QUEUE_META = Object.freeze({
    name: "COMPASS_COCKPIT_RUNTIME_QUEUE",
    version: QUEUE_VERSION,
    role: "page_level_runtime_queue_broker",
    contract: "COMPASS_COCKPIT_RUNTIME_QUEUE_CONTRACT_B1",
    status: "ACTIVE",
    deterministic: true
  });

  var CLASSIC_QUEUE = Object.freeze([
    {
      key: "liveRuntimeKernel",
      path: "/runtime/live_runtime_kernel.js",
      mode: "classic",
      load: true,
      reason: "passive runtime/session kernel for future instruments",
      expectedGlobal: ["LiveRuntimeKernel", "liveRuntimeKernel"]
    }
  ]);

  var MODULE_QUEUE = Object.freeze([
    {
      key: "worldRuntime",
      path: "/runtime/world_runtime.js",
      mode: "module",
      load: true,
      reason: "world runtime bridge for future planet/path/instrument reads",
      globalName: "__DGB_WORLD_RUNTIME_MODULE"
    }
  ]);

  var HELD_QUEUE = Object.freeze([
    {
      key: "sunAssetRuntime",
      path: "/runtime/sun_asset_runtime.js",
      mode: "classic",
      load: false,
      reason: "visual active runtime; held until satellite surface layer is intentionally upgraded"
    },
    {
      key: "planetProjection",
      path: "/runtime/planet_projection.js",
      mode: "module",
      load: false,
      reason: "support module; should be consumed through world_runtime, not direct root load"
    },
    {
      key: "environmentRenderer",
      path: "/runtime/environment_renderer.js",
      mode: "module",
      load: false,
      reason: "support module; should be consumed through world_runtime or future scene bridge"
    },
    {
      key: "scene",
      path: "/runtime/scene.js",
      mode: "module",
      load: false,
      reason: "held because scene depends on renderer exports that must be verified before root queue"
    },
    {
      key: "siteRuntime",
      path: "/runtime/site_runtime.js",
      mode: "classic",
      load: false,
      reason: "blocked legacy root runtime; must not overwrite Generation 2 cockpit operator"
    }
  ]);

  var state = {
    version: QUEUE_VERSION,
    started: false,
    completed: false,
    active: {},
    held: {},
    errors: [],
    loadedAt: null,
    updatedAt: null
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function rootNode() {
    return $(ROOT_SELECTOR);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function clonePlain(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      return value;
    }
  }

  function initState() {
    CLASSIC_QUEUE.forEach(function (item) {
      state.active[item.key] = {
        key: item.key,
        path: item.path,
        mode: item.mode,
        status: "pending",
        reason: item.reason,
        expectedGlobal: item.expectedGlobal || [],
        loaded: false,
        error: ""
      };
    });

    MODULE_QUEUE.forEach(function (item) {
      state.active[item.key] = {
        key: item.key,
        path: item.path,
        mode: item.mode,
        status: "pending",
        reason: item.reason,
        globalName: item.globalName,
        loaded: false,
        error: ""
      };
    });

    HELD_QUEUE.forEach(function (item) {
      state.held[item.key] = {
        key: item.key,
        path: item.path,
        mode: item.mode,
        status: "held",
        reason: item.reason,
        loaded: false,
        error: ""
      };
    });
  }

  function markRoot() {
    var root = rootNode();

    if (!root) return null;

    root.setAttribute("data-compass-cockpit-runtime-queue", QUEUE_VERSION);
    root.setAttribute("data-runtime-queue-authority", "page-level-runtime-queue-broker");
    root.setAttribute("data-runtime-queue-contract", "COMPASS_COCKPIT_RUNTIME_QUEUE_CONTRACT_B1");
    root.setAttribute("data-runtime-queue-status", state.completed ? "COMPLETE" : "ACTIVE");
    root.setAttribute("data-root-boot-confirmed", ROOT_BOOT_ID);
    root.setAttribute("data-compass-cockpit", COCKPIT_VERSION);

    return root;
  }

  function dispatchUpdate() {
    state.updatedAt = nowIso();
    markRoot();

    try {
      window.dispatchEvent(new CustomEvent(READY_EVENT, {
        detail: getPublicState()
      }));
    } catch (error) {
      /* no-op */
    }
  }

  function hasAnyGlobal(names) {
    return names.some(function (name) {
      return Boolean(window[name]);
    });
  }

  function loadClassic(item) {
    return new Promise(function (resolve) {
      var record = state.active[item.key];
      var existing;

      if (!record) {
        resolve(false);
        return;
      }

      if (item.expectedGlobal && hasAnyGlobal(item.expectedGlobal)) {
        record.status = "already-present";
        record.loaded = true;
        dispatchUpdate();
        resolve(true);
        return;
      }

      existing = document.querySelector('script[data-runtime-queue-key="' + item.key + '"]');
      if (existing) {
        record.status = "already-requested";
        record.loaded = true;
        dispatchUpdate();
        resolve(true);
        return;
      }

      record.status = "loading";
      dispatchUpdate();

      var script = document.createElement("script");
      script.src = item.path + "?v=" + encodeURIComponent(QUEUE_VERSION);
      script.defer = true;
      script.setAttribute("data-runtime-queue-key", item.key);
      script.setAttribute("data-runtime-queue-version", QUEUE_VERSION);

      script.onload = function () {
        record.status = "loaded";
        record.loaded = true;
        record.error = "";
        dispatchUpdate();
        resolve(true);
      };

      script.onerror = function () {
        record.status = "failed";
        record.loaded = false;
        record.error = "classic script load failed";
        state.errors.push({
          key: item.key,
          path: item.path,
          error: record.error
        });
        dispatchUpdate();
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  function loadModule(item) {
    return new Promise(function (resolve) {
      var record = state.active[item.key];
      var existing;

      if (!record) {
        resolve(false);
        return;
      }

      if (window[item.globalName]) {
        record.status = "already-present";
        record.loaded = true;
        dispatchUpdate();
        resolve(true);
        return;
      }

      existing = document.querySelector('script[data-runtime-queue-key="' + item.key + '"]');
      if (existing) {
        record.status = "already-requested";
        record.loaded = true;
        dispatchUpdate();
        resolve(true);
        return;
      }

      record.status = "loading";
      dispatchUpdate();

      var eventName = "dgb:runtimequeue:module:" + item.key;
      var script = document.createElement("script");

      function finish(ok, errorText) {
        if (ok) {
          record.status = "loaded";
          record.loaded = true;
          record.error = "";
        } else {
          record.status = "failed";
          record.loaded = false;
          record.error = errorText || "module bridge failed";
          state.errors.push({
            key: item.key,
            path: item.path,
            error: record.error
          });
        }

        dispatchUpdate();
        resolve(ok);
      }

      window.addEventListener(eventName, function (event) {
        var detail = event && event.detail ? event.detail : {};
        finish(detail.ok === true, detail.error || "");
      }, { once: true });

      script.type = "module";
      script.setAttribute("data-runtime-queue-key", item.key);
      script.setAttribute("data-runtime-queue-version", QUEUE_VERSION);

      script.textContent =
        "import(" + JSON.stringify(item.path) + ")\n" +
        "  .then(function(module){\n" +
        "    window[" + JSON.stringify(item.globalName) + "] = module;\n" +
        "    window.dispatchEvent(new CustomEvent(" + JSON.stringify(eventName) + ", { detail: { ok: true, key: " + JSON.stringify(item.key) + ", path: " + JSON.stringify(item.path) + " } }));\n" +
        "  })\n" +
        "  .catch(function(error){\n" +
        "    window.dispatchEvent(new CustomEvent(" + JSON.stringify(eventName) + ", { detail: { ok: false, key: " + JSON.stringify(item.key) + ", path: " + JSON.stringify(item.path) + ", error: error && error.message ? error.message : 'module import failed' } }));\n" +
        "  });\n";

      script.onerror = function () {
        finish(false, "module script tag failed");
      };

      document.head.appendChild(script);

      window.setTimeout(function () {
        if (record.status === "loading") {
          finish(false, "module bridge timeout");
        }
      }, 4000);
    });
  }

  function runQueue() {
    if (state.started) return Promise.resolve(getPublicState());

    state.started = true;
    state.loadedAt = nowIso();
    markRoot();
    dispatchUpdate();

    var classicLoads = CLASSIC_QUEUE
      .filter(function (item) { return item.load === true; })
      .map(loadClassic);

    return Promise.all(classicLoads)
      .then(function () {
        var moduleLoads = MODULE_QUEUE
          .filter(function (item) { return item.load === true; })
          .map(loadModule);

        return Promise.all(moduleLoads);
      })
      .then(function () {
        state.completed = true;
        markRoot();
        dispatchUpdate();
        return getPublicState();
      })
      .catch(function (error) {
        state.errors.push({
          key: "queue",
          path: "",
          error: error && error.message ? error.message : "runtime queue failed"
        });
        state.completed = true;
        markRoot();
        dispatchUpdate();
        return getPublicState();
      });
  }

  function enableSunAssetRuntime() {
    var held = state.held.sunAssetRuntime;

    if (!held) return Promise.resolve(false);

    if (held.loaded) return Promise.resolve(true);

    held.status = "loading";
    dispatchUpdate();

    return new Promise(function (resolve) {
      var script = document.createElement("script");

      script.src = held.path + "?v=root-sun-asset-b1";
      script.defer = true;
      script.setAttribute("data-runtime-queue-key", "sunAssetRuntime");
      script.setAttribute("data-runtime-queue-version", QUEUE_VERSION);
      script.setAttribute("data-runtime-queue-explicit", "true");

      script.onload = function () {
        held.status = "loaded-explicit";
        held.loaded = true;
        held.error = "";
        dispatchUpdate();
        resolve(true);
      };

      script.onerror = function () {
        held.status = "failed";
        held.loaded = false;
        held.error = "sun asset runtime load failed";
        state.errors.push({
          key: "sunAssetRuntime",
          path: held.path,
          error: held.error
        });
        dispatchUpdate();
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  function getWorldRuntimeModule() {
    return window.__DGB_WORLD_RUNTIME_MODULE || null;
  }

  function getLiveRuntimeKernel() {
    return window.LiveRuntimeKernel || window.liveRuntimeKernel || null;
  }

  function getPublicState() {
    return {
      meta: QUEUE_META,
      version: QUEUE_VERSION,
      rootBootId: ROOT_BOOT_ID,
      cockpitVersion: COCKPIT_VERSION,
      started: state.started,
      completed: state.completed,
      loadedAt: state.loadedAt,
      updatedAt: state.updatedAt,
      active: clonePlain(state.active),
      held: clonePlain(state.held),
      errors: clonePlain(state.errors),
      bridges: {
        liveRuntimeKernel: Boolean(getLiveRuntimeKernel()),
        worldRuntime: Boolean(getWorldRuntimeModule()),
        sunAssetRuntime: Boolean(window.DGBSunAssetRuntime)
      },
      blockedLegacy: {
        siteRuntime: true,
        scene: true
      },
      ownsOperator: false,
      ownsRenderCss: false,
      ownsControlPanelDom: false,
      ownsInstrumentPanelDom: false,
      ownsVenueGeometry: false,
      ownsWorldLaw: false
    };
  }

  function expose() {
    window.DGBCompassCockpitRuntimeQueue = {
      meta: QUEUE_META,
      version: QUEUE_VERSION,
      runQueue: runQueue,
      enableSunAssetRuntime: enableSunAssetRuntime,
      getWorldRuntimeModule: getWorldRuntimeModule,
      getLiveRuntimeKernel: getLiveRuntimeKernel,
      getPublicState: getPublicState
    };
  }

  function boot() {
    expose();
    initState();
    markRoot();
    runQueue();
  }

  expose();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
