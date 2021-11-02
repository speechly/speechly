import { ClientState } from '@speechly/browser-client';
import { SpeechState } from '@speechly/react-client';
export declare enum SpeechlyUiEvents {
    TangentRelease = "TangentRelease",
    TangentPress = "TangentPress",
    Notification = "Notification",
    WarningNotification = "WarningNotification",
    DismissNotification = "DismissNotification"
}
export declare const mapSpeechStateToClientState: (s: SpeechState) => ClientState;
