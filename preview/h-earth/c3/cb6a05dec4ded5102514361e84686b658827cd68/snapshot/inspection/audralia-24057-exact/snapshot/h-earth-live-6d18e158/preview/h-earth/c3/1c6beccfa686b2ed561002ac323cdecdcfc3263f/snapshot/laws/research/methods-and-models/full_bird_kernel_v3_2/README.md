# Full Bird Kernel v3.2 — End-to-End Gap Closure

```text
STATUS = EXECUTABLE_CANONICAL_SUCCESSOR_CANDIDATE
PREDECESSOR = full_bird_kernel_v3_1
KERNEL_VERSION = 3.2.0
RUNTIME = PYTHON_STANDARD_LIBRARY_ONLY

GAP_01_EXTERNAL_M_SCORE_AND_HFNUM = CLOSED
GAP_02_CALLER_SUPPLIED_RECEIPT_VALID_BOOLEAN = CLOSED

EMPIRICAL_VALIDATION = NOT_CLAIMED
DOMAIN_VALIDATION = NOT_CLAIMED
AUTONOMOUS_SEMANTIC_DERIVATION = NOT_CLAIMED
ISSUER_SIGNATURE_TRUST = OPEN
EXTERNAL_MATHEMATICAL_REVIEW = OPEN
```

## Purpose

v3.2 closes the two immediate trust gaps left by v3.1.

1. `evaluate_edge()` no longer accepts `m_score` or `hf_num`. It receives two exact eight-bit microstates and computes the complete inherited numerical kernel internally.
2. `advance_lifecycle()` no longer accepts `receipt_valid=True`. It receives the actual lifecycle receipt, validates its deterministic hash, identity, stage type, status, cross-references, predecessor receipts, terminal correspondence, and HOME preservation conditions before advancing.

The package remains fail-closed. Missing, malformed, mismatched, duplicated, tampered, out-of-order, or insufficient records do not become favorable facts.

## Canonical eight-bit state

```text
x = (E1,E2,E3,I1,I2,I3,V1,V2) ∈ {0,1}^8
```

The engine derives:

```text
e = (E1+E2+E3)/3
i = (I1+I2+I3)/3
v = (V1+V2)/2
En = sum(x)/8

Cp = 1-(|e-i|+|i-v|+|e-v|)/2
Cr = [(1-|E1-I1|)+(1-|E2-I2|)+(1-|E3-I3|)+(1-|V1-V2|)]/4
Ci = min(i,(e+v)/2)
Ck = min(v,Cr)
C = min(Cp,Cr,Ci,Ck)

H = [h2(e)+h2(i)+h2(v)]/3
```

The total ordered phase partition is:

```text
if C<1/3 and En<1/3: collapsed
else if C<1/3: strained
else if C<2/3: transitional
else if H<1/3 and v=1: integrated
else: coherent
```

This ordering reproduces the frozen counts:

```text
collapsed=37
strained=153
transitional=56
coherent=3
integrated=7
```

The deterministic engine projection uses the inherited structural-lock bit:

```text
g1 = 1 iff e>=2/3
g2 = 1 iff i>=2/3
g3 = 1 iff v=1
g4 = 1 iff Cr>=2/3

Γ(x)=8g1+4g2+2g3+g4
```

It reproduces the frozen occupancy:

```text
0:30, 1:18, 2:6, 3:10,
4:42, 5:6, 6:10, 7:6,
8:42, 9:6, 10:10, 11:6,
12:30, 13:18, 14:6, 15:10
```

## Internally computed transition authority

```text
d(x,y)=Hamming(x,y)/8
R(x)=0.4·En(x)+0.4·C(x)+0.2·(1-H(x))

N=max[0,1-d-max(0,Cx-Cy)-0.25·max(0,ρx-ρy)]
S=min{En(y),1-H(y)}
E=clamp[0.5+0.5·(R(y)-R(x)),0,1]
W=min{C(y),1-H(y),1-d/2}

Mκ=min{N,S,E,W}
```

`HFnum` is derived from the numeric state transition:

```text
d>1/2
OR C(y)<1/3 AND H(y)>2/3
OR phase regression exceeds one level
```

The former v2 nonnumeric hard-fail conditions remain represented by v3 governance and lifecycle authority rather than being invented from the eight bits.

The strict inherited fixtures are reproduced:

```text
ENGINE_13 → ENGINE_15 = 0.750000
ENGINE_14 → ENGINE_15 ≈ 0.7112197222702993
ENGINE_15 → ENGINE_15 ≈ 0.6778863889369660
```

## Actual lifecycle receipt validation

The only lawful sequence remains:

```text
EXECUTING
→ GLOCK_QUALIFIED
→ PROVISIONALLY_SEALED
→ HOME_RETURN_VERIFIED
→ FINAL_CLOSED
```

Each transition validates the actual record.

### GLOCK

Validates the admissible closure evaluation and its hash; object, origin, scope, construct, version, parameter set, history, and suffix; exact edge list and start/end edge; terminal microstate, engine, and diagnostics; `GLOCK_QUALIFIED_NOT_CLOSED`; and the receipt hash.

### Provisional seal

Validates the exact GLOCK ID and hash, identity correspondence, `full_stack_agreement=true`, `PROVISIONALLY_SEALED_NOT_CLOSED`, and the receipt hash.

### HOME

Validates exact GLOCK and provisional-seal IDs and hashes; object/origin/context/history correspondence; terminal microstate and engine; locked-versus-returned invariant, name, and sequence; `owner_choice_preserved=true`; `RETURNED_WITH_PROVISIONAL_SEAL_PRESERVED`; and the receipt hash.

### Final closure

Validates exact GLOCK, seal, and HOME IDs and hashes; identity correspondence; terminal microstate, engine, and diagnostics hash; final South and West scores; all required final Boolean predicates; `FINAL_CLOSED`; and the receipt hash.

No public Boolean can bypass those checks.

## Conformance

Run:

```bash
python -m unittest -v test_fbk_v3_2.py
```

The suite executes sixteen tests, including all 256 phase classifications, exact phase-count and engine-occupancy reproduction, all 65,536 ordered numeric transitions, inherited strict-edge reproduction, internal `M_score` and `HFnum` derivation, malformed-microstate rejection, terminal derivation from the actual terminal microstate, absence of `receipt_valid` from the lifecycle API, a successful full actual-receipt lifecycle, and tamper/mismatch/skip/HOME-drift/incomplete-chain rejection.

## Boundaries

This closes two implementation trust gaps. It does not yet establish authenticated issuer identity or asymmetric signatures; revocation, expiration, or distributed replay controls; independent mathematical review; empirical calibration of thresholds; autonomous semantic adjudication; observer convergence; domain-specific validity; cross-domain generalization; or universal reachability.
