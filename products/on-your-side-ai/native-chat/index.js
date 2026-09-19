const RUNTIME_RELEASE_ID = new URL(import.meta.url).searchParams.get("v") || "";
const DECLARED_RUNTIME_RELEASE_ID = document.documentElement.dataset.nativeChatRuntime || "";

if (
  !/^[0-9a-f]{40}$/.test(RUNTIME_RELEASE_ID) ||
  RUNTIME_RELEASE_ID !== DECLARED_RUNTIME_RELEASE_ID
) {
  throw new Error("NATIVE_CHAT_RUNTIME_RELEASE_ID_MISMATCH");
}

document.documentElement.dataset.nativeChatRuntimeActive = RUNTIME_RELEASE_ID;

const MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
const WEBLLM_MODULE = "https://esm.run/@mlc-ai/web-llm@0.2.85";
const WLLAMA_MODULE_SOURCES = Object.freeze([
  {
    id: "JSDELIVR_NPM_EXACT",
    url: "https://cdn.jsdelivr.net/npm/@wllama/wllama@3.6.0/esm/index.js"
  },
  {
    id: "UNPKG_NPM_EXACT",
    url: "https://unpkg.com/@wllama/wllama@3.6.0/esm/index.js"
  }
]);
const WLLAMA_WASM_URL = new URL("./runtime/wllama/3.6.0/wllama.wasm", window.location.href).href;
const CPU_MODEL_REVISION = "b26a58accf53b1a19fbc555d52fdb224bec473f5";
const CPU_MODEL_SHA256 = "6eb923e7d26e9cea28811e1a8e852009b21242fb157b26149d3b188f3a8c8653";
const CPU_MODEL_BYTES = 397808192;
const CPU_MODEL_URL = `https://huggingface.co/bartowski/Qwen2.5-0.5B-Instruct-GGUF/resolve/${CPU_MODEL_REVISION}/Qwen2.5-0.5B-Instruct-Q4_K_M.gguf?download=true`;
const MODEL_URL = new URL("./runtime/model/Qwen2.5-0.5B-Instruct-q4f16_1-MLC/", window.location.href).href;
const MODEL_LIB_URL = new URL("./runtime/webllm/Qwen2-0.5B-Instruct-q4f16_1_cs1k-webgpu.wasm", window.location.href).href;
const FIRST_CONTENT_TOKEN_WATCHDOG_MS = 60_000;

const SYSTEM_MESSAGE = [
  "You are On Your Side AAI Public Talk v1, a small browser-local support assistant.",
  "Help the user understand, organize, compare, draft, and identify reasonable next steps.",
  "Be concise, clear, and candid about uncertainty.",
  "Do not claim professional, medical, legal, financial, scientific, or other expert authority.",
  "Do not pretend to browse the web, access private files, access a repository, access a private control plane, or execute external actions.",
  "Never claim that you performed an action you cannot perform.",
  "Keep the user in control. Always on their side; never in control."
].join(" ");

const INTEGRITY = {
  config: "sha256-VDnAO99O58/g+Kl6ZYgBiwFE3BKAxxu66ihTzbq4dLk=",
  model_lib: "sha256-YRtYT9RK8niUFjlWA5Zaa8B08hJxiK9Zf03aAW+9qxk=",
  tokenizer: {
    "tokenizer.json": "sha256-wDghF+oynN8JcEETL21zWSS2l5JNb2/DlFcT6WzodTk="
  },
  onFailure: "error"
};

const els = {
  deviceStatus: document.querySelector("#device-status"),
  modelStatus: document.querySelector("#model-status"),
  loadButton: document.querySelector("#load-model"),
  loadPanel: document.querySelector("#load-panel"),
  progressWrap: document.querySelector("#progress-wrap"),
  progress: document.querySelector("#load-progress"),
  progressText: document.querySelector("#progress-text"),
  chatShell: document.querySelector("#chat-shell"),
  transcript: document.querySelector("#transcript"),
  form: document.querySelector("#composer"),
  prompt: document.querySelector("#prompt"),
  send: document.querySelector("#send-message"),
  stop: document.querySelector("#stop-generation"),
  reset: document.querySelector("#reset-chat"),
  composerNote: document.querySelector("#composer-note"),
  diagnosticDetails: document.querySelector("#diagnostic-details"),
  diagnosticReport: document.querySelector("#diagnostic-report"),
  copyDiagnostic: document.querySelector("#copy-diagnostic")
};

let engine = null;
let activeBackend = null;
let webgpuAvailable = null;
let activeAbortController = null;
let loading = false;
let generating = false;
let stopRequested = false;
let firstInferenceCompleted = false;
let messages = [{ role: "system", content: SYSTEM_MESSAGE }];

const diagnosticState = {
  schema: "NATIVE_CHAT_LOCAL_DIAGNOSTIC_v2",
  runtimeReleaseId: RUNTIME_RELEASE_ID,
  attempt: 0,
  activeStage: "PAGE_BOOT",
  activeBackend: "none",
  activeModuleSource: null,
  firstFailedStage: null,
  lastPassedStage: "PAGE_BOOT",
  failureChain: [],
  moduleImportAttempts: [],
  webgpuState: "UNKNOWN",
  primaryFailure: null,
  fallbackFailure: null,
  wasmProbe: { status: "NOT_RUN", httpStatus: null, bytes: null },
  ggufProbe: { status: "NOT_RUN", httpStatus: null, observedContentLength: null },
  ggufDownload: { loaded: 0, total: CPU_MODEL_BYTES, observed: false, complete: false },
  inferenceTiming: {
    kind: null,
    watchdogMs: FIRST_CONTENT_TOKEN_WATCHDOG_MS,
    requestToStreamMs: null,
    requestToFirstChunkMs: null,
    requestToFirstContentTokenMs: null,
    requestToCompletionEndMs: null,
    watchdogFired: false,
    watchdogElapsedMs: null
  },
  versions: {
    primary: "webllm@0.2.85",
    fallback: "wllama@3.6.0",
    modelRevision: CPU_MODEL_REVISION
  },
  events: []
};
let diagnosticSequence = 0;

