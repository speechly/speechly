[@speechly/browser-client](../README.md) / [client](../modules/client.md) / ContextOptions

# Interface: ContextOptions

[client](../modules/client.md).ContextOptions

Valid options for a new audioContext. All options are optional.

## Table of contents

### Properties

- [appId](client.ContextOptions.md#appid)
- [vocabulary](client.ContextOptions.md#vocabulary)
- [vocabularyBias](client.ContextOptions.md#vocabularybias)
- [silenceTriggeredSegmentation](client.ContextOptions.md#silencetriggeredsegmentation)
- [timezone](client.ContextOptions.md#timezone)

## Properties

### appId

• `Optional` **appId**: `string`

___

### vocabulary

• `Optional` **vocabulary**: `string`[]

Inference time vocabulary.

___

### vocabularyBias

• `Optional` **vocabularyBias**: `string`[]

Inference time vocabulary bias.

___

### silenceTriggeredSegmentation

• `Optional` **silenceTriggeredSegmentation**: `string`[]

Inference time silence triggered segmentation.

___

### timezone

• `Optional` **timezone**: `string`[]

Inference timezone in [TZ database format](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
e.g. "Africa/Abidjan". Timezone should be wrapped to list, like ["Africa/Abidjan"].
