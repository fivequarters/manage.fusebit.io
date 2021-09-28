import React, { useState } from 'react';
import { Button, Modal, Backdrop, Box } from '@material-ui/core';
import * as SC from './styles';
import * as CSC from '../../../../../globalStyle';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Verbs = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const ConfigureRunnerModal: React.FC<Props> = ({ open, setOpen }) => {
  const [verbSelectorActive, setVerbSelectorActive] = useState(false);
  const [selectedVerb, setSelectedVerb] = useState(Verbs[0]);
  const [url, setUrl] = useState('');
  const [payload, setPayload] = useState('');

  const handleSave = () => {
    console.log(url); // to avoid vercel unused var crash
    console.log(payload); // to avoid vercel unused var crash
    setOpen(false);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <SC.Card open={open}>
        <CSC.Close onClick={() => setOpen(false)} />
        <CSC.ModalTitle margin="0 0 16px 0">Configure runner</CSC.ModalTitle>
        <Box style={{ display: 'flex' }}>
          <CSC.Flex width="max-content" margin="0 48px 0 0" flexDown>
            <SC.Subtitle>Verb</SC.Subtitle>
            <SC.VerbSelector onClick={() => setVerbSelectorActive(!verbSelectorActive)}>
              {selectedVerb} <SC.VerbArrow active={verbSelectorActive} />
              <SC.VerbOptionsWrapper active={verbSelectorActive}>
                {Verbs.map((verb) => (
                  <SC.VerbOption onClick={() => setSelectedVerb(verb)} key={verb} selected={verb === selectedVerb}>
                    {verb}
                  </SC.VerbOption>
                ))}
              </SC.VerbOptionsWrapper>
            </SC.VerbSelector>
          </CSC.Flex>
          <CSC.Flex flexDown>
            <SC.Subtitle>URL</SC.Subtitle>
            <SC.Textarea onChange={(e) => setUrl(e.target.value)} />
          </CSC.Flex>
        </Box>
        <CSC.Flex margin="49px 0 0 0" flexDown>
          <SC.Subtitle>Payload</SC.Subtitle>
          <SC.Textarea onChange={(e) => setPayload(e.target.value)} height="137px" />
        </CSC.Flex>
        <SC.ButtonsWrapper>
          <Button
            onClick={handleSave}
            style={{ width: '200px', marginLeft: 'auto', marginTop: '42px' }}
            size="large"
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </SC.ButtonsWrapper>
      </SC.Card>
    </Modal>
  );
};

export default ConfigureRunnerModal;
