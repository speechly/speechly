"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.Notifications = exports.NotificationType = void 0;
var react_1 = __importStar(require("react"));
var react_client_1 = require("@speechly/react-client");
var styled_components_1 = __importDefault(require("styled-components"));
var Info_1 = require("./Info");
var types_1 = require("../types");
var NotificationType;
(function (NotificationType) {
    NotificationType["info"] = "info";
    NotificationType["warning"] = "warning";
})(NotificationType = exports.NotificationType || (exports.NotificationType = {}));
var NotificationId = 0;
var Notifications = function (props) {
    var speechState = (0, react_client_1.useSpeechContext)().speechState;
    var _a = (0, react_1.useState)(null), notification = _a[0], setNotification = _a[1];
    /*
      {
        type: NotificationType.info,
        message: "Could not find 'Good vibes pants'",
        footnote: "Try: 'Sneakers'",
        visible: true,
      }
      {
        type: NotificationType.warning,
        message: "Bad audio. Please say again.",
        visible: true,
      },
      {
        type: NotificationType.warning,
        message: "Sorry, all we hear is silence.",
        visible: true,
      },
      {
        type: NotificationType.info,
        message: "Please say again",
        footnote: 'Try: "Sneakers"',
        visible: true,
      }
    */
    (0, react_1.useEffect)(function () {
        var subDismiss = PubSub.subscribe(types_1.SpeechlyUiEvents.DismissNotification, function (message, payload) {
            hideHints();
        });
        var subNotification = PubSub.subscribe(types_1.SpeechlyUiEvents.Notification, function (message, payload) {
            setNotification({
                type: NotificationType.info,
                notificationId: "msg-" + NotificationId++,
                message: payload.message,
                footnote: payload.footnote,
                visible: true,
            });
        });
        var subWarningNotification = PubSub.subscribe(types_1.SpeechlyUiEvents.WarningNotification, function (message, payload) {
            setNotification({
                type: NotificationType.warning,
                notificationId: "msg-" + NotificationId++,
                message: payload.message,
                footnote: payload.footnote,
                visible: true,
            });
        });
        return function () {
            PubSub.unsubscribe(subNotification);
            PubSub.unsubscribe(subWarningNotification);
            PubSub.unsubscribe(subDismiss);
        };
    }, []);
    (0, react_1.useEffect)(function () {
        switch (speechState) {
            case react_client_1.SpeechState.Recording: {
                hideHints();
            }
        }
    }, [speechState]);
    var hideHints = function () {
        setNotification(function (prev) { return (prev !== null ? __assign(__assign({}, prev), { visible: false }) : null); });
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        (notification === null || notification === void 0 ? void 0 : notification.type) === NotificationType.info && (react_1.default.createElement(Info_1.Info, { visible: (notification === null || notification === void 0 ? void 0 : notification.visible) || false, color: "#fff", backgroundcolor: "#46c" },
            react_1.default.createElement(InfoIcon, { color: "#fff" }),
            react_1.default.createElement("div", null, notification === null || notification === void 0 ? void 0 :
                notification.message,
                (notification === null || notification === void 0 ? void 0 : notification.footnote) !== null && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("small", null, notification.footnote)))))),
        (notification === null || notification === void 0 ? void 0 : notification.type) === NotificationType.warning && (react_1.default.createElement(Info_1.Info, { visible: (notification === null || notification === void 0 ? void 0 : notification.visible) || false, color: "#000", backgroundcolor: "#fc0" },
            react_1.default.createElement(WarningIcon, { color: "#000" }),
            react_1.default.createElement("div", null, notification === null || notification === void 0 ? void 0 :
                notification.message,
                (notification === null || notification === void 0 ? void 0 : notification.footnote) !== null && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("small", null, notification === null || notification === void 0 ? void 0 : notification.footnote))))))));
};
exports.Notifications = Notifications;
var InfoIcon = function (props) {
    return (react_1.default.createElement(IconSvg, { viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" },
        react_1.default.createElement("g", { fill: props.color, fillRule: "evenodd" },
            react_1.default.createElement("path", { d: "M12 1.5c5.799 0 10.5 4.701 10.5 10.5S17.799 22.5 12 22.5 1.5 17.799 1.5 12 6.201 1.5 12 1.5zM12 3a9 9 0 100 18 9 9 0 000-18z" }),
            react_1.default.createElement("path", { fillRule: "nonzero", d: "M13 10v8h-2v-6.5h-1V10z" }),
            react_1.default.createElement("circle", { cx: "11.75", cy: "7.5", r: "1.5" }))));
};
var WarningIcon = function (props) {
    return (react_1.default.createElement(IconSvg, { viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" },
        react_1.default.createElement("path", { d: "M12.738.743a1.5 1.5 0 01.568.567l10.429 18.452A1.5 1.5 0 0122.429 22H1.571a1.5 1.5 0 01-1.306-2.238L10.695 1.31a1.5 1.5 0 012.043-.567zM8.5 13H7v1a5.001 5.001 0 004.25 4.944V21h1.5v-2.056A5.001 5.001 0 0017 14v-1h-1.5v1l-.005.192A3.5 3.5 0 0112 17.5l-.192-.005A3.5 3.5 0 018.5 14v-1zM12 6a2 2 0 00-2 2v6a2 2 0 104 0V8a2 2 0 00-2-2z", fill: props.color, fillRule: "evenodd" })));
};
var IconSvg = styled_components_1.default.svg(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 1.5rem;\n  height: 1.5rem;\n  flex-shrink: 0;\n  margin-right: 0.5rem;\n  margin-bottom: auto;\n"], ["\n  width: 1.5rem;\n  height: 1.5rem;\n  flex-shrink: 0;\n  margin-right: 0.5rem;\n  margin-bottom: auto;\n"])));
var templateObject_1;
//# sourceMappingURL=Notifications.js.map