import { Box } from '@mui/material';
import TextField from '../FormFields/TextField';
import ItemList from '../ItemList/ItemList';

interface Props {
  items: React.ComponentProps<typeof ItemList>['items'];
  activeItem: React.ComponentProps<typeof ItemList>['activeItem'];
  onChange: (e: any) => void;
}

const FeedPickerMobileChoose: React.FC<Props> = ({ onChange, items, activeItem }) => {
  return (
    <Box>
      <TextField fieldVariant="default" label="Search" variant="standard" fullWidth onChange={onChange} />
      <ItemList items={items} activeItem={activeItem} />
    </Box>
  );
};

export default FeedPickerMobileChoose;
