/* Analytics atmosphere: existing-source adaptation, initialized independently of data rendering.
 * Stars: assets/build/fibonacci-cosmos-core-v7.js, blob 93a9fc9989b53ef75319dc1af0206ebc6a2b537c.
 * Fireworks: showroom/globe/h-earth/awards/index.html, blob dcfdb5b88fad0dcfaaff38d5daabd885a019fa99.
 * Golden-angle field, particle families/physics, timing and 22-cue finale retained.
 * Delta: omit narrative injectors; Analytics mounts/controls; pause/BFCache cleanup;
 * interrupted-finale recovery and opt-in audio race protection.
 * Recording: Eightmate, https://freesound.org/people/Eightmate/sounds/789562/ (CC0-1.0).
 */
/* Diamond Gate Bridge commercial cosmos · DGB_BUILD_GOVERNANCE_FIBONACCI_COSMOS_v7 */
(()=>{"use strict";
const MODULE="DGB_ANALYTICS_COSMOS",GOLDEN_ANGLE=Math.PI*(3-Math.sqrt(5)),FIELD_SEED=0x44474243;
const CONFIG=Object.freeze({mobileWidth:820,mobileDprCap:1,desktopDprCap:1.25,minimumStars:105,maximumStars:230,areaDivisor:6200,rogueRatio:.14,minimumSparkles:4,maximumSparkles:8,firstBurstMinMs:2600,firstBurstMaxMs:4600,burstDelayMinMs:1700,burstDelayMaxMs:3400,burstDurationMinMs:620,burstDurationMaxMs:980,sparkleFrameMs:125});
const COLORS=Object.freeze(["255,248,224","154,217,225","234,208,131","170,155,224"]);
const state={initialized:false,destroyed:false,failed:false,documentVisible:!document.hidden,reducedMotion:false,mount:null,baseCanvas:null,overlayCanvas:null,baseContext:null,overlayContext:null,width:0,height:0,dpr:1,stars:[],sparkles:[],activeSparkles:[],burstTimer:0,frameTimer:0,motionQuery:null};
if(globalThis[MODULE]?.initialized)return;
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v)),between=(r,min,max)=>min+r()*(max-min);
function randomFactory(seed){let value=seed>>>0;return()=>{value+=0x6d2b79f5;let result=value;result=Math.imul(result^(result>>>15),result|1);result^=result+Math.imul(result^(result>>>7),result|61);return((result^(result>>>14))>>>0)/4294967296}}
function makeCanvas(role){const c=document.createElement("canvas");c.dataset.dgbCosmosCanvas=role;c.setAttribute("aria-hidden","true");return c}
function resolveMotion(){state.reducedMotion=Boolean(state.motionQuery?.matches)}
function canRun(){return state.initialized&&!state.destroyed&&!state.failed&&state.documentVisible&&!state.reducedMotion&&!globalThis.DGB_ANALYTICS_PAUSED}
function configureSize(){state.width=Math.max(320,Math.round(innerWidth||document.documentElement.clientWidth));state.height=Math.max(480,Math.round(innerHeight||document.documentElement.clientHeight));const cap=state.width<=CONFIG.mobileWidth?CONFIG.mobileDprCap:CONFIG.desktopDprCap;state.dpr=Math.min(devicePixelRatio||1,cap);for(const c of[state.baseCanvas,state.overlayCanvas]){c.width=Math.max(1,Math.round(state.width*state.dpr));c.height=Math.max(1,Math.round(state.height*state.dpr));c.style.width=`${state.width}px`;c.style.height=`${state.height}px`}state.baseContext.setTransform(state.dpr,0,0,state.dpr,0,0);state.overlayContext.setTransform(state.dpr,0,0,state.dpr,0,0)}
function generateStars(){const random=randomFactory(FIELD_SEED^state.width^(state.height<<7)),count=clamp(Math.round(state.width*state.height/CONFIG.areaDivisor),CONFIG.minimumStars,CONFIG.maximumStars),stars=[];for(let i=0;i<count;i++){const radius=Math.sqrt((i+.5)/count),angle=i*GOLDEN_ANGLE+between(random,-.08,.08);stars.push({x:clamp(.5+Math.cos(angle)*radius*.69+between(random,-.018,.018),.012,.988),y:clamp(.5+Math.sin(angle)*radius*.63+between(random,-.018,.018),.012,.988),radius:between(random,.5,1.75),alpha:between(random,.34,.92),color:COLORS[Math.floor(random()*COLORS.length)],rogue:random()<CONFIG.rogueRatio})}state.stars=stars;state.sparkles=stars.filter(s=>s.rogue).slice(0,CONFIG.maximumSparkles*3)}
function drawStar(ctx,star,alpha=star.alpha,scale=1){const x=star.x*state.width,y=star.y*state.height,r=star.radius*scale;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=`rgba(${star.color},${alpha})`;ctx.shadowColor=`rgba(${star.color},${alpha*.8})`;ctx.shadowBlur=r*4;ctx.fill();ctx.shadowBlur=0}
function drawBase(){state.baseContext.clearRect(0,0,state.width,state.height);for(const s of state.stars)drawStar(state.baseContext,s)}
function drawSparkles(){state.overlayContext.clearRect(0,0,state.width,state.height);const now=performance.now();state.activeSparkles=state.activeSparkles.filter(i=>now<i.endsAt);for(const item of state.activeSparkles){const p=clamp(1-(item.endsAt-now)/item.duration,0,1),pulse=Math.sin(p*Math.PI);drawStar(state.overlayContext,item.star,item.star.alpha*pulse,1+pulse*1.9)}if(!state.activeSparkles.length){clearInterval(state.frameTimer);state.frameTimer=0}}
function scheduleBurst(first=false){clearTimeout(state.burstTimer);if(!canRun())return;const random=randomFactory(FIELD_SEED^Date.now()),delay=first?between(random,CONFIG.firstBurstMinMs,CONFIG.firstBurstMaxMs):between(random,CONFIG.burstDelayMinMs,CONFIG.burstDelayMaxMs);state.burstTimer=setTimeout(()=>{if(!canRun()||!state.sparkles.length)return;const qty=clamp(Math.floor(between(random,CONFIG.minimumSparkles,CONFIG.maximumSparkles+1)),1,state.sparkles.length),pool=[...state.sparkles].sort(()=>random()-.5).slice(0,qty),now=performance.now();state.activeSparkles=pool.map(star=>{const duration=between(random,CONFIG.burstDurationMinMs,CONFIG.burstDurationMaxMs);return{star,duration,endsAt:now+duration}});if(!state.frameTimer)state.frameTimer=setInterval(drawSparkles,CONFIG.sparkleFrameMs);scheduleBurst(false)},delay)}
function stop(){clearTimeout(state.burstTimer);clearInterval(state.frameTimer);state.burstTimer=0;state.frameTimer=0;state.activeSparkles=[];state.overlayContext?.clearRect(0,0,state.width,state.height)}
function resize(){if(!state.initialized||state.destroyed)return;configureSize();generateStars();drawBase()}
function onVisibility(){state.documentVisible=!document.hidden;if(canRun())scheduleBurst(true);else stop()}
function onMotion(){resolveMotion();if(canRun())scheduleBurst(true);else stop()}
function initialize(){try{state.mount=document.querySelector("[data-dgb-fibonacci-cosmos]");if(!state.mount)throw new Error("DGB_FIBONACCI_COSMOS_MOUNT_NOT_FOUND");state.mount.style.zIndex="0";state.mount.style.opacity=".9";const content=document.querySelector("main");if(content){content.style.position="relative";content.style.zIndex="1"}state.baseCanvas=state.mount.querySelector('[data-dgb-cosmos-canvas="base"]')||makeCanvas("base");state.overlayCanvas=state.mount.querySelector('[data-dgb-cosmos-canvas="sparkle"]')||makeCanvas("sparkle");if(!state.baseCanvas.isConnected)state.mount.append(state.baseCanvas);if(!state.overlayCanvas.isConnected)state.mount.append(state.overlayCanvas);state.baseContext=state.baseCanvas.getContext("2d",{alpha:true,desynchronized:true});state.overlayContext=state.overlayCanvas.getContext("2d",{alpha:true,desynchronized:true});if(!state.baseContext||!state.overlayContext)throw new Error("DGB_FIBONACCI_COSMOS_CONTEXT_UNAVAILABLE");state.motionQuery=matchMedia?.("(prefers-reduced-motion: reduce)")||null;resolveMotion();configureSize();generateStars();drawBase();state.initialized=true;globalThis[MODULE]=Object.freeze({initialized:true,sourceModel:"ARCHCOIN_FIBONACCI_PHYLLOTAXIS_FIELD_v1",geometryModel:"golden-angle-square-root-jitter-with-rogue-stars",resize,stop});addEventListener("resize",resize,{passive:true});document.addEventListener("visibilitychange",onVisibility);addEventListener("pagehide",()=>{state.documentVisible=false;stop()});addEventListener("pageshow",onVisibility);document.addEventListener("dgb-atmosphere-toggle",onMotion);state.motionQuery?.addEventListener?.("change",onMotion);if(canRun())scheduleBurst(true)}catch(error){state.failed=true;console.warn("DGB Fibonacci cosmos unavailable",error)}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});else initialize()})();

