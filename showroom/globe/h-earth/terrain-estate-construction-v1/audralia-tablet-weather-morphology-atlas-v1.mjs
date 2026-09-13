const WIDTH=512;
const HEIGHT=256;
const PI=Math.PI;
const TAU=PI*2;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const local=(lat,lon,cLat,cLon)=>[wrap(lon-cLon)*Math.cos(cLat),lat-cLat];
const ellipse=(lat,lon,cLat,cLon,sx,sy,angle=0)=>{const [x,y]=local(lat,lon,cLat,cLon);const ca=Math.cos(angle),sa=Math.sin(angle);const px=(ca*x+sa*y)/sx,py=(-sa*x+ca*y)/sy;const r=Math.hypot(px,py);return 1-smooth(.58,1.04,r);};
const disk=(lat,lon,cLat,cLon,radius)=>1-smooth(radius*.62,radius,Math.hypot(...local(lat,lon,cLat,cLon)));
const wave=(lat,lon)=>clamp(.50+.22*Math.sin(lon*17+lat*11)+.17*Math.sin(lon*31-lat*19)+.11*Math.sin(lon*7+lat*37));

const systems=Object.freeze({
  marine:[
    [.384,2.304,.52,.30,-.08],[ -.297,-.960,.48,.27,.12],[.105,-2.740,.46,.25,-.16],[.610,.620,.42,.24,.10],[-.520,2.020,.44,.26,-.11]
  ],
  alto:[
    [.314,-1.571,.62,.36,.08],[-.087,.349,.65,.38,-.12],[.733,1.745,.60,.34,.18],[-.524,-2.967,.63,.37,-.06],[.052,2.182,.58,.33,.14],[.460,-.410,.54,.30,-.18]
  ],
  cirrus:[
    [-.820,-2.496,.70,.12,.24],[.995,.454,.66,.11,-.18],[.559,1.990,.62,.10,.31],[-.436,.524,.64,.11,-.27],[.175,-.698,.60,.10,.16],[.890,-1.420,.58,.09,.22]
  ],
  convection:[
    [.140,-2.723,.24,.19,-.10],[-.087,1.990,.22,.18,.16],[.280,.780,.19,.16,-.12],[-.340,-.180,.20,.17,.08]
  ]
});

function sample(lat,lon){
  const texture=wave(lat,lon);
  const tropicN=1-smooth(.16,.38,Math.abs(lat-.18));
  const tropicS=1-smooth(.16,.38,Math.abs(lat+.24));
  const subpolar=smooth(.70,1.18,Math.abs(lat));
  const stormN=1-smooth(.18,.36,Math.abs(lat-.78));
  const stormS=1-smooth(.18,.36,Math.abs(lat+.72));
  let low=(tropicN+tropicS)*(.20+.48*texture)+subpolar*(.16+.34*texture);
  let mid=(stormN+stormS)*(.18+.40*texture)+subpolar*(.10+.24*texture);
  let high=(stormN+stormS)*(.15+.44*texture)+subpolar*(.14+.36*texture);
  let conv=0;
  for(const s of systems.marine)low+=ellipse(lat,lon,...s)*(.18+.44*texture);
  for(const s of systems.alto)mid+=ellipse(lat,lon,...s)*(.16+.36*texture);
  for(const s of systems.cirrus)high+=ellipse(lat,lon,...s)*(.13+.35*texture);
  for(const s of systems.convection)conv+=ellipse(lat,lon,...s)*(.26+.55*texture);
  const commaA=Math.max(ellipse(lat,lon,.785,3.072,.27,.19,-.28),ellipse(lat,lon,.785,-2.90,.42,.065,.16));
  const commaB=Math.max(ellipse(lat,lon,-.698,.175,.25,.18,.25),ellipse(lat,lon,-.698,.46,.40,.060,-.12));
  mid+=(commaA+commaB)*(.22+.42*texture);high+=(commaA+commaB)*(.12+.26*texture);
  const tradeRows=.35+.65*(.5+.5*Math.sin(lon*34+lat*18));
  low+=(tropicN+tropicS)*tradeRows*(.08+.22*texture);
  const clear=Math.max(disk(lat,lon,.454,-.314,.30),disk(lat,lon,-.10,-1.88,.20),disk(lat,lon,.18,1.78,.18),disk(lat,lon,-.62,.92,.15));
  const keep=1-.84*clear;
  return [clamp(low*.54*keep),clamp(mid*.52*keep),clamp(high*.55*keep),clamp(conv*.62*keep)];
}

function buildBytes(){
  const data=new Uint8Array(WIDTH*HEIGHT*4);
  for(let y=0;y<HEIGHT;y++){
    const lat=(y/(HEIGHT-1)-.5)*PI;
    for(let x=0;x<WIDTH;x++){
      const lon=(x/WIDTH-.5)*TAU;
      const c=sample(lat,lon),i=(y*WIDTH+x)*4;
      data[i]=Math.round(c[0]*255);data[i+1]=Math.round(c[1]*255);data[i+2]=Math.round(c[2]*255);data[i+3]=Math.round(c[3]*255);
    }
  }
  return data;
}

export function createAudraliaTabletMorphologyAtlas(gl){
  if(!gl||typeof gl.createTexture!=='function')throw new Error('AUDRALIA_TABLET_MORPHOLOGY_ATLAS_GL_MISSING');
  const startedAt=performance.now();
  const data=buildBytes();
  const texture=gl.createTexture();
  if(!texture)throw new Error('AUDRALIA_TABLET_MORPHOLOGY_ATLAS_TEXTURE_CREATE_FAILED');
  const unit=3;
  gl.activeTexture(gl.TEXTURE0+unit);
  gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,WIDTH,HEIGHT,0,gl.RGBA,gl.UNSIGNED_BYTE,data);
  gl.bindTexture(gl.TEXTURE_2D,null);
  if(!Object.prototype.hasOwnProperty.call(window,'__AUDRALIA_PRIMARY_GL__')){
    Object.defineProperty(window,'__AUDRALIA_PRIMARY_GL__',{value:gl,writable:false,configurable:false});
  }
  const evidence=Object.freeze({
    schema:'AUDRALIA_TABLET_WEATHER_MORPHOLOGY_ATLAS_v1',
    width:WIDTH,height:HEIGHT,bytes:data.byteLength,textureUnit:unit,
    generationMilliseconds:performance.now()-startedAt,
    primaryContextOnly:true,newCanvasCreated:false,newWebGLContextRequested:false,
    families:Object.freeze(['BROKEN_LOW_BELTS','MARINE_STRATUS_STRATOCUMULUS','TRADE_CUMULUS_STREETS','MIDLATITUDE_STORM_TRACKS','ALTOCUMULUS_FIELDS','CIRRUS_JET_PLUMES','COMMA_FRONTS','CONVECTIVE_COMPLEXES','POLAR_LOW_MID_HIGH']),
    clearAirWindowsPreserved:true
  });
  Object.defineProperty(window,'__AUDRALIA_TABLET_MORPHOLOGY_ATLAS__',{value:evidence,writable:false,configurable:false});
  return Object.freeze({texture,unit,evidence});
}

export default createAudraliaTabletMorphologyAtlas;
