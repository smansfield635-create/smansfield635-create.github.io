/* FILE: /assets/ui.js  (TNT FULL REPLACEMENT)
   - keeps: dropdowns + human/scientific toggles
   - adds: Layer 3 transport (client-side live gauges)
   - live gauges update on /gauges/ from observable interaction signals
*/

(function () {
  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  // ---------- DROPDOWNS ----------
  function wireDropdowns() {
    document.querySelectorAll("[data-drop]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-drop");
        const panel = document.getElementById(id);
        if (!panel) return;
        panel.classList.toggle("open");
        track("drop_toggle", { id, open: panel.classList.contains("open") });
      });
    });
  }

  // ---------- TOGGLES (HUMAN / SCIENTIFIC) ----------
  function wireToggles() {
    document.querySelectorAll("[data-toggle-group]").forEach((group) => {
      const gid = group.getAttribute("data-toggle-group");
      const buttons = document.querySelectorAll(`[data-toggle="${gid}"]`);
      const panes = document.querySelectorAll(`[data-pane="${gid}"]`);

      const setMode = (mode) => {
        buttons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-mode") === mode));
        panes.forEach((p) => p.classList.toggle("show", p.getAttribute("data-mode") === mode));
        track("toggle_mode", { group: gid, mode });
      };

      buttons.forEach((b) => b.addEventListener("click", () => setMode(b.getAttribute("data-mode"))));
      setMode("human");
    });
  }

  // ---------- TRANSPARENT EVENT LOG (SOURCE-OF-TRUTH: OBSERVED STATE) ----------
  const KEY = "GEO_OBS_V1";
  function loadObs() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { startedAt: Date.now(), events: [] };
    } catch {
      return { startedAt: Date.now(), events: [] };
    }
  }
  function saveObs(obs) {
    try { localStorage.setItem(KEY, JSON.stringify(obs)); } catch {}
  }
  function track(type, data) {
    const obs = loadObs();
    obs.events.push({ type, data: data || {}, t: Date.now() });
    if (obs.events.length > 500) obs.events = obs.events.slice(-500);
    saveObs(obs);
  }

  // ---------- LAYER 3 "LIVE" GAUGES (CLIENT-SIDE)
  // Full transparency: values derive only from:
  // - Declared state: fixed (canonical) + chosen mode (toggle)
  // - Observed state: user interactions (drops/toggles)
  // - Trajectory: stability/drift computed from interaction rate over time window
  function computeSnapshot() {
    const obs = loadObs();
    const now = Date.now();

    // Window for "motion"
    const W = 5 * 60 * 1000; // 5 min
    const recent = obs.events.filter(e => now - e.t <= W);

    const drops = recent.filter(e => e.type === "drop_toggle").length;
    const toggles = recent.filter(e => e.type === "toggle_mode").length;

    // Drift proxy: frequent switching = higher drift
    const driftRaw = Math.min(1, (toggles / 20) + (drops / 80));
    const drift = driftRaw; // 0..1

    // Coherence proxy: 1 - drift (bounded)
    const coherence = Math.max(0, 1 - driftRaw);

    // Stability proxy: low variance in last minute
    const W2 = 60 * 1000;
    const veryRecent = obs.events.filter(e => now - e.t <= W2);
    const activity = veryRecent.length;
    const stability = activity <= 6 ? "STABLE" : activity <= 18 ? "UNSTABLE" : "VOLATILE";

    // Constraint load proxy: activity rate
    const load = activity <= 4 ? "LOW" : activity <= 10 ? "MED" : "HIGH";

    // Admissibility (3-state) derived from coherence+stability+load (proxy)
    let admissibility = "ADMISSIBLE";
    if (coherence < 0.55 || stability === "VOLATILE" || load === "HIGH") admissibility = "INADMISSIBLE";
    else if (coherence < 0.80 || stability === "UNSTABLE" || load === "MED") admissibility = "AT RISK";

    // Closure: manual only (no auto-transition)
    const closure = "OPEN";

    return {
      ts: new Date(now).toISOString(),
      sources: {
        declared: "canonical + selected toggles",
        observed: "user interaction events (dropdowns/toggles)",
        trajectory: "interaction-rate drift proxy over time windows"
      },
      coherence: Number(coherence.toFixed(3)),
      stability,
      drift: Number(drift.toFixed(3)),
      constraint_load: load,
      admissibility,
      closure
    };
  }

  // ---------- UPDATE /gauges/ PAGE DOM WITHOUT EDITING HTML ----------
  function applyToGaugesPage() {
    const path = location.pathname || "/";
    if (!path.startsWith("/gauges")) return;

    function findTileByTopContains(token) {
      const tops = Array.from(document.querySelectorAll(".tileTop"));
      for (const t of tops) {
        if ((t.textContent || "").toUpperCase().includes(token)) {
          const tile = t.closest(".tile");
          if (tile) return tile;
        }
      }
      return null;
    }

    function setTitle(tile, text) {
      if (!tile) return;
      const title = tile.querySelector(".tileTitle");
      if (title) title.textContent = text;
    }

    function setBody(tile, text) {
      if (!tile) return;
      const body = tile.querySelector(".tileBody");
      if (body) body.textContent = text;
    }

    function paintAdmissibility(tile, state) {
      if (!tile) return;
      const title = tile.querySelector(".tileTitle");
      if (!title) return;
      title.innerHTML = state === "ADMISSIBLE"
        ? '<span class="green">ADMISSIBLE</span>'
        : state === "AT RISK"
        ? '<span class="cyan">AT RISK</span>'
        : '<span class="red">INADMISSIBLE</span>';
    }

    function tick() {
      const s = computeSnapshot();

      const tC = findTileByTopContains("COHERENCE");
      const tS = findTileByTopContains("STABILITY");
      const tD = findTileByTopContains("DRIFT");
      const tL = findTileByTopContains("CONSTRAINT LOAD");
      const tA = findTileByTopContains("ADMISSIBILITY");
      const tE = findTileByTopContains("CLOSURE");

      setTitle(tC, String(s.coherence.toFixed(3)));
      setBody(tC, `VISIBLE · live (${s.ts})`);

      setTitle(tS, s.stability);
      setBody(tS, `live (${s.ts})`);

      setTitle(tD, s.drift.toFixed(3));
      setBody(tD, `live (${s.ts})`);

      setTitle(tL, s.constraint_load);
      setBody(tL, `live (${s.ts})`);

      paintAdmissibility(tA, s.admissibility);
      setBody(tA, `live (${s.ts})`);

      setTitle(tE, s.closure);
      setBody(tE, `Manual only`);

      // Expose full transparency snapshot
      window.GEO = window.GEO || {};
      window.GEO.live = { snapshot: s };
    }

    tick();
    setInterval(tick, 1000);
  }

  // ---------- BOOT ----------
  onReady(() => {
    // record page view as observable state (source-of-truth)
    track("page_view", { path: location.pathname });

    wireDropdowns();
    wireToggles();
    applyToGaugesPage();
  });
})();
```0
