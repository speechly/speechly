import React, { useCallback, useEffect, useState } from "react";
import { AudioSourceState, DecoderState, SpeechSegment, useSpeechContext } from "@speechly/react-client";
import { IntroPopup } from "@speechly/react-ui";
import formatDuration from "format-duration";
import clsx from "clsx";
import { ReactComponent as Spinner } from "./assets/3-dots-fade-black-36.svg";
import { ReactComponent as Check } from "./assets/check.svg";
import { ReactComponent as Arrow } from "./assets/arrow.svg";
import { ReactComponent as Close } from "./assets/close.svg";
import { ReactComponent as Mic } from "./assets/mic.svg";
import { ReactComponent as AudioFile } from "./assets/audio-file.svg";
import { ReactComponent as Empty } from "./assets/empty.svg";
import "./App.css";
import { FileInput } from "./FileInput";

interface Classification {
  labels: string[];
  scores: number[];
}

interface ClassifiedSpeechSegment extends SpeechSegment {
  classification?: Classification;
}

function App() {
  const { segment, clientState, microphoneState, listening, attachMicrophone, start, stop } = useSpeechContext();
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [speechSegments, setSpeechSegments] = useState<ClassifiedSpeechSegment[]>([]);
  const [tags, setTags] = useState(["neutral", "happy", "sad", "cheerful", "disgusted"]);
  const [tag, setTag] = useState("");

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
          <h4 className="Sidebar__title">Sample audios</h4>
          <button type="button" className="Sidebar__item">
            <AudioFile width={18} height={18} />
            filename goes here
          </button>
          <button type="button" className="Sidebar__item">
            <AudioFile width={18} height={18} />
            filename goes here
          </button>
          <button type="button" className="Sidebar__item">
            <AudioFile width={18} height={18} />
            filename goes here
          </button>
          <button type="button" className="Sidebar__item">
            <AudioFile width={18} height={18} />
            filename goes here
          </button>
          <h4 className="Sidebar__title">Custom audio</h4>
          <FileInput
            acceptMimes={"audio"}
            onFileSelected={function (file: File): void {
              throw new Error("Function not implemented.");
            }}
          />
          {clientState >= DecoderState.Connected && microphoneState === AudioSourceState.Started ? (
            <button type="button" className="Sidebar__mic" onPointerDown={start} onPointerUp={stop}>
              <Mic /> {listening ? "Listening…" : "Hold to talk"}
            </button>
          ) : (
            <button type="button" className="Sidebar__mic" onClick={attachMicrophone}>
              <Mic /> Use microphone
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
              className={clsx("Segment", selectedId === i && "Segment--selected")}
              key={`${contextId}-${id}`}
              onClick={() => setSelectedId(i)}
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
        <div className={clsx("Details", selectedId !== undefined && "Details--open")}>
          <div className="Details__header">
            Speech segment details
            <button type="button" className="Details__close" onClick={() => setSelectedId(undefined)}>
              <Close />
            </button>
          </div>
          {selectedId !== undefined && (
            <>
              <h4 className="Details__title">Basics</h4>
              <div className="Details__content">
                <div>language: en-US</div>
                <div>words: {speechSegments[selectedId].words.length}</div>
                <div>
                  duration:{" "}
                  {formatDuration(
                    speechSegments[selectedId].words[speechSegments[selectedId].words.length - 1]?.endTimestamp
                  )}
                </div>
              </div>
              <h4 className="Details__title">Classifications</h4>
              <div className="Details__content">
                {speechSegments[selectedId].classification?.labels.map((label, i) => (
                  <div key={i}>
                    {label}: {((speechSegments[selectedId].classification?.scores[i] || 0) * 100).toFixed(2)}%
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
