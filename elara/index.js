// TARGET FILE: /elara/index.js
// TNT FULL-FILE REPLACEMENT
// ELARA_REGISTER_AWARE_CONVERSATION_RUNTIME_TNT_v1
//
// Purpose:
// - Consume /elara/elara.voice.js through window.ELARA_VOICE.
// - Mount Elara's modern two-mode conversation surface.
// - Keep automatic openings limited to two messages.
// - Render register-aware dialogue pacing and visual state.
// - Render prompt choices, follow-up choices, and contextual route cards.
// - Preserve real anchor navigation for all room handoffs.
// - Support keyboard use, reduced motion, controlled scrolling,
//   interruption, restart, and graceful voice-authority failure.
//
// Does not own:
// - Elara's personality or dialogue text
// - Elara's visual design
// - /elara/index.html
// - /elara/index.css
// - route destinations
// - whole-House orientation
// - product authority
// - diagnostic authority
//

(() => {
  "use strict";

  const CONTRACT =
    "ELARA_REGISTER_AWARE_CONVERSATION_RUNTIME_TNT_v1";

  const VOICE_EVENT =
    "elara:voice-ready";

  const RUNTIME_EVENT =
    "elara:runtime-ready";

  const MODE_EVENT =
    "elara:mode-change";

  const DIALOGUE_EVENT =
    "elara:dialogue-complete";

  const PATHWAY_EVENT =
    "elara:pathway-reveal";

  const DEFAULT_MODE =
    "meet_sean";

  const ROOT_SELECTOR =
    "[data-elara-app], [data-elara-root]";

  const instances =
    new Map();

  let bootAttempted =
    false;

  let voiceFailureTimer =
    null;

  if (
    window.ELARA_RUNTIME &&
    window.ELARA_RUNTIME.contract ===
      CONTRACT
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
      .replace(/\s+/g," ")
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

  const getVoice = () => {
    const voice =
      window.ELARA_VOICE;

    if (
      !voice ||
      voice.ready !== true ||
      typeof voice.getMode !==
        "function" ||
      typeof voice.getDialogue !==
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
          "data-elara-instance"
        )
      );

    if (existing) {
      return existing;
    }

    const generated =
      `elara-${instances.size + 1}`;

    root.setAttribute(
      "data-elara-instance",
      generated
    );

    return generated;
  };

  const getModeButtonValue = button =>
    normalize(
      button.getAttribute(
        "data-elara-mode-button"
      ) ||
      button.getAttribute(
        "data-elara-mode-choice"
      )
    );

  const getModeButtons = state => {
    const local =
      queryAll(
        "[data-elara-mode-button], [data-elara-mode-choice]",
        state.scope
      );

    if (local.length) {
      return local;
    }

    return queryAll(
      "[data-elara-mode-button], [data-elara-mode-choice]",
      document
    );
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
        top:
          state.thread.scrollHeight,
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
      "data-elara-status-state",
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
      "data-elara-speaking",
      active ? "true" : "false"
    );

    state.root.setAttribute(
      "data-elara-register",
      normalize(registerId)
    );

    if (!state.typing) {
      return;
    }

    state.typing.setAttribute(
      "data-elara-typing",
      active ? "true" : "false"
    );

    state.typing.setAttribute(
      "aria-hidden",
      active ? "false" : "true"
    );

    state.typing.hidden =
      !active;
  };

  const setModePresentation = (
    state,
    mode
  ) => {
    state.root.setAttribute(
      "data-elara-mode",
      mode.id
    );

    if (state.modeLabel) {
      state.modeLabel.textContent =
        mode.eyebrow ||
        mode.label;
    }

    if (state.modeTitle) {
      state.modeTitle.textContent =
        mode.title ||
        mode.label;
    }

    getModeButtons(state)
      .forEach(button => {
        const buttonMode =
          getModeButtonValue(
            button
          );

        const active =
          buttonMode === mode.id;

        button.setAttribute(
          "aria-pressed",
          active
            ? "true"
            : "false"
        );

        button.setAttribute(
          "aria-selected",
          active
            ? "true"
            : "false"
        );

        button.setAttribute(
          "data-active",
          active
            ? "true"
            : "false"
        );

        if (active) {
          button.setAttribute(
            "tabindex",
            "0"
          );
        } else {
          button.setAttribute(
            "tabindex",
            "-1"
          );
        }
      });
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
      "elara";

    const registerId =
      normalize(register) ||
      "revelation";

    article.className =
      [
        "elara-bubble",
        `elara-bubble-${bubbleKind}`,
        `elara-register-${registerId}`
      ].join(" ");

    article.setAttribute(
      "data-elara-bubble",
      bubbleKind
    );

    article.setAttribute(
      "data-elara-register",
      registerId
    );

    if (label) {
      const eyebrow =
        document.createElement(
          "span"
        );

      eyebrow.className =
        "elara-bubble-label";

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
      "elara-bubble-body";

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
        kind:"user",
        register:"invitation",
        text
      })
    );
  };

  const appendSystemMessage = (
    state,
    text,
    register = "warning"
  ) => {
    appendBubble(
      state,
      createBubble({
        kind:"system",
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
        cancelled:true,
        advanced:false
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
      immediate:40,
      responsive:340,
      soft:560,
      deliberate:610
    };

    const base =
      baseByPacing[pacing] ??
      520;

    const length =
      normalize(text).length;

    const lengthWeight =
      Math.min(
        780,
        length * 3.6
      );

    const sequenceWeight =
      index === 0
        ? 0
        : 110;

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
      invitation:220,
      revelation:310,
      care:360,
      warning:80,
      handoff:240
    };

    return gaps[registerId] ??
      280;
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
              text:list[index],
              register
            }
          : list[index];

      const text =
        normalize(
          entry && entry.text
        );

      const registerId =
        normalize(
          entry &&
          entry.register
        ) ||
        register ||
        "revelation";

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
        "warning"
      ) {
        setStatus(
          state,
          "warning",
          "Elara is protecting the boundary."
        );
      } else if (
        registerId ===
        "handoff"
      ) {
        setStatus(
          state,
          "handoff",
          "Elara found the right door."
        );
      } else {
        setStatus(
          state,
          "speaking",
          "Elara is speaking."
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
          kind:"elara",
          register:registerId,
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

    setStatus(
      state,
      "listening",
      "Elara is listening."
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
        ? "elara-option elara-option-utility"
        : "elara-option";

    button.setAttribute(
      "data-elara-option",
      "true"
    );

    if (utilityAction) {
      button.setAttribute(
        "data-elara-option-action",
        utilityAction
      );
    } else {
      button.setAttribute(
        "data-elara-dialogue-id",
        option.id
      );

      button.setAttribute(
        "data-elara-register",
        option.register ||
        "revelation"
      );
    }

    button.textContent =
      utilityAction
        ? normalize(option)
        : normalize(option.label);

    button.addEventListener(
      "click",
      () => {
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
        "Return to Elara's main questions";

      state.options.appendChild(
        createPromptButton({
          state,
          option:returnLabel,
          utilityAction:"main"
        })
      );
    }

    state.root.setAttribute(
      "data-elara-options-ready",
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
          : "Where should we begin?";
    }
  };

  const getPathwayForRoute = (
    state,
    routeId
  ) => {
    if (!routeId) {
      return null;
    }

    const pathway =
      state.voice.getPathway(
        routeId
      );

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
      pathway:{
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
        voiceLine:""
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
      "elara-pathway-card";

    card.setAttribute(
      "data-elara-pathway-card",
      pathway.id
    );

    card.setAttribute(
      "data-elara-route-id",
      route.id
    );

    const copy =
      document.createElement(
        "div"
      );

    copy.className =
      "elara-pathway-copy";

    const eyebrow =
      document.createElement(
        "span"
      );

    eyebrow.className =
      "elara-pathway-eyebrow";

    eyebrow.textContent =
      normalize(
        pathway.eyebrow ||
        route.owner
      );

    const title =
      document.createElement(
        "strong"
      );

    title.className =
      "elara-pathway-title";

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
      "elara-pathway-description";

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
        "elara-pathway-voice";

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
      "elara-pathway-action";

    action.href =
      route.href;

    action.textContent =
      route.label;

    action.setAttribute(
      "data-elara-route",
      route.id
    );

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
      "data-elara-context-route-active"
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
      "data-elara-context-route-active",
      routeId
    );

    emit(
      PATHWAY_EVENT,
      {
        contract:CONTRACT,
        instance:state.id,
        mode:state.modeId,
        dialogue:
          state.currentDialogueId,
        route:routeId
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
      "data-elara-current-dialogue"
    );

    const options =
      state.voice.getMainOptions(
        state.modeId
      );

    renderPromptOptions(
      state,
      options,
      {
        includeMainReturn:false
      }
    );

    setStatus(
      state,
      "listening",
      "Elara is listening."
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
        includeMainReturn:true
      }
    );
  };

  const beginDialogue = (
    state,
    dialogueId
  ) => {
    const dialogue =
      state.voice.getDialogue(
        dialogueId
      );

    if (!dialogue) {
      appendSystemMessage(
        state,
        "That question is not available right now."
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
        "That question belongs to the other conversation path."
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
        "Elara protected that answer because its language did not pass the voice boundary."
      );

      renderMainOptions(
        state
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
      "data-elara-current-dialogue",
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
      onComplete:() => {
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
            contract:CONTRACT,
            instance:state.id,
            mode:state.modeId,
            dialogue:dialogue.id,
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
      "data-elara-current-dialogue"
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
      "Elara noticed you."
    );

    const opening =
      state.voice
        .getOpening(mode.id)
        .slice(0,2);

    const token =
      state.sequenceToken;

    speakMessages({
      state,
      messages:opening,
      register:"invitation",
      token,
      onComplete:() => {
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
        contract:CONTRACT,
        instance:state.id,
        mode:mode.id,
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
          silent:false
        }
      );
    }
  };

  const installModeButtonListeners = state => {
    const buttons =
      getModeButtons(state);

    buttons.forEach(button => {
      button.addEventListener(
        "click",
        () => {
          const modeId =
            getModeButtonValue(
              button
            );

          if (
            !modeId ||
            modeId ===
              state.modeId
          ) {
            return;
          }

          activateMode(
            state,
            modeId,
            {
              silent:false
            }
          );
        }
      );

      button.addEventListener(
        "keydown",
        event => {
          if (
            event.key !==
              "ArrowLeft" &&
            event.key !==
              "ArrowRight" &&
            event.key !==
              "Home" &&
            event.key !==
              "End"
          ) {
            return;
          }

          event.preventDefault();

          const available =
            getModeButtons(state);

          const currentIndex =
            available.indexOf(
              button
            );

          if (
            currentIndex < 0 ||
            !available.length
          ) {
            return;
          }

          let nextIndex =
            currentIndex;

          if (
            event.key ===
            "ArrowRight"
          ) {
            nextIndex =
              (
                currentIndex + 1
              ) %
              available.length;
          }

          if (
            event.key ===
            "ArrowLeft"
          ) {
            nextIndex =
              (
                currentIndex -
                1 +
                available.length
              ) %
              available.length;
          }

          if (
            event.key ===
            "Home"
          ) {
            nextIndex = 0;
          }

          if (
            event.key ===
            "End"
          ) {
            nextIndex =
              available.length - 1;
          }

          const nextButton =
            available[nextIndex];

          if (!nextButton) {
            return;
          }

          nextButton.focus();
          nextButton.click();
        }
      );
    });
  };

  const installRestartListeners = state => {
    queryAll(
      "[data-elara-restart]",
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
            "button, a, summary, input, textarea, select, [role='button']"
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
            "button, a, summary, input, textarea, select, [role='button']"
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
        passive:true
      }
    );
  };

  const markMounted = state => {
    state.root.setAttribute(
      "data-elara-runtime-mounted",
      "true"
    );

    state.root.setAttribute(
      "data-elara-ready",
      "true"
    );

    state.root.setAttribute(
      "data-elara-speaking",
      "false"
    );

    document.documentElement
      .setAttribute(
        "data-elara-runtime-ready",
        "true"
      );

    if (document.body) {
      document.body.setAttribute(
        "data-elara-runtime-ready",
        "true"
      );
    }

    setStatus(
      state,
      "ready",
      "Elara is here."
    );
  };

  const createState = (
    root,
    voice
  ) => {
    const scope =
      root.closest(
        "[data-elara-page]"
      ) ||
      document;

    return {
      id:getStateId(root),
      root,
      scope,
      voice,

      thread:
        query(
          "[data-elara-thread]",
          root
        ),

      options:
        query(
          "[data-elara-options]",
          root
        ),

      status:
        query(
          "[data-elara-status]",
          root
        ),

      typing:
        query(
          "[data-elara-typing], .elara-typing",
          root
        ),

      modeLabel:
        query(
          "[data-elara-mode-label]",
          root
        ),

      modeTitle:
        query(
          "[data-elara-mode-title]",
          root
        ),

      promptLabel:
        query(
          "[data-elara-prompt-label]",
          root
        ),

      routeMount:
        query(
          "[data-elara-context-route]",
          root
        ),

      modeId:
        normalize(
          root.getAttribute(
            "data-elara-mode"
          )
        ) ||
        DEFAULT_MODE,

      currentDialogueId:"",
      sequenceToken:0,
      pendingTimer:null,
      pendingResolve:null,
      speaking:false,
      reducedMotion:
        prefersReducedMotion(),
      userNearBottom:true
    };
  };

  const mountRoot = (
    root,
    voice
  ) => {
    if (
      !root ||
      root.getAttribute(
        "data-elara-runtime-mounted"
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
        "data-elara-runtime-error",
        "missing-required-mount"
      );

      return null;
    }

    instances.set(
      state.id,
      state
    );

    installModeButtonListeners(
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
        silent:false
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
          contract:CONTRACT,
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
          "data-elara-runtime-mounted"
        ) === "true"
      ) {
        return;
      }

      root.setAttribute(
        "data-elara-runtime-error",
        "voice-authority-unavailable"
      );

      const status =
        query(
          "[data-elara-status]",
          root
        );

      if (status) {
        status.textContent =
          "Elara's voice authority is unavailable. Her direct pathways remain open.";
      }
    });
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
          "data-elara-instance"
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

  const API = {
    contract:CONTRACT,
    version:1,

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

    restart:
      publicRestart,

    advance:
      publicAdvance
  };

  Object.defineProperty(
    window,
    "ELARA_RUNTIME",
    {
      value:API,
      enumerable:true,
      configurable:false,
      writable:false
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
          once:true
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
