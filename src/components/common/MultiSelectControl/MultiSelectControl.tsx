import { withJsonFormsControlProps } from '@jsonforms/react';
import { rankWith, scopeEndsWith, ControlProps, JsonSchema, and, schemaMatches } from '@jsonforms/core';
import { Option } from '@interfaces/multiSelect';
import MultiSelect from '../MultiSelect/MultiSelect';

type CustomProps = {
  defaultValues: Option[];
  allowArbitraryScopes: boolean;
};

type JsonSchemaWithCustomProps = JsonSchema & CustomProps;

const MultiSelectControl = ({ data, handleChange, path, ...props }: ControlProps) => {
  const schema = props.schema as JsonSchemaWithCustomProps;

  return (
    <MultiSelect
      placeholder="Bot Token Scopes*"
      defaultOptions={schema.defaultValues}
      allowArbitraryCreation={schema.allowArbitraryScopes}
      onChange={(values: string[]) => handleChange(path, values)}
    />
  );
};

export const MultiSelectControlTester = rankWith(
  3,
  and(
    scopeEndsWith('scope'),
    schemaMatches(
      (schema) => (schema as JsonSchemaWithCustomProps)?.defaultValues?.length > 0 && schema.type === 'object'
    )
  )
);

export default withJsonFormsControlProps(MultiSelectControl);
