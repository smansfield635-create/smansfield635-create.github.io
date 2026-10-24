import {smooth} from '../../../showroom/globe/h-earth/render/grass-coastal-field.v1.js';
import {habitatNoise} from '../../../showroom/globe/h-earth/render/woodland-habitat-field.v1.js';
// A local shoulder across the confirmed canonical/far-land support seam.
// The study window is larger than the zero-density contour.
export function recipientWeight(x,z){
 const edge=Math.abs(x)-384;
 if(edge<0)return 0;
 const n=habitatNoise(x,z,23,2878);
 return (1-smooth(20+10*n,42+10*n,edge))*smooth(-258,-238,z)*(1-smooth(-178,-148,z));
}
// Retract only recent low coastal additions, with an irregular feathered shore.
export function donorWeight(x,y,z,contact){
 if(y>=6||Math.abs(x)<160)return 0;
 const n=habitatNoise(x,z,19,2878);
 return smooth(160,190,Math.abs(x))*(1-smooth(20+6*n,42+6*n,contact))*(1-smooth(3,6,y));
}
