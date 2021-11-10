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
    color: var(--black);
    text-align: center;
  }
`;

export const Content = styled(DialogContent)`
  padding: 40px;
  padding-top: 24px;
  width: 100%;
`;
