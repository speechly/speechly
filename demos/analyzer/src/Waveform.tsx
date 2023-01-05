import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions';
import { CHUNK_MS, Classification } from './App';
import { ReactComponent as Play } from './assets/play.svg';
import { ReactComponent as Pause } from './assets/pause.svg';
import { ReactComponent as VolumeUp } from './assets/volume.svg';
import './Waveform.css';

interface Props {
  url?: string;
  peaks?: number[];
  data?: Classification[][];
  children?: React.ReactNode;
}

const formWaveSurferOptions = (ref: any) => ({
  container: ref,
  waveColor: '#7d8fa1',
  progressColor: '#009efa',
  cursorColor: 'red',
  height: 100,
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  normalize: true,
  partialRender: true,
  plugins: [RegionsPlugin.create({ dragSelection: false, snapToGridInterval: 1 })],
});

export const Waveform: React.FC<Props> = ({ url, peaks, data, children }) => {
  const waveformRef: { current: HTMLDivElement | null } = useRef(null);
  const wavesurfer: { current: WaveSurfer | null } = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [selectedData, setSelectedData] = useState<Classification[]>();

  useEffect(() => {
    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    if (!url) {
      if (peaks?.length) {
        wavesurfer.current.load('foo', peaks, undefined, peaks.length / 128);
      }
    } else {
      wavesurfer.current.load(url);
    }

    wavesurfer.current.on('ready', () => {
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        if (!peaks?.length) {
          wavesurfer.current.play();
        }
      }
    });

    wavesurfer.current.on('play', () => setIsPlaying(true));
    wavesurfer.current.on('pause', () => setIsPlaying(false));
    wavesurfer.current.on('volume', (e) => setVolume(e));

    const unassign = (data: any) => Object.values(data) as Classification[];

    wavesurfer.current?.on('region-in', (e) => {
      const arr = unassign(e.data);
      setSelectedData(arr);
    });

    wavesurfer.current?.on('region-click', (e) => {
      const arr = unassign(e.data);
      setSelectedData(arr);
      if (!wavesurfer.current?.isPlaying()) {
        wavesurfer.current?.play();
      }
    });

    wavesurfer.current?.on('region-mouseenter', (e) => {
      if (wavesurfer.current?.isPlaying()) return;
      const arr = unassign(e.data);
      setSelectedData(arr);
    });

    return () => wavesurfer.current?.destroy();

    // eslint-disable-next-line
  }, [url, peaks]);

  useEffect(() => {
    if (wavesurfer.current && data?.length) {
      wavesurfer.current.regions.clear();
      data.forEach((d, i) => {
        const chunkSec = CHUNK_MS / 1000;
        const t = i * chunkSec;
        const obj = Object.assign({}, d);
        const region = { start: t, end: t + chunkSec, data: { ...obj }, drag: false };
        wavesurfer.current?.regions.add(region);
      });
    }
  }, [url, data]);

  const handlePlayPause = () => {
    wavesurfer.current?.playPause();
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const newVolume = +target.value;
    if (newVolume) {
      wavesurfer.current?.setVolume(newVolume || 1);
    }
  };

  return (
    <div className="Waveform">
      <div className="Waveform__data">
        {selectedData && (
          <>
            <span>Audio classification:</span>
            {selectedData.map(({ label, score }, i) => (
              <span key={`${label}-${i}`}>
                {label}: {(score * 100).toFixed(2)}%
              </span>
            ))}
          </>
        )}
      </div>
      <div className="Waveform__inner" id="waveform" ref={waveformRef} />
      <div className="Waveform__controls">
        {children}
        <button onClick={handlePlayPause} className="Waveform__playPause" disabled={!url}>
          {isPlaying ? <Pause width={28} height={28} /> : <Play width={28} height={28} />}
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
