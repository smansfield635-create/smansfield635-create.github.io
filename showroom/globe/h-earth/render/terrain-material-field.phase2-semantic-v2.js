/** H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_v2 */
export const H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_ID='H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_v2';
export const H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_WIDTH=1024;
export const H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_HEIGHT=1024;
export const H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_BYTE_LENGTH=4194304;
export const H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_SHA256='2a2f3b215c112f1048cc23092ceb322733bba388d0fcf25a1e442bd5bba5e075';
export const H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_DOMAIN=Object.freeze({xMinimum:-256,xMaximum:256,zMinimum:-320,zMaximum:64,seaLevelY:0});
const assetUrl=new URL('./terrain-material-field.phase2-semantic-v2.rgba',import.meta.url);
let cachedPromise=null;
const digestHex=async buffer=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',buffer))].map(v=>v.toString(16).padStart(2,'0')).join('');
export async function loadHEarthPhase2SemanticMaterialField(){if(cachedPromise===null)cachedPromise=(async()=>{const r=await fetch(assetUrl);if(!r.ok)throw new Error('PHASE2_SEMANTIC_MATERIAL_FETCH_FAILED:'+r.status);const b=await r.arrayBuffer();if(b.byteLength!==H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_BYTE_LENGTH)throw new Error('PHASE2_SEMANTIC_MATERIAL_BYTE_LENGTH_INVALID');const d=await digestHex(b);if(d!==H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_SHA256)throw new Error('PHASE2_SEMANTIC_MATERIAL_DIGEST_INVALID:'+d);return new Uint8Array(b)})();return new Uint8Array(await cachedPromise)}
export function getHEarthPhase2SemanticMaterialFieldReceipt(){return Object.freeze({fieldId:H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_ID,width:1024,height:1024,byteLength:4194304,canonicalSha256:H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_SHA256,domain:H_EARTH_PHASE2_SEMANTIC_MATERIAL_FIELD_DOMAIN,mipmapsRequired:true,uniqueWorldCoverage:true,runtimeTextureSamplesPerTerrainFragment:1,encoding:Object.freeze({rgb:'SEMANTIC_FAMILY_BLEND_SRGB8',alpha:'WETNESS_UNORM8'})})}
