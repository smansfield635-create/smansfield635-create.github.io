const INDEX_URL = "/products/on-your-side-ai/native-chat/integrity-index/index.v1.json";
const CONTRACT_ID = "DG_NATIVE_CHAT_EVIDENCE_ANSWER_CONTRACT_v1";
const FIRST_PARTY_SITE_CONTRACT_ID = "DG_NATIVE_CHAT_FIRST_PARTY_SITE_CONTRACT_v1";
const GPU_SHADER_CLASSIFICATION_ID = "DG_NATIVE_CHAT_WEBGPU_SHADER_FAILURE_CLASSIFICATION_v1";
const IDENTITY_GATE_ID = "NATIVE_CHAT_V3_VISIBLE_RUNTIME_IDENTITY_AND_CONTRACT_GATE_v1";
const OVERLAY_MODULE_ID = "answer-contract.v2.first-party-gate.js";
const SOURCE_BASE_COMMIT = "892780f0ec57ef2510eb8632751d98e2ec78ce91";
const MODEL_MANIFEST_ALIAS_ID = "DG_NATIVE_CHAT_WEBLLM_MANIFEST_ALIAS_v1";
const MODEL_MANIFEST_ROOT = "/products/on-your-side-ai/native-chat/runtime/model/Qwen2.5-0.5B-Instruct-q4f16_1-MLC/resolve/main/";
const ACCURATE_COMPOSER_NOTE = "Conversation inference stays local. Search is scored locally against the same-origin Integrity Index. No search query leaves the browser in this edition.";

function markContractLayerFailed(error) {
  const root = document.documentElement;
  const detail = error instanceof Error ? error.message : String(error || "UNKNOWN_OVERLAY_INITIALIZATION_FAILURE");
  root.dataset.nativeChatContractReady = "FAILED";
  root.dataset.nativeChatContractFailure = detail.slice(0, 240);
  setText("#runtime-identity-gate", "CONTRACT LAYER FAILED");
  setText("#runtime-identity-answer-contract", "FAILED");
  setText("#runtime-identity-first-party-contract", "FAILED");
  setText("#runtime-identity-webgpu-classifier", "FAILED");
  setText("#runtime-identity-send-gate", "LOCKED");
  const plate = document.querySelector("#runtime-identity");
  if (plate) plate.dataset.contractReady = "FAILED";
  const note = document.querySelector("#composer-note");
  if (note) note.textContent = "Contract layer failed. The page remains available; sending is locked.";
  const send = document.querySelector("#send-message");
  const prompt = document.querySelector("#prompt");
  if (send) send.disabled = true;
  if (prompt) prompt.disabled = true;
}

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function identityLines() {
  return [
    "Runtime identity gate: " + IDENTITY_GATE_ID,
    "Source base: " + SOURCE_BASE_COMMIT,
    "Overlay module: " + OVERLAY_MODULE_ID,
    "Evidence answer contract: ACTIVE | " + CONTRACT_ID,
    "First-party site contract: ACTIVE | " + FIRST_PARTY_SITE_CONTRACT_ID,
    "WebGPU shader classifier: ACTIVE | " + GPU_SHADER_CLASSIFICATION_ID,
    "Send gate: READY"
  ];
}

function setText(selector, text) {
  const node = document.querySelector(selector);
  if (node && node.textContent !== text) node.textContent = text;
}

function markContractLayerReady() {
  const root = document.documentElement;
  root.dataset.nativeChatRuntimeIdentityGate = IDENTITY_GATE_ID;
  root.dataset.nativeChatOverlayModule = OVERLAY_MODULE_ID;
  root.dataset.nativeChatOverlaySourceBase = SOURCE_BASE_COMMIT;
  root.dataset.nativeChatAnswerContract = CONTRACT_ID;
  root.dataset.nativeChatFirstPartySiteContract = FIRST_PARTY_SITE_CONTRACT_ID;
  root.dataset.nativeChatWebgpuFailureClassifier = GPU_SHADER_CLASSIFICATION_ID;
  root.dataset.nativeChatContractReady = "READY";

  setText("#runtime-identity-gate", "READY");
  setText("#runtime-identity-source-base", SOURCE_BASE_COMMIT.slice(0, 12));
  setText("#runtime-identity-overlay", OVERLAY_MODULE_ID);
  setText("#runtime-identity-answer-contract", "ACTIVE");
  setText("#runtime-identity-first-party-contract", "ACTIVE");
  setText("#runtime-identity-webgpu-classifier", "ACTIVE");
  setText("#runtime-identity-send-gate", "READY");
  setText("#runtime-identity-gate-id", IDENTITY_GATE_ID);

  const plate = document.querySelector("#runtime-identity");
  if (plate) plate.dataset.contractReady = "READY";
}

