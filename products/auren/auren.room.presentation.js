/* AUREN_SPATIAL_CHAMBER_PRESENTATION_PROOF1_v1
Consumes geometry. Owns DOM/CSS-3D presentation and measurable camera candidate only.
No WebGL context is created in Proof 1. */
(()=>{"use strict";
const CONTRACT="AUREN_SPATIAL_CHAMBER_PRESENTATION_PROOF1_v1";
const camera=Object.freeze({projection:"css-perspective",perspectivePx:920,anchored:true,target:"room-center"});
let root=null,scene=null,ready=false;
function mount(node){
 const g=globalThis.AUREN_ROOM_GEOMETRY;if(!g||!node)return null;
 root=node;scene=node.querySelector("[data-auren-room-scene]");
 if(!scene)return null;
 scene.style.setProperty("--room-w",String(g.room.width));
 scene.style.setProperty("--room-d",String(g.room.depth));
 scene.style.setProperty("--room-h",String(g.room.height));
 node.setAttribute("data-room-ready","true");ready=true;
 const receipt=getReceipt();globalThis.dispatchEvent(new CustomEvent("auren:presentation-ready",{detail:receipt}));return receipt;
}
function getReceipt(){
 const rect=root?root.getBoundingClientRect():null;
 return Object.freeze({contract:CONTRACT,ready,renderer:"DOM_CSS_3D",webglContextCount:0,camera,viewport:rect?{cssWidth:Math.round(rect.width),cssHeight:Math.round(rect.height),devicePixelRatio:globalThis.devicePixelRatio||1}:null,geometryContract:globalThis.AUREN_ROOM_GEOMETRY?.contract||null});
}
Object.defineProperty(globalThis,"AUREN_ROOM_PRESENTATION",{value:Object.freeze({contract:CONTRACT,camera,mount,getReceipt}),writable:false,configurable:false});
})();