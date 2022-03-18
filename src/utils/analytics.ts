import isEqual from 'lodash.isequal';
import { FusebitProfile } from '@interfaces/auth0Token';
import { User } from '@interfaces/user';
import { PRODUCTION_HOST } from './constants';

type TrackEventHandler = (
  eventName: string,
  objectLocation: string,
  extraProperties?: { [key: string]: any },
  cb?: () => void
) => void;

let analyticsClient: SegmentAnalytics.AnalyticsJS;

const mockedAnalyticsClient = {
  identify: () => {},
  page: () => {},
  ready: (cb: () => void) => {
    cb();
  },
  reset: () => {},
  track: (event: any, opt: any, cb: () => void) => {
    cb();
  },
  user: null,
} as any;

const getFreshAnalyticsClient = (
  user?: User,
  issuedByAuth0?: boolean,
  allowUnauthenticated?: boolean
): SegmentAnalytics.AnalyticsJS => {
  // ad blocker workaround for Segment (if it is an array, it means ad blocker got in our way)
  const isAdBlockerEnabled = Array.isArray(analytics);
  if (isAdBlockerEnabled && !allowUnauthenticated) {
    return mockedAnalyticsClient;
  }

  // users that were not authenticated by Auth0 are not tracked
  if (!issuedByAuth0 && !allowUnauthenticated) {
    return mockedAnalyticsClient;
  }

  // if it is not prod, we can track everything
  const isProd = document.location.host === PRODUCTION_HOST;
  if (!isProd) {
    return analytics;
  }

  // if it is prod, we track only non-fusebit and non-litebox users
  const isExternalUser =
    !user || !user.email || (!user.email.endsWith('@fusebit.io') && !user.email.endsWith('@litebox.ai'));
  return isExternalUser || allowUnauthenticated ? analytics : mockedAnalyticsClient;
};

export const getAnalyticsClient = (
  user?: User,
  issuedByAuth0?: boolean,
  allowUnauthenticated?: boolean
): SegmentAnalytics.AnalyticsJS => {
  const searchParams = new URLSearchParams(window.location.search);
  const trackAnonymous = searchParams.get('trackAnonymous') === 'true';
  if (!analyticsClient || trackAnonymous) {
    analyticsClient = getFreshAnalyticsClient(user, issuedByAuth0, trackAnonymous || allowUnauthenticated);
  }
  return analyticsClient;
};

export const silentAuthInProgress = (): boolean => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get('silentAuth') === 'true';
};

// utility to memoize the original trackEventMemoized function to avoid noise
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

// original trackEventMemoized function that gets called to offload events to Segment
export const trackEventUnmemoized: TrackEventHandler = (
  eventName,
  objectLocation,
  extraProperties = {},
  cb = () => {}
) => {
  getAnalyticsClient().track(
    eventName,
    {
      objectLocation,
      domain: PRODUCTION_HOST,
      ...extraProperties,
    },
    cb
  );
};

const trackAnonymouseEventHandler: TrackEventHandler = (
  eventName,
  objectLocation,
  extraProperties = {},
  cb = () => {}
) => {
  getFreshAnalyticsClient(undefined, undefined, true).track(
    eventName,
    {
      objectLocation,
      domain: PRODUCTION_HOST,
      ...extraProperties,
    },
    cb
  );
};

// trackEventMemoized is memoized because React re-rendering process makes it get called multiple times for the same event
export const trackEventMemoized = memoize(trackEventUnmemoized);
export const trackAnonymouseEvent = memoize(trackAnonymouseEventHandler);

export const trackAuthEvent = (
  user: User,
  fusebitProfile: FusebitProfile | undefined,
  isSignUpEvent: boolean,
  cb = () => {}
) => {
  const segmentUser = getAnalyticsClient().user;
  if (!segmentUser || !fusebitProfile) {
    return cb();
  }
  const isSilentAuthInProgress = silentAuthInProgress();
  const currentSegmentUserId = segmentUser().id();
  const sameUser = fusebitProfile.userId === currentSegmentUserId;

  const extraSegmentEventProps: { userType: string; authType?: string } = isSignUpEvent
    ? { userType: 'new user' }
    : { userType: 'existing user' };

  if (isSignUpEvent) {
    extraSegmentEventProps.authType = 'sign up';
  } else if (sameUser && isSilentAuthInProgress) {
    extraSegmentEventProps.authType = 'silent';
  } else if (sameUser && !isSilentAuthInProgress) {
    extraSegmentEventProps.authType = 'dormant';
  } else if (!sameUser && !isSilentAuthInProgress) {
    extraSegmentEventProps.authType = 'new browser';
  } else if (!sameUser && isSilentAuthInProgress) {
    // eslint-disable-next-line no-console
    console.error('Segment has another user identified but silentAuth worked? Something is off.');
  }

  getAnalyticsClient().identify(fusebitProfile.userId, {
    ...fusebitProfile,
    ...user,
  } as Object);
  trackEventMemoized('Log In Execution', 'Authentication', extraSegmentEventProps, cb);
};
