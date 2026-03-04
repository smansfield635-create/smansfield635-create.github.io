/* TNT — /assets/bg-engine.js
   GEODIAMETRICS BACKGROUND ENGINE — CANON v2.1
   CHANGE: mounts into #gd-field when present (device-stable stacking)
*/
(function(){
  "use strict";

  if (window.__GD_BG_RUNNING__) return;
  window.__GD_BG_RUNNING__ = true;

  function lerp(a,b,t){ return a+(b-a)*t; }
  function mulberry32(seed){
    var t = seed >>> 0;
    return function(){
      t += 0x6D2B79F5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (t >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function createCanvas(){
    var c = document.createElement("canvas");
    c.id = "gd_bg_canvas";
    c.style.position = "absolute";
    c.style.inset = "0";
    c.style.width = "100%";
    c.style.height = "100%";
    c.style.pointerEvents = "none";
    c.style.userSelect = "none";
    return c;
  }

  function mount(opts){
    opts = opts || {};
    var existing = document.getElementById("gd_bg_canvas");
    if (existing){
      existing.__GD_OPTS = opts;
      return existing;
    }

    var host = document.getElementById("gd-field") || document.body || document.documentElement;
    var canvas = createCanvas();
    canvas.__GD_OPTS = opts;
    host.appendChild(canvas);

    var ctx = canvas.getContext("2d", { alpha:true, desynchronized:true });
    if (!ctx) return canvas;

    var DPR_CAP = (opts.dpr_cap != null) ? opts.dpr_cap : 1.6;
    var FPS = (opts.fps != null) ? opts.fps : 30;
    var FRAME_MS = 1000 / FPS;

    var reduce = false;
    try{ reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){}

    var W=0,H=0,DPR=1;

    function resize(){
      var ww = Math.max(1, window.innerWidth || 1);
      var hh = Math.max(1, window.innerHeight || 1);
      var dpr = 1;
      try{ dpr = window.devicePixelRatio || 1; }catch(e){}
      DPR = Math.min(DPR_CAP, Math.max(1, dpr));
      W = Math.floor(ww * DPR);
      H = Math.floor(hh * DPR);
      canvas.width = W;
      canvas.height = H;
    }
    resize();
    window.addEventListener("resize", resize, {passive:true});

    var moonPhase = Math.random();
    var craterSeed = ((Date.now() ^ (Math.random()*1e9)) >>> 0);
    var rnd = mulberry32(craterSeed);
    var craters = [];
    (function seedCraters(){
      var n = (opts.crater_count != null) ? opts.crater_count : 18;
      for (var i=0;i<n;i++){
        var ang = rnd()*Math.PI*2;
        var rad = Math.pow(rnd(), 0.62) * 0.78;
        craters.push({u:Math.cos(ang)*rad,v:Math.sin(ang)*rad,rr:lerp(0.05,0.16,rnd()),a:lerp(0.10,0.26,rnd())});
      }
    })();

    function drawSky(){
      var g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0.00,"rgba(210,70,40,0.26)");
      g.addColorStop(0.22,"rgba(120,20,20,0.14)");
      g.addColorStop(0.58,"rgba(180,55,30,0.18)");
      g.addColorStop(1.00,"rgba(0,0,0,0.14)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);
    }

    function drawMoon(){
      var mx = W*0.78, my = H*0.18;
      var mr = Math.min(W,H) * ((opts.moon_radius != null) ? opts.moon_radius : 0.065);

      ctx.save();

      var halo = ctx.createRadialGradient(mx,my,mr*0.2,mx,my,mr*2.8);
      halo.addColorStop(0,"rgba(255,248,230,0.26)");
      halo.addColorStop(0.40,"rgba(255,225,170,0.14)");
      halo.addColorStop(1,"rgba(255,225,170,0)");
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(mx,my,mr*2.8,0,Math.PI*2); ctx.fill();

      ctx.shadowColor = "rgba(255,245,225,0.48)";
      ctx.shadowBlur = 28*DPR;
      ctx.fillStyle = "rgba(255,246,232,0.98)";
      ctx.beginPath(); ctx.arc(mx,my,mr,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;

      var k = Math.cos(moonPhase*Math.PI*2);
      var shift = k*mr*0.58;
      ctx.save();
      ctx.beginPath(); ctx.arc(mx,my,mr,0,Math.PI*2); ctx.clip();
      ctx.fillStyle = "rgba(0,0,0,0.62)";
      ctx.beginPath(); ctx.arc(mx+shift,my,mr,0,Math.PI*2); ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath(); ctx.arc(mx,my,mr,0,Math.PI*2); ctx.clip();

      var rim = ctx.createRadialGradient(mx-mr*0.25,my-mr*0.25,mr*0.15,mx,my,mr);
      rim.addColorStop(0,"rgba(0,0,0,0.00)");
      rim.addColorStop(1,"rgba(0,0,0,0.18)");
      ctx.fillStyle = rim;
      ctx.fillRect(mx-mr,my-mr,mr*2,mr*2);

      for (var i=0;i<craters.length;i++){
        var c = craters[i];
        var cx = mx + c.u*mr, cy = my + c.v*mr, cr = c.rr*mr;
        ctx.fillStyle = "rgba(0,0,0,"+c.a+")";
        ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.10)";
        ctx.beginPath(); ctx.arc(cx-cr*0.18,cy-cr*0.18,cr*0.55,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();

      drawMoonReflection(mx,mr);
      ctx.restore();
    }

    function drawMoonReflection(mx,mr){
      var y0 = H*0.62, w = mr*2.8, h = mr*4.0;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.58;
      var g = ctx.createLinearGradient(mx,y0,mx,y0+h);
      g.addColorStop(0,"rgba(255,235,190,0.18)");
      g.addColorStop(0.35,"rgba(255,200,150,0.10)");
      g.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(mx,y0+h*0.22,w*0.40,h*0.44,0,0,Math.PI*2); ctx.fill();

      ctx.globalAlpha = 0.44;
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1*DPR;
      for (var i=0;i<7;i++){
        var yy = y0 + i*(h/7);
        ctx.beginPath(); ctx.ellipse(mx,yy,w*(0.22+i*0.10),6*DPR,0,0,Math.PI*2); ctx.stroke();
      }
      ctx.restore();
    }

    var crnd = mulberry32(((Date.now()+1337)>>>0));
    var clouds = [];
    (function seedClouds(){
      var n = (opts.cloud_count != null) ? opts.cloud_count : 22;
      for (var i=0;i<n;i++){
        var layer = (i%3);
        clouds.push({
          x: crnd()*W,
          y: lerp(H*0.45,H*0.95,crnd()),
          w: lerp(180,520,crnd())*DPR*(layer===0?1.15:layer===1?0.95:0.80),
          h: lerp(38,92,crnd())*DPR*(layer===0?1.10:layer===1?0.95:0.85),
          a: layer===0?0.10:layer===1?0.07:0.05,
          vx: (layer===0?0.028:layer===1?0.020:0.014)*DPR
        });
      }
    })();

    function drawCloudShape(x,y,w,h,alpha){
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(255,210,160,1)";
      ctx.beginPath(); ctx.ellipse(x,y,w,h,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x-w*0.28,y-h*0.12,w*0.55,h*0.85,0,0,Math.PI*2);
      ctx.ellipse(x+w*0.18,y-h*0.18,w*0.60,h*0.95,0,0,Math.PI*2);
      ctx.ellipse(x+w*0.42,y+h*0.05,w*0.45,h*0.78,0,0,Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = alpha*0.55;
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath(); ctx.ellipse(x+w*0.10,y+h*0.18,w*0.72,h*0.60,0,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha = alpha*0.55;
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.beginPath(); ctx.ellipse(x-w*0.10,y-h*0.20,w*0.70,h*0.55,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }

    function drawClouds(dtMs){
      for (var i=0;i<clouds.length;i++){
        var c = clouds[i];
        c.x += c.vx*dtMs;
        if (c.x > W + c.w) c.x = -c.w;
        drawCloudShape(c.x,c.y,c.w,c.h,c.a);
      }
    }

    var lanterns = [];
    (function seedLanterns(){
      var n = (opts.lantern_count != null) ? opts.lantern_count : 26;
      for (var i=0;i<n;i++){
        lanterns.push({
          x: Math.random()*W,
          y: H + Math.random()*H*0.6,
          vy: lerp(0.016,0.05,Math.random())*DPR,
          r:  lerp(1.4,3.2,Math.random())*DPR,
          a:  lerp(0.08,0.20,Math.random())
        });
      }
    })();

    function drawLanterns(dtMs){
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (var i=0;i<lanterns.length;i++){
        var l = lanterns[i];
        l.y -= l.vy*dtMs;
        if (l.y < -40*DPR){
          l.y = H + Math.random()*H*0.4;
          l.x = Math.random()*W;
        }
        ctx.globalAlpha = l.a;
        var g = ctx.createRadialGradient(l.x,l.y,0,l.x,l.y,l.r*8);
        g.addColorStop(0,"rgba(255,210,140,0.55)");
        g.addColorStop(0.35,"rgba(255,140,90,0.22)");
        g.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(l.x,l.y,l.r*8,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();
    }

    function drawWaterDial(t){
      var cx=W*0.5, cy=H*0.50;
      var r=Math.min(W,H)*0.32;
      ctx.save();
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip();

      var grd=ctx.createRadialGradient(cx,cy-r*0.2,r*0.2,cx,cy,r);
      grd.addColorStop(0,"rgba(255,220,180,0.08)");
      grd.addColorStop(0.55,"rgba(255,160,120,0.05)");
      grd.addColorStop(1,"rgba(0,0,0,0.00)");
      ctx.fillStyle=grd;
      ctx.fillRect(cx-r,cy-r,r*2,r*2);

      ctx.strokeStyle="rgba(255,255,255,0.05)";
      ctx.lineWidth=1*DPR;

      var base=(t*0.00018)%1;
      for(var i=0;i<9;i++){
        var rr=r*(0.18 + i*0.09 + base*0.09);
        ctx.beginPath(); ctx.arc(cx,cy,rr,0,Math.PI*2); ctx.stroke();
      }

      ctx.globalAlpha=0.70;
      ctx.strokeStyle="rgba(212,175,55,0.06)";
      ctx.lineWidth=2*DPR;
      var a=t*0.00018;
      ctx.beginPath(); ctx.arc(cx,cy,r*0.78,a,a+1.1); ctx.stroke();
      ctx.restore();
    }

    var last=0, acc=0;

    function renderOnce(ts, dtMs){
      ctx.clearRect(0,0,W,H);
      drawSky();
      drawMoon();
      drawClouds(dtMs||0);
      drawLanterns(dtMs||0);
      drawWaterDial(ts);
    }

    function frame(ts){
      if(!last) last=ts;
      var dt = ts-last;
      last=ts;

      if(reduce){
        renderOnce(ts, 0);
        requestAnimationFrame(frame);
        return;
      }

      acc += dt;
      if(acc < FRAME_MS){
        requestAnimationFrame(frame);
        return;
      }
      acc = acc % FRAME_MS;

      renderOnce(ts, dt);
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
    return canvas;
  }

  window.GD_BG = { mount: mount };
})();
