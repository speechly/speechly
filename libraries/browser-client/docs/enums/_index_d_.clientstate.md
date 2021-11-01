[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [ClientState](_index_d_.clientstate.md)

# Enumeration: ClientState

All possible states of a Speechly API client. Failed, NoBrowserSupport and NoAudioConsent states are non-recoverable
erroneous states, which should be handled by the end user, according to the semantics of an application.
Other states can also be utilized for e.g. enabling and disabling recording buttons or showing the status in the app.
It is also possible to use arithmetics for state comparison, e.g. `if (state < speechly.ClientState.Disconnected)`,
to react to non-recoverable states.

## Index

### Enumeration members

* [Connected](_index_d_.clientstate.md#connected)
* [Connecting](_index_d_.clientstate.md#connecting)
* [Disconnected](_index_d_.clientstate.md#disconnected)
* [Disconnecting](_index_d_.clientstate.md#disconnecting)
* [Failed](_index_d_.clientstate.md#failed)
* [NoAudioConsent](_index_d_.clientstate.md#noaudioconsent)
* [NoBrowserSupport](_index_d_.clientstate.md#nobrowsersupport)
* [Recording](_index_d_.clientstate.md#recording)
* [Starting](_index_d_.clientstate.md#starting)
* [Stopping](_index_d_.clientstate.md#stopping)

## Enumeration members

###  Connected

• **Connected**: = 6

Defined in index.d.ts:260

___

###  Connecting

• **Connecting**: = 5

Defined in index.d.ts:259

___

###  Disconnected

• **Disconnected**: = 3

Defined in index.d.ts:257

___

###  Disconnecting

• **Disconnecting**: = 4

Defined in index.d.ts:258

___

###  Failed

• **Failed**: = 0

Defined in index.d.ts:254

___

###  NoAudioConsent

• **NoAudioConsent**: = 2

Defined in index.d.ts:256

___

###  NoBrowserSupport

• **NoBrowserSupport**: = 1

Defined in index.d.ts:255

___

###  Recording

• **Recording**: = 9

Defined in index.d.ts:263

___

###  Starting

• **Starting**: = 7

Defined in index.d.ts:261

___

###  Stopping

• **Stopping**: = 8

Defined in index.d.ts:262
