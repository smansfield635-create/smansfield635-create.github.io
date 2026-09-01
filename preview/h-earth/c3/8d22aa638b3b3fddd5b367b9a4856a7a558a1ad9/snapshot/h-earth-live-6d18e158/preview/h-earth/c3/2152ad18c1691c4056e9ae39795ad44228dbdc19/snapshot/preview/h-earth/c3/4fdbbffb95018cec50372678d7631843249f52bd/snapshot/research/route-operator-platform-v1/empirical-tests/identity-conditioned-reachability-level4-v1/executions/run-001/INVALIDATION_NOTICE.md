# Run 001 invalidation notice

`RUN_ID = run-001`

`DISPOSITION = INVALID_CUSTODY`

Run 001 is not an admissible exact-head scientific execution because the frozen manifest contained one incorrect expected SHA-256 value for the unchanged file `level4_target_system_v1.py`.

The exact committed file SHA-256 was:

`8c36d7bc61de0f8bc06d3574db3a8b6c9233f2480198ff8bb313825571b89e82`

The manifest incorrectly declared:

`2fab7a7792558e25ac1cbffd9e38f89bc10c2cbffb89ee6e3fa861c52b720aff`

The dedicated exact-head workflow stopped at manifest verification before execution. Therefore the repository-bound run-001 result files may not be treated as an admitted exact-head result, regardless of their local deterministic output.

No scientific contract, prediction, alternative model, target-system implementation, threshold, boundary, or failure-ownership rule was changed. The manifest-only correction creates version `1.0.1`, after which a separately identified run 002 may be executed.
