/* =====================================================
   GEODIAMETRICS LANTERN DRIFT ENGINE — LAYER 9

   PURPOSE
   - Mid-Autumn lanterns drifting upward
   - Gentle horizontal sway (wind)
   - Soft glow + subtle pulse
   - No violent motion; no jitter

   Z-ORDER INTENT
   - should sit ABOVE water layer (so reflections feel alive)
   - should sit BELOW dragons (dragons = foreground mythic)
   - should sit BELOW gem buttons (UI remains crisp)

   PERFORMANCE
   - one canvas
   - ~18–28 lanterns
   - constant time per frame
===================================================== */

(function(){

"use strict"

/* ----------------------------------------------------
   Canvas
---------------------------------------------------- */

const lanternCanvas = document.createElement("canvas")

lanternCanvas.style.position = "fixed"
lanternCanvas.style.top = "0"
lanternCanvas.style.left = "0"
lanternCanvas.style.pointerEvents = "none"

/* IMPORTANT:
   - Layer 8 water uses zIndex = 7
   - Put lanterns above water: 8
   - Dragons should be higher than this layer
*/
lanternCanvas.style.zIndex = "8"

document.body.appendChild(lanternCanvas)

const ctx = lanternCanvas.getContext("2d")

function resize(){
  lanternCanvas.width = window.innerWidth
  lanternCanvas.height = window.innerHeight
}
resize()
window.addEventListener("resize", resize, {passive:true})

/* ----------------------------------------------------
   Lantern Model
---------------------------------------------------- */

function rand(min,max){ return min + Math.random()*(max-min) }

const lanterns = []
const LANTERN_COUNT = Math.round(rand(18, 26))

function spawnLantern(fromBottom){

  const w = rand(14, 28)
  const h = w * rand(1.25, 1.6)

  const x = rand(0, window.innerWidth)
  const y = fromBottom ? (window.innerHeight + rand(20, 420)) : rand(0, window.innerHeight)

  return {
    x,
    y,
    w,
    h,
    /* upward speed (slow + calm) */
    vy: rand(0.14, 0.36),
    /* lateral sway */
    sx: rand(0.25, 0.70),
    phase: rand(0, Math.PI*2),
    /* glow intensity */
    glow: rand(0.22, 0.40),
    /* opacity */
    a: rand(0.18, 0.34)
  }

}

for(let i=0;i<LANTERN_COUNT;i++){
  lanterns.push(spawnLantern(false))
}

/* ----------------------------------------------------
   Draw Helpers
---------------------------------------------------- */

function drawLantern(L, t){

  const sway = Math.sin(t*0.6 + L.phase) * (L.sx * 10)

  const cx = L.x + sway
  const cy = L.y

  /* glow halo */
  const halo = ctx.createRadialGradient(cx, cy, 2, cx, cy, L.w*3.6)
  halo.addColorStop(0, `rgba(255,210,140,${L.glow})`)
  halo.addColorStop(1, "rgba(255,210,140,0)")

  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.ellipse(cx, cy, L.w*3.0, L.w*2.2, 0, 0, Math.PI*2)
  ctx.fill()

  /* lantern body */
  const body = ctx.createLinearGradient(cx, cy - L.h/2, cx, cy + L.h/2)
  body.addColorStop(0, `rgba(255,230,170,${L.a})`)
  body.addColorStop(0.35, `rgba(255,160,90,${L.a*0.95})`)
  body.addColorStop(1, `rgba(120,0,22,${L.a*0.55})`)

  ctx.fillStyle = body
  ctx.strokeStyle = `rgba(212,175,55,${Math.min(0.22, L.a)})`
  ctx.lineWidth = 1

  ctx.beginPath()
  ctx.roundRect(cx - L.w/2, cy - L.h/2, L.w, L.h, Math.max(4, L.w*0.22))
  ctx.fill()
  ctx.stroke()

  /* top cap */
  ctx.fillStyle = `rgba(212,175,55,${Math.min(0.20, L.a)})`
  ctx.beginPath()
  ctx.roundRect(cx - L.w*0.34, cy - L.h*0.56, L.w*0.68, L.h*0.12, 6)
  ctx.fill()

  /* inner flame */
  const flamePulse = 0.5 + 0.5*Math.sin(t*2.2 + L.phase*1.7)
  const flameR = L.w * (0.10 + 0.10*flamePulse)

  const flame = ctx.createRadialGradient(cx, cy + L.h*0.12, 1, cx, cy + L.h*0.12, L.w*0.8)
  flame.addColorStop(0, `rgba(255,250,220,${0.25 + 0.20*flamePulse})`)
  flame.addColorStop(1, "rgba(255,250,220,0)")

  ctx.fillStyle = flame
  ctx.beginPath()
  ctx.ellipse(cx, cy + L.h*0.12, L.w*0.55, L.h*0.45, 0, 0, Math.PI*2)
  ctx.fill()

  ctx.fillStyle = `rgba(255,250,220,${0.22 + 0.20*flamePulse})`
  ctx.beginPath()
  ctx.ellipse(cx, cy + L.h*0.16, flameR*1.25, flameR*1.8, 0, 0, Math.PI*2)
  ctx.fill()

}

/* ----------------------------------------------------
   Render Loop
---------------------------------------------------- */

let t = 0

function tick(){

  t += 0.016

  ctx.clearRect(0,0,lanternCanvas.width, lanternCanvas.height)

  for(let i=0;i<lanterns.length;i++){

    const L = lanterns[i]

    /* gentle upward motion */
    L.y -= L.vy

    /* slow opacity drift (keeps it alive) */
    L.a += Math.sin(t*0.2 + L.phase) * 0.0005
    L.a = Math.max(0.12, Math.min(0.38, L.a))

    drawLantern(L, t)

    /* recycle */
    if(L.y < -420){
      lanterns[i] = spawnLantern(true)
    }

  }

  requestAnimationFrame(tick)

}

tick()

})()
