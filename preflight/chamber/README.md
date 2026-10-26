# Operations Chamber on the website

The original v20 interface (source e8a67c6db78577774d21133b72c2cf2ea21b6830) runs at `/preflight/chamber/`. Projects, instruments, system, evidence, briefings and agent reports load four same-origin JSON display feeds. No ChatGPT session, access token or backup import is required. The website and these display records are public; noindex is not access control. Private evidence links still require access at their original source.

## Update outside Work Mode

1. Open `preflight/chamber/data/` in this GitHub repository or an ordinary Git checkout.
2. Edit the relevant display file: `control-plane.json` (projects, operations and instrument observations), `study.json` (saved study), `briefings.json` (project progress and next steps), or `agents.json` (delivered reports). Preserve schema and original observation dates. Change an observation date only after checking its source. Do not add credentials, raw source files, browser drafts or private continuation instructions.
3. Validate with `node --test preflight/chamber/*test.mjs`. Update source-manifest hashes for changed display files. Follow `AI_ENTRYPOINT.json` and the existing review and exact-head Pages release process. A GitHub edit alone is not a completed deployment.
4. After publication, reload or press **Refresh published records**. The open page also checks every minute. All devices read the published files.

Refresh retrieves published snapshots; it does not trigger GitHub collectors or execute instruments. Original source timestamps and stale warnings are preserved. The existing GitHub collectors remain separate; automatic publication of new collector output is not introduced by this change. The original Site is retained as a historical source, not a runtime dependency. Historical report links may refer to it.

## Qualification

Run `node --test preflight/chamber/*test.mjs`, then `cd preflight/app && npm test && npm run check`. Verify all four `/preflight/chamber/data/*.json` URLs and the release marker after the registered Pages deployment. Source data include 49 project-source rows, five briefings, six instrument registry entries and nine delivered reports; project tiles combine aliases and briefing-only projects.

Operation: `OPERATIONS_CHAMBER_PUBLIC_DISPLAY_FEEDS_20261026_001`, admission generation 2901. Preserved source inputs were read through the existing Chamber connector. The non-rendered agent continuation object was excluded. The private control-plane workflow implementation locator is omitted; its public display name, observed run and status are retained. No underlying instrument execution, project completion, or new scientific result is claimed by publication.
