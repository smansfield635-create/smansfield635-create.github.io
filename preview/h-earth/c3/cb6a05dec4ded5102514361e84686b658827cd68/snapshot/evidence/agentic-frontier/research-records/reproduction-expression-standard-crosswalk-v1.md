# Research Frontier reproduction expression-standard crosswalk v1

Status: `DOCUMENTATION_CONTRACT_CANDIDATE`

Purpose: define one continuous public reproduction standard for all seven Research Frontier objects without altering scientific standing, claim ceilings, evidence status, or proprietary implementation boundaries.

Governing public head at construction: `62e1c92d2f76b5ec87abaac4daf9c83718f31424`.

Primary semantic authority: `publication-crosswalk-v3.md`, blob `6f423c15b28e8e5a4a748d4a539618457ebbec76`.

This document is a packaging and presentation crosswalk only. It does not claim that unaffiliated reproduction has occurred, does not upgrade any experiment to externally replicated, and does not require public disclosure of proprietary Diamond Gate Bridge implementation details.

---

## 1. Governing continuity law

Every reproduction surface must preserve this chain:

`PUBLIC RESEARCH OBJECT -> HUMAN REPRODUCTION PAGE -> MACHINE-READABLE MANIFEST -> EXACT SOURCE / EVIDENCE OBJECTS -> VERIFIER OR ACCEPTANCE RULE -> CLAIM CEILING`

The human expression and the machine standard are two views of the same bounded object.

`HUMAN_EXPRESSION <= MACHINE_STANDARD <= CANONICAL_CLAIM_CEILING`

`MACHINE_MANIFEST != SCIENTIFIC_EVIDENCE`

`RECORD_VERIFICATION != EXPERIMENTAL_REPRODUCTION`

`REPRODUCTION_READY != EXTERNALLY_REPRODUCED`

`REPRODUCIBILITY != REPLICATION`

`INTERNAL_REPLICATION != UNAFFILIATED_EXTERNAL_REPLICATION`

`MISSING_ARTIFACT => DECLARE_GAP; DO_NOT SUBSTITUTE`

`PROPRIETARY_IMPLEMENTATION != REQUIRED_DISCLOSURE` when an unaffiliated researcher can independently test the proposition from a sufficient public specification, public inputs or lawful dataset locators, deterministic acceptance criteria, and a neutral verifier.

A reproduction page may simplify language, but it may not simplify away a scientific boundary.

---

## 2. Standard public reproduction page

Each of the seven objects should expose one consistent action from its Evidence side:

**Reproduce / Inspect Sources**

That action should open a dedicated technical page. The page does not need cinematic treatment. It should be directly readable by a researcher and directly parseable by a machine.

Required human-readable sections:

1. **Question tested** — the exact bounded proposition.
2. **Scientific/operational standing** — current evidence class and source-native disposition.
3. **Inputs** — datasets, fixtures, frozen states, task sets, or formal model definitions.
4. **Comparator / baseline** — what the result was compared against, including unresolved comparator health where applicable.
5. **Procedure** — enough detail to independently implement or rerun the bounded test.
6. **Expected outputs** — metrics, dispositions, hashes, or formal outcomes expected from the preserved record.
7. **Verification** — verifier, recomputation rule, or independent acceptance criteria.
8. **Known gaps** — missing bytes, unavailable artifacts, unresolved dependencies, or non-public dependencies.
9. **What successful reproduction would establish** — no larger than the canonical claim ceiling.
10. **What it would not establish** — universal, causal, cross-domain, priority, or external-validation boundaries as applicable.
11. **Exact sources** — canonical repository records, issues, hashes, dataset locators, and version identities.
12. **Proprietary boundary** — what is intentionally not required to reproduce the proposition.

Required machine-readable companion fields:

```text
schema
objectId
publicTitle
technicalBinding
evidenceStatus
sourceDispositions
question
inputs
inputLicensingOrLocator
comparator
procedure
environment
expectedOutputs
acceptanceCriteria
verifier
sourceIdentities
knownGaps
proprietaryBoundary
claimCeiling
reproductionPackagingState
externalReproductionObserved
```

