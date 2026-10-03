import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sampleHEarthRun8CSuccessorSurfaceMaterial} from '../../../../h-earth-3d/environment/h-earth.successor-surface-material.run8c.js';
import {sampleHEarthGen311PlacementStructureDisposition} from '../../../../h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js';
import {createHash} from 'node:crypto';
import {getHEarthRun8ER2ImmutableLiveRenderPackage,getHEarthRun8ER2VegetationWorldTruthPlan,createHEarthRun8ER2VegetationPresentationBatch} from './live-render-package.run8e-r2.js';
import {constructHEarthGen2515VegetationPresentationBatch} from './run8e-successor-environment.js';
import {buildHEarthOasisGrassSoilCoverage} from './grass-lowland-trial.js';
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const pkg=getHEarthRun8ER2ImmutableLiveRenderPackage();
assert.equal(pkg.eligible,true);
const packageBefore=digest(pkg), selectedAnchors=[];
const sourceHashes=Object.fromEntries(['grass-lowland-trial.js','live-render-package.run8e-r2.js','persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js','grass-lowland-trial.verify.mjs'].map(path=>[path,createHash('sha256').update(readFileSync(new URL(path,import.meta.url))).digest('hex')]));
const helperSource=readFileSync(new URL('grass-lowland-trial.js',import.meta.url),'utf8'),acceptedStart=helperSource.indexOf('function replaceTuft('),acceptedFunctionSha256=createHash('sha256').update(helperSource.slice(acceptedStart,helperSource.indexOf('/**',acceptedStart))).digest('hex');
assert.equal(acceptedFunctionSha256,'7a908ba17b685bd6dcaf2c197e2bb9750b56f41d1ced1cbd727a30de7263ec5d','accepted blade builder changed');

