const canvas = document.getElementById("scene")
const ctx = canvas.getContext("2d")

function resize(){
canvas.width = window.innerWidth
canvas.height = window.innerHeight
}
resize()
window.addEventListener("resize",resize)

let t = 0

function drawSky(){
let g = ctx.createLinearGradient(0,0,0,canvas.height)
g.addColorStop(0,"#2a0c0a")
g.addColorStop(.4,"#861d15")
g.addColorStop(.7,"#d14622")
g.addColorStop(1,"#3c120d")
ctx.fillStyle = g
ctx.fillRect(0,0,canvas.width,canvas.height)
}

function drawCompass(){
let cx = canvas.width/2
let cy = canvas.height*0.55
let r = Math.min(canvas.width,canvas.height)*0.28

ctx.lineWidth=2
ctx.strokeStyle="rgba(255,240,210,.1)"

ctx.beginPath()
ctx.arc(cx,cy,r,0,Math.PI*2)
ctx.stroke()

for(let i=0;i<32;i++){
let a=i/32*Math.PI*2
ctx.beginPath()
ctx.moveTo(cx,cy)
ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)
ctx.stroke()
}

for(let i=1;i<5;i++){
ctx.beginPath()
ctx.arc(cx,cy,r*(i/5),0,Math.PI*2)
ctx.stroke()
}
}

function drawWater(){
let y=canvas.height*.7

ctx.strokeStyle="rgba(255,210,180,.3)"

for(let j=0;j<4;j++){
ctx.beginPath()
for(let x=0;x<canvas.width;x+=12){
let yy=y+j*20+Math.sin(x*.02+t*.02)*8
if(x===0)ctx.moveTo(x,yy)
else ctx.lineTo(x,yy)
}
ctx.stroke()
}
}

function dragonPath(dir){

let start = dir>0 ? -200 : canvas.width+200
let end   = dir>0 ? canvas.width+200 : -200

let progress = (t*0.002)%1

let x = start + (end-start)*progress

let y = canvas.height*.3 + Math.sin(progress*6+t*.03)*40

return {x,y,progress}
}

function drawDragon(dir,color){

let d = dragonPath(dir)

ctx.strokeStyle=color
ctx.lineWidth=14
ctx.lineCap="round"

ctx.beginPath()

for(let i=0;i<20;i++){

let p=i*16

let x=d.x - dir*p
let y=d.y + Math.sin((i*0.4)+(t*.1))*12

if(i===0)ctx.moveTo(x,y)
else ctx.lineTo(x,y)

}

ctx.stroke()

// head

ctx.fillStyle=color
ctx.beginPath()
ctx.arc(d.x,d.y,12,0,Math.PI*2)
ctx.fill()

// whiskers

ctx.strokeStyle=color
ctx.lineWidth=3

ctx.beginPath()
ctx.moveTo(d.x,d.y)
ctx.lineTo(d.x+dir*30,d.y-10)
ctx.stroke()

ctx.beginPath()
ctx.moveTo(d.x,d.y)
ctx.lineTo(d.x+dir*30,d.y+10)
ctx.stroke()

}

function frame(){

ctx.clearRect(0,0,canvas.width,canvas.height)

drawSky()
drawCompass()

drawDragon(1,"rgba(80,200,120,.95)")
drawDragon(-1,"rgba(220,70,60,.95)")

drawWater()

t++

requestAnimationFrame(frame)
}

frame()
