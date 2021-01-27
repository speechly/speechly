import { SpeechSegment } from "@speechly/react-client";

class Analytics {
  private static LOG_ANALYTICS = process.env.NODE_ENV === "production";
  private static DEBUG_LOG_ANALYTICS = process.env.NODE_ENV !== "production";
  private static APP_NAME = "smart-home";
  private static APP_VERSION = 100; // Major * 100 + Minor

  public static trackLaunch(appParams: {}) {
    this.track("App launched", {
      appName: Analytics.APP_NAME,
      appVersion: Analytics.APP_VERSION,
      appParams
    });
  }

  public static trackInitialized(success: boolean, status: string) {
    this.track("Speechly initialized", {
      success,
      status,
      appName: Analytics.APP_NAME,
      appVersion: Analytics.APP_VERSION,
    });
  }

  public static trackIntent(
    effectiveIntent: string,
    segment: SpeechSegment,
    numChanges: number,
  ) {
    this.track("Intent", {
      intent: effectiveIntent,
      entities: segment.entities.map((entity) => ({
        type: entity.type,
        value: entity.value,
      })),
      numChanges,
      transcript: segment.words.map(word => word.value).join(' '),
    });
  }

  private static track(eventName: string, eventParams: {}) {
    if (Analytics.DEBUG_LOG_ANALYTICS) {
      console.log(`[ANALYTICS] ${eventName}`, eventParams);
    }
    if (Analytics.LOG_ANALYTICS) {
      const Segment = window.analytics;
      // window.analytics may be undefined at first load since we inject the prop inside Google Tag Manager
      if (Segment) Segment.track(eventName, eventParams);
    }
  }
}

export default Analytics;
