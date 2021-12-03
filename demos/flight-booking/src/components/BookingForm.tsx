import { VoiceDatePicker, VoiceCheckbox, VoiceInput, VoiceSelect, VoiceToggle } from "@speechly/react-voice-forms";
import './BookingForm.css'

const passengersOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
const classOptions = ["Economy", "Business", "First"]
const tripOptions = ["one_way", "round_trip"]
const tripDisplayNames = ["One way", "Round trip"]

const BookingForm = () => {
  return (
    <div className="BookingForm">
      <div className="BookingForm__tabs">
        <div className="BookingForm__tab BookingForm__tab--active">Book a Flight</div>
        <div className="BookingForm__tab">My booking</div>
        <div className="BookingForm__tab">Check in</div>
        <div className="BookingForm__tab">Flight status</div>
      </div>
      <div className="BookingForm__form">
        <VoiceToggle options={tripOptions} changeOnEntityType={tripOptions} displayNames={tripDisplayNames} />
        <div className="BookingForm__item--right">
         <VoiceCheckbox label="Direct only" intent="book" clearIntent="clear" setOnEntityType="direct" clearOnEntityType="nondirect" defaultValue={false} />
        </div>
        <VoiceInput label="From" changeOnEntityType="from" />
        <VoiceInput label="To" changeOnEntityType="to" />
        <VoiceDatePicker label="Departure" changeOnEntityType="depart" />
        <VoiceDatePicker label="Return" changeOnEntityType="return" />
        <VoiceSelect label="Passengers" options={passengersOptions} changeOnEntityType="passengers" />
        <VoiceSelect label="Class" options={classOptions} changeOnEntityType="class" />
        <div/>
        <button className="BookingForm__item--right BookingForm__button" onClick={e => e.preventDefault()}>
          Search Flights
        </button>
      </div>
    </div>
  )
}

export default BookingForm;
