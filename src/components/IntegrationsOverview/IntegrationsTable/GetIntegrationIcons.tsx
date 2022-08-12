import React from 'react';
import { EntityComponent } from '@interfaces/feed';
import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { urlOrSvgToImage } from '@utils/utils';
import { InnerConnector } from '@interfaces/integration';
import { Avatar, Chip } from '@material-ui/core';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { useHistory } from 'react-router-dom';

interface Props {
  components: InnerConnector[];
}

const GetIntegrationIcons: React.FC<Props> = ({ components }) => {
  const history = useHistory();
  const connectorFeed = useGetConnectorsFeed();
  const applicableComponents = components.filter((item) => item.entityType === 'connector');

  const { getRedirectLink } = useGetRedirectLink();

  const onClick = (connectorId: string) => {
    history.push(getRedirectLink(`/connector/${connectorId}/configure`));
  };

  return (
    <>
      {applicableComponents
        .map((item) => item.provider)
        .map((item) => {
          const connector = connectorFeed.data?.find(
            (conn) => (conn.configuration.components as EntityComponent[])[0].provider === item
          );
          return connector ? connector.smallIcon : undefined;
        })
        .map((item, idx) => {
          return (
            <Chip
              avatar={
                <Avatar style={{ backgroundColor: 'white', border: '3px solid white' }} src={urlOrSvgToImage(item)} />
              }
              label={applicableComponents[idx].entityId}
              key={applicableComponents[idx].entityId}
              onClick={(e) => {
                e.stopPropagation();
                onClick(applicableComponents[idx].entityId);
              }}
              style={{
                backgroundColor: '#21212114',
              }}
            />
          );
        })}
    </>
  );
};

export default GetIntegrationIcons;
