# Change Log - @speechly/react-ui

This log was last generated on Wed, 09 Feb 2022 06:11:03 GMT and should not be manually modified.

## 2.4.1
Wed, 09 Feb 2022 06:11:03 GMT

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

