import React, { useEffect, useRef, useState } from "react";
import { useSpeechContext } from "@speechly/react-client";

export type VoiceToggleProps = {
  /**
   * Options presented by this widget. The selected option is returned by `onChange`.
   */
  options: string[]
  
  /**
   * Human-friendly display names for each option.
   */
  displayNames?: string[]
  
  /**
   * The current option. Must match a `options` value. Provide an `onChange` handler to react to changes.
   */
  value?: string

  /**
    * Initially selected option. Has no effect if `value` is specified.
    */
  defaultValue?: string
 
  /**
   * `string[]` (intents) changes this widget's option based on the intent of the SpeechSegment. The order must match that of `options`.
   * `string` (intent) filters out all but the specified intent. Use `changeOnEntityType` or `changeOnEntityValue` to change the option.
   * `undefined` disables intent filtering.
   */
  changeOnIntent?: string | string []

  /**
   * `string[]` (entity types) changes this widget's option if a matched entity type is found in the SpeechSegment. The order must match that of `options`.
   * `string` (intent) filters out all but the specified entity type. Use `changeOnEntityValue` to change the option.
   * `undefined` disables entity type filtering.
   */
  changeOnEntityType?: string | string []

  /**
   * `string[]` (entity values) changes this widget's option if a matched entity value is found in the SpeechSegment. The order must match that of `options`.
   */
  changeOnEntityValue?: string []

  /**
   * @private
   */
  focused?: boolean

  /**
   * @param value The option for the selected item. 
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

export const VoiceToggle = ({ changeOnIntent, changeOnEntityType, changeOnEntityValue, options, displayNames, value, defaultValue, onChange, onFinal, onVoiceBlur, onVoiceFocus, focused = false }: VoiceToggleProps) => {

  const inputEl: React.RefObject<HTMLInputElement> = useRef(null)

  const [ matchesInUpperCase, setMatchesInUpperCase ] = useState<string[]>([]);
  const [ _focused, _setFocused ] = useState(focused)
  const [ _value, _setValue ] = useState(defaultValue ?? options[0])
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
    var effectiveOptions;
    if (Array.isArray(changeOnIntent)) {
      effectiveOptions = changeOnIntent
    }
    else if (Array.isArray(changeOnEntityType)) {
      effectiveOptions = changeOnEntityType
    }
    else if (Array.isArray(changeOnEntityValue)) {
      effectiveOptions = changeOnEntityValue
    }
    else {
      effectiveOptions = options
    }
    setMatchesInUpperCase(effectiveOptions.map((option: string) => option.toUpperCase()))
  }, [options, changeOnIntent, changeOnEntityType, changeOnEntityValue])

  useEffect(() => {
    if (segment) {
      let newValue = null

      // Define newValue if the segment contains input targeted to this component
      let candidates;
      if (Array.isArray(changeOnIntent)) {
        candidates = [segment.intent.intent];
      } else {
        // React if no intent defined; or a specified intent is defined
        if (!changeOnIntent || segment.intent.intent === changeOnIntent) {
          if (Array.isArray(changeOnEntityType)) {
            candidates = segment.entities.map(entity => entity.type);
          } else {
            candidates = segment.entities.filter(entity => entity.type === changeOnEntityType).map(entity => entity.value);
          }
        }
      }

      if (candidates && candidates.length > 0) {
        // Match each candidate in segment against the target values
        candidates.forEach(candidateName => {
          const index = matchesInUpperCase.findIndex((option: string) => option === candidateName.toUpperCase())
          if (index >= 0) {
            newValue = options[index]
          }
        })

        if (newValue !== null) {

          // Update last good known value when targeted the first time
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
    <div ref={inputEl} className={`widgetGroup toggle ${_focused ? "voicefocus": ""}`}>
      {
        options.map((optionValue: string, index: number): React.ReactNode =>
          <button key={optionValue} type="button" className={(value !== undefined ? value : _value) === optionValue ? 'active' : ''} onClick={() => _onChange(optionValue)}>
            {displayNames && displayNames[index] ? displayNames[index] : optionValue}
          </button>)
      }
    </div>
  );
}
