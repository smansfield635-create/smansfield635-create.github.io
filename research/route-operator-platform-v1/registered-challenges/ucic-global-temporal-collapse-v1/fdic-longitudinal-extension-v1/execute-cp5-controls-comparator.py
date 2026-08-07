#!/usr/bin/env python3
import json
import pathlib
import statistics
from datetime import datetime, timezone

ROOT = pathlib.Path(__file__).resolve().parent
CP1 = json.load((ROOT / "checkpoint-1-protocol-freeze.v1.json").open())
CP2 = json.load((ROOT / "checkpoint-2-failure-source-extraction.v1.json").open())
CP3 = json.load((ROOT / "checkpoint-3-control-match-freeze.v1.json").open())
CP4OPS = json.load((ROOT / "checkpoint-4-operationalization-freeze.v1.json").open())
CP4 = json.load((ROOT / "checkpoint-4-warning-execution.v1.json").open())
CP5OPS = json.load((ROOT / "checkpoint-5-operationalization-freeze.v1.json").open())
OUT = ROOT / "checkpoint-5-comparator-false-positive-execution.v1.json"

for name, obj, expected in [
    ("CP1", CP1, "PASS_CLOSED"),
    ("CP2", CP2, "PASS_CLOSED"),
    ("CP3", CP3, "PASS_CLOSED"),
    ("CP4OPS", CP4OPS, "PASS_CLOSED"),
    ("CP4", CP4, "PASS_CLOSED"),
    ("CP5OPS", CP5OPS, "PASS_CLOSED"),
]:
    if obj.get("status") != expected:
        raise SystemExit(f"{name}_NOT_{expected}")


def dkey(value):
    return str(value or "").replace("-", "")[:8]


def pdate(value):
    return datetime.strptime(dkey(value), "%Y%m%d").date()


def num(value):
    try:
        if value is None:
            return None
        return float(value)
    except Exception:
        return None


def avg_tie_rank(values, current, higher_healthier=True):
    vals = [float(x) for x in values]
    ordered = sorted(vals, reverse=not higher_healthier)
    positions = [i + 1 for i, value in enumerate(ordered) if value == float(current)]
    if not positions:
        raise ValueError("CURRENT_NOT_IN_WINDOW")
    return sum(positions) / len(positions)


def quarter_states(rows):
    rows = sorted(rows, key=lambda row: dkey(row.get("REPDTE")))
    orientations = {
        "CAPITAL_CUSHION": True,
        "LOAN_FUNDING_STRAIN": False,
        "EARNINGS_CAPACITY": True,
        "MARGIN_CAPACITY": True,
        "DEPOSIT_CONTINUITY": True,
    }
    histories = {key: [] for key in orientations}
    base = []
    prev_dep = None
    for row in rows:
        asset = num(row.get("ASSET"))
        dep = num(row.get("DEP"))
        eq = num(row.get("EQ"))
        loans = num(row.get("LNLSNET"))
        roa = num(row.get("ROA"))
        nimy = num(row.get("NIMY"))
        factors = {
            "CAPITAL_CUSHION": eq / asset if asset not in (None, 0) and eq is not None else None,
            "LOAN_FUNDING_STRAIN": loans / dep if dep not in (None, 0) and loans is not None else None,
            "EARNINGS_CAPACITY": roa,
            "MARGIN_CAPACITY": nimy,
            "DEPOSIT_CONTINUITY": (dep / prev_dep) - 1 if dep is not None and prev_dep not in (None, 0) else None,
        }
        base.append({"report_date": dkey(row.get("REPDTE")), "factors": factors})
        if dep is not None:
            prev_dep = dep

    result = []
    prev_two_impaired = False
    prev_additive_low = False
    for item in base:
        ranks = {}
        impaired = {}
        for key, higher_healthier in orientations.items():
            value = item["factors"][key]
            if value is None:
                ranks[key] = None
                impaired[key] = None
                continue
            histories[key].append(value)
            if len(histories[key]) < 9:
                ranks[key] = None
                impaired[key] = None
                continue
            window = histories[key][-9:]
            rank = avg_tie_rank(window, value, higher_healthier)
            ranks[key] = rank
            impaired[key] = bool(rank <= 2.0)

        evaluable_ranks = [rank for rank in ranks.values() if rank is not None]
        evaluable_count = len(evaluable_ranks)
        impaired_count = sum(flag is True for flag in impaired.values())
        warning_evaluable = evaluable_count >= 2
        two_impaired = warning_evaluable and impaired_count >= 2
        acute = warning_evaluable and impaired_count >= 3
        persistent = bool(two_impaired and prev_two_impaired)
        ucic_warning = bool(acute or persistent)

        additive_score = (
            statistics.fmean(rank / 9.0 for rank in evaluable_ranks)
            if warning_evaluable
            else None
        )
        additive_low = bool(additive_score is not None and additive_score <= (1.0 / 3.0))
        additive_warning = bool(additive_low and prev_additive_low)

        result.append({
            "report_date": item["report_date"],
            "health_ranks_1_to_9": ranks,
            "evaluable_factor_count": evaluable_count,
            "impaired_factor_count": impaired_count,
            "warning_evaluable": warning_evaluable,
            "ucic_warning": ucic_warning,
            "additive_normalized_mean_rank": additive_score,
            "additive_low_quarter": additive_low,
            "additive_warning": additive_warning,
        })
        prev_two_impaired = two_impaired
        prev_additive_low = additive_low
    return result


