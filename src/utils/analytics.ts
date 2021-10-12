import isEqual from 'lodash.isequal';
import { isSegmentTrackingEvents } from './utils';

type TrackEventHandler = (eventName: string, objectLocation: string, extraProperties?: { [key: string]: any }) => void;

// utility to memoize the original trackEvent function to avoid noise
const memoize = (originalFunction: TrackEventHandler) => {
  let lastParamsUsed: any[];
  const memoizedFunction: TrackEventHandler = (...args) => {
    if (isEqual(lastParamsUsed, args)) {
      return;
    }
    lastParamsUsed = args;
    originalFunction(...args);
  };
  return memoizedFunction;
};

// original trackEvent function that gets called to offload events to Segment
const trackEventHandler: TrackEventHandler = (eventName, objectLocation, extraProperties = {}) => {
  if (!isSegmentTrackingEvents()) return;
  analytics.track(eventName, {
    objectLocation,
    domain: 'manage.fusebit.io',
    ...extraProperties,
  });
};

// trackEvent is memoized because React re-rendering process makes it get called multiple times for the same event
export const trackEvent = memoize(trackEventHandler);
