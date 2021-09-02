import React from 'react';
import * as SC from './styles';
import * as CSC from '../../../../globalStyle';
import { Props } from '../../../../../interfaces/delete';
import { Button } from '@material-ui/core';

const Delete = React.forwardRef(({ open, onClose, handleDelete }: Props, ref) => {
  return (
    <SC.Card open={open}>
      <CSC.Close onClick={() => onClose()} />
      <CSC.ModalTitle>Are you sure you want to delete this user?</CSC.ModalTitle>
      <CSC.ModalDescription textAlign="center">You cannot undo this action.</CSC.ModalDescription>
      <SC.ButtonsWrapper>
        <Button
          onClick={() => onClose()}
          style={{ width: '77px', marginRight: '16px' }}
          size="medium"
          variant="outlined"
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleDelete()}
          style={{ width: '77px' }}
          size="medium"
          variant="contained"
          color="primary"
        >
          Delete
        </Button>
      </SC.ButtonsWrapper>
    </SC.Card>
  );
});

export default Delete;
