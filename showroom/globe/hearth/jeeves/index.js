// TARGET FILE: /showroom/globe/hearth/jeeves/index.js
// TNT FULL-FILE REPLACEMENT
// DIAMOND_GATE_BRIDGE_JEEVES_ESTATE_HOST_CONVERSATION_RUNTIME_TNT_v2
//
// Purpose:
// - Consume /assets/hearth/jeeves/jeeves.voice.js through window.JEEVES_VOICE.
// - Mount Jeeves's estate-host conversation surface.
// - Coordinate conversation activation with the estate-threshold introduction.
// - Keep automatic opening dialogue limited to two messages.
// - Separate typing delay from reading dwell.
// - Reveal one Jeeves message at a time.
// - Allow the visitor to rush only the current typing or reading interval.
// - Render register-aware dialogue, visitor choices, follow-up choices,
//   and one contextual route card at a time.
// - Maintain live conversation telemetry and prompt-state guidance.
// - Preserve real anchor navigation for every room and specialist handoff.
// - Coordinate replay controls and compact supporting disclosures.
// - Support keyboard use, reduced motion, controlled thread scrolling,
//   cancellation, restart, graceful threshold fallback, and graceful
//   voice-authority failure.
//
// Owns:
// - Jeeves conversation mounting
// - conversation state
// - typing and reading timing
// - current-wait rush behavior
// - prompt locking
// - live thread telemetry
// - contextual route-card rendering
// - threshold-to-conversation activation coordination
// - replay-welcome control dispatch
// - compact disclosure coordination
// - runtime receipts and public API
//
// Does not own:
// - Jeeves's identity or dialogue text
// - Jeeves's route catalog
// - Mirrorland geometry
// - threshold rendering
// - threshold phase presentation
// - page styling
// - specialist interpretation
// - destination-page content
// - protected architecture
//

