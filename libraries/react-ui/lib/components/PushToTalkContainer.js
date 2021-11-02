"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushToTalkButtonContainer = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var PushToTalkContainerDiv = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: calc(", " + ", ");\n  max-height: 100vh;\n  pointer-events: none;\n\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  z-index: 50;\n"], ["\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: calc(", " + ", ");\n  max-height: 100vh;\n  pointer-events: none;\n\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  z-index: 50;\n"
    /**
     * A React component that can be used for wrapping and positioning PushToTalkButton components.
     *
     * The intended usage is as follows:
     *
     * <PushToTalkButtonContainer>
     *   <PushToTalkButton />
     * </PushToTalkButtonContainer>
     *
     * And then you can use CSS for styling the layout.
     *
     * @public
     */
])), function (props) { return props.size; }, function (props) { return props.voffset; });
/**
 * A React component that can be used for wrapping and positioning PushToTalkButton components.
 *
 * The intended usage is as follows:
 *
 * <PushToTalkButtonContainer>
 *   <PushToTalkButton />
 * </PushToTalkButtonContainer>
 *
 * And then you can use CSS for styling the layout.
 *
 * @public
 */
var PushToTalkButtonContainer = function (_a) {
    var _b = _a.size, size = _b === void 0 ? '6rem' : _b, _c = _a.voffset, voffset = _c === void 0 ? '3rem' : _c, children = _a.children;
    return react_1.default.createElement(PushToTalkContainerDiv, { size: size, voffset: voffset }, children);
};
exports.PushToTalkButtonContainer = PushToTalkButtonContainer;
var templateObject_1;
//# sourceMappingURL=PushToTalkContainer.js.map