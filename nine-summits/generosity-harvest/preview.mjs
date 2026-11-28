// Private V10 composition control. Source and art are authenticated by the caller before binding.
import {createCycle,DURATION} from './cycle.mjs?v=harvest-arrival-20261128-v1';
import {createHarvestScene} from './harvest.motion.js';
export async function mountPreview({source,artBytes,backend='AUTO',placement,recording=false}){
 const view=document.querySelector('#view'),canvas=view.querySelector('canvas'),art=view.querySelector('img'),button=document.querySelector('#play'),reset=document.querySelector('#reset');
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 art.src=URL.createObjectURL(new Blob([artBytes],{type:'image/png'}));await art.decode();if(art.naturalWidth!==1672||art.naturalHeight!==941)throw Error('ART_DIMENSIONS');
 const scene=createHarvestScene(canvas,{backend,reducedMotion:true,illustrationMode:true});
 const size=()=>{let r=view.getBoundingClientRect();scene.resize(r.width,r.height,1)};size();const cycle=createCycle(source);let cycleTime=0;const bound=scene.attachPrivateArticulated284({...source,sampleHop:()=>cycle.sample(cycleTime)},placement);
 const gl=canvas.getContext(scene.backend==='WEBGL2'?'webgl2':'webgl');let t=0,playing=false,raf=0,start=0,last=null;
 const draw=(v)=>{t=Math.max(0,Math.min(DURATION,v));cycleTime=t;last=scene.drawArticulated284(0);return last};
 const pause=()=>{playing=false;cancelAnimationFrame(raf);raf=0;button.textContent='Play cycle'};
 const play=()=>{if(playing)return;if(t>=DURATION)draw(0);playing=true;start=performance.now()-t*1000;button.textContent='Pause';const tick=now=>{if(!playing)return;draw(((now-start)/1000)%DURATION);raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)};
 button.onclick=()=>playing?pause():play();reset.onclick=()=>{draw(0);pause()};media.addEventListener('change',e=>{if(e.matches)pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});if(!recording)new ResizeObserver(()=>{size();draw(t)}).observe(view);
 const inspect=()=>({time:t,playing,frame:Math.round(t*120),backend:scene.backend,scene:scene.status(),reduced:media.matches,canvas:[canvas.width,canvas.height],art:[art.naturalWidth,art.naturalHeight],glError:gl.getError()});
 function raster(v){const r=draw(v);let p=new Uint8Array(canvas.width*canvas.height*4);gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,p);let nonzero=0,minX=canvas.width,minY=canvas.height,maxX=-1,maxY=-1;for(let y=0,i=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++,i+=4){if(p[i+3]>32){nonzero++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}}return {r,nonzero,bounds:[minX,canvas.height-1-maxY,maxX,canvas.height-1-minY],glError:gl.getError()};}
 draw(0);return {bound,draw,raster,play,pause,inspect,scene};
}
