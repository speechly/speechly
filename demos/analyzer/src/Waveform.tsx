import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions';
import { CHUNK_MS, Classification } from './App';
import { ReactComponent as Spinner } from './assets/3-dots-fade-black-36.svg';
import { ReactComponent as Play } from './assets/play-circle.svg';
import { ReactComponent as Pause } from './assets/pause-circle.svg';
import { ReactComponent as VolumeUp } from './assets/volume.svg';
import './Waveform.css';

interface Props {
  url: string;
  data?: Classification[];
}

const formWaveSurferOptions = (ref: any) => ({
  container: ref,
  waveColor: '#7d8fa1',
  progressColor: '#009efa',
  cursorColor: 'red',
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  normalize: true,
  partialRender: true,
  plugins: [RegionsPlugin.create({ dragSelection: false, snapToGridInterval: 1 })],
});

export const Waveform: React.FC<Props> = ({ url, data }) => {
  const waveformRef: { current: HTMLDivElement | null } = useRef(null);
  const wavesurfer: { current: WaveSurfer | null } = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [selectedData, setSelectedData] = useState<Classification>();

  useEffect(() => {
    setPlay(false);
    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.load(url);

    wavesurfer.current.on('ready', () => {
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        wavesurfer.current.play();
        setVolume(volume);
      }
    });

    wavesurfer.current?.on('region-in', (e) => {
      setSelectedData(e.data);
    });

    wavesurfer.current?.on('region-mouseenter', (e) => {
      setSelectedData(e.data);
    });

    wavesurfer.current?.on('region-click', (e) => {
      setSelectedData(e.data);
    });

    return () => wavesurfer.current?.destroy();

    // eslint-disable-next-line
  }, [url]);

  useEffect(() => {
    if (wavesurfer.current && data?.length) {
      wavesurfer.current.regions.clear();
      data.forEach((r, i) => {
        const chunkSec = CHUNK_MS / 1000;
        const t = i * chunkSec;
        const region = { start: t, end: t + chunkSec, data: { label: r.label, score: r.score }, drag: false };
        wavesurfer.current?.regions.add(region);
      });
    }
  }, [data]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current?.playPause();
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current?.setVolume(newVolume || 1);
    }
  };

  return (
    <div className="Waveform">
      <div className="Waveform__data">
        <span>Audio classification:</span>
        {!selectedData && <Spinner width={16} height={16} fill="#7d8fa1" />}
        {selectedData && (
          <span>
            {selectedData.label}: {(selectedData.score * 100).toFixed(2)}%
          </span>
        )}
      </div>
      <div className="Waveform__inner" id="waveform" ref={waveformRef} />
      <div className="Waveform__controls">
        <button onClick={handlePlayPause} className="Waveform__pauseBtn">
          {playing ? <Play /> : <Pause />}
        </button>
        <div className="Waveform__volume">
          <VolumeUp />
          <input
            type="range"
            id="volume"
            name="volume"
            min="0.01"
            max="1"
            step=".025"
            onChange={onVolumeChange}
            defaultValue={volume}
          />
        </div>
      </div>
    </div>
  );
};
