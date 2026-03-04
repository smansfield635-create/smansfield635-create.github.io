/* =====================================================
   GEODIAMETRICS ATMOSPHERE ENGINE — LAYER 6
   lantern drift + clouds + true dragon body
===================================================== */

const fxCanvas = document.createElement("canvas")
fxCanvas.style.position = "fixed"
fxCanvas.style.top = "0"
fxCanvas.style.left = "0"
fxCanvas.style.pointerEvents = "none"

/* layer order */
fxCanvas.style.zIndex = "8"

document.body.appendChild(fxCanvas)

const ctx = fxCanvas.getContext("2d")

function resizeFX(){
  fxCanvas.width = window.innerWidth
  fxCanvas.height = window.innerHeight
}
resizeFX()
window.addEventListener("resize",resizeFX)

/* ============================
   LANTERN PARTICLES
============================ */

let lanterns = []

for(let i=0;i<20;i++){
  lanterns.push({
    x:Math.random()*window.innerWidth,
    y:window.innerHeight + Math.random()*300,
    speed:0.15 + Math.random()*0.25,
    size:4 + Math.random()*4
  })
}

/* ============================
   CLOUD FIELD
============================ */

let clouds=[]

for(let i=0;i<10;i++){
  clouds.push({
    x:Math.random()*window.innerWidth,
    y:Math.random()*window.innerHeight*0.6,
    speed:0.2 + Math.random()*0.2,
    size:200 + Math.random()*200
  })
}

/* ============================
   DRAGON ENGINE
============================ */

function createDragon(yOffset){

  let segments=60
  let body=[]

  for(let i=0;i<segments;i++){
    body.push({
      x:-i*30,
      y:yOffset
    })
  }

  return {
    body:body,
    speed:0.9,
    phase:Math.random()*100
  }

}

let dragons=[
  createDragon(window.innerHeight*0.35),
  createDragon(window.innerHeight*0.70)
]

/* ============================
   DRAW FUNCTIONS
============================ */

function drawLanterns(){

  lanterns.forEach(l=>{

    ctx.fillStyle="rgba(255,200,120,0.25)"

    ctx.beginPath()
    ctx.arc(l.x,l.y,l.size,0,Math.PI*2)
    ctx.fill()

    l.y -= l.speed

    if(l.y < -20){
      l.y = window.innerHeight + 50
      l.x = Math.random()*window.innerWidth
    }

  })

}

function drawClouds(){

  ctx.fillStyle="rgba(255,255,255,0.05)"

  clouds.forEach(c=>{

    ctx.beginPath()
    ctx.ellipse(c.x,c.y,c.size,60,0,0,Math.PI*2)
    ctx.fill()

    c.x += c.speed

    if(c.x > window.innerWidth + 200){
      c.x = -200
    }

  })

}

function drawDragon(dragon){

  let body=dragon.body

  for(let i=0;i<body.length;i++){

    let p = body[i]

    let wave = Math.sin(i*0.3 + performance.now()*0.002)*12

    p.x += dragon.speed
    p.y += wave*0.02

    if(p.x > window.innerWidth + 200){
      p.x = -200
    }

    /* scale body */

    ctx.fillStyle = "rgba(10,60,20,0.9)"
    ctx.strokeStyle = "rgba(212,175,55,0.7)"
    ctx.lineWidth = 1.5

    let size = 18 - i*0.2

    ctx.beginPath()
    ctx.ellipse(p.x,p.y,size,size*0.8,0,0,Math.PI*2)
    ctx.fill()
    ctx.stroke()

  }

}

function render(){

  ctx.clearRect(0,0,fxCanvas.width,fxCanvas.height)

  drawClouds()

  drawLanterns()

  dragons.forEach(d=>drawDragon(d))

  requestAnimationFrame(render)

}

render()
