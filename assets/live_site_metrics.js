(function(){
  // GLOBAL WORKER (LIVE AGGREGATION)
  const WORKER_URL = "https://geodiametrics-aggregator.smansfield635.workers.dev/";

  // LOCAL (DEVICE) STORAGE
  const KEY_LOCAL = "geo_live_site";
  const KEY_GLOBAL = "geo_global_metrics";

  const now = () => new Date().toISOString();

  function load(key){
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
  }
  function save(key, obj){
    localStorage.setItem(key, JSON.stringify(obj));
  }

  // ---------- DEVICE LIVE (local) ----------
  const st = load(KEY_LOCAL) || {
    timestamp: now(),
    interaction:{ sessions_24h:0, pageviews_24h:0, clicks_24h:0, avg_time_sec:0 },
    sources_24h:[
      {label:"Direct",value:0},
      {label:"OSF",value:0},
      {label:"GitHub",value:0},
      {label:"Other",value:0}
    ],
    _sessionStart:0,
    _timeTotal:0
  };

  st.interaction.sessions_24h += 1;
  st.interaction.pageviews_24h += 1;
  st._sessionStart = Date.now();
  st.timestamp = now();
  save(KEY_LOCAL, st);

  document.addEventListener("click", ()=>{
    st.interaction.clicks_24h += 1;
    st.timestamp = now();
    save(KEY_LOCAL, st);
  });

  window.addEventListener("beforeunload", ()=>{
    const dur = Math.round((Date.now() - st._sessionStart) / 1000);
    st._timeTotal += dur;
    const sessions = Math.max(1, st.interaction.sessions_24h);
    st.interaction.avg_time_sec = Math.round(st._timeTotal / sessions);
    st.timestamp = now();
    save(KEY_LOCAL, st);
  });

  // ---------- GLOBAL LIVE (worker) ----------
  // Ping once per page load. Worker increments global counters.
  // Store the returned global snapshot locally so Control can display instantly.
  fetch(WORKER_URL, { method: "GET" })
    .then(r => r.json())
    .then(j => {
      // Expected shape:
      // { status:"OPERATIONAL", scope:"GLOBAL", metrics:{ sessions, pageviews, clicks, lastUpdated } }
      save(KEY_GLOBAL, {
        fetchedAt: now(),
        worker: WORKER_URL,
        payload: j
      });
    })
    .catch(()=>{ /* silent */ });

})();
