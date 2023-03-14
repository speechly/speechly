import React, { useEffect, useRef, useState } from 'react';
import { useSpeechContext } from '@speechly/react-client';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin, { Region } from 'wavesurfer.js/src/plugin/regions';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';
import { Tag } from './Tag';
import { AudioRegionLabels, Classification } from '../utils/types';
import { getParam } from '../utils/queryParams';
import { ReactComponent as Play } from '../assets/play.svg';
import { ReactComponent as Pause } from '../assets/pause.svg';
import { ReactComponent as VolumeUp } from '../assets/volume.svg';
import './Waveform.css';

interface Props {
  url?: string;
  peaks?: number[];
  regionData?: AudioRegionLabels[];
  children?: React.ReactNode;
  onRegionClick?: (time: number) => void;
  onUpdate?: (time: number) => void;
}

const formWaveSurferOptions = (containerRef: any, timelineRef: any) => ({
  container: containerRef,
  waveColor: '#7d8fa1',
  progressColor: '#009efa',
  cursorColor: 'red',
  height: 100,
  barWidth: 2,
  barRadius: 3,
  barGap: 2,
  responsive: true,
  normalize: true,
  partialRender: true,
  plugins: [
    RegionsPlugin.create({ snapToGridInterval: 1, dragSelection: false }),
    TimelinePlugin.create({
      container: timelineRef,
      height: 16,
      notchPercentHeight: 50,
      primaryColor: '#516170',
      secondaryColor: '#516170',
      primaryFontColor: '#516170',
      secondaryFontColor: '#516170',
    }),
  ],
});

export const Waveform: React.FC<Props> = ({ url, peaks, regionData, children, onRegionClick, onUpdate }) => {
  const { listening } = useSpeechContext();
  const waveformRef: { current: HTMLDivElement | null } = useRef(null);
  const timelineRef: { current: HTMLDivElement | null } = useRef(null);
  const wavesurfer: { current: WaveSurfer | null } = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [selectedData, setSelectedData] = useState<Classification[]>();
  const showTOV = !!JSON.parse(getParam('tov') || 'false');

  useEffect(() => {
    const options = formWaveSurferOptions(waveformRef.current, timelineRef.current);
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
      }
    });

    wavesurfer.current.on('play', () => setIsPlaying(true));
    wavesurfer.current.on('pause', () => setIsPlaying(false));
    wavesurfer.current.on('volume', (e) => setVolume(e));
    wavesurfer.current.on('audioprocess', (e) => {
      onUpdate && onUpdate(e * 1000);
    });

    const unassign = (data: any) => Object.values(data) as Classification[];

    wavesurfer.current?.on('region-in', (region: Region) => {
      const arr = unassign(region.data);
      setSelectedData(arr);
    });

    wavesurfer.current?.on('region-click', (region: Region, e: Event) => {
      e.stopPropagation();
      region.wavesurfer.play(region.start);
      onRegionClick && onRegionClick(region.start * 1000);
      onUpdate && onUpdate(region.start * 1000);
    });

    wavesurfer.current?.on('region-mouseenter', (region: Region) => {
      if (wavesurfer.current?.isPlaying()) return;
      const arr = unassign(region.data);
      setSelectedData(arr);
    });

    return () => wavesurfer.current?.destroy();

    // eslint-disable-next-line
  }, [url, peaks]);

  useEffect(() => {
    if (wavesurfer.current && regionData?.length === 0) {
      setSelectedData(undefined);
      setIsPlaying(false);
    }
    if (wavesurfer.current && regionData?.length && !listening) {
      wavesurfer.current.regions.clear();
      regionData.sort((a, b) => a.index - b.index);
      regionData.forEach(({ start, end, classifications }, idx) => {
        const obj = Object.assign({}, classifications);
        const isAngry = classifications.some((t) => t.type === 'toneofvoice' && t.label.startsWith('ang'));
        const region = {
          ...(isAngry && showTOV && { id: `highlight-${idx}` }),
          start,
          end,
          data: { ...obj },
          drag: false,
        };
        wavesurfer.current?.regions.add(region);
      });
    }
  }, [url, regionData, listening, showTOV]);

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

  const audioEvents = selectedData?.filter((i) => i.type === 'audioevent');
  const toneOfVoice = showTOV && selectedData?.filter((i) => i.type === 'toneofvoice');

  return (
    <div className="Waveform">
      <div className="Waveform__data">
        {toneOfVoice && (
          <>
            <span>Tone-of-voice labels:</span>
            {toneOfVoice.map(({ label, score }, i) => (
              <Tag
                key={`tone-${label}-${i}`}
                label={label.toLowerCase()}
                score={score}
                severity={label.startsWith('ang') ? 'negative' : undefined}
                size={label.startsWith('ang') ? 'small' : undefined}
              />
            ))}
          </>
        )}
        {toneOfVoice && audioEvents && <span>&middot;</span>}
        {audioEvents && (
          <>
            <span>Audio event labels:</span>
            {audioEvents.map(({ label, score }, i) => (
              <Tag
                key={`event-${label}-${i}`}
                label={label.toLowerCase()}
                score={score}
              />
            ))}
          </>
        )}
      </div>
      <div
        className="Waveform__waveform"
        id="waveform"
        ref={waveformRef}
      />
      <div
        className="Waveform__timeline"
        id="timeline"
        ref={timelineRef}
      />
      <div className="Waveform__controls">
        {children}
        <button
          onClick={handlePlayPause}
          className="Waveform__playPause"
          disabled={!url}
        >
          {isPlaying ? (
            <Pause
              width={28}
              height={28}
            />
          ) : (
            <Play
              width={28}
              height={28}
            />
          )}
        </button>
        <div className="Waveform__volume">
          <VolumeUp />
          <input
            type="range"
            id="volume"
            name="volume"
            min="0.01"
            max="1"
            step="0.01"
            onChange={onVolumeChange}
            defaultValue={volume}
          />
        </div>
      </div>
    </div>
  );
};
