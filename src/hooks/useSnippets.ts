import { useParams } from 'react-router-dom';
import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { Feed, Snippet } from '@interfaces/feed';
import { useAuthContext } from '@hooks/useAuthContext';
import Mustache from 'mustache';

const useSnippets = () => {
  const { snippets } = useParams<{ snippets: string }>();
  const connectorFeed = useGetConnectorsFeed();
  const { userData, getTenantId } = useAuthContext();

  let error: string | undefined;
  const snippetArray: { connector: Feed; snippet: Snippet }[] = [];
  const connectorMap: { [key: string]: boolean } = {};
  const uniqueConnectors: Feed[] = [];
  if (snippets && connectorFeed.data && connectorFeed.data.length > 0) {
    const snippetIds = snippets.split('+').map((s) => {
      const segments = s.split('-');
      const connectorId = segments.shift();
      return { connectorId, snippetId: segments.join('-') };
    });
    for (let i = 0; i < snippetIds.length; i++) {
      const connector = connectorFeed.data.find((c) => c.id === snippetIds[i].connectorId);
      if (!connector) {
        error = `The '${snippetIds[i].connectorId}' connector was not found.`;
        break;
      }
      const snippet = connector.snippets?.find((s) => s.id === snippetIds[i].snippetId);
      if (!snippet) {
        error = `The '${snippetIds[i].snippetId}' snippet of the '${snippetIds[i].connectorId}' connector was not found.`;
        break;
      }
      if (!connectorMap[connector.id]) {
        connectorMap[connector.id] = true;
        uniqueConnectors.push(connector);
      }
      snippetArray.push({ connector, snippet });
    }
  }

  const formatSnippet = (
    feed: Feed,
    snippet: Snippet,
    integrationId: string,
    connectorId: string,
    connectorName: string
  ) => {
    let newContent = [``, `// ${feed.name} - ${snippet.name}`, `// ${snippet.description}`, `${snippet.code}`, ``].join(
      '\n'
    );
    const oldEscape = Mustache.escape;
    try {
      const customTags: any = ['<%', '%>'];
      Mustache.escape = (s: string) => s;
      const global: any = {
        userId: userData.userId,
        accountId: userData.accountId,
        subscriptionId: userData.subscriptionId,
        endpoint: process.env.REACT_APP_FUSEBIT_DEPLOYMENT,
        integrationId,
        connectorId,
        connectorName,
        defaultTenantId: getTenantId(),
      };
      newContent = Mustache.render(newContent, global, {}, customTags);
    } finally {
      Mustache.escape = oldEscape;
    }
    return newContent;
  };

  const getProviderVersion = (feed: Feed) => {
    // Determine provider's package version by assuming it is the same as the connector's
    // package version (given we version everything in fusebit/integrations in lockstep).
    // TODO: we need to explicitly model exposing the provider's name and version in the connector feed
    let providerVersion = '*';
    const connectorEntity = feed.configuration.entities[Object.keys(feed.configuration.entities)[0]];
    if (connectorEntity) {
      try {
        providerVersion = JSON.parse(connectorEntity.data.files['package.json']).version;
      } catch (_) {
        // empty
      }
    }
    return providerVersion;
  };

  return {
    error,
    snippets: snippetArray.length > 0 ? snippetArray : undefined,
    connectors: uniqueConnectors.length > 0 ? uniqueConnectors : undefined,
    formatSnippet,
    getProviderVersion,
  };
};

export default useSnippets;
