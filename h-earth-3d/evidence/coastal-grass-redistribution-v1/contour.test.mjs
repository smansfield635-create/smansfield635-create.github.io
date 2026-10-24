import test from 'node:test';
import assert from 'node:assert/strict';
import {contourWeight,recipientWeight,donorWeight} from './field.mjs';
test('outer coastal tip retracts while adjoining dry indentation can receive grass',()=>{
 for(const side of [-1,1]){assert.equal(contourWeight(side*380,-130),0);assert.equal(donorWeight(side*380,2,-130,40),1);assert(recipientWeight(side*400,-240)>.5);assert.equal(recipientWeight(side*450,-240),0);}
});
test('contour blends into interior and crosses old support seam continuously',()=>{
 for(const side of [-1,1])for(const edge of [250,300,384])for(let z=-280;z<-100;z+=5)assert(Math.abs(contourWeight(side*(edge-.001),z)-contourWeight(side*(edge+.001),z))<.001);
 for(let z=-280;z<-100;z++)assert.equal(contourWeight(240,z),1);
});
test('rounded outer extent varies with depth instead of ending on a straight x cutoff',()=>{
 function extent(z){let edge=300;for(let x=300;x<450;x+=.1)if(contourWeight(x,z)>.5)edge=x;return edge;}
 assert(extent(-240)>extent(-200)+8);assert(extent(-200)>extent(-170)+20);
});
