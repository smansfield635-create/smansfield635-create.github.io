import {WORLD,terrainHeight} from './world.mjs';
const canvas=document.querySelector('[data-o1-canvas]');
const home=document.querySelector('[data-home]');
const scaleNode=document.querySelector('[data-scale]');
const placeNode=document.querySelector('[data-place]');
if(!(canvas instanceof HTMLCanvasElement))throw new Error('O1_CANVAS_MISSING');
const ctx=canvas.getContext('2d',{alpha:false});
if(!ctx)throw new Error('O1_2D_CONTEXT_MISSING');
const state={x:0,y:0,zoom:1.35,tilt:.68,pointers:new Map(),gesture:null,lastTap:0};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function scaleName(){return state.zoom>3.2?'LOCAL':state.zoom>1.75?'REGIONAL':state.zoom>.88?'CONTINENTAL':'PLANETARY';}
function nearestPlace(){let best=WORLD.focus,bd=1e9;for(const p of WORLD.landmarks){const d=Math.hypot(p.x-state.x,p.y-state.y);if(d<bd){bd=d;best=p;}}return bd<3.4?best.name:'Audralia';}
function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(innerWidth*d);canvas.height=Math.floor(innerHeight*d);ctx.setTransform(d,0,0,d,0,0);render();}
function project(x,y,h=0){const w=innerWidth,hv=innerHeight,s=Math.min(w,hv)*.042*state.zoom;const dx=(x-state.x)*s,dy=(y-state.y)*s;return [w*.5+dx,hv*.54+dy*state.tilt-h*s*1.8];}
function poly(points,fill,stroke,width=1,height=0){ctx.beginPath();points.forEach((p,i)=>{const q=project(p[0],p[1],height);i?ctx.lineTo(...q):ctx.moveTo(...q)});ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function drawOcean(){ctx.fillStyle='#071a1d';ctx.fillRect(0,0,innerWidth,innerHeight);const g=ctx.createRadialGradient(innerWidth*.5,innerHeight*.5,20,innerWidth*.5,innerHeight*.5,Math.max(innerWidth,innerHeight)*.68);g.addColorStop(0,'#173f42');g.addColorStop(1,'#07161b');ctx.fillStyle=g;ctx.fillRect(0,0,innerWidth,innerHeight)}
function drawLand(){poly(WORLD.coastline,'#315b3f','#9abf91',1.2);for(let gy=-9;gy<=9;gy+=.55){for(let gx=-10;gx<=10;gx+=.55){const hh=terrainHeight(gx,gy);if(hh<.09)continue;const [sx,sy]=project(gx,gy,hh);const r=(.34+.8*hh)*state.zoom;ctx.fillStyle=`rgba(${55+Math.floor(hh*60)},${95+Math.floor(hh*75)},${60+Math.floor(hh*45)},${.16+.32*hh})`;ctx.beginPath();ctx.arc(sx,sy,r,0,Math.PI*2);ctx.fill()}}
for(const bar of WORLD.sandbars)poly(bar,'#d9ce8f','rgba(244,231,169,.72)',.7);
}
function drawContours(){for(const level of [.22,.42,.62,.82]){ctx.beginPath();let started=false;for(let a=0;a<=Math.PI*2+.05;a+=.08){const r=(7.2-level*5.1)*(1+.08*Math.sin(a*3+level*9));const x=Math.cos(a)*r,y=Math.sin(a)*r*.78;const q=project(x,y,level*.56);started?ctx.lineTo(...q):(ctx.moveTo(...q),started=true)}ctx.strokeStyle=`rgba(226,238,205,${.08+level*.08})`;ctx.lineWidth=.7;ctx.stroke()}}
function drawLandmarks(){for(const p of WORLD.landmarks){const [x,y]=project(p.x,p.y,p.elevation);ctx.fillStyle=p.kind==='harbor'?'#c9dfe2':'#f1e7b5';ctx.beginPath();ctx.arc(x,y,p.name==='Gratitude'?4.4:2.8,0,Math.PI*2);ctx.fill();ctx.font=p.name==='Gratitude'?'600 12px system-ui':'11px system-ui';ctx.fillStyle='rgba(238,247,237,.86)';ctx.fillText(p.name,x+8,y-7)}}
function drawAtmosphere(){const g=ctx.createLinearGradient(0,0,0,innerHeight);g.addColorStop(0,'rgba(122,184,166,.16)');g.addColorStop(.42,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.24)');ctx.fillStyle=g;ctx.fillRect(0,0,innerWidth,innerHeight)}
function render(){drawOcean();drawLand();drawContours();drawLandmarks();drawAtmosphere();scaleNode.textContent=scaleName();placeNode.textContent=nearestPlace();}
function reset(){state.x=0;state.y=0;state.zoom=1.35;render()}
const pos=e=>({x:e.clientX,y:e.clientY});
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);state.pointers.set(e.pointerId,pos(e));if(state.pointers.size===2){const a=[...state.pointers.values()];state.gesture={distance:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),mid:{x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2}}}});
canvas.addEventListener('pointermove',e=>{const prev=state.pointers.get(e.pointerId);if(!prev)return;const next=pos(e);state.pointers.set(e.pointerId,next);if(state.pointers.size===1){const s=Math.min(innerWidth,innerHeight)*.042*state.zoom;state.x-= (next.x-prev.x)/s;state.y-= (next.y-prev.y)/(s*state.tilt);render();return}if(state.pointers.size===2&&state.gesture){const a=[...state.pointers.values()],dist=Math.max(20,Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)),mid={x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2};const oldZoom=state.zoom;state.zoom=clamp(state.zoom*(dist/state.gesture.distance),.52,5.6);const s=Math.min(innerWidth,innerHeight)*.042*oldZoom;state.x-=(mid.x-state.gesture.mid.x)/s;state.y-=(mid.y-state.gesture.mid.y)/(s*state.tilt);state.gesture={distance:dist,mid};render()}});
function clear(e){state.pointers.delete(e.pointerId);if(state.pointers.size!==2)state.gesture=null}canvas.addEventListener('pointerup',clear);canvas.addEventListener('pointercancel',clear);canvas.addEventListener('lostpointercapture',clear);
canvas.addEventListener('wheel',e=>{e.preventDefault();state.zoom=clamp(state.zoom*Math.exp(-e.deltaY*.001),.52,5.6);render()},{passive:false});
canvas.addEventListener('dblclick',reset);canvas.addEventListener('pointerup',e=>{const now=performance.now();if(e.pointerType==='touch'&&now-state.lastTap<320)reset();state.lastTap=now});home.addEventListener('click',reset);addEventListener('resize',resize);resize();
window.__OPEN_WORLD_O1__=Object.freeze({representation:'O1',world:'AUDRALIA',implementationAuthority:'OPEN_WORLD',productionConnected:false,correspondenceConstructed:false});
