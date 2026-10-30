"""Synthetic regression tests for strict zero-sand reranking; no source/GPU run."""
import unittest
import numpy as np
from select_zero_sand import zero_sand,rank_dry

class ZeroSand(unittest.TestCase):
    def data(self):
        op=np.zeros((4,15,2,3));op[:,:,0]=1
        op[2,10,0]=1-1e-10
        op[2,10,1]=1e-10
        world=np.array([[0.,0,0],[1,0,0],[0,0,1],[1,0,1]])
        co=np.zeros((4,2,3));co[1,1]=.3;co[2,1]=.8;co[3,1]=.1
        return world,co,np.ones(4,bool),np.array(['near']*4),op
    def test_exact_zero_no_epsilon(self):
        self.assertEqual(zero_sand(self.data()[4]).tolist(),[True,True,False,True])
    def test_nonzero_sand_can_appear_higher_but_is_excluded(self):
        rows,stats=rank_dry(*self.data(),width=2)
        self.assertEqual(rows[0]['gridIndices'],[0,1])
        self.assertEqual(stats['dryEligibleEdges'],2)
        self.assertTrue(rows[0]['sandCoverageExactlyZeroAtBothEndpoints'])
        self.assertFalse(rows[0]['oceanOwnershipVerified'])
    def test_repeat_determinism(self):
        a=self.data();self.assertEqual(rank_dry(*a,width=2),rank_dry(*a,width=2))
    def test_different_owner_rejected(self):
        a=list(self.data());a[3]=np.array(['near','far','near','near'])
        with self.assertRaisesRegex(ValueError,'NO_ELIGIBLE_ZERO_SAND_EDGE'):rank_dry(*a,width=2)
    def test_ineligible_endpoint_rejected(self):
        a=list(self.data());a[2][1]=False
        with self.assertRaisesRegex(ValueError,'NO_ELIGIBLE_ZERO_SAND_EDGE'):rank_dry(*a,width=2)
    def test_nonfinite_coefficient_fails(self):
        a=list(self.data());a[1][1,1,0]=float('nan')
        with self.assertRaisesRegex(ValueError,'NONFINITE_COEFFICIENT'):rank_dry(*a,width=2)
    def test_bad_grid_fails(self):
        with self.assertRaisesRegex(ValueError,'GRID_SHAPE'):rank_dry(*self.data(),width=3)
    def test_zero_sand_operand_schema(self):
        with self.assertRaisesRegex(ValueError,'OPERAND_SCHEMA'):zero_sand(np.zeros((4,14,2,3)))

if __name__=='__main__':unittest.main()
