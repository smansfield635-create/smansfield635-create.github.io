/* =====================================================
   GEODIAMETRICS MOON PHASE + WATER REFLECTION ENGINE
   LAYER 12
   PURPOSE
   • single moon only
   • randomized phase each page load
   • cinematic glow
   • reflection on water layer
   • remove "double moon" artifact
===================================================== */

(function(){

"use strict";

/* --------------------------------------
   Canvas
-------------------------------------- */

const moonCanvas = document.createElement("canvas")
moonCanvas.style.position = "fixed"
moonCanvas.style.top = "0"
moonCanvas.style.left = "0"
moonCanvas.style.pointerEvents = "none"

/* behind dragons but above background */
moonCanvas.style.zIndex = "3"

document.body.appendChild(moonCanvas)

const ctx = moonCanvas.getContext("2d")

function resize(){
 moonCanvas.width = window.innerWidth
 moonCanvas.height = window.innerHeight
}

resize()
window.addEventListener("resize",resize)

/* --------------------------------------
   Moon Phase Generator
-------------------------------------- */

let phase = Math.random()

function drawMoon(){

 const x = window.innerWidth * 0.78
 const y = window.innerHeight * 0.18

 const r = 70

 ctx.save()

 /* moon glow */

 let g = ctx.createRadialGradient(x,y,r*0.2,x,y,r*2)

 g.addColorStop(0,"rgba(255,245,210,0.95)")
 g.addColorStop(0.4,"rgba(255,230,170,0.6)")
 g.addColorStop(1,"rgba(255,230,170,0)")

 ctx.fillStyle = g

 ctx.beginPath()
 ctx.arc(x,y,r*2,0,Math.PI*2)
 ctx.fill()

 /* moon body */

 ctx.fillStyle = "rgba(255,248,230,0.95)"

 ctx.beginPath()
 ctx.arc(x,y,r,0,Math.PI*2)
 ctx.fill()

 /* craters */

 ctx.fillStyle = "rgba(210,210,210,0.35)"

 for(let i=0;i<5;i++){

   let cx = x + Math.random()*30-15
   let cy = y + Math.random()*30-15
   let cr = 6 + Math.random()*6

   ctx.beginPath()
   ctx.arc(cx,cy,cr,0,Math.PI*2)
   ctx.fill()

 }

 /* phase shadow */

 ctx.globalCompositeOperation = "destination-out"

 ctx.beginPath()

 ctx.arc(
   x + r * (phase*2-1),
   y,
   r,
   0,
   Math.PI*2
 )

 ctx.fill()

 ctx.globalCompositeOperation = "source-over"

 ctx.restore()

 drawReflection(x,y,r)

}

/* --------------------------------------
   Water Reflection
-------------------------------------- */

function drawReflection(mx,my,r){

 const waterY = window.innerHeight*0.45

 const reflectionHeight = r*2.5

 const gradient = ctx.createLinearGradient(0,waterY,0,waterY+reflectionHeight)

 gradient.addColorStop(0,"rgba(255,235,180,0.35)")
 gradient.addColorStop(1,"rgba(255,235,180,0)")

 ctx.fillStyle = gradient

 ctx.beginPath()
 ctx.ellipse(mx,waterY+reflectionHeight*0.25,r*0.9,reflectionHeight*0.5,0,0,Math.PI*2)
 ctx.fill()

}

/* --------------------------------------
   Render Loop
-------------------------------------- */

function render(){

 ctx.clearRect(0,0,moonCanvas.width,moonCanvas.height)

 drawMoon()

 requestAnimationFrame(render)

}

render()

})();