The machine manifest must not contain a stronger statement than the human page or the governing research record.

---

## 3. Packaging-state vocabulary

These labels describe packaging only. They are not scientific evidence classes.

- `RECORD_BOUND` — canonical public result/method sources are identified, but no complete reproduction package is claimed.
- `RECORD_VERIFY_READY` — public machine-readable result records and a verifier can validate the preserved record.
- `INDEPENDENT_TEST_SPEC_READY` — a public specification is sufficient for an unaffiliated party to implement a fresh test of the proposition without private conversational memory.
- `TURNKEY_RERUN_READY` — public instructions, lawful inputs or locators, environment/configuration, executable procedure, expected outputs, and verifier are assembled for a direct rerun.
- `EXTERNAL_REPRODUCTION_OBSERVED` — an unaffiliated reproduction has actually been completed and evidenced.

No object may receive `EXTERNAL_REPRODUCTION_OBSERVED` merely because Diamond Gate internally reran or replicated it.

---

# 4. Seven-object crosswalk

## RFV3-01 — Same State. Different Future.

**Technical binding:** `RELATIONAL_TRANSITION_GEOMETRY + LVTG/LVM lineage`, with C-MAPSS predictive evidence kept separate from RTG mechanism evidence.

**Human expression:**

- Question: can present state look the same while the structure of remaining transitions carries additional predictive or causal information?
- Visible separation must remain explicit:
  - `C-MAPSS = PREDICTIVE SIGNAL`
  - `RTG = MECHANISM SUPPORTED`
  - `RTG = MECHANISM REPLICATED`
- The page must explain that prediction, controlled mechanism, and independent-system replication answer different questions and do not pool.

**Machine/reproduction standard:**

- bind the exact C-MAPSS experiment contract independently from RTG;
- identify the lawful C-MAPSS dataset source/version and frozen split/attack definition;
- expose the exact predictor/baseline comparison and metric computation needed to test the bounded predictive claim;
- for RTG, specify exact-present-state/equal-resource twin construction, state-selection rules, intervention definition, `D_i = sign(Delta_PROBE_i) * Delta_CHALLENGE_i`, and `T = mean_i(D_i)`;
- identify the independent replication system `pglib_opf_case60_c` and the expected bounded replication metrics;
- expose recomputation/acceptance rules without requiring disclosure of unrelated Diamond Gate control-plane internals.

**Current packaging state:** `RECORD_BOUND` with strong internal replication evidence; not `TURNKEY_RERUN_READY` for the complete historical chain.

**Known continuity gap:** the governing record preserves a custody failure involving incomplete original raw-cell custody and unavailable original selected-state-ledger bytes. A reproduction page must state this rather than reconstructing missing historical bytes.

**Target packaging delta:** create a clean successor reproduction capsule that uses preserved method definitions plus freshly frozen, fully custodial inputs/selected-state ledger for independent testing.

**Proprietary exposure required:** no, provided the public specification fully defines the experimental intervention, selection logic, metrics, lawful inputs, and acceptance rules.

**Claim ceiling preserved:** bounded predictive utility for C-MAPSS and bounded controlled relational effect plus independent-system replication for RTG under frozen model semantics; no universal law or cross-domain generality.

---

## RFV3-02 — What Has to Be True First?

**Technical binding:** `STRUCTURAL_ADMISSIBILITY_SCIENCE`.

**Human expression:**

- Question: are some conditions gates that must be satisfied before ranking, optimization, or interpretation is allowed to begin?
- The null result must remain visible: the corrective physical heldout did not distinguish SAS from the strongest comparator because both had zero false admissions.

**Machine/reproduction standard:**

- publish the formal admissibility definition and noncompensatory decision rule;
- identify Net6, Net3, Anytown, and any other exact input fixtures used in the bounded diagnostic inventory;
- identify the strongest comparator and the false-admission calculation;
- expose the heldout procedure and deterministic adjudication rule;
- preserve `NOT_DISTINGUISHED` as an expected admissible outcome rather than treating a null as a failed package;
- prohibit importing the separate positive C-MAPSS predictive result as SAS evidence.

