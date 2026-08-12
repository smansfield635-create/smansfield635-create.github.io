#!/usr/bin/env node
const receipt = Object.freeze({
  schema: 'PUBLIC_GOVERNANCE_RETIREMENT_HANDOFF_v1',
  result: 'PUBLIC_GOVERNANCE_IMPLEMENTATION_RETIRED',
  authorityCreated: false,
  executionAuthorized: false,
  mutationAuthorized: false,
  mergeAuthorized: false,
  forwardingPerformed: false
});
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
process.exitCode = 1;
