import { Grid, useMediaQuery } from '@material-ui/core';
import styled, { css } from 'styled-components';
import Loader from '../../common/Loader';
import ConnectorsCard from '../ConnectorsCard';
import { CARD_OVERLAPPING_MEDIA_QUERY } from '../constants';
import IntegrationCard from '../IntegrationCard';
import YourAplication from '../YourAplicationCard';

const centerMixin = css<{ $matchesCardOverlapping: boolean }>`
  margin: 0 auto;
`;

const StyledYourApplicationCard = styled(YourAplication)<{ $matchesCardOverlapping: boolean }>`
  ${(props) => props.$matchesCardOverlapping && centerMixin};
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
  ${(props) => props.$matchesCardOverlapping && centerMixin};
`;

interface Props {
  isLoading: boolean;
}

const Diagram: React.FC<Props> = ({ isLoading }) => {
  const matchesCardOverlapping = useMediaQuery(CARD_OVERLAPPING_MEDIA_QUERY);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Grid container>
          <Grid item xs={matchesCardOverlapping ? 12 : 4}>
            <StyledYourApplicationCard $matchesCardOverlapping={matchesCardOverlapping} />
          </Grid>
          <Grid item xs={matchesCardOverlapping ? 12 : 4}>
            <StyledIntegrationCard $matchesCardOverlapping={matchesCardOverlapping} />
          </Grid>
          <Grid item xs={matchesCardOverlapping ? 12 : 4}>
            <StyledConnectorsCard $matchesCardOverlapping={matchesCardOverlapping} />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Diagram;