function shouldUseContract(prompt) {
  const text = normalize(prompt).toLowerCase();
  if (!text) return false;
  const asksForIndex = /\b(local integrity index|integrity index|indexed evidence|using only the evidence)\b/.test(text);
  const asksForBuild = /\b(native chat|this build|public talk|on your side aai)\b/.test(text);
  const asksForBoundaries = /\b(what it can help|what can you help|cannot access|current-world|outside the index|should do when|hold unresolved|not guess)\b/.test(text);
  return asksForIndex && asksForBuild && asksForBoundaries;
}

function shouldUseFirstPartySiteContract(prompt) {
  const text = normalize(prompt).toLowerCase();
  if (!text) return false;
  const asksAboutFirstParty = /\b(diamond\s*gate\s*bridge|diamondgatebridge\.com|on your side aai|native chat|this website|this site|this page|this build|public talk)\b/.test(text);
  const asksForDescription = /\b(what is|what are|tell me|explain|describe|about|can you tell|can you help|why did|how does|what can|role specifically)\b/.test(text);
  return asksAboutFirstParty && asksForDescription;
}

function appendMessage(role, text) {
  const transcript = document.querySelector("#transcript");
  if (!transcript) return null;
  const article = document.createElement("article");
  article.className = "message " + role + " has-content";
  const speaker = document.createElement("p");
  speaker.className = "speaker";
  speaker.textContent = role === "user" ? "You" : "Jeeves · On Your Side";
  const body = document.createElement("div");
  body.className = "message-body";
  body.textContent = text;
  article.append(speaker, body);
  transcript.append(article);
  transcript.scrollTop = transcript.scrollHeight;
  return article;
}

function appendSources(article, sources) {
  if (!article || !sources.length) return;
  const section = document.createElement("div");
  section.className = "message-sources";
  const label = document.createElement("p");
  label.className = "speaker";
  label.textContent = "Current sources";
  const list = document.createElement("ol");
  for (const source of sources) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = source.title || source.sourceIdentity || source.url;
    item.append(link);
    list.append(item);
  }
  section.append(label, list);
  article.append(section);
}

function appendContractAnswer(sources) {
  const article = appendMessage("assistant", "This is a browser-local Native Chat build for On Your Side AAI. It can help with understanding, organizing, comparing, drafting, and identifying reasonable next steps. It cannot access private repositories, credentials, private control planes, or open-web/live sources. When a current-world question falls outside the bootstrap Integrity Index, it should hold unresolved rather than guess from model memory.");
  appendSources(article, sources);
}

function appendFirstPartySiteAnswer(sources) {
  const article = appendMessage("assistant", "Yes. DiamondGateBridge.com is the first-party public site hosting this Native Chat build and the On Your Side AAI public pages. I can discuss the public site, this page, and the local build from the same-origin Integrity Index and visible page evidence. I cannot access private repositories, credentials, private control planes, unpublished files, or take repository actions from this public chat. If a requested fact is outside the first-party index or current page evidence, I should hold unresolved rather than guess.");
  appendSources(article, sources);
}

async function loadIndexSources() {
  const response = await fetch(INDEX_URL, {
    method: "GET",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
    cache: "no-store"
  });
  if (!response.ok) throw new Error("INTEGRITY_INDEX_HTTP_" + response.status);
  const index = await response.json();
  const entries = Array.isArray(index.entries) ? index.entries : [];
  return entries
    .filter(entry => /native chat|on your side|diamond gate bridge|diamondgatebridge/i.test(String(entry.title || entry.sourceIdentity || entry.url || "")))
    .slice(0, 3)
    .map(entry => ({
      title: entry.title,
      sourceIdentity: entry.sourceIdentity,
      url: entry.url
    }));
}

