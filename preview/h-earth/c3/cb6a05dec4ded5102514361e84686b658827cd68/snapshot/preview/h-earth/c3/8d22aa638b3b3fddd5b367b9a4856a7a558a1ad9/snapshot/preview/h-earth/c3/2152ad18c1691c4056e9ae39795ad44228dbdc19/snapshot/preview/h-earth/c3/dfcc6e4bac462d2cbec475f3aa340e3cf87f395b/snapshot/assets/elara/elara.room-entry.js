// TARGET FILE: /assets/elara/elara.room-entry.js
// TNT FULL-FILE REPLACEMENT
// ELARA_ROOM_ENTRY_RESTRAINED_ROOM_HARMONY_HARD_NAVIGATION_ASSET_TNT_v2
//
// Purpose:
// - Own the reusable "Talk to Elara" room-entry control.
// - Preserve its isolated Shadow DOM styling and native navigation.
// - Reduce visual dominance while keeping Elara visible at the top of a room.
// - Harmonize the control with dark navy, graphite, cyan, and violet room palettes.
// - Permit future room-level tuning through host CSS custom properties.
// - Perform a full native document navigation to /elara/index.html.
//
// Does not own:
// - /elara/index.html
// - Showroom page architecture
// - Manor Blueprint navigation
// - Mirrorland Map Portal behavior
// - Diamond rendering or controls
//

