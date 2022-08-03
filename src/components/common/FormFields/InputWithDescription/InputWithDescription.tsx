import { withJsonFormsControlProps } from '@jsonforms/react';
import { rankWith, ControlProps, JsonSchema, and, schemaMatches, uiTypeIs } from '@jsonforms/core';
import { Box, TextField } from '@material-ui/core';
import { ChangeEvent } from 'react';
import * as CSC from '@components/globalStyle';

type CustomProps = {
  description: string;
};

type JsonSchemaWithCustomProps = JsonSchema & CustomProps;

const InputWithDescriptionControl = ({ data, handleChange, path, ...props }: ControlProps) => {
  const schema = props.schema as JsonSchemaWithCustomProps;
  const label = `${schema.title ? schema.title : ''}${props.required ? '*' : ''}`;

  return (
    <Box display="flex">
      <CSC.StyledJSONFormsDescription>{schema.description}</CSC.StyledJSONFormsDescription>
      <TextField
        defaultValue={data}
        label={label}
        fullWidth
        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(path, e.target.value)}
      />
    </Box>
  );
};

export const InputWithDescriptionControlTester = rankWith(
  3,
  and(
    uiTypeIs('Control'),
    schemaMatches(
      (schema) =>
        !!(schema as { description?: string })?.description && (schema.type === 'string' || schema.type === 'integer')
    )
  )
);

export default withJsonFormsControlProps(InputWithDescriptionControl);
