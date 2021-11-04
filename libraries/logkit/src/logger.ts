import { SpeechSegment } from '@speechly/react-client'

class Logger {
  private static LOG_ANALYTICS = process.env.NODE_ENV === 'production';
  private static DEBUG_LOG_ANALYTICS = process.env.NODE_ENV !== 'production';
  private static GA_CATEGORY = 'category'
  private static GA_LABEL = 'label'
  private static GA_VALUE = 'value'

  // For app version, use Major * 100 + Minor in two digits: v1.12 would become 112
  public static trackLaunch(appName: string, appVersion: number, appParams: any): void {
    this.log('App launched', {
      appName,
      appVersion,
      appParams,
      [Logger.GA_CATEGORY]: appName,
    })

    this.identify(`${appName} user`)
  }

  public static trackStarting(appName: string, appVersion: number): void {
    this.log('Speechly starting', {
      appName,
      appVersion,
      [Logger.GA_CATEGORY]: appName,
    })
  }


  public static trackInitialized(
    success: boolean,
    status: string,
    appName: string,
    appVersion: number,
  ): void {
    this.log('Speechly initialized', {
      success,
      status,
      appName,
      appVersion,
      [Logger.GA_CATEGORY]: appName,
      [Logger.GA_LABEL]: status,
      [Logger.GA_VALUE]: success ? 1 : 0,
    })
  }

  public static trackIntent(
    segment: SpeechSegment,
    appName: string,
    appVersion: number,
    numChanges: number | undefined = undefined,
  ): void {
    const transcript = segment.words.map(word => word.value).join(' ').trim()

    this.log('Intent', {
      intent: segment.intent.intent,
      entities: segment.entities.map((entity) => ({
        type: entity.type,
        value: entity.value,
      })),
      transcript,
      numEntities: segment.entities.length, // A proxy of whether an utterance did anything
      numChanges: numChanges || segment.entities.length,  // A more accurate representation of state changes, if provided by the app programmer
      appName,
      appVersion,
      [Logger.GA_CATEGORY]: appName,
      [Logger.GA_LABEL]: [`*${segment.intent.intent}`, ...segment.entities.map(entity => `${entity.value}(${entity.type})`)].join(' '),
      [Logger.GA_VALUE]: numChanges || segment.entities.length,
    })
  }

  public static identify(uid: string): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const LogRocket = (window as any).LogRocket

    if (LogRocket) {
      LogRocket.identify(uid)
    }
  }

  public static log(eventName: string, eventParams: any): void {
    if (Logger.DEBUG_LOG_ANALYTICS) {
      console.log(`[LogKit] ${eventName}`, eventParams)
    }
    if (Logger.LOG_ANALYTICS) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Segment = (window as any).analytics
      // window.analytics may be undefined at first load since we inject the prop inside Google Tag Manager
      if (Segment) Segment.track(eventName, eventParams)
    }
  }
}

export default Logger
