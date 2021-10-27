import ItemList from '../ItemList/ItemList';

interface Props {
  items?: React.ComponentProps<typeof ItemList>['items'];
}

const FeedPickerMobileFilter: React.FC<Props> = ({ items }) => {
  return <ItemList items={items} />;
};

export default FeedPickerMobileFilter;
