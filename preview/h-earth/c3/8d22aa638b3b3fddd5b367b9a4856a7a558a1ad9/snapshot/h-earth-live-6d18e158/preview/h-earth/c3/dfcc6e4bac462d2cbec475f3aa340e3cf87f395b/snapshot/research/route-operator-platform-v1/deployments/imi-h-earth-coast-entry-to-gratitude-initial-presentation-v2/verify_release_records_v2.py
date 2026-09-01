from __future__ import annotations
from pathlib import Path
from typing import Any, Mapping
import hashlib, json
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
MANIFEST=HERE/'PUBLIC_RELEASE_RECORD_MANIFEST_SHA256_v2.json'
RELEASE_ID='IMI_H_EARTH_COAST_ENTRY_TO_GRATITUDE_INITIAL_PRESENTATION_DEPLOYABLE_RELEASE_v2'
RELEASE_VERSION='2.0.0'
ROUTE_ID='H_EARTH_COAST_ENTRY_TO_GRATITUDE_INITIAL_PRESENTATION_v2'
ROUTE_VERSION='2.0.0'
BUNDLE_SHA='5f669f26bf7910da3e59efa01c0780c70d7bab1e08237d42c9626ff6767fe3a0'
BUNDLE_SIZE=68506
BUNDLE_COUNT=42
DRIVE_FOLDER='1Dlmg0Obm7BJJ9vB0mHwMwXxDP9fB7LuE'
DRIVE_FILE='1A_FgrvsN-sugszgmll4fO-CGCVHNIPir'
CORE_SHA='0be0608fa9aab10d75eeba796530421e96efc7829364172e52f7925ca74d9c87'
PLATFORM_MERGE='cffa9889430d6700c3fad548d29dfada3dd04e61'
PREDECESSOR_MERGE='2e2d6636bffb54aef5d1b65e7ed87ba2b3cba02a'
CONTROLLED={
 '.github/workflows/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v2-conformance.yml',
 'research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v2/IMI_BYTE_CUSTODY_RECEIPT_v1.json',
 'research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v2/IMI_EXECUTABLE_RELEASE_RECEIPT_v2.json',
 'research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v2/README.md',
 'research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v2/RELEASE_POINTER.json',
 'research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v2/verify_release_records_v2.py',
}
def canonical(value: Mapping[str,Any])->str: return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def csha(value: Mapping[str,Any])->str: return hashlib.sha256(canonical(value).encode()).hexdigest()
def fsha(path:Path)->str: return hashlib.sha256(path.read_bytes()).hexdigest()
def load(path:Path,errors:list[str])->dict[str,Any]:
 try: v=json.loads(path.read_text())
 except Exception as exc: errors.append(f'INVALID_JSON:{path.name}:{type(exc).__name__}'); return {}
 if not isinstance(v,dict): errors.append(f'JSON_ROOT_NOT_OBJECT:{path.name}'); return {}
 return v
def req(cond:bool,code:str,errors:list[str]):
 if not cond: errors.append(code)
def req_fields(actual:Mapping[str,Any],expected:Mapping[str,Any],prefix:str,errors:list[str]):
 for k,v in expected.items(): req(actual.get(k)==v,f'{prefix}_{k.upper()}_MISMATCH',errors)
def verify_receipt(v:Mapping[str,Any],label:str,errors:list[str]):
 claimed=v.get('receipt_sha256'); req(isinstance(claimed,str) and len(claimed)==64,f'{label}_RECEIPT_SHA_INVALID',errors)
 if isinstance(claimed,str):
  p=dict(v); p.pop('receipt_sha256',None); req(csha(p)==claimed,f'{label}_RECEIPT_HASH_MISMATCH',errors)
