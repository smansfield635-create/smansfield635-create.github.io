(()=>{
'use strict';
const CONTINUITY='COMPASS_OBJECT_RENDERER_CONTINUITY_v1';
const scenes=new WeakMap();let primary=null;
function mount(canvas,{foreground=()=>true}={}){
  if(!canvas||scenes.has(canvas))return scenes.get(canvas);
  const ctx=canvas.getContext('2d');
  if(!ctx){const api={fallback:true,inspect:()=>({fallback:true,continuity:CONTINUITY})};scenes.set(canvas,api);primary=api;return api}
  canvas.hidden=false;canvas.style.display='block';canvas.style.width='100%';canvas.style.height='100%';canvas.style.filter='brightness(1.18) saturate(1.03) contrast(1.14) drop-shadow(0 22px 24px rgba(0,0,0,.38))';
  Object.assign(canvas.dataset,{houseRenderer:'projected-architectural-geometry-v8-coherent-manor',houseContract:'DGB_COMPASS_MANOR_EXHIBIT_DEPTH_v8',houseGeometry:'projected-3d-volumes,deeper-central-hall,recessed-wings,forward-portico,coherent-two-story-window-grid,no-pavilion-windows,no-side-stacked-windows,hip-roofs,chimneys,cornices,roof-occlusion-pass,terraces,side-planes',houseMotion:'static-exhibit',houseRoofWindows:'none',houseWindowFloors:'two',objectContinuity:CONTINUITY});
  const yaw=.60,pitch=-.15,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),faces=[],roofFaces=[];let W,H,S,CX,B;
  const cam=p=>{const x=p[0]*cy-p[2]*sy,z=p[0]*sy+p[2]*cy,y=p[1]*cp-z*sp,zz=p[1]*sp+z*cp;return[x,y,zz]};
  const proj=p=>{const q=cam(p),k=1/(1+q[2]/820);return[CX+q[0]*S*k,B-q[1]*S*k,q[2]]};
  const push=(target,pts,fill,stroke='rgba(232,205,130,.22)',lw=1)=>{const ps=pts.map(proj);target.push({ps,d:ps.reduce((n,p)=>n+p[2],0)/ps.length,fill,stroke,lw})};
  const queue=(pts,fill,stroke,lw)=>push(faces,pts,fill,stroke,lw);
  const queueRoof=(pts,fill,stroke,lw)=>push(roofFaces,pts,fill,stroke,lw);
  function paint(list){list.sort((a,b)=>b.d-a.d).forEach(f=>{ctx.beginPath();ctx.moveTo(f.ps[0][0],f.ps[0][1]);for(let i=1;i<f.ps.length;i++)ctx.lineTo(f.ps[i][0],f.ps[i][1]);ctx.closePath();ctx.fillStyle=f.fill;ctx.fill();ctx.strokeStyle=f.stroke||'rgba(232,205,130,.22)';ctx.lineWidth=f.lw||1;ctx.stroke()})}
  function box(x1,x2,y1,y2,z1,z2,front='#275967',side='#143944',left='#1b414b',top='#416a70'){
    queue([[x1,y1,z1],[x2,y1,z1],[x2,y2,z1],[x1,y2,z1]],front);queue([[x2,y1,z1],[x2,y1,z2],[x2,y2,z2],[x2,y2,z1]],side);queue([[x1,y1,z2],[x1,y1,z1],[x1,y2,z1],[x1,y2,z2]],left);queue([[x1,y2,z1],[x2,y2,z1],[x2,y2,z2],[x1,y2,z2]],top)
  }
  function hipRoof(x1,x2,y,z1,z2,r,front='#9f7947',side='#62452c'){
    const rl=[x1+(x2-x1)*.28,y+r,(z1+z2)/2],rr=[x2-(x2-x1)*.28,y+r,(z1+z2)/2];
    queueRoof([[x1,y,z1],[x2,y,z1],rr,rl],front,'rgba(244,214,128,.38)',1.15);queueRoof([[x2,y,z1],[x2,y,z2],rr],side);queueRoof([[x2,y,z2],[x1,y,z2],rl,rr],'#493321');queueRoof([[x1,y,z2],[x1,y,z1],rl],'#74502f')
  }
  function poly(pts,fill,stroke='rgba(240,216,150,.48)',lw=1){const p=pts.map(proj);ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}
  function line3(a,b,color='rgba(244,214,128,.35)',lw=1){const p=proj(a),q=proj(b);ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke()}
  function frontWindow(x,y,z,w=13,h=20){poly([[x-w/2,y,z-.9],[x+w/2,y,z-.9],[x+w/2,y+h,z-.9],[x-w/2,y+h,z-.9]],'#b9e4df','rgba(247,220,145,.7)',1.05);line3([x,y,z-1],[x,y+h,z-1],'rgba(26,70,78,.66)',.75);line3([x-w/2,y+h*.52,z-1],[x+w/2,y+h*.52,z-1],'rgba(26,70,78,.66)',.75)}
  function cornice(x1,x2,y,z1,z2){box(x1,x2,y,y+5,z1,z2,'#6f756b','#3d4a48','#495b56','#8b8c76')}
  function column(x,y1,y2,z){box(x-3.5,x+3.5,y1,y2,z-3.5,z+3.5,'#d1c5a4','#8b846f','#a39a81','#e5d8b6')}
  function chimney(x,z,y,h=31){box(x-5,x+5,y,y+h,z-5,z+5,'#8d6847','#533b2d','#674734','#b28a5d')}
  function draw(){
    const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(2,Math.round(r.width*d));canvas.height=Math.max(2,Math.round(r.height*d));ctx.setTransform(d,0,0,d,0,0);W=r.width;H=r.height;S=Math.min(W/470,H/255);CX=W*.50;B=H*.84;ctx.clearRect(0,0,W,H);
    const halo=ctx.createRadialGradient(CX,H*.40,10,CX,H*.43,Math.min(W,H)*.74);halo.addColorStop(0,'rgba(104,214,229,.20)');halo.addColorStop(.58,'rgba(53,124,148,.07)');halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(0,0,0,.42)';ctx.beginPath();ctx.ellipse(CX,H*.82,W*.35,H*.066,-.03,0,Math.PI*2);ctx.fill();faces.length=0;roofFaces.length=0;
    // Stepped estate base establishes foreground depth before the architectural volumes.
    box(-220,220,-6,4,-48,58,'#4d5149','#2b3432','#39403b','#727263');box(-188,188,4,12,-66,45,'#5a5b50','#313937','#434840','#85806c');
    // Central hall is distinctly forward; side wings and end pavilions recede in two stages.
    box(-82,82,12,122,-64,76,'#2e6877','#163f4b','#1f4a55','#4a757b');
    box(-186,-78,12,86,10,88,'#285966','#133844','#1a414a','#3d666d');box(78,186,12,86,10,88,'#24515e','#12343e','#193d47','#396167');
    box(-174,-128,12,91,38,100,'#2b5f6c','#163b46','#1d4650','#426d72');box(128,174,12,91,38,100,'#295965','#143943','#1c444e','#3e686d');
    cornice(-86,86,116,-68,80);cornice(-190,-74,81,6,92);cornice(74,190,81,6,92);cornice(-178,-124,86,34,104);cornice(124,178,86,34,104);
    hipRoof(-88,88,121,-70,82,52,'#a77f4b','#65472e');hipRoof(-194,-70,86,4,94,35,'#916b41','#563b27');hipRoof(70,194,86,4,94,35,'#865f39','#4e3625');hipRoof(-181,-121,91,31,107,29,'#936b40','#593e29');hipRoof(121,181,91,31,107,29,'#865f39','#4e3625');
    chimney(-151,70,91,30);chimney(151,70,91,30);chimney(-52,54,122,28);chimney(54,54,122,28);
    // The portico projects beyond the central hall rather than sitting flush against it.
    box(-58,58,12,22,-100,-56,'#666154','#393e3b','#4a4c45','#8b8572');box(-66,66,22,31,-96,-60,'#7a7260','#454944','#57594f','#9f957c');for(const x of[-44,-15,15,44])column(x,22,72,-88);
    paint(faces);
    // Exactly two coherent facade rows. No pavilion/tower row and no side-plane window layer.
    for(const x of[-45,0,45]){frontWindow(x,68,-65,13,20);frontWindow(x,34,-65,13,18)}
    for(const x of[-151,-111]){frontWindow(x,45,9,12,18);frontWindow(x,18,9,12,16)}
    for(const x of[111,151]){frontWindow(x,45,9,12,18);frontWindow(x,18,9,12,16)}
    // Roofs are repainted after windows as an explicit occlusion boundary.
    paint(roofFaces);
    poly([[-66,72,-98],[66,72,-98],[0,101,-98]],'#8f724d','rgba(244,214,128,.6)',1.4);box(-51,51,70,77,-99,-78,'#6d6655','#444844','#4d5149','#999079');
    poly([[-25,12,-103],[25,12,-103],[25,58,-103],[-25,58,-103]],'#06131a','rgba(247,214,122,.94)',2.2);poly([[-17,12,-104],[17,12,-104],[17,50,-104],[-17,50,-104]],'#173c48','rgba(115,220,237,.34)',1.1);poly([[-16,51,-104],[16,51,-104],[0,65,-104]],'#b89a62','rgba(247,220,145,.66)',1);
    const knob=proj([8,30,-105]);ctx.fillStyle='rgba(255,226,132,.98)';ctx.beginPath();ctx.arc(knob[0],knob[1],2.1,0,Math.PI*2);ctx.fill();
    // Layered front steps and side edges reinforce front-to-back perspective without adding facade clutter.
    for(let i=0;i<5;i++){const inset=i*10,y=9-i*2,z=-112-i*5;line3([-82+inset,y,z],[82-inset,y,z],'rgba(132,220,231,.30)',1.15)}
    line3([-186,12,88],[-174,12,100],'rgba(132,220,231,.20)',1);line3([186,12,88],[174,12,100],'rgba(132,220,231,.20)',1);
    const l=proj([-220,0,-32]),rr=proj([220,0,-32]);ctx.strokeStyle='rgba(126,226,241,.22)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(l[0],l[1]);ctx.lineTo(rr[0],rr[1]);ctx.stroke();canvas.dataset.houseFrames=String((Number(canvas.dataset.houseFrames)||0)+1)
  }
  const orbit=canvas.closest('.compass-capability-orbit'),setForeground=on=>{if(orbit)orbit.dataset.manorForeground=on?'true':'false';if(on)draw()};draw();new ResizeObserver(draw).observe(canvas);
  const api={fallback:false,setForeground,draw,inspect:()=>({fallback:false,renderer:canvas.dataset.houseRenderer,foreground:foreground(),geometry:canvas.dataset.houseGeometry,roofWindows:canvas.dataset.houseRoofWindows,windowFloors:canvas.dataset.houseWindowFloors,motion:'static-exhibit',continuity:CONTINUITY})};scenes.set(canvas,api);primary=api;return api
}
window.CompassHouseScene=Object.freeze({version:'projected-architectural-geometry-v8-coherent-manor',continuity:CONTINUITY,mount,setForeground:on=>primary?.setForeground?.(on),inspect:()=>primary?.inspect?.()||null});
})();