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

const ExistingConnectorItem: React.FC<Props> = ({ connector, handleClick }) => {
  const { data: connectorFeed, isLoading } = useGetMatchingConnectorFeed({ connector });

  return (
    <ListItem
      id={connector.id}
      onClick={() => handleClick({ ...connector, entityType: 'connector' } as Entity)}
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

export default ExistingConnectorItem;
