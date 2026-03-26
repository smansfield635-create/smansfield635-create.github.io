const PSALM_STACK_KERNEL_META = Object.freeze({
  name: "psalm_stack_kernel",
  version: "G1",
  role: "website_information_architecture_kernel",
  deterministic: true,
  mutatesState: false,
  sourceOfTruth: true
});

const PSALM_STACK_KERNEL_CONSTANTS = Object.freeze({
  STATE_GROUPS: Object.freeze([
    "ORIENTATION",
    "PRESSURE",
    "TRANSITION",
    "REFLECTION",
    "RETURN"
  ]),
  ACK_STATES: Object.freeze([
    "UNREAD",
    "RECEIVED",
    "INTEGRATED",
    "COMPLETED"
  ]),
  REQUIRED_SONG_COUNT: 5,
  REQUIRED_GROUP_ORDER: Object.freeze([
    "ORIENTATION",
    "PRESSURE",
    "TRANSITION",
    "REFLECTION",
    "RETURN"
  ]),
  RECEIPT_VERSION: "PSALM_STACK_RECEIPT_G1"
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }
  return value;
}

function invariant(condition, message) {
  if (!condition) throw new Error(`[psalm_stack_kernel] ${message}`);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function checksum(text) {
  let acc = 19;
  for (let i = 0; i < text.length; i += 1) {
    acc = (acc * 37 + text.charCodeAt(i)) % 1000000007;
  }
  return String(acc);
}

function normalizeAckState(state) {
  const next = state || "UNREAD";
  invariant(
    PSALM_STACK_KERNEL_CONSTANTS.ACK_STATES.includes(next),
    `invalid acknowledgment state: ${next}`
  );
  return next;
}

function normalizeStateGroup(group, index) {
  const resolved = group || PSALM_STACK_KERNEL_CONSTANTS.REQUIRED_GROUP_ORDER[index];
  invariant(
    PSALM_STACK_KERNEL_CONSTANTS.STATE_GROUPS.includes(resolved),
    `invalid state group: ${resolved}`
  );
  return resolved;
}

function createSong(input, index, totalCount) {
  invariant(input && typeof input === "object", `song ${index} must be an object`);
  invariant(isNonEmptyString(input.song_id), `song ${index} missing song_id`);
  invariant(isNonEmptyString(input.song_title), `song ${index} missing song_title`);
  invariant(isNonEmptyString(input.state_role), `song ${index} missing state_role`);

  const state_group = normalizeStateGroup(input.state_group, index);
  const expectedGroup = PSALM_STACK_KERNEL_CONSTANTS.REQUIRED_GROUP_ORDER[index];

  invariant(
    state_group === expectedGroup,
    `song ${index} state_group must preserve canonical order: expected ${expectedGroup}, received ${state_group}`
  );

  const song = {
    song_id: input.song_id.trim(),
    song_title: input.song_title.trim(),
    state_group,
    state_role: input.state_role.trim(),
    upstream_dependency: index === 0 ? null : input.upstream_dependency || null,
    downstream_dependency: index === totalCount - 1 ? null : input.downstream_dependency || null,
    independent_readability:
      typeof input.independent_readability === "boolean" ? input.independent_readability : true,
    collective_function: isNonEmptyString(input.collective_function)
      ? input.collective_function.trim()
      : input.state_role.trim(),
    acknowledgment_state: normalizeAckState(input.acknowledgment_state)
  };

  if (index > 0) {
    invariant(
      isNonEmptyString(song.upstream_dependency),
      `song ${song.song_id} must declare upstream_dependency`
    );
  }

  if (index < totalCount - 1) {
    invariant(
      isNonEmptyString(song.downstream_dependency),
      `song ${song.song_id} must declare downstream_dependency`
    );
  }

  return deepFreeze(song);
}

function validateDependencyOrder(songs) {
  for (let i = 0; i < songs.length; i += 1) {
    const song = songs[i];
    const prev = i > 0 ? songs[i - 1] : null;
    const next = i < songs.length - 1 ? songs[i + 1] : null;

    if (prev) {
      invariant(
        song.upstream_dependency === prev.song_id,
        `song ${song.song_id} upstream_dependency must equal ${prev.song_id}`
      );
    } else {
      invariant(song.upstream_dependency === null, `first song must not declare upstream dependency`);
    }

    if (next) {
      invariant(
        song.downstream_dependency === next.song_id,
        `song ${song.song_id} downstream_dependency must equal ${next.song_id}`
      );
    } else {
      invariant(song.downstream_dependency === null, `last song must not declare downstream dependency`);
    }
  }

  return true;
}

function computeCollectiveCompletion(songs) {
  const states = songs.map((song) => song.acknowledgment_state);

  if (states.every((state) => state === "COMPLETED")) return "COMPLETED";
  if (states.every((state) => state === "UNREAD")) return "UNREAD";
  if (states.every((state) => state === "UNREAD" || state === "RECEIVED")) return "RECEIVED";
  return "INTEGRATED";
}

function buildTraversal(songs) {
  return deepFreeze(
    songs.map((song, index) =>
      deepFreeze({
        step: index + 1,
        song_id: song.song_id,
        song_title: song.song_title,
        state_group: song.state_group,
        previous_song_id: index > 0 ? songs[index - 1].song_id : null,
        next_song_id: index < songs.length - 1 ? songs[index + 1].song_id : null
      })
    )
  );
}

function buildReceipt(stack) {
  const payload = JSON.stringify({
    stack_id: stack.stack_id,
    stack_title: stack.stack_title,
    governing_state_arc: stack.governing_state_arc,
    collective_purpose: stack.collective_purpose,
    songs: stack.songs.map((song) => ({
      song_id: song.song_id,
      state_group: song.state_group,
      acknowledgment_state: song.acknowledgment_state
    }))
  });

  return deepFreeze({
    receipt_version: PSALM_STACK_KERNEL_CONSTANTS.RECEIPT_VERSION,
    kernel: PSALM_STACK_KERNEL_META.name,
    version: PSALM_STACK_KERNEL_META.version,
    stack_id: stack.stack_id,
    song_count: stack.songs.length,
    collective_completion_state: stack.collective_completion_state,
    checksum: checksum(payload)
  });
}

function createPsalmStack(input) {
  invariant(input && typeof input === "object", "psalm stack input must be an object");
  invariant(isNonEmptyString(input.stack_id), "stack_id is required");
  invariant(isNonEmptyString(input.stack_title), "stack_title is required");
  invariant(isNonEmptyString(input.governing_state_arc), "governing_state_arc is required");
  invariant(isNonEmptyString(input.collective_purpose), "collective_purpose is required");
  invariant(Array.isArray(input.songs), "songs must be an array");
  invariant(
    input.songs.length === PSALM_STACK_KERNEL_CONSTANTS.REQUIRED_SONG_COUNT,
    `songs must contain exactly ${PSALM_STACK_KERNEL_CONSTANTS.REQUIRED_SONG_COUNT} items`
  );

  const songs = input.songs.map((song, index) =>
    createSong(song, index, input.songs.length)
  );

  validateDependencyOrder(songs);

  const stack = {
    stack_id: input.stack_id.trim(),
    stack_title: input.stack_title.trim(),
    governing_state_arc: input.governing_state_arc.trim(),
    collective_purpose: input.collective_purpose.trim(),
    songs: deepFreeze(songs),
    state_arc: deepFreeze(
      songs.map((song) => deepFreeze({
        song_id: song.song_id,
        state_group: song.state_group,
        state_role: song.state_role
      }))
    ),
    traversal: buildTraversal(songs),
    collective_completion_state: computeCollectiveCompletion(songs)
  };

  return deepFreeze({
    ...stack,
    receipt: buildReceipt(stack)
  });
}

function updateSongAcknowledgment(stack, songId, nextState) {
  invariant(stack && typeof stack === "object", "stack is required");
  invariant(isNonEmptyString(songId), "songId is required");

  const normalizedState = normalizeAckState(nextState);
  const nextSongs = stack.songs.map((song) => {
    if (song.song_id !== songId) return clone(song);
    return {
      ...clone(song),
      acknowledgment_state: normalizedState
    };
  });

  invariant(
    nextSongs.some((song) => song.song_id === songId),
    `song ${songId} not found in stack`
  );

  return createPsalmStack({
    stack_id: stack.stack_id,
    stack_title: stack.stack_title,
    governing_state_arc: stack.governing_state_arc,
    collective_purpose: stack.collective_purpose,
    songs: nextSongs
  });
}

function getSongById(stack, songId) {
  invariant(stack && typeof stack === "object", "stack is required");
  invariant(isNonEmptyString(songId), "songId is required");

  const song = stack.songs.find((entry) => entry.song_id === songId) || null;
  return song ? deepFreeze(song) : null;
}

function getNextSong(stack, songId) {
  invariant(stack && typeof stack === "object", "stack is required");
  invariant(isNonEmptyString(songId), "songId is required");

  const index = stack.songs.findIndex((entry) => entry.song_id === songId);
  invariant(index >= 0, `song ${songId} not found`);

  return index < stack.songs.length - 1 ? stack.songs[index + 1] : null;
}

function getPreviousSong(stack, songId) {
  invariant(stack && typeof stack === "object", "stack is required");
  invariant(isNonEmptyString(songId), "songId is required");

  const index = stack.songs.findIndex((entry) => entry.song_id === songId);
  invariant(index >= 0, `song ${songId} not found`);

  return index > 0 ? stack.songs[index - 1] : null;
}

function validateStack(stack) {
  invariant(stack && typeof stack === "object", "stack is required");
  invariant(Array.isArray(stack.songs), "stack songs missing");
  invariant(
    stack.songs.length === PSALM_STACK_KERNEL_CONSTANTS.REQUIRED_SONG_COUNT,
    "stack song count invalid"
  );

  validateDependencyOrder(stack.songs);

  const groupOrderValid = stack.songs.every(
    (song, index) =>
      song.state_group === PSALM_STACK_KERNEL_CONSTANTS.REQUIRED_GROUP_ORDER[index]
  );

  const ackStateValid = stack.songs.every((song) =>
    PSALM_STACK_KERNEL_CONSTANTS.ACK_STATES.includes(song.acknowledgment_state)
  );

  return deepFreeze({
    stackShapeValid: isNonEmptyString(stack.stack_id) &&
      isNonEmptyString(stack.stack_title) &&
      isNonEmptyString(stack.governing_state_arc) &&
      isNonEmptyString(stack.collective_purpose),
    songCountValid:
      stack.songs.length === PSALM_STACK_KERNEL_CONSTANTS.REQUIRED_SONG_COUNT,
    groupOrderValid,
    dependencyOrderValid: true,
    acknowledgmentStateValid: ackStateValid,
    traversalContinuityValid: Array.isArray(stack.traversal) &&
      stack.traversal.length === PSALM_STACK_KERNEL_CONSTANTS.REQUIRED_SONG_COUNT,
    receiptValid:
      stack.receipt &&
      stack.receipt.receipt_version === PSALM_STACK_KERNEL_CONSTANTS.RECEIPT_VERSION &&
      stack.receipt.song_count === PSALM_STACK_KERNEL_CONSTANTS.REQUIRED_SONG_COUNT
  });
}

const EXAMPLE_STACK = createPsalmStack({
  stack_id: "STACK_CROSSING_FROM_FRAGMENTATION_TO_ALIGNMENT",
  stack_title: "CROSSING_FROM_FRAGMENTATION_TO_ALIGNMENT",
  governing_state_arc: "BASELINE_TO_RESTORATION",
  collective_purpose: "guide ordered movement from fragmentation to alignment",
  songs: [
    {
      song_id: "SONG_1_RECOGNITION",
      song_title: "THE_RECOGNITION",
      state_group: "ORIENTATION",
      state_role: "name_the_true_start_state",
      upstream_dependency: null,
      downstream_dependency: "SONG_2_WEIGHT",
      collective_function: "establish baseline and truth",
      acknowledgment_state: "UNREAD"
    },
    {
      song_id: "SONG_2_WEIGHT",
      song_title: "THE_WEIGHT",
      state_group: "PRESSURE",
      state_role: "surface_the_actual_burden",
      upstream_dependency: "SONG_1_RECOGNITION",
      downstream_dependency: "SONG_3_CROSSING",
      collective_function: "diagnose tension and burden",
      acknowledgment_state: "UNREAD"
    },
    {
      song_id: "SONG_3_CROSSING",
      song_title: "THE_CROSSING",
      state_group: "TRANSITION",
      state_role: "govern_the_lawful_move",
      upstream_dependency: "SONG_2_WEIGHT",
      downstream_dependency: "SONG_4_MIRROR",
      collective_function: "perform lawful transition",
      acknowledgment_state: "UNREAD"
    },
    {
      song_id: "SONG_4_MIRROR",
      song_title: "THE_MIRROR",
      state_group: "REFLECTION",
      state_role: "interpret_the_change",
      upstream_dependency: "SONG_3_CROSSING",
      downstream_dependency: "SONG_5_RETURN",
      collective_function: "integrate revealed change",
      acknowledgment_state: "UNREAD"
    },
    {
      song_id: "SONG_5_RETURN",
      song_title: "THE_RETURN",
      state_group: "RETURN",
      state_role: "re_enter_with_integrated_state",
      upstream_dependency: "SONG_4_MIRROR",
      downstream_dependency: null,
      collective_function: "close and recenter the stack",
      acknowledgment_state: "UNREAD"
    }
  ]
});

const psalmStackKernel = deepFreeze({
  meta: PSALM_STACK_KERNEL_META,
  constants: PSALM_STACK_KERNEL_CONSTANTS,

  getMeta() {
    return PSALM_STACK_KERNEL_META;
  },

  getConstants() {
    return PSALM_STACK_KERNEL_CONSTANTS;
  },

  createPsalmStack,

  getExampleStack() {
    return EXAMPLE_STACK;
  },

  getSongById,

  getNextSong,

  getPreviousSong,

  updateSongAcknowledgment,

  validateStack
});

export default psalmStackKernel;
