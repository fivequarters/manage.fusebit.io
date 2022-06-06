import { useEffect } from 'react';

interface Props {
  session: string;
}

function Session({ session }: Props) {
  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get('error');
    const disableSelfClose = localStorage.getItem('disableSelfClose');

    if (!error) {
      localStorage.setItem('session', session);
    } else {
      localStorage.setItem('sessionError', error);
    }

    if (!disableSelfClose) {
      window.close();
    }
  }, [session]);

  return null;
}

export default Session;
