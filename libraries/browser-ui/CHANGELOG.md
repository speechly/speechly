# Change Log - @speechly/browser-ui

This log was last generated on Mon, 28 Feb 2022 08:02:56 GMT and should not be manually modified.

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

