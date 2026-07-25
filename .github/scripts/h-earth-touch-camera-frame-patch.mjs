import fs from 'node:fs';

const path = 'showroom/globe/h-earth/index.js';
let source = fs.readFileSync(path, 'utf8');

const functionStart = source.indexOf(
  'function applyHEarthTouchCameraIntent('
);

const functionEnd = source.indexOf(
  'function installHEarthTouchCameraControls(',
  functionStart
);

if (
  functionStart < 0 ||
  functionEnd <= functionStart
) {
  throw new Error('TOUCH_CAMERA_INTENT_FUNCTION_NOT_FOUND');
}

let block = source.slice(
  functionStart,
  functionEnd
);

fs.mkdirSync(
  'artifacts/h-earth-touch-camera',
  { recursive: true }
);

fs.writeFileSync(
  'artifacts/h-earth-touch-camera/touch-intent-function.before.js',
  block,
  'utf8'
);

const identityAnchor = [
  '  const initializationKey =',
  '    MODULE_STATE.activeInitializationKey;',
  '',
  '  let handoff;'
].join('\n');

const identityReplacement = [
  '  const initializationKey =',
  '    MODULE_STATE.activeInitializationKey;',
  '',
  '  const compositorStateSnapshot =',
  '    compositorModule',
  '      .getHEarth3DCompositorState();',
  '',
  '  const touchCompositorFrameOccurrenceId =',
  '    `${initializationKey.compositorFrameOccurrenceId}` +',
  '    `:TOUCH_CAMERA_GESTURE:${MODULE_STATE.touchCameraGestureRevision + 1}` +',
  '    `:CAMERA_REVISION:${compositorStateSnapshot.revisions.camera}`;',
  '',
  '  let handoff;'
].join('\n');

if (block.split(identityAnchor).length !== 2) {
  throw new Error('TOUCH_CAMERA_IDENTITY_ANCHOR_NOT_EXACT');
}

block = block.replace(
  identityAnchor,
  identityReplacement
);

const handoffAnchor = [
  '        packet002TransferOccurrenceId:',
  '          initializationKey?.packet002TransferOccurrenceId,',
  '        presentationMode:'
].join('\n');

const handoffReplacement = [
  '        packet002TransferOccurrenceId:',
  '          initializationKey?.packet002TransferOccurrenceId,',
  '        compositorFrameOccurrenceId:',
  '          touchCompositorFrameOccurrenceId,',
  '        presentationMode:'
].join('\n');

if (block.split(handoffAnchor).length !== 2) {
  fs.writeFileSync(
    'artifacts/h-earth-touch-camera/touch-intent-function.after-identity.js',
    block,
    'utf8'
  );
  throw new Error('TOUCH_CAMERA_HANDOFF_ANCHOR_NOT_EXACT');
}

block = block.replace(
  handoffAnchor,
  handoffReplacement
);

source =
  source.slice(0, functionStart) +
  block +
  source.slice(functionEnd);

fs.writeFileSync(path, source, 'utf8');
