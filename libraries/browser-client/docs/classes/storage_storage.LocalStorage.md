[@speechly/browser-client](../README.md) / [storage/storage](../modules/storage_storage.md) / LocalStorage

# Class: LocalStorage

[storage/storage](../modules/storage_storage.md).LocalStorage

## Implements

- [`Storage`](../interfaces/storage_types.Storage.md)

## Table of contents

### Constructors

- [constructor](storage_storage.LocalStorage.md#constructor)

### Methods

- [get](storage_storage.LocalStorage.md#get)
- [set](storage_storage.LocalStorage.md#set)
- [getOrSet](storage_storage.LocalStorage.md#getorset)

## Constructors

### constructor

• **new LocalStorage**()

## Methods

### get

▸ **get**(`key`): ``null`` \| `string`

Retrieves a key from the storage.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

``null`` \| `string`

#### Implementation of

[Storage](../interfaces/storage_types.Storage.md).[get](../interfaces/storage_types.Storage.md#get)

___

### set

▸ **set**(`key`, `val`): `void`

Adds a key to the storage, possibly overwriting existing value.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `val` | `string` |

#### Returns

`void`

#### Implementation of

[Storage](../interfaces/storage_types.Storage.md).[set](../interfaces/storage_types.Storage.md#set)

___

### getOrSet

▸ **getOrSet**(`key`, `genFn`): `string`

Adds a key to the storage, possibly overwriting existing value.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `genFn` | () => `string` |

#### Returns

`string`

#### Implementation of

[Storage](../interfaces/storage_types.Storage.md).[getOrSet](../interfaces/storage_types.Storage.md#getorset)
