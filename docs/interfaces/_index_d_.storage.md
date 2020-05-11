[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [Storage](_index_d_.storage.md)

# Interface: Storage

The interface for local key-value storage.

## Hierarchy

* **Storage**

## Index

### Methods

* [close](_index_d_.storage.md#close)
* [get](_index_d_.storage.md#get)
* [getOrSet](_index_d_.storage.md#getorset)
* [initialize](_index_d_.storage.md#initialize)
* [set](_index_d_.storage.md#set)

## Methods

###  close

▸ **close**(): *Promise‹void›*

Defined in index.d.ts:468

Closes the storage.

Calling `initialize` again after calling `close` should succeed and make storage ready to use again.
This method will be called by the Client as part of client closure process.

**Returns:** *Promise‹void›*

___

###  get

▸ **get**(`key`: string): *Promise‹string›*

Defined in index.d.ts:474

Retrieves a key from the storage.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | the key to retrieve  |

**Returns:** *Promise‹string›*

___

###  getOrSet

▸ **getOrSet**(`key`: string, `genFn`: function): *Promise‹string›*

Defined in index.d.ts:489

Adds a key to the storage, possibly overwriting existing value.

**Parameters:**

▪ **key**: *string*

the key to write

▪ **genFn**: *function*

generator function that will be invoked if the key cannot be found in the storage.
The return value of the function will be used as the value that will be stored under the given key.

▸ (): *string*

**Returns:** *Promise‹string›*

___

###  initialize

▸ **initialize**(): *Promise‹void›*

Defined in index.d.ts:461

Initialises the storage.

Any long-running operation (or operation that can fail), should be done in this method,
rather than in a constructor.
This method will be called by the Client as part of client initialisation process.

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `val`: string): *Promise‹void›*

Defined in index.d.ts:481

Adds a key to the storage, possibly overwriting existing value.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | the key to write |
`val` | string | the value to write  |

**Returns:** *Promise‹void›*
