import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { ReactComponent as Play } from './assets/play.svg';
import { ReactComponent as Pause } from './assets/pause.svg';
import { ReactComponent as VolumeUp } from './assets/volume.svg';
import './Waveform.css';

interface Props {
  url?: string;
  children?: React.ReactNode;
  onSeek?: (start: number) => void;
}

const formWaveSurferOptions = (containerRef: any) => ({
  container: containerRef,
  waveColor: '#7d8fa1',
  progressColor: '#009efa',
  cursorColor: 'red',
  responsive: true,
  normalize: true,
  partialRender: true,
  height: 40,
  barWidth: 2,
  barGap: 2,
});

export const Waveform: React.FC<Props> = ({ url, children, onSeek }) => {
  const waveformRef: { current: HTMLDivElement | null } = useRef(null);
  const wavesurfer: { current: WaveSurfer | null } = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    if (url) wavesurfer.current.load(url);

    wavesurfer.current.on('ready', () => {
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
      }
    });
    wavesurfer.current.on('play', () => setIsPlaying(true));
    wavesurfer.current.on('pause', () => setIsPlaying(false));
    wavesurfer.current.on('volume', (e) => setVolume(e));

    wavesurfer.current.on('seek', (e) => {
      const ct = wavesurfer.current?.getCurrentTime();
      if (!ct) return;
      onSeek && onSeek(Math.ceil(ct));
    });

    return () => wavesurfer.current?.destroy();

    // eslint-disable-next-line
  }, [url]);

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
      {children}
      <button onClick={handlePlayPause} className="Waveform__playPause" disabled={!url}>
        {isPlaying ? <Pause width={28} height={28} /> : <Play width={28} height={28} />}
      </button>
      <div className="Waveform__waveform" id="waveform" ref={waveformRef} />
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
  );
};
