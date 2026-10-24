/** Exact output of the existing oasis soil derivation, never a new placement authority. */
const ASSET_SHA256='05435e62907b8880d2972330d3c16dde8619186c2f014b7df7796318594ae6ec';
const sha=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
const fail=reason=>{throw Error('OASIS_SOIL_'+reason);};
export async function loadPrecomputedOasisSoil(pkg,{fetchImpl=globalThis.fetch}={}){
 const bytes=await fetchStartupAsset(new URL('./assets/oasis-soil-mask.v1.json?sha='+ASSET_SHA256,import.meta.url),{fetchImpl});
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

// One bounded retry for transport failures, never for content/integrity errors.
export async function fetchStartupAsset(url,{fetchImpl=globalThis.fetch,readBody=async response=>new Uint8Array(await response.arrayBuffer()),pause=ms=>new Promise(resolve=>setTimeout(resolve,ms))}={}){
 for(let attempt=0;attempt<2;attempt++){
  try{
   const response=await fetchImpl(url);
   if(!response.ok){const error=new Error('HTTP_'+response.status);error.retryable=[408,429,500,502,503,504].includes(response.status);await response.body?.cancel?.().catch(()=>{});throw error;}
   return await readBody(response);
  }catch(error){
   const retryable=error instanceof TypeError||error?.retryable===true;
   if(attempt===0&&retryable){await pause(250);continue;}
   throw new Error('STARTUP_ASSET_FAILED:'+new URL(url).pathname+':'+(error?.message??error),{cause:error});
  }
 }
}
