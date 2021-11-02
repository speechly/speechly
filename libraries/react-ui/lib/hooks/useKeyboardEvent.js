"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeyboardEvent = void 0;
var react_1 = require("react");
function useKeyboardEvent(keyDownCallback, keyUpCallBack, dependencies) {
    if (dependencies === void 0) { dependencies = []; }
    (0, react_1.useEffect)(function () {
        window.addEventListener('keydown', keyDownCallback);
        window.addEventListener('keyup', keyUpCallBack);
        return function () {
            window.removeEventListener('keydown', keyDownCallback);
            window.removeEventListener('keyup', keyUpCallBack);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}
exports.useKeyboardEvent = useKeyboardEvent;
//# sourceMappingURL=useKeyboardEvent.js.map