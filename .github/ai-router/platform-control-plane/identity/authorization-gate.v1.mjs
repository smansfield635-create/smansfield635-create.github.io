#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REQUEST_SCHEMA = 'L2_AUTHORIZATION_DECISION_REQUEST_v1';
export const RECEIPT_SCHEMA = 'L2_AUTHORIZATION_DECISION_RECEIPT_v1';
export const PRINCIPAL_REGISTRY_SCHEMA = 'L2_CONTROL_PLANE_PRINCIPAL_REGISTRY_v1';
export const ROLE_POLICY_SCHEMA = 'L2_CONTROL_PLANE_ROLE_POLICY_v1';

const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;
const isObject = value => value && typeof value === 'object' && !Array.isArray(value);
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(stable(value), null, 2) + '\n');
const uniqueSorted = values => [...new Set(values)].sort();

function deny(input, errorCode, reasons = [], extra = {}) {
  return stable({
    schema: RECEIPT_SCHEMA,
    result: 'DENY',
    decision: 'DENY',
    errorCode,
    reasons,
    principalId: input?.principalId ?? null,
    tenantId: input?.tenantId ?? null,
    projectId: input?.projectId ?? null,
    action: input?.action ?? null,
    resource: input?.resource ?? null,
    subjectHead: input?.subjectHead ?? null,
    currentMainHead: input?.currentMainHead ?? null,
    effectiveRoles: [],
    authorityCreated: false,
    authenticationPerformed: false,
    mergeAuthorityCreated: false,
    repositorySettingsAuthorityCreated: false,
    branchProtectionAuthorityCreated: false,
    rulesetActivationAuthorityCreated: false,
    externalRepositoryWriteAuthorityCreated: false,
    hEarthAuthorityCreated: false,
    lawsAuthorityCreated: false,
    deploymentAuthorityCreated: false,
    genericCommandAuthorityCreated: false,
    ...extra
  });
}

function validResource(resource) {
  if (typeof resource !== 'string' || resource.length === 0 || resource.includes('\0') || resource.includes('\\')) return false;
  if (resource.startsWith('control-plane://')) return true;
  if (resource.startsWith('/') || resource.split('/').some(part => part === '..')) return false;
  return true;
}

function bindingMatches(binding, evidence) {
  if (!isObject(binding) || !isObject(evidence)) return false;
  return Object.entries(binding).every(([key, expected]) => evidence[key] === expected);
}

function resourceMatches(permission, resource) {
  const prefixes = Array.isArray(permission.resourcePrefixes) ? permission.resourcePrefixes : [];
  const exact = Array.isArray(permission.exactResources) ? permission.exactResources : [];
  return exact.includes(resource) || prefixes.some(prefix => resource.startsWith(prefix));
}

function roleAllows(role, action, resource) {
  const permissions = Array.isArray(role?.permissions) ? role.permissions : [];
  return permissions.some(permission => {
    const actions = Array.isArray(permission.actions) ? permission.actions : [];
    return actions.includes(action) && resourceMatches(permission, resource);
  });
}

