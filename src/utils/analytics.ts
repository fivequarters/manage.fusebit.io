import isEqual from 'lodash.isequal';
import { silentAuthInProgress } from '../hooks/useAuthContext';
import { FusebitProfile } from '../interfaces/auth0Token';
import { User } from '../interfaces/user';
import { PRODUCTION_HOST } from './constants';

type TrackEventHandler = (
  eventName: string,
  objectLocation: string,
  extraProperties?: { [key: string]: any },
  cb?: () => void
) => void;

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

export function isSegmentTrackingEvents() {
  if (!analytics.user) {
    return false;
  }
  const user = (analytics.user()?.traits() as unknown) as User;
  return (
    document.location.host !== PRODUCTION_HOST ||
    (!user?.primaryEmail?.endsWith('@fusebit.io') && !user?.primaryEmail?.endsWith('@litebox.ai'))
  );
}

// original trackEvent function that gets called to offload events to Segment
const trackEventHandler: TrackEventHandler = (eventName, objectLocation, extraProperties = {}, cb = () => {}) => {
  if (!isSegmentTrackingEvents()) return;
  analytics.track(
    eventName,
    {
      objectLocation,
      domain: PRODUCTION_HOST,
      ...extraProperties,
    },
    cb
  );
};

// trackEvent is memoized because React re-rendering process makes it get called multiple times for the same event
export const trackEvent = memoize(trackEventHandler);

export const trackAuthEvent = (user: User, fusebitProfile: FusebitProfile, isSignUpEvent: boolean) => {
  const isSilentAuthInProgress = silentAuthInProgress();
  const currentSegmentUserId = analytics.user().id();
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

  analytics.identify(fusebitProfile.userId, {
    ...user,
  } as Object);
  trackEvent('Log In Execution', 'Authentication', extraSegmentEventProps);
};
