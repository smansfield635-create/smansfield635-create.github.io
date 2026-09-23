/**
 * /h-earth-3d/runtime/tests/h-earth.serialization-vector-runner.js
 * COMPLETE NEW FILE
 * H_EARTH_SERIALIZATION_VECTOR_RUNNER_FILE_BIRTH_STEP_012I_RUNNER_v1
 *
 * Source family:
 * H-Earth 3D Scratch Domain
 *
 * Step:
 * STEP_012I_REFERENCE_VECTOR_EXECUTION_CORRIDOR
 *
 * Purpose:
 * Define an isolated reference-vector runner for the active backed Step 012I
 * canonical state serialization law.
 *
 * This runner imports Step 012I only.
 *
 * This runner does not import:
 * - deterministic runtime;
 * - canonical replay;
 * - Step 012H headless replay scaffold;
 * - H-Earth state bridge;
 * - route files;
 * - renderer files;
 * - persistence files.
 *
 * This file defines a callable runner.
 * Function definition is not function execution.
 *
 * This file does not execute vectors at module load.
 * This file does not execute runtime.
 * This file does not create world state.
 * This file does not admit intents.
 * This file does not commit ticks.
 * This file does not execute replay.
 * This file does not compare replay.
 * This file does not validate.
 * This file does not produce a visual pass.
 * This file does not collapse the matrix.
 */

import H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW, {
  H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CONTRACT_ID,
  H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID
} from '../h-earth.canonical-state-serialization-law.js';


export const H_EARTH_SERIALIZATION_VECTOR_RUNNER_CONTRACT_ID =
  'H_EARTH_SERIALIZATION_VECTOR_RUNNER_FILE_BIRTH_STEP_012I_RUNNER_v1';


export const H_EARTH_SERIALIZATION_VECTOR_RUNNER_EXPECTED_STEP_012I_CONTRACT_ID =
  'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_FILE_BIRTH_STEP_012I_v1';


export const H_EARTH_SERIALIZATION_VECTOR_RUNNER_EXPECTED_CANONICALIZATION_ID =
  'H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_STEP_012I_UTF16_UTF8_SHA256_v1';


function deepFreeze(value) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }

  return Object.freeze(value);
}


function freeze(value) {
  return deepFreeze(value);
}


export const H_EARTH_SERIALIZATION_VECTOR_RUNNER_AUTHORITY =
  freeze({
    authorityId:
      'H_EARTH_SERIALIZATION_VECTOR_RUNNER_STEP_012I_AUTHORITY_BOUNDARY',

    file:
      '/h-earth-3d/runtime/tests/h-earth.serialization-vector-runner.js',

    currentStep:
      'STEP_012I_RUNNER',

    contractId:
      H_EARTH_SERIALIZATION_VECTOR_RUNNER_CONTRACT_ID,

    expectedStep012IContractId:
      H_EARTH_SERIALIZATION_VECTOR_RUNNER_EXPECTED_STEP_012I_CONTRACT_ID,

    expectedCanonicalizationId:
      H_EARTH_SERIALIZATION_VECTOR_RUNNER_EXPECTED_CANONICALIZATION_ID,

    importedStep012IContractId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CONTRACT_ID,

    importedStep012ICanonicalizationId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID,

    authorityClass:
      'STEP_012I_REFERENCE_VECTOR_EXECUTION_CORRIDOR_ONLY',

    fileClass:
      'ISOLATED_STEP_012I_SERIALIZATION_VECTOR_RUNNER_ONLY',

    activeStatusCeiling:
      'STEP_012I_REFERENCE_VECTOR_EXECUTION_CORRIDOR_ONLY',

    importsStep012IOnly:
      true,

    target003ImportAuthorized:
      false,

    step012HImportAuthorized:
      false,

    deterministicRuntimeImportAuthorized:
      false,

    stateBridgeImportAuthorized:
      false,

    rendererImportAuthorized:
      false,

    routeImportAuthorized:
      false,

    persistenceImportAuthorized:
      false,

    runnerFunctionDefinedHere:
      true,

    runnerExecutedAtModuleLoad:
      false,

    vectorExecutionAtModuleLoad:
      false,

    importResolutionObservedBySourceText:
      false,

    importResolutionObservedOnlyIfRunnerExecutes:
      true,

    step012IModuleEvaluationObservedOnlyIfImportSucceeds:
      true,

    fullRuntimeImportGraphVerified:
      false,

    target003Executed:
      false,

    step012HExecuted:
      false,

    hEarthRuntimeExecuted:
      false,

    worldStateCreated:
      false,

    intentAdmitted:
      false,

    tickCommitted:
      false,

    replayExecuted:
      false,

    replayEqualityProven:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    visualPassClaim:
      false,

    matrixCollapse:
      false
  });


function assert(condition, code, details = undefined) {
  if (!condition) {
    const error =
      new Error(code);

    if (details !== undefined) {
      error.details =
        details;
    }

    throw error;
  }
}


function assertString(value, code) {
  assert(
    typeof value === 'string' &&
      value.length > 0,
    code
  );
}


function assertHexDigest(value, code) {
  assert(
    typeof value === 'string' &&
      /^[0-9a-f]{64}$/.test(value),
    code
  );
}


