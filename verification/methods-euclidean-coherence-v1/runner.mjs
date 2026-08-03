import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import puppeteer from 'puppeteer-core';

const ORIGIN = process.env.METHODS_MODELS_ORIGIN || 'http://127.0.0.1:4173';
const CHROME_PATH = process.env.CHROME_PATH;
const EXECUTION_COMMIT = process.env.EXECUTION_COMMIT || 'UNKNOWN';
const HARNESS_COMMIT = process.env.HARNESS_COMMIT || 'UNKNOWN';
const EXPECTED_SOURCE_HEAD = process.env.EXPECTED_SOURCE_HEAD || '66a2105e96e84c5b482f783010779f87a90a28ee';
const OUT_DIR = path.resolve(process.env.COHERENCE_OUT_DIR || 'methods-euclidean-coherence-evidence');
const SCREENSHOT_DIR = path.join(OUT_DIR, 'screenshots');
const ROUTE = `${ORIGIN}/laws/research/methods-and-models/`;
if (!CHROME_PATH) throw new Error('CHROME_PATH_REQUIRED');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const VIEWPORTS = [
  { id: 'SMALL_PHONE', width: 360, height: 800 },
  { id: 'PHONE_PORTRAIT', width: 390, height: 844 },
  { id: 'LARGE_PHONE', width: 430, height: 932 },
  { id: 'COMPACT_TABLET_PORTRAIT', width: 768, height: 1024 },
  { id: 'LARGE_TABLET_PORTRAIT', width: 820, height: 1180 },
  { id: 'TABLET_LANDSCAPE', width: 1180, height: 820 },
  { id: 'SHORT_LAPTOP', width: 1366, height: 768 },
  { id: 'STANDARD_DESKTOP', width: 1440, height: 1000 },
  { id: 'WIDE_DESKTOP', width: 1920, height: 1080 }
];
const FAMILIES = [
  { id: 'STRUCTURAL_ENVELOPE_AND_COLLAPSE', pageId: 'structure', label: 'Structural Envelope and Collapse', models: [
    ['STRUCTURAL_ENVELOPE_451','451 Structural Envelope'], ['SATURATION_GATE_448','448 Saturation Gate'],
    ['INTERNAL_BURDEN_LATTICE_256','256 Internal Burden Lattice'], ['EXTERNAL_PRESSURE_SHELL_192','192 External Pressure Shell'],
    ['COHERENCE_SPINE_EIV','E / I / V Coherence Spine'], ['QUALIFIED_COLLAPSE_PREDICATE','Qualified Collapse Predicate']
  ]},
  { id: 'PRESSURE_CAPACITY_AND_STABILITY', pageId: 'pressure', label: 'Pressure, Capacity and Stability', models: [
    ['PRESSURE_PRODUCT_PI','Pressure Product Π'], ['CAPACITY_PRODUCT_K','Capacity Product K'], ['CAPACITY_FLOOR_K_USED','Capacity Floor K_used'],
    ['PRESSURE_CAPACITY_RATIO_PCR','Pressure-Capacity Ratio PCR'], ['STABILITY_MASS_S_STAR','Stability Mass S*'],
    ['HAZARD_MASS_H_STAR','Hazard Mass H*'], ['COMPLEMENTARITY_IDENTITY','Complementarity Identity']
  ]},
  { id: 'CLOSURE_AND_SYSTEM_FLOW', pageId: 'closure', label: 'Closure and System Flow', models: [
    ['INDUSTRIAL_MASS_BALANCE','Industrial Mass Balance'], ['UNCLOSED_RESIDUAL_U','Unclosed Residual U'],
    ['CLOSURE_THRESHOLD_3_EPSILON','Closure Threshold 3ε'], ['ENERGY_LOOP_LAW','Energy Loop Law'], ['SAFE_MODE_BOUNDARY','Safe-Mode Boundary']
  ]},
  { id: 'METHOD_RESOLUTION_AND_FALSIFICATION', pageId: 'method', label: 'Method Resolution and Falsification', models: [
    ['OBSERVE','Observe'], ['HYPOTHESIZE','Hypothesize'], ['REDUCE_1_2_3','Reduce 1–2–3'], ['FALSIFY','Falsify'],
    ['CLASSIFY_A_B_C_D','Classify A–B–C–D'], ['RECORD','Record'], ['CLAIM_BOUNDARY','Claim Boundary']
  ]}
];
const LENSES = [
  { id: 'FORMAL_STRUCTURE', pageLabel: 'Practical', label: 'Formal Structure' },
  { id: 'ENGINEERING_OPERATION', pageLabel: 'Engineering', label: 'Engineering Operation' },
  { id: 'EVIDENCE_AND_LIMITS', pageLabel: 'Evidence', label: 'Evidence and Limits' }
];
const FINDING_CODES = [
  'LABEL_CLIPPED','LABEL_COLLISION','LABEL_GRID_DETACHED','LABEL_UNREADABLE_AT_REQUIRED_CAMERA_DISTANCE','LABEL_DEPTH_ORDER_AMBIGUOUS',
  'OBJECT_OUTSIDE_STAGE','OBJECT_OCCLUDED','OBJECT_INTERSECTION_INVALID','DEPTH_ORDER_INVALID','ACTIVE_COORDINATE_AMBIGUOUS',
  'MULTIPLE_ACTIVE_COORDINATES','NO_ACTIVE_COORDINATE','GRID_AXIS_MISSING','GRID_PLANE_MISSING','GRID_COORDINATE_MISMATCH',
  'TEXT_BELOW_MINIMUM_LEGIBILITY','CONTROL_OVERLAPS_CONTENT','CONTROL_OUTSIDE_SAFE_REGION','TOUCH_TARGET_UNDERSIZED',
  'STAGE_CONTENT_BEHIND_GEOMETRY','READING_CONTENT_INSIDE_PROHIBITED_STAGE_REGION','CAMERA_OVERVIEW_INCOHERENT',
  'CAMERA_BROWSE_STATE_INCOHERENT','CAMERA_TRANSITION_CLIPS_CONTENT','FAMILY_STATE_COLOR_MISMATCH','ATMOSPHERE_STATE_MISMATCH',
  'INSPECTION_DID_NOT_FREEZE_PAGE','BACKGROUND_NOT_INERT_DURING_INSPECTION','INSPECTION_FOREGROUND_CLIPPED','RETURN_CONTROL_MISSING',
  'RETURN_COORDINATE_MISMATCH','RETURN_CAMERA_MISMATCH','RETURN_SCROLL_MISMATCH','RETURN_FOCUS_MISMATCH','RETURN_ATMOSPHERE_MISMATCH',
  'HORIZONTAL_DOCUMENT_OVERFLOW','VERTICAL_STAGE_OVERFLOW','REQUIRED_EVIDENCE_MISSING','WRONG_EXACT_HEAD','HARNESS_LOAD_FAILED'
];
const counts = Object.fromEntries(FINDING_CODES.map(x => [x, 0]));
const examples = Object.fromEntries(FINDING_CODES.map(x => [x, []]));
const observations = [];
const inspectionCycles = [];
const consoleErrors = [];
const pageErrors = [];
const screenshotManifest = [];
const inputTests = {};
const sourceFiles = [
  'laws/research/methods-and-models/index.html',
  'laws/research/methods-and-models/showroom.css',
  'laws/research/methods-and-models/showroom.js',
  'laws/research/methods-and-models/showroom-refinement.css',
  'laws/research/methods-and-models/showroom-refinement.js',
  'laws/research/methods-and-models/showroom-euclidean.css',
  'laws/research/methods-and-models/showroom-euclidean-interaction.css',
  'laws/research/methods-and-models/showroom-euclidean.js',
  'laws/research/methods-and-models/canonical-records-v1.html'
];
const sourcePresence = Object.fromEntries(sourceFiles.map(f => [f, fs.existsSync(f)]));
const sourceText = Object.fromEntries(sourceFiles.filter(f => fs.existsSync(f)).map(f => [f, fs.readFileSync(f,'utf8')]));
const sourceAssertions = {
  allRequiredFilesPresent: Object.values(sourcePresence).every(Boolean),
  contract: sourceText[sourceFiles[0]]?.includes('METHODS_MODELS_EUCLIDEAN_SHOWROOM_v3') || false,
  sourceCompletenessOpen: sourceText[sourceFiles[0]]?.includes('data-source-completeness="open"') || false,
  productAcceptanceNotGranted: sourceText[sourceFiles[0]]?.includes('data-product-acceptance="not-granted"') || false,
  canonicalArchiveBound: sourceText[sourceFiles[0]]?.includes('METHODS_MODELS_CANONICAL_ARCHIVE_v1_DRAFT') || false,
  noCanvasWebglGlobe: !/webgl|three\.js|getContext\(|<canvas|globe/i.test((sourceText[sourceFiles[6]]||'') + (sourceText[sourceFiles[7]]||'')),
  reducedMotionDeclared: (sourceText[sourceFiles[5]]||'').includes('prefers-reduced-motion: reduce'),
  exactCoordinateStateDeclared: ['familyIndex','modelIndex','lensIndex','METHODS_MODELS_EUCLIDEAN_STATE_CHANGED'].every(t => (sourceText[sourceFiles[7]]||'').includes(t))
};
const sourceFailures = Object.entries(sourceAssertions).filter(([,v]) => !v).map(([k]) => k);

function bump(code, detail) {
  counts[code] += 1;
  if (examples[code].length < 12) examples[code].push(detail);
}
function rectOutside(a,b,tol=1){return a.left < b.left-tol || a.right > b.right+tol || a.top < b.top-tol || a.bottom > b.bottom+tol;}
function intersection(a,b){const w=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left));const h=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));return w*h;}
function rectDelta(a,b){return Math.max(Math.abs(a.left-b.left),Math.abs(a.right-b.right),Math.abs(a.top-b.top),Math.abs(a.bottom-b.bottom));}
function coordinateId(z,x,y){return `${FAMILIES[z].models[x][0]}__${LENSES[y].id}`;}
function stateRef(vp,z,x,y,camera){return { viewport:vp.id, coordinate:coordinateId(z,x,y), camera, x:x+1,y:y+1,z:z+1 };}
function safeName(s){return s.replace(/[^A-Za-z0-9_.-]+/g,'_');}
function writeJson(file,obj){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(obj,null,2)+'\n');}
function sha256(file){return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');}

const browser = await puppeteer.launch({executablePath: CHROME_PATH, headless: true, args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});

async function makePage(vp,{touch=false,reducedMotion=false,javaScript=true}={}){
  const page=await browser.newPage();
  page.on('console',m=>{if(m.type()==='error' && consoleErrors.length<200) consoleErrors.push({viewport:vp.id,text:m.text()});});
  page.on('pageerror',e=>{if(pageErrors.length<200) pageErrors.push({viewport:vp.id,text:String(e)});});
  await page.setJavaScriptEnabled(javaScript);
  await page.setViewport({width:vp.width,height:vp.height,deviceScaleFactor:1,isMobile:vp.width<=430,hasTouch:touch||vp.width<=430});
  if(reducedMotion) await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  const response=await page.goto(ROUTE,{waitUntil:javaScript?'networkidle0':'domcontentloaded',timeout:45000}).catch(()=>null);
  if(!response){bump('HARNESS_LOAD_FAILED',{viewport:vp.id});return {page,loaded:false};}
  if(javaScript){
    await page.waitForSelector('html[data-methods-models-euclidean-showroom="active"]',{timeout:15000}).catch(()=>{});
    await page.waitForSelector('[data-mm-showroom][data-mm-euclidean-ready="true"]',{timeout:15000}).catch(()=>{});
  }
  return {page,loaded:true};
}
async function waitStable(page,ms=340){await new Promise(r=>setTimeout(r,ms));await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))).catch(()=>{});}
async function waitDataset(page,key,value){await page.waitForFunction(({key,value})=>document.querySelector('[data-mm-showroom]')?.dataset[key]===String(value),{timeout:8000},{key,value});}
async function clickIndexed(page,selector,index){const handles=await page.$$(selector);if(!handles[index]) throw new Error(`MISSING_INDEXED_CONTROL:${selector}:${index}`);await handles[index].click();}
async function setFamily(page,z){const current=Number(await page.$eval('[data-mm-showroom]',e=>e.dataset.mmZ));if(current!==z){await clickIndexed(page,'.mm-family-tab',z);await waitDataset(page,'mmZ',z);await waitStable(page);}}
async function setLens(page,y){const current=Number(await page.$eval('[data-mm-showroom]',e=>e.dataset.mmY));if(current!==y){await clickIndexed(page,'.mm-lens-tab',y);await waitDataset(page,'mmY',y);await waitStable(page);}}
async function setModel(page,x,count){let current=Number(await page.$eval('[data-mm-showroom]',e=>e.dataset.mmX));let guard=0;while(current!==x && guard++<count+2){const forward=(x-current+count)%count;const backward=(current-x+count)%count;const selector=forward<=backward?'[data-mm-next]':'[data-mm-previous]';await page.click(selector);await waitStable(page);current=Number(await page.$eval('[data-mm-showroom]',e=>e.dataset.mmX));}if(current!==x)throw new Error(`MODEL_STATE_UNREACHABLE:${current}->${x}`);}
async function setCoordinate(page,z,x,y){await setFamily(page,z);await setLens(page,y);await setModel(page,x,FAMILIES[z].models.length);}

