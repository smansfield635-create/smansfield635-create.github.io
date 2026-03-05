/* TNT — /assets/hel-client.js
   PUBLIC CLIENT ORCHESTRATOR (NO IP)
   VERSION: HEL_CLIENT_v1
*/
(function(){
"use strict";

if(window.__HEL_CLIENT_RUNNING__) return;
window.__HEL_CLIENT_RUNNING__ = true;

const API = "/compile"; // same-origin private server reverse-proxy recommended
const DPR_CAP = 1.6;

function mountCanvas(){
  let c=document.getElementById("hel_entity_canvas");
  if(c) return c;
  c=document.createElement("canvas");
  c.id="hel_entity_canvas";
  c.style.position="absolute";
  c.style.inset="0";
  c.style.width="100%";
  c.style.height="100%";
  c.style.pointerEvents="none";
  (document.getElementById("gd-dragon")||document.body).appendChild(c);
  return c;
}

function resize(c){
  let dpr=1; try{dpr=window.devicePixelRatio||1;}catch(e){}
  dpr=Math.min(DPR_CAP,Math.max(1,dpr));
  c.width=Math.floor((window.innerWidth||1)*dpr);
  c.height=Math.floor((window.innerHeight||1)*dpr);
  return dpr;
}

async function getPack(){
  const body = {
    viewport_w: window.innerWidth||1200,
    viewport_h: window.innerHeight||800
  };
  const r = await fetch(API, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(body)
  });
  if(!r.ok) throw new Error("compile failed: "+r.status);
  return r.json();
}

function run(pack){
  const c = mountCanvas();
  let dpr = resize(c);
  window.addEventListener("resize", ()=>{ dpr=resize(c); }, {passive:true});

  const ctx = c.getContext("2d", {alpha:true, desynchronized:true});
  const fps = pack.fps || 30;
  const n = pack.framesN || (pack.top.frames.length|0);

  const palTop = { fill:"rgba(0,110,60,0.92)", ridge:"rgba(212,175,55,0.18)" };
  const palBot = { fill:"rgba(170,20,20,0.90)", ridge:"rgba(212,175,55,0.14)" };

  let idx=0;
  let last=0;

  function draw(ts){
    if(!last) last=ts;
    const dt=ts-last;
    last=ts;

    // advance at server fps
    const step = 1000/fps;
    if(dt >= step){
      idx = (idx+1) % n;
      last = ts - (dt % step);
    }

    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,(window.innerWidth||1),(window.innerHeight||1));

    const fT = pack.top.frames[idx];
    const fB = pack.bot.frames[idx];

    if(window.HEL_RENDER){
      window.HEL_RENDER.drawFrame(ctx, fT, palTop);
      window.HEL_RENDER.drawFrame(ctx, fB, palBot);
    }

    // watermark
    ctx.fillStyle="rgba(255,255,255,0.18)";
    ctx.font="14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
    ctx.fillText(pack.build_token+" | "+pack.plan_id, 12, (window.innerHeight||1)-14);

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  // status hook (optional)
  window.HEL = { build_token: pack.build_token, plan_id: pack.plan_id, fps: fps };
}

window.addEventListener("load", async ()=>{
  try{
    const pack = await getPack();
    run(pack);
  }catch(e){
    // fail silently (no UI takeover)
    try{ console.log("HEL_CLIENT failed:", e); }catch(_){}
  }
});

})();
