/* AUREN_SPATIAL_CHAMBER_GEOMETRY_PROOF1_v1
Candidate geometry values are design variables, not canon. */
(()=>{"use strict";
const CONTRACT="AUREN_SPATIAL_CHAMBER_GEOMETRY_PROOF1_v1";
const room=Object.freeze({width:16,depth:22,height:8});
const anchors=Object.freeze({
visitor:Object.freeze({x:0,y:1.65,z:8.2}),
auren:Object.freeze({x:-2.1,y:0,z:-1.2}),
custody:Object.freeze({x:4.6,y:1.35,z:-5.8}),
threshold:Object.freeze({x:0,y:0,z:-10.9})
});
const surfaces=Object.freeze([
{id:"floor",kind:"plane",center:[0,0,0],size:[16,22]},
{id:"rear",kind:"wall",center:[0,4,-11],size:[16,8]},
{id:"left",kind:"wall",center:[-8,4,0],size:[22,8]},
{id:"right",kind:"wall",center:[8,4,0],size:[22,8]},
{id:"ceiling",kind:"plane",center:[0,8,0],size:[16,22]},
{id:"custody-apse",kind:"protected-feature",center:[4.6,1.35,-5.8],size:[3.2,2.7]},
{id:"rear-threshold",kind:"opening",center:[0,2.5,-10.9],size:[3.4,5]}
]);
const receipt=Object.freeze({contract:CONTRACT,units:"candidate-scene-units",canonicalDimensions:false,room,anchors,surfaceCount:surfaces.length,surfaces});
Object.defineProperty(globalThis,"AUREN_ROOM_GEOMETRY",{value:Object.freeze({contract:CONTRACT,room,anchors,surfaces,receipt}),writable:false,configurable:false});
globalThis.dispatchEvent(new CustomEvent("auren:geometry-ready",{detail:receipt}));
})();