async function snapshot(page,vp,z,x,y,camera){
  await page.evaluate(({camera,coord,family,model,lens})=>{const d=document.documentElement.dataset;d.methodCameraState=camera;d.methodCoordinateId=coord;d.methodFamilyId=family;d.methodModelId=model;d.methodLensId=lens;d.methodDisplayMode=document.body.dataset.mmDisplay==='collapsed'?'DOCKED':document.documentElement.dataset.methodsModelsInspection==='open'?'INSPECTION':'STAGE';d.methodTransitionPhase='STABLE';}, {camera,coord:coordinateId(z,x,y),family:FAMILIES[z].id,model:FAMILIES[z].models[x][0],lens:LENSES[y].id});
  return page.evaluate(({viewportId,expected})=>{
    const root=document.querySelector('[data-mm-showroom]');
    const stage=document.querySelector('.mm-stage');
    const activeCard=root?.querySelector('.mm-model-card[data-mm-x-position="active"]');
    const prev=root?.querySelector('.mm-model-card[data-mm-x-position="previous"]');
    const next=root?.querySelector('.mm-model-card[data-mm-x-position="next"]');
    const activeFamily=root?.querySelector('.mm-family-tab[data-mm-z-position="active"]');
    const activeLens=root?.querySelector('.mm-lens-tab[data-mm-y-position="active"]');
    const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
    const visible=e=>{if(!e)return false;const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0.01&&r.width>0&&r.height>0;};
    const labels=[
      ['family-title',document.querySelector('[data-mm-family-title]')],['active-family',activeFamily],['active-lens',activeLens],
      ['model-title',activeCard?.querySelector('h3')],['model-statement',activeCard?.querySelector('.mm-model-card__statement')],
      ['progress',document.querySelector('[data-mm-progress]')],['coordinate',document.querySelector('[data-mm-coordinate]')],
      ['coordinate-x',document.querySelector('[data-mm-coordinate-x]')],['coordinate-y',document.querySelector('[data-mm-coordinate-y]')],['coordinate-z',document.querySelector('[data-mm-coordinate-z]')]
    ].filter(([,e])=>visible(e)).map(([id,e])=>({id,text:e.textContent.replace(/\s+/g,' ').trim(),rect:rect(e),fontSize:parseFloat(getComputedStyle(e).fontSize),opacity:parseFloat(getComputedStyle(e).opacity),z:getComputedStyle(e).zIndex}));
    const controls=[...document.querySelectorAll('.mm-stage button')].filter(visible).map((e,i)=>({id:e.getAttribute('data-mm-control-id')||e.getAttribute('aria-label')||e.textContent.trim()||`control-${i}`,rect:rect(e),fontSize:parseFloat(getComputedStyle(e).fontSize)}));
    const cards=[...root.querySelectorAll('.mm-model-card')].filter(visible).map(e=>({id:e.dataset.mmModel||e.dataset.modelId||'',position:e.dataset.mmXPosition||'',rect:rect(e),z:getComputedStyle(e).zIndex,transform:getComputedStyle(e).transform,inert:e.inert,ariaHidden:e.getAttribute('aria-hidden')}));
    const inspect=activeCard?.querySelector('[data-mm-inspect]');
    const ir=rect(inspect);let hit='';let hitIsInspect=false;if(ir){const el=document.elementFromPoint(Math.max(0,Math.min(innerWidth-1,ir.left+ir.width/2)),Math.max(0,Math.min(innerHeight-1,ir.top+ir.height/2)));hit=el?.tagName||'';hitIsInspect=el===inspect||el?.closest?.('[data-mm-inspect]')===inspect;}
    const support=document.querySelector('.mm-support');
    const stageRect=rect(stage),cardRect=rect(activeCard),viewportRect={left:0,top:0,right:innerWidth,bottom:innerHeight,width:innerWidth,height:innerHeight};
    return {
      viewportId,expected,rootState:root?{x:Number(root.dataset.mmX),y:Number(root.dataset.mmY),z:Number(root.dataset.mmZ),family:root.dataset.mmFamily,model:root.dataset.mmModel,ready:root.dataset.mmEuclideanReady}:null,
      projection:{coordinate:document.documentElement.dataset.methodCoordinateId,camera:document.documentElement.dataset.methodCameraState,display:document.documentElement.dataset.methodDisplayMode,phase:document.documentElement.dataset.methodTransitionPhase},
      activeCounts:{families:root?.querySelectorAll('.mm-family-tab[data-mm-z-position="active"]').length||0,models:root?.querySelectorAll('.mm-model-card[data-mm-x-position="active"]').length||0,lenses:root?.querySelectorAll('.mm-lens-tab[data-mm-y-position="active"]').length||0},
      axes:{x:Boolean(document.querySelector('[data-mm-previous]')&&document.querySelector('[data-mm-next]')),y:(root?.querySelectorAll('.mm-lens-tab').length||0)===3,z:Boolean(document.querySelector('[data-mm-family-previous]')&&document.querySelector('[data-mm-family-next]'))},
      planes:document.querySelectorAll('.mm-depth-plane').length, stageRect,viewportRect,cardRect,labels,controls,cards,
      cardTransform:activeCard?getComputedStyle(activeCard).transform:'none',familyTransform:activeFamily?getComputedStyle(activeFamily).transform:'none',lensTransform:activeLens?getComputedStyle(activeLens).transform:'none',
      activeFamilyText:activeFamily?.textContent.replace(/\s+/g,' ').trim()||'',activeLensText:activeLens?.textContent.replace(/\s+/g,' ').trim()||'',
      horizontalOverflow:document.documentElement.scrollWidth-innerWidth,verticalDocumentOverflow:document.documentElement.scrollHeight-innerHeight,
      supportInert:Boolean(support?.inert),bodyPosition:getComputedStyle(document.body).position,bodyFamily:document.body.dataset.mmFamily||'',
      familyVisualSignature:[getComputedStyle(root).backgroundColor,getComputedStyle(activeFamily).color,getComputedStyle(activeCard).borderColor,getComputedStyle(activeCard).boxShadow].join('|'),
      focusKey:document.activeElement?`${document.activeElement.tagName}:${document.activeElement.getAttribute('data-mm-inspect')??''}:${document.activeElement.getAttribute('aria-label')??''}`:'',
      inspect:{exists:Boolean(inspect),rect:ir,hit,hitIsInspect},scroll:{x:scrollX,y:scrollY},canvasCount:document.querySelectorAll('canvas').length,
      readingIntersectsStage:(()=>{const r=rect(support);if(!r||!stageRect)return 0;const w=Math.max(0,Math.min(r.right,stageRect.right)-Math.max(r.left,stageRect.left));const h=Math.max(0,Math.min(r.bottom,stageRect.bottom)-Math.max(r.top,stageRect.top));return w*h;})()
    };
  }, {viewportId:vp.id,expected:{z,x,y,family:FAMILIES[z].pageId,modelId:FAMILIES[z].models[x][0],lensLabel:LENSES[y].pageLabel}});
}

