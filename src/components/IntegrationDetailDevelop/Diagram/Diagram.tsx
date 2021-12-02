import { useState } from 'react';
import { Box, Grid, useMediaQuery } from '@material-ui/core';
import styled, { css } from 'styled-components';
import { Xwrapper } from 'react-xarrows';
import Loader from '@components/common/Loader';
import ConnectorsCard from '@components/IntegrationDetailDevelop/ConnectorsCard';
import { CARD_OVERLAPPING_MEDIA_QUERY } from '@components/IntegrationDetailDevelop/constants';
import FooterLinks from '@components/IntegrationDetailDevelop/FooterLinks';
import IntegrationCard from '@components/IntegrationDetailDevelop/IntegrationCard';
import LinksTitle from '@components/IntegrationDetailDevelop/LinksTitle';
import YourAplication from '@components/IntegrationDetailDevelop/YourAplicationCard';
import { Integration } from '@interfaces/integration';

const centerMixin = (props: { $matchesCardOverlapping: boolean }) =>
  props.$matchesCardOverlapping &&
  css<{ $matchesCardOverlapping: boolean }>`
    margin: 0 auto;
  `;

const StyledYourApplicationCard = styled(YourAplication)<{ $matchesCardOverlapping: boolean }>`
  ${centerMixin};
`;

const StyledIntegrationCard = styled(IntegrationCard)<{ $matchesCardOverlapping: boolean }>`
  margin-top: 49px;
  ${(props) =>
    props.$matchesCardOverlapping &&
    css`
      margin: 68px auto 68px;
    `};
`;

const StyledConnectorsCard = styled(ConnectorsCard)<{ $matchesCardOverlapping: boolean }>`
  margin-left: auto;
  ${centerMixin};
`;

interface Props {
  isLoading: boolean;
  integration?: Integration;
}

const Diagram: React.FC<Props> = ({ isLoading, integration }) => {
  const [processing, setProcessing] = useState(false);
  const matchesCardOverlapping = useMediaQuery(CARD_OVERLAPPING_MEDIA_QUERY);

  return (
    <Xwrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          <Grid container>
            <Grid item xs={matchesCardOverlapping ? 12 : 4}>
              <StyledYourApplicationCard $matchesCardOverlapping={matchesCardOverlapping} />
            </Grid>
            <Grid item xs={matchesCardOverlapping ? 12 : 4}>
              <StyledIntegrationCard
                processing={processing}
                setProcessing={setProcessing}
                $matchesCardOverlapping={matchesCardOverlapping}
              />
            </Grid>
            <Grid item xs={matchesCardOverlapping ? 12 : 4}>
              <StyledConnectorsCard processing={processing} $matchesCardOverlapping={matchesCardOverlapping} />
            </Grid>
          </Grid>
          {matchesCardOverlapping ? (
            <Box display="flex" flexDirection="column" maxWidth="389px" m="0 auto">
              <LinksTitle />
              <FooterLinks
                links={['connectingFusebit', 'gettingStarted', 'programmingModel']}
                integration={integration}
              />
            </Box>
          ) : (
            <Grid container>
              <Grid item xs={4}>
                <Box display="flex" flexDirection="column">
                  <LinksTitle />
                  <FooterLinks links={['connectingFusebit']} integration={integration} />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display="flex" flexDirection="column" width="285px" m="0 auto">
                  <LinksTitle />
                  <FooterLinks links={['gettingStarted', 'programmingModel']} integration={integration} />
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </Xwrapper>
  );
};

export default Diagram;
