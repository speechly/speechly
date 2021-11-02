"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSpeechStateToClientState = exports.SpeechlyUiEvents = void 0;
var browser_client_1 = require("@speechly/browser-client");
var react_client_1 = require("@speechly/react-client");
var SpeechlyUiEvents;
(function (SpeechlyUiEvents) {
    SpeechlyUiEvents["TangentRelease"] = "TangentRelease";
    SpeechlyUiEvents["TangentPress"] = "TangentPress";
    SpeechlyUiEvents["Notification"] = "Notification";
    SpeechlyUiEvents["WarningNotification"] = "WarningNotification";
    SpeechlyUiEvents["DismissNotification"] = "DismissNotification";
})(SpeechlyUiEvents = exports.SpeechlyUiEvents || (exports.SpeechlyUiEvents = {}));
;
var mapSpeechStateToClientState = function (s) {
    switch (s) {
        case react_client_1.SpeechState.Failed:
            return browser_client_1.ClientState.Failed;
        case react_client_1.SpeechState.NoBrowserSupport:
            return browser_client_1.ClientState.NoBrowserSupport;
        case react_client_1.SpeechState.NoAudioConsent:
            return browser_client_1.ClientState.NoAudioConsent;
        case react_client_1.SpeechState.Idle:
            return browser_client_1.ClientState.Disconnected;
        // return ClientState.Disconnecting:
        case react_client_1.SpeechState.Connecting:
            return browser_client_1.ClientState.Connecting;
        case react_client_1.SpeechState.Ready:
            return browser_client_1.ClientState.Connected;
        case react_client_1.SpeechState.Recording:
            // return ClientState.Starting:
            return browser_client_1.ClientState.Recording;
        case react_client_1.SpeechState.Loading:
            return browser_client_1.ClientState.Stopping;
        default:
            return browser_client_1.ClientState.Failed;
    }
};
exports.mapSpeechStateToClientState = mapSpeechStateToClientState;
//# sourceMappingURL=types.js.map