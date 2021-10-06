import { TextareaAutosizeProps } from '@material-ui/core';
import React from 'react';
import * as SC from './styles';
import { BaseFieldProps } from '../types';

type Props = TextareaAutosizeProps & BaseFieldProps;

const Textarea: React.FC<Props> = ({ fieldVariant = 'default', hasError, ...props }) => {
  return <SC.MUITextarea $fieldVariant={fieldVariant} $hasError={hasError} {...props} />;
};

export default Textarea;
