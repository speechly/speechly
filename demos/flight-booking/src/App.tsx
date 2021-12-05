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
      <ErrorPanel placement="bottom" />
      <DemoNavigation />
      <div className="Navigation">
        <img className="Navigation__logo" src={logoPath} alt="logo" />
        <span className="Navigation__item">Explore</span>
        <span className="Navigation__item">Help</span>
        <span className="Navigation__item">Miles</span>
        <span className="Navigation__item Navigation__item--right">Login</span>
        <span className="Navigation__item">Register</span>
        <span className="Navigation__item Navigation__item--right Navigation__item--mobile">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </span>
      </div>
      <div className="Hero" style={{ backgroundImage: 'url(hero.jpg)' }}>
        <h1>Where to next?</h1>
        <BookingForm />
        <div className="PushToTalkContainer">
          <PushToTalkButton captureKey=" " size="80px" showTime={3000} />
        </div>
      </div>
      <div className="Content">
        <h2>Inspiration for your next trip</h2>
        <div className="Content__grid">
          <div className="Content__block">
            <img src="city-london.jpg" alt="city" />
            <h3>London</h3>
            <p>United Kingdom</p>
          </div>
          <div className="Content__block">
            <img src="city-innsbruck.jpg" alt="city" />
            <h3>Innsbruck</h3>
            <p>Austria</p>
          </div>
          <div className="Content__block">
            <img src="city-paris.jpg" alt="city" />
            <h3>Paris</h3>
            <p>France</p>
          </div>
          <div className="Content__block">
            <img src="city-barcelona.jpg" alt="city" />
            <h3>Barcelona</h3>
            <p>Spain</p>
          </div>
        </div>
      </div>
      <div className="Footer">
        <div className="Footer__inner">
          <div className="Footer__col">
            <strong>Customer care</strong>
            <span>FAQs</span>
            <span>Contact us</span>
            <span>Contact forms</span>
          </div>
          <div className="Footer__col">
            <strong>About Global Air</strong>
            <span>Careers</span>
            <span>About us</span>
            <span>Our mission</span>
          </div>
          <div className="Footer__col">
            <strong>Our website</strong>
            <span>Terms & conditions</span>
            <span>Privacy & cookies policy</span>
            <span>Privacy centre</span>
            <span>Site map</span>
            <span>Accessibility</span>
          </div>
          <div className="Footer__col">
            <strong>Follow us</strong>
            <span>Newsletter</span>
            <span>Mobile application</span>
            <span>Blue Wings stories</span>
            <span>Facebook</span>
            <span>Instagram</span>
            <span>Twitter</span>
            <span>Youtube</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
