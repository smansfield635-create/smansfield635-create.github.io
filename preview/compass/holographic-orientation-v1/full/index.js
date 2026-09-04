(() => {
  "use strict";

  const root = document.querySelector("[data-holo-root]");
  const canvas = document.querySelector("[data-holo-canvas]");
  const gate = document.querySelector("[data-entry-gate]");
  const card = document.querySelector("[data-entry-card]");
  const beginButton = document.querySelector("[data-begin-orientation]");
  const skipButton = document.querySelector("[data-skip-orientation]");
  const copyStage = document.querySelector("[data-copy-stage]");
  const copyLabel = document.querySelector("[data-copy-label]");
  const copyLine = document.querySelector("[data-copy-line]");
  const progressNode = document.querySelector("[data-progress]");
  const statusNode = document.querySelector("[data-status]");
  const endpoint = document.querySelector("[data-endpoint]");
  const replayButton = document.querySelector("[data-replay]");

  if (![root,canvas,gate,card,beginButton,skipButton,copyStage,copyLabel,copyLine,progressNode,statusNode,endpoint,replayButton].every(Boolean)) {
    throw new Error("HOLOGRAPHIC_FULL_SUCCESSOR_MOUNT_MISSING");
  }

  const D = globalThis.DGB_HOLOGRAPHIC_FULL_DESCRIPTORS;
  if (!D || D.schema !== "COMPASS_HOLOGRAPHIC_DESCRIPTOR_MANIFEST_v1" || D.publicBaseHead !== "8ca9f9fcae3e975993f8c50a4c2524cee0de0f1c") {
    throw new Error("HOLOGRAPHIC_FULL_DESCRIPTOR_AUTHORITY_MISSING");
  }

  const ctx = canvas.getContext("2d", {alpha:true, desynchronized:true});
  if (!ctx) throw new Error("HOLOGRAPHIC_FULL_2D_CONTEXT_UNAVAILABLE");

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const TAU = Math.PI * 2;
  const state = {
    mode:"IDLE", choice:null, gateStart:0, filmStart:0, width:1, height:1, dpr:1,
    frameCount:0, currentPassage:"P1", currentIndex:0, copyPassage:null, cells:[], stars:[],
    compass:null, reducedMotion:reduce.matches, severeRuntimeError:null, endpointShown:false, completed:false,
    mirrorlandPaneSource:"unresolved"
  };

  globalThis.__DGB_HOLOGRAPHIC_FULL_RECEIPT__ = Object.freeze({
    schema:"COMPASS_HOLOGRAPHIC_FULL_SUCCESSOR_RUNTIME_RECEIPT_v1",
    operationId:"COMPASS_MAIN_ORIENTATION_HOLOGRAPHIC_SUCCESSOR_P3_P11_CONSTRUCTION_20260904_001",
    publicBaseHead:D.publicBaseHead,
    masterRafAuthorities:1,
    destinationOwnedSchedulers:0,
    destinationGpuContexts:0,
    destinationRuntimeImports:false,
    cinematicOwnedContextClass:"2d",
    navigationMutation:false,
    historyMutation:false,
    analyticsMutation:false,
    sourceIdentityParity:Object.freeze({
      coheriscopeContinuity:"P5_ASSESSMENT_TO_P6_INSTRUMENT",
      mirrorlandCanonicalPaneCount:21,
      brainProjection:"CANONICAL_PARAMETRIC_MESH_FRONT_PROJECTION",
      houseProjection:"CANONICAL_IDENTITY_FRONT_ELEVATION",
      audraliaScaleModel:"CANONICAL_70_PERCENT_FOOTPRINT",
      trophyProfile:"FULL_COMPONENT_PROFILE_WITH_PLINTH",
      buildResponsiveText:"WRAPPED_HEADLINE_AND_SEGMENTED_SCOPE_LABELS",
      trophyNameplateFit:"FITTED_TWO_LINE_PLAQUE"
    }),
    inspect:() => Object.freeze({
      mode:state.mode, choice:state.choice, frameCount:state.frameCount, currentPassage:state.currentPassage,
      currentIndex:state.currentIndex, reducedMotion:state.reducedMotion, destinationGpuContexts:0,
      destinationOwnedSchedulers:0, masterRafAuthorities:1, severeRuntimeError:state.severeRuntimeError,
      mirrorlandPaneSource:state.mirrorlandPaneSource, completed:state.completed
    })
  });

  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>{const x=clamp(t);return x*x*(3-2*x)};
  const easeOut=t=>1-Math.pow(1-clamp(t),3);

  function fittedFontSize(text,maxWidth,weight,preferred,min,family){
    let size=preferred;
    while(size>min){ctx.font=`${weight} ${size}px ${family}`;if(ctx.measureText(text).width<=maxWidth)return size;size-=.5}
    return min;
  }

  function wrappedText(text,maxWidth,weight,preferred,min,family,maxLines=2){
    for(let size=preferred;size>=min;size-=.5){
      ctx.font=`${weight} ${size}px ${family}`;
      const words=String(text).split(/\s+/),lines=[];let line="";
      for(const word of words){const candidate=line?`${line} ${word}`:word;if(!line||ctx.measureText(candidate).width<=maxWidth){line=candidate}else{lines.push(line);line=word}}
      if(line)lines.push(line);
      if(lines.length<=maxLines)return{size,lines,lineHeight:size*1.08,height:lines.length*size*1.08};
    }
    ctx.font=`${weight} ${min}px ${family}`;
    return{size:min,lines:[String(text)],lineHeight:min*1.08,height:min*1.08};
  }

  function drawBuildScopeLabel(text,x,y,width){
    ctx.textAlign="left";ctx.textBaseline="alphabetic";ctx.font="700 9px system-ui";
    if(ctx.measureText(text).width<=width-18){ctx.fillText(text,x+9,y+20);return}
    const parts=String(text).split(" · "),fontSize=fittedFontSize(parts.reduce((a,b)=>a.length>b.length?a:b,""),width-18,700,8.5,5.5,"system-ui");
    ctx.font=`700 ${fontSize}px system-ui`;
    const lineHeight=fontSize*1.32,startY=y+18;
    parts.slice(0,3).forEach((part,index)=>ctx.fillText(part,x+9,startY+index*lineHeight));
  }

  function drawTrophyNameplate(text,plaque,s){
    const width=(plaque[1]-plaque[0])*s,height=(plaque[3]-plaque[2])*s,centerY=-((plaque[2]+plaque[3])*.5)*s;
    const lines=["DIAMOND GATE BRIDGE","AWARDS TARGET"],preferred=Math.min(8,Math.max(5.5,height*.50));
    let size=preferred;
    for(const line of lines)size=Math.min(size,fittedFontSize(line,width-8,900,size,4.25,"ui-monospace,monospace"));
    ctx.font=`900 ${size}px ui-monospace,monospace`;ctx.textAlign="center";ctx.textBaseline="middle";
    const gap=size*.95;ctx.fillText(lines[0],0,centerY-gap*.5);ctx.fillText(lines[1],0,centerY+gap*.5);
  }

  function randomFactory(seed){
    let value=seed>>>0;
    return()=>{value+=0x6d2b79f5;let r=value;r=Math.imul(r^(r>>>15),r|1);r^=r+Math.imul(r^(r>>>7),r|61);return((r^(r>>>14))>>>0)/4294967296};
  }

  function resizeCanvas(){
    const width=Math.max(320,Math.round(innerWidth||document.documentElement.clientWidth));
    const height=Math.max(480,Math.round(innerHeight||document.documentElement.clientHeight));
    const dpr=Math.min(devicePixelRatio||1,width<700?1.35:1.65);
    state.width=width;state.height=height;state.dpr=dpr;
    canvas.width=Math.max(1,Math.round(width*dpr));
    canvas.height=Math.max(1,Math.round(height*dpr));
    canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);buildStars();projectCompass();
  }

  function buildStars(){
    const random=randomFactory(D.fibonacci.seed^state.width^(state.height<<5));
    const target=Math.round((state.width*state.height)/D.fibonacci.areaDivisor);
    const count=Math.round(clamp(target,D.fibonacci.minimumStars,D.fibonacci.maximumStars));
    state.stars=Array.from({length:count},(_,i)=>{
      const radius=Math.sqrt((i+.5)/count),angle=i*D.fibonacci.goldenAngle+mix(-.07,.07,random());
      return Object.freeze({x:clamp(.5+Math.cos(angle)*radius*.71+mix(-.015,.015,random()),.01,.99)*state.width,y:clamp(.5+Math.sin(angle)*radius*.64+mix(-.015,.015,random()),.01,.99)*state.height,radius:mix(.45,1.5,random()),alpha:mix(.28,.88,random()),color:D.fibonacci.colors[Math.floor(random()*D.fibonacci.colors.length)],rogue:random()<D.fibonacci.rogueRatio});
    });
  }

  function projectCompass(){
    try{
      const authority=globalThis.DGB_UPSTREAM_COMPASS_GEOMETRY;
      if(!authority||typeof authority.createFrontProjectionSchema!=="function")throw new Error("COMPASS_SOURCE_AUTHORITY_UNAVAILABLE");
      const schema=authority.createFrontProjectionSchema({includeIntercardinalTicks:true});
      if(!schema||!Array.isArray(schema.layers)||!schema.layers.length)throw new Error("COMPASS_SOURCE_SCHEMA_INVALID");
      state.compass=schema;
    }catch(error){state.compass=null;state.severeRuntimeError=String(error?.message||error)}
  }

  function clear(){ctx.setTransform(state.dpr,0,0,state.dpr,0,0);ctx.clearRect(0,0,state.width,state.height)}

  function drawStars(alpha,now){
    if(alpha<=0)return;ctx.save();
    for(let i=0;i<state.stars.length;i++){
      const star=state.stars[i],pulse=state.reducedMotion||!star.rogue?1:.86+.14*Math.sin(now*.0012+i*1.37);
      ctx.fillStyle=`rgba(${star.color},${star.alpha*alpha*pulse})`;ctx.beginPath();ctx.arc(star.x,star.y,star.radius,0,TAU);ctx.fill();
    }
    ctx.restore();
  }

  function drawAmbient(alpha){
    const cx=state.width*.5,cy=state.height*.48,r=Math.min(state.width,state.height)*.39;ctx.save();ctx.lineWidth=1;
    for(let i=1;i<=4;i++){ctx.strokeStyle=`rgba(120,220,232,${alpha*(.018+i*.007)})`;ctx.beginPath();ctx.arc(cx,cy,r*(.35+i*.14),0,TAU);ctx.stroke()}
    ctx.strokeStyle=`rgba(232,203,120,${alpha*.05})`;ctx.beginPath();ctx.moveTo(cx-r*1.12,cy);ctx.lineTo(cx+r*1.12,cy);ctx.moveTo(cx,cy-r*1.12);ctx.lineTo(cx,cy+r*1.12);ctx.stroke();ctx.restore();
  }

  function sourceToScreen(x,y,scale=1){const r=Math.min(state.width,state.height)*(state.width<560?.36:.30)*scale;return[state.width*.5+x*r,state.height*.47-y*r]}
  function materialTone(key=""){if(/NORTH|JEWEL/i.test(key))return"rgba(245,216,132,.92)";if(/DIAL|HUB_BASE/i.test(key))return"rgba(177,205,207,.52)";return"rgba(119,222,232,.78)"}

  function drawCompass(alpha,scale=1,rotation=0){
    if(!state.compass||alpha<=0)return;ctx.save();ctx.globalAlpha=alpha;ctx.translate(state.width*.5,state.height*.47);ctx.rotate(rotation);ctx.translate(-state.width*.5,-state.height*.47);
    const R=Math.min(state.width,state.height)*(state.width<560?.36:.30)*scale;
    for(const layer of state.compass.layers){
      ctx.strokeStyle=materialTone(layer.materialKey||layer.material||"");ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=Math.max(1,R*.006);
      if(layer.type==="POLYGON"&&Array.isArray(layer.vertices)&&layer.vertices.length){ctx.beginPath();layer.vertices.forEach((v,i)=>{const p=sourceToScreen(v[0],v[1],scale);i===0?ctx.moveTo(...p):ctx.lineTo(...p)});ctx.closePath();ctx.stroke()}
      else if(layer.type==="CIRCLE"){const p=sourceToScreen(0,0,scale);ctx.beginPath();ctx.arc(p[0],p[1],Math.abs(layer.radius)*R,0,TAU);ctx.stroke()}
      else if(layer.type==="ANNULUS"){const p=sourceToScreen(0,0,scale);for(const rr of[layer.innerRadius,layer.outerRadius]){ctx.beginPath();ctx.arc(p[0],p[1],Math.abs(rr)*R,0,TAU);ctx.stroke()}}
      else if(layer.type==="LINE"&&layer.a&&layer.b){const a=sourceToScreen(layer.a[0],layer.a[1],scale),b=sourceToScreen(layer.b[0],layer.b[1],scale);ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke()}
    }
    ctx.restore();
  }

  function cubic(p0,p1,p2,p3,t){const u=1-t,u2=u*u,t2=t*t;return[u2*u*p0[0]+3*u2*t*p1[0]+3*u*t2*p2[0]+t2*t*p3[0],u2*u*p0[1]+3*u2*t*p1[1]+3*u*t2*p2[1]+t2*t*p3[1]]}
  function heartPoints(){const out=[],h=D.heart;for(let i=0;i<h.perimeterSamples;i++){const q=i/h.perimeterSamples*h.bezierSegments.length,si=Math.min(h.bezierSegments.length-1,Math.floor(q)),t=q-si,s=h.bezierSegments[si],p=cubic(s[0],s[1],s[2],s[3],t);out.push([(p[0]-h.sourceCenter[0])*h.sourceScale,-(p[1]-h.sourceCenter[1])*h.sourceScale])}return out}
  const HEART_POINTS=heartPoints();

  function drawHeart(alpha,progress){
    if(alpha<=0)return;const cx=state.width*.5,cy=state.height*.46,scale=Math.min(state.width,state.height)/640;ctx.save();ctx.translate(cx,cy);ctx.globalAlpha=alpha;
    const rings=state.reducedMotion?4:D.heart.ringScales.length;
    for(let i=rings-1;i>=0;i--){const rs=D.heart.ringScales[Math.min(i,D.heart.ringScales.length-1)];ctx.beginPath();HEART_POINTS.forEach((p,j)=>{const x=p[0]*rs*scale,y=p[1]*rs*scale+(1-rs)*D.heart.shrinkFocus[1]*scale;j===0?ctx.moveTo(x,y):ctx.lineTo(x,y)});ctx.closePath();const a=.10+.55*(1-i/rings);ctx.fillStyle=`rgba(201,20,66,${a})`;ctx.fill();ctx.strokeStyle=`rgba(255,123,151,${.18+.5*(1-i/rings)})`;ctx.lineWidth=1.1;ctx.stroke()}
    if(!state.reducedMotion)ctx.rotate(Math.sin(progress*TAU)*.035);ctx.restore();
  }

  function drawResearch(alpha,progress){
    const w=Math.min(state.width*.72,720),h=Math.min(state.height*.15,112),x=(state.width-w)/2,y=state.height*.28;ctx.save();ctx.globalAlpha=alpha;
    D.research.planes.forEach((p,i)=>{const yy=y+i*(h+14),offset=state.reducedMotion?0:(i-1)*Math.sin(progress*Math.PI)*18;ctx.strokeStyle="rgba(120,221,236,.45)";ctx.fillStyle="rgba(7,26,35,.72)";ctx.beginPath();ctx.roundRect(x+offset,yy,w,h,14);ctx.fill();ctx.stroke();ctx.fillStyle=i===0?D.research.colors.gold:D.research.colors.cyan;ctx.font="800 11px ui-monospace,monospace";ctx.fillText(`${p.tag} · ${p.state}`,x+18+offset,yy+24);ctx.fillStyle="rgba(242,246,239,.92)";ctx.font="600 20px Georgia,serif";ctx.fillText(p.title,x+18+offset,yy+52);ctx.fillStyle="rgba(170,191,194,.76)";ctx.font="500 12px system-ui";ctx.fillText(p.detail,x+18+offset,yy+77)});
    const cy=y+3*(h+14)+24;ctx.strokeStyle="rgba(232,203,120,.42)";ctx.beginPath();ctx.moveTo(x+18,cy);ctx.lineTo(x+w-18,cy);ctx.stroke();D.research.chain.forEach((s,i)=>{const xx=x+18+(w-36)*i/(D.research.chain.length-1);ctx.fillStyle="rgba(232,203,120,.9)";ctx.beginPath();ctx.arc(xx,cy,4,0,TAU);ctx.fill();ctx.fillStyle="rgba(196,215,215,.68)";ctx.font="700 9px ui-monospace,monospace";ctx.fillText(s,xx-18,cy+18)});ctx.restore();
  }

  function drawDiagnostic(alpha,progress){
    const cx=state.width*.5,cy=state.height*.45,w=Math.min(state.width*.74,700);ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle="rgba(141,216,255,.44)";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(cx-w*.46,cy);ctx.lineTo(cx+w*.46,cy);ctx.stroke();
    D.diagnostic.stages.forEach((s,i)=>{const x=cx-w*.38+i*w*.38,active=state.reducedMotion?1:clamp(progress*3-i,0,1);ctx.fillStyle=`rgba(244,207,131,${.25+.65*active})`;ctx.beginPath();ctx.arc(x,cy,10+6*active,0,TAU);ctx.fill();ctx.strokeStyle="rgba(141,216,255,.55)";ctx.beginPath();ctx.arc(x,cy,25,0,TAU);ctx.stroke();ctx.fillStyle="rgba(238,243,239,.85)";ctx.font="800 10px ui-monospace,monospace";ctx.fillText(s.id,x-7,cy+4);ctx.fillStyle="rgba(166,188,193,.72)";ctx.font="700 9px system-ui";ctx.fillText(s.name,x-28,cy+46)});
    const bars=5;for(let i=0;i<bars;i++){const yy=cy+86+i*17;ctx.fillStyle="rgba(173,140,255,.14)";ctx.fillRect(cx-w*.36,yy,w*.72,3);ctx.fillStyle="rgba(167,243,198,.48)";ctx.fillRect(cx-w*.36,yy,w*.72*(.25+.12*i),3)}ctx.restore();
    if(progress>.68)drawBrain(alpha*clamp((progress-.68)/.32,0,1)*.32,0);
  }

  function canonicalBrainPoint(side,row,col){
    const rows=D.brain.rows,cols=D.brain.cols,phi=-Math.PI/2+row/rows*Math.PI,th=-Math.PI/2+col/cols*Math.PI,cp=Math.cos(phi),sp=Math.sin(phi),ct=Math.cos(th);
    const frontal=Math.exp(-Math.pow((th-.72)/.55,2))*Math.exp(-Math.pow(phi/.92,2));
    const temporal=Math.exp(-Math.pow((th-.02)/.82,2))*Math.exp(-Math.pow((phi+.58)/.30,2));
    const parietal=Math.exp(-Math.pow((th+.02)/.72,2))*Math.exp(-Math.pow((phi-.36)/.55,2));
    const primary=.78*Math.sin(th*7.2+phi*5.1),secondary=.42*Math.sin(th*13.4-phi*7.7),tertiary=.24*Math.sin(th*19.7+phi*11.2),quaternary=.13*Math.sin(th*27.3-phi*16.1),cross=.34*Math.sin(th*5.3-phi*9.1)+.18*Math.sin(th*15.2+phi*4.4);
    const fold=primary+secondary+tertiary+quaternary,lr=.70*(.93+.12*temporal+.04*parietal),relief=1+.125*fold+.032*cross;
    const x=side*(.055+lr*cp*ct*relief),y=.075+.69*sp-.050*temporal+.025*parietal+.042*fold*cp;
    return{x,y,frontal,temporal,parietal};
  }

  function brainTone(point){if(point.temporal>.45)return D.brain.palette.temporal;if(point.frontal>.46)return D.brain.palette.frontal;if(point.parietal>.42)return D.brain.palette.parietal;return D.brain.palette.occipital}
  function rgb01(c,a){return`rgba(${Math.round(c[0]*255)},${Math.round(c[1]*255)},${Math.round(c[2]*255)},${a})`}

  function drawBrain(alpha,progress){
    if(alpha<=0)return;const cx=state.width*.5,cy=state.height*.44,s=Math.min(state.width,state.height)*.29,yaw=state.reducedMotion?.18:.18+progress*.18;ctx.save();ctx.globalAlpha=alpha;ctx.translate(cx,cy);ctx.rotate((yaw-.2)*.15);
    for(const side of[-1,1]){
      const outer=[],inner=[];
      for(let r=0;r<=D.brain.rows;r++){let minX=Infinity,maxX=-Infinity,minP=null,maxP=null;for(let c=0;c<=D.brain.cols;c++){const p=canonicalBrainPoint(side,r,c);if(p.x<minX){minX=p.x;minP=p}if(p.x>maxX){maxX=p.x;maxP=p}}outer.push(side<0?minP:maxP);inner.push(side<0?maxP:minP)}
      ctx.beginPath();outer.forEach((p,i)=>{const x=p.x*s,y=-p.y*s;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)});for(let i=inner.length-1;i>=0;i--){const p=inner[i];ctx.lineTo(p.x*s,-p.y*s)}ctx.closePath();ctx.fillStyle=side<0?"rgba(232,111,123,.15)":"rgba(226,93,113,.15)";ctx.fill();ctx.strokeStyle="rgba(255,173,172,.74)";ctx.lineWidth=1.05;ctx.stroke();
      for(let r=2;r<D.brain.rows;r+=3){ctx.beginPath();for(let c=0;c<=D.brain.cols;c++){const p=canonicalBrainPoint(side,r,c),x=p.x*s,y=-p.y*s;c===0?ctx.moveTo(x,y):ctx.lineTo(x,y);if(c===Math.floor(D.brain.cols*.7))ctx.strokeStyle=rgb01(brainTone(p),.30)}ctx.stroke()}
      for(let c=4;c<D.brain.cols;c+=6){ctx.beginPath();for(let r=0;r<=D.brain.rows;r++){const p=canonicalBrainPoint(side,r,c),x=p.x*s,y=-p.y*s;r===0?ctx.moveTo(x,y):ctx.lineTo(x,y)}ctx.strokeStyle="rgba(255,164,164,.20)";ctx.stroke()}
    }
    ctx.strokeStyle="rgba(255,207,194,.38)";ctx.beginPath();ctx.moveTo(0,-s*.72);ctx.lineTo(0,s*.46);ctx.stroke();
    const a=D.brain.appendages;cerebellum(a.cerebellum,D.brain.palette.cerebellum,.30);cerebellum(a.pons,D.brain.palette.stem,.34);
    ctx.strokeStyle=rgb01(D.brain.palette.stem,.60);ctx.fillStyle=rgb01(D.brain.palette.stem,.18);ctx.beginPath();a.brainstem.forEach((ring,i)=>{const y=-ring[0]*s,rx=ring[1]*s;i===0?ctx.moveTo(-rx,y):ctx.lineTo(-rx,y)});for(let i=a.brainstem.length-1;i>=0;i--){const ring=a.brainstem[i],y=-ring[0]*s,rx=ring[1]*s;ctx.lineTo(rx,y)}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    function cerebellum(spec,color,opacity){const[x,y,rx,ry]=spec;ctx.beginPath();ctx.ellipse(x*s,-y*s,rx*s,ry*s,0,0,TAU);ctx.fillStyle=rgb01(color,opacity*.58);ctx.fill();ctx.strokeStyle=rgb01(color,opacity*1.5);ctx.stroke()}
  }

  function pointedArch(x,y,w,h){ctx.beginPath();ctx.moveTo(x-w/2,y+h/2);ctx.lineTo(x-w/2,y-h*.08);ctx.quadraticCurveTo(x-w*.48,y-h*.34,x,y-h/2);ctx.quadraticCurveTo(x+w*.48,y-h*.34,x+w/2,y-h*.08);ctx.lineTo(x+w/2,y+h/2);ctx.closePath()}

  function drawHouse(alpha,progress){
    const cx=state.width*.5,base=state.height*.70,w=Math.min(state.width*.72,740),h=Math.min(state.height*.40,370),top=base-h*.62;ctx.save();ctx.globalAlpha=alpha;ctx.lineWidth=1.15;
    ctx.fillStyle="rgba(62,61,61,.30)";ctx.strokeStyle="rgba(213,231,230,.72)";ctx.fillRect(cx-w*.39,top+h*.22,w*.78,h*.48);ctx.strokeRect(cx-w*.39,top+h*.22,w*.78,h*.48);
    const roofY=top+h*.22;ctx.fillStyle="rgba(38,40,47,.48)";ctx.beginPath();ctx.moveTo(cx-w*.42,roofY);ctx.lineTo(cx-w*.24,top+h*.05);ctx.lineTo(cx,top+h*.16);ctx.lineTo(cx+w*.24,top+h*.05);ctx.lineTo(cx+w*.42,roofY);ctx.closePath();ctx.fill();ctx.stroke();
    for(const tc of D.house.elevation.towerCenters){const x=cx+tc*w,tw=w*.14;ctx.fillStyle="rgba(57,57,60,.38)";ctx.fillRect(x-tw/2,top+h*.16,tw,h*.54);ctx.strokeRect(x-tw/2,top+h*.16,tw,h*.54);ctx.beginPath();ctx.moveTo(x-tw*.60,top+h*.16);ctx.lineTo(x,top-h*.02);ctx.lineTo(x+tw*.60,top+h*.16);ctx.closePath();ctx.fillStyle="rgba(38,40,47,.62)";ctx.fill();ctx.stroke();for(let k=1;k<5;k++){ctx.strokeStyle="rgba(163,181,183,.12)";ctx.beginPath();ctx.moveTo(x-tw*.56,top+h*.16-k*3);ctx.lineTo(x+tw*.56,top+h*.16-k*3);ctx.stroke()}}
    for(const dc of D.house.elevation.dormerCenters){const x=cx+dc*w,y=top+h*.14;pointedArch(x,y,w*.055,h*.17);ctx.fillStyle="rgba(87,164,178,.13)";ctx.fill();ctx.strokeStyle="rgba(143,221,230,.50)";ctx.stroke()}
    for(const fy of D.house.elevation.floorY)for(const wc of D.house.elevation.windowCenters){const x=cx+wc*w,y=top+fy*h;pointedArch(x,y,w*.045,h*.115);ctx.fillStyle="rgba(87,164,178,.12)";ctx.fill();ctx.strokeStyle="rgba(120,220,232,.45)";ctx.stroke()}
    pointedArch(cx,top+h*.55,w*.09,h*.22);ctx.fillStyle="rgba(9,19,24,.62)";ctx.fill();ctx.strokeStyle="rgba(232,203,120,.62)";ctx.stroke();
    ctx.strokeStyle="rgba(193,213,215,.11)";for(let i=1;i<7;i++){const yy=roofY-i*h*.022;ctx.beginPath();ctx.moveTo(cx-w*.34,yy);ctx.lineTo(cx+w*.34,yy);ctx.stroke()}
    const courtY=base+h*.08,cr=w*D.house.elevation.courtRadius;ctx.strokeStyle="rgba(232,203,120,.30)";ctx.beginPath();ctx.ellipse(cx,courtY,cr,cr*.22,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-cr*.7,courtY);ctx.lineTo(cx+cr*.7,courtY);ctx.moveTo(cx,courtY-cr*.18);ctx.lineTo(cx,courtY+cr*.18);ctx.stroke();
    if(progress>.32)drawWindow(alpha*clamp((progress-.32)/.25,0,1),cx,top+h*.47,Math.min(160,w*.22));
    if(progress>.66){ctx.fillStyle="rgba(232,203,120,.88)";ctx.font="900 11px ui-monospace,monospace";ctx.textAlign="center";ctx.fillText("JEEVES · TALK TO THE HOUSE",cx,base+42)}ctx.restore();
  }

  function drawWindow(alpha,cx=state.width*.5,cy=state.height*.45,height=Math.min(state.height*.52,410)){
    const g=globalThis.DGB_MIRRORLAND_WINDOW_GEOMETRY;let source=null;
    if(g&&typeof g.getPanes==="function"){const panes=g.getPanes();if(Array.isArray(panes)&&panes.length===21){source=panes;state.mirrorlandPaneSource="canonical:getPanes"}}
    if(!source&&g&&typeof g.createPanes==="function"){const panes=g.createPanes();if(Array.isArray(panes)&&panes.length===21){source=panes;state.mirrorlandPaneSource="canonical:createPanes"}}
    if(!source){source=D.windowFallback.panes.map(p=>({id:p[0],color:D.windowFallback.colors[p[1]],points:p[2]}));state.mirrorlandPaneSource="descriptor:fallback"}
    if(source.length!==21)throw new Error(`MIRRORLAND_WINDOW_PANE_COUNT_INVALID:${source.length}`);
    const dw=D.windowFallback.designWidth,dh=D.windowFallback.designHeight,scale=height/dh,ox=cx-dw*scale*.5,oy=cy-dh*scale*.5;ctx.save();ctx.globalAlpha=alpha;
    if(g&&typeof g.traceOuterWindow==="function"){ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);g.traceOuterWindow(ctx);ctx.strokeStyle="rgba(213,231,230,.58)";ctx.lineWidth=8;ctx.stroke();ctx.restore()}
    for(const p of source){const pts=p.points||p[2],color=p.color||D.windowFallback.colors[p[1]]||[120,180,210];ctx.beginPath();pts.forEach((q,i)=>{const x=ox+q[0]*scale,y=oy+q[1]*scale;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)});ctx.closePath();ctx.fillStyle=`rgba(${color[0]},${color[1]},${color[2]},.34)`;ctx.fill();ctx.strokeStyle="rgba(28,34,44,.92)";ctx.lineWidth=Math.max(1,scale*5);ctx.stroke()}ctx.restore();
  }

  function drawBuild(alpha,progress){
    const cx=state.width*.5,cy=state.height*.45,w=Math.min(state.width*.74,760),h=Math.min(state.height*.48,390);ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle="rgba(232,203,120,.48)";ctx.fillStyle="rgba(7,17,24,.72)";ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(cx-w/2,cy-h/2,w,h,18);ctx.fill();ctx.stroke();
    const pad=Math.max(12,Math.min(20,w*.07)),top=cy-h/2+pad,innerWidth=w-pad*2;ctx.fillStyle="rgba(232,203,120,.9)";ctx.font="900 10px ui-monospace,monospace";ctx.textAlign="left";ctx.textBaseline="alphabetic";ctx.fillText(D.build.eyebrow,cx-w/2+pad,top+12);
    ctx.fillStyle="rgba(247,242,224,.92)";const headline=wrappedText(D.build.headline,innerWidth,600,state.width<560?20:24,15,"Georgia,serif",2);ctx.font=`600 ${headline.size}px Georgia,serif`;headline.lines.forEach((line,index)=>ctx.fillText(line,cx-w/2+pad,top+44+index*headline.lineHeight));
    const cardsY=top+50+headline.height+18,cardHeight=Math.min(h*.31,122),gap=10,cw=(w-pad*2-gap*2)/3;
    for(let i=0;i<3;i++){const x=cx-w/2+pad+i*(cw+gap);ctx.fillStyle="rgba(120,220,232,.08)";ctx.fillRect(x,cardsY,cw,cardHeight);ctx.strokeStyle="rgba(120,220,232,.28)";ctx.strokeRect(x,cardsY,cw,cardHeight);ctx.fillStyle="rgba(188,211,212,.72)";drawBuildScopeLabel(D.build.scope[i],x,cardsY,cw)}
    const naturalRailY=Math.max(cardsY+cardHeight+18,cy+h*.27),railY=Math.min(naturalRailY,cy+h/2-20);ctx.strokeStyle="rgba(173,140,255,.42)";ctx.beginPath();ctx.moveTo(cx-w*.34,railY);ctx.lineTo(cx+w*.34,railY);ctx.stroke();D.build.rail.forEach((label,i)=>{ctx.fillStyle="rgba(194,162,255,.78)";ctx.font="800 9px ui-monospace,monospace";ctx.textAlign="left";ctx.fillText(label,cx-w*.31+i*w*.31,railY+18)});ctx.restore();
  }

  function scaledAudraliaPoint(point){const a=D.audralia.continentScaleAnchor,k=D.audralia.continentLinearScale;return[a[0]+(point[0]-a[0])*k,a[1]+(point[1]-a[1])*k]}
  function audraliaScreen(point,cx,cy,r){const p=scaledAudraliaPoint(point),nx=(p[0]-D.audralia.continentScaleAnchor[0])/2200,ny=(p[1]-D.audralia.continentScaleAnchor[1])/2350;return[cx+nx*r*.95,cy+ny*r*.88]}
  function traceAudraliaLoop(points,cx,cy,r){ctx.beginPath();points.forEach((p,i)=>{const q=audraliaScreen(p,cx,cy,r);i===0?ctx.moveTo(...q):ctx.lineTo(...q)});ctx.closePath()}

  function drawAudralia(alpha,progress){
    const cx=state.width*.5,cy=state.height*.45,r=Math.min(state.width,state.height)*.27;ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle="rgba(120,220,232,.64)";ctx.fillStyle="rgba(17,52,61,.24)";ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();ctx.stroke();ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.clip();
    traceAudraliaLoop(D.audralia.coastControlPoints,cx,cy,r);ctx.fillStyle="rgba(232,203,120,.18)";ctx.fill();ctx.strokeStyle="rgba(232,203,120,.68)";ctx.stroke();
    traceAudraliaLoop(D.audralia.greatLakeAnchors,cx,cy,r);ctx.fillStyle="rgba(65,162,184,.30)";ctx.fill();ctx.strokeStyle="rgba(120,220,232,.55)";ctx.stroke();
    for(const loop of[...D.audralia.inletIslandAnchors,...D.audralia.offshoreIslandAnchors]){traceAudraliaLoop(loop,cx,cy,r);ctx.fillStyle="rgba(232,203,120,.15)";ctx.fill();ctx.strokeStyle="rgba(232,203,120,.48)";ctx.stroke()}
    for(const point of D.audralia.summitAnchors){const[x,y]=audraliaScreen(point,cx,cy,r);ctx.fillStyle="rgba(242,222,155,.68)";ctx.beginPath();ctx.arc(x,y,1.8,0,TAU);ctx.fill()}
    for(let i=0;i<6;i++){const lat=-.65+i*.26;ctx.strokeStyle="rgba(120,220,232,.10)";ctx.beginPath();ctx.ellipse(cx,cy+lat*r,r*Math.sqrt(1-lat*lat),r*.12,0,0,TAU);ctx.stroke()}ctx.restore();
    if(!state.reducedMotion){ctx.strokeStyle="rgba(232,203,120,.22)";ctx.beginPath();ctx.ellipse(cx,cy,r*1.35,r*.42,progress*.34,0,TAU);ctx.stroke()}ctx.restore();
  }

  function drawSymmetricProfile(profile,s,fill,stroke){ctx.beginPath();profile.forEach((p,i)=>{const x=p[0]*s,y=-p[1]*s;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)});for(let i=profile.length-1;i>=0;i--){const p=profile[i];ctx.lineTo(-p[0]*s,-p[1]*s)}ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.stroke()}

  function drawTrophy(alpha,progress){
    const cx=state.width*.5,cy=state.height*.48,s=Math.min(state.width,state.height)*.28;ctx.save();ctx.globalAlpha=alpha;ctx.translate(cx,cy);ctx.lineWidth=1.35;
    drawSymmetricProfile(D.trophy.cupBody,s,"rgba(120,79,19,.22)","rgba(238,201,101,.78)");
    drawSymmetricProfile(D.trophy.shoulder,s,"rgba(112,73,17,.20)","rgba(222,176,76,.72)");
    drawSymmetricProfile(D.trophy.rim,s,"rgba(150,104,26,.18)","rgba(250,216,112,.88)");
    drawSymmetricProfile(D.trophy.neckCollar,s,"rgba(105,70,19,.18)","rgba(218,173,75,.68)");
    drawSymmetricProfile(D.trophy.stem,s,"rgba(115,79,22,.18)","rgba(238,201,101,.74)");
    drawSymmetricProfile(D.trophy.footUpper,s,"rgba(116,78,20,.20)","rgba(238,201,101,.70)");
    drawSymmetricProfile(D.trophy.footLower,s,"rgba(92,58,14,.24)","rgba(205,157,57,.66)");
    for(const h of D.trophy.handles){ctx.strokeStyle="rgba(238,201,101,.78)";ctx.beginPath();ctx.arc(h.cx*s,-h.cy*s,h.major*s,h.a0,h.a1);ctx.stroke()}
    const p=D.trophy.plinth,crown=p.crown,body=p.body,foot=p.foot,plaque=p.plaque;ctx.fillStyle="rgba(73,49,18,.58)";ctx.strokeStyle="rgba(200,151,55,.58)";ctx.fillRect(crown[0]*s,-crown[3]*s,(crown[1]-crown[0])*s,(crown[3]-crown[2])*s);ctx.strokeRect(crown[0]*s,-crown[3]*s,(crown[1]-crown[0])*s,(crown[3]-crown[2])*s);ctx.fillStyle="rgba(40,29,15,.72)";ctx.fillRect(body[0]*s,-body[3]*s,(body[1]-body[0])*s,(body[3]-body[2])*s);ctx.fillRect(foot[0]*s,-foot[3]*s,(foot[1]-foot[0])*s,(foot[3]-foot[2])*s);ctx.strokeRect(foot[0]*s,-foot[3]*s,(foot[1]-foot[0])*s,(foot[3]-foot[2])*s);
    ctx.fillStyle="rgba(91,61,22,.62)";ctx.strokeStyle="rgba(214,170,67,.62)";ctx.fillRect(plaque[0]*s,-plaque[3]*s,(plaque[1]-plaque[0])*s,(plaque[3]-plaque[2])*s);ctx.strokeRect(plaque[0]*s,-plaque[3]*s,(plaque[1]-plaque[0])*s,(plaque[3]-plaque[2])*s);ctx.fillStyle="rgba(242,222,155,.80)";drawTrophyNameplate(p.nameplate,plaque,s);ctx.restore();
  }

  function sceneAlpha(local,duration){const edge=Math.min(520,duration*.18);return clamp(Math.min(local/edge,(duration-local)/edge,1),0,1)}
  function locatePassage(elapsed){const t=clamp(elapsed,0,D.masterDurationMs);for(let i=0;i<D.timeline.length;i++){const p=D.timeline[i];if(t<p.endMs||i===D.timeline.length-1)return{passage:p,index:i,local:t-p.startMs,duration:p.endMs-p.startMs}}return{passage:D.timeline[D.timeline.length-1],index:D.timeline.length-1,local:0,duration:1}}
  function updateCopy(passage){if(state.copyPassage===passage.passage)return;state.copyPassage=passage.passage;copyLabel.textContent=passage.label;copyLine.textContent=passage.copy;copyStage.hidden=false}

  function drawPassage(index,local,duration,now){
    const p=D.timeline[index],progress=clamp(local/duration),a=state.reducedMotion?1:sceneAlpha(local,duration);drawStars(index===0?1:.34,now);drawAmbient(.8);
    switch(p.passage){case"P1":drawStars(.86,now);break;case"P2":drawCompass(a,.92,state.reducedMotion?0:(progress-.5)*.025);break;case"P3":drawHeart(a,progress);break;case"P4":drawResearch(a,progress);break;case"P5":drawDiagnostic(a,progress);break;case"P6":drawBrain(a,progress);break;case"P7":drawHouse(a,progress);break;case"P8":drawBuild(a,progress);break;case"P9":drawAudralia(a,progress);break;case"P10":drawTrophy(a,progress);break;case"P11":drawCompass(a,1+progress*.05,0);break}
  }

  function buildTessellation(button,choice){
    const rect=button.getBoundingClientRect(),size=clamp(rect.height*.32,13,21),sx=size*.90,sy=size*.72,cols=Math.ceil(rect.width/sx)+2,rows=Math.ceil(rect.height/sy)+2,random=randomFactory((choice==="BEGIN"?0x0b17e17:0x5a1f)^Math.round(rect.width*19)^Math.round(rect.height*37)),cells=[];
    for(let row=-1;row<rows;row++)for(let col=-1;col<cols;col++){const x=rect.left+col*sx+(row%2?sx*.5:0),y=rect.top+row*sy;if(x<rect.left-size||x>rect.right+size||y<rect.top-size||y>rect.bottom+size)continue;const star=state.stars[Math.floor(random()*state.stars.length)]||{x:state.width*.5,y:state.height*.5},angle=random()*TAU,r=Math.min(state.width,state.height)*mix(.08,.34,random()),compassTarget={x:state.width*.5+Math.cos(angle)*r,y:state.height*.47+Math.sin(angle)*r},target=choice==="SKIP"||random()<.62?compassTarget:star;cells.push({x,y,targetX:target.x,targetY:target.y,size:size*mix(.75,1.08,random()),delay:random()*.28,spin:mix(-1.2,1.2,random()),gold:random()<.32})}state.cells=cells;
  }

  function drawCell(cell,x,y,size,alpha,rot){const half=size*.5,rise=size*.28;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.globalAlpha=alpha;ctx.beginPath();ctx.moveTo(0,-rise);ctx.lineTo(half,0);ctx.lineTo(0,rise);ctx.lineTo(-half,0);ctx.closePath();ctx.fillStyle=cell.gold?"rgba(255,234,165,.90)":"rgba(208,238,239,.86)";ctx.fill();ctx.restore()}

  function drawGateAnimation(now){
    const elapsed=now-state.gateStart,duration=state.choice==="SKIP"?2450:4350,progress=clamp(elapsed/duration);drawStars(.10+.72*progress,now);drawAmbient(progress);
    for(const cell of state.cells){const t=clamp((progress-cell.delay)/(1-cell.delay)),q=state.reducedMotion?smooth(t):easeOut(t),x=mix(cell.x,cell.targetX,q),y=mix(cell.y,cell.targetY,q),size=cell.size*mix(1,.24,q),a=1-q*.76;drawCell(cell,x,y,size,a,cell.spin*q)}
    const comp=clamp((progress-.46)/.44);drawCompass(comp,.84+.16*comp,0);card.style.opacity=String(clamp(1-progress*2.1));
    if(progress>=1){gate.hidden=true;card.style.opacity="1";state.cells=[];if(state.choice==="SKIP"){state.mode="SETTLED";state.currentPassage="P11";state.currentIndex=10;copyStage.hidden=true;drawCompass(1,1.05,0);endpoint.classList.add("is-shown");endpoint.setAttribute("aria-hidden","false");state.endpointShown=true;state.completed=true;statusNode.textContent="skip · compass handoff"}else{state.mode="PLAYING";state.filmStart=now;copyStage.hidden=false;statusNode.textContent="playing · code-native holographic successor"}}
  }

  function completeFilm(){state.mode="SETTLED";state.completed=true;state.currentPassage="P11";state.currentIndex=10;copyStage.hidden=true;endpoint.classList.add("is-shown");endpoint.setAttribute("aria-hidden","false");state.endpointShown=true;statusNode.textContent="complete · compass handoff";clear();drawStars(.28,performance.now());drawAmbient(1);drawCompass(1,1.05,0)}
  function reset(){state.mode="IDLE";state.choice=null;state.gateStart=0;state.filmStart=0;state.currentPassage="P1";state.currentIndex=0;state.copyPassage=null;state.cells=[];state.completed=false;state.endpointShown=false;gate.hidden=false;copyStage.hidden=true;endpoint.classList.remove("is-shown");endpoint.setAttribute("aria-hidden","true");progressNode.style.transform="scaleX(0)";card.style.opacity="1";statusNode.textContent="removable successor · code-native";clear();drawStars(.08,performance.now());drawAmbient(.7)}
  function choose(button,choice){if(state.mode!=="IDLE")return;state.mode="GATE";state.choice=choice;state.gateStart=performance.now();buildTessellation(button,choice);statusNode.textContent=choice==="BEGIN"?"entry tessellation · begin":"entry tessellation · skip"}

  function frame(now){
    state.frameCount+=1;
    try{
      if(state.mode==="IDLE"){clear();drawStars(.08,now);drawAmbient(.7)}
      else if(state.mode==="GATE"){clear();drawGateAnimation(now)}
      else if(state.mode==="PLAYING"){const elapsed=now-state.filmStart;if(elapsed>=D.masterDurationMs){completeFilm()}else{clear();const located=locatePassage(elapsed);state.currentPassage=located.passage.passage;state.currentIndex=located.index;updateCopy(located.passage);drawPassage(located.index,located.local,located.duration,now);progressNode.style.transform=`scaleX(${clamp(elapsed/D.masterDurationMs)})`}}
    }catch(error){state.severeRuntimeError=String(error?.message||error);state.mode="SETTLED";statusNode.textContent="preview held · runtime error";copyStage.hidden=true;clear();drawStars(.22,now);drawCompass(1,1,0)}
    requestAnimationFrame(frame);
  }

  beginButton.addEventListener("click",()=>choose(beginButton,"BEGIN"));
  skipButton.addEventListener("click",()=>choose(skipButton,"SKIP"));
  replayButton.addEventListener("click",reset);
  addEventListener("resize",resizeCanvas,{passive:true});
  reduce.addEventListener?.("change",event=>{state.reducedMotion=event.matches});

  resizeCanvas();reset();frame(performance.now());
})();
