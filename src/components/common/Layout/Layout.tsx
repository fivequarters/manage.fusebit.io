import React, { FC, ReactNode, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import GlobalStyle from '@components/globalStyle';
import { useAuthContext } from '@hooks/useAuthContext';
import Onboarding from '@components/Onboarding';
import InvitedToFusebitModal from '../InvitedToFusebitModal/InvitedToFusebitModal';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
  })
);

interface Props {
  children: ReactNode;
}

// functional component
const Layout: FC<Props> = ({ children }) => {
  const classes = useStyles();
  const { userData } = useAuthContext();

  useEffect(() => {
    const { pendo } = window as any;
    if (userData.userId && userData.accountId && pendo && pendo.initialize) {
      pendo.initialize({
        visitor: {
          id: userData.userId || '', // Required if user is logged in
        },
        account: {
          id: userData.accountId, // Required if using Pendo Feedback
          // creationDate: // Optional
        },
      });
    }
  }, [userData]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <GlobalStyle />
      <main>
        <Onboarding />
        <InvitedToFusebitModal />
        {children}
      </main>
    </div>
  );
};

export default Layout;
