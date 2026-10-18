/** Exact output of the existing oasis soil derivation, never a new placement authority. */
const ASSET_SHA256='de82ecd3efb23f725f2558f003694c05727d519a227358587a9a1719beff787d';
const sha=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
const fail=reason=>{throw Error('OASIS_SOIL_'+reason);};
export async function loadPrecomputedOasisSoil(pkg,{fetchImpl=globalThis.fetch}={}){
 const response=await fetchImpl(new URL('./assets/oasis-soil-mask.v1.json',import.meta.url));
 if(!response.ok)fail('HTTP_'+response.status);
 const bytes=new Uint8Array(await response.arrayBuffer());
 if(await sha(bytes)!==ASSET_SHA256)fail('ASSET_INTEGRITY');
 const value=JSON.parse(new TextDecoder().decode(bytes));
 if(value.schema!=='H_EARTH_PRECOMPUTED_OASIS_SOIL_v1'||value.packageIdentity!==pkg?.packageIdentity)fail('PACKAGE_IDENTITY');
 // Exact runtime inputs are authenticated too: a stable package label alone is insufficient.
 const input=new TextEncoder().encode(JSON.stringify({positions:pkg.buffers.positions,indices:pkg.buffers.indices,primitiveSpans:pkg.primitiveSpans}));
 if(await sha(input)!==value.provenance.inputSha256)fail('INPUT_IDENTITY');
 const pixels=Uint8Array.from(atob(value.pixelsBase64),x=>x.charCodeAt(0)),summary=value.summary;
 if(summary.width!==104||summary.height!==146||summary.grassTuftCount!==350||pixels.length!==15184)fail('LAYOUT');
 if(await sha(pixels)!==value.pixelSha256)fail('PIXEL_INTEGRITY');
 return Object.freeze({...summary,bounds:Object.freeze(summary.bounds),pixels});
}
