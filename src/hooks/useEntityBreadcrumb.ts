import { BreadcrumbItem } from '@interfaces/entityBreadcrumb';
import { useMediaQuery } from '@material-ui/core';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAnchor from './useAnchor';
import { useGetIntegrationFromCache } from './useGetIntegrationFromCache';
import { useGetIntegrationsFeed } from './useGetIntegrationsFeed';

interface Props {
  initialText: string;
  href?: string;
  isIntegration?: boolean;
  isConnector?: boolean;
}

const useEntityBreadcrumb = ({ initialText, href, isIntegration, isConnector }: Props) => {
  const { handleClickAnchor, anchorEl, handleCloseMenu } = useAnchor();
  const integrationData = useGetIntegrationFromCache();
  const integrationsFeed = useGetIntegrationsFeed();
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery('(max-width: 880px)');

  const { id } = useParams<{ id: string }>();

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
      let icon: string | undefined;

      if (isIntegration) {
        const matchingFeed = integrationsFeed.data?.find(
          (feed) => feed.id === integrationData?.data.tags['fusebit.feedId']
        );

        icon = matchingFeed?.smallIcon;
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
  }, [id, handleClickAnchor, initialText, isMobile, href, integrationData, integrationsFeed, isIntegration]);

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
