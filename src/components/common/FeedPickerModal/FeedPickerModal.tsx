import MUIModal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import styled from 'styled-components';
import FeedPicker from '../FeedPicker';
import { Feed } from '../../../interfaces/feed';
import { Data } from '../../../interfaces/feedPicker';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (feed: Feed, data: Data) => void;
  isIntegration: boolean;
}

const Modal = styled(MUIModal)`
  & > div {
    &:focus-visible {
      outline: none;
    }
  }
`;

const FeedPickerModal = ({ open, onClose, onSubmit, isIntegration }: Props) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      style={{
        outline: 'none',
      }}
    >
      <FeedPicker isIntegration={isIntegration} onSubmit={onSubmit} open={open} onClose={onClose} />
    </Modal>
  );
};

export default FeedPickerModal;
