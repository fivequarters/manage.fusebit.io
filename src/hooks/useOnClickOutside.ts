import { RefObject, useEffect } from 'react';

interface Props {
  ref: RefObject<HTMLElement>;
  callback: (e: any) => void;
}

const useOnClickOutside = ({ ref, callback }: Props) => {
  const handleClick = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback(e);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

export default useOnClickOutside;
