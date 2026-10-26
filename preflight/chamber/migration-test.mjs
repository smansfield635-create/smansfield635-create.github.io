import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {KEYS} from '../app/dist/packet.mjs';
import {ensureFlow} from '../app/dist/progression.mjs';
import {WORKSPACE_KEY,createEmptyWorkspace,validateWorkspace,workspaceBackup,decodeWorkspaceBackup,mergeWorkspaceBackup,openChamberProject} from '../app/dist/workspace-bridge.mjs';
import {localFetch} from './local-data.mjs';
import {sourceResponseToSnapshot} from './workspace-ui.mjs';

const oldTime='2026-09-01T12:00:00Z',newTime='2026-10-25T22:00:00Z';
const fact=text=>({text,basis:'NOT_ESTABLISHED',sources:[]});
function briefing(projectId='TEST_CATALOGUE'){
 return {projectId,observedAt:oldTime,sourceHeads:[{repository:'smansfield635-create/smansfield635-create.github.io',head:'a'.repeat(40)}],accomplishment:fact('Draft prepared; source claim only'),publication:fact('Not published'),unfinished:fact('Verify catalogue'),blocker:fact('No blocker established'),nextStep:fact('Compare catalogue to the exhibit list'),instruments:[]};
}
function chamber(records=[briefing()]){
 return {schema:'diamondgate.chamber-local.v1',captures:{controlPlane:null,study:null,briefings:{schema:'DGB_PROJECT_BRIEFINGS_v1',updatedAt:oldTime,records},agents:null},links:[],updatedAt:oldTime};
}
function project(id='existing'){
 const fields={...Object.fromEntries(KEYS.map(k=>[k,''])),project:'Existing owner project',goal:'Preserve the project',state:'Work remains',next:'Verify existing result',remaining:'Verify existing result',authorization:'Inspection permitted',phase:'VERIFICATION'};
 const p={id,title:fields.project,request:'Owner draft next direction',checkpoints:[{id:id+'-first',parent:null,at:oldTime,raw:'Original owner packet',fields},{id:id+'-second',parent:id+'-first',at:newTime,raw:'Later unchanged history',fields:{...fields,state:'Current state'}}]};ensureFlow(p,'fixture-owner');return p;
}
function workspace(){const db=createEmptyWorkspace();db.projects=[project()];db.selected='existing';db.inbox='Unprocessed initial packet';db.newIntent='Unsaved new project intent';db.updates={existing:'Unprocessed returned response'};db.chamber=chamber();return db;}

