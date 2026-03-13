function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function lerp(a,b,t){return a+((b-a)*t);}
function normalize(v,f=0){return Number.isFinite(v)?v:f;}

function getNorthProgress(runtime){
const py=normalize(runtime?.player?.y,770);
return clamp((930-py)/930,0,1);
}

function getEastProgress(runtime){
const px=normalize(runtime?.player?.x,544);
return clamp((px-150)/(960-150),0,1);
}

function getViewportWidth(runtime){
return normalize(runtime?.width,1180);
}

function getViewportHeight(runtime){
return normalize(runtime?.height,1240);
}

function getWorldBounds(runtime){
return{
width:normalize(runtime?.worldBounds?.width,1180),
height:normalize(runtime?.worldBounds?.height,1240)
};
}

function getPlanetBodyGeometry(runtime){

const width=getViewportWidth(runtime);
const height=getViewportHeight(runtime);

const northProgress=getNorthProgress(runtime);
const eastProgress=getEastProgress(runtime);

/*
NEW CAMERA MODEL

Goals:
• lower horizon
• center landmass
• increase visible ground share
*/

const centerX=
width*0.50+
((eastProgress-0.5)*width*0.04);

const centerY=
lerp(height*1.52,height*1.28,northProgress);

/*
Larger radius increases visible curvature
but exposes more terrain
*/

const radius=
lerp(width*1.28,width*1.08,northProgress);

/*
Lower horizon exposes terrain
*/

const horizonY=
centerY-(radius*0.74);

return Object.freeze({
width,
height,
centerX,
centerY,
radius,
horizonY,
northProgress,
eastProgress
});
}

function projectSpherePoint(runtime,worldX,worldY){

const bounds=getWorldBounds(runtime);
const body=getPlanetBodyGeometry(runtime);

const worldWidth=bounds.width;
const worldHeight=bounds.height;

const x=clamp(normalize(worldX,worldWidth*0.5),0,worldWidth);
const y=clamp(normalize(worldY,worldHeight*0.5),0,worldHeight);

const u=x/worldWidth;
const v=y/worldHeight;

const northDepth=clamp(1-v,0,1);
const southDepth=1-northDepth;

const longitudeSpan=lerp(1.16,1.36,body.northProgress);
const latitudeSpan=lerp(0.86,1.10,body.northProgress);

const longitude=(u-0.5)*longitudeSpan;
const latitude=(0.5-v)*latitudeSpan;

const cosLat=Math.cos(latitude);
const sinLat=Math.sin(latitude);
const sinLon=Math.sin(longitude);
const cosLon=Math.cos(longitude);

const sx=body.radius*sinLon*cosLat;
const sy=-body.radius*sinLat;
const sz=body.radius*cosLon*cosLat;

/*
Tilt stabilized for horizon balance
*/

const tilt=0.98;

const cosTilt=Math.cos(tilt);
const sinTilt=Math.sin(tilt);

const ry=(sy*cosTilt)-(sz*sinTilt);
const rz=(sy*sinTilt)+(sz*cosTilt);

/*
Camera slightly farther to reduce distortion
*/

const cameraDistance=body.radius*2.46;

const perspective=
cameraDistance/Math.max(1,cameraDistance-rz);

const screenX=
body.centerX+(sx*perspective);

const screenY=
body.centerY+(ry*perspective);

const scale=clamp(perspective,0.60,1.38);

return Object.freeze({
x:screenX,
y:screenY,
scale,
northDepth,
southDepth,
horizonY:body.horizonY
});
}

function projectRadius(runtime,value,worldY){
const sample=projectSpherePoint(runtime,590,normalize(worldY,620));
const northDepth=sample.northDepth;
const depthScale=lerp(1.0,0.70,northDepth);
const projected=normalize(value,1)*depthScale*sample.scale;
return Math.max(0.5,projected);
}

function projectLineWidth(runtime,value,worldY){
return projectRadius(runtime,value,worldY);
}

function projectRect(runtime,x,y,width,height){

const center=projectSpherePoint(runtime,x+(width*0.5),y+(height*0.5));

const projectedWidth=
projectRadius(runtime,width,y+(height*0.5));

const projectedHeight=
projectRadius(runtime,height,y+height);

return Object.freeze({
x:center.x-(projectedWidth*0.5),
y:center.y-(projectedHeight*0.5),
width:projectedWidth,
height:projectedHeight
});
}

export function createPlanetSurfaceProjector(runtime){

const body=getPlanetBodyGeometry(runtime);

function point(x,y){
return projectSpherePoint(runtime,x,y);
}

function radius(v,y=620){
return projectRadius(runtime,v,y);
}

function lineWidth(v,y=620){
return projectLineWidth(runtime,v,y);
}

function rect(x,y,w,h){
return projectRect(runtime,x,y,w,h);
}

return Object.freeze({
body,
point,
radius,
lineWidth,
rect
});
}

export{getPlanetBodyGeometry};
