import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planP6DryEcotone,P6_ECOTONE_ALLOCATION,P6_ECOTONE_FOOTPRINT}
 from '../../showroom/globe/h-earth/render/hillside-bank-ecotone-roots.p6.v1.js';

const tile=(id,x,z)=>({id,minX:Math.floor(x/4)*4,minZ:Math.floor(z/4)*4,
 count:1,first:0,packed:new Float32Array([x,1,z,0]),rootIds:[id]});
const source=[tile('P3',.2,-167.2)],bank=[tile('P4',1.2,-167.2)];
const dry=()=>({y:1.25,slope:.2,dryContact:true});

test('P6 dry-contact roots are genuinely new, finite, uniquely identified and bounded',async()=>{
 const before=source[0].packed.slice(),p4before=bank[0].packed.slice();
 const a=await planP6DryEcotone({installedTiles:source,p4BankTiles:bank,
  admitDryContact:dry,maximumAddedRoots:192});
 const b=await planP6DryEcotone({installedTiles:source,p4BankTiles:bank,
  admitDryContact:dry,maximumAddedRoots:192});
 assert.equal(a.receipt.schema,'H_EARTH_P6_AUTHENTIC_DRY_CONTACT_V1');
 assert.ok(a.receipt.addedRoots>0&&a.receipt.addedRoots<=192);
 assert.equal(a.receipt.addedGpuBytes,a.receipt.addedRoots*16);
 assert.ok(a.receipt.addedGpuBytes<=P6_ECOTONE_ALLOCATION.maximumPackedBytes);
 assert.deepEqual(source[0].packed,before);
 assert.deepEqual(bank[0].packed,p4before);
 assert.deepEqual(a.tiles.map(t=>Array.from(t.packed)),b.tiles.map(t=>Array.from(t.packed)));
 const ids=a.tiles.flatMap(t=>t.rootIds);
 assert.equal(ids.length,new Set(ids).size);
 assert.equal(ids.length,a.receipt.addedRoots);
 let expected=0;
 for(const t of a.tiles){
  assert.equal(t.first,expected);expected+=t.count;
  assert.ok(t.count>0&&t.count<=1600&&t.packed instanceof Float32Array);
  assert.equal(t.packed.length,t.count*4);
  assert.ok(t.packed.every(Number.isFinite));
  for(let i=0;i<t.count;i++){
   const x=t.packed[i*4],z=t.packed[i*4+2];
   assert.ok(x>=P6_ECOTONE_FOOTPRINT.minX&&x<P6_ECOTONE_FOOTPRINT.maxX);
   assert.ok(z>=P6_ECOTONE_FOOTPRINT.minZ&&z<P6_ECOTONE_FOOTPRINT.maxZ);
  }
 }
 assert.equal(expected,a.receipt.addedRoots);
});

test('P6 fails closed on wet and inadmissible contacts',async()=>{
 let tested=0;
 const a=await planP6DryEcotone({installedTiles:source,p4BankTiles:bank,
  admitDryContact:()=>{tested++;return null;},maximumAddedRoots:2});
 assert.ok(tested>0);
 assert.equal(a.receipt.addedRoots,0);
 assert.equal(a.receipt.addedGpuBytes,0);
 assert.equal(a.tiles.length,0);
 assert.equal(a.receipt.rejected.contact,tested);
});

test('P6 rejects malformed inputs and caps the independent GPU channel',async()=>{
 assert.equal(P6_ECOTONE_ALLOCATION.maximumRoots,60000);
 assert.equal(P6_ECOTONE_ALLOCATION.maximumPackedBytes,960000);
 await assert.rejects(planP6DryEcotone({installedTiles:[],p4BankTiles:[],maximumAddedRoots:-1}),/P6_ECOTONE_INPUT_INVALID/);
 await assert.rejects(planP6DryEcotone({installedTiles:[{count:2,packed:new Float32Array(4),minX:0,minZ:0}],
  p4BankTiles:[],admitDryContact:dry,maximumAddedRoots:1}),/P6_ECOTONE_INSTALLED_TILE_INVALID/);
});

test('P6 is a physical vegetation addendum; exact owner/page binding is source present',()=>{
 const owner=readFileSync('showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js','utf8');
 const page=readFileSync('showroom/globe/h-earth/index.html','utf8');
 for(const s of ['planP6DryEcotone','P6_ECOTONE_ALLOCATION','P6_DRY_GPU_UPLOAD','p6Ecotone','p4Riparian:p4Bank.receipt'])
  assert.ok(owner.includes(s),'missing source boundary: '+s);
 assert.ok(page.includes('vegetation-single-owner.prototype.v1.js?rev=sha-580540d6d0d9'));
 assert.ok(!owner.includes('P5_HILLSIDE_ECOTONE_END'));
});
