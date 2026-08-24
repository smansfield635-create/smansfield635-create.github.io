import { validateReadback } from "./readback-validator.mjs";
import { FRESHNESS } from "./freshness-classifier.mjs";
import { gitBlobSha } from "./package-validator.mjs";

export async function applyPlan({ plan, profile, packageFiles, repository, reconciliations = {}, benchmark }) {
  const startHead = await repository.readHead();
  if (startHead !== plan.repositoryHead) throw new Error("STALE_LIVE_HEAD_REQUIRES_REPLAN");

  const writes = [];
  for (const item of plan.pathClassifications) {
    if (item.classification === FRESHNESS.CURRENTLY_EQUALS_CANDIDATE) {
      writes.push(Object.freeze({ path: item.path, skipped: true, reason: item.classification }));
      continue;
    }

    let content = packageFiles[item.path];
    if (item.classification === FRESHNESS.CONFLICT_REQUIRING_BOUNDED_RECONCILIATION ||
        item.classification === FRESHNESS.CHANGED_SINCE_PACKAGE_PARENT) {
      content = reconciliations[item.path];
      if (typeof content !== "string") throw new Error(`RECONCILIATION_REQUIRED:${item.path}`);
    }

    const expectedBlob = gitBlobSha(content);
    const write = await repository.writePath({
      path: item.path,
      content,
      expectedCurrentBlob: item.currentBlob,
      message: `${profile.PROJECT_ID} ${profile.CHECKPOINT_ID}: apply ${item.path}`
    });
    const fetched = await repository.readPath(item.path);
    const readback = validateReadback({
      path: item.path,
      expectedBlob,
      returnedBlob: write.contentBlobSha,
      fetchedBlob: fetched?.blobSha
    });
    if (!readback.pass) {
      const error = new Error(`READBACK_FAILED:${item.path}`);
      error.readback = readback;
      error.writes = writes;
      throw error;
    }
    writes.push(Object.freeze({ path: item.path, skipped: false, commitSha: write.commitSha, readback }));
  }

  const finalHead = await repository.readHead();
  const benchmarkReceipt = benchmark ? await benchmark({ exactHead: finalHead, profile }) : null;
  if (benchmarkReceipt && benchmarkReceipt.pass !== true) {
    const error = new Error("BENCHMARK_FAILED_AFTER_APPLICATION");
    error.writes = writes;
    error.benchmarkReceipt = benchmarkReceipt;
    throw error;
  }

  return Object.freeze({
    instrument: "R&D_PACKAGE_RECONCILE_APPLY_VERIFY_v1",
    mode: "APPLICATION",
    pass: true,
    protocolId: profile.PROTOCOL_ID,
    checkpoint: profile.CHECKPOINT_SEMANTICS.APPLICATION,
    exactHeadVerificationCheckpoint: profile.CHECKPOINT_SEMANTICS.EXACT_HEAD_VERIFICATION,
    startHead,
    finalHead,
    writes: Object.freeze(writes),
    benchmarkReceipt,
    merged: false,
    deployed: false,
    physicalAcceptance: "NOT_STARTED"
  });
}
