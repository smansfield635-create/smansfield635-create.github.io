import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  H_EARTH_RUN_8E_R3F2_P3C_CONTROL,
  evaluateHEarthRun8ER3F2P3CControl
} from '../control-plane/run-8/recovery/h-earth.run8e-r3f2-p3c.executable-publication-trigger-correction.js';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');
const issues = [];

const controlResult = evaluateHEarthRun8ER3F2P3CControl();
if (!controlResult.eligible) issues.push(...controlResult.issues);

const p3Receipt = JSON.parse(read('h-earth-3d/validation/run-8e-r3/h-earth.run8e-r3f2-p3.pass-closed.receipt.json'));
if (p3Receipt.eligible !== true || p3Receipt.status !== 'RUN_8E_R3F2_P3_PASS_CLOSED') issues.push('P3_RECEIPT_INVALID');

const workflow = read('.github/workflows/h-earth-run8e-r3f2-p4-immutable-preview-publication.yml');
const configText = read('h-earth-3d/deployment/run-8e-r3f2/h-earth.run8e-r3f2-p3c.authorized-push-trigger.config.json');
const config = JSON.parse(configText);

if (!workflow.includes('push:')) issues.push('P4_PUSH_TRIGGER_MISSING');
if (!workflow.includes('agent/h-earth-run8e-r3f2-p4-immutable-preview-publication-001')) issues.push('P4_BRANCH_GATE_MISSING');
if (!workflow.includes('h-earth.run8e-r3f2-p4.publication-authorization.json')) issues.push('P4_AUTHORIZATION_PATH_GATE_MISSING');
if (workflow.includes('workflow_dispatch:')) issues.push('NON_EXECUTABLE_WORKFLOW_DISPATCH_REMAINS');
if (!workflow.includes('fcec8433e8ce995065abd617eba4382f6183227c31f425afa6773efdb7ac66bd')) issues.push('AUTHORIZATION_SHA256_NOT_BOUND');
if (!workflow.includes('be55de54f562278927472d961bfca89e20d3d590')) issues.push('AUTHORIZATION_GIT_BLOB_NOT_BOUND');
if (!workflow.includes('git diff-tree --no-commit-id --name-only -r')) issues.push('ONE_CHANGED_PATH_GATE_MISSING');
if (!workflow.includes('P3C_RECEIPT_PATH')) issues.push('P3C_PARENT_RECEIPT_GATE_MISSING');
if (!workflow.includes('cloudflare/wrangler-action@v3')) issues.push('CLOUDFLARE_DIRECT_UPLOAD_ACTION_MISSING');
if (!workflow.includes('uniqueDeploymentOrigin')) issues.push('UNIQUE_DEPLOYMENT_OCCURRENCE_RECORD_MISSING');
if (!workflow.includes('productionDeployment: false')) issues.push('NON_PRODUCTION_RECORD_MISSING');
if (!workflow.includes('customDomainBound: false')) issues.push('CUSTOM_DOMAIN_BOUNDARY_MISSING');

if (config.configurationId !== 'H_EARTH_RUN_8E_R3F2_P3C_EXECUTABLE_PUBLICATION_TRIGGER_CORRECTION_v1') issues.push('P3C_CONFIG_ID_INVALID');
if (config.correctedTrigger?.event !== 'push') issues.push('P3C_CONFIG_TRIGGER_INVALID');
if (config.correctedTrigger?.authorizationSha256 !== 'sha256:fcec8433e8ce995065abd617eba4382f6183227c31f425afa6773efdb7ac66bd') issues.push('P3C_CONFIG_AUTH_SHA256_INVALID');
if (config.correctedTrigger?.authorizationGitBlob !== 'be55de54f562278927472d961bfca89e20d3d590') issues.push('P3C_CONFIG_AUTH_BLOB_INVALID');
if (config.preservedPublicationConfiguration?.provider !== 'CLOUDFLARE_PAGES_DIRECT_UPLOAD') issues.push('P3C_PROVIDER_DRIFT');
if (config.preservedPublicationConfiguration?.packageSha256 !== 'sha256:3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234') issues.push('P3C_PACKAGE_DRIFT');
if (config.boundaries?.mainChanged !== false || config.boundaries?.networkPublicationPerformed !== false) issues.push('P3C_BOUNDARY_INVALID');

const previewRoot = 'preview/h-earth/run8e/r3f2/sha256-3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234';
const previewChecks = [
  ['index.html', '3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234'],
  ['preview-manifest.json', 'b77b3e88ef4868d0602468da90693c64c46b09442e1fe15013ed4dcf69156dd4'],
  ['device-evidence-receipt.schema.json', '04ce5ec86f102fb7646b02ad19a3f862b8e6370dcdc971dc252d6bc607e3d18a']
];
for (const [fileName, expected] of previewChecks) {
  const bytes = fs.readFileSync(path.join(root, previewRoot, fileName));
  const actual = crypto.createHash('sha256').update(bytes).digest('hex');
  if (actual !== expected) issues.push(`PREVIEW_IDENTITY_DRIFT:${fileName}`);
}

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_R3F2_P3C_EXECUTABLE_PUBLICATION_TRIGGER_CORRECTION_VALIDATION',
  eligible: issues.length === 0,
  status: issues.length === 0 ? 'RUN_8E_R3F2_P3C_CORRECTION_VALIDATION_PASS' : 'RUN_8E_R3F2_P3C_CORRECTION_VALIDATION_FAIL',
  checkpointId: 'RUN_8E_R3F2_P3C',
  baseExactHead: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.baseExactHead,
  correctedTrigger: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.correctedTrigger,
  configSha256: `sha256:${sha256(configText)}`,
  previewFileCount: previewChecks.length,
  boundaries: H_EARTH_RUN_8E_R3F2_P3C_CONTROL.boundaries,
  issues
};

const output = process.env.H_EARTH_RUN8E_R3F2_P3C_OUTPUT;
if (output) {
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'p3c-validation-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
}
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
if (!receipt.eligible) process.exitCode = 1;
