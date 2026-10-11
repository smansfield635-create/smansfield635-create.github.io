# RTS24 Gen428 Room Recovery Rule

Any new room taking over Gen428 must begin from repository state, not from chat transcript reconstruction.

Order:

1. `docs/RTS24_GEN428_FINAL_ADJUDICATION_HANDOFF_CURRENT.md`
2. issue `#2709`
3. `docs/RTS24_GEN428_EXECUTION_PACKET_STATUS.md`
4. latest sealed receipt
5. execute only its `NEXT_LAWFUL_ACTION`

If the execution packet says `EXECUTION_READY = FALSE`, the room may perform only source-binding recovery. If exact source bindings cannot be recovered within the retrieval budget, it must report the unresolved binding and stop. It may not substitute broad repository archaeology for progress.