function setComposerNote(text = ACCURATE_COMPOSER_NOTE) {
  const note = document.querySelector("#composer-note");
  if (note && note.textContent !== text) note.textContent = text;
}

function correctComposerNote() {
  const note = document.querySelector("#composer-note");
  if (!note) return;
  if (/query may leave this tab|live evidence is required|contract layer not ready/i.test(note.textContent || "")) {
    note.textContent = ACCURATE_COMPOSER_NOTE;
  }
}

function classifyDiagnosticText(text) {
  if (/GPUPipelineError|Invalid ShaderModule|entryPoint:\s*"?index_kernel"?/i.test(text)) {
    return "GPU_SHADER_COMPATIBILITY_FAILURE";
  }
  return null;
}

function augmentDiagnosticText(text) {
  let next = String(text || "")
    .replace(/^Native Chat local diagnostic v2/m, "Native Chat diagnostic schema v2\nRuntime build: Public Talk v3")
    .replace(/^V2 timing:/m, "Evidence timing:");
  const classification = classifyDiagnosticText(next);
  if (classification && !/WebGPU failure class:/m.test(next)) {
    next = next.replace(
      /^Primary failure:/m,
      "WebGPU failure class: " + classification + " | " + GPU_SHADER_CLASSIFICATION_ID + "\nPrimary failure:"
    );
    document.documentElement.dataset.nativeChatWebgpuFailureClass = classification;
  }
  if (!/Runtime identity gate:/m.test(next)) {
    next = identityLines().join("\n") + "\n\n" + next;
  }
  return next;
}

function correctDiagnosticReport() {
  const report = document.querySelector("#diagnostic-report");
  if (!report || !report.textContent) return;
  const next = augmentDiagnosticText(report.textContent);
  if (next !== report.textContent) report.textContent = next;
}

function installDiagnosticCopyPatch() {
  const button = document.querySelector("#copy-diagnostic");
  const report = document.querySelector("#diagnostic-report");
  if (!button || !report) return;
  button.addEventListener("click", async event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const text = augmentDiagnosticText(report.textContent || "");
    report.textContent = text;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied identity receipt";
      setTimeout(() => { button.textContent = "Copy diagnostic report"; }, 1800);
    } catch {
      button.textContent = "Copy failed";
      setTimeout(() => { button.textContent = "Copy diagnostic report"; }, 1800);
    }
  }, { capture: true });
}

function installUiCorrections() {
  const note = document.querySelector("#composer-note");
  if (note) {
    const observer = new MutationObserver(correctComposerNote);
    observer.observe(note, { childList: true, characterData: true, subtree: true });
    correctComposerNote();
  }
  const report = document.querySelector("#diagnostic-report");
  if (report) {
    const observer = new MutationObserver(correctDiagnosticReport);
    observer.observe(report, { childList: true, characterData: true, subtree: true });
    correctDiagnosticReport();
  }
  installDiagnosticCopyPatch();
}

function installAnswerContract() {
  const form = document.querySelector("#composer");
  const prompt = document.querySelector("#prompt");
  if (!form || !prompt) return;
  form.addEventListener("submit", async event => {
    const text = normalize(prompt.value);
    const useIndexContract = shouldUseContract(text);
    const useFirstPartySiteContract = !useIndexContract && shouldUseFirstPartySiteContract(text);
    if (!useIndexContract && !useFirstPartySiteContract) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    appendMessage("user", text);
    prompt.value = "";
    setComposerNote(useIndexContract ? "Answering from the local Integrity Index contract…" : "Answering from the first-party site contract…");
    try {
      const sources = await loadIndexSources();
      if (useIndexContract) appendContractAnswer(sources);
      else appendFirstPartySiteAnswer(sources);
      setComposerNote();
    } catch {
      appendMessage("assistant", "I could not load the local Integrity Index for this turn, so I will hold unresolved rather than guess.");
      setComposerNote("Local Integrity Index was unavailable for that turn. No open-web request was sent.");
    }
  }, { capture: true });
}

function initializeOverlay() {
  try {
    markContractLayerReady();
    installAnswerContract();
    installUiCorrections();
  } catch (error) {
    markContractLayerFailed(error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeOverlay, { once: true });
} else {
  initializeOverlay();
}
