import { TextFieldProps } from '@material-ui/core';
import React from 'react';
import * as SC from './styles';
import { BaseFieldProps } from '../../../interfaces/baseFieldProps';

type Props = TextFieldProps & BaseFieldProps;

const TextField: React.FC<Props> = ({ fieldVariant = 'default', hasError, ...props }) => {
  return <SC.MUITextField $fieldVariant={fieldVariant} $hasError={hasError} {...props} />;
};

export default TextField;
