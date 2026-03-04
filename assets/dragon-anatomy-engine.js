/* =====================================================
   GEODIAMETRICS DRAGON ANATOMY ENGINE — LAYER 10
   fixes "vine dragon" problem
   builds true head + spine + scales

   ENGLISH ONLY
   NO NEW gd_* KEYS
===================================================== */

(function(){

"use strict"

/* ------------------------------------------
   Canvas
------------------------------------------ */

const dragonCanvas = document.createElement("canvas")
dragonCanvas.style.position = "fixed"
dragonCanvas.style.top = "0"
dragonCanvas.style.left = "0"
dragonCanvas.style.pointerEvents = "none"
dragonCanvas.style.zIndex = "9"

document.body.appendChild(dragonCanvas)

const ctx = dragonCanvas.getContext("2d")

function resize(){
  dragonCanvas.width = window.innerWidth
  dragonCanvas.height = window.innerHeight
}
resize()
window.addEventListener("resize", resize)

/* ------------------------------------------
   Dragon Spine
------------------------------------------ */

const SEGMENTS = 80
const spine = []

for(let i=0;i<SEGMENTS;i++){
  spine.push({
    x: -i * 24,
    y: window.innerHeight * 0.35
  })
}

let phase = 0

/* ------------------------------------------
   Draw Dragon Head
------------------------------------------ */

function drawHead(p){

  const x = p.x
  const y = p.y

  /* skull */
  ctx.fillStyle = "#063018"
  ctx.beginPath()
  ctx.ellipse(x,y,28,22,0,0,Math.PI*2)
  ctx.fill()

  /* jaw */
  ctx.fillStyle="#082b17"
  ctx.beginPath()
  ctx.ellipse(x+16,y+4,22,14,0,0,Math.PI*2)
  ctx.fill()

  /* eye */
  ctx.fillStyle="#ffd54a"
  ctx.beginPath()
  ctx.arc(x+8,y-3,4,0,Math.PI*2)
  ctx.fill()

  /* horns */
  ctx.strokeStyle="#d4af37"
  ctx.lineWidth=2

  ctx.beginPath()
  ctx.moveTo(x-6,y-12)
  ctx.lineTo(x-18,y-30)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x+4,y-12)
  ctx.lineTo(x-4,y-34)
  ctx.stroke()

  /* whiskers */

  ctx.strokeStyle="#d4af37"
  ctx.lineWidth=1.4

  ctx.beginPath()
  ctx.moveTo(x+26,y+2)
  ctx.lineTo(x+56,y-10)
  ctx.stroke()

}

/* ------------------------------------------
   Draw Body
------------------------------------------ */

function drawBody(){

  for(let i=0;i<spine.length;i++){

    const p = spine[i]

    const size = 24 - i*0.18

    /* body */

    ctx.fillStyle="rgba(8,60,28,0.95)"
    ctx.strokeStyle="rgba(212,175,55,0.55)"
    ctx.lineWidth=1.2

    ctx.beginPath()
    ctx.ellipse(p.x,p.y,size,size*0.75,0,0,Math.PI*2)
    ctx.fill()
    ctx.stroke()

    /* scale highlights */

    if(i % 2 === 0){

      ctx.fillStyle="rgba(212,175,55,0.25)"

      ctx.beginPath()
      ctx.arc(p.x,p.y,size*0.3,0,Math.PI*2)
      ctx.fill()

    }

  }

}

/* ------------------------------------------
   Update Motion
------------------------------------------ */

function update(){

  phase += 0.03

  const head = spine[0]

  head.x += 1.2
  head.y = window.innerHeight * 0.35 + Math.sin(phase)*20

  if(head.x > window.innerWidth + 200){
    head.x = -200
  }

  /* follow chain */

  for(let i=1;i<spine.length;i++){

    const prev = spine[i-1]
    const cur = spine[i]

    const dx = prev.x - cur.x
    const dy = prev.y - cur.y

    const dist = Math.sqrt(dx*dx + dy*dy)

    const target = 18

    cur.x = prev.x - dx/dist * target
    cur.y = prev.y - dy/dist * target

  }

}

/* ------------------------------------------
   Render
------------------------------------------ */

function render(){

  ctx.clearRect(0,0,dragonCanvas.width,dragonCanvas.height)

  update()

  drawBody()
  drawHead(spine[0])

  requestAnimationFrame(render)

}

render()

})()
