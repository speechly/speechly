import React, { useEffect, useRef, useState } from "react";
import { useSpeechContext, Word } from "@speechly/react-client";
import { formatEntities } from "../utils"

export type VoiceInputProps = {
  /**
   * The label displayed on the component. For speech use, the label should match the keywords in the phrase used to control the widget:
   * e.g. component with label "Passengers" should be configured to react to phrases like "3 passegers"
   */
  label: string
  /**
   * The current value. Specifying the value controls the components's state so it makes sense to provide an onChange handler.
   */
  value?: string
  /**
   * Initial value. Has no effect if `value` is specified.
   */
  defaultValue?: string

  /**
   * `string` (intent) filters out all but the specified intent.
   * `undefined` disables intent filtering.
   */
  changeOnIntent?: string

  /**
   * `string` (entity type) specifies the entity type that changes this component's value. The new value will be the entity's value.
   */

  changeOnEntityType: string
  /**
   * @private
   */

  focused?: boolean
   /**
   * @param value The new value.
   * Triggered upon GUI or voice manipulation of the widget.
   */

  onChange?: (value: string) => void

  /**
   * @private
   */
  onVoiceBlur?: (el: HTMLInputElement) => void

  /**
   * @private
   */
  onVoiceFocus?: (el: HTMLInputElement) => void

  /**
   * @private
   */
  onFinal?: () => void
}

export const VoiceInput = ({ label, value, changeOnIntent, changeOnEntityType, defaultValue, onChange, onFinal, onVoiceBlur, onVoiceFocus, focused = false }: VoiceInputProps) => {

  const inputEl: React.RefObject<HTMLInputElement> = useRef(null)

  const [ _focused, _setFocused ] = useState(focused)
  const [ _value, _setValue ] = useState(defaultValue ?? '')
  const [ lastGoodKnownValue, setLastGoodKnownValue ] = useState(defaultValue ?? '')
  const { segment } = useSpeechContext()

  const _onChange = (newValue: string) => {
    _setValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }
  
  const _onVoiceFocus = () => {
    if (!_focused) {
      _setFocused(true)
      if (onVoiceFocus && inputEl.current) {
        onVoiceFocus(inputEl.current)
      }
    }
  }

  const _onVoiceBlur = () => {
    if (_focused) {
      _setFocused(false)
      if (onVoiceBlur && inputEl.current) {
        onVoiceBlur(inputEl.current)
      }
    }
  }

  useEffect(() => {
    if (segment) {
      let newValue: string | null = null
      
      // Define newValue if the segment contains input targeted to this component
      if (!changeOnIntent || segment.intent.intent === changeOnIntent) {
        let entities = formatEntities(segment.entities)
        if (entities[changeOnEntityType] !== undefined) {
          newValue = entities[changeOnEntityType]
        }
      }

      if (newValue !== null) {
        // Field is targeted
        if (!_focused) {
          setLastGoodKnownValue(value !== undefined ? value : _value)
          _onVoiceFocus()
        }
        _onChange(newValue)

        if (segment?.isFinal) {
          _onVoiceBlur()
          if (onFinal) {
            onFinal()
          }
        }
      } else {
        // Field is no longer targeted: tentative input may retarget to another component at any time
        if (_focused) {
          _onChange(lastGoodKnownValue)
          _onVoiceBlur()
        }
      }

    }
  }, [segment])

  return (
    <div className={`widgetGroup inputText ${_focused ? "voicefocus": ""}`}>
      <label>{ label }</label>
      <input
        ref={inputEl}
        type="text"
        name={changeOnEntityType}
        value={value !== undefined ? value : _value}
        onChange={(event: any) => { _onChange(event.target.value) }}
      />
    </div>
  );
}
