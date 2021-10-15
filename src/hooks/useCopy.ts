import { useState } from 'react';

export const useCopy = () => {
  const [copiedLine, setCopiedLine] = useState(false);
  let timeout: NodeJS.Timeout;

  const handleCopy = (text: string) => {
    clearTimeout(timeout);
    navigator.clipboard.writeText(text);
    setCopiedLine(true);
    timeout = setTimeout(() => {
      setCopiedLine(false);
    }, 3000);
  };

  return {
    copiedLine,
    handleCopy,
  };
};
