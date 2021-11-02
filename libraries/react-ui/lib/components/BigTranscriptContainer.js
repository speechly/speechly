"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigTranscriptContainer = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var Notifications_1 = require("./Notifications");
var BigTranscriptContainerDiv = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: ", ";\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: ", ";\n  z-index: 50;\n  pointer-events: none;\n  display: flex;\n  flex-direction: column;\n  align-items: start;\n\n  color: #fff;\n  font-size: 1.4rem;\n"], ["\n  position: ", ";\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: ", ";\n  z-index: 50;\n  pointer-events: none;\n  display: flex;\n  flex-direction: column;\n  align-items: start;\n\n  color: #fff;\n  font-size: 1.4rem;\n"
    /**
     * A React component that can be used for wrapping and positioning BigTranscript components.
     *
     * The intended usage is as follows:
     *
     * <BigTranscriptContainer>
     *   <BigTranscript />
     * </BigTranscriptContainer>
     *
     * And then you can use CSS for styling the layout.
     *
     * @public
     */
])), function (props) { return props.position; }, function (props) { return props.margin; });
/**
 * A React component that can be used for wrapping and positioning BigTranscript components.
 *
 * The intended usage is as follows:
 *
 * <BigTranscriptContainer>
 *   <BigTranscript />
 * </BigTranscriptContainer>
 *
 * And then you can use CSS for styling the layout.
 *
 * @public
 */
var BigTranscriptContainer = function (_a) {
    var _b = _a.position, position = _b === void 0 ? 'fixed' : _b, _c = _a.margin, margin = _c === void 0 ? '3rem 2rem 0 2rem' : _c, children = _a.children;
    return (react_1.default.createElement(BigTranscriptContainerDiv, { position: position, margin: margin },
        react_1.default.createElement(Notifications_1.Notifications, null),
        children));
};
exports.BigTranscriptContainer = BigTranscriptContainer;
var templateObject_1;
//# sourceMappingURL=BigTranscriptContainer.js.map