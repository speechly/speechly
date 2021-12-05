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
  const [isReturn, setIsReturn] = useState(true)

  const showEndAlert = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    window.alert('Well done! 🎉 \n\nGlobal Air isn’t a real airline, but there’s more demos in the top navigation. ☝️')
  }

  return (
    <div className="BookingForm">
      <div className="BookingForm__tabs">
        <div className="BookingForm__tab BookingForm__tab--active">Book a Flight</div>
        <div className="BookingForm__tab">My booking</div>
        <div className="BookingForm__tab">Check in</div>
        <div className="BookingForm__tab">Flight status</div>
      </div>
      <div className="BookingForm__grid">
        <div className="BookingForm__row">
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
        </div>
        <div className="BookingForm__row">
          <VoiceDatePicker label="Departure" changeOnEntityType="depart" />
          {isReturn && <VoiceDatePicker label="Return" changeOnEntityType="return" />}
        </div>
        <div className="BookingForm__row">
          <VoiceSelect label="Passengers" options={passengersOptions} changeOnEntityType="passengers" />
          <VoiceSelect label="Class" options={classOptions} changeOnEntityType="class" />
        </div>
        <div className="BookingForm__row">
          <div className="BookingForm__row">
          <VoiceToggle
            options={tripOptions}
            changeOnEntityType={tripOptions}
            displayNames={tripDisplayNames}
            onChange={v => setIsReturn(v === tripOptions[0])}
          />
          </div>
          <div className="BookingForm__row">
            <VoiceCheckbox label="Direct flights only" intent="book" clearIntent="clear" setOnEntityType="direct" clearOnEntityType="nondirect" defaultValue={false} />
            <button className="BookingForm__button" disabled={!fromValue || (isReturn && !toValue)} onClick={showEndAlert}>
              Search Flights
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm;