function sanitizeDiagnosticMessage(error) {
  const raw = String(error?.message || error || "Unknown error")
    .replace(/\s+/g, " ")
    .trim();
  return raw
    .replace(/(https?:\/\/[^\s?"']+)\?[^\s"']*/gi, "$1?[redacted]")
    .slice(0, 500);
}

function diagnosticError(error) {
  return {
    name: String(error?.name || "Error").slice(0, 80),
    message: sanitizeDiagnosticMessage(error)
  };
}

function formatDiagnosticMs(value) {
  return Number.isFinite(value) ? `${value} ms` : "n/a";
}

function buildDiagnosticReport() {
  const primary = diagnosticState.primaryFailure;
  const fallback = diagnosticState.fallbackFailure;
  const lines = [
    "Native Chat local diagnostic v2",
    "No prompt or conversation content is included.",
    `Runtime release: ${diagnosticState.runtimeReleaseId}`,
    `Attempt: ${diagnosticState.attempt}`,
    `Active backend: ${diagnosticState.activeBackend}`,
    `Active stage: ${diagnosticState.activeStage}`,
    `Last passed stage: ${diagnosticState.lastPassedStage || "none"}`,
    `First failed stage: ${diagnosticState.firstFailedStage || "none"}`,
    `Active module source: ${diagnosticState.activeModuleSource || "none"}`,
    `Failure chain: ${diagnosticState.failureChain.length ? diagnosticState.failureChain.map((item) => `${item.code}@${item.stage}`).join(" -> ") : "none"}`,
    `WebGPU: ${diagnosticState.webgpuState}`,
    `Primary: ${diagnosticState.versions.primary}`,
    `Fallback: ${diagnosticState.versions.fallback}`,
    `Fallback model revision: ${diagnosticState.versions.modelRevision}`,
    `Primary failure: ${primary ? `${primary.code} @ ${primary.stage} | ${primary.error.name}: ${primary.error.message}` : "none"}`,
    `Fallback failure: ${fallback ? `${fallback.code} @ ${fallback.stage} | ${fallback.error.name}: ${fallback.error.message}` : "none"}`,
    `WASM probe: ${diagnosticState.wasmProbe.status} | HTTP ${diagnosticState.wasmProbe.httpStatus ?? "n/a"} | bytes ${diagnosticState.wasmProbe.bytes ?? "n/a"}`,
    `GGUF HEAD: ${diagnosticState.ggufProbe.status} | HTTP ${diagnosticState.ggufProbe.httpStatus ?? "n/a"} | content-length ${diagnosticState.ggufProbe.observedContentLength ?? "n/a"}`,
    `GGUF progress: ${diagnosticState.ggufDownload.loaded} / ${diagnosticState.ggufDownload.total}`,
    `Inference kind: ${diagnosticState.inferenceTiming.kind || "none"}`,
    `Inference timing: request→stream ${formatDiagnosticMs(diagnosticState.inferenceTiming.requestToStreamMs)} | request→first chunk ${formatDiagnosticMs(diagnosticState.inferenceTiming.requestToFirstChunkMs)} | request→first content ${formatDiagnosticMs(diagnosticState.inferenceTiming.requestToFirstContentTokenMs)} | request→completion ${formatDiagnosticMs(diagnosticState.inferenceTiming.requestToCompletionEndMs)}`,
    `First-content watchdog: ${diagnosticState.inferenceTiming.watchdogMs} ms | fired ${diagnosticState.inferenceTiming.watchdogFired ? "yes" : "no"} | elapsed ${formatDiagnosticMs(diagnosticState.inferenceTiming.watchdogElapsedMs)}`,
    "",
    "CPU module transport attempts:",
    ...diagnosticState.moduleImportAttempts.map((attempt) =>
      `${attempt.sourceId} | probe=${attempt.probeResult} HTTP ${attempt.probeHttpStatus ?? "n/a"} | type=${attempt.contentType || "n/a"} | bytes=${attempt.probeBytes ?? "n/a"} | import=${attempt.importResult}${attempt.error ? ` | ${attempt.error.name}: ${attempt.error.message}` : ""}`
    ),
    "",
    "Event trace:"
  ];
  for (const event of diagnosticState.events) {
    let line = `#${event.seq} ${event.backend} ${event.stage} ${event.result}`;
    if (event.code) line += ` ${event.code}`;
    if (event.error) line += ` | ${event.error.name}: ${event.error.message}`;
    if (event.details) line += ` | ${JSON.stringify(event.details)}`;
    lines.push(line);
  }
  return lines.join("\n");
}

function renderDiagnostic() {
  document.documentElement.dataset.nativeChatDiagnosticStage = diagnosticState.activeStage;
  document.documentElement.dataset.nativeChatDiagnosticBackend = diagnosticState.activeBackend;
  document.documentElement.dataset.nativeChatDiagnosticLastPass = diagnosticState.lastPassedStage || "";
  document.documentElement.dataset.nativeChatDiagnosticFirstFail = diagnosticState.firstFailedStage || "";
  if (diagnosticState.activeModuleSource) {
    document.documentElement.dataset.nativeChatDiagnosticModuleSource = diagnosticState.activeModuleSource;
  } else {
    delete document.documentElement.dataset.nativeChatDiagnosticModuleSource;
  }
  if (diagnosticState.fallbackFailure?.code || diagnosticState.primaryFailure?.code) {
    document.documentElement.dataset.nativeChatDiagnosticCode =
      diagnosticState.fallbackFailure?.code || diagnosticState.primaryFailure?.code;
  } else {
    delete document.documentElement.dataset.nativeChatDiagnosticCode;
  }
  if (els.diagnosticReport) {
    els.diagnosticReport.textContent = buildDiagnosticReport();
  }
}

function recordDiagnostic(stage, options = {}) {
  const backend = options.backend || diagnosticState.activeBackend || "none";
  diagnosticState.activeStage = stage;
  diagnosticState.activeBackend = backend;
  const event = {
    seq: ++diagnosticSequence,
    stage,
    backend,
    result: options.result || "ENTER"
  };
  if (options.code) event.code = options.code;
  if (options.error) event.error = diagnosticError(options.error);
  if (options.details) event.details = options.details;
  if (event.result === "PASS") diagnosticState.lastPassedStage = stage;
  if (event.result === "FAIL") {
    if (!diagnosticState.firstFailedStage) diagnosticState.firstFailedStage = stage;
    if (event.code) {
      diagnosticState.failureChain.push({ backend, stage, code: event.code });
      if (diagnosticState.failureChain.length > 8) diagnosticState.failureChain.shift();
    }
  }
  diagnosticState.events.push(event);
  if (diagnosticState.events.length > 48) diagnosticState.events.shift();
  renderDiagnostic();
}

function stageFailureCode(backend, stage, error) {
  const text = `${error?.name || ""} ${error?.message || error || ""}`.toLowerCase();
  if (/out of memory|\\boom\\b|memory limit|allocation|arraybuffer|cannot allocate/.test(text)) {
    return "INSUFFICIENT_MEMORY_OR_RESOURCE_LIMIT";
  }
  const exact = {
    WEBLLM_MODULE_IMPORT: "WEBLLM_MODULE_IMPORT_FAILED",
    WEBLLM_ENGINE_INIT: "WEBLLM_ENGINE_INIT_FAILED",
    CPU_MODULE_PROBE: "CPU_MODULE_PROBE_FAILED",
    CPU_MODULE_IMPORT: "CPU_MODULE_IMPORT_FAILED",
    CPU_WASM_FETCH: "CPU_WASM_FETCH_FAILED",
    CPU_ENGINE_CONSTRUCT: "CPU_ENGINE_CONSTRUCT_FAILED",
    CPU_GGUF_DOWNLOAD: "CPU_GGUF_DOWNLOAD_FAILED",
    CPU_GGUF_DOWNLOAD_COMPLETE: "CPU_MODEL_LOAD_FAILED",
    CPU_MODEL_LOAD: "CPU_MODEL_LOAD_FAILED",
    FIRST_INFERENCE: "FIRST_INFERENCE_FAILED",
    GENERATION: "GENERATION_FAILED",
    INFERENCE_REQUEST_SENT: "INFERENCE_REQUEST_FAILED",
    STREAM_OPENED: "INFERENCE_STREAM_FAILED",
    FIRST_CHUNK: "FIRST_CHUNK_FAILED",
    FIRST_CONTENT_TOKEN_WAIT: "FIRST_CONTENT_TOKEN_STALLED",
    FIRST_CONTENT_TOKEN: "FIRST_CONTENT_TOKEN_FAILED",
    COMPLETION_END: "COMPLETION_END_FAILED"
  };
  return exact[stage] || (backend === "webllm" ? "WEBLLM_UNKNOWN_FAILURE" : "CPU_FALLBACK_UNKNOWN_FAILURE");
}

function recordBackendFailure(kind, error) {
  const failure = {
    stage: diagnosticState.activeStage,
    code: stageFailureCode(diagnosticState.activeBackend, diagnosticState.activeStage, error),
    error: diagnosticError(error)
  };
  if (kind === "primary") diagnosticState.primaryFailure = failure;
  if (kind === "fallback") diagnosticState.fallbackFailure = failure;
  recordDiagnostic(failure.stage, {
    backend: diagnosticState.activeBackend,
    result: "FAIL",
    code: failure.code,
    error
  });
  return failure;
}

function resetDiagnosticAttempt() {
  diagnosticState.attempt += 1;
  diagnosticState.primaryFailure = null;
  diagnosticState.fallbackFailure = null;
  diagnosticState.activeModuleSource = null;
  diagnosticState.firstFailedStage = null;
  diagnosticState.lastPassedStage = "PAGE_BOOT";
  diagnosticState.failureChain = [];
  diagnosticState.moduleImportAttempts = [];
  diagnosticState.wasmProbe = { status: "NOT_RUN", httpStatus: null, bytes: null };
  diagnosticState.ggufProbe = { status: "NOT_RUN", httpStatus: null, observedContentLength: null };
  diagnosticState.ggufDownload = { loaded: 0, total: CPU_MODEL_BYTES, observed: false, complete: false };
  diagnosticState.events = [];
  diagnosticSequence = 0;
  recordDiagnostic("PAGE_BOOT", { backend: "none", result: "ATTEMPT_START" });
}

function resetInferenceTiming(kind) {
  diagnosticState.inferenceTiming = {
    kind,
    watchdogMs: FIRST_CONTENT_TOKEN_WATCHDOG_MS,
    requestToStreamMs: null,
    requestToFirstChunkMs: null,
    requestToFirstContentTokenMs: null,
    requestToCompletionEndMs: null,
    watchdogFired: false,
    watchdogElapsedMs: null
  };
}

function inferenceElapsedMs(startedAt) {
  return Math.max(0, Math.round(performance.now() - startedAt));
}

async function copyDiagnosticReport() {
  const report = buildDiagnosticReport();
  try {
    await navigator.clipboard.writeText(report);
    els.copyDiagnostic.textContent = "Copied";
  } catch (error) {
    const temp = document.createElement("textarea");
    temp.value = report;
    temp.setAttribute("readonly", "");
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.append(temp);
    temp.select();
    const copied = document.execCommand("copy");
    temp.remove();
    els.copyDiagnostic.textContent = copied ? "Copied" : "Copy unavailable";
  }
  window.setTimeout(() => {
    els.copyDiagnostic.textContent = "Copy diagnostic report";
  }, 1800);
}

function setStatus(element, text, kind) {
  element.textContent = text;
  element.classList.toggle("bad", kind === "bad");
  element.classList.toggle("muted", kind === "muted");
}

function setReadyState(ready) {
  els.prompt.disabled = !ready;
  els.send.disabled = !ready || generating;
  els.reset.disabled = !ready;
  els.stop.disabled = !generating;
  const backendLabel = activeBackend === "wllama-cpu" ? "CPU/WASM fallback" : "WebGPU";
  els.composerNote.textContent = ready
    ? `${backendLabel} is active in this tab. Public Talk has no repository execution authority.`
    : "Load the local AI to begin.";
}

function addMessage(role, text, streaming) {
  const article = document.createElement("article");
  article.className = "message " + role + (streaming ? " streaming" : "");
  const speaker = document.createElement("p");
  speaker.className = "speaker";
  speaker.textContent = role === "user" ? "You" : "On Your Side";
  const body = document.createElement("div");
  body.className = "message-body";
  body.textContent = text;
  article.append(speaker, body);
  els.transcript.append(article);
  els.transcript.scrollTop = els.transcript.scrollHeight;
  return { article, body };
}

function resetTranscript() {
  els.transcript.replaceChildren();
  addMessage(
    "assistant",
    "Ready for a new local conversation. I can help you understand, organize, compare, draft, or identify a next step.",
    false
  );
}

async function inspectDevice() {
  recordDiagnostic("WEBGPU_PROBE", { backend: "webllm" });
  if (!("gpu" in navigator)) {
    webgpuAvailable = false;
    diagnosticState.webgpuState = "UNAVAILABLE";
    recordDiagnostic("WEBGPU_PROBE", { backend: "webllm", result: "FAIL", code: "WEBGPU_UNAVAILABLE" });
    setStatus(els.deviceStatus, "WebGPU unavailable · CPU fallback ready", "muted");
    document.querySelector("#load-copy").textContent =
      "This browser cannot use the GPU backend. Native Chat can fall back to a CPU/WASM local model when you load the AI.";
    return false;
  }
  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      webgpuAvailable = false;
      diagnosticState.webgpuState = "NO_ADAPTER";
      recordDiagnostic("WEBGPU_PROBE", { backend: "webllm", result: "FAIL", code: "WEBGPU_ADAPTER_UNAVAILABLE" });
      setStatus(els.deviceStatus, "No WebGPU adapter · CPU fallback ready", "muted");
      document.querySelector("#load-copy").textContent =
        "No usable WebGPU adapter was found. Native Chat can fall back to CPU/WASM local inference.";
      return false;
    }
    webgpuAvailable = true;
    diagnosticState.webgpuState = "AVAILABLE";
    recordDiagnostic("WEBGPU_PROBE", { backend: "webllm", result: "PASS" });
    setStatus(els.deviceStatus, "WebGPU available", "good");
    return true;
  } catch (error) {
    console.error("WebGPU inspection failed", error);
    webgpuAvailable = false;
    diagnosticState.webgpuState = "PROBE_FAILED";
    recordDiagnostic("WEBGPU_PROBE", { backend: "webllm", result: "FAIL", code: "WEBGPU_PROBE_FAILED", error });
    setStatus(els.deviceStatus, "WebGPU check failed · CPU fallback ready", "muted");
    return false;
  }
}

function classifyLocalError(error, backend, stage = diagnosticState.activeStage) {
  const text = `${error?.name || ""} ${error?.message || error || ""}`.toLowerCase();
  if (/out of memory|\\boom\\b|memory limit|allocation|arraybuffer|cannot allocate/.test(text)) {
    return "INSUFFICIENT_MEMORY_OR_RESOURCE_LIMIT";
  }
  if (
    stage === "CPU_MODULE_PROBE" ||
    stage === "CPU_MODULE_IMPORT" ||
    stage === "CPU_WASM_FETCH" ||
    stage === "CPU_GGUF_DOWNLOAD" ||
    /fetch|network|cors|download|integrity|sha-?256/.test(text)
  ) {
    return "MODEL_FETCH_OR_INTEGRITY_FAILURE";
  }
  if (backend === "webllm" && /device.*lost|lost.*device|webgpu|gpu device|shader|validation error|internal error/.test(text)) {
    return "GPU_DEVICE_LOST_OR_BACKEND_INCOMPATIBLE";
  }
  if (backend === "wllama-cpu") return "CPU_WASM_INITIALIZATION_FAILED";
  return "WEBLLM_INITIALIZATION_FAILED";
}

function describeLocalError(code) {
  const descriptions = {
    WEBGPU_UNAVAILABLE: "WebGPU is unavailable",
    WEBGPU_ADAPTER_UNAVAILABLE: "No usable WebGPU adapter is available",
    WEBLLM_INITIALIZATION_FAILED: "The WebGPU model backend could not initialize",
    GPU_DEVICE_LOST_OR_BACKEND_INCOMPATIBLE: "The GPU backend became unavailable during model startup",
    MODEL_FETCH_OR_INTEGRITY_FAILURE: "A local-model asset could not be downloaded or validated",
    CPU_WASM_INITIALIZATION_FAILED: "The CPU/WASM fallback could not initialize",
    INSUFFICIENT_MEMORY_OR_RESOURCE_LIMIT: "This device does not have enough available memory for the local model",
    UNKNOWN_LOCAL_BACKEND_FAILURE: "The local model could not initialize"
  };
  return descriptions[code] || descriptions.UNKNOWN_LOCAL_BACKEND_FAILURE;
}

async function loadWebLlmPrimary() {
  recordDiagnostic("WEBLLM_MODULE_IMPORT", { backend: "webllm" });
  const webllm = await import(WEBLLM_MODULE);
  recordDiagnostic("WEBLLM_MODULE_IMPORT", { backend: "webllm", result: "PASS" });
  const appConfig = {
    cacheBackend: "cache",
    model_list: [{
      model: MODEL_URL,
      model_id: MODEL_ID,
      model_lib: MODEL_LIB_URL,
      vram_required_MB: 944.62,
      low_resource_required: true,
      overrides: { context_window_size: 4096 },
      integrity: INTEGRITY
    }]
  };

  recordDiagnostic("WEBLLM_ENGINE_INIT", { backend: "webllm" });
  const localEngine = await webllm.CreateMLCEngine(MODEL_ID, {
    appConfig,
    initProgressCallback: (report) => {
      if (typeof report.progress === "number" && Number.isFinite(report.progress)) {
        els.progress.value = Math.max(0, Math.min(1, report.progress));
      }
      if (report.text) els.progressText.textContent = report.text;
    },
    logLevel: "WARN"
  });
  recordDiagnostic("WEBLLM_ENGINE_INIT", { backend: "webllm", result: "PASS" });
  return localEngine;
}

async function importWllamaModule() {
  let lastError = null;

  for (const source of WLLAMA_MODULE_SOURCES) {
    const attempt = {
      sourceId: source.id,
      host: new URL(source.url).host,
      probeResult: "NOT_RUN",
      probeHttpStatus: null,
      contentType: null,
      probeBytes: null,
      importResult: "NOT_RUN",
      error: null
    };
    diagnosticState.moduleImportAttempts.push(attempt);
    diagnosticState.activeModuleSource = source.id;

    recordDiagnostic("CPU_MODULE_PROBE", {
      backend: "wllama-cpu",
      result: "ENTER",
      details: { sourceId: source.id, host: attempt.host }
    });

    try {
      const response = await fetch(source.url, { cache: "force-cache" });
      attempt.probeHttpStatus = response.status;
      attempt.contentType = response.headers.get("content-type");
      if (!response.ok) throw new Error(`WLLAMA_MODULE_HTTP_${response.status}`);
      const bytes = await response.arrayBuffer();
      attempt.probeBytes = bytes.byteLength;
      attempt.probeResult = "PASS";
      recordDiagnostic("CPU_MODULE_PROBE", {
        backend: "wllama-cpu",
        result: "PASS",
        details: {
          sourceId: source.id,
          httpStatus: response.status,
          contentType: attempt.contentType,
          bytes: attempt.probeBytes
        }
      });
    } catch (error) {
      attempt.probeResult = "FAIL";
      attempt.error = diagnosticError(error);
      lastError = error;
      recordDiagnostic("CPU_MODULE_PROBE", {
        backend: "wllama-cpu",
        result: "WARN",
        code: "CPU_MODULE_SOURCE_PROBE_FAILED",
        error,
        details: { sourceId: source.id, httpStatus: attempt.probeHttpStatus }
      });
      continue;
    }

    recordDiagnostic("CPU_MODULE_IMPORT", {
      backend: "wllama-cpu",
      result: "ENTER",
      details: { sourceId: source.id }
    });

    try {
      const module = await import(source.url);
      const wllamaExportValid = typeof module.Wllama === "function";
      const loggerExportValid = module.LoggerWithoutDebug != null;
      if (!wllamaExportValid || !loggerExportValid) {
        throw new Error("WLLAMA_REQUIRED_EXPORTS_MISSING");
      }
      attempt.importResult = "PASS";
      recordDiagnostic("CPU_MODULE_IMPORT", {
        backend: "wllama-cpu",
        result: "PASS",
        details: {
          sourceId: source.id,
          Wllama: wllamaExportValid,
          LoggerWithoutDebug: loggerExportValid
        }
      });
      return module;
    } catch (error) {
      attempt.importResult = "FAIL";
      attempt.error = diagnosticError(error);
      lastError = error;
      recordDiagnostic("CPU_MODULE_IMPORT", {
        backend: "wllama-cpu",
        result: "WARN",
        code: "CPU_MODULE_SOURCE_IMPORT_FAILED",
        error,
        details: { sourceId: source.id }
      });
    }
  }

  diagnosticState.activeModuleSource = null;
  throw lastError || new Error("WLLAMA_MODULE_TRANSPORT_EXHAUSTED");
}

async function loadCpuFallback(primaryFailureCode) {
  setStatus(els.deviceStatus, "CPU/WASM fallback starting", "muted");
  setStatus(els.modelStatus, "Loading CPU local model…", "muted");
  els.progress.value = 0;
  els.progressText.textContent =
    `${describeLocalError(primaryFailureCode)}. Switching to the CPU/WASM fallback (~398 MB model download on first use)…`;

  const { Wllama, LoggerWithoutDebug } = await importWllamaModule();

  recordDiagnostic("CPU_WASM_FETCH", { backend: "wllama-cpu" });
  const wasmResponse = await fetch(WLLAMA_WASM_URL, { cache: "force-cache" });
  diagnosticState.wasmProbe.httpStatus = wasmResponse.status;
  if (!wasmResponse.ok) {
    diagnosticState.wasmProbe.status = "FAIL";
    throw new Error(`WLLAMA_WASM_HTTP_${wasmResponse.status}`);
  }
  const wasmBuffer = await wasmResponse.arrayBuffer();
  diagnosticState.wasmProbe = {
    status: "PASS",
    httpStatus: wasmResponse.status,
    bytes: wasmBuffer.byteLength
  };
  recordDiagnostic("CPU_WASM_FETCH", {
    backend: "wllama-cpu",
    result: "PASS",
    details: { httpStatus: wasmResponse.status, bytes: wasmBuffer.byteLength }
  });

  recordDiagnostic("CPU_ENGINE_CONSTRUCT", { backend: "wllama-cpu" });
  const cpuEngine = new Wllama(
    { default: WLLAMA_WASM_URL },
    { parallelDownloads: 3, logger: LoggerWithoutDebug }
  );
  if (typeof cpuEngine.setCompat === "function") cpuEngine.setCompat(null);
  recordDiagnostic("CPU_ENGINE_CONSTRUCT", { backend: "wllama-cpu", result: "PASS" });

  console.info("Native Chat CPU fallback identity", {
    runtime: "wllama@3.6.0",
    modelRevision: CPU_MODEL_REVISION,
    modelSha256: CPU_MODEL_SHA256,
    nGpuLayers: 0
  });

  recordDiagnostic("CPU_GGUF_HEAD_PROBE", { backend: "wllama-cpu" });
  try {
    const probe = await fetch(CPU_MODEL_URL, { method: "HEAD", cache: "no-store" });
    const observedContentLength = Number(probe.headers.get("content-length")) || null;
    diagnosticState.ggufProbe = {
      status: probe.ok ? "PASS" : "HTTP_ERROR",
      httpStatus: probe.status,
      observedContentLength
    };
    recordDiagnostic("CPU_GGUF_HEAD_PROBE", {
      backend: "wllama-cpu",
      result: probe.ok ? "PASS" : "WARN",
      details: { httpStatus: probe.status, observedContentLength }
    });
  } catch (error) {
    diagnosticState.ggufProbe = {
      status: "UNAVAILABLE_CONTINUING",
      httpStatus: null,
      observedContentLength: null
    };
    recordDiagnostic("CPU_GGUF_HEAD_PROBE", {
      backend: "wllama-cpu",
      result: "WARN",
      error
    });
  }

  recordDiagnostic("CPU_MODEL_LOAD", { backend: "wllama-cpu" });
  await cpuEngine.loadModelFromUrl(CPU_MODEL_URL, {
    n_ctx: 2048,
    n_threads: 1,
    n_gpu_layers: 0,
    progressCallback: ({ loaded, total }) => {
      if (Number.isFinite(loaded) && Number.isFinite(total) && total > 0) {
        if (!diagnosticState.ggufDownload.observed) {
          diagnosticState.ggufDownload.observed = true;
          recordDiagnostic("CPU_GGUF_DOWNLOAD", {
            backend: "wllama-cpu",
            result: "START",
            details: { loaded, total }
          });
        }
        diagnosticState.ggufDownload.loaded = loaded;
        diagnosticState.ggufDownload.total = total;
        els.progress.value = Math.max(0, Math.min(1, loaded / total));
        els.progressText.textContent =
          `Loading CPU fallback model… ${Math.round((loaded / total) * 100)}%`;
        if (loaded >= total && !diagnosticState.ggufDownload.complete) {
          diagnosticState.ggufDownload.complete = true;
          recordDiagnostic("CPU_GGUF_DOWNLOAD_COMPLETE", {
            backend: "wllama-cpu",
            result: "PASS",
            details: { loaded, total }
          });
          recordDiagnostic("CPU_MODEL_LOAD", { backend: "wllama-cpu", result: "RESUME" });
        } else {
          renderDiagnostic();
        }
      }
    }
  });
  recordDiagnostic("CPU_MODEL_READY", { backend: "wllama-cpu", result: "PASS" });
  return cpuEngine;
}

async function loadModel() {
  if (engine || loading) return;
  resetDiagnosticAttempt();
  loading = true;
  els.loadButton.disabled = true;
  els.progressWrap.hidden = false;
  setStatus(els.modelStatus, "Preparing local model…", "muted");
  els.progress.value = 0;
  els.progressText.textContent = "Checking local inference backends…";
  setReadyState(false);

  let primaryFailureCode = webgpuAvailable === false ? "WEBGPU_UNAVAILABLE" : null;

  try {
    if (webgpuAvailable === null) await inspectDevice();

    if (webgpuAvailable) {
      try {
        setStatus(els.modelStatus, "Loading WebGPU local model…", "muted");
        els.progressText.textContent = "Loading WebLLM runtime…";
        engine = await loadWebLlmPrimary();
        activeBackend = "webllm";
        els.progress.value = 1;
        els.progressText.textContent = "WebGPU local model ready.";
        setStatus(els.modelStatus, "Local model ready · WebGPU", "good");
        els.loadButton.textContent = "Loaded";
        setReadyState(true);
        els.prompt.focus();
        return;
      } catch (error) {
        primaryFailureCode = classifyLocalError(error, "webllm", diagnosticState.activeStage);
        const primaryFailure = recordBackendFailure("primary", error);
        console.error("Native Chat WebLLM primary failed", primaryFailureCode, primaryFailure.code, error);
        engine = null;
        activeBackend = null;
      }
    } else if (!primaryFailureCode) {
      primaryFailureCode = "WEBGPU_ADAPTER_UNAVAILABLE";
    }

    try {
      engine = await loadCpuFallback(primaryFailureCode || "WEBLLM_INITIALIZATION_FAILED");
      activeBackend = "wllama-cpu";
      els.progress.value = 1;
      els.progressText.textContent = "CPU/WASM local model ready.";
      setStatus(els.deviceStatus, "CPU/WASM fallback active", "good");
      setStatus(els.modelStatus, "Local model ready · CPU", "good");
      els.loadButton.textContent = "Loaded";
      setReadyState(true);
      els.prompt.focus();
    } catch (error) {
      const fallbackFailureCode = classifyLocalError(error, "wllama-cpu", diagnosticState.activeStage);
      const fallbackFailure = recordBackendFailure("fallback", error);
      console.error("Native Chat CPU fallback failed", fallbackFailureCode, fallbackFailure.code, error);
      engine = null;
      activeBackend = null;
      setStatus(els.modelStatus, "Local model unavailable", "bad");
      els.progressText.textContent =
        `${describeLocalError(fallbackFailureCode)}. Diagnostic: ${fallbackFailure.code} at ${fallbackFailure.stage}. Neither local backend started successfully. No prompt was sent to a hosted model API.`;
      if (els.diagnosticDetails) els.diagnosticDetails.open = true;
      renderDiagnostic();
      els.loadButton.disabled = false;
      els.loadButton.textContent = "Try Again";
      setReadyState(false);
    }
  } finally {
    loading = false;
  }
}

async function createBackendStream(requestMessages) {
  if (activeBackend === "webllm") {
    return await engine.chat.completions.create({
      messages: requestMessages,
      stream: true,
      temperature: 0.65,
      top_p: 0.9,
      max_tokens: 420
    });
  }
  if (activeBackend === "wllama-cpu") {
    activeAbortController = new AbortController();
    return await engine.createChatCompletion({
      messages: requestMessages,
      stream: true,
      temperature: 0.65,
      top_p: 0.9,
      max_tokens: 420,
      abortSignal: activeAbortController.signal
    });
  }
  throw new Error("UNKNOWN_LOCAL_BACKEND_FAILURE");
}

function interruptBackend() {
  if (activeBackend === "webllm") {
    engine.interruptGenerate();
    return;
  }
  if (activeBackend === "wllama-cpu") {
    activeAbortController?.abort();
    return;
  }
  throw new Error("UNKNOWN_LOCAL_BACKEND_FAILURE");
}

async function sendMessage(text) {
  if (!engine || generating) return;
  const clean = text.trim();
  if (!clean) return;

  addMessage("user", clean, false);
  messages.push({ role: "user", content: clean });
  els.prompt.value = "";

  const assistant = addMessage("assistant", "", true);
  generating = true;
  stopRequested = false;
  els.chatShell.setAttribute("aria-busy", "true");
  els.send.disabled = true;
  els.stop.disabled = false;
  els.reset.disabled = true;
  els.prompt.disabled = true;
  els.composerNote.textContent = "Generating locally on this device…";

  let reply = "";
  const inferenceKind = firstInferenceCompleted ? "GENERATION" : "FIRST_INFERENCE";
  const inferenceStartedAt = performance.now();
  let firstChunkObserved = false;
  let firstContentTokenObserved = false;
  let firstTokenWatchdog = null;
  resetInferenceTiming(inferenceKind);

  try {
    const requestMessages = [messages[0], ...messages.slice(1).slice(-10)];
    recordDiagnostic("INFERENCE_REQUEST_SENT", {
      backend: activeBackend || "none",
      result: "PASS",
      details: { kind: inferenceKind, watchdogMs: FIRST_CONTENT_TOKEN_WATCHDOG_MS }
    });

    firstTokenWatchdog = window.setTimeout(() => {
      if (!generating || stopRequested || firstContentTokenObserved) return;
      const elapsedMs = inferenceElapsedMs(inferenceStartedAt);
      diagnosticState.inferenceTiming.watchdogFired = true;
      diagnosticState.inferenceTiming.watchdogElapsedMs = elapsedMs;
      recordDiagnostic("FIRST_CONTENT_TOKEN_WAIT", {
        backend: activeBackend || "none",
        result: "WARN",
        code: "FIRST_CONTENT_TOKEN_WATCHDOG",
        details: {
          kind: inferenceKind,
          elapsedMs,
          watchdogMs: FIRST_CONTENT_TOKEN_WATCHDOG_MS
        }
      });
      if (els.diagnosticDetails) els.diagnosticDetails.open = true;
      els.composerNote.textContent =
        "First local token is taking longer than expected. Diagnostic timing captured; generation is still running.";
    }, FIRST_CONTENT_TOKEN_WATCHDOG_MS);

    const stream = await createBackendStream(requestMessages);
    const streamElapsedMs = inferenceElapsedMs(inferenceStartedAt);
    diagnosticState.inferenceTiming.requestToStreamMs = streamElapsedMs;
    recordDiagnostic("STREAM_OPENED", {
      backend: activeBackend || "none",
      result: "PASS",
      details: { kind: inferenceKind, elapsedMs: streamElapsedMs }
    });

    for await (const chunk of stream) {
      if (!firstChunkObserved) {
        firstChunkObserved = true;
        const firstChunkElapsedMs = inferenceElapsedMs(inferenceStartedAt);
        diagnosticState.inferenceTiming.requestToFirstChunkMs = firstChunkElapsedMs;
        recordDiagnostic("FIRST_CHUNK", {
          backend: activeBackend || "none",
          result: "PASS",
          details: { kind: inferenceKind, elapsedMs: firstChunkElapsedMs }
        });
      }

      const delta = chunk.choices?.[0]?.delta?.content || "";
      if (delta) {
        if (!firstContentTokenObserved) {
          firstContentTokenObserved = true;
          if (firstTokenWatchdog !== null) {
            window.clearTimeout(firstTokenWatchdog);
            firstTokenWatchdog = null;
          }
          const firstContentElapsedMs = inferenceElapsedMs(inferenceStartedAt);
          diagnosticState.inferenceTiming.requestToFirstContentTokenMs = firstContentElapsedMs;
          recordDiagnostic("FIRST_CONTENT_TOKEN", {
            backend: activeBackend || "none",
            result: "PASS",
            details: { kind: inferenceKind, elapsedMs: firstContentElapsedMs }
          });
        }
        reply += delta;
        assistant.body.textContent = reply;
        els.transcript.scrollTop = els.transcript.scrollHeight;
      }
    }

    if (firstTokenWatchdog !== null) {
      window.clearTimeout(firstTokenWatchdog);
      firstTokenWatchdog = null;
    }
    const completionElapsedMs = inferenceElapsedMs(inferenceStartedAt);
    diagnosticState.inferenceTiming.requestToCompletionEndMs = completionElapsedMs;

    if (reply.trim()) {
      recordDiagnostic("COMPLETION_END", {
        backend: activeBackend || "none",
        result: "PASS",
        details: { kind: inferenceKind, elapsedMs: completionElapsedMs }
      });
      messages.push({ role: "assistant", content: reply });
      firstInferenceCompleted = true;
    } else if (!stopRequested) {
      const noContentError = new Error("Completion ended without a content token.");
      recordDiagnostic("COMPLETION_END", {
        backend: activeBackend || "none",
        result: "FAIL",
        code: "COMPLETION_ENDED_WITHOUT_CONTENT",
        error: noContentError,
        details: {
          kind: inferenceKind,
          elapsedMs: completionElapsedMs,
          firstChunkObserved
        }
      });
      if (els.diagnosticDetails) els.diagnosticDetails.open = true;
      assistant.body.textContent = "I did not produce a response. Try rephrasing the request.";
    }
  } catch (error) {
    if (firstTokenWatchdog !== null) {
      window.clearTimeout(firstTokenWatchdog);
      firstTokenWatchdog = null;
    }
    console.error("Native Chat generation failed", error);
    recordDiagnostic(diagnosticState.activeStage, {
      backend: activeBackend || "none",
      result: stopRequested ? "STOPPED" : "FAIL",
      code: stopRequested ? "GENERATION_STOPPED" : stageFailureCode(activeBackend || "none", diagnosticState.activeStage, error),
      error,
      details: { kind: inferenceKind, elapsedMs: inferenceElapsedMs(inferenceStartedAt) }
    });
    if (!stopRequested && els.diagnosticDetails) els.diagnosticDetails.open = true;
    if (stopRequested) {
      if (!reply.trim()) assistant.body.textContent = "Generation stopped.";
      if (reply.trim()) messages.push({ role: "assistant", content: reply });
    } else {
      assistant.body.textContent =
        "The local generation stopped unexpectedly. Your prompt was not sent to a hosted model API.";
    }
  } finally {
    if (firstTokenWatchdog !== null) window.clearTimeout(firstTokenWatchdog);
    assistant.article.classList.remove("streaming");
    generating = false;
    stopRequested = false;
    activeAbortController = null;
    els.chatShell.setAttribute("aria-busy", "false");
    els.prompt.disabled = false;
    els.send.disabled = false;
    els.stop.disabled = true;
    els.reset.disabled = false;
    els.composerNote.textContent =
      "Conversation stays in this tab. Public Talk has no repository execution authority.";
    els.prompt.focus();
  }
}

els.loadButton.addEventListener("click", loadModel);

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(els.prompt.value);
});

els.prompt.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    if (!els.send.disabled) els.form.requestSubmit();
  }
});

els.stop.addEventListener("click", () => {
  if (!engine || !generating) return;
  stopRequested = true;
  try {
    interruptBackend();
  } catch (error) {
    console.error("Native Chat interrupt failed", error);
  }
});

els.reset.addEventListener("click", () => {
  if (generating) return;
  messages = [{ role: "system", content: SYSTEM_MESSAGE }];
  resetTranscript();
  els.prompt.value = "";
  els.prompt.focus();
});

els.copyDiagnostic?.addEventListener("click", copyDiagnosticReport);

recordDiagnostic("PAGE_BOOT", { backend: "none", result: "PASS" });
setReadyState(false);
inspectDevice();
