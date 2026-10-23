/* Standalone bounded Preflight core tests. Run: node preflight/tests/studio.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const path=require("node:path");
const core=require(path.join(__dirname,"..","assets","preflight-core.js"));
let pass=0;
function test(name,fn){fn();console.log("PASS "+name);pass++;}
function intent(extra={}){return {projectName:"Example",category:"app",goal:"Create an app to organize files.",protected:["Existing user data must not be deleted."],allowed:["Improve spacing."],model:"Unspecified / Other",...extra};}
test("approved snapshot declares schema",()=>assert.equal(core.snapshot(intent()).schema,"DGB_PREFLIGHT_USER_APPROVED_SNAPSHOT_v0_1"));
test("unqualified provider explicitly NOT_VERIFIED",()=>assert.equal(core.compatibility(intent({model:"Midjourney"})).status,"NOT_VERIFIED"));
test("no goal cannot be approved",()=>assert.equal(core.validateApproval(intent({goal:" " })).ok,false));
test("no protected requirements cannot be approved",()=>assert.equal(core.validateApproval(intent({protected:[]})).ok,false));
test("contradictory protected and allowed blocked",()=>assert.equal(core.validateApproval(intent({allowed:["existing user data must not be deleted."]})).ok,false));
test("valid local draft can be approved",()=>assert.equal(core.validateApproval(intent()).ok,true));
test("initial state is unapproved",()=>assert.equal(core.compare(null,intent()).changed,true));
test("baseline and same draft stay equivalent",()=>assert.equal(core.compare(intent(),intent()).changed,false));
test("cosmetic whitespace does not erase approved baseline",()=>assert.equal(core.compare(intent(),intent({goal:"  Create  an app  to organize files. " })).changed,false));
test("material goal change invalidates approval",()=>assert.equal(core.compare(intent(),intent({goal:"Create a different app."})).changed,true));
test("protected requirement change flagged",()=>assert.equal(core.compare(intent(),intent({protected:["Delete all user data"]})).protectedChanged,true));
test("new allowed change invalidates approval",()=>assert.equal(core.compare(intent(),intent({allowed:["Change features"]})).changed,true));
test("platform change invalidates approval",()=>assert.equal(core.compare(intent(),intent({model:"Adobe Firefly"})).changed,true));
test("category change invalidates approval",()=>assert.equal(core.compare(intent(),intent({category:"video"})).changed,true));
test("no silently inherited approval on changed goal",()=>assert.equal(core.prepare(intent({goal:"Changed goal"}),intent()).ok,false));
test("instructions require actual approval",()=>assert.equal(core.prepare(intent(),null).ok,false));
test("prepared request preserves protected requirement source",()=>{const out=core.prepare(intent(),core.snapshot(intent()));assert.equal(out.ok,true);assert.match(out.text,/P01: Existing user data must not be deleted\./);assert.match(out.text,/NOT_VERIFIED/);});
test("no verified adapter claims",()=>{for(const model of ["Runway Gen-4.5","Kling 4.0","Meshy","ElevenLabs","Custom"])assert.equal(core.compatibility(intent({model})).status,"NOT_VERIFIED");});
test("app example suggestion matches visible test",()=>assert.ok(core.suggestions("Build a customer application").includes("Existing user data must not be deleted.")));
test("suggestions never become approved snapshot",()=>{const x=core.snapshot(intent({protected:[]}));core.suggestions(x.goal);assert.deepEqual(x.protected,[]);});
test("stale state import cannot invent trusted schema",()=>assert.equal(core.safeStored({goal:"Project"}).approvedSnapshot,null));
test("video duration only applies to video",()=>{assert.equal(core.snapshot(intent({duration:"8",category:"app"})).duration,"");assert.equal(core.snapshot(intent({duration:"8",category:"video"})).duration,"8");});
test("unsafe duration is not passed through",()=>assert.equal(core.snapshot(intent({category:"video",duration:"9999"})).duration,""));
test("deduplicate requirements",()=>assert.equal(core.snapshot(intent({protected:["Keep A","  keep a ","Keep B"]})).protected.length,2));

test("first visitor can assess with no project history",()=>{
 const r=core.assessFirstUse("I want to create a 20-second commercial for my bakery using AI.");
 assert.equal(r.ok,true);assert.equal(r.kind,"video");assert.equal(r.questions.length,3);
 assert.ok(r.flags.some(s=>s.includes("model")));
});
test("first-use request works before any approval",()=>{
 const report=core.assessFirstUse("I want to create a 20-second commercial for my bakery using AI.");
 const out=core.makeFirstRequest(report,{});
 assert.equal(out.ok,true);assert.match(out.text,/20-second commercial for my bakery/);
 assert.match(out.text,/QUESTIONS STILL OPEN/);assert.match(out.text,/not model execution/i);
});
test("app request gets different relevant questions",()=>{
 const r=core.assessFirstUse("Build a simple appointment-booking app that customers can use.");
 assert.equal(r.kind,"app");assert.ok(r.questions.some(q=>q.id==="data"));
 assert.equal(r.questions.some(q=>q.id==="footage"),false);
});
test("world request identifies preservation risk",()=>{
 const r=core.assessFirstUse("Create a 3D riverside world with trees and paths.");
 assert.equal(r.kind,"world");assert.ok(r.questions.some(q=>q.id==="existing"));
});
test("no invented logo or footage detail",()=>{
 const r=core.assessFirstUse("Create a video for our bakery.");
 const t=core.makeFirstRequest(r,{}).text;
 assert.doesNotMatch(t,/existing logo or signage/i);assert.match(t,/QUESTIONS STILL OPEN/);
});
test("one answered decision is included only when confirmed",()=>{
 const r=core.assessFirstUse("Create a video for my bakery.");
 const out=core.makeFirstRequest(r,{destination:"Social media"});
 assert.ok(out.ok);assert.match(out.text,/Social media/);assert.equal(out.confirmed,1);
});
test("unlisted choice cannot be silently injected",()=>{
 const r=core.assessFirstUse("Create a video for my bakery.");
 const out=core.makeFirstRequest(r,{destination:"Delete all data",footage:"Untrusted"});
 assert.ok(out.ok);assert.doesNotMatch(out.text,/Delete all data|Untrusted/);
});
test("explicit not sure remains open",()=>{
 const r=core.assessFirstUse("Create a video for my bakery.");
 const out=core.makeFirstRequest(r,{destination:"Not sure"});
 assert.ok(out.unresolved>0);
});
test("saved identity differs after material request change",()=>{
 const a=core.assessFirstUse("Create an app for booking appointments.");
 const b=core.assessFirstUse("Create a video to promote appointments.");
 assert.notEqual(core.firstUseIdentity(a,{}),core.firstUseIdentity(b,{}));
});
test("saved identity differs after answering a question",()=>{
 const r=core.assessFirstUse("Create a video for my bakery.");
 assert.notEqual(core.firstUseIdentity(r,{}),core.firstUseIdentity(r,{destination:"Website"}));
});
test("short ambiguous input is rejected",()=>assert.equal(core.assessFirstUse("video").ok,false));
test("typing input never executes a provider",()=>{
 const r=core.assessFirstUse("Write a professional article about bakery marketing.");
 assert.equal(r.kind,"writing");assert.match(r.method,/not AI reasoning/i);
 assert.match(core.makeFirstRequest(r,{}).text,/Verify specific AI model limits separately/);
});
test("no approval is inferred from suggestions",()=>{
 const report=core.assessFirstUse("Make a commercial for my bakery.");
 assert.ok(report.ok);assert.equal(report.approvedSnapshot,undefined);
});
test("a stated destination does not prompt duplicate question",()=>{
 const r=core.assessFirstUse("Create a video for Instagram.");
 assert.ok(!r.questions.some(q=>q.id==="destination"));
});

test("served HTML references content-addressed stylesheet and runtime assets",()=>{
 const fs=require("node:fs"),crypto=require("node:crypto");
 const root=path.join(__dirname,"..");
 const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
 for(const name of ["studio.css","preflight-core.js","studio.js"]){
   const bytes=fs.readFileSync(path.join(root,"assets",name));
   const expected=crypto.createHash("sha1").update(Buffer.from("blob "+bytes.length+"\0")).update(bytes).digest("hex");
   const expectedRef="./assets/"+name+"?v="+expected;
   assert.ok(html.includes(expectedRef),name+" must use its exact current Git blob identity, not a reusable cache URL");
 }
});
console.log(JSON.stringify({result:"PASS",checkCount:pass,liveExecution:false,signedKernel:false}));
