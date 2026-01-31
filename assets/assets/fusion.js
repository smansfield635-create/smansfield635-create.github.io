/* TNT — /assets/fusion.js (CREATE/REPLACE FULL FILE) */
(function(){
  const KEY="gm_fusion_receipts_v1";
  const RECEIPT_ENDPOINT=""; /* OPTIONAL: set later to your Worker URL */
  const LIVE_GAUGE_URL="https://api.github.com/repos/smansfield635-create/smansfield635-create.github.io";
  const OSF_GAUGE_URL=""; /* OPTIONAL: set later to OSF API URL */

  function nowISO(){return new Date().toISOString();}
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}");}catch(e){return {};}}
  function save(x){localStorage.setItem(KEY,JSON.stringify(x));}

  async function publish(payload){
    if(!RECEIPT_ENDPOINT) return {ok:false,skipped:true};
    try{
      const res=await fetch(RECEIPT_ENDPOINT,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
      return {ok:res.ok,status:res.status};
    }catch(e){return {ok:false,error:String(e)};}
  }

  async function fetchRemote(){
    if(!RECEIPT_ENDPOINT) return {ok:false,skipped:true};
    try{
      const res=await fetch(RECEIPT_ENDPOINT,{method:"GET"});
      if(!res.ok) return {ok:false,status:res.status};
      return {ok:true,data:await res.json()};
    }catch(e){return {ok:false,error:String(e)};}
  }

  async function receipt(engine,meta){
    const db=load();
    const stamp={ts:nowISO(),meta:meta||{}};
    db[engine]=stamp;
    save(db);
    await publish({engine,stamp,client_ts:stamp.ts});
    return stamp;
  }

  function getReceipts(){return load();}

  async function liveGauge(){
    try{
      const res=await fetch(LIVE_GAUGE_URL,{headers:{"accept":"application/vnd.github+json"}});
      if(!res.ok) return {ok:false,status:res.status};
      const j=await res.json();
      return {ok:true,source:"github api",ts:nowISO(),value:{
        pushed_at:j.pushed_at||null,updated_at:j.updated_at||null,
        stargazers_count:j.stargazers_count??null,watchers_count:j.watchers_count??null,forks_count:j.forks_count??null
      }};
    }catch(e){return {ok:false,error:String(e)};}
  }

  async function osfGauge(){
    if(!OSF_GAUGE_URL) return {ok:false,skipped:true};
    try{
      const res=await fetch(OSF_GAUGE_URL);
      if(!res.ok) return {ok:false,status:res.status};
      return {ok:true,source:"osf api",ts:nowISO(),value:await res.json()};
    }catch(e){return {ok:false,error:String(e)};}
  }

  window.Fusion={receipt,getReceipts,fetchRemote,liveGauge,osfGauge};
})();
