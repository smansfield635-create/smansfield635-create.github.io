import crypto from 'node:crypto';

const sha256 = (text) =>
  crypto.createHash('sha256').update(text, 'utf8').digest('hex');

function qualify({ sourceBytes, publicBytes, ciPassed, deploymentPassed, runtimePassed }) {
  const sourceDigest = sha256(sourceBytes);
  const publicDigest = sha256(publicBytes);
  const byteIdentityPass = sourceDigest === publicDigest;
  const passClosed = Boolean(
    ciPassed && deploymentPassed && byteIdentityPass && runtimePassed
  );
  const brokenEdge = byteIdentityPass
    ? null
    : 'SOURCE_BYTES_TO_PUBLIC_BYTES_IDENTITY';

  return {
    sourceDigest,
    publicDigest,
    ciPassed,
    deploymentPassed,
    runtimePassed,
    byteIdentityPass,
    brokenEdge,
    passClosed
  };
}

const approved = 'BT3-A approved executable bytes v1\n';
const altered = 'BT3-A altered public executable bytes v1\n';

const control = qualify({
  sourceBytes: approved,
  publicBytes: approved,
  ciPassed: true,
  deploymentPassed: true,
  runtimePassed: true
});

const adversarial = qualify({
  sourceBytes: approved,
  publicBytes: altered,
  ciPassed: true,
  deploymentPassed: true,
  runtimePassed: true
});

const assertions = {
  controlPassClosed: control.passClosed === true,
  adversarialCIPreserved: adversarial.ciPassed === true,
  adversarialDeploymentPreserved: adversarial.deploymentPassed === true,
  adversarialRuntimePreserved: adversarial.runtimePassed === true,
  adversarialByteMismatchDetected: adversarial.byteIdentityPass === false,
  adversarialPassClosedRejected: adversarial.passClosed === false,
  preciseBrokenEdgeIdentified:
    adversarial.brokenEdge === 'SOURCE_BYTES_TO_PUBLIC_BYTES_IDENTITY'
};

const pass = Object.values(assertions).every(Boolean);
const receipt = {
  experiment: 'BT3_A_PUBLIC_BYTE_CUSTODY_ADVERSARIAL_v1',
  control,
  adversarial,
  assertions,
  terminal: pass ? 'PASS' : 'FAIL'
};

console.log(JSON.stringify(receipt, null, 2));
if (!pass) process.exit(1);
