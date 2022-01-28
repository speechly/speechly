import React, { useEffect, useRef, useState } from "react";
import { useSpeechContext, Word } from "@speechly/react-client";
import { formatEntities } from "../utils"

export type VoiceCheckboxProps = {
  /**
   * The label displayed on the component. For speech use, the label should match the keywords in the phrase used to control the widget:
   * e.g. component with label "Passengers" should be configured to react to phrases like "3 passegers"
   */
  label: string
  /**
   * The current value. Specifying the value controls the components's state so it makes sense to provide an onChange handler.
   */
  value?: boolean
  /**
   * Initial checked state. Has no effect if `value` is specified.
   */
  defaultValue?: boolean

  /**
   * `string` (intent) filters out all but the specified intent.
   * `undefined` sets on any intent.
   */
  intent?: string

  /**
   * `string` (intent) forces clearing values both on `setOnEntityType` and `clearOnEntityType`.
   */
  clearIntent?: string

  /**
   * `string` (entity type) sets (checks) this widget if a matched entity type is found in the SpeechSegment.
   */
  setOnEntityType: string

  /**
   * `string` (entity type) clears (unchecks) this widget if a matched entity type is found in the SpeechSegment.
   */
  clearOnEntityType?: string

  /**
   * @private
   */
  focused?: boolean

  /**
   * @param value The new value
   * Triggered upon GUI or voice manipulation of the widget.
   */
  onChange?: (value: boolean) => void

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

export const VoiceCheckbox = ({ label, value, defaultValue, intent, clearIntent, setOnEntityType, clearOnEntityType, onChange, onFinal, onVoiceBlur, onVoiceFocus, focused = false }: VoiceCheckboxProps) => {

  const inputEl: React.RefObject<HTMLInputElement> = useRef(null)

  const [ _focused, _setFocused ] = useState(focused)
  const [ _value, _setValue ] = useState(defaultValue !== undefined ? defaultValue : false)
  const [ lastGoodKnownValue, setLastGoodKnownValue ] = useState(defaultValue ?? false)
  const { segment } = useSpeechContext()

  const _onChange = (newValue: boolean) => {
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
      let newValue = null

      // Define newValue if the segment contains input targeted to this component
      const clear = clearIntent && segment.intent.intent === clearIntent
      const set = !clear && (!intent || segment.intent.intent === intent)

      if (set || clear) {
        const entities = formatEntities(segment.entities)
        if (entities[setOnEntityType] !== undefined) {
          newValue = set
        } else if (clearOnEntityType && entities[clearOnEntityType] !== undefined) {
          newValue = false
        }
      }

      if (newValue !== null) {
        // Field is targeted
        if (!_focused) {
          setLastGoodKnownValue(value !== undefined ? value : _value)
        }
        _onChange(newValue)
        _onVoiceFocus()

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
    <div className={`widgetGroup checkbox ${_focused ? "voicefocus": ""}`}>
      <input
          type="checkbox"
          checked={value !== undefined ? value : _value}
          onChange={(event: any) => { _onChange(event.target.checked) }} />
      <label>{ label }</label>
    </div>
  );
}
