(()=>{
'use strict';
const CONTINUITY='COMPASS_OBJECT_RENDERER_CONTINUITY_v1';
const scenes=new WeakMap();let primary=null;
function mount(canvas,{foreground=()=>true}={}){
  if(!canvas||scenes.has(canvas))return scenes.get(canvas);
  const ctx=canvas.getContext('2d');
  if(!ctx){const api={fallback:true,inspect:()=>({fallback:true,continuity:CONTINUITY})};scenes.set(canvas,api);primary=api;return api}
  canvas.hidden=false;canvas.style.display='block';canvas.style.width='100%';canvas.style.height='100%';canvas.style.filter='brightness(1.18) saturate(1.03) contrast(1.14) drop-shadow(0 22px 24px rgba(0,0,0,.38))';
  Object.assign(canvas.dataset,{houseRenderer:'projected-architectural-geometry-v6-final-depth',houseContract:'DGB_COMPASS_MANOR_EXHIBIT_DEPTH_v7',houseGeometry:'projected-3d-volumes,deeper-central-hall,recessed-wings,forward-portico,pavilions,hip-roofs,chimneys,cornices,reduced-wall-windows,roof-occlusion-pass,terraces,side-planes',houseMotion:'static-exhibit',houseRoofWindows:'none',objectContinuity:CONTINUITY});
  const yaw=.54,pitch=-.15,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),faces=[],roofFaces=[];let W,H,S,CX,B;
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
  function sideWindow(x,y,z,w=12,h=18){poly([[x-.9,y,z-w/2],[x-.9,y,z+w/2],[x-.9,y+h,z+w/2],[x-.9,y+h,z-w/2]],'#8fc7c7','rgba(232,205,130,.55)',.9)}
  function cornice(x1,x2,y,z1,z2){box(x1,x2,y,y+5,z1,z2,'#6f756b','#3d4a48','#495b56','#8b8c76')}
  function column(x,y1,y2,z){box(x-3.5,x+3.5,y1,y2,z-3.5,z+3.5,'#d1c5a4','#8b846f','#a39a81','#e5d8b6')}
  function chimney(x,z,y,h=31){box(x-5,x+5,y,y+h,z-5,z+5,'#8d6847','#533b2d','#674734','#b28a5d')}
  function draw(){
    const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(2,Math.round(r.width*d));canvas.height=Math.max(2,Math.round(r.height*d));ctx.setTransform(d,0,0,d,0,0);W=r.width;H=r.height;S=Math.min(W/470,H/255);CX=W*.50;B=H*.84;ctx.clearRect(0,0,W,H);
    const halo=ctx.createRadialGradient(CX,H*.40,10,CX,H*.43,Math.min(W,H)*.74);halo.addColorStop(0,'rgba(104,214,229,.20)');halo.addColorStop(.58,'rgba(53,124,148,.07)');halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(0,0,0,.42)';ctx.beginPath();ctx.ellipse(CX,H*.82,W*.35,H*.066,-.03,0,Math.PI*2);ctx.fill();faces.length=0;roofFaces.length=0;
    box(-215,215,-6,4,-40,52,'#4d5149','#2b3432','#39403b','#727263');box(-184,184,4,12,-56,39,'#5a5b50','#313937','#434840','#85806c');
    box(-78,78,12,126,-48,78,'#2e6877','#163f4b','#1f4a55','#4a757b');
    box(-186,-75,12,89,6,82,'#285966','#133844','#1a414a','#3d666d');box(75,186,12,95,1,88,'#24515e','#12343e','#193d47','#396167');
    box(-166,-116,12,119,34,92,'#2b5f6c','#163b46','#1d4650','#426d72');box(118,168,12,124,36,96,'#295965','#143943','#1c444e','#3e686d');
    cornice(-82,82,119,-52,82);cornice(-190,-71,84,2,86);cornice(71,190,90,-3,92);cornice(-169,-113,113,30,96);cornice(115,171,118,32,100);
    hipRoof(-84,84,124,-54,84,50,'#a77f4b','#65472e');hipRoof(-193,-68,89,0,90,35,'#916b41','#563b27');hipRoof(68,193,95,-6,96,38,'#865f39','#4e3625');hipRoof(-172,-110,118,27,100,32,'#936b40','#593e29');hipRoof(112,174,124,29,104,34,'#865f39','#4e3625');
    chimney(-149,62,119,30);chimney(151,67,124,32);chimney(-50,52,125,28);chimney(53,54,125,28);
    box(-54,54,12,22,-82,-43,'#666154','#393e3b','#4a4c45','#8b8572');box(-62,62,22,31,-78,-46,'#7a7260','#454944','#57594f','#9f957c');for(const x of[-41,-14,14,41])column(x,22,70,-70);
    paint(faces);
    // Reduced facade windows: fewer, lower, and clearly separated from the eaves.
    for(const x of[-43,0,43]){frontWindow(x,70,-49,13,20);frontWindow(x,38,-49,13,18)}
    for(const x of[-151,-111]){frontWindow(x,43,5,12,18);frontWindow(x,18,5,12,16)}
    for(const x of[110,151]){frontWindow(x,46,0,12,18);frontWindow(x,20,0,12,16)}
    frontWindow(-141,64,33,11,19);frontWindow(143,67,35,11,19);sideWindow(78,48,16,12,18);sideWindow(186,43,31,12,17);
    // Repaint all roof polygons after windows. This is the occlusion pass that prevents any wall window from projecting over a roof plane.
    paint(roofFaces);
    poly([[-62,70,-79],[62,70,-79],[0,96,-79]],'#8f724d','rgba(244,214,128,.6)',1.4);box(-48,48,70,76,-80,-65,'#6d6655','#444844','#4d5149','#999079');
    poly([[-25,12,-84],[25,12,-84],[25,58,-84],[-25,58,-84]],'#06131a','rgba(247,214,122,.94)',2.2);poly([[-17,12,-85],[17,12,-85],[17,50,-85],[-17,50,-85]],'#173c48','rgba(115,220,237,.34)',1.1);poly([[-16,51,-85],[16,51,-85],[0,65,-85]],'#b89a62','rgba(247,220,145,.66)',1);
    const knob=proj([8,30,-86]);ctx.fillStyle='rgba(255,226,132,.98)';ctx.beginPath();ctx.arc(knob[0],knob[1],2.1,0,Math.PI*2);ctx.fill();
    for(let i=0;i<4;i++){const inset=i*10,y=9-i*2;line3([-74+inset,y,-91-i*5],[74-inset,y,-91-i*5],'rgba(132,220,231,.30)',1.15)}
    const l=proj([-215,0,-25]),rr=proj([215,0,-25]);ctx.strokeStyle='rgba(126,226,241,.22)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(l[0],l[1]);ctx.lineTo(rr[0],rr[1]);ctx.stroke();canvas.dataset.houseFrames=String((Number(canvas.dataset.houseFrames)||0)+1)
  }
  const orbit=canvas.closest('.compass-capability-orbit'),setForeground=on=>{if(orbit)orbit.dataset.manorForeground=on?'true':'false';if(on)draw()};draw();new ResizeObserver(draw).observe(canvas);
  const api={fallback:false,setForeground,draw,inspect:()=>({fallback:false,renderer:canvas.dataset.houseRenderer,foreground:foreground(),geometry:canvas.dataset.houseGeometry,roofWindows:canvas.dataset.houseRoofWindows,motion:'static-exhibit',continuity:CONTINUITY})};scenes.set(canvas,api);primary=api;return api
}
window.CompassHouseScene=Object.freeze({version:'projected-architectural-geometry-v6-final-depth-continuity',continuity:CONTINUITY,mount,setForeground:on=>primary?.setForeground?.(on),inspect:()=>primary?.inspect?.()||null});
})();