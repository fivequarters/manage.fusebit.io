import { useMediaQuery } from '@material-ui/core';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAnchor from './useAnchor';

interface Props {
  initialText: string;
  onClickInitialText: () => void;
}

const useEntityBreadcrumb = ({ initialText, onClickInitialText }: Props) => {
  const { handleClickAnchor, anchorEl, handleCloseMenu } = useAnchor();
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery('(max-width: 880px)');

  const { id } = useParams<{ id: string }>();

  const breadcrumbItems = useMemo(() => {
    const items = [
      {
        text: initialText,
        onClick: (event: any, isLastItem: boolean) => {
          if (isLastItem) {
            if (isMobile) {
              setOpenDrawer(true);
            } else {
              handleClickAnchor(event);
            }
          } else {
            onClickInitialText();
          }
        },
      },
    ];

    if (id && !isMobile) {
      items.push({
        text: id,
        onClick: (event: any) => {
          handleClickAnchor(event);
        },
      });
    }

    return items;
  }, [id, handleClickAnchor, initialText, onClickInitialText, isMobile]);

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return {
    breadcrumbItems,
    anchorEl,
    handleCloseMenu,
    openDrawer,
    handleCloseDrawer,
  };
};

export default useEntityBreadcrumb;
