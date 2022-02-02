[@speechly/browser-client](../README.md) / [microphone/sampler](../modules/microphone_sampler.md) / BypassSampler

# Class: BypassSampler

[microphone/sampler](../modules/microphone_sampler.md).BypassSampler

BypassSampler is a re-sampler that simply returns the passed buffer without performing any sampling.

## Implements

- [`AudioFilter`](../interfaces/microphone_sampler.AudioFilter.md)

## Table of contents

### Constructors

- [constructor](microphone_sampler.BypassSampler.md#constructor)

### Properties

- [resampleRatio](microphone_sampler.BypassSampler.md#resampleratio)

### Methods

- [call](microphone_sampler.BypassSampler.md#call)

## Constructors

### constructor

• **new BypassSampler**()

## Properties

### resampleRatio

• `Readonly` **resampleRatio**: ``1``

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
