from __future__ import annotations
from pathlib import Path
from typing import Any, Mapping
import hashlib, json
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
MANIFEST=HERE/'PUBLIC_RELEASE_RECORD_MANIFEST_SHA256_v3.json'
RELEASE_ID='IMI_H_EARTH_COAST_ENTRY_TO_GRATITUDE_INITIAL_PRESENTATION_DEPLOYABLE_RELEASE_v3'
ROUTE_ID='H_EARTH_COAST_ENTRY_TO_GRATITUDE_INITIAL_PRESENTATION_v3'
BUNDLE_SHA='871f58ca8e8dc39606d1cf37c5fd4575a0b093471c902902663b9a0a26e6e93b'
EXEC_RECEIPT='dd1e6d11585011944b10018707f41708d503a7fa57e64fb5495c777d039c7fd3'
CONTROLLED={'.github/workflows/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v3-conformance.yml','research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v3/IMI_BYTE_CUSTODY_RECEIPT_v1.json','research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v3/IMI_EXECUTABLE_RELEASE_RECEIPT_v3.json','research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v3/README.md','research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v3/RELEASE_POINTER.json','research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v3/verify_release_records_v3.py'}
def canon(v:Mapping[str,Any])->str: return hashlib.sha256(json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
def fsha(p:Path)->str: return hashlib.sha256(p.read_bytes()).hexdigest()
def load(p:Path,e:list[str])->dict[str,Any]:
 try:
  v=json.loads(p.read_text());
  if not isinstance(v,dict): raise ValueError()
  return v
 except Exception: e.append('INVALID_JSON:'+str(p.relative_to(ROOT))); return {}
def req(x:bool,c:str,e:list[str]):
 if not x:e.append(c)
def receipt(v:Mapping[str,Any],label:str,e:list[str]):
 claimed=v.get('receipt_sha256'); p=dict(v); p.pop('receipt_sha256',None); req(isinstance(claimed,str) and canon(p)==claimed,label+'_RECEIPT_HASH_MISMATCH',e)
def main():
 e=[]; m=load(MANIFEST,e); files=m.get('files'); req(m.get('release_id')==RELEASE_ID,'MANIFEST_RELEASE_ID',e); req(isinstance(files,dict),'MANIFEST_FILES',e)
 if isinstance(files,dict):
  req(set(files)==CONTROLLED,'MANIFEST_PATH_SET',e)
  for rel,d in files.items():
   p=ROOT/rel; req(p.is_file(),'MISSING:'+rel,e); req(not p.is_file() or fsha(p)==d,'DIGEST:'+rel,e)
 pointer=load(HERE/'RELEASE_POINTER.json',e); custody=load(HERE/'IMI_BYTE_CUSTODY_RECEIPT_v1.json',e); release=load(HERE/'IMI_EXECUTABLE_RELEASE_RECEIPT_v3.json',e)
 receipt(custody,'CUSTODY',e); receipt(release,'RELEASE',e)
 expected={'release_id':RELEASE_ID,'release_version':'3.0.0','release_bundle_sha256':BUNDLE_SHA,'release_bundle_size_bytes':72597,'release_bundle_file_count':44,'drive_folder_id':'1Dk-6dqjQ09w9a9bVhyh5_bjX3qcJMM8Q','drive_file_id':'1U0muLHB2vA390B6plzpNzz5yIZT2wRt2','route_id':ROUTE_ID,'route_version':'3.0.0','observer_grade_imi_instrument_available':True,'empirical_reliability_and_validity':'OPEN'}
 for k,v in expected.items(): req(pointer.get(k)==v,'POINTER_'+k.upper(),e)
 req(pointer.get('executable_release_receipt_sha256')==EXEC_RECEIPT,'POINTER_EXEC_RECEIPT',e)
 dep=pointer.get('private_imi_dependency') or {}; req(dep.get('zip_sha256')=='0be0608fa9aab10d75eeba796530421e96efc7829364172e52f7925ca74d9c87','CORE_SHA',e); req(dep.get('repository_mirror') is False,'CORE_MIRROR',e)
 pred=pointer.get('predecessor_release') or {}; req(pred.get('merge_commit_sha')=='5efe5118e0addfa6965a2f00511b531afa8c8d8a','PREDECESSOR_MERGE',e); req(pointer.get('v1_immutable') is True and pointer.get('v2_immutable') is True,'HISTORICAL_IMMUTABILITY',e)
 req(pointer.get('imi_core_changed') is False and pointer.get('h_earth_product_changed') is False,'SCOPE_BOUNDARY',e)
 req(release.get('release_state')=='PASS' and release.get('route_version')=='3.0.0','RELEASE_STATE',e); req((release.get('checks') or {}).get('manifest_relative_reset') is True,'RESET_CHECK',e); req(release.get('deployment_training_cases_passed')==16,'TRAINING_COUNT',e); req(release.get('false_positive_terminal_cases')==0,'FALSE_TERMINAL',e)
 text=(HERE/'README.md').read_text();
 for token in ['OBSERVER_GRADE_IMI_INSTRUMENT_AVAILABLE','manifest state','+8°',BUNDLE_SHA,'Empirical reliability and validity remain open']:
  req(token in text,'README:'+token,e)
 e=sorted(set(e)); out={'receipt_id':'IMI_COAST_TO_GRATITUDE_V3_REPOSITORY_CONFORMANCE_RECEIPT','release_id':RELEASE_ID,'release_version':'3.0.0','status':'PASS' if not e else 'FAIL','route_id':ROUTE_ID,'route_version':'3.0.0','manifest_relative_reset':not e,'v1_immutable':True,'v2_immutable':True,'bundle_sha256':BUNDLE_SHA,'executable_release_receipt_sha256':EXEC_RECEIPT,'public_manifest_controlled_path_count':len(files) if isinstance(files,dict) else 0,'empirical_reliability_and_validity':'OPEN','errors':e}; out['receipt_sha256']=canon(out); print(json.dumps(out,indent=2,sort_keys=True)); raise SystemExit(1 if e else 0)
if __name__=='__main__': main()
