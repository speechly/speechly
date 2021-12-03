import React from 'react';
import { PushToTalkButton, ErrorPanel } from '@speechly/react-ui';
import { TranscriptDrawer } from '@speechly/react-ui/lib/components/TranscriptDrawer';
import { DemoNavigation } from '@speechly/demo-navigation';
import BookingForm from './components/BookingForm';
import "@speechly/react-voice-forms/css/components/VoiceDatePicker.css";
import "@speechly/react-voice-forms/css/theme/capsule.css";
import './App.css';
import logoPath from './logo.svg'

const UsageHints = [
  'Try: "Book a return flight from London to New York"',
  'Try: "Departing next Tuesday"',
  'Try: "Returning next Friday"',
  'Try: "Direct flights only"',
  'Try: "Business class"',
  'Try: "2 passengers"',
  'Try: "One way"',
  'Try: "Clear" to restart',
]

function App() {
  return (
    <div className="App">
      <TranscriptDrawer hint={UsageHints} />
      <PushToTalkButton captureKey=" " placement="bottom" size="80px" voffset="32px" />
      <ErrorPanel placement="bottom" />
      <DemoNavigation />
      <div className="Navigation">
        <img className="Navigation__logo" src={logoPath} alt="logo" />
        <span className="Navigation__item">Explore</span>
        <span className="Navigation__item">Help</span>
        <span className="Navigation__item">Miles</span>
        <span className="Navigation__item Navigation__item--right">Login</span>
        <span className="Navigation__item">Register</span>
      </div>
      <div className="Hero">
        <BookingForm />
      </div>
      <div className="Content"></div>
    </div>
  );
}

export default App;
