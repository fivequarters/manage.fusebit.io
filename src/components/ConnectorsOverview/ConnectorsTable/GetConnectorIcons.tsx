import React from 'react';
import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { urlOrSvgToImage } from '@utils/utils';

interface Props {
  handler: string;
  name: string;
}

const GetConnectorIcons: React.FC<Props> = ({ handler, name }) => {
  const connectorFeed = useGetConnectorsFeed();
  return (
    <img
      src={urlOrSvgToImage(connectorFeed.data?.filter((conn) => JSON.stringify(conn).includes(handler))[0].smallIcon)}
      width={25}
      alt={name}
    />
  );
};

export default GetConnectorIcons;
