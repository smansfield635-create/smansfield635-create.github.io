/* gm-kernel.js — Geodiametrics Quad-Core Kernel (single integrated format)
   Compatibility: Browser (GitHub Pages) — vanilla JS only
   Principle: One kernel, many plants. No fake vitality. Observer-first.
*/
(function(){
  "use strict";

  // ---------- Constants ----------
  const VERSION = "GM_KERNEL_v1";
  const PREFIX  = "GM::";
  const ISO = () => new Date().toISOString();
  const MS  = () => Date.now();

  // Primitive time defaults (override via GM_PLANT.primitive_ms)
  const DEFAULT_PRIMITIVE_MS = 60 * 60 * 1000; // 60 minutes

  // ---------- Storage ----------
  const S = {
    get(k, fb=null){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):fb; }catch{ return fb; } },
    set(k, v){ localStorage.setItem(k, JSON.stringify(v)); },
    del(k){ localStorage.removeItem(k); },
    keys(){ const out=[]; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k) out.push(k); } return out; }
  };

  // ---------- IDs ----------
  function plantIdFromLocation(){
    // stable default: hostname + pathname (no query)
    return (location.host + location.pathname).replace(/\/+$/,"/").toLowerCase();
  }

  // ---------- Quad-Core Engine ----------
  // Integrity → Structure → Trajectory → Vitality
  function blankEngine(){
    return {
      integrity:  { sel:null, res:null, com:null, con:{cycle:"IDLE", last:null} },
      structure:  { sel:null, res:null, com:null, con:{cycle:"IDLE", last:null} },
      trajectory: { sel:null, res:null, com:null, con:{cycle:"IDLE", last:null} },
      vitality:   { sel:null, res:null, com:null, con:{cycle:"IDLE", last:null} },
      updated_at: null,
      version: VERSION
    };
  }

  // ---------- Kernel Model ----------
  // One plant == one instance of the quad-core kernel
  function keyBase(plantId){ return PREFIX + "PLANT::" + plantId; }
  function kState(plantId){ return keyBase(plantId) + "::STATE"; }
  function kLog(plantId){ return keyBase(plantId) + "::LOG"; }
  function kMeta(plantId){ return keyBase(plantId) + "::META"; }

  function ensurePlant(plantId, meta){
    const st = S.get(kState(plantId));
    if(!st){
      S.set(kState(plantId), blankEngine());
      S.set(kLog(plantId), []);
      S.set(kMeta(plantId), {
        plant_id: plantId,
        created_at: ISO(),
        updated_at: ISO(),
        meta: meta || {},
        version: VERSION
      });
    } else {
      // keep meta fresh
      const m = S.get(kMeta(plantId), {});
      m.updated_at = ISO();
      m.meta = Object.assign({}, m.meta || {}, meta || {});
      m.version = VERSION;
      S.set(kMeta(plantId), m);
    }
  }

  function logEvent(plantId, type, payload){
    const log = S.get(kLog(plantId), []);
    log.push({ t: ISO(), type, payload: payload || null });
    while(log.length > 500) log.shift();
    S.set(kLog(plantId), log);
  }

  // ---------- Signal Adapters ----------
  // Kernel never “creates life.” It only observes admissible signals.
  const Adapters = {
    // Website interaction signal (honest, local): presence + interaction timestamps
    website_interaction(plantId, primitive_ms){
      const IK = PREFIX + "INTERACT::" + plantId;
      const rec = () => {
        const arr = S.get(IK, []);
        arr.push(MS());
        const cutoff = MS() - (30 * 24 * 60 * 60 * 1000); // keep 30 days
        S.set(IK, arr.filter(x => x >= cutoff));
      };
      ["mousemove","keydown","touchstart","scroll","click"].forEach(ev=>{
        window.addEventListener(ev, rec, {passive:true});
      });
      rec();

      // returns computed metrics at read time
      return function read(){
        const arr = S.get(IK, []);
        const t = MS();
        const h = arr.filter(x=>t-x< 60*60*1000).length;
        const d = arr.filter(x=>t-x< 24*60*60*1000).length;
        const w = arr.filter(x=>t-x< 7*24*60*60*1000).length;
        const m = arr.filter(x=>t-x< 30*24*60*60*1000).length;
        return { h, d, w, m, last: arr.length? new Date(arr[arr.length-1]).toISOString() : null };
      };
    },

    // External JSON bridge (OSF-only): you host /osf-metrics.json
    external_json(url){
      let last = null;
      let lastFetch = null;
      return async function read(){
        try{
          const res = await fetch(url, {cache:"no-store"});
          if(!res.ok) throw new Error("fetch_failed");
          last = await res.json();
          lastFetch = ISO();
        }catch(e){}
        return { data:last, fetched_at:lastFetch };
      };
    }
  };

  // ---------- Gauge Model (Fuel/RPM/Speed/Risk) ----------
  // Read-only projection: never used to mutate state.
  function gaugesFromSignals(sig){
    // sig.website: {h,d,w,m,last}
    // sig.osf: {data:{views_60m,downloads_60m,...}, fetched_at}
    const out = {
      fuel: 0, rpm: 0, speed: 0, risk: 0,
      mode: "IDLE",
      notes: []
    };

    // 1) Website interaction drives “alive” baseline (honest presence)
    const web = sig.website || {h:0,d:0,w:0,m:0,last:null};
    const webRPM = Math.min(1, web.h / 30); // 30 interactions/hr => full
    const webAlive = web.h > 0;

    // 2) OSF data drives external legitimacy when present (honest external)
    const osf = (sig.osf && sig.osf.data) ? sig.osf.data : null;
    const osfActivity = osf ? Math.min(1, ((+osf.views_60m||0) + (+osf.downloads_60m||0)) / 100) : 0;

    // Combine: external dominates “meaning”, local dominates “presence”
    // If OSF missing, we remain “READY/IDLE” not “OPERATIONAL”.
    const activity = osf ? osfActivity : webRPM * 0.25;
    const risk = osf ? (osfActivity===0 ? 0.2 : 0.05) : (webAlive ? 0.1 : 0.3);

    // Fuel rule: full unless fragmentation/burnout signals (placeholder until real invariants)
    const fuel = osf ? 1 : (webAlive ? 0.8 : 0.4);

    out.rpm = activity;
    out.speed = activity; // v1 momentum proxy (can be upgraded with deltas)
    out.risk = risk;
    out.fuel = fuel;

    if(osf) out.mode = (activity>0 ? "OPERATIONAL" : "READY");
    else out.mode = (webAlive ? "LOCAL_ONLY" : "IDLE");

    return out;
  }

  // ---------- Engine Update Rule ----------
  // Kernel updates its own state ONLY from admissible signals (no buttons).
  function stepEngineFromGauges(engine, g){
    // Minimal lawful mapping (v1):
    // Integrity.selection = g.mode
    // Structure.resolution = g.fuel tier
    // Trajectory.commitment = g.rpm tier
    // Vitality.continuation.cycle = g.mode
    const tier = (x)=> x>=0.66 ? "HIGH" : x>=0.33 ? "MID" : "LOW";

    engine.integrity.sel = g.mode;
    engine.structure.res = tier(g.fuel);
    engine.trajectory.com = tier(g.rpm);
    engine.vitality.con = { cycle: g.mode, last: ISO() };
    engine.updated_at = ISO();
    return engine;
  }

  // ---------- Public API (global) ----------
  // window.GM = { read, export, listPlants }
  const GM = {
    version: VERSION,

    listPlants(){
      return S.keys()
        .filter(k=>k.startsWith(PREFIX+"PLANT::") && k.endsWith("::META"))
        .map(k=>S.get(k))
        .filter(Boolean);
    },

    read(plantId){
      const meta = S.get(kMeta(plantId), null);
      const st   = S.get(kState(plantId), null);
      const log  = S.get(kLog(plantId), []);
      return { meta, state: st, log };
    },

    export(plantId){
      const bundle = GM.read(plantId);
      const blob = new Blob([JSON.stringify(bundle,null,2)],{type:"application/json"});
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);
      a.download=`gm_${plantId.replace(/[^a-z0-9]+/gi,"_")}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href),500);
    }
  };

  // ---------- Plant Boot ----------
  // Each page sets window.GM_PLANT before including gm-kernel.js (optional).
  const PLANT = (window.GM_PLANT && typeof window.GM_PLANT === "object") ? window.GM_PLANT : {};
  const plantId = (PLANT.id || plantIdFromLocation());
  const primitive_ms = Number(PLANT.primitive_ms || DEFAULT_PRIMITIVE_MS);

  ensurePlant(plantId, {
    title: document.title,
    href: location.href,
    primitive_ms,
    signals: PLANT.signals || {}
  });

  // Signals enabled for this plant:
  const readWebsite = Adapters.website_interaction(plantId, primitive_ms);

  // Optional external JSON bridge (e.g., /osf-metrics.json)
  const extUrl = (PLANT.signals && PLANT.signals.external_json) ? String(PLANT.signals.external_json) : null;
  const readExternal = extUrl ? Adapters.external_json(extUrl) : null;

  async function tick(){
    const website = readWebsite();
    const osf = readExternal ? await readExternal() : null;

    const g = gaugesFromSignals({ website, osf });

    // update state
    const st = S.get(kState(plantId), blankEngine());
    const next = stepEngineFromGauges(st, g);
    S.set(kState(plantId), next);

    // log only when mode changes (reduce noise)
    const meta = S.get(kMeta(plantId), {});
    const prevMode = meta.last_mode || null;
    if(prevMode !== g.mode){
      logEvent(plantId, "mode", { from: prevMode, to: g.mode, at: ISO() });
      meta.last_mode = g.mode;
      meta.updated_at = ISO();
      S.set(kMeta(plantId), meta);
    }

    // expose read-only gauges to UI if needed
    window.GM_GAUGES = g;
    window.GM_LAST_SIGNAL = { website, osf };

    // fire hook (UI can subscribe)
    if(typeof window.GM_onTick === "function"){
      try{ window.GM_onTick({plantId, gauges:g, website, osf}); }catch(e){}
    }
  }

  // Start: immediate tick, then primitive cadence
  tick();
  setInterval(tick, primitive_ms);

  // Export globals
  window.GM = GM;
  window.GM_PLANT_ID = plantId;

})();
