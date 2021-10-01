import { TextFieldProps } from '@material-ui/core';
import React from 'react';
import * as SC from './styles';

interface FieldVariant {
  fieldVariant: 'default' | 'customBlue';
  hasError?: boolean;
}

type Props = TextFieldProps & FieldVariant;

const TextField: React.FC<Props> = ({ fieldVariant, hasError, ...props }) => {
  return <SC.MUITextField fieldVariant={fieldVariant} hasError={hasError} {...props} />;
};

export default TextField;
