const canvas=document.getElementById("scene")
const ctx=canvas.getContext("2d")

function resize(){
canvas.width=window.innerWidth*2
canvas.height=window.innerHeight*2
canvas.style.width=window.innerWidth+"px"
canvas.style.height=window.innerHeight+"px"
ctx.scale(2,2)
}
resize()
window.addEventListener("resize",resize)

let t=0

function sky(){

let g=ctx.createLinearGradient(0,0,0,canvas.height)

g.addColorStop(0,"#2a0c0a")
g.addColorStop(.4,"#861d15")
g.addColorStop(.7,"#d14622")
g.addColorStop(1,"#3c120d")

ctx.fillStyle=g
ctx.fillRect(0,0,canvas.width,canvas.height)

}

function compass(){

let cx=canvas.width/4
let cy=canvas.height/4
let r=Math.min(canvas.width,canvas.height)*.18

ctx.lineWidth=2
ctx.strokeStyle="rgba(255,240,210,.15)"

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

}

function water(){

let y=window.innerHeight*.7

ctx.strokeStyle="rgba(255,210,180,.35)"

for(let j=0;j<4;j++){

ctx.beginPath()

for(let x=0;x<window.innerWidth;x+=12){

let yy=y+j*22+Math.sin(x*.02+t*.03)*8

if(x===0)ctx.moveTo(x,yy)
else ctx.lineTo(x,yy)

}

ctx.stroke()

}

}

function dragon(dir,color){

let start=dir>0?-200:window.innerWidth+200
let end=dir>0?window.innerWidth+200:-200

let progress=(t*.002)%1

let x=start+(end-start)*progress

let y=window.innerHeight*.3+Math.sin(progress*6+t*.03)*40

ctx.strokeStyle=color
ctx.lineWidth=16
ctx.lineCap="round"

ctx.beginPath()

for(let i=0;i<24;i++){

let p=i*18

let px=x-dir*p
let py=y+Math.sin((i*.4)+(t*.15))*14

if(i===0)ctx.moveTo(px,py)
else ctx.lineTo(px,py)

}

ctx.stroke()

ctx.beginPath()
ctx.arc(x,y,12,0,Math.PI*2)
ctx.fillStyle=color
ctx.fill()

}

function frame(){

ctx.clearRect(0,0,canvas.width,canvas.height)

sky()
compass()

dragon(1,"rgba(70,200,120,.95)")
dragon(-1,"rgba(220,60,60,.95)")

water()

t++

requestAnimationFrame(frame)

}

frame()
