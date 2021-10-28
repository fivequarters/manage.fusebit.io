import { ValidationMode } from '@jsonforms/core';
import { Box } from '@material-ui/core';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ParsedFeed } from '../../../interfaces/feed';
import { urlOrSvgToImage } from '../../../utils/utils';
import BaseJsonForm from '../BaseJsonForm';

interface Props {
  entity?: ParsedFeed;
  data: any;
  onChange: (payload: { errors: any; data: any }) => void;
  validationMode: ValidationMode;
}

const FeedPickerMobileCreate: React.FC<Props> = ({ entity, data, onChange, validationMode }) => {
  return (
    <Box>
      <Box display="flex" alignItems="center" mb="24px">
        <Box mr="16px">
          <img src={urlOrSvgToImage(entity?.smallIcon)} alt={entity?.name} height={22} width={22} />
        </Box>
        <Box fontWeight={600} fontSize={16} color="#333333">
          {entity?.name}
        </Box>
        <Box ml="auto" fontSize={14}>
          {entity?.version}
        </Box>
      </Box>
      <Box>
        <ReactMarkdown>{entity?.description || ''}</ReactMarkdown>
      </Box>
      {!entity?.outOfPlan && (
        <Box pt="14px">
          <BaseJsonForm
            schema={entity?.configuration.schema}
            uischema={entity?.configuration.uischema}
            data={data}
            onChange={onChange}
            validationMode={validationMode}
          />
        </Box>
      )}
    </Box>
  );
};

export default FeedPickerMobileCreate;
