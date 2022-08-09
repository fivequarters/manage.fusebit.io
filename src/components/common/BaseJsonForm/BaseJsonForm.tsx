import { JsonForms, JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import InputWithCopy, { inputWithCopyTester } from '@components/common/FormFields/InputWithCopy/InputWithCopy';
import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import CodeBlockEditorControl, { CodeBlockEditorControlTester } from '../CodeBlockEditorControl/CodeBlockEditorControl';

type Props = JsonFormsInitStateProps & JsonFormsReactProps;
const ajv = new Ajv({ allErrors: true });
// Ajv option allErrors is required
ajvErrors(ajv);

const BaseJsonForm = (props: Omit<Props, 'renderers' | 'cells'>) => {
  return (
    <JsonForms
      {...props}
      cells={materialCells}
      renderers={[
        ...materialRenderers,
        {
          tester: inputWithCopyTester,
          renderer: InputWithCopy,
        },
        {
          tester: CodeBlockEditorControlTester,
          renderer: CodeBlockEditorControl,
        },
      ]}
      ajv={ajv}
    />
  );
};

export default BaseJsonForm;