(()=>{
'use strict';
if(globalThis.DGB_ANALYTICS_FIREWORKS)return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)'),cosmos=document.querySelector('[data-dgb-fibonacci-cosmos]'),finale=document.querySelector('[data-analytics-finale]');
if(!cosmos||!finale)return;
const canvas=document.createElement('canvas');canvas.dataset.dgbFireworks='';canvas.setAttribute('aria-hidden','true');Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',display:'block',zIndex:'0',pointerEvents:'none'});cosmos.insertAdjacentElement('afterend',canvas);
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;globalThis.DGB_ANALYTICS_FIREWORKS=true;
const colors=['#f4d58a','#fff1c8','#d9e8f0','#ecd38e','#78ddef','#c0adff'],gold=['#f4d58a','#ecd38e','#fff1c8'],rockets=[],particles=[],timers=new Set();
let width=0,height=0,dpr=1,raf=0,last=0,normalTimer=0,finalePlayed=false,finaleActive=false,hidden=document.hidden;
const coarse=window.matchMedia('(pointer:coarse)'),lowCore=()=>Number(navigator.hardwareConcurrency||8)<=4,quality=()=>coarse.matches||innerWidth<700||lowCore()?.62:1,cap=()=>quality()<1?(finaleActive?128:108):(finaleActive?240:200),rand=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
const clearTimer=id=>{if(id){clearTimeout(id);timers.delete(id)}},later=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);fn()},ms);timers.add(id);return id},clearAllTimers=()=>{clearTimer(normalTimer);normalTimer=0;timers.forEach(clearTimeout);timers.clear()};
const resize=()=>{width=Math.max(1,innerWidth);height=Math.max(1,innerHeight);dpr=Math.min(devicePixelRatio||1,quality()<1?1.25:1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)};
const ensureFrame=()=>{if(!raf&&!reduce.matches&&!hidden&&!globalThis.DGB_ANALYTICS_PAUSED){last=performance.now();raf=requestAnimationFrame(frame)}};
const spawn=(x,y,vx,vy,opts={})=>{if(particles.length>=cap())return null;const p={x,y,vx,vy,age:0,life:opts.life??1.4,gravity:opts.gravity??54,drag:opts.drag??.982,trailMax:opts.trail??3,trail:[],color:opts.color??pick(colors),size:opts.size??1.2,twinkle:opts.twinkle??0,drift:opts.drift??0,split:opts.split??false,splitDone:false,distance:opts.distance??.7};particles.push(p);return p};
const radial=(r,count,speedRange,opts={})=>{for(let i=0;i<count&&particles.length<cap();i++){const a=Math.PI*2*i/Math.max(1,count)+rand(-.05,.05),s=rand(speedRange[0],speedRange[1]);spawn(r.x,r.y,Math.cos(a)*s,Math.sin(a)*s,{...opts,life:rand(...(opts.lifeRange||[1.1,1.6])),distance:r.distance})}};
const burst=r=>{const q=quality(),room=Math.max(0,cap()-particles.length);if(!room)return;const c=n=>Math.max(1,Math.min(room,Math.round(n*q))),base={color:r.color,distance:r.distance};switch(r.family){
case'WILLOW':radial(r,c(28),[64,138],{...base,color:pick(gold),lifeRange:[2.4,3.35],gravity:36,drag:.988,trail:8,size:1.4});break;
case'CHRYSANTHEMUM':radial(r,c(36),[102,198],{...base,lifeRange:[1.35,1.95],gravity:52,drag:.983,trail:5});break;
case'DAHLIA':radial(r,c(18),[112,205],{...base,lifeRange:[1.25,1.7],gravity:50,drag:.982,trail:2,size:1.85});break;
case'CROSSETTE':radial(r,c(15),[105,172],{...base,lifeRange:[1.25,1.6],gravity:48,drag:.984,trail:3,split:true,size:1.3});break;
case'PALM':{const n=c(12);for(let i=0;i<n;i++){const a=-Math.PI+Math.PI*i/Math.max(1,n-1)+rand(-.08,.08),s=rand(105,180);spawn(r.x,r.y,Math.cos(a)*s,Math.sin(a)*s,{...base,life:rand(1.75,2.35),gravity:58,drag:.987,trail:7,size:1.75,color:pick(gold)})}break}
case'HORSETAIL':{const n=c(22);for(let i=0;i<n;i++){const a=rand(-2.65,-.48),s=rand(42,96);spawn(r.x,r.y,Math.cos(a)*s,Math.sin(a)*s,{...base,life:rand(1.9,2.55),gravity:78,drag:.991,trail:6,size:1.3})}break}
case'RING':{const n=c(30),s=rand(145,188);radial(r,n,[s,s],{...base,lifeRange:[1.15,1.55],gravity:38,drag:.987,trail:2,size:1.3});if(finaleActive&&particles.length<cap()-12)radial(r,c(16),[s*.56,s*.58],{...base,color:pick(gold),lifeRange:[1.05,1.4],gravity:38,drag:.987,trail:1,size:1.05});break}
case'PISTIL':radial(r,c(28),[125,205],{...base,lifeRange:[1.25,1.8],gravity:52,drag:.983,trail:4});radial(r,c(14),[58,92],{...base,color:pick(gold),lifeRange:[1.1,1.55],gravity:48,drag:.985,trail:2,size:1.35});break;
case'BROCADE':radial(r,c(40),[76,150],{...base,color:pick(gold),lifeRange:[2.05,2.75],gravity:43,drag:.989,trail:7,size:1.35,twinkle:.08});break;
case'KAMURO':radial(r,c(34),[68,142],{...base,color:pick(gold),lifeRange:[2.65,3.55],gravity:35,drag:.99,trail:9,size:1.45,twinkle:.05});break;
case'FALLING_LEAVES':{const n=c(24);for(let i=0;i<n;i++)spawn(r.x,r.y,rand(-48,48),rand(-42,18),{...base,color:pick(gold),life:rand(2.5,3.45),gravity:24,drag:.994,trail:2,size:rand(1,1.65),drift:rand(.35,.8),twinkle:.035});break}
case'COCONUT':radial(r,c(14),[92,172],{...base,lifeRange:[1.65,2.25],gravity:53,drag:.988,trail:6,size:1.65,color:pick([r.color,...gold])});break;
case'CRACKLE':radial(r,c(24),[86,165],{...base,lifeRange:[1.1,1.55],gravity:55,drag:.981,trail:2,size:1.1,twinkle:.12});break;
default:radial(r,c(28),[118,210],{...base,lifeRange:[1,1.42],gravity:58,drag:.98,trail:2});break}};
const launch=(family='PEONY',xNorm=rand(.14,.86),targetNorm=rand(.17,.46),distance=rand(.48,.94))=>{if(reduce.matches||hidden||globalThis.DGB_ANALYTICS_PAUSED)return;const color=['WILLOW','BROCADE','KAMURO','FALLING_LEAVES'].includes(family)?pick(gold):pick(colors);rockets.push({x:width*xNorm,y:height+14,vx:rand(-9,9),vy:-rand(310,405),target:height*targetNorm,family,color,age:0,distance});ensureFrame()};
const drawParticle=p=>{const alpha=Math.max(0,1-p.age/p.life),points=p.trail,twinkle=p.twinkle&&Math.sin(p.age*31+p.x*.013)>1-p.twinkle*2?.46:1;if(points.length>1){ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);ctx.strokeStyle=p.color;ctx.globalAlpha=alpha*.3;ctx.lineWidth=Math.max(.7,p.size*.58);ctx.stroke()}ctx.globalAlpha=alpha*.88*twinkle;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1};
function splitCrossette(p){if(p.splitDone||!p.split||p.age<p.life*.48)return;p.splitDone=true;p.split=false;const speed=rand(55,82);for(let k=0;k<4&&particles.length<cap();k++){const a=Math.PI*.5*k+rand(-.08,.08);spawn(p.x,p.y,Math.cos(a)*speed+p.vx*.18,Math.sin(a)*speed+p.vy*.18,{color:p.color,life:rand(.55,.82),gravity:52,drag:.98,trail:2,size:.9,distance:p.distance})}}
function frame(now){raf=0;if(reduce.matches||hidden||globalThis.DGB_ANALYTICS_PAUSED){ctx.clearRect(0,0,width,height);return}const dt=Math.min(.033,Math.max(.001,(now-last)/1000));last=now;ctx.clearRect(0,0,width,height);for(let i=rockets.length-1;i>=0;i--){const r=rockets[i];r.age+=dt;r.x+=r.vx*dt;r.y+=r.vy*dt;r.vy+=115*dt;ctx.globalAlpha=.52;ctx.fillStyle=r.color;ctx.fillRect(r.x-1,r.y-5,2,10);ctx.globalAlpha=1;if(r.y<=r.target||r.vy>=-42||r.age>1.9){rockets.splice(i,1);burst(r)}}for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.age+=dt;if(p.age>=p.life){particles.splice(i,1);continue}splitCrossette(p);p.trail.unshift({x:p.x,y:p.y});if(p.trail.length>p.trailMax)p.trail.length=p.trailMax;p.vx*=Math.pow(p.drag,dt*60);p.vy=p.vy*Math.pow(p.drag,dt*60)+p.gravity*dt;if(p.drift)p.vx+=Math.sin((p.age+p.y*.002)*4.2)*p.drift*dt*22;p.x+=p.vx*dt;p.y+=p.vy*dt;drawParticle(p)}if(rockets.length||particles.length)raf=requestAnimationFrame(frame)}
const normalFamilies=['PEONY','CHRYSANTHEMUM','DAHLIA','RING','PALM','COCONUT','CROSSETTE','HORSETAIL','PISTIL','CRACKLE'];
const scheduleNormal=(delay=rand(3500,7000))=>{clearTimer(normalTimer);normalTimer=0;if(reduce.matches||hidden||globalThis.DGB_ANALYTICS_PAUSED||finaleActive)return;normalTimer=later(()=>{normalTimer=0;launch(pick(normalFamilies));if(Math.random()<.23)later(()=>{if(!finaleActive)launch(pick(normalFamilies),rand(.16,.84),rand(.2,.44),rand(.52,.94))},rand(620,1150));scheduleNormal()},delay)};
const finalePlan=[[0,'RING',.23,.34],[220,'DAHLIA',.74,.3],[1350,'CROSSETTE',.36,.27],[1900,'CROSSETTE',.66,.24],[3100,'PALM',.23,.36],[3300,'HORSETAIL',.76,.3],[4750,'PISTIL',.36,.22],[5050,'CHRYSANTHEMUM',.67,.31],[6300,'BROCADE',.23,.2],[6550,'CHRYSANTHEMUM',.5,.29],[6800,'DAHLIA',.78,.18],[8250,'KAMURO',.38,.17],[8600,'WILLOW',.7,.21],[10100,'RING',.18,.3],[10450,'CHRYSANTHEMUM',.38,.21],[10800,'CROSSETTE',.58,.27],[11150,'BROCADE',.79,.19],[11600,'DAHLIA',.31,.26],[12000,'PISTIL',.68,.2],[12850,'KAMURO',.5,.14],[14300,'FALLING_LEAVES',.35,.2],[14650,'FALLING_LEAVES',.66,.24]];
const playFinale=()=>{if(finalePlayed||reduce.matches||hidden||globalThis.DGB_ANALYTICS_PAUSED)return;finalePlayed=true;finaleActive=true;clearTimer(normalTimer);normalTimer=0;finalePlan.forEach(([ms,f,x,y])=>later(()=>launch(f,x,y,rand(.48,.9)),ms));later(()=>{finaleActive=false;scheduleNormal(rand(7000,9500))},16000)};
let finaleVisible=false;const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{finaleVisible=entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.35);if(finaleVisible)playFinale()},{threshold:[.35]}):null;observer?.observe(finale);
const stopMotion=()=>{if(raf)cancelAnimationFrame(raf);raf=0;rockets.length=0;particles.length=0;clearAllTimers();finaleActive=false;ctx.clearRect(0,0,width,height)};
const resume=()=>{if(reduce.matches||hidden||globalThis.DGB_ANALYTICS_PAUSED)return;resize();scheduleNormal(rand(2800,5200));if(finaleVisible)playFinale();if(rockets.length||particles.length)ensureFrame()};
document.addEventListener('visibilitychange',()=>{hidden=document.hidden;if(hidden)stopMotion();else resume()});reduce.addEventListener?.('change',()=>{if(reduce.matches){stopMotion();canvas.style.display='none'}else{canvas.style.display='block';resume()}});coarse.addEventListener?.('change',resize);addEventListener('resize',resize,{passive:true});resize();if(reduce.matches){canvas.style.display='none'}else{canvas.style.display='block';scheduleNormal(rand(2200,4600))}
// Opt-in recording from the Awards page; no media object or request before a click.
const soundButton=document.querySelector('[data-fireworks-sound]');
const pauseButton=document.querySelector('[data-effects-pause]');
const sourceUrl='https://cdn.freesound.org/previews/789/789562_3010666-hq.mp3';
let audio=null,audioEnabled=false,failed=false,playGeneration=0;
const updateSound=()=>{if(!soundButton)return;soundButton.setAttribute('aria-pressed',String(audioEnabled));soundButton.textContent=failed?'Fireworks sound unavailable':audioEnabled?'Fireworks sound: on':'Fireworks sound: off';soundButton.disabled=reduce.matches||Boolean(globalThis.DGB_ANALYTICS_PAUSED)};
const silence=()=>{playGeneration++;audioEnabled=false;audio?.pause();updateSound()};
const enableSound=async()=>{
 if(reduce.matches||hidden||globalThis.DGB_ANALYTICS_PAUSED)return;
 const generation=++playGeneration;failed=false;audioEnabled=true;updateSound();
 try{
  if(!audio){audio=new Audio();audio.preload='none';audio.loop=true;audio.volume=.38;audio.playsInline=true;audio.src=sourceUrl;audio.addEventListener('error',()=>{failed=true;silence()})}
  await audio.play();
  if(generation!==playGeneration||hidden||reduce.matches||globalThis.DGB_ANALYTICS_PAUSED){if(!audioEnabled)audio.pause();return}
 }catch{if(generation===playGeneration){failed=true;silence()}}
 updateSound();
};
soundButton?.addEventListener('click',()=>{if(audioEnabled)silence();else enableSound()});
const syncMotion=()=>{if(reduce.matches||hidden||globalThis.DGB_ANALYTICS_PAUSED){stopMotion();silence()}else resume();updateSound()};
pauseButton?.addEventListener('click',()=>{globalThis.DGB_ANALYTICS_PAUSED=!globalThis.DGB_ANALYTICS_PAUSED;pauseButton.setAttribute('aria-pressed',String(globalThis.DGB_ANALYTICS_PAUSED));pauseButton.textContent=globalThis.DGB_ANALYTICS_PAUSED?'Resume effects':'Pause effects';document.dispatchEvent(new Event('dgb-atmosphere-toggle'));syncMotion()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)silence()});
reduce.addEventListener?.('change',()=>{if(reduce.matches)silence();updateSound()});
addEventListener('pagehide',()=>{hidden=true;stopMotion();silence()});
addEventListener('pageshow',()=>{hidden=document.hidden;syncMotion()});
updateSound();
})();