test('both applications use the existing DiamondGate workspace key',()=>assert.equal(WORKSPACE_KEY,'diamondgate.projects.v2'));
test('an empty migrated workspace contains no bundled owner projects or source captures',()=>{
 const db=createEmptyWorkspace();validateWorkspace(db);assert.equal(db.projects.length,0);
 for(const capture of Object.values(db.chamber?.captures||{}))assert.equal(capture,null);
});
test('combined backup round-trip preserves complete existing projects, drafts, history and source dates',()=>{
 const db=workspace(),before=structuredClone(db);validateWorkspace(db);
 const restored=decodeWorkspaceBackup(workspaceBackup(db));
 assert.deepEqual(restored,before);assert.deepEqual(db,before);
 assert.equal(restored.chamber.captures.briefings.records[0].observedAt,oldTime);
 assert.equal(restored.chamber.captures.briefings.updatedAt,oldTime);
});
test('opening a Chamber project links once and does not overwrite another project or drafts',()=>{
 const db=workspace(),original=structuredClone(db),first=openChamberProject(db,'TEST_CATALOGUE',{now:newTime,idFactory:()=> 'linked-catalogue'});
 assert.equal(first.created,true);assert.equal(first.workspace.projects.length,2);assert.deepEqual(db,original);
 assert.deepEqual(first.workspace.projects.find(p=>p.id==='existing'),original.projects[0]);
 for(const [id,draft]of Object.entries(original.updates))assert.equal(first.workspace.updates[id],draft);
 assert.equal(first.workspace.inbox,original.inbox);assert.equal(first.workspace.newIntent,original.newIntent);
 const linked=first.workspace.projects.find(p=>p.id===first.projectId);assert(linked);
 assert.equal(linked.progress?.decisions.length||0,0);assert.equal(linked.flow?.userDecision??null,null);
 linked.request='Owner edits must survive later Chamber opening';
 first.workspace.updates[linked.id]='Owner pending response';
 const second=openChamberProject(first.workspace,'TEST_CATALOGUE',{now:'2026-10-26T00:00:00Z',idFactory:()=> 'should-not-create'});
 assert.equal(second.created,false);assert.equal(second.projectId,first.projectId);assert.equal(second.workspace.projects.length,2);
 assert.equal(second.workspace.projects.find(p=>p.id===first.projectId).request,linked.request);
 assert.equal(second.workspace.updates[linked.id],'Owner pending response');
});
test('opening a mapped Trash project cannot silently revive it or create a duplicate',()=>{
 const opened=openChamberProject(workspace(),'TEST_CATALOGUE',{now:newTime,idFactory:()=> 'linked-catalogue'});
 const db=opened.workspace;db.projects.find(p=>p.id===opened.projectId).deletedAt=newTime;
 const before=structuredClone(db);assert.throws(()=>openChamberProject(db,'TEST_CATALOGUE'));assert.deepEqual(db,before);
});
test('same display name does not fabricate a cross-app identity match',()=>{
 const db=workspace();db.projects[0].title='Test Catalogue';db.projects[0].checkpoints.at(-1).fields.project='Test Catalogue';
 const opened=openChamberProject(db,'TEST_CATALOGUE',{now:newTime,idFactory:()=> 'new-link'});
 assert.equal(opened.created,true);assert.notEqual(opened.projectId,'existing');
});
test('same combined backup can be merged twice without duplicate projects or links',()=>{
 const original=openChamberProject(workspace(),'TEST_CATALOGUE',{now:newTime,idFactory:()=> 'linked-catalogue'}).workspace;
 const incoming=decodeWorkspaceBackup(workspaceBackup(original));
 const first=mergeWorkspaceBackup(original,incoming).workspace;
 const second=mergeWorkspaceBackup(first,incoming).workspace;
 assert.deepEqual(second.projects,original.projects);assert.deepEqual(second.updates,original.updates);assert.deepEqual(second.chamber.links,original.chamber.links);
});
test('conflicting project identity in combined restore leaves local work unchanged',()=>{
 const current=workspace(),incoming=structuredClone(current);incoming.projects[0].request='Different owner state';const before=structuredClone(current);
 assert.throws(()=>mergeWorkspaceBackup(current,incoming));assert.deepEqual(current,before);
});
test('conflicting unprocessed draft in combined restore is not silently overwritten',()=>{
 const current=workspace(),incoming=structuredClone(current);incoming.updates.existing='Different pending response';const before=structuredClone(current);
 assert.throws(()=>mergeWorkspaceBackup(current,incoming));assert.deepEqual(current,before);
});
test('malformed shared capture cannot overwrite existing workspace',()=>{
 const current=workspace(),incoming=structuredClone(current);incoming.chamber.captures.briefings={schema:'unrecognized',records:[{projectId:'TEST_CATALOGUE'}]};const before=structuredClone(current);
 assert.throws(()=>mergeWorkspaceBackup(current,incoming));assert.deepEqual(current,before);
});
for(const [kind,capture]of Object.entries({
 controlPlane:{schema:'DGB_OPERATIONS_CHAMBER_DASHBOARD_DATA_v1',observedAt:oldTime,projects:[],repositories:[]},
 study:{schema:'DGB_HOSTED_STUDY_CAPTURE_v1',capturedAt:oldTime,rollingStudy:{through:oldTime}},
 agents:{schema:'DGB_CHAMBER_AGENT_DELIVERIES_v1',records:[{receivedAt:oldTime}]}
}))test('correct schema does not admit incomplete '+kind+' renderer data',()=>{
 const db=workspace();db.chamber.captures[kind]=capture;assert.throws(()=>validateWorkspace(db));
});
test('agent evidence links cannot import an executable URL',()=>{
 const db=workspace();db.chamber.captures.agents={schema:'DGB_CHAMBER_AGENT_DELIVERIES_v1',records:[{receivedAt:oldTime,event:{projectId:'TEST_CATALOGUE',operationId:'TEST_ONLY',phase:'COMPLETED',summary:'Synthetic report',occurredAt:oldTime,githubEvidenceUrl:'javascript:alert(1)'}}]};
 assert.throws(()=>validateWorkspace(db));
});
test('newer briefing merge preserves existing DiamondGate checkpoint/draft bytes and incoming source timestamp',()=>{
 const current=workspace(),incoming=createEmptyWorkspace();incoming.chamber=chamber();incoming.chamber.captures.briefings.updatedAt=newTime;incoming.chamber.captures.briefings.records[0].observedAt=newTime;incoming.chamber.updatedAt=newTime;
 const merged=mergeWorkspaceBackup(current,incoming).workspace;
 assert.deepEqual(merged.projects,current.projects);assert.deepEqual(merged.updates,current.updates);
 assert.equal(merged.chamber.captures.briefings.records[0].observedAt,newTime);
});
test('newer partial briefing import preserves other existing Chamber projects',()=>{
 const current=workspace();current.chamber=chamber([briefing('TEST_CATALOGUE'),briefing('TEST_EXHIBITION')]);
 const incoming=createEmptyWorkspace();incoming.chamber=chamber();incoming.chamber.captures.briefings.updatedAt=newTime;incoming.chamber.captures.briefings.records[0].observedAt=newTime;
 const merged=mergeWorkspaceBackup(current,incoming).workspace;
 assert.equal(merged.chamber.captures.briefings.records.length,2);
 assert.equal(merged.chamber.captures.briefings.records.find(r=>r.projectId==='TEST_EXHIBITION').observedAt,oldTime);
});
test('local feed refresh preserves source dates and never writes a freshness update',async()=>{
 const db=workspace(),raw=JSON.stringify(db);let writes=0;const storage={getItem:key=>{assert.equal(key,WORKSPACE_KEY);return raw;},setItem:()=>{writes++;}};
 const first=await(await localFetch('/api/briefings',{storage})).json();
 const second=await(await localFetch('/api/briefings',{storage})).json();
 assert.deepEqual(first,second);assert.equal(first.updatedAt,oldTime);assert.equal(first.records.find(r=>r.projectId==='TEST_CATALOGUE').observedAt,oldTime);assert.equal(writes,0);
 assert.equal((await localFetch('/api/study',{storage})).ok,false,'missing study is not invented');
});
test('DiamondGate local project appears without fabricated source review or acceptance',async()=>{
 const db=createEmptyWorkspace();db.projects=[project()];const storage={getItem:()=>JSON.stringify(db)};
 const data=await(await localFetch('/api/briefings',{storage})).json();const local=data.records.find(r=>r.localOnly);
 assert(local);assert.equal(local.observedAt,undefined);assert.equal(local.localProjects[0].source,'BROWSER_LOCAL_DIAMONDGATE');
 assert.equal(local.localProjects[0].humanAcceptanceCount,0);assert.equal(local.localProjects[0].adoptedRequirementCount,0);
});

