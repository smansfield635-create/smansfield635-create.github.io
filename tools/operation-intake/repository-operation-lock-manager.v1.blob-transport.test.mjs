import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const EXPECTED='0872a4f6239bb991b0fdf8c62b86abc05f19eaa6';
const gitBlobSha=bytes=>createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\\0`,'utf8'),bytes])).digest('hex');

test('exact historical ledger blob fixture identity is frozen',()=>{
  assert.equal(EXPECTED,'0872a4f6239bb991b0fdf8c62b86abc05f19eaa6');
});

test('Git-object correspondence guard rejects altered transport bytes before parsing',()=>{
  const bytes=Buffer.from('{"schema":"transport-corrupted"}\n','utf8');
  assert.notEqual(gitBlobSha(bytes),EXPECTED);
  assert.throws(()=>{const actual=gitBlobSha(bytes);if(actual!==EXPECTED){const e=new Error('LEDGER_BLOB_TRANSPORT_CORRESPONDENCE_FAILURE');e.code='LEDGER_BLOB_TRANSPORT_CORRESPONDENCE_FAILURE';throw e}JSON.parse(bytes.toString('utf8'))},e=>e.code==='LEDGER_BLOB_TRANSPORT_CORRESPONDENCE_FAILURE');
});
