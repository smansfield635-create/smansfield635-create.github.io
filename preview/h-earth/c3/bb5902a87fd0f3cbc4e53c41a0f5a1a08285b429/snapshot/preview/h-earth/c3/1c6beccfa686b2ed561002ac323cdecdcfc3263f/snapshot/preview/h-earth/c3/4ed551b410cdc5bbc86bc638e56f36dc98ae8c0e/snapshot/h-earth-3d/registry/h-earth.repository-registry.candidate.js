/**
 * H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_SCHEMA_AND_INSTANCE_v1
 *
 * TARGET:
 * Target 2 · Repository registry candidate schema.
 *
 * STATUS:
 * Complete candidate.
 * Not canonical.
 * Not an accepted registry occurrence.
 * Not a GitHub tool instruction.
 * Not an installed validator.
 * Not workflow enforcement.
 *
 * SOURCE BASIS:
 * H_EARTH_REPOSITORY_REGISTRY_SPECIFICATION_v1
 * Google Drive document: 1qPSg6mtYRCl0vYJcbRj-KJ6NAByMuu7eq17I1Rzsfso
 * Revision: AIroW35hpXMJo_ouHfUJwTmDdfDsajezM-2v_HDEiNouHXSPm9ILmtYTR0q6kC6AXYzVqDQH2-hUE1-nLAc-MUXeWH3iY9VkmmxlWhqfIwA
 *
 * H_EARTH_MANIFEST_FILE_RENEWAL_RECURSIVE_CARDINAL_AUTHORITY_ARCHITECTURE_v2
 * Google Drive document: 155ppisGVWsxZnohd8BtwrQeAs3QOJ9LUJgmnqQEmolE
 *
 * NON-MUTATION BOUNDARY:
 * This artifact does not mutate the manifest, GitHub repository, source files,
 * contracts, imports, call order, branches, pull requests, workflows, validators,
 * route, runtime, renderer, deployment, production state, or merge authority.
 */

function deepFreeze(value) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }

  return Object.freeze(value);
}



export const H_EARTH_REPOSITORY_REGISTRY_TARGET_2_IDENTITY = deepFreeze(
{
  "artifactId": "H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_SCHEMA_AND_INSTANCE_v1",
  "artifactClass": "COMPLETE_CANDIDATE_REPOSITORY_REGISTRY_SCHEMA_PACKAGE",
  "targetNumber": 2,
  "targetName": "REPOSITORY_REGISTRY_CANDIDATE_SCHEMA",
  "project": "H_EARTH",
  "repository": "smansfield635-create/smansfield635-create.github.io",
  "artifactStatus": "COMPLETE_CANDIDATE_NOT_CANONICAL",
  "schemaId": "H_EARTH_REPOSITORY_REGISTRY_SCHEMA_v1",
  "schemaVersion": 1,
  "schemaDraft": "JSON_SCHEMA_DRAFT_2020_12",
  "candidateRegistryId": "H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_v1",
  "candidateRegistryVersion": "1.0.0-candidate.1",
  "candidateRegistryStatus": "COMPLETE_CANDIDATE_NOT_ACCEPTED",
  "userAcceptanceStatus": "NOT_YET_REQUESTED",
  "sourceSpecificationId": "H_EARTH_REPOSITORY_REGISTRY_SPECIFICATION_v1",
  "sourceSpecificationDocumentId": "1qPSg6mtYRCl0vYJcbRj-KJ6NAByMuu7eq17I1Rzsfso",
  "sourceSpecificationRevisionId": "AIroW35hpXMJo_ouHfUJwTmDdfDsajezM-2v_HDEiNouHXSPm9ILmtYTR0q6kC6AXYzVqDQH2-hUE1-nLAc-MUXeWH3iY9VkmmxlWhqfIwA",
  "sourceManifestContract": "H_EARTH_MANIFEST_FILE_RENEWAL_RECURSIVE_CARDINAL_AUTHORITY_ARCHITECTURE_v2",
  "sourceManifestDocumentId": "155ppisGVWsxZnohd8BtwrQeAs3QOJ9LUJgmnqQEmolE"
}
);


export const H_EARTH_REPOSITORY_REGISTRY_TARGET_2_BOUNDARY = deepFreeze(
{
  "manifestMutation": false,
  "manifestRenewal": false,
  "githubMutation": false,
  "repositorySourceMutation": false,
  "acceptedRegistryOccurrenceCreated": false,
  "canonicalRegistryCreated": false,
  "candidateSchemaCreated": true,
  "candidateRegistryInstanceCreated": true,
  "failureFixturesCreated": true,
  "localSchemaValidationExecuted": true,
  "localSemanticValidationExecuted": true,
  "localFailureFixtureExecutionPerformed": true,
  "githubToolInstructionCreated": false,
  "validatorInstalled": false,
  "workflowCreated": false,
  "workflowEnforcementCreated": false,
  "mergeAuthorityCreated": false,
  "productionClaimCreated": false
}
);


export const H_EARTH_REPOSITORY_REGISTRY_SCHEMA = deepFreeze(
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:h-earth:repository-registry:schema:H_EARTH_REPOSITORY_REGISTRY_SCHEMA_v1:1",
  "title": "H_EARTH_REPOSITORY_REGISTRY_SCHEMA_v1",
  "description": "Formal candidate schema for the noncanonical H-Earth repository registry.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "registryId",
    "registryVersion",
    "schemaId",
    "schemaVersion",
    "project",
    "repository",
    "scope",
    "status",
    "accepted",
    "serialization",
    "sourceBasis",
    "evidenceRecords",
    "nodes",
    "relations",
    "unresolvedFields"
  ],
  "properties": {
    "registryId": {
      "type": "string",
      "const": "H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_v1"
    },
    "registryVersion": {
      "type": "string",
      "const": "1.0.0-candidate.1"
    },
    "schemaId": {
      "type": "string",
      "const": "H_EARTH_REPOSITORY_REGISTRY_SCHEMA_v1"
    },
    "schemaVersion": {
      "type": "integer",
      "const": 1
    },
    "project": {
      "type": "string",
      "const": "H_EARTH"
    },
    "repository": {
      "type": "string",
      "const": "smansfield635-create/smansfield635-create.github.io"
    },
    "scope": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "scopeId",
        "coverageStatus",
        "declaredUnits",
        "excludedOrDeferredCoverage"
      ],
      "properties": {
        "scopeId": {
          "type": "string",
          "const": "H_EARTH_REPOSITORY_ARCHITECTURE"
        },
        "coverageStatus": {
          "enum": [
            "PARTIAL_INITIAL_COVERAGE",
            "COMPLETE_DECLARED_SCOPE"
          ]
        },
        "declaredUnits": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
          },
          "minItems": 4,
          "uniqueItems": true
        },
        "excludedOrDeferredCoverage": {
          "type": "array",
          "items": {
            "type": "string",
            "minLength": 1
          },
          "uniqueItems": true
        }
      }
    },
    "status": {
      "enum": [
        "DRAFT",
        "COMPLETE_CANDIDATE",
        "AUDITED_CANDIDATE",
        "ACCEPTED",
        "SUPERSEDED",
        "RETIRED"
      ]
    },
    "accepted": {
      "type": "boolean",
      "const": false
    },
    "serialization": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "format",
        "encoding",
        "deterministicKeyOrder",
        "deterministicArrayOrder",
        "digestAlgorithm",
        "digestScope",
        "digestExcludes",
        "contentDigest"
      ],
      "properties": {
        "format": {
          "const": "ECMASCRIPT_MODULE_WITH_EMBEDDED_JSON_SCHEMA_AND_JSON_COMPATIBLE_INSTANCE"
        },
        "encoding": {
          "const": "UTF-8"
        },
        "deterministicKeyOrder": {
          "type": "boolean",
          "const": true
        },
        "deterministicArrayOrder": {
          "type": "boolean",
          "const": true
        },
        "digestAlgorithm": {
          "const": "SHA-256"
        },
        "digestScope": {
          "const": "CANONICAL_JSON_OF_INSTANCE_EXCLUDING_SERIALIZATION_CONTENT_DIGEST"
        },
        "digestExcludes": {
          "type": "array",
          "const": [
            "serialization.contentDigest"
          ]
        },
        "contentDigest": {
          "type": "string",
          "pattern": "^[0-9a-f]{64}$"
        }
      }
    },
    "sourceBasis": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "sourceId",
          "sourceKind",
          "documentOrOccurrenceId",
          "status",
          "limitations"
        ],
        "properties": {
          "sourceId": {
            "type": "string",
            "minLength": 1
          },
          "sourceKind": {
            "enum": [
              "REPOSITORY_FILE",
              "GOOGLE_DRIVE_ARTIFACT",
              "MANIFEST_CONTRACT",
              "USER_SUPPLIED_VERIFICATION",
              "LOCAL_VALIDATION"
            ]
          },
          "documentOrOccurrenceId": {
            "type": "string",
            "minLength": 1
          },
          "status": {
            "type": "string",
            "minLength": 1
          },
          "limitations": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1
            },
            "uniqueItems": true
          }
        }
      },
      "minItems": 2
    },
    "evidenceRecords": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "evidenceId",
          "evidenceClass",
          "sourceKind",
          "sourceIdOrPath",
          "sourceOccurrenceOrRevision",
          "assertionScope",
          "verifiedOn",
          "evidenceLimitations"
        ],
        "properties": {
          "evidenceId": {
            "type": "string",
            "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
          },
          "evidenceClass": {
            "enum": [
              "EXPLICIT_CARDINAL_IDENTITY",
              "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
              "EXISTING_BOUNDARY_RELATION_OBSERVED",
              "UNVERIFIED_ROLE_ASSIGNMENT"
            ]
          },
          "sourceKind": {
            "enum": [
              "REPOSITORY_FILE",
              "GOOGLE_DRIVE_ARTIFACT",
              "MANIFEST_CONTRACT",
              "USER_SUPPLIED_VERIFICATION",
              "LOCAL_VALIDATION"
            ]
          },
          "sourceIdOrPath": {
            "type": "string",
            "minLength": 1
          },
          "sourceOccurrenceOrRevision": {
            "type": "string",
            "minLength": 1
          },
          "assertionScope": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1
            },
            "minItems": 1,
            "uniqueItems": true
          },
          "verifiedOn": {
            "type": "string",
            "format": "date"
          },
          "evidenceLimitations": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1
            },
            "uniqueItems": true
          }
        }
      },
      "minItems": 1
    },
    "nodes": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "nodeId",
          "nodeType",
          "nodeSubtype",
          "displayName",
          "description",
          "repositoryPaths",
          "repositoryOccurrences",
          "evidenceClass",
          "evidenceReferences",
          "authorityClass",
          "authorityPosture",
          "authoritySource",
          "authorityScope",
          "authorityLimitations",
          "parentRelations",
          "childRelations",
          "peerRelations",
          "upstreamBoundaries",
          "downstreamBoundaries",
          "cardinalRole",
          "cardinalStatus",
          "cardinalCompleteness",
          "orderingRules",
          "dependencyRelations",
          "allowedMutationScope",
          "prohibitedMutations",
          "requiredValidations",
          "stoppingBoundaries",
          "currentIdentityReferences",
          "lifecycleStatus",
          "unresolvedFields"
        ],
        "properties": {
          "nodeId": {
            "type": "string",
            "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
          },
          "nodeType": {
            "enum": [
              "FILE",
              "COMPOSITE_UNIT",
              "BOUNDARY_PACKET",
              "FACADE",
              "OCCURRENCE_ROUTE"
            ]
          },
          "nodeSubtype": {
            "type": "string",
            "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
          },
          "displayName": {
            "type": "string",
            "minLength": 1
          },
          "description": {
            "type": "string",
            "minLength": 1
          },
          "repositoryPaths": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^/(?!/)(?!.*//)(?!.*(?:^|/)\\.\\.(?:/|$))[A-Za-z0-9._/-]+$"
            },
            "uniqueItems": true
          },
          "repositoryOccurrences": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "repository",
                "refType",
                "refName",
                "commitSha",
                "path",
                "gitBlobSha",
                "contentSha256",
                "byteCount",
                "existenceStatus",
                "fetchbackStatus",
                "occurrenceClass"
              ],
              "properties": {
                "repository": {
                  "type": "string",
                  "const": "smansfield635-create/smansfield635-create.github.io"
                },
                "refType": {
                  "enum": [
                    "COMMIT",
                    "BRANCH",
                    "TAG",
                    "PULL_REQUEST",
                    "DRIVE_ARTIFACT",
                    "LOCAL_VERIFICATION_ARTIFACT"
                  ]
                },
                "refName": {
                  "type": "string",
                  "minLength": 1
                },
                "commitSha": {
                  "type": [
                    "string",
                    "null"
                  ],
                  "pattern": "^[0-9a-f]{40}$"
                },
                "path": {
                  "type": "string",
                  "pattern": "^/(?!/)(?!.*//)(?!.*(?:^|/)\\.\\.(?:/|$))[A-Za-z0-9._/-]+$"
                },
                "gitBlobSha": {
                  "type": [
                    "string",
                    "null"
                  ],
                  "pattern": "^[0-9a-f]{40}$"
                },
                "contentSha256": {
                  "type": [
                    "string",
                    "null"
                  ],
                  "pattern": "^[0-9a-f]{64}$"
                },
                "byteCount": {
                  "type": [
                    "integer",
                    "null"
                  ],
                  "minimum": 0
                },
                "existenceStatus": {
                  "enum": [
                    "PRESENT",
                    "ABSENT",
                    "UNRESOLVED"
                  ]
                },
                "fetchbackStatus": {
                  "enum": [
                    "VERIFIED",
                    "NOT_PERFORMED",
                    "FAILED",
                    "UNRESOLVED"
                  ]
                },
                "occurrenceClass": {
                  "enum": [
                    "CANONICAL",
                    "ACCEPTED",
                    "CANDIDATE",
                    "HISTORICAL",
                    "SUPERSEDED",
                    "RETIRED",
                    "UNRESOLVED"
                  ]
                }
              },
              "allOf": [
                {
                  "if": {
                    "properties": {
                      "existenceStatus": {
                        "const": "PRESENT"
                      }
                    }
                  },
                  "then": {
                    "properties": {
                      "commitSha": {
                        "type": "string"
                      },
                      "gitBlobSha": {
                        "type": "string"
                      }
                    }
                  }
                }
              ]
            }
          },
          "evidenceClass": {
            "enum": [
              "EXPLICIT_CARDINAL_IDENTITY",
              "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
              "EXISTING_BOUNDARY_RELATION_OBSERVED",
              "UNVERIFIED_ROLE_ASSIGNMENT"
            ]
          },
          "evidenceReferences": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
            },
            "minItems": 1,
            "uniqueItems": true
          },
          "authorityClass": {
            "enum": [
              "SOURCE_AUTHORITY",
              "CONSTRUCTION_AUTHORITY",
              "ADMISSION_AUTHORITY",
              "TRANSFER_OR_CONTINUATION_AUTHORITY",
              "FRAME_AUTHORITY",
              "FACADE_AUTHORITY",
              "ORCHESTRATION_ONLY",
              "CONSUMER_ONLY",
              "AUDIT_ONLY",
              "DIAGNOSTIC_ONLY",
              "SUPPORT_ONLY",
              "NO_AUTHORITY",
              "UNKNOWN_PENDING_SOURCE_AUDIT"
            ]
          },
          "authorityPosture": {
            "type": "string",
            "minLength": 1
          },
          "authoritySource": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1
            },
            "minItems": 1,
            "uniqueItems": true
          },
          "authorityScope": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1
            },
            "minItems": 1,
            "uniqueItems": true
          },
          "authorityLimitations": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1
            },
            "uniqueItems": true
          },
          "parentRelations": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
            },
            "uniqueItems": true
          },
          "childRelations": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
            },
            "uniqueItems": true
          },
          "peerRelations": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
            },
            "uniqueItems": true
          },
          "upstreamBoundaries": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
            },
            "uniqueItems": true
          },
          "downstreamBoundaries": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
            },
            "uniqueItems": true
          },
          "cardinalRole": {
            "enum": [
              "NORTH",
              "SOUTH",
              "WEST",
              "EAST",
              "NONE",
              "UNRESOLVED"
            ]
          },
          "cardinalStatus": {
            "enum": [
              "EXPLICIT",
              "OBSERVED_CANDIDATE",
              "NONE",
              "UNRESOLVED"
            ]
          },
          "cardinalCompleteness": {
            "enum": [
              "COMPLETE",
              "CANDIDATE",
              "NOT_APPLICABLE",
              "UNRESOLVED"
            ]
          },
          "orderingRules": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1
            },
            "uniqueItems": true
          },
          "dependencyRelations": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
            },
            "uniqueItems": true
          },
          "allowedMutationScope": {
            "enum": [
              "WITHHELD",
              "READ_ONLY_INSPECTION",
              "EXPLICIT_PATH_SET_ONLY",
              "REGISTRY_CANDIDATE_ONLY"
            ]
          },
          "prohibitedMutations": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1
            },
            "minItems": 1,
            "uniqueItems": true
          },
          "requiredValidations": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1
            },
            "minItems": 1,
            "uniqueItems": true
          },
          "stoppingBoundaries": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1
            },
            "minItems": 1,
            "uniqueItems": true
          },
          "currentIdentityReferences": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1
            },
            "uniqueItems": true
          },
          "lifecycleStatus": {
            "enum": [
              "ACTIVE",
              "CANDIDATE",
              "HISTORICAL",
              "SUPERSEDED",
              "RETIRED",
              "UNRESOLVED"
            ]
          },
          "unresolvedFields": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1
            },
            "uniqueItems": true
          }
        },
        "allOf": [
          {
            "if": {
              "properties": {
                "nodeType": {
                  "const": "FILE"
                }
              }
            },
            "then": {
              "properties": {
                "repositoryPaths": {
                  "minItems": 1
                },
                "repositoryOccurrences": {
                  "minItems": 1
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "cardinalStatus": {
                  "const": "EXPLICIT"
                }
              }
            },
            "then": {
              "properties": {
                "cardinalRole": {
                  "enum": [
                    "NORTH",
                    "SOUTH",
                    "WEST",
                    "EAST"
                  ]
                },
                "evidenceClass": {
                  "const": "EXPLICIT_CARDINAL_IDENTITY"
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "cardinalStatus": {
                  "const": "OBSERVED_CANDIDATE"
                }
              }
            },
            "then": {
              "properties": {
                "cardinalRole": {
                  "enum": [
                    "NORTH",
                    "SOUTH",
                    "WEST",
                    "EAST"
                  ]
                },
                "evidenceClass": {
                  "const": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE"
                },
                "lifecycleStatus": {
                  "const": "CANDIDATE"
                }
              }
            }
          }
        ]
      },
      "minItems": 1
    },
    "relations": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "relationId",
          "relationType",
          "fromNodeId",
          "toNodeId",
          "scale",
          "direction",
          "evidenceClass",
          "evidenceReferences",
          "order",
          "authorityEffect",
          "continuityEffect",
          "mutationEffect",
          "lifecycleStatus",
          "roleWithinComposite",
          "roleStatus"
        ],
        "properties": {
          "relationId": {
            "type": "string",
            "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
          },
          "relationType": {
            "enum": [
              "CONTAINS",
              "MEMBER_OF",
              "EXPOSES",
              "RESOLVES_INTO",
              "ADMITS_INTO",
              "TRANSFERS_TO",
              "CONTINUES_TO",
              "CONSUMES",
              "DEPENDS_ON",
              "VALIDATED_BY",
              "DIAGNOSED_BY",
              "SUPERSEDES",
              "RETIRES",
              "PEER_OF"
            ]
          },
          "fromNodeId": {
            "type": "string",
            "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
          },
          "toNodeId": {
            "type": "string",
            "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
          },
          "scale": {
            "enum": [
              "MICRO_OPERATION",
              "FILE",
              "CARDINAL_UNIT",
              "PACKET_BOUNDARY",
              "OCCURRENCE",
              "PACKAGE",
              "SYSTEM",
              "REPOSITORY_TOOLING"
            ]
          },
          "direction": {
            "enum": [
              "FROM_TO",
              "BIDIRECTIONAL",
              "NONE"
            ]
          },
          "evidenceClass": {
            "enum": [
              "EXPLICIT_CARDINAL_IDENTITY",
              "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
              "EXISTING_BOUNDARY_RELATION_OBSERVED",
              "UNVERIFIED_ROLE_ASSIGNMENT"
            ]
          },
          "evidenceReferences": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
            },
            "minItems": 1,
            "uniqueItems": true
          },
          "order": {
            "type": [
              "object",
              "null"
            ],
            "additionalProperties": false,
            "required": [
              "group",
              "index"
            ],
            "properties": {
              "group": {
                "type": "string",
                "pattern": "^[A-Z0-9][A-Z0-9._:-]*$"
              },
              "index": {
                "type": "integer",
                "minimum": 1
              }
            }
          },
          "authorityEffect": {
            "type": "string",
            "minLength": 1
          },
          "continuityEffect": {
            "type": "string",
            "minLength": 1
          },
          "mutationEffect": {
            "type": "string",
            "minLength": 1
          },
          "lifecycleStatus": {
            "enum": [
              "ACTIVE",
              "CANDIDATE",
              "HISTORICAL",
              "SUPERSEDED",
              "RETIRED",
              "UNRESOLVED"
            ]
          },
          "roleWithinComposite": {
            "enum": [
              "NORTH",
              "SOUTH",
              "WEST",
              "EAST",
              "NONE",
              "UNRESOLVED"
            ]
          },
          "roleStatus": {
            "enum": [
              "EXPLICIT",
              "OBSERVED_CANDIDATE",
              "NONE",
              "UNRESOLVED"
            ]
          }
        },
        "allOf": [
          {
            "if": {
              "properties": {
                "relationType": {
                  "enum": [
                    "RESOLVES_INTO",
                    "ADMITS_INTO",
                    "TRANSFERS_TO",
                    "CONTINUES_TO",
                    "CONSUMES",
                    "DEPENDS_ON"
                  ]
                }
              }
            },
            "then": {
              "properties": {
                "direction": {
                  "const": "FROM_TO"
                },
                "order": {
                  "type": "object"
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "relationType": {
                  "const": "PEER_OF"
                }
              }
            },
            "then": {
              "properties": {
                "direction": {
                  "const": "BIDIRECTIONAL"
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "roleStatus": {
                  "const": "OBSERVED_CANDIDATE"
                }
              }
            },
            "then": {
              "properties": {
                "roleWithinComposite": {
                  "enum": [
                    "NORTH",
                    "SOUTH",
                    "WEST",
                    "EAST"
                  ]
                },
                "evidenceClass": {
                  "const": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE"
                },
                "lifecycleStatus": {
                  "const": "CANDIDATE"
                }
              }
            }
          },
          {
            "if": {
              "properties": {
                "roleStatus": {
                  "const": "EXPLICIT"
                }
              }
            },
            "then": {
              "properties": {
                "roleWithinComposite": {
                  "enum": [
                    "NORTH",
                    "SOUTH",
                    "WEST",
                    "EAST"
                  ]
                },
                "evidenceClass": {
                  "const": "EXPLICIT_CARDINAL_IDENTITY"
                }
              }
            }
          }
        ]
      },
      "minItems": 1
    },
    "unresolvedFields": {
      "type": "array",
      "items": {
        "type": "string",
        "minLength": 1
      },
      "uniqueItems": true
    }
  }
}
);


