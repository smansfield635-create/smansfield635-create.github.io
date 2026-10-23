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
console.log(JSON.stringify({result:"PASS",checkCount:pass,liveExecution:false,signedKernel:false}));
