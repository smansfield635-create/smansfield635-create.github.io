import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const original=fs.readFileSync(path.join(here,'h-earth-repository-preflight-remote-execution.v1.mjs'),'utf8');
const target=path.join(here,'h-earth-pr7479-current-native-registry-qualifier.v1.mjs');
const actual=fs.readFileSync(target,'utf8');
const subject='299d68d211576cef59cab228d4fe13b1f823ad43';
const oldTool='6d4af698ca75b96aaa660033e9ae24c704673eb7';
const newTool='f31ee516dff631da3d7f734a5751748ed051412f';
const oldActivation='b3c51381af190b6aab296db222296dc851cb7e9a';
const newActivation='785730730fc10cd6351999207c61ef483094c06f';
const header=`/**
 * H-Earth Gen3386 registered native qualification binding candidate.
 * Existing accepted remote-preflight adapter retained. Immutable subject and actual
 * source tool/activation blobs are updated solely for PR #7479 qualification.
 * Does not create a new execution framework or mutation/merge/release authority.
 */
`;

test('source differs from accepted adapter only by frozen subject and native identities',()=>{
  const expected=header+original.replace(oldTool,newTool).replace(oldActivation,newActivation)
    .replace('const MAX_PATHS = 128;',`const FROZEN_SUBJECT_HEAD = '${subject}';\nconst MAX_PATHS = 128;`)
    .replace('function execute({ root, subjectHead, pathsBase64, executionHolder }) {\n',
      "function execute({ root, subjectHead, pathsBase64, executionHolder }) {\n  if (subjectHead !== FROZEN_SUBJECT_HEAD) fail('PR7479_SUBJECT_HEAD_MISMATCH', subjectHead);\n")
    .replace("const head = git(root, ['rev-parse', 'HEAD^{commit}']);\n  const positivePaths",
      "const head = FROZEN_SUBJECT_HEAD;\n  const positivePaths")
    .replace("const TASK_TEXT = 'Remote pre-mutation H-Earth repository registry preflight';",
      "const TASK_TEXT = 'H-Earth Gen3386 PR7479 exact-head read-only full native repository registry preflight';");
  assert.equal(actual,expected);
});

test('native tool and activation pins are current candidate bytes only',()=>{
  assert.ok(actual.includes(newTool));
  assert.ok(actual.includes(newActivation));
  assert.ok(!actual.includes(oldTool));
  assert.ok(!actual.includes(oldActivation));
  assert.ok(actual.includes("const FROZEN_SUBJECT_HEAD = '"+subject+"'"));
});

test('original clean worktree and native command restrictions are preserved',()=>{
  for(const token of ['verifyBoundNativeTool(root, subjectHead)','--experimental-default-type=module',
    'subjectWorktreeCleanAfter = cleanWorktree(subjectRoot)','repositoryCleanAfter = cleanWorktree(root)',
    'constructionAuthorityGranted: false','mergePerformed: false','deploymentPerformed: false','releasePerformed: false']){
    assert.ok(actual.includes(token),token);
  }
});

test('adapted command parses as Node 22 module',()=>{
  const r=spawnSync(process.execPath,['--check',target],{encoding:'utf8'});
  assert.equal(r.status,0,r.stderr);
});

test('any non-frozen head fails closed before git or native execution',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'gen3386-native-qualifier-'));
  try{
    const output=path.join(dir,'receipt.json');
    const r=spawnSync(process.execPath,[target,
      '--subject-head','0000000000000000000000000000000000000000',
      '--paths-base64',Buffer.from(JSON.stringify(['h-earth-3d/validation/h-earth.east-a-environmental-identity.v1.test.mjs'])).toString('base64'),
      '--execution-holder','H_EARTH_GEN3386_NEGATIVE_GUARD','--output',output
    ],{cwd:dir,encoding:'utf8'});
    assert.equal(r.status,1);
    const receipt=JSON.parse(fs.readFileSync(output,'utf8'));
    assert.equal(receipt.result,'FAIL_CLOSED');
    assert.equal(receipt.errorCode,'PR7479_SUBJECT_HEAD_MISMATCH');
    for(const key of ['productMutationPerformed','constructionAuthorityGranted','branchCreated','genericCommandAuthority','mergePerformed','deploymentPerformed','releasePerformed']){
      assert.equal(receipt[key],false,key);
    }
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
