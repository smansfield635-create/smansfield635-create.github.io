/* TARGET FILE: /products/auren/auren.voice.js
   AUREN_C2_PERSONALITY_PERFORMANCE_V1 */
(()=>{"use strict";
const CONTRACT="AUREN_C2_PERSONALITY_PERFORMANCE_V1";
const nodes=Object.freeze({
 root:{options:[["products","Products"],["about","About Auren"]]},
 products:{prompt:"Products",responses:["Sure.","What are you looking at?"],options:[["archcoin","ARCHCOIN"],["fiveFlags","Five Flags"],["moreProducts","More"]]},
 archcoin:{prompt:"ARCHCOIN",responses:["ARCHCOIN has four pieces.","Contract. Receivable. Payable. Allocation.","Only the first two are live right now."],options:[["archcoinWhat","What is it for?"],["archcoinLive","Which two are live?"],["archcoinFour","How do the four fit?"]]},
 archcoinWhat:{prompt:"What is it for?",responses:["The useful part is the structure.","Four related token domains, with a clean line between what's actually launched and what's still prospective."],options:[["archcoinLive","What's live now?"],["archcoinCapabilities","What can the live ones do?"],["archcoinGo","Show me ARCHCOIN"]]},
 archcoinLive:{prompt:"Which two are live?",responses:["ARCC for Contract. ARCR for Receivable.","Both are launched on Ethereum mainnet.","Payable and Allocation aren't live yet."],options:[["archcoinCapabilities","What can those two do?"],["archcoinFour","And the other two?"],["archcoinGo","Show me ARCHCOIN"]]},
 archcoinFour:{prompt:"How do the four fit?",responses:["Contract is ARCC. Receivable is ARCR.","Payable is ARCP. Allocation is ARCA.","Same family. Different jobs. And again—only the first two are live."],options:[["archcoinLive","Which are live?"],["archcoinCapabilities","What can the live ones do?"],["archcoinGo","Show me ARCHCOIN"]]},
 archcoinCapabilities:{prompt:"What can the live ones do?",responses:["Balances, transfers, and approvals—the normal ERC-20 mechanics.","What I won't do is turn that into a claim about price, liquidity, or adoption. It isn't one."],options:[["archcoinGo","Show me the evidence"],["products","Back to Products"]]},
 archcoinGo:{prompt:"Show me ARCHCOIN",route:"/products/archcoin/",responses:["Good.","That page owns the product evidence. I'll take you there."]},
 fiveFlags:{prompt:"Five Flags",responses:["That's a signal game.","One Flag Master guides the room with a deliberately small set of signals instead of just handing everyone the answer."],options:[["products","Back to Products"],["about","About Auren"]]},
 moreProducts:{prompt:"More",responses:["All right.","Education, Nutrition, or the community side?"],options:[["education","Education"],["nutrition","Nutrition"],["community","Community"]]},
 education:{prompt:"Education",responses:["The current piece is the English Fluency Accelerator.","It works around 1,001 words and concepts, productive patterns, and adaptive placement."],options:[["products","Back to Products"],["moreProducts","More"]]},
 nutrition:{prompt:"Nutrition",responses:["Baseline Nutrition Systems keeps it practical.","Water. Fuel. Timing. Reset. Pantry fallback.","Baseline first. Optimization later."],options:[["products","Back to Products"],["moreProducts","More"]]},
 community:{prompt:"Community",responses:["That's the public community side of the work—Consider the Energy and Consider the Community.","Not everything here needs to be a commercial product."],options:[["products","Back to Products"],["about","About Auren"]]},
 about:{prompt:"About Auren",responses:["I'm Auren.","I look after the place. People too, when they'll let me."],options:[["who","What does that mean?"],["mirrorland","What's Mirrorland?"],["room","Tell me about your room"]]},
 who:{prompt:"What does that mean?",responses:["Mostly? I make sure people have somewhere safe to land.","Then I try not to make their decisions for them. The second part is harder than it sounds."],options:[["work","What do you actually do?"],["mirrorland","What's Mirrorland?"],["people","Who else is here?"]]},
 work:{prompt:"What do you actually do?",responses:["A little hosting. A lot of decisions nobody notices unless I get one wrong.","Who comes in. What stays private. When a closed door is helping—and when it's just a closed door."],options:[["room","What happens in this room?"],["people","Who else is here?"],["products","What about the products?"]]},
 mirrorland:{prompt:"What's Mirrorland?",responses:["The larger world outside this room.","There are other people here, other places, other problems. Mine just happen to come with a lot of doors."],options:[["people","Who else is here?"],["room","Tell me about your room"],["who","Back to you"]]},
 people:{prompt:"Who else is here?",responses:["Other people with their own stories.","I'll tell you where our paths cross. I won't pretend their story is mine to tell."],options:[["mirrorland","More about Mirrorland"],["who","Back to you"],["products","Products"]]},
 room:{prompt:"Tell me about your room",responses:["Ideally? You walk in, sit down, and we can actually talk.","If the room makes you work harder than the conversation does, I've got a room problem."],options:[["work","What do you do here?"],["mirrorland","What's outside?"],["products","Products"]]}
});
const api=Object.freeze({contract:CONTRACT,identity:"AUREN_VALE_SANCTUARY_BUILDER_V1",opening:["Come in.","I'm Auren. If you're here for the work, I can show you around. If you're here because you're curious about me, that's fine too."],getNode:id=>nodes[id]||null,getOptions(id="root"){const n=nodes[id]||nodes.root;return(n.options||[]).map(([id,label])=>Object.freeze({id,label}));}});
Object.defineProperty(globalThis,"AUREN_CHAMBER_VOICE",{value:api,writable:false,configurable:false});
globalThis.dispatchEvent(new CustomEvent("auren:voice-ready",{detail:{contract:CONTRACT}}));
})();
