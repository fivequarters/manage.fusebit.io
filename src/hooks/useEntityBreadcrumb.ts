import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useAnchor from './useAnchor';

interface Props {
  initialText: string;
  onClickInitialText: () => void;
}

const useEntityBreadcrumb = ({ initialText, onClickInitialText }: Props) => {
  const { handleClick, anchorEl, handleClose } = useAnchor();

  const { id } = useParams<{ id: string }>();

  const breadcrumbItems = useMemo(() => {
    const items = [
      {
        text: initialText,
        onClick: (event: any, isLastItem: boolean) => {
          if (isLastItem) {
            handleClick(event);
          } else {
            onClickInitialText();
          }
        },
      },
    ];

    if (id) {
      items.push({
        text: id,
        onClick: (event: any) => {
          handleClick(event);
        },
      });
    }

    return items;
  }, [id, handleClick, initialText, onClickInitialText]);

  return {
    breadcrumbItems,
    anchorEl,
    handleClose,
  };
};

export default useEntityBreadcrumb;
