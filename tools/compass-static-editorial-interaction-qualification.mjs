import { chromium } from 'playwright';
import crypto from 'node:crypto';

const base = process.env.COMPASS_TEST_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({headless:true});
const viewports = {desktop:{width:1440,height:1100},tablet:{width:900,height:1000},phone:{width:412,height:915}};
const receipts = {};
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

async function visibleEnabled(locator) {
  if (await locator.count() !== 1 || !(await locator.isVisible()) || !(await locator.isEnabled())) return false;
  const box = await locator.boundingBox();
  if (!box || box.width < 2 || box.height < 2) return false;
  return locator.evaluate(el => { const r=el.getBoundingClientRect(), top=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2); return Boolean(top&&(top===el||el.contains(top))); });
}

async function capabilitySnapshot(orbit) {
  return orbit.evaluate(el => ({
    index:el.dataset.orbitIndex||el.dataset.index||'',
    text:el.innerText,
    selected:[...el.querySelectorAll('[aria-selected]')].map(x=>`${x.id||x.textContent?.trim()}:${x.getAttribute('aria-selected')}`),
    transforms:[...el.querySelectorAll('[data-capability-choice],article,a')].slice(0,8).map(x=>getComputedStyle(x).transform)
  }));
}

async function sceneTap(page, name, x, y) {
  const top = await page.evaluate(({x,y}) => { const el=document.elementFromPoint(x,y); return el ? {tag:el.tagName,cls:el.className||'',scene:Boolean(el.closest?.('[data-compass-scene]'))} : null; }, {x,y});
  if (!top?.scene) throw new Error(`${name}: projected star coordinate is not owned by Compass scene ${JSON.stringify({x,y,top})}`);
  if (name === 'desktop') await page.mouse.click(x,y);
  else await page.touchscreen.tap(x,y);
}

async function swipe(page, name, x1, y1, x2, y2) {
  if (name === 'desktop') {
    await page.mouse.move(x1,y1); await page.mouse.down(); await page.mouse.move(x2,y2,{steps:10}); await page.mouse.up();
    return;
  }
  const cdp = await page.context().newCDPSession(page);
  const point=(x,y)=>[{x,y,radiusX:1,radiusY:1,force:1,id:1}];
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:point(x1,y1)});
  for(let i=1;i<=10;i++){const t=i/10;await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:point(x1+(x2-x1)*t,y1+(y2-y1)*t)});await page.waitForTimeout(12);}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
}

