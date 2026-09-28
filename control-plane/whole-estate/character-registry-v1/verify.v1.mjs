import fs from "node:fs";
import path from "node:path";
import {resolveCharacter} from "./resolver.v1.mjs";
const ROOT=path.dirname(new URL(import.meta.url).pathname);
const registry=JSON.parse(fs.readFileSync(path.join(ROOT,"registry.v1.json"),"utf8"));
const a=resolveCharacter("AUREN_VALE");
if(a.result!=="CHARACTER_INSTANTIATION_READY") throw new Error("AUREN_NOT_READY");
for(const id of Object.keys(registry.profiles).filter(x=>x!=="AUREN_VALE")){
  const r=resolveCharacter(id); if(r.result!=="CHARACTER_PROFILE_INCOMPLETE_HOLD") throw new Error("FAIL_CLOSED_VIOLATION:"+id);
}
if(a.profile.canon.primaryTrait!=="Custody") throw new Error("CUSTODY_BINDING_MISSING");
if(a.profile.canon.governingTension!=="protection versus control") throw new Error("TENSION_BINDING_MISSING");
if(a.profile.currentDevelopmentContext.onYourSideAI!=="REMOVED_FROM_CURRENT_PRODUCT_LANDSCAPE_NOT_AUREN_CANON") throw new Error("REMOVED_PRODUCT_BOUNDARY_MISSING");
console.log(JSON.stringify({schema:"CHARACTER_REGISTRY_VERIFICATION_v1",result:"PASS_CLOSED",characterId:"AUREN_VALE",instantiation:a.result,failClosedShellCount:7},null,2));
