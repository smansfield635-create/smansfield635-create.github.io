(() => {
  'use strict';

  const load = (src, marker, onload) => {
    const script = document.createElement('script');
    script.src = src;
    script.dataset.mvrPrototypeLoader = marker;
    script.addEventListener('load', onload || (() => {}), { once: true });
    script.addEventListener('error', () => { throw new Error(`MVR_${marker.toUpperCase()}_LOAD_FAILED`); }, { once: true });
    document.head.append(script);
  };

  load('/verification/methods-native-visual-architecture-remediation-prototype-v1/prototype-v2.js', 'v2', () => {
    load('/verification/methods-native-visual-architecture-remediation-prototype-v1/prototype-v3.js', 'v3');
  });
})();
