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
  // Compare equal, complete UTC periods anchored to this snapshot, excluding its partial last day.
  function compareWeeks(daily) {
    if (!Array.isArray(daily) || daily.length < 15) return null;
    const complete=daily.slice(0,-1), current=complete.slice(-7), previous=complete.slice(-14,-7);
    const sum=rows=>rows.reduce((n,x)=>n+x.pageLoads,0), total=sum(current), baseline=sum(previous), delta=total-baseline;
    return {total,baseline,delta,percent:baseline ? delta/baseline*100 : null,currentStart:current[0].date,currentEnd:current.at(-1).date,previousStart:previous[0].date,previousEnd:previous.at(-1).date};
  }
  function safeDestination(value) {
    if (typeof value!=='string' || !value.startsWith('/') || value.startsWith('//') || /[\\\x00-\x20]/.test(value)) return null;
    try {const url=new URL(value,'https://diamondgatebridge.com');return url.origin==='https://diamondgatebridge.com' && !url.pathname.startsWith('//') ? url.pathname+url.search+url.hash : null;} catch {return null;}
  }
  const PAGE_NAMES={'/':'Home','/showroom/globe/audralia/':'Audralia','/mirror-manor-preview/':'Mirror Manor preview','/showroom/globe/h-earth/awards/':'Awards','/campaigns/consider-the-energy/':'Consider the Energy','/evidence/agentic-frontier/':'Agentic Frontier','/products/education/':'Education','/build/':'Build your own website','/analytics/':'Analytics'};
  function groupPages(rows) {
    const groups=new Map();
    for (const x of rows) {
      // GitHub Pages serves the same root index.html for these two known homepage routes.
      const key=x.path==='/index.html'?'/':x.path;
      if(!groups.has(key))groups.set(key,{key,label:PAGE_NAMES[key]||key,href:safeDestination(key),value:0,sources:[]});
      const group=groups.get(key);group.value+=x.pageLoads;group.sources.push({label:x.path,value:x.pageLoads});
    }
    return [...groups.values()].sort((a,b)=>b.value-a.value);
  }
  function groupReferrers(rows) {
    const groups=new Map();
    for (const x of rows) {
      if(!x.visits)continue;
      const host=x.host.toLowerCase();
      const key=host==='facebook.com'||host.endsWith('.facebook.com')?'Facebook':host==='instagram.com'||host.endsWith('.instagram.com')?'Instagram':['google.com','www.google.com'].includes(host)?'Google':['bing.com','www.bing.com'].includes(host)?'Bing':['chatgpt.com','www.chatgpt.com'].includes(host)?'ChatGPT':host==='(none)'?'No referrer reported':x.host;
      if(!groups.has(key))groups.set(key,{key,label:key,value:0,sources:[]});
      const group=groups.get(key);group.value+=x.visits;group.sources.push({label:x.host,value:x.visits});
    }
    return [...groups.values()].sort((a,b)=>b.value-a.value);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {validate,freshness,createController,POLL_MS,STALE_MS,compareWeeks,safeDestination,groupPages,groupReferrers};
  if (typeof document === 'undefined') return;
  const root = document.querySelector('#dashboard');
  if (!root) return;
  const el = id => document.getElementById(id), fmt = n => n.toLocaleString();
  const labelDate = value => new Date(value).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'});
  const labelDay = value => new Date(value+'T00:00:00Z').toLocaleDateString([], {month:'short',day:'numeric',timeZone:'UTC'});
  let last = {snapshot:null,error:false};
  function status() { const s = freshness(last.snapshot, Date.now(), last.error); el('status').dataset.state=s.state; el('status').textContent=s.text; }
  function ranking(id, rows) {
    const nodes=rows.map(x=>{
      const li=document.createElement('li'),name=document.createElement('div'),label=document.createElement(x.href?'a':'span'),value=document.createElement('span');
      name.className='rank-name';label.textContent=x.label;if(x.href)label.href=x.href;
      name.append(label);value.className='rank-value';value.textContent=fmt(x.value);
      const detail=document.createElement('details'),summary=document.createElement('summary'),list=document.createElement('ul');
      summary.textContent=x.sources.length>1?'View '+x.sources.length+' combined entries':'View recorded entry';
      x.sources.forEach(source=>{const row=document.createElement('li');row.textContent=source.label+' · '+fmt(source.value);list.append(row)});
      detail.append(summary,list);name.append(detail);li.append(name,value);return li;
    });
    el(id).replaceChildren(...nodes);
  }
  let chartDays=[],selectedDate=null;
  function selectDay(index) {
    if(!chartDays.length)return;
    index=Math.max(0,Math.min(chartDays.length-1,Number(index)));const day=chartDays[index];selectedDate=day.date;
    const label=labelDay(day.date)+': '+fmt(day.pageLoads)+' page loads'+(index===chartDays.length-1?' · partial day':'');
    el('day-picker').value=String(index);el('day-picker').setAttribute('aria-valuetext',label);el('selected-day').textContent=label;
    el('day-previous').disabled=index===0;el('day-next').disabled=index===chartDays.length-1;
    [...el('trend').children].forEach((bar,i)=>bar.classList.toggle('selected',i===index));
  }
  el('day-picker').addEventListener('input',event=>selectDay(event.target.value));
  el('day-previous').addEventListener('click',()=>selectDay(Number(el('day-picker').value)-1));
  el('day-next').addEventListener('click',()=>selectDay(Number(el('day-picker').value)+1));
  function render(d) {
    for (const [id,value] of [['nonbot',d.summary.nonBotPageLoads],['bots',d.summary.botPageLoads],['total',d.summary.pageLoads],['devices',d.ownerMeasurement.qualifiedDeviceCount],['google',d.referrers.filter(x => ['www.google.com','google.com'].includes(x.host)).reduce((n,x)=>n+x.visits,0)]]) el(id).textContent=fmt(value);
    if (!d.referrers.some(x => ['www.google.com','google.com'].includes(x.host))) el('google').textContent='—';
    el('data-through').textContent='Data through '+labelDate(d.window30d.end);
    el('window').textContent=new Date(d.window30d.start).toLocaleDateString()+' – '+new Date(d.window30d.end).toLocaleDateString();
    ranking('top-pages',groupPages(d.topPages).slice(0,8));
    ranking('referrers',groupReferrers(d.referrers).slice(0,8));
    const daily=d.daily || [], peak=Math.max(1,...daily.map(x=>x.pageLoads)), step=Math.max(1,Math.ceil(peak/4/Math.pow(10,Math.floor(Math.log10(peak))))*Math.pow(10,Math.floor(Math.log10(peak)))), ceiling=step*4;
    chartDays=daily;
    const week=compareWeeks(daily);
    if(week){
      const direction=week.delta>0?'Up':week.delta<0?'Down':'No change';
      el('week-change').textContent=week.baseline===0?(week.total===0?'No change · 0 page loads':'Up from 0 to '+fmt(week.total)+' page loads'):direction+(week.delta===0?'':' '+Math.abs(week.percent).toLocaleString([],{maximumFractionDigits:1})+'%')+' · '+fmt(week.total)+' page loads';
      el('week-periods').textContent=labelDay(week.currentStart)+'–'+labelDay(week.currentEnd)+' ('+fmt(week.total)+') versus '+labelDay(week.previousStart)+'–'+labelDay(week.previousEnd)+' ('+fmt(week.baseline)+'). Complete UTC days; the snapshot’s partial final day is excluded.';
    }else{el('week-change').textContent='Comparison unavailable';el('week-periods').textContent='Waiting for enough daily history.';}
    el('trend-scale').replaceChildren(...[4,3,2,1,0].map(n=>{const span=document.createElement('span');span.textContent=fmt(step*n);return span;}));
    el('trend').replaceChildren(...daily.map((x,i)=>{const bar=document.createElement('div');bar.className='bar';bar.style.setProperty('--height',(x.pageLoads/ceiling*100)+'%');bar.title=labelDay(x.date)+': '+fmt(x.pageLoads)+' page loads';bar.setAttribute('aria-hidden','true');bar.addEventListener('click',()=>selectDay(i));return bar;}));
    el('trend-dates').replaceChildren(...(daily.length?[daily[0],daily[Math.floor((daily.length-1)/2)],daily.at(-1)]:[]).map(x=>{const span=document.createElement('span');span.textContent=labelDay(x.date);return span;}));
    el('chart-controls').hidden=!daily.length;
    if(daily.length){el('day-picker').max=String(daily.length-1);const selected=daily.findIndex(x=>x.date===selectedDate);selectDay(selected<0?daily.length-1:selected);}
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
