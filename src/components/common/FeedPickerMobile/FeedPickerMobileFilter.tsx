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

const FeedPickerMobileFilter: React.FC<Props> = () => {
  return <ItemList items={items} />;
};

export default FeedPickerMobileFilter;
