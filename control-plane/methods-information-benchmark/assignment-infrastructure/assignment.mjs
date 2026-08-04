import {
  parseArgs, required, boolArg, emit, readJson, initializeLedger,
  createFirstAssignment, admitAssignment, returnAssignment,
  withLedgerLock, writeLedgerAtomically, infrastructureFingerprint, fail
} from './assignment-core.mjs';

const command = process.argv[2];
const args = parseArgs();
let result;
if (command === 'initialize-ledger') {
  result = initializeLedger(required(args, 'genesis-head'), required(args, 'bootstrap-fingerprint'));
} else if (command === 'first-assignment') {
  const ledgerPath = required(args, 'ledger');
  result = withLedgerLock(ledgerPath, () => {
    const ledger = readJson(ledgerPath);
    const receipt = createFirstAssignment({
      ledger,
      expectedHead: required(args, 'expected-head'),
      eligibility: readJson(required(args, 'eligibility')),
      packet: readJson(required(args, 'operation-packet')),
      authorization: readJson(required(args, 'authorization')),
      holderExecutionId: required(args, 'holder'),
      testMode: boolArg(args['test-mode'])
    });
    writeLedgerAtomically(ledgerPath, ledger);
    return receipt;
  });
} else if (command === 'admission') {
  result = admitAssignment({
    ledger: readJson(required(args, 'ledger')),
    expectedHead: required(args, 'expected-head'),
    assignmentReceipt: readJson(required(args, 'assignment-receipt')),
    roleId: required(args, 'role'),
    operationId: required(args, 'operation'),
    holderExecutionId: required(args, 'holder'),
    testMode: boolArg(args['test-mode'])
  });
} else if (command === 'return-assignment') {
  const ledgerPath = required(args, 'ledger');
  result = withLedgerLock(ledgerPath, () => {
    const ledger = readJson(ledgerPath);
    const receipt = returnAssignment({
      ledger,
      expectedHead: required(args, 'expected-head'),
      assignmentReceipt: readJson(required(args, 'assignment-receipt')),
      returnPacket: readJson(required(args, 'return-packet')),
      testMode: boolArg(args['test-mode'])
    });
    writeLedgerAtomically(ledgerPath, ledger);
    return receipt;
  });
} else if (command === 'infrastructure-fingerprint') {
  const expectedHead = required(args, 'expected-head');
  const baseHead = required(args, 'base-head');
  const { payload, fingerprint } = infrastructureFingerprint(expectedHead, baseHead);
  result = {
    schema: 'METHODS_INFORMATION_BENCHMARK_GENERIC_FIRST_ASSIGNMENT_INFRASTRUCTURE_FINGERPRINT_v1',
    candidateHead: expectedHead,
    baseHead,
    fingerprint,
    fingerprintPayload: payload
  };
} else fail('UNKNOWN_COMMAND', command ?? '');
emit(result, args.output);
