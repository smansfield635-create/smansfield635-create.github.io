#!/usr/bin/env python3
"""Arithmetic regression checks independent of the captured measurements."""
import importlib.util
import itertools
from pathlib import Path
import unittest
import numpy as np
spec=importlib.util.spec_from_file_location('analysis',Path(__file__).with_name('analyze-capture.py'))
a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)

class AnalysisArithmetic(unittest.TestCase):
    def test_signed_identity_before_spatial_average(self):
        rng=np.random.default_rng(2957)
        p,t=rng.random((2,2,9,3));w=rng.random((2,9,1))
        c=(1-w)*p+w*t
        soil=(1-(w[0]+w[1])/2)*(p[1]-p[0])
        target=(w[0]+w[1])/2*(t[1]-t[0])
        coverage=(w[1]-w[0])*(t[0]+t[1]-p[0]-p[1])/2
        np.testing.assert_allclose((soil+target+coverage).mean(0),(c[1]-c[0]).mean(0),atol=1e-15)
        # Guard against averaging fields before multiplying correlated values.
        avg_p=p.mean(1);avg_t=t.mean(1);avg_w=w.mean(1)
        averaged_mix=(1-avg_w)*avg_p+avg_w*avg_t
        self.assertGreater(np.max(abs(averaged_mix[1]-averaged_mix[0]-(c[1]-c[0]).mean(0))),.001)

    def test_interval_contributions_cover_all_endpoint_combinations(self):
        rng=np.random.default_rng(2957)
        # Six independent endpoint variables P0,P1,T0,T1,w0,w1.
        intervals=[tuple(sorted(z)) for z in rng.random((6,2))]
        p0,p1,t0,t1,w0,w1=intervals
        mw=a.scale(a.add(w0,w1),.5)
        bounds=[a.mul((1-mw[1],1-mw[0]),a.sub(p1,p0)),
                a.mul(mw,a.sub(t1,t0)),
                a.mul(a.sub(w1,w0),a.scale(a.sub(a.add(t0,t1),a.add(p0,p1)),.5))]
        for v in itertools.product(*intervals):
            p0v,p1v,t0v,t1v,w0v,w1v=v
            m=(w0v+w1v)/2
            terms=[(1-m)*(p1v-p0v),m*(t1v-t0v),(w1v-w0v)*(t0v+t1v-p0v-p1v)/2]
            for term,(lo,hi) in zip(terms,bounds):
                self.assertGreaterEqual(term,lo-1e-15)
                self.assertLessEqual(term,hi+1e-15)

    def test_l1_bounds_handle_zero_crossing(self):
        self.assertEqual(a.l1bounds((np.array([-2.,1.,-4.]),np.array([3.,2.,-2.]))),(3.,9.))

    def test_weight_bounds_clip_to_unit_interval(self):
        lo,hi=a.interval(np.array([0.,255.]),True)
        np.testing.assert_allclose(lo,[0,254/255])
        np.testing.assert_allclose(hi,[1/255,1])

if __name__=='__main__':unittest.main()
