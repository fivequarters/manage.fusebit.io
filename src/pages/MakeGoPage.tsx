import { FC, ReactElement, useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { useTrackPage } from '@hooks/useTrackPage';
import Layout from '@components/common/Layout';
import useTitle from '@hooks/useTitle';
import { useHistory, Link, useParams } from 'react-router-dom';
import NavbarBreadcrumb from '@components/common/NavbarBreadcrumb/NavbarBreadcrumb';
import Navbar from '@components/common/Navbar';
import useSnippets from '@hooks/useSnippets';
import { useLoader } from '@hooks/useLoader';
import { useGetIntegrationsFeed } from '@hooks/useGetIntegrationsFeed';
import { useCreateDataFromFeed } from '@hooks/useCreateDataFromFeed';
import { Data } from '@interfaces/feedPicker';
import { Feed, IntegrationEntity, Entity } from '@interfaces/feed';
import { InnerConnector } from '@interfaces/integration';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';

const MakeGoPage: FC<{}> = (): ReactElement => {
  useTitle('Fusebit');
  const { snippets: snippetsParam } = useParams<{ snippets: string }>();
  useTrackPage('Make Snippet Go Page', 'Make Snippet', { snippets: snippetsParam });
  const history = useHistory();
  const { error, snippets, connectors, formatSnippet, getProviderVersion } = useSnippets();
  const [createError, setCreateError] = useState<string | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const { createLoader, removeLoader } = useLoader();
  const { createConnector, createIntegrationAndConnector } = useCreateDataFromFeed();
  const integrationFeed = useGetIntegrationsFeed();
  const { getRedirectLink } = useGetRedirectLink();

  useEffect(() => {
    if (!isCreating && !error && !createError && snippets && connectors && integrationFeed.data) {
      (async () => {
        createLoader('Creating integration...');
        setIsCreating(true);

        const createAllConnectors = async (random: number) => {
          // Create all connectors
          const entities = await Promise.all(
            connectors.map((connector) => {
              const entityName = Object.keys(connector.configuration.entities)[0];
              const connectorId = `con-${connector.id}-${random}`;
              const data: Data = {
                [entityName]: { id: connectorId },
              };
              return createConnector(connector, data, true);
            })
          );
          const connectorEntityMap: { [key: string]: Entity } = {};
          connectors.forEach((c, i) => {
            connectorEntityMap[c.id] = entities[i] as Entity;
          });
          return connectorEntityMap;
        };

        const createCustomIntegrationTemplate = (random: number, connectorEntityMap: { [key: string]: Entity }) => {
          // Construct an new integration template using the custom integration template as the basis
          const customFeed = integrationFeed.data.find((i) => i.id === 'custom') as Feed;
          const integrationId = `int-${connectors.map((c) => c.id).join('-')}-${random}`;
          const entityName = Object.keys(customFeed.configuration.entities)[0];
          const entity = customFeed.configuration.entities[entityName] as IntegrationEntity;
          const packageJson = JSON.parse(entity.data.files['package.json']);
          let integrationJs = entity.data.files['./integration.js'];
          const newComponents: InnerConnector[] = [];

          // add snippets
          snippets.forEach((s) => {
            // modify integration.js
            const newContent = formatSnippet(
              s.connector,
              s.snippet,
              integrationId,
              connectorEntityMap[s.connector.id]?.id as string,
              connectorEntityMap[s.connector.id]?.id as string
            );
            integrationJs += newContent;
            // modify package.json
            packageJson.dependencies[s.connector.configuration.components?.[0].provider as string] = getProviderVersion(
              s.connector
            );
          });

          // add integration's components
          connectors.forEach((c) => {
            newComponents.push({
              ...(c.configuration.components?.[0] as InnerConnector),
              entityId: connectorEntityMap[c.id]?.id as string,
              name: connectorEntityMap[c.id]?.id as string,
            });
          });
          const newIntegrationFeed = {
            ...customFeed,
            configuration: {
              ...customFeed.configuration,
              entities: {
                ...customFeed.configuration.entities,
                [entityName]: {
                  ...entity,
                  data: {
                    ...entity.data,
                    components: newComponents,
                    files: {
                      ...entity.data.files,
                      './integration.js': integrationJs,
                      'package.json': JSON.stringify(packageJson),
                    },
                  },
                },
              },
            },
          };

          return { newIntegrationFeed, entityName, integrationId };
        };

        try {
          const random = Math.floor(Math.random() * 899 + 100);
          const connectorEntityMap = await createAllConnectors(random);
          const { newIntegrationFeed, entityName, integrationId } = createCustomIntegrationTemplate(
            random,
            connectorEntityMap
          );
          // constuct integration template substitution parameters
          const data: Data = {
            [entityName]: { id: integrationId },
          };
          // complete integration creation
          await createIntegrationAndConnector(newIntegrationFeed, data, true);
          history.replace(getRedirectLink(`/integration/${integrationId}/edit`));
        } catch (e) {
          setCreateError(`There was an error creating a connector required by the integration: ${e.message}`);
        } finally {
          removeLoader();
        }
      })();
    }
  }, [
    error,
    snippets,
    connectors,
    createError,
    createConnector,
    createLoader,
    removeLoader,
    createIntegrationAndConnector,
    formatSnippet,
    getProviderVersion,
    getRedirectLink,
    history,
    integrationFeed.data,
    isCreating,
  ]);

  if (error || createError) {
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
            <Box pt="50px" width="100%">
              <h1>Oops!</h1>
              <p>There was a problem. {error || createError}.</p>
              <p>
                But hey, you can still explore other integrations you can build with Fusebit <Link to="/">here</Link>.
              </p>
            </Box>
          </Box>
        </Container>
      </Layout>
    );
  }
  return (
    <Layout>
      <></>
    </Layout>
  );
};

export default MakeGoPage;
