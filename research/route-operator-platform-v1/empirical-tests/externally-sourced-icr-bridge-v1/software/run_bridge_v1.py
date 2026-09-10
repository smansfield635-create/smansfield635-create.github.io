from __future__ import annotations
import json, platform
from dataclasses import asdict
from importlib.metadata import version
from pathlib import Path
from model import ExternalSystem, Outcome
from systems_crypto_schema import CryptoSystem, SchemaSystem
from systems_graph_image import GraphSystem, ImageSystem

ROOT = Path(__file__).resolve().parent
OPERATION = "EXTERNALLY_AUTHORED_SOFTWARE_IDENTITY_CONDITIONED_REACHABILITY_BRIDGE_v1"
BOUNDARY = "Exploratory bridge over externally authored software implementations under theory-team-designed wrappers and interventions. This is not a preregistered natural-system test, independent human replication, or validation of a universal law."

def infer_relations(training): return {row["relation"] for row in training if not row["outcome"]["original_challenge_pass"]}
def route_prediction(kind: str, constitutive: bool):
    if kind == "support": return True, not constitutive, "external_support"
    if kind == "decoy_ablation": return True, True, "endogenous"
    if kind == "unrelated_capacity": return (False,False,"endogenous") if constitutive else (True,True,"endogenous")
    if kind == "substitute": return True, False, "functional_substitute"
    if kind == "restore": return True, True, "endogenous"
    if kind == "withdrawal": return (False,False,"endogenous") if constitutive else (True,True,"endogenous")
    raise ValueError(kind)
def output_prediction(actual: Outcome): return actual.visible_pass, actual.visible_pass, "endogenous"
def additive_prediction(actual: Outcome, kind: str): return (True,True,"endogenous") if kind == "unrelated_capacity" else output_prediction(actual)
def triplet(outcome: Outcome): return outcome.visible_pass, outcome.original_challenge_pass, outcome.provenance

def main() -> None:
    systems: list[ExternalSystem] = [CryptoSystem(), SchemaSystem(), GraphSystem(), ImageSystem()]
    result = {"operation":OPERATION,"result_class":"EXPLORATORY_POST_HOC_EXTERNAL_SOFTWARE_BRIDGE","scientific_boundary":BOUNDARY,"environment":{"python":platform.python_version(),"cryptography":version("cryptography"),"jsonschema":version("jsonschema"),"networkx":version("networkx"),"Pillow":version("Pillow")},"systems":[]}
    total = route_ok_total = output_ok_total = additive_ok_total = exact_total = matched_systems = route_matched = output_matched = 0
    for system in systems:
        training = [{"relation":r,"outcome":asdict(system.ablate(r))} for r in system.relations + system.decoys]
        recovered = infer_relations(training); exact = recovered == set(system.relations); exact_total += int(exact)
        constitutive, decoy = system.relations[1], system.decoys[0]
        actuals = {"support":system.support_after_ablation(constitutive),"decoy_ablation":system.ablate(decoy),"unrelated_capacity":system.unrelated_capacity_after_ablation(constitutive),"substitute":system.substitute(),"restore":system.restore(constitutive),"withdrawal":system.withdrawal_after_support(constitutive)}
        held = []
        for kind, actual in actuals.items():
            is_constitutive = (constitutive in recovered if kind != "decoy_ablation" else decoy in recovered)
            if kind in {"substitute","restore"}: is_constitutive = kind == "restore"
            rp, op, ap = route_prediction(kind,is_constitutive), output_prediction(actual), additive_prediction(actual,kind); truth = triplet(actual)
            rok, ook, aok = rp == truth, op == truth, ap == truth
            total += 1; route_ok_total += int(rok); output_ok_total += int(ook); additive_ok_total += int(aok)
            held.append({"kind":kind,"actual":asdict(actual),"route_aware_pass":rok,"output_only_pass":ook,"additive_pass":aok})
        baseline, support, substitute = system.baseline(), actuals["support"], actuals["substitute"]
        cases = [baseline,support,substitute]; matched = all(x.visible_pass for x in cases) and [x.original_challenge_pass for x in cases] == [True,False,False]; matched_systems += int(matched)
        rpred = [(True,True,"endogenous"),route_prediction("support",True),route_prediction("substitute",False)]; opred = [output_prediction(x) for x in cases]
        rc = sum(int(p == triplet(x)) for p,x in zip(rpred,cases)); oc = sum(int(p == triplet(x)) for p,x in zip(opred,cases)); route_matched += rc; output_matched += oc
        result["systems"].append({"system_id":system.system_id,"external_package":system.package,"candidate_relations":list(system.relations+system.decoys),"recovered_constitutive_relations":sorted(recovered),"truth_constitutive_relations":list(system.relations),"exact_relation_recovery":exact,"training":training,"held_out":held,"matched_output_discrimination":matched,"matched_output_scores":{"route_aware":f"{rc}/3","output_continuity_identity":f"{oc}/3"},"baseline":asdict(baseline)})
    survived = exact_total == len(systems) and route_ok_total == total and matched_systems == len(systems)
    result["summary"] = {"systems":len(systems),"exact_relation_recovery":f"{exact_total}/{len(systems)}","held_out_predictions":{"route_aware":f"{route_ok_total}/{total}","output_continuity_identity":f"{output_ok_total}/{total}","additive_capacity":f"{additive_ok_total}/{total}"},"matched_output_discrimination":{"systems":f"{matched_systems}/{len(systems)}","route_aware_cases":f"{route_matched}/{len(systems)*3}","output_continuity_identity_cases":f"{output_matched}/{len(systems)*3}"},"disposition":"EXTERNAL_SOFTWARE_SYSTEMS_SURVIVED_EXPLORATORY_BRIDGE" if survived else "EXPLORATORY_BRIDGE_DID_NOT_FULLY_SURVIVE","claim_limit":BOUNDARY}
    (ROOT/"execution-report.json").write_text(json.dumps(result,indent=2,sort_keys=True)+"\n"); print(json.dumps(result["summary"],indent=2,sort_keys=True))
if __name__ == "__main__": main()
