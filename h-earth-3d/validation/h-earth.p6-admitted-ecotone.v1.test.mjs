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
 assert.ok(page.includes('vegetation-single-owner.prototype.v1.js?rev=sha-f86b932f4b7b'));
 assert.ok(owner.includes('hillside-bank-ecotone-roots.p6.v1.js?rev=sha-109db7bc3ba4'));
 assert.ok(owner.includes('p6VerifiedBankCorridor'));
 assert.ok(owner.includes('H_EARTH_P6_FIRST_FAILURE_DIAGNOSTIC_v1'));
 assert.ok(owner.includes('p6FirstFailure:p6FirstFailureReceipt()'));
 assert.ok(owner.includes('p6StageTrials!==p6Ecotone.receipt.trials'));
 for(const stage of ['terrainSupport','terrainSlope','beachUnavailable','beachSand',
   'renderedWater','geologyWater','plannedWater','unprojection','groundAdmission','accepted'])
  assert.ok(owner.includes(`p6MarkStage('${stage}',x,z)`),'missing first-failure stage '+stage);
 assert.ok(!owner.includes('P5_HILLSIDE_ECOTONE_END'));
});

test('P6 widened footprint remains dry-contact-only and preserves explicit protected zones',async()=>{
 assert.equal(P6_ECOTONE_FOOTPRINT.minX,-160);
 assert.equal(P6_ECOTONE_FOOTPRINT.maxX,80);
 const result=await planP6DryEcotone({installedTiles:[],p4BankTiles:[],
  admitDryContact:dry,maximumAddedRoots:1024});
 assert.equal(result.receipt.addedRoots,1024);
 assert.ok(result.receipt.addedGpuBytes<=P6_ECOTONE_ALLOCATION.maximumPackedBytes);
 for(const tile of result.tiles)for(let i=0;i<tile.count;i++){
  const x=tile.packed[i*4],z=tile.packed[i*4+2];
  assert.ok(Math.hypot(x-80,z+172)>=31-1,'manor control remains excluded');
  assert.ok(Math.hypot(x+139.40268,z+210.74617)>=44-1,'woodland control remains excluded');
 }
});

// Gen3479: westward vegetation requires native dry contact, not a color overlay.
test('P6 westward soft envelope plants actual deterministic roots only at admitted dry contacts',async()=>{
 const eligible=(x,z)=>x<-110&&z>-173&&z<-125?dry():null;
 const args={installedTiles:source,p4BankTiles:bank,admitDryContact:eligible,maximumAddedRoots:2048};
 const a=await planP6DryEcotone(args),b=await planP6DryEcotone(args);
 assert.ok(a.receipt.addedRoots>100,'western physically eligible cells must not be feathered to zero');
 assert.ok(a.receipt.addedRoots<=2048);
 assert.ok(a.receipt.addedGpuBytes<=P6_ECOTONE_ALLOCATION.maximumPackedBytes);
 assert.equal(a.receipt.addedGpuBytes,a.receipt.addedRoots*16);
 assert.deepEqual(a.tiles.map(t=>Array.from(t.packed)),b.tiles.map(t=>Array.from(t.packed)));
 const points=a.tiles.flatMap(t=>Array.from({length:t.count},(_,i)=>[t.packed[i*4],t.packed[i*4+2]]));
 assert.equal(points.length,a.receipt.addedRoots);
 assert.ok(points.every(([x,z])=>x<-110&&x>=-160&&z>-173&&z<-125));
 assert.ok(points.every(([x,z])=>Math.hypot(x+139.40268,z+210.74617)>=44-1));
 assert.ok(new Set(points.map(([,z])=>Math.floor(z/8))).size>=2,'western roots should occupy distinct hillside bands');
 assert.ok(a.receipt.rejected.contact>0,'inadmissible contacts must remain rejected');
});

test('P7 draws four independently oriented physical P6 blades and preserves P3/P4 geometry',()=>{
 const owner=readFileSync('showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js','utf8');
 const page=readFileSync('showroom/globe/h-earth/index.html','utf8');
 assert.ok(page.includes('vegetation-single-owner.prototype.v1.js?rev=sha-f86b932f4b7b'));
 for(const s of ['uniform int uP7Tuft;','float p7Blade=float(gl_VertexID/6);',
   'p7Blade*1.5707963','width*=mix(1.,mix(1.75,2.40,p7Jitter),float(uP7Tuft));',
   'height*=mix(1.,mix(1.60,2.20,p7Jitter),float(uP7Tuft));',
   'float tipTaper=mix(.81,.985,float(uP7Tuft));',
   'p7TuftBladesPerRoot:4','p7TuftSubmittedTriangles:',
   'p7DryTuftGeometry:{bladeCount:4,trianglesPerRoot:8,sourceRootsUnchanged:true,admissionPredicatesUnchanged:true,packedRootBytesUnchanged:true}'])
  assert.ok(owner.includes(s),'missing native P7 geometry: '+s);
 const begin=owner.indexOf('function draw(packet)');
 const bank=owner.indexOf('if(p4Added){',begin),p6=owner.indexOf('if(p6Added){',begin);
 const end=owner.indexOf('lastDraw=',p6);
 assert.ok(begin>0&&bank>begin&&p6>bank&&end>p6);
 const p3=owner.slice(begin,bank),p4=owner.slice(bank,p6),ecotone=owner.slice(p6,end);
 assert.ok(p3.includes('gl.uniform1i(u.uP7Tuft,0);'),'P3 must explicitly disable P7');
 assert.ok(!p4.includes('gl.uniform1i(u.uP7Tuft,1);'),'P4 must not enable P7');
 assert.ok(ecotone.includes('gl.uniform1i(u.uP7Tuft,1);'),'P6 must enable four-blade tufts');
 assert.ok(ecotone.includes('gl.uniform1i(u.uP7Tuft,0);'),'P6 must reset P7 state');
 const count=(s,needle)=>s.split(needle).length-1;
 assert.equal(count(p3,'gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count)'),2);
 assert.equal(count(p4,'gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count)'),2);
 assert.equal(count(ecotone,'gl.drawArraysInstanced(gl.TRIANGLES,0,24,range.count)'),2);
 assert.ok(owner.includes('p6Ecotone=await planP6DryEcotone'));
 assert.ok(owner.includes('if(beach.rawSandCoverage<0||beach.rawSandCoverage>.12)'));
 assert.ok(owner.includes('if(hit.slope>.75)'));
 assert.ok(owner.includes('if(geology.sampleWaterAt(x,z))'));
});
