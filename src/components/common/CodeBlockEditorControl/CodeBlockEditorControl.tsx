import { withJsonFormsControlProps } from '@jsonforms/react';
import { rankWith, ControlProps, JsonSchema, and, uiTypeIs } from '@jsonforms/core';
import CodeBlockEditor from '../CodeBlockEditor/CodeBlockEditor';

type CustomProps = {
  defaultValue: string;
};

type JsonSchemaWithCustomProps = JsonSchema & CustomProps;

const CodeBlockEditorControl = ({ data, handleChange, path, ...props }: ControlProps) => {
  const schema = props.schema as JsonSchemaWithCustomProps;

  return <CodeBlockEditor defaultValue={schema.defaultValue} onChange={(value: string) => handleChange(path, value)} />;
};

export const CodeBlockEditorControlTester = rankWith(3, and(uiTypeIs('CodeBlock')));

export default withJsonFormsControlProps(CodeBlockEditorControl);
