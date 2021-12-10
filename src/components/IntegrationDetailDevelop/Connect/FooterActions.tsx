import React from 'react';
import { Box, Button } from '@material-ui/core';
import { trackEvent } from '@utils/analytics';
import { Integration } from '@interfaces/integration';
import useSampleApp from '@hooks/useSampleApp';
import { StyledTimeIcon, StyledTimeDescription } from './mixins';

interface IProps {
  buttonsCrashing?: boolean;
  integration?: Integration;
  smallPhone: boolean;
}

const FooterActions: React.FC<IProps> = ({ buttonsCrashing, integration, smallPhone }) => {
  const { url } = useSampleApp();

  const getButtonSize = (() => {
    if (smallPhone && url) {
      return 'small';
    }

    if (buttonsCrashing) {
      return 'medium';
    }

    return 'large';
  })();

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" alignItems={!url && 'center'} justifyContent={!url && 'center'}>
        <Box display="flex" flexDirection="column">
          <Button
            style={{ width: buttonsCrashing ? 'fit-content' : '293px' }}
            target="_blank"
            rel="noopener"
            href="https://developer.fusebit.io/docs/connecting-fusebit-with-your-application"
            variant="outlined"
            color="primary"
            size={getButtonSize}
            onClick={() => {
              trackEvent('Backend Docs Follow Guide Button Clicked', 'My Application', {
                Integration: integration?.tags['fusebit.feedId'],
              });
            }}
          >
            Follow guide
          </Button>
          <Box display="flex" alignItems="center" justifyContent={!url && 'center'}>
            <StyledTimeIcon />
            <StyledTimeDescription>10 minutes</StyledTimeDescription>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FooterActions;
