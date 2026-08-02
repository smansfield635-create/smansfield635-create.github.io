from __future__ import annotations
from pathlib import Path
from typing import Any, Mapping
import hashlib, json
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
MANIFEST=HERE/'PUBLIC_RELEASE_RECORD_MANIFEST_SHA256_v1.json'
RELEASE_ID='IMI_H_EARTH_COAST_ENTRY_TO_GRATITUDE_INITIAL_PRESENTATION_DEPLOYABLE_RELEASE_v1'
ROUTE_ID='H_EARTH_COAST_ENTRY_TO_GRATITUDE_INITIAL_PRESENTATION_v1'
BUNDLE_SHA='9e2046fdf200e3c6b4445f854602ea1530ceed3da0a46dea74e73f3f68e3fd6d'
BUNDLE_SIZE=58786
BUNDLE_COUNT=35
DRIVE_FOLDER='1F07dqiv4uW6UMXe4ixCUSaUi_6VYSOJt'
DRIVE_FILE='1CZmtVtBWT1olIdGhndqm6f7dS5gVV0Nx'
RELEASE_RECEIPT='83d1b6e765962e8dc5fbccbeebd331d67091cc5b7a16e28297ee0223dc9f8ecd'
IMI_SHA='0be0608fa9aab10d75eeba796530421e96efc7829364172e52f7925ca74d9c87'
PLATFORM_MERGE='cffa9889430d6700c3fad548d29dfada3dd04e61'
BASE='research/route-operator-platform-v1/deployments/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v1'
CONTROLLED_PATHS={
 '.github/workflows/imi-h-earth-coast-entry-to-gratitude-initial-presentation-v1-conformance.yml',
 f'{BASE}/IMI_BYTE_CUSTODY_RECEIPT_v1.json',
 f'{BASE}/IMI_EXECUTABLE_RELEASE_RECEIPT_v1.json',
 f'{BASE}/README.md',
 f'{BASE}/RELEASE_POINTER.json',
 f'{BASE}/verify_release_records_v1.py',
}
def csha(v:Mapping[str,Any])->str:
 return hashlib.sha256(json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
def fsha(p:Path)->str:return hashlib.sha256(p.read_bytes()).hexdigest()
def load(p:Path,e:list[str])->dict[str,Any]:
 try:v=json.loads(p.read_text())
 except Exception as x:e.append(f'INVALID_JSON:{p.relative_to(ROOT)}:{type(x).__name__}');return {}
 if not isinstance(v,dict):e.append(f'JSON_ROOT_NOT_OBJECT:{p.relative_to(ROOT)}');return {}
 return v
def req(c:bool,code:str,e:list[str]):
 if not c:e.append(code)
def fields(a:Mapping[str,Any],x:Mapping[str,Any],p:str,e:list[str]):
 for k,v in x.items():req(a.get(k)==v,f'{p}_{k.upper()}_MISMATCH',e)
def receipt(r:Mapping[str,Any],p:str,e:list[str]):
 h=r.get('receipt_sha256');req(isinstance(h,str) and len(h)==64,f'{p}_RECEIPT_SHA256_INVALID',e)
 if isinstance(h,str):
  q=dict(r);q.pop('receipt_sha256',None);req(csha(q)==h,f'{p}_RECEIPT_HASH_MISMATCH',e)
def main():
 e=[];m=load(MANIFEST,e);fs=m.get('files')
 req(m.get('release_id')==RELEASE_ID,'MANIFEST_RELEASE_ID_MISMATCH',e);req(m.get('manifest_version')=='1.0.0','MANIFEST_VERSION_MISMATCH',e);req(isinstance(fs,dict),'MANIFEST_FILES_INVALID',e)
 if isinstance(fs,dict):
  req(set(fs)==CONTROLLED_PATHS,'MANIFEST_PATH_SET_MISMATCH',e)
  for rel,h in sorted(fs.items()):
   p=ROOT/rel;req(isinstance(h,str) and len(h)==64,f'MANIFEST_DIGEST_INVALID:{rel}',e);req(p.is_file(),f'MANIFEST_FILE_MISSING:{rel}',e)
   if p.is_file() and isinstance(h,str):req(fsha(p)==h,f'MANIFEST_SHA256_MISMATCH:{rel}',e)
 pointer=load(HERE/'RELEASE_POINTER.json',e);custody=load(HERE/'IMI_BYTE_CUSTODY_RECEIPT_v1.json',e);release=load(HERE/'IMI_EXECUTABLE_RELEASE_RECEIPT_v1.json',e)
 receipt(custody,'CUSTODY',e);receipt(release,'RELEASE',e)
 fields(pointer,{'release_id':RELEASE_ID,'release_version':'1.0.0','release_bundle_sha256':BUNDLE_SHA,'release_bundle_size_bytes':BUNDLE_SIZE,'release_bundle_file_count':BUNDLE_COUNT,'drive_folder_id':DRIVE_FOLDER,'drive_file_id':DRIVE_FILE,'executable_release_receipt_sha256':RELEASE_RECEIPT,'route_id':ROUTE_ID,'route_version':'1.0.0','observer_grade_imi_instrument_available':True,'empirical_reliability_and_validity':'OPEN','final_gratitude_coordinate_claim':False,'runtime_mutation':False},'POINTER',e)
 dep=pointer.get('private_imi_dependency');req(isinstance(dep,dict),'DEPENDENCY_INVALID',e)
 if isinstance(dep,dict):fields(dep,{'package_id':'IMI_OBSERVER_GRADE_INSTRUMENT_v1','package_version':'1.0.0','zip_sha256':IMI_SHA,'custody_state':'BYTE_VERIFIED_EXTERNAL_INSTRUMENT_DEPENDENCY','repository_mirror':False,'runtime_mount_required':True},'DEPENDENCY',e)
 plat=pointer.get('platform_binding');req(isinstance(plat,dict),'PLATFORM_BINDING_INVALID',e)
 if isinstance(plat,dict):fields(plat,{'platform_id':'ROUTE_OPERATOR_RESEARCH_PLATFORM_v1','platform_version':'1.0.0','platform_merge_commit_sha':PLATFORM_MERGE},'PLATFORM',e)
 fields(custody,{'receipt_id':'IMI_BYTE_CUSTODY_RECEIPT_v1','custody_state':'BYTE_VERIFIED_EXTERNAL_INSTRUMENT_DEPENDENCY','expected_zip_sha256':IMI_SHA,'observed_zip_sha256':IMI_SHA,'observed_size_bytes':38893,'internal_manifest_sha256':'fd4de96ec3c2827ca54aac3cf1928ff90eb6e79b3dc3d3aaadb2a80c2780e0c2','manifest_entry_count':10,'all_manifest_entries_match':True,'zip_hash_match':True,'unmanifested_payload_files':[]},'CUSTODY',e)
 fields(release,{'release_id':RELEASE_ID,'release_version':'1.0.0','release_state':'PASS','observer_grade_imi_instrument_available':True,'empirical_reliability_and_validity':'OPEN','platform_id':'ROUTE_OPERATOR_RESEARCH_PLATFORM_v1','platform_version':'1.0.0','platform_merge_commit_sha':PLATFORM_MERGE,'imi_package_id':'IMI_OBSERVER_GRADE_INSTRUMENT_v1','imi_package_version':'1.0.0','zip_sha256':IMI_SHA,'route_id':ROUTE_ID,'route_version':'1.0.0','original_snapshot_fixtures_passed':29,'original_temporal_fixtures_passed':4,'deployment_training_cases_passed':16,'terminal_positive_training_cases':1,'false_positive_terminal_cases':0,'errors':[],'receipt_sha256':RELEASE_RECEIPT},'RELEASE',e)
 checks=release.get('checks');req(isinstance(checks,dict) and checks and all(v is True for v in checks.values()),'RELEASE_CHECKS_NOT_ALL_TRUE',e)
 text=(HERE/'README.md').read_text()
 for token in ['OBSERVER_GRADE_IMI_INSTRUMENT_AVAILABLE',ROUTE_ID,BUNDLE_SHA,DRIVE_FOLDER,DRIVE_FILE,'29 snapshot fixtures','4 temporal fixtures','16 deployment training cases','zero false-positive IMI-7 cases']:
  req(token in text,f'README_TOKEN_MISSING:{token}',e)
 e=sorted(set(e));r={'receipt_id':'IMI_COAST_TO_GRATITUDE_REPOSITORY_CONFORMANCE_RECEIPT_v1','release_id':RELEASE_ID,'release_version':'1.0.0','status':'PASS' if not e else 'FAIL','observer_grade_imi_instrument_available':not e,'empirical_reliability_and_validity':'OPEN','platform_merge_commit_sha':PLATFORM_MERGE,'release_bundle_sha256':BUNDLE_SHA,'release_bundle_file_count':BUNDLE_COUNT,'imi_dependency_sha256':IMI_SHA,'executable_release_receipt_sha256':release.get('receipt_sha256'),'public_manifest_controlled_path_count':len(fs) if isinstance(fs,dict) else 0,'errors':e}
 r['receipt_sha256']=csha(r);print(json.dumps(r,indent=2,sort_keys=True))
 if e:raise SystemExit(1)
if __name__=='__main__':main()
