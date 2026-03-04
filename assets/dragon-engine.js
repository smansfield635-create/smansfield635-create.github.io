/* =====================================================
   GEODIAMETRICS DRAGON ENGINE — LAYER 5
   4-DRAGON SYSTEM
   OWNER: SEAN
   PURPOSE:
   - Replace vine dragons with true segmented dragons
   - Introduce orbital + messenger dragons
   - Maintain strict layer separation
===================================================== */

const dragonCanvas = document.createElement("canvas")
dragonCanvas.style.position = "fixed"
dragonCanvas.style.top = "0"
dragonCanvas.style.left = "0"
dragonCanvas.style.pointerEvents = "none"

/* layer position (between compass and buttons) */
dragonCanvas.style.zIndex = "9"

document.body.appendChild(dragonCanvas)

const dctx = dragonCanvas.getContext("2d")

function resizeDragon(){
  dragonCanvas.width = window.innerWidth
  dragonCanvas.height = window.innerHeight
}

resizeDragon()
window.addEventListener("resize",resizeDragon)

/* ============================================
   DRAGON CLASS
============================================ */

class Dragon {

  constructor(type){

    this.type = type

    this.segments = 70
    this.body = []

    for(let i=0;i<this.segments;i++){
      this.body.push({
        x:-200,
        y:0
      })
    }

    this.speed = 1.2
    this.phase = Math.random()*100

  }

  updateOrbit(cx,cy,radius,angleOffset){

    this.phase += 0.003

    const angle = this.phase + angleOffset

    const targetX = cx + Math.cos(angle) * radius
    const targetY = cy + Math.sin(angle) * radius

    this.follow(targetX,targetY)

  }

  updateHorizontal(y){

    const head = this.body[0]

    head.x += this.speed

    if(head.x > dragonCanvas.width + 200){
      head.x = -200
    }

    head.y = y + Math.sin(performance.now()*0.002)*20

    this.solveBody()

  }

  follow(tx,ty){

    this.body[0].x = tx
    this.body[0].y = ty

    this.solveBody()

  }

  solveBody(){

    for(let i=1;i<this.body.length;i++){

      const prev = this.body[i-1]
      const curr = this.body[i]

      const dx = prev.x - curr.x
      const dy = prev.y - curr.y

      const dist = Math.sqrt(dx*dx + dy*dy)

      const spacing = 16

      curr.x = prev.x - (dx/dist)*spacing
      curr.y = prev.y - (dy/dist)*spacing

    }

  }

  draw(){

    for(let i=this.body.length-1;i>=0;i--){

      const p = this.body[i]

      const size = 26 - i*0.25

      dctx.fillStyle = "rgba(8,70,35,0.92)"
      dctx.strokeStyle = "rgba(212,175,55,0.9)"
      dctx.lineWidth = 1.6

      dctx.beginPath()
      dctx.ellipse(p.x,p.y,size,size*0.65,0,0,Math.PI*2)
      dctx.fill()
      dctx.stroke()

    }

  }

}

/* ============================================
   CREATE DRAGONS
============================================ */

const eastDragon  = new Dragon("orbit")
const westDragon  = new Dragon("orbit")

const northDragon = new Dragon("message")
const southDragon = new Dragon("message")

southDragon.speed = -1.1

/* ============================================
   RENDER LOOP
============================================ */

function renderDragons(){

  dctx.clearRect(0,0,dragonCanvas.width,dragonCanvas.height)

  const cx = dragonCanvas.width / 2
  const cy = dragonCanvas.height / 2

  const radius = Math.min(dragonCanvas.width,dragonCanvas.height) * 0.33

  /* EAST + WEST ORBIT DRAGONS */

  eastDragon.updateOrbit(cx,cy,radius,0)
  westDragon.updateOrbit(cx,cy,radius,Math.PI)

  eastDragon.draw()
  westDragon.draw()

  /* MESSAGE DRAGONS */

  northDragon.updateHorizontal(dragonCanvas.height*0.28)
  southDragon.updateHorizontal(dragonCanvas.height*0.72)

  northDragon.draw()
  southDragon.draw()

  requestAnimationFrame(renderDragons)

}

renderDragons()
