(() => {
  'use strict';
  const script = document.createElement('script');
  script.src = '/verification/methods-native-visual-architecture-remediation-prototype-v1/prototype-v2.js';
  script.dataset.mvrPrototypeLoader = 'v2';
  script.addEventListener('error', () => { throw new Error('MVR_V2_LOAD_FAILED'); });
  document.head.append(script);
})();
