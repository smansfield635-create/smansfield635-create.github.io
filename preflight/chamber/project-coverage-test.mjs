import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {projectBriefingCoverage} from './dashboard.mjs';

const source=(id,repository='example/repo')=>({id,repository,operations:[]});
const briefing=projectId=>({projectId,title:projectId});

test('duplicate repository sources count as one operational identity',()=>{
 const sources=[source('H_EARTH','a/site'),source('H_EARTH','b/site'),source('LAWS','a/site')];
 const before=JSON.stringify(sources);
 const result=projectBriefingCoverage(sources,[briefing('H_EARTH')]);
 assert.equal(result.operationalIdentities,2);
 assert.equal(result.linkedOperational,1);
 assert.equal(result.exactMatches,1);
 assert.equal(result.missingOperational,1);
 assert.deepEqual(result.missingIds,['LAWS']);
 assert.equal(JSON.stringify(sources),before);
});

test('only the already-declared Operations Chamber alias is recognized',()=>{
 const result=projectBriefingCoverage([source('PRIVATE_PUBLIC_BRIDGE'),source('SOMETHING_ELSE')],[briefing('OPERATIONS_CHAMBER'),briefing('AUDRALIA')]);
 assert.equal(result.operationalIdentities,2);
 assert.equal(result.exactMatches,0);
 assert.equal(result.declaredAliasMatches,1);
 assert.equal(result.linkedOperational,1);
 assert.equal(result.missingOperational,1);
 assert.equal(result.briefingOnly,1);
 assert.equal(result.visibleProjects,3);
 assert.deepEqual(result.missingIds,['SOMETHING_ELSE']);
});

test('without published briefings, nothing is silently called source-reviewed',()=>{
 const result=projectBriefingCoverage([source('H_EARTH')],[]);
 assert.equal(result.linkedOperational,0);
 assert.equal(result.missingOperational,1);
 assert.equal(result.briefingOnly,0);
});

test('dated published captures yield an explicit, non-live coverage inventory',()=>{
 const capture=JSON.parse(readFileSync(new URL('./data/control-plane.json',import.meta.url),'utf8'));
 const briefings=JSON.parse(readFileSync(new URL('./data/briefings.json',import.meta.url),'utf8'));
 assert.equal(capture.observedAt,'2026-10-17T07:05:23.245Z');
 assert.equal(briefings.schema,'DGB_PROJECT_BRIEFINGS_v1');
 const result=projectBriefingCoverage(capture.projects,briefings.records);
 assert.equal(result.operationalIdentities,41);
 assert.equal(result.linkedOperational,3);
 assert.equal(result.exactMatches,2);
 assert.equal(result.declaredAliasMatches,1);
 assert.equal(result.missingOperational,38);
 assert.equal(result.briefingOnly,2);
 assert.equal(result.visibleProjects,43);
 assert.equal(result.missingIds.length,38);
});
