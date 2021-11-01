import { TextareaAutosizeProps } from '@material-ui/core';
import React from 'react';
import { BaseFieldProps } from '@components/common/FormFields/types';
import * as SC from './styles';

type Props = TextareaAutosizeProps & BaseFieldProps;

const Textarea: React.FC<Props> = ({ fieldVariant = 'default', hasError, className, ...props }) => {
  return <SC.MUITextarea $fieldVariant={fieldVariant} $hasError={hasError} className={className} {...props} />;
};

export default Textarea;
