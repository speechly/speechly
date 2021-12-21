import React, { useEffect, useState } from "react";
import { useSpeechContext } from "@speechly/react-client";
import {
  PushToTalkButton,
  BigTranscript,
  ErrorPanel
} from "@speechly/react-ui";
import './App.css';

/*
1. Paste your App ID into index.js (get it from https://api.speechly.com/dashboard/)
2. Run `npm start` to run the app in development mode
3. Open http://localhost:3000 to view it in the browser
4. Start developing with Speechly (see https://docs.speechly.com/quick-start/)
*/

const brands = [
  "Adidas",
  "Air Jordan",
  "Asics",
  "Converse",
  "Fear of God",
  "New Balance",
  "Nike",
  "Off White",
  "Puma",
  "Reebok",
  "Vans",
  "Yeezy",
  "Hoka"
]

const colors = [
  "Black",
  "Blue",
  "Cream",
  "Gold",
  "Green",
  "Orange",
  "Pink",
  "Purple",
  "Red",
  "Silver",
  "Tan",
  "Teal",
  "White",
  "Yellow"
]

function App() {
  const { segment } = useSpeechContext()
  const [brand, setBrand] = useState('')
  const [color, setColor] = useState('')

  useEffect(() => {
    const findValue = (arr, value) => arr.find(v => v.toUpperCase() === value)
    if (segment) {
      if(segment.entities) {
        segment.entities.forEach(entity => {
          if (entity.type === "brand") setBrand(findValue(brands, entity.value))
          if (entity.type === "color") setColor(findValue(colors, entity.value))
        })
      }
      if (segment.isFinal) {
        console.log(segment)
      }
    }
  }, [segment])

  return (
    <div className="App">
      <BigTranscript placement="top"/>
      <PushToTalkButton placement="bottom" captureKey=" "/>
      <ErrorPanel placement="bottom"/>

      <div className="Filter">
        <div>
          <label>Color</label>
          <select value={color} onChange={e => setColor(e.target.value)}>
            <option value="" disabled>Select color</option>
            {colors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label>Brand</label>
          <select value={brand} onChange={e => setBrand(e.target.value)}>
          <option value="" disabled>Select brand</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className="Products">
        {brands
          .filter(b => brand === "" ? b : b === brand).map(b => colors
            .filter(c => color === "" ? c : c === color).map(c =>
              <div className="Product">
                <img src={`https://via.placeholder.com/300x200?text=${b}`} alt="product" />
                <small>{b}</small>
                <span>{c}</span>
              </div>
            )
          )
        }
      </div>
    </div>
    );
}

export default App;
