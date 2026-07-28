import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  H_EARTH_RUN_8E_R3F2_P3_CONTROL,
  evaluateHEarthRun8ER3F2P3Control
} from '../control-plane/run-8/recovery/h-earth.run8e-r3f2-p3.non-production-publication-configuration.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (repositoryPath) => fs.readFileSync(path.join(root, repositoryPath), 'utf8');
const bytes = (repositoryPath) => fs.readFileSync(path.join(root, repositoryPath));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const gitBlob = (value) => crypto.createHash('sha1').update(`blob ${value.length}\0`).update(value).digest('hex');
const issue = (issues, condition, code) => { if (!condition) issues.push(code); };

const configPath = 'h-earth-3d/deployment/run-8e-r3f2/h-earth.run8e-r3f2-p3.cloudflare-pages-direct-upload.config.json';
const headersPath = 'h-earth-3d/deployment/run-8e-r3f2/h-earth.run8e-r3f2-p3.cloudflare-pages.headers.txt';
const publicationWorkflowPath = '.github/workflows/h-earth-run8e-r3f2-p4-immutable-preview-publication.yml';
const previewRoot = 'preview/h-earth/run8e/r3f2/sha256-3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234';

const issues = [];
const control = evaluateHEarthRun8ER3F2P3Control();
issues.push(...control.issues);

const config = JSON.parse(read(configPath));
const headers = read(headersPath);
const workflow = read(publicationWorkflowPath);
const expectedHeaderPolicy = `/preview/h-earth/run8e/r3f2/sha256-3020154361523cf19113e4c759c234a6c74ff5a493b8e47124ca59470da7a234/*\n  Cache-Control: public, max-age=31536000, immutable\n  X-Robots-Tag: noindex, nofollow, noarchive\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n`;

issue(issues, config.configId === 'H_EARTH_RUN_8E_R3F2_P3_CLOUDFLARE_PAGES_DIRECT_UPLOAD_CONFIGURATION_v1', 'P3_CONFIG_ID_INVALID');
issue(issues, config.provider === 'CLOUDFLARE_PAGES_DIRECT_UPLOAD', 'P3_PROVIDER_INVALID');
issue(issues, config.project.name === 'h-earth-run8e-r3f2-preview-30201543', 'P3_PROJECT_NAME_INVALID');
issue(issues, config.project.productionBranch === 'production-disabled-r3f2', 'P3_PRODUCTION_SENTINEL_INVALID');
issue(issues, config.project.previewBranch === 'r3f2-candidate-3020154361523cf1', 'P3_PREVIEW_BRANCH_INVALID');
issue(issues, config.project.productionBranch !== config.project.previewBranch, 'P3_BRANCH_ISOLATION_INVALID');
issue(issues, config.project.gitIntegration === false && config.project.customDomains.length === 0 && config.project.productionDomainUseAllowed === false, 'P3_NON_PRODUCTION_PROJECT_INVALID');
issue(issues, config.source.p2ExactHead === '75ecf5ad0b618318aea384c9422591425320de8f', 'P3_P2_HEAD_INVALID');
issue(issues, config.source.p2PassReceiptGitBlob === '203f960330da70e2947082ac356586caa5e166f0', 'P3_P2_RECEIPT_INVALID');
issue(issues, config.source.exactFileCount === 3 && config.source.files.length === 3, 'P3_SOURCE_FILE_COUNT_INVALID');
issue(issues, config.staging.generatedConfigurationFilesAreServedAssets === false && config.staging.functionsAllowed === false && config.staging.workerAllowed === false && config.staging.redirectsAllowed === false, 'P3_STAGING_ISOLATION_INVALID');
issue(issues, config.publicationGate.trigger === 'workflow_dispatch' && config.publicationGate.automaticPushDeployment === false && config.publicationGate.automaticPullRequestDeployment === false, 'P3_MANUAL_GATE_INVALID');
issue(issues, config.publicationGate.authorizedBranch === 'agent/h-earth-run8e-r3f2-p4-immutable-preview-publication-001', 'P3_AUTHORIZED_BRANCH_INVALID');
issue(issues, config.publicationCommand.uniqueDeploymentUrlRequired === true && config.publicationCommand.branchAliasAcceptedAsEvidenceUrl === false, 'P3_UNIQUE_URL_LAW_INVALID');
issue(issues, Object.values(config.boundaries).every((value, index) => ['deploymentConfigurationCreated'].includes(Object.keys(config.boundaries)[index]) ? value === true : value === false), 'P3_CONFIG_BOUNDARIES_INVALID');

