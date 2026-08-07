# Methods Spatial Database — Checkpoint 4

Status: `NONPUBLIC_USER_TEST_CANDIDATE`

This directory is the exact nineteen-path first-delivery construction for the
Pressure & Capacity lane. It is a text-first proof: semantic HTML is primary,
information records are visible tabs, Practical opens by default, and only one
Practical, Engineering, or Evidence lens is active at a time.

## Construction identity

- Base main: `e876e6107d3e01a19e76c9fd487b6de0d511cb25`
- Base tree: `9c1fa274cdf53afcbb26a7c84a5dc55fc8f7ca51`
- Construction branch: `construction/methods-spatial-database-checkpoint4-text-first-v2-001`
- Registered path count: `19`
- Lane: `pressure-and-capacity`
- Records: `pressure-field`, `capacity-field`, `pcr`
- Public route: none
- Merge authority: none
- Deployment authority: none
- Acceptance claim: none

## Interaction contract

The visitor selects one visible record tab, reads the Practical lens by default,
may switch to Engineering or Evidence, and may open one nested subtab. The
capacity record stages `K = P × R × A × C`; a selected term advances while peer
terms recede without disappearing. Escape or the explicit return control restores
the prior record, lens, subtab, scroll position, and focus target.

## Verification

Run:

```text
node verify.v1.mjs --role builder --output /tmp/builder.json
node verify.v1.mjs --role fresh-verifier --output /tmp/fresh-verifier.json
node verify.v1.mjs --compare /tmp/builder.json /tmp/fresh-verifier.json --output /tmp/equality.json
```

The workflow runs the builder and fresh verifier in separate jobs and fails unless
their normalized construction fingerprints are exactly equal.
