#!/usr/bin/env node
import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));const read=n=>fs.readFileSync(path.join(root,n),'utf8');const files={html:read('index.html'),css:read('styles.css'),world:read('world.mjs'),app:read('app.mjs')};
const checks={
 fullViewport:/#world\{position:relative/.test(files.css)&&/width:100%;height:100%/.test(files.css),
 worldDominant:/<canvas id="scene"/.test(files.html)&&!/nav|aside|table/.test(files.html),
 independentRenderer:/\['webgl','webgl2','experimental-webgl'\]/.test(files.app)&&/drawElements\(gl\.TRIANGLES/.test(files.app),
 resilientEnvironmentalFallback:/startCanvas2D/.test(files.app)&&/canvas2d-environmental/.test(files.app)&&/drawGlobe/.test(files.app)&&/drawLocal/.test(files.app),
 independentCamera:/lookAt\(/.test(files.app)&&/perspective\(/.test(files.app)&&/state=\{lat:/.test(files.app),
 continuousTraversal:/function travel\(dx,dy\)/.test(files.app)&&/pointermove/.test(files.app),
 scaleTraversal:/scaleName\(state\.alt\)/.test(files.app)&&/planetary/.test(files.world)&&/continental/.test(files.world)&&/regional/.test(files.world)&&/local/.test(files.world),
 ocean:/createLinearGradient/.test(files.app)&&/#0c3d55/.test(files.app),
 atmosphereHorizon:/haze/.test(files.app)&&/halo/.test(files.app)&&/radial-gradient/.test(files.css),
 environmentalTerrain:/terrainHeight/.test(files.world)&&/representationRelief/.test(files.world),
 canonicalCoast:/COAST=Object\.freeze/.test(files.world)&&/SANDBARS=Object\.freeze/.test(files.world)&&/insideLoop/.test(files.world),
 audraliaIdentity:/Audralia/.test(files.html)&&/AUDRALIA_CANONICAL_WORLD_REFERENCE/.test(files.world),
 touchAndPinch:/pointerdown/.test(files.app)&&/lastPinch/.test(files.app)&&/pointercancel/.test(files.app),
 noForeignRuntimeImport:!/(showroom\/globe\/h-earth|showroom\/globe\/audralia|h-earth-3d\/|open-world\/o1\/)/.test(files.app+files.world),
 noExternalNetwork:!/(fetch\(|XMLHttpRequest|WebSocket|https?:\/\/)/.test(files.app+files.world),
 noSchematicMap:/canvas id="scene"/.test(files.html)&&!/contour|landmark|marker|map label/i.test(files.html),
 noFailureOnlyFallback:!/fallback\.hidden=false;throw new Error\('WEBGL_UNAVAILABLE'\)/.test(files.app),
 hiddenFallbackContract:/#fallback\[hidden\]\{display:none!important\}/.test(files.css),
 bootStageInstrumentation:/HTML_BOOT/.test(files.html)&&/MODULE_EXECUTING/.test(files.app)&&/CONTEXT_ACQUIRED/.test(files.app)&&/RENDERER_INITIALIZED/.test(files.app)&&/FIRST_FRAME/.test(files.app),
 exactFiveSurface:['index.html','styles.css','world.mjs','app.mjs','verify.mjs'].every(n=>fs.existsSync(path.join(root,n)))
};
const pass=Object.values(checks).every(Boolean);console.log(JSON.stringify({schema:'OPEN_WORLD_O1_SUCCESSOR_SPECIMEN_VERIFICATION_RECEIPT_v1',result:pass?'PASS_STARTUP_INSTRUMENTED_ENVIRONMENTAL_SUCCESSOR':'FAIL_CLOSED',checks,rendererPolicy:'WEBGL_PRIMARY_WITH_INDEPENDENT_ENVIRONMENTAL_CANVAS2D_FALLBACK',productionMergeAuthorized:false,correspondenceC1Authorized:false,userInspectionRequired:true},null,2));if(!pass)process.exitCode=1;
