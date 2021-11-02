"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorPanel = void 0;
var react_1 = __importDefault(require("react"));
require("@speechly/browser-ui/error-panel");
/**
 * An optional dismissable React component that renders an error message if something
 * prevents Speechly SDK from functioning. It also provides recovery instructions.
 * <ErrorPanel> responds to <PushToTalkButton> presses so it needs to exist somewhere in the component hierarchy.
 *
 * It is intented to be displayed at the lower part of the screen like so:
 * <ErrorPanel placement="bottom"/>
 *
 * @public
 */
var ErrorPanel = function (_a) {
    var _b = _a.placement, placement = _b === void 0 ? 'bottom' : _b;
    return (react_1.default.createElement("error-panel", { placement: placement }));
};
exports.ErrorPanel = ErrorPanel;
//# sourceMappingURL=ErrorPanel.js.map