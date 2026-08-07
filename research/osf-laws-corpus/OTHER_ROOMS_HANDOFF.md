# OSF Laws Corpus — Other Rooms Handoff

Handoff ID: `OSF_PUBLIC_LAWS_DISCOVERY_CORPUS_OTHER_ROOMS_HANDOFF_v1`

Status: `READY_ON_ISOLATED_BRANCH`

Repository: `smansfield635-create/smansfield635-create.github.io`

Branch: `agent/osf-laws-corpus-harvest-001`

Pull request: `#461`

## What is available

The branch contains a harvested corpus of all 29 public resources returned for OSF profile `g5294` at the recorded harvest time. It includes project and registration metadata, public file inventories, machine-extracted text where supported, a ranked discovery index, a project-by-project Laws Chamber assessment, and a machine-readable placement ledger.

## Entry points

- `research/osf-laws-corpus/README.md` — ranked corpus index.
- `research/osf-laws-corpus/manifest.json` — complete machine-readable corpus manifest.
- `research/osf-laws-corpus/corpus.jsonl` — one normalized record per OSF resource.
- `research/osf-laws-corpus/LAWS_CHAMBER_VALUE_ASSESSMENT.md` — human-readable assessment of all 29 resources.
- `research/osf-laws-corpus/laws-chamber-assessment.json` — machine-readable dispositions and evidence status.
- `research/osf-laws-corpus/HARVEST_COMPLETION_RECEIPT.json` — final recovery counts and completion state.
- `research/osf-laws-corpus/projects/<OSF_ID>/metadata.json` — normalized project metadata and discovery classification.
- `research/osf-laws-corpus/projects/<OSF_ID>/files.json` — public file inventory with hashes and extraction status.
- `research/osf-laws-corpus/projects/<OSF_ID>/extracted-text.md` — machine-extracted source text where files were available.

## Final recovery state

- Public resources: `29`
- Public registrations: `1`
- Public components: `0`
- Resources with extractable files: `4`
- Extracted public PDFs: `10`
- Public datasets detected: `0`
- Public analytic-code files detected: `0`
- Harvest errors: `0`

The registration `7jnxq`, **Universal Law of Coherence Dynamics**, includes five recovered frozen PDFs covering diagnostic rules, methods, protocol, case selection/evidence windows, and observer replication.

## How another room should use the corpus

1. Start with `laws-chamber-assessment.json` to identify the resource disposition.
2. Open the corresponding `projects/<OSF_ID>/metadata.json` for the exact OSF description and provenance.
3. Inspect `files.json` to determine whether the source has actual public artifacts or is metadata-only.
4. Use `extracted-text.md` for discovery, then return to the identified OSF source file before relying on equations, tables, or exact wording.
5. Preserve the recorded evidence status. Do not convert a proposed test, author-reported pilot, or project description into an executed empirical result.

## Governing evidence boundary

`CORPUS_PRESENCE != VALIDATION`

`PUBLIC_DESCRIPTION != EXECUTED_STUDY`

`REGISTRATION = FROZEN_PROVENANCE, NOT TRUTH_CERTIFICATION`

`EXTRACTED_TEXT = DISCOVERY_AID, NOT SUBSTITUTE_FOR_SOURCE_LAYOUT`

`LAWS_CHAMBER_ADMISSION_REQUIRES_SEPARATE_REVIEW`

## Current availability boundary

The corpus is available on the isolated branch and through draft PR `#461`. It is not yet merged into `main`. Rooms operating only from `main` will not see it until merge authority is exercised.
