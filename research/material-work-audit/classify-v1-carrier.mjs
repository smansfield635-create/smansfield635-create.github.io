#!/usr/bin/env node

const REPO = process.env.GITHUB_REPOSITORY || 'smansfield635-create/smansfield635-create.github.io';
const [OWNER, NAME] = REPO.split('/');
const TOKEN = process.env.GITHUB_TOKEN;
const OUTPUT_BRANCH = 'research/material-work-audit-v1-reclassification-ddbe792';
const OUTPUT_PATH = 'research/material-work-audit/material-work-audit-v1-classifications.jsonl';
const FROZEN_QUERY = `repo:${REPO} is:pr is:merged merged:2026-07-25T00:00:00Z..2026-08-25T18:25:55Z`;
const EXPECTED = 906;
const RULE_VERSION = 'MATERIAL_WORK_AUDIT_V1_DETERMINISTIC_CLASSIFIER_20260825_1';
if (!TOKEN) throw new Error('GITHUB_TOKEN required');

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'material-work-audit-v1-carrier'
};

async function gh(path, init={}) {
  for (let attempt=0; attempt<5; attempt++) {
    const res = await fetch(`https://api.github.com${path}`, {...init, headers:{...headers,...(init.headers||{})}});
    if (res.ok) return res.json();
    const text = await res.text();
    if ((res.status===403 || res.status===429 || res.status>=500) && attempt<4) {
      await new Promise(r=>setTimeout(r, 1500 * (attempt+1)));
      continue;
    }
    throw new Error(`${res.status} ${path}: ${text.slice(0,1000)}`);
  }
}

function uniq(xs){ return [...new Set(xs.filter(Boolean))]; }
function lc(x){ return (x||'').toLowerCase(); }
function has(re,s){ return re.test(s); }

