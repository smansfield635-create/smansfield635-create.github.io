import crypto from "node:crypto";

export function sha256Hex(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(String(value), "utf8");
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

export function gitBlobSha(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(String(value), "utf8");
  const header = Buffer.from(`blob ${bytes.length}\0`, "utf8");
  return crypto.createHash("sha1").update(Buffer.concat([header, bytes])).digest("hex");
}

export function validatePackage({ manifest, files, authorizedPaths, expectedManifestId, expectedParent }) {
  const errors = [];
  if (!manifest || typeof manifest !== "object") errors.push("MANIFEST_MISSING");
  if (manifest?.packet !== expectedManifestId) errors.push("MANIFEST_ID_MISMATCH");
  if (manifest?.parentCommit !== expectedParent) errors.push("PACKAGE_PARENT_MISMATCH");
  if (!Array.isArray(manifest?.checks)) errors.push("MANIFEST_CHECKS_MISSING");

  const checkPaths = new Set();
  const results = [];
  for (const check of manifest?.checks || []) {
    if (!check?.file || checkPaths.has(check.file)) {
      errors.push("DUPLICATE_OR_INVALID_MANIFEST_PATH");
      continue;
    }
    checkPaths.add(check.file);
    if (!Object.prototype.hasOwnProperty.call(files, check.file)) {
      errors.push(`PACKAGE_FILE_MISSING:${check.file}`);
      continue;
    }
    const bytes = Buffer.isBuffer(files[check.file])
      ? files[check.file]
      : Buffer.from(String(files[check.file]), "utf8");
    const actual = {
      file: check.file,
      bytes: bytes.length,
      sha256: sha256Hex(bytes),
      gitBlobSha: gitBlobSha(bytes)
    };
    if (actual.bytes !== check.bytes) errors.push(`PACKAGE_BYTES_MISMATCH:${check.file}`);
    if (actual.sha256 !== check.sha256) errors.push(`PACKAGE_SHA256_MISMATCH:${check.file}`);
    if (actual.gitBlobSha !== check.gitBlobSha) errors.push(`PACKAGE_GIT_BLOB_MISMATCH:${check.file}`);
    results.push(actual);
  }

  const authorized = new Set(authorizedPaths || []);
  for (const path of authorized) {
    if (!checkPaths.has(path)) errors.push(`AUTHORIZED_PATH_NOT_IN_PACKAGE:${path}`);
  }
  for (const path of checkPaths) {
    if (path.startsWith("laws/") && !authorized.has(path)) errors.push(`UNAUTHORIZED_PACKAGE_PATH:${path}`);
  }

  return Object.freeze({
    pass: errors.length === 0,
    errors: Object.freeze(errors),
    checks: Object.freeze(results),
    manifestId: manifest?.packet || null,
    parentCommit: manifest?.parentCommit || null
  });
}
