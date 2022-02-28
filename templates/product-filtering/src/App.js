import React, { useEffect, useState } from "react";
import { useSpeechContext } from "@speechly/react-client";
import {
  PushToTalkButton,
  BigTranscript,
  IntroPopup
} from "@speechly/react-ui";
import './App.css';

/*
1. Paste your App ID into index.js (get it from https://api.speechly.com/dashboard/)
2. Run `npm start` to run the app in development mode
3. Open http://localhost:3000 and you should see your app running
4. Open the Developer Console to see speech segement outputs.
5. Start developing with Speechly (see https://docs.speechly.com/quick-start/)
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
];

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
];

function App() {
  const { segment } = useSpeechContext()
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    const findValue = (arr, value) => arr.find(v => v.toUpperCase() === value);
    if (segment) {
      if(segment.entities) {
        segment.entities.forEach(entity => {
          console.log(entity);
          if (entity.type === "brand") setBrand(findValue(brands, entity.value));
          if (entity.type === "color") setColor(findValue(colors, entity.value));
        })
      }
      if (segment.isFinal) {
        console.log('✅', segment.entities);
      }
    }
  }, [segment]);

  return (
    <div className="App">
      <BigTranscript placement="top"/>
      <PushToTalkButton placement="bottom" captureKey=" " powerOn="auto" />
      <IntroPopup />
      <div className="Filters">
        <div className="Filters_filter">
          <label>Color</label>
          <select value={color} onChange={e => setColor(e.target.value)}>
            <option value="" disabled>Select color</option>
            {colors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="Filters_filter">
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
              <div key={b + c} className="Product">
                <div style={{backgroundColor: c}} className="Product_img" />
                <small className="Product_brand">{b}</small>
                <span className="Product_title">{c}</span>
              </div>
            )
          )
        }
      </div>
      <p className="openconsole">ℹ️ Open the Browser Console to see speech segment outputs</p>
    </div>
  );
}

export default App;