**Current packaging state:** `RECORD_BOUND`.

**Target packaging delta:** assemble the formal definition, frozen fixtures or lawful locators, comparator specification, heldout procedure, expected null/disagreement outputs, and verifier into one capsule.

**Proprietary exposure required:** no, if the admissibility rule, test fixtures, comparator, and adjudication procedure are public.

**Claim ceiling preserved:** formalized noncompensatory admissibility object plus bounded diagnosis only; no universal admissibility law or cross-domain empirical superiority.

---

## RFV3-03 — When Structure Holds—or Breaks

**Technical binding:** `COHERENCE_GEOMETRY`.

**Human expression:**

- Question: can individually strong parts fail to produce a coherent whole when required relationships or orientation fail?
- Formal proof, formal counterexample, and Orientation v2 synthetic successor must remain distinct.
- Gen430 remains historically `NOT_IDENTIFIABLE`; Orientation v2 is not a retroactive rescue.

**Machine/reproduction standard:**

- publish the exact formal definitions and bounded model classes;
- expose the finite enumerations/checks used for the formal proof and counterexample;
- expose the constructive counterexample directly or provide a deterministic generator/verifier;
- define the Orientation v2 N=11 selection protocol and untouched N=12 retention test;
- expose observer-check rules and expected class counts;
- provide a verifier that can independently recompute the bounded formal/synthetic outcomes.

**Current packaging state:** `RECORD_BOUND`.

**Target packaging delta:** consolidate definitions, model enumerators or fixtures, Orientation v2 frozen inputs, expected counts, and formal verifier into a public reproduction capsule.

**Proprietary exposure required:** generally no. The formal object can be independently implemented from definitions and test vectors without publishing unrelated estate runtime code.

**Claim ceiling preserved:** formal/synthetic results inside frozen definitions and model classes only; no physical, molecular, cosmological, or universal coherence law.

---

## RFV3-04 — When Is a Claim Allowed to Count?

**Technical binding:** `SCIENTIFIC_CLAIM_ENTITLEMENT_V1_0_4`.

**Human expression:**

- Question: what exact conclusion is an evidence state entitled to support?
- The page must distinguish evidence from entitlement and must state that `ADMISSIBLE` is not a truth label.
- The four-history audit and the separate behavioral-quotient result must remain separate.

**Machine/reproduction standard:**

- publish a neutral specification of the deterministic entitlement calculus;
- identify the four frozen external histories/classes and the normalized inputs used in the audit;
- expose the expected entitlement vector and the `0/4` disagreement/core-semantic-change/unregistered-class outcomes;
- define the separate quotient computation, including the five pointed local classes and three-bit minimum;
- provide a verifier that recomputes the frozen audit and quotient from public normalized fixtures;
- use public source histories or lawful locators rather than copying material that cannot be redistributed.

**Current packaging state:** `RECORD_BOUND`; the governing record describes the four-history audit as reproducible, but unaffiliated reproduction remains a future credibility test.

**Target packaging delta:** publish the neutral entitlement specification, frozen normalized fixtures, source locators, expected vector, quotient fixture, and verifier as one capsule.

**Proprietary exposure required:** no. The public reproduction object should test the entitlement method, not disclose the production control plane that may consume it.

**Claim ceiling preserved:** bounded support across the four frozen histories/classes and separately bounded formal-computation results; no universal scientific method, complete taxonomy, or truth guarantee.

---

## RFV3-05 — Can the Agent Actually Do the Work?

**Technical binding:** `AGENTIC_FRONTIER`.

**Human expression:**

- Question: can an agent complete verified work under a known definition of done rather than merely explain how it might be done?
- Study 1 remains configuration-bounded.
- Comparator end-to-end tool-loop health remains unresolved.
- Study 2 remains separately frozen/unopened where the governing record says so.

**Machine/reproduction standard:**

- preserve the frozen 24-task population and task identities;
- identify the tested Diamond Gate and OpenHands configurations without silently generalizing either;
- expose task-level machine-readable outcomes;
- expose adjudication and grading rules;
- expose the claim-ceiling receipt;
- expose an executable record verifier;
- distinguish record verification from a fresh end-to-end rerun of both agent configurations.

