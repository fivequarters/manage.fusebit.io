import React from 'react';
import { Box, Button } from '@material-ui/core';
import useSampleApp from '@hooks/useSampleApp';
import { StyledTimeDescription, StyledTimeIcon } from './mixins';

interface IProps {
  id?: string;
  buttonsCrashing?: boolean;
  buttonsSize?: 'small' | 'medium' | 'large';
  smallPhone: boolean;
  timeDescriptionWidth: string;
}

export const LinkSampleApp: React.FC<IProps> = ({ buttonsCrashing, buttonsSize, smallPhone, timeDescriptionWidth }) => {
  const { url } = useSampleApp();

  return url ? (
    <>
      <Box display="flex" margin={smallPhone ? '5px auto auto' : '10.5px auto auto'}>
        or
      </Box>
      <Box display="flex" flexDirection="column">
        <Button
          style={{ width: buttonsCrashing ? 'fit-content' : '293px' }}
          target="_blank"
          rel="noopener"
          href={url}
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
  ) : null;
};
