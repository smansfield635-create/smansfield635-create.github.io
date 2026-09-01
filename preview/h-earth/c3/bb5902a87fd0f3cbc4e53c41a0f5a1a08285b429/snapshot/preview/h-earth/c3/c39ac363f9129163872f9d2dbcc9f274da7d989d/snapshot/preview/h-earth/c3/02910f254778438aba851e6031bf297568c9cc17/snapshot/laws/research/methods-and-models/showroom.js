(() => {
  "use strict";

  const CONTRACT = "METHODS_MODELS_DUAL_AXIS_SHOWROOM_v1";
  const SOURCE_HOLD = "ARCHITECTURE PRESERVED · ORIGINAL CONTROLLING SOURCE UNDER RECOVERY";

  const families = Object.freeze([
    Object.freeze({
      id: "structure",
      label: "Structural Envelope",
      title: "Structural Envelope and Collapse",
      question: "What must be present, saturated, and functionally failed before collapse is qualified?",
      models: Object.freeze([
        Object.freeze({
          id: "envelope-451",
          title: "451 Structural Envelope",
          question: "What belongs to the complete structural measurement envelope?",
          statement: "The full envelope joins burden, pressure, and the required coherence spine without confusing them.",
          equation: "451 = 256 + 192 + 3",
          equationLabel: "The structural envelope",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "A system can be carrying internal burden and external pressure while still depending on three required functions to remain coherent.",
          engineering: "The envelope contains 256 internal burden cells, 192 external pressure channels, and the three-axis E / I / V coherence spine.",
          evidence: "The 451 relation is preserved in the current formula registry and canonical archive. It organizes measurement space; it is not empirical completion.",
          purpose: "Separate the complete structural envelope from the terminal saturation gate and from the independent spine-failure threshold.",
          symbols: ["256 — internal burden-cell lattice", "192 — external pressure-channel shell", "3 — E / I / V noncompensatory coherence spine", "451 — complete structural envelope"],
          architecture: "The three spine axes are included in 451 because they are required structural functions. The admissibility membrane and basin anchors remain separate architectures.",
          operation: "Use 451 to describe the whole declared envelope, not the number of elements that must saturate at the terminal gate.",
          failure: "451 alone does not qualify collapse. Saturation and spine failure are tested separately.",
          limits: "The envelope is a formal architecture. It does not establish that every field is measured, validated, or operationally deployed."
        }),
        Object.freeze({
          id: "gate-448",
          title: "448 Saturation Gate",
          question: "Which components must reach exact saturation before terminal qualification is possible?",
          statement: "The saturation gate excludes the spine because the spine is tested for functional failure, not numerical saturation.",
          equation: "448 = 256 + 192",
          equationLabel: "The terminal saturation gate",
          sourceState: "hold",
          status: "Source hold",
          practical: "A crisis is not qualified merely because one pressure is high. Every declared burden cell and pressure channel must reach the exact gate.",
          engineering: "The gate contains the 256 internal and 192 external saturation components. The three E / I / V axes are evaluated by the separate minimum principle.",
          evidence: SOURCE_HOLD,
          purpose: "Distinguish exact internal-plus-external saturation from the larger 451 structural envelope.",
          symbols: ["448 — exact saturation-gate count", "256 — internal burden components", "192 — external pressure components"],
          architecture: "448 is nested within the 451 architecture but is not interchangeable with it.",
          operation: "Terminal qualification remains impossible until all 448 declared saturation components meet their exact threshold.",
          failure: "A partial or approximate saturation state does not satisfy the gate.",
          limits: "The relationship is user-confirmed and preserved under source hold pending recovery of AUDRALIA_COLLAPSE_ENGINEERING_V1."
        }),
        Object.freeze({
          id: "spine-minimum",
          title: "E / I / V Minimum Principle",
          question: "Can strength in one required function compensate for collapse in another?",
          statement: "Required coherence is governed by the weakest spine axis, not by an average.",
          equation: "W<sub>d</sub> = min(E<sub>d</sub>, I<sub>d</sub>, V<sub>d</sub>)",
          equationLabel: "The noncompensatory spine",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "Apparent strength can be misleading when one part is carrying functions that belong elsewhere.",
          engineering: "The minimum operator prevents unrelated strength from hiding failure in a required E, I, or V axis.",
          evidence: "The minimum principle appears in the controlling cross-domain protocol and collapse predicate.",
          purpose: "Expose functional failure without allowing strong axes to compensate for a collapsed required axis.",
          symbols: ["E — required coherence axis", "I — required coherence axis", "V — required coherence axis", "W — weakest required axis"],
          architecture: "The spine is structurally included in 451 but operationally tested through the minimum function.",
          operation: "Evaluate all three axes and retain the minimum value as the governing spine state.",
          failure: "Spine failure occurs when the minimum required axis reaches or falls below the domain-specific threshold ε.",
          limits: "Domain definitions and ε values must be frozen before empirical execution."
        }),
        Object.freeze({
          id: "collapse-qualified",
          title: "Qualified Collapse Predicate",
          question: "When is collapse formally qualified rather than merely suspected?",
          statement: "Collapse requires simultaneous saturation of burden and pressure plus failure of the weakest required spine axis.",
          equation: "CollapseQualified<sub>d</sub> = (B256<sub>d</sub> ≥ 256) ∧ (P192<sub>d</sub> ≥ 192) ∧ (min(E<sub>d</sub>, I<sub>d</sub>, V<sub>d</sub>) ≤ ε<sub>d</sub>)",
          equationLabel: "The collapse predicate",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "Things can begin breaking down before anyone calls the situation a crisis, but qualification requires all declared conditions.",
          engineering: "The predicate is conjunctive and noncompensatory. Every clause must be true at the same evaluation state.",
          evidence: "The predicate is independently preserved in the Drive master protocol and the current Methods and Models formula registry.",
          purpose: "Prevent elevated burden, elevated pressure, or isolated weakness from being mislabeled as fully qualified collapse.",
          symbols: ["B256 — normalized internal burden", "P192 — normalized external pressure", "ε — domain-specific spine-failure threshold", "∧ — every clause is required"],
          architecture: "The predicate joins the 448 saturation gate to the separate E / I / V failure condition.",
          operation: "Evaluate all clauses at the same time and in the same declared domain realization.",
          failure: "The predicate is false when any burden cell is unsaturated, any pressure channel is unsaturated, or every spine axis remains above ε.",
          limits: "Diagnostic qualification does not by itself establish universal empirical proof, causation, or operational readiness."
        }),
        Object.freeze({
          id: "membrane-61",
          title: "61 Admissibility Membrane",
          question: "What governs entry around the model without being added into its structural total?",
          statement: "Admissibility surrounds the architecture; it is not another component inside 451.",
          equation: "61 ∉ 451",
          equationLabel: "The admissibility membrane",
          sourceState: "hold",
          status: "Source hold",
          practical: "Not everything available should be allowed to enter a diagnosis, comparison, or claim.",
          engineering: "The 61 architecture governs admissibility around the model and must remain distinct from the 451 structural sum.",
          evidence: SOURCE_HOLD,
          purpose: "Preserve the boundary between model structure and the rules that govern what may enter it.",
          symbols: ["61 — admissibility membrane", "∉ — intentionally excluded from the structural sum"],
          architecture: "The membrane surrounds the model as an entry and boundary system.",
          operation: "Apply admissibility before allowing a source, mapping, threshold, or claim to participate.",
          failure: "Entry must be held when the admissibility conditions are not satisfied.",
          limits: "The relationship is preserved under source hold pending recovery of the exact collapse-engineering source package."
        }),
        Object.freeze({
          id: "anchors-9",
          title: "Nine Basin Anchors",
          question: "Which separate anchors organize the basin architecture without changing the collapse total?",
          statement: "The basin anchors orient a separate architecture and are not hidden inside 451.",
          equation: "9 ∉ 451",
          equationLabel: "The separate anchor architecture",
          sourceState: "hold",
          status: "Source hold",
          practical: "Orientation points can organize a field without becoming burden, pressure, or coherence components.",
          engineering: "The nine anchors are explicitly separated from the 451 collapse envelope.",
          evidence: SOURCE_HOLD,
          purpose: "Prevent the basin-anchor architecture from being silently added to the collapse total.",
          symbols: ["9 — basin-anchor architecture", "451 — structural envelope"],
          architecture: "The anchor system is related to the broader project geometry but remains outside the collapse sum.",
          operation: "Use the anchors for their declared basin role only.",
          failure: "The collapse predicate must not change merely because an anchor is present or absent.",
          limits: "Exact original source semantics remain under recovery and must not be expanded beyond the preserved relationship."
        })
      ])
    }),
    Object.freeze({
      id: "pressure",
      label: "Pressure / Capacity",
      title: "Pressure, Capacity, and Stability",
      question: "How does the architecture preserve pressure, usable capacity, stability, and hazard without hiding a zero?",
      models: Object.freeze([
        Object.freeze({
          id: "pressure-field",
          title: "Pressure Field",
          question: "How is the declared pressure field constructed?",
          statement: "Pressure is multiplicative: a missing required pressure term remains visible as zero.",
          equation: "Π = G · X",
          equationLabel: "The pressure field",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "Pressure is not one vague feeling. It is a declared relationship among required terms.",
          engineering: "Current public notation uses X rather than E to avoid collision with the E / I / V spine.",
          evidence: "The Π relation and notation boundary are preserved in the master protocol and current formula registry.",
          purpose: "Construct pressure without silently flooring or renaming a zero term.",
          symbols: ["Π — pressure field", "G — declared pressure factor", "X — declared pressure factor and collision-safe notation"],
          architecture: "Pressure remains distinct from capacity and is allowed to equal zero.",
          operation: "Multiply the declared normalized pressure terms under the zero-aware product discipline.",
          failure: "If any required normalized pressure term is zero, Π remains zero.",
          limits: "The formula does not supply domain mappings or validate a pressure interpretation by itself."
        }),
        Object.freeze({
          id: "capacity-field",
          title: "Usable Capacity",
          question: "What capacity must remain available for the system to respond?",
          statement: "Capacity is a product of required functions; one unavailable factor destroys the composite.",
          equation: "K = P · R · A · C",
          equationLabel: "The usable-capacity product",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "A system may appear well supplied while one indispensable capacity is unavailable.",
          engineering: "The product is explicitly noncompensatory. A strong factor cannot rescue a required factor at zero.",
          evidence: "The K kernel is preserved in the master protocol and Methods and Models registry.",
          purpose: "Represent usable composite capacity without additive compensation.",
          symbols: ["K — usable composite capacity", "P / R / A / C — required capacity factors"],
          architecture: "Every declared factor is necessary to the composite.",
          operation: "Multiply normalized required capacity terms after admission and domain mapping.",
          failure: "Any required capacity factor at zero forces K to zero.",
          limits: "Factor meanings and bounds remain domain-specific and require source custody."
        }),
        Object.freeze({
          id: "pcr",
          title: "Pressure-to-Capacity Ratio",
          question: "How much pressure is acting relative to usable capacity?",
          statement: "The ratio compares pressure with protected usable capacity while preserving the reason a safety floor exists.",
          equation: "PCR = Π / max(K, ε<sub>K</sub>)",
          equationLabel: "The pressure-capacity ratio",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "The same pressure can be manageable in one state and hazardous in another because usable capacity differs.",
          engineering: "K<sub>used</sub> = max(K, ε<sub>K</sub>) protects division. SAFE_MODE is triggered by K ≤ ε<sub>K</sub>, not by PCR alone.",
          evidence: "The ratio, safety floor, and SAFE_MODE notation boundary are source-confirmed.",
          purpose: "Compare pressure with capacity without creating an undefined division state.",
          symbols: ["PCR — pressure-to-capacity ratio", "K_used — protected denominator", "ε_K — capacity safety floor"],
          architecture: "The floor protects computation but does not erase the underlying capacity collapse state.",
          operation: "Calculate pressure over protected capacity and separately retain whether SAFE_MODE was triggered.",
          failure: "A small protected denominator can produce a high ratio, but the ratio is not itself the SAFE_MODE trigger.",
          limits: "PCR is a diagnostic index, not proof of collapse, causation, or universal transfer."
        }),
        Object.freeze({
          id: "stability",
          title: "Stability Complement",
          question: "How is the pressure-capacity relationship mapped into bounded stability?",
          statement: "Stability decreases continuously as the pressure-capacity ratio rises.",
          equation: "S<sup>*</sup> = 1 / (1 + PCR)",
          equationLabel: "The stability complement",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "Stability is treated as remaining room to absorb pressure, not as a vague declaration of strength.",
          engineering: "The transform maps nonnegative PCR into a bounded [0,1] stability quantity.",
          evidence: "The S* transform is preserved in the controlling kernel.",
          purpose: "Provide a bounded stability representation tied directly to PCR.",
          symbols: ["S* — normalized stability mass", "PCR — pressure-to-capacity ratio"],
          architecture: "S* is complementary to H* and shares the same denominator.",
          operation: "Apply the bounded reciprocal transform after PCR is calculated.",
          failure: "As PCR grows without bound, S* approaches zero.",
          limits: "A bounded score does not establish empirical calibration or clinical meaning."
        }),
        Object.freeze({
          id: "hazard",
          title: "Hazard Complement",
          question: "How is the same relationship expressed as collapse-pressure mass?",
          statement: "Hazard rises from the same pressure-capacity relationship that reduces stability.",
          equation: "H<sup>*</sup> = PCR / (1 + PCR)",
          equationLabel: "The hazard complement",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "Hazard and stability are two readings of one declared relationship, not two unrelated scores.",
          engineering: "The transform maps nonnegative PCR into a bounded [0,1] hazard quantity.",
          evidence: "The H* transform is preserved in the controlling kernel.",
          purpose: "Express normalized collapse-pressure mass without changing the underlying PCR architecture.",
          symbols: ["H* — normalized hazard mass", "PCR — pressure-to-capacity ratio"],
          architecture: "H* is complementary to S*.",
          operation: "Apply the bounded ratio transform after PCR is calculated.",
          failure: "As PCR grows without bound, H* approaches one.",
          limits: "H* is not an independently validated probability of failure."
        }),
        Object.freeze({
          id: "complement",
          title: "Stability–Hazard Identity",
          question: "How do the two bounded outputs remain mathematically accountable to each other?",
          statement: "The two outputs partition one declared mass rather than creating extra information.",
          equation: "S<sup>*</sup> + H<sup>*</sup> = 1",
          equationLabel: "The complementary identity",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "Calling one side stability and the other hazard does not allow either side to exceed the whole.",
          engineering: "Both transforms use the same denominator and sum exactly to one.",
          evidence: "The identity is explicitly preserved in the controlling kernel.",
          purpose: "Keep stability and hazard algebraically linked and auditable.",
          symbols: ["S* — stability complement", "H* — hazard complement", "1 — conserved normalized total"],
          architecture: "The identity prevents the two outputs from being interpreted as independent masses.",
          operation: "Verify the complement identity as a calculation invariant.",
          failure: "A result where S* + H* differs materially from one indicates an implementation or precision defect.",
          limits: "The identity validates arithmetic consistency, not empirical validity."
        }),
        Object.freeze({
          id: "zero-aware",
          title: "Zero-Aware Multiplication",
          question: "What happens when logarithmic aggregation encounters a required zero?",
          statement: "A required zero is preserved as collapse; it is never silently dropped to keep the product alive.",
          equation: "0 in required terms ⇒ product = 0",
          equationLabel: "The zero discipline",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "Missing or collapsed capacity cannot be disguised by averaging it with unrelated strengths.",
          engineering: "Nonzero products may use exp(sum(ln(value))), but zero terms are intercepted and preserved before logarithmic aggregation.",
          evidence: "The zero-aware discipline is one of the ten Methods and Models canonical records.",
          purpose: "Protect noncompensatory meaning during stable numerical implementation.",
          symbols: ["0 — required collapse state", "EXP(SUM(LN(value))) — stable nonzero product implementation"],
          architecture: "Pressure and capacity retain separate zero behavior.",
          operation: "Check for zero first; only aggregate logarithms when every required term is positive.",
          failure: "Dropping a zero falsely preserves pressure or capacity and invalidates the diagnostic.",
          limits: "Numerical stability does not authorize changing the model's declared zero semantics."
        })
      ])
    }),
    Object.freeze({
      id: "closure",
      label: "Closure / Flow",
      title: "Closure and System Flow",
      question: "How are material, energy, recovery, and unresolved residuals kept accountable?",
      models: Object.freeze([
        Object.freeze({
          id: "mass-ledger",
          title: "Industrial Closure Equation",
          question: "Where did every admitted unit of material go?",
          statement: "A closure claim must reconcile input, output, destruction, inventory change, and uncertainty.",
          equation: "M<sub>in</sub> = M<sub>out</sub> + M<sub>dest</sub> + ΔM<sub>inv</sub> ± ε",
          equationLabel: "The mass ledger",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "A compliance statement is not enough when hazardous mass remains unaccounted for.",
          engineering: "Every admitted input must be assigned to output, verified destruction, inventory change, or declared uncertainty.",
          evidence: "The Industrial Closure Equation is preserved as a canonical Methods and Models record.",
          purpose: "Convert closure from rhetoric into an auditable mass balance.",
          symbols: ["M_in — admitted mass input", "M_out — measured output", "M_dest — verified destruction", "ΔM_inv — inventory change", "ε — declared uncertainty"],
          architecture: "The ledger distinguishes disposition from disappearance.",
          operation: "Measure every declared term under a common basis and uncertainty convention.",
          failure: "Unaccounted mass remains as a residual rather than being assigned to closure by assertion.",
          limits: "The equation does not prove a destruction technology or measurement system performs as claimed."
        }),
        Object.freeze({
          id: "residual-u",
          title: "Unaccounted Residual",
          question: "How much admitted mass remains unresolved after the ledger is assembled?",
          statement: "The unresolved residual is measured directly instead of hidden inside a closure label.",
          equation: "U = M<sub>in</sub> − (M<sub>out</sub> + M<sub>dest</sub> + ΔM<sub>inv</sub>)",
          equationLabel: "The residual",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "What cannot be accounted for remains an open question, not an automatic success.",
          engineering: "U preserves the exact imbalance after measured dispositions are removed from admitted input.",
          evidence: "The residual equation is part of the Industrial Closure canonical record.",
          purpose: "Expose unresolved hazardous mass as a measurable quantity.",
          symbols: ["U — unaccounted residual", "M terms — common-basis ledger quantities"],
          architecture: "The residual is the decision variable for closure status.",
          operation: "Calculate U after all admitted ledger terms are frozen.",
          failure: "A large absolute residual indicates that the ledger remains open.",
          limits: "The residual inherits every measurement and custody limitation in its component terms."
        }),
        Object.freeze({
          id: "closure-threshold",
          title: "Closure Threshold",
          question: "When is a residual small enough to classify the ledger as closed?",
          statement: "Closure is bounded by declared uncertainty rather than by a perfect-zero fiction.",
          equation: "Closed if |U| ≤ 3ε · Open if |U| > 3ε",
          equationLabel: "The closure decision",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "A tiny difference within declared measurement uncertainty is not treated the same as a material unresolved loss.",
          engineering: "The classification compares the absolute residual with three times the declared uncertainty.",
          evidence: "The threshold is preserved in the Industrial Closure canonical record.",
          purpose: "Create a transparent and falsifiable closure decision rule.",
          symbols: ["|U| — absolute unresolved residual", "3ε — declared closure tolerance"],
          architecture: "The decision follows the ledger; it does not replace it.",
          operation: "Freeze ε before evaluating closure and preserve both the residual and classification.",
          failure: "The ledger is open when |U| exceeds 3ε.",
          limits: "The threshold must be justified for the domain and does not excuse poor measurement."
        }),
        Object.freeze({
          id: "energy-loop",
          title: "Energy Loop Law",
          question: "Does the system return useful energy and resources to a state from which operation can continue?",
          statement: "A complete loop includes storage, release, operation, recovery, and return to storage.",
          equation: "Storage → Release → Operate → Recover → Storage",
          equationLabel: "The loop sequence",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "A process is not circular merely because one stage can be repeated.",
          engineering: "The declared loop requires every transition and the return state, including recovery and reset obligations.",
          evidence: "The Energy Loop Law is preserved as a canonical Methods and Models record.",
          purpose: "Distinguish a complete operating loop from a partial sequence.",
          symbols: ["Storage — available initial state", "Release — controlled energy delivery", "Operate — useful action", "Recover — recapture and reset", "Storage — restored return state"],
          architecture: "The sequence is directional and cyclic; omission of recovery prevents closure.",
          operation: "Trace energy and reset obligations through every declared transition.",
          failure: "A loop remains open when energy, material, or reset obligations cannot return to the declared storage state.",
          limits: "A formal loop architecture is not final empirical validation of an energy system."
        }),
        Object.freeze({
          id: "useful-output",
          title: "Useful Output Condition",
          question: "Does the useful output cover input, losses, and the cost of returning the system to readiness?",
          statement: "Reset costs belong inside the comparison; they cannot be externalized to make the loop appear productive.",
          equation: "Useful_Output ≥ Total_Input + Losses + Reset_Costs",
          equationLabel: "The output condition",
          sourceState: "confirmed",
          status: "Source confirmed",
          practical: "A process that works once but cannot afford to reset is not a sustained closed loop.",
          engineering: "The comparison includes total input, operating losses, and reset costs under one declared accounting basis.",
          evidence: "The condition is preserved with the Energy Loop Law canonical record.",
          purpose: "Prevent partial accounting from being presented as a closed productive loop.",
          symbols: ["Useful_Output — admitted useful return", "Total_Input — total admitted input", "Losses — declared losses", "Reset_Costs — cost to restore readiness"],
          architecture: "The condition is evaluated across the full loop, not one favored stage.",
          operation: "Measure all terms over the same interval and boundary.",
          failure: "The condition fails when useful output cannot cover the complete declared cost of operation and reset.",
          limits: "The inequality does not choose a technology, establish economic viability, or validate field performance."
        })
      ])
    }),
    Object.freeze({
      id: "method",
      label: "Method / Falsification",
      title: "Method, Resolution, and Falsification",
      question: "How are claims constructed, classified, challenged, and recorded without changing their evidence standing?",
      models: Object.freeze([
        Object.freeze({
          id: "first",
          title: "F.I.R.S.T. Research Method",
          question: "Which questions must be answered before a conclusion is accepted?",
          statement: "Research asks what changed, what remained intact, what evidence shows, what shaped the result, and what was tested.",
          equation: "Flow → Integrity → Reality → Structure → Test",
          equationLabel: "The governing research sequence",
          sourceState: "confirmed",
          status: "Page-native method",
          practical: "The sequence keeps a conclusion from outrunning the observations, boundaries, and tests that support it.",
          engineering: "Each lens preserves a distinct question and routes to its own authority rather than being flattened into one score.",
          evidence: "F.I.R.S.T. is the governing Laws research architecture. It organizes inquiry; it is not itself an empirical result.",
          purpose: "Provide a repeatable orientation for examining change, continuity, evidence, conditions, and execution.",
          symbols: ["F — Flow", "I — Integrity", "R — Reality", "S — Structure", "T — Test"],
          architecture: "The sequence remains connected to the Laws Compass and Research custody.",
          operation: "Apply each question explicitly and preserve unresolved answers.",
          failure: "A conclusion is held when one required question cannot be answered or is contradicted by the record.",
          limits: "The acronym organizes research; it does not validate a model by presentation."
        }),
        Object.freeze({
          id: "integral-method",
          title: "Integral Scientific Method",
          question: "How is a claim reduced until contradiction can no longer be defended as an answer?",
          statement: "Observe, reduce, falsify, iterate, terminate, and compress without granting certainty to survival alone.",
          equation: "Observe → Reduce → Falsify → Iterate → Terminate → Compress",
          equationLabel: "The disciplined inquiry chain",
          sourceState: "confirmed",
          status: "Method specification",
          practical: "A claim is allowed to collapse cleanly instead of being protected by explanation after explanation.",
          engineering: "The recovered sequence includes Observe, Hypothesize, Reduce (1–2–3), Falsify, Iterate (9-to-5), Terminate, and Compress (11–13).",
          evidence: "The source class is METHOD_SPECIFICATION. The recovered source contains method PDFs, not a validation study.",
          purpose: "Constrain inquiry so objectivity is not abandoned to preserve a favored claim.",
          symbols: ["1–2–3 — reduction discipline", "9-to-5 — ordinary repeated iteration", "11–13 — compression and consolidation"],
          architecture: "Every stage narrows the permissible interpretation of the next.",
          operation: "Record observations, state a reducible claim, test contradiction, iterate ordinary work, stop at the objectivity boundary, and consolidate invariants.",
          failure: "The process terminates when continuation requires violating objectivity.",
          limits: "Method custody does not establish replication, scientific acceptance, or empirical validation."
        }),
        Object.freeze({
          id: "diagnostic-five",
          title: "Five-Diagnostic Classification Set",
          question: "Which fixed diagnostic lenses must be applied without weighting or post-hoc tuning?",
          statement: "Five named diagnostics preserve different forms of alignment, transparency, fragmentation, internal coherence, and trajectory.",
          equation: "C.A.D. · C.T.D. · C.F.D. · I.M.D. · T.D.",
          equationLabel: "The fixed diagnostic set",
          sourceState: "confirmed",
          status: "Frozen registration",
          practical: "A classification is more accountable when the questions are named before the answer is known.",
          engineering: "The set contains Constraint Alignment, Constraint Transparency, Constraint Fragmentation, Internal Misalignment, and Trajectory diagnostics.",
          evidence: "The registration is custody, not validation. Independent observer convergence remains the declared standard.",
          purpose: "Apply predefined diagnostic rules uniformly without weighting, tuning, or post-hoc adjustment.",
          symbols: ["C.A.D. — Constraint Alignment", "C.T.D. — Constraint Transparency", "C.F.D. — Constraint Fragmentation", "I.M.D. — Internal Misalignment", "T.D. — Trajectory"],
          architecture: "The diagnostics remain separate and feed a bounded classification rather than a universal score.",
          operation: "Apply every diagnostic under the frozen rules and preserve disagreements.",
          failure: "The method is not reliable when independent observers cannot converge under the same evidence.",
          limits: "Registration and files reviewed do not establish empirical validation."
        }),
        Object.freeze({
          id: "abcd",
          title: "A–B–C–D Diagnostic Procedure",
          question: "What sequence prevents a diagnosis from skipping directly to trajectory?",
          statement: "Each letter constrains the next; skipping a stage invalidates the diagnosis.",
          equation: "A → B → C → D",
          equationLabel: "The ordered diagnostic",
          sourceState: "confirmed",
          status: "Procedure only",
          practical: "A situation should not be labeled by where it seems headed before its internal coherence and constraints are inspected.",
          engineering: "A = Internal Coherence; B = Constraint Alignment; C = Fragmentation Under Load; D = Trajectory.",
          evidence: "The recovered source admits the procedure as a method and explicitly limits the output to diagnostic classification.",
          purpose: "Force ordered examination before assigning a trajectory classification.",
          symbols: ["A — Internal Coherence", "B — Constraint Alignment", "C — Fragmentation Under Load", "D — Trajectory"],
          architecture: "The sequence is ordinal and non-skippable.",
          operation: "Complete and preserve each stage before moving to the next.",
          failure: "Skipping a stage invalidates the diagnosis.",
          limits: "The output is not prediction, prescription, causation, blame, or domain-specific interpretation."
        }),
        Object.freeze({
          id: "falsification",
          title: "Formal Falsification Path",
          question: "How is a model made easy to disprove under strong conditions?",
          statement: "Define the state, measure maneuverability, freeze the lead window, score narrowing, and compare against failure timestamps.",
          equation: "Define → Measure → Freeze → Score → Compare",
          equationLabel: "The falsification path",
          sourceState: "confirmed",
          status: "Protocol without results",
          practical: "A serious claim states what evidence would force revision or withdrawal.",
          engineering: "Required outputs include protocols, scoring rubrics, datasets, false-positive and false-negative rates, and public revision if falsified.",
          evidence: "The recovered source contains the protocol, not the executed datasets or results.",
          purpose: "Expose trajectory-narrowing claims to explicit disconfirmation.",
          symbols: ["State variables and constraints", "Maneuverability metric", "Lead-time window", "Failure timestamp comparison"],
          architecture: "The test target remains separate from execution evidence.",
          operation: "Freeze every measurement and comparison rule before touching the held-out outcome.",
          failure: "The claim fails when narrowing does not precede failure, produces unacceptable errors, or disappears under strong comparators.",
          limits: "A protocol is not an empirical result."
        }),
        Object.freeze({
          id: "no-match",
          title: "No-Match Discipline",
          question: "What happens when evidence does not satisfy the model's admission conditions?",
          statement: "Evidence is held with an explicit reason instead of being forced into an applicable slot.",
          equation: "No match ⇒ no consumption",
          equationLabel: "The resolver boundary",
          sourceState: "confirmed",
          status: "Canonical method",
          practical: "A missing or incompatible record should remain unresolved rather than being made to fit.",
          engineering: "Missing cycle data, exceeded cycle limits, model mismatch, or capacity-basis mismatch prevent consumption of the warranty floor.",
          evidence: "No-Match Discipline is one of the ten assigned Methods and Models canonical records.",
          purpose: "Protect the resolver and downstream claims from forced applicability.",
          symbols: ["No match — explicit non-consumable state", "Reason code — preserved explanation"],
          architecture: "The non-match state is a valid output, not an error to hide.",
          operation: "Evaluate matching predicates before consuming evidence or calculating an applicable result.",
          failure: "Forced matching invalidates provenance and applicability.",
          limits: "A no-match result does not determine the real-world condition of the subject."
        }),
        Object.freeze({
          id: "fixtures",
          title: "Synthetic Fixtures",
          question: "What may be proven by constructed test cases?",
          statement: "Fixtures verify expected contract behavior; they do not become field evidence.",
          equation: "Fixture pass ≠ empirical validation",
          equationLabel: "The fixture boundary",
          sourceState: "confirmed",
          status: "Contract test",
          practical: "A model behaving correctly on examples we constructed is not the same as succeeding in the world.",
          engineering: "Fixtures cover pass, fail, and non-consumable resolver states under known inputs and expected outputs.",
          evidence: "Synthetic Fixtures is one of the ten assigned Methods and Models canonical records.",
          purpose: "Verify deterministic resolver and output-contract behavior.",
          symbols: ["Fixture — constructed input", "Expected output — declared contract result", "Empirical evidence — independently observed data"],
          architecture: "Synthetic and empirical evidence remain distinct evidence classes.",
          operation: "Run deterministic fixtures against the frozen contract and preserve every mismatch.",
          failure: "A fixture failure identifies a contract or implementation defect.",
          limits: "Fixture success is not real telemetry, external replication, or empirical validation."
        })
      ])
    })
  ]);

  const root = document.querySelector("[data-mm-showroom]");
  if (!root) return;

  const elements = {
    familyTabs: root.querySelector("[data-mm-family-tabs]"),
    familyTitle: root.querySelector("[data-mm-family-title]"),
    familyQuestion: root.querySelector("[data-mm-family-question]"),
    deck: root.querySelector("[data-mm-model-deck]"),
    previous: root.querySelector("[data-mm-previous]"),
    next: root.querySelector("[data-mm-next]"),
    progress: root.querySelector("[data-mm-progress]"),
    lensTabs: Array.from(root.querySelectorAll("[data-mm-lens-tab]")),
    lensPanel: root.querySelector("[data-mm-lens-panel]"),
    dialog: document.querySelector("[data-mm-dialog]"),
    dialogClose: document.querySelector("[data-mm-dialog-close]"),
    dialogTitle: document.querySelector("[data-mm-dialog-title]"),
    dialogKicker: document.querySelector("[data-mm-dialog-kicker]"),
    dialogEquation: document.querySelector("[data-mm-dialog-equation]"),
    dialogGrid: document.querySelector("[data-mm-dialog-grid]")
  };

  const state = {
    familyIndex: 0,
    modelIndices: families.map(() => 0),
    lens: "practical",
    restoreFocus: null,
    pointerStartX: null
  };

  const normalize = (value, length) => ((value % length) + length) % length;
  const activeFamily = () => families[state.familyIndex];
  const activeModelIndex = () => state.modelIndices[state.familyIndex];
  const activeModel = () => activeFamily().models[activeModelIndex()];
  const sourceLabel = model => model.sourceState === "hold" ? "Architecture preserved under source hold" : model.status;

  function publish(source) {
    const family = activeFamily();
    const model = activeModel();
    root.dataset.mmFamily = family.id;
    root.dataset.mmModel = model.id;
    document.body.dataset.mmFamily = family.id;
    globalThis.dispatchEvent(new CustomEvent("METHODS_MODELS_SHOWROOM_CHANGED", {
      detail: Object.freeze({
        contract: CONTRACT,
        source,
        familyId: family.id,
        familyIndex: state.familyIndex,
        modelId: model.id,
        modelIndex: activeModelIndex(),
        sourceCompletenessClaimed: false,
        productAcceptanceGranted: false
      })
    }));
  }

  function updateHash() {
    const family = activeFamily();
    const model = activeModel();
    history.replaceState(history.state, "", `#${family.id}-${model.id}`);
  }

  function relativePosition(index, active, length) {
    const forward = normalize(index - active, length);
    const backward = normalize(active - index, length);
    if (forward === 0) return "active";
    if (forward === 1) return "next";
    if (backward === 1) return "previous";
    return "far";
  }

  function renderFamilyTabs() {
    elements.familyTabs.replaceChildren(...families.map((family, index) => {
      const button = document.createElement("button");
      button.className = "mm-family-tab";
      button.type = "button";
      button.role = "tab";
      button.id = `mm-family-tab-${family.id}`;
      button.dataset.familyIndex = String(index);
      button.setAttribute("aria-selected", String(index === state.familyIndex));
      button.tabIndex = index === state.familyIndex ? 0 : -1;
      button.textContent = family.label;
      return button;
    }));
  }

  function modelCard(model, index, family) {
    const article = document.createElement("article");
    const position = relativePosition(index, activeModelIndex(), family.models.length);
    article.className = "mm-model-card";
    article.dataset.position = position;
    article.dataset.modelId = model.id;
    article.setAttribute("aria-hidden", String(position !== "active"));
    if ("inert" in article) article.inert = position !== "active";
    else if (position !== "active") article.setAttribute("inert", "");

    const statusState = model.sourceState === "hold" ? "hold" : "confirmed";
    article.innerHTML = `
      <div class="mm-model-card__meta">
        <span class="mm-model-card__index">${String(index + 1).padStart(2, "0")} / ${String(family.models.length).padStart(2, "0")}</span>
        <span class="mm-model-card__status" data-source-state="${statusState}">${sourceLabel(model)}</span>
      </div>
      <h3 class="mm-model-card__statement">${model.statement}</h3>
      <div class="mm-equation-theatre">
        <span class="mm-equation-theatre__label">${model.equationLabel}</span>
        <div class="mm-equation">${model.equation}</div>
      </div>
      <div class="mm-model-card__footer">
        <button class="mm-inspect" type="button" data-mm-inspect="${model.id}">Inspect model</button>
        <p class="mm-model-card__question">${model.question}</p>
      </div>`;
    return article;
  }

  function renderLens() {
    const model = activeModel();
    elements.lensTabs.forEach(button => {
      const selected = button.dataset.mmLensTab === state.lens;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    elements.lensPanel.textContent = model[state.lens];
  }

  function render(source = "render") {
    const family = activeFamily();
    const modelIndex = activeModelIndex();
    elements.familyTitle.textContent = family.title;
    elements.familyQuestion.textContent = family.question;
    elements.deck.replaceChildren(...family.models.map((model, index) => modelCard(model, index, family)));
    elements.progress.textContent = `${family.label} · Model ${modelIndex + 1} of ${family.models.length}`;
    renderFamilyTabs();
    renderLens();
    updateHash();
    publish(source);
  }

  function setFamily(index, source = "family", focus = false) {
    state.familyIndex = normalize(index, families.length);
    state.lens = "practical";
    render(source);
    if (focus) elements.familyTabs.querySelector(`[data-family-index="${state.familyIndex}"]`)?.focus({ preventScroll: true });
  }

  function setModel(index, source = "model") {
    const family = activeFamily();
    state.modelIndices[state.familyIndex] = normalize(index, family.models.length);
    state.lens = "practical";
    render(source);
  }

  function moveModel(delta, source) {
    setModel(activeModelIndex() + delta, source);
  }

  function dialogSection(title, body, list = null) {
    const section = document.createElement("section");
    section.className = "mm-dialog__section";
    const heading = document.createElement("h3");
    heading.textContent = title;
    section.append(heading);
    if (body) {
      const paragraph = document.createElement("p");
      paragraph.textContent = body;
      section.append(paragraph);
    }
    if (list?.length) {
      const ul = document.createElement("ul");
      list.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.append(li);
      });
      section.append(ul);
    }
    return section;
  }

  function openDialog(trigger) {
    const model = activeModel();
    state.restoreFocus = trigger;
    elements.dialogKicker.textContent = `${activeFamily().title} · ${sourceLabel(model)}`;
    elements.dialogTitle.textContent = model.title;
    elements.dialogEquation.innerHTML = `<span class="mm-equation-theatre__label">${model.equationLabel}</span><div class="mm-equation">${model.equation}</div>`;
    elements.dialogGrid.replaceChildren(
      dialogSection("Purpose", model.purpose),
      dialogSection("Symbols", "", model.symbols),
      dialogSection("Architecture", model.architecture),
      dialogSection("Operation", model.operation),
      dialogSection("Failure behavior", model.failure),
      dialogSection("Evidence standing", model.evidence),
      dialogSection("Limits", model.limits)
    );
    elements.dialog.showModal();
    elements.dialogClose.focus();
  }

  function closeDialog() {
    if (elements.dialog.open) elements.dialog.close();
  }

  elements.familyTabs.addEventListener("click", event => {
    const button = event.target.closest("[data-family-index]");
    if (!button) return;
    setFamily(Number(button.dataset.familyIndex), "family-click");
  });

  elements.familyTabs.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? families.length - 1 : state.familyIndex + (event.key === "ArrowRight" ? 1 : -1);
    setFamily(next, "family-keyboard", true);
  });

  elements.previous.addEventListener("click", () => moveModel(-1, "previous-control"));
  elements.next.addEventListener("click", () => moveModel(1, "next-control"));

  elements.deck.addEventListener("click", event => {
    const inspect = event.target.closest("[data-mm-inspect]");
    if (inspect) openDialog(inspect);
  });

  elements.deck.addEventListener("keydown", event => {
    if (elements.dialog.open) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveModel(event.key === "ArrowRight" ? 1 : -1, "deck-keyboard");
    }
  });

  elements.deck.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    state.pointerStartX = event.clientX;
  });
  elements.deck.addEventListener("pointerup", event => {
    if (state.pointerStartX == null) return;
    const delta = event.clientX - state.pointerStartX;
    state.pointerStartX = null;
    if (Math.abs(delta) < 44) return;
    moveModel(delta < 0 ? 1 : -1, "deck-swipe");
  });
  elements.deck.addEventListener("pointercancel", () => { state.pointerStartX = null; });

  elements.lensTabs.forEach((button, index) => {
    button.addEventListener("click", () => {
      state.lens = button.dataset.mmLensTab;
      renderLens();
    });
    button.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const targetIndex = event.key === "Home" ? 0 : event.key === "End" ? elements.lensTabs.length - 1 : normalize(index + (event.key === "ArrowRight" ? 1 : -1), elements.lensTabs.length);
      const target = elements.lensTabs[targetIndex];
      state.lens = target.dataset.mmLensTab;
      renderLens();
      target.focus();
    });
  });

  elements.dialogClose.addEventListener("click", closeDialog);
  elements.dialog.addEventListener("close", () => {
    state.restoreFocus?.focus({ preventScroll: true });
    state.restoreFocus = null;
  });

  function hydrateFromHash() {
    const token = location.hash.slice(1);
    if (!token) return;
    families.some((family, familyIndex) => {
      const modelIndex = family.models.findIndex(model => token === `${family.id}-${model.id}`);
      if (modelIndex < 0) return false;
      state.familyIndex = familyIndex;
      state.modelIndices[familyIndex] = modelIndex;
      return true;
    });
  }

  hydrateFromHash();
  render("initialization");
  document.documentElement.dataset.methodsModelsShowroom = "active";
})();