function assertRunnerOptions(options) {
  assert(
    options !== null &&
      typeof options === 'object' &&
      !Array.isArray(options) &&
      Object.getPrototypeOf(options) === Object.prototype,
    'RUNNER_OPTIONS_PLAIN_OBJECT_REQUIRED'
  );

  if (options.runId !== undefined) {
    assert(
      typeof options.runId === 'string' &&
        /^[A-Z0-9_:-]+$/.test(options.runId),
      'RUNNER_RUN_ID_INVALID'
    );
  }
}


function runCheck(checkId, fn) {
  try {
    const result =
      fn();

    return freeze({
      checkId,
      ok:
        true,
      result:
        result === undefined ? null : result
    });
  } catch (error) {
    return freeze({
      checkId,
      ok:
        false,
      errorClass:
        error && error.constructor
          ? error.constructor.name
          : typeof error,
      errorMessage:
        error && error.message
          ? error.message
          : String(error),
      details:
        error && error.details
          ? error.details
          : null
    });
  }
}


function assertAllChecksPassed(groupId, checks) {
  const failed =
    checks.filter((check) => check.ok !== true);

  assert(
    failed.length === 0,
    `${groupId}_FAILED`,
    freeze({
      failed
    })
  );
}


function bytesFromAscii(text) {
  const bytes =
    new Uint8Array(text.length);

  for (
    let index = 0;
    index < text.length;
    index += 1
  ) {
    bytes[index] =
      text.charCodeAt(index);
  }

  return bytes;
}


function createRejectionCase(vectorId) {
  if (vectorId === 'undefined') {
    return {
      value:
        { forbidden: undefined },
      expectedErrorPrefix:
        'UNDEFINED_REJECTED'
    };
  }

  if (vectorId === 'NaN') {
    return {
      value:
        { forbidden: Number.NaN },
      expectedErrorPrefix:
        'NONFINITE_NUMBER_REJECTED'
    };
  }

  if (vectorId === 'Infinity') {
    return {
      value:
        { forbidden: Infinity },
      expectedErrorPrefix:
        'NONFINITE_NUMBER_REJECTED'
    };
  }

  if (vectorId === '-Infinity') {
    return {
      value:
        { forbidden: -Infinity },
      expectedErrorPrefix:
        'NONFINITE_NUMBER_REJECTED'
    };
  }

  if (vectorId === 'BigInt') {
    return {
      value:
        { forbidden: BigInt(1) },
      expectedErrorPrefix:
        'BIGINT_REJECTED'
    };
  }

  if (vectorId === 'Date') {
    return {
      value:
        { forbidden: new Date(0) },
      expectedErrorPrefix:
        'NON_PLAIN_OBJECT_REJECTED'
    };
  }

  if (vectorId === 'Map') {
    return {
      value:
        { forbidden: new Map() },
      expectedErrorPrefix:
        'NON_PLAIN_OBJECT_REJECTED'
    };
  }

  if (vectorId === 'Set') {
    return {
      value:
        { forbidden: new Set() },
      expectedErrorPrefix:
        'NON_PLAIN_OBJECT_REJECTED'
    };
  }

  if (vectorId === 'typedArray') {
    return {
      value:
        { forbidden: new Uint8Array([1]) },
      expectedErrorPrefix:
        'NON_PLAIN_OBJECT_REJECTED'
    };
  }

  if (vectorId === 'customPrototype') {
    const Custom =
      function Custom() {
        this.value = 1;
      };

    return {
      value:
        new Custom(),
      expectedErrorPrefix:
        'NON_PLAIN_OBJECT_REJECTED'
    };
  }

  if (vectorId === 'nullPrototypeUnderV1') {
    const value =
      Object.create(null);

    value.visible =
      1;

    return {
      value,
      expectedErrorPrefix:
        'NULL_PROTOTYPE_OBJECT_REJECTED'
    };
  }

  if (vectorId === 'accessorProperty') {
    let getterExecuted =
      false;

    const value =
      {};

    Object.defineProperty(
      value,
      'danger',
      {
        enumerable:
          true,
        get() {
          getterExecuted =
            true;
          return 1;
        }
      }
    );

    return {
      value,
      expectedErrorPrefix:
        'ACCESSOR_PROPERTY_REJECTED',
      getGetterExecuted:
        () => getterExecuted
    };
  }

  if (vectorId === 'accessorArrayEntry') {
    let getterExecuted =
      false;

    const value =
      [1];

    Object.defineProperty(
      value,
      '0',
      {
        enumerable:
          true,
        configurable:
          true,
        get() {
          getterExecuted =
            true;
          return 1;
        }
      }
    );

    return {
      value,
      expectedErrorPrefix:
        'ACCESSOR_ARRAY_ENTRY_REJECTED',
      getGetterExecuted:
        () => getterExecuted
    };
  }

  if (vectorId === 'symbolKeyedObjectProperty') {
    const value =
      { visible: 1 };

    value[Symbol('hidden')] =
      2;

    return {
      value,
      expectedErrorPrefix:
        'SYMBOL_KEYED_PROPERTIES_REJECTED'
    };
  }

  if (vectorId === 'symbolKeyedArrayProperty') {
    const value =
      [1, 2];

    value[Symbol('hidden')] =
      3;

    return {
      value,
      expectedErrorPrefix:
        'SYMBOL_KEYED_ARRAY_PROPERTIES_REJECTED'
    };
  }

  if (vectorId === 'nonIndexArrayProperty') {
    const value =
      [1, 2];

    value.hiddenState =
      'not serialized';

    return {
      value,
      expectedErrorPrefix:
        'NON_INDEX_ARRAY_PROPERTY_REJECTED'
    };
  }

  if (vectorId === 'nonEnumerableObjectProperty') {
    const value =
      { visible: 1 };

    Object.defineProperty(
      value,
      'hidden',
      {
        value:
          2,
        enumerable:
          false
      }
    );

    return {
      value,
      expectedErrorPrefix:
        'NON_ENUMERABLE_OBJECT_PROPERTY_REJECTED'
    };
  }

  if (vectorId === 'ownToJSONProperty') {
    return {
      value:
        {
          visible: 1,
          toJSON() {
            return { forged: true };
          }
        },
      expectedErrorPrefix:
        'OWN_TOJSON_PROPERTY_REJECTED'
    };
  }

  if (vectorId === 'ownNonfunctionToJSONProperty') {
    return {
      value:
        {
          visible: 1,
          toJSON: 'not callable'
        },
      expectedErrorPrefix:
        'OWN_TOJSON_PROPERTY_REJECTED'
    };
  }

  if (vectorId === 'sparseArray') {
    const value =
      [];

    value[1] =
      'present';

    return {
      value,
      expectedErrorPrefix:
        'SPARSE_ARRAY_ENTRY_REJECTED'
    };
  }

  if (vectorId === 'circularReference') {
    const value =
      { visible: 1 };

    value.self =
      value;

    return {
      value,
      expectedErrorPrefix:
        'CIRCULAR_REFERENCE_REJECTED'
    };
  }

  if (vectorId === 'loneHighSurrogate') {
    return {
      value:
        { text: '\uD800' },
      expectedErrorPrefix:
        'LONE_HIGH_SURROGATE_REJECTED'
    };
  }

  if (vectorId === 'loneLowSurrogate') {
    return {
      value:
        { text: '\uDC00' },
      expectedErrorPrefix:
        'LONE_LOW_SURROGATE_REJECTED'
    };
  }

  if (vectorId === 'loneSurrogateInPropertyKey') {
    return {
      value:
        {
          '\uD800': 'bad key'
        },
      expectedErrorPrefix:
        'LONE_HIGH_SURROGATE_REJECTED'
    };
  }

  throw new Error(
    `UNKNOWN_REJECTION_VECTOR:${vectorId}`
  );
}


