/* =====================================================
   GEODIAMETRICS WATER COMPASS ENGINE — LAYER 8

   PURPOSE
   - The compass face behaves like a lake surface
   - Subtle continuous water motion (Confucius river concept)
   - Moon reflection distortion
   - Ripple cycles that never break UI readability

   VISUAL ORDER
   sky
   ↓
   moon
   ↓
   water reflection layer (THIS ENGINE)
   ↓
   dragons
   ↓
   compass dial
   ↓
   gem buttons

   PERFORMANCE
   - one canvas
   - shader-like sine displacement
   - constant-time per frame
   - 4K safe
===================================================== */

(function(){

"use strict"

/* ----------------------------------------------------
   Canvas
---------------------------------------------------- */

const waterCanvas = document.createElement("canvas")

waterCanvas.style.position = "fixed"
waterCanvas.style.top = "0"
waterCanvas.style.left = "0"
waterCanvas.style.pointerEvents = "none"

/* behind dragons but above background */

waterCanvas.style.zIndex = "7"

document.body.appendChild(waterCanvas)

const ctx = waterCanvas.getContext("2d")

function resize(){

  waterCanvas.width = window.innerWidth
  waterCanvas.height = window.innerHeight

}

resize()

window.addEventListener("resize",resize,{passive:true})

/* ----------------------------------------------------
   Water Surface Grid
---------------------------------------------------- */

const gridSize = 32
let cols, rows

function buildGrid(){

  cols = Math.ceil(waterCanvas.width / gridSize)
  rows = Math.ceil(waterCanvas.height / gridSize)

}

buildGrid()

window.addEventListener("resize",buildGrid,{passive:true})

/* ----------------------------------------------------
   Ripple Parameters
---------------------------------------------------- */

let time = 0

const rippleA = 0.0025
const rippleB = 0.0015

const waveHeight = 6

/* ----------------------------------------------------
   Draw Water Surface
---------------------------------------------------- */

function drawWater(){

  ctx.clearRect(0,0,waterCanvas.width,waterCanvas.height)

  for(let y = 0; y < rows; y++){

    for(let x = 0; x < cols; x++){

      const px = x * gridSize
      const py = y * gridSize

      const wave =
        Math.sin(px * rippleA + time) +
        Math.cos(py * rippleB + time * 0.6)

      const offset = wave * waveHeight

      const alpha = 0.04 + (wave * 0.01)

      ctx.fillStyle = `rgba(255,255,255,${alpha})`

      ctx.beginPath()

      ctx.ellipse(
        px + gridSize/2,
        py + gridSize/2 + offset,
        gridSize * 0.6,
        gridSize * 0.28,
        0,
        0,
        Math.PI * 2
      )

      ctx.fill()

    }

  }

}

/* ----------------------------------------------------
   Moon Reflection
---------------------------------------------------- */

function drawMoonReflection(){

  const moonX = window.innerWidth * 0.78
  const moonY = window.innerHeight * 0.18

  const reflectionY = moonY + (window.innerHeight * 0.32)

  const ripple =
    Math.sin(time*0.8) * 8

  const gradient = ctx.createRadialGradient(
    moonX,
    reflectionY + ripple,
    10,
    moonX,
    reflectionY + ripple,
    160
  )

  gradient.addColorStop(0,"rgba(255,255,220,0.22)")
  gradient.addColorStop(1,"rgba(255,255,220,0)")

  ctx.fillStyle = gradient

  ctx.beginPath()

  ctx.ellipse(
    moonX,
    reflectionY + ripple,
    160,
    60,
    0,
    0,
    Math.PI * 2
  )

  ctx.fill()

}

/* ----------------------------------------------------
   Render Loop
---------------------------------------------------- */

function render(){

  time += 0.015

  drawWater()

  drawMoonReflection()

  requestAnimationFrame(render)

}

render()

})()
