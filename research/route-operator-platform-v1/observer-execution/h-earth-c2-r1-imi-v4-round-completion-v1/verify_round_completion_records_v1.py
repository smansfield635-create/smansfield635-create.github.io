from __future__ import annotations
from pathlib import Path
from typing import Any, Mapping
import hashlib,json
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
MANIFEST=HERE/'PUBLIC_RECORD_MANIFEST_SHA256_v1.json'
PACKET='H_EARTH_C2_R1_IMI_V4_ROUND_COMPLETION_INSTRUMENTATION_MASTER_PACKET_v1'
MASTER_SHA='5193b73129d75ce167ec62ba89115f916ffbcb7b837f0935ef828b2d62d2f6d0'
CONTROLLED={
 '.github/workflows/h-earth-c2-r1-imi-v4-round-completion-instrumentation-v1-conformance.yml',
 'research/route-operator-platform-v1/observer-execution/h-earth-c2-r1-imi-v4-round-completion-v1/README.md',
 'research/route-operator-platform-v1/observer-execution/h-earth-c2-r1-imi-v4-round-completion-v1/PARTIAL_OCCLUSION_ADJUDICATION_SURFACE_v1.json',
 'research/route-operator-platform-v1/observer-execution/h-earth-c2-r1-imi-v4-round-completion-v1/INSTRUMENTATION_RESULT_v1.json',
 'research/route-operator-platform-v1/observer-execution/h-earth-c2-r1-imi-v4-round-completion-v1/RELEASE_POINTER.json',
 'research/route-operator-platform-v1/observer-execution/h-earth-c2-r1-imi-v4-round-completion-v1/verify_round_completion_records_v1.py'}
def canon(v:Mapping[str,Any])->str:return hashlib.sha256(json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
def fsha(p:Path)->str:return hashlib.sha256(p.read_bytes()).hexdigest()
def load(p:Path,e:list[str])->dict[str,Any]:
 try:
  v=json.loads(p.read_text());
  if not isinstance(v,dict): raise ValueError()
  return v
 except Exception:e.append('INVALID_JSON:'+str(p.relative_to(ROOT)));return {}
def req(x:bool,c:str,e:list[str]):
 if not x:e.append(c)
def receipt(v:Mapping[str,Any],field:str,label:str,e:list[str]):
 claimed=v.get(field); p=dict(v); p.pop(field,None); req(isinstance(claimed,str) and canon(p)==claimed,label+'_HASH_MISMATCH',e)
def main():
 e=[];m=load(MANIFEST,e);files=m.get('files');req(m.get('package_id')==PACKET,'MANIFEST_PACKET_ID',e);req(isinstance(files,dict),'MANIFEST_FILES',e)
 if isinstance(files,dict):
  req(set(files)==CONTROLLED,'MANIFEST_PATH_SET',e)
  for rel,d in files.items():
   p=ROOT/rel;req(p.is_file(),'MISSING:'+rel,e);req(not p.is_file() or fsha(p)==d,'DIGEST:'+rel,e)
 pointer=load(HERE/'RELEASE_POINTER.json',e); result=load(HERE/'INSTRUMENTATION_RESULT_v1.json',e); occ=load(HERE/'PARTIAL_OCCLUSION_ADJUDICATION_SURFACE_v1.json',e)
 receipt(pointer,'pointer_sha256','POINTER',e);receipt(result,'receipt_sha256','RESULT',e);receipt(occ,'surface_sha256','OCCLUSION',e)
 req(pointer.get('master_zip_sha256')==MASTER_SHA,'MASTER_SHA',e);req(pointer.get('master_zip_size_bytes')==14817080,'MASTER_SIZE',e);req(pointer.get('master_package_file_count')==39,'MASTER_COUNT',e)
 req(pointer.get('result')=='V4_OBSERVER_EXECUTION_ADAPTER_COMPLETE','RESULT_A',e);req(pointer.get('v4_semantics_changed') is False and pointer.get('v4_gap_discovered') is False,'V4_BOUNDARY',e);req(pointer.get('new_v5_instrument_required') is False,'V5_BOUNDARY',e)
 req(pointer.get('drive_fetchback_verified') is True and pointer.get('observer_execution_ready') is True and pointer.get('role4_may_assign_two_observer_rooms') is True,'READINESS',e)
 req(pointer.get('exact_product_head')=='6d1b3e20bc5d24a7a6dce46fd897c4dd4cdfe3ec','PRODUCT_HEAD',e);req(pointer.get('role3_artifact_id')==8841767834,'ROLE3_ID',e);req(pointer.get('role3_artifact_archive_sha256')=='5cde429437137ffe57db4d40edb04f8448a6a446c771069475278b271dbb656e','ROLE3_SHA',e)
 req(pointer.get('role3_admitted_evidence_file_count')==30 and pointer.get('observer_input_manifest_sha256')=='5f9ce1d56ce36a7b26a3fa22d7dcfde2ac0c5d024f30774451eab82b026b0ffe','INPUT_BINDING',e);req(pointer.get('v4_instrument_bundle_sha256')=='49162b7ff730a9efc71bd2151ad00b34e8b9f46271018a015defb5534c7fb3b2','V4_SHA',e);req(pointer.get('private_core_sha256')=='0be0608fa9aab10d75eeba796530421e96efc7829364172e52f7925ca74d9c87','CORE_SHA',e)
 req(occ.get('new_threshold_introduced') is False and occ.get('v4_semantics_changed') is False and occ.get('status')=='V4_DERIVED_NO_NEW_THRESHOLD','OCCLUSION_BOUNDARY',e)
 req(result.get('result')=='V4_OBSERVER_EXECUTION_ADAPTER_COMPLETE' and result.get('validator_result')=='PASS' and result.get('fixture_result')=='PASS','RESULT_RECEIPT',e);req(result.get('substantive_role3_evidence_scored_by_instrumentation_room') is False,'NO_SUBSTANTIVE_SCORE',e)
 text=(HERE/'README.md').read_text()
 for token in [PACKET,'V4_OBSERVER_EXECUTION_ADAPTER_COMPLETE',MASTER_SHA,'8841767834','does not contain a substantive score']:
  req(token in text,'README:'+token,e)
 e=sorted(set(e));out={'receipt_id':'H_EARTH_C2_R1_IMI_V4_ROUND_COMPLETION_REPOSITORY_CONFORMANCE_RECEIPT_v1','package_id':PACKET,'status':'PASS' if not e else 'FAIL','errors':e,'result':'V4_OBSERVER_EXECUTION_ADAPTER_COMPLETE','v4_semantics_changed':False,'v4_gap_discovered':False,'observer_execution_ready':not e,'role4_may_assign_two_observer_rooms':not e,'master_zip_sha256':MASTER_SHA,'public_manifest_controlled_path_count':len(files) if isinstance(files,dict) else 0};out['receipt_sha256']=canon(out);print(json.dumps(out,indent=2,sort_keys=True));raise SystemExit(1 if e else 0)
if __name__=='__main__':main()
