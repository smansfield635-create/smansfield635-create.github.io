(() => {
  const WORKER_BASE = "https://geodiametrics-aggregator.smansfield635.workers.dev";
  const METRICS_URL = WORKER_BASE + "/metrics?t=" + Date.now();

  // highlight active nav
  const path = location.pathname.replace(/\/+$/,"/") || "/";
  document.querySelectorAll('a.pill').forEach(a=>{
    try{
      const href = new URL(a.href).pathname.replace(/\/+$/,"/") || "/";
      if(href === path) a.classList.add("active");
    }catch{}
  });

  // fill global gauge if present
  async function loadGlobal(){
    const elNums = document.getElementById("g_nums");
    const elLU   = document.getElementById("g_lu");
    const elMeta = document.getElementById("g_meta");
    if(!elNums) return;

    try{
      const r = await fetch(METRICS_URL, { cache:"no-store" });
      const j = await r.json();
      const m = j.metrics || {};
      elMeta.textContent = "Worker: " + WORKER_BASE + "/metrics";
      elNums.textContent = `Sessions ${m.sessions||0} · Pageviews ${m.pageviews||0} · Clicks ${m.clicks||0}`;
      if(elLU) elLU.textContent = m.lastUpdated ? new Date(m.lastUpdated).toLocaleString() : "—";

      const s = m.sessions||0, p=m.pageviews||0, c=m.clicks||0;
      const bar = (id,val,den) => { const e=document.getElementById(id); if(e) e.style.width=Math.min(100, Math.round((val/den)*100))+"%"; };
      bar("g_s", s, 1000); bar("g_p", p, 5000); bar("g_c", c, 5000);
    }catch(e){
      if(elMeta) elMeta.textContent = "Global unavailable";
      elNums.textContent = "—";
      if(elLU) elLU.textContent = "—";
    }
  }

  // fill device gauge if present
  function loadDevice(){
    const el = document.getElementById("d_nums");
    if(!el) return;
    try{
      const d = JSON.parse(localStorage.getItem("geo_live_site")||"{}");
      const s = d.interaction || {};
      el.textContent = `Sessions ${s.sessions_24h||0} · Pageviews ${s.pageviews_24h||0} · Clicks ${s.clicks_24h||0}`;
      const meta = document.getElementById("d_meta");
      if(meta) meta.textContent = d.timestamp ? ("Updated: " + d.timestamp) : "—";
      const t = document.getElementById("d_t");
      if(t) t.textContent = String(s.avg_time_sec||0);

      const bar = (id,val,den) => { const e=document.getElementById(id); if(e) e.style.width=Math.min(100, Math.round((val/den)*100))+"%"; };
      bar("d_s", s.sessions_24h||0, 200);
      bar("d_p", s.pageviews_24h||0, 800);
      bar("d_c", s.clicks_24h||0, 1200);
    }catch{}
  }

  loadGlobal();
  loadDevice();
})();
