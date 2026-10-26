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

Refresh retrieves published snapshots; it does not trigger GitHub collectors or execute instruments. Original source timestamps and stale warnings are preserved. The existing GitHub collectors remain separate; automatic publication of new collector output is not introduced by this change. The original Site is retained as a historical source, not a runtime dependency. Historical report links may refer to it.

## Qualification

Run `node --test preflight/chamber/*test.mjs`. Run `cd preflight/app && npm test && npm run check` when that shared application or its direct behavior changes. Verify all four `/preflight/chamber/data/*.json` URLs and the release marker after the registered Pages deployment. The migration baseline contained 49 project-source rows, five briefings, six instrument registry entries and nine delivered reports; these are historical counts, not permanent acceptance limits. Project tiles combine declared aliases and briefing-only projects.

Operation: `OPERATIONS_CHAMBER_PUBLIC_DISPLAY_FEEDS_20261026_001`, admission generation 2901. Preserved source inputs were read through the existing Chamber connector. The non-rendered agent continuation object was excluded. The private control-plane workflow implementation locator is omitted; its public display name, observed run and status are retained. No underlying instrument execution, project completion, or new scientific result is claimed by publication.
