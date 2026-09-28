/* AUREN_SPATIAL_CHAMBER_ENVIRONMENT_PROOF1_v1
Owns only bounded custody-feature state. */
(()=>{"use strict";
const CONTRACT="AUREN_SPATIAL_CHAMBER_ENVIRONMENT_PROOF1_v1";
const STATES=Object.freeze({PROTECTED:"PROTECTED",REVEALED:"REVEALED"});
let state=STATES.PROTECTED,root=null;
function apply(){if(root)root.setAttribute("data-custody-state",state);globalThis.dispatchEvent(new CustomEvent("auren:environment-change",{detail:getReceipt()}));}
function mount(node){root=node;apply();return getReceipt();}
function reveal(){state=STATES.REVEALED;apply();return getReceipt();}
function protect(){state=STATES.PROTECTED;apply();return getReceipt();}
function getReceipt(){return Object.freeze({contract:CONTRACT,state,states:Object.values(STATES),geometryFeature:"custody-apse"});}
Object.defineProperty(globalThis,"AUREN_ROOM_ENVIRONMENT",{value:Object.freeze({contract:CONTRACT,STATES,mount,reveal,protect,getReceipt}),writable:false,configurable:false});
})();