import { useEffect } from 'react';

interface Props {
  session: string;
}

function Session({ session }: Props) {
  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get('error');

    if (!error) {
      localStorage.setItem('session', session);
    }

    window.close();
  }, [session]);

  return null;
}

export default Session;
