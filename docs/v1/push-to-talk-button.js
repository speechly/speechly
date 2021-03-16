import { Client, Segment, ClientState } from "@speechly/browser-client";

class PushToTalkButton extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    this.tangentHeld = false;
    this.scale = [1.0, 1.0];
    this.fxOpacity = [0.0, 0.0];
    this.buttonContainerEl = null;
    this.buttonFrameEl = null;
    this.buttonFxEl = null;
    this.buttonIconEl = null;
    this.client = null;
    this.ready = false;
    this.listening = false;

    this.attachShadow({mode: 'open'});

    this.render = () => {
      this.buttonContainerEl = document.createElement('div');
      this.buttonContainerEl.style.cssText = `
        position: relative;
        user-select: none;
        width: ${this.getAttribute("size") || "6rem"};
        height: ${this.getAttribute("size") || "6rem"};
      ` + this.getAttribute("style");
  
      this.buttonFrameEl = document.createElement('div');
      this.buttonFrameEl.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: auto;
        user-select: none;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
      `;
  
      this.buttonFrameEl.innerHTML = `
        <svg viewBox="0 0 92 92" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
              <stop stop-color="#15e8b5" offset="0%" />
              <stop stop-color="#4fa1f9" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="none" fillRule="nonzero">
            <path
              d="M46 3.119c23.683 0 42.881 19.198 42.881 42.881S69.683 88.881 46 88.881 3.119 69.683 3.119 46 22.317 3.119 46 3.119z"
              fill="#FFF"
            />
            <path
              d="M46 0C20.595 0 0 20.595 0 46s20.595 46 46 46 46-20.595 46-46S71.405 0 46 0zm0 3.119c23.683 0 42.881 19.198 42.881 42.881S69.683 88.881 46 88.881 3.119 69.683 3.119 46 22.317 3.119 46 3.119z"
              fill="url(#a)"
            />
          </g>
        </svg>
      `;
      this.buttonFxEl = document.createElement('div');
      this.buttonFxEl.style.cssText = `
        top: -75%;
        left: -75%;
        height: 250%;
        width: 250%;
        position: absolute;
        pointer-events: none;
      `;
      this.buttonFxEl.innerHTML = `
        <svg viewBox="0 0 246 246" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="10%" x2="50%" y2="100%" id="a">
              <stop stop-color="#15e8b5" offset="0%" />
              <stop stop-color="#4fa1f9" offset="100%" />
            </linearGradient>
            <filter
              x="-35%"
              y="-35%"
              width="170%"
              height="170%"
              filterUnits="objectBoundingBox"
              id="b"
            >
              <feGaussianBlur stdDeviation="18" in="SourceGraphic" />
            </filter>
          </defs>
          <circle
            filter="url(#b)"
            cx="124"
            cy="124"
            r="79"
            fill="url(#a)"
            fillRule="evenodd"
          />
        </svg>
      `;
  
      this.buttonIconEl = document.createElement('div');
      this.buttonIconEl.style.cssText = `
        position: absolute;
        width: 60%;
        height: 60%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        transition: 0.25s;
      `;
  
      this.setIcon(this.getAttribute("icon"));
  
      this.buttonContainerEl.append(this.buttonFxEl);
      this.buttonContainerEl.append(this.buttonFrameEl);
      this.buttonContainerEl.append(this.buttonIconEl);
      this.shadowRoot.append(this.buttonContainerEl);
  
    }
  
    this.tick = () => {
      this.animateValue(this.scale, 0.2);
      this.animateValue(this.fxOpacity, 0.12);
      this.buttonContainerEl.style.transform = `scale(${this.scale[1]})`
      this.buttonFxEl.style.opacity = this.fxOpacity[1];
      this.requestId = requestAnimationFrame(this.tick)
    }
  
    this.tangentStart = () => {
      if (!this.tangentHeld) {
        this.tangentHeld = true;
        this.scale[0] = 1.35;
        this.fxOpacity[0] = 1.0;
        this.vibrate();
  
        // Trigger callback if defined
        const f = this.getAttribute('onholdstart');
        if (f) eval(f);
        // Trigger callback defined as property
        if (this._onholdstart) this._onholdstart();
        // Also trigger an event
        this.dispatchEvent(new CustomEvent("onholdstart", {}));

        // Connect on 1st press
        if (!this.client) {
          const appId = this.getAttribute('appid');
          if (appId) this.connectSpeechly(appId);
        }

        // Control speechly
        if (this.client && this.ready && !this.listening) (async () => {await this.client.startContext()})();
      }
    }
  
    this.tangentEnd = () => {
      if (this.tangentHeld) {
        this.tangentHeld = false;
        this.scale[0] = 1.0;
        this.fxOpacity[0] = 0.0;
        this.vibrate();
  
        // Trigger callback if defined
        const f = this.getAttribute('onholdend');
        if (f) eval(f);
        // Trigger callback defined as property
        if (this._onholdend) this._onholdend();
        // Also trigger an event
        this.dispatchEvent(new CustomEvent("onholdend", {}));
        // Control speechly
        if (this.client && this.listening) (async () => {await this.client.stopContext()})();

        this.updateSkin();
      }
    }
  
    this.keyDownCallback = (event) => {
      const captureKey = this.getAttribute("capturekey");
      if (captureKey) {
        if (event.key === captureKey) {
          if (!event.repeat) {
            this.tangentStart();
          }
          event.preventDefault()
          event.stopPropagation()
        }
      }
    }
    
    this.keyUpCallBack = (event) => {
      const captureKey = this.getAttribute("capturekey");
      if (event.key === captureKey) {
        this.tangentEnd();
      }
    }
  
    this.setIcon = (icon) => {
      if (this.buttonIconEl) {
        if (icon) icon = icon.toLowerCase();
        switch (icon) {
          case "mic":
            this.buttonIconEl.innerHTML = `
              <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <g fill="#000" fillRule="evenodd">
                  <path d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z" />
                  <rect x="20" y="1" width="16" height="37" rx="8" />
                </g>
              </svg>
            `
            break;
          case "failed":
          case "nobrowsersupport":
            this.buttonIconEl.innerHTML = `
              <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <g fill="#000" fillRule="evenodd">
                  <path
                    d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z"
                    fillRule="nonzero"
                  />
                  <path d="M37 13.081V31a8 8 0 11-16 0v-1.919l16-16zM26 1a8 8 0 018 8v1.319L18 26.318V9a8 8 0 018-8zM37.969 7.932l3.74-7.35 3.018 2.625zM39.654 10.608l7.531-3.359.695 3.94z" />
                </g>
              </svg>
            `
            break;
          case "noaudioconsent":
            this.buttonIconEl.innerHTML = `
              <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <g fill="#000" fillRule="nonzero">
                  <path d="M36 14.828V30a8 8 0 01-15.961.79l15.96-15.962zM28 1a8 8 0 018 8v.172L20 25.173V9a8 8 0 018-8z" />
                  <path d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z" />
                </g>
              </svg>
            `
            break;
          case "poweron":
          default:
            this.buttonIconEl.innerHTML = `
              <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <g fill="#000" fillRule="evenodd">
                  <path
                    d="M52 28c0 13.255-10.745 24-24 24S4 41.255 4 28c0-8.921 4.867-16.705 12.091-20.842l1.984 3.474C12.055 14.08 8 20.566 8 28c0 11.046 8.954 20 20 20s20-8.954 20-20c0-7.434-4.056-13.92-10.075-17.368L39.91 7.16C47.133 11.296 52 19.079 52 28z"
                    fillRule="nonzero"
                  />
                  <rect x="24" y="1" width="8" height="23" rx="4" />
                </g>
              </svg>
              `
            break;
        }
      }
    }
  
    this.animateValue = (value, pull) => {
      value[1] = (value[1] * (1.0 - pull)) + (value[0] * pull);
    };
  
    this.vibrate = (durationMs = 5) => {
      if (navigator.vibrate !== undefined) {
        navigator.vibrate(durationMs)
      }
    };

    this.updateSkin = () => {
      if (this.clientState !== this.pendingClientState) {
        this.clientState = this.pendingClientState;
        switch(this.clientState) {
          case ClientState.Connected:
            this.ready = true;
            this.setIcon("mic");
            break;
          case ClientState.Failed:
            this.setIcon("failed");
            this.dispatchEvent(new CustomEvent('error', { detail: "Failed" }));
            break;
          case ClientState.NoBrowserSupport:
            this.setIcon("failed");
            this.dispatchEvent(new CustomEvent('error', { detail: "NoBrowserSupport" }));
            break;
          case ClientState.NoAudioConsent:
            this.setIcon("noaudioconsent");
            this.dispatchEvent(new CustomEvent('error', { detail: "NoAudioConsent" }));
            break;
        }
      }
    }

    this.onStateChange = (s) => {
      this.pendingClientState = s;
      switch (s) {
        case ClientState.Starting:
        case ClientState.Recording:
        case ClientState.Stopping:
          this.listening = true;
          break;
        case ClientState.Connected:
          this.listening = false;
          break;
      }
    // Immediately apply changes if not button held
      if (!this.tangentHeld) this.updateSkin();
    };


    this.connectSpeechly = (appId) => {
      // Create a new Client. appId and language are configured in the dashboard.
      console.log("Connecting", appId)
      this.client = new Client({
        appId,
        language: 'en-US'
      });

      this.client.onStateChange(this.onStateChange);

      // Initialize the client - this will ask the user for microphone permissions and establish the connection to Speechly API.
      // Make sure you call `initialize` from a user action handler (e.g. from a button press handler).
      (async () => {
        try {
          await this.client.initialize();
        }
        catch (e) {
          this.client = null;
        }
      })();

      // Pass on segment updates from Speechly API.
      this.client.onSegmentChange((segment = Segment) => {
        console.log("Segment update", segment);
        this.dispatchEvent(new CustomEvent('segment-update', { detail: segment }));
      })
  }
  
  }

  get onholdstart() {
    return this._onholdstart;
  }

  set onholdstart(value) {
    this._onholdstart = value;
  }

  get onholdend() {
    return this._onholdend;
  }

  set onholdend(value) {
    this._onholdend = value;
  }

  connectedCallback() {
    this.render();

    this.buttonContainerEl.addEventListener("mousedown", this.tangentStart);
    this.buttonContainerEl.addEventListener("touchstart", this.tangentStart);
    this.buttonContainerEl.addEventListener("dragstart", this.tangentStart);
    this.buttonContainerEl.addEventListener("mouseup", this.tangentEnd);
    this.buttonContainerEl.addEventListener("touchend", this.tangentEnd);
    this.buttonContainerEl.addEventListener("dragend", this.tangentEnd);
    window.addEventListener('mouseup', this.tangentEnd);

    const captureKey = this.getAttribute("capturekey");

    if (captureKey) {
      window.addEventListener('keydown', this.keyDownCallback);
      window.addEventListener('keyup', this.keyUpCallBack);
    }

    // Start frame animation
    this.tick();
  }

  disconnectedCallback() {
    console.log('Element disconnected from page.');
    cancelAnimationFrame(requestId);
    window.removeEventListener('mouseup', this.tangentEnd);
    window.removeEventListener('keydown', this.keyDownCallback)
    window.removeEventListener('keyup', this.keyUpCallBack)
  }

  // For a change of a listed attribute, attributeChangedCallback triggers
  static get observedAttributes() {
    return ["icon"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log('Element attributes changed: ', name, ": ", oldValue, "=>", newValue);
    switch (name) {
      case "icon": {
        this.setIcon(newValue);
        break;
      }
    }
  }
}

customElements.define('push-to-talk-button', PushToTalkButton);
