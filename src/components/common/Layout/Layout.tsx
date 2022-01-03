import React, { FC, ReactNode, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { CssBaseline } from '@mui/material';
import GlobalStyle from '@components/globalStyle';
import { useAuthContext } from '@hooks/useAuthContext';

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
      <main>{children}</main>
    </div>
  );
};

export default Layout;
