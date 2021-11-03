import { BigTranscriptContainer, BigTranscript, 
  PushToTalkButton, PushToTalkButtonContainer,
  ErrorPanel } from '@speechly/react-ui';
import CheckoutForm from './components/CheckoutForm';
import SidePanel from './components/SidePanel';

function App() {
  return (
    <div className="App CheckoutApp">
      <BigTranscriptContainer>
        <BigTranscript />
      </BigTranscriptContainer>
      <div className='pageLayout'>
        <main>
          <CheckoutForm />
        </main>
        <SidePanel />
      </div>
      <PushToTalkButtonContainer voffset="calc(1rem + 4vh)" size="5rem">
        <PushToTalkButton size='96px' backgroundColor='#1458c8' captureKey=" " showTime={0} />
        <ErrorPanel />
      </PushToTalkButtonContainer>
    </div>
  );
}

export default App;
