(function(){

const canvas = document.getElementById("scene")
if(!canvas) return
const ctx = canvas.getContext("2d")

let layer = 1
let rot = 0

function resize(){
  canvas.width = innerWidth
  canvas.height = innerHeight
}

function drawCube(cx,cy,size){
  ctx.strokeStyle="#fff"
  ctx.lineWidth=2
  ctx.strokeRect(cx-size/2,cy-size/2,size,size)
}

function drawDodeca(cx,cy,r){
  ctx.beginPath()
  for(let i=0;i<12;i++){
     let a=i*Math.PI*2/12+rot
     let x=cx+Math.cos(a)*r
     let y=cy+Math.sin(a)*r
     if(i==0) ctx.moveTo(x,y)
     else ctx.lineTo(x,y)
  }
  ctx.closePath()
  ctx.strokeStyle="#fff"
  ctx.stroke()
}

function frame(){
  rot += 0.01

  ctx.clearRect(0,0,canvas.width,canvas.height)

  let cx=canvas.width/2
  let cy=canvas.height/2

  if(layer==1){
     drawCube(cx,cy,220)
  }else{
     drawDodeca(cx,cy,180)
  }

  requestAnimationFrame(frame)
}

resize()
window.addEventListener("resize",resize)
frame()

window.__renderEngine = {
  setLayer(n){ layer=n }
}

})();
