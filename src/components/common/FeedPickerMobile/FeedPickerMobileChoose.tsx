import { Box } from '@material-ui/core';
import TextField from '../FormFields/TextField';
import ItemList from '../ItemList/ItemList';
import MissingEntityCta from '../MissingEntityCta';

interface Props {
  items: React.ComponentProps<typeof ItemList>['items'];
  activeItem: React.ComponentProps<typeof ItemList>['activeItem'];
  feedTypeName: string;
  onChange: (e: any) => void;
  onClose: () => void;
}

const FeedPickerMobileChoose: React.FC<Props> = ({ onChange, onClose, feedTypeName, items, activeItem }) => {
  return (
    <Box>
      <TextField fieldVariant="default" label="Search" variant="standard" fullWidth onChange={onChange} />
      <ItemList items={items} activeItem={activeItem} />
      <MissingEntityCta entityName={feedTypeName} onClick={onClose} />
    </Box>
  );
};

export default FeedPickerMobileChoose;
