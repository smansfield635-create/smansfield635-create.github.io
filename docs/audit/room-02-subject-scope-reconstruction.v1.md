# Room 02 Subject / Scope Reconstruction — Surviving Evidence v1

Status: bounded repository reconstruction from surviving D05/D06v3/D07v2 artifacts, Room 01 custody references, and later universal-kernel/domain-realization boundaries. The original `ROOM_02_SUBJECT_AND_SCOPE` room/payload is not directly available. This record preserves only what is recoverable without inventing the lost ontology.

## Recovery classification

`RECOVERY_CLASS = RECONSTRUCTED_FROM_SURVIVING_REFERENCES`

`ORIGINAL_ROOM_02_BYTES = NOT_AVAILABLE`

`ORIGINAL_ROOM_02_COMPLETE_ONTOLOGY = NOT_RECOVERED`

`SURVIVING_SUBJECT_SCOPE_INVARIANTS = MATERIAL`

The reconstruction must remain distinguishable from an original Room 02 artifact.

## Direct surviving occurrences

The D05 source bundle carries:

- `subject = AUDRALIA_DIAGNOSTIC_AUTHORITY`

The D07 transport envelope carries:

- `subjectScope = AUDRALIA_DIAGNOSTIC_AUTHORITY`
- `temporalScope = CURRENT_PASS`
- `backendScope = ARCHITECTURE_NEUTRAL`

D07 separately carries:

- `sender = RECEIPT_SCHEMA_AUTHORITY`
- `recipient = SUCCESSOR_MASTER_SCHEMA_AUTHORITY`
- `routing.order = ORDER_07`
- `routing.stage = SCHEMA_ASSEMBLY`
- `routing.replyRequired = true`

Room 01 retained explicit custody references identifying `ROOM_02_SUBJECT_AND_SCOPE` as the authority reference for at least the D05 `subject` occurrence and the D07 `subjectScope` occurrence.

## Subject occurrence separation

The shared value `AUDRALIA_DIAGNOSTIC_AUTHORITY` does not collapse the two occurrences.

`D05.subject != D07.subjectScope`

They are distinct field occurrences connected by semantic correspondence. Equal literal value does not establish occurrence identity, custody transfer, or document identity.

Candidate repository relation:

`SUBJECT_TO_SUBJECT_SCOPE_SEMANTIC_PROJECTION`

Required properties:

- source and downstream occurrences remain distinct;
- semantic equality or correspondence is explicit;
- document ownership/custody is not transferred by value equality;
- downstream scope must not silently broaden the source subject.

## Dimensional scope separation

The surviving D07 evidence supports independent scope dimensions:

`SEMANTIC_SUBJECT`

`TEMPORAL_APPLICABILITY`

`BACKEND_APPLICABILITY`

`SENDER_AUTHORITY`

`RECIPIENT_AUTHORITY`

`ROUTING_ORDER`

`ROUTING_STAGE`

`RESPONSE_OBLIGATION`

Candidate universal object:

`SUBJECT_SCOPE_DIMENSIONAL_SEPARATION_AND_EXPLICIT_BINDING`

Candidate invariant:

`SUBJECT != TEMPORAL_SCOPE != BACKEND_SCOPE != SENDER != RECIPIENT != ROUTING_STAGE != RESPONSE_OBLIGATION`

No dimension may be inferred solely from another dimension. A correct subject does not prove correct temporal scope. A correct temporal scope does not prove backend applicability. Sender identity does not define subject identity. Recipient identity does not define routing stage. Reply requirement does not establish authority or readiness.

## Current Audralia instantiation

For the retained D07 current-pass envelope:

- semantic subject: `AUDRALIA_DIAGNOSTIC_AUTHORITY`
- temporal applicability: `CURRENT_PASS`
- backend applicability: `ARCHITECTURE_NEUTRAL`
- sender authority: `RECEIPT_SCHEMA_AUTHORITY`
- recipient authority: `SUCCESSOR_MASTER_SCHEMA_AUTHORITY`
- routing order: `ORDER_07`
- routing stage: `SCHEMA_ASSEMBLY`
- response obligation: `replyRequired = true`

These are historical/current-pass instantiation values, not universal constants.

## Subject identity is not operational-state identity

The surviving family also supports these negative laws:

- subject identity does not establish source validity;
- subject identity does not establish correspondence validity;
- subject identity does not establish publication confirmation;
- subject identity does not establish readiness;
- subject identity does not establish release;
- subject identity does not establish runtime connection;
- subject identity does not establish empirical validity.

