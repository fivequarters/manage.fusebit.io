import { BreadcrumbItem } from '@interfaces/entityBreadcrumb';
import { useMediaQuery } from '@material-ui/core';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAnchor from './useAnchor';
import { useGetConnectorFromCache } from './useGetConnectorFromCache';
import { useGetFeedById } from './useGetFeedById';
import { useGetIntegrationFromCache } from './useGetIntegrationFromCache';

interface Props {
  initialText: string;
  href?: string;
  isIntegration?: boolean;
  isConnector?: boolean;
}

const useEntityBreadcrumb = ({ initialText, href, isIntegration, isConnector }: Props) => {
  const { id } = useParams<{ id: string }>();
  const { handleClickAnchor, anchorEl, handleCloseMenu } = useAnchor();
  const integrationData = useGetIntegrationFromCache();
  const connectorData = useGetConnectorFromCache();
  const { feed: connectorFeedEntry } = useGetFeedById({
    id: connectorData?.data.tags['fusebit.feedId'],
    type: connectorData?.data.tags['fusebit.feedType'],
  });
  const { feed: integrationFeedEntry } = useGetFeedById({
    id: integrationData?.data.tags['fusebit.feedId'] || '',
    type: integrationData?.data.tags['fusebit.feedType'] || 'integration',
  });
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery('(max-width: 880px)');

  const breadcrumbItems = useMemo(() => {
    const items: BreadcrumbItem[] = [
      {
        text: isMobile && id ? id : initialText,
        onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, isLastItem: boolean) => {
          if (isLastItem) {
            if (isMobile) {
              setOpenDrawer(true);
            } else {
              handleClickAnchor(event);
            }
          }
        },
        href: isMobile ? undefined : href,
      },
    ];

    if (id && !isMobile) {
      let icon;

      if (isIntegration) {
        icon = integrationFeedEntry?.smallIcon;
      } else if (isConnector) {
        icon = connectorFeedEntry?.smallIcon;
      }

      items.push({
        text: id,
        onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          handleClickAnchor(event);
        },
        href: undefined,
        icon,
      });
    }

    return items;
  }, [
    id,
    handleClickAnchor,
    initialText,
    isMobile,
    href,
    connectorFeedEntry,
    integrationFeedEntry,
    isConnector,
    isIntegration,
  ]);

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return {
    breadcrumbItems,
    anchorEl,
    handleCloseMenu,
    openDrawer,
    handleCloseDrawer,
    isActive: openDrawer || !!anchorEl,
  };
};

export default useEntityBreadcrumb;
