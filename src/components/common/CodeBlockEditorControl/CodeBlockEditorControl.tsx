import { withJsonFormsControlProps } from '@jsonforms/react';
import { rankWith, ControlProps, JsonSchema, and, uiTypeIs } from '@jsonforms/core';
import CodeBlockEditor from '../CodeBlockEditor/CodeBlockEditor';

type CustomProps = {
  isExpandable: boolean;
};

type JsonSchemaWithCustomProps = JsonSchema & CustomProps;

const CodeBlockEditorControl = ({ data, handleChange, path, ...props }: ControlProps) => {
  const schema = props.schema as JsonSchemaWithCustomProps;

  return (
    <CodeBlockEditor
      defaultValue={data}
      onChange={(value: string) => handleChange(path, value)}
      label={schema.title}
      isExpandable={schema.isExpandable}
    />
  );
};

export const CodeBlockEditorControlTester = rankWith(3, and(uiTypeIs('CodeBlock')));

export default withJsonFormsControlProps(CodeBlockEditorControl);
