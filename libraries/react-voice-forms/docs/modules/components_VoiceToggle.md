[@speechly/react-voice-forms](../README.md) / components/VoiceToggle

# Module: components/VoiceToggle

## Table of contents

### Type aliases

- [VoiceToggleProps](components_VoiceToggle.md#voicetoggleprops)

### Functions

- [VoiceToggle](components_VoiceToggle.md#voicetoggle)

## Type aliases

### VoiceToggleProps

Ƭ **VoiceToggleProps**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `string`[] | Options presented by this widget. The selected option is returned by `onChange`. |
| `displayNames?` | `string`[] | Human-friendly display names for each option. |
| `value?` | `string` | The current option. Must match a `options` value. Provide an `onChange` handler to react to changes. |
| `defaultValue?` | `string` | Initially selected option. Has no effect if `value` is specified. |
| `changeOnIntent?` | `string` \| `string`[] | `string[]` (intents) changes this widget's option based on the intent of the SpeechSegment. The order must match that of `options`. `string` (intent) filters out all but the specified intent. Use `changeOnEntityType` or `changeOnEntityValue` to change the option. `undefined` disables intent filtering. |
| `changeOnEntityType?` | `string` \| `string`[] | `string[]` (entity types) changes this widget's option if a matched entity type is found in the SpeechSegment. The order must match that of `options`. `string` (intent) filters out all but the specified entity type. Use `changeOnEntityValue` to change the option. `undefined` disables entity type filtering. |
| `changeOnEntityValue?` | `string`[] | `string[]` (entity values) changes this widget's option if a matched entity value is found in the SpeechSegment. The order must match that of `options`. |
| `onChange?` | (`value`: `string`) => `void` |  |

## Functions

### VoiceToggle

▸ **VoiceToggle**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`VoiceToggleProps`](components_VoiceToggle.md#voicetoggleprops) |

#### Returns

`Element`
