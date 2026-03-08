(function(){
"use strict";

const TAU=Math.PI*2;

function fract(v){
  return v-Math.floor(v);
}

function hash(n){
  return fract(Math.sin(n*127.1)*43758.5453123);
}

function createState(){
  return{
    clouds:[],
    lanterns:[]
  };
}

function resizeState(state,w,h){
  initClouds(state,w,h);
  initLanterns(state,w,h);
  return state;
}

function initClouds(state,w,h){
  const count=Math.max(8,Math.round(w/190));
  state.clouds=[];
  for(let i=0;i<count;i++){
    const seed=i+1;
    const layer=i%3;
    state.clouds.push({
      x:hash(seed*12.1)*w,
      y:h*(layer===0?(0.15+hash(seed*1.8)*0.10):layer===1?(0.23+hash(seed*2.8)*0.10):(0.30+hash(seed*3.8)*0.10)),
      size:(110+hash(seed*13.7)*120)*(layer===0?1.2:layer===1?0.95:0.72),
      speed:(0.1+hash(seed*14.3)*0.12)*(layer===0?0.22:layer===1?0.38:0.6),
      alpha:layer===0?0.10:layer===1?0.14:0.18,
      phase:hash(seed*15.1)*TAU
    });
  }
}

function initLanterns(state,w,h){
  const count=Math.max(16,Math.round(w/120));
  state.lanterns=[];
  for(let i=0;i<count;i++){
    const seed=i+1;
    const depth=i%3===0?1:(i%3===1?0.78:0.58);
    state.lanterns.push({
      x:hash(seed*2.17)*w,
      y:h*(0.48+hash(seed*3.91)*0.36),
      size:(14+hash(seed*5.31)*10)*depth,
      sway:(8+hash(seed*7.33)*18)*(0.8+depth*0.45),
      phase:hash(seed*8.07)*TAU,
      flame:hash(seed*9.07)*TAU,
      tilt:(hash(seed*10.11)-0.5)*0.16,
      depth:depth
    });
  }
}

function roundedRectPath(ctx,x,y,w,h,r){
  const rr=Math.min(r,w*0.5,h*0.5);
  ctx.beginPath();
  ctx.moveTo(x+rr,y);
  ctx.lineTo(x+w-rr,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+rr);
  ctx.lineTo(x+w,y+h-rr);
  ctx.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);
  ctx.lineTo(x+rr,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-rr);
  ctx.lineTo(x,y+rr);
  ctx.quadraticCurveTo(x,y,x+rr,y);
  ctx.closePath();
}

function drawSky(ctx,w,h,tick){
  const warmMix=0.28+Math.sin(tick*0.002)*0.04;
  const g=ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,`rgba(${Math.round(18+18*warmMix)},${Math.round(8+8*warmMix)},${Math.round(20+20*(1-warmMix))},1)`);
  g.addColorStop(0.2,`rgba(${Math.round(36+16*warmMix)},${Math.round(10+8*warmMix)},${Math.round(28+14*(1-warmMix))},1)`);
  g.addColorStop(0.48,`rgba(${Math.round(84+24*warmMix)},${Math.round(20+12*warmMix)},${Math.round(48+12*(1-warmMix))},1)`);
  g.addColorStop(0.72,`rgba(${Math.round(150+30*warmMix)},${Math.round(48+22*warmMix)},${Math.round(64+8*(1-warmMix))},1)`);
  g.addColorStop(1,"rgba(20,6,8,1)");
  ctx.fillStyle=g;
  ctx.fillRect(0,0,w,h);

  const horizon=h*0.62;
  const glow=ctx.createLinearGradient(0,horizon-140,0,horizon+120);
  glow.addColorStop(0,"rgba(255,175,88,0)");
  glow.addColorStop(0.22,"rgba(108,140,255,0.08)");
  glow.addColorStop(0.48,"rgba(255,152,62,0.16)");
  glow.addColorStop(0.72,"rgba(255,112,48,0.18)");
  glow.addColorStop(1,"rgba(255,96,36,0)");
  ctx.fillStyle=glow;
  ctx.fillRect(0,horizon-140,w,260);
}

function drawCelestials(ctx,w,h,tick){
  const sunA=tick*0.0035;
  const moonA=tick*0.0028+Math.PI;
  const moonB=tick*0.0022+1.2;

  const sunX=w*0.5+Math.cos(sunA)*(w*0.22);
  const sunY=h*0.22+Math.sin(sunA)*(h*0.08);
  const sunR=Math.min(w,h)*0.045;

  const halo=ctx.createRadialGradient(sunX,sunY,sunR*0.2,sunX,sunY,sunR*2.6);
  halo.addColorStop(0,"rgba(255,216,140,0.20)");
  halo.addColorStop(0.45,"rgba(255,150,90,0.14)");
  halo.addColorStop(1,"rgba(255,150,90,0)");
  ctx.fillStyle=halo;
  ctx.beginPath();
  ctx.arc(sunX,sunY,sunR*2.6,0,TAU);
  ctx.fill();

  ctx.fillStyle="rgba(255,214,120,0.92)";
  ctx.beginPath();
  ctx.arc(sunX,sunY,sunR,0,TAU);
  ctx.fill();

  drawMoon(ctx,w*0.24+Math.cos(moonA)*(w*0.05),h*0.18+Math.sin(moonA)*(h*0.04),Math.min(w,h)*0.045,"rgba(255,220,170,0.88)");
  drawMoon(ctx,w*0.76+Math.cos(moonB)*(w*0.05),h*0.16+Math.sin(moonB)*(h*0.04),Math.min(w,h)*0.060,"rgba(255,238,205,0.92)");
}

