// TARGET FILE: /showroom/globe/hearth/jeeves/index.js
// TNT FULL-FILE REPLACEMENT
// DIAMOND_GATE_BRIDGE_JEEVES_REGISTER_AWARE_ROUTING_RUNTIME_TNT_v1
//
// Purpose:
// - Consume /assets/hearth/jeeves/jeeves.voice.js through window.JEEVES_VOICE.
// - Mount Jeeves's modern welcome-and-routing conversation surface.
// - Keep automatic opening dialogue limited to two messages.
// - Render register-aware dialogue pacing and visual state.
// - Render visitor-intent choices, follow-up choices, and one contextual
//   route card at a time.
// - Preserve real anchor navigation for every room and specialist handoff.
// - Support keyboard use, reduced motion, controlled scrolling,
//   interruption, restart, tap-to-advance, and graceful voice failure.
//
// Does not own:
// - Jeeves's identity or dialogue text
// - Jeeves's route catalog
// - Jeeves's visual design
// - /showroom/globe/hearth/jeeves/index.html
// - /showroom/globe/hearth/jeeves/index.css
// - specialist interpretation
// - destination-page content
// - protected architecture
//

(() => {
  "use strict";

  const CONTRACT =
    "DIAMOND_GATE_BRIDGE_JEEVES_REGISTER_AWARE_ROUTING_RUNTIME_TNT_v1";

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

  const DEFAULT_MODE =
    "welcome";

  const ROOT_SELECTOR =
    "[data-jeeves-app], [data-jeeves-root]";

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

  const instances =
    new Map();

  let bootAttempted =
    false;

  let voiceFailureTimer =
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
    detail
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
          detail
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

  const isNearThreadBottom = thread => {
    if (!thread) {
      return true;
    }

    const remaining =
      thread.scrollHeight -
      thread.scrollTop -
      thread.clientHeight;

    return remaining < 110;
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
      normalize(copy || fallback);

    state.root.setAttribute(
      "data-jeeves-status-state",
      statusKey
    );

    if (state.status) {
      state.status.textContent =
        message;
    }
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

  const setModePresentation = (
    state,
    mode
  ) => {
    state.root.setAttribute(
      "data-jeeves-mode",
      mode.id
    );

    if (state.modeLabel) {
      state.modeLabel.textContent =
        mode.eyebrow ||
        mode.label ||
        "First Contact";
    }

    if (state.modeTitle) {
      state.modeTitle.textContent =
        mode.title ||
        mode.label ||
        "Tell me what brought you here.";
    }
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
      return;
    }

    const resolve =
      state.pendingResolve;

    state.pendingResolve =
      null;

    clearTimer(state);

    resolve({
      advanced
    });
  };

  const cancelSequence = state => {
    state.sequenceToken += 1;

    releasePendingWait(
      state,
      false
    );

    setTyping(
      state,
      false
    );

    setOptionsLocked(
      state,
      false
    );
  };

  const waitForSequence = (
    state,
    delay,
    token
  ) => new Promise(resolve => {
    if (
      token !==
      state.sequenceToken
    ) {
      resolve({
        cancelled: true,
        advanced: false
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

      clearTimer(state);

      resolve({
        cancelled:
          token !==
          state.sequenceToken,
        advanced:
          Boolean(advanced)
      });
    };

    state.pendingResolve =
      complete;

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

  const getRegisterDelay = (
    state,
    registerId,
    text,
    index
  ) => {
    if (state.reducedMotion) {
      return 0;
    }

    const register =
      state.voice.getRegister(
        registerId
      );

    const pacing =
      register
        ? register.pacing
        : "deliberate";

    const baseByPacing = {
      immediate: 40,
      responsive: 280,
      measured: 430,
      deliberate: 560,
      soft: 520
    };

    const base =
      baseByPacing[pacing] ??
      470;

    const length =
      normalize(text).length;

    const lengthWeight =
      Math.min(
        680,
        length * 3.1
      );

    const sequenceWeight =
      index === 0
        ? 0
        : 90;

    return Math.round(
      base +
      lengthWeight +
      sequenceWeight
    );
  };

  const getGapDelay = (
    state,
    registerId
  ) => {
    if (state.reducedMotion) {
      return 0;
    }

    const gaps = {
      welcome: 190,
      orientation: 250,
      clarification: 260,
      boundary: 70,
      warning: 70,
      handoff: 210
    };

    return gaps[registerId] ??
      220;
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

      setTyping(
        state,
        true,
        registerId
      );

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
          "Jeeves is narrowing the request."
        );
      } else {
        setStatus(
          state,
          "speaking",
          "Jeeves is responding."
        );
      }

      const waitResult =
        await waitForSequence(
          state,
          getRegisterDelay(
            state,
            registerId,
            text,
            index
          ),
          token
        );

      if (
        waitResult.cancelled ||
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
          text
        })
      );

      const gapResult =
        await waitForSequence(
          state,
          getGapDelay(
            state,
            registerId
          ),
          token
        );

      if (
        gapResult.cancelled ||
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

    setStatus(
      state,
      "listening",
      "Jeeves is listening."
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
          state.speaking
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

    state.root.setAttribute(
      "data-jeeves-options-ready",
      normalizedOptions.length
        ? "true"
        : "false"
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
      state.speaking ||
      state.optionsLocked
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
      silent = false
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

    clearNode(
      state.thread
    );

    clearNode(
      state.options
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

      return;
    }

    setStatus(
      state,
      "opening",
      "Jeeves is preparing your welcome."
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
        silent
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

  const installAdvanceListener = state => {
    state.root.addEventListener(
      "pointerdown",
      event => {
        if (
          !state.speaking ||
          typeof state.pendingResolve !==
            "function"
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

        releasePendingWait(
          state,
          true
        );
      }
    );

    state.root.addEventListener(
      "keydown",
      event => {
        if (
          !state.speaking ||
          typeof state.pendingResolve !==
            "function"
        ) {
          return;
        }

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

        event.preventDefault();

        releasePendingWait(
          state,
          true
        );
      }
    );
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
    const scope =
      root.closest(
        "[data-jeeves-page]"
      ) ||
      document;

    return {
      id:
        getStateId(root),

      root,
      scope,
      voice,

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

      routeMount:
        query(
          "[data-jeeves-context-route]",
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
      speaking: false,
      optionsLocked: false,
      reducedMotion:
        prefersReducedMotion(),
      userNearBottom: true
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

    installAdvanceListener(
      state
    );

    installThreadScrollListener(
      state
    );

    markMounted(
      state
    );

    activateMode(
      state,
      state.modeId,
      {
        silent: false
      }
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

    if (
      !state ||
      typeof state.pendingResolve !==
        "function"
    ) {
      return false;
    }

    releasePendingWait(
      state,
      true
    );

    return true;
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

  const API = {
    contract: CONTRACT,
    version: 1,

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
      publicAdvance
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

  const boot = () => {
    bootAttempted =
      true;

    const mounted =
      mountAll();

    if (mounted.length) {
      return;
    }

    if (!getVoice()) {
      voiceFailureTimer =
        window.setTimeout(
          markVoiceFailure,
          4500
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
