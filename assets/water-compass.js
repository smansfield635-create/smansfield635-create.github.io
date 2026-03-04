/* =========================================
   WATER COMPASS ENGINE — LAYER 5
   cinematic ripple surface for compass
========================================= */

const waterCanvas = document.createElement("canvas")
waterCanvas.style.position = "fixed"
waterCanvas.style.top = "0"
waterCanvas.style.left = "0"
waterCanvas.style.pointerEvents = "none"

/* layer order
background sky 0
water reflection 1
compass dial 2
dragons 8
buttons 10
*/

waterCanvas.style.zIndex = "1"

document.body.appendChild(waterCanvas)

const wctx = waterCanvas.getContext("2d")

function resizeWater(){
waterCanvas.width = window.innerWidth
waterCanvas.height = window.innerHeight
}

resizeWater()
window.addEventListener("resize",resizeWater)

let ripplePhase = 0

function drawWater(){

wctx.clearRect(0,0,waterCanvas.width,waterCanvas.height)

ripplePhase += 0.015

const cx = window.innerWidth/2
const cy = window.innerHeight/2
const radius = Math.min(window.innerWidth,window.innerHeight)*0.42

/* circular mask (compass face only) */

wctx.save()
wctx.beginPath()
wctx.arc(cx,cy,radius,0,Math.PI*2)
wctx.clip()

/* water base color */

const gradient = wctx.createRadialGradient(
cx,cy,radius*0.2,
cx,cy,radius
)

gradient.addColorStop(0,"rgba(140,30,30,0.45)")
gradient.addColorStop(1,"rgba(60,0,0,0.55)")

wctx.fillStyle = gradient
wctx.fillRect(cx-radius,cy-radius,radius*2,radius*2)

/* ripple lines */

for(let y=-radius; y<radius; y+=6){

let wave =
Math.sin((y*0.03)+ripplePhase)*6

wctx.strokeStyle = "rgba(255,220,180,0.06)"
wctx.lineWidth = 2

wctx.beginPath()
wctx.moveTo(cx-radius, cy+y+wave)
wctx.lineTo(cx+radius, cy+y-wave)
wctx.stroke()

}

/* reflection shimmer */

for(let i=0;i<40;i++){

let rx = cx + Math.sin(i*0.6+ripplePhase)*radius*0.5
let ry = cy + Math.cos(i*0.7+ripplePhase)*radius*0.5

wctx.fillStyle="rgba(255,255,255,0.04)"
wctx.beginPath()
wctx.arc(rx,ry,2,0,Math.PI*2)
wctx.fill()

}

wctx.restore()

requestAnimationFrame(drawWater)

}

drawWater()
