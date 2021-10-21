import { Grid, useMediaQuery } from '@material-ui/core';
import styled, { css } from 'styled-components';
import ConnectorsCard from '../ConnectorsCard';
import EditorCard from '../EditorCard';
import YourAplication from '../YourAplicationCard';

const centerMixin = css<{ $isMobile: boolean }>`
  margin: 0 auto;
`;

const StyledYourApplicationCard = styled(YourAplication)<{ $isMobile: boolean }>`
  ${(props) => props.$isMobile && centerMixin};
`;

const StyledEditorCard = styled(EditorCard)<{ $isMobile: boolean }>`
  margin-top: 49px;
  ${(props) =>
    props.$isMobile &&
    css`
      margin: 68px auto 68px;
    `};
`;

const StyledConnectorsCard = styled(ConnectorsCard)<{ $isMobile: boolean }>`
  margin-left: auto;
  ${(props) => props.$isMobile && centerMixin};
`;

const Diagram = () => {
  const isMobile = useMediaQuery('(max-width:1199px)');

  return (
    <Grid key="asd" container>
      <Grid item xs={isMobile ? 12 : 4}>
        <StyledYourApplicationCard $isMobile={isMobile} />
      </Grid>
      <Grid item xs={isMobile ? 12 : 4}>
        <StyledEditorCard name="integration" $isMobile={isMobile} />
      </Grid>
      <Grid item xs={isMobile ? 12 : 4}>
        <StyledConnectorsCard $isMobile={isMobile} />
      </Grid>
    </Grid>
  );
};

export default Diagram;
