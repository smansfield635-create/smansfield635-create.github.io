# EDUCATION SIX-CARD CANONICAL DATA SCHEMA v1

STATUS: FROZEN PRE-CONSTRUCTION SCHEMA
PARENTS:
- EDUCATION_SIX_CARD_SINGLE_AUTHORITY_RECONSTRUCTION_CONTRACT_v1
- EDUCATION_ACTION_BOUNDED_ASSEMBLY_SPECIFICATION_v1
PRODUCT MUTATION: NONE

## Purpose

Define one semantic authority for each learner card so front copy, Learn face, instrument, Practice, validation, feedback, success, boundary and EN/ES/ZH expression cannot drift independently.

## Canonical collection

Runtime successor SHALL expose one ordered collection:

EDUCATION_CARD_MODEL = [
  possibility,
  understanding,
  action,
  progress,
  independence,
  achievement
]

Card order is immutable in this cycle.

## Required card record

Each record SHALL contain:

id
ordinal
construct
evidenceClass
locales
instrument
task
validation
feedback
success
boundary
deepReference

### locales

Each of en, es, zh SHALL contain:

title
front
support
learn
practice
check
retry
success

Localized text may differ linguistically but MUST preserve identical semantic claims.

Target-English examples and task components remain English where the exercise requires English.

### instrument

instrument SHALL contain:

type
nodes
relationships
resultBinding

The visual instrument is therefore data-bound to the same card record as the task rather than independently hardcoded by card index.

### task

task SHALL declare a bounded interaction type and all permissible learner-controlled states.

Permitted task types in v1:
- choice
- multi_select
- assembly
- support_choice

No implicit free-text task type exists in this schema.

### validation

validation SHALL explicitly define:
- completeness;
- valid state;
- invalid state where applicable;
- normalization if any;
- retry eligibility.

Validation may not infer correctness from localized prose.

### feedback

feedback SHALL define:
- incomplete;
- incorrect;
- retry;
- optional help behavior.

### success

success SHALL state only the evidence demonstrated by the bounded activity.

### boundary

boundary SHALL state what the activity does NOT establish.

## Canonical card records

### 1. possibility

id: possibility
ordinal: 1
construct: bounded-foundation leverage
evidenceClass: BOUNDED_RECOMBINATION

instrument:
- type: bounded_branch
- foundation: [I, like, music, dogs]
- outputs: ["I like music.", "I like dogs."]
- resultBinding: selected outputs

task:
- type: multi_select
- options: ["I like music.", "I like dogs."]
- required: both

validation:
- complete only when both outputs have been demonstrated
- one output alone is incomplete
- both outputs is valid

success:
"You used the same small foundation to build more than one English message."

boundary:
Does not prove that 1,001 isolated words equal fluency or all English.

Required reconciliation:
Retire the old 1,001 -> I am Sam. learner-card instrument.

### 2. understanding

id: understanding
ordinal: 2
construct: productive pattern transformation
evidenceClass: PATTERN_TRANSFORMATION

instrument:
- type: transformation
- source: play
- operator: -ed
- result: played

task:
- type: choice
- options: [play, played]
- valid: played
- invalid: play

success:
"You found the pattern. One known word can do more when you understand how it changes."

boundary:
Demonstrates one regular-past transformation, not general morphology mastery.

PROTECTED REFERENCE IMPLEMENTATION.

### 3. action

id: action
ordinal: 3
construct: bounded component assembly
evidenceClass: SENTENCE_ASSEMBLY

instrument:
- type: assembly
- frame: "I [verb] [object]."
- resultBinding: learner assembly

task:
- type: assembly
- verb: [like, likes]
- object: [music, dogs, pizza]

validation:
- complete iff one verb and one object selected
- valid iff verb == like and object belongs to bounded object bank
- invalid iff verb == likes and object selected

feedback:
- incomplete: choose both parts
- incorrect: inspect subject I and retry the verb
- retry preserves learner assembly

