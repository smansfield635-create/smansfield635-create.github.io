(() => {
  "use strict";

  const RESULT_SCHEMA = "ESTATE_LABORATORY_LIGHTWEIGHT_TEST_RESULT_v1";
  const FETCH_TIMEOUT_MS = 12000;
  const DEEP_LOAD_TIMEOUT_MS = 60000;
  const AUDRALIA_READY_TIMEOUT_MS = 120000;
  const POLL_MS = 500;

  const shell = document.querySelector("[data-lab-shell]");
  if (!shell) return;

  const instrumentGrid = shell.querySelector("[data-instrument-grid]");
  const activeTitle = shell.querySelector("[data-active-title]");
  const activeDescription = shell.querySelector("[data-active-description]");
  const activeMode = shell.querySelector("[data-active-mode]");
  const activeState = shell.querySelector("[data-active-state]");
  const runSelectedButton = shell.querySelector("[data-run-selected]");
  const runAllButton = shell.querySelector("[data-run-all]");
  const teardownButton = shell.querySelector("[data-teardown-target]");
  const targetPanel = shell.querySelector("[data-target-panel]");
  const targetMount = shell.querySelector("[data-target-mount]");
  const resultText = shell.querySelector("[data-result-text]");
  const evidenceList = shell.querySelector("[data-evidence-list]");
  const absenceList = shell.querySelector("[data-absence-list]");
  const directionText = shell.querySelector("[data-direction-text]");
  const receiptOutput = shell.querySelector("[data-receipt-output]");
  const copyReceiptButton = shell.querySelector("[data-copy-receipt]");
  const summaryOverall = shell.querySelector("[data-summary-overall]");
  const summaryPass = shell.querySelector("[data-summary-pass]");
  const summaryFinding = shell.querySelector("[data-summary-finding]");
  const summaryUnresolved = shell.querySelector("[data-summary-unresolved]");
  const summaryLastRun = shell.querySelector("[data-summary-last-run]");
  const liveStatus = shell.querySelector("[data-live-status]");

  const state = {
    selectedId: "release-identity",
    running: false,
    results: new Map(),
    deepFrame: null,
    lastRunAt: null
  };

  const nowIso = () => new Date().toISOString();
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const elapsed = started => Math.max(0, Math.round(performance.now() - started));
  const isHex40 = value => /^[0-9a-f]{40}$/i.test(String(value || ""));
  const text = value => String(value ?? "");
  const bounded = (value, limit = 420) => text(value).replace(/\s+/g, " ").trim().slice(0, limit);
  const list = value => Array.isArray(value) ? value.map(x => text(x)) : [];

  function instrumentResult(instrument, status, startedAt, startedPerf, payload = {}) {
    const completedAt = nowIso();
    return Object.freeze({
      schema: RESULT_SCHEMA,
      instrumentId: instrument.id,
      label: instrument.label,
      mode: instrument.mode,
      status,
      startedAt,
      completedAt,
      durationMs: elapsed(startedPerf),
      result: payload.result || status,
      evidence: list(payload.evidence),
      absence: list(payload.absence),
      direction: payload.direction || "No further direction recorded.",
      detail: payload.detail || null
    });
  }

  async function fetchObserved(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort("LAB_FETCH_TIMEOUT"), options.timeoutMs || FETCH_TIMEOUT_MS);
    const started = performance.now();
    try {
      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
        redirect: "follow",
        signal: controller.signal,
        headers: { Accept: options.accept || "text/html,application/json,text/javascript,*/*;q=0.1" }
      });
      const body = await response.text();
      return {
        ok: response.ok,
        status: response.status,
        finalUrl: response.url,
        contentType: response.headers.get("content-type") || "",
        body,
        durationMs: elapsed(started)
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  async function runReleaseIdentity(instrument, startedAt, startedPerf) {
    try {
      const observed = await fetchObserved(`/.well-known/dgb-release.json?lab=${Date.now()}`, { accept: "application/json,text/plain,*/*" });
      let data = null;
      try { data = JSON.parse(observed.body); } catch {}
      const commit = data?.commit || null;
      if (!observed.ok || !isHex40(commit)) {
        return instrumentResult(instrument, "FINDING", startedAt, startedPerf, {
          result: "PUBLIC_RELEASE_IDENTITY_NOT_ESTABLISHED",
          evidence: [`HTTP ${observed.status}`, `Final URL: ${observed.finalUrl}`, `Commit observed: ${commit || "NONE"}`],
          absence: ["A valid 40-character public release commit marker was not established."],
          direction: "Inspect the exact-head publication path and public release marker before treating the live estate as exact-head identified.",
          detail: { httpStatus: observed.status, commit }
        });
      }
      return instrumentResult(instrument, "PASS", startedAt, startedPerf, {
        result: "PUBLIC_RELEASE_IDENTITY_PRESENT",
        evidence: [`HTTP ${observed.status}`, `Public commit: ${commit}`, `Transport: ${observed.durationMs} ms`],
        direction: "Release identity is observable. This test does not independently prove that the commit is the current repository head.",
        detail: { commit, httpStatus: observed.status }
      });
    } catch (error) {
      return unresolved(instrument, startedAt, startedPerf, error, "Release marker could not be observed.");
    }
  }

  async function runHtmlTokens(instrument, startedAt, startedPerf, spec) {
    try {
      const observed = await fetchObserved(`${spec.url}${spec.url.includes("?") ? "&" : "?"}lab=${Date.now()}`);
      const missing = spec.tokens.filter(token => !observed.body.includes(token));
      if (!observed.ok || missing.length) {
        return instrumentResult(instrument, "FINDING", startedAt, startedPerf, {
          result: spec.failure,
          evidence: [`HTTP ${observed.status}`, `Final URL: ${observed.finalUrl}`, `Response bytes: ${observed.body.length}`],
          absence: missing.length ? missing.map(token => `Missing token: ${token}`) : ["Successful HTTP response not established."],
          direction: spec.direction,
          detail: { httpStatus: observed.status, finalUrl: observed.finalUrl, missingTokens: missing }
        });
      }
      return instrumentResult(instrument, "PASS", startedAt, startedPerf, {
        result: spec.pass,
        evidence: [`HTTP ${observed.status}`, `Final URL: ${observed.finalUrl}`, ...spec.tokens.map(token => `Observed: ${token}`)],
        direction: spec.passDirection || "The bounded surface contract is observable. No stronger runtime conclusion is inferred.",
        detail: { httpStatus: observed.status, finalUrl: observed.finalUrl }
      });
    } catch (error) {
      return unresolved(instrument, startedAt, startedPerf, error, `${instrument.label} could not be observed.`);
    }
  }

  async function runClaimIdentity(instrument, startedAt, startedPerf) {
    try {
      const observed = await fetchObserved(`/evidence/readiness/governance-gen3-entitlement/evidence-identity.v1.json?lab=${Date.now()}`, { accept: "application/json,text/plain,*/*" });
      let data = null;
      try { data = JSON.parse(observed.body); } catch {}
      const identityText = JSON.stringify(data || {});
      const hasIdentity = observed.ok && data && identityText.length > 10 && /sha|digest|blob|commit|identity/i.test(identityText);
      if (!hasIdentity) {
        return instrumentResult(instrument, "FINDING", startedAt, startedPerf, {
          result: "SCIENTIFIC_CLAIM_IDENTITY_RECEIPT_UNAVAILABLE",
          evidence: [`HTTP ${observed.status}`, `Final URL: ${observed.finalUrl}`],
          absence: ["The deployment-generated scientific-claim identity receipt was not established from the live estate."],
          direction: "Restore the deployment-generated claim identity receipt in the complete Pages payload, then rerun this instrument.",
          detail: { httpStatus: observed.status, finalUrl: observed.finalUrl }
        });
      }
      return instrumentResult(instrument, "PASS", startedAt, startedPerf, {
        result: "SCIENTIFIC_CLAIM_IDENTITY_RECEIPT_PRESENT",
        evidence: [`HTTP ${observed.status}`, `Identity document keys: ${Object.keys(data).slice(0, 12).join(", ")}`],
        direction: "Identity transport is present. Scientific support remains bounded by the claim's separate evidence and qualification contract.",
        detail: { keys: Object.keys(data) }
      });
    } catch (error) {
      return unresolved(instrument, startedAt, startedPerf, error, "Scientific claim identity could not be observed.");
    }
  }

  function unresolved(instrument, startedAt, startedPerf, error, absence) {
    return instrumentResult(instrument, "UNRESOLVED", startedAt, startedPerf, {
      result: "INSTRUMENT_OBSERVATION_UNRESOLVED",
      evidence: [bounded(error?.message || error || "Unknown instrument error")],
      absence: [absence],
      direction: "Repeat only after the observation boundary changes or inspect the dedicated diagnostic chamber.",
      detail: { error: bounded(error?.stack || error?.message || error, 1200) }
    });
  }

  function teardownTarget() {
    if (state.deepFrame) {
      try { state.deepFrame.remove(); } catch {}
      state.deepFrame = null;
    }
    targetMount.replaceChildren();
    targetPanel.hidden = true;
    teardownButton.hidden = true;
    document.documentElement.dataset.heavyRuntimeLoaded = "false";
  }

  function createTargetFrame(url, title) {
    teardownTarget();
    const iframe = document.createElement("iframe");
    iframe.className = "target-frame";
    iframe.title = title;
    iframe.src = url;
    iframe.loading = "eager";
    iframe.referrerPolicy = "same-origin";
    targetMount.append(iframe);
    targetPanel.hidden = false;
    teardownButton.hidden = false;
    document.documentElement.dataset.heavyRuntimeLoaded = "true";
    state.deepFrame = iframe;
    return iframe;
  }

  function waitFrameLoad(frame, timeoutMs = DEEP_LOAD_TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        reject(new Error("TARGET_FRAME_LOAD_TIMEOUT"));
      }, timeoutMs);
      frame.addEventListener("load", () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve();
      }, { once: true });
      frame.addEventListener("error", () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(new Error("TARGET_FRAME_LOAD_ERROR"));
      }, { once: true });
    });
  }

  async function runAudraliaRuntime(instrument, startedAt, startedPerf) {
    const frame = createTargetFrame(`/showroom/globe/audralia/?lab-deep=${Date.now()}`, "Audralia runtime test chamber");
    try {
      await waitFrameLoad(frame);
      const deadline = performance.now() + AUDRALIA_READY_TIMEOUT_MS;
      let last = null;
      while (performance.now() < deadline) {
        const win = frame.contentWindow;
        const doc = frame.contentDocument;
        const loader = doc?.querySelector?.("[data-audralia-loader]") || null;
        let reconciliation = null;
        try { reconciliation = win?.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.() || null; } catch {}
        const ready = Boolean(loader?.classList?.contains("is-ready"));
        const invariantPresent = Boolean(reconciliation?.invariants);
        const invariantPass = invariantPresent ? reconciliation.invariants.pass === true : null;
        const failures = Array.isArray(reconciliation?.invariants?.failures) ? reconciliation.invariants.failures : [];
        last = {
          title: doc?.title || null,
          ready,
          stage: doc?.querySelector?.("[data-audralia-loader-stage]")?.textContent?.trim() || null,
          progress: loader?.dataset?.progress || doc?.querySelector?.("[data-audralia-loader-progress]")?.textContent?.trim() || null,
          invariantPresent,
          invariantPass,
          failures: failures.slice(0, 20)
        };
        if (ready && (!invariantPresent || (invariantPass === true && failures.length === 0))) {
          return instrumentResult(instrument, "PASS", startedAt, startedPerf, {
            result: "AUDRALIA_RUNTIME_READY_OBSERVED",
            evidence: [`Loader ready: true`, `Stage: ${last.stage || "UNKNOWN"}`, `Progress: ${last.progress || "UNKNOWN"}`, invariantPresent ? `Runtime invariants pass: ${invariantPass}` : "Runtime invariants: not exposed at observation point"],
            direction: "The live Audralia runtime reached its declared ready state in the isolated laboratory target. Preserve this observation as runtime evidence; do not infer unrelated publication or scientific authority.",
            detail: last
          });
        }
        await sleep(POLL_MS);
      }
      return instrumentResult(instrument, "FINDING", startedAt, startedPerf, {
        result: "AUDRALIA_RUNTIME_READY_NOT_OBSERVED_WITHIN_BUDGET",
        evidence: [`Observation budget: ${AUDRALIA_READY_TIMEOUT_MS} ms`, `Last stage: ${last?.stage || "UNKNOWN"}`, `Last progress: ${last?.progress || "UNKNOWN"}`],
        absence: ["Audralia's declared ready state was not observed within the bounded laboratory budget."],
        direction: "Open the Audralia Engine Diagnostic to localize startup, reconciliation, request, or invariant failure before altering product runtime bytes.",
        detail: last
      });
    } catch (error) {
      return unresolved(instrument, startedAt, startedPerf, error, "Audralia deep runtime observation did not complete.");
    }
  }

  async function runEvidenceCarousel(instrument, startedAt, startedPerf) {
    const frame = createTargetFrame(`/evidence/?lab-deep=${Date.now()}`, "Evidence carousel test chamber");
    try {
      await waitFrameLoad(frame);
      const doc = frame.contentDocument;
      const deadline = performance.now() + 15000;
      let root = null;
      while (performance.now() < deadline) {
        root = doc?.querySelector?.("[data-carousel]") || null;
        if (root?.dataset?.activeId) break;
        await sleep(200);
      }
      const before = root?.dataset?.activeId || "";
      if (!before) throw new Error("EVIDENCE_CAROUSEL_ACTIVE_ID_NOT_ESTABLISHED");
      const tabs = [...doc.querySelectorAll("[data-tabs] [data-index]")];
      const target = tabs.find(button => button.dataset.index !== "0") || tabs[1] || null;
      if (!target) throw new Error("EVIDENCE_CAROUSEL_TARGET_TAB_MISSING");
      target.click();
      const changeDeadline = performance.now() + 6000;
      let after = before;
      while (performance.now() < changeDeadline) {
        after = root.dataset.activeId || "";
        if (after && after !== before) break;
        await sleep(100);
      }
      if (!after || after === before) {
        return instrumentResult(instrument, "FINDING", startedAt, startedPerf, {
          result: "EVIDENCE_CAROUSEL_INTERACTION_FAILED",
          evidence: [`Initial active item: ${before}`, `Observed after interaction: ${after || "NONE"}`],
          absence: ["A real carousel state transition was not observed."],
          direction: "Treat this as an Evidence experience regression. Do not repair it by adding heavier Current Public Condition startup work to the Evidence page.",
          detail: { before, after }
        });
      }
      return instrumentResult(instrument, "PASS", startedAt, startedPerf, {
        result: "EVIDENCE_CAROUSEL_INTERACTION_PASS",
        evidence: [`Initial active item: ${before}`, `Active item after real tab interaction: ${after}`],
        direction: "Evidence carousel interaction is independently observable inside the isolated laboratory target.",
        detail: { before, after }
      });
    } catch (error) {
      return unresolved(instrument, startedAt, startedPerf, error, "Evidence carousel interaction could not be established.");
    }
  }

  const instruments = [
    {
      id: "release-identity",
      label: "Release Identity",
      mode: "light",
      description: "Read the live exact-head release marker without booting a product runtime.",
      run: runReleaseIdentity
    },
    {
      id: "evidence-surface",
      label: "Evidence Surface",
      mode: "light",
      description: "Verify that the Evidence presentation surface and carousel contract are being served.",
      run: (instrument, startedAt, startedPerf) => runHtmlTokens(instrument, startedAt, startedPerf, {
        url: "/evidence/",
        tokens: ["data-carousel", "Current Public Condition"],
        pass: "EVIDENCE_SURFACE_CONTRACT_PRESENT",
        failure: "EVIDENCE_SURFACE_CONTRACT_INCOMPLETE",
        direction: "Inspect Evidence publication identity and static surface delivery before investigating its deeper runtime."
      })
    },
    {
      id: "claim-identity",
      label: "Scientific Claim Identity",
      mode: "light",
      description: "Check whether the live deployment exposes the bounded scientific-claim identity receipt.",
      run: runClaimIdentity
    },
    {
      id: "audralia-surface",
      label: "Audralia Surface",
      mode: "light",
      description: "Verify Audralia shell transport and declared planetary integration without waiting for runtime readiness.",
      run: (instrument, startedAt, startedPerf) => runHtmlTokens(instrument, startedAt, startedPerf, {
        url: "/showroom/globe/audralia/",
        tokens: ["data-audralia-loader", "AUDRALIA_LIVE_PLANETARY_INTEGRATION"],
        pass: "AUDRALIA_SURFACE_CONTRACT_PRESENT",
        failure: "AUDRALIA_SURFACE_CONTRACT_INCOMPLETE",
        direction: "If transport is present but runtime behavior is in question, run the explicit Audralia Runtime deep instrument."
      })
    },
    {
      id: "diagnostic-authority",
      label: "Diagnostic Authority",
      mode: "light",
      description: "Read the Audralia diagnostic authority source and verify its declared inspection surface.",
      run: (instrument, startedAt, startedPerf) => runHtmlTokens(instrument, startedAt, startedPerf, {
        url: "/showroom/globe/audralia/diagnostic/index.inspection.authority.js",
        tokens: ["AUDRALIA_DROP_WITH_READ_DIAGNOSTIC_AUTHORITY", "REQUIRED_GLOBALS"],
        pass: "AUDRALIA_DIAGNOSTIC_AUTHORITY_SOURCE_PRESENT",
        failure: "AUDRALIA_DIAGNOSTIC_AUTHORITY_SOURCE_INCOMPLETE",
        direction: "Open the Audralia Engine Diagnostic for participant correspondence and station-level inspection."
      })
    },
    {
      id: "compass-surface",
      label: "Compass Surface",
      mode: "light",
      description: "Verify that the estate Compass root is served with its live structural contract.",
      run: (instrument, startedAt, startedPerf) => runHtmlTokens(instrument, startedAt, startedPerf, {
        url: "/",
        tokens: ["data-compass-root", "Diamond Gate Bridge Compass"],
        pass: "COMPASS_SURFACE_CONTRACT_PRESENT",
        failure: "COMPASS_SURFACE_CONTRACT_INCOMPLETE",
        direction: "Escalate to a dedicated Compass browser diagnostic when interaction, canvas, or settled-state behavior must be tested."
      })
    },
    {
      id: "h-earth-surface",
      label: "H-Earth Surface",
      mode: "light",
      description: "Verify that the H-Earth public route resolves and remains identifiable as H-Earth.",
      run: (instrument, startedAt, startedPerf) => runHtmlTokens(instrument, startedAt, startedPerf, {
        url: "/showroom/globe/h-earth/",
        tokens: ["H-Earth"],
        pass: "H_EARTH_SURFACE_REACHABLE",
        failure: "H_EARTH_SURFACE_NOT_ESTABLISHED",
        direction: "Open H-Earth FD_05 for governed browser evidence, body custody, digest comparison, and exact-nine diagnosis."
      })
    },
    {
      id: "audralia-runtime",
      label: "Audralia Runtime",
      mode: "deep",
      description: "Explicitly boot Audralia in an isolated target chamber and wait for its real declared ready state.",
      run: runAudraliaRuntime
    },
    {
      id: "evidence-carousel",
      label: "Evidence Carousel",
      mode: "deep",
      description: "Load Evidence in isolation and prove a real carousel state transition without placing this runtime on the Evidence page itself.",
      run: runEvidenceCarousel
    }
  ];

  const instrumentById = new Map(instruments.map(instrument => [instrument.id, instrument]));

  function setLive(message) {
    liveStatus.textContent = message;
  }

  function statusClass(status) {
    return ["PASS", "FINDING", "UNRESOLVED", "RUNNING"].includes(status) ? status.toLowerCase() : "idle";
  }

  function renderInstrumentGrid() {
    instrumentGrid.replaceChildren(...instruments.map(instrument => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "instrument-card";
      button.dataset.instrumentId = instrument.id;
      button.dataset.mode = instrument.mode;
      button.setAttribute("aria-pressed", String(instrument.id === state.selectedId));
      const result = state.results.get(instrument.id);
      const currentStatus = result?.status || "IDLE";
      button.innerHTML = `<span class="instrument-card__mode">${instrument.mode === "deep" ? "DEEP · ON DEMAND" : "LIGHTWEIGHT"}</span><strong>${instrument.label}</strong><span>${instrument.description}</span><em data-status="${currentStatus}">${currentStatus}</em>`;
      button.addEventListener("click", () => selectInstrument(instrument.id));
      return button;
    }));
  }

  function selectInstrument(id) {
    if (!instrumentById.has(id)) return;
    state.selectedId = id;
    const instrument = instrumentById.get(id);
    activeTitle.textContent = instrument.label;
    activeDescription.textContent = instrument.description;
    activeMode.textContent = instrument.mode === "deep" ? "DEEP · ISOLATED TARGET" : "LIGHTWEIGHT · NO PRODUCT BOOT";
    [...instrumentGrid.querySelectorAll("[data-instrument-id]")].forEach(button => button.setAttribute("aria-pressed", String(button.dataset.instrumentId === id)));
    renderResult(state.results.get(id) || null);
  }

  function renderResult(result) {
    const status = result?.status || "IDLE";
    activeState.textContent = status;
    activeState.dataset.status = status;
    resultText.textContent = result ? result.result : "No result yet. Run this instrument when you want a fresh observation.";
    evidenceList.replaceChildren(...(result?.evidence?.length ? result.evidence : ["No evidence captured yet."]).map(item => {
      const li = document.createElement("li"); li.textContent = item; return li;
    }));
    absenceList.replaceChildren(...(result?.absence?.length ? result.absence : ["No absence recorded."]).map(item => {
      const li = document.createElement("li"); li.textContent = item; return li;
    }));
    directionText.textContent = result?.direction || "Run the instrument to establish a bounded next direction.";
    receiptOutput.textContent = result ? JSON.stringify(result, null, 2) : "No receipt yet.";
    copyReceiptButton.disabled = !result;
  }

  function renderSummary() {
    const results = [...state.results.values()];
    const pass = results.filter(result => result.status === "PASS").length;
    const finding = results.filter(result => result.status === "FINDING").length;
    const unresolvedCount = results.filter(result => result.status === "UNRESOLVED").length;
    let overall = "IDLE";
    if (state.running) overall = "RUNNING";
    else if (finding) overall = "FINDING";
    else if (unresolvedCount) overall = "UNRESOLVED";
    else if (results.length) overall = "PASS";
    summaryOverall.textContent = overall;
    summaryOverall.dataset.status = overall;
    summaryPass.textContent = String(pass);
    summaryFinding.textContent = String(finding);
    summaryUnresolved.textContent = String(unresolvedCount);
    summaryLastRun.textContent = state.lastRunAt ? new Date(state.lastRunAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";
  }

  async function runInstrument(id) {
    const instrument = instrumentById.get(id);
    if (!instrument || state.running) return null;
    state.running = true;
    runSelectedButton.disabled = true;
    runAllButton.disabled = true;
    activeState.textContent = "RUNNING";
    activeState.dataset.status = "RUNNING";
    setLive(`Running ${instrument.label}…`);
    renderSummary();
    const startedAt = nowIso();
    const startedPerf = performance.now();
    let result;
    try {
      result = await instrument.run(instrument, startedAt, startedPerf);
    } catch (error) {
      result = unresolved(instrument, startedAt, startedPerf, error, "Instrument execution did not complete.");
    }
    state.results.set(id, result);
    state.lastRunAt = result.completedAt;
    state.running = false;
    runSelectedButton.disabled = false;
    runAllButton.disabled = false;
    renderInstrumentGrid();
    selectInstrument(id);
    renderSummary();
    setLive(`${instrument.label}: ${result.status}.`);
    return result;
  }

  async function runAllLightweight() {
    if (state.running) return;
    teardownTarget();
    const queue = instruments.filter(instrument => instrument.mode === "light");
    runAllButton.disabled = true;
    runSelectedButton.disabled = true;
    for (const instrument of queue) {
      state.selectedId = instrument.id;
      renderInstrumentGrid();
      selectInstrument(instrument.id);
      state.running = true;
      activeState.textContent = "RUNNING";
      activeState.dataset.status = "RUNNING";
      setLive(`Lightweight suite ${queue.indexOf(instrument) + 1} of ${queue.length}: ${instrument.label}…`);
      renderSummary();
      const startedAt = nowIso();
      const startedPerf = performance.now();
      let result;
      try {
        result = await instrument.run(instrument, startedAt, startedPerf);
      } catch (error) {
        result = unresolved(instrument, startedAt, startedPerf, error, "Instrument execution did not complete.");
      }
      state.results.set(instrument.id, result);
      state.lastRunAt = result.completedAt;
      state.running = false;
      renderInstrumentGrid();
      selectInstrument(instrument.id);
      renderSummary();
      await sleep(40);
    }
    runAllButton.disabled = false;
    runSelectedButton.disabled = false;
    const completed = queue.map(instrument => state.results.get(instrument.id)).filter(Boolean);
    const finding = completed.filter(result => result.status === "FINDING").length;
    const unresolvedCount = completed.filter(result => result.status === "UNRESOLVED").length;
    setLive(`Lightweight suite complete: ${completed.length - finding - unresolvedCount} pass, ${finding} finding, ${unresolvedCount} unresolved.`);
  }

  runSelectedButton.addEventListener("click", () => runInstrument(state.selectedId));
  runAllButton.addEventListener("click", runAllLightweight);
  teardownButton.addEventListener("click", () => {
    teardownTarget();
    setLive("Isolated target chamber cleared.");
  });
  copyReceiptButton.addEventListener("click", async () => {
    const result = state.results.get(state.selectedId);
    if (!result) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setLive(`${result.label} receipt copied.`);
    } catch {
      setLive("Clipboard unavailable. Receipt remains visible for manual copy.");
    }
  });

  window.addEventListener("pagehide", teardownTarget, { once: true });

  renderInstrumentGrid();
  selectInstrument(state.selectedId);
  renderSummary();
  setLive("Laboratory ready. Lightweight instruments do not boot 3D product runtimes.");
})();
