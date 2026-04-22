(function productsHostBootstrap() {
  "use strict";

  const HOST_META = Object.freeze({
    name: "PRODUCTS_HOST_BOOTSTRAP",
    version: "V2",
    role: "host_orchestration_only",
    contract: "PRODUCTS_HOST_CONTRACT_V2",
    status: "ACTIVE",
    runtime_owner: "products_runtime.js",
    deterministic: true
  });

  const contract = window.__PRODUCTS_HOST_CONTRACT__ || {};
  const stageId = contract.stageId || "products-stage";
  const diagnosticsId = contract.diagnosticsId || "products-diagnostics";
  const loadingCopyId = contract.loadingCopyId || "products-loading-copy";
  const runtimeGlobalKey = contract.runtimeGlobalKey || "ProductsPlanetRuntime";

  const boot = {
    host: HOST_META,
    startedAt: new Date().toISOString(),
    stageFound: false,
    runtimeFound: false,
    selectedEntrypoint: null,
    mounted: false,
    errors: []
  };

  function byId(id) {
    return typeof id === "string" ? document.getElementById(id) : null;
  }

  function writeDiagnostics(extra) {
    const target = byId(diagnosticsId);
    if (!target) return;

    const snapshot = {
      ...boot,
      ...(extra || {})
    };

    target.textContent = JSON.stringify(snapshot, null, 2);
  }

  function setLoadingMessage(message, isError) {
    const node = byId(loadingCopyId);
    if (!node) return;
    node.textContent = message;
    node.className = isError ? "loading-copy state-error" : "loading-copy";
  }

  function markStageReady() {
    const stage = byId(stageId);
    if (stage) {
      stage.setAttribute("data-ready", "true");
    }

    const loading = byId(loadingCopyId);
    if (loading) {
      loading.remove();
    }
  }

  function normalizeRuntimeCandidate(candidate) {
    if (!candidate) return null;

    if (typeof candidate === "function") {
      return {
        name: "runtime_function",
        invoke(root) {
          return candidate(root);
        }
      };
    }

    if (typeof candidate !== "object") {
      return null;
    }

    const entrypoints = [
      "start",
      "boot",
      "mount",
      "render",
      "init",
      "attach"
    ];

    for (const key of entrypoints) {
      if (typeof candidate[key] === "function") {
        return {
          name: key,
          invoke(root) {
            return candidate[key]({
              root,
              stage: root,
              container: root,
              host: HOST_META,
              contract,
              diagnosticsTargetId: diagnosticsId
            });
          }
        };
      }
    }

    return null;
  }

  function resolveRuntime() {
    const direct = window[runtimeGlobalKey];
    if (direct) return direct;

    const aliases = [
      "ProductsRuntime",
      "ProductsPageRuntime",
      "ProductsStageRuntime",
      "ProductsRuntimeAPI"
    ];

    for (const key of aliases) {
      if (window[key]) return window[key];
    }

    return null;
  }

  function fail(message, detail) {
    boot.errors.push({
      message,
      detail: detail ? String(detail) : null,
      at: new Date().toISOString()
    });

    setLoadingMessage(message, true);
    writeDiagnostics();

    throw new Error(detail ? `${message}: ${detail}` : message);
  }

  function bootstrap() {
    const stage = byId(stageId);
    boot.stageFound = Boolean(stage);

    if (!stage) {
      fail("Products host stage container missing", `Expected #${stageId}`);
      return;
    }

    const runtime = resolveRuntime();
    boot.runtimeFound = Boolean(runtime);
    writeDiagnostics();

    if (!runtime) {
      fail("Runtime global missing", `Expected window.${runtimeGlobalKey}`);
      return;
    }

    const candidate = normalizeRuntimeCandidate(runtime);

    if (!candidate) {
      if (stage.children.length > 0 && stage.textContent.trim().length > 0) {
        boot.selectedEntrypoint = "runtime_already_rendered";
        boot.mounted = true;
        markStageReady();
        writeDiagnostics();
        return;
      }

      fail(
        "Runtime entrypoint missing",
        "No supported entrypoint found on resolved runtime object"
      );
      return;
    }

    boot.selectedEntrypoint = candidate.name;
    writeDiagnostics();

    try {
      const result = candidate.invoke(stage);
      boot.mounted = true;
      markStageReady();

      if (result && typeof result.then === "function") {
        result
          .then(function onResolved() {
            writeDiagnostics({ asyncResolved: true });
          })
          .catch(function onRejected(error) {
            boot.errors.push({
              message: "Async runtime rejection",
              detail: String(error),
              at: new Date().toISOString()
            });
            setLoadingMessage("Products stage failed after async handoff.", true);
            writeDiagnostics();
          });
      } else {
        writeDiagnostics();
      }
    } catch (error) {
      fail("Runtime invocation failed", error && error.message ? error.message : error);
    }
  }

  function startWhenReady() {
    writeDiagnostics();

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        function onReady() {
          bootstrap();
        },
        { once: true }
      );
      return;
    }

    bootstrap();
  }

  startWhenReady();
})();
