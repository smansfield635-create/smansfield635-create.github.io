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
const manifest=JSON.parse(fs.readFileSync(path.join(root,'.github/ai-router/publication-surfaces/operations-chamber.json'),'utf8'));
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]);

test('identifies exactly the bounded public on-demand route',()=>{assert.match(html,/data-page="dgb-operations-chamber"/);assert.match(html,/DGB_OPERATIONS_CHAMBER_PUBLIC_ONDEMAND_GEN2640_v1/)});
test('browser checks are user-initiated, never autonomous on page load',()=>{assert.match(html,/addEventListener\('click',run\)/);assert.doesNotMatch(html,/setInterval\(|setTimeout\(run/)});
test('five published public source probes, no private GitHub endpoint',()=>{for(const path of ['/.well-known/dgb-release.json','/instruments/','/gauges/','/evidence/','/assets/compass/governance-panel.catalog.v1.json'])assert.ok(html.includes(path),path);assert.doesNotMatch(html,/api\.github\.com|github\.com\/smansfield635-create\/geodiametrics1|personal_access_token/i)});
test('public source fetches are GET only and do not send credentials',()=>{assert.match(html,/method:'GET',credentials:'omit',cache:'no-store'/);assert.match(html,/u\.origin!==location\.origin/);assert.match(html,/REDIRECT_OUTSIDE_ORIGIN/)});
test('no public privilege escalation or private-ledger assertion',()=>{assert.match(html,/data-production-mutation-authorized="false"/);assert.match(html,/data-live-private-ledger-access="false"/);assert.match(html,/privateLedgerObserved:false/);assert.match(html,/privateSystemHealth:'UNVERIFIED'/);assert.match(html,/livePublicationAuthority:'NONE'/)});
test('separate PASS, FINDING and UNRESOLVED outcome states',()=>{assert.match(html,/UNRESOLVED/);assert.match(html,/FINDING/);assert.match(html,/PASS/);assert.match(html,/REQUEST_TIMEOUT/)});
test('safe DOM textContent rendering for untrusted observations',()=>{assert.match(html,/node\.textContent=/);assert.doesNotMatch(html,/\.innerHTML\s*=/)});
test('mobile viewport, accessibility and no third-party assets',()=>{assert.match(html,/name="viewport"/);assert.match(html,/@media\(max-width:410px\)/);assert.match(html,/aria-live/);assert.doesNotMatch(html,/<script\s+src|<link\s+rel="stylesheet"[^>]+href="https:\/\//)});
test('public publication surface binds new route and no implicit authority',()=>{assert.equal(manifest.schema,'PUBLICATION_SURFACE_VERIFICATION_v1');assert.equal(manifest.surfaceId,'operations-chamber');assert.equal(manifest.checks[0].path,'/instruments/operations-chamber/');assert.equal(manifest.runtime.readySelector,'[data-run]')});
test('scripts parse as Javascript under Node 22+',()=>{assert.equal(scripts.length,1);new vm.Script(scripts[0],{filename:'operations-chamber-inline.js'})});
test('contains deep links to existing in-house instruments',()=>{for(const url of ['/instruments/','/gauges/','/governance/','/showroom/globe/h-earth/diagnostic/'])assert.ok(html.includes(`href="${url}"`))});
test('source is a public product only; canonical operation path preserved',()=>{assert.doesNotMatch(html,/DGB_OPERATIONS_CHAMBER_TRUSTED_LIVE_READONLY_20261010_003|613a852150a046e290fe078397d294468b36dc3d/);assert.match(html,/On-demand · Public instrumentation/)});
