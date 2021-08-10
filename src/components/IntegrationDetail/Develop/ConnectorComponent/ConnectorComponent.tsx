import React, { useEffect, useState } from 'react';
import * as SC from './styles';
import { ConnectorComponentProps } from '../../../../interfaces/integrationDetailDevelop';
import cross from '../../../../assets/cross.svg';
import { useHistory } from 'react-router-dom';
import { useGetRedirectLink } from '../../../../hooks/useGetRedirectLink';
import { integrationsFeed, connectorsFeed } from '../../../../static/feed';

const ConnectorComponent: React.FC<ConnectorComponentProps> = ({
  connector,
  onConnectorDelete,
  onLinkConnectorClick,
  linkConnector,
}) => {
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();
  const [icon, setIcon] = useState('');

  useEffect(() => {
    if (connector.tags && !connector.missing) {
      const feedtype = connector.tags['fusebit.feedType'];
      const feedId = connector.tags['fusebit.feedId'];

      if (feedtype === 'integration') {
        integrationsFeed().then(feed => {
          feed.forEach(item => {
            if (item.id === feedId) {
              setIcon(item.smallIcon);
            }
          });
        });
      } else {
        connectorsFeed().then(feed => {
          feed.forEach(item => {
            if (item.id === feedId) {
              setIcon(item.smallIcon);
            }
          });
        });
      }
    } else {
      setIcon('/images/warning-red.svg');
    }
  }, [connector]);

  return (
    <SC.CardConnector
      onClick={(e: any) => {
        if (linkConnector) {
          onLinkConnectorClick && onLinkConnectorClick(connector.id);
        } else if (!e.target.id) {
          history.push(getRedirectLink(`/connector/${connector.id}`));
        }
      }}>
      {
        // TODO: Replace placeholder with real data
      }
      <SC.CardConnectorImage src={icon} alt={'connector image'} height='20' width='20' />
      <SC.CardConnectorText>
        {connector.id} {connector.missing && 'is not found'}
      </SC.CardConnectorText>
      {!linkConnector && (
        <SC.CardConnectorCrossContainer id='closeWrapper' onClick={() => onConnectorDelete(connector.id)}>
          <SC.CardConnectorCross id='close' src={cross} alt='close' height='8' width='8' />
        </SC.CardConnectorCrossContainer>
      )}
    </SC.CardConnector>
  );
};

export default ConnectorComponent;
