/* AUREN_SPATIAL_CHAMBER_VOICE_PROOF1_v1
Owns Auren chamber dialogue only. Source-bound to AUREN_VALE_SANCTUARY_BUILDER_V1.
Does not own geometry, presentation, environment state, product truth, or navigation execution. */
(()=>{"use strict";
const CONTRACT="AUREN_SPATIAL_CHAMBER_VOICE_PROOF1_v1";
const responses=Object.freeze({
opening:["Come in.","I'm Auren Vale.","This room is meant to protect what matters without turning protection into a cage.","Ask me what you want to understand."],
sanctuary:["A sanctuary has to do more than keep danger out.","If nobody inside can choose, leave, question, or grow, protection has crossed into control."],
custody:["Custody means something has been placed in your care.","That gives you responsibility. It does not automatically give you ownership over the person or thing you are protecting."],
room:["This is my room, not the old product floor.","The architecture is part of the conversation now. Some things are visible. Some things are protected. The difference should have a reason."],
protected:["You noticed it.","I keep that part of the room protected because custody without boundaries is just display.","I can show you more without pretending that showing you means surrendering it."],
reveal:["All right. Look again.","Protection can change its posture without disappearing.","That is the point of this first threshold."],
archcoin:["ARCHCOIN intersects my work where value, custody, traceability, allocation, and protection meet.","Its official product truth still belongs to ARCHCOIN. I can discuss what those responsibilities mean from here."],
language:["The 1,001 Language work matters here because access is part of sanctuary.","Something useful that nobody can understand is not fully accessible. Its official product truth remains with Education."],
unveil:["'Auren Vale' sounding like 'our unveil' was an accident.","I like it as a resonance, not an origin story. A sanctuary can make revelation safer without forcing exposure."]
});
const prompts=Object.freeze([
{id:"sanctuary",label:"What makes a sanctuary?"},
{id:"custody",label:"What does custody mean to you?"},
{id:"room",label:"Tell me about this room."},
{id:"protected",label:"What are you protecting over there?"},
{id:"archcoin",label:"Where does ARCHCOIN fit?"},
{id:"language",label:"Where do the 1,001 Languages fit?"},
{id:"unveil",label:"What about “our unveil”?"}
]);
const api=Object.freeze({contract:CONTRACT,identity:"AUREN_VALE_SANCTUARY_BUILDER_V1",opening:responses.opening,prompts,response(id){return responses[id]||["Ask me another way."];},revealResponse:responses.reveal});
Object.defineProperty(globalThis,"AUREN_CHAMBER_VOICE",{value:api,writable:false,configurable:false});
globalThis.dispatchEvent(new CustomEvent("auren:voice-ready",{detail:{contract:CONTRACT}}));
})();