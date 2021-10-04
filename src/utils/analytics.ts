import isEqual from 'lodash.isequal';

type TrackEventHandler = (eventName: string, objectLocation: string, extraProperties?: { [key: string]: any }) => void;

const memoize = (originalFunction: TrackEventHandler) => {
  let lastParamsUsed: { [key: string]: any };
  const memoizedFunction: TrackEventHandler = (...args) => {
    if (isEqual(lastParamsUsed, args)) return;
    lastParamsUsed = args;
    originalFunction(...args);
  };
  return memoizedFunction;
};

const trackEventHandler: TrackEventHandler = (eventName, objectLocation, extraProperties = {}) => {
  analytics.track(eventName, {
    objectLocation,
    domain: 'manage.fusebit.io',
    ...extraProperties,
  });
};

export const trackEvent = memoize(trackEventHandler);