export const H_EARTH_REPOSITORY_REGISTRY_SEMANTIC_CONSTRAINTS = deepFreeze(
{
  "crossReferenceRules": [
    "ALL_NODE_RELATION_AND_EVIDENCE_IDS_MUST_BE_UNIQUE",
    "ALL_RELATION_ENDPOINTS_MUST_RESOLVE",
    "ALL_NODE_RELATION_REFERENCES_MUST_RESOLVE",
    "ALL_EVIDENCE_REFERENCES_MUST_RESOLVE",
    "PARENT_CHILD_BOUNDARY_AND_DEPENDENCY_ARRAYS_MUST_BE_RECIPROCAL",
    "CONTAINMENT_MUST_BE_ACYCLIC"
  ],
  "cardinalCompletenessRules": [
    "COMPLETE_CARDINAL_UNIT_REQUIRES_EXPLICIT_NORTH_SOUTH_WEST_AND_EAST_PARTICIPATION",
    "OBSERVED_CARDINAL_ROLES_REMAIN_CANDIDATE",
    "GATE_B_CARDINAL_MAPPING_MUST_NOT_BE_PROMOTED_WITHOUT_DEDICATED_AUDIT",
    "PHYSICAL_FILE_COUNT_IS_NOT_CARDINAL_PROOF",
    "CARDINAL_ROLE_MAY_BE_PARTICIPATION_SCOPED_ON_A_RELATION"
  ],
  "evidenceConstraints": [
    "EVERY_CARDINAL_ROLE_REQUIRES_MATCHING_EVIDENCE_CLASS",
    "EVERY_AUTHORITY_CLAIM_REQUIRES_SOURCE_REFERENCE",
    "TOOL_INFERENCE_IS_NOT_PRIMARY_EVIDENCE",
    "PATH_NAME_OR_DIRECTORY_LOCATION_ALONE_IS_NOT_AUTHORITY_PROOF",
    "STALE_STATUS_MUST_NOT_BE_PRESENTED_AS_CURRENT"
  ],
  "custodyConstraints": [
    "EXACT_IDENTITY_CLAIMS_REQUIRE_COMMIT_AND_BLOB",
    "REPOSITORY_PATHS_MUST_BE_CASE_EXACT_AND_SLASH_NORMALIZED",
    "DRIVE_REPOSITORY_LOCAL_AND_DISTINCT_COMMIT_OCCURRENCES_REMAIN_SEPARATE",
    "ABSENT_AND_UNRESOLVED_REMAIN_DISTINCT",
    "SHARED_PACKET_002_MAIN_AND_GATE_B_OCCURRENCES_MUST_NOT_BE_CONFLATED",
    "CONTENT_SHA256_AND_BYTE_COUNT_MAY_REMAIN_NULL_ONLY_WHEN_EXPLICITLY_UNRESOLVED"
  ],
  "authorityConstraints": [
    "REGISTRY_CREATES_NO_SOURCE_AUTHORITY",
    "COMPOSITE_IDENTITY_DOES_NOT_COLLAPSE_MEMBER_AUTHORITY",
    "FACADE_EXPOSES_AUTHORITY_WITHOUT_INHERITING_IT",
    "BOUNDARY_ADJACENCY_DOES_NOT_TRANSFER_AUTHORITY",
    "GATE_B_ADAPTER_REMAINS_ORCHESTRATION_ONLY",
    "REGISTRY_MEMBERSHIP_DOES_NOT_AUTHORIZE_MUTATION_OR_MERGE"
  ],
  "orderAndStoppingConstraints": [
    "OPERATIONAL_RELATIONS_REQUIRE_EXPLICIT_ORDER_GROUP_AND_INDEX",
    "ARRAY_POSITION_IS_NOT_NORMATIVE_ORDER",
    "CONTINUITY_GAPS_MUST_BE_DECLARED",
    "EVERY_NODE_REQUIRES_AT_LEAST_ONE_STOPPING_BOUNDARY",
    "CONSUMERS_STOP_ON_HIGHER_AUTHORITY_CONFLICT_OR_UNRESOLVED_CRITICAL_FIELD"
  ]
}
);


export const H_EARTH_REPOSITORY_REGISTRY_SEMANTIC_RULE_CATALOG = deepFreeze(
[
  {
    "ruleId": "REGISTRY_UNIQUE_IDENTIFIERS",
    "failureCode": "DUPLICATE_NODE_ID_OR_RELATION_ID",
    "requirement": "Node IDs, relation IDs, and evidence IDs must be unique."
  },
  {
    "ruleId": "REGISTRY_REFERENTIAL_INTEGRITY",
    "failureCode": "BROKEN_REFERENCE",
    "requirement": "All relation endpoints and all evidence and relation references must resolve."
  },
  {
    "ruleId": "REGISTRY_CONTAINMENT_ACYCLIC",
    "failureCode": "CONTAINMENT_CYCLE",
    "requirement": "CONTAINS and MEMBER_OF relations must not form a directed cycle."
  },
  {
    "ruleId": "REGISTRY_FILE_OCCURRENCE_UNIQUENESS",
    "failureCode": "DUPLICATE_FILE_NODE",
    "requirement": "No exact repository, commit, path, and blob occurrence may appear in more than one FILE-like node."
  },
  {
    "ruleId": "REGISTRY_CARDINAL_EVIDENCE",
    "failureCode": "CARDINAL_ROLE_UNSUPPORTED",
    "requirement": "Every explicit or observed cardinal role must have matching evidence posture."
  },
  {
    "ruleId": "REGISTRY_CARDINAL_COMPLETENESS",
    "failureCode": "CARDINAL_UNIT_INCOMPLETE",
    "requirement": "A COMPLETE cardinal unit must contain explicit NORTH, SOUTH, WEST, and EAST participation relations."
  },
  {
    "ruleId": "REGISTRY_OBSERVED_ROLE_NONPROMOTION",
    "failureCode": "OBSERVED_PROMOTED_WITHOUT_AUDIT",
    "requirement": "Observed Gate B cardinal participation must remain candidate and noncanonical."
  },
  {
    "ruleId": "REGISTRY_OPERATIONAL_ORDER",
    "failureCode": "ORDER_UNDECLARED",
    "requirement": "Operational relations must declare an order group and positive index."
  },
  {
    "ruleId": "REGISTRY_AUTHORITY_NONCOLLAPSE",
    "failureCode": "AUTHORITY_COLLAPSE",
    "requirement": "Containment, facade, and boundary relations may not declare authority transfer or inheritance."
  },
  {
    "ruleId": "REGISTRY_ORCHESTRATION_NONPROMOTION",
    "failureCode": "ORCHESTRATION_AUTHORITY_OVERCLAIM",
    "requirement": "The Gate B West adapter must remain ORCHESTRATION_ONLY."
  },
  {
    "ruleId": "REGISTRY_OCCURRENCE_CUSTODY",
    "failureCode": "OCCURRENCE_CLASS_CONFLATION",
    "requirement": "Distinct commit/blob occurrences for the shared Packet 002 path must remain distinct."
  },
  {
    "ruleId": "REGISTRY_DIGEST",
    "failureCode": "DIGEST_IDENTITY_MISMATCH",
    "requirement": "The declared content digest must equal canonical JSON excluding the digest field."
  }
]
);


