import { SpeechSegment } from '@speechly/react-client'

class Logger {
  private static FORCE_LOG_PRINT = false // process.env.NODE_ENV !== 'production';
  private static GA_CATEGORY = 'category'
  private static GA_LABEL = 'label'
  private static GA_VALUE = 'value'
  private static printLog = false

  public static setLogging(value: boolean) {
    Logger.printLog = value
  }

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
    const CustomIdentifyHook = (window as any).CustomIdentifyHook
    if (CustomIdentifyHook) CustomIdentifyHook(uid)
  }

  public static log(eventName: string, eventParams: any): void {
    if (Logger.FORCE_LOG_PRINT || Logger.printLog) {
      console.log(`[LogKit] ${eventName}`, eventParams)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomLogHook = (window as any).CustomLogHook
    if (CustomLogHook) CustomLogHook(eventName, eventParams)
  }
}

export default Logger
