import {smooth} from '../../../showroom/globe/h-earth/render/grass-coastal-field.v1.js';
import {habitatNoise} from '../../../showroom/globe/h-earth/render/woodland-habitat-field.v1.js';
// Round the outer coastal ends, blending into unchanged interior planting.
// This is a local contour, not a world-wide terrain or water mask.
export function contourWeight(x,z){
 const ax=Math.abs(x),n=habitatNoise(x,z,23,2878);
 const radius=Math.hypot(Math.max(0,ax-300)/140,(z+240)/90);
 const cap=1-smooth(.90+.025*n,1+.025*n,radius);
 return 1-smooth(250,300,ax)*(1-cap);
}
export function recipientWeight(x,z){
 return smooth(250,280,Math.abs(x))*contourWeight(x,z)*smooth(-283,-268,z)*(1-smooth(-166,-145,z));
}
export function donorWeight(x,y,z,contact){
 if(y>=8||Math.abs(x)<=250)return 0;
 return (1-contourWeight(x,z))*(1-smooth(6,8,y));
}
