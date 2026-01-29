(function(){
  const KEY="geo_live_site";
  const now=()=>new Date().toISOString();
  function load(){ try{return JSON.parse(localStorage.getItem(KEY))||null}catch{return null} }
  function save(o){ localStorage.setItem(KEY, JSON.stringify(o)); }

  const st = load() || {
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
  save(st);

  document.addEventListener("click", ()=>{ st.interaction.clicks_24h += 1; st.timestamp=now(); save(st); });

  window.addEventListener("beforeunload", ()=>{
    const dur=Math.round((Date.now()-st._sessionStart)/1000);
    st._timeTotal += dur;
    const sessions=Math.max(1, st.interaction.sessions_24h);
    st.interaction.avg_time_sec = Math.round(st._timeTotal / sessions);
    st.timestamp = now();
    save(st);
  });
})();
