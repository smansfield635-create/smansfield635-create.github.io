from __future__ import annotations
from pathlib import Path
from typing import Any, Mapping
import hashlib,json
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
MANIFEST=HERE/'PUBLIC_RECORD_MANIFEST_SHA256_v1.json'
PACKET='H_EARTH_C2_R1_ROLE_6_IMI_V4_PLUS_8_REMEDY_AND_EVIDENCE_CONTRACT_PACKET_v1'; ZIP_SHA='5f9625db9d781e5ab50809419a814b77167dd6cc8a834246be638446a5beb36d'
def canon(v:Mapping[str,Any])->str:return hashlib.sha256(json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
def fsha(p:Path)->str:return hashlib.sha256(p.read_bytes()).hexdigest()
def load(p:Path)->dict[str,Any]:
 v=json.loads(p.read_text()); assert isinstance(v,dict); return v
def check_receipt(v,field):
 p=dict(v); claimed=p.pop(field); assert canon(p)==claimed,(field,canon(p),claimed)
def main():
 m=load(MANIFEST); files=m['files']; assert m['packet_id']==PACKET
 for rel,d in files.items():
  p=ROOT/rel; assert p.is_file(),rel; assert fsha(p)==d,(rel,fsha(p),d)
 pointer=load(HERE/'RELEASE_POINTER.json'); check_receipt(pointer,'pointer_sha256')
 remedy=load(HERE/'ROLE6_REMEDY_DETERMINATION_v1.json'); check_receipt(remedy,'determination_sha256')
 correction=load(HERE/'CORRECTION_MANIFEST_v1.json'); check_receipt(correction,'manifest_sha256')
 contract=load(HERE/'POST_IMPLEMENTATION_EVIDENCE_CONTRACT_v1.json'); check_receipt(contract,'contract_sha256')
 assert pointer['bundle_sha256']==ZIP_SHA and pointer['drive_fetchback_verified'] is True
 assert correction['authorized_pitch_degrees']==8.0 and correction['candidate_source_commit_sha']=='501505fe66dbeede467240d8c7d93f194f7d10d2'
 assert correction['route_id']=='H_EARTH_COAST_ENTRY_TO_GRATITUDE_INITIAL_PRESENTATION_v4' and correction['route_version']=='4.0.0'
 assert pointer['correction_manifest_sha256']==correction['manifest_sha256']
 assert pointer['remedy_determination_sha256']==remedy['determination_sha256']
 assert pointer['evidence_contract_sha256']==contract['contract_sha256']
 assert remedy['repair_success_established'] is False and remedy['product_mutation_performed_by_this_packet'] is False
 assert remedy['authorized_product_mutation_paths']==['showroom/globe/h-earth/functional-landscape/navigation.js']
 assert contract['required_frame_count']==9 and len(contract['required_factor_ids'])==11
 assert pointer['role5_ratification_authorized'] is False and pointer['user_differential_required'] is True
 out={'receipt_id':'H_EARTH_C2_R1_ROLE6_IMI_V4_PLUS8_REPOSITORY_CONFORMANCE_RECEIPT_v1','packet_id':PACKET,'status':'PASS','errors':[],'authorized_pitch_degrees':8.0,'route_id':correction['route_id'],'route_version':correction['route_version'],'manifest_sha256':correction['manifest_sha256'],'evidence_contract_sha256':contract['contract_sha256'],'bundle_sha256':ZIP_SHA,'public_manifest_controlled_path_count':len(files),'product_mutation_included':False,'repair_success_established':False}
 out['receipt_sha256']=canon(out); print(json.dumps(out,indent=2,sort_keys=True))
if __name__=='__main__':main()
