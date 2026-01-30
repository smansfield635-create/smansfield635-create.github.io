  (function(){
  const WORKER_BASE = "https://geodiametrics-aggregator.smansfield635.workers.dev";
  const COLLECT = WORKER_BASE + "/collect";

  const nowISO = () => new Date().toISOString();
  const nowMS  = () => Date.now();

  const KEY_LOCAL = "geo_live_site";
  const KEY_SESS  = "geo_session_stamp";

  function load(k){ try{return JSON.parse(localStorage.getItem(k))||null}catch{return null} }
  function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }

  // ---------- DEVICE LOCAL ----------
  const st = load(KEY_LOCAL) || {
    timestamp: nowISO(),
    interaction:{ sessions_24h:0, pageviews_24h:0, clicks_24h:0, avg_time_sec:0 },
    _sessionStart:0,
    _timeTotal:0
  };

  st.interaction.pageviews_24h += 1;
  st._sessionStart = nowMS();
  st.timestamp = nowISO();
  save(KEY_LOCAL, st);

  // ---------- GLOBAL COLLECT ----------
  const ref = document.referrer || "";

  function post(body){
    fetch(COLLECT, {
      method:"POST",
      headers:{ "content-type":"application/json" },
      body: JSON.stringify(body)
    }).catch(()=>{});
  }

  // pageview always
  post({ pageview:true, referrer: ref });

  // session once per 10 minutes per device
  const stamp = Number(localStorage.getItem(KEY_SESS) || 0);
  const TEN_MIN = 10*60*1000;
  const newSession = (nowMS() - stamp) > TEN_MIN;

  if(newSession){
    localStorage.setItem(KEY_SESS, String(nowMS()));
    st.interaction.sessions_24h += 1;
    st.timestamp = nowISO();
    save(KEY_LOCAL, st);
    post({ session:true, referrer: ref });
  }

  // click tracking (global + local)
  document.addEventListener("click", ()=>{
    st.interaction.clicks_24h += 1;
    st.timestamp = nowISO();
    save(KEY_LOCAL, st);
    post({ click:true, referrer: ref });
  });

  // avg time local only
  window.addEventListener("beforeunload", ()=>{
    const dur = Math.round((nowMS() - st._sessionStart)/1000);
    st._timeTotal += dur;
    const sessions = Math.max(1, st.interaction.sessions_24h);
    st.interaction.avg_time_sec = Math.round(st._timeTotal / sessions);
    st.timestamp = nowISO();
    save(KEY_LOCAL, st);
  });
})();
