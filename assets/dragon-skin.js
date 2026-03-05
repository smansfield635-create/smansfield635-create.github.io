/* TNT — /assets/dragon-skin.js
   BUILD: DRAGON_SKIN_ITERATE_v1
   PURPOSE: UNLOCKED dragon visuals (iterate here).
   RULE: Change this file most often. dragon-core.js stays locked.
*/
(function(){
"use strict";
window.DRAGON_SKIN = {
  version:"DRAGON_SKIN_ITERATE_v1",

  draw(ctx, frame, style){
    const DC=window.DRAGON_CORE;
    const pal=DC ? DC.palette[style.lane] : null;
    if(!pal) return;

    const spine=frame.spine, tArr=frame.t, nArr=frame.n, rad=frame.rad;

    // HEAD (iterate this section)
    const P=spine[0];
    const t=tArr[0]||{x:1,y:0};
    const n=nArr[0]||{x:0,y:-1};

    const neckIdx=Math.min(3,rad.length-1);
    const shoulderIdx=Math.min(6,rad.length-1);
    const rShoulder=Math.max(rad[neckIdx]||20, rad[shoulderIdx]||20);
    const Whead=Math.min(2.6*(2*rShoulder), 0.22*Math.min(frame.meta.W,frame.meta.H));

    const skullR=0.55*Whead;
    const snout =0.95*Whead;
    const back  =0.55*Whead;
    const jaw   =0.55*Whead;

    const nose={x:P.x+t.x*snout,y:P.y+t.y*snout};
    const jawL={x:P.x-t.x*back+n.x*jaw,y:P.y-t.y*back+n.y*jaw};
    const jawR={x:P.x-t.x*back-n.x*jaw,y:P.y-t.y*back-n.y*jaw};

    // skull
    ctx.fillStyle=pal.skull;
    ctx.beginPath();
    ctx.ellipse(P.x,P.y,skullR,skullR*0.78,0,0,Math.PI*2);
    ctx.fill();

    // snout
    ctx.fillStyle=pal.head;
    ctx.beginPath();
    ctx.moveTo(nose.x,nose.y);
    ctx.lineTo(jawL.x,jawL.y);
    ctx.lineTo(jawR.x,jawR.y);
    ctx.closePath();
    try{ ctx.fill("evenodd"); }catch(e){ ctx.fill(); }

    // horns
    ctx.fillStyle="rgba(0,0,0,0.60)";
    const crown={x:P.x-t.x*(0.10*Whead),y:P.y-t.y*(0.10*Whead)};
    const hornLen=0.90*Whead, hornOff=0.55*Whead;
    const hbL={x:crown.x-t.x*(0.05*Whead)+n.x*hornOff,y:crown.y-t.y*(0.05*Whead)+n.y*hornOff};
    const hbR={x:crown.x-t.x*(0.05*Whead)-n.x*hornOff,y:crown.y-t.y*(0.05*Whead)-n.y*hornOff};
    const htL={x:hbL.x+t.x*hornLen+n.x*(0.18*Whead),y:hbL.y+t.y*hornLen+n.y*(0.18*Whead)};
    const htR={x:hbR.x+t.x*hornLen-n.x*(0.18*Whead),y:hbR.y+t.y*hornLen-n.y*(0.18*Whead)};

    ctx.beginPath(); ctx.moveTo(hbL.x,hbL.y); ctx.lineTo(htL.x,htL.y); ctx.lineTo(crown.x,crown.y); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hbR.x,hbR.y); ctx.lineTo(htR.x,htR.y); ctx.lineTo(crown.x,crown.y); ctx.closePath(); ctx.fill();

    // whiskers
    ctx.strokeStyle="rgba(0,0,0,0.55)";
    ctx.lineWidth=Math.max(1,1.6*frame.meta.DPR);
    function whisk(side,lift){
      const s=side;
      const root={x:P.x+t.x*(0.42*Whead)+n.x*(s*0.42*Whead),y:P.y+t.y*(0.42*Whead)+n.y*(s*0.42*Whead)};
      const mid ={x:root.x+t.x*(0.55*Whead)+n.x*(s*lift*0.55*Whead),y:root.y+t.y*(0.55*Whead)+n.y*(s*lift*0.55*Whead)};
      const end ={x:root.x+t.x*(1.05*Whead)+n.x*(s*lift*0.95*Whead),y:root.y+t.y*(1.05*Whead)+n.y*(s*lift*0.95*Whead)};
      ctx.beginPath(); ctx.moveTo(root.x,root.y); ctx.quadraticCurveTo(mid.x,mid.y,end.x,end.y); ctx.stroke();
    }
    whisk(+1,+1); whisk(+1,-1); whisk(-1,+1); whisk(-1,-1);

    // eye
    ctx.fillStyle="rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(P.x+t.x*(0.25*Whead)+n.x*(0.12*Whead), P.y+t.y*(0.25*Whead)+n.y*(0.12*Whead), Math.max(2,0.06*Whead), 0, Math.PI*2);
    ctx.fill();
  }
};
})();
