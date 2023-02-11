import { BrowserClient, BrowserMicrophone, Segment, stateToString } from '@speechly/browser-client';
import formatDuration from 'format-duration';

let isVadEnabled = false;
let speechSegments: Segment[] = [];

const mic = new BrowserMicrophone();
const client = new BrowserClient({
  appId: 'YOUR-APP-ID',
  logSegments: true,
  debug: true,
  vad: { enabled: isVadEnabled },
});

const vadBtn = document.getElementById('vad') as HTMLButtonElement;
const micBtn = document.getElementById('mic') as HTMLButtonElement;
const clearBtn = document.getElementById('clear') as HTMLButtonElement;
const fileInput = document.getElementById('file') as HTMLInputElement;
const transcript = document.getElementById('transcript') as HTMLDivElement;
const tentative = document.getElementById('tentative') as HTMLDivElement;
const debugOut = document.getElementById('debug') as HTMLPreElement;
const clientState = document.getElementById('clientState') as HTMLSpanElement;
const micState = document.getElementById('micState') as HTMLSpanElement;

const initMic = async () => {
  if (!mic.mediaStream) {
    await mic.initialize();
    if (mic.mediaStream) {
      await client.attach(mic.mediaStream);
    }
  }
};

const handleMicPress = async () => {
  if (client.isActive()) {
    await client.stop();
    micBtn.innerText = 'Start microphone';
  } else {
    await initMic();
    await client.start();
    micBtn.innerText = 'Stop microphone';
  }
};

const handleVadPress = async () => {
  await initMic();
  await client.adjustAudioProcessor({ vad: { enabled: !isVadEnabled } });
  vadBtn.innerText = !isVadEnabled ? 'Disable VAD' : 'Enable VAD';
  isVadEnabled = !isVadEnabled;
};

const handleFileSelect = async () => {
  const arrayBuffer = fileInput.files && (await fileInput.files[0].arrayBuffer());
  if (arrayBuffer) {
    await client.uploadAudioData(arrayBuffer);
  }
};

const handleClearPress = () => {
  transcript.innerHTML = '';
  debugOut.innerHTML = '';
  fileInput.value = '';
  clearBtn.disabled = true;
};

const renderTranscript = (segment: Segment) => {
  return segment.words.map((w) => w.value).join(' ');
};

const renderSegmentDetails = (segment: Segment) => {
  if (!segment.intent.intent) return '';
  return `<div class="segment-details">
    intent: ${segment.intent.intent}
    ${segment.entities.length ? ` · entities: ${segment.entities.map((e) => `${e.value} (${e.type})`)}` : ''}
  </div>`;
};

const renderSegment = (segment: Segment) => {
  const timestamp = formatDuration(segment.words[segment.words.length - 1].endTimestamp);
  return `<div class="segment">
    <div>${timestamp}</div>
    <div class="segment-content">
      <div>${renderTranscript(segment)}</div>
      ${renderSegmentDetails(segment)}
    </div>
  </div>`;
};

const renderOutput = (segment: Segment) => {
  return `<code>${JSON.stringify(segment, undefined, 2)}</code>`;
};

mic.onStateChange((state) => {
  micState.innerText = state.toLowerCase();
});

client.onStateChange((state) => {
  clientState.innerHTML = stateToString(state).toLowerCase();
  tentative.innerText = state > 2 ? '…' : '';
});

client.onSegmentChange((segment) => {
  clearBtn.disabled = false;
  tentative.innerText = renderTranscript(segment);
  if (segment.isFinal) {
    debugOut.innerHTML += renderOutput(segment);
    if (speechSegments.length && segment.contextId !== speechSegments[speechSegments.length - 1].contextId) {
      transcript.innerHTML += `<hr/>`;
    }
    transcript.innerHTML += renderSegment(segment);
    tentative.innerText = '…';
    speechSegments.push(segment);
  }
});

micBtn.addEventListener('click', handleMicPress);
vadBtn.addEventListener('click', handleVadPress);
clearBtn.addEventListener('click', handleClearPress);
fileInput.addEventListener('change', handleFileSelect);
