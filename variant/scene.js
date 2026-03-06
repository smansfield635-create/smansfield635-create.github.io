(function(){

const canvas=document.getElementById("scene")
if(!canvas) return

const ctx=canvas.getContext("2d")

let layer=1
let tick=0

function resize(){
canvas.width=window.innerWidth
canvas.height=window.innerHeight
}

window.addEventListener("resize",resize)
resize()

function sky(){

const g=ctx.createLinearGradient(0,0,0,canvas.height)

g.addColorStop(0,"#2a0a0a")
g.addColorStop(.4,"#7d1c14")
g.addColorStop(.7,"#da4c22")
g.addColorStop(1,"#1b0606")

ctx.fillStyle=g
ctx.fillRect(0,0,canvas.width,canvas.height)

}

function water(){

const base=canvas.height*.7

for(let row=0;row<6;row++){

ctx.beginPath()

for(let x=0;x<=canvas.width;x+=12){

const y=
base+
row*18+
Math.sin(x*.015+tick*.7+row*.4)*6

if(x===0) ctx.moveTo(x,y)
else ctx.lineTo(x,y)

}

ctx.strokeStyle="rgba(255,230,200,"+(0.06+row*.02)+")"
ctx.stroke()

}

}

function cube(cx,cy,size){

ctx.strokeStyle="#fff"
ctx.lineWidth=2

ctx.strokeRect(cx-size/2,cy-size/2,size,size)

}

function dodeca(cx,cy,r){

ctx.beginPath()

for(let i=0;i<12;i++){

const a=i*Math.PI*2/12+tick*.01

const x=cx+Math.cos(a)*r
const y=cy+Math.sin(a)*r

if(i===0) ctx.moveTo(x,y)
else ctx.lineTo(x,y)

}

ctx.closePath()
ctx.strokeStyle="#fff"
ctx.stroke()

}

function dragon(dir,offset){

const seg=36
const spacing=18

const start=dir>0?-canvas.width*.3:canvas.width*1.3
const end=dir>0?canvas.width*1.3:-canvas.width*.3

const p=(tick*.0006)%1

const head=start+(end-start)*p

const baseY=canvas.height*.3+offset

const pts=[]

for(let i=0;i<seg;i++){

const x=head-dir*i*spacing

const y=
baseY+
Math.sin(p*8+i*.35)*20+
Math.sin(p*3+i*.22)*14

const size=16-i*.35

pts.push({x,y,size})

}

drawBody(pts)

}

function drawBody(points){

const up=[]
const down=[]

for(let i=0;i<points.length;i++){

const p=points[i]

const prev=points[Math.max(0,i-1)]
const next=points[Math.min(points.length-1,i+1)]

const dx=next.x-prev.x
const dy=next.y-prev.y

const len=Math.max(1,Math.hypot(dx,dy))

const nx=-dy/len
const ny=dx/len

up.push({x:p.x+nx*p.size,y:p.y+ny*p.size})
down.push({x:p.x-nx*p.size,y:p.y-ny*p.size})

}

ctx.beginPath()

ctx.moveTo(up[0].x,up[0].y)

for(let i=1;i<up.length;i++)
ctx.lineTo(up[i].x,up[i].y)

for(let i=down.length-1;i>=0;i--)
ctx.lineTo(down[i].x,down[i].y)

ctx.closePath()

ctx.fillStyle="rgba(0,0,0,.6)"
ctx.fill()

}

function frame(){

tick++

ctx.clearRect(0,0,canvas.width,canvas.height)

sky()
water()

const cx=canvas.width/2
const cy=canvas.height*.55

if(layer===1){
cube(cx,cy,220)
}else{
dodeca(cx,cy,180)
}

dragon(1,-40)
dragon(-1,40)

requestAnimationFrame(frame)

}

frame()

window.__renderEngine={
setLayer(n){layer=n}
}

})();
