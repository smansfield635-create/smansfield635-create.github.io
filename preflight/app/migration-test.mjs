import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {KEYS,projectBackup,decodeProjectBackup} from './dist/packet.mjs';
const manifest=JSON.parse(fs.readFileSync(new URL('./source-manifest.json',import.meta.url)));
test('all migrated runtime bytes match the original qualified source',()=>{
 for(const f of manifest.runtimeFiles)assert.equal(createHash('sha256').update(fs.readFileSync(new URL(f.path,import.meta.url))).digest('hex'),f.sha256,f.path);
});
test('nested website entry and module dependencies resolve without root assets',()=>{
 const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
 assert(!/(?:src|href)="\//.test(html));
 for(const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g))assert(fs.existsSync(new URL(match[1],import.meta.url)),match[1]);
 for(const f of manifest.runtimeFiles.filter(f=>f.path.endsWith('.mjs'))){
  const url=new URL(f.path,import.meta.url),s=fs.readFileSync(url,'utf8');
  for(const m of s.matchAll(/from\s*['"](\.[^'"]+)['"]/g))assert(fs.existsSync(new URL(m[1],url)),m[1]);
 }
 assert(!manifest.runtimeFiles.some(f=>/instrumentation|qa-|audit/.test(f.path)));
});
test('portable backup preserves accepted history and unfinished draft across origins',async()=>{
 const fields={...Object.fromEntries(KEYS.map(k=>[k,''])),project:'Synthetic migration project',goal:'Write a guide',next:'Review the guide'};
 const project={id:'migration-project',title:fields.project,request:'',checkpoints:[{id:'first',parent:null,at:'2026-10-25T00:00:00Z',raw:'Synthetic source report',fields},{id:'second',parent:'first',at:'2026-10-25T01:00:00Z',raw:'Synthetic second report',fields:{...fields,state:'Draft written'}}]};
 const first=await decodeProjectBackup(projectBackup(project,'Unfinished synthetic draft'));
 const second=await decodeProjectBackup(projectBackup(first.project,first.draft));
 assert.deepEqual(second.project,project);assert.equal(second.draft,'Unfinished synthetic draft');
 const damaged=JSON.parse(projectBackup(project));damaged.project.checkpoints[1].parent='wrong';
 await assert.rejects(decodeProjectBackup(JSON.stringify(damaged)),/history/i);
});