This follows the repository-wide noncollapse architecture: identity/scope, evidence state, authority state, execution state, and empirical state are separate dimensions unless an explicit governing relation connects them.

## Relationship to the universal diagnostic kernel

The later foundational universal diagnostic kernel introduces domain realization through:

`M_d(X_t, theta_d) -> (B256_d, P192_d, E_d, I_d, V_d, Q_d)`

This later kernel/profile architecture must not be retroactively attributed to lost Room 02 unless direct evidence is recovered.

What can safely be retained is the compatibility rule:

- Room 02's surviving subject/scope function identifies what a diagnostic artifact is about and where/when it applies;
- domain realization profiles define how domain evidence is mapped into kernel variables;
- subject/scope identity and variable measurement semantics are related but not interchangeable.

Candidate invariant:

`SUBJECT_SCOPE_IDENTITY != DOMAIN_MEASUREMENT_REALIZATION`

A domain profile must explicitly bind its subject and applicability rather than treating the mathematical kernel alone as sufficient scope definition.

## Three-corpus treatment

### Legacy Evidence Corpus

Contains:

- the fact that Room 02 existed as `ROOM_02_SUBJECT_AND_SCOPE`;
- surviving Room 01 custody references;
- D05/D07 subject and scope occurrences;
- the unresolved absence of the original Room 02 packet/bytes and complete ontology.

### Governing Invariant and Transition Corpus

Contains the recoverable rules:

- subject and subjectScope occurrences remain distinct;
- subject, temporal scope, backend scope, sender, recipient, routing, and response obligation are independent dimensions;
- scope dimensions require explicit binding and may not be inferred from each other;
- subject/scope identity does not substitute for evidence, readiness, release, runtime, or empirical validity;
- subject/scope identity is distinct from domain measurement realization.

### Replacement Target Corpus

Future subject/scope schemas, registries, profile bindings, fixtures, and execution evidence must be new target artifacts with explicit lineage. They must not be labeled as recovered Room 02 originals unless original physical evidence is actually recovered.

## Historical gap treatment

The missing complete Room 02 ontology is retained as a historical evidence gap, but it is not automatically a project-wide blocker.

A blocking claim requires an exact replacement surface that cannot be specified or validated without a missing Room 02 definition.

The current surviving evidence is sufficient to preserve the known Audralia subject and its independent scope dimensions. It is not sufficient to reconstruct hypothetical additional subjects, subject taxonomy, or original diagnostic-variable definitions.

## Explicitly unrecovered material

The following remain unknown unless new evidence is found:

- the complete original Room 02 subject ontology;
- whether Room 02 defined multiple subject classes beyond `AUDRALIA_DIAGNOSTIC_AUTHORITY`;
- the original formal definition of `subject` versus `subjectScope`, beyond the surviving occurrence relationship;
- any original Room 02 taxonomy for temporal scopes beyond `CURRENT_PASS`;
- any original Room 02 taxonomy for backend scopes beyond `ARCHITECTURE_NEUTRAL`;
- any original variable-level semantics that may once have been assigned to Room 02;
- original Room 02 bytes, hashes, packet identity details, fixtures, or validator results not preserved elsewhere.

These gaps must not be filled by inference.

## Mining disposition

`ROOM_02_DIRECT_RECOVERY = UNAVAILABLE`

`ROOM_02_SURVIVING_SUBJECT_SCOPE_INVARIANTS = MATERIAL_RECONSTRUCTION_COMPLETE_FOR_CURRENT_AUDIT`

`ROOM_02_COMPLETE_HISTORICAL_ONTOLOGY = UNRECOVERED`

`ROOM_02_GENERALIZED_HOLD = NOT_AUTHORIZED`

`ROOM_02_FUTURE_MINING = EVIDENCE_TRIGGERED_ONLY`

The current audit no longer requires an open-ended search for Room 02. Further recovery is justified only if a newly found artifact contains direct Room 02 material or a concrete replacement target depends on an unrecovered definition.

## Claim ceiling

This record does not claim to recreate Room 02, restore its complete ontology, establish original authorship/bytes, define diagnostic variables, validate domain mappings, authorize construction, establish implementation conformance, prove empirical validity, or authorize release.

It establishes only the surviving subject/scope separation and binding rules supported by the retained artifact family and custody references.