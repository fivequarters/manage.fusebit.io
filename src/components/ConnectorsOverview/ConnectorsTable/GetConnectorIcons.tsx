import React from 'react';
import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { urlOrSvgToImage } from '@utils/utils';

interface Props {
  handler: string;
}

const GetConnectorIcons: React.FC<Props> = ({ handler }) => {
  const connectorFeed = useGetConnectorsFeed();
  return (
    <img
      src={urlOrSvgToImage(connectorFeed.data?.filter((conn) => JSON.stringify(conn).includes(handler))[0].smallIcon)}
      width={40}
      alt=""
    />
  );
};

export default GetConnectorIcons;
