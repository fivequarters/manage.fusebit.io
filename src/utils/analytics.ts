export function trackEvent(eventName: string, objectLocation: string) {
  analytics.track(eventName, {
    objectLocation,
    domain: 'manage.fusebit.io',
  });
}
