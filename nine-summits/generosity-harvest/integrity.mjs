// Private preparation; no release authority. Manifest is pinned by trusted exact candidate code.
const manifestHash='719626e33755faa5464328c33f7b42baeb225a7ec14a2e04a6cac768c213c585';
const allowed=['art.png','hop-poses.json','source/scene.gltf','source/scene.bin','source/textures/Main_baseColor.png'];
const fail=(why)=>{throw Error('HARVEST_ASSET_'+why)};
const digest=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
export async function authenticateAssets(base,read=globalThis.fetch){
 const root=new URL(base);if(root.protocol!=='https:'||root.username||root.password||root.search||root.hash||!root.pathname.endsWith('/'))fail('HTTPS_BASE_REQUIRED');
 if(typeof document!=='undefined'&&(!globalThis.isSecureContext||root.origin!==location.origin))fail('SECURE_SAME_ORIGIN_REQUIRED');
 if(!globalThis.crypto?.subtle)fail('WEBCRYPTO_REQUIRED');
 async function get(name,max,expectedMime){
  const u=new URL(name,root);if(u.origin!==root.origin||!u.pathname.startsWith(root.pathname))fail('ORIGIN');
  const r=await read(u.href,{credentials:'same-origin',redirect:'error',cache:'no-store',mode:'same-origin',signal:AbortSignal.timeout(20000)});
  if(!r.ok||r.status!==200||r.redirected||r.url!==u.href)fail('RESPONSE_'+name);
  const type=(r.headers.get('content-type')||'').split(';')[0].trim().toLowerCase();if(!expectedMime.includes(type))fail('TYPE_'+name);
  if(!r.body)fail('BODY_'+name);const reader=r.body.getReader();let chunks=[],length=0;try{for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>max)fail('LENGTH_'+name);chunks.push(value)}}finally{await reader.cancel();reader.releaseLock()}
  const b=new Uint8Array(length);let off=0;for(const c of chunks){b.set(c,off);off+=c.length}return b;
 }
 const raw=await get('asset-manifest.json',4096,['application/json']);if(await digest(raw)!==manifestHash)fail('MANIFEST_HASH');const m=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));
 if(m.schema!=='HARVEST_284_PREPUBLICATION_ASSET_MANIFEST_v1'||m.candidate!=='repair003-owner-KEEP'||Object.keys(m.files).sort().join('|')!==[...allowed].sort().join('|'))fail('MANIFEST_SCHEMA');
 const verified=new Map();for(const n of allowed){const e=m.files[n];const types=n.endsWith('.gltf')?['model/gltf+json','application/json','application/octet-stream']:[e.mime];const b=await get(n,e.bytes,types);if(b.length!==e.bytes)fail('LENGTH_'+n);if(await digest(b)!==e.sha256)fail('HASH_'+n);verified.set(n,b)}
 const art=verified.get('art.png');const dv=new DataView(art.buffer);if(dv.getUint32(0)!==0x89504e47||dv.getUint32(4)!==0x0d0a1a0a||dv.getUint32(16)!==1672||dv.getUint32(20)!==941)fail('ART_DIMENSIONS');
 const json=n=>JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(verified.get(n)));const gltf=json('source/scene.gltf');const hop=json('hop-poses.json');if(gltf.buffers.length!==1||gltf.buffers[0].uri!=='scene.bin'||gltf.buffers[0].byteLength!==verified.get('source/scene.bin').length||gltf.images.length!==1||gltf.images[0].uri!=='textures/Main_baseColor.png'||hop.frames.length!==169||m.durationSeconds!==1.4)fail('ASSET_LAYOUT');
 // The verified bytes, not a second network request, are supplied to the original sampler.
 return Object.freeze({placement:Object.freeze({...m.placement}),artBytes:art.slice(),fetchVerified:async n=>{if(typeof n!=='string'||!n.startsWith('./')||!verified.has(n.slice(2)))fail('UNLISTED_RESOURCE');return new Response(verified.get(n.slice(2)).slice(),{headers:{'Content-Type':m.files[n.slice(2)].mime}})}});
}
