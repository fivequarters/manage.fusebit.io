import styled from 'styled-components';
import { TextareaAutosize } from '@material-ui/core';
import { inputBlueMixin, withError } from '../../../globalStyle';

export const MUITextarea = styled(TextareaAutosize)<{ $fieldVariant: 'default' | 'customBlue'; $hasError?: boolean }>`
  ${(props) =>
    props.$fieldVariant === 'customBlue' &&
    `
      padding: 16px !important;
      overflow-y: auto !important;
      font-family: courier !important;
      font-size: 16px !important;
      line-height: 18.5px !important;
      color: var(--black) !important;
      ${inputBlueMixin}
    `}
  ${withError}
`;
