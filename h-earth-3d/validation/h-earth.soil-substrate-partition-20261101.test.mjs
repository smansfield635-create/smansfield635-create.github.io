import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

const renderer=new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url);
const source=fs.readFileSync(renderer,'utf8');
const ORIGINAL_RENDERER_BLOB='85ee835060d5106a670077a5f4352b7ad202b49b';
const PATCHES=[
  {
    "name": "identity",
    "before": "      float identityWeight=inlandIdentity*\n        (1.0-protectedGrove)*identityContrast;\n      palette=mix(palette,identityBase,identityWeight);",
    "after": "      float identityWeight=inlandIdentity*\n        (1.0-protectedGrove)*identityContrast;\n      // A03/A04: the current textured earth remains the common substrate.\n      vec3 ecologicalSoilSubstrate=palette;\n      float ecologicalIdentityLuma=max(\n        dot(identityBase,vec3(0.2126,0.7152,0.0722)),0.001\n      );\n      vec3 ecologicalIdentityHue=clamp(\n        identityBase/ecologicalIdentityLuma,vec3(0.60),vec3(1.60)\n      );\n      vec3 ecologicalIdentityTint=clamp(\n        mix(vec3(1.0),ecologicalIdentityHue,0.24),\n        vec3(0.86),vec3(1.14)\n      );"
  },
  {
    "name": "groundcover",
    "before": "      vec3 groundcoverTone=mix(\n        vec3(0.110,0.118,0.075),vec3(0.075,0.090,0.055),groundcoverMoisture\n      );\n      groundcoverTone=mix(\n        groundcoverTone,vec3(0.175,0.150,0.095),groundcoverDry\n      );\n      groundcoverTone*=0.88+0.24*materialVariation;\n      palette=mix(palette,groundcoverTone,groundcoverWeight);",
    "after": "      // Ecological pigment modifies local earth rather than painting olive.\n      vec3 ecologicalGroundcoverTint=mix(\n        vec3(0.965,0.975,0.945),vec3(0.890,0.960,0.900),groundcoverMoisture\n      );\n      ecologicalGroundcoverTint=mix(\n        ecologicalGroundcoverTint,vec3(1.015,0.990,0.965),groundcoverDry\n      );\n      vec3 ecologicalIdentityTarget=ecologicalSoilSubstrate*ecologicalIdentityTint;\n      vec3 ecologicalGroundcoverTarget=ecologicalSoilSubstrate*ecologicalGroundcoverTint;\n      // Nonnegative partition of unity: positive substrate share at every\n      // eligible pixel, including overlap; original supports stay unchanged.\n      float ecologicalDenominator=1.0+identityWeight+groundcoverWeight;\n      palette=(\n        ecologicalSoilSubstrate+\n        identityWeight*ecologicalIdentityTarget+\n        groundcoverWeight*ecologicalGroundcoverTarget\n      )/ecologicalDenominator;"
  },
  {
    "name": "habitat",
    "before": "    vec3 habitatSoil=landscapeCoverPalette(vWorldPosition.xz,foothillDry)*.72;\n    float habitatColorCoverage=clamp(habitatCoverage+habitatMaterialProtection(vWorldPosition.xz)*(habitatMaterialCoverage-habitatCoverage),0.0,1.0);\n    base=mix(base,habitatSoil,habitatColorCoverage*.68);",
    "after": "    vec3 habitatSoil=landscapeCoverPalette(vWorldPosition.xz,foothillDry)*.72;\n    float habitatColorCoverage=clamp(habitatCoverage+habitatMaterialProtection(vWorldPosition.xz)*(habitatMaterialCoverage-habitatCoverage),0.0,1.0);\n    // A03/A04: retain the resident soil grain through later habitat pigment.\n    float ecologicalHabitatLuma=max(\n      dot(habitatSoil,vec3(0.2126,0.7152,0.0722)),0.001\n    );\n    vec3 ecologicalHabitatHue=clamp(\n      habitatSoil/ecologicalHabitatLuma,vec3(0.60),vec3(1.60)\n    );\n    vec3 ecologicalHabitatTint=clamp(\n      mix(vec3(1.0),ecologicalHabitatHue,0.20),\n      vec3(0.88),vec3(1.12)\n    );\n    float ecologicalHabitatWeight=clamp(habitatColorCoverage*0.68,0.0,1.0);\n    base=(base+ecologicalHabitatWeight*(base*ecologicalHabitatTint))\n      /(1.0+ecologicalHabitatWeight);"
  }
];
const gitBlob=s=>{
  const body=Buffer.from(s,'utf8');
  return crypto.createHash('sha1').update(Buffer.from('blob '+body.length+'\\0'.replace('\\0','\0'))).update(body).digest('hex');
};
const clamp=(x,lo,hi)=>Math.min(hi,Math.max(lo,x));
const luma=v=>v[0]*0.2126+v[1]*0.7152+v[2]*0.0722;
const hue=(color,strength,lo,hi)=>{
  const y=Math.max(luma(color),0.001);
  return color.map(channel=>clamp(1+strength*(clamp(channel/y,0.60,1.60)-1),lo,hi));
};
const compose=(soil,identity,groundcover,identityWeight,groundcoverWeight)=>{
  const identityTint=hue(identity,0.24,0.86,1.14);
  const total=1+identityWeight+groundcoverWeight;
  return soil.map((value,k)=>(value+identityWeight*value*identityTint[k]+groundcoverWeight*value*groundcover[k])/total);
};
test('A03/A04 changes exactly three approved material spans; original Git renderer blob reconstructs byte-for-byte',()=>{
  let restored=source;
  for(const patch of [...PATCHES].reverse()){
    assert.equal(restored.split(patch.after).length,2,'missing/duplicate candidate '+patch.name);
    restored=restored.replace(patch.after,patch.before);
  }
  assert.equal(gitBlob(restored),ORIGINAL_RENDERER_BLOB);
  assert.notEqual(gitBlob(source),ORIGINAL_RENDERER_BLOB);
  assert.throws(()=>{
    const changed=restored+'//unauthorized';
    assert.equal(gitBlob(changed),ORIGINAL_RENDERER_BLOB);
  },/Expected values to be strictly equal/);
});
test('retains exact soil texture, diagnostic source weights, grove/estate/oasis/route masks and geometric stage',()=>{
  for(const anchor of [
    'worldSoilActualAlbedo','uClearingSoil',
    'smoothstep(0.0,10.0,length(vec2(groundcoverEstateX,groundcoverEstateZ)))',
    'smoothstep(0.0,12.0,length(vec2(groundcoverOasisX,groundcoverOasisZ)))',
    '(1.0-protectedGrove)','groundcoverRouteDistance',
    'float groundcoverWeight=0.88*groundcoverPatch*',
    'float habitatColorCoverage=clamp(',
    'ecologicalSoilSubstrate=palette',
    'ecologicalDenominator=1.0+identityWeight+groundcoverWeight',
    'ecologicalHabitatWeight=clamp(habitatColorCoverage*0.68,0.0,1.0)'
  ])assert.ok(source.includes(anchor),'preserved/required anchor missing: '+anchor);
  assert.ok(!source.includes('palette=mix(palette,groundcoverTone,groundcoverWeight);'));
  assert.ok(!source.includes('base=mix(base,habitatSoil,habitatColorCoverage*.68);'));
});
test('nonnegative smooth partition of unity preserves positive real-soil weight on allowed coverage grid',()=>{
  for(let i=0;i<=100;i++)for(let j=0;j<=100;j++){
    const identity=0.66*i/100,groundcover=0.88*j/100;
    const denom=1+identity+groundcover;
    const weights=[1/denom,identity/denom,groundcover/denom];
    assert.ok(weights.every(x=>Number.isFinite(x)&&x>=0));
    assert.ok(weights[0]>=1/(1+0.66+0.88)-1e-12);
    assert.ok(Math.abs(weights.reduce((a,b)=>a+b,0)-1)<1e-12);
  }
});
test('soil-relative ecological pigment retains all channel grain and remains bounded even at overlap',()=>{
  const soils=[[0.09,0.12,0.08],[0.25,0.20,0.15],[0.50,0.35,0.20],[0.27,0.40,0.31]];
  const identities=[[0.39,0.248,0.148],[0.235,0.188,0.130],[0.48,0.315,0.14]];
  const groundcoverTints=[[0.965,0.975,0.945],[0.89,0.96,0.90],[1.015,0.99,0.965]];
  for(const soil of soils)for(const id of identities)for(const pigment of groundcoverTints)
    for(let i=0;i<=20;i++)for(let j=0;j<=20;j++){
      const x=compose(soil,id,pigment,0.66*i/20,0.88*j/20);
      for(let k=0;k<3;k++)assert.ok(x[k]>=soil[k]*0.80&&x[k]<=soil[k]*1.20,'unbounded pigment');
      const near=compose(soil,id,pigment,0.66*i/20,Math.min(0.88,0.88*j/20+1e-4));
      for(let k=0;k<3;k++)assert.ok(Math.abs(near[k]-x[k])<0.0001,'material composition jumps');
    }
});
test('later habitat tint also forms continuous normalized soil-relative partition, not absolute overlay',()=>{
  const soil=[0.23,0.19,0.14],habitat=[0.3,0.24,0.16],tint=hue(habitat,0.20,0.88,1.12);
  for(let i=0;i<=100;i++){
    const w=0.68*i/100,a=1/(1+w),b=w/(1+w);
    assert.ok(Math.abs(a+b-1)<1e-12&&a>0&&b>=0);
    const out=soil.map((value,k)=>value*a+(value*tint[k])*b);
    for(let k=0;k<3;k++)assert.ok(out[k]>=soil[k]*0.85&&out[k]<=soil[k]*1.15);
  }
});
