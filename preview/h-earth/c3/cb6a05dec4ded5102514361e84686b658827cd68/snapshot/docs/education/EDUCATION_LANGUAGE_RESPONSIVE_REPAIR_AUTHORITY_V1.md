# Education Language + Responsive Repair Authority v1

Status: FROZEN CONSTRUCTION AUTHORITY
Base: e5a901bf32a83d1e2af6aff8f52d8852fa53ccb3
Surface: /products/education/

## Protected assets
- Existing carousel navigation mechanics: drag, snap, keyboard, six-card state, adjacent-card navigation.
- English placement/assessment engine and all semantic option values consumed by it.
- Education research/content and English curriculum/test material.
- Existing EN/ES/ZH card-content authority.

## Authorized repair 1 — complete learner-interface language coverage
Bind every learner-interface string to the selected help language (EN / ES / ZH), while English actually being taught or tested remains English.

Add structured shell authority for:
- native-language option labels
- eight proficiency option labels
- five study-history option labels
- four translation-frequency option labels
- hardest-field placeholder
- Phase 1 Demo label
- demo stage/navigation labels

Preserve every underlying form value used by placement logic. Translate display text only.

## Authorized repair 2 — authoritative responsive carousel geometry
Do not rewrite carousel mechanics. Add final CSS after the spatial-chamber rules so responsive geometry wins the cascade.

Behavioral bands:
- Desktop: > 900px
- Tablet: 600–900px
- Phone: < 600px

Target geometry:
- Tablet active card: approximately min(68vw, 24rem); viewport approximately 25–27rem high.
- Phone active card: approximately min(78vw, 20–21rem); card approximately 21–23rem high.
- Neighbor spacing derives from card width and intentionally leaves approximately 15–25% of adjacent cards visible.
- Typography may scale with clamp(), but cards must not be miniature desktop compositions.
- Future/open-card geometry must not default to an oversized 100vw × 100dvh surface.

## Acceptance law
PRESERVE carousel mechanics + placement values + curriculum
→ COMPLETE all learner-interface EN/ES/ZH strings
→ ADD final authoritative phone/tablet geometry
→ REAL-BROWSER test EN/ES/ZH on desktop + tablet + phone
→ CAPTURE evidence
→ INSPECT actual renders
→ LOCALIZED repair/rerun until clean
→ QUALIFY through repository AI entry point
→ PUBLISH only after qualification.

## Explicit exclusions
- No carousel-engine rewrite.
- No placement-engine semantic changes.
- No curriculum/test translation.
- No Gate 3 Learn/Practice/Check construction in this cycle.
- No unrelated Education redesign.
