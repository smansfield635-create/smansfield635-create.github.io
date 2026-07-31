import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import puppeteer from "puppeteer-core";
import { PNG } from "pngjs";

const ORIGIN = process.env.LAWS_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const BASE = process.env.BASELINE_COMMIT || "0ff5741803926a6c218415587955aa867f93a0f7";
const HEAD = process.env.EXECUTION_COMMIT || process.env.GITHUB_SHA || "HEAD";
const OUT = "laws-cp5-r2-celestial-verification.json";
const SHOTS = "laws-cp5-r2-celestial-screenshots";
const AUTH = ["flow","integrity","reality","structure","test","research"];
const CANONICAL = {
  flow:[0,0,0,1],
  integrity:[0,0,Math.SQRT1_2,Math.SQRT1_2],
  reality:[0,0,1,0],
  structure:[0,0,-Math.SQRT1_2,Math.SQRT1_2],
  test:[-0.43283662594337136,0,0,0.9014723818520222],
  research:[0.9014723818520223,0,0,0.4328366259433712]
};
const VIEWPORTS = [
  {id:"SAMSUNG_PHONE_PORTRAIT_430x932",width:430,height:932,mobile:true},
  {id:"PHONE_LANDSCAPE_932x430",width:932,height:430,mobile:true},
  {id:"TABLET_1024x1366",width:1024,height:1366,mobile:true},
  {id:"DESKTOP_1440x1000",width:1440,height:1000,mobile:false}
];
const failures = [];
const observations = [];
const assertion = (ok,id,observed=null,profile="source") => {
  if (!ok) failures.push({profile,id,observed});
};
const digest = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const sleep = ms => new Promise(r => setTimeout(r,ms));
fs.rmSync(SHOTS,{recursive:true,force:true});
fs.mkdirSync(SHOTS,{recursive:true});

const source = {
  crystals: fs.readFileSync("laws/index.crystals.js","utf8"),
  interactions: fs.readFileSync("laws/index.interactions.js","utf8"),
  html: fs.readFileSync("laws/index.html","utf8")
};
const changed = execFileSync("git",["diff","--name-only",BASE,HEAD],{encoding:"utf8"})
  .split(/\r?\n/).map(v=>v.trim()).filter(Boolean).sort();
const productChanged = changed.filter(p=>p.startsWith("laws/"));
assertion(JSON.stringify(productChanged)===JSON.stringify(["laws/index.crystals.js"]),"PRODUCT_CHANGED_PATH_SET_INVALID",{changed,productChanged});
assertion(changed.every(p=>[
  ".github/workflows/laws-cp5-r2-celestial-verification.yml",
  "laws/index.crystals.js",
  "verification/benchmark-tools/laws-cp5-r2-celestial-verification-v1/laws-cp5-r2-celestial-verification.mjs"
].includes(p)),"CHANGED_PATH_ALLOWLIST_INVALID",changed);
assertion(execFileSync("git",["hash-object","laws/index.interactions.js"],{encoding:"utf8"}).trim()==="be365cc331ee5643f916abee204d4f5f45376c04","INTERACTIONS_BLOB_CHANGED");
assertion(source.crystals.includes("gatewayBodyScale:\n    0.7666667"),"BODY_SCALE_CHANGED");
assertion(source.crystals.includes("horizontalRadius:\n        1.68")&&source.crystals.includes("verticalRadius:\n        1.5008")&&source.crystals.includes("depthRadius:\n        1.2992"),"RADIAL_SPACING_CHANGED");
for (const marker of [
  "CP5_R2_SOLAR_LARGE_CONVECTION_CELLS",
  "CP5_R2_SOLAR_ORANGE_RED_ACTIVITY",
  "CP5_R2_SOLAR_IRREGULAR_GASEOUS_CORONA",
  "CP5_R2_LUNAR_NEUTRAL_MATERIAL",
  "CP5_R2_LUNAR_RELIEF_PRESERVED"
]) assertion(source.crystals.includes(marker),"CELESTIAL_SOURCE_MARKER_MISSING",marker);
assertion(source.interactions.includes("singleActiveOuterAuthorityLabel:true"),"SINGLE_ACTIVE_LABEL_CONTRACT_MISSING");
assertion(source.html.includes("index.interactions.js?v=be365cc331ee5643f916abee204d4f5f45376c04"),"INTERACTION_HTML_CORRESPONDENCE_CHANGED");

