/* TNT — /assets/dragon-anatomy.js
   GEODIAMETRICS DRAGON ENGINE — CANON v2 (SLOW + SCALES)
   ENGLISH VISUAL PASS

   FIXES:
   - Singleton guard (prevents duplicate loops)
   - TRUE speed control (time-based; speed is actually honored)
   - Slower default speed (natural, readable)
   - Thick body (girth) + scale arcs
   - Always exits the screen fully before respawn

   NOTE:
   - NO bg, NO moon, NO clouds here. Just dragons.
*/
(function(){
  "use strict";

  if (window.__GD_DRAGON_RUNNING__) return;
  window.__GD_DRAGON_RUNNING__ = true;

  var VERSION = "DRAGON_CANON_v2";

  var canvas = document.getElementById("gd_dragon_canvas");
  if(!canvas){
    canvas = document.createElement("canvas");
    canvas.id = "gd_dragon_canvas";
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9";
    document.body.appendChild(canvas);
  }

  var ctx = canvas.getContext("2d", { alpha:true, desynchronized:true });
  if(!ctx) return;

  var W=0,H=0,DPR=1;
  function resize(){
    var ww=Math.max(1, window.innerWidth||1);
    var hh=Math.max(1, window.innerHeight||1);
    var dpr=1; try{ dpr=window.devicePixelRatio||1; }catch(e){}
    DPR=Math.min(1.6, Math.max(1,dpr));
    W=Math.floor(ww*DPR);
    H=Math.floor(hh*DPR);
    canvas.width=W;
    canvas.height=H;
  }
  resize();
  window.addEventListener("resize", resize, {passive:true});

  // ---------- Config (defaults = SLOW) ----------
  var CFG = {
    speed_px_s: 55,          // << SLOW DEFAULT
    girth: 2.6,              // thickness
    segments: 110,           // smooth
    laneY: 0.28,             // top dragon
    laneY2: 0.72,            // bottom dragon
    amp: 16,                 // slither amplitude
    wave: 0.9,               // slither frequency
    body: "rgba(0,55,35,0.86)",
    edge: "rgba(0,0,0,0.30)",
    gold: "rgba(212,175,55,0.32)"
  };

  window.GD_DRAGON = {
    mount: function(opts){
      if(!opts) return true;
      if(typeof opts.speed==="number") CFG.speed_px_s = Math.max(12, Math.min(120, opts.speed));
      if(typeof opts.girth==="number") CFG.girth = Math.max(1.2, Math.min(6.0, opts.girth));
      if(typeof opts.segments==="number") CFG.segments = Math.max(50, Math.min(160, opts.segments));
      return true;
    },
    version: VERSION
  };

  // allow preconfig
  try{
    if(window.__GD_DRAGON_CFG__) window.GD_DRAGON.mount(window.__GD_DRAGON_CFG__);
  }catch(e){}

  function makeSpine(yFrac){
    var s=[];
    var seg=CFG.segments;
    for(var i=0;i<seg;i++){
      s.push({x: -i*16*DPR, y: H*yFrac});
    }
    return s;
  }

  var top = makeSpine(CFG.laneY);
  var bot = makeSpine(CFG.laneY2);

  function ensureCounts(){
    if(top.length !== CFG.segments) top = makeSpine(CFG.laneY);
    if(bot.length !== CFG.segments) bot = makeSpine(CFG.laneY2);
  }

  function follow(spine, targetDist){
    for(var i=1;i<spine.length;i++){
      var p=spine[i-1], c=spine[i];
      var dx=p.x-c.x, dy=p.y-c.y;
      var dist=Math.sqrt(dx*dx+dy*dy) || 0.0001;
      c.x = p.x - (dx/dist)*targetDist;
      c.y = p.y - (dy/dist)*targetDist;
    }
  }

  function drawBody(spine){
    var thick = 10 * CFG.girth * DPR;

    // shadow edge
    ctx.strokeStyle = CFG.edge;
    ctx.lineWidth = thick + 7*DPR;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    for(var i=0;i<spine.length;i++){
      var p=spine[i];
      if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
    }
    ctx.stroke();

    // main
    ctx.strokeStyle = CFG.body;
    ctx.lineWidth = thick;
    ctx.beginPath();
    for(var j=0;j<spine.length;j++){
      var q=spine[j];
      if(j===0) ctx.moveTo(q.x,q.y); else ctx.lineTo(q.x,q.y);
    }
    ctx.stroke();

    // scales (arcs)
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1.2*DPR;
    for(var k=8;k<spine.length-8;k+=3){
      var a=spine[k], b=spine[k+1];
      var ang=Math.atan2(b.y-a.y, b.x-a.x);
      var rr=thick*0.55;
      ctx.beginPath();
      ctx.arc(a.x, a.y, rr, ang+0.7, ang+2.0);
      ctx.stroke();
    }
  }

  function drawHead(p, dir){
    var s = 18 * CFG.girth * DPR;

    // skull
    ctx.fillStyle = "rgba(0,75,45,0.92)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, s*1.05, s*0.85, 0, 0, Math.PI*2);
    ctx.fill();

    // snout
    ctx.fillStyle = "rgba(0,60,38,0.92)";
    ctx.beginPath();
    ctx.ellipse(p.x + dir*s*0.95, p.y + s*0.10, s*0.95, s*0.55, 0, 0, Math.PI*2);
    ctx.fill();

    // eye
    ctx.fillStyle = "rgba(212,175,55,0.95)";
    ctx.beginPath();
    ctx.arc(p.x + dir*s*0.35, p.y - s*0.18, s*0.14, 0, Math.PI*2);
    ctx.fill();

    // horns + whiskers
    ctx.strokeStyle = CFG.gold;
    ctx.lineWidth = 2*DPR;
    ctx.beginPath();
    ctx.moveTo(p.x - dir*s*0.15, p.y - s*0.55);
    ctx.lineTo(p.x - dir*s*0.55, p.y - s*1.25);
    ctx.moveTo(p.x + dir*s*0.25, p.y - s*0.55);
    ctx.lineTo(p.x + dir*s*0.05, p.y - s*1.35);
    ctx.stroke();

    ctx.lineWidth = 1.5*DPR;
    ctx.beginPath();
    ctx.moveTo(p.x + dir*s*1.55, p.y + s*0.10);
    ctx.lineTo(p.x + dir*s*2.40, p.y - s*0.40);
    ctx.moveTo(p.x + dir*s*1.55, p.y + s*0.18);
    ctx.lineTo(p.x + dir*s*2.30, p.y + s*0.55);
    ctx.stroke();
  }

  var lastT=0;
  var phase=Math.random()*10;

  function advance(spine, dt, yFrac){
    var head=spine[0];
    phase += dt;

    head.x += (CFG.speed_px_s * DPR) * dt;
    head.y = H*yFrac + Math.sin(phase*CFG.wave) * (CFG.amp*DPR);

    // must fully exit before respawn
    if(head.x > W + 320*DPR){
      head.x = -320*DPR;
    }

    follow(spine, 16*DPR);
  }

  function render(t){
    if(!lastT) lastT=t;
    var dt=(t-lastT)/1000;
    lastT=t;

    ensureCounts();

    ctx.clearRect(0,0,W,H);

    advance(top, dt, CFG.laneY);
    advance(bot, dt, CFG.laneY2);

    drawBody(top); drawHead(top[0], 1);
    drawBody(bot); drawHead(bot[0], 1);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

})();
