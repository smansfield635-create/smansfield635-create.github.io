/* TARGET FILE: /products/auren/auren.scene-offer.js
   AUREN_C3_6_SCENE_OFFER_BRIDGE_V1 */
(()=>{"use strict";
const CONTRACT="AUREN_C3_6_SCENE_OFFER_BRIDGE_V1",CORRIDOR=new Set(["manor","auren","jeeves"]),REGISTRY=Object.freeze({manor:"/characters/?scene=manor&entry=fade",auren:"/characters/?scene=auren&entry=fade",jeeves:"/characters/?scene=jeeves&entry=fade"});
function evaluate({sourceNode=null,relationship=null,destinationId="manor",inLearnPath=false}={}){
 const route=REGISTRY[destinationId]||null,registryValidated=Boolean(route&&CORRIDOR.has(destinationId)),phase=relationship?.phase||"PUBLIC",eligible=Boolean(inLearnPath&&phase==="ENGAGED"&&registryValidated);
 return Object.freeze({contract:CONTRACT,sourceNode,relationshipPhase:phase,destinationId,destinationRoute:route,registryValidated,eligible,offered:eligible,reason:!registryValidated?"DESTINATION_REJECTED":!inLearnPath?"NOT_LEARN_PATH":phase!=="ENGAGED"?"RELATIONSHIP_NOT_ENGAGED":"OFFER_AUTHORIZED"});
}
Object.defineProperty(globalThis,"AUREN_SCENE_OFFER",{value:Object.freeze({contract:CONTRACT,evaluate,routeFor:id=>REGISTRY[id]||null}),writable:false,configurable:false});globalThis.dispatchEvent(new CustomEvent("auren:scene-offer-ready",{detail:{contract:CONTRACT}}));
})();