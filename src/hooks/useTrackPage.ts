import { useEffect } from 'react';
import { getAnalyticsClient } from '@utils/analytics';
import { PRODUCTION_HOST } from '@utils/constants';

export function useTrackPage(pageName: string, objectLocation: String, properties?: { [key: string]: string }) {
  useEffect(() => {
    getAnalyticsClient().page(pageName, { objectLocation, domain: PRODUCTION_HOST, ...properties });
  }, [pageName, objectLocation, properties]);
}
