from __future__ import annotations
import json, re
from pathlib import Path
ROOT=Path(__file__).resolve().parent
HEX=re.compile(r'^[0-9a-f]{64}$')
def load(name): return json.loads((ROOT/name).read_text(encoding='utf-8'))
def main():
    frozen=load('FROZEN_CONTRACT_POINTER.json')
    package=load('EXECUTION_PACKAGE_POINTER.json')
    result=load('RESULT_SUMMARY.json')
    assert frozen['freeze_status']=='FROZEN_BEFORE_SUCCESSOR_EXECUTION'
    assert frozen['execution_performed'] is False
    assert package['package_id']==result['contract_id']==frozen['contract_id']
    assert package['governing_main_head']==frozen['governing_main_head']=='5123ad418fcb1b88795470120e4632705ceaf288'
    assert package['frozen_contract_zip_sha256']==frozen['frozen_contract_zip_sha256']
    assert package['analysis_code_sha256']==frozen['analysis_code_sha256']
    for field in ['frozen_contract_zip_sha256','execution_package_zip_sha256','analysis_code_sha256','verification_code_sha256','model_results_receipt_sha256']:
        assert HEX.fullmatch(package[field]),field
    assert package['model_results_receipt_sha256']==result['model_results_receipt_sha256']
    assert package['verification_status']=='PASS_EXACT_INDEPENDENT_PRIMARY_REPRODUCTION'
    assert package['reproduced_primary_models']==9
    assert package['execution_package_file_count']==18
    assert package['core_mutation_performed'] is False and result['core_mutation_performed'] is False
    assert package['archived_result_mutation_performed'] is False and result['archived_result_mutation_performed'] is False
    assert result['primary_result_category']=='FACTORIAL_TEMPORAL_INCREMENT_NOT_ESTABLISHED_IN_AGRICULTURAL_PANEL'
    rmse=result['primary_rmse']
    assert rmse['OUTCOME_STATIC'] < rmse['MULTIPLICATIVE_FULL']
    assert rmse['ADDITIVE_FULL'] < rmse['MULTIPLICATIVE_FULL']
    assert rmse['MULTIPLICATIVE_DIRECTION'] > rmse['MULTIPLICATIVE_STATIC']
    assert rmse['MULTIPLICATIVE_PERSISTENCE'] > rmse['MULTIPLICATIVE_DIRECTION']
    assert result['bottleneck_identity_set']==['varroa']
    print(json.dumps({'status':'PASS','checks':23,'package_sha256':package['execution_package_zip_sha256'],'result_receipt_sha256':result['model_results_receipt_sha256']},sort_keys=True))
    return 0
if __name__=='__main__': raise SystemExit(main())
