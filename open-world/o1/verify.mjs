import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname));
const files=['index.html','styles.css','world.mjs','app.mjs'];
const text=Object.fromEntries(files.map(f=>[f,fs.readFileSync(path.join(root,f),'utf8')]));
const checks={
  substantial:text['app.mjs'].length>5000&&text['world.mjs'].length>1200,
  canvas:text['index.html'].includes('data-o1-canvas')&&text['app.mjs'].includes("getContext('2d'"),
  touch:text['app.mjs'].includes('pointerdown')&&text['app.mjs'].includes('state.zoom')&&text['app.mjs'].includes('state.x'),
  sameWorld:['AUDRALIA','Gratitude','Harbor'].every(v=>text['world.mjs'].includes(v)),
  sandbars:text['world.mjs'].includes('sandbars'),
  oAuthority:text['app.mjs'].includes("implementationAuthority:'OPEN_WORLD'"),
  nonProduction:text['app.mjs'].includes('productionConnected:false'),
  noCorrespondence:text['app.mjs'].includes('correspondenceConstructed:false'),
  noHEarthImport:!Object.values(text).some(v=>/from\s+['"][^'"]*(h-earth|showroom\/globe\/h-earth)/i.test(v)),
  noNetworkImport:!Object.values(text).some(v=>/https?:\/\//i.test(v)),
  distinctExpression:text['app.mjs'].includes('terrainHeight')&&text['app.mjs'].includes('drawContours')&&text['app.mjs'].includes('project(')
};
const failClosedCases={rejectHEarthImport:/from\s+['"][^'"]*(h-earth|showroom\/globe\/h-earth)/i.test("import x from '../../h-earth-3d/x.mjs'"),rejectNetworkImport:/https?:\/\//i.test('https://example.invalid/runtime.js')};
const pass=Object.values(checks).every(Boolean)&&Object.values(failClosedCases).every(Boolean);
const receipt={schema:'OPEN_WORLD_O1_SPECIMEN_VERIFICATION_RECEIPT_v1',result:pass?'PASS':'FAIL',checks,failClosedCases,productionMergeAuthorized:false,userPhysicalInspectionRequired:true};
console.log(JSON.stringify(receipt,null,2));if(!pass)process.exitCode=1;
