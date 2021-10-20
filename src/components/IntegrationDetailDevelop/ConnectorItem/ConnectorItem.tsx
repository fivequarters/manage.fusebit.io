import React from 'react';
import DnsOutlinedIcon from '@material-ui/icons/DnsOutlined';
import ListItem from '../ListItem';

interface Props {
  className?: string;
  name: string;
}

const ConnectorItem: React.FC<Props> = ({ className, name }) => {
  return <ListItem className={className} icon={<DnsOutlinedIcon />} name={name} onDelete={() => {}} />;
};

export default ConnectorItem;
