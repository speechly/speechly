import React from 'react';
export declare type KeyCallback = (event: KeyboardEvent) => any;
export declare function useKeyboardEvent(keyDownCallback: KeyCallback, keyUpCallBack: KeyCallback, dependencies?: React.DependencyList): void;
