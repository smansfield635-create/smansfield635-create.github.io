# Auren Legacy Relationship Runtime Removal Audit

Status: **ACTIVE-CHAMBER REMOVAL PASS**
Date: 2026-10-02

## Removed from active Auren page/chamber

The page no longer loads:
- `products/auren/auren.relationship.js`
- `products/auren/auren.privacy-relationship.js`

The chamber no longer requires, reads, transitions, exposes or receipts:
- `AUREN_RELATIONSHIP`;
- `AUREN_PRIVACY_RELATIONSHIP_MAPPING`;
- relationship phase;
- relationship transition actions;
- privacy-to-relationship mapping.

Legacy `relationshipAction` metadata may still exist in the old voice corpus/options during the transitional corpus phase, but the chamber ignores it. It has no active relational effect.

## Privacy authority

`auren.privacy.js` remains active as reusable privacy/custody semantic authority.

Its receipt is retained.

The successor chamber separately records semantic boundary events through `AUREN_SESSION_CONTEXT`.

No privacy receipt is translated into PRY/RESPECT_BOUNDARY or any global phase.

## Return context

`auren.return-context.js` still accepts a legacy-named optional `relationshipRevision` receipt field. The chamber now supplies `null`.

That field is receipt compatibility only and does not require or consume the relationship engine.

Return validation remains otherwise unchanged.

## Legacy files

The obsolete relationship files remain repository-addressable for lineage/history but are no longer active dependencies of the Auren page.

Deletion is not required for behavioral supersession.

## Result

The active Auren chamber has no legacy relationship source-of-truth.

Remaining successor work is corpus/topology, archetype-observation reconciliation, privacy event refinement, return-thread continuity, anti-replay selection and final qualification.
