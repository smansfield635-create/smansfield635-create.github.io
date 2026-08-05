#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../');
const args = {}; for (let i = 2; i < process.argv.length; i += 2) args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1];
const holder = args.holder || 'UNSPECIFIED';
const bundle = JSON.parse(fs.readFileSync(path.join(here, 'toolset.bundle.v1.json'), 'utf8'));
const locator = bundle.locator, registry = bundle.instrumentRegistry, gates = bundle.phaseGates, scoring = bundle.scoringModel, contextual = bundle.implementationClassRouting;
const checks = []; const check = (name, pass, detail = '') => checks.push({ name, result: pass ? 'PASS' : 'FAIL', detail });
check('bundle-active-v1.1.0', bundle.status === 'ACTIVE_VERSION_BOUND' && bundle.version === '1.1.0');
check('toolset-active', locator.status === 'ACTIVE_VERSION_BOUND' && locator.version === bundle.version);
check('nine-instruments', registry.instruments.length === 9 && registry.requiredInstrumentCount === 9);
check('contextual-instrument-active', registry.instruments.some(i => i.id === 'contextualArchitectureConformanceInstrument' && i.status === 'ACTIVE_VERSION_BOUND' && i.version === bundle.version));
check('all-version-bound', registry.instruments.every(i => i.status === 'ACTIVE_VERSION_BOUND' && i.version === bundle.version && i.thresholdsRef));
check('four-gates', Object.keys(gates.gates).length === 4);
check('architecture-context-findings', ['IMPLEMENTATION_CLASS','EXISTING_CONSTRUCT_SEARCH','EXACT_SOURCE_CONSTRUCT_IDENTITIES','ADOPTION_MATRIX','VISUAL_ARCHITECTURE_AUTHORITY','PROHIBITED_SUBSTITUTE_ARCHITECTURES','REQUIRED_RUNTIME_CONDITIONS'].every(id => gates.gates.ARCHITECTURE.requiredFindings.includes(id)));
check('hard-gate-before-scoring', contextual.status === 'ACTIVE_FAIL_CLOSED' && contextual.hardGatePrecedesScoring === true && scoring.hardGates.includes('CONTEXTUAL_ARCHITECTURE_CONFORMANCE'));
check('wrong-class-score-override', scoring.constructValidityOverride === 'WRONG_IMPLEMENTATION_CLASS_FAILS_CLOSED_REGARDLESS_OF_GENERIC_SCORE');
check('negative-fixtures', contextual.negativeFixtures.length >= 10);
check('seven-domains', scoring.domains.length === 7 && scoring.domains.reduce((sum, d) => sum + d.weight, 0) === 100);
check('award-layer-separated', bundle.universalStandard.layer2.currentAdapterBound === false && bundle.universalStandard.layer2.requiredOnlyWhenAwardReadinessClaimed === true);
const gate = spawnSync(process.execPath, [path.join(here, 'page-operation-entry-gate.v1.mjs'), '--self-test'], { cwd: root, encoding: 'utf8' });
let gateReceipt = null; try { gateReceipt = JSON.parse(gate.stdout); } catch {}
check('gate-self-test', gate.status === 0 && gateReceipt?.result === 'PASS', gate.stderr || '');
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
const normalized = stable({ toolsetVersion: bundle.version, instrumentRegistry: registry, implementationClassRouting: contextual, phaseGates: gates, scoringHardGates: scoring.hardGates, checks, gateSelfTest: gateReceipt });
const normalizedFingerprint = crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
const result = { schema: 'MANDATORY_PAGE_EXCELLENCE_TOOLCHAIN_SELF_TEST_v2', operationId: 'METHODS_EXISTING_CONSTRUCT_ADOPTION_MANDATORY_ROUTING_REPAIR_v1', holder, result: checks.every(c => c.result === 'PASS') ? 'PASS' : 'FAIL', toolsetVersion: bundle.version, instrumentCount: registry.instruments.length, normalizedFingerprint, checks, gateSelfTest: gateReceipt, boundaries: { productMutationPerformed: false, visualSubjectMutated: false, mergePerformed: false, constructionAuthorityActiveAfterReceipt: true } };
const text = JSON.stringify(result, null, 2) + '\n';
if (args.output) { fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true }); fs.writeFileSync(path.resolve(args.output), text); }
process.stdout.write(text); if (result.result !== 'PASS') process.exitCode = 1;
