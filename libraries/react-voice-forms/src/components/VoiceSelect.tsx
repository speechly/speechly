import React, { useEffect, useRef, useState } from "react";
import { useSpeechContext, Word } from "@speechly/react-client";
import { formatEntities } from "../utils"

/**
 * Properties for VoiceSelect component.
 *
 * @public
 */

 export type VoiceSelectProps = {
  /**
   * The label displayed on the component. For speech use, the label should match the keywords in the phrase used to control the widget:
   * e.g. component with label "Passengers" should be configured to react to phrases like "3 passegers"
   */
  label: string

  /**
   * Array of option id strings. The selected id is returned by onChange.
   * By default, the values of the options array is used as `changeOnEntityType` if not one of `changeOnIntent`, changeOnEntityType nor changeOnEntityValue specifies an array value.
   */
  options: string[]
  
  /**
   * Array of human-friendly display names for each option
   */
  displayNames?: string[]
   
  /**
   * The current option. Specifying the value controls the components's state so it makes sense to provide an onChange handler.
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
 
export const VoiceSelect = ({ label, options, displayNames, value, defaultValue, changeOnIntent, changeOnEntityType, changeOnEntityValue, onChange, onFinal, onVoiceBlur, onVoiceFocus, focused = false }: VoiceSelectProps) => {

  const inputEl: React.RefObject<HTMLInputElement> = useRef(null)

  const [ matchesInUpperCase, setMatchesInUpperCase ] = useState<string[]>([]);
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
    if (focused && !_focused && inputEl != null && inputEl.current != null) {
      inputEl.current.focus()
    }
  }, [focused])

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
    <div ref={inputEl} className={`widgetGroup select ${_focused ? "voicefocus": ""}`}>
      <label>{ label }</label>
      <select value={value !== undefined ? value : _value}
        onChange={(event: any) => { _onChange(event.target.value) }}
      >
        {
          options.map((optionValue: string, index: number): React.ReactNode =>
            <option key={optionValue} value={optionValue}>
              {displayNames && displayNames[index] ? displayNames[index] : optionValue}
            </option>)
        }
      </select>
    </div>
  );
}
