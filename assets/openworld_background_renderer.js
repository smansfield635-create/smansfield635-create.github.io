export function createBackgroundRenderer() {

  function clamp(value,min,max){
    return Math.max(min,Math.min(max,value));
  }

  function lerp(a,b,t){
    return a+((b-a)*t);
  }

  function getPhaseLabel(runtime){
    return runtime?.phase?.globalPhase ?? "CALM";
  }

  function getPhaseIntensity(runtime){
    const v=runtime?.phase?.intensity;
    return Number.isFinite(v)?clamp(v,0,1):0.2;
  }

  function getNorthProgress(runtime){
    const py=runtime?.player?.y;
    if(!Number.isFinite(py)) return 0.25;
    return clamp((930-py)/930,0,1);
  }

  function getEastProgress(runtime){
    const px=runtime?.player?.x;
    if(!Number.isFinite(px)) return 0.5;
    return clamp((px-150)/(960-150),0,1);
  }

  /*
  ---------------------------------------------------
  PLANET CURVATURE MODEL
  ---------------------------------------------------

  Horizon now originates from the LEFT SIDE
  and sweeps diagonally upward.

  This simulates viewing a spherical world
  from an elevated aerial perspective.
  */

  function getPlanetCurve(runtime,width,height){

    const north=getNorthProgress(runtime);
    const east=getEastProgress(runtime);

    const phaseLabel=getPhaseLabel(runtime);
    const phaseIntensity=getPhaseIntensity(runtime);

    /*
    Horizon anchor begins slightly off screen left.
    */

    const anchorX = -width*0.28;

    /*
    Horizon vertical anchor moves with latitude.
    */

    const anchorY = lerp(height*0.68,height*0.44,north);

    /*
    Planet radius determines curvature strength.
    */

    const planetRadius = width*1.35;

    /*
    East/west tilt gives diagonal sweep.
    */

    const tilt = lerp(-height*0.12,height*0.12,east);

    /*
    Phase shift subtly adjusts horizon height.
    */

    const phaseShift =
      phaseLabel==="LOCKDOWN"
        ? height*0.02
        : phaseLabel==="SEVERE"
        ? height*0.012
        : phaseLabel==="CLEAR_WINDOW"
        ? -height*0.012
        : 0;

    const centerX = anchorX;
    const centerY = anchorY + tilt + phaseShift;

    /*
    Horizon thickness (atmospheric band)
    */

    const bandThickness =
      lerp(height*0.07,height*0.11,north) +
      phaseIntensity*height*0.01;

    return{
      centerX,
      centerY,
      radius:planetRadius,
      bandThickness
    };
  }

  function buildPlanetArc(ctx,width,height,curve){

    const startAngle = Math.PI*0.92;
    const endAngle   = Math.PI*1.42;

    ctx.beginPath();
    ctx.arc(
      curve.centerX,
      curve.centerY,
      curve.radius,
      startAngle,
      endAngle
    );
  }

  function fillAbovePlanet(ctx,width,height,curve,fill){

    ctx.save();

    ctx.beginPath();

    ctx.moveTo(0,0);
    ctx.lineTo(width,0);

    buildPlanetArc(ctx,width,height,curve);

    ctx.closePath();

    ctx.fillStyle=fill;
    ctx.fill();

    ctx.restore();
  }

  function fillBelowPlanet(ctx,width,height,curve,fill){

    ctx.save();

    ctx.beginPath();

    buildPlanetArc(ctx,width,height,curve);

    ctx.lineTo(width,height);
    ctx.lineTo(0,height);

    ctx.closePath();

    ctx.fillStyle=fill;
    ctx.fill();

    ctx.restore();
  }

  /*
  SKY
  */

  function drawSky(ctx,width,height,runtime,curve){

    const phase=getPhaseLabel(runtime);
    const intensity=getPhaseIntensity(runtime);

    const sky=ctx.createLinearGradient(
      0,
      0,
      0,
      height*0.7
    );

    if(phase==="CLEAR_WINDOW"){

      sky.addColorStop(0,"rgba(12,34,74,1)");
      sky.addColorStop(0.25,"rgba(30,90,170,1)");
      sky.addColorStop(0.6,"rgba(110,198,248,1)");
      sky.addColorStop(1,"rgba(214,244,255,1)");

    }else if(phase==="LOCKDOWN"){

      sky.addColorStop(0,"rgba(14,24,46,1)");
      sky.addColorStop(0.3,"rgba(34,64,112,1)");
      sky.addColorStop(0.7,"rgba(120,170,210,1)");
      sky.addColorStop(1,"rgba(188,214,232,1)");

    }else{

      sky.addColorStop(0,"rgba(10,34,74,1)");
      sky.addColorStop(0.3,"rgba(28,96,164,1)");
      sky.addColorStop(0.7,"rgba(72,170,230,1)");
      sky.addColorStop(1,"rgba(188,232,255,1)");

    }

    fillAbovePlanet(ctx,width,height,curve,sky);

    /*
    Upper glow
    */

    const glow=ctx.createRadialGradient(
      width*0.55,
      height*0.25,
      20,
      width*0.55,
      height*0.25,
      width*0.6
    );

    glow.addColorStop(0,"rgba(240,248,255,0.12)");
    glow.addColorStop(1,"rgba(180,220,255,0)");

    fillAbovePlanet(ctx,width,height,curve,glow);
  }

  /*
  OCEAN
  */

  function drawOcean(ctx,width,height,runtime,curve){

    const phase=getPhaseLabel(runtime);
    const intensity=getPhaseIntensity(runtime);

    const ocean=ctx.createLinearGradient(
      0,
      height*0.45,
      width,
      height
    );

    if(phase==="CLEAR_WINDOW"){

      ocean.addColorStop(0,"rgba(26,142,198,1)");
      ocean.addColorStop(0.35,"rgba(18,120,178,1)");
      ocean.addColorStop(0.7,"rgba(12,92,148,1)");
      ocean.addColorStop(1,"rgba(8,64,112,1)");

    }else if(phase==="LOCKDOWN"){

      ocean.addColorStop(0,"rgba(24,110,158,1)");
      ocean.addColorStop(0.35,"rgba(16,88,136,1)");
      ocean.addColorStop(0.7,"rgba(12,68,112,1)");
      ocean.addColorStop(1,"rgba(8,48,90,1)");

    }else{

      ocean.addColorStop(0,"rgba(44,146,188,1)");
      ocean.addColorStop(0.35,"rgba(28,116,166,1)");
      ocean.addColorStop(0.7,"rgba(18,88,138,1)");
      ocean.addColorStop(1,"rgba(12,68,114,1)");

    }

    fillBelowPlanet(ctx,width,height,curve,ocean);
  }

  /*
  HORIZON ATMOSPHERE
  */

  function drawHorizonBand(ctx,width,height,runtime,curve){

    const phase=getPhaseLabel(runtime);

    ctx.save();

    buildPlanetArc(ctx,width,height,curve);

    ctx.lineWidth=curve.bandThickness;
    ctx.strokeStyle=
      phase==="CLEAR_WINDOW"
        ?"rgba(255,240,210,0.18)"
        :"rgba(214,236,255,0.14)";

    ctx.stroke();

    buildPlanetArc(ctx,width,height,curve);

    ctx.lineWidth=Math.max(2,curve.bandThickness*0.15);
    ctx.strokeStyle="rgba(255,255,255,0.22)";

    ctx.stroke();

    ctx.restore();
  }

  /*
  HORIZON BLOOM
  */

  function drawHorizonBloom(ctx,width,height,runtime,curve){

    const bloom=ctx.createRadialGradient(
      width*0.5,
      height*0.55,
      10,
      width*0.5,
      height*0.55,
      width*0.8
    );

    bloom.addColorStop(0,"rgba(255,240,210,0.06)");
    bloom.addColorStop(1,"rgba(120,180,220,0)");

    fillBelowPlanet(ctx,width,height,curve,bloom);
  }

  function draw(ctx,runtimeOrWidth,maybeHeight){

    const runtime=
      typeof runtimeOrWidth==="object"
        ?runtimeOrWidth
        :{width:runtimeOrWidth,height:maybeHeight};

    const width=runtime.width;
    const height=runtime.height;

    if(!Number.isFinite(width)||!Number.isFinite(height)) return;

    const curve=getPlanetCurve(runtime,width,height);

    ctx.save();

    drawSky(ctx,width,height,runtime,curve);
    drawOcean(ctx,width,height,runtime,curve);
    drawHorizonBand(ctx,width,height,runtime,curve);
    drawHorizonBloom(ctx,width,height,runtime,curve);

    ctx.restore();
  }

  return Object.freeze({draw});
}