(() => {
  "use strict";

  const ELEMENT_NAME =
    "elara-room-entry";

  const DEFAULT_ROUTE =
    "/elara/index.html";

  const DEFAULT_LABEL =
    "Talk to Elara";

  if (
    !("customElements" in window) ||
    customElements.get(ELEMENT_NAME)
  ) {
    return;
  }

  class ElaraRoomEntry extends HTMLElement {
    static get observedAttributes() {
      return [
        "href",
        "label",
        "subtitle",
        "disabled"
      ];
    }

    constructor() {
      super();

      this._navigating =
        false;

      this._shadow =
        this.attachShadow({
          mode: "open"
        });

      this._shadow.innerHTML = `
        <style>
          :host{
            display:block;
            width:100%;
            min-width:0;

            --elara-entry-text:#f8fbff;
            --elara-entry-muted:rgba(226,238,249,.72);

            --elara-entry-cyan:#8edcf3;
            --elara-entry-violet:#9d83db;
            --elara-entry-blue:#385f94;

            --elara-entry-line:rgba(139,190,224,.38);
            --elara-entry-line-hover:rgba(157,218,241,.62);

            --elara-entry-top:rgba(21,45,76,.96);
            --elara-entry-bottom:rgba(8,19,38,.99);

            --elara-entry-height:3.55rem;
            --elara-entry-radius:999px;
            --elara-entry-font-size:.78rem;
            --elara-entry-letter-spacing:.105em;

            --elara-entry-shadow:
              0 .8rem 2rem rgba(0,0,0,.30),
              0 0 1.3rem rgba(82,139,184,.10),
              inset 0 1px 0 rgba(255,255,255,.12);

            --elara-entry-shadow-hover:
              0 .95rem 2.2rem rgba(0,0,0,.34),
              0 0 1.5rem rgba(142,220,243,.16),
              0 0 2.2rem rgba(157,131,219,.10),
              inset 0 1px 0 rgba(255,255,255,.16);
          }

          *{
            box-sizing:border-box;
          }

          .entry{
            display:grid;
            gap:.34rem;
            width:100%;
            min-width:0;
          }

          .button{
            position:relative;
            isolation:isolate;
            overflow:hidden;

            width:100%;
            min-width:0;
            min-height:var(--elara-entry-height);

            display:flex;
            align-items:center;
            justify-content:center;
            gap:.66rem;

            margin:0;
            padding:.72rem 1rem;

            border:
              1px solid
              var(--elara-entry-line);

            border-radius:
              var(--elara-entry-radius);

            color:
              var(--elara-entry-text);

            background:
              radial-gradient(
                circle at 50% 0%,
                rgba(255,255,255,.085),
                transparent 68%
              ),
              linear-gradient(
                135deg,
                var(--elara-entry-top),
                var(--elara-entry-bottom)
              );

            box-shadow:
              var(--elara-entry-shadow);

            font:
              900 var(--elara-entry-font-size)/1.1
              Inter,
              ui-sans-serif,
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;

            letter-spacing:
              var(--elara-entry-letter-spacing);

            text-align:center;
            text-transform:uppercase;

            cursor:pointer;
            touch-action:manipulation;
            -webkit-tap-highlight-color:transparent;

            transition:
              transform .16s ease,
              border-color .16s ease,
              background .16s ease,
              box-shadow .16s ease,
              color .16s ease;
          }

          .button::before{
            content:"";

            width:.64rem;
            height:.64rem;
            flex:0 0 auto;

            border-radius:50%;

            background:
              radial-gradient(
                circle at 34% 28%,
                #ffffff 0 10%,
                var(--elara-entry-cyan) 36%,
                var(--elara-entry-violet) 72%,
                #3d315f 100%
              );

            box-shadow:
              0 0 .5rem rgba(142,220,243,.60),
              0 0 .95rem rgba(157,131,219,.28);
          }

          .button::after{
            content:"";

            position:absolute;
            inset:0;
            z-index:-1;

            pointer-events:none;

            opacity:.46;

            background:
              linear-gradient(
                105deg,
                transparent 0 34%,
                rgba(142,220,243,.07) 48%,
                rgba(157,131,219,.08) 56%,
                transparent 72%
              );

            transform:
              translateX(-22%);

            transition:
              opacity .16s ease,
              transform .34s ease;
          }

          .button:hover,
          .button:focus-visible{
            transform:
              translateY(-1px);

            border-color:
              var(--elara-entry-line-hover);

            color:
              #ffffff;

            background:
              radial-gradient(
                circle at 50% 0%,
                rgba(255,255,255,.11),
                transparent 68%
              ),
              linear-gradient(
                135deg,
                rgba(25,55,91,.98),
                rgba(12,24,47,.99)
              );

            box-shadow:
              var(--elara-entry-shadow-hover);
          }

          .button:hover::after,
          .button:focus-visible::after{
            opacity:.72;

            transform:
              translateX(18%);
          }

          .button:focus-visible{
            outline:
              2px solid
              var(--elara-entry-cyan);

            outline-offset:
              4px;
          }

          .button:active{
            transform:
              translateY(0)
              scale(.995);
          }

          .button[aria-busy="true"]{
            cursor:progress;
          }

          .button[disabled]{
            cursor:not-allowed;
            opacity:.48;
            filter:saturate(.5);
            transform:none;
            box-shadow:none;
          }

          .subtitle{
            min-height:1rem;

            margin:0;
            padding:0 .72rem;

            color:
              var(--elara-entry-muted);

            font:
              720 .67rem/1.4
              Inter,
              ui-sans-serif,
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;

            letter-spacing:.025em;
            text-align:center;
          }

          .subtitle:empty{
            display:none;
          }

          @media (max-width:760px){
            :host{
              --elara-entry-height:3.7rem;
              --elara-entry-font-size:.76rem;
              --elara-entry-letter-spacing:.095em;
            }

            .button{
              padding:.76rem .92rem;
            }
          }

          @media (prefers-contrast:more){
            :host{
              --elara-entry-line:rgba(201,232,247,.72);
              --elara-entry-line-hover:rgba(231,249,255,.96);
              --elara-entry-muted:rgba(240,248,255,.90);
            }
          }

          @media (prefers-reduced-motion:reduce){
            .button,
            .button::after{
              transition:none;
            }

            .button:hover,
            .button:focus-visible,
            .button:active{
              transform:none;
            }
          }
        </style>

        <div class="entry">
          <button
            class="button"
            type="button"
            part="button"
          ></button>

          <p
            class="subtitle"
            part="subtitle"
          ></p>
        </div>
      `;

      this._button =
        this._shadow.querySelector(
          ".button"
        );

      this._subtitle =
        this._shadow.querySelector(
          ".subtitle"
        );

      this._onClick =
        this._onClick.bind(this);

      this._onPointerUp =
        this._onPointerUp.bind(this);

      this._onKeyDown =
        this._onKeyDown.bind(this);
    }

    connectedCallback() {
      this._render();

      this._button.addEventListener(
        "pointerup",
        this._onPointerUp
      );

      this._button.addEventListener(
        "click",
        this._onClick
      );

      this._button.addEventListener(
        "keydown",
        this._onKeyDown
      );
    }

    disconnectedCallback() {
      this._button.removeEventListener(
        "pointerup",
        this._onPointerUp
      );

      this._button.removeEventListener(
        "click",
        this._onClick
      );

      this._button.removeEventListener(
        "keydown",
        this._onKeyDown
      );
    }

    attributeChangedCallback() {
      if (this.isConnected) {
        this._render();
      }
    }

    get href() {
      return (
        this.getAttribute("href") ||
        DEFAULT_ROUTE
      );
    }

    set href(value) {
      if (!value) {
        this.removeAttribute(
          "href"
        );

        return;
      }

      this.setAttribute(
        "href",
        String(value)
      );
    }

    get label() {
      return (
        this.getAttribute("label") ||
        DEFAULT_LABEL
      );
    }

    set label(value) {
      if (!value) {
        this.removeAttribute(
          "label"
        );

        return;
      }

      this.setAttribute(
        "label",
        String(value)
      );
    }

    get disabled() {
      return this.hasAttribute(
        "disabled"
      );
    }

    set disabled(value) {
      this.toggleAttribute(
        "disabled",
        Boolean(value)
      );
    }

    navigate() {
      if (
        this.disabled ||
        this._navigating
      ) {
        return;
      }

      this._navigating =
        true;

      this._button.setAttribute(
        "aria-busy",
        "true"
      );

      const destination =
        this._resolveDestination();

      this.dispatchEvent(
        new CustomEvent(
          "elara-room-entry-navigation",
          {
            bubbles:false,
            composed:false,
            cancelable:false,
            detail:{
              destination:
                destination.href,

              source:
                window.location.pathname
            }
          }
        )
      );

      this._submitNativeNavigation(
        destination
      );
    }

    _render() {
      const subtitle =
        this.getAttribute("subtitle") ||
        "";

      this._button.textContent =
        this.label;

      this._button.disabled =
        this.disabled;

      this._button.setAttribute(
        "aria-label",
        this.label
      );

      this._button.removeAttribute(
        "aria-busy"
      );

      this._subtitle.textContent =
        subtitle;
    }

    _resolveDestination() {
      let destination;

      try {
        destination =
          new URL(
            this.href,
            window.location.href
          );
      } catch {
        destination =
          new URL(
            DEFAULT_ROUTE,
            window.location.origin
          );
      }

      if (
        destination.origin !==
        window.location.origin
      ) {
        destination =
          new URL(
            DEFAULT_ROUTE,
            window.location.origin
          );
      }

      return destination;
    }

    _submitNativeNavigation(destination) {
      const form =
        document.createElement(
          "form"
        );

      form.method =
        "GET";

      form.action =
        destination.pathname;

      form.hidden =
        true;

      form.setAttribute(
        "aria-hidden",
        "true"
      );

      destination.searchParams.forEach(
        (value,key) => {
          const input =
            document.createElement(
              "input"
            );

          input.type =
            "hidden";

          input.name =
            key;

          input.value =
            value;

          form.appendChild(
            input
          );
        }
      );

      const mount =
        document.body ||
        document.documentElement;

      mount.appendChild(
        form
      );

      try {
        HTMLFormElement.prototype.submit.call(
          form
        );
      } catch {
        window.location.assign(
          destination.href
        );
      }
    }

    _onPointerUp(event) {
      if (
        event.button !== undefined &&
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      this.navigate();
    }

    _onClick(event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      this.navigate();
    }

    _onKeyDown(event) {
      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      this.navigate();
    }
  }

  customElements.define(
    ELEMENT_NAME,
    ElaraRoomEntry
  );
})();
