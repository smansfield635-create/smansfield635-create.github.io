(function () {
  'use strict';
  const POLL_MS = 60000, STALE_MS = 90 * 60000;
  const count = x => typeof x === 'number' && Number.isSafeInteger(x) && x >= 0;
  function validate(d, now = Date.now()) {
    const time = Date.parse(d?.generatedAt), end = Date.parse(d?.window30d?.end), start = Date.parse(d?.window30d?.start);
    if (d?.schema !== 'DGB_PUBLIC_ANALYTICS_V1' || !Number.isFinite(time) || !Number.isFinite(end) || !Number.isFinite(start) || time > now + 300000 || end > time || start >= end) throw Error('Invalid snapshot time');
    const s = d.summary;
    if (!s || ![s.pageLoads, s.botPageLoads, s.nonBotPageLoads].every(count) || s.botPageLoads + s.nonBotPageLoads !== s.pageLoads) throw Error('Invalid totals');
    for (const [list, key] of [[d.topPages, 'path'], [d.referrers, 'host']]) {
      if (!Array.isArray(list) || list.length > 50 || list.some(x => typeof x[key] !== 'string' || x[key].length > 2000 || !count(x.pageLoads) || !count(x.visits))) throw Error('Invalid ranking');
    }
    if (!count(d.ownerMeasurement?.qualifiedDeviceCount) || d.ownerMeasurement.qualifiedDeviceCount > 3) throw Error('Invalid heartbeat count');
    if (d.daily !== undefined) {
      const lastDay = Date.parse(new Date(end).toISOString().slice(0,10));
      if (!Array.isArray(d.daily) || d.daily.length !== 30 || d.daily.some((x,i) =>
        x?.date !== new Date(lastDay - (29-i)*86400000).toISOString().slice(0,10) || !count(x.pageLoads))) throw Error('Invalid daily history');
    }
    return d;
  }
  function freshness(d, now, failed) {
    if (failed) return {state:'unavailable', text:d ? 'Check unavailable · showing the last valid snapshot' : 'Snapshot unavailable · retrying automatically'};
    if (!d) return {state:'loading', text:'Loading the latest snapshot…'};
    return now - Date.parse(d.window30d.end) > STALE_MS ? {state:'delayed', text:'Data delayed · showing the last valid snapshot'} : {state:'current', text:'Latest published snapshot · automatic checks on'};
  }
  function createController({fetchSnapshot, render, report, now = Date.now}) {
    let snapshot = null, busy = false;
    return {async refresh() {
      if (busy) return;
      busy = true; report({snapshot,busy:true});
      let error = false;
      try {
        const next = validate(await fetchSnapshot(), now());
        if (snapshot && (Date.parse(next.generatedAt) < Date.parse(snapshot.generatedAt) || Date.parse(next.window30d.end) < Date.parse(snapshot.window30d.end))) throw Error('Older snapshot received');
        if (!snapshot || JSON.stringify(snapshot) !== JSON.stringify(next)) { render(next); snapshot = next; }
      } catch (_) { error = true; }
      finally { busy = false; report({snapshot,busy:false,checkedAt:now(),error}); }
    }};
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {validate,freshness,createController,POLL_MS,STALE_MS};
  if (typeof document === 'undefined') return;
  const root = document.querySelector('#dashboard');
  if (!root) return;
  const el = id => document.getElementById(id), fmt = n => n.toLocaleString();
  const labelDate = value => new Date(value).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'});
  const labelDay = value => new Date(value+'T00:00:00Z').toLocaleDateString([], {month:'short',day:'numeric',timeZone:'UTC'});
  let last = {snapshot:null,error:false};
  function status() { const s = freshness(last.snapshot, Date.now(), last.error); el('status').dataset.state=s.state; el('status').textContent=s.text; }
  function ranking(id, rows, key, metric) {
    const nodes = rows.map(x => { const li=document.createElement('li'),name=document.createElement('span'),value=document.createElement('span'); name.className='rank-name';name.textContent=x[key]==='(none)'?'No referrer reported':x[key];value.className='rank-value';value.textContent=fmt(x[metric]);li.append(name,value);return li; });
    el(id).replaceChildren(...nodes);
  }
  function render(d) {
    for (const [id,value] of [['nonbot',d.summary.nonBotPageLoads],['bots',d.summary.botPageLoads],['total',d.summary.pageLoads],['devices',d.ownerMeasurement.qualifiedDeviceCount],['google',d.referrers.filter(x => ['www.google.com','google.com'].includes(x.host)).reduce((n,x)=>n+x.visits,0)]]) el(id).textContent=fmt(value);
    if (!d.referrers.some(x => ['www.google.com','google.com'].includes(x.host))) el('google').textContent='—';
    el('data-through').textContent='Data through '+labelDate(d.window30d.end);
    el('window').textContent=new Date(d.window30d.start).toLocaleDateString()+' – '+new Date(d.window30d.end).toLocaleDateString();
    ranking('top-pages',d.topPages.slice(0,8),'path','pageLoads');
    ranking('referrers',d.referrers.filter(x=>x.visits>0).sort((a,b)=>b.visits-a.visits).slice(0,8),'host','visits');
    const daily=d.daily || [], peak=Math.max(1,...daily.map(x=>x.pageLoads));
    el('trend').replaceChildren(...daily.map(x => {const bar=document.createElement('div');bar.className='bar';bar.style.setProperty('--height',(x.pageLoads/peak*145)+'px');bar.title=labelDay(x.date)+': '+fmt(x.pageLoads)+' page loads';bar.setAttribute('aria-hidden','true');return bar;}));
    el('trend').setAttribute('aria-label',daily.length ? 'Daily page-load trend. Exact values are available in View daily values below.' : 'Daily history has not yet been published.');
    el('daily-values').replaceChildren(...daily.map(x=>{const tr=document.createElement('tr'),date=document.createElement('th'),value=document.createElement('td');date.scope='row';date.textContent=x.date;value.textContent=fmt(x.pageLoads);tr.append(date,value);return tr;}));
    el('trend-note').textContent=daily.length ? labelDay(daily[0].date)+' – '+labelDay(daily.at(-1).date)+' · last day is partial' : 'Daily history will appear when the updated collector publishes its next snapshot.';
    root.dataset.ready='true'; root.dataset.generatedAt=d.generatedAt;
  }
  const controller=createController({fetchSnapshot:async()=>{
    const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),15000);
    try {const r=await fetch(root.dataset.snapshotUrl+'?check='+Date.now(),{cache:'no-store',signal:abort.signal});if(!r.ok)throw Error('Snapshot unavailable');return await r.json();}finally{clearTimeout(timeout);}
  },render,report:state=>{
    el('refresh').disabled=state.busy;el('refresh').textContent=state.busy?'Checking…':'Check now';
    if(!state.busy){last=state;el('last-checked').textContent='Last checked '+labelDate(state.checkedAt)+(state.error?' · failed':'');status();}
  }});
  el('refresh').addEventListener('click',()=>controller.refresh());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)controller.refresh();});
  window.addEventListener('pageshow',event=>{if(event.persisted)controller.refresh();});
  setInterval(()=>{status();if(!document.hidden)controller.refresh();},POLL_MS);
  controller.refresh();
})();
