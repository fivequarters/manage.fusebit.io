export function trackEvent(eventName: string, objectLocation: string, extraProperties: { [key: string]: any } = {}) {
  analytics.track(eventName, {
    objectLocation,
    domain: 'manage.fusebit.io',
    ...extraProperties,
  });
}
