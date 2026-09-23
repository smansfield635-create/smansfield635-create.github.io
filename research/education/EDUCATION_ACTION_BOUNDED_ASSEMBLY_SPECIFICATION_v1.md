# EDUCATION ACTION BOUNDED ASSEMBLY SPECIFICATION v1

STATUS: FROZEN PRE-CONSTRUCTION SPECIFICATION
PARENT: EDUCATION_SIX_CARD_SINGLE_AUTHORITY_RECONSTRUCTION_CONTRACT_v1
PRODUCT MUTATION: NONE

## Construct

Action demonstrates that the learner can assemble a simple English message from bounded components.

It must not test unrestricted writing and must not reduce to recognizing a complete prebuilt sentence.

## Instrument

Persistent sentence frame:

I [ VERB ] [ OBJECT ].

Two bounded component slots are learner-controlled.

VERB BANK:
- like
- likes

OBJECT BANK:
- music
- dogs
- pizza

The learner selects one verb and one object. The instrument immediately renders the resulting sentence.

Examples of reachable states:
- I like music. — VALID
- I like dogs. — VALID
- I like pizza. — VALID
- I likes music. — INVALID
- I likes dogs. — INVALID
- I likes pizza. — INVALID

Therefore the task contains both successful and unsuccessful assembly states without requiring open-language grading.

## Learner action

Instruction:
"Build the sentence. Choose the verb and the thing."

The learner must make two component decisions:
1. choose the verb;
2. choose the object.

The learner is not choosing among complete sentences.

## Validation

A complete state requires one selected verb and one selected object.

Correct iff:
verb === "like"
AND object is one of ["music","dogs","pizza"].

Incorrect iff:
verb === "likes"
AND an object is selected.

Incomplete states are not scored as incorrect; they prompt completion.

## Retry behavior

No verb or object:
"Choose both parts to finish the sentence."

Invalid assembly:
"Look at the subject: I. Try the verb again."

The incorrect state remains visible so feedback refers to the learner's actual assembly.

The system does not silently replace the learner's answer.

## Success evidence

Successful sentence remains visible.

Success statement:
"You built a complete English sentence from parts."

This replaces any statement claiming the learner did not choose, because bounded component selection is intentionally part of the construction mechanism.

## Evidence boundary

This activity demonstrates bounded sentence assembly with one subject frame, one verb contrast and a small object bank.

It does not establish:
- unrestricted writing ability;
- general grammar mastery;
- vocabulary breadth;
- spontaneous language production;
- placement;
- fluency.

## Relationship to other cards

Possibility:
Shows that a bounded foundation can support multiple messages.

Understanding:
Shows a productive pattern changing a known word: play -> played.

Action:
Assembles a message from bounded components with valid and invalid states.

Progress:
Uses feedback to correct an error.

Independence:
Attempts performance with less support.

Achievement:
Transfers an earlier pattern to a changed lexical surface.

Action therefore does not duplicate Understanding, Progress or Achievement.

## Localization

EN:
"Build the sentence. Choose the verb and the thing."

ES:
"Construye la oración. Elige el verbo y la cosa."

ZH:
"构建句子。选择动词和事物。"

The component bank remains target English in every help language:
I / like / likes / music / dogs / pizza.

Feedback may be localized. Target-English constructed output remains English.

## Prohibited regressions

- no free-text input;
- no accepted arbitrary lexical input;
- no all-options-correct task;
- no complete-sentence multiple choice;
- no validation requiring a dictionary or general language model;
- no success claim stronger than the bounded evidence.

## Physical acceptance

At minimum qualification must prove:
1. no text input exists on Action;
2. both component slots are required;
3. I like music. passes;
4. I like dogs. passes;
5. I like pizza. passes;
6. I likes music. fails;
7. failure produces retry feedback;
8. learner can change the verb and pass on retry;
9. final constructed sentence is visibly preserved;
10. success statement matches bounded assembly evidence.

## Next lawful action

Define and freeze the canonical six-card data schema that will own construct, localized expression, instrument specification, task, validation, feedback, success and boundary for every card. Do not mutate product runtime before that schema is reconciled against all six dispositions.