export const H_EARTH_REPOSITORY_REGISTRY_FAILURE_FIXTURES = deepFreeze(
[
  {
    "fixtureId": "FIXTURE_MISSING_REQUIRED_NODE_ID",
    "purpose": "Prove rejection when a required node field is absent.",
    "operations": [
      {
        "operation": "REMOVE_NODE_FIELD",
        "nodeId": "H_EARTH_ADMITTED_GEOMETRY_FRAME_FILE",
        "field": "nodeId"
      }
    ],
    "recomputeDigestAfterMutation": true,
    "expectedFailureCodes": [
      "MISSING_REQUIRED_FIELD"
    ],
    "expectedValidationLayer": "JSON_SCHEMA"
  },
  {
    "fixtureId": "FIXTURE_DUPLICATE_NODE_ID",
    "purpose": "Prove rejection of duplicate node identity.",
    "operations": [
      {
        "operation": "APPEND_NODE_COPY",
        "nodeId": "H_EARTH_REPOSITORY_ARCHITECTURE"
      }
    ],
    "recomputeDigestAfterMutation": true,
    "expectedFailureCodes": [
      "DUPLICATE_NODE_ID"
    ],
    "expectedValidationLayer": "SEMANTIC"
  },
  {
    "fixtureId": "FIXTURE_DUPLICATE_RELATION_ID",
    "purpose": "Prove rejection of duplicate relation identity.",
    "operations": [
      {
        "operation": "APPEND_RELATION_COPY",
        "relationId": "REL_ROOT_CONTAINS_GEOMETRY_SYSTEM"
      }
    ],
    "recomputeDigestAfterMutation": true,
    "expectedFailureCodes": [
      "DUPLICATE_RELATION_ID"
    ],
    "expectedValidationLayer": "SEMANTIC"
  },
  {
    "fixtureId": "FIXTURE_BROKEN_RELATION_ENDPOINT",
    "purpose": "Prove fail-closed handling of an unresolved relation endpoint.",
    "operations": [
      {
        "operation": "REPLACE_RELATION_FIELD",
        "relationId": "REL_PACKET_002_CONTINUES_TO_ADMITTED_FRAME",
        "field": "toNodeId",
        "value": "H_EARTH_UNKNOWN_NODE"
      }
    ],
    "recomputeDigestAfterMutation": true,
    "expectedFailureCodes": [
      "BROKEN_REFERENCE"
    ],
    "expectedValidationLayer": "SEMANTIC"
  },
  {
    "fixtureId": "FIXTURE_CONTAINMENT_CYCLE",
    "purpose": "Prove rejection of a recursive containment cycle.",
    "operations": [
      {
        "operation": "APPEND_RELATION",
        "value": {
          "relationId": "REL_INVALID_KERNEL_CONTAINS_GEOMETRY_SYSTEM",
          "relationType": "CONTAINS",
          "fromNodeId": "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT",
          "toNodeId": "H_EARTH_GEOMETRY_CONTINUITY_SYSTEM",
          "scale": "SYSTEM",
          "direction": "FROM_TO",
          "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
          "evidenceReferences": [
            "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST"
          ],
          "order": null,
          "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
          "continuityEffect": "INVALID_FIXTURE_CONTAINMENT_CYCLE",
          "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
          "lifecycleStatus": "CANDIDATE",
          "roleWithinComposite": "NONE",
          "roleStatus": "NONE"
        }
      },
      {
        "operation": "APPEND_NODE_ARRAY_VALUE",
        "nodeId": "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT",
        "field": "childRelations",
        "value": "REL_INVALID_KERNEL_CONTAINS_GEOMETRY_SYSTEM"
      },
      {
        "operation": "APPEND_NODE_ARRAY_VALUE",
        "nodeId": "H_EARTH_GEOMETRY_CONTINUITY_SYSTEM",
        "field": "parentRelations",
        "value": "REL_INVALID_KERNEL_CONTAINS_GEOMETRY_SYSTEM"
      }
    ],
    "recomputeDigestAfterMutation": true,
    "expectedFailureCodes": [
      "CONTAINMENT_CYCLE"
    ],
    "expectedValidationLayer": "SEMANTIC"
  },
  {
    "fixtureId": "FIXTURE_GATE_B_OBSERVED_ROLE_PROMOTION",
    "purpose": "Prove that Gate B observed cardinal mapping cannot be promoted without audit.",
    "operations": [
      {
        "operation": "REPLACE_NODE_FIELD",
        "nodeId": "H_EARTH_GATE_B_PHASE_A_FUNCTIONAL_CONTINUITY_UNIT",
        "field": "cardinalCompleteness",
        "value": "COMPLETE"
      },
      {
        "operation": "REPLACE_NODE_FIELD",
        "nodeId": "H_EARTH_GATE_B_PHASE_A_FUNCTIONAL_CONTINUITY_UNIT",
        "field": "lifecycleStatus",
        "value": "ACTIVE"
      }
    ],
    "recomputeDigestAfterMutation": true,
    "expectedFailureCodes": [
      "OBSERVED_PROMOTED_WITHOUT_AUDIT"
    ],
    "expectedValidationLayer": "SEMANTIC"
  },
  {
    "fixtureId": "FIXTURE_GATE_B_ADAPTER_AUTHORITY_OVERCLAIM",
    "purpose": "Prove that orchestration cannot be promoted to admission authority.",
    "operations": [
      {
        "operation": "REPLACE_NODE_FIELD",
        "nodeId": "H_EARTH_GATE_B_WEST_ADAPTER_FILE",
        "field": "authorityClass",
        "value": "ADMISSION_AUTHORITY"
      }
    ],
    "recomputeDigestAfterMutation": true,
    "expectedFailureCodes": [
      "ORCHESTRATION_AUTHORITY_OVERCLAIM"
    ],
    "expectedValidationLayer": "SEMANTIC"
  },
  {
    "fixtureId": "FIXTURE_PACKET_002_OCCURRENCE_CONFLATION",
    "purpose": "Prove that the main and Gate B Packet 002 occurrences remain distinct.",
    "operations": [
      {
        "operation": "REMOVE_REPOSITORY_OCCURRENCE",
        "nodeId": "H_EARTH_PACKET_002_POST_WEST_TRANSFER_FILE",
        "commitSha": "81d6d9e73774f61d298f73a28a1fe01a6f05798f"
      }
    ],
    "recomputeDigestAfterMutation": true,
    "expectedFailureCodes": [
      "OCCURRENCE_CLASS_CONFLATION"
    ],
    "expectedValidationLayer": "SEMANTIC"
  },
  {
    "fixtureId": "FIXTURE_STOPPING_BOUNDARY_MISSING",
    "purpose": "Prove schema rejection when a node has no stopping boundary.",
    "operations": [
      {
        "operation": "REPLACE_NODE_FIELD",
        "nodeId": "H_EARTH_PACKET_001_SOURCE_RESOLUTION_FILE",
        "field": "stoppingBoundaries",
        "value": []
      }
    ],
    "recomputeDigestAfterMutation": true,
    "expectedFailureCodes": [
      "STOPPING_BOUNDARY_MISSING"
    ],
    "expectedValidationLayer": "JSON_SCHEMA"
  },
  {
    "fixtureId": "FIXTURE_OPERATIONAL_ORDER_UNDECLARED",
    "purpose": "Prove schema rejection when an operational relation has no explicit order.",
    "operations": [
      {
        "operation": "REPLACE_RELATION_FIELD",
        "relationId": "REL_GATE_B_ADAPTER_TRANSFERS_TO_PACKET_002",
        "field": "order",
        "value": null
      }
    ],
    "recomputeDigestAfterMutation": true,
    "expectedFailureCodes": [
      "ORDER_UNDECLARED"
    ],
    "expectedValidationLayer": "JSON_SCHEMA"
  },
  {
    "fixtureId": "FIXTURE_DIGEST_MISMATCH",
    "purpose": "Prove semantic rejection of a mismatched instance digest.",
    "operations": [
      {
        "operation": "REPLACE_INSTANCE_FIELD",
        "path": [
          "serialization",
          "contentDigest"
        ],
        "value": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      }
    ],
    "recomputeDigestAfterMutation": false,
    "expectedFailureCodes": [
      "DIGEST_IDENTITY_MISMATCH"
    ],
    "expectedValidationLayer": "SEMANTIC"
  }
]
);


export const H_EARTH_REPOSITORY_REGISTRY_FIXTURE_EXECUTION_RECEIPT = deepFreeze(
{
  "receiptId": "H_EARTH_REPOSITORY_REGISTRY_TARGET_2_LOCAL_FIXTURE_EXECUTION_RECEIPT_v1",
  "executionClass": "LOCAL_EPHEMERAL_SCHEMA_AND_SEMANTIC_VALIDATION",
  "schemaDraft": "2020-12",
  "schemaSyntaxStatus": "PASS",
  "candidateInstanceSchemaStatus": "PASS",
  "candidateInstanceSemanticStatus": "PASS",
  "failureFixtureCount": 11,
  "failureFixturePassCount": 11,
  "failureFixtureFailCount": 0,
  "allFixturesPassed": true,
  "validatorInstallationPerformed": false,
  "workflowInstallationPerformed": false,
  "receipts": [
    {
      "fixtureId": "FIXTURE_MISSING_REQUIRED_NODE_ID",
      "expectedValidationLayer": "JSON_SCHEMA",
      "actualValidationLayer": "JSON_SCHEMA",
      "expectedFailureCodes": [
        "MISSING_REQUIRED_FIELD"
      ],
      "actualFailureCodes": [
        "MISSING_REQUIRED_FIELD"
      ],
      "status": "PASS"
    },
    {
      "fixtureId": "FIXTURE_DUPLICATE_NODE_ID",
      "expectedValidationLayer": "SEMANTIC",
      "actualValidationLayer": "SEMANTIC",
      "expectedFailureCodes": [
        "DUPLICATE_NODE_ID"
      ],
      "actualFailureCodes": [
        "DUPLICATE_NODE_ID"
      ],
      "status": "PASS"
    },
    {
      "fixtureId": "FIXTURE_DUPLICATE_RELATION_ID",
      "expectedValidationLayer": "SEMANTIC",
      "actualValidationLayer": "SEMANTIC",
      "expectedFailureCodes": [
        "DUPLICATE_RELATION_ID"
      ],
      "actualFailureCodes": [
        "DUPLICATE_RELATION_ID"
      ],
      "status": "PASS"
    },
    {
      "fixtureId": "FIXTURE_BROKEN_RELATION_ENDPOINT",
      "expectedValidationLayer": "SEMANTIC",
      "actualValidationLayer": "SEMANTIC",
      "expectedFailureCodes": [
        "BROKEN_REFERENCE"
      ],
      "actualFailureCodes": [
        "BROKEN_REFERENCE"
      ],
      "status": "PASS"
    },
    {
      "fixtureId": "FIXTURE_CONTAINMENT_CYCLE",
      "expectedValidationLayer": "SEMANTIC",
      "actualValidationLayer": "SEMANTIC",
      "expectedFailureCodes": [
        "CONTAINMENT_CYCLE"
      ],
      "actualFailureCodes": [
        "CONTAINMENT_CYCLE"
      ],
      "status": "PASS"
    },
    {
      "fixtureId": "FIXTURE_GATE_B_OBSERVED_ROLE_PROMOTION",
      "expectedValidationLayer": "SEMANTIC",
      "actualValidationLayer": "SEMANTIC",
      "expectedFailureCodes": [
        "OBSERVED_PROMOTED_WITHOUT_AUDIT"
      ],
      "actualFailureCodes": [
        "OBSERVED_PROMOTED_WITHOUT_AUDIT"
      ],
      "status": "PASS"
    },
    {
      "fixtureId": "FIXTURE_GATE_B_ADAPTER_AUTHORITY_OVERCLAIM",
      "expectedValidationLayer": "SEMANTIC",
      "actualValidationLayer": "SEMANTIC",
      "expectedFailureCodes": [
        "ORCHESTRATION_AUTHORITY_OVERCLAIM"
      ],
      "actualFailureCodes": [
        "ORCHESTRATION_AUTHORITY_OVERCLAIM"
      ],
      "status": "PASS"
    },
    {
      "fixtureId": "FIXTURE_PACKET_002_OCCURRENCE_CONFLATION",
      "expectedValidationLayer": "SEMANTIC",
      "actualValidationLayer": "SEMANTIC",
      "expectedFailureCodes": [
        "OCCURRENCE_CLASS_CONFLATION"
      ],
      "actualFailureCodes": [
        "OCCURRENCE_CLASS_CONFLATION"
      ],
      "status": "PASS"
    },
    {
      "fixtureId": "FIXTURE_STOPPING_BOUNDARY_MISSING",
      "expectedValidationLayer": "JSON_SCHEMA",
      "actualValidationLayer": "JSON_SCHEMA",
      "expectedFailureCodes": [
        "STOPPING_BOUNDARY_MISSING"
      ],
      "actualFailureCodes": [
        "STOPPING_BOUNDARY_MISSING"
      ],
      "status": "PASS"
    },
    {
      "fixtureId": "FIXTURE_OPERATIONAL_ORDER_UNDECLARED",
      "expectedValidationLayer": "JSON_SCHEMA",
      "actualValidationLayer": "JSON_SCHEMA",
      "expectedFailureCodes": [
        "ORDER_UNDECLARED"
      ],
      "actualFailureCodes": [
        "ORDER_UNDECLARED"
      ],
      "status": "PASS"
    },
    {
      "fixtureId": "FIXTURE_DIGEST_MISMATCH",
      "expectedValidationLayer": "SEMANTIC",
      "actualValidationLayer": "SEMANTIC",
      "expectedFailureCodes": [
        "DIGEST_IDENTITY_MISMATCH"
      ],
      "actualFailureCodes": [
        "DIGEST_IDENTITY_MISMATCH"
      ],
      "status": "PASS"
    }
  ]
}
);


