[@speechly/browser-client](../README.md) › ["speechly.d"](../modules/_speechly_d_.md) › [ClientState](_speechly_d_.clientstate.md)

# Enumeration: ClientState

All possible states of a Speechly API client. Failed, NoBrowserSupport and NoAudioConsent states are non-recoverable
erroneous states, which should be handled by the end user, according to the semantics of an application.
Other states can also be utilized for e.g. enabling and disabling recording buttons or showing the status in the app.
It is also possible to use arithmetics for state comparison, e.g. `if (state < speechly.ClientState.Disconnected)`,
to react to non-recoverable states.

## Index

### Enumeration members

* [Connected](_speechly_d_.clientstate.md#connected)
* [Connecting](_speechly_d_.clientstate.md#connecting)
* [Disconnected](_speechly_d_.clientstate.md#disconnected)
* [Disconnecting](_speechly_d_.clientstate.md#disconnecting)
* [Failed](_speechly_d_.clientstate.md#failed)
* [NoAudioConsent](_speechly_d_.clientstate.md#noaudioconsent)
* [NoBrowserSupport](_speechly_d_.clientstate.md#nobrowsersupport)
* [Recording](_speechly_d_.clientstate.md#recording)
* [Starting](_speechly_d_.clientstate.md#starting)
* [Stopping](_speechly_d_.clientstate.md#stopping)

## Enumeration members

###  Connected

• **Connected**: = 6

Defined in speechly.d.ts:138

___

###  Connecting

• **Connecting**: = 5

Defined in speechly.d.ts:137

___

###  Disconnected

• **Disconnected**: = 3

Defined in speechly.d.ts:135

___

###  Disconnecting

• **Disconnecting**: = 4

Defined in speechly.d.ts:136

___

###  Failed

• **Failed**: = 0

Defined in speechly.d.ts:132

___

###  NoAudioConsent

• **NoAudioConsent**: = 2

Defined in speechly.d.ts:134

___

###  NoBrowserSupport

• **NoBrowserSupport**: = 1

Defined in speechly.d.ts:133

___

###  Recording

• **Recording**: = 9

Defined in speechly.d.ts:141

___

###  Starting

• **Starting**: = 7

Defined in speechly.d.ts:139

___

###  Stopping

• **Stopping**: = 8

Defined in speechly.d.ts:140
