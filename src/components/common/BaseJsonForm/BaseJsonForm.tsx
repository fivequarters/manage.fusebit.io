import { JsonForms, JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import InputWithCopy, { inputWithCopyTester } from '@components/common/FormFields/InputWithCopy/InputWithCopy';
import { createAjv } from '@jsonforms/core';
import CodeBlockEditorControl, { CodeBlockEditorControlTester } from '../CodeBlockEditorControl/CodeBlockEditorControl';

type Props = JsonFormsInitStateProps & JsonFormsReactProps;
const ajv = createAjv({ allErrors: true, jsonPointers: false });
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('ajv-errors')(ajv);

const BaseJsonForm = (props: Omit<Props, 'renderers' | 'cells'>) => {
  return (
    <JsonForms
      {...props}
      ajv={ajv}
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
    />
  );
};

export default BaseJsonForm;
