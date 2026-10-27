import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const path=new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url);
const source=readFileSync(path,'utf8');
const oldBlock='      float groundcoverPatch=smoothstep(\n        0.20,0.66,groundcoverOrganic*0.78+mesoField*0.22\n      );';
const newBlock='      // Gen2940: broaden only the material-only organic transition, not planted roots.\n      float groundcoverPatch=smoothstep(\n        0.12,0.78,groundcoverOrganic*0.78+mesoField*0.22\n      );';
const sha=value=>createHash('sha256').update(value).digest('hex');
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const weight=p=>.88*p*(1-.25*smooth(.30,.85,p));

test('Gen2940 source differs from frozen published Gen2928 only by the one approved material patch transition',()=>{
  assert.equal(source.split(newBlock).length,2,'exactly one material patch transition expected');
  assert.ok(!source.includes(oldBlock),'old narrow patch transition must be replaced');
  assert.equal(sha(source.replace(newBlock,oldBlock)),'fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec','all other approved renderer bytes must remain identical');
});
test('soil material transition softens peak gradient without flattening or removing existing cover',()=>{
  const old=[],next=[];
  for(let i=0;i<=10000;i++){const signal=i/10000;old.push(weight(smooth(.20,.66,signal)));next.push(weight(smooth(.12,.78,signal)));}
  const peak=a=>Math.max(...a.slice(1).map((value,i)=>Math.abs(value-a[i])));
  const mean=a=>a.reduce((sum,value)=>sum+value,0)/a.length;
  assert.ok(peak(next)<peak(old)*.75,'peak color-overlay weight gradient must decrease by at least 25%');
  assert.ok(mean(next)>=mean(old)*.95,'do not erase low vegetation tone / make terrain desert');
  assert.ok(mean(next)<=mean(old)*1.05,'do not create a saturated green carpet');
  assert.equal(next[0],0);
  assert.ok(next.at(-1)>.60,'strong existing patch interiors remain legible');
});
test('coastal, rock and protected-ground gating and shader vegetation separation remain unchanged',()=>{
  for(const anchor of [
    'groundcoverSuitability*groundcoverProtection;',
    'smoothstep(28.0,72.0,max(0.0,vCoastDistanceMeters))',
    '(1.0-smoothstep(0.12,0.42,slope))',
    '(1.0-smoothstep(0.18,0.58,rockExposure))',
    '(1.0-protectedGrove);',
    'palette=mix(palette,groundcoverTone,groundcoverWeight);',
    'if(worldSoilTerrain&&uWoodlandHabitatEnabled==1)'
  ])assert.ok(source.includes(anchor),`preserved shader invariant: ${anchor}`);
  for(const suitability of [0,0.2,0.8,1])for(const protection of [0,0.4,1]){
    assert.equal(weight(smooth(.12,.78,.6))*suitability*protection,0===suitability*protection?0:weight(smooth(.12,.78,.6))*suitability*protection);
  }
});
