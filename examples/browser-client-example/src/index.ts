import {
  Client,
  ClientState,
  stateToString,
  Word,
  Entity,
  Intent,
  ClientOptions,
  Segment,
} from "@speechly/browser-client";

let clientState = ClientState.Disconnected;

window.onload = () => {
  let client: Client;

  try {
    client = newClient();
  } catch (e) {
    updateStatus(e.message);
    return;
  }

  // High-level API, that you can use to react to segment changes.
  client.onSegmentChange((segment: Segment) => {
    updateWords(segment.words);
    updateEntities(segment.entities);
    updateIntent(segment.intent);

    if (segment.isFinal) {
      updateReady(segment.contextId, true);
    }

    const cleanedWords = segment.words.filter((w: Word) => w.value).map(
      (w: Word) => ({value:w.value, index:w.index})
    )

    logResponse(
      segment.contextId,
      segment.id,
      segment.isFinal,
      cleanedWords,
      segment.intent,
      segment.entities)
  });

  bindStartStop(client);
  bindInitialize(client);
};

function newClient(): Client {
  const appId = process.env.REACT_APP_APP_ID;
  if (appId === undefined) {
    throw Error("Missing Speechly app ID!");
  }

  const language = process.env.REACT_APP_LANGUAGE;
  if (language === undefined) {
    throw Error("Missing Speechly app language!");
  }

  const opts: ClientOptions = {
    appId,
    language,
    debug: process.env.REACT_APP_DEBUG === "true",
    // Enabling logSegments logs the updates to segment (transcript, intent and entities) to console.
    // Consider turning it off in the production as it has extra JSON.stringify operation.
    logSegments: true
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
  entities: any,
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

function bindStartStop(client: Client) {
  const startRecording = async (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    try {
      const contextId = await client.startContext();
      resetState(contextId);
    } catch (err) {
      console.error("Could not start recording", err);
    }
  };

  const stopRecording = async (event: MouseEvent | TouchEvent) => {
    event.preventDefault();

    try {
      await client.stopContext();
    } catch (err) {
      console.error("Could not stop recording", err);
    }
  };

  const recordDiv = document.getElementById("record") as HTMLElement;
  recordDiv.addEventListener("mousedown", startRecording);
  recordDiv.addEventListener("touchstart", startRecording);
  recordDiv.addEventListener("mouseup", stopRecording);
  recordDiv.addEventListener("touchend", stopRecording);

  const initDiv = document.getElementById("initialize") as HTMLElement;
  client.onStateChange((state: ClientState) => {
    clientState = state;

    if (state !== ClientState.Connected && state !== ClientState.Disconnected) {
      initDiv.setAttribute("disabled", "disabled");
    } else {
      initDiv.removeAttribute("disabled");
    }

    if (state < ClientState.Connected || state === ClientState.Stopping) {
      recordDiv.setAttribute("disabled", "disabled");
    } else {
      recordDiv.removeAttribute("disabled");
    }

    const statusDiv = document.getElementById("status") as HTMLElement;
    statusDiv.innerHTML = stateToString(state);
  });
}

function bindInitialize(client: Client) {
  const initialize = async (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const button = event.target as HTMLElement;

    try {
      if (clientState === ClientState.Disconnected) {
        await client.initialize();
        button.innerHTML = "Disconnect";
      } else if (clientState === ClientState.Connected) {
        await client.close();
        button.innerHTML = "Connect";
      }
    } catch (err) {
      console.error("Error initializing Speechly client:", err);
    }

    return;
  };

  const initDiv = document.getElementById("initialize") as HTMLElement;
  initDiv.addEventListener("mousedown", initialize);
  initDiv.addEventListener("touchstart", initialize);
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