**Current packaging state:** `RECORD_VERIFY_READY`.

**Existing public bundle:** `evidence/agentic-frontier/research-records/full24-v1/`

The bundle already contains:

- `results-v1.jsonl`
- `adjudication-v1.md`
- `claim-ceiling-receipt-v1.json`
- `summary-v1.md`
- `verify-full24-record-v1.mjs`

**Target packaging delta:** create the human reproduction page and a companion manifest that index the existing bundle. If a full fresh experimental rerun is later claimed as turnkey, separately add the exact runnable environment/configuration and lawful execution instructions required for both tested sides.

**Proprietary exposure required:** no for record verification. A fresh end-to-end reproduction may require publishing a neutral execution specification and configuration surface, but not unrelated proprietary orchestration.

**Claim ceiling preserved:** configuration-bounded Study 1 observation only; no universal ranking, architecture-only causation, or universal OpenHands claim.

---

## RFV3-06 — Do the Safeguards Earn Their Cost?

**Technical binding:** `CANONICAL_CONTROL_KERNEL_V1`.

**Human expression:**

- Question: which safeguards materially change a bounded operational result, and which merely add ceremony?
- The page must preserve mixed component dispositions: distinguished, not distinguished, and unevaluable.
- Operational distinction must never be presented as scientific validation.

**Machine/reproduction standard:**

- publish a neutral specification of the components under test (`256`, `NEWS`, `ACK_PACK`, `PSALM`, and Fibonacci host utility) sufficient to understand their tested role without exposing private production internals;
- define a bounded repository-operation fixture or synthetic reference workload;
- define same-information comparison conditions where applicable;
- define outcome measures for prevention, recovery, error, rework, overclaim, and burden;
- expose expected source-native dispositions for the preserved reference record;
- provide a neutral verifier/adjudicator for the public fixture;
- keep the private production implementation behind the specification boundary.

**Current packaging state:** `RECORD_BOUND`.

**Target packaging delta:** create a public neutral Kernel test specification, bounded reference fixture, comparator, outcome schema, expected reference dispositions, and verifier.

**Proprietary exposure required:** no, if the public object reproduces the operational proposition through a neutral interface instead of requiring the production control-plane implementation.

**Claim ceiling preserved:** one bounded repository-operation control profile; no scientific authority, universal enforcement, cross-repository transfer, or superiority over a competent simpler architecture.

---

## RFV3-07 — Can Someone Else Pick Up the Work?

**Technical binding:** `TRANSFER / SUCCESSION / REPRODUCTION FRONTIER`.

**Human expression:**

- Question: can another operator recover what happened, what failed, what remains unresolved, and what may lawfully happen next without the creator's private conversational memory?
- Internal recovery must remain distinct from external portability.

**Machine/reproduction standard:**

- create a bounded handoff fixture containing exact state, evidence references, negative/null/unresolved states, frozen task/protocol identities, and explicit allowed-next-action boundaries;
- provide a recovery questionnaire or deterministic acceptance rubric;
- require the reproducing operator to work without private conversational memory;
- record whether the operator correctly reconstructs state, scientific standing, unresolved questions, and lawful next actions;
- expose the result as an external transfer/reproduction record only after an unaffiliated operator actually performs the test.

**Current packaging state:** `RECORD_BOUND` with internal succession evidence only.

**Target packaging delta:** build one clean public handoff capsule and independent acceptance rubric. This object becomes the most direct test of whether the broader reproduction architecture can actually leave the original operator.

**Proprietary exposure required:** no. The fixture may be bounded/synthetic or use a deliberately disclosed slice, provided the test genuinely measures recovery without private memory.

**Claim ceiling preserved:** internal custody/succession mechanics and reproduction requirements only until unaffiliated transfer is actually observed.

---

# 5. Continuity matrix

