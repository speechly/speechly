"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushToTalkButton = void 0;
var react_1 = __importStar(require("react"));
var react_client_1 = require("@speechly/react-client");
var pubsub_js_1 = __importDefault(require("pubsub-js"));
var types_1 = require("../types");
require("@speechly/browser-ui/holdable-button");
require("@speechly/browser-ui/call-out");
var __1 = require("..");
/**
 * A React component that renders a push-to-talk microphone button.
 *
 * Make sure to place this component inside your `SpeechProvider` component imported from `@speechly/react-client`.
 *
 * @public
 */
var PushToTalkButton = function (_a) {
    var _b = _a.powerOn, powerOn = _b === void 0 ? false : _b, _c = _a.hide, hide = _c === void 0 ? false : _c, captureKey = _a.captureKey, _d = _a.size, size = _d === void 0 ? '6.0rem' : _d, _e = _a.gradientStops, gradientStops = _e === void 0 ? ['#15e8b5', '#4fa1f9'] : _e, _f = _a.intro, intro = _f === void 0 ? 'Hold to talk' : _f, _g = _a.hint, hint = _g === void 0 ? 'Hold to talk' : _g, fontSize = _a.fontSize, showTime = _a.showTime, textColor = _a.textColor, backgroundColor = _a.backgroundColor, placement = _a.placement;
    var _h = (0, react_client_1.useSpeechContext)(), speechState = _h.speechState, toggleRecording = _h.toggleRecording, initialise = _h.initialise;
    var _j = (0, react_1.useState)((powerOn ? react_client_1.SpeechState.Idle : react_client_1.SpeechState.Ready)), icon = _j[0], setIcon = _j[1];
    var _k = (0, react_1.useState)(intro), hintText = _k[0], setHintText = _k[1];
    var _l = (0, react_1.useState)(true), showHint = _l[0], setShowHint = _l[1];
    var buttonRef = (0, react_1.useRef)();
    var speechStateRef = (0, react_1.useRef)();
    var SHORT_PRESS_TRESHOLD_MS = 600;
    // make stateRef always have the current count
    // your "fixed" callbacks can refer to this object whenever
    // they need the current value.  Note: the callbacks will not
    // be reactive - they will not re-run the instant state changes,
    // but they *will* see the current value whenever they do run
    speechStateRef.current = speechState;
    (0, react_1.useEffect)(function () {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (buttonRef === null || buttonRef === void 0 ? void 0 : buttonRef.current) {
            var button = buttonRef.current;
            button.onholdstart = tangentPressAction;
            button.onholdend = tangentReleaseAction;
        }
    });
    (0, react_1.useEffect)(function () {
        var _a;
        // Change button face according to Speechly states
        if (!powerOn && speechState === react_client_1.SpeechState.Idle) {
            setIcon(react_client_1.SpeechState.Ready);
        }
        else {
            setIcon(speechState);
        }
        // Automatically start recording if button held
        if (!powerOn && ((_a = buttonRef === null || buttonRef === void 0 ? void 0 : buttonRef.current) === null || _a === void 0 ? void 0 : _a.isbuttonpressed()) === true && speechState === react_client_1.SpeechState.Ready) {
            toggleRecording().catch(function (err) { return console.error('Error while starting to record', err); });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [speechState]);
    var tangentPressAction = function () {
        pubsub_js_1.default.publish(types_1.SpeechlyUiEvents.TangentPress, { state: speechStateRef.current });
        window.postMessage({ type: 'holdstart', state: (0, types_1.mapSpeechStateToClientState)(speechStateRef.current !== undefined ? speechStateRef.current : react_client_1.SpeechState.Idle) }, '*');
        setShowHint(false);
        switch (speechStateRef.current) {
            case react_client_1.SpeechState.Idle:
            case react_client_1.SpeechState.Failed:
                // Speechly & Mic initialise needs to be in a function triggered by event handler
                // otherwise it won't work reliably on Safari iOS as of 11/2020
                initialise().catch(function (err) { return console.error('Error initiasing Speechly', err); });
                break;
            case react_client_1.SpeechState.Ready:
                toggleRecording().catch(function (err) { return console.error('Error while starting to record', err); });
                break;
            default:
                break;
        }
    };
    var tangentReleaseAction = function (event) {
        pubsub_js_1.default.publish(types_1.SpeechlyUiEvents.TangentRelease, { state: speechStateRef.current, timeMs: event.timeMs });
        window.postMessage({ type: 'holdend' }, '*');
        switch (speechStateRef === null || speechStateRef === void 0 ? void 0 : speechStateRef.current) {
            case react_client_1.SpeechState.Ready:
            case react_client_1.SpeechState.Recording:
            case react_client_1.SpeechState.Connecting:
            case react_client_1.SpeechState.Loading:
                if (event.timeMs < SHORT_PRESS_TRESHOLD_MS) {
                    console.log(speechStateRef === null || speechStateRef === void 0 ? void 0 : speechStateRef.current);
                    setHintText(hint);
                    setShowHint(true);
                }
                break;
        }
        switch (speechStateRef.current) {
            case react_client_1.SpeechState.Recording:
                toggleRecording().catch(function (err) { return console.error('Error while stopping recording', err); });
                break;
            default:
                break;
        }
    };
    return (react_1.default.createElement("div", null,
        (placement === 'bottom') && (react_1.default.createElement(__1.PushToTalkButtonContainer, null,
            react_1.default.createElement("holdable-button", { ref: buttonRef, poweron: powerOn, capturekey: captureKey, icon: icon, size: size, gradientstop1: gradientStops[0], gradientstop2: gradientStops[1], hide: hide ? 'true' : 'false' }),
            react_1.default.createElement("call-out", { show: showHint && hintText !== '', fontsize: fontSize, textcolor: textColor, backgroundcolor: backgroundColor, showtime: showTime }, hintText))),
        (placement !== 'bottom') && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("holdable-button", { ref: buttonRef, poweron: powerOn, capturekey: captureKey, icon: icon, size: size, gradientstop1: gradientStops[0], gradientstop2: gradientStops[1], hide: hide ? 'true' : 'false' }),
            react_1.default.createElement("call-out", { show: showHint && hintText !== '', fontsize: fontSize, textcolor: textColor, backgroundcolor: backgroundColor, showtime: showTime }, hintText)))));
};
exports.PushToTalkButton = PushToTalkButton;
//# sourceMappingURL=PushToTalkButton.js.map