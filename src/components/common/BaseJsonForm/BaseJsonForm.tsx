import { JsonForms, JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import InputWithCopy, { inputWithCopyTester } from '@components/common/FormFields/InputWithCopy/InputWithCopy';
import InputWithDescription, {
  InputWithDescriptionControlTester,
} from '@components/common/FormFields/InputWithDescription/InputWithDescription';
import { createAjv } from '@jsonforms/core';
import { MonacoEditorControl } from '@fusebit/monaco-jsonforms';
import MultiSelectControl, { MultiSelectControlTester } from '../MultiSelectControl/MultiSelectControl';

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
