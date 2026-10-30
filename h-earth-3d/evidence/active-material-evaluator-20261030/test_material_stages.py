"""Regression checks for symbolic full-material composition (CPU model only)."""
import copy
import unittest
import numpy as np
import material_stages as m

def fixture(x=-206,y=15.8,z=-727.9,**overrides):
    p=np.array([x,y,z],float)
    value=dict(world=p.tolist(),normal=[0.,1.,0.],eye=[x-7,y+4,z-6],
      quadWorld=np.array([p,p+[.2,0,0],p+[0,0,.2],p+[.2,0,.2]]).tolist(),
      pixelBottomLeft=[0,0],coastDistance=140.,contactDistance=140.,
      farNormalFlip=False,atlasDeltaRGB=[0.,0.,0.],marginDelta=[0.,0.,0.,0.],
      habitatEnabled=True,habitatBounds=[[-213.,-298.,-69.,-154.],[-298.,-570.,88.,-154.],[-448.,-283.,448.,-93.]],
      habitatAtlasScale=[1/3,1.],habitatHalfTexel=1/256,
      floorFootprints=[],planetRadius=420000.)
    value.update(overrides);return value

def render(q,texture=lambda *_:.5):return m.evaluate_material(q,texture)
def coeff(r):return np.asarray(r['coefficients']['A']),np.asarray(r['coefficients']['B'])
def stage(r,name):return next(s for s in r['stages'] if s['id']==name)

