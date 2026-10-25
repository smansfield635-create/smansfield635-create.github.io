# DiamondGate workspace — owner maintenance

This is the original working DiamondGate application, migrated from Site source commit `f4ebed5b746a13dcae2bf5262d5c7b0512ccf335`. It is distinct from the earlier memory-only progression experiment at `../saas-lab/`.

Application address: https://diamondgatebridge.com/preflight/app/

## Your projects

On the original Site, open each saved project and choose **Project record, evidence & history → Download project backup**. On this website choose **Restore a backup** and select that file. Confirm the project, history and next action before retiring the old copy. Backups include unfinished returned-response drafts. Keep downloaded backups separately; referenced attachments are not embedded.

Different domains have separate browser storage. Projects cannot transfer automatically. They remain browser-local on this device, without an account or cloud synchronization. No Work Mode session is required to use this application. Browser data can still be cleared; download backups regularly. Application hosting is public and unlisted; project text is not included in the repository or sent to an AI service by this app.

## Edit without Work Mode

The durable source is in your GitHub repository, not a chat workspace:

https://github.com/smansfield635-create/smansfield635-create.github.io/tree/main/preflight/app

From a phone or tablet, sign into GitHub and use its file editor or github.dev to create a branch and edit files. For multi-file work and running Node tests, open the repository in an available development environment such as your computer or an already configured Codespace. Any assistant with access to this repository can continue through the root `AI_ENTRYPOINT.json` and `AGENTS.md`; no Sites credential is required.

1. Edit `dist/` for the application. JavaScript module imports stay relative. Keep project storage and backup formats compatible.
2. With Node.js installed, run from this directory:

   ```sh
   npm run build
   npm test
   npm run check
   ```

   No package installation or framework is needed. `build.mjs` generates `index.html` from `dist/index.html`, adapting only asset/home paths and adding an unlisted-search directive. Commit both source edits and the generated entry. The retained dist HTML is a provenance source, not the public entry URL.

3. Open a pull request. Follow the repository AI entry point for runtime changes, review the candidate and qualify the changed behavior. Keep the public verification manifest at `.github/ai-router/publication-surfaces/preflight.v1.json` aligned with the actual workspace.
4. After approval and merge, copy the full current `main` commit SHA.
5. In GitHub **Actions → Exact Head Pages Deploy v3 → Run workflow**, choose `main`, enter that SHA as `target_sha`, and `preflight.v1` as `surface_id`.

   Direct workflow page: https://github.com/smansfield635-create/smansfield635-create.github.io/actions/workflows/pages-exact-head-deploy-v3.yml

6. Wait for successful preflight, deployment and live verification. If `main` moved, use its new exact SHA after checking the intervening changes. A merged PR alone does not update the website.
7. Open the application and inspect https://diamondgatebridge.com/.well-known/dgb-release.json for the release identity. Preserve failed-check details instead of repeatedly rerunning an unchanged failure.

GitHub account access, repository permissions and GitHub Actions availability remain necessary. These are independent of ChatGPT Work Mode. The existing registered workflow performs publication; this migration adds no alternative deployment service or secret.

## Tests and source custody

`source-manifest.json` binds the initially migrated runtime bytes to the original source. The migration test detects unintended migration drift and checks subpath dependencies and backup round trips. For deliberate later runtime edits, review the change and update the corresponding manifest hashes with explicit provenance; a hash update does not itself qualify behavior.

The copied regression tests use synthetic records. Private instruments, owner project records, Site credentials, audit archives and QA-only assets were excluded. The live application remains a local project and continuation tool; it does not execute AI calls, edit GitHub, or authenticate imported claims.

Admission: generation 2887, operation `DIAMONDGATE_WORKING_APP_WEBSITE_MIGRATION_20261025_001`, https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6787#issuecomment-6400828261.


## Full-cycle matrix repair (generation 2889)

The application now derives result-review availability from the same workflow decision used for continuation. Saving a checkpoint is recordkeeping; it does not mean the result passed or that an external action is authorized. A specific next action can progress to execution under established permission. Missing information must identify what could change that action. Results then need matching checks; failures lead to correction. Human acceptance appears only for a current result that requires it. All tracked criteria must be satisfied before closing the project.

“Need more evidence” preserves the feedback and returns a verification task. Changed prerequisite results invalidate downstream checks. Historical structured checkpoints are read-only because restoring their text alone would mix older context with newer evidence; full project backups remain portable.

See [audit-matrix.md](audit-matrix.md) for coverage and limits. `workflow-matrix-test.mjs`, `evidence-matrix-test.mjs`, and `matrix-test.mjs` supplement the original suite. Hashes in `source-manifest.json` bind the current runtime; `originalSha256` retains migration provenance for changed files. Updating hashes is never a substitute for passing behavioral tests.
