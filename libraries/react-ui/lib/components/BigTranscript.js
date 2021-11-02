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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigTranscript = void 0;
var react_1 = __importStar(require("react"));
var react_client_1 = require("@speechly/react-client");
var types_1 = require("../types");
require("@speechly/browser-ui/big-transcript");
/**
 * A React component that renders the transcript and entities received from Speechly SLU API.
 *
 * The component is intended to be used for providing visual feedback to the speaker.
 *
 * @public
 */
var BigTranscript = function (_a) {
    var _b = _a.placement, placement = _b === void 0 ? 'top' : _b, formatText = _a.formatText, fontSize = _a.fontSize, color = _a.color, highlightColor = _a.highlightColor, backgroundColor = _a.backgroundColor, _c = _a.marginBottom, marginBottom = _c === void 0 ? '2rem' : _c, mockSegment = _a.mockSegment;
    var _d = (0, react_client_1.useSpeechContext)(), segment = _d.segment, speechState = _d.speechState;
    var refElement = (0, react_1.useRef)();
    var _e = (0, react_1.useState)(false), demoMode = _e[0], setDemoMode = _e[1];
    // Change button face according to Speechly states
    (0, react_1.useEffect)(function () {
        if ((refElement === null || refElement === void 0 ? void 0 : refElement.current) !== undefined && speechState !== undefined) {
            refElement.current.speechstate((0, types_1.mapSpeechStateToClientState)(speechState));
        }
    }, [speechState]);
    (0, react_1.useEffect)(function () {
        if ((refElement === null || refElement === void 0 ? void 0 : refElement.current) !== undefined && segment !== undefined) {
            setDemoMode(false);
            refElement.current.speechsegment(segment);
        }
    }, [segment]);
    (0, react_1.useEffect)(function () {
        if ((refElement === null || refElement === void 0 ? void 0 : refElement.current) !== undefined && mockSegment !== undefined) {
            setDemoMode(true);
            refElement.current.speechsegment(mockSegment);
        }
    }, [mockSegment]);
    return (react_1.default.createElement("big-transcript", { ref: refElement, placement: placement, demomode: demoMode ? 'true' : 'false', formattext: (formatText !== null && formatText === false) ? 'false' : 'true', fontsize: fontSize, color: color, highlightcolor: highlightColor, backgroundcolor: backgroundColor, marginbottom: marginBottom }));
};
exports.BigTranscript = BigTranscript;
//# sourceMappingURL=BigTranscript.js.map