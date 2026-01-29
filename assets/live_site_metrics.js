(function(){
  const WORKER = "PASTE_WORKER_BASE_URL"; // no trailing slash
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
