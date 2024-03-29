import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import formatDuration from 'format-duration';
import { ReactComponent as Play } from '../assets/play.svg';
import { ReactComponent as Pause } from '../assets/pause.svg';
import { ReactComponent as VolumeUp } from '../assets/volume.svg';
import './Waveform.css';

interface Props {
  url?: string;
  children?: React.ReactNode;
  onSeek?: (time: number) => void;
  onUpdate?: (time: number) => void;
}

const formWaveSurferOptions = (containerRef: any) => ({
  container: containerRef,
  waveColor: '#7d8fa199',
  progressColor: '#0289e3',
  cursorColor: 'red',
  responsive: true,
  normalize: true,
  partialRender: true,
  height: 40,
  barMinHeight: 1,
  barWidth: 2,
  barGap: 2,
  barRadius: 2,
});

export const Waveform: React.FC<Props> = ({ url, children, onSeek, onUpdate }) => {
  const waveformRef: { current: HTMLDivElement | null } = useRef(null);
  const wavesurfer: { current: WaveSurfer | null } = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState<number>();
  const [duration, setDuration] = useState<number>();

  useEffect(() => {
    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    if (url) {
      wavesurfer.current.load(url);
    } else {
      setIsPlaying(false);
      setCurrentTime(undefined);
      setDuration(undefined);
    }

    wavesurfer.current.on('ready', () => {
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setCurrentTime(1);
        setDuration(wavesurfer.current.getDuration() * 1000);
      }
    });
    wavesurfer.current.on('play', () => setIsPlaying(true));
    wavesurfer.current.on('pause', () => setIsPlaying(false));
    wavesurfer.current.on('volume', (e) => setVolume(e));
    wavesurfer.current.on('audioprocess', (e) => {
      setCurrentTime(e * 1000);
      onUpdate && onUpdate(e * 1000);
    });
    wavesurfer.current.on('seek', (e) => {
      const ct = wavesurfer.current?.getCurrentTime();
      if (!ct) return;
      setCurrentTime(ct * 1000);
      onSeek && onSeek(ct * 1000);
      onUpdate && onUpdate(ct * 1000);
    });

    return () => wavesurfer.current?.destroy();

    // eslint-disable-next-line
  }, [url]);

  const handlePlayPause = () => {
    wavesurfer.current?.playPause();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    wavesurfer.current?.setVolume(e.target.valueAsNumber);
  };

  return (
    <div className="Waveform">
      {children}
      <button onClick={handlePlayPause} className="Waveform__playPause" disabled={!url}>
        {isPlaying ? <Pause width={28} height={28} /> : <Play width={28} height={28} />}
      </button>
      <div className="Waveform__time">{currentTime && formatDuration(currentTime)}</div>
      <div className="Waveform__waveform" id="waveform" ref={waveformRef} />
      <div className="Waveform__time">{duration && formatDuration(duration)}</div>
      <div className="Waveform__volume">
        <VolumeUp />
        <input
          type="range"
          name="volume"
          min="0"
          max="1"
          step="0.025"
          onChange={handleVolumeChange}
          defaultValue={volume}
        />
      </div>
    </div>
  );
};
