import React, { useState } from "react";
import { VoiceDatePicker, VoiceCheckbox, VoiceInput, VoiceSelect, VoiceToggle } from "@speechly/react-voice-forms";
import './BookingForm.css'

const passengersOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
const classOptions = ["Economy", "Business", "First"]
const tripOptions = ["round_trip", "one_way"]
const tripDisplayNames = ["Round trip", "One way"]

const BookingForm = () => {
  const [fromValue, setFromValue] = useState<string>()
  const [toValue, setToValue] = useState<string>()

  return (
    <div className="BookingForm">
      <div className="BookingForm__tabs">
        <div className="BookingForm__tab BookingForm__tab--active">Book a Flight</div>
        <div className="BookingForm__tab">My booking</div>
        <div className="BookingForm__tab">Check in</div>
        <div className="BookingForm__tab">Flight status</div>
      </div>
      <div className="BookingForm__form">
        <VoiceInput
          label="From"
          changeOnEntityType="from"
          onChange={v => setFromValue(v.toLowerCase())}
          value={fromValue}
        />
        <VoiceInput
          label="To"
          changeOnEntityType="to"
          onChange={v => setToValue(v.toLowerCase())}
          value={toValue}
        />
        <VoiceDatePicker label="Departure" changeOnEntityType="depart" />
        <VoiceDatePicker label="Return" changeOnEntityType="return" />
        <VoiceSelect label="Passengers" options={passengersOptions} changeOnEntityType="passengers" />
        <VoiceSelect label="Class" options={classOptions} changeOnEntityType="class" />
        <VoiceToggle options={tripOptions} changeOnEntityType={tripOptions} displayNames={tripDisplayNames} />
        <div className="BookingForm__item--wrap">
         <VoiceCheckbox label="Direct flights only" intent="book" clearIntent="clear" setOnEntityType="direct" clearOnEntityType="nondirect" defaultValue={false} />
         <button className="BookingForm__button" onClick={e => e.preventDefault()}>
          Search Flights
        </button>
        </div>
      </div>
    </div>
  )
}

export default BookingForm;
