import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { sampleHEarthTerrainField,H_EARTH_TERRAIN_FIELD_CONTRACT_ID } from '../terrain/h-earth.terrain-field.js';

const canvas=document.getElementById('gen2');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight,false);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x91aebb);scene.fog=new THREE.FogExp2(0x91aebb,.00135);
const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.2,2200);camera.position.set(120,72,135);
const controls=new OrbitControls(camera,canvas);controls.target.set(20,16,-155);controls.enableDamping=true;controls.minDistance=24;controls.maxDistance=720;controls.maxPolarAngle=Math.PI*.49;

scene.add(new THREE.HemisphereLight(0xbfd7e5,0x28311f,1.05));
const sun=new THREE.DirectionalLight(0xffe4bc,3.4);sun.position.set(-220,330,120);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-420;sun.shadow.camera.right=420;sun.shadow.camera.top=420;sun.shadow.camera.bottom=-420;sun.shadow.camera.near=20;sun.shadow.camera.far=900;scene.add(sun);

const xmin=-360,xmax=360,zmin=-520,zmax=180,segments=360;
const geo=new THREE.PlaneGeometry(xmax-xmin,zmax-zmin,segments,350);geo.rotateX(-Math.PI/2);
const pos=geo.attributes.position,noise=(x,z)=>Math.sin(x*.071+Math.sin(z*.019)*2.2)*1.25+Math.sin(z*.053-x*.017)*.75+Math.sin((x+z)*.16)*.22;
for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i)-170;const s=sampleHEarthTerrainField(x,z);let y=s.elevation;const high=THREE.MathUtils.smoothstep(y,4,45);const ridge=Math.pow(Math.abs(Math.sin(x*.014+z*.009)),2.4);const incision=Math.pow(Math.abs(Math.sin(x*.031-z*.017)),6);y+=high*(noise(x,z)+ridge*7-incision*5);const shelf=1-THREE.MathUtils.smoothstep(Math.abs(y),1.5,10);y=THREE.MathUtils.lerp(y,THREE.MathUtils.clamp(y,-1.2,2.8),shelf*.72);pos.setXYZ(i,x,y,z)}
geo.computeVertexNormals();
const terrainMat=new THREE.MeshStandardMaterial({color:0x536342,roughness:.92,metalness:0,vertexColors:false});
terrainMat.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float slope=1.0-clamp(normal.y,0.0,1.0);float elev=smoothstep(8.0,70.0,vViewPosition.y*-1.0);
vec3 grass=vec3(.16,.23,.105),soil=vec3(.34,.27,.17),rock=vec3(.34,.34,.32),sand=vec3(.62,.53,.37);
diffuseColor.rgb=mix(grass,soil,smoothstep(.25,.58,slope));diffuseColor.rgb=mix(diffuseColor.rgb,rock,smoothstep(.52,.82,slope));`)}; 
const terrain=new THREE.Mesh(geo,terrainMat);terrain.receiveShadow=true;terrain.castShadow=true;scene.add(terrain);

const waterGeo=new THREE.PlaneGeometry(1100,1100,160,160);waterGeo.rotateX(-Math.PI/2);
const waterMat=new THREE.MeshPhysicalMaterial({color:0x0b6570,roughness:.18,metalness:.05,transmission:.05,transparent:true,opacity:.88,clearcoat:.75,clearcoatRoughness:.12});
const water=new THREE.Mesh(waterGeo,waterMat);water.position.set(0,-.35,-150);water.receiveShadow=true;scene.add(water);

const sandMat=new THREE.MeshStandardMaterial({color:0xb39a69,roughness:1});
const beachGeo=new THREE.PlaneGeometry(620,150,160,40);beachGeo.rotateX(-Math.PI/2);const bp=beachGeo.attributes.position;for(let i=0;i<bp.count;i++){const x=bp.getX(i),z=bp.getZ(i)-72;const shoreNoise=Math.sin(x*.026)*5+Math.sin(x*.071)*2.2;bp.setXYZ(i,x,.18+Math.sin(x*.19+z*.11)*.08,z+shoreNoise)}beachGeo.computeVertexNormals();const beach=new THREE.Mesh(beachGeo,sandMat);beach.receiveShadow=true;scene.add(beach);
const foamMat=new THREE.MeshBasicMaterial({color:0xe7eee8,transparent:true,opacity:.68,depthWrite:false});const foamGeo=new THREE.PlaneGeometry(620,10,160,3);foamGeo.rotateX(-Math.PI/2);const fp=foamGeo.attributes.position;for(let i=0;i<fp.count;i++){const x=fp.getX(i);fp.setXYZ(i,x,.32,fp.getZ(i)-72+Math.sin(x*.026)*5+Math.sin(x*.071)*2.2)}const foam=new THREE.Mesh(foamGeo,foamMat);scene.add(foam);
const rockMat=new THREE.MeshStandardMaterial({color:0x4c4a43,roughness:.96});
function rock(x,y,z,s){const g=new THREE.IcosahedronGeometry(s,2);const a=g.attributes.position;for(let i=0;i<a.count;i++){const px=a.getX(i),py=a.getY(i),pz=a.getZ(i),r=1+.12*Math.sin(px*.8+py*1.3+pz*.7);a.setXYZ(i,px*r,py*r*.82,pz*r*1.08)}g.computeVertexNormals();const m=new THREE.Mesh(g,rockMat);m.position.set(x,y,z);m.rotation.set(.2*Math.sin(x),.5*Math.sin(z),.12);m.castShadow=true;m.receiveShadow=true;scene.add(m)}
[[-190,4,-62,12],[-160,3,-76,8],[-118,3,-58,7],[92,4,-68,10],[142,5,-82,13],[205,4,-70,9],[-270,15,-130,20],[275,13,-115,18]].forEach(r=>rock(...r));

// Integrated rock cavern: arch assembled from irregular geology, with a dark recessed interior.
const caveRockMat=new THREE.MeshStandardMaterial({color:0x3d3b36,roughness:1});
for(let a=-1.35;a<=1.35;a+=.27){const x=-82+Math.cos(a)*24,z=-205,y=11+Math.sin(a)*18;rock(x,y,z,7+2*Math.cos(a));}
const caveDark=new THREE.Mesh(new THREE.CircleGeometry(15,32),new THREE.MeshBasicMaterial({color:0x070909,side:THREE.DoubleSide}));caveDark.position.set(-82,12,-207);scene.add(caveDark);
const trunkMat=new THREE.MeshStandardMaterial({color:0x4a3424,roughness:1}),leafMat=new THREE.MeshStandardMaterial({color:0x254526,roughness:.95});
const trunkGeo=new THREE.CylinderGeometry(.45,.7,7,7),crownGeo=new THREE.ConeGeometry(3.3,10,8);
for(let x=-300;x<=300;x+=14)for(let z=-350;z<=90;z+=18){const s=sampleHEarthTerrainField(x,z);if(s.elevation<4||s.elevation>48||Math.sin(x*.17+z*.11)<-.15)continue;const t=new THREE.Mesh(trunkGeo,trunkMat),c=new THREE.Mesh(crownGeo,leafMat);t.position.set(x,s.elevation+3.5,z);c.position.set(x,s.elevation+10,z);t.castShadow=c.castShadow=true;scene.add(t,c)}

document.getElementById('hud').textContent='H-EARTH GEN 2 · PBR REALISM SUCCESSOR · '+H_EARTH_TERRAIN_FIELD_CONTRACT_ID;
function animate(t){const p=waterGeo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,Math.sin(x*.035+t*.0014)*.18+Math.sin(z*.051-t*.0011)*.12)}p.needsUpdate=true;waterGeo.computeVertexNormals();controls.update();renderer.render(scene,camera);requestAnimationFrame(animate)}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false)});requestAnimationFrame(animate);