issue(issues, headers === expectedHeaderPolicy, 'P3_HEADER_POLICY_INVALID');
issue(issues, workflow.includes('\n  workflow_dispatch:\n'), 'P3_WORKFLOW_DISPATCH_MISSING');
issue(issues, !workflow.includes('\n  push:') && !workflow.includes('\n  pull_request:'), 'P3_AUTOMATIC_PUBLICATION_TRIGGER_PRESENT');
issue(issues, workflow.includes("if: github.ref_name == 'agent/h-earth-run8e-r3f2-p4-immutable-preview-publication-001'"), 'P3_P4_BRANCH_GATE_MISSING');
issue(issues, workflow.includes('RUN_8E_R3F2_P4_AUTHORIZE_FIRST_NETWORK_PUBLICATION'), 'P3_AUTHORIZATION_LITERAL_MISSING');
issue(issues, workflow.includes('CLOUDFLARE_API_TOKEN') && workflow.includes('CLOUDFLARE_ACCOUNT_ID'), 'P3_CLOUDFLARE_SECRET_GATE_MISSING');
issue(issues, workflow.includes('pages project create "$PROJECT_NAME" --production-branch "$PRODUCTION_BRANCH_SENTINEL"'), 'P3_PROJECT_CREATION_COMMAND_INVALID');
issue(issues, workflow.includes('pages deploy ${{ env.STAGING_ROOT }}') && workflow.includes('--branch=${{ env.PREVIEW_BRANCH }}'), 'P3_PREVIEW_DEPLOY_COMMAND_INVALID');
issue(issues, workflow.includes('steps.deploy.outputs.deployment-url') && workflow.includes('steps.deploy.outputs.pages-deployment-alias-url'), 'P3_DEPLOYMENT_URL_CUSTODY_MISSING');
issue(issues, !workflow.includes('diamondgatebridge.com') && !workflow.includes('showroom/globe/h-earth'), 'P3_LIVE_ROUTE_REFERENCE_PRESENT');

for (const expected of config.source.files) {
  const repositoryPath = `${previewRoot}/${expected.relativePath}`;
  const value = bytes(repositoryPath);
  issue(issues, value.length === expected.byteCount, `P3_SOURCE_BYTES_INVALID:${expected.relativePath}`);
  issue(issues, `sha256:${sha256(value)}` === expected.contentSha256, `P3_SOURCE_SHA256_INVALID:${expected.relativePath}`);
  issue(issues, gitBlob(value) === expected.gitBlobSha1, `P3_SOURCE_GIT_BLOB_INVALID:${expected.relativePath}`);
}

const entryText = read(`${previewRoot}/index.html`);
issue(issues, !/navigator\.serviceWorker|serviceWorker\.register/i.test(entryText), 'P3_SERVICE_WORKER_DRIFT_PRESENT');
issue(issues, H_EARTH_RUN_8E_R3F2_P3_CONTROL.boundaries.networkPublicationPerformed === false, 'P3_NETWORK_PUBLICATION_PREMATURE');
issue(issues, H_EARTH_RUN_8E_R3F2_P3_CONTROL.boundaries.previewUrlIssued === false, 'P3_PREVIEW_URL_PREMATURE');
issue(issues, H_EARTH_RUN_8E_R3F2_P3_CONTROL.stoppingBoundary === 'STOP_BEFORE_FIRST_NETWORK_PUBLICATION', 'P3_STOPPING_BOUNDARY_INVALID');

const receipt = {
  receiptType: 'H_EARTH_RUN_8E_R3F2_P3_CONFIGURATION_VALIDATION_RECEIPT',
  eligible: issues.length === 0,
  status: issues.length === 0
    ? (H_EARTH_RUN_8E_R3F2_P3_CONTROL.currentStatus === 'PASS_CLOSED'
        ? 'RUN_8E_R3F2_P3_PASS_CLOSED'
        : 'RUN_8E_R3F2_P3_CONFIGURATION_VALIDATION_PASS')
    : 'RUN_8E_R3F2_P3_CONFIGURATION_VALIDATION_FAIL',
  checkpointId: 'RUN_8E_R3F2_P3',
  provider: config.provider,
  projectName: config.project.name,
  productionBranchSentinel: config.project.productionBranch,
  previewBranch: config.project.previewBranch,
  publicationWorkflowTrigger: config.publicationGate.trigger,
  uniqueDeploymentUrlRequired: config.publicationCommand.uniqueDeploymentUrlRequired,
  branchAliasAcceptedAsEvidenceUrl: config.publicationCommand.branchAliasAcceptedAsEvidenceUrl,
  exactSourceFileCount: config.source.exactFileCount,
  deploymentConfigurationCreated: true,
  networkPublicationPerformed: false,
  previewUrlIssued: false,
  nextCheckpoint: 'RUN_8E_R3F2_P4_IMMUTABLE_PREVIEW_PUBLICATION_OCCURRENCE',
  stoppingBoundary: 'STOP_BEFORE_FIRST_NETWORK_PUBLICATION',
  issues
};

const outputDirectory = process.env.H_EARTH_RUN8E_R3F2_P3_OUTPUT;
if (outputDirectory) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, 'h-earth.run8e-r3f2-p3.configuration.validation.receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
}
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.eligible) process.exitCode = 1;
