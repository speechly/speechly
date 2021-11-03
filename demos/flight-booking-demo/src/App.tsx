import React from 'react';
import { PushToTalkButton, ErrorPanel } from '@speechly/react-ui';
import { TranscriptDrawer } from '@speechly/react-ui/lib/components/TranscriptDrawer';
import BookingForm from './components/BookingForm';
import './voice-form-component-calendar.css';
import './voice-form-theme-capsule.css';
import './App.css';

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

const DemoStrings = [
  '*book Book a [return](round_trip) flight from London(from) to [New York](to)',
  '*book For 2(passengers) passengers',
  '*book In business(class) class',
  '*book Direct(direct) flights only',
  '*clear clear',
]

function App() {
  return (
    <>
      <TranscriptDrawer
        height="4rem"
        highlightColor="var(--color-active-bg)"
        smallTextColor="var(--color-active-bg)"
        backgroundColor="rgba(162, 213, 240, 0.4)"
        hint={UsageHints}
      />

      <PushToTalkButton captureKey=" " placement="bottom" size="88px" voffset="32px" />
      <ErrorPanel placement="bottom" />

      <div className="App">
        <div style={{flexGrow: 1}}></div>
        <BookingForm />
        <div style={{flexGrow: 1.618}}></div>
      </div>
    </>
  );
}

export default App;
