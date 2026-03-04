/* =====================================================
   GEODIAMETRICS ATMOSPHERE ENGINE — LAYER 6 (STABLE)
   lantern drift + clouds + true Chinese dragon motion
   OWNER: SEAN
===================================================== */

/* =====================================================
   CANVAS SETUP
===================================================== */

const fxCanvas = document.createElement("canvas")

fxCanvas.style.position = "fixed"
fxCanvas.style.top = "0"
fxCanvas.style.left = "0"
fxCanvas.style.pointerEvents = "none"

/* layer sits above sky but below compass UI */
fxCanvas.style.zIndex = "8"

document.body.appendChild(fxCanvas)

const ctx = fxCanvas.getContext("2d")

function resizeFX(){
  fxCanvas.width = window.innerWidth
  fxCanvas.height = window.innerHeight
}
resizeFX()

window.addEventListener("resize", resizeFX)



/* =====================================================
   LANTERN PARTICLES
===================================================== */

let lanterns = []

for(let i=0;i<24;i++){

  lanterns.push({

    x:Math.random()*window.innerWidth,
    y:window.innerHeight + Math.random()*400,

    speed:0.12 + Math.random()*0.18,
    size:3 + Math.random()*5,

    drift:(Math.random()-0.5)*0.2

  })

}



function drawLanterns(){

  lanterns.forEach(l=>{

    ctx.fillStyle="rgba(255,200,120,0.22)"

    ctx.beginPath()
    ctx.arc(l.x,l.y,l.size,0,Math.PI*2)
    ctx.fill()

    l.y -= l.speed
    l.x += l.drift

    if(l.y < -20){

      l.y = window.innerHeight + 80
      l.x = Math.random()*window.innerWidth

    }

  })

}



/* =====================================================
   CLOUD FIELD
===================================================== */

let clouds=[]

for(let i=0;i<12;i++){

  clouds.push({

    x:Math.random()*window.innerWidth,
    y:Math.random()*window.innerHeight*0.5,

    speed:0.15 + Math.random()*0.15,
    size:220 + Math.random()*240

  })

}



function drawClouds(){

  ctx.fillStyle="rgba(255,255,255,0.05)"

  clouds.forEach(c=>{

    ctx.beginPath()
    ctx.ellipse(c.x,c.y,c.size,70,0,0,Math.PI*2)
    ctx.fill()

    c.x += c.speed

    if(c.x > window.innerWidth + 300){

      c.x = -300

    }

  })

}



/* =====================================================
   DRAGON ENGINE (HEAD-DRIVEN)
===================================================== */

function createDragon(yPos){

  const segments = 70

  const dragon = {

    head:{x:-200,y:yPos},
    spine:[],
    speed:0.8,
    phase:Math.random()*100

  }

  for(let i=0;i<segments;i++){

    dragon.spine.push({

      x:-200 - (i*22),
      y:yPos

    })

  }

  return dragon

}



/* two dragons (top + bottom lanes) */

let dragons=[

  createDragon(window.innerHeight*0.32),
  createDragon(window.innerHeight*0.72)

]



/* =====================================================
   DRAGON HEAD
===================================================== */

function drawDragonHead(d){

  const x = d.head.x
  const y = d.head.y

  ctx.fillStyle="#0f3a1a"
  ctx.strokeStyle="#d4af37"
  ctx.lineWidth=2

  /* skull */

  ctx.beginPath()
  ctx.ellipse(x,y,26,18,0,0,Math.PI*2)
  ctx.fill()
  ctx.stroke()

  /* horns */

  ctx.beginPath()
  ctx.moveTo(x-12,y-18)
  ctx.lineTo(x-24,y-36)
  ctx.lineTo(x-8,y-20)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x+12,y-18)
  ctx.lineTo(x+24,y-36)
  ctx.lineTo(x+8,y-20)
  ctx.stroke()

  /* whiskers */

  ctx.beginPath()
  ctx.moveTo(x+26,y)
  ctx.quadraticCurveTo(x+70,y-18,x+100,y-8)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x+26,y+4)
  ctx.quadraticCurveTo(x+70,y+20,x+100,y+10)
  ctx.stroke()

}



/* =====================================================
   DRAGON BODY (SEGMENTED)
===================================================== */

function drawDragonBody(d){

  for(let i=0;i<d.spine.length;i++){

    const p = d.spine[i]

    const size = 20 - (i*0.16)

    ctx.fillStyle="#0f3a1a"
    ctx.strokeStyle="#d4af37"

    ctx.beginPath()
    ctx.ellipse(p.x,p.y,size,size*0.75,0,0,Math.PI*2)
    ctx.fill()
    ctx.stroke()

  }

}



/* =====================================================
   DRAGON MOTION (SMOOTH SLITHER)
===================================================== */

function updateDragon(d){

  const head = d.head

  head.x += d.speed

  /* smooth sinusoidal slither */

  head.y += Math.sin(performance.now()*0.0015)*0.4

  if(head.x > window.innerWidth + 220){

    head.x = -220

  }

  /* update spine */

  d.spine[0].x = head.x
  d.spine[0].y = head.y

  for(let i=1;i<d.spine.length;i++){

    const prev = d.spine[i-1]
    const cur = d.spine[i]

    const dx = prev.x - cur.x
    const dy = prev.y - cur.y

    const dist = Math.sqrt(dx*dx+dy*dy)

    const target = 22

    if(dist > target){

      cur.x += dx*0.28
      cur.y += dy*0.28

    }

  }

}



/* =====================================================
   RENDER DRAGONS
===================================================== */

function drawDragons(){

  dragons.forEach(d=>{

    updateDragon(d)
    drawDragonBody(d)
    drawDragonHead(d)

  })

}



/* =====================================================
   MAIN RENDER LOOP
===================================================== */

function render(){

  ctx.clearRect(0,0,fxCanvas.width,fxCanvas.height)

  drawClouds()

  drawDragons()

  drawLanterns()

  requestAnimationFrame(render)

}

render()
