#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateFederation, REQUEST_SCHEMA } from './federation-gate.v1.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const registry=JSON.parse(fs.readFileSync(path.join(here,'repository-registry.v1.json'),'utf8'));
const base={schema:REQUEST_SCHEMA,operation:'READ_EVIDENCE',sourceRepository:{repositoryId:'repo:website-main',numericId:1142978610,fullName:'smansfield635-create/smansfield635-create.github.io'},targetRepository:{repositoryId:'repo:geodiametrics',numericId:1142904555,fullName:'smansfield635-create/geodiametrics'},sourceHead:'a'.repeat(40),evidence:{algorithm:'sha256',digest:'b'.repeat(64)},authorityTransferRequested:false,externalWriteRequested:false};
const cases=[];
function run(name,input,result,errorCode=null){const r=evaluateFederation(input,registry);assert.equal(r.result,result,`${name}:result`);assert.equal(r.errorCode,errorCode,`${name}:error`);assert.equal(r.authorityCreated,false);assert.equal(r.externalRepositoryWriteAuthorityCreated,false);cases.push({name,result:r.result,errorCode:r.errorCode});return r;}
run('registered peer read-only federation',base,'PASS_CLOSED');
run('source numeric identity mismatch',{...base,sourceRepository:{...base.sourceRepository,numericId:1}},'FAIL_CLOSED','SOURCE_REPOSITORY_IDENTITY_MISMATCH');
run('target full-name identity mismatch',{...base,targetRepository:{...base.targetRepository,fullName:'smansfield635-create/not-geodiametrics'}},'FAIL_CLOSED','TARGET_REPOSITORY_IDENTITY_MISMATCH');
run('unknown target',{...base,targetRepository:{repositoryId:'repo:unknown',numericId:9,fullName:'x/y'}},'FAIL_CLOSED','TARGET_REPOSITORY_UNKNOWN');
run('external write rejected',{...base,externalWriteRequested:true},'FAIL_CLOSED','EXTERNAL_REPOSITORY_WRITE_FORBIDDEN');
run('authority transfer rejected',{...base,authorityTransferRequested:true},'FAIL_CLOSED','AUTHORITY_TRANSFER_FORBIDDEN');
run('invalid exact source head',{...base,sourceHead:'abc'},'FAIL_CLOSED','SOURCE_HEAD_INVALID');
run('invalid evidence digest',{...base,evidence:{algorithm:'sha256',digest:'xyz'}},'FAIL_CLOSED','EVIDENCE_DIGEST_INVALID');
run('unregistered operation',{...base,operation:'WRITE'},'FAIL_CLOSED','FEDERATION_OPERATION_NOT_ALLOWED');
const reverse={...base,sourceRepository:base.targetRepository,targetRepository:base.sourceRepository,sourceHead:'d8d059ab262469ebdb9a3562f2679acc6690b14f'};
run('reverse peer evidence read',reverse,'PASS_CLOSED');
const receipt={schema:'L2_FEDERATION_SELF_TEST_RECEIPT_v1',result:'PASS_CLOSED',caseCount:cases.length,cases,realPeerIdentityVerified:true,realPeerFullName:'smansfield635-create/geodiametrics',externalRepositoryWritesPerformed:false,authorityCreated:false,authorityInherited:false};
const i=process.argv.indexOf('--output');if(i>=0&&process.argv[i+1])fs.writeFileSync(process.argv[i+1],JSON.stringify(receipt,null,2)+'\n');process.stdout.write(JSON.stringify(receipt)+'\n');
