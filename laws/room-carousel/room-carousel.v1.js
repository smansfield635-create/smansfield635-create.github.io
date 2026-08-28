(() => {
  "use strict";

  const CONTRACT = "LAWS_METHODS_REFERENCE_FAMILY_ARCHITECTURE_v5_SEMANTIC";
  const REFERENCE = "METHODS_AND_MODELS_PROGRESSIVE_CARD_ARCHITECTURE_BYTE_FROZEN";
  const SEMANTIC_CONTRACT = "LAWS_DISTINCT_READING_SEMANTICS_v1";
  const CLASSIFY_PX = 8;
  const COMMIT_PX = 24;
  const AXIS_RATIO = 1.12;
  const DEPTHS = Object.freeze([["practical", "Reading"], ["engineering", "Engineering"], ["empirical", "Evidence"]]);
  const scriptSource = document.currentScript?.src || "/laws/room-carousel/room-carousel.v1.js";
  const mapUrl = new URL("./route-card-map.v2.json", scriptSource).href;

  document.documentElement.classList.add("lr-js");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const wrap = (value, count) => ((value % count) + count) % count;
  const slug = value => String(value || "subject").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "subject";
  const textOf = node => node?.textContent?.replace(/\s+/g, " ").trim() || "";
  const escapeHtml = value => String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const sentences = value => String(value || "").trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(part => part.trim()).filter(Boolean) || [];
  const withoutTerminal = value => String(value || "").replace(/[.?!]+$/, "").trim();
  const normalized = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const tokens = value => new Set(normalized(value).split(/\s+/).filter(token => token.length > 2));
  const similarity = (a,b) => {
    const aa = tokens(a), bb = tokens(b);
    if (!aa.size || !bb.size) return 0;
    let shared = 0;
    aa.forEach(token => { if (bb.has(token)) shared += 1; });
    return shared / Math.max(aa.size,bb.size);
  };

  const SEMANTIC_RULES = Object.freeze([
    { re:/\b(sampling point|sample point|observation point)\b/i, lead:(s,m)=>`${s} fixes where in the ${m} path a measurement is taken. It distinguishes the physical or logical observation location from the event that produced the signal and from when the reading was recorded.`, why:(s,m)=>`Changing the ${s.toLowerCase()} can change the value even when the underlying ${m} event is unchanged, so the observation location must be explicit before readings are compared.`, engineering:(s,m)=>`Bind ${s} to the exact sensor, interface, node, coordinate, or pipeline stage at which ${m} is observed, including any transformation applied before that point.`, evidence:(s,m)=>`Use records that identify the same ${s.toLowerCase()} for compared ${m} observations and show that the value was acquired at that declared location rather than inferred downstream.`, failure:(s)=>`${s} fails when measurements from different observation locations are treated as equivalent or when the acquisition point cannot be reproduced.`, limits:(s,m)=>`${s} establishes observation location for ${m}; it does not establish event time, source identity, causation, or receiver interpretation.` },
    { re:/\b(timestamp|time stamp|recorded time|observation time)\b/i, lead:(s,m)=>`${s} fixes when the ${m} observation belongs in the sequence. It establishes temporal identity and ordering rather than the place where the measurement was taken.`, why:(s,m)=>`Without a trustworthy ${s.toLowerCase()}, ${m} readings can be compared out of order, paired with the wrong source state, or assigned to the wrong delay window.`, engineering:(s,m)=>`Bind ${s} to a declared clock source, timezone or epoch, precision, and capture rule for ${m}; preserve both event time and observation time when they can differ.`, evidence:(s,m)=>`Use synchronized or traceable time records showing when the ${m} observation was captured and, where relevant, the latency between source event and recorded observation.`, failure:(s)=>`${s} fails when clocks drift, timezone or epoch is ambiguous, precision is insufficient for the decision window, or receipt time is mistaken for event time.`, limits:(s,m)=>`${s} establishes temporal placement for ${m}; it does not establish the sampling location, the source condition, or why the event occurred.` },
    { re:/\b(specify transport|transport path|transport route|transport medium)\b/i, lead:(s,m)=>`${s} defines how the ${m} trace is carried from source toward receiver. It identifies the medium, route, interfaces, and transformations that make movement possible rather than measuring how long that movement takes.`, why:(s,m)=>`Two ${m} readings can have similar delay but travel through different paths with different loss, distortion, or custody risks. Naming ${s.toLowerCase()} keeps route identity separate from timing.`, engineering:(s,m)=>`Bind ${s} to the concrete ${m} channel: medium or protocol, origin and destination interfaces, routing stages, encoding or conversion points, and the conditions under which the path is considered intact.`, evidence:(s,m)=>`Use route traces, send/receive records, interface logs, or channel receipts that demonstrate the ${m} signal traversed the declared path and transformations.`, failure:(s)=>`${s} fails when the path is inferred from arrival alone, when alternate routes are silently mixed, or when an undocumented transformation changes the carried value.`, limits:(s,m)=>`${s} establishes the path used to carry ${m}; it does not by itself establish transit delay, successful reception, signal quality, or causal meaning.` },
    { re:/\b(specify latency|latency|transit delay|delay window)\b/i, lead:(s,m)=>`${s} measures elapsed time across the ${m} path. It asks how long the trace takes to move between declared boundaries, not which route or medium carries it.`, why:(s,m)=>`A ${m} signal can arrive intact yet too late for the decision it is meant to support. ${s} must therefore be measured independently from route identity and missingness.`, engineering:(s,m)=>`Bind ${s} to paired boundary timestamps, a declared clock basis, start and end events, units, and where relevant the distribution of delay and jitter across repeated ${m} transmissions.`, evidence:(s,m)=>`Use synchronized send/receive timestamps or trace events that permit independent calculation of ${s.toLowerCase()} for the same ${m} transmission.`, failure:(s)=>`${s} fails when clock skew is counted as transit time, receipt time is substituted for the wrong boundary, or missing events are treated as long delays.`, limits:(s,m)=>`${s} establishes elapsed transport time for ${m}; it does not establish the route taken, whether missing observations were lost, or whether the received value remained undistorted.` },
    { re:/\b(specify missingness|missingness|missing data|non-arrival|absence)\b/i, lead:(s,m)=>`${s} identifies an expected ${m} observation that is absent. It distinguishes non-observation from a valid zero, low value, clipped value, or delayed arrival.`, why:(s,m)=>`An absent ${m} record cannot safely be interpreted as a measured state. ${s} must be explicit so loss, censoring, non-capture, and true values are not collapsed into the same outcome.`, engineering:(s,m)=>`Bind ${s} to the expected observation identity, sequence or time slot, the point where absence is detected, a missing-data indicator, and the known loss or censoring mechanism when available.`, evidence:(s,m)=>`Use expected-versus-received identifiers, sequence gaps, acquisition logs, or custody records showing that a ${m} observation should exist but was not captured or received.`, failure:(s)=>`${s} fails when absence is imputed as an observed value, when late data is counted as missing without the declared window, or when different missingness mechanisms are treated as equivalent.`, limits:(s,m)=>`${s} establishes absence of an expected ${m} observation; it does not establish the magnitude of a present signal, clipping, saturation, transport latency, or causal reason for the loss.` },
    { re:/\b(specify saturation|saturation|clipping|dynamic range|ceiling|floor)\b/i, lead:(s,m)=>`${s} identifies a present ${m} reading that has reached the measurement or channel boundary. The observation exists, but its reported magnitude no longer tracks the underlying signal beyond the representable range.`, why:(s,m)=>`A saturated ${m} reading is not missing: it contains boundary information but loses magnitude detail. Treating it as an ordinary value can understate extremes and distort comparisons.`, engineering:(s,m)=>`Bind ${s} to the sensor or channel dynamic range, upper and lower clipping thresholds, nonlinear response near the boundary, and any saturation flag or overflow behavior used by ${m}.`, evidence:(s,m)=>`Use repeated capped maximum or minimum readings, device or channel range specifications, saturation flags, or an independent reference showing the underlying ${m} signal exceeded the representable range.`, failure:(s)=>`${s} fails when a clipped boundary value is treated as the true magnitude, when a range limit is undocumented, or when absent observations are misclassified as saturation.`, limits:(s,m)=>`${s} establishes range-limited distortion of a present ${m} observation; it does not establish missingness, route loss, transit delay, or the true magnitude beyond the clipping boundary.` },
    { re:/\b(fix the observation process|observation process|measurement process|acquisition process)\b/i, lead:(s,m)=>`${s} defines how raw ${m} observations are acquired before any analytic feature is built. It fixes the instrument or observer, sampling protocol, capture conditions, and repeatable procedure that turns an event into a recorded observation.`, why:(s,m)=>`If the ${m} acquisition procedure changes, later differences may come from measurement rather than from the underlying system. Freezing ${s.toLowerCase()} protects comparisons at the point of observation.`, engineering:(s,m)=>`Bind ${s} to the acquisition protocol for ${m}: sensor or observer identity, sampling cadence and location, calibration state, inclusion rules, preprocessing permitted before recording, and the event that marks capture complete.`, evidence:(s,m)=>`Use protocol records, calibration receipts, acquisition logs, or repeated controlled observations showing that ${m} was captured under the declared procedure.`, failure:(s)=>`${s} fails when observation conditions drift, when different instruments or sampling rules are pooled without correction, or when post-acquisition transformation is mistaken for measurement.`, limits:(s,m)=>`${s} establishes how raw ${m} observations are captured; it does not establish which derived variables are constructed from those observations, which classifier is used, or what causal interpretation follows.` },
    { re:/\b(fix feature construction|feature construction|feature engineering|derived feature)\b/i, lead:(s,m)=>`${s} defines how recorded ${m} observations are transformed into the variables used for detection. It operates after acquisition by choosing, combining, scaling, encoding, or aggregating measured inputs.`, why:(s,m)=>`Two analyses can observe the same ${m} events yet reach different detection behavior because they construct different features. Separating feature construction from observation keeps measurement error distinct from representation choice.`, engineering:(s,m)=>`Bind ${s} to a reproducible transformation from raw ${m} fields to detector inputs: source fields, windows, formulas, scaling, encoding, missing-value treatment, aggregation, and versioned implementation.`, evidence:(s,m)=>`Use raw-to-feature examples, transformation code or receipts, and recomputation showing that the declared detector variables are reproducibly derived from the same ${m} observations.`, failure:(s)=>`${s} fails when features leak future information, depend on undocumented transformations, change across evaluation splits, or are treated as raw observations.`, limits:(s,m)=>`${s} establishes the representation supplied to the ${m} detector; it does not establish how observations were acquired, whether the detector threshold is appropriate, or whether the feature has causal meaning.` },
    { re:/\b(declare calibration|calibration|calibrated reference|reference standard)\b/i, lead:(s,m)=>`${s} establishes the reference relationship used to turn a ${m} instrument response into a meaningful measured value. It fixes the known standard, adjustment, and validity interval against which readings are interpreted.`, why:(s,m)=>`Without declared calibration, a stable ${m} output can still be systematically wrong. Calibration addresses accuracy against a reference at a defined time; it is not the same as monitoring how that relationship changes later.`, engineering:(s,m)=>`Bind ${s} to the exact reference standard, calibration procedure, coefficients or correction curve, units, instrument identity, calibration date, uncertainty, and interval in which that calibration is considered valid for ${m}.`, evidence:(s,m)=>`Use calibration certificates, reference measurements, controlled standard checks, or before/after adjustment records showing how raw ${m} response maps to the declared measurement scale.`, failure:(s)=>`${s} fails when the reference is unknown, coefficients are reused outside their valid range, calibration is not traceable to the instrument, or uncertainty is omitted from a precision-sensitive decision.`, limits:(s,m)=>`${s} establishes the reference mapping for ${m} at a declared calibration state; it does not establish subsequent drift, signal threshold, event identity, or causal interpretation.` },
    { re:/\b(declare drift|drift|measurement drift|sensor drift)\b/i, lead:(s,m)=>`${s} tracks change in the ${m} measurement relationship after calibration. It asks whether the instrument or baseline moves over time even when the underlying reference condition is unchanged.`, why:(s,m)=>`A previously calibrated ${m} instrument can become biased as components age, environments change, or baselines shift. Drift therefore concerns temporal change away from the calibration state rather than the original reference mapping itself.`, engineering:(s,m)=>`Bind ${s} to repeated reference or control observations over time, the direction and rate of change, environmental covariates, acceptable drift tolerance, and the rule that triggers correction or recalibration for ${m}.`, evidence:(s,m)=>`Use longitudinal control checks, repeated standards, zero or baseline traces, or recalibration comparisons demonstrating that the ${m} response has changed relative to its earlier calibrated state.`, failure:(s)=>`${s} detection fails when natural signal change is mistaken for instrument drift, when controls are too sparse to resolve temporal change, or when recalibration silently resets the baseline without preserving the prior trajectory.`, limits:(s,m)=>`${s} establishes temporal movement away from a prior ${m} calibration state; it does not define the original calibration reference, detection threshold, event horizon, or cause of the observed signal.` },
    { re:/\b(source|origin|emission|input)\b/i, lead:(s,m)=>`${s} establishes where ${m} begins. Identify the originating event, condition, or object before interpreting anything downstream.`, why:(s,m)=>`If ${s.toLowerCase()} is vague, later readings can be precise about the wrong thing. A trustworthy ${m} chain starts by fixing origin.`, engineering:(s,m)=>`Represent ${s} as an explicit origin node for ${m}: bind source state, observation point, time, and ownership before routing or comparison.`, evidence:(s,m)=>`Use records that connect the named ${s.toLowerCase()} to the observed ${m} reading under the same time and state conditions.`, failure:(s)=>`${s} fails when a display, report, or downstream effect is mistaken for the originating condition.` },
    { re:/\b(locator|location|address|where)\b/i, lead:(s,m)=>`${s} makes the ${m} object retrievable. Bind the reading to a stable place or identifier so another reader can reach the same thing.`, why:(s)=>`Without a stable ${s.toLowerCase()}, evidence can silently drift to a similarly named but different object.`, engineering:(s,m)=>`Store ${s} as a reproducible retrieval coordinate for ${m}; prefer immutable identifiers or a path plus the context needed to resolve it.`, evidence:(s)=>`Evidence should show that the recorded ${s.toLowerCase()} resolves to the same artifact across independent retrievals.`, failure:(s)=>`${s} fails when the reference resolves ambiguously, changes target, or depends on hidden local context.` },
    { re:/\b(version|revision|edition|generation)\b/i, lead:(s,m)=>`${s} freezes which state of ${m} is being discussed. Similar names are not enough when the underlying object can change.`, why:(s)=>`A missing ${s.toLowerCase()} turns later comparison into guesswork because readers cannot tell whether differences came from the system or from a changed artifact.`, engineering:(s,m)=>`Bind ${s} to an immutable digest, commit, release, generation, or timestamped revision for ${m}.`, evidence:(s)=>`Require a receipt or identifier that independently resolves the exact ${s.toLowerCase()} used by the claim.`, failure:(s)=>`${s} fails when a mutable latest-state reference is treated as an exact historical identity.` },
    { re:/\b(owner|custodian|custody|responsib|authority)\b/i, lead:(s,m)=>`${s} identifies who is accountable for preserving and explaining this part of ${m}.`, why:(s)=>`A reading without clear ${s.toLowerCase()} can move through the system while responsibility for its meaning disappears.`, engineering:(s,m)=>`Represent ${s} as an explicit responsibility edge in ${m}, including handoff conditions and the authority actually held.`, evidence:(s)=>`Use custody records, signed receipts, role assignments, or accepted handoffs that show the named ${s.toLowerCase()} really held the object.`, failure:(s)=>`${s} fails when responsibility is implied by proximity rather than established by a traceable handoff or role.` },
    { re:/\b(format|encoding|representation|schema)\b/i, lead:(s,m)=>`${s} determines how ${m} is represented so its meaning survives storage, transport, and reading.`, why:(s)=>`A valid value in the wrong ${s.toLowerCase()} can become unreadable or be interpreted under the wrong rules.`, engineering:(s,m)=>`Declare the ${s.toLowerCase()} contract for ${m}, including syntax, units, field meaning, and any conversion needed for another system to consume it.`, evidence:(s)=>`Use parseable examples or schema validation showing that the recorded ${s.toLowerCase()} preserves the intended fields and units.`, failure:(s)=>`${s} fails when interpretation depends on undocumented assumptions or lossy conversion.` },
    { re:/\b(reception|receive|arrival|receiver)\b/i, lead:(s,m)=>`${s} asks whether the ${m} signal actually reached the intended receiver, not merely whether it was sent.`, why:(s)=>`Transmission without confirmed ${s.toLowerCase()} cannot explain a downstream response or absence of response.`, engineering:(s,m)=>`Track ${s} as a receive-side event in ${m}: receiver identity, route, timestamp, acknowledgement, and any filtering before state change.`, evidence:(s)=>`Look for acknowledgements, receive logs, route traces, or receiver-state changes tied to the same emitted event.`, failure:(s)=>`${s} fails when send-side evidence is used as proof that the receiving side observed the signal.` },
    { re:/\b(noise|distortion|interference|artifact)\b/i, lead:(s,m)=>`${s} separates information that belongs to ${m} from variation introduced by measurement, transport, or unrelated activity.`, why:(s)=>`If ${s.toLowerCase()} is not separated from signal, the system may react confidently to something that was never part of the underlying event.`, engineering:(s,m)=>`Model ${s} explicitly in ${m}: define expected background variation, filtering rules, and the threshold at which a reading becomes unreliable.`, evidence:(s)=>`Use baseline runs, repeated measurements, controls, or residual analysis that shows how much of the observed change can be attributed to ${s.toLowerCase()}.`, failure:(s)=>`${s} handling fails when filtering removes the event of interest or when background variation is promoted to signal.` },
    { re:/\b(quality|reliability|confidence|strength)\b/i, lead:(s,m)=>`${s} asks whether the ${m} reading is dependable enough for the decision being made.`, why:(s)=>`A visible reading is not automatically a usable reading; ${s.toLowerCase()} determines whether the next step is warranted.`, engineering:(s,m)=>`Define ${s} for ${m} using measurable error, completeness, latency, stability, or confidence criteria tied to the intended use.`, evidence:(s)=>`Use repeated observations or benchmark checks that quantify the relevant ${s.toLowerCase()} dimension rather than asserting it qualitatively.`, failure:(s)=>`${s} fails when a threshold is chosen after seeing the desired outcome or when uncertainty is hidden.` },
    { re:/\b(return|feedback)\b/i, lead:(s,m)=>`${s} traces what comes back after ${m} acts, and whether that return changes the next state.`, why:(s)=>`A repeated output is not feedback unless consequence returns into the system and influences what happens next.`, engineering:(s,m)=>`Represent ${s} as an output-to-input loop in ${m}; bind the emitted action, returned state, latency, and resulting adjustment.`, evidence:(s)=>`Use before/after state, loop traces, control logs, or returned signals demonstrating that the consequence re-entered the system.`, failure:(s)=>`${s} fails when recurrence is mistaken for a causal return path.` },
    { re:/\b(amplif|escalat|gain)\b/i, lead:(s,m)=>`${s} asks whether a return through ${m} increases the magnitude or persistence of the next response.`, why:(s)=>`Amplification can look like progress or instability; separating it reveals whether the loop is strengthening the desired state or compounding error.`, engineering:(s,m)=>`Measure ${s} in ${m} as the change in response magnitude across successive passes, with the same scale and comparable starting conditions.`, evidence:(s)=>`Use sequential state measurements showing that each return produces a larger response under comparable inputs.`, failure:(s)=>`${s} fails when larger outputs are caused by larger inputs rather than by the loop itself.` },
    { re:/\b(damp|attenuat|reduce|stabil)\b/i, lead:(s,m)=>`${s} asks whether ${m} absorbs or reduces the effect of a returning disturbance.`, why:(s)=>`A stabilizing loop should reduce error without erasing the information needed to correct it.`, engineering:(s,m)=>`Measure ${s} as the decline in response or error across comparable passes of ${m}; preserve the sign and timing of the correction.`, evidence:(s)=>`Use sequential measurements showing a consistent reduction in deviation after the return path engages.`, failure:(s)=>`${s} fails when the apparent reduction comes from lost measurement, saturation, or removal of the driving input.` },
    { re:/\b(adjust|correction|control|response)\b/i, lead:(s,m)=>`${s} is the state change ${m} makes after receiving information about its prior behavior.`, why:(s)=>`A loop that observes but cannot ${s.toLowerCase()} is descriptive, not corrective.`, engineering:(s,m)=>`Bind ${s} to the specific control action, changed parameter, and next-state effect inside ${m}.`, evidence:(s)=>`Use control records or before/after state showing that the system changed a named parameter in response to the returned information.`, failure:(s)=>`${s} fails when change occurs but cannot be tied to the observed return or control rule.` },
    { re:/\b(recurr|repeat|cycle)\b/i, lead:(s,m)=>`${s} establishes that ${m} has returned often enough to be treated as a pattern rather than an isolated event.`, why:(s)=>`One repetition can be coincidence; ${s.toLowerCase()} becomes useful only when the return is documented with enough timing and state context to compare passes.`, engineering:(s,m)=>`Represent ${s} as an ordered sequence of ${m} events with timestamps, state snapshots, and a declared rule for what counts as the same kind of return.`, evidence:(s)=>`Use multiple timestamped passes showing the same defined event class under comparable observation rules.`, failure:(s)=>`${s} fails when a narrative theme is called a cycle without repeated measured passes.` },
    { re:/\b(rhythm|interval|cadence|timing|phase)\b/i, lead:(s,m)=>`${s} characterizes when ${m} returns: spacing, cadence, and relative position matter as much as recurrence itself.`, why:(s)=>`Two patterns can recur equally often but behave differently because their ${s.toLowerCase()} differs.`, engineering:(s,m)=>`Measure ${s} from ordered timestamps in ${m}; preserve interval variance and phase rather than reducing the sequence to a single average.`, evidence:(s)=>`Use timestamped sequences that permit independent calculation of spacing and phase across multiple passes.`, failure:(s)=>`${s} fails when irregular timing is compressed into a regular cadence that the observations do not support.` },
    { re:/\b(renew|recover|restore|reset)\b/i, lead:(s,m)=>`${s} asks whether ${m} returns with usable capacity restored, not merely whether activity repeats.`, why:(s)=>`A system can recur while degrading. ${s} distinguishes genuine restoration from another pass through the same failure pattern.`, engineering:(s,m)=>`Define ${s} with an explicit post-cycle state in ${m}: which capacities must be restored, which may remain changed, and how the restored state is tested.`, evidence:(s)=>`Use pre/post measurements demonstrating that the required capacities returned after the cycle rather than only showing renewed activity.`, failure:(s)=>`${s} fails when resumed activity is treated as restored capacity without measuring the underlying state.` },
    { re:/\b(transfer|handoff|pass|exchange)\b/i, lead:(s,m)=>`${s} is the moment ${m} moves from one holder, process, or state boundary to another.`, why:(s)=>`Movement alone is not continuity; a valid ${s.toLowerCase()} preserves identity, responsibility, timing, and enough context for the receiver to continue.`, engineering:(s,m)=>`Model ${s} as a custody transition in ${m}, binding sender, receiver, payload identity, acceptance, and required context.`, evidence:(s)=>`Use paired send/receive records or a transfer receipt showing the same object was accepted with the required context.`, failure:(s)=>`${s} fails when the object moves but identity, context, or responsibility is lost in transit.` },
    { re:/\b(continuity|preserv|carry)\b/i, lead:(s,m)=>`${s} asks what must remain invariant while ${m} changes state, holder, or presentation.`, why:(s)=>`Without explicit invariants, a process can look continuous while silently replacing the object or meaning being carried.`, engineering:(s,m)=>`Declare the invariants for ${s} in ${m}: identity, required fields, ordering, authority, and any state that must survive transition.`, evidence:(s)=>`Use before/after receipts showing that the declared invariants are present on both sides of the transition.`, failure:(s)=>`${s} fails when the receiving state can no longer prove correspondence to the sending state.` },
    { re:/\b(result|outcome|finding|supported)\b/i, lead:(s,m)=>`${s} states what ${m} actually established after the admitted evaluation, without promoting it beyond the measured outcome.`, why:(s)=>`A result becomes misleading when interpretation outruns the metric, population, comparison, or evidence that produced it.`, engineering:(s,m)=>`Bind ${s} to the exact metric, population, target, comparator, and evaluation split used by ${m}.`, evidence:(s)=>`Use the evaluation receipt or result table that contains the exact reported metric under the declared population and target.`, failure:(s)=>`${s} fails when a measured outcome is restated as causation, universality, or operational readiness without additional evidence.` },
    { re:/\b(compar|baseline|control|counterfactual)\b/i, lead:(s,m)=>`${s} defines what the ${m} result is being judged against. The comparator is part of the claim, not an optional footnote.`, why:(s)=>`Without a meaningful ${s.toLowerCase()}, improvement or degradation has no stable reference point.`, engineering:(s,m)=>`Specify ${s} with the same population, target, split, and metric as ${m}; change only the factor the comparison is intended to test.`, evidence:(s)=>`Use side-by-side results produced under matched evaluation conditions.`, failure:(s)=>`${s} fails when the compared cases differ in hidden ways that can explain the observed gap.` },
    { re:/\b(failure|negative|reject|miss)\b/i, lead:(s,m)=>`${s} records where ${m} did not meet its stated criterion and preserves that outcome as information rather than erasing it.`, why:(s)=>`Negative evidence constrains the next claim and prevents repeated work from being remembered only through successful cases.`, engineering:(s,m)=>`Bind ${s} to the failed criterion, observed value, population, and exact conditions under which ${m} was tested.`, evidence:(s)=>`Use the failed assertion, metric, trace, or adjudication record that shows the criterion was not met.`, failure:(s)=>`${s} handling fails when unsuccessful cases are omitted, relabeled, or evaluated under a different threshold after the fact.` },
    { re:/\b(mixed|ambiguous|inconclusive|uncertain)\b/i, lead:(s,m)=>`${s} separates the parts of ${m} that support a claim from the parts that do not, without forcing one verdict over heterogeneous evidence.`, why:(s)=>`Mixed evidence is informative only when its disagreement is preserved rather than averaged into false certainty.`, engineering:(s,m)=>`Partition ${s} by condition, subgroup, metric, or observation regime inside ${m}, and report where direction or strength changes.`, evidence:(s)=>`Use subgroup or condition-level results that expose both supporting and opposing observations.`, failure:(s)=>`${s} fails when conflicting evidence is collapsed into a single headline statistic that hides the disagreement.` },
    { re:/\b(claim|ceiling|boundary|limit|scope)\b/i, lead:(s,m)=>`${s} defines the furthest inference ${m} can support before additional evidence or authority is required.`, why:(s)=>`A clear ${s.toLowerCase()} keeps a useful result from becoming an inflated universal, causal, or operational claim.`, engineering:(s,m)=>`Encode ${s} as explicit excluded inferences for ${m}: populations, causes, domains, time horizons, or decisions not established by the current evidence.`, evidence:(s)=>`Use the study design, source authority, and evaluation conditions to show exactly where the supported inference stops.`, failure:(s)=>`${s} fails when a statement crosses into an untested population, causal explanation, or decision authority.` },
    { re:/\b(record|evidence|receipt|source)\b/i, lead:(s,m)=>`${s} makes the ${m} claim inspectable by pointing to the object that carries the supporting observation or decision.`, why:(s)=>`A claim that cannot be traced to a specific ${s.toLowerCase()} cannot be independently checked or distinguished from recollection.`, engineering:(s,m)=>`Bind ${s} to an immutable or reproducible evidence object for ${m}, including identity, provenance, and the field that supports the reading.`, evidence:(s)=>`The ${s.toLowerCase()} itself should be retrievable and contain the observation, result, or authority being cited.`, failure:(s)=>`${s} fails when citation points only to a summary that cannot reproduce or locate the underlying evidence.` },
    { re:/\b(next|study|question|future|unresolved)\b/i, lead:(s,m)=>`${s} identifies what ${m} has not resolved and turns that gap into the next bounded investigation rather than an implied conclusion.`, why:(s)=>`Explicit unresolved work prevents uncertainty from being silently converted into confidence.`, engineering:(s,m)=>`Define ${s} as a testable successor question for ${m}: target, population, comparator, evidence requirement, and decision rule must be stated before execution.`, evidence:(s)=>`Use the current limits and failed or incomplete evidence to justify why this successor question is necessary.`, failure:(s)=>`${s} fails when the proposed work cannot distinguish between the competing explanations left open by the current result.` },
    { re:/\b(threshold|gate|saturat|admissib|qualif)\b/i, lead:(s,m)=>`${s} states the condition ${m} must satisfy before the next state, claim, or action is allowed.`, why:(s)=>`A gate protects the system only when its criterion is defined before the outcome and is applied consistently.`, engineering:(s,m)=>`Encode ${s} as a deterministic predicate over named ${m} inputs, including comparison direction, units, and the exact effect of pass versus hold.`, evidence:(s)=>`Use the evaluated inputs and predicate receipt showing whether the criterion was satisfied under the declared rule.`, failure:(s)=>`${s} fails when the criterion moves after evaluation or when a pass is inferred without the required inputs.` },
    { re:/\b(structur|dependency|envelope|anchor|spine|component)\b/i, lead:(s,m)=>`${s} identifies the part of ${m} that must exist or remain connected for the larger system to stay coherent.`, why:(s)=>`A structural reading distinguishes load-bearing relationships from nearby detail that can change without collapsing the system.`, engineering:(s,m)=>`Represent ${s} as an explicit node, boundary, or dependency in ${m}, and state which functions depend on it.`, evidence:(s)=>`Use architecture, dependency traces, or controlled removal tests showing the consequence of changing ${s.toLowerCase()}.`, failure:(s)=>`${s} fails when a decorative association is mistaken for a required dependency.` },
    { re:/\b(coheren|consisten|integrity|align|correspond)\b/i, lead:(s,m)=>`${s} asks whether the parts of ${m} agree with one another strongly enough to describe one system rather than conflicting fragments.`, why:(s)=>`Internal agreement matters because a polished output can still be invalid when identity, rules, evidence, and execution contradict each other.`, engineering:(s,m)=>`Evaluate ${s} across the relevant ${m} representations and transitions; name the invariants that must correspond and the contradictions that force hold.`, evidence:(s)=>`Use cross-checks, replay, paired receipts, or invariant tests that compare the same state across independent representations.`, failure:(s)=>`${s} fails when incompatible states are accepted as equivalent or when contradictions are hidden by aggregation.` },
    { re:/\b(metric|measure|score|rate|index)\b/i, lead:(s,m)=>`${s} defines the quantity used to read ${m}; its meaning depends on exactly what is counted, scaled, and compared.`, why:(s)=>`A number is only informative when its construction matches the decision it is being used to support.`, engineering:(s,m)=>`Specify ${s} for ${m} with numerator, denominator or transformation, units, aggregation rule, and handling of missing or censored observations.`, evidence:(s)=>`Use raw observations and a reproducible calculation that yields the reported ${s.toLowerCase()}.`, failure:(s)=>`${s} fails when the calculation changes across cases or when the score is interpreted outside the construct it measures.` },
    { re:/\b(population|sample|cohort|domain)\b/i, lead:(s,m)=>`${s} defines who or what the ${m} reading actually describes.`, why:(s)=>`Evidence can be strong inside one ${s.toLowerCase()} and still say nothing about another.`, engineering:(s,m)=>`Bind ${s} to explicit inclusion, exclusion, grouping, and independence rules for ${m}.`, evidence:(s)=>`Use source records showing how observations entered the declared ${s.toLowerCase()} and whether evaluation units remained independent.`, failure:(s)=>`${s} fails when observations outside the declared group are silently mixed in or when leakage destroys independence.` },
    { re:/\b(target|objective|endpoint|criterion)\b/i, lead:(s,m)=>`${s} states exactly what ${m} is trying to detect, explain, preserve, or decide.`, why:(s)=>`A precise ${s.toLowerCase()} keeps the evaluation from drifting toward whichever outcome happened to look strongest after inspection.`, engineering:(s,m)=>`Encode ${s} before evaluation with its event definition, time horizon, units, and decision relation to ${m}.`, evidence:(s)=>`Use the predeclared target definition and labeled observations that show how the endpoint was assigned.`, failure:(s)=>`${s} fails when the endpoint is redefined after results are known or when labels depend on information unavailable at decision time.` }
  ]);

  function installReferenceStyles() {
    if (document.getElementById("lrc-methods-reference-styles")) return;
    const style = document.createElement("style");
    style.id = "lrc-methods-reference-styles";
    style.textContent = `
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-inspection] { width:min(100%,64rem); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-inspection-head { margin-bottom:1.25rem; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-information-grid] { grid-template-columns:minmax(13rem,16.5rem) minmax(0,1fr); grid-template-areas:"stories cells"; gap:1rem 1.35rem; align-items:start; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-inner-tabs] { position:absolute !important; width:1px !important; height:1px !important; margin:-1px !important; padding:0 !important; overflow:hidden !important; clip:rect(0 0 0 0) !important; white-space:nowrap !important; border:0 !important; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-rail] { grid-area:stories; top:4.2rem; border-right:1px solid rgba(255,255,255,.09); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] { grid-template-columns:1fr; gap:.18rem; min-height:4.25rem; padding:.72rem .85rem; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] > span { font-size:.58rem; letter-spacing:.13em; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] > strong { color:inherit; font-size:.86rem; line-height:1.2; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] > small { color:#65727c; font-size:.62rem; font-weight:600; line-height:1.28; letter-spacing:.02em; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab][aria-selected="true"] > small { color:color-mix(in srgb,var(--lrc-family-accent) 72%,#8a949d); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-grid-cells] { grid-area:cells; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-grid-cell] { min-height:0; padding:0; border:0; background:transparent; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-progressive-detail { display:grid; gap:1rem; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-first { padding:clamp(1rem,2.4vw,1.45rem); border:1px solid color-mix(in srgb,var(--lrc-family-accent) 22%,transparent); border-radius:1rem; background:radial-gradient(circle at 88% 12%,var(--lrc-family-soft),transparent 13rem),rgba(255,255,255,.025); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-depth-label { margin:0 0 .42rem; color:var(--lrc-family-accent); font-size:.64rem; font-weight:800; letter-spacing:.15em; text-transform:uppercase; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-first h3 { margin:0; max-width:20ch; color:#f0eee9; font-family:Georgia,"Times New Roman",serif; font-size:clamp(1.85rem,3vw,2.8rem); font-weight:500; line-height:1.02; letter-spacing:-.035em; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-lead { margin:.8rem 0 0; max-width:60ch; color:#d9e0e6; font-size:clamp(1rem,1.5vw,1.12rem); line-height:1.62; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-why { margin-top:1rem; padding-top:.9rem; border-top:1px solid rgba(255,255,255,.08); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-why strong,
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-grid strong { display:block; margin-bottom:.3rem; color:#9ba7b1; font-size:.64rem; font-weight:800; letter-spacing:.13em; text-transform:uppercase; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-why p { margin:0; color:#acb8c1; line-height:1.58; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-depth { border:1px solid rgba(255,255,255,.09); border-radius:1rem; background:rgba(3,6,9,.36); overflow:clip; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-depth > summary { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:.25rem 1rem; align-items:center; padding:1rem 1.1rem; cursor:pointer; list-style:none; color:#d7dde2; font-weight:780; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-depth > summary::-webkit-details-marker { display:none; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-depth > summary::after { content:"+"; grid-column:2; grid-row:1 / span 2; color:var(--lrc-family-accent); font-size:1.25rem; font-weight:400; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-depth[open] > summary::after { content:"−"; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-depth > summary small { grid-column:1; color:#6f7b85; font-size:.68rem; font-weight:620; line-height:1.35; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-body { display:grid; gap:1rem; padding:0 1.1rem 1.15rem; border-top:1px solid rgba(255,255,255,.065); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-identity { padding-top:1rem; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-identity h4 { margin:.05rem 0 .6rem; color:#f1eee8; font-family:Georgia,"Times New Roman",serif; font-size:clamp(1.4rem,2.4vw,2.05rem); font-weight:500; line-height:1.05; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-statement { margin:0; color:#b7c1c9; font-size:.94rem; line-height:1.58; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.7rem; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-grid section { padding:.78rem; border:1px solid rgba(255,255,255,.07); border-radius:.72rem; background:rgba(255,255,255,.018); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-grid p { margin:0; color:#99a6af; font-size:.81rem; line-height:1.52; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-grid-cell][data-depth-focus="empirical"] .lrc-engineering-grid section:first-child { border-color:color-mix(in srgb,var(--lrc-family-accent) 38%,transparent); background:var(--lrc-family-soft); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-summary-stories] { display:grid; gap:.35rem; width:100%; margin:.95rem 0 0; padding-top:.8rem; border-top:1px solid rgba(255,255,255,.07); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-summary-stories] span { display:flex; gap:.55rem; align-items:baseline; color:#82909b; font-size:.7rem; line-height:1.25; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-summary-stories] b { color:var(--lrc-family-accent); font-size:.58rem; letter-spacing:.12em; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-inspect] { margin-top:auto; }
      @media (max-width:780px) {
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-information-grid] { grid-template-columns:minmax(8rem,34%) minmax(0,1fr); grid-template-areas:"stories cells"; gap:.65rem; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-rail] { top:3.8rem; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] { min-height:3.8rem; padding:.58rem .55rem; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] > strong { font-size:.74rem; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] > small { font-size:.56rem; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-first { padding:1rem; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-first h3 { font-size:clamp(1.65rem,6vw,2.3rem); }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-grid { grid-template-columns:1fr; }
      }
      @media (max-width:480px) {
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-information-grid] { grid-template-columns:1fr; grid-template-areas:"stories" "cells"; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-rail] { position:relative; top:auto; grid-template-columns:repeat(2,minmax(0,1fr)); border-right:0; }
      }
      @media (prefers-reduced-motion:reduce) {
        html.lr-js [data-laws-room-carousel] .lrc-engineering-depth,
        html.lr-js [data-laws-room-carousel] .lrc-engineering-depth > summary { scroll-behavior:auto !important; transition:none !important; }
      }
    `;
    document.head.append(style);
  }

  function routeOf(root) {
    const declared = root.dataset.lrcRoute || document.documentElement.dataset.route;
    if (declared) return declared;
    return location.pathname.endsWith(".html") || location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`;
  }

  function directSourceNodes(root) {
    return Array.from(root.children).filter(node => {
      if (!(node instanceof HTMLElement)) return false;
      if (node.matches("details.lr-audit,.lr-story-nav,[data-lrc-tabs],[data-lrc-viewport],[data-lrc-runtime],[data-lrc-static]")) return false;
      return node.matches("section,article,aside,nav,div");
    });
  }

  function routeContext(root) {
    const lens = kind => textOf(root.querySelector(`[id*="panel-${kind}"],.lr-panel[data-tab-kind="${kind}"],[data-tab-kind="${kind}"].section-tab-panel`));
    const relationship = root.querySelector("#relationship-title,#reverse-title");
    const relation = textOf(relationship?.closest("section")?.querySelector(".lr-section__head p:last-child"));
    const boundaryNode = root.querySelector(".lr-boundary,aside[aria-label*='boundary' i]");
    const noStudy = /no current admitted study/i.test(textOf(root))
      ? "No current admitted study. This subject remains conceptual or procedural until a separate source is admitted."
      : "";
    return {
      relation,
      practical: lens("practical"),
      engineering: lens("engineering"),
      empirical: lens("empirical"),
      boundary: textOf(boundaryNode?.querySelector("p:last-child")) || textOf(boundaryNode),
      noStudy
    };
  }

  function sourceMaterial(root, definition, context) {
    const source = definition.sourceSelector ? root.querySelector(definition.sourceSelector) : null;
    const sourceSummary = textOf(source?.querySelector("summary p"));
    const stories = Array.isArray(definition.stories) ? definition.stories.filter(story => {
      if (!story || !story.id || !story.label || !story.readings) return false;
      return DEPTHS.every(([kind]) => typeof story.readings[kind] === "string" && story.readings[kind].trim());
    }) : [];
    const authoredStorySummary = String(stories[0]?.readings?.practical || "").trim();
    return {
      label: definition.label || definition.id,
      summary: definition.summary || sourceSummary || authoredStorySummary || definition.practical || context.relation || "Open this subject for its complete contextual reading.",
      boundary: definition.boundary || context.boundary,
      href: definition.href || "",
      stories
    };
  }

  function readingRepeated(story, material, kind) {
    const current = story?.readings?.[kind] || "";
    return material.stories.some(other => other !== story && similarity(current,other?.readings?.[kind] || "") >= .78);
  }

  function semanticRule(story) {
    const key = `${story?.label || ""} ${story?.id || ""}`;
    return SEMANTIC_RULES.find(rule => rule.re.test(key)) || null;
  }

  function semanticFallback(story, material) {
    const subject = story.label;
    const parent = material.label;
    return {
      lead: `${subject} isolates a distinct decision inside ${parent}. Define what changes at this stage before moving to the next reading.`,
      why: `Treating ${subject.toLowerCase()} as its own step prevents ${parent} from collapsing several different questions into one generic explanation.`,
      engineering: `Model ${subject} as a named state or transition inside ${parent}; declare its inputs, transformation, output, and the condition that makes this step complete.`,
      evidence: `Use a record that specifically demonstrates ${subject.toLowerCase()} rather than relying on evidence for a neighboring stage of ${parent}.`,
      failure: `${subject} fails when the named distinction cannot be observed independently from the neighboring readings.`,
      limits: `Evidence for ${subject.toLowerCase()} supports this stage of ${parent}; it does not automatically establish the other stages or a broader causal claim.`
    };
  }

  function semanticReading(story, material) {
    const rule = semanticRule(story);
    if (!rule) return semanticFallback(story,material);
    const subject = story.label;
    const parent = material.label;
    return {
      lead: rule.lead(subject,parent),
      why: rule.why(subject,parent),
      engineering: rule.engineering(subject,parent),
      evidence: rule.evidence(subject,parent),
      failure: rule.failure(subject,parent),
      limits: rule.limits ? rule.limits(subject,parent) : `Keep ${subject.toLowerCase()} bounded to its declared role inside ${parent}; it does not by itself establish the neighboring stages, cause, or universality.`
    };
  }

  function storyArchitecture(story, material, context) {
    const authored = semanticReading(story,material);
    const practicalParts = sentences(story.readings.practical);
    const question = [...practicalParts].reverse().find(part => /\?$/.test(part));
    const readerTitle = story.readerTitle || story.label;
    const leadParts = question ? practicalParts.filter(part => part !== question) : practicalParts;
    const sourceLead = leadParts[0] || story.readings.practical;
    const sourceWhy = story.why || leadParts.slice(1).join(" ") || material.summary;
    const repeatedPractical = readingRepeated(story,material,"practical") || similarity(sourceLead,material.summary) >= .82;
    const lead = story.lead || (repeatedPractical ? authored.lead : sourceLead);
    const why = story.why || (repeatedPractical || similarity(sourceWhy,lead) >= .7 ? authored.why : sourceWhy);

    const engineeringParts = sentences(story.readings.engineering);
    const formalTitle = story.formalTitle || story.engineeringTitle || story.label;
    const formalCaptionSource = withoutTerminal(engineeringParts.at(-1) || engineeringParts[0] || story.label);
    const repeatedEngineering = readingRepeated(story,material,"engineering");
    const formalCaption = story.formalCaption || (repeatedEngineering ? `Technical role · ${story.label}` : formalCaptionSource);
    const engineering = repeatedEngineering ? authored.engineering : story.readings.engineering;

    const empirical = String(story.readings.empirical || "").trim();
    const failureMatch = empirical.match(/(?:Failure mode|Failure behavior)\s*:\s*([^]+)$/i);
    const evidenceSource = (failureMatch ? empirical.slice(0, failureMatch.index) : empirical).trim() || empirical;
    const repeatedEmpirical = readingRepeated(story,material,"empirical");
    const evidence = repeatedEmpirical ? authored.evidence : evidenceSource;
    const failure = story.failure || failureMatch?.[1]?.trim() || authored.failure;
    const limits = story.limits || story.boundary || story.relationship?.stops || material.boundary || context.noStudy || authored.limits;
    const semanticFingerprint = normalized([readerTitle,lead,why,engineering,evidence,failure,limits].join(" "));
    return { readerTitle, lead, why, formalTitle, formalCaption, engineering, evidence, failure, limits, semanticFingerprint, semanticReauthored: repeatedPractical || repeatedEngineering || repeatedEmpirical };
  }

  function storyPanel(cardId, story, storyIndex, material, context) {
    const a = storyArchitecture(story, material, context);
    return `<article id="${escapeHtml(cardId)}-${escapeHtml(story.id)}" role="tabpanel" data-lrc-grid-cell data-lrc-story-index="${storyIndex}" data-lrc-story-id="${escapeHtml(story.id)}" data-lrc-semantic-reauthored="${a.semanticReauthored}">
      <div class="lrc-progressive-detail">
        <section class="lrc-reader-first">
          <p class="lrc-depth-label">Plain-language reading</p>
          <h3>${escapeHtml(a.readerTitle)}</h3>
          <p class="lrc-reader-lead">${escapeHtml(a.lead)}</p>
          <div class="lrc-reader-why"><strong>Why it matters</strong><p>${escapeHtml(a.why)}</p></div>
        </section>
        <details class="lrc-engineering-depth" data-lrc-engineering-depth>
          <summary><span>Engineering detail</span><small>${escapeHtml(a.formalCaption)}</small></summary>
          <div class="lrc-engineering-body">
            <div class="lrc-engineering-identity">
              <p class="lrc-depth-label">Formal / technical reading</p>
              <h4>${escapeHtml(a.formalTitle)}</h4>
              <p class="lrc-engineering-statement">${escapeHtml(a.engineering)}</p>
            </div>
            <div class="lrc-engineering-grid">
              <section><strong>Evidence standing</strong><p>${escapeHtml(a.evidence)}</p></section>
              <section><strong>Failure behavior</strong><p>${escapeHtml(a.failure)}</p></section>
              <section><strong>Limits</strong><p>${escapeHtml(a.limits)}</p></section>
            </div>
          </div>
        </details>
      </div>
    </article>`;
  }

  function makeCard(root, route, family, definition, index, count, context) {
    const material = sourceMaterial(root, definition, context);
    const id = slug(definition.id || material.label);
    const card = document.createElement("section");
    card.dataset.lrcCard = "";
    card.dataset.lrcRuntime = "true";
    card.dataset.lrcId = id;
    card.dataset.lrcLabel = material.label;
    card.dataset.lrcFamily = family;
    card.dataset.lrcSemanticContract = SEMANTIC_CONTRACT;
    card.id = `lrc-${slug(route)}-${id}`;
    card.setAttribute("role", "tabpanel");
    card.setAttribute("aria-label", `${material.label}, ${index + 1} of ${count}`);

    const architectures = material.stories.map(story => storyArchitecture(story,material,context));
    const uniqueFingerprints = new Set(architectures.map(a => a.semanticFingerprint));
    if (uniqueFingerprints.size !== architectures.length) card.dataset.lrcSemanticFailure = "duplicate-visible-reading";

    const summary = document.createElement("div");
    summary.dataset.lrcSummary = "";
    summary.innerHTML = `
      <p data-lrc-summary-count>${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}</p>
      <p data-lrc-summary-kicker>${escapeHtml(family)} subject</p>
      <h2 data-lrc-summary-title>${escapeHtml(material.label)}</h2>
      <p data-lrc-summary-copy>${escapeHtml(material.summary)}</p>
      <div data-lrc-summary-stories aria-hidden="true">${material.stories.slice(0,3).map((story, i) => `<span><b>${String(i + 1).padStart(2,"0")}</b>${escapeHtml(storyArchitecture(story, material, context).readerTitle)}</span>`).join("")}</div>
      <button type="button" data-lrc-inspect aria-controls="${escapeHtml(card.id)}">Explore meaning &amp; method</button>`;

    const inspection = document.createElement("div");
    inspection.dataset.lrcInspection = "";
    inspection.hidden = true;
    const stories = material.stories;
    if (stories.length < 4 || stories.length > 5) card.dataset.lrcGridFailure = "story-count";
    inspection.innerHTML = `
      <button type="button" data-lrc-return>↶ Return to Orbit</button>
      <header class="lrc-inspection-head"><p>${escapeHtml(family)} · contextual inspection</p><h2>${escapeHtml(material.label)}</h2><span>${escapeHtml(material.summary)}</span></header>
      <div data-lrc-information-grid>
        <div data-lrc-inner-tabs aria-hidden="true">${DEPTHS.map(([kind,label],i) => `<button type="button" tabindex="-1" data-lrc-inner-tab="${kind}" data-lrc-layer-index="${i}">${label}</button>`).join("")}</div>
        <div data-lrc-story-rail role="tablist" aria-orientation="vertical" aria-label="${escapeHtml(material.label)} readings">
          ${stories.map((story, storyIndex) => { const a = storyArchitecture(story, material, context); return `<button type="button" role="tab" data-lrc-story-tab="${escapeHtml(story.id)}" data-lrc-story-index="${storyIndex}"><span>${String(storyIndex + 1).padStart(2,"0")} / ${String(stories.length).padStart(2,"0")}</span><strong>${escapeHtml(a.readerTitle)}</strong><small>${escapeHtml(a.formalCaption)}</small></button>`; }).join("")}
        </div>
        <div data-lrc-grid-cells>${stories.map((story, storyIndex) => storyPanel(card.id, story, storyIndex, material, context)).join("")}</div>
      </div>
      ${material.href ? `<p class="lrc-deep-route"><a href="${escapeHtml(material.href)}">Continue to ${escapeHtml(material.label)}</a></p>` : ""}`;
    card.append(summary, inspection);
    return card;
  }

  function createOuterTabs(root, viewport, cards) {
    const tabs = document.createElement("div");
    tabs.dataset.lrcTabs = "";
    tabs.dataset.lrcRuntime = "true";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Choose a page-specific Laws subject");
    tabs.style.setProperty("--lrc-count", String(cards.length));
    const buttons = cards.map((card, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.lrcTab = "";
      button.dataset.lrcTabIndex = String(index);
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", card.id);
      button.innerHTML = `<span data-lrc-tab-number>${String(index + 1).padStart(2,"0")}</span><span data-lrc-tab-label>${escapeHtml(card.dataset.lrcLabel)}</span>`;
      tabs.append(button);
      return button;
    });
    root.insertBefore(tabs, viewport);
    return { tabs, buttons };
  }

  function mount(root, map) {
    if (root.dataset.lrcMounted === "true") return;
    const route = routeOf(root);
    const routeMap = map.routes?.[route];
    if (!routeMap?.cards?.length) { root.dataset.lrcFailure = "route-map-missing"; return; }
    const declaredIds = (root.dataset.lrcCards || "").split(/\s+/).filter(Boolean);
    const mappedIds = routeMap.cards.map(card => card.id);
    if (declaredIds.length && declaredIds.join("|") !== mappedIds.join("|")) { root.dataset.lrcFailure = "route-declaration-mismatch"; return; }

    installReferenceStyles();
    root.dataset.lrcRoute = route;
    root.dataset.lrcFamily = routeMap.family;
    root.dataset.lrcOuterCards = mappedIds.join(" ");
    root.dataset.lrcInternalTabs = "reading engineering evidence";
    root.dataset.lrcReferenceArchitecture = "methods-and-models";
    root.dataset.lrcSemanticContract = SEMANTIC_CONTRACT;
    root.dataset.lrcSemanticRedesign = "complete-family-v1";
    root.dataset.lrcCustody = "collapsed-subordinate";
    root.dataset.lrcGreaterNavigation = root.querySelector(":scope > .lr-story-nav") ? "bottom" : "not-declared";

    const storyNav = root.querySelector(":scope > .lr-story-nav");
    const audit = root.querySelector(":scope > details.lr-audit");
    if (audit) { audit.open = false; audit.dataset.lrcRole = "custody"; }
    if (storyNav) storyNav.dataset.lrcRole = "greater-laws-navigation";
    const context = routeContext(root);
    directSourceNodes(root).forEach(node => { node.dataset.lrcContextSource = ""; node.dataset.lrcOriginallyHidden = String(node.hidden); node.hidden = true; });

    const viewport = document.createElement("section");
    viewport.dataset.lrcViewport = "";
    viewport.dataset.lrcRuntime = "true";
    viewport.tabIndex = 0;
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute("aria-label", `${textOf(root.querySelector("h1")) || "Laws"} subjects`);
    const track = document.createElement("div");
    track.dataset.lrcTrack = "";
    const cards = routeMap.cards.map((definition,index) => makeCard(root,route,routeMap.family,definition,index,routeMap.cards.length,context));
    cards.forEach(card => track.append(card));
    if (cards.some(card => card.dataset.lrcSemanticFailure)) root.dataset.lrcSemanticFailure = "duplicate-visible-reading";
    const live = document.createElement("p");
    live.dataset.lrcLive = "";
    live.setAttribute("aria-live","polite");
    live.setAttribute("aria-atomic","true");
    viewport.append(track,live);
    root.insertBefore(viewport,root.firstChild);
    const { tabs, buttons } = createOuterTabs(root,viewport,cards);

    const state = { index:clamp(Number(root.dataset.lrcInitial || 0) || 0,0,cards.length - 1), inspecting:false, layers:cards.map(() => 0), stories:cards.map(() => 0), pointerId:null, startX:0, startY:0, travel:0, classification:"none", direction:0, dragging:false };

    function deltaFor(index) {
      let delta = index - state.index;
      const half = cards.length / 2;
      if (delta > half) delta -= cards.length;
      if (delta < -half) delta += cards.length;
      return delta;
    }

    function publish(reason) {
      const active = cards[state.index];
      const layer = DEPTHS[state.layers[state.index]]?.[0] || "practical";
      const story = routeMap.cards[state.index]?.stories?.[state.stories[state.index]] || null;
      root.dataset.lrcIndex = String(state.index);
      root.dataset.lrcId = active.dataset.lrcId;
      root.dataset.lrcLayer = state.inspecting ? layer : "orbit";
      root.dataset.lrcStory = state.inspecting && story ? story.id : "orbit";
      root.dataset.lrcGestureState = state.dragging ? state.classification : "idle";
      live.textContent = `${active.dataset.lrcLabel} · ${state.index + 1} of ${cards.length}`;
      globalThis.dispatchEvent(new CustomEvent("LAWS_ROOM_CAROUSEL_CHANGED", { detail:Object.freeze({ contract:CONTRACT, referenceContract:REFERENCE, semanticContract:SEMANTIC_CONTRACT, reason, route, family:routeMap.family, count:cards.length, index:state.index, subjectId:active.dataset.lrcId, inspecting:state.inspecting, internalLayer:state.inspecting ? layer : null, internalStoryId:state.inspecting && story ? story.id : null, methodsReferenceArchitecture:true, semanticDistinctness:true, sameObjectContinuity:true, bottomStoryNavigationPreserved:Boolean(storyNav), sourceCompletenessClaimed:false, scientificValidationClaimed:false, productAcceptanceGranted:false }) }));
    }

    function render(reason = "render") {
      cards.forEach((card,index) => {
        const delta = deltaFor(index);
        const abs = Math.abs(delta);
        const active = delta === 0;
        const adjacent = abs === 1;
        const inspecting = active && state.inspecting;
        card.style.setProperty("--lrc-offset",String(delta));
        card.style.setProperty("--lrc-depth-factor",active ? "1" : adjacent ? ".2" : "0");
        card.style.setProperty("--lrc-scale",active ? "1" : adjacent ? ".91" : ".82");
        card.style.setProperty("--lrc-opacity",active ? "1" : adjacent ? ".5" : "0");
        card.dataset.active = String(active);
        card.dataset.adjacent = String(adjacent);
        card.dataset.distant = String(abs > 1);
        card.dataset.inspecting = String(inspecting);
        card.setAttribute("aria-current",active ? "true" : "false");
        card.setAttribute("aria-hidden",active ? "false" : "true");
        if ("inert" in card) card.inert = !active;
        card.querySelector(":scope > [data-lrc-summary]").hidden = inspecting;
        card.querySelector(":scope > [data-lrc-inspection]").hidden = !inspecting;
        const activeLayer = state.layers[index];
        const activeStory = state.stories[index];
        card.querySelectorAll("[data-lrc-inner-tab]").forEach((button,layerIndex) => button.setAttribute("aria-selected",String(layerIndex === activeLayer)));
        card.querySelectorAll("[data-lrc-story-tab]").forEach((button,storyIndex) => { const selected = storyIndex === activeStory; button.setAttribute("aria-selected",String(selected)); button.tabIndex = selected ? 0 : -1; });
        card.querySelectorAll("[data-lrc-grid-cell]").forEach(panel => {
          const selected = Number(panel.dataset.lrcStoryIndex) === activeStory;
          panel.hidden = !selected;
          panel.dataset.depthFocus = DEPTHS[activeLayer]?.[0] || "practical";
          const details = panel.querySelector("[data-lrc-engineering-depth]");
          if (details) details.open = selected && activeLayer > 0;
        });
      });
      buttons.forEach((button,index) => { const active = index === state.index; button.setAttribute("aria-selected",String(active)); button.tabIndex = active ? 0 : -1; });
      tabs.dataset.lrcActiveIndex = String(state.index);
      viewport.dataset.lrcInspecting = String(state.inspecting);
      publish(reason);
    }

    function closeInspection(reason = "inspection-close", focus = true) {
      if (!state.inspecting) return;
      const button = cards[state.index].querySelector("[data-lrc-inspect]");
      state.inspecting = false;
      delete root.dataset.lrcInspecting;
      delete document.documentElement.dataset.lrcInspectionOpen;
      render(reason);
      if (focus) button?.focus({ preventScroll:true });
    }

    function openInspection(reason = "inspection-open") {
      if (state.inspecting) return;
      state.layers[state.index] = 0;
      state.stories[state.index] = 0;
      state.inspecting = true;
      root.dataset.lrcInspecting = "true";
      document.documentElement.dataset.lrcInspectionOpen = "true";
      render(reason);
      requestAnimationFrame(() => cards[state.index].querySelector("[data-lrc-return]")?.focus({ preventScroll:true }));
    }

    function select(next,reason,focus = false) {
      if (state.inspecting) closeInspection("inspection-close-before-selection",false);
      state.index = wrap(next,cards.length);
      render(reason);
      if (focus) buttons[state.index]?.focus({ preventScroll:true });
    }

    function selectLayer(cardIndex,next,reason = "depth-select") {
      if (!state.inspecting || cardIndex !== state.index) return;
      state.layers[cardIndex] = wrap(next,DEPTHS.length);
      render(reason);
    }

    function selectStory(cardIndex,next,reason = "story-tab-select",focus = false) {
      if (!state.inspecting || cardIndex !== state.index) return;
      const storyCount = routeMap.cards[cardIndex]?.stories?.length || 0;
      if (!storyCount) return;
      state.stories[cardIndex] = wrap(next,storyCount);
      state.layers[cardIndex] = 0;
      render(reason);
      if (focus) cards[cardIndex].querySelectorAll("[data-lrc-story-tab]")[state.stories[cardIndex]]?.focus({ preventScroll:true });
    }

    tabs.addEventListener("click",event => { const button = event.target.closest("[data-lrc-tab]"); if (button) select(Number(button.dataset.lrcTabIndex),"outer-tab-direct-select"); });
    tabs.addEventListener("keydown",event => {
      if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") select(0,"outer-tab-home",true);
      else if (event.key === "End") select(cards.length - 1,"outer-tab-end",true);
      else select(state.index + (event.key === "ArrowRight" ? 1 : -1),"outer-tab-arrow",true);
    });

    root.addEventListener("click",event => {
      if (event.target.closest("[data-lrc-inspect]")) return openInspection();
      if (event.target.closest("[data-lrc-return]")) return closeInspection();
      const inner = event.target.closest("[data-lrc-inner-tab]");
      if (inner) { event.stopPropagation(); selectLayer(state.index,Number(inner.dataset.lrcLayerIndex)); return; }
      const story = event.target.closest("[data-lrc-story-tab]");
      if (story) { event.stopPropagation(); selectStory(state.index,Number(story.dataset.lrcStoryIndex)); }
    });
    root.addEventListener("keydown",event => {
      const story = event.target.closest("[data-lrc-story-tab]");
      if (!story || !["ArrowUp","ArrowDown","Home","End"].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation();
      const storyCount = routeMap.cards[state.index]?.stories?.length || 0;
      const current = Number(story.dataset.lrcStoryIndex);
      const next = event.key === "Home" ? 0 : event.key === "End" ? storyCount - 1 : current + (event.key === "ArrowDown" ? 1 : -1);
      selectStory(state.index,next,"story-tab-keyboard",true);
    });

    viewport.addEventListener("keydown",event => {
      if (event.key === "Escape" && state.inspecting) { event.preventDefault(); closeInspection(); return; }
      if (state.inspecting || event.target.closest("input,textarea,select")) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); select(state.index - 1,"keyboard-left",true); }
      else if (event.key === "ArrowRight") { event.preventDefault(); select(state.index + 1,"keyboard-right",true); }
      else if (event.key === "Home") { event.preventDefault(); select(0,"keyboard-home",true); }
      else if (event.key === "End") { event.preventDefault(); select(cards.length - 1,"keyboard-end",true); }
    });

    viewport.addEventListener("pointerdown",event => {
      if (state.inspecting || event.target.closest("a,button,input,textarea,select,summary") || (event.pointerType === "mouse" && event.button !== 0)) return;
      state.pointerId = event.pointerId; state.startX = event.clientX; state.startY = event.clientY; state.travel = 0; state.classification = "none"; state.direction = 0; state.dragging = true; viewport.dataset.dragging = "true"; viewport.setPointerCapture?.(event.pointerId);
    });
    viewport.addEventListener("pointermove",event => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const totalX = event.clientX - state.startX;
      const totalY = event.clientY - state.startY;
      if (state.classification === "none" && Math.max(Math.abs(totalX),Math.abs(totalY)) >= CLASSIFY_PX) state.classification = Math.abs(totalX) >= Math.abs(totalY) * AXIS_RATIO ? "horizontal" : "vertical";
      if (state.classification === "horizontal") { state.travel = Math.abs(totalX); state.direction = totalX < 0 ? 1 : -1; event.preventDefault(); }
      root.dataset.lrcGestureState = state.classification;
    },{ passive:false });
    function release(event,cancelled = false) {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const direction = !cancelled && state.classification === "horizontal" && state.travel >= COMMIT_PX ? state.direction : 0;
      state.dragging = false; viewport.dataset.dragging = "false"; try { viewport.releasePointerCapture?.(event.pointerId); } catch {} state.pointerId = null; state.classification = "none"; state.travel = 0; state.direction = 0;
      if (direction) select(state.index + direction,"pointer-one-step"); else render(cancelled ? "pointer-cancel-noop" : "pointer-unclassified-noop");
    }
    viewport.addEventListener("pointerup",event => release(event,false));
    viewport.addEventListener("pointercancel",event => release(event,true));

    root.querySelectorAll("[data-lrc-controls],[data-lrc-prev],[data-lrc-next]").forEach(node => node.remove());
    root.dataset.lrcMounted = "true";
    root.dataset.lrcContract = CONTRACT;
    root.dataset.lrcReferenceContract = REFERENCE;
    root.dataset.lrcTabCount = String(cards.length);
    render("init");
  }

  fetch(mapUrl,{ credentials:"same-origin" })
    .then(response => { if (!response.ok) throw new Error(`route-card-map:${response.status}`); return response.json(); })
    .then(map => document.querySelectorAll("[data-laws-room-carousel]").forEach(root => mount(root,map)))
    .catch(error => document.documentElement.dataset.lrcMapFailure = error?.message || "route-card-map-unavailable");
})();