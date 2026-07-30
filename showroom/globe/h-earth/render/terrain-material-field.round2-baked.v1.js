/** H_EARTH_UNIQUE_BAKED_LANDFORM_MATERIAL_FIELD_v1 */
export const H_EARTH_BAKED_MATERIAL_FIELD_ID = 'H_EARTH_UNIQUE_BAKED_LANDFORM_MATERIAL_FIELD_v1';
export const H_EARTH_BAKED_MATERIAL_FIELD_WIDTH = 1024;
export const H_EARTH_BAKED_MATERIAL_FIELD_HEIGHT = 1024;
export const H_EARTH_BAKED_MATERIAL_FIELD_BYTE_LENGTH = 4194304;
export const H_EARTH_BAKED_MATERIAL_FIELD_SHA256 = '28f801f8e5f7b82433f3e0f742cb8292d918ff33b1696c524d0762830c42e15f';
export const H_EARTH_BAKED_MATERIAL_FIELD_DOMAIN = Object.freeze({"xMinimum":-256,"xMaximum":256,"zMinimum":-320,"zMaximum":64,"seaLevelY":0});
export const H_EARTH_BAKED_MATERIAL_SOURCE_DESCRIPTOR_SHA256 = '0d54f758435068274ce5eba56af8996ff0b9cd1bb4ee183aaa32f165bf2ab0dc';
export const H_EARTH_BAKED_MATERIAL_SOURCE_SEGMENTATION_SHA256 = '69b518bd442d74edf8cea1242edf73a6de79aaa9c78975ae80ca3b66a78ffea5';
const assetUrl = new URL('./terrain-material-field.round2-baked.v1.rgba', import.meta.url);
let cachedPromise = null;
const digestHex = async (buffer) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', buffer))].map((value) => value.toString(16).padStart(2, '0')).join('');
export async function loadHEarthRound2BakedMaterialField() {
  if (cachedPromise === null) cachedPromise = (async () => {
    const response = await fetch(assetUrl);
    if (!response.ok) throw new Error(`H_EARTH_BAKED_MATERIAL_FETCH_FAILED:${response.status}`);
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength !== H_EARTH_BAKED_MATERIAL_FIELD_BYTE_LENGTH) throw new Error(`H_EARTH_BAKED_MATERIAL_BYTE_LENGTH_INVALID:${buffer.byteLength}`);
    const digest = await digestHex(buffer);
    if (digest !== H_EARTH_BAKED_MATERIAL_FIELD_SHA256) throw new Error(`H_EARTH_BAKED_MATERIAL_DIGEST_INVALID:${digest}`);
    return new Uint8Array(buffer);
  })();
  return new Uint8Array(await cachedPromise);
}
export function getHEarthRound2BakedMaterialFieldReceipt() {
  return Object.freeze({ fieldId: H_EARTH_BAKED_MATERIAL_FIELD_ID, width: H_EARTH_BAKED_MATERIAL_FIELD_WIDTH, height: H_EARTH_BAKED_MATERIAL_FIELD_HEIGHT, byteLength: H_EARTH_BAKED_MATERIAL_FIELD_BYTE_LENGTH, canonicalSha256: H_EARTH_BAKED_MATERIAL_FIELD_SHA256, domain: H_EARTH_BAKED_MATERIAL_FIELD_DOMAIN, sourceDescriptorSha256: H_EARTH_BAKED_MATERIAL_SOURCE_DESCRIPTOR_SHA256, sourceSegmentationSha256: H_EARTH_BAKED_MATERIAL_SOURCE_SEGMENTATION_SHA256, mipmapsRequired: true, uniqueWorldCoverage: true, runtimeTextureSamplesPerTerrainFragment: 1 });
}
export default loadHEarthRound2BakedMaterialField;
