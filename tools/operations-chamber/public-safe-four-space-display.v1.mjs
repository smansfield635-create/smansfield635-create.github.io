// Bounded public-safe four-space presentation restoration.
// Runs after the existing qualified rolling-study adapter, before the unchanged
// four-path observations-branch publisher. Does not fetch private evidence.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const SCHEMA = 'DGB_OPERATIONS_CHAMBER_DASHBOARD_DATA_v1';
export const AGGREGATE = 'DGB_CHAMBER_PUBLIC_SAFE_AGGREGATE_v1';
export const QUALIFIED_FILES = Object.freeze({
  'index.html': '6ffa858e712b1e68285a3c270f4b317e9a491d7c86aac1053f987733f48bf275',
  'dashboard.mjs': '5ef85ee634a9f896977fbaaa1e71e6ab21f1dc4889bc456467b0f015617195e7'
});
const fail=(code)=>{const e=new Error(code);e.code=code;throw e};
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
const keys=(obj,valid)=>obj&&typeof obj==='object'&&!Array.isArray(obj)&&Object.keys(obj).sort().join('|')===valid.slice().sort().join('|');
const utc=s=>typeof s==='string'&&Number.isFinite(Date.parse(s))&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(s);
const qty=n=>Number.isSafeInteger(n)&&n>=0&&n<=10000000;

export function validateApprovedData(data){
  if(!data||data.schema!==SCHEMA||data.commandsEnabled!==false||!utc(data.observedAt)||!Array.isArray(data.projects)||!Array.isArray(data.repositories)||!Array.isArray(data.instruments?.records)) fail('APPROVED_FEED_INVALID');
  // This check is specifically for the post-adapter display, not a replacement
  // for its authenticated private digest, source identity and checkpoint checks.
  const r=data.rollingStudySummary;
  if(!keys(r,['schema','savedThrough','capturedAt','metrics'])||r.schema!==AGGREGATE||!utc(r.savedThrough)||!utc(r.capturedAt)||!keys(r.metrics,['classified','unresolved','reviews','auditFlags'])||!Object.values(r.metrics).every(qty)||r.metrics.unresolved>r.metrics.classified||r.metrics.reviews>r.metrics.classified||r.metrics.auditFlags>r.metrics.classified) fail('VERIFIED_ROLLING_AGGREGATE_MISSING_OR_INVALID');
  if(Date.parse(r.savedThrough)>Date.parse(r.capturedAt)+120000) fail('ROLLING_AGGREGATE_TIME_CONTRADICTION');
  return Object.freeze({observedAt:data.observedAt,savedThrough:r.savedThrough,classified:r.metrics.classified});
}

export function validatePresentation(index,module){
  if(!index.includes('data-target="home-view"')||!index.includes('id="rolling-summary"')||!index.includes('data-target="system-view"')||!index.includes('data-target="evidence-view"')) fail('FOUR_SPACE_STRUCTURE_MISSING');
  if((index.match(/class="space-portal /g)||[]).length!==4) fail('FOUR_PORTALS_REQUIRED');
  if(!index.includes("script-src 'self'")||!index.includes("connect-src 'self'")||!index.includes('<script type="module" src="./dashboard.mjs"></script>')) fail('SAME_ORIGIN_RUNTIME_CSP_INVALID');
  if(!module.includes("fetchImpl('./data.json'")||!module.includes("setInterval(()=>controller.refresh(),60000)")||!module.includes('const summary=current.rollingStudySummary')) fail('FEED_OR_STUDY_RUNTIME_MISSING');
  for(const content of [index,module]){
    if(/(?:const REVIEW_DATA|privateSavedSnapshotData|PRIVATE_GITHUB_TOKEN|data:text\/javascript;base64,|github\.com\/smansfield635-create\/geodiametrics1\/)/.test(content)) fail('PRIVATE_SOURCE_PAYLOAD_IN_PUBLIC_TEMPLATE');
  }
  return true;
}

export async function integrateFourSpaceDisplay({siteDir,templateDir=path.join(path.dirname(fileURLToPath(import.meta.url)),'four-space')}){
  if(!siteDir) fail('SITE_DIR_REQUIRED');
  const files=await fs.readdir(siteDir);
  if(files.sort().join('|')!==['.nojekyll','dashboard.mjs','data.json','index.html'].sort().join('|')) fail('EXISTING_PUBLISHER_FILE_ALLOWLIST_MISMATCH');
  const original=await fs.readFile(path.join(siteDir,'data.json'));
  let data;try{data=JSON.parse(original.toString('utf8'))}catch{fail('EXISTING_FEED_NOT_JSON')}
  const checked=validateApprovedData(data);
  const previousIndex=await fs.readFile(path.join(siteDir,'index.html'),'utf8');
  const previousModule=await fs.readFile(path.join(siteDir,'dashboard.mjs'),'utf8');
  if(!previousIndex.includes('id="rolling-summary"')||!previousModule.includes('rollingStudySummary'))fail('QUALIFIED_PRIOR_ADAPTER_NOT_PRESENT');
  const templates={};
  for(const [name,expected] of Object.entries(QUALIFIED_FILES)){
    const bytes=await fs.readFile(path.join(templateDir,name));
    if(digest(bytes)!==expected)fail('QUALIFIED_FOUR_SPACE_TEMPLATE_MISMATCH');
    templates[name]=bytes.toString('utf8');
  }
  validatePresentation(templates['index.html'],templates['dashboard.mjs']);
  // The existing approved JSON and .nojekyll are untouched. Failures above
  // cause no writes; only the two presentation files are replaced.
  await Promise.all(Object.entries(templates).map(([name,content])=>fs.writeFile(path.join(siteDir,name),content)));
  if(digest(await fs.readFile(path.join(siteDir,'data.json')))!==digest(original)) fail('APPROVED_FEED_CHANGED');
  return {schema:'DGB_CHAMBER_FOUR_SPACE_DISPLAY_PREPARED_v1',result:'FOUR_SPACE_PRESENTATION_PREPARED_NOT_PUBLISHED',sourceCapturedAt:checked.observedAt,studySavedThrough:checked.savedThrough,classified:checked.classified,onlyPresentationFilesReplaced:true,privateSourceQueried:false,commandsEnabled:false};
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
  integrateFourSpaceDisplay({siteDir:process.env.CHAMBER_SITE_DIR}).then(x=>console.log(JSON.stringify(x))).catch(e=>{console.error(e.code||'FOUR_SPACE_DISPLAY_FAILED');process.exitCode=1});
}
