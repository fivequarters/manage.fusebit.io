import { MaterialInputControl, MaterialTextCell, MaterialIntegerCell } from '@jsonforms/material-renderers';
import { ControlProps, schemaMatches, rankWith, and, uiTypeIs, RankedTester } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Box, IconButton } from '@material-ui/core';
import styled from 'styled-components';
import { useCopy } from '@hooks/useCopy';
import copyIcon from '@assets/copy.svg';

const StyledCopySuccess = styled.p<{ copy: boolean }>`
  position: absolute;
  right: 0;
  bottom: -35px;
  font-size: 14px;
  line-height: 16px;
  color: var(--grey);
  opacity: ${(props) => (props.copy ? 1 : 0)};
  visibility: ${(props) => (props.copy ? 'visible' : 'hidden')};
  margin-left: auto;
  transition: all 0.5s linear;
`;

const CustomInputCell = (props: ControlProps) => {
  const { handleCopy, copiedLine } = useCopy();
  const {
    schema: { type },
  } = props;

  return (
    <Box position="relative" display="flex" alignItems="center" mt="16px">
      {
        {
          string: <MaterialTextCell {...props} />,
          integer: <MaterialIntegerCell {...props} />,
        }[type as 'string' | 'integer']
      }
      <Box ml="5px" width="auto !important">
        <IconButton onClick={() => handleCopy(props.data)} size="small">
          <img src={copyIcon} alt="Copy Button" />
        </IconButton>
      </Box>
      <StyledCopySuccess copy={copiedLine}>Copied to clipboard!</StyledCopySuccess>
    </Box>
  );
};

const InputWithCopy = (props: ControlProps) => {
  return <MaterialInputControl {...props} input={CustomInputCell} />;
};

export const inputWithCopyTester: RankedTester = rankWith(
  3,
  and(
    uiTypeIs('Control'),
    schemaMatches(
      (schema) =>
        (schema as { copy?: boolean })?.copy === true && (schema.type === 'string' || schema.type === 'integer')
    )
  )
);

export default withJsonFormsControlProps(InputWithCopy);
