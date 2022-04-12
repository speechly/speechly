import {
  stateToString,
  Word,
  Entity,
  Intent,
  Client,
  ClientState,
  ClientOptions,
  Segment,
  AudioUploader,
  BrowserMicrophone,
} from "@speechly/browser-client";

window.onload = () => {
  let mic: BrowserMicrophone;
  let uploader: AudioUploader;
  let client: Client;

  try {
    client = newClient();
  } catch (e) {
    // @ts-ignore
    updateStatus(e.message);
    return;
  }
  mic = new BrowserMicrophone({client})
  uploader = new AudioUploader({client})

  // High-level API, that you can use to react to segment changes.
  let handler = function (segment: Segment) {
    updateWords(segment.words);
    updateEntities(segment.entities);
    updateIntent(segment.intent);

    if (segment.isFinal) {
      updateReady(segment.contextId, true);
    }

    const cleanedWords = segment.words
      .filter((w: Word) => w.value)
      .map((w: Word) => ({ value: w.value, index: w.index }));

    logResponse(
      segment.contextId,
      segment.id,
      segment.isFinal,
      cleanedWords,
      segment.intent,
      segment.entities
    );
  };

  mic.onSegmentChange(handler);
  uploader.onSegmentChange(handler);

  uploader.onStateChange((state: ClientState) => {
    const connectButton = document.getElementById("connect") as HTMLButtonElement;
    const statusDiv = document.getElementById("status") as HTMLButtonElement;
    connectButton.innerHTML =
      state === ClientState.Disconnected ? "Connect" : "Disconnect";
    statusDiv.innerHTML = stateToString(state);
  });

  bindConnectButton(client);
  bindInitializeButton(uploader, mic);
  bindListenButton(mic);
  bindUploadButton();
  bindFileSelector(uploader);
  bindCloseButton(uploader, mic);
};

function newClient(): Client {
  const appId = "d9abea67-18e5-4c4e-b7fc-51f66d3219e2";
    // process.env.REACT_APP_APP_ID || "be3bfb17-ee36-4050-8830-743aa85065ab";
  if (appId === undefined) {
    throw Error("Missing Speechly app ID!");
  }

  const opts: ClientOptions = {
    appId,
    apiUrl: 'wss://staging.speechly.com/ws/v1',
    loginUrl: 'https://staging.speechly.com/login',
    debug: true, // process.env.REACT_APP_DEBUG === "true",
    // Enabling logSegments logs the updates to segment (transcript, intent and entities) to console.
    // Consider turning it off in the production as it has extra JSON.stringify operation.
    logSegments: false,
    connect: false,
  };

  if (process.env.REACT_APP_LOGIN_URL !== undefined) {
    opts.loginUrl = process.env.REACT_APP_LOGIN_URL;
  }

  if (process.env.REACT_APP_API_URL !== undefined) {
    opts.apiUrl = process.env.REACT_APP_API_URL;
  }

  return new Client(opts);
}

function updateWords(words: Word[]) {
  const transcriptDiv = document.getElementById(
    "transcript-words"
  ) as HTMLElement;

  transcriptDiv.innerHTML = words
    .map((word) => (word.isFinal ? `<b>${word.value}</b>` : word.value))
    .join(" ");

  const wordsDiv = document.getElementById("transcript-list") as HTMLElement;
  wordsDiv.innerHTML = words
    .map((word) =>
      word.isFinal
        ? `<li><b>${word.value} [${word.index}]</b></li>`
        : `<li>${word.value} [${word.index}]</li>`
    )
    .join("");
}

function updateEntities(entities: Entity[]) {
  const entitiesDiv = document.getElementById("entities-list") as HTMLElement;

  entitiesDiv.innerHTML = entities
    .map((entity) => {
      const t = `${entity.type} - ${entity.value} [${entity.startPosition} - ${entity.endPosition})`;
      if (entity.isFinal) {
        return `<li><b>${t}</b></li>`;
      }
      return `<li>${t}</li>`;
    })
    .join("");
}

function updateIntent(intent: Intent) {
  const intentDiv = document.getElementById("intent-value") as HTMLElement;

  intentDiv.innerHTML = intent.isFinal
    ? `<b>${intent.intent}</b>`
    : intent.intent;
}

