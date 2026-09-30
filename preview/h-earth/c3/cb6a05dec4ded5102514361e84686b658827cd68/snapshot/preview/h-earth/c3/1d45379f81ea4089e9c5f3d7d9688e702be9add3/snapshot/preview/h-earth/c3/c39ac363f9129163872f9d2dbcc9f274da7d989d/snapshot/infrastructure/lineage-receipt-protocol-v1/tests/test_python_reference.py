from __future__ import annotations
from copy import deepcopy
from pathlib import Path
import json, sys, unittest

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path[:0] = [str(ROOT / 'python'), str(ROOT / 'integrations')]

from lineage_receipt_protocol_v1 import (  # noqa: E402
    MAX_SAFE_INTEGER, ValueDomainError, canonicalize_text, create_receipt,
    verify_receipt,
)
from route_operator_legacy_v1 import (  # noqa: E402
    legacy_canonical_json, legacy_canonical_sha256, verify_legacy_receipt,
    wrap_legacy_receipt,
)


class LRPv1Conformance(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.vectors = json.loads((ROOT/'vectors/lrpv1_conformance_vectors.json').read_text())['vectors']
        cls.legacy = json.loads((ROOT/'vectors/route_operator_canonical_v1_legacy_vectors.json').read_text())['vectors']

    def test_shared_vectors(self):
        for v in self.vectors:
            with self.subTest(v=v['id']):
                r = create_receipt(v['payload'])
                body = {k:r[k] for k in ('protocol','protocol_version','canonicalization','digest_algorithm','payload')}
                self.assertEqual(canonicalize_text(body), v['canonical_body'])
                self.assertEqual(r['lineage_digest'], v['lineage_digest'])
                self.assertEqual(verify_receipt(r)['state'], 'VALID')

    def test_utf16_order_vector(self):
        v = next(x for x in self.vectors if x['id']=='rfc8785_property_order')
        canonical = canonicalize_text(v['payload'])
        values = ['Carriage Return','One','Control','Latin Small Letter O With Diaeresis','Euro Sign','Emoji: Grinning Face','Hebrew Letter Dalet With Dagesh']
        positions = [canonical.index(x) for x in values]
        self.assertEqual(positions, sorted(positions))

    def test_creation_is_detached(self):
        p={'nested':{'value':1},'items':[1,2,3]}; before=deepcopy(p); r=create_receipt(p)
        self.assertEqual(p,before); p['nested']['value']=99; self.assertEqual(r['payload']['nested']['value'],1)

    def test_tampering_and_metadata_fail_closed(self):
        for mutate in (
            lambda r:r['payload'].__setitem__('value',2),
            lambda r:r.__setitem__('protocol_version','9.9.9'),
            lambda r:r.__setitem__('surprise',True),
            lambda r:r.pop('digest_algorithm'),
        ):
            r=create_receipt({'value':1}); mutate(r); self.assertEqual(verify_receipt(r)['state'],'INVALID')

    def test_value_domain_rejects_ambiguous_types(self):
        invalid=[1.0,0.1,float('nan'),float('inf'),MAX_SAFE_INTEGER+1,(1,2),{1:'x'},{'x':b'y'},{'x':{1,2}},'\ud800']
        for value in invalid:
            with self.subTest(value=repr(value)), self.assertRaises(ValueDomainError): create_receipt(value)

    def test_legacy_vectors_reproduce(self):
        for v in self.legacy:
            with self.subTest(v=v['id']):
                self.assertEqual(legacy_canonical_json(v['payload']),v['canonical_json'])
                self.assertEqual(legacy_canonical_sha256(v['payload']),v['sha256'])

    def test_real_float_legacy_receipt_wraps_without_reinterpretation(self):
        body={'platform_id':'ROUTE_OPERATOR_RESEARCH_PLATFORM_v1','state':'NUMERIC','route_id':'R','continuous_capacity':0.625}
        legacy={**body,'receipt_sha256':legacy_canonical_sha256(body)}
        self.assertTrue(verify_legacy_receipt(legacy))
        wrapped=wrap_legacy_receipt(legacy)
        self.assertEqual(verify_receipt(wrapped)['state'],'VALID')
        self.assertEqual(wrapped['payload']['legacy_receipt_canonical_json'],legacy_canonical_json(legacy))
        self.assertEqual(wrapped['payload']['legacy_receipt_sha256'],legacy['receipt_sha256'])


if __name__ == '__main__': unittest.main()
