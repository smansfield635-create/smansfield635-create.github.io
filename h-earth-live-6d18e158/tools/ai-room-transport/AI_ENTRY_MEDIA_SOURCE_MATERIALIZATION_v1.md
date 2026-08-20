# AI_ENTRY_MEDIA_SOURCE_MATERIALIZATION_v1

Status: OPERATIONAL ORCHESTRATION CONTRACT

The AI entry operation `MATERIALIZE_REGISTERED_MEDIA_SOURCE(source_id)` is split across the capabilities that actually own each edge:

1. Resolve `source_id` from `ai-media-source-registry.v1.json`.
2. AI connector layer invokes the registered provider raw fetch in streamed-file mode.
3. AI runtime consumes the returned connector file reference and establishes a local execution-workspace file path.
4. Execute `ai-media-source-materialization-receipt.v1.mjs` against that local path and registered source id.
5. Only a `PASS_CLOSED` receipt with `sourceBinaryAvailable=true` closes C0.

The repository qualifier deliberately does not attempt to open provider-internal `sediment://` references. That edge belongs to the AI connector/runtime handoff and has been exercised successfully for the registered Compass source.

Example qualification after runtime materialization:

`node tools/ai-room-transport/ai-media-source-materialization-receipt.v1.mjs --source-id COMPASS_CH01_CANONICAL_SOURCE --local-path /mnt/data/23619.mp4 --output /mnt/data/compass-source-materialization-receipt.json`

Terminal predicate:
`REGISTERED_ID && LOCAL_FILE_READABLE && BYTE_SIZE_MATCH && SHA256_MATCH && FFPROBE_ACCEPTS`.
