import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SpeechProvider } from '@speechly/react-client'
import { PushToTalkButton, TranscriptDrawer, IntroPopup } from '@speechly/react-ui'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SpeechProvider appId="98e16d5b-4e2f-4b76-8680-1b98959ddeee">
      <PushToTalkButton placement='bottom' powerOn="auto"></PushToTalkButton>
      <TranscriptDrawer></TranscriptDrawer>
      <IntroPopup></IntroPopup>
      <Component {...pageProps} />
    </SpeechProvider>
  )
}

export default MyApp
