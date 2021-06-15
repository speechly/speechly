export { ClientState } from "@speechly/browser-client/speechly/types.js";
export declare type ITaggedWord = {
    word: string;
    serialNumber: number;
    entityType: string | null;
    isFinal: boolean;
    hide: boolean;
};
export declare type IAppearance = {
    icon: Icon;
    behaviour: Behaviour;
    effect: Effect;
};
export declare type IHoldEvent = {
    timeMs: number;
};
export declare enum SpeechState {
    /**
     * The context is in a state of unrecoverable error.
     * It is only possible to fix this by destroying and creating it from scratch.
     */
    Failed = "Failed",
    /**
     * Current browser is not supported by Speechly - it's not possible to use speech functionality.
     */
    NoBrowserSupport = "NoBrowserSupport",
    /**
     * The user did not provide permissions to use the microphone - it is not possible to use speech functionality.
     */
    NoAudioConsent = "NoAudioConsent",
    /**
     * The context has been created but not initialised. The audio and API connection are not enabled.
     */
    Idle = "Idle",
    /**
     * The context is connecting to the API.
     */
    Connecting = "Connecting",
    /**
     * The context is ready to use.
     */
    Ready = "Ready",
    /**
     * The context is current recording audio and sending it to the API for recognition.
     * The results are also being fetched.
     */
    Recording = "Recording",
    /**
     * The context is waiting for the API to finish sending trailing responses.
     * No audio is being sent anymore.
     */
    Loading = "Loading"
}
export declare enum Icon {
    Poweron = "poweron",
    Mic = "mic",
    Error = "error",
    Denied = "denied"
}
export declare enum Behaviour {
    Hold = "hold",
    Click = "click",
    Noninteractive = "noninteractive"
}
export declare enum Effect {
    None = "none",
    Connecting = "connecting",
    Busy = "busy"
}
export declare const stateToAppearance: {
    [state: string]: IAppearance;
};
