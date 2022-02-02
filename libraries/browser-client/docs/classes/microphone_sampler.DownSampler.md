[@speechly/browser-client](../README.md) / [microphone/sampler](../modules/microphone_sampler.md) / DownSampler

# Class: DownSampler

[microphone/sampler](../modules/microphone_sampler.md).DownSampler

DownSampler is a re-sampler that performs downsampling on the passed audio buffer.

## Implements

- [`AudioFilter`](../interfaces/microphone_sampler.AudioFilter.md)

## Table of contents

### Constructors

- [constructor](microphone_sampler.DownSampler.md#constructor)

### Properties

- [resampleRatio](microphone_sampler.DownSampler.md#resampleratio)

### Methods

- [call](microphone_sampler.DownSampler.md#call)

## Constructors

### constructor

• **new DownSampler**(`sourceSampleRate`, `targetSampleRate`, `filter`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceSampleRate` | `number` |
| `targetSampleRate` | `number` |
| `filter` | `Float32Array` |

## Properties

### resampleRatio

• `Readonly` **resampleRatio**: `number`

#### Implementation of

[AudioFilter](../interfaces/microphone_sampler.AudioFilter.md).[resampleRatio](../interfaces/microphone_sampler.AudioFilter.md#resampleratio)

## Methods

### call

▸ **call**(`input`): `Int16Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Float32Array` |

#### Returns

`Int16Array`

#### Implementation of

[AudioFilter](../interfaces/microphone_sampler.AudioFilter.md).[call](../interfaces/microphone_sampler.AudioFilter.md#call)
