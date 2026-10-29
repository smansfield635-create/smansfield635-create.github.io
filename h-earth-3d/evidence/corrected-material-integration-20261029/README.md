# Gen2973 — source binding mismatch; integration held

The production integration branch has been created from the admitted construction base. No product changes have been committed.

The admission assumed that the construction renderer was hash-identical to the frozen comparison renderer. Direct byte comparison disproves that assumption: line949 in fertilePatch uses smoothstep(0.29,0.81,...) at construction base0137d0d, while frozen comparison cb57c275 uses smoothstep(0.42,0.68,...). Every other renderer byte is identical. The transform correctly refused with CORRECTED_RENDERER_SOURCE_HASH before generating the candidate. A separate reviewer independently retrieved and confirmed the difference.

This is a material input difference, not a timing or metadata difference. The saved atlas corrects a specific incoming-soil field. Applying it to a different field is not established as equivalent. Replacing the entire source with the frozen renderer would also revert the current fertilePatch behavior beyond the358 chart faces.

The admitted stop condition EXACT_SOURCE_OR_ASSET_DRIFT_FAILS_CLOSED applies. Preserve the saved8-frame comparison, exact atlas bytes, contact refresh fix and completed shared-edge checks. Do not rerun those checks, alter the palette, widen the support, run GPU capture, merge or publish.

Next: reconcile the correction's source baseline with the actual current expression using saved material evidence, then resolve that explicit binding through existing intake if a product semantic change is required. No new control-plane mechanism is needed. The branch is evidence-only and not an integrated product candidate.

Independent review also identified production lifecycle needs: transactional atlas loading, bitmap close and texture rollback on failure, exact GL unpack-state restoration, renderer texture accounting, dedicated idempotent atlas disposal, and protection against late allocation after disposal. These remain implementation requirements, not completed work.

Authority receipt: https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6507632868

Chamber synchronization unverified; issue6911 is the direct project continuation.
