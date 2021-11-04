import React from 'react';
import ListItem from '@components/IntegrationDetailDevelop/ListItem';
import { urlOrSvgToImage } from '@utils/utils';
import { useGetMatchingConnectorFeed } from '@hooks/api/useGetMatchingConnectorFeed';
import { CircularProgress } from '@material-ui/core';
import { Entity } from '@interfaces/feed';
import { Connector } from '@interfaces/connector';

export interface Props {
  connector: Connector;
  handleClick: (connector: Entity) => Promise<void>;
}

const ListComponent: React.FC<Props> = ({ connector, handleClick }) => {
  const { data: connectorFeed, isLoading } = useGetMatchingConnectorFeed({ connector });

  return (
    <ListItem
      id={connector.id}
      // @ts-ignore
      onClick={() => handleClick(connector)}
      icon={
        isLoading ? (
          <CircularProgress size={20} />
        ) : (
          <img src={urlOrSvgToImage(connectorFeed?.smallIcon)} alt="connector" height={20} width={20} />
        )
      }
      name={connector.id}
    />
  );
};

export default ListComponent;
