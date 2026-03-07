(function(){
"use strict";

function getCubeGeometry(opts){

const w=opts.width;
const h=opts.height;

const size=Math.min(w,h)*opts.preset.cubeScale;

const centerX=w*0.5;
const centerY=h*(opts.preset.cubeYOffset+0.26);

return{
centerX,
centerY,
size,
faces:{},
faceCenters:{}
};

}

function drawCube(ctx,geo){

ctx.strokeStyle="rgba(255,210,120,0.9)";
ctx.lineWidth=3;

ctx.strokeRect(
geo.centerX-geo.size,
geo.centerY-geo.size,
geo.size*2,
geo.size*2
);

}

function drawNavigationStick(){}

window.OPENWORLD_COMPASS_RENDERER={
getCubeGeometry,
drawCube,
drawNavigationStick
};

})();
