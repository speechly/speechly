import React from 'react';
/**
 * Properties for BigTranscriptContainer component.
 *
 * @public
 */
export declare type BigTranscriptContainerProps = {
    /**
     * The override value for CSS position (default: `"fixed"`).
     */
    position?: string;
    /**
     * The override value for CSS margin(default: `"3rem 2rem 0 2rem"`).
     */
    margin?: string;
};
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
export declare const BigTranscriptContainer: React.FC<BigTranscriptContainerProps>;
