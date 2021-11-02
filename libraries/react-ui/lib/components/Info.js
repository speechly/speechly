"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Info = void 0;
var react_1 = __importStar(require("react"));
var react_spring_1 = require("react-spring");
var styled_components_1 = __importDefault(require("styled-components"));
var types_1 = require("../types");
var Info = function (props) {
    var _a = (0, react_spring_1.useSpring)(function () { return ({
        to: {
            opacity: 0,
            maxHeight: '0rem',
            marginBottom: '0rem',
        },
    }); }), springProps = _a[0], setSpringProps = _a[1];
    (0, react_1.useEffect)(function () {
        if (props.visible) {
            setSpringProps({
                to: function (next, cancel) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, next({
                                    maxHeight: '10rem',
                                    marginBottom: '1.5rem',
                                    opacity: 1,
                                })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); },
                config: react_spring_1.config.stiff,
            });
        }
        else {
            setSpringProps({
                to: function (next, cancel) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, next({
                                    opacity: 0,
                                })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, next({
                                        maxHeight: '0rem',
                                        marginBottom: '0rem',
                                    })];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); },
                config: react_spring_1.config.stiff,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.visible]);
    return (react_1.default.createElement(InfoItemDiv, { onClick: function () { return PubSub.publish(types_1.SpeechlyUiEvents.DismissNotification); }, className: "Warning", style: springProps },
        react_1.default.createElement(InfoItemBgDiv, { backgroundcolor: props.backgroundcolor }),
        react_1.default.createElement(InfoItemContent, { color: props.color }, props.children)));
};
exports.Info = Info;
var InfoItemDiv = (0, styled_components_1.default)(react_spring_1.animated.div)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  user-select: none;\n  pointer-events: auto;\n  position: relative;\n  display: inline-block;\n"], ["\n  user-select: none;\n  pointer-events: auto;\n  position: relative;\n  display: inline-block;\n"])));
var InfoItemContent = (0, styled_components_1.default)(react_spring_1.animated.div)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  z-index: 1;\n  font-size: 1.2rem;\n  line-height: 110%;\n  // color: #000;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n"], ["\n  z-index: 1;\n  font-size: 1.2rem;\n  line-height: 110%;\n  // color: #000;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n"])));
var InfoItemBgDiv = (0, styled_components_1.default)(react_spring_1.animated.div)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: absolute;\n  box-sizing: content-box;\n  width: 100%;\n  height: 100%;\n  top: -0.5rem;\n  left: -0.8rem;\n  margin: 0;\n  padding: 0.5rem 0.8rem;\n  background-color: ", ";\n  z-index: -1;\n"], ["\n  position: absolute;\n  box-sizing: content-box;\n  width: 100%;\n  height: 100%;\n  top: -0.5rem;\n  left: -0.8rem;\n  margin: 0;\n  padding: 0.5rem 0.8rem;\n  background-color: ", ";\n  z-index: -1;\n"])), function (props) { return props.backgroundcolor; });
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=Info.js.map