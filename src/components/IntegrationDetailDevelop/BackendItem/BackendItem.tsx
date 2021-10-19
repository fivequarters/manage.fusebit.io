import React from 'react';
import { Box, Icon, Typography } from '@material-ui/core';
import DnsOutlinedIcon from '@material-ui/icons/DnsOutlined';
import ListItem from '../ListItem';

interface Props {
  className?: string;
  name: string;
}

const BackendItem: React.FC<Props> = ({ className, name }) => {
  return (
    <ListItem className={className}>
      <Box mr="17px">
        <Icon>
          <DnsOutlinedIcon />
        </Icon>
      </Box>
    </ListItem>
  );
};

export default BackendItem;
