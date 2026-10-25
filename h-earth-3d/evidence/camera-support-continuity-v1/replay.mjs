import puppeteer from 'puppeteer-core';import fs from 'node:fs';import {spawn} from 'node:child_process';
const dir=new URL('.',import.meta.url).pathname.replace(/\/$/,'');const server=spawn('python',[dir+'/serve.py'],{stdio:['ignore','pipe','pipe']});server.stdout.on('data',d=>process.stdout.write(d));server.stderr.on('data',d=>process.stderr.write(d));
let browser;const ticker=setInterval(()=>console.log('PREPARING_OR_AUDITING',new Date().toISOString()),30000);try{
for(let i=0;i<30;i++){try{await fetch('http://127.0.0.1:8766/showroom/globe/h-earth/');break;}catch{await new Promise(r=>setTimeout(r,200));}}
browser=await puppeteer.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage'],defaultViewport:{width:540,height:1000},protocolTimeout:300000});
const page=await browser.newPage();await page.setRequestInterception(true);page.on('request',r=>{if(new URL(r.url()).pathname==='/showroom/globe/h-earth/vegetation-prototype/route.js'){const src=fs.readFileSync(process.env.H_EARTH_ASSET_CACHE+'/showroom/globe/h-earth/vegetation-prototype/route.js','utf8').replace('const cssWidth=', 'globalThis.__HEarthAuditPresent=present;\nconst cssWidth=');r.respond({status:200,contentType:'text/javascript',body:src});}else r.continue();});page.on('pageerror',e=>console.log('PAGE_ERROR',e.message));page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,180));});await page.goto('http://127.0.0.1:8766/showroom/globe/h-earth/?arrival=approved-four-trees',{waitUntil:'domcontentloaded',timeout:120000});console.log('PAGE_LOADED');await page.waitForFunction(()=>!!window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.geologicalFormation?.physicalNavigationInstalled,{timeout:600000});console.log('READY');await page.waitForFunction(()=>['test','ready'].includes(document.querySelector('#h-earth-loading-screen')?.dataset.mode),{timeout:180000});await page.mouse.move(270,350);await page.mouse.down();await page.mouse.move(320,350,{steps:8});await page.mouse.up();await page.waitForFunction(()=>!document.querySelector('[data-enter]')?.disabled,{timeout:30000});await page.click('[data-enter]');console.log('ENTERED');
fs.writeFileSync(dir+'/active-receipt.json',JSON.stringify(await page.evaluate(()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE.getReceipt()),null,2));
const result=await page.evaluate(async()=>{
 const resources=performance.getEntriesByType('resource').map(x=>x.name),path=resources.find(x=>/\/navigation\.js\?/.test(x));
 let source=await(await fetch(path)).text();source=source.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,path).href));source+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';const nav=await import(URL.createObjectURL(new Blob([source],{type:'text/javascript'})));
 const bridge=await import(resources.find(x=>/geological-runtime-bridge\.v1\.js\?/.test(x)));if(!bridge.getGeologicalRuntimeBridge())throw Error('GEOLOGICAL_SUPPORT_NOT_ACTIVE');
 globalThis.__candidateNav=nav;globalThis.__candidateBridge=bridge;const pairs=[{name:'north-mountain',a:[88,-260.05],b:[88,-260]},{name:'foothill-north',a:[24,-260.05],b:[24,-260]},{name:'east',a:[95.95,-300],b:[96.05,-300]},{name:'west',a:[-120.05,-300],b:[-119.95,-300]},{name:'portal',a:[40,-260.05],b:[40,-259.95]},{name:'flat-control',a:[0,-110],b:[0,-109.95]}];
 const output={baseline:'8da1b0cd0fbae0799b111bd95c2beed0ba84df99',scope:'Actual navigation proposals and renderer submissions in source-pinned local scene. Diagnostic exposes existing present() only; no product formula changed. Desktop software GPU, not mobile touch timing.',cases:[],screens:[]};
 const compact=s=>({position:s.position,pitch:s.pitchDegrees,yaw:s.yawDegrees,ground:s.terrainElevation,clearance:s.clearance,source:s.geologicalFloorClass||'CLEARANCE_ENVELOPE'});
 for(const pair of pairs)for(const yaw of [0,90,180,270])for(const reverse of [false,true]){
 const [a,b]=reverse?[pair.b,pair.a]:[pair.a,pair.b];const r=nav.auditResolvePosition(...a,yaw);if(!r.eligible){output.cases.push({name:pair.name,yaw,reverse,invalidStart:r.issues});continue;}
 const state=nav.auditStateFrom(r,{yaw,pitch:-8,fov:56,sequence:100,action:'AUDIT_START'}),proposal=nav.proposeHEarthFunctionalLandscapeNavigation(state,{action:'SET_CAMERA_POSITION',position:{x:b[0],z:b[1]}});
 const record={name:pair.name,yaw,reverse,accepted:proposal.ok,issues:proposal.issues,before:compact(state),after:compact(proposal.state),dy:proposal.state.position.y-state.position.y,dg:proposal.state.terrainElevation-state.terrainElevation};
 if(proposal.ok){globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);if(pair.name==='north-mountain'&&yaw===180&&!reverse)output.screens.push({label:'before',data:document.querySelector('canvas').toDataURL()});record.submittedFrame=globalThis.__HEarthAuditPresent(proposal.state);if(record.submittedFrame.navigationSequence!==proposal.state.sequence)throw Error("SUBMITTED_SEQUENCE_MISMATCH");await new Promise(requestAnimationFrame);if(pair.name==='north-mountain'&&yaw===180&&!reverse)output.screens.push({label:'after',data:document.querySelector('canvas').toDataURL()});}
 output.cases.push(record);
 }
 return output;

});for(const x of result.screens){fs.writeFileSync(dir+'/jump-'+x.label+'.png',Buffer.from(x.data.split(',')[1],'base64'));}delete result.screens;fs.writeFileSync(dir+'/navigation-verification.json',JSON.stringify(result,null,2));console.log('NAV_VERIFIED',JSON.stringify({cases:result.cases.length,rejected:result.cases.filter(x=>!x.accepted),maxJump:Math.max(...result.cases.map(x=>Math.abs(x.dy)))}));await page.screenshot({path:dir+'/active-scene.png'});await page.evaluate(s=>globalThis.__baselineSource=s,fs.readFileSync(dir+'/baseline-navigation-source.js.txt','utf8'));const q=await page.evaluate(async()=>{
 const nav=globalThis.__candidateNav, bridge=globalThis.__candidateBridge,resolve=nav.auditResolvePosition;
 const resources=performance.getEntriesByType('resource').map(x=>x.name);const navUrl=resources.find(x=>/\/navigation\.js\?/.test(x));let original=globalThis.__baselineSource.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,navUrl).href));original+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';const baseline=await import(URL.createObjectURL(new Blob([original],{type:'text/javascript'})));
 const surface=await import(resources.find(x=>/visible-terrain-clearance\.js\?/.test(x)));
 const pairs=[['mountain',88,-260,0,1],['foothill',24,-260,0,1],['east',96,-300,1,0],['west',-120,-300,1,0],['portal',40,-260,0,1],['flat',0,-110,0,1],['old-stripe',31,-192,1,0],['approach-edge',40,-272,0,1]];
 const failures=[],crossings=[],sequences=[],turns=[];
 const assert=(yes,kind,detail)=>{if(!yes)failures.push({kind,detail});};
 function safety(s,label){
  assert(nav.evaluateHEarthFunctionalLandscapeNavigationState(s).eligible,'STATE_INVALID',label);
  assert(s.position.y>=s.terrainElevation+2.25-1e-8,'LOCAL_FLOOR',label);
  if(s.geologicalFloorClass==='INTERIOR')assert(s.position.y<=s.geologicalCeilingY-.35+1e-8,'CAVE_HEADROOM',label);
  // Conservative ring beyond the camera near plane; interior wall validity is separately retained by the kernel.
  if(s.geologicalFloorClass!=='INTERIOR')for(let a=0;a<8;a++){
   const x=s.position.x+.35*Math.cos(a*Math.PI/4),z=s.position.z+.35*Math.sin(a*Math.PI/4);
   const g=bridge.resolveGeologicalRuntimeFootSupport(x,z),q=g?(g.eligible?g.footY:null):surface.sampleHEarthVisibleTerrainClearanceSurface(x,z).visibleElevation;
   if(Number.isFinite(q))assert(s.position.y>=q+.1-1e-8,'NEAR_PLANE_RING',{label,x,z,y:s.position.y,ground:q});
  }
 }
 function state(x,z,yaw){const r=resolve(x,z,yaw);return r.eligible?nav.auditStateFrom(r,{yaw,pitch:-8,fov:56,sequence:1,action:'QUALIFICATION_START'}):null;}
 for(const [name,x,z,dx,dz] of pairs)for(const yaw of [0,90,180,270]){
  const rows=[];
  for(const step of [.05,.01,.002,.0004]){
   const a=state(x-dx*step,z-dz*step,yaw),b=state(x+dx*step,z+dz*step,yaw);
   assert(a&&b,'CROSSING_REJECTED',{name,yaw,step});if(!a||!b)continue;
   safety(a,{name,yaw,step,side:'a'});safety(b,{name,yaw,step,side:'b'});
   const dy=b.position.y-a.position.y,dg=b.terrainElevation-a.terrainElevation;
   rows.push({step,dy,dg,viewReferenceDelta:b.clearanceReferenceElevation-a.clearanceReferenceElevation,residual:dy-dg});
  }
  const end=rows.at(-1);assert(end&&(Math.abs(end.dy)<.01||(end.dy*end.dg>=0&&Math.abs(end.dy)<=Math.abs(end.dg)+.01&&Math.abs(end.dg)<.25)),'CAMERA_SWITCH_LIMIT',{name,yaw,rows});
  crossings.push({name,yaw,rows});
 }
 for(const [name,x,z,dx,dz] of pairs)for(const dt of [1/120,1/60,1/30])for(const sign of [-1,1]){
  const yaw=dx?90:180;let s=state(x-dx*sign*.6,z-dz*sign*.6,yaw);if(!s)continue;
  const br=baseline.auditResolvePosition(x-dx*sign*.6,z-dz*sign*.6,yaw);let bs=br.eligible?baseline.auditStateFrom(br,{yaw,pitch:-8,fov:56,sequence:1,action:'BASELINE'}):null;let maxDy=0,count=0,rejected=0,baselineRejected=0,rejectionReasons={},firstRejection=null,baselineFirstRejection=null;
  // 2m/s forward/backward input, cross then reverse using actual navigation intents.
  for(let i=0;i<Math.ceil(1.2/(2*dt))*2;i++){
   const first=i<Math.ceil(1.2/(2*dt));const direction=first?sign:-sign;
   const intent={action:direction>0?'MOVE_FORWARD':'MOVE_BACKWARD',magnitude:2*dt};if(bs){const bp=baseline.proposeHEarthFunctionalLandscapeNavigation(bs,intent);if(bp.ok)bs=bp.state;else{baselineRejected++;baselineFirstRejection??={i,position:bs.position,issues:bp.issues};}}const p=nav.proposeHEarthFunctionalLandscapeNavigation(s,intent);
   if(!p.ok){rejected++;firstRejection??={i,position:s.position,issues:p.issues};const key=p.issues.join(",");rejectionReasons[key]=(rejectionReasons[key]??0)+1;continue;}maxDy=Math.max(maxDy,Math.abs(p.state.position.y-s.position.y));s=p.state;count++;safety(s,{name,dt,sign,i});
  }
  assert(rejected<=baselineRejected,'NEW_SEQUENCE_REJECTION',{name,dt,sign,rejected});assert(maxDy<.6,'SEQUENCE_HEIGHT_JUMP',{name,dt,sign,maxDy});sequences.push({name,dt,sign,count,rejected,baselineRejected,rejectionReasons,firstRejection,baselineFirstRejection,finalPosition:s.position,baselineFinalPosition:bs?.position,maxDy});
 }
 for(const [name,x,z] of pairs){let maxDy=0,s=state(x,z,0);if(!s){const b=baseline.auditResolvePosition(x,z,0);assert(!b.eligible,'NEW_TURN_START_REJECTION',{name,x,z});turns.push({name,skipped:true,baselineIssues:b.issues});continue;}for(let i=0;i<1440;i++){const p=nav.proposeHEarthFunctionalLandscapeNavigation(s,{action:'TURN_RIGHT',degrees:.25});assert(p.ok,'TURN_REJECTION',{name,i});if(!p.ok)break;maxDy=Math.max(maxDy,Math.abs(p.state.position.y-s.position.y));s=p.state;if(i%60===0)safety(s,{name,i});}assert(maxDy<.2,'FINE_TURN_JUMP',{name,maxDy});turns.push({name,maxDy});}
 let flatComparisons=0;for(const x of [-200,-100,0,100,200])for(const z of [-100,-110,-120])for(const yaw of [0,45,90,180,270]){const a=resolve(x,z,yaw),b=baseline.auditResolvePosition(x,z,yaw);assert(a.eligible===b.eligible,'FLAT_ELIGIBILITY',{x,z,yaw});if(a.eligible&&b.eligible){assert(Math.abs(a.position.y-b.position.y)<1e-8,'FLAT_CHANGED',{x,z,yaw,a:a.position.y,b:b.position.y});flatComparisons++;}}return{flatComparisons,schema:'H_EARTH_CAMERA_SUPPORT_CONTINUITY_QUALIFICATION_v1',activeGeology:true,crossings,sequences,turns,failures,summary:{result:failures.length?'FAIL':'PASS',crossings:crossings.length,sequences:sequences.length,turns:turns.length,failures:failures.slice(0,20),failureCount:failures.length}};
}
);fs.writeFileSync(dir+'/qualification.json',JSON.stringify(q,null,2));console.log('FINAL_QUALIFICATION',JSON.stringify(q.summary));
}catch(e){console.error(e);process.exitCode=1;}finally{clearInterval(ticker);if(browser)await browser.close();server.kill();}
