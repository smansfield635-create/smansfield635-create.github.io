#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

const REPO=process.env.GITHUB_REPOSITORY||'smansfield635-create/smansfield635-create.github.io';
const OUTPUT_BRANCH='agent/material-work-audit-v1-conformance-closure-1710';
const BASE_SHA='ef83a4c5a687eabf5f28ce56a33472c94d660a5c';
const FROZEN_COMMIT='bebb401aa0d2486f7c0d67504c1413efb356f131';
const FROZEN_BLOB='c969523bed42e90799ddc3dcb7acda6ea09d852c';
const FROZEN_PATH='research/material-work-audit/material-work-audit-v1-classifications.jsonl';
const CUTOFF='2026-08-25T18:25:55Z';
const EXPECTED=906;
const OUTDIR='research/material-work-audit';

function git(args,opts={}){return execFileSync('git',args,{encoding:'utf8',stdio:opts.stdio||['ignore','pipe','pipe']}).trim()}
const lc=x=>(x||'').toLowerCase();
function supportPath(p){const s=lc(p);return s.startsWith('.github/')||s.startsWith('verification/')||s.startsWith('scripts/')||s.startsWith('docs/')||s.startsWith('research/')||s.includes('/validation/')||s.includes('/registry/')||s.includes('receipt')||s.includes('manifest')||s.includes('evidence-artifact')||s.includes('publication-surfaces/')||s.endsWith('.md')||s.includes('verifier')||s.includes('self-test')||s.includes('cache')||s.includes('lock')}
function surfaceFor(p){const s=p.replace(/^\//,'');if(s==='index.html'||s.startsWith('assets/compass/'))return'COMPASS_ROOT';if(s.startsWith('laws/'))return'LAWS';if(s.startsWith('products/'))return'PRODUCTS';if(s.startsWith('showroom/globe/audralia/'))return'AUDRALIA';if(s.startsWith('showroom/globe/h-earth/'))return'H_EARTH';if(s.startsWith('showroom/globe/hearth/'))return'HEARTH';if(s.startsWith('showroom/'))return'SHOWROOM';if(s.startsWith('instruments/'))return'INSTRUMENTS';if(s.startsWith('evidence/'))return'EVIDENCE';if(s.startsWith('developer/'))return'DEVELOPER';if(s.startsWith('governance/'))return'GOVERNANCE';return null}
function counts(rows){const c={PARAMOUNT:0,STANDARD:0,SUPPORT:0};for(const r of rows)c[r.classification]++;return{...c,materialUnits:c.PARAMOUNT+c.STANDARD,total:rows.length}}
function inWindow(rows,a,b){return rows.filter(r=>r.mergedAt>=a&&r.mergedAt<=b)}

function correction(row){
  const title=lc(row.title).trim();
  const e=row.evidence||{};
  const f=row.flags||{};
  const sp=e.supportPredicates||{};
  const paths=e.changedPathSample||[];
  const allSampleSupport=paths.length>0&&paths.every(supportPath);
  const noMaterial=f.materialChangedPaths===0;
  const rollback=sp.revert||/^(revert|rollback)\b/.test(title)||/(restoration[- ]only|emergency rollback|exact inverse scope|fully reverted|restore .* previous|return .* prior state)/.test(title);
  const registrationOnly=sp.registrationOnly||(/\b(register|registration|registry|routing|scope registration|router registration)\b/.test(title)&&(noMaterial||allSampleSupport||paths.some(p=>lc(p).includes('/registry/'))));
  const verifierOnly=sp.verifierOnly||(/\b(verifier|verification|test-only|diagnostic-only|harness repair|assertion repair|instrumentation repair)\b/.test(title)&&(noMaterial||allSampleSupport));
  const manifestIdentity=sp.manifestOnly||sp.exactBindingOnly||(/\b(manifest|cache|version|fingerprint|identity|ancestry|lineage|receipt|lock closure|evidence custody)\b/.test(title)&&/\b(repair|correct|synchron|reconcile|refresh|update|restore|record|persist|bind|closure)\b/.test(title)&&(noMaterial||allSampleSupport));
  const workflowTransport=sp.publicationTransport||(/\b(workflow|ci|carrier|dispatch|transport|router|deployment|publication)\b/.test(title)&&/\b(repair|fix|trigger|registration|transport|carrier|dispatch|route|reconcile)\b/.test(title)&&(noMaterial||allSampleSupport));
  const hardSupport=rollback||registrationOnly||verifierOnly||manifestIdentity||workflowTransport;
  let klass=row.classification;
  const oldParamount=e.paramount||{};
  const trace=[];
  if(hardSupport){klass='SUPPORT';trace.push('CONFORMANCE_SUPPORT_EXCLUSION_GATE')}
  else if(klass==='PARAMOUNT'&&!(oldParamount.integrationBoundary===true&&Number(oldParamount.broadConsequenceCount||0)>=2)){klass='STANDARD';trace.push('PARAMOUNT_POSITIVE_ESCALATION_NOT_PROVEN')}
  else trace.push('FROZEN_CLASS_PRESERVED_AFTER_CONFORMANCE_CHECK');
  return {
    ...row,
    schema:'MATERIAL_WORK_AUDIT_V1_CONFORMANCE_ROW_v1',
    ruleVersion:'MATERIAL_WORK_AUDIT_V1_CONFORMANCE_20260825_2_LOCAL_FROZEN_EVIDENCE',
    classification:klass,
    flags:{...f,survivalStatus:rollback?'RESTORATION_OR_REVERT':'SURVIVING_AT_MERGE',supportOnlyBasis:hardSupport?{rollback,registrationOnly,verifierOnly,manifestIdentity,workflowTransport}:null,ambiguity:'RESOLVED_BY_LOWER_CLASS_TIEBREAK'},
    evidence:{...e,conformanceDecisionTrace:trace,frozenClassification:row.classification}
  };
}

function postFreezeRows(){
  const raw=git(['log',BASE_SHA,'--since='+new Date(Date.parse(CUTOFF)+1000).toISOString(),'--pretty=format:%H%x09%cI%x09%s']);
  if(!raw)return[];
  const out=[];
  const seen=new Set();
  for(const line of raw.split('\n')){
    const [sha,mergedAt,...rest]=line.split('\t'); const title=rest.join('\t');
    const m=title.match(/\(#(\d+)\)\s*$/)||title.match(/Merge pull request #(\d+)/i); if(!m)continue;
    const pr=Number(m[1]); if(seen.has(pr))continue; seen.add(pr);
    const paths=git(['diff-tree','--no-commit-id','--name-only','-r',sha]).split('\n').filter(Boolean);
    const material=paths.filter(p=>!supportPath(p)); const surfaces=[...new Set(material.map(surfaceFor).filter(Boolean))];
    const t=lc(title); const hard=/^(revert|rollback)\b/.test(t)||(/\b(register|registry|workflow|carrier|router|verification|verifier|manifest|cache|receipt|lock)\b/.test(t)&&material.length===0);
    let classification=hard?'SUPPORT':material.length>0?'STANDARD':'SUPPORT';
    if(classification==='STANDARD'&&surfaces.length>=2&&material.length>=5)classification='PARAMOUNT';
    out.push({pr,title,mergedAt,mergeCommitSha:sha,classification,materialChangedPaths:material.length,affectedSurfaces:surfaces.length});
  }
  return out.sort((a,b)=>Date.parse(a.mergedAt)-Date.parse(b.mergedAt)||a.pr-b.pr);
}

console.log('Gen1710 REST-free closure starting');
git(['fetch','--no-tags','origin',FROZEN_COMMIT]);
git(['fetch','--no-tags','--depth=1000','origin',BASE_SHA]);
git(['fetch','--no-tags','origin',OUTPUT_BRANCH]);
const frozenBlob=git(['rev-parse',`${FROZEN_COMMIT}:${FROZEN_PATH}`]);
if(frozenBlob!==FROZEN_BLOB)throw new Error(`Frozen blob mismatch ${frozenBlob}`);
const frozenText=git(['show',`${FROZEN_COMMIT}:${FROZEN_PATH}`]);
const frozenRows=frozenText.split('\n').filter(Boolean).map(JSON.parse);
if(frozenRows.length!==EXPECTED||new Set(frozenRows.map(r=>r.pr)).size!==EXPECTED)throw new Error(`Frozen population integrity ${frozenRows.length}`);
const rows=frozenRows.map(correction);
const correctedJsonl=rows.map(r=>JSON.stringify(r)).join('\n')+'\n';
const changed=rows.filter((r,i)=>r.classification!==frozenRows[i].classification);
const transitions={};for(let i=0;i<rows.length;i++){const k=`${frozenRows[i].classification}->${rows[i].classification}`;transitions[k]=(transitions[k]||0)+1}
const postRows=postFreezeRows();
const all=counts(rows),pre=counts(inWindow(rows,'2026-07-25T00:00:00Z','2026-08-03T23:59:59Z')),install=counts(inWindow(rows,'2026-08-04T00:00:00Z','2026-08-13T23:59:59Z')),mature=counts(inWindow(rows,'2026-08-15T00:00:00Z','2026-08-24T23:59:59Z')),post=counts(postRows);
const summary={schema:'MATERIAL_WORK_AUDIT_V1_CONFORMANCE_SUMMARY_v1',operationId:'MATERIAL_WORK_AUDIT_V1_CONFORMANCE_CLOSURE_20260825_003',lockGeneration:1710,governingHead:BASE_SHA,frozenV1Commit:FROZEN_COMMIT,frozenV1Blob:FROZEN_BLOB,frozenPopulation:{count:EXPECTED,cutoff:CUTOFF},frozenClassifierTotals:counts(frozenRows),correctedTotals:all,conformanceCorrections:{changedRows:changed.length,transitions},windows:{preTransition:{range:'2026-07-25..2026-08-03',...pre,materialRatePerDay:pre.materialUnits/10},installation:{range:'2026-08-04..2026-08-13',...install,materialRatePerDay:install.materialUnits/10},mature:{range:'2026-08-15..2026-08-24',...mature,materialRatePerDay:mature.materialUnits/10}},postFreezeRollingBaseline:{basis:'local git merge history through governing head; separate from frozen experiment',from:'2026-08-25T18:25:56Z',throughHead:BASE_SHA,...post,prs:postRows.map(r=>r.pr)},reproducibility:{rowLevelV0Available:false,disposition:'UNAVAILABLE_NOT_FABRICATED',v0AggregateReference:{PARAMOUNT:143,STANDARD:253,SUPPORT:510,materialUnits:396}},methodology:{source:'immutable frozen v1 evidence rows; no GitHub REST reconstruction',supportExclusionHardGate:true,lowerClassTieBreak:true,paramountRequiresBoundaryAndTwoBroadConsequences:true}};
const boundary=`# Material-work audit v1 research closure\n\nGeneration 1710 closes the fixed 906-PR research population without mutating the original blinded v1 artifact. The frozen artifact is ${FROZEN_COMMIT}:${FROZEN_PATH} with blob ${FROZEN_BLOB}.\n\nThe conformance-corrected corpus is a deterministic transformation of the evidence already preserved in those 906 rows. It applies the admitted SUPPORT exclusion as a hard gate to restoration/revert, registration-only, verifier/test-only, identity/manifest/cache/binding repair, and workflow/carrier/router transport work. PARAMOUNT is retained only where the frozen evidence records both a system boundary and at least two broad-consequence predicates. Ambiguity resolves downward.\n\nThe original v0 audit survives only as aggregate totals (143 PARAMOUNT, 253 STANDARD, 510 SUPPORT). Because no 906-row v0 PR-to-class mapping was preserved, row-level v0/v1 agreement, Cohen's kappa, and a disagreement ledger are unavailable and are not fabricated. Aggregate distribution comparison remains valid but is not labeled reproducibility.\n\nA separate post-freeze rolling baseline begins at 2026-08-25T18:25:56Z. It is derived from PR-numbered merge history through the Gen1710 governing head and never changes the frozen 906-observation experiment.\n\nResearch disposition: CLOSED_FOR_PAGE_BUILD after qualification of these three artifacts.\n`;

const remoteOut=git(['rev-parse',`origin/${OUTPUT_BRANCH}`]);
if(remoteOut!==BASE_SHA)throw new Error(`Output branch moved ${remoteOut}`);
git(['checkout','-B',OUTPUT_BRANCH,BASE_SHA]);
fs.mkdirSync(OUTDIR,{recursive:true});
fs.writeFileSync(`${OUTDIR}/material-work-audit-v1-conformance-corrected.jsonl`,correctedJsonl);
fs.writeFileSync(`${OUTDIR}/material-work-audit-v1-conformance-summary.json`,JSON.stringify(summary,null,2)+'\n');
fs.writeFileSync(`${OUTDIR}/material-work-audit-v1-reproducibility-boundary.md`,boundary);
git(['add',`${OUTDIR}/material-work-audit-v1-conformance-corrected.jsonl`,`${OUTDIR}/material-work-audit-v1-conformance-summary.json`,`${OUTDIR}/material-work-audit-v1-reproducibility-boundary.md`]);
git(['config','user.name','github-actions[bot]']);git(['config','user.email','41898282+github-actions[bot]@users.noreply.github.com']);
git(['commit','-m','Audit v1: close rubric-conformance research corpus']);
git(['push','origin',`HEAD:${OUTPUT_BRANCH}`],{stdio:['ignore','inherit','inherit']});
console.log(JSON.stringify({rows:rows.length,correctedTotals:all,changedRows:changed.length,postFreeze:post,commit:git(['rev-parse','HEAD'])},null,2));
