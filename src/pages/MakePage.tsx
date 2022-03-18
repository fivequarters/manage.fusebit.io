import { FC, ReactElement } from 'react';
import { Box, Container, Button } from '@material-ui/core';
import { useTrackUnauthenticatedPage } from '@hooks/useTrackPage';
import { trackEventMemoized } from '@utils/analytics';
import Layout from '@components/common/Layout';
import useTitle from '@hooks/useTitle';
import { useHistory, Link, useParams } from 'react-router-dom';
import NavbarBreadcrumb from '@components/common/NavbarBreadcrumb/NavbarBreadcrumb';
import Navbar from '@components/common/Navbar';
import useSnippets from '@hooks/useSnippets';

const MakePage: FC<{}> = (): ReactElement => {
  useTitle('Fusebit');
  const { snippets: snippetsParam } = useParams<{ snippets: string }>();
  useTrackUnauthenticatedPage('Make Snippet Landing Page', 'Make Snippet', { snippets: snippetsParam });
  const history = useHistory();
  const { error, snippets, connectors } = useSnippets();

  const handleGo = () => {
    trackEventMemoized('Go Button Clicked', 'Make Snippet', { snippets: snippetsParam });
    history.push(`/make-go/${snippetsParam}`);
  };

  if (snippets && connectors) {
    return (
      <Layout>
        <Navbar hideUserMenu={true} logoUrl="/">
          <NavbarBreadcrumb
            lastItemAction={false}
            items={[
              {
                text: 'Fusebit',
                onClick: () => history.push('/'),
              },
            ]}
          />
        </Navbar>
        <Container maxWidth="md">
          <Box display="flex">
            {error && (
              <Box pt="50px" width="100%">
                <h1>Oops!</h1>
                <p>There was a problem. {error}.</p>
                <p>
                  But hey, you can still explore other integrations you can build with Fusebit <Link to="/">here</Link>.
                </p>
              </Box>
            )}
            {!error && (
              <Box pt="50px" width="100%">
                <h1>Let's create a {connectors.map((c) => c.name).join(' + ')} integration!</h1>
                <p>With just a few lines of code, you will be able to:</p>
                <ul>
                  {snippets.map((s) => (
                    <li key={`${s.connector.id}-${s.snippet.id}`}>{s.snippet.description}</li>
                  ))}
                </ul>
                <p>Log in or create a free Fusebit account to get started!</p>
                <Button
                  onClick={handleGo}
                  style={{ width: '200px', marginTop: '50px' }}
                  fullWidth={false}
                  size="large"
                  color="primary"
                  variant="contained"
                >
                  Go!
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </Layout>
    );
  }
  return <></>;
};

export default MakePage;
