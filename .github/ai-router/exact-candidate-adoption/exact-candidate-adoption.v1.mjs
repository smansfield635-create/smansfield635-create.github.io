#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const FIXTURE_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/gen1378.v1.json');
const API = 'https://api.github.com';
const SHA40 = /^[0-9a-f]{40}$/;
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])])) : value;
const canonical = value => JSON.stringify(stable(value));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, JSON.stringify(stable(value), null, 2) + '\n'); };
const fail = (code, detail=null) => { const e = new Error(code); e.code=code; e.detail=detail; throw e; };

export function loadFixture(file=FIXTURE_PATH) {
  const f = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (f.schema !== 'EXACT_CANDIDATE_ADOPTION_FIXTURE_v1') fail('FIXTURE_SCHEMA_MISMATCH');
  if (!Number.isInteger(f.generation) || !SHA40.test(f.expectedParent) || !SHA40.test(f.candidate) || !SHA40.test(f.candidateTree) || !SHA40.test(f.candidateRouterBlob)) fail('FIXTURE_IDENTITY_INVALID');
  if (f.force !== false) fail('FORCE_POLICY_INVALID');
  if (!Array.isArray(f.expectedChanges) || f.expectedChanges.length !== 19) fail('FIXTURE_MANIFEST_INVALID');
  const unique = new Set(f.expectedChanges.map(x => x.path));
  if (unique.size !== 19) fail('FIXTURE_MANIFEST_DUPLICATE');
  const removed = f.expectedChanges.filter(x => x.status === 'removed');
  const modified = f.expectedChanges.filter(x => x.status === 'modified');
  if (removed.length !== 18 || modified.length !== 1 || modified[0].path !== f.routerPath) fail('FIXTURE_DISPOSITION_INVALID');
  return stable(f);
}

export function validateExternalRequest(fixture, generation, candidate, adopt) {
  if (String(generation) !== String(fixture.generation)) fail('GENERATION_MISMATCH');
  if (candidate !== fixture.candidate || !SHA40.test(candidate)) fail('CANDIDATE_MISMATCH');
  if (adopt !== 'ADOPT') fail('ADOPT_REQUEST_INVALID');
  return true;
}

export function validateCandidateObjects(fixture, commit, routerObject, compare) {
  if (commit?.sha !== fixture.candidate) fail('CANDIDATE_COMMIT_MISMATCH');
  const parents = Array.isArray(commit?.parents) ? commit.parents.map(x => x.sha) : [];
  if (parents.length !== 1 || parents[0] !== fixture.expectedParent) fail('CANDIDATE_PARENT_MISMATCH', parents);
  if (commit?.commit?.tree?.sha !== fixture.candidateTree) fail('CANDIDATE_TREE_MISMATCH');
  if (routerObject?.sha !== fixture.candidateRouterBlob) fail('CANDIDATE_ROUTER_BLOB_MISMATCH');
  const expected = new Map(fixture.expectedChanges.map(x => [x.path, x.status]));
  const files = Array.isArray(compare?.files) ? compare.files : [];
  if (files.length !== expected.size) fail('CHANGED_PATH_COUNT_MISMATCH', files.length);
  for (const f of files) {
    if (!expected.has(f.filename)) fail('UNAUTHORIZED_CHANGED_PATH', f.filename);
    if (expected.get(f.filename) !== f.status) fail('CHANGED_PATH_STATUS_MISMATCH', {path:f.filename, expected:expected.get(f.filename), observed:f.status});
  }
  if (new Set(files.map(f => f.filename)).size !== expected.size) fail('CHANGED_PATH_SET_MISMATCH');
  return true;
}

