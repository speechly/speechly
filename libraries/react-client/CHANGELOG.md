# Change Log - @speechly/react-client

This log was last generated on Tue, 29 Mar 2022 11:27:59 GMT and should not be manually modified.

## 2.0.1
Tue, 29 Mar 2022 11:27:59 GMT

_Version update only_

## 2.0.0
Mon, 28 Feb 2022 08:02:56 GMT

### Breaking changes

- Exposed connect() method and client instance from browser client. Added listening property as instant source of truth, telling the if startContext has been called. Attaching event listeners before connect. Removed initialization logic that has been relocated to browser client.

## 1.2.1
Thu, 10 Feb 2022 14:03:08 GMT

_Version update only_

## 1.2.0
Fri, 28 Jan 2022 11:38:16 GMT

### Minor changes

- Using new browser-client v1.1.0 with two JS module bundles (ES & UMD) instead of CJS.

### Patches

- Add sources to target build
- 1.1.1 with startContext, stopContext and clientState exposed
- Initialize Speechly on DOM mount instead of constructor to fix server-side rendering problems