export const H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_INSTANCE = deepFreeze(
{
  "registryId": "H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_v1",
  "registryVersion": "1.0.0-candidate.1",
  "schemaId": "H_EARTH_REPOSITORY_REGISTRY_SCHEMA_v1",
  "schemaVersion": 1,
  "project": "H_EARTH",
  "repository": "smansfield635-create/smansfield635-create.github.io",
  "scope": {
    "scopeId": "H_EARTH_REPOSITORY_ARCHITECTURE",
    "coverageStatus": "PARTIAL_INITIAL_COVERAGE",
    "declaredUnits": [
      "H_EARTH_REPOSITORY_ARCHITECTURE",
      "H_EARTH_GEOMETRY_CONTINUITY_SYSTEM",
      "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT",
      "H_EARTH_GATE_B_PHASE_A_FUNCTIONAL_CONTINUITY_UNIT"
    ],
    "excludedOrDeferredCoverage": [
      "COMPLETE_EIGHTEEN_PATH_PACKAGE_COVERAGE_PENDING_REAUDIT",
      "ACCEPTED_REPOSITORY_REGISTRY_PATH_DEFERRED",
      "GATE_B_CARDINAL_CANONICALIZATION_DEFERRED",
      "TOOL_INSTRUCTION_VALIDATOR_AND_WORKFLOW_DEFERRED_TO_LATER_TARGETS"
    ]
  },
  "status": "COMPLETE_CANDIDATE",
  "accepted": false,
  "serialization": {
    "format": "ECMASCRIPT_MODULE_WITH_EMBEDDED_JSON_SCHEMA_AND_JSON_COMPATIBLE_INSTANCE",
    "encoding": "UTF-8",
    "deterministicKeyOrder": true,
    "deterministicArrayOrder": true,
    "digestAlgorithm": "SHA-256",
    "digestScope": "CANONICAL_JSON_OF_INSTANCE_EXCLUDING_SERIALIZATION_CONTENT_DIGEST",
    "digestExcludes": [
      "serialization.contentDigest"
    ],
    "contentDigest": "b5c5521571aa40045346c983f4b931e0d59de20740fe8d12adf973a5b70da7a3"
  },
  "sourceBasis": [
    {
      "sourceId": "H_EARTH_REPOSITORY_REGISTRY_SPECIFICATION_v1",
      "sourceKind": "GOOGLE_DRIVE_ARTIFACT",
      "documentOrOccurrenceId": "1qPSg6mtYRCl0vYJcbRj-KJ6NAByMuu7eq17I1Rzsfso@AIroW35hpXMJo_ouHfUJwTmDdfDsajezM-2v_HDEiNouHXSPm9ILmtYTR0q6kC6AXYzVqDQH2-hUE1-nLAc-MUXeWH3iY9VkmmxlWhqfIwA",
      "status": "COMPLETE_CANDIDATE_NOT_CANONICAL",
      "limitations": [
        "SPECIFICATION_ONLY",
        "NO_MUTATION_AUTHORITY"
      ]
    },
    {
      "sourceId": "H_EARTH_MANIFEST_FILE_RENEWAL_RECURSIVE_CARDINAL_AUTHORITY_ARCHITECTURE_v2",
      "sourceKind": "MANIFEST_CONTRACT",
      "documentOrOccurrenceId": "155ppisGVWsxZnohd8BtwrQeAs3QOJ9LUJgmnqQEmolE",
      "status": "DESCRIPTIVE_CURRENT_KNOWN_NOT_EXHAUSTIVE",
      "limitations": [
        "FILE_SPECIFIC_REVIEW_MAY_REFINE_STATUS",
        "MANIFEST_CREATES_NO_SOURCE_AUTHORITY"
      ]
    },
    {
      "sourceId": "H_EARTH_MAIN_REPOSITORY_OCCURRENCE",
      "sourceKind": "REPOSITORY_FILE",
      "documentOrOccurrenceId": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
      "status": "EXACT_COMMIT_OCCURRENCES_FETCHED",
      "limitations": [
        "NO_EXECUTION_PERFORMED",
        "NO_CONTENT_SHA256_OR_BYTE_COUNT_COMPUTED"
      ]
    },
    {
      "sourceId": "H_EARTH_GATE_B_INSTALLED_OCCURRENCE",
      "sourceKind": "REPOSITORY_FILE",
      "documentOrOccurrenceId": "81d6d9e73774f61d298f73a28a1fe01a6f05798f",
      "status": "EXACT_COMMIT_OCCURRENCES_FETCHED",
      "limitations": [
        "GATE_B_CARDINAL_MAPPING_NONCANONICAL",
        "NO_EXECUTION_PERFORMED"
      ]
    }
  ],
  "evidenceRecords": [
    {
      "evidenceId": "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "sourceKind": "MANIFEST_CONTRACT",
      "sourceIdOrPath": "155ppisGVWsxZnohd8BtwrQeAs3QOJ9LUJgmnqQEmolE",
      "sourceOccurrenceOrRevision": "DOCUMENT_ID=155ppisGVWsxZnohd8BtwrQeAs3QOJ9LUJgmnqQEmolE;INSPECTED_MAIN_COMMIT=3890dfc7165ae3481cd119d1f9c935e93c336f17;GATE_B_OCCURRENCE_COMMIT=81d6d9e73774f61d298f73a28a1fe01a6f05798f",
      "assertionScope": [
        "INITIAL_COVERAGE",
        "EXPLICIT_KERNEL_MEMBERSHIP",
        "GEOMETRY_CONTINUITY",
        "GATE_B_FUNCTIONAL_CONTINUITY"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "DESCRIPTIVE_MANIFEST_ONLY",
        "CURRENT_KNOWN_NOT_EXHAUSTIVE",
        "FILE_SPECIFIC_REVIEW_MAY_REFINE_STATUS"
      ]
    },
    {
      "evidenceId": "EVIDENCE_REPOSITORY_ADMITTED_FRAME",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "sourceKind": "REPOSITORY_FILE",
      "sourceIdOrPath": "/showroom/globe/h-earth/admitted-geometry-frame.js",
      "sourceOccurrenceOrRevision": "COMMIT=3890dfc7165ae3481cd119d1f9c935e93c336f17;GIT_BLOB_SHA=c45ed4482f0d653c4a51ea838c191f36e7769d26;CONTRACT=H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_FILE_BIRTH_STEP_034O_7_PACKET_002_TO_COMPOSITOR_RENDER_FRAME_ADAPTER_v1",
      "assertionScope": [
        "EXACT_PATH_OCCURRENCE",
        "CONTRACT_IDENTITY",
        "DECLARED_AUTHORITY_AND_BOUNDARIES"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "SOURCE_HEADER_AND_REPOSITORY_IDENTITY_INSPECTED",
        "CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_TARGET",
        "SOURCE_EXECUTION_NOT_REQUIRED_OR_PERFORMED_BY_TARGET_2"
      ]
    },
    {
      "evidenceId": "EVIDENCE_REPOSITORY_GATE_B_ADAPTER",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "sourceKind": "REPOSITORY_FILE",
      "sourceIdOrPath": "/h-earth-3d/integration/h-earth.ground-view-gate-b-west-admission-adapter.js",
      "sourceOccurrenceOrRevision": "COMMIT=81d6d9e73774f61d298f73a28a1fe01a6f05798f;GIT_BLOB_SHA=63503fe35a678507e1716dff0b14d086ea98aff9;CONTRACT=H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_FILE_BIRTH_DISTINCT_OCCURRENCE_v1",
      "assertionScope": [
        "EXACT_PATH_OCCURRENCE",
        "CONTRACT_IDENTITY",
        "DECLARED_AUTHORITY_AND_BOUNDARIES"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "SOURCE_HEADER_AND_REPOSITORY_IDENTITY_INSPECTED",
        "CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_TARGET",
        "SOURCE_EXECUTION_NOT_REQUIRED_OR_PERFORMED_BY_TARGET_2"
      ]
    },
    {
      "evidenceId": "EVIDENCE_REPOSITORY_GATE_B_ENVIRONMENT",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "sourceKind": "REPOSITORY_FILE",
      "sourceIdOrPath": "/showroom/globe/h-earth/environment.js",
      "sourceOccurrenceOrRevision": "COMMIT=81d6d9e73774f61d298f73a28a1fe01a6f05798f;GIT_BLOB_SHA=ef61bc716e1bad26f487aed71bddaee64981f2d7;CONTRACT=H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_GROUND_CELL_SUBSTRATE_v2",
      "assertionScope": [
        "EXACT_PATH_OCCURRENCE",
        "CONTRACT_IDENTITY",
        "DECLARED_AUTHORITY_AND_BOUNDARIES"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "SOURCE_HEADER_AND_REPOSITORY_IDENTITY_INSPECTED",
        "CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_TARGET",
        "SOURCE_EXECUTION_NOT_REQUIRED_OR_PERFORMED_BY_TARGET_2"
      ]
    },
    {
      "evidenceId": "EVIDENCE_REPOSITORY_GATE_B_PROVIDER",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "sourceKind": "REPOSITORY_FILE",
      "sourceIdOrPath": "/showroom/globe/h-earth/render/ground-view-gate-b.js",
      "sourceOccurrenceOrRevision": "COMMIT=81d6d9e73774f61d298f73a28a1fe01a6f05798f;GIT_BLOB_SHA=2a5b79a58ce411ed820df7ec2166f2e7b6e54b5b;CONTRACT=H_EARTH_GROUND_VIEW_GATE_B_BOUNDED_TERRAIN_WATER_GEOMETRY_PROVIDER_v1",
      "assertionScope": [
        "EXACT_PATH_OCCURRENCE",
        "CONTRACT_IDENTITY",
        "DECLARED_AUTHORITY_AND_BOUNDARIES"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "SOURCE_HEADER_AND_REPOSITORY_IDENTITY_INSPECTED",
        "CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_TARGET",
        "SOURCE_EXECUTION_NOT_REQUIRED_OR_PERFORMED_BY_TARGET_2"
      ]
    },
    {
      "evidenceId": "EVIDENCE_REPOSITORY_KERNEL_EAST",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "sourceKind": "REPOSITORY_FILE",
      "sourceIdOrPath": "/showroom/globe/h-earth/render/geometry-kernel.east.js",
      "sourceOccurrenceOrRevision": "COMMIT=3890dfc7165ae3481cd119d1f9c935e93c336f17;GIT_BLOB_SHA=261e73cc2c561dbf8d4f2f8210e51dad361cec91;CONTRACT=H_EARTH_3D_GEOMETRY_KERNEL_EAST_FILE_BIRTH_STEP_034O_4E_MATHEMATICAL_DESCRIPTION_ANALYSIS_AND_TOPOLOGY_v1",
      "assertionScope": [
        "EXACT_PATH_OCCURRENCE",
        "CONTRACT_IDENTITY",
        "DECLARED_AUTHORITY_AND_BOUNDARIES"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "SOURCE_HEADER_AND_REPOSITORY_IDENTITY_INSPECTED",
        "CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_TARGET",
        "SOURCE_EXECUTION_NOT_REQUIRED_OR_PERFORMED_BY_TARGET_2"
      ]
    },
    {
      "evidenceId": "EVIDENCE_REPOSITORY_KERNEL_FACADE",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "sourceKind": "REPOSITORY_FILE",
      "sourceIdOrPath": "/showroom/globe/h-earth/render/geometry-kernel.js",
      "sourceOccurrenceOrRevision": "COMMIT=3890dfc7165ae3481cd119d1f9c935e93c336f17;GIT_BLOB_SHA=91eabcc240b54ef01a52d59a237dff629d90a722;CONTRACT=H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_FILE_BIRTH_STEP_034O_4F_STABLE_DIRECTIONAL_KERNEL_EXPORT_SURFACE_v1",
      "assertionScope": [
        "EXACT_PATH_OCCURRENCE",
        "CONTRACT_IDENTITY",
        "DECLARED_AUTHORITY_AND_BOUNDARIES"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "SOURCE_HEADER_AND_REPOSITORY_IDENTITY_INSPECTED",
        "CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_TARGET",
        "SOURCE_EXECUTION_NOT_REQUIRED_OR_PERFORMED_BY_TARGET_2"
      ]
    },
    {
      "evidenceId": "EVIDENCE_REPOSITORY_KERNEL_NORTH",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "sourceKind": "REPOSITORY_FILE",
      "sourceIdOrPath": "/showroom/globe/h-earth/render/geometry-kernel.north.js",
      "sourceOccurrenceOrRevision": "COMMIT=3890dfc7165ae3481cd119d1f9c935e93c336f17;GIT_BLOB_SHA=b5289094db8648800197a03226d6322902960b48;CONTRACT=H_EARTH_3D_GEOMETRY_KERNEL_NORTH_FILE_BIRTH_STEP_034O_4N_FOUNDATIONAL_MATHEMATICS_v1",
      "assertionScope": [
        "EXACT_PATH_OCCURRENCE",
        "CONTRACT_IDENTITY",
        "DECLARED_AUTHORITY_AND_BOUNDARIES"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "SOURCE_HEADER_AND_REPOSITORY_IDENTITY_INSPECTED",
        "CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_TARGET",
        "SOURCE_EXECUTION_NOT_REQUIRED_OR_PERFORMED_BY_TARGET_2"
      ]
    },
    {
      "evidenceId": "EVIDENCE_REPOSITORY_KERNEL_SOUTH",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "sourceKind": "REPOSITORY_FILE",
      "sourceIdOrPath": "/showroom/globe/h-earth/render/geometry-kernel.south.js",
      "sourceOccurrenceOrRevision": "COMMIT=3890dfc7165ae3481cd119d1f9c935e93c336f17;GIT_BLOB_SHA=af1c78e2fe336678f9f477256a619b1a25c0d7b1;CONTRACT=H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_FILE_BIRTH_STEP_034O_4S_PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_v1",
      "assertionScope": [
        "EXACT_PATH_OCCURRENCE",
        "CONTRACT_IDENTITY",
        "DECLARED_AUTHORITY_AND_BOUNDARIES"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "SOURCE_HEADER_AND_REPOSITORY_IDENTITY_INSPECTED",
        "CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_TARGET",
        "SOURCE_EXECUTION_NOT_REQUIRED_OR_PERFORMED_BY_TARGET_2"
      ]
    },
    {
      "evidenceId": "EVIDENCE_REPOSITORY_KERNEL_WEST",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "sourceKind": "REPOSITORY_FILE",
      "sourceIdOrPath": "/showroom/globe/h-earth/render/geometry-kernel.west.js",
      "sourceOccurrenceOrRevision": "COMMIT=3890dfc7165ae3481cd119d1f9c935e93c336f17;GIT_BLOB_SHA=26f1b41c6a25bc7324082465b70cb6b68c2a457d;CONTRACT=H_EARTH_3D_GEOMETRY_KERNEL_WEST_FILE_BIRTH_STEP_034O_4W_PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_v1",
      "assertionScope": [
        "EXACT_PATH_OCCURRENCE",
        "CONTRACT_IDENTITY",
        "DECLARED_AUTHORITY_AND_BOUNDARIES"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "SOURCE_HEADER_AND_REPOSITORY_IDENTITY_INSPECTED",
        "CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_TARGET",
        "SOURCE_EXECUTION_NOT_REQUIRED_OR_PERFORMED_BY_TARGET_2"
      ]
    },
    {
      "evidenceId": "EVIDENCE_REPOSITORY_PACKET_001",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "sourceKind": "REPOSITORY_FILE",
      "sourceIdOrPath": "/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js",
      "sourceOccurrenceOrRevision": "COMMIT=3890dfc7165ae3481cd119d1f9c935e93c336f17;GIT_BLOB_SHA=8ed548780039fffba3989e55f5c8f3713354e34f;CONTRACT=H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_FILE_BIRTH_PACKET_001_WET_SAND_IDENTITY_CORRIDOR_v1",
      "assertionScope": [
        "EXACT_PATH_OCCURRENCE",
        "CONTRACT_IDENTITY",
        "DECLARED_AUTHORITY_AND_BOUNDARIES"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "SOURCE_HEADER_AND_REPOSITORY_IDENTITY_INSPECTED",
        "CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_TARGET",
        "SOURCE_EXECUTION_NOT_REQUIRED_OR_PERFORMED_BY_TARGET_2"
      ]
    },
    {
      "evidenceId": "EVIDENCE_REPOSITORY_PACKET_002_GATE_B",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "sourceKind": "REPOSITORY_FILE",
      "sourceIdOrPath": "/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js",
      "sourceOccurrenceOrRevision": "COMMIT=81d6d9e73774f61d298f73a28a1fe01a6f05798f;GIT_BLOB_SHA=c31412854dbce91bc6b378f345976fff5431e671;CONTRACT=H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_FILE_BIRTH_PACKET_002_PROVISIONAL_HANDOFF_v1",
      "assertionScope": [
        "EXACT_PATH_OCCURRENCE",
        "CONTRACT_IDENTITY",
        "DECLARED_AUTHORITY_AND_BOUNDARIES"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "SOURCE_HEADER_AND_REPOSITORY_IDENTITY_INSPECTED",
        "CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_TARGET",
        "SOURCE_EXECUTION_NOT_REQUIRED_OR_PERFORMED_BY_TARGET_2"
      ]
    },
    {
      "evidenceId": "EVIDENCE_REPOSITORY_PACKET_002_MAIN",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "sourceKind": "REPOSITORY_FILE",
      "sourceIdOrPath": "/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js",
      "sourceOccurrenceOrRevision": "COMMIT=3890dfc7165ae3481cd119d1f9c935e93c336f17;GIT_BLOB_SHA=2bcb67ebf84f36248475921c85e75236a1115102;CONTRACT=H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_FILE_BIRTH_PACKET_002_PROVISIONAL_HANDOFF_v1",
      "assertionScope": [
        "EXACT_PATH_OCCURRENCE",
        "CONTRACT_IDENTITY",
        "DECLARED_AUTHORITY_AND_BOUNDARIES"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "SOURCE_HEADER_AND_REPOSITORY_IDENTITY_INSPECTED",
        "CONTENT_SHA256_AND_BYTE_COUNT_NOT_COMPUTED_IN_THIS_TARGET",
        "SOURCE_EXECUTION_NOT_REQUIRED_OR_PERFORMED_BY_TARGET_2"
      ]
    },
    {
      "evidenceId": "EVIDENCE_TARGET_1_SPECIFICATION",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "sourceKind": "GOOGLE_DRIVE_ARTIFACT",
      "sourceIdOrPath": "1qPSg6mtYRCl0vYJcbRj-KJ6NAByMuu7eq17I1Rzsfso",
      "sourceOccurrenceOrRevision": "REVISION=AIroW35hpXMJo_ouHfUJwTmDdfDsajezM-2v_HDEiNouHXSPm9ILmtYTR0q6kC6AXYzVqDQH2-hUE1-nLAc-MUXeWH3iY9VkmmxlWhqfIwA",
      "assertionScope": [
        "SCHEMA_REQUIREMENTS",
        "NODE_RELATION_CONTRACTS",
        "TARGET_2_HANDOFF"
      ],
      "verifiedOn": "2026-07-23",
      "evidenceLimitations": [
        "CANDIDATE_SPECIFICATION_NOT_CANONICAL",
        "DOES_NOT_AUTHORIZE_GITHUB_OR_MANIFEST_MUTATION"
      ]
    }
  ],
  "nodes": [
    {
      "nodeId": "H_EARTH_ADMITTED_GEOMETRY_FRAME_FILE",
      "nodeType": "BOUNDARY_PACKET",
      "nodeSubtype": "ADMITTED_FRAME_CONTINUATION",
      "displayName": "Admitted Geometry Frame",
      "description": "Downstream adapter from Packet 002 and compositor-state inputs to an immutable renderer-consumable admitted-geometry frame.",
      "repositoryPaths": [
        "/showroom/globe/h-earth/admitted-geometry-frame.js"
      ],
      "repositoryOccurrences": [
        {
          "repository": "smansfield635-create/smansfield635-create.github.io",
          "refType": "COMMIT",
          "refName": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "commitSha": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "path": "/showroom/globe/h-earth/admitted-geometry-frame.js",
          "gitBlobSha": "c45ed4482f0d653c4a51ea838c191f36e7769d26",
          "contentSha256": null,
          "byteCount": null,
          "existenceStatus": "PRESENT",
          "fetchbackStatus": "VERIFIED",
          "occurrenceClass": "CANDIDATE"
        }
      ],
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_ADMITTED_FRAME"
      ],
      "authorityClass": "FRAME_AUTHORITY",
      "authorityPosture": "PACKET_002_TO_COMPOSITOR_RENDER_FRAME_ADAPTER_ONLY",
      "authoritySource": [
        "H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_FILE_BIRTH_STEP_034O_7_PACKET_002_TO_COMPOSITOR_RENDER_FRAME_ADAPTER_v1"
      ],
      "authorityScope": [
        "PACKET_002_TO_COMPOSITOR_RENDER_FRAME_ADAPTER_ONLY"
      ],
      "authorityLimitations": [
        "NO_PACKET_002_PRODUCER_AUTHENTICATION",
        "NO_RENDERER_MATERIALIZATION_OR_RUNTIME_AUTHORITY"
      ],
      "parentRelations": [
        "REL_GEOMETRY_SYSTEM_CONTAINS_ADMITTED_FRAME"
      ],
      "childRelations": [],
      "peerRelations": [],
      "upstreamBoundaries": [
        "REL_PACKET_002_CONTINUES_TO_ADMITTED_FRAME"
      ],
      "downstreamBoundaries": [],
      "cardinalRole": "NONE",
      "cardinalStatus": "NONE",
      "cardinalCompleteness": "NOT_APPLICABLE",
      "orderingRules": [],
      "dependencyRelations": [],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "/showroom/globe/h-earth/admitted-geometry-frame.js",
        "H_EARTH_3D_ADMITTED_GEOMETRY_FRAME_FILE_BIRTH_STEP_034O_7_PACKET_002_TO_COMPOSITOR_RENDER_FRAME_ADAPTER_v1"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "BYTE_COUNT",
        "CONTENT_SHA256"
      ]
    },
    {
      "nodeId": "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT",
      "nodeType": "COMPOSITE_UNIT",
      "nodeSubtype": "CARDINAL_UNIT",
      "displayName": "H-Earth Cardinal Geometry Kernel",
      "description": "Explicit distributed North, East, South, and West geometry authority body exposed through a non-owning public facade.",
      "repositoryPaths": [],
      "repositoryOccurrences": [],
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_KERNEL_EAST",
        "EVIDENCE_REPOSITORY_KERNEL_FACADE",
        "EVIDENCE_REPOSITORY_KERNEL_NORTH",
        "EVIDENCE_REPOSITORY_KERNEL_SOUTH",
        "EVIDENCE_REPOSITORY_KERNEL_WEST"
      ],
      "authorityClass": "NO_AUTHORITY",
      "authorityPosture": "COMPOSITE_IDENTITY_ADDITIVE_MEMBER_AUTHORITY_REMAINS_SEPARATE",
      "authoritySource": [
        "H_EARTH_MANIFEST_FILE_RENEWAL_RECURSIVE_CARDINAL_AUTHORITY_ARCHITECTURE_v2"
      ],
      "authorityScope": [
        "EXPLICIT_CARDINAL_GEOMETRY_KERNEL_MEMBERSHIP"
      ],
      "authorityLimitations": [
        "COMPOSITE_DOES_NOT_OWN_MEMBER_AUTHORITY",
        "FACADE_DOES_NOT_COLLAPSE_MEMBER_AUTHORITY"
      ],
      "parentRelations": [
        "REL_GEOMETRY_SYSTEM_CONTAINS_KERNEL"
      ],
      "childRelations": [
        "REL_KERNEL_CONTAINS_EAST",
        "REL_KERNEL_CONTAINS_FACADE",
        "REL_KERNEL_CONTAINS_NORTH",
        "REL_KERNEL_CONTAINS_SOUTH",
        "REL_KERNEL_CONTAINS_WEST"
      ],
      "peerRelations": [],
      "upstreamBoundaries": [
        "REL_PACKET_001_RESOLVES_INTO_KERNEL"
      ],
      "downstreamBoundaries": [
        "REL_KERNEL_TRANSFERS_TO_PACKET_002"
      ],
      "cardinalRole": "NONE",
      "cardinalStatus": "NONE",
      "cardinalCompleteness": "COMPLETE",
      "orderingRules": [
        "NORTH_FOUNDATION_EAST_ANALYSIS_SOUTH_CONSTRUCTION_WEST_ADMISSION_FACADE_EXPOSURE"
      ],
      "dependencyRelations": [],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": []
    },
    {
      "nodeId": "H_EARTH_GATE_B_ENVIRONMENT_FILE",
      "nodeType": "FILE",
      "nodeSubtype": "ENVIRONMENT_FRAME",
      "displayName": "Gate B Environment",
      "description": "Environment context and numeric-profile frame consumed by Gate B construction.",
      "repositoryPaths": [
        "/showroom/globe/h-earth/environment.js"
      ],
      "repositoryOccurrences": [
        {
          "repository": "smansfield635-create/smansfield635-create.github.io",
          "refType": "COMMIT",
          "refName": "81d6d9e73774f61d298f73a28a1fe01a6f05798f",
          "commitSha": "81d6d9e73774f61d298f73a28a1fe01a6f05798f",
          "path": "/showroom/globe/h-earth/environment.js",
          "gitBlobSha": "ef61bc716e1bad26f487aed71bddaee64981f2d7",
          "contentSha256": null,
          "byteCount": null,
          "existenceStatus": "PRESENT",
          "fetchbackStatus": "VERIFIED",
          "occurrenceClass": "CANDIDATE"
        }
      ],
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_GATE_B_ENVIRONMENT"
      ],
      "authorityClass": "SOURCE_AUTHORITY",
      "authorityPosture": "ENVIRONMENT_CONTEXT_AND_NUMERIC_PROFILE_FRAME",
      "authoritySource": [
        "H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_GROUND_CELL_SUBSTRATE_v2"
      ],
      "authorityScope": [
        "ENVIRONMENT_CONTEXT_AND_NUMERIC_PROFILE_FRAME"
      ],
      "authorityLimitations": [
        "CARDINAL_ROLE_FUNCTIONALLY_INDICATED_NOT_CANONICAL",
        "GATE_B_CARDINAL_ROLE_REMAINS_OBSERVED_CANDIDATE"
      ],
      "parentRelations": [
        "REL_GATE_B_CONTAINS_NORTH"
      ],
      "childRelations": [],
      "peerRelations": [],
      "upstreamBoundaries": [
        "REL_GATE_B_PROVIDER_CONSUMES_ENVIRONMENT"
      ],
      "downstreamBoundaries": [
        "REL_GATE_B_ENVIRONMENT_CONTINUES_TO_PROVIDER"
      ],
      "cardinalRole": "NORTH",
      "cardinalStatus": "OBSERVED_CANDIDATE",
      "cardinalCompleteness": "NOT_APPLICABLE",
      "orderingRules": [],
      "dependencyRelations": [],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "/showroom/globe/h-earth/environment.js",
        "H_EARTH_3D_ENVIRONMENT_FILE_RENEWAL_STEP_034O_3_FRAME_BASED_GROUND_CELL_SUBSTRATE_v2"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "BYTE_COUNT",
        "CANONICAL_CARDINAL_ROLE",
        "CONTENT_SHA256"
      ]
    },
    {
      "nodeId": "H_EARTH_GATE_B_PHASE_A_FUNCTIONAL_CONTINUITY_UNIT",
      "nodeType": "COMPOSITE_UNIT",
      "nodeSubtype": "FUNCTIONAL_CONTINUITY_UNIT",
      "displayName": "H-Earth Gate B Phase A Functional Continuity Unit",
      "description": "Observed four-path Gate B continuity with functionally indicated cardinal roles that remain noncanonical.",
      "repositoryPaths": [],
      "repositoryOccurrences": [],
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_GATE_B_ADAPTER",
        "EVIDENCE_REPOSITORY_GATE_B_ENVIRONMENT",
        "EVIDENCE_REPOSITORY_GATE_B_PROVIDER",
        "EVIDENCE_REPOSITORY_PACKET_002_GATE_B"
      ],
      "authorityClass": "NO_AUTHORITY",
      "authorityPosture": "CANDIDATE_COMPOSITE_IDENTITY_ONLY_CARDINAL_MAPPING_NOT_CANONICAL",
      "authoritySource": [
        "H_EARTH_MANIFEST_FILE_RENEWAL_RECURSIVE_CARDINAL_AUTHORITY_ARCHITECTURE_v2"
      ],
      "authorityScope": [
        "GATE_B_PHASE_A_OBSERVED_CONTINUITY"
      ],
      "authorityLimitations": [
        "CARDINAL_ASSIGNMENT_NOT_CANONICAL",
        "DEDICATED_ARCHITECTURAL_AUDIT_REQUIRED_BEFORE_PROMOTION"
      ],
      "parentRelations": [
        "REL_GEOMETRY_SYSTEM_CONTAINS_GATE_B_UNIT"
      ],
      "childRelations": [
        "REL_GATE_B_CONTAINS_EAST",
        "REL_GATE_B_CONTAINS_NORTH",
        "REL_GATE_B_CONTAINS_SOUTH",
        "REL_GATE_B_CONTAINS_WEST"
      ],
      "peerRelations": [],
      "upstreamBoundaries": [],
      "downstreamBoundaries": [],
      "cardinalRole": "NONE",
      "cardinalStatus": "NONE",
      "cardinalCompleteness": "CANDIDATE",
      "orderingRules": [
        "NORTH_FRAME_TO_SOUTH_CONSTRUCTION_TO_WEST_ADMISSION_TO_EAST_CONTINUATION"
      ],
      "dependencyRelations": [],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "H_EARTH_GATE_B_PHASE_A_FUNCTIONAL_CONTINUITY_UNIT"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "GATE_B_CARDINAL_CANONICALIZATION"
      ]
    },
    {
      "nodeId": "H_EARTH_GATE_B_PROVIDER_FILE",
      "nodeType": "FILE",
      "nodeSubtype": "GEOMETRY_CONSTRUCTION_OCCURRENCE",
      "displayName": "Gate B Geometry Provider",
      "description": "Bounded Gate B terrain/water geometry construction occurrence.",
      "repositoryPaths": [
        "/showroom/globe/h-earth/render/ground-view-gate-b.js"
      ],
      "repositoryOccurrences": [
        {
          "repository": "smansfield635-create/smansfield635-create.github.io",
          "refType": "COMMIT",
          "refName": "81d6d9e73774f61d298f73a28a1fe01a6f05798f",
          "commitSha": "81d6d9e73774f61d298f73a28a1fe01a6f05798f",
          "path": "/showroom/globe/h-earth/render/ground-view-gate-b.js",
          "gitBlobSha": "2a5b79a58ce411ed820df7ec2166f2e7b6e54b5b",
          "contentSha256": null,
          "byteCount": null,
          "existenceStatus": "PRESENT",
          "fetchbackStatus": "VERIFIED",
          "occurrenceClass": "CANDIDATE"
        }
      ],
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_GATE_B_PROVIDER"
      ],
      "authorityClass": "CONSTRUCTION_AUTHORITY",
      "authorityPosture": "GATE_B_GEOMETRY_CONSTRUCTION_OCCURRENCE",
      "authoritySource": [
        "H_EARTH_GROUND_VIEW_GATE_B_BOUNDED_TERRAIN_WATER_GEOMETRY_PROVIDER_v1"
      ],
      "authorityScope": [
        "GATE_B_GEOMETRY_CONSTRUCTION_OCCURRENCE"
      ],
      "authorityLimitations": [
        "GATE_B_CARDINAL_ROLE_REMAINS_OBSERVED_CANDIDATE",
        "NO_ADMISSION_FRAME_ROUTE_RENDERER_OR_VISUAL_AUTHORITY"
      ],
      "parentRelations": [
        "REL_GATE_B_CONTAINS_SOUTH"
      ],
      "childRelations": [],
      "peerRelations": [],
      "upstreamBoundaries": [
        "REL_GATE_B_ENVIRONMENT_CONTINUES_TO_PROVIDER"
      ],
      "downstreamBoundaries": [
        "REL_GATE_B_PROVIDER_ADMITS_INTO_ADAPTER",
        "REL_GATE_B_PROVIDER_CONSUMES_ENVIRONMENT"
      ],
      "cardinalRole": "SOUTH",
      "cardinalStatus": "OBSERVED_CANDIDATE",
      "cardinalCompleteness": "NOT_APPLICABLE",
      "orderingRules": [],
      "dependencyRelations": [],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "/showroom/globe/h-earth/render/ground-view-gate-b.js",
        "H_EARTH_GROUND_VIEW_GATE_B_BOUNDED_TERRAIN_WATER_GEOMETRY_PROVIDER_v1"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "BYTE_COUNT",
        "CANONICAL_CARDINAL_ROLE",
        "CONTENT_SHA256"
      ]
    },
    {
      "nodeId": "H_EARTH_GATE_B_WEST_ADAPTER_FILE",
      "nodeType": "BOUNDARY_PACKET",
      "nodeSubtype": "ADMISSION_ORCHESTRATION_ADAPTER",
      "displayName": "Gate B West Admission Adapter",
      "description": "Provider-result to public-West admission orchestration adapter; not a new admission authority.",
      "repositoryPaths": [
        "/h-earth-3d/integration/h-earth.ground-view-gate-b-west-admission-adapter.js"
      ],
      "repositoryOccurrences": [
        {
          "repository": "smansfield635-create/smansfield635-create.github.io",
          "refType": "COMMIT",
          "refName": "81d6d9e73774f61d298f73a28a1fe01a6f05798f",
          "commitSha": "81d6d9e73774f61d298f73a28a1fe01a6f05798f",
          "path": "/h-earth-3d/integration/h-earth.ground-view-gate-b-west-admission-adapter.js",
          "gitBlobSha": "63503fe35a678507e1716dff0b14d086ea98aff9",
          "contentSha256": null,
          "byteCount": null,
          "existenceStatus": "PRESENT",
          "fetchbackStatus": "VERIFIED",
          "occurrenceClass": "CANDIDATE"
        }
      ],
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_GATE_B_ADAPTER"
      ],
      "authorityClass": "ORCHESTRATION_ONLY",
      "authorityPosture": "GATE_B_PROVIDER_RESULT_TO_PUBLIC_WEST_ADMISSION_ORCHESTRATION_ONLY",
      "authoritySource": [
        "H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_FILE_BIRTH_DISTINCT_OCCURRENCE_v1"
      ],
      "authorityScope": [
        "GATE_B_PROVIDER_RESULT_TO_PUBLIC_WEST_ADMISSION_ORCHESTRATION_ONLY"
      ],
      "authorityLimitations": [
        "GATE_B_CARDINAL_ROLE_REMAINS_OBSERVED_CANDIDATE",
        "MUST_NOT_BE_PROMOTED_TO_ADMISSION_AUTHORITY"
      ],
      "parentRelations": [
        "REL_GATE_B_CONTAINS_WEST"
      ],
      "childRelations": [],
      "peerRelations": [],
      "upstreamBoundaries": [
        "REL_GATE_B_PROVIDER_ADMITS_INTO_ADAPTER"
      ],
      "downstreamBoundaries": [
        "REL_GATE_B_ADAPTER_TRANSFERS_TO_PACKET_002"
      ],
      "cardinalRole": "WEST",
      "cardinalStatus": "OBSERVED_CANDIDATE",
      "cardinalCompleteness": "NOT_APPLICABLE",
      "orderingRules": [],
      "dependencyRelations": [],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "/h-earth-3d/integration/h-earth.ground-view-gate-b-west-admission-adapter.js",
        "H_EARTH_GROUND_VIEW_GATE_B_WEST_ADMISSION_ADAPTER_FILE_BIRTH_DISTINCT_OCCURRENCE_v1"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "BYTE_COUNT",
        "CANONICAL_CARDINAL_ROLE",
        "CONTENT_SHA256"
      ]
    },
    {
      "nodeId": "H_EARTH_GEOMETRY_CONTINUITY_SYSTEM",
      "nodeType": "COMPOSITE_UNIT",
      "nodeSubtype": "FUNCTIONAL_CONTINUITY_UNIT",
      "displayName": "H-Earth Geometry Continuity System",
      "description": "Observed continuity from Packet 001 through the explicit cardinal kernel and Packet 002 into the admitted-frame continuation.",
      "repositoryPaths": [],
      "repositoryOccurrences": [],
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_TARGET_1_SPECIFICATION"
      ],
      "authorityClass": "NO_AUTHORITY",
      "authorityPosture": "DESCRIPTIVE_CONTINUITY_SYSTEM_ONLY",
      "authoritySource": [
        "H_EARTH_MANIFEST_FILE_RENEWAL_RECURSIVE_CARDINAL_AUTHORITY_ARCHITECTURE_v2"
      ],
      "authorityScope": [
        "PACKET_001_TO_ADMITTED_FRAME_CONTINUITY"
      ],
      "authorityLimitations": [
        "DOES_NOT_CREATE_EXECUTION_ORDER",
        "DOES_NOT_TRANSFER_MEMBER_AUTHORITY"
      ],
      "parentRelations": [
        "REL_ROOT_CONTAINS_GEOMETRY_SYSTEM"
      ],
      "childRelations": [
        "REL_GEOMETRY_SYSTEM_CONTAINS_ADMITTED_FRAME",
        "REL_GEOMETRY_SYSTEM_CONTAINS_GATE_B_UNIT",
        "REL_GEOMETRY_SYSTEM_CONTAINS_KERNEL",
        "REL_GEOMETRY_SYSTEM_CONTAINS_PACKET_001",
        "REL_GEOMETRY_SYSTEM_CONTAINS_PACKET_002"
      ],
      "peerRelations": [],
      "upstreamBoundaries": [],
      "downstreamBoundaries": [],
      "cardinalRole": "NONE",
      "cardinalStatus": "NONE",
      "cardinalCompleteness": "CANDIDATE",
      "orderingRules": [
        "PACKET_001_THEN_CARDINAL_KERNEL_THEN_PACKET_002_THEN_ADMITTED_FRAME"
      ],
      "dependencyRelations": [],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "H_EARTH_GEOMETRY_CONTINUITY_SYSTEM"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": []
    },
    {
      "nodeId": "H_EARTH_GEOMETRY_KERNEL_EAST_FILE",
      "nodeType": "FILE",
      "nodeSubtype": "MATHEMATICAL_ANALYSIS_AND_TOPOLOGY",
      "displayName": "Geometry Kernel East",
      "description": "Mathematical description, evaluation, sampling, differential analysis, polygon analysis, and indexed topology.",
      "repositoryPaths": [
        "/showroom/globe/h-earth/render/geometry-kernel.east.js"
      ],
      "repositoryOccurrences": [
        {
          "repository": "smansfield635-create/smansfield635-create.github.io",
          "refType": "COMMIT",
          "refName": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "commitSha": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "path": "/showroom/globe/h-earth/render/geometry-kernel.east.js",
          "gitBlobSha": "261e73cc2c561dbf8d4f2f8210e51dad361cec91",
          "contentSha256": null,
          "byteCount": null,
          "existenceStatus": "PRESENT",
          "fetchbackStatus": "VERIFIED",
          "occurrenceClass": "CANDIDATE"
        }
      ],
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_KERNEL_EAST"
      ],
      "authorityClass": "SOURCE_AUTHORITY",
      "authorityPosture": "MATHEMATICAL_DESCRIPTION_EVALUATION_SAMPLING_AND_ANALYSIS_ONLY",
      "authoritySource": [
        "H_EARTH_3D_GEOMETRY_KERNEL_EAST_FILE_BIRTH_STEP_034O_4E_MATHEMATICAL_DESCRIPTION_ANALYSIS_AND_TOPOLOGY_v1"
      ],
      "authorityScope": [
        "MATHEMATICAL_DESCRIPTION_EVALUATION_SAMPLING_AND_ANALYSIS_ONLY"
      ],
      "authorityLimitations": [
        "CANDIDATE_IMPLEMENTATION_POSTURE_PRESERVED",
        "NO_ADMISSION_AUTHORITY",
        "NO_FINAL_PRIMITIVE_CONSTRUCTION"
      ],
      "parentRelations": [
        "REL_KERNEL_CONTAINS_EAST"
      ],
      "childRelations": [],
      "peerRelations": [],
      "upstreamBoundaries": [],
      "downstreamBoundaries": [],
      "cardinalRole": "EAST",
      "cardinalStatus": "EXPLICIT",
      "cardinalCompleteness": "NOT_APPLICABLE",
      "orderingRules": [
        "DEPENDS_ON_NORTH",
        "KERNEL_SEQUENCE_INDEX_2"
      ],
      "dependencyRelations": [
        "REL_EAST_DEPENDS_ON_NORTH"
      ],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "/showroom/globe/h-earth/render/geometry-kernel.east.js",
        "H_EARTH_3D_GEOMETRY_KERNEL_EAST_FILE_BIRTH_STEP_034O_4E_MATHEMATICAL_DESCRIPTION_ANALYSIS_AND_TOPOLOGY_v1"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "BYTE_COUNT",
        "CONTENT_SHA256"
      ]
    },
    {
      "nodeId": "H_EARTH_GEOMETRY_KERNEL_FACADE_FILE",
      "nodeType": "FACADE",
      "nodeSubtype": "PUBLIC_FACADE",
      "displayName": "Geometry Kernel Public Facade",
      "description": "Stable public facade over the four directional kernel modules.",
      "repositoryPaths": [
        "/showroom/globe/h-earth/render/geometry-kernel.js"
      ],
      "repositoryOccurrences": [
        {
          "repository": "smansfield635-create/smansfield635-create.github.io",
          "refType": "COMMIT",
          "refName": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "commitSha": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "path": "/showroom/globe/h-earth/render/geometry-kernel.js",
          "gitBlobSha": "91eabcc240b54ef01a52d59a237dff629d90a722",
          "contentSha256": null,
          "byteCount": null,
          "existenceStatus": "PRESENT",
          "fetchbackStatus": "VERIFIED",
          "occurrenceClass": "CANDIDATE"
        }
      ],
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_KERNEL_FACADE"
      ],
      "authorityClass": "FACADE_AUTHORITY",
      "authorityPosture": "PUBLIC_FACADE_IMPLEMENTATION_CANDIDATE",
      "authoritySource": [
        "H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_FILE_BIRTH_STEP_034O_4F_STABLE_DIRECTIONAL_KERNEL_EXPORT_SURFACE_v1"
      ],
      "authorityScope": [
        "PUBLIC_FACADE_IMPLEMENTATION_CANDIDATE"
      ],
      "authorityLimitations": [
        "CANDIDATE_IMPLEMENTATION_POSTURE_PRESERVED",
        "DOES_NOT_INVENT_OR_OWN_DIRECTIONAL_AUTHORITY"
      ],
      "parentRelations": [
        "REL_KERNEL_CONTAINS_FACADE"
      ],
      "childRelations": [],
      "peerRelations": [],
      "upstreamBoundaries": [],
      "downstreamBoundaries": [],
      "cardinalRole": "NONE",
      "cardinalStatus": "NONE",
      "cardinalCompleteness": "NOT_APPLICABLE",
      "orderingRules": [
        "EXPOSES_EXISTING_DIRECTIONAL_AUTHORITY_ONLY"
      ],
      "dependencyRelations": [],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "/showroom/globe/h-earth/render/geometry-kernel.js",
        "H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_FILE_BIRTH_STEP_034O_4F_STABLE_DIRECTIONAL_KERNEL_EXPORT_SURFACE_v1"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "BYTE_COUNT",
        "CONTENT_SHA256"
      ]
    },
    {
      "nodeId": "H_EARTH_GEOMETRY_KERNEL_NORTH_FILE",
      "nodeType": "FILE",
      "nodeSubtype": "FOUNDATIONAL_MATHEMATICS",
      "displayName": "Geometry Kernel North",
      "description": "Foundational mathematics and coordinate-frame authority.",
      "repositoryPaths": [
        "/showroom/globe/h-earth/render/geometry-kernel.north.js"
      ],
      "repositoryOccurrences": [
        {
          "repository": "smansfield635-create/smansfield635-create.github.io",
          "refType": "COMMIT",
          "refName": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "commitSha": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "path": "/showroom/globe/h-earth/render/geometry-kernel.north.js",
          "gitBlobSha": "b5289094db8648800197a03226d6322902960b48",
          "contentSha256": null,
          "byteCount": null,
          "existenceStatus": "PRESENT",
          "fetchbackStatus": "VERIFIED",
          "occurrenceClass": "CANDIDATE"
        }
      ],
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_KERNEL_NORTH"
      ],
      "authorityClass": "SOURCE_AUTHORITY",
      "authorityPosture": "FOUNDATIONAL_MATHEMATICS_ONLY",
      "authoritySource": [
        "H_EARTH_3D_GEOMETRY_KERNEL_NORTH_FILE_BIRTH_STEP_034O_4N_FOUNDATIONAL_MATHEMATICS_v1"
      ],
      "authorityScope": [
        "FOUNDATIONAL_MATHEMATICS_ONLY"
      ],
      "authorityLimitations": [
        "CANDIDATE_IMPLEMENTATION_POSTURE_PRESERVED",
        "NO_CONSTRUCTION_OR_PROJECTION_AUTHORITY",
        "NO_LOCAL_ADMISSION"
      ],
      "parentRelations": [
        "REL_KERNEL_CONTAINS_NORTH"
      ],
      "childRelations": [],
      "peerRelations": [],
      "upstreamBoundaries": [],
      "downstreamBoundaries": [],
      "cardinalRole": "NORTH",
      "cardinalStatus": "EXPLICIT",
      "cardinalCompleteness": "NOT_APPLICABLE",
      "orderingRules": [
        "KERNEL_SEQUENCE_INDEX_1"
      ],
      "dependencyRelations": [],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "/showroom/globe/h-earth/render/geometry-kernel.north.js",
        "H_EARTH_3D_GEOMETRY_KERNEL_NORTH_FILE_BIRTH_STEP_034O_4N_FOUNDATIONAL_MATHEMATICS_v1"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "BYTE_COUNT",
        "CONTENT_SHA256"
      ]
    },
    {
      "nodeId": "H_EARTH_GEOMETRY_KERNEL_SOUTH_FILE",
      "nodeType": "FILE",
      "nodeSubtype": "NEUTRAL_GEOMETRY_CONSTRUCTION",
      "displayName": "Geometry Kernel South",
      "description": "Projection-neutral primitive and neutral geometry construction authority.",
      "repositoryPaths": [
        "/showroom/globe/h-earth/render/geometry-kernel.south.js"
      ],
      "repositoryOccurrences": [
        {
          "repository": "smansfield635-create/smansfield635-create.github.io",
          "refType": "COMMIT",
          "refName": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "commitSha": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "path": "/showroom/globe/h-earth/render/geometry-kernel.south.js",
          "gitBlobSha": "af1c78e2fe336678f9f477256a619b1a25c0d7b1",
          "contentSha256": null,
          "byteCount": null,
          "existenceStatus": "PRESENT",
          "fetchbackStatus": "VERIFIED",
          "occurrenceClass": "CANDIDATE"
        }
      ],
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_KERNEL_SOUTH"
      ],
      "authorityClass": "CONSTRUCTION_AUTHORITY",
      "authorityPosture": "SOUTH_NEUTRAL_GEOMETRY_CONSTRUCTION_ONLY",
      "authoritySource": [
        "H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_FILE_BIRTH_STEP_034O_4S_PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_v1"
      ],
      "authorityScope": [
        "SOUTH_NEUTRAL_GEOMETRY_CONSTRUCTION_ONLY"
      ],
      "authorityLimitations": [
        "CANDIDATE_IMPLEMENTATION_POSTURE_PRESERVED",
        "NO_ADMISSION_AUTHORITY",
        "NO_RENDERER_AUTHORITY"
      ],
      "parentRelations": [
        "REL_KERNEL_CONTAINS_SOUTH"
      ],
      "childRelations": [],
      "peerRelations": [],
      "upstreamBoundaries": [],
      "downstreamBoundaries": [],
      "cardinalRole": "SOUTH",
      "cardinalStatus": "EXPLICIT",
      "cardinalCompleteness": "NOT_APPLICABLE",
      "orderingRules": [
        "DEPENDS_ON_NORTH_AND_EAST",
        "KERNEL_SEQUENCE_INDEX_3"
      ],
      "dependencyRelations": [
        "REL_SOUTH_DEPENDS_ON_EAST",
        "REL_SOUTH_DEPENDS_ON_NORTH"
      ],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "/showroom/globe/h-earth/render/geometry-kernel.south.js",
        "H_EARTH_3D_GEOMETRY_KERNEL_SOUTH_FILE_BIRTH_STEP_034O_4S_PROJECTION_NEUTRAL_PRIMITIVE_AND_NEUTRAL_GEOMETRY_CONSTRUCTION_v1"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "BYTE_COUNT",
        "CONTENT_SHA256"
      ]
    },
    {
      "nodeId": "H_EARTH_GEOMETRY_KERNEL_WEST_FILE",
      "nodeType": "FILE",
      "nodeSubtype": "PRIMITIVE_AND_AGGREGATE_ADMISSION",
      "displayName": "Geometry Kernel West",
      "description": "Primitive admission and aggregate-frame admission authority.",
      "repositoryPaths": [
        "/showroom/globe/h-earth/render/geometry-kernel.west.js"
      ],
      "repositoryOccurrences": [
        {
          "repository": "smansfield635-create/smansfield635-create.github.io",
          "refType": "COMMIT",
          "refName": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "commitSha": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "path": "/showroom/globe/h-earth/render/geometry-kernel.west.js",
          "gitBlobSha": "26f1b41c6a25bc7324082465b70cb6b68c2a457d",
          "contentSha256": null,
          "byteCount": null,
          "existenceStatus": "PRESENT",
          "fetchbackStatus": "VERIFIED",
          "occurrenceClass": "CANDIDATE"
        }
      ],
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_KERNEL_WEST"
      ],
      "authorityClass": "ADMISSION_AUTHORITY",
      "authorityPosture": "WEST_PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_ONLY",
      "authoritySource": [
        "H_EARTH_3D_GEOMETRY_KERNEL_WEST_FILE_BIRTH_STEP_034O_4W_PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_v1"
      ],
      "authorityScope": [
        "WEST_PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_ONLY"
      ],
      "authorityLimitations": [
        "CANDIDATE_IMPLEMENTATION_POSTURE_PRESERVED",
        "NO_PROVIDER_ADMISSION",
        "NO_RENDERER_OR_PRODUCTION_AUTHORITY"
      ],
      "parentRelations": [
        "REL_KERNEL_CONTAINS_WEST"
      ],
      "childRelations": [],
      "peerRelations": [],
      "upstreamBoundaries": [],
      "downstreamBoundaries": [],
      "cardinalRole": "WEST",
      "cardinalStatus": "EXPLICIT",
      "cardinalCompleteness": "NOT_APPLICABLE",
      "orderingRules": [
        "DEPENDS_ON_NORTH_EAST_AND_SOUTH",
        "KERNEL_SEQUENCE_INDEX_4"
      ],
      "dependencyRelations": [
        "REL_WEST_DEPENDS_ON_EAST",
        "REL_WEST_DEPENDS_ON_NORTH",
        "REL_WEST_DEPENDS_ON_SOUTH"
      ],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "/showroom/globe/h-earth/render/geometry-kernel.west.js",
        "H_EARTH_3D_GEOMETRY_KERNEL_WEST_FILE_BIRTH_STEP_034O_4W_PRIMITIVE_ADMISSION_AND_AGGREGATE_FRAME_ADMISSION_v1"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "BYTE_COUNT",
        "CONTENT_SHA256"
      ]
    },
    {
      "nodeId": "H_EARTH_PACKET_001_SOURCE_RESOLUTION_FILE",
      "nodeType": "BOUNDARY_PACKET",
      "nodeSubtype": "INGRESS_AND_SOURCE_RESOLUTION",
      "displayName": "Packet 001 Source-Object Geometry Resolution",
      "description": "Ingress and source-resolution boundary producing a neutral provider-request descriptor without constructing or admitting geometry.",
      "repositoryPaths": [
        "/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js"
      ],
      "repositoryOccurrences": [
        {
          "repository": "smansfield635-create/smansfield635-create.github.io",
          "refType": "COMMIT",
          "refName": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "commitSha": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "path": "/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js",
          "gitBlobSha": "8ed548780039fffba3989e55f5c8f3713354e34f",
          "contentSha256": null,
          "byteCount": null,
          "existenceStatus": "PRESENT",
          "fetchbackStatus": "VERIFIED",
          "occurrenceClass": "CANDIDATE"
        }
      ],
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_PACKET_001"
      ],
      "authorityClass": "SOURCE_AUTHORITY",
      "authorityPosture": "PACKET_001_SOURCE_IDENTITY_RESOLUTION_ONLY",
      "authoritySource": [
        "H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_FILE_BIRTH_PACKET_001_WET_SAND_IDENTITY_CORRIDOR_v1"
      ],
      "authorityScope": [
        "PACKET_001_SOURCE_IDENTITY_RESOLUTION_ONLY"
      ],
      "authorityLimitations": [
        "NO_GEOMETRY_CONSTRUCTION",
        "NO_PROVIDER_INVOCATION",
        "NO_WEST_ADMISSION"
      ],
      "parentRelations": [
        "REL_GEOMETRY_SYSTEM_CONTAINS_PACKET_001"
      ],
      "childRelations": [],
      "peerRelations": [],
      "upstreamBoundaries": [],
      "downstreamBoundaries": [
        "REL_PACKET_001_RESOLVES_INTO_KERNEL"
      ],
      "cardinalRole": "NONE",
      "cardinalStatus": "NONE",
      "cardinalCompleteness": "NOT_APPLICABLE",
      "orderingRules": [],
      "dependencyRelations": [],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js",
        "H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_FILE_BIRTH_PACKET_001_WET_SAND_IDENTITY_CORRIDOR_v1"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "BYTE_COUNT",
        "CONTENT_SHA256"
      ]
    },
    {
      "nodeId": "H_EARTH_PACKET_002_POST_WEST_TRANSFER_FILE",
      "nodeType": "BOUNDARY_PACKET",
      "nodeSubtype": "POST_WEST_EGRESS_AND_CONTINUATION",
      "displayName": "Packet 002 Post-West Admitted Geometry Transfer",
      "description": "Shared post-West transfer boundary preserving lawful legacy or Gate B admitted geometry without inventing downstream authority.",
      "repositoryPaths": [
        "/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js"
      ],
      "repositoryOccurrences": [
        {
          "repository": "smansfield635-create/smansfield635-create.github.io",
          "refType": "COMMIT",
          "refName": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "commitSha": "3890dfc7165ae3481cd119d1f9c935e93c336f17",
          "path": "/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js",
          "gitBlobSha": "2bcb67ebf84f36248475921c85e75236a1115102",
          "contentSha256": null,
          "byteCount": null,
          "existenceStatus": "PRESENT",
          "fetchbackStatus": "VERIFIED",
          "occurrenceClass": "CANDIDATE"
        },
        {
          "repository": "smansfield635-create/smansfield635-create.github.io",
          "refType": "COMMIT",
          "refName": "81d6d9e73774f61d298f73a28a1fe01a6f05798f",
          "commitSha": "81d6d9e73774f61d298f73a28a1fe01a6f05798f",
          "path": "/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js",
          "gitBlobSha": "c31412854dbce91bc6b378f345976fff5431e671",
          "contentSha256": null,
          "byteCount": null,
          "existenceStatus": "PRESENT",
          "fetchbackStatus": "VERIFIED",
          "occurrenceClass": "CANDIDATE"
        }
      ],
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_PACKET_002_GATE_B",
        "EVIDENCE_REPOSITORY_PACKET_002_MAIN"
      ],
      "authorityClass": "TRANSFER_OR_CONTINUATION_AUTHORITY",
      "authorityPosture": "PACKET_002_PROVISIONAL_POST_WEST_TRANSFER_ONLY",
      "authoritySource": [
        "H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_FILE_BIRTH_PACKET_002_PROVISIONAL_HANDOFF_v1"
      ],
      "authorityScope": [
        "PACKET_002_PROVISIONAL_POST_WEST_TRANSFER_ONLY"
      ],
      "authorityLimitations": [
        "GATE_B_EAST_ROLE_IS_RECORDED_ON_THE_GATE_B_MEMBERSHIP_RELATION_ONLY",
        "NO_GEOMETRY_INDEX_COMPOSITOR_OR_RENDERER_AUTHORITY",
        "NO_WEST_ADMISSION_AUTHORITY"
      ],
      "parentRelations": [
        "REL_GATE_B_CONTAINS_EAST",
        "REL_GEOMETRY_SYSTEM_CONTAINS_PACKET_002"
      ],
      "childRelations": [],
      "peerRelations": [],
      "upstreamBoundaries": [
        "REL_GATE_B_ADAPTER_TRANSFERS_TO_PACKET_002",
        "REL_KERNEL_TRANSFERS_TO_PACKET_002"
      ],
      "downstreamBoundaries": [
        "REL_PACKET_002_CONTINUES_TO_ADMITTED_FRAME"
      ],
      "cardinalRole": "NONE",
      "cardinalStatus": "NONE",
      "cardinalCompleteness": "NOT_APPLICABLE",
      "orderingRules": [],
      "dependencyRelations": [],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js",
        "H_EARTH_POST_WEST_ADMITTED_GEOMETRY_TRANSFER_FILE_BIRTH_PACKET_002_PROVISIONAL_HANDOFF_v1"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "BYTE_COUNT",
        "CONTENT_SHA256"
      ]
    },
    {
      "nodeId": "H_EARTH_REPOSITORY_ARCHITECTURE",
      "nodeType": "COMPOSITE_UNIT",
      "nodeSubtype": "SYSTEM",
      "displayName": "H-Earth Repository Architecture",
      "description": "Root descriptive registry scope for the initial H-Earth architectural coverage.",
      "repositoryPaths": [],
      "repositoryOccurrences": [],
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_TARGET_1_SPECIFICATION"
      ],
      "authorityClass": "NO_AUTHORITY",
      "authorityPosture": "DESCRIPTIVE_ROOT_SCOPE_ONLY",
      "authoritySource": [
        "H_EARTH_MANIFEST_FILE_RENEWAL_RECURSIVE_CARDINAL_AUTHORITY_ARCHITECTURE_v2",
        "H_EARTH_REPOSITORY_REGISTRY_SPECIFICATION_v1"
      ],
      "authorityScope": [
        "INITIAL_PARTIAL_H_EARTH_REGISTRY_SCOPE"
      ],
      "authorityLimitations": [
        "ABSENCE_FROM_REGISTRY_DOES_NOT_MEAN_NO_AUTHORITY",
        "PARTIAL_COVERAGE"
      ],
      "parentRelations": [],
      "childRelations": [
        "REL_ROOT_CONTAINS_GEOMETRY_SYSTEM"
      ],
      "peerRelations": [],
      "upstreamBoundaries": [],
      "downstreamBoundaries": [],
      "cardinalRole": "NONE",
      "cardinalStatus": "NONE",
      "cardinalCompleteness": "CANDIDATE",
      "orderingRules": [],
      "dependencyRelations": [],
      "allowedMutationScope": "WITHHELD",
      "prohibitedMutations": [
        "AUTHORITY_TRANSFER_OR_COLLAPSE",
        "CALL_ORDER_CHANGE",
        "GITHUB_MUTATION",
        "IMPORT_PATH_CHANGE",
        "MANIFEST_MUTATION",
        "MERGE_OR_PRODUCTION_AUTHORITY_INFERENCE",
        "SOURCE_BEHAVIOR_CHANGE",
        "SOURCE_FILE_MOVE_OR_RENAME",
        "WORKFLOW_OR_VALIDATOR_INSTALLATION"
      ],
      "requiredValidations": [
        "AUTHORITY_NON_COLLAPSE",
        "EVIDENCE_REFERENCE_RESOLUTION",
        "REFERENTIAL_INTEGRITY",
        "SCHEMA_VALIDATION",
        "STOPPING_BOUNDARY_PRESENCE"
      ],
      "stoppingBoundaries": [
        "STOP_BEFORE_MANIFEST_MUTATION",
        "STOP_BEFORE_MERGE_OR_PRODUCTION_CLAIM",
        "STOP_BEFORE_REPOSITORY_MUTATION",
        "STOP_ON_HIGHER_AUTHORITY_CONFLICT",
        "STOP_ON_UNRESOLVED_CRITICAL_FIELD"
      ],
      "currentIdentityReferences": [
        "H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_v1"
      ],
      "lifecycleStatus": "CANDIDATE",
      "unresolvedFields": [
        "ACCEPTED_REPOSITORY_REGISTRY_PATH",
        "COMPLETE_EIGHTEEN_PATH_PACKAGE_REAUDIT"
      ]
    }
  ],
  "relations": [
    {
      "relationId": "REL_EAST_DEPENDS_ON_NORTH",
      "relationType": "DEPENDS_ON",
      "fromNodeId": "H_EARTH_GEOMETRY_KERNEL_EAST_FILE",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_NORTH_FILE",
      "scale": "FILE",
      "direction": "FROM_TO",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_REPOSITORY_KERNEL_FACADE"
      ],
      "order": {
        "group": "H_EARTH_KERNEL_DEPENDENCY_SEQUENCE",
        "index": 2
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "DECLARED_IMPORT_OR_DEPENDENCY_DIRECTION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_FACADE_EXPOSES_EAST",
      "relationType": "EXPOSES",
      "fromNodeId": "H_EARTH_GEOMETRY_KERNEL_FACADE_FILE",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_EAST_FILE",
      "scale": "FILE",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_REPOSITORY_KERNEL_EAST",
        "EVIDENCE_REPOSITORY_KERNEL_FACADE"
      ],
      "order": null,
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "PUBLIC_FACADE_EXPOSES_EXISTING_MEMBER_WITHOUT_AUTHORITY_TRANSFER",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_FACADE_EXPOSES_NORTH",
      "relationType": "EXPOSES",
      "fromNodeId": "H_EARTH_GEOMETRY_KERNEL_FACADE_FILE",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_NORTH_FILE",
      "scale": "FILE",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_REPOSITORY_KERNEL_FACADE",
        "EVIDENCE_REPOSITORY_KERNEL_NORTH"
      ],
      "order": null,
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "PUBLIC_FACADE_EXPOSES_EXISTING_MEMBER_WITHOUT_AUTHORITY_TRANSFER",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_FACADE_EXPOSES_SOUTH",
      "relationType": "EXPOSES",
      "fromNodeId": "H_EARTH_GEOMETRY_KERNEL_FACADE_FILE",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_SOUTH_FILE",
      "scale": "FILE",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_REPOSITORY_KERNEL_FACADE",
        "EVIDENCE_REPOSITORY_KERNEL_SOUTH"
      ],
      "order": null,
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "PUBLIC_FACADE_EXPOSES_EXISTING_MEMBER_WITHOUT_AUTHORITY_TRANSFER",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_FACADE_EXPOSES_WEST",
      "relationType": "EXPOSES",
      "fromNodeId": "H_EARTH_GEOMETRY_KERNEL_FACADE_FILE",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_WEST_FILE",
      "scale": "FILE",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_REPOSITORY_KERNEL_FACADE",
        "EVIDENCE_REPOSITORY_KERNEL_WEST"
      ],
      "order": null,
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "PUBLIC_FACADE_EXPOSES_EXISTING_MEMBER_WITHOUT_AUTHORITY_TRANSFER",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_GATE_B_ADAPTER_TRANSFERS_TO_PACKET_002",
      "relationType": "TRANSFERS_TO",
      "fromNodeId": "H_EARTH_GATE_B_WEST_ADAPTER_FILE",
      "toNodeId": "H_EARTH_PACKET_002_POST_WEST_TRANSFER_FILE",
      "scale": "OCCURRENCE",
      "direction": "FROM_TO",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_GATE_B_ADAPTER",
        "EVIDENCE_REPOSITORY_PACKET_002_GATE_B"
      ],
      "order": {
        "group": "H_EARTH_GATE_B_OPERATIONAL_CONTINUITY",
        "index": 3
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "GATE_B_ADMISSION_OCCURRENCE_TO_SHARED_PACKET_002_CONTINUATION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_GATE_B_CONTAINS_EAST",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_GATE_B_PHASE_A_FUNCTIONAL_CONTINUITY_UNIT",
      "toNodeId": "H_EARTH_PACKET_002_POST_WEST_TRANSFER_FILE",
      "scale": "OCCURRENCE",
      "direction": "FROM_TO",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_PACKET_002_GATE_B"
      ],
      "order": {
        "group": "H_EARTH_GATE_B_OBSERVED_CARDINAL_SEQUENCE",
        "index": 4
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "OBSERVED_GATE_B_CARDINAL_PARTICIPATION_NONCANONICAL",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "EAST",
      "roleStatus": "OBSERVED_CANDIDATE"
    },
    {
      "relationId": "REL_GATE_B_CONTAINS_NORTH",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_GATE_B_PHASE_A_FUNCTIONAL_CONTINUITY_UNIT",
      "toNodeId": "H_EARTH_GATE_B_ENVIRONMENT_FILE",
      "scale": "OCCURRENCE",
      "direction": "FROM_TO",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_GATE_B_ENVIRONMENT"
      ],
      "order": {
        "group": "H_EARTH_GATE_B_OBSERVED_CARDINAL_SEQUENCE",
        "index": 1
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "OBSERVED_GATE_B_CARDINAL_PARTICIPATION_NONCANONICAL",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NORTH",
      "roleStatus": "OBSERVED_CANDIDATE"
    },
    {
      "relationId": "REL_GATE_B_CONTAINS_SOUTH",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_GATE_B_PHASE_A_FUNCTIONAL_CONTINUITY_UNIT",
      "toNodeId": "H_EARTH_GATE_B_PROVIDER_FILE",
      "scale": "OCCURRENCE",
      "direction": "FROM_TO",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_GATE_B_PROVIDER"
      ],
      "order": {
        "group": "H_EARTH_GATE_B_OBSERVED_CARDINAL_SEQUENCE",
        "index": 2
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "OBSERVED_GATE_B_CARDINAL_PARTICIPATION_NONCANONICAL",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "SOUTH",
      "roleStatus": "OBSERVED_CANDIDATE"
    },
    {
      "relationId": "REL_GATE_B_CONTAINS_WEST",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_GATE_B_PHASE_A_FUNCTIONAL_CONTINUITY_UNIT",
      "toNodeId": "H_EARTH_GATE_B_WEST_ADAPTER_FILE",
      "scale": "OCCURRENCE",
      "direction": "FROM_TO",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_GATE_B_ADAPTER"
      ],
      "order": {
        "group": "H_EARTH_GATE_B_OBSERVED_CARDINAL_SEQUENCE",
        "index": 3
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "OBSERVED_GATE_B_CARDINAL_PARTICIPATION_NONCANONICAL",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "WEST",
      "roleStatus": "OBSERVED_CANDIDATE"
    },
    {
      "relationId": "REL_GATE_B_ENVIRONMENT_CONTINUES_TO_PROVIDER",
      "relationType": "CONTINUES_TO",
      "fromNodeId": "H_EARTH_GATE_B_ENVIRONMENT_FILE",
      "toNodeId": "H_EARTH_GATE_B_PROVIDER_FILE",
      "scale": "OCCURRENCE",
      "direction": "FROM_TO",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_GATE_B_ENVIRONMENT",
        "EVIDENCE_REPOSITORY_GATE_B_PROVIDER"
      ],
      "order": {
        "group": "H_EARTH_GATE_B_OPERATIONAL_CONTINUITY",
        "index": 1
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "ENVIRONMENT_FRAME_TO_GEOMETRY_CONSTRUCTION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_GATE_B_PROVIDER_ADMITS_INTO_ADAPTER",
      "relationType": "ADMITS_INTO",
      "fromNodeId": "H_EARTH_GATE_B_PROVIDER_FILE",
      "toNodeId": "H_EARTH_GATE_B_WEST_ADAPTER_FILE",
      "scale": "OCCURRENCE",
      "direction": "FROM_TO",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_GATE_B_ADAPTER",
        "EVIDENCE_REPOSITORY_GATE_B_PROVIDER"
      ],
      "order": {
        "group": "H_EARTH_GATE_B_OPERATIONAL_CONTINUITY",
        "index": 2
      },
      "authorityEffect": "ADAPTER_ORCHESTRATES_EXISTING_PUBLIC_WEST_AUTHORITY_AND_DOES_NOT_OWN_ADMISSION",
      "continuityEffect": "GATE_B_PROVIDER_RESULT_TO_PUBLIC_WEST_ADMISSION_PASSAGE",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_GATE_B_PROVIDER_CONSUMES_ENVIRONMENT",
      "relationType": "CONSUMES",
      "fromNodeId": "H_EARTH_GATE_B_PROVIDER_FILE",
      "toNodeId": "H_EARTH_GATE_B_ENVIRONMENT_FILE",
      "scale": "FILE",
      "direction": "FROM_TO",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_REPOSITORY_GATE_B_ENVIRONMENT",
        "EVIDENCE_REPOSITORY_GATE_B_PROVIDER"
      ],
      "order": {
        "group": "H_EARTH_GATE_B_PROVIDER_DEPENDENCY",
        "index": 1
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "PROVIDER_CONSUMES_ENVIRONMENT_AUTHORITY_WITHOUT_RECONSTRUCTING_IT",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_GEOMETRY_SYSTEM_CONTAINS_ADMITTED_FRAME",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_GEOMETRY_CONTINUITY_SYSTEM",
      "toNodeId": "H_EARTH_ADMITTED_GEOMETRY_FRAME_FILE",
      "scale": "PACKET_BOUNDARY",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_ADMITTED_FRAME"
      ],
      "order": null,
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "DESCRIPTIVE_RELATION_ONLY",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_GEOMETRY_SYSTEM_CONTAINS_GATE_B_UNIT",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_GEOMETRY_CONTINUITY_SYSTEM",
      "toNodeId": "H_EARTH_GATE_B_PHASE_A_FUNCTIONAL_CONTINUITY_UNIT",
      "scale": "OCCURRENCE",
      "direction": "FROM_TO",
      "evidenceClass": "FUNCTIONALLY_INDICATED_CARDINAL_ROLE",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST"
      ],
      "order": null,
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "DESCRIPTIVE_RELATION_ONLY",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_GEOMETRY_SYSTEM_CONTAINS_KERNEL",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_GEOMETRY_CONTINUITY_SYSTEM",
      "toNodeId": "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT",
      "scale": "SYSTEM",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST"
      ],
      "order": null,
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "DESCRIPTIVE_RELATION_ONLY",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_GEOMETRY_SYSTEM_CONTAINS_PACKET_001",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_GEOMETRY_CONTINUITY_SYSTEM",
      "toNodeId": "H_EARTH_PACKET_001_SOURCE_RESOLUTION_FILE",
      "scale": "PACKET_BOUNDARY",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_PACKET_001"
      ],
      "order": null,
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "DESCRIPTIVE_RELATION_ONLY",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_GEOMETRY_SYSTEM_CONTAINS_PACKET_002",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_GEOMETRY_CONTINUITY_SYSTEM",
      "toNodeId": "H_EARTH_PACKET_002_POST_WEST_TRANSFER_FILE",
      "scale": "PACKET_BOUNDARY",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_PACKET_002_MAIN"
      ],
      "order": null,
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "DESCRIPTIVE_RELATION_ONLY",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_KERNEL_CONTAINS_EAST",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_EAST_FILE",
      "scale": "CARDINAL_UNIT",
      "direction": "FROM_TO",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_KERNEL_EAST"
      ],
      "order": {
        "group": "H_EARTH_KERNEL_CARDINAL_SEQUENCE",
        "index": 2
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "EXPLICIT_CARDINAL_MEMBER_PARTICIPATION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "EAST",
      "roleStatus": "EXPLICIT"
    },
    {
      "relationId": "REL_KERNEL_CONTAINS_FACADE",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_FACADE_FILE",
      "scale": "CARDINAL_UNIT",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_KERNEL_FACADE"
      ],
      "order": {
        "group": "H_EARTH_KERNEL_CARDINAL_SEQUENCE",
        "index": 5
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "FACADE_EXPOSURE_AFTER_DIRECTIONAL_MEMBER_DEFINITION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_KERNEL_CONTAINS_NORTH",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_NORTH_FILE",
      "scale": "CARDINAL_UNIT",
      "direction": "FROM_TO",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_KERNEL_NORTH"
      ],
      "order": {
        "group": "H_EARTH_KERNEL_CARDINAL_SEQUENCE",
        "index": 1
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "EXPLICIT_CARDINAL_MEMBER_PARTICIPATION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NORTH",
      "roleStatus": "EXPLICIT"
    },
    {
      "relationId": "REL_KERNEL_CONTAINS_SOUTH",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_SOUTH_FILE",
      "scale": "CARDINAL_UNIT",
      "direction": "FROM_TO",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_KERNEL_SOUTH"
      ],
      "order": {
        "group": "H_EARTH_KERNEL_CARDINAL_SEQUENCE",
        "index": 3
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "EXPLICIT_CARDINAL_MEMBER_PARTICIPATION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "SOUTH",
      "roleStatus": "EXPLICIT"
    },
    {
      "relationId": "REL_KERNEL_CONTAINS_WEST",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_WEST_FILE",
      "scale": "CARDINAL_UNIT",
      "direction": "FROM_TO",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_KERNEL_WEST"
      ],
      "order": {
        "group": "H_EARTH_KERNEL_CARDINAL_SEQUENCE",
        "index": 4
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "EXPLICIT_CARDINAL_MEMBER_PARTICIPATION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "WEST",
      "roleStatus": "EXPLICIT"
    },
    {
      "relationId": "REL_KERNEL_TRANSFERS_TO_PACKET_002",
      "relationType": "TRANSFERS_TO",
      "fromNodeId": "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT",
      "toNodeId": "H_EARTH_PACKET_002_POST_WEST_TRANSFER_FILE",
      "scale": "SYSTEM",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_PACKET_002_MAIN"
      ],
      "order": {
        "group": "H_EARTH_GEOMETRY_CONTINUITY_SEQUENCE",
        "index": 2
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "POST_WEST_EGRESS_AND_PACKET_002_CONTINUATION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_PACKET_001_RESOLVES_INTO_KERNEL",
      "relationType": "RESOLVES_INTO",
      "fromNodeId": "H_EARTH_PACKET_001_SOURCE_RESOLUTION_FILE",
      "toNodeId": "H_EARTH_CARDINAL_GEOMETRY_KERNEL_UNIT",
      "scale": "SYSTEM",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_PACKET_001"
      ],
      "order": {
        "group": "H_EARTH_GEOMETRY_CONTINUITY_SEQUENCE",
        "index": 1
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "PACKET_001_INGRESS_AND_SOURCE_RESOLUTION_PRECEDES_CARDINAL_KERNEL",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_PACKET_002_CONTINUES_TO_ADMITTED_FRAME",
      "relationType": "CONTINUES_TO",
      "fromNodeId": "H_EARTH_PACKET_002_POST_WEST_TRANSFER_FILE",
      "toNodeId": "H_EARTH_ADMITTED_GEOMETRY_FRAME_FILE",
      "scale": "SYSTEM",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST",
        "EVIDENCE_REPOSITORY_ADMITTED_FRAME",
        "EVIDENCE_REPOSITORY_PACKET_002_MAIN"
      ],
      "order": {
        "group": "H_EARTH_GEOMETRY_CONTINUITY_SEQUENCE",
        "index": 3
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "PACKET_002_TO_ADMITTED_FRAME_CONTINUATION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_ROOT_CONTAINS_GEOMETRY_SYSTEM",
      "relationType": "CONTAINS",
      "fromNodeId": "H_EARTH_REPOSITORY_ARCHITECTURE",
      "toNodeId": "H_EARTH_GEOMETRY_CONTINUITY_SYSTEM",
      "scale": "SYSTEM",
      "direction": "FROM_TO",
      "evidenceClass": "EXISTING_BOUNDARY_RELATION_OBSERVED",
      "evidenceReferences": [
        "EVIDENCE_RECURSIVE_CARDINAL_MANIFEST"
      ],
      "order": null,
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "DESCRIPTIVE_RELATION_ONLY",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_SOUTH_DEPENDS_ON_EAST",
      "relationType": "DEPENDS_ON",
      "fromNodeId": "H_EARTH_GEOMETRY_KERNEL_SOUTH_FILE",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_EAST_FILE",
      "scale": "FILE",
      "direction": "FROM_TO",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_REPOSITORY_KERNEL_FACADE"
      ],
      "order": {
        "group": "H_EARTH_KERNEL_DEPENDENCY_SEQUENCE",
        "index": 3
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "DECLARED_IMPORT_OR_DEPENDENCY_DIRECTION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_SOUTH_DEPENDS_ON_NORTH",
      "relationType": "DEPENDS_ON",
      "fromNodeId": "H_EARTH_GEOMETRY_KERNEL_SOUTH_FILE",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_NORTH_FILE",
      "scale": "FILE",
      "direction": "FROM_TO",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_REPOSITORY_KERNEL_FACADE"
      ],
      "order": {
        "group": "H_EARTH_KERNEL_DEPENDENCY_SEQUENCE",
        "index": 3
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "DECLARED_IMPORT_OR_DEPENDENCY_DIRECTION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_WEST_DEPENDS_ON_EAST",
      "relationType": "DEPENDS_ON",
      "fromNodeId": "H_EARTH_GEOMETRY_KERNEL_WEST_FILE",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_EAST_FILE",
      "scale": "FILE",
      "direction": "FROM_TO",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_REPOSITORY_KERNEL_FACADE"
      ],
      "order": {
        "group": "H_EARTH_KERNEL_DEPENDENCY_SEQUENCE",
        "index": 4
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "DECLARED_IMPORT_OR_DEPENDENCY_DIRECTION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_WEST_DEPENDS_ON_NORTH",
      "relationType": "DEPENDS_ON",
      "fromNodeId": "H_EARTH_GEOMETRY_KERNEL_WEST_FILE",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_NORTH_FILE",
      "scale": "FILE",
      "direction": "FROM_TO",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_REPOSITORY_KERNEL_FACADE"
      ],
      "order": {
        "group": "H_EARTH_KERNEL_DEPENDENCY_SEQUENCE",
        "index": 4
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "DECLARED_IMPORT_OR_DEPENDENCY_DIRECTION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    },
    {
      "relationId": "REL_WEST_DEPENDS_ON_SOUTH",
      "relationType": "DEPENDS_ON",
      "fromNodeId": "H_EARTH_GEOMETRY_KERNEL_WEST_FILE",
      "toNodeId": "H_EARTH_GEOMETRY_KERNEL_SOUTH_FILE",
      "scale": "FILE",
      "direction": "FROM_TO",
      "evidenceClass": "EXPLICIT_CARDINAL_IDENTITY",
      "evidenceReferences": [
        "EVIDENCE_REPOSITORY_KERNEL_FACADE"
      ],
      "order": {
        "group": "H_EARTH_KERNEL_DEPENDENCY_SEQUENCE",
        "index": 4
      },
      "authorityEffect": "NO_AUTHORITY_TRANSFER_OR_INHERITANCE",
      "continuityEffect": "DECLARED_IMPORT_OR_DEPENDENCY_DIRECTION",
      "mutationEffect": "NO_MUTATION_AUTHORITY_CREATED",
      "lifecycleStatus": "CANDIDATE",
      "roleWithinComposite": "NONE",
      "roleStatus": "NONE"
    }
  ],
  "unresolvedFields": [
    "ACCEPTED_REPOSITORY_REGISTRY_PATH",
    "ACCEPTED_REGISTRY_OCCURRENCE",
    "COMPLETE_EIGHTEEN_PATH_PACKAGE_REAUDIT",
    "CONTENT_SHA256_AND_BYTE_COUNTS_FOR_REPOSITORY_OCCURRENCES",
    "GATE_B_CARDINAL_CANONICALIZATION",
    "TOOL_INSTRUCTION_VALIDATOR_INSTALLATION_AND_WORKFLOW_ENFORCEMENT"
  ]
}
);


