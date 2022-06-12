import React from 'react';
import { EntityComponent } from '@interfaces/feed';
import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { urlOrSvgToImage } from '@utils/utils';
import { InnerConnector } from '@interfaces/integration';
import { Avatar, Chip } from '@material-ui/core';

interface Props {
  components: InnerConnector[];
}

const GetIntegrationIcons: React.FC<Props> = ({ components }) => {
  const connectorFeed = useGetConnectorsFeed();
  const applicableComponents = components
    .filter((item) => item.entityType === 'connector')
    .map((item) => item.provider);
  return (
    <>
      {applicableComponents
        .map((item) => {
          return connectorFeed.data?.filter(
            (conn) => (conn.configuration.components as EntityComponent[])[0].provider === item
          )[0].smallIcon as string;
        })
        .map((item, idx) => {
          return (
            <Chip
              avatar={
                <Avatar style={{ backgroundColor: 'white', border: '3px solid white' }} src={urlOrSvgToImage(item)} />
              }
              label={applicableComponents[idx]}
              key={applicableComponents[idx]}
            />
          );
        })}
    </>
  );
};

export default GetIntegrationIcons;
