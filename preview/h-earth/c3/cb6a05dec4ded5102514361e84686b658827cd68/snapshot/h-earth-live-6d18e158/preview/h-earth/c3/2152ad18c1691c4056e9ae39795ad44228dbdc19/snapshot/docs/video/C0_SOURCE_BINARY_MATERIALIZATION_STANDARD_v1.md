# C0_SOURCE_BINARY_MATERIALIZATION_STANDARD_v1

Status: GOVERNING / FAIL-CLOSED

C0 is not satisfied by knowing a source filename, Drive URL, hash, or metadata. C0 closes only when the canonical binary is physically readable by the execution tools.

## Governing path
`REGISTERED SOURCE -> AUTHORIZED RAW PROVIDER FETCH -> STREAMED CONNECTOR FILE -> EXECUTION WORKSPACE -> SIZE -> SHA256 -> FFPROBE -> C0 PASS`

For large Drive media, raw fetch must use streamed file-reference mode (`download_raw_file=true`, `include_base64=false`). The resulting connector file is to be materialized into the active execution workspace and verified there.

## Known platform trap
A transfer surface that cannot inline a file larger than its message/base64 ceiling does not prove the underlying provider object cannot be materialized. Do not convert a streamed-file workflow into inline base64 merely because the source is large.

## Fail closed
Any byte-size mismatch, SHA mismatch, invalid provider response, inaccessible materialized file, or ffprobe failure is `C0_FAIL_CLOSED`. No geometry proof or film render may begin.

## AI entry requirement
All AI rooms performing website video construction must consult the closed-world media source registry and source-materialization procedure before inventing a recovery path. If a requested canonical source is registered, the registered recovery path has priority over ad hoc public URLs, GitHub transport, or inline payload transfer.
