#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROUTES = [
  "/laws/categories/flow/signals/",
  "/laws/categories/flow/feedback/",
  "/laws/categories/flow/cycles/",
  "/laws/categories/flow/handoffs/",
  "/laws/categories/integrity/consistency/",
  "/laws/categories/integrity/accountability/",
  "/laws/categories/integrity/continuity/",
  "/laws/categories/integrity/coherence/",
  "/laws/categories/reality/theory.html",
  "/laws/categories/reality/evidence.html",
  "/laws/categories/reality/measure.html",
  "/laws/categories/reality/limits.html",
  "/laws/categories/structure/constraints.html",
  "/laws/categories/structure/interfaces.html",
  "/laws/categories/structure/boundaries.html",
  "/laws/categories/structure/governance.html",
  "/laws/test/admission-and-baseline/",
  "/laws/test/forward-construction/",
  "/laws/test/reverse-audit/",
  "/laws/test/result-and-record/",
  "/laws/research/",
  "/laws/research/applied-investigations/",
  "/laws/research/evidence-and-sources/",
  "/laws/research/findings-and-boundaries/"
];

function parse(argv) {
  const out = { final: false, origin: "http://127.0.0.1:4173" };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--final") out.final = true;
    else if (token === "--base") out.base = argv[++i];
    else if (token === "--head") out.head = argv[++i];
    else if (token === "--origin") out.origin = argv[++i];
    else if (token === "--output") out.output = argv[++i];
    else throw new Error(`UNKNOWN_ARGUMENT:${token}`);
  }
  return out;
}

const git = (...argv) => execFileSync("git", argv, { encoding: "utf8" }).trim();
const exactSha = value => /^[0-9a-f]{40}$/.test(String(value || ""));
function emit(output, value) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  if (!output) process.stdout.write(text);
  else {
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    fs.writeFileSync(path.resolve(output), text);
  }
}

async function main() {
  const a = parse(process.argv.slice(2));
  if (!exactSha(a.base) || !exactSha(a.head)) throw new Error("BASE_OR_HEAD_NOT_EXACT_SHA");
  if (git("rev-parse", "HEAD") !== a.head) throw new Error("HEAD_MISMATCH");

  const receipt = {
    schema: "LAWS_DESTINATION_ROOM_CONJUGATION_BROWSER_PROOF_RECEIPT_v1",
    exactBase: a.base,
    exactHead: a.head,
    sharedRuntime: "LAWS_ROOM_CAROUSEL_L1_v1",
    finalMode: a.final,
    finalQualificationClaimed: false
  };

  if (!a.final) {
    receipt.result = "BROWSER_PROOF_SCAFFOLD_INSTALLED";
    receipt.browserExecutionPerformed = false;
    emit(a.output, receipt);
    return;
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const observations = [];
  try {
    for (const route of ROUTES) {
      const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
      const url = new URL(route, a.origin).href;
      await page.goto(url, { waitUntil: "networkidle" });
      const root = page.locator("[data-laws-room-carousel]").first();
      if (await root.count() !== 1) {
        failures.push(`${route}:CAROUSEL_ROOT_MISSING`);
        await page.close();
        continue;
      }
      const mounted = await root.getAttribute("data-lrc-mounted");
      const cards = root.locator("[data-lrc-card]");
      const cardCount = await cards.count();
      const activeBefore = await root.getAttribute("data-lrc-index");
      if (mounted !== "true") failures.push(`${route}:RUNTIME_NOT_MOUNTED`);
      if (cardCount < 2) failures.push(`${route}:INSUFFICIENT_SPATIAL_STATES`);
      await root.locator("[data-lrc-viewport]").focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(30);
      const activeAfter = await root.getAttribute("data-lrc-index");
      if (activeBefore === activeAfter) failures.push(`${route}:KEYBOARD_ONE_STEP_FAILED`);
      observations.push({ route, mounted, cardCount, activeBefore, activeAfter });
      await page.close();
    }
  } finally {
    await browser.close();
  }

  receipt.browserExecutionPerformed = true;
  receipt.observations = observations;
  receipt.failures = failures;
  receipt.finalQualificationClaimed = failures.length === 0;
  receipt.result = failures.length ? "FAIL_CLOSED" : "BROWSER_FINAL_PASS";
  emit(a.output, receipt);
  if (failures.length) process.exitCode = 2;
}

main().catch(error => {
  emit(null, {
    schema: "LAWS_DESTINATION_ROOM_CONJUGATION_BROWSER_PROOF_FAILURE_v1",
    result: "FAIL_CLOSED",
    error: error.message,
    finalQualificationClaimed: false
  });
  process.exitCode = 1;
});
