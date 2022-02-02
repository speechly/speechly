[@speechly/browser-client](../README.md) / [storage/types](../modules/storage_types.md) / Storage

# Interface: Storage

[storage/types](../modules/storage_types.md).Storage

The interface for local key-value storage.

## Implemented by

- [`LocalStorage`](../classes/storage_storage.LocalStorage.md)

## Table of contents

### Methods

- [get](storage_types.Storage.md#get)
- [set](storage_types.Storage.md#set)
- [getOrSet](storage_types.Storage.md#getorset)

## Methods

### get

▸ **get**(`key`): ``null`` \| `string`

Retrieves a key from the storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | the key to retrieve |

#### Returns

``null`` \| `string`

___

### set

▸ **set**(`key`, `val`): `void`

Adds a key to the storage, possibly overwriting existing value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | the key to write |
| `val` | `string` | the value to write |

#### Returns

`void`

___

### getOrSet

▸ **getOrSet**(`key`, `genFn`): `string`

Adds a key to the storage, possibly overwriting existing value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | the key to write |
| `genFn` | () => `string` | generator function that will be invoked if the key cannot be found in the storage. The return value of the function will be used as the value that will be stored under the given key. |

#### Returns

`string`
