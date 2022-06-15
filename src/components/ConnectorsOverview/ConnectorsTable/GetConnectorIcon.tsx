import React from 'react';
import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { urlOrSvgToImage } from '@utils/utils';

interface Props {
  handler: string;
  name: string;
}

const GetConnectorIcon: React.FC<Props> = ({ handler, name }) => {
  const connectorFeed = useGetConnectorsFeed();
  const icon = connectorFeed.data?.find((conn) => JSON.stringify(conn).includes(handler))?.smallIcon;
  if (!icon) {
    return <></>;
  }
  return <img src={urlOrSvgToImage(icon)} width={25} alt={name} />;
};

export default GetConnectorIcon;
