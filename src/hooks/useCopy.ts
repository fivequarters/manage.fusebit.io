import { useState } from 'react';

export const useCopy = () => {
  const [copiedLine, setCopiedLine] = useState(false);
  let timeout: NodeJS.Timeout;

  const handleCopy = (text: string) => {
    clearTimeout(timeout);
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
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
