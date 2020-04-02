[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [Storage](_index_d_.storage.md)

# Interface: Storage

An interface for local key-value storage.

## Hierarchy

* **Storage**

## Index

### Methods

* [close](_index_d_.storage.md#close)
* [get](_index_d_.storage.md#get)
* [initialize](_index_d_.storage.md#initialize)
* [set](_index_d_.storage.md#set)

## Methods

###  close

▸ **close**(`cb`: [ErrorCallback](../modules/_index_d_.md#errorcallback)): *void*

Defined in index.d.ts:389

Closes the storage.

Calling `initialize` again after calling `close` should succeed and make storage ready to use again.
This method will be called by the Client as part of client closure process.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [ErrorCallback](../modules/_index_d_.md#errorcallback) | the callback that should be invoked after the closure process is completed (either successfully or with an error).  |

**Returns:** *void*

___

###  get

▸ **get**(`key`: string, `cb`: [StorageGetCallback](../modules/_index_d_.md#storagegetcallback)): *void*

Defined in index.d.ts:397

Retrieves a key from the storage.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | the key to retrieve |
`cb` | [StorageGetCallback](../modules/_index_d_.md#storagegetcallback) | the callback that should be invoked after retrieval operation is done, either with the value or with an error.  |

**Returns:** *void*

___

###  initialize

▸ **initialize**(`cb`: [ErrorCallback](../modules/_index_d_.md#errorcallback)): *void*

Defined in index.d.ts:379

Initialises the storage.

Any long-running operation (or operation that can fail), should be done in this method,
rather than in a constructor.
This method will be called by the Client as part of client initialisation process.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [ErrorCallback](../modules/_index_d_.md#errorcallback) | the callback that is invoked after initialisation is completed (either successfully or with an error).  |

**Returns:** *void*

___

###  set

▸ **set**(`key`: string, `val`: string, `cb`: [ErrorCallback](../modules/_index_d_.md#errorcallback)): *void*

Defined in index.d.ts:406

Adds a key to the storage, possibly overwriting existing value.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | the key to write |
`val` | string | the value to write |
`cb` | [ErrorCallback](../modules/_index_d_.md#errorcallback) | the callback that should be invoked after retrieval operation is done, either with the value or with an error.  |

**Returns:** *void*