def indexed_summary(states, index_date_text, label):
    index_date = datetime.strptime(index_date_text, "%Y-%m-%d").date()
    pre = [state for state in states if pdate(state["report_date"]) < index_date]
    evaluable = any(state["warning_evaluable"] for state in pre)

    def warning_side(field):
        warnings = [state for state in pre if state[field]]
        first = min(warnings, key=lambda state: state["report_date"]) if warnings else None
        lead = (index_date - pdate(first["report_date"])).days if first else None
        return {
            "first_warning_date": first["report_date"] if first else None,
            "lead_days": lead,
            "detected_pre_index": bool(first and lead > 0),
            "actionable_30d": bool(first and lead >= 30),
            "early_90d": bool(first and lead >= 90),
        }

    return {
        "label": label,
        "index_date": index_date_text,
        "evaluable": evaluable,
        "ucic": warning_side("ucic_warning"),
        "additive": warning_side("additive_warning"),
    }


# Failure-side additive comparator, using the same committed failed-bank rows.
failed_records = {int(record["cert"]): record for record in CP2["records"]}
failed_summaries = []
for bank in CP1["failure_cohort"]:
    cert = int(bank["cert"])
    states = quarter_states(failed_records[cert]["rows"])
    summary = indexed_summary(states, bank["faildate"], "FAILED_BANK")
    summary.update({"cert": cert, "name": bank["name"]})
    failed_summaries.append(summary)

# Controls are frozen in CP3. The primary unit is the matched assignment, not
# the unique institution, because each assignment has its own pseudo-index.
control_histories = {int(item["cert"]): item["rows"] for item in CP3["control_histories"]}
control_assignments = []
for assignment in CP3["failed_assignments"]:
    pseudo_date = assignment["faildate"]
    for control in assignment["controls"]:
        cert = int(control["cert"])
        states = quarter_states(control_histories[cert])
        summary = indexed_summary(states, pseudo_date, "MATCHED_CONTROL_ASSIGNMENT")
        summary.update({
            "failed_cert_anchor": int(assignment["failed_cert"]),
            "failed_name_anchor": assignment["failed_name"],
            "control_cert": cert,
            "control_name": control.get("name"),
            "control_bkclass": control.get("bkclass"),
            "match_report_date": assignment["match_report_date"],
        })
        control_assignments.append(summary)


def failure_metrics(method):
    evaluable = [item for item in failed_summaries if item["evaluable"]]
    detected = [item for item in evaluable if item[method]["detected_pre_index"]]
    leads = [item[method]["lead_days"] for item in detected]
    return {
        "evaluable_failed_banks": len(evaluable),
        "pre_failure_detections": len(detected),
        "sensitivity": len(detected) / len(evaluable) if evaluable else None,
        "actionable_30d_detections": sum(item[method]["actionable_30d"] for item in evaluable),
        "early_90d_detections": sum(item[method]["early_90d"] for item in evaluable),
        "median_lead_days_detected": statistics.median(leads) if leads else None,
    }


def control_metrics(method):
    evaluable = [item for item in control_assignments if item["evaluable"]]
    false_positive = [item for item in evaluable if item[method]["detected_pre_index"]]
    fpr = len(false_positive) / len(evaluable) if evaluable else None
    return {
        "evaluable_control_assignments": len(evaluable),
        "false_positive_assignments": len(false_positive),
        "false_positive_rate": fpr,
        "unique_control_institutions": len({item["control_cert"] for item in evaluable}),
    }


ucic_failure = failure_metrics("ucic")
ucic_control = control_metrics("ucic")
add_failure = failure_metrics("additive")
add_control = control_metrics("additive")

ucic = {**ucic_failure, **ucic_control}
additive = {**add_failure, **add_control}
ucic["discrimination_margin"] = (
    ucic["sensitivity"] - ucic["false_positive_rate"]
    if ucic["sensitivity"] is not None and ucic["false_positive_rate"] is not None
    else None
)
additive["discrimination_margin"] = (
    additive["sensitivity"] - additive["false_positive_rate"]
    if additive["sensitivity"] is not None and additive["false_positive_rate"] is not None
    else None
)

