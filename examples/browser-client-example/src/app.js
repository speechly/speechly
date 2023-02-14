import { BrowserClient, BrowserMicrophone, stateToString } from '@speechly/browser-client';
import formatDuration from 'format-duration';

let isVadEnabled = false;

const microphone = new BrowserMicrophone();
const client = new BrowserClient({
  appId: 'YOUR-APP-ID',
  logSegments: true,
  debug: true,
  vad: { enabled: isVadEnabled },
});

const vadBtn = document.getElementById('vad');
const micBtn = document.getElementById('mic');
const clearBtn = document.getElementById('clear');
const fileInput = document.getElementById('file');
const transcript = document.getElementById('transcript');
const tentative = document.getElementById('tentative');
const debugOut = document.getElementById('debug');
const clientState = document.getElementById('clientState');
const micState = document.getElementById('micState');

const initMic = async () => {
  if (!microphone.mediaStream) {
    await microphone.initialize();
    if (microphone.mediaStream) {
      await client.attach(microphone.mediaStream);
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

const renderTranscript = (segment) => {
  return segment.words.map((w) => w.value).join(' ');
};

const renderSegmentDetails = (intent, entities) => {
  if (!intent.intent) return '';
  const entitiesList = entities.map((e) => `${e.value} (${e.type})`).join(', ');
  return `<div class="segment-details">
    intent: ${intent.intent}
    ${entitiesList ? ` · entities: ${entitiesList}` : ''}
  </div>`;
};

const renderSegment = (segment) => {
  const timestamp = formatDuration(segment.words[segment.words.length - 1].endTimestamp);
  return `<div class="segment">
    <div>${timestamp}</div>
    <div class="segment-content">
      <div>${renderTranscript(segment)}</div>
      ${renderSegmentDetails(segment.intent, segment.entities)}
    </div>
  </div>`;
};

const renderOutput = (segment) => {
  return `<code>${JSON.stringify(segment, undefined, 2)}</code>`;
};

microphone.onStateChange((state) => {
  micState.innerText = state;
});

client.onStateChange((state) => {
  clientState.innerHTML = stateToString(state);
});

client.onSegmentChange((segment) => {
  clearBtn.disabled = false;
  tentative.innerText = renderTranscript(segment);
  if (segment.isFinal) {
    debugOut.innerHTML += renderOutput(segment);
    transcript.innerHTML += renderSegment(segment);
    tentative.innerText = '';
  }
});

micBtn.addEventListener('click', handleMicPress);
vadBtn.addEventListener('click', handleVadPress);
clearBtn.addEventListener('click', handleClearPress);
fileInput.addEventListener('change', handleFileSelect);
