# EDUCATION SIX-CARD EXERCISE-FIRST SPECIFICATION v1

STATUS: FROZEN PRE-CONSTRUCTION SPECIFICATION
PARENT: EDUCATION_SIX_CARD_CLOSURE_DISPOSITION_CONTRACT_v1
SCOPE: Possibility, Action, Achievement
PRODUCT MUTATION: NONE

## Governing rule

The activity defines the educational claim. Presentation copy must conform to what the learner actually does and what the check can legitimately establish.

## Card 1 — Possibility

### Construct
A bounded known foundation can be recombined into multiple usable expressions. The learner should experience leverage from a small set rather than merely recognize an easy sentence.

### Learner action
Present a small fixed foundation:

I
like
music
dogs

and two reusable sentence frames:

I like ___.
___ like music.

Ask the learner to build two different valid sentences using only the supplied foundation and frames.

Required learner products:
I like music.
I like dogs.

The first implementation may use bounded construction controls/tokens rather than unrestricted free text, provided the learner actively constructs both expressions rather than choosing one complete sentence from a list.

### Correct state
Both constructed sentences are valid and use only the supplied bounded foundation.

### Retry behavior
An incomplete or invalid construction does not reveal a new vocabulary answer. The interface returns the supplied foundation and asks the learner to build the missing valid expression.

### Success evidence
Success statement:
"You used the same small foundation to build more than one English message."

The visible instrument should show the fixed foundation branching into the two successful expressions.

### Demonstrated construct
Within this bounded activity, the learner demonstrates that a small known inventory can support multiple usable expressions through combination.

### Evidence boundary
This activity does not prove that 1,001 concepts alone equal fluency, that every English message can be generated from these four words, or that the learner has mastered the full 1,001-concept system.

The card may use the 1,001 architecture as the program-level analogy, but its direct exercise evidence is limited to bounded combinatorial leverage.

## Card 3 — Action

### Construct
The learner produces English rather than merely recognizing a completed answer.

### Learner action
Prompt:
Complete the sentence yourself:

I like ______.

Use a text input. The learner enters one acceptable simple content word.

Initial accepted demonstration set:
music
dogs
pizza

Case and terminal punctuation are normalized.

The architecture may later broaden validation, but this closure cycle does not require open-ended semantic grading.

### Correct state
A normalized response matches the bounded accepted set and produces:
I like <learner word>.

### Retry behavior
Empty input:
"Write one word to finish the sentence."

Unaccepted input:
"Try a simple thing you like, such as music, dogs, or pizza."

The retry may give examples because this is practice, not placement evidence.

### Success evidence
Success statement:
"You built an English sentence instead of choosing one."

The learner's own completed sentence remains visible in the instrument.

### Demonstrated construct
The learner has produced the missing content needed to complete a simple English sentence within a bounded practice task.

### Evidence boundary
This is sentence-construction practice, not evidence of general writing fluency, unrestricted vocabulary production, or verified placement.

## Card 6 — Achievement

### Construct
A previously encountered language relationship can be transferred to a changed surface rather than merely repeated.

### Prior learning available
Understanding explicitly demonstrates:
play -> -ed -> played

Achievement must not ask for played as its answer.

### Learner action
Present a new regular verb:
walk

Prompt:
"Earlier you saw play -> played. Now use the same idea with walk. Which form shows the past?"

Options:
walked
walk

Correct:
walked

The exercise surface is changed while the underlying regular-past relationship remains the transferable principle.

### Correct state
Learner selects walked.

### Retry behavior
Incorrect response:
"Think about the earlier pattern: play -> played. Try the same idea with walk."

The retry points back to the transferable relationship without simply supplying the correct answer.

### Success evidence
Success statement:
"You used an earlier pattern with a new word."

The visible instrument should connect:
Earlier: play -> played
Now: walk -> walked

### Demonstrated construct
The learner transfers one explicitly taught regular-past pattern to a different lexical surface within the bounded activity.

### Evidence boundary
This does not establish mastery of English past tense generally, irregular verbs, unrestricted transfer, or program completion. It establishes one successful changed-surface transfer under the activity conditions.

## Cross-card distinction

Possibility proves bounded combinatorial leverage.
Understanding demonstrates how a pattern changes a known word.
Action requires learner construction.
Progress demonstrates correction through feedback.
Independence demonstrates reduced-support performance.
Achievement demonstrates changed-surface transfer.

No two cards may resolve to the same evidence claim.

## Protected cards

Understanding, Progress and Independence remain unchanged by this specification.

## Legacy metadata reconciliation target

During construction, obsolete EDUCATION_ARCHITECTURE language about Eight Competency Stages, Stages 7–8 and Phase-1 completion must be replaced with program-wide four-phase language without changing placement runtime authority.

## Pre-construction cross-audit requirements

Before product mutation verify:
1. Possibility no longer collapses into elementary sentence recognition.
2. Action requires generated learner input.
3. Achievement answer surface differs from Understanding.
4. Achievement still uses a relationship actually taught earlier.
5. The three activities remain beginner-accessible.
6. None of the activities are represented as placement evidence.
7. EN/ES/ZH help-language behavior can explain the task while target-English exercise content remains English.

## Next lawful action

Perform the read-only cross-audit of this specification against the current card runtime and frozen closure contract. If coherent, produce the exact bounded mutation plan before product-code mutation.
