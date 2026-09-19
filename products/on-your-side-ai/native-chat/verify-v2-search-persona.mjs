#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../..");
const BASE = "a73573e26acef1ec81891f9500884eda90c7c53b";
const EXPECTED_JEEVES_BLOB = "ebfb51804946d0afbb3f2145029480f803bdd655";
const EXPECTED = [
  "products/on-your-side-ai/native-chat/index.js",
  "products/on-your-side-ai/native-chat/index.html",
  "products/on-your-side-ai/native-chat/runtime/search-client.v1.js",
  "products/on-your-side-ai/native-chat/runtime/persona-anchor.v1.js",
  "products/on-your-side-ai/native-chat/search-service/worker.js",
  "products/on-your-side-ai/native-chat/search-service/wrangler.toml",
  "products/on-your-side-ai/native-chat/verify-v2-search-persona.mjs"
].sort();

const checks = [];
const add = (id, pass, detail = null) =>
  checks.push({ id, pass: Boolean(pass), ...(detail === null ? {} : { detail }) });
const read = relative => fs.readFileSync(path.join(ROOT, relative), "utf8");
const git = args => spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
const includesAll = (text, values) => values.every(value => text.includes(value));

try {
  const diff = git(["diff", "--name-only", BASE + "..HEAD"]);
  const changed = diff.status === 0
    ? diff.stdout.trim().split(/\r?\n/).filter(Boolean).sort()
    : [];
  add(
    "EXACT_SEVEN_PATH_DIFF_ONLY",
    diff.status === 0 && JSON.stringify(changed) === JSON.stringify(EXPECTED),
    changed
  );

  const indexJs = read("products/on-your-side-ai/native-chat/index.js");
  const indexHtml = read("products/on-your-side-ai/native-chat/index.html");
  const searchClient = read("products/on-your-side-ai/native-chat/runtime/search-client.v1.js");
  const persona = read("products/on-your-side-ai/native-chat/runtime/persona-anchor.v1.js");
  const worker = read("products/on-your-side-ai/native-chat/search-service/worker.js");
  const wrangler = read("products/on-your-side-ai/native-chat/search-service/wrangler.toml");

  add("CURRENT_BASE_RUNTIME_IDENTITY_PROVEN", includesAll(indexJs, [
    "web-llm@0.2.85",
    "@wllama/wllama@3.6.0",
    "b26a58accf53b1a19fbc555d52fdb224bec473f5",
    "6eb923e7d26e9cea28811e1a8e852009b21242fb157b26149d3b188f3a8c8653"
  ]));
  add("WEBLLM_0_2_85_PRESERVED", indexJs.includes("web-llm@0.2.85"));
  add("INDEXEDDB_CACHE_PRESERVED", indexJs.includes('cacheBackend: "indexeddb"'));
  add(
    "WLLAMA_3_6_0_PRESERVED",
    indexJs.includes("@wllama/wllama@3.6.0") &&
      indexJs.includes("/wllama/3.6.0/wllama.wasm")
  );
  add(
    "CPU_MODEL_AND_PARAMETERS_PRESERVED",
    includesAll(indexJs, ["n_ctx: 2048", "n_threads: 1", "n_gpu_layers: 0"])
  );
  add("SAMPLING_AND_WATCHDOGS_PRESERVED", includesAll(indexJs, [
    "const RESPONSE_TEMPERATURE = 0.20;",
    "const RESPONSE_TOP_P = 0.9;",
    "const RESPONSE_MAX_TOKENS = 220;",
    "FIRST_INFERENCE_FIRST_CONTENT_WATCHDOG_MS = 90_000",
    "GENERATION_FIRST_CONTENT_WATCHDOG_MS = 40_000"
  ]));

  const jeeves = git(["rev-parse", "HEAD:assets/hearth/jeeves/jeeves.voice.js"]);
  add(
    "CANONICAL_JEEVES_VOICE_BLOB_UNCHANGED_AND_REFERENCED",
    jeeves.status === 0 &&
      jeeves.stdout.trim() === EXPECTED_JEEVES_BLOB &&
      persona.includes(EXPECTED_JEEVES_BLOB) &&
      persona.includes("/assets/hearth/jeeves/jeeves.voice.js") &&
      indexJs.includes(EXPECTED_JEEVES_BLOB)
  );

  add(
    "SEARCH_CLIENT_CURRENT_TURN_ONLY",
    searchClient.includes("deriveBoundedSearchQuery(currentTurn)") &&
      searchClient.includes("search(currentTurn)") &&
      !searchClient.includes("conversationContext") &&
      !searchClient.includes("messages")
  );
  add(
    "SEARCH_ENDPOINT_SAME_ORIGIN_API_INTEGRITY_SEARCH",
    searchClient.includes('DEFAULT_ENDPOINT = "/api/integrity-search"') &&
      searchClient.includes("new URL(endpoint, window.location.origin)") &&
      indexJs.includes('SEARCH_ENDPOINT = "/api/integrity-search"')
  );
  add(
    "BROWSER_CONTAINS_NO_PROVIDER_KEY_OR_SECRET",
    !indexJs.includes("BRAVE_SEARCH_API_KEY") &&
      !searchClient.includes("BRAVE_SEARCH_API_KEY") &&
      !persona.includes("BRAVE_SEARCH_API_KEY") &&
      !indexHtml.includes("BRAVE_SEARCH_API_KEY")
  );
  add(
    "SERVER_ADAPTER_REQUIRES_ENV_BRAVE_SEARCH_API_KEY",
    worker.includes("env?.BRAVE_SEARCH_API_KEY") &&
      worker.includes('"X-Subscription-Token": env.BRAVE_SEARCH_API_KEY') &&
      wrangler.includes("BRAVE_SEARCH_API_KEY") &&
      !/BRAVE_SEARCH_API_KEY\s*=\s*["'][^"']+/.test(wrangler)
  );
  add(
    "SERVER_ADAPTER_MAX_THREE_RESULTS",
    worker.includes("const MAX_RESULTS = 3;") &&
      worker.includes(".slice(0, MAX_RESULTS)")
  );
  add(
    "SEARCH_RETURNS_ACK_PACK_NOT_ANSWER",
    worker.includes('"DG_GENERAL_WEB_SEARCH_ACK_PACK_v1"') &&
      worker.includes('result: "EVIDENCE_RETURNED"') &&
      !worker.includes("answer:")
  );
  add(
    "SEARCH_FAILURE_HOLDS_CURRENT_FACT_REQUEST",
    indexJs.includes('evidenceAck.result !== "EVIDENCE_RETURNED"') &&
      indexJs.includes('diagnosticState.v2.responseKnowledgeClass = "UNRESOLVED"') &&
      indexJs.includes("staleModelFallbackUsed: false") &&
      persona.includes("I will not guess")
  );
  add(
    "EVIDENCE_INJECTED_ONLY_INTO_LOCAL_MODEL",
    indexJs.includes("searchClient.buildEvidenceContext(evidenceAck)") &&
      indexJs.includes("createBackendStream(requestMessages)")
  );
  add(
    "PERSONA_CANNOT_CHANGE_EVIDENCE_STANDING",
    persona.includes(
      "it may not change source facts, evidentiary standing, tool permissions, or claim ceilings"
    )
  );
  add(
    "SOURCE_LINKS_RENDER_DETERMINISTICALLY",
    indexJs.includes("function renderEvidenceSources") &&
      indexJs.includes('label.textContent = "Current sources"') &&
      indexJs.includes('link.rel = "noopener noreferrer"')
  );
  add("DIAGNOSTIC_SEARCH_AND_PERSONA_FIELDS_PRESENT", includesAll(indexJs, [
    "responseKnowledgeClass",
    "searchTriggered",
    "searchTriggerReason",
    "searchProviderId",
    "sourceCount",
    "provenanceFamilyCount",
    "contradictionCount",
    "ackPackStatus",
    "psalmPass2Disposition",
    "finalStanding",
    "personaId",
    "requestToSearchMs",
    "searchToEvidenceMs",
    "evidenceToFirstContentMs",
    "requestToCompletionMs"
  ]));
  add(
    "NO_PROMPT_OR_CONVERSATION_CONTENT_IN_DIAGNOSTIC",
    indexJs.includes('"No prompt or conversation content is included."') &&
      !indexJs.includes("Search query:") &&
      !indexJs.includes("Prompt:")
  );

  const jsBlob = git(["hash-object", "products/on-your-side-ai/native-chat/index.js"]);
  const runtime = jsBlob.status === 0 ? jsBlob.stdout.trim() : "";
  add(
    "HTML_RUNTIME_IDENTITY_EQUALS_FINAL_JS_BLOB",
    /^[0-9a-f]{40}$/.test(runtime) &&
      indexHtml.includes('data-native-chat-runtime="' + runtime + '"') &&
      indexHtml.includes("index.js?v=" + runtime)
  );
  add(
    "NO_EXTERNAL_DEPLOYMENT_OR_PUBLICATION_PERFORMED",
    wrangler.includes("Route/DNS deployment is a separate governed operation") &&
      !wrangler.includes("routes =") &&
      !wrangler.includes("[[routes]]")
  );

  const failed = checks.filter(check => !check.pass);
  const receipt = {
    schema: "AAI_NATIVE_CHAT_V2_SEARCH_PERSONA_RUNTIME_VERIFICATION_RECEIPT_v1",
    result: failed.length ? "FAIL_CLOSED" : "PASS_CLOSED",
    checks: checks.length,
    passed: checks.length - failed.length,
    failed: failed.length,
    base: BASE,
    changedPaths: changed,
    runtimeRelease: runtime,
    jeevesVoiceBlob: jeeves.status === 0 ? jeeves.stdout.trim() : null,
    externalDeploymentPerformed: false,
    mergePerformed: false,
    publicationPerformed: false,
    authorityEffect: "NONE",
    failures: failed
  };
  process.stdout.write(JSON.stringify(receipt, null, 2) + "\n");
  if (failed.length) process.exitCode = 1;
} catch (error) {
  process.stdout.write(JSON.stringify({
    schema: "AAI_NATIVE_CHAT_V2_SEARCH_PERSONA_RUNTIME_VERIFICATION_RECEIPT_v1",
    result: "FAIL_CLOSED",
    error: error.message,
    authorityEffect: "NONE"
  }, null, 2) + "\n");
  process.exitCode = 1;
}
