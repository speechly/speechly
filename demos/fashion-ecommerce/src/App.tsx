import { useSpeechContext } from '@speechly/react-client';
import {
  BigTranscript,
  BigTranscriptContainer,
  // PushToTalkButton,
  // IntroPopup,
} from '@speechly/react-ui';
import { DemoNavigation } from '@speechly/demo-navigation';
import classNames from 'classnames';
import Inventory from 'components/Inventory';
import SmartFilter from 'components/SmartFilters';
import Navigation from 'components/Navigation';
import { AppContextProvider } from 'AppContext';
import { ReactComponent as MicIcon } from './res/mic.svg';
import 'components/BigTransscript.css';
import 'App.css';

export default function App() {
  const { attachMicrophone, start, stop, listening, segment } =
    useSpeechContext();

  const handleClick = async () => {
    if (listening) {
      await stop();
    } else {
      await attachMicrophone();
      await start();
    }
  };

  const classes = classNames({
    Microphone: true,
    'Microphone--active': listening,
  });

  return (
    <AppContextProvider>
      <div className="App">
        <DemoNavigation />
        <Navigation />
        <SmartFilter />
        <Inventory>
          <BigTranscriptContainer position="absolute">
            <BigTranscript formatText={false} mockSegment={segment} />
          </BigTranscriptContainer>
        </Inventory>
      </div>
      <button type="button" className={classes} onClick={handleClick}>
        <MicIcon width={36} height={36} />
      </button>
      {/* <PushToTalkButton
        captureKey=" "
        placement="bottom"
        size="80px"
        showTime={3000}
        powerOn="auto"
      />
      <IntroPopup/> */}
    </AppContextProvider>
  );
}
