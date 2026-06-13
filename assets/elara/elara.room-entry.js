// TARGET FILE: /assets/elara/elara.room-entry.js
// TNT FULL-FILE REPLACEMENT
// ELARA_ROOM_ENTRY_ISOLATED_HARD_NAVIGATION_ASSET_TNT_v1
//
// Purpose:
// - Own the reusable "Talk to Elara" room-entry control.
// - Isolate its styling from page-level CSS through Shadow DOM.
// - Bypass page routers, theme toggles, and intercepted anchor behavior.
// - Perform a full native document navigation to /elara/index.html.
// - Remain reusable across future rooms.
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

  const ELEMENT_NAME = "elara-room-entry";
  const DEFAULT_ROUTE = "/elara/index.html";
  const DEFAULT_LABEL = "Talk to Elara";

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

      this._navigating = false;
      this._shadow = this.attachShadow({
        mode: "open"
      });

      this._shadow.innerHTML = `
        <style>
          :host{
            display:block;
            width:100%;
            min-width:0;

            --elara-blue:#245dff;
            --elara-violet:#8d36f4;
            --elara-cyan:#5df7ff;
            --elara-white:#ffffff;
            --elara-muted:rgba(240,246,255,.72);
            --elara-line:rgba(163,120,255,.78);
          }

          *{
            box-sizing:border-box;
          }

          .entry{
            display:grid;
            gap:.38rem;
            width:100%;
          }

          .button{
            position:relative;
            isolation:isolate;
            overflow:hidden;

            width:100%;
            min-height:4.9rem;

            display:flex;
            align-items:center;
            justify-content:center;
            gap:.8rem;

            margin:0;
            padding:.85rem 1.2rem;

            border:1px solid var(--elara-line);
            border-radius:999px;

            color:var(--elara-white);

            background:
              radial-gradient(
                circle at 50% 0%,
                rgba(255,255,255,.20),
                transparent 66%
              ),
              linear-gradient(
                135deg,
                var(--elara-blue),
                var(--elara-violet)
              );

            box-shadow:
              0 0 1.1rem rgba(93,247,255,.22),
              0 0 2.8rem rgba(141,54,244,.34),
              0 1.2rem 3rem rgba(0,0,0,.38),
              inset 0 1px 0 rgba(255,255,255,.30);

            font:
              950 .92rem/1
              Inter,
              ui-sans-serif,
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;

            letter-spacing:.13em;
            text-transform:uppercase;

            cursor:pointer;
            touch-action:manipulation;
            -webkit-tap-highlight-color:transparent;

            transition:
              transform .18s ease,
              border-color .18s ease,
              box-shadow .18s ease,
              filter .18s ease;
          }

          .button::before{
            content:"";

            width:.82rem;
            height:.82rem;
            flex:0 0 auto;

            border-radius:50%;

            background:
              radial-gradient(
                circle at 34% 28%,
                #ffffff 0 12%,
                var(--elara-cyan) 36%,
                #a563ff 72%,
                #4e22ba 100%
              );

            box-shadow:
              0 0 .85rem rgba(93,247,255,.94),
              0 0 1.7rem rgba(141,54,244,.72);
          }

          .button::after{
            content:"";

            position:absolute;
            inset:-110% -36%;
            z-index:-1;

            transform:
              translateX(-72%)
              rotate(17deg);

            background:
              linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,.42),
                transparent
              );

            transition:transform .68s ease;
          }

          .button:hover,
          .button:focus-visible{
            transform:translateY(-2px);

            border-color:rgba(93,247,255,.94);

            box-shadow:
              0 0 1.2rem rgba(93,247,255,.50),
              0 0 3.2rem rgba(141,54,244,.44),
              0 1.4rem 3.2rem rgba(0,0,0,.42),
              inset 0 1px 0 rgba(255,255,255,.34);

            filter:saturate(1.12);
          }

          .button:hover::after,
          .button:focus-visible::after{
            transform:
              translateX(72%)
              rotate(17deg);
          }

          .button:focus-visible{
            outline:2px solid var(--elara-cyan);
            outline-offset:4px;
          }

          .button:active{
            transform:translateY(0) scale(.99);
          }

          .button[disabled]{
            cursor:not-allowed;
            opacity:.48;
            filter:saturate(.55);
            transform:none;
          }

          .subtitle{
            min-height:1rem;

            margin:0;
            padding:0 .8rem;

            color:var(--elara-muted);

            font:
              750 .69rem/1.4
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
            .button{
              min-height:5.15rem;
              font-size:.9rem;
            }
          }

          @media (prefers-reduced-motion:reduce){
            .button,
            .button::after{
              transition:none;
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
        this._shadow.querySelector(".button");

      this._subtitle =
        this._shadow.querySelector(".subtitle");

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
        this.removeAttribute("href");
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
        this.removeAttribute("label");
        return;
      }

      this.setAttribute(
        "label",
        String(value)
      );
    }

    get disabled() {
      return this.hasAttribute("disabled");
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

      this._navigating = true;
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
        document.createElement("form");

      form.method = "GET";
      form.action =
        destination.pathname;
      form.hidden = true;
      form.setAttribute(
        "aria-hidden",
        "true"
      );

      destination.searchParams.forEach(
        (value,key) => {
          const input =
            document.createElement("input");

          input.type = "hidden";
          input.name = key;
          input.value = value;

          form.appendChild(input);
        }
      );

      const mount =
        document.body ||
        document.documentElement;

      mount.appendChild(form);

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
