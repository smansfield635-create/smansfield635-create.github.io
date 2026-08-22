# Reproduction Boundary

This directory defines how evidence may progress from internal reproducibility to genuine independent reproduction.

## Internal reproduction

A fresh CI runner or a separate local environment can repeat the frozen command against the same exact head. This is valuable reproducibility evidence, but it remains internal when the implementation, procedure, expected outputs, and evaluator are controlled by the originating project.

## Independent reproduction

`INDEPENDENTLY_REPRODUCED=ESTABLISHED` requires evidence from a genuinely independent implementation, observer, or reproducer.

Examples:

- LRPv1: a third implementation authored without copying the Python or ECMAScript reference implementation, evaluated against the public candidate specification and vectors.
- IMI: qualified observers applying frozen study materials to blinded cases without access to intended classifications, followed by prespecified agreement analysis.
- empirical studies: a reproducer outside the originating analysis reruns a frozen data/code package and reports the result, including discrepancies.

## Clean-room minimum

An independent reproduction package should contain only what a competent external party legitimately needs:

- frozen specification and version;
- exact artifact/data identities or retrieval instructions;
- public conformance vectors or blinded cases;
- execution instructions;
- prespecified acceptance and falsification criteria;
- expected-output disclosure rules appropriate to the design.

The originating project must preserve negative and discrepant results.
