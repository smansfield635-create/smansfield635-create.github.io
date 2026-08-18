from __future__ import annotations
from pathlib import Path
from typing import Any, Mapping
import hashlib,json
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
MANIFEST=HERE/'PUBLIC_RELEASE_RECORD_MANIFEST_SHA256_v4.json'
RELEASE_ID='IMI_H_EARTH_COAST_ENTRY_TO_GRATITUDE_INITIAL_PRESENTATION_DEPLOYABLE_RELEASE_v4'
ROUTE_ID='H_EARTH_COAST_ENTRY_TO_GRATITUDE_INITIAL_PRESENTATION_v4'
BUNDLE_SHA='49162b7ff730a9efc71bd2151ad00b34e8b9f46271018a015defb5534c7fb3b2'
EXEC_RECEIPT='97b2db06e833dc2e92fdeba57bffdec59dd878141f30806114ec36862e7ab91a'
CONTROLLED={'.github/workflows/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v4-conformance.yml','research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v4/IMI_BYTE_CUSTODY_RECEIPT_v1.json','research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v4/IMI_EXECUTABLE_RELEASE_RECEIPT_v4.json','research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v4/README.md','research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v4/RELEASE_POINTER.json','research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v4/verify_release_records_v4.py'}
def canon(v:Mapping[str,Any])->str:return hashlib.sha256(json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
def fsha(p:Path)->str:return hashlib.sha256(p.read_bytes()).hexdigest()
def load(p:Path,e:list[str])->dict[str,Any]:
 try:
  v=json.loads(p.read_text());
  if not isinstance(v,dict):raise ValueError()
  return v
 except Exception:e.append('INVALID_JSON:'+str(p.relative_to(ROOT)));return {}
def req(x:bool,c:str,e:list[str]):
 if not x:e.append(c)
def receipt(v:Mapping[str,Any],label:str,e:list[str]):
 claimed=v.get('receipt_sha256');p=dict(v);p.pop('receipt_sha256',None);req(isinstance(claimed,str) and canon(p)==claimed,label+'_RECEIPT_HASH_MISMATCH',e)
def main():
 e=[];m=load(MANIFEST,e);files=m.get('files');req(m.get('release_id')==RELEASE_ID,'MANIFEST_RELEASE_ID',e);req(isinstance(files,dict),'MANIFEST_FILES',e)
 if isinstance(files,dict):
  req(set(files)==CONTROLLED,'MANIFEST_PATH_SET',e)
  for rel,d in files.items():
   p=ROOT/rel;req(p.is_file(),'MISSING:'+rel,e);req(not p.is_file() or fsha(p)==d,'DIGEST:'+rel,e)
 pointer=load(HERE/'RELEASE_POINTER.json',e);custody=load(HERE/'IMI_BYTE_CUSTODY_RECEIPT_v1.json',e);release=load(HERE/'IMI_EXECUTABLE_RELEASE_RECEIPT_v4.json',e)
 receipt(custody,'CUSTODY',e);receipt(release,'RELEASE',e)
 expected={'release_id':RELEASE_ID,'release_version':'4.0.0','release_bundle_sha256':BUNDLE_SHA,'release_bundle_size_bytes':73711,'release_bundle_file_count':44,'drive_folder_id':'1CgobLUPWO4Pl68OUeW6SfbRclxIM2IlF','drive_file_id':'1TEzUwAxqGxmKrjDOsG92bC8F1Wnz5yHI','route_id':ROUTE_ID,'route_version':'4.0.0','observer_grade_imi_instrument_available':True,'empirical_reliability_and_validity':'OPEN'}
 for k,v in expected.items():req(pointer.get(k)==v,'POINTER_'+k.upper(),e)
 req(pointer.get('executable_release_receipt_sha256')==EXEC_RECEIPT,'POINTER_EXEC_RECEIPT',e)
 dep=pointer.get('private_imi_dependency') or {};req(dep.get('zip_sha256')=='0be0608fa9aab10d75eeba796530421e96efc7829364172e52f7925ca74d9c87','CORE_SHA',e);req(dep.get('repository_mirror') is False,'CORE_MIRROR',e)
 pred=pointer.get('predecessor_release') or {};req(pred.get('route_id')=='H_EARTH_COAST_ENTRY_TO_GRATITUDE_INITIAL_PRESENTATION_v3' and pred.get('route_version')=='3.0.0' and pred.get('merge_commit_sha')=='4b5527fee92f45c93c72e20214900cee7d30edae','PREDECESSOR_IDENTITY',e)
 req(pointer.get('v1_immutable') is True and pointer.get('v2_immutable') is True and pointer.get('v3_immutable') is True,'HISTORICAL_IMMUTABILITY',e)
 req(pointer.get('imi_core_changed') is False and pointer.get('reset_mathematics_changed') is False and pointer.get('h_earth_product_changed') is False,'SCOPE_BOUNDARY',e)
 checks=release.get('checks') or {};req(release.get('release_state')=='PASS' and release.get('route_id')==ROUTE_ID and release.get('route_version')=='4.0.0','RELEASE_STATE',e);req(checks.get('manifest_relative_reset') is True,'RESET_CHECK',e);req(checks.get('route_identity_consistency') is True,'IDENTITY_CHECK',e);req(release.get('deployment_training_cases_passed')==16,'TRAINING_COUNT',e);req(release.get('false_positive_terminal_cases')==0,'FALSE_TERMINAL',e)
 text=(HERE/'README.md').read_text()
 for token in ['OBSERVER_GRADE_IMI_INSTRUMENT_AVAILABLE','route identity','17 tests pass',BUNDLE_SHA,'Empirical reliability and validity remain open']:req(token in text,'README:'+token,e)
 e=sorted(set(e));out={'receipt_id':'IMI_COAST_TO_GRATITUDE_V4_REPOSITORY_CONFORMANCE_RECEIPT','release_id':RELEASE_ID,'release_version':'4.0.0','status':'PASS' if not e else 'FAIL','route_id':ROUTE_ID,'route_version':'4.0.0','route_identity_consistency':not e,'manifest_relative_reset_preserved':not e,'v1_immutable':True,'v2_immutable':True,'v3_immutable':True,'bundle_sha256':BUNDLE_SHA,'executable_release_receipt_sha256':EXEC_RECEIPT,'public_manifest_controlled_path_count':len(files) if isinstance(files,dict) else 0,'empirical_reliability_and_validity':'OPEN','errors':e};out['receipt_sha256']=canon(out);print(json.dumps(out,indent=2,sort_keys=True));raise SystemExit(1 if e else 0)
if __name__=='__main__':main()
