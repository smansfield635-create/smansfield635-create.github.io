from __future__ import annotations
import json, platform
from pathlib import Path
import pandas as pd
from ai4i import run as ai4i_run
from hydraulic import run as hydraulic_run
from naval import run as naval_run
ROOT=Path(__file__).resolve().parent
BOUNDARY="Prospective exact-head analysis of third-party UCI datasets using theory-team-defined feature partitions and models. The datasets are externally authored, but the analysis is not independently conducted and does not establish a universal law."
def primary(system,model):
    metric=system["primary_metric"]
    if metric=="average_precision": return float(system["models"][model]["average_precision"])
    if metric=="macro_f1": return float(system["models"][model]["macro_f1"])
    return -float(system["models"][model]["normalized_rmse"])
def main():
    systems=[ai4i_run(),hydraulic_run(),naval_run()]; wins=near=0
    for s in systems:
        r,o,b=primary(s,"route_relational"),primary(s,"output_history"),primary(s,"black_box_full"); s["comparisons"]={"route_minus_output_primary":r-o,"route_minus_black_box_primary":r-b,"route_beats_output":r>o,"route_within_5_percent_of_black_box":r>=b-.05*max(abs(b),1e-12)}; wins+=int(s["comparisons"]["route_beats_output"]); near+=int(s["comparisons"]["route_within_5_percent_of_black_box"])
    disposition="BRIDGE_SURVIVES_EXTERNAL_DATA_TEST" if wins>=2 and near>=2 else ("BRIDGE_REDUNDANT_OR_INFERIOR" if wins==0 else "BRIDGE_MIXED")
    result={"operation":"EXTERNALLY_SOURCED_UCI_MULTI_SYSTEM_IDENTITY_CONDITIONED_REACHABILITY_BRIDGE_v1","result_class":"PROSPECTIVE_EXACT_HEAD_EXTERNAL_DATA_BRIDGE","scientific_boundary":BOUNDARY,"environment":{"python":platform.python_version(),"pandas":pd.__version__},"frozen_decision_rule":{"route_beats_output_minimum":"2_of_3_systems","route_within_5_percent_of_black_box_minimum":"2_of_3_systems","terminal_dispositions":["BRIDGE_SURVIVES_EXTERNAL_DATA_TEST","BRIDGE_REDUNDANT_OR_INFERIOR","BRIDGE_MIXED","UNEVALUABLE_DATA_OR_EXECUTION_FAILURE"]},"systems":systems,"summary":{"systems":3,"route_beats_output":f"{wins}/3","route_within_5_percent_of_black_box":f"{near}/3","disposition":disposition,"claim_limit":BOUNDARY}}
    (ROOT/"uci-execution-report.json").write_text(json.dumps(result,indent=2,sort_keys=True,allow_nan=False)+"\n"); print(json.dumps(result["summary"],indent=2,sort_keys=True))
if __name__=="__main__": main()
