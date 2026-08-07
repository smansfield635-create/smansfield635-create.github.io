export const EPSILON = 1e-6;
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt));
export const wrap = (value, length) => ((value % length) + length) % length;
export const vec3 = (x = 0, y = 0, z = 0) => new Float32Array([x, y, z]);
export const add3 = (a,b) => vec3(a[0]+b[0], a[1]+b[1], a[2]+b[2]);
export const sub3 = (a,b) => vec3(a[0]-b[0], a[1]-b[1], a[2]-b[2]);
export const scale3 = (a,s) => vec3(a[0]*s, a[1]*s, a[2]*s);
export const dot3 = (a,b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const cross3 = (a,b) => vec3(a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]);
export const length3 = a => Math.hypot(a[0],a[1],a[2]);
export const normalize3 = a => { const l = length3(a) || 1; return scale3(a,1/l); };
export const mat4 = () => new Float32Array(16);
export function multiply4(a,b,out=mat4()) {
  for (let c=0;c<4;c++) for (let r=0;r<4;r++) out[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
  return out;
}
export function perspective4(fovy, aspect, near, far, out=mat4()) {
  const f=1/Math.tan(fovy/2); out.fill(0); out[0]=f/aspect; out[5]=f; out[11]=-1; out[10]=(far+near)/(near-far); out[14]=(2*far*near)/(near-far); return out;
}
export function lookAt4(eye,center,up,out=mat4()) {
  const z=normalize3(sub3(eye,center)); const x=normalize3(cross3(up,z)); const y=cross3(z,x);
  out[0]=x[0];out[1]=y[0];out[2]=z[0];out[3]=0; out[4]=x[1];out[5]=y[1];out[6]=z[1];out[7]=0; out[8]=x[2];out[9]=y[2];out[10]=z[2];out[11]=0; out[12]=-dot3(x,eye);out[13]=-dot3(y,eye);out[14]=-dot3(z,eye);out[15]=1; return out;
}
export function transform4(m,v) {
  const x=v[0],y=v[1],z=v[2],w=v[3]??1;
  return new Float32Array([m[0]*x+m[4]*y+m[8]*z+m[12]*w,m[1]*x+m[5]*y+m[9]*z+m[13]*w,m[2]*x+m[6]*y+m[10]*z+m[14]*w,m[3]*x+m[7]*y+m[11]*z+m[15]*w]);
}
export function project(point, viewProjection, width, height) {
  const p=transform4(viewProjection,[point[0],point[1],point[2],1]); if (Math.abs(p[3]) < EPSILON) return null;
  const x=p[0]/p[3], y=p[1]/p[3], z=p[2]/p[3]; return { x:(x*.5+.5)*width, y:(1-(y*.5+.5))*height, z, visible:p[3]>0&&z>=-1&&z<=1 };
}
export function cameraEye(target, yaw, pitch, distance) {
  const cp=Math.cos(pitch); return vec3(target[0]+Math.sin(yaw)*cp*distance,target[1]+Math.sin(pitch)*distance,target[2]+Math.cos(yaw)*cp*distance);
}
