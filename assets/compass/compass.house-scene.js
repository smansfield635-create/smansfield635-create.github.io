(()=>{
'use strict';
const scenes=new WeakMap();let primary=null;
const round=(ctx,x,y,w,h,r)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.closePath()};
function mount(canvas,{foreground=()=>true}={}){
  if(!canvas||scenes.has(canvas))return scenes.get(canvas);
  const field=canvas.parentElement;
  if(field){field.style.display='block';field.style.position='relative';field.style.width='100%';field.style.height='100%';field.style.minWidth='0';}
  canvas.style.display='block';canvas.style.width='100%';canvas.style.height='100%';canvas.style.minWidth='0';
  const ctx=canvas.getContext('2d');
  if(!ctx){const api={fallback:true,inspect:()=>({fallback:true})};scenes.set(canvas,api);primary=api;return api}
  canvas.hidden=false;canvas.dataset.houseRenderer='canvas2d-manor-v1';canvas.dataset.houseContract='DGB_COMPASS_MANOR_EXHIBIT_3D_v1';canvas.dataset.houseGeometry='central-hall,two-wings,twin-towers,deep-roofs,projecting-entry,columns,terraces,steps,recessed-windows';canvas.dataset.houseMotion='static-exhibit';
  function poly(points,fill,stroke){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke()}}
  function windowBox(x,y,w,h){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'rgba(102,226,244,.88)');g.addColorStop(.45,'rgba(34,109,130,.72)');g.addColorStop(1,'rgba(5,22,32,.96)');ctx.fillStyle='rgba(202,164,86,.72)';ctx.fillRect(x-2,y-2,w+4,h+4);ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(232,206,142,.62)';ctx.fillRect(x+w*.48,y,1,h);ctx.fillRect(x,y+h*.5,w,1)}
  function draw(){
    const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.max(2,Math.round(r.width*d)),h=Math.max(2,Math.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}ctx.setTransform(d,0,0,d,0,0);const W=r.width,H=r.height;ctx.clearRect(0,0,W,H);
    const cx=W/2,base=H*.78,S=Math.min(W/360,H/210);ctx.save();ctx.translate(cx,base);ctx.scale(S,S);
    const glow=ctx.createRadialGradient(0,-58,10,0,-58,170);glow.addColorStop(0,'rgba(82,190,216,.16)');glow.addColorStop(.55,'rgba(35,101,125,.07)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(-190,-185,380,220);
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(2,7,160,23,0,0,Math.PI*2);ctx.fill();
    poly([[-115,-5],[115,-5],[135,8],[-135,8]],'#171b1d');poly([[-86,-13],[86,-13],[106,-3],[-106,-3]],'#23282a');poly([[-55,-21],[55,-21],[73,-12],[-73,-12]],'#353a3a');
    poly([[-152,-94],[-105,-82],[-105,-22],[-152,-34]],'#102831','rgba(103,195,213,.20)');poly([[105,-82],[152,-94],[152,-34],[105,-22]],'#0b2029','rgba(103,195,213,.18)');
    const wall=ctx.createLinearGradient(-140,-95,140,-20);wall.addColorStop(0,'#193944');wall.addColorStop(.5,'#102832');wall.addColorStop(1,'#0c2029');ctx.fillStyle=wall;ctx.strokeStyle='rgba(158,213,223,.23)';ctx.lineWidth=1;round(ctx,-148,-95,296,72,5);ctx.fill();ctx.stroke();
    const central=ctx.createLinearGradient(-52,-125,62,-28);central.addColorStop(0,'#244956');central.addColorStop(.55,'#16333d');central.addColorStop(1,'#0b2029');ctx.fillStyle=central;round(ctx,-56,-126,112,104,5);ctx.fill();ctx.strokeStyle='rgba(219,185,104,.27)';ctx.stroke();
    for(const sx of [-1,1]){const x=sx*111;ctx.fillStyle=sx<0?'#173641':'#112c36';round(ctx,x-25,-128,50,101,4);ctx.fill();ctx.strokeStyle='rgba(135,205,219,.2)';ctx.stroke();poly([[x-31,-128],[x,-166],[x+31,-128]],sx<0?'#755632':'#5b4127','rgba(226,190,105,.34)');ctx.fillStyle='rgba(209,174,92,.52)';ctx.fillRect(x-2,-166,4,12)}
    poly([[-158,-95],[-88,-95],[-113,-132],[-177,-108]],'#65492c','rgba(231,195,108,.30)');poly([[88,-95],[158,-95],[177,-108],[113,-132]],'#4f3925','rgba(231,195,108,.26)');
    poly([[-65,-126],[65,-126],[0,-177]],'#7b5a31','rgba(242,208,118,.42)');poly([[0,-177],[65,-126],[78,-137],[13,-190]],'#493624');ctx.fillStyle='#b79145';ctx.fillRect(-3,-192,6,18);ctx.fillStyle='rgba(243,222,151,.76)';ctx.beginPath();ctx.arc(0,-196,5,0,Math.PI*2);ctx.fill();
    [-128,-96,-66,66,96,128].forEach(x=>windowBox(x,-74,17,25));[-128,-96,96,128].forEach(x=>windowBox(x,-42,17,17));windowBox(-35,-103,19,27);windowBox(16,-103,19,27);
    ctx.fillStyle='rgba(3,12,18,.95)';round(ctx,-28,-67,56,48,5);ctx.fill();ctx.strokeStyle='rgba(222,187,101,.55)';ctx.lineWidth=3;ctx.stroke();const dg=ctx.createLinearGradient(0,-65,0,-20);dg.addColorStop(0,'#17343d');dg.addColorStop(1,'#07151c');ctx.fillStyle=dg;round(ctx,-18,-60,36,41,3);ctx.fill();ctx.fillStyle='rgba(245,216,127,.9)';ctx.beginPath();ctx.arc(11,-39,2.2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#8a6937';ctx.fillRect(-39,-70,78,5);ctx.fillRect(-35,-67,5,44);ctx.fillRect(30,-67,5,44);ctx.fillStyle='rgba(232,205,131,.55)';ctx.fillRect(-37,-67,1,44);ctx.fillRect(32,-67,1,44);
    ctx.fillStyle='rgba(220,185,99,.42)';ctx.fillRect(-146,-96,292,2);ctx.fillRect(-56,-127,112,2);ctx.fillStyle='rgba(105,205,224,.12)';ctx.fillRect(-145,-23,290,2);
    const fg=ctx.createLinearGradient(-90,0,90,0);fg.addColorStop(0,'rgba(83,201,223,0)');fg.addColorStop(.5,'rgba(83,201,223,.12)');fg.addColorStop(1,'rgba(83,201,223,0)');ctx.fillStyle=fg;ctx.fillRect(-120,-5,240,15);
    ctx.restore();canvas.dataset.houseFrames=String((Number(canvas.dataset.houseFrames)||0)+1)
  }
  draw();new ResizeObserver(draw).observe(canvas);const api={fallback:false,setForeground:on=>{if(on)draw()},inspect:()=>({fallback:false,renderer:'canvas2d-manor-v1',foreground:foreground(),geometry:canvas.dataset.houseGeometry,motion:'static-exhibit'})};scenes.set(canvas,api);primary=api;return api
}
window.CompassHouseScene=Object.freeze({version:'canvas2d-manor-v1',mount,setForeground:on=>primary?.setForeground?.(on),inspect:()=>primary?.inspect?.()||null});
})();