// Independent West capture from immutable predecessor 2717035, before candidate construction.
// Timed package construction is excluded only from the cross-process package comparison.
const shorelineBaseline={
  "exactHead": "2717035f6c6d7ba0f488ee424ddfb6ee361b4df3",
  "helperSha256": "97d8f874c3706cb41f035c16f3c9f40b6ef9f9d17c9edea638d84f0cf4056fcb",
  "grassCount": 350,
  "originalGrassCount": 4,
  "grassSha256": "d125f088dbd1e02e09b7ce90d4bb4d4707e273e2a49f752196dce1b6a4ad7f6b",
  "originalGrassSha256": "2b9fa62733eb18c63dbc8979f3720d51cfe9d6dee23de9402d027135a4a8bec1",
  "oasisIdsSha256": "f94622ee8b8bf5564d9a58d0e2edfc6e22780bc9033acc5325558646d1bfeb30",
  "rootsSha256": "24af7b8174ebe238f14f57b00fc54a2bec3159d39cd2f4332799277fab06b44b",
  "topologySha256": "ba4486cd628d480c7ec9b699d5cfc064578b6786203a17214df54e3a1880a922",
  "oasisTriangles": 326304,
  "oasisVertexCount": 284928,
  "immutablePackageStableSha256": "e8e4cf5a7603158030ade0006705a8f809896ae254160021634f3dc019e24c28",
  "immutableBuffersSha256": "0b56c9330ecfca5db84b0d7e20013a2ca6642eeb19e1b6c1be0f34e2262fd794",
  "packageIdentity": "H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_A829F478",
  "contentDigest": "fnv1a32:a829f478",
  "cattailGeometrySha256": [
    "ac4352ccb7c95f7ffd87cb49b97ea4ae509327a2460186b0eb79f3a6e09e4a10",
    "868fc0fc25c2a83ac4e53f8080de9e97214e86b4ef00a3fdc1224c3864273bdf",
    "7ecf6e4fe845ffc9f6da59ec169b54f33e863fd9dd11770b882a590666dad625",
    "d3efddbfd10bb3410ee082ac93bccfc359b48eddbd3d27306d9170fe942f656f",
    "37f38399ffc837d2a5805e0fc5fbb11fffda9631ee82e595dfcdbf4523d2686d",
    "eda491e7afc8cc833fd7f44cfd2c270ec03ec6dca033f9997aabedf7cbd07b75",
    "d2663de3458c6ac818589c39871750f7bad40475140256dd769b71a078ebc8dc",
    "0cc44f202a4d5d6b06a97ea0c06f5d15ffdc4e8bc61b2e07e27980c6e88f0cb3",
    "1721452b5e081d804c8ea0b5fb5dbea7c83cd5f3043a9e1d641a2e9b2ea0c7cc",
    "b8e40775511a152872fa919d831111b8b33564826ec4c8abd1b04a8bef487914",
    "8dd4727110d7845fb7956e9cb94e61964ea77c5073b90d1329ff79211a9b95a2",
    "cac1453850cdddcd6aef28f8f65277fb8db27ce84dc7de06359ca28494b1eea2",
    "ec19658bcac3d6784553d9d150e635f38b2bb89ffd2d1ee72135c32ecb2875b1",
    "152f19f26a429222d75f7e157888882bf5689f3d2574d7e20de1bd6060eb0edf",
    "1aa6a69dabb5394dc68932f13a6a3bceb741a7ad491b98f92621b6ec100462f7",
    "46e079ff0886fbd65ce4535ed9863d2c7ae403650863c17c3d43db9637aa3f42",
    "392e9f99543c9b7c99ad39da6bbff34796e449bf68caf39abd4169cd3c835db9",
    "b0042202f5f994d88b0f2ddf7bf4a6cfd523907a2a424fcd88cf3d6e101f7d12",
    "9239f0d8eda82560e185a39e435ea93ff982fecd8d9c9808ae382a441c737a32",
    "0d469effb711df27be7a093006c649e1cc899989a48660665cb5466072ae4113",
    "a645f3ff8e4ace268382bc9bbf82e98383a771feefb4a451e1a9a502b2196ed4",
    "613624f79929b4aa3346473740fc35c7dd42da4432953cddf5651589d00cdd57",
    "e1dee7401914294a7dad206a4eef8ea55c0bac23473ac7d7bd563e063c141839",
    "826b1df019c860de2ab1741f3b32a96d833366569220f6fb231809e8a5288d2a",
    "6e87afbd63ff9e2d4c4e7c92a09c53ca7ad7cea3fcc96379181c566962896982",
    "15d47edec96c849400a4125b835726d0964e3407feef8b2faa0bf21d939b5e0f",
    "ee164e9a3c2c0a74bee0fd57cc078a260fb5c021321b72f52c85c262e195f59b",
    "ec9ffbce3d7acfc6a0efde8e0b56c97f4b167bda340b831f8c8dbbf973354285",
    "038880c3f40c514aa5f5b1e824606c37517fdf5cf821a72c55a474dcc1e94194",
    "bbaec7177e89690c5dcfedfba8eaf588f90a9acdcdcebb36ce76b641bd979ba2",
    "62312eb39e8419e7de87a84e1421fa70e60c64787c532d2a8f9ea6894bb7bd01",
    "3bd144805388bee2cf93cbcd00bbcafa007f812f7ae3d4a1c266bfc111eb3587",
    "e886027f49a36fbea07af7785363088d4f49951fe34a7da2830b12273693fe48",
    "dd4dd776b395b17a657957fef997fa823c7c8cfe1934749233918eed018541be",
    "2c8d7aa5a41600a864404710b3a67a254210581041106764d25833580de21b85",
    "30b67152328e2c712a1b00a4a38426515d23d58303b0045c6ad2936a6434e27d",
    "8ba49ae57a12e501c43e6b292e58cbc91329511e3d15ed49f58ad45d4e106e87",
    "87a1db6733e5a63fa31c5c9a1396dfe179241a4bade81649bcd4b4bfc261abbe",
    "4d1a21180ff9062dca023a75124a4737db1255af8f96ab01374554831fec3f5d",
    "47ecc3ece56343f9c84d75eeed4a52615d1857f613600689f83ea4934e7abb8c",
    "746600501f4f0bd47f0ba3af91bbdfabca5c465b8059e92438ee30a713599a9f",
    "a033cba39bf53cfa956e46d9f0076614b5edc2277ab6a83745a69cf68f5b0027",
    "815d2e8098821fb450985e76995e8c5121ef5b27ea07efa2fe075fa2e7a4c5f4",
    "b8774ac004e3922ce5fedbece177b70a7ecc5337400e7807fadd62f3d0ef66ff",
    "abc142fad333c25b16b5f14a5a668b6abe30452db3c17771948a71c511b9678b",
    "3c8ec38fffcc6b8935074c83bc1a88d03178bbf055949659a5203cc95d734a1d",
    "64918d94db4bef2f644f417f6f353b9a1505eed0f43515aa17dc26b2a600d034",
    "3c2fc3bce2a0d097981a09d65d5f7ae2ce9c3f7cd23a3253ae1e41ece21c9c5d",
    "574623d9f6a81da18b3520a3d54d16d40ebfffbb5c163582099e14aef5a946ac",
    "42dc6a8719dd7167cc9daf8181b37b1a178b8310748b93f464a9ac25a10aeee2",
    "ab8b97144629a80b0a29dcd542f24b3b9bad4dc0c5b0f6ef819f6d33cfe0ed53",
    "d2766e7fd607b2485e689d031a4d37916eeda1d6c3bc4f21c67a445e91b8a5e3",
    "f421374b38957b7f8e07b70e7064183d5ea041e4b748d37b13f27c8a282cb537",
    "9c12aa2bbc94a60329642322491aa1868f3e72bde2b69db8df2ee72b9551170d",
    "125f43def0fab5ad85126030d79bbd0d20affc8a5b0dc8285d1f06fa4ce4e842",
    "6d3f9f631a9d93b4bfd0ae4066f1e09d10b7be548b50d8b0771d627bd34b7d49",
    "60f3b6c1027528c8306b288c72cc92c19392a078f1a60d84994e7f71c8e42f34",
    "3fd5f82320b4f80bc8c14029869c61f3e6e9e9dfd33a07a2a3c2a71606eddffa",
    "281cff23c514d7315c0648860b83eeec271e3bbdda491557b7eea084ee09dc3e",
    "82c1683c58048aa046baba8c921aaea9449166a8b31b620792e92360ad399a09",
    "af9f15cddf4a2f3ca4c099e12356f2cbf014343e45a8e96d77afd075f28734e1",
    "d162566f9ced6bbb30fec4d3fc88d45e091ae192753bad42688ef3f417db09eb",
    "295f786e5a03bb759ccdbdcce1b6b53371b9f948fc7105a3811cb14bc5da5789",
    "7fd8ebdeba7c22b5aa7dc369041ab3fd3a971d4e467b1a18637f77d15ffdc811",
    "8520182ce3d13d9ea9e304e19221207d9c52371a2b5d3145faed1b085f722736",
    "6f55750e264c1bde888c2a29691564a743986f2db526878b8f0348e0f17f6428",
    "e453c2b2e06dfa2e93ea8913f9a2465e0e31db9697a2bd6ad149422ca698e7a5",
    "268b0f6e4f7997fc7ecf7c2ad324c4c83021f5848bc7008a59a070c68678c3be",
    "b64c0874389f7ffa8ee8d2a36bc666e1c6678c20ef267026ce6c2722b3dfa183",
    "bb95b1a22396552c0ab40b041f4c1a7549867255bcd3ad06196b27b16285c975",
    "c95493e4599f9121d393bab25d3db9c239f874cd9e2ad9146b6e6b18883fb19a",
    "728a48dc6b50247a08fed28dc3dc31eb3a48377c817d286012f786a2cb098361",
    "7097b4f2d1f2e2c126b58bbe53e05fa07daa88974a5be4a310b9065a25753cd0",
    "369a547618a46076fcfe31caccb2dc8c8ae33595687d457f308ab0d93a48b2c5",
    "84b8c44e29b868e4bba9047de9dba86a52d14bbde97e0dbd7435b030f5f33bd9",
    "a4b1a6280ecbc1a12aabfd0dad3e236f4fa9e8c8ab33c34b42e4145b5916fcd8",
    "a0c0473f4fb33b461a3e3c2c9f355013e5cf4d6527558ebc147026c0e7bf2971",
    "4ba567f0b45c4ee7a364b380055b9a1b766bdd0bb0a43a6d8640d3c66aee6696",
    "7a9388fc4ef72203a1c2b3b3b37c5491f074a035655fc6d1fcc2909da77ece20",
    "0054d01798e5f661971495fa8210aa854c31600f37054f05eef46ab81fe2ed20",
    "2504a3a5c51751c35c41757b3816a7296ea802d7a4f7bd3402495b4b96f536cc",
    "8f4490c5bbdf72cbaab468a036903d61217629a6c1f3331f09bc9a99b3404243",
    "ecb4a13ffd832c7c4044d0bd2be59f3af175c639e6fcaf540f2dd0823f0e449d",
    "8a4da0664383f5e4e1a4a5a8a9b85de58eced6fea6afc4ccec73a2096e4d056d",
    "1bb8d410e4738e4237f52d102f9b185676e3e50e2ca042ed4ec6aa3ae28d12d5",
    "a5d26ccbcd4a268d6cc97404242a55dbf23f8a05ca5f6c4e512703b8a3deeeaa",
    "df50ead85774f24e9888ab2ff27d0fee054fd1f32b3c5faee4c16c2d28c282a5",
    "f97d7363b827085d68e929f4dbfa66a43b56cc163370d28bdd041b8977f75e17",
    "a261382c0dffff1f2c9940f20ca9530dad6c0fc1a697af3eaa9ab7c8113f2603",
    "e9988b8f19036ff651b28cfb3964cee18dfecf4b16e27c3b846fb60540672de5",
    "6287ebfedd57b33046a55aac19e8a31dd9768208759a45217b917034bc567c04",
    "f4fa96a6018835f5532152cb66e6c1a3606d9b2ca1c31b5b8f080d0c5c46909c",
    "359ba05e4e87f754528cac638ab84a993ef91212cd6b17e7b98b6a7d45c1bb7c",
    "76badd723611bb6c031d74cd0dbd90247a43f8f2c6e628db1a36d05daa5d2d56",
    "299fd4b05714c38dc99bc5500ba220a1b29f1d8f8f5315f83254581feba69779",
    "96c024451748ab01cbdcb0724e97aac93fc39ff0f062c7c86422c4f3f6ee8e59",
    "ed7de915705093257d15aab6b8e66e930ced84dcbe9fe29098c4c23ba24a8d74",
    "a690da1bc5a6b4bc10861e3e4692bf0eaa4d1c4fb7fc8dad0e893350ddb6d328",
    "cd9cdb1157bfe84982f356e75e8ceecfe9d3e50d1dd70eb04d05abe6fdbea2d1",
    "0c054f284227b49125631f24e4b72f193ddb287510b0fc21cbb03b68039c2fd1",
    "b7d47f326e4ec6b0cf93676fd8078a661cad0816f557302f9f25dabb6fcd3055",
    "ea4deccc5d73d6963e63622635b0e2adc8d016a421810ced8f843f1a88967bc4",
    "c0ca5734b0bc0b9f57fae14042e5868ef41de23d428b40684db18cac2feb29d5",
    "d33c01e8b7cd523ae0a4cc5532af81950a672b6081fee77b6134e082aaab2a62",
    "94c0d101cd12f6588c2b823ea39aa82795220aa40403e09bcefb1620da63f0b7",
    "54389634aad653fa1697df64356c4c4453f4a48f9b58f97b5cdd75210c3d9584",
    "daa559139b5d611512417124328586e9f1ac208ae1fc6780cdddce8b14576c2e",
    "54a2ee46be874685a623bf6a4742dc0218112ba6eda89b9d3a310c6c4f1417a2",
    "08ee74039bb8c5789c126ef8f4cf21fcf5b42a5b2f38c82dab3bc54af24d1290",
    "d392d196890dec8ea011b202101d10bd06be21714a0caab3a349108c36a72f58",
    "faf159e0af65f38d0f8b91635cbe7c79e8aa6a3f3565c356565f960f5828e447",
    "1fe92d6ee934c9337ab72c1b63a54622b537668d11c04450c83fe4da69138329",
    "8f9b4c0cd3347c06edd83a75a6379db5998e3348225b26ca56610e6d061aafd7",
    "ead48e2e47a387085da7a783a359c27cc830e98fc7887eacc4cce63989c9a316",
    "233f5c66219c9be2f257e7f9c0b70a354b7ff9cb37fa53c3109148e631be7fb1",
    "65817b382bd7f695825e6474f8d1711203fa12ec2c5a22cc5c126be37be6df1c",
    "9b1b82416a8017cedd83eee5b636696c1433633747dfbadc736874657ab4db90",
    "83019149d45feeda2e35b3d1763f30049cc4dc2f85224006e14fdc61cbca0231",
    "b512dbe838821ad136c0f59412c3a3955b9943be85d256542e5e29967e9d50f0",
    "ee304202455ecc5c1bf4aebfe33d488fda38a7b397b6cbb3414901e5de9f5e2c",
    "393fc04fe0a746be0e5f3894433c97953ee78f6a28bd4212ab3062167b41fb73",
    "5f7f7b258782fa550f49422ceff18fc0232143985de8a831d574187d2c14ec02",
    "d9a0309f9eb4dccf9687b0e75ea4085f032cfb8fe807a21da1f64767bb1a0948",
    "c20f20bad89bdc8f5c581ac94373374f4ac43a3dcabd9de439fd80685aea60fd",
    "7bfb24d05dcfed8bf9783a48c487666fbd5ca3220a8fac59a999130a19cedfc4",
    "a658992ff17df3108bf0bbdfbfd19aba8fbc878e7f76ae163556afdcfb1f4ae7",
    "24f94f849887eb599c5d70cd5b26ea41a81073a599e500ce9d497cca53e6922b",
    "cd1d82d0a82c523f55d04d8d7079cba116e90291f9e85ce2a361570c39001ddf",
    "79112fdd291265241a62b0442ea23d034ded5805675f8bddff5bc1bda1d96609",
    "32ff81ba8cf3afa51ebc594d17e0988f696058f6b19931d7a1b5cb2420cba7f9",
    "4c98edafd5487f4e272b9154faeb0364b846b64fd22145a53b00bc65f26ed318",
    "3fa81814a84a6dd68aba9989244581260ecf61f3865362a77b6d9005472e0f74",
    "a87ca8051fbfc6fc105f8ffc995fe8c3737e70239a3794d0d5ffddd8e7bc2186",
    "2bbe4495eb34f29c8ce3830c6107e67f804de257c618cea18082b68d3b963a78",
    "51bb520f806454f0ac302e3590eda8ecd4efc1e0fef320d99c3aec0e164c68b4",
    "9840ec1578ad3ad940acd660412ab188e741d4f1dc564db61c96a82289759487",
    "39b217d12b430407b07796800bb3f7771a67f46b5d7ec9cf97a61ee3a97ba4fb",
    "eb6ef60cb57d3a03cd1025203294999ca78485491572b1997932cd0602aefe94",
    "7a63df233238a8979ec56aaadc1aad9cc80aa294c2519b8c8d3faf73b6e53e9b",
    "04ce523b9dcf918217f25a795e5122bff3c87af1f2b9a22024785e3cb260710b",
    "710e172161d140ebda36ef4007d9ab4bd93c86eda6bc25d02341bb052408e3c7",
    "7a8ae3981801c7eb3909eeb45d23a2671271accb8da15541c12b6935170f6d9a",
    "562c519ba72edef96575a76de136826dcfeaf64b639e69f0f40c60cbaad5119a",
    "d58f0db924822c5ce4d168b2ff27c03f7c34f7e05062ea5bf411c2169233d434"
  ]
};
const shorelinePrimitives=[],originalGrassPrimitives=[],headShapeEvidence=[],leafShapeEvidence=[];
const {constructionMilliseconds:baselineTimingExcluded,...stablePackage}=pkg;
assert.equal(digest(stablePackage),shorelineBaseline.immutablePackageStableSha256,'canonical world package changed');
assert.equal(digest(pkg.buffers),shorelineBaseline.immutableBuffersSha256,'canonical mesh channels changed');
assert.equal(sourceHashes['live-render-package.run8e-r2.js'],'58d7a35792fc16b9eceaa7e465c5881d623948d794a862f8800e11738a924449','immutable package source changed');
assert.equal(createHash('sha256').update(helperSource.slice(helperSource.indexOf('/** Synchronous compatibility path'),helperSource.indexOf('\n/** One presentation mask'))).digest('hex'),'0c4436d0c2949558d3127b98f8be53ef80aa8f7c29b699a6a164afc94f9cbd7f','incremental preparation wrapper changed');

