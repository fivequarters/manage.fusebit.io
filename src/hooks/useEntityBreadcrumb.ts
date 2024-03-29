import { BreadcrumbItem } from '@interfaces/entityBreadcrumb';
import { useMediaQuery } from '@material-ui/core';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAnchor from './useAnchor';

interface Props {
  initialText: string;
  href?: string;
  entityIcon?: string;
}

const useEntityBreadcrumb = ({ initialText, href, entityIcon }: Props) => {
  const { id } = useParams<{ id: string }>();
  const { handleClickAnchor, anchorEl, handleCloseMenu } = useAnchor();
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
      items.push({
        text: id,
        onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          handleClickAnchor(event);
        },
        href: undefined,
        icon: entityIcon,
      });
    }

    return items;
  }, [id, handleClickAnchor, initialText, isMobile, href, entityIcon]);

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
