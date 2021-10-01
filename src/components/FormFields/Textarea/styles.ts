import styled from 'styled-components';
import { TextareaAutosize } from '@material-ui/core';
import { TextareaInputMixin } from '../../globalStyle';

export const MUITextarea = styled(TextareaAutosize)<{ fieldVariant: 'default' | 'modal'; hasError?: boolean }>`
  ${(props) =>
    props.fieldVariant === 'modal' &&
    `
        ${TextareaInputMixin}
    `}
`;
