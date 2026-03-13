import { getPlanetBodyGeometry } from "../variant/planet_surface_projector.js";

export function createBackgroundRenderer() {

  function clamp(value,min,max){
    return Math.max(min,Math.min(max,value));
  }

  function getPhaseLabel(runtime){
    return runtime?.phase?.globalPhase ?? "CALM";
  }

  function getPhaseIntensity(runtime){
    const v=runtime?.phase?.intensity;
    return Number.isFinite(v)?clamp(v,0,1):0.2;
  }

  function drawSky(ctx,width,height,runtime){

    const phase=getPhaseLabel(runtime);

    const sky=ctx.createLinearGradient(0,0,0,height);

    if(phase==="CLEAR_WINDOW"){
      sky.addColorStop(0,"rgba(10,34,74,1)");
      sky.addColorStop(0.28,"rgba(28,92,170,1)");
      sky.addColorStop(0.62,"rgba(96,186,236,1)");
      sky.addColorStop(1,"rgba(206,240,255,1)");
    }
    else if(phase==="LOCKDOWN"){
      sky.addColorStop(0,"rgba(12,22,42,1)");
      sky.addColorStop(0.34,"rgba(26,54,98,1)");
      sky.addColorStop(0.68,"rgba(82,126,170,1)");
      sky.addColorStop(1,"rgba(154,184,210,1)");
    }
    else if(phase==="SEVERE"){
      sky.addColorStop(0,"rgba(10,28,58,1)");
      sky.addColorStop(0.34,"rgba(24,70,126,1)");
      sky.addColorStop(0.68,"rgba(88,146,198,1)");
      sky.addColorStop(1,"rgba(176,210,232,1)");
    }
    else{
      sky.addColorStop(0,"rgba(10,34,74,1)");
      sky.addColorStop(0.34,"rgba(26,86,154,1)");
      sky.addColorStop(0.68,"rgba(74,166,224,1)");
      sky.addColorStop(1,"rgba(188,228,250,1)");
    }

    ctx.fillStyle=sky;
    ctx.fillRect(0,0,width,height);
  }

  function drawPlanetBody(ctx,width,height,runtime){

    const body=getPlanetBodyGeometry(runtime);
    const phase=getPhaseLabel(runtime);

    const gradient=ctx.createRadialGradient(
      body.centerX,
      body.centerY-(body.radius*0.42),
      body.radius*0.16,
      body.centerX,
      body.centerY,
      body.radius
    );

    if(phase==="CLEAR_WINDOW"){
      gradient.addColorStop(0,"rgba(70,132,186,0.58)");
      gradient.addColorStop(0.34,"rgba(42,96,152,0.74)");
      gradient.addColorStop(0.68,"rgba(22,58,104,0.88)");
      gradient.addColorStop(1,"rgba(8,24,48,0.96)");
    }
    else if(phase==="LOCKDOWN"){
      gradient.addColorStop(0,"rgba(62,96,142,0.42)");
      gradient.addColorStop(0.34,"rgba(34,64,108,0.62)");
      gradient.addColorStop(0.68,"rgba(18,38,72,0.82)");
      gradient.addColorStop(1,"rgba(6,16,32,0.94)");
    }
    else if(phase==="SEVERE"){
      gradient.addColorStop(0,"rgba(68,114,164,0.48)");
      gradient.addColorStop(0.34,"rgba(38,76,124,0.66)");
      gradient.addColorStop(0.68,"rgba(18,42,82,0.84)");
      gradient.addColorStop(1,"rgba(6,18,36,0.95)");
    }
    else{
      gradient.addColorStop(0,"rgba(74,126,176,0.50)");
      gradient.addColorStop(0.34,"rgba(42,88,138,0.70)");
      gradient.addColorStop(0.68,"rgba(20,50,92,0.86)");
      gradient.addColorStop(1,"rgba(8,20,40,0.95)");
    }

    ctx.beginPath();
    ctx.arc(body.centerX,body.centerY,body.radius,0,Math.PI*2);
    ctx.fillStyle=gradient;
    ctx.fill();
  }

  function draw(ctx,runtime){

    const width=runtime.width;
    const height=runtime.height;

    if(!Number.isFinite(width)||!Number.isFinite(height))return;

    ctx.save();

    drawSky(ctx,width,height,runtime);
    drawPlanetBody(ctx,width,height,runtime);

    ctx.restore();
  }

  return Object.freeze({draw});
}
