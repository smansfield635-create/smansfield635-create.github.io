/* LBS browser-local résumé source index, v1. No copied résumé contents. */
(() => {
  'use strict';
  const VERSION = 'LBS_BROWSER_LINK_INVENTORY_v1';
  const DB_NAME = 'dgb_lbs_resume_link_index_v1';
  const DB_VERSION = 1;
  const ROWS_PER_PAGE = 25;
  const PUBLIC_API = 'https://api.github.com';
  const INDEX_API = 'https://index.commoncrawl.org';
  const PINNED = Object.freeze([
    {repository:'elliottdehn/open-jobs', ref:'0688696578f7eba23b2978a6d32583e0e18cb653'},
    {repository:'ar-nelson/resume', ref:'b84fcd1549122d921ac141e1f563c424e5779044'}
  ]);
  const LABELS = {
    originals: 'First-party public originals',
    repoSearch: 'GitHub résumé repositories',
    portfolioSearch: 'GitHub CV & portfolios',
    commonCrawl: 'Common Crawl web index'
  };
  let db = null;
  let docs = [];
  let scans = [];
  let page = 0;
  let running = false;
  const el = id => document.getElementById(id);
  const number = n => Number(n||0).toLocaleString('en-US');
  const setText = (id, v) => { el(id).textContent = String(v); };
  const nowISO = () => new Date().toISOString();
  const safeRepo = s => typeof s==='string' && /^[A-Za-z0-9_.-]{1,100}\/[A-Za-z0-9_.-]{1,100}$/.test(s) && !s.split('/').includes('..');
  const safeSha = s => typeof s==='string' && /^[0-9a-f]{40}$/i.test(s);
  const pathMatches = p => /\.(pdf|docx?|txt|md|html?)$/i.test(p) && /(^|[\/_.-])(resume|resumes|cv|curriculum[-_. ]?vitae)(?=$|[\/_.-])/i.test(p);
  const validFile = (repo, path) => {
    if(typeof path !== 'string' || path.length>350 || path.includes('..') || !/\.(pdf|docx?|txt|md|html?)$/i.test(path)) return false;
    if(pathMatches(path)) return true;
    return /(^|\/)resume(s)?$/i.test(repo.split('/')[1]) && /^(README\.md|resume\.pdf|cv\.pdf)$/i.test(path);
  };
  const filename = p => p.split('/').pop()||p;
  const sourceUrl = (repo, ref, path) => `${'https://github.com/'}${repo}/blob/${encodeURIComponent(ref)}/${path.split('/').map(encodeURIComponent).join('/')}`;
  function normalizeUrl(url){
    try {
      const u = new URL(url);
      if(!['https:','http:'].includes(u.protocol)||!u.hostname.includes('.')||u.username||u.password||url.length>2100) return null;
      u.hash=''; u.hostname=u.hostname.toLowerCase();return u.toString();
    }catch{return null;}
  }
  function openDb(){
    return new Promise((resolve,reject)=>{
      if(!window.indexedDB) return reject(new Error('Browser storage is unavailable'));
      const r=indexedDB.open(DB_NAME,DB_VERSION);
      r.onupgradeneeded=()=>{
        const d=r.result;
        if(!d.objectStoreNames.contains('documents'))d.createObjectStore('documents',{keyPath:'id'});
        if(!d.objectStoreNames.contains('scans'))d.createObjectStore('scans',{keyPath:'id'});
        if(!d.objectStoreNames.contains('settings'))d.createObjectStore('settings',{keyPath:'key'});
      };
      r.onsuccess=()=>resolve(r.result);
      r.onerror=()=>reject(r.error||new Error('Unable to open inventory database'));
    });
  }
  function all(store){return new Promise((resolve,reject)=>{
    const req=db.transaction(store,'readonly').objectStore(store).getAll();
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });}
  function single(store, key){return new Promise((resolve,reject)=>{
    const req=db.transaction(store,'readonly').objectStore(store).get(key);
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });}
  function put(store,item){return new Promise((resolve,reject)=>{
    const tx=db.transaction(store,'readwrite'); tx.objectStore(store).put(item);
    tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);
  });}
  function clearAll(){return new Promise((resolve,reject)=>{
    const tx=db.transaction(['documents','scans','settings'],'readwrite');
    for(const store of ['documents','scans','settings'])tx.objectStore(store).clear();
    tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);
  });}
  function upsert(item,channel){
    return new Promise((resolve,reject)=>{
      const tx=db.transaction('documents','readwrite');
      const store=tx.objectStore('documents');const req=store.get(item.id);
      let wasNew=false,addedUrl=false;
      req.onsuccess=()=>{
        const prev=req.result;
        if(prev){
          const urls=Array.isArray(prev.urls)?prev.urls:[];
          addedUrl=!urls.includes(item.url);
          if(addedUrl)urls.push(item.url);
          prev.urls=urls;
          prev.channels=Array.from(new Set([...(prev.channels||[]),channel])).sort();
          prev.lastSeenAt=nowISO();
          prev.hosts=Array.from(new Set([...(prev.hosts||[]),item.host])).sort();
          store.put(prev);
        }else{
          wasNew=true;addedUrl=true;
          store.put({id:item.id,name:item.name,firstSource:channel,channels:[channel],urls:[item.url],hosts:[item.host],firstSeenAt:nowISO(),lastSeenAt:nowISO(),exactBlob:item.exactBlob||null,review:'PENDING_UNVERIFIED',kind:item.kind||'file'});
        }
      };
      tx.oncomplete=()=>resolve({newCandidate:wasNew,newUrl:addedUrl});
      tx.onerror=()=>reject(tx.error);
    });
  }
  async function recordScan(channel,{fetched,found,newCandidates,newUrls,status,detail=''}){
    await put('scans',{id:`${Date.now()}-${Math.random().toString(36).slice(2)}`,channel,at:nowISO(),fetched,found,newCandidates,newUrls,status,detail:String(detail).slice(0,130)});
  }
  const describeError = error => {
    if(error?.name==='AbortError')return 'Timeout: public source did not respond.';
    if(error?.status===403||error?.status===429)return 'Public API rate limit or access restriction ('+error.status+'). Try later.';
    if(error?.status===504)return 'Common Crawl returned HTTP 504. Source held; no results assumed.';
    if(error?.status)return 'Public metadata service returned HTTP '+error.status+'.';
    if(error instanceof TypeError)return 'Public metadata endpoint unavailable or blocked by browser (network/CORS).';
    return String(error?.message||'Unknown source failure').slice(0,120);
  };
  async function fetchJson(url,{ndjson=false}={}){
    const u=new URL(url);
    if(u.protocol!=='https:'||!['api.github.com','index.commoncrawl.org'].includes(u.hostname)) throw new Error('Unregistered metadata endpoint');
    const ctl=new AbortController(); const timer=setTimeout(()=>ctl.abort(),15000);
    try{
      const res=await fetch(url,{headers:{'Accept':'application/vnd.github+json, application/json'},cache:'no-store',signal:ctl.signal,redirect:'error'});
      if(!res.ok){let e=new Error('Source HTTP '+res.status);e.status=res.status;throw e;}
      const len=Number(res.headers.get('content-length')||'0');if(len>1500000)throw new Error('Public metadata response exceeds limit');
      const reader=res.body?.getReader(); if(!reader)throw new Error('Metadata response stream unavailable');
      const parts=[];let size=0;
      while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>1500000){await reader.cancel();throw new Error('Public metadata response exceeds limit');}parts.push(value);}
      const out=new Uint8Array(size);let at=0;for(const part of parts){out.set(part,at);at+=part.byteLength;}
      const text=new TextDecoder().decode(out);
      return ndjson?text.split('\n').filter(Boolean).map(line=>JSON.parse(line)):JSON.parse(text);
    } finally {clearTimeout(timer);}
  }
  async function fromTree(repo,ref,channel){
    if(!safeRepo(repo)||!ref||String(ref).length>80)throw new Error('Public repository metadata identity invalid');
    const tree=await fetchJson(`${PUBLIC_API}/repos/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`);
    if(tree.truncated)throw new Error('Public repository tree truncated. Not counted.');
    if(!Array.isArray(tree.tree)||tree.tree.length>6000)throw new Error('Public repository tree exceeds cap');
    let files=[];
    for(const item of tree.tree){
      if(files.length>=50)break;
      if(item?.type!=='blob'||!validFile(repo,item.path)||!safeSha(item.sha))continue;
      const url=normalizeUrl(sourceUrl(repo,ref,item.path));if(!url)continue;
      files.push({id:'gitblob:'+item.sha.toLowerCase(),name:filename(item.path),url,host:'github.com',exactBlob:item.sha.toLowerCase(),kind:'file'});
    }
    return files;
  }
  async function publicRepoSearch(channel,query){
    const q = query.trim().replace(/[^a-zA-Z0-9 _.\-]/g,'').slice(0,65) || (channel==='portfolioSearch'?'cv':'resume');
    const expr = `${q} in:name`;
    const u=new URL(`${PUBLIC_API}/search/repositories`);
    u.search=new URLSearchParams({q:expr,sort:'updated',order:'desc',per_page:'15'}).toString();
    const data=await fetchJson(u.toString());
    if(!Array.isArray(data.items))throw new Error('Public repository search response invalid');
    let records=[],seen=new Set(),attempted=0,holds=0;
    for(const r of data.items){
      if(attempted>=6||records.length>=80)break;
      if(!safeRepo(r.full_name)||r.private||!r.default_branch)continue;
      if(seen.has(r.full_name))continue;seen.add(r.full_name);attempted++;
      try{records.push(...await fromTree(r.full_name,r.default_branch,channel));}catch(e){holds++;}
    }
    return {records:records.slice(0,80),requests:1+attempted,holds};
  }
  async function firstParty(){
    let records=[],holds=0,attempted=0;
    for(const x of PINNED){attempted++;try{records.push(...await fromTree(x.repository,x.ref,'originals'));}catch(e){holds++;}}
    if(!records.length&&holds)throw new Error('Pinned public originals metadata unavailable');
    return {records,requests:attempted,holds};
  }
  async function commonCrawl(input){
    const domain=input.trim().toLowerCase();
    if(!/^[a-z0-9.-]{3,180}$/.test(domain)||domain.startsWith('.')||!domain.includes('.')||domain.includes('..')||domain.endsWith('.local'))throw new Error('Enter a public source domain, for example cs.stanford.edu');
    const indices=await fetchJson(`${INDEX_API}/collinfo.json`);
    const id=indices?.[0]?.id;
    if(typeof id!=='string'||!/^CC-MAIN-\d{4}-\d{2}$/.test(id))throw new Error('Common Crawl index unavailable');
    const args=new URLSearchParams({url:domain+'/*',output:'json',filter:'url:.*(resume|curriculum.vitae|/cv[./_-]).*',collapse:'urlkey'});
    const rows=await fetchJson(`${INDEX_API}/${id}-index?${args}`,{ndjson:true});
    let records=[];
    for(const r of rows.slice(0,400)){
      if(records.length>=50)break;
      const url=normalizeUrl(r.url||'');if(!url||String(r.status)!=='200')continue;
      const u=new URL(url);if(u.hostname!==domain||!pathMatches(u.pathname))continue;
      records.push({id:'url:'+url,name:filename(u.pathname),url,host:u.hostname,exactBlob:null,kind:'web-index'});
    }
    return {records,requests:2,holds:0};
  }
  function setStatus(message,type=''){
    const node=el('scanStatus');node.className='status'+(type?' '+type:'');node.textContent=message;
  }
  async function scanChannel(channel,query){
    if(running||!db)return;
    running=true;el('scan').disabled=true;el('scanOriginals').disabled=true;
    setStatus('Searching public metadata and reconciling source identities…');
    let attempts=0,found=0,unique=0,newUrls=0;
    try{
      const result= channel==='originals'?await firstParty():channel==='commonCrawl'?await commonCrawl(query):await publicRepoSearch(channel,query);
      attempts=result.requests;const uniqueInRun=new Map();for(const item of result.records){if(!uniqueInRun.has(item.url))uniqueInRun.set(item.url,item);}
      found=uniqueInRun.size;
      for(const item of uniqueInRun.values()){
        const observation=await upsert(item,channel);
        unique+=Number(observation.newCandidate);newUrls+=Number(observation.newUrl);
      }
      await recordScan(channel,{fetched:attempts,found,newCandidates:unique,newUrls,status:result.holds?'PARTIAL_PASS':'PASS',detail:result.holds?`${result.holds} public metadata sources unavailable`:''});
      setStatus(`${LABELS[channel]}: ${found} original links observed, ${newUrls} new URLs, ${unique} new distinct file candidates.${result.holds?` ${result.holds} source holds.`:''}`,'good');
      await refresh();
    }catch(error){
      await recordScan(channel,{fetched:attempts,found,newCandidates:unique,newUrls,status:'HOLD',detail:describeError(error)}).catch(()=>{});
      setStatus(`${LABELS[channel]} held: ${describeError(error)}`,'bad');
      await refresh();
    }finally{running=false;el('scan').disabled=false;el('scanOriginals').disabled=false;}
  }
  function textCell(tr,text,cls=''){
    const td=document.createElement('td');td.textContent=String(text);if(cls)td.className=cls;tr.append(td);return td;
  }
  function channelsSummary(){
    const chan=new Map();
    for(const [id,label] of Object.entries(LABELS))chan.set(id,{id,label,new:0,observed:0,scans:0});
    for(const doc of docs){
      if(chan.has(doc.firstSource))chan.get(doc.firstSource).new++;
      for(const ch of doc.channels||[]){if(chan.has(ch))chan.get(ch).observed++;}
    }
    for(const r of scans){if(chan.has(r.channel))chan.get(r.channel).scans++;}
    return [...chan.values()].sort((a,b)=>b.new-a.new||b.observed-a.observed);
  }
  function renderMetrics(){
    const uniqueLinks=new Set(docs.flatMap(d=>d.urls||[])).size;
    setText('metricLinks',number(uniqueLinks));setText('metricCandidates',number(docs.length));
    setText('metricVerified',number(docs.filter(d=>d.review==='VERIFIED').length));
    const active=channelsSummary().filter(c=>c.scans>0||c.observed>0);setText('metricChannels',number(active.length));
    const chan=el('channelRows');chan.replaceChildren();
    for(const c of channelsSummary()){
      const tr=document.createElement('tr');textCell(tr,c.label);textCell(tr,number(c.new));textCell(tr,number(c.observed));chan.append(tr);
    }
  }
  function renderFilters(){
    const options=el('filterChannel'),value=options.value;
    options.replaceChildren();const empty=document.createElement('option');empty.value='';empty.textContent='All channels';options.append(empty);
    for(const c of channelsSummary())if(c.scans>0||c.observed>0){const opt=document.createElement('option');opt.value=c.id;opt.textContent=c.label;options.append(opt);}
    options.value=[...options.options].some(o=>o.value===value)?value:'';
  }
  function renderRows(){
    const q=el('filter').value.trim().toLowerCase(),ch=el('filterChannel').value,status=el('filterStatus').value;
    const matches=docs.filter(d=>(!q||[d.name,...(d.urls||[]),...(d.hosts||[]),...(d.channels||[])].join(' ').toLowerCase().includes(q))&&(!ch||(d.channels||[]).includes(ch))&&(!status||(status==='pending'?d.review!=='VERIFIED':d.review==='VERIFIED')));
    matches.sort((a,b)=>String(b.firstSeenAt).localeCompare(String(a.firstSeenAt))||a.id.localeCompare(b.id));
    const maxPage=Math.max(0,Math.ceil(matches.length/ROWS_PER_PAGE)-1);page=Math.min(page,maxPage);
    const slice=matches.slice(page*ROWS_PER_PAGE,(page+1)*ROWS_PER_PAGE);
    const target=el('inventoryRows');target.replaceChildren();
    for(const doc of slice){
      const tr=document.createElement('tr');const first=textCell(tr,'');
      const strong=document.createElement('strong');strong.className='link';strong.textContent=doc.name||'Original candidate';first.append(strong);
      const size=document.createElement('span');size.className='channel';size.textContent='Exact ID: '+doc.id.slice(0,15)+'…';first.append(document.createElement('br'),size);
      textCell(tr,`${(doc.hosts||[]).join(', ')}\n${(doc.channels||[]).map(c=>LABELS[c]||c).join(', ')}`);
      const td=textCell(tr,'Pending · not certified','state');
      if(doc.review==='VERIFIED')td.textContent='Verified';
      const act=textCell(tr,'');
      const href=(doc.urls||[]).find(u=>normalizeUrl(u)===u);
      if(href){const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.className='open';a.textContent='Open original ↗';act.append(a);}
      target.append(tr);
    }
    if(!slice.length){const tr=document.createElement('tr');const td=textCell(tr,docs.length?'No matching links.':'No source links indexed yet.');td.colSpan=4;target.append(tr);}
    setText('shownCount',`${number(matches.length)} candidate${matches.length===1?'':'s'}`);
    setText('pagination',`Page ${page+1} of ${Math.max(1,maxPage+1)}`);
    el('previous').disabled=page===0;el('next').disabled=page>=maxPage;
  }
  async function refresh(){docs=await all('documents');scans=await all('scans');renderMetrics();renderFilters();renderRows();}
  function updateQuery(){const source=el('source').value;el('query').value=source==='commonCrawl'?'cs.stanford.edu':source==='portfolioSearch'?'cv':'resume';el('query').placeholder=source==='commonCrawl'?'cs.stanford.edu':'resume / software / engineer';}
  function saveExport(){
    const payload={schema:VERSION,exportedAt:nowISO(),documents:docs,scans};
    const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
    a.href=url;a.download='lbs-browser-resume-links.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2500);
    setText('storageNote','Inventory exported to your device. The export contains source URLs; keep it private.');
  }
  async function initialize(){
    try{
      db=await openDb();await refresh();
      const badge=el('storageBadge');badge.className='pill';badge.textContent='Browser-local inventory ready · no installation';
      document.documentElement.dataset.ready='true';
      const boot=await single('settings','firstScanAttempted');
      if(!boot){
        await put('settings',{key:'firstScanAttempted',at:nowISO()});
        await scanChannel('originals','resume');
      }
    }catch(error){
      const badge=el('storageBadge');badge.className='pill warn';badge.textContent='Browser storage unavailable';
      setStatus('Browser storage could not be initialized. Please allow site data storage and reload.','bad');
    }
  }
  el('scan').addEventListener('click',()=>scanChannel(el('source').value,el('query').value));
  el('scanOriginals').addEventListener('click',()=>scanChannel('originals','resume'));
  el('source').addEventListener('change',updateQuery);
  for(const id of ['filter','filterChannel','filterStatus'])el(id).addEventListener(id==='filter'?'input':'change',()=>{page=0;renderRows()});
  el('previous').addEventListener('click',()=>{page=Math.max(0,page-1);renderRows()});
  el('next').addEventListener('click',()=>{page++;renderRows()});
  el('export').addEventListener('click',saveExport);
  el('clear').addEventListener('click',async()=>{
    if(!confirm('Remove this browser’s local résumé-link inventory and scan history?'))return;
    await clearAll();page=0;await refresh();setStatus('This browser’s inventory has been cleared.','good');
  });
  window.LBS_BROWSER_LINK_INDEX_V1={schema:VERSION,labels:LABELS,normalizeUrl,pathMatches,validFile,version:DB_VERSION};
  initialize();
})();
