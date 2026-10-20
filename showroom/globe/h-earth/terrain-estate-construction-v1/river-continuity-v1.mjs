const assets=Object.freeze({
 'river-route-v1.json':new URL('./river-route-v1.json',import.meta.url),
 'h-earth-river-source-v1.json':new URL('./h-earth-river-source-v1.json',import.meta.url),
 'river-mesh-v1.bin.gz':new URL('./river-mesh-v1.bin.gz',import.meta.url)
});
const sha=async b=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b)),x=>x.toString(16).padStart(2,'0')).join('');
async function get(name){const r=await fetch(assets[name]);if(!r.ok)throw Error('RIVER_ASSET_UNAVAILABLE:'+name);return r;}
export async function loadRiverContinuityMesh(){
 const route=await (await get('river-route-v1.json')).json();
 if(route.terrainPayloadSha256!=='ed0905a208ee6bc8b99ff7271a3d636119d947dc57306a9293ba7405c3de0442'||route.sourcePointsIdentity!=='7799cf58594ec0c6494a2431bd41196204f82c043da7c6f0cde38d9ffcf54990'||route.sourcePointCount!==79)throw Error('RIVER_SOURCE_BINDING');
 const source=await (await get('h-earth-river-source-v1.json')).arrayBuffer();if(await sha(source)!==route.sourceFileSha256)throw Error('RIVER_SOURCE_BYTES');
 const zip=await (await get('river-mesh-v1.bin.gz')).arrayBuffer();if(await sha(zip)!==route.mesh.compressedSha256)throw Error('RIVER_COMPRESSED_IDENTITY');
 const buffer=await new Response(new Blob([zip]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();if(await sha(buffer)!==route.mesh.payloadSha256)throw Error('RIVER_PAYLOAD_IDENTITY');
 const view=new DataView(buffer),nf=view.getUint32(8,true),ni=view.getUint32(12,true);if(buffer.byteLength!==16+4*(nf+ni)||nf!==route.mesh.vertexFloatCount||ni!==route.mesh.indexCount)throw Error('RIVER_FORMAT');
 const mesh=Object.freeze({vertices:new Float32Array(buffer,16,nf),indices:new Uint32Array(buffer,16+nf*4,ni),statistics:Object.freeze({triangleCount:ni/3,sourceCenters:79,terrainPayloadSha256:route.terrainPayloadSha256,sourcePointsIdentity:route.sourcePointsIdentity,payloadSha256:route.mesh.payloadSha256,physicalVegetation:false,physicalRocks:false,continuationOnlyAuthored:true,physicalDownhillSimulation:false})});
 window.__AUDRALIA_SOURCE_RIVER_MESH__=mesh;window.__AUDRALIA_SOURCE_RIVER_RECEIPT__=Object.freeze({schema:'AUDRALIA_SOURCE_RIVER_RUNTIME_v1',generation:2839,...mesh.statistics});return mesh;
}
