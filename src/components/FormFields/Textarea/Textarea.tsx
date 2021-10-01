import { TextareaAutosizeProps } from '@material-ui/core';
import React from 'react';
import * as SC from './styles';

interface FieldVariant {
  fieldVariant: 'default' | 'customBlue';
  hasError?: boolean;
}

type Props = TextareaAutosizeProps & FieldVariant;

const Textarea: React.FC<Props> = ({ fieldVariant, hasError, ...props }) => {
  return <SC.MUITextarea fieldVariant={fieldVariant} hasError={hasError} {...props} />;
};

export default Textarea;
