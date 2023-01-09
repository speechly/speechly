# Change Log - @speechly/react-ui

This log was last generated on Mon, 09 Jan 2023 15:06:08 GMT and should not be manually modified.

## 2.7.3
Mon, 09 Jan 2023 15:06:08 GMT

### Patches

- Update dependencies

## 2.7.2
Wed, 16 Nov 2022 12:35:00 GMT

### Patches

- Updated deps and fixed compile problems it introduced.

## 2.7.1
Tue, 15 Nov 2022 09:13:48 GMT

### Patches

- Harmonize dependencies, release vers

## 2.7.0
Mon, 13 Jun 2022 08:05:47 GMT

### Minor changes

- react-ui support for browser-client@^2.

## 2.6.2
Wed, 04 May 2022 07:31:04 GMT

### Patches

- Fixed a problems with Intro Popup: React version appeared unnecessarily due skipped 'Connected' state. PTT button was in pressed state after exiting Intro Popup if powerOn attribute was set to false (default on React).

## 2.6.1
Tue, 29 Mar 2022 11:27:59 GMT

_Version update only_

## 2.6.0
Mon, 28 Feb 2022 12:08:42 GMT

### Minor changes

- Introducing IntroPopup wrapper for intro-popup customElement

## 2.5.1
Mon, 28 Feb 2022 08:48:12 GMT

### Patches

- respect no tap-to-talk option

## 2.5.0
Mon, 28 Feb 2022 08:02:56 GMT

### Minor changes

- Using new react-client. Removed startContext workaround from client state change which is no longer needed. Harmonized default component sizes with browser-ui.

## 2.4.2
Thu, 10 Feb 2022 14:03:08 GMT

_Version update only_

## 2.4.1
Wed, 09 Feb 2022 11:37:57 GMT

### Patches

- Call-out text color fix

## 2.4.0
Fri, 28 Jan 2022 11:38:16 GMT

### Minor changes

- Dynamic import of browser-ui custom elements to make react-ui play nice with Nextjs server side rendering (SSR)
- 2.2.0 with tap-to-talk support

### Patches

- Using new browser-client v1.1.0 with two JS module bundles (ES & UMD) instead of CJS.
- Suppressed console logging
- removed legacy prepare_dist.js, fixed typedoc generation. Generated docs.
- Changed BigTranscript default placement from 'top' to undefined to fix problems with custom layouts like fashion-ecommerce
- Add sources to target build
- 2.3.2 fixing first tap-to-talk attempt
- 2.3.1 fixing unwanted listening start after permission prompt
- react-ui built against browser-ui 5.0.1
- Updated internal @speechly/browser-ui dependency to >=5.0.1

