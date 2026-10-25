import test from 'node:test';
import assert from 'node:assert/strict';
import {workspaceStorage,WorkspaceChangedError} from './dist/storage.mjs';
import {KEYS,projectBackup,decodeProjectBackup,decodeBackup} from './dist/packet.mjs';
function memory(initial=null){let value=initial;return {getItem:()=>value,setItem:(key,next)=>{value=next;}};}
const key='existing-workspace';
test('an older tab cannot silently overwrite a later saved project state',()=>{const storage=memory(JSON.stringify({projects:['initial']})),a=workspaceStorage(()=>storage,key),b=workspaceStorage(()=>storage,key);a.read();b.read();a.write({projects:['initial','new-project'],draft:'new evidence'});const accepted=storage.getItem(key);assert.throws(()=>b.write({projects:['old tab state']}),WorkspaceChangedError);assert.equal(storage.getItem(key),accepted);});
test('ordinary saves reuse the existing record and a reload can resume after a conflict',()=>{const storage=memory(),a=workspaceStorage(()=>storage,key);assert.equal(a.read(),null);a.write({projects:['one']});a.write({projects:['one','two']});const b=workspaceStorage(()=>storage,key);assert.deepEqual(JSON.parse(b.read()),{projects:['one','two']});b.write({projects:['one','two'],selected:'two'});assert.throws(()=>a.write({projects:['one']}),WorkspaceChangedError);});
test('quota failures leave the previous saved bytes untouched',()=>{const original='original saved data';const storage={getItem:()=>original,setItem:()=>{throw Error('Quota exceeded');}};const saved=workspaceStorage(()=>storage,key);saved.read();assert.throws(()=>saved.write({projects:['new']}),/Quota/);assert.equal(storage.getItem(key),original);});
test('project backups round-trip unprocessed drafts and preserve old-format compatibility',async()=>{const p={id:'one',title:'One',request:'',checkpoints:[{id:'base',parent:null,at:'2026-10-23T00:00:00Z',raw:'original',fields:Object.fromEntries(KEYS.map(k=>[k,'']))}]};const draft='Unprocessed returned response\nwith evidence and unresolved questions';const text=projectBackup(p,draft);assert.deepEqual(await decodeProjectBackup(text),{project:p,draft});assert.deepEqual(await decodeBackup(text),p);const old=JSON.stringify({schema:'diamondgate.packet-project.v2',project:p});assert.deepEqual(await decodeProjectBackup(old),{project:p,draft:''});assert.throws(()=>projectBackup(p,{}),/draft/);await assert.rejects(decodeProjectBackup(JSON.stringify({schema:'diamondgate.packet-project.v2',project:p,draft:42})),/draft/);});
test('restored-copy labels distinguish the UI without changing source project identity',async()=>{const {projectName,projectDisplayName}=await import('./dist/packet.mjs');const fields={...Object.fromEntries(KEYS.map(k=>[k,''])),project:'Novel'};const original={id:'one',title:'Novel',request:'',checkpoints:[{id:'base',parent:null,at:'2026-10-23T00:00:00Z',raw:'original',fields}]};const copy=structuredClone(original);copy.id='two';copy.localLabel='Novel · restored copy 02ab';assert.equal(projectName(original),projectName(copy));assert.notEqual(projectDisplayName(original),projectDisplayName(copy));const restored=await decodeProjectBackup(projectBackup(copy,'saved draft'));assert.equal(projectDisplayName(restored.project),copy.localLabel);assert.equal(restored.draft,'saved draft');});

test('Trash restoration enforces the same active-project capacity as backup import',async()=>{
 const {restoreProject}=await import('./dist/lifecycle.mjs');
 const active=Array.from({length:20},(_,i)=>({id:'active-'+i}));
 const trashed={id:'saved',deletedAt:'2026-10-25T00:00:00Z'};
 const db={projects:[...active,trashed],selected:'active-0',updates:{saved:'Retained draft'}};
 const before=structuredClone(db);
 assert.throws(()=>restoreProject(db,'saved'),/20 active projects/);assert.deepEqual(db,before);
 db.projects[0].deletedAt='2026-10-25T00:00:00Z';restoreProject(db,'saved');
 assert.equal(db.selected,'saved');assert.equal(db.updates.saved,'Retained draft');assert.equal(trashed.deletedAt,undefined);
});
