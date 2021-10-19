import { JsonForms, JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { materialRenderers } from '@jsonforms/material-renderers';
import InputWithCopy, { inputWithCopyTester } from '../FormFields/InputWithCopy/InputWithCopy';

type Props = JsonFormsInitStateProps & JsonFormsReactProps;

const BaseJsonForm = (props: Omit<Props, 'renderers'>) => {
  return (
    <JsonForms
      {...props}
      renderers={[
        ...materialRenderers,
        {
          tester: inputWithCopyTester,
          renderer: InputWithCopy,
        },
      ]}
    />
  );
};

export default BaseJsonForm;
