// Projection-preserving true-3D lift of the frozen Compass Mirrorland authority.
// Source authority: /assets/compass/compass.mirrorland-window.js
// Frozen blob: f99d3ffedf7b7654d067d21d9363eb287877f852
// The donor remains read-only. This module preserves its 480x720 front projection,
// pane topology, pane semantics, frame chains, centerline, and curved silhouettes.

export const MIRRORLAND_3D_AUTHORITY = Object.freeze({
  id: 'DGB_MIRRORLAND_PROJECTION_PRESERVING_3D_GEOMETRY_V1',
  sourcePath: '/assets/compass/compass.mirrorland-window.js',
  sourceBlob: 'f99d3ffedf7b7654d067d21d9363eb287877f852',
  sourceContract: 'DGB_COMPASS_MIRRORLAND_WINDOW_HARDENED_v2',
  designWidth: 480,
  designHeight: 720,
  paneCount: 21,
  projectionRule: 'AUTHORITATIVE_2D_MIRRORLAND_TO_PROJECTION_PRESERVING_3D_LIFT',
  compassStarsIncluded: false
});

const COLORS = Object.freeze({
  cyan: [87,210,231], blue: [67,112,204], violet: [133,83,201],
  amber: [226,164,79], rose: [198,85,132],
  paleCyan: [161,235,244], paleBlue: [143,181,234],
  paleViolet: [184,149,232], paleAmber: [239,202,132], paleRose: [229,151,185]
});

function pane(id,color,points,alpha,glow,depth,phase,grain=.12,highlight=.16){
  return Object.freeze({id,color:Object.freeze(color),points:Object.freeze(points.map(p=>Object.freeze(p))),alpha,glow,depth,phase,grain,highlight});
}

export const MIRRORLAND_PANES = Object.freeze([
  pane('crown-left',COLORS.paleCyan,[[240,46],[164,106],[204,168],[240,134]],.74,.45,.86,.20),
  pane('crown-right',COLORS.paleViolet,[[240,46],[240,134],[278,168],[318,106]],.72,.42,.82,.62),
  pane('upper-left-edge',COLORS.blue,[[164,106],[98,210],[154,246],[204,168]],.72,.28,.62,.92),
  pane('upper-right-edge',COLORS.violet,[[318,106],[278,168],[326,246],[382,210]],.74,.30,.66,1.22),
  pane('upper-center-left',COLORS.cyan,[[204,168],[154,246],[216,268],[240,208],[240,134]],.66,.38,.78,1.50),
  pane('upper-center-right',COLORS.rose,[[240,134],[240,208],[264,268],[326,246],[278,168]],.68,.36,.76,1.84),
  pane('mid-left-high',COLORS.paleBlue,[[98,210],[66,332],[148,338],[154,246]],.68,.25,.56,2.20),
  pane('mid-left-inner',COLORS.violet,[[154,246],[148,338],[212,334],[216,268]],.74,.30,.72,2.52),
  pane('mid-center',COLORS.paleAmber,[[216,268],[212,334],[240,382],[268,334],[264,268],[240,208]],.70,.48,.90,2.92),
  pane('mid-right-inner',COLORS.cyan,[[264,268],[268,334],[332,338],[326,246]],.72,.31,.73,3.20),
  pane('mid-right-high',COLORS.blue,[[326,246],[332,338],[414,332],[382,210]],.68,.26,.57,3.58),
  pane('lower-left-edge',COLORS.rose,[[66,332],[82,470],[156,446],[148,338]],.72,.25,.58,3.90),
  pane('lower-left-center',COLORS.cyan,[[148,338],[156,446],[216,430],[240,382],[212,334]],.70,.34,.75,4.20),
  pane('lower-right-center',COLORS.violet,[[268,334],[240,382],[264,430],[324,446],[332,338]],.72,.34,.75,4.56),
  pane('lower-right-edge',COLORS.amber,[[332,338],[324,446],[398,470],[414,332]],.70,.28,.59,4.92),
  pane('lower-left-deep',COLORS.blue,[[82,470],[116,594],[192,530],[156,446]],.72,.24,.56,5.22),
  pane('lower-center-left',COLORS.paleViolet,[[156,446],[192,530],[240,624],[240,500],[216,430]],.72,.40,.82,5.54),
  pane('lower-center-right',COLORS.paleRose,[[264,430],[240,500],[240,624],[288,530],[324,446]],.72,.40,.82,5.88),
  pane('lower-right-deep',COLORS.cyan,[[324,446],[288,530],[364,594],[398,470]],.70,.25,.57,6.20),
  pane('base-left',COLORS.amber,[[116,594],[168,660],[240,676],[240,624],[192,530]],.68,.35,.72,6.54),
  pane('base-right',COLORS.blue,[[288,530],[240,624],[240,676],[312,660],[364,594]],.70,.34,.72,6.86)
]);

