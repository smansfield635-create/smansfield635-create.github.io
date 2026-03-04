/* =====================================================
   GEODIAMETRICS DRAGON ENGINE
   SLOW CINEMATIC DRAGON MOTION
   PURPOSE
   • slow dragons
   • large body thickness
   • smooth sine movement
   • clean entry / exit screen
===================================================== */

(function(){

"use strict";

const canvas = document.createElement("canvas")
canvas.style.position = "fixed"
canvas.style.top = "0"
canvas.style.left = "0"
canvas.style.pointerEvents = "none"
canvas.style.zIndex = "6"

document.body.appendChild(canvas)

const ctx = canvas.getContext("2d")

function resize(){
 canvas.width = window.innerWidth
 canvas.height = window.innerHeight
}

resize()
window.addEventListener("resize",resize)

let t = 0

/* ------------------------------
   dragon parameters
------------------------------ */

const LENGTH = 120
const THICKNESS = 42
const SEGMENTS = 90

const spine = []

for(let i=0;i<SEGMENTS;i++){
 spine.push({
   x:-i*20,
   y:window.innerHeight*0.30
 })
}

/* ------------------------------
   update
------------------------------ */

function update(){

 t += 0.008   // SLOW SPEED

 const head = spine[0]

 head.x += 0.45   // slow movement
 head.y = window.innerHeight*0.30 + Math.sin(t)*40

 if(head.x > window.innerWidth + 300){
   head.x = -300
 }

 for(let i=1;i<spine.length;i++){

   const prev = spine[i-1]
   const cur = spine[i]

   const dx = prev.x-cur.x
   const dy = prev.y-cur.y

   const dist = Math.sqrt(dx*dx+dy*dy)

   const spacing = 18

   cur.x = prev.x - dx/dist*spacing
   cur.y = prev.y - dy/dist*spacing

 }

}

/* ------------------------------
   draw dragon body
------------------------------ */

function drawDragon(){

 ctx.fillStyle = "#06341e"
 ctx.strokeStyle = "rgba(212,175,55,0.4)"
 ctx.lineWidth = 1.4

 for(let i=0;i<spine.length;i++){

   const p = spine[i]

   const scale = THICKNESS - i*0.22

   ctx.beginPath()
   ctx.ellipse(p.x,p.y,scale,scale*0.7,0,0,Math.PI*2)
   ctx.fill()
   ctx.stroke()

 }

}

/* ------------------------------
   render
------------------------------ */

function render(){

 ctx.clearRect(0,0,canvas.width,canvas.height)

 update()
 drawDragon()

 requestAnimationFrame(render)

}

render()

})();
