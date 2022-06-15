import React from 'react';
import { EntityComponent, Feed } from '@interfaces/feed';
import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { urlOrSvgToImage } from '@utils/utils';
import { InnerConnector } from '@interfaces/integration';
import { Avatar, Chip } from '@material-ui/core';

interface Props {
  components: InnerConnector[];
}

const GetIntegrationIcons: React.FC<Props> = ({ components }) => {
  const connectorFeed = useGetConnectorsFeed();
  const applicableComponents = components.filter((item) => item.entityType === 'connector');

  return (
    <>
      {applicableComponents
        .map((item) => item.provider)
        .map((item) => {
          const connectors = connectorFeed.data?.filter(
            (conn) => (conn.configuration.components as EntityComponent[])[0].provider === item
          );
          if (connectors && connectors.length < 1) {
            return undefined;
          }
          return (connectors as Feed[])[0].smallIcon;
        })
        .map((item, idx) => {
          return (
            <Chip
              avatar={
                <Avatar style={{ backgroundColor: 'white', border: '3px solid white' }} src={urlOrSvgToImage(item)} />
              }
              label={applicableComponents[idx].entityId}
              key={applicableComponents[idx].entityId}
            />
          );
        })}
    </>
  );
};

export default GetIntegrationIcons;
