import { JsonForms, JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import InputWithCopy, { inputWithCopyTester } from '@components/common/FormFields/InputWithCopy/InputWithCopy';
import { MonacoEditorControl } from '@fusebit/monaco-jsonforms';

type Props = JsonFormsInitStateProps & JsonFormsReactProps;

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
        MonacoEditorControl,
      ]}
    />
  );
};

export default BaseJsonForm;