function drawMoon(ctx,x,y,r,fill){
  const halo=ctx.createRadialGradient(x,y,r*0.3,x,y,r*2.2);
  halo.addColorStop(0,"rgba(255,244,215,0.18)");
  halo.addColorStop(0.48,"rgba(255,226,176,0.12)");
  halo.addColorStop(1,"rgba(255,226,176,0)");
  ctx.fillStyle=halo;
  ctx.beginPath();
  ctx.arc(x,y,r*2.2,0,TAU);
  ctx.fill();

  ctx.fillStyle=fill;
  ctx.beginPath();
  ctx.arc(x,y,r,0,TAU);
  ctx.fill();
}

function drawClouds(ctx,tick,state){
  for(const cl of state.clouds){
    cl.x+=cl.speed;
    if(cl.x>window.innerWidth+cl.size*1.2)cl.x=-cl.size*1.2;
    const x=cl.x+Math.sin(tick*0.0016+cl.phase)*18;
    const y=cl.y+Math.cos(tick*0.0012+cl.phase)*4;

    ctx.save();
    ctx.globalAlpha=cl.alpha;
    ctx.beginPath();
    ctx.ellipse(x-cl.size*0.26,y,cl.size*0.34,cl.size*0.12,0,0,TAU);
    ctx.ellipse(x+cl.size*0.08,y-cl.size*0.05,cl.size*0.42,cl.size*0.15,0,0,TAU);
    ctx.ellipse(x+cl.size*0.42,y,cl.size*0.30,cl.size*0.11,0,0,TAU);
    ctx.fillStyle="rgba(255,230,210,0.14)";
    ctx.fill();
    ctx.restore();
  }
}

function drawLanterns(ctx,tick,state){
  for(const ln of state.lanterns){
    const y=ln.y-Math.sin(tick*0.01+ln.phase)*ln.sway;
    const x=ln.x;
    const flicker=0.82+Math.sin(tick*0.09+ln.flame)*0.12+Math.sin(tick*0.043+ln.flame*0.7)*0.06;

    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(ln.tilt+Math.sin(tick*0.01+ln.phase)*0.04);
    ctx.globalAlpha=0.95*ln.depth;
    ctx.fillStyle="rgba(160,30,28,0.92)";
    roundedRectPath(ctx,-6,-10,12,20,4);
    ctx.fill();

    ctx.globalAlpha=0.50*ln.depth;
    ctx.fillStyle=`rgba(255,216,128,${0.30*flicker})`;
    roundedRectPath(ctx,-2.5,-3.5,5,7,2);
    ctx.fill();
    ctx.restore();
  }
}

function drawMountains(ctx,w,h){
  const horizon=h*0.62;
  for(let band=0;band<3;band++){
    const pts=[];
    const baseY=horizon+(band===0?24:(band===1?48:76));
    const step=band===0?82:(band===1?68:54);
    const amp=band===0?60:(band===1?42:28);

    for(let x=-120;x<=w+120;x+=step){
      const seed=(band+1)*1000+x;
      pts.push({x:x,y:baseY+(hash(seed*0.013)-0.5)*amp});
    }

    ctx.beginPath();
    ctx.moveTo(-100,h);
    for(const p of pts)ctx.lineTo(p.x,p.y);
    ctx.lineTo(w+100,h);
    ctx.closePath();
    ctx.fillStyle=band===0?"rgba(28,16,18,0.78)":band===1?"rgba(34,18,20,0.58)":"rgba(42,20,22,0.42)";
    ctx.fill();
  }
}

function drawWater(ctx,w,h,tick){
  const horizon=h*0.62;
  const base=h*0.80;
  const g=ctx.createLinearGradient(0,horizon,0,h);
  g.addColorStop(0,"rgba(18,22,48,0.56)");
  g.addColorStop(0.36,"rgba(10,14,28,0.82)");
  g.addColorStop(1,"rgba(4,5,12,1)");
  ctx.fillStyle=g;
  ctx.fillRect(0,horizon,w,h-horizon);

  for(let layer=0;layer<10;layer++){
    const depth=layer/9;
    const yBase=base+layer*14;
    ctx.beginPath();
    for(let x=0;x<=w;x+=10){
      const wave1=Math.sin(x*0.020+tick*0.020+layer)*6*(0.7+depth*0.4);
      const wave2=Math.sin(x*0.007-tick*0.012+layer*1.3)*2.4;
      const y=yBase+wave1+wave2;
      if(x===0)ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    }
    ctx.strokeStyle=`rgba(255,${Math.round(120+depth*80)},${Math.round(110+depth*60)},${0.028+depth*0.056})`;
    ctx.lineWidth=1.2;
    ctx.stroke();
  }
}

window.VARIANT_BACKGROUND_RENDERER=Object.freeze({
  version:"VARIANT_BACKGROUND_RENDERER_v1",
  createState:createState,
  resizeState:resizeState,
  roundedRectPath:roundedRectPath,
  drawSky:drawSky,
  drawCelestials:drawCelestials,
  drawClouds:drawClouds,
  drawLanterns:drawLanterns,
  drawMountains:drawMountains,
  drawWater:drawWater
});
})();