export const H_EARTH_REPOSITORY_REGISTRY_TARGET_2_ACCEPTANCE_TEST = deepFreeze(
{
  "targetTwoCompletionConditions": [
    "FORMAL_SCHEMA_ID_AND_VERSION_PRESENT",
    "MACHINE_FIELD_NAMES_AND_TYPES_PRESENT",
    "ENUMERATIONS_PRESENT",
    "REQUIRED_AND_CONDITIONAL_PROPERTIES_PRESENT",
    "CROSS_REFERENCE_RULES_PRESENT",
    "CARDINAL_COMPLETENESS_RULES_PRESENT",
    "EVIDENCE_CONSTRAINTS_PRESENT",
    "CUSTODY_CONSTRAINTS_PRESENT",
    "FAILURE_CASE_FIXTURES_PRESENT_AND_EXECUTED",
    "H_EARTH_CANDIDATE_REGISTRY_INSTANCE_PRESENT",
    "CANDIDATE_INSTANCE_SCHEMA_VALIDATION_PASS",
    "CANDIDATE_INSTANCE_SEMANTIC_VALIDATION_PASS",
    "ALL_FAILURE_FIXTURES_PASS",
    "NO_MANIFEST_OR_GITHUB_MUTATION"
  ],
  "targetTwoComplete": true,
  "canonicalAcceptanceClaimed": false,
  "userAcceptanceRequiredForPromotion": true,
  "acceptedRegistryPathStillDeferred": true,
  "toolInstructionValidatorInstallationAndWorkflowEnforcementStillDeferred": true
}
);