function analyzeSnapshot(s){
  const ref={viewport:s.viewportId,coordinate:s.projection.coordinate,camera:s.projection.camera};
  if(!s.rootState){bump('NO_ACTIVE_COORDINATE',ref);return;}
  const ac=s.activeCounts;
  if(ac.families+ac.models+ac.lenses===0)bump('NO_ACTIVE_COORDINATE',ref);
  if(ac.families>1||ac.models>1||ac.lenses>1)bump('MULTIPLE_ACTIVE_COORDINATES',{...ref,activeCounts:ac});
  if(ac.families!==1||ac.models!==1||ac.lenses!==1)bump('ACTIVE_COORDINATE_AMBIGUOUS',{...ref,activeCounts:ac});
  if(!s.axes.x||!s.axes.y||!s.axes.z)bump('GRID_AXIS_MISSING',{...ref,axes:s.axes});
  if(s.planes<3)bump('GRID_PLANE_MISSING',{...ref,planes:s.planes});
  if(s.rootState.x!==s.expected.x||s.rootState.y!==s.expected.y||s.rootState.z!==s.expected.z||s.rootState.family!==s.expected.family)bump('GRID_COORDINATE_MISMATCH',{...ref,root:s.rootState,expected:s.expected});
  if(!s.cardRect||!s.stageRect)bump('OBJECT_OUTSIDE_STAGE',{...ref,reason:'missing_rect'});
  else {
    if(rectOutside(s.cardRect,s.stageRect,2)||rectOutside(s.cardRect,s.viewportRect,2))bump('OBJECT_OUTSIDE_STAGE',{...ref,card:s.cardRect,stage:s.stageRect,viewport:s.viewportRect});
    if(s.cardRect.top<s.stageRect.top-2||s.cardRect.bottom>s.stageRect.bottom+2)bump('VERTICAL_STAGE_OVERFLOW',{...ref,card:s.cardRect,stage:s.stageRect});
  }
  if(!s.inspect.hitIsInspect)bump('OBJECT_OCCLUDED',{...ref,inspect:s.inspect});
  const active=s.cards.find(c=>c.position==='active'),others=s.cards.filter(c=>c.position&&c.position!=='active');
  if(active){for(const c of others){const area=intersection(active.rect,c.rect);const denom=Math.min(active.rect.width*active.rect.height,c.rect.width*c.rect.height);if(denom>0&&area/denom>0.60){bump('OBJECT_INTERSECTION_INVALID',{...ref,active:active.rect,other:c.rect,ratio:area/denom});break;}}}
  if(!active||active.transform==='none')bump('DEPTH_ORDER_INVALID',{...ref,active});
  if(s.horizontalOverflow>2)bump('HORIZONTAL_DOCUMENT_OVERFLOW',{...ref,overflow:s.horizontalOverflow});
  if(s.bodyFamily&&s.bodyFamily!==s.rootState.family)bump('FAMILY_STATE_COLOR_MISMATCH',{...ref,bodyFamily:s.bodyFamily,rootFamily:s.rootState.family});
  const labels=s.labels;
  for(const l of labels){
    if(rectOutside(l.rect,s.viewportRect,1))bump('LABEL_CLIPPED',{...ref,label:l});
    if(l.fontSize<12)bump('TEXT_BELOW_MINIMUM_LEGIBILITY',{...ref,label:l});
    if((l.id==='model-title'||l.id==='family-title')&&(l.fontSize<14||l.opacity<0.65))bump('LABEL_UNREADABLE_AT_REQUIRED_CAMERA_DISTANCE',{...ref,label:l});
  }
  for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){const a=labels[i],b=labels[j];const area=intersection(a.rect,b.rect);if(area>16){const min=Math.min(a.rect.width*a.rect.height,b.rect.width*b.rect.height);if(min>0&&area/min>0.18){bump('LABEL_COLLISION',{...ref,a:a.id,b:b.id,ratio:area/min});i=labels.length;j=labels.length;}}}
  const title=labels.find(l=>l.id==='model-title');if(title&&s.cardRect&&rectOutside(title.rect,s.cardRect,2))bump('LABEL_GRID_DETACHED',{...ref,title:title.rect,card:s.cardRect});
  if(title&&active&&active.z!=='auto'&&title.z!=='auto'&&Number(title.z)<Number(active.z))bump('LABEL_DEPTH_ORDER_AMBIGUOUS',{...ref,titleZ:title.z,cardZ:active.z});
  for(const c of s.controls){
    if(rectOutside(c.rect,s.viewportRect,1))bump('CONTROL_OUTSIDE_SAFE_REGION',{...ref,control:c});
    if((s.viewportRect.width<=430)&&(c.rect.width<44||c.rect.height<44))bump('TOUCH_TARGET_UNDERSIZED',{...ref,control:c});
    if(title){const area=intersection(c.rect,title.rect);const min=Math.min(c.rect.width*c.rect.height,title.rect.width*title.rect.height);if(min>0&&area/min>0.20)bump('CONTROL_OVERLAPS_CONTENT',{...ref,control:c.id,label:title.id,ratio:area/min});}
  }
  if(s.readingIntersectsStage>5000&&!s.supportInert)bump('READING_CONTENT_INSIDE_PROHIBITED_STAGE_REGION',{...ref,area:s.readingIntersectsStage});
  if(s.canvasCount>0)bump('STAGE_CONTENT_BEHIND_GEOMETRY',{...ref,canvasCount:s.canvasCount});
}

