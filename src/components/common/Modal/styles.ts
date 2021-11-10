import { DialogContent, DialogTitle, IconButton } from '@material-ui/core';
import styled from 'styled-components';

export const CloseWrapper = styled(IconButton)`
  position: absolute;
  right: 16px;
  top: 16px;
  color: var(--black);
`;

export const Title = styled(DialogTitle)`
  padding-top: 64px;

  > h2 {
    font-size: 24px;
    line-height: 30px;
    font-weight: 600;
    max-width: 350px;
    margin: 0 auto;
    color: var(--black);
    text-align: center;
  }
`;

export const Content = styled(DialogContent)<{ hasPadding?: boolean }>`
  padding: ${(props) => props.hasPadding && '24px 40px 40px'};
  width: 100%;
`;
