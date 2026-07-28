const SESSION_ID='H_EARTH_INTERACTION_ACCEPTANCE_SESSION_v1';
const TESTS=Object.freeze([
 ['TURN_LEFT','Look left with one finger'],['TURN_RIGHT','Look right with one finger'],
 ['PITCH_UP','Look up with one finger'],['PITCH_DOWN','Look down with one finger'],
 ['MOVE_FORWARD','Move forward with two fingers'],['MOVE_BACKWARD','Move backward with two fingers'],
 ['ZOOM_IN','Pinch outward to zoom in'],['ZOOM_OUT','Pinch inward to zoom out']
]);
const clone=v=>JSON.parse(JSON.stringify(v));
const iso=()=>new Date().toISOString();
function makeButton(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',fn);return b;}

export function installHEarthInteractionAcceptance({routeApi,host}={}){
 if(!routeApi?.getIntakeReceipt||!routeApi?.getLiveGpuReceipt)throw new Error('INTERACTION_ACCEPTANCE_ROUTE_API_REQUIRED');
 if(!(host instanceof HTMLElement))throw new Error('INTERACTION_ACCEPTANCE_HOST_REQUIRED');
 let state='IDLE',durationSeconds=60,startedAt=null,completedAt=null,deadline=0,startProposalCount=0,proposalCursor=0,startFrameCount=0,timer=null,receipt=null;
 const counted=new Set();
 const results=new Map(TESTS.map(([action])=>[action,{action,attempts:0,acceptedProposalCount:0,maximumMagnitude:0,firstObservedAt:null,lastObservedAt:null,classification:'NOT_DETECTED'}]));
 const panel=document.createElement('details');panel.className='h-earth-startup-receipt';panel.open=true;
 const heading=document.createElement('summary');heading.textContent='Interaction acceptance · 30 or 60 seconds';
 const body=document.createElement('div');body.className='h-earth-startup-receipt__body';
 const intro=document.createElement('p');intro.className='h-earth-runtime-diagnostics__summary';intro.textContent='Start after the landscape is visible. Test left, right, up, down, forward, backward, zoom in, and zoom out.';
 const status=document.createElement('p');status.setAttribute('role','status');status.style.fontFamily='var(--h-earth-mono,monospace)';
 const ledger=document.createElement('ol');ledger.className='h-earth-startup-receipt__ledger';
 const rows=new Map();
 for(const [action,label]of TESTS){const li=document.createElement('li');li.dataset.status='PENDING';const code=document.createElement('code');code.textContent=label;const out=document.createElement('output');out.textContent='PENDING';li.append(code,out);ledger.append(li);rows.set(action,{li,out});}
 const controls=document.createElement('div');controls.className='h-earth-startup-receipt__actions';controls.style.flexWrap='wrap';
 const technical=document.createElement('pre');technical.className='h-earth-startup-receipt__technical';technical.hidden=true;
 const classify=v=>v.acceptedProposalCount<1?'NOT_DETECTED':v.attempts>2?'WEAK_RESPONSE':'PASS';
 function resetResults(){counted.clear();for(const v of results.values()){Object.assign(v,{attempts:0,acceptedProposalCount:0,maximumMagnitude:0,firstObservedAt:null,lastObservedAt:null,classification:'NOT_DETECTED'});const r=rows.get(v.action);r.li.dataset.status='PENDING';r.out.textContent='PENDING';}}
 function updateRows(){for(const v of results.values()){const c=classify(v),r=rows.get(v.action);r.li.dataset.status=c==='PASS'?'PASS':c==='NOT_DETECTED'?'PENDING':'FAIL';r.out.textContent=c;}}
 function renderStatus(){const detected=[...results.values()].filter(v=>v.acceptedProposalCount>0).length;const remaining=state==='RUNNING'?Math.max(0,Math.ceil((deadline-performance.now())/1000)):0;status.textContent=state==='RUNNING'?`RUNNING · ${remaining}s remaining · ${detected}/8 detected`:`${state} · ${detected}/8 detected`;}
 function collect(autoFinalize=true){if(state!=='RUNNING')return;const intake=routeApi.getIntakeReceipt();const proposals=intake.proposals.slice(proposalCursor);proposalCursor=intake.proposals.length;for(const p of proposals){if(counted.has(p.sequence))continue;counted.add(p.sequence);const v=results.get(p?.intent?.action);if(!v)continue;v.attempts+=1;v.firstObservedAt??=iso();v.lastObservedAt=iso();const m=Number(p.intent?.magnitude??p.intent?.degrees??0);if(Number.isFinite(m))v.maximumMagnitude=Math.max(v.maximumMagnitude,m);if(p.accepted===true)v.acceptedProposalCount+=1;}updateRows();renderStatus();if(autoFinalize&&performance.now()>=deadline)finalize('COMPLETE');}
 function buildReceipt(terminalState){const intake=routeApi.getIntakeReceipt(),gpu=routeApi.getLiveGpuReceipt(),compact={},context=gpu.resources?.context??{};let passCount=0,weakResponseCount=0,failureCount=0;for(const[action]of TESTS){const v=results.get(action);v.classification=classify(v);compact[action]=clone(v);if(v.classification==='PASS')passCount++;else if(v.classification==='WEAK_RESPONSE')weakResponseCount++;else failureCount++;}return{version:'H_EARTH_INTERACTION_ACCEPTANCE_RECEIPT_v1',sessionId:SESSION_ID,terminalState,device:{userAgent:navigator.userAgent,pixelRatio:window.devicePixelRatio||1,viewport:gpu.viewport??null,webglVendor:context.unmaskedVendor??context.vendor??null,webglRenderer:context.unmaskedRenderer??context.renderer??null},session:{durationSeconds,startedAt,completedAt,rendererReadyAtStart:startFrameCount>0,visibleFrameAtStart:startFrameCount>0,framesPresentedDuringSession:Math.max(0,(gpu.counters?.gpuFramebufferPresentationCount??0)-startFrameCount),proposalsDuringSession:Math.max(0,(intake.counters?.navigationProposalCount??0)-startProposalCount)},results:compact,summary:{passCount,weakResponseCount,failureCount,gestureFunctionalAcceptance:failureCount===0?'PASS':'REQUIRES_REVIEW',gestureQualityAcceptance:weakResponseCount===0&&failureCount===0?'PASS':'REQUIRES_REVIEW'}};}
 function finalize(terminalState='COMPLETE'){if(state!=='RUNNING')return receipt;collect(false);if(timer)clearInterval(timer);timer=null;completedAt=iso();state=terminalState;receipt=buildReceipt(terminalState);technical.hidden=false;technical.textContent=JSON.stringify(receipt,null,2);window.H_EARTH_INTERACTION_ACCEPTANCE_RECEIPT=clone(receipt);window.dispatchEvent(new CustomEvent('h-earth-interaction-acceptance-complete',{detail:clone(receipt)}));updateRows();renderStatus();return clone(receipt);}
 function start(seconds){const gpu=routeApi.getLiveGpuReceipt(),frames=gpu.counters?.gpuFramebufferPresentationCount??0;if(frames<1)throw new Error('INTERACTION_ACCEPTANCE_VISIBLE_FRAME_REQUIRED');if(timer)clearInterval(timer);resetResults();durationSeconds=seconds;state='RUNNING';startedAt=iso();completedAt=null;receipt=null;technical.hidden=true;const intake=routeApi.getIntakeReceipt();startProposalCount=intake.counters?.navigationProposalCount??intake.proposals.length;proposalCursor=intake.proposals.length;startFrameCount=frames;deadline=performance.now()+seconds*1000;timer=setInterval(()=>collect(true),200);renderStatus();}
 function reset(){if(timer)clearInterval(timer);timer=null;state='IDLE';receipt=null;startedAt=null;completedAt=null;resetResults();technical.hidden=true;technical.textContent='';renderStatus();}
 async function copyReceipt(){if(receipt)await navigator.clipboard.writeText(JSON.stringify(receipt,null,2));}
 function downloadReceipt(){if(!receipt)return;const url=URL.createObjectURL(new Blob([JSON.stringify(receipt,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`h-earth-interaction-acceptance-${durationSeconds}s.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 controls.append(makeButton('Start 30 seconds',()=>start(30)),makeButton('Start 60 seconds',()=>start(60)),makeButton('End now',()=>finalize('COMPLETE_WITH_CONCERNS')),makeButton('Reset',reset),makeButton('Copy receipt',copyReceipt),makeButton('Download receipt',downloadReceipt));
 body.append(intro,status,ledger,controls,technical);panel.append(heading,body);host.append(panel);renderStatus();
 const api=Object.freeze({start30:()=>start(30),start60:()=>start(60),endNow:()=>finalize('COMPLETE_WITH_CONCERNS'),reset,getReceipt:()=>receipt?clone(receipt):null,getState:()=>state});window.H_EARTH_INTERACTION_ACCEPTANCE=api;return api;
}
function bootstrap(){const routeApi=window.H_EARTH_RUN8E_PUBLIC_ROUTE,host=document.querySelector('.h-earth-3d-world-shell');if(routeApi&&host){installHEarthInteractionAcceptance({routeApi,host});return;}window.addEventListener('h-earth-run8e-ready',()=>{const api=window.H_EARTH_RUN8E_PUBLIC_ROUTE,target=document.querySelector('.h-earth-3d-world-shell');if(api&&target&&!window.H_EARTH_INTERACTION_ACCEPTANCE)installHEarthInteractionAcceptance({routeApi:api,host:target});},{once:true});}
bootstrap();
