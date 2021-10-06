import { useCallback, useState } from 'react';

type UseModalData = [boolean, (open: boolean) => void, () => void];

export const useModal = (defaultOpen?: boolean): UseModalData => {
  const [open, setOpen] = useState(!!defaultOpen);

  const toggle = useCallback(() => setOpen(!open), [open]);

  return [open, setOpen, toggle];
};