function expectTypeErrorWithPrefix(vectorId, value, expectedErrorPrefix) {
  let caught =
    null;

  try {
    H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
      .canonicalize(value);
  } catch (error) {
    caught =
      error;
  }

  assert(
    caught instanceof TypeError,
    `REJECTION_VECTOR_DID_NOT_THROW_TYPEERROR:${vectorId}`,
    freeze({
      actualClass:
        caught && caught.constructor
          ? caught.constructor.name
          : null,
      actualMessage:
        caught && caught.message
          ? caught.message
          : null
    })
  );

  assert(
    caught.message.startsWith(expectedErrorPrefix),
    `REJECTION_VECTOR_WRONG_ERROR_PREFIX:${vectorId}`,
    freeze({
      expectedErrorPrefix,
      actualMessage:
        caught.message
    })
  );

  return freeze({
    vectorId,
    expectedErrorPrefix,
    actualMessage:
      caught.message,
    errorClass:
      'TypeError'
  });
}


function runContractIdentityChecks() {
  return freeze([
    runCheck(
      'CONTRACT_ID_MATCHES',
      () => {
        assert(
          H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CONTRACT_ID ===
            H_EARTH_SERIALIZATION_VECTOR_RUNNER_EXPECTED_STEP_012I_CONTRACT_ID,
          'STEP_012I_CONTRACT_ID_MISMATCH'
        );

        assert(
          H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW.contractId ===
            H_EARTH_SERIALIZATION_VECTOR_RUNNER_EXPECTED_STEP_012I_CONTRACT_ID,
          'STEP_012I_AGGREGATE_CONTRACT_ID_MISMATCH'
        );

        return freeze({
          importedContractId:
            H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CONTRACT_ID,
          aggregateContractId:
            H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW.contractId
        });
      }
    ),

    runCheck(
      'CANONICALIZATION_ID_MATCHES',
      () => {
        assert(
          H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID ===
            H_EARTH_SERIALIZATION_VECTOR_RUNNER_EXPECTED_CANONICALIZATION_ID,
          'STEP_012I_CANONICALIZATION_ID_MISMATCH'
        );

        assert(
          H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW.canonicalizationId ===
            H_EARTH_SERIALIZATION_VECTOR_RUNNER_EXPECTED_CANONICALIZATION_ID,
          'STEP_012I_AGGREGATE_CANONICALIZATION_ID_MISMATCH'
        );

        return freeze({
          importedCanonicalizationId:
            H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID,
          aggregateCanonicalizationId:
            H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW.canonicalizationId
        });
      }
    ),

    runCheck(
      'INTERFACE_SURFACE_PRESENT',
      () => {
        const law =
          H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW;

        assert(
          law.referenceVectors &&
            typeof law.referenceVectors === 'object',
          'REFERENCE_VECTORS_MISSING'
        );

        assert(
          typeof law.canonicalize === 'function',
          'CANONICALIZE_FUNCTION_MISSING'
        );

        assert(
          typeof law.encodeUtf8 === 'function',
          'ENCODE_UTF8_FUNCTION_MISSING'
        );

        assert(
          typeof law.sha256Bytes === 'function',
          'SHA256_BYTES_FUNCTION_MISSING'
        );

        assert(
          typeof law.sha256Text === 'function',
          'SHA256_TEXT_FUNCTION_MISSING'
        );

        assert(
          typeof law.createEvidenceRecord === 'function',
          'CREATE_EVIDENCE_RECORD_FUNCTION_MISSING'
        );

        assert(
          typeof law.compareEvidenceRecords === 'function',
          'COMPARE_EVIDENCE_RECORDS_FUNCTION_MISSING'
        );

        assert(
          typeof law.createSnapshotEnvelope === 'function',
          'CREATE_SNAPSHOT_ENVELOPE_FUNCTION_MISSING'
        );

        assert(
          typeof law.createSnapshotRecord === 'function',
          'CREATE_SNAPSHOT_RECORD_FUNCTION_MISSING'
        );

        return freeze({
          referenceVectors:
            true,
          canonicalize:
            true,
          encodeUtf8:
            true,
          sha256Bytes:
            true,
          sha256Text:
            true,
          createEvidenceRecord:
            true,
          compareEvidenceRecords:
            true,
          createSnapshotEnvelope:
            true,
          createSnapshotRecord:
            true
        });
      }
    )
  ]);
}


