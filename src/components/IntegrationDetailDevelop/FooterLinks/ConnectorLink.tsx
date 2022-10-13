import { useGetFeedById } from '@hooks/useGetFeedById';
import { Connector } from '@interfaces/connector';
import { Integration } from '@interfaces/integration';
import React from 'react';
import Link from './Link';

interface Props {
  integration?: Integration;
  connector: Connector;
}

const ConnectorLink = ({ integration, connector }: Props) => {
  const { feed } = useGetFeedById({
    id: connector?.tags?.['fusebit.feedId'],
    type: connector?.tags?.['fusebit.feedType'],
  });

  return (
    <Link
      integration={integration}
      text={`Configure ${connector.id}`}
      href={feed?.resources?.configureAppDocUrl || ''}
    />
  );
};

export default ConnectorLink;
