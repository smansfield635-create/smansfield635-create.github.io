# Website Cinematic Video Standard v1

Status: ACTIVE REUSABLE STANDARD

This standard exists to prevent future website films from confusing capture geometry with presentation geometry.

## Authority separation

Every website film has three distinct authorities:

1. **Source authority** — original recorded pixels and motion.
2. **Editorial authority** — story order, shot durations, transition intent, comprehension rhythm, and narrative windows.
3. **Presentation authority** — the final geometry required by the live website.

A successful edit in the wrong presentation geometry is not a live-compatible master.

## Presentation law

The website master is authored for its live cinematic field. A portrait phone capture may be used as source material, but the complete phone viewport may not be shrunk into a black 16:9 field and treated as a finished composition. Each shot must instead use `REFRAME`, `PAN_SCAN`, or `COMPOSITE` treatment with an explicit focal subject and acceptance condition.

## Comprehension law

The viewer should not be required to read and inspect an important moving image simultaneously.

The preferred rhythm is:

`READ -> LOOK -> TRANSITION -> READ -> LOOK`

The opening line receives its own dark cinematic canvas before moving footage begins. Later text appears only during intentionally reduced visual demand, and clears before the next major reveal.

## Deterministic construction gate

Before rendering a picture master:

- freeze editorial authority and hashes;
- map every shot to one lawful geometry treatment;
- declare focal material that must survive;
- declare device/UI material that must be excluded;
- declare motion behavior;
- declare one observable acceptance condition per shot;
- validate the map automatically;
- render only after every shot is admitted.

## Live compatibility gate

A candidate is not approved merely because it is 1920x1080. Representative frames must demonstrate:

- cinematic subject dominance;
- no visible complete-phone framing;
- no dominant dead black field created by fit-to-frame;
- scale comparable to successful live films;
- preserved important content;
- text-safe reading windows;
- no device-recording impression at normal viewing distance.

## Lineage law

Never overwrite a prior stage silently. Record SHA-256 and status for source, qualified candidate, editorial lock, presentation supersession, live-compatible picture master, text/music master, and final approved master.
