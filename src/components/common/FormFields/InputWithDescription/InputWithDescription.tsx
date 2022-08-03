import { withJsonFormsControlProps } from '@jsonforms/react';
import { rankWith, ControlProps, JsonSchema, and, schemaMatches, uiTypeIs } from '@jsonforms/core';
import { Box, TextField } from '@material-ui/core';
import { ChangeEvent } from 'react';

type CustomProps = {
  description: string;
};

type JsonSchemaWithCustomProps = JsonSchema & CustomProps;

const InputWithDescriptionControl = ({ data, handleChange, path, ...props }: ControlProps) => {
  const schema = props.schema as JsonSchemaWithCustomProps;

  return (
    <Box display="flex">
      {schema.description}
      <TextField
        label={schema.title}
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
