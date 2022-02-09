import { useEffect } from 'react';
import { getAnalyticsClient } from '@utils/analytics';
import { PRODUCTION_HOST } from '@utils/constants';

export function useTrackPage(pageName: string, objectLocation: String, properties?: { [key: string]: string }) {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trackAnonymous = urlParams.get('trackAnonymous') === 'true';
    getAnalyticsClient(undefined, false, trackAnonymous).page(pageName, {
      objectLocation,
      domain: PRODUCTION_HOST,
      ...properties,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageName, objectLocation]);
}

export function useTrackUnauthenticatedPage(
  pageName: string,
  objectLocation: String,
  properties?: { [key: string]: string }
) {
  useEffect(() => {
    getAnalyticsClient(undefined, false, true).page(pageName, {
      objectLocation,
      domain: PRODUCTION_HOST,
      ...properties,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageName, objectLocation]);
}