success:
"You built a complete English sentence from parts."

boundary:
Does not establish unrestricted writing, general grammar mastery, vocabulary breadth, spontaneous production, placement or fluency.

PROHIBITED:
free text; all-options-correct; complete-sentence multiple choice.

### 4. progress

id: progress
ordinal: 4
construct: feedback-driven correction
evidenceClass: CORRECTION_LOOP

instrument:
- type: loop
- sequence: ["TRY · She walk.", "CHECK", "CHANGE · +s", "AGAIN · She walks."]

task:
- type: choice
- options: ["She walk.", "She walks."]
- valid: "She walks."
- invalid: "She walk."

success:
"You checked the answer and changed it. That is progress you can see."

boundary:
One corrected item does not establish broad grammar mastery or retention.

LEARNER PATH PROTECTED.

### 5. independence

id: independence
ordinal: 5
construct: reduced-support performance
evidenceClass: SUPPORT_REDUCTION

instrument:
- type: support_gradient
- states: [more_help, less_help, independent_try]

task:
- type: support_choice
- help: "hello = a greeting"
- options: ["It means hello.", "It means goodbye."]
- valid: "It means hello."
- invalid: "It means goodbye."

validation SHALL preserve whether help was displayed when the learner answered.

success:
"You solved it with support." when help was used.
A reduced-support success expression may be used only when the recorded state proves reduced/no help.

boundary:
Support use is learning evidence, not verified placement or independent proficiency.

LEARNER PATH PROTECTED.

### 6. achievement

id: achievement
ordinal: 6
construct: changed-surface transfer
evidenceClass: TRANSFER

instrument:
- type: transfer
- earlier: "play -> played"
- now: "walk -> walked"

task:
- type: choice
- options: [walked, walk]
- valid: walked
- invalid: walk
- transferFrom: "play -> played"

success:
"You used an earlier pattern with a new word."

boundary:
Demonstrates one changed-surface transfer, not general past-tense mastery, unrestricted transfer or program completion.

CORE TASK PROTECTED.

## Rendering law

Carousel front, expanded Understand face, expanded Practice face, instrument renderer, validation handler and success confirmation SHALL consume EDUCATION_CARD_MODEL.

Index-specific semantic branches in instrument(), feedback(), or validation are prohibited unless they merely dispatch on declared card/task type.

Card semantics SHALL NOT be independently sourced from:
- HELP_LANGUAGES.cards;
- PRODUCT_STORY card arrays;
- EDUCATION_ARCHITECTURE learner claims;
- a separate tasks array.

Those authorities must be migrated, reduced to non-semantic helpers, or retired from card rendering.

## Technical architecture separation

EDUCATION_ARCHITECTURE may continue to document the broader program, but its records must be linked by card id/deepReference and may not override learner-card construct, task, success or boundary.

Placement architecture belongs outside card semantics.

## Localization parity law

For each card:
EN construct == ES construct == ZH construct.

A qualification must compare the semantic keys and verify no locale:
- changes the correct state;
- strengthens the success claim;
- changes the evidence boundary;
- reintroduces Phase-1-only or demo-only program ontology.

## Migration acceptance

Before deleting or retiring legacy authorities, construction must crosswalk every consumed field to the canonical model.

Qualification requires:
- six records exactly;
- six unique ids;
- six unique evidence classes;
- no unrestricted text task;
- Action has valid and invalid assembly states;
- Possibility requires both bounded outputs;
- Understanding/Progress/Independence protected behavior retained;
- Achievement changed-surface transfer retained;
- D1-D7, Capstone and placement runtime byte/semantic protected.

## Next lawful action

Perform a read-only migration map from every currently consumed HELP_LANGUAGES / PRODUCT_STORY / EDUCATION_ARCHITECTURE / tasks / instrument / feedback field to this schema. Identify which legacy fields are RETAIN, MIGRATE, or RETIRE before constructing EDUCATION_CARD_MODEL.
