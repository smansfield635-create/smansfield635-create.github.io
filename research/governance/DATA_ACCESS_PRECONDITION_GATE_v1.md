# DATA_ACCESS_PRECONDITION_GATE_v1

**Mode:** Epistemic-control-plane governance  
**Status:** LOCKED · NON-OVERRIDABLE WITHIN ACTIVE RESEARCH PROGRAM  
**Scope:** All research experiments, validation programs, comparator studies, model-development tracks, and empirical proof paths

---

## 1. PURPOSE

Prevent any research program from advancing into detailed experimental design before confirming that the required data can actually be obtained and lawfully used under the resources and credentials available to the project.

This rule exists because experiment design without verified data access can create false execution momentum, wasted work, and invalid planning assumptions.

---

## 2. HARD PRECONDITION

Before any experiment proceeds beyond intake:

**DATA_ACCESS_MUST_BE_PROVEN_FIRST**

No exception by enthusiasm, conceptual coherence, scientific plausibility, or perceived importance.

---

## 3. REQUIRED ACCESS CHECK

Every proposed empirical experiment must answer, in writing:

1. What exact dataset or data source is required?
2. Is the data downloadable now?
3. Is the data publicly accessible without institutional affiliation?
4. Does access require:
   - institutional affiliation,
   - institutional email,
   - PI / senior investigator,
   - IRB / ethics review,
   - data-use agreement,
   - credentialing,
   - training,
   - payment,
   - application approval,
   - restricted computing environment?
5. Does the current project actually possess those requirements?
6. Are there legal / licensing restrictions on use?
7. Can the data be stored and analyzed in the intended environment?
8. Can the experiment be completed end-to-end with currently available resources?

---

## 4. ACCESS STATES

Every experiment must receive exactly one access state before detailed design:

### ACCESS_VERIFIED
Required data are obtainable now under current resources and permissions.

### ACCESS_VERIFIED_WITH_STEPS
Data are obtainable, but specific bounded steps are required and are realistically available to the project.

### ACCESS_BLOCKED
Required data cannot currently be obtained under the project's actual resources, affiliation, credentials, or permissions.

### ACCESS_UNKNOWN
Access has not been verified.

---

## 5. EXECUTION LAW

### If ACCESS_VERIFIED
Experiment may proceed.

### If ACCESS_VERIFIED_WITH_STEPS
Only the access steps may proceed until access is completed.

### If ACCESS_BLOCKED
Experiment must stop.
Preserve architecture if valuable.
Do not continue detailed protocol design as though execution is available.

### If ACCESS_UNKNOWN
Experiment must stop.
Resolve access before proceeding.

---

## 6. FORBIDDEN BEHAVIOR

The following are governance violations:

- designing a full validation program before checking dataset accessibility
- assuming a public study page means patient-level data are publicly downloadable
- assuming a data dictionary implies data access
- assuming "research use" means unaffiliated public access
- treating credentialed-access datasets as open-web datasets
- continuing model specification after access is known to be blocked
- telling the project that an experiment is executable before verifying the access path
- substituting synthetic data while implying real empirical validation
- using proxy data without explicitly downgrading the claim scope

---

## 7. RESOURCE-SCOPE RULE

Every experiment must be designed against the project's actual resource envelope.

Current default resource envelope unless explicitly expanded:

- public web
- public repository
- OSF/public research materials
- openly downloadable datasets
- project-owned files/data
- available connected tools

Do not assume:

- institutional affiliation
- clinical credentials
- physician status
- university access
- IRB sponsorship
- controlled-access data privileges
- paid proprietary datasets

unless explicitly confirmed.

---

## 8. OPEN-WEB FIRST RULE

For this project, when multiple data paths exist:

1. prefer fully open, directly downloadable, legally usable data
2. verify access before experiment design
3. only use controlled-access datasets as future/optional branches unless access is already secured

---

## 9. CLAIM BOUNDARY

If only proxy, aggregate, synthetic, or lower-resolution public data are available:

- the experiment scope must be reduced accordingly
- the claim must be downgraded accordingly
- the result must not be represented as equivalent to patient-level clinical validation

---

## 10. REQUIRED INTAKE RECEIPT

Before an empirical branch can move beyond intake, create:

**DATA_ACCESS_RECEIPT**

containing:

- dataset name
- source URL
- access type
- exact access requirements
- current project eligibility
- download status
- license / DUA status
- storage constraints
- analysis constraints
- final state:
  - ACCESS_VERIFIED
  - ACCESS_VERIFIED_WITH_STEPS
  - ACCESS_BLOCKED
  - ACCESS_UNKNOWN

No receipt = no experiment progression.

---

## 11. CONTROL-PLANE ENFORCEMENT

This gate sits before:

- preregistration
- endpoint lock
- comparator design
- feature dictionary
- model specification
- sample-size planning
- validation design
- implementation

Required order:

**DATA ACCESS → INTAKE → EXPERIMENT DESIGN → VALIDATION**

Not:

**EXPERIMENT DESIGN → DISCOVER ACCESS FAILURE**

---

## 12. GUIDE-IT RETROSPECTIVE CLASSIFICATION

GUIDE-IT current state:

**ACCESS_BLOCKED**

Reason:
The strongest patient-level GUIDE-IT validation path requires controlled-access steps and institutional infrastructure not currently available to this project.

Disposition:
- preserve completed architecture
- freeze branch
- do not advance as an executable validation path
- treat as future optional work if access conditions change

---

## 13. HARD STOP

If any future room attempts to advance an empirical experiment without a verified DATA_ACCESS_RECEIPT:

**STOP**

Return:

**ACCESS_GATE_NOT_SATISFIED**

No modeling, protocol expansion, or validation design may continue until access is resolved.

---

## FINAL LAW

**VERIFY ACCESS BEFORE DESIGNING THE EXPERIMENT.**

Compressed:

**NO DATA ACCESS → NO EXPERIMENT DESIGN**
