# Change Log - @speechly/react-client

This log was last generated on Tue, 31 Jan 2023 09:43:23 GMT and should not be manually modified.

## 2.2.2
Tue, 31 Jan 2023 09:43:23 GMT

### Patches

- Update documentation

## 2.2.1
Wed, 14 Dec 2022 12:04:27 GMT

### Patches

- Improved recovery after connection loss. Improved behaviour with React 18 mount, unmount, mount upon app start.

## 2.2.0
Mon, 17 Oct 2022 07:57:20 GMT

### Minor changes

- Fixed problem when calling BrowserClient.start() and stop() quickly multiple times. Stop() can be awaited to return the stopped context id.

## 2.1.2
Tue, 14 Jun 2022 14:29:09 GMT

### Patches

- Fix for incorrect sample rate on Fir

## 2.1.0
Mon, 13 Jun 2022 08:05:47 GMT

### Minor changes

- react-client support for browser-client@^2

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

