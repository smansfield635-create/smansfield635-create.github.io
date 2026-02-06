// TNT: /assets/instrument.js (MINIMAL LIVE LOOP — telemetry + 6 gauges, conservative, no external deps)
(() => {
  const KEY = "GD_INSTRUMENT_V1";
  const nowISO = () => new Date().toISOString();
  const clamp01 = (x) => Math.max(0, Math.min(1, x));

  // Spectrum: red → orange → yellow → green → deep green → blue (fractal)
  const lerp = (a,b,t)=>a+(b-a)*t;
  const hex = (c)=>Math.round(c).toString(16).padStart(2,'0');
  const rgbToHex = (r,g,b)=>'#'+hex(r)+hex(g)+hex(b);
  const seg = (t,a,b,c1,c2)=>{
    const u=(t-a)/(b-a);
    return rgbToHex(lerp(c1[0],c2[0],u),lerp(c1[1],c2[1],u),lerp(c1[2],c2[2],u));
  };
  const spectrum = (t)=>{
    t=clamp01(t);
    if(t<=0.2) return seg(t,0,0.2,[220,38,38],[245,158,11]);
    if(t<=0.4) return seg(t,0.2,0.4,[245,158,11],[250,204,21]);
    if(t<=0.6) return seg(t,0.4,0.6,[250,204,21],[34,197,94]);
    if(t<=0.8) return seg(t,0.6,0.8,[34,197,94],[0,100,70]);
    return seg(t,0.8,1,[0,100,70],[59,130,246]);
  };

  const init = () => ({
    created_at: nowISO(),
    session_id: Math.random().toString(36).slice(2),
    pageviews: 0,
    clicks: 0,
    lastPath: "",
    lastActionAt: Date.now(),
    clicksByHour: (()=>{ const o={}; for(let i=0;i<24;i++) o[i]=0; return o; })(),
    events: [], // lightweight event log for drift/ohm/load
    snapshots: [] // rolling instrument history
  });

  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || init(); }
    catch { return init(); }
  };
  const save = (s) => localStorage.setItem(KEY, JSON.stringify(s));

  const state = load();

  const pushEvent = (type, meta={}) => {
    const e = { t: Date.now(), type, path: location.pathname, ...meta };
    state.events.push(e);
    if(state.events.length > 200) state.events.shift();
    state.lastActionAt = Date.now();
  };

  const recordPageview = () => {
    state.pageviews += 1;
    state.lastPath = location.pathname;
    pushEvent("pageview");
    save(state);
  };

  const recordClick = () => {
    state.clicks += 1;
    const h = new Date().getHours();
    state.clicksByHour[h] = (state.clicksByHour[h] || 0) + 1;
    pushEvent("click");
    save(state);
  };

  // Back-nav signal (best-effort)
  window.addEventListener("popstate", ()=>{ pushEvent("back"); save(state); });

  // Minimal telemetry hooks
  document.addEventListener("click", (e)=>{
    const a = e.target && e.target.closest ? e.target.closest('a') : null;
    if(a) recordClick();
  }, { passive:true });

  // Always record pageview on load
  recordPageview();

  // --- Minimal live computation (conservative; no pretend certainty) ---
  const windowMs = 5 * 60 * 1000; // 5 min observation window
  const recent = () => {
    const cutoff = Date.now() - windowMs;
    return state.events.filter(e => e.t >= cutoff);
  };

  // Drift: oscillation rate (route changes per minute)
  const driftScore = () => {
    const ev = recent().filter(e=>e.type==="pageview");
    if(ev.length < 2) return 0;
    let changes = 0;
    for(let i=1;i<ev.length;i++) if(ev[i].path !== ev[i-1].path) changes++;
    const minutes = Math.max(1, (Date.now()-ev[0].t)/60000);
    const rpm = changes / minutes;     // route changes/min
    return clamp01(rpm / 3);          // 0..1 normalized (>=3 changes/min = heavy drift)
  };

  // Ohm: friction proxy = retries/back + click intensity without completion
  const ohmScore = () => {
    const ev = recent();
    const backs = ev.filter(e=>e.type==="back").length;
    const clicks = ev.filter(e=>e.type==="click").length;
    const views = ev.filter(e=>e.type==="pageview").length;
    const intensity = clamp01((clicks / Math.max(1, views)) / 8); // many clicks per view => friction
    const backp = clamp01(backs / 6);
    return clamp01(0.6*intensity + 0.4*backp);
  };

  // Constraint load: unique routes visited in window (proxy for active constraints)
  const loadScore = () => {
    const ev = recent().filter(e=>e.type==="pageview");
    const uniq = new Set(ev.map(e=>e.path)).size;
    return clamp01((uniq-1)/6); // 0..1 by 7 unique routes
  };

  // Admissibility: receipt-gated placeholder. For now: blocked if excessive drift or friction.
  const admissibility = () => {
    const d = driftScore();
    const o = ohmScore();
    // conservative gate: if both high => at risk / inadmissible
    if(d >= 0.75 || o >= 0.80) return { value: 0, state:"Inadmissible", label:"Blocked" };
    if(d >= 0.55 || o >= 0.60) return { value: 0.5, state:"At Risk", label:"At Risk" };
    return { value: 1, state:"Admitted", label:"Admitted" };
  };

  // Coherence: derived from drift+ohm+load (conservative); fractalization only at very high coherence sustained
  const coherence = () => {
    const d = driftScore();
    const o = ohmScore();
    const l = loadScore();
    const c = clamp01(1 - (0.45*d + 0.35*o + 0.20*l));
    let state="Stable", label="Stable";
    if(c >= 0.88){ state="Fractal"; label="Fractalized"; }
    else if(c >= 0.72){ state="Coherent"; label="Coherent"; }
    else if(c >= 0.55){ state="Stable"; label="Stable"; }
    else if(c >= 0.35){ state="At Risk"; label="At Risk"; }
    else { state="Fragmented"; label="Fragmented"; }
    return { value:c, state, label };
  };

  // Stability: persistence of coherence over time (rolling snapshots)
  const stability = () => {
    const snaps = state.snapshots.slice(-20);
    if(snaps.length < 6) return { value: 0.5, state:"Stable", label:"Stable" };
    const vals = snaps.map(s=>s.gauges.coherence.value);
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min;
    const v = clamp01(1 - range); // smaller range => more stable
    let state="Stable", label="Stable";
    if(v < 0.35){ state="Unstable"; label="Unstable"; }
    else if(v < 0.60){ state="Oscillating"; label="Oscillating"; }
    return { value:v, state, label };
  };

  // Constraint load gauge (explicit)
  const constraintLoad = () => {
    const v = loadScore();
    let state="Light", label="Light";
    if(v >= 0.80){ state="Saturated"; label="Saturated"; }
    else if(v >= 0.60){ state="Heavy"; label="Heavy"; }
    else if(v >= 0.35){ state="Moderate"; label="Moderate"; }
    return { value:v, state, label };
  };

  // Drift gauge (explicit)
  const drift = () => {
    const v = driftScore();
    let state="Aligned", label="Aligned";
    if(v >= 0.75){ state="Drifting"; label="Drifting"; }
    else if(v >= 0.45){ state="Deviating"; label="Deviating"; }
    return { value:v, state, label };
  };

  // Build snapshot + store series
  const buildSnapshot = () => {
    const a = admissibility();
    const c = coherence();
    const d = drift();
    const cl = constraintLoad();
    const o = { value: ohmScore() };
    let oState="Low", oLabel="Low friction";
    if(o.value >= 0.80){ oState="High"; oLabel="High friction"; }
    else if(o.value >= 0.55){ oState="Moderate"; oLabel="Moderate friction"; }
    o.state = oState; o.label = oLabel;

    const s = stability();

    const gauges = {
      coherence: c,
      admissibility: a,
      drift: d,
      constraint_load: cl,
      stability: s,
      ohm: o
    };

    // colors (semantics)
    const colorCoherence = spectrum(c.value);
    const colorDrift = spectrum(1 - d.value);
    const colorOhm = spectrum(1 - o.value);
    const colorLoad = spectrum(1 - cl.value);
    const colorStability = spectrum(s.value);
    const colorAdm = (a.value>=1)?'#22c55e':(a.value<=0?'#dc2626':'#facc15');

    const palette = { legend: spectrum(0.62) };

    // series from snapshot history
    const snaps = state.snapshots.slice(-19);
    const seriesFor = (key, fallback) => {
      const arr = snaps.map(x => x.gauges[key].value);
      arr.push(gauges[key].value);
      if(arr.length < 2) return fallback;
      return arr;
    };

    const out = {
      updated_at: nowISO(),
      palette,
      gauges: {
        coherence: { ...c, color: colorCoherence, displayValue: c.value.toFixed(2), series: seriesFor("coherence",[c.value,c.value]) },
        admissibility: { ...a, color: colorAdm, displayValue: (a.value>=1?'1':(a.value<=0?'0':'0.5')), series: seriesFor("admissibility",[a.value,a.value]) },
        drift: { ...d, color: colorDrift, displayValue: d.value.toFixed(2), series: seriesFor("drift",[d.value,d.value]) },
        constraint_load: { ...cl, color: colorLoad, displayValue: cl.value.toFixed(2), series: seriesFor("constraint_load",[cl.value,cl.value]) },
        stability: { ...s, color: colorStability, displayValue: s.value.toFixed(2), series: seriesFor("stability",[s.value,s.value]) },
        ohm: { ...o, color: colorOhm, displayValue: o.value.toFixed(2), series: seriesFor("ohm",[o.value,o.value]) }
      }
    };

    // store snapshot
    state.snapshots.push({ t: Date.now(), gauges });
    if(state.snapshots.length > 120) state.snapshots.shift();
    save(state);
    return out;
  };

  // Polling snapshot
  let lastSnap = buildSnapshot();
  setInterval(()=>{ lastSnap = buildSnapshot(); }, 5000);

  window.GDInstrument = {
    getSnapshot: () => lastSnap,
    getTelemetry: () => ({
      pageviews: state.pageviews,
      clicks: state.clicks,
      lastPath: state.lastPath || location.pathname,
      clicksByHour: state.clicksByHour
    })
  };
})();
```0