const familySignatures=new Map();
for(const vp of VIEWPORTS){
  const {page,loaded}=await makePage(vp);if(!loaded){await page.close();continue;}
  for(let z=0;z<FAMILIES.length;z++){
    for(let y=0;y<LENSES.length;y++){
      for(let x=0;x<FAMILIES[z].models.length;x++){
        await setCoordinate(page,z,x,y);
        const overview=await snapshot(page,vp,z,x,y,'OVERVIEW');
        observations.push(overview);analyzeSnapshot(overview);
        const inspect=await page.$('.mm-model-card[data-mm-x-position="active"] [data-mm-inspect]');if(inspect)await inspect.focus();await waitStable(page,40);
        const browse=await snapshot(page,vp,z,x,y,'BROWSE');
        observations.push(browse);analyzeSnapshot(browse);
        const ref=stateRef(vp,z,x,y,'PAIR');
        const same=overview.cardRect&&browse.cardRect&&rectDelta(overview.cardRect,browse.cardRect)<0.5&&overview.cardTransform===browse.cardTransform;
        if(!documentCameraDeclared(sourceText[sourceFiles[0]]||'',sourceText[sourceFiles[7]]||''))bump('CAMERA_OVERVIEW_INCOHERENT',{...ref,reason:'NO_EXPLICIT_CAMERA_STATE'});
        if(same)bump('CAMERA_BROWSE_STATE_INCOHERENT',{...ref,reason:'BROWSE_GEOMETRY_IDENTICAL_TO_OVERVIEW'});
        if((overview.cardRect&&rectOutside(overview.cardRect,overview.viewportRect,2))||(browse.cardRect&&rectOutside(browse.cardRect,browse.viewportRect,2)))bump('CAMERA_TRANSITION_CLIPS_CONTENT',ref);
        if(!familySignatures.has(z))familySignatures.set(z,new Set());familySignatures.get(z).add(overview.familyVisualSignature);
      }
    }
  }
  await page.close();
}
function documentCameraDeclared(html,js){return /methodCameraState|mmCamera|cameraState|OVERVIEW|BROWSE/.test(html+js);}
const familyRepresentative=[...familySignatures.entries()].map(([z,set])=>({z,values:[...set]}));
if(new Set(familyRepresentative.map(x=>x.values[0])).size<4)bump('ATMOSPHERE_STATE_MISMATCH',{reason:'FAMILY_VISUAL_SIGNATURES_NOT_DISTINCT',familyRepresentative});