async function apiJson(url, token, options={}) {
  const response = await fetch(url, {method:options.method ?? 'GET', headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'}, body: options.body ? JSON.stringify(options.body) : undefined});
  const text = await response.text();
  let body; try { body=text?JSON.parse(text):null; } catch { body={raw:text}; }
  if (!response.ok) fail('GITHUB_API_FAILURE', {status:response.status,url,body});
  return body;
}
const branchUrl = (repo, branch) => `${API}/repos/${repo}/branches/${encodeURIComponent(branch)}`;
const refUrl = (repo, branch) => `${API}/repos/${repo}/git/refs/heads/${branch.split('/').map(encodeURIComponent).join('/')}`;
const contentsUrl = (repo, p, ref) => `${API}/repos/${repo}/contents/${p.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(ref)}`;

export async function executeAdoption({fixture, generation, candidate, adopt, token, repository, output}) {
  const fixtureDigest = sha256(canonical(fixture));
  const base = {schema:'EXACT_CANDIDATE_ADOPTION_RECEIPT_v1',fixtureId:fixture.fixtureId,fixtureDigest,generation:fixture.generation,candidate:fixture.candidate,authorizedBranch:fixture.authorizedBranch,expectedParent:fixture.expectedParent,force:false};
  try {
    validateExternalRequest(fixture,generation,candidate,adopt);
    if (!token) fail('GITHUB_TOKEN_MISSING');
    if (repository !== fixture.repository) fail('REPOSITORY_MISMATCH');
    const commit = await apiJson(`${API}/repos/${repository}/commits/${candidate}`, token);
    const routerObject = await apiJson(contentsUrl(repository, fixture.routerPath, candidate), token);
    const compare = await apiJson(`${API}/repos/${repository}/compare/${fixture.expectedParent}...${candidate}`, token);
    validateCandidateObjects(fixture, commit, routerObject, compare);
    const before = await apiJson(branchUrl(repository, fixture.authorizedBranch), token);
    const observedBefore = before?.commit?.sha;
    if (observedBefore === candidate) {
      const receipt = {...base,result:'ALREADY_ADOPTED',preMutationBranchHead:observedBefore,postMutationBranchHead:observedBefore,mutationAttempted:false,candidateVerified:true};
      writeJson(output,receipt); return receipt;
    }
    if (observedBefore !== fixture.expectedParent) fail('BRANCH_HEAD_MISMATCH', {expected:fixture.expectedParent,observed:observedBefore});
    const immediate = await apiJson(branchUrl(repository, fixture.authorizedBranch), token);
    if (immediate?.commit?.sha !== fixture.expectedParent) fail('BRANCH_MOVED_BEFORE_MUTATION', immediate?.commit?.sha);
    const updated = await apiJson(refUrl(repository, fixture.authorizedBranch), token, {method:'PATCH',body:{sha:candidate,force:false}});
    if (updated?.object?.sha !== candidate) fail('REF_UPDATE_RESPONSE_MISMATCH', updated?.object?.sha);
    const after = await apiJson(branchUrl(repository, fixture.authorizedBranch), token);
    if (after?.commit?.sha !== candidate) fail('POST_MUTATION_REF_MISMATCH', after?.commit?.sha);
    const receipt = {...base,result:'ADOPTED',preMutationBranchHead:observedBefore,postMutationBranchHead:after.commit.sha,mutationAttempted:true,candidateVerified:true};
    writeJson(output,receipt); return receipt;
  } catch (error) {
    const receipt = {...base,result:'REFUSED',errorCode:error.code ?? 'UNEXPECTED_FAILURE',detail:error.detail ?? error.message,mutationAttempted:false};
    writeJson(output,receipt); process.exitCode=1; return receipt;
  }
}

async function main() {
  const fixture=loadFixture();
  const output=process.env.ADOPTION_OUTPUT || path.join(process.env.RUNNER_TEMP || '/tmp','exact-candidate-adoption-receipt.json');
  await executeAdoption({fixture,generation:process.env.ADOPTION_GENERATION,candidate:process.env.ADOPTION_CANDIDATE,adopt:process.env.ADOPTION_REQUEST,token:process.env.GITHUB_TOKEN,repository:process.env.GITHUB_REPOSITORY,output});
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { process.stderr.write(`${error.stack || error}\n`); process.exitCode=1; });
