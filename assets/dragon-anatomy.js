/* TNT — /assets/dragon-anatomy.js
   GEODIAMETRICS DRAGON ENGINE — CHINESE DRAGONS (DUAL) v2
   LOCKS
   - Two dragons (top/bottom), mirrored motion family
   - Body width = 135px (90% of 150px Layer-1 diamonds)
   - Bounded random cadence (appear → pass → disappear)
   - Traditional Chinese anatomy: horns, whiskers, beard, mane, ridge, scales
   - No legs
   - dt-based motion, single loop, singleton guard
   - Mounts in #gd-dragon (above plate, below UI)
*/

(function(){
"use strict";

/* =======================
   SINGLETON
======================= */
if (window.__GD_DRAGON_RUNNING__) return;
window.__GD_DRAGON_RUNNING__ = true;

/* =======================
   CONSTANTS
======================= */
const BODY_WIDTH = 135;      // locked by spec
const BASE_RADIUS = BODY_WIDTH/2;

const DPR_CAP = 1.6;

const CFG = {
  segments: 120,
  spacing: 18,
  amplitude: 20,
  laneTop: 0.34,
  laneBottom: 0.66
};

/* cadence bounds */
const PASS_MIN = 10;
const PASS_MAX = 16;

const OFF_MIN  = 4;
const OFF_MAX  = 10;

const STAGGER_MIN = 3;
const STAGGER_MAX = 7;

/* =======================
   CANVAS
======================= */
let canvas = document.getElementById("gd_dragon_canvas");

if(!canvas){
  canvas = document.createElement("canvas");
  canvas.id = "gd_dragon_canvas";
  canvas.style.position="absolute";
  canvas.style.inset="0";
  canvas.style.pointerEvents="none";
  (document.getElementById("gd-dragon")||document.body).appendChild(canvas);
}

const ctx = canvas.getContext("2d",{alpha:true,desynchronized:true});

let W=0,H=0,DPR=1;

function resize(){
  let dpr=window.devicePixelRatio||1;
  DPR=Math.min(DPR_CAP,Math.max(1,dpr));

  W=Math.floor(window.innerWidth*DPR);
  H=Math.floor(window.innerHeight*DPR);

  canvas.width=W;
  canvas.height=H;
}
resize();
window.addEventListener("resize",resize);

/* =======================
   UTIL
======================= */

function rand(a,b){
  return a + Math.random()*(b-a);
}

function clamp(n,a,b){
  return Math.max(a,Math.min(b,n));
}

/* =======================
   DRAGON CLASS
======================= */

class Dragon{

  constructor(top=true){

    this.top = top;

    this.dir = top ? 1 : -1;

    this.color = top ? "jade" : "crimson";

    this.reset();

  }

  reset(){

    this.phase = "off";

    this.timer = rand(OFF_MIN,OFF_MAX);

    this.speed = rand(52,66);

    this.phaseOffset = Math.random()*10;

    this.depth = Math.random();

    this.spawn();

  }

  spawn(){

    this.spine=[];

    let gap = CFG.spacing * DPR;

    for(let i=0;i<CFG.segments;i++){

      let x = this.dir>0
        ? -i*gap
        : W + i*gap;

      this.spine.push({
        x:x,
        y: this.laneY()*H
      });
    }

  }

  laneY(){
    return this.top ? CFG.laneTop : CFG.laneBottom;
  }

  update(dt){

    this.timer -= dt;

    if(this.phase==="off"){
      if(this.timer<=0){
        this.phase="pass";
        this.timer = rand(PASS_MIN,PASS_MAX);
        this.spawn();
      }
      return;
    }

    if(this.phase==="pass"){
      if(this.timer<=0){
        this.phase="off";
        this.timer = rand(OFF_MIN,OFF_MAX);
        return;
      }
    }

    this.move(dt);

  }

  move(dt){

    let head = this.spine[0];

    head.x += this.dir * this.speed * DPR * dt;

    let phase = performance.now()*0.002 + this.phaseOffset;

    let wave = Math.sin(phase)*CFG.amplitude*DPR;

    head.y = this.laneY()*H + wave;

    let target = CFG.spacing * DPR;

    for(let i=1;i<this.spine.length;i++){

      let prev = this.spine[i-1];
      let cur  = this.spine[i];

      let dx = prev.x-cur.x;
      let dy = prev.y-cur.y;

      let dist = Math.hypot(dx,dy)||1;

      cur.x = prev.x - (dx/dist)*target;
      cur.y = prev.y - (dy/dist)*target;

    }

  }

  draw(){

    if(this.phase!=="pass") return;

    const left=[],right=[];

    for(let i=0;i<this.spine.length;i++){

      let p=this.spine[i];

      let r=this.radius(i);

      let n=this.normal(i);

      left.push({
        x:p.x+n.x*r,
        y:p.y+n.y*r
      });

      right.push({
        x:p.x-n.x*r,
        y:p.y-n.y*r
      });

    }

    /* body */

    ctx.beginPath();

    ctx.moveTo(left[0].x,left[0].y);

    for(let p of left) ctx.lineTo(p.x,p.y);

    for(let i=right.length-1;i>=0;i--){
      ctx.lineTo(right[i].x,right[i].y);
    }

    ctx.closePath();

    ctx.fillStyle = this.bodyColor();

    ctx.fill();

    this.drawRidge();
    this.drawScales();
    this.drawHead();

  }

  bodyColor(){

    if(this.color==="jade") return "rgba(0,95,55,0.96)";
    return "rgba(150,20,20,0.96)";

  }

  radius(i){

    let t=i/(this.spine.length-1);

    if(t<0.15) return BASE_RADIUS*1.1;
    if(t<0.6)  return BASE_RADIUS;
    return BASE_RADIUS*(1-t);

  }

  normal(i){

    let p0=this.spine[Math.max(0,i-1)];
    let p1=this.spine[Math.min(this.spine.length-1,i+1)];

    let dx=p1.x-p0.x;
    let dy=p1.y-p0.y;

    let len=Math.hypot(dx,dy)||1;

    dx/=len;
    dy/=len;

    return {x:-dy,y:dx};

  }

  drawRidge(){

    ctx.fillStyle="rgba(0,0,0,0.35)";

    for(let i=8;i<this.spine.length-8;i+=4){

      let p=this.spine[i];
      let n=this.normal(i);
      let r=this.radius(i);

      ctx.beginPath();

      ctx.moveTo(p.x+n.x*r,p.y+n.y*r);

      ctx.lineTo(p.x+n.x*(r+12*DPR),p.y+n.y*(r+12*DPR));

      ctx.lineTo(p.x+n.x*(r*0.5),p.y+n.y*(r*0.5));

      ctx.closePath();

      ctx.fill();

    }

  }

  drawScales(){

    ctx.strokeStyle="rgba(255,255,255,0.08)";
    ctx.lineWidth=1.1*DPR;

    for(let i=10;i<this.spine.length-10;i+=3){

      let p=this.spine[i];
      let r=this.radius(i)*0.5;

      ctx.beginPath();
      ctx.arc(p.x,p.y,r,0.3,1.5);
      ctx.stroke();

    }

  }

  drawHead(){

    let p=this.spine[0];
    let s=this.radius(0)*1.2;

    ctx.fillStyle="rgba(0,0,0,0.45)";

    ctx.beginPath();
    ctx.ellipse(p.x,p.y,s,s*0.6,0,0,Math.PI*2);
    ctx.fill();

    ctx.strokeStyle="rgba(212,175,55,0.7)";
    ctx.lineWidth=2*DPR;

    ctx.beginPath();

    ctx.moveTo(p.x+s,p.y);
    ctx.lineTo(p.x+s*2,p.y-s*0.4);

    ctx.moveTo(p.x+s,p.y);
    ctx.lineTo(p.x+s*2,p.y+s*0.4);

    ctx.stroke();

  }

}

/* =======================
   DRAGONS
======================= */

const dragonTop = new Dragon(true);
const dragonBottom = new Dragon(false);

/* stagger */
dragonBottom.timer += rand(STAGGER_MIN,STAGGER_MAX);

/* =======================
   LOOP
======================= */

let last=0;

function frame(t){

  if(!last) last=t;

  let dt=(t-last)/1000;
  last=t;

  ctx.clearRect(0,0,W,H);

  dragonTop.update(dt);
  dragonBottom.update(dt);

  dragonTop.draw();
  dragonBottom.draw();

  requestAnimationFrame(frame);

}

requestAnimationFrame(frame);

})();
