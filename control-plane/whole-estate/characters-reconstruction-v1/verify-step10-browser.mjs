import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE='http://127.0.0.1:4173/characters/';
const outDir=process.env.STEP10_ARTIFACT_DIR || '/tmp/characters-step10';
fs.mkdirSync(outDir,{recursive:true});

const cases=[
  {id:'desktop',viewport:{width:1440,height:900},reducedMotion:'no-preference',isMobile:false,proveFilmPlay:true},
  {id:'mobile',viewport:{width:390,height:844},reducedMotion:'no-preference',isMobile:true,proveFilmPlay:false},
  {id:'reduced-motion',viewport:{width:1440,height:900},reducedMotion:'reduce',isMobile:false,proveFilmPlay:false}
];

const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const receipts=[];
let failed=false;
for(const spec of cases){
  const context=await browser.newContext({viewport:spec.viewport,reducedMotion:spec.reducedMotion,isMobile:spec.isMobile,hasTouch:spec.isMobile});
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  const consoleErrors=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
  await page.goto(BASE,{waitUntil:'networkidle'});
  await page.waitForTimeout(900);
  const intro=await page.evaluate(()=>({
    play:document.querySelector('#intro-continue')?.textContent||'',
    skip:document.querySelector('#intro-skip')?.textContent||'',
    replay:document.querySelector('#replay-primer')?.textContent||'',
    visible:!document.querySelector('#step9-primer')?.hidden,
    heading:document.querySelector('#step9-primer-heading')?.textContent||'',
    audio:!!document.querySelector('[data-mirrorland-film-audio]')
  }));
  await page.screenshot({path:`${outDir}/${spec.id}-introduction.png`,fullPage:true});
  const introControls=intro.visible&&/Play introduction/.test(intro.play)&&/Skip to the coast/.test(intro.skip)&&/Replay introduction/.test(intro.replay)&&intro.audio;
  let filmPlayProof={required:spec.proveFilmPlay,playing:false,inFilmSkip:false,webglVisible:false};
  if(spec.proveFilmPlay){
    await page.locator('#intro-continue').click();
    await page.waitForFunction(()=>document.querySelector('#step9-primer')?.classList.contains('playing')===true,null,{timeout:3000});
    filmPlayProof=await page.evaluate(()=>({
      required:true,
      playing:document.querySelector('#step9-primer')?.classList.contains('playing')===true,
      inFilmSkip:getComputedStyle(document.querySelector('[data-film-skip]')).display!=='none',
      webglVisible:getComputedStyle(document.querySelector('#step9-primer')).backgroundColor==='rgba(0, 0, 0, 0)',
      audioElement:!!document.querySelector('[data-mirrorland-film-audio]')
    }));
    await page.screenshot({path:`${outDir}/${spec.id}-film-playing.png`,fullPage:true});
    await page.locator('[data-film-skip]').click();
  }else{
    await page.locator('#intro-skip').click();
  }
  await page.waitForFunction(()=>document.querySelector('#step9-primer')?.hidden===true,null,{timeout:3500});
  const replayAvailable=await page.locator('#replay-primer').evaluate(el=>!el.hidden);
  const connectedRoutes=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-world-route]')].map(a=>[a.dataset.worldRoute,a.getAttribute('href')])));
  const routeContract=connectedRoutes.showroom==='/showroom/'&&connectedRoutes['h-earth']==='/showroom/globe/h-earth/'&&connectedRoutes.audralia==='/showroom/globe/audralia/'&&connectedRoutes.compass==='/';
  const initial=await page.evaluate(()=>({
    webgl2:!!document.querySelector('#scene')?.getContext('webgl2'),
    fatal:document.querySelector('#fatal')?.classList.contains('show')===true,
    bodyWidth:document.body.scrollWidth,
    viewportWidth:innerWidth,
    status:document.querySelector('#status')?.textContent||'',
    signalCount:[...document.querySelectorAll('.signal')].filter(el=>!el.hidden).length,
    reduced:matchMedia('(prefers-reduced-motion: reduce)').matches
  }));
  let returnPath=false;
  let arrivalStatus='';
  let returnStatus='';
  const visibleSignal=page.locator('.signal:not([hidden])').first();
  if(await visibleSignal.count()){
    await visibleSignal.click({force:true});
    await page.waitForFunction(()=>document.querySelector('#return')?.classList.contains('show'),null,{timeout:15000});
    arrivalStatus=await page.locator('#status').textContent();
    await page.locator('#return').click({force:true});
    await page.waitForFunction(()=>!document.querySelector('#return')?.classList.contains('show'),null,{timeout:15000});
    await page.waitForFunction(()=>/Orbit/.test(document.querySelector('#status')?.textContent||''),null,{timeout:15000});
    returnStatus=await page.locator('#status').textContent();
    returnPath=/Orbit/.test(returnStatus||'');
  }
  const mapButton=page.locator('#map-toggle');
  await mapButton.click();
  const mapOpen=await page.locator('#coast-map').evaluate(el=>el.classList.contains('show'));
  const mapHitTest=await page.evaluate(()=>{
    const describe=el=>{
      if(!el)return null;
      const style=getComputedStyle(el);
      const rect=el.getBoundingClientRect();
      return {
        tag:el.tagName,
        id:el.id||'',
        className:typeof el.className==='string'?el.className:String(el.className?.baseVal||''),
        pointerEvents:style.pointerEvents,
        position:style.position,
        zIndex:style.zIndex,
        transform:style.transform,
        display:style.display,
        visibility:style.visibility,
        opacity:style.opacity,
        rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height,top:rect.top,right:rect.right,bottom:rect.bottom,left:rect.left}
      };
    };
    const close=document.querySelector('#map-close');
    const closeRect=close?.getBoundingClientRect();
    const center=closeRect?{x:closeRect.left+closeRect.width/2,y:closeRect.top+closeRect.height/2}:null;
    const stack=center?document.elementsFromPoint(center.x,center.y).map(describe):[];
    return {
      center,
      elementFromPoint:center?describe(document.elementFromPoint(center.x,center.y)):null,
      elementsFromPoint:stack,
      nodes:{
        scene:describe(document.querySelector('#scene')),
        world:describe(document.querySelector('.world')),
        coastMap:describe(document.querySelector('#coast-map')),
        mapCard:describe(document.querySelector('#coast-map .map-card')),
        mapClose:describe(close)
      },
      classState:{
        html:document.documentElement.className,
        body:document.body.className,
        world:document.querySelector('.world')?.className||'',
        coastMap:document.querySelector('#coast-map')?.className||'',
        primerHidden:document.querySelector('#step9-primer')?.hidden===true,
        primerActive:document.querySelector('.world')?.classList.contains('step9-primer-active')===true
      }
    };
  });
  let mapCloseClickError='';
  try{
    await page.locator('#map-close').click();
  }catch(error){
    mapCloseClickError=String(error?.message||error);
  }
  const mapClosed=await page.locator('#coast-map').evaluate(el=>!el.classList.contains('show'));
  const noHorizontalEscape=initial.bodyWidth<=initial.viewportWidth;
  await page.screenshot({path:`${outDir}/${spec.id}.png`,fullPage:true});
  const filmPlayOk=!spec.proveFilmPlay||(filmPlayProof.playing&&filmPlayProof.inFilmSkip&&filmPlayProof.webglVisible&&filmPlayProof.audioElement);
  const mapCloseOk=mapOpen&&mapClosed&&!mapCloseClickError;
  const ok=introControls&&filmPlayOk&&replayAvailable&&routeContract&&initial.webgl2&&!initial.fatal&&initial.signalCount>0&&noHorizontalEscape&&returnPath&&mapCloseOk&&pageErrors.length===0;
  if(!ok) failed=true;
  receipts.push({id:spec.id,ok,intro,introControls,filmPlayProof,filmPlayOk,replayAvailable,connectedRoutes,routeContract,initial,arrivalStatus,returnStatus,returnPath,mapOpen,mapClosed,mapCloseOk,mapCloseClickError,mapHitTest,noHorizontalEscape,pageErrors,consoleErrors});
  await context.close();
}
await browser.close();
const receipt={schema:'CHARACTERS_STEP10_BROWSER_ACCEPTANCE_RECEIPT_v2',result:failed?'FAIL':'PASS',diagnostic:'MAP_CLOSE_HIT_TEST_V1',cases:receipts};
fs.writeFileSync(`${outDir}/receipt.json`,JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
if(failed) process.exit(1);
