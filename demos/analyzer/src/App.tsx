import React, { useCallback, useEffect, useRef, useState } from "react";
import { AudioSourceState, DecoderState, SpeechSegment, useSpeechContext } from "@speechly/react-client";
import { IntroPopup } from "@speechly/react-ui";
import formatDuration from "format-duration";
import clsx from "clsx";
import { FileInput } from "./FileInput";
import { ReactComponent as Spinner } from "./assets/3-dots-fade-black-36.svg";
import { ReactComponent as Check } from "./assets/check.svg";
import { ReactComponent as Arrow } from "./assets/arrow.svg";
import { ReactComponent as Close } from "./assets/close.svg";
import { ReactComponent as Mic } from "./assets/mic.svg";
import { ReactComponent as MicOff } from "./assets/mic-off.svg";
import { ReactComponent as AudioFile } from "./assets/audio-file.svg";
import { ReactComponent as Empty } from "./assets/empty.svg";
import podcast1 from "./assets/podcast1.wav";
import "./App.css";

interface Classification {
  labels: string[];
  scores: number[];
}

interface ClassifiedSpeechSegment extends SpeechSegment {
  classification?: Classification;
}

interface FileOrUrl {
  name: string;
  file?: File;
  src?: string;
}

function App() {
  const { client, segment, clientState, microphoneState, listening, attachMicrophone, start, stop } =
    useSpeechContext();
  const [speechSegments, setSpeechSegments] = useState<ClassifiedSpeechSegment[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<number | undefined>();
  const [selectedFileId, setSelectedFileId] = useState<number | undefined>();
  const [tags, setTags] = useState(["neutral", "happy", "sad", "cheerful", "disgusted"]);
  const [tag, setTag] = useState("");
  const [files, setFiles] = useState<FileOrUrl[]>([{ name: "podcast 1", src: podcast1 }]);
  const [counter, setCounter] = useState(0);
  const intervalRef: { current: NodeJS.Timeout | null } = useRef(null);

  useEffect(() => {
    return () => stopCounter();
  }, []);

  const getClassification = async (text: string, labels: string[] = tags): Promise<Classification | undefined> => {
    try {
      const response = await fetch("http://127.0.0.1:8000/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          labels,
        }),
      });
      if (response.status !== 200) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const parsed = (await response.json()) as Classification;
      return parsed;
    } catch (error) {
      let message = "Unknown error";
      if (error instanceof Error) message = error.message;
      console.error("Error:", message);
    }
  };

  const classifyAndUpdateSegment = useCallback(
    async (ss: SpeechSegment) => {
      const text = ss.words.map((word) => word.value).join(" ");
      const classification = await getClassification(text);
      const newArray = [...speechSegments];
      const idx = newArray.findIndex((item) => item.contextId === ss.contextId && item.id === ss.id);
      if (idx === -1) return;
      newArray[idx] = { ...ss, classification };
      setSpeechSegments(newArray);
    },
    [speechSegments]
  );

  const updateOrAddSegment = useCallback(
    (ss: SpeechSegment) => {
      const idx = speechSegments.findIndex((item) => item.contextId === ss.contextId && item.id === ss.id);
      if (idx > -1) {
        const newArray = [...speechSegments];
        newArray[idx] = ss;
        setSpeechSegments(newArray);
      } else {
        setSpeechSegments([ss, ...speechSegments]);
      }
    },
    [speechSegments]
  );

  useEffect(() => {
    if (segment) {
      updateOrAddSegment(segment);
      if (segment.isFinal) {
        classifyAndUpdateSegment(segment);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]);

  const handleRemoveTag = (tag: string) => {
    setTags((current) => current.filter((t) => t !== tag));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag) return;
    setTags((current) => [...current, tag.trim()]);
    setTag("");
  };

  const handleFileAdd = async (file: File) => {
    setFiles((current) => [...current, { name: file.name, file }]);
  };

  const handleSelectFile = async (i: number) => {
    if (selectedFileId === i) return;
    setSelectedFileId(i);

    const fileSrc = files[i].src;
    if (fileSrc) {
      const response = await fetch(fileSrc, {
        headers: {
          "Content-Type": "audio/mpeg;audio/x-wav;audio/m4a",
          Accept: "audio/mpeg;audio/x-wav;audio/m4a",
        },
        cache: "no-store",
      });
      if (!response.ok) {
        console.error("Could't find file");
      }
      const buffer = await response.arrayBuffer();
      await client?.uploadAudioData(buffer);
      return;
    }

    const fileFile = files[i].file;
    if (fileFile) {
      const buffer = await fileFile.arrayBuffer();
      await client?.uploadAudioData(buffer);
      return;
    }
  };

  const startCounter = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 10);
  };

  const stopCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setCounter(0);
      intervalRef.current = null;
    }
  };

  const handleDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (listening) {
      stopCounter();
      stop();
    } else {
      startCounter();
      start();
    }
  };

  const handleUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (listening && counter > 100) {
      stopCounter();
      stop();
    }
  };

  return (
    <>
      <div className="App">
        <div className="Sidebar">
          <h4 className="Sidebar__title">Classifications</h4>
          <div className="Tag__container">
            {tags.map((tag, i) => (
              <div className="Tag" key={`${tag}-${i}`}>
                {tag}
                <Close width={16} height={16} onClick={() => handleRemoveTag(tag)} />
              </div>
            ))}
            <form className="Tag__form" onSubmit={handleAddTag}>
              <input type="text" placeholder="Add a label" value={tag} onChange={(e) => setTag(e.target.value)} />
              <button type="submit" disabled={tag === ""}>
                Add
              </button>
            </form>
          </div>
          <h4 className="Sidebar__title">Audio files</h4>
          {files.map(({ name }, i) => (
            <button
              type="button"
              className={clsx("Sidebar__item", selectedFileId === i && "Sidebar__item--selected")}
              key={name}
              onClick={() => handleSelectFile(i)}
            >
              <AudioFile width={18} height={18} />
              {name}
            </button>
          ))}
          <FileInput acceptMimes={"audio/x-wav, audio/mpeg"} onFileSelected={handleFileAdd} />
          {clientState >= DecoderState.Connected && microphoneState === AudioSourceState.Started ? (
            <button
              type="button"
              className={clsx("Sidebar__mic", listening && "Sidebar__mic--active")}
              onPointerDown={handleDown}
              onPointerUp={handleUp}
            >
              <Mic width={24} height={24} />
            </button>
          ) : (
            <button type="button" className="Sidebar__mic" onClick={attachMicrophone}>
              {microphoneState === AudioSourceState.NoAudioConsent ||
              microphoneState === AudioSourceState.NoBrowserSupport ? (
                <MicOff />
              ) : (
                <Mic />
              )}
              Use microphone
            </button>
          )}
        </div>
        <div className="Main">
          {!speechSegments.length && (
            <div className="EmptyState">
              <Empty />
              <h2 className="EmptyState__title">Select an audio file to get started</h2>
              <p className="EmptyState__description">
                Use one of our sample audios, upload your own files or use the device microphone.
              </p>
            </div>
          )}
          {speechSegments?.map(({ contextId, id, words, classification, isFinal }, i) => (
            <div
              className={clsx("Segment", selectedSegmentId === i && "Segment--selected")}
              key={`${contextId}-${id}`}
              onClick={() => setSelectedSegmentId(i)}
            >
              <div className="Transcript">
                {words.map((word) => (
                  <span key={word.index}>{word.value} </span>
                ))}
              </div>
              {isFinal && !classification && <Spinner width={20} height={16} fill="#7d8fa1" />}
              {isFinal && classification && <Check fill="#11A16C" />}
              <Arrow fill="#7d8fa1" />
            </div>
          ))}
        </div>
        <div className={clsx("Details", selectedSegmentId !== undefined && "Details--open")}>
          <div className="Details__header">
            Speech segment details
            <button type="button" className="Details__close" onClick={() => setSelectedSegmentId(undefined)}>
              <Close />
            </button>
          </div>
          {selectedSegmentId !== undefined && (
            <>
              <h4 className="Details__title">Basics</h4>
              <div className="Details__content">
                <div>language: en-US</div>
                <div>words: {speechSegments[selectedSegmentId].words.length}</div>
                <div>
                  duration:{" "}
                  {formatDuration(
                    speechSegments[selectedSegmentId].words[speechSegments[selectedSegmentId].words.length - 1]
                      ?.endTimestamp
                  )}
                </div>
              </div>
              <h4 className="Details__title">Classifications</h4>
              <div className="Details__content">
                {speechSegments[selectedSegmentId].classification?.labels.map((label, i) => (
                  <div key={i}>
                    {label}: {((speechSegments[selectedSegmentId].classification?.scores[i] || 0) * 100).toFixed(2)}%
                  </div>
                ))}
              </div>
              <h4 className="Details__title">Acoustic info</h4>
              <div className="Details__content">
                <div>mm:ss, property: xx%</div>
                <div>mm:ss, property: xx%</div>
                <div>mm:ss, property: xx%</div>
                <div>mm:ss, property: xx%</div>
                <div>mm:ss, property: xx%</div>
              </div>
            </>
          )}
        </div>
      </div>
      <IntroPopup />
    </>
  );
}

export default App;