function stats(values) {
  if (!values.length) return {mean:0,std:0,min:0,max:0};
  const mean=values.reduce((a,b)=>a+b,0)/values.length;
  const variance=values.reduce((a,b)=>a+(b-mean)**2,0)/values.length;
  return {mean,std:Math.sqrt(variance),min:Math.min(...values),max:Math.max(...values)};
}
function analyzeCrop(file,kind) {
  const png=PNG.sync.read(fs.readFileSync(file));
  const cx=png.width/2, cy=png.height/2;
  const nominal=Math.min(png.width,png.height)*0.31;
  const body=[], haloBins=Array(24).fill(0), haloTotal=Array(24).fill(0);
  for(let y=0;y<png.height;y++) for(let x=0;x<png.width;x++){
    const i=(y*png.width+x)*4, r=png.data[i],g=png.data[i+1],b=png.data[i+2],a=png.data[i+3];
    const d=Math.hypot(x-cx,y-cy)/nominal;
    if(d<=1.02 && a>20){
      const l=.2126*r+.7152*g+.0722*b;
      body.push({r,g,b,l,d});
    } else if(d>1.02&&d<1.52){
      const angle=(Math.atan2(y-cy,x-cx)+Math.PI*2)%(Math.PI*2);
      const bin=Math.min(23,Math.floor(angle/(Math.PI*2)*24));
      haloTotal[bin]++;
      if(kind==="solar" && r>90 && g>35 && r>b*1.2 && r>g*.95) haloBins[bin]++;
    }
  }
  const luma=stats(body.map(p=>p.l));
  if(kind==="solar"){
    const solar=body.filter(p=>p.r>100&&p.r>p.b*1.15&&p.g>24);
    const denominator=Math.max(1,solar.length);
    const fractions={
      yellowWhite:solar.filter(p=>p.r>220&&p.g>175&&p.b>75).length/denominator,
      gold:solar.filter(p=>p.r>205&&p.g>=110&&p.g<=220&&p.b<125).length/denominator,
      orange:solar.filter(p=>p.r>165&&p.g>=45&&p.g<140&&p.b<105).length/denominator,
      redOrange:solar.filter(p=>p.r>105&&p.g<90&&p.b<85).length/denominator
    };
    const center=stats(solar.filter(p=>p.d<.48).map(p=>p.l));
    const limb=stats(solar.filter(p=>p.d>.74&&p.d<1.0).map(p=>p.l));
    const haloFractions=haloBins.map((n,i)=>n/Math.max(1,haloTotal[i]));
    const halo=stats(haloFractions);
    return {kind,width:png.width,height:png.height,coverage:solar.length/Math.max(1,body.length),luma,fractions,center,limb,halo:{...halo,bins:haloFractions,activeBins:haloFractions.filter(v=>v>.015).length}};
  }
  const neutral=body.filter(p=>Math.abs(p.r-p.g)<34&&Math.abs(p.g-p.b)<42);
  const purple=body.filter(p=>p.b>p.r*1.22&&p.b>p.g*1.13&&p.b-p.r>22);
  const light=body.filter(p=>p.l>150).length/Math.max(1,body.length);
  const dark=body.filter(p=>p.l<70).length/Math.max(1,body.length);
  return {kind,width:png.width,height:png.height,luma,neutralFraction:neutral.length/Math.max(1,body.length),purpleFraction:purple.length/Math.max(1,body.length),lightFraction:light,darkFraction:dark};
}

