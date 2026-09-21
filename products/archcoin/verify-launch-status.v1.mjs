#!/usr/bin/env node
// Qualifies this bounded website update against preserved deployment receipt facts.
// This verifier does not query Ethereum or establish current balances or market value.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const BASE = 'e5cdbf4bd83ac96f5560201bfa9dce3b8d12ebd7';
const ROOT = process.cwd();
const MANIFEST = '.github/ai-router/publication-surfaces/archcoin.json';
const ENTRY = '.github/ai-router/projects/archcoin/entrypoint.v1.json';
const ROUTER = '.github/ai-router/router.v1.json';
const SELF = 'products/archcoin/verify-launch-status.v1.mjs';
const PLANES = ['overview', 'engineering', 'platform', 'governance'];
const COINS = [
  { id: 'contract', symbol: 'ARCC', address: '0xAA4eA6c3020795C2DA0Aa3bA478099bA1f5F1947', transaction: '0xd932dceef5f3085f7d42e6ac25a44c6675364156261305b1fd650899c70a3ea0', date: '2026-09-20' },
  { id: 'receivable', symbol: 'ARCR', address: '0xebffa6543fa839fb3287867a18b536fd6c543c9f', transaction: '0xceed44390a9e0456331569964d2fc4e39f6654707d34ff1f3d7c38eb928c732a', date: '2026-09-21' },
  { id: 'payable', symbol: 'ARCP' },
  { id: 'allocation', symbol: 'ARCA' }
];
const PAGES = ['products/archcoin/index.html', ...COINS.map(coin => `products/archcoin/${coin.id}/index.html`)];
const ALLOWED = [ROUTER, ENTRY, MANIFEST, ...PAGES, SELF].sort();
const args = process.argv.slice(2);
let head = null;
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--head') head = args[++i];
  else if (args[i] === '--base') assert(args[++i] === BASE, 'GOVERNING_BASE_MISMATCH');
  else fail('UNKNOWN_ARGUMENT', args[i]);
}
assert(head === 'WORKTREE' || /^[0-9a-f]{40}$/.test(head || ''), 'EXACT_HEAD_OR_WORKTREE_REQUIRED');
const preflight = head === 'WORKTREE';
function fail(code, detail = null) {
  console.error(JSON.stringify({ schema: 'ARCHCOIN_LAUNCH_STATUS_VERIFICATION_RECEIPT_v1', result: 'FAIL_CLOSED', errorCode: code, detail }, null, 2));
  process.exit(1);
}
function assert(condition, code, detail) { if (!condition) fail(code, detail); }
function git(...argv) { return execFileSync('git', argv, { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }); }
function lines(value) { return value.trim().split(/\r?\n/).filter(Boolean); }
function read(file) {
  if (!preflight) return git('show', `${head}:${file}`);
  if (fs.existsSync(path.join(ROOT, file))) return fs.readFileSync(path.join(ROOT, file), 'utf8');
  // A sparse checkout intentionally omits skip-worktree files. Read their index
  // bytes; missing ordinary tracked files still fail instead of being concealed.
  if (git('ls-files', '-v', '--', file).startsWith('S ')) return git('show', `:${file}`);
  fail('CANDIDATE_FILE_MISSING', file);
}
function old(file) { return git('show', `${BASE}:${file}`); }
function same(a, b, code, detail) { assert(JSON.stringify(a) === JSON.stringify(b), code, detail); }
function withoutCode(html) { return html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, ''); }
function text(html) { return withoutCode(html).replace(/<[^>]*>/g, ' ').replace(/&(?:nbsp|#160);/g, ' ').replace(/\s+/g, ' ').trim(); }
function tags(html) { return withoutCode(html).match(/<[a-z][^>]*>/gi) || []; }
function attributes(html, pattern) { return tags(html).flatMap(tag => [...tag.matchAll(pattern)].map(match => match[0])); }
function scripts(html) { return html.match(/<script\b[\s\S]*?<\/script>/gi) || []; }
function routes(html) { return attributes(html, /\bhref\s*=\s*["'](?:\/?products\/archcoin\/|\.\.\/|#)[^"']*["']/gi).sort(); }
function hooks(html) { return attributes(html, /\bdata-(?!attained\b)[a-z0-9_-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi); }

git('cat-file', '-e', `${BASE}^{commit}`);
if (!preflight) { git('cat-file', '-e', `${head}^{commit}`); git('merge-base', '--is-ancestor', BASE, head); }
const changed = [...new Set([
  ...lines(preflight ? git('diff', '--name-only', BASE, '--') : git('diff', '--name-only', BASE, head, '--')),
  ...(preflight ? lines(git('ls-files', '--others', '--exclude-standard')) : [])
])].sort();
same(changed, ALLOWED, 'EXACT_CHANGED_PATH_SET_MISMATCH', { changed, expected: ALLOWED });

// Every historical fixture, runtime asset, token implementation and deep link
// remains byte-identical, including assets not explicitly named by this test.
const preserved = lines(git('ls-tree', '-r', '--name-only', BASE, '--', 'products/archcoin/', 'economy/archcoin/', 'assets/compass/')).filter(file => !ALLOWED.includes(file));
for (const file of preserved) assert(read(file) === old(file), 'PROTECTED_SOURCE_CHANGED', file);

for (const file of PAGES) {
  const html = read(file), baseline = old(file);
  same(scripts(html), scripts(baseline), 'SCRIPT_BYTES_CHANGED', file);
  same(hooks(html), hooks(baseline), 'RUNTIME_DATA_HOOK_CHANGED', file);
  const interactionAttributes = /\b(?:aria-[a-z0-9_-]+|role|tabindex|id|hidden|inert)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi;
  same(attributes(html, interactionAttributes), attributes(baseline, interactionAttributes), 'ACCESSIBILITY_OR_INTERACTION_ATTRIBUTE_CHANGED', file);
  same(routes(html), routes(baseline), 'INTERNAL_ROUTE_CHANGED', file);
  same(tags(html).filter(tag => /<link\b/i.test(tag)), tags(baseline).filter(tag => /<link\b/i.test(tag)), 'STYLESHEET_OR_HEAD_LINK_CHANGED', file);
  assert(!/\bSepolia pending\b/i.test(text(html)), 'STALE_PENDING_STATUS', file);
  assert(!/\b(?:Evan|construction job|upload (?:your )?(?:invoice|contract|files))\b/i.test(text(html)), 'BUSINESS_APP_SCOPE_LEAK', file);
  assert(!/\b(?:buy now|guaranteed (?:profit|return)|price target)\b/i.test(text(html)), 'UNSUPPORTED_MARKETING_CLAIM', file);
}

const root = read(PAGES[0]);
const rootText = text(root);
assert(/(?:two|2)\s+(?:(?:coins?|tokens?)\s+)?(?:launched|live)/i.test(rootText), 'ROOT_LAUNCHED_COUNT_MISSING');
assert(/(?:two|2)\s+(?:(?:coins?|tokens?)\s+)?prospective/i.test(rootText), 'ROOT_PROSPECTIVE_COUNT_MISSING');
let redirects = 0;
for (const coin of COINS) {
  const file = `products/archcoin/${coin.id}/index.html`;
  const html = read(file), body = text(html);
  assert(body.includes(coin.symbol) && html.includes(`data-domain="${coin.id}"`), 'ASSET_IDENTITY_MISMATCH', coin.id);
  same([...html.matchAll(/data-carousel-plane="([^"]+)"/g)].map(match => match[1]), PLANES, 'PLANE_ORDER_CHANGED', coin.id);
  assert((html.match(/\bdata-carousel-tab\b/g) || []).length === 4, 'TAB_COUNT_CHANGED', coin.id);
  assert((html.match(/role="tabpanel"/g) || []).length === 4, 'TABPANEL_COUNT_CHANGED', coin.id);
  const status = text(html.match(/<section\b[^>]*class="status-spine"[\s\S]*?<\/section>/i)?.[0] || '');
  assert(status, 'STATUS_SECTION_MISSING', coin.id);
  if (coin.address) {
    assert(/(?:launched|deployed)/i.test(status) && /Ethereum mainnet/i.test(status), 'MAINNET_STATUS_MISSING', coin.id);
    assert(body.includes(`1,000,000 ${coin.symbol}`) && body.includes('18 decimal places'), 'SUPPLY_OR_DECIMALS_MISMATCH', coin.id);
    for (const [kind, identity] of [['address', coin.address], ['tx', coin.transaction]]) {
      assert(html.toLowerCase().includes(`https://etherscan.io/${kind}/${identity}`.toLowerCase()), 'DEPLOYMENT_EVIDENCE_LINK_MISSING', { coin: coin.symbol, kind });
    }
    const identities = [...html.matchAll(/https:\/\/etherscan\.io\/(address|tx)\/(0x[0-9a-f]+)/gi)];
    for (const match of identities) assert(match[2].toLowerCase() === (match[1].toLowerCase() === 'address' ? coin.address : coin.transaction).toLowerCase(), 'WRONG_COIN_EXPLORER_IDENTITY', coin.symbol);
    assert(!/not represented here as a deployed cryptocurrency|no (?:Sepolia )?contract address|no recipient wallet has been selected|mainnet remains later|next deployment environment is Ethereum Sepolia|not a frozen Sepolia or mainnet issuance/i.test(body), 'STALE_UNDEPLOYED_CLAIM', coin.symbol);
  } else {
    assert(/prospective/i.test(status) && /not (?:yet )?(?:launched|deployed)/i.test(status), 'PROSPECTIVE_STATUS_MISSING', coin.id);
    assert(!/https:\/\/etherscan\.io\/(?:address|tx)\/0x[0-9a-f]+/i.test(html), 'PROSPECTIVE_DEPLOYMENT_IDENTITY', coin.id);
    assert(!/\b0x[0-9a-f]{40}\b/i.test(body), 'PROSPECTIVE_CONTRACT_ADDRESS', coin.id);
  }
  for (const plane of PLANES) {
    const redirect = read(`products/archcoin/${coin.id}/${plane}/index.html`);
    assert(redirect.includes(`rel="canonical" href="../#${plane}"`) && redirect.includes(`content="0; url=../#${plane}"`), 'LEGACY_REDIRECT_CHANGED', `${coin.id}/${plane}`);
    redirects += 1;
  }
}

const manifest = JSON.parse(read(MANIFEST));
const oldManifest = JSON.parse(old(MANIFEST));
assert(manifest.schema === oldManifest.schema && manifest.surfaceId === 'archcoin', 'PUBLICATION_MANIFEST_IDENTITY_CHANGED');
same(manifest.runtime, oldManifest.runtime, 'PUBLICATION_RUNTIME_CHECKS_CHANGED');
same(manifest.checks.map(check => check.path), oldManifest.checks.map(check => check.path), 'PUBLICATION_SURFACE_COVERAGE_CHANGED');
for (const check of manifest.checks) {
  const file = check.path.replace(/^\//, '');
  const source = read(file);
  for (const token of check.includes || []) assert(source.includes(token), 'PUBLICATION_REQUIRED_TOKEN_MISSING', { file, token });
  for (const token of check.excludes || []) assert(!source.includes(token), 'PUBLICATION_FORBIDDEN_TOKEN_FOUND', { file, token });
  if (!PAGES.includes(file)) same(check, oldManifest.checks.find(item => item.path === check.path), 'UNRELATED_PUBLICATION_CHECK_CHANGED', file);
}

const router = JSON.parse(read(ROUTER)), oldRouter = JSON.parse(old(ROUTER));
const registration = router.projects.filter(project => project.entrypoint === ENTRY);
assert(registration.length === 1, 'ARCHCOIN_REGISTRATION_COUNT');
same({ ...router, projects: router.projects.filter(project => project.entrypoint !== ENTRY) }, oldRouter, 'EXISTING_ROUTER_REGISTRATION_CHANGED');
const entry = JSON.parse(read(ENTRY));
assert(entry.schema === 'REPOSITORY_AI_PROJECT_ENTRYPOINT_v1' && entry.status === 'ACTIVE_REGISTERED_PROJECT', 'PROJECT_ENTRY_INVALID');
assert(entry.projectId === registration[0].projectId && entry.entrypoint === ENTRY, 'PROJECT_IDENTITY_MISMATCH');
for (const object of [registration[0], entry]) {
  same(object.ownedPathPrefixes, [], 'OWNERSHIP_PREFIX_EXPANSION');
  same([...object.ownedExactPaths].sort(), [...PAGES, SELF].sort(), 'OWNERSHIP_EXACT_PATH_EXPANSION');
}
assert(entry.requiredInstructions.includes('AGENTS.md') && entry.requiredInstructions.includes('AI_ENTRYPOINT.json'), 'REQUIRED_INSTRUCTIONS_MISSING');

console.log(JSON.stringify({
  schema: 'ARCHCOIN_LAUNCH_STATUS_VERIFICATION_RECEIPT_v1',
  result: preflight ? 'WORKTREE_PREFLIGHT_PASS' : 'PASS_CLOSED',
  governingHead: BASE, candidateHead: head,
  operationId: 'ARCHCOIN_PUBLIC_LAUNCH_STATUS_UPDATE_20260922_001',
  changedPaths: changed, preservedSourceCount: preserved.length,
  launchedAssets: COINS.filter(coin => coin.address).map(({ symbol, address, transaction, date }) => ({ symbol, address, transaction, deploymentDate: date, totalSupply: '1000000', decimals: 18 })),
  prospectiveAssets: ['ARCP', 'ARCA'], semanticPlaneCount: 16, legacyRedirectCount: redirects,
  publicationSourceChecks: manifest.checks.length, publicationRuntimeContractPreserved: true,
  evidenceBasis: 'PRESERVED_DEPLOYMENT_RECEIPT_FACTS_AND_EXACT_REPOSITORY_SOURCE',
  liveBlockchainReadPerformed: false, runtimeBrowserExecutionPerformed: false,
  deploymentPerformed: false, publicationPerformed: false
}, null, 2));
