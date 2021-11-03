import { VoiceDatePicker, VoiceCheckbox, VoiceInput, VoiceSelect, VoiceToggle } from "@speechly/react-voice-forms";

const passengersOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
const classOptions = ["Economy", "Business", "First"]
const tripOptions = ["one_way", "round_trip"]
const tripDisplayNames = ["One way", "Round trip"]

const BookingForm = () => {
  return (
    <form>
      <div className="group">
        <VoiceToggle options={tripOptions} changeOnEntityType={tripOptions} displayNames={tripDisplayNames} />
      </div>
      <div className="group">
        <VoiceInput label="From" changeOnEntityType="from" />
        <VoiceInput label="To" changeOnEntityType="to" />
      </div>
      <div className="group">
        <VoiceDatePicker label="Departure" changeOnEntityType="depart" />
        <VoiceDatePicker label="Return" changeOnEntityType="return" />
      </div>
      <div className="group">
        <VoiceSelect label="Passengers" options={passengersOptions} changeOnEntityType="passengers" />
        <VoiceSelect label="Class" options={classOptions} changeOnEntityType="class" />
      </div>
      <div className="group">
        <VoiceCheckbox label="Direct only" intent="book" clearIntent="clear" setOnEntityType="direct" clearOnEntityType="nondirect" defaultValue={false} />
      </div>
    </form>
  )
}

export default BookingForm;
