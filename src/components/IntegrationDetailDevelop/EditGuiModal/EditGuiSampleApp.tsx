import { useState } from 'react';
import styled from 'styled-components';
import useSampleApp from '@hooks/useSampleApp';
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

  const handleClick = () => {
    if (url) {
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
