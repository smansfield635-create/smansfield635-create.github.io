# SOURCE_AUTHORITY_AND_INDEX_FRESHNESS_PROTOCOL_v1

## Purpose

This protocol prevents stale GitHub search indexing, stale documentation, stale workflow lookup surfaces, and moving-main races from being mistaken for current repository authority.

## Governing source law

For any current-state audit, mutation, qualification, or release decision:

`RESOLVE CURRENT MAIN SHA -> PIN THAT EXACT SHA -> READ REQUIRED FILES DIRECTLY AT THAT SHA -> ONLY THEN INTERPRET SEARCH/DOC/CI EVIDENCE`

GitHub code search is a discovery surface. It is not repository authority.

If a search result URL is bound to a commit other than the exact current governing SHA, the result is stale for current-state conclusions even when its file path and code snippet are otherwise correct.

## Evidence classes

1. `EXACT_REF_SOURCE_READBACK` — authoritative for repository bytes. A direct file/tree/commit read explicitly pinned to the resolved governing SHA.
2. `CURRENT_BRANCH_HEAD` — authoritative for identifying the governing SHA at the instant it is resolved.
3. `COMMIT/COMPARE EVIDENCE` — authoritative for ancestry/diff questions when both endpoints are explicit.
4. `CODE_SEARCH_INDEX` — discovery only. Never sufficient to establish absence, presence, or current implementation state.
5. `DOCUMENTATION` — historical/contract evidence unless independently confirmed against exact-ref source. Documents may intentionally describe a predecessor or unresolved boundary.
6. `WORKFLOW/RUN LOOKUP` — execution evidence only for the event classes and filters that lookup actually exposes. Empty results do not prove that no run exists unless the queried endpoint is exhaustive for the event class.
7. `PUBLIC RELEASE MARKER` — publication evidence only. It proves the served release SHA, not product behavior.
8. `LIVE RENDERED/INTERACTION EVIDENCE` — behavioral/presentation evidence. It does not establish repository provenance without an exact-SHA publication proof.

## Mandatory freshness check

Before using any search result for a current-state claim, compare the commit embedded in the result URL with the resolved governing SHA.

- equal -> snippet may be used as supporting evidence, but direct readback is still preferred for mutation/authority decisions;
- unequal -> mark `INDEX_STALE_FOR_CURRENT_HEAD` and re-read the exact file directly at the governing SHA;
- no embedded ref -> treat as unpinned and non-authoritative.

A stale search index is not a project stall and is not a reason to reopen architecture.

## Moving-main rule

A multi-file audit must use one pinned SHA for every source read in that audit. Do not read some files from default `main`, allow `main` to advance, and read later files from the new head while treating the set as one coherent snapshot.

If current `main` advances during the audit:

- complete the current snapshot against the pinned SHA;
- compare pinned SHA -> new main;
- if the cumulative change is disjoint from the audited dependency surface, differential continuity may carry the result forward;
- if overlapping, ambiguous, divergent, or incompletely declared, re-read affected files at the new exact head.

## Search-absence rule

`NO SEARCH RESULT` never means `FILE/CODE DOES NOT EXIST` for current-state authority.

Absence claims require direct exact-ref readback, directory/tree inspection, or an explicit compare proving removal.

## Documentation freshness rule

Documents that contain phrases such as `current main`, `current live head`, `next cycle`, or a literal SHA must be treated as timestamped records, not self-updating truth.

When documentation and exact-ref source disagree:

`EXACT_REF_SOURCE_READBACK` controls the current implementation state.

The documentation must then be classified as one of:

- valid historical record;
- still-valid contract with stale status prose;
- superseded implementation description;
- contradiction requiring documentation repair.

Do not rewrite historical evidence merely because it is old. Repair only prose that purports to describe current authority and is now false.

## Workflow lookup rule

A workflow lookup that filters by trigger type cannot be used to prove global non-existence of a run. For example, a PR-only commit-run lookup cannot establish that a push-triggered publication did not occur.

Before concluding `NO RUN`, establish that the lookup surface covers the relevant trigger/event class. Otherwise classify the result as `RUN_NOT_VISIBLE_THROUGH_THIS_LOOKUP`.

## Publication and behavior separation

The existing page-change protocol remains controlling:

`AUTHORITATIVE CHANGE -> SOURCE VERIFY -> MERGE -> AUTO-PUBLISH -> EXACT-SHA PROOF -> LIVE BEHAVIOR`

This protocol adds an earlier source-authority requirement:

`RESOLVE HEAD -> PIN SHA -> DIRECT READBACK`

Therefore the full default chain is:

`RESOLVE HEAD -> PIN SHA -> DIRECT AUTHORITY READBACK -> DIRECT CHANGE -> SOURCE VERIFY -> MERGE -> AUTO-PUBLISH -> EXACT-SHA PROOF -> LIVE BEHAVIOR`

## 2026-08-22 incident precedent

A Compass audit initially compared documentation with code-search snippets indexed at an older commit while `main` had already advanced. The search results were internally valid for their embedded commit but stale for current-state authority. Direct readback of current `main` showed that the renderer already contained the release transaction under discussion.

The correct classification was:

`PROJECT CONTEXT INTACT + SEARCH INDEX STALE + MIXED-SNAPSHOT COMPARISON`

not:

`PROJECT LOST CONTEXT` or `RESTART INVESTIGATION`.

## Completion rule for repository audits

A current-state repository audit may only be called complete when:

- governing SHA was resolved;
- all decision-critical source reads were pinned to that same SHA;
- search-index refs were checked for freshness;
- documentation/current-source contradictions were classified;
- workflow lookup limitations were accounted for;
- any main movement after the pinned snapshot was compared before carry-forward.

## Prohibited shortcuts

- treating code search as current source authority;
- treating no search hit as proof of absence;
- mixing files read from different moving `main` heads without declaring it;
- allowing a stale document's literal `current head` statement to override exact-ref source;
- treating a filtered workflow lookup as exhaustive;
- reopening cache/deployment/product architecture solely because two evidence surfaces were sampled from different repository moments.
