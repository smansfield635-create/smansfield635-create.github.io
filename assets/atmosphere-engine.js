/* ============================================================
   TNT — /assets/atmosphere-engine.js
   GEODIAMETRICS ATMOSPHERE ENGINE (MOON + CLOUDS + DRAGON HEAD TEMPLATE)
   EN-ONLY (VISUAL DEV MODE)
   RULES:
     - No external assets
     - ui.css owns html/body background (we only draw overlay canvases)
     - Two canvases:
         BG = clouds + sky glow (behind compass)
         MID = moon + dragons + lantern embers (above compass, below buttons)
     - Deterministic + performant: precomputed craters + cloud blobs
   ============================================================ */
(function(){
  "use strict";

  // ---- guard: avoid duplicates ----
  if(window.GD_ATMO && window.GD_ATMO.__alive) return;

  const GD_ATMO = window.GD_ATMO = {
    __alive:true,
    state:{
      enabled:true,
      dpi: Math.min(2, window.devicePixelRatio || 1),
      moon:{
        // phase advances on each load; single moon only (no double)
        phaseIndex: 0,         // 0..15
        glow: 0.85,
        size: 170,
        xNorm: 0.88,
        yNorm: 0.22
      },
      clouds:{
        count: 8,
        speed: 0.06,
        opacity: 0.18
      },
      embers:{
        count: 28,
        speed: 0.14,
        opacity: 0.30
      },
      dragons:{
        enabled:true,
        count: 2,
        colorBody: "rgba(10,35,18,0.92)",      // onyx-green
        colorBelly:"rgba(120,0,22,0.16)",      // subtle red belly tint
        colorStroke:"rgba(212,175,55,0.65)",   // gold edge
        bannerEnabled:true,
        bannerTextPool:[
          "Say less, do more.",
          "Time passes, the river flows.",
          "Correct mistakes; virtue is greatest.",
          "One moment becomes a thousand years."
        ],
        speed: 0.65,
        slitherAmp: 14,
        slitherFreq: 0.020
      }
    },
    canvases:{},
    ctx:{},
    cache:{},
    api:{}
  };

  // ============================================================
  // Utilities
  // ============================================================
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const rand=(a,b)=>a+Math.random()*(b-a);
  const now=()=>performance.now();

  function setStyle(el, css){
    for(const k in css) el.style[k]=css[k];
  }

  function mkCanvas(id, z){
    let c=document.getElementById(id);
    if(c) return c;
    c=document.createElement("canvas");
    c.id=id;
    setStyle(c,{
      position:"fixed",
      inset:"0",
      width:"100vw",
      height:"100vh",
      pointerEvents:"none",
      zIndex:String(z),
      transform:"translateZ(0)"
    });
    document.body.appendChild(c);
    return c;
  }

  function resizeCanvas(c, dpi){
    const w=Math.floor(window.innerWidth * dpi);
    const h=Math.floor(window.innerHeight * dpi);
    if(c.width===w && c.height===h) return;
    c.width=w; c.height=h;
  }

  // ============================================================
  // Moon phase + crater cache (single moon, no “double”)
  // ============================================================
  function buildCraterMap(sizePx){
    // Precompute crater circles with a shaded rim.
    // Deterministic-ish for stability per load.
    const craters=[];
    const n = 26; // crater count (kept modest for perf)
    for(let i=0;i<n;i++){
      const r = rand(sizePx*0.010, sizePx*0.060);
      const x = rand(-sizePx*0.32, sizePx*0.32);
      const y = rand(-sizePx*0.32, sizePx*0.32);
      const d = Math.sqrt(x*x+y*y);
      if(d > sizePx*0.34) { i--; continue; }
      craters.push({x,y,r,shade:rand(0.10,0.26)});
    }
    return craters;
  }

  function moonPhaseMask(ctx, cx, cy, r, phase01){
    // phase01: 0 new -> 0.5 full -> 1 new
    // We draw: base disc, then subtract shadow disc offset.
    // This avoids “double moons” by never drawing two bright discs.
    ctx.save();
    ctx.translate(cx,cy);

    // Base disc clip
    ctx.beginPath();
    ctx.arc(0,0,r,0,Math.PI*2);
    ctx.clip();

    // Shadow: offset depends on phase
    const t = phase01<=0.5 ? (phase01/0.5) : ((1-phase01)/0.5); // 0..1..0
    const dir = phase01<=0.5 ? -1 : 1; // waxing vs waning
    const off = dir * lerp(r*1.05, 0, t);

    ctx.globalCompositeOperation="source-over";
    ctx.fillStyle="rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.arc(off,0,r*1.02,0,Math.PI*2);
    ctx.fill();

    ctx.restore();
  }

  function drawMoon(ctx, W, H, S){
    const m=S.moon;
    const dpi=S.dpi;

    const r = m.size * dpi * 0.5;
    const cx = W*m.xNorm;
    const cy = H*m.yNorm;

    // glow halo
    ctx.save();
    ctx.globalCompositeOperation="screen";
    const g=ctx.createRadialGradient(cx,cy,r*0.30, cx,cy, r*1.9);
    g.addColorStop(0, `rgba(255,235,205,${0.22*m.glow})`);
    g.addColorStop(1, "rgba(255,235,205,0)");
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(cx,cy,r*1.9,0,Math.PI*2); ctx.fill();
    ctx.restore();

    // moon disc (single)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle="rgba(245,245,245,0.96)";
    ctx.fill();

    // subtle terminator shading
    const phase01 = (m.phaseIndex % 16)/16; // 0..0.9375
    moonPhaseMask(ctx, cx, cy, r, phase01);

    // craters
    const key="craters_"+Math.round(r);
    if(!GD_ATMO.cache[key]) GD_ATMO.cache[key]=buildCraterMap(r*2);
    const craters = GD_ATMO.cache[key];

    ctx.save();
    ctx.translate(cx,cy);
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.clip();

    // limb darkening
    const ld=ctx.createRadialGradient(0,0,r*0.25, 0,0,r);
    ld.addColorStop(0,"rgba(255,255,255,0)");
    ld.addColorStop(1,"rgba(0,0,0,0.18)");
    ctx.fillStyle=ld;
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();

    for(const c of craters){
      // crater body
      ctx.fillStyle=`rgba(170,170,170,${c.shade})`;
      ctx.beginPath(); ctx.arc(c.x,c.y,c.r,0,Math.PI*2); ctx.fill();
      // rim highlight
      ctx.strokeStyle="rgba(255,255,255,0.12)";
      ctx.lineWidth=Math.max(1, r*0.002);
      ctx.beginPath(); ctx.arc(c.x-c.r*0.15, c.y-c.r*0.15, c.r*0.98, 0, Math.PI*2);
      ctx.stroke();
    }
    ctx.restore(); // crater clip
    ctx.restore(); // translate

    ctx.restore();
  }

  // ============================================================
  // Cloud blobs (multi-lobed, not ovals)
  // ============================================================
  function makeCloudField(count){
    const out=[];
    for(let i=0;i<count;i++){
      out.push({
        x: rand(-0.2,1.2),
        y: rand(0.10,0.60),
        s: rand(0.60,1.30),
        v: rand(0.020,0.060),
        lobes: Math.floor(rand(5,9)),
        wob: rand(0.8,1.6),
        seed: Math.random()*1000
      });
    }
    return out;
  }

  function drawCloud(ctx, x, y, size, lobes, wob, t, alpha){
    ctx.save();
    ctx.translate(x,y);
    ctx.globalAlpha=alpha;
    ctx.fillStyle="rgba(255,255,255,1)";
    ctx.beginPath();

    // lobe ring
    for(let i=0;i<lobes;i++){
      const a=(i/lobes)*Math.PI*2;
      const rr=size*(0.22 + 0.06*Math.sin(t*wob + i));
      const rx=size*(0.32 + 0.08*Math.cos(t*wob*0.7 + i*1.3));
      const px=Math.cos(a)*rx;
      const py=Math.sin(a)*rr;
      ctx.moveTo(px+rr,py);
      ctx.arc(px,py,rr,0,Math.PI*2);
    }
    ctx.fill();

    // soften edges
    ctx.globalCompositeOperation="source-in";
    const g=ctx.createRadialGradient(0,0,size*0.15, 0,0,size*0.9);
    g.addColorStop(0,"rgba(255,255,255,1)");
    g.addColorStop(1,"rgba(255,255,255,0)");
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(0,0,size,0,Math.PI*2); ctx.fill();

    ctx.restore();
  }

  function drawClouds(ctx, W, H, S, t){
    const C=S.clouds;
    if(!GD_ATMO.cache.clouds) GD_ATMO.cache.clouds=makeCloudField(C.count);
    const clouds=GD_ATMO.cache.clouds;

    ctx.save();
    ctx.globalCompositeOperation="screen";
    for(const c of clouds){
      c.x += (c.v * C.speed) * (S.dpi*0.9);
      if(c.x > 1.25) c.x = -0.25;

      const px = c.x * W;
      const py = c.y * H;
      const size = (220 * c.s) * S.dpi;

      // cloud color tint (warm night)
      ctx.save();
      ctx.globalAlpha = C.opacity;
      drawCloud(ctx, px, py, size, c.lobes, c.wob, t*0.001 + c.seed, 1);
      ctx.restore();
    }
    ctx.restore();
  }

  // ============================================================
  // Embers / lantern drift (kept subtle)
  // ============================================================
  function makeEmbers(count){
    const out=[];
    for(let i=0;i<count;i++){
      out.push({
        x: Math.random(),
        y: 1 + Math.random()*0.6,
        s: rand(1.6,4.4),
        v: rand(0.020,0.060),
        a: rand(0.12,0.32)
      });
    }
    return out;
  }

  function drawEmbers(ctx, W, H, S, t){
    const E=S.embers;
    if(!GD_ATMO.cache.embers) GD_ATMO.cache.embers=makeEmbers(E.count);
    const embers=GD_ATMO.cache.embers;

    ctx.save();
    ctx.globalCompositeOperation="screen";
    for(const e of embers){
      e.y -= e.v * E.speed;
      e.x += Math.sin(t*0.0004 + e.y*6.0)*0.00035;
      if(e.y < -0.1){ e.y = 1.05 + Math.random()*0.6; e.x = Math.random(); }

      const px=e.x*W;
      const py=e.y*H;
      const r=e.s*S.dpi;

      const g=ctx.createRadialGradient(px,py,0, px,py,r*5);
      g.addColorStop(0, `rgba(255,190,120,${e.a*E.opacity})`);
      g.addColorStop(1, "rgba(255,190,120,0)");
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(px,py,r*5,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  // ============================================================
  // Dragon engine (spine + REAL head template)
  //   - We draw ONE head per dragon, rotated to velocity vector.
  //   - Body is segments with scale arcs (not perfect circles).
  // ============================================================
  function makeDragon(yNorm, dir){
    const seg=64;
    const body=[];
    for(let i=0;i<seg;i++) body.push({x: -i*24, y: window.innerHeight*yNorm});
    return {
      dir: dir, // 1 left->right, -1 right->left
      body,
      seed: Math.random()*999,
      banner: GD_ATMO.state.dragons.bannerTextPool[Math.floor(Math.random()*GD_ATMO.state.dragons.bannerTextPool.length)],
      bannerX: -99999
    };
  }

  function dragonAngle(d){
    const p0=d.body[0], p1=d.body[1];
    return Math.atan2(p0.y-p1.y, p0.x-p1.x);
  }

  function drawDragonHead(ctx, x, y, ang, scale, S){
    // “real” head silhouette: snout + jaw + horns + whiskers + mane
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(ang);
    ctx.scale(scale, scale);

    // head base
    ctx.fillStyle = "rgba(10,35,18,0.96)";
    ctx.strokeStyle = "rgba(212,175,55,0.70)";
    ctx.lineWidth = 2;

    // skull/snout polygon
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.quadraticCurveTo(26,-10, 46,-4);   // snout top
    ctx.quadraticCurveTo(60,2, 54,10);    // nose tip
    ctx.quadraticCurveTo(38,16, 22,12);   // cheek
    ctx.quadraticCurveTo(10,10, 0,0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // lower jaw
    ctx.beginPath();
    ctx.moveTo(18,10);
    ctx.quadraticCurveTo(34,20, 52,14);
    ctx.quadraticCurveTo(40,28, 18,18);
    ctx.closePath();
    ctx.fillStyle="rgba(8,24,12,0.92)";
    ctx.fill();
    ctx.strokeStyle="rgba(212,175,55,0.55)";
    ctx.stroke();

    // teeth (simple spikes)
    ctx.strokeStyle="rgba(255,255,255,0.35)";
    ctx.lineWidth=1.2;
    for(let i=0;i<5;i++){
      const tx=34+i*4;
      ctx.beginPath();
      ctx.moveTo(tx,14);
      ctx.lineTo(tx+2,18);
      ctx.stroke();
    }

    // eye slit
    ctx.strokeStyle="rgba(255,255,255,0.55)";
    ctx.lineWidth=2.4;
    ctx.beginPath();
    ctx.moveTo(24,2);
    ctx.quadraticCurveTo(30,0, 36,2);
    ctx.stroke();
    ctx.fillStyle="rgba(255,255,255,0.75)";
    ctx.beginPath(); ctx.arc(32,3,1.7,0,Math.PI*2); ctx.fill();

    // horns
    ctx.strokeStyle="rgba(212,175,55,0.55)";
    ctx.lineWidth=2;
    ctx.beginPath(); // horn 1
    ctx.moveTo(18,-6);
    ctx.quadraticCurveTo(6,-20, -8,-18);
    ctx.stroke();
    ctx.beginPath(); // horn 2
    ctx.moveTo(26,-6);
    ctx.quadraticCurveTo(14,-24, 2,-24);
    ctx.stroke();

    // whiskers
    ctx.strokeStyle="rgba(255,255,255,0.22)";
    ctx.lineWidth=1.6;
    ctx.beginPath();
    ctx.moveTo(50,6);
    ctx.quadraticCurveTo(70,0, 88,10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(46,10);
    ctx.quadraticCurveTo(66,18, 86,22);
    ctx.stroke();

    // mane spikes
    ctx.strokeStyle="rgba(212,175,55,0.20)";
    ctx.lineWidth=2.2;
    for(let i=0;i<7;i++){
      const mx=-6 - i*6;
      const my=-6 + i*2;
      ctx.beginPath();
      ctx.moveTo(mx,my);
      ctx.lineTo(mx-8, my-10);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawDragonBody(ctx, d, S, t){
    const D=S.dragons;
    ctx.save();
    ctx.globalCompositeOperation="source-over";

    ctx.lineCap="round";
    ctx.lineJoin="round";

    // body segments (scale arcs)
    for(let i=d.body.length-1;i>=0;i--){
      const p=d.body[i];
      const size = (22 - i*0.22) * S.dpi;
      if(size<=2) continue;

      // belly tint gradient
      const belly = ctx.createRadialGradient(p.x, p.y+size*0.28, 1, p.x, p.y, size*1.2);
      belly.addColorStop(0, D.colorBelly);
      belly.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = D.colorBody;
      ctx.strokeStyle = D.colorStroke;
      ctx.lineWidth = Math.max(1.2, 1.6*S.dpi);

      // segment
      ctx.beginPath();
      ctx.ellipse(p.x,p.y, size*0.95, size*0.74, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();

      // belly shimmer
      ctx.fillStyle=belly;
      ctx.beginPath();
      ctx.ellipse(p.x,p.y, size*1.0, size*0.9, 0, 0, Math.PI*2);
      ctx.fill();

      // scale arcs (the key: not circles-on-circles)
      ctx.strokeStyle="rgba(212,175,55,0.22)";
      ctx.lineWidth=Math.max(0.8, 1.0*S.dpi);
      const arcCount=3;
      for(let k=0;k<arcCount;k++){
        const r=size*(0.45 + k*0.12);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, Math.PI*0.10, Math.PI*0.90);
        ctx.stroke();
      }
    }

    // head (draw after body)
    const p0=d.body[0];
    const ang = dragonAngle(d);
    drawDragonHead(ctx, p0.x, p0.y, ang, 1.05*S.dpi, S);

    ctx.restore();
  }

  function stepDragon(d, W, H, S, t){
    const D=S.dragons;
    const speed = D.speed * S.dpi * d.dir;

    // move head forward
    d.body[0].x += speed;

    // slither: coherent sine wave (not “wiggle spam”)
    const baseY = d.body[0].y;
    const amp = D.slitherAmp * S.dpi;
    const freq = D.slitherFreq;
    d.body[0].y = baseY + Math.sin(t*freq + d.seed)*amp*0.12;

    // follow chain with fixed spacing
    const dist=18*S.dpi;
    for(let i=1;i<d.body.length;i++){
      const prev=d.body[i-1];
      const cur=d.body[i];
      const dx=prev.x-cur.x;
      const dy=prev.y-cur.y;
      const mag=Math.sqrt(dx*dx+dy*dy) || 1;
      const ux=dx/mag;
      const uy=dy/mag;

      // coherent wave offset per segment
      const w = Math.sin(t*freq + i*0.28 + d.seed)*amp*0.016;
      cur.x = prev.x - ux*dist;
      cur.y = prev.y - uy*dist + w;
    }

    // recycle fully offscreen → new quote
    const margin=220*S.dpi;
    const headX=d.body[0].x;
    if(d.dir===1 && headX > W+margin){
      for(let i=0;i<d.body.length;i++){ d.body[i].x = -margin - i*24*S.dpi; }
      d.banner = D.bannerTextPool[Math.floor(Math.random()*D.bannerTextPool.length)];
    }
    if(d.dir===-1 && headX < -margin){
      for(let i=0;i<d.body.length;i++){ d.body[i].x = W+margin + i*24*S.dpi; }
      d.banner = D.bannerTextPool[Math.floor(Math.random()*D.bannerTextPool.length)];
    }
  }

  function drawDragonBanner(ctx, d, W, H, S){
    const D=S.dragons;
    if(!D.bannerEnabled) return;

    // banner follows head, slightly behind
    const p0=d.body[6] || d.body[d.body.length-1];
    const bx=p0.x;
    const by=p0.y - 34*S.dpi;

    ctx.save();
    ctx.globalCompositeOperation="screen";
    ctx.font = `${Math.round(14*S.dpi)}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.fillStyle="rgba(212,175,55,0.80)";
    ctx.shadowColor="rgba(212,175,55,0.45)";
    ctx.shadowBlur=10*S.dpi;
    ctx.fillText(d.banner, bx, by);
    ctx.restore();
  }

  // ============================================================
  // Draw loop
  // ============================================================
  function ensure(){
    // BG behind compass (z=1), MID above compass but below nodes (z=7)
    const bg=mkCanvas("gd-atmo-bg", 1);
    const mid=mkCanvas("gd-atmo-mid", 7);

    GD_ATMO.canvases.bg=bg;
    GD_ATMO.canvases.mid=mid;
    GD_ATMO.ctx.bg=bg.getContext("2d");
    GD_ATMO.ctx.mid=mid.getContext("2d");

    resizeCanvas(bg, GD_ATMO.state.dpi);
    resizeCanvas(mid, GD_ATMO.state.dpi);
  }

  function readMoonPhase(){
    // advance per load; persist in localStorage
    try{
      const k="gd_moon_phase";
      const v=parseInt(localStorage.getItem(k)||"0",10);
      const next=(v+1)%16;
      localStorage.setItem(k,String(next));
      GD_ATMO.state.moon.phaseIndex=next;
    }catch(e){
      GD_ATMO.state.moon.phaseIndex=(GD_ATMO.state.moon.phaseIndex+1)%16;
    }
  }

  function tick(){
    if(!GD_ATMO.state.enabled) return;

    ensure();

    const dpi=GD_ATMO.state.dpi;
    const W=GD_ATMO.canvases.bg.width;
    const H=GD_ATMO.canvases.bg.height;

    const t=now();

    // BG: clouds only (behind compass)
    const b=GD_ATMO.ctx.bg;
    b.clearRect(0,0,W,H);
    drawClouds(b, W, H, GD_ATMO.state, t);

    // MID: moon + embers + dragons + banner (above compass, below buttons)
    const m=GD_ATMO.ctx.mid;
    m.clearRect(0,0,W,H);

    drawMoon(m, W, H, GD_ATMO.state);
    drawEmbers(m, W, H, GD_ATMO.state, t);

    // dragons
    if(GD_ATMO.state.dragons.enabled){
      if(!GD_ATMO.cache.dragons){
        GD_ATMO.cache.dragons=[
          makeDragon(0.34, 1),
          makeDragon(0.68, -1)
        ];
      }
      for(const d of GD_ATMO.cache.dragons){
        stepDragon(d, W, H, GD_ATMO.state, t);
        drawDragonBody(m, d, GD_ATMO.state, t);
        drawDragonBanner(m, d, W, H, GD_ATMO.state);
      }
    }

    requestAnimationFrame(tick);
  }

  // ============================================================
  // Public API (optional)
  // ============================================================
  GD_ATMO.api.setEnabled=function(on){
    GD_ATMO.state.enabled=!!on;
    if(on) tick();
    if(!on){
      try{
        GD_ATMO.ctx.bg && GD_ATMO.ctx.bg.clearRect(0,0,GD_ATMO.canvases.bg.width, GD_ATMO.canvases.bg.height);
        GD_ATMO.ctx.mid && GD_ATMO.ctx.mid.clearRect(0,0,GD_ATMO.canvases.mid.width, GD_ATMO.canvases.mid.height);
      }catch(e){}
    }
  };
  GD_ATMO.api.setDragonEnabled=function(on){ GD_ATMO.state.dragons.enabled=!!on; };
  GD_ATMO.api.setCloudOpacity=function(v){ GD_ATMO.state.clouds.opacity=clamp(v,0,1); };
  GD_ATMO.api.setMoonGlow=function(v){ GD_ATMO.state.moon.glow=clamp(v,0,1); };
  GD_ATMO.api.setMoonSize=function(px){ GD_ATMO.state.moon.size=clamp(px,80,420); };
  GD_ATMO.api.setDragonColors=function(body,belly,stroke){
    if(body) GD_ATMO.state.dragons.colorBody=body;
    if(belly) GD_ATMO.state.dragons.colorBelly=belly;
    if(stroke) GD_ATMO.state.dragons.colorStroke=stroke;
  };
  GD_ATMO.api.setBannerPool=function(arr){
    if(Array.isArray(arr) && arr.length) GD_ATMO.state.dragons.bannerTextPool=arr.slice(0,24);
  };

  // ============================================================
  // Init
  // ============================================================
  function init(){
    readMoonPhase();
    ensure();
    tick();
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", init, {once:true});
  }else{
    init();
  }

})();
