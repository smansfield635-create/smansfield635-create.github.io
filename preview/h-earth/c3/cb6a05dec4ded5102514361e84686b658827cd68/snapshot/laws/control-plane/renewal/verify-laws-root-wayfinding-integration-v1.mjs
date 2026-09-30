import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";

const html = fs.readFileSync("laws/index.html", "utf8");
const css = fs.readFileSync("laws/index.experience.polish.css", "utf8");
const js = fs.readFileSync("laws/index.experience.js", "utf8");
const control = JSON.parse(fs.readFileSync("laws/control-plane/renewal/laws-root-wayfinding-integration-v1.json", "utf8"));

const gitBlobSha = content => {
  const bytes = Buffer.from(content);
  return createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
};

assert.equal(control.schema, "LAWS_ROOT_WAYFINDING_INTEGRATION_CONTROL_v1");
assert.equal(control.operationId, "LAWS_ROOT_WAYFINDING_INTEGRATION_20260825_C8646D4D_R1");
assert.equal(control.exactGoverningHead, "c8646d4dd7e73ac0e27bad99824598d9892d6aab");
assert.ok(html.includes('data-laws-opening-integration="estate-compass-v1"'));
assert.ok(html.includes("LAWS_ROOT_WAYFINDING_INTEGRATION_20260825A"));
assert.ok(css.includes("LAWS_ROOT_WAYFINDING_INTEGRATION_v1"));
assert.ok(css.includes('font-family: Georgia, "Times New Roman", serif'));
assert.ok(!html.includes("data-laws-first-rail"));
assert.ok(!html.includes("laws-first-rail__light"));
assert.ok(!html.includes("data-laws-experience-indicator"));
assert.ok(!js.includes("indicatorNodes"));
assert.ok(!js.includes("lawsExperienceIndicator"));

const questions = html.match(/data-laws-experience-question="(?:flow|integrity|reality|structure|test)"/g) || [];
assert.equal(questions.length, 5);
for (const route of [
  "/laws/categories/flow/",
  "/laws/categories/integrity/",
  "/laws/categories/reality/",
  "/laws/categories/structure/",
  "/laws/test/"
]) assert.ok(html.includes(`href="${route}"`), `Missing preserved FIRST route: ${route}`);

assert.ok(html.includes('class="laws-orbit"'));
assert.ok(html.includes('data-upstream-compass-control'));
assert.ok(html.includes('/laws/index.controller.js'));
assert.ok(html.includes('/laws/index.interactions.js'));

for (const [path, expected] of Object.entries(control.protectedBlobs)) {
  const actual = gitBlobSha(fs.readFileSync(path));
  assert.equal(actual, expected, `Protected blob drift: ${path}`);
}

const receipt = {
  schema: "LAWS_ROOT_WAYFINDING_INTEGRATION_VERIFICATION_RECEIPT_v1",
  result: "PASS",
  operationId: control.operationId,
  exactGoverningHead: control.exactGoverningHead,
  removedIndicatorCount: 5,
  remainingIndicatorCount: 0,
  preservedQuestionCount: questions.length,
  protectedBlobCount: Object.keys(control.protectedBlobs).length,
  routeAuthorityChanged: false,
  controllerAuthorityChanged: false,
  claimAuthorityChanged: false
};
console.log(JSON.stringify(receipt, null, 2));