function runPositiveVectorChecks() {
  const vectors =
    H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
      .referenceVectors
      .positiveVectors;

  assert(
    Array.isArray(vectors),
    'POSITIVE_VECTORS_NOT_ARRAY'
  );

  return freeze(
    vectors.map(
      (vector) =>
        runCheck(
          `POSITIVE_VECTOR:${vector.vectorId}`,
          () => {
            assertString(
              vector.vectorId,
              'POSITIVE_VECTOR_ID_MISSING'
            );

            assertString(
              vector.expectedCanonicalText,
              `POSITIVE_VECTOR_EXPECTED_TEXT_MISSING:${vector.vectorId}`
            );

            const actualCanonicalText =
              H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
                .canonicalize(vector.input);

            assert(
              actualCanonicalText === vector.expectedCanonicalText,
              `POSITIVE_VECTOR_CANONICAL_TEXT_MISMATCH:${vector.vectorId}`,
              freeze({
                expected:
                  vector.expectedCanonicalText,
                actual:
                  actualCanonicalText
              })
            );

            const evidence =
              H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
                .createEvidenceRecord(vector.input);

            assert(
              evidence.canonicalText === vector.expectedCanonicalText,
              `POSITIVE_VECTOR_EVIDENCE_TEXT_MISMATCH:${vector.vectorId}`
            );

            assertHexDigest(
              evidence.digestHex,
              `POSITIVE_VECTOR_DIGEST_NOT_HEX:${vector.vectorId}`
            );

            return freeze({
              vectorId:
                vector.vectorId,
              canonicalText:
                actualCanonicalText,
              canonicalTextLength:
                evidence.canonicalTextLength,
              canonicalUtf8ByteLength:
                evidence.canonicalUtf8ByteLength,
              digestHex:
                evidence.digestHex
            });
          }
        )
    )
  );
}


function runRawSha256KnownAnswerChecks() {
  return freeze([
    runCheck(
      'RAW_SHA256_ABC',
      () => {
        const digest =
          H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
            .sha256Bytes(bytesFromAscii('abc'));

        assert(
          digest ===
            'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
          'RAW_SHA256_ABC_DIGEST_MISMATCH',
          freeze({
            actual:
              digest
          })
        );

        return freeze({
          inputKind:
            'RAW_UTF8_BYTES',
          inputText:
            'abc',
          byteLength:
            3,
          digestHex:
            digest
        });
      }
    ),

    runCheck(
      'SHA256_REJECTS_ARRAY_LIKE_STRING',
      () => {
        let caught =
          null;

        try {
          H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
            .sha256Bytes('abc');
        } catch (error) {
          caught =
            error;
        }

        assert(
          caught instanceof TypeError,
          'SHA256_STRING_INPUT_DID_NOT_THROW_TYPEERROR'
        );

        assert(
          caught.message.startsWith(
            'SHA256_UINT8ARRAY_REQUIRED'
          ),
          'SHA256_STRING_INPUT_WRONG_ERROR_PREFIX',
          freeze({
            actualMessage:
              caught.message
          })
        );

        return freeze({
          rejectedInputClass:
            'String',
          expectedErrorPrefix:
            'SHA256_UINT8ARRAY_REQUIRED',
          actualMessage:
            caught.message,
          errorClass:
            'TypeError'
        });
      }
    )
  ]);
}