for(const vp of VIEWPORTS){
  const {page,loaded}=await makePage(vp);if(!loaded){await page.close();continue;}
  for(let z=0;z<FAMILIES.length;z++)for(let x=0;x<FAMILIES[z].models.length;x++){
    await setCoordinate(page,z,x,0);
    const inspect=await page.$('.mm-model-card[data-mm-x-position="active"] [data-mm-inspect]');
    if(inspect)await inspect.focus();await waitStable(page,30);
    const origin=await snapshot(page,vp,z,x,0,'BROWSE');
    let realPointer=true;
    try{await inspect.click();}catch{realPointer=false;await page.evaluate(()=>document.querySelector('.mm-model-card[data-mm-x-position="active"] [data-mm-inspect]')?.click());}
    await page.waitForSelector('dialog[open]',{timeout:5000}).catch(()=>{});await waitStable(page,80);
    const opened=await page.evaluate(()=>{const d=document.querySelector('dialog');const close=document.querySelector('[data-mm-dialog-close]');const support=document.querySelector('.mm-support');const r=d?.getBoundingClientRect();return {open:Boolean(d?.open),htmlState:document.documentElement.dataset.methodsModelsInspection||'',bodyPosition:getComputedStyle(document.body).position,supportInert:Boolean(support?.inert),dialogRect:r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}:null,closeExists:Boolean(close),focusKey:document.activeElement?`${document.activeElement.tagName}:${document.activeElement.getAttribute('data-mm-inspect')??''}:${document.activeElement.getAttribute('aria-label')??''}`:'',scroll:{x:scrollX,y:scrollY}};});
    const cycleRef={viewport:vp.id,coordinate:coordinateId(z,x,0),camera:'BROWSE'};
    if(!opened.open||opened.htmlState!=='open'||opened.bodyPosition!=='fixed')bump('INSPECTION_DID_NOT_FREEZE_PAGE',{...cycleRef,opened});
    if(!opened.supportInert)bump('BACKGROUND_NOT_INERT_DURING_INSPECTION',{...cycleRef,opened});
    if(!opened.dialogRect||rectOutside(opened.dialogRect,{left:0,top:0,right:vp.width,bottom:vp.height},2))bump('INSPECTION_FOREGROUND_CLIPPED',{...cycleRef,rect:opened.dialogRect});
    if(!opened.closeExists)bump('RETURN_CONTROL_MISSING',{...cycleRef});
    if((x+z)%2===0)await page.click('[data-mm-dialog-close]').catch(()=>page.evaluate(()=>document.querySelector('[data-mm-dialog-close]')?.click()));else await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('dialog')?.open,{timeout:5000}).catch(()=>{});await waitStable(page,120);
    const returned=await snapshot(page,vp,z,x,0,'BROWSE');
    if(returned.rootState.x!==origin.rootState.x||returned.rootState.y!==origin.rootState.y||returned.rootState.z!==origin.rootState.z)bump('RETURN_COORDINATE_MISMATCH',{...cycleRef,origin:origin.rootState,returned:returned.rootState});
    if(returned.projection.camera!==origin.projection.camera)bump('RETURN_CAMERA_MISMATCH',{...cycleRef,origin:origin.projection.camera,returned:returned.projection.camera});
    if(Math.abs(returned.scroll.x-origin.scroll.x)>1||Math.abs(returned.scroll.y-origin.scroll.y)>1)bump('RETURN_SCROLL_MISMATCH',{...cycleRef,origin:origin.scroll,returned:returned.scroll});
    if(returned.focusKey!==origin.focusKey)bump('RETURN_FOCUS_MISMATCH',{...cycleRef,origin:origin.focusKey,returned:returned.focusKey});
    if(returned.familyVisualSignature!==origin.familyVisualSignature)bump('RETURN_ATMOSPHERE_MISMATCH',{...cycleRef});
    inspectionCycles.push({viewport:vp.id,coordinate:coordinateId(z,x,0),realPointer,origin:{state:origin.rootState,scroll:origin.scroll,focus:origin.focusKey,atmosphere:origin.familyVisualSignature},opened,returned:{state:returned.rootState,scroll:returned.scroll,focus:returned.focusKey,atmosphere:returned.familyVisualSignature}});
  }
  await page.close();
}

