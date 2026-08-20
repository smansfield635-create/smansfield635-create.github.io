(()=>{
'use strict';
const scenes=new WeakMap();let primary=null;
const poly=(ctx,p,fill,stroke)=>{ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke()}};
function installStyle(){if(document.querySelector('[data-manor-focus-style]'))return;const s=document.createElement('style');s.dataset.manorFocusStyle='true';s.textContent='.compass-capability-orbit[data-manor-foreground="true"] .compass-orbit-plaque:not([data-active="true"]){opacity:.035!important;filter:brightness(.22) saturate(.35)!important}.compass-capability-orbit[data-manor-foreground="true"] .compass-orbit-plaque:not([data-active="true"])>*{opacity:.06!important}';document.head.append(s)}
function mount(canvas,{foreground=()=>true}={}){
  if(!canvas||scenes.has(canvas))return scenes.get(canvas);installStyle();
  const field=canvas.parentElement;if(field){field.style.display='block';field.style.position='relative';field.style.width='100%';field.style.height='100%';field.style.minWidth='0'}canvas.style.display='block';canvas.style.width='100%';canvas.style.height='100%';canvas.style.minWidth='0';
  const ctx=canvas.getContext('2d');if(!ctx){const api={fallback:true,inspect:()=>({fallback:true})};scenes.set(canvas,api);primary=api;return api}
  canvas.hidden=false;canvas.dataset.houseRenderer='canvas2d-manor-v2';canvas.dataset.houseContract='DGB_COMPASS_MANOR_EXHIBIT_3D_v2';canvas.dataset.houseGeometry='three-quarter-estate,central-great-hall,projecting-wings,twin-towers,deep-roof-masses,chimneys,recessed-portico,terraces,side-planes';canvas.dataset.houseMotion='static-exhibit';
  const win=(x,y,w,h,skew=0)=>{ctx.save();ctx.translate(x,y);ctx.transform(1,0,skew,1,0,0);const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#b7eef5');g.addColorStop(.34,'#438ea1');g.addColorStop(1,'#07171f');ctx.fillStyle='rgba(185,147,74,.76)';ctx.fillRect(-2,-2,w+4,h+4);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.fillStyle='rgba(238,217,155,.55)';ctx.fillRect(w*.48,0,1,h);ctx.fillRect(0,h*.48,w,1);ctx.restore()};
  function draw(){
    const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.max(2,Math.round(r.width*d)),h=Math.max(2,Math.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}ctx.setTransform(d,0,0,d,0,0);const W=r.width,H=r.height;ctx.clearRect(0,0,W,H);
    const S=Math.min(W/390,H/220),cx=W*.49,base=H*.82;ctx.save();ctx.translate(cx,base);ctx.scale(S,S);
    const halo=ctx.createRadialGradient(15,-74,8,15,-74,180);halo.addColorStop(0,'rgba(94,192,213,.15)');halo.addColorStop(.55,'rgba(45,104,121,.06)');halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.fillRect(-210,-205,420,240);
    ctx.fillStyle='rgba(0,0,0,.42)';ctx.beginPath();ctx.ellipse(10,6,168,21,-.03,0,Math.PI*2);ctx.fill();
    // estate terraces in perspective
    poly(ctx,[[-123,-8],[113,-8],[148,4],[-102,11]],'#171b1d');poly(ctx,[[-98,-17],[95,-17],[121,-8],[-82,-3]],'#252a2b');poly(ctx,[[-61,-25],[62,-25],[82,-18],[-51,-13]],'#383d3b');
    // left wing front + visible side depth
    poly(ctx,[[-156,-98],[-68,-103],[-67,-28],[-149,-23]],'#173641','rgba(146,208,218,.25)');
    poly(ctx,[[-156,-98],[-184,-82],[-179,-31],[-149,-23]],'#0a2029','rgba(100,177,192,.18)');
    // right projecting wing front + strong side plane
    poly(ctx,[[58,-112],[142,-101],[140,-28],[57,-33]],'#102c36','rgba(151,211,220,.23)');
    poly(ctx,[[142,-101],[176,-84],[169,-24],[140,-28]],'#071a23','rgba(91,166,181,.17)');
    // central great hall recessed behind projecting portico
    const hall=ctx.createLinearGradient(-45,-140,65,-35);hall.addColorStop(0,'#284d56');hall.addColorStop(.5,'#17353d');hall.addColorStop(1,'#091e27');ctx.fillStyle=hall;ctx.fillRect(-58,-139,116,109);ctx.strokeStyle='rgba(223,190,108,.30)';ctx.strokeRect(-58,-139,116,109);
    // towers
    for(const q of [{x:-112,w:47,h:118,c:'#1a3a43',roof:'#755632'},{x:107,w:50,h:126,c:'#112f38',roof:'#5b4127'}]){ctx.fillStyle=q.c;ctx.fillRect(q.x-q.w/2,-q.h-27,q.w,q.h);ctx.strokeStyle='rgba(128,202,214,.20)';ctx.strokeRect(q.x-q.w/2,-q.h-27,q.w,q.h);poly(ctx,[[q.x-q.w*.67,-q.h-27],[q.x,-q.h-70],[q.x+q.w*.67,-q.h-27]],q.roof,'rgba(232,197,110,.34)')}
    // roof masses: visibly deep three-quarter planes
    poly(ctx,[[-166,-98],[-66,-103],[-95,-145],[-189,-122]],'#6a4b2a','rgba(235,199,111,.30)');poly(ctx,[[-189,-122],[-95,-145],[-82,-153],[-174,-130]],'#35291f');
    poly(ctx,[[58,-112],[142,-101],[181,-121],[91,-150]],'#5a4026','rgba(235,199,111,.28)');poly(ctx,[[142,-101],[176,-84],[196,-102],[181,-121]],'#30251d');
    poly(ctx,[[-68,-139],[58,-139],[1,-192]],'#7d5a30','rgba(244,211,122,.40)');poly(ctx,[[1,-192],[58,-139],[77,-150],[18,-204]],'#493522');
    // chimneys and lantern
    for(const x of [-135,126]){ctx.fillStyle='#76583b';ctx.fillRect(x,-163,10,31);ctx.fillStyle='#a17b4e';ctx.fillRect(x-2,-166,14,5)}ctx.fillStyle='#b18b43';ctx.fillRect(-3,-206,6,21);ctx.fillStyle='rgba(244,222,153,.82)';ctx.beginPath();ctx.arc(0,-210,5,0,Math.PI*2);ctx.fill();
    // windows: deliberately varied, fewer and larger than suburban grid
    [-145,-112,-79].forEach((x,i)=>win(x,-75+(i%2)*3,17,27,-.04));[-145,-112].forEach(x=>win(x,-43,17,18,-.04));
    [78,108,137].forEach((x,i)=>win(x,-81+i*2,18,28,.05));[82,116,148].forEach((x,i)=>win(x,-47+i*2,17,18,.05));win(-36,-111,20,29);win(16,-113,21,31);
    // recessed grand entrance and portico depth
    ctx.fillStyle='rgba(2,10,15,.96)';ctx.fillRect(-31,-78,62,51);ctx.strokeStyle='rgba(229,194,107,.56)';ctx.lineWidth=2.5;ctx.strokeRect(-31,-78,62,51);
    const dg=ctx.createLinearGradient(0,-76,0,-28);dg.addColorStop(0,'#193941');dg.addColorStop(1,'#06141b');ctx.fillStyle=dg;ctx.fillRect(-17,-70,34,43);ctx.fillStyle='rgba(247,217,124,.92)';ctx.beginPath();ctx.arc(10,-47,2,0,Math.PI*2);ctx.fill();
    poly(ctx,[[-43,-83],[40,-83],[51,-75],[-32,-75]],'#806039','rgba(240,208,126,.35)');ctx.fillStyle='#89673a';ctx.fillRect(-37,-75,6,48);ctx.fillRect(31,-75,6,48);ctx.fillStyle='rgba(235,211,145,.48)';ctx.fillRect(-35,-75,1,48);ctx.fillRect(33,-75,1,48);
    // balustrade + steps
    ctx.strokeStyle='rgba(209,180,105,.45)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-54,-28);ctx.lineTo(58,-28);ctx.stroke();for(let x=-50;x<=54;x+=13){ctx.beginPath();ctx.moveTo(x,-28);ctx.lineTo(x,-21);ctx.stroke()}
    poly(ctx,[[-47,-25],[48,-25],[62,-19],[-39,-18]],'#42413a');poly(ctx,[[-36,-18],[41,-18],[51,-13],[-29,-12]],'#30312e');
    // facade trim and reflected edge light
    ctx.strokeStyle='rgba(222,189,101,.28)';ctx.beginPath();ctx.moveTo(-154,-98);ctx.lineTo(-68,-103);ctx.moveTo(58,-112);ctx.lineTo(142,-101);ctx.stroke();ctx.strokeStyle='rgba(103,205,224,.13)';ctx.beginPath();ctx.moveTo(-180,-31);ctx.lineTo(169,-24);ctx.stroke();
    const fg=ctx.createLinearGradient(-140,0,140,0);fg.addColorStop(0,'rgba(81,194,215,0)');fg.addColorStop(.5,'rgba(81,194,215,.11)');fg.addColorStop(1,'rgba(81,194,215,0)');ctx.fillStyle=fg;ctx.fillRect(-150,-9,300,17);
    ctx.restore();canvas.dataset.houseFrames=String((Number(canvas.dataset.houseFrames)||0)+1)
  }
  const orbit=canvas.closest('.compass-capability-orbit');
  const setForeground=on=>{if(orbit)orbit.dataset.manorForeground=on?'true':'false';if(on)draw()};
  draw();new ResizeObserver(draw).observe(canvas);const api={fallback:false,setForeground,inspect:()=>({fallback:false,renderer:'canvas2d-manor-v2',foreground:foreground(),geometry:canvas.dataset.houseGeometry,motion:'static-exhibit'})};scenes.set(canvas,api);primary=api;return api
}
window.CompassHouseScene=Object.freeze({version:'canvas2d-manor-v2',mount,setForeground:on=>primary?.setForeground?.(on),inspect:()=>primary?.inspect?.()||null});
})();
