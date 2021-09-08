import React from 'react';
import * as SC from './styles';
import * as CSC from '../../../../globalStyle';
import { Button } from '@material-ui/core';
import { Props } from '../../../../../interfaces/connect';
import CopyLine from '../../../../CopyLine';

const Connect = React.forwardRef(({ onClose, open }: Props, ref) => {
  return (
    <SC.Card open={open}>
      <SC.Wrapper>
        <CSC.Close onClick={() => onClose()} />

        <CSC.ModalTitle>Stage Backend</CSC.ModalTitle>
        <SC.SmallTitleWrapper>
          <SC.SmallTitle>
            <strong>Key Name:</strong> Stage Backend
          </SC.SmallTitle>
          <Button variant="outlined" color="primary" size="small">
            Edit
          </Button>
        </SC.SmallTitleWrapper>
        <SC.SmallTitleWrapper>
          <SC.SmallTitle>
            <strong>Integration Base URL:</strong> https://api.us-west-2...
          </SC.SmallTitle>
          <CSC.Copy />
        </SC.SmallTitleWrapper>

        <SC.Hr />

        <SC.Subtitle>Key</SC.Subtitle>
        <CopyLine text="eyJhb..." />
        <CSC.Flex margin="0 0 10px 0">
          <SC.DisclaimerIcon />
          <SC.Disclaimer>
            For security reasons, <strong>this is the last time you will see this key.</strong>
          </SC.Disclaimer>
        </CSC.Flex>

        <SC.Hr />

        <SC.Subtitle>Connect your Backend</SC.Subtitle>
        <CSC.Flex margin="32px 0 0 0">
          <CSC.Flex flexDown width="293px" margin="0 0 auto 0">
            <Button variant="outlined" color="primary" size="large">
              Follow guide
            </Button>
            <CSC.Flex>
              <SC.TimeIcon />
              <SC.TimeDescription>10 minutes</SC.TimeDescription>
            </CSC.Flex>
          </CSC.Flex>
          <SC.Or>or</SC.Or>
          <CSC.Flex flexDown width="293px">
            <Button variant="outlined" color="primary" size="large">
              Download sample
            </Button>
            <CSC.Flex>
              <SC.TimeIcon />
              <SC.TimeDescription>2 minutes</SC.TimeDescription>
            </CSC.Flex>
            <SC.TimeDescription margin="0">Already configured to work with this integration</SC.TimeDescription>
          </CSC.Flex>
        </CSC.Flex>

        <CSC.Flex margin="88px 0 0 auto" width="max-content">
          <Button style={{ width: '200px', marginRight: '32px' }} variant="outlined" color="primary" size="large">
            Delete
          </Button>
          <Button style={{ width: '200px' }} variant="contained" color="primary" size="large">
            OK
          </Button>
        </CSC.Flex>
      </SC.Wrapper>
    </SC.Card>
  );
});

export default Connect;
