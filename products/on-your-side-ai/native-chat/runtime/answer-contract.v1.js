const INDEX_URL = "/products/on-your-side-ai/native-chat/integrity-index/index.v1.json";
const CONTRACT_ID = "DG_NATIVE_CHAT_EVIDENCE_ANSWER_CONTRACT_v1";
const ACCURATE_COMPOSER_NOTE = "Conversation inference stays local. Search is scored locally against the same-origin Integrity Index. No search query leaves the browser in this edition.";

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function shouldUseContract(prompt) {
  const text = normalize(prompt).toLowerCase();
  if (!text) return false;
  const asksForIndex = /\b(local integrity index|integrity index|indexed evidence|using only the evidence)\b/.test(text);
  const asksForBuild = /\b(native chat|this build|public talk|on your side aai)\b/.test(text);
  const asksForBoundaries = /\b(what it can help|what can you help|cannot access|current-world|outside the index|should do when|hold unresolved|not guess)\b/.test(text);
  return asksForIndex && asksForBuild && asksForBoundaries;
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

function appendContractAnswer(sources) {
  const article = appendMessage("assistant", "This is a browser-local Native Chat build for On Your Side AAI. It can help with understanding, organizing, comparing, drafting, and identifying reasonable next steps. It cannot access private repositories, credentials, private control planes, or open-web/live sources. When a current-world question falls outside the bootstrap Integrity Index, it should hold unresolved rather than guess from model memory.");
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
    .filter(entry => /native chat|on your side/i.test(String(entry.title || entry.sourceIdentity || "")))
    .slice(0, 2)
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
  if (/query may leave this tab|live evidence is required/i.test(note.textContent || "")) {
    note.textContent = ACCURATE_COMPOSER_NOTE;
  }
}

function correctDiagnosticReport() {
  const report = document.querySelector("#diagnostic-report");
  if (!report || !report.textContent) return;
  let text = report.textContent;
  const next = text
    .replace(/^Native Chat local diagnostic v2/m, "Native Chat diagnostic schema v2\nRuntime build: Public Talk v3")
    .replace(/^V2 timing:/m, "Evidence timing:");
  if (next !== text) report.textContent = next;
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
}

function installAnswerContract() {
  const form = document.querySelector("#composer");
  const prompt = document.querySelector("#prompt");
  if (!form || !prompt) return;
  form.addEventListener("submit", async event => {
    const text = normalize(prompt.value);
    if (!shouldUseContract(text)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    appendMessage("user", text);
    prompt.value = "";
    setComposerNote("Answering from the local Integrity Index contract…");
    try {
      const sources = await loadIndexSources();
      appendContractAnswer(sources);
      setComposerNote();
    } catch {
      appendMessage("assistant", "I could not load the local Integrity Index for this turn, so I will hold unresolved rather than guess.");
      setComposerNote("Local Integrity Index was unavailable for that turn. No open-web request was sent.");
    }
  }, { capture: true });
}

document.documentElement.dataset.nativeChatAnswerContract = CONTRACT_ID;
installAnswerContract();
installUiCorrections();