function runCanonicalPipelineDigestChecks() {
  return freeze([
    runCheck(
      'CANONICAL_PIPELINE_STRING_ABC',
      () => {
        const canonicalText =
          H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
            .canonicalize('abc');

        assert(
          canonicalText === '"abc"',
          'CANONICAL_STRING_ABC_TEXT_MISMATCH'
        );

        const digest =
          H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
            .sha256Text(canonicalText);

        assert(
          digest ===
            '6cc43f858fbb763301637b5af970e2a46b46f461f27e5a0f41e009c59b827b25',
          'CANONICAL_STRING_ABC_DIGEST_MISMATCH',
          freeze({
            canonicalText,
            actualDigest:
              digest
          })
        );

        return freeze({
          inputKind:
            'CANONICAL_JSON_TEXT',
          canonicalText,
          canonicalTextLength:
            canonicalText.length,
          canonicalUtf8ByteLength:
            H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
              .encodeUtf8(canonicalText)
              .length,
          digestHex:
            digest
        });
      }
    ),

    runCheck(
      'CANONICAL_PIPELINE_OBJECT_PROPERTY_ORDER',
      () => {
        const evidence =
          H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
            .createEvidenceRecord({ b: 2, a: 1 });

        assert(
          evidence.canonicalText === '{"a":1,"b":2}',
          'CANONICAL_OBJECT_TEXT_MISMATCH'
        );

        assert(
          evidence.digestHex ===
            '43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777',
          'CANONICAL_OBJECT_DIGEST_MISMATCH',
          freeze({
            actualDigest:
              evidence.digestHex
          })
        );

        return freeze({
          canonicalText:
            evidence.canonicalText,
          canonicalTextLength:
            evidence.canonicalTextLength,
          canonicalUtf8ByteLength:
            evidence.canonicalUtf8ByteLength,
          digestHex:
            evidence.digestHex
        });
      }
    ),

    runCheck(
      'CANONICAL_PIPELINE_UTF8_MULTIBYTE_LENGTH',
      () => {
        const evidence =
          H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
            .createEvidenceRecord({
              label:
                'H-Earth π'
            });

        assert(
          evidence.canonicalText === '{"label":"H-Earth π"}',
          'CANONICAL_UTF8_MULTIBYTE_TEXT_MISMATCH'
        );

        assert(
          evidence.canonicalTextLength === 21,
          'CANONICAL_UTF8_MULTIBYTE_TEXT_LENGTH_MISMATCH',
          freeze({
            actual:
              evidence.canonicalTextLength
          })
        );

        assert(
          evidence.canonicalUtf8ByteLength === 22,
          'CANONICAL_UTF8_MULTIBYTE_BYTE_LENGTH_MISMATCH',
          freeze({
            actual:
              evidence.canonicalUtf8ByteLength
          })
        );

        assert(
          evidence.digestHex ===
            'c8c63ab4db8aca2d9f6863cc1cc2efd5e58b9beb95594fb533b5aa8f92ce8d02',
          'CANONICAL_UTF8_MULTIBYTE_DIGEST_MISMATCH',
          freeze({
            actualDigest:
              evidence.digestHex
          })
        );

        return freeze({
          canonicalText:
            evidence.canonicalText,
          canonicalTextLength:
            evidence.canonicalTextLength,
          canonicalUtf8ByteLength:
            evidence.canonicalUtf8ByteLength,
          digestHex:
            evidence.digestHex
        });
      }
    )
  ]);
}


function runRejectionVectorChecks() {
  const vectorIds =
    H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
      .referenceVectors
      .rejectionVectors;

  assert(
    Array.isArray(vectorIds),
    'REJECTION_VECTORS_NOT_ARRAY'
  );

  return freeze(
    vectorIds.map(
      (vectorId) =>
        runCheck(
          `REJECTION_VECTOR:${vectorId}`,
          () => {
            const rejectionCase =
              createRejectionCase(vectorId);

            const result =
              expectTypeErrorWithPrefix(
                vectorId,
                rejectionCase.value,
                rejectionCase.expectedErrorPrefix
              );

            if (
              typeof rejectionCase.getGetterExecuted === 'function'
            ) {
              assert(
                rejectionCase.getGetterExecuted() === false,
                `ACCESSOR_GETTER_EXECUTED:${vectorId}`
              );
            }

            return result;
          }
        )
    )
  );
}


function runAccessorNonExecutionChecks() {
  return freeze([
    runCheck(
      'ACCESSOR_OBJECT_GETTER_NOT_EXECUTED',
      () => {
        const rejectionCase =
          createRejectionCase('accessorProperty');

        const result =
          expectTypeErrorWithPrefix(
            'accessorProperty',
            rejectionCase.value,
            rejectionCase.expectedErrorPrefix
          );

        assert(
          rejectionCase.getGetterExecuted() === false,
          'ACCESSOR_OBJECT_GETTER_EXECUTED'
        );

        return result;
      }
    ),

    runCheck(
      'ACCESSOR_ARRAY_GETTER_NOT_EXECUTED',
      () => {
        const rejectionCase =
          createRejectionCase('accessorArrayEntry');

        const result =
          expectTypeErrorWithPrefix(
            'accessorArrayEntry',
            rejectionCase.value,
            rejectionCase.expectedErrorPrefix
          );

        assert(
          rejectionCase.getGetterExecuted() === false,
          'ACCESSOR_ARRAY_GETTER_EXECUTED'
        );

        return result;
      }
    )
  ]);
}


