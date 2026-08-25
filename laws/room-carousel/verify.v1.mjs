#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const CONTRACT_PATH = "laws/room-carousel/preconstruction-contract.v1.json";
const REQUIRED_SCAFFOLD = [
  CONTRACT_PATH,
  "laws/room-carousel/room-carousel.v1.css",
  "laws/room-carousel/room-carousel.v1.js",
  "laws/room-carousel/verify.v1.mjs",
  "laws/room-carousel/browser-proof.v1.mjs"
];
const TARGETS = [
  "laws/categories/flow/signals/index.html",
  "laws/categories/flow/feedback/index.html",
  "laws/categories/flow/cycles/index.html",
  "laws/categories/flow/handoffs/index.html",
  "laws/categories/integrity/consistency/index.html",
  "laws/categories/integrity/accountability/index.html",
  "laws/categories/integrity/continuity/index.html",
  "laws/categories/integrity/coherence/index.html",
  "laws/categories/reality/theory.html",
  "laws/categories/reality/evidence.html",
  "laws/categories/reality/measure.html",
  "laws/categories/reality/limits.html",
  "laws/categories/structure/constraints.html",
  "laws/categories/structure/interfaces.html",
  "laws/categories/structure/boundaries.html",
  "laws/categories/structure/governance.html",
  "laws/test/admission-and-baseline/index.html",
  "laws/test/forward-construction/index.html",
  "laws/test/reverse-audit/index.html",
  "laws/test/result-and-record/index.html",
  "laws/research/index.html",
  "laws/research/applied-investigations/index.html",
  "laws/research/evidence-and-sources/index.html",
  "laws/research/findings-and-boundaries/index.html"
];
const ALLOWED = new Set([
  ...REQUIRED_SCAFFOLD,
  ...TARGETS,
  "laws/room-carousel/receipts/static-verification.v1.json",
  "laws/room-carousel/receipts/browser-proof.v1.json",
  "laws/room-carousel/receipts/continuity-audit.v1.json"
]);

function args(argv) {
  const out = { final: false };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--final") out.final = true;
    else if (token === "--base") out.base = argv[++i];
    else if (token === "--head") out.head = argv[++i];
    else if (token === "--output") out.output = argv[++i];
    else throw new Error(`UNKNOWN_ARGUMENT:${token}`);
  }
  return out;
}

const git = (...argv) => execFileSync("git", argv, { encoding: "utf8" }).trim();
const sha40 = value => /^[0-9a-f]{40}$/.test(String(value || ""));
const exists = file => fs.existsSync(path.resolve(file));

function write(output, receipt) {
  const text = `${JSON.stringify(receipt, null, 2)}\n`;
  if (!output) process.stdout.write(text);
  else {
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    fs.writeFileSync(path.resolve(output), text);
  }
}

function main() {
  const a = args(process.argv.slice(2));
  if (!sha40(a.base) || !sha40(a.head)) throw new Error("BASE_OR_HEAD_NOT_EXACT_SHA");
  const actual = git("rev-parse", "HEAD");
  if (actual !== a.head) throw new Error(`HEAD_MISMATCH:${actual}`);

  const contract = JSON.parse(fs.readFileSync(CONTRACT_PATH, "utf8"));
  if (contract.schema !== "LAWS_DESTINATION_ROOM_CONJUGATION_PRECONSTRUCTION_CONTRACT_v1") throw new Error("CONTRACT_SCHEMA_MISMATCH");
  if (contract.exactGoverningHead !== a.base) throw new Error("CONTRACT_BASE_MISMATCH");
  if (contract.operationId !== "LAWS_FIRST_ROOM_CONJUGATION_20260824_1626_S3_D8E0CFAE") throw new Error("CONTRACT_OPERATION_MISMATCH");

  const changed = git("diff", "--name-only", `${a.base}..${a.head}`).split("\n").filter(Boolean);
  const unrelated = changed.filter(file => !ALLOWED.has(file));
  if (unrelated.length) throw new Error(`UNRELATED_DIFF:${unrelated.join(",")}`);

  for (const file of REQUIRED_SCAFFOLD) if (!exists(file)) throw new Error(`REQUIRED_SCAFFOLD_MISSING:${file}`);

  const protectedGateway = git("diff", "--name-only", `${a.base}..${a.head}`, "--", "laws/index.html");
  if (protectedGateway) throw new Error("PROTECTED_LAWS_GATEWAY_BYTE_DRIFT");
  const protectedMethods = git("diff", "--name-only", `${a.base}..${a.head}`, "--", "laws/research/methods-and-models");
  if (protectedMethods) throw new Error("PROTECTED_METHODS_MODELS_BYTE_DRIFT");

  const receipt = {
    schema: "LAWS_DESTINATION_ROOM_CONJUGATION_STATIC_VERIFICATION_RECEIPT_v1",
    exactBase: a.base,
    exactHead: a.head,
    changedPaths: changed,
    unrelatedDiff: unrelated,
    protectedGatewayByteIdentical: true,
    protectedMethodsModelsByteIdentical: true,
    sharedRuntimeInstalled: true,
    finalQualificationClaimed: false,
    finalMode: a.final
  };

  if (!a.final) {
    receipt.result = "MATERIALIZATION_BOUNDARY_ESTABLISHED";
    receipt.destinationConjugationComplete = false;
    write(a.output, receipt);
    return;
  }

  const failures = [];
  for (const file of TARGETS) {
    if (!exists(file)) {
      failures.push(`${file}:MISSING`);
      continue;
    }
    const html = fs.readFileSync(file, "utf8");
    if (!html.includes("data-laws-room-carousel")) failures.push(`${file}:CAROUSEL_ROOT_MISSING`);
    if (!html.includes("/laws/room-carousel/room-carousel.v1.css")) failures.push(`${file}:SHARED_CSS_MISSING`);
    if (!html.includes("/laws/room-carousel/room-carousel.v1.js")) failures.push(`${file}:SHARED_JS_MISSING`);
  }
  receipt.destinationConjugationComplete = failures.length === 0;
  receipt.failures = failures;
  receipt.finalQualificationClaimed = failures.length === 0;
  receipt.result = failures.length ? "FAIL_CLOSED" : "STATIC_FINAL_PASS";
  write(a.output, receipt);
  if (failures.length) process.exitCode = 2;
}

try { main(); }
catch (error) {
  write(null, {
    schema: "LAWS_DESTINATION_ROOM_CONJUGATION_STATIC_VERIFICATION_FAILURE_v1",
    result: "FAIL_CLOSED",
    error: error.message,
    finalQualificationClaimed: false
  });
  process.exitCode = 1;
}