const root=fileURLToPath(new URL('.',import.meta.url));
function productionFiles(dir=root){return readdirSync(dir).flatMap(name=>{const path=dir+name;return statSync(path).isDirectory()?productionFiles(path+'/'):/\.(?:html|mjs|js|json|css|svg)$/.test(name)&&!/-test\.mjs$/.test(name)?[path]:[];});}
test('public port has original navigation roots and noindex without claiming authentication',()=>{
 const html=readFileSync(root+'index.html','utf8');
 for(const id of ['home-view','overview','instrument-view','system-view','evidence-view'])assert(html.includes('id="'+id+'"'),id+' retained');
 assert.match(html,/noindex/i);assert.doesNotMatch(html,/owner-only access|authenticated private workspace/i);
});
test('production assets contain no private repository snapshots; connection names only the existing service',()=>{
 const files=productionFiles();assert(files.length>1);
 for(const path of files){const text=readFileSync(path,'utf8');
  assert.doesNotMatch(text,/geodiametrics1|appgdep_6adc3af2b11c8191932001f192f0e5ba/,path);
  assert.doesNotMatch(text,/fetch\s*\(\s*['"](?:\/api\/|\/data\.json|https?:)/,path+' must not fetch old host/API data');
 }
});


test('ordinary-room source response updates saved briefings without erasing project history or drafts',()=>{
 const before=workspace(),original=structuredClone(before),newBrief={...briefing(),observedAt:newTime};
 const source={schema:'DGB_PROJECT_BRIEFINGS_v1',updatedAt:newTime,records:[newBrief]};
 const incoming=decodeWorkspaceBackup(sourceResponseToSnapshot(JSON.stringify(source),newTime));
 const merged=mergeWorkspaceBackup(before,incoming);
 assert.deepEqual(before,original);
 assert.deepEqual(merged.workspace.projects,original.projects);
 assert.deepEqual(merged.workspace.updates,original.updates);
 assert.equal(merged.workspace.chamber.captures.briefings.updatedAt,newTime);
 assert.equal(merged.workspace.chamber.captures.briefings.records[0].observedAt,newTime);
 assert(merged.updatedCaptures.includes('briefings'));
 const second=mergeWorkspaceBackup(merged.workspace,incoming);
 assert.deepEqual(second.workspace,merged.workspace);
 assert.equal(second.updatedCaptures.length,0);
});
test('older source response never replaces newer briefing and preserves old source timing',()=>{
 const current=workspace(),newRecord={...briefing(),observedAt:newTime};
 current.chamber.captures.briefings={schema:'DGB_PROJECT_BRIEFINGS_v1',updatedAt:newTime,records:[newRecord]};
 const incoming=decodeWorkspaceBackup(sourceResponseToSnapshot(JSON.stringify({
  schema:'DGB_PROJECT_BRIEFINGS_v1',updatedAt:oldTime,records:[briefing()]
 }),newTime));
 const merged=mergeWorkspaceBackup(current,incoming);
 assert.equal(merged.updatedCaptures.length,0);
 assert.equal(merged.workspace.chamber.captures.briefings.records[0].observedAt,newTime);
});
test('malformed and unsupported source payloads fail before any existing data changes',()=>{
 const current=workspace(),original=structuredClone(current);
 for(const text of [
  'This Chamber is currently updated.',
  '[]',
  '{"schema":"UNSUPPORTED"}',
  '{"structuredContent":{"schema":"DGB_PROJECT_BRIEFINGS_v1"}}'
 ])assert.throws(()=>sourceResponseToSnapshot(text,newTime));
 const incomplete=sourceResponseToSnapshot(JSON.stringify({schema:'DGB_PROJECT_BRIEFINGS_v1',records:[{}]}),newTime);
 assert.throws(()=>decodeWorkspaceBackup(incomplete));
 assert.deepEqual(current,original);
});
for(const [schema,key] of Object.entries({
 DGB_OPERATIONS_CHAMBER_DASHBOARD_DATA_v1:'controlPlane',
 DGB_HOSTED_STUDY_CAPTURE_v1:'study',
 DGB_PROJECT_BRIEFINGS_v1:'briefings',
 DGB_CHAMBER_AGENT_DELIVERIES_v1:'agents'
}))test('source response preserves '+key+' evidence and distinct receipt time',()=>{
 const original={schema,observedAt:oldTime,updatedAt:oldTime,example:'Source value'};
 const wrapper=JSON.parse(sourceResponseToSnapshot(JSON.stringify(original),newTime));
 assert.equal(wrapper.schema,'diamondgate.chamber-capture.v1');
 assert.equal(wrapper.capturedAt,newTime);
 assert.deepEqual(wrapper.captures[key],original);
 assert.deepEqual(Object.keys(wrapper.captures),[key]);
});