{
  const vp=VIEWPORTS.find(v=>v.id==='STANDARD_DESKTOP');const {page,loaded}=await makePage(vp);let result={attempted:true,loaded};
  if(loaded){await page.focus('[data-mm-model-deck]');await page.keyboard.press('ArrowRight');await waitStable(page);const x=Number(await page.$eval('[data-mm-showroom]',e=>e.dataset.mmX));await page.keyboard.press('ArrowDown');await waitStable(page);const y=Number(await page.$eval('[data-mm-showroom]',e=>e.dataset.mmY));const inspect=await page.$('.mm-model-card[data-mm-x-position="active"] [data-mm-inspect]');await inspect.focus();await page.keyboard.press('Enter');await page.waitForSelector('dialog[open]',{timeout:4000}).catch(()=>{});const opened=await page.$eval('dialog',d=>d.open).catch(()=>false);await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog')?.open,{timeout:4000}).catch(()=>{});result={...result,xChanged:x===1,yChanged:y===1,inspectionOpened:opened,inspectionClosed:!(await page.$eval('dialog',d=>d.open).catch(()=>false)),focusRestored:(await page.evaluate(()=>document.activeElement?.hasAttribute('data-mm-inspect')))};}
  inputTests.keyboard=result;await page.close();
}
{
  const vp=VIEWPORTS.find(v=>v.id==='PHONE_PORTRAIT');const {page,loaded}=await makePage(vp,{touch:true});let result={attempted:true,loaded};
  const tap=async sel=>{const r=await page.$eval(sel,e=>{const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};});await page.touchscreen.tap(r.x,r.y);await waitStable(page);};
  if(loaded){await tap('[data-mm-next]');const x=Number(await page.$eval('[data-mm-showroom]',e=>e.dataset.mmX));await tap('.mm-lens-tab:nth-of-type(2)');const y=Number(await page.$eval('[data-mm-showroom]',e=>e.dataset.mmY));await tap('[data-mm-family-next]');const z=Number(await page.$eval('[data-mm-showroom]',e=>e.dataset.mmZ));let inspectionOpened=false;try{await tap('.mm-model-card[data-mm-x-position="active"] [data-mm-inspect]');inspectionOpened=await page.$eval('dialog',d=>d.open);}catch{}if(inspectionOpened)await tap('[data-mm-dialog-close]');result={...result,xChanged:x===1,yChanged:y===1,zChanged:z===1,inspectionOpened,inspectionClosed:!(await page.$eval('dialog',d=>d.open).catch(()=>false))};}
  inputTests.touch=result;await page.close();
}
{
  const vp=VIEWPORTS.find(v=>v.id==='STANDARD_DESKTOP');const {page,loaded}=await makePage(vp,{reducedMotion:true});let result={attempted:true,loaded};
  if(loaded){result=await page.evaluate(()=>{const vals=[...document.querySelectorAll('.mm-model-card,.mm-family-tab,.mm-lens-tab')].slice(0,12).map(e=>({duration:getComputedStyle(e).transitionDuration,animation:getComputedStyle(e).animationDuration}));const seconds=s=>s.split(',').map(x=>x.trim()).map(x=>x.endsWith('ms')?parseFloat(x)/1000:parseFloat(x)||0);return {attempted:true,loaded:true,values:vals,allBounded:vals.every(v=>seconds(v.duration).every(n=>n<=0.02)&&seconds(v.animation).every(n=>n<=0.02))};});}
  inputTests.reducedMotion=result;await page.close();
}
{
  const vp=VIEWPORTS.find(v=>v.id==='STANDARD_DESKTOP');const {page,loaded}=await makePage(vp,{javaScript:false});let result={attempted:true,loaded};
  if(loaded){result=await page.evaluate(()=>({attempted:true,loaded:true,heading:Boolean(document.querySelector('h1')),showroom:Boolean(document.querySelector('[data-mm-showroom]')),modelCards:document.querySelectorAll('.mm-model-card').length,visibleModelCards:[...document.querySelectorAll('.mm-model-card')].filter(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;}).length,canonicalText:document.body.innerText.includes('451 Structural Envelope'),controls:document.querySelectorAll('.mm-stage button').length}));if(!result.showroom||result.visibleModelCards===0)bump('NO_ACTIVE_COORDINATE',{viewport:vp.id,mode:'NO_SCRIPT',result});}
  inputTests.noScript=result;await page.close();
}
{
  const vp=VIEWPORTS.find(v=>v.id==='STANDARD_DESKTOP');const {page,loaded}=await makePage(vp);let result={attempted:true,loaded};
  if(loaded){const trace=[];for(let i=0;i<28;i++){await page.keyboard.press('Tab');trace.push(await page.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e);return {tag:e?.tagName,id:e?.id||'',aria:e?.getAttribute('aria-label')||'',outline:s.outlineStyle,outlineWidth:s.outlineWidth,rect:e?(()=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};})():null};}));}result={...result,trace,uniqueFocusKeys:new Set(trace.map(x=>`${x.tag}:${x.id}:${x.aria}`)).size,visibleFocusCount:trace.filter(x=>x.outline!=='none'&&parseFloat(x.outlineWidth)>0).length};}
  inputTests.focus=result;await page.close();
}

