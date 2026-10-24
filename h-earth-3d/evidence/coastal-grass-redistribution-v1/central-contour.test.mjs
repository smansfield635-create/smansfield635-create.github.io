import test from 'node:test';
import assert from 'node:assert/strict';
import {centralRetention,coastalLimit} from './central-contour.mjs';
test('long low coastal tip is removed fully, not merely thinned',()=>{
 for(let x=-80;x<=-20;x+=2)for(let z=-160;z<=-120;z+=2)assert.equal(centralRetention(x,5,z),0);
 assert.equal(centralRetention(-50,5,-185),1);
 assert.equal(centralRetention(-50,9,-140),1,'HIGH_HILLSIDE_CHANGED');
});
test('estate rectangle corners fit wholly inside round no-planting clearance',()=>{
 for(const x of [64,96])for(const z of [-188,-156])assert.equal(centralRetention(x,10,z),0);
 for(let a=0;a<Math.PI*2;a+=.05){assert.equal(centralRetention(80+23*Math.cos(a),10,-172+23*Math.sin(a)),0);assert.equal(centralRetention(80+29*Math.cos(a),10,-172+29*Math.sin(a)),1);}
});
test('local contour has continuous curved transitions and leaves unrelated planting intact',()=>{
 for(const x of [-130,-110,160,180])for(let z=-210;z<-100;z+=4)assert(Math.abs(centralRetention(x-.001,4,z)-centralRetention(x+.001,4,z))<.001);
 assert(coastalLimit(-55)>coastalLimit(0)+8);
 for(const x of [-300,250])for(let z=-300;z<0;z+=3)assert.equal(centralRetention(x,4,z),1);
});