function runBehavioralVectorChecks() {
  const law =
    H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW;

  return freeze([
    runCheck(
      'BEHAVIORAL:snapshotCallerMutationDoesNotChangeStoredEvidence',
      () => {
        const committedState =
          {
            value:
              1
          };

        const orderedIntentIds =
          [
            'CELL_INGRESS',
            'INSPECT_GROUND'
          ];

        const envelope =
          law.createSnapshotEnvelope({
            canonicalizationId:
              H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID,

            runtimeContractId:
              'H_EARTH_DETERMINISTIC_RUNTIME_FILE_RENEWAL_STEP_012G_TARGET_002_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

            replayContractId:
              'H_EARTH_CANONICAL_REPLAY_FILE_RENEWAL_STEP_012G_TARGET_003_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

            stateSchemaId:
              'H_EARTH_STATE_CLASSIFICATION_FILE_RENEWAL_STEP_012G_RUNTIME_KERNEL_DEPENDENCY_REVIEW_v1',

            worldUnitId:
              'H_EARTH_GROUND_CELL_001',

            initialStateId:
              'H_EARTH_INITIAL_STATE_VECTOR_001',

            tick:
              0,

            orderedIntentIds,

            committedState
          });

        const record =
          law.createSnapshotRecord(envelope);

        const storedDigestBefore =
          record.digest.value;

        const storedValueBefore =
          record.snapshot.committedState.value;

        committedState.value =
          2;

        orderedIntentIds.push(
          'MUTATED_AFTER_RECORD'
        );

        assert(
          record.snapshot.committedState.value === storedValueBefore,
          'SNAPSHOT_STORED_STATE_MUTATED_AFTER_CALLER_MUTATION'
        );

        assert(
          record.snapshot.orderedIntentIds.length === 2,
          'SNAPSHOT_STORED_INTENTS_MUTATED_AFTER_CALLER_MUTATION'
        );

        assert(
          record.digest.value === storedDigestBefore,
          'SNAPSHOT_DIGEST_MUTATED_AFTER_CALLER_MUTATION'
        );

        assertHexDigest(
          record.digest.value,
          'SNAPSHOT_DIGEST_NOT_HEX'
        );

        return freeze({
          storedValueBefore,
          storedValueAfter:
            record.snapshot.committedState.value,
          callerValueAfter:
            committedState.value,
          storedIntentCountAfter:
            record.snapshot.orderedIntentIds.length,
          callerIntentCountAfter:
            orderedIntentIds.length,
          digestHex:
            record.digest.value
        });
      }
    ),

    runCheck(
      'BEHAVIORAL:evidenceProfileMismatchRejected',
      () => {
        const first =
          law.createEvidenceRecord({
            a:
              1
          });

        const second =
          freeze({
            canonicalizationId:
              'FORGED_CANONICALIZATION_ID',

            primitiveSerializationProfile:
              first.primitiveSerializationProfile,

            canonicalText:
              first.canonicalText,

            canonicalTextLength:
              first.canonicalTextLength,

            canonicalUtf8ByteLength:
              first.canonicalUtf8ByteLength,

            digestAlgorithm:
              first.digestAlgorithm,

            digestHex:
              first.digestHex
          });

        const comparison =
          law.compareEvidenceRecords(
            first,
            second
          );

        assert(
          comparison.digestEqual === true,
          'PROFILE_MISMATCH_TEST_DIGEST_NOT_EQUAL'
        );

        assert(
          comparison.canonicalTextEqual === true,
          'PROFILE_MISMATCH_TEST_TEXT_NOT_EQUAL'
        );

        assert(
          comparison.secondProfileMatchesLaw === false,
          'PROFILE_MISMATCH_NOT_DETECTED'
        );

        assert(
          comparison.canonicalEvidenceEqual === false,
          'PROFILE_MISMATCH_DID_NOT_BLOCK_CANONICAL_EVIDENCE_EQUAL'
        );

        return freeze(comparison);
      }
    )
  ]);
}


function summarizeChecks(checks) {
  const passed =
    checks.filter((check) => check.ok === true).length;

  const failed =
    checks.length - passed;

  return freeze({
    total:
      checks.length,
    passed,
    failed
  });
}


function projectCheckForRepeatComparison(check) {
  return freeze({
    checkId:
      check.checkId,

    ok:
      check.ok,

    result:
      check.ok ? check.result : null,

    errorClass:
      check.ok ? null : check.errorClass,

    errorMessage:
      check.ok ? null : check.errorMessage
  });
}


function projectChecksForRepeatComparison(checks) {
  return freeze(
    checks.map(projectCheckForRepeatComparison)
  );
}


function stableEvidenceForRepeatComparison(runResult) {
  return freeze({
    contractIdentityChecks:
      projectChecksForRepeatComparison(
        runResult.contractIdentityChecks
      ),

    positiveVectorChecks:
      projectChecksForRepeatComparison(
        runResult.positiveVectorChecks
      ),

    rawSha256KnownAnswerChecks:
      projectChecksForRepeatComparison(
        runResult.rawSha256KnownAnswerChecks
      ),

    canonicalPipelineDigestChecks:
      projectChecksForRepeatComparison(
        runResult.canonicalPipelineDigestChecks
      ),

    rejectionVectorChecks:
      projectChecksForRepeatComparison(
        runResult.rejectionVectorChecks
      ),

    accessorNonExecutionChecks:
      projectChecksForRepeatComparison(
        runResult.accessorNonExecutionChecks
      ),

    behavioralVectorChecks:
      projectChecksForRepeatComparison(
        runResult.behavioralVectorChecks
      )
  });
}


