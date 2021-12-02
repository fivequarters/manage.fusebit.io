import React from 'react';
import { Box, Button } from '@material-ui/core';
import { trackEvent } from '@utils/analytics';
import { Integration } from '@interfaces/integration';
import useSampleApp from '@hooks/useSampleApp';
import { StyledTimeIcon, StyledTimeDescription } from './mixins';

interface IProps {
  id?: string;
  buttonsCrashing?: boolean;
  buttonsSize?: 'small' | 'medium' | 'large';
  integration?: Integration;
  timeDescriptionWidth: string;
  smallPhone: boolean;
}

const openSampleApp = (url: string, integration?: Integration) => {
  trackEvent('Run Sample App Button Clicked', 'My Application', { Integration: integration?.tags['fusebit.feedId'] });
  const sampleAppTab = window.open() as Window;
  sampleAppTab.opener = null;
  sampleAppTab.location.href = url;
  sampleAppTab.focus();
};

export const LinkSampleApp: React.FC<IProps> = ({
  buttonsCrashing,
  buttonsSize,
  integration,
  timeDescriptionWidth,
  smallPhone,
}) => {
  const { url } = useSampleApp();

  return url ? (
    <>
      <Box display="flex" margin={smallPhone ? '5px auto auto' : '10.5px auto auto'}>
        or
      </Box>
      <Box display="flex" flexDirection="column">
        <Button
          style={{ width: buttonsCrashing ? 'fit-content' : '293px' }}
          onClick={() => {
            openSampleApp(url, integration);
          }}
          variant="outlined"
          color="primary"
          size={buttonsSize || 'large'}
        >
          Run a Sample App!
        </Button>
        <Box display="flex" flexDirection="column" alignItems="left" justifyContent="left">
          <Box display="flex" alignItems="center">
            <StyledTimeIcon />
            <StyledTimeDescription>2 minutes.</StyledTimeDescription>
          </Box>
          <Box maxWidth={timeDescriptionWidth}>
            <StyledTimeDescription margin="0">Already configured to work with this integration</StyledTimeDescription>
          </Box>
        </Box>
      </Box>
    </>
  ) : (
    <></>
  );
};