| Object | Public expression | Required standard object | Current packaging state | Primary remaining delta |
| --- | --- | --- | --- | --- |
| RFV3-01 | Prediction + mechanism + replication kept separate | predictive protocol + RTG intervention/replication specification + verifier | `RECORD_BOUND` | clean fully custodial successor capsule |
| RFV3-02 | prerequisite gates; null preserved | admissibility definition + heldout fixtures + comparator + adjudicator | `RECORD_BOUND` | assemble bounded SAS capsule |
| RFV3-03 | formal structure/orientation | formal definitions + enumerator/test vectors + orientation verifier | `RECORD_BOUND` | consolidate formal/synthetic package |
| RFV3-04 | evidence entitlement, not truth | entitlement spec + four normalized histories + quotient test + verifier | `RECORD_BOUND` | publish neutral frozen audit capsule |
| RFV3-05 | verified agent completion | Full24 records + adjudication + claim receipt + verifier | `RECORD_VERIFY_READY` | add human index/manifest; full rerun spec only if later claimed |
| RFV3-06 | safeguards must earn burden | neutral Kernel spec + bounded workload + comparator + verifier | `RECORD_BOUND` | create public reference test surface |
| RFV3-07 | work must survive creator memory | handoff fixture + recovery rubric + independent result record | `RECORD_BOUND` | execute future unaffiliated transfer test |

---

# 6. Human-to-machine field crosswalk

| Human page section | Machine field | Continuity rule |
| --- | --- | --- |
| Question tested | `question` | Must preserve the canonical bounded proposition. |
| Standing | `evidenceStatus`, `sourceDispositions` | Packaging cannot upgrade standing. |
| Inputs | `inputs`, `inputLicensingOrLocator` | Missing/non-redistributable inputs must be declared or linked lawfully. |
| Comparator | `comparator` | Comparator health/limitations remain visible. |
| Procedure | `procedure`, `environment` | Must be sufficient for the claimed reproduction level. |
| Expected outputs | `expectedOutputs` | Must bind to exact preserved metrics/dispositions. |
| Verification | `acceptanceCriteria`, `verifier` | Verifier proves only what it actually checks. |
| Exact sources | `sourceIdentities` | Exact source/version identity required. |
| Known gaps | `knownGaps` | No silent substitution or memory reconstruction. |
| Proprietary boundary | `proprietaryBoundary` | Private implementation may remain private if proposition remains independently testable. |
| Claim ceiling | `claimCeiling` | Human and machine forms must be equivalent in scope. |
| Packaging state | `reproductionPackagingState` | Packaging status is not evidence status. |
| External reproduction | `externalReproductionObserved` | `true` requires actual unaffiliated evidence. |

---

# 7. Implementation boundary

This crosswalk authorizes no page construction by itself.

A later bounded implementation should reuse one common static reproduction-page pattern and one companion manifest schema across all seven objects. The visual treatment should prioritize legibility, source inspection, stable anchors, and direct access to files over cinematic presentation.

The Research Frontier carousel should require no redesign. Each Evidence side needs only one consistent exit such as **Reproduce / Inspect Sources**, routed to the corresponding reproduction page.

The page layer and machine layer must be generated or reviewed against the same object record so that a human explanation cannot drift from the machine contract.

No reproduction page may imply that external reproduction has occurred merely because the package exists.

---

# 8. Acceptance criteria for a future seven-page rollout

The seven-page set is coherent only when all of the following are true:

1. all seven public object IDs and public titles match the current Research Frontier;
2. every page binds to its technical object and current claim ceiling;
3. every page exposes the same twelve-section human structure unless a section is explicitly `NOT_APPLICABLE`;
4. every page has a companion machine manifest using the same schema;
5. every human section has an explicit machine-field counterpart;
6. known missing artifacts remain declared as gaps;
7. public source links resolve to exact or versioned identities where possible;
8. proprietary implementation is not exposed unless actually necessary to reproduce the bounded proposition;
9. Agentic Full24 reuses its existing public bundle rather than rebuilding it;
10. no object is labeled externally reproduced without unaffiliated evidence;
11. no reproduction package changes the underlying scientific standing;
12. the seven packages remain independent: shared presentation does not pool evidence.

The intended end state is not seven decorative pages. It is seven bounded scientific/technical interfaces where a human reader and a machine reader encounter the same experiment, the same sources, the same missing evidence, and the same claim ceiling.
