(()=>{
'use strict';

const CONTINUITY='COMPASS_OBJECT_RENDERER_CONTINUITY_v1';
const scenes=new WeakMap();let primary=null;

function mount(canvas,{foreground=()=>true}={}){
  if(!canvas||scenes.has(canvas))return scenes.get(canvas);
  const ctx=canvas.getContext('2d');
  if(!ctx){const api={fallback:true,inspect:()=>({fallback:true,continuity:CONTINUITY})};scenes.set(canvas,api);primary=api;return api}
  canvas.hidden=false;canvas.style.display='block';canvas.style.width='100%';canvas.style.height='100%';canvas.style.filter='brightness(1.16) saturate(1.04) contrast(1.12) drop-shadow(0 20px 22px rgba(0,0,0,.34))';
  Object.assign(canvas.dataset,{houseRenderer:'projected-architectural-geometry-v6',houseContract:'DGB_COMPASS_MANOR_EXHIBIT_DEPTH_v6',houseGeometry:'projected-3d-volumes,central-hall,flanking-wings,pavilions,hip-roofs,chimneys,portico,pediment,columns,cornices,recessed-windows,terraces,side-planes',houseMotion:'static-exhibit',houseRoofWindows:'none',objectContinuity:CONTINUITY});

  const yaw=.46,pitch=-.13,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),faces=[];let W,H,S,CX,B;
  const cam=p=>{const x=p[0]*cy-p[2]*sy,z=p[0]*sy+p[2]*cy,y=p[1]*cp-z*sp,zz=p[1]*sp+z*cp;return[x,y,zz]};
  const proj=p=>{const q=cam(p),k=1/(1+q[2]/900);return[CX+q[0]*S*k,B-q[1]*S*k,q[2]]};
  const queue=(pts,fill,stroke='rgba(232,205,130,.22)',lw=1)=>{const ps=pts.map(proj);faces.push({ps,d:ps.reduce((n,p)=>n+p[2],0)/ps.length,fill,stroke,lw})};
  function box(x1,x2,y1,y2,z1,z2,front='#275967',side='#143944',left='#1b414b',top='#416a70'){
    queue([[x1,y1,z1],[x2,y1,z1],[x2,y2,z1],[x1,y2,z1]],front);
    queue([[x2,y1,z1],[x2,y1,z2],[x2,y2,z2],[x2,y2,z1]],side);
    queue([[x1,y1,z2],[x1,y1,z1],[x1,y2,z1],[x1,y2,z2]],left);
    queue([[x1,y2,z1],[x2,y2,z1],[x2,y2,z2],[x1,y2,z2]],top);
  }
  function hipRoof(x1,x2,y,z1,z2,r,front='#9f7947',side='#62452c'){
    const ridgeL=[x1+(x2-x1)*.28,y+r,(z1+z2)/2],ridgeR=[x2-(x2-x1)*.28,y+r,(z1+z2)/2];
    queue([[x1,y,z1],[x2,y,z1],ridgeR,ridgeL],front,'rgba(244,214,128,.34)');
    queue([[x2,y,z1],[x2,y,z2],ridgeR],side);
    queue([[x2,y,z2],[x1,y,z2],ridgeL,ridgeR],'#493321');
    queue([[x1,y,z2],[x1,y,z1],ridgeL],'#74502f');
  }
  function chimney(x,z,y,h=31){box(x-5,x+5,y,y+h,z-5,z+5,'#8d6847','#533b2d','#674734','#b28a5d')}
  function poly(pts,fill,stroke='rgba(240,216,150,.48)',lw=1){const p=pts.map(proj);ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}
  function line3(a,b,color='rgba(244,214,128,.35)',lw=1){const p=proj(a),q=proj(b);ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke()}
  function frontWindow(x,y,z,w=13,h=21){
    poly([[x-w/2,y,z-.8],[x+w/2,y,z-.8],[x+w/2,y+h,z-.8],[x-w/2,y+h,z-.8]],'#bde9e4','rgba(247,220,145,.72)',1.15);
    line3([x,y,z-1],[x,y+h,z-1],'rgba(26,70,78,.68)',.8);line3([x-w/2,y+h*.52,z-1],[x+w/2,y+h*.52,z-1],'rgba(26,70,78,.68)',.8)
  }
  function sideWindow(x,y,z,w=13,h=21){
    poly([[x-.8,y,z-w/2],[x-.8,y,z+w/2],[x-.8,y+h,z+w/2],[x-.8,y+h,z-w/2]],'#8fc9c9','rgba(232,205,130,.58)',1);
  }
  function cornice(x1,x2,y,z1,z2){box(x1,x2,y,y+5,z1,z2,'#6f756b','#3d4a48','#495b56','#8b8c76')}
  function column(x,y1,y2,z){box(x-3.3,x+3.3,y1,y2,z-3.3,z+3.3,'#d1c5a4','#8b846f','#a39a81','#e5d8b6')}

  function draw(){
    const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(2,Math.round(r.width*d));canvas.height=Math.max(2,Math.round(r.height*d));ctx.setTransform(d,0,0,d,0,0);W=r.width;H=r.height;S=Math.min(W/455,H/250);CX=W*.50;B=H*.84;ctx.clearRect(0,0,W,H);
    const halo=ctx.createRadialGradient(CX,H*.42,10,CX,H*.44,Math.min(W,H)*.72);halo.addColorStop(0,'rgba(104,214,229,.18)');halo.addColorStop(.58,'rgba(53,124,148,.07)');halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(0,0,0,.40)';ctx.beginPath();ctx.ellipse(CX,H*.82,W*.34,H*.066,-.03,0,Math.PI*2);ctx.fill();
    faces.length=0;

    // Ground plinth / terraces.
    box(-205,205,-5,4,-38,48,'#4d5149','#2b3432','#39403b','#727263');
    box(-176,176,4,11,-49,36,'#5a5b50','#313937','#434840','#85806c');

    // Main manor masses.
    box(-73,73,11,124,-32,66,'#2c6372','#173d49','#1e4651','#456f75');
    box(-178,-70,11,91,-9,66,'#275865','#143743','#1b414a','#3b646a');
    box(70,178,11,97,-15,72,'#24515e','#12343e','#193d47','#396167');
    box(-157,-113,11,124,24,72,'#2a5d69','#163b45','#1c4650','#416c70');
    box(116,160,11,129,26,76,'#285864','#143841','#1c434d','#3d666b');

    // Cornices define wall/roof boundary; windows never exceed them.
    cornice(-76,76,118,-35,69);cornice(-182,-67,86,-12,70);cornice(67,182,92,-18,77);cornice(-160,-110,118,21,75);cornice(113,163,123,23,79);

    // Roofs: intentionally window-free.
    hipRoof(-79,79,123,-37,71,46,'#a27b49','#63462d');
    hipRoof(-185,-64,91,-13,74,34,'#8e693f','#563b27');
    hipRoof(64,185,97,-20,80,37,'#835f39','#4d3625');
    hipRoof(-164,-106,123,18,78,31,'#8f693e','#583d28');
    hipRoof(109,167,129,20,82,33,'#825e38','#4b3525');

    // Chimneys sit on roof masses, not windows.
    chimney(-144,47,123,30);chimney(143,51,129,32);chimney(-46,37,124,27);chimney(49,39,124,27);

    // Portico and pediment.
    box(-49,49,11,20,-65,-31,'#625f53','#373d3a','#494b44','#8a8471');
    box(-58,58,20,28,-61,-34,'#77705f','#454943','#55584f','#9b9279');
    for(const x of[-38,-13,13,38])column(x,20,68,-54);
    poly([[-57,68,-58],[57,68,-58],[0,91,-58]],'#8d724d','rgba(244,214,128,.55)',1.3);
    box(-45,45,68,73,-59,-47,'#6d6655','#444844','#4d5149','#999079');

    // Render all architectural faces back-to-front.
    faces.sort((a,b)=>b.d-a.d).forEach(f=>{ctx.beginPath();ctx.moveTo(f.ps[0][0],f.ps[0][1]);for(let i=1;i<f.ps.length;i++)ctx.lineTo(f.ps[i][0],f.ps[i][1]);ctx.closePath();ctx.fillStyle=f.fill;ctx.fill();ctx.strokeStyle=f.stroke;ctx.lineWidth=f.lw;ctx.stroke()});

    // Main block windows, strictly beneath eaves.
    for(const x of[-48,-18,18,48]){frontWindow(x,75,-33,12,20);frontWindow(x,43,-33,12,19)}
    // Left wing and right wing windows.
    for(const x of[-158,-128,-96]){frontWindow(x,49,-10,12,19);frontWindow(x,20,-10,12,17)}
    for(const x of[94,126,158]){frontWindow(x,52,-16,12,19);frontWindow(x,22,-16,12,17)}
    // Pavilion/tower windows remain on wall plane below cornice.
    frontWindow(-135,82,23,11,21);frontWindow(-135,48,23,11,19);frontWindow(138,85,25,11,21);frontWindow(138,51,25,11,19);
    // A few visible side-plane windows to reinforce depth.
    sideWindow(72,49,7,13,18);sideWindow(72,76,7,13,19);sideWindow(178,47,25,13,18);

    // Central door and transom.
    poly([[-24,11,-66],[24,11,-66],[24,56,-66],[-24,56,-66]],'#06131a','rgba(247,214,122,.92)',2.2);
    poly([[-16,11,-67],[16,11,-67],[16,49,-67],[-16,49,-67]],'#173c48','rgba(115,220,237,.34)',1.1);
    poly([[-15,50,-67],[15,50,-67],[0,63,-67]],'#b89a62','rgba(247,220,145,.66)',1);
    const knob=proj([8,29,-68]);ctx.fillStyle='rgba(255,226,132,.98)';ctx.beginPath();ctx.arc(knob[0],knob[1],2.1,0,Math.PI*2);ctx.fill();

    // Front steps and terrace edge.
    for(let i=0;i<3;i++){const inset=i*10,y=8-i*2;line3([-67+inset,y,-71-i*5],[67-inset,y,-71-i*5],'rgba(132,220,231,.28)',1.2)}
    const terraceL=proj([-205,0,-20]),terraceR=proj([205,0,-20]);ctx.strokeStyle='rgba(126,226,241,.20)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(terraceL[0],terraceL[1]);ctx.lineTo(terraceR[0],terraceR[1]);ctx.stroke();
    canvas.dataset.houseFrames=String((Number(canvas.dataset.houseFrames)||0)+1)
  }

  const orbit=canvas.closest('.compass-capability-orbit'),setForeground=on=>{if(orbit)orbit.dataset.manorForeground=on?'true':'false';if(on)draw()};draw();new ResizeObserver(draw).observe(canvas);
  const api={fallback:false,setForeground,draw,inspect:()=>({fallback:false,renderer:canvas.dataset.houseRenderer,foreground:foreground(),geometry:canvas.dataset.houseGeometry,roofWindows:canvas.dataset.houseRoofWindows,motion:'static-exhibit',continuity:CONTINUITY})};scenes.set(canvas,api);primary=api;return api;
}
window.CompassHouseScene=Object.freeze({version:'projected-architectural-geometry-v6-continuity',continuity:CONTINUITY,mount,setForeground:on=>primary?.setForeground?.(on),inspect:()=>primary?.inspect?.()||null});
})();