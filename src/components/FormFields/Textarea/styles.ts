import styled, { css } from 'styled-components';
import { TextareaAutosize } from '@material-ui/core';
import { InputMixin } from '../../globalStyle';

const customBlue = css`
  height: 173px !important;
  padding: 16px !important;
`;

export const MUITextarea = styled(TextareaAutosize)<{ fieldVariant: 'default' | 'customBlue'; hasError?: boolean }>`
  ${(props) =>
    props.fieldVariant === 'customBlue' &&
    `
        ${customBlue}
        ${InputMixin}
    `}
`;