function surfaceFor(path) {
  const p = path.replace(/^\//,'');
  if (p === 'index.html' || p.startsWith('assets/compass/')) return 'COMPASS_ROOT';
  if (p.startsWith('laws/')) return 'LAWS';
  if (p.startsWith('evidence/')) return 'EVIDENCE';
  if (p.startsWith('developer/')) return 'DEVELOPER';
  if (p.startsWith('governance/')) return 'GOVERNANCE';
  if (p.startsWith('products/')) return 'PRODUCTS';
  if (p.startsWith('campaigns/')) return 'CAMPAIGNS';
  if (p.startsWith('showroom/globe/audralia/')) return 'AUDRALIA';
  if (p.startsWith('showroom/globe/h-earth/')) return 'H_EARTH';
  if (p.startsWith('showroom/globe/hearth/')) return 'HEARTH';
  if (p.startsWith('showroom/')) return 'SHOWROOM';
  if (p.startsWith('instruments/')) return 'INSTRUMENTS';
  if (p.startsWith('inspection/')) return 'INSPECTION';
  if (p.startsWith('preview/')) return 'PREVIEW';
  return null;
}

function isEvidencePath(p) {
  const s = lc(p);
  return s.startsWith('.github/') || s.startsWith('verification/') || s.startsWith('scripts/') ||
    s.startsWith('docs/') || s.startsWith('research/') || s.includes('/validation/') ||
    s.includes('/registry/') || s.includes('receipt') || s.includes('manifest') ||
    s.includes('evidence-artifact') || s.includes('publication-surfaces/') ||
    s.endsWith('.md') || s.includes('benchmark') || s.includes('verifier') || s.includes('self-test');
}

function isControlPath(p) {
  const s=lc(p);
  return s.startsWith('.github/') || s.startsWith('tools/') || s.startsWith('verification/') ||
    s.startsWith('scripts/') || s.startsWith('infrastructure/') || s.includes('/control-plane/') ||
    s.includes('/registry/') || s.includes('/validation/') || s.startsWith('docs/') || s.startsWith('research/');
}

function isPureSupportTitle(title) {
  const t=lc(title).trim();
  return /^(revert|verification-only|verify\b|register\b|router:\s*register|release:\s*register|document\b|record\b|persist\b|expose exact|publish exact|publish immutable|deploy exact|update .*publish|repair .*manifest|.*verification manifest|.*verifier.*repair|fix .*workflow|repair .*workflow|trigger\b)/.test(t);
}

function reusableCapability(text) {
  return /(install|introduc|establish|create|add|generalize|enforce|adopt|compile|build)/.test(text) &&
    /(reusable|shared|universal|compiler|engine|protocol|builder|gateway|capabilit|framework|kernel|control plane|control-plane|system|pipeline|execution packet|working set|sparse-index|publication preflight|entitlement)/.test(text) &&
    !/(only.*register|registration only|manifest repair only|verifier-only|verification-only|receipt only|documentation-only)/.test(text);
}

function explicitQualified(text) {
  return /(qualification|benchmark|validation|preflight|harness|browser|matrix|workflow)[\s\S]{0,160}\b(pass|success|green|qualified|pass_closed)\b/.test(text) ||
    /\b(pass_closed|qualified candidate|exact[- ]candidate qualification.*pass|assertions.*pass)\b/.test(text);
}

function explicitLive(text) {
  return /live_exact_head_verified/.test(text) ||
    /(deployed|public|live)[\s\S]{0,100}(exact (identity|head)|byte identity|runtime verification|browser proof)[\s\S]{0,100}\b(pass|verified|success)\b/.test(text) ||
    /\blive[- ]browser[^.\n]{0,120}\bpass\b/.test(text);
}

function verificationBreadth(text) {
  const groups = [
    /desktop|wide|1280|1440/,
    /tablet|ipad|1024|820|694/,
    /phone|mobile|samsung|390|412|430|360/,
    /landscape/,
    /portrait/,
    /keyboard/,
    /touch|pointer/,
    /no-js|no js|reduced-motion/,
    /cold[- ]cache|reload|refresh/,
    /day|dawn|night/
  ];
  let n=0;
  for (const r of groups) if (r.test(text)) n++;
  const explicit = text.match(/(?:profiles|fixtures|configurations|devices|states|viewports)\s*[:=]?\s*`?(\d+)/);
  if (explicit) n=Math.max(n, Number(explicit[1]));
  if (/phone[^\n.]{0,80}tablet[^\n.]{0,80}desktop|desktop[^\n.]{0,80}tablet[^\n.]{0,80}phone/.test(text)) n=Math.max(n,3);
  return n;
}

function classify(pr, files) {
  const title=pr.title||'';
  const body=pr.body||'';
  const text=lc(`${title}\n${body}`);
  const paths=files.map(f=>f.filename);
  const changedPaths=paths.length || pr.changed_files || 0;
  const materialPaths=paths.filter(p=>!isEvidencePath(p));
  const controlPaths=paths.filter(isControlPath);
  const surfaces=uniq(materialPaths.map(surfaceFor).filter(s=>s && !['INSPECTION','PREVIEW'].includes(s)));
  const hasPublicMaterial = surfaces.length>0 || materialPaths.some(p=>/^(assets\/|index\.html$)/.test(p));
  const allControlOrEvidence = paths.length>0 && paths.every(p=>isControlPath(p) || isEvidencePath(p) || ['INSPECTION','PREVIEW'].includes(surfaceFor(p)));

  const revert = /^revert\b/.test(lc(title)) || /emergency rollback|exact inverse scope|fully reverted|restoration-only rollback/.test(text);
  const registrationOnly = /(registration only|registers? .* only|routing-only prerequisite|registry-only prerequisite|scope is .*router|exact-path registration|publication surface registration)/.test(text) && !hasPublicMaterial;
  const verifierOnly = /(verifier-only|verification-only|diagnostic-only boundary|instrumentation repair|changes only .*verifier|qualification.*only)/.test(text) && !hasPublicMaterial;
  const manifestOnly = /(manifest repair|verification-manifest|publication manifest|cache identity|cache-key|version identity|fingerprint stamper)/.test(text) && materialPaths.length===0;
  const publicationTransport = /(publication|deployment|pages|publish)/.test(text) && /(transport|carrier|registration only|inspection route|snapshot|no product|product.*unchanged|no .*product.*bytes)/.test(text) && !hasPublicMaterial;
  const exactBindingOnly = /(exact identity|identity correction|binding correction|contract identit|cache identity|request identity)/.test(text) && /(no material behavior|semantics.*unchanged|behavior.*unchanged|product.*unchanged|runtime.*unchanged)/.test(text);
  const pureSupport = revert || registrationOnly || verifierOnly || manifestOnly || publicationTransport || exactBindingOnly || (isPureSupportTitle(title) && allControlOrEvidence);

  const reusable = reusableCapability(text);
  const materialBehavior = hasPublicMaterial && /(add|replace|restore|repair|rebuild|recompose|integrat|change|correct|mount|render|interaction|runtime|geometry|cloud|weather|carousel|navigation|presentation|environment|content|startup|loader|condition|brain|terrain|camera|gesture)/.test(text);
  const material = materialBehavior || reusable || (!pureSupport && materialPaths.length>0);

  let klass;
  const trace=[];
  if (pureSupport && !reusable) {
    klass='SUPPORT'; trace.push('SUPPORT_EXCLUSION_GATE');
  } else if (!material) {
    klass='SUPPORT'; trace.push('NO_POSITIVE_MATERIALITY_PREDICATE');
  } else {
    klass='STANDARD'; trace.push(reusable && !hasPublicMaterial ? 'REUSABLE_ENGINEERING_EXCEPTION_TO_SUPPORT' : 'STANDARD_MATERIALITY_GATE');
  }

  const qualified=explicitQualified(text);
  const live=explicitLive(text);
  const breadth=verificationBreadth(text);
  const multiSurface=surfaces.length>=2 || /(multiple public surfaces|across .*developer.*evidence.*governance|whole-site|site-level|four-domain|multi-route|multiple routes)/.test(text) && material;
  const namedArchitecture=/(\b[A-Z][A-Z0-9_]{5,}_v\d\b|reusable architecture|shared .*runtime|shared .*engine|universal .*authority|system-level|compiler|kernel|protocol|entitlement engine|composite authority|execution packet)/.test(`${title}\n${body}`);
  const integrationBoundary = multiSurface || /(material integration|integrat(?:e|es|ed|ion) .*authority|independent authority domains|system-level|major multi-stage|whole-site|site-level|shared implementation|canonical .*integration|composite|end-to-end)/.test(text);
  let broad=0;
  const broadReasons=[];
  if (multiSurface) { broad++; broadReasons.push('MULTI_SURFACE'); }
  if (materialPaths.length>=5) { broad++; broadReasons.push('MATERIAL_PATHS_GE_5'); }
  if (breadth>=3 && qualified) { broad++; broadReasons.push('VERIFICATION_BREADTH_GE_3'); }
  if (live) { broad++; broadReasons.push('INDEPENDENT_LIVE_EVIDENCE'); }
  if (namedArchitecture) { broad++; broadReasons.push('NAMED_REUSABLE_ARCHITECTURE'); }
  if (klass==='STANDARD' && integrationBoundary && broad>=2) {
    klass='PARAMOUNT'; trace.push('PARAMOUNT_BOUNDARY_CROSSING_AND_BROAD_CONSEQUENCE');
  }

  const autonomous = /(automatic|autonomous|auto-release|on merge|push-triggered)[\s\S]{0,180}(qualification|merge|deploy|publication|live)/.test(text) && live ? true : 'UNRESOLVED';

  return {
    schema:'MATERIAL_WORK_AUDIT_V1_CLASSIFICATION_ROW_v1',
    ruleVersion:RULE_VERSION,
    pr:pr.number,
    title,
    mergedAt:pr.merged_at,
    mergeCommitSha:pr.merge_commit_sha,
    classification:klass,
    flags:{
      qualified,
      live,
      multiSurface,
      autonomousEndToEnd:autonomous,
      changedPaths,
      materialChangedPaths:materialPaths.length,
      affectedSurfaces:surfaces.length || 'UNRESOLVED',
      surfaces,
      verificationBreadth:{distinctSignals:breadth}
    },
    evidence:{
      repositoryUrl:pr.html_url,
      exactChangedPaths:paths,
      additions:pr.additions,
      deletions:pr.deletions,
      supportPredicates:{revert,registrationOnly,verifierOnly,manifestOnly,publicationTransport,exactBindingOnly},
      reusableCapability:reusable,
      materialBehavior,
      paramount:{integrationBoundary,broadConsequenceCount:broad,broadReasons},
      decisionTrace:trace
    }
  };
}

async function mapLimit(items, limit, fn) {
  const out=new Array(items.length); let next=0;
  async function worker(){ while(true){ const i=next++; if(i>=items.length) return; out[i]=await fn(items[i],i); } }
  await Promise.all(Array.from({length:limit}, worker));
  return out;
}

async function listPopulation(){
  const items=[];
  for(let page=1; page<=10; page++){
    const q=encodeURIComponent(FROZEN_QUERY);
    const data=await gh(`/search/issues?q=${q}&sort=created&order=asc&per_page=100&page=${page}`);
    if (page===1 && data.total_count!==EXPECTED) throw new Error(`Population drift: ${data.total_count} != ${EXPECTED}`);
    items.push(...data.items);
    if(data.items.length<100) break;
  }
  if(items.length!==EXPECTED) throw new Error(`Pagination mismatch: ${items.length} != ${EXPECTED}`);
  const nums=items.map(x=>x.number);
  if(new Set(nums).size!==EXPECTED) throw new Error('Duplicate PR numbers in population');
  return nums;
}

async function fetchPR(number){
  const pr=await gh(`/repos/${OWNER}/${NAME}/pulls/${number}`);
  const files=[];
  for(let page=1; page<=30; page++){
    const part=await gh(`/repos/${OWNER}/${NAME}/pulls/${number}/files?per_page=100&page=${page}`);
    files.push(...part);
    if(part.length<100) break;
  }
  return {pr,files};
}

async function writeOutput(content){
  const path=`/repos/${OWNER}/${NAME}/contents/${OUTPUT_PATH}`;
  let existing=null;
  try { existing=await gh(`${path}?ref=${encodeURIComponent(OUTPUT_BRANCH)}`); } catch(e) { if(!String(e).startsWith('404')) throw e; }
  const body={
    message:`Audit v1: freeze blinded ${EXPECTED}-row classification ledger`,
    content:Buffer.from(content,'utf8').toString('base64'),
    branch:OUTPUT_BRANCH
  };
  if(existing?.sha) body.sha=existing.sha;
  return gh(path,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
}

const numbers=await listPopulation();
console.log(`Frozen population reconciled: ${numbers.length}`);
const fetched=await mapLimit(numbers, 6, async (number,i)=>{
  if(i%50===0) console.log(`fetch ${i}/${EXPECTED}`);
  return fetchPR(number);
});
const rows=fetched.map(({pr,files})=>classify(pr,files));
rows.sort((a,b)=>Date.parse(a.mergedAt)-Date.parse(b.mergedAt) || a.pr-b.pr);
if(rows.length!==EXPECTED || new Set(rows.map(r=>r.pr)).size!==EXPECTED) throw new Error('Ledger integrity failure');
const counts=rows.reduce((a,r)=>(a[r.classification]=(a[r.classification]||0)+1,a),{});
const jsonl=rows.map(r=>JSON.stringify(r)).join('\n')+'\n';
console.log('v1 blinded totals withheld from public workflow log; row integrity PASS');
console.log(`bytes=${Buffer.byteLength(jsonl)} rows=${rows.length}`);
const result=await writeOutput(jsonl);
console.log(`Frozen v1 ledger commit=${result.commit?.sha||'unknown'} contentSha=${result.content?.sha||'unknown'}`);