async function waitReady(page){
  await page.waitForFunction(()=>Boolean(globalThis.DGB_LAWS_CONTROLLER&&globalThis.DGBLawsStagedLoader),{timeout:45000});
  await page.evaluate(async()=>{await globalThis.DGBLawsStagedLoader.loadOrbitSystems();await globalThis.DGBLawsStagedLoader.loadInteractionSystems();});
  await page.waitForFunction(()=>{
    const f=globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.();
    const c=globalThis.DGB_LAWS_CRYSTALS_RECEIPT;
    const i=globalThis.DGB_LAWS_INTERACTIONS_RECEIPT;
    return Boolean(f&&c?.rendererInitialized&&i?.initialized&&Number(f.semanticProjectionRevision||0)>0);
  },{timeout:45000});
  await sleep(250);
}
async function setPrimary(page,id){
  const result=await page.evaluate((authorityId,q)=>{
    const c=globalThis.DGB_LAWS_CONTROLLER;
    if(!c?.beginOrbitGesture?.()) return false;
    if(c.requestOrbitPreview({quaternion:q,primaryId:authorityId})===false) return false;
    return c.requestOrbitCommit()!==false;
  },id,CANONICAL[id]);
  if(!result) throw new Error(`PRIMARY_REJECTED:${id}`);
  await page.waitForFunction(authorityId=>{
    const root=document.querySelector("[data-laws-root]");
    const f=globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.();
    return (root?.dataset.lawsSpatialPrimaryId||f?.orbitFocus||"")===authorityId;
  },{timeout:15000},id);
  await sleep(350);
}
async function snapshot(page){
  return page.evaluate(ids=>{
    const root=document.querySelector("[data-laws-root]");
    const f=globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.();
    const labels=[...document.querySelectorAll("[data-laws-projected-category-label]")];
    const visible=e=>{if(!e||e.hidden)return false;const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=="none"&&s.visibility!=="hidden"&&Number(s.opacity||1)>.01&&r.width>0&&r.height>0;};
    return {
      primary:root?.dataset.lawsSpatialPrimaryId||f?.orbitFocus||"",
      activeCluster:root?.dataset.lawsActiveCluster||f?.activeClusterDirection||"",
      state:root?.dataset.lawsControllerState||f?.state||"",
      visibleLabels:labels.filter(visible).map(e=>e.dataset.direction),
      suppressedLabels:labels.filter(e=>!visible(e)).map(e=>({id:e.dataset.direction,hidden:e.hidden,tabIndex:e.tabIndex,ariaHidden:e.getAttribute("aria-hidden"),pointer:getComputedStyle(e).pointerEvents})),
      centerGlobe:Boolean(document.querySelector("[data-upstream-compass-control]")?.getBoundingClientRect().width),
      projection:(f?.semanticProjection||[]).filter(r=>r?.kind==="category"&&ids.includes(r.id)),
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      interaction:globalThis.DGB_LAWS_INTERACTIONS_RECEIPT||null,
      crystal:globalThis.DGB_LAWS_CRYSTALS_RECEIPT||null
    };
  },AUTH);
}
async function bodyGeometry(page,id){
  return page.evaluate(authorityId=>{
    const field=document.querySelector("[data-laws-scene-field]");
    field.scrollIntoView({block:"center",inline:"center",behavior:"instant"});
    const f=globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.();
    const record=(f?.semanticProjection||[]).find(r=>r?.kind==="category"&&r.id===authorityId);
    const rect=field.getBoundingClientRect();
    if(!record) return null;
    return {x:rect.left+Number(record.x||0),y:rect.top+Number(record.y||0),radius:Math.max(42,Number(record.radiusPx||70)),field:{x:rect.left,y:rect.top,width:rect.width,height:rect.height}};
  },id);
}
function boundedClip(geometry,viewport){
  const half=geometry.radius*1.62;
  const x=Math.max(0,Math.min(viewport.width-2,geometry.x-half));
  const y=Math.max(0,Math.min(viewport.height-2,geometry.y-half));
  const width=Math.max(2,Math.min(viewport.width-x,half*2));
  const height=Math.max(2,Math.min(viewport.height-y,half*2));
  return {x,y,width,height};
}
async function captureBody(page,profile,id,stateLabel){
  const geometry=await bodyGeometry(page,id);
  if(!geometry) throw new Error(`PROJECTION_MISSING:${id}`);
  await sleep(150);
  const clip=boundedClip(geometry,{width:profile.width,height:profile.height});
  const file=path.join(SHOTS,`${profile.id.toLowerCase()}-${id}-${stateLabel}.png`);
  await page.screenshot({path:file,clip});
  return {file,geometry,clip,metrics:analyzeCrop(file,id==="test"?"solar":"lunar")};
}
async function openCluster(page,id){
  const accepted=await page.evaluate(v=>globalThis.DGB_LAWS_CONTROLLER.requestCategorySelection(v),id);
  if(accepted===false) throw new Error(`CLUSTER_REJECTED:${id}`);
  await page.waitForFunction(v=>{
    const root=document.querySelector("[data-laws-root]");
    const f=globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.();
    return (root?.dataset.lawsActiveCluster||f?.activeClusterDirection||"")===v;
  },{timeout:15000},id);
  await sleep(200);
}
async function returnConstellation(page){
  await page.evaluate(()=>globalThis.DGB_LAWS_CONTROLLER.requestReturnToConstellation());
  await page.waitForFunction(()=>document.querySelector("[data-laws-root]")?.dataset.lawsControllerState==="CONSTELLATION",{timeout:15000});
  await sleep(200);
}