const triangles=[],waterTriangles=[];
for(const span of pkg.primitiveSpans.filter(s=>s.role==='TERRAIN'||s.primitiveId.endsWith(':FAR_OCEAN_CONTINUATION')))for(let i=span.indexStart;i<span.indexStart+span.indexCount;i+=3){
 const v=pkg.buffers.indices.slice(i,i+3).map(n=>({x:Math.fround(pkg.buffers.positions[n*3]),y:Math.fround(pkg.buffers.positions[n*3+1]),z:Math.fround(pkg.buffers.positions[n*3+2])}));
 if(Math.max(...v.map(p=>p.x)) < -33 || Math.min(...v.map(p=>p.x)) > 35 || Math.max(...v.map(p=>p.z)) < -205 || Math.min(...v.map(p=>p.z)) > -130)continue;
 (span.role==='TERRAIN'?triangles:waterTriangles).push(v);
}
function terrainSample(p,source=triangles){for(const [a,b,c] of source){const d=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);if(Math.abs(d)<1e-12)continue;const u=((b.z-c.z)*(p.x-c.x)+(c.x-b.x)*(p.z-c.z))/d,v=((c.z-a.z)*(p.x-c.x)+(a.x-c.x)*(p.z-c.z))/d,w=1-u-v;if(Math.min(u,v,w)>=-1e-7){const ab=[b.x-a.x,b.y-a.y,b.z-a.z],ac=[c.x-a.x,c.y-a.y,c.z-a.z],nx=ab[1]*ac[2]-ab[2]*ac[1],ny=ab[2]*ac[0]-ab[0]*ac[2],nz=ab[0]*ac[1]-ab[1]*ac[0];return {y:u*a.y+v*b.y+w*c.y,slope:Math.hypot(nx,nz)/Math.abs(ny)};}}throw Error('ROOT_OUTSIDE_TERRAIN');}
function terrainY(p,source=triangles){return terrainSample(p,source).y;}
const basinBounds={minX:-18,maxX:34,minZ:-204,maxZ:-131},gridKey=(x,z)=>`${x}:${z}`,wetGrid=new Set(),basinCells=new Set(),bankDistance=new Map();
for(let z=basinBounds.minZ;z<=basinBounds.maxZ;z++)for(let x=basinBounds.minX;x<=basinBounds.maxX;x++)if(terrainY({x,z},waterTriangles)>terrainY({x,z}))wetGrid.add(gridKey(x,z));
const queue=[[-6,-164]];assert(wetGrid.has(gridKey(...queue[0])));basinCells.add(gridKey(...queue[0]));for(let i=0;i<queue.length;i++){const [x,z]=queue[i];for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){const nx=x+dx,nz=z+dz,k=gridKey(nx,nz);if(wetGrid.has(k)&&!basinCells.has(k)){basinCells.add(k);queue.push([nx,nz]);}}}
const bankQueue=queue.map(p=>[...p,0]);for(const [x,z] of queue)bankDistance.set(gridKey(x,z),0);for(let i=0;i<bankQueue.length;i++){const [x,z,d]=bankQueue[i];if(d===4)continue;for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){const nx=x+dx,nz=z+dz,k=gridKey(nx,nz);if(!bankDistance.has(k)){bankDistance.set(k,d+1);bankQueue.push([nx,nz,d+1]);}}}
assert.equal(basinCells.size,1638,'surveyed basin topology changed');
const rendererSource=readFileSync(new URL('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
const expectedSoilBlocks=['import','uniform','shade','counters','allocation','location','sampler','upload','binding','receipt'];
const soilBlocks=new Map();
const reverseRenderer=rendererSource.replace(/\n\/\/ SHORELINE_SOIL_BEGIN ([a-z]+)\n([\s\S]*?)\n\/\/ SHORELINE_SOIL_END \1/g,(whole,name,body)=>{
 assert(!soilBlocks.has(name),'duplicate soil delta block');soilBlocks.set(name,body);return '';
}).replace('counters.staticUniformUpdateCount = 11;','counters.staticUniformUpdateCount = 10;').replace('textures: 4, framebuffers: 2','textures: 3, framebuffers: 2');
assert.deepEqual([...soilBlocks.keys()],expectedSoilBlocks,'undeclared renderer delta blocks');
assert.equal(createHash('sha256').update(reverseRenderer).digest('hex'),'155c08a047703ec8b2d03216acfda8d2af29cb8bc9ab172e9b5c6c2a65308a9e','renderer bytes changed beyond declared additive soil blocks and resource counts');
const shadeAt=rendererSource.indexOf('// SHORELINE_SOIL_BEGIN shade'),terrainAt=rendererSource.indexOf('if(vRoleCode==1u){'),waterAt=rendererSource.indexOf('}else if(vRoleCode==4u){');
assert(shadeAt>terrainAt&&shadeAt<waterAt,'soil shading escaped terrain role');
assert.equal((rendererSource.match(/texture\(uShorelineSoilCoverage/g)||[]).length,1,'soil texture sampled outside its terrain block');
assert(soilBlocks.get('allocation').includes('gl.R8,104,146'),'bounded single-channel soil allocation missing');
assert(soilBlocks.get('upload').includes('!resources.shorelineSoilCoverage.ready'),'soil upload is not one-time');
assert(!/new |create|texSubImage|buildHEarth/.test(soilBlocks.get('binding')),'per-frame soil allocation or upload');
const rendererEvidence={baselineHead:shorelineBaseline.exactHead,baselineRendererSha256:'155c08a047703ec8b2d03216acfda8d2af29cb8bc9ab172e9b5c6c2a65308a9e',reconstructedBaselineSha256:createHash('sha256').update(reverseRenderer).digest('hex'),additiveSoilBlocks:expectedSoilBlocks,allOtherRendererBytesPreserved:true,terrainOnly:true,oneTimeMaskUpload:true,perFrameResourceCreationAdded:false};
const subtract=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z}),dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z,length=v=>Math.hypot(v.x,v.y,v.z);
const mean=vs=>({x:vs.reduce((n,v)=>n+v.x,0)/vs.length,y:vs.reduce((n,v)=>n+v.y,0)/vs.length,z:vs.reduce((n,v)=>n+v.z,0)/vs.length});
function verifyCattailHeadShape(p){
 const v=p.geometry.vertices,lower=v[60],upper=v[61],delta=subtract(upper,lower),headLength=length(delta),axis={x:delta.x/headLength,y:delta.y/headLength,z:delta.z/headLength};
 assert.equal(v.length,62);const rings=[];
 for(let r=0;r<6;r++){const vertices=v.slice(r*10,r*10+10),center=mean(vertices),axial=dot(subtract(center,lower),axis)/headLength;const radii=vertices.map(v=>{const d=subtract(v,center),along=dot(d,axis);return Math.sqrt(Math.max(0,dot(d,d)-along*along));});assert(Math.max(...radii)-Math.min(...radii)<.00004,'seedhead radial discontinuity');rings.push({axial,radius:radii.reduce((a,b)=>a+b,0)/10});}
 const radius=(rings[2].radius+rings[3].radius)/2,aspect=headLength/(2*radius);
 assert(aspect>=5.8&&aspect<=7.2,'seedhead not a long narrow cylinder');
 assert(Math.abs(rings[2].radius-rings[3].radius)/radius<.01,'cylinder sides taper through the body');
 assert(rings[3].axial-rings[2].axial>=.60,'cylindrical middle too short');
 assert(rings[0].radius<radius*.65&&rings[5].radius<radius*.65,'softly rounded ends absent');
 for(let i=1;i<rings.length;i++)assert(rings[i].axial>rings[i-1].axial,'seedhead axial fold');
 headShapeEvidence.push({id:p.primitiveId,length:headLength,diameter:2*radius,aspect,axis,upper});
}
function verifyCattailLeaves(p){
 const v=p.geometry.vertices;assert.equal(v.length,162);let minWidthRatio=Infinity,droopingLeaves=0;
 for(let leaf=0;leaf<6;leaf++){const start=48+leaf*19,rootWidth=length(subtract(v[start+2],v[start])),widths=[];for(let row=1;row<6;row++)widths.push(length(subtract(v[start+row*3+2],v[start+row*3])));const ratio=Math.max(...widths)/rootWidth;assert(ratio>=1.60,'cattail leaf upper ribbon too narrow');minWidthRatio=Math.min(minWidthRatio,ratio);const high=Math.max(...v.slice(start+3,start+18).map(p=>p.y));if(v[start+18].y<high-.005)droopingLeaves++;}
 leafShapeEvidence.push({id:p.primitiveId,minWidthRatio,droopingLeaves,spikeTip:mean(v.slice(40,48))});
}
const grassAnchorCells2m=new Set(),grassRootCells1m=new Set(),naturalColorSignatures=new Set();const wholeBladePaletteCounts={brown:0,yellowGreen:0,green:0,other:0};let coloredVertices=0,gradientGrassBlades=0,shortBlades=0,tallBlades=0;
const baselineCoverage={exactHead:'e07981a377e08b32bfc8ee13314ea3a1c3d197ee',grassTufts:96,anchorCells2m:16,rootCells1m:48};
let oasisPrimitives=0,oasisGrass=0,oasisCattails=0,oasisHeads=0,oasisTriangles=0,oasisRoots=0,wetMin=Infinity,wetMax=-Infinity,dryMin=Infinity,dryMax=-Infinity;
function verifyOasis(p){
 shorelinePrimitives.push(p);

 const g=p.geometry,m=p.metadata.oasisFoliage,head=m.kind==='ROUNDED_CATTAIL_SEEDHEAD',wet=m.kind==='CATTAIL_STEM_AND_LEAVES';assert(m);const colors=m.vertexColorsSrgb;assert(Array.isArray(colors)&&colors.length===g.vertices.length,'color vertex count');assert.equal(m.colorEncoding,'SRGB_NORMALIZED_RGB');const localColors=new Set();for(const c of colors){assert(Array.isArray(c)&&c.length===3&&c.every(v=>Number.isFinite(v)&&v>=0&&v<=1),'normalized color');localColors.add(c.map(v=>v.toFixed(5)).join(':'));coloredVertices++;}assert(localColors.size>=6,'natural color variation missing');naturalColorSignatures.add(colors[0].map(v=>v.toFixed(5)).join(':'));
 if(!head&&!wet){const a=p.metadata.worldAnchor;grassAnchorCells2m.add(`${Math.floor((a.x+14)/2)}:${Math.floor((a.z+174)/2)}`);for(let i=0;i<g.vertices.length;i+=16){const [red,green,blue]=colors[i];const category=red>green&&green>blue?'brown':red/green>=.85&&green>blue?'yellowGreen':green>red?'green':'other';wholeBladePaletteCounts[category]++;const bottom=colors[i].reduce((a,b)=>a+b,0),tip=colors[i+15].reduce((a,b)=>a+b,0);assert(tip>bottom,'grass root-tip gradient absent');gradientGrassBlades++;const height=g.vertices[i+15].y-g.vertices[i+1].y;if(height<.25)shortBlades++;else tallBlades++;}for(const r of m.rootPoints)grassRootCells1m.add(`${Math.floor(r.x+14)}:${Math.floor(r.z+174)}`);}
 if(head){verifyCattailHeadShape(p);for(const c of colors)assert(c[0]>c[1]&&c[1]>c[2],'seedhead brown palette');}else if(wet)verifyCattailLeaves(p);oasisPrimitives++;if(head)oasisHeads++;else if(wet)oasisCattails++;else oasisGrass++;
 for(const v of g.vertices){assert([v.x,v.y,v.z].every(Number.isFinite));assert(v.x>=-18&&v.x<=34&&v.z>=-204&&v.z<=-131,'oasis vertex outside');}
 const edges=new Map();let volume=0;
 for(let i=0;i<g.indices.length;i+=3){const ids=g.indices.slice(i,i+3),[a,b,c]=ids.map(n=>{assert(Number.isInteger(n)&&n>=0&&n<g.vertices.length);return g.vertices[n];});const u=[b.x-a.x,b.y-a.y,b.z-a.z],v=[c.x-a.x,c.y-a.y,c.z-a.z];assert(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-10,'oasis degenerate');oasisTriangles++;volume+=a.x*(b.y*c.z-b.z*c.y)+a.y*(b.z*c.x-b.x*c.z)+a.z*(b.x*c.y-b.y*c.x);for(let e=0;e<3;e++){let a=ids[e],b=ids[(e+1)%3],key=[Math.min(a,b),Math.max(a,b)].join(':');let item=edges.get(key)??{count:0,orientation:0};item.count++;item.orientation+=a<b?1:-1;edges.set(key,item);}}
 if(head){assert(volume>0,'head outward volume');for(const e of edges.values()){assert.equal(e.count,2,'head not closed');assert.equal(e.orientation,0,'head winding');}assert.equal(m.rootPoints.length,0);return;}
 assert(m.rootPoints.length>0);
 for(const p of m.rootPoints){const v=g.vertices[p.vertexIndex];assert(v);const surface=terrainSample(v),y=surface.y,wy=terrainY(v,waterTriangles),clearance=y-wy;assert(surface.slope<=.450001,'actual triangle too steep');const gridDistance=bankDistance.get(gridKey(Math.round(v.x),Math.round(v.z)));assert(gridDistance!==undefined&&gridDistance<=4,'root outside selected basin bank');assert(Math.abs(v.y-y)<=.00002,'oasis root contact');const soil=sampleHEarthRun8CSuccessorSurfaceMaterial(v.x,v.z),estate=sampleHEarthGen311PlacementStructureDisposition(v.x,v.z);assert(soil.valid&&['LOWLAND_SOIL','COASTAL_SOIL'].includes(soil.surfaceClass)&&Number.isFinite(soil.slope)&&soil.slope<=.45&&Number.isFinite(soil.soilDepth)&&soil.soilDepth>=.2);assert.equal(estate.status,'NO_KNOWN_ESTATE_FOOTPRINT_OVERLAP');assert.equal(estate.hardExclusions.length,0);assert.equal(estate.planningHolds.length,0);if(wet){assert(basinCells.has(gridKey(Math.round(v.x),Math.round(v.z))),'wet root not in selected component');assert(clearance>=-.45002&&clearance<=.00002);wetMin=Math.min(wetMin,clearance);wetMax=Math.max(wetMax,clearance);}else{assert(clearance>=.03498&&clearance<=1.10002);dryMin=Math.min(dryMin,clearance);dryMax=Math.max(dryMax,clearance);}oasisRoots++;}
}
const truth=getHEarthRun8ER2VegetationWorldTruthPlan();assert.equal(truth.batches.length,108);
let count=0,unchanged=0,changed=0,roots=0,maxRootError=0,triangleCount=0,suppressed=0,rendered=0,emptyBatches=0;const suppressedByArchetype={},unchangedByArchetype={};const changedPlacements=new Set(),allIds=new Set();
for(const descriptor of truth.batches){
 const original=constructHEarthGen2515VegetationPresentationBatch(descriptor.batchId),candidate=createHEarthRun8ER2VegetationPresentationBatch(descriptor.batchId),repeat=createHEarthRun8ER2VegetationPresentationBatch(descriptor.batchId);
 assert.equal(candidate.eligible,true);assert.equal(candidate.instanceCount,original.instanceCount);assert.deepEqual(candidate.placementIds,original.placementIds);assert.equal(digest(candidate),digest(repeat),'repeat differs');count+=candidate.instanceCount;
 for(const id of candidate.placementIds){assert(!allIds.has(id));allIds.add(id);}
 const byId=new Map(candidate.primitives.map(p=>[p.primitiveId,p]));assert.equal(byId.size,candidate.primitives.length);rendered+=candidate.primitives.length;if(!candidate.primitives.length)emptyBatches++;let batchSuppressed=0;
 for(const p of candidate.primitives){if(p.metadata?.oasisFoliage){assert.equal(candidate.batchId,'GEN2514_BATCH:H_EARTH_GEN311_PLACEMENT:0001527b');verifyOasis(p);continue;}assert(original.primitives.some(before=>before.primitiveId===p.primitiveId),'new primitive identity');assert(p.materialHint.archetypeId!=='COASTAL_GRASS_TUFT'||p.metadata.lowlandGrassTrial,'legacy grass rendered');}
 for(let i=0;i<original.primitives.length;i++){
  const before=original.primitives[i],after=byId.get(before.primitiveId),archetype=before.materialHint.archetypeId;
  if(!after){assert.equal(archetype,'COASTAL_GRASS_TUFT','nongrass suppressed');const a=before.metadata.worldAnchor;assert(!(a.x>=-32&&a.x<=-16&&a.z>=-158&&a.z<=-142),'accepted patch suppressed');suppressed++;batchSuppressed++;suppressedByArchetype[archetype]=(suppressedByArchetype[archetype]??0)+1;continue;}
  assert.equal(before.primitiveId,after.primitiveId);
  if(archetype!=='COASTAL_GRASS_TUFT'){assert.equal(digest(before),digest(after),'nongrass changed');unchanged++;unchangedByArchetype[archetype]=(unchangedByArchetype[archetype]??0)+1;continue;}
  changed++;const anchor=before.metadata.worldAnchor;selectedAnchors.push({placementId:before.metadata.gen2514PlacementId,...anchor});assert(anchor.x>=-32&&anchor.x<=-16&&anchor.z>=-158&&anchor.z<=-142);assert.equal(before.materialHint.archetypeId,'COASTAL_GRASS_TUFT');changedPlacements.add(before.metadata.gen2514PlacementId);assert.deepEqual(after.materialHint,before.materialHint);
  for(const [key,value] of Object.entries(before.metadata))assert.deepEqual(after.metadata[key],value,`metadata changed: ${key}`);
  originalGrassPrimitives.push(after);
  const g=after.geometry;assert(g.vertices.length>before.geometry.vertices.length);
  for(const v of g.vertices){assert([v.x,v.y,v.z].every(Number.isFinite));assert(v.x>=-32&&v.x<=-16&&v.z>=-158&&v.z<=-142);}
  for(const n of g.normals??[])assert([n.x,n.y,n.z].every(Number.isFinite));
  for(let j=0;j<g.indices.length;j+=3){const [a,b,c]=g.indices.slice(j,j+3).map(n=>{assert(Number.isInteger(n)&&n>=0&&n<g.vertices.length);return g.vertices[n];});const u=[b.x-a.x,b.y-a.y,b.z-a.z],v=[c.x-a.x,c.y-a.y,c.z-a.z];assert(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-10,'degenerate triangle');triangleCount++;}
  const points=after.metadata.lowlandGrassTrial.rootPoints;assert(points.length>=96);
  for(const p of points){const vertex=g.vertices[p.vertexIndex];assert(vertex);const soil=sampleHEarthRun8CSuccessorSurfaceMaterial(vertex.x,vertex.z);assert.equal(soil.valid,true);assert(['LOWLAND_SOIL','COASTAL_SOIL'].includes(soil.surfaceClass));assert(Number.isFinite(soil.slope)&&soil.slope<=.45);const estate=sampleHEarthGen311PlacementStructureDisposition(vertex.x,vertex.z);assert.equal(estate.status,'NO_KNOWN_ESTATE_FOOTPRINT_OVERLAP');assert.equal(estate.hardExclusions.length,0);assert.equal(estate.planningHolds.length,0);const err=Math.abs(vertex.y-terrainY(vertex));assert(err<=0.00002,`root error ${err}`);maxRootError=Math.max(maxRootError,err);roots++;}
 }
 if(candidate.lowlandGrassTrial){assert.equal(candidate.lowlandGrassTrial.suppressedLegacyGrassCount,batchSuppressed);assert.equal(candidate.lowlandGrassTrial.renderedPrimitiveCount,candidate.primitives.length);assert.equal(candidate.lowlandGrassTrial.completeWorldPlacementPresentationClaimed,false);}
}
assert(suppressed>0);assert.equal(rendered,unchanged+changed+oasisPrimitives);assert(oasisGrass>96&&oasisGrass<=360);assert(grassAnchorCells2m.size>baselineCoverage.anchorCells2m);assert(grassRootCells1m.size>baselineCoverage.rootCells1m);assert(shortBlades>0&&tallBlades>0);assert(naturalColorSignatures.size>20);assert(oasisCattails>18&&oasisCattails<=72);assert.equal(oasisHeads,oasisCattails);assert(oasisTriangles<=350000);
assert.equal(count,27585);assert.equal(allIds.size,27585);assert.equal(changedPlacements.size,4);assert.equal(changed,4);

assert.equal(oasisGrass,350);assert.equal(oasisCattails,72);
const oasisGrassPrimitives=shorelinePrimitives.filter(p=>p.materialHint.archetypeId==='OASIS_ACCEPTED_BLADE_GRASS'),cattailPrimitives=shorelinePrimitives.filter(p=>p.materialHint.archetypeId==='OASIS_CATTAIL');
assert.equal(digest(oasisGrassPrimitives),shorelineBaseline.grassSha256,'accepted whole shoreline grass changed');
assert.equal(digest(originalGrassPrimitives),shorelineBaseline.originalGrassSha256,'original four accepted grass tufts changed');
assert.equal(digest(shorelinePrimitives.map(p=>p.primitiveId)),shorelineBaseline.oasisIdsSha256,'oasis identities/order changed');
const retainedRoots=shorelinePrimitives.map(p=>({id:p.primitiveId,roots:p.metadata.oasisFoliage.rootPoints,vertices:p.metadata.oasisFoliage.rootPoints.map(r=>p.geometry.vertices[r.vertexIndex])}));
assert.equal(digest(retainedRoots),shorelineBaseline.rootsSha256,'original root record or vertex changed');
const topology=shorelinePrimitives.map(p=>({id:p.primitiveId,geometryId:p.geometry.geometryId,vertexCount:p.geometry.vertices.length,indices:p.geometry.indices}));
assert.equal(digest(topology),shorelineBaseline.topologySha256,'plant topology or vertex count changed');
assert.equal(oasisTriangles,shorelineBaseline.oasisTriangles,'oasis triangle count changed');
assert.equal(shorelinePrimitives.reduce((n,p)=>n+p.geometry.vertices.length,0),shorelineBaseline.oasisVertexCount);
assert.equal(cattailPrimitives.length,144);for(let i=0;i<cattailPrimitives.length;i++)assert.notEqual(digest(cattailPrimitives[i].geometry),shorelineBaseline.cattailGeometrySha256[i],'cattail upper geometry was not refined');
assert.equal(headShapeEvidence.length,72);assert.equal(leafShapeEvidence.length,72);
let spikeExtensionMin=Infinity;
for(let i=0;i<72;i++){const head=headShapeEvidence[i],leaf=leafShapeEvidence[i];assert.equal(head.id.replace(':SEEDHEAD',''),leaf.id.replace(':STEM_LEAVES',''));const extension=dot(subtract(leaf.spikeTip,head.upper),head.axis);assert(extension>.03,'thin stem does not extend beyond seedhead');spikeExtensionMin=Math.min(spikeExtensionMin,extension);}
assert(leafShapeEvidence.reduce((n,p)=>n+p.droopingLeaves,0)>0,'curved dry leaf tips absent');
const shorelineEvidence={baselineHead:shorelineBaseline.exactHead,grassTuftCount:350,originalGrassTuftCount:4,cattailCount:72,allCattailsRefined:true,grassPrimitivesSha256:digest(oasisGrassPrimitives),originalGrassPrimitivesSha256:digest(originalGrassPrimitives),retainedRootsSha256:digest(retainedRoots),topologySha256:digest(topology),allOriginalRootsExact:true,allGrassByteIdentical:true,topologyAndTriangleCountUnchanged:true,incrementalPreparationWrapperByteIdentical:true,headAspectRange:[Math.min(...headShapeEvidence.map(p=>p.aspect)),Math.max(...headShapeEvidence.map(p=>p.aspect))],minimumLeafWidthRatio:Math.min(...leafShapeEvidence.map(p=>p.minWidthRatio)),droopingLeafCount:leafShapeEvidence.reduce((n,p)=>n+p.droopingLeaves,0),minimumSpikeExtensionMeters:spikeExtensionMin};
const allPresented=[...shorelinePrimitives,...originalGrassPrimitives],mask=buildHEarthOasisGrassSoilCoverage(allPresented),maskAgain=buildHEarthOasisGrassSoilCoverage(oasisGrassPrimitives);
assert.equal(mask.width,104);assert.equal(mask.height,146);assert.equal(mask.cellSizeMeters,.5);assert.deepEqual(mask.bounds,basinBounds);assert(mask.pixels instanceof Uint8Array);assert.equal(mask.pixels.byteLength,15184);assert.equal(mask.grassTuftCount,350);assert.equal(mask.grassRootCount,50400);assert.deepEqual(mask.pixels,maskAgain.pixels,'soil mask not deterministic or depends on non-grass plants');
const irrelevantMask=buildHEarthOasisGrassSoilCoverage([...cattailPrimitives,...originalGrassPrimitives]),emptyMask=buildHEarthOasisGrassSoilCoverage([]);assert(irrelevantMask.pixels.every(p=>p===0)&&emptyMask.pixels.every(p=>p===0),'cattails or original four grass affect oasis soil');
const occupiedCells=new Set();let supportedInteriorRoots=0;
for(const p of oasisGrassPrimitives)for(const r of p.metadata.oasisFoliage.rootPoints){const x=Math.floor((r.x-basinBounds.minX)/.5),z=Math.floor((r.z-basinBounds.minZ)/.5);assert(x>=0&&x<mask.width&&z>=0&&z<mask.height);occupiedCells.add(z*mask.width+x);if(Math.min(r.x-basinBounds.minX,basinBounds.maxX-r.x,r.z-basinBounds.minZ,basinBounds.maxZ-r.z)>1.5){assert(mask.pixels[z*mask.width+x]>0,'grass root lacks soil coverage');supportedInteriorRoots++;}}
assert(supportedInteriorRoots>0);assert.equal(mask.occupiedCellCount,occupiedCells.size);
for(let x=0;x<mask.width;x++)assert(mask.pixels[x]===0&&mask.pixels[(mask.height-1)*mask.width+x]===0,'soil mask horizontal boundary seam');
for(let z=0;z<mask.height;z++)assert(mask.pixels[z*mask.width]===0&&mask.pixels[z*mask.width+mask.width-1]===0,'soil mask vertical boundary seam');
const nonzeroTexels=mask.pixels.reduce((n,p)=>n+(p>0),0),featheredTexels=mask.pixels.reduce((n,p)=>n+(p>0&&p<255),0);assert.equal(mask.nonzeroTexelCount,nonzeroTexels);assert(nonzeroTexels>occupiedCells.size&&nonzeroTexels<mask.pixels.length*.8,'soil lacks bounded spread or bare ground');assert(featheredTexels>0,'soil edges not feathered');
const soilEvidence={width:mask.width,height:mask.height,cellSizeMeters:mask.cellSizeMeters,byteLength:mask.pixels.byteLength,maskSha256:createHash('sha256').update(mask.pixels).digest('hex'),grassTuftCount:mask.grassTuftCount,grassRootCount:mask.grassRootCount,occupiedCellCount:occupiedCells.size,nonzeroTexels,featheredTexels,supportedInteriorRoots,deterministic:true,nonGrassExcluded:true,boundaryZero:true,terrainGeometryMutated:false};

const packageAfter=digest(pkg);assert.equal(packageAfter,packageBefore);
console.log(JSON.stringify({status:'PASS',shorelineEvidence,soilEvidence,basinEvidence:{seed:{x:-6,z:-164},wetCells:basinCells.size,gridSpacingMeters:1,bankAssociation:'ROUNDED_GRID_CARDINAL_DISTANCE_AT_MOST_4',bounds:basinBounds},rendererEvidence,acceptedFunctionSha256,densityCoverage:{baseline:baselineCoverage,grassTufts:oasisGrass,anchorCells2m:grassAnchorCells2m.size,rootCells1m:grassRootCells1m.size,occupiedRootCells:[...grassRootCells1m].sort()},colorEvidence:{wholeBladePaletteCounts,paletteClassification:'Grass root RGB: brown R>G>B; otherwise yellow-green R/G>=0.85 and G>B; otherwise green G>R; remaining other',coloredVertices,distinctPrimitiveRootColors:naturalColorSignatures.size,gradientGrassBlades,shortBlades,tallBlades,normalizedSrgb:true},oasis:{primitiveCount:oasisPrimitives,grassTuftCount:oasisGrass,cattailCount:oasisCattails,closedSeedheadCount:oasisHeads,triangleCount:oasisTriangles,rootCount:oasisRoots,dryClearanceMeters:[dryMin,dryMax],wetClearanceMeters:[wetMin,wetMax],bounds:basinBounds},sourceHashes,packageBefore,packageAfter,stablePackageSha256:digest(stablePackage),immutableBuffersSha256:digest(pkg.buffers),selectedAnchors,instanceCount:count,batchCount:truth.batches.length,changedPrimitives:changed,changedPlacementIds:[...changedPlacements],unchangedNongrassPrimitives:unchanged,unchangedByArchetype,suppressedLegacyGrassPrimitives:suppressed,suppressedByArchetype,renderedPrimitiveCount:rendered,consumedPlacementCount:count,emptyPresentationBatches:emptyBatches,renderedLegacyGrassCount:0,rootCount:roots,maxRootErrorMeters:maxRootError,trialTriangleCount:triangleCount,deterministic:true,contactSurface:'BASE_PACKAGE_FLOAT32_TRIANGLES',refinementActivationVerified:false},null,2));
