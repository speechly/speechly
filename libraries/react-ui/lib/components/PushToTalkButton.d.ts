import React from 'react';
import '@speechly/browser-ui/holdable-button';
import '@speechly/browser-ui/call-out';
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'holdable-button': any;
        }
        interface IntrinsicElements {
            'call-out': any;
        }
    }
}
/**
 * Properties for PushToTalkButton component.
 *
 * @public
 */
export declare type PushToTalkButtonProps = {
    /**
     * Optional "bottom" string turns on internal placement without any CSS positioning.
     */
    placement?: string;
    /**
     * Keyboard key to use for controlling the button.
     * Passing e.g. ` ` (a spacebar) will mean that holding down the spacebar key will key the button pressed.
     */
    captureKey?: string;
    /**
     * The size of the button, as CSS (e.g. `5rem`).
     */
    size?: string;
    /**
     * Colours of the gradient around the button.
     * Valid input is an array of two hex colour codes, e.g. `['#fff', '#000']`.
     */
    gradientStops?: string[];
    /**
     * Optional boolean. Default: false
     */
    hide?: boolean;
    /**
     * Optional string containing a short usage introduction. Displayed when the component is first displayed. Default: "Push to talk". Set to "" to disable.
     */
    intro?: string;
    /**
     * Optional string containing a short usage hint. Displayed on a short tap. Default: "Push to talk". Set to "" to disable.
     */
    hint?: string;
    /**
     * Optional CSS string for hint text. Default: "1.2rem"
     */
    fontSize?: string;
    /**
     * Optional number in ms. Visibility duration for intro and hint callouts. Default: "5000" (ms)
     */
    showTime?: number;
    /**
     * Optional string (CSS color) for hint text. Default: "#ffffff"
     */
    textColor?: string;
    /**
     * Optional string (CSS color) for hint text background. Default: "#202020"
     */
    backgroundColor?: string;
    /**
     * Optional boolean. Shows poweron state. If false, recording can immediately start but will first press will cause a system permission prompt. Default: false
     */
    powerOn?: boolean;
};
/**
 * A React component that renders a push-to-talk microphone button.
 *
 * Make sure to place this component inside your `SpeechProvider` component imported from `@speechly/react-client`.
 *
 * @public
 */
export declare const PushToTalkButton: React.FC<PushToTalkButtonProps>;