class MaterialStageTests(unittest.TestCase):
    def test_margin_is_original_substrate_not_current_palette(self):
        q=fixture();before=render(q);q['marginDelta']=[.08,.02,-.01,.03];after=render(q)
        a,b=coeff(before);aa,bb=coeff(after)
        np.testing.assert_allclose(aa-a,[.08]*3,atol=1e-14)
        np.testing.assert_allclose(bb-b,[.02,-.01,.03],atol=1e-14)
        self.assertGreater(abs(a[0]-1),.1)
        # Multiplication of the current palette produces .08*A, which is wrong.
        self.assertGreater(abs((aa-a)[0]-.08*a[0]),.02)

    def test_margin_and_atlas_are_attenuated_by_later_layers(self):
        q=fixture(0,10,-180,contactDistance=3);before=render(q)
        q['marginDelta']=[.08,.02,-.01,.03];q['atlasDeltaRGB']=[.04,.01,-.02];after=render(q)
        later=np.ones(3);seen=False
        for s in before['stages']:
            if seen:later*=s['gain']
            if s['id']=='material-margin':seen=True
        a,b=coeff(before);aa,bb=coeff(after)
        self.assertTrue(np.all(later<.8))
        np.testing.assert_allclose(aa-a,.08*later,atol=1e-14)
        np.testing.assert_allclose(bb-b,np.array([.06,0,.01])*later,atol=1e-14)

    def test_site_b_rgb_gain_matches_frozen_expression(self):
        q=fixture(40,10,-300,normal=[.5,1,.2]);r=render(q);s=stage(r,'site-b')
        x,y,z=q['world'];slope=r['fields']['slope']
        axis=np.exp(-((x-40)/18)**2);depth=1-m.smooth(-292,-210,z)
        envelope=m.smooth(0,12,min(x+120,96-x,z+376,-224-z))
        exposure=axis*depth*m.smooth(.10,.58,slope)*envelope
        variation=m.noise2(np.array([x,z])*.12+[8,-19])
        low=np.array([.93,.91,.88]);high=np.array([1.04,1.02,.98])
        rng=np.random.default_rng(3000)
        for base in rng.random((100,3)):
            earth=base*(low*(1-variation)+high*variation)
            direct=base*(1-exposure*.38)+earth*(exposure*.38)
            np.testing.assert_allclose(base*s['gain']+s['bias'],direct,atol=1e-15)
        self.assertGreater(np.ptp(s['gain']),.0001)

    def test_random_substrates_compose_all_stages_and_margin(self):
        rng=np.random.default_rng(3000)
        # Covers manor, Site B/litter, coastal habitat, and isolated inland.
        for q in [fixture(80,10,-172),fixture(40,10,-300,normal=[.5,1,.2]),fixture(0,10,-180,contactDistance=3),fixture()]:
            q['atlasDeltaRGB']=[.01,-.02,.03];q['marginDelta']=[.04,.01,.02,-.01]
            r=render(q);a,b=coeff(r)
            for P in rng.random((100,3)):
                direct=P.copy()
                for s in r['stages']:
                    if s['id']=='material-margin':direct=direct+np.asarray(s['addA'])*P+s['addB']
                    else:direct=direct*np.asarray(s['gain'])+s['bias']
                np.testing.assert_allclose(a*P+b,direct,atol=1e-14)

    def test_disabled_habitat_also_disables_gravel(self):
        q=fixture(0,10,-180,contactDistance=3);on=render(q)
        self.assertGreater(stage(on,'habitat')['weight'],0)
        self.assertGreater(stage(on,'bank-gravel')['weight'],0)
        q['habitatEnabled']=False
        for key in ['habitatBounds','habitatAtlasScale','habitatHalfTexel']:del q[key]
        calls=[]
        off=render(q,lambda name,uv:calls.append(name) or .5)
        self.assertEqual(stage(off,'habitat')['weight'],0)
        self.assertEqual(stage(off,'bank-gravel')['weight'],0)
        self.assertEqual(calls,['shoreline'])

    def test_shoreline_inclusive_bounds(self):
        for x,z in [(-18,-204),(34,-131),(-18,-180),(34,-180)]:
            calls=[];r=render(fixture(x,10,z,habitatEnabled=False),lambda name,uv:calls.append((name,uv.tolist())) or .5)
            self.assertEqual(len(calls),1);self.assertEqual(calls[0][0],'shoreline')
            self.assertGreater(stage(r,'shoreline-root-soil')['weight'],0)
        calls=[];r=render(fixture(34.00001,10,-180,habitatEnabled=False),lambda name,uv:calls.append(name) or .5)
        self.assertEqual(calls,[]);self.assertEqual(stage(r,'shoreline-root-soil')['weight'],0)

    def test_habitat_uses_strict_panel_bounds(self):
        q=fixture();x,z=np.asarray(q['world'])[[0,2]]
        q['habitatBounds']=[[x,z-1,x+2,z+1],[x+10,z-1,x+12,z+1],[x+20,z-1,x+22,z+1]]
        def fail(*args):raise AssertionError('boundary must not sample resident habitat')
        r=render(q,fail);self.assertEqual(stage(r,'habitat')['weight'],0)
        q['habitatBounds'][0][0]=x-1
        calls=[];r=render(q,lambda name,uv:calls.append(name) or .5)
        self.assertEqual(calls,['habitat','habitatMaterial']);self.assertGreater(stage(r,'habitat')['weight'],0)

    def test_grove_protects_identity_and_groundcover(self):
        r=render(fixture(-139.40268,10,-210.74617))
        self.assertEqual(stage(r,'environmental-identity')['weight'],0)
        self.assertEqual(stage(r,'groundcover')['weight'],0)

    def test_missing_or_invalid_active_inputs_rejected(self):
        q=fixture();del q['coastDistance']
        with self.assertRaisesRegex(m.Unresolved,'MISSING_INPUT'):render(q)
        q=fixture(0,10,-180);del q['habitatBounds']
        with self.assertRaisesRegex(m.Unresolved,'MISSING_INPUT'):render(q)
        q=fixture(0,10,-180)
        with self.assertRaisesRegex(m.Unresolved,'TEXTURE_SAMPLER'):render(q,None)
        with self.assertRaisesRegex(m.Unresolved,'INVALID_TEXEL'):render(q,lambda *_:np.nan)
        with self.assertRaisesRegex(m.Unresolved,'INVALID_TEXEL'):render(q,lambda *_:1.1)

    def test_invalid_quad_and_normal_rejected(self):
        for quad in [[],[[0,1,2]]*3,[[0,1,np.nan]]*4]:
            with self.assertRaisesRegex(m.Unresolved,'INVALID_QUAD'):render(fixture(quadWorld=quad))
        with self.assertRaisesRegex(m.Unresolved,'ZERO_NORMAL'):render(fixture(normal=[0,0,0]))
        with self.assertRaisesRegex(m.Unresolved,'INVALID_PIXEL'):render(fixture(pixelBottomLeft=[.5,0]))
        q=fixture();q['quadWorld']=[q['world']]*4
        with self.assertRaisesRegex(m.Unresolved,'ZERO_NORMAL'):render(q)

    def test_pixel_lane_and_world_cannot_disagree(self):
        q=fixture();q['world'][0]+=.01
        with self.assertRaisesRegex(m.Unresolved,'PIXEL_LANE_WORLD_MISMATCH'):render(q)

    def test_explicit_far_normal_flip_preserves_source_semantics(self):
        q=fixture(normal=[.1,1,.2]);a=render(q)
        q['normal']=[-.1,-1,-.2];q['farNormalFlip']=True;b=render(q)
        np.testing.assert_array_equal(coeff(a),coeff(b))
        q['farNormalFlip']=False;c=render(q)
        self.assertGreater(abs(c['fields']['slope']-a['fields']['slope']),.5)

    def test_manor_nested_derivative_uncertainty_is_explicit(self):
        self.assertIn('MANOR_NESTED_DERIVATIVE_MODEL_ONLY',render(fixture(80,10,-172))['uncertainties'])
        self.assertNotIn('MANOR_NESTED_DERIVATIVE_MODEL_ONLY',render(fixture())['uncertainties'])

    def test_no_texture_guessing_outside_all_active_domains(self):
        def fail(*args):raise AssertionError('unexpected texture read')
        r=render(fixture(),fail)
        self.assertEqual(len(r['stages']),15)
        for name in ['shoreline-root-soil','woodland-litter','habitat','bank-gravel']:
            self.assertEqual(stage(r,name)['weight'],0)

if __name__=='__main__':unittest.main()
