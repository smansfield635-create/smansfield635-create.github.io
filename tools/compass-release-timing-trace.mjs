import puppeteer from 'puppeteer-core';

const base=(process.env.PUBLIC_BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
const chrome=process.env.CHROME_PATH;
if(!chrome) throw new Error('CHROME_PATH is required');
const browser=await puppeteer.launch({executablePath:chrome,headless:'new',args:['--no-sandbox']});
const page=await browser.newPage();
await page.setViewport({width:900,height:1000,deviceScaleFactor:1,hasTouch:true});
await page.goto(`${base}/`,{waitUntil:'networkidle2',timeout:60000});
await new Promise(r=>setTimeout(r,1600));
await page.evaluate(()=>{const s=e=>e.preventDefault();document.addEventListener('click',s,true);document.addEventListener('auxclick',s,true)});
const snap=()=>page.evaluate(()=>{const root=document.querySelector('[data-compass-root]');const cards=[...document.querySelectorAll('[data-compass-cardinal]')].map(el=>{const r=el.getBoundingClientRect();return{wing:el.dataset.wing||el.dataset.cardinalId||'',primary:el.dataset.primary==='true',cx:r.x+r.width/2,cy:r.y+r.height/2}});return{focus:root?.dataset.orbitFocus||'',phase:root?.dataset.orbitPhase||'',cards}});
const scene=await page.$('[data-compass-scene]');await scene?.evaluate(el=>el.scrollIntoView({block:'center',inline:'nearest'}));await new Promise(r=>setTimeout(r,150));
const baseline=await snap();const owner=baseline.cards.find(x=>x.primary)||baseline.cards.find(x=>x.wing===baseline.focus);if(!owner)throw new Error('no baseline owner');const anchor={cx:owner.cx,cy:owner.cy};
const b=await scene?.boundingBox();if(!b)throw new Error('no scene bounds');const client=await page.target().createCDPSession();const point=(x,y)=>[{x,y,radiusX:1,radiusY:1,force:1,id:1}];
const patterns=[[.84,.50,.16,.50],[.50,.80,.50,.20],[.16,.50,.84,.50],[.50,.20,.50,.80]];
const marks=[0,250,500,750,1050,1400,1800,2400];
let trace=null;
for(let attempt=0;attempt<8&&!trace;attempt++){
  const [sx,sy,ex,ey]=patterns[attempt%patterns.length];
  const before=await snap();
  const x1=b.x+b.width*sx,y1=b.y+b.height*sy,x2=b.x+b.width*ex,y2=b.y+b.height*ey;
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:point(x1,y1)});
  for(let i=1;i<=18;i++){const t=i/18;await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:point(x1+(x2-x1)*t,y1+(y2-y1)*t)});await new Promise(r=>setTimeout(r,22))}
  await new Promise(r=>setTimeout(r,100));
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const samples=[];let last=0;
  for(const ms of marks){await new Promise(r=>setTimeout(r,ms-last));last=ms;const s=await snap();const incoming=s.cards.find(x=>x.wing===s.focus);samples.push({ms,focus:s.focus,phase:s.phase,anchorError:incoming?Math.hypot(incoming.cx-anchor.cx,incoming.cy-anchor.cy):null,cx:incoming?.cx??null,cy:incoming?.cy??null})}
  const committed=samples.find(s=>s.phase==='COMMITTED'&&s.focus&&s.focus!==before.focus);
  if(committed)trace={attempt:attempt+1,from:before.focus,to:committed.focus,samples};
}
if(!trace)throw new Error('no committed transition through 2400ms across 8 attempts');
console.log(JSON.stringify({result:'COMPASS_RELEASE_TIMING_TRACE',anchor,...trace},null,2));await browser.close();
