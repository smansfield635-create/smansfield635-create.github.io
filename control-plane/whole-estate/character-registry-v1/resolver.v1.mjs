import fs from "node:fs";
import path from "node:path";
const ROOT=path.dirname(new URL(import.meta.url).pathname);
export function resolveCharacter(characterId){
  const registry=JSON.parse(fs.readFileSync(path.join(ROOT,"registry.v1.json"),"utf8"));
  const entry=registry.profiles?.[characterId];
  if(!entry) return {schema:"CHARACTER_INSTANTIATION_RESULT_v1",result:"CHARACTER_PROFILE_INCOMPLETE_HOLD",characterId,reason:"CHARACTER_NOT_REGISTERED"};
  if(entry.status!=="READY"||!entry.path) return {schema:"CHARACTER_INSTANTIATION_RESULT_v1",result:"CHARACTER_PROFILE_INCOMPLETE_HOLD",characterId,reason:"PROFILE_NOT_MATERIALIZED"};
  const repoRoot=path.resolve(ROOT,"../../..");
  const profile=JSON.parse(fs.readFileSync(path.join(repoRoot,entry.path),"utf8"));
  const required=["schema","characterId","displayName","status","canon","modes","developmentAuthority","forbiddenAuthority","provenance","knownNullFields","instantiationContract"];
  const missing=required.filter(k=>profile[k]===undefined||profile[k]===null);
  if(missing.length||profile.status!=="READY") return {schema:"CHARACTER_INSTANTIATION_RESULT_v1",result:"CHARACTER_PROFILE_INCOMPLETE_HOLD",characterId,reason:"PROFILE_INCOMPLETE",missing};
  return {schema:"CHARACTER_INSTANTIATION_RESULT_v1",result:"CHARACTER_INSTANTIATION_READY",characterId,profile};
}
if(process.argv[1]&&path.resolve(process.argv[1])===new URL(import.meta.url).pathname){console.log(JSON.stringify(resolveCharacter(process.argv[2]||""),null,2));}
