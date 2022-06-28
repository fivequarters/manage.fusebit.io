import { withJsonFormsControlProps } from '@jsonforms/react';
import { rankWith, scopeEndsWith, ControlProps, JsonSchema } from '@jsonforms/core';
import { Option } from '@interfaces/multiSelect';
import MultiSelect from '../MultiSelect/MultiSelect';

type JsonSchemaWithCustomProps = JsonSchema & { defaultValues: Option[]; allowArbitraryScopes: boolean };

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

export const MultiSelectControlTester = rankWith(3, scopeEndsWith('scope'));

export default withJsonFormsControlProps(MultiSelectControl);
