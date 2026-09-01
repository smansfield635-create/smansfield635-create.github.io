#!/usr/bin/env node
import fs from 'node:fs';
const required = [
  'AGENTS.md',
  'AI_ENTRYPOINT.json',
  '.github/ai-router/shared-procedures.v1.json',
  '.github/ai-router/display-continuity-constitution-v1/README.md',
  '.github/ai-router/display-continuity-constitution-v1/display-constitution.v1.json'
];
const failures=[];
for(const p of required){if(!fs.existsSync(p)) failures.push(`MISSING:${p}`);}
const constitution=JSON.parse(fs.readFileSync(required[4],'utf8'));
const ai=JSON.parse(fs.readFileSync(required[1],'utf8'));
const shared=JSON.parse(fs.readFileSync(required[2],'utf8'));
const agents=fs.readFileSync(required[0],'utf8');
const must=(ok,id)=>{if(!ok)failures.push(id);};
must(constitution.schema==='WHOLE_ESTATE_DISPLAY_CONTINUITY_CONSTITUTION_v1','CONSTITUTION_SCHEMA');
must(constitution.status==='ACTIVE_MANDATORY_DEVELOPMENT_CONTEXT','CONSTITUTION_STATUS');
must(constitution.authoritySeparation?.globalOrientationAndNarrativeAnchor==='COMPASS','COMPASS_AUTHORITY');
must(constitution.authoritySeparation?.publicInformationDesignReference==='GOVERNANCE','GOVERNANCE_REFERENCE');
must(constitution.authoritySeparation?.claimAndProofAnchor==='EVIDENCE','EVIDENCE_ANCHOR');
must(constitution.authoritySeparation?.runtimeAndSemanticCeilingSource==='LAWS','LAWS_CEILING');
must(constitution.laws?.includes('VISUAL_CONTINUITY_MUST_PRESERVE_NARRATIVE_CONTINUITY'),'NARRATIVE_CONTINUITY_LAW');
must(constitution.laws?.includes('DISCOVERY_REVEALS_DEPTH_NOT_ANOTHER_DIRECTION'),'DISCOVERY_LAW');
must(constitution.runtimeCeilings?.rule==='CEILING_NOT_REQUIREMENT','RUNTIME_CEILING_RULE');
must(ai.displayContinuityConstitution?.locator==='.github/ai-router/display-continuity-constitution-v1/display-constitution.v1.json','AI_ENTRY_LOCATOR');
must(ai.displayContinuityConstitution?.status==='ACTIVE_MANDATORY_DEVELOPMENT_CONTEXT','AI_ENTRY_STATUS');
must(ai.rules?.includes('DISPLAY_CONTINUITY_CONSTITUTION_REQUIRED_FOR_APPLICABLE_CONSTRUCTION'),'AI_ENTRY_RULE');
const proc=shared.procedures?.find(p=>p.procedureId==='WHOLE_ESTATE_DISPLAY_CONTINUITY');
must(Boolean(proc),'SHARED_PROCEDURE');
must(proc?.authorityCreated===false,'SHARED_PROCEDURE_AUTHORITY_LIMIT');
must(agents.includes('## Whole-estate narrative and display continuity'),'AGENTS_SECTION');
must(agents.includes('.github/ai-router/display-continuity-constitution-v1/display-constitution.v1.json'),'AGENTS_LOCATOR');
must(agents.includes('does not widen mutation scope'),'AGENTS_SCOPE_LIMIT');
const receipt={schema:'WHOLE_ESTATE_DISPLAY_CONTINUITY_AI_ENTRY_VERIFICATION_RECEIPT_v1',result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',failures,authorityCreated:false,publicPageMutationRequired:false};
console.log(JSON.stringify(receipt,null,2));
process.exitCode=failures.length?1:0;
