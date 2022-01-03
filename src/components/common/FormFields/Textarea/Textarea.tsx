import React from 'react';
import { TextareaAutosizeProps, TextareaAutosize } from '@mui/material';
import styled from 'styled-components';
import { inputBlueMixin, withError } from '@components/globalStyle';
import { BaseFieldProps } from '@components/common/FormFields/types';

const StyledMUITextarea = styled(TextareaAutosize)<{ $fieldVariant: 'default' | 'customBlue'; $hasError?: boolean }>`
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

type Props = TextareaAutosizeProps & BaseFieldProps;

const Textarea: React.FC<Props> = ({ fieldVariant = 'default', hasError, className, ...props }) => {
  return <StyledMUITextarea $fieldVariant={fieldVariant} $hasError={hasError} className={className} {...props} />;
};

export default Textarea;
