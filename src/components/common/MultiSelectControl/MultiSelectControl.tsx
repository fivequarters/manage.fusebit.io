import { withJsonFormsControlProps } from '@jsonforms/react';
import { rankWith, ControlProps, JsonSchema, and, schemaMatches, uiTypeIs } from '@jsonforms/core';
import { Option } from '@interfaces/multiSelect';
import { Box } from '@material-ui/core';
import * as CSC from '@components/globalStyle';
import MultiSelect from '../MultiSelect/MultiSelect';

type CustomProps = {
  defaultValues: Option[];
  allowArbitraryScopes: boolean;
  description?: string;
};

type JsonSchemaWithCustomProps = JsonSchema & CustomProps;

const MultiSelectControl = ({ data, handleChange, path, ...props }: ControlProps) => {
  const schema = props.schema as JsonSchemaWithCustomProps;

  return (
    <>
      {schema.description ? (
        <Box display="flex">
          <CSC.StyledJSONFormsDescription>{schema.description}</CSC.StyledJSONFormsDescription>
          <Box display="flex" flexDirection="column" mt="4px">
            <MultiSelect
              placeholder={`${schema.title}${props.required && '*'}`}
              defaultOptions={schema.defaultValues}
              allowArbitraryCreation={schema.allowArbitraryScopes}
              onChange={(values: string[]) => handleChange(path, values)}
            />
          </Box>
        </Box>
      ) : (
        <MultiSelect
          placeholder={`${schema.title}${props.required && '*'}`}
          defaultOptions={schema.defaultValues}
          allowArbitraryCreation={schema.allowArbitraryScopes}
          onChange={(values: string[]) => handleChange(path, values)}
        />
      )}
    </>
  );
};

export const MultiSelectControlTester = rankWith(
  3,
  and(
    uiTypeIs('MultiControl'),
    schemaMatches(
      (schema) => (schema as JsonSchemaWithCustomProps)?.defaultValues?.length > 0 && schema.type === 'object'
    )
  )
);

export default withJsonFormsControlProps(MultiSelectControl);
