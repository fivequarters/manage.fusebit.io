import { useState } from 'react';
import styled from 'styled-components';
import useSampleApp from '@hooks/useSampleApp';
import { useGetIntegrationFromCache } from '@hooks/useGetIntegrationFromCache';
import { trackEventMemoized } from '@utils/analytics';
import NoSampleAppModal from '../NoSampleAppModal';

const StyledSampleApp = styled.a`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  text-decoration: underline;
  margin-right: 10px;
  cursor: pointer;
`;

export const EditGuiSampleApp = () => {
  const { url } = useSampleApp();
  const [noSampleAppOpen, setNoSampleAppOpen] = useState(false);
  const integrationData = useGetIntegrationFromCache();

  const handleClick = () => {
    if (url) {
      trackEventMemoized('Sample App Clicked', 'Web Editor', {
        Integration: integrationData?.data?.tags['fusebit.feedId'],
      });
      window.open(url, '_blank', 'noreferrer');
    } else {
      setNoSampleAppOpen(true);
    }
  };

  return (
    <>
      <StyledSampleApp onClick={handleClick}>Run a Sample App</StyledSampleApp>
      <NoSampleAppModal open={noSampleAppOpen} onClose={() => setNoSampleAppOpen(false)} />
    </>
  );
};
