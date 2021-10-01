import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import { TextFieldInputMixin } from '../../globalStyle';

export const MUITextField = styled(TextField)<{ fieldVariant: 'default' | 'modal'; hasError?: boolean }>`
  ${(props) =>
    props.fieldVariant === 'modal' &&
    `
  // estilos de Lu
    ${TextFieldInputMixin}
`}
`;
