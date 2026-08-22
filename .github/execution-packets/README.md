# Execution Packets

This directory contains machine-readable construction authority compiled after AI Entry admission.

## Lifecycle

- `active/` contains operations currently authorized for Direct Construction Mode.
- A packet is authoritative only while its admission remains valid and its governing-head continuity rule is satisfied.
- Terminal or superseded packets may be moved to `archive/` by the owning control-plane process.

Constructors should not reconstruct an operation from issues, docs, search results, or workflow history when an active packet exists. Read the packet, perform the bounded exact-source reads it permits, make the next required repository-visible mutation, and hand the resulting candidate to the declared qualification authority.

An active packet is not a success receipt. It is construction authority. Product/live success remains owned by the declared candidate and live qualification instrumentation.