export function evaluateAuthorization(input, principalRegistry, rolePolicy) {
  if (!isObject(input) || input.schema !== REQUEST_SCHEMA) {
    return deny(input, 'AUTHORIZATION_REQUEST_SCHEMA_INVALID', ['REQUEST_SCHEMA_INVALID']);
  }
  if (!isObject(principalRegistry) || principalRegistry.schema !== PRINCIPAL_REGISTRY_SCHEMA || principalRegistry.status !== 'ACTIVE_FAIL_CLOSED_WHEN_REFERENCED') {
    return deny(input, 'PRINCIPAL_REGISTRY_INVALID', ['PRINCIPAL_REGISTRY_INVALID']);
  }
  if (!isObject(rolePolicy) || rolePolicy.schema !== ROLE_POLICY_SCHEMA || rolePolicy.status !== 'ACTIVE_FAIL_CLOSED' || rolePolicy.denyOverrides !== true) {
    return deny(input, 'ROLE_POLICY_INVALID', ['ROLE_POLICY_INVALID']);
  }
  if (typeof input.subjectHead !== 'string' || typeof input.currentMainHead !== 'string' || input.subjectHead !== input.currentMainHead) {
    return deny(input, 'EXACT_HEAD_MISMATCH', ['SUBJECT_HEAD_DIFFERS_FROM_CURRENT_MAIN']);
  }
  if (!validResource(input.resource)) {
    return deny(input, 'RESOURCE_INVALID', ['RESOURCE_INVALID']);
  }
  const knownActions = new Set(Array.isArray(rolePolicy.knownActions) ? rolePolicy.knownActions : []);
  if (!knownActions.has(input.action)) {
    return deny(input, 'UNKNOWN_ACTION', [`UNKNOWN_ACTION:${input.action ?? 'NULL'}`]);
  }
  const principals = Array.isArray(principalRegistry.principals) ? principalRegistry.principals : [];
  const principal = principals.find(candidate => candidate.principalId === input.principalId);
  if (!principal) {
    return deny(input, 'UNKNOWN_PRINCIPAL', [`UNKNOWN_PRINCIPAL:${input.principalId ?? 'NULL'}`]);
  }
  if (principal.enabled !== true) {
    return deny(input, 'PRINCIPAL_DISABLED', [`PRINCIPAL_DISABLED:${principal.principalId}`]);
  }
  if (!bindingMatches(principal.binding, input.identityEvidence)) {
    return deny(input, 'IDENTITY_EVIDENCE_MISMATCH', ['IDENTITY_EVIDENCE_DOES_NOT_MATCH_REGISTRY_BINDING']);
  }
  if (input.tenantId !== principal.tenantId) {
    return deny(input, 'CROSS_TENANT_DENIED', [`EXPECTED_TENANT:${principal.tenantId}`]);
  }
  const projects = Array.isArray(principal.projectIds) ? principal.projectIds : [];
  if (!projects.includes(input.projectId)) {
    return deny(input, 'CROSS_PROJECT_DENIED', [`PROJECT_NOT_ASSIGNED:${input.projectId ?? 'NULL'}`]);
  }
  const effectiveRoles = uniqueSorted(Array.isArray(principal.roles) ? principal.roles : []);
  const assertedRoles = uniqueSorted(Array.isArray(input.assertedRoles) ? input.assertedRoles : []);
  const injectedRoles = assertedRoles.filter(roleId => !effectiveRoles.includes(roleId));
  if (injectedRoles.length > 0) {
    return deny(input, 'ROLE_ASSERTION_ESCALATION', [`UNASSIGNED_ROLE_ASSERTED:${injectedRoles.join(',')}`], { effectiveRoles });
  }
  const globalDenied = new Set(Array.isArray(rolePolicy.globalDeniedActions) ? rolePolicy.globalDeniedActions : []);
  if (globalDenied.has(input.action)) {
    return deny(input, 'GLOBAL_ACTION_DENIED', [`GLOBAL_DENY:${input.action}`], { effectiveRoles });
  }
  const roleDefinitions = isObject(rolePolicy.roles) ? rolePolicy.roles : {};
  const missingRoles = effectiveRoles.filter(roleId => !isObject(roleDefinitions[roleId]));
  if (missingRoles.length > 0) {
    return deny(input, 'REGISTERED_ROLE_DEFINITION_MISSING', [`MISSING_ROLE_DEFINITION:${missingRoles.join(',')}`], { effectiveRoles });
  }
  const allowingRoles = effectiveRoles.filter(roleId => roleAllows(roleDefinitions[roleId], input.action, input.resource));
  if (allowingRoles.length === 0) {
    return deny(input, 'ROLE_SCOPE_DENIED', ['NO_EFFECTIVE_ROLE_ALLOWS_ACTION_ON_RESOURCE'], { effectiveRoles });
  }
  return stable({
    schema: RECEIPT_SCHEMA,
    result: 'ALLOW',
    decision: 'ALLOW',
    errorCode: null,
    reasons: ['REGISTRY_IDENTITY_BOUND', 'TENANT_BOUND', 'PROJECT_BOUND', 'ROLE_BOUND', 'RESOURCE_SCOPE_BOUND'],
    principalId: principal.principalId,
    principalType: principal.principalType,
    tenantId: principal.tenantId,
    projectId: input.projectId,
    action: input.action,
    resource: input.resource,
    subjectHead: input.subjectHead,
    currentMainHead: input.currentMainHead,
    effectiveRoles,
    allowingRoles,
    principalRegistryId: principalRegistry.registryId,
    rolePolicyId: rolePolicy.policyId,
    authenticationPerformed: false,
    externalIdentityEvidenceRequired: true,
    authorizationDecisionDoesNotCreateAuthority: true,
    authorityCreated: false,
    mergeAuthorityCreated: false,
    repositorySettingsAuthorityCreated: false,
    branchProtectionAuthorityCreated: false,
    rulesetActivationAuthorityCreated: false,
    externalRepositoryWriteAuthorityCreated: false,
    hEarthAuthorityCreated: false,
    lawsAuthorityCreated: false,
    deploymentAuthorityCreated: false,
    genericCommandAuthorityCreated: false
  });
}

function parseArgs(argv) {
  const output = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || value === undefined) throw new Error('CLI_ARGUMENT_INVALID');
    output[key.slice(2)] = value;
  }
  return output;
}

function invokedDirectly() {
  return process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (invokedDirectly()) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (!args.input || !args.registry || !args.policy || !args.output) throw new Error('CLI_REQUIRED_ARGUMENT_MISSING');
    const input = JSON.parse(fs.readFileSync(args.input, 'utf8'));
    const registry = JSON.parse(fs.readFileSync(args.registry, 'utf8'));
    const policy = JSON.parse(fs.readFileSync(args.policy, 'utf8'));
    const receipt = evaluateAuthorization(input, registry, policy);
    write(args.output, receipt);
    if (receipt.decision !== 'ALLOW') process.exitCode = 3;
  } catch (error) {
    const fallback = deny({}, error.message || 'AUTHORIZATION_GATE_EXCEPTION', ['GATE_EXCEPTION']);
    const outputIndex = process.argv.indexOf('--output');
    if (outputIndex >= 0 && process.argv[outputIndex + 1]) write(process.argv[outputIndex + 1], fallback);
    else process.stderr.write(JSON.stringify(fallback) + '\n');
    process.exitCode = 1;
  }
}
