(function(){
"use strict";

function createState(){
return{
mode:"idle"
};
}

function refreshTargets(state,w,h){
return state;
}

function update(state,tick,sceneState){
return state;
}

function drawDragonMarkers(ctx,sceneState,w,h){
ctx.save();
ctx.globalAlpha=0.82;

if(sceneState.dragonFearActive){
ctx.fillStyle="rgba(255,158,112,0.92)";
ctx.font='700 11px system-ui,Segoe UI,Roboto,sans-serif';
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText("FEAR ACTIVE",sceneState.moonLeftHot.x,sceneState.moonLeftHot.y-(sceneState.moonLeftHot.r+18));
}

if(sceneState.dragonAlignActive){
ctx.fillStyle="rgba(255,236,190,0.92)";
ctx.font='700 11px system-ui,Segoe UI,Roboto,sans-serif';
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText("ALIGN ACTIVE",sceneState.moonRightHot.x,sceneState.moonRightHot.y-(sceneState.moonRightHot.r+18));
}

ctx.restore();
}

window.OPENWORLD_SHOWROOM_RENDERER=Object.freeze({
version:"OPENWORLD_SHOWROOM_RENDERER_vL2B",
createState:createState,
refreshTargets:refreshTargets,
update:update,
drawDragonMarkers:drawDragonMarkers
});
})();
