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
exports.TranscriptDrawer = void 0;
var react_1 = __importStar(require("react"));
var react_client_1 = require("@speechly/react-client");
var types_1 = require("../types");
require("@speechly/browser-ui/transcript-drawer");
/**
 * A React component that renders the transcript and entities received from Speechly SLU API.
 *
 * The component is intended to be used for providing visual feedback to the speaker.
 *
 * @public
 */
var TranscriptDrawer = function (props) {
    var _a = (0, react_client_1.useSpeechContext)(), segment = _a.segment, speechState = _a.speechState;
    var refElement = (0, react_1.useRef)();
    var _b = (0, react_1.useState)(false), demoMode = _b[0], setDemoMode = _b[1];
    (0, react_1.useEffect)(function () {
        if ((refElement === null || refElement === void 0 ? void 0 : refElement.current) !== undefined) {
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
        if ((refElement === null || refElement === void 0 ? void 0 : refElement.current) !== undefined && props.mockSegment !== undefined) {
            setDemoMode(true);
            refElement.current.speechsegment(props.mockSegment);
        }
    }, [props.mockSegment]);
    return (react_1.default.createElement("transcript-drawer", { ref: refElement, demomode: demoMode ? 'true' : 'false', formattext: props.formatText === false ? 'false' : 'true', fontsize: props.fontSize, color: props.color, smalltextcolor: props.smallTextColor, highlightcolor: props.highlightColor, backgroundcolor: props.backgroundColor, marginbottom: props.marginBottom, hint: JSON.stringify(props.hint), height: props.height, hintfontsize: props.hintFontSize }));
};
exports.TranscriptDrawer = TranscriptDrawer;
//# sourceMappingURL=TranscriptDrawer.js.map