export const H_EARTH_REPOSITORY_REGISTRY_TARGET_2_PACKAGE = deepFreeze({
  identity: H_EARTH_REPOSITORY_REGISTRY_TARGET_2_IDENTITY,
  boundary: H_EARTH_REPOSITORY_REGISTRY_TARGET_2_BOUNDARY,
  registrySchema: H_EARTH_REPOSITORY_REGISTRY_SCHEMA,
  semanticConstraints: H_EARTH_REPOSITORY_REGISTRY_SEMANTIC_CONSTRAINTS,
  semanticRuleCatalog: H_EARTH_REPOSITORY_REGISTRY_SEMANTIC_RULE_CATALOG,
  failureFixtures: H_EARTH_REPOSITORY_REGISTRY_FAILURE_FIXTURES,
  fixtureExecutionReceipt: H_EARTH_REPOSITORY_REGISTRY_FIXTURE_EXECUTION_RECEIPT,
  candidateRegistryInstance: H_EARTH_REPOSITORY_REGISTRY_CANDIDATE_INSTANCE,
  acceptanceTest: H_EARTH_REPOSITORY_REGISTRY_TARGET_2_ACCEPTANCE_TEST
});

export function getHEarthRepositoryRegistryTarget2Package() {
  return H_EARTH_REPOSITORY_REGISTRY_TARGET_2_PACKAGE;
}

export default H_EARTH_REPOSITORY_REGISTRY_TARGET_2_PACKAGE;
