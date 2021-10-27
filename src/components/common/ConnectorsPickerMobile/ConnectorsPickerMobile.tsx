import React from 'react';
import { useGetConnectorsFeed } from '../../../hooks/api/useGetConnectorsFeed';
import FeedPickerMobile from '../FeedPickerMobile/FeedPickerMobile';

const ConnectorsPickerMobile = () => {
  const { data: feed } = useGetConnectorsFeed();

  return <FeedPickerMobile feed={feed} />;
};

export default ConnectorsPickerMobile;
