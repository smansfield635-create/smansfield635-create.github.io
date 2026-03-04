/* =========================================================
   GEODIAMETRICS HEX LATTICE ENGINE
   FILE: /assets/hex-lattice-engine.js
   PURPOSE:
     Unified geometric coordinate system for:

       • compass layout
       • dragon motion paths
       • water ripple propagation
       • star positioning
       • hex-pixel rendering

   DESIGN RULES
     - deterministic
     - GPU friendly
     - no timers used as gates
     - geometry first
========================================================= */

(function(){

"use strict";

/* =========================================================
   HEX CONSTANTS
========================================================= */

const SQRT3 = Math.sqrt(3);

/* =========================================================
   HEX COORDINATE SYSTEM
   axial coordinates (q,r)
========================================================= */

function hex(q,r){
    return {q:q,r:r};
}

/* convert hex → pixel */
function hexToPixel(hex,size){
    const x = size * (SQRT3 * hex.q + SQRT3/2 * hex.r);
    const y = size * (3/2 * hex.r);
    return {x,y};
}

/* convert pixel → hex */
function pixelToHex(x,y,size){
    const q = ((SQRT3/3 * x) - (1/3 * y)) / size;
    const r = (2/3 * y) / size;
    return hexRound({q,r});
}

/* =========================================================
   ROUND HEX COORDS
========================================================= */

function hexRound(h){

    let x = h.q;
    let z = h.r;
    let y = -x - z;

    let rx = Math.round(x);
    let ry = Math.round(y);
    let rz = Math.round(z);

    const x_diff = Math.abs(rx - x);
    const y_diff = Math.abs(ry - y);
    const z_diff = Math.abs(rz - z);

    if (x_diff > y_diff && x_diff > z_diff) {
        rx = -ry - rz;
    } else if (y_diff > z_diff) {
        ry = -rx - rz;
    } else {
        rz = -rx - ry;
    }

    return {q:rx,r:rz};
}

/* =========================================================
   HEX NEIGHBORS
========================================================= */

const HEX_DIRS = [
    {q:1,r:0},
    {q:1,r:-1},
    {q:0,r:-1},
    {q:-1,r:0},
    {q:-1,r:1},
    {q:0,r:1}
];

function hexNeighbor(h,dir){
    const d = HEX_DIRS[dir];
    return hex(h.q + d.q, h.r + d.r);
}

/* =========================================================
   HEX RINGS
========================================================= */

function hexRing(center,radius){

    let results = [];

    if(radius === 0){
        results.push(center);
        return results;
    }

    let cube = {
        q: center.q + HEX_DIRS[4].q * radius,
        r: center.r + HEX_DIRS[4].r * radius
    };

    for(let i=0;i<6;i++){

        for(let j=0;j<radius;j++){

            results.push(cube);
            cube = hexNeighbor(cube,i);

        }

    }

    return results;
}

/* =========================================================
   HEX SPIRAL
========================================================= */

function hexSpiral(center,radius){

    let results = [center];

    for(let k=1;k<=radius;k++){
        results = results.concat(hexRing(center,k));
    }

    return results;
}

/* =========================================================
   COMPASS NODE GENERATOR
========================================================= */

function generateCompassNodes(radius){

    const center = hex(0,0);

    const nodes = hexSpiral(center,radius);

    return nodes.map(h=>{
        const pos = hexToPixel(h,1);
        return {
            hex:h,
            x:pos.x,
            y:pos.y
        };
    });
}

/* =========================================================
   DRAGON PATH GENERATOR
   (slithering hex curve)
========================================================= */

function dragonPath(length){

    let path = [];

    let current = hex(0,0);

    for(let i=0;i<length;i++){

        const dir = Math.floor(Math.random()*6);

        current = hexNeighbor(current,dir);

        path.push(current);

    }

    return path;

}

/* =========================================================
   WATER RIPPLE ENGINE
========================================================= */

function ripple(center,steps){

    let rings = [];

    for(let i=0;i<steps;i++){

        rings.push(hexRing(center,i));

    }

    return rings;

}

/* =========================================================
   STAR FIELD GENERATOR
========================================================= */

function starField(count,spread){

    let stars = [];

    for(let i=0;i<count;i++){

        stars.push({
            x:(Math.random()-0.5)*spread,
            y:(Math.random()-0.5)*spread,
            size:Math.random()*2
        });

    }

    return stars;

}

/* =========================================================
   EXPORT GLOBAL
========================================================= */

window.GeoDiametricsLattice = {

    hex,
    hexToPixel,
    pixelToHex,

    hexNeighbor,
    hexRing,
    hexSpiral,

    generateCompassNodes,

    dragonPath,

    ripple,

    starField

};

})();
