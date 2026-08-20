(()=>{
'use strict';
const scenes=new WeakMap();let primary=null;
function mount(canvas,{foreground=()=>true}={}){
  if(!canvas||scenes.has(canvas))return scenes.get(canvas);
  const ctx=canvas.getContext('2d');
  if(!ctx){const api={fallback:true,inspect:()=>({fallback:true})};scenes.set(canvas,api);primary=api;return api}
  canvas.hidden=false;canvas.style.display='block';canvas.dataset.brainRenderer='canvas2d-cortical-exhibit-v3';canvas.dataset.brainContract='COMPASS_COHERISCOPE_CORTICAL_EXHIBIT_v3';canvas.dataset.brainMaterial='ROSE_FLESH_ORGANIC_GYRI_V4';canvas.dataset.brainMotion='static-exhibit';
  const path=(pts)=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const p=pts[i];if(p.length===2)ctx.lineTo(p[0],p[1]);else ctx.bezierCurveTo(...p)}ctx.closePath()};
  function cortex(cx,cy,rx,ry,side){
    const s=side;
    ctx.save();
    const g=ctx.createRadialGradient(cx-s*rx*.28,cy-ry*.42,rx*.08,cx+s*rx*.08,cy+ry*.05,rx*1.12);
    g.addColorStop(0,'#f7c3ba');g.addColorStop(.18,'#e69392');g.addColorStop(.47,'#bd6570');g.addColorStop(.74,'#7b3948');g.addColorStop(1,'#32151f');ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(cx+s*rx*.04,cy-ry*.86);
    ctx.bezierCurveTo(cx+s*rx*.18,cy-ry*1.04,cx+s*rx*.52,cy-ry*1.03,cx+s*rx*.72,cy-ry*.82);
    ctx.bezierCurveTo(cx+s*rx*.98,cy-ry*.68,cx+s*rx*1.07,cy-ry*.31,cx+s*rx*.96,cy-ry*.02);
    ctx.bezierCurveTo(cx+s*rx*1.03,cy+ry*.23,cx+s*rx*.83,cy+ry*.53,cx+s*rx*.59,cy+ry*.66);
    ctx.bezierCurveTo(cx+s*rx*.43,cy+ry*.86,cx+s*rx*.17,cy+ry*.83,cx+s*rx*.07,cy+ry*.64);
    ctx.bezierCurveTo(cx-s*rx*.015,cy+ry*.40,cx-s*rx*.03,cy+.05*ry,cx+s*rx*.015,cy-ry*.20);
    ctx.bezierCurveTo(cx+s*rx*.03,cy-ry*.47,cx-s*rx*.01,cy-ry*.72,cx+s*rx*.04,cy-ry*.86);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,226,218,.26)';ctx.lineWidth=1.15;ctx.stroke();
    ctx.clip();
    const shadow=ctx.createLinearGradient(cx-s*rx*.95,cy,cx+s*rx*.25,cy);shadow.addColorStop(0,'rgba(27,5,13,.34)');shadow.addColorStop(.48,'rgba(77,26,40,.04)');shadow.addColorStop(1,'rgba(255,223,213,.12)');ctx.fillStyle=shadow;ctx.fillRect(cx-rx*1.2,cy-ry*1.2,rx*2.4,ry*2.4);
    const fissures=[
      [.14,-.61,.36,-.78,.62,-.65,.72,-.43], [.09,-.40,.30,-.53,.55,-.44,.78,-.24],
      [.10,-.16,.31,-.30,.49,-.18,.74,-.04], [.11,.08,.30,-.04,.58,.05,.76,.21],
      [.12,.31,.31,.17,.48,.34,.66,.43], [.20,.51,.37,.39,.49,.51,.57,.64],
      [.38,-.72,.49,-.53,.43,-.37,.55,-.23], [.55,-.39,.43,-.20,.55,-.01,.44,.14],
      [.34,-.08,.47,.10,.36,.29,.48,.47]
    ];
    fissures.forEach((q,i)=>{ctx.beginPath();ctx.moveTo(cx+s*rx*q[0],cy+ry*q[1]);ctx.bezierCurveTo(cx+s*rx*q[2],cy+ry*q[3],cx+s*rx*q[4],cy+ry*q[5],cx+s*rx*q[6],cy+ry*q[7]);ctx.strokeStyle=i%3===0?'rgba(45,10,24,.82)':'rgba(67,19,34,.63)';ctx.lineWidth=i%3===0?2.15:1.55;ctx.lineCap='round';ctx.stroke();ctx.strokeStyle='rgba(255,211,205,.10)';ctx.lineWidth=.75;ctx.translate(0,-1);ctx.stroke();ctx.translate(0,1)});
    const ridges=[[.18,-.70,.31,-.61,.42,-.65],[.17,-.28,.31,-.18,.41,-.23],[.20,.18,.33,.25,.45,.18],[.36,.43,.46,.48,.55,.42],[.52,-.58,.61,-.51,.70,-.56]];
    ridges.forEach(q=>{ctx.beginPath();ctx.moveTo(cx+s*rx*q[0],cy+ry*q[1]);ctx.quadraticCurveTo(cx+s*rx*q[2],cy+ry*q[3],cx+s*rx*q[4],cy+ry*q[5]);ctx.strokeStyle='rgba(255,207,201,.17)';ctx.lineWidth=2.2;ctx.stroke()});
    ctx.restore();
  }
  function draw(){
    const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.max(2,Math.round(r.width*d)),h=Math.max(2,Math.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}ctx.setTransform(d,0,0,d,0,0);const W=r.width,H=r.height;ctx.clearRect(0,0,W,H);
    const cx=W/2,cy=H*.43,rx=Math.min(W*.245,H*.31),ry=rx*.80;
    const halo=ctx.createRadialGradient(cx,cy,rx*.18,cx,cy,rx*2.15);halo.addColorStop(0,'rgba(228,131,139,.15)');halo.addColorStop(.55,'rgba(70,173,201,.055)');halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
    ctx.save();ctx.shadowColor='rgba(13,2,7,.68)';ctx.shadowBlur=28;ctx.fillStyle='rgba(16,3,8,.40)';ctx.beginPath();ctx.ellipse(cx,cy+ry*.19,rx*1.88,ry*1.06,0,0,Math.PI*2);ctx.fill();ctx.restore();
    cortex(cx-rx*.015,cy-rx*.035,rx,ry,-1);cortex(cx+rx*.015,cy,rx*.975,ry*1.015,1);
    const fiss=ctx.createLinearGradient(cx-8,0,cx+8,0);fiss.addColorStop(0,'rgba(47,12,25,0)');fiss.addColorStop(.42,'rgba(16,2,8,.91)');fiss.addColorStop(.58,'rgba(16,2,8,.91)');fiss.addColorStop(1,'rgba(47,12,25,0)');ctx.fillStyle=fiss;ctx.fillRect(cx-rx*.067,cy-ry*.79,rx*.134,ry*1.42);
    const temporal=ctx.createRadialGradient(cx+rx*.22,cy+ry*.40,2,cx+rx*.22,cy+ry*.40,rx*.58);temporal.addColorStop(0,'rgba(218,112,123,.38)');temporal.addColorStop(1,'rgba(80,27,41,0)');ctx.fillStyle=temporal;ctx.beginPath();ctx.ellipse(cx+rx*.18,cy+ry*.42,rx*.56,ry*.34,.07,0,Math.PI*2);ctx.fill();
    const cg=ctx.createRadialGradient(cx-rx*.13,cy+ry*.80,2,cx,cy+ry*.82,rx*.58);cg.addColorStop(0,'#c76a72');cg.addColorStop(.58,'#803b48');cg.addColorStop(1,'#2c1119');ctx.fillStyle=cg;ctx.beginPath();ctx.ellipse(cx-rx*.02,cy+ry*.82,rx*.57,ry*.24,-.05,0,Math.PI*2);ctx.fill();
    for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(cx-rx*.43,cy+ry*(.82+i*.022));ctx.bezierCurveTo(cx-rx*.16,cy+ry*(.78+i*.015),cx+rx*.16,cy+ry*(.89+i*.015),cx+rx*.42,cy+ry*(.82+i*.022));ctx.strokeStyle='rgba(43,10,21,.56)';ctx.lineWidth=1.15;ctx.stroke()}
    const sg=ctx.createLinearGradient(cx-rx*.10,0,cx+rx*.10,0);sg.addColorStop(0,'#5a2735');sg.addColorStop(.48,'#bd666f');sg.addColorStop(1,'#45202b');ctx.fillStyle=sg;ctx.beginPath();ctx.moveTo(cx-rx*.095,cy+ry*.65);ctx.bezierCurveTo(cx-rx*.12,cy+ry*.84,cx-rx*.07,cy+ry*1.10,cx-rx*.04,cy+ry*1.30);ctx.lineTo(cx+rx*.04,cy+ry*1.30);ctx.bezierCurveTo(cx+rx*.07,cy+ry*1.10,cx+rx*.12,cy+ry*.84,cx+rx*.095,cy+ry*.65);ctx.closePath();ctx.fill();
    const rim=ctx.createLinearGradient(cx-rx*1.1,cy,cx+rx*1.1,cy);rim.addColorStop(0,'rgba(111,219,236,.16)');rim.addColorStop(.42,'rgba(0,0,0,0)');rim.addColorStop(.72,'rgba(255,211,198,.08)');rim.addColorStop(1,'rgba(111,219,236,.12)');ctx.strokeStyle=rim;ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(cx,cy,rx*1.97,ry*1.02,0,0,Math.PI*2);ctx.stroke();
    canvas.dataset.brainFrames=String((Number(canvas.dataset.brainFrames)||0)+1)
  }
  draw();new ResizeObserver(draw).observe(canvas);
  const api={canvas,fallback:false,capture:()=>null,restore:()=>false,draw,inspect:()=>({fallback:false,renderer:'canvas2d-cortical-exhibit-v3',foreground:foreground(),material:'ROSE_FLESH_ORGANIC_GYRI_V4',anatomy:'ASYMMETRIC_CORTEX_NARROW_FISSURE_TEMPORAL_MASS_CEREBELLUM_BRAINSTEM',motion:'static-exhibit'})};scenes.set(canvas,api);primary=api;return api
}
const publicApi=Object.freeze({version:'canvas2d-cortical-exhibit-v3',brainMaterial:'ROSE_FLESH_ORGANIC_GYRI_V4',mount,capture:()=>null,restore:()=>false,inspect:()=>primary?.inspect?.()||null});Object.defineProperty(globalThis,'CompassBrainScene',{configurable:false,enumerable:true,get:()=>publicApi,set:()=>{}});
})();
