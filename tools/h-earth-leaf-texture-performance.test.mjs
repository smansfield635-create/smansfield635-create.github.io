import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAlphaCoverageMipmaps} from '../showroom/globe/h-earth/render/geometry-jacaranda.v1.js';

// Independent frozen oracle: the pre-repair synchronous mipmap algorithm.
function legacy(pixels,width,height){
 let current=pixels,w=width,h=height,level=0;const levels=[];
 let covered=0;for(let i=3;i<current.length;i+=4)if(current[i]>=115)covered++;
 const targetCoverage=covered/(current.length/4);
 while(w>1||h>1){
  const nw=Math.max(1,w>>1),nh=Math.max(1,h>>1),next=new Uint8Array(nw*nh*4);
  for(let y=0;y<nh;y++)for(let x=0;x<nw;x++){
   const accum=[0,0,0,0];let count=0;
   for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){
    const sx=Math.min(w-1,2*x+dx),sy=Math.min(h-1,2*y+dy),a=(sy*w+sx)*4;
    for(let c=0;c<4;c++)accum[c]+=current[a+c];count++;
   }
   for(let c=0;c<4;c++)next[(y*nw+x)*4+c]=Math.round(accum[c]/count);
  }
  const needed=Math.max(1,Math.round(targetCoverage*nw*nh));
  const histogram=new Uint32Array(256);for(let i=3;i<next.length;i+=4)histogram[next[i]]++;
  let running=0,threshold=0;for(let v=255;v>=0;v--){running+=histogram[v];if(running>=needed){threshold=v;break;}}
  const mult=threshold>0?Math.min(12,Math.max(1,116/threshold)):1;
  for(let i=3;i<next.length;i+=4)next[i]=Math.min(255,Math.round(next[i]*mult));
  levels.push({level:++level,width:nw,height:nh,pixels:next});current=next;w=nw;h=nh;
 }
 return levels;
}
function fixture(width,height,mode){
 const pixels=new Uint8ClampedArray(width*height*4);let seed=123456789;
 for(let i=0;i<pixels.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;pixels[i]=seed>>>24;}
 for(let i=3;i<pixels.length;i+=4)if(mode!=='random')pixels[i]=mode==='opaque'?255:0;
 return pixels;
}
for(const [width,height] of [[1,1],[1,17],[19,1],[3,5],[17,29],[64,64],[257,129]])for(const mode of ['transparent','opaque','random'])test(`mip bytes equal legacy ${width}x${height} ${mode}`,async()=>{
 const pixels=fixture(width,height,mode),original=pixels.slice(),actual=[];let clock=0;
 await buildAlphaCoverageMipmaps({pixels,width,height,now:()=>clock+=5,yieldWork:async()=>{},checkActive:()=>{},onLevel:level=>actual.push({...level,pixels:level.pixels.slice()})});
 assert.deepEqual(actual,legacy(pixels,width,height));assert.deepEqual(pixels,original);
});

test('large leaf processing yields before uploading its first mip level',async()=>{
 const events=[];let clock=0;
 await buildAlphaCoverageMipmaps({pixels:fixture(256,256,'random'),width:256,height:256,now:()=>clock+=5,yieldWork:async()=>events.push('yield'),checkActive:()=>{},onLevel:()=>events.push('upload')});
 assert.ok(events.indexOf('yield')>=0);assert.ok(events.indexOf('yield')<events.indexOf('upload'));
 assert.equal(events.filter(v=>v==='upload').length,8);
});

test('cancellation after a yield stops before any mip upload',async()=>{
 let cancelled=false,uploads=0,yields=0,clock=0;
 await assert.rejects(buildAlphaCoverageMipmaps({pixels:fixture(256,256,'random'),width:256,height:256,now:()=>clock+=5,yieldWork:async()=>{yields++;cancelled=true;},checkActive:()=>{if(cancelled)throw Error('LOAD_CANCELLED');},onLevel:()=>uploads++}),/LOAD_CANCELLED/);
 assert.equal(yields,1);assert.equal(uploads,0);
});
