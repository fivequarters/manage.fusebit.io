import { MaterialInputControl, MaterialTextCell, MaterialIntegerCell } from '@jsonforms/material-renderers';
import { ControlProps, schemaMatches, rankWith, and, uiTypeIs, RankedTester } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Box, IconButton } from '@material-ui/core';
import { useCopy } from '../../../../hooks/useCopy';
import copyIcon from '../../../../assets/copy.svg';

const CustomInputCell = (props: ControlProps) => {
  const { handleCopy } = useCopy();
  const {
    schema: { type },
  } = props;

  return (
    <Box display="flex" alignItems="center" mt="16px">
      {
        {
          string: <MaterialTextCell {...props} />,
          integer: <MaterialIntegerCell {...props} />,
        }[type as 'string' | 'integer']
      }
      <Box ml="5px">
        <IconButton onClick={() => handleCopy(props.data)} size="small">
          <img src={copyIcon} alt="Copy Button" />
        </IconButton>
      </Box>
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
