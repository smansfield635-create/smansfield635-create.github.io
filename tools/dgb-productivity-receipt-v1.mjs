#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const args=Object.fromEntries(process.argv.slice(2).map((v,i,a)=>v.startsWith('--')?[v.slice(2),a[i+1]]:null).filter(Boolean));
const start=args.start, end=args.end, output=args.output || 'productivity-receipt.json';
const humanRaw=(args['human-interventions']??'').trim();
const humanInterventions=humanRaw===''?null:Number(humanRaw);
if(humanInterventions!==null&&(!Number.isInteger(humanInterventions)||humanInterventions<0)) throw new Error('--human-interventions must be a non-negative integer or blank');
if(!/^\d{4}-\d{2}-\d{2}$/.test(start||'')||!/^\d{4}-\d{2}-\d{2}$/.test(end||'')) throw new Error('Require --start YYYY-MM-DD --end YYYY-MM-DD');
const git=(a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:64*1024*1024}).trim();
const head=git(['rev-parse','HEAD']);
const raw=git(['log','--first-parent','--since='+start+'T00:00:00Z','--until='+end+'T23:59:59Z','--date=iso-strict','--pretty=format:@@@%H%x09%an%x09%ae%x09%s','--name-only']);
const commits=[]; let cur=null;
for(const line of raw.split(/\r?\n/)){if(line.startsWith('@@@')){if(cur)commits.push(cur);const [sha,author,email,...m]=line.slice(3).split('\t');cur={sha,author,email,message:m.join('\t'),files:[]};}else if(cur&&line.trim())cur.files.push(line.trim());}if(cur)commits.push(cur);
// Historical-audit-compatible v1 classifier: classify the operation intent from
// the commit message. File paths are retained for workstream breadth, but are
// deliberately excluded from category matching because generic paths such as
// index.html, assets/, evidence/, receipts/, and control-plane/ materially
// inflated the first calibration.
const rx={
 product:/(earth|audralia|hearth|auren|archcoin|education|product|laws|compass|governance bridge|collaboration|job fair|coher|showroom|character|world|surface|carousel|model)/i,
 qualification:/(qualif|test|proof|verif|evidence|audit|benchmark)/i,
 repair:/(repair|fix|restore|correct|reconcile|rollback|recover|recovery|stale|drift|mismatch|regression|failure)/i,
 governance:/(control plane|control-plane|governance|admission|authority|routing|router|dispatch|receipt|ledger|psalm)/i,
 closure:/(publish|deploy|adopt|closure|close|merge|release|register|terminal|pass_closed)/i
};
const text=c=>c.message;
const automated=c=>/\[bot\]$/i.test(c.author)||/noreply\.github\.com$/i.test(c.email)&&/actions/i.test(c.author);
const meaningful=commits.filter(c=>!automated(c));
const count=k=>meaningful.filter(c=>rx[k].test(text(c))).length;
const product=count('product'), qualification=count('qualification'), repair=count('repair'), governance=count('governance'), closure=count('closure');
const denom=meaningful.length;
const ratio=n=>denom?Number((n/denom).toFixed(4)):null;
const families=[...new Set(meaningful.flatMap(c=>c.files.map(f=>f.split('/')[0]||'(root)')).filter(Boolean))].sort();
const receipt={
 schema:'DGB_PRODUCTIVITY_RECEIPT_v1',generatedAt:new Date().toISOString(),repository:process.env.GITHUB_REPOSITORY||'smansfield635-create/smansfield635-create.github.io',
 periodStart:start,periodEnd:end,measuredHead:head,methodologyVersion:'DGB_PRODUCTIVITY_RECEIPT_METHOD_v1_1_MESSAGE_INTENT',
 commitCount:commits.length,identifiedAutomationCount:commits.length-meaningful.length,meaningfulActivityCount:denom,
 productSignals:product,qualificationSignals:qualification,repairSignals:repair,governanceSignals:governance,publicationClosureSignals:closure,
 productShare:ratio(product),qualificationDensity:ratio(qualification),repairBurden:ratio(repair),governanceCost:ratio(governance),
 workstreamFamilies:families,reuseEvidence:[],humanExecutionBurdenEvidence:{status:humanInterventions===null?'UNKNOWN':'OBSERVED',substantiveHumanInterventions:humanInterventions,evidence:[]},humanLeverageEvidence:{status:humanInterventions===null?'UNKNOWN':'OBSERVED',substantiveHumanInterventions:humanInterventions,meaningfulActivitiesPerIntervention:humanInterventions&&denom?Number((denom/humanInterventions).toFixed(4)):null,publicationClosuresPerIntervention:humanInterventions&&closure?Number((closure/humanInterventions).toFixed(4)):null},humanAbstractionEvidence:{status:'UNKNOWN',evidence:[]},
 limitations:['Signal categories overlap and are not additive labor accounting.','Commit-message lexical classification is a repository-activity proxy, not equivalent engineering labor.','Reuse and human abstraction require explicit durable evidence and remain UNKNOWN when not deterministically observable. Human-intervention metrics remain UNKNOWN unless an externally observed substantive intervention count is supplied.'],
 disposition:'PASS_MEASURED_WITH_LIMITATIONS'
};
fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n'); console.log(JSON.stringify(receipt,null,2));
