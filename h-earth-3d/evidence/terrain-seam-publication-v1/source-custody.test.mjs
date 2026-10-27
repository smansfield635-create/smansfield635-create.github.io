import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
const e=JSON.parse(fs.readFileSync(new URL('./evidence.json',import.meta.url)));
test('release runtime blobs equal reviewed source candidate',()=>{for(const f of e.files)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(f.path)).digest('hex'),f.sha256,f.path);});
