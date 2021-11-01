import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import { inputBlueMixin, withError } from '@components/globalStyle';

export const MUITextField = styled(TextField)<{ $fieldVariant: 'default' | 'customBlue'; $hasError?: boolean }>`
  ${(props) =>
    props.$fieldVariant === 'customBlue' &&
    `
        ${inputBlueMixin}
    `}
  ${withError}
`;
