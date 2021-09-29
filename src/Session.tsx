import { useEffect } from 'react';

interface Props {
  session: string;
}

function Session({ session }: Props) {
  useEffect(() => {
    localStorage.setItem('session', session);

    window.close();
  }, [session]);

  return null;
}

export default Session;