function stableSummaryForRepeatComparison(runResult) {
  return freeze({
    contractIdentity:
      summarizeChecks(runResult.contractIdentityChecks),

    positiveVectors:
      summarizeChecks(runResult.positiveVectorChecks),

    rawSha256:
      summarizeChecks(runResult.rawSha256KnownAnswerChecks),

    canonicalPipeline:
      summarizeChecks(runResult.canonicalPipelineDigestChecks),

    rejectionVectors:
      summarizeChecks(runResult.rejectionVectorChecks),

    accessorNonExecution:
      summarizeChecks(runResult.accessorNonExecutionChecks),

    behavioralVectors:
      summarizeChecks(runResult.behavioralVectorChecks)
  });
}


function runSingleSerializationVectorCorridor(runLabel) {
  const contractIdentityChecks =
    runContractIdentityChecks();

  const positiveVectorChecks =
    runPositiveVectorChecks();

  const rawSha256KnownAnswerChecks =
    runRawSha256KnownAnswerChecks();

  const canonicalPipelineDigestChecks =
    runCanonicalPipelineDigestChecks();

  const rejectionVectorChecks =
    runRejectionVectorChecks();

  const accessorNonExecutionChecks =
    runAccessorNonExecutionChecks();

  const behavioralVectorChecks =
    runBehavioralVectorChecks();

  assertAllChecksPassed(
    `${runLabel}:CONTRACT_IDENTITY`,
    contractIdentityChecks
  );

  assertAllChecksPassed(
    `${runLabel}:POSITIVE_VECTORS`,
    positiveVectorChecks
  );

  assertAllChecksPassed(
    `${runLabel}:RAW_SHA256_KNOWN_ANSWER`,
    rawSha256KnownAnswerChecks
  );

  assertAllChecksPassed(
    `${runLabel}:CANONICAL_PIPELINE_DIGEST`,
    canonicalPipelineDigestChecks
  );

  assertAllChecksPassed(
    `${runLabel}:REJECTION_VECTORS`,
    rejectionVectorChecks
  );

  assertAllChecksPassed(
    `${runLabel}:ACCESSOR_NON_EXECUTION`,
    accessorNonExecutionChecks
  );

  assertAllChecksPassed(
    `${runLabel}:BEHAVIORAL_VECTORS`,
    behavioralVectorChecks
  );

  return freeze({
    runLabel,
    contractIdentityChecks,
    positiveVectorChecks,
    rawSha256KnownAnswerChecks,
    canonicalPipelineDigestChecks,
    rejectionVectorChecks,
    accessorNonExecutionChecks,
    behavioralVectorChecks
  });
}


function compareRepeatedCorridorResults(firstRun, secondRun) {
  const firstSummary =
    stableSummaryForRepeatComparison(firstRun);

  const secondSummary =
    stableSummaryForRepeatComparison(secondRun);

  const firstEvidence =
    stableEvidenceForRepeatComparison(firstRun);

  const secondEvidence =
    stableEvidenceForRepeatComparison(secondRun);

  const firstEvidenceCanonicalText =
    H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
      .canonicalize(firstEvidence);

  const secondEvidenceCanonicalText =
    H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
      .canonicalize(secondEvidence);

  const evidenceEqual =
    firstEvidenceCanonicalText ===
    secondEvidenceCanonicalText;

  return freeze({
    repeatedVectorRunResultsEqual:
      evidenceEqual,

    repeatedVectorRunSummariesEqual:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
        .canonicalize(firstSummary) ===
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW
        .canonicalize(secondSummary),

    comparisonMethod:
      'STEP_012I_CANONICALIZE_STABLE_PROJECTED_RESULT_EVIDENCE',

    firstSummary,

    secondSummary,

    firstEvidenceCanonicalText,

    secondEvidenceCanonicalText
  });
}


