import test from 'node:test';
import assert from 'node:assert/strict';
import {captureRequest} from './dist/packet.mjs';
for(const mode of ['intake','start','continue'])test(mode+' guides missing intent and immediate response without inventing acceptance',()=>{const p=captureRequest(mode);assert.match(p,/wait for their answer/);assert.match(p,/Do not ask for information already supplied/);assert.match(p,/never infer satisfaction from technical success/);assert.match(p,/return the response immediately, even when work remains unfinished/);assert.match(p,/heading format below applies only to the final response/);assert.match(p,/Return information only; do not execute changes or publish anything/);});
test('ordinary continuation reports do not restart intake',()=>{const p=captureRequest('continue',undefined,true);assert.doesNotMatch(p,/FIRST, determine/);assert.match(p,/RESULT IDENTITY/);});
