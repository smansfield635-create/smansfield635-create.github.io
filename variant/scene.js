/* TNT — /variant/scene.js
   RENDER ENGINE
   Atomic full replacement
*/

(function(){

const canvas = document.getElementById("scene") || document.getElementById("bgCanvas")
if(!canvas) return

const ctx = canvas.getContext("2d")

let tick = 0

function resize(){
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
window.addEventListener("resize", resize)
resize()

/* ---------- SKY ---------- */

function drawSky(){

  const g = ctx.createLinearGradient(0,0,0,canvas.height)

  g.addColorStop(0,"#2a0a0a")
  g.addColorStop(.35,"#7d1c14")
  g.addColorStop(.7,"#da4c22")
  g.addColorStop(1,"#1b0606")

  ctx.fillStyle = g
  ctx.fillRect(0,0,canvas.width,canvas.height)

}

/* ---------- WATER ---------- */

function drawWater(){

  const base = canvas.height * .72

  const grad = ctx.createLinearGradient(0,base,0,canvas.height)

  grad.addColorStop(0,"rgba(255,210,170,.08)")
  grad.addColorStop(.5,"rgba(200,120,80,.16)")
  grad.addColorStop(1,"rgba(90,30,18,.28)")

  ctx.fillStyle = grad
  ctx.fillRect(0,base,canvas.width,canvas.height-base)

  for(let row=0; row<6; row++){

    const y = base + row * 18

    ctx.beginPath()

    for(let x=0; x<=canvas.width; x+=10){

      const wave =
        Math.sin(x*.014 + tick*.9 + row*.4)*6 +
        Math.sin(x*.03 + tick*.4)*2

      const yy = y + wave

      if(x===0) ctx.moveTo(x,yy)
      else ctx.lineTo(x,yy)

    }

    ctx.strokeStyle = "rgba(255,235,210,"+(0.06+row*.02)+")"
    ctx.lineWidth = 1.1
    ctx.stroke()

  }

}

/* ---------- COMPASS LIGHT ---------- */

function drawCompass(){

  const cx = canvas.width/2
  const cy = canvas.height*.55
  const r  = Math.min(canvas.width,canvas.height)*.28

  ctx.beginPath()
  ctx.arc(cx,cy,r,0,Math.PI*2)
  ctx.strokeStyle="rgba(255,240,220,.12)"
  ctx.lineWidth=2
  ctx.stroke()

  for(let i=0;i<60;i++){

    const a = (i/60)*Math.PI*2

    ctx.beginPath()
    ctx.moveTo(cx,cy)
    ctx.lineTo(
      cx + Math.cos(a)*r,
      cy + Math.sin(a)*r
    )

    ctx.strokeStyle="rgba(255,240,220,.05)"
    ctx.stroke()

  }

}

/* ---------- DRAGON SPINE ---------- */

function buildDragon(dir, offsetY, phase){

  const segments = 36
  const spacing  = 18

  const start = dir>0 ? -canvas.width*.3 : canvas.width*1.3
  const end   = dir>0 ? canvas.width*1.3 : -canvas.width*.3

  const progress = (tick*.00055 + phase) % 1

  const headX = start + (end-start)*progress

  const baseY = canvas.height*.32 + offsetY

  const pts = []

  for(let i=0;i<segments;i++){

    const x = headX - dir*i*spacing

    const y =
      baseY +
      Math.sin(progress*8 + i*.35)*20 +     // horizontal wave
      Math.sin(progress*3 + i*.22)*14       // vertical rise

    const size = 16 - i*.35

    pts.push({x,y,size})

  }

  return pts

}

/* ---------- DRAGON BODY ---------- */

function drawDragon(points, colors){

  const up=[]
  const down=[]

  for(let i=0;i<points.length;i++){

    const p=points[i]

    const prev = points[Math.max(0,i-1)]
    const next = points[Math.min(points.length-1,i+1)]

    const dx = next.x - prev.x
    const dy = next.y - prev.y

    const len = Math.max(1,Math.hypot(dx,dy))

    const nx = -dy/len
    const ny = dx/len

    up.push({
      x:p.x + nx*p.size,
      y:p.y + ny*p.size
    })

    down.push({
      x:p.x - nx*p.size,
      y:p.y - ny*p.size
    })

  }

  ctx.beginPath()

  ctx.moveTo(up[0].x,up[0].y)

  for(let i=1;i<up.length;i++)
    ctx.lineTo(up[i].x,up[i].y)

  for(let i=down.length-1;i>=0;i--)
    ctx.lineTo(down[i].x,down[i].y)

  ctx.closePath()

  const grad = ctx.createLinearGradient(
    points[0].x,
    points[0].y,
    points[points.length-1].x,
    points[points.length-1].y
  )

  grad.addColorStop(0,colors[0])
  grad.addColorStop(.5,colors[1])
  grad.addColorStop(1,colors[2])

  ctx.fillStyle=grad
  ctx.fill()

  ctx.strokeStyle="rgba(0,0,0,.8)"
  ctx.lineWidth=2
  ctx.stroke()

}

/* ---------- FRAME LOOP ---------- */

function frame(){

  tick++

  ctx.clearRect(0,0,canvas.width,canvas.height)

  drawSky()
  drawWater()
  drawCompass()

  const wise = buildDragon(1,-30,0)
  const fear = buildDragon(-1,40,.25)

  drawDragon(
    wise,
    ["rgba(70,180,110,.9)","rgba(26,120,60,.95)","rgba(10,60,30,.95)"]
  )

  drawDragon(
    fear,
    ["rgba(200,40,40,.95)","rgba(150,10,10,.95)","rgba(80,5,5,.95)"]
  )

  requestAnimationFrame(frame)

}

frame()

})()
