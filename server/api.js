/* TNT — /server/api.js
   PRIVATE SERVER ENDPOINT (NOT PUBLIC)
   PURPOSE: generate frame packs using the 4 private engines and return to client.
   ROUTES:
     POST /compile  → returns {build_token, plan_id, fps, frames[]}
   DEPENDS ON:
     ./rig-solver.js
     ./mesh-generator.js
     ./surface-field.js
     ./feature-engine.js
*/
"use strict";

const http = require("http");

const { stepRig } = require("./rig-solver.js");
const { buildHull2D } = require("./mesh-generator.js");
const { field } = require("./surface-field.js");
const { buildFeatures } = require("./feature-engine.js");

function nowISO(){ try{ return new Date().toISOString(); }catch(e){ return ""; } }
function randHex(n){ const c="0123456789abcdef"; let s=""; for(let i=0;i<n;i++) s+=c[(Math.random()*16)|0]; return s; }

function readJson(req){
  return new Promise((resolve,reject)=>{
    let data="";
    req.on("data",(c)=>{ data+=c; if(data.length>5e6) reject(new Error("payload too large")); });
    req.on("end",()=>{ try{ resolve(JSON.parse(data||"{}")); }catch(e){ reject(e); } });
  });
}

function send(res, code, obj){
  const json = JSON.stringify(obj);
  res.writeHead(code, {
    "Content-Type":"application/json",
    "Cache-Control":"no-store",
    "Access-Control-Allow-Origin":"*"
  });
  res.end(json);
}

function radiusFnFactory(){
  // canonical silhouette profile (server-owned)
  const SEG = 120;
  const R0 = 30;
  return function radiusFn(i,u){
    let m=1.0;
    if(u<0.06) m *= (1.20 - 0.20*(u/0.06));
    if(u>=0.06 && u<0.18){
      const t=(u-0.06)/0.12;
      m *= (0.84 - 0.22*Math.sin(Math.PI*t));
    }
    if(u>=0.18 && u<0.34){
      const t=(u-0.18)/0.16;
      m *= (1.05 + 0.46*Math.sin(Math.PI*t));
    }
    if(u>=0.34 && u<0.78) m *= 1.06;
    if(u>=0.78){
      const t=(u-0.78)/0.22;
      m *= (1.0 - 0.78*t);
      if(m<0.22) m=0.22;
    }
    const r = R0*m;
    return r<7?7:r;
  };
}

function makeFramePack(reqBody){
  const w = Number(reqBody.viewport_w||1200);
  const h = Number(reqBody.viewport_h||800);

  const fps = 30;
  const seconds = 4; // short loop pack
  const framesN = fps*seconds;

  const seg = 120;
  const gap = 16;

  const build_token = "IDX_" + randHex(8);
  const plan_id = "PLAN_" + build_token + "_" + randHex(6);

  const radiusFn = radiusFnFactory();

  function genOne(top){
    const dir = top? 1 : -1;
    const yBase = top ? h*0.33 : h*0.67;
    const phase = Math.random()*10;

    // state: head x advances; wrap around viewport
    let headX = top ? -w*0.25 : w*1.25;

    let spine = null;

    const frames = [];

    for(let fi=0; fi<framesN; fi++){
      const t = fi / fps;
      const dt = 1 / fps;

      headX += dir * 54 * dt;
      const margin = w*0.35;
      if(dir>0 && headX> w+margin) headX = -margin;
      if(dir<0 && headX<-margin) headX = w+margin;

      const rig = stepRig({
        t, dt, dir,
        x: headX,
        yBase: yBase,
        phase: phase,
        seg: seg,
        gap: gap,
        amp: 9,
        wave: 1.25,
        speed: 54
      }, spine);

      spine = rig.spine;

      const hull = buildHull2D(spine, (i,u)=>radiusFn(i,u));

      const feats = buildFeatures({
        spine,
        radiusFn: (i,u)=>radiusFn(i,u),
        fieldFn: (u,v)=>field(u,v,{scaleU:24,scaleV:12,elong:1.35})
      });

      // compress floats lightly (round to 1 decimal) to reduce payload
      function packPts(arr){
        const out = new Array(arr.length);
        for(let i=0;i<arr.length;i++){
          out[i] = [ Math.round(arr[i].x*10)/10, Math.round(arr[i].y*10)/10 ];
        }
        return out;
      }

      frames.push({
        headPose: { x: Math.round(rig.headPose.x*10)/10, y: Math.round(rig.headPose.y*10)/10, ang: Math.round(rig.headPose.ang*1000)/1000 },
        hull: { L: packPts(hull.L), R: packPts(hull.R) },
        ridge: packPts(feats.ridge),
        belly: feats.belly.map(a=>({
          x:Math.round(a.x*10)/10, y:Math.round(a.y*10)/10,
          rx:Math.round(a.rx*10)/10, ry:Math.round(a.ry*10)/10
        })),
        scales: feats.scales.slice(0, 220).map(s=>({ // cap for size
          q:s.q, r:s.r,
          x:Math.round(s.x*10)/10, y:Math.round(s.y*10)/10
        }))
      });
    }

    return frames;
  }

  return {
    ts: nowISO(),
    build_token,
    plan_id,
    fps,
    framesN,
    viewport: {w,h},
    top: { color: "jade", frames: genOne(true) },
    bot: { color: "crimson", frames: genOne(false) }
  };
}

const server = http.createServer(async (req,res)=>{
  if(req.method === "OPTIONS"){
    res.writeHead(204, {
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Methods":"POST, GET, OPTIONS",
      "Access-Control-Allow-Headers":"Content-Type"
    });
    return res.end();
  }

  if(req.method === "POST" && req.url === "/compile"){
    try{
      const body = await readJson(req);
      const pack = makeFramePack(body);
      return send(res, 200, pack);
    }catch(e){
      return send(res, 500, {error:"compile_failed", detail:String(e && e.message || e)});
    }
  }

  if(req.method === "GET" && req.url === "/health"){
    return send(res, 200, {ok:true});
  }

  return send(res, 404, {error:"not_found"});
});

const PORT = process.env.PORT || 8787;
server.listen(PORT, ()=>console.log("HEL private server on port", PORT));
