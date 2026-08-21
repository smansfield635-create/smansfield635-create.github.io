export function validateReadback({ path, expectedBlob, returnedBlob, fetchedBlob }) {
  const errors = [];
  if (!expectedBlob) errors.push("EXPECTED_BLOB_MISSING");
  if (returnedBlob !== expectedBlob) errors.push("RETURNED_BLOB_MISMATCH");
  if (fetchedBlob !== expectedBlob) errors.push("FETCHED_BLOB_MISMATCH");
  return Object.freeze({
    path,
    pass: errors.length === 0,
    expectedBlob,
    returnedBlob,
    fetchedBlob,
    errors: Object.freeze(errors)
  });
}
