# Change Log - @speechly/browser-ui

This log was last generated on Wed, 14 Dec 2022 12:04:27 GMT and should not be manually modified.

## 6.0.5
Wed, 14 Dec 2022 12:04:27 GMT

### Patches

- Improved recovery after connection loss.

## 6.0.4
Wed, 16 Nov 2022 12:35:00 GMT

### Patches

- Re-added browser-ui demomode.js to package.

## 6.0.3
Tue, 15 Nov 2022 09:13:48 GMT

### Patches

- Harmonize dependencies, release version with new browser-client

## 6.0.2
Tue, 14 Jun 2022 14:29:09 GMT

### Patches

- Fix for incorrect sample rate on Firefox and Safari resulting in no ASR.

## 6.0.0
Mon, 13 Jun 2022 08:05:47 GMT

### Breaking changes

- browser-ui support for browser-client@^2.

## 5.3.2
Wed, 04 May 2022 07:31:04 GMT

### Patches

- Fixed a problems with Intro Popup: React version appeared unnecessarily due skipped 'Connected' state. PTT button was in pressed state after exiting Intro Popup if powerOn attribute was set to false (default on React).

## 5.3.1
Tue, 29 Mar 2022 11:27:59 GMT

_Version update only_

## 5.3.0
Mon, 28 Feb 2022 12:08:42 GMT

### Minor changes

- Removed initialized and speechlystarting postMessages in favour of using ClientState.Connecting and ClientState.Connected

## 5.2.1
Mon, 28 Feb 2022 08:48:12 GMT

### Patches

- respect no tap-to-talk option

## 5.2.0
Mon, 28 Feb 2022 08:02:56 GMT

### Minor changes

- Using new browser-client. Removed startContext workaround from onStateChange which is no longer needed."

## 5.1.1
Thu, 10 Feb 2022 14:03:08 GMT

_Version update only_

## 5.1.0
Wed, 09 Feb 2022 11:37:57 GMT

### Minor changes

- Added backgroundcolor, iconcolor, holdscale, borderscale, iconsize, fxsize attributes for push-to-talk-button styling. Renamed old backgroundcolor to hintbackgroundcolor.
- Introduced Intro Popup for a permission priming and for diagnosing problems with Speechly.

## 5.0.7
Fri, 28 Jan 2022 11:38:16 GMT

### Patches

- Changed url references to unpkg.com. rushx start will now start dev server in watch mode.
- 5.0.1 published with production build.
- 5.0.4 with leaner build, new README
- Using new browser-client v1.1.0 with two JS module bundles (ES & UMD) instead of CJS.
- Added static asset (index.html) watch for better dev experience
- Add sources to target build
- 5.0.6 fixes first tap-to-talk press
- 5.0.5 fixing listening auto-starting after permission consent
- Exposed --widget-shadow variable. MUI theme improvements.
- 5.0.2 with bug fixes for react-ui tap-to-talk feature

