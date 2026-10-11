#!/usr/bin/env node
// Exact-scope public on-demand Chamber acceptance; no network or mutation.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..','..');
const html=fs.readFileSync(path.join(here,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]);

test('identifies exactly the bounded public on-demand route',()=>{assert.match(html,/data-page="dgb-operations-chamber"/);assert.match(html,/DGB_OPERATIONS_CHAMBER_PUBLIC_ONDEMAND_GEN2640_v1/)});
test('browser checks are user-initiated, never autonomous on page load',()=>{assert.match(html,/addEventListener\('click',run\)/);assert.doesNotMatch(html,/setInterval\(|setTimeout\(run/)});
test('five published public source probes, no private GitHub endpoint',()=>{for(const path of ['/.well-known/dgb-release.json','/instruments/','/gauges/','/evidence/','/assets/compass/governance-panel.catalog.v1.json'])assert.ok(html.includes(path),path);assert.doesNotMatch(html,/api\.github\.com|github\.com\/smansfield635-create\/geodiametrics1|personal_access_token/i)});
test('public source fetches are GET only and do not send credentials',()=>{assert.match(html,/method:'GET',credentials:'omit',cache:'no-store'/);assert.match(html,/u\.origin!==location\.origin/);assert.match(html,/REDIRECT_OUTSIDE_ORIGIN/)});
test('no public privilege escalation or private-ledger assertion',()=>{assert.match(html,/data-production-mutation-authorized="false"/);assert.match(html,/data-live-private-ledger-access="false"/);assert.match(html,/privateLedgerObserved:false/);assert.match(html,/privateSystemHealth:'UNVERIFIED'/);assert.match(html,/livePublicationAuthority:'NONE'/)});
test('separate PASS, FINDING and UNRESOLVED outcome states',()=>{assert.match(html,/UNRESOLVED/);assert.match(html,/FINDING/);assert.match(html,/PASS/);assert.match(html,/REQUEST_TIMEOUT/)});
test('safe DOM textContent rendering for untrusted observations',()=>{assert.match(html,/node\.textContent=/);assert.doesNotMatch(html,/\.innerHTML\s*=/)});
test('mobile viewport, accessibility and no third-party assets',()=>{assert.match(html,/name="viewport"/);assert.match(html,/@media\(max-width:410px\)/);assert.match(html,/aria-live/);assert.doesNotMatch(html,/<script\s+src|<link\s+rel="stylesheet"[^>]+href="https:\/\//)});
test('public route is self-contained with no internal manifest dependency',()=>{assert.match(html,/href="https:\/\/diamondgatebridge.com\/instruments\/operations-chamber\/"/);assert.match(html,/data-run/);assert.doesNotMatch(html,/\.github\/|tools\/operation-intake\//)});
test('scripts parse as Javascript under Node 22+',()=>{assert.equal(scripts.length,1);new vm.Script(scripts[0],{filename:'operations-chamber-inline.js'})});
test('contains deep links to existing in-house instruments',()=>{for(const url of ['/instruments/','/gauges/','/governance/','/showroom/globe/h-earth/diagnostic/'])assert.ok(html.includes(`href="${url}"`))});
test('source is a public product only; canonical operation path preserved',()=>{assert.doesNotMatch(html,/DGB_OPERATIONS_CHAMBER_TRUSTED_LIVE_READONLY_20261010_003|613a852150a046e290fe078397d294468b36dc3d/);assert.match(html,/On-demand · Public instrumentation/)});

const localParserSource=(()=>{
  const begin='// BEGIN_HOSTLESS_RECEIPT_PURE_V1',end='// END_HOSTLESS_RECEIPT_PURE_V1';
  const a=scripts[0].indexOf(begin),b=scripts[0].indexOf(end);
  assert.ok(a>=0&&b>a,'pure hostless parser must have one bounded extractable source block');
  assert.equal(scripts[0].lastIndexOf(begin),a);
  assert.equal(scripts[0].lastIndexOf(end),b);
  return scripts[0].slice(a+begin.length,b);
})();
const localParser=vm.runInNewContext(localParserSource+'\n({validateHostlessReceipt,parseHostlessPaste})',{});
function syntheticHostless(){
  return {
    schema:'DGB_OPERATIONS_CHAMBER_PRIVATE_GITHUB_ONDEMAND_RECEIPT_v1',
    result:'SOURCE_OBSERVED_AT_CAPTURE_NOT_LIVE_HEALTH',
    visibility:'PRIVATE_REPOSITORY_READERS_NOT_OWNER_EXCLUSIVE',
    executionClass:'GITHUB_HOSTED_EPHEMERAL_OWNER_INVOKED',
    observedAt:new Date(Date.now()-62000).toISOString(),
    sourceFreshness:'FRESH_SOURCE_CAPTURE',
    sourceVerification:'CANONICAL_GIT_SOURCE_PINNED_AT_CAPTURE',
    plane:'CANONICAL_CONTROL_ONLY',
    canonicalControl:{ledgerGeneration:11,activeLockRecords:3,terminalHistoryRecords:4,terminalDispositionCounts:{PASS_CLOSED:2,FAIL_CLOSED:1,REJECTED_CLOSED:0,WITHDRAWN:0,SUPERSEDED:1,VOIDED:0,EXPIRED:0}},
    otherPlanes:{epistemic:'UNVERIFIED',stateBoundAdmissibility:'UNVERIFIED',instrumentRuntime:'UNVERIFIED',governanceEvidence:'NOT_CONNECTED'},
    privateOperatorHostCommissioned:false,
    publicOperationsChamberConnected:false,
    instrumentRuntimeHealth:'UNVERIFIED',
    lockRecordsAreRunningJobs:false,
    privateSourceDetailsIncluded:false,
    privateCredentialsIncluded:false,
    controlCommandsEnabled:false,
    authorityEffect:'NONE'
  };
}
function changedReceipt(fn){const r=syntheticHostless();fn(r);return r}
test('hostless schema-positive accepts synthetic receipt only as a local nonauthoritative capture',()=>{
  const x=localParser.validateHostlessReceipt(syntheticHostless());
  assert.equal(x.kind,'HOSTLESS_CANONICAL_CONTROL');
  assert.equal(x.canonicalOperations.ledgerGeneration,11);
  assert.equal(x.canonicalOperations.terminalRecords,4);
  assert.equal(x.instrumentRuntime,'UNVERIFIED');
  assert.equal(x.authorityEffect,'NONE');
  assert.equal(Object.hasOwn(x,'sourceEvidence'),false);
  assert.equal(Object.hasOwn(x,'credentials'),false);
});
test('hostless Android paste accepts standalone JSON or one fenced sanitized bot comment',()=>{
  const specimen=syntheticHostless();
  const tick=String.fromCharCode(96).repeat(3);
  const body='DGB_OPERATIONS_CHAMBER_PRIVATE_SNAPSHOT_RECEIPT_V1\n\nCanonical Control — source-captured, read-only.\n\n'+tick+'json\n'+JSON.stringify(specimen,null,2)+'\n'+tick+'\n\nThis is not a continuous feed.';
  const json=localParser.parseHostlessPaste(JSON.stringify(specimen));
  const md=localParser.parseHostlessPaste(body);
  assert.equal(json.canonicalOperations.activeLockRecords,3);
  assert.equal(md.canonicalOperations.terminalRecords,4);
  assert.equal(localParserSource.includes('fetch('),false);
  assert.equal(localParserSource.includes('localStorage'),false);
});
test('hostless validation rejects all owner, execution, connection, and evidence upgrades',()=>{
  const negatives=[
    r=>r.schema='UNREGISTERED',
    r=>r.result='LIVE_HEALTH',
    r=>r.visibility='PUBLIC',
    r=>r.executionClass='ALWAYS_RUNNING_SERVER',
    r=>r.sourceFreshness='UNKNOWN',
    r=>r.sourceVerification='UNPINNED',
    r=>r.plane='ALL_PLANES',
    r=>r.privateOperatorHostCommissioned=true,
    r=>r.publicOperationsChamberConnected=true,
    r=>r.instrumentRuntimeHealth='ACTIVE',
    r=>r.lockRecordsAreRunningJobs=true,
    r=>r.privateSourceDetailsIncluded=true,
    r=>r.privateCredentialsIncluded=true,
    r=>r.controlCommandsEnabled=true,
    r=>r.authorityEffect='ADMISSION',
    r=>r.otherPlanes.epistemic='QUALIFIED',
    r=>r.otherPlanes.stateBoundAdmissibility='ENFORCING',
    r=>r.otherPlanes.instrumentRuntime='RUNNING',
    r=>r.otherPlanes.governanceEvidence='CONNECTED'
  ];
  for(const change of negatives)assert.throws(()=>localParser.validateHostlessReceipt(changedReceipt(change)),/HOSTLESS_RECEIPT_/);
});
test('hostless rejects unexpected private fields, prototype-looking keys and malformed schemas',()=>{
  const negatives=[
    r=>r.privatePath='not-allowed',
    r=>r.canonicalControl.sourceSha='not-allowed',
    r=>r.canonicalControl.terminalDispositionCounts.OTHER=1,
    r=>r.otherPlanes.unreported='CONNECTED',
    r=>r.schema='<script>alert(1)</script>',
    r=>r.__proto_dummy='not-allowed'
  ];
  for(const change of negatives)assert.throws(()=>localParser.validateHostlessReceipt(changedReceipt(change)),/HOSTLESS_RECEIPT_/);
});
test('hostless rejects inconsistent, negative, fractional and overflowing ledger figures',()=>{
  const negatives=[
    r=>r.canonicalControl.ledgerGeneration=-1,
    r=>r.canonicalControl.ledgerGeneration=0,
    r=>r.canonicalControl.activeLockRecords=1.5,
    r=>r.canonicalControl.terminalHistoryRecords=999,
    r=>r.canonicalControl.terminalDispositionCounts.FAIL_CLOSED=-1,
    r=>r.canonicalControl.terminalDispositionCounts.PASS_CLOSED=Number.MAX_SAFE_INTEGER,
    r=>r.canonicalControl.terminalDispositionCounts.EXPIRED='0'
  ];
  for(const change of negatives)assert.throws(()=>localParser.validateHostlessReceipt(changedReceipt(change)),/HOSTLESS_RECEIPT_/);
});
test('hostless capture timestamp and pasted comment failures fail closed',()=>{
  for(const bad of ['invalid','2026-02-30T10:11:12.000Z','2001-01-01T00:00:00+00:00',new Date(Date.now()+3600000).toISOString()])
    assert.throws(()=>localParser.validateHostlessReceipt(changedReceipt(r=>r.observedAt=bad)),/CAPTURE_TIME_INVALID/);
  for(const bad of ['', 'this is not a receipt','DGB_OPERATIONS_CHAMBER_PRIVATE_SNAPSHOT_RECEIPT_V1\nno json',
    '{invalid json}', '{'+('x'.repeat(20001))+'}'])
    assert.throws(()=>localParser.parseHostlessPaste(bad),/HOSTLESS_RECEIPT_/);
});
test('mobile paste and clear controls are accessible and follow existing governance instead of creating a parallel plane',()=>{
  assert.match(html,/id="hostlessReceiptText"[^>]*maxlength="20000"/);
  assert.match(html,/for="hostlessReceiptText"/);
  assert.match(html,/id="parseHostlessReceipt"/);
  assert.match(html,/id="eraseHostlessReceipt"/);
  assert.match(html,/parseHostlessReceipt'\)\.addEventListener\('click'/);
  assert.match(html,/eraseHostlessReceipt'\)\.addEventListener\('click'/);
  assert.match(html,/hostlessReceiptText'\)\.value=''/);
  assert.match(html,/operation='admit';selectedNode='admission';renderOperations\(\);navigate\('governance'\)/);
  assert.match(html,/width:100%;max-width:100%;min-width:0/);
  assert.match(html,/@media\(max-width:470px\)/);
});
test('public Chamber remains disconnected and original health inspection remains explicitly on-demand',()=>{
  assert.match(html,/data-live-private-ledger-access="false"/);
  assert.match(html,/Private feeds connected',0,'Current runtime unverified'/);
  assert.match(html,/USER-SUPPLIED LOCAL COPY/);
  assert.match(html,/ORIGIN NOT VERIFIED BY BROWSER/);
  assert.doesNotMatch(html,/\.innerHTML\s*=|localStorage|sessionStorage|indexedDB|sendBeacon/);
  assert.doesNotMatch(html,/https:\/\/api\.github\.com|github\.com\/smansfield635-create\/geodiametrics1/);
  assert.match(html,/addEventListener\('click',run\)/);
  assert.equal(scripts.length,1);
  new vm.Script(scripts[0],{filename:'operations-chamber-inline.js'});
});