let browser;
try{
  browser=await puppeteer.launch({executablePath:CHROME_PATH,headless:"new",args:["--no-sandbox","--disable-dev-shm-usage","--enable-webgl","--ignore-gpu-blocklist","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
  for(const profile of VIEWPORTS){
    const page=await browser.newPage();
    const telemetry={pageErrors:[],requestFailures:[],consoleErrors:[],httpErrors:[]};
    page.on("pageerror",e=>telemetry.pageErrors.push(String(e?.message||e)));
    page.on("requestfailed",r=>telemetry.requestFailures.push({url:r.url(),error:r.failure()?.errorText||""}));
    page.on("console",m=>{if(m.type()==="error")telemetry.consoleErrors.push(m.text());});
    page.on("response",r=>{if(r.status()>=400)telemetry.httpErrors.push({url:r.url(),status:r.status()});});
    await page.setViewport({width:profile.width,height:profile.height,deviceScaleFactor:1,isMobile:profile.mobile,hasTouch:profile.mobile});
    const response=await page.goto(`${ORIGIN}/laws/`,{waitUntil:"domcontentloaded",timeout:45000});
    await waitReady(page);
    const evidence={profile:profile.id,httpStatus:response?.status()||0,authorityStates:[],telemetry};
    for(const id of AUTH){
      await setPrimary(page,id);
      const s=await snapshot(page);
      evidence.authorityStates.push({id,state:s});
      assertion(s.primary===id,"AUTHORITY_PRIMARY_REACHABILITY_INVALID",s,profile.id);
      assertion(s.visibleLabels.length===1&&s.visibleLabels[0]===id,"SINGLE_LABEL_PRESERVATION_INVALID",s,profile.id);
      assertion(s.suppressedLabels.length===5&&s.suppressedLabels.every(v=>v.hidden&&v.tabIndex<0&&v.ariaHidden==="true"&&v.pointer==="none"),"NONPRIMARY_LABEL_SUPPRESSION_INVALID",s.suppressedLabels,profile.id);
      assertion(s.centerGlobe,"CENTER_GLOBE_UNREACHABLE",s,profile.id);
      assertion(s.overflow<=1,"HORIZONTAL_OVERFLOW",s.overflow,profile.id);
    }

    await setPrimary(page,"flow");
    evidence.testNonprimary=await captureBody(page,profile,"test","nonprimary");
    await setPrimary(page,"test");
    evidence.testPrimary=await captureBody(page,profile,"test","primary");
    await page.screenshot({path:path.join(SHOTS,`${profile.id.toLowerCase()}-full-test-primary.png`),fullPage:true});
    const solar=evidence.testPrimary.metrics;
    assertion(solar.coverage>.30,"SOLAR_BODY_COVERAGE_LOW",solar,profile.id);
    assertion(solar.luma.std>22,"SOLAR_UNIFORM_YELLOW_RESULT",solar,profile.id);
    assertion(solar.fractions.yellowWhite>.025&&solar.fractions.gold>.08,"SOLAR_BRIGHT_CELL_HIERARCHY_MISSING",solar,profile.id);
    assertion(solar.fractions.orange>.04,"DEEP_ORANGE_CONTRAST_NOT_VISIBLE",solar,profile.id);
    assertion(solar.fractions.redOrange>.003,"RED_ORANGE_ACTIVITY_NOT_VISIBLE",solar,profile.id);
    assertion(Math.abs(solar.center.mean-solar.limb.mean)>5,"SOLAR_LIMB_VARIATION_NOT_VISIBLE",solar,profile.id);
    assertion(solar.halo.activeBins>=3&&solar.halo.std>.015,"NATURAL_IRREGULAR_GLOW_NOT_ESTABLISHED",solar,profile.id);

    await openCluster(page,"test");
    evidence.testCluster=await snapshot(page);
    assertion(evidence.testCluster.activeCluster==="test","TEST_CLUSTER_NOT_OPEN",evidence.testCluster,profile.id);
    await returnConstellation(page);

    await setPrimary(page,"research");
    evidence.researchPrimary=await captureBody(page,profile,"research","primary");
    await page.screenshot({path:path.join(SHOTS,`${profile.id.toLowerCase()}-full-research-primary.png`),fullPage:true});
    const lunar=evidence.researchPrimary.metrics;
    assertion(lunar.neutralFraction>.48,"LUNAR_NEUTRAL_PALETTE_NOT_DOMINANT",lunar,profile.id);
    assertion(lunar.purpleFraction<.22,"LUNAR_PURPLE_REMAINS_DOMINANT",lunar,profile.id);
    assertion(lunar.luma.std>16&&lunar.lightFraction>.025&&lunar.darkFraction>.04,"LUNAR_RELIEF_OR_TERMINATOR_NOT_READABLE",lunar,profile.id);
    await openCluster(page,"research");
    evidence.researchCluster=await snapshot(page);
    assertion(evidence.researchCluster.activeCluster==="research","RESEARCH_CLUSTER_NOT_OPEN",evidence.researchCluster,profile.id);
    await returnConstellation(page);

    await setPrimary(page,"flow");
    await openCluster(page,"flow");
    evidence.flowCluster=await snapshot(page);
    assertion(evidence.flowCluster.activeCluster==="flow","REPRESENTATIVE_LAW_CLUSTER_NOT_OPEN",evidence.flowCluster,profile.id);
    await returnConstellation(page);

    const actionableHttp=telemetry.httpErrors.filter(v=>{try{return new URL(v.url).pathname!=="/favicon.ico";}catch{return true;}});
    const actionableConsole=telemetry.consoleErrors.filter(v=>!v.includes("favicon.ico")&&!v.includes("Failed to load resource"));
    assertion(telemetry.pageErrors.length===0&&telemetry.requestFailures.length===0&&actionableHttp.length===0&&actionableConsole.length===0,"ACTIONABLE_BROWSER_ERRORS",{...telemetry,actionableHttp,actionableConsole},profile.id);
    observations.push(evidence);
    await page.close();
  }
}catch(error){
  failures.push({profile:"browser",id:"BROWSER_EXECUTION_ABORTED",observed:String(error?.stack||error)});
}finally{
  if(browser) await browser.close().catch(()=>{});
}

const manifest=fs.readdirSync(SHOTS).sort().map(file=>({file,bytes:fs.statSync(path.join(SHOTS,file)).size,sha256:digest(path.join(SHOTS,file))}));
const receipt={
  checkpoint:"LAWS_CHAMBER_CHECKPOINT_5",
  phase:"CP5_R3_EXACT_HEAD_ENGINEERING_VERIFICATION",
  execution:{base:BASE,head:HEAD,branch:process.env.EXECUTION_BRANCH||"",runId:process.env.GITHUB_RUN_ID||""},
  changedPaths:changed,
  crystalBlob:execFileSync("git",["hash-object","laws/index.crystals.js"],{encoding:"utf8"}).trim(),
  interactionsBlob:execFileSync("git",["hash-object","laws/index.interactions.js"],{encoding:"utf8"}).trim(),
  profiles:observations,
  screenshots:manifest,
  failures,
  pass:failures.length===0,
  engineeringOnly:true,
  merged:false,
  deployed:false,
  physicalAcceptance:"NOT_YET"
};
fs.writeFileSync(OUT,JSON.stringify(receipt,null,2)+"\n");
console.log(JSON.stringify({pass:receipt.pass,failures,crystalBlob:receipt.crystalBlob,screenshots:manifest.length},null,2));
if(!receipt.pass) process.exitCode=1;
