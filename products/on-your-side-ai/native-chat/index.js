const MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
const WEBLLM_MODULE = "https://esm.run/@mlc-ai/web-llm@0.2.85";
const MODEL_URL = new URL("./runtime/model/Qwen2.5-0.5B-Instruct-q4f16_1-MLC/", window.location.href).href;
const MODEL_LIB_URL = new URL("./runtime/webllm/Qwen2-0.5B-Instruct-q4f16_1_cs1k-webgpu.wasm", window.location.href).href;

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
  composerNote: document.querySelector("#composer-note")
};

let engine = null;
let loading = false;
let generating = false;
let stopRequested = false;
let messages = [{ role: "system", content: SYSTEM_MESSAGE }];

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
  els.composerNote.textContent = ready
    ? "Conversation stays in this tab. Public Talk has no repository execution authority."
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
  if (!("gpu" in navigator)) {
    setStatus(els.deviceStatus, "WebGPU unavailable", "bad");
    els.loadButton.disabled = true;
    document.querySelector("#load-copy").textContent =
      "This browser does not expose WebGPU, which this local build requires. Try a current WebGPU-capable browser and device.";
    return false;
  }
  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      setStatus(els.deviceStatus, "No WebGPU adapter", "bad");
      els.loadButton.disabled = true;
      return false;
    }
    setStatus(els.deviceStatus, "WebGPU available", "good");
    return true;
  } catch (error) {
    console.error("WebGPU inspection failed", error);
    setStatus(els.deviceStatus, "WebGPU check failed", "bad");
    els.loadButton.disabled = true;
    return false;
  }
}

async function loadModel() {
  if (engine || loading) return;
  loading = true;
  els.loadButton.disabled = true;
  els.progressWrap.hidden = false;
  setStatus(els.modelStatus, "Loading local model…", "muted");
  els.progress.value = 0;
  els.progressText.textContent = "Loading WebLLM runtime…";

  try {
    const webllm = await import(WEBLLM_MODULE);
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

    engine = await webllm.CreateMLCEngine(MODEL_ID, {
      appConfig,
      initProgressCallback: (report) => {
        if (typeof report.progress === "number" && Number.isFinite(report.progress)) {
          els.progress.value = Math.max(0, Math.min(1, report.progress));
        }
        if (report.text) els.progressText.textContent = report.text;
      },
      logLevel: "WARN"
    });

    els.progress.value = 1;
    els.progressText.textContent = "Local model ready.";
    setStatus(els.modelStatus, "Local model ready", "good");
    els.loadButton.textContent = "Loaded";
    setReadyState(true);
    els.prompt.focus();
  } catch (error) {
    console.error("Native Chat model load failed", error);
    engine = null;
    setStatus(els.modelStatus, "Local model failed to load", "bad");
    els.progressText.textContent =
      "The local model could not start on this device. No prompt was sent to a hosted model API.";
    els.loadButton.disabled = false;
    els.loadButton.textContent = "Try Again";
    setReadyState(false);
  } finally {
    loading = false;
  }
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
  try {
    const requestMessages = [messages[0], ...messages.slice(1).slice(-10)];
    const stream = await engine.chat.completions.create({
      messages: requestMessages,
      stream: true,
      temperature: 0.65,
      top_p: 0.9,
      max_tokens: 420
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content || "";
      if (delta) {
        reply += delta;
        assistant.body.textContent = reply;
        els.transcript.scrollTop = els.transcript.scrollHeight;
      }
    }

    if (reply.trim()) {
      messages.push({ role: "assistant", content: reply });
    } else if (!stopRequested) {
      assistant.body.textContent = "I did not produce a response. Try rephrasing the request.";
    }
  } catch (error) {
    console.error("Native Chat generation failed", error);
    if (stopRequested) {
      if (!reply.trim()) assistant.body.textContent = "Generation stopped.";
      if (reply.trim()) messages.push({ role: "assistant", content: reply });
    } else {
      assistant.body.textContent =
        "The local generation stopped unexpectedly. Your prompt was not sent to a hosted model API.";
    }
  } finally {
    assistant.article.classList.remove("streaming");
    generating = false;
    stopRequested = false;
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
    engine.interruptGenerate();
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

setReadyState(false);
inspectDevice();
