import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),js=read('app.mjs'),core=read('progression.mjs');
assert.match(html,/noindex,nofollow,noarchive/);
assert.match(html,/Development Lab/);
assert.match(html,/type="module" src="\.\/app\.mjs"/);
assert.match(js,/\.\/progression\.mjs/);
assert.match(js,/textContent/);
for(const s of [html,js,core]){
  assert(!/sk-proj-|ghp_[A-Za-z0-9]{12}|AIza[A-Za-z0-9]{15}/.test(s),'Credential-like string');
}
for(const forbidden of ['localStorage','sessionStorage','XMLHttpRequest','fetch(','innerHTML','eval(','new Function(']){
  assert(!js.includes(forbidden),`App contains prohibited ${forbidden}`);
}
assert(!fs.existsSync(path.resolve(root,'../../index.html')),'Unexpected mutation of existing preflight entry point in staging');
console.log('Boundary PASS: noindex, no navigation, memory-only browser app, no network calls, no credential signatures.');
