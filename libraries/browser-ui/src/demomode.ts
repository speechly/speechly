import type { Segment } from "./types";
import { MessageType } from "./constants";

var timeout = undefined;
var contextId: string;

const tokenizeSal = (s: string) => {
  if (s[0] !== "*")
    throw new Error("Expecting '*' to mark intent at start of SAL string");

  let i = s.indexOf(" ");
  if (i === -1)
    throw new Error("Expecting at least one word in addition to intent");
  let intent = s.substring(1, i);

  i++;
  let tokens = [];
  let stack = [];
  let isAlpha = false;
  let wordStart = undefined;
  let char = undefined;

  while (i <= s.length) {
    isAlpha = false;
    char = s[i];

    switch (char) {
      case undefined:
      case " ":
        break;
      case "(":
        stack.push({ ch: "(", index: i });
        break;
      case "[":
        stack.push({ ch: "[", index: i });
        break;
      case "]":
        if (stack.length > 0 && stack[stack.length - 1].ch === "[") {
          tokens.push({
            word: s.substring(stack[stack.length - 1].index + 1, i).trim(),
          });
        }
        stack.pop();
        break;
      case ")":
        if (
          stack.length > 0 &&
          tokens.length > 0 &&
          stack[stack.length - 1].ch === "("
        ) {
          tokens[tokens.length - 1].type = s
            .substring(stack[stack.length - 1].index + 1, i)
            .trim();
        }
        stack.pop();
        break;
      default:
        isAlpha = true;
        break;
    }

    if (stack.length === 0 && wordStart === undefined && isAlpha) {
      wordStart = i;
    }

    if (wordStart !== undefined && !isAlpha) {
      tokens.push({
        word: s.substring(wordStart, i).trim(),
      });
      wordStart = undefined;
    }
    i++;
  }

  return { intent, tokens };
};

const generateSegment = (contextId, tokenizedSal, lastToken = undefined) => {
  const id = 0;
  //const contextId = "e310e11e-95d4-4f22-98dd-388a1bd84718"

  if (lastToken === undefined) lastToken = tokenizedSal.tokens.length;

  let words = [];
  let entities = [];

  tokenizedSal.tokens.slice(0, lastToken).forEach((token, index) => {
    words.push({
      value: token.word,
      index: index,
      isFinal: true,
    });
    if (token.type) {
      entities.push({
        type: token.type,
        value: token.word,
        startPosition: index,
        endPosition: index + 1,
        isFinal: true,
      });
    }
  });

  return {
    id: id,
    contextId: contextId,
    isFinal: true,
    intent: {
      intent: tokenizedSal.intent,
      isFinal: true,
    },
    words: words,
    entities: entities,
  };
};

export type SpeechSegmentCallback = (s: Segment) => void;

export const startDemo = (demoStrings: string[], onSegmentCallback?: SpeechSegmentCallback) => {
  let utterancePlayhead = 0;
  let tokenizedSal = undefined;
  let playhead = 0;

  if (onSegmentCallback === undefined) {
    onSegmentCallback = (segment) => {
      window.postMessage({ type: MessageType.speechsegment, segment: segment }, "*");
    }
  }

  const getNextDemoString = () => {
    contextId = "demo-utterance-" + Math.random();
    let t = tokenizeSal(demoStrings[utterancePlayhead]);
    utterancePlayhead = (utterancePlayhead + 1) % demoStrings.length;
    return t;
  };

  const animateTranscript = () => {
    if (tokenizedSal === undefined) {
      tokenizedSal = getNextDemoString();
      playhead = 0;
    }

    if (playhead < tokenizedSal.tokens.length) {
      let mockSegment = generateSegment(contextId, tokenizedSal, playhead + 1);
      mockSegment.isFinal = false;
      onSegmentCallback(mockSegment);
      const waitMs = tokenizedSal.tokens[playhead].word.length * 80;
      timeout = window.setTimeout(animateTranscript, waitMs);
    } else {
      let mockSegment = generateSegment(contextId, tokenizedSal);
      mockSegment.isFinal = true;
      onSegmentCallback(mockSegment);
      tokenizedSal = undefined;
      timeout = window.setTimeout(animateTranscript, 6000);
    }

    playhead++;
  };

  animateTranscript();
};

export const stopDemo = () => {
  if (timeout) {
    window.clearTimeout(timeout);
    timeout = undefined;
  }
};
