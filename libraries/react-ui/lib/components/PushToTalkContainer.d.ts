import React from 'react';
/**
 * Properties for BigTranscriptContainer component.
 *
 * @public
 */
export declare type PushToTalkContainerProps = {
    /**
     * Optional string (CSS). Defines the button frame width and height. Default: "6rem"
     */
    size?: string;
    /**
     * Optional CSS string. Vertical distance from viewport edge. Default: "3rem"
     */
    voffset?: string;
};
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
export declare const PushToTalkButtonContainer: React.FC<PushToTalkContainerProps>;
