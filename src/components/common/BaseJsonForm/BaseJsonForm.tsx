import { JsonForms, JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import InputWithCopy, { inputWithCopyTester } from '@components/common/FormFields/InputWithCopy/InputWithCopy';
import InputWithDescription, {
  InputWithDescriptionControlTester,
} from '@components/common/FormFields/InputWithDescription/InputWithDescription';
import { MonacoEditorControl } from '@fusebit/monaco-jsonforms';
import MultiSelectControl, { MultiSelectControlTester } from '../MultiSelectControl/MultiSelectControl';

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
        {
          tester: MultiSelectControlTester,
          renderer: MultiSelectControl,
        },
        {
          tester: InputWithDescriptionControlTester,
          renderer: InputWithDescription,
        },
        MonacoEditorControl,
      ]}
    />
  );
};

export default BaseJsonForm;