const RISK_SHOTS = [
  ['SMALLEST_VIEWPORT','SMALL_PHONE',0,0,0,'OVERVIEW','STAGE'],['LARGEST_VIEWPORT','WIDE_DESKTOP',3,6,2,'OVERVIEW','STAGE'],
  ['SHORTEST_VIEWPORT','SHORT_LAPTOP',0,1,0,'BROWSE','STAGE'],['TABLET_PORTRAIT','LARGE_TABLET_PORTRAIT',0,5,2,'OVERVIEW','STAGE'],
  ['TABLET_LANDSCAPE','TABLET_LANDSCAPE',1,3,1,'OVERVIEW','STAGE'],['DENSEST_FAMILY_PLANE','STANDARD_DESKTOP',1,6,0,'OVERVIEW','STAGE'],
  ['LONGEST_FAMILY_LABEL','STANDARD_DESKTOP',3,0,0,'OVERVIEW','STAGE'],['LONGEST_MODEL_LABEL','STANDARD_DESKTOP',1,3,0,'OVERVIEW','STAGE'],
  ['LONGEST_LENS_LABEL','STANDARD_DESKTOP',0,0,2,'OVERVIEW','STAGE'],['FAMILY_TRANSITION_STRUCTURE','STANDARD_DESKTOP',0,0,0,'OVERVIEW','STAGE'],
  ['FAMILY_TRANSITION_PRESSURE','STANDARD_DESKTOP',1,0,0,'OVERVIEW','STAGE'],['FAMILY_TRANSITION_CLOSURE','STANDARD_DESKTOP',2,0,0,'OVERVIEW','STAGE'],
  ['FAMILY_TRANSITION_METHOD','STANDARD_DESKTOP',3,0,0,'OVERVIEW','STAGE'],['CAMERA_OVERVIEW','STANDARD_DESKTOP',0,0,0,'OVERVIEW','STAGE'],
  ['CAMERA_BROWSE','STANDARD_DESKTOP',0,0,0,'BROWSE','STAGE'],['INSPECTION_FOREGROUND','PHONE_PORTRAIT',1,3,0,'BROWSE','INSPECTION'],
  ['RETURN_RESTORATION_STATE','STANDARD_DESKTOP',2,3,1,'BROWSE','RETURN'],['REDUCED_MOTION_STATE','STANDARD_DESKTOP',0,0,0,'OVERVIEW','REDUCED'],
  ['KEYBOARD_FOCUS_STATE','STANDARD_DESKTOP',0,0,0,'BROWSE','FOCUS'],['KNOWN_FAILURE_FIXTURE','STANDARD_DESKTOP',0,1,0,'OVERVIEW','STAGE']
];
for(const spec of RISK_SHOTS){const [risk,vpid,z,x,y,camera,mode]=spec;const vp=VIEWPORTS.find(v=>v.id===vpid);const {page,loaded}=await makePage(vp,{reducedMotion:mode==='REDUCED'});if(!loaded){await page.close();continue;}await setCoordinate(page,z,x,y);if(camera==='BROWSE'||mode==='FOCUS')await page.focus('.mm-model-card[data-mm-x-position="active"] [data-mm-inspect]');if(mode==='INSPECTION'){await page.evaluate(()=>document.querySelector('.mm-model-card[data-mm-x-position="active"] [data-mm-inspect]')?.click());await page.waitForSelector('dialog[open]',{timeout:4000}).catch(()=>{});}if(mode==='RETURN'){await page.evaluate(()=>document.querySelector('.mm-model-card[data-mm-x-position="active"] [data-mm-inspect]')?.click());await page.waitForSelector('dialog[open]',{timeout:4000}).catch(()=>{});await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog')?.open,{timeout:4000}).catch(()=>{});}await waitStable(page,80);const file=`${safeName(EXECUTION_COMMIT.slice(0,12))}__${vpid}__${safeName(coordinateId(z,x,y))}__${camera}__${mode}__${risk}.png`;const target=path.join(SCREENSHOT_DIR,file);await page.screenshot({path:target,fullPage:false});screenshotManifest.push({risk_class:risk,file:`screenshots/${file}`,sha256:sha256(target),viewport:vp,coordinate_id:coordinateId(z,x,y),camera_state:camera,display_mode:mode});await page.close();}

const checks=[];
for(const code of FINDING_CODES){
  let actual=counts[code];
  if(code==='WRONG_EXACT_HEAD')actual=EXECUTION_COMMIT===EXPECTED_SOURCE_HEAD?0:1;
  if(code==='HARNESS_LOAD_FAILED')actual=counts[code];
  if(code==='REQUIRED_EVIDENCE_MISSING')actual=sourceFailures.length + (screenshotManifest.length<RISK_SHOTS.length?1:0);
  checks.push({finding_code:code,actual,operator:'eq',expected:0,on_fail:(code==='WRONG_EXACT_HEAD'||code==='HARNESS_LOAD_FAILED')?'INVALID':code==='REQUIRED_EVIDENCE_MISSING'?'UNEVALUABLE':'FAIL',measurement_status:'EVALUABLE',detection_method:'METHODS_EUCLIDEAN_NONPRODUCT_COHERENCE_RUNNER_v1',viewport:null,state_coordinate:null,camera_state:null,evidence_reference:`raw-observations.json#${code}`});
}
const primaryCounts={stable_stage_evaluations:observations.length,inspection_return_cycles:inspectionCycles.length,minimum_primary_total:observations.length+inspectionCycles.length,expected_stable_stage:1350,expected_inspection_return:225,expected_total:1575};
const factorEvidenceComplete={
  A: observations.length===1350,
  G: observations.length===1350,
  H: observations.length===1350&&screenshotManifest.length===RISK_SHOTS.length,
  I: inspectionCycles.length===225,
  D: ['keyboard','touch','reducedMotion','noScript','focus'].every(k=>inputTests[k]?.attempted&&inputTests[k]?.loaded),
  W: familyRepresentative.length===4,
  C: EXECUTION_COMMIT===EXPECTED_SOURCE_HEAD&&sourceFailures.length===0
};
const candidateEvidence={instrument_version:'1.0.0',target:{candidate_head:EXECUTION_COMMIT,target_url:ROUTE,exact_head_verified:EXECUTION_COMMIT===EXPECTED_SOURCE_HEAD,harness_loaded:counts.HARNESS_LOAD_FAILED===0,required_source_present:sourceFailures.length===0,evidence_contaminated:false,harness_class:'NONPRODUCT_EXACT_HEAD_BROWSER_ADAPTER'},factor_evidence_complete:factorEvidenceComplete,checks,human_review:{required:true,delivery_complete:false,disposition:'UNEVALUABLE_DELIVERY_OR_EVIDENCE_DEFECT'},screenshot_candidates:screenshotManifest};
const raw={contract:'METHODS_EUCLIDEAN_SHOWROOM_NONPRODUCT_HARNESS_COHERENCE_PASS_v1',instrument:'METHODS_MODELS_COHERENCE_INSTRUMENT@1.0.0',execution:{candidate_source_head:EXECUTION_COMMIT,harness_commit:HARNESS_COMMIT,expected_source_head:EXPECTED_SOURCE_HEAD,origin:ORIGIN,route:ROUTE,generated_at:new Date().toISOString()},sourcePresence,sourceAssertions,sourceFailures,primaryCounts,counts,examples,familyRepresentative,inputTests,consoleErrors,pageErrors,observations,inspectionCycles,screenshotManifest};
writeJson(path.join(OUT_DIR,'raw-observations.json'),raw);
writeJson(path.join(OUT_DIR,'candidate-evidence.json'),candidateEvidence);
writeJson(path.join(OUT_DIR,'screenshot-manifest.json'),{version:'1.0.0',exact_head:EXECUTION_COMMIT,selected:screenshotManifest});
writeJson(path.join(OUT_DIR,'human-review-receipt.template.json'),{exact_candidate_head:EXECUTION_COMMIT,exact_review_artifact:'GITHUB_ACTIONS_ARTIFACT_PENDING',reviewer_identity:'REQUIRED',reviewer_role:'HUMAN_VISUAL_REVIEWER',review_timestamp:'REQUIRED',device_or_viewport:'REQUIRED',reviewed_coordinates:[],reviewed_camera_states:['OVERVIEW','BROWSE'],reviewed_inspection_states:[],disposition:'REQUIRED',material_findings:[],accepted_limitations:[],evidence_references:screenshotManifest.map(x=>x.file)});
const summary=`# Methods Euclidean Nonproduct Coherence Execution\n\n- Exact source head: \`${EXECUTION_COMMIT}\`\n- Stable stage observations: ${observations.length} / 1350\n- Inspection and return cycles: ${inspectionCycles.length} / 225\n- Minimum primary evaluations: ${observations.length+inspectionCycles.length} / 1575\n- Screenshots: ${screenshotManifest.length} / ${RISK_SHOTS.length}\n- Human review: pending\n- Automated registered finding counts: ${Object.values(counts).reduce((a,b)=>a+b,0)}\n\nThis is nonproduct evidence. It does not authorize public mutation, merge, or product acceptance.\n`;
fs.writeFileSync(path.join(OUT_DIR,'execution-summary.md'),summary);
const manifestFiles=[];for(const f of fs.readdirSync(OUT_DIR,{recursive:true})){const p=path.join(OUT_DIR,f);if(fs.existsSync(p)&&fs.statSync(p).isFile())manifestFiles.push({path:f.replaceAll('\\','/'),bytes:fs.statSync(p).size,sha256:sha256(p)});}writeJson(path.join(OUT_DIR,'artifact-digests.json'),{candidate_source_head:EXECUTION_COMMIT,harness_commit:HARNESS_COMMIT,files:manifestFiles.sort((a,b)=>a.path.localeCompare(b.path))});
await browser.close();
console.log(JSON.stringify({out_dir:OUT_DIR,primaryCounts,factorEvidenceComplete,sourceFailures,counts,screenshot_count:screenshotManifest.length,human_review:'PENDING'},null,2));
