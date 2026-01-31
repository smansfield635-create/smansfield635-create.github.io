/* /assets/fusion.js — Fusion Core (device-local receipts + optional live publish/fetch) */
(function(){
  const KEY = "gm_fusion_receipts_v1";

  // CONFIG (edit these 3 lines only when ready)
  const RECEIPT_ENDPOINT = ""; // e.g. "https://YOUR-WORKER.yourdomain.workers.dev/receipts"
  const LIVE_GAUGE_URL = "https://api.github.com/repos/smansfield635-create/smansfield635-create.github.io";
  const OSF_GAUGE_URL = ""; // e.g. "https://api.osf.io/v2/nodes/<NODE_ID>/"

  function nowISO(){ return new Date().toISOString(); }

  function load(){
    try{ return JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch(e){ return {}; }
  }

  function save(obj){
    localStorage.setItem(KEY, JSON.stringify(obj));
  }

  async function publish(payload){
    if(!RECEIPT_ENDPOINT) return { ok:false, skipped:true };
    try{
      const res = await fetch(RECEIPT_ENDPOINT, {
        method:"POST",
        headers:{ "content-type":"application/json" },
        body: JSON.stringify(payload)
      });
      return { ok: res.ok, status: res.status };
    }catch(e){
      return { ok:false, error:String(e) };
    }
  }

  async function fetchRemote(){
    if(!RECEIPT_ENDPOINT) return { ok:false, skipped:true };
    try{
      const res = await fetch(RECEIPT_ENDPOINT, { method:"GET" });
      if(!res.ok) return { ok:false, status:res.status };
      const j = await res.json();
      return { ok:true, data:j };
    }catch(e){
      return { ok:false, error:String(e) };
    }
  }

  // ENGINE receipt: SEL / RES / COM / CON
  async function receipt(engine, meta){
    const db = load();
    const stamp = { ts: nowISO(), meta: meta || {} };
    db[engine] = stamp;
    save(db);

    // publish best-effort (B)
    await publish({ engine, stamp, client_ts: stamp.ts });

    return stamp;
  }

  function getReceipts(){
    return load();
  }

  async function liveGauge(){
    // B gauge: live internet signal (GitHub API repo metadata)
    try{
      const res = await fetch(LIVE_GAUGE_URL, { headers:{ "accept":"application/vnd.github+json" }});
      if(!res.ok) return { ok:false, status:res.status };
      const j = await res.json();
      return {
        ok:true,
        source:"github api",
        ts: nowISO(),
        value: {
          pushed_at: j.pushed_at || null,
          updated_at: j.updated_at || null,
          stargazers_count: j.stargazers_count ?? null,
          watchers_count: j.watchers_count ?? null,
          forks_count: j.forks_count ?? null
        }
      };
    }catch(e){
      return { ok:false, error:String(e) };
    }
  }

  async function osfGauge(){
    // A gauge: OSF signal (requires you to set OSF_GAUGE_URL)
    if(!OSF_GAUGE_URL) return { ok:false, skipped:true };
    try{
      const res = await fetch(OSF_GAUGE_URL);
      if(!res.ok) return { ok:false, status:res.status };
      const j = await res.json();
      return { ok:true, source:"osf api", ts: nowISO(), value:j };
    }catch(e){
      return { ok:false, error:String(e) };
    }
  }

  // expose
  window.Fusion = {
    receipt,
    getReceipts,
    fetchRemote,
    publish,
    liveGauge,
    osfGauge
  };
})();