export const MIRRORLAND_FRAME_SEGMENTS = Object.freeze([
  Object.freeze([[240,34],[165,78],[104,144],[66,232],[48,350],[58,482],[96,590],[158,662],[240,694]].map(Object.freeze)),
  Object.freeze([[240,34],[315,78],[376,144],[414,232],[432,350],[422,482],[384,590],[322,662],[240,694]].map(Object.freeze))
]);

const OUTER_CURVES = Object.freeze([
  [[240,24],[154,62],[82,148],[52,258]],
  [[52,258],[22,382],[52,538],[132,640]],
  [[132,640],[166,680],[202,706],[240,714]],
  [[240,714],[278,706],[314,680],[348,640]],
  [[348,640],[428,538],[458,382],[428,258]],
  [[428,258],[398,148],[326,62],[240,24]]
].map(c=>Object.freeze(c.map(Object.freeze))));

const INNER_CURVES = Object.freeze([
  [[240,48],[170,82],[112,158],[84,262]],
  [[84,262],[58,366],[82,510],[148,604]],
  [[148,604],[178,646],[208,670],[240,682]],
  [[240,682],[272,670],[302,646],[332,604]],
  [[332,604],[398,510],[422,366],[396,262]],
  [[396,262],[368,158],[310,82],[240,48]]
].map(c=>Object.freeze(c.map(Object.freeze))));

function normColor(c){ return c.map(v=>v/255); }
function mapPoint(p,z,scale){ return [((p[0]-240)/174)*scale,((360-p[1])/174)*scale,z*scale]; }
function normalize(v,fallback=[0,0,1]){
  const l=Math.hypot(v[0],v[1],v[2])||0;
  return l>1e-12?[v[0]/l,v[1]/l,v[2]/l]:fallback.slice();
}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]}
function cubic(c,t){
  const s=1-t,b0=s*s*s,b1=3*s*s*t,b2=3*s*t*t,b3=t*t*t;
  return [
    c[0][0]*b0+c[1][0]*b1+c[2][0]*b2+c[3][0]*b3,
    c[0][1]*b0+c[1][1]*b1+c[2][1]*b2+c[3][1]*b3
  ];
}
function sampleCurves(curves,steps=10){
  const out=[];
  curves.forEach((c,ci)=>{
    for(let i=0;i<=steps;i++){
      if(ci&&i===0)continue;
      out.push(cubic(c,i/steps));
    }
  });
  return out;
}
function createAccumulator(){
  return {p:[],n:[],c:[],fx:[],fx2:[],style:[]};
}
function pushVertex(g,p,n,c,fx,fx2,style){
  g.p.push(...p);g.n.push(...n);g.c.push(...c);g.fx.push(...fx);g.fx2.push(...fx2);g.style.push(style);
}
function pushTri(g,a,b,c,ca,cb,cc,fx,fx2,style,normal=null){
  const n=normal||normalize(cross(sub(b,a),sub(c,a)));
  pushVertex(g,a,n,ca,fx,fx2,style);pushVertex(g,b,n,cb,fx,fx2,style);pushVertex(g,c,n,cc,fx,fx2,style);
}
function quad(g,a,b,c,d,color,fx,fx2,style){
  const n=normalize(cross(sub(b,a),sub(c,a)));
  pushTri(g,a,b,c,color,color,color,fx,fx2,style,n);
  pushTri(g,a,c,d,color,color,color,fx,fx2,style,n);
}
function extrudePane(g,paneData,scale){
  const color=normColor(paneData.color);
  const zFront=((paneData.depth-.72)*.16+.055);
  const zBack=zFront-.10;
  const front=paneData.points.map(p=>mapPoint(p,zFront,scale));
  const back=paneData.points.map(p=>mapPoint(p,zBack,scale));
  const fx=[paneData.alpha,paneData.glow,paneData.phase,paneData.grain];
  const fx2=[paneData.highlight,paneData.depth];
  for(let i=1;i<front.length-1;i++)pushTri(g,front[0],front[i],front[i+1],color,color,color,fx,fx2,1,[0,0,1]);
  for(let i=1;i<back.length-1;i++)pushTri(g,back[0],back[i+1],back[i],color,color,color,fx,fx2,1,[0,0,-1]);
  for(let i=0;i<front.length;i++){
    const j=(i+1)%front.length;
    quad(g,front[i],back[i],back[j],front[j],color,fx,fx2,1);
  }
}
function rail(g,a2,b2,halfWidth,zFront,zBack,color,style,scale){
  const a=mapPoint(a2,0,scale),b=mapPoint(b2,0,scale);
  const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,ox=-dy/l*halfWidth*scale,oy=dx/l*halfWidth*scale;
  const af=[a[0]+ox,a[1]+oy,zFront*scale],bf=[b[0]+ox,b[1]+oy,zFront*scale],cf=[b[0]-ox,b[1]-oy,zFront*scale],df=[a[0]-ox,a[1]-oy,zFront*scale];
  const ab=[a[0]+ox,a[1]+oy,zBack*scale],bb=[b[0]+ox,b[1]+oy,zBack*scale],cb=[b[0]-ox,b[1]-oy,zBack*scale],db=[a[0]-ox,a[1]-oy,zBack*scale];
  const fx=[1,.06,0,.02],fx2=[.08,.5];
  quad(g,af,bf,cf,df,color,fx,fx2,style);
  quad(g,db,cb,bb,ab,color,fx,fx2,style);
  quad(g,af,ab,bb,bf,color,fx,fx2,style);
  quad(g,df,cf,cb,db,color,fx,fx2,style);
  quad(g,af,df,db,ab,color,fx,fx2,style);
  quad(g,bf,bb,cb,cf,color,fx,fx2,style);
}
function frameBand(g,scale){
  const outer=sampleCurves(OUTER_CURVES,12),inner=sampleCurves(INNER_CURVES,12);
  const count=Math.min(outer.length,inner.length),zf=.095,zb=-.035;
  const frontColor=[.145,.188,.267],backColor=[.02,.03,.055],fx=[1,.08,0,.02],fx2=[.11,.5];
  for(let i=0;i<count-1;i++){
    const o0=mapPoint(outer[i],zf,scale),o1=mapPoint(outer[i+1],zf,scale),i1=mapPoint(inner[i+1],zf,scale),i0=mapPoint(inner[i],zf,scale);
    quad(g,o0,o1,i1,i0,frontColor,fx,fx2,3);
    const ob0=mapPoint(outer[i],zb,scale),ob1=mapPoint(outer[i+1],zb,scale),ib1=mapPoint(inner[i+1],zb,scale),ib0=mapPoint(inner[i],zb,scale);
    quad(g,ib0,ib1,ob1,ob0,backColor,fx,fx2,3);
    quad(g,o0,ob0,ob1,o1,[.06,.08,.12],fx,fx2,3);
    quad(g,i0,i1,ib1,ib0,[.08,.10,.15],fx,fx2,3);
  }
}
function sourceDirection(p,scale){
  const sx=1.16*scale,sy=2.06*scale;
  let x=p[0]/sx,y=p[1]/sy;
  let r2=x*x+y*y;
  if(r2>.96){const k=Math.sqrt(.96/r2);x*=k;y*=k;r2=x*x+y*y;}
  const z=Math.sqrt(Math.max(.04,1-r2));
  return normalize([x,y,z]);
}

