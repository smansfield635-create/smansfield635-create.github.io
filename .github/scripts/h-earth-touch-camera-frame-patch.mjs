import fs from 'node:fs';

const path = 'showroom/globe/h-earth/index.js';
let source = fs.readFileSync(path, 'utf8');

const oldText = [
  '  const initializationKey =',
  '    MODULE_STATE.activeInitializationKey;',
  '',
  '  let handoff;',
  '  let rendererApplyReceipt;',
  '',
  '  try {',
  '    handoff =',
  '      createHandoff({',
  '        packet002Transfer:',
  '          initializationKey?.packet002Transfer,',
  '        packet002TransferOccurrenceId:',
  '          initializationKey?.packet002TransferOccurrenceId,',
  '        presentationMode:',
  '          initializationKey?.presentationMode',
  '      });'
].join('\n');

const newText = [
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
  '  let handoff;',
  '  let rendererApplyReceipt;',
  '',
  '  try {',
  '    handoff =',
  '      createHandoff({',
  '        packet002Transfer:',
  '          initializationKey?.packet002Transfer,',
  '        packet002TransferOccurrenceId:',
  '          initializationKey?.packet002TransferOccurrenceId,',
  '        compositorFrameOccurrenceId:',
  '          touchCompositorFrameOccurrenceId,',
  '        presentationMode:',
  '          initializationKey?.presentationMode',
  '      });'
].join('\n');

if (source.split(oldText).length !== 2) {
  const start = source.indexOf('  const initializationKey =');
  throw new Error(
    `FRESH_FRAME_PATCH_EXPECTED_EXACTLY_ONCE:${source.slice(start, start + 700)}`
  );
}

source = source.replace(oldText, newText);
fs.writeFileSync(path, source, 'utf8');
