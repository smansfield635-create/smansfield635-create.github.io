import fs from 'node:fs';

const entry=JSON.parse(fs.readFileSync('AI_RELEASE_ENTRYPOINT.json','utf8'));
const binding=JSON.parse(fs.readFileSync('.github/ai-router/automatic-release-binding.v1.json','utf8'));
const workflow=fs.readFileSync('.github/workflows/ai-entry-auto-release.yml','utf8');

const checks={
  active:entry.status==='ACTIVE'&&binding.status==='ACTIVE',
  pushMain:workflow.includes('push:')&&workflow.includes('branches: [main]'),
  exactCheckout:workflow.includes('ref: ${{ github.sha }}'),
  pagesDeploy:workflow.includes('actions/deploy-pages@v4'),
  releaseMarker:workflow.includes('.well-known/dgb-release.json'),
  exactVerification:workflow.includes('LIVE_EXACT_HEAD_VERIFIED'),
  noOwnerManualAction:entry.ownerManualDeploymentRequired===false&&binding.manualOwnerActionRequired===false
};
const pass=Object.values(checks).every(Boolean);
console.log(JSON.stringify({schema:'AI_AUTO_RELEASE_BINDING_QUALIFICATION_v1',pass,checks},null,2));
if(!pass) process.exit(1);
