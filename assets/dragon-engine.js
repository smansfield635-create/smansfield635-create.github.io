/* TNT — /assets/dragon-engine.js
   BUILD: HEX_SILHOUETTE_PROOF_v5
   GOAL UPDATE:
   - BODY LENGTH: -25% (SPINE_LEN 36 → 27)
   - BODY THICKNESS: ~5× (radius rings scaled ×5)

   CONTROLS
   F → freeze
   E → export raw hex cells
   G → export CGG-256 mask
*/

(function(){
"use strict";
if(window.__HEX_SIL_RUNNING__) return;
window.__HEX_SIL_RUNNING__ = true;

/* ===== PARAMS ===== */

const HEX = 6;                 // 1 hex = 6 px
const SPINE_LEN = 27;          // 36 → 27 (≈ -25%)
const THICK_MUL = 5;           // thickness multiplier (≈ 5×)
const SHOULDER_R = 30;         // max rings
const TAIL_R = 0;
const CGG_SIZE = 16;

const DIRS = [
{q:1,r:0},{q:1,r:-1},{q:0,r:-1},{q:-1,r:0},{q:-1,r:1},{q:0,r:1}
];

function add(a,b){return{q:a.q+b.q,r:a.r+b.r}}
function k(a){return a.q+","+a.r}

/* ===== AXIAL→PIXEL ===== */

function axialToPx(h){
const x=HEX*Math.sqrt(3)*(h.q+h.r/2)
const y=HEX*1.5*h.r
return{x,y}
}

/* ===== HEX DISK ===== */

function disk(center,r){
const out=[]
for(let dq=-r;dq<=r;dq++){
const r1=Math.max(-r,-dq-r)
const r2=Math.min(r,-dq+r)
for(let dr=r1;dr<=r2;dr++){
out.push({q:center.q+dq,r:center.r+dr})
}}
return out
}

/* ===== RNG ===== */

function mulberry32(seed){
let t=seed>>>0
return function(){
t+=0x6D2B79F5
let r=Math.imul(t^(t>>>15),1|t)
r^=r+Math.imul(r^(r>>>7),61|r)
return((r^(r>>>14))>>>0)/4294967296
}
}

/* ===== RADIUS PROFILE (SCALED × THICK_MUL) ===== */

function radiusAt(i){
const u=i/(SPINE_LEN-1)
let r0

if(u<0.10) r0=4
else if(u<0.25) r0=3
else if(u<0.45) r0=6
else if(u<0.65) r0=5
else if(u<0.80) r0=4
else if(u<0.90) r0=2
else if(u<0.97) r0=1
else r0=0

let r=Math.round(r0*THICK_MUL)

r=Math.min(r,SHOULDER_R)
r=Math.max(r,TAIL_R)
return r|0
}

/* ===== CANVAS ===== */

const host=document.getElementById("gd-dragon")||document.body
const cv=document.createElement("canvas")
cv.style.position="absolute"
cv.style.inset="0"
cv.style.width="100%"
cv.style.height="100%"
cv.style.pointerEvents="none"
cv.style.zIndex="6"
cv.style.background="#000"
host.appendChild(cv)

const ctx=cv.getContext("2d",{alpha:true})

let W=0,H=0,DPR=1

function resize(){
let dpr=window.devicePixelRatio||1
DPR=Math.min(1.6,Math.max(1,dpr))
W=Math.floor(innerWidth*DPR)
H=Math.floor(innerHeight*DPR)
cv.width=W
cv.height=H
}
resize()
addEventListener("resize",resize,{passive:true})

/* ===== SPINE ===== */

function initSpine(h,o){
const s=new Array(SPINE_LEN)
s[0]={q:o.q,r:o.r}
const back=(h+3)%6
for(let i=1;i<SPINE_LEN;i++) s[i]=add(s[i-1],DIRS[back])
return s
}

function stepSpine(spine,heading,rnd){
const roll=rnd()
let turn=0
if(roll<0.06) turn=-1
else if(roll>0.94) turn=1
heading=(heading+turn+6)%6
const nh=add(spine[0],DIRS[heading])
for(let i=SPINE_LEN-1;i>=1;i--){
spine[i].q=spine[i-1].q
spine[i].r=spine[i-1].r
}
spine[0]=nh
return heading
}

/* ===== CAPSULE BODY BUILDER ===== */

function buildBody(spine){
const set=new Map()

for(let i=0;i<SPINE_LEN;i++){

const r=radiusAt(i)
const cells=(r>0)?disk(spine[i],r):[spine[i]]

for(const c of cells){
set.set(k(c),c)
}

/* blend with next segment */
if(i<SPINE_LEN-1){
const mid={
q:(spine[i].q+spine[i+1].q)>>1,
r:(spine[i].r+spine[i+1].r)>>1
}
const mrad=Math.max(1,(radiusAt(i)+radiusAt(i+1))>>1)
for(const c of disk(mid,mrad)){
set.set(k(c),c)
}
}

}

return set
}

/* ===== DRAW HEX ===== */

function drawHex(x,y,s){
ctx.beginPath()
for(let i=0;i<6;i++){
const a=(Math.PI/180)*(60*i-30)
const px=x+Math.cos(a)*s
const py=y+Math.sin(a)*s
if(i===0) ctx.moveTo(px,py)
else ctx.lineTo(px,py)
}
ctx.closePath()
}

function renderBody(set,color){
const cx=W*0.5
const cy=H*0.52
ctx.fillStyle=color
const size=HEX*DPR*0.98

for(const h of set.values()){
const p=axialToPx(h)
drawHex(cx+p.x*DPR,cy+p.y*DPR,size)
ctx.fill()
}
}

/* ===== EXPORTS ===== */

function exportRaw(set){
console.log([...set.values()])
}

function exportCGG(set){
const grid=[]
for(let r=0;r<CGG_SIZE;r++){
let row=""
for(let q=0;q<CGG_SIZE;q++){
row+=set.has(q+","+r)?"1":"0"
}
grid.push(row)
}
console.log(grid)
}

/* ===== DRAGONS ===== */

let headingTop=0
let headingBot=3

const rnd=mulberry32(0xC0FFEE)

/* moved closer to center since thickness increased */
let spineTop=initSpine(headingTop,{q:-4,r:-4})
let spineBot=initSpine(headingBot,{q: 4,r: 4})

let freeze=false

addEventListener("keydown",(e)=>{
if(e.key==="f") freeze=!freeze
if(e.key==="e") exportRaw(buildBody(spineTop))
if(e.key==="g") exportCGG(buildBody(spineTop))
})

/* ===== LOOP ===== */

let last=0
let acc=0

function loop(t){

if(!last) last=t
const dt=t-last
last=t
acc+=dt

if(!freeze && acc>=40){
acc=0

headingTop=stepSpine(spineTop,headingTop,rnd)

headingBot=(headingTop+3)%6
const nh=add(spineBot[0],DIRS[headingBot])
for(let i=SPINE_LEN-1;i>=1;i--){
spineBot[i].q=spineBot[i-1].q
spineBot[i].r=spineBot[i-1].r
}
spineBot[0]=nh
}

ctx.clearRect(0,0,W,H)

const bodyTop=buildBody(spineTop)
const bodyBot=buildBody(spineBot)

renderBody(bodyTop,"rgba(20,220,120,0.9)")
renderBody(bodyBot,"rgba(255,60,60,0.9)")

requestAnimationFrame(loop)
}

requestAnimationFrame(loop)

})();