export function buildMirrorland3DGeometry(options={}){
  const scale=Number.isFinite(options.sceneScale)?options.sceneScale:.43;
  const g=createAccumulator();
  MIRRORLAND_PANES.forEach(p=>extrudePane(g,p,scale));

  // Accepted pane adjacency becomes the lead network.
  for(const p of MIRRORLAND_PANES){
    for(let i=0;i<p.points.length;i++)rail(g,p.points[i],p.points[(i+1)%p.points.length],2/174,.082,-.018,[.067,.082,.114],2,scale);
  }

  // Accepted two frame chains and centerline become volumetric ribs.
  for(const chain of MIRRORLAND_FRAME_SEGMENTS){
    for(let i=0;i<chain.length-1;i++)rail(g,chain[i],chain[i+1],7/174,.11,-.055,[.04,.055,.085],3,scale);
  }
  rail(g,[240,34],[240,694],7/174,.115,-.06,[.055,.070,.105],3,scale);

  // Exact donor outer/inner Bezier silhouettes form a closed front/back frame ring.
  frameBand(g,scale);

  const directions=[];
  for(let i=0;i<g.p.length;i+=3)directions.push(...sourceDirection([g.p[i],g.p[i+1],g.p[i+2]],scale));
  return Object.freeze({
    positions:new Float32Array(g.p),
    normals:new Float32Array(g.n),
    colors:new Float32Array(g.c),
    effects:new Float32Array(g.fx),
    effects2:new Float32Array(g.fx2),
    styles:new Float32Array(g.style),
    sourceDirections:new Float32Array(directions),
    vertexCount:g.p.length/3,
    paneCount:MIRRORLAND_PANES.length,
    authority:MIRRORLAND_3D_AUTHORITY,
    sceneScale:scale,
    projectionPreserved:true,
    volumetric:true,
    compassStarsIncluded:false
  });
}