export function runHEarthSerializationVectorRunner(options = {}) {
  assertRunnerOptions(options);

  const runId =
    options.runId ||
    'H_EARTH_STEP_012I_SERIALIZATION_VECTOR_RUN_001';

  const firstRun =
    runSingleSerializationVectorCorridor('RUN_001');

  const secondRun =
    runSingleSerializationVectorCorridor('RUN_002');

  const repeatedComparison =
    compareRepeatedCorridorResults(
      firstRun,
      secondRun
    );

  assert(
    repeatedComparison.repeatedVectorRunResultsEqual === true,
    'REPEATED_VECTOR_RUN_RESULTS_NOT_EQUAL',
    repeatedComparison
  );

  const firstSummary =
    stableSummaryForRepeatComparison(firstRun);

  const secondSummary =
    stableSummaryForRepeatComparison(secondRun);

  return freeze({
    receiptType:
      'H_EARTH_SERIALIZATION_VECTOR_RUNNER_EXECUTION_RECEIPT',

    receiptId:
      `${runId}_RECEIPT`,

    runnerContractId:
      H_EARTH_SERIALIZATION_VECTOR_RUNNER_CONTRACT_ID,

    step012IContractId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CONTRACT_ID,

    step012ICanonicalizationId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID,

    status:
      'STEP_012I_REFERENCE_VECTOR_EXECUTION_CORRIDOR_PASS',

    runId,

    executionWasRequestedByFunctionCall:
      true,

    executionAtModuleLoad:
      false,

    step012IImportResolutionObserved:
      true,

    step012IModuleEvaluationObserved:
      true,

    positiveReferenceVectorsPassed:
      firstSummary.positiveVectors.failed === 0,

    rejectionReferenceVectorsPassed:
      firstSummary.rejectionVectors.failed === 0,

    behavioralReferenceVectorsPassed:
      firstSummary.behavioralVectors.failed === 0,

    accessorBodiesNotExecuted:
      firstSummary.accessorNonExecution.failed === 0,

    utf8LengthEvidenceObserved:
      true,

    sha256KnownAnswerTestsPassed:
      firstSummary.rawSha256.failed === 0,

    canonicalJsonPipelineDigestTestsPassed:
      firstSummary.canonicalPipeline.failed === 0,

    repeatedVectorRunResultsEqual:
      repeatedComparison.repeatedVectorRunResultsEqual,

    repeatedVectorRunSummariesEqual:
      repeatedComparison.repeatedVectorRunSummariesEqual,

    firstRunSummary:
      firstSummary,

    secondRunSummary:
      secondSummary,

    repeatedComparison,

    detailedRuns:
      freeze({
        firstRun,
        secondRun
      }),

    corridorBoundary:
      freeze({
        step012IOnly:
          true,

        fullRuntimeImportGraphVerified:
          false,

        target003Executed:
          false,

        step012HExecuted:
          false,

        hEarthRuntimeExecuted:
          false,

        worldStateCreated:
          false,

        intentAdmitted:
          false,

        tickCommitted:
          false,

        replayExecuted:
          false,

        replayComparisonCompleted:
          false,

        replayEqualityProven:
          false,

        validationClaim:
          false,

        productionClaim:
          false,

        deploymentClaim:
          false,

        visualPassClaim:
          false,

        matrixCollapse:
          false
      }),

    finalClaimCeiling:
      freeze({
        step012IImportResolutionObserved:
          true,

        step012IModuleEvaluationObserved:
          true,

        fullRuntimeImportGraphVerified:
          false,

        target003Executed:
          false,

        step012HExecuted:
          false,

        hEarthRuntimeExecuted:
          false,

        worldStateCreated:
          false,

        intentAdmitted:
          false,

        tickCommitted:
          false,

        replayExecuted:
          false,

        replayEqualityProven:
          false,

        validationClaim:
          false,

        productionClaim:
          false,

        deploymentClaim:
          false,

        visualPassClaim:
          false,

        matrixCollapse:
          false
      })
  });
}


export function getHEarthSerializationVectorRunnerAuthority() {
  return H_EARTH_SERIALIZATION_VECTOR_RUNNER_AUTHORITY;
}


export function getHEarthSerializationVectorRunnerDescriptor() {
  return H_EARTH_SERIALIZATION_VECTOR_RUNNER;
}


export const H_EARTH_SERIALIZATION_VECTOR_RUNNER =
  freeze({
    id:
      'H_EARTH_SERIALIZATION_VECTOR_RUNNER',

    file:
      '/h-earth-3d/runtime/tests/h-earth.serialization-vector-runner.js',

    contractId:
      H_EARTH_SERIALIZATION_VECTOR_RUNNER_CONTRACT_ID,

    expectedStep012IContractId:
      H_EARTH_SERIALIZATION_VECTOR_RUNNER_EXPECTED_STEP_012I_CONTRACT_ID,

    expectedStep012ICanonicalizationId:
      H_EARTH_SERIALIZATION_VECTOR_RUNNER_EXPECTED_CANONICALIZATION_ID,

    authority:
      H_EARTH_SERIALIZATION_VECTOR_RUNNER_AUTHORITY,

    importedStep012IContractId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CONTRACT_ID,

    importedStep012ICanonicalizationId:
      H_EARTH_CANONICAL_STATE_SERIALIZATION_LAW_CANONICALIZATION_ID,

    run:
      runHEarthSerializationVectorRunner,

    mode:
      'STEP_012I_REFERENCE_VECTOR_EXECUTION_CORRIDOR_ONLY',

    importsStep012IOnly:
      true,

    runnerFunctionDefinedHere:
      true,

    runnerExecutedAtModuleLoad:
      false,

    vectorExecutionAtModuleLoad:
      false,

    target003ImportAuthorized:
      false,

    step012HImportAuthorized:
      false,

    deterministicRuntimeImportAuthorized:
      false,

    stateBridgeImportAuthorized:
      false,

    rendererImportAuthorized:
      false,

    routeImportAuthorized:
      false,

    persistenceImportAuthorized:
      false,

    fullRuntimeImportGraphVerified:
      false,

    target003Executed:
      false,

    step012HExecuted:
      false,

    hEarthRuntimeExecuted:
      false,

    worldStateCreated:
      false,

    intentAdmitted:
      false,

    tickCommitted:
      false,

    replayExecuted:
      false,

    replayEqualityProven:
      false,

    validationClaim:
      false,

    productionClaim:
      false,

    deploymentClaim:
      false,

    visualPassClaim:
      false,

    matrixCollapse:
      false,

    finalMarker:
      'export default H_EARTH_SERIALIZATION_VECTOR_RUNNER;'
  });


export default H_EARTH_SERIALIZATION_VECTOR_RUNNER;