thresholds = CP1["continuation_thresholds"]
ucic_gates = {
    "minimum_evaluable_failures": ucic["evaluable_failed_banks"] >= thresholds["minimum_evaluable_failures"],
    "minimum_ucic_sensitivity": ucic["sensitivity"] is not None and ucic["sensitivity"] >= thresholds["minimum_ucic_sensitivity"],
    "minimum_actionable_30d_failures": ucic["actionable_30d_detections"] >= thresholds["minimum_actionable_30d_failures"],
    "minimum_median_lead_days": ucic["median_lead_days_detected"] is not None and ucic["median_lead_days_detected"] >= thresholds["minimum_median_lead_days"],
    "minimum_evaluable_controls": ucic["evaluable_control_assignments"] >= thresholds["minimum_evaluable_controls"],
    "maximum_ucic_false_positive_rate": ucic["false_positive_rate"] is not None and ucic["false_positive_rate"] <= thresholds["maximum_ucic_false_positive_rate"],
    "minimum_discrimination_margin": ucic["discrimination_margin"] is not None and ucic["discrimination_margin"] >= thresholds["minimum_discrimination_margin"],
}

add_thresholds = CP5OPS["additive_analogous_thresholds"]
additive_gates = {
    "minimum_evaluable_failures": additive["evaluable_failed_banks"] >= add_thresholds["minimum_evaluable_failures"],
    "minimum_sensitivity": additive["sensitivity"] is not None and additive["sensitivity"] >= add_thresholds["minimum_sensitivity"],
    "minimum_actionable_30d_failures": additive["actionable_30d_detections"] >= add_thresholds["minimum_actionable_30d_failures"],
    "minimum_median_lead_days": additive["median_lead_days_detected"] is not None and additive["median_lead_days_detected"] >= add_thresholds["minimum_median_lead_days"],
    "minimum_evaluable_control_assignments": additive["evaluable_control_assignments"] >= add_thresholds["minimum_evaluable_control_assignments"],
    "maximum_false_positive_rate": additive["false_positive_rate"] is not None and additive["false_positive_rate"] <= add_thresholds["maximum_false_positive_rate"],
    "minimum_discrimination_margin": additive["discrimination_margin"] is not None and additive["discrimination_margin"] >= add_thresholds["minimum_discrimination_margin"],
}

ucic_all = all(ucic_gates.values())
additive_all = all(additive_gates.values())
weak_dominance = bool(
    additive_all
    and additive["sensitivity"] >= ucic["sensitivity"]
    and additive["false_positive_rate"] <= ucic["false_positive_rate"]
    and additive["median_lead_days_detected"] >= ucic["median_lead_days_detected"]
)

if ucic["evaluable_failed_banks"] < 9 or ucic["evaluable_control_assignments"] < 18:
    candidate = "UNEVALUABLE_FDIC_DATA_OR_CONTROL_MATCH_FAILURE"
elif not ucic_all:
    candidate = "FDIC_LONGITUDINAL_EARLY_WARNING_NOT_SUPPORTED"
elif weak_dominance:
    candidate = "FDIC_LONGITUDINAL_EARLY_WARNING_REDUNDANT_WITH_ADDITIVE_COMPARATOR"
elif additive_all:
    candidate = "FDIC_LONGITUDINAL_EARLY_WARNING_SUPPORTED_WITH_LIMITATIONS"
else:
    candidate = "FDIC_LONGITUDINAL_EARLY_WARNING_SUPPORTED"

result = {
    "operation": "UCIC_ARM_B_FDIC_LONGITUDINAL_COLLAPSE_EARLY_WARNING_EXTENSION_v1",
    "checkpoint": "CP5_COMPARATOR_AND_FALSE_POSITIVE_EXECUTION",
    "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    "status": "PASS_CLOSED",
    "matched_control_unit": "MATCHED_CONTROL_ASSIGNMENT",
    "assignment_count": len(control_assignments),
    "unique_control_count": len({item["control_cert"] for item in control_assignments}),
    "ucic_metrics": ucic,
    "ucic_threshold_gates": ucic_gates,
    "ucic_all_continuation_thresholds_pass": ucic_all,
    "additive_metrics": additive,
    "additive_analogous_threshold_gates": additive_gates,
    "additive_all_analogous_thresholds_pass": additive_all,
    "additive_weak_dominance": weak_dominance,
    "failed_bank_method_summaries": failed_summaries,
    "control_assignment_summaries": control_assignments,
    "candidate_terminal_disposition_under_frozen_mapping": candidate,
    "terminal_authority": "CP6_ONLY",
    "next_checkpoint": "CP6_TERMINAL_ADJUDICATION_AND_PAGE_READY_RECORD",
}
OUT.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
print(json.dumps({
    "checkpoint": result["checkpoint"],
    "status": result["status"],
    "ucic": ucic,
    "ucic_gates": ucic_gates,
    "additive": additive,
    "additive_gates": additive_gates,
    "additive_weak_dominance": weak_dominance,
    "candidate_terminal_disposition": candidate,
}, sort_keys=True))
