import React from 'react';
import { EntityComponent } from '@interfaces/feed';
import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { urlOrSvgToImage } from '@utils/utils';
import { InnerConnector } from '@interfaces/integration';

interface Props {
  components: InnerConnector[];
}

const GetIntegrationIcons: React.FC<Props> = ({ components }) => {
  const connectorFeed = useGetConnectorsFeed();
  return (
    <>
      {components
        .filter((item) => item.entityType === 'connector')
        .map((item) => item.provider)
        .map((item) => {
          return connectorFeed.data?.filter(
            (conn) => (conn.configuration.components as EntityComponent[])[0].provider === item
          )[0].smallIcon as string;
        })
        .map((item) => {
          return <img src={urlOrSvgToImage(item)} key="" width={30} alt="" />;
        })}
    </>
  );
};

export default GetIntegrationIcons;
