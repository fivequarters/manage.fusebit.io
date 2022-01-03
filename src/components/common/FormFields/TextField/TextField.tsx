import React from 'react';
import { TextFieldProps, TextField as MuiTextField } from '@mui/material';
import styled from 'styled-components';
import { inputBlueMixin, withError } from '@components/globalStyle';
import { BaseFieldProps } from '@components/common/FormFields/types';

const StyledMUITextField = styled(MuiTextField)<{ $fieldVariant: 'default' | 'customBlue'; $hasError?: boolean }>`
  ${(props) =>
    props.$fieldVariant === 'customBlue' &&
    `
        ${inputBlueMixin}
    `}
  ${withError}
`;

type Props = TextFieldProps & BaseFieldProps;

const TextField: React.FC<Props> = ({ fieldVariant = 'default', hasError, ...props }) => {
  return <StyledMUITextField $fieldVariant={fieldVariant} $hasError={hasError} {...props} />;
};

export default TextField;
