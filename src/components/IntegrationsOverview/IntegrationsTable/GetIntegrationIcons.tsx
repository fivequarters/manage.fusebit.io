import React from 'react';
import { EntityComponent } from '@interfaces/feed';
import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { urlOrSvgToImage } from '@utils/utils';
import { InnerConnector } from '@interfaces/integration';
import { Avatar, makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

interface Props {
  components: InnerConnector[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  grey: {
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[500],
  },
}));

const GetIntegrationIcons: React.FC<Props> = ({ components }) => {
  const classes = useStyles();
  const connectorFeed = useGetConnectorsFeed();
  const applicableComponents = components
    .filter((item) => item.entityType === 'connector')
    .map((item) => item.provider);
  return (
    <>
      {applicableComponents
        .slice(0, 3)
        .map((item) => {
          return connectorFeed.data?.filter(
            (conn) => (conn.configuration.components as EntityComponent[])[0].provider === item
          )[0].smallIcon as string;
        })
        .map((item) => {
          return <img src={urlOrSvgToImage(item)} key="" alt="" width={30} />;
        })}

      {applicableComponents.length > 0 ? <>...</> : <></>}
    </>
  );
};

export default GetIntegrationIcons;
