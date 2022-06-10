[@speechly/react-voice-forms](../README.md) / components/VoiceSelect

# Module: components/VoiceSelect

## Table of contents

### Type aliases

- [VoiceSelectProps](components_VoiceSelect.md#voiceselectprops)

### Functions

- [VoiceSelect](components_VoiceSelect.md#voiceselect)

## Type aliases

### VoiceSelectProps

Ƭ **VoiceSelectProps**: `Object`

Properties for VoiceSelect component.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `label` | `string` | The label displayed on the component. For speech use, the label should match the keywords in the phrase used to control the widget: e.g. component with label "Passengers" should be configured to react to phrases like "3 passegers" |
| `options` | `string`[] | Array of option id strings. The selected id is returned by onChange. By default, the values of the options array is used as `changeOnEntityType` if not one of `changeOnIntent`, changeOnEntityType nor changeOnEntityValue specifies an array value. |
| `displayNames?` | `string`[] | Array of human-friendly display names for each option |
| `value?` | `string` | The current option. Specifying the value controls the components's state so it makes sense to provide an onChange handler. |
| `defaultValue?` | `string` | Initially selected option. Has no effect if `value` is specified. |
| `changeOnIntent?` | `string` \| `string`[] | `string[]` (intents) changes this widget's option based on the intent of the SpeechSegment. The order must match that of `options`. `string` (intent) filters out all but the specified intent. Use `changeOnEntityType` or `changeOnEntityValue` to change the option. `undefined` disables intent filtering. |
| `changeOnEntityType?` | `string` \| `string`[] | `string[]` (entity types) changes this widget's option if a matched entity type is found in the SpeechSegment. The order must match that of `options`. `string` (intent) filters out all but the specified entity type. Use `changeOnEntityValue` to change the option. `undefined` disables entity type filtering. |
| `changeOnEntityValue?` | `string`[] | `string[]` (entity values) changes this widget's option if a matched entity value is found in the SpeechSegment. The order must match that of `options`. |
| `onChange?` | (`value`: `string`) => `void` |  |

## Functions

### VoiceSelect

▸ **VoiceSelect**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`VoiceSelectProps`](components_VoiceSelect.md#voiceselectprops) |

#### Returns

`Element`