def main():
 errors=[]; manifest=load(MANIFEST,errors); files=manifest.get('files')
 req(manifest.get('release_id')==RELEASE_ID,'MANIFEST_RELEASE_ID_MISMATCH',errors); req(manifest.get('manifest_version')=='2.0.0','MANIFEST_VERSION_MISMATCH',errors); req(isinstance(files,dict),'MANIFEST_FILES_INVALID',errors)
 if isinstance(files,dict):
  req(set(files)==CONTROLLED,'MANIFEST_PATH_SET_MISMATCH',errors)
  for rel,digest in files.items():
   p=ROOT/rel; req(p.is_file(),f'MANIFEST_FILE_MISSING:{rel}',errors)
   if p.is_file(): req(fsha(p)==digest,f'MANIFEST_DIGEST_MISMATCH:{rel}',errors)
 pointer=load(HERE/'RELEASE_POINTER.json',errors); custody=load(HERE/'IMI_BYTE_CUSTODY_RECEIPT_v1.json',errors); release=load(HERE/'IMI_EXECUTABLE_RELEASE_RECEIPT_v2.json',errors); readme=(HERE/'README.md').read_text() if (HERE/'README.md').is_file() else ''
 verify_receipt(custody,'CUSTODY',errors); verify_receipt(release,'RELEASE',errors)
 req_fields(pointer,{'release_id':RELEASE_ID,'release_version':RELEASE_VERSION,'release_bundle_sha256':BUNDLE_SHA,'release_bundle_size_bytes':BUNDLE_SIZE,'release_bundle_file_count':BUNDLE_COUNT,'drive_folder_id':DRIVE_FOLDER,'drive_file_id':DRIVE_FILE,'route_id':ROUTE_ID,'route_version':ROUTE_VERSION,'successor_role':'AUTHORIZED_REPAIR_COMPARATIVE_EVALUATION','fixed_pitch_requirement_removed':True,'predeclared_correction_manifest_required':True,'orientation_alignment_numeric_equivalence_to_v1':False,'observer_grade_imi_instrument_available':True,'empirical_reliability_and_validity':'OPEN'},'POINTER',errors)
 dep=pointer.get('private_imi_dependency'); req(isinstance(dep,dict),'DEPENDENCY_INVALID',errors)
 if isinstance(dep,dict): req_fields(dep,{'package_id':'IMI_OBSERVER_GRADE_INSTRUMENT_v1','package_version':'1.0.0','zip_sha256':CORE_SHA,'custody_state':'BYTE_VERIFIED_EXTERNAL_INSTRUMENT_DEPENDENCY','repository_mirror':False,'runtime_mount_required':True},'DEPENDENCY',errors)
 plat=pointer.get('platform_binding'); req(isinstance(plat,dict),'PLATFORM_INVALID',errors)
 if isinstance(plat,dict): req_fields(plat,{'platform_id':'ROUTE_OPERATOR_RESEARCH_PLATFORM_v1','platform_version':'1.0.0','platform_merge_commit_sha':PLATFORM_MERGE},'PLATFORM',errors)
 pred=pointer.get('predecessor_binding'); req(isinstance(pred,dict),'PREDECESSOR_INVALID',errors)
 if isinstance(pred,dict): req_fields(pred,{'release_id':'IMI_H_EARTH_COAST_ENTRY_TO_GRATITUDE_INITIAL_PRESENTATION_DEPLOYABLE_RELEASE_v1','route_id':'H_EARTH_COAST_ENTRY_TO_GRATITUDE_INITIAL_PRESENTATION_v1','route_version':'1.0.0','merge_commit_sha':PREDECESSOR_MERGE,'historical_baseline_immutable':True},'PREDECESSOR',errors)
 req_fields(custody,{'custody_state':'BYTE_VERIFIED_EXTERNAL_INSTRUMENT_DEPENDENCY','expected_zip_sha256':CORE_SHA,'observed_zip_sha256':CORE_SHA,'zip_hash_match':True,'all_manifest_entries_match':True,'unmanifested_payload_files':[]},'CUSTODY',errors)
 req_fields(release,{'release_id':RELEASE_ID,'release_version':RELEASE_VERSION,'release_state':'PASS','observer_grade_imi_instrument_available':True,'empirical_reliability_and_validity':'OPEN','route_id':ROUTE_ID,'route_version':ROUTE_VERSION,'factor_dictionary_version':'2.0.0','observer_guide_version':'2.0.0','training_set_version':'2.0.0','analysis_plan_version':'2.0.0','original_snapshot_fixtures_passed':29,'original_temporal_fixtures_passed':4,'deployment_training_cases_passed':16,'terminal_positive_training_cases':1,'false_positive_terminal_cases':0,'errors':[]},'RELEASE',errors)
 checks=release.get('checks'); req(isinstance(checks,dict) and all(v is True for v in checks.values()),'RELEASE_CHECKS_NOT_ALL_TRUE',errors); req(pointer.get('executable_release_receipt_sha256')==release.get('receipt_sha256'),'POINTER_RELEASE_RECEIPT_MISMATCH',errors)
 for token in ['OBSERVER_GRADE_IMI_INSTRUMENT_AVAILABLE',ROUTE_ID,BUNDLE_SHA,CORE_SHA,'correction manifest','version-qualified v1→v2 comparison']:
  req(token in readme,f'README_TOKEN_MISSING:{token}',errors)
 errors=sorted(set(errors)); out={'receipt_id':'IMI_COAST_TO_GRATITUDE_V2_REPOSITORY_CONFORMANCE_RECEIPT','release_id':RELEASE_ID,'release_version':RELEASE_VERSION,'status':'PASS' if not errors else 'FAIL','observer_grade_imi_instrument_available':not errors,'empirical_reliability_and_validity':'OPEN','route_id':ROUTE_ID,'route_version':ROUTE_VERSION,'predecessor_merge_commit_sha':PREDECESSOR_MERGE,'platform_merge_commit_sha':PLATFORM_MERGE,'release_bundle_sha256':BUNDLE_SHA,'release_bundle_file_count':BUNDLE_COUNT,'private_imi_dependency_sha256':CORE_SHA,'executable_release_receipt_sha256':release.get('receipt_sha256'),'public_manifest_controlled_path_count':len(files) if isinstance(files,dict) else 0,'errors':errors}; out['receipt_sha256']=csha(out); print(json.dumps(out,indent=2,sort_keys=True)); raise SystemExit(1 if errors else 0)
if __name__=='__main__': main()
