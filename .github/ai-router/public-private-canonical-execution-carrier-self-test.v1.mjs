#!/usr/bin/env node
import fs from 'node:fs';
const descriptor = JSON.parse(fs.readFileSync(new URL('./public-private-canonical-execution-carrier.v1.json', import.meta.url), 'utf8'));
const checks = [];
const check = (name, pass) => checks.push({name, pass:Boolean(pass)});
check('private authority remains sole authority', descriptor.authorityLaw.includes('PRIVATE_CONTROL_PLANE_REMAINS_SOLE_AUTHORITY'));
check('private repository fixed', descriptor.privateRepository === 'smansfield635-create/geodiametrics1');
check('native receipt required', descriptor.privateExecution.nativeReceiptRequired === true);
check('receipt rewrite forbidden', descriptor.privateExecution.receiptResultMayNotBeRewritten === true);
check('github app token required', descriptor.authentication.mechanism === 'GITHUB_APP_INSTALLATION_TOKEN');
check('repository scope fixed', JSON.stringify(descriptor.authentication.repositoryScope) === JSON.stringify(['geodiametrics1']));
check('arbitrary command forbidden', descriptor.prohibitions.includes('ARBITRARY_COMMAND_EXECUTION'));
check('caller ledger bytes forbidden', descriptor.prohibitions.includes('CALLER_SUPPLIED_LEDGER_BYTES'));
check('private main mutation forbidden', descriptor.prohibitions.includes('PRIVATE_MAIN_MUTATION'));
check('full private receipt not public', descriptor.publicOutputs.fullPrivateReceiptPublished === false);
const passed = checks.every(x => x.pass);
process.stdout.write(JSON.stringify({schema:'PUBLIC_PRIVATE_CANONICAL_EXECUTION_CARRIER_SELF_TEST_v1',result:passed?'PASS_CLOSED':'FAIL_CLOSED',checks}, null, 2) + '\n');
if (!passed) process.exitCode = 1;