(() => {
  "use strict";

  const CONTRACT =
    "DIAMOND_GATE_BRIDGE_JEEVES_ESTATE_HOST_CONVERSATION_RUNTIME_TNT_v2";

  const GLOBAL_NAME =
    "JEEVES_RUNTIME";

  const VOICE_EVENT =
    "jeeves:voice-ready";

  const RUNTIME_EVENT =
    "jeeves:runtime-ready";

  const MODE_EVENT =
    "jeeves:mode-change";

  const DIALOGUE_EVENT =
    "jeeves:dialogue-complete";

  const PATHWAY_EVENT =
    "jeeves:pathway-reveal";

  const ERROR_EVENT =
    "jeeves:runtime-error";

  const THRESHOLD_READY_EVENT =
    "jeeves:threshold-ready";

  const THRESHOLD_COMPLETE_EVENT =
    "jeeves:threshold-complete";

  const THRESHOLD_SKIP_EVENT =
    "jeeves:threshold-skip";

  const THRESHOLD_REPLAY_REQUEST_EVENT =
    "jeeves:threshold-replay-request";

  const THRESHOLD_REPLAY_EVENT =
    "jeeves:threshold-replay";

  const CONVERSATION_ACTIVATED_EVENT =
    "jeeves:conversation-activated";

  const DEFAULT_MODE =
    "welcome";

  const ROOT_SELECTOR =
    "[data-jeeves-app], [data-jeeves-root]";

  const PAGE_SELECTOR =
    "[data-jeeves-page]";

  const THRESHOLD_SELECTOR =
    "[data-jeeves-threshold]";

  const RUSH_TARGET_SELECTOR =
    "[data-jeeves-rush-target]";

  const INTERACTIVE_SELECTOR =
    [
      "button",
      "a",
      "summary",
      "input",
      "textarea",
      "select",
      "[role='button']",
      "[role='link']"
    ].join(", ");

  const WAIT_STATES =
    Object.freeze({
      IDLE: "idle",
      TYPING: "typing",
      READING: "reading"
    });

  const THRESHOLD_STATES =
    Object.freeze({
      GUIDED: "guided",
      OPEN: "open"
    });

  const instances =
    new Map();

  let bootAttempted =
    false;

  let voiceFailureTimer =
    null;

  let thresholdFallbackTimer =
    null;

  if (
    Object.prototype.hasOwnProperty.call(
      window,
      GLOBAL_NAME
    )
  ) {
    return;
  }

  const query = (
    selector,
    root = document
  ) => root.querySelector(selector);

  const queryAll = (
    selector,
    root = document
  ) => Array.from(
    root.querySelectorAll(selector)
  );

  const normalize = value => {
    if (
      value === null ||
      typeof value === "undefined"
    ) {
      return "";
    }

    return String(value)
      .replace(/\s+/g, " ")
      .trim();
  };

  const isElement = value =>
    value instanceof Element;

  const clamp = (
    value,
    minimum,
    maximum
  ) => Math.max(
    minimum,
    Math.min(maximum, value)
  );

  const clearNode = node => {
    if (!node) {
      return;
    }

    while (node.firstChild) {
      node.removeChild(
        node.firstChild
      );
    }
  };

  const emit = (
    name,
    detail = {}
  ) => {
    if (
      typeof window.dispatchEvent !==
        "function" ||
      typeof window.CustomEvent !==
        "function"
    ) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        name,
        {
          detail: Object.freeze({
            ...detail
          })
        }
      )
    );
  };

  const emitError = (
    code,
    detail = {}
  ) => {
    emit(
      ERROR_EVENT,
      {
        contract: CONTRACT,
        code,
        ...detail
      }
    );
  };

  const getVoice = () => {
    const voice =
      window.JEEVES_VOICE;

    if (
      !voice ||
      voice.ready !== true ||
      typeof voice.getMode !==
        "function" ||
      typeof voice.getDialogue !==
        "function" ||
      typeof voice.getRegister !==
        "function" ||
      typeof voice.getMainOptions !==
        "function" ||
      typeof voice.getFollowupOptions !==
        "function" ||
      typeof voice.validateDialogue !==
        "function" ||
      typeof voice.getOpening !==
        "function" ||
      typeof voice.getRoute !==
        "function"
    ) {
      return null;
    }

    return voice;
  };

  const getStateId = root => {
    const existing =
      normalize(
        root.getAttribute(
          "data-jeeves-instance"
        )
      );

    if (existing) {
      return existing;
    }

    const generated =
      `jeeves-${instances.size + 1}`;

    root.setAttribute(
      "data-jeeves-instance",
      generated
    );

    return generated;
  };

  const prefersReducedMotion = () => {
    if (
      typeof window.matchMedia !==
        "function"
    ) {
      return false;
    }

    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  };

  const countWords = text => {
    const normalized =
      normalize(text);

    if (!normalized) {
      return 0;
    }

    return normalized
      .split(/\s+/)
      .filter(Boolean)
      .length;
  };

  const isNearThreadBottom = thread => {
    if (!thread) {
      return true;
    }

    const remaining =
      thread.scrollHeight -
      thread.scrollTop -
      thread.clientHeight;

    return remaining < 120;
  };

  const scrollThread = (
    state,
    force = false
  ) => {
    if (!state.thread) {
      return;
    }

    if (
      !force &&
      !state.userNearBottom
    ) {
      return;
    }

    const behavior =
      state.reducedMotion
        ? "auto"
        : "smooth";

    if (
      typeof state.thread.scrollTo ===
        "function"
    ) {
      state.thread.scrollTo({
        top: state.thread.scrollHeight,
        behavior
      });

      return;
    }

    state.thread.scrollTop =
      state.thread.scrollHeight;
  };

  const setText = (
    node,
    value
  ) => {
    if (!node) {
      return;
    }

    node.textContent =
      normalize(value);
  };

  const setStatus = (
    state,
    statusKey,
    fallback
  ) => {
    const voice =
      state.voice;

    const copy =
      voice &&
      voice.ui &&
      voice.ui.status
        ? voice.ui.status[statusKey]
        : "";

    const message =
      normalize(
        copy ||
        fallback
      );

    state.root.setAttribute(
      "data-jeeves-status-state",
      statusKey
    );

    setText(
      state.status,
      message
    );
  };

  const setThreadTelemetry = (
    state,
    {
      stage,
      signal,
      threadState
    } = {}
  ) => {
    if (stage) {
      setText(
        state.threadStage,
        stage
      );
    }

    if (signal) {
      setText(
        state.threadSignal,
        signal
      );
    }

    if (
      state.rushTarget &&
      threadState
    ) {
      state.rushTarget.setAttribute(
        "data-jeeves-thread-state",
        threadState
      );
    }
  };

  const setPromptStatus = (
    state,
    text
  ) => {
    setText(
      state.promptStatus,
      text
    );
  };

  const setTyping = (
    state,
    active,
    registerId = ""
  ) => {
    state.speaking =
      Boolean(active);

    state.root.setAttribute(
      "data-jeeves-speaking",
      active ? "true" : "false"
    );

    state.root.setAttribute(
      "data-jeeves-register",
      normalize(registerId)
    );

    if (!state.typing) {
      return;
    }

    state.typing.setAttribute(
      "data-jeeves-typing",
      active ? "true" : "false"
    );

    state.typing.setAttribute(
      "aria-hidden",
      active ? "false" : "true"
    );

    state.typing.hidden =
      !active;
  };

  const setOptionsLocked = (
    state,
    locked
  ) => {
    state.optionsLocked =
      Boolean(locked);

    state.root.setAttribute(
      "data-jeeves-options-locked",
      locked ? "true" : "false"
    );

    if (!state.options) {
      return;
    }

    queryAll(
      "button",
      state.options
    ).forEach(button => {
      button.disabled =
        Boolean(locked);

      button.setAttribute(
        "aria-disabled",
        locked ? "true" : "false"
      );
    });
  };

  const setOptionsVisibility = (
    state,
    visible
  ) => {
    state.root.setAttribute(
      "data-jeeves-options-ready",
      visible ? "true" : "false"
    );

    if (state.options) {
      state.options.hidden =
        !visible;
    }
  };

  const setWaitState = (
    state,
    waitState,
    {
      rushAvailable = false,
      cue = "",
      signal = "",
      promptStatus = ""
    } = {}
  ) => {
    const normalizedState =
      Object.values(WAIT_STATES)
        .includes(waitState)
        ? waitState
        : WAIT_STATES.IDLE;

    state.waitState =
      normalizedState;

    state.rushAvailable =
      Boolean(rushAvailable);

    state.root.setAttribute(
      "data-jeeves-delay-state",
      normalizedState
    );

    state.root.setAttribute(
      "data-jeeves-rush-available",
      rushAvailable
        ? "true"
        : "false"
    );

    if (state.rushTarget) {
      state.rushTarget.setAttribute(
        "data-jeeves-rush-available",
        rushAvailable
          ? "true"
          : "false"
      );
    }

    if (state.rushControl) {
      state.rushControl.hidden =
        !rushAvailable;

      state.rushControl.disabled =
        !rushAvailable;

      state.rushControl.setAttribute(
        "aria-disabled",
        rushAvailable
          ? "false"
          : "true"
      );

      if (
        normalizedState ===
        WAIT_STATES.TYPING
      ) {
        state.rushControl.textContent =
          "Reveal this message";
      } else if (
        normalizedState ===
        WAIT_STATES.READING
      ) {
        state.rushControl.textContent =
          "Continue when ready";
      } else {
        state.rushControl.textContent =
          "Continue";
      }
    }

    if (state.conversationCue) {
      const cueText =
        normalize(cue);

      state.conversationCue.hidden =
        !rushAvailable ||
        !cueText;

      if (cueText) {
        state.conversationCue.textContent =
          cueText;
      }
    }

    if (signal) {
      setText(
        state.threadSignal,
        signal
      );
    }

    if (promptStatus) {
      setPromptStatus(
        state,
        promptStatus
      );
    }
  };

  const setIdleState = state => {
    setWaitState(
      state,
      WAIT_STATES.IDLE,
      {
        rushAvailable: false,
        signal: "Host ready",
        promptStatus:
          state.options &&
          !state.options.hidden
            ? "Choose the direction that best matches your visit."
            : "Jeeves is ready."
      }
    );

    setTyping(
      state,
      false
    );

    setThreadTelemetry(
      state,
      {
        stage: "Reception channel",
        signal: "Host ready",
        threadState: "ready"
      }
    );
  };

  const setModePresentation = (
    state,
    mode
  ) => {
    state.root.setAttribute(
      "data-jeeves-mode",
      mode.id
    );

    setText(
      state.modeLabel,
      mode.eyebrow ||
      mode.label ||
      "Front Door Reception"
    );

    setText(
      state.modeTitle,
      mode.title ||
      mode.label ||
      "Tell me what brought you to the estate."
    );
  };

  const createBubble = ({
    kind,
    text,
    register,
    label
  }) => {
    const article =
      document.createElement(
        "article"
      );

    const bubbleKind =
      normalize(kind) ||
      "jeeves";

    const registerId =
      normalize(register) ||
      "orientation";

    article.className =
      [
        "jeeves-bubble",
        `jeeves-bubble-${bubbleKind}`,
        `jeeves-register-${registerId}`
      ].join(" ");

    article.setAttribute(
      "data-jeeves-bubble",
      bubbleKind
    );

    article.setAttribute(
      "data-jeeves-register",
      registerId
    );

    if (label) {
      const eyebrow =
        document.createElement(
          "span"
        );

      eyebrow.className =
        "jeeves-bubble-label";

      eyebrow.textContent =
        normalize(label);

      article.appendChild(
        eyebrow
      );
    }

    const body =
      document.createElement(
        "div"
      );

    body.className =
      "jeeves-bubble-body";

    body.textContent =
      normalize(text);

    article.appendChild(
      body
    );

    return article;
  };

  const appendBubble = (
    state,
    bubble,
    forceScroll = true
  ) => {
    if (
      !state.thread ||
      !bubble
    ) {
      return;
    }

    state.thread.appendChild(
      bubble
    );

    scrollThread(
      state,
      forceScroll
    );
  };

  const appendUserPrompt = (
    state,
    text
  ) => {
    appendBubble(
      state,
      createBubble({
        kind: "user",
        register: "clarification",
        label: "Visitor",
        text
      })
    );
  };

  const appendSystemMessage = (
    state,
    text,
    register = "boundary"
  ) => {
    appendBubble(
      state,
      createBubble({
        kind: "system",
        register,
        text
      })
    );
  };

  const clearTimer = state => {
    if (
      state.pendingTimer !== null
    ) {
      window.clearTimeout(
        state.pendingTimer
      );

      state.pendingTimer =
        null;
    }
  };

  const releasePendingWait = (
    state,
    advanced = false
  ) => {
    if (
      typeof state.pendingResolve !==
        "function"
    ) {
      clearTimer(state);
      return false;
    }

    const resolve =
      state.pendingResolve;

    state.pendingResolve =
      null;

    clearTimer(state);

    resolve({
      advanced:
        Boolean(advanced)
    });

    return true;
  };

  const cancelSequence = state => {
    state.sequenceToken += 1;

    releasePendingWait(
      state,
      false
    );

    state.pendingWaitKind =
      WAIT_STATES.IDLE;

    setTyping(
      state,
      false
    );

    setOptionsLocked(
      state,
      false
    );

    setWaitState(
      state,
      WAIT_STATES.IDLE,
      {
        rushAvailable: false
      }
    );
  };

  const waitForSequence = (
    state,
    {
      delay,
      token,
      kind
    }
  ) => new Promise(resolve => {
    if (
      token !==
      state.sequenceToken
    ) {
      resolve({
        cancelled: true,
        advanced: false,
        kind
      });

      return;
    }

    let finished =
      false;

    const complete = advanced => {
      if (finished) {
        return;
      }

      finished =
        true;

      state.pendingResolve =
        null;

      state.pendingWaitKind =
        WAIT_STATES.IDLE;

      clearTimer(state);

      resolve({
        cancelled:
          token !==
          state.sequenceToken,
        advanced:
          Boolean(advanced),
        kind
      });
    };

    state.pendingResolve =
      complete;

    state.pendingWaitKind =
      kind;

    if (
      delay <= 0 ||
      state.reducedMotion
    ) {
      state.pendingTimer =
        window.setTimeout(
          () => complete(false),
          0
        );

      return;
    }

    state.pendingTimer =
      window.setTimeout(
        () => complete(false),
        delay
      );
  });

  const getRegister = (
    state,
    registerId
  ) => {
    if (
      !state.voice ||
      typeof state.voice.getRegister !==
        "function"
    ) {
      return null;
    }

    return state.voice.getRegister(
      registerId
    );
  };

  const getTypingDelay = (
    state,
    registerId,
    text,
    index
  ) => {
    if (state.reducedMotion) {
      return 0;
    }

    const register =
      getRegister(
        state,
        registerId
      );

    const pacing =
      register
        ? register.pacing
        : "deliberate";

    const baseByPacing = {
      immediate: 240,
      responsive: 520,
      measured: 720,
      deliberate: 900,
      soft: 820
    };

    const base =
      baseByPacing[pacing] ??
      760;

    const characterCount =
      normalize(text).length;

    const characterWeight =
      Math.min(
        900,
        characterCount * 4
      );

    const sequenceWeight =
      index === 0
        ? 0
        : 130;

    return Math.round(
      clamp(
        base +
        characterWeight +
        sequenceWeight,
        420,
        2100
      )
    );
  };

  const getReadingDelay = (
    state,
    registerId,
    text
  ) => {
    if (state.reducedMotion) {
      return 0;
    }

    const wordCount =
      countWords(text);

    const baseByRegister = {
      welcome: 900,
      orientation: 1000,
      clarification: 900,
      boundary: 1200,
      warning: 1250,
      handoff: 1100
    };

    const perWordByRegister = {
      welcome: 220,
      orientation: 225,
      clarification: 210,
      boundary: 240,
      warning: 245,
      handoff: 230
    };

    const base =
      baseByRegister[registerId] ??
      950;

    const perWord =
      perWordByRegister[registerId] ??
      220;

    return Math.round(
      clamp(
        base +
        wordCount * perWord,
        1500,
        5600
      )
    );
  };

  const setRegisterStatus = (
    state,
    registerId,
    waitState
  ) => {
    if (
      waitState ===
      WAIT_STATES.TYPING
    ) {
      if (
        registerId ===
          "boundary" ||
        registerId ===
          "warning"
      ) {
        setStatus(
          state,
          "boundary",
          "Jeeves is protecting the boundary."
        );
      } else if (
        registerId ===
          "handoff"
      ) {
        setStatus(
          state,
          "handoff",
          "Jeeves found the right door."
        );
      } else if (
        registerId ===
          "clarification"
      ) {
        setStatus(
          state,
          "clarifying",
          "Jeeves is considering your request."
        );
      } else {
        setStatus(
          state,
          "speaking",
          "Jeeves is preparing a response."
        );
      }

      return;
    }

    if (
      waitState ===
      WAIT_STATES.READING
    ) {
      setStatus(
        state,
        "reading",
        "Jeeves is allowing the message to settle."
      );

      return;
    }

    setStatus(
      state,
      "listening",
      "Jeeves is listening."
    );
  };

  const beginTypingWait = async (
    state,
    {
      registerId,
      text,
      index,
      token
    }
  ) => {
    setTyping(
      state,
      true,
      registerId
    );

    setRegisterStatus(
      state,
      registerId,
      WAIT_STATES.TYPING
    );

    setThreadTelemetry(
      state,
      {
        stage: "Incoming response",
        signal: "Jeeves is typing",
        threadState: "typing"
      }
    );

    setWaitState(
      state,
      WAIT_STATES.TYPING,
      {
        rushAvailable: true,
        cue:
          "Tap the conversation to reveal Jeeves’s current message sooner.",
        signal:
          "Jeeves is typing",
        promptStatus:
          "Jeeves is preparing the next message."
      }
    );

    return waitForSequence(
      state,
      {
        delay:
          getTypingDelay(
            state,
            registerId,
            text,
            index
          ),
        token,
        kind:
          WAIT_STATES.TYPING
      }
    );
  };

  const beginReadingWait = async (
    state,
    {
      registerId,
      text,
      token,
      hasNextMessage
    }
  ) => {
    setTyping(
      state,
      false,
      registerId
    );

    setRegisterStatus(
      state,
      registerId,
      WAIT_STATES.READING
    );

    setThreadTelemetry(
      state,
      {
        stage: "Message received",
        signal:
          hasNextMessage
            ? "Reading interval"
            : "Response settling",
        threadState: "reading"
      }
    );

    setWaitState(
      state,
      WAIT_STATES.READING,
      {
        rushAvailable:
          hasNextMessage,
        cue:
          hasNextMessage
            ? "Read at your own pace. Tap the conversation when you are ready for Jeeves’s next message."
            : "",
        signal:
          hasNextMessage
            ? "Reading interval"
            : "Response settling",
        promptStatus:
          hasNextMessage
            ? "The next message will begin after this reading interval."
            : "Jeeves is finishing the response."
      }
    );

    return waitForSequence(
      state,
      {
        delay:
          getReadingDelay(
            state,
            registerId,
            text
          ),
        token,
        kind:
          WAIT_STATES.READING
      }
    );
  };

  const speakMessages = async ({
    state,
    messages,
    register,
    token,
    onComplete
  }) => {
    const list =
      Array.isArray(messages)
        ? messages
        : [];

    setOptionsLocked(
      state,
      true
    );

    setOptionsVisibility(
      state,
      false
    );

    for (
      let index = 0;
      index < list.length;
      index += 1
    ) {
      if (
        token !==
        state.sequenceToken
      ) {
        return;
      }

      const entry =
        typeof list[index] ===
          "string"
          ? {
              text: list[index],
              register
            }
          : list[index];

      const text =
        normalize(
          entry &&
          entry.text
        );

      const registerId =
        normalize(
          entry &&
          entry.register
        ) ||
        register ||
        "orientation";

      if (!text) {
        continue;
      }

      const typingResult =
        await beginTypingWait(
          state,
          {
            registerId,
            text,
            index,
            token
          }
        );

      if (
        typingResult.cancelled ||
        token !==
          state.sequenceToken
      ) {
        return;
      }

      setTyping(
        state,
        false,
        registerId
      );

      appendBubble(
        state,
        createBubble({
          kind: "jeeves",
          register: registerId,
          label: "Jeeves",
          text
        })
      );

      const hasNextMessage =
        list
          .slice(index + 1)
          .some(item => {
            if (
              typeof item ===
                "string"
            ) {
              return Boolean(
                normalize(item)
              );
            }

            return Boolean(
              normalize(
                item &&
                item.text
              )
            );
          });

      const readingResult =
        await beginReadingWait(
          state,
          {
            registerId,
            text,
            token,
            hasNextMessage
          }
        );

      if (
        readingResult.cancelled ||
        token !==
          state.sequenceToken
      ) {
        return;
      }
    }

    if (
      token !==
      state.sequenceToken
    ) {
      return;
    }

    setTyping(
      state,
      false
    );

    setOptionsLocked(
      state,
      false
    );

    setIdleState(
      state
    );

    if (
      typeof onComplete ===
        "function"
    ) {
      onComplete();
    }
  };

  const createPromptButton = ({
    state,
    option,
    utilityAction
  }) => {
    const button =
      document.createElement(
        "button"
      );

    button.type =
      "button";

    button.className =
      utilityAction
        ? "jeeves-option jeeves-option-utility"
        : "jeeves-option";

    button.setAttribute(
      "data-jeeves-option",
      "true"
    );

    if (utilityAction) {
      button.setAttribute(
        "data-jeeves-option-action",
        utilityAction
      );
    } else {
      button.setAttribute(
        "data-jeeves-dialogue-id",
        option.id
      );

      button.setAttribute(
        "data-jeeves-register",
        option.register ||
        "orientation"
      );

      if (
        option.contextualRoute
      ) {
        button.setAttribute(
          "data-jeeves-route-preview",
          option.contextualRoute
        );
      }
    }

    button.textContent =
      utilityAction
        ? normalize(option)
        : normalize(option.label);

    button.addEventListener(
      "click",
      () => {
        if (
          state.optionsLocked ||
          state.speaking ||
          state.waitState !==
            WAIT_STATES.IDLE
        ) {
          return;
        }

        if (utilityAction) {
          handleUtilityAction(
            state,
            utilityAction
          );

          return;
        }

        beginDialogue(
          state,
          option.id
        );
      }
    );

    return button;
  };

  const renderPromptOptions = (
    state,
    options,
    {
      includeMainReturn = false
    } = {}
  ) => {
    if (!state.options) {
      return;
    }

    clearNode(
      state.options
    );

    const normalizedOptions =
      Array.isArray(options)
        ? options.filter(Boolean)
        : [];

    normalizedOptions
      .forEach(option => {
        state.options.appendChild(
          createPromptButton({
            state,
            option
          })
        );
      });

    if (
      includeMainReturn &&
      state.voice.ui &&
      state.voice.ui.console
    ) {
      const returnLabel =
        state.voice.ui.console
          .returnLabel ||
        "Return to the main welcome";

      state.options.appendChild(
        createPromptButton({
          state,
          option: returnLabel,
          utilityAction: "main"
        })
      );
    }

    const hasOptions =
      Boolean(
        normalizedOptions.length ||
        includeMainReturn
      );

    setOptionsVisibility(
      state,
      hasOptions
    );

    if (state.promptLabel) {
      state.promptLabel.textContent =
        state.voice.ui &&
        state.voice.ui.console
          ? state.voice.ui.console
              .promptLabel
          : "What brought you to Diamond Gate Bridge?";
    }

    setOptionsLocked(
      state,
      false
    );

    setPromptStatus(
      state,
      hasOptions
        ? "Choose the direction that best matches your visit."
        : "No further prompt is available in this path."
    );
  };

  const getPathwayForRoute = (
    state,
    routeId
  ) => {
    if (!routeId) {
      return null;
    }

    const pathway =
      typeof state.voice.getPathway ===
        "function"
        ? state.voice.getPathway(
            routeId
          )
        : null;

    if (pathway) {
      return {
        pathway,
        route:
          state.voice.getRoute(
            pathway.route
          )
      };
    }

    const route =
      state.voice.getRoute(
        routeId
      );

    if (!route) {
      return null;
    }

    return {
      pathway: {
        id:
          `${route.id}-pathway`,
        eyebrow:
          route.owner ||
          "Continue",
        title:
          route.label,
        description:
          route.purpose,
        route:
          route.id,
        voiceLine:
          ""
      },
      route
    };
  };

  const createPathwayCard = (
    state,
    routeId
  ) => {
    const result =
      getPathwayForRoute(
        state,
        routeId
      );

    if (
      !result ||
      !result.route
    ) {
      return null;
    }

    const {
      pathway,
      route
    } = result;

    const card =
      document.createElement(
        "article"
      );

    card.className =
      "jeeves-pathway-card";

    card.setAttribute(
      "data-jeeves-pathway-card",
      pathway.id
    );

    card.setAttribute(
      "data-jeeves-route-id",
      route.id
    );

    const copy =
      document.createElement(
        "div"
      );

    copy.className =
      "jeeves-pathway-copy";

    const eyebrow =
      document.createElement(
        "span"
      );

    eyebrow.className =
      "jeeves-pathway-eyebrow";

    eyebrow.textContent =
      normalize(
        pathway.eyebrow ||
        route.owner ||
        "Next Door"
      );

    const title =
      document.createElement(
        "strong"
      );

    title.className =
      "jeeves-pathway-title";

    title.textContent =
      normalize(
        pathway.title ||
        route.label
      );

    const description =
      document.createElement(
        "p"
      );

    description.className =
      "jeeves-pathway-description";

    description.textContent =
      normalize(
        pathway.description ||
        route.purpose
      );

    copy.append(
      eyebrow,
      title,
      description
    );

    if (
      normalize(
        pathway.voiceLine
      )
    ) {
      const voiceLine =
        document.createElement(
          "p"
        );

      voiceLine.className =
        "jeeves-pathway-voice";

      voiceLine.textContent =
        normalize(
          pathway.voiceLine
        );

      copy.appendChild(
        voiceLine
      );
    }

    const action =
      document.createElement(
        "a"
      );

    action.className =
      "jeeves-pathway-action";

    action.href =
      route.href;

    action.textContent =
      route.label;

    action.setAttribute(
      "data-jeeves-route",
      route.id
    );

    if (
      route.external === true
    ) {
      action.rel =
        "noopener noreferrer";
    }

    card.append(
      copy,
      action
    );

    return card;
  };

  const clearContextualPathway = state => {
    if (state.routeMount) {
      clearNode(
        state.routeMount
      );
    }

    state.root.removeAttribute(
      "data-jeeves-context-route-active"
    );
  };

  const renderContextualPathway = (
    state,
    routeId
  ) => {
    clearContextualPathway(
      state
    );

    if (
      !state.routeMount ||
      !routeId
    ) {
      return;
    }

    const card =
      createPathwayCard(
        state,
        routeId
      );

    if (!card) {
      return;
    }

    state.routeMount.appendChild(
      card
    );

    state.root.setAttribute(
      "data-jeeves-context-route-active",
      routeId
    );

    emit(
      PATHWAY_EVENT,
      {
        contract: CONTRACT,
        instance: state.id,
        mode: state.modeId,
        dialogue:
          state.currentDialogueId,
        route: routeId
      }
    );
  };

  const renderMainOptions = state => {
    clearContextualPathway(
      state
    );

    state.currentDialogueId =
      "";

    state.root.removeAttribute(
      "data-jeeves-current-dialogue"
    );

    const options =
      state.voice.getMainOptions(
        state.modeId
      );

    renderPromptOptions(
      state,
      options,
      {
        includeMainReturn: false
      }
    );

    setIdleState(
      state
    );

    setStatus(
      state,
      "listening",
      "Jeeves is listening."
    );
  };

  const renderFollowupOptions = (
    state,
    dialogue
  ) => {
    const followups =
      state.voice.getFollowupOptions(
        dialogue.id,
        state.modeId
      );

    renderPromptOptions(
      state,
      followups,
      {
        includeMainReturn: true
      }
    );
  };

  const beginDialogue = (
    state,
    dialogueId
  ) => {
    if (
      !state.conversationActivated ||
      state.speaking ||
      state.optionsLocked ||
      state.waitState !==
        WAIT_STATES.IDLE
    ) {
      return;
    }

    const dialogue =
      state.voice.getDialogue(
        dialogueId
      );

    if (!dialogue) {
      appendSystemMessage(
        state,
        "That route is not available right now."
      );

      renderMainOptions(
        state
      );

      return;
    }

    if (
      dialogue.mode !==
        "shared" &&
      dialogue.mode !==
        state.modeId
    ) {
      appendSystemMessage(
        state,
        "That question belongs to another routing path."
      );

      renderMainOptions(
        state
      );

      return;
    }

    const validation =
      state.voice.validateDialogue(
        dialogue
      );

    if (
      !validation ||
      validation.valid !== true
    ) {
      appendSystemMessage(
        state,
        "Jeeves withheld that response because it did not pass the routing boundary."
      );

      renderMainOptions(
        state
      );

      emitError(
        "dialogue-validation-failed",
        {
          instance: state.id,
          dialogue: dialogueId,
          reason:
            validation &&
            validation.reason
              ? validation.reason
              : "unknown"
        }
      );

      return;
    }

    cancelSequence(
      state
    );

    clearNode(
      state.options
    );

    setOptionsVisibility(
      state,
      false
    );

    clearContextualPathway(
      state
    );

    state.currentDialogueId =
      dialogue.id;

    state.root.setAttribute(
      "data-jeeves-current-dialogue",
      dialogue.id
    );

    appendUserPrompt(
      state,
      dialogue.prompt
    );

    const token =
      state.sequenceToken;

    speakMessages({
      state,
      messages:
        dialogue.responses,
      register:
        dialogue.register,
      token,
      onComplete: () => {
        if (
          token !==
          state.sequenceToken
        ) {
          return;
        }

        renderContextualPathway(
          state,
          dialogue.contextualRoute
        );

        renderFollowupOptions(
          state,
          dialogue
        );

        emit(
          DIALOGUE_EVENT,
          {
            contract: CONTRACT,
            instance: state.id,
            mode: state.modeId,
            dialogue: dialogue.id,
            register:
              dialogue.register,
            contextualRoute:
              dialogue.contextualRoute ||
              null
          }
        );
      }
    });
  };

  const activateMode = (
    state,
    modeId,
    {
      silent = false,
      preserveThread = false
    } = {}
  ) => {
    const mode =
      state.voice.getMode(
        modeId
      ) ||
      state.voice.getMode(
        DEFAULT_MODE
      );

    if (!mode) {
      emitError(
        "missing-mode",
        {
          instance: state.id,
          requestedMode:
            modeId
        }
      );

      return;
    }

    cancelSequence(
      state
    );

    state.modeId =
      mode.id;

    state.currentDialogueId =
      "";

    if (!preserveThread) {
      clearNode(
        state.thread
      );
    }

    clearNode(
      state.options
    );

    setOptionsVisibility(
      state,
      false
    );

    clearContextualPathway(
      state
    );

    setModePresentation(
      state,
      mode
    );

    state.root.removeAttribute(
      "data-jeeves-current-dialogue"
    );

    if (silent) {
      renderMainOptions(
        state
      );

      emit(
        MODE_EVENT,
        {
          contract: CONTRACT,
          instance: state.id,
          mode: mode.id,
          silent: true
        }
      );

      return;
    }

    setStatus(
      state,
      "opening",
      "Jeeves is preparing your welcome."
    );

    setPromptStatus(
      state,
      "The opening exchange will finish before choices appear."
    );

    const opening =
      state.voice
        .getOpening(mode.id)
        .slice(0, 2);

    const token =
      state.sequenceToken;

    speakMessages({
      state,
      messages: opening,
      register: "welcome",
      token,
      onComplete: () => {
        if (
          token !==
          state.sequenceToken
        ) {
          return;
        }

        state.openingCompleted =
          true;

        renderMainOptions(
          state
        );
      }
    });

    emit(
      MODE_EVENT,
      {
        contract: CONTRACT,
        instance: state.id,
        mode: mode.id,
        silent: false
      }
    );
  };

  const handleUtilityAction = (
    state,
    action
  ) => {
    if (action === "main") {
      cancelSequence(
        state
      );

      renderMainOptions(
        state
      );

      return;
    }

    if (action === "restart") {
      activateMode(
        state,
        state.modeId,
        {
          silent: false
        }
      );
    }
  };

  const advanceCurrentWait = state => {
    if (
      !state ||
      !state.rushAvailable ||
      typeof state.pendingResolve !==
        "function"
    ) {
      return false;
    }

    return releasePendingWait(
      state,
      true
    );
  };

  const installRestartListeners = state => {
    queryAll(
      "[data-jeeves-restart]",
      state.scope
    ).forEach(button => {
      button.addEventListener(
        "click",
        () => {
          handleUtilityAction(
            state,
            "restart"
          );
        }
      );
    });
  };

  const installAdvanceListeners = state => {
    if (state.rushTarget) {
      state.rushTarget.addEventListener(
        "pointerdown",
        event => {
          const target =
            event.target;

          if (
            isElement(target) &&
            target.closest(
              INTERACTIVE_SELECTOR
            )
          ) {
            return;
          }

          advanceCurrentWait(
            state
          );
        }
      );

      state.rushTarget.addEventListener(
        "keydown",
        event => {
          if (
            event.key !==
              "Enter" &&
            event.key !==
              " "
          ) {
            return;
          }

          const target =
            event.target;

          if (
            isElement(target) &&
            target.closest(
              INTERACTIVE_SELECTOR
            )
          ) {
            return;
          }

          if (
            advanceCurrentWait(
              state
            )
          ) {
            event.preventDefault();
          }
        }
      );
    }

    if (state.rushControl) {
      state.rushControl.addEventListener(
        "click",
        () => {
          advanceCurrentWait(
            state
          );
        }
      );
    }
  };

  const installThreadScrollListener = state => {
    if (!state.thread) {
      return;
    }

    state.thread.addEventListener(
      "scroll",
      () => {
        state.userNearBottom =
          isNearThreadBottom(
            state.thread
          );
      },
      {
        passive: true
      }
    );
  };

  const installDisclosureCoordination = state => {
    const disclosures =
      queryAll(
        "[data-jeeves-guide-disclosure]",
        state.scope
      );

    disclosures.forEach(disclosure => {
      disclosure.addEventListener(
        "toggle",
        () => {
          const control =
            query(
              ".jeeves-guide-summary-control",
              disclosure
            );

          if (control) {
            control.textContent =
              disclosure.open
                ? "Close"
                : "Open";
          }

          if (!disclosure.open) {
            return;
          }

          disclosures
            .filter(
              other =>
                other !== disclosure &&
                other.open
            )
            .forEach(other => {
              other.open =
                false;
            });
        }
      );
    });
  };

  const requestThresholdReplay = () => {
    emit(
      THRESHOLD_REPLAY_REQUEST_EVENT,
      {
        contract: CONTRACT,
        source:
          "jeeves-runtime"
      }
    );
  };

  const installReplayControls = state => {
    queryAll(
      "[data-jeeves-replay-welcome]",
      state.scope
    ).forEach(button => {
      button.hidden =
        false;

      button.addEventListener(
        "click",
        () => {
          requestThresholdReplay();
        }
      );
    });
  };

  const setPageAccess = (
    state,
    access
  ) => {
    const normalizedAccess =
      access ===
        THRESHOLD_STATES.OPEN
        ? THRESHOLD_STATES.OPEN
        : THRESHOLD_STATES.GUIDED;

    state.pageAccess =
      normalizedAccess;

    if (state.page) {
      state.page.setAttribute(
        "data-jeeves-access",
        normalizedAccess
      );
    }

    document.documentElement
      .setAttribute(
        "data-jeeves-access",
        normalizedAccess
      );

    if (document.body) {
      document.body.setAttribute(
        "data-jeeves-access",
        normalizedAccess
      );
    }
  };

  const activateConversation = (
    state,
    {
      source =
        "threshold-complete",
      silentOpening = false
    } = {}
  ) => {
    if (
      state.conversationActivated
    ) {
      setPageAccess(
        state,
        THRESHOLD_STATES.OPEN
      );

      return false;
    }

    state.conversationActivated =
      true;

    setPageAccess(
      state,
      THRESHOLD_STATES.OPEN
    );

    state.root.setAttribute(
      "data-jeeves-conversation-activated",
      "true"
    );

    setThreadTelemetry(
      state,
      {
        stage:
          "Front Door Reception",
        signal:
          "Host connected",
        threadState:
          "ready"
      }
    );

    activateMode(
      state,
      state.modeId,
      {
        silent:
          Boolean(silentOpening)
      }
    );

    emit(
      CONVERSATION_ACTIVATED_EVENT,
      {
        contract: CONTRACT,
        instance: state.id,
        source,
        silentOpening:
          Boolean(silentOpening)
      }
    );

    return true;
  };

  const suspendConversationForReplay = state => {
    cancelSequence(
      state
    );

    state.conversationActivated =
      false;

    state.openingCompleted =
      false;

    state.root.setAttribute(
      "data-jeeves-conversation-activated",
      "false"
    );

    setPageAccess(
      state,
      THRESHOLD_STATES.GUIDED
    );

    setStatus(
      state,
      "paused",
      "The estate welcome is being replayed."
    );

    setThreadTelemetry(
      state,
      {
        stage:
          "Reception paused",
        signal:
          "Welcome replay",
        threadState:
          "paused"
      }
    );

    setPromptStatus(
      state,
      "Conversation resumes after the estate welcome."
    );

    setOptionsLocked(
      state,
      true
    );

    setOptionsVisibility(
      state,
      false
    );
  };

  const thresholdIsOpen = state => {
    const pageAccess =
      normalize(
        state.page &&
        state.page.getAttribute(
          "data-jeeves-access"
        )
      );

    const documentAccess =
      normalize(
        document.documentElement
          .getAttribute(
            "data-jeeves-access"
          )
      );

    const thresholdState =
      normalize(
        state.threshold &&
        state.threshold.getAttribute(
          "data-threshold-state"
        )
      );

    return (
      pageAccess ===
        THRESHOLD_STATES.OPEN ||
      documentAccess ===
        THRESHOLD_STATES.OPEN ||
      thresholdState ===
        "complete" ||
      thresholdState ===
        "skipped" ||
      thresholdState ===
        "open"
    );
  };

  const coordinateInitialActivation = state => {
    if (!state.threshold) {
      activateConversation(
        state,
        {
          source:
            "threshold-absent"
        }
      );

      return;
    }

    if (
      thresholdIsOpen(state)
    ) {
      activateConversation(
        state,
        {
          source:
            "threshold-already-open"
        }
      );

      return;
    }

    setPageAccess(
      state,
      THRESHOLD_STATES.GUIDED
    );

    state.root.setAttribute(
      "data-jeeves-conversation-activated",
      "false"
    );

    setStatus(
      state,
      "waiting",
      "Jeeves is waiting at the front door."
    );

    setThreadTelemetry(
      state,
      {
        stage:
          "Reception channel",
        signal:
          "Awaiting arrival",
        threadState:
          "waiting"
      }
    );

    setPromptStatus(
      state,
      "The conversation begins after the estate introduction."
    );

    setOptionsLocked(
      state,
      true
    );

    setOptionsVisibility(
      state,
      false
    );
  };

  const markMounted = state => {
    state.root.setAttribute(
      "data-jeeves-runtime-mounted",
      "true"
    );

    state.root.setAttribute(
      "data-jeeves-ready",
      "true"
    );

    state.root.setAttribute(
      "data-jeeves-speaking",
      "false"
    );

    state.root.setAttribute(
      "data-jeeves-options-locked",
      "false"
    );

    state.root.setAttribute(
      "data-jeeves-delay-state",
      WAIT_STATES.IDLE
    );

    state.root.setAttribute(
      "data-jeeves-rush-available",
      "false"
    );

    document.documentElement
      .setAttribute(
        "data-jeeves-runtime-ready",
        "true"
      );

    if (document.body) {
      document.body.setAttribute(
        "data-jeeves-runtime-ready",
        "true"
      );
    }

    setStatus(
      state,
      "ready",
      "Jeeves is ready."
    );
  };

  const createState = (
    root,
    voice
  ) => {
    const page =
      root.closest(
        PAGE_SELECTOR
      ) ||
      query(
        PAGE_SELECTOR
      ) ||
      document;

    const scope =
      page instanceof Element
        ? page
        : document;

    return {
      id:
        getStateId(root),

      root,
      page:
        page instanceof Element
          ? page
          : null,

      scope,
      voice,

      threshold:
        query(
          THRESHOLD_SELECTOR
        ),

      thread:
        query(
          "[data-jeeves-thread]",
          root
        ),

      options:
        query(
          "[data-jeeves-options]",
          root
        ),

      status:
        query(
          "[data-jeeves-status]",
          root
        ),

      typing:
        query(
          "[data-jeeves-typing], .jeeves-typing",
          root
        ),

      modeLabel:
        query(
          "[data-jeeves-mode-label]",
          root
        ),

      modeTitle:
        query(
          "[data-jeeves-mode-title]",
          root
        ),

      promptLabel:
        query(
          "[data-jeeves-prompt-label]",
          root
        ),

      promptStatus:
        query(
          "[data-jeeves-prompt-status]",
          root
        ),

      routeMount:
        query(
          "[data-jeeves-context-route]",
          root
        ),

      rushTarget:
        query(
          RUSH_TARGET_SELECTOR,
          root
        ),

      rushControl:
        query(
          "[data-jeeves-rush-control]",
          root
        ),

      conversationCue:
        query(
          "[data-jeeves-conversation-cue]",
          root
        ),

      threadStage:
        query(
          "[data-jeeves-thread-stage]",
          root
        ),

      threadSignal:
        query(
          "[data-jeeves-thread-signal]",
          root
        ),

      modeId:
        normalize(
          root.getAttribute(
            "data-jeeves-mode"
          )
        ) ||
        DEFAULT_MODE,

      currentDialogueId: "",
      sequenceToken: 0,
      pendingTimer: null,
      pendingResolve: null,
      pendingWaitKind:
        WAIT_STATES.IDLE,

      speaking: false,
      optionsLocked: false,
      reducedMotion:
        prefersReducedMotion(),
      userNearBottom: true,

      waitState:
        WAIT_STATES.IDLE,
      rushAvailable: false,

      conversationActivated:
        false,
      openingCompleted:
        false,

      pageAccess:
        THRESHOLD_STATES.GUIDED
    };
  };

  const mountRoot = (
    root,
    voice
  ) => {
    if (
      !root ||
      root.getAttribute(
        "data-jeeves-runtime-mounted"
      ) === "true"
    ) {
      return null;
    }

    const state =
      createState(
        root,
        voice
      );

    if (
      !state.thread ||
      !state.options
    ) {
      root.setAttribute(
        "data-jeeves-runtime-error",
        "missing-required-mount"
      );

      emitError(
        "missing-required-mount",
        {
          instance: state.id,
          hasThread:
            Boolean(state.thread),
          hasOptions:
            Boolean(state.options)
        }
      );

      return null;
    }

    instances.set(
      state.id,
      state
    );

    installRestartListeners(
      state
    );

    installAdvanceListeners(
      state
    );

    installThreadScrollListener(
      state
    );

    installReplayControls(
      state
    );

    installDisclosureCoordination(
      state
    );

    markMounted(
      state
    );

    coordinateInitialActivation(
      state
    );

    return state;
  };

  const mountAll = () => {
    const voice =
      getVoice();

    if (!voice) {
      return [];
    }

    if (voiceFailureTimer) {
      window.clearTimeout(
        voiceFailureTimer
      );

      voiceFailureTimer =
        null;
    }

    const mounted =
      queryAll(
        ROOT_SELECTOR
      )
        .map(
          root =>
            mountRoot(
              root,
              voice
            )
        )
        .filter(Boolean);

    if (mounted.length) {
      emit(
        RUNTIME_EVENT,
        {
          contract: CONTRACT,
          voiceContract:
            voice.contract,
          instanceCount:
            mounted.length,
          instances:
            mounted.map(
              state =>
                state.id
            )
        }
      );
    }

    return mounted;
  };

  const markVoiceFailure = () => {
    if (getVoice()) {
      return;
    }

    queryAll(
      ROOT_SELECTOR
    ).forEach(root => {
      if (
        root.getAttribute(
          "data-jeeves-runtime-mounted"
        ) === "true"
      ) {
        return;
      }

      root.setAttribute(
        "data-jeeves-runtime-error",
        "voice-authority-unavailable"
      );

      const status =
        query(
          "[data-jeeves-status]",
          root
        );

      if (status) {
        status.textContent =
          "Jeeves's voice authority is unavailable. Direct public paths remain open.";
      }
    });

    emitError(
      "voice-authority-unavailable"
    );
  };

  const markThresholdFailureOpen = () => {
    if (
      !instances.size
    ) {
      return;
    }

    instances.forEach(state => {
      if (
        state.conversationActivated
      ) {
        return;
      }

      activateConversation(
        state,
        {
          source:
            "threshold-fallback-timeout"
        }
      );
    });

    emitError(
      "threshold-activation-timeout",
      {
        fallback:
          "conversation-opened"
      }
    );
  };

  const resolveState = reference => {
    if (!reference) {
      return (
        instances.values()
          .next()
          .value ||
        null
      );
    }

    if (
      typeof reference ===
        "string"
    ) {
      return (
        instances.get(
          reference
        ) ||
        null
      );
    }

    if (
      reference instanceof
        Element
    ) {
      const root =
        reference.matches(
          ROOT_SELECTOR
        )
          ? reference
          : reference.closest(
              ROOT_SELECTOR
            );

      if (!root) {
        return null;
      }

      const id =
        root.getAttribute(
          "data-jeeves-instance"
        );

      return (
        instances.get(id) ||
        null
      );
    }

    return null;
  };

  const publicActivateMode = (
    reference,
    modeId,
    options = {}
  ) => {
    const state =
      resolveState(
        reference
      );

    if (!state) {
      return false;
    }

    activateMode(
      state,
      modeId,
      options
    );

    return true;
  };

  const publicBeginDialogue = (
    reference,
    dialogueId
  ) => {
    const state =
      resolveState(
        reference
      );

    if (!state) {
      return false;
    }

    beginDialogue(
      state,
      dialogueId
    );

    return true;
  };

  const publicRestart = reference => {
    const state =
      resolveState(
        reference
      );

    if (!state) {
      return false;
    }

    handleUtilityAction(
      state,
      "restart"
    );

    return true;
  };

  const publicAdvance = reference => {
    const state =
      resolveState(
        reference
      );

    if (!state) {
      return false;
    }

    return advanceCurrentWait(
      state
    );
  };

  const publicRenderMain = reference => {
    const state =
      resolveState(
        reference
      );

    if (!state) {
      return false;
    }

    cancelSequence(
      state
    );

    renderMainOptions(
      state
    );

    return true;
  };

  const publicActivateConversation = (
    reference,
    options = {}
  ) => {
    const state =
      resolveState(
        reference
      );

    if (!state) {
      return false;
    }

    return activateConversation(
      state,
      options
    );
  };

  const publicReplayWelcome = () => {
    requestThresholdReplay();
    return true;
  };

  const API = {
    contract: CONTRACT,
    version: 2,

    events:
      Object.freeze({
        voiceReady:
          VOICE_EVENT,
        runtimeReady:
          RUNTIME_EVENT,
        thresholdReady:
          THRESHOLD_READY_EVENT,
        thresholdComplete:
          THRESHOLD_COMPLETE_EVENT,
        thresholdSkip:
          THRESHOLD_SKIP_EVENT,
        thresholdReplayRequest:
          THRESHOLD_REPLAY_REQUEST_EVENT,
        thresholdReplay:
          THRESHOLD_REPLAY_EVENT,
        conversationActivated:
          CONVERSATION_ACTIVATED_EVENT,
        modeChange:
          MODE_EVENT,
        dialogueComplete:
          DIALOGUE_EVENT,
        pathwayReveal:
          PATHWAY_EVENT,
        runtimeError:
          ERROR_EVENT
      }),

    get ready() {
      return (
        getVoice() !== null &&
        instances.size > 0
      );
    },

    get instanceCount() {
      return instances.size;
    },

    mountAll,

    getInstance(reference) {
      return resolveState(
        reference
      );
    },

    activateMode:
      publicActivateMode,

    beginDialogue:
      publicBeginDialogue,

    renderMain:
      publicRenderMain,

    restart:
      publicRestart,

    advance:
      publicAdvance,

    activateConversation:
      publicActivateConversation,

    replayWelcome:
      publicReplayWelcome
  };

  Object.freeze(API);

  Object.defineProperty(
    window,
    GLOBAL_NAME,
    {
      value: API,
      enumerable: true,
      configurable: false,
      writable: false
    }
  );

  const handleThresholdComplete = event => {
    if (thresholdFallbackTimer) {
      window.clearTimeout(
        thresholdFallbackTimer
      );

      thresholdFallbackTimer =
        null;
    }

    const detail =
      event &&
      event.detail
        ? event.detail
        : {};

    instances.forEach(state => {
      activateConversation(
        state,
        {
          source:
            normalize(
              detail.source
            ) ||
            event.type,
          silentOpening:
            Boolean(
              detail.silentOpening
            )
        }
      );
    });
  };

  const handleThresholdReplay = () => {
    instances.forEach(state => {
      suspendConversationForReplay(
        state
      );
    });
  };

  window.addEventListener(
    THRESHOLD_COMPLETE_EVENT,
    handleThresholdComplete
  );

  window.addEventListener(
    THRESHOLD_SKIP_EVENT,
    handleThresholdComplete
  );

  window.addEventListener(
    THRESHOLD_REPLAY_EVENT,
    handleThresholdReplay
  );

  const boot = () => {
    bootAttempted =
      true;

    const mounted =
      mountAll();

    if (!mounted.length) {
      if (!getVoice()) {
        voiceFailureTimer =
          window.setTimeout(
            markVoiceFailure,
            4500
          );
      }

      return;
    }

    const hasPendingThreshold =
      mounted.some(
        state =>
          state.threshold &&
          !state.conversationActivated
      );

    if (hasPendingThreshold) {
      thresholdFallbackTimer =
        window.setTimeout(
          markThresholdFailureOpen,
          8000
        );
    }
  };

  const scheduleBoot = () => {
    if (
      document.readyState ===
        "loading"
    ) {
      document.addEventListener(
        "DOMContentLoaded",
        boot,
        {
          once: true
        }
      );

      return;
    }

    window.setTimeout(
      boot,
      0
    );
  };

  window.addEventListener(
    VOICE_EVENT,
    () => {
      if (
        document.readyState ===
          "loading"
      ) {
        return;
      }

      mountAll();
    }
  );

  window.addEventListener(
    THRESHOLD_READY_EVENT,
    () => {
      instances.forEach(state => {
        if (
          thresholdIsOpen(state)
        ) {
          activateConversation(
            state,
            {
              source:
                THRESHOLD_READY_EVENT
            }
          );
        }
      });
    }
  );

  scheduleBoot();

  if (
    !bootAttempted &&
    getVoice() &&
    document.readyState !==
      "loading"
  ) {
    mountAll();
  }
})();
