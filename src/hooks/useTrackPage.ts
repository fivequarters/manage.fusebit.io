import { useEffect } from 'react';
import { getAnalyticsClient, isSegmentTrackingEvents } from '../utils/analytics';
import { PRODUCTION_HOST } from '../utils/constants';

export function useTrackPage(pageName: string, objectLocation: String) {
  useEffect(() => {
    if (!isSegmentTrackingEvents()) return;
    getAnalyticsClient().page(pageName, { objectLocation, domain: PRODUCTION_HOST });
  }, [pageName, objectLocation]);
}
