/* ============================================================
GEODIAMETRICS BACKGROUND ENGINE
FILE: /assets/bg-engine.js
LAYER: ATMOSPHERIC SYSTEM

PURPOSE
• Evening sky gradient
• Single moon with craters
• Moon glow
• Moon reflection in water
• Water ripple inside compass
• Layered cloud depth
• Floating lantern particles

NO DRAGONS HERE
Dragon system is handled by dragon-anatomy.js

PERFORMANCE
• Canvas only
• pointer-events none
• 30fps target
============================================================ */

(function(){

"use strict"

/* ------------------------------------
Canvas
------------------------------------ */

const canvas = document.createElement("canvas")
canvas.style.position="fixed"
canvas.style.top="0"
canvas.style.left="0"
canvas.style.pointerEvents="none"
canvas.style.zIndex="0"

document.body.prepend(canvas)

const ctx = canvas.getContext("2d")

function resize(){
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

resize()
window.addEventListener("resize",resize)

/* ------------------------------------
Moon Phase
------------------------------------ */

const phase = Math.random()

/* ------------------------------------
Cloud Field
------------------------------------ */

const clouds=[]

for(let i=0;i<12;i++){

 clouds.push({

   x:Math.random()*window.innerWidth,
   y:Math.random()*window.innerHeight*0.5,
   size:180+Math.random()*220,
   speed:0.15+Math.random()*0.2,
   depth:Math.random()

 })

}

/* ------------------------------------
Lantern Particles
------------------------------------ */

const lanterns=[]

for(let i=0;i<20;i++){

 lanterns.push({

   x:Math.random()*window.innerWidth,
   y:window.innerHeight + Math.random()*400,
   size:4+Math.random()*6,
   speed:0.25+Math.random()*0.35

 })

}

/* ------------------------------------
Draw Sky
------------------------------------ */

function drawSky(){

 const g = ctx.createLinearGradient(0,0,0,canvas.height)

 g.addColorStop(0,"rgba(200,70,40,0.25)")
 g.addColorStop(.4,"rgba(130,20,20,0.18)")
 g.addColorStop(.7,"rgba(180,50,30,0.15)")
 g.addColorStop(1,"rgba(0,0,0,0.25)")

 ctx.fillStyle=g
 ctx.fillRect(0,0,canvas.width,canvas.height)

}

/* ------------------------------------
Draw Moon
------------------------------------ */

function drawMoon(){

 const x = canvas.width*0.78
 const y = canvas.height*0.18
 const r = 70

 /* glow */

 const glow = ctx.createRadialGradient(x,y,r*.2,x,y,r*3)

 glow.addColorStop(0,"rgba(255,245,210,.95)")
 glow.addColorStop(.5,"rgba(255,220,170,.35)")
 glow.addColorStop(1,"rgba(255,220,170,0)")

 ctx.fillStyle=glow

 ctx.beginPath()
 ctx.arc(x,y,r*3,0,Math.PI*2)
 ctx.fill()

 /* moon body */

 ctx.fillStyle="rgba(255,248,230,.96)"

 ctx.beginPath()
 ctx.arc(x,y,r,0,Math.PI*2)
 ctx.fill()

 /* crater detail */

 ctx.fillStyle="rgba(0,0,0,.25)"

 for(let i=0;i<8;i++){

  let cx=x+(Math.random()*40-20)
  let cy=y+(Math.random()*40-20)
  let cr=6+Math.random()*8

  ctx.beginPath()
  ctx.arc(cx,cy,cr,0,Math.PI*2)
  ctx.fill()

 }

 /* phase */

 ctx.globalCompositeOperation="destination-out"

 ctx.beginPath()

 ctx.arc(
   x+r*(phase*2-1),
   y,
   r,
   0,
   Math.PI*2
 )

 ctx.fill()

 ctx.globalCompositeOperation="source-over"

 drawReflection(x,y,r)

}

/* ------------------------------------
Moon Reflection
------------------------------------ */

function drawReflection(mx,my,r){

 const waterY = canvas.height*.55

 const gradient = ctx.createLinearGradient(
   mx,
   waterY,
   mx,
   waterY + r*3
 )

 gradient.addColorStop(0,"rgba(255,230,180,.25)")
 gradient.addColorStop(1,"rgba(255,230,180,0)")

 ctx.fillStyle=gradient

 ctx.beginPath()

 ctx.ellipse(
   mx,
   waterY + r*.7,
   r*.9,
   r*1.6,
   0,
   0,
   Math.PI*2
 )

 ctx.fill()

}

/* ------------------------------------
Water Ripple (Compass region)
------------------------------------ */

function drawWaterRipple(t){

 const cx = canvas.width*0.5
 const cy = canvas.height*0.5
 const r = Math.min(canvas.width,canvas.height)*0.32

 ctx.save()

 ctx.beginPath()
 ctx.arc(cx,cy,r,0,Math.PI*2)
 ctx.clip()

 ctx.strokeStyle="rgba(255,255,255,.06)"
 ctx.lineWidth=1

 const wave = (t*.001)%1

 for(let i=0;i<6;i++){

  const rr=r*(.25 + i*.12 + wave*.12)

  ctx.beginPath()
  ctx.arc(cx,cy,rr,0,Math.PI*2)
  ctx.stroke()

 }

 ctx.restore()

}

/* ------------------------------------
Cloud Rendering
------------------------------------ */

function drawClouds(){

 clouds.forEach(c=>{

   const alpha=.05 + c.depth*.06

   const g=ctx.createRadialGradient(
     c.x,
     c.y,
     0,
     c.x,
     c.y,
     c.size
   )

   g.addColorStop(0,"rgba(255,240,210,"+alpha+")")
   g.addColorStop(1,"rgba(255,240,210,0)")

   ctx.fillStyle=g

   ctx.beginPath()
   ctx.arc(c.x,c.y,c.size,0,Math.PI*2)
   ctx.fill()

   c.x += c.speed

   if(c.x > canvas.width + c.size){

     c.x = -c.size

   }

 })

}

/* ------------------------------------
Lantern Drift
------------------------------------ */

function drawLanterns(){

 lanterns.forEach(l=>{

   ctx.fillStyle="rgba(255,200,120,0.35)"

   ctx.beginPath()
   ctx.arc(l.x,l.y,l.size,0,Math.PI*2)
   ctx.fill()

   l.y -= l.speed

   if(l.y < -20){

     l.y = canvas.height + 60
     l.x = Math.random()*canvas.width

   }

 })

}

/* ------------------------------------
Main Render Loop
------------------------------------ */

function render(t){

 ctx.clearRect(0,0,canvas.width,canvas.height)

 drawSky()

 drawMoon()

 drawClouds()

 drawLanterns()

 drawWaterRipple(t)

 requestAnimationFrame(render)

}

render()

})()
