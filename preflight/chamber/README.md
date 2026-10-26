# Operations Chamber on the website

The original v20 interface (source e8a67c6db78577774d21133b72c2cf2ea21b6830) runs at `/preflight/chamber/`. Projects, instruments, system, evidence, briefings and agent reports load four same-origin JSON display feeds. No ChatGPT session, access token or backup import is required. The website and these display records are public; noindex is not access control. Private evidence links still require access at their original source.

## Event-driven updates outside Work Mode

The GitHub display records are the cross-room handoff index. Read them at an exact repository commit, then reconcile the affected project against its current source before acting. Update a briefing after a meaningful verified change in accomplishment, publication, blocker or next action. A new commit can be evidence, but so can a deployment result, issue decision, qualification result or dependency change. Elapsed time and pressing Refresh do not establish a project change. The ChatGPT Site and Chamber connector are not required to read, prepare, publish or verify an update.

1. Open `preflight/chamber/data/` in this GitHub repository or an ordinary Git checkout.
2. Preserve verified evidence in the project's authorized GitHub continuation. Edit only the relevant display file: `control-plane.json` (projects, operations and instrument observations), `study.json` (saved study), `briefings.json` (project progress and next steps), or `agents.json` (delivered reports). Preserve unrelated records, schema and original observation dates. Change an observation date only after checking its source. Do not add credentials, raw source files, browser drafts or private continuation instructions. Private evidence remains at its authorized source; only an approved non-secret display summary belongs here. Private agent-report delivery does not automatically publish `agents.json`.
3. Validate with `node --test preflight/chamber/*test.mjs`. Update source-manifest hashes for changed display files. Follow `AI_ENTRYPOINT.json` and the existing review and exact-head Pages release process. A GitHub edit alone is not a completed deployment.
4. After publication, reload or press **Refresh published records**. The open page also checks every minute. All devices read the published files.

For a briefing, prepare one complete reviewed record with its existing `projectId`, genuine UTC `observedAt`, exact `sourceHeads`, all five facts and instruments. Each established fact needs credential-free GitHub evidence links and its proper proof basis. A proposed next step never grants execution authority. Use the existing repository intake before governed edits, then prepare a separate candidate:

```sh
node preflight/chamber/update-briefings.mjs --input /tmp/reviewed-record.json --output /tmp/candidate-briefings.json
```

This local command performs no network requests or repository writes. It validates display fields, evidence URL shape, exact source-head shape, dates and unique identities; rejects older observations; and preserves other project records. It cannot verify the truth of a claim or whether a GitHub source actually exists: source review remains mandatory. An unchanged record is a no-op. The feed's `updatedAt` is preparation time, distinct from each record's source observation. `--allow-new` is required only after explicitly reconciling a new project identity; it does not infer aliases. `--base` accepts a separately pinned feed for review.

Review the candidate diff, copy it into `data/briefings.json`, update its SHA-256 entry in `source-manifest.json`, and run the Chamber tests. Include any changed runtime hashes as well. Before merge, compare against the current branch and main so concurrent records cannot be overwritten. Use the existing exact-head Pages release, verify its successful run and live release marker, and compare all four live feed payloads with the released commit. Keep merge, deployment and live verification as separate evidence. If publication fails, preserve the GitHub continuation and report display synchronization as unverified.

The 30-minute presentation guard requests reconciliation before executing a recorded next step. It does not invalidate historical accomplishments or prove that a project changed.

Refresh retrieves published snapshots; it does not trigger GitHub collectors or execute instruments. Original source timestamps are preserved. The control-plane capture shows **Last checked** and the study shows **Study evidence through**, in Central time. Age alone does not mark either record stale or trigger a warning. Refresh failures remain warnings and retain the last valid record; invalid schemas and future timestamps are rejected. Project execution-reconciliation safeguards remain unchanged. The website does not infer unpublished evidence from elapsed time or claim to discover private updates independently. The existing GitHub collectors remain separate; automatic publication of new collector output is not introduced by this change. The original Site is retained as a historical source, not a runtime dependency. Historical report links may refer to it.

## Qualification

Run `node --test preflight/chamber/*test.mjs`. Run `cd preflight/app && npm test && npm run check` when that shared application or its direct behavior changes. Verify all four `/preflight/chamber/data/*.json` URLs and the release marker after the registered Pages deployment. The migration baseline contained 49 project-source rows, five briefings, six instrument registry entries and nine delivered reports; these are historical counts, not permanent acceptance limits. Project tiles combine declared aliases and briefing-only projects.

Operation: `OPERATIONS_CHAMBER_PUBLIC_DISPLAY_FEEDS_20261026_001`, admission generation 2901. Preserved source inputs were read through the existing Chamber connector. The non-rendered agent continuation object was excluded. The private control-plane workflow implementation locator is omitted; its public display name, observed run and status are retained. No underlying instrument execution, project completion, or new scientific result is claimed by publication.

## Source reconciliation prepared October 26, 2026

The GitHub collector run [40359013242](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40359013242) and independent private readback succeeded. The prepared study contains 1,871 merged PRs through `2026-10-26T16:26:11Z`, with 390 source reviews, 47 corrections and five audit flags preserved. Its `capturedAt` records independent verification; `hostedStoredAt` records preparation of this display file and is not proof of deployment.

The separate control-plane capture was read at `2026-10-26T15:42:07.333Z` and remains a bounded, non-atomic activity window. Its six instrument observations retain `2026-10-17T07:05:23.245Z`; each instrument’s evidence coverage explicitly marks that it was not revalidated. Run and lifecycle records remain unchanged. Other project briefings and agent reports are preserved.

`data/reconciliation-receipt.json` records these component dates, limits and feed hashes. Its `PREPARED_NOT_PUBLISHED` disposition is the historical preparation state. Subsequent deployment and live verification belong in the GitHub release continuation; do not relabel source dates as publication dates. Existing exact-head Pages release and four-feed live readback are still required. No automatic collector-output publication is introduced.

## Confirmed unpublished evidence

A source reviewer may attach `confirmedNewerEvidence` to an existing control-plane or study display record after independently verifying newer evidence that is not represented in that record. This is an optional display annotation, not a collector or authority source. It must contain `status: "CONFIRMED_NOT_PUBLISHED"`, `publishedThrough` exactly matching that record’s `observedAt` (control plane) or `rollingStudy.through` (study), a strictly later `evidenceThrough`, a `verifiedAt` at or after that evidence time, and a credential-free HTTPS GitHub `sourceUrl`. Times must be valid and not in the future beyond the existing 30-second allowance. An absent, mismatched or invalid annotation never creates a warning. An update-failure warning takes precedence; source dates remain visible.

Publish an independently reviewed annotation through the existing display-update process only when such evidence exists; remove it or re-evaluate it when publishing the newer record. No annotation is asserted by this warning repair. The website cannot detect unpublished private evidence by itself, and age does not substitute for that missing information.