function updateReady(contextId: string, isReady: boolean) {
  const readyDiv = document.getElementById("final") as HTMLElement;

  if (isReady) {
    readyDiv.innerHTML = `<b>Context</b> ${contextId} Done!`;
  } else {
    readyDiv.innerHTML = `<b>Context</b> ${contextId}`;
  }
}

function logResponse(
  contextId: string,
  segmentId: number,
  isFinal: boolean,
  words: any,
  intents: any,
  entities: any
) {
  const logDiv = document.getElementById("log-list") as HTMLElement;

  logDiv.innerHTML =
    `<tr>
      <td>${contextId}</td>
      <td>${segmentId}</td>
      <td>${isFinal}</td>
      <td>${JSON.stringify(words)}</td>
      <td>${JSON.stringify(intents)}</td>
      <td>${JSON.stringify(entities)}</td>
    </tr>` + logDiv.innerHTML;
}

function updateStatus(status: string): void {
  const statusDiv = document.getElementById("status");
  if (statusDiv === null) {
    return;
  }

  statusDiv.innerHTML = status;
}

function bindListenButton(mic: BrowserMicrophone) {
  const startRecording = async (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    try {
      const contextId = await mic.startRecording();
      console.log("Started", contextId);
      resetState(contextId);
    } catch (err) {
      console.error("Could not start recording", err);
    }
  };

  const stopRecording = async (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    try {
      const contextId = await mic.stopRecording();
      console.log("Stopped", contextId);
    } catch (err) {
      console.error("Could not stop recording", err);
    }
  };

  const recordDiv = document.getElementById("record") as HTMLElement;
  recordDiv.addEventListener("mousedown", startRecording);
  recordDiv.addEventListener("touchstart", startRecording);
  recordDiv.addEventListener("mouseup", stopRecording);
  recordDiv.addEventListener("touchend", stopRecording);
}

function bindConnectButton(client: Client) {
  const connect = async (event: MouseEvent | TouchEvent) => {
    if (client.state === ClientState.Disconnected) {
      try {
        await client.connect();
      } catch (err) {
        console.error("Error connecting Speechly:", err);
      }
    } else {
      await client.close();
    }
  };
  const connectButton = document.getElementById("connect") as HTMLElement;
  connectButton.addEventListener("click", connect);
}

function bindInitializeButton(uploader: AudioUploader, mic: BrowserMicrophone) {
  const initialize = async (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    try {
      await uploader.initialize();
      await mic.initialize();
    } catch (err) {
      console.error("Error initializing Speechly client:", err);
    }
  };

  const initButton = document.getElementById("initialize") as HTMLElement;
  initButton.addEventListener("click", initialize);
}

function bindCloseButton(uploader: AudioUploader, mic: BrowserMicrophone) {
  const close = async (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    try {
      await uploader.close();
      await mic.close();
    } catch (err) {
      console.error("Error closing Speechly clients:", err);
    }
  };

  const closeButton = document.getElementById("close") as HTMLElement;
  closeButton.addEventListener("click", close);
}

function bindUploadButton() {
    const openFileInput = async (event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        const fileElem = document.getElementById("fileElem");
        fileElem?.click();
    }
    const uploadButton = document.getElementById("upload") as HTMLElement;
    uploadButton.addEventListener("click", openFileInput);
}

function bindFileSelector(uploader: AudioUploader) {
    const transcribe = async (event: Event) => {
        const f: FileList | null = (event.target as HTMLInputElement).files;
        if (f === null) {
            return
        }
        console.log('selected file = ', f[0]);
        try {
          uploader.sendAudioData(await f[0].arrayBuffer());
        } catch (err) {
            console.error("Error when transcribing file:", err);
        }
    }
    const fileElem = document.getElementById("fileElem");
    fileElem?.addEventListener("change", transcribe, false);
}

function resetState(contextId: string) {
  updateReady(contextId, false);

  const transcript = document.getElementById("transcript-words") as HTMLElement;
  transcript.innerHTML = "";

  const transcriptList = document.getElementById(
    "transcript-list"
  ) as HTMLElement;
  transcriptList.innerHTML = "";

  const logList = document.getElementById("log-list") as HTMLElement;
  logList.innerHTML = "";

  const entitiesList = document.getElementById("entities-list") as HTMLElement;
  entitiesList.innerHTML = "";
}
