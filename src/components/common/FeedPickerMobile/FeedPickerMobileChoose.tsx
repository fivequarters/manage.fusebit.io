import { Box } from '@material-ui/core';
import TextField from '../FormFields/TextField';
import ItemList from '../ItemList/ItemList';

interface Props {
  items?: string[];
}

const items = [
  { text: 'Inbox', showArrow: true },
  { text: 'Starred', showArrow: true },
  { text: 'Send email', showArrow: true },
  { text: 'Drafts', showArrow: true },
  { text: 'Calendar', showArrow: true },
];

const FeedPickerMobileChoose: React.FC<Props> = () => {
  return (
    <Box>
      <TextField fieldVariant="default" label="Search" variant="standard" fullWidth />
      <ItemList items={items} />
    </Box>
  );
};

export default FeedPickerMobileChoose;
