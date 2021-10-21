import { Grid, useMediaQuery } from '@material-ui/core';
import styled, { css } from 'styled-components';
import Loader from '../../common/Loader';
import ConnectorsCard from '../ConnectorsCard';
import IntegrationCard from '../IntegrationCard';
import YourAplication from '../YourAplicationCard';

const centerMixin = css<{ $matchesCardCollapsing: boolean }>`
  margin: 0 auto;
`;

const StyledYourApplicationCard = styled(YourAplication)<{ $matchesCardCollapsing: boolean }>`
  ${(props) => props.$matchesCardCollapsing && centerMixin};
`;

const StyledIntegrationCard = styled(IntegrationCard)<{ $matchesCardCollapsing: boolean }>`
  margin-top: 49px;
  ${(props) =>
    props.$matchesCardCollapsing &&
    css`
      margin: 68px auto 68px;
    `};
`;

const StyledConnectorsCard = styled(ConnectorsCard)<{ $matchesCardCollapsing: boolean }>`
  margin-left: auto;
  ${(props) => props.$matchesCardCollapsing && centerMixin};
`;

interface Props {
  isLoading: boolean;
}

const Diagram: React.FC<Props> = ({ isLoading }) => {
  const matchesCardCollapsing = useMediaQuery('(max-width:1199px)');

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Grid key="asd" container>
          <Grid item xs={matchesCardCollapsing ? 12 : 4}>
            <StyledYourApplicationCard $matchesCardCollapsing={matchesCardCollapsing} />
          </Grid>
          <Grid item xs={matchesCardCollapsing ? 12 : 4}>
            <StyledIntegrationCard name="integration" $matchesCardCollapsing={matchesCardCollapsing} />
          </Grid>
          <Grid item xs={matchesCardCollapsing ? 12 : 4}>
            <StyledConnectorsCard $matchesCardCollapsing={matchesCardCollapsing} />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Diagram;