for (const [name, viewport] of Object.entries(viewports)) {
  const context = await browser.newContext({viewport,reducedMotion:'no-preference',hasTouch:name!=='desktop',isMobile:name==='phone'});
  const page = await context.newPage();
  const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(base,{waitUntil:'networkidle'}); await page.waitForTimeout(900);

  const root=page.locator('[data-compass-root]').first(), scene=page.locator('[data-compass-scene]').first();
  const box=await scene.boundingBox();
  if(!box||box.height<430) throw new Error(`${name}: Compass scene below protected 430px floor: ${box?.height||0}`);
  if(await root.getAttribute('data-compass-mode')!=='CONSTELLATION') throw new Error(`${name}: initial Compass mode is not CONSTELLATION`);

  await swipe(page,name,box.x+box.width*.62,box.y+box.height*.55,box.x+box.width*.42,box.y+box.height*.55);
  await page.waitForTimeout(450);
  const postDrag=await root.evaluate(el=>({mode:el.dataset.compassMode,orbitIndex:el.dataset.compassOrbitIndex,readable:el.dataset.readableCardinal,foreground:el.dataset.renderedForegroundCardinal}));
  if(postDrag.mode!=='CONSTELLATION') throw new Error(`${name}: drag broke constellation mode ${JSON.stringify(postDrag)}`);

  const candidates=page.locator('[data-compass-cardinal]');
  let openedCardinal='', physicalTarget=null;
  for(let i=0;i<await candidates.count();i++){
    const candidate=candidates.nth(i), b=await candidate.boundingBox();
    if(!b||b.width<2||b.height<2) continue;
    const x=b.x+b.width/2,y=b.y+b.height/2;
    const before=await root.getAttribute('data-compass-mode');
    await sceneTap(page,name,x,y); await page.waitForTimeout(550);
    const after=await root.getAttribute('data-compass-mode');
    if(before!==after&&['CLUSTER_OPEN','ROOM_SELECTED'].includes(after||'')){
      openedCardinal=await candidate.getAttribute('data-cardinal-id')||`index-${i}`; physicalTarget={x,y}; break;
    }
  }
  if(!openedCardinal) throw new Error(`${name}: no rendered cardinal projection opened through the crystal scene hit-test owner`);
  const cluster=await root.evaluate(el=>({mode:el.dataset.compassMode,wing:el.dataset.activeClusterWing||el.dataset.selectedWing||'',primary:el.dataset.clusterPrimaryRoom||'',preview:el.dataset.clusterPreviewPrimaryRoom||''}));

  const back=page.locator('[data-compass-return-to-orbit]').first();
  let returnPath='not-exposed';
  if(await visibleEnabled(back)){await back.click();await page.waitForTimeout(400);const returned=await root.getAttribute('data-compass-mode');if(returned!=='CONSTELLATION')throw new Error(`${name}: visible Return to Orbit failed: ${returned}`);returnPath='visible-control';}

  const orbit=page.locator('[data-capability-orbit]').first();
  if(await orbit.count()!==1) throw new Error(`${name}: Track A capability orbit not mounted`);
  if(await orbit.locator('[data-orbit-next],[data-orbit-previous]').count()!==0) throw new Error(`${name}: protected swipe-only carousel gained arrow controls`);
  const guidance=(await orbit.locator('.compass-capability-guidance').first().textContent()||'').trim();
  if(guidance!=='Swipe to rotate.') throw new Error(`${name}: capability guidance changed: ${JSON.stringify(guidance)}`);
  const beforeCarousel=await capabilitySnapshot(orbit), obox=await orbit.boundingBox(); if(!obox) throw new Error(`${name}: capability orbit has no bounds`);
  await swipe(page,name,obox.x+obox.width*.72,obox.y+Math.min(obox.height*.5,220),obox.x+obox.width*.42,obox.y+Math.min(obox.height*.5,220));
  await page.waitForTimeout(650);
  const afterCarousel=await capabilitySnapshot(orbit);
  const carouselChanged=beforeCarousel.index!==afterCarousel.index||beforeCarousel.text!==afterCarousel.text||JSON.stringify(beforeCarousel.selected)!==JSON.stringify(afterCarousel.selected)||JSON.stringify(beforeCarousel.transforms)!==JSON.stringify(afterCarousel.transforms);
  if(!carouselChanged) throw new Error(`${name}: capability swipe produced no observable index/content/selection/geometry change`);

  const hEarth=await page.locator('[data-compass-room][data-label="H-Earth"]').first().evaluate(el=>({href:el.getAttribute('href'),route:el.dataset.route}));
  if(hEarth.href!=='/showroom/globe/h-earth/'||hEarth.route!=='/showroom/globe/h-earth/') throw new Error(`${name}: H-Earth route regression ${JSON.stringify(hEarth)}`);
  const gen=await page.evaluate(()=>globalThis.DGB_COMPASS_GEN1537_LIVE_RECOVERY?.receipt?.()||null);
  if(!gen||gen.mounted!==false||gen.retired!==true||gen.authoritative!==false||gen.capabilityPlacementAuthority!==false||gen.repeatedReparenting!==false) throw new Error(`${name}: Gen1537 regained authority ${JSON.stringify(gen)}`);

  const crystalMount=page.locator('[data-compass-crystals-mount]').first();
  if(await crystalMount.count()!==1||!(await crystalMount.isVisible())) throw new Error(`${name}: interactive crystal mount missing or invisible`);
  await page.waitForTimeout(Math.max(0,2000-900)); const crystal2=hash(await crystalMount.screenshot());
  await page.waitForTimeout(6000); const crystal8=hash(await crystalMount.screenshot());
  await page.waitForTimeout(7000); const crystal15=hash(await crystalMount.screenshot());
  if(new Set([crystal2,crystal8,crystal15]).size<2) throw new Error(`${name}: crystal layer is visually static through 15s under normal motion`);

  const background=await context.newPage(); await background.goto('about:blank'); await background.bringToFront(); await page.waitForTimeout(900); await page.bringToFront(); await page.waitForTimeout(400); await background.close();
  if(errors.length) throw new Error(`${name}: browser errors: ${errors.join(' | ')}`);

  const reduceContext=await browser.newContext({viewport,reducedMotion:'reduce'}), reduced=await reduceContext.newPage();
  await reduced.goto(base,{waitUntil:'networkidle'}); await reduced.waitForTimeout(1600);
  const reducedState=await reduced.locator('[data-compass-root]').evaluate(el=>({dataset:el.dataset.reducedMotion,media:matchMedia('(prefers-reduced-motion: reduce)').matches,mode:el.dataset.compassMode}));
  if(!reducedState.media||String(reducedState.dataset).toLowerCase()!=='true') throw new Error(`${name}: reduced-motion contract failed ${JSON.stringify(reducedState)}`);
  await reduceContext.close();

  receipts[name]={sceneHeight:box.height,postDrag,openedCardinal,physicalTarget,cluster,returnPath,guidance,carouselChanged,crystalHashes:{t2:crystal2,t8:crystal8,t15:crystal15},reducedState,hEarth,gen};
  await context.close();
}
await browser.close();
console.log(JSON.stringify({result:'TRACK_A_INTERACTION_AND_SUSTAINED_CRYSTAL_PASS',receipts},null,2));
