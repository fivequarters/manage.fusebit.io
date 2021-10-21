import { Grid, useMediaQuery } from '@material-ui/core';
import styled, { css } from 'styled-components';
import ConnectorsCard from '../ConnectorsCard';
import EditorCard from '../EditorCard';
import YourAplication from '../YourAplicationCard';

const centerMixin = css<{ $matchesCardCollapsing: boolean }>`
  margin: 0 auto;
`;

const StyledYourApplicationCard = styled(YourAplication)<{ $matchesCardCollapsing: boolean }>`
  ${(props) => props.$matchesCardCollapsing && centerMixin};
`;

const StyledEditorCard = styled(EditorCard)<{ $matchesCardCollapsing: boolean }>`
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

const Diagram = () => {
  const matchesCardCollapsing = useMediaQuery('(max-width:1199px)');

  return (
    <Grid key="asd" container>
      <Grid item xs={matchesCardCollapsing ? 12 : 4}>
        <StyledYourApplicationCard $matchesCardCollapsing={matchesCardCollapsing} />
      </Grid>
      <Grid item xs={matchesCardCollapsing ? 12 : 4}>
        <StyledEditorCard name="integration" $matchesCardCollapsing={matchesCardCollapsing} />
      </Grid>
      <Grid item xs={matchesCardCollapsing ? 12 : 4}>
        <StyledConnectorsCard $matchesCardCollapsing={matchesCardCollapsing} />
      </Grid>
    </Grid>
  );
};

export default Diagram;
