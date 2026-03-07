(function(){
"use strict";

const BODY_SCALE=0.48;
const SPEED=0.55;

function getDragonBundles(geo,state){

const points=[];

const radius=geo.size*5.5;

for(let i=0;i<40;i++){

const t=(state.tick*0.002*SPEED)+i*0.08;

points.push({
x:geo.centerX + Math.cos(t)*radius,
y:geo.centerY - geo.size*3.0 + Math.sin(t)*radius*0.4,
z:0,
a:t,
crossThin:1,
t:i/40
});

}

return{
fear:{points},
wisdom:{points}
};

}

function drawDragon(ctx,points,color){

ctx.strokeStyle=color;
ctx.lineWidth=10;

ctx.beginPath();

for(let i=0;i<points.length;i++){

const p=points[i];

if(i===0) ctx.moveTo(p.x,p.y);
else ctx.lineTo(p.x,p.y);

}

ctx.stroke();

}

function drawFront(ctx,geo,bundles,tick){

drawDragon(ctx,bundles.fear.points,"rgba(220,90,60,0.9)");
drawDragon(ctx,bundles.wisdom.points,"rgba(230,200,120,0.9)");

}

function drawBack(){}
function drawDragonReflections(){}

window.OPENWORLD_DRAGON_RENDERER={
getDragonBundles,
drawFront,
drawBack,
drawDragonReflections
};

})();
