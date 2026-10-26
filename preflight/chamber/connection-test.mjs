import test from 'node:test';
import assert from 'node:assert/strict';
import {createConnection,SERVICE_ORIGIN,FEEDS} from './connection.mjs';
import {mountWebsiteConnection,WEBSITE_ORIGIN,FEEDS as SERVICE_FEEDS} from './service/website-connection.mjs';
function harness(){
 const events={},serviceEvents={},statuses=[],calls=[],dispatched=[];let failedRoute=null;
 let popup,nonce;
 const view={crypto:globalThis.crypto,Event,setTimeout,clearTimeout,setInterval,clearInterval,
 addEventListener:(k,f)=>events[k]=f,removeEventListener:k=>delete events[k],dispatchEvent:e=>dispatched.push(e.type),
 open:url=>{nonce=new URL(url).hash;popup={closed:false,close(){this.closed=true;},postMessage(m){queueMicrotask(()=>serviceEvents.message?.({origin:WEBSITE_ORIGIN,source:opener,data:m}));}};
 const service={location:{hash:nonce},opener,setTimeout,clearTimeout,setInterval,clearInterval,addEventListener:(k,f)=>serviceEvents[k]=f,removeEventListener:k=>delete serviceEvents[k]};
 const stop=mountWebsiteConnection(service,{fetchImpl:async route=>{calls.push(route);if(route===failedRoute)return new Response('',{status:401});return Response.json({schema:Object.values(SERVICE_FEEDS).find(x=>x[0]===route)[1],observedAt:'2026-10-17T07:05:23.245Z'});}});
 popup.stop=stop;return popup;}};
 const opener={closed:false,postMessage:m=>queueMicrotask(()=>events.message?.({origin:SERVICE_ORIGIN,source:popup,data:m}))};
 const client=createConnection(view,s=>statuses.push(s));
 return {client,statuses,calls,events,dispatched,fail:route=>failedRoute=route,get popup(){return popup;},close(){popup?.stop();client.destroy();}};
}
test('website and service handshake, read four feeds twice and preserve source dates',async()=>{
 const h=harness();h.client.connect();await new Promise(resolve=>setImmediate(resolve));
 try {for(let pass=0;pass<2;pass++)for(const route of Object.keys(FEEDS)){const r=await h.client.read(route);assert.equal((await r.json()).observedAt,'2026-10-17T07:05:23.245Z');}
 assert.equal(h.calls.length,8);assert.match(h.statuses.at(-1),/All four/);
 }finally{h.close();}
});
test('no connection, unknown routes and closed popup reject instead of returning local snapshots',async()=>{
 const h=harness();await assert.rejects(h.client.read('/api/briefings'),/NOT_CONNECTED/);await assert.rejects(h.client.read('/api/write'),/UNKNOWN_FEED/);
 h.client.connect();await new Promise(resolve=>setImmediate(resolve));h.popup.closed=true;await assert.rejects(h.client.read('/api/briefings'),/NOT_CONNECTED/);h.close();
});

test('partial refresh failure cannot be relabeled all-feeds success; disconnect notifies retained views',async()=>{
 const h=harness();h.client.connect();await new Promise(resolve=>setImmediate(resolve));
 try {for(const route of Object.keys(FEEDS))await h.client.read(route);
 h.fail('/api/study');await assert.rejects(h.client.read('/api/study'),/AUTH_REQUIRED/);
 await h.client.read('/api/briefings');assert.doesNotMatch(h.statuses.at(-1),/All four/);
 await assert.rejects(h.client.read('__proto__'),/UNKNOWN_FEED/);
 h.client.disconnect();assert.equal(h.dispatched.at(-1),'chamber:disconnected');
 }finally{h.close();}